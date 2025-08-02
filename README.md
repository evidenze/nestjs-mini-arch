# Mini

A clean architectural framework for NestJS applications inspired by Laravel's architectural patterns that promotes organized and scalable code structure.

[![npm version](https://badge.fury.io/js/mini.svg)](https://badge.fury.io/js/mini)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Overview

Mini brings the power and elegance of clean architecture to NestJS applications. It provides a structured approach to building scalable applications with clear separation of concerns, making your codebase more maintainable and testable.

## 🏗️ Architecture Components

### Jobs
The smallest units of work that perform specific tasks. Jobs are focused, reusable pieces of business logic.

### Features
High-level operations that orchestrate multiple jobs to accomplish business operations. Features represent use cases in your application.

### Services
Self-contained modules that handle specific business domains. Services group related functionality together.

### Domains
Shared business logic and rules that can be reused across multiple services.

## 📦 Installation

```bash
npm install mini
# or
yarn add mini
```

For CLI usage, install globally:
```bash
npm install -g mini
# or
yarn global add mini
```

## 🚀 Quick Start

### 1. Set up your NestJS application

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MiniModule } from 'mini';

@Module({
  imports: [
    MiniModule.forRoot({
      autoRegister: true,
    }),
  ],
})
export class AppModule {}
```

### 2. Create your first Job

```bash
mini generate:job SendEmail --service notification
```

This generates:

```typescript
// src/services/notification/jobs/send-email/send-email.job.ts
import { Injectable } from '@nestjs/common';
import { Job, MiniJob } from 'mini';

export interface SendEmailJobData {
  to: string;
  subject: string;
  body: string;
}

@Injectable()
@MiniJob('SendEmail')
export class SendEmailJob extends Job {
  async handle(data: SendEmailJobData): Promise<any> {
    // Email sending logic here
    console.log(`Sending email to ${data.to}`);
    return { success: true, messageId: 'msg_123' };
  }
}
```

### 3. Create a Feature

```bash
mini generate:feature UserRegistration --service user
```

```typescript
// src/services/user/features/user-registration/user-registration.feature.ts
import { Injectable } from '@nestjs/common';
import { Feature, MiniFeature } from 'mini';
import { CreateUserJob } from '../jobs/create-user/create-user.job';
import { SendWelcomeEmailJob } from '../jobs/send-welcome-email/send-welcome-email.job';

@Injectable()
@MiniFeature('UserRegistration')
export class UserRegistrationFeature extends Feature {
  async handle(userData: any): Promise<any> {
    // Create user
    const user = await this.runJob(CreateUserJob, userData);
    
    // Send welcome email
    await this.runJob(SendWelcomeEmailJob, {
      email: user.email,
      name: user.name,
    });
    
    return { success: true, user };
  }
}
```

### 4. Create a Service

```bash
mini generate:service User
```

### 5. Create a Domain

```bash
mini generate:domain User
```

## 🎮 CLI Commands

The Mini CLI provides powerful generators to scaffold your architecture components:

### Generate Job
```bash
mini generate:job <name> [options]
# or
mini g:job <name> [options]

Options:
  -s, --service <service>      Specify the service name
  -d, --directory <directory>  Specify output directory
```

### Generate Feature
```bash
mini generate:feature <name> [options]
# or
mini g:feature <name> [options]

Options:
  -s, --service <service>      Specify the service name
  -d, --directory <directory>  Specify output directory
```

### Generate Service
```bash
mini generate:service <name> [options]
# or
mini g:service <name> [options]

Options:
  -d, --directory <directory>  Specify output directory
```

### Generate Domain
```bash
mini generate:domain <name> [options]
# or
mini g:domain <name> [options]

Options:
  -d, --directory <directory>  Specify output directory
```

## 📁 Recommended Project Structure

```
src/
├── app.module.ts
├── main.ts
├── services/
│   ├── user/
│   │   ├── user.module.ts
│   │   ├── user.service.ts
│   │   ├── user.controller.ts
│   │   ├── features/
│   │   │   ├── user-registration/
│   │   │   │   ├── user-registration.feature.ts
│   │   │   │   └── user-registration.feature.spec.ts
│   │   │   └── user-login/
│   │   │       ├── user-login.feature.ts
│   │   │       └── user-login.feature.spec.ts
│   │   └── jobs/
│   │       ├── create-user/
│   │       │   ├── create-user.job.ts
│   │       │   └── create-user.job.spec.ts
│   │       └── validate-email/
│   │           ├── validate-email.job.ts
│   │           └── validate-email.job.spec.ts
│   ├── notification/
│   │   ├── notification.module.ts
│   │   ├── notification.service.ts
│   │   └── jobs/
│   │       └── send-email/
│   │           ├── send-email.job.ts
│   │           └── send-email.job.spec.ts
│   └── payment/
│       ├── payment.module.ts
│       ├── payment.service.ts
│       └── features/
│           └── process-payment/
│               ├── process-payment.feature.ts
│               └── process-payment.feature.spec.ts
└── domains/
    ├── user/
    │   ├── user.domain.ts
    │   └── user.domain.spec.ts
    └── billing/
        ├── billing.domain.ts
        └── billing.domain.spec.ts
```

## 💡 Usage Examples

### Basic Job Example

```typescript
import { Injectable } from '@nestjs/common';
import { Job, MiniJob } from 'mini';

@Injectable()
@MiniJob('CalculateTotal')
export class CalculateTotalJob extends Job {
  async handle(data: { items: any[], tax: number }): Promise<number> {
    const subtotal = data.items.reduce((sum, item) => sum + item.price, 0);
    return subtotal * (1 + data.tax);
  }
}
```

### Feature with Multiple Jobs

```typescript
import { Injectable } from '@nestjs/common';
import { Feature, MiniFeature } from 'mini';

@Injectable()
@MiniFeature('ProcessOrder')
export class ProcessOrderFeature extends Feature {
  async handle(orderData: any): Promise<any> {
    // Validate order
    const validation = await this.runJob(ValidateOrderJob, orderData);
    if (!validation.valid) {
      throw new Error('Invalid order');
    }

    // Calculate total
    const total = await this.runJob(CalculateTotalJob, {
      items: orderData.items,
      tax: orderData.taxRate,
    });

    // Process payment and send confirmation in parallel
    const [payment, confirmation] = await this.runJobs([
      { job: ProcessPaymentJob, data: { amount: total, method: orderData.paymentMethod } },
      { job: SendOrderConfirmationJob, data: { email: orderData.customerEmail, order: orderData } },
    ]);

    return {
      success: true,
      orderId: orderData.id,
      total,
      payment,
      confirmation,
    };
  }
}
```

### Domain Example

```typescript
import { Injectable } from '@nestjs/common';
import { Domain, MiniDomain } from 'mini';

@Injectable()
@MiniDomain('UserValidation')
export class UserValidationDomain extends Domain {
  getName(): string {
    return 'UserValidation';
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
```

## 🧪 Testing

Mini components are designed to be easily testable:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailJob } from './send-email.job';

describe('SendEmailJob', () => {
  let job: SendEmailJob;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendEmailJob],
    }).compile();

    job = module.get<SendEmailJob>(SendEmailJob);
  });

  it('should send email successfully', async () => {
    const data = {
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test email',
    };

    const result = await job.handle(data);
    
    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });
});
```

## 📚 Best Practices

### 1. Keep Jobs Focused
Each job should have a single responsibility and be focused on one specific task.

```typescript
// ✅ Good - Focused job
@MiniJob('SendEmail')
export class SendEmailJob extends Job {
  async handle(data: EmailData): Promise<any> {
    // Only handles email sending
  }
}

// ❌ Bad - Too many responsibilities
@MiniJob('HandleUser')
export class HandleUserJob extends Job {
  async handle(data: any): Promise<any> {
    // Creates user, sends email, updates analytics, etc.
  }
}
```

### 2. Use Features for Complex Operations
Use features to orchestrate multiple jobs for complex business operations.

```typescript
@MiniFeature('UserOnboarding')
export class UserOnboardingFeature extends Feature {
  async handle(userData: any): Promise<any> {
    const user = await this.runJob(CreateUserJob, userData);
    await this.runJob(SendWelcomeEmailJob, { user });
    await this.runJob(CreateUserProfileJob, { userId: user.id });
    return user;
  }
}
```

### 3. Keep Domains Pure
Domains should contain pure business logic without side effects.

```typescript
@MiniDomain('Pricing')
export class PricingDomain extends Domain {
  calculateDiscount(price: number, discountPercentage: number): number {
    return price * (discountPercentage / 100);
  }
  
  // ❌ Avoid side effects in domains
  // async savePrice(price: number): Promise<void> {
  //   await this.database.save(price);
  // }
}
```

### 4. Use TypeScript Interfaces
Define clear interfaces for your data structures.

```typescript
export interface CreateUserJobData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserRegistrationFeatureData {
  user: CreateUserJobData;
  sendWelcomeEmail: boolean;
  source: 'web' | 'mobile' | 'api';
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Laravel's architectural patterns](https://laravel.com/docs/architecture)
- Built for the [NestJS](https://nestjs.com/) framework
- Thanks to all contributors who help make this project better

## 📞 Support

- 📖 [Documentation](https://github.com/your-username/mini/wiki)
- 🐛 [Issues](https://github.com/your-username/mini/issues)
- 💬 [Discussions](https://github.com/your-username/mini/discussions)

---

Made with ❤️ for the NestJS community
