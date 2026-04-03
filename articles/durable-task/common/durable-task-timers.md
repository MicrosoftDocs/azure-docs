---
author: hhunter-ms
title: Durable Timers
description: Learn how to implement durable timers in Durable Functions and Durable Task SDKs.
ms.topic: feature-guide
ms.service: durable-task
ms.date: 01/28/2026
ms.author: azfuncdf
ms.devlang: csharp
# ms.devlang: csharp, javascript, powershell, python, java
zone_pivot_groups: azure-durable-approach
---

# Durable timers

::: zone pivot="durable-functions"
[Durable Functions](what-is-durable-task.md) provides *durable timers* for use in orchestrator functions to implement delays or to set up timeouts on async actions. Use durable timers in orchestrator functions instead of `sleep` or `delay` APIs that might be built into the language.
::: zone-end

::: zone pivot="durable-task-sdks"
Durable Task SDKs provide *durable timers* for use in orchestrations to implement delays or to set up timeouts on async actions. Use durable timers in orchestrations instead of `sleep` or `delay` APIs that might be built into the language.

[!INCLUDE [preview-sample-limitations](../scheduler/includes/preview-sample-limitations.md)]

::: zone-end

Durable timers are tasks created using the appropriate `create timer` API for the provided language, as shown in the following examples, and take either a due time or a duration as an argument.

::: zone pivot="durable-functions"

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
$duration = New-TimeSpan -Hours 72
Start-DurableTimer -Duration $duration
```

# [Java](#tab/java)

```java
// Put the orchestrator to sleep for 72 hours
ctx.createTimer(Duration.ofHours(72)).await();
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
// Put the orchestration to sleep for 72 hours
await context.CreateTimer(TimeSpan.FromHours(72), CancellationToken.None);
```

# [Python](#tab/python)

```python
# Put the orchestration to sleep for 72 hours
from datetime import timedelta
yield ctx.create_timer(timedelta(hours=72))
```

# [Java](#tab/java)

```java
// Put the orchestration to sleep for 72 hours
ctx.createTimer(Duration.ofHours(72)).await();
```

# [JavaScript](#tab/javascript)

```typescript
// Put the orchestration to sleep for 72 hours
yield ctx.createTimer(72 * 60 * 60);
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

::: zone pivot="durable-functions"
When you `await` the timer task, the orchestrator function sleeps until the specified expiration time.
::: zone-end

::: zone pivot="durable-task-sdks"
When you `await` the timer task, the orchestration sleeps until the specified expiration time.
::: zone-end

> [!NOTE]
> Orchestrations continue to process other incoming events while waiting for a timer task to expire.

## Timer limitations

::: zone pivot="durable-functions"
When you create a timer that expires at 4:30 pm UTC, the underlying Durable Task Framework enqueues a message that becomes visible only at 4:30 PM UTC. If the function app is scaled down to zero instances in the meantime, the newly visible timer message ensures that the function app activates again on an appropriate VM.

> [!NOTE]
> * For JavaScript, Python, and PowerShell apps, durable timers are limited to six days. To work around this limitation, use the timer APIs in a `while` loop to simulate a longer delay. Up-to-date .NET and Java apps support arbitrarily long timers.
> * Depending on the version of the SDK and [storage provider](durable-task-storage-providers.md) being used, long timers of six days or more might be internally implemented using a series of shorter timers (for example, of three-day durations) until the desired expiration time is reached. This behavior is observable in the underlying data store but doesn't affect orchestration behavior.
> * Don't use built-in date/time APIs to get the current time. When calculating a future date for a timer to expire, always use the orchestrator function's current time API. For more information, see the [orchestrator function code constraints](durable-task-code-constraints.md#dates-and-times) article.
::: zone-end

::: zone pivot="durable-task-sdks"
When you create a timer that expires at 4:30 pm UTC, the underlying Durable Task Framework enqueues a message that becomes visible only at 4:30 PM UTC. The timer message ensures that the worker activates again when the timer expires.

> [!NOTE]
> * Specifying a long delay (for example, a delay of a few days or more) might result in the creation of multiple, internally managed durable timers. The orchestration code doesn't need to be aware of this behavior. However, it might be visible in framework logs and the stored history state.
> * Don't use built-in date and time APIs to get the current time. When calculating a future date for a timer to expire, always use the orchestration context's current time property (like `context.CurrentUtcDateTime` in .NET, `ctx.current_utc_datetime` in Python, or `ctx.currentUtcDateTime` in JavaScript).
::: zone-end

## Usage for delays

The following example shows how to use durable timers to delay execution. The example issues a billing notification every day for 10 days.

::: zone pivot="durable-functions"

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
> The preceding C# example targets Durable Functions 2.x. For Durable Functions 1.x, use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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
    $expiryTime = New-TimeSpan -Days 1
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

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
public class BillingIssuer : TaskOrchestrator<object?, string>
{
    public override async Task<string> RunAsync(TaskOrchestrationContext context, object? input)
    {
        for (int i = 0; i < 10; i++)
        {
            await context.CreateTimer(TimeSpan.FromDays(1), CancellationToken.None);
            await context.CallActivityAsync("SendBillingEvent");
        }
        return "done";
    }
}
```

# [Python](#tab/python)

```python
from datetime import timedelta
from durabletask import task

def send_billing_event(ctx: task.ActivityContext, _) -> None:
    # Send billing event
    pass

def billing_issuer(ctx: task.OrchestrationContext, _):
    for i in range(10):
        yield ctx.create_timer(timedelta(days=1))
        yield ctx.call_activity(send_billing_event)
    return "done"
```

# [Java](#tab/java)

```java
public class BillingIssuer implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        for (int i = 0; i < 10; i++) {
            ctx.createTimer(Duration.ofDays(1)).await();
            ctx.callActivity("SendBillingEvent").await();
        }
        ctx.complete("done");
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext, OrchestrationContext, TOrchestrator } from "@microsoft/durabletask-js";

