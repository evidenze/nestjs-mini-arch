import { DynamicModule, Global, Module } from '@nestjs/common';
import { MiniRegistry } from './mini-registry';

export interface MiniModuleOptions {
  services?: any[];
  domains?: any[];
  autoRegister?: boolean;
}

@Global()
@Module({})
export class MiniModule {
  static forRoot(options: MiniModuleOptions = {}): DynamicModule {
    const providers = [
      MiniRegistry,
      ...(options.services || []),
      ...(options.domains || []),
    ];

    return {
      module: MiniModule,
      providers,
      exports: providers,
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<MiniModuleOptions> | MiniModuleOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: MiniModule,
      providers: [
        {
          provide: 'MINI_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        MiniRegistry,
      ],
      exports: [MiniRegistry],
      global: true,
    };
  }
}
