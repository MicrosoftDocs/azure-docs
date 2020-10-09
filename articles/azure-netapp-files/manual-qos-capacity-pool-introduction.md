---
title: Manual QoS capacity pool of Azure NetApp Files | Microsoft Docs
description: Provides an introduction to the manual QoS capacity pool and references for additional information. 
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
ms.date: 09/23/2020
ms.author: b-juche
---
# Manual QoS capacity pool

This article provides an introduction to the manual Quality of Service (QoS) capacity pool functionality.

## How manual QoS differs from auto QoS

The [QoS type](azure-netapp-files-understand-storage-hierarchy.md#qos_types) is an attribute of a capacity pool. Azure NetApp Files provides two QoS types of capacity pools – auto (default) and manual.  

In a *manual* QoS capacity pool, you can assign the capacity and throughput for a volume independently. The total throughput of all volumes created with a manual QoS capacity pool is limited by the total throughput of the pool. It is determined by the combination of the pool size and the service-level throughput. 

In an *auto* QoS capacity pool, throughput is assigned automatically to the volumes in the pool, proportional to the size quota assigned to the volumes.  

See [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md) and [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md) for considerations about QoS types.

## How to specify the manual QoS type

When you [create a capacity pool](azure-netapp-files-set-up-capacity-pool.md), you can specify for the capacity pool to use the manual QoS type.  You can also [change an existing capacity pool](manage-manual-qos-capacity-pool.md#change-to-qos) to use the manual QoS type. 

Setting the capacity type to manual QoS is a permanent change. You cannot convert a manual QoS type capacity tool to an auto QoS capacity pool. 

Using the manual QoS type requires that you [register the feature](manage-manual-qos-capacity-pool.md#register-the-feature).  

## Next steps

* [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md)
* [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
* [Storage Hierarchy](azure-netapp-files-understand-storage-hierarchy.md) 
* [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
* [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md)
* [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Create an NFS volume](azure-netapp-files-create-volumes.md)
* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume](create-volumes-dual-protocol.md)
* [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md)
* [Troubleshoot capacity pool issues](troubleshoot-capacity-pools.md)
