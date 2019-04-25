---
title: Performance and scale in Durable Functions - Azure
description: Introduction to the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 03/14/2019
ms.author: azfuncdf
---

# Performance and scale in Durable Functions (Azure Functions)

To optimize performance and scalability, it's important to understand the unique scaling characteristics of [Durable Functions](durable-functions-overview.md).

To understand the scale behavior, you have to understand some of the details of the underlying Azure Storage provider.

## History table

The **History** table is an Azure Storage table that contains the history events for all orchestration instances within a task hub. The name of this table is in the form *TaskHubName*History. As instances run, new rows are added to this table. The partition key of this table is derived from the instance ID of the orchestration. An instance ID is random in most cases, which ensures optimal distribution of internal partitions in Azure Storage.

When an orchestration instance needs to run, the appropriate rows of the History table are loaded into memory. These *history events* are then replayed into the orchestrator function code to get it back into its previously checkpointed state. The use of execution history to rebuild state in this way is influenced by the [Event Sourcing pattern](https://docs.microsoft.com/azure/architecture/patterns/event-sourcing).

## Instances table

The **Instances** table is another Azure Storage table that contains the statuses of all orchestration instances within a task hub. As instances are created, new rows are added to this table. The partition key of this table is the orchestration instance ID and the row key is a fixed constant. There is one row per orchestration instance.

This table is used to satisfy instance query requests from the [GetStatusAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_GetStatusAsync_System_String_) (.NET) and `getStatus` (JavaScript) APIs as well as the [status query HTTP API](durable-functions-http-api.md#get-instance-status). It is kept eventually consistent with the contents of the **History** table mentioned previously. The use of a separate Azure Storage table to efficiently satisfy instance query operations in this way is influenced by the [Command and Query Responsibility Segregation (CQRS) pattern](https://docs.microsoft.com/azure/architecture/patterns/cqrs).

## Internal queue triggers

Orchestrator functions and activity functions are both triggered by internal queues in the function app's task hub. Using queues in this way provides reliable "at-least-once" message delivery guarantees. There are two types of queues in Durable Functions: the **control queue** and the **work-item queue**.

### The work-item queue

There is one work-item queue per task hub in Durable Functions. It is a basic queue and behaves similarly to any other `queueTrigger` queue in Azure Functions. This queue is used to trigger stateless *activity functions* by dequeueing a single message at a time. Each of these messages contains activity function inputs and additional metadata, such as which function to execute. When a Durable Functions application scales out to multiple VMs, these VMs all compete to acquire work from the work-item queue.

### Control queue(s)

There are multiple *control queues* per task hub in Durable Functions. A *control queue* is more sophisticated than the simpler work-item queue. Control queues are used to trigger the stateful orchestrator functions. Because the orchestrator function instances are stateful singletons, it's not possible to use a competing consumer model to distribute load across VMs. Instead, orchestrator messages are load-balanced across the control queues. More details on this behavior can be found in subsequent sections.

Control queues contain a variety of orchestration lifecycle message types. Examples include [orchestrator control messages](durable-functions-instance-management.md), activity function *response* messages, and timer messages. As many as 32 messages will be dequeued from a control queue in a single poll. These messages contain payload data as well as metadata including which orchestration instance it is intended for. If multiple dequeued messages are intended for the same orchestration instance, they will be processed as a batch.

### Queue polling

The durable task extension implements a random exponential back-off algorithm to reduce the effect of idle-queue polling on storage transaction costs. When a message is found, the runtime immediately checks for another message; when no message is found, it waits for a period of time before trying again. After subsequent failed attempts to get a queue message, the wait time continues to increase until it reaches the maximum wait time, which defaults to 30 seconds.

The maximum polling delay is configurable via the `maxQueuePollingInterval` property in the [host.json file](../functions-host-json.md#durabletask). Setting this to a higher value could result in higher message processing latencies. Higher latencies would be expected only after periods of inactivity. Setting this to a lower value could result in higher storage costs due to increased storage transactions.

> [!NOTE]
> When running in the Azure Functions Consumption and Premium plans, the [Azure Functions Scale Controller](../functions-scale.md#how-the-consumption-and-premium-plans-work) will poll each control and work-item queue once every 10 seconds. This additional polling is necessary to determine when to activate function app instances and to make scale decisions. At the time of writing, this 10 second interval is constant and cannot be configured.

## Storage account selection

The queues, tables, and blobs used by Durable Functions are created in a configured Azure Storage account. The account to use can be specified using the `durableTask/azureStorageConnectionStringName` setting in **host.json** file.

### Functions 1.x

```json
{
  "durableTask": {
    "azureStorageConnectionStringName": "MyStorageAccountAppSetting"
  }
}
```

### Functions 2.x

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

Activity functions are stateless and scaled out automatically by adding VMs. Orchestrator functions, on the other hand, are *partitioned* across one or more control queues. The number of control queues is defined in the **host.json** file. The following example host.json snippet sets the `durableTask/partitionCount` property to `3`.

### Functions 1.x

```json
{
  "durableTask": {
    "partitionCount": 3
  }
}
```

### Functions 2.x

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

When scaling out to multiple function host instances (typically on different VMs), each instance acquires a lock on one of the control queues. These locks are internally implemented as blob storage leases and ensure that an orchestration instance only runs on a single host instance at a time. If a task hub is configured with three control queues, orchestration instances can be load-balanced across as many as three VMs. Additional VMs can be added to increase capacity for activity function execution.

The following diagram illustrates how the Azure Functions host interacts with the storage entities in a scaled out environment.

![Scale diagram](./media/durable-functions-perf-and-scale/scale-diagram.png)

As shown in the previous diagram, all VMs compete for messages on the work-item queue. However, only three VMs can acquire messages from control queues, and each VM locks a single control queue.

The orchestration instances are distributed across all control queue instances. The distribution is done by hashing the instance ID of the orchestration. Instance IDs by default are random GUIDs, ensuring that instances are equally distributed across all control queues.

Generally speaking, orchestrator functions are intended to be lightweight and should not require large amounts of computing power. It is therefore not necessary to create a large number of control queue partitions to get great throughput. Most of the heavy work should be done in stateless activity functions, which can be scaled out infinitely.

## Auto-scale

As with all Azure Functions running in the Consumption plan, Durable Functions supports auto-scale via the [Azure Functions scale controller](../functions-scale.md#runtime-scaling). The Scale Controller monitors the latency of all queues by periodically issuing _peek_ commands. Based on the latencies of the peeked messages, the Scale Controller will decide whether to add or remove VMs.

If the Scale Controller determines that control queue message latencies are too high, it will add VM instances until either the message latency decreases to an acceptable level or it reaches the control queue partition count. Similarly, the Scale Controller will continually add VM instances if work-item queue latencies are high, regardless of the partition count.

## Thread usage

Orchestrator functions are executed on a single thread to ensure that execution can be deterministic across many replays. Because of this single-threaded execution, it's important that orchestrator function threads do not perform CPU-intensive tasks, do I/O, or block for any reason. Any work that may require I/O, blocking, or multiple threads should be moved into activity functions.

Activity functions have all the same behaviors as regular queue-triggered functions. They can safely do I/O, execute CPU intensive operations, and use multiple threads. Because activity triggers are stateless, they can freely scale out to an unbounded number of VMs.

## Concurrency throttles

Azure Functions supports executing multiple functions concurrently within a single app instance. This concurrent execution helps increase parallelism and minimizes the number of "cold starts" that a typical app will experience over time. However, high concurrency can result in high per-VM memory usage. Depending on the needs of the function app, it may be necessary to throttle the per-instance concurrency to avoid the possibility of running out of memory in high-load situations.

Both activity function and orchestrator function concurrency limits can be configured in the **host.json** file. The relevant settings are `durableTask/maxConcurrentActivityFunctions` and `durableTask/maxConcurrentOrchestratorFunctions` respectively.

### Functions 1.x

```json
{
  "durableTask": {
    "maxConcurrentActivityFunctions": 10,
    "maxConcurrentOrchestratorFunctions": 10
  }
}
```

### Functions 2.x

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

In the previous example, a maximum of 10 orchestrator functions and 10 activity functions can run on a single VM concurrently. If not specified, the number of concurrent activity and orchestrator function executions is capped at 10X the number of cores on the VM.

> [!NOTE]
> These settings are useful to help manage memory and CPU usage on a single VM. However, when scaled out across multiple VMs, each VM will have its own set of limits. These settings cannot be used to control concurrency at a global level.

## Orchestrator function replay

As mentioned previously, orchestrator functions are replayed using the contents of the **History** table. By default, the orchestrator function code is replayed every time a batch of messages are dequeued from a control queue.

This aggressive replay behavior can be disabled by enabling **extended sessions**. When extended sessions are enabled, orchestrator function instances are held in memory longer and new messages can be processed without a full replay. Extended sessions are enabled by setting `durableTask/extendedSessionsEnabled` to `true` in the **host.json** file. The `durableTask/extendedSessionIdleTimeoutInSeconds` setting is used to control how long an idle session will be held in memory:

### Functions 1.x

```json
{
  "durableTask": {
    "extendedSessionsEnabled": true,
    "extendedSessionIdleTimeoutInSeconds": 30
  }
}
```

### Functions 2.x

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

The typical effect of enabling extended sessions is reduced I/O against the Azure Storage account and overall improved throughput.

However, one potential downside of this feature is that idle orchestrator function instances will stay in memory longer. There are two effects to be aware of:

1. Overall increase in function app memory usage.
2. Overall decrease in throughput if there are many concurrent, short-lived orchestrator function executions.

As an example, if `durableTask/extendedSessionIdleTimeoutInSeconds` is set to 30 seconds, then a short-lived orchestrator function episode that executes in less than 1 second will still occupy memory for 30 seconds. It will also count against the `durableTask/maxConcurrentOrchestratorFunctions` quota mentioned previously, potentially preventing other orchestrator functions from running.

> [!NOTE]
> These settings should only be used after an orchestrator function has been fully developed and tested. The default aggressive replay behavior is useful for detecting idempotency errors in orchestrator functions at development time.

## Performance targets

When planning to use Durable Functions for a production application, it is important to consider the performance requirements early in the planning process. This section covers some basic usage scenarios and the expected maximum throughput numbers.

* **Sequential activity execution**: This scenario describes an orchestrator function that runs a series of activity functions one after the other. It most closely resembles the [Function Chaining](durable-functions-sequence.md) sample.
* **Parallel activity execution**: This scenario describes an orchestrator function that executes many activity functions in parallel using the [Fan-out, Fan-in](durable-functions-cloud-backup.md) pattern.
* **Parallel response processing**: This scenario is the second half of the [Fan-out, Fan-in](durable-functions-cloud-backup.md) pattern. It focuses on the performance of the fan-in. It's important to note that unlike fan-out, fan-in is done by a single orchestrator function instance, and therefore can only run on a single VM.
* **External event processing**: This scenario represents a single orchestrator function instance that waits on [external events](durable-functions-external-events.md), one at a time.

> [!TIP]
> Unlike fan-out, fan-in operations are limited to a single VM. If your application uses the fan-out, fan-in pattern and you are concerned about fan-in performance, consider sub-dividing the activity function fan-out across multiple [sub-orchestrations](durable-functions-sub-orchestrations.md).

The following table shows the expected *maximum* throughput numbers for the previously described scenarios. "Instance" refers to a single instance of an orchestrator function running on a single small ([A1](../../virtual-machines/windows/sizes-previous-gen.md#a-series)) VM in Azure App Service. In all cases, it is assumed that [extended sessions](#orchestrator-function-replay) are enabled. Actual results may vary depending on the CPU or I/O work performed by the function code.

| Scenario | Maximum throughput |
|-|-|
| Sequential activity execution | 5 activities per second, per instance |
| Parallel activity execution (fan-out) | 100 activities per second, per instance |
| Parallel response processing (fan-in) | 150 responses per second, per instance |
| External event processing | 50 events per second, per instance |

> [!NOTE]
> These numbers are current as of the v1.4.0 (GA) release of the Durable Functions extension. These numbers may change over time as the feature matures and as optimizations are made.

If you are not seeing the throughput numbers you expect and your CPU and memory usage appears healthy, check to see whether the cause is related to [the health of your storage account](../../storage/common/storage-monitoring-diagnosing-troubleshooting.md#troubleshooting-guidance). The Durable Functions extension can put significant load on
an Azure Storage account and sufficiently high loads may result in storage account throttling.

## Next steps

> [!div class="nextstepaction"]
> [Create your first durable function in C#](durable-functions-create-first-csharp.md)
