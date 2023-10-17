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
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
---

# Exception Policy

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

An Exception Policy is a set of rules that defines what actions to execute when a condition is triggered.  You can save these policies inside Job Router and then attach them to one or more Queues.

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

In the following example, we configure an exception policy that will cancel a job before it joins a queue with a length greater than 100.

::: zone pivot="programming-language-csharp"

```csharp
await administrationClient.CreateExceptionPolicyAsync(new CreateExceptionPolicyOptions(
    exceptionPolicyId: "policy1",
    exceptionRules: new Dictionary<string, ExceptionRule>
    {
        ["rule1"] = new (
            trigger: new QueueLengthExceptionTrigger(threshold: 100),
            actions: new Dictionary<string, ExceptionAction?>
            {
                ["cancelAction"] = new CancelExceptionAction()
            })
    }) { Name = "Max Queue Length Policy" });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await administrationClient.createExceptionPolicy("policy1", {
    name: "Max Queue Length Policy",
    exceptionRules: {
        rule1: {
            trigger: { kind: "queue-length", threshold: 100 },
            actions: { cancelAction: { kind: "cancel" }}
        }
    }
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
administration_client.create_exception_policy(
    exception_policy_id = "policy1",
    exception_policy = ExceptionPolicy(
        name = "Max Queue Length Policy",
        exception_rules = {
            "rule1": ExceptionRule(
              trigger = QueueLengthExceptionTrigger(threshold = 100),
              actions = { "cancelAction": CancelExceptionAction() }
            )
        }
    )
)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
administrationClient.createExceptionPolicy(new CreateExceptionPolicyOptions("policy1",
    Map.of("rule1", new ExceptionRule(
        new QueueLengthExceptionTrigger().setThreshold(1)
        Map.of("cancelAction", new CancelExceptionAction())))
).setName("Max Queue Length Policy"));
```

::: zone-end

In the following example, we configure an Exception Policy with rules that will:

- Set the job priority to 10 after it has been waiting in the queue for 1 minute.
- Move the job to `queue2` after it has been waiting for 5 minutes.

::: zone pivot="programming-language-csharp"

```csharp
await administrationClient.CreateExceptionPolicyAsync(new CreateExceptionPolicyOptions(
    exceptionPolicyId: "policy2",
    exceptionRules: new Dictionary<string, ExceptionRule>
    {
        ["rule1"] = new (
            trigger: new WaitTimeExceptionTrigger(threshold: TimeSpan.FromMinutes(1)),
            actions: new Dictionary<string, ExceptionAction?>
            {
                ["increasePriority"] = new ManualReclassifyExceptionAction { Priority = 10 }
            }),
        ["rule2"] = new(
            trigger: new WaitTimeExceptionTrigger(threshold: TimeSpan.FromMinutes(5)),
            actions: new Dictionary<string, ExceptionAction?>
            {
                ["changeQueue"] = new ManualReclassifyExceptionAction { QueueId = "queue2" }
            })
    }) { Name = "Escalation Policy" });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await administrationClient.createExceptionPolicy("policy2", {
    name: "Escalation Policy",
    rule1: {
        trigger: { kind: "wait-time", thresholdSeconds: "60" },
        actions: { "increasePriority": { kind: "manual-reclassify", priority: 10 }}
    },
    rule2: {
        trigger: { kind: "wait-time", thresholdSeconds: "300" },
        actions: { "changeQueue": { kind: "manual-reclassify", queueId: "queue2" }}
    }
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
administration_client.create_exception_policy(
    exception_policy_id = "policy2",
    exception_policy = ExceptionPolicy(
        name = "Escalation Policy",
        exception_rules = {
            "rule1": ExceptionRule(
                trigger = WaitTimeExceptionTrigger(threshold_seconds = 60),
                actions = { "increasePriority": ManualReclassifyExceptionAction(priority = 10) }
            ),
            "rule2": ExceptionRule(
                trigger = WaitTimeExceptionTrigger(threshold_seconds = 60),
                actions = { "changeQueue": ManualReclassifyExceptionAction(queue_id = "queue2") }
            )
        }
    )
)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
administrationClient.createExceptionPolicy(new CreateExceptionPolicyOptions("policy2", Map.of(
    "rule1", new ExceptionRule(
        new WaitTimeExceptionTrigger(60),
        Map.of("increasePriority", new ManualReclassifyExceptionAction().setPriority(10))),
    "rule2", new ExceptionRule(
        new WaitTimeExceptionTrigger(300),
        Map.of("changeQueue", new ManualReclassifyExceptionAction().setQueueId("queue2"))))
).setName("Escalation Policy"));
```

::: zone-end

<!-- LINKS -->
[subscribe_events]: ../../how-tos/router-sdk/subscribe-events.md
[exception_triggered_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobexceptiontriggered
