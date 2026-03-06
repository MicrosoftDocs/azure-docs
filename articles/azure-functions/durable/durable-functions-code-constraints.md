---
title: Durable orchestrator code constraints
description: Orchestration replay and code constraints for Azure Durable Functions and Durable Task SDKs.
author: cgillum
ms.topic: conceptual
ms.date: 02/04/2026
ms.author: azfuncdf
ms.service: azure-functions
ms.subservice: durable
zone_pivot_groups: azure-durable-approach
#Customer intent: As a developer, I want to learn what coding restrictions exist for durable orchestrations and why they exist so that I can avoid introducing bugs in my app logic.
---

# Orchestrator function code constraints

::: zone pivot="durable-functions"

Build stateful apps with Durable Functions. It's an extension of [Azure Functions](../functions-overview.md). Use an [orchestrator function](durable-functions-orchestrations.md) to coordinate other Durable Functions in your function app. Orchestrator functions are stateful, reliable, and they're built to run for a long time.

::: zone-end

::: zone pivot="durable-task-sdks"

Build stateful, fault-tolerant workflows with the Durable Task SDKs in .NET, Python, and Java. Use an orchestrator to coordinate activities and sub-orchestrations. Orchestrators are stateful, reliable, and they're built to run for a long time.

::: zone-end



## Orchestrator code constraints

::: zone pivot="durable-functions"

