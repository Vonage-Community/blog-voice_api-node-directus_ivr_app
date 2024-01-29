import { getDirectusClient, getShowtimesForMovie, getUserFromPhone } from "#src/Directus.js";
import { createItem } from "@directus/sdk";
import { Notify, NCCOBuilder, Talk } from '@vonage/voice'
import { getDomain } from "#src/Utils.js";

function wordToNumber(word) {
    switch(word.toLowerCase()) {
        case 'one':
            return 0;
            break;
        case 'two':
            return 1;
            break;
        case 'three':
            return 2;
            break;
        case 'four':
            return 3;
            break;
        case 'five':
            return 4;
            break;
    }
}

export default function(router) {
    router.post('/accept_showtimes', async (req, res) => {
        const builder = new NCCOBuilder();
        const directus = getDirectusClient();

        const movieID = req.query.movie_id;
        const availableShowtimes = await getShowtimesForMovie(movieID);
        const selectedOption = wordToNumber(req.body.speech.results[0].text);
        const currentUser = await getUserFromPhone(req.body.from);

        await directus.request(createItem(
            'tickets',
            {
                'showtime_id': availableShowtimes[selectedOption].id,
                'user': currentUser.id
            }
        ));

        return res.send(
            builder
                .addAction(new Talk('Thanks. We have booked your ticket.'))
                .addAction(new Notify(
                    {
                        action: 'restart',
                        from: req.body.from,
                    },
                    `${getDomain(req)}/notify`
                ))
                .build()
        );
    });
    return router;
}