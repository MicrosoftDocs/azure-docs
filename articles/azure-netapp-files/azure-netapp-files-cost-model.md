---
title: Cost model for Azure NetApp Files | Microsoft Docs
description: Describes the cost model for Azure NetApp Files for managing expenses from the service.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 11/04/2020
ms.author: b-juche
---
# Cost model for Azure NetApp Files 

Understanding the cost model for Azure NetApp Files helps you manage your expenses from the service. 

For cost model specific to cross-region replication, see [Cost model for cross-region replication](cross-region-replication-introduction.md#cost-model-for-cross-region-replication).

## Calculation of capacity consumption

Azure NetApp Files is billed on provisioned storage capacity.  Provisioned capacity is allocated by creating capacity pools.  Capacity pools are billed based on $/provisioned-GiB/month in hourly increments. The minimum size for a single capacity pool is 4 TiB, and capacity pools can be subsequently expanded in 1-TiB increments. Volumes are created within capacity pools.  Each volume is assigned a quota that decrements from the pools-provisioned capacity. The quota that can be assigned to volumes ranges from a minimum of 100 GiB to a maximum of 100 TiB.  

For an active volume, capacity consumption against quota is based on logical (effective) capacity, either on active filesystem or snapshot data. A volume can only contain so much data as the set size (quota).

The total used capacity in a capacity pool against its provisioned amount is the sum of the actual consumption of all volumes within the pool: 

   ![Expression showing total used capacity calculation.](../media/azure-netapp-files/azure-netapp-files-total-used-capacity.png)

## Capacity consumption of snapshots 

The capacity consumption of snapshots in Azure NetApp Files is charged against the quota of the parent volume.  As a result, it shares the same billing rate as the capacity pool to which the volume belongs.  However, unlike the active volume, snapshot consumption is measured based on the incremental capacity consumed.  Azure NetApp Files snapshots are differential in nature. Depending on the change rate of the data, the snapshots often consume much less capacity than the logical capacity of the active volume. For example, assume that you have a snapshot of a 500-GiB volume that only contains 10 GiB of differential data. 
The capacity consumption that is counted towards the volume quota for the active filesystem and snapshot would be 510 GiB, not 1000 GiB. As a general rule, a recommended 20% of capacity can be assumed to retain a week's worth of snapshot data (depending on snapshot frequency and application daily block level change rates). 

The following diagram illustrates these concepts. 

* Assume a capacity pool with 40 TiB of provisioned capacity. The pool contains three volumes:    
    * Volume 1 is assigned a quota of 20 TiB and has 13 TiB (12 TiB active, 1 TiB snapshots) of consumption.
    * Volume 2 is assigned a quota of 1 TiB and has 450 GiB of consumption.
    * Volume 3 is assigned a quota of 14 TiB but has 8.8 TiB (8 TiB active, 800 GiB snapshots) of consumption.   
* The capacity pool is metered for 40 TiB of capacity (the provisioned amount). 22.25 TiB of capacity is consumed (13 TiB, 450 GiB and 8.8 TiB of quota from Volumes 1, 2 and 3). The capacity pool has 17.75 TiB of capacity remaining.   

![Diagram showing capacity pool with three volumes.](../media/azure-netapp-files/azure-netapp-files-capacity-pool-with-three-vols.png)

## Next steps

* [Azure NetApp Files pricing page](https://azure.microsoft.com/pricing/details/storage/netapp/)
* [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Cost model for cross-region replication](cross-region-replication-introduction.md#cost-model-for-cross-region-replication)
* [Understand volume quota](volume-quota-introduction.md)
* [Monitor the capacity of a volume](monitor-volume-capacity.md)
* [Resize the capacity pool or a volume](azure-netapp-files-resize-capacity-pools-or-volumes.md)
* [Capacity management FAQs](azure-netapp-files-faqs.md#capacity-management-faqs)
