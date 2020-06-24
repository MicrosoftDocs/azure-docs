---
title: Performance and scale in Durable Functions - Azure
description: Introduction to the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: conceptual
ms.date: 11/03/2019
ms.author: azfuncdf
---

# Performance and scale in Durable Functions (Azure Functions)

To optimize performance and scalability, it's important to understand the unique scaling characteristics of [Durable Functions](durable-functions-overview.md).

To understand the scale behavior, you have to understand some of the details of the underlying Azure Storage provider.

## History table

The **History** table is an Azure Storage table that contains the history events for all orchestration instances within a task hub. The name of this table is in the form *TaskHubName*History. As instances run, new rows are added to this table. The partition key of this table is derived from the instance ID of the orchestration. An instance ID is random in most cases, which ensures optimal distribution of internal partitions in Azure Storage.

When an orchestration instance needs to run, the appropriate rows of the History table are loaded into memory. These *history events* are then replayed into the orchestrator function code to get it back into its previously checkpointed state. The use of execution history to rebuild state in this way is influenced by the [Event Sourcing pattern](https://docs.microsoft.com/azure/architecture/patterns/event-sourcing).

## Instances table

The **Instances** table is another Azure Storage table that contains the statuses of all orchestration and entity instances within a task hub. As instances are created, new rows are added to this table. The partition key of this table is the orchestration instance ID or entity key and the row key is a fixed constant. There is one row per orchestration or entity instance.

This table is used to satisfy instance query requests from the `GetStatusAsync` (.NET) and `getStatus` (JavaScript) APIs as well as the [status query HTTP API](durable-functions-http-api.md#get-instance-status). It is kept eventually consistent with the contents of the **History** table mentioned previously. The use of a separate Azure Storage table to efficiently satisfy instance query operations in this way is influenced by the [Command and Query Responsibility Segregation (CQRS) pattern](https://docs.microsoft.com/azure/architecture/patterns/cqrs).

## Internal queue triggers

Orchestrator functions and activity functions are both triggered by internal queues in the function app's task hub. Using queues in this way provides reliable "at-least-once" message delivery guarantees. There are two types of queues in Durable Functions: the **control queue** and the **work-item queue**.

### The work-item queue

There is one work-item queue per task hub in Durable Functions. It is a basic queue and behaves similarly to any other `queueTrigger` queue in Azure Functions. This queue is used to trigger stateless *activity functions* by dequeueing a single message at a time. Each of these messages contains activity function inputs and additional metadata, such as which function to execute. When a Durable Functions application scales out to multiple VMs, these VMs all compete to acquire work from the work-item queue.

### Control queue(s)

There are multiple *control queues* per task hub in Durable Functions. A *control queue* is more sophisticated than the simpler work-item queue. Control queues are used to trigger the stateful orchestrator and entity functions. Because the orchestrator and entity function instances are stateful singletons, it's not possible to use a competing consumer model to distribute load across VMs. Instead, orchestrator and entity messages are load-balanced across the control queues. More details on this behavior can be found in subsequent sections.

Control queues contain a variety of orchestration lifecycle message types. Examples include [orchestrator control messages](durable-functions-instance-management.md), activity function *response* messages, and timer messages. As many as 32 messages will be dequeued from a control queue in a single poll. These messages contain payload data as well as metadata including which orchestration instance it is intended for. If multiple dequeued messages are intended for the same orchestration instance, they will be processed as a batch.

### Queue polling

The durable task extension implements a random exponential back-off algorithm to reduce the effect of idle-queue polling on storage transaction costs. When a message is found, the runtime immediately checks for another message; when no message is found, it waits for a period of time before trying again. After subsequent failed attempts to get a queue message, the wait time continues to increase until it reaches the maximum wait time, which defaults to 30 seconds.

The maximum polling delay is configurable via the `maxQueuePollingInterval` property in the [host.json file](../functions-host-json.md#durabletask). Setting this property to a higher value could result in higher message processing latencies. Higher latencies would be expected only after periods of inactivity. Setting this property to a lower value could result in higher storage costs due to increased storage transactions.

> [!NOTE]
> When running in the Azure Functions Consumption and Premium plans, the [Azure Functions Scale Controller](../functions-scale.md#how-the-consumption-and-premium-plans-work) will poll each control and work-item queue once every 10 seconds. This additional polling is necessary to determine when to activate function app instances and to make scale decisions. At the time of writing, this 10 second interval is constant and cannot be configured.

### Orchestration start delays
Orchestrations instances are started by putting an `ExecutionStarted` message in one of the task hub's control queues. Under certain conditions, you may observe multi-second delays between when an orchestration is scheduled to run and when it actually starts running. During this time interval, the orchestration instance remains in the `Pending` state. There are two potential causes of this delay:

1. **Backlogged control queues**: If the control queue for this instance contains a large number of messages, it may take time before the `ExecutionStarted` message is received and processed by the runtime. Message backlogs can happen when orchestrations are processing lots of events concurrently. Events that go into the control queue include orchestration start events, activity completions, durable timers, termination, and external events. If this delay happens under normal circumstances, consider creating a new task hub with a larger number of partitions. Configuring more partitions will cause the runtime to create more control queues for load distribution.

2. **Back off polling delays**: Another common cause of orchestration delays is the [previously described back-off polling behavior for control queues](#queue-polling). However, this delay is only expected when an app is scaled out to two or more instances. If there is only one app instance or if the app instance that starts the orchestration is also the same instance that is polling the target control queue, then there will not be a queue polling delay. Back off polling delays can be reduced by updating the **host.json** settings, as described previously.

## Storage account selection

The queues, tables, and blobs used by Durable Functions are created in a configured Azure Storage account. The account to use can be specified using the `durableTask/storageProvider/connectionStringName` setting (or `durableTask/azureStorageConnectionStringName` setting in Durable Functions 1.x) in the **host.json** file.

### Durable Functions 2.x

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

### Durable Functions 1.x

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

## Orchestrator scale-out

Activity functions are stateless and scaled out automatically by adding VMs. Orchestrator functions and entities, on the other hand, are *partitioned* across one or more control queues. The number of control queues is defined in the **host.json** file. The following example host.json snippet sets the `durableTask/storageProvider/partitionCount` property (or `durableTask/partitionCount` in Durable Functions 1.x) to `3`.

### Durable Functions 2.x

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

### Durable Functions 1.x

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

When scaling out to multiple function host instances (typically on different VMs), each instance acquires a lock on one of the control queues. These locks are internally implemented as blob storage leases and ensure that an orchestration instance or entity only runs on a single host instance at a time. If a task hub is configured with three control queues, orchestration instances and entities can be load-balanced across as many as three VMs. Additional VMs can be added to increase capacity for activity function execution.

The following diagram illustrates how the Azure Functions host interacts with the storage entities in a scaled out environment.

![Scale diagram](./media/durable-functions-perf-and-scale/scale-diagram.png)

As shown in the previous diagram, all VMs compete for messages on the work-item queue. However, only three VMs can acquire messages from control queues, and each VM locks a single control queue.

Orchestration instances and entities are distributed across all control queue instances. The distribution is done by hashing the instance ID of the orchestration or the entity name and key pair. Orchestration instance IDs by default are random GUIDs, ensuring that instances are equally distributed across all control queues.

Generally speaking, orchestrator functions are intended to be lightweight and should not require large amounts of computing power. It is therefore not necessary to create a large number of control queue partitions to get great throughput for orchestrations. Most of the heavy work should be done in stateless activity functions, which can be scaled out infinitely.

## Auto-scale

As with all Azure Functions running in the Consumption and Elastic Premium plans, Durable Functions supports auto-scale via the [Azure Functions scale controller](../functions-scale.md#runtime-scaling). The Scale Controller monitors the latency of all queues by periodically issuing _peek_ commands. Based on the latencies of the peeked messages, the Scale Controller will decide whether to add or remove VMs.

If the Scale Controller determines that control queue message latencies are too high, it will add VM instances until either the message latency decreases to an acceptable level or it reaches the control queue partition count. Similarly, the Scale Controller will continually add VM instances if work-item queue latencies are high, regardless of the partition count.

> [!NOTE]
> Starting with Durable Functions 2.0, function apps can be configured to run within VNET-protected service endpoints in the Elastic Premium plan. In this configuration, the Durable Functions triggers initiate scale requests instead of the Scale Controller.

## Thread usage

Orchestrator functions are executed on a single thread to ensure that execution can be deterministic across many replays. Because of this single-threaded execution, it's important that orchestrator function threads do not perform CPU-intensive tasks, do I/O, or block for any reason. Any work that may require I/O, blocking, or multiple threads should be moved into activity functions.

Activity functions have all the same behaviors as regular queue-triggered functions. They can safely do I/O, execute CPU intensive operations, and use multiple threads. Because activity triggers are stateless, they can freely scale out to an unbounded number of VMs.

Entity functions are also executed on a single thread and operations are processed one-at-a-time. However, entity functions do not have any restrictions on the type of code that can be executed.

## Concurrency throttles

Azure Functions supports executing multiple functions concurrently within a single app instance. This concurrent execution helps increase parallelism and minimizes the number of "cold starts" that a typical app will experience over time. However, high concurrency can exhaust per-VM system resources such network connections or available memory. Depending on the needs of the function app, it may be necessary to throttle the per-instance concurrency to avoid the possibility of running out of memory in high-load situations.

Activity, orchestrator, and entity function concurrency limits can be configured in the **host.json** file. The relevant settings are `durableTask/maxConcurrentActivityFunctions` for activity functions and `durableTask/maxConcurrentOrchestratorFunctions` for both orchestrator and entity functions.

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

> [!NOTE]
> These settings are useful to help manage memory and CPU usage on a single VM. However, when scaled out across multiple VMs, each VM has its own set of limits. These settings can't be used to control concurrency at a global level.

## Extended sessions

Extended sessions is a setting that keeps orchestrations and entities in memory even after they finish processing messages. The typical effect of enabling extended sessions is reduced I/O against the Azure Storage account and overall improved throughput.

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

1. There's an overall increase in function app memory usage.
2. There can be an overall decrease in throughput if there are many concurrent, short-lived orchestrator or entity function executions.

As an example, if `durableTask/extendedSessionIdleTimeoutInSeconds` is set to 30 seconds, then a short-lived orchestrator or entity function episode that executes in less than 1 second still occupies memory for 30 seconds. It also counts against the `durableTask/maxConcurrentOrchestratorFunctions` quota mentioned previously, potentially preventing other orchestrator or entity functions from running.

The specific effects of extended sessions on orchestrator and entity functions are described in the next sections.

### Orchestrator function replay

As mentioned previously, orchestrator functions are replayed using the contents of the **History** table. By default, the orchestrator function code is replayed every time a batch of messages are dequeued from a control queue. Even if you are using the fan-out, fan-in pattern and are awaiting for all tasks to complete (for example, using `Task.WhenAll` in .NET or `context.df.Task.all` in JavaScript), there will be replays that occur as batches of task responses are processed over time. When extended sessions are enabled, orchestrator function instances are held in memory longer and new messages can be processed without a full history replay.

The performance improvement of extended sessions is most often observed in the following situations:

* When there are a limited number of orchestration instances running concurrently.
* When orchestrations have large number of sequential actions (e.g. hundreds of activity function calls) that complete quickly.
* When orchestrations fan-out and fan-in a large number of actions that complete around the same time.
* When orchestrator functions need to process large messages or do any CPU-intensive data processing.

In all other situations, there is typically no observable performance improvement for orchestrator functions.

> [!NOTE]
> These settings should only be used after an orchestrator function has been fully developed and tested. The default aggressive replay behavior can useful for detecting [orchestrator function code constraints](durable-functions-code-constraints.md) violations at development time, and is therefore disabled by default.

### Entity function unloading

Entity functions process up to 20 operations in a single batch. As soon as an entity finishes processing a batch of operations, it persists its state and unloads from memory. You can delay the unloading of entities from memory using the extended sessions setting. Entities continue to persist their state changes as before, but remain in memory for the configured period of time to reduce the number of loads from Azure Storage. This reduction of loads from Azure Storage can improve the overall throughput of frequently accessed entities.

## Performance targets

When planning to use Durable Functions for a production application, it is important to consider the performance requirements early in the planning process. This section covers some basic usage scenarios and the expected maximum throughput numbers.

* **Sequential activity execution**: This scenario describes an orchestrator function that runs a series of activity functions one after the other. It most closely resembles the [Function Chaining](durable-functions-sequence.md) sample.
* **Parallel activity execution**: This scenario describes an orchestrator function that executes many activity functions in parallel using the [Fan-out, Fan-in](durable-functions-cloud-backup.md) pattern.
* **Parallel response processing**: This scenario is the second half of the [Fan-out, Fan-in](durable-functions-cloud-backup.md) pattern. It focuses on the performance of the fan-in. It's important to note that unlike fan-out, fan-in is done by a single orchestrator function instance, and therefore can only run on a single VM.
* **External event processing**: This scenario represents a single orchestrator function instance that waits on [external events](durable-functions-external-events.md), one at a time.
* **Entity operation processing**: This scenario tests how quickly a _single_ [Counter entity](durable-functions-entities.md) can process a constant stream of operations.

> [!TIP]
> Unlike fan-out, fan-in operations are limited to a single VM. If your application uses the fan-out, fan-in pattern and you are concerned about fan-in performance, consider sub-dividing the activity function fan-out across multiple [sub-orchestrations](durable-functions-sub-orchestrations.md).

The following table shows the expected *maximum* throughput numbers for the previously described scenarios. "Instance" refers to a single instance of an orchestrator function running on a single small ([A1](../../virtual-machines/sizes-previous-gen.md)) VM in Azure App Service. In all cases, it is assumed that [extended sessions](#orchestrator-function-replay) are enabled. Actual results may vary depending on the CPU or I/O work performed by the function code.

| Scenario | Maximum throughput |
|-|-|
| Sequential activity execution | 5 activities per second, per instance |
| Parallel activity execution (fan-out) | 100 activities per second, per instance |
| Parallel response processing (fan-in) | 150 responses per second, per instance |
| External event processing | 50 events per second, per instance |
| Entity operation processing | 64 operations per second |

> [!NOTE]
> These numbers are current as of the v1.4.0 (GA) release of the Durable Functions extension. These numbers may change over time as the feature matures and as optimizations are made.

If you are not seeing the throughput numbers you expect and your CPU and memory usage appears healthy, check to see whether the cause is related to [the health of your storage account](../../storage/common/storage-monitoring-diagnosing-troubleshooting.md#troubleshooting-guidance). The Durable Functions extension can put significant load on
an Azure Storage account and sufficiently high loads may result in storage account throttling.

## Next steps

> [!div class="nextstepaction"]
> [Learn about disaster recovery and geo-distribution](durable-functions-disaster-recovery-geo-distribution.md)
