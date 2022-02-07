---
title: Accept/Decline an offer in Job Router
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to manage the job offer
author: marcma
ms.author: marcma
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 01/18/2022
ms.custom: template-how-to

#Customer intent: As a developer, I want to accept/decline job offers when coming in.
---

# Accept/Decline an offer

This guide outlines the steps to observe and response a Job Router offer.

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Observe the offer issued event
After creating a job, observe the [offer issued event](../subscribe-events.md#microsoftcommunicationrouterworkerofferissued) which contains the worker ID and job offer ID.

```csharp
var workerId = event.data.workerId;
var offerId = event.data.offerId;
Console.WriteLine($"Job Offer ID: {offerId} offered to worker {workerId} ");
     
```

## Accept a job offer

Then, the worker can accept the job offer by using the SDK

```csharp
var result = await client.AcceptJobOfferAsync(workerId, offerId);

```

## Decline a job offer

Aternatively, the worker can decline the job offer by using the SDK if worker is not willing to take the job.

```csharp
var result = await client.DeclineJobOfferAsync(workerId, offerId);

```
