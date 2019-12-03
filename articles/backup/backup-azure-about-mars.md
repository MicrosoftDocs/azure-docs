---
title: About MARS Agent
description: Learn how the Mars Agent supports the backup scenarios
ms.reviewer: srinathv
ms.topic: conceptual
ms.date: 02/12/2019
---

# About Microsoft Azure Recovery Services (MARS) Agent

This article describes how the Azure Backup service uses Microsoft Azure Recovery Services (MARS) agent to backup and restore files/folders, volume or system state from on-premises machine to Azure.

MARS agent supports the following backup scenarios:

![recovery services vault dashboard](./media/backup-try-azure-backup-in-10-mins/backup-scenarios.png)

- _Files and folders_: Selectively protect windows files and folders.
- _Volume level_: Protect an entire windows volume of your machine.
- _System level_: Protect an entire windows system state.

MARS agent supports the following restore scenarios:

 ![recovery services vault dashboard](./media/backup-try-azure-backup-in-10-mins/restore-scenarios.png)

-	**Recovery destination**: This Server (server on which the backup was originally created),
    -    _Files and folders_: You can browse and choose individual files and folders that you would like to restore.
    -    _Volume level_: You can choose the volume and the recovery point that you want to restore and restore it to the same location or alternate location on the same machine.  You can either create a copy of existing files, overwrite existing files or skip recovering existing files.
    -    _System Level_: You can choose the system state and recovery point to restore to the same machine at a specified location.

- 	**Recovery destination**: Another Server (not the server where the backup was taken),
    -    _Files and folders_: You can browse and choose individual files and folders that you would like to restore the recovery point to a target machine.
    -    _Volume level_: You can choose the volume and the recovery point that you want to restore and restore it to an alternate location by either creating a copy of the existing files, overwrite existing files or skip recovering existing files.
    -    _System Level_: You can choose the system state and recovery point to restore as System State file to an alternate machine.

## Backup process

1.	From the portal, create a recovery service vault and choose Files and folders and/or System State from Backup goals.
2.	Download the recovery service vault credentials and agent installer to an on-premises machine. to protect on-premises machine by choosing the backup option choose files and folders and system state and download mars agent.
3.	Prepare the infrastructure:

    a.    Run the installer to install the agent.

    b.	Use downloaded vault credentials to register the machine to Recovery Services vault.
4.	From agent console on the client, use schedule backup to configure the backup to protect Files and folders and/or System State to Recovery Services vault. Specify the retention policy of your backup data.

![recovery services vault dashboard](./media/backup-try-azure-backup-in-10-mins/backup-process.png)

### Additional scenarios
-	**Backup specific files and folders within Azure VM**: The primary method for backing up Azure virtual machines (VMs) is by using an Azure Backup extension on the VM. This backs up the entire VM. If you want to backup specific files and folders within a VM then you can install MARS agent in Azure VMs. [Learn more](https://docs.microsoft.com/azure/backup/backup-architecture#architecture-built-in-azure-vm-backup).

-	**Offline Seeding**: Initial full backups of data to Azure typically transfer large amounts of data and require more network bandwidth when compared to subsequent backups that transfer only the delta/incremental. Azure Backup compresses the initial backups. Through the process of offline seeding, Azure Backup can use disks to upload the compressed initial backup data offline to Azure. [Learn more](https://docs.microsoft.com/azure/backup/backup-azure-backup-server-import-export-).


The primary method for backing up Azure virtual machines (VMs) is by using an Azure Backup extension on the VM. This backs up the entire VM. If you want to backup specific files and folders within a VM then you can install MARS agent in Azure VMs.
