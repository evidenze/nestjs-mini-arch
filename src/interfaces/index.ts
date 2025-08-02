export interface JobInterface {
  handle(data?: any): Promise<any> | any;
}

export interface FeatureInterface {
  handle(data?: any): Promise<any> | any;
}

export interface ServiceInterface {
  getName(): string;
}

export interface DomainInterface {
  getName(): string;
}

export interface LucidConfig {
  services?: any[];
  domains?: any[];
  jobs?: any[];
  features?: any[];
  autoRegister?: boolean;
}

export interface JobResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: any;
}

export interface FeatureResult<T = any> {
  success: boolean;
  data?: T;
  jobs?: JobResult[];
  error?: string;
  metadata?: any;
}
