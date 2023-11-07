---
title: Timers in Durable Functions - Azure
description: Learn how to implement durable timers in the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.date: 12/07/2022
ms.author: azfuncdf
ms.devlang: csharp, javascript, powershell, python, java
---

# Timers in Durable Functions (Azure Functions)

[Durable Functions](durable-functions-overview.md) provides *durable timers* for use in orchestrator functions to implement delays or to set up timeouts on async actions. Durable timers should be used in orchestrator functions instead of "sleep" or "delay" APIs that may be built into the language.

Durable timers are tasks that are created using the appropriate "create timer" API for the provided language, as shown below, and take either a due time or a duration as an argument.

# [C#](#tab/csharp)

```csharp
// Put the orchestrator to sleep for 72 hours
DateTime dueTime = context.CurrentUtcDateTime.AddHours(72);
await context.CreateTimer(dueTime, CancellationToken.None);
```

# [JavaScript](#tab/javascript)

```javascript
// Put the orchestrator to sleep for 72 hours
// Note that DateTime comes from the "luxon" module
const deadline = DateTime.fromJSDate(context.df.currentUtcDateTime, {zone: 'utc'}).plus({ hours: 72 });
yield context.df.createTimer(deadline.toJSDate());
```

# [Python](#tab/python)

```python
# Put the orchestrator to sleep for 72 hours
due_time = context.current_utc_datetime + timedelta(hours=72)
durable_timeout_task = context.create_timer(due_time)
```

# [PowerShell](#tab/powershell)

```powershell
# Put the orchestrator to sleep for 72 hours
@duration = New-TimeSpan -Hours 72
Start-DurableTimer -Duration $duration
```

# [Java](#tab/java)

```java
// Put the orchestrator to sleep for 72 hours
ctx.createTimer(Duration.ofHours(72)).await();
```

---

When you "await" the timer task, the orchestrator function will sleep until the specified expiration time.

> [!NOTE]
> Orchestrations will continue to process other incoming events while waiting for a timer task to expire.

## Timer limitations

When you create a timer that expires at 4:30 pm UTC, the underlying Durable Task Framework enqueues a message that becomes visible only at 4:30 pm UTC. If the function app is scaled down to zero instances in the meantime, the newly visible timer message will ensure that the function app gets activated again on an appropriate VM.

