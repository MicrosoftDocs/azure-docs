---
title: Escalate a Job in Job Router
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to escalate a Job
author: jasonshave
ms.author: jassha
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 10/14/2021
ms.custom: template-how-to

#Customer intent: As a developer, I want to manage the behavior of my jobs in a queue.
---

# Escalate a job

This guide shows you how to escalate a Job in a Queue by using an Exception Policy.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)
- Optional: Review the [Job classification how-to guide](job-classification.md)

## Escalation Overview

Escalation can take the form of several different behaviors including moving a Job to a different Queue and/or specifying a higher priority. Jobs with a higher priority are distributed to Workers before jobs with a lower priority. For this how-to guide, we use a Classification Policy and an Exception Policy and to achieve this goal.

## Classification policy configuration

Create a Classification Policy to handle the new label added to the Job. This policy evaluates the `Escalated` label and assigns the Job to either Queue. The policy also uses the [Rules Engine](../../concepts/router/router-rule-concepts.md) to increase the priority of the Job from `1` to `10`.

```csharp
var classificationPolicy = await administrationClient.CreateClassificationPolicyAsync(
    new CreateClassificationPolicyOptions(classificationPolicyId: "Classify_XBOX_Voice_Jobs")
    {
        Name = "Classify XBOX Voice Jobs",
        QueueSelectors = new List<QueueSelectorAttachment>
        {
            new ConditionalQueueSelectorAttachment(condition: new ExpressionRule("job.Escalated = true"), labelSelectors: new List<QueueSelector>
            {
                new (key: "Id", labelOperator: LabelOperator.Equal, value: new LabelValue("XBOX_Escalation_Queue"))
            })
        },
        PrioritizationRule = new ExpressionRule("If(job.Escalated = true, 10, 1)"),
    });
```

## Exception policy configuration

Create an exception policy attached to the queue, which is time triggered and takes the action of the Job being reclassified.

```csharp
var exceptionPolicy = await administrationClient.CreateExceptionPolicyAsync(new CreateExceptionPolicyOptions(
    exceptionPolicyId: "Escalate_XBOX_Policy",
    exceptionRules: new Dictionary<string, ExceptionRule>
    {
        ["Escalated_Rule"] = new(
            trigger: new WaitTimeExceptionTrigger(TimeSpan.FromMinutes(5)),
            actions: new Dictionary<string, ExceptionAction?>
            {
                ["EscalateReclassifyExceptionAction"] =
                    new ReclassifyExceptionAction(classificationPolicyId: classificationPolicy.Value.Id)
                    {
                        LabelsToUpsert = new Dictionary<string, LabelValue>
                        {
                            ["Escalated"] = new(true)
                        }
                    }
            }
        )
    }) { Name = "Add escalated label and reclassify XBOX Job requests after 5 minutes" });
```

## Queue configuration

Create the necessary Queues for regular and escalated Jobs and assigns the Exception Policy to the regular Queue.

> [!NOTE]
> This step assumes you have created a distribution policy already with the name of `Round_Robin_Policy`.

```csharp
var defaultQueue = await administrationClient.CreateQueueAsync(
    new CreateQueueOptions(queueId: "XBOX_Queue", distributionPolicyId: "Round_Robin_Policy")
    {
        Name = "XBOX Queue",
        ExceptionPolicyId = exceptionPolicy.Value.Id
    });

var escalationQueue = await administrationClient.CreateQueueAsync(
    new CreateQueueOptions(queueId: "XBOX_Escalation_Queue", distributionPolicyId: "Round_Robin_Policy")
    {
        Name = "XBOX Escalation Queue"
    });
```

## Job lifecycle

When you submit the Job, it is added to the queue `XBOX_Queue` with the `voice` channel. For this particular example, the requirement is to find a worker with a label called `XBOX_Hardware`, which has a value greater than or equal to the number `7`.

```csharp
await client.CreateJobAsync(new CreateJobOptions(jobId: "job1", channelId: "voice", queueId: defaultQueue.Value.Id)
{
    RequestedWorkerSelectors = new List<WorkerSelector>
    {
        new(key: "XBOX_Hardware", labelOperator: LabelOperator.GreaterThanEqual, value: new LabelValue(7))
    }
});
```

The following lifecycle steps are taken once the configuration is complete and the Job is ready to be submitted:

1. The Job is sent to Job Router which produces the `RouterJobReceived` and `RouterJobQueued` events.
2. Next, the 5-minute timer begins and triggers if no matching worker is assigned. After 5 minutes this results in a `RouterJobExceptionTriggered` and another `RouterJobQueued` event.
3. At this point, the Job is moved to the `XBOX_Escalation_Queue` and the priority is set to `10`.
