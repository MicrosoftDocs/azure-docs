---
title: Get task counts for a job - Azure Batch | Microsoft Docs
description: An efficient way to count tasks for a job. You can get a count of tasks by task state, and by success or failure.
services: batch
author: tamram
manager: timlt

ms.service: batch
ms.topic: article
ms.date: 07/31/2017
ms.author: tamram

---
# Count tasks for a job by state (Preview)

Azure Batch now provides an efficient way to get an aggregate count of a job's tasks. The [Get Task Counts][rest_get_task_counts] operation returns a count of tasks that are in an active, running, or completed task state. It also returns a count of tasks which have succeeded or failed. You can use the Get Task Counts operation to determine how far a job has progressed. With the Get Task Counts operation, you can more easily display progress to a user, or detect unexpected delays or failures.

> [!IMPORTANT]
> The Get Task Counts API is currently in preview, and is not yet available in Azure Government, Azure China, and Azure Germany. 
>
>

## How tasks are counted

The Get Task Counts operation counts tasks by state, as described below. You can find more information about various task states at [Get information about a task][rest_get_task].

- A task is counted as **active** when it is queued and able to run, but is not currently assigned to a compute node.
- A task is counted as **running** when it has been assigned to a compute node, but has not yet completed. A task is counted as **running** when its state is either `preparing` or `running`, as indicated by the [Get information about a task][rest_get_task] operation.
- A task is counted as **completed** when it is no longer eligible to run. A task counted as **completed** has typically either finished successfully, or has finished unsuccessfully and has also exhausted its retry limit. 

The Get Task Counts operation also reports how many tasks have succeeded or failed, based on the value of the [executionInfo][rest_get_task] property:

    - A task is counted as **succeeded** if the result of task execution is `success`.
    - A task is counted as **failed** if the result of task execution is `failure`.

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


## Error checking for task counts

The Batch service aggregates task counts using a fast but potentially unreliable pipeline. To correct for any errors, the Batch service checks state counts against the task states as reported by the [List Tasks][rest_list_tasks] operation, so long as there are fewer than 200,000 tasks in the job. If the check encounters errors, Batch corrects the result of the Get Tasks Counts operation based on the value returned by the List Tasks operation.   

The **validationStatus** property indicates whether Batch has performed the error check. If the **validationStatus** property is set to `unvalidated`, then Batch has not been able to check state counts against the task states reported by the List Tasks operation. Batch cannot perform this error check if the job includes more than 200,000 tasks, so the **validationStatus** property may be `unvalidated` in this case.

When a task changes state, the aggregation pipeline processes the change within 5 seconds. The Get Task Counts operation reflects the updated task counts within that 5-second period. However, if the aggregation pipeline misses a change in a task state, then that change is not registered until the next validation pass. During this time, 
task counts may be slightly inaccurate due to the missed event, but they are corrected on the next validation passs.

## Next steps

* See the [Batch feature overview](batch-api-basics.md) to learn more about Batch service concepts and features. The article discusses the primary Batch resources such as pools, compute nodes, jobs, and tasks, and provides an overview of the service's features that enable large-scale compute workload execution.
* Learn the basics of developing a Batch-enabled application using the [Batch .NET client library](batch-dotnet-get-started.md) or [Python](batch-python-tutorial.md). These introductory articles guide you through a working application that uses the Batch service to execute a workload on multiple compute nodes, and includes using Azure Storage for workload file staging and retrieval.


[rest_get_task_counts]: https://docs.microsoft.com/rest/api/batchservice/get-the-task-counts-for-a-job
[rest_get_task]: https://docs.microsoft.com/rest/api/batchservice/get-information-about-a-task
[rest_list_tasks]: https://docs.microsoft.com/rest/api/batchservice/list-the-tasks-associated-with-a-job