Orchestrator functions use [event sourcing](/azure/architecture/patterns/event-sourcing) to ensure reliable execution and to maintain local variable state. The [replay behavior](durable-functions-orchestrations.md#reliability) of orchestrator code creates constraints on the type of code you can write in an orchestrator function. For example, orchestrator functions must be *deterministic*: an orchestrator function replays multiple times, and it must produce the same result each time.

::: zone-end

::: zone pivot="durable-task-sdks"

Orchestrators use [event sourcing](/azure/architecture/patterns/event-sourcing) to ensure reliable execution and to maintain local variable state. The replay behavior of orchestrator code creates constraints on the type of code you can write in an orchestrator. For example, orchestrators must be *deterministic*: an orchestrator replays multiple times, and it must produce the same result each time.

::: zone-end

### Use deterministic APIs

::: zone pivot="durable-functions"

Here are some simple guidelines to help ensure your code is deterministic.

Call APIs from your target languages in orchestrator functions, but use only deterministic APIs. A *deterministic API* always returns the same value for the same input, no matter when or how often it's called.

The following sections provide guidance on APIs and patterns you should avoid because they're *not* deterministic. These restrictions apply only to orchestrator functions. Other function types don't have such restrictions.

::: zone-end

::: zone pivot="durable-task-sdks"

Here are some simple guidelines to help ensure your code is deterministic.

Call APIs from your target languages in orchestrators, but use only deterministic APIs. A *deterministic API* always returns the same value for the same input, no matter when or how often it's called.

The following sections provide guidance on APIs and patterns you should avoid because they're *not* deterministic. These restrictions apply only to orchestrators. Activities don't have such restrictions.

::: zone-end

> [!NOTE]
> This article covers common orchestrator code constraints, but it isn't comprehensive. Focus on whether an API is deterministic. With that mindset, you can usually tell which APIs are safe to use without referring to this list.

#### Dates and times

::: zone pivot="durable-functions"

Time-based APIs are nondeterministic and should never be used in orchestrator functions. Each orchestrator function replay produces a different value. Instead, use the Durable Functions equivalent API for getting the current date or time, which remains consistent across replays.

# [C#](#tab/csharp)

Don't use `DateTime.Now`, `DateTime.UtcNow`, or equivalent APIs for getting the current time. Classes such as [`Stopwatch`](/dotnet/api/system.diagnostics.stopwatch) should also be avoided. For .NET in-process orchestrator functions, use the `IDurableOrchestrationContext.CurrentUtcDateTime` property to get the current time. For .NET isolated orchestrator functions, use the `TaskOrchestrationContext.CurrentDateTimeUtc` property to get the current time.

```csharp
DateTime startTime = context.CurrentUtcDateTime;
// do some work
TimeSpan totalTime = context.CurrentUtcDateTime.Subtract(startTime);
```

# [JavaScript](#tab/javascript)

Don't use APIs like `new Date()` or `Date.now()` to get the current date and time. Instead, use `DurableOrchestrationContext.currentUtcDateTime`.

```javascript
// create a timer that expires 2 minutes from now
const expiration = moment.utc(context.df.currentUtcDateTime).add(2, "m");
const timeoutTask = context.df.createTimer(expiration.toDate());
```

# [Python](#tab/python)

Don't use `datetime.now()`, `gmtime()`, or similar APIs to get the current time. Instead, use `DurableOrchestrationContext.current_utc_datetime`.

```python
# create a timer that expires 2 minutes from now
expiration = context.current_utc_datetime + timedelta(seconds=120)
timeout_task = context.create_timer(expiration)
```

# [PowerShell](#tab/powershell)

Don't use cmdlets like `Get-Date` or .NET APIs like `[System.DateTime]::Now` to get the current time. Instead, use `$Context.CurrentUtcDateTime`.

```powershell
$expiryTime = $Context.Input.ExpiryTime
while ($Context.CurrentUtcDateTime -lt $expiryTime) {
    # do work
}
```

# [Java](#tab/java)

Don't use APIs like `LocalDateTime.now()` or `Instant.now()` to get the current date and time. Instead, use `TaskOrchestrationContext.getCurrentInstant()`.

```java
Instant startTime = ctx.getCurrentInstant();
// do some work
Duration totalTime  = Duration.between(startTime, ctx.getCurrentInstant());
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

Time-based APIs are nondeterministic and should never be used in orchestrators. Each orchestrator replay produces a different value. Instead, use the Durable Task SDK equivalent API for getting the current date or time, which remains consistent across replays.

# [C#](#tab/csharp)

Don't use `DateTime.Now`, `DateTime.UtcNow`, or equivalent APIs for getting the current time. Classes such as [`Stopwatch`](/dotnet/api/system.diagnostics.stopwatch) should also be avoided. Use the `TaskOrchestrationContext.CurrentUtcDateTime` property to get the current time.

```csharp
using Microsoft.DurableTask;

public class TimerExample : TaskOrchestrator<object?, TimeSpan>
{
    public override async Task<TimeSpan> RunAsync(TaskOrchestrationContext context, object? input)
    {
        // Use context.CurrentUtcDateTime instead of DateTime.Now or DateTime.UtcNow
        DateTime startTime = context.CurrentUtcDateTime;

        // do some work
        await context.CallActivityAsync("DoWork", null);

        TimeSpan totalTime = context.CurrentUtcDateTime.Subtract(startTime);
        return totalTime;
    }
}
```

# [JavaScript](#tab/javascript)

This sample is shown for .NET, Java, and Python.

# [Python](#tab/python)

Don't use `datetime.now()`, `datetime.utcnow()`, or similar APIs to get the current time. Instead, use `ctx.current_utc_datetime`.

```python
from durabletask import task
from datetime import timedelta

def timer_example(ctx: task.OrchestrationContext, _):
    # Use ctx.current_utc_datetime instead of datetime.now() or datetime.utcnow()
    start_time = ctx.current_utc_datetime

    # Create a timer that expires 2 minutes from now
    expiration = ctx.current_utc_datetime + timedelta(minutes=2)
    yield ctx.create_timer(expiration)

    return "Timer completed"
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, Java, and Python.

# [Java](#tab/java)

Don't use APIs like `LocalDateTime.now()` or `Instant.now()` to get the current date and time. Instead, use `ctx.getCurrentInstant()`.

```java
import com.microsoft.durabletask.TaskOrchestration;
import com.microsoft.durabletask.TaskOrchestrationContext;
import java.time.Duration;
import java.time.Instant;

public class TimerExample implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        // Use ctx.getCurrentInstant() instead of Instant.now() or LocalDateTime.now()
        Instant startTime = ctx.getCurrentInstant();

        // do some work
        ctx.callActivity("DoWork", null, Void.class).await();

        Duration totalTime = Duration.between(startTime, ctx.getCurrentInstant());
        ctx.complete(totalTime);
    }
}
```

---

::: zone-end

#### GUIDs and UUIDs

::: zone pivot="durable-functions"

APIs that return a random GUID or UUID are nondeterministic because the generated value is different for each replay. Depending on your language, a built-in API for generating deterministic GUIDs or UUIDs might be available. Otherwise, use an activity function to return a randomly generated GUID or UUID.

# [C#](#tab/csharp)

Instead of APIs like `Guid.NewGuid()`, use the context object's `NewGuid()` API to generate a random GUID that's safe for orchestrator replay.

```csharp
Guid randomGuid = context.NewGuid();
```

> [!NOTE]
> GUIDs generated with orchestration context APIs are [Type 5 UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)).


