import 'reflect-metadata';

/**
 * Decorator to mark a class as a Job
 */
export function LucidJob(name?: string) {
  return function (target: any) {
    Reflect.defineMetadata('lucid:type', 'job', target);
    Reflect.defineMetadata('lucid:name', name || target.name, target);
    return target;
  };
}

/**
 * Decorator to mark a class as a Feature
 */
export function LucidFeature(name?: string) {
  return function (target: any) {
    Reflect.defineMetadata('lucid:type', 'feature', target);
    Reflect.defineMetadata('lucid:name', name || target.name, target);
    return target;
  };
}

/**
 * Decorator to mark a class as a Service
 */
export function LucidService(name: string) {
  return function (target: any) {
    Reflect.defineMetadata('lucid:type', 'service', target);
    Reflect.defineMetadata('lucid:name', name, target);
    return target;
  };
}

/**
 * Decorator to mark a class as a Domain
 */
export function LucidDomain(name?: string) {
  return function (target: any) {
    Reflect.defineMetadata('lucid:type', 'domain', target);
    Reflect.defineMetadata('lucid:name', name || target.name, target);
    return target;
  };
}

/**
 * Get metadata from a class
 */
export function getLucidMetadata(target: any, key: string): any {
  return Reflect.getMetadata(`lucid:${key}`, target);
}

/**
 * Check if a class is a Lucid component
 */
export function isLucidComponent(target: any): boolean {
  return Reflect.hasMetadata('lucid:type', target);
}

/**
 * Get the type of a Lucid component
 */
export function getLucidType(target: any): string | undefined {
  return Reflect.getMetadata('lucid:type', target);
}

/**
 * Get the name of a Lucid component
 */
export function getLucidName(target: any): string | undefined {
  return Reflect.getMetadata('lucid:name', target);
}
