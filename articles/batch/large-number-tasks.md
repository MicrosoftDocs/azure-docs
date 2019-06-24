---
title: Submit a large number of tasks - Azure Batch | Microsoft Docs
description: How to efficiently submit a very large number of tasks in a single Azure Batch job
services: batch
documentationcenter: 
author: laurenhughes
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 08/24/2018
ms.author: lahugh
ms.custom: 

---
# Submit a large number of tasks to a Batch job

When you run large-scale Azure Batch workloads, you might want to submit tens of thousands, hundreds of thousands, or even more tasks to a single job. 

This article gives guidance and some code examples to submit large numbers of tasks with substantially increased throughput to a single Batch job. After tasks are submitted, they enter the Batch queue for processing on the pool you specify for the job.

## Use task collections

The Batch APIs provide methods to efficiently add tasks to a job as a *collection*, in addition to one at a time. When adding a large number of tasks, you should use the appropriate methods or overloads to add tasks as a collection. Generally, you construct a task collection by defining tasks as you iterate over a set of input files or parameters for your job.

The maximum size of the task collection that you can add in a single call depends on the Batch API you use:

* The following Batch APIs limit the collection to **100 tasks**. The limit could be smaller depending on the size of the tasks - for example, if the tasks have a large number of resource files or environment variables.

    * [REST API](/rest/api/batchservice/task/addcollection)
    * [Python API](/python/api/azure-batch/azure.batch.operations.TaskOperations?view=azure-python)
    * [Node.js API](/javascript/api/azure-batch/task?view=azure-node-latest)

  When using these APIs, you need to provide logic to divide the number of tasks to meet the collection limit, and to handle errors and retries in case addition of tasks fails. If a task collection is too large to add, the request generates an error and should be retried again with fewer tasks.

