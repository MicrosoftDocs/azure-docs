---
title: Understand volume quota for Azure NetApp Files | Microsoft Docs
description: Provides an overview about volume quota. Also provides references about monitoring and managing volume and pool capacity.  
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
ms.date: 04/30/2021
ms.author: anfdocs
---
# Understand volume quota

This article provides an overview about volume quota for Azure NetApp Files. It also provides references to details that can help you monitor and manage the capacity of a volume or capacity pool.  

## Behaviors of volume quota 

* The storage capacity of an Azure NetApp Files volume is limited to the set size (quota) of the volume. 

* When volume consumption maxes out, neither the volume nor the underlying capacity pool grows automatically. Instead, the volume will receive an “out of space” condition. However, you can [resize the capacity pool or a volume](azure-netapp-files-resize-capacity-pools-or-volumes.md) as needed. You should actively [monitor the capacity of a volume](monitor-volume-capacity.md) and the underlying capacity pool.

* Depending on the capacity pool type, the size (quota) of an Azure NetApp Files volume has an impact on its bandwidth performance and the provisioned capacity.  See the [auto QoS pool type](azure-netapp-files-understand-storage-hierarchy.md#qos_types) for details. 

* The capacity consumed by volume [snapshots](snapshots-introduction.md) counts towards the provisioned space in the volume. 

* Volume quota doesn't apply to a [replication destination volume](cross-region-replication-introduction.md).

* See [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md) about the calculation of capacity consumption and overage in capacity consumption.

## Next steps

* [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md)
* [Monitor the capacity of a volume](monitor-volume-capacity.md)
* [Resize the capacity pool or a volume](azure-netapp-files-resize-capacity-pools-or-volumes.md)
* [Capacity management FAQs](faq-capacity-management.md)