---
title: How jobs are matched to workers
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Job Router distribution concepts.
author: danielgerlag
manager: bgao
services: azure-communication-services

ms.author: danielgerlag
ms.date: 01/26/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
---

# How jobs are matched to workers

This document describes the registration of workers, the submission of jobs and how they're matched to each other.

## Worker Registration

Before a worker can receive offers to service a job, it must be registered first by setting `availableForOffers` to true.  Next, we need to specify which queues the worker listens on and which channels it can handle.  Once registered, you receive a [RouterWorkerRegistered](../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerregistered) event from Event Grid and the worker's status is changed to `active`.

In the following example, we register a worker to:

- Listen on `queue-1` and `queue-2`
- Be able to handle both the voice and chat channels.  In this case, the worker could either take a single `voice` job at one time or two `chat` jobs at the same time.  This setting is configured by specifying the total capacity of the worker and assigning a cost per job for each channel.
- Have a set of labels that describe things about the worker that could help determine if it's a match for a particular job.

::: zone pivot="programming-language-csharp"

```csharp
var worker = await client.CreateWorkerAsync(new CreateWorkerOptions(workerId: "worker-1", capacity: 2)
{
    AvailableForOffers = true,
    Queues = { "queue1", "queue2" },
    Channels =
    {
        new RouterChannel(channelId: "voice", capacityCostPerJob: 2),
        new RouterChannel(channelId: "chat", capacityCostPerJob: 1)
    },
    Labels =
    {
        ["Skill"] = new RouterValue(11),
        ["English"] = new RouterValue(true),
        ["French"] = new RouterValue(false),
        ["Vendor"] = new RouterValue("Acme")
    }
});
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
let worker = await client.path("/routing/workers/{workerId}", "worker-1").patch({
    body: {
        availableForOffers: true,
        capacity: 2,
        queues: ["queue1", "queue2"],
        channels: [
            { channelId: "voice", capacityCostPerJob: 2 },
            { channelId: "chat", capacityCostPerJob: 1 }
        ],
        labels: {
            Skill: 11,
            English: true,
            French: false,
            Vendor: "Acme"
        }
    },
    contentType: "application/merge-patch+json"
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
worker = client.upsert_worker(
    worker_id = "worker-1",
    available_for_offers = True,
    capacity = 2,
    queues = ["queue1", "queue2"],
    channels = [
        RouterChannel(channel_id = "voice", capacity_cost_per_job = 2),
        RouterChannel(channel_id = "chat", capacity_cost_per_job = 1)
    ],
    labels = {
        "Skill": 11,
        "English": True,
        "French": False,
        "Vendor": "Acme"
    }
)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
RouterWorker worker = client.createWorker(new CreateWorkerOptions("worker-1", 2)
    .setAvailableForOffers(true)
    .setQueues(List.of("queue1", "queue2"))
    .setChannels(List.of(
        new RouterChannel("voice", 2),
        new RouterChannel("chat", 1)))
    .setLabels(Map.of(
        "Skill", new RouterValue(11),
        "English", new RouterValue(true),
        "French", new RouterValue(false),
        "Vendor", new RouterValue("Acme"))));
```

::: zone-end

## Job Submission

In the following example, we submit a job that

- Goes directly to `queue1`.
- For the `chat` channel.
- With a worker selector that specifies that any worker servicing this job must have a label of `English` set to `true`.
- With a worker selector that specifies that any worker servicing this job must have a label of `Skill` greater than `10` and this condition will expire after one minute.
- With a label of `name` set to `John`.

::: zone pivot="programming-language-csharp"

