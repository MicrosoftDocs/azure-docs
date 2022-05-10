---
title: Task hubs in Durable Functions - Azure
description: Learn what a task hub is in the Durable Functions extension for Azure Functions. Learn how to configure task hubs.
author: cgillum
ms.topic: conceptual
ms.date: 05/12/2021
ms.author: azfuncdf
---

# Task hubs in Durable Functions (Azure Functions)

A *task hub* in [Durable Functions](durable-functions-overview.md) is a logical collection of storage resources that hold the current state of the application. While a function app is running, the progress of orchestration, activity, and entity functions is automatically persisted in the task hub. This ensures that the application can resume processing where it left off, should it require to be restarted after being temporarily stopped or interrupted for some reason. Also, it allows the function app to scale the compute workers dynamically.

![Diagram showing concept of function app and task hub concept.](./media/durable-functions-task-hubs/taskhub.png)

Conceptually, a task hub comprises the following data:

* An **instance store** that contains the current state of all orchestration and entity instances. For each instance, it stores status information, as well as the orchestration history or entity state.
* A **task queue** that contains pending activity function invocations.
* A **message queue** that contains pending messages that will be delivered to orchestration or entity instances. It may include timer messages that are scheduled for delivery at a certain time.

Collectively, the two queues contain the *work* that the function app needs to process. While the function app is running, it continuously fetches work items (messages or tasks) from the queues in the task hub. Depending on the type of the work item, the function app then executes an activity function, orchestration function, or entity function. When it finishes executing the work item, it atomically commits the results (state updates and/or enqueue operations) to the task hub.

