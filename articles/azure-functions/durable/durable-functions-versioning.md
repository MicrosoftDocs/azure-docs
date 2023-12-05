---
title: Versioning in Durable Functions - Azure
description: Learn how to implement versioning in the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: conceptual
ms.date: 12/07/2022
ms.author: azfuncdf
---

# Versioning in Durable Functions (Azure Functions)

It is inevitable that functions will be added, removed, and changed over the lifetime of an application. [Durable Functions](durable-functions-overview.md) allows chaining functions together in ways that weren't previously possible, and this chaining affects how you can handle versioning.

## How to handle breaking changes

There are several examples of breaking changes to be aware of. This article discusses the most common ones. The main theme behind all of them is that both new and existing function orchestrations are impacted by changes to function code.

### Changing activity or entity function signatures

A signature change refers to a change in the name, input, or output of a function. If this kind of change is made to an activity or entity function, it could break any orchestrator function that depends on it. This is especially true for type-safe languages. If you update the orchestrator function to accommodate this change, you could break existing in-flight instances.

As an example, suppose we have the following orchestrator function.

# [C#](#tab/csharp)

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    bool result = await context.CallActivityAsync<bool>("Foo");
    await context.CallActivityAsync("Bar", result);
}
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

[bool]$Result = Invoke-DurableActivity -FunctionName 'Foo'
Invoke-DurableActivity -FunctionName 'Bar' -Input $Result
```

# [Java](#tab/java)

```java
@FunctionName("FooBar")
public void fooBarOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    boolean result = ctx.callActivity("Foo", boolean.class).await();
    ctx.callActivity("Bar", result).await();
}
```

---

This simplistic function takes the results of **Foo** and passes it to **Bar**. Let's assume we need to change the return value of **Foo** from a Boolean to a String to support a wider variety of result values. The result looks like this:

# [C#](#tab/csharp)

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    string result = await context.CallActivityAsync<string>("Foo");
    await context.CallActivityAsync("Bar", result);
}
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

[string]$Result = Invoke-DurableActivity -FunctionName 'Foo'
Invoke-DurableActivity -FunctionName 'Bar' -Input $Result
```

# [Java](#tab/java)

```java
@FunctionName("FooBar")
public void fooBarOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    String result = ctx.callActivity("Foo", String.class).await();
    ctx.callActivity("Bar", result).await();
}
```

---

This change works fine for all new instances of the orchestrator function but may break any in-flight instances. For example, consider the case where an orchestration instance calls a function named `Foo`, gets back a boolean value, and then checkpoints. If the signature change is deployed at this point, the checkpointed instance will fail immediately when it resumes and replays the call to `Foo`. This failure happens because the result in the history table is a Boolean value but the new code tries to deserialize it into a String value, resulting in unexpected behavior or even runtime exception for type-safe languages.

This example is just one of many different ways that a function signature change can break existing instances. In general, if an orchestrator needs to change the way it calls a function, then the change is likely to be problematic.

### Changing orchestrator logic

The other class of versioning problems come from changing the orchestrator function code in a way that changes the execution path for in-flight instances.

Consider the following orchestrator function:

# [C#](#tab/csharp)

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    bool result = await context.CallActivityAsync<bool>("Foo");
    await context.CallActivityAsync("Bar", result);
}
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

