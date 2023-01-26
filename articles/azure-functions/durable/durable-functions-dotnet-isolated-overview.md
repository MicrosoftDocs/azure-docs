---
title: Overview of Durable Functions in the Azure Functions .NET isolated worker process
description: Learn about Durable Functions in the Azure Functions .NET isolated worker process, which supports non-LTS versions of .NET and .NET Framework apps.
author: jviau
ms.topic: overview
ms.date: 01/24/2023
ms.author: azfuncdf
ms.devlang: csharp
#Customer intent: As a developer, I want to learn about Durable Functions for the Azure Functions .NET isolated worker process.
---

# Overview for running Durable Functions in the .NET isolated worker

This article is an overview for Durable Functions in the Azure Functions .NET isolated worker process. If you are new to the .NET isolated worker process, [start here](../dotnet-isolated-process-guide.md). This allows you to run your Durable Functions on a version of .NET that is different than the version used by the Functions host process.

## Why Durable Functions for .NET isolated worker?

Using this model lets you get all the great benefits that come with the Azure Functions .NET isolated work process. See [here](../dotnet-isolated-process-guide.md#why-net-functions-isolated-worker-process) for more information.

### Feature parity with in-process Durable functions

Not all features from in-process Durable functions have yet been migrated to the isolated worker. Some known missing features that will be addressed at a later date are:

- Durable Entities not supported
- `CallHttpAsync` not available.

### Feature improvements over in-process Durable functions

- Orchestration input can be injected directly: `MyOrchestration([OrchestrationTrigger] TaskOrchestrationContext context, T input)`
- Support for strongly-typed calls and class-based activities and orchestrations (NOTE: in preview, see [here](#source-generator-and-class-based-activities-and-orchestrations) for more details.)
- Plus all the benefits of Azure Functions .NET isolated worker.

### Source Generator and class-based activities and orchestrations

Requirement: add `<PackageReference Include="Microsoft.DurableTask.Generators" Version="1.0.0-preview.1" />` to your project.

By adding the source generator package you get access to 2 new features:

1. Class-based activities and orchestrations, an alternative way to write Durable Functions. Instead of "function-based", you write strongly-typed classes which inherit types from the Durable SDK.
2. Strongly-typed extension methods for invoking sub-orchestrations and activities. This can also be used from "function-based" activities and orchestrations.

Example:

#### Function-based

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

#### Class-based

```csharp
[DurableTask(nameof(MyActivity))]
public class MyActivity : TaskActivity<string, string>
{
    private readonly ILogger logger;

    public MyActivity(ILogger<SayHelloTyped> logger) // activites have access to DI.
    {
        this.logger = logger;
    }

    public async override Task<string> RunAsync(TaskActivityContext context, string input)
    {
        // implementation
    }
}

[DurableTask(nameof(MyOrchestration))]
public class MyOrchestration : TaskOrchestrator<string, string>
{
    public async override Task<string> RunAsync(TaskOrchestrationContext context, string input)
    {
        ILogger logger = context.CreateReplaySafeLogger<MyOrchestration>(); // orchestrations do NOT have access to DI.

        // An extension method was generated for directly invoking "MyActivity".
        return await context.CallMyActivityAsync(input);
    }
}
```

## Migration Guide

This guide assumes you are starting a .NET Durable Functions 2.x project.

### Update your project

The first step is to update your project to [Azure Functions .NET isolated](../migrate-version-3-version-4.md). After that is done, the next step is to update your Durable nuget package references:

# [.NET csproj changes](#tab/csproj)

The following changes are required in the .csproj XML project file:

1. Replace the existing durable packages with the isolated worker packages:

Old:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.DurableTask" Version="2.9.0" />
</ItemGroup>
```

New:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask" Version="1.0.0" />
</ItemGroup>
```

### Update your code

Durable Functions for .NET isolated worker is an entirely new package with different types and namespaces. There are several required changes to your code as a result, but many of the APIs line up with no changes needed.

#### Host.json schema

The schema for Durable Functions .NET isolated worker and Durable Functions 2.x has remained the same, no changes sbould be needed.

#### Public interface changes

This is not an exhaustive list of change.

| 2.x | Isolated |
| ---- | ---- |
| `IDurableOrchestrationClient` | `DurableClientContext` |
| `IDurableOrchestrationClient.StartNewAsync` | `DurableClientContext.Client.ScheduleNewOrchestrationInstanceAsync` |
| `IDurableOrchestrationContext` | `TaskOrchestrationContext` |
| `IDurableOrchestrationContext.GetInput<T>()` | `TaskOrchestrationContext.GetInput<T>()` or inject input as a parameter: `MyOrchestration([OrchestrationTrigger] TaskOrchestrationContext context, T input)` |
| `DurableActivityContext` | No equivalent |
| `DurableActivityContext.GetInput<T>()` | Inject input as a parameter `MyActivity([ActivityTrigger] T input)` |
| `CallActivityWithRetryAsync` | `CallActivityAsync`, include `TaskOptions` parameter with retry details. |
| `CallSubOrchestratorWithRetryAsync` | `CallSubOrchestratorAsync`, include `TaskOptions` parameter with retry details. |
| `CallHttpAsync` | No equivalent. Instead, write an activity that invokes your desired HTTP API. |
| `CreateReplaySafeLogger(ILogger)` | `CreateReplaySafeLogger<T>()` or `CreateReplaySafeLogger(string)` |

#### Behavioral Changes

- Serialization default behavior has changed from `Newtonsoft.Json` to `System.Text.Json`. See [here](./durable-functions-serialization-and-persistence.md) for more details.
