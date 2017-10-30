---
title: Stateful singletons in Durable Functions - Azure
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
ms.author: azfuncdf
---

# Stateful singletons in Durable Functions - Counter sample

Stateful singletons are long-running (potentially eternal) orchestrator functions that can store state and be invoked and queried by other functions. Stateful singletons are similar to the [Actor model](https://en.wikipedia.org/wiki/Actor_model) in distributed computing.

While not a proper "actor" implementation, orchestrator functions have many of the same runtime characteristics. For example, they are stateful, reliable, single-threaded, location-transparent, and globally addressable. These are characteristics that make real actor implementations especially useful, but without the need for a separate framework.

This article shows how to run the *counter* sample. The sample demonstrates a singleton object that supports *increment* and *decrement* operations and updates its internal state accordingly.

## Prerequisites

* Follow the instructions in [Install Durable Functions](durable-functions-install.md) to set up the sample.
* This article assumes you have already gone through the [Hello Sequence](durable-functions-sequence.md) sample walkthrough.

## Scenario overview

The counter scenario is surprisingly difficult to implement using regular stateless functions. One of the main challenges you have is managing **concurrency**. Operations like *increment* and *decrement* need to be atomic or else there could be race conditions that cause operations to overwrite each other.

Using a single VM to host the counter data is one option, but this is expensive, and managing **reliability** can be a challenge since a single VM could be periodically rebooted. You could alternatively use a distributed platform with synchronization tools like blob leases to help manage concurrency, but this introduces a great deal of **complexity**.

Durable Functions makes this kind of scenario trivial to implement because orchestration instances are affinitized to a single VM and orchestrator function execution is always single-threaded. Not only that, but they are long-running, stateful, and can react to external events. The sample code below demonstrates how to implement such a counter as a long-running orchestrator function.

## The sample function

This article walks through the **E3_Counter** function in the sample app.

The following sections explain the code that is used for Visual Studio development. The code for Azure portal development is similar.

## The counter orchestration

Here is the code that implements the orchestrator function:

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/Counter.cs)]

This orchestrator function essentially does the following:

1. Listens for an external event named *operation* using [WaitForExternalEvent](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_WaitForExternalEvent_).
2. Increments or decrements the `counterState` local variable depending on the operation requested.
3. Restarts the orchestrator using the [ContinueAsNew](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_ContinueAsNew_) method, setting the latest value of `counterState` as the new input.
4. Continues running forever or until an *end* message is received.

This is an example of an *eternal orchestration* &mdash; that is, one that potentially never ends. It responds to messages sent to it by the [RaiseEventAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RaiseEventAsync_) method, which can be called by any non-orchestrator function.

One unique characteristic of this orchestrator function is that it effectively has no history: the `ContinueAsNew` method resets the history after each processed event. This is the preferred way to implement an orchestrator which has an arbitrary lifetime. Using a `while` loop could cause the orchestrator function's history to grow unbounded, resulting in unnecessarily high memory usage.

> [!NOTE]
> The `ContinueAsNew` method has other use-cases besides eternal orchestrations. For more information, see [Eternal Orchestrations](durable-functions-eternal-orchestrations.md).

## Run the sample

You can start the orchestration by sending the following HTTP POST request. To allow `counterState` to start at zero (the default value for `int`), there is no content in this request.

```
POST http://{host}/orchestrators/E3_Counter
Content-Length: 0
```

```
HTTP/1.1 202 Accepted
Content-Length: 719
Content-Type: application/json; charset=utf-8
Location: http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

{
  "id":"bcf6fb5067b046fbb021b52ba7deae5a",
  "statusQueryGetUri":"http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}",
  "sendEventPostUri":"http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}",
  "terminatePostUri":"http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/terminate?reason={text}&taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}"}
```

The **E3_Counter** instance starts and then immediately waits for an event to be sent to it using `RaiseEventAsync` or using the **sendEventUrl** HTTP POST webhook referenced in the 202 response. Valid `eventName` values include *incr*, *decr*, and *end*.

```
POST http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/raiseEvent/operation?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
Content-Type: application/json
Content-Length: 6

"incr"
```

You can see the results of the "incr" operation by looking at the function logs in the Azure Functions portal.

```
2017-06-29T18:54:53.998 Function started (Id=34e34a61-38b3-4eac-b6e2-98b85e32eec8)
2017-06-29T18:54:53.998 Current counter state is 0. Waiting for next operation.
2017-06-29T18:58:01.458 Function started (Id=b45d6c2f-39f3-42a2-b904-7761b2614232)
2017-06-29T18:58:01.458 Current counter state is 0. Waiting for next operation.
2017-06-29T18:58:01.458 Received 'incr' operation.
2017-06-29T18:58:01.458 Function completed (Success, Id=b45d6c2f-39f3-42a2-b904-7761b2614232, Duration=8ms)
2017-06-29T18:58:11.518 Function started (Id=e1f38cb2-546a-404d-ab22-1ac8f81a93d9)
2017-06-29T18:58:11.518 Current counter state is 1. Waiting for next operation.
```

Similarly, if you check the orchestrator status, you see the `input` field has been set to the updated value (1).

```
GET http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey} HTTP/1.1
```

```
HTTP/1.1 202 Accepted
Content-Length: 129
Content-Type: application/json; charset=utf-8
Location: http://{host}/admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

{"runtimeStatus":"Running","input":1,"output":null,"createdTime":"2017-06-29T18:58:01Z","lastUpdatedTime":"2017-06-29T18:58:11Z"}
```

You can continue sending new operations to this instance and observe that its state gets updated accordingly. If you wish to kill the instance, you can do so by sending an *end* operation.

> [!WARNING]
> At the time of writing, there are known race conditions when calling `ContinueAsNew` while concurrently processing messages, such as external events or termination requests. For the latest information on these race conditions, see this [GitHub issue](https://github.com/Azure/azure-functions-durable-extension/issues/67).

## Next steps

This sample has demonstrated how to handle [external events](durable-functions-external-events.md) and implement [eternal orchestrations](durable-functions-eternal-orchestrations.md) in [stateful singletons](durable-functions-singletons.md). The next sample shows how to use external events and [durable timers](durable-functions-timers.md) to handle human interaction.

> [!div class="nextstepaction"]
> [Run the human interaction sample](durable-functions-phone-verification.md)
