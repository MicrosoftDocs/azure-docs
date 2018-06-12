---
title: Bindings for Durable Functions - Azure
description: How to use triggers and bindings for the Durable Functons extension for Azure Functions.
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

# Bindings for Durable Functions (Azure Functions)

The [Durable Functions](durable-functions-overview.md) extension introduces two new trigger bindings that control the execution of orchestrator and activity functions. It also introduces an output binding that acts as a client for the Durable Functions runtime.

## Orchestration triggers

The orchestration trigger enables you to author durable orchestrator functions. This trigger supports starting new orchestrator function instances and resuming existing orchestrator function instances that are "awaiting" a task.

When you use the Visual Studio tools for Azure Functions, the orchestration trigger is configured using the [OrchestrationTriggerAttribute](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.OrchestrationTriggerAttribute.html) .NET attribute.

When you write orchestrator functions in scripting languages (for example, in the Azure portal), the orchestration trigger is defined by the following JSON object in the `bindings` array of the *function.json* file:

```json
{
    "name": "<Name of input parameter in function signature>",
    "orchestration": "<Optional - name of the orchestration>",
    "version": "<Optional - version label of this orchestrator function>",
    "type": "orchestrationTrigger",
    "direction": "in"
}
```

* `orchestration` is the name of the orchestration. This is the value that clients must use when they want to start new instances of this orchestrator function. This property is optional. If not specified, the name of the function is used.
* `version` is a version label of the orchestration. Clients that start a new instance of an orchestration must include the matching version label. This property is optional. If not specified, the empty string is used. For more information on versioning, see [Versioning](durable-functions-versioning.md).

> [!NOTE]
> Setting values for `orchestration` or `version` properties is not recommended at this time.

Internally this trigger binding polls a series of queues in the default storage account for the function app. These queues are internal implementation details of the extension, which is why they are not explicitly configured in the binding properties.

### Trigger behavior

Here are some notes about the orchestration trigger:

* **Single-threading** - A single dispatcher thread is used for all orchestrator function execution on a single host instance. For this reason, it is important to ensure that orchestrator function code is efficient and doesn't perform any I/O. It is also important to ensure that this thread does not do any async work except when awaiting on Durable Functions-specific task types.
* **Poising-message handling** - There is no poison message support in orchestration triggers.
* **Message visibility** - Orchestration trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values** - Return values are serialized to JSON and persisted to the orchestration history table in Azure Table storage. These return values can be queried by the orchestration client binding, described later.

> [!WARNING]
> Orchestrator functions should never use any input or output bindings other than the orchestration trigger binding. Doing so has the potential to cause problems with the Durable Task extension because those bindings may not obey the single-threading and I/O rules.

### Trigger usage

The orchestration trigger binding supports both inputs and outputs. Here are some things to know about input and output handling:

* **inputs** - Orchestration functions support only [DurableOrchestrationContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html) as a parameter type. Deserialization inputs directly in the function signature are not supported. Code must use the [GetInput\<T>](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_GetInput__1) method to fetch orchestrator function inputs. These inputs must be JSON-serializable types.
* **outputs** - Orchestration triggers support output values as well as inputs. The return value of the function is used to assign the output value and must be JSON-serializable. If a function returns `Task` or `void`, a `null` value will be saved as the output.

> [!NOTE]
> Orchestration triggers are only supported in C# at this time.

### Trigger sample

The following is an example of what the simplest "Hello World" C# orchestrator function might look like:

```csharp
[FunctionName("HelloWorld")]
public static string Run([OrchestrationTrigger] DurableOrchestrationContext context)
{
    string name = context.GetInput<string>();
    return $"Hello {name}!";
}
```

Most orchestrator functions call other functions, so here is a "Hello World" example that demonstrates how to call a function:

```csharp
[FunctionName("HelloWorld")]
public static async Task<string> Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    string name = await context.GetInput<string>();
    string result = await context.CallActivityAsync<string>("SayHello", name);
    return result;
}
```

## Activity triggers

The activity trigger enables you to author functions that are called by orchestrator functions.

If you're using Visual Studio, the activity trigger is configured using the [ActvityTriggerAttribute](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.ActivityTriggerAttribute.html) .NET attribute. 

