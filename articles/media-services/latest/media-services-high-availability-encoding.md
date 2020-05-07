---
title: Azure Media Services high availability encoding
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

# Media Services high availability encoding 

Azure Media Services encoding service is a regional batch processing platform and not currently designed for high availability within a single region. The encoding service currently does not provide instant failover of the service if there is a regional datacenter outage or failure of underlying component or dependent services (such as storage, SQL). This article explains how to deploy Media Services to maintain a high-availability architecture with failover and ensure optimal availability for your applications.

By following the guidelines and best-practices described in the article, you will lower risk of encoding failures, delays, and minimize recovery time if an outage occurs in a single region.

## How to build a cross-regional encoding system

* [Create](create-account-cli-how-to.md) two (or more) Azure Media Services accounts.

    The two accounts need to be in different regions. For more info, see [regions in which the Azure Media Services service is deployed](https://azure.microsoft.com/global-infrastructure/services/?products=media-services).
* Upload your media to the same region from which you are planning to submit the job. For more information about how to start encoding, see [Create a job input from an HTTPS URL](job-input-from-http-how-to.md) or [Create a job input from a local file](job-input-from-local-file-how-to.md).

    If you then need to resubmit the [job](transforms-jobs-concept.md) to another region, you can use JobInputHttp or use [Copy-Blob](https://docs.microsoft.com/rest/api/storageservices/Copy-Blob) to copy the data from the source Asset container to an Asset container in the alternate region.
* Subscribe for JobStateChange messages in each account via Azure Event Grid. For more information, see:

    * [Audio Analytics sample](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/master/AudioAnalytics/AudioAnalyzer) which shows how to monitor a job with Azure Event Grid including adding a fallback in case the Azure Event Grid messages are delayed for some reason.
    * [Azure Event Grid schemas for Media Services events](media-services-event-schemas.md)
    * [Register for events via the Azure portal or the CLI](reacting-to-media-services-events.md) (you can also do it with the EventGrid Management SDK)
    * [Microsoft.Azure.EventGrid SDK](https://www.nuget.org/packages/Microsoft.Azure.EventGrid/) (which supports Media Services events natively).

    You can also consume Event Grid events via Azure Functions.
* When you create a [job](transforms-jobs-concept.md):

    * Randomly select an account from the list of currently used accounts (this list will normally contain both accounts but if issues are detected it may only contain one account). If the list is empty, raise an alert so an operator can investigate.
    * General guidance is you need one [media reserved unit](media-reserved-units-cli-how-to.md) per [JobOutput](https://docs.microsoft.com/rest/api/media/jobs/create#joboutputasset) (unless you are using [VideoAnalyzerPreset](analyzing-video-audio-files-concept.md) where 3 media reserved units per JobOutput is recommended).
    * Get the count of media reserved units (MRUs) for the chosen account. If the current **media reserved units** count isn't already at the maximum value, add the number of the MRUs needed by the job and update the service. If your job submission rate is high and you are frequently querying the MRUs to find you are at the maximum, use a distributed cache for the value with a reasonable timeout.
    * Keep a count of the number of inflight jobs.

* When your JobStateChange handler gets a notification that a job has reached the scheduled state, record the time it enters the schedule state and the region/account used.
* When your JobStateChange handler gets a notification that a job has reached the processing state, mark the record for the job as processing.
* When your JobStateChange handler gets a notification that a job has reached the Finished/Errored/Canceled state, mark the record for the job as final and decrement the inflight job count. Get the number of media reserved units for the chosen account and compare the current MRU number against your inflight job count. If your inflight count is less than the MRU count, then decrement it and update the service.
* Have a separate process that periodically looks at your records of the jobs
    
    * If you have jobs in the scheduled state that haven't advanced to the processing state in a reasonable amount of time for a given region, remove that region from your list of currently used accounts.  Depending on your business requirements, you could decide to cancel those jobs right away and resubmit them to the other region. Or, you could give them some more time to move to the next state.
    * Depending on the number of Media Reserved Units configured on the account and the submission rate, there also may be jobs in the queued state the the system has not picked up for processing yet.  If the list of jobs in the queued state grows beyond an acceptable limit in a region, those jobs can be canceled and submitted to the other region.  However, this may be a symptom of not having enough Media Reserved Units configured on the account for the current load.  You can request a higher Media Reserved Unit quota through Azure Support if necessary.
    * If a region was removed from the account list, monitor it for recovery before adding it back to the list.  The regional health can be monitored via the existing jobs on the region (if they weren't canceled and resubmitted), by adding the account back to the list after a period of time, and by operators monitoring Azure communications about outages that may be affecting Azure Media Services.
    
If you find the MRU count is thrashing up and down a lot, move the decrement logic to the periodic task. Have the pre-job submit logic compare inflight count to the current MRU count to see if it needs to update the MRUs.

## Next steps

* [Build video-on-demand cross region streaming](media-services-high-availability-streaming.md)
* Check out [code samples](https://docs.microsoft.com/samples/browse/?products=azure-media-services)
