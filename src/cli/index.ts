#!/usr/bin/env node

import { Command } from 'commander';
import { generateJob } from '../generators/job-generator';
import { generateFeature } from '../generators/feature-generator';
import { generateService } from '../generators/service-generator';
import { generateDomain } from '../generators/domain-generator';

const program = new Command();

program
  .name('nest-lucid')
  .description('CLI for Nest Lucid architecture')
  .version('1.0.0');

program
  .command('generate:job')
  .alias('g:job')
  .description('Generate a new job')
  .argument('<name>', 'job name')
  .option('-s, --service <service>', 'service name')
  .option('-d, --directory <directory>', 'output directory')
  .action((name, options) => {
    generateJob(name, options);
  });

program
  .command('generate:feature')
  .alias('g:feature')
  .description('Generate a new feature')
  .argument('<name>', 'feature name')
  .option('-s, --service <service>', 'service name')
  .option('-d, --directory <directory>', 'output directory')
  .action((name, options) => {
    generateFeature(name, options);
  });

program
  .command('generate:service')
  .alias('g:service')
  .description('Generate a new service')
  .argument('<name>', 'service name')
  .option('-d, --directory <directory>', 'output directory')
  .action((name, options) => {
    generateService(name, options);
  });

program
  .command('generate:domain')
  .alias('g:domain')
  .description('Generate a new domain')
  .argument('<name>', 'domain name')
  .option('-d, --directory <directory>', 'output directory')
  .action((name, options) => {
    generateDomain(name, options);
  });

program.parse();
