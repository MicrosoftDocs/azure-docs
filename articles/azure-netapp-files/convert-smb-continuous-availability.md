---
title: Convert existing Azure NetApp Files SMB volumes to use SMB Continuous Availability | Microsoft Docs
description: Describes enable SMB CA by converting an existing Azure NetApp Files SMB volume.  
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
ms.date: 05/10/2021
ms.author: b-juche
---
# Convert existing SMB volumes to use Continuous Availability 

You can enable the SMB Continuous Availability (CA) feature when you [create a new SMB volume](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume). You can also convert an existing SMB volume to enable the SMB CA feature.  This article shows you how to enable SMB CA by converting an existing volume.  

> [!IMPORTANT]
> This procedure includes a cut-over from the original volume to the new volume enabled for CA shares. As such, you should plan for a maintenance window for this process. 

## Steps

1. Make sure that you have [registered the SMB Continuous Availability Shares](https://aka.ms/anfsmbcasharespreviewsignup) feature.  
2. Stop the application that is using the SMB volume. 
3. [Create an on-demand snapshot](azure-netapp-files-manage-snapshots.md#create-an-on-demand-snapshot-for-a-volume) of the existing volume. 
4. Select **Snapshots** from the existing volume to display the snapshot list.
5. Right-click the snapshot to restore, and select **Restore to new volume** from the menu option.
    
    ![Snapshot that shows the Restore to New Volume option.](../media/azure-netapp-files/azure-netapp-files-snapshot-restore-to-new-volume.png)

6. In the Create a Volume window that appears, provide information for the new volume:  

    * **Volume name**    
    Specify the name for the volume that you are creating.   
    The name must be unique within a resource group. It must be at least three characters long. It can use any alphanumeric characters.

    * **Quota**   
    Specify the amount of logical storage that you want to allocate to the volume.

    ![Snapshot that shows the Create a Volume window.](../media/azure-netapp-files/snapshot-restore-new-volume.png) 

7. Under the Protocol section of the Create a Volume window, make sure that you select the **Enable Continuous Availability** option.

    ![Snapshot that shows the Enable Continuous Availability option.](../media/azure-netapp-files/enable-continuous-availability-option.png) 

8. Click **Review + create**. Click **Create**.   
    The new volume uses the same protocol that the snapshot uses.
    The new volume to which the snapshot is restored appears in the Volumes view.

9. After the new volume is created, click **Mount instructions** from the selected volume blade. And then follow the instructions to mount the new volume.    

10.	Reconfigure your application to make use of the new volume mount point.   

11.	Restart the application that you stopped during Step 2. 

12.	After the application begins to leverage the new volume, and when the process of restoring to the new volume is complete, you can optionally delete the original volume.  

## Next steps  

* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md)
* [Mount or unmount a volume for Windows or Linux virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)