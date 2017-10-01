---
title: Stateful singletons in Durable Functions for Azure Functions
description: Learn how to implement a stateful singleton in the Durable Functions extension for Azure Functions.
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

# Stateful singletons in Durable Functions - Counter example
Stateful singletons are long-running (potentially eternal) orchestrator functions which store state and can be invoked and queried by other functions in your application. Stateful singletons are similar in spirit to the [Actor model](https://en.wikipedia.org/wiki/Actor_model) in distributed computing.

While not a proper "actor" implementation, orchestrator functions have many of the same runtime characteristics (stateful, reliable, single-threaded, location transparent, globally addressable, etc.) that make real actor implementations especially useful, but without the need for a separate framework. The below example is a simple *counter* singleton object which supports *increment* and *decrement* operations and updates its internal state accordingly.

## Before you begin
If you haven't done so already, make sure to read the [overview](~/articles/overview.md) before jumping into samples. It will really help ensure everything you read below makes sense.

All samples are combined into a single function app package. To get started with the samples, follow the setup steps below that are relevant for your development environment:

### For Visual Studio Development (Windows Only)
1. Download the [VSDFSampleApp.zip](~/files/VSDFSampleApp.zip) package, unzip the contents, and open in Visual Studio 2017 (version 15.3).
2. Install and run the [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/storage-use-emulator). Alternatively, you can update the `local.appsettings.json` file with real Azure Storage connection strings.
3. The sample can now be run locally via F5. It can also be published directly to Azure and run in the cloud.

### For Azure Portal Development
1. Create a new function app at https://functions.azure.com/signin.
2. Follow the [installation instructions](~/articles/installation.md) to configure Durable Functions.
3. Download the [DFSampleApp.zip](~/files/DFSampleApp.zip) package.
4. Unzip the sample package file into `D:\home\site\wwwroot` using Kudu or FTP.

The code snippets and binding references below are specific to the portal experience, but have a direct mapping to the equivalent Visual Studio development experience.

This article will specifically walk through the following function in the sample app:

* **E3_Counter**

> [!NOTE]
> This walkthrough assumes you have already gone through the [Hello Sequence](./sequence.md) sample walkthrough. If you haven't done so already, it is recommended to first go through that walkthrough before starting this one.

## Scenario overview
The counter scenario is very simple to understand, but surprisingly difficult to implement using regular stateless functions. One of the main challenges you have is managing **concurrency**. Operations like *increment* and *decrement* need to be atomic or else there could be race conditions that cause operations to overwrite each other.

Using a single VM to host the counter data is one option, but this is expensive and managing **reliability** can be a challenge since a single VM could be periodically rebooted. You could alternatively use a distributed platform with synchronization tools like blob leases to help manage concurrency, but this introduces a great deal of **complexity**.

Durable Functions makes this kind of scenario trivial to implement because orchestration instances are affinitized to a single VM and orchestrator function execution is always single-threaded. Not only that, but they are long-running, stateful, and can react to external events. The sample code below will demonstrate how to implement such a counter as a long-running orchestrator function.

## The counter orchestration
Here is the code which implements the orchestrator function:

[!code-csharp[Main](~/../samples/precompiled/Counter.cs)]

This orchestrator function essentially does the following:

1. Listens for an external event named *operation* using <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.WaitForExternalEvent*>.
2. Increments or decrements the `counterState` local variable depending on the operation requested.
3. Restarts the orchestrator using the <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.ContinueAsNew*> method, setting the latest value of `counterState` as the new input.
4. Continues running forever or until an *end* message is received.

This is an example of an *eternal orchestration* - i.e. one that potentially never ends. It responds to messages sent to it using the <xref:Microsoft.Azure.WebJobs.DurableOrchestrationClient.RaiseEventAsync*> method, which can be called by any non-orchestrator function.

One unique characteristic of this orchestrator function is that it effectively has no history: the <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.ContinueAsNew*> method will reset the history after each processed event. This is the preferred way to implement an orchestrator which has an arbitrary lifetime. Using a `while` loop could cause the orchestrator function's history to grow unbounded, resulting in unnecessarily high memory usage.

> [!NOTE]
> The <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.ContinueAsNew*> method has other interesting use-cases besides just eternal orchestrations. See the [Eternal Orchestrations](../topics/eternal-orchestrations.md) topic guide for more information.

## Running the sample
Using the HTTP-triggered functions included in the sample, you can start the orchestration using the below HTTP POST request. We don't include any content in this request, which allows `counterState` to start at zero (the default value for `int`).

```plaintext
POST http://{host}/orchestrators/E3_Counter HTTP/1.1
Content-Length: 0
```

```plaintext
HTTP/1.1 202 Accepted
Content-Length: 719
Content-Type: application/json; charset=utf-8
Location: http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

{"id":"bcf6fb5067b046fbb021b52ba7deae5a","statusQueryGetUri":"http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}","sendEventPostUri":"http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}","terminatePostUri":"http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/terminate?reason={text}&taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}"}
```

The **E3_Counter** instance starts and then immediately waits for an event to be sent to it using <xref:Microsoft.Azure.WebJobs.DurableOrchestrationClient.RaiseEventAsync*> or using the **sendEventUrl** HTTP POST webhook referenced in the 202 response above. Valid `eventName` values include *incr*, *decr*, and *end*.

```plaintext
POST http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/raiseEvent/operation?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey} HTTP/1.1
Content-Type: application/json
Content-Length: 6

"incr"
```

You can see the results of the "incr" operation by looking at the function logs in the Azure Functions portal.

```plaintext
2017-06-29T18:54:53.998 Function started (Id=34e34a61-38b3-4eac-b6e2-98b85e32eec8)
2017-06-29T18:54:53.998 Current counter state is 0. Waiting for next operation.
2017-06-29T18:58:01.458 Function started (Id=b45d6c2f-39f3-42a2-b904-7761b2614232)
2017-06-29T18:58:01.458 Current counter state is 0. Waiting for next operation.
2017-06-29T18:58:01.458 Received 'incr' operation.
2017-06-29T18:58:01.458 Function completed (Success, Id=b45d6c2f-39f3-42a2-b904-7761b2614232, Duration=8ms)
2017-06-29T18:58:11.518 Function started (Id=e1f38cb2-546a-404d-ab22-1ac8f81a93d9)
2017-06-29T18:58:11.518 Current counter state is 1. Waiting for next operation.
```

Similarly, if you check the orchestrator status, you should see the `input` field has been set to the updated value (1).

```plaintext
GET http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey} HTTP/1.1
```

```plaintext
HTTP/1.1 202 Accepted
Content-Length: 129
Content-Type: application/json; charset=utf-8
Location: http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

{"runtimeStatus":"Running","input":1,"output":null,"createdTime":"2017-06-29T18:58:01Z","lastUpdatedTime":"2017-06-29T18:58:11Z"}
```

You can continue sending new operations to this instance and observe its state gets updated accordingly. If you wish to kill the instance, you can do so by sending an *end* operation.

> [!WARNING]
> At the time of writing, there are known race conditions when calling <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.ContinueAsNew*> while concurrently processing messages, such external events or termination requests. For the latest information on these race conditions, see this [GitHub issue](https://github.com/Azure/azure-functions-durable-extension/issues/67).

## Wrapping up
At this point, you should have a better understanding of some of the advanced capabilities of Durable Functions, notably <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.WaitForExternalEvent*> and <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.ContinueAsNew*>. These tools should enable you to write various flavors of "stateful singletons" like counters, aggregators, etc.

