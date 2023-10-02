---
title: Cross-region replication of Azure NetApp Files volumes | Microsoft Docs
description: Describes what Azure NetApp Files cross-region replication does, supported region pairs, service-level objectives, data durability, and cost model.  
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
ms.date: 05/08/2023
ms.author: anfdocs
ms.custom: references_regions
---
# Cross-region replication of Azure NetApp Files volumes

The Azure NetApp Files replication functionality provides data protection through cross-region volume replication. You can asynchronously replicate data from an Azure NetApp Files volume (source) in one region to another Azure NetApp Files volume (destination) in another region. This capability enables you to fail over your critical application if a region-wide outage or disaster happens.

## <a name="supported-region-pairs"></a>Supported cross-region replication pairs

Azure NetApp Files volume replication is supported between various [Azure regional pairs](../availability-zones/cross-region-replication-azure.md#azure-paired-regions) and non-standard pairs. Azure NetApp Files volume replication is currently available between the following regions. You can replicate Azure NetApp Files volumes from Regional Pair A to Regional Pair B, and vice versa.  

### Azure regional pairs

| Geography | Regional Pair A | Regional Pair B  |
|:--- |:--- |:--- |
| Australia | Australia Central | Australia Central 2 |
| Australia | Australia East | Australia Southeast |
| Asia-Pacific | East Asia | Southeast Asia | 
| Brazil/North America | Brazil South | South Central US |
| Canada | Canada Central | Canada East |
| Europe | North Europe | West Europe |
| Germany | Germany West Central | Germany North |
| India | Central India |South India |
| Japan | Japan East | Japan West |
| Korea | Korea Central | Korea South |
| North America | East US | West US |
| North America | East US 2 | Central US |
| North America | North Central US | South Central US|
| North America | West US 3 | East US |
| Norway | Norway East | Norway West |
| Switzerland | Switzerland North | Switzerland West |
| UK | UK South | UK West |
| United Arab Emirates | UAE North | UAE Central |
| US Government | US Gov Arizona | US Gov Texas |
| US Government | US Gov Virginia | US Gov Texas |

### Azure regional non-standard pairs

| Geography | Regional Pair A | Regional Pair B  |
|:--- |:--- |:--- |
| Australia/Southeast Asia | Australia East | Southeast Asia |
| France/Europe | France Central | West Europe |
| Germany/UK | Germany West Central | UK South |
| Germany/Europe | Germany West Central | West Europe | 
| Germany/France | Germany West Central | France Central |
| Qatar/Europe | Qatar Central | West Europe |
| North America | East US | East US 2 |
| North America | East US 2| West US 2 |
| North America | North Central US | East US 2|
| North America | South Central US | East US |
| North America | South Central US | East US 2 |
| North America | South Central US | Central US |
| North America | West US 2 | East US |
| North America | West US 2 | West US 3 |
| US Government | US Gov Arizona | US Gov Virginia |

>[!NOTE]
>There may be a discrepancy in the size and number of snapshots between source and destination. This discrepancy is expected. Snapshot policies and replication schedules will influence the number of snapshots. Snapshot policies and replication schedules, combined with the amount of data changed between snapshots, will influence the size of snapshots. To learn more about snapshots, refer to [How Azure NetApp Files snapshots work](snapshots-introduction.md).

## Service-level objectives

Recovery Point Objective (RPO) indicates the point in time to which data can be recovered. The RPO target is typically less than twice the replication schedule, but it can vary. In some cases, it can go beyond the target RPO based on factors such as the total dataset size, the change rate, the percentage of data overwrites, and the replication bandwidth available for transfer.   

* For the replication schedule of 10 minutes, the typical RPO is less than 20 minutes.  
* For the hourly replication schedule, the typical RPO is less than two hours.  
* For the daily replication schedule, the typical RPO is less than two days.  

Recovery Time Objective (RTO), or the maximum tolerable business application downtime, is determined by factors in bringing up the application and providing access to the data at the second site. The storage portion of the RTO for breaking the peering relationship to activate the destination volume and provide read and write data access in the second site is expected to be complete within a minute.

## Cost model for cross-region replication  

With Azure NetApp Files cross-region replication, you pay only for the amount of data you replicate. There's no setup charge or minimum usage fee. The replication price is based on the replication frequency and the region of the *destination* volume you choose during the initial replication configuration. For more information, see the [Azure NetApp Files Pricing](https://azure.microsoft.com/pricing/details/netapp/) page.  

Regular Azure NetApp Files storage capacity charge applies to the replication destination volume (also called the *data protection* volume). 

### Pricing examples

The cross-region replication amount billed in a month is based on the amount of data replicated through the cross-region replication feature during that month. The amount of data replicated is measured in GiB. It represents the sum of data replicated across two regions during all regular replications from the source volumes to the destination volumes and during all resync replications from the destination volumes to the source volumes.

#### Example 1: Month 1 baseline replication and incremental replications

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

#### Example 2: Month 2 incremental replications and resync replications  

Assume you have a source volume, a destination volume, and a replication relationship between the two setups as described in Example 1. For 29 days of the second month (a 30-day month), the hourly replications occurred as expected.

* Sum of data amount replicated across incremental replications for 29 days: `0.5 GiB * 24 hours * 29 days = 348 GiB`

Assume that on the last day of the month, an unplanned outage occurred in the source region and you failed over to the destination volume. After 2 hours, the source region recovered and you performed a resync replication from the destination volume to the source volume. During the 2 hours, 0.8 GiB of data change occurred at the destination volume and needed to be resynced to the source.

* Sum of data amount replicated across regular replications for 22 hours on the last day: `0.5 GiB * 22 hours = 11 GiB`
* Data amount replicated during one resync replication: `0.8 GiB`

Therefore, by the end of Month 2, the total cross-region replication charge is as follows:  

* Total cross-region replication charge from Month 2: `(348 GiB + 11 GiB + 0.8 GiB) * $0.12 = $43.18`

Regular Azure NetApp Files storage capacity charge for Month 2 applies to the destination volume.

## Next steps

* [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md)
* [Create volume replication](cross-region-replication-create-peering.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Manage disaster recovery](cross-region-replication-manage-disaster-recovery.md)
* [Resize a cross-region replication destination volume](azure-netapp-files-resize-capacity-pools-or-volumes.md#resize-a-cross-region-replication-destination-volume)
* [Volume replication metrics](azure-netapp-files-metrics.md#replication)
* [Delete volume replications or volumes](cross-region-replication-delete.md)
* [Troubleshoot cross-region replication](troubleshoot-cross-region-replication.md)
* [Test disaster recovery for Azure NetApp Files](test-disaster-recovery.md)