If you're using the Azure portal for development, the activity trigger is defined by the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<Name of input parameter in function signature>",
    "activity": "<Optional - name of the activity>",
    "version": "<Optional - version label of this activity function>",
    "type": "activityTrigger",
    "direction": "in"
}
```

* `activity` is the name of the activity. This is the value that orchestrator functions use to invoke this activity function. This property is optional. If not specified, the name of the function is used.
* `version` is a version label of the activity. Orchestrator functions that invoke an activity must include the matching version label. This property is optional. If not specified, the empty string is used. For more information, see [Versioning](durable-functions-versioning.md).

> [!NOTE]
> Setting values for `activity` or `version` properties is not recommended at this time.

Internally this trigger binding polls a queue in the default storage account for the function app. This queue is an internal implementation detail of the extension, which is why it is not explicitly configured in the binding properties.

### Trigger behavior

Here are some notes about the activity trigger:

* **Threading** - Unlike the orchestration trigger, activity triggers don't have any restrictions around threading or I/O. They can be treated like regular functions.
* **Poising-message handling** - There is no poison message support in activity triggers.
* **Message visibility** - Activity trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values** - Return values are serialized to JSON and persisted to the orchestration history table in Azure Table storage.

> [!WARNING]
> The storage backend for activity functions is an implementation detail and user code should not interact with these storage entities directly.

### Trigger usage

The activity trigger binding supports both inputs and outputs, just like the orchestration trigger. Here are some things to know about input and output handling:

* **inputs** - Activity functions natively use [DurableActivityContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableActivityContext.html) as a parameter type. Alternatively, an activity function can be declared with any parameter type that is JSON-serializable. When you use `DurableActivityContext`, you can call [GetInput\<T>](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableActivityContext.html#Microsoft_Azure_WebJobs_DurableActivityContext_GetInput__1) to fetch and deserialize the activity function input.
* **outputs** - Activity triggers support output values as well as inputs. The return value of the function is used to assign the output value and must be JSON-serializable. If a function returns `Task` or `void`, a `null` value will be saved as the output.
* **metadata** - Activity functions can bind to a `string instanceId` parameter to get the instance ID of the parent orchestration.

> [!NOTE]
> Activity triggers are not currently supported in Node.js functions.

### Trigger sample

The following is an example of what a simple "Hello World" C# activity function might look like:

```csharp
[FunctionName("SayHello")]
public static string SayHello([ActivityTrigger] DurableActivityContext helloContext)
{
    string name = helloContext.GetInput<string>();
    return $"Hello {name}!";
}
```

The default parameter type for the `ActivityTriggerAttribute` binding is `DurableActivityContext`. However, activity triggers also support binding directly to JSON-serializeable types (including primitive types), so the same function could be simplified as follows:

```csharp
[FunctionName("SayHello")]
public static string SayHello([ActivityTrigger] string name)
{
    return $"Hello {name}!";
}
```

## Orchestration client

The orchestration client binding enables you to write functions which interact with orchestrator functions. For example, you can act on orchestration instances in the followng ways:
* Start them.
* Query their status.
* Terminate them.
* Send events to them while they're running.

If you're using Visual Studio, you can bind to the orchestration client by using the [OrchestrationClientAttribute](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.OrchestrationClientAttribute.html) .NET attribute.

If you're using scripting languages (e.g. *.csx* files) for development, the orchestration trigger is defined by the following JSON object in the `bindings` array of function.json:

```json
{
    "name": "<Name of input parameter in function signature>",
    "taskHub": "<Optional - name of the task hub>",
    "connectionName": "<Optional - name of the connection string app setting>",
    "type": "orchestrationClient",
    "direction": "out"
}
```

* `taskHub` - Used in scenarios where multiple function apps share the same storage account but need to be isolated from each other. If not specified, the default value from `host.json` is used. This value must match the value used by the target orchestrator functions.
* `connectionName` - The name of an app setting that contains a storage connection string. The storage account represented by this connection string must be the same one used by the target orchestrator functions. If not specified, the default connection string for the function app is used.

> [!NOTE]
> In most cases, we recommend that you omit these properties and rely on the default behavior.

### Client usage

In C# functions, you typically bind to `DurableOrchestrationClient`, which gives you full access to all client APIs supported by Durable Functions. APIs on the client object include:

* [Start​New​Async](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_StartNewAsync_)
* [Get​Status​Async](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_GetStatusAsync_)
* [Terminate​Async](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_TerminateAsync_)
* [Raise​Event​Async](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RaiseEventAsync_)

Alternatively, you can bind to `IAsyncCollector<T>` where `T` is [StartOrchestrationArgs](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.StartOrchestrationArgs.html) or `JObject`.

See the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) API documentation for additional details on these operations.

### Client sample (Visual Studio development)

Here is an example queue-triggered function that starts a "HelloWorld" orchestration.

```csharp
[FunctionName("QueueStart")]
public static Task Run(
    [QueueTrigger("durable-function-trigger")] string input,
    [OrchestrationClient] DurableOrchestrationClient starter)
{
    // Orchestration input comes from the queue message content.
    return starter.StartNewAsync("HelloWorld", input);
}
```

### Client sample (not Visual Studio)

If you're not using Visual Studio for development, you can create the following function.json file. This example shows how to configure a queue-triggered function that uses the durable orchestration client binding:

```json
{
  "bindings": [
    {
      "name": "input",
      "type": "queueTrigger",
      "queueName": "durable-function-trigger",
      "direction": "in"
    },
    {
      "name": "starter",
      "type": "orchestrationClient",
      "direction": "out"
    }
  ],
  "disabled": false
} 
```

Following are language-specific samples that start new orchestrator function instances.

#### C# Sample

The following sample shows how to use the durable orchestration client binding to start a new function instance from a C# script function:

```csharp
#r "Microsoft.Azure.WebJobs.Extensions.DurableTask"

public static Task<string> Run(string input, DurableOrchestrationClient starter)
{
    return starter.StartNewAsync("HelloWorld", input);
}
```

#### Node.js Sample

The following sample shows how to use the durable orchestration client binding to start a new function instance from a Node.js function:

```js
module.exports = function (context, input) {
    var id = generateSomeUniqueId();
    context.bindings.starter = [{
        FunctionName: "HelloWorld",
        Input: input,
        InstanceId: id
    }];

    context.done(null, id);
};
```

More details on starting instances can be found in [Instance management](durable-functions-instance-management.md).

## Next steps

> [!div class="nextstepaction"]
> [Learn about checkpointing and replay behaviors](durable-functions-checkpointing-and-replay.md)

