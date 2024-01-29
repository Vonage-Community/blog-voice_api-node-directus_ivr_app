import { NCCOBuilder, Talk, Notify } from '@vonage/voice'
import { getDirectusClient } from "#src/Directus.js";
import { deleteItem } from "@directus/sdk";
import { getDomain } from '#src/Utils.js';

export default function(router) {
    router.post('/confirm_cancel', async (req, res) => {
        const builder = new NCCOBuilder();

        if (req.body.speech.results[0].text === 'yes') {
            const directus = getDirectusClient();
            directus.request(deleteItem('tickets', req.query.id));

            builder
                .addAction(new Talk('We have removed your ticket'))
                .build();
        }

        builder.addAction(new Notify(
            {
                action: 'restart',
                from: req.body.from,
            },
            `${getDomain(req)}/notify`
        ));
        return res.send(builder.build());
    });
    return router;
}