# [JavaScript](#tab/javascript)

Instead of the `uuid` module or the `crypto.randomUUID()` function, use the context object's built-in `newGuid()` method to generate a random GUID that's safe for orchestrator replay.

```javascript
const randomGuid = context.df.newGuid();
```

> [!NOTE]
> UUIDs generated with orchestration context APIs are [Type 5 UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)).


# [Python](#tab/python)

Instead of the `uuid` module, use the context object's built-in `new_guid()` method to generate a random UUID that's safe for orchestrator replay.

```python
randomGuid = context.new_guid()
```

> [!NOTE]
> UUIDs generated with orchestration context APIs are [Type 5 UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)).

# [PowerShell](#tab/powershell)

Generate random GUIDs in activity functions and return them to orchestrator functions, instead of using cmdlets like `New-Guid` or .NET APIs like `[System.Guid]::NewGuid()` directly in orchestrator functions.

# [Java](#tab/java)

Instead of `java.util.UUID.randomUUID()` or similar methods, generate random UUIDs in activity functions and return them to the orchestrator functions.

---

::: zone-end

::: zone pivot="durable-task-sdks"

APIs that return a random GUID or UUID are nondeterministic because the generated value is different for each replay. Depending on your language, a built-in API for generating deterministic GUIDs or UUIDs might be available. Otherwise, use an activity to return a randomly generated GUID or UUID.

# [C#](#tab/csharp)

Instead of APIs like `Guid.NewGuid()`, use the context object's `NewGuid()` API to generate a random GUID that's safe for orchestrator replay.

```csharp
using Microsoft.DurableTask;

public class GuidExample : TaskOrchestrator<object?, Guid>
{
    public override async Task<Guid> RunAsync(TaskOrchestrationContext context, object? input)
    {
        // Use context.NewGuid() instead of Guid.NewGuid()
        Guid randomGuid = context.NewGuid();
        return randomGuid;
    }
}
```

> [!NOTE]
> GUIDs generated with orchestration context APIs are [Type 5 UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)).

# [JavaScript](#tab/javascript)

This sample is shown for .NET, Java, and Python.

# [Python](#tab/python)

Instead of the `uuid` module, use the context object's built-in `new_uuid()` method to generate a random UUID that's safe for orchestrator replay.

```python
from durabletask import task

def guid_example(ctx: task.OrchestrationContext, _):
    # Use ctx.new_uuid() instead of uuid.uuid4()
    random_guid = ctx.new_uuid()
    return str(random_guid)
```

> [!NOTE]
> UUIDs generated with orchestration context APIs are [Type 5 UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)).

# [PowerShell](#tab/powershell)

This sample is shown for .NET, Java, and Python.

# [Java](#tab/java)

Instead of `java.util.UUID.randomUUID()`, use the context object's `newUUID()` method to generate a random UUID that's safe for orchestrator replay.

```java
import com.microsoft.durabletask.TaskOrchestration;
import com.microsoft.durabletask.TaskOrchestrationContext;
import java.util.UUID;

public class GuidExample implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        // Use ctx.newUUID() instead of UUID.randomUUID()
        UUID randomGuid = ctx.newUUID();
        ctx.complete(randomGuid.toString());
    }
}
```

> [!NOTE]
> UUIDs generated with orchestration context APIs are [Type 5 UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)).

---

::: zone-end

#### Random numbers

