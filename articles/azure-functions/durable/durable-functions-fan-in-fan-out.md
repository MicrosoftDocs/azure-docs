---
title: Fan-out/fan-in scenarios in Durable Functions - Azure
description: Learn how to implement a fan-out-fan-in scenario using Durable Functions or Durable Task SDKs.
ms.topic: conceptual
ms.custom: devx-track-js, devx-track-python
ms.date: 02/04/2026
ms.author: azfuncdf
zone_pivot_groups: azure-durable-approach
---

# Fan-out/fan-in scenario

::: zone pivot="durable-functions"

*Fan-out/fan-in* runs multiple functions in parallel and then aggregates the results. This article shows an example that uses [Durable Functions](what-is-durable-task.md) to back up some or all of an app's site content to Azure Storage.

[!INCLUDE [durable-functions-prerequisites](../../../includes/durable-functions-prerequisites.md)]

::: zone-end

::: zone pivot="durable-task-sdks"

*Fan-out/fan-in* runs multiple activities in parallel and then aggregates the results. This article shows how to implement the pattern by using the Durable Task SDKs for .NET, JavaScript, Python, and Java.

::: zone-end

## Scenario overview

::: zone pivot="durable-functions"

In this sample, the functions upload all files under a specified directory (recursively) to blob storage. They also count the total number of bytes uploaded.

A single function can handle everything, but it doesn't scale. A single function execution runs on one virtual machine (VM), so throughput is limited to that VM. Reliability is another concern. If the process fails midway through, or takes more than five minutes, the backup can end in a partially completed state. Then you restart the backup.

A more robust approach is to use two separate functions: one enumerates the files and adds file names to a queue, and the other reads from the queue and uploads the files to blob storage. This approach improves throughput and reliability, but you need to set up and manage the queue. More importantly, this approach adds complexity for state management and coordination, like reporting the total number of bytes uploaded.

Durable Functions provides all these benefits with little overhead.

::: zone-end

::: zone pivot="durable-task-sdks"

In the following example, the orchestrator processes multiple work items in parallel and then aggregates the results. This pattern is useful when you need to:

- Process a batch of items where each item can be processed independently
- Distribute work across multiple machines for better throughput
- Aggregate results from all parallel operations

Without the fan-out/fan-in pattern, you either process items sequentially, which limits throughput, or you manage your own queuing and coordination logic, which adds complexity.

The Durable Task SDKs handle parallelization and coordination, so the pattern is simple to implement.

::: zone-end

## The functions

::: zone pivot="durable-functions"

This article describes the functions in the sample app:

