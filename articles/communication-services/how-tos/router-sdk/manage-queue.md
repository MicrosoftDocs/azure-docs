---
title: Manage a queue in Job Router
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to manage the behavior of a queue
author: jasonshave
ms.author: jassha
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 10/14/2021
ms.custom: template-how-to, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
#Customer intent: As a developer, I want to manage the behavior of my jobs in a queue.
---

# Manage a queue

This guide outlines the steps to create and manage a Job Router queue.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Create a distribution policy and a queue

To create a simple queue in Job Router, use the SDK to specify the **queue ID**, **name**, and a **distribution policy ID**. The distribution policy must be created in advance as the Job Router will validate its existence upon creation of the queue. In the following example, a distribution policy is created to control how Job offers are generated for Workers.

::: zone pivot="programming-language-csharp"

```csharp
var distributionPolicy = await administrationClient.CreateDistributionPolicyAsync(
    new CreateDistributionPolicyOptions(
        distributionPolicyId: "Longest_Idle_45s_Min1Max10",
        offerExpiresAfter: TimeSpan.FromSeconds(45),
        mode: new LongestIdleMode { MinConcurrentOffers = 1, MaxConcurrentOffers = 10 })
    {
        Name = "Longest Idle matching with a 45s offer expiration; min 1, max 10 offers",
    });

var queue = await administrationClient.CreateQueueAsync(
    new CreateQueueOptions(
        queueId: "XBOX_DEFAULT_QUEUE", 
        distributionPolicyId: distributionPolicy.Value.Id)
    {
        Name = "XBOX Default Queue"
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
const distributionPolicy = await client.path("/routing/distributionPolicies/{distributionPolicyId}", "Longest_Idle_45s_Min1Max10").patch({
    body: {
        offerExpiresAfterSeconds: 45,
        mode: {
            kind: "longestIdle",
            minConcurrentOffers: 1,
            maxConcurrentOffers: 10
        },
        name: "Longest Idle matching with a 45s offer expiration; min 1, max 10 offers"
    },
    contentType: "application/merge-patch+json"
});

const queue = await client.path("/routing/queues/{queueId}", "XBOX_DEFAULT_QUEUE").patch({
    body: {
        distributionPolicyId: distributionPolicy.body.id,
        name: "XBOX Default Queue"
    },
    contentType: "application/merge-patch+json"
  });

```

::: zone-end

::: zone pivot="programming-language-python"

```python
distribution_policy = administration_client.upsert_distribution_policy(
    distribution_policy_id = "Longest_Idle_45s_Min1Max10",
    offer_expires_after = timedelta(seconds = 45),
    mode = LongestIdleMode(min_concurrent_offers = 1, max_concurrent_offers = 10),
    name = "Longest Idle matching with a 45s offer expiration; min 1, max 10 offers"
)

queue = administration_client.upsert_queue(
    queue_id = "XBOX_DEFAULT_QUEUE",
    name = "XBOX Default Queue",
    distribution_policy_id = distribution_policy.id
)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
DistributionPolicy distributionPolicy = administrationClient.createDistributionPolicy(new CreateDistributionPolicyOptions(
    "Longest_Idle_45s_Min1Max10",
    Duration.ofSeconds(45),
    new LongestIdleMode().setMinConcurrentOffers(1).setMaxConcurrentOffers(10))
    .setName("Longest Idle matching with a 45s offer expiration; min 1, max 10 offers"));

RouterQueue queue = administrationClient.createQueue(new CreateQueueOptions(
    "XBOX_DEFAULT_QUEUE",
    distributionPolicy.getId())
    .setName("XBOX Default Queue"));
```

::: zone-end

## Update a queue

The Job Router SDK will update an existing queue when the `UpdateQueueAsync` method is called.

::: zone pivot="programming-language-csharp"

```csharp
queue.Name = "XBOX Updated Queue";
queue.Labels.Add("Additional-Queue-Label", new RouterValue("ChatQueue"));
await administrationClient.UpdateQueueAsync(queue);
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await administrationClient.path("/routing/queues/{queueId}", queue.body.id).patch({
    body: {
        name: "XBOX Updated Queue",
        labels: { "Additional-Queue-Label": "ChatQueue" }
    },
    contentType: "application/merge-patch+json"
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
queue.name = "XBOX Updated Queue"
queue.labels["Additional-Queue-Label"] = "ChatQueue"
administration_client.upsert_queue(queue.id, queue)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
queue.setName("XBOX Updated Queue");
queue.setLabels(Map.of("Additional-Queue-Label", new RouterValue("ChatQueue")));
administrationClient.updateQueue(queue.getId(), BinaryData.fromObject(queue));
```

::: zone-end

## Delete a queue

To delete a queue using the Job Router SDK, call the `DeleteQueue` method passing the **queue ID**.

::: zone pivot="programming-language-csharp"

```csharp
await administrationClient.DeleteQueueAsync(queue.Value.Id);
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.path("/routing/queues/{queueId}", queue.body.id).delete();
```

::: zone-end

::: zone pivot="programming-language-python"

```python
administration_client.delete_queue(queue.id)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
administrationClient.deleteQueue(queue.getId());
```

::: zone-end

> [!NOTE]
> To delete a queue you must make sure there are no active jobs assigned to it. Additionally, make sure there are no references to the queue in any classification policies.
