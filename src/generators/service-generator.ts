import { writeFile, getOutputPath, toPascalCase, toKebabCase, GeneratorOptions } from './utils';
import * as path from 'path';

export function generateService(name: string, options: GeneratorOptions = {}): void {
  const className = toPascalCase(name) + 'Service';
  const kebabName = toKebabCase(name);
  const outputPath = getOutputPath('service', name, options);
  
  // Create service module
  const moduleFileName = `${kebabName}.module.ts`;
  const moduleFilePath = path.join(outputPath, moduleFileName);

  const moduleContent = `import { Module } from '@nestjs/common';
import { ${className} } from './${kebabName}.service';
import { ${className}Controller } from './${kebabName}.controller';

@Module({
  controllers: [${className}Controller],
  providers: [${className}],
  exports: [${className}],
})
export class ${className}Module {}
`;

  writeFile(moduleFilePath, moduleContent);

  // Create service class
  const serviceFileName = `${kebabName}.service.ts`;
  const serviceFilePath = path.join(outputPath, serviceFileName);

  const serviceContent = `import { Injectable } from '@nestjs/common';
import { Service, LucidService } from 'nest-lucid';

@Injectable()
@LucidService('${name}')
export class ${className} extends Service {
  getName(): string {
    return '${name}';
  }

  // Add your service methods here
  async findAll(): Promise<any[]> {
    // TODO: Implement find all logic
    return [];
  }

  async findOne(id: string): Promise<any> {
    // TODO: Implement find one logic
    return { id, name: 'Example' };
  }

  async create(data: any): Promise<any> {
    // TODO: Implement create logic
    return { id: 'generated-id', ...data };
  }

  async update(id: string, data: any): Promise<any> {
    // TODO: Implement update logic
    return { id, ...data };
  }

  async remove(id: string): Promise<void> {
    // TODO: Implement remove logic
  }
}
`;

  writeFile(serviceFilePath, serviceContent);

  // Create controller
  const controllerFileName = `${kebabName}.controller.ts`;
  const controllerFilePath = path.join(outputPath, controllerFileName);

  const controllerContent = `import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ${className} } from './${kebabName}.service';

@Controller('${kebabName}')
export class ${className}Controller {
  constructor(private readonly ${name.toLowerCase()}Service: ${className}) {}

  @Get()
  async findAll() {
    return this.${name.toLowerCase()}Service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.${name.toLowerCase()}Service.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.${name.toLowerCase()}Service.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.${name.toLowerCase()}Service.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.${name.toLowerCase()}Service.remove(id);
  }
}
`;

  writeFile(controllerFilePath, controllerContent);

  // Create test files
  const serviceTestContent = `import { Test, TestingModule } from '@nestjs/testing';
import { ${className} } from './${kebabName}.service';

describe('${className}', () => {
  let service: ${className};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [${className}],
    }).compile();

    service = module.get<${className}>(${className});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return service name', () => {
    expect(service.getName()).toBe('${name}');
  });
});
`;

  const serviceTestFilePath = path.join(outputPath, `${kebabName}.service.spec.ts`);
  writeFile(serviceTestFilePath, serviceTestContent);

  const controllerTestContent = `import { Test, TestingModule } from '@nestjs/testing';
import { ${className}Controller } from './${kebabName}.controller';
import { ${className} } from './${kebabName}.service';

describe('${className}Controller', () => {
  let controller: ${className}Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${className}Controller],
      providers: [${className}],
    }).compile();

    controller = module.get<${className}Controller>(${className}Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
`;

  const controllerTestFilePath = path.join(outputPath, `${kebabName}.controller.spec.ts`);
  writeFile(controllerTestFilePath, controllerTestContent);
}
