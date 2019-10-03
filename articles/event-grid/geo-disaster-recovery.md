---
title: Geo disaster recovery in Azure Event Grid | Microsoft Docs
description: Describes how Azure Event Grid supports geo disaster recovery (GeoDR) automatically. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/24/2019
ms.author: spelluru
---

# Server-side geo disaster recovery in Azure Event Grid
Event Grid now has an automatic geo disaster recovery (GeoDR) of meta-data not only for new, but all existing domains, topics, and event subscriptions. If an entire Azure region goes down, Event Grid will already have all of your event-related infrastructure metadata synced to a paired region. Your new events will begin to flow again with no intervention by you. 

Disaster recovery is measured with two metrics:

- [Recovery Point Objective (RPO)](https://en.wikipedia.org/wiki/Disaster_recovery#Recovery_Point_Objective): the minutes or hours of data that may be lost.
- [Recovery Time Objective (RTO)](https://en.wikipedia.org/wiki/Disaster_recovery#Recovery_time_objective): the minutes of hours the service may be down.

Event Grid’s automatic failover has different RPOs and RTOs for your metadata (event subscriptions etc.) and data (events). If you need different specification from the following ones, you can still implement your own [client-side fail over using the topic health apis](custom-disaster-recovery.md).

## Recovery point objective (RPO)
- **Metadata RPO**: zero minutes. Anytime a resource is created in Event Grid, it's instantly replicated across regions. When a failover occurs, no metadata is lost.
- **Data RPO**: If your system is healthy and caught up on existing traffic at the time of regional failover, the RPO for events is about 5 minutes.

## Recovery time objective (RTO)
- **Metadata RTO**: Though generally it happens much more quickly, within 60 minutes, Event Grid will begin to accept create/update/delete calls for topics and subscriptions.
- **Data RTO**: Like metadata, it generally happens much more quickly, however within 60 minutes, Event Grid will begin accepting new traffic after a regional failover.

> [!NOTE]
> The cost for metadata GeoDR on Event Grid is: $0.


## Next steps
If you want to implement you own client-side failover logic, see [# Build your own disaster recovery for custom topics in Event Grid](custom-disaster-recovery.md)
