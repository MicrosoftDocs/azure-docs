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

This easily configured feature enables maximizing resource usage on a smaller number of multi-core compute nodes within a pool. It is also useful for minimizing data transfer when tasks are able to share data. In this latter scenario, copying data to a smaller number of nodes and executing tasks in parallel on each node can dramatically reduce data transfer charges, especially when transferring across zones.

## Specify parallel task execution

Configuring the compute nodes in your Batch solution for parallel task execution is done at the pool level. When working with the Batch REST API, the [maxTasksPerNode][maxtasks_rest] element is set in the request body during pool creation. In the Batch .NET API, the [CloudPool.MaxTasksPerComputeNode][maxtasts_net] property is set when creating a pool.

When choosing a value for maximum tasks per node, it is common practice to specify a value matching the number of cores in the compute nodes within the pool. For example, if the Batch pool is being configured with nodes of size "Large," *maxTasksPerNode* might then be set to 4. Details on the number of cores for each of the node sizes can be found in [Sizes for virtual machines](../virtual-machines/virtual-machines-size-specs.md).

> [AZURE.NOTE] The Batch service limits the maximum tasks per node to 4x the number of node cores. More information on service limits can be found at [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md).

### Batch REST example

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

> [AZURE.IMPORTANT] When naming pools, avoid including sensitive information such as user names or secret project names. This information may appear in telemetry logs accessible to Microsoft Support engineers.

### Batch .NET example

This [Batch .NET][api_net] API code snippet shows a request to create a pool containing two large nodes with a maximum of four tasks per node. For more information on adding pools using the Batch .NET API, see [BatchClient.PoolOperations.CreatePool][poolcreate_net].

        CloudPool pool = batchClient.PoolOperations.CreatePool(poolId: "mypool",
        													osFamily: "2",
        													virtualMachineSize: "large",
        													targetDedicated: 4);
        pool.MaxTasksPerComputeNode = 4;
        pool.Commit();

## Next steps

  Check out the [ParallelNodeTasks][parallel_tasks_sample] project on GitHub, a working code sample illustrating the use of [CloudPool.MaxTasksPerComputeNode][maxtasts_net]. This C# console application uses the Batch .NET library to create a pool with one or more compute nodes and executes a configurable number of tasks on those nodes to simulate variable load.

  Output from a few different runs of the sample application appears below.

  TODO: Discuss how the different node/maxtask settings affect the output?

        Tasks: 32
        MaxTasksPerComputeNode: 2
        Job duration: 00:05:55.1295385
<b />

        Tasks: 32
        MaxTasksPerComputeNode: 4
        Job duration: 00:03:09.4452545

 [maxtasks_rest]: https://msdn.microsoft.com/library/azure/dn820174.aspx
 [maxtasts_net]: http://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.maxtaskspercomputenode.aspx  
 [api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
 [api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
 [cloudpool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
 [poolcreate_net]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
 [parallel_tasks_sample]: http://URL_GOES_HERE
