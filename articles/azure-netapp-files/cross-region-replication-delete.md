---
title: Delete volume replications or volumes for Azure NetApp Files cross-region replication | Microsoft Docs
description: Describes how to delete a replication connection that is no longer needed between the source and the destination volumes. 
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
ms.date: 11/18/2020
ms.author: b-juche
---
# Delete volume replications or volumes

This article describes how to delete volume replications. It also describes how to delete the source or destination volume.

## Delete volume replications

You can terminate the replication connection between the source and the destination volumes by deleting volume replication. You must delete the replication from the destination volume. The delete operation removes only authorization for replication; it does not remove the source or the destination volume. 

1. Ensure that the replication peering has been broken before you delete volume replication.    
    See [Display health status of replication relationship](cross-region-replication-display-health-status.md) and [Break replication peering](cross-region-replication-manage-disaster-recovery.md#break-replication-peering).  

1. To delete volume replication, select **Replication** from the source or the destination volume.  

2. Click **Delete**.    

3. Confirm deletion by typing **Yes** and clicking **Delete**.   

    ![Delete replication](../media/azure-netapp-files/cross-region-replication-delete-replication.png)

## Delete source or destination volumes

If you want to delete the source or destination volume, you must perform the following steps in the described order. Otherwise, the `Volume with replication cannot be deleted` error occurs.  

1. From the destination volume, [break the replication peering](cross-region-replication-manage-disaster-recovery.md#break-replication-peering) and then [delete the volume replication](#delete-volume-replications).   

2. Delete the destination or source volume as needed by right-clicking the volume name and select **Delete**.   

    ![Screenshot that shows right-click menu of a volume.](../media/azure-netapp-files/cross-region-replication-delete-volume.png)

## Next steps  

* [Cross-region replication](cross-region-replication-introduction.md)
* [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Troubleshoot cross-region-replication](troubleshoot-cross-region-replication.md)

