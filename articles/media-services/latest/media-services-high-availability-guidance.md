---
title: Azure Media Services high availability
description: Learn how to failover to a secondary Media Services account if a regional datacenter outage or failure occurs.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.subservice:  
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 02/24/2020
ms.author: juliako
---

# Azure Media Services high availability guidance

Azure Media Services encoding service is a regional batch processing platform and not currently designed for high availability within a single region. The encoding service currently does not provide instant failover of the service if there is a regional datacenter outage or failure of underlying component or dependent services (such as storage, SQL, etc.)  This article explains how to deploy Media Services to maintain a high-availability architecture with failover and ensure optimal availability for your applications. 

By following the guidelines and best-practices described in the article, you will lower risk of encoding failures, delays, and minimize recovery time if an outage occurs in a single region.

## How to build a cross-regional encoding system

* [Create](create-account-cli-how-to.md) two (or more) Azure Media Services accounts.
* Subscribe for **JobStateChange** messages in each account.

    * In Media Services v3, it is done via Azure Event Grid. For more information, see:
    
       * [Event Grid examples](../../event-grid/receive-events.md), 
       * [Azure Event Grid schemas for Media Services events](media-services-event-schemas.md), 
       * [Register for events via the Azure portal or the CLI](reacting-to-media-services-events.md) (you can also do it with the EventGrid Management SDK)
       * [Microsoft.Azure.EventGrid SDK](https://www.nuget.org/packages/Microsoft.Azure.EventGrid/) (which supports Media Services events natively). 
       
        You can also consume Event Grid events via Azure Functions.
    * In Media Services v2, this is done via [NotificationEndpoints](../previous/media-services-dotnet-check-job-progress-with-webhooks.md).
* When you [create a job](transforms-jobs-concept.md):

    * Randomly select an account from the list of currently used accounts (this list will normally contain both accounts but if issues are detected it may only contain one account). If the list is empty, raise an alert so an operator can investigate.
    * General guidance is you need one [media reserved unit](media-reserved-units-cli-how-to.md) per task or [JobOutput](https://docs.microsoft.com/rest/api/media/jobs/create#joboutputasset) (unless you are using [VideoAnalyzerPreset](analyzing-video-audio-files-concept.md) in v3).
    * Get the count of [media reserved units](media-reserved-units-cli-how-to.md) (MRUs) for the chosen account. If the current **media reserved units** count isn’t already at the maximum value, add the number of the MRUs needed by the job and update the service. If your job submission rate is high and you are frequently querying the MRUs to find you are at the maximum, use a distributed cache for the value with a reasonable timeout.
    * Keep a count of the number of inflight jobs.
* When your JobStateChange handler gets a notification that a job has reached the scheduled state, record the time it enters the schedule state and the region/account used.    
* When your JobStateChange handler gets a notification that a job has reached the processing state, mark the record for the job as processing.
* When your JobStateChange handler gets a notification that a job has reached the Finished/Errored/Canceled state, mark the record for the job as final and decrement the inflight job count. Get the number of media reserved units for the chosen account and compare the current MRU number against your inflight job count. If your inflight count is less than the MRU count, then decrement it and update the service.
* Have a separate process that periodically looks at your records of the jobs. If you have jobs in the scheduled state that haven’t advanced to the processing state in a reasonable amount of time for a given region, remove that region from your list of currently used accounts.

    * Depending on your business requirements, you could decide to cancel those jobs right away and resubmit them to the other account. Or, you could give them some more time to move to the next state.   
    * After a period of time, add the account back to the currently used list (with the assumption that the region has recovered).
    
If you find the MRU count is thrashing up and down a lot, move the decrement logic to the periodic task. Have the pre-job submit logic compare inflight count to the current MRU count to see if it needs to update the MRUs.

## How to build video-on-demand cross region streaming 

* Video-on-demand cross region streaming involves duplicating [Assets](assets-concept.md), [Content Key Policies](content-key-policy-concept.md) (if used), [Streaming Policies](streaming-policy-concept.md), and [Streaming Locators](streaming-locators-concept.md). 
* You will have to create the policies in both regions and keep them up to date. 
* When you create the streaming locators, you will want to use the same LocatorId value, ContentKey Id value, and ContentKey value.  
* If you are encoding the content, it is advised to encode the content in region A and publish it, then copy the encoded content to region B and publish it using the same values as from region A.
* You can use traffic manager on the host names for the origin and the key delivery service (in Media Services configuration this will look like a custom key server URL).

## Next steps

* [Create an account](create-account-cli-how-to.md)
* Check out [code samples](https://docs.microsoft.com/samples/browse/?products=azure-media-services)
