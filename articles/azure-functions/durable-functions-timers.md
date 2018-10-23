---
title: Timers in Durable Functions - Azure
description: Learn how to implement durable timers in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 04/30/2018
ms.author: azfuncdf
---

# Timers in Durable Functions (Azure Functions)

[Durable Functions](durable-functions-overview.md) provides *durable timers* for use in orchestrator functions to implement delays or to set up timeouts on async actions. Durable timers should be used in orchestrator functions instead of `Thread.Sleep` and `Task.Delay` (C#), or `setTimeout()` and `setInterval()` (JavaScript).

You create a durable timer by calling the [CreateTimer](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_CreateTimer_) method in [DurableOrchestrationContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html). The method returns a task that resumes on a specified date and time.

## Timer limitations

When you create a timer that expires at 4:30 pm, the underlying Durable Task Framework enqueues a message which becomes visible only at 4:30 pm. When running in the Azure Functions consumption plan, the newly visible timer message will ensure that the function app gets activated on an appropriate VM.

> [!NOTE]
> * Durable timers cannot last longer than 7 days due to limitations in Azure Storage. We are working on a [feature request to extend timers beyond 7 days](https://github.com/Azure/azure-functions-durable-extension/issues/14).
> * Always use [CurrentUtcDateTime](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_CurrentUtcDateTime) instead of `DateTime.UtcNow` as shown in the examples below when computing a relative deadline of a durable timer.

## Usage for delay

The following example illustrates how to use durable timers for delaying execution. The example is issuing a billing notification every day for ten days.

#### C#

```csharp
[FunctionName("BillingIssuer")]
public static async Task Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    for (int i = 0; i < 10; i++)
    {
        DateTime deadline = context.CurrentUtcDateTime.Add(TimeSpan.FromDays(1));
        await context.CreateTimer(deadline, CancellationToken.None);
        await context.CallActivityAsync("SendBillingEvent");
    }
}
```

#### JavaScript

```js
const df = require("durable-functions");
const moment = require("moment-js");

module.exports = df.orchestrator(function*(context) {
    for (let i = 0; i < 10; i++) {
        const dayOfMonth = context.df.currentUtcDateTime.getDate();
        const deadline = moment.utc(context.df.currentUtcDateTime).add(1, 'd');
        yield context.df.createTimer(deadline.toDate());
        yield context.df.callActivityAsync("SendBillingEvent");
    }
});
```

> [!WARNING]
> Avoid infinite loops in orchestrator functions. For information about how to safely and efficiently implement infinite loop scenarios, see [Eternal Orchestrations](durable-functions-eternal-orchestrations.md). 

## Usage for timeout

This example illustrates how to use durable timers to implement timeouts.

#### C#

```csharp
[FunctionName("TryGetQuote")]
public static async Task<bool> Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
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

#### JavaScript

```js
const df = require("durable-functions");
const moment = require("moment-js");

module.exports = df.orchestrator(function*(context) {
    const deadline = moment.utc(context.df.currentUtcDateTime).add(30, 's');

    const activityTask = context.df.callActivityAsync("GetQuote");
    const timeoutTask = context.df.createTimer(deadline);

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

> [!WARNING]
> Use a `CancellationTokenSource` to cancel a durable timer (C#) or call `cancel()` on the returned `TimerTask` (JavaScript) if your code will not wait for it to complete. The Durable Task Framework will not change an orchestration's status to "completed" until all outstanding tasks are completed or cancelled.

This mechanism does not actually terminate in-progress activity function execution. Rather, it simply allows the orchestrator function to ignore the result and move on. If your function app uses the Consumption plan, you will still be billed for any time and memory consumed by the abandoned activity function. By default, functions running in the Consumption plan have a timeout of five minutes. If this limit is exceeded, the Azure Functions host is recycled to stop all execution and prevent a runaway billing situation. The [function timeout is configurable](functions-host-json.md#functiontimeout).

For a more in-depth example of how to implement timeouts in orchestrator functions, see the [Human Interaction & Timeouts - Phone Verification](durable-functions-phone-verification.md) walkthrough.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to raise and handle external events](durable-functions-external-events.md)