[bool]$Result = Invoke-DurableActivity -FunctionName 'Foo'
Invoke-DurableActivity -FunctionName 'Bar' -Input $Result
```

# [Java](#tab/java)

```java
@FunctionName("FooBar")
public void fooBarOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    boolean result = ctx.callActivity("Foo", boolean.class).await();
    ctx.callActivity("Bar", result).await();
}
```

---

Now let's assume you want to make a change to add a new function call in between the two existing function calls.

# [C#](#tab/csharp)

```csharp
[FunctionName("FooBar")]
public static Task Run([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    bool result = await context.CallActivityAsync<bool>("Foo");
    if (result)
    {
        await context.CallActivityAsync("SendNotification");
    }

    await context.CallActivityAsync("Bar", result);
}
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

[bool]$Result = Invoke-DurableActivity -FunctionName 'Foo'
if ($Result -eq $true) {
    Invoke-DurableActivity -FunctionName 'SendNotification'
}
Invoke-DurableActivity -FunctionName 'Bar' -Input $Result
```

# [Java](#tab/java)

```java
@FunctionName("FooBar")
public void fooBarOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    boolean result = ctx.callActivity("Foo", boolean.class).await();
    if (result) {
        ctx.callActivity("SendNotification").await();
    }

    ctx.callActivity("Bar", result).await();
}
```

---

This change adds a new function call to *SendNotification* between *Foo* and *Bar*. There are no signature changes. The problem arises when an existing instance resumes from the call to *Bar*. During replay, if the original call to *Foo* returned `true`, then the orchestrator replay will call into *SendNotification*, which is not in its execution history. The runtime detects this inconsistency and raises a *non-deterministic orchestration* error because it encountered a call to *SendNotification* when it expected to see a call to *Bar*. The same type of problem can occur when adding API calls to other durable operations, like creating durable timers, waiting for external events, calling sub-orchestrations, etc.

## Mitigation strategies

Here are some of the strategies for dealing with versioning challenges:

* Do nothing (not recommended)
* Stop all in-flight instances
* Side-by-side deployments

### Do nothing

The naive approach to versioning is to do nothing and let in-flight orchestration instances fail. Depending on the type of change, the following types of failures may occur.

* Orchestrations may fail with a *non-deterministic orchestration* error.
* Orchestrations may get stuck indefinitely, reporting a `Running` status.
* If a function gets removed, any function that tries to call it may fail with an error.
* If a function gets removed after it was scheduled to run, then the app may experience low-level runtime failures in the Durable Task Framework engine, potentially resulting in severe performance degradation.

Because of these potential failures, the "do nothing" strategy is not recommended.

### Stop all in-flight instances

Another option is to stop all in-flight instances. If you're using the default [Azure Storage provider for Durable Functions](durable-functions-storage-providers.md#azure-storage), stopping all instances can be done by clearing the contents of the internal **control-queue** and **workitem-queue** queues. You can alternatively stop the function app, delete these queues, and restart the app again. The queues will be recreated automatically once the app restarts. The previous orchestration instances may remain in the "Running" state indefinitely, but they will not clutter your logs with failure messages or cause any harm to your app. This approach is ideal in rapid prototype development, including local development.

> [!NOTE]
> This approach requires direct access to the underlying storage resources, and my not be appropriate for all storage providers supported by Durable Functions.

### Side-by-side deployments

The most fail-proof way to ensure that breaking changes are deployed safely is by deploying them side-by-side with your older versions. This can be done using any of the following techniques:

* Deploy all the updates as entirely new functions, leaving existing functions as-is. This generally isn't recommended because of the complexity involved in recursively updating the callers of the new function versions.
* Deploy all the updates as a new function app with a different storage account.
* Deploy a new copy of the function app with the same storage account but with an updated [task hub](durable-functions-task-hubs.md) name. This results in the creation of new storage artifacts that can be used by the new version of your app. The old version of your app will continue to execute using the previous set of storage artifacts.

Side-by-side deployment is the recommended technique for deploying new versions of your function apps.

> [!NOTE]
> This guidance for the side-by-side deployment strategy uses Azure Storage-specific terms, but applies generally to all supported [Durable Functions storage providers](durable-functions-storage-providers.md).

### Deployment slots

When doing side-by-side deployments in Azure Functions or Azure App Service, we recommend that you deploy the new version of the function app to a new [Deployment slot](../functions-deployment-slots.md). Deployment slots allow you to run multiple copies of your function app side-by-side with only one of them as the active *production* slot. When you are ready to expose the new orchestration logic to your existing infrastructure, it can be as simple as swapping the new version into the production slot.

> [!NOTE]
> This strategy works best when you use HTTP and webhook triggers for orchestrator functions. For non-HTTP triggers, such as queues or Event Hubs, the trigger definition should [derive from an app setting](../functions-bindings-expressions-patterns.md#binding-expressions---app-settings) that gets updated as part of the swap operation.

## Next steps

> [!div class="nextstepaction"]
> [Learn about using and choosing storage providers](durable-functions-storage-providers.md)
