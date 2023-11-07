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
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
---

# Job Router worker capacity

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

When configuring workers, we want to provide a way to specify how many jobs a worker can handle at a time from various channels.  This configuration can be done by specifying the total capacity of the worker and assigning a cost per job for each channel.

## Example: Worker that can handle one voice job or up to five chat jobs

In this example, we configure a worker with total capacity of 100 and set the voice channel to consume 100 capacity per job and the chat channel to consume 20 capacity per job.  This configuration means that the worker can handle one voice job at a time or up to five chat jobs at the same time.  If the worker is handling one or more chat jobs, then the worker cannot take any voice jobs until those chat jobs are completed.  If the worker is handling a voice job, then the worker cannot take any chat jobs until the voice job is completed.

::: zone pivot="programming-language-csharp"

```csharp
var worker = await client.CreateWorkerAsync(
    new CreateWorkerOptions(workerId: "worker1", totalCapacity: 100)
    {
        QueueAssignments = { ["queue1"] = new RouterQueueAssignment() },
        ChannelConfigurations =
        {
            ["voice"] = new ChannelConfiguration(capacityCostPerJob: 100),
            ["chat"] = new ChannelConfiguration(capacityCostPerJob: 20)
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
        "queue1": {}
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
    .setQueueAssignments(Map.of("queue1", new RouterQueueAssignment()))
    .setChannelConfigurations(Map.of(
        "voice", new ChannelConfiguration(100),
        "chat", new ChannelConfiguration(20))));
```

::: zone-end

## Example: Worker that can handle one voice jobs and up to two chat jobs and two email jobs at the same time

In this example, a worker is configured with total capacity of 100.  Next, the voice channel is set to consume 60 capacity per job and the chat and email channels to consume 10 capacity per job each with a `maxNumberOfJobs` set to two.  This configuration means that the worker can handle one voice job at a time and up to two chat jobs and up to two email jobs at the same time.  Since the chat and email channels are configured with a `maxNumberOfJobs` of two, those channels consume up to a maximum of 40 capacity in total.  Therefore, the worker can always handle up to one voice job.  The voice channel takes "priority" over the other channels.

::: zone pivot="programming-language-csharp"

```csharp
var worker = await client.CreateWorkerAsync(
    new CreateWorkerOptions(workerId: "worker1", totalCapacity: 100)
    {
        QueueAssignments = { ["queue1"] = new RouterQueueAssignment() },
        ChannelConfigurations =
        {
            ["voice"] = new ChannelConfiguration(capacityCostPerJob: 60),
            ["chat"] = new ChannelConfiguration(capacityCostPerJob: 10) { MaxNumberOfJobs = 2},
            ["email"] = new ChannelConfiguration(capacityCostPerJob: 10) { MaxNumberOfJobs = 2}
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
        "queue1": {}
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
    .setQueueAssignments(Map.of("queue1", new RouterQueueAssignment()))
    .setChannelConfigurations(Map.of(
        "voice", new ChannelConfiguration(60),
        "chat", new ChannelConfiguration(10).setMaxNumberOfJobs(2),
        "email", new ChannelConfiguration(10).setMaxNumberOfJobs(2))));
```

::: zone-end

## Next steps

- [Getting started with Job Router](../../quickstarts/router/get-started-router.md)
