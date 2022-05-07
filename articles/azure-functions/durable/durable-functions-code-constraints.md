---
title: Durable orchestrator code constraints - Azure Functions
description: Orchestration function replay and code constraints for Azure Durable Functions.
author: cgillum
ms.topic: conceptual
ms.date: 05/06/2022
ms.author: azfuncdf
#Customer intent: As a developer, I want to learn what coding restrictions exist for durable orchestrations and why they exist so that I can avoid introducing bugs in my app logic.
---

# Orchestrator function code constraints

Durable Functions is an extension of [Azure Functions](../functions-overview.md) that lets you build stateful apps. You can use an [orchestrator function](durable-functions-orchestrations.md) to orchestrate the execution of other durable functions within a function app. Orchestrator functions are stateful, reliable, and potentially long-running.

## Orchestrator code constraints

Orchestrator functions use [event sourcing](/azure/architecture/patterns/event-sourcing) to ensure reliable execution and to maintain local variable state. The [replay behavior](durable-functions-orchestrations.md#reliability) of orchestrator code creates constraints on the type of code that you can write in an orchestrator function. For example, orchestrator functions must be *deterministic*: an orchestrator function will be replayed multiple times, and it must produce the same result each time.

### Using deterministic APIs

This section provides some simple guidelines that help ensure your code is deterministic.

Orchestrator functions can call any API in their target languages. However, it's important that orchestrator functions call only deterministic APIs. A *deterministic API* is an API that always returns the same value given the same input, no matter when or how often it's called.

The following table shows examples of APIs that you should avoid because they are *not* deterministic. These restrictions apply only to orchestrator functions. Other function types don't have such restrictions.

| API category | Reason | Workaround |
| ------------ | ------ | ---------- |
| Dates and times  | APIs that return the current date or time are nondeterministic because the returned value is different for each replay. | The Durable Task SDK for your language provides a "current time" API that can be used to get the current "orchestration time", which is deterministic and therefore safe for replay. Similarly, if you need to measure elapsed time between two points in your function, use this API to capture the current timestamp at each point and measure the time interval between them. |
| GUIDs and UUIDs  | APIs that return a random GUID or UUID are nondeterministic because the generated value is different for each replay. | The Durable Task SDK for your language provides a "new GUID" or "new UUID" API that generates a new random [Type 5 UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)) value in a way that's fully deterministic. |
| Random numbers | APIs that return random numbers are nondeterministic because the generated value is different for each replay. | Use an activity function to return random numbers to an orchestrator function. The return values of activity functions are always safe for replay because they are saved into the orchestration history. |
| Bindings | Input and output bindings are nondeterministic. An orchestrator function must not use any bindings, including even the [orchestration client](durable-functions-bindings.md#orchestration-client) and [entity client](durable-functions-bindings.md#entity-client) bindings. | Use input and output bindings inside client or activity functions. |
| Network | Network calls involve external systems and are nondeterministic. | Use activity functions to make network calls. If you need to make an HTTP call from your orchestrator function, you also can use the [durable HTTP APIs](durable-functions-http-features.md#consuming-http-apis). |
| Blocking APIs | Blocking APIs like "sleep" can cause performance and scale problems for orchestrator functions and should be avoided. In the Azure Functions Consumption plan, they can even result in unnecessary execution time charges. | Use alternatives to blocking APIs when they're available. For example, use [Durable timers](durable-functions-timers.md) to create delays that are safe for replay and don't count towards the execution time of an orchestrator function. |
| Async APIs | Orchestrator code must never start any async operation except those defined by the orchestration trigger's context object. For example, don't use `Task.Run`, `Task.Delay`, and `HttpClient.SendAsync` in .NET or `setTimeout` and `setInterval` in JavaScript. | An orchestrator function should only schedule async work using Durable SDK APIs, like scheduling activity functions. Any other type of async invocations should be done inside activity functions. |
| Async JavaScript functions | You can't declare JavaScript orchestrator functions as `async` because the Node.js runtime doesn't guarantee that asynchronous functions are deterministic. | Declare JavaScript orchestrator functions as synchronous generator functions |
| Python Coroutines | You can't declare Python orchestrator functions as coroutines, i.e declare them with the `async` keyword, because coroutine semantics do not align with the Durable Functions replay model. | Declare Python orchestrator functions as generators, meaning that you should expect the `context` API to use `yield` instead of `await`.   |
| Threading APIs | The Durable Task Framework runs orchestrator code on a single thread and can't interact with any other threads. Introducing new threads into an orchestration's execution can result in nondeterministic execution or deadlocks. | Orchestrator functions should almost never use threading APIs. For example, in .NET, avoid using `ConfigureAwait(continueOnCapturedContext: false)`; this ensures task continuations run on the orchestrator function's original `SynchronizationContext`. If such APIs are necessary, limit their use to only activity functions. |
| Static variables | Avoid using static variables in orchestrator functions because their values can change over time, resulting in nondeterministic runtime behavior. | Use constants, or limit the use of static variables to activity functions. |
| Environment variables | Don't use environment variables in orchestrator functions. Their values can change over time, resulting in nondeterministic runtime behavior. | Environment variables must be referenced only from within client functions or activity functions. |
| Infinite loops | Avoid infinite loops in orchestrator functions. Because the Durable Task Framework saves execution history as the orchestration function progresses, an infinite loop can cause an orchestrator instance to run out of memory. | For infinite loop scenarios, use the "continue as new" API, which is described in the [eternal orchestrations](durable-functions-eternal-orchestrations.md) article. |

Although applying these constraints might seem difficult at first, in practice they're easy to follow.

The Durable Task Framework attempts to detect violations of the preceding rules. If it finds a violation, the framework throws a **NonDeterministicOrchestrationException** exception. However, this detection behavior won't catch all violations, and you shouldn't depend on it.

## Versioning

A durable orchestration might run continuously for days, months, years, or even [eternally](durable-functions-eternal-orchestrations.md). Any code updates made to Durable Functions apps that affect unfinished orchestrations might break the orchestrations' replay behavior. That's why it's important to plan carefully when making updates to code. For a more detailed description of how to version your code, see the [versioning article](durable-functions-versioning.md).

## Durable tasks

> [!NOTE]
> This section describes internal implementation details of the Durable Task Framework. You can use durable functions without knowing this information. It is intended only to help you understand the replay behavior.

Tasks that can safely wait in orchestrator functions are occasionally referred to as *durable tasks*. The Durable Task Framework creates and manages these tasks. Examples are the tasks returned by **CallActivityAsync**, **WaitForExternalEvent**, and **CreateTimer** in .NET orchestrator functions.

These durable tasks are internally managed by a list of `TaskCompletionSource` objects in .NET. During replay, these tasks are created as part of orchestrator code execution. They're finished as the dispatcher enumerates the corresponding history events.

The tasks are executed synchronously using a single thread until all the history has been replayed. Durable tasks that aren't finished by the end of history replay have appropriate actions carried out. For example, a message might be enqueued to call an activity function.

This section's description of runtime behavior should help you understand why an orchestrator function can't use `await` or `yield` in a nondurable task. There are two reasons: the dispatcher thread can't wait for the task to finish, and any callback by that task might potentially corrupt the tracking state of the orchestrator function. Some runtime checks are in place to help detect these violations.

To learn more about how the Durable Task Framework executes orchestrator functions, consult the [Durable Task source code on GitHub](https://github.com/Azure/durabletask). In particular, see [TaskOrchestrationExecutor.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationExecutor.cs) and [TaskOrchestrationContext.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationContext.cs).

## Next steps

> [!div class="nextstepaction"]
> [Learn how to invoke sub-orchestrations](durable-functions-sub-orchestrations.md)

> [!div class="nextstepaction"]
> [Learn how to handle versioning](durable-functions-versioning.md)
