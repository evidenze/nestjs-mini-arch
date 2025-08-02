import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { toKebabCase, toPascalCase } from './utils';

export interface ProjectGeneratorOptions {
  directory?: string;
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  skipInstall?: boolean;
}

export function generateProject(name: string, options: ProjectGeneratorOptions = {}) {
  const projectName = toKebabCase(name);
  const className = toPascalCase(name);
  const targetDir = options.directory || process.cwd();
  const projectPath = path.join(targetDir, projectName);
  const packageManager = options.packageManager || 'npm';

  console.log(`🚀 Creating new Mini project: ${projectName}`);
  
  try {
    // Create project directory
    if (fs.existsSync(projectPath)) {
      throw new Error(`Directory ${projectName} already exists`);
    }
    
    fs.mkdirSync(projectPath, { recursive: true });
    process.chdir(projectPath);

    console.log('📦 Initializing new NestJS project...');
    
    // Initialize package.json
    const packageJson = {
      name: projectName,
      version: '0.0.1',
      description: `A Mini-powered NestJS application`,
      author: '',
      private: true,
      license: 'UNLICENSED',
      scripts: {
        build: 'nest build',
        format: 'prettier --write "src/**/*.ts" "test/**/*.ts"',
        start: 'nest start',
        'start:dev': 'nest start --watch',
        'start:debug': 'nest start --debug --watch',
        'start:prod': 'node dist/main',
        lint: 'eslint "{src,apps,libs,test}/**/*.ts" --fix',
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:cov': 'jest --coverage',
        'test:debug': 'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
        'test:e2e': 'jest --config ./test/jest-e2e.json'
      },
      dependencies: {
        '@nestjs/common': '^10.0.0',
        '@nestjs/core': '^10.0.0',
        '@nestjs/platform-express': '^10.0.0',
        'nestjs-mini-arch': '^1.1.1',
        'reflect-metadata': '^0.1.13',
        'rxjs': '^7.8.1'
      },
      devDependencies: {
        '@nestjs/cli': '^10.0.0',
        '@nestjs/schematics': '^10.0.0',
        '@nestjs/testing': '^10.0.0',
        '@types/express': '^4.17.17',
        '@types/jest': '^29.5.2',
        '@types/node': '^20.3.1',
        '@types/supertest': '^2.0.12',
        '@typescript-eslint/eslint-plugin': '^6.0.0',
        '@typescript-eslint/parser': '^6.0.0',
        'eslint': '^8.42.0',
        'eslint-config-prettier': '^9.0.0',
        'eslint-plugin-prettier': '^5.0.0',
        'jest': '^29.5.0',
        'prettier': '^3.0.0',
        'source-map-support': '^0.5.21',
        'supertest': '^6.3.3',
        'ts-jest': '^29.1.0',
        'ts-loader': '^9.4.3',
        'ts-node': '^10.9.1',
        'tsconfig-paths': '^4.2.0',
        'typescript': '^5.1.3'
      },
      jest: {
        moduleFileExtensions: ['js', 'json', 'ts'],
        rootDir: 'src',
        testRegex: '.*\\.spec\\.ts$',
        transform: {
          '^.+\\.(t|j)s$': 'ts-jest'
        },
        collectCoverageFrom: ['**/*.(t|j)s'],
        coverageDirectory: '../coverage',
        testEnvironment: 'node',
        moduleNameMapper: {
          '^@/(.*)$': '<rootDir>/$1'
        }
      }
    };

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    // Create TypeScript configuration
    const tsConfig = {
      compilerOptions: {
        module: 'commonjs',
        declaration: true,
        removeComments: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        target: 'ES2021',
        sourceMap: true,
        outDir: './dist',
        baseUrl: './',
        incremental: true,
        skipLibCheck: true,
        strictNullChecks: false,
        noImplicitAny: false,
        strictBindCallApply: false,
        forceConsistentCasingInFileNames: false,
        noFallthroughCasesInSwitch: false,
        paths: {
          '@/*': ['src/*']
        }
      }
    };

    fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2));

    // Create build config
    const tsConfigBuild = {
      extends: './tsconfig.json',
      exclude: ['node_modules', 'test', 'dist', '**/*spec.ts']
    };

    fs.writeFileSync('tsconfig.build.json', JSON.stringify(tsConfigBuild, null, 2));

    // Create NestJS CLI config
    const nestCliConfig = {
      $schema: 'https://json.schemastore.org/nest-cli',
      collection: '@nestjs/schematics',
      sourceRoot: 'src',
      compilerOptions: {
        deleteOutDir: true
      }
    };

    fs.writeFileSync('nest-cli.json', JSON.stringify(nestCliConfig, null, 2));

    // Create source directory structure
    fs.mkdirSync('src', { recursive: true });
    fs.mkdirSync('src/services', { recursive: true });
    fs.mkdirSync('src/domains', { recursive: true });
    fs.mkdirSync('test', { recursive: true });

    // Create main.ts
    const mainContent = `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('🚀 Mini application is running on: http://localhost:3000');
}
bootstrap();
`;

    fs.writeFileSync('src/main.ts', mainContent);

    // Create app.module.ts with Mini integration
    const appModuleContent = `import { Module } from '@nestjs/common';
import { MiniModule } from 'nestjs-mini-arch';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MiniModule.forRoot({
      autoRegister: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
`;

    fs.writeFileSync('src/app.module.ts', appModuleContent);

    // Create app.controller.ts
    const appControllerContent = `import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      framework: 'Mini',
      timestamp: new Date().toISOString(),
    };
  }
}
`;

    fs.writeFileSync('src/app.controller.ts', appControllerContent);

    // Create app.service.ts
    const appServiceContent = `import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello from Mini! 🎯 Your NestJS application is ready with clean architecture.';
  }
}
`;

    fs.writeFileSync('src/app.service.ts', appServiceContent);

    // Create test files
    const appControllerSpecContent = `import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello from Mini!"', () => {
      expect(appController.getHello()).toContain('Hello from Mini!');
    });
  });
});
`;

    fs.writeFileSync('test/app.e2e-spec.ts', appControllerSpecContent);

    // Create e2e test config
    const jestE2eConfig = {
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: '.',
      testEnvironment: 'node',
      testRegex: '.e2e-spec.ts$',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
      }
    };

    fs.writeFileSync('test/jest-e2e.json', JSON.stringify(jestE2eConfig, null, 2));

    // Create README.md
    const readmeContent = `# ${className}

A [NestJS](https://nestjs.com/) application built with the [Mini](https://www.npmjs.com/package/nestjs-mini-arch) clean architecture framework.

## Description

This project was generated using the Mini CLI and includes:

- 🏗️ Clean architecture with Jobs, Features, Services, and Domains
- 🚀 NestJS framework with TypeScript
- 🎯 Mini framework for organized code structure
- 🧪 Testing setup with Jest
- 📝 ESLint and Prettier for code quality

## Installation

\`\`\`bash
$ ${packageManager} install
\`\`\`

## Running the app

\`\`\`bash
# development
$ ${packageManager} run start

# watch mode
$ ${packageManager} run start:dev

# production mode
$ ${packageManager} run start:prod
\`\`\`

## Test

\`\`\`bash
# unit tests
$ ${packageManager} run test

# e2e tests
$ ${packageManager} run test:e2e

# test coverage
$ ${packageManager} run test:cov
\`\`\`

## Mini CLI Commands

Generate components using the Mini CLI:

\`\`\`bash
# Generate a new service
$ mini generate:service UserService

# Generate a new job
$ mini generate:job SendEmail --service notification

# Generate a new feature
$ mini generate:feature UserRegistration --service user

# Generate a new domain
$ mini generate:domain UserValidation
\`\`\`

## Project Structure

\`\`\`
src/
├── app.module.ts          # Main application module with Mini setup
├── app.controller.ts      # Application controller
├── app.service.ts         # Application service
├── main.ts               # Application entry point
├── services/             # Business services
│   └── example/          # Example service directory
│       ├── example.module.ts
│       ├── example.controller.ts
│       ├── example.service.ts
│       ├── jobs/         # Service-specific jobs
│       └── features/     # Service-specific features
└── domains/              # Shared business logic
    └── example/          # Example domain directory
\`\`\`

## Learn More

- [Mini Framework Documentation](https://github.com/evidenze/nestjs-mini-arch)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Mini Architecture Guide](https://github.com/evidenze/nestjs-mini-arch/blob/main/docs/ARCHITECTURE.md)

## Stay in touch

- Framework Author - [Essien Ekanem](https://github.com/evidenze)
- Mini Repository - [https://github.com/evidenze/nestjs-mini-arch](https://github.com/evidenze/nestjs-mini-arch)

## License

This project is [MIT licensed](LICENSE).
`;

    fs.writeFileSync('README.md', readmeContent);

    // Create .gitignore
    const gitignoreContent = `# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out
storybook-static

# Temporary folders
tmp/
temp/

# Editor directories and files
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;

    fs.writeFileSync('.gitignore', gitignoreContent);

    // Create .eslintrc.js
    const eslintConfig = `module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    '@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