* `E2_BackupSiteContent`: An [orchestrator function](durable-functions-bindings.md#orchestration-trigger) that calls `E2_GetFileList` to get a list of files to back up, and then calls `E2_CopyFileToBlob` for each file.
* `E2_GetFileList`: An [activity function](durable-functions-bindings.md#activity-trigger) that returns a list of files in a directory.
* `E2_CopyFileToBlob`: An activity function that backs up a single file to Azure Blob Storage.

::: zone-end

::: zone pivot="durable-task-sdks"

This article describes the components in the example code:

* `ParallelProcessingOrchestration`, `fanOutFanInOrchestrator`, `fan_out_fan_in_orchestrator`, or `FanOutFanIn_WordCount`: An orchestrator that fans out work to multiple activities in parallel, waits for all activities to complete, and then fans in by aggregating the results.
* `ProcessWorkItemActivity`, `processWorkItem`, `process_work_item`, or `CountWords`: An activity that processes a single work item.
* `AggregateResultsActivity`, `aggregateResults`, or `aggregate_results`: An activity that aggregates results from all parallel operations.

::: zone-end

## Orchestrator

::: zone pivot="durable-functions"

This orchestrator function does the following:

1. Takes `rootDirectory` as input.
1. Calls a function to get a recursive list of files under `rootDirectory`.
1. Makes parallel function calls to upload each file to Azure Blob Storage.
1. Waits for all uploads to complete.
1. Returns the total number of bytes uploaded to Azure Blob Storage.

# [C#](#tab/csharp)

Here is the code that implements the orchestrator function:

<details>
<summary><b>Isolated model</b></summary>

```csharp
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.DurableTask;

namespace SampleApp;

public static class BackupSiteContent
{
    [Function("E2_BackupSiteContent")]
    public static async Task<long> Run(
        [OrchestrationTrigger] TaskOrchestrationContext context)
    {
        string rootDirectory = context.GetInput<string>()?.Trim();
        if (string.IsNullOrEmpty(rootDirectory))
        {
            rootDirectory = Directory.GetParent(typeof(BackupSiteContent).Assembly.Location)!.FullName;
        }

        string[] files = await context.CallActivityAsync<string[]>("E2_GetFileList", rootDirectory);

        Task<long>[] tasks = files
            .Select(file => context.CallActivityAsync<long>("E2_CopyFileToBlob", file))
            .ToArray();

        long[] results = await Task.WhenAll(tasks);
        return results.Sum();
    }
}
```

Notice the `await Task.WhenAll(tasks);` line. The code doesn't await the individual calls to `E2_CopyFileToBlob`, so they run in parallel. When the orchestrator passes the task array to `Task.WhenAll`, it returns a task that doesn't complete until all copy operations complete. If you're familiar with the Task Parallel Library (TPL) in .NET, this pattern is familiar. The difference is that these tasks could be running on multiple virtual machines concurrently, and the Durable Functions extension ensures that the end-to-end execution is resilient to process recycling.

After the orchestrator awaits `Task.WhenAll`, all function calls are complete and return values. Each call to `E2_CopyFileToBlob` returns the number of bytes uploaded. Calculate the total by adding the return values.

</details>

<br>

<details>
<summary><b>In-process model</b></summary>

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/BackupSiteContent.cs?range=16-42)]

> [!NOTE]
> The [in-process model sample](~/samples-durable-functions/samples/precompiled/BackupSiteContent.cs) uses deprecated in-process packages. The preceding code shows the recommended .NET isolated worker model.

</details>

<br>

# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

The function uses the standard *function.json* for orchestrator functions.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_BackupSiteContent/function.json":::

Here is the code that implements the orchestrator function:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_BackupSiteContent/index.js":::

Notice the `yield context.df.Task.all(tasks);` line. The code doesn't yield the individual calls to `E2_CopyFileToBlob`, so they run in parallel. When the orchestrator passes the task array to `context.df.Task.all`, it returns a task that doesn't complete until all copy operations complete. If you're familiar with [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) in JavaScript, then this is not new to you. The difference is that these tasks could be running on multiple virtual machines concurrently, and the Durable Functions extension ensures that the end-to-end execution is resilient to process recycling.

> [!NOTE]
> Although tasks are conceptually similar to JavaScript promises, orchestrator functions should use `context.df.Task.all` and `context.df.Task.any` instead of `Promise.all` and `Promise.race` to manage task parallelization.

After the orchestrator yields `context.df.Task.all`, all function calls are complete and return values. Each call to `E2_CopyFileToBlob` returns the number of bytes uploaded, so calculating the sum total byte count is a matter of adding all those return values together.

</details>

<br>

<details>
<summary><b>V4 programming model</b></summary>

Here is the code that implements the orchestrator function:

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/backupSiteContent.js" range="1,4,7-35":::

Notice the `yield context.df.Task.all(tasks);` line. All the individual calls to the `copyFileToBlob` function were *not* yielded, which allows them to run in parallel. When we pass this array of tasks to `context.df.Task.all`, we get back a task that won't complete *until all the copy operations have completed*. If you're familiar with [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) in JavaScript, then this is not new to you. The difference is that these tasks could be running on multiple virtual machines concurrently, and the Durable Functions extension ensures that the end-to-end execution is resilient to process recycling.

> [!NOTE]
> Although tasks are conceptually similar to JavaScript promises, orchestrator functions should use `context.df.Task.all` and `context.df.Task.any` instead of `Promise.all` and `Promise.race` to manage task parallelization.

After yielding from `context.df.Task.all`, we know that all function calls have completed and have returned values back to us. Each call to `copyFileToBlob` returns the number of bytes uploaded, so calculating the sum total byte count is a matter of adding all those return values together.

</details>

# [Python](#tab/python)

The function uses the standard *function.json* for orchestrator functions.

