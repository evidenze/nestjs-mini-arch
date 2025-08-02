import { Injectable } from '@nestjs/common';

export interface RegisteredComponent {
  name: string;
  type: 'job' | 'feature' | 'service' | 'domain';
  class: any;
  metadata?: any;
}

@Injectable()
export class MiniRegistry {
  private components: Map<string, RegisteredComponent> = new Map();

  /**
   * Register a component in the registry
   */
  register(component: RegisteredComponent): void {
    const key = `${component.type}:${component.name}`;
    this.components.set(key, component);
  }

  /**
   * Get a component by type and name
   */
  get(type: string, name: string): RegisteredComponent | undefined {
    const key = `${type}:${name}`;
    return this.components.get(key);
  }

  /**
   * Get all components of a specific type
   */
  getByType(type: 'job' | 'feature' | 'service' | 'domain'): RegisteredComponent[] {
    return Array.from(this.components.values()).filter(
      (component) => component.type === type
    );
  }

  /**
   * Get all registered components
   */
  getAll(): RegisteredComponent[] {
    return Array.from(this.components.values());
  }

  /**
   * Check if a component is registered
   */
  has(type: string, name: string): boolean {
    const key = `${type}:${name}`;
    return this.components.has(key);
  }

  /**
   * Remove a component from the registry
   */
  remove(type: string, name: string): boolean {
    const key = `${type}:${name}`;
    return this.components.delete(key);
  }

  /**
   * Clear all components
   */
  clear(): void {
    this.components.clear();
  }
}
