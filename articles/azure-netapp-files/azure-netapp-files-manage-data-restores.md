---
title: Manage data restores on Azure NetApp Files volumes
description: Azure NetApp Files provides built-in data protection capabilities that help you recover business-critical file data quickly, consistently, and at the right recovery point. 
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 09/21/2026
ms.author: anfdocs

---

# Manage data restores on Azure NetApp Files volumes

Azure NetApp Files provides built-in data protection capabilities that help you recover business-critical file data quickly, consistently, and at the right recovery point. Snapshot technology creates point-in-time, read-only images of a volume that are space-efficient and near-instantaneous, making snapshots well suited for frequent operational recovery scenarios such as accidental file deletion, data corruption, or the need to validate an earlier application state. 

For fast recovery, you can restore individual files directly from the snapshot directory exposed to clients, create a new volume from a selected snapshot, or revert a volume to a previous point in time when appropriate. For longer-term retention and an additional recovery layer outside the active volume, Azure NetApp Files backup enables backup copies that can be restored from when data must be recovered beyond the local snapshot window or when a more durable recovery source is required.  

To select the most efficient restore workflow for your particular restore situation, use the following flow diagram:

:::image type="content" source="./media/manage-restores/manage-data-restores.png" alt-text="Screenshot that shows how to manage restore in different workflows." lightbox="./media/manage-restores/manage-data-restores.png":::

Reference documentation

1. [Restore a snapshot to a new volume using Azure NetApp Files](snapshots-restore-new-volume.md)
1. [Restore a backup to a new volume](backup-restore-new-volume.md)
1. [Restore a file from a snapshot using a client with Azure NetApp Files](snapshots-restore-file-client.md)
1. [Restore a file by using a Linux NFS client](snapshots-restore-file-client.md#restore-a-file-by-using-a-linux-nfs-client), [Restore a file by using a Windows client](snapshots-restore-file-client.md#restore-a-file-by-using-a-windows-client)
1. [Restore individual files using single-file snapshot restore](snapshots-restore-file-single.md)
1. [Restore individual files with single-file restore from backups in Azure NetApp Files](restore-single-file-backup.md)
1. [Restore a backup to a new volume](backup-restore-new-volume.md)