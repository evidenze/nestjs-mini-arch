import { Injectable } from '@nestjs/common';

/**
 * Base Domain class for shared business logic across services
 * Domains contain business rules and logic that can be reused
 */
@Injectable()
export abstract class Domain {
  /**
   * Get the domain name
   */
  abstract getName(): string;
}

/**
 * Decorator to mark a class as a Domain
 */
export function DomainHandler(name?: string) {
  return function (target: any) {
    Reflect.defineMetadata('domain:name', name || target.name, target);
    return Injectable()(target);
  };
}
