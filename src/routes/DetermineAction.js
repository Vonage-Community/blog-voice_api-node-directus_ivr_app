import { Input, NCCOBuilder, Talk, Notify } from '@vonage/voice'
import { getDirectusClient, getUserFromPhone } from "#src/Directus.js";
import { readItems } from "@directus/sdk";
import { getDomain } from "#src/Utils.js";
import { getVonageClient } from '#src/Vonage.js';

export default function(router) {
    router.post('/determine_action', async (req, res) => {
        const builder = new NCCOBuilder();

        if (req.body.speech?.results[0].text === 'cancel ticket') {
            const directus = getDirectusClient();
            const user = await getUserFromPhone(req.body.from);
            const tickets = await directus.request(readItems(
                'tickets',
                {
                    'fields': [
                        'id',
                        'showtime_id.*.*'
                    ],
                    'sort': [
                        'showtime_id.start_time'
                    ],
                    'filter': {
                        'user': {
                            '_eq': user.id
                        }
                    }
                }
            ));

            if (tickets.length === 0) {
                builder
                    .addAction(new Talk('We do not see any tickets for you at the moment. Would you like to hear a list of available movies to purchase a ticket?'))
                    .addAction(new Input(
                        null,
                        {
                            'context': ['yes', 'no']
                        },
                        `${getDomain(req)}/list_movies`)
                    )
            } else if (tickets.length === 1) {
                builder
                    .addAction(new Talk(`Would you like to cancel your ticket for ${tickets[0].showtime_id.movie_id.title}?`))
                    .addAction(new Input(
                        null,
                        {
                            'context': ['yes', 'no']
                        },
                        `${getDomain(req)}/confirm_cancel?id=${tickets[0].id}`)
                    )
            } else {
                // Ask which upcoming tickets to cancel
            }
        } else if (req.body.speech.results[0].text === 'buy ticket') {
            builder
                .addAction(new Talk('Would you like to hear a list of available movies to purchase a ticket?'))
                .addAction(new Input(
                    null,
                    {
                        'context': ['yes', 'no']
                    },
                    `${getDomain(req)}/list_movies`)
                )
        } else {
            builder.addAction(new Talk('Sorry, I do not understand what you would like to do.'));
            builder.addAction(new Notify(
                {
                    action: 'restart',
                    from: req.body.from,
                },
                `${getDomain(req)}/notify`
            ));
        }

        return res.send(builder.build());
    });
    return router;
}