import { Injectable } from '@nestjs/common';
import { Job } from './job';

/**
 * Base Feature class for all features in the Nest Lucid architecture
 * Features orchestrate multiple jobs to accomplish higher-level business operations
 */
@Injectable()
export abstract class Feature {
  /**
   * Execute the feature with the provided data
   * @param data - The data required to execute the feature
   */
  abstract handle(data?: any): Promise<any> | any;

  /**
   * Run a job and return its result
   * @param jobClass - The job class to instantiate and run
   * @param data - The data to pass to the job
   */
  protected async runJob<T extends Job>(jobClass: new () => T, data?: any): Promise<any> {
    const job = new jobClass();
    return await job.handle(data);
  }

  /**
   * Run multiple jobs in parallel
   * @param jobs - Array of job configurations
   */
  protected async runJobs(jobs: Array<{ job: new () => Job; data?: any }>): Promise<any[]> {
    const promises = jobs.map(({ job, data }) => this.runJob(job, data));
    return Promise.all(promises);
  }
}

/**
 * Decorator to mark a class as a Feature
 */
export function FeatureHandler(name?: string) {
  return function (target: any) {
    Reflect.defineMetadata('feature:name', name || target.name, target);
    return Injectable()(target);
  };
}