::: zone pivot="durable-functions"

Use an activity function to return random numbers to an orchestrator function. The return values of activity functions are always safe for replay because they're saved into the orchestration history.

Alternatively, you can use a random number generator with a fixed seed value directly in an orchestrator function. This approach is safe as long as the same sequence of numbers is generated for each orchestration replay.

::: zone-end

::: zone pivot="durable-task-sdks"

Use an activity to return random numbers to an orchestrator. The return values of activities are always safe for replay because they're saved into the orchestration history.

Alternatively, you can use a random number generator with a fixed seed value directly in an orchestrator. This approach is safe as long as the same sequence of numbers is generated for each orchestration replay.

::: zone-end

#### Bindings

::: zone pivot="durable-functions"

Don't use bindings in an orchestrator function, including the [orchestration client](durable-functions-bindings.md#orchestration-client) and [entity client](durable-functions-bindings.md#entity-client) bindings. Use input and output bindings only in a client or activity function. Orchestrator functions can replay multiple times, causing nondeterministic and duplicate I/O with external systems.

::: zone-end

::: zone pivot="durable-task-sdks"

Orchestrators shouldn't perform direct I/O operations with external systems. Move I/O operations to activities. Orchestrators can replay multiple times, causing nondeterministic and duplicate I/O with external systems.

::: zone-end

#### Static variables

::: zone pivot="durable-functions"

Static variables can change over time, making them unsafe for orchestrator functions. Avoid using static variables in orchestrator functions because their values can change over time, resulting in nondeterministic runtime behavior. Instead, use constants, or limit the use of static variables to activity functions.

::: zone-end

::: zone pivot="durable-task-sdks"

Static variables can change over time, making them unsafe for orchestrators. Avoid using static variables in orchestrators because their values can change over time, resulting in nondeterministic runtime behavior. Instead, use constants, or limit the use of static variables to activities.

::: zone-end

> [!NOTE]
> Even outside of orchestrator functions, using static variables in Azure Functions can be problematic for various reasons since there's no guarantee that static state persists across multiple function executions. Avoid static variables except in specific use cases, like best effort in-memory caching in activity or entity functions.

#### Environment variables

::: zone pivot="durable-functions"

Environment variables in orchestrator functions can change over time, resulting in nondeterministic runtime behavior. If an orchestrator function needs configuration defined in an environment variable, you must pass the configuration value into the orchestrator function as an input or as the return value of an activity function.

::: zone-end

::: zone pivot="durable-task-sdks"

Environment variables in orchestrators can change over time, resulting in nondeterministic runtime behavior. If an orchestrator needs configuration defined in an environment variable, you must pass the configuration value into the orchestrator as an input or as the return value of an activity.

::: zone-end

#### Network and HTTP

::: zone pivot="durable-functions"

