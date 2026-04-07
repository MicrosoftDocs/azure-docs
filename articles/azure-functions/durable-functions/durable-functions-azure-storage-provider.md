---
title: Azure Storage provider for Durable Functions
titleSuffix: Durable Task
description: Learn about the characteristics of the Durable Functions Azure Storage provider.
author: cgillum
reviewer: hhunter-ms
ms.topic: concept-article
ms.date: 01/14/2026
ms.author: azfuncdf
ms.service: azure-functions
ms.subservice: durable
ms.custom: devx-track-extended-storage
---

# Azure Storage provider for Durable Functions

When you use Durable Functions, the Azure Storage provider is your default option for managing state and orchestration. The Azure Storage provider optimizes performance and scalability for your applications by storing your instance states and queues in an Azure Storage account. 

With the Azure Storage provider:
- Azure Queues drive all function execution. 
- Azure Tables store orchestration and entity status and history. 
- Azure Blobs and blob leases distribute orchestration instances and entities across multiple app instances (also known as *workers* or *virtual machines*). 

Let's explore how these Azure Storage components work together and impact your app's performance and scalability.

> [!NOTE]
> [Explore other supported storage providers based on your specific needs.](../../durable-task/common/durable-task-storage-providers.md).

## Storage representation

A [task hub](../../durable-task/common/durable-task-hubs.md) durably persists all instance states and all messages. For a quick overview of how the task hub tracks orchestration progress, see the [task hub execution example](../../durable-task/common/durable-task-hubs.md#execution-example).

When you create a task hub, the Azure Storage provider sets up these components in your storage account:

- Azure Tables: 
  - Two tables store your histories and instance states. 
  - If you enable the **Table Partition Manager**, a third table stores partition information.
- Azure Queues:
  - One Azure Queue that stores activity messages.
  - One or more Azure Queues that store instance messages. 
    - Each *control queue* represents a [partition](durable-functions-perf-and-scale.md#partition-count) assigned a subset of all instance messages, based on the hash of the instance ID.
- Azure Blobs:
  - Extra blob containers for lease blobs and/or large messages.

For example, if you name your task hub `xyz` and set `PartitionCount = 4`, you see these queues and tables:

:::image type="content" source="./media/durable-functions-task-hubs/azure-storage.png" alt-text="Diagram showing Azure Storage provider storage organization for four control queues.":::

Let's look at each component and understand what role it plays.

- [History table](#history-table)(`xyzHistory`)
- [Instances table](#instances-table)(`xyzInstances`)
- [Partitions table](#partitions-table)
- [Work items queue](#work-item-queue)(`xyz-workitems`)
- [Control queues](#control-queues)(`xyz-control-00`, `xyz-control-01`, `xyz-control-02`, `xyz-control-03`)
- [Blobs and blob leases](#blobs)(`xyz-largemessages`, `xyz-applease`, `xyz-leases`)

### History table

The **History** table is an Azure Storage table that contains the history events for all orchestration instances data within your task hub, including output payloads from activity and suborchestrator functions, and payloads from external events. The table name follows the format `<TaskHubName>History`. As your instances run, new rows are added to this table. In this table:
- The *partition key* derives from the orchestration's instance ID. By default, instance IDs are random, ensuring optimal distribution of internal partitions in Azure Storage. 
- The *row key* is a sequence number that orders the history events.

When you need to run an orchestration instance, the system loads the full history into memory using a range query within a single table partition. These history events replay into your orchestrator function code, restoring it to its previously checkpointed state. This approach follows the [Event Sourcing pattern](/azure/architecture/patterns/event-sourcing).

Potentially, this approach creates significant memory pressure on a virtual machine. Reduce the length and size of your orchestration history by:
- Splitting large orchestrations into [multiple suborchestrations](../../durable-task/common/durable-task-sub-orchestrations.md). 
- Shrinking the size of outputs returned by your activity and suborchestrator functions. 
- Lowering your per-virtual machine [concurrency throttles](durable-functions-perf-and-scale.md#concurrency-throttles) to limit how many orchestrations can concurrently load into memory.

### Instances table

The **Instances** table contains the statuses of all orchestration and entity instances within a task hub. As you create instances, new rows get added to this table. In this table:
- The *partition key* is either the orchestration instance ID or entity key.
- The *row key* is an empty string. Each orchestration or entity instance typically has one row.

The instance table satisfies [instance query requests from code](../../durable-task/common/durable-task-instance-management.md#query-instances) and [status query HTTP API](durable-functions-http-api.md#get-instance-status) calls. It stays eventually consistent with the contents of the **History** table. This separation of concerns follows the [Command and Query Responsibility Segregation (CQRS) pattern](/azure/architecture/patterns/cqrs), which efficiently handles instance query operations.

The Instances table's partitioning lets you store millions of orchestration instances without any noticeable impact on runtime performance or scale. However, the number of instances can significantly impact your [multi-instance query](../../durable-task/common/durable-task-instance-management.md#query-all-instances) performance. To control how much data these tables store, consider periodically [purging old instance data](../../durable-task/common/durable-task-instance-management.md#purge-instance-history).

### Partitions table

> [!NOTE]
> This table is only visible in your task hub when you enable `Table Partition Manager`. To use it, configure the `useTablePartitionManagement` setting in your app's [host.json](durable-functions-host-json-settings.md).

The **Partitions** table stores partition status for your Durable Functions app and helps distribute partitions across your app's workers. Each partition has one row.

### Queues

Internal queues in your function app's task hub trigger your orchestrator, entity, and activity functions and provide reliable "at-least-once" message delivery guarantees. Durable Functions uses two types of queues: 
- The [**work-item queue**](#work-item-queue)
- The [**control queue**](#control-queues)

#### Work-item queue

In Durable Functions, you get one **work-item** queue per task hub. It's a basic queue that behaves like any other `queueTrigger` queue in Azure Functions. The work-item queue triggers your stateless *activity functions* by dequeueing a single message at a time. Each message contains activity function inputs and metadata, like which function to execute. When your Durable Functions application scales out to multiple virtual machines, they compete to acquire tasks from the work-item queue.

#### Control queues

Each task hub in Durable Functions has multiple **control queues**. A control queue is more sophisticated than the simpler work-item queue. Control queues trigger your stateful orchestrator and entity functions. Since orchestrator and entity function instances are stateful singletons, each orchestration or entity must only be processed by one worker at a time. To achieve this, the system assigns each orchestration instance or entity to a single control queue. These control queues load balance across workers to ensure each queue is only processed by one worker at a time. Find more details on this behavior in later sections.

Control queues contain various orchestration lifecycle message types, including:
- [Orchestrator control messages](../../durable-task/common/durable-task-instance-management.md)
- Activity function *response* messages
- Timer messages

The system dequeues up to 32 messages from a control queue in a single poll. These messages contain payload data and orchestration instance metadata. If multiple dequeued messages target the same orchestration instance, they're processed as a batch.

A background thread constantly polls control queue messages. Configure the following queue settings in [host.json](./durable-functions-host-json-settings.md):
- `controlQueueBatchSize`: Control the batch size of each queue poll, which defaults to 32 (the maximum value supported by Azure Queues). 
- `controlQueueBufferThreshold`: Controls the maximum number of prefetched control-queue messages buffered in memory. The default value varies based on factors like your hosting plan type. 

For more information on these settings, see the [`host.json` schema](../functions-host-json.md#durabletask) documentation.

> [!TIP]
> Increasing the `controlQueueBufferThreshold` value lets a single orchestration or entity process events faster. However, it can also increase memory usage. The higher memory usage comes partly from pulling more messages off the queue and partly from fetching more orchestration histories into memory. Reducing the `controlQueueBufferThreshold` value can effectively reduce memory usage.

#### Queue polling

The Durable Task extension implements a random exponential back-off algorithm to reduce how idle-queue polling affects storage transaction costs. When the runtime finds a message, it immediately checks for another message. If no message is found, it waits before trying again. After subsequent failed attempts to get a queue message, the wait time continues to increase up to the maximum wait time, which defaults to 30 seconds.

You can configure the maximum polling delay using the `maxQueuePollingInterval` property in the [`host.json` file](../functions-host-json.md#durabletask). 
- A higher value could result in higher message processing latencies, though you'd only expect higher latencies after periods of inactivity. 
- A lower value could result in [higher storage costs](durable-functions-billing.md#azure-storage-transactions) due to increased storage transactions.

> [!NOTE]
> When you run in the Azure Functions Consumption and Premium plans, the [Azure Functions Scale Controller](../event-driven-scaling.md) polls each control and work-item queue once every 10 seconds. This extra polling is necessary to determine when to activate function app instances and make scale decisions. Currently, the 10-second interval is constant and unconfigurable.

#### Orchestration start delays

Orchestration instances start when the system puts an `ExecutionStarted` message in one of the task hub's control queues. Under certain conditions, multi-second delays may occur between scheduling an orchestration to run and when it actually starts running. During this interval, the orchestration instance remains in the `Pending` state. There are two potential causes of this delay:

- **Backlogged control queues:**  

   If the control queue for your instance contains a large number of messages, the runtime might take time before it receives and processes the `ExecutionStarted`  message. Message backlogs can happen when your orchestrations process lots of events concurrently. Events that go into the control queue include:
    - Orchestration start events
    - Activity completions
    - Durable timers
    - Termination
    - External events
 
   If a backlog delay happens under normal circumstances, consider creating a new task hub with a larger number of partitions. Configuring more partitions causes the runtime to create more control queues for load distribution. Each partition corresponds 1:1 with a control queue, with a maximum of 16 partitions.

- **Back off polling delays:** 

   You should only experience [back-off polling behavior for control queues described earlier](#queue-polling) when your app scales out to two or more instances. You can avoid a delay if:
    - You have only one app instance
    - The app instance that starts the orchestration is also the same instance polling the target control queue 

   Reduce back-off polling delays by updating your `host.json` settings.

### Blobs

In most cases, Durable Functions doesn't use Azure Storage Blobs to persist data. However, queues and tables have [size limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-queue-storage-limits) that can prevent Durable Functions from persisting all required data into a storage row or queue message. 

For example, when a piece of data you need to persist to a queue exceeds 45 KB when serialized, Durable Functions compresses the data and stores it in a blob instead. When persisting data to blob storage, Durable Functions stores a reference to that blob in the table row or queue message. When Durable Functions needs to retrieve the data, it automatically fetches it from the blob. Find these blobs stored in the blob container `<taskhub>-largemessages`.

#### Performance considerations

The extra compression and blob operation steps for large messages can be expensive in terms of CPU and I/O latency costs. Additionally, Durable Functions needs to load persisted data in memory and may do so for many different function executions at the same time. 

As a result, persisting large data payloads can cause high memory usage. To minimize memory overhead, consider persisting large data payloads manually (for example, in blob storage) and passing around references to this data. Your code can then load the data only when needed to avoid redundant loads during [orchestrator function replays](../../durable-task/common/durable-task-orchestrations.md#reliability). 

Storing payloads to local disks is *not* recommended, since on-disk state isn't guaranteed to be available. Functions may execute on different virtual machines throughout their lifetimes.

## Configuring the Azure storage provider

The Azure Storage provider is the default storage provider and doesn't require any explicit configuration, NuGet package references, or extension bundle references. You can find the full set of [Durable Functions host.json configuration options](durable-functions-host-json-settings.md) under the `extensions/durableTask/storageProvider` path.

### Connections

The `connectionName` property in host.json is a reference to environment configuration which specifies how the app should connect to Azure Storage. It may specify:

- The name of a shared prefix for multiple application settings, together defining an [identity-based connection](#identity-based-connections). Managed identities use Microsoft Entra authentication to provide the most secure connection to your storage account. 
- The name of an application setting containing a connection string. To obtain a connection string, follow the steps shown at [Manage storage account access keys](../../storage/common/storage-account-keys-manage.md). 

If the configured value is both an exact match for a single setting and a prefix match for other settings, the exact match is used. If no value is specified in host.json, the default value is `AzureWebJobsStorage`.

### Identity-based connections 

If you are using [version 2.7.0 or higher of the extension](https://github.com/Azure/azure-functions-durable-extension/releases/tag/v2.7.0) and the Azure storage provider, instead of using a connection string with a secret, you can have the app use an [Microsoft Entra identity](/entra/fundamentals/what-is-entra). To do this, you would define settings under a common prefix which maps to the `connectionName` property in the trigger and binding configuration.

To use an identity-based connection for Durable Functions, configure the following app settings:

| Property | Environment variable template | Description | Example value |
| -------- | ----------------------------- | ----------- | ------------- |
| Blob service URI | `<CONNECTION_NAME_PREFIX>__blobServiceUri` | The data plane URI of the blob service of the storage account, using the HTTPS scheme. | `https://<storage_account_name>.blob.core.windows.net` |
| Queue service URI | `<CONNECTION_NAME_PREFIX>__queueServiceUri` | The data plane URI of the queue service of the storage account, using the HTTPS scheme. | `https://<storage_account_name>.queue.core.windows.net` |
| Table service URI | `<CONNECTION_NAME_PREFIX>__tableServiceUri` | The data plane URI of a table service of the storage account, using the HTTPS scheme. | `https://<storage_account_name>.table.core.windows.net` |
<!-- markdownlint-enable MD044 -->

Additional properties may be set to customize the connection. See [Common properties for identity-based connections](../functions-reference.md#common-properties-for-identity-based-connections).

[!INCLUDE [functions-identity-based-connections-configuration](../../../includes/functions-identity-based-connections-configuration.md)]

[!INCLUDE [functions-durable-permissions](../../../includes/functions-durable-permissions.md)]

## Storage account selection

Durable Functions creates the queues, tables, and blobs it uses in a configured Azure Storage account. You can specify which account to use in your `host.json` file with
- The `durableTask/storageProvider/connectionStringName` setting (Durable Functions 2.x)
- The `durableTask/azureStorageConnectionStringName` setting (in Durable Functions 1.x)

### [Durable Functions 2.x](#tab/durable-2x)

```json
{
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "connectionStringName": "MyStorageAccountAppSetting"
      }
    }
  }
}
```

### [Durable Functions 1.x](#tab/durable-1x)

```json
{
  "extensions": {
    "durableTask": {
      "azureStorageConnectionStringName": "MyStorageAccountAppSetting"
    }
  }
}
```
---

Keep these considerations in mind when choosing the storage account for your Durable function app: 

- For performance-sensitive workloads, configure a storage account other than the default account (`AzureWebJobsStorage`). Since Durable Functions uses Azure Storage heavily, using a dedicated storage account isolates Durable Functions storage usage from the internal usage by the Azure Functions host.
- You need standard general purpose Azure Storage accounts when using the Azure Storage provider. All other storage account types aren't currently supported. 
- Legacy v1 general purpose storage accounts for Durable Functions are recommended. The newer v2 storage accounts can be more expensive for Durable Functions workloads. [Learn more about Azure Storage account types](../../storage/common/storage-account-overview.md).

## Orchestrator scale-out

While you can scale out activity functions infinitely by adding more virtual machines elastically, individual orchestrator instances and entities are constrained to inhabit a single partition. The maximum number of partitions is bounded by the `partitionCount` setting in your `host.json`.

> [!NOTE]
> Generally speaking, your orchestrator functions should be lightweight and shouldn't require large amounts of computing power. You don't need to create a large number of control-queue partitions to get great throughput for orchestrations. You should do most of the heavy work in stateless activity functions, which you can scale out infinitely.

You define the number of control queues in your `host.json` file. The following example `host.json` snippet sets the `durableTask/storageProvider/partitionCount` property (`durableTask/partitionCount` in Durable Functions 1.x) to `3`. You have as many control queues as you have partitions.

### [Durable Functions 2.x](#tab/durable-2x)

```json
{
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "partitionCount": 3
      }
    }
  }
}
```

### [Durable Functions 1.x](#tab/durable-1x)

```json
{
  "extensions": {
    "durableTask": {
      "partitionCount": 3
    }
  }
}
```
---

You can configure a task hub with between 1 and 16 partitions. If you don't specify a value, the default partition count is **four**.

During low traffic scenarios, your application scales in, so few workers manage your partitions. For example, in the following diagram, you can see that orchestrators 1 through 6 are load-balanced across partitions. Similarly, partitions, like activities, are load-balanced across workers. Your partitions load-balance across workers, regardless of how many orchestrators get started.

:::image type="content" source="./media/durable-functions-perf-and-scale/scale-progression-1.png" alt-text="Diagram showing scale-in orchestrations with partitions managed by a small number of workers.":::

If you're running on the Azure Functions Consumption or Elastic Premium plans, or if you configured load-based autoscaling, more workers get allocated as traffic increases and your partitions eventually load balance across all workers. If you continue to scale out, eventually a single worker manages each partition. 

Activities continue to be load-balanced across all workers, as shown in the following image.

:::image type="content" source="./media/durable-functions-perf-and-scale/scale-progression-2.png" alt-text="Diagram showing first scaled-out orchestrations with partitions distributed across workers.":::

The upper-bound of the maximum number of concurrent *active* orchestrations at any given time equals the number of workers allocated to your application *times* your value for `maxConcurrentOrchestratorFunctions`. 

You can make this upper-bound more precise when your partitions are fully scaled-out across workers. When fully scaled-out, since each worker has only a single Functions host instance, the maximum number of *active* concurrent orchestrator instances equals your number of partitions *times* your value for `maxConcurrentOrchestratorFunctions`.

> [!NOTE]
> In this context, *active* means that an orchestration or entity is loaded into memory and processing *new events*. If your orchestration or entity is waiting for more events, such as the return value of an activity function, it gets unloaded from memory and is no longer considered *active*. 
> Orchestrations and entities are later reloaded into memory only when there are new events to process. There's no practical maximum number of *total* orchestrations or entities that can run on a single virtual machine, even if they're all in the "Running" state. The only limitation is the number of *concurrently active* orchestration or entity instances.

The following image illustrates a fully scaled-out scenario, where more orchestrators are added but some are inactive, shown in grey.

:::image type="content" source="./media/durable-functions-perf-and-scale/scale-progression-3.png" alt-text="Diagram showing second scaled-out orchestrations with more orchestrators, some inactive.":::

During scale-out, control queue leases may be redistributed across Functions host instances to ensure your partitions are evenly distributed. These leases are internally implemented as Azure Blob storage leases and ensure that any individual orchestration instance or entity only runs on a single host instance at a time. If you configure a task hub with three partitions (and therefore three control queues), orchestration instances and entities can be load-balanced across all three lease-holding host instances. You can add more virtual machines to increase capacity for activity function execution.

The following diagram illustrates how the Azure Functions host interacts with the storage entities in a scaled out environment.

:::image type="content" source="./media/durable-functions-perf-and-scale/scale-interactions-diagram.png" alt-text="Diagram showing how Azure Functions host interacts with storage entities during scale-out.":::

All virtual machines compete for messages on the work-item queue. However, only three virtual machines can acquire messages from control queues, and each virtual machine locks a single control queue.

Orchestration instances and entities are distributed across all control queue instances. The distribution happens by hashing the instance ID of the orchestration or the entity name and key pair. Since orchestration instance IDs are random GUIDs by default, instances are equally distributed across all control queues.

## Extended sessions

*Extended sessions* is a [caching mechanism](durable-functions-perf-and-scale.md#instance-caching) that keeps your orchestrations and entities in memory even after they finish processing messages. When you enable extended sessions, you typically see reduced I/O against the underlying durable store and overall improved throughput.

You can enable extended sessions by setting `durableTask/extendedSessionsEnabled` to `true` in your `host.json` file. You can use the `durableTask/extendedSessionIdleTimeoutInSeconds` setting to control how long an idle session stays in memory:

### [Durable Functions 2.x](#tab/durable-2x)
```json
{
  "extensions": {
    "durableTask": {
      "extendedSessionsEnabled": true,
      "extendedSessionIdleTimeoutInSeconds": 30
    }
  }
}
```

### [Durable Functions 1.x](#tab/durable-1x)
```json
{
  "extensions": {
    "durableTask": {
      "extendedSessionsEnabled": true,
      "extendedSessionIdleTimeoutInSeconds": 30
    }
  }
}
```
---

Be aware of two potential downsides to this setting:

- Your function app's overall memory usage increases because idle instances aren't unloaded from memory as quickly.
- You can see an overall decrease in throughput if you have many concurrent, distinct, short-lived orchestrator or entity function executions.

For example, if you set `durableTask/extendedSessionIdleTimeoutInSeconds` to 30 seconds, a short-lived orchestrator or entity function episode that executes in less than 1 second still occupies memory for 30 seconds. It also counts against the `durableTask/maxConcurrentOrchestratorFunctions` quota mentioned previously, potentially preventing other orchestrator or entity functions from running.

Extended sessions affect orchestrator and entity functions differently. Let's explore how they work with orchestrator functions.

### Orchestrator function replay

As mentioned earlier, the system replays orchestrator functions using the contents of [the History table](#history-table). By default, your orchestrator function code replays every time a batch of messages are dequeued from a control queue. Even if you're using the fan-out/fan-in pattern and awaiting all tasks to complete, replays occur as batches of task responses are processed over time. When you enable extended sessions, orchestrator function instances stay in memory longer and new messages can be processed without a full history replay.

Most often, you can observe the performance improvement of extended sessions when:

- You have a limited number of orchestration instances running concurrently.
- Your orchestrations have a large number of sequential actions (for example, hundreds of activity function calls) that complete quickly.
- Your orchestrations fan-out and fan-in a large number of actions that complete around the same time.
- Your orchestrator functions need to process large messages or do any CPU-intensive data processing.

In all other situations, you typically don't see any observable performance improvement for orchestrator functions.

> [!NOTE]
> You should only use these settings after fully developing and testing your orchestrator function. The default aggressive replay behavior can be useful for detecting [orchestrator function code constraints](../../durable-task/common/durable-task-code-constraints.md) violations at development time, so it's disabled by default.

### Performance targets

The following table shows the [expected *maximum* throughput numbers for the scenarios](durable-functions-perf-and-scale.md) article. 

"Instance" refers to a single instance of an orchestrator function running on a single small ([A1](/azure/virtual-machines/sizes-previous-gen)) virtual machine in Azure App Service. In all cases, these numbers assume you enabled [extended sessions](#extended-sessions). Your actual results may vary depending on the CPU or I/O work your function code performs.

| Scenario | Maximum throughput |
| -------- | ------------------ |
| Sequential activity execution | Five activities per second, per instance |
| Parallel activity execution (fan-out) | 100 activities per second, per instance |
| Parallel response processing (fan-in) | 150 responses per second, per instance |
| External event processing | 50 events per second, per instance |
| Entity operation processing | 64 operations per second |

If you aren't seeing the throughput numbers you expect and your CPU and memory usage appears healthy, check whether the cause is related to [the health of your storage account](/troubleshoot/azure/azure-storage/blobs/alerts/storage-monitoring-diagnosing-troubleshooting#troubleshooting-guidance). The Durable Functions extension can put significant load on an Azure Storage account, and sufficiently high loads may result in storage account throttling.

> [!TIP]
> In some cases, you can increase the throughput of external events, activity fan-in, and entity operations by increasing the value of the `controlQueueBufferThreshold` setting in your `host.json`. Increasing this value beyond its default causes the Durable Task Framework storage provider to use more memory to prefetch these events more aggressively, reducing delays associated with dequeueing messages from the Azure Storage control queues. For more information, see the [host.json](durable-functions-host-json-settings.md) reference documentation.

## Flex Consumption plan

The [Flex Consumption plan](../flex-consumption-plan.md) is an Azure Functions hosting plan that provides many of the benefits of the Consumption plan, including:
- A serverless billing model
- Private networking
- Instance memory size selection
- Full support for managed identity authentication

You should follow these performance recommendations when you host Durable Functions in the Flex Consumption plan:

- Set the [always ready instance count](../flex-consumption-how-to.md#set-always-ready-instance-counts) for the `durable` group to `1`. This setting ensures you always have one instance ready to handle Durable Functions related requests, reducing your application's cold start. 
- Reduce the [queue polling interval](#queue-polling) to 10 seconds or less. Since this plan type is more sensitive to queue polling delays, lowering the polling interval helps increase the frequency of polling operations, ensuring requests are handled faster. However, more frequent polling operations lead to higher Azure Storage account costs.

## High throughput processing

The Azure Storage backend architecture puts certain limitations on the maximum theoretical performance and scalability of Durable Functions. If your testing shows that Durable Functions on Azure Storage doesn't meet your throughput requirements, you should consider using the [Netherite storage provider for Durable Functions](../../durable-task/common/durable-task-storage-providers.md#netherite) instead.

[Compare the achievable throughput for various basic scenarios](https://microsoft.github.io/durabletask-netherite/#/scenarios).

The Netherite storage backend was designed and developed by [Microsoft Research](https://www.microsoft.com/research). It uses [Azure Event Hubs](../../event-hubs/event-hubs-about.md) and the [FASTER](https://www.microsoft.com/research/project/faster/) database technology on top of [Azure Page Blobs](../../storage/blobs/storage-blob-pageblob-overview.md). The design of Netherite enables higher-throughput processing of orchestrations and entities compared to other providers. In some benchmark scenarios, throughput increased by more than an order of magnitude when compared to the default Azure Storage provider.

For more information on the supported storage providers for Durable Functions and how they compare, see the [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md) documentation.

## Next steps

> [!div class="nextstepaction"]
> [Learn about disaster recovery and geo-distribution](durable-functions-disaster-recovery-geo-distribution.md)
