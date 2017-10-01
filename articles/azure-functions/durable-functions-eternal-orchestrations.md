---
title: Eternal orchestrations in Durable Functions for Azure Functions
description: Learn how to implement eternal orchestrations by using the Durable Functions extension for Azure Functions.
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

# Eternal orchestrations in Durable Functions
Most functions have an explicit start and an end. *Eternal orchestrations*, however, are examples of orchestrator functions which never end. These are useful for various types of scenarios, including implementing aggregators or infinite loops.

For an example use-case for eternal orchestrations, see the [Stateful Singleton - Counter](../samples/counter.md) sample.

## Orchestration History
As mentioned in the [Checkpointing & Replay](./checkpointing-and-replay.md) topic, the Durable Task Framework keeps track of the history of each function orchestration. This history grows continuously as long as the orchestrator function continues to schedule new work. If the orchestrator function goes into an infinite loop and continuously schedules work, this history could grow critically large and cause significant performance problems. The *eternal orchestration* concept was designed to mitigate these kinds of problems for applications that need infinite loops.

## Resetting and Restarting
Instead of using infinite loops, orchestrator functions support resetting their state using the <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.ContinueAsNew*> method. This method takes a single JSON-serializable parameter value which becomes the new input for the next orchestrator function generation.

When an orchestrator function exits after <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.ContinueAsNew*> has been called, the instance will enqueue a message to itself that restarts the instance with the new input value. The orchestrator function instance will maintain its instance ID but its history will be effectively truncated.

> [!NOTE]
> The Durable Task Framework maintains the same instance ID but internally creates a new *execution ID* for the orchestrator function that gets reset using <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.ContinueAsNew*>. This execution ID is generally not exposed externally, but may be useful to know about when debugging orchestration execution.

One potential use case is code that needs to do periodic work indefinitely.

```csharp
[FunctionName("Periodic_Cleanup_Loop")]
public static async Task Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    await context.CallFunctionAsync("DoCleanup");

    // sleep for one hour between cleanups
    DateTime nextCleanup = context.CurrentUtcDateTime.AddHours(1);
    await context.CreateTimer<string>(nextCleanup);

    context.ContinueAsNew();
}
```

> [!NOTE]
> The difference between this example and a timer-triggered function is that cleanup trigger times here are not based on a schedule. For example, a CRON schedule which executes a function every hour will execute it at 1:00, 2:00, 3:00 etc. and could potentially run into overlap issues. In this example, however, if the cleanup takes 30 minutes, then it will be scheduled at 1:00, 2:30, 4:00, etc. and there is no chance of overlap.

Here is a simplified example of a *counter* function which listens for *increment* and *decrement* events eternally.
```csharp
[FunctionName("SimpleCounter")]
public static async Task Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    int counterState = context.GetInput<int>();

    string operation = await context.WaitForExternalEvent<string>("operation");

    if (operation == "incr")
    {
        counterState++;
    }
    else if (operation == "decr")
    {
        counterState--;
    }
    
    context.ContinueAsNew(counterState);
}
```

If an orchestrator function needs to eventually complete, then all you need to do is *not* call <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.ContinueAsNew*> and let the function exit.

If an orchestrator function is in an infinite loop and needs to be stopped, the <xref:Microsoft.Azure.WebJobs.DurableOrchestrationClient.TerminateAsync*> method can be used to forcefully stop it. See the [Instance Management](./instance-management.md) topic for more details on how to terminate orchestration instances.

