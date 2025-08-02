import { writeFile, getOutputPath, toPascalCase, GeneratorOptions } from './utils';
import * as path from 'path';

export function generateDomain(name: string, options: GeneratorOptions = {}): void {
  const className = toPascalCase(name) + 'Domain';
  const fileName = `${name.toLowerCase()}.domain.ts`;
  const outputPath = getOutputPath('domain', name, options);
  const filePath = path.join(outputPath, fileName);

  const content = `import { Injectable } from '@nestjs/common';
import { Domain, MiniDomain } from 'nestjs-mini-arch';

@Injectable()
@MiniDomain('${name}')
export class ${className} extends Domain {
  getName(): string {
    return '${name}';
  }

  // Add your domain business logic here
  
  /**
   * Example business rule validation
   */
  validateBusinessRule(data: any): boolean {
    // TODO: Implement business rule validation
    return true;
  }

  /**
   * Example domain calculation
   */
  calculateSomething(input: number): number {
    // TODO: Implement domain calculation
    return input * 2;
  }

  /**
   * Example domain transformation
   */
  transformData(data: any): any {
    // TODO: Implement data transformation
    return {
      ...data,
      transformed: true,
      timestamp: new Date(),
    };
  }
}
`;

  writeFile(filePath, content);
  
  // Generate test file
  const testContent = `import { Test, TestingModule } from '@nestjs/testing';
import { ${className} } from './${name.toLowerCase()}.domain';

describe('${className}', () => {
  let domain: ${className};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [${className}],
    }).compile();

    domain = module.get<${className}>(${className});
  });

  it('should be defined', () => {
    expect(domain).toBeDefined();
  });

  it('should return domain name', () => {
    expect(domain.getName()).toBe('${name}');
  });

  it('should validate business rule', () => {
    const result = domain.validateBusinessRule({});
    expect(result).toBe(true);
  });

  it('should calculate correctly', () => {
    const result = domain.calculateSomething(5);
    expect(result).toBe(10);
  });

  it('should transform data', () => {
    const input = { test: 'data' };
    const result = domain.transformData(input);
    
    expect(result.test).toBe('data');
    expect(result.transformed).toBe(true);
    expect(result.timestamp).toBeInstanceOf(Date);
  });
});
`;

  const testFilePath = path.join(outputPath, `${name.toLowerCase()}.domain.spec.ts`);
  writeFile(testFilePath, testContent);
}
