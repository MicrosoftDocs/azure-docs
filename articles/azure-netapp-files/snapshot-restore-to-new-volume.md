---
title: Restore a snapshot to a new volume using Azure NetApp Files | Microsoft Docs
description: Describes how to create a new volume from a snapshot by using Azure NetApp Files. 
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

# Restore a snapshot to a new volume

Currently, you can restore a snapshot only to a new volume. 
1. Select **Snapshots** from the Volume blade to display the snapshot list. 
2. Right-click the snapshot to restore and select **Restore to new volume** from the menu option.  

    ![Restore snapshot to new volume](../media/azure-netapp-files/azure-netapp-files-snapshot-restore-to-new-volume.png)

3. In the Create a Volume window, provide information for the new volume:  
    * **Name**   
        Specify the name for the volume that you are creating.  
        
        The name must be unique within a resource group. It must be at least three characters long.  It can use any alphanumeric characters.

    * **Quota**  
        Specify the amount of logical storage that you want to allocate to the volume.  

    ![Restore to new volume](../media/azure-netapp-files/snapshot-restore-new-volume.png) 

4. Click **Review+create**.  Click **Create**.   
    The new volume uses the same protocol that the snapshot uses.   
    The new volume to which the snapshot is restored appears in the Volumes blade.
