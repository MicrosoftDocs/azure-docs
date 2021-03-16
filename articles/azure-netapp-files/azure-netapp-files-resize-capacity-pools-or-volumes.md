---
title: Resize the capacity pool or a volume for Azure NetApp Files  | Microsoft Docs
description: Learn how to change the size of a capacity pool or a volume. Resizing the capacity pool changes the purchased Azure NetApp Files capacity.
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
ms.topic: how-to
ms.date: 03/10/2021
ms.author: b-juche
---
# Resize a capacity pool or a volume
You can change the size of a capacity pool or a volume as necessary. 

## Resize the capacity pool 

You can change the capacity pool size in 1-TiB increments or decrements. However, the capacity pool size cannot be smaller than 4 TiB. Resizing the capacity pool changes the purchased Azure NetApp Files capacity.

1. From the Manage NetApp Account blade, click the capacity pool that you want to resize. 
2. Right-click the capacity pool name or click the "…" icon at the end of the capacity pool’s row to display the context menu. 
3. Use the context menu options to resize or delete the capacity pool.

## Resize a volume

You can change the size of a volume as necessary. A volume's capacity consumption counts against its pool's provisioned capacity.

1. From the Manage NetApp Account blade, click **Volumes**. 
2. Right-click the name of the volume that you want to resize or click the "…" icon at the end of the volume's row to display the context menu.
3. Use the context menu options to resize or delete the volume.

## Resize a cross-region replication destination volume 

In a [cross-region replication](cross-region-replication-introduction.md) relationship, a destination volume is automatically resized based on the size of the source volume. As such, you don’t need to resize the destination volume separately. This automatic resizing behavior is applicable when the volumes are in an active replication relationship, or when replication peering is broken with the [resync operation](cross-region-replication-manage-disaster-recovery.md#resync-replication). 

The following table describes the destination volume resizing behavior based on the [Mirror state](cross-region-replication-display-health-status.md):

|  Mirror state  | Destination volume resizing behavior |
|-|-|
| *Mirrored* | When the destination volume has been initialized and is ready to receive mirroring updates, resizing the source volume automatically resizes the destination volumes. |
| *Broken* | When you resize the source volume and the Mirror state is *broken*, the destination volume is automatically resized with the [resync operation](cross-region-replication-manage-disaster-recovery.md#resync-replication).  |
| *Uninitialized* | When you resize the source volume and the Mirror state is still *uninitialized*, resizing the destination volume needs to be done manually. As such, it's recommended that you wait for the initialization to complete (that is, when the Mirror state becomes *mirrored*) to resize the source volume. | 

> [!IMPORTANT]
> Ensure that you have enough headroom in the capacity pools for both the source and the destination volumes of cross-region replication. When you resize the source volume, the destination volume is automatically resized. But if the capacity pool hosting the destination volume doesn’t have enough headroom, the resizing of both the source and the destination volumes will fail.

## Next steps

- [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
- [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md)
- [Dynamically change the service level of a volume](dynamic-change-volume-service-level.md) 