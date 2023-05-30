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

Escalation can take the form of several different behaviors including moving a Job to a different Queue and/or specifying a higher priority. Jobs with a higher priority will be distributed to Workers before Jobs with a lower priority. For this how-to guide, we will use an Escalation Policy and a Classification Policy to achieve this goal.

## Exception policy configuration

Create an exception policy, which you will attach to the regular queue, which is triggered by time and takes the action of the Job being reclassified.

```csharp
// create the exception policy
await routerClient.CreateExceptionPolicyAsync(
    new CreateExceptionPolicyOptions(
            exceptionPolicyId: "Escalate_XBOX_Policy",
            exceptionRules: new Dictionary<string, ExceptionRule>()
            {
                {
                    ["Escalated_Rule"] = new ExceptionRule(new WaitTimeExceptionTrigger(300), 
                        new Dictionary<string, ExceptionAction>()
                        {
                            "EscalateReclassifyExceptionAction" = new ReclassifyExceptionAction(
                                classificationPolicyId: "<classification policy id>", 
                                labelsToUpsert: new Dictionary<string, LabelValue>()
                                {
                                    ["Escalated"] = new LabelValue(true),
                                })
                        })
                }
            }
    ))
    {
        Name = "My exception policy"
    }
);
```

## Classification policy configuration

Create a Classification Policy to handle the new label added to the Job. This policy will evaluate the `Escalated` label and assign the Job to either Queue. The policy will also use the [RulesEngine](../../concepts/router/router-rule-concepts.md) to increase the priority of the Job from `1` to `10`.

```csharp
await routerAdministrationClient.CreateClassificationPolicyAsync(
    options: new CreateClassificationPolicyOptions("Classify_XBOX_Voice_Jobs")
    {
        Name = "Classify XBOX Voice Jobs",
        PrioritizationRule = new ExpressionRule("If(job.Escalated = true, 10, 1)"),
        QueueSelectors = new List<QueueSelectorAttachment>()
        {
            new ConditionalQueueSelectorAttachment(
                condition: new ExpressionRule("If(job.Escalated = true, true, false)"),
                labelSelectors: new List<QueueSelector>()
                {
                    new QueueSelector("Id", LabelOperator.Equal, new LabelValue("XBOX_Escalation_Queue"))
                }),
            new ConditionalQueueSelectorAttachment(
                condition: new ExpressionRule("If(job.Escalated = false, true, false)"),
                labelSelectors: new List<QueueSelector>()
                {
                    new QueueSelector("Id", LabelOperator.Equal, new LabelValue("XBOX_Queue"))
                })
        },
        FallbackQueueId = "Default"
    });
```

## Queue configuration

Create the necessary Queues for regular and escalated Jobs and assign the Exception Policy to the regular Queue.

> [!NOTE]
> This step assumes you have created a distribution policy already with the name of `Round_Robin_Policy`.

```csharp
// create a queue for regular Jobs and attach the exception policy
await routerAdministrationClient.CreateQueueAsync(
    options: new CreateQueueOptions("XBOX_Queue", "Round_Robin_Policy")
    {
        Name = "XBOX Queue",
        ExceptionPolicyId = "XBOX_Escalate_Policy"
    });

// create a queue for escalated Jobs
await routerAdministrationClient.CreateQueueAsync(
    options: new CreateQueueOptions("XBOX_Escalation_Queue", "Round_Robin_Policy")
    {
        Name = "XBOX Escalation Queue",
    });
```

## Job lifecycle

When you submit the Job, specify the Classification Policy ID as follows. For this particular example, the requirement would be to find a worker with a label called `XBOX_Hardware`, which has a value greater than or equal to the number `7`.

```csharp
await routerClient.CreateJobAsync(
    options: new CreateJobWithClassificationPolicyOptions(
        jobId: "<jobId>",
        channelId: ManagedChannels.AcsVoiceChannel,
        classificationPolicyId: "Classify_XBOX_Voice_Jobs")
    {
        RequestedWorkerSelectors = new List<WorkerSelector>
        {
            new WorkerSelector(key: "XBOX_Hardware", labelOperator: LabelOperator.GreaterThanEqual, value: new LabelValue(7))
        }
    });
);
```

The following lifecycle steps will be taken once the configuration is complete and the Job is ready to be submitted:

1. The Job is sent to Job Router and since a Classification Policy is attached, it will be evaluated and produce both a `RouterJobReceived` and a `RouterJobClassified`.
2. Next, the 5-minute timer begins and will eventually be triggered if no Worker can be assigned. Assuming no Workers are registered, resulting in a `RouterJobExceptionTriggered` and another `RouterJobClassified`.
3. At this point, the Job will be in the `XBOX_Escalation_Queue` and the priority will be set to `10`.