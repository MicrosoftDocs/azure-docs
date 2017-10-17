---
title: Monitor a job's progress by counting tasks by state - Azure Batch | Microsoft Docs
description: Monitor the progress of a job by calling the Get Task Counts operation to count tasks for a job. You can get a count of active, running, and completed tasks, and by tasks that have succeeded or failed.
services: batch
author: tamram
manager: timlt

ms.service: batch
ms.topic: article
ms.date: 08/02/2017
ms.author: tamram

---
# Count tasks by state to monitor a job's progress (Preview)

Azure Batch provides an efficient way to monitor the progress of a job as it runs its tasks. You can call the [Get Task Counts][rest_get_task_counts] operation to find out how many tasks are in an active, running, or completed state, and how many have succeeded or failed. By counting the number of tasks in each state, you can more easily display the job's progress to a user, or detect unexpected delays or failures that may affect the job.

> [!IMPORTANT]
> The Get Task Counts operation is currently in preview, and is not yet available in Azure Government, Azure China, and Azure Germany. 
>
>

## How tasks are counted

The Get Task Counts operation counts tasks by state, as follows:

- A task is counted as **active** when it is queued and able to run, but is not currently assigned to a compute node. A task is also counted as **active** if it is dependent on a parent task that has not yet completed. For more information on task dependencies, see [Create task dependencies to run tasks that depend on other tasks](batch-task-dependencies.md). 
- A task is counted as **running** when it has been assigned to a compute node, but has not yet completed. A task is counted as **running** when its state is either `preparing` or `running`, as indicated by the [Get information about a task][rest_get_task] operation.
- A task is counted as **completed** when it is no longer eligible to run. A task counted as **completed** has typically either finished successfully, or has finished unsuccessfully and has also exhausted its retry limit. 

The Get Task Counts operation also reports how many tasks have succeeded or failed. Batch determines whether a task has succeeded or failed by checking the **result** property of the [executionInfo][https://docs.microsoft.com/rest/api/batchservice/get-information-about-a-task#executionInfo] property:

    - A task is counted as **succeeded** if the result of task execution is `success`.
    - A task is counted as **failed** if the result of task execution is `failure`.

For more information about task states, see [Get information about a task][rest_get_task].

The following .NET code sample shows how to retrieve task counts by state: 

```csharp
var taskCounts = await batchClient.JobOperations.GetTaskCountsAsync("job-1");

Console.WriteLine("Task count in active state: {0}", taskCounts.Active);
Console.WriteLine("Task count in preparing or running state: {0}", taskCounts.Running);
Console.WriteLine("Task count in completed state: {0}", taskCounts.Completed);
Console.WriteLine("Succeeded task count: {0}", taskCounts.Succeeded);
Console.WriteLine("Failed task count: {0}", taskCounts.Failed);
Console.WriteLine("ValidationStatus: {0}", taskCounts.ValidationStatus);
```

> [!NOTE]
> You can use a similar pattern for REST and other supported languages to get task counts for a job. 
> 
> 

## Consistency checking for task counts

The Batch service aggregates task counts by gathering data from multiple parts of an asynchronous distributed system. To ensure that task counts are correct, Batch provides additional validation for state counts by performing consistency checks against multiple components of the system. Batch performs these consistency checks as long as there are fewer than 200,000 tasks in the job. In the unlikely event that the consistency check finds errors, Batch corrects the result of the Get Tasks Counts operation based on the results of the consistency check. The consistency check is an extra measure to ensure that customers who rely on the Get Task Counts operation get the right information they need for their solution.

The **validationStatus** property in the response indicates whether Batch has performed the consistency check. If Batch has not been able to check state counts against the actual states held in the system, then the **validationStatus** property is set to `unvalidated`. For performance reasons, Batch will not perform the consistency check if the job includes more than 200,000 tasks, so the **validationStatus** property may be set to `unvalidated` in this case. However, the task count is not necessarily wrong in this case, as even a very limited data loss is highly unlikely. 

When a task changes state, the aggregation pipeline processes the change within few seconds. The Get Task Counts operation reflects the updated task counts within that period. However, if the aggregation pipeline misses a change in a task state, then that change is not registered until the next validation pass. During this time, task counts may be slightly inaccurate due to the missed event, but they are corrected on the next validation pass.

## Best practices for counting a job's tasks

Calling the Get Task Counts operation is the most efficient way to return a basic count of a job's tasks by state. If you are using Batch service version 2017-06-01.5.1, we recommend writing or updating your code to use Get Task Counts.

The Get Task Counts operation is not available in Batch service versions earlier than 2017-06-01.5.1. If you are using an older version of the service, then use a list query to count tasks in a job instead. For more information, see [Create queries to list Batch resources efficiently](batch-efficient-list-queries.md).

## Next steps

* See the [Batch feature overview](batch-api-basics.md) to learn more about Batch service concepts and features. The article discusses the primary Batch resources such as pools, compute nodes, jobs, and tasks, and provides an overview of the service's features.
* Learn the basics of developing a Batch-enabled application using the [Batch .NET client library](batch-dotnet-get-started.md) or [Python](batch-python-tutorial.md). These introductory articles guide you through a working application that uses the Batch service to execute a workload on multiple compute nodes.


[rest_get_task_counts]: https://docs.microsoft.com/rest/api/batchservice/get-the-task-counts-for-a-job
[rest_get_task]: https://docs.microsoft.com/rest/api/batchservice/get-information-about-a-task
[rest_list_tasks]: https://docs.microsoft.com/rest/api/batchservice/list-the-tasks-associated-with-a-job
