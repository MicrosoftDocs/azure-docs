---
title: Exception Policy
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Job Router Exception Policy.
author: danielgerlag
manager: bgao
services: azure-communication-services

ms.author: danielgerlag
ms.date: 01/28/2022
ms.topic: conceptual
ms.service: azure-communication-services
zone_pivot_groups: acs-js-csharp
---

# Exception Policy

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

An Exception Policy is a set of rules that defines what actions to execute when a condition is triggered.  You can save these policies inside Job Router and the attach them to one or more Queues.

## Triggers

The following triggers can be used to drive actions:

**Queue Length -** Fires when the length of the queue exceeds a specified threshold while adding the job to the queue.

**Wait Time -** Fires when the job has been waiting in the queue for the specified threshold.

When these triggers are fired, they'll execute one or more actions and send an [Exception Triggered Event][exception_triggered_event] via [Event Grid][subscribe_events].

## Actions

**Cancel -** Cancels the job and removes it from the queue.

**Reclassify -** Reapplies the specified Classification Policy with modified labels to the job.

**Manual Reclassify -** Modifies the queue, priority, and worker selectors to the job.

## Examples

In the following example, we configure an Exception Policy that will cancel a job before it joins a queue with a length greater than 100.

::: zone pivot="programming-language-csharp"

```csharp
await routerClient.CreateExceptionPolicyAsync(
    new CreateExceptionPolicyOptions(
            exceptionPolicyId: "policy-1",
            exceptionRules: new List<ExceptionRule>
            {
                new ExceptionRule(
                    id: "rule-1",
                    trigger: new QueueLengthExceptionTrigger(threshold: 100),
                    actions: new List<ExceptionAction>
                    {
                        new CancelExceptionAction("cancel-action")
                    })
            })
            {
                Name = "My exception policy"
            }
);
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.upsertExceptionPolicy({
        id: "policy-1",
        name: "My Exception Policy",
        exceptionRules: [
            { 
                id: "rule-1",
                trigger: { kind: "queue-length", threshold: 100 },
                actions: [
                    { kind: "cancel", id: "cancel-action" }
                ]
            }
        ]
    });
```

::: zone-end

In the following example, we configure an Exception Policy with rules that will:

- Set the job priority to 10 after it has been waiting in the queue for 1 minute.
- Move the job to `queue-2` after it has been waiting for 5 minutes.

::: zone pivot="programming-language-csharp"

```csharp
await routerClient.CreateExceptionPolicyAsync(
    new CreateExceptionPolicyOptions(
            exceptionPolicyId: "policy-1",
            exceptionRules: new List<ExceptionRule>
            {
                new ExceptionRule(
                    id: "rule-1",
                    trigger: new WaitTimeExceptionTrigger(TimeSpan.FromMinutes(1)),
                    actions: new List<ExceptionAction>
                    {
                        new ManualReclassifyExceptionAction(id: "action1", priority: 10)
                    }),
                new ExceptionRule(
                    id: "rule-2",
                    trigger: new WaitTimeExceptionTrigger(TimeSpan.FromMinutes(5)),
                    actions: new List<ExceptionAction>
                    {
                        new ManualReclassifyExceptionAction(id: "action2", queueId: "queue-2")
                    })
            })
    {
        Name = "My Exception Policy"
    }
);
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.upsertExceptionPolicy({
        id: "policy-1",
        name: "My Exception Policy",
        exceptionRules: [
            { 
                id: "rule-1",
                trigger: { kind: "wait-time", threshold: "00:01:00" },
                actions: [
                    { kind: "manual-reclassify", id: "action1", priority: 10 }
                ]
            },
            { 
                id: "rule-2",
                trigger: { kind: "wait-time", threshold: "00:05:00" },
                actions: [
                    { kind: "manual-reclassify", id: "action2", queueId: "queue-2" }
                ]
            }
        ]
    });
```

::: zone-end

<!-- LINKS -->
[subscribe_events]: ../../how-tos/router-sdk/subscribe-events.md
[exception_triggered_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobexceptiontriggered

