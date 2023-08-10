---
title: Run tasks concurrently to maximize usage of Batch compute nodes
description: Learn how to increase efficiency and lower costs by using fewer compute nodes and parallelism in an Azure Batch pool.
ms.topic: how-to
ms.custom: H1Hack27Feb2017, devx-track-csharp, devx-track-dotnet, devx-track-linux
ms.date: 05/24/2023
ms.devlang: csharp
---
# Run tasks concurrently to maximize usage of Batch compute nodes

You can maximize resource usage on a smaller number of compute nodes in your pool by running more than one task simultaneously on each node.

While some scenarios work best with all of a node's resources dedicated to a single task, certain workloads may see shorter job times and lower costs when multiple tasks share those resources. Consider the following scenarios:

- **Minimize data transfer** for tasks that are able to share data. You can dramatically reduce data transfer charges by copying shared data to a smaller number of nodes, then executing tasks in parallel on each node. This strategy especially applies if the data to be copied to each node must be transferred between geographic regions.
- **Maximize memory usage** for tasks that require a large amount of memory, but only during short periods of time, and at variable times during execution. You can employ fewer, but larger, compute nodes with more memory to efficiently handle such spikes. These nodes have multiple tasks running in parallel on each node, but each task can take advantage of the nodes' plentiful memory at different times.
- **Mitigate node number limits** when inter-node communication is required within a pool. Currently, pools configured for inter-node communication are limited to 50 compute nodes. If each node in such a pool is able to execute tasks in parallel, a greater number of tasks can be executed simultaneously.
- **Replicate an on-premises compute cluster**, such as when you first move a compute environment to Azure. If your current on-premises solution executes multiple tasks per compute node, you can increase the maximum number of node tasks to more closely mirror that configuration.

## Example scenario

