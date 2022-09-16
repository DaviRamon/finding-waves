import { ForecastPoint, StormGlass } from "@src/clients/stormGlass";

/** se houver a necessidade de alterar algum valor, alteramos somente aqui */
export enum BeachPosition { /** pontos cardeais em inglês*/
     S = 'S',
     E = 'E',
     W = 'W',
     N = 'N'

}

export interface Beach {
     name: string;
     position: BeachPosition
     lat: number;
     lng: number;
     user: string;
}

/** interface criada apenas com o objetivo de criar um TIPO para o retorno da classe Forecast */
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint { /** o OMIT, esconde (omite) o campo (user) da classe que foi extendida (Beach)  */

}

export class Forecast {
     constructor(protected stormGlass = new StormGlass()) { } /**  se receber outra instancia do stormGlass ele irá usar essa nova instancia (substituindo dependência) */

     public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]> {

          const pointsWithCorrectSource: BeachForecast[] = [];
          for (const beach of beaches) {
               const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
               const enrichedBeachData = points.map((responsePoints) => ({ 
                    ...{ /** esses dados são adicionados aos dados que vem da PRAIA escolhida pelas cooderdanadas. */
                         lat: beach.lat,
                         lng: beach.lng,
                         name: beach.name,
                         position: beach.position,
                         rating: 1
                    },
                    ...responsePoints,
               }));
               pointsWithCorrectSource.push(...enrichedBeachData);
          }
          return pointsWithCorrectSource;
     }
}