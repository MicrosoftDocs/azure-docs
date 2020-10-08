---
title: Troubleshoot capacity pool issues for Azure NetApp Files | Microsoft Docs
description: Describes potential issues you might have when managing capacity pools and provides solutions for the issues. 
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
ms.topic: troubleshooting
ms.date: 09/22/2020
ms.author: b-juche
---
# Troubleshoot capacity pool issues

This article describes resolutions to issues you might have when managing capacity pools. 

## Error conditions and resolutions 

|     Error condition    |     Resolution    |
|-|-|
| Issues creating a capacity pool |  Make sure that the capacity pool count does not exceed the limit. See [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md).  If the count is less than the limit and you still experience issues, file a support ticket and specify the capacity pool name. |
| Issues deleting a capacity pool  |  Make sure that you remove all Azure NetApp Files volumes and snapshots in the subscription where you are trying to delete the capacity pool. <br> If you already removed all volumes and snapshots and you still cannot delete the capacity pool, references to resources might still exist without showing in the portal. In this case, file a support ticket, and specify that you have performed the above recommended steps. |
| Volume creation or modification fails with `Requested throughput not available` error | Available throughput for a volume is determined by its capacity pool’s size and the service level. If you do not have sufficient throughput, you should increase the pool size or adjust the existing volume throughput. | 

## Next steps  

* [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
* [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md)
