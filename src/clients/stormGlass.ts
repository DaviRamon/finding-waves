import { AxiosStatic } from "axios";

export class StormGlass {
     
     constructor(protected request: AxiosStatic){}

     public async fetchPoints(lat:number, lng:number):Promise<{}> {
          let url = `https://api.stormglass.io/v2/weather/point?params=swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed&source=noaa&lat=${lat}&lng=${lng}`
          return this.request.get(url);
 
     }

}