[!code-json[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_BackupSiteContent/function.json)]

Here is the code that implements the orchestrator function:

[!code-python[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_BackupSiteContent/\_\_init\_\_.py)]

Notice the `yield context.task_all(tasks);` line. The code doesn't yield the individual calls to `E2_CopyFileToBlob`, so they run in parallel. When the orchestrator passes the task array to `context.task_all`, it returns a task that doesn't complete until all copy operations complete. If you're familiar with [`asyncio.gather`](https://docs.python.org/3/library/asyncio-task.html#asyncio.gather) in Python, then this is not new to you. The difference is that these tasks could be running on multiple virtual machines concurrently, and the Durable Functions extension ensures that the end-to-end execution is resilient to process recycling.

> [!NOTE]
> Although tasks are conceptually similar to Python awaitables, orchestrator functions should use `yield` as well as the `context.task_all` and `context.task_any` APIs to manage task parallelization.

After the orchestrator yields `context.task_all`, all function calls are complete and return values. Each call to `E2_CopyFileToBlob` returns the number of bytes uploaded, so we can calculate the sum total byte count by adding all the return values together.

# [PowerShell](#tab/powershell)

A PowerShell sample isn't available yet.

# [Java](#tab/java)

A Java sample isn't available yet.

---

::: zone-end

::: zone pivot="durable-task-sdks"

The orchestrator does the following:

1. Takes a list of work items as input.
1. Fans out by creating a task for each work item and processing them in parallel.
1. Waits for all parallel tasks to complete.
1. Fans in by aggregating the results.

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;
using System.Collections.Generic;
using System.Threading.Tasks;

[DurableTask]
public class ParallelProcessingOrchestration : TaskOrchestrator<List<string>, Dictionary<string, int>>
{
    public override async Task<Dictionary<string, int>> RunAsync(
        TaskOrchestrationContext context, List<string> workItems)
    {
        // Step 1: Fan-out by creating a task for each work item in parallel
        var processingTasks = new List<Task<Dictionary<string, int>>>();

        foreach (string workItem in workItems)
        {
            // Create a task for each work item (fan-out)
            Task<Dictionary<string, int>> task = context.CallActivityAsync<Dictionary<string, int>>(
                nameof(ProcessWorkItemActivity), workItem);
            processingTasks.Add(task);
        }

        // Step 2: Wait for all parallel tasks to complete
        Dictionary<string, int>[] results = await Task.WhenAll(processingTasks);

        // Step 3: Fan-in by aggregating all results
        Dictionary<string, int> aggregatedResults = await context.CallActivityAsync<Dictionary<string, int>>(
            nameof(AggregateResultsActivity), results);

        return aggregatedResults;
    }
}
```

Use `Task.WhenAll()` to wait for all parallel tasks to complete. The Durable Task SDK ensures that the tasks can run on multiple machines concurrently, and the execution is resilient to process restarts.

# [JavaScript](#tab/javascript)

```typescript
import {
  OrchestrationContext,
  TOrchestrator,
  whenAll,
} from "@microsoft/durabletask-js";

const fanOutFanInOrchestrator: TOrchestrator = async function* (
  ctx: OrchestrationContext,
  workItems: string[]
): any {
  // Fan-out: create a task for each work item in parallel
  const tasks = workItems.map((item) => ctx.callActivity(processWorkItem, item));

  // Wait for all parallel tasks to complete
  const results: number[] = yield whenAll(tasks);

  // Fan-in: aggregate all results
  const aggregatedResult = yield ctx.callActivity(aggregateResults, results);

  return aggregatedResult;
};
```

Use `whenAll()` to wait for all parallel tasks to complete. The Durable Task SDK ensures that the tasks can run on multiple machines concurrently, and the execution is resilient to process restarts.

# [Python](#tab/python)

```python
from durabletask import task

def fan_out_fan_in_orchestrator(ctx: task.OrchestrationContext, work_items: list) -> dict:
    """Orchestrator that demonstrates fan-out/fan-in pattern."""

    # Fan-out: Create a task for each work item
    parallel_tasks = []
    for item in work_items:
        parallel_tasks.append(ctx.call_activity(process_work_item, input=item))

    # Wait for all tasks to complete
    results = yield task.when_all(parallel_tasks)

    # Fan-in: Aggregate all the results
    final_result = yield ctx.call_activity(aggregate_results, input=results)

    return final_result
