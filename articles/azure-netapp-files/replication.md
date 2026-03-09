---
title: Understand Azure NetApp Files Replication  
description: Learn about cross-zone, cross-region, and cross-zone-region replication options in Azure NetApp Files to decide which options suit your reliability plan. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 12/09/2025
ms.author: anfdocs
ms.custom: references_regions
---
# Understand Azure NetApp Files replication  

Azure NetApp Files supports the following models for replication:

- Cross-zone replication
- Cross-region replication
- Cross-zone-region replication

Learn about all three models to decide which options best suit your [reliability plan](/azure/reliability/reliability-netapp-files).

## Cross-zone replication and availability zones 

Azure NetApp Files supports cross-zone replication, which relies on availability zones. 

### Availability zones

Azure [availability zones](/azure/reliability/availability-zones-overview) are physically separate locations within each supporting Azure region that are tolerant to local failures. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Redundancy and logical isolation of Azure services achieve this tolerance to failures. To ensure resiliency, a minimum of three separate availability zones are present in all [availability zone-enabled regions](/azure/reliability/regions-list).

>[!IMPORTANT]
> When you configure the availability zone for a volume, you actually configure its *logical zone*. Each datacenter is assigned to a physical zone. [Physical zones are mapped to logical zones in your Azure subscription](/azure/reliability/availability-zones-overview#physical-and-logical-availability-zones), and the mapping is different with different subscriptions. Azure subscriptions are automatically assigned this mapping when a subscription is created. Azure NetApp Files aligns with the generic logical-to-physical availability zone mapping for all Azure services for the subscription.

To learn more about availability zones in Azure NetApp Files, see [Reliability in Azure NetApp Files](/azure/reliability/reliability-netapp-files).

> [!IMPORTANT]
> If you manage volumes with Terraform, [add the zone property to your volume](manage-availability-zone-volume-placement.md#populate-availability-zone-for-terraform-managed-volumes).

#### Azure regions with availability zones

For a list of regions that currently support availability zones, see [Azure regions with availability zone support](/azure/reliability/regions-list).

### Cross-zone replication

In many cases, you can achieve resiliency across availability zones by implementing high-availability (HA) architectures that use application-based replication and HA. You can consider simpler, more cost-effective approaches like using storage-based data replication instead.

Similarly to Azure NetApp Files [cross-region replication](#cross-region-replication), cross-zone replication provides data protection between volumes in different availability zones. You can asynchronously replicate data from an Azure NetApp Files volume (the source) in one availability zone to another Azure NetApp Files volume (the destination) in another availability zone. This capability enables you to fail over your critical application if a zone-wide outage or disaster happens.

Cross-zone replication is available in all [availability zone-enabled regions](/azure/reliability/regions-list) that support [Azure NetApp Files](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=netapp&regions=all&rar=true).

For more information about service-level objectives (SLOs), see [Azure NetApp Files reliability](/azure/reliability/reliability-netapp-files#behavior-during-a-region-failure).

### Cost model for cross-zone replication 

Replicated volumes are hosted on a [capacity pool](azure-netapp-files-understand-storage-hierarchy.md#capacity_pools). So, the cost for cross-zone replication is based on the provisioned capacity pool size and tier. There's no extra cost for data replication.

## Cross-region replication

Azure NetApp Files replication is available across regions. You can asynchronously replicate data from an Azure NetApp Files volume (the source) in one region to another Azure NetApp Files volume (the destination) in another region. This capability enables you to fail over your critical application if a region-wide outage or disaster happens.

Azure NetApp Files cross-region replication must use [supported regional pairs](#supported-region-pairs). 

For more information about SLOs, see [Azure NetApp Files reliability](/azure/reliability/reliability-netapp-files#behavior-during-a-region-failure).

### Cost model for cross-region replication

When you use Azure NetApp Files cross-region replication, you pay only for the amount of data that you replicate. There's no setup charge or minimum usage fee. The replication price is based on the replication frequency and the region of the *destination* volume that you choose during the initial replication configuration. For more information, see [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/).

Regular Azure NetApp Files storage capacity charges apply to the replication destination volume, also known as the *data protection* volume. 

#### Pricing examples

The cross-region replication amount that's billed in a month is based on the amount of data that's replicated through the cross-region replication feature during that month. The amount of replicated data is measured in gibibyte (GiB). It represents the sum of data that's replicated across two regions during all regular replications from the source volumes to the destination volumes and during all resync replications from the destination volumes to the source volumes. The following prices are for example purposes only.

##### Example 1: Month 1 baseline replication and incremental replications

Assume the following conditions:

* Your *source* volume is from the Azure NetApp Files *Premium* service level. It has a volume quota size of 1,000 GiB and a volume consumed size of 500 GiB at the beginning of the first day of a month. The volume is in the *US South Central* region.

* Your *destination* volume is from the Azure NetApp Files *Standard* service level. It's in the *US East 2* region.

* You configure an *hourly* based cross-region replication between the two preceding volumes. Therefore, the price of replication is $0.12 per GiB.

* For simplicity, assume that your source volume has a constant 0.5-GiB data change every hour but that the total volume consumed size doesn't grow. It remains at 500 GiB.

After the initial setup, the baseline replication happens immediately.  

* Data amount replicated during baseline replication: `500 GiB`
* Baseline replication charges: `500 GiB * $0.12 = $60`

After the baseline replication, only changed blocks are replicated. Therefore, only 0.5 GiB of data is replicated every hour in the subsequent incremental replications.

* Sum of the data amount replicated across incremental replications for a 30-day month: `0.5 GiB * 24 hours * 30 days = 360 GiB`
* Incremental replication charges: `360 GiB * $0.12 = $43.2`

By the end of Month 1, the total cross-region replication charge is `$60 + $43.2 = $103.2`.

Regular Azure NetApp Files storage capacity charges apply to the destination volume. However, the destination volume can use a different and less expensive storage tier than the source volume tier.

##### Example 2: Month 2 incremental replications and resync replications

Assume that you have a source volume, a destination volume, and a replication relationship between the two setups as described in Example 1. For 29 days of the second month (a 30-day month), the hourly replications occur as expected.

* Sum of the data amount replicated across incremental replications for 29 days: `0.5 GiB * 24 hours * 29 days = 348 GiB`

Assume that on the last day of the month, an unplanned outage occurs in the source region, and you failed over to the destination volume. After two hours, the source region recovered, and you performed a resync replication from the destination volume to the source volume. During the two hours, 0.8 GiB of data change occurred at the destination volume and needed to be resynced to the source.

* Sum of the data amount replicated across regular replications for 22 hours on the last day: `0.5 GiB * 22 hours = 11 GiB`
* Data amount replicated during one resync replication: `0.8 GiB`

Therefore, by the end of Month 2, the total cross-region replication charge is `(348 GiB + 11 GiB + 0.8 GiB) * $0.12 = $43.18`.

Regular Azure NetApp Files storage capacity charges for Month 2 apply to the destination volume.

## Cross-zone-region replication

Azure NetApp Files supports using cross-zone and cross-region replication on the same source volume, enabling asynchronous replication of volumes across availability zones and regions, 

>[!NOTE]
>Cross zone-region replication uses the same pricing model as cross-region and cross-zone replication. 

With cross-zone-region replication, you can protect your volumes by using a second protection volume in the following combinations:

* Cross-region and​ cross-zone replication target volumes

   :::image type="complex" border="false" source="./media/reliability/zone-region.png" alt-text="Diagram of cross-zone and cross-region replication." lightbox="./media/reliability/zone-region.png":::
      A box labeled Region A contains a source volume in zone 1 and a destination volume in zone 2. An arrow that represents cross-zone replication points from the source volume in zone 1 to the destination volume in zone 2. Another box labeled Region B contains a destination volume in zone 1. An arrow that represents cross-region replication points from the source volume in region A to the destination volume in region B.
   :::image-end:::

* Two cross-region replication target volumes

   :::image type="complex" border="false" source="./media/reliability/double-region.png" alt-text="Diagram of double cross-region replication." lightbox="./media/reliability/double-region.png":::
      A box labeled Region A contains a source volume. Another box labeled Region B contains a destination volume. A third box labeled Region C contains another destination volume. Arrows that represent cross-region replication point from the source volume in region A to the destination volume in region B and to the destination volume in region C.
   :::image-end:::

* Two cross-zone replication target volumes in any combination of availability zones, including in-zone replication

   :::image type="complex" border="false" source="./media/reliability/double-zone.png" alt-text="Diagram of double cross-zone replication." lightbox="./media/reliability/double-zone.png":::
      A box labeled Region A contains a source volume in zone 1. Another box contains a destination volume in zone 2. An arrow that represents cross-zone replication points from the source volume in region A, zone 1 to the destination volume in zone 2. A third box contains another destination volume in zone 3. An arrow that represents cross-zone replication points from the source volume in region A, zone 1 to the destination volume in zone 3.
   :::image-end:::

### Requirements for cross-zone-region replication

* Cross-zone-region replication has the [same requirements](replication-requirements.md) as cross-zone replication and cross-region replication.

* If you use cross-region replication, you must use supported [cross-region replication pairs](#supported-region-pairs).

* Cross-zone-region replication can be performed under a single subscription or [across subscriptions](cross-region-replication-create-peering.md#register-for-cross-subscription-replication).

## <a name="supported-region-pairs"></a>Supported cross-region replication pairs

[!INCLUDE [Supported region pairs](includes/region-pairs.md)]

## Next step

- [Manage cross-zone-region replication](cross-zone-region-replication-configure.md)