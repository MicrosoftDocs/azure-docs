---
title: Fan-out-fan-in scenarios in Durable Functions for Azure Functions
description: Learn how to implement a fan-out-fan-in scenario in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/29/2017
ms.author: cgillum
---

# Handling fan-out-fan-in scenarios in Durable Functions - Cloud Backup example
Fan-in/fan-out is a more advanced use-case which demonstrates how to write an orchestrator function that calls multiple functions concurrently and then performs some aggregation on the results. In particular, this sample demonstrates how the pattern can be used to create a durable function that backs up all or some of an app's site content into Azure Storage.

## Before you begin
If you haven't done so already, make sure to read the [overview](~/articles/overview.md) before jumping into samples. It will really help ensure everything you read below makes sense.

All samples are combined into a single function app package. To get started with the samples, follow the setup steps below that are relevant for your development environment:

### For Visual Studio Development (Windows Only)
1. Download the [VSDFSampleApp.zip](~/files/VSDFSampleApp.zip) package, unzip the contents, and open in Visual Studio 2017 (version 15.3).
2. Install and run the [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/storage-use-emulator). Alternatively, you can update the `local.appsettings.json` file with real Azure Storage connection strings.
3. The sample can now be run locally via F5. It can also be published directly to Azure and run in the cloud.

### For Azure Portal Development
1. Create a new function app at https://functions.azure.com/signin.
2. Follow the [installation instructions](~/articles/installation.md) to configure Durable Functions for portal development.
3. Download the [DFSampleApp.zip](~/files/DFSampleApp.zip) package.
4. Unzip the sample package file into `D:\home\site\wwwroot` using Kudu or FTP.

The code snippets and binding references below are specific to the portal experience, but have a direct mapping to the equivalent Visual Studio development experience.

This article will specifically walk through the following functions in the sample app:

* **E2_BackupSiteContent**
* **E2_GetFileList**
* **E2_CopyFileToBlob**

> [!NOTE]
> This walkthrough assumes you have already gone through the [Hello Sequence](./sequence.md) sample walkthrough. If you haven't done so already, it is recommended to first go through that walkthrough before starting this one.

## Scenario overview
In this sample, we write a function which uploads all files under a specified directory recursively into blob storage. We also count the total number of bytes that were uploaded to blob storage as part of the process.

The naive way to implement this solution is to write a single function to take care of everything. The main problem you'll run into is **scalability**. A single function execution can only run on a single VM, so the throughput will be limited by the throughput of that single VM. Another problem is **reliability**. If there is a failure midway through, or if the entire process takes more than 5 minutes, then the backup will fail in a partial state and needs to be restarted.

A more robust approach would be to write two regular functions: one which enumerates the files and adds the file names to a queue, and another function which reads from the queue and uploads the files to blob storage. This is better in terms of throughput and reliability, but requires you to provision and manage a queue. More importantly, significant complexity is introduced in terms of **state management** and **coordination** if you want to do anything more, like report the total number of bytes uploaded.

A Durable Functions approach gives you all of the mentioned benefits with very low overhead.

## The cloud backup orchestration
The **E2_BackupSiteContent** function uses the standard function.json for orchestrator functions.

[!code-json[Main](~/../samples/csx/E2_BackupSiteContent/function.json)]

Here is the code which implements the orchestrator function:

[!code-csharp[Main](~/../samples/csx/E2_BackupSiteContent/run.csx)]

This orchestrator function essentially does the following:

1. Takes a `rootDirectory` value as an input parameter.
2. Calls a function to get a recursive list of files under `rootDirectory`.
3. Makes multiple parallel function calls to upload each file into Azure Blob Storage.
4. Waits for all uploads to complete.
5. Returns the sum total bytes that were uploaded to Azure Blob Storage.

The most interesting part of this function is the `await Task.WhenAll(tasks);` line. You may have noticed that all the calls to the **E2_CopyFileToBlob** function were *not* awaited. This is intentional to allow them to run in parallel. When we pass this array of tasks to `Task.WhenAll`, we get back a task which won't complete *until all the copy operations have completed*. If you're familiar with the Task Parallel Library (TPL) in .NET, then this is not new to you. The difference is that these tasks could be running on multiple VMs concurrently, and the extension ensures that the end-to-end execution is resilient to process recycling.

After awaiting from `Task.WhenAll`, we know that all function calls have completed and have returned values back to us. In this case, each call to **E2_CopyFileToBlob** will return the number of bytes uploaded, so calculating the sum total byte count is a matter of adding all those return values together.

