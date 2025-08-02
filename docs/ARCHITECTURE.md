# Nest Lucid Architecture Guide

## Introduction

Nest Lucid is a Laravel Lucid-inspired architectural framework for NestJS that promotes clean, organized, and scalable code structure. This guide will help you understand the core concepts and implement them in your projects.

## Core Principles

### 1. Separation of Concerns
Each component has a specific responsibility:
- **Jobs**: Handle single, focused tasks
- **Features**: Orchestrate multiple jobs for complex operations
- **Services**: Group related functionality by business domain
- **Domains**: Contain pure business logic and rules

### 2. Single Responsibility
Each class should have one reason to change and one responsibility.

### 3. Testability
All components are designed to be easily testable in isolation.

### 4. Reusability
Components can be reused across different parts of the application.

## Architecture Overview

```
Application Layer
├── Controllers (HTTP/GraphQL/CLI)
├── Features (Use Cases)
├── Jobs (Business Operations)
├── Services (Domain Modules)
└── Domains (Business Logic)
```

## Component Deep Dive

### Jobs

Jobs are the smallest units of work in the architecture. They should:
- Have a single responsibility
- Be stateless
- Return consistent results
- Handle their own error cases

**Example: Email Job**
```typescript
@Injectable()
@LucidJob('SendEmail')
export class SendEmailJob extends Job {
  constructor(private emailService: EmailService) {
    super();
  }

  async handle(data: SendEmailData): Promise<EmailResult> {
    try {
      const result = await this.emailService.send({
        to: data.to,
        subject: data.subject,
        body: data.body,
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
```

### Features

Features represent use cases in your application. They:
- Orchestrate multiple jobs
- Implement business workflows
- Handle complex operations
- Maintain transaction boundaries

**Example: User Registration Feature**
```typescript
@Injectable()
@LucidFeature('UserRegistration')
export class UserRegistrationFeature extends Feature {
  async handle(data: UserRegistrationData): Promise<any> {
    // Start database transaction
    return this.dbService.transaction(async () => {
      // Step 1: Validate user data
      await this.runJob(ValidateUserDataJob, data.user);

      // Step 2: Create user account
      const user = await this.runJob(CreateUserJob, data.user);

      // Step 3: Set up user profile
      const profile = await this.runJob(CreateUserProfileJob, {
        userId: user.id,
        ...data.profile,
      });

      // Step 4: Send welcome email (async, don't wait)
      this.runJob(SendWelcomeEmailJob, {
        email: user.email,
        name: user.name,
      }).catch(error => {
        // Log error but don't fail the registration
        this.logger.error('Failed to send welcome email', error);
      });

      return { user, profile };
    });
  }
}
```

### Services

Services represent bounded contexts or business domains:
- Group related features and jobs
- Provide a cohesive API
- Manage their own data models
- Can be deployed independently (microservices)

**Example: User Service Structure**
```
src/services/user/
├── user.module.ts
├── user.service.ts
├── user.controller.ts
├── entities/
│   └── user.entity.ts
├── features/
│   ├── user-registration/
│   ├── user-authentication/
│   └── user-profile-update/
└── jobs/
    ├── create-user/
    ├── validate-user/
    └── hash-password/
```

### Domains

Domains contain pure business logic:
- No side effects (no database calls, no HTTP requests)
- Stateless functions
- Business rule validation
- Data transformations
- Calculations

**Example: Pricing Domain**
```typescript
@Injectable()
@LucidDomain('Pricing')
export class PricingDomain extends Domain {
  calculateTax(amount: number, rate: number): number {
    if (amount < 0) throw new Error('Amount cannot be negative');
    if (rate < 0 || rate > 100) throw new Error('Invalid tax rate');
    
    return amount * (rate / 100);
  }

  applyDiscount(amount: number, discount: Discount): number {
    switch (discount.type) {
      case 'percentage':
        return amount * (1 - discount.value / 100);
      case 'fixed':
        return Math.max(0, amount - discount.value);
      default:
        throw new Error('Unknown discount type');
    }
  }

  calculateShipping(weight: number, distance: number): number {
    const baseRate = 5.00;
    const weightRate = 0.50 * weight;
    const distanceRate = 0.01 * distance;
    
    return baseRate + weightRate + distanceRate;
  }
}
```

## Best Practices

### 1. Naming Conventions

- **Jobs**: Use verb + noun format (e.g., `SendEmailJob`, `ValidatePasswordJob`)
- **Features**: Use noun + verb format (e.g., `UserRegistrationFeature`, `OrderProcessingFeature`)
- **Services**: Use noun format (e.g., `UserService`, `PaymentService`)
- **Domains**: Use noun format (e.g., `PricingDomain`, `ValidationDomain`)

### 2. Data Flow

```
Controller → Feature → Jobs → Infrastructure
     ↓          ↓       ↓
   DTOs → Feature Data → Job Data
```

### 3. Error Handling

