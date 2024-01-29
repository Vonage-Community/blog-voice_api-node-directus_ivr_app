export function getDomain(req) {
    return `https${req.secure ? 's' : ''}://${req.get('host')}`;
}