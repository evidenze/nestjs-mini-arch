import 'reflect-metadata';

/**
 * Decorator to mark a class as a Job
 */
export function MiniJob(name?: string) {
  return function (target: any) {
    Reflect.defineMetadata('mini:type', 'job', target);
    Reflect.defineMetadata('mini:name', name || target.name, target);
    return target;
  };
}

/**
 * Decorator to mark a class as a Feature
 */
export function MiniFeature(name?: string) {
  return function (target: any) {
    Reflect.defineMetadata('mini:type', 'feature', target);
    Reflect.defineMetadata('mini:name', name || target.name, target);
    return target;
  };
}

/**
 * Decorator to mark a class as a Service
 */
export function MiniService(name: string) {
  return function (target: any) {
    Reflect.defineMetadata('mini:type', 'service', target);
    Reflect.defineMetadata('mini:name', name, target);
    return target;
  };
}

/**
 * Decorator to mark a class as a Domain
 */
export function MiniDomain(name?: string) {
  return function (target: any) {
    Reflect.defineMetadata('mini:type', 'domain', target);
    Reflect.defineMetadata('mini:name', name || target.name, target);
    return target;
  };
}

/**
 * Get metadata from a class
 */
export function getMiniMetadata(target: any, key: string): any {
  return Reflect.getMetadata(`mini:${key}`, target);
}

/**
 * Check if a class is a Mini component
 */
export function isMiniComponent(target: any): boolean {
  return Reflect.hasMetadata('mini:type', target);
}

/**
 * Get the type of a Mini component
 */
export function getMiniType(target: any): string | undefined {
  return Reflect.getMetadata('mini:type', target);
}

/**
 * Get the name of a Mini component
 */
export function getMiniName(target: any): string | undefined {
  return Reflect.getMetadata('mini:name', target);
}
