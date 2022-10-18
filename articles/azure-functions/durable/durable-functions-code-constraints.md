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

The following sections provide guidance on APIs and patterns that you should avoid because they are *not* deterministic. These restrictions apply only to orchestrator functions. Other function types don't have such restrictions.

> [!NOTE]
> Several types of code constraints are described below. This list is unfortunately not comprehensive and some use cases might not be covered. The most important thing to consider when writing orchestrator code is whether an API you're using is deterministic. Once you're comfortable with thinking this way, it's easy to understand which APIs are safe to use and which are not without needing to refer to this documented list.

#### Dates and times

APIs that return the current date or time are nondeterministic and should never be used in orchestrator functions. This is because each orchestrator function replay will produce a different value. You should instead use the Durable Functions equivalent API for getting the current date or time, which remains consistent across replays.

# [C#](#tab/csharp)

Do not use `DateTime.Now`, `DateTime.UtcNow`, or equivalent APIs for getting the current time. Classes such as [`Stopwatch`](/dotnet/api/system.diagnostics.stopwatch) should also be avoided. For .NET in-process orchestrator functions, use the `IDurableOrchestrationContext.CurrentUtcDateTime` property to get the current time. For .NET isolated orchestrator functions, use the `TaskOrchestrationContext.CurrentDateTimeUtc` property to get the current time.

```csharp
DateTime startTime = context.CurrentUtcDateTime;
// do some work
TimeSpan totalTime = context.CurrentUtcDateTime.Subtract(startTime);
```

# [JavaScript](#tab/javascript)

Do not use APIs like `new Date()` or `Date.now()` to get the current date and time. Instead, use `DurableOrchestrationContext.currentUtcDateTime`.

```javascript
// create a timer that expires 2 minutes from now
const expiration = moment.utc(context.df.currentUtcDateTime).add(2, "m");
const timeoutTask = context.df.createTimer(expiration.toDate());
```

# [Python](#tab/python)

Do not use `datetime.now()`, `gmtime()`, or similar APIs to get the current time. Instead, use `DurableOrchestrationContext.current_utc_datetime`.

```python
# create a timer that expires 2 minutes from now
expiration = context.current_utc_datetime + timedelta(seconds=120)
timeout_task = context.create_timer(expiration)
```

# [PowerShell](#tab/powershell)

Do not use cmdlets like `Get-Date` or .NET APIs like `[System.DateTime]::Now` to get the current time. Instead, use `$Context.CurrentUtcDateTime`.

```powershell
$expiryTime = $Context.Input.ExpiryTime
while ($Context.CurrentUtcDateTime -lt $expiryTime) {
    # do work
}
```

# [Java](#tab/java)

Do not use APIs like `LocalDateTime.now()` or `Instant.now()` to get the current date and time. Instead, use `TaskOrchestrationContext.getCurrentInstant()`.

```java
Instant startTime = ctx.getCurrentInstant();
// do some work
Duration totalTime  = Duration.between(startTime, ctx.getCurrentInstant());
```

---

#### GUIDs and UUIDs

APIs that return a random GUID or UUID are nondeterministic because the generated value is different for each replay. Depending on which language you use, a built-in API for generating deterministic GUIDs or UUIDs may be available. Otherwise, use an activity function to return a randomly generated GUID or UUID.

# [C#](#tab/csharp)

Do not use APIs like `Guid.NewGuid()` to generate random GUIDs. Instead, use the context object's `NewGuid()` API to generate a random GUID that's safe for orchestrator replay.

```csharp
Guid randomGuid = context.NewGuid();
```

> [!NOTE]
> GUIDs generated with orchestration context APIs are [Type 5 UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)).


# [JavaScript](#tab/javascript)

Do not use the `uuid` module or the `crypto.randomUUID()` function to generate random UUIDs. Instead, use the context object's built-in `newGuid()` method to generate a random GUID that's safe for orchestrator replay.

```javascript
const randomGuid = context.df.newGuid();
```

> [!NOTE]
> UUIDs generated with orchestration context APIs are [Type 5 UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)).


# [Python](#tab/python)

Do not use the `uuid` module to generate random UUIDs. Instead, use the context object's built-in `new_guid()` method to generate a random UUID that's safe for orchestrator replay.

```python
randomGuid = context.new_guid()
```

> [!NOTE]
> UUIDs generated with orchestration context APIs are [Type 5 UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)).

# [PowerShell](#tab/powershell)

Do not use cmdlets like `New-Guid` or .NET APIs like `[System.Guid]::NewGuid()` directly in orchestrator functions. Instead, generate random GUIDs in activity functions and return them to the orchestrator functions.

# [Java](#tab/java)

Do not use the `java.util.UUID.randomUUID()` or similar methods for generating new UUIDs directly in orchestrator functions. Instead, generate random UUIDs in activity functions and return them to the orchestrator functions.

---

#### Random numbers

 Use an activity function to return random numbers to an orchestrator function. The return values of activity functions are always safe for replay because they are saved into the orchestration history.

 Alternatively, a random number generator with a fixed seed value can be used directly in an orchestrator function. This approach is safe as long as the same sequence of numbers is generated for each orchestration replay.

#### Bindings

