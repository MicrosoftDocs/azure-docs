---
title: Versioning in Durable Functions for Azure Functions
description: Learn how to implement versioning in the Durable Functions extension for Azure Functions.
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

# Versioning in Durable Functions
It is inevitable that functions will need to be added, removed, or change over the lifetime of an application. Durable functions allows chaining function together in ways that was not previously possible, and this has significant implications on versioning.

> [!WARNING]
> Versioning is not yet fully supported in the current build of Durable Functions. Until a better solution is in place, it is recommended that you implement breaking changes by creating entirely new functions rather than making changes to existing functions.

## Breaking Changes
There are several examples of breaking changes to be aware of. The most common ones are discussed below. The main theme behind all of them is that both new and existing function orchestrations are immediately impacted by changes to function code.

### Changing activity function signatures
A signature change refers to a change in the name, input, or output of a function. If this kind of change is made to an activity function, it could potentially break the orchestrator function which depends on it. Furthermore, it is often not possible to simply update the orchestrator function because those updates could break existing in-flight instances. 

As an example, suppose we have the following function.

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] DurableOrchestrationContext context)
{
    bool result = await context.CallFunctionAsync<bool>("Foo");
    await context.CallFunctionAsync("Bar", result);
}
```

This simplistic function takes the results of **Foo** and passes it to **Bar**. Let's assume we need to change the return value of **Foo** from `bool` to `int` to support a wider variety of result values. The result looks like this:

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] DurableOrchestrationContext context)
{
    int result = await context.CallFunctionAsync<int>("Foo");
    await context.CallFunctionAsync("Bar", result);
}
```

This change works fine for all new instances of the orchestrator function but will break any in-flight instances. For example, consider the case where an orchestration instance calls **Foo**, gets back a boolean value and then checkpoints. If the signature change is deployed at this point, the checkpointed instance will fail immediately when it resumes and replays the call to `context.CallFunctionAsync<int>("Foo")`. This is because the result in the history table is `bool` but the new code tries to deserialize it into `int`.

This is just one of many different ways that a signature change can break existing instances. In general, if an orchestrator needs to change the way it calls a function, then the change is very likely to be problematic.

### Changing orchestrator logic
The other class of versioning problems come from changing the orchestrator function code in a way that confuses the replay logic for in-flight instances.

Consider the following orchestrator function:

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] DurableOrchestrationContext context)
{
    bool result = await context.CallFunctionAsync<bool>("Foo");
    await context.CallFunctionAsync("Bar", result);
}
```

Now let's assume you want to make a seemingly innocent change to add another function call.

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] DurableOrchestrationContext context)
{
    bool result = await context.CallFunctionAsync<bool>("Foo");
    if (result)
    {
        await context.CallFunctionAsync("SendNotification");
    }

    await context.CallFunctionAsync("Bar", result);
}
```

This change adds a new function call to **SendNotification** between **Foo** and **Bar**. There are no signature changes. The problem arises when an existing instance resumes from the call to **Bar**. During replay, if the original call to **Foo** returned `true`, then the orchestrator replay will call into **SendNotification** which is not in its execution history. As a result, the Durable Task Framework will fail with a `NonDeterministicOrchestrationException` because it encountered a call to **SendNotification** when it expected to see a call to **Bar**.

## Mitigation Strategies
There are a few different ways to deal with versioning challenges, which we'll discuss here.

### Do nothing
This is the default approach (obviously) and will result in in-flight orchestration instances failing when they encounter a breaking change. New instances will not be affected, assuming there aren't any new bugs introduced in the new version.

Whether this is a problem depends on the importance of your in-flight instances. If you are in active development and don't care about in-flight instances, then this might be good enough. However, you will need to deal with exceptions and errors which will appear in your diagnostics pipeline. If you care about any of these things, then you'll want to look at other options.

### Stop all in-flight instances
Another option is to simply stop all in-flight instances. This can be done by clearing the contents of the internal **control-queue** and **workitem-queue** queues. The instances will be forever stuck where they are, but they will not clutter your telemetry with failure messages. This is ideal in rapid prototype development.

> [!WARNING]
> The details of these queues may change over time, so you must not rely this technique for production workloads.

### Side-by-side deployments
The most fail-proof way to ensure that breaking changes can be deployed safely is by deploying them side-by-side with your older versions. This can be done using one of the following techniques:

* Deploy all the updates as entirely new functions (new names).
* Deploy all the updates as a new function app with a different storage account.

