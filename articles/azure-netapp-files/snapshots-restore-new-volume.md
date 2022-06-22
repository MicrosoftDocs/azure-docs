---
title: Restore a snapshot to a new volume using Azure NetApp Files | Microsoft Docs
description: Describes how to create a new volume from a snapshot by using Azure NetApp Files.
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
ms.date: 01/31/2022
ms.author: anfdocs
---

# Restore a snapshot to a new volume using Azure NetApp Files

[Snapshots](snapshots-introduction.md) enable point-in-time recovery of volumes. Currently, you can restore a snapshot only to a new volume. 

## Steps

1. Select **Snapshots** from the Volume page to display the snapshot list. 
2. Right-click the snapshot to restore and select **Restore to new volume** from the menu option.  

    ![Screenshot that shows the Restore New Volume menu.](../media/azure-netapp-files/azure-netapp-files-snapshot-restore-to-new-volume.png)

3. In the Create a Volume window, provide information for the new volume:  
    * **Name**   
        Specify the name for the volume that you're creating.  
        
        The name must be unique within a resource group. It must be at least three characters long.  It can use any alphanumeric characters.

    * **Quota**  
        Specify the amount of logical storage that you want to allocate to the volume.  

    ![Screenshot that shows the Create a Volume window.](../media/azure-netapp-files/snapshot-restore-new-volume.png) 

4. Select **Review+create**. Select **Create**.   
    The new volume uses the same protocol that the snapshot uses.   
    The new volume to which the snapshot is restored appears in the Volumes page.   
    The snapshot used to create the new volume will also be present on the new volume. 

## Next steps

* [Learn more about snapshots](snapshots-introduction.md)
* [Monitor volume and snapshot metrics](azure-netapp-files-metrics.md#volumes)
* [Troubleshoot snapshot policies](troubleshoot-snapshot-policies.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Azure NetApp Files Snapshots 101 video](https://www.youtube.com/watch?v=uxbTXhtXCkw)
* [Azure NetApp Files Snapshot Overview](https://anfcommunity.com/2021/01/31/azure-netapp-files-snapshot-overview/)
