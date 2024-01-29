import { getUpcomingMovies } from "#src/Directus.js";
import { Input, NCCOBuilder, Talk } from '@vonage/voice'
import { getDomain } from "#src/Utils.js";

export default function(router) {
    router.post('/list_movies', async (req, res) => {
        const builder = new NCCOBuilder();

        const availableMovies = await getUpcomingMovies();
        const movies = availableMovies.map((showtime) => {
            return showtime.movie_id.title;
        });

        let message = "<speak>Here are the upcoming movies we have: <break time='1s' />";
        for (let movie of movies) {
            message += `${movie}<break time='1s' />`;
        }
        message += "Which movie would you like to hear showtimes for?</speak>"

        const domain = getDomain(req);
        return res.send(
            builder
                .addAction(new Talk(message))
                .addAction(new Input(
                    null,
                    {
                        'context': movies
                    },
                    `${domain}/list_showtimes`))
                .build()
        );
    });
    return router;
}