---
title: Azure Media Services business continuity and disaster recovery 
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
# Handle Media Services business continuity and disaster recovery

Azure Media Services does not provide instant failover of the service if there is a regional datacenter outage or failure. This article explains how to configure your environment for a failover to ensure optimal availability for applications and minimized recovery time if a disaster occurs.

We recommend that you configure business continuity disaster recovery (BCDR) across regional pairs to benefit from Azure’s isolation and availability policies. For more information, see [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

## Prerequisites

Review:

* [Azure Business Continuity Technical Guidance](https://docs.microsoft.com/azure/architecture/resiliency/) - describes a general framework to help you think about business continuity and disaster recovery
* [Disaster recovery and high availability for Azure applications](https://docs.microsoft.com/azure/architecture/reliability/disaster-recovery) - provides architecture guidance on strategies for Azure applications to achieve High Availability (HA) and Disaster Recovery (DR)

## Business continuity and disaster recovery (failover to a secondary account)

In order to implement BCDR, you need to have two Media Services accounts to handle redundancy.

1. [Create](create-account-cli-how-to.md) two Media Services accounts, one for your primary region and the other to the paired azure region. 
1. If there is a failure in your primary region, switch to encoding, streaming (live and on-demand) using the secondary account.

> [!TIP]
> You can automate BCDR by setting up activity log alerts for service health notifications as per [Create activity log alerts on service notifications](../../service-health/alerts-activity-log-service-notifications.md).


## How to build a cross regional encoding system

1. [Create](create-account-cli-how-to.md) two (or more) Azure Media Services accounts.
1. Subscribe for **JobStateChange** messages in each account.

    * In Media Services v3, it is done via Azure Event Grid. For more information, see [Event Grid examples](../../event-grid/receive-events.md), [Azure Event Grid schemas for Media Services events](media-services-event-schemas.md), and the [Microsoft.Azure.EventGrid SDK](https://www.nuget.org/packages/Microsoft.Azure.EventGrid/) (which supports Media Services events natively). Also, see [how to register for events via the Azure portal or the CLI](eacting-to-media-services-events.md) (you can also do it with the EventGrid Management SDK). You can also consume Event Grid events via Azure Functions.
    * In Media Services v2, this is done via [NotificationEndpoints](../previous/media-services-dotnet-check-job-progress-with-webhooks.md).
1. When you [create a job](transforms-jobs-concept.md):

    * Randomly select an account from the list of currently used accounts (this list will normally contain both accounts but if issues are detected it may only contain one account). If the list is empty, raise an alert so an operator can investigate.
    * General guidance is you need one reserved unit per task or JobOutput (unless you are using VideoAnalyzerPreset in v3).
    * Get the IEncodingReservedUnit entity for the chosen account. If the current **reserved units** (RUs) count isn’t already at the maximum value, add the number of the RUs needed by the job and update the service. If your job submission rate is high and you are frequently querying the RUs to find you are at the maximum, use a distributed cache for the value with a reasonable timeout.
    * Keep a count of the number of inflight jobs.
1. When your JobStateChange handler gets a notification that a job has reached the scheduled state, record the time it enters the schedule state and the region/account used.    
1. When your JobStateChange handler gets a notification that a job has reached the processing state, mark the record for the job as processing.
1. When your JobStateChange handler gets a notification that a job has reached the Finished/Errored/Canceled state, mark the record for the job as final and decrement the inflight job count. Get the IEncodingReservedUnit entity for the chosen account and compare the current **Reserved Unit** number against your inflight job count. If your inflight count is less than the RU count, then decrement it and update the service.
1. Have a separate process that periodically looks at your records of the jobs. If you have jobs in the scheduled state that haven’t advanced to the processing state in a reasonable amount of time for a given region, remove that region from your list of currently used accounts.

    * Depending on your business requirements, you could decide to cancel those jobs right away and resubmit them to the other account. Or, you could give them some more time to move to the next state.   
    * After a period of time, add the account back to the currently used list (with the assumption that the region has recovered).
    
If you find the RU count is thrashing up and down a lot, move the decrement logic to the periodic task. Have the pre-job submit logic compare inflight count to the current RU count to see if it needs to update the RUs.
 
You can use code like this to increment and decrement the RUs:
 
```csharp
public static void IncrementReservedUnits(CloudMediaContext context)
{
    IEncodingReservedUnit reservedUnits = context.EncodingReservedUnits.First();

    if (reservedUnits.CurrentReservedUnits < reservedUnits.MaxReservableUnits)
    {
        reservedUnits.CurrentReservedUnits = reservedUnits.CurrentReservedUnits + 1;
        reservedUnits.Update();
    }
}

public static void DecrementReservedUnits(CloudMediaContext context)
{
    IEncodingReservedUnit reservedUnits = context.EncodingReservedUnits.First();

    if (reservedUnits.CurrentReservedUnits > 0)
    {
        reservedUnits.CurrentReservedUnits = reservedUnits.CurrentReservedUnits - 1;
        reservedUnits.Update();
    }
}
```
 
## Next steps

[Create an account](create-account-cli-how-to.md)
