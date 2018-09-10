---
title: Fan-out/fan-in scenarios in Durable Functions - Azure
description: Learn how to implement a fan-out-fan-in scenario in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 03/19/2018
ms.author: azfuncdf
---

# Fan-out/fan-in scenario in Durable Functions - Cloud backup example

*Fan-out/fan-in* refers to the pattern of executing multiple functions concurrently and then performing some aggregation on the results. This article explains a sample that uses [Durable Functions](durable-functions-overview.md) to implement a fan-in/fan-out scenario. The sample is a durable function that backs up all or some of an app's site content into Azure Storage.

## Prerequisites

* [Install Durable Functions](durable-functions-install.md).
* Complete the [Hello Sequence](durable-functions-sequence.md) walkthrough.

## Scenario overview

In this sample, the functions upload all files under a specified directory recursively into blob storage. They also count the total number of bytes that were uploaded.

It's possible to write a single function that takes care of everything. The main problem you would run into is **scalability**. A single function execution can only run on a single VM, so the throughput will be limited by the throughput of that single VM. Another problem is **reliability**. If there's a failure midway through, or if the entire process takes more than 5 minutes, the backup could fail in a partially-completed state. It would then need to be restarted.

A more robust approach would be to write two regular functions: one would enumerate the files and add the file names to a queue, and another would read from the queue and upload the files to blob storage. This is better in terms of throughput and reliability, but it requires you to provision and manage a queue. More importantly, significant complexity is introduced in terms of **state management** and **coordination** if you want to do anything more, like report the total number of bytes uploaded.

A Durable Functions approach gives you all of the mentioned benefits with very low overhead.

## The functions

This article explains the following functions in the sample app:

* `E2_BackupSiteContent`
* `E2_GetFileList`
* `E2_CopyFileToBlob`

The following sections explain the configuration and code that are used for C# scripting. The code for Visual Studio development is shown at the end of the article.

## The cloud backup orchestration (Visual Studio Code and Azure portal sample code)

The `E2_BackupSiteContent` function uses the standard *function.json* for orchestrator functions.

[!code-json[Main](~/samples-durable-functions/samples/csx/E2_BackupSiteContent/function.json)]

Here is the code that implements the orchestrator function:

### C#

[!code-csharp[Main](~/samples-durable-functions/samples/csx/E2_BackupSiteContent/run.csx)]

### JavaScript (Functions v2 only)

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/E2_BackupSiteContent/index.js)]

This orchestrator function essentially does the following:

1. Takes a `rootDirectory` value as an input parameter.
2. Calls a function to get a recursive list of files under `rootDirectory`.
3. Makes multiple parallel function calls to upload each file into Azure Blob Storage.
4. Waits for all uploads to complete.
5. Returns the sum total bytes that were uploaded to Azure Blob Storage.

Notice the `await Task.WhenAll(tasks);` (C#) and `yield context.df.Task.all(tasks);` (JS) line. All the calls to the `E2_CopyFileToBlob` function were *not* awaited. This is intentional to allow them to run in parallel. When we pass this array of tasks to `Task.WhenAll`, we get back a task that won't complete *until all the copy operations have completed*. If you're familiar with the Task Parallel Library (TPL) in .NET, then this is not new to you. The difference is that these tasks could be running on multiple VMs concurrently, and the Durable Functions extension ensures that the end-to-end execution is resilient to process recycling.

Tasks are very similar to the JavaScript concept of promises. However, `Promise.all` has some differences from `Task.WhenAll`. The concept of `Task.WhenAll` has been ported over as part of the `durable-functions` JavaScript module and is exclusive to it.

After awaiting from `Task.WhenAll` (or yielding from `context.df.Task.all`), we know that all function calls have completed and have returned values back to us. Each call to `E2_CopyFileToBlob` returns the number of bytes uploaded, so calculating the sum total byte count is a matter of adding all those return values together.

## Helper activity functions

The helper activity functions, as with other samples, are just regular functions that use the `activityTrigger` trigger binding. For example, the *function.json* file for `E2_GetFileList` looks like the following:

[!code-json[Main](~/samples-durable-functions/samples/csx/E2_GetFileList/function.json)]

And here is the implementation:

### C#

[!code-csharp[Main](~/samples-durable-functions/samples/csx/E2_GetFileList/run.csx)]

### JavaScript (Functions v2 only)

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/E2_GetFileList/index.js)]