```

Use `task.when_all()` to wait for all parallel tasks to complete. The Durable Task SDK ensures that the tasks can run on multiple machines concurrently, and the execution is resilient to process restarts.

# [PowerShell](#tab/powershell)

This sample is available for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

```java
import com.microsoft.durabletask.*;
import java.util.List;
import java.util.stream.Collectors;

DurableTaskGrpcWorker worker = DurableTaskSchedulerWorkerExtensions.createWorkerBuilder(connectionString)
    .addOrchestration(new TaskOrchestrationFactory() {
        @Override
        public String getName() { return "FanOutFanIn_WordCount"; }

        @Override
        public TaskOrchestration create() {
            return ctx -> {
                List<?> inputs = ctx.getInput(List.class);

                // Fan-out: Create a task for each input item
                List<Task<Integer>> tasks = inputs.stream()
                    .map(input -> ctx.callActivity("CountWords", input.toString(), Integer.class))
                    .collect(Collectors.toList());

                // Wait for all parallel tasks to complete
                List<Integer> allResults = ctx.allOf(tasks).await();

                // Fan-in: Aggregate results
                int totalCount = allResults.stream().mapToInt(Integer::intValue).sum();

                ctx.complete(totalCount);
            };
        }
    })
    .build();
```

Use `ctx.allOf(tasks).await()` to wait for all parallel tasks to complete. The Durable Task SDK ensures that the tasks can run on multiple machines concurrently, and the execution is resilient to process restarts.

---

::: zone-end

## Activities

::: zone pivot="durable-functions"

The helper activity functions are regular functions that use the `activityTrigger` binding.

### E2_GetFileList activity function

# [C#](#tab/csharp)

<details>
<summary><b>Isolated model</b></summary>

```csharp
using System.IO;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace SampleApp;

public static class BackupSiteContent
{
    [Function("E2_GetFileList")]
    public static string[] GetFileList(
        [ActivityTrigger] string rootDirectory,
        FunctionContext executionContext)
    {
        ILogger logger = executionContext.GetLogger("E2_GetFileList");
        logger.LogInformation("Searching for files under '{RootDirectory}'...", rootDirectory);

        string[] files = Directory.GetFiles(rootDirectory, "*", SearchOption.AllDirectories);
        logger.LogInformation("Found {FileCount} file(s) under {RootDirectory}.", files.Length, rootDirectory);

        return files;
    }
}
```

</details>

<br>

<details>
<summary><b>In-process model</b></summary>

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/BackupSiteContent.cs?range=44-54)]

</details>

<br>

# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

The *function.json* file for `E2_GetFileList` looks like the following example:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_GetFileList/function.json":::

Here's the implementation:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_GetFileList/index.js":::

The function uses the `readdirp` module, version `2.x`, to recursively read the directory structure.

</details>

<br>

<details>
<summary><b>V4 programming model</b></summary>

Here's the implementation of the `getFileList` activity function:

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/backupSiteContent.js" range="1,3,7,36-48":::

The function uses the `readdirp` module (version `3.x`) to recursively read the directory structure.

</details>

# [Python](#tab/python)

The *function.json* file for `E2_GetFileList` looks like the following example:

[!code-json[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_GetFileList/function.json)]

Here's the implementation:

[!code-python[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_GetFileList/\_\_init\_\_.py)]

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

> [!NOTE]
> Don't put this code in the orchestrator function. Orchestrator functions shouldn't do I/O, including local file system access. For more information, see [Orchestrator function code constraints](durable-functions-code-constraints.md).

### E2_CopyFileToBlob activity function

# [C#](#tab/csharp)

<details>
<summary><b>Isolated model</b></summary>

> [!NOTE]
> To run the sample code, install the `Azure.Storage.Blobs` NuGet package.

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace SampleApp;

public static class BackupSiteContent
{
    [Function("E2_CopyFileToBlob")]
    public static async Task<long> CopyFileToBlob(
        [ActivityTrigger] string filePath,
        FunctionContext executionContext)
    {
        ILogger logger = executionContext.GetLogger("E2_CopyFileToBlob");
        long byteCount = new FileInfo(filePath).Length;

        string blobPath = filePath
            .Substring(Path.GetPathRoot(filePath)!.Length)
            .Replace('\\', '/');
        string outputLocation = $"backups/{blobPath}";

        string? connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("AzureWebJobsStorage is not configured.");
        }

        BlobContainerClient containerClient = new(connectionString, "backups");
        await containerClient.CreateIfNotExistsAsync();
        BlobClient blobClient = containerClient.GetBlobClient(blobPath);

        logger.LogInformation("Copying '{FilePath}' to '{OutputLocation}'. Total bytes = {ByteCount}.", filePath, outputLocation, byteCount);

        await using Stream source = File.Open(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        await blobClient.UploadAsync(source, overwrite: true);

        return byteCount;
    }
}
```

