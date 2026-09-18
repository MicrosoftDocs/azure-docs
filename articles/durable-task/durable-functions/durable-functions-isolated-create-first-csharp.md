---
title: "Quickstart: Create a C# Durable Functions app"
description: Run a C# Durable Functions sample app with function chaining using the Durable Task Scheduler emulator. Get started now.
author: hhunter-ms
ms.author: hannahhunter
ms.topic: quickstart
ms.service: durable-task
ms.subservice: durable-functions
ms.date: 06/03/2026
ms.reviewer: azfuncdf
ms.devlang: csharp
ms.custom: devx-track-dotnet
---

# Quickstart: Create a C# Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../../azure-functions/functions-overview.md), to write stateful serverless workflows in C#. In this quickstart, you clone and run a sample app that demonstrates the function chaining orchestration pattern:

- **Function chaining**: Calls activities sequentially (Tokyo → Seattle → London).

By the end, you'll have the orchestration running locally with the [Durable Task Scheduler](../scheduler/durable-task-scheduler.md) emulator and be able to view its status in the dashboard.

> [!div class="checklist"]
>
> - Clone and prepare the Hello Cities sample project.
> - Set up the Durable Task Scheduler emulator and Azurite for local development.
> - Build and run the function app and trigger the orchestration.
> - Review orchestration status and output in the Durable Task Scheduler dashboard.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download) or later installed.
- [Azure Functions Core Tools](../../azure-functions/functions-run-local.md) v4 or later.
- [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator and Azurite.
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.

## Set up the Durable Task Scheduler emulator

The [Durable Task Scheduler emulator](../scheduler/develop-with-durable-task-scheduler.md#durable-task-scheduler-emulator) provides a local development environment so you can test orchestrations without an Azure subscription. The .NET Functions host also requires [Azurite](../../storage/common/storage-use-azurite.md) for local storage.

Start both containers:

```bash
docker run -d --name dtsemulator -p 8080:8080 -p 8082:8082 \
  mcr.microsoft.com/dts/dts-emulator:latest

docker run -d --name azurite -p 10000:10000 -p 10001:10001 -p 10002:10002 \
  mcr.microsoft.com/azure-storage/azurite
```

> [!TIP]
> Once the emulator is running, you can access the Durable Task Scheduler dashboard at `http://localhost:8082` to monitor orchestrations.

## Run the quickstart sample

1. Navigate to the Hello Cities sample directory:

   ```bash
   cd samples/durable-functions/dotnet/HelloCities/http
   ```

1. Create a `local.settings.json` file with the emulator configuration:

   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
       "DURABLE_TASK_SERVICE_CONNECTION_STRING": "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None",
       "TASKHUB_NAME": "default"
     }
   }
   ```

1. Build the project:

   ```bash
   dotnet build
   ```

1. Start the function app:

   ```bash
   func start
   ```

1. In a separate terminal, trigger the orchestration:

   ```powershell
   $response = Invoke-RestMethod -Method POST -Uri http://localhost:7071/api/DurableFunctionsOrchestrationCSharp1_HttpStart
   $response
   ```

   The response contains status URLs for the orchestration instance. Copy the `statusQueryGetUri` value and run it to check the result:

   ```powershell
   Invoke-RestMethod -Uri $response.statusQueryGetUri
   ```

## Expected output

The POST request returns a JSON response with status URLs. For example:

```json
{
  "id": "<instanceId>",
  "statusQueryGetUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/<instanceId>?code=...",
  "sendEventPostUri": "...",
  "terminatePostUri": "...",
  "purgeHistoryDeleteUri": "..."
}
```

When you query `statusQueryGetUri` and the orchestration's `runtimeStatus` is `Completed`, you can find the greeting results in the `output` field:

```json
{
  "name": "DurableFunctionsOrchestrationCSharp1",
  "runtimeStatus": "Completed",
  "output": ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
}
```

> [!TIP]
> If `runtimeStatus` shows `Running` or `Pending`, wait a moment and query the `statusQueryGetUri` again.

Open the Durable Task Scheduler dashboard at `http://localhost:8082` to view the orchestration status and execution history.

## Understand the code

The sample project in `DurableFunctionsOrchestrationCSharp1.cs` contains all three function types needed for a Durable Functions app.

### Activity function

The `SayHello` activity takes a city name and returns a greeting:

```csharp
[Function(nameof(SayHello))]
public static string SayHello([ActivityTrigger] string name, FunctionContext executionContext)
{
    ILogger logger = executionContext.GetLogger("SayHello");
    logger.LogInformation("Saying hello to {name}.", name);
    return $"Hello {name}!";
}
```

### Orchestrator function

The orchestrator calls `SayHello` sequentially for three cities:

```csharp
[Function(nameof(DurableFunctionsOrchestrationCSharp1))]
public static async Task<List<string>> RunOrchestrator(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    ILogger logger = context.CreateReplaySafeLogger(nameof(DurableFunctionsOrchestrationCSharp1));
    logger.LogInformation("Saying hello.");
    var outputs = new List<string>();

    outputs.Add(await context.CallActivityAsync<string>(nameof(SayHello), "Tokyo"));
    outputs.Add(await context.CallActivityAsync<string>(nameof(SayHello), "Seattle"));
    outputs.Add(await context.CallActivityAsync<string>(nameof(SayHello), "London"));

    return outputs;
}
```

### Client function

An HTTP-triggered client function starts the orchestration:

```csharp
[Function("DurableFunctionsOrchestrationCSharp1_HttpStart")]
public static async Task<HttpResponseData> HttpStart(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
    [DurableClient] DurableTaskClient client,
    FunctionContext executionContext)
{
    ILogger logger = executionContext.GetLogger("DurableFunctionsOrchestrationCSharp1_HttpStart");
    string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
        nameof(DurableFunctionsOrchestrationCSharp1));

    logger.LogInformation("Started orchestration with ID = '{instanceId}'.", instanceId);
    return await client.CreateCheckStatusResponseAsync(req, instanceId);
}
```

### Configuration

The sample uses the Durable Task Scheduler emulator as its storage backend. This is configured in `host.json`:

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "type": "azureManaged",
        "connectionStringName": "DURABLE_TASK_SERVICE_CONNECTION_STRING"
      },
      "hubName": "%TASKHUB_NAME%"
    }
  }
}
```

The emulator connection string and task hub name are set in `local.settings.json`:

```json
{
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "DURABLE_TASK_SERVICE_CONNECTION_STRING": "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None",
    "TASKHUB_NAME": "default"
  }
}
```

## Clean up resources

Stop the emulator containers when you're done:

```bash
docker stop dtsemulator azurite && docker rm dtsemulator azurite
```

## Next steps

- Learn about [common Durable Functions app patterns](../common/durable-task-sequence.md).
- Learn about [Durable Functions storage providers](../common/durable-task-storage-providers.md).
