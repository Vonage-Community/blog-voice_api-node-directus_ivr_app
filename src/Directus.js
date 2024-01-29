import { createDirectus, readUsers, rest, staticToken, readItems } from "@directus/sdk";

export function getDirectusClient() {
    return createDirectus(process.env.DIRECTUS_INSTANCE)
        .with(staticToken(process.env.DIRECTUS_TOKEN))
        .with(rest());
}

export async function getUserFromPhone(phone) {
    const directus = getDirectusClient();
    const users = await directus.request(readUsers({
        'filter': {
            'phone': {
                '_eq': phone,
            }
        }
    }));

    if (users.length === 1) {
        return users[0];
    }

    return null;
}

export async function getUpcomingMovies() {
    const directus = getDirectusClient();
    return await directus.request(readItems(
        'showtimes',
        {
            'fields': [
                'movie_id.*.*'
            ],
            'sort': [
                'start_time'
            ],
            'filter': [
                {
                    'start_time': {
                        '_gt': new Date().toISOString()
                    }
                }
            ]
        }
    ));
}

export async function getMovieByTitle(title) {
    const directus = getDirectusClient();
    const movies = await directus.request(readItems(
        'movies',
        {
            'filter': {
                'title': {
                    '_icontains': title
                }
            }
        }
    ));

    return movies[0];
}

export async function getShowtimesForMovie(movieID) {
    const directus = getDirectusClient();
    return await directus.request(readItems(
        'showtimes',
        {
            'fields': [
                'id',
                'movie_id.*.*',
                'start_time'
            ],
            'sort': [
                'start_time'
            ],
            'filter': {
                'movie_id': {
                    '_eq': movieID
                }
            }
        }
    ));
}