</details>

<br>

<details>
<summary><b>In-process model</b></summary>

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/BackupSiteContent.cs?range=56-81)]

> [!NOTE]
> The in-process model sample requires the `Microsoft.Azure.WebJobs.Extensions.Storage` NuGet package and uses Azure Functions binding features like the [`Binder` parameter](../functions-dotnet-class-library.md#binding-at-runtime).

</details>

<br>

# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

The *function.json* file for `E2_CopyFileToBlob` is similarly simple:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_CopyFileToBlob/function.json":::

The JavaScript implementation uses the [Azure Storage SDK for Node](https://github.com/Azure/azure-storage-node) to upload the files to Azure Blob Storage.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_CopyFileToBlob/index.js":::

</details>

<br>

<details>
<summary><b>V4 programming model</b></summary>

The JavaScript implementation of `copyFileToBlob` uses an Azure Storage output binding to upload the files to Azure Blob Storage.

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/backupSiteContent.js" range="1-2,5-6,8-9,50-68":::

</details>

# [Python](#tab/python)

The *function.json* file for `E2_CopyFileToBlob` is similarly simple:

[!code-json[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_CopyFileToBlob/function.json)]

The Python implementation uses the [Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python) to upload the files to Azure Blob Storage.

[!code-python[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_CopyFileToBlob/\_\_init\_\_.py)]

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

The implementation loads the file from disk and asynchronously streams the contents into a blob of the same name in the `backups` container. The function returns the number of bytes copied to storage. The orchestrator uses that value to compute the aggregate sum.

> [!NOTE]
> This example moves I/O operations into an `activityTrigger` function. The work can run across multiple machines and supports progress checkpointing. If the host process ends, you know which uploads are complete.

::: zone-end

::: zone pivot="durable-task-sdks"

Activities do the work. Unlike orchestrators, activities can perform I/O operations and nondeterministic logic.

### Process work item activity

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

[DurableTask]
public class ProcessWorkItemActivity : TaskActivity<string, Dictionary<string, int>>
{
    private readonly ILogger<ProcessWorkItemActivity> _logger;

    public ProcessWorkItemActivity(ILogger<ProcessWorkItemActivity> logger)
    {
        _logger = logger;
    }

    public override Task<Dictionary<string, int>> RunAsync(TaskActivityContext context, string workItem)
    {
        _logger.LogInformation("Processing work item: {WorkItem}", workItem);

        // Process the work item (this is where you do the actual work)
        var result = new Dictionary<string, int>
        {
            { workItem, workItem.Length }
        };

        return Task.FromResult(result);
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext } from "@microsoft/durabletask-js";

const processWorkItem = async (
  _ctx: ActivityContext,
  item: string
): Promise<number> => {
  console.log(`Processing work item: "${item}"`);
  return item.length;
};
```

Unlike orchestrators, activities can perform I/O operations like HTTP calls, database queries, and file access.

# [Python](#tab/python)

```python
from durabletask import task

def process_work_item(ctx: task.ActivityContext, item: int) -> dict:
    """Activity that processes a single work item."""
    # Process the work item (this is where you do the actual work)
    result = item * item
    return {"item": item, "result": result}
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

```java
import java.util.StringTokenizer;

// Activity registration
.addActivity(new TaskActivityFactory() {
    @Override
    public String getName() { return "CountWords"; }

    @Override
    public TaskActivity create() {
        return ctx -> {
            String input = ctx.getInput(String.class);
            StringTokenizer tokenizer = new StringTokenizer(input);
            return tokenizer.countTokens();
        };
    }
})
```

---

### Aggregate results activity

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

[DurableTask]
public class AggregateResultsActivity : TaskActivity<Dictionary<string, int>[], Dictionary<string, int>>
{
    private readonly ILogger<AggregateResultsActivity> _logger;

    public AggregateResultsActivity(ILogger<AggregateResultsActivity> logger)
    {
        _logger = logger;
    }

    public override Task<Dictionary<string, int>> RunAsync(
        TaskActivityContext context, Dictionary<string, int>[] results)
    {
        _logger.LogInformation("Aggregating {Count} results", results.Length);

        // Combine all results into one aggregated result
        var aggregatedResult = new Dictionary<string, int>();

        foreach (var result in results)
        {
            foreach (var kvp in result)
            {
                aggregatedResult[kvp.Key] = kvp.Value;
            }
        }

        return Task.FromResult(aggregatedResult);
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext } from "@microsoft/durabletask-js";

const aggregateResults = async (
  _ctx: ActivityContext,
  results: number[]
): Promise<object> => {
  const total = results.reduce((sum, val) => sum + val, 0);
  return {
    totalItems: results.length,
    sum: total,
    average: results.length > 0 ? total / results.length : 0,
  };
};
```

Unlike orchestrators, activities can perform I/O operations like HTTP calls, database queries, and file access.

# [Python](#tab/python)

```python
from durabletask import task

def aggregate_results(ctx: task.ActivityContext, results: list) -> dict:
    """Activity that aggregates results from multiple work items."""
    sum_result = sum(item["result"] for item in results)
    return {
        "total_items": len(results),
        "sum": sum_result,
        "average": sum_result / len(results) if results else 0
    }
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

In the Java sample, the orchestrator aggregates results after `ctx.allOf(tasks).await()` returns.

---

::: zone-end

## Run the sample

::: zone pivot="durable-functions"

Start the orchestration on Windows by sending the following HTTP POST request:

```
POST http://{host}/orchestrators/E2_BackupSiteContent
Content-Type: application/json
Content-Length: 20

"D:\\home\\LogFiles"
```

Alternatively, on a Linux function app, start the orchestration by sending the following HTTP POST request. Python currently runs on Linux for App Service:

```
POST http://{host}/orchestrators/E2_BackupSiteContent
Content-Type: application/json
Content-Length: 20

"/home/site/wwwroot"
```

> [!NOTE]
> The `HttpStart` function expects JSON. Include the `Content-Type: application/json` header, and encode the directory path as a JSON string. The HTTP snippet assumes *host.json* has an entry that removes the default `api/` prefix from all HTTP trigger function URLs. Find the markup for this configuration in the sample *host.json* file.

This HTTP request triggers the `E2_BackupSiteContent` orchestrator and passes the string `D:\home\LogFiles` as a parameter. The response has a link to check the status of the backup operation:

```
HTTP/1.1 202 Accepted
Content-Length: 719
Content-Type: application/json; charset=utf-8
Location: http://{host}/runtime/webhooks/durabletask/instances/b4e9bdcc435d460f8dc008115ff0a8a9?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

(...trimmed...)
```

Depending on the number of log files in your function app, this operation can take several minutes to finish. Get the latest status by querying the URL in the `Location` header of the previous HTTP 202 response:

```
GET http://{host}/runtime/webhooks/durabletask/instances/b4e9bdcc435d460f8dc008115ff0a8a9?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
```

```
HTTP/1.1 202 Accepted
Content-Length: 148
Content-Type: application/json; charset=utf-8
Location: http://{host}/runtime/webhooks/durabletask/instances/b4e9bdcc435d460f8dc008115ff0a8a9?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

{"runtimeStatus":"Running","input":"D:\\home\\LogFiles","output":null,"createdTime":"2019-06-29T18:50:55Z","lastUpdatedTime":"2019-06-29T18:51:16Z"}
```

In this case, the function is still running. The response shows the input saved in the orchestrator state and the last updated time. Use the `Location` header value to poll for completion. When the status is "Completed", the response resembles the following example:

```
HTTP/1.1 200 OK
Content-Length: 152
Content-Type: application/json; charset=utf-8

{"runtimeStatus":"Completed","input":"D:\\home\\LogFiles","output":452071,"createdTime":"2019-06-29T18:50:55Z","lastUpdatedTime":"2019-06-29T18:51:26Z"}
```

The response shows that the orchestration is complete and the approximate time to finish. The `output` field indicates that the orchestration uploaded about 450 KB of logs.

::: zone-end

::: zone pivot="durable-task-sdks"

To run the example:

1. **Start the Durable Task Scheduler emulator** for local development.

   ```bash
   docker run -d -p 8080:8080 -p 8082:8082 --name dts-emulator mcr.microsoft.com/dts/dts-emulator:latest
   ```

1. **Start the worker** to register the orchestrator and activities.

1. **Run the client** to schedule an orchestration with a list of work items:

# [C#](#tab/csharp)

```csharp
// Schedule the orchestration with a list of work items
var workItems = new List<string> { "item1", "item2", "item3", "item4", "item5" };
string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
    nameof(ParallelProcessingOrchestration), workItems);

// Wait for completion
var result = await client.WaitForInstanceCompletionAsync(instanceId, getInputsAndOutputs: true);
Console.WriteLine($"Result: {result.ReadOutputAs<Dictionary<string, int>>().Count} items processed");
```

# [JavaScript](#tab/javascript)

```typescript
import {
  DurableTaskAzureManagedClientBuilder,
} from "@microsoft/durabletask-js-azuremanaged";

const connectionString =
  process.env.DURABLE_TASK_SCHEDULER_CONNECTION_STRING ||
  "Endpoint=http://localhost:8080;Authentication=None;TaskHub=default";

const client = new DurableTaskAzureManagedClientBuilder()
  .connectionString(connectionString)
  .build();

const workItems = ["item1", "item2", "item3", "item4", "item5"];
const instanceId = await client.scheduleNewOrchestration(fanOutFanInOrchestrator, workItems);
const state = await client.waitForOrchestrationCompletion(instanceId, true, 30);
console.log(`Result: ${state?.serializedOutput}`);
```

Create the `DurableTaskAzureManagedClientBuilder` by using a connection string to the Durable Task Scheduler. Use `scheduleNewOrchestration` to start an orchestration, and use `waitForOrchestrationCompletion` to wait for completion.

# [Python](#tab/python)

```python
# Schedule the orchestration with a list of work items
work_items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
instance_id = client.schedule_new_orchestration(fan_out_fan_in_orchestrator, input=work_items)

# Wait for completion
result = client.wait_for_orchestration_completion(instance_id, timeout=60)
print(f"Result: {result.serialized_output}")
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

```java
import java.time.Duration;
import java.util.Arrays;
import java.util.List;

// Schedule the orchestration with a list of strings
List<String> sentences = Arrays.asList(
    "Hello, world!",
    "The quick brown fox jumps over the lazy dog.",
    "Always remember that you are absolutely unique.");

String instanceId = client.scheduleNewOrchestrationInstance(
    "FanOutFanIn_WordCount",
    new NewOrchestrationInstanceOptions().setInput(sentences));

// Wait for completion
OrchestrationMetadata result = client.waitForInstanceCompletion(instanceId, Duration.ofSeconds(30), true);
System.out.println("Total word count: " + result.readOutputAs(int.class));
```

---

::: zone-end

## Next steps

::: zone pivot="durable-functions"

This sample shows the fan-out/fan-in pattern. The next sample shows how to implement the monitor pattern with [durable timers](durable-functions-timers.md).

> [!div class="nextstepaction"]
> [Run the monitor sample](durable-functions-monitor.md)

::: zone-end

::: zone pivot="durable-task-sdks"

This article demonstrates the fan-out/fan-in pattern. Explore more patterns and features:

> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](durable-task-scheduler/quickstart-portable-durable-task-sdks.md)

For JavaScript SDK examples, see the [Durable Task JavaScript SDK samples](https://github.com/microsoft/durabletask-js/tree/main/examples/azure-managed).

::: zone-end
