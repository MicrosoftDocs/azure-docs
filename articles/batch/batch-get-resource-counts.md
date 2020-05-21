---
title: Count states for tasks and nodes
description: Count the state of Azure Batch tasks and compute nodes to help manage and monitor Batch solutions.
ms.date: 09/07/2018
ms.topic: how-to
ms.custom: seodec18
---
# Monitor Batch solutions by counting tasks and nodes by state

To monitor and manage large-scale Azure Batch solutions, you need accurate counts of resources in various states. Azure Batch provides efficient operations to get these counts for Batch *tasks* and *compute nodes*. Use these operations instead of potentially time-consuming list queries that return detailed information about large collections of tasks or nodes.

* [Get Task Counts][rest_get_task_counts] gets an aggregate count of active, running, and completed tasks in a job, and of tasks that succeeded or failed. 

  By counting tasks in each state, you can more easily display job progress to a user, or detect unexpected delays or failures that may affect the job. Get Task Counts is available as of Batch Service API version 2017-06-01.5.1 and related SDKs and tools.

* [List Pool Node Counts][rest_get_node_counts] gets the number of dedicated and low-priority compute nodes in each pool that are in various states: creating, idle, offline, preempted, rebooting, reimaging, starting, and others. 

  By counting nodes in each state, you can determine when you have adequate compute resources to run your jobs, and identify potential issues with your pools. List Pool Node Counts is available as of Batch Service API version 2018-03-01.6.1
 and related SDKs and tools.

If you're using a version of the service that doesn't support the task count or node count operations, use a list query instead to count these resources. Also use a list query to get information about other Batch resources such as applications, files, and jobs. For more information about applying filters to list queries, see [Create queries to list Batch resources efficiently](batch-efficient-list-queries.md).

## Task state counts

The Get Task Counts operation counts tasks by the following states:

- **Active** - A task that is queued and able to run, but is not currently assigned to a compute node. A task is also `active` if it is [dependent on a parent task](batch-task-dependencies.md) that has not yet completed. 
- **Running** - A task that has been assigned to a compute node, but has not yet completed. A task is counted as `running` when its state is either `preparing` or `running`, as indicated by the [Get information about a task][rest_get_task] operation.
- **Completed** - A task that is no longer eligible to run, because it either finished successfully, or finished unsuccessfully and also exhausted its retry limit. 
- **Succeeded** - A task whose result of task execution is `success`. Batch determines whether a task has succeeded or failed by checking the `TaskExecutionResult` property of the [executionInfo][rest_get_exec_info] property.
- **Failed** A task whose result of task execution is `failure`.

The following .NET code sample shows how to retrieve task counts by state: 

```csharp
var taskCounts = await batchClient.JobOperations.GetJobTaskCountsAsync("job-1");

Console.WriteLine("Task count in active state: {0}", taskCounts.Active);
Console.WriteLine("Task count in preparing or running state: {0}", taskCounts.Running);
Console.WriteLine("Task count in completed state: {0}", taskCounts.Completed);
Console.WriteLine("Succeeded task count: {0}", taskCounts.Succeeded);
Console.WriteLine("Failed task count: {0}", taskCounts.Failed);
```

You can use a similar pattern for REST and other supported languages to get task counts for a job. 

> [!NOTE]
> Batch Service API versions before 2018-08-01.7.0 also return a `validationStatus` property in the Get Task Counts response. This property indicates whether Batch checked the state counts for consistency with the states reported in the List Tasks API. A value of `validated` indicates only that Batch checked for consistency at least once for the job. The value of the `validationStatus` property does not indicate whether the counts that Get Task Counts returns are currently up-to-date.
>

## Node state counts

The List Pool Node Counts operation counts compute nodes by the following states in each pool. Separate aggregate counts are provided for dedicated nodes and low-priority nodes in each pool.