* The following APIs support much larger task collections - limited only by RAM availability on the submitting client. These APIs transparently handle dividing the task collection into "chunks" for the lower-level APIs and retries if addition of tasks fails.

    * [.NET API](/dotnet/api/microsoft.azure.batch.cloudjob.addtaskasync?view=azure-dotnet)
    * [Java API](/java/api/com.microsoft.azure.batch.protocol.tasks.addcollectionasync?view=azure-java-stable)
    * [Azure Batch CLI extension](batch-cli-templates.md) with Batch CLI templates
    * [Python SDK extension](https://pypi.org/project/azure-batch-extensions/)

## Increase throughput of task submission

It can take some time to add a large collection of tasks to a job - for example, up to 1 minute to add 20,000 tasks via the .NET API. Depending on the Batch API and your workload, you can improve the task throughput by modifying one or more of the following:

* **Task size** - Adding large tasks takes longer than adding smaller ones. To reduce the size of each task in a collection, you can simplify the task command line, reduce the number of environment variables, or handle requirements for task execution more efficiently. For example, instead of using a large number of resource files, install task dependencies using a [start task](batch-api-basics.md#start-task) on the pool or use an [application package](batch-application-packages.md) or [Docker container](batch-docker-container-workloads.md).

* **Number of parallel operations** - Depending on the Batch API, increase throughput by increasing the maximum number of concurrent operations by the Batch client. Configure this setting using the [BatchClientParallelOptions.MaxDegreeOfParallelism](/dotnet/api/microsoft.azure.batch.batchclientparalleloptions.maxdegreeofparallelism) property in the .NET API, or the `threads` parameter of methods such as [TaskOperations.add_collection](/python/api/azure-batch/azure.batch.operations.TaskOperations?view=azure-python) in the Batch Python SDK extension. (This property is not available in the native Batch Python SDK.) By default, this property is set to 1, but set it higher to improve throughput of operations. You trade off increased throughput by consuming network bandwidth and some CPU performance. Task throughput increases by up to 100 times the `MaxDegreeOfParallelism` or `threads`. In practice, you should set the number of concurrent operations below 100. 
 
  The Azure Batch CLI extension with Batch templates increases the number of concurrent operations automatically based on the number of available cores, but this property is not configurable in the CLI. 

* **HTTP connection limits** - The number of concurrent HTTP connections can throttle the performance of the Batch client when it is adding large numbers of tasks. The number of HTTP connections is limited with certain APIs. When developing with the .NET API, for example, the [ServicePointManager.DefaultConnectionLimit](/dotnet/api/system.net.servicepointmanager.defaultconnectionlimit) property is set to 2 by default. We recommend that you increase the value to a number close to or greater than the number of parallel operations.

## Example: Batch .NET

The following C# snippets show settings to configure when adding a large number of tasks using the Batch .NET API.

To increase task throughput, increase the value of the [MaxDegreeOfParallelism](/dotnet/api/microsoft.azure.batch.batchclientparalleloptions.maxdegreeofparallelism) property of the [BatchClient](/dotnet/api/microsoft.azure.batch.batchclient?view=azure-dotnet). For example:

```csharp
BatchClientParallelOptions parallelOptions = new BatchClientParallelOptions()
  {
    MaxDegreeOfParallelism = 15
  };
...
```
Add a task collection to the job using the appropriate overload of the [AddTaskAsync](/dotnet/api/microsoft.azure.batch.cloudjob.addtaskasync?view=azure-dotnet) or [AddTask](/dotnet/api/microsoft.azure.batch.cloudjob.addtask?view=azure-dotnet
) method. For example:

```csharp
// Add a list of tasks as a collection
List<CloudTask> tasksToAdd = new List<CloudTask>(); // Populate with your tasks
...
await batchClient.JobOperations.AddTaskAsync(jobId, tasksToAdd, parallelOptions);
```


## Example: Batch CLI extension

Using the Azure Batch CLI extensions with [Batch CLI templates](batch-cli-templates.md), create a job template JSON file that includes a [task factory](https://github.com/Azure/azure-batch-cli-extensions/blob/master/doc/taskFactories.md). The task factory configures a collection of related tasks for a job from a single task definition.  

The following is a sample job template for a one-dimensional parametric sweep job with a large number of tasks - in this case, 250,000. The task command line is a simple `echo` command.

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
To run a job with the template, see [Use Azure Batch CLI templates and file transfer](batch-cli-templates.md).

## Example: Batch Python SDK extension

To use the Azure Batch Python SDK extension, first install the Python SDK and the extension:

```
pip install azure-batch
pip install azure-batch-extensions
```

Set up a `BatchExtensionsClient` that uses the SDK extension:

```python

client = batch.BatchExtensionsClient(
    base_url=BATCH_ACCOUNT_URL, resource_group=RESOURCE_GROUP_NAME, batch_account=BATCH_ACCOUNT_NAME)
...
```

Create a collection of tasks to add to a job. For example:


```python
tasks = list()
# Populate the list with your tasks
...
```

Add the task collection using [task.add_collection](/python/api/azure-batch/azure.batch.operations.TaskOperations?view=azure-python). Set the `threads` parameter to increase the number of concurrent operations:

```python
try:
    client.task.add_collection(job_id, threads=100)
except Exception as e:
    raise e
```

The Batch Python SDK extension also supports adding task parameters to job using a JSON specification for a task factory. For example, configure job parameters for a parametric sweep similar to the one in the preceding Batch CLI template example:

```python
parameter_sweep = {
    "job": {
        "type": "Microsoft.Batch/batchAccounts/jobs",
        "apiVersion": "2016-12-01",
        "properties": {
            "id": "myjob",
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
                        "retentionTime": "PT1H"
                    }
                }
            },
            "onAllTasksComplete": "terminatejob"
        }
    }
}
...
job_json = client.job.expand_template(parameter_sweep)
job_parameter = client.job.jobparameter_from_json(job_json)
```

Add the job parameters to the job. Set the `threads` parameter to increase the number of concurrent operations:

```python
try:
    client.job.add(job_parameter, threads=50)
except Exception as e:
    raise e
```

## Next steps

* Learn more about using the Azure Batch CLI extension with [Batch CLI templates](batch-cli-templates.md).
* Learn more about the [Batch Python SDK extension](https://pypi.org/project/azure-batch-extensions/).
