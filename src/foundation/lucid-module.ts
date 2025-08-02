import { DynamicModule, Global, Module } from '@nestjs/common';
import { LucidRegistry } from './lucid-registry';

export interface LucidModuleOptions {
  services?: any[];
  domains?: any[];
  autoRegister?: boolean;
}

@Global()
@Module({})
export class LucidModule {
  static forRoot(options: LucidModuleOptions = {}): DynamicModule {
    const providers = [
      LucidRegistry,
      ...(options.services || []),
      ...(options.domains || []),
    ];

    return {
      module: LucidModule,
      providers,
      exports: providers,
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<LucidModuleOptions> | LucidModuleOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: LucidModule,
      providers: [
        {
          provide: 'LUCID_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        LucidRegistry,
      ],
      exports: [LucidRegistry],
      global: true,
    };
  }
}