Internally, each storage provider uses a different organization to represent task hubs in storage.
These differences do not matter as far as the design of the application is concerned, but they can influence the performance characteristics. We discuss them in more detail in the section [Representation in storage](durable-functions-task-hubs.md#representation-in-storage).

## Task hub management

### Creation and deletion

An empty task hub with all the required resources is automatically created in storage when a function app is started the first time.

If using the default Azure Storage provider, no extra configuration is required. Otherwise, follow the [instructions for configuring storage providers](durable-functions-storage-providers.md#configuring-alternate-storage-providers) to ensure that the storage provider can properly provision and access the storage resources required for the task hub.

> [!NOTE]
> The task hub is *not* automatically deleted when you stop or delete the function app. You must delete the taskhub, its contents, or the containing storage account manually if you no longer want to keep that data.

> [!TIP]
> In a development scenario, you may need to restart from a clean state often. To do so quickly, you can just [change the configured task hub name](durable-functions-task-hubs.md#task-hub-names). This will force the creation of a new, empty task hub when you restart the application.

### Multiple function apps

If multiple function apps share a storage account, each function app *must* be configured with a separate [task hub name](durable-functions-task-hubs.md#task-hub-names). A storage account can contain multiple task hubs if they have distinct names.

The following diagram illustrates one task hub per function app in shared and dedicated Azure Storage accounts.

![Diagram showing shared and dedicated storage accounts.](./media/durable-functions-task-hubs/multiple-apps.png)

> [!NOTE]
> The exception to the task hub sharing rule is if you are configuring your app for regional disaster recovery. See the [disaster recovery and geo-distribution](durable-functions-disaster-recovery-geo-distribution.md) article for more information.

### Content inspection

There are several common ways to inspect the contents of a task hub:

1. Within a function app, the client object provides methods to query the instance store. To learn more about what types of queries are supported, see the [Instance Management](durable-functions-instance-management.md) article.
2. Similarly, The [HTTP API](durable-functions-http-features.md) offers REST requests to query the state of orchestrations and entities. See the [HTTP API Reference](durable-functions-http-api.md) for more details.
3. The [Durable Functions Monitor](https://github.com/microsoft/DurableFunctionsMonitor) tool can inspect task hubs and offers various options for visual display.

For some of the storage providers, it is also possible to inspect the taskhub by going directly to the underlying storage:

1. If using the Azure Storage provider, the instance store is represented by an [Instance Table]((durable-functions-azure-storage-provider.md#instance-table)) and a [History Table](durable-functions-azure-storage-provider.md#history-table) that can be inspected using tools such as Azure Storage Explorer.
2. If using the MSSQL storage provider, SQL queries and tools can be used to inspect the task hub contents inside the database.

## Representation in storage

Each storage provider uses a different internal organization to represent task hubs in storage. Understanding this organization, while not required, can be helpful when  troubleshooting a function app or when trying to ensure performance, scalability, or cost targets. We thus briefly explain, for each storage provider, how the data is organized in storage. For more information on the various storage provider options and how they compare, see the [Durable Functions storage providers](durable-functions-storage-providers.md).

### Azure Storage provider

For this storage provider, a task hub consists of the following components:

* Two Azure Tables that represent the instance store.
* One Azure Queue that stores the tasks.
* One or more Azure Queues that store the messages.
* Three extra blob containers for storing large messages and blob leases.

For example, for a taskhub named `x` with `PartitionCount = 4`, the queues and tables are named as follows:

![Diagram showing Azure Storage provider storage storage organization for 4 control queues.](./media/durable-functions-task-hubs/azure-storage.png)

For more information how task hubs are represented by the Azure Storage provider, see the [Azure Storage provider](durable-functions-azure-storage-provider.md) documentation.

### Netherite storage provider

Netherite partitions all of the taskhub state into a specified number of partitions.
In storage, the following resources are used:

* One blob container that contains all the blobs, grouped by partition.
* One Azure Table that contains published metrics about the partitions.
* An EventHubs namespace for delivering messages between partitions.

For example, a taskhub named `x` with `PartitionCount = 32` is represented in storage as follows:

![Diagram showing Netherite storage organization for 32 partitions.](./media/durable-functions-task-hubs/netherite-storage.png)

> [!NOTE]
> All of the task hub state is stored inside the `x-storage` blob container. The `DurableTaskPartitions` table and the EventHubs namespace contain redundant data: if their contents are lost, they can be automatically recovered. Therefore it is not necessary to configure the EventHubs namespace to retain messages past the default expiration time.

Netherite uses an event-sourcing mechanism, based on a log and checkpoints, to represent the current state of a partition. Both block blobs and page blobs are used. It is not possible to read this format from storage directly, so the function app has to be running when querying the instance store.

For more details on task hubs for the Netherite storage provider, see [Task Hub information for the Netherite storage provider](https://microsoft.github.io/durabletask-netherite/#/storage).

### MSSQL storage provider

All taskhub data is stored in a single relational database, using several tables:

* The `t.Instances` and `dt.History` tables represent the instance store.
* The `dt.NewEvents` table represents the message queue.
* The `dt.NewTasks` table represents the task queue.

![Diagram showing MSSQL storage organization.](./media/durable-functions-task-hubs/mssql-storage.png)

To enable multiple task hubs to coexist independently in the same database, each table includes a TaskHub column as part of its primary key.

For more details on task hubs for the MSSQL storage provider, see [Task Hub information for the Microsoft SQL (MSSQL) storage provider](https://microsoft.github.io/durabletask-mssql/#/taskhubs).

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
| 2.x | When deployed in Azure, the task hub name is derived from the name of the *function app*. When running outside of Azure, the default task hub name is `TestHubName`. |
| 1.x | The default task hub name for all environments is `DurableFunctionsHub`. |

For more information about the differences between extension versions, see the [Durable Functions versions](durable-functions-versions.md) article.

> [!NOTE]
> The name is what differentiates one task hub from another when there are multiple task hubs in a shared storage account. If you have multiple function apps sharing a shared storage account, you must explicitly configure different names for each task hub in the *host.json* files. Otherwise the multiple function apps will compete with each other for messages, which could result in undefined behavior, including orchestrations getting unexpectedly "stuck" in the `Pending` or `Running` state.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to handle orchestration versioning](durable-functions-versioning.md)
