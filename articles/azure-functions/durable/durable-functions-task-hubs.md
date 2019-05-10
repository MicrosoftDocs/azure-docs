---
title: Task hubs in Durable Functions - Azure
description: Learn what a task hub is in the Durable Functions extension for Azure Functions. Learn how to configure configure task hubs.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 12/07/2017
ms.author: azfuncdf
---

# Task hubs in Durable Functions (Azure Functions)

A *task hub* in [Durable Functions](durable-functions-overview.md) is a logical container for Azure Storage resources that are used for orchestrations. Orchestrator and activity functions can only interact with each other when they belong to the same task hub.

If multiple function apps share a storage account, each function app *must* be configured with a separate task hub name. A storage account can contain multiple task hubs. The following diagram illustrates one task hub per function app in shared and dedicated storage accounts.

![Diagram showing shared and dedicated storage accounts.](./media/durable-functions-task-hubs/task-hubs-storage.png)

## Azure Storage resources

A task hub consists of the following storage resources:

* One or more control queues.
* One work-item queue.
* One history table.
* One instances table.
* One storage container containing one or more lease blobs.

All of these resources are created automatically in the default Azure Storage account when orchestrator or activity functions run or are scheduled to run. The [Performance and Scale](durable-functions-perf-and-scale.md) article explains how these resources are used.

## Task hub names

Task hubs are identified by a name that is declared in the *host.json* file, as shown in the following example:

### host.json (Functions 1.x)

```json
{
  "durableTask": {
    "hubName": "MyTaskHub"
  }
}
```

### host.json (Functions 2.x)

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "hubName": "MyTaskHub"
    }
  }
}
```

Task hubs can also be configured using app settings, as shown in the following *host.json* example file:

### host.json (Functions 1.x)

```json
{
  "durableTask": {
    "hubName": "%MyTaskHub%"
  }
}
```

### host.json (Functions 2.x)

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "hubName": "%MyTaskHub%"
    }
  }
}
```

The task hub name will be set to the value of the `MyTaskHub` app setting. The following `local.settings.json` demonstrates how to define the `MyTaskHub` setting as `samplehubname`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "MyTaskHub" : "samplehubname"
  }
}
```

Here is a precompiled C# example of how to write a function which uses an [OrchestrationClientBinding](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.OrchestrationClientAttribute.html) to work with a task hub that is configured as an App Setting:

```csharp
[FunctionName("HttpStart")]
public static async Task<HttpResponseMessage> Run(
    [HttpTrigger(AuthorizationLevel.Function, methods: "post", Route = "orchestrators/{functionName}")] HttpRequestMessage req,
    [OrchestrationClient(TaskHub = "%MyTaskHub%")] DurableOrchestrationClientBase starter,
    string functionName,
    ILogger log)
{
    // Function input comes from the request content.
    dynamic eventData = await req.Content.ReadAsAsync<object>();
    string instanceId = await starter.StartNewAsync(functionName, eventData);

    log.LogInformation($"Started orchestration with ID = '{instanceId}'.");

    return starter.CreateCheckStatusResponse(req, instanceId);
}
```

And below is the required configuration for JavaScript. The task hub property in the `function.json` file is set via App Setting:

```json
{
    "name": "input",
    "taskHub": "%MyTaskHub%",
    "type": "orchestrationClient",
    "direction": "in"
}
```

Task hub names must start with a letter and consist of only letters and numbers. If not specified, the default name is **DurableFunctionsHub**.

> [!NOTE]
> The name is what differentiates one task hub from another when there are multiple task hubs in a shared storage account. If you have multiple function apps sharing a shared storage account, you must explicitly configure different names for each task hub in the *host.json* files. Otherwise the multiple function apps will compete with each other for messages, which could result in undefined behavior.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to handle versioning](durable-functions-versioning.md)