- **Creating** - An Azure-allocated VM that has not yet started to join a pool.
- **Idle** - An available compute node that is not currently running a task.
- **LeavingPool** - A node that is leaving the pool, either because the user explicitly removed it or because the pool is resizing or autoscaling down.
- **Offline** - A node that Batch cannot use to schedule new tasks.
- **Preempted** - A low-priority node that was removed from the pool because Azure reclaimed the VM. A `preempted` node can be reinitialized when replacement low-priority VM capacity is available.
- **Rebooting** - A node that is restarting.
- **Reimaging** - A node on which the operating system is being reinstalled.
- **Running** - A node that is running one or more tasks (other than the start task).
- **Starting** - A node on which the Batch service is starting. 
- **StartTaskFailed** - A node on which the [start task][rest_start_task] failed and exhausted all retries, and on which `waitForSuccess` is set on the start task. The node is not usable for running tasks.
- **Unknown** - A node that lost contact with the Batch service and whose state isn't known.
- **Unusable** - A node that can't be used for task execution because of errors.
- **WaitingForStartTask** - A node on which the start task started running, but `waitForSuccess` is set and the start task has not completed.

The following C# snippet shows how to list node counts for all pools in the current account:

```csharp
foreach (var nodeCounts in batchClient.PoolOperations.ListPoolNodeCounts())
{
    Console.WriteLine("Pool Id: {0}", nodeCounts.PoolId);

    Console.WriteLine("Total dedicated node count: {0}", nodeCounts.Dedicated.Total);

    // Get dedicated node counts in Idle and Offline states; you can get additional states.
    Console.WriteLine("Dedicated node count in Idle state: {0}", nodeCounts.Dedicated.Idle);
    Console.WriteLine("Dedicated node count in Offline state: {0}", nodeCounts.Dedicated.Offline);

    Console.WriteLine("Total low priority node count: {0}", nodeCounts.LowPriority.Total);

    // Get low-priority node counts in Running and Preempted states; you can get additional states.
    Console.WriteLine("Low-priority node count in Running state: {0}", nodeCounts.LowPriority.Running);
    Console.WriteLine("Low-priority node count in Preempted state: {0}", nodeCounts.LowPriority.Preempted);
}
```
The following C# snippet shows how to list node counts for a given pool in the current account.

```csharp
foreach (var nodeCounts in batchClient.PoolOperations.ListPoolNodeCounts(new ODATADetailLevel(filterClause: "poolId eq 'testpool'")))
{
    Console.WriteLine("Pool Id: {0}", nodeCounts.PoolId);

    Console.WriteLine("Total dedicated node count: {0}", nodeCounts.Dedicated.Total);

    // Get dedicated node counts in Idle and Offline states; you can get additional states.
    Console.WriteLine("Dedicated node count in Idle state: {0}", nodeCounts.Dedicated.Idle);
    Console.WriteLine("Dedicated node count in Offline state: {0}", nodeCounts.Dedicated.Offline);

    Console.WriteLine("Total low priority node count: {0}", nodeCounts.LowPriority.Total);

    // Get low-priority node counts in Running and Preempted states; you can get additional states.
    Console.WriteLine("Low-priority node count in Running state: {0}", nodeCounts.LowPriority.Running);
    Console.WriteLine("Low-priority node count in Preempted state: {0}", nodeCounts.LowPriority.Preempted);
}
```

You can use a similar pattern for REST and other supported languages to get node counts for pools.
 
## Next steps

* Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
* For information about applying filters to queries that list Batch resources, see [Create queries to list Batch resources efficiently](batch-efficient-list-queries.md).


[rest_get_task_counts]: /rest/api/batchservice/job/gettaskcounts
[rest_get_node_counts]: /rest/api/batchservice/account/listpoolnodecounts
[rest_get_task]: /rest/api/batchservice/task/get
[rest_list_tasks]: /rest/api/batchservice/task/list
[rest_get_exec_info]: /rest/api/batchservice/task/get
[rest_start_task]: /rest/api/batchservice/pool/add#starttask

