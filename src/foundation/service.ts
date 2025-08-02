import { Module } from '@nestjs/common';

/**
 * Base Service class for all services in the Mini architecture
 * Services represent bounded contexts or business domains
 */
@Module({})
export abstract class Service {
  /**
   * Get the service name
   */
  abstract getName(): string;

  /**
   * Configure the service module
   */
  static forRoot(config?: any): any {
    return {
      module: this,
      providers: config?.providers || [],
      controllers: config?.controllers || [],
      imports: config?.imports || [],
      exports: config?.exports || [],
    };
  }
}

/**
 * Decorator to mark a class as a Service
 */
export function ServiceHandler(config: {
  name: string;
  providers?: any[];
  controllers?: any[];
  imports?: any[];
  exports?: any[];
}) {
  return function (target: any) {
    Reflect.defineMetadata('service:name', config.name, target);
    Reflect.defineMetadata('service:config', config, target);
    
    return Module({
      providers: config.providers || [],
      controllers: config.controllers || [],
      imports: config.imports || [],
      exports: config.exports || [],
    })(target);
  };
}
