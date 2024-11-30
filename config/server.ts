export const channel = 'reload-extension'

export const server = Bun.serve({
    fetch(req, server) {
        const url = new URL(req.url)

        if (url.pathname === '/listen') {
            const upgraded = server.upgrade(req)

            if (!upgraded) {
                return new Response('Upgrade failed', { status: 400 })
            }
        }
        return new Response('Hello, world!')
    },
    websocket: {
        open(ws) {
            ws.subscribe(channel)
        },
        message(_, message) {
            server.publish(channel, message)
        },
        close(ws) {
            ws.unsubscribe(channel)
        },
    },
    port: 8080,
})
