---
title: Geo disaster recovery in Azure Event Grid | Microsoft Docs
description: Describes how Azure Event Grid supports geo disaster recovery (GeoDR) automatically. 
ms.topic: conceptual
ms.date: 06/21/2022
---

# Server-side geo disaster recovery in Azure Event Grid

Event Grid supports automatic geo-disaster recovery of event subscription configuration data (metadata) for topics, system topics, domains, and partner topics. Event Grid automatically syncs your event-related infrastructure to a paired region. If an entire Azure region goes down, the events will begin to flow to the geo-paired region with no intervention from you. 

> [!NOTE]
> Event data is not replicated to the paired region, only the metadata is replicated.

Microsoft offers options to recover from a failure, you can opt to enable recovery to a paired region where available or disable recovery to a paired region to manage your own recovery. See [Azure cross-region replication pairings for all geographies](../availability-zones/cross-region-replication-azure.md#azure-cross-region-replication-pairings-for-all-geographies) to learn more about the supported paired regions. The failover is nearly instantaneous once initiated. To learn more about how to implement your own failover strategy, see [Build your own disaster recovery plan for Azure Event Grid topics and domains](custom-disaster-recovery.md) .

Microsoft-initiated failover is exercised by Microsoft in rare situations to fail over all the Event Grid resources from an affected region to the corresponding geo-paired region. This process is a default option and requires no intervention from the user. Microsoft reserves the right to make a determination of when this option will be exercised. This mechanism doesn't involve a user consent before the user's traffic is failed over.

## Metrics

Disaster recovery is measured with two metrics:

- Recovery Point Objective (RPO): the minutes or hours of data that may be lost.
- Recovery Time Objective (RTO): the minutes or hours the service may be down.

Event Grid’s automatic failover has different RPOs and RTOs for your metadata (topics, domains, event subscriptions.) and data (events). If you need different specification from the following ones, you can still implement your own [client-side fail over using the topic health apis](custom-disaster-recovery.md).

### Recovery point objective (RPO)
- **Metadata RPO**: zero minutes. Anytime a resource is created in Event Grid, it's instantly replicated across regions. When a failover occurs, no metadata is lost.
- **Data RPO**: If your system is healthy and caught up on existing traffic at the time of regional failover, the RPO for events is about 5 minutes.

### Recovery time objective (RTO)
- **Metadata RTO**: Though generally it happens much more quickly, within 60 minutes, Event Grid will begin to accept create/update/delete calls for topics and subscriptions.
- **Data RTO**: Like metadata, it generally happens much more quickly, however within 60 minutes, Event Grid will begin accepting new traffic after a regional failover.

> [!IMPORTANT]
> - There is no service level agreement (SLA) for server-side disaster recovery. If the paired region has no extra capacity to take on the additional traffic, Event Grid cannot initiate failover. Service level objectives are best-effort only. 
> - The cost for metadata GeoDR on Event Grid is: $0.
> - Geo-disaster recovery isn't supported for partner topics. 


## Next steps

If you want to implement your own client-side failover logic, see [# Build your own disaster recovery for custom topics in Event Grid](custom-disaster-recovery.md)
