---
title: Manage snapshots by using Azure NetApp Files | Microsoft Docs
description: Describes how to create, manage, and use snapshots by using Azure NetApp Files. 
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
# Manage snapshots by using Azure NetApp Files

Azure NetApp Files supports creating on-demand [snapshots](snapshots-introduction.md) and using snapshot policies to schedule automatic snapshot creation. You can also restore a [snapshot to a new volume](snapshot-restore-to-new-volume.md), [restore a single file by using a client](snapshot-restore-file-with-client.md), or [revert an existing volume by using a snapshot](snapshot-revert-volume.md).

> [!NOTE] 
> For considerations about snapshot management in cross-region replication, see [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md).

## Create an on-demand snapshot for a volume

You can create volume snapshots on demand. 

1.	Go to the volume that you want to create a snapshot for. Click **Snapshots**.

    ![Navigate to snapshots](../media/azure-netapp-files/azure-netapp-files-navigate-to-snapshots.png)

2.  Click **+ Add snapshot** to create an on-demand snapshot for a volume.

    ![Add snapshot](../media/azure-netapp-files/azure-netapp-files-add-snapshot.png)

3.	In the New Snapshot window, provide a name for the new snapshot that you are creating.   

    ![New snapshot](../media/azure-netapp-files/azure-netapp-files-new-snapshot.png)

4. Click **OK**. 

## Next steps

* [Learn more about snapshots](snapshots-introduction.md)
* [Manage snapshot policies with Azure NetApp Files](snapshot-manage-policy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Azure NetApp Files Snapshots 101 video](https://www.youtube.com/watch?v=uxbTXhtXCkw&feature=youtu.be)
* [What is Azure Application Consistent Snapshot Tool](azacsnap-introduction.md)
