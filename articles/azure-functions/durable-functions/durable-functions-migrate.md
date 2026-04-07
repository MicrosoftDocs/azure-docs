---
title: Migrate your Durable Functions app from In-Process to Isolated Worker Model
description: Learn how to migrate your Durable Functions application from the in-process model to the isolated worker model.
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: azfuncdf
ms.date: 02/25/2026
ms.topic: concept-article
ms.service: azure-functions
ms.subservice: durable
---

# Migrate from In-Process to Isolated Worker model

This guide shows you how to migrate your Durable Functions application from the in-process model to the isolated worker model.

> [!WARNING]
> Support for the in-process model ends on **November 10, 2026**. Migrate to the isolated worker model for continued support and access to new features.

## Why migrate?

### In-process model end of support

Microsoft announced that the in-process model for .NET Azure Functions reaches end of support on November 10, 2026. After this date:

- No security updates are provided
- No bug fixes are released
- New features are only available in the isolated worker model

### Benefits of the isolated worker model

Migrating to the isolated worker model provides the following benefits:

| Benefit | Description |
| ------- | ----------- |
| **No assembly conflicts** | Your code runs in a separate process, eliminating version conflicts |
| **Full process control** | Control startup, configuration, and middleware via `Program.cs` |
| **Standard DI patterns** | Use familiar .NET dependency injection |
| **.NET version flexibility** | Support for LTS, STS, and .NET Framework |
| **Middleware support** | Full ASP.NET Core middleware pipeline |
| **Better performance** | ASP.NET Core integration for HTTP triggers |
| **Platform support** | Access to Flex Consumption plan and .NET Aspire |

## Prerequisites

Before starting the migration, make sure you have the following prerequisites:

- **Azure Functions Core Tools v4.x** or later
- **.NET 8.0 SDK** (or your target .NET version)
- **Visual Studio 2022** or **VS Code with Azure Functions extension**
- Familiarity with [Durable Functions concepts](../../durable-task/common/durable-task-orchestrations.md)

## Migration overview

The migration process involves these main steps:

1. [Identify apps to migrate](#identify-apps-to-migrate)
1. [Update the project file](#update-the-project-file)
1. [Add Program.cs](#add-programcs)
1. [Update package references](#update-package-references)
1. [Update function code](#update-function-code)
1. [Update local.settings.json](#update-localsettingsjson)
1. [Test locally](#test-locally)
1. [Deploy to Azure](#deploy-to-azure)

## Identify apps to migrate

Use this Azure PowerShell script to find function apps in your subscription that use the in-process model:

```powershell
$FunctionApps = Get-AzFunctionApp

$AppInfo = @{}

foreach ($App in $FunctionApps)
{
     if ($App.Runtime -eq 'dotnet')
     {
          $AppInfo.Add($App.Name, $App.Runtime)
     }
}

$AppInfo
```

Apps that show `dotnet` as the runtime use the in-process model. Apps that use `dotnet-isolated` already use the isolated worker model.

## Update the project file

### Before (In-Process)

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="4.1.1" />
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.DurableTask" Version="2.13.0" />
  </ItemGroup>
</Project>
```

### After (Isolated Worker)

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <OutputType>Exe</OutputType>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
  <ItemGroup>
    <FrameworkReference Include="Microsoft.AspNetCore.App" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.21.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.17.2" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore" Version="1.2.1" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask" Version="1.14.1" />
    <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.22.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="1.2.0" />
  </ItemGroup>
  <ItemGroup>
    <Using Include="System.Threading.ExecutionContext" Alias="ExecutionContext"/>
  </ItemGroup>
</Project>
```

### Key changes

- Add `<OutputType>Exe</OutputType>` - The isolated worker is an executable
- Add `<FrameworkReference Include="Microsoft.AspNetCore.App" />` - For ASP.NET Core integration
- Replace `Microsoft.NET.Sdk.Functions` with `Microsoft.Azure.Functions.Worker.*` packages
- Replace `Microsoft.Azure.WebJobs.Extensions.DurableTask` with `Microsoft.Azure.Functions.Worker.Extensions.DurableTask`

## Add Program.cs

Create a new `Program.cs` file in your project root:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services => {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
    })
    .Build();

host.Run();
```

### With custom services

If you had a `FunctionsStartup` class, move that configuration to `Program.cs`:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services => {
        // Application Insights
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        
        // Your custom services (previously in FunctionsStartup)
        services.AddSingleton<IMyService, MyService>();
        services.AddHttpClient<IApiClient, ApiClient>();
    })
    .Build();

host.Run();
```

### Delete FunctionsStartup

If you have a `Startup.cs` with `[assembly: FunctionsStartup(...)]`, delete it after moving the configuration to `Program.cs`.

## Update package references

### Durable Functions package changes

| In-process package | Isolated worker package |
| ------------------ | ---------------------- |
| `Microsoft.Azure.WebJobs.Extensions.DurableTask` | `Microsoft.Azure.Functions.Worker.Extensions.DurableTask` |
| `Microsoft.DurableTask.SqlServer.AzureFunctions` | `Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer` |
| `Microsoft.Azure.DurableTask.Netherite.AzureFunctions` | `Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite` |

### Common extension package changes

| In-process | Isolated worker |
| ---------- | --------------- |
| `Microsoft.Azure.WebJobs.Extensions.Storage` | `Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs`, `.Queues`, `.Tables` |
| `Microsoft.Azure.WebJobs.Extensions.CosmosDB` | `Microsoft.Azure.Functions.Worker.Extensions.CosmosDB` |
| `Microsoft.Azure.WebJobs.Extensions.ServiceBus` | `Microsoft.Azure.Functions.Worker.Extensions.ServiceBus` |
| `Microsoft.Azure.WebJobs.Extensions.EventHubs` | `Microsoft.Azure.Functions.Worker.Extensions.EventHubs` |
| `Microsoft.Azure.WebJobs.Extensions.EventGrid` | `Microsoft.Azure.Functions.Worker.Extensions.EventGrid` |

> [!IMPORTANT]
> Remove any references to `Microsoft.Azure.WebJobs.*` namespaces and `Microsoft.Azure.Functions.Extensions` from your project.

## Update function code

### Namespace changes

```csharp
// Before (In-Process)
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Azure.WebJobs.Extensions.Http;

// After (Isolated Worker)
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.DurableTask;
using Microsoft.DurableTask.Client;
using Microsoft.DurableTask.Entities;
```

### Function attribute changes

```csharp
// Before (In-Process)
[FunctionName("MyOrchestrator")]

// After (Isolated Worker)
[Function(nameof(MyOrchestrator))]
```

### Orchestrator function changes

**Before (In-Process):**

```csharp
[FunctionName("OrderOrchestrator")]
public static async Task<OrderResult> RunOrchestrator(
    [OrchestrationTrigger] IDurableOrchestrationContext context,
    ILogger log)
{
    var order = context.GetInput<Order>();
    
    await context.CallActivityAsync("ValidateOrder", order);
    await context.CallActivityAsync("ProcessPayment", order.Payment);
    await context.CallActivityAsync("ShipOrder", order);
    
    return new OrderResult { Success = true };
}
```

**After (Isolated Worker):**

```csharp
[Function(nameof(OrderOrchestrator))]
public static async Task<OrderResult> OrderOrchestrator(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    ILogger logger = context.CreateReplaySafeLogger(nameof(OrderOrchestrator));
    var order = context.GetInput<Order>();
    
    await context.CallActivityAsync("ValidateOrder", order);
    await context.CallActivityAsync("ProcessPayment", order.Payment);
    await context.CallActivityAsync("ShipOrder", order);
    
    return new OrderResult { Success = true };
}
```

### Key differences

| Aspect | In-Process | Isolated Worker |
| ------ | ---------- | --------------- |
| Context type | `IDurableOrchestrationContext` | `TaskOrchestrationContext` |
| Logger | `ILogger` parameter | `context.CreateReplaySafeLogger()` |
| Attribute | `[FunctionName]` | `[Function]` |

### Activity function changes

**Before (In-Process):**

```csharp
[FunctionName("ValidateOrder")]
public static bool ValidateOrder(
    [ActivityTrigger] Order order,
    ILogger log)
{
    log.LogInformation("Validating order {OrderId}", order.Id);
    return order.Items.Any() && order.TotalAmount > 0;
}
```

**After (Isolated Worker):**

```csharp
[Function(nameof(ValidateOrder))]
public static bool ValidateOrder(
    [ActivityTrigger] Order order,
    FunctionContext executionContext)
{
    ILogger logger = executionContext.GetLogger(nameof(ValidateOrder));
    logger.LogInformation("Validating order {OrderId}", order.Id);
    return order.Items.Any() && order.TotalAmount > 0;
}
```

### Client function changes

**Before (In-Process):**

```csharp
[FunctionName("StartOrder")]
public static async Task<IActionResult> StartOrder(
    [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req,
    [DurableClient] IDurableOrchestrationClient client,
    ILogger log)
{
    var order = await req.ReadFromJsonAsync<Order>();
    string instanceId = await client.StartNewAsync("OrderOrchestrator", order);
    
    return client.CreateCheckStatusResponse(req, instanceId);
}
```

**After (Isolated Worker):**

```csharp
[Function("StartOrder")]
public static async Task<HttpResponseData> StartOrder(
    [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req,
    [DurableClient] DurableTaskClient client,
    FunctionContext executionContext)
{
    ILogger logger = executionContext.GetLogger("StartOrder");
    var order = await req.ReadFromJsonAsync<Order>();
    string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
        nameof(OrderOrchestrator), 
        order
    );
    
    return await client.CreateCheckStatusResponseAsync(req, instanceId);
}
```

### Client type changes

| In-process | Isolated worker |
| ---------- | --------------- |
| `IDurableOrchestrationClient` | `DurableTaskClient` |
| `StartNewAsync()` | `ScheduleNewOrchestrationInstanceAsync()` |
| `CreateCheckStatusResponse()` | `CreateCheckStatusResponseAsync()` |
| `HttpRequest` / `IActionResult` | `HttpRequestData` / `HttpResponseData` |

### Retry policy changes

In-process uses `RetryOptions` with `CallActivityWithRetryAsync`. The isolated worker uses `TaskOptions` with the standard `CallActivityAsync`.

**Before (In-Process):**

```csharp
var retryOptions = new RetryOptions(
    firstRetryInterval: TimeSpan.FromSeconds(5),
    maxNumberOfAttempts: 3);

string result = await context.CallActivityWithRetryAsync<string>(
    "MyActivity", retryOptions, input);
```

**After (Isolated Worker):**

```csharp
var retryOptions = new TaskOptions(
    new TaskRetryOptions(new RetryPolicy(
        maxNumberOfAttempts: 3,
        firstRetryInterval: TimeSpan.FromSeconds(5))));

string result = await context.CallActivityAsync<string>(
    "MyActivity", input, retryOptions);
```

### Entity function changes

**Before (In-Process):**

```csharp
[FunctionName(nameof(Counter))]
public static void Counter([EntityTrigger] IDurableEntityContext ctx)
{
    switch (ctx.OperationName.ToLowerInvariant())
    {
        case "add":
            ctx.SetState(ctx.GetState<int>() + ctx.GetInput<int>());
            break;
        case "get":
            ctx.Return(ctx.GetState<int>());
            break;
    }
}
```

**After (Isolated Worker):**

```csharp
[Function(nameof(Counter))]
public static Task Counter([EntityTrigger] TaskEntityDispatcher dispatcher)
{
    return dispatcher.DispatchAsync<CounterEntity>();
}

public class CounterEntity
{
    public int Value { get; set; }
    
    public void Add(int amount) => Value += amount;
    public int Get() => Value;
}
```

## Complete API reference

The following tables provide a comprehensive mapping between the in-process 2.x SDK and the isolated worker SDK APIs.

### Client APIs

| In-process (2.x) | Isolated worker |
| ---- | ---- |
| `IDurableOrchestrationClient` | `DurableTaskClient` |
| `IDurableOrchestrationClient.StartNewAsync` | `DurableTaskClient.ScheduleNewOrchestrationInstanceAsync` |
| `IDurableOrchestrationClient.GetStatusAsync` | `DurableTaskClient.GetInstanceAsync` |
| `IDurableOrchestrationClient.ListInstancesAsync` | `DurableTaskClient.GetAllInstancesAsync` |
| `IDurableOrchestrationClient.TerminateAsync` | `DurableTaskClient.TerminateInstanceAsync` |
| `IDurableOrchestrationClient.SuspendAsync` | `DurableTaskClient.SuspendInstanceAsync` |
| `IDurableOrchestrationClient.ResumeAsync` | `DurableTaskClient.ResumeInstanceAsync` |
| `IDurableOrchestrationClient.RaiseEventAsync` | `DurableTaskClient.RaiseEventAsync` |
| `IDurableOrchestrationClient.RewindAsync` | `DurableTaskClient.RewindInstanceAsync` |
| `IDurableOrchestrationClient.RestartAsync` | `DurableTaskClient.RestartAsync` |
| `IDurableOrchestrationClient.PurgeInstanceHistoryAsync` | `DurableTaskClient.PurgeInstanceAsync` or `PurgeAllInstancesAsync` |
| `IDurableOrchestrationClient.CreateCheckStatusResponse` | `DurableTaskClient.CreateCheckStatusResponseAsync` (extension method, takes `HttpRequestData`) |
| `IDurableOrchestrationClient.WaitForCompletionOrCreateCheckStatusResponseAsync` | `DurableTaskClient.WaitForCompletionOrCreateCheckStatusResponseAsync` (extension method, `timeout` replaced by `CancellationToken`) |
| `IDurableOrchestrationClient.CreateHttpManagementPayload` | `DurableTaskClient.CreateHttpManagementPayload` (extension method) |
| `IDurableOrchestrationClient.MakeCurrentAppPrimaryAsync` | Removed |
| `IDurableOrchestrationClient.GetStatusAsync(IEnumerable<string>)` | Removed. Use `GetInstanceAsync` in a loop or `GetAllInstancesAsync` with a query filter. |
| `IDurableOrchestrationClient.PurgeInstanceHistoryAsync(IEnumerable<string>)` | Removed. Use `PurgeInstanceAsync` in a loop or `PurgeAllInstancesAsync` with a filter. |
| `IDurableOrchestrationClient.RaiseEventAsync` (cross-task-hub overload with `taskHubName`) | Removed. Only same-task-hub raise event is supported. |
| `IDurableEntityClient.SignalEntityAsync` | `DurableTaskClient.Entities.SignalEntityAsync` |
| `IDurableEntityClient.SignalEntityAsync` (cross-task-hub overload with `taskHubName`, `connectionName`) | Removed. Only same-task-hub entity operations are supported. |
| `IDurableEntityClient.ReadEntityStateAsync` | `DurableTaskClient.Entities.GetEntityAsync` |
| `IDurableEntityClient.ReadEntityStateAsync` (cross-task-hub overload with `taskHubName`, `connectionName`) | Removed. Only same-task-hub entity operations are supported. |
| `IDurableEntityClient.ListEntitiesAsync` | `DurableTaskClient.Entities.GetAllEntitiesAsync` |
| `IDurableEntityClient.CleanEntityStorageAsync` | `DurableTaskClient.Entities.CleanEntityStorageAsync` (takes `CleanEntityStorageRequest` object instead of bool parameters) |
| `DurableOrchestrationStatus` | `OrchestrationMetadata` |
| `DurableOrchestrationStatus.History` | Removed from status object. Use `DurableTaskClient.GetOrchestrationHistoryAsync` instead. |
| `PurgeHistoryResult` | `PurgeResult` |
| `OrchestrationStatusQueryCondition` | `OrchestrationQuery` |
| `OrchestrationStatusQueryResult` | `AsyncPageable<OrchestrationMetadata>` |

### Orchestration context APIs

| In-process (2.x) | Isolated worker |
| ---- | ---- |
| `IDurableOrchestrationContext` | `TaskOrchestrationContext` |
| `IDurableOrchestrationContext.GetInput<T>()` | `TaskOrchestrationContext.GetInput<T>()` or inject input as a parameter: `MyOrchestration([OrchestrationTrigger] TaskOrchestrationContext context, T input)` |
| `IDurableOrchestrationContext.SetOutput` | Removed. Use the return value from the orchestrator function. |
| `IDurableOrchestrationContext.CallActivityWithRetryAsync` | `TaskOrchestrationContext.CallActivityAsync` with a `TaskOptions` parameter for retry details. |
| `IDurableOrchestrationContext.CallSubOrchestratorWithRetryAsync` | `TaskOrchestrationContext.CallSubOrchestratorAsync` with a `TaskOptions` parameter for retry details. |
| `IDurableOrchestrationContext.CallHttpAsync` | `TaskOrchestrationContext.CallHttpAsync` |
| `IDurableOrchestrationContext.CreateTimer<T>(DateTime, T, CancellationToken)` | `TaskOrchestrationContext.CreateTimer(DateTime, CancellationToken)`. State parameter removed. |
| `IDurableOrchestrationContext.WaitForExternalEvent(string)` (non-generic) | Removed. Use `WaitForExternalEvent<T>(string, CancellationToken)`. |
| `IDurableOrchestrationContext.WaitForExternalEvent<T>(string, TimeSpan, T)` (with `defaultValue`) | Removed. Use `WaitForExternalEvent<T>(string, TimeSpan, CancellationToken)`, which throws `TaskCanceledException` on timeout. |
| `IDurableOrchestrationContext.ParentInstanceId` | `TaskOrchestrationContext.Parent.InstanceId` |
| `IDurableOrchestrationContext.CreateReplaySafeLogger(ILogger)` | `TaskOrchestrationContext.CreateReplaySafeLogger<T>()` or `TaskOrchestrationContext.CreateReplaySafeLogger(string)` |
| `IDurableOrchestrationContext.CreateEntityProxy<T>` | Removed. Use `Entities.CallEntityAsync` or `Entities.SignalEntityAsync` directly. |
| `IDurableOrchestrationContext.CallEntityAsync` | `TaskOrchestrationContext.Entities.CallEntityAsync` |
| `IDurableOrchestrationContext.SignalEntity` | `TaskOrchestrationContext.Entities.SignalEntityAsync` |
| `IDurableOrchestrationContext.LockAsync` | `TaskOrchestrationContext.Entities.LockEntitiesAsync` |
| `IDurableOrchestrationContext.IsLocked` | `TaskOrchestrationContext.Entities.InCriticalSection()` |
| `RetryOptions` | `TaskOptions` with `TaskRetryOptions` |
| `DurableActivityContext` | No equivalent |
| `DurableActivityContext.GetInput<T>()` | Inject input as a parameter: `MyActivity([ActivityTrigger] T input)` |
| `DurableHttpRequest` (WebJobs namespace) | `DurableHttpRequest` (`Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Http` namespace) |
| `DurableHttpResponse` (WebJobs namespace) | `DurableHttpResponse` (`Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Http` namespace) |

### Entity APIs

| In-process (2.x) | Isolated worker |
| ---- | ---- |
| `IDurableEntityContext` | `TaskEntityContext` |
| `IDurableEntityContext.EntityName` | `TaskEntityContext.Id.Name` |
| `IDurableEntityContext.EntityKey` | `TaskEntityContext.Id.Key` |
| `IDurableEntityContext.OperationName` | `TaskEntityOperation.Name` |
| `IDurableEntityContext.FunctionBindingContext` | Removed. Add `FunctionContext` as an input parameter. |
| `IDurableEntityContext.HasState` | `TaskEntityOperation.State.HasState` |
| `IDurableEntityContext.GetState` | `TaskEntityOperation.State.GetState` |
| `IDurableEntityContext.SetState` | `TaskEntityOperation.State.SetState` |
| `IDurableEntityContext.DeleteState` | `TaskEntityOperation.State.SetState(null)` |
| `IDurableEntityContext.GetInput` | `TaskEntityOperation.GetInput` |
| `IDurableEntityContext.Return` | Removed. Use the method return value instead. |
| `IDurableEntityContext.SignalEntity` | `TaskEntityContext.SignalEntity`. Scheduled signals use `SignalEntityOptions.SignalTime` instead of a `DateTime` parameter overload. |
| `IDurableEntityContext.StartNewOrchestration` | `TaskEntityContext.ScheduleNewOrchestration`. Instance ID is set via `StartOrchestrationOptions.InstanceId` instead of a string parameter. |
| `IDurableEntityContext.DispatchAsync` | `TaskEntityDispatcher.DispatchAsync`. Constructor params removed; use standard DI instead. |
| `IDurableEntityContext.BatchSize` | Removed |
| `IDurableEntityContext.BatchPosition` | Removed |

### Behavioral changes

- **Serialization**: The default serializer changed from `Newtonsoft.Json` to `System.Text.Json`. For more information, see [Serialization and persistence in Durable Functions](./durable-functions-serialization-and-persistence.md).

> [!WARNING]
> **ContinueAsNew default change**: The `preserveUnprocessedEvents` parameter default changed from `false` (2.x) to `true` (isolated). If your orchestration uses `ContinueAsNew` and relies on unprocessed events being discarded, explicitly pass `preserveUnprocessedEvents: false`.

> [!NOTE]
> **RestartAsync default change**: The `restartWithNewInstanceId` parameter default changed from `true` (2.x) to `false` (isolated). If your code calls `RestartAsync` and depends on a new instance ID being generated, explicitly pass `restartWithNewInstanceId: true`.

- **Entity proxy removal**: `CreateEntityProxy<T>` and the typed `SignalEntityAsync<TEntityInterface>(Action<T>)` delegate overloads aren't available in the isolated worker. Call `Entities.CallEntityAsync` or `Entities.SignalEntityAsync` directly with string-based operation names instead of using typed proxy interfaces.
- **WaitForCompletionOrCreateCheckStatusResponseAsync**: The `timeout` parameter was removed. Use a `CancellationToken` with a cancellation timeout instead.
- **Cross-task-hub operations removed**: The in-process overloads that accepted `taskHubName` and `connectionName` parameters (on `RaiseEventAsync`, `SignalEntityAsync`, and `ReadEntityStateAsync`) aren't available in isolated worker. Only same-task-hub operations are supported.
- **Batch operations by ID removed**: The in-process `GetStatusAsync(IEnumerable<string>)` and `PurgeInstanceHistoryAsync(IEnumerable<string>)` overloads aren't available in isolated worker. Use `GetAllInstancesAsync` with an `OrchestrationQuery` filter or call `GetInstanceAsync`/`PurgeInstanceAsync` individually.
- **Orchestration history moved**: `DurableOrchestrationStatus.History` (the embedded `JArray`) is no longer part of the status object. Use the separate `DurableTaskClient.GetOrchestrationHistoryAsync` API to retrieve orchestration history.
- **Entity DispatchAsync constructor params removed**: The `DispatchAsync<T>(params object[])` constructor parameter overload isn't available. Entity classes are activated through standard dependency injection. Register your entity's dependencies in `Program.cs`.
- **Entity query filter changes**: `EntityQuery.EntityName` is replaced by `EntityQuery.InstanceIdStartsWith`, and `EntityQuery.IncludeDeleted` is replaced by `EntityQuery.IncludeTransient`.
- **CleanEntityStorageAsync signature change**: Instead of `(bool removeEmptyEntities, bool releaseOrphanedLocks, CancellationToken)`, the isolated version takes a `CleanEntityStorageRequest` object with `RemoveEmptyEntities` and `ReleaseOrphanedLocks` properties.
- **New APIs in isolated worker**: `DurableTaskClient.GetOrchestrationHistoryAsync` and the `TaskOrchestrationContext.GetFunctionContext()` extension method are available in the isolated worker but have no in-process equivalent.

## Update local.settings.json

```json
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
        "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:8080;Authentication=None"
    }
}
```

The key change is `FUNCTIONS_WORKER_RUNTIME` from `dotnet` to `dotnet-isolated`.

## Test locally

### Start the emulator

```bash
docker run -d -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:latest
```

### Run the function app

```bash
func start
```

### Verify functionality

Test all your orchestrations, activities, and entities to make sure they work correctly:

1. Start an orchestration with an HTTP trigger
1. Monitor the orchestration status
1. Verify the activity execution order
1. Test entity operations if applicable
1. Check Application Insights telemetry

## Deploy to Azure

### Recommended: Use deployment slots

Use deployment slots to minimize downtime:

1. **Create a staging slot** for your function app.
1. **Update staging slot configuration:**
   - Set `FUNCTIONS_WORKER_RUNTIME` to `dotnet-isolated`.
   - Update .NET stack version if needed.
1. **Deploy migrated code** to the staging slot.
1. **Test thoroughly** in the staging slot.
1. **Perform slot swap** to move changes to production.

### Update application settings

In the Azure portal or via CLI:

```bash
az functionapp config appsettings set \
    --name <FUNCTION_APP_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --settings FUNCTIONS_WORKER_RUNTIME=dotnet-isolated
```

### Update stack configuration

If targeting a different .NET version:

```bash
az functionapp config set \
    --name <FUNCTION_APP_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --net-framework-version v8.0
```

## Common migration issues

### Issue: Assembly load errors

**Symptom:** `Could not load file or assembly` errors.

**Solution:** Ensure you remove all `Microsoft.Azure.WebJobs.*` package references and replace them with isolated worker equivalents.

### Issue: Binding attribute not found

**Symptom:** `The type or namespace 'QueueTrigger' could not be found`

**Solution:** Add the appropriate extension package and update using statements:

```csharp
// Add using statement
using Microsoft.Azure.Functions.Worker;

// Install package
// dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues
```

### Issue: IDurableOrchestrationContext not found

**Symptom:** `The type or namespace 'IDurableOrchestrationContext' could not be found`

**Solution:** Replace with `TaskOrchestrationContext`:

```csharp
using Microsoft.DurableTask;

[Function(nameof(MyOrchestrator))]
public static async Task MyOrchestrator([OrchestrationTrigger] TaskOrchestrationContext context)
{
    // ...
}
```

### Issue: JSON serialization differences

**Symptom:** Serialization errors or unexpected data formats

**Solution:** The isolated model uses `System.Text.Json` by default. Configure serialization in `Program.cs`:

```csharp
var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services => {
        services.Configure<JsonSerializerOptions>(options => {
            options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        });
    })
    .Build();
```

To use Newtonsoft.Json instead:

```csharp
services.Configure<WorkerOptions>(options => {
    options.Serializer = new NewtonsoftJsonObjectSerializer();
});
```

### Issue: Migrating custom serialization settings

**Symptom:** You used `IMessageSerializerSettingsFactory` in the in-process model to customize JSON serialization for orchestration inputs, outputs, or entity state, and need the equivalent in isolated worker.

**Solution:** The `IMessageSerializerSettingsFactory` interface isn't available in isolated worker. Instead, configure the worker-level serializer in `Program.cs`:

Before (In-Process):

```csharp
// Startup.cs
[assembly: FunctionsStartup(typeof(MyStartup))]
public class MyStartup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services.AddSingleton<IMessageSerializerSettingsFactory, CustomSerializerSettingsFactory>();
    }
}
```

After (Isolated Worker):

```csharp
// Program.cs
var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        services.Configure<WorkerOptions>(options =>
        {
            var settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.None,
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
            };
            options.Serializer = new NewtonsoftJsonObjectSerializer(settings);
        });
    })
    .Build();
```

> [!NOTE]
> This approach requires the `Newtonsoft.Json` and `Azure.Core.Serialization` NuGet packages. The `WorkerOptions.Serializer` setting applies globally to everything serialized by the Durable Functions extension. For more details, see [Serialization and persistence in Durable Functions](./durable-functions-serialization-and-persistence.md).

## Checklist

Use this checklist to ensure a complete migration:

- Updated project file with `<OutputType>Exe</OutputType>`
- Replaced `Microsoft.NET.Sdk.Functions` with worker packages
- Replaced `Microsoft.Azure.WebJobs.Extensions.DurableTask` with isolated package
- Created `Program.cs` with host configuration
- Removed `FunctionsStartup` class (if present)
- Updated all `[FunctionName]` to `[Function]`
- Replaced `IDurableOrchestrationContext` with `TaskOrchestrationContext`
- Replaced `IDurableOrchestrationClient` with `DurableTaskClient`
- Updated logging to use DI or `FunctionContext`
- Updated `local.settings.json` with `dotnet-isolated` runtime
- Removed all `Microsoft.Azure.WebJobs.*` using statements
- Added `Microsoft.Azure.Functions.Worker` using statements
- Replaced `CreateEntityProxy<T>` with direct `CallEntityAsync`/`SignalEntityAsync` calls
- Replaced cross-task-hub operation overloads (if used)
- Replaced batch `GetStatusAsync`/`PurgeInstanceHistoryAsync` by-ID calls with filter-based or individual calls
- Migrated `DurableOrchestrationStatus.History` access to `GetOrchestrationHistoryAsync`
- Updated entity `DispatchAsync` constructor params to use DI
- Tested all functions locally
- Deployed to staging slot and verified
- Swapped to production

## Next steps

- [.NET isolated worker process overview](../dotnet-isolated-process-guide.md)
- [Durable Functions overview for .NET isolated worker](./durable-functions-dotnet-isolated-overview.md)
- [Durable Functions patterns and technical concepts](./durable-functions-overview.md)

## Additional resources

- [Official Microsoft migration guide](../migrate-dotnet-to-isolated-model.md)
- [Isolated worker model differences](../dotnet-isolated-in-process-differences.md)
- [Unit testing guide for Durable Functions (isolated)](./durable-functions-unit-testing.md)
- [Serialization and persistence in Durable Functions](./durable-functions-serialization-and-persistence.md)
- [Versioning in Durable Functions](./durable-functions-versioning.md)
- [Zero-downtime deployment for Durable Functions](./durable-functions-zero-downtime-deployment.md)
- [Configure Durable Task Scheduler](../../durable-task/scheduler/develop-with-durable-task-scheduler.md)
- [Code samples for Durable Functions](/samples/browse/?term=durable%20functions)