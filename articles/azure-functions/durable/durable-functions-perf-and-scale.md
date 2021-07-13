---
title: Performance and scale in Durable Functions - Azure
description: Learn about the unique scaling characteristics of the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: conceptual
ms.date: 05/13/2021
ms.author: azfuncdf
---

# Performance and scale in Durable Functions (Azure Functions)

To optimize performance and scalability, it's important to understand the unique scaling characteristics of [Durable Functions](durable-functions-overview.md).

## Azure Storage provider

The default configuration for Durable Functions stores this runtime state in an Azure Storage (classic) account. All function execution is driven by Azure Storage queues. Orchestration and entity status and history is stored in Azure Tables. Azure Blobs and blob leases are used to distribute orchestration instances and entities across multiple app instances (also known as *workers* or simply *VMs*). This section goes into more detail on the various Azure Storage artifacts and how they impact performance and scalability.

> [!NOTE]
> This document primarily focuses on the performance and scalability characteristics of Durable Functions using the default Azure Storage provider. However, other storage providers are also available. For more information on the supported storage providers for Durable Functions and how they compare, see the [Durable Functions storage providers](durable-functions-storage-providers.md) documentation.

### History table

The **History** table is an Azure Storage table that contains the history events for all orchestration instances within a task hub. The name of this table is in the form *TaskHubName*History. As instances run, new rows are added to this table. The partition key of this table is derived from the instance ID of the orchestration. Instance IDs are random by default, ensuring optimal distribution of internal partitions in Azure Storage. The row key for this table is a sequence number used for ordering the history events.

When an orchestration instance needs to run, the corresponding rows of the History table are loaded into memory using a range query within a single table partition. These *history events* are then replayed into the orchestrator function code to get it back into its previously checkpointed state. The use of execution history to rebuild state in this way is influenced by the [Event Sourcing pattern](/azure/architecture/patterns/event-sourcing).