## Helper activity functions
The helper activity functions, just as with other samples, are just regular functions that use the `activityTrigger` trigger binding. For example, the **function.json** file for **E2_GetFileList** looks like the following:

[!code-json[Main](~/../samples/csx/E2_GetFileList/function.json)]

And here is the implementation:

[!code-csharp[Main](~/../samples/csx/E2_GetFileList/run.csx)]

> [!NOTE]
> You might be wondering why we couldn't just put this code directly into the orchestrator function. We could, but this would break one of the fundamental rules of orchestrator functions, which is that they should never do I/O, including local file system access.

The function.json for **E2_CopyFileToBlob** is similarly very simple:

[!code-json[Main](~/../samples/csx/E2_CopyFileToBlob/function.json)]

The implementation is also pretty straight forward. It happens to use some advanced features of Azure Functions bindings (i.e. the use of the `Binder` parameter), but you don't need to worry about those details for the purpose of this walkthrough.

[!code-csharp[Main](~/../samples/csx/E2_CopyFileToBlob/run.csx)]

The implementation loads the file from disk and asynchronously streams the contents into a blob of the same name. The return value is the number of bytes copied to storage, which is then used by the orchestrator function to compute the aggregate sum.

> [!NOTE]
> This is a perfect example of moving I/O operations into an `activityTrigger` function. Not only can the work be distributed across many different VMs, but we also get the benefits of checkpointing the progress, meaning we're able to automatically keep track of which uploads have already completed if the host process gets terminated for any reason.

## Running the sample
Using the HTTP-triggered functions included in the sample, you can start the orchestration using the below HTTP POST request.

```plaintext
POST http://{host}/orchestrators/E2_BackupSiteContent HTTP/1.1
Content-Type: application/json
Content-Length: 20

"D:\\home\\LogFiles"
```

> [!NOTE]
> The **HttpStart** function which you are invoking only works with JSON-formatted content. For this reason, the `Content-Type: application/json` header is required and the directory path is encoded as a JSON string.

This will trigger the **E2_BackupSiteContent** orchestrator and pass the string `D:\home\LogFiles` as a parameter. The response will provide a link to get the status of this backup operation:

```plaintext
HTTP/1.1 202 Accepted
Content-Length: 719
Content-Type: application/json; charset=utf-8
Location: http://{host}/admin/extensions/DurableTaskExtension/instances/b4e9bdcc435d460f8dc008115ff0a8a9?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

(...trimmed...)
```

Depending on how many log files you have in your function app, this operation could take several minutes to complete. You can get the latest status by querying the URL in the `Location` header of the previous HTTP 202 response.

```plaintext
GET http://{host}/admin/extensions/DurableTaskExtension/instances/b4e9bdcc435d460f8dc008115ff0a8a9?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
```

```plaintext
HTTP/1.1 202 Accepted
Content-Length: 148
Content-Type: application/json; charset=utf-8
Location: http://{host}/admin/extensions/DurableTaskExtension/instances/b4e9bdcc435d460f8dc008115ff0a8a9?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

{"runtimeStatus":"Running","input":"D:\\home\\LogFiles","output":null,"createdTime":"2017-06-29T18:50:55Z","lastUpdatedTime":"2017-06-29T18:51:16Z"}
```

In this case, the function is still running. We are also able to see the input that was saved into the orchestrator state and the last updated time. We can continue to use the `Location` header values to poll for completion. Once complete, we can expect to see an HTTP response value similar to the following:

```plaintext
HTTP/1.1 200 OK
Content-Length: 152
Content-Type: application/json; charset=utf-8

{"runtimeStatus":"Completed","input":"D:\\home\\LogFiles","output":452071,"createdTime":"2017-06-29T18:50:55Z","lastUpdatedTime":"2017-06-29T18:51:26Z"}
```

Now we can see that the orchestration is complete and approximately how much time it took to complete. We now also see a value for the `output` field, which indicates that around 450 KB of logs were uploaded.

## Wrapping up
At this point, you should have a greater understanding of the core orchestration capabilities of Durable Functions. Subsequent samples will go into more advanced features and scenarios.

## Full Sample Code
Here is the full orchestration as a single C# file using the Visual Studio project syntax:

[!code-csharp[Main](~/../samples/precompiled/BackupSiteContent.cs)]
