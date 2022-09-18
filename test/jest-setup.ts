// arquivo responsavel para iniciar os servidores para os testes funcionais.

import { SetupServer } from '@src/server';
import supertest from 'supertest';

beforeAll(() => {
    const server = new SetupServer();
    server.init();
    global.testRequest = supertest(server.getApp());
});
