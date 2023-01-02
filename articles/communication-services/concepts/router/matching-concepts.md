---
title: Job Matching
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Job Router distribution concepts.
author: danielgerlag
manager: bgao
services: azure-communication-services

ms.author: danielgerlag
ms.date: 01/26/2022
ms.topic: conceptual
ms.service: azure-communication-services
zone_pivot_groups: acs-js-csharp
---

# How jobs are matched to workers

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

This document describes the registration of workers, the submission of jobs and how they're matched to each other.

## Worker Registration

Before a worker can receive offers to service a job, it must be registered.  
In order to register, we need to specify which queues the worker will listen on, which channels it can handle and a set of labels.

In the following example we register a worker to

- Listen on `queue-1` and `queue-2`
- Be able to handle both the voice and chat channels.  In this case, the worker could either take a single `voice` job at one time or two `chat` jobs at the same time.  This is configured by specifying the total capacity of the worker and assigning a cost per job for each channel.
- Have a set of labels that describe things about the worker that could help determine if it's a match for a particular job.

::: zone pivot="programming-language-csharp"

```csharp
var worker = await client.RegisterWorkerAsync(
    id: "worker-1",
    queueIds: new[] { "queue-1", "queue-2" },    
    totalCapacity: 2,
    channelConfigurations: new List<ChannelConfiguration>
    {
        new ChannelConfiguration(channelId: "voice", capacityCostPerJob: 2),
        new ChannelConfiguration(channelId: "chat", capacityCostPerJob: 1)
    },
    labels: new LabelCollection()
    {
        ["Skill"] = 11,
        ["English"] = true,
        ["French"] = false,
        ["Vendor"] = "Acme"
    }
);
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
let worker = await client.registerWorker({
    id: "worker-1",    
    queueAssignments: [
        { queueId: "queue-1" },
        { queueId: "queue-2" } 
    ],
    totalCapacity: 2,
    channelConfigurations: [
        { channelId: "voice", capacityCostPerJob: 2 },
        { channelId: "chat", capacityCostPerJob: 1 }
    ],
    labels: {
        Skill: 11,
        English: true,
        French: false,
        Vendor: "Acme"
    }
});
```

::: zone-end

> [!NOTE]
> If a worker is registered and idle for more than 7 days, it'll be automatically deregistered and you'll receive a `WorkerDeregistered` event from EventGrid.

## Job Submission

In the following example, we'll submit a job that

- Goes directly to `queue-1`.
- For the `chat` channel.
- With a label selector that specifies that any worker servicing this job must have a label of `English` set to `true`.
- With a label selector that specifies that any worker servicing this job must have a label of `Skill` greater than `10` and this condition will expire after one minute.
- With a label of `name` set to `John`.

::: zone pivot="programming-language-csharp"

```csharp
var job = await client.CreateJobAsync(
    channelId: "chat",
    queueId: "queue-1",
    workerSelectors: new List<LabelSelector>
    {
        new LabelSelector(
            key: "English", 
            @operator: LabelOperator.Equal, 
            value: true),
        new LabelSelector(
            key: "Skill", 
            @operator: LabelOperator.GreaterThan, 
            value: 10,
            ttl: TimeSpan.FromMinutes(1)),    
    },
    labels: new LabelCollection()
    {
        ["name"] = "John"
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
let job = await client.createJob({
    channelId: "chat",
    queueId: "queue-1",
    workerSelectors: [
        { key: "English", operator: "equal", value: true },        
        { key: "Skill", operator: "greaterThanEqual", value: 10, ttl: "00:01:00" },        
    ],
    labels: {
        name: "John"
    },
});
```

::: zone-end

Job Router will now try to match this job to an available worker listening on `queue-1` for the `chat` channel, with `English` set to `true` and `Skill` greater than `10`.
Once a match is made, an offer is created. The distribution policy that is attached to the queue will control how many active offers there can be for a job and how long each offer is valid. [You'll receive][subscribe_events] an [OfferIssued Event][offer_issued_event] which would look like this:

```json
{
    "workerId": "worker-1",
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelId": "chat",
    "queueId": "queue-1",
    "offerId": "525fec06-ab81-4e60-b780-f364ed96ade1",
    "offerTimeUtc": "2021-06-23T02:43:30.3847144Z",
    "expiryTimeUtc": "2021-06-23T02:44:30.3847674Z",
    "jobPriority": 1,
    "jobLabels": {
        "name": "John"
    }
}
```

The [OfferIssued Event][offer_issued_event] includes details about the job, worker, how long the offer is valid and the `offerId` which you'll need to accept or decline the job.

> [!NOTE]
> The maximum lifetime of a job is 90 days, after which it'll automatically expire.

<!-- LINKS -->
[subscribe_events]: ../../how-tos/router-sdk/subscribe-events.md
[job_classified_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobclassified
[offer_issued_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued

