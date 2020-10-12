---
title: Run tasks in parallel to optimize compute resources
description: Increase efficiency and lower costs by using fewer compute nodes and running concurrent tasks on each node in an Azure Batch pool
ms.topic: how-to
ms.date: 10/08/2020
ms.custom: "H1Hack27Feb2017, devx-track-csharp"
---
# Run tasks concurrently to maximize usage of Batch compute nodes

By running more than one task simultaneously on each compute node in your Azure Batch pool, you can maximize resource usage on a smaller number of nodes in the pool. For some workloads, this can result in shorter job times and lower cost.

While some scenarios benefit from dedicating all of a node's resources to a single task, several situations benefit from allowing multiple tasks to share those resources:

* **Minimizing data transfer** when tasks are able to share data. In this scenario, you can dramatically reduce data transfer charges by copying shared data to a smaller number of nodes and executing tasks in parallel on each node. This especially applies if the data to be copied to each node must be transferred between geographic regions.
* **Maximizing memory usage** when tasks require a large amount of memory, but only during short periods of time, and at variable times during execution. You can employ fewer, but larger, compute nodes with more memory to efficiently handle such spikes. These nodes would have multiple tasks running in parallel on each node, but each task would take advantage of the nodes' plentiful memory at different times.
* **Mitigating node number limits** when inter-node communication is required within a pool. Currently, pools configured for inter-node communication are limited to 50 compute nodes. If each node in such a pool is able to execute tasks in parallel, a greater number of tasks can be executed simultaneously.
* **Replicating an on-premises compute cluster**, such as when you first move a compute environment to Azure. If your current on-premises solution executes multiple tasks per compute node, you can increase the maximum number of node tasks to more closely mirror that configuration.

## Example scenario
As an example to illustrate the benefits of parallel task execution, let's say that your task application has CPU and memory requirements such that [Standard\_D1](../cloud-services/cloud-services-sizes-specs.md) nodes are sufficient. But, in order to finish the job in the required time, 1,000 of these nodes are needed.

Instead of using Standard\_D1 nodes that have 1 CPU core, you could use [Standard\_D14](../cloud-services/cloud-services-sizes-specs.md) nodes that have 16 cores each, and enable parallel task execution. Therefore, *16 times fewer nodes* could be used--instead of 1,000 nodes, only 63 would be required. Additionally, if large application files or reference data are required for each node, job duration and efficiency are again improved since the data is copied to only 63 nodes.

## Enable parallel task execution
You configure compute nodes for parallel task execution at the pool level. With the Batch .NET library, set the [CloudPool.TaskSlotsPerNode][maxtasks_net] property when you create a pool. If you are using the Batch REST API, set the [taskSlotsPerNode][rest_addpool] element in the request body during pool creation.

Azure Batch allows you to set task slots per node up to (4x) the number of node cores. For example, if the pool is configured with nodes of size "Large" (four cores), then `taskSlotsPerNode` may be set to 16. However, regardless of how many cores the node has, you can't have more than 256 task slots per node. For details on the number of cores for each of the node sizes, see [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md). For more information on service limits, see [Quotas and limits for the Azure Batch service](batch-quota-limit.md).

> [!TIP]
> Be sure to take into account the `taskSlotsPerNode` value when you construct an [autoscale formula][enable_autoscaling] for your pool. For example, a formula that evaluates `$RunningTasks` could be dramatically affected by an increase in tasks per node. See [Automatically scale compute nodes in an Azure Batch pool](batch-automatic-scaling.md) for more information.
>
>

> [!NOTE]
> You can set the `taskSlotsPerNode` element and [TaskSlotsPerNode][maxtasks_net] property only at pool creation time. They cannot be modified after a pool has already been created.
>
>

## Distribution of tasks
When the compute nodes in a pool can execute tasks concurrently, it's important to specify how you want the tasks to be distributed across the nodes in the pool.

By using the [CloudPool.TaskSchedulingPolicy][task_schedule] property, you can specify that tasks should be assigned evenly across all nodes in the pool ("spreading"). Or you can specify that as many tasks as possible should be assigned to each node before tasks are assigned to another node in the pool ("packing").

