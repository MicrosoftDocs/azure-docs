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
ms.date: 08/08/2018
ms.author: danlep
ms.custom: 

---
# Submit a large number of tasks in a single job 

With certain Azure Batch workloads, you might want to submit tens of thousands, hundreds of thousands, or even more tasks in a single job. 

This article gives some code examples to efficiently submit large numbers of tasks to a single Batch job. By submitting tasks in this way, your Batch script of client application can run without waiting for task submission to complete. After tasks are submitted, they enter the Batch queue for processing on the pool specified for the job. 

## Batch CLI templates

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

## Batch .NET

For best performance, add tasks as a *collection* to the job. Use the appropriate override to the [AddTask](/dotnet/api/microsoft.azure.batch.joboperations.addtask) method, or the asynchronous version [AddTaskAsync](/dotnet/api/microsoft.azure.batch.joboperations.addtaskasync). Batch adds tasks in bulk much more efficiently than adding tasks singly. For example:

```csharp
// Add a list of tasks as a collection
List<CloudTask> tasksToAdd = new List<CloudTask>(); // Populate with your tasks
...
await batchClient.JobOperations.AddTaskAsync(jobId, tasksToAdd);
```

Generally you can add tens of thousands of tasks or more in this way, but it may take the Batch client some time - for example, up to a minute for 20,000 tasks. For greater throughput of task submission, increase the [BatchClientParallelOptions.MaxDegreeOfParallelism](/dotnet/api/microsoft.azure.batch.batchclientparalleloptions.maxdegreeofparallelism) property. This property configures the maximum number of concurrent operations by the Batch client. By default, this property is set to 1, but set it higher to improve throughput of operations, including operations to add tasks. You trade off increased throughput by consuming network bandwidth and some CPU performance. Throughput can increase up to 100 times the `MaxDegreeOfParallelism`. For example:  

```csharp
BatchClientParallelOptions parallelOptions = new BatchClientParallelOptions()
  {
    MaxDegreeOfParallelism = 15
  };
...
```

## Batch Python

As with the Batch .NET SDK, for best performance, add tasks as a *collection* to the job. For example:

```python
# Add a list of tasks as a collection
tasks = list() # Populate with your tasks
...
batch_client.task.add_collection(job_id, tasks)
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
