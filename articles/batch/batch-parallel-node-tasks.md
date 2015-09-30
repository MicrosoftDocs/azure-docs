<properties
   pageTitle="Maximize Batch node use with parallel tasks | Microsoft Azure"
   description="Increase efficiency and lower cost by using fewer compute nodes while running concurrent tasks on each node in an Azure Batch pool"
   services="batch"
   documentationCenter=".net"
   authors="mmacy"
   manager="timlt"
   editor=""/>

   <tags
   	ms.service="batch"
   	ms.devlang="multiple"
   	ms.topic="article"
   	ms.tgt_pltfrm="vm-windows"
   	ms.workload="big-compute"
   	ms.date="09/30/2015"
   	ms.author="v-marsma"/>

# Maximize Azure Batch compute resource usage with concurrent node tasks

Large-scale parallel task execution is a core feature of Azure Batch, and this ability extends not only to multiple compute nodes running your tasks, but also to running concurrent tasks on those nodes. With Batch, parallel task execution scales up as well as out.

Enabling concurrent task execution on a pool's compute nodes allows for maximizing resource usage on a smaller number of nodes within the pool. While some scenarios benefit from all of a node's resources being available for allocation to a single task, a number of situations benefit from allowing multiple tasks to share those resources:

 - **Minimizing data transfer** when tasks are able to share data. In this scenario, copying shared data to a smaller number of nodes and executing tasks in parallel on each node can dramatically reduce data transfer charges, especially if the data to be copied to each node must be transferred between geographic regions.

 - **Maximizing memory usage** when tasks require a large amount of memory, but only during short periods of time, and at variable times during execution. Fewer but larger node instances with more memory may be employed to efficiently handle such spikes, with parallel tasks running on each node taking advantage of the nodes' plentiful memory at different times.

 - **Mitigating node number limits** when inter-node communication is required within a pool. Currently, pools configured for inter-node communication are limited to 50 nodes, therefore a greater number of tasks can be executed simultaneously if each node in such a pool is able to execute tasks in parallel.

 - **Replicating an on-premises compute cluster**, such as when first moving a compute environment to Azure. Increasing the maximum number of node tasks may be done to more closely mirror an existing physical configuration if that configuration currently executes multiple tasks per compute node.

## Example scenario

To illustrate the benefits of parallel task execution, let's say that your task application has CPU and memory requirements such that a Standard\_D1 node size is suitable, but in order to execute the job in the required time, 1000 such nodes are needed. Instead of using Standard\_D1 nodes, you could employ Standard\_D14 nodes with 16 cores and enable parallel task execution. In this case, *16 times fewer nodes* could therefore be used--instead of 1000 nodes, only 63 would be required. This will greatly improve job execution time and efficiency if large application files or reference data are required for each node.

## Enable parallel task execution

Configuring the compute nodes in your Batch solution for parallel task execution is done at the pool level. When working with the Batch .NET API, the [CloudPool.MaxTasksPerComputeNode][maxtasks_net] property is set when creating a pool. In the Batch REST API, the [maxTasksPerNode][maxtasks_rest] element is set in the request body during pool creation.

Azure Batch allows a maximum tasks per node setting of up to four times (4x) the number of node cores. For example, if the pool is configured with nodes of size "Large" (four cores) then `maxTasksPerNode` may be set to sixteen. Details on the number of cores for each of the node sizes can be found in [Sizes for virtual machines](../virtual-machines/virtual-machines-size-specs.md), and more information on service limits can be found in [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md).

> [AZURE.TIP] Be sure to take into account the `maxTasksPerNode` value when constructing an [autoscale formula][enable_autoscaling] for your pool. For example, a formula that evaluates `$RunningTasks` could be dramatically affected by an increase in tasks per node. See [Automatically scale compute nodes in an Azure Batch pool](batch-automatic-scaling.md) for more information.

## Distribution of tasks

When the compute nodes within a pool are able to execute tasks concurrently, it is important to specify how you would like your tasks distributed across the nodes within the pool.

By using the [CloudPool.TaskSchedulingPolicy][task_schedule] property, you can specify that tasks should be assigned evenly across all nodes in the pool ("spreading"), or that as many tasks as possible should be assigned to each node before tasks are assigned to another node in the pool ("packing").

