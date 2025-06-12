---
title: Delete an Azure NetApp Files volume
description: Describes how to delete an Azure NetApp Files volume.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 04/22/2025
ms.author: anfdocs
---
# Delete an Azure NetApp Files volume

This article describes how to delete an Azure NetApp Files volume.

> [!IMPORTANT] 
> If the volume you want to delete is in a replication relationship, follow the steps in [Delete source or destination volumes](cross-region-replication-delete.md#delete-source-or-destination-volumes). 

## Before you begin

* Stop any applications that may be using the volume. Unmount the volume from all hosts before deleting. 
* Remove the volume from automounter configurations such as `fstab`.

## Delete a volume

1. From the Azure portal and under storage service, select **Volumes**.  Locate the volume you want to delete.   
2. Right click the volume name and select **Delete**.   

    ![Screenshot that shows right-click menu for deleting a volume.](./media/volume-delete/volume-delete.png)

## Next steps  

* [Delete volume replications or volumes](cross-region-replication-delete.md)
* [Troubleshoot volume errors for Azure NetApp Files](troubleshoot-volumes.md)
