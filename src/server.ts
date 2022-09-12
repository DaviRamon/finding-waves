import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';

export class SetupServer extends Server {

     constructor(private port = 6000) {
          super(); // extendendo a classe Server
     };

     public init(): void {
          this.setupExpress();
          this.setupControllers();
     }

     private setupExpress(): void {
          this.app.use(bodyParser.json());
     }

     private setupControllers (): void {
          const forecastController = new ForecastController();
          this.addControllers([forecastController]);
     }
};
