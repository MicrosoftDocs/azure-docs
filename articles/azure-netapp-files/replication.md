---
title: Understand Azure NetApp Files replication  
description: Learn about replication options in Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 06/27/25
ms.author: anfdocs
ms.custom: references_regions
---
# Understand Azure NetApp Files replication  

Azure NetApp Files supports three models for replication:

- [Cross-zone replication](#cross-zone-replication)
- [Cross-region replication](#cross-region-replication)
- [Cross-zone-region replication ](#cross-zone-region-replication)

Learn about all three options to decide which options best suit your [reliability plan](../reliability/reliability-netapp-files.md).

## Cross-zone replication and availability zones 

Azure NetApp Files supports cross-zone replication, which relies on availability zones. 

### Availability zones

Azure [availability zones](../reliability/availability-zones-overview.md) are physically separate locations within each supporting Azure region that are tolerant to local failures. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved because of redundancy and logical isolation of Azure services. To ensure resiliency, a minimum of three separate availability zones are present in all [availability zone-enabled regions](../reliability/availability-zones-region-support.md). 

>[!IMPORTANT]
> Availability zones are referred to as _logical zones_. Each data center is assigned to a physical zone. [Physical zones are mapped to logical zones in your Azure subscription](/azure/reliability/availability-zones-overview#physical-and-logical-availability-zones), and the mapping is different with different subscriptions. Azure subscriptions are automatically assigned this mapping when a subscription is created. Azure NetApp Files aligns with the generic logical-to-physical availability zone mapping for all Azure services for the subscription. 

To learn more about availability zones in Azure NetApp Files, see [Azure NetApp Files reliability](../reliability/reliability-netapp-files.md).

>[!IMPORTANT]
>It's not recommended that you use availability zones with Terraform-managed volumes. If you do, you must [add the zone property to your volume](manage-availability-zone-volume-placement.md#populate-availability-zone-for-terraform-managed-volumes).

#### Azure regions with availability zones

For a list of regions that currently support availability zones, see [Azure regions with availability zone support](../reliability/availability-zones-region-support.md).

### Cross-zone replication

In many cases resiliency across availability zones is achieved by high-availability (HA) architectures using application-based replication and HA. Simpler, more cost-effective approaches are often considered by using storage-based data replication instead.  

Similar to the Azure NetApp Files [cross-region replication feature](cross-region-replication-introduction.md), the cross-zone replication (CZR) capability provides data protection between volumes in different availability zones. You can asynchronously replicate data from an Azure NetApp Files volume (source) in one availability zone to another Azure NetApp Files volume (destination) in another availability zone. This capability enables you to fail over your critical application if a zone-wide outage or disaster happens. 

Cross-zone replication is available in all [availability zone-enabled regions](../reliability/availability-zones-region-support.md) with [Azure NetApp Files presence](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=netapp&regions=all&rar=true).

### Cost model for cross-zone replication 

Replicated volumes are hosted on a [capacity pool](azure-netapp-files-understand-storage-hierarchy.md#capacity_pools). As such, the cost for cross-zone replication is based on the provisioned capacity pool size and tier as normal. There is no additional cost for data replication.

## Cross-region replication 

The Azure NetApp Files replication functionality provides data protection through cross-region volume replication. You can asynchronously replicate data from an Azure NetApp Files volume (source) in one region to another Azure NetApp Files volume (destination) in another region. This capability enables you to fail over your critical application if a region-wide outage or disaster happens.

Azure NetApp Files cross-region replication must adhere to [supported regional pairs](#supported-cross-region-replication-pairs). 

### Cost model for cross-region replication

With Azure NetApp Files cross-region replication, you pay only for the amount of data you replicate. There's no setup charge or minimum usage fee. The replication price is based on the replication frequency and the region of the *destination* volume you choose during the initial replication configuration. For more information, see the [Azure NetApp Files Pricing](https://azure.microsoft.com/pricing/details/netapp/) page.  

Regular Azure NetApp Files storage capacity charge applies to the replication destination volume (also called the *data protection* volume). 

#### Pricing examples

The cross-region replication amount billed in a month is based on the amount of data replicated through the cross-region replication feature during that month. The amount of data replicated is measured in GiB. It represents the sum of data replicated across two regions during all regular replications from the source volumes to the destination volumes and during all resync replications from the destination volumes to the source volumes.

##### Example 1: Month 1 baseline replication and incremental replications

Assume the following situations:

* Your *source* volume is from the Azure NetApp Files *Premium* service level. It has a volume quota size of 1000 GiB and a volume consumed size of 500 GiB at the beginning of the first day of a month. The volume is in the *US South Central* region.
* Your *destination* volume is from the Azure NetApp Files *Standard* service level. It is in the *US East 2* region.
* You’ve configured an *hourly* based cross-region replication between the two volumes above. Therefore, the price of replication is $0.12 per GiB.
* For simplicity, assume your source volume has a constant 0.5-GiB data change every hour, but the total volume consumed size doesn't grow (remains at 500 GiB). 

After the initial setup, the baseline replication happens immediately.  

* Data amount replicated during baseline replication: `500 GiB`
* Baseline replication charges: `500 GiB * $0.12 = $60`

After the baseline replication, only changed blocks are replicated. Therefore, only 0.5 GiB of data will be replicated every hour in the subsequent incremental replications.

* Sum of data amount replicated across incremental replications for a 30-day month: `0.5 GiB * 24 hours * 30 days = 360 GiB`
* Incremental replication charges: `360 GiB * $0.12 = $43.2`

By the end of Month 1, the total cross-region replication charge is as follows:  

*  Total cross-region replication charge from Month 1: `$60 + $43.2 = $103.2`

Regular Azure NetApp Files storage capacity charge applies to the destination volume. However, the destination volume can use a storage tier that is different from (and cheaper than) the source volume tier.

##### Example 2: Month 2 incremental replications and resync replications  

Assume you have a source volume, a destination volume, and a replication relationship between the two setups as described in Example 1. For 29 days of the second month (a 30-day month), the hourly replications occurred as expected.

* Sum of data amount replicated across incremental replications for 29 days: `0.5 GiB * 24 hours * 29 days = 348 GiB`

Assume that on the last day of the month, an unplanned outage occurred in the source region and you failed over to the destination volume. After 2 hours, the source region recovered and you performed a resync replication from the destination volume to the source volume. During the 2 hours, 0.8 GiB of data change occurred at the destination volume and needed to be resynced to the source.

* Sum of data amount replicated across regular replications for 22 hours on the last day: `0.5 GiB * 22 hours = 11 GiB`
* Data amount replicated during one resync replication: `0.8 GiB`

Therefore, by the end of Month 2, the total cross-region replication charge is as follows:  

* Total cross-region replication charge from Month 2: `(348 GiB + 11 GiB + 0.8 GiB) * $0.12 = $43.18`

Regular Azure NetApp Files storage capacity charge for Month 2 applies to the destination volume.

## Cross-zone-region replication 

Azure NetApp Files supports using cross-zone and cross-region replication on the same source volume. With this added layer of protection, you can protect your volumes with a second protection volume in the following combinations:

* Cross-region and​ cross-zone replication target volumes

:::image type="content" source="./media/cross-zone-region-introduction/zone-region.png" alt-text="Diagram of cross-zone and cross-region replication." lightbox="./media/cross-zone-region-introduction/zone-region.png":::

* Two cross-region replication target volumes

:::image type="content" source="./media/cross-zone-region-introduction/double-region.png" alt-text="Diagram of double cross-region replication." lightbox="./media/cross-zone-region-introduction/double-region.png":::

* Two cross-zone replication target volumes in any combination of availability zones, including in-zone replication

:::image type="content" source="./media/cross-zone-region-introduction/double-zone.png" alt-text="Diagram of double cross-zone replication." lightbox="./media/cross-zone-region-introduction/double-zone.png":::

### Requirements for cross-zone-region replication 

* Cross-zone-region replication adheres to the same requirements as [cross-zone replication](cross-zone-replication-requirements-considerations.md) and [cross-region replication](cross-region-replication-requirements-considerations.md).

* If you use cross-region replication, you must adhere to supported [cross-region replication pairs](#supported-region-pairs).

* Cross-zone-region replication can be performed under a single subscription or [across subscriptions](cross-region-replication-create-peering.md#register-for-cross-subscription-replication).

## <a name="supported-region-pairs"></a>Supported cross-region replication pairs

[!INCLUDE [Supported region pairs](includes/region-pairs.md)]

## Next steps

- [Manage cross-zone-region replication](cross-zone-region-replication-configure.md)