import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';

export class SetupServer extends Server {

     constructor(private port = 6000) {
          super(); // extendendo a classe Server
     };

     public init(): void {
          this.setupExpress();
     }

     private setupExpress(): void {
          this.app.use(bodyParser.json());
     }
};