As an example of how this feature is valuable, consider the pool of Standard\_D14 nodes in the example above, configured with a [CloudPool.MaxTasksPerComputeNode][maxtasks_net] value of 16. If the [CloudPool.TaskSchedulingPolicy][task_schedule] is configured with a [ComputeNodeFillType][fill_type] of *Pack*, it would maximize usage of all 16 cores of each node and allow an [autoscaling pool](./batch-automatic-scaling.md) to prune unused nodes from the pool (nodes without any tasks assigned), thereby minimizing resource usage and saving money.

## Batch .NET example

This [Batch .NET][api_net] API code snippet shows a request to create a pool containing four large nodes with a maximum of four tasks per node, and specifying a task scheduling policy that will fill each node with tasks prior to assigning tasks to another node in the pool. For more information on adding pools using the Batch .NET API, see [BatchClient.PoolOperations.CreatePool][poolcreate_net].

        CloudPool pool = batchClient.PoolOperations.CreatePool(poolId: "mypool",
        													osFamily: "2",
        													virtualMachineSize: "large",
        													targetDedicated: 4);
        pool.MaxTasksPerComputeNode = 4;
        pool.TaskSchedulingPolicy = new TaskSchedulingPolicy(ComputeNodeFillType.Pack);
        pool.Commit();

## Batch REST example

This [Batch REST][api_rest] API snippet shows a request to create a pool containing two large nodes with a maximum of four tasks per node. For more information on adding pools using the REST API, see [Add a pool to an account][maxtasks_rest].

        {
          "id": "mypool",
          "vmSize": "Large",
          "osFamily": "2",
          "targetOSVersion": "*",
          "targetDedicated": 2,
          "enableInterNodeCommunication": false,
          "maxTasksPerNode": 4
        }

> [AZURE.NOTE] The `maxTasksPerNode` element and [MaxTasksPerComputeNode][maxtasks_net] property may only be set at pool creation time. It cannot be modified after a pool has already been created.

## Explore the sample project

Check out the [ParallelNodeTasks][parallel_tasks_sample] project on GitHub, a working code sample illustrating the use of [CloudPool.MaxTasksPerComputeNode][maxtasks_net]. This C# console application uses the [Batch .NET][api_net] library to create a pool with one or more compute nodes and executes a configurable number of tasks on those nodes to simulate variable load. Output from the application details which nodes executed each task, as well as a summary of the job parameters and duration. The summary portion of the output from two different runs of the sample application appears below.

```
Nodes: 1
Node size: large
Max tasks per node: 1
Tasks: 32
Duration: 00:30:01.4638023
```

The first execution of the sample application shows that with a single node in the pool and using the default of one task per node, the job duration is over thirty minutes.

```
Nodes: 1
Node size: large
Max tasks per node: 4
Tasks: 32
Duration: 00:08:48.2423500
```

The second run of the sample shows a significant decrease in job duration due to the pool having been configured with four tasks per node, allowing for parallel task execution to complete the job in nearly a quarter of the time.

> [AZURE.NOTE] The job durations in the summaries above do not include pool creation time. Each of the jobs above were submitted to previously created pools whose compute nodes were in the *Idle* state at submission time.

## Batch Explorer Heat Map

The [Batch Explorer][batch_explorer], one of the Azure Batch [sample applications][github_samples], contains a *Heat Map* feature that provides visualization of node core usage within a pool. When executing the [ParallelTasks][parallel_tasks_sample] sample application, use the Heat Map feature to easily visualize node core activity.

![Batch Explorer Heat Map][1]

*Batch Explorer Heat Map showing four nodes with four cores each, with each core currently running a task*

[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[batch_explorer]: http://blogs.technet.com/b/windowshpc/archive/2015/01/20/azure-batch-explorer-sample-walkthrough.aspx
[cloudpool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[enable_autoscaling]: https://msdn.microsoft.com/library/azure/dn820173.aspx
[fill_type]: https://msdn.microsoft.com/en-us/library/microsoft.azure.batch.common.computenodefilltype.aspx
[github_samples]: https://github.com/Azure/azure-batch-samples
[maxtasks_net]: http://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.maxtaskspercomputenode.aspx  
[maxtasks_rest]: https://msdn.microsoft.com/library/azure/dn820174.aspx
[parallel_tasks_sample]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/ParallelTasks
[poolcreate_net]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx
[task_schedule]: https://msdn.microsoft.com/library/microsoft.azure.batch.cloudpool.taskschedulingpolicy.aspx

[1]: ./media/batch-parallel-node-tasks\heat_map.png
