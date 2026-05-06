---
title: "Performance and Scale in Durable Functions - Azure"
description: Explore performance and scaling in Durable Functions for Azure Functions. Learn how to tune concurrency, configure partitions, and scale workers effectively.
author: cgillum
ms.topic: concept-article
ms.service: azure-functions
ms.date: 04/22/2026
ms.author: azfuncdf
---

# Performance and scale in Durable Functions

Use this article to tune the performance and scaling behavior of your [Durable Functions](../../durable-task/common/what-is-durable-task.md) app. It covers the main levers you can adjust:

- **[Worker scaling](#worker-scaling)**: How the Azure Functions host adds and removes workers based on load.
- **[Concurrency throttles](#concurrency-throttles)**: How to limit the number of functions running concurrently on each worker.
- **[Instance caching](#instance-caching)**: How to reduce replay overhead by caching orchestration state in worker memory.
- **[Partition count](#partition-count)**: How to configure partitioning for scale-out and locality.

> [!IMPORTANT]
> If you use Python or PowerShell, read [Language runtime considerations](#language-runtime-considerations) before configuring concurrency settings. Misconfigured concurrency can cause activities to stall on a single worker.

## Worker scaling

A key benefit of the [task hub concept](../../durable-task/common/durable-task-hubs.md) is that the number of workers that process task hub work items scales up and down. Applications add workers (*scale out*) to process work faster and remove workers (*scale in*) when there isn't enough work to keep them busy.
You can even *scale to zero* when the task hub is idle. When you scale to zero, no workers run. Only the scale controller and storage remain active.

The following diagram illustrates this concept:

:::image type="content" source="./media/durable-functions-perf-and-scale/worker-scaling.png" alt-text="Diagram that shows Durable Functions workers scaling out, scaling in, and scaling to zero for a task hub.":::

### Automatic scaling

In the Consumption and Elastic Premium plans, Durable Functions supports autoscale through the [Azure Functions scale controller](../event-driven-scaling.md#runtime-scaling). The scale controller monitors how long messages and tasks wait before processing. Based on these latencies, it adds or removes workers.

> [!NOTE]
> Starting with Durable Functions 2.0, you can configure function apps to run in virtual network-protected service endpoints in the Elastic Premium plan. In this configuration, the Durable Functions triggers start scale requests instead of the scale controller. For more information, see [Runtime scale monitoring](../functions-target-based-scaling.md#premium-plan-with-runtime-scale-monitoring-enabled).

On the Premium plan, automatic scaling keeps the number of workers (and operating cost) roughly proportional to the application's load.

## Concurrency throttles

A single worker instance can execute multiple [work items](../../durable-task/common/durable-task-hubs.md#work-items) concurrently. This increases parallelism and uses worker resources more efficiently.
But if a worker processes too many work items at once, it can exhaust resources like CPU, network connections, and memory.

To keep an individual worker from overcommitting, you might need to throttle per-instance concurrency. Limiting the number of functions that run at the same time on each worker helps avoid hitting that worker's resource limits.

> [!NOTE]
> Concurrency throttles apply only locally and limit what's processing **per worker**. So they don't limit total system throughput.

> [!TIP]
> In some cases, throttling the per-worker concurrency can actually *increase* the total throughput of the system. This can occur when each worker takes less work, causing the scale controller to add more workers to keep up with the queues, which then increases the total throughput.

### Configure concurrency throttles

Configure activity, orchestrator, and entity function concurrency limits in the *host.json* file. Use `durableTask/maxConcurrentActivityFunctions` for activity functions and `durableTask/maxConcurrentOrchestratorFunctions` for orchestrator and entity functions. These settings limit how many orchestrator, entity, and activity functions a worker loads into memory.

> [!NOTE]
> Orchestrations and entities load into memory only while they process events or operations, or when [instance caching](#instance-caching) is enabled. After they run their logic and then await (for example, `await` in C# or `yield` in JavaScript and Python), they can unload from memory. Unloaded orchestrations and entities don't count toward the `maxConcurrentOrchestratorFunctions` throttle. Even if millions of instances are in the "Running" state, only the instances in memory count toward the throttle limit. An orchestration that's waiting for an activity to finish also doesn't count toward the throttle.

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

### Language runtime considerations

The language runtime you select can impose strict concurrency restrictions on your functions. For example, Durable Functions apps written in Python or PowerShell can run only one function at a time on a single VM. This can cause performance problems if you don't account for it. If an orchestrator fans out to 10 activities but the language runtime allows only one function to run, nine of the 10 activity functions are stuck waiting for a chance to run. Also, these waiting activities can't be load balanced to other workers because the Durable Functions runtime already loads them into memory. This is especially problematic when the activity functions are long running.

If your language runtime restricts concurrency, update Durable Functions concurrency settings to match it. This keeps the Durable Functions runtime from running more functions concurrently than the language runtime allows and lets pending activities be load balanced to other VMs. For example, if a Python app restricts concurrency to four functions (for example, 4 threads on a single language worker process or 1 thread on 4 language worker processes), configure both `maxConcurrentOrchestratorFunctions` and `maxConcurrentActivityFunctions` to 4.

For Python performance recommendations, see [Improve throughput performance of Python apps in Azure Functions](../python-scale-performance-reference.md). These techniques can significantly improve Durable Functions performance and scalability.

## Instance caching

To process an [orchestration work item](../../durable-task/common/durable-task-hubs.md#work-items), a worker does two things:

1. Fetch the orchestration history.
1. Replay the orchestrator code by using the history.

If the same worker processes multiple work items for the same orchestration, the storage provider can cache the history in the worker's memory to eliminate the first step. It can also cache the mid-execution orchestrator to avoid replaying history for subsequent work items.

Enable caching when your orchestrations have many episodes and you're seeing high replay overhead. Caching typically reduces I/O to the underlying storage service and improves throughput and latency, but it also increases worker memory use.

> [!TIP]
> Caching can reduce how often the runtime replays history, but it can't eliminate replay. During development, test orchestrators with caching disabled. Forced replay helps you detect violations of [orchestrator function code constraints](../../durable-task/common/durable-task-code-constraints.md).

> [!NOTE]
> The [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler.md) manages caching internally. The following configuration details apply to the BYO storage providers only.

### Caching by storage provider

The following table compares instance caching support across providers and summarizes how to configure each one.

| | Azure Storage provider | Netherite storage provider | MSSQL storage provider |
| - | ---------------------- | -------------------------- | ---------------------- |
| **Instance caching** | Supported<br/>(.NET in-process worker only) | Supported | Not supported |
| **Default setting** | Disabled | Enabled | n/a |
| **Mechanism** | Extended Sessions | Instance Cache | n/a |

**Extended sessions** (Azure Storage provider) keep mid-execution orchestrators in memory until they're idle for a set time. Enable and tune this behavior with `extendedSessionsEnabled` and `extendedSessionIdleTimeoutInSeconds` in your *host.json* file:

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

> [!NOTE]
> Extended sessions are supported only in the .NET in-process worker. For details, see [Extended sessions](durable-functions-azure-storage-provider.md#extended-sessions) in the Azure Storage provider documentation.

**Instance cache** (Netherite storage provider) keeps instance state and history in the worker's memory and tracks total memory use. If the cache exceeds the `InstanceCacheSizeMB` limit, it evicts the least recently used instance data. If you set `CacheOrchestrationCursors` to `true`, the cache also stores the mid-execution orchestrators.

> [!NOTE]
> Instance caches work with all language SDKs, but the `CacheOrchestrationCursors` option is available only for the .NET in-process worker. For details, see [Instance cache](https://microsoft.github.io/durabletask-netherite/#/caching) in the Netherite storage provider documentation.

## Partition count

Some storage providers support *partitioning* and let you set `partitionCount`.

With partitioning, workers don't compete for individual work items. Partitioning groups work items into `partitionCount` partitions, and the runtime assigns partitions to workers. This approach reduces the total number of storage accesses. It also enables [instance caching](#instance-caching) and improves locality by creating *affinity*: the same worker processes all work items for the same instance.

> [!NOTE]
> The [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler.md) manages partitioning internally. The following configuration details apply to the BYO storage providers only.

For most apps, the default partition count is sufficient. Increase it if you expect to scale beyond the default number of workers for orchestrations, since the partition count caps the number of workers that can process orchestration messages from a partitioned queue.

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

### Configure the partition count

Specify `partitionCount` in the *host.json* file. The following *host.json* snippet sets `durableTask/storageProvider/partitionCount` to `3`.

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

## Function execution behavior

This section covers execution details that affect performance: what kind of work each function type should handle, how timeouts work, and how entity operations are batched.

### Work placement by function type

**Orchestrator functions** run their logic multiple times because they replay. So it's important that orchestrator function threads don't perform CPU intensive tasks, do I/O, or block. Move work that can require I/O, blocking, or multiple threads into activity functions.

**Activity functions** behave like regular queue-triggered functions. They support I/O, CPU intensive operations, and multiple threads. Because activity triggers are stateless, they scale out to many VMs.

**Entity functions** also run on a single thread and process operations one at a time. Entity functions have no restrictions on the type of code they run.

### Function timeouts

Activity, orchestrator, and entity functions are subject to the same [function timeouts](../functions-scale.md#timeout) as other Azure Functions. Durable Functions treats a function timeout like an unhandled exception in your code.

For example, when an activity times out, Durable Functions records the execution as failed and notifies the orchestrator. The orchestrator handles the timeout like any other exception: the runtime retries if the call specifies retries, or it runs an exception handler.

### Entity operation batching

To improve performance and reduce cost, a single work item can execute a batch of entity operations. On the Consumption plan, each batch is billed as a single function execution.

By default, the maximum batch size is 50 on the Consumption plan and 5,000 on other plans. You can also configure the maximum batch size in the [host.json](durable-functions-host-json-settings.md) file. If the maximum batch size is 1, batching is effectively disabled.

> [!NOTE]
> If individual entity operations take a long time to execute, it can be helpful to limit the maximum batch size to reduce the risk of [function timeouts](#function-timeouts), especially on the Consumption plan.

## Performance targets

When you're planning a production app with Durable Functions, consider performance requirements early. These basic usage scenarios help you plan:

* **Sequential activity execution**: This scenario describes an orchestrator function that runs a series of activity functions in sequence. It most closely resembles the [Function chaining](../../durable-task/common/durable-task-sequence.md) sample.
* **Parallel activity execution**: This scenario describes an orchestrator function that executes many activity functions in parallel using the [Fan-out, fan-in](../../durable-task/common/durable-task-fan-in-fan-out.md) pattern.
* **Parallel response processing**: This scenario is the second half of the [Fan-out, fan-in](../../durable-task/common/durable-task-fan-in-fan-out.md) pattern. It focuses on fan-in performance. Unlike fan-out, fan-in runs in a single orchestrator function instance, so it runs on a single VM.
* **External event processing**: This scenario represents a single orchestrator function instance that waits on [external events](../../durable-task/common/durable-task-external-events.md), one at a time.
* **Entity operation processing**: This scenario tests how quickly a *single* [Counter entity](../../durable-task/common/durable-task-entities.md) can process a constant stream of operations.

Throughput numbers for these scenarios are in the storage provider documentation. In particular:

* For the Azure Storage provider, see [Performance targets](durable-functions-azure-storage-provider.md#performance-targets).
* For the Netherite storage provider, see [Basic scenarios](https://microsoft.github.io/durabletask-netherite/#/scenarios).
* For the MSSQL storage provider, see [Orchestration throughput benchmarks](https://microsoft.github.io/durabletask-mssql/#/scaling?id=orchestration-throughput-benchmarks).

> [!TIP]
> Unlike fan-out, fan-in operations are limited to a single VM. If your application uses the fan-out, fan-in pattern and you're concerned about fan-in performance, consider subdividing the activity function fan-out across multiple [sub-orchestrations](../../durable-task/common/durable-task-sub-orchestrations.md).

## Next steps

> [!div class="nextstepaction"]
> [Azure Storage provider](durable-functions-azure-storage-provider.md)
