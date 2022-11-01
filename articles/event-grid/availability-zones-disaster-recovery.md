---
title: Availability zones and disaster recovery | Microsoft Docs
description: Describes how Azure Event Grid supports availability zones and disaster recovery.
ms.topic: conceptual
ms.date: 07/18/2022
---

# Availability zones and disaster recovery
Azure availability zones are designed to help you achieve resiliency and reliability for your business-critical workloads. Event Grid supports automatic geo-disaster recovery of event subscription configuration data (metadata) for topics, system topics, domains, and partner topics. This article gives you more details about Event Grid's support for availability zones and disaster recovery. 

## Availability zones

Azure availability zones are designed to help you achieve resiliency and reliability for your business-critical workloads. Azure maintains multiple geographies. These discrete demarcations define disaster recovery and data residency boundaries across one or multiple Azure regions. Maintaining many regions ensures customers are supported across the world.

Azure Event Grid event subscription configurations and events are automatically replicated across data centers in the availability zone, and replicated in the three availability zones (when available) in the region specified to provide automatic in-region recovery of your data in case of a failure in the region. See [Azure regions with availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones) to learn more about the supported regions with availability zones.

Azure availability zones are connected by a high-performance network with a round-trip latency of less than 2ms. They help your data stay synchronized and accessible when things go wrong. Each zone is composed of one or more datacenters equipped with independent power, cooling, and networking infrastructure. Availability zones are designed so that if one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.

With availability zones, you can design and operate applications and databases that automatically transition between zones without interruption. Azure availability zones are highly available, fault tolerant, and more scalable than traditional single or multiple datacenter infrastructures.

If a region supports availability zones, the event data is replicated across availability zones though.

:::image type="content" source="../availability-zones/media/availability-zones-region-geography.png" alt-text="Diagram that shows availability zones that protect against localized disasters and regional or large geography disasters by using another region.":::

## Disaster recovery

Event Grid supports automatic geo-disaster recovery of event subscription configuration data (metadata) for topics, system topics and domains. Event Grid automatically syncs your event-related infrastructure to a paired region. If an entire Azure region goes down, the events will begin to flow to the geo-paired region with no intervention from you.

> [!NOTE]
> Event data is not replicated to the paired region, only the metadata is replicated.

Microsoft offers options to recover from a failure, you can opt to enable recovery to a paired region where available or disable recovery to a paired region to manage your own recovery. See [Azure cross-region replication pairings for all geographies](../availability-zones/cross-region-replication-azure.md#azure-cross-region-replication-pairings-for-all-geographies) to learn more about the supported paired regions. The failover is nearly instantaneous once initiated. To learn more about how to implement your own failover strategy, see [Build your own disaster recovery plan for Azure Event Grid topics and domains](custom-disaster-recovery.md) .

Microsoft-initiated failover is exercised by Microsoft in rare situations to fail over all the Event Grid resources from an affected region to the corresponding geo-paired region. This process is a default option and requires no intervention from the user. Microsoft reserves the right to make a determination of when this option will be exercised. This mechanism doesn't involve a user consent before the user's traffic is failed over.

If you have decided not to replicate any data to a paired region, you'll need to invest in some practices to build your own disaster recovery scenario and recover from a severe loss of application functionality using more than 2 regions. See [Build your own disaster recovery plan for Azure Event Grid topics and domains](custom-disaster-recovery.md) for more details. See [Build your own client-side disaster recovery for Azure Event Grid topics](custom-disaster-recovery-client-side.md) in case you want to implement client-side disaster recovery for Azure Event Grid topics.

## RTO and RPO

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

## Metrics

Event Grid also provides [diagnostic logs schemas](diagnostic-logs.md) and [metrics](metrics.md) that helps you to identify a problem when there is a failure when publishing or delivering events. See the [troubleshoot](troubleshoot-issues.md) article in case you need with solving an issue in Azure Event Grid.

## More information

You may find more information availability zone resiliency and disaster recovery in Azure Event Grid in our [FAQ](./event-grid-faq.yml).

## Next steps

- If you want to implement your own disaster recovery plan for Azure Event Grid topics and domains, see [Build your own disaster recovery for custom topics in Event Grid](custom-disaster-recovery.md).