> [!NOTE]
> * For JavaScript, Python, and PowerShell apps, Durable timers are limited to six days. To work around this limitation, you can use the timer APIs in a `while` loop to simulate a longer delay. Up-to-date .NET and Java apps support arbitrarily long timers.
> * Depending on the version of the SDK and [storage provider](durable-functions-storage-providers.md) being used, long timers of 6 days or more may be internally implemented using a series of shorter timers (e.g., of 3 day durations) until the desired expiration time is reached. This can be observed in the underlying data store but won't impact the orchestration behavior.
> * Don't use built-in date/time APIs for getting the current time. When calculating a future date for a timer to expire, always use the orchestrator function's current time API. For more information, see the [orchestrator function code constraints](durable-functions-code-constraints.md#dates-and-times) article.

## Usage for delay

The following example illustrates how to use durable timers for delaying execution. The example is issuing a billing notification every day for 10 days.

# [C#](#tab/csharp)

```csharp
[FunctionName("BillingIssuer")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    for (int i = 0; i < 10; i++)
    {
        DateTime deadline = context.CurrentUtcDateTime.Add(TimeSpan.FromDays(1));
        await context.CreateTimer(deadline, CancellationToken.None);
        await context.CallActivityAsync("SendBillingEvent");
    }
}
```

> [!NOTE]
> The previous C# example targets Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```js
const df = require("durable-functions");
const { DateTime } = require("luxon");

module.exports = df.orchestrator(function*(context) {
    for (let i = 0; i < 10; i++) {
        const deadline = DateTime.fromJSDate(context.df.currentUtcDateTime, {zone: 'utc'}).plus({ days: 1 });
        yield context.df.createTimer(deadline.toJSDate());
        yield context.df.callActivity("SendBillingEvent");
    }
});
```
# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df
from datetime import datetime, timedelta

def orchestrator_function(context: df.DurableOrchestrationContext):
    for i in range(0, 9):
        deadline = context.current_utc_datetime + timedelta(days=1)
        yield context.create_timer(deadline)
        yield context.call_activity("SendBillingEvent")

main = df.Orchestrator.create(orchestrator_function)
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

for ($num = 0 ; $num -le 9 ; $num++){    
    $expiryTime =  New-TimeSpan -Days 1
    $timerTask = Start-DurableTimer -Duration $expiryTime
    Invoke-DurableActivity -FunctionName 'SendBillingEvent'
}
```

# [Java](#tab/java)

```java
@FunctionName("BillingIssuer")
public String billingIssuer(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    for (int i = 0; i < 10; i++) {
        ctx.createTimer(Duration.ofDays(1)).await();
        ctx.callActivity("SendBillingEvent").await();
    }
    return "done";
}
```

---

> [!WARNING]
> Avoid infinite loops in orchestrator functions. For information about how to safely and efficiently implement infinite loop scenarios, see [Eternal Orchestrations](durable-functions-eternal-orchestrations.md).

## Usage for timeout

This example illustrates how to use durable timers to implement timeouts.

# [C#](#tab/csharp)

```csharp
[FunctionName("TryGetQuote")]
public static async Task<bool> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    TimeSpan timeout = TimeSpan.FromSeconds(30);
    DateTime deadline = context.CurrentUtcDateTime.Add(timeout);

    using (var cts = new CancellationTokenSource())
    {
        Task activityTask = context.CallActivityAsync("GetQuote");
        Task timeoutTask = context.CreateTimer(deadline, cts.Token);

        Task winner = await Task.WhenAny(activityTask, timeoutTask);
        if (winner == activityTask)
        {
            // success case
            cts.Cancel();
            return true;
        }
        else
        {
            // timeout case
            return false;
        }
    }
}
```

> [!NOTE]
> The previous C# example targets Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```js
const df = require("durable-functions");
const { DateTime } = require("luxon");

module.exports = df.orchestrator(function*(context) {
    const deadline = DateTime.fromJSDate(context.df.currentUtcDateTime, {zone: 'utc'}).plus({ seconds: 30 });

    const activityTask = context.df.callActivity("GetQuote");
    const timeoutTask = context.df.createTimer(deadline.toJSDate());

    const winner = yield context.df.Task.any([activityTask, timeoutTask]);
    if (winner === activityTask) {
        // success case
        timeoutTask.cancel();
        return true;
    }
    else
    {
        // timeout case
        return false;
    }
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df
from datetime import datetime, timedelta

def orchestrator_function(context: df.DurableOrchestrationContext):
    deadline = context.current_utc_datetime + timedelta(seconds=30)
    activity_task = context.call_activity("GetQuote")
    timeout_task = context.create_timer(deadline)

    winner = yield context.task_any([activity_task, timeout_task])
    if winner == activity_task:
        timeout_task.cancel()
        return True
    elif winner == timeout_task:
        return False

main = df.Orchestrator.create(orchestrator_function)
```

# [PowerShell](#tab/powershell)
```powershell
param($Context)

$expiryTime =  New-TimeSpan -Seconds 30

$activityTask = Invoke-DurableActivity -FunctionName 'GetQuote'-NoWait
$timerTask = Start-DurableTimer -Duration $expiryTime -NoWait

$winner = Wait-DurableTask -Task @($activityTask, $timerTask) -Any

if ($winner -eq $activityTask) {
    Stop-DurableTimerTask -Task $timerTask
    return $True
}
else {
    return $False
}
```

# [Java](#tab/java)

```java
@FunctionName("TryGetQuote")
public boolean tryGetQuote(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    Task<Double> activityTask = ctx.callActivity("GetQuote", Double.class);
    Task<Void> timerTask = ctx.createTimer(Duration.ofSeconds(30));

    Task<?> winner = ctx.anyOf(activityTask, timerTask);
    if (winner == activityTask) {
        // success case
        return true;
    } else {
        // timeout case
        return false;
    }
}
```

---

> [!WARNING]
> In .NET, JavaScript, Python, and PowerShell, you must cancel any created durable timers if your code will not wait for them to complete. See the examples above for how to cancel pending timers. The Durable Task Framework will not change an orchestration's status to "Completed" until all outstanding tasks, including durable timer tasks, are either completed or canceled.

This cancellation mechanism using the *when-any* pattern doesn't terminate in-progress activity function or sub-orchestration executions. Rather, it simply allows the orchestrator function to ignore the result and move on. If your function app uses the Consumption plan, you'll still be billed for any time and memory consumed by the abandoned activity function. By default, functions running in the Consumption plan have a timeout of five minutes. If this limit is exceeded, the Azure Functions host is recycled to stop all execution and prevent a runaway billing situation. The [function timeout is configurable](../functions-host-json.md#functiontimeout).

For a more in-depth example of how to implement timeouts in orchestrator functions, see the [Human Interaction & Timeouts - Phone Verification](durable-functions-phone-verification.md) article.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to raise and handle external events](durable-functions-external-events.md)
