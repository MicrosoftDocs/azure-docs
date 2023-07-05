---
title: Fan-out/fan-in scenarios in Durable Functions - Azure
description: Learn how to implement a fan-out-fan-in scenario in the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.custom: devx-track-js
ms.date: 02/14/2023
ms.author: azfuncdf
---

# Fan-out/fan-in scenario in Durable Functions - Cloud backup example

*Fan-out/fan-in* refers to the pattern of executing multiple functions concurrently and then performing some aggregation on the results. This article explains a sample that uses [Durable Functions](durable-functions-overview.md) to implement a fan-in/fan-out scenario. The sample is a durable function that backs up all or some of an app's site content into Azure Storage.

[!INCLUDE [functions-nodejs-durable-model-description](../../../includes/functions-nodejs-durable-model-description.md)]

[!INCLUDE [durable-functions-prerequisites](../../../includes/durable-functions-prerequisites.md)]

## Scenario overview

In this sample, the functions upload all files under a specified directory recursively into blob storage. They also count the total number of bytes that were uploaded.

It's possible to write a single function that takes care of everything. The main problem you would run into is **scalability**. A single function execution can only run on a single virtual machine, so the throughput will be limited by the throughput of that single VM. Another problem is **reliability**. If there's a failure midway through, or if the entire process takes more than 5 minutes, the backup could fail in a partially completed state. It would then need to be restarted.

A more robust approach would be to write two regular functions: one would enumerate the files and add the file names to a queue, and another would read from the queue and upload the files to blob storage. This approach is better in terms of throughput and reliability, but it requires you to provision and manage a queue. More importantly, significant complexity is introduced in terms of **state management** and **coordination** if you want to do anything more, like report the total number of bytes uploaded.

A Durable Functions approach gives you all of the mentioned benefits with very low overhead.

## The functions

This article explains the following functions in the sample app:

* `E2_BackupSiteContent`: An [orchestrator function](durable-functions-bindings.md#orchestration-trigger) that calls `E2_GetFileList` to obtain a list of files to back up, then calls `E2_CopyFileToBlob` to back up each file.
* `E2_GetFileList`: An [activity function](durable-functions-bindings.md#activity-trigger) that returns a list of files in a directory.
* `E2_CopyFileToBlob`: An activity function that backs up a single file to Azure Blob Storage.

### E2_BackupSiteContent orchestrator function

This orchestrator function essentially does the following:

1. Takes a `rootDirectory` value as an input parameter.
2. Calls a function to get a recursive list of files under `rootDirectory`.
3. Makes multiple parallel function calls to upload each file into Azure Blob Storage.
4. Waits for all uploads to complete.
5. Returns the sum total bytes that were uploaded to Azure Blob Storage.

# [C#](#tab/csharp)

Here is the code that implements the orchestrator function:

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/BackupSiteContent.cs?range=16-42)]

Notice the `await Task.WhenAll(tasks);` line. All the individual calls to the `E2_CopyFileToBlob` function were *not* awaited, which allows them to run in parallel. When we pass this array of tasks to `Task.WhenAll`, we get back a task that won't complete *until all the copy operations have completed*. If you're familiar with the Task Parallel Library (TPL) in .NET, then this is not new to you. The difference is that these tasks could be running on multiple virtual machines concurrently, and the Durable Functions extension ensures that the end-to-end execution is resilient to process recycling.

After awaiting from `Task.WhenAll`, we know that all function calls have completed and have returned values back to us. Each call to `E2_CopyFileToBlob` returns the number of bytes uploaded, so calculating the sum total byte count is a matter of adding all those return values together.

# [JavaScript (PM3)](#tab/javascript-v3)

The function uses the standard *function.json* for orchestrator functions.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_BackupSiteContent/function.json":::

Here is the code that implements the orchestrator function:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_BackupSiteContent/index.js":::

Notice the `yield context.df.Task.all(tasks);` line. All the individual calls to the `E2_CopyFileToBlob` function were *not* yielded, which allows them to run in parallel. When we pass this array of tasks to `context.df.Task.all`, we get back a task that won't complete *until all the copy operations have completed*. If you're familiar with [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) in JavaScript, then this is not new to you. The difference is that these tasks could be running on multiple virtual machines concurrently, and the Durable Functions extension ensures that the end-to-end execution is resilient to process recycling.

