---
title: Timers in Durable Functions - Azure
description: Learn how to implement durable timers in the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.date: 07/13/2020
ms.author: azfuncdf
---

# Timers in Durable Functions (Azure Functions)

[Durable Functions](durable-functions-overview.md) provides *durable timers* for use in orchestrator functions to implement delays or to set up timeouts on async actions. Durable timers should be used in orchestrator functions instead of `Thread.Sleep` and `Task.Delay` (C#), or `setTimeout()` and `setInterval()` (JavaScript), or `time.sleep()` (Python).

You create a durable timer by calling the `CreateTimer` (.NET) method or the `createTimer` (JavaScript) method of the [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger). The method returns a task that completes on a specified date and time.

## Timer limitations

When you create a timer that expires at 4:30 pm, the underlying Durable Task Framework enqueues a message that becomes visible only at 4:30 pm. When running in the Azure Functions Consumption plan, the newly visible timer message will ensure that the function app gets activated on an appropriate VM.

> [!NOTE]
> * Starting with [version 2.3.0](https://github.com/Azure/azure-functions-durable-extension/releases/tag/v2.3.0) of the Durable Extension, Durable timers are unlimited. In earlier versions of the extension, Durable timers are limited to seven days. When you are using an earlier version and need a delay longer than seven days, use the timer APIs in a `while` loop to simulate this delay.
> * Always use `CurrentUtcDateTime` instead of `DateTime.UtcNow` in .NET or `currentUtcDateTime` instead of `Date.now` or `Date.UTC` in JavaScript when computing the fire time for durable timers. For more information, see the [orchestrator function code constraints](durable-functions-code-constraints.md) article.

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
    Stop-DurableTaskTimer -Task $timerTask
    return $True
}
else {
    return $False
}
```

---

> [!WARNING]
> Use a `CancellationTokenSource` (.NET) or call `cancel()` on the returned `TimerTask` (JavaScript) to cancel a durable timer if your code will not wait for it to complete. The Durable Task Framework will not change an orchestration's status to "completed" until all outstanding tasks are completed or canceled.

This cancellation mechanism doesn't terminate in-progress activity function or sub-orchestration executions. Rather, it simply allows the orchestrator function to ignore the result and move on. If your function app uses the Consumption plan, you'll still be billed for any time and memory consumed by the abandoned activity function. By default, functions running in the Consumption plan have a timeout of five minutes. If this limit is exceeded, the Azure Functions host is recycled to stop all execution and prevent a runaway billing situation. The [function timeout is configurable](../functions-host-json.md#functiontimeout).

For a more in-depth example of how to implement timeouts in orchestrator functions, see the [Human Interaction & Timeouts - Phone Verification](durable-functions-phone-verification.md) article.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to raise and handle external events](durable-functions-external-events.md)
