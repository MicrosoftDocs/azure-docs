---
title: Timers in Durable Functions for Azure Functions
description: Learn how to implement durable timers in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/29/2017
ms.author: cgillum
---

# Timers in Durable Functions
Durable timers can be used in orchestrator functions to delay for specific durations of time or to implement timeouts on other supported async actions. Durable timers should be used in orchestrator functions instead of `Thread.Sleep` or `Task.Delay`.

## Remarks
A durable timer can be created using the <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.CreateTimer*> API. The API returns a task which will be resumed on the specified deadline (i.e. a `DateTime`).

These timers are "durable" because they are internally backed by scheduled messages in Azure Storage. For example, if you create a timer that will expire at 4:30pm, the underlying Durable Task Framework will enqueue a message which becomes visible only at 4:30pm. When running in the Azure Functions consumption plan, the newly visible timer message will ensure that the function app gets activated on an appropriate VM.

> [!WARNING]
> Durable timers cannot last longer than 7 days due to limitations in Azure Storage.
> [This GitHub issue](https://github.com/Azure/azure-functions-durable-extension/issues/14) tracks extending timers beyond 7 days.

> [!WARNING]
> Always make sure to use <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.CurrentUtcDateTime> instead of `DateTime.UtcNow` as shown in the examples below when computing a relative deadline of a durable timer.

## Delay Usage
The following example illustrates how to use durable timers for delaying execution. The specific example is issuing a billing notification every day for ten days.

```csharp
[FunctionName("BillingIssuer")]
public static async Task Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    for (int i = 0; i < 10; i++)
    {
        DateTime deadline = context.CurrentUtcDateTime.Add(TimeSpan.FromDays(1));
        await context.CreateTimer(deadline, CancellationToken.None);
        await context.CallFunctionAsync("SendBillingEvent");
    }
}
```

> [!WARNING]
> Infinite loops have the potential to create significant performance problems for orchestrator functions and should be avoided. See the [Eternal Orchestrations](./eternal-orchestrations.md) topic for details on how to safely and efficiently implement infinite loops.

## Timeout Usage
This next example illustrates how to use durable timers to implement timeouts.

```csharp
[FunctionName("TryGetQuote")]
public static async Task<bool> Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    TimeSpan timeout = TimeSpan.FromSeconds(30);
    DateTime deadline = context.CurrentUtcDateTime.Add(timeout);

    using (var cts = new CancellationTokenSource())
    {
        Task activityTask = context.CallFunctionAsync("GetQuote");
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

> [!WARNING]
> Make sure to use a `CancellationTokenSource` to cancel a durable timer if your code will not wait for it to complete. The Durable Task Framework will not change an orchestration's status to "completed" until all outstanding tasks are completed or cancelled.

Note that this mechanism does not actually terminate in-progress activity function execution. Rather, it simply allows the orchestrator function to ignore the result and move on. If running in the Consumption plan, you will still be billed for any time and memory consumed by the abandoned activity function. By default functions running in the Consumption plan have a configurable timeout of 5 minutes. If this is exceeded, the Azure Functions host will be recycled to forcefully stop all execution and prevent a runaway billing situation.

For a more in-depth example of how to implement timeouts in orchestrator functions, see the [Human Interaction & Timeouts - Phone Verification](../samples/phone-verification.md) walk-through.

