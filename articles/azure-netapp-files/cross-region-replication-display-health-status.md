---
title: Display health status of Azure NetApp Files replication relationship | Microsoft Docs
description: Describes how to view replication status on the source volume or the destination volume of Azure NetApp Files.
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
# Display health status of replication relationship 

You can view replication status on the source volume or the destination volume.  

## Display replication status

1. From either the source volume or the destination volume, click **Replication** under Storage Service for either volume.

    The following replication status and health information is displayed:  
    * **End point type** – Identifies whether the volume is the source or destination of replication.
    * **Health** – Displays the health status of the replication relationship.
    * **Mirror state** – Shows one of the following values:
        * *Uninitialized*:  
            This is the initial and default state when a peering relationship is created. The state remains uninitialized until the initialization completes successfully.
        * *Mirrored*:   
            The destination volume has been initialized and is ready to receive mirroring updates.
        * *Broken*:   
            This is the state after you break the peering relationship. The destination volume is `‘RW’` and snapshots are present.
    * **Relationship status** – Shows one of the following values: 
        * *Idle*:  
            No transfer operation is in progress and future transfers are not disabled.
        * *Transferring*:  
            A transfer operation is in progress and future transfers are not disabled.
    * **Replication schedule** – Shows how frequently incremental mirroring updates will be performed when the initialization (baseline copy) is complete.

    * **Total progress** -- Shows the total amount of data in bytes transferred for the current transfer operation. This amount is the actual bits transferred, and it might differ from the logical space that the source and destination volumes report.  

    ![Replication health status](../media/azure-netapp-files/cross-region-replication-health-status.png)

> [!NOTE] 
> Replication relationship shows health status as *unhealthy* if previous replication jobs are not complete. This status is a result of large volumes being transferred with a lower transfer window (for example, a ten-minute transfer time for a large volume). In this case, the relationship status shows *transferring* and health status shows *unhealthy*.

## Next steps  

* [Cross-region replication](cross-region-replication-introduction.md)
* [Manage disaster recovery](cross-region-replication-manage-disaster-recovery.md)
* [Volume replication metrics](azure-netapp-files-metrics.md#replication)
* [Troubleshoot cross-region replication](troubleshoot-cross-region-replication.md)

