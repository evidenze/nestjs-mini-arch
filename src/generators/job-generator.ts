import { writeFile, getOutputPath, toPascalCase, GeneratorOptions } from './utils';
import * as path from 'path';

export function generateJob(name: string, options: GeneratorOptions = {}): void {
  const className = toPascalCase(name) + 'Job';
  const fileName = `${name.toLowerCase()}.job.ts`;
  const outputPath = getOutputPath('job', name, options);
  const filePath = path.join(outputPath, fileName);

  const content = `import { Injectable } from '@nestjs/common';
import { Job, LucidJob } from 'nest-lucid';

export interface ${className}Data {
  // Define the data interface for this job
}

@Injectable()
@LucidJob('${name}')
export class ${className} extends Job {
  /**
   * Execute the ${name} job
   * @param data - The data required to execute this job
   */
  async handle(data: ${className}Data): Promise<any> {
    // TODO: Implement job logic here
    console.log('Executing ${className} with data:', data);
    
    // Example job implementation
    try {
      // Your business logic here
      const result = {
        success: true,
        message: '${className} executed successfully',
        data: data,
      };
      
      return result;
    } catch (error) {
      throw new Error(\`${className} failed: \${error.message}\`);
    }
  }
}
`;

  writeFile(filePath, content);
  
  // Generate test file
  const testContent = `import { Test, TestingModule } from '@nestjs/testing';
import { ${className}, ${className}Data } from './${name.toLowerCase()}.job';

describe('${className}', () => {
  let job: ${className};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [${className}],
    }).compile();

    job = module.get<${className}>(${className});
  });

  it('should be defined', () => {
    expect(job).toBeDefined();
  });

  it('should execute successfully', async () => {
    const testData: ${className}Data = {
      // Add test data here
    };

    const result = await job.handle(testData);
    
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});
`;

  const testFilePath = path.join(outputPath, `${name.toLowerCase()}.job.spec.ts`);
  writeFile(testFilePath, testContent);
}
