---
title: About the MARS Agent
description: Learn how the MARS Agent supports the backup scenarios
ms.reviewer: srinathv
ms.topic: conceptual
ms.date: 12/02/2019
---

# About the Microsoft Azure Recovery Services (MARS) Agent

This article describes how the Azure Backup service uses the Microsoft Azure Recovery Services (MARS) agent to backup and restore files/folders, volume or system state from on-premises computer to Azure.

The MARS agent supports the following backup scenarios:

![recovery services vault dashboard](./media/backup-try-azure-backup-in-10-mins/backup-scenarios.png)

- **Files and Folders**: selectively protect Windows files and folders.
- **Volume Level**: protect an entire Windows volume of your machine.
- **System Level**: protect an entire Windows system state.

The MARS agent supports the following restore scenarios:

![recovery services vault dashboard](./media/backup-try-azure-backup-in-10-mins/restore-scenarios.png)

-	**Same Server**: Same server on which the backup was originally created.
    -    **Files and Folders**: You can browse and choose individual files and folders that you would like to restore.
    -    **Volume Level**: You can choose the volume and the recovery point that you want to restore and restore it to the same location or alternate location on the same machine.  You can either create a copy of existing files, overwrite existing files or skip recovering existing files.
    -    **System Level**: You can choose the system state and recovery point to restore to the same machine at a specified location.


- 	**Alternate Server**: Another server, i.e. not the same server where the backup was taken.
    -    **Files and Folders**: You can browse and choose individual files and folders that you would like to restore the recovery point to a target machine.
    -    **Volume Level**: You can choose the volume and the recovery point that you want to restore to an alternate location by either creating a copy of the existing files, overwrite existing files or skip recovering existing files.
    -    **System Level**: You can choose the system state and recovery point to restore as System State file to an alternate machine.

## Backup process

1.	From the Azure portal, create a [Recovery Service vault](https://docs.microsoft.com/azure/backup/backup-configure-vault#create-a-recovery-services-vault) and choose files and folders and/or system state from Backup goals.
2.	[Download](https://docs.microsoft.com/azure/backup/backup-configure-vault#download-the-mars-agent) the Recovery Service vault credentials and agent installer to an on-premises machine. To protect on-premises machine by choosing the backup option choose files and folders and system state and download the MARS agent.
3.	Prepare the infrastructure:

    a.    Run the installer to [install](https://docs.microsoft.com/azure/backup/backup-configure-vault#install-and-register-the-agent) the agent.

    b.	Use downloaded vault credentials to register the machine to Recovery Services vault.
4.	From agent console on the client, use [schedule backup](https://docs.microsoft.com/azure/backup/backup-configure-vault#create-a-backup-policy) to configure the backup. Specify the retention policy of your backup data and start protecting.

![recovery services vault dashboard](./media/backup-try-azure-backup-in-10-mins/backup-process.png)


### Additional scenarios
-	**Backup specific files and folders within Azure VM** - The primary method for backing up Azure virtual machines (VMs) is by using an Azure Backup extension on the VM. This backs up the entire VM. If you want to backup specific files and folders within a VM then you can install the MARS agent in Azure VMs. [Learn more](https://docs.microsoft.com/azure/backup/backup-architecture#architecture-built-in-azure-vm-backup).

-	**Offline Seeding** - Initial full backups of data to Azure, typically transfer large amounts of data and requires more network bandwidth when compared to subsequent backups that transfer only the delta/incremental. Azure Backup compresses the initial backups. Through the process of offline seeding, Azure Backup can use disks to upload the compressed initial backup data offline to Azure. [Learn more](https://docs.microsoft.com/azure/backup/backup-azure-backup-server-import-export-).


## Next steps
[The MARS agent support matrix](https://docs.microsoft.com/azure/backup/backup-support-matrix-mars-agent)

[FAQ-The MARS agent](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq)
