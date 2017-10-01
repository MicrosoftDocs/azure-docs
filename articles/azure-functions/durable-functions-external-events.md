---
title: Handling external events in Durable Functions for Azure Functions
description: Learn how to handle external events in the Durable Functions extension for Azure Functions.
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

# Handling external events in Durable Functions
Orchestrator functions have the ability to wait and listen for external events, which is often useful for handling human interaction or other external triggers.

The following samples make use of external events. Feel free to reference these as possible use-cases:

* [Stateful Actor - Counter](../samples/counter.md)
* [Human Interaction & Timeouts - Phone Verification](../samples/phone-verification.md)

## Waiting For Events
The <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.WaitForExternalEvent*> method allows an orchestrator function to asynchronously wait and listen for an external event. When using this operation, the caller declares the *name* of the event and the *shape of the data* it expects to receive.

```csharp
[FunctionName("BudgetApproval")]
public static async Task Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    bool approved = await context.WaitForExternalEvent<bool>("Approval");
    if (approved)
    {
        // approval granted - do the approved action
    }
    else
    {
        // approval denied - send a notification
    }
}
```

The preceding example listened for a single event and took action when it was received. It's also possible to listen for multiple events concurrently, like in the following example which waits for one of three possible event notifications.

```csharp
[FunctionName("Select")]
public static async Task Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    var event1 = context.WaitForExternalEvent<float>("Event1");
    var event2 = context.WaitForExternalEvent<bool>("Event2");
    var event3 = context.WaitForExternalEvent<int>("Event3");

    var winner = await Task.WhenAny(event1, event2, event3);
    if (winner == event1)
    {
        // ...
    }
    else if (winner == event2)
    {
        // ...
    }
    else if (winner == event3)
    {
        // ...
    }
}
```

The previous example showed listening to *one* of many possible events. It's also possible to wait for *all* events to arrive.

```csharp
[FunctionName("NewBuildingPermit")]
public static async Task Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    string applicationId = context.GetInput<string>();

    var gate1 = context.WaitForExternalEvent("CityPlanningApproval");
    var gate2 = context.WaitForExternalEvent("FireDeptApproval");
    var gate3 = context.WaitForExternalEvent("BuildingDeptApproval");

    // all three departments must grant approval before a permit can be issued
    await Task.WhenAll(gate1, gate2, gate3);

    await context.CallFunctionAsync("IssueBuildingPermit", applicationId);
}
```

<xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.WaitForExternalEvent*> waits indefinitely for some input and the function app can be safely unloaded while waiting. If and when an event arrives for this orchestration instance, it will be woken up automatically and will immediately process the event.

> [!NOTE]
> No billing charges are incurred if an orchestrator function is awaiting on a task from <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.WaitForExternalEvent*>, no matter how long it waits.

If they event payload cannot be converted into the expected type `T`, an exception will be thrown.

## Sending Events
The <xref:Microsoft.Azure.WebJobs.DurableOrchestrationClient.RaiseEventAsync*> method of the <xref:Microsoft.Azure.WebJobs.DurableOrchestrationClient> class is used to send events that resume orchestrator functions that are waiting using <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.WaitForExternalEvent*>. <xref:Microsoft.Azure.WebJobs.DurableOrchestrationClient.RaiseEventAsync*> takes an *event name* and an *event payload* as data types. The event payload must be JSON-serializable.

```csharp
[FunctionName("ApprovalQueueProcessor")]
public static async Task Run(
    [QueueTrigger("approval-queue")] string instanceId,
    [OrchestrationClient] DurableOrchestrationClient client)
{
    await client.RaiseEventAsync(instanceId, "Approval", true);
}
```

Internally, <xref:Microsoft.Azure.WebJobs.DurableOrchestrationClient.RaiseEventAsync*> enqueues a message that gets picked up by the waiting orchestrator function.

> [!WARNING]
> If there is no orchestration instance with the specified *instance ID* or if the instance is not waiting on the specified *event name*, then the event message will get discarded.
