---
title: Event Grid support for availability zones and disaster recovery 
description: Describes how Azure Event Grid supports availability zones and disaster recovery.
ms.topic: conceptual
ms.custom: build-2023
ms.date: 09/23/2022
---

# In-region recovery using availability zones and geo-disaster recovery across regions (Azure Event Grid)

This article describes how Azure Event Grid supports automatic in-region recovery of your Event Grid resource definitions and data when a failure occurs in a region that has availability zones. It also describes how Event Grid supports automatic recovery of Event Grid resource definitions (no data) to another region when a failure occurs in a region that has a paired region.

## In-region recovery using availability zones

Azure availability zones are physically separate locations within each Azure region that are tolerant to local failures. They're connected by a high-performance network with a round-trip latency of less than 2 milliseconds. Each availability zone is composed of one or more data centers equipped with independent power, cooling, and networking infrastructure. If one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones. For more information about availability zones, see [Regions and availability zones](../availability-zones/az-overview.md). In this article, you can also see the list of regions that have availability zones.

Event Grid resource definitions for topics, system topics, domains, and event subscriptions and event data are automatically replicated across three availability zones ([when available](../availability-zones/az-overview.md#azure-regions-with-availability-zones)) in the region. When there's a failure in one of the availability zones, Event Grid resources **automatically failover** to another availability zone without any human intervention. Currently, it isn't possible for you to control (enable or disable) this feature. When an existing region starts supporting availability zones, existing Event Grid resources would be automatically failed over to take advantage of this feature. No customer action is required. 

:::image type="content" source="../reliability/media/availability-zones-region-geography.png" alt-text="Diagram that shows availability zones that protect against localized disasters and regional or large geography disasters by using another region.":::

## Geo-disaster recovery across regions

When an Azure region experiences a prolonged outage, you might be interested in failover options to an alternate region for business continuity. Many Azure regions have geo-pairs, and some don't. For a list of regions that have paired regions, see [Azure cross-region replication pairings for all geographies](../availability-zones/cross-region-replication-azure.md#azure-paired-regions). 

For regions with a geo-pair, Event Grid offers a capability to fail over the publishing traffic to the paired region for custom topics, system topics, and domains. Behind the scenes, Event Grid automatically synchronizes resource definitions of topics, system topics, domains, and event subscriptions to the paired region. However, event data isn't replicated to the paired region. In the normal state, events are stored in the region you selected for that resource. When there's a region outage and Microsoft initiates the failover, new events will begin to flow to the geo-paired region and are dispatched from there with no intervention from you. Events published and accepted in the original region are dispatched from there after the outage is mitigated. 

Microsoft-initiated failover is exercised by Microsoft in rare situations to fail over Event Grid resources from an affected region to the corresponding geo-paired region. Microsoft reserves the right to determine when this option will be exercised. This mechanism doesn't involve a user consent before the user's traffic is failed over.

You can enable or disable this functionality by updating the configuration for your topic or domain. Select **Cross-Geo** option (default) to enable Microsoft-initiated failover and **Regional** to disable it. For detailed steps to configure this setting, see [Configure data residency](configure-custom-topic.md#configure-data-residency). If you opt for "regional", no data of any kind is replicated to another region by Microsoft, and you may define your own disaster recovery plan. For more information, see Build your own disaster recovery plan for Azure Event Grid topics and domains. 

:::image type="content" source="./media/availability-zones-disaster-recovery/configuration-page.png" alt-text="Screenshot showing the Configuration page for an Event Grid custom topic.":::

Here are a few reasons why you may want to disable the Microsoft-initiated failover feature: 

- Microsoft-initiated failover is done on a best-effort basis. 
- Some geo pairs may not meet your organization's data residency requirements. 

In such cases, the recommended option is to build your own disaster recovery plan for Azure Event Grid topics and domains. While this option requires a bit more effort, it enables faster failover, and you are in control of choosing secondary regions. If you want to implement client-side disaster recovery for Azure Event Grid topics, see [Build your own client-side disaster recovery for Azure Event Grid topics](custom-disaster-recovery-client-side.md). 

## RTO and RPO

Disaster recovery is measured with two metrics:

- Recovery Point Objective (RPO): the minutes or hours of data that may be lost.
- Recovery Time Objective (RTO): the minutes or hours the service may be down.

Event Grid’s automatic failover has different RPOs and RTOs for your metadata (topics, domains, event subscriptions.) and data (events). If you need different specification from the following ones, you can still implement your own client-side failover using the topic health apis.

### Recovery point objective (RPO)

- **Metadata RPO**: zero minutes. For applicable resources, when a resource is created/updated/deleted, the resource definition is synchronously replicated to the geo-pair. When a failover occurs, no metadata is lost.

- **Data RPO**: When a failover occurs, new data is processed from the paired region. As soon as the outage is mitigated for the affected region, the unprocessed events will be dispatched from there. If the region recovery required longer time than the [time-to-live](delivery-and-retry.md#dead-letter-events) value set on events, the data could get dropped. To mitigate this data loss, we recommend that you [set up a dead-letter destination](manage-event-delivery.md) for an event subscription. If the affected region is completely lost and non-recoverable, there will be some data loss. In the best-case scenario, the subscriber is keeping up with the publish rate and only a few seconds of data is lost. The worst-case scenario would be when the subscriber isn't actively processing events and with a max time to live of 24 hours, the data loss can be up to 24 hours.

### Recovery time objective (RTO)

- **Metadata RTO**: Failover decision making is based on factors like available capacity in paired region and can last in the range of 60 minutes or more. Once failover is initiated, within 5 minutes, Event Grid will begin to accept create/update/delete calls for topics and subscriptions.

- **Data RTO**: Same as above.

> [!IMPORTANT]
> - In case of server-side disaster recovery, if the paired region has no extra capacity to take on the additional traffic, Event Grid cannot initiate failover. The recovery is done on a best-effort basis.
> - The cost for using this feature  is: $0.
> - Geo-disaster recovery is not supported for partner namespaces and partner topics. 

## Next steps

See [Build your own client-side disaster recovery for Azure Event Grid topics](custom-disaster-recovery-client-side.md).
