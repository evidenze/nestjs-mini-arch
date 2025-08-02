import { Injectable } from '@nestjs/common';

/**
 * Base Job class for all jobs in the Nest Lucid architecture
 * Jobs are the smallest units of work that perform specific tasks
 */
@Injectable()
export abstract class Job {
  /**
   * Execute the job with the provided data
   * @param data - The data required to execute the job
   */
  abstract handle(data?: any): Promise<any> | any;
}

/**
 * Decorator to mark a class as a Job
 */
export function JobHandler(name?: string) {
  return function (target: any) {
    Reflect.defineMetadata('job:name', name || target.name, target);
    return Injectable()(target);
  };
}
