---
title: Handle an offer in Job Router
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to manage the job offer
author: marcma
ms.author: marcma
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 01/18/2022
ms.custom: template-how-to

#Customer intent: As a developer, I want to handle job offers when coming in.
---

# Handle an offer

This guide outlines the steps to observe and response a Job Router offer.

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Query the worker to observe the job offers
Following the quickstart, use the Job Router client connection to query the Worker and observe the ID of the Job against the ID 

```csharp
    var result = await client.GetWorkerAsync(edmontonWorker.Value.Id);

    Console.WriteLine(
        $"Job Offer ID: {result.Value.Offers[0]} offered to {edmontonWorker.Value.Id} ");
     
```

## Accept a job offer

The worker can accept the job offer by using the client connection

```csharp
    var offer = (await client.GetWorkerAsync(edmontonWorker.Value.Id)).Value.Offers[0];
    var result = await client.AcceptJobOfferAsync(edmontonWorker.Value.Id, offer.Id);

```

## Decline a job offer

The worker can decline the job offer by using the client connection if worker is not willing to take the job.

```csharp
    var offer = (await client.GetWorkerAsync(edmontonWorker.Value.Id)).Value.Offers[0];
    var result = await client.DeclineJobOfferAsync(edmontonWorker.Value.Id, offer.Id);
    
```

## Complete a job

To complete an assigned job by using the client connection with the **assignment ID** provided when acceptting the job offer and **job ID**.

```csharp
    var offer = (await client.GetWorkerAsync(edmontonWorker.Value.Id)).Value.Offers[0];
    var assignmentId = (await client.AcceptJobOfferAsync(edmontonWorker.Value.Id, offer.Id)).Value.AssignmentId;
    
    await client.CompleteJobAsync(offer.JobId, assignmentId);
    
```

> [!NOTE]
> To comfirm the job is complete, subscribe to events to observe the **job completed event**, check [subscript events doc](./subscribe-events.md) on how to subscript events.


## Close a job

To close a completed job by using the client connection with the **job ID** and **assignment ID**. Optionally, pass in a **disposition code** to indicate the outcome of the job, pass **release time** to indicate when to release the capacity.

```csharp
    var offer = (await client.GetWorkerAsync(edmontonWorker.Value.Id)).Value.Offers[0];
    var assignmentId = (await client.AcceptJobOfferAsync(edmontonWorker.Value.Id, offer.Id)).Value.AssignmentId;
    
    await client.CloseJobAsync(offer.JobId, assignmentId, "job completed", DateTime.Now.AddDays(1));
    
```

## Cancel a job

To cancel a job by using the client connection with the **job ID**. Optionally, pass in a **disposition code** to indicate the outcome of the job, pass **note** to record notes.

```csharp
    var offer = (await client.GetWorkerAsync(edmontonWorker.Value.Id)).Value.Offers[0];
    
    await client.CancelJobAsync(offer.JobId, "job cancelled", "should recreate later");
    
```

## Delete a job

To delete a job and all of its traces using the client connection.

```csharp
    var offer = (await client.GetWorkerAsync(edmontonWorker.Value.Id)).Value.Offers[0];
    
    await client.DeleteJobAsync(offer.JobId);
    
```