> [!NOTE]
> Although tasks are conceptually similar to JavaScript promises, orchestrator functions should use `context.df.Task.all` and `context.df.Task.any` instead of `Promise.all` and `Promise.race` to manage task parallelization.

After yielding from `context.df.Task.all`, we know that all function calls have completed and have returned values back to us. Each call to `E2_CopyFileToBlob` returns the number of bytes uploaded, so calculating the sum total byte count is a matter of adding all those return values together.

# [JavaScript (PM4)](#tab/javascript-v4)

Here is the code that implements the orchestrator function:

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/backupSiteContent.js" range="1,4,7-35":::

Notice the `yield context.df.Task.all(tasks);` line. All the individual calls to the `copyFileToBlob` function were *not* yielded, which allows them to run in parallel. When we pass this array of tasks to `context.df.Task.all`, we get back a task that won't complete *until all the copy operations have completed*. If you're familiar with [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) in JavaScript, then this is not new to you. The difference is that these tasks could be running on multiple virtual machines concurrently, and the Durable Functions extension ensures that the end-to-end execution is resilient to process recycling.

> [!NOTE]
> Although Tasks are conceptually similar to JavaScript promises, orchestrator functions should use `context.df.Task.all` and `context.df.Task.any` instead of `Promise.all` and `Promise.race` to manage task parallelization.

After yielding from `context.df.Task.all`, we know that all function calls have completed and have returned values back to us. Each call to `copyFileToBlob` returns the number of bytes uploaded, so calculating the sum total byte count is a matter of adding all those return values together.

# [Python](#tab/python)

The function uses the standard *function.json* for orchestrator functions.

[!code-json[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_BackupSiteContent/function.json)]

Here is the code that implements the orchestrator function:

[!code-python[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_BackupSiteContent/\_\_init\_\_.py)]

Notice the `yield context.task_all(tasks);` line. All the individual calls to the `E2_CopyFileToBlob` function were *not* yielded, which allows them to run in parallel. When we pass this array of tasks to `context.task_all`, we get back a task that won't complete *until all the copy operations have completed*. If you're familiar with [`asyncio.gather`](https://docs.python.org/3/library/asyncio-task.html#asyncio.gather) in Python, then this is not new to you. The difference is that these tasks could be running on multiple virtual machines concurrently, and the Durable Functions extension ensures that the end-to-end execution is resilient to process recycling.

> [!NOTE]
> Although tasks are conceptually similar to Python awaitables, orchestrator functions should use `yield` as well as the `context.task_all` and `context.task_any` APIs to manage task parallelization.

After yielding from `context.task_all`, we know that all function calls have completed and have returned values back to us. Each call to `E2_CopyFileToBlob` returns the number of bytes uploaded, so we can calculate the sum total byte count by adding all the return values together.

---

### Helper activity functions

The helper activity functions, as with other samples, are just regular functions that use the `activityTrigger` trigger binding.

#### E2_GetFileList activity function

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/BackupSiteContent.cs?range=44-54)]

# [JavaScript (PM3)](#tab/javascript-v3)

The *function.json* file for `E2_GetFileList` looks like the following:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_GetFileList/function.json":::

And here is the implementation:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_GetFileList/index.js":::

The function uses the `readdirp` module (version 2.x) to recursively read the directory structure.

# [JavaScript (PM4)](#tab/javascript-v4)

Here is the implementation of the `getFileList` activity function:

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/backupSiteContent.js" range="1,3,7,36-48":::

The function uses the `readdirp` module (version `3.x`) to recursively read the directory structure.

# [Python](#tab/python)

The *function.json* file for `E2_GetFileList` looks like the following:

[!code-json[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_GetFileList/function.json)]

And here is the implementation:

[!code-python[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_GetFileList/\_\_init\_\_.py)]

---

> [!NOTE]
> You might be wondering why you couldn't just put this code directly into the orchestrator function. You could, but this would break one of the fundamental rules of orchestrator functions, which is that they should never do I/O, including local file system access. For more information, see [Orchestrator function code constraints](durable-functions-code-constraints.md).

#### E2_CopyFileToBlob activity function

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/BackupSiteContent.cs?range=56-81)]

