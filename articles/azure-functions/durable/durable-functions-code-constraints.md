---
title: Durable orchestrator code constraints - Azure Functions
description: Orchestration function replay and code constraints for Azure Durable Functions.
author: cgillum
manager: gwallace
keywords:
ms.service: azure-functions
ms.topic: conceptual
ms.date: 08/18/2019
ms.author: azfuncdf
#Customer intent: As a developer, I want to learn what coding restrictions exist for durable orchestrations and why so that I can avoid introducing bugs in my application logic.
---

# Orchestrator function code constraints

Durable Functions is an extension of [Azure Functions](../functions-overview.md) that lets you build stateful applications. You can use an [orchestrator function](durable-functions-orchestrations.md) to orchestrate the execution of other Durable functions within a function app. Orchestrator functions are stateful, reliable, and potentially long-running.

## Orchestrator code constraints

Orchestrator functions use [event sourcing](https://docs.microsoft.com/azure/architecture/patterns/event-sourcing) to ensure reliable execution and to maintain local variable state. The [replay behavior](durable-functions-orchestrations.md#reliability) of orchestrator code creates constraints on the type of code that you can write in an orchestrator function. For example, orchestrator code must be *deterministic*.  Orchestrator functions will be replayed multiple times, and it must produce the same result each time.

The following sections provide some simple guidelines for ensuring that your code is deterministic.

### Using deterministic APIs

Orchestrator functions are free to call any API that they want in their target language. However, it's important that orchestrator functions only call *deterministic* APIs. A *deterministic API* is an API that always returns the exact same value given the same input, no matter when or how often it's called.

The following are some examples of APIs that should be avoided because they are *not* deterministic. These restrictions apply only to orchestrator functions. Other function types don't have such restrictions.

| API category | Reason | Workaround |
| ------------ | ------ | ---------- |
| Dates/times  | APIs that return the _current_ date or time are non-deterministic because they returned value will be different for every replay. | Use the [CurrentUtcDateTime](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_CurrentUtcDateTime) (.NET) or `currentUtcDateTime` (JavaScript) API, which is safe for replay. |
| GUIDs/UUIDs  | APIs that return a _random_ GUID/UUID are non-deterministic because the generated value will be different for every replay. | Use the [NewGuid](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_NewGuid) (.NET) or `newGuid` (JavaScript) to safely generate random GUIDs. |
| Random numbers | APIs that return random numbers are non-deterministic because the generated value will be different for every replay. | Use an activity function to return random numbers to an orchestration. The return values of activity functions are always safe for replay. |
| Bindings | Input and output bindings typically do I/O and are non-deterministic. Even the [orchestration client](durable-functions-bindings.md#orchestration-client) and [entity client](durable-functions-bindings.md#entity-client) bindings must not be used directly by an orchestrator function. | Use input and output bindings inside client or activity functions. |
| Network | Network calls involve external systems and are non-deterministic. | Use activity functions to make network calls. If you need to make an HTTP call from your orchestrator function, you also have the option to use the [durable HTTP APIs](durable-functions-http-features.md#consuming-http-apis). |
| Blocking APIs | Blocking APIs such as `Thread.Sleep` (.NET) or other similar APIs can cause performance and scale problems for orchestrator functions and should be avoided. In the Azure Functions Consumption plan, they can even result in unnecessary execution-time charges. | Use alternatives to blocking APIs when available, such as `CreateTimer` to introduce delays in orchestration execution. [Durable timer](durable-functions-timers.md) delays do not count towards the execution time of an orchestrator function. |
| Async APIs | Orchestrator code must **never initiate any async operation** except by using the [DurableOrchestrationContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html) API or `context.df` object's API. For example, no `Task.Run`, `Task.Delay` or `HttpClient.SendAsync` in .NET, or `setTimeout()` and `setInterval()` in JavaScript. The Durable Task Framework executes orchestrator code on a single thread and cannot interact with any other threads that could be scheduled by other async APIs. | Only *durable* async calls should be made by an orchestrator function. Any other async API calls should be done from activity functions. |
| Async JavaScript functions | JavaScript orchestrator functions can't be `async` because the node.js runtime does not guarantee that async functions are deterministic. | JavaScript orchestrator functions must be declared as synchronous generator functions. |
| Threading APIs | The Durable Task Framework executes orchestrator code on a single thread and cannot interact with any other threads. Introducing new threads into an orchestration's execution can result in non-deterministic execution or deadlocks. | Threading APIs should almost never be used in orchestrator functions. If they are necessary, they should be limited to activity functions. |
| Static variables | Non-constant static variables should be avoided in orchestrator functions because their values can change over time, resulting in non-deterministic execution behavior. | Use constants or limit the use of static variables to activity functions. |
| Environment variables | Do not use environment variables in orchestrator functions. Their values can change over time, resulting in non-deterministic execution behavior. | Environment variables must only be referenced from within client functions or activity functions. |
| Infinite loops | Infinite loops should be avoided in orchestrator functions. The Durable Task Framework saves execution history as the orchestration function progresses, so an infinite loop could cause an orchestrator instance to run out of memory. | For infinite loop scenarios, use APIs such as [ContinueAsNew](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_ContinueAsNew_) (.NET) or `continueAsNew` (JavaScript) to restart the function execution and discard previous execution history. |

While these constraints may seem daunting at first, in practice they aren't hard to follow. The Durable Task Framework attempts to detect violations of the above rules and throws a `NonDeterministicOrchestrationException`. However, this detection behavior is best-effort, and you shouldn't depend on it.

## Versioning

A durable orchestration may execute continuously for days, months, years, or even [eternally](durable-functions-eternal-orchestrations.md). Any code updates made to Durable Functions applications that affect  not-yet-completed orchestrations may break their replay behavior. It is therefore important to plan carefully when making updates to code. For a more detailed description of how to version your code, see the [Versioning](durable-functions-versioning.md) article.

## Durable tasks

> [!NOTE]
> This section describes internal implementation details of the Durable Task Framework. You can use Durable Functions without knowing this information. It is intended only to help you understand the replay behavior.

Tasks that can be safely awaited in orchestrator functions are occasionally referred to as *durable tasks*. These tasks are created and managed by the Durable Task Framework. Examples are the tasks returned by `CallActivityAsync`, `WaitForExternalEvent`, and `CreateTimer` in .NET orchestrator functions.

These *durable tasks* are internally managed by using a list of `TaskCompletionSource` objects in .NET. During replay, these tasks get created as part of orchestrator code execution and are completed as the dispatcher enumerates the corresponding history events. The execution is done synchronously using a single thread until all the history has been replayed. Any durable tasks that aren't completed by the end of history replay have appropriate actions carried out. For example, a message may be enqueued to call an activity function.

The execution behavior described here should help you understand why orchestrator function code must never `await` or `yield` a non-durable task: the dispatcher thread can't wait for it to complete and any callback by that task could potentially corrupt the tracking state of the orchestrator function. Some runtime checks are in place to try to detect these violations.

If you'd like more information about how the Durable Task Framework executes orchestrator functions, the best thing to do is to consult the [Durable Task source code on GitHub](https://github.com/Azure/durabletask). In particular, see [TaskOrchestrationExecutor.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationExecutor.cs) and [TaskOrchestrationContext.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationContext.cs)

## Next steps

> [!div class="nextstepaction"]
> [Learn how to invoke sub-orchestrations](durable-functions-sub-orchestrations.md)

> [!div class="nextstepaction"]
> [Learn how to handle versioning](durable-functions-versioning.md)
