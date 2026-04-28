---
title: "Versioning in Durable Functions - Azure"
description: Explore versioning challenges and mitigation strategies for Durable Functions in Azure Functions. Discover how to safely deploy breaking changes to orchestrations.
author: cgillum
ms.topic: concept-article
ms.service: azure-functions
ms.date: 12/07/2022
ms.author: azfuncdf
---

# Versioning challenges and mitigation strategies in Durable Functions 

Versioning in Durable Functions is essential because functions are inevitably added, removed, and changed over the lifetime of an application. [Durable Functions](../../durable-task/common/what-is-durable-task.md) lets you chain functions together in ways that weren't previously possible, and this chaining affects how you handle versioning.

This article helps you:
- Identify whether your code change is a [breaking change](#types-of-breaking-changes).
- Choose the right [mitigation strategy](#mitigation-strategies) to deploy safely.

## Quick strategy comparison

If you already know your change is breaking, use this table to choose a mitigation strategy:

| Strategy | Best for | Details |
| -------- | -------- | ------- |
| [Orchestration versioning](#orchestration-versioning-recommended) (recommended) | Most applications with breaking changes. Built-in runtime feature, works with any storage backend. | [Jump to section](#orchestration-versioning-recommended) |
| [Side-by-side deployments](#side-by-side-deployments) | Apps that can't use orchestration versioning, or that need full isolation via separate task hubs or storage accounts. | [Jump to section](#side-by-side-deployments) |
| [Stop all in-flight instances](#stop-all-in-flight-instances) | Prototyping and local development where losing in-flight orchestrations is acceptable. | [Jump to section](#stop-all-in-flight-instances) |

> [!TIP]
> If you're looking for the built-in **orchestration versioning** feature that provides automatic version isolation at the runtime level, see [Orchestration versioning](../../durable-task/common/durable-orchestration-versioning.md).

> [!IMPORTANT]
> Before deploying, check whether your change is a breaking change:
> - Did you change the **name, input type, or output type** of an activity or entity function?
> - Did you **add, remove, or reorder** calls to activities, sub-orchestrations, timers, or external events in orchestrator code?
> - Did you **rename or remove** a function that in-flight orchestrations might still call?
>
> If you answered **yes** to any of these, use one of the [mitigation strategies](#mitigation-strategies) below to avoid failures in running orchestrations.

## Types of breaking changes

Several examples of breaking changes exist. This article discusses the most common types. The main theme behind all of them is that changes to function code affect both new and existing function orchestrations.

### Activity or entity function signature changes

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

This function takes the result of **Foo** and passes it to **Bar**. Assume you need to change the return value of **Foo** from a Boolean to a String to support a wider variety of result values. The result looks like this:

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

### Orchestrator logic changes

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

> [!WARNING]
> Deploying breaking changes without a mitigation strategy (the "do nothing" approach) can cause orchestrations to fail with *nondeterministic orchestration* errors, get stuck indefinitely in a `Running` status, or trigger low-level runtime failures that degrade performance. Always use one of the following strategies when deploying breaking changes.

### Orchestration versioning (recommended)

Unlike the other strategies in this section, orchestration versioning is a **built-in runtime feature** that provides automatic version isolation. You don't need to manage separate deployments, task hubs, or storage accounts. Instead, the runtime itself tracks version information and ensures that orchestration instances are processed by compatible workers.

With orchestration versioning:

- Each orchestration instance gets a version permanently associated with it when created.
- Orchestrator functions can examine their version and branch execution accordingly, keeping old and new code paths in the same codebase.
- Workers running newer orchestrator function versions can continue executing orchestration instances created by older versions.
- The runtime prevents workers running older orchestrator function versions from executing orchestrations of newer versions.

This approach requires minimal configuration (a version string and optional match strategy) and is compatible with any [storage provider](../../durable-task/common/durable-task-storage-providers.md). It's the recommended strategy for applications that need to support breaking changes while maintaining [zero-downtime deployments](durable-functions-zero-downtime-deployment.md).

For detailed configuration and implementation guidance, see [Orchestration versioning](../../durable-task/common/durable-orchestration-versioning.md).

### Stop all in-flight instances

Another option is to stop all in-flight instances. If you're using the default [Azure Storage provider for Durable Functions](../../durable-task/common/durable-task-storage-providers.md#azure-storage), stop all instances by clearing the contents of the internal **control-queue** and **workitem-queue** queues. Alternatively, stop the function app, delete these queues, and restart the app. The queues are recreated automatically once the app restarts. The previous orchestration instances might remain in the "Running" state indefinitely, but they don't clutter your logs with failure messages or cause any harm to your app. This approach is ideal for rapid prototype development, including local development.

> [!WARNING]
> This approach requires direct access to the underlying storage resources and isn't appropriate for all storage providers supported by Durable Functions.

### Side-by-side deployments

The most fail-proof way to ensure that breaking changes are deployed safely is by deploying them side by side with your older versions. You can use either of the following techniques:

* **Different storage account**: Deploy all the updates as a new function app with a different storage account. This fully isolates the new version's state from the old version.
* **Different task hub**: Deploy a new copy of the function app with the same storage account but with an updated [task hub](../../durable-task/common/durable-task-hubs.md) name. This approach creates new storage artifacts for the new version while the old version continues to use its existing artifacts.

When doing side-by-side deployments in Azure, you can use [deployment slots](../functions-deployment-slots.md) to run both versions simultaneously with only one as the active *production* slot. When you're ready to expose the new orchestration logic, swap the new version into the production slot.

> [!NOTE]
> This guidance uses Azure Storage-specific terms, but applies generally to all supported [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md).

> [!NOTE]
> Deployment slot swaps work best with HTTP and webhook triggers. For non-HTTP triggers like queues or Event Hubs, the trigger definition should [derive from an app setting](../functions-bindings-expressions-patterns.md#binding-expressions---app-settings) that gets updated as part of the swap operation.

## Next steps

> [!div class="nextstepaction"]
> [Learn about orchestration versioning](../../durable-task/common/durable-orchestration-versioning.md)

- [Learn about zero-downtime deployment strategies](durable-functions-zero-downtime-deployment.md)
- [Learn about storage providers for Durable Functions](../../durable-task/common/durable-task-storage-providers.md)
