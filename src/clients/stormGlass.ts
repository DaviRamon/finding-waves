import { InternalError } from '@src/util/errors/internal-error';
import { AxiosError } from 'axios';
import config, { IConfig } from 'config';
import * as HTTPUtil from '@src/util/request';

/** Interfaces que simulam os dados com os seus tipos da resposta da API externa */
export interface StormGlassPointSource {
    [key: string]: number;
}

export interface StormGlassPoint {
    readonly time: string;
    readonly swellDirection: StormGlassPointSource;
    readonly swellHeight: StormGlassPointSource;
    readonly swellPeriod: StormGlassPointSource;
    readonly waveDirection: StormGlassPointSource;
    readonly waveHeight: StormGlassPointSource;
    readonly windDirection: StormGlassPointSource;
    readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
    hours: StormGlassPoint[];
}

export interface ForecastPoint {
    time: string;
    waveHeight: number;
    waveDirection: number;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    windDirection: number;
    windSpeed: number;
}

/** Quando acontece algum erro interno na requisição esse método é chamado para retornar o erro genérico. Por padão é o 500 (ex: queda de conexão, etc) */
export class CLientRequestError extends InternalError {
    constructor(message: string) {
        const internalMessage =
            'Unexpected error when trying to communicate to StormGlass';
        super(`${internalMessage}: ${message}`);
    }
}

/** Caso caso seja atingido o limite de 20 reqs diárias da API, ela retorna um status 429 e esse erro será retornado.*/
export class StormGlassResponseError extends InternalError {
    constructor(message: string) {
        const internalMessage =
            'Unexpected error returned by the StormGlass service';
        super(`${internalMessage}: ${message}`);
    }
}

const stormGlassResourceConfig: IConfig = config.get(
    'App.resources.StormGlass'
); // é possivel passar o tipo para o get (ex: get<T>)

export class StormGlass {
    readonly stormGlassAPIParams =
        'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassAPISource = 'noaa';

    constructor(
        protected request = new HTTPUtil.Request()
    ) {} /**  subistitui o axios por uma Generics  */

    public async fetchPoints(
        lat: number,
        lng: number
    ): Promise<ForecastPoint[]> {
        try {
            let url = `${stormGlassResourceConfig.get(
                'apiUrl'
            )}/weather/point?params=${this.stormGlassAPIParams}&source=${
                this.stormGlassAPISource
            }&lat=${lat}&lng=${lng}`;

            /** O response do axios foi do o axios por uma Generics, protegendo assim as informações do AXIOS */
            const response = await this.request.get<StormGlassForecastResponse>(
                /** tipo esperado do retorno do GET é StormGlassForecastReponse */ url,
                {
                    headers: {
                        Authorization: stormGlassResourceConfig.get('apiToken'),
                    },
                }
            );

            return this.normalizeResponse(response.data);
        } catch (err: unknown) {
            if (
                (err as AxiosError).response &&
                (err as AxiosError).response?.data
            ) {
                throw new StormGlassResponseError(
                    `Error: ${JSON.stringify(
                        (err as AxiosError).response?.data
                    )} Code: ${(err as AxiosError).response?.status}`
                );
            }

            throw new CLientRequestError((err as Error).message);
        }
    }

    private normalizeResponse(
        points: StormGlassForecastResponse
    ): ForecastPoint[] {
        return points.hours
            .filter(this.isValidPoint.bind(this))
            .map((point) => ({
                swellDirection: point.swellDirection[this.stormGlassAPISource],
                swellHeight: point.swellHeight[this.stormGlassAPISource],
                swellPeriod: point.swellPeriod[this.stormGlassAPISource],
                time: point.time,
                waveDirection: point.waveDirection[this.stormGlassAPISource],
                waveHeight: point.waveHeight[this.stormGlassAPISource],
                windDirection: point.windDirection[this.stormGlassAPISource],
                windSpeed: point.windSpeed[this.stormGlassAPISource],
            }));
    }

    /** verifica se todos os objetos da resposta foram checkados só da true se todos estiverem ok. do contrário descarta o ponto*/
    private isValidPoint(point: Partial<StormGlassPoint>): boolean {
        return !!(
            /** o  < !! > força para que o retorno seja BOOLEAN */
            (
                point.time &&
                point.swellDirection?.[this.stormGlassAPISource] &&
                point.swellHeight?.[this.stormGlassAPISource] &&
                point.swellPeriod?.[this.stormGlassAPISource] &&
                point.waveDirection?.[this.stormGlassAPISource] &&
                point.waveHeight?.[this.stormGlassAPISource] &&
                point.windDirection?.[this.stormGlassAPISource] &&
                point.windSpeed?.[this.stormGlassAPISource]
            )
        );
    }
}
