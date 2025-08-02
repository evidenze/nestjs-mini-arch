# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-02

### Added
- Initial release of Mini
- Core architecture components (Job, Feature, Service, Domain)
- CLI generators for all components
- Comprehensive documentation
- Example implementations
- TypeScript support
- Test utilities
- MiniModule for easy integration
- Registry system for component management

### Features
- **Jobs**: Small, focused units of work
- **Features**: High-level operations that orchestrate jobs
- **Services**: Self-contained business domain modules  
- **Domains**: Shared business logic across services
- **CLI**: Powerful generators with `mini` command
- **Testing**: Built-in testing utilities and examples
- **TypeScript**: Full TypeScript support with decorators
- **NestJS Integration**: Seamless integration with NestJS ecosystem

### CLI Commands
- `mini generate:job` - Generate new jobs
- `mini generate:feature` - Generate new features
- `mini generate:service` - Generate new services
- `mini generate:domain` - Generate new domains

### Documentation
- Complete README with installation and usage guide
- Architecture overview and best practices
- CLI documentation
- Contributing guidelines
- MIT License
