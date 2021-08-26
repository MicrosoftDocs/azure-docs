---
title: Delete snapshots
description: Describes how to delete snapshots by using Azure NetApp Files. 
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

# Delete snapshots  

You can delete snapshots that you no longer need to keep. 

> [!IMPORTANT]
> The snapshot deletion operation cannot be undone. A deleted snapshot cannot be recovered. 

1. Go to the **Snapshots** menu of a volume. Right-click the snapshot you want to delete. Select **Delete**.

    ![Screenshot that describes the right-click menu of a snapshot](../media/azure-netapp-files/snapshot-right-click-menu.png) 

2. In the Delete Snapshot window, confirm that you want to delete the snapshot by clicking **Yes**. 

    ![Screenshot that confirms snapshot deletion](../media/azure-netapp-files/snapshot-confirm-delete.png)  