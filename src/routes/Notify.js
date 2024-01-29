import { Input, NCCOBuilder, Talk } from '@vonage/voice'
import { getDomain } from "#src/Utils.js";

export default function(router) {
    router.all('/notify', async (req, res) => {
        const builder = new NCCOBuilder();
 
        const domain = getDomain(req);
        return res.send(
            builder
                .addAction(new Talk('What else can we help you with?'))
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