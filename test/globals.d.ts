// declare namespace NodeJS {
//      interface Global {
//           testRequest: import('supertest').SuperTest<import('supertest').Test>
//      }
// }

declare global {
    var testRequest: import('supertest').SuperTest<import('supertest').Test>;
}

export {};