> [!NOTE]
> You will need to install the `Microsoft.Azure.WebJobs.Extensions.Storage` NuGet package to run the sample code.

The function uses some advanced features of Azure Functions bindings (that is, the use of the [`Binder` parameter](../functions-dotnet-class-library.md#binding-at-runtime)), but you don't need to worry about those details for the purpose of this walkthrough.

# [JavaScript (PM3)](#tab/javascript-v3)

The *function.json* file for `E2_CopyFileToBlob` is similarly simple:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_CopyFileToBlob/function.json":::

The JavaScript implementation uses the [Azure Storage SDK for Node](https://github.com/Azure/azure-storage-node) to upload the files to Azure Blob Storage.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E2_CopyFileToBlob/index.js":::

# [JavaScript (PM4)](#tab/javascript-v4)

The JavaScript implementation of `copyFileToBlob` uses an Azure Storage output binding to upload the files to Azure Blob storage.

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/backupSiteContent.js" range="1-2,5-6,8-9,50-68":::

# [Python](#tab/python)

The *function.json* file for `E2_CopyFileToBlob` is similarly simple:

[!code-json[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_CopyFileToBlob/function.json)]

The Python implementation uses the [Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python) to upload the files to Azure Blob Storage.

[!code-python[Main](~/samples-durable-functions-python/samples/fan_in_fan_out/E2_CopyFileToBlob/\_\_init\_\_.py)]

---

The implementation loads the file from disk and asynchronously streams the contents into a blob of the same name in the "backups" container. The return value is the number of bytes copied to storage, that is then used by the orchestrator function to compute the aggregate sum.

> [!NOTE]
> This is a perfect example of moving I/O operations into an `activityTrigger` function. Not only can the work be distributed across many different machines, but you also get the benefits of checkpointing the progress. If the host process gets terminated for any reason, you know which uploads have already completed.

## Run the sample

You can start the orchestration, on Windows, by sending the following HTTP POST request.

```
POST http://{host}/orchestrators/E2_BackupSiteContent
Content-Type: application/json
Content-Length: 20

"D:\\home\\LogFiles"
```

Alternatively, on a Linux Function App (Python currently only runs on Linux for App Service), you can start the orchestration like so:

```
POST http://{host}/orchestrators/E2_BackupSiteContent
Content-Type: application/json
Content-Length: 20

"/home/site/wwwroot"
```

> [!NOTE]
> The `HttpStart` function that you are invoking only works with JSON-formatted content. For this reason, the `Content-Type: application/json` header is required and the directory path is encoded as a JSON string. Moreover, HTTP snippet assumes there is an entry in the `host.json` file which removes the default `api/` prefix from all HTTP trigger functions URLs. You can find the markup for this configuration in the `host.json` file in the samples.

This HTTP request triggers the `E2_BackupSiteContent` orchestrator and passes the string `D:\home\LogFiles` as a parameter. The response provides a link to get the status of the backup operation:

```
HTTP/1.1 202 Accepted
Content-Length: 719
Content-Type: application/json; charset=utf-8
Location: http://{host}/runtime/webhooks/durabletask/instances/b4e9bdcc435d460f8dc008115ff0a8a9?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

(...trimmed...)
```

Depending on how many log files you have in your function app, this operation could take several minutes to complete. You can get the latest status by querying the URL in the `Location` header of the previous HTTP 202 response.

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

In this case, the function is still running. You are able to see the input that was saved into the orchestrator state and the last updated time. You can continue to use the `Location` header values to poll for completion. When the status is "Completed", you see an HTTP response value similar to the following:

```
HTTP/1.1 200 OK
Content-Length: 152
Content-Type: application/json; charset=utf-8

{"runtimeStatus":"Completed","input":"D:\\home\\LogFiles","output":452071,"createdTime":"2019-06-29T18:50:55Z","lastUpdatedTime":"2019-06-29T18:51:26Z"}
```

Now you can see that the orchestration is complete and approximately how much time it took to complete. You also see a value for the `output` field, which indicates that around 450 KB of logs were uploaded.

## Next steps

This sample has shown how to implement the fan-out/fan-in pattern. The next sample shows how to implement the monitor pattern using [durable timers](durable-functions-timers.md).

> [!div class="nextstepaction"]
> [Run the monitor sample](durable-functions-monitor.md)