An orchestrator function must not use any bindings, including even the [orchestration client](durable-functions-bindings.md#orchestration-client) and [entity client](durable-functions-bindings.md#entity-client) bindings. Always use input and output bindings from within a client or activity function. This is important because orchestrator functions may be replayed multiple times, causing nondeterministic and duplicate I/O with external systems.

#### Static variables

Avoid using static variables in orchestrator functions because their values can change over time, resulting in nondeterministic runtime behavior. Instead, use constants, or limit the use of static variables to activity functions.

> [!NOTE]
> Even outside of orchestrator functions, using static variables in Azure Functions can be problematic for a variety of reasons since there's no guarantee that static state will persist across multiple function executions. Static variables should be avoided except in very specific usecases, such as best-effort in-memory caching in activity or entity functions.

#### Environment variables

Do not use environment variables in orchestrator functions. Their values can change over time, resulting in nondeterministic runtime behavior. If an orchestrator function needs configuration that's defined in an environment variable, you must pass the configuration value into the orchestrator function as an input or as the return value of an activity function.

#### Network and HTTP

Use activity functions to make outbound network calls. If you need to make an HTTP call from your orchestrator function, you also can use the [durable HTTP APIs](durable-functions-http-features.md#consuming-http-apis).

#### Thread-blocking APIs

Blocking APIs like "sleep" can cause performance and scale problems for orchestrator functions and should be avoided. In the Azure Functions Consumption plan, they can even result in unnecessary execution time charges. Use alternatives to blocking APIs when they're available. For example, use [Durable timers](durable-functions-timers.md) to create delays that are safe for replay and don't count towards the execution time of an orchestrator function.

#### Async APIs

Orchestrator code must never start any async operation except those defined by the orchestration trigger's context object. For example, never use `Task.Run`, `Task.Delay`, and `HttpClient.SendAsync` in .NET or `setTimeout` and `setInterval` in JavaScript. An orchestrator function should only schedule async work using Durable SDK APIs, like scheduling activity functions. Any other type of async invocations should be done inside activity functions.

#### Async JavaScript functions

Always declare JavaScript orchestrator functions as synchronous generator functions. You must not declare JavaScript orchestrator functions as `async` because the Node.js runtime doesn't guarantee that asynchronous functions are deterministic.

#### Python coroutines

You must not declare Python orchestrator functions as coroutines. In other words, never declare Python orchestrator functions with the `async` keyword because coroutine semantics do not align with the Durable Functions replay model. You must always declare Python orchestrator functions as generators, meaning that you should expect the `context` API to use `yield` instead of `await`.

#### .NET threading APIs

The Durable Task Framework runs orchestrator code on a single thread and can't interact with any other threads. Running async continuations on a worker pool thread an orchestration's execution can result in nondeterministic execution or deadlocks. For this reason, orchestrator functions should almost never use threading APIs. For example, never use `ConfigureAwait(continueOnCapturedContext: false)` in an orchestrator function. This ensures that task continuations run on the orchestrator function's original `SynchronizationContext`.

> [!NOTE]
> The Durable Task Framework attempts to detect accidental use of non-orchestrator threads in orchestrator functions. If it finds a violation, the framework throws a **NonDeterministicOrchestrationException** exception. However, this detection behavior won't catch all violations, and you shouldn't depend on it.

## Versioning

A durable orchestration might run continuously for days, months, years, or even [eternally](durable-functions-eternal-orchestrations.md). Any code updates made to Durable Functions apps that affect unfinished orchestrations might break the orchestrations' replay behavior. That's why it's important to plan carefully when making updates to code. For a more detailed description of how to version your code, see the [versioning article](durable-functions-versioning.md).

## Durable tasks

> [!NOTE]
> This section describes internal implementation details of the Durable Task Framework. You can use durable functions without knowing this information. It is intended only to help you understand the replay behavior.

Tasks that can safely wait in orchestrator functions are occasionally referred to as *durable tasks*. The Durable Task Framework creates and manages these tasks. Examples are the tasks returned by `CallActivityAsync`, `WaitForExternalEvent`, and `CreateTimer` in .NET orchestrator functions.

These durable tasks are internally managed by a list of `TaskCompletionSource` objects in .NET. During replay, these tasks are created as part of orchestrator code execution. They're finished as the dispatcher enumerates the corresponding history events.

The tasks are executed synchronously using a single thread until all the history has been replayed. Durable tasks that aren't finished by the end of history replay have appropriate actions carried out. For example, a message might be enqueued to call an activity function.

This section's description of runtime behavior should help you understand why an orchestrator function can't use `await` or `yield` in a nondurable task. There are two reasons: the dispatcher thread can't wait for the task to finish, and any callback by that task might potentially corrupt the tracking state of the orchestrator function. Some runtime checks are in place to help detect these violations.

To learn more about how the Durable Task Framework executes orchestrator functions, consult the [Durable Task source code on GitHub](https://github.com/Azure/durabletask). In particular, see [TaskOrchestrationExecutor.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationExecutor.cs) and [TaskOrchestrationContext.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationContext.cs).

## Next steps

> [!div class="nextstepaction"]
> [Learn how to invoke sub-orchestrations](durable-functions-sub-orchestrations.md)

> [!div class="nextstepaction"]
> [Learn how to handle versioning](durable-functions-versioning.md)