```typescript
// In Jobs - throw specific errors
if (!user) {
  throw new UserNotFoundError(userId);
}

// In Features - catch and transform errors
try {
  await this.runJob(CreateUserJob, userData);
} catch (error) {
  if (error instanceof EmailAlreadyExistsError) {
    throw new BadRequestException('Email already in use');
  }
  throw error;
}

// In Controllers - handle HTTP responses
try {
  const result = await this.userRegistrationFeature.handle(data);
  return { success: true, data: result };
} catch (error) {
  if (error instanceof BadRequestException) {
    throw error;
  }
  throw new InternalServerErrorException('Registration failed');
}
```

### 4. Testing Strategy

```typescript
// Test Jobs in isolation
describe('SendEmailJob', () => {
  it('should send email with correct data', async () => {
    const mockEmailService = {
      send: jest.fn().mockResolvedValue({ messageId: 'test123' })
    };
    
    const job = new SendEmailJob(mockEmailService);
    const result = await job.handle({
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test body'
    });
    
    expect(mockEmailService.send).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test body'
    });
    expect(result.success).toBe(true);
  });
});

// Test Features with mocked jobs
describe('UserRegistrationFeature', () => {
  it('should complete registration workflow', async () => {
    const feature = new UserRegistrationFeature();
    
    // Mock the runJob method
    jest.spyOn(feature, 'runJob')
      .mockImplementation((JobClass, data) => {
        if (JobClass === CreateUserJob) {
          return Promise.resolve({ id: 'user123', ...data });
        }
        if (JobClass === SendWelcomeEmailJob) {
          return Promise.resolve({ sent: true });
        }
        return Promise.resolve({});
      });

    const result = await feature.handle({
      user: { email: 'test@example.com', password: 'password' }
    });

    expect(result.user.id).toBe('user123');
  });
});
```

### 5. Configuration and Environment

```typescript
// Use configuration in jobs
@Injectable()
@LucidJob('SendEmail')
export class SendEmailJob extends Job {
  constructor(
    private emailService: EmailService,
    private configService: ConfigService
  ) {
    super();
  }

  async handle(data: SendEmailData): Promise<any> {
    const fromEmail = this.configService.get('MAIL_FROM');
    
    return this.emailService.send({
      from: fromEmail,
      to: data.to,
      subject: data.subject,
      body: data.body,
    });
  }
}
```

### 6. Logging and Monitoring

```typescript
@Injectable()
@LucidFeature('OrderProcessing')
export class OrderProcessingFeature extends Feature {
  constructor(private logger: Logger) {
    super();
  }

  async handle(data: OrderData): Promise<any> {
    this.logger.log(`Processing order ${data.orderId}`);
    
    const startTime = Date.now();
    
    try {
      const result = await this.processOrder(data);
      
      this.logger.log(
        `Order ${data.orderId} processed successfully in ${Date.now() - startTime}ms`
      );
      
      return result;
    } catch (error) {
      this.logger.error(
        `Order ${data.orderId} processing failed: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
```

## Advanced Patterns

### 1. Event-Driven Architecture

```typescript
@Injectable()
@LucidFeature('UserRegistration')
export class UserRegistrationFeature extends Feature {
  constructor(private eventEmitter: EventEmitter2) {
    super();
  }

  async handle(data: UserRegistrationData): Promise<any> {
    const user = await this.runJob(CreateUserJob, data);
    
    // Emit event for other services to handle
    this.eventEmitter.emit('user.registered', {
      userId: user.id,
      email: user.email,
      timestamp: new Date(),
    });
    
    return user;
  }
}
```

### 2. Saga Pattern for Distributed Transactions

```typescript
@Injectable()
@LucidFeature('OrderProcessing')
export class OrderProcessingFeature extends Feature {
  async handle(data: OrderData): Promise<any> {
    const saga = new OrderProcessingSaga();
    
    try {
      // Step 1: Reserve inventory
      const reservation = await this.runJob(ReserveInventoryJob, data.items);
      saga.addCompensation(() => this.runJob(ReleaseInventoryJob, reservation));
      
      // Step 2: Process payment
      const payment = await this.runJob(ProcessPaymentJob, data.payment);
      saga.addCompensation(() => this.runJob(RefundPaymentJob, payment));
      
      // Step 3: Create order
      const order = await this.runJob(CreateOrderJob, { ...data, payment, reservation });
      
      return order;
    } catch (error) {
      // Run compensations in reverse order
      await saga.compensate();
      throw error;
    }
  }
}
```

### 3. CQRS Pattern

```typescript
// Command side
@Injectable()
@LucidFeature('UpdateUserProfile')
export class UpdateUserProfileFeature extends Feature {
  async handle(command: UpdateUserProfileCommand): Promise<void> {
    await this.runJob(ValidateUserProfileJob, command.data);
    await this.runJob(UpdateUserJob, command);
    
    // Publish event for read model updates
    this.eventEmitter.emit('user.profile.updated', command);
  }
}

// Query side
@Injectable()
@LucidJob('GetUserProfile')
export class GetUserProfileJob extends Job {
  constructor(private readModelService: ReadModelService) {
    super();
  }

  async handle(query: GetUserProfileQuery): Promise<UserProfile> {
    return this.readModelService.getUserProfile(query.userId);
  }
}
```

This guide provides a comprehensive understanding of how to implement and use the Nest Lucid architecture effectively in your NestJS applications.
