import { Controller, Get } from '@overnightjs/core';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Request, Response } from 'express';

const forecast = new Forecast();

@Controller('forecast') // rota /forecast quando iniciar a API
export class ForecastController {
    @Get('')
    public async getForecastForLoggeduser(_: Request, res: Response): Promise<void> {
        const beaches = await Beach.find({});
        const forecastData = await forecast.processForecastForBeaches(beaches);
        res.status(200).send(forecastData);
    }
}