Use activity functions to make outbound network calls. If you need to make an HTTP call from your orchestrator function, you can also use the [durable HTTP APIs](durable-functions-http-features.md#consuming-http-apis).

::: zone-end

::: zone pivot="durable-task-sdks"

Use activities to make outbound network calls. Orchestrators should never make direct HTTP calls or other network requests because these operations are nondeterministic.

::: zone-end

#### Thread-blocking APIs

::: zone pivot="durable-functions"

Blocking APIs like `sleep` can cause performance and scale problems for orchestrator functions and can result in unnecessary execution time charges in the Azure Functions Consumption plan. Use alternatives when they're available. For example, use [Durable timers](durable-functions-timers.md) to create delays that are safe for replay and don't count toward orchestrator execution time.

::: zone-end

::: zone pivot="durable-task-sdks"

Blocking APIs like "sleep" can cause performance and scale problems for orchestrators and should be avoided. Use durable timers to create delays that are safe for replay.

# [C#](#tab/csharp)

Use `context.CreateTimer()` instead of `Task.Delay()` or `Thread.Sleep()`.

```csharp
// Don't use Task.Delay() or Thread.Sleep()
// Use context.CreateTimer() instead
await context.CreateTimer(context.CurrentUtcDateTime.AddMinutes(5), CancellationToken.None);
```

# [JavaScript](#tab/javascript)

This sample is shown for .NET, Java, and Python.

# [Python](#tab/python)

Use `ctx.create_timer()` instead of `time.sleep()` or `asyncio.sleep()`.

```python
from durabletask import task
from datetime import timedelta

def delay_example(ctx: task.OrchestrationContext, _):
    # Don't use time.sleep() or asyncio.sleep()
    # Use ctx.create_timer() instead
    fire_at = ctx.current_utc_datetime + timedelta(minutes=5)
    yield ctx.create_timer(fire_at)
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, Java, and Python.

# [Java](#tab/java)

Use `ctx.createTimer()` instead of `Thread.sleep()`.

```java
// Don't use Thread.sleep()
// Use ctx.createTimer() instead
ctx.createTimer(Duration.ofMinutes(5)).await();
```

---

::: zone-end

#### Async APIs

::: zone pivot="durable-functions"

Orchestrator code must never start any async operation, except operations defined by the orchestration trigger's context object. For example, never use `Task.Run`, `Task.Delay`, and `HttpClient.SendAsync` in .NET or `setTimeout` and `setInterval` in JavaScript. An orchestrator function should only schedule async work using Durable SDK APIs, like scheduling activity functions. Any other type of async invocations should be done inside activity functions.

::: zone-end

::: zone pivot="durable-task-sdks"

Orchestrator code must never start any async operation, except operations defined by the orchestration context object. For example, never use `Task.Run`, `Task.Delay`, and `HttpClient.SendAsync` in .NET. An orchestrator should only schedule async work using Durable Task SDK APIs, like scheduling activities. Any other type of async invocations should be done inside activities.

::: zone-end

::: zone pivot="durable-functions"

#### Async JavaScript functions

Declare JavaScript orchestrator functions as synchronous generator functions. Don't declare JavaScript orchestrator functions as `async` because the Node.js runtime doesn't guarantee deterministic behavior for `async` functions.

::: zone-end

#### Python coroutines

::: zone pivot="durable-functions"

Don't declare Python orchestrator functions as coroutines. Don't use the `async` keyword because coroutine semantics don't align with the Durable Functions replay model. Declare Python orchestrator functions as generators, and use `yield` instead of `await` with the `context` API.

::: zone-end

::: zone pivot="durable-task-sdks"

You must not declare Python orchestrators as coroutines. In other words, never declare Python orchestrators with the `async` keyword because coroutine semantics don't align with the Durable Task replay model. You must always declare Python orchestrators as generators, meaning that you should use `yield` instead of `await` when calling context APIs.

```python
from durabletask import task

# CORRECT - use yield (generator function)
def my_orchestrator(ctx: task.OrchestrationContext, input: str):
    result = yield ctx.call_activity(my_activity, input=input)
    return result

# WRONG - don't use async/await
async def bad_orchestrator(ctx: task.OrchestrationContext, input: str):
    result = await ctx.call_activity(my_activity, input=input)  # This won't work!
    return result
```

::: zone-end

#### .NET threading APIs

::: zone pivot="durable-functions"

The Durable Task Framework runs orchestrator code on a single thread and can't interact with any other threads. Running async continuations on a worker pool thread in an orchestration's execution can result in nondeterministic execution or deadlocks. For this reason, your orchestrator functions should almost never use threading APIs. For example, never use `ConfigureAwait(continueOnCapturedContext: false)` in an orchestrator function to ensure task continuations run on the orchestrator function's original `SynchronizationContext`.

> [!NOTE]
> The Durable Task Framework attempts to detect accidental use of nonorchestrator threads in orchestrator functions. If it finds a violation, the framework throws a **NonDeterministicOrchestrationException** exception. However, this detection behavior won't catch all violations, and you shouldn't depend on it.

::: zone-end

::: zone pivot="durable-task-sdks"

The Durable Task Framework runs orchestrator code on a single thread and can't interact with any other threads. Running async continuations on a worker pool thread in an orchestration's execution can result in nondeterministic execution or deadlocks. For this reason, your orchestrators should almost never use threading APIs. For example, never use `ConfigureAwait(continueOnCapturedContext: false)` in an orchestrator to ensure task continuations run on the orchestrator's original `SynchronizationContext`.

> [!NOTE]
> The Durable Task Framework attempts to detect accidental use of nonorchestrator threads in orchestrators. If it finds a violation, the framework throws a **NonDeterministicOrchestrationException** exception. However, this detection behavior won't catch all violations, and you shouldn't depend on it.

::: zone-end

## Versioning

::: zone pivot="durable-functions"

A durable orchestration can run for days, months, years, or even as an [eternal orchestration](durable-functions-eternal-orchestrations.md). Code changes that affect running orchestrations can break replay behavior, so plan carefully before you update your app. For more information, see [Versioning](durable-functions-versioning.md).

::: zone-end

::: zone pivot="durable-task-sdks"

A durable orchestration can run for days, months, years, or even indefinitely. Code changes that affect running orchestrations can break replay behavior, so plan carefully before you update your app. Common versioning strategies include side by side deployment and using version specific task hub names.

::: zone-end

## Durable tasks

> [!NOTE]
> This section describes internal implementation details of the Durable Task Framework. You don't need to know this information to use Durable Functions, but it helps explain the replay behavior.

::: zone pivot="durable-functions"

Tasks that can safely wait in orchestrator functions are sometimes called *durable tasks*. The Durable Task Framework creates and manages these tasks. Examples include the tasks returned by `CallActivityAsync`, `WaitForExternalEvent`, and `CreateTimer` in .NET orchestrator functions.

A list of `TaskCompletionSource` objects in .NET manages these durable tasks internally. During replay, orchestrator code creates these tasks. The dispatcher completes them as it enumerates the corresponding history events.

The runtime executes the tasks synchronously on a single thread until it replays the history. If a durable task doesn't finish by the end of history replay, the runtime takes the appropriate actions. For example, the runtime can enqueue a message to call an activity function.

This runtime behavior explains why your orchestrator function can't use `await` or `yield` in a nondurable task. The dispatcher thread can't wait for the task to finish, and callbacks from that task can corrupt the orchestrator function's tracking state. The runtime includes checks to help detect these violations.

To learn more about how the Durable Task Framework executes orchestrator functions, see the [Durable Task source code on GitHub](https://github.com/Azure/durabletask). In particular, see [TaskOrchestrationExecutor.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationExecutor.cs) and [TaskOrchestrationContext.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationContext.cs).

::: zone-end

::: zone pivot="durable-task-sdks"

Tasks that can safely wait in orchestrators are sometimes called *durable tasks*. The Durable Task Framework creates and manages these tasks. Examples include the tasks returned by `CallActivityAsync`, `WaitForExternalEvent`, and `CreateTimer` in .NET orchestrators.

A list of `TaskCompletionSource` objects in .NET manages these durable tasks internally. During replay, orchestrator code creates these tasks. The dispatcher completes them as it enumerates the corresponding history events.

The runtime executes the tasks synchronously on a single thread until it replays the history. If a durable task doesn't finish by the end of history replay, the runtime takes the appropriate actions. For example, the runtime can enqueue a message to call an activity.

This runtime behavior explains why your orchestrator can't use `await` or `yield` in a nondurable task. The dispatcher thread can't wait for the task to finish, and callbacks from that task can corrupt the orchestrator's tracking state. The runtime includes checks to help detect these violations.

To learn more about how the Durable Task Framework executes orchestrators, see the [Durable Task source code on GitHub](https://github.com/Azure/durabletask). In particular, see [TaskOrchestrationExecutor.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationExecutor.cs) and [TaskOrchestrationContext.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationContext.cs).

::: zone-end

## Next steps

::: zone pivot="durable-functions"

> [!div class="nextstepaction"]
> [Learn how to invoke suborchestrations](durable-functions-sub-orchestrations.md)

> [!div class="nextstepaction"]
> [Learn how to handle versioning](durable-functions-versioning.md)

::: zone-end

::: zone pivot="durable-task-sdks"

> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](durable-task-scheduler/quickstart-portable-durable-task-sdks.md)

::: zone-end