`;

    fs.writeFileSync('.eslintrc.js', eslintConfig);

    // Create .prettierrc
    const prettierConfig = {
      singleQuote: true,
      trailingComma: 'all'
    };

    fs.writeFileSync('.prettierrc', JSON.stringify(prettierConfig, null, 2));

    console.log('📁 Project structure created successfully!');

    // Install dependencies if not skipped
    if (!options.skipInstall) {
      console.log(`📦 Installing dependencies with ${packageManager}...`);
      try {
        const installCommand = packageManager === 'yarn' ? 'yarn install' : 
                              packageManager === 'pnpm' ? 'pnpm install' : 
                              'npm install';
        execSync(installCommand, { stdio: 'inherit' });
        console.log('✅ Dependencies installed successfully!');
      } catch (error) {
        console.warn('⚠️  Failed to install dependencies automatically. Please run the install command manually.');
      }
    }

    console.log(`
🎉 Project ${projectName} created successfully!

Next steps:
  cd ${projectName}
  ${options.skipInstall ? `${packageManager} install` : ''}
  ${packageManager} run start:dev

Your Mini-powered NestJS application is ready! 🚀

Available commands:
  mini generate:service <name>     # Generate a new service
  mini generate:job <name>         # Generate a new job
  mini generate:feature <name>     # Generate a new feature
  mini generate:domain <name>      # Generate a new domain

Visit http://localhost:3000 when the app is running.
`);

  } catch (error) {
    console.error('❌ Error creating project:', error.message);
    // Clean up on error
    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true, force: true });
    }
    process.exit(1);
  }
}
