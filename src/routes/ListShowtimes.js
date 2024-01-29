import { getMovieByTitle, getShowtimesForMovie } from "#src/Directus.js";
import { Input, NCCOBuilder, Talk } from '@vonage/voice'
import { getDomain } from "#src/Utils.js";

export default function(router) {
    router.post('/list_showtimes', async (req, res) => {
        const builder = new NCCOBuilder();

        const movie = await getMovieByTitle(req.body.speech.results[0].text);
        console.log(movie);
        const availableShowtimes = await getShowtimesForMovie(movie.id);

        let message = "<speak>Here are the upcoming showtimes we have: ";
        let counter = 1;
        for (let showtime of availableShowtimes) {
            message += `${counter}<break time='1s' /> ${showtime.start_time}<break time='2s' />`;
        }
        message += "Which showtime would you like a ticket for?</speak>"

        const domain = getDomain(req);
        return res.send(
            builder
                .addAction(new Talk(message))
                .addAction(new Input(
                    null,
                    {
                        'context': ['one', 'two', 'three', 'four', 'five']
                    },
                    `${domain}/accept_showtimes?movie_id=${movie.id}`))
                .build()
        );
    });
    return router;
}