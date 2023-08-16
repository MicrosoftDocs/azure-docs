---
title: Use availability zones for high availability in Azure NetApp Files | Microsoft Docs
description: Azure availability zones are highly available, fault tolerant, and more scalable than traditional single or multiple data center infrastructures.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 11/17/2022
ms.author: anfdocs
---
# Use availability zones for high availability in Azure NetApp Files (preview)

Azure [availability zones](../availability-zones/az-overview.md#availability-zones) are physically separate locations within each supporting Azure region that are tolerant to local failures. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved because of redundancy and logical isolation of Azure services. To ensure resiliency, a minimum of three separate availability zones are present in all [availability zone-enabled regions](../availability-zones/az-overview.md#azure-regions-with-availability-zones). 

>[!IMPORTANT]
> Availability zones are referred to as _logical zones_. Each data center is assigned to a physical zone. Physical zones are mapped to logical zones in your Azure subscription, and the mapping will be different with different subscriptions. Azure subscriptions are automatically assigned this mapping when a subscription is created. Azure NetApp Files aligns with the generic logical-to-physical availability zone mapping for all Azure services for the subscription. 

Azure availability zones are highly available, fault tolerant, and more scalable than traditional single or multiple data center infrastructures. Azure availability zones let you design and operate applications and databases that automatically transition between zones without interruption. You can design resilient solutions by using Azure services that use availability zones.  

The use of high availability (HA) architectures with availability zones are now a default and best practice recommendation in [Azure’s Well-Architected Framework](/azure/architecture/framework/resiliency/design-best-practices#use-zone-aware-services). Enterprise applications and resources are increasingly deployed into multiple availability zones to achieve this level of high availability (HA) or failure domain (zone) isolation.

:::image type="content" alt-text="Diagram of three availability zones in one Azure region." source="../media/azure-netapp-files/availability-zone-diagram.png":::

Azure NetApp Files' [availability zone volume placement](manage-availability-zone-volume-placement.md) feature lets you deploy volumes in availability zones of your choice, in alignment with Azure compute and other services in the same zone.  

[!INCLUDE [Availability Zone volumes have the same level of support as other volumes in the subscription](includes/availability-zone-service-callout.md)]

All Virtual Machines within the region in (peered) VNets can access all Azure NetApp Files resources (blue arrows). Virtual Machines accessing Azure NetApp Files volumes in the same zone (green arrows) share the availability zone failure domain. 

Azure NetApp Files deployments will occur in the availability of zone of choice if Azure NetApp Files is present in that availability zone and has sufficient capacity.

>[!IMPORTANT]
>Azure NetApp Files availability zone volume placement provides zonal placement. It ***does not*** provide proximity placement towards compute. As such, it ***does not*** provide lowest latency guarantee. VM-to-storage latencies are within the availability zone latency envelopes. 

You can co-locate your compute, storage, networking, and data resources across an availability zone, and replicate this arrangement in other availability zones. Many applications are built for HA across multiple availability zones using application-based replication and failover technologies, like [SQL Server Always-On Availability Groups (AOAG)](/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server), [SAP HANA with HANA System Replication (HSR)](../virtual-machines/workloads/sap/sap-hana-high-availability-netapp-files-suse.md), and [Oracle with Data Guard](../virtual-machines/workloads/oracle/oracle-reference-architecture.md#high-availability-for-oracle-databases). 

Latency is subject to availability zone latency for within availability zone access and the regional latency envelope for cross-availability zone access.

## Azure regions with availability zones

For a list of regions that that currently support availability zones, see [Azure regions with availability zone support](../reliability/availability-zones-service-support.md).

## Next steps

* [Manage availability zone volume placement](manage-availability-zone-volume-placement.md)
* [Understand cross-zone replication of Azure NetApp Files](cross-zone-replication-introduction.md)
* [Create cross-zone replication](create-cross-zone-replication.md)
