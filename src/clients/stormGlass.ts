import { AxiosStatic } from "axios";

export class StormGlass {

     readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
     readonly stormGlassAPISource ='noaa'
     constructor(protected request: AxiosStatic){}

     public async fetchPoints(lat:number, lng:number):Promise<{}> {
          let url = `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}`
          return this.request.get(url);
     }

}