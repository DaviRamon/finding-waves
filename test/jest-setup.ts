// arquivo responsavel para iniciar os servidores para os testes funcionais.

import { SetupServer } from '@src/server';
import supertest from 'supertest';

let server :SetupServer;
beforeAll( async () => {
    server = new SetupServer();
    await server.init();
    global.testRequest = supertest(server.getApp());
});

/** termina a conexão com o banco de dados */
afterAll( async () => await server.close());
