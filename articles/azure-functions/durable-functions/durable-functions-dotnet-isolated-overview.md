---
title: "Overview of Durable Functions in .NET Isolated Worker"
description: "Discover how Durable Functions in the Azure Functions .NET isolated worker process lets you run apps on any .NET version. Explore features, class-based models, and migration guidance."
author: jviau
ms.topic: overview
ms.service: azure-functions
ms.date: 04/22/2026
ms.author: azfuncdf
ms.devlang: csharp
ms.custom: devx-track-dotnet
#Customer intent: As a developer, I want to learn about Durable Functions for the Azure Functions .NET isolated worker process.
---

# Overview of Durable Functions in the .NET isolated worker

The .NET isolated worker lets you run Durable Functions on any supported .NET version independently of the Azure Functions host process. This model gives you full control over dependency injection, middleware, and .NET versioning.

In this article, you learn about:

- [Benefits](#benefits) of the isolated worker for Durable Functions
- [Getting started](#get-started) with the required packages
- [Key differences from in-process](#key-differences-from-in-process) APIs and namespaces
- [Source generators and class-based syntax (preview)](#source-generators-and-class-based-syntax-preview) for strongly typed orchestrations

## Benefits

The .NET isolated worker provides several advantages for Durable Functions apps:

- **Independent .NET versioning:** Run your app on .NET 8, .NET 9, or later without waiting for the Functions host to update.
- **Full dependency injection:** Use standard .NET `IServiceCollection` / `IServiceProvider` patterns in your activities.
- **Custom middleware:** Add cross-cutting concerns like logging, authentication, or error handling via the Functions worker middleware pipeline.
- **Direct input injection:** Orchestration input can be injected directly into the trigger method signature: `MyOrchestration([OrchestrationTrigger] TaskOrchestrationContext context, T input)`.
- **Strongly typed calls (preview):** With the source generator package, you get compile-time–safe invocations for activities and sub-orchestrations. For more information, see [Source generators and class-based syntax (preview)](#source-generators-and-class-based-syntax-preview).

For the full list of isolated worker benefits, see [Benefits of the isolated worker model](../dotnet-isolated-process-guide.md#benefits-of-the-isolated-worker-model).

## Get started

To create a Durable Functions app using the .NET isolated worker:

1. Install the required NuGet package:

   ```xml
   <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask" Version="1.*" />
   ```

1. Use `TaskOrchestrationContext` for orchestrators and `DurableTaskClient` for client operations. See the [quickstart tutorial](durable-functions-isolated-create-first-csharp.md) for a complete walkthrough.

## Key differences from in-process

If you're migrating from or comparing to the in-process model, here are the key differences:

| Area | In-process | .NET isolated worker |
|------|-----------|---------------------|
| **NuGet package** | `Microsoft.Azure.WebJobs.Extensions.DurableTask` | `Microsoft.Azure.Functions.Worker.Extensions.DurableTask` |
| **Orchestrator context** | `IDurableOrchestrationContext` | `TaskOrchestrationContext` |
| **Client type** | `IDurableOrchestrationClient` | `DurableTaskClient` |
| **Activity context** | `IDurableActivityContext` | `TaskActivityContext` |
| **Namespace** | `Microsoft.Azure.WebJobs.Extensions.DurableTask` | `Microsoft.DurableTask` / `Microsoft.Azure.Functions.Worker` |
| **Replay-safe logger** | `context.CreateReplaySafeLogger(log)` | `context.CreateReplaySafeLogger("Name")` |

For a comprehensive migration guide that covers project setup, package references, API mappings, behavioral differences, and common issues, see [Migrate from in-process to isolated worker model](./durable-functions-migrate.md).

## Source generators and class-based syntax (preview)

The source generator package provides an alternative to function-based Durable Functions. Instead of static methods with `[Function]` attributes, you write strongly typed classes that inherit from the Durable SDK.

### Prerequisites

Add the source generator NuGet package to your project:

```xml
<PackageReference Include="Microsoft.DurableTask.Generators" Version="1.0.0" />
```

The package provides two capabilities:

- **Class-based activities and orchestrations** — strongly typed classes that inherit `TaskOrchestrator<TInput, TOutput>` and `TaskActivity<TInput, TOutput>`.
- **Strongly typed extension methods** — compile-time–safe methods for invoking sub-orchestrations and activities. These extension methods also work from function-based orchestrations.

### Example

The following example shows a class-based orchestration that calls a class-based activity:

```csharp
using Microsoft.DurableTask;

[DurableTask]
public class MyOrchestration : TaskOrchestrator<string, string>
{
    public override async Task<string> RunAsync(TaskOrchestrationContext context, string input)
    {
        return await context.CallActivityAsync<string>(nameof(MyActivity), input);
    }
}

[DurableTask]
public class MyActivity : TaskActivity<string, string>
{
    public override Task<string> RunAsync(TaskActivityContext context, string input)
    {
        return Task.FromResult($"Processed: {input}");
    }
}
```

> [!TIP]
> For orchestrations or activities that don't need functional input or output, use `object?` as the generic type argument (for example, `TaskOrchestrator<object?, object?>`). This pattern lets you use dependency injection (for example, `ILogger<T>`) in activities while still using the class-based model.

## Durable entities

Durable entities are supported in the .NET isolated worker. For more information, see the [developer's guide](./durable-functions-dotnet-entities.md).

## Next steps

- [Get started: Create your first durable function in .NET isolated](durable-functions-isolated-create-first-csharp.md)
- [Durable entities in .NET isolated](./durable-functions-dotnet-entities.md)
- [Migrate from in-process to isolated worker model](./durable-functions-migrate.md)