As an example, imagine a task application with CPU and memory requirements such that [Standard\_D1](../cloud-services/cloud-services-sizes-specs.md#d-series) nodes are sufficient. However, in order to finish the job in the required time, 1,000 of these nodes are needed.

Instead of using Standard\_D1 nodes that have one CPU core, you could use [Standard\_D14](../cloud-services/cloud-services-sizes-specs.md#d-series) nodes that have 16 cores each, and enable parallel task execution. You could potentially use 16 times fewer nodes instead of 1,000 nodes, only 63 would be required. If large application files or reference data are required for each node, job duration and efficiency are improved, since the data is copied to only 63 nodes.

## Enable parallel task execution

You configure compute nodes for parallel task execution at the pool level. With the Batch .NET library, set the [CloudPool.TaskSlotsPerNode](/dotnet/api/microsoft.azure.batch.cloudpool.taskslotspernode) property when you create a pool. If you're using the Batch REST API, set the [taskSlotsPerNode](/rest/api/batchservice/pool/add) element in the request body during pool creation.

> [!NOTE]
> You can set the `taskSlotsPerNode` element and [TaskSlotsPerNode](/dotnet/api/microsoft.azure.batch.cloudpool) property only at pool creation time. They can't be modified after a pool has already been created.

Azure Batch allows you to set task slots per node up to (4x) the number of node cores. For example, if the pool is configured with nodes of size "Large" (four cores), then `taskSlotsPerNode` may be set to 16. However, regardless of how many cores the node has, you can't have more than 256 task slots per node. For details on the number of cores for each of the node sizes, see [Sizes for Cloud Services (classic)](../cloud-services/cloud-services-sizes-specs.md). For more information on service limits, see [Batch service quotas and limits](batch-quota-limit.md).

> [!TIP]
> Be sure to take into account the `taskSlotsPerNode` value when you construct an [autoscale formula](/rest/api/batchservice/pool/enableautoscale) for your pool. For example, a formula that evaluates `$RunningTasks` could be dramatically affected by an increase in tasks per node. For more information, see [Create an automatic formula for scaling compute nodes in a Batch pool](batch-automatic-scaling.md).

## Specify task distribution

When enabling concurrent tasks, it's important to specify how you want the tasks to be distributed across the nodes in the pool.

By using the [CloudPool.TaskSchedulingPolicy](/dotnet/api/microsoft.azure.batch.cloudpool.taskschedulingpolicy) property, you can specify that tasks should be assigned evenly across all nodes in the pool ("spreading"). Or you can specify that as many tasks as possible should be assigned to each node before tasks are assigned to another node in the pool ("packing").

As an example, consider the pool of [Standard\_D14](../cloud-services/cloud-services-sizes-specs.md#d-series) nodes (in the previous example) that is configured with a [CloudPool.TaskSlotsPerNode](/dotnet/api/microsoft.azure.batch.cloudpool.taskslotspernode) value of 16. If the [CloudPool.TaskSchedulingPolicy](/dotnet/api/microsoft.azure.batch.cloudpool.taskschedulingpolicy) is configured with a [ComputeNodeFillType](/dotnet/api/microsoft.azure.batch.common.computenodefilltype) of *Pack*, it would maximize usage of all 16 cores of each node and allow an [autoscaling pool](batch-automatic-scaling.md) to remove unused nodes (nodes without any tasks assigned) from the pool. Autoscaling minimizes resource usage and can save money.

## Define variable slots per task

A task can be defined with the [CloudTask.RequiredSlots](/dotnet/api/microsoft.azure.batch.cloudtask.requiredslots) property, specifying how many slots it requires to run on a compute node. The default value is 1. You can set variable task slots if your tasks have different weights associated with their resource usage on the compute node. Variable task slots let each compute node have a reasonable number of concurrent running tasks without overwhelming system resources like CPU or memory.

For example, for a pool with property `taskSlotsPerNode = 8`, you can submit multi-core required CPU-intensive tasks with `requiredSlots = 8`, while other tasks can be set to `requiredSlots = 1`. When this mixed workload is scheduled, the CPU-intensive tasks run exclusively on their compute nodes, while other tasks can run concurrently (up to eight tasks at once) on other nodes. The mixed workload helps you balance your workload across compute nodes and improve resource usage efficiency.

Be sure you don't specify a task's `requiredSlots` to be greater than the pool's `taskSlotsPerNode`, or the task never runs.  The Batch Service doesn't currently validate this conflict when you submit tasks. It doesn't validate the conflict, because a job may not have a pool bound at submission time, or it could change to a different pool by disabling/re-enabling.

> [!TIP]
> When using variable task slots, it's possible that large tasks with more required slots can temporarily fail to be scheduled because not enough slots are available on any compute node, even when there are still idle slots on some nodes. You can raise the job priority for these tasks to increase their chance to compete for available slots on nodes.
>
> The Batch service emits the [TaskScheduleFailEvent](batch-task-schedule-fail-event.md) when it fails to schedule a task to run and keeps retrying the scheduling until required slots become available. You can listen to that event to detect potential task scheduling issues and mitigate accordingly.

## Batch .NET example

The following [Batch .NET](/dotnet/api/microsoft.azure.batch) API code snippets show how to create a pool with multiple task slots per node and how to submit a task with required slots.

### Create a pool with multiple task slots per node

This code snippet shows a request to create a pool that contains four nodes, with four task slots allowed per node. It specifies a task scheduling policy that fills each node with tasks prior to assigning tasks to another node in the pool.

For more information on adding pools by using the Batch .NET API, see [BatchClient.PoolOperations.CreatePool](/dotnet/api/microsoft.azure.batch.pooloperations.createpool).

```csharp
CloudPool pool =
    batchClient.PoolOperations.CreatePool(
        poolId: "mypool",
        targetDedicatedComputeNodes: 4
        virtualMachineSize: "standard_d1_v2",
        VirtualMachineConfiguration: new VirtualMachineConfiguration(
            imageReference: new ImageReference(
                                publisher: "MicrosoftWindowsServer",
                                offer: "WindowsServer",
                                sku: "2019-datacenter-core",
                                version: "latest"),
            nodeAgentSkuId: "batch.node.windows amd64");

pool.TaskSlotsPerNode = 4;
pool.TaskSchedulingPolicy = new TaskSchedulingPolicy(ComputeNodeFillType.Pack);
pool.Commit();
```

### Create a task with required slots

This code snippet creates a task with nondefault `requiredSlots`. This task runs when there are enough free slots available on a compute node.

```csharp
CloudTask task = new CloudTask(taskId, taskCommandLine)
{
    RequiredSlots = 2
};
```

### List compute nodes with counts for running tasks and slots

This code snippet lists all compute nodes in the pool and prints the counts for running tasks and task slots per node.

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

This code snippet gets task counts for the job, which includes both tasks and task slots count per task state.

```csharp
TaskCountsResult result = await batchClient.JobOperations.GetJobTaskCountsAsync(jobId);

Console.WriteLine("\t\tActive\tRunning\tCompleted");
Console.WriteLine($"TaskCounts:\t{result.TaskCounts.Active}\t{result.TaskCounts.Running}\t{result.TaskCounts.Completed}");
Console.WriteLine($"TaskSlotCounts:\t{result.TaskSlotCounts.Active}\t{result.TaskSlotCounts.Running}\t{result.TaskSlotCounts.Completed}");
```

## Batch REST example

The following [Batch REST](/rest/api/batchservice/) API code snippets show how to create a pool with multiple task slots per node and how to submit a task with required slots.

### Create a pool with multiple task slots per node

This snippet shows a request to create a pool that contains two large nodes with a maximum of four tasks per node.

For more information on adding pools by using the REST API, see [Add a pool to an account](/rest/api/batchservice/pool/add).

```json
{
  "odata.metadata":"https://myaccount.myregion.batch.azure.com/$metadata#pools/@Element",
  "id":"mypool",
  "vmSize":"large",
  "virtualMachineConfiguration": {
    "imageReference": {
      "publisher": "canonical",
      "offer": "ubuntuserver",
      "sku": "20.04-lts"
    },
    "nodeAgentSKUId": "batch.node.ubuntu 20.04"
  },
  "targetDedicatedComputeNodes":2,
  "taskSlotsPerNode":4,
  "enableInterNodeCommunication":true,
}
```

### Create a task with required slots

This snippet shows a request to add a task with nondefault `requiredSlots`. This task only runs when there are enough free slots available on the compute node.

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

## Code sample on GitHub

The [ParallelTasks](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/ParallelTasks) project on GitHub illustrates the use of the [CloudPool.TaskSlotsPerNode](/dotnet/api/microsoft.azure.batch.cloudpool.taskslotspernode) property.

This C# console application uses the [Batch .NET](/dotnet/api/microsoft.azure.batch) library to create a pool with one or more compute nodes. It executes a configurable number of tasks on those nodes to simulate a variable load. Output from the application shows which nodes executed each task. The application also provides a summary of the job parameters and duration.

The following example shows the summary portion of the output from two different runs of the ParallelTasks sample application. Job durations shown here don't include pool creation time, since each job was submitted to a previously created pool whose compute nodes were in the *Idle* state at submission time.

The first execution of the sample application shows that with a single node in the pool and the default setting of one task per node, the job duration is over 30 minutes.

```console
Nodes: 1
Node size: large
Task slots per node: 1
Max slots per task: 1
Tasks: 32
Duration: 00:30:01.4638023
```

The second run of the sample shows a significant decrease in job duration. This reduction is because the pool was configured with four tasks per node, allowing for parallel task execution to complete the job in nearly a quarter of the time.

```console
Nodes: 1
Node size: large
Task slots per node: 4
Max slots per task: 1
Tasks: 32
Duration: 00:08:48.2423500
```

## Next steps

- [Batch Explorer](https://azure.github.io/BatchExplorer/)
- [Azure Batch samples on GitHub](https://github.com/Azure/azure-batch-samples).
- [Create task dependencies to run tasks that depend on other tasks](batch-task-dependencies.md).
