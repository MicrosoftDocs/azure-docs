---
title: Manage instances in Durable Functions - Azure
description: Learn how to manage instances in the Durable Functions extension for Azure Functions.
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

# Manage instances in Durable Functions (Azure Functions)

[Durable Functions](durable-functions-overview.md) orchestration instances can be started, terminated, queried, and sent notification events. All instance management is done using the [orchestration client binding](durable-functions-bindings.md). This article goes into the details of each instance management operation.

## Starting instances

The [StartNewAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_StartNewAsync_) method on the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) starts a new instance of an orchestrator function. Instances of this class can be acquired using the `orchestrationClient` binding. Internally, this method enqueues a message into the control queue, which then triggers the start of a function with the specified name that uses the `orchestrationTrigger` trigger binding.

The parameters are as follows:

* **Name**: The name of the orchestrator function to schedule.
* **Input**: Any JSON-serializable data which should be passed as the input to the orchestrator function.
* **InstanceId**: (Optional) The unique ID of the instance. If not specified, a random instance ID will be generated.

Here is a simple C# example:

```csharp
[FunctionName("HelloWorldManualStart")]
public static Task Run(
    [ManualTrigger] string input,
    [OrchestrationClient] DurableOrchestrationClient starter,
    TraceWriter log)
{
    string instanceId = starter.StartNewAsync("HelloWorld", input);
    log.Info($"Started orchestration with ID = '{instanceId}'.");
}
```

For non-.NET languages, the function output binding can be used to start new instances as well. In this case, any JSON-serializable object which has the above three parameters as fields can be used. For example, consider the following Node.js function:

```js
module.exports = function (context, input) {
    var id = generateSomeUniqueId();
    context.bindings.starter = [{
        FunctionName: "HelloWorld",
        Input: input,
        InstanceId: id
    }];

    context.done(null);
};
```

> [!NOTE]
> We recommend that you use a random identifier for the instance ID. This will help ensure an equal load distribution when scaling orchestrator functions across multiple VMs. The proper time to use non-random instance IDs is when the ID must come from an external source or when implementing the [singleton orchestrator](durable-functions-singletons.md) pattern.

## Querying instances

The [GetStatusAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_GetStatusAsync_) method on the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class queries the status of an orchestration instance. It takes an `instanceId` as a parameter and returns an object with the following properties:

* **Name**: The name of the orchestrator function.
* **InstanceId**: The instance ID of the orchestration (should be the same as the `instanceId` input).
* **CreatedTime**: The time at which the orchestrator function started running.
* **LastUpdatedTime**: The time at which the orchestration last checkpointed.
* **Input**: The input of the function as a JSON value.
* **Output**: The output of the function as a JSON value (if the function has completed). If the orchestrator function failed, this property will include the failure details. If the orchestrator function was terminated, this property will include the provided reason for the termination (if any).
* **RuntimeStatus**: One of the following values:
    * **Running**: The instance has started running.
    * **Completed**: The instance has completed normally.
    * **ContinuedAsNew**: The instance has restarted itself with a new history. This is a transient state.
    * **Failed**: The instance failed with an error.
    * **Terminated**: The instance was abruptly terminated.
    
This method returns `null` if the instance either doesn't exist or has not yet started running.

```csharp
[FunctionName("GetStatus")]
public static async Task Run(
    [OrchestrationClient] DurableOrchestrationClient client,
    [ManualTrigger] string instanceId)
{
    var status = await checker.GetStatusAsync(instanceId);
    // do something based on the current status.
}
```

> [!NOTE]
> Instance query is currently only supported for C# functions.

## Terminating instances

A running instance can be terminated using the [TerminateAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_TerminateAsync_) method of the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class. The two parameters are an `instanceId` and a `reason` string, which will be written to logs and to the instance status. A terminated instance will stop running as soon as it reaches the next `await` point, or it will terminate immediately if it is already on an `await`.

```csharp
[FunctionName("TerminateInstance")]
public static Task Run(
    [OrchestrationClient] DurableOrchestrationClient client,
    [ManualTrigger] string instanceId)
{
    string reason = "It was time to be done.";
    return client.TerminateAsync(instanceId, reason);
}
```

> [!NOTE]
> Instance termination is currently only supported for C# functions.

## Sending events to instances

Event notifications can be sent to running instances using the [RaiseEventAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RaiseEventAsync_) method of the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class. Instances that can handle these events are those that are awaiting a call to [WaitForExternalEvent](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_WaitForExternalEvent_). The inputs are:

* **InstanceId**: The unique ID of the instance.
* **EventName**: The name of the event to send.
* **EventData**: A JSON-serializable payload to send to the instance.

```csharp
#r "Microsoft.Azure.WebJobs.Extensions.DurableTask"

[FunctionName("RaiseEvent")]
public static Task Run(
    [OrchestrationClient] DurableOrchestrationClient client,
    [ManualTrigger] string instanceId)
{
    int[] eventData = new int[] { 1, 2, 3 };
    return client.RaiseEventAsync(instanceId, "MyEvent", eventData);
}
```

> [!NOTE]
> Raising events is currently supported only for C# functions.

> [!WARNING]
> If there is no orchestration instance with the specified *instance ID* or if the instance is not waiting on the specified *event name*, the event message is discarded. For more information about this behavior, see the [GitHub issue](https://github.com/Azure/azure-functions-durable-extension/issues/29).

## Next steps

> [!div class="nextstepaction"]
> [Learn how to use the HTTP APIs for instance management](durable-functions-http-api.md)
