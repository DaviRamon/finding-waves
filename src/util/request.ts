import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface RequestConfig extends AxiosRequestConfig {} // o comando acima quebra a regra não poder haver interface vazia. 
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Response<T = any> extends AxiosResponse<T> {} // o comando acima quebra a regra não poder haver interface com <any>. 

export class Request {
  constructor(private request = axios) {}
  public get<T>(url:string, config: RequestConfig = {}): Promise<Response<T>> {
     return this.request.get<T, Response<T>>(url, config);
  }
}


/** 
 * 
 * 
 * 
 * MINuNTO 12:15 DO VIDEO 
 * 
 * 
 * 
 * 
 * */