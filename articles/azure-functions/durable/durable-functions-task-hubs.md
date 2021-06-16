---
title: Task hubs in Durable Functions - Azure
description: Learn what a task hub is in the Durable Functions extension for Azure Functions. Learn how to configure task hubs.
author: cgillum
ms.topic: conceptual
ms.date: 05/12/2021
ms.author: azfuncdf
---

# Task hubs in Durable Functions (Azure Functions)

A *task hub* in [Durable Functions](durable-functions-overview.md) is a logical container for durable storage resources that are used for orchestrations and entities. Orchestrator, activity, and entity functions can only directly interact with each other when they belong to the same task hub.

> [!NOTE]
> This document describes the details of task hubs in a way that is specific to the default [Azure Storage provider for Durable Functions](durable-functions-storage-providers.md#azure-storage). If you are using a non-default storage provider for your Durable Functions app, you can find detailed task hub documentation in the provider-specific documentation:
> 
> * [Task Hub information for the Netherite storage provider](https://microsoft.github.io/durabletask-netherite/#/storage)
> * [Task Hub information for the Microsoft SQL (MSSQL) storage provider](https://microsoft.github.io/durabletask-mssql/#/taskhubs)
> 
> For more information on the various storage provider options and how they compare, see the [Durable Functions storage providers](durable-functions-storage-providers.md) documentation.

If multiple function apps share a storage account, each function app *must* be configured with a separate task hub name. A storage account can contain multiple task hubs. This restriction generally applies to other storage providers as well.

The following diagram illustrates one task hub per function app in shared and dedicated Azure Storage accounts.

![Diagram showing shared and dedicated storage accounts.](./media/durable-functions-task-hubs/task-hubs-storage.png)

## Azure Storage resources

A task hub in Azure Storage consists of the following resources:

* One or more control queues.
* One work-item queue.
* One history table.
* One instances table.
* One storage container containing one or more lease blobs.
* A storage container containing large message payloads, if applicable.

All of these resources are created automatically in the configured Azure Storage account when orchestrator, entity, or activity functions run or are scheduled to run. The [Performance and Scale](durable-functions-perf-and-scale.md) article explains how these resources are used.

## Task hub names

Task hubs in Azure Storage are identified by a name that conforms to these rules:

* Contains only alphanumeric characters
* Starts with a letter
* Has a minimum length of 3 characters, maximum length of 45 characters

The task hub name is declared in the *host.json* file, as shown in the following example:

### host.json (Functions 2.0)

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

### host.json (Functions 1.x)

```json
{
  "durableTask": {
    "hubName": "MyTaskHub"
  }
}
```

Task hubs can also be configured using app settings, as shown in the following `host.json` example file:

### host.json (Functions 1.0)

```json
{
  "durableTask": {
    "hubName": "%MyTaskHub%"
  }
}
```

### host.json (Functions 2.0)

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

In addition to **host.json**, task hub names can also be configured in [orchestration client binding](durable-functions-bindings.md#orchestration-client) metadata. This is useful if you need to access orchestrations or entities that live in a separate function app. The following code demonstrates how to write a function that uses the [orchestration client binding](durable-functions-bindings.md#orchestration-client) to work with a task hub that is configured as an App Setting:

# [C#](#tab/csharp)

```csharp
[FunctionName("HttpStart")]
public static async Task<HttpResponseMessage> Run(
    [HttpTrigger(AuthorizationLevel.Function, methods: "post", Route = "orchestrators/{functionName}")] HttpRequestMessage req,
    [DurableClient(TaskHub = "%MyTaskHub%")] IDurableOrchestrationClient starter,
    string functionName,
    ILogger log)
{
    // Function input comes from the request content.
    object eventData = await req.Content.ReadAsAsync<object>();
    string instanceId = await starter.StartNewAsync(functionName, eventData);

    log.LogInformation($"Started orchestration with ID = '{instanceId}'.");

    return starter.CreateCheckStatusResponse(req, instanceId);
}
```

> [!NOTE]
> The previous C# example is for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

The task hub property in the `function.json` file is set via App Setting:

```json
{
    "name": "input",
    "taskHub": "%MyTaskHub%",
    "type": "orchestrationClient",
    "direction": "in"
}
```

# [Python](#tab/python)

The task hub property in the `function.json` file is set via App Setting:

```json
{
    "name": "input",
    "taskHub": "%MyTaskHub%",
    "type": "orchestrationClient",
    "direction": "in"
}
```

---

> [!NOTE]
> Configuring task hub names in client binding metadata is only necessary when you use one function app to access orchestrations and entities in another function app. If the client functions are defined in the same function app as the orchestrations and entities, you should avoid specifying task hub names in the binding metadata. By default, all client bindings get their task hub metadata from the **host.json** settings.

Task hub names in Azure Storage must start with a letter and consist of only letters and numbers. If not specified, a default task hub name will be used as shown in the following table:

| Durable extension version | Default task hub name |
| - | - |
| 2.x | When deployed in Azure, the task hub name is derived from the name of the _function app_. When running outside of Azure, the default task hub name is `TestHubName`. |
| 1.x | The default task hub name for all environments is `DurableFunctionsHub`. |

For more information about the differences between extension versions, see the [Durable Functions versions](durable-functions-versions.md) article.

> [!NOTE]
> The name is what differentiates one task hub from another when there are multiple task hubs in a shared storage account. If you have multiple function apps sharing a shared storage account, you must explicitly configure different names for each task hub in the *host.json* files. Otherwise the multiple function apps will compete with each other for messages, which could result in undefined behavior, including orchestrations getting unexpectedly "stuck" in the `Pending` or `Running` state.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to handle orchestration versioning](durable-functions-versioning.md)
