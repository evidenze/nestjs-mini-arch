# Mini API Reference

This document provides detailed information about the Mini framework API for NestJS applications.

## Table of Contents

- [Core Classes](#core-classes)
- [Decorators](#decorators)
- [MiniModule](#minimodule)
- [MiniRegistry](#miniregistry)
- [CLI Commands](#cli-commands)

## Core Classes

### Job

The base class for all jobs in the Mini framework. Jobs are the smallest units of logic and should be focused on a single responsibility.

```typescript
import { MiniJob } from 'mini';

@MiniJob()
export class SendEmailJob {
  constructor(
    private readonly emailService: EmailService,
    private readonly templateService: TemplateService,
  ) {}

  async handle(data: { to: string; subject: string; template: string; variables?: any }): Promise<void> {
    const emailTemplate = await this.templateService.render(data.template, data.variables);
    await this.emailService.send(data.to, data.subject, emailTemplate);
  }
}
```
