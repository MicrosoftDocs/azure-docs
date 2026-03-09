---
title: Performance and scale in Durable Functions - Azure
description: Learn about the unique scaling characteristics of the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: conceptual
ms.date: 02/03/2026
ms.author: azfuncdf
---

# Performance and scale in Durable Functions (Azure Functions)

To optimize performance and scalability, understand the scaling behavior of [Durable Functions](what-is-durable-task.md). This article explains how the Functions host scales workers based on load and how to tune different settings.

## Worker scaling

A key benefit of the [task hub concept](durable-functions-task-hubs.md) is that the number of workers that process task hub work items scales up and down. Applications add workers (*scale out*) to process work faster and remove workers (*scale in*) when there isn't enough work to keep them busy.
You can even *scale to zero* when the task hub is idle. When you scale to zero, no workers run. Only the scale controller and storage remain active.

The following diagram illustrates this concept:

:::image type="content" source="./media/durable-functions-perf-and-scale/worker-scaling.png" alt-text="Diagram that shows workers scaling out, scaling in, and scaling to zero for a task hub.":::

### Automatic scaling

In the Consumption and Elastic Premium plans, Durable Functions supports autoscale through the [Azure Functions scale controller](../event-driven-scaling.md#runtime-scaling). The scale controller monitors how long messages and tasks wait before processing. Based on these latencies, it adds or removes workers.

> [!NOTE]
> Starting with Durable Functions 2.0, you can configure function apps to run in VNet-protected service endpoints in the Elastic Premium plan. In this configuration, the Durable Functions triggers start scale requests instead of the scale controller. For more information, see [Runtime scale monitoring](../functions-networking-options.md#elastic-premium-plan-with-virtual-network-triggers).

On the Premium plan, automatic scaling keeps the number of workers (and operating cost) roughly proportional to the application's load.

### CPU usage

**Orchestrator functions** run their logic multiple times because they replay. So it's important that orchestrator function threads don't perform CPU intensive tasks, do I/O, or block. Move work that can require I/O, blocking, or multiple threads into activity functions.

**Activity functions** behave like regular queue-triggered functions. They support I/O, CPU intensive operations, and multiple threads. Because activity triggers are stateless, they scale out to many VMs.

**Entity functions** also run on a single thread and process operations one at a time. Entity functions have no restrictions on the type of code they run.

### Function timeouts

Activity, orchestrator, and entity functions are subject to the same [function timeouts](../functions-scale.md#timeout) as other Azure Functions. Durable Functions treats a function timeout like an unhandled exception in your code.

For example, when an activity times out, Durable Functions records the execution as failed and notifies the orchestrator. The orchestrator handles the timeout like any other exception: the runtime retries if the call specifies retries, or it runs an exception handler.

### Entity operation batching

To improve performance and reduce cost, a single work item can execute a batch of entity operations. On the Consumption plan, each batch is billed as a single function execution.

By default, the maximum batch size is 50 on the Consumption plan and 5,000 on other plans. You can also configure the maximum batch size in the [host.json](durable-functions-bindings.md#host-json) file. If the maximum batch size is 1, batching is effectively disabled.

> [!NOTE]
> If individual entity operations take a long time to execute, it can be helpful to limit the maximum batch size to reduce the risk of [function timeouts](#function-timeouts), especially on the Consumption plan.



## Instance caching

To process an [orchestration work item](durable-functions-task-hubs.md#work-items), a worker does two things:

1. Fetch the orchestration history.
1. Replay the orchestrator code by using the history.

If the same worker processes multiple work items for the same orchestration, the storage provider can cache the history in the worker's memory to eliminate the first step. It can also cache the mid-execution orchestrator to avoid replaying history for subsequent work items.

Caching typically reduces I/O to the underlying storage service and improves throughput and latency. But it also increases worker memory use.

The Azure Storage provider and the Netherite storage provider support instance caching. The table compares providers.

| | Azure Storage provider | Netherite storage provider | MSSQL storage provider |
| - | ---------------------- | -------------------------- | ---------------------- |
| **Instance caching** | Supported<br/>(.NET in-process worker only) | Supported | Not supported |
| **Default setting** | Disabled | Enabled | n/a |
| **Mechanism** | Extended Sessions | Instance Cache | n/a |
| **Documentation** | See [Extended sessions](durable-functions-azure-storage-provider.md#extended-sessions) | See [Instance cache](https://microsoft.github.io/durabletask-netherite/#/caching) | n/a |

> [!TIP]
> Caching can reduce how often the runtime replays history, but it can't eliminate replay. During development, test orchestrators with caching disabled. Forced replay helps you detect violations of [orchestrator function code constraints](durable-functions-code-constraints.md).

### Comparison of caching mechanisms

The providers use different mechanisms to implement caching and offer different parameters to configure the caching behavior.

* **Extended sessions**, used by the Azure Storage provider, keep mid-execution orchestrators in memory until they're idle for a set time. Control this behavior with `extendedSessionsEnabled` and `extendedSessionIdleTimeoutInSeconds`. For details, see [Extended sessions](durable-functions-azure-storage-provider.md#extended-sessions) in the Azure Storage provider documentation.

> [!NOTE]
> Extended sessions are supported only in the .NET in-process worker.

* The **Instance cache**, used by the Netherite storage provider, keeps instance state and history in the worker's memory and tracks total memory use. If the cache exceeds the `InstanceCacheSizeMB` limit, it evicts the least recently used instance data. If you set `CacheOrchestrationCursors` to `true`, the cache also stores the mid-execution orchestrators.
 For details, see [Instance cache](https://microsoft.github.io/durabletask-netherite/#/caching) in the Netherite storage provider documentation.

> [!NOTE]
> Instance caches work with all language SDKs, but the `CacheOrchestrationCursors` option is available only for the .NET in-process worker.


## Concurrency throttles

A single worker instance can execute multiple [work items](durable-functions-task-hubs.md#work-items) concurrently. This increases parallelism and uses worker resources more efficiently.
But if a worker processes too many work items at once, it can exhaust resources like CPU, network connections, and memory.

To keep an individual worker from overcommitting, you might need to throttle per-instance concurrency. Limiting the number of functions that run at the same time on each worker helps avoid hitting that worker's resource limits.

> [!NOTE]
> Concurrency throttles apply only locally and limit what's processing **per worker**. So they don't limit total system throughput.

> [!TIP]
> In some cases, throttling the per-worker concurrency can actually *increase* the total throughput of the system. This can occur when each worker takes less work, causing the scale controller to add more workers to keep up with the queues, which then increases the total throughput.

### Configure throttles

Configure activity, orchestrator, and entity function concurrency limits in the *host.json* file. Use `durableTask/maxConcurrentActivityFunctions` for activity functions and `durableTask/maxConcurrentOrchestratorFunctions` for orchestrator and entity functions. These settings limit how many orchestrator, entity, and activity functions a worker loads into memory.

> [!NOTE]
> Orchestrations and entities load into memory only while they process events or operations, or when [instance caching](durable-functions-perf-and-scale.md#instance-caching) is enabled. After they run their logic and then await (for example, `await` in C# or `yield` in JavaScript and Python), they can unload from memory. Unloaded orchestrations and entities don't count toward the `maxConcurrentOrchestratorFunctions` throttle. Even if millions of instances are in the "Running" state, only the instances in memory count toward the throttle limit. An orchestration that's waiting for an activity to finish also doesn't count toward the throttle.

#### Functions 2.0

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

#### Functions 1.x

```json
{
  "durableTask": {
    "maxConcurrentActivityFunctions": 10,
    "maxConcurrentOrchestratorFunctions": 10
  }
}
```

### Language runtime considerations

The language runtime you select can impose strict concurrency restrictions on your functions. For example, Durable Functions apps written in Python or PowerShell can run only one function at a time on a single VM. This can cause performance problems if you don't account for it. If an orchestrator fans out to 10 activities but the language runtime allows only one function to run, nine of the 10 activity functions are stuck waiting for a chance to run. Also, these waiting activities can't be load balanced to other workers because the Durable Functions runtime already loads them into memory. This is especially problematic when the activity functions are long running.

If your language runtime restricts concurrency, update Durable Functions concurrency settings to match it. This keeps the Durable Functions runtime from running more functions concurrently than the language runtime allows and lets pending activities be load balanced to other VMs. For example, if a Python app restricts concurrency to four functions (for example, 4 threads on a single language worker process or 1 thread on 4 language worker processes), configure both `maxConcurrentOrchestratorFunctions` and `maxConcurrentActivityFunctions` to 4.

For Python performance recommendations, see [Improve throughput performance of Python apps in Azure Functions](../python-scale-performance-reference.md). These techniques can significantly improve Durable Functions performance and scalability.


## Partition count

Some storage providers support *partitioning* and let you set `partitionCount`.

With partitioning, workers don't compete for individual work items. Partitioning groups work items into `partitionCount` partitions, and the runtime assigns partitions to workers. This approach reduces the total number of storage accesses. It also enables [instance caching](durable-functions-perf-and-scale.md#instance-caching) and improves locality by creating *affinity*: the same worker processes all work items for the same instance.

> [!NOTE]
> Partitioning limits scale out because only `partitionCount` workers can process work items from a partitioned queue.

The following table shows which queues each storage provider partitions and the allowed range and default values for `partitionCount`.

| | Azure Storage provider | Netherite storage provider | MSSQL storage provider |
| - | ---------------------- | -------------------------- | ---------------------- |
| **Instance messages** | Partitioned | Partitioned | Not partitioned |
| **Activity messages** | Not partitioned | Partitioned | Not partitioned |
| **Default `partitionCount`** | 4 | 12 | n/a |
| **Maximum `partitionCount`** | 16 | 32 | n/a |
| **Documentation** | See [Orchestrator scale-out](durable-functions-azure-storage-provider.md#orchestrator-scale-out) | See [Partition count considerations](https://microsoft.github.io/durabletask-netherite/#/settings?id=partition-count-considerations) | n/a |

> [!WARNING]
> You can't change the partition count after you create a task hub. Set it high enough to meet expected scale-out requirements for the task hub instance.

### Configure partition count

Specify `partitionCount` in the *host.json* file. The following *host.json* snippet sets `durableTask/storageProvider/partitionCount` (or `durableTask/partitionCount` in Durable Functions 1.x) to `3`.

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

## Minimize invocation latency

Invocation requests for activities, orchestrators, and entities usually complete quickly, but invocation latency depends on your App Service plan scale behavior, your concurrency settings, and your application's backlog size. Use [stress testing](/azure/azure-functions/durable/durable-functions-best-practice-reference#invest-in-stress-testing) to measure and reduce your application's tail latency.

## Performance targets

When you're planning a production app with Durable Functions, consider performance requirements early. These basic usage scenarios help you plan:

* **Sequential activity execution**: This scenario describes an orchestrator function that runs a series of activity functions in sequence. It most closely resembles the [Function chaining](durable-functions-sequence.md) sample.
* **Parallel activity execution**: This scenario describes an orchestrator function that executes many activity functions in parallel using the [Fan-out, fan-in](durable-functions-monitor.md) pattern.
* **Parallel response processing**: This scenario is the second half of the [Fan-out, fan-in](durable-functions-monitor.md) pattern. It focuses on fan-in performance. Unlike fan-out, fan-in runs in a single orchestrator function instance, so it runs on a single VM.
* **External event processing**: This scenario represents a single orchestrator function instance that waits on [external events](durable-functions-external-events.md), one at a time.
* **Entity operation processing**: This scenario tests how quickly a *single* [Counter entity](durable-functions-entities.md) can process a constant stream of operations.

Throughput numbers for these scenarios are in the storage provider documentation. In particular:

* For the Azure Storage provider, see [Performance targets](durable-functions-azure-storage-provider.md#performance-targets).
* For the Netherite storage provider, see [Basic scenarios](https://microsoft.github.io/durabletask-netherite/#/scenarios).
* For the MSSQL storage provider, see [Orchestration throughput benchmarks](https://microsoft.github.io/durabletask-mssql/#/scaling?id=orchestration-throughput-benchmarks).

> [!TIP]
> Unlike fan-out, fan-in operations are limited to a single VM. If your application uses the fan-out, fan-in pattern and you're concerned about fan-in performance, consider subdividing the activity function fan-out across multiple [sub-orchestrations](durable-functions-sub-orchestrations.md).

## Next steps

> [!div class="nextstepaction"]
> [Azure Storage provider](durable-functions-azure-storage-provider.md)
