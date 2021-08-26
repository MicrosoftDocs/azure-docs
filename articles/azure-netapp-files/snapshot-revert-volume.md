---
title: Revert a volume using snapshot revert | Microsoft Docs
description: Describes how to revert a volume to an earlier state using Azure NetApp Files. 
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
ms.date: 08/12/2021
ms.author: b-juche
---

# Revert a volume using snapshot revert

The snapshot revert functionality enables you to quickly revert a volume to the state it was in when a particular snapshot was taken. In most cases, reverting a volume is much faster than restoring individual files from a snapshot to the active file system. It is also more space efficient compared to restoring a snapshot to a new volume. 

You can find the Revert Volume option in the Snapshots menu of a volume. After you select a snapshot for reversion, Azure NetApp Files reverts the volume to the data and timestamps that it contained when the selected snapshot was taken. 

> [!IMPORTANT]
> Active filesystem data and snapshots that were taken after the selected snapshot was taken will be lost. The snapshot revert operation will replace *all* the data in the targeted volume with the data in the selected snapshot. You should pay attention to the snapshot contents and creation date when you select a snapshot. You cannot undo the snapshot revert operation.

1. Go to the **Snapshots** menu of a volume.  Right-click the snapshot you want to use for the revert operation. Select **Revert volume**. 

    ![Screenshot that describes the right-click menu of a snapshot](../media/azure-netapp-files/snapshot-right-click-menu.png) 

2. In the Revert Volume to Snapshot window, 
type the name of the volume, and click **Revert**.   

    The volume is now restored to the point in time of the selected snapshot.

    ![Screenshot that the Revert volume to snapshot window](../media/azure-netapp-files/snapshot-revert-volume.png) 