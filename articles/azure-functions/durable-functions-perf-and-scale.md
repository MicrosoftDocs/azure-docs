---
title: Performance and scale in Durable Functions - Azure
description: Introduction to the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/25/2018
ms.author: azfuncdf
---

# Performance and scale in Durable Functions (Azure Functions)

To optimize performance and scalability, it's important to understand the unique scaling characteristics of [Durable Functions](durable-functions-overview.md).

To understand the scale behavior, you have to understand some of the details of the underlying Azure Storage provider used by Durable Functions.

## History table

The **History** table is an Azure Storage table that contains the history events for all orchestration instances within a task hub. As instances run, new rows are added to this table. The partition key of this table is derived from the instance ID of the orchestration. These values are random in most cases, which ensures optimal distribution of internal partitions in Azure Storage.

When an orchestration instance needs to be loaded into memory, the rows of the history table associated with that instance are read and executed in order to bring the orchestration back into its previously checkpointed state. The use of execution history to rebuild state in this way is influenced by the [Event Sourcing pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing).

## Instances table

The **Instances** table is another Azure Storage table that contains the status of all orchestration instances within a task hub. As instances are created, new rows are added to this table. The partition key of this table is the orchestration instance ID and the row key is a fixed constant. There is one row per orchestration instance.

This table is used to satisfy instance query requests from the [GetStatusAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_GetStatusAsync_System_String_) API as well as the [status query HTTP API](https://docs.microsoft.com/en-us/azure/azure-functions/durable-functions-http-api#get-instance-status). It is kept eventually consistent with the contents of the **History** table mentioned previously. The use of a separate Azure Storage table to efficiently satisfy instance query operations in this way is influenced by the [Command and Query Responsibility Segregation (CQRS) pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs).

## Internal queue triggers

Orchestrator functions and activity functions are both triggered by internal queues in the function app's task hub. Using queues in this way provides reliable "at-least-once" message delivery guarantees. There are two types of queues in Durable Functions: the **control queue** and the **work-item queue**.

### The work-item queue

There is one work-item queue per task hub in Durable Functions. This is a basic queue and behaves similarly to any other `queueTrigger` queue in Azure Functions. This queue is used to trigger stateless *activity functions* by dequeing a single message at a time. Each of these messages contain activity function inputs and additional metadata, such as which function to execute. When a Durable Functions application scales out to multiple VMs, these VMs all compete to acquire work from the work-item queue.

### Control queue(s)

The *control queue* is more sophisticated than the simpler work-item queue. It's used to trigger the stateful orchestrator functions. Because the orchestrator function instances are stateful singletons, it's not possible to use a competing consumer model to distribute load across VMs. Instead, orchestrator messages are load-balanced across multiple control queues. More details on this in subsequent sections.

Control queues contain a variety of orchestration lifecycle message types. Examples include [orchestrator control messages](durable-functions-instance-management.md), activity function *response* messages, and timer messages. As many as 32 messages will be dequeued from a control queue in a single poll. These messages contain payload data as well as metadata including which orchestration instance it is intended for. If multiple messages are dequeued and are intended for the same orchestration instance, they will be processed as a batch.

## Storage account selection

The queues, tables, and blobs used by Durable Functions are created by default in the default storage account of the function app (normally specified by the `AzureWebJobsStorage` app setting). However, it's possible to choose a different storage account for these artifacts by specifying an alternate app setting name in the `durableTask/azureStorageConnectionStringName` setting in **host.json** file:

```json
{
  "durableTask": {
    "azureStorageConnectionStringName": "MyStorageAccountAppSetting"
  }
}
```

Configuring a non-default storage account can be useful if you want to maximize Azure Storage performance by isolating Durable Functions storage usage from the internal storage overhead generated by the Azure Functions host.

## Orchestrator scale-out

Activity functions are stateless and scale out automatically by adding VMs. Orchestrator functions, on the other hand, are *partitioned* across one or more control queues. The number of control queues is defined in the **host.json** file. The following example host.json snippet sets the `partitionCount` property to `3`.

```json
{
  "durableTask": {
    "partitionCount": 3
  }
}
```
A task hub can be configured with between 1 and 16 partitions. If not specified, the default partition count is **4**.

When scaling out to multiple function host instances (typically on different VMs), each instance acquires a lock on one of the control queues. These locks are internally implemented as blob storage leases and ensure that an orchestration instance only runs on a single host instance at a time. This means that if a task hub is configured with three control queues, orchestration instances can be load-balanced across as many as three VMs. Additional VMs can be added to increase capacity for activity function execution, but the additional resources will not be used to run orchestrator functions.

The following diagram illustrates how the Azure Functions host interacts with the storage entities in a scaled out environment.

![Scale diagram](media/durable-functions-perf-and-scale/scale-diagram.png)

As you can see, all VMs can compete for messages on the work-item queue. However, only three VMs can acquire messages from control queues, and each VM locks a single control queue.

Orchestration instances are distributed across control queue instances by running an internal hash function against the orchestration's instance ID. Instance IDs are auto-generated and random by default that ensures that instances are balanced across all available control queues.

In general, orchestrator functions are intended to be lightweight and should not need a lot of computing power. For this reason, it is not necessary to create a large number of control queue partitions to get great throughput. Rather, most of the heavy work is done in stateless activity functions, which can be scaled out infinitely.

## Auto-scale

As with all Azure Functions running in the Consumption plan, Durable Functions support auto-scale via the [Azure Functions scale controller](https://docs.microsoft.com/azure/azure-functions/functions-scale#runtime-scaling). The Scale Controller monitors the latency of the work-item queue and each of the control queues by periodically issuing _peek_ commands. Based on the latency of the peeked messages, the scale controller will decide whether to add or remove VMs.

If the scale controller determines that control queue message latencies are too high, the scale controller will continue adding VM instances until either the message latency decreases to an acceptable level or until it reaches the control queue partition count. If work-item queue latencies are increasing over time, the scale controller will continue adding VM instances until message latencies decrease to an acceptable level, regardless of the control queue partition count.

## Thread usage

Orchestrator functions are executed on a single thread. This is required to ensure that orchestrator function execution is deterministic. With this in mind, it's important to never keep the orchestrator function thread unnecessarily busy with tasks such as I/O (which is forbidden for a variety of reasons), blocking, or spinning operations. Any work which may require I/O, blocking, or multiple threads should be moved into activity functions.

Activity functions have all the same behaviors as regular queue-triggered functions. This means they can safely do I/O, execute CPU intensive operations, and use multiple threads. Because activity triggers are stateless, they can freely scale out to an unbounded number of VMs.

## Concurrency throttles

Azure Functions supports executing multiple functions concurrently within a single app instance. This is useful for a variety of reasons, including increasing parallelism and minimizing the number of "cold starts" that a typical app will experience over time. However, each concurrent function invocation within a single app instance operates within the same memory space (1.5 GB in the consumption plan), so it is often useful to throttle the per-instance concurrency to avoid the possibility of running out of memory in high-load situations.

Both activity function and orchestrator function concurrency limits can be configured in the **host.json** file. The relevant settings are `durableTask/maxConcurrentActivityFunctions` and `durableTask/maxConcurrentOrchestratorFunctions` respectively.

```json
{
  "durableTask": {
    "maxConcurrentActivityFunctions": 10,
    "maxConcurrentOrchestratorFunctions": 10,
  }
}
```

If not specified, the number of concurrent activity and orchestrator function executions is capped at 10X the number of cores on the VM.

> [!NOTE]
> These settings are useful to help manage memory and CPU usage on a single VM. However, when scaled out across multiple VMs, each VM will have its own set set of limits. These settings cannot be used to control concurrency at a global level.

## Orchestration Function Replay
As mentioned previously, orchestrator functions are replayed using the contents of the **History** table. By default, each batch of messages for a single orchestration instance fetched from a control queue will result in a full replay of the orchestrator function. This default behavior is useful to help catch non-deterministic logic in orchestrator functions at development time.

This aggressive replay behavior can be disabled using a setting known as **extended sessions**. Enabling extended sessions causes orchestrator function instances to be held in memory longer so that new messages can be processed immediately without requiring a full replay of the function logic. Extended sessions can be enabled by setting `durableTask/extendedSessionsEnabled` to `true` in the **host.json** file. The `durableTask/extendedSessionIdleTimeoutInSeconds` setting can be used to control how long a session will be held in memory:

```json
{
  "durableTask": {
    "extendedSessionsEnabled": true,
    "extendedSessionIdleTimeoutInSeconds": 30
  }
}
```

The typical effect of enabling extended sessions is reduced I/O against the Azure Storage account and overall improved throughput.

However, it is important to note that using this setting can increase memory usage and can actually *decrease* throughput in certain situations. An extended session will count against the configured concurrency limits, so throughput will be negatively impacted if there are many different orchestration instances that are each triggered infrequently.

> [!NOTE]
> These settings should only be used after an orchestrator function has been fully developed and tested. The default aggressive replay behavior is useful for detecting idempotency errors in orchestrator functions at development time.

## Next steps

> [!div class="nextstepaction"]
> [Install the Durable Functions extension and samples](durable-functions-install.md)
