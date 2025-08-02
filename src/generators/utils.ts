import * as fs from 'fs';
import * as path from 'path';

export interface GeneratorOptions {
  service?: string;
  directory?: string;
}

export function toPascalCase(str: string): string {
  return str
    .replace(/[\s\-_]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (_, char) => char.toUpperCase());
}

export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/^-/, '');
}

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  ensureDirectoryExists(dir);
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
}

export function getOutputPath(type: string, name: string, options: GeneratorOptions): string {
  const basePath = options.directory || process.cwd();
  
  if (options.service) {
    return path.join(basePath, 'src', 'services', toKebabCase(options.service), type + 's', toKebabCase(name));
  }
  
  return path.join(basePath, 'src', type + 's', toKebabCase(name));
}
