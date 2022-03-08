---
title: Count states for tasks and nodes
description: Count the state of Azure Batch tasks and compute nodes to help manage and monitor Batch solutions.
ms.date: 12/13/2021
ms.topic: how-to
ms.devlang: csharp
ms.custom: seodec18
---
# Monitor Batch solutions by counting tasks and nodes by state

To monitor and manage large-scale Azure Batch solutions, you may need to determine counts of resources in various states. Azure Batch provides efficient operations to get counts for Batch tasks and compute nodes. You can use these operations instead of potentially time-consuming list queries that return detailed information about large collections of tasks or nodes.

- [Get Task Counts](/rest/api/batchservice/job/gettaskcounts) gets an aggregate count of active, running, and completed tasks in a job, and of tasks that succeeded or failed. By counting tasks in each state, you can more easily display job progress to a user, or detect unexpected delays or failures that may affect the job.

- [List Pool Node Counts](/rest/api/batchservice/account/listpoolnodecounts) gets the number of dedicated and [Spot compute nodes](batch-spot-vms.md) in each pool that are in various states: creating, idle, offline, preempted, rebooting, reimaging, starting, and others. By counting nodes in each state, you can determine when you have adequate compute resources to run your jobs, and identify potential issues with your pools.

Note that at times, the numbers returned by these operations may not be up to date. If you need to be sure that a count is accurate, use a list query to count these resources. List queries also let you get information about other Batch resources such as applications. For more information about applying filters to list queries, see [Create queries to list Batch resources efficiently](batch-efficient-list-queries.md).

## Task state counts

The Get Task Counts operation counts tasks by the following states:

- **Active**: A task that is queued and able to run, but is not currently assigned to a compute node. A task is also `active` if it is [dependent on a parent task](batch-task-dependencies.md) that has not yet completed.
- **Running**: A task that has been assigned to a compute node, but has not yet completed. A task is counted as `running` when its state is either `preparing` or `running`, as indicated by the [Get information about a task](/rest/api/batchservice/task/get) operation.
- **Completed**: A task that is no longer eligible to run, because it either finished successfully, or finished unsuccessfully and also exhausted its retry limit.
- **Succeeded**: A task where the result of task execution is `success`. Batch determines whether a task has succeeded or failed by checking the `TaskExecutionResult` property of the [executionInfo](/rest/api/batchservice/task/get) property.
- **Failed**: A task where the result of task execution is `failure`.

The following .NET code sample shows how to retrieve task counts by state.

```csharp
var taskCounts = await batchClient.JobOperations.GetJobTaskCountsAsync("job-1");

Console.WriteLine("Task count in active state: {0}", taskCounts.Active);
Console.WriteLine("Task count in preparing or running state: {0}", taskCounts.Running);
Console.WriteLine("Task count in completed state: {0}", taskCounts.Completed);
Console.WriteLine("Succeeded task count: {0}", taskCounts.Succeeded);
Console.WriteLine("Failed task count: {0}", taskCounts.Failed);
```

You can use a similar pattern for REST and other supported languages to get task counts for a job.

## Node state counts

The List Pool Node Counts operation counts compute nodes by the following states in each pool. Separate aggregate counts are provided for dedicated nodes and Spot nodes in each pool.

- **Creating**: An Azure-allocated VM that has not yet started to join a pool.
- **Idle**: An available compute node that is not currently running a task.
- **LeavingPool**: A node that is leaving the pool, either because the user explicitly removed it or because the pool is resizing or autoscaling down.
- **Offline**: A node that Batch cannot use to schedule new tasks.
- **Preempted**: A Spot node that was removed from the pool because Azure reclaimed the VM. A `preempted` node can be reinitialized when replacement Spot VM capacity is available.
- **Rebooting**: A node that is restarting.
- **Reimaging**: A node on which the operating system is being reinstalled.
- **Running** : A node that is running one or more tasks (other than the start task).
- **Starting**: A node on which the Batch service is starting.
- **StartTaskFailed**: A node on which the [start task](/rest/api/batchservice/pool/add#starttask) failed and exhausted all retries, and on which `waitForSuccess` is set on the start task. The node is not usable for running tasks.
- **Unknown**: A node that lost contact with the Batch service and whose state isn't known.
- **Unusable**: A node that can't be used for task execution because of errors.
- **WaitingForStartTask**: A node on which the start task started running, but `waitForSuccess` is set and the start task has not completed.

The following C# snippet shows how to list node counts for all pools in the current account:

```csharp
foreach (var nodeCounts in batchClient.PoolOperations.ListPoolNodeCounts())
{
    Console.WriteLine("Pool Id: {0}", nodeCounts.PoolId);

    Console.WriteLine("Total dedicated node count: {0}", nodeCounts.Dedicated.Total);

    // Get dedicated node counts in Idle and Offline states; you can get additional states.
    Console.WriteLine("Dedicated node count in Idle state: {0}", nodeCounts.Dedicated.Idle);
    Console.WriteLine("Dedicated node count in Offline state: {0}", nodeCounts.Dedicated.Offline);

    Console.WriteLine("Total Spot node count: {0}", nodeCounts.LowPriority.Total);

    // Get Spot node counts in Running and Preempted states; you can get additional states.
    Console.WriteLine("Spot node count in Running state: {0}", nodeCounts.LowPriority.Running);
    Console.WriteLine("Spot node count in Preempted state: {0}", nodeCounts.LowPriority.Preempted);
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

    Console.WriteLine("Total Spot node count: {0}", nodeCounts.LowPriority.Total);

    // Get Spot node counts in Running and Preempted states; you can get additional states.
    Console.WriteLine("Spot node count in Running state: {0}", nodeCounts.LowPriority.Running);
    Console.WriteLine("Spot node count in Preempted state: {0}", nodeCounts.LowPriority.Preempted);
}
```

You can use a similar pattern for REST and other supported languages to get node counts for pools.

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about applying filters to queries that list Batch resources, see [Create queries to list Batch resources efficiently](batch-efficient-list-queries.md).
