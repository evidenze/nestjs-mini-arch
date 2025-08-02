# Nest Lucid API Documentation

## Table of Contents
- [Core Classes](#core-classes)
- [Decorators](#decorators)
- [Module Configuration](#module-configuration)
- [CLI Reference](#cli-reference)
- [Examples](#examples)

## Core Classes

### Job

The base class for all jobs in the Nest Lucid architecture.

```typescript
import { Job, LucidJob } from 'nest-lucid';

@Injectable()
@LucidJob('JobName')
export class ExampleJob extends Job {
  async handle(data: any): Promise<any> {
    // Job implementation
  }
}
```

**Methods:**
- `handle(data?: any): Promise<any> | any` - Execute the job with provided data

### Feature

The base class for features that orchestrate multiple jobs.

```typescript
import { Feature, LucidFeature } from 'nest-lucid';

@Injectable()
@LucidFeature('FeatureName')
export class ExampleFeature extends Feature {
  async handle(data: any): Promise<any> {
    // Feature implementation
    const result1 = await this.runJob(Job1, data);
    const result2 = await this.runJob(Job2, result1);
    return result2;
  }
}
```

**Methods:**
- `handle(data?: any): Promise<any> | any` - Execute the feature
- `runJob<T extends Job>(jobClass: new () => T, data?: any): Promise<any>` - Execute a single job
- `runJobs(jobs: Array<{ job: new () => Job; data?: any }>): Promise<any[]>` - Execute multiple jobs in parallel

### Service

The base class for services that represent business domains.

```typescript
import { Service, LucidService } from 'nest-lucid';

@Injectable()
@LucidService('ServiceName')
export class ExampleService extends Service {
  getName(): string {
    return 'ServiceName';
  }
}
```

**Methods:**
- `getName(): string` - Get the service name
- `static forRoot(config?: any): any` - Configure the service module

### Domain

The base class for domains containing shared business logic.

```typescript
import { Domain, LucidDomain } from 'nest-lucid';

@Injectable()
@LucidDomain('DomainName')
export class ExampleDomain extends Domain {
  getName(): string {
    return 'DomainName';
  }
  
  // Business logic methods...
}
```

**Methods:**
- `getName(): string` - Get the domain name

## Decorators

### @LucidJob(name?: string)

Marks a class as a Job component.

```typescript
@LucidJob('SendEmail')
export class SendEmailJob extends Job {
  // Implementation
}
```

### @LucidFeature(name?: string)

Marks a class as a Feature component.

```typescript
@LucidFeature('UserRegistration')
export class UserRegistrationFeature extends Feature {
  // Implementation
}
```

### @LucidService(name: string)

Marks a class as a Service component.

```typescript
@LucidService('User')
export class UserService extends Service {
  // Implementation
}
```

### @LucidDomain(name?: string)

Marks a class as a Domain component.

```typescript
@LucidDomain('Validation')
export class ValidationDomain extends Domain {
  // Implementation
}
```

## Module Configuration

### LucidModule

The main module for configuring Nest Lucid in your application.

```typescript
import { LucidModule } from 'nest-lucid';

@Module({
  imports: [
    LucidModule.forRoot({
      services: [UserService, NotificationService],
      domains: [ValidationDomain, PricingDomain],
      autoRegister: true,
    }),
  ],
})
export class AppModule {}
```

**Configuration Options:**
- `services?: any[]` - Array of service classes to register
- `domains?: any[]` - Array of domain classes to register
- `autoRegister?: boolean` - Automatically register components (default: false)

### Async Configuration

```typescript
LucidModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    services: await configService.getServices(),
    domains: await configService.getDomains(),
    autoRegister: true,
  }),
  inject: [ConfigService],
})
```

## CLI Reference

### Installation

```bash
npm install -g nest-lucid
```

### Commands

#### Generate Job
```bash
nest-lucid generate:job <name> [options]
nest-lucid g:job <name> [options]

Options:
  -s, --service <service>      Service name
  -d, --directory <directory>  Output directory
```

Example:
```bash
nest-lucid g:job SendEmail --service notification
```

#### Generate Feature
```bash
nest-lucid generate:feature <name> [options]
nest-lucid g:feature <name> [options]

Options:
  -s, --service <service>      Service name
  -d, --directory <directory>  Output directory
```

Example:
```bash
nest-lucid g:feature UserRegistration --service user
```

#### Generate Service
```bash
nest-lucid generate:service <name> [options]
nest-lucid g:service <name> [options]

Options:
  -d, --directory <directory>  Output directory
```

Example:
```bash
nest-lucid g:service Payment
```

#### Generate Domain
```bash
nest-lucid generate:domain <name> [options]
nest-lucid g:domain <name> [options]

Options:
  -d, --directory <directory>  Output directory
```

Example:
```bash
nest-lucid g:domain Billing
```

## Examples

### Complete E-commerce Example

#### 1. Create Domain for Price Calculation

```typescript
// src/domains/pricing/pricing.domain.ts
import { Injectable } from '@nestjs/common';
import { Domain, LucidDomain } from 'nest-lucid';

@Injectable()
@LucidDomain('Pricing')
export class PricingDomain extends Domain {
  getName(): string {
    return 'Pricing';
  }

  calculateTax(amount: number, taxRate: number): number {
    return amount * (taxRate / 100);
  }

  calculateDiscount(amount: number, discountPercent: number): number {
    return amount * (discountPercent / 100);
  }

  calculateTotal(
    subtotal: number,
    tax: number,
    discount: number = 0
  ): number {
    return subtotal + tax - discount;
  }
}
```

#### 2. Create Jobs for Order Processing

```typescript
// src/services/order/jobs/validate-order.job.ts
import { Injectable } from '@nestjs/common';
import { Job, LucidJob } from 'nest-lucid';

export interface ValidateOrderData {
  items: Array<{ id: string; quantity: number; price: number }>;
  customerId: string;
}

@Injectable()
@LucidJob('ValidateOrder')
export class ValidateOrderJob extends Job {
  async handle(data: ValidateOrderData): Promise<any> {
    // Validate items exist and are in stock
    for (const item of data.items) {
      if (item.quantity <= 0) {
        throw new Error(`Invalid quantity for item ${item.id}`);
      }
      if (item.price <= 0) {
        throw new Error(`Invalid price for item ${item.id}`);
      }
    }

    // Validate customer exists
    if (!data.customerId) {
      throw new Error('Customer ID is required');
    }

    return { valid: true };
  }
}
```

```typescript
// src/services/order/jobs/calculate-order-total.job.ts
import { Injectable } from '@nestjs/common';
import { Job, LucidJob } from 'nest-lucid';
import { PricingDomain } from '../../../domains/pricing/pricing.domain';

export interface CalculateOrderTotalData {
  items: Array<{ id: string; quantity: number; price: number }>;
  taxRate: number;
  discountPercent?: number;
}

@Injectable()
@LucidJob('CalculateOrderTotal')
export class CalculateOrderTotalJob extends Job {
  constructor(private pricingDomain: PricingDomain) {
    super();
  }

  async handle(data: CalculateOrderTotalData): Promise<any> {
    const subtotal = data.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    const tax = this.pricingDomain.calculateTax(subtotal, data.taxRate);
    const discount = data.discountPercent
      ? this.pricingDomain.calculateDiscount(subtotal, data.discountPercent)
      : 0;
    const total = this.pricingDomain.calculateTotal(subtotal, tax, discount);

    return {
      subtotal,
      tax,
      discount,
      total,
    };
  }
}
```

#### 3. Create Feature for Order Processing

```typescript
// src/services/order/features/process-order.feature.ts
import { Injectable } from '@nestjs/common';
import { Feature, LucidFeature } from 'nest-lucid';
import { ValidateOrderJob } from '../jobs/validate-order.job';
import { CalculateOrderTotalJob } from '../jobs/calculate-order-total.job';
import { CreateOrderJob } from '../jobs/create-order.job';
import { SendOrderConfirmationJob } from '../../notification/jobs/send-order-confirmation.job';

export interface ProcessOrderData {
  items: Array<{ id: string; quantity: number; price: number }>;
  customerId: string;
  customerEmail: string;
  taxRate: number;
  discountPercent?: number;
}

@Injectable()
@LucidFeature('ProcessOrder')
export class ProcessOrderFeature extends Feature {
  async handle(data: ProcessOrderData): Promise<any> {
    // Step 1: Validate the order
    await this.runJob(ValidateOrderJob, {
      items: data.items,
      customerId: data.customerId,
    });

    // Step 2: Calculate totals
    const totals = await this.runJob(CalculateOrderTotalJob, {
      items: data.items,
      taxRate: data.taxRate,
      discountPercent: data.discountPercent,
    });

    // Step 3: Create the order
    const order = await this.runJob(CreateOrderJob, {
      ...data,
      ...totals,
    });

    // Step 4: Send confirmation email
    await this.runJob(SendOrderConfirmationJob, {
      email: data.customerEmail,
      orderId: order.id,
      total: totals.total,
    });

    return {
      success: true,
      order,
      totals,
    };
  }
}
```

#### 4. Service Module Configuration

```typescript
// src/services/order/order.module.ts
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProcessOrderFeature } from './features/process-order.feature';
import { ValidateOrderJob } from './jobs/validate-order.job';
import { CalculateOrderTotalJob } from './jobs/calculate-order-total.job';
import { CreateOrderJob } from './jobs/create-order.job';
import { PricingDomain } from '../../domains/pricing/pricing.domain';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    ProcessOrderFeature,
    ValidateOrderJob,
    CalculateOrderTotalJob,
    CreateOrderJob,
    PricingDomain,
  ],
  exports: [OrderService, ProcessOrderFeature],
})
export class OrderModule {}
```

#### 5. Controller Usage

```typescript
// src/services/order/order.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ProcessOrderFeature, ProcessOrderData } from './features/process-order.feature';

@Controller('orders')
export class OrderController {
  constructor(
    private processOrderFeature: ProcessOrderFeature
  ) {}

  @Post()
  async createOrder(@Body() orderData: ProcessOrderData) {
    return this.processOrderFeature.handle(orderData);
  }
}
```

### Testing Example

```typescript
// src/services/order/features/process-order.feature.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProcessOrderFeature } from './process-order.feature';
import { ValidateOrderJob } from '../jobs/validate-order.job';
import { CalculateOrderTotalJob } from '../jobs/calculate-order-total.job';
import { PricingDomain } from '../../../domains/pricing/pricing.domain';

describe('ProcessOrderFeature', () => {
  let feature: ProcessOrderFeature;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessOrderFeature,
        ValidateOrderJob,
        CalculateOrderTotalJob,
        PricingDomain,
      ],
    }).compile();

    feature = module.get<ProcessOrderFeature>(ProcessOrderFeature);
  });

  it('should process order successfully', async () => {
    const orderData = {
      items: [
        { id: 'item1', quantity: 2, price: 10.00 },
        { id: 'item2', quantity: 1, price: 25.00 },
      ],
      customerId: 'customer_123',
      customerEmail: 'customer@example.com',
      taxRate: 8.5,
      discountPercent: 10,
    };

    const result = await feature.handle(orderData);

    expect(result.success).toBe(true);
    expect(result.order).toBeDefined();
    expect(result.totals.subtotal).toBe(45.00);
    expect(result.totals.total).toBeCloseTo(40.33, 2); // 45 + 3.83 tax - 4.5 discount
  });
});
```

This comprehensive API documentation covers all the major components and provides practical examples for implementing the Nest Lucid architecture in real-world applications.
