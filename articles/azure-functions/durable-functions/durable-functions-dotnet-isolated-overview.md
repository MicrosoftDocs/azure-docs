---
title: Overview of Durable Functions in the .NET isolated worker - Azure
description: Learn about Durable Functions in the Azure Functions .NET isolated worker process, which supports non-LTS versions of .NET and .NET Framework apps.
author: jviau
ms.topic: overview
ms.service: azure-functions
ms.date: 02/25/2026
ms.author: azfuncdf
ms.devlang: csharp
ms.custom: devx-track-dotnet
#Customer intent: As a developer, I want to learn about Durable Functions for the Azure Functions .NET isolated worker process.
---

# Overview of Durable Functions in the .NET isolated worker

This article is an overview of Durable Functions in the [.NET isolated worker](../dotnet-isolated-process-guide.md). The isolated worker allows your Durable Functions app to run on a .NET version different than that of the Azure Functions host.

## Why use Durable Functions in the .NET isolated worker?

Using this model lets you get all the great benefits that come with the Azure Functions .NET isolated worker process. For more information, see [Benefits of the isolated worker model](../dotnet-isolated-process-guide.md#benefits-of-the-isolated-worker-model). Additionally, this new SDK includes some new [features](#feature-improvements-over-in-process-durable-functions).

### Feature improvements over in-process Durable Functions

- Orchestration input can be injected directly: `MyOrchestration([OrchestrationTrigger] TaskOrchestrationContext context, T input)`
- Support for strongly typed calls and class-based activities and orchestrations (NOTE: in preview. For more information, see [Source generator and class-based activities and orchestrations](#source-generator-and-class-based-activities-and-orchestrations).)
- Plus all the benefits of the Azure Functions .NET isolated worker.

### Source generator and class-based activities and orchestrations

**Requirement**: add `<PackageReference Include="Microsoft.DurableTask.Generators" Version="1.0.0" />` to your project.

By adding the source generator package, you get access to two new features:

- **Class-based activities and orchestrations**, an alternative way to write Durable Functions. Instead of "function-based", you write strongly typed classes, which inherit types from the Durable SDK.
- **Strongly typed extension methods** for invoking sub orchestrations and activities. These extension methods can also be used from "function-based" activities and orchestrations.

#### Function-based example

```csharp
public static class MyFunctions
{
    [Function(nameof(MyActivity))] 
    public static async Task<string> MyActivity([ActivityTrigger] string input)
    {
        // implementation
    }

    [Function(nameof(MyOrchestration))] 
    public static async Task<string> MyOrchestration([OrchestrationTrigger] TaskOrchestrationContext context, string input)
    {
        // implementation
        return await context.CallActivityAsync(nameof(MyActivity), input);
    }
}
```

#### Class-based example (with input/output)

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

#### Class-based example (no input/output, `ILogger` in activity)

```csharp
using Microsoft.DurableTask;
using Microsoft.Extensions.Logging;

[DurableTask]
public class MaintenanceOrchestration : TaskOrchestrator<object?, object?>
{
    public override async Task<object?> RunAsync(TaskOrchestrationContext context, object? input)
    {
        await context.CallActivityAsync(nameof(WriteHeartbeatLogActivity), (object?)null);
        return null;
    }
}

[DurableTask]
public class WriteHeartbeatLogActivity : TaskActivity<object?, object?>
{
    private readonly ILogger<WriteHeartbeatLogActivity> _logger;

    public WriteHeartbeatLogActivity(ILogger<WriteHeartbeatLogActivity> logger)
    {
        _logger = logger;
    }

    public override Task<object?> RunAsync(TaskActivityContext context, object? input)
    {
        _logger.LogInformation("Heartbeat logged at {Timestamp}.", DateTimeOffset.UtcNow);
        return Task.FromResult<object?>(null);
    }
}
```

Use `object?` as the generic type argument for class-based orchestrations and activities that don't need functional input or output. This pattern lets you use dependency injection (for example, `ILogger<T>`) in activities while still using the class-based model.

## Durable entities

Durable entities are supported in the .NET isolated worker. For more information, see the [developer's guide](./durable-functions-dotnet-entities.md).

## Migration guide

To migrate your Durable Functions app from the in-process model to the .NET isolated worker, see [Migrate from in-process to isolated worker model](./durable-functions-migrate.md). That guide covers project setup, package references, namespace changes, API mappings, behavioral differences, and common migration issues.
