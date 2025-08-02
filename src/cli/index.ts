#!/usr/bin/env node

import { Command } from 'commander';
import { 
  generateJob, 
  generateFeature, 
  generateService, 
  generateDomain,
  generateProject 
} from '../generators';

const program = new Command();

program
  .name('mini')
  .description('Mini Framework CLI for NestJS clean architecture')
  .version('1.1.0');

// New project command
program
  .command('new')
  .alias('n')
  .description('Create a new NestJS project with Mini framework')
  .argument('<name>', 'Project name')
  .option('-d, --directory <dir>', 'Target directory (default: current directory)')
  .option('-p, --package-manager <pm>', 'Package manager (npm, yarn, pnpm)', 'npm')
  .option('--skip-install', 'Skip automatic dependency installation')
  .action((name, options) => {
    try {
      generateProject(name, {
        directory: options.directory,
        packageManager: options.packageManager,
        skipInstall: options.skipInstall
      });
    } catch (error) {
      console.error('Error creating project:', error.message);
      process.exit(1);
    }
  });

// Generate job command

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
