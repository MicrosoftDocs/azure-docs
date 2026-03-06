---
title: Versioning in Durable Functions - Azure
description: Learn how to implement versioning in the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: concept-article
ms.date: 12/07/2022
ms.author: azfuncdf
---

# Versioning challenges and approaches in Durable Functions 

Functions are inevitably added, removed, and changed over the lifetime of an application. [Durable Functions](what-is-durable-task.md) lets you chain functions together in ways that weren't previously possible, and this chaining affects how you handle versioning.

> [!TIP]
> This article explains common versioning challenges and deployment-level strategies for dealing with them. If you're looking for the built-in **orchestration versioning** feature that provides automatic version isolation at the runtime level, see [Orchestration versioning](durable-orchestration-versioning.md).

> [!IMPORTANT]
> When you deploy code changes that affect running orchestrations, incorrect deployments can lead to orchestrations failing with nondeterministic errors, getting stuck indefinitely, or experiencing performance degradation. Follow the recommended [mitigation strategies](#mitigation-strategies) described in this article when you make changes that might affect in-flight orchestrations.

## Types of breaking changes

Several examples of breaking changes exist. This article discusses the most common types. The main theme behind all of them is that changes to function code affect both new and existing function orchestrations.

### Change activity or entity function signatures

A signature change refers to a change in the name, input, or output of a function. If you make this kind of change to an activity or entity function, it could break any orchestrator function that depends on it. This behavior is especially true for type-safe languages. If you update the orchestrator function to accommodate this change, you could break existing in-flight instances.

As an example, consider the following orchestrator function.

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

This simplistic function takes the result of **Foo** and passes it to **Bar**. Assume you need to change the return value of **Foo** from a Boolean to a String to support a wider variety of result values. The result looks like this:

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

This change works fine for all new instances of the orchestrator function but might break any in-flight instances. For example, consider the case where an orchestration instance calls a function named `Foo`, gets back a boolean value, and then checkpoints. If the signature change is deployed at this point, the checkpointed instance fails immediately when it resumes and replays the call to `Foo`. This failure happens because the result in the history table is a Boolean value, but the new code tries to deserialize it into a String value, resulting in unexpected behavior or even a runtime exception for type-safe languages.

This example is one of many ways that a function signature change can break existing instances. In general, if an orchestrator needs to change the way it calls a function, then the change is likely to be problematic.

### Change orchestrator logic

The other class of versioning problems comes from changing the orchestrator function code in a way that changes the execution path for in-flight instances.

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

Now assume you want to add a new function call between the two existing function calls.

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

This change adds a new function call to `SendNotification` between `Foo` and `Bar`. No signature changes exist. The problem arises when an existing instance resumes from the call to `Bar`. During replay, if the original call to `Foo` returned `true`, then the orchestrator replay calls into `SendNotification`, which isn't in its execution history. The runtime detects this inconsistency and raises a *non-deterministic orchestration* error because it encountered a call to `SendNotification` when it expected to see a call to `Bar`. The same type of problem can occur when adding API calls to other durable operations, like creating durable timers, waiting for external events, or calling sub-orchestrations.

## Mitigation strategies

Here are strategies for dealing with versioning challenges. **Orchestration versioning** is a built-in runtime feature that handles version isolation automatically, while the remaining options are deployment-level workarounds:

* Do nothing (not recommended)
* Orchestration versioning (recommended in most cases)
* Stop all in-flight instances
* Side-by-side deployments

### Do nothing

The naive approach to versioning is to do nothing and let in-flight orchestration instances fail. Depending on the type of change, the following types of failures can occur.

* Orchestrations can fail with a *nondeterministic orchestration* error.
* Orchestrations can get stuck indefinitely, reporting a `Running` status.
* If a function is removed, any function that tries to call it can fail with an error.
* If a function is removed after it was scheduled to run, the app can experience low-level runtime failures in the Durable Task Framework engine, potentially resulting in severe performance degradation.

Because of these potential failures, the "do nothing" strategy is not recommended.

### Orchestration versioning


Unlike the other strategies in this section, orchestration versioning is a **built-in runtime feature** that provides automatic version isolation. You don't need to manage separate deployments, task hubs, or storage accounts. Instead, the runtime itself tracks version information and ensures that orchestration instances are processed by compatible workers.

With orchestration versioning:

- Each orchestration instance gets a version permanently associated with it when created.
- Orchestrator functions can examine their version and branch execution accordingly, keeping old and new code paths in the same codebase.
- Workers running newer orchestrator function versions can continue executing orchestration instances created by older versions.
- The runtime prevents workers running older orchestrator function versions from executing orchestrations of newer versions.

This approach requires minimal configuration (a version string and optional match strategy) and is compatible with any [storage provider](durable-functions-storage-providers.md). It's the recommended strategy for applications that need to support breaking changes while maintaining [zero-downtime deployments](durable-functions-zero-downtime-deployment.md).

For detailed configuration and implementation guidance, see [Orchestration versioning](durable-orchestration-versioning.md).

### Stop all in-flight instances

Another option is to stop all in-flight instances. If you're using the default [Azure Storage provider for Durable Functions](durable-functions-storage-providers.md#azure-storage), stop all instances by clearing the contents of the internal **control-queue** and **workitem-queue** queues. Alternatively, stop the function app, delete these queues, and restart the app. The queues are recreated automatically once the app restarts. The previous orchestration instances might remain in the "Running" state indefinitely, but they don't clutter your logs with failure messages or cause any harm to your app. This approach is ideal for rapid prototype development, including local development.

> [!NOTE]
> This approach requires direct access to the underlying storage resources and might not be appropriate for all storage providers supported by Durable Functions.

### Side-by-side deployments

The most fail-proof way to ensure that breaking changes are deployed safely is by deploying them side by side with your older versions. Use any of the following techniques:

* Deploy all the updates as entirely new functions, leaving existing functions as-is. This approach generally isn't recommended because of the complexity involved in recursively updating the callers of the new function versions.
* Deploy all the updates as a new function app with a different storage account.
* Deploy a new copy of the function app with the same storage account but with an updated [task hub](durable-functions-task-hubs.md) name. This approach results in the creation of new storage artifacts that the new version of your app can use. The old version of your app continues to execute using the previous set of storage artifacts.

Side-by-side deployment is the recommended technique for deploying new versions of your function apps.

> [!NOTE]
> This guidance for the side-by-side deployment strategy uses Azure Storage-specific terms, but applies generally to all supported [Durable Functions storage providers](durable-functions-storage-providers.md).

### Deployment slots

When doing side-by-side deployments in Azure Functions or Azure App Service, deploy the new version of the function app to a new [deployment slot](../functions-deployment-slots.md). Deployment slots let you run multiple copies of your function app side by side with only one of them as the active *production* slot. When you're ready to expose the new orchestration logic to your existing infrastructure, it can be as simple as swapping the new version into the production slot.

> [!NOTE]
> This strategy works best when you use HTTP and webhook triggers for orchestrator functions. For non-HTTP triggers, like queues or Event Hubs, the trigger definition should [derive from an app setting](../functions-bindings-expressions-patterns.md#binding-expressions---app-settings) that gets updated as part of the swap operation.

## Next steps

> [!div class="nextstepaction"]
> [Learn about orchestration versioning](durable-orchestration-versioning.md)

> [!div class="nextstepaction"]
> [Learn about using and choosing storage providers](durable-functions-storage-providers.md)