The JavaScript implementation of `E2_GetFileList` uses the `readdirp` module to recursively read the directory structure.

> [!NOTE]
> You might be wondering why you couldn't just put this code directly into the orchestrator function. You could, but this would break one of the fundamental rules of orchestrator functions, which is that they should never do I/O, including local file system access.

The *function.json* file for `E2_CopyFileToBlob` is similarly simple:

[!code-json[Main](~/samples-durable-functions/samples/csx/E2_CopyFileToBlob/function.json)]

The C# implementation is also pretty straightforward. It happens to use some advanced features of Azure Functions bindings (that is, the use of the `Binder` parameter), but you don't need to worry about those details for the purpose of this walkthrough.

### C#

[!code-csharp[Main](~/samples-durable-functions/samples/csx/E2_CopyFileToBlob/run.csx)]

### JavaScript (Functions v2 only)

The JavaScript implementation does not have access to the `Binder` feature of Azure Functions, so the [Azure Storage SDK for Node](https://github.com/Azure/azure-storage-node) takes its place. Note that the SDK requires an `AZURE_STORAGE_CONNECTION_STRING` app setting.

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/E2_CopyFileToBlob/index.js)]

The implementation loads the file from disk and asynchronously streams the contents into a blob of the same name in the "backups" container. The return value is the number of bytes copied to storage, that is then used by the orchestrator function to compute the aggregate sum.

> [!NOTE]
> This is a perfect example of moving I/O operations into an `activityTrigger` function. Not only can the work be distributed across many different VMs, but you also get the benefits of checkpointing the progress. If the host process gets terminated for any reason, you know which uploads have already completed.

## Run the sample

You can start the orchestration by sending the following HTTP POST request.

```
POST http://{host}/orchestrators/E2_BackupSiteContent
Content-Type: application/json
Content-Length: 20

"D:\\home\\LogFiles"
```

> [!NOTE]
> The `HttpStart` function that you are invoking only works with JSON-formatted content. For this reason, the `Content-Type: application/json` header is required and the directory path is encoded as a JSON string.

This HTTP request triggers the `E2_BackupSiteContent` orchestrator and passes the string `D:\home\LogFiles` as a parameter. The response provides a link to get the status of the backup operation:

```
HTTP/1.1 202 Accepted
Content-Length: 719
Content-Type: application/json; charset=utf-8
Location: http://{host}/admin/extensions/DurableTaskExtension/instances/b4e9bdcc435d460f8dc008115ff0a8a9?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

(...trimmed...)
```

Depending on how many log files you have in your function app, this operation could take several minutes to complete. You can get the latest status by querying the URL in the `Location` header of the previous HTTP 202 response.

```
GET http://{host}/admin/extensions/DurableTaskExtension/instances/b4e9bdcc435d460f8dc008115ff0a8a9?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
```

```
HTTP/1.1 202 Accepted
Content-Length: 148
Content-Type: application/json; charset=utf-8
Location: http://{host}/admin/extensions/DurableTaskExtension/instances/b4e9bdcc435d460f8dc008115ff0a8a9?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

{"runtimeStatus":"Running","input":"D:\\home\\LogFiles","output":null,"createdTime":"2017-06-29T18:50:55Z","lastUpdatedTime":"2017-06-29T18:51:16Z"}
```

In this case, the function is still running. You are able to see the input that was saved into the orchestrator state and the last updated time. You can continue to use the `Location` header values to poll for completion. When the status is "Completed", you see an HTTP response value similar to the following:

```
HTTP/1.1 200 OK
Content-Length: 152
Content-Type: application/json; charset=utf-8

{"runtimeStatus":"Completed","input":"D:\\home\\LogFiles","output":452071,"createdTime":"2017-06-29T18:50:55Z","lastUpdatedTime":"2017-06-29T18:51:26Z"}
```

Now you can see that the orchestration is complete and approximately how much time it took to complete. You also see a value for the `output` field, which indicates that around 450 KB of logs were uploaded.

## Visual Studio sample code

Here is the orchestration as a single C# file in a Visual Studio project:

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/BackupSiteContent.cs)]

## Next steps

This sample has shown how to implement the fan-out/fan-in pattern. The next sample shows how to implement the monitor pattern using [durable timers](durable-functions-timers.md).

> [!div class="nextstepaction"]
> [Run the monitor sample](durable-functions-monitor.md)
