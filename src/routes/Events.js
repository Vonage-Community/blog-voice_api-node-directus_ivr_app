export default function(router) {
    router.all('/events', async (req, res) => {
        console.log(req.body);
        return res.send(200);
    });
    return router;
}