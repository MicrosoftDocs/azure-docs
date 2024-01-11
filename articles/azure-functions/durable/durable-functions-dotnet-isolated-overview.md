---
title: Overview of Durable Functions in the .NET isolated worker - Azure
description: Learn about Durable Functions in the Azure Functions .NET isolated worker process, which supports non-LTS versions of .NET and .NET Framework apps.
author: jviau
ms.topic: overview
ms.date: 01/24/2023
ms.author: azfuncdf
ms.devlang: csharp
ms.custom: devx-track-dotnet
#Customer intent: As a developer, I want to learn about Durable Functions for the Azure Functions .NET isolated worker process.
---

# Overview of Durable Functions in the .NET isolated worker

This article is an overview of Durable Functions in the [.NET isolated worker](../dotnet-isolated-process-guide.md). The isolated worker allows your Durable Functions app to run on a .NET version different than that of the Azure Functions host.

## Why use Durable Functions in the .NET isolated worker?

Using this model lets you get all the great benefits that come with the Azure Functions .NET isolated worker process. For more information, see [here](../dotnet-isolated-process-guide.md#why-net-functions-isolated-worker-process). Additionally, this new SDK includes some new [features](#feature-improvements-over-in-process-durable-functions).

### Feature improvements over in-process Durable Functions

- Orchestration input can be injected directly: `MyOrchestration([OrchestrationTrigger] TaskOrchestrationContext context, T input)`
- Support for strongly typed calls and class-based activities and orchestrations (NOTE: in preview. For more information, see [here](#source-generator-and-class-based-activities-and-orchestrations).)
- Plus all the benefits of the Azure Functions .NET isolated worker.

### Source generator and class-based activities and orchestrations

**Requirement**: add `<PackageReference Include="Microsoft.DurableTask.Generators" Version="1.0.0-preview.1" />` to your project.

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

#### Class-based example

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

## Durable entities
Durable entities are supported in the .NET isolated worker. See [developer's guide](./durable-functions-dotnet-entities.md).

## Migration guide

This guide assumes you're starting with a .NET Durable Functions 2.x project.

### Update your project

The first step is to update your project to [Azure Functions .NET isolated](../migrate-version-3-version-4.md). Then, update your Durable Functions NuGet package references.

Old:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.DurableTask" Version="2.9.0" />
</ItemGroup>
```

New:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask" Version="1.1.0" />
</ItemGroup>
```

### Update your code

Durable Functions for .NET isolated worker is an entirely new package with different types and namespaces. There are required changes to your code as a result, but many of the APIs line up with no changes needed.

#### Host.json schema

The schema for Durable Functions .NET isolated worker and Durable Functions 2.x has remained the same, no changes should be needed.

#### Public API changes

This table isn't an exhaustive list of changes.

| 2.x | Isolated |
| ---- | ---- |
| `IDurableOrchestrationClient` | `DurableTaskClient` |
| `IDurableOrchestrationClient.StartNewAsync` | `DurableTaskClient.ScheduleNewOrchestrationInstanceAsync` |
| `IDurableEntityClient.SignalEntityAsync` | `DurableTaskClient.Entities.SignalEntityAsync` |
| `IDurableEntityClient.ReadEntityStateAsync` | `DurableTaskClient.Entities.GetEntityAsync` |
| `IDurableEntityClient.ListEntitiesAsync` | `DurableTaskClient.Entities.GetAllEntitiesAsync` |
| `IDurableEntityClient.CleanEntityStorageAsync` | `DurableTaskClient.Entities.CleanEntityStorageAsync` |
| `IDurableOrchestrationContext` | `TaskOrchestrationContext` |
| `IDurableOrchestrationContext.GetInput<T>()` | `TaskOrchestrationContext.GetInput<T>()` or inject input as a parameter: `MyOrchestration([OrchestrationTrigger] TaskOrchestrationContext context, T input)` |
| `DurableActivityContext` | No equivalent |
| `DurableActivityContext.GetInput<T>()` | Inject input as a parameter `MyActivity([ActivityTrigger] T input)` |
| `IDurableOrchestrationContext.CallActivityWithRetryAsync` | `TaskOrchestrationContext.CallActivityAsync`, include `TaskOptions` parameter with retry details. |
| `IDurableOrchestrationContext.CallSubOrchestratorWithRetryAsync` | `TaskOrchestrationContext.CallSubOrchestratorAsync`, include `TaskOptions` parameter with retry details. |
| `IDurableOrchestrationContext.CallHttpAsync` | `TaskOrchestrationContext.CallHttpAsync` |
| `IDurableOrchestrationContext.CreateReplaySafeLogger(ILogger)` | `TaskOrchestrationContext.CreateReplaySafeLogger<T>()` or `TaskOrchestrationContext.CreateReplaySafeLogger(string)` |
| `IDurableOrchestrationContext.CallEntityAsync` | `TaskOrchestrationContext.Entities.CallEntityAsync` |
| `IDurableOrchestrationContext.SignalEntity` | `TaskOrchestrationContext.Entities.SignalEntityAsync` |
| `IDurableOrchestrationContext.LockAsync` | `TaskOrchestrationContext.Entities.LockEntitiesAsync` |
| `IDurableOrchestrationContext.IsLocked` | `TaskOrchestrationContext.Entities.InCriticalSection` |
| `IDurableEntityContext` | `TaskEntityContext`. |
| `IDurableEntityContext.EntityName` | `TaskEntityContext.Id.Name` |
| `IDurableEntityContext.EntityKey` | `TaskEntityContext.Id.Key` |
| `IDurableEntityContext.OperationName` | `TaskEntityOperation.Name` |
| `IDurableEntityContext.FunctionBindingContext` | Removed, add `FunctionContext` as an input parameter |
| `IDurableEntityContext.HasState` | `TaskEntityOperation.State.HasState` |
| `IDurableEntityContext.BatchSize` | Removed |
| `IDurableEntityContext.BatchPosition` | Removed |
| `IDurableEntityContext.GetState` | `TaskEntityOperation.State.GetState` |
| `IDurableEntityContext.SetState` | `TaskEntityOperation.State.SetState` |
| `IDurableEntityContext.DeleteState` | `TaskEntityOperation.State.SetState(null)` |
| `IDurableEntityContext.GetInput` | `TaskEntityOperation.GetInput` |
| `IDurableEntityContext.Return` | Removed. Method return value used instead. |
| `IDurableEntityContext.SignalEntity` | `TaskEntityContext.SignalEntity` |
| `IDurableEntityContext.StartNewOrchestration` | `TaskEntityContext.ScheduleNewOrchestration` |
| `IDurableEntityContext.DispatchAsync` | `TaskEntityDispatcher.DispatchAsync`. Constructor params removed. |

#### Behavioral changes

- Serialization default behavior has changed from `Newtonsoft.Json` to `System.Text.Json`. For more information, see [here](./durable-functions-serialization-and-persistence.md).
