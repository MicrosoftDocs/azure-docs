---
title: Submit a large number of tasks to a Batch job
description: Learn how to efficiently submit a very large number of tasks in a single Azure Batch job.
ms.topic: how-to
ms.date: 05/20/2026
ms.devlang: csharp
# ms.devlang: csharp, python
ms.custom: devx-track-python, devx-track-csharp, devx-track-dotnet
# Customer intent: As a developer managing large-scale processing, I want to submit a high volume of tasks to a Batch job efficiently, so that I can optimize throughput and execution time for my workloads.
---
# Submit a large number of tasks to a Batch job

When you run large-scale Azure Batch workloads, you might want to submit tens of thousands, hundreds of thousands, or even more tasks to a single job.

This article shows you how to submit large numbers of tasks with substantially increased throughput to a single Batch job. After tasks are submitted, they enter the Batch queue for processing on the pool you specify for the job.

## Use task collections

When adding a large number of tasks, use the appropriate methods or overloads provided by the Batch APIs to add tasks as a *collection* rather than one at a time. Generally, you construct a task collection by defining tasks as you iterate over a set of input files or parameters for your job.

The maximum size of the task collection that you can add in a single call depends on the Batch API you use.

### APIs allowing collections of up to 100 tasks

These Batch APIs limit the collection to 100 tasks. The limit could be smaller depending on the size of the tasks (for example, if the tasks have a large number of resource files or environment variables).

- [REST API](/rest/api/batchservice/task/addcollection)
- [Node.js API](/javascript/api/@azure/batch/)

When using these APIs, you need to provide logic to divide the number of tasks to meet the collection limit, and to handle errors and retries in case of task addition failures. If a task collection is too large to add, the request generates an error and should be retried again with fewer tasks.

### APIs allowing collections of larger numbers of tasks

Other Batch APIs support much larger task collections, limited only by RAM availability on the submitting client. These APIs transparently handle dividing the task collection into "chunks" for the lower-level APIs and retries for task addition failures.

- [.NET API](/dotnet/api/azure.compute.batch.batchclient.createtaskasync)
- [Python API](/python/api/azure-batch/azure.batch.batchclient) (`create_tasks` method, v15.x and later)
- [Java API](/java/api/com.microsoft.azure.batch.protocol.tasks.addcollectionasync)
- [Azure Batch CLI extension](batch-cli-templates.md) with Batch CLI templates

## Increase throughput of task submission

It can take some time to add a large collection of tasks to a job. For example, adding 20,000 tasks via the .NET API might take up to one minute. Depending on the Batch API and your workload, you can improve task throughput by modifying one or more of the following.

### Task size

Adding large tasks takes longer than adding smaller ones. To reduce the size of each task in a collection, you can simplify the task command line, reduce the number of environment variables, or handle requirements for task execution more efficiently.

