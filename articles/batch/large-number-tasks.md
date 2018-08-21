---
title: Submit a large number of tasks - Azure Batch | Microsoft Docs
description: How to efficiently submit a very large number of tasks in a single Azure Batch job
services: batch
documentationcenter: 
author: dlepow
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 08/20/2018
ms.author: danlep
ms.custom: 

---
# Submit a large number of tasks in a single job 

When you run certain Azure Batch workloads, you might want to submit tens of thousands, hundreds of thousands, or even more tasks in a single job. 

This article gives guidance and some code examples to efficiently submit large numbers of tasks to a single Batch job. By submitting tasks in this way, your Batch script or client application can run without waiting a long time for task submission to complete. After tasks are submitted, they enter the Batch queue for processing on the pool specified for the job.

## Use task collections

To add multiple tasks to a job efficiently, Batch provides methods to add tasks in a *collection*, rather than singly, using the [REST API](/rest/api/batchservice/task/addcollection) or the Batch [.NET](/dotnet/api/microsoft.azure.batch.joboperations.addtaskasync)
), [Python](/python/api/azure-batch/azure.batch.operations.TaskOperations?view=azure-python#azure_batch_operations_TaskOperations_add_collection), and other APIs. Generally, you construct a task collection by iterating over some set of input files or parameters for your job.

The maximum size of the task collection that you can add in a single call depends on the Batch API you use:

* The Batch **REST API** and closely related APIs such as the Python API and Node.js API limit the collection to **100 tasks**. The size of the task collection can also be limited by the size of the tasks, determined by factors including the number of resource files and environment variables used.

  When using these APIs, you need to provide logic to divide the number of tasks to meet the collection limit, and to handle errors and retries in case addition of tasks fails. If a task collection is too large to add, the request fails with code `RequestBodyTooLarge` and should be retried again with fewer tasks.

* The Batch .NET and Java APIs, the Azure CLI with [Batch CLI templates](batch-cli-templates.md), and the Batch Python SDK [extension](https://pypi.org/project/azure-batch-extensions/) support much larger task collections. Testing shows that these APIs support adding hundreds of thousands of tasks to a job in a single call. These APIs transparently handle dividing the task collection into "chunks" for the lower-level APIs and retries if addition of tasks fails.

## Increase task throughput

It can take some time to add a large collection of tasks to a job - for example, up to 1 minute to add 20,000 tasks via the .NET API. Depending on the Batch API and your workload, you can improve the task throughput by modifying one or more of the following:

* **Task size** - Adding large tasks takes longer than adding smaller ones. You might be able to reduce the size of each task in a collection by simplifying the task command line, reducing the number of environment variables, or handling task dependencies more efficiently. For example, you could install task dependencies using a [start task](batch-api-basics.md#start-task) on the pool or using an [application package](batch-application-packages.md) or a [Docker container](batch-docker-container-workloads.md), rather than with resource files.

* **Number of parallel operations** - Depending on the Batch API you use, you can increase throughput by increasing the maximum number of concurrent operations by the Batch client. Configure this setting using the [MaxDegreeOfParallelism](/dotnet/api/microsoft.azure.batch.batchclientparalleloptions.maxdegreeofparallelism) property in the .NET API, or the `threads` parameter of the [add_collection](/python/api/azure-batch/azure.batch.operations.TaskOperations?view=azure-python#add-collection) method in the Batch Python SDK extension. By default, this property is set to 1, but set it higher to improve throughput of operations. You trade off increased throughput by consuming network bandwidth and some CPU performance. Task throughput can increase up to 100 times the `MaxDegreeOfParallelism` or `threads`. In practice, you should set the number of concurrent operations below 100. 
 
  The Azure CLI with Batch CLI templates increases the number of concurrent operations automatically based on the pool configuration, but this property is not configurable in the CLI. 

* **HTTP connection limits** - The performance of the Batch client when it is adding large numbers of tasks can be throttled by the number of concurrent HTTP connections, which is limited with certain APIs. When developing with the .NET API, you can set the [ServicePointManager.DefaultConnectionLimit](dotnet/api/system.net.servicepointmanager.defaultconnectionlimit) property above the default value of 2.

## Example: Batch CLI template

Using the Azure CLI with [Batch CLI templates](batch-cli-templates.md), create a job template that includes a *task factory*. The task factory configures a large number of related tasks for a job from a single task definition. The following types of task factory are supported: parametric sweep, task per file, and task collections. 

The following is a sample job template for a one-dimensional parametric sweep job with a large number of tasks - in this case, 250,000. 

```json
{
    "job": {
        "type": "Microsoft.Batch/batchAccounts/jobs",
        "apiVersion": "2016-12-01",
        "properties": {
            "id": "myjob",
            "constraints": {
                "maxWallClockTime": "PT5H",
                "maxTaskRetryCount": 1
            },
            "poolInfo": {
                "poolId": "mypool"
            },
            "taskFactory": {
                "type": "parametricSweep",
                "parameterSets": [
                    {
                        "start": 1,
                        "end": 250000,
                        "step": 1
                    }
                ],
                "repeatTask": {
                    "commandLine": "/bin/bash -c 'echo Hello world from task {0}'",
                    "constraints": {
                        "retentionTime":"PT1H"
                    }
                }
            },
            "onAllTasksComplete": "terminatejob"
        }
    }
}
```

## Example: Batch .NET

The following C# snippets show settings to configure when adding a large number of tasks using the Batch .NET API.

Increase the value of the [MaxDegreeofParallelism](/dotnet/api/microsoft.azure.batch.batchclientparalleloptions.maxdegreeofparallelism) property of the [BatchClient]().

```csharp
BatchClientParallelOptions parallelOptions = new BatchClientParallelOptions()
  {
    MaxDegreeOfParallelism = 15
  };
...
```
Add a task collection to the job using the appropriate overload of the [AddTaskAsync]() or [AddTask]() method.

```csharp
// Add a list of tasks as a collection
List<CloudTask> tasksToAdd = new List<CloudTask>(); // Populate with your tasks
...
await batchClient.JobOperations.AddTaskAsync(jobId, tasksToAdd);
```




## Example: Batch Python SDK extension

```python


```



## Considerations

* Number of nodes? (tried 10 for 250,000 tasks)

* Task scheduling policy? (tried spread)

* Retry policy (set on client?)

* Constraints (Max wall clock time, Max task retry count)

* Max tasks per node? (tried 4) - is this the same thing as 

* MaxDegreeofParallelism in the client - is this only in the SDKs?

* Querying task states (task counts, OData filter)

## Next steps
