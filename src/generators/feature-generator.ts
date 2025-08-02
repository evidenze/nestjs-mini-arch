import { writeFile, getOutputPath, toPascalCase, GeneratorOptions } from './utils';
import * as path from 'path';

export function generateFeature(name: string, options: GeneratorOptions = {}): void {
  const className = toPascalCase(name) + 'Feature';
  const fileName = `${name.toLowerCase()}.feature.ts`;
  const outputPath = getOutputPath('feature', name, options);
  const filePath = path.join(outputPath, fileName);

  const content = `import { Injectable } from '@nestjs/common';
import { Feature, MiniFeature } from 'mini';

export interface ${className}Data {
  // Define the data interface for this feature
}

@Injectable()
@MiniFeature('${name}')
export class ${className} extends Feature {
  /**
   * Execute the ${name} feature
   * @param data - The data required to execute this feature
   */
  async handle(data: ${className}Data): Promise<any> {
    // TODO: Implement feature logic here
    console.log('Executing ${className} with data:', data);
    
    try {
      // Example: Run multiple jobs in sequence
      // const step1Result = await this.runJob(SomeJob, data.step1Data);
      // const step2Result = await this.runJob(AnotherJob, data.step2Data);
      
      // Example: Run multiple jobs in parallel
      // const parallelResults = await this.runJobs([
      //   { job: Job1, data: data.job1Data },
      //   { job: Job2, data: data.job2Data },
      // ]);
      
      const result = {
        success: true,
        message: '${className} executed successfully',
        data: data,
        // steps: [step1Result, step2Result],
        // parallelResults,
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
import { ${className}, ${className}Data } from './${name.toLowerCase()}.feature';

describe('${className}', () => {
  let feature: ${className};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [${className}],
    }).compile();

    feature = module.get<${className}>(${className});
  });

  it('should be defined', () => {
    expect(feature).toBeDefined();
  });

  it('should execute successfully', async () => {
    const testData: ${className}Data = {
      // Add test data here
    };

    const result = await feature.handle(testData);
    
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});
`;

  const testFilePath = path.join(outputPath, `${name.toLowerCase()}.feature.spec.ts`);
  writeFile(testFilePath, testContent);
}