As an example of how this feature is valuable, consider the pool of [Standard\_D14](../cloud-services/cloud-services-sizes-specs.md) nodes (in the example above) that is configured with a [CloudPool.TaskSlotsPerNode][maxtasks_net] value of 16. If the [CloudPool.TaskSchedulingPolicy][task_schedule] is configured with a [ComputeNodeFillType][fill_type] of *Pack*, it would maximize usage of all 16 cores of each node and allow an [autoscaling pool](batch-automatic-scaling.md) to prune unused nodes from the pool (nodes without any tasks assigned). This minimizes resource usage and saves money.

## Variable slots per task
Task can be defined with [CloudTask.RequiredSlots][taskslots_net] property to specify how many slots it requires to run on a compute node, with default value as 1. You can set variable task slots if your tasks have different weights regarding to resource usage on compute node, so each compute node can have reasonable number of concurrent running tasks without overwhelming system resources like CPU or memory.

For example, for a pool with property `taskSlotsPerNode = 8`, you can submit multi-cores required CPU intensive tasks with `requiredSlots = 8`, while other tasks with `requiredSlots = 1`. When this mixed workload is scheduled to the pool, the CPU intensive tasks will run exclusively on compute node, while other tasks can run concurrently (up to eight tasks) on other nodes. This will help you to balance your workload across compute nodes and improve resource usage efficiency.

> [!TIP]
> When using variable task slots, it's possible that large tasks with more required slots can temporarily fail to be scheduled because of not enough slots available on any compute node, even when there is still idle slots on some nodes. You can raise job priority for these tasks to increase their chance to compete for available slots on nodes.
>
> Batch service also emits [TaskScheduleFailEvent](batch-task-schedule-fail-event.md) when it fails to schedule a task to run, while keeps retrying the scheduling until required slots become available. You can listen to that event to detect potential task scheduling stuck issue, and do your mitigation accordingly.
>

> [!NOTE]
> Do not specify task's `requiredSlots` to be greater than the pool's `taskSlotsPerNode`. This will cause the task never able to run. Currently Batch Service doesn't do this validation when you submit tasks, because the job may have no pool bound at submission time, or be changed to different pool by disabling/re-enabling.
>

## Batch .NET example
The following [Batch .NET][api_net] API code snippets show how to create a pool with multiple task slots per node, and submit task with required slots.

### Create pool
This code snippet shows a request to create a pool that contains four nodes with four task slots allowed per node. It specifies a task scheduling policy that will fill each node with tasks prior to assigning tasks to another node in the pool. For more information on adding pools by using the Batch .NET API, see [BatchClient.PoolOperations.CreatePool][poolcreate_net].

```csharp
CloudPool pool =
    batchClient.PoolOperations.CreatePool(
        poolId: "mypool",
        targetDedicatedComputeNodes: 4
        virtualMachineSize: "standard_d1_v2",
        cloudServiceConfiguration: new CloudServiceConfiguration(osFamily: "5"));

pool.TaskSlotsPerNode = 4;
pool.TaskSchedulingPolicy = new TaskSchedulingPolicy(ComputeNodeFillType.Pack);
pool.Commit();
```

### Create task with required slots
This code snippet creates a task with non-default `requiredSlots`. This task will only run when there are enough free slots available on compute node.
```csharp
CloudTask task = new CloudTask(taskId, taskCommandLine)
{
    RequiredSlots = 2
};
```

### List compute nodes with counts for running tasks and slots
This code snippet lists all compute nodes in the pool, and prints out the counts for running tasks and task slots per node.
```csharp
ODATADetailLevel nodeDetail = new ODATADetailLevel(selectClause: "id,runningTasksCount,runningTaskSlotsCount");
IPagedEnumerable<ComputeNode> nodes = batchClient.PoolOperations.ListComputeNodes(poolId, nodeDetail);

await nodes.ForEachAsync(node =>
{
    Console.WriteLine(node.Id + " :");
    Console.WriteLine($"RunningTasks = {node.RunningTasksCount}, RunningTaskSlots = {node.RunningTaskSlotsCount}");

}).ConfigureAwait(continueOnCapturedContext: false);
```