> [!TIP]
> Orchestration data stored in the History table includes output payloads from activity and sub-orchestrator functions. Payloads from external events are also stored in the History table. Because the full history is loaded into memory every time an orchestrator needs to execute, a large enough history can result in significant memory pressure on a given VM. The length and size of the orchestration history can be reduced by splitting large orchestrations into multiple sub-orchestrations or by reducing the size of outputs returned by the activity and sub-orchestrator functions it calls. Alternatively, you can reduce memory usage by lowering per-VM [concurrency throttles](#concurrency-throttles) to limit how many orchestrations are loaded into memory concurrently.

### Instances table

The **Instances** table contains the statuses of all orchestration and entity instances within a task hub. As instances are created, new rows are added to this table. The partition key of this table is the orchestration instance ID or entity key and the row key is an empty string. There is one row per orchestration or entity instance.

This table is used to satisfy [instance query requests from code](durable-functions-instance-management.md#query-instances) as well as [status query HTTP API](durable-functions-http-api.md#get-instance-status) calls. It is kept eventually consistent with the contents of the **History** table mentioned previously. The use of a separate Azure Storage table to efficiently satisfy instance query operations in this way is influenced by the [Command and Query Responsibility Segregation (CQRS) pattern](/azure/architecture/patterns/cqrs).

> [!TIP]
> The partitioning of the *Instances* table allows it to store millions of orchestration instances without any noticeable impact on runtime performance or scale. However, the number of instances can have a significant impact on [multi-instance query](durable-functions-instance-management.md#query-all-instances) performance. To control the amount of data stored in these tables, consider periodically [purging old instance data](durable-functions-instance-management.md#purge-instance-history).

### Internal queue triggers

Orchestrator, entity, and activity functions are all triggered by internal queues in the function app's task hub. Using queues in this way provides reliable "at-least-once" message delivery guarantees. There are two types of queues in Durable Functions: the **control queue** and the **work-item queue**.

#### The work-item queue

There is one work-item queue per task hub in Durable Functions. It's a basic queue and behaves similarly to any other `queueTrigger` queue in Azure Functions. This queue is used to trigger stateless *activity functions* by dequeueing a single message at a time. Each of these messages contains activity function inputs and additional metadata, such as which function to execute. When a Durable Functions application scales out to multiple VMs, these VMs all compete to acquire tasks from the work-item queue.

#### Control queue(s)

There are multiple *control queues* per task hub in Durable Functions. A *control queue* is more sophisticated than the simpler work-item queue. Control queues are used to trigger the stateful orchestrator and entity functions. Because the orchestrator and entity function instances are stateful singletons, it's important that each orchestration or entity is only processed by one worker at a time. To achieve this constraint, each orchestration instance or entity is assigned to a single control queue. These control queues are load balanced across workers to ensure that each queue is only processed by one worker at a time. More details on this behavior can be found in subsequent sections.

Control queues contain a variety of orchestration lifecycle message types. Examples include [orchestrator control messages](durable-functions-instance-management.md), activity function *response* messages, and timer messages. As many as 32 messages will be dequeued from a control queue in a single poll. These messages contain payload data as well as metadata including which orchestration instance it is intended for. If multiple dequeued messages are intended for the same orchestration instance, they will be processed as a batch.

Control queue messages are constantly polled using a background thread. The batch size of each queue poll is controlled by the `controlQueueBatchSize` setting in host.json and has a default of 32 (the maximum value supported by Azure Queues). The maximum number of prefetched control-queue messages that are buffered in memory is controlled by the `controlQueueBufferThreshold` setting in host.json. The default value for `controlQueueBufferThreshold` varies depending on a variety of factors, including the type of hosting plan. For more information on these settings, see the [host.json schema](../functions-host-json.md#durabletask) documentation.

> [!TIP]
> Increasing the value for `controlQueueBufferThreshold` allows a single orchestration or entity to process events faster. However, increasing this value can also result in higher memory usage. The higher memory usage is partly due to pulling more messages off the queue and partly due to fetching more orchestration histories into memory. Reducing the value for `controlQueueBufferThreshold` can therefore be an effective way to reduce memory usage.

#### Queue polling

The durable task extension implements a random exponential back-off algorithm to reduce the effect of idle-queue polling on storage transaction costs. When a message is found, the runtime immediately checks for another message. When no message is found, it waits for a period of time before trying again. After subsequent failed attempts to get a queue message, the wait time continues to increase until it reaches the maximum wait time, which defaults to 30 seconds.

The maximum polling delay is configurable via the `maxQueuePollingInterval` property in the [host.json file](../functions-host-json.md#durabletask). Setting this property to a higher value could result in higher message processing latencies. Higher latencies would be expected only after periods of inactivity. Setting this property to a lower value could result in [higher storage costs](durable-functions-billing.md#azure-storage-transactions) due to increased storage transactions.

> [!NOTE]
> When running in the Azure Functions Consumption and Premium plans, the [Azure Functions Scale Controller](../event-driven-scaling.md) will poll each control and work-item queue once every 10 seconds. This additional polling is necessary to determine when to activate function app instances and to make scale decisions. At the time of writing, this 10 second interval is constant and cannot be configured.

#### Orchestration start delays
Orchestrations instances are started by putting an `ExecutionStarted` message in one of the task hub's control queues. Under certain conditions, you may observe multi-second delays between when an orchestration is scheduled to run and when it actually starts running. During this time interval, the orchestration instance remains in the `Pending` state. There are two potential causes of this delay:

1. **Backlogged control queues**: If the control queue for this instance contains a large number of messages, it may take time before the `ExecutionStarted` message is received and processed by the runtime. Message backlogs can happen when orchestrations are processing lots of events concurrently. Events that go into the control queue include orchestration start events, activity completions, durable timers, termination, and external events. If this delay happens under normal circumstances, consider creating a new task hub with a larger number of partitions. Configuring more partitions will cause the runtime to create more control queues for load distribution. Each partition corresponds to 1:1 with a control queue, with a maximum of 16 partitions.

2. **Back off polling delays**: Another common cause of orchestration delays is the [previously described back-off polling behavior for control queues](#queue-polling). However, this delay is only expected when an app is scaled out to two or more instances. If there is only one app instance or if the app instance that starts the orchestration is also the same instance that is polling the target control queue, then there will not be a queue polling delay. Back off polling delays can be reduced by updating the **host.json** settings, as described previously.

### Storage account selection

The queues, tables, and blobs used by Durable Functions are created in a configured Azure Storage account. The account to use can be specified using the `durableTask/storageProvider/connectionStringName` setting (or `durableTask/azureStorageConnectionStringName` setting in Durable Functions 1.x) in the **host.json** file.

#### Durable Functions 2.x

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

#### Durable Functions 1.x

```json
{
  "extensions": {
    "durableTask": {
      "azureStorageConnectionStringName": "MyStorageAccountAppSetting"
    }
  }
}
```

If not specified, the default `AzureWebJobsStorage` storage account is used. For performance-sensitive workloads, however, configuring a non-default storage account is recommended. Durable Functions uses Azure Storage heavily, and using a dedicated storage account isolates Durable Functions storage usage from the internal usage by the Azure Functions host.

> [!NOTE]
> Standard general purpose Azure Storage accounts are required when using the Azure Storage provider. All other storage account types are not supported. We highly recommend using legacy v1 general purpose storage accounts for Durable Functions. The newer v2 storage accounts can be significantly more expensive for Durable Functions workloads. For more information on Azure Storage account types, see the [Storage account overview](../../storage/common/storage-account-overview.md) documentation.

### Orchestrator scale-out

While activity functions can be scaled out infinitely by adding more VMs elastically, individual orchestrator instances and entities are constrained to inhabit a single partition and the maximum number of partitions is bounded by the `partitionCount` setting in your `host.json`. 

> [!NOTE]
> Generally speaking, orchestrator functions are intended to be lightweight and should not require large amounts of computing power. It is therefore not necessary to create a large number of control-queue partitions to get great throughput for orchestrations. Most of the heavy work should be done in stateless activity functions, which can be scaled out infinitely.

The number of control queues is defined in the **host.json** file. The following example host.json snippet sets the `durableTask/storageProvider/partitionCount` property (or `durableTask/partitionCount` in Durable Functions 1.x) to `3`. Note that there are as many control queues as there are partitions.

#### Durable Functions 2.x

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

#### Durable Functions 1.x

```json
{
  "extensions": {
    "durableTask": {
      "partitionCount": 3
    }
  }
}
```

A task hub can be configured with between 1 and 16 partitions. If not specified, the default partition count is **4**.

During low traffic scenarios, your application will be scaled-in, so partitions will be managed by a small number of workers. As an example, consider the diagram below.

![Scale-in orchestrations diagram](./media/durable-functions-perf-and-scale/scale-progression-1.png)

In the previous diagram, we see that orchestrators 1 through 6 are load balanced across partitions. Similarly, partitions, like activities, are load balanced across workers. Partitions are load-balanced across workers regardless of the number of orchestrators that get started.

If you're running on the Azure Functions Consumption or Elastic Premium plans, or if you have load-based auto-scaling configured, more workers will get allocated as traffic increases and partitions will eventually load balance across all workers. If we continue to scale out, eventually each partition will eventually be managed by a single worker. Activities, on the other hand, will continue to be load-balanced across all workers. This is shown in the image below.

![First scaled-out orchestrations diagram](./media/durable-functions-perf-and-scale/scale-progression-2.png)

The upper-bound of the maximum number of concurrent _active_ orchestrations at *any given time* is equal to the number of workers allocated to your application _times_ your value for `maxConcurrentOrchestratorFunctions`. This upper-bound can be made more precise when your partitions are fully scaled-out across workers. When fully scaled-out, and since each worker will have only a single Functions host instance, the maximum number of _active_ concurrent orchestrator instances will be equal to your number of partitions _times_ your value for `maxConcurrentOrchestratorFunctions`.

> [!NOTE]
> In this context, *active* means that an orchestration or entity is loaded into memory and processing *new events*. If the orchestration or entity is waiting for more events, such as the return value of an activity function, it gets unloaded from memory and is no longer considered *active*. Orchestrations and entities will be subsequently reloaded into memory only when there are new events to process. There's no practical maximum number of *total* orchestrations or entities that can run on a single VM, even if they're all in the "Running" state. The only limitation is the number of *concurrently active* orchestration or entity instances.

The image below illustrates a fully scaled-out scenario where more orchestrators are added but some are inactive, shown in grey.

![Second scaled-out orchestrations diagram](./media/durable-functions-perf-and-scale/scale-progression-3.png)

During scale-out, control queue leases may be redistributed across Functions host instances to ensure that partitions are evenly distributed. These leases are internally implemented as Azure Blob storage leases and ensure that any individual orchestration instance or entity only runs on a single host instance at a time. If a task hub is configured with three partitions (and therefore three control queues), orchestration instances and entities can be load-balanced across all three lease-holding host instances. Additional VMs can be added to increase capacity for activity function execution.

The following diagram illustrates how the Azure Functions host interacts with the storage entities in a scaled out environment.

![Scale diagram](./media/durable-functions-perf-and-scale/scale-interactions-diagram.png)

As shown in the previous diagram, all VMs compete for messages on the work-item queue. However, only three VMs can acquire messages from control queues, and each VM locks a single control queue.

Orchestration instances and entities are distributed across all control queue instances. The distribution is done by hashing the instance ID of the orchestration or the entity name and key pair. Orchestration instance IDs by default are random GUIDs, ensuring that instances are equally distributed across all control queues.

Generally speaking, orchestrator functions are intended to be lightweight and should not require large amounts of computing power. It is therefore not necessary to create a large number of control queue partitions to get great throughput for orchestrations. Most of the heavy work should be done in stateless activity functions, which can be scaled out infinitely.

### Auto-scale

As with all Azure Functions running in the Consumption and Elastic Premium plans, Durable Functions supports auto-scale via the [Azure Functions scale controller](../event-driven-scaling.md#runtime-scaling). The Scale Controller monitors the latency of all queues by periodically issuing _peek_ commands. Based on the latencies of the peeked messages, the Scale Controller will decide whether to add or remove VMs.

If the Scale Controller determines that control queue message latencies are too high, it will add VM instances until either the message latency decreases to an acceptable level or it reaches the control queue partition count. Similarly, the Scale Controller will continually add VM instances if work-item queue latencies are high, regardless of the partition count.

> [!NOTE]
> Starting with Durable Functions 2.0, function apps can be configured to run within VNET-protected service endpoints in the Elastic Premium plan. In this configuration, the Durable Functions triggers initiate scale requests instead of the Scale Controller. For more information, see [Runtime scale monitoring](../functions-networking-options.md#premium-plan-with-virtual-network-triggers).

## Thread usage

Orchestrator functions are executed on a single thread to ensure that execution can be deterministic across many replays. Because of this single-threaded execution, it's important that orchestrator function threads do not perform CPU-intensive tasks, do I/O, or block for any reason. Any work that may require I/O, blocking, or multiple threads should be moved into activity functions.

Activity functions have all the same behaviors as regular queue-triggered functions. They can safely do I/O, execute CPU intensive operations, and use multiple threads. Because activity triggers are stateless, they can freely scale out to an unbounded number of VMs.

Entity functions are also executed on a single thread and operations are processed one-at-a-time. However, entity functions do not have any restrictions on the type of code that can be executed.

## Concurrency throttles

Azure Functions supports executing multiple functions concurrently within a single app instance. This concurrent execution helps increase parallelism and minimizes the number of "cold starts" that a typical app will experience over time. However, high concurrency can exhaust per-VM system resources such network connections or available memory. Depending on the needs of the function app, it may be necessary to throttle the per-instance concurrency to avoid the possibility of running out of memory in high-load situations.

Activity, orchestrator, and entity function concurrency limits can be configured in the **host.json** file. The relevant settings are `durableTask/maxConcurrentActivityFunctions` for activity functions and `durableTask/maxConcurrentOrchestratorFunctions` for both orchestrator and entity functions. These settings control the maximum number of orchestrator, entity, or activity functions that can be loaded into memory concurrently.

### Functions 2.0

```json
{
  "extensions": {
    "durableTask": {
      "maxConcurrentActivityFunctions": 10,
      "maxConcurrentOrchestratorFunctions": 10
    }
  }
}
```

### Functions 1.x

```json
{
  "durableTask": {
    "maxConcurrentActivityFunctions": 10,
    "maxConcurrentOrchestratorFunctions": 10
  }
}
```

In the previous example, a maximum of 10 orchestrator or entity functions and 10 activity functions can run on a single VM concurrently. If not specified, the number of concurrent activity and orchestrator or entity function executions is capped at 10X the number of cores on the VM.

If the maximum number of activities or orchestrations/entities on a worker VM is reached, the Durable trigger will wait for any executing functions to finish or unload before starting up new function executions.

> [!NOTE]
> These settings are useful to help manage memory and CPU usage on a single VM. However, when scaled out across multiple VMs, each VM has its own set of limits. These settings can't be used to control concurrency at a global level.

> [!NOTE]
> Orchestrations and entities are only loaded into memory when they are actively processing events or operations. After executing their logic and awaiting (i.e. hitting an `await` (C#) or `yield` (JavaScript, Python) statement in the orchestrator function code), they are unloaded from memory. Orchestrations and entities that are unloaded from memory don't count towards the `maxConcurrentOrchestratorFunctions` throttle. Even if millions of orchestrations or entities are in the "Running" state, they only count towards the throttle limit when they are loaded into active memory. An orchestration that schedules an activity function similarly doesn't count towards the throttle if the orchestration is waiting for the activity to finish executing.

### Language runtime considerations

The language runtime you select may impose strict concurrency restrictions or your functions. For example, Durable Function apps written in Python or PowerShell may only support running a single function at a time on a single VM. This can result in significant performance problems if not carefully accounted for. For example, if an orchestrator fans-out to 10 activities but the language runtime restricts concurrency to just one function, then 9 of the 10 activity functions will be stuck waiting for a chance to run. Furthermore, these 9 stuck activities will not be able to be load balanced to any other workers because the Durable Functions runtime will have already loaded them into memory. This becomes especially problematic if the activity functions are long-running.

If the language runtime you are using places a restriction on concurrency, you should update the Durable Functions concurrency settings to match the concurrency settings of your language runtime. This ensures that the Durable Functions runtime will not attempt to run more functions concurrently than is allowed by the language runtime, allowing any pending activities to be load balanced to other VMs. For example, if you have a Python app that restricts concurrency to 4 functions (perhaps its only configured with 4 threads on a single language worker process or 1 thread on 4 language worker processes) then you should configure both `maxConcurrentOrchestratorFunctions` and `maxConcurrentActivityFunctions` to 4.

For more information and performance recommendations for Python, see [Improve throughput performance of Python apps in Azure Functions](../python-scale-performance-reference.md). The techniques mentioned in this Python developer reference documentation can have a substantial impact on Durable Functions performance and scalability.

## Extended sessions

Extended sessions is a setting that keeps orchestrations and entities in memory even after they finish processing messages. The typical effect of enabling extended sessions is reduced I/O against the underlying durable store and overall improved throughput.

You can enable extended sessions by setting `durableTask/extendedSessionsEnabled` to `true` in the **host.json** file. The `durableTask/extendedSessionIdleTimeoutInSeconds` setting can be used to control how long an idle session will be held in memory:

**Functions 2.0**
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

**Functions 1.0**
```json
{
  "durableTask": {
    "extendedSessionsEnabled": true,
    "extendedSessionIdleTimeoutInSeconds": 30
  }
}
```

There are two potential downsides of this setting to be aware of:

1. There's an overall increase in function app memory usage because idle instances are not unloaded from memory as quickly.
2. There can be an overall decrease in throughput if there are many concurrent, distinct, short-lived orchestrator or entity function executions.

As an example, if `durableTask/extendedSessionIdleTimeoutInSeconds` is set to 30 seconds, then a short-lived orchestrator or entity function episode that executes in less than 1 second still occupies memory for 30 seconds. It also counts against the `durableTask/maxConcurrentOrchestratorFunctions` quota mentioned previously, potentially preventing other orchestrator or entity functions from running.

The specific effects of extended sessions on orchestrator and entity functions are described in the next sections.

> [!NOTE]
> Extended sessions are currently only supported in .NET languages, like C# or F#. Setting `extendedSessionsEnabled` to `true` for other platforms can lead to runtime issues, such as silently failing to execute activity and orchestration-triggered functions.

> [!NOTE]
> Support for extended sessions may vary depend on the [Durable Functions storage provider you are using](durable-functions-storage-providers.md). See the storage provider documentation to learn whether it supports extended sessions.

### Orchestrator function replay

As mentioned previously, orchestrator functions are replayed using the contents of the **History** table. By default, the orchestrator function code is replayed every time a batch of messages are dequeued from a control queue. Even if you are using the fan-out, fan-in pattern and are awaiting for all tasks to complete (for example, using `Task.WhenAll()` in .NET, `context.df.Task.all()` in JavaScript, or `context.task_all()` in Python), there will be replays that occur as batches of task responses are processed over time. When extended sessions are enabled, orchestrator function instances are held in memory longer and new messages can be processed without a full history replay.

The performance improvement of extended sessions is most often observed in the following situations:

* When there are a limited number of orchestration instances running concurrently.
* When orchestrations have large number of sequential actions (for example, hundreds of activity function calls) that complete quickly.
* When orchestrations fan-out and fan-in a large number of actions that complete around the same time.
* When orchestrator functions need to process large messages or do any CPU-intensive data processing.

In all other situations, there is typically no observable performance improvement for orchestrator functions.

> [!NOTE]
> These settings should only be used after an orchestrator function has been fully developed and tested. The default aggressive replay behavior can useful for detecting [orchestrator function code constraints](durable-functions-code-constraints.md) violations at development time, and is therefore disabled by default.

### Entity function unloading

Entity functions process up to 20 operations in a single batch. As soon as an entity finishes processing a batch of operations, it persists its state and unloads from memory. You can delay the unloading of entities from memory using the extended sessions setting. Entities continue to persist their state changes as before, but remain in memory for the configured period of time to reduce the number of loads from storage. This reduction of loads from storage can improve the overall throughput of frequently accessed entities.

## Performance targets

When planning to use Durable Functions for a production application, it is important to consider the performance requirements early in the planning process. This section covers some basic usage scenarios and the expected maximum throughput numbers.

* **Sequential activity execution**: This scenario describes an orchestrator function that runs a series of activity functions one after the other. It most closely resembles the [Function Chaining](durable-functions-sequence.md) sample.
* **Parallel activity execution**: This scenario describes an orchestrator function that executes many activity functions in parallel using the [Fan-out, Fan-in](durable-functions-cloud-backup.md) pattern.
* **Parallel response processing**: This scenario is the second half of the [Fan-out, Fan-in](durable-functions-cloud-backup.md) pattern. It focuses on the performance of the fan-in. It's important to note that unlike fan-out, fan-in is done by a single orchestrator function instance, and therefore can only run on a single VM.
* **External event processing**: This scenario represents a single orchestrator function instance that waits on [external events](durable-functions-external-events.md), one at a time.
* **Entity operation processing**: This scenario tests how quickly a _single_ [Counter entity](durable-functions-entities.md) can process a constant stream of operations.

> [!TIP]
> Unlike fan-out, fan-in operations are limited to a single VM. If your application uses the fan-out, fan-in pattern and you are concerned about fan-in performance, consider sub-dividing the activity function fan-out across multiple [sub-orchestrations](durable-functions-sub-orchestrations.md).

### Azure Storage performance targets

The following table shows the expected *maximum* throughput numbers for the previously described scenarios when using the default [Azure Storage provider for Durable Functions](durable-functions-storage-providers.md#azure-storage). "Instance" refers to a single instance of an orchestrator function running on a single small ([A1](../../virtual-machines/sizes-previous-gen.md)) VM in Azure App Service. In all cases, it is assumed that [extended sessions](#orchestrator-function-replay) are enabled. Actual results may vary depending on the CPU or I/O work performed by the function code.

| Scenario | Maximum throughput |
|-|-|
| Sequential activity execution | 5 activities per second, per instance |
| Parallel activity execution (fan-out) | 100 activities per second, per instance |
| Parallel response processing (fan-in) | 150 responses per second, per instance |
| External event processing | 50 events per second, per instance |
| Entity operation processing | 64 operations per second |

If you are not seeing the throughput numbers you expect and your CPU and memory usage appears healthy, check to see whether the cause is related to [the health of your storage account](../../storage/common/storage-monitoring-diagnosing-troubleshooting.md#troubleshooting-guidance). The Durable Functions extension can put significant load on an Azure Storage account and sufficiently high loads may result in storage account throttling.

> [!TIP]
> In some cases you can significantly increase the throughput of external events, activity fan-in, and entity operations by increasing the value of the `controlQueueBufferThreshold` setting in **host.json**. Increasing this value beyond its default causes the Durable Task Framework storage provider to use more memory to prefetch these events more aggressively, reducing delays associated with dequeueing messages from the Azure Storage control queues. For more information, see the [host.json](durable-functions-bindings.md#host-json) reference documentation.

### High throughput processing

The architecture of the Azure Storage backend puts certain limitations on the maximum theoretical performance and scalability of Durable Functions. If your testing shows that Durable Functions on Azure Storage won't meet your throughput requirements, you should consider instead using the [Netherite storage provider for Durable Functions](durable-functions-storage-providers.md#netherite).

The Netherite storage backend was designed and developed by [Microsoft Research](https://www.microsoft.com/research). It uses [Azure Event Hubs](../../event-hubs/event-hubs-about.md) and the [FASTER](https://www.microsoft.com/research/project/faster/) database technology on top of [Azure Page Blobs](../../storage/blobs/storage-blob-pageblob-overview.md). The design of Netherite enables significantly higher-throughput processing of orchestrations and entities compared to other providers. In some benchmark scenarios, throughput was shown to increase by more than an order of magnitude when compared to the default Azure Storage provider.

For more information on the supported storage providers for Durable Functions and how they compare, see the [Durable Functions storage providers](durable-functions-storage-providers.md) documentation.

## Next steps

> [!div class="nextstepaction"]
> [Learn about disaster recovery and geo-distribution](durable-functions-disaster-recovery-geo-distribution.md)
