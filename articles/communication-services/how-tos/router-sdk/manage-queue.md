---
title: Manage a queue in Job Router
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to manage the behavior of a queue
author: jasonshave
ms.author: jassha
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 10/14/2021
ms.custom: template-how-to

#Customer intent: As a developer, I want to manage the behavior of my jobs in a queue.
---

# Manage a queue

This guide outlines the steps to create and manage a Job Router queue.

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Create a queue

To create a simple queue in Job Router, use the SDK to specify the **queue ID**, **name**, and a **distribution policy ID**. The distribution policy must be created in advance as the Job Router will validate its existence upon creation of the queue. In the following example, a distribution policy is created to control how Job offers are generated for Workers.

```csharp
var distributionPolicy = await client.SetDistributionPolicyAsync(
    id: "Longest_Idle_45s_Min1Max10",
    name: "Longest Idle matching with a 45s offer expiration; min 1, max 10 offers",
    offerTTL: TimeSpan.FromSeconds(45),
    mode: new LongestIdleMode(
        minConcurrentOffers: 1,
        maxConcurrentOffers: 10)
);

var queue = await client.SetQueueAsync(
    id: "XBOX_DEFAULT_QUEUE",
    name: "XBOX Default Queue",
    distributionPolicy: "Longest_Idle_45s_Min1Max10"
);
```
## Update a queue

The Job Router SDK will create a new queue or update an existing queue when the `SetQueue` or `SetQueueAsync` method is called.

```csharp
var queue = await client.SetQueueAsync(
    id: "XBOX_DEFAULT_QUEUE",
    name: "XBOX Default Queue",
    distributionPolicy: "Longest_Idle_45s_Min1Max10"
);
```

## Delete a queue

To delete a queue using the Job Router SDK call the `DeleteQueue` or `DeleteQueueAsync` method passing the **queue ID**.

```csharp
var result = await client.DeleteQueueAsync("XBOX_DEFAULT_QUEUE");
```

> [!NOTE]
> To delete a queue you must make sure there are no active jobs assigned to it. Additionally, make sure there are no references to the queue in any classification policies or rules that use an expression to select the queue by ID using a string value.