### List task counts for the job
This code snippet gets task counts for the job, which includes both tasks and tasks slots count per task state.
```csharp
TaskCountsResult result = await batchClient.JobOperations.GetJobTaskCountsAsync(jobId);

Console.WriteLine("\t\tActive\tRunning\tCompleted");
Console.WriteLine($"TaskCounts:\t{result.TaskCounts.Active}\t{result.TaskCounts.Running}\t{result.TaskCounts.Completed}");
Console.WriteLine($"TaskSlotCounts:\t{result.TaskSlotCounts.Active}\t{result.TaskSlotCounts.Running}\t{result.TaskSlotCounts.Completed}");
```

## Batch REST example
This [Batch REST][api_rest] API snippet shows a request to create a pool that contains two large nodes with a maximum of four tasks per node. For more information on adding pools by using the REST API, see [Add a pool to an account][rest_addpool].

```json
{
  "odata.metadata":"https://myaccount.myregion.batch.azure.com/$metadata#pools/@Element",
  "id":"mypool",
  "vmSize":"large",
  "cloudServiceConfiguration": {
    "osFamily":"4",
    "targetOSVersion":"*",
  },
  "targetDedicatedComputeNodes":2,
  "taskSlotsPerNode":4,
  "enableInterNodeCommunication":true,
}
```

This snippet shows a request to add a task with non-default `requiredSlots`. This task will only run when there are enough free slots available on compute node.
```json
{
  "id": "taskId",
  "commandLine": "bash -c 'echo hello'",
  "userIdentity": {
    "autoUser": {
      "scope": "task",
      "elevationLevel": "nonadmin"
    }
  },
  "requiredSLots": 2
}
```

## Code sample
The [ParallelNodeTasks][parallel_tasks_sample] project on GitHub illustrates the use of the [CloudPool.TaskSlotsPerNode][maxtasks_net] property.

This C# console application uses the [Batch .NET][api_net] library to create a pool with one or more compute nodes. It executes a configurable number of tasks on those nodes to simulate variable load. Output from the application specifies which nodes executed each task. The application also provides a summary of the job parameters and duration. The summary portion of the output from two different runs of the sample application appears below.

```
Nodes: 1
Node size: large
Task slots per node: 1
Max slots per task: 1
Tasks: 32
Duration: 00:30:01.4638023
```

The first execution of the sample application shows that with a single node in the pool and the default setting of one task per node, the job duration is over 30 minutes.

```
Nodes: 1
Node size: large
Task slots per node: 4
Max slots per task: 1
Tasks: 32
Duration: 00:08:48.2423500
```

The second run of the sample shows a significant decrease in job duration. This is because the pool was configured with four tasks per node, which allows for parallel task execution to complete the job in nearly a quarter of the time.

> [!NOTE]
> The job durations in the summaries above do not include pool creation time. Each of the jobs above was submitted to previously created pools whose compute nodes were in the *Idle* state at submission time.
>
>

## Next steps
### Batch Explorer Heat Map
[Batch Explorer][batch_labs] is a free, rich-featured, standalone client tool to help create, debug, and monitor Azure Batch applications. Batch Explorer contains a *Heat Map* feature that provides visualization of task execution. When you're executing the [ParallelTasks][parallel_tasks_sample] sample application, you can use the Heat Map feature to easily visualize the execution of parallel tasks on each node.


[api_net]: /dotnet/api/microsoft.azure.batch
[api_rest]: /rest/api/batchservice/
[batch_labs]: https://azure.github.io/BatchExplorer/
[cloudpool]: /dotnet/api/microsoft.azure.batch.cloudpool
[enable_autoscaling]: /rest/api/batchservice/pool/enableautoscale
[fill_type]: /dotnet/api/microsoft.azure.batch.common.computenodefilltype
[github_samples]: https://github.com/Azure/azure-batch-samples
[maxtasks_net]: /dotnet/api/microsoft.azure.batch.cloudpool
[rest_addpool]: /rest/api/batchservice/pool/add
[parallel_tasks_sample]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/ParallelTasks
[poolcreate_net]: /dotnet/api/microsoft.azure.batch.pooloperations
[task_schedule]: /dotnet/api/microsoft.azure.batch.cloudpool
[taskslots_net]: /dotnet/api/microsoft.azure.batch.cloudtask.requiredslots