```csharp
await client.CreateJobAsync(new CreateJobOptions("job1", "chat", "queue1")
{
    RequestedWorkerSelectors =
    {
        new RouterWorkerSelector(key: "English", labelOperator: LabelOperator.Equal, value: new RouterValue(true)),
        new RouterWorkerSelector(key: "Skill", labelOperator: LabelOperator.GreaterThan, value: new RouterValue(10))
            { ExpiresAfter = TimeSpan.FromMinutes(5) }
    },
    Labels = { ["name"] = new RouterValue("John") }
});
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.path("/routing/jobs/{jobId}", "job1").patch({
    body: {
        channelId: "chat",
        queueId: "queue1",
        requestedWorkerSelectors: [
            { key: "English", labelOperator: "equal", value: true },
            { key: "Skill", labelOperator: "greaterThan", value: 10, expiresAfterSeconds: 300 },
        ],
        labels: { name: "John" }
    },
    contentType: "application/merge-patch+json"
})
```

::: zone-end

::: zone pivot="programming-language-python"

```python
client.upsert_job(
    job_id = "job1",
    channel_id = "chat",
    queue_id = "queue1",
    requested_worker_selectors = [
        RouterWorkerSelector(
          key = "English",
          label_operator = LabelOperator.EQUAL,
          value = True
        ),
        RouterWorkerSelector(
          key = "Skill",
          label_operator = LabelOperator.GREATER_THAN,
          value = True,
          expires_after_seconds = 300
        )
    ],
    labels = { "name": "John" }
)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
client.createJob(new CreateJobOptions("job1", "chat", "queue1")
    .setRequestedWorkerSelectors(List.of(
        new RouterWorkerSelector("English", LabelOperator.EQUAL, new RouterValue(true)),
        new RouterWorkerSelector("Skill", LabelOperator.GREATER_THAN, new RouterValue(10))
            .setExpiresAfter(Duration.ofMinutes(5))))
    .setLabels(Map.of("name", new RouterValue("John"))));
```

::: zone-end

Job Router tries to match this job to an available worker listening on `queue1` for the `chat` channel, with `English` set to `true` and `Skill` greater than `10`.
Once a match is made, an offer is created. The distribution policy that is attached to the queue controls how many active offers there can be for a job and how long each offer is valid. [You receive][subscribe_events] an [OfferIssued Event][offer_issued_event] that would look like this:

```json
{
    "workerId": "worker-1",
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelId": "chat",
    "queueId": "queue1",
    "offerId": "525fec06-ab81-4e60-b780-f364ed96ade1",
    "offerTimeUtc": "2021-06-23T02:43:30.3847144Z",
    "expiryTimeUtc": "2021-06-23T02:44:30.3847674Z",
    "jobPriority": 1,
    "jobLabels": {
        "name": "John"
    }
}
```

The [OfferIssued Event][offer_issued_event] includes details about the job, worker, how long the offer is valid and the `offerId` that you need to accept or decline the job.

> [!NOTE]
> The maximum lifetime of a job is 90 days, after which it'll automatically expire.

## Worker Deregistration

If a worker would like to stop receiving offers, it can be deregistered by setting `AvailableForOffers` to `false` when updating the worker and you receive a [RouterWorkerDeregistered](../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerderegistered) event from Event Grid.  Any existing offers for the worker are revoked and you receive a [RouterWorkerOfferRevoked](../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferrevoked) event for each offer.

::: zone pivot="programming-language-csharp"

```csharp
worker.AvailableForOffers = false;
worker = await client.UpdateWorkerAsync(worker);
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
worker = await client.path("/routing/workers/{workerId}", worker.body.id).patch({
    body: { availableForOffers: false },
    contentType: "application/merge-patch+json"
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
worker = client.upsert_worker(worker_id = worker.id, available_for_offers = False)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
worker = client.updateWorkerWithResponse(worker.getId(), worker.setAvailableForOffers(false));
```

::: zone-end

> [!NOTE]
> If a worker is registered and idle for more than 7 days, it'll be automatically deregistered. Once deregistered, the worker's status is `draining` if one or more jobs are still assigned, or `inactive` if no jobs are assigned.

<!-- LINKS -->
[subscribe_events]: ../../how-tos/router-sdk/subscribe-events.md
[offer_issued_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued
