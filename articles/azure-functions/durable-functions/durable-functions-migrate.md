---
title: "Migrate Durable Functions from in-process to isolated worker (.NET)"
description: Step-by-step guide to migrate your .NET Durable Functions app from the in-process model to the isolated worker model. Includes code examples, API mapping, and troubleshooting.
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: azfuncdf
ms.date: 04/27/2026
ms.topic: concept-article
ms.service: azure-functions
ms.subservice: durable
# CustomerIntent: As a .NET developer using Durable Functions with the in-process model, I want to migrate to the isolated worker model so that I have continued support and access to new features.
---

# Migrate your Durable Functions app from in-process to isolated worker model (.NET)

This guide walks you through migrating your .NET Durable Functions app from the in-process model to the isolated worker model. The in-process model reaches end of support on **November 10, 2026**. After that date, no security updates or bug fixes are provided. The isolated worker model also gives you full process control, standard .NET dependency injection, and access to the latest platform features.

> [!WARNING]
> Support for the in-process model ends on **November 10, 2026**. We recommend migrating now. For background on the isolated worker model, see [.NET isolated worker process overview](../dotnet-isolated-process-guide.md).

## Prerequisites

- **Azure Functions Core Tools v4.x** or later
- **.NET 8.0 SDK** (or your target .NET version)
- **Visual Studio 2022** or **VS Code with Azure Functions extension**

## Migration overview

At a high level, the migration requires these steps:

1. [Update the project file](#update-the-project-file) — switch to executable output, replace packages
1. [Add Program.cs](#add-programcs) — create the host entry point
1. [Update package references](#update-package-references) — swap in-process packages for isolated equivalents
1. [Update function code](#update-function-code) — change attributes, types, and namespaces
1. [Update local.settings.json](#update-localsettingsjson) — set runtime to `dotnet-isolated`
1. [Test locally](#test-locally) and [deploy to Azure](#deploy-to-azure)

### Quick-reference checklist

Use this checklist to track your progress. A [detailed version](#checklist) is at the end of this guide.

- [ ] Project file: added `<OutputType>Exe</OutputType>`, replaced packages
- [ ] Created `Program.cs`, deleted `FunctionsStartup`
- [ ] Updated `[FunctionName]` → `[Function]`, replaced context/client types
- [ ] Removed all `Microsoft.Azure.WebJobs.*` references
- [ ] Updated `local.settings.json` to `dotnet-isolated`
- [ ] Tested locally and deployed

### Identify apps to migrate (optional)

If you're not sure which apps still use the in-process model, run this Azure PowerShell script:

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

Apps that show `dotnet` as the runtime use the in-process model. Apps that show `dotnet-isolated` already use the isolated worker model.

## Update the project file

### Before (in-process)

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

### After (isolated worker)

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

The main changes are switching to an executable output type and replacing all `Microsoft.Azure.WebJobs.*` packages with their `Microsoft.Azure.Functions.Worker.*` equivalents.

## Add Program.cs

The isolated worker model requires a `Program.cs` entry point. Create this file in your project root. If you have a `FunctionsStartup` class in `Startup.cs`, move those service registrations into the `ConfigureServices` block and delete `Startup.cs`.

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services => {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        
        // Add your custom services here (previously in FunctionsStartup)
        // services.AddSingleton<IMyService, MyService>();
    })
    .Build();

host.Run();
```

## Update package references

### Durable Functions package mapping

| In-process package | Isolated worker package |
| ------------------ | ---------------------- |
| `Microsoft.Azure.WebJobs.Extensions.DurableTask` | `Microsoft.Azure.Functions.Worker.Extensions.DurableTask` |
| `Microsoft.DurableTask.SqlServer.AzureFunctions` | `Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer` |
| `Microsoft.Azure.DurableTask.Netherite.AzureFunctions` | `Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite` |

### Common extension package mapping

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

This section covers the code changes for each Durable Functions type. Jump to the section for the function types your app uses:

- [Namespace changes](#namespace-changes)
- [Orchestrator functions](#orchestrator-function-changes)
- [Activity functions](#activity-function-changes)
- [Client functions](#client-function-changes)
- [Retry policies](#retry-policy-changes) (if used)
- [Entity functions](#entity-function-changes) (if used)

For a complete API-by-API mapping, see the [API reference](./durable-functions-isolated-api-mapping.md).

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

## Breaking behavior changes

Review these changes before testing your migrated app. For the complete API-by-API mapping, see the [API reference](./durable-functions-isolated-api-mapping.md).

> [!WARNING]
> **Serialization default changed**: The isolated worker uses `System.Text.Json` by default instead of `Newtonsoft.Json`. If your orchestrations pass complex objects, test serialization carefully. See [JSON serialization differences](#issue-json-serialization-differences) for configuration options.

> [!WARNING]
> **ContinueAsNew default change**: The `preserveUnprocessedEvents` parameter default changed from `false` (2.x) to `true` (isolated). If your orchestration uses `ContinueAsNew` and relies on unprocessed events being discarded, explicitly pass `preserveUnprocessedEvents: false`.

> [!NOTE]
> **RestartAsync default change**: The `restartWithNewInstanceId` parameter default changed from `true` (2.x) to `false` (isolated). If your code calls `RestartAsync` and depends on a new instance ID being generated, explicitly pass `restartWithNewInstanceId: true`.

Other notable changes:

- **Entity proxies removed** — `CreateEntityProxy<T>` isn't available. Use `Entities.CallEntityAsync` or `Entities.SignalEntityAsync` directly.
- **Cross-task-hub operations removed** — Overloads that accepted `taskHubName`/`connectionName` aren't available. Only same-task-hub operations are supported.
- **Orchestration history moved** — `DurableOrchestrationStatus.History` is no longer on the status object. Use `DurableTaskClient.GetOrchestrationHistoryAsync`.

## Update local.settings.json

The key change is setting `FUNCTIONS_WORKER_RUNTIME` from `dotnet` to `dotnet-isolated`:

```json
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
    }
}
```

> [!NOTE]
> Your storage backend configuration (Azure Storage, MSSQL, Netherite, or Durable Task Scheduler) is unchanged by the migration. Keep your existing storage-related settings.

## Test locally

Run your function app locally and verify all orchestrations, activities, and entities work correctly.

```bash
func start
```

### Verify functionality

Test the following scenarios as applicable:

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

**Symptom:** You used `IMessageSerializerSettingsFactory` in the in-process model and need the equivalent in isolated worker.

**Solution:** Configure the worker-level serializer in `Program.cs`. For details, see the [behavioral changes section](./durable-functions-isolated-api-mapping.md#behavioral-changes) of the API reference and [Serialization and persistence in Durable Functions](./durable-functions-serialization-and-persistence.md).

To use Newtonsoft.Json with custom settings:

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
> This approach requires the `Newtonsoft.Json` and `Azure.Core.Serialization` NuGet packages.

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

- [In-process to isolated worker API mapping](./durable-functions-isolated-api-mapping.md) — complete API reference for your migration
- [Durable Functions overview for .NET isolated worker](./durable-functions-dotnet-isolated-overview.md)
- [Durable Functions versions and migration guide](./durable-functions-versions.md)

## Related content

- [Official Microsoft migration guide (all Azure Functions)](../migrate-dotnet-to-isolated-model.md)
- [.NET isolated worker process overview](../dotnet-isolated-process-guide.md)
- [Isolated worker model differences](../dotnet-isolated-in-process-differences.md)
- [Serialization and persistence in Durable Functions](./durable-functions-serialization-and-persistence.md)
- [Zero-downtime deployment for Durable Functions](./durable-functions-zero-downtime-deployment.md)
- [Configure Durable Task Scheduler](../../durable-task/scheduler/develop-with-durable-task-scheduler.md)