const Hapi = require('@hapi/hapi');
const router = require('./router');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    server.route(router);
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
