import { getDirectusClient, getUserFromPhone } from "#src/Directus.js";
import { Input, NCCOBuilder, Talk } from '@vonage/voice'
import { readItems, readUsers } from "@directus/sdk";
import { getDomain } from "#src/Utils.js";

export default function(router) {
    router.post('/', async (req, res) => {
        const builder = new NCCOBuilder();
        const directus = getDirectusClient();

        const user = await getUserFromPhone(req.body.from);
        const tickets = await directus.request(readItems(
            'tickets',
            {
                'fields': [
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

        let openingMessage = "Welcome! What can we help you with?";

        if (tickets.length > 0) {
            const startTime = new Date(tickets[0].showtime_id.start_time);
            const timeString = `${startTime.getFullYear()} ${startTime.getMonth() + 1} ${startTime.getDay()} at ${startTime.getHours()} ${startTime.getMinutes()}`;
            openingMessage = `Welcome back! We look forward to seeing you on ${timeString} for ${tickets[0].showtime_id.movie_id.title}. What can we help you with?`;
        }

        const domain = getDomain(req);
        return res.send(
            builder
                .addAction(new Talk(openingMessage))
                .addAction(new Input(
                    null,
                    {
                        'context': ['cancel ticket']
                    },
                    `${domain}/determine_action`))
                .build()
        );
    });
    return router;
}