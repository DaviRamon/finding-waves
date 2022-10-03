import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { Beach } from '@src/models/beach';
import { InternalError } from '@src/util/errors/internal-error';

export interface TimeForecast {
    time: string;
    forecast: BeachForecast[];
}

/** interface criada apenas com o objetivo de criar um TIPO para o retorno da classe Forecast */
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {
    /** o OMIT, esconde (omite) o campo (user) da classe que foi extendida (Beach)  */
}

export class ForecastProcessingInternalError extends InternalError {
    constructor(message: string) {
        super(`Unexpected error during the forecast processing: ${message}`);
    }
}

/** interface para retornar o formato correto do objeto com as informações das praias */
export class Forecast {
    constructor(
        protected stormGlass = new StormGlass()
    ) {} /**  se receber outra instancia do stormGlass ele irá usar essa nova instancia (substituindo dependência) */

    public async processForecastForBeaches(
        beaches: Beach[]
    ): Promise<TimeForecast[]> {
        const pointsWithCorrectSource: BeachForecast[] = [];

        try {
            for (const beach of beaches) {
                const points = await this.stormGlass.fetchPoints(
                    beach.lat,
                    beach.lng
                );
                const enrichedBeachData = await this.enrichedBeachData(
                    points,
                    beach
                );
                pointsWithCorrectSource.push(...enrichedBeachData);
            }
            return this.mapForecastByTime(pointsWithCorrectSource);
        } catch (error) {
            throw new ForecastProcessingInternalError((error as Error).message);
        }
    }

    private enrichedBeachData(
        points: ForecastPoint[],
        beach: Beach
    ): BeachForecast[] {
        return points.map((e) => ({
            ...{
                /** esses dados são adicionados aos dados que vem da PRAIA escolhida pelas cooderdanadas. */
                lat: beach.lat,
                lng: beach.lng,
                name: beach.name,
                position: beach.position,
                rating: 1,
            },
            ...e,
        }));
    }

    private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
        const forecastByeTime: TimeForecast[] = [];
        for (let point of forecast) {
            const timePoint = forecastByeTime.find((f) => f.time == point.time);
            if (timePoint) {
                timePoint.forecast.push(point);
            } else {
                forecastByeTime.push({
                    time: point.time,
                    forecast: [point],
                });
            }
        }
        return forecastByeTime;
    }
}
