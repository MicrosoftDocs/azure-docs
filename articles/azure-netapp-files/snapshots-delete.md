---
title: Delete snapshots using Azure NetApp Files | Microsoft Docs
description: Describes how to delete snapshots by using Azure NetApp Files. 
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

# Delete snapshots using Azure NetApp Files 

You can delete snapshots that you no longer need to keep. 

> [!IMPORTANT]
> The snapshot deletion operation cannot be undone. A deleted snapshot cannot be recovered. 

## Considerations 

* You can't delete a snapshot if it is part of an active file-restore operation or if it is in the process of being cloned.
* You can't delete a replication generated snapshot that is used for volume baseline data replication.

## Steps

1. Go to the **Snapshots** menu of a volume. Right-click the snapshot you want to delete. Select **Delete**.

    ![Screenshot that describes the right-click menu of a snapshot](../media/azure-netapp-files/snapshot-right-click-menu.png) 

2. In the Delete Snapshot window, confirm that you want to delete the snapshot by clicking **Yes**. 

    ![Screenshot that confirms snapshot deletion](../media/azure-netapp-files/snapshot-confirm-delete.png)  

## Next steps

* [Learn more about snapshots](snapshots-introduction.md)
* [Azure NetApp Files Snapshot Overview](https://anfcommunity.com/2021/01/31/azure-netapp-files-snapshot-overview/)