For example, instead of using a large number of resource files, install task dependencies using a [start task](jobs-and-tasks.md#start-task) on the pool, or use an [application package](batch-application-packages.md) or [Docker container](batch-docker-container-workloads.md).

### Number of parallel operations

Depending on the Batch API, you can increase throughput by increasing the maximum number of concurrent operations by the Batch client. Configure this setting using the [CreateTasksOptions](/dotnet/api/azure.compute.batch.createtasksoptions) property in the .NET API, or the `max_concurrency` parameter of the [BatchClient.create_tasks](/python/api/azure-batch/azure.batch.batchclient) method in the Batch Python SDK (v15.x and later).

By default, this property is set to 1, but you can set it higher to improve throughput of operations. You trade off increased throughput by consuming network bandwidth and some CPU performance. Task throughput increases by up to 100 times the `MaxDegreeOfParallelism` or `max_concurrency`. In practice, you should set the number of concurrent operations to below 100.

 The Azure Batch CLI extension with Batch templates increases the number of concurrent operations automatically based on the number of available cores, but this property is not configurable in the CLI.

### HTTP connection limits

Having many concurrent HTTP connections can throttle the performance of the Batch client when it is adding large numbers of tasks. Some APIs limit the number of HTTP connections. When developing with the .NET API, for example, the [ServicePointManager.DefaultConnectionLimit](/dotnet/api/system.net.servicepointmanager.defaultconnectionlimit) property is set to 2 by default. We recommend that you increase the value to a number close to or greater than the number of parallel operations.

## Example: Batch .NET

The following C# snippets show settings to configure when adding a large number of tasks using the Batch .NET API.

To increase task throughput, increase the value of the [MaxDegreeOfParallelism](/dotnet/api/azure.compute.batch.createtasksoptions) property of the [CreateTasksOptions](/dotnet/api/azure.compute.batch.createtasksoptions) passed to [BatchClient.CreateTasksAsync](/dotnet/api/azure.compute.batch.batchclient). For example:

```C# Snippet:large_tasks_parallel_options
CreateTasksOptions parallelOptions = new CreateTasksOptions()
{
    MaxDegreeOfParallelism = 15
};
```

Add a task collection to the job using the appropriate overload of the [CreateTasksAsync](/dotnet/api/azure.compute.batch.batchclient) method. For example:

```C# Snippet:large_tasks_add_collection
// Add a list of tasks as a collection
List<BatchTaskCreateOptions> tasksToAdd = new List<BatchTaskCreateOptions>(); // Populate with your tasks
// ...
await batchClient.CreateTasksAsync(jobId, tasksToAdd, parallelOptions);
```

## Example: Batch CLI extension

Using the Azure Batch CLI extensions with [Batch CLI templates](batch-cli-templates.md), create a job template JSON file that includes a [task factory](https://github.com/Azure/azure-batch-cli-extensions/blob/master/doc/taskFactories.md). The task factory configures a collection of related tasks for a job from a single task definition.  

The following is a sample job template for a one-dimensional parametric sweep job with a large number of tasks (in this case, 250,000). The task command line is a simple `echo` command.

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

## Example: Batch Python SDK

The following Python snippets show how to submit a large number of tasks using the [azure-batch](https://pypi.org/project/azure-batch/) v15.x SDK. Version 15.x introduces a unified `BatchClient` and a `create_tasks` method that performs bulk task submission with built-in chunking, retries, and configurable concurrency. For details on migrating from earlier versions, see the [Azure Batch Python migration guide](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/batch/azure-batch/migration_guide.md).

Install the [azure-batch](https://pypi.org/project/azure-batch/) and [azure-identity](https://pypi.org/project/azure-identity/) packages:

```
pip install azure-batch azure-identity
```

Import the packages and create a `BatchClient` that authenticates with [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential):

```python Snippet:large_tasks_client
from azure.batch import BatchClient, models
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
client = BatchClient(endpoint=BATCH_ACCOUNT_ENDPOINT, credential=credential)
```

Build a collection of [BatchTaskCreateOptions](/python/api/azure-batch/azure.batch.models.batchtaskcreateoptions) objects to add to a job:

```python Snippet:large_tasks_collection
tasks = []
for i in range(250000):
    tasks.append(
        models.BatchTaskCreateOptions(
            id=f"task-{i}",
            command_line=f"/bin/bash -c 'echo Hello world from task {i}'"
        )
    )
```

Submit the task collection in a single call using [BatchClient.create_tasks](/python/api/azure-batch/azure.batch.batchclient). The method transparently splits the collection into service-supported chunks and retries failed requests. Set the `max_concurrency` parameter to increase the number of parallel submission threads:

```python Snippet:large_tasks_add_collection
result = client.create_tasks(
    job_id="my-job",
    task_collection=tasks,
    max_concurrency=10
)
```

## Next steps

- Learn more about using the Azure Batch CLI extension with [Batch CLI templates](batch-cli-templates.md).
- Learn more about the [Azure Batch Python SDK](https://pypi.org/project/azure-batch/) and the [migration guide](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/batch/azure-batch/migration_guide.md).
- Read about [best practices for Azure Batch](best-practices.md).
