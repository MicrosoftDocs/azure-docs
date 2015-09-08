<properties
   pageTitle="Parallel task execution on Azure Batch compute nodes | Microsoft Azure"
   description="Execute parallel tasks on the compute nodes in your Azure Batch account"
   services="batch"
   documentationCenter=".net"
   authors="mmacy"
   manager="timlt"
   editor=""/>

   <tags
   	ms.service="Batch"
   	ms.devlang="multiple"
   	ms.topic="article"
   	ms.tgt_pltfrm="vm-windows"
   	ms.workload="big-compute"
   	ms.date="09/01/2015"
   	ms.author="v-marsma"/>

# Parallel task execution on Azure Batch compute nodes

Large-scale parallel task execution is a core feature of Batch, and this ability extends not only to multiple compute nodes running your tasks, but also to running concurrent tasks on the those nodes. With Batch, parallel task execution scales up as well as out.

This easily configured feature enables maximizing resource usage on a smaller number of multi-core compute nodes within a pool, and can also help mitigate node number limits in pools where inter-node communication is required. Currently, pools configured for inter-node communication are limited to 50 nodes, therefore a greater number of tasks can be executed simultaneously if each node in such a pool is able to execute tasks in parallel.

Other situations benefitting from parallel task execution on pool nodes:

 - Minimize data transfer when tasks are able to share data. In this scenario, copying shared data to a smaller number of nodes and executing tasks in parallel on each node can dramatically reduce data transfer charges, especially if the data to be copied to each node must be transferred between geographic regions.
 - When tasks require a large amount of memory, but only during short periods of time and at variable times during execution. Fewer but larger node instances with more memory could be employed to efficiently handle such spikes, with parallel tasks running on each node taking advantage of the nodes' memory at different times.
 - Replicating an on-premises compute cluster, such as when first moving a compute environment to Azure. Increasing the maximum number of node tasks may be done to more closely mirror an existing physical configuration if that configuration currently executes multiple tasks per compute node.

## Specify parallel task execution

Configuring the compute nodes in your Batch solution for parallel task execution is done at the pool level. When working with the Batch REST API, the [maxTasksPerNode][maxtasks_rest] element is set in the request body during pool creation. In the Batch .NET API, the [CloudPool.MaxTasksPerComputeNode][maxtasts_net] property is set when creating a pool.

Azure Batch allows a maximum tasks per node setting of up to four times (4x) the number of node cores. For example, if the pool is configured with nodes of size "Large" (four cores) then `maxTasksPerNode` may be set to sixteen. Details on the number of cores for each of the node sizes can be found in [Sizes for virtual machines](../virtual-machines/virtual-machines-size-specs.md), and more information on service limits can be found in [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md).

## Batch REST example

This [Batch REST][api_rest] API snippet shows a request to create a pool containing two large nodes with a maximum of four tasks per node. For more information on adding pools using the REST API, see [Add a pool to an account][maxtasks_rest].

        {
          "id": "pool1",
          "vmSize": "Large",
          "osFamily": "2",
          "targetOSVersion": "*",
          "targetDedicated": 2,
          "enableInterNodeCommunication": false,
          "maxTasksPerNode": 4
        }

## Batch .NET example

This [Batch .NET][api_net] API code snippet shows a request to create a pool containing two large nodes with a maximum of four tasks per node. For more information on adding pools using the Batch .NET API, see [BatchClient.PoolOperations.CreatePool][poolcreate_net].

        CloudPool pool = batchClient.PoolOperations.CreatePool(poolId: "mypool",
        													osFamily: "2",
        													virtualMachineSize: "large",
        													targetDedicated: 4);
        pool.MaxTasksPerComputeNode = 4;
        pool.Commit();

> [AZURE.NOTE] The `maxTasksPerNode` element and [MaxTasksPerComputeNode][maxtasts_net] property may only be set at pool creation time. It cannot be modified after a pool has already been created.

## Next steps

Check out the [ParallelNodeTasks][parallel_tasks_sample] project on GitHub, a working code sample illustrating the use of [CloudPool.MaxTasksPerComputeNode][maxtasts_net]. This C# console application uses the [Batch .NET][api_net] library to create a pool with one or more compute nodes and executes a configurable number of tasks on those nodes to simulate variable load. Output from the application details which nodes executed each task, as well as a summary of the job parameters and duration. The summary portion of the output from two different runs of the sample application appears below.

```
Nodes: 1
Node size: large
Max tasks per node: 1
Tasks: 32
Job duration: 00:30:01.4638023
```

The first execution of the sample application shows that with a single node in the pool and using the default of one task per node, the job duration is over thirty minutes.

```
Nodes: 1
Node size: large
Max tasks per node: 4
Tasks: 32
Job duration: 00:08:48.2423500
```

The second execution shows a significant decrease in job duration due to the pool having been configured with four tasks per node, allowing for parallel task execution.

> [AZURE.NOTE] The job durations in the summaries above do not include pool creation time. Each of the jobs above were submitted to previously created pools whose compute nodes were in the Active state.

 [maxtasks_rest]: https://msdn.microsoft.com/library/azure/dn820174.aspx
 [maxtasts_net]: http://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.maxtaskspercomputenode.aspx  
 [api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
 [api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
 [cloudpool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
 [poolcreate_net]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx
 [parallel_tasks_sample]: http://URL_GOES_HERE
