---
title: Eternal orchestrations in Durable Functions - Azure
description: Learn how to implement eternal orchestrations by using the Durable Functions extension for Azure Functions.
services: functions
author: ggailey777
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 12/07/2018
ms.author: azfuncdf
---

# Eternal orchestrations in Durable Functions (Azure Functions)

*Eternal orchestrations* are orchestrator functions that never end. They are useful when you want to use [Durable Functions](durable-functions-overview.md) for aggregators and any scenario that requires an infinite loop.

## Orchestration history

As explained in [Checkpointing and Replay](durable-functions-checkpointing-and-replay.md), the Durable Task Framework keeps track of the history of each function orchestration. This history grows continuously as long as the orchestrator function continues to schedule new work. If the orchestrator function goes into an infinite loop and continuously schedules work, this history could grow critically large and cause significant performance problems. The *eternal orchestration* concept was designed to mitigate these kinds of problems for applications that need infinite loops.

## Resetting and restarting

Instead of using infinite loops, orchestrator functions reset their state by calling the [ContinueAsNew](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_ContinueAsNew_) method. This method takes a single JSON-serializable parameter, which becomes the new input for the next orchestrator function generation.

When `ContinueAsNew` is called, the instance enqueues a message to itself before it exits. The message restarts the instance with the new input value. The same instance ID is kept, but the orchestrator function's history is effectively truncated.

> [!NOTE]
> The Durable Task Framework maintains the same instance ID but internally creates a new *execution ID* for the orchestrator function that gets reset by `ContinueAsNew`. This execution ID is generally not exposed externally, but it may be useful to know about when debugging orchestration execution.

## Periodic work example

One use case for eternal orchestrations is code that needs to do periodic work indefinitely.

### C#

```csharp
[FunctionName("Periodic_Cleanup_Loop")]
public static async Task Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    await context.CallActivityAsync("DoCleanup");

    // sleep for one hour between cleanups
    DateTime nextCleanup = context.CurrentUtcDateTime.AddHours(1);
    await context.CreateTimer(nextCleanup, CancellationToken.None);

    context.ContinueAsNew(null);
}
```

### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");
const moment = require("moment");

module.exports = df.orchestrator(function*(context) {
    yield context.df.callActivity("DoCleanup");

    // sleep for one hour between cleanups
    const nextCleanup = moment.utc(context.df.currentUtcDateTime).add(1, "h");
    yield context.df.createTimer(nextCleanup.toDate());

    context.df.continueAsNew(undefined);
});
```

The difference between this example and a timer-triggered function is that cleanup trigger times here are not based on a schedule. For example, a CRON schedule that executes a function every hour will execute it at 1:00, 2:00, 3:00 etc. and could potentially run into overlap issues. In this example, however, if the cleanup takes 30 minutes, then it will be scheduled at 1:00, 2:30, 4:00, etc. and there is no chance of overlap.

## Exit from an eternal orchestration

If an orchestrator function needs to eventually complete, then all you need to do is *not* call `ContinueAsNew` and let the function exit.

If an orchestrator function is in an infinite loop and needs to be stopped, use the [TerminateAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_TerminateAsync_) method to stop it. For more information, see [Instance Management](durable-functions-instance-management.md).

## Next steps

> [!div class="nextstepaction"]
> [Learn how to implement singleton orchestrations](durable-functions-singletons.md)