const sendBillingEvent = async (_: ActivityContext): Promise<void> => {
    // Send billing event
};

const billingIssuer: TOrchestrator = async function* (ctx: OrchestrationContext): any {
    for (let i = 0; i < 10; i++) {
        yield ctx.createTimer(24 * 60 * 60); // 1 day
        yield ctx.callActivity(sendBillingEvent);
    }
    return "done";
};
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

::: zone pivot="durable-functions"
> [!WARNING]
> Avoid infinite loops in orchestrator functions. For information about how to safely and efficiently implement infinite loop scenarios, see [Eternal orchestrations](durable-task-eternal-orchestrations.md).
::: zone-end

::: zone pivot="durable-task-sdks"
> [!WARNING]
> Avoid infinite loops in orchestrations. For information about how to safely and efficiently implement infinite loop scenarios, see [Eternal orchestrations](durable-task-eternal-orchestrations.md).
::: zone-end

## Usage for timeouts

This example shows how to use durable timers to implement timeouts:

::: zone pivot="durable-functions"

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
> The previous C# example targets Durable Functions 2.x. For Durable Functions 1.x, use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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

$activityTask = Invoke-DurableActivity -FunctionName 'GetQuote' -NoWait
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

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
public class TryGetQuote : TaskOrchestrator<object?, bool>
{
    public override async Task<bool> RunAsync(TaskOrchestrationContext context, object? input)
    {
        using var cts = new CancellationTokenSource();

        Task<double> activityTask = context.CallActivityAsync<double>("GetQuote");
        Task timeoutTask = context.CreateTimer(TimeSpan.FromSeconds(30), cts.Token);

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

# [Python](#tab/python)

```python
from datetime import timedelta
from durabletask import task

def get_quote(ctx: task.ActivityContext, _) -> float:
    # Get quote logic
    return 100.0

def try_get_quote(ctx: task.OrchestrationContext, _):
    activity_task = ctx.call_activity(get_quote)
    timeout_task = ctx.create_timer(timedelta(seconds=30))

    winner = yield task.when_any([activity_task, timeout_task])
    if winner == activity_task:
        # success case
        return True
    else:
        # timeout case
        return False
```

# [Java](#tab/java)

```java
public class TryGetQuote implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        Task<Double> activityTask = ctx.callActivity("GetQuote", Double.class);
        Task<Void> timerTask = ctx.createTimer(Duration.ofSeconds(30));

        Task<?> winner = ctx.anyOf(activityTask, timerTask).await();
        if (winner == activityTask) {
            // success case
            ctx.complete(true);
        } else {
            // timeout case
            ctx.complete(false);
        }
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext, OrchestrationContext, TOrchestrator, whenAny } from "@microsoft/durabletask-js";

const getQuote = async (_: ActivityContext): Promise<number> => {
    // Get quote logic
    return 100.0;
};

const tryGetQuote: TOrchestrator = async function* (ctx: OrchestrationContext): any {
    const activityTask = ctx.callActivity(getQuote);
    const timeoutTask = ctx.createTimer(30);

    const winner = yield whenAny([activityTask, timeoutTask]);
    if (winner === activityTask) {
        // success case
        return true;
    } else {
        // timeout case
        return false;
    }
};
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

::: zone pivot="durable-functions"
> [!WARNING]
> In .NET, JavaScript, Python, and PowerShell, cancel any created durable timers if your code doesn't wait for them to complete. See the previous examples for how to cancel pending timers. The Durable Task Framework doesn't change an orchestration's status to "Completed" until all outstanding tasks, including durable timer tasks, are either completed or canceled.
::: zone-end

::: zone pivot="durable-task-sdks"
> [!WARNING]
> If your SDK supports timer cancellation (for example, .NET), cancel any created durable timers if your code doesn't wait for them to complete. See the previous examples for how to cancel pending timers. The Durable Task Framework doesn't change an orchestration's status to "Completed" until all outstanding tasks, including durable timer tasks, are either completed or canceled.
::: zone-end

::: zone pivot="durable-functions"
This cancellation mechanism using the *when-any* pattern doesn't terminate in-progress activity function or sub-orchestration executions. Rather, it simply lets the orchestrator function ignore the result and move on. If your function app uses the Consumption plan, you're still billed for any time and memory the abandoned activity function consumes. By default, functions running in the Consumption plan have a timeout of five minutes. If this limit is exceeded, the Azure Functions host recycles to stop all execution and prevent a runaway billing situation. The [function timeout is configurable](../../azure-functions/functions-host-json.md#functiontimeout).

For a more detailed example of how to implement timeouts in orchestrator functions, see the [Human interaction](durable-task-human-interaction.md) article.
::: zone-end

::: zone pivot="durable-task-sdks"
This cancellation mechanism using the *when-any* pattern doesn't terminate in-progress activity or sub-orchestration executions. Rather, it simply lets the orchestration ignore the result and move on.
::: zone-end

## Next steps

::: zone pivot="durable-functions"
> [!div class="nextstepaction"]
> [Learn how to raise and handle external events](durable-task-external-events.md)
::: zone-end

::: zone pivot="durable-task-sdks"
> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)
::: zone-end
