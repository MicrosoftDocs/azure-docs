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

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

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
const distributionPolicy = await administrationClient.createDistributionPolicy("Longest_Idle_45s_Min1Max10", {
    offerExpiresAfterSeconds: 45,
    mode: {
        kind: "longest-idle",
        minConcurrentOffers: 1,
        maxConcurrentOffers: 10
    },
    name: "Longest Idle matching with a 45s offer expiration; min 1, max 10 offers"
});

const queue = await administrationClient.createQueue("XBOX_DEFAULT_QUEUE", {
    name: "XBOX Default Queue",
    distributionPolicyId: distributionPolicy.id
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
distribution_policy = administration_client.create_distribution_policy(
    distribution_policy_id = "Longest_Idle_45s_Min1Max10",
    distribution_policy = DistributionPolicy(
        offer_expires_after = timedelta(seconds = 45),
        mode = LongestIdleMode(min_concurrent_offers = 1, max_concurrent_offers = 10),
        name = "Longest Idle matching with a 45s offer expiration; min 1, max 10 offers"
    ))

queue = administration_client.create_queue(
    queue_id = "XBOX_DEFAULT_QUEUE",
    queue = RouterQueue(
        name = "XBOX Default Queue",
        distribution_policy_id = distribution_policy.id
    ))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
DistributionPolicy distributionPolicy = administrationClient.createDistributionPolicy(new CreateDistributionPolicyOptions(
    "Longest_Idle_45s_Min1Max10",
    Duration.ofSeconds(45),
    new LongestIdleMode().setMinConcurrentOffers(1).setMaxConcurrentOffers(10))
    .setName("Longest Idle matching with a 45s offer expiration; min 1, max 10 offers"));
```

::: zone-end

## Update a queue

The Job Router SDK will update an existing queue when the `UpdateQueueAsync` method is called.

::: zone pivot="programming-language-csharp"

```csharp
await administrationClient.UpdateQueueAsync(new UpdateQueueOptions(queue.Value.Id)
{
    Name = "XBOX Updated Queue",
    Labels = { ["Additional-Queue-Label"] = new LabelValue("ChatQueue") }
});
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await administrationClient.updateQueue(queue.id, {
    name: "XBOX Updated Queue",
    labels: { "Additional-Queue-Label": "ChatQueue" }
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
administration_client.update_queue(
    queue_id = queue.id,
    queue = RouterQueue(
        name = "XBOX Updated Queue",
        labels = { "Additional-Queue-Label": "ChatQueue" }
    ))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
administrationClient.updateQueue(new UpdateQueueOptions(queue.getId())
    .setName("XBOX Updated Queue")
    .setLabels(Map.of("Additional-Queue-Label", new LabelValue("ChatQueue"))));
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
await administrationClient.deleteQueue(queue.id);
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
