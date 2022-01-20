---
title: Edit the Hide Snapshot Path option of Azure NetApp Files | Microsoft Docs
description: Describes how to control the visibility of a snapshot volume with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 09/16/2021
ms.author: anfdocs
---

# Edit the Hide Snapshot Path option of Azure NetApp Files
The Hide Snapshot Path option controls whether the snapshot path of a volume is visible. During the creation of an [NFS](azure-netapp-files-create-volumes.md#create-an-nfs-volume) or [SMB](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume) volume, you have the option to specify whether the snapshot path should be hidden. You can subsequently edit the Hide Snapshot Path option as needed.  

> [!NOTE]
> For a [destination volume](cross-region-replication-create-peering.md#create-the-data-replication-volume-the-destination-volume) in cross-region replication, the Hide Snapshot Path option is enabled by default, and the setting cannot be modified. 

## Steps

1. To view the Hide Snapshot Path option setting of a volume, select the volume. The **Hide snapshot path** field shows whether the option is enabled.   
    ![Screenshot that describes the Hide Snapshot Path field.](../media/azure-netapp-files/hide-snapshot-path-field.png) 
2. To edit the Hide Snapshot Path option, click **Edit** on the volume page and modify the **Hide snapshot path** option as needed.   
    ![Screenshot that describes the Edit volume snapshot option.](../media/azure-netapp-files/volume-edit-snapshot-options.png) 

## Next steps

* [Learn more about snapshots](snapshots-introduction.md)