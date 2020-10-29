---
title: Delete replications for Azure NetApp Files cross-region replication | Microsoft Docs
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
ms.date: 09/16/2020
ms.author: b-juche
---
# Delete replications

You can terminate the replication connection between the source and the destination volumes by deleting volume replication. You can perform the delete operation from either the source or the destination volume. The delete operation removes only authorization for replication; it does not remove the source or the destination volume. 

## Steps

1. To delete volume replication, select **Replication** from the source or the destination volume.  

2. Click **Delete**.    

3. Confirm deletion by typing **Yes** and clicking **Delete**.   

    ![Delete replication](../media/azure-netapp-files/cross-region-replication-delete-replication.png)

## Next steps  

* [Cross-region replication](cross-region-replication-introduction.md)
* [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Troubleshoot cross-region-replication](troubleshoot-cross-region-replication.md)

