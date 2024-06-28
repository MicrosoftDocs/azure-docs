---
title: Reliability in Azure Event Hubs
description: Learn about reliability in Azure Event Hubs
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: event-hubs
ms.date: 06/12/2024
---

<!--#Customer intent:  I want to understand reliability support in Azure Event Hubs so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->


# Reliability in Azure Event Hubs

This article describes reliability support in [Azure Event Hubs](../event-hubs/event-hubs-about.md), and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]


Event Hubs implements transparent failure detection and failover mechanisms so that, when failure occurs, the service continues to operate within the assured service-levels and without noticeable interruptions. If you create an Event Hubs namespace in a region that supports availability zones, [zone redundancy](./availability-zones-overview.md#zonal-and-zone-redundant-services) is automatically enabled. With zone-redundancy, fault tolerance is increased and the service has enough capacity reserves to cope with the outage of an entire facility.  Both metadata and data (events) are replicated across data centers in each zone. 


### Prerequisites

Availability zone support is only available in [Azure regions with availability zones](./availability-zones-service-support.md). 


### Create a resource with availability zones enabled

When you use the Azure portal, zone redundancy is automatically enabled. When you create a namespace, you see the following highlighted message when you select a region that supports availability zones. 

:::image type="content" source="../event-hubs/media/event-hubs-geo-dr/eh-az.png" alt-text="Image showing the Create Namespace page with region that has availability zones":::


### Disable availability zones

The Azure portal doesn't support disabling availability zones. To disable availability zones, use one of the following methods:

- Azure CLI command [`az eventhubs namespace`](/cli/azure/eventhubs/namespace#az-eventhubs-namespace-create) with `--zone-redundant=false` 

- PowerShell command [`New-AzEventHubNamespace`](/powershell/module/az.eventhub/new-azeventhubnamespace) with `-ZoneRedundant=false` to create a namespace with zone redundancy disabled. 

### Availability zone migration

You can't disable or enable availability zones for Event Hubs. When you create availability zones in the a region that supports them, availability zones are automatically enabled. 


### Zone down experience


When a client application sends events to an event hub without specifying a partition, events are automatically distributed among partitions in your event hub. If a partition isn't available for some reason, events are distributed among the remaining partitions. This behavior allows for the greatest amount of up time. For use cases that require the maximum up time, this model is preferred instead of sending events to a specific partition.

### Pricing
Need Info. Any pricing considerations when using availability zones?


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

The all-active Azure Event Hubs cluster model with availability zone support provides resiliency against  hardware and datacenter outages. However, if a disaster where an entire region and all zones are unavailable, you can use Geo-disaster recovery to recover your workload and application configuration. 

There are two features that provide geo-disaster recovery in Azure Event Hubs.

- **Geo-disaster recovery (Metadata DR)**, which just provides replication of only metadata.

    
    Geo-Disaster recovery ensures that the entire configuration of a namespace (Event Hubs, Consumer Groups, and settings) is continuously replicated from a primary namespace to a secondary namespace when paired. 
    
    The Geo-disaster recovery feature of Azure Event Hubs is a disaster recovery solution. The concepts and workflow described in this article apply to disaster scenarios, and not to temporary outages.  For a detailed discussion of disaster recovery in Microsoft Azure, see [this article](/azure/architecture/resiliency/disaster-recovery-azure-applications).
    
    With Geo-Disaster recovery, you can initiate a once-only failover move from the primary to the secondary at any time. The failover move points the chosen alias name for the namespace to the secondary namespace. After the move, the pairing is then removed. The failover is nearly instantaneous once initiated. 
    
    > [!IMPORTANT]
    > - Microsoft Entra role-based access control (RBAC) assignments to entities in the primary namespace aren't replicated to the secondary namespace. You'll need to create role assignments manually in the secondary namespace to secure access to them. 

    For detailed information, as well as samples and further documentation, on Geo-Disaster recovery in Event Hubs, see [Azure Event Hubs - Geo-disaster recovery](../event-hubs/event-hubs-geo-dr.md).

- **Geo-replication (public preview)**, which provides replication of both metadata and data, replicates configuration information and all of the data from a primary namespace to one, or more secondary namespaces. When a failover is performed, the selected secondary becomes the primary and the previous primary becomes a secondary. Users can perform a failover back to the original primary when desired.
    
    > [!IMPORTANT]
    > - This feature is currently in public preview, and as such shouldn't be used in production scenarios.
    > - The following regions are currently supported in the public preview.
    >
    > | US               | Europe        |
    > |------------------|---------------|
    > | Central US EUAP  | Italy North   |
    > |                  | Spain Central |
    > |                  | Norway East   |

    For detailed information, as well as samples and further documentation, on Geo-replication in Event Hubs, see [Geo-replication ](../event-hubs/geo-replication.md).



## Next steps
- [Reliability in Azure](./overview.md)


