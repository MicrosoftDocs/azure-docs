---
title: How to accept or decline offers in Job Router
titleSuffix: An Azure Communication Services how-to guide
description: Learn how to use Azure Communication Services SDKs to accept or decline job offers in Job Router.
author: marche0133
ms.author: marcma
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 06/01/2022
ms.custom: kr2b-contr-experiment

#Customer intent: As a developer, I want to accept/decline job offers when they come in.
---

# Discover how to accept or decline Job Router job offers

This guide lays out the steps you need to take to observe a Job Router offer. It also outlines how to accept or decline job offers.

## Prerequisites

- An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Azure Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md).

## Observe worker offer-issued events

After you create a job, observe the [worker offer-issued event](subscribe-events.md#microsoftcommunicationrouterworkerofferissued), which contains the worker ID and the job offer ID:

```csharp
var workerId = event.data.workerId;
var offerId = event.data.offerId;
Console.WriteLine($"Job Offer ID: {offerId} offered to worker {workerId} ");
     
```

## Accept job offers

The worker can accept job offers by using the SDK:

```csharp
var result = await client.AcceptJobOfferAsync(workerId, offerId);

```

## Decline job offers

The worker can decline job offers by using the SDK:

```csharp
var result = await client.DeclineJobOfferAsync(workerId, offerId);

```

## Next steps

- Review how to [manage a Job Router queue](manage-queue.md).
- Learn how to [subscribe to Job Router events](subscribe-events.md).
