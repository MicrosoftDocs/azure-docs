---
title: Worker capacity
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Job Router worker capacity concepts.
author: williamzhao
manager: bga
services: azure-communication-services

ms.author: williamzhao
ms.date: 06/08/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: devx-track-extended-java, devx-track-js
zone_pivot_groups: acs-js-csharp-java-python
---

# Job Router worker capacity

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

When configuring workers, we want to provide a way to specify how many jobs a worker can handle at a time from various channels.  This is done by specifying the total capacity of the worker and assigning a cost per job for each channel.

## Example: Worker that can handle 1 voice jobs or up to 5 chat jobs

In this example, we configure a worker with total capacity of 100 and set the voice channel to consume 100 capacity per job and the chat channel to consume 20 capacity per job.  This means that the worker can handle 1 voice job at a time or up to 5 chat jobs at the same time.  If the worker is handling 1 or more chat jobs, it will not be able to take any voice jobs until those chat jobs are completed.  If the worker is handling a voice job, it will not be able to take any chat jobs until the voice job is completed.

::: zone pivot="programming-language-csharp"

```csharp
var worker = await client.CreateWorkerAsync(
    new CreateWorkerOptions(workerId: "worker1", totalCapacity: 100)
    {
        QueueIds = new Dictionary<string, QueueAssignment>
        {
            ["queue1"] = new()
        },
        ChannelConfigurations = new Dictionary<string, ChannelConfiguration>
        {
            ["voice"] = new(capacityCostPerJob: 100),
            ["chat"] = new(capacityCostPerJob: 20)
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.createWorker("worker1", {
    totalCapacity: 100,
    queueAssignments: { queue1: {} },
    channelConfigurations: {
        voice: { capacityCostPerJob: 100 },
        chat: { capacityCostPerJob: 20 },
    }
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
client.create_worker(worker_id = "worker1", router_worker = RouterWorker(
    total_capacity = 100,
    queue_assignments = {
        "queue1": QueueAssignment()
    },
    channel_configurations = {
        "voice": ChannelConfiguration(capacity_cost_per_job = 100),
        "chat": ChannelConfiguration(capacity_cost_per_job = 20)
    }
))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
client.createWorker(new CreateWorkerOptions("worker1", 100)
    .setQueueAssignments(Map.of("queue1", new QueueAssignment()))
    .setChannelConfigurations(Map.of(
        "voice", new ChannelConfiguration().setCapacityCostPerJob(100),
        "chat", new ChannelConfiguration().setCapacityCostPerJob(20))))
```

::: zone-end

## Example: Worker that can handle 1 voice jobs and up to 2 chat jobs and 2 email jobs at the same time

In this example, we configure a worker with total capacity of 100 and set the voice channel to consume 60 capacity per job and the chat and email channels to consume 10 capacity per job, with a maxNumberOfJobs configured to 2.  This means that the worker can handle 1 voice job at a time and up to 2 chat jobs and up to 2 email jobs at the same time.  Since the chat and email channels are configured with a maxNumberOfJobs of 2, those channels will consume up to a maximum of 40 capacity in total.  Therefore, the worker will always be able to handle up to 1 voice job at all times.  The voice channel takes "priority" over the other channels.

::: zone pivot="programming-language-csharp"

```csharp
var worker = await client.CreateWorkerAsync(
    new CreateWorkerOptions(workerId: "worker1", totalCapacity: 100)
    {
        QueueIds = new Dictionary<string, QueueAssignment>
        {
            ["queue1"] = new()
        },
        ChannelConfigurations = new Dictionary<string, ChannelConfiguration>
        {
            ["voice"] = new(capacityCostPerJob: 60),
            ["chat"] = new(capacityCostPerJob: 10) { MaxNumberOfJobs = 2},
            ["email"] = new(capacityCostPerJob: 10) { MaxNumberOfJobs = 2}
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.createWorker("worker1", {
    totalCapacity: 100,
    queueAssignments: { queue1: {} },
    channelConfigurations: {
        voice: { capacityCostPerJob: 60 },
        chat: { capacityCostPerJob: 10, maxNumberOfJobs: 2 },
        email: { capacityCostPerJob: 10, maxNumberOfJobs: 2 }
    }
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
client.create_worker(worker_id = "worker1", router_worker = RouterWorker(
    total_capacity = 100,
    queue_assignments = {
        "queue1": QueueAssignment()
    },
    channel_configurations = {
        "voice": ChannelConfiguration(capacity_cost_per_job = 60),
        "chat": ChannelConfiguration(capacity_cost_per_job = 10, max_number_of_jobs = 2),
        "email": ChannelConfiguration(capacity_cost_per_job = 10, max_number_of_jobs = 2)
    }
))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
client.createWorker(new CreateWorkerOptions("worker1", 100)
    .setQueueAssignments(Map.of("queue1", new QueueAssignment()))
    .setChannelConfigurations(Map.of(
        "voice", new ChannelConfiguration().setCapacityCostPerJob(60),
        "chat", new ChannelConfiguration().setCapacityCostPerJob(10).setMaxNumberOfJobs(2),
        "email", new ChannelConfiguration().setCapacityCostPerJob(10).setMaxNumberOfJobs(2))))
```

::: zone-end

## Next steps

- [Getting started with Job Router](../../quickstarts/router/get-started-router.md)
