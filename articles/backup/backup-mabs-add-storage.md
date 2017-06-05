---
title: Use Modern Backup Storage with Azure Backup Server v.2 | Microsoft Docs
description: Learn about the new features when you upgrade to Azure Backup Server v.2. This article provides instruction on upgrading your Azure Backup Server installation.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''

ms.assetid:
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/15/2017
ms.author: masaran;markgal
---

# Add Storage to Azure Backup Server v.2

Azure Backup Server v.2 comes with Modern Backup Storage which delivers 50% storage savings, 3x faster backups, and more efficient storage with Workload-Aware storage. To use Modern Backup Storage, set up Azure Backup Server v.2 on Windows Server 2016.

If you run Azure Backup Server v.2 on an older version of Windows Server, Azure Backup Server can't take advantage of Modern Backup Storage and protects workloads as it did in v.1. More information on preparing storage to back up the legacy way can be found here.

Azure Backup Server v.2 accepts storage volumes. When you add a volume, Azure Backup Server formats the volume to ReFS, which Modern Backup Storage requires. To add a volume, and to expand it later if needed, here is the suggested workflow:

1.	Set up Azure Backup Server v.2 on a VM.
2.	Create a volume on a virtual disk in a storage pool:

    a.	Add a disk to a storage pool and create a virtual disk with Simple Layout.

    b.	Add any additional disks, and extend the virtual disk.

    c.	Create Volumes on the virtual disk.

3.	Add the volumes to Azure Backup Server.
4.	Configure Workload-Aware Storage.

## Create a volume for Azure Backup Server v.2 Modern Backup Storage

Using Azure Backup Server v.2 with volumes as disk storage, helps maintain control over the storage. A volume can be a single disk. However, if you want to extend storage in the future, create a volume out of a disk created using storage spaces. This helps if you want to expand the volume for backup storage. This section provides best practice for creating a volume with this configuration.

First step is to create a Virtual Disk.  Through the File and Storage Services section of the Server Manager, create a Storage Pool, and add the available disks to it. Create a Virtual Disk from that Storage Pool with Simple Layout.

Step 1: Add the disks to a Storage Pool and create a virtual disk with Simple Layout

![Review Disk Storage Allocation](./media/backup-mabs-add-storage/mabs-add-storage-1.png)

Create a virtual disk out of this Storage Pool and select the layout to be Simple

![Review Disk Storage Allocation](./media/backup-mabs-add-storage/mabs-add-storage-2.png)

Step 2: Now add as many disks as needed and extend the virtual disk, with Simple layout.

![Review Disk Storage Allocation](./media/backup-mabs-add-storage/mabs-add-storage-3.png)

Extend the Virtual Disk to reflect the added disks.

![Review Disk Storage Allocation](./media/backup-mabs-add-storage/mabs-add-storage-4.png)

Step 3: Create Volumes on the Storage Pool

After creating the Virtual Disk with sufficient storage, create volumes on the Virtual Disk.
![Review Disk Storage Allocation](./media/backup-mabs-add-storage/mabs-add-storage-5.png)

![Review Disk Storage Allocation](./media/backup-mabs-add-storage/mabs-add-storage-6.png)

## Adding volumes to Azure Backup Server Disk Storage

To add a volume to Azure Backup Server, in the Management pane, Rescan the Storage and Click on Add. This will give a list of all the volumes available to be added for Azure Backup Server Storage. After they are added to the list of selected volumes, they can also be given a Friendly name for easy recall. Clicking on OK will format these volumes to ReFS to enable Azure Backup Server to use the benefits of Modern Backup Storage.

![Review Disk Storage Allocation](./media/backup-mabs-add-storage/mabs-add-storage-7.png)

## Configure Workload-Aware Storage

With Workload Aware Storage, the volumes can be selected to preferentially store certain kinds of workloads. For example, expensive volumes that support high IOPS can be configured to store only the workloads that require frequent, high-volume backups like SQL with Transaction Logs. Other workloads that are backed up less frequently, say VMs, can be backed up to other low-cost volumes.

This can be done through PowerShell commandlet, Update-DPMDiskStorage, which updates the properties of a volume in the storage pool on a DPM server.

**Update-DPMDiskStorage**

**Syntax**

`Parameter Set: Volume`

```
Update-DPMDiskStorage [-Volume] <Volume> [[-FriendlyName] <String> ] [[-DatasourceType] <VolumeTag[]> ] [-Confirm] [-WhatIf] [ <CommonParameters>]
```

![Review Disk Storage Allocation](./media/backup-mabs-add-storage/mabs-add-storage-8.png)

The changes made through PowerShell are reflected in the UI.

![Review Disk Storage Allocation](./media/backup-mabs-add-storage/mabs-add-storage-9.png)
