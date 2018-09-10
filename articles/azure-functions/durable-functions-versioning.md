---
title: Versioning in Durable Functions - Azure
description: Learn how to implement versioning in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 09/29/2017
ms.author: azfuncdf
---

# Versioning in Durable Functions (Azure Functions)

It is inevitable that functions will be added, removed, and changed over the lifetime of an application. [Durable Functions](durable-functions-overview.md) allows chaining functions together in ways that weren't previously possible, and this chaining affects how you can handle versioning.

## How to handle breaking changes

There are several examples of breaking changes to be aware of. This article discusses the most common ones. The main theme behind all of them is that both new and existing function orchestrations are impacted by changes to function code.

### Changing activity function signatures

A signature change refers to a change in the name, input, or output of a function. If this kind of change is made to an activity function, it could break the orchestrator function that depends on it. If you update the orchestrator function to accommodate this change, you could break existing in-flight instances.

As an example, suppose we have the following function.

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] DurableOrchestrationContext context)
{
    bool result = await context.CallActivityAsync<bool>("Foo");
    await context.CallActivityAsync("Bar", result);
}
```

This simplistic function takes the results of **Foo** and passes it to **Bar**. Let's assume we need to change the return value of **Foo** from `bool` to `int` to support a wider variety of result values. The result looks like this:

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] DurableOrchestrationContext context)
{
    int result = await context.CallActivityAsync<int>("Foo");
    await context.CallActivityAsync("Bar", result);
}
```

This change works fine for all new instances of the orchestrator function but breaks any in-flight instances. For example, consider the case where an orchestration instance calls **Foo**, gets back a boolean value and then checkpoints. If the signature change is deployed at this point, the checkpointed instance will fail immediately when it resumes and replays the call to `context.CallActivityAsync<int>("Foo")`. This is because the result in the history table is `bool` but the new code tries to deserialize it into `int`.

This is just one of many different ways that a signature change can break existing instances. In general, if an orchestrator needs to change the way it calls a function, then the change is likely to be problematic.

### Changing orchestrator logic

The other class of versioning problems come from changing the orchestrator function code in a way that confuses the replay logic for in-flight instances.

Consider the following orchestrator function:

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] DurableOrchestrationContext context)
{
    bool result = await context.CallActivityAsync<bool>("Foo");
    await context.CallActivityAsync("Bar", result);
}
```

Now let's assume you want to make a seemingly innocent change to add another function call.

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] DurableOrchestrationContext context)
{
    bool result = await context.CallActivityAsync<bool>("Foo");
    if (result)
    {
        await context.CallActivityAsync("SendNotification");
    }

    await context.CallActivityAsync("Bar", result);
}
```

This change adds a new function call to **SendNotification** between **Foo** and **Bar**. There are no signature changes. The problem arises when an existing instance resumes from the call to **Bar**. During replay, if the original call to **Foo** returned `true`, then the orchestrator replay will call into **SendNotification** which is not in its execution history. As a result, the Durable Task Framework fails with a `NonDeterministicOrchestrationException` because it encountered a call to **SendNotification** when it expected to see a call to **Bar**.

## Mitigation strategies

Here are some of the strategies for dealing with versioning challenges:

* Do nothing
* Stop all in-flight instances
* Side-by-side deployments

### Do nothing

The easiest way to handle a breaking change is to let in-flight orchestration instances fail. New instances successfully run the changed code.

Whether this is a problem depends on the importance of your in-flight instances. If you are in active development and don't care about in-flight instances, this might be good enough. However, you will need to deal with exceptions and errors in your diagnostics pipeline. If you want to avoid those things, consider the other versioning options.

### Stop all in-flight instances

Another option is to stop all in-flight instances. This can be done by clearing the contents of the internal **control-queue** and **workitem-queue** queues. The instances will be forever stuck where they are, but they will not clutter your telemetry with failure messages. This is ideal in rapid prototype development.

> [!WARNING]
> The details of these queues may change over time, so don't rely on this technique for production workloads.

### Side-by-side deployments

The most fail-proof way to ensure that breaking changes are deployed safely is by deploying them side-by-side with your older versions. This can be done using any of the following techniques:

* Deploy all the updates as entirely new functions (new names).
* Deploy all the updates as a new function app with a different storage account.
* Deploy a new copy of the function app but with an updated `TaskHub` name. This is the recommended technique.

### How to change task hub name

The task hub can be configured in the *host.json* file as follows:

```json
{
    "durableTask": {
        "HubName": "MyTaskHubV2"
    }
}
```

The default value is `DurableFunctionsHub`.

All Azure Storage entities are named based on the `HubName` configuration value. By giving the task hub a new name, you ensure that separate queues and history table are created for the new version of your application.

We recommend that you deploy the new version of the function app to a new [Deployment Slot](https://blogs.msdn.microsoft.com/appserviceteam/2017/06/13/deployment-slots-preview-for-azure-functions/). Deployment slots allow you to run multiple copies of your function app side-by-side with only one of them as the active *production* slot. When you are ready to expose the new orchestration logic to your existing infrastructure, it can be as simple as swapping the new version into the production slot.

> [!NOTE]
> This strategy works best when you use HTTP and webhook triggers for orchestrator functions. For non-HTTP triggers, such as queues or Event Hubs, the trigger definition should derive from an app setting that gets updated as part of the swap operation.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to handle performance and scale issues](durable-functions-perf-and-scale.md)
