---
title: Backup guide for SAP HANA on Azure Virtual Machines | Microsoft Docs
description: SAP HANA Azure backup guide provides three major backup possibilities for SAP HANA on Azure
services: virtual-machines-linux
documentationcenter: 
author: v-derekg
manager: timlt
editor:
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ums.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 3/13/2017
ms.author: rclaus

---

# Backup guide for SAP HANA on Azure Virtual Machines

## Contents

- Overview
- General items regarding HANA backup
  - SAP HANA backup documentation
  - Why SAP HANA backup?
  - How to verify correctness of SAP HANA backup
  - Pros and Cons of HANA backup versus storage snapshot
  - SAP HANA data consistency when taking storage snapshots
  - SAP HANA backup scheduling strategy
  - SAP HANA configuration files
  - SAP HANA Cockpit
  - SAP HANA backup encryption
- SAP HANA backup based on storage snapshots
  - Introduction
  - SAP HANA snapshots
  - HANA VM backup via Azure Backup service
  - HANA VM backup automation via Azure Backup service
  - HANA license key and VM restore via Azure Backup service
  - SAP HANA backup via manual disk snapshot
- SAP HANA backup into the file system
  - Introduction
  - Azure backup agent
  - Azure blobxfer utility details
  - SAP HANA backup performance
  - Copy SAP HANA backup files to Azure blob storage
  - Blob copy of dedicated Azure data disks in a backup software raid
  - Copy SAP HANA backup files to NFS share
  - Copy SAP HANA backup files to Azure file service
- Test setup
  - Test Virtual Machine on Azure
  - Test backup size
  - Test tool to copy files directly to Azure storage
  - Test backup size estimation
  - Test HANA backup file size
- Summary

## Overview

The backup guide for SAP HANA running on Azure Virtual Machines will only describe Azure-specific topics. For general SAP HANA backup related items, check the SAP HANA documentation. See _SAP HANA backup documentation_ later in this document.

The focus of this document is on two major backup possibilities for SAP HANA on Azure virtual machines:

- HANA backup to the file system in an Azure Linux Virtual Machine
- HANA backup based on storage snapshots using the Azure storage blob snapshot feature manually or Azure Backup Service

SAP HANA offers a backup API, which allows third-party backup tools to integrate directly with SAP HANA. (That is not within the scope of this guide.) There is no direct integration of SAP HANA with Azure Backup service available right now based on this API.

SAP HANA is officially supported on Azure VM type GS5 as single instance with an additional restriction to OLAP workloads (see [Find Certified IaaS Platforms](https://global.sap.com/community/ebook/2014-09-02-hana-hardware/enEN/iaas.html) on the SAP website). This document will be updated as new offerings for SAP HANA on Azure become available.

There is also an SAP HANA hybrid solution available on Azure, where SAP HANA runs non-virtualized on physical servers. However, this SAP HANA Azure backup guide covers a pure Azure environment where SAP HANA runs in an Azure VM, not SAP HANA running on &quot;large instances.&quot; See [SAP HANA (large instances) overview and architecture on Azure](./sap-hana-overview-architecture.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more information about this backup solution on &quot;large instances&quot; based on storage snapshots.

General information about SAP products supported on Azure can be found in [SAP Note 1928533](https://launchpad.support.sap.com/#/notes/1928533).

The following three figures give an overview of the SAP HANA backup options using native Azure capabilities currently, and also show three potential future backup scenarios. The following sections of this guide describe these options in more detail, and also discuss size and performance considerations regarding SAP HANA backups, which are multi-terabytes in size.

![This figure shows two possibilities for saving the current VM state](./media/sap-hana-backup-guide/image001.png)

This figure shows the possibility of saving the current VM state, either via Azure Backup service or manual snapshot of VM disks. With this approach, one doesn&#39;t have to manage SAP HANA backups. The challenge of the disk snapshot scenario is file system consistency, and an application-consistent disk state. The consistency topic is discussed in the section _SAP HANA data consistency when taking storage snapshots_ later in this document. Capabilities and restrictions of Azure Backup service related to SAP HANA backups are discussed later in this document.

![This figure shows options for taking an SAP HANA file backup inside the VM](./media/sap-hana-backup-guide/image002.png)

This figure shows options for taking an SAP HANA file backup inside the VM, and then storing it HANA backup files somewhere else using different tools. Taking a HANA backup requires more time than a snapshot-based backup solution, but it has advantages regarding integrity and consistency. More details are provided later in this document.

![This figure shows a potential future SAP HANA backup scenario](./media/sap-hana-backup-guide/image003.png)

This figure shows a potential future SAP HANA backup scenario. If SAP HANA allowed taking backups from a replication secondary, it would add additional options for backup strategies. Currently it isn't possible according to a post in the SAP HANA Wiki:

&quot;Is it possible to take backups on the secondary side?

No, currently you can only take data and log backups on the primary side. If automatic log backup
is enabled, after takeover to the secondary side, the log backups will automatically be written there.&quot;

## General items regarding HANA backup

### SAP HANA backup documentation

- [Introduction to SAP HANA Administration](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.00/en-US)
- [Planning Your Backup and Recovery Strategy](https://help.sap.com/saphelp_hanaplatform/helpdata/en/ef/085cd5949c40b788bba8fd3c65743e/content.htm)
- [Schedule HANA Backup using ABAP DBACOCKPIT](http://www.hanatutorials.com/p/schedule-hana-backup-using-abap.html)
- [Schedule Data Backups (SAP HANA Cockpit)](http://help.sap.com/saphelp_hanaplatform/helpdata/en/6d/385fa14ef64a6bab2c97a3d3e40292/frameset.htm)
- FAQ about SAP HANA backup in [SAP Note 1642148](https://launchpad.support.sap.com/#/notes/1642148)
- FAQ about SAP HANA database and storage snapshots in [SAP Note 2039883](https://launchpad.support.sap.com/#/notes/2039883)
- Unsuitable network file systems for backup and recovery in [SAP Note 1820529](https://launchpad.support.sap.com/#/notes/1820529)


### Why SAP HANA backup?

Azure storage offers availability and reliability out of the box (see [Introduction to Microsoft Azure Storage](../../storage/storage-introduction.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more information about Azure storage).

The minimum for &quot;backup&quot; is to rely on the Azure SLAs, keeping the SAP HANA data and log files on Azure VHDs attached to the SAP HANA server VM. This approach covers VM failures, but not potential damage to the SAP HANA data and log files, or logical errors like deleting data or files by accident. Backups are also required for compliance or legal reasons. In short, there is always a need for SAP HANA backups.

### How to verify correctness of SAP HANA backup

When using storage snapshots, running a test restore on a different system is recommended. This approach provides a way to ensure that a backup is correct, and internal processes for backup and restore work as expected. While this is a significant hurdle on-premises, it is much easier to accomplish in the cloud by providing necessary resources temporarily for this purpose.

Keep in mind that doing a simple restore and checking if HANA is up and running is not sufficient. Ideally, one should run a table consistency check to be sure that the restored database is fine. SAP HANA offers several kinds of consistency checks described in [SAP Note 1977584](https://launchpad.support.sap.com/#/notes/1977584).

Information about the table consistency check can also be found on the SAP website at [Table and Catalog Consistency Checks](http://help.sap.com/saphelp_hanaplatform/helpdata/en/25/84ec2e324d44529edc8221956359ea/content.htm#loio9357bf52c7324bee9567dca417ad9f8b).

For standard file backups, a test restore is not necessary. There are two SAP HANA tools that help to check which backup can be used for restore: hdbbackupdiag and hdbbackupcheck. See [Manually Checking Whether a Recovery is Possible](https://help.sap.com/saphelp_hanaplatform/helpdata/en/77/522ef1e3cb4d799bab33e0aeb9c93b/content.htm) for more information about these tools.

### Pros and Cons of HANA backup versus storage snapshot

SAP doesn&#39;t give preference to either HANA backup versus storage snapshot. It lists their pros and cons, so one can determine which to use depending on the situation and available storage technology (see [Planning Your Backup and Recovery Strategy](https://help.sap.com/saphelp_hanaplatform/helpdata/en/ef/085cd5949c40b788bba8fd3c65743e/content.htm)).

On Azure, be aware of the fact that the Azure blob snapshot feature doesn&#39;t guarantee file system consistency (see [Using blob snapshots with PowerShell](https://blogs.msdn.microsoft.com/cie/2016/05/17/using-blob-snapshots-with-powershell/)). The next section, _SAP HANA data consistency when taking storage snapshots_, discusses some considerations regarding this feature.

In addition, one has to understand the billing implications when working frequently with blob snapshots as described in this article: [Understanding How Snapshots Accrue Charges](/rest/api/storageservices/fileservices/understanding-how-snapshots-accrue-charges)—it isn&#39;t as obvious as using Azure virtual disks.

### SAP HANA data consistency when taking storage snapshots

File system and application consistency is a complex issue when taking storage snapshots. The easiest way to avoid problems would be to shut down SAP HANA, or maybe even the whole virtual machine. A shut down might be doable with a demo or prototype, or even a development system, but it is not an option for a production system.

On Azure, one has to keep in mind that the Azure blob snapshot feature doesn&#39;t guarantee file system consistency. It works fine however by using the SAP HANA snapshot feature, as long as there is only a single virtual disk involved. But even with a single disk, additional items have to be checked. [SAP Note 2039883](https://launchpad.support.sap.com/#/notes/2039883) has important information about SAP HANA backups via storage snapshots. For example, it mentions that, with the XFS file system, it is necessary to run **xfs\_freeze** before starting a storage snapshot to guarantee consistency (see [xfs\_freeze(8) - Linux man page](https://linux.die.net/man/8/xfs_freeze) for details on **xfs\_freeze**).

The topic of consistency becomes even more challenging in a case where a single file system spans multiple disks/volumes. For example, by using mdadm or LVM and striping. The SAP Note mentioned above states:
_&quot;But keep in mind that the storage system has to guarantee I/O consistency while creating a storage snapshot per SAP HANA data volume, i.e. snapshotting of an SAP HANA service-specific data volume must be an atomic operation.&quot;_

Assuming there is an XFS file system spanning four Azure virtual disks, the following steps will provide a consistent snapshot that represents the HANA data area:

- HANA snapshot prepare
- Freeze the file system (for example, use **xfs\_freeze**)
- Create all necessary blob snapshots on Azure
- Unfreeze the file system
- Confirm the HANA snapshot

Recommendation is to use the procedure above in all cases to be on the safe side, no matter which file system. Or if it is a single disk or striping, via mdadm or LVM across multiple disks.

It is important to confirm the HANA snapshot. Due to the &quot;Copy-on-Write,&quot; SAP HANA might not require additional disk space while in this snapshot-prepare mode. It&#39;s also not possible to start new backups as long as the SAP HANA snapshot isn&#39;t confirmed.

Azure Backup service uses Azure VM extensions to take care of the file system consistency. These VM extensions are not available for standalone usage. One still has to manage SAP HANA consistency. See the sections covering Azure Backup service later in this document.

### SAP HANA backup scheduling strategy

The SAP HANA article [Planning Your Backup and Recovery Strategy](https://help.sap.com/saphelp_hanaplatform/helpdata/en/ef/085cd5949c40b788bba8fd3c65743e/content.htm) states a basic plan to do backups:

- Storage snapshot (daily)
- Complete data backup using file or backing (once a week)
- Automatic log backups

To go completely without storage snapshots this part could be replaced by HANA delta backups, like incremental, or differential backups (see [Delta Backups](https://help.sap.com/saphelp_hanaplatform/helpdata/en/c3/bb7e33bb571014a03eeabba4e37541/content.htm)).

The HANA Administration guide provides an example list. It suggests that one recover SAP HANA to a specific point in time using the following sequence of backups:

1. Full data backup
2. Differential backup
3. Incremental backup 1
4. Incremental backup 2
5. Log backups

Regarding an exact schedule as to when and how often a specific backup type should happen, it is not possible to give a general guideline—it is too customer-specific, and depends on how many data changes occur in the system. One basic recommendation from SAP side, which can be seen as general guidance, is to make one full HANA backup once a week.

Regarding log backups, see the SAP HANA documentation [Log Backups](https://help.sap.com/saphelp_hanaplatform/helpdata/en/c3/bb7e33bb571014a03eeabba4e37541/content.htm).

SAP also recommends doing some housekeeping of the backup catalog to keep it from growing infinitely (see [Housekeeping for Backup Catalog and Backup Storage](http://help.sap.com/saphelp_hanaplatform/helpdata/en/ca/c903c28b0e4301b39814ef41dbf568/content.htm)).

### SAP HANA configuration files

As stated in the FAQ in [SAP Note 1642148](https://launchpad.support.sap.com/#/notes/1642148), the SAP HANA configuration files are not part of a standard HANA backup. They are not essential to restore a system. The HANA configuration could be changed manually after the restore. In case one would like to get the same custom configuration during the restore process, it is necessary to back up the HANA configuration files separately.

If standard HANA backups are going to a dedicated HANA backup file system, one could also copy the configuration files to the same backup filesystem, and then copy everything together to the final storage destination like cool blob storage.

### SAP HANA Cockpit

SAP HANA Cockpit offers the possibility of monitoring and managing SAP HANA via a browser. It also allows handling of SAP HANA backups, and therefore can be used as an alternative to SAP HANA Studio and ABAP DBACOCKPIT (see [SAP HANA Cockpit](https://help.sap.com/saphelp_hanaplatform/helpdata/en/73/c37822444344f3973e0e976b77958e/content.htm) for more information).

![This figure shows the SAP HANA Cockpit Database Administration Screen](./media/sap-hana-backup-guide/image004.png)

This figure shows the SAP HANA Cockpit Database Administration Screen, as well as the backup tile on the left. Seeing the backup tile requires appropriate user permissions for login account.

![Backups can be monitored in SAP HANA Cockpit while they are ongoing](./media/sap-hana-backup-guide/image005.png)

Backups can be monitored in SAP HANA Cockpit while they are ongoing and, once it is finished, all the backup details are available.

![An example using Firefox on an Azure SLES 12 VM with Gnome deskto](./media/sap-hana-backup-guide/image006.png)

The previous screenshots were made from an Azure Windows VM. This one is an example using Firefox on an Azure SLES 12 VM with Gnome desktop. It shows the option to define SAP HANA backup schedules in SAP HANA Cockpit. As one can also see, it suggests date/time as a prefix for the backup files. In SAP HANA Studio the default prefix is &quot;COMPLETE\_DATA\_BACKUP&quot; when doing a full file backup. Using a unique prefix is recommended.

### SAP HANA backup encryption

SAP HANA offers encryption of data and log. If SAP HANA data and log are not encrypted, then the backups are also not encrypted. It is up to the customer to use some form of third-party solution to encrypt the SAP HANA backups. See [Data and Log Volume Encryption](https://help.sap.com/saphelp_hanaplatform/helpdata/en/dc/01f36fbb5710148b668201a6e95cf2/content.htm) to find out more about SAP HANA encryption.

On Microsoft Azure, a customer could use the IaaS VM encryption feature to encrypt. For example, one could use dedicated data disks attached to the VM, which are used to store SAP HANA backups, then make copies of these disks.

Azure Backup service can handle encrypted VMs/disks (see [How to back up and restore encrypted virtual machines with Azure Backup](../../backup/backup-azure-vms-encryption.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)).

Another option would be to maintain the SAP HANA VM and its disks without encryption, and store the SAP HANA backup files in a storage account for which encryption was enabled (see [Azure Storage Service Encryption for Data at Rest](../../storage/storage-service-encryption.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)).


## SAP HANA backup based on storage snapshots

### Introduction

There is a general challenge when using a VM backup feature—for something like a single-instance all-in-one demo system, it could make sense to think about a VM backup instead of managing HANA backups on OS level. An alternative is to take Azure blob snapshots to create copies of individual virtual disks, which are attached to a virtual machine, and keep the HANA data files. But a critical point is app consistency when creating a VM backup or disk snapshot while the system is up and running. See _SAP HANA data consistency when taking storage snapshots_ earlier in this document. SAP HANA has a feature that supports these kinds of storage snapshots.

### SAP HANA snapshots

There is a feature in SAP HANA which supports taking a storage snapshot. However, as of December 2016, there is a restriction to single-container systems. Multitenant container configurations do not support this kind of database snapshot (see [Create a Storage Snapshot (SAP HANA Studio)](https://help.sap.com/saphelp_hanaplatform/helpdata/en/a0/3f8f08501e44d89115db3c5aa08e3f/content.htm)).

It works in the following way:

- Prepare for a storage snapshot by initiating the SAP HANA snapshot
- Run the storage snapshot (Azure blob snapshot, for example)
- Confirm the SAP HANA snapshot

![This screenshot shows that an SAP HANA data snapshot can be created via a SQL statement](./media/sap-hana-backup-guide/image011.png)

This screenshot shows that an SAP HANA data snapshot can be created via a SQL statement.

![The snapshot then also appears in the backup catalog in SAP HANA Studio](./media/sap-hana-backup-guide/image012.png)

The snapshot then also appears in the backup catalog in SAP HANA Studio.

![On disk the snapshot shows up in the SAP HANA data directory](./media/sap-hana-backup-guide/image013.png)

On disk the snapshot shows up in the SAP HANA data directory.

One has to ensure that the file system consistency is also guaranteed before running the storage snapshot while SAP HANA is in the snapshot preparation mode. See _SAP HANA data consistency when taking storage snapshots_ earlier in this document.

Once the storage snapshot is done, it is critical to confirm the SAP HANA snapshot. There is a corresponding SQL statement which has to be run: BACKUP DATA CLOSE SNAPSHOT (see [BACKUP DATA CLOSE SNAPSHOT Statement (Backup and Recovery)](https://help.sap.com/saphelp_hanaplatform/helpdata/en/c3/9739966f7f4bd5818769ad4ce6a7f8/content.htm)).

It is very important to confirm the HANA snapshot. Due to the &quot;Copy-on-Write,&quot; SAP HANA might not only require additional disk space while in this snapshot-prepare mode, but it&#39;s also not possible to start new backups as long as the SAP HANA snapshot isn&#39;t confirmed.

### HANA VM backup via Azure Backup service

As of December 2016, the backup agent of the Azure Backup service is not available for Linux VMs. This means that to make use of Azure backup on the file/directory level, one would have to copy SAP HANA backup files to a Windows VM first and then use the backup agent from there. Otherwise, only a full Linux VM backup is possible via the Azure Backup service. See [Overview of the features in Azure Backup](../../backup/backup-introduction-to-azure-backup.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) to find out more.

The Azure Backup service offers an option to back up and restore a VM. More information about this service and how it works can be found in the article [Plan your VM backup infrastructure in Azure](../../backup/backup-azure-vms-introduction.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

The following two quotes from the article above provide important considerations:

&quot;For Linux virtual machines, only file-consistent backups are possible, since Linux does not have an equivalent platform to VSS.&quot;

&quot;Applications need to implement their own &quot;fix-up&quot; mechanism on the restored data.&quot;

This implies that one has to make sure SAP HANA is in a consistent state on disk when the backup starts. See _SAP HANA snapshots_ described earlier in the document. But there is a potential issue when SAP HANA stays in this snapshot preparation mode. See [Create a Storage Snapshot (SAP HANA Studio)](https://help.sap.com/saphelp_hanaplatform/helpdata/en/a0/3f8f08501e44d89115db3c5aa08e3f/content.htm) for more information.

The article states:

&quot;It is strongly recommended to confirm or abandon a storage snapshot as soon as possible after it has been created. While the storage snapshot is being prepared or created, the snapshot-relevant data is frozen. While the snapshot-relevant data remains frozen, changes can still be made in the database. Such changes will not cause the frozen snapshot-relevant data to be changed. Instead, the changes are written to positions in the data area that are separate from the storage snapshot. Changes are also written to the log. However, the longer the snapshot-relevant data is kept frozen, the more the data volume can grow.&quot;

Azure Backup takes care of the file system consistency via Azure VM extensions. These extensions are not available standalone, and work only in combination with Azure Backup service. Nevertheless, it is still a requirement to manage an SAP HANA snapshot in order to guarantee app consistency.

Azure Backup has two major phases:

- Take Snapshot
- Transfer data to vault

So one could confirm the SAP HANA snapshot once the Azure Backup service phase of taking a snapshot is completed. In one test scenario, it took several minutes before this could be seen in the Azure portal.

![This figure shows part of the backup job list of an Azure Backup service](./media/sap-hana-backup-guide/image014.png)

This figure shows part of the backup job list of an Azure Backup service, which was used to back up the HANA test VM.

![A click on the backup job in the Azure portal shows the job details](./media/sap-hana-backup-guide/image015.png)

A click on the backup job in the Azure portal shows the job details. Here, one can see the two phases. It might take a few minutes until it shows the snapshot phase as completed. The majority of the time is spent in the data transfer phase.

### HANA VM backup automation via Azure Backup service

One could confirm the SAP HANA snapshot once the Azure Backup snapshot phase is completed, as described earlier. It is helpful to consider automation, because an admin might not check this by looking at the backup job list in the Azure portal.

Here is an explanation how it could be accomplished via Azure PowerShell cmdlets.

![An Azure Backup service was created with the name hana-backup-vault](./media/sap-hana-backup-guide/image016.png)

An Azure Backup service was created with the name &quot;hana-backup-vault&quot;. The PS command
**Get-AzureRmRecoveryServicesVault -Name hana-backup-vault** retrieves the corresponding object. This object is then used to set the backup context as seen on the next figure.

![One can check for the backup job which is currently in progress](./media/sap-hana-backup-guide/image017.png)

After setting the correct context, one can check for the backup job which is currently in progress, and then look for its job details. The subtask list shows if the snapshot phase of the Azure backup job is already completed:
```
$ars = Get-AzureRmRecoveryServicesVault -Name hana-backup-vault
Set-AzureRmRecoveryServicesVaultContext -Vault $ars
$jid = Get-AzureRmRecoveryServicesBackupJob -Status InProgress | select -ExpandProperty jobid
Get-AzureRmRecoveryServicesBackupJobDetails -Jobid $jid | select -ExpandProperty subtasks
```
![One would have to poll the value in a loop until it turns to Completed](./media/sap-hana-backup-guide/image018.png)

Once the job details are stored in a variable, it is simply PS syntax to get to the first array entry and retrieve the status value. To complete the automation script, one would have to poll the value in a loop until it turns to &quot;Completed.&quot;
```
$st = Get-AzureRmRecoveryServicesBackupJobDetails -Jobid $jid | select -ExpandProperty subtasks
$st[0] | select -ExpandProperty status
```
### HANA license key and VM restore via Azure Backup service

Another topic related to SAP HANA licensing, the Azure Backup service, is designed to create a new VM during restore. There is no concept right now to do an &quot;in-place&quot; restore of an existing Azure VM.

![This figure shows the restore option of the Azure service in the Azure portal](./media/sap-hana-backup-guide/image019.png)

This figure shows the restore option of the Azure service in the Azure portal. One can choose between creating a VM during restore or restoring the disks. When restoring the disks, it is still necessary afterwards to create a new VM on top of it. Whenever a new VM gets created on Azure the unique VM ID changes (see [Accessing and Using Azure VM Unique ID](https://azure.microsoft.com/blog/accessing-and-using-azure-vm-unique-id/)).

![This figure shows the Azure VM unique ID before and after the restore via Azure Backup service](./media/sap-hana-backup-guide/image020.png)

This figure shows the Azure VM unique ID before and after the restore via Azure Backup service. The SAP hardware key, which is used for SAP licensing, is using this unique VM ID. As a consequence, a new SAP license has to be installed after a VM restore.

During the creation of this backup guide, a new Azure Backup feature was presented in preview mode. Because there was no time to test it out, this SAP HANA Backup Guide will be updated when this feature is GA. It will allow a file level restore based on the VM snapshot that was taken for the VM backup. This avoids the need to deploy a new VM, and therefore the unique VM ID stays the same and no new SAP HANA license key is required.

Azure backup will eventually allow for backup of individual Azure virtual disks, plus files and directories from inside the VM. A major advantage of Azure Backup is the management of all the backups. Otherwise the customer must manage the list of backups, and pick the right ones if a restore becomes necessary.

### SAP HANA VM backup via manual disk snapshot

Instead of using the Azure Backup service, one could configure an individual backup solution by creating blob snapshots of Azure VHDs manually via PowerShell. See [Using blob snapshots with PowerShell](https://blogs.msdn.microsoft.com/cie/2016/05/17/using-blob-snapshots-with-powershell/) for a description of the steps.

It provides more flexibility but does not resolve the issues explained earlier in this document:

- One still has to make sure that SAP HANA is in a consistent state
- The OS disk cannot be overwritten even if the VM is deallocated. There will be an error that a lease exists. It only would work after deleting the VM. Which would lead again to a new unique VM ID and the necessity to install a new SAP license.

![This figure shows the possibility of restoring just the data disks of an Azure VM](./media/sap-hana-backup-guide/image021.png)

This figure shows the possibility of restoring just the data disks of an Azure VM, which would avoid the problem with getting a new unique VM ID, and therefore the SAP license wouldn&#39;t get invalidated:

- For the test, two Azure data disks were attached to a VM and a software raid was defined on top of them
- It was confirmed that SAP HANA was in a consistent state by SAP HANA snapshot feature
- File system freeze (see _SAP HANA data consistency when taking storage snapshots_ earlier in this document)
- Blob snapshots were taken from both data disks
- File system unfreeze
- SAP HANA snapshot confirmation
- To restore the data disks, the VM was shut down and both disks detached
- After detaching the disks, they were overwritten with the former blob snapshots
- Then the restored virtual disks were attached again to the VM
- After starting the VM, everything on the software raid worked fine and was set back to the blob snapshot time
- HANA was set back to the HANA snapshot


The procedure would look less complex if it was possible to shut down SAP HANA before the blob snapshots. In that case, one could skip the HANA snapshot and, if nothing else is going on in the system, also skip the file system freeze. Added complexity comes into the picture when it is necessary to do snapshots while everything is online. See _SAP HANA data consistency when taking storage snapshots_ earlier in this document.

## SAP HANA Azure Backup on file level

### Introduction

Looking at the Azure VM sizes, one can see that a GS5 allows 64 attached data disks. For big SAP HANA systems, a significant portion of the number of disks might already be taken for SAP HANA data and log files, possibly in combination with software raid for optimal disk IO throughput. The question then is where to store SAP HANA backup files, which could fill up the attached data disks over time? See [Sizes for Linux virtual machines in Azure](../virtual-machines-linux-sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for the Azure VM size tables.

As there is no SAP HANA backup integration available with Azure Backup service at this point in time, the standard way to manage backup/restore at the file level would be a file-based backup via SAP HANA Studio or via SAP HANA SQL statements (see [SAP HANA SQL and System Views Reference](https://help.sap.com/hana/SAP_HANA_SQL_and_System_Views_Reference_en.pdf)).

![This figure shows the dialog of the backup menu item in SAP HANA Studio](./media/sap-hana-backup-guide/image022.png)

This figure shows the dialog of the backup menu item in SAP HANA Studio. When choosing type &quot;file&quot; one has to specify a path in the file system where SAP HANA will write the backup files. Restore works the same way.

While this sounds pretty simple and straight forward, there are some considerations. As mentioned before, an Azure VM has a limitation of number of data disks which can be attached. Depending on the size of the SAP HANA database and disk throughput requirements, which might involve a software raid using striping across multiple data disks, the capacity for keeping SAP HANA backup files on the file systems of the VM might not be big enough. Different options for moving these backup files, and managing file size restrictions and performance when handling terabytes of data are provided later in this document.

Another option, which offers more freedom regarding total capacity, is Azure blob storage. While a single blob is also restricted to 1 TB the total capacity of a single blob container is currently 500 TB. Additionally, it gives customers the choice to select so-called &quot;cool&quot; blob storage, which has a cost benefit. See [Azure Blob Storage: Hot and cool storage tiers](../../storage/storage-blob-storage-tiers.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for details about cool blob storage.

Another aspect for additional safety, is to use a geo-replicated storage account to store the SAP HANA backups. See [Azure Storage replication](../../storage/storage-redundancy.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for details about storage account replication.

One could simply place dedicated VHDs for SAP HANA backups in a dedicated backup storage account which is geo-replicated. Or else one could copy the VHDs which keep the SAP HANA backups in a geo-replicated storage account or a storage account, which is located in a different region.

### Azure backup agent

Azure backup offers the option to not only back up complete VMs, but also files and directories via the backup agent, which has to be installed on the guest OS. But as of December 2016, this agent is only supported on Windows (see [Back up a Windows Server or client to Azure using the Resource Manager deployment model](../../backup/backup-configure-vault.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)).

A workaround could be to first copy SAP HANA backup files to a Windows VM on Azure (for example, via SAMBA share) and then use the Azure backup agent from there. While it is technically possible, it would add complexity and slow down the end-to-end backup or restore process quite a bit due to the copy between the Linux and the Windows VM.

### Azure blobxfer utility details

To store directories and files on Azure storage, one could use CLI or PowerShell, or develop a tool using one of the [Azure SDKs](https://azure.microsoft.com/downloads/). There is also a ready-to-use utility, AzCopy, for copying data to Azure storage, but it is Windows only (see [Transfer data with the AzCopy Command-Line Utility](../../storage/storage-use-azcopy.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)).

Therefore blobxfer was used for copying SAP HANA backup files. It is open source, used by many customers in production environments, and available on [GitHub](https://github.com/Azure/blobxfer). This tool allows one to copy data either directly to Azure blob storage or Azure file share, and offers a range of very useful features like md5 hash or automatic parallelism when copying a directory with multiple files.

### SAP HANA backup performance

![This is a screenshot from the SAP HANA backup console in SAP HANA Studio](./media/sap-hana-backup-guide/image023.png)

This is a screenshot from the SAP HANA backup console in SAP HANA Studio. It took about 42 minutes to do the backup of the 230 GB on a single Azure standard storage disk attached to the HANA VM using XFS file system.

![This is a screenshot of YaST on the SAP HANA test VM](./media/sap-hana-backup-guide/image024.png)

This is a screenshot of YaST on the SAP HANA test VM. One can see the 1 TB single disk for SAP HANA backup as mentioned before. It took about 42 minutes to backup 230 GB. In addition, five 200 GB disks were attached and a software raid md0 created, with striping on top of these five Azure data disks.

![Repeating exactly the same backup on a software raid with striping across five attached Azure standard storage data disks](./media/sap-hana-backup-guide/image025.png)

Repeating exactly the same backup on a software raid with striping across five attached Azure standard storage data disks brought the backup time from 42 minutes down to 10 minutes. The disks were attached without caching to the VM. So it is obvious how important disk write throughput is for the backup time. One could then switch to Azure premium storage to further accelerate the process for optimal performance. In general, Azure premium storage should be used for production systems.

### Copy SAP HANA backup files to Azure blob storage

As of December 2016, the best option to quickly store SAP HANA backup files is Azure blob storage. One single blob container has a limit of 500 TB, which should be enough for most SAP HANA systems running in a GS5 VM on Azure, to keep enough SAP HANA backups. Customers have the choice between &quot;hot&quot; and &quot;cold&quot; blob storage (see [Azure Blob Storage: Hot and cool storage tiers](../../storage/storage-blob-storage-tiers.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)).

With the blobxfer tool it is easy to copy the SAP HANA backup files directly to Azure blob storage.

![Here one can see the files of a full SAP HANA file backup](./media/sap-hana-backup-guide/image026.png)

Here one can see the files of a full SAP HANA file backup. There are four files and the biggest one has roughly 230 GB.

![It took roughly 3000 seconds to copy the 230 GB to an Azure standard storage account blob container](./media/sap-hana-backup-guide/image027.png)

With an initial test not using md5 hash, it took roughly 3000 seconds to copy the 230 GB to an Azure standard storage account blob container.

![In this screenshot one can see how it looks on the Azure portal](./media/sap-hana-backup-guide/image028.png)

In this screenshot one can see how it looks on the Azure portal. A blob container named &quot;sap-hana-backups&quot; was created and includes the four blobs, which represent the SAP HANA backup files. One of them has a size of roughly 230 GB.

The HANA Studio backup console allows one to restrict the max file size of HANA backup files. In the sample environment, this makes it possible to finally get multiple smaller backup files, instead of one large 230 GB backup file. This has a beneficial impact on performance.

![Setting the backup file size limit on the HANA side doesn&#39;t improve the backup time](./media/sap-hana-backup-guide/image029.png)

Setting the backup file size limit on the HANA side doesn&#39;t improve the backup time, because the files are written sequentially and that can be seen in this figure. The file size limit was set to 60 GB and, therefore, the backup created four large data files instead of the 230 GB single file.

![To test parallelism of the blobxfer tool, the max file size for HANA backups was then set to 15 GB](./media/sap-hana-backup-guide/image030.png)

To test parallelism of the blobxfer tool, the max file size for HANA backups was then set to 15 GB, which resulted in 19 backup files. This brought the time for blobxfer to copy the 230 GB to Azure blob storage from 3000 seconds down to 875 seconds.

This is mainly due to the limit of 60 MB/sec for writing an Azure blob. Parallelism via multiple blobs solves this bottleneck, but there is, of course, a downside of this. Increasing performance of the blobxfer tool to copy all these HANA backup files to Azure blob storage puts load on the HANA VM, and especially the network. This could then have an impact on the running HANA system.

### Blob copy of dedicated Azure data disks in a backup software raid

This is a different approach than the manual VM data disk backup. This approach is not about the backup of all data disks which belong to a VM, in order to save the whole SAP installation, including HANA data and HANA log files as well as config files, instead, the idea is to have a dedicated software raid with striping across multiple Azure data VHDs for storing a full SAP HANA file backup. Then, one would copy only these disks, which have the SAP HANA backup. They could easily be kept in a dedicated HANA backup storage account, or attached to a dedicated &quot;backup management VM&quot; for further processing.

![All VHDs involved were copied using the **start-azurestorageblobcopy** PowerShell command](./media/sap-hana-backup-guide/image031.png)

After the backup to the local software raid was completed, all VHDs involved were copied using the **start-azurestorageblobcopy** PowerShell command (see [Start-AzureStorageBlobCopy](/powershell/storage/azure.storage/v2.1.0/start-azurestorageblobcopy)). As it only affects the dedicated file system for keeping the backup files, there are no concerns about SAP HANA data or log file consistency on the disk. A benefit of this command is that it works while the VM stays online, but to be 100% sure that no process will write something on the backup stripe set, be sure to unmount it before the blob copy, and mount it again afterwards. Or one could use an appropriate way to &quot;freeze&quot; the file system. For example, via xfs\_freeze for the XFS file system.

![Here one can see part of the list of all blobs in the vhds container on the Azure portal](./media/sap-hana-backup-guide/image032.png)

Here one can see part of the list of all blobs in the &quot;vhds&quot; container on the Azure portal. The screenshot shows the five VHDs, which were attached to the SAP HANA server VM to serve as the software raid to keep SAP HANA backup files. It also shows the five copies which were taken via the blob copy command.

![For testing purposes the copies of the SAP HANA backup software raid disks were attached to the app server VM](./media/sap-hana-backup-guide/image033.png)

For testing purposes the copies of the SAP HANA backup software raid disks were attached to the app server VM.

![The app server VM was shut down to attach the disk copies](./media/sap-hana-backup-guide/image034.png)

The app server VM was shut down to attach the disk copies. After starting the VM, the disks and the raid were discovered correctly (mounted via UUID). Only the mount point was missing, which was created via the YaST partitioner. Afterwards the SAP HANA backup file copies became visible on OS level.

### Copy SAP HANA backup files to NFS share

Thinking about the potential impact on the SAP HANA system from a performance or disk space perspective, one might consider storing the SAP HANA backup files on an NFS share. Technically, it will work, but it means using a second Azure VM as the host of the NFS share. And it shouldn&#39;t be a very small VM size, due to the VM network bandwidth which is dependent on the VM size. It would make sense then to shut this &quot;backup VM&quot; down and just bring it up for executing the SAP HANA backup. Writing on an NFS share puts load on the network, so one should be aware that it impacts the SAP HANA system. On the other hand, merely managing the backup files afterwards on the &quot;backup VM&quot; would not influence the SAP HANA system at all.

![An NFS share from another Azure VM was mounted to the SAP HANA server VM](./media/sap-hana-backup-guide/image035.png)

To verify the NFS use case, an NFS share from another Azure VM was mounted to the SAP HANA server VM. There was no special NFS tuning applied.

![It took 1 hour and 46 minutes to do the backup directly](./media/sap-hana-backup-guide/image036.png)

The NFS share was a fast stripe set, like the one on the SAP HANA server. Nevertheless, it took 1 hour and 46 minutes to do the backup directly on the NFS share instead of 10 minutes, when writing to a local stripe set.

![The alternative wasn&#39;t much quicker at 1 hour and 43 minutes](./media/sap-hana-backup-guide/image037.png)

The alternative of first doing a backup to a local stripe set and then to do a copy to the NFS share on OS level via a simple **cp -avr** command wasn&#39;t much quicker at 1 hour and 43 minutes.

So it works, but performance wasn&#39;t very good for the 230 GB backup test. It would look even worse for multi terabytes.

### Copy SAP HANA backup files to Azure file service

It is possible to mount an Azure file share inside an Azure Linux VM. The article [How to use Azure File Storage with Linux](../../storage/storage-how-to-use-files-linux.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) provides details on how to do it. One has to keep in mind, though, that there is currently a 5 TB quota limit of one Azure file share, and a file size limit of 1 TB per file. See [Azure Storage Scalability and Performance Targets](../../storage/storage-scalability-targets.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for information on storage limits.

Tests have shown, however, that SAP HANA backup doesn&#39;t currently work directly with this kind of CIFS mount. It is also stated in [SAP Note 1820529](https://launchpad.support.sap.com/#/notes/1820529) that CIFS is not recommended.

![This figure shows an error in the backup dialog in SAP HANA Studio](./media/sap-hana-backup-guide/image038.png)

This figure shows an error in the backup dialog in SAP HANA Studio, when trying to back up directly to a CIFS-mounted Azure file share. So one has to do a standard SAP HANA backup into a VM file system first, and then copy the backup files from there to Azure file service.

![This figure shows that it took about 929 seconds to copy 19 SAP HANA backup files](./media/sap-hana-backup-guide/image039.png)

This figure shows that it took about 929 seconds to copy 19 SAP HANA backup files with a total size of roughly 230 GB to the Azure file share.

![The source directory structure on the SAP HANA VM was copied to the Azure file share](./media/sap-hana-backup-guide/image040.png)

In this screenshot, one can see that the source directory structure on the SAP HANA VM was copied to the Azure file share: one directory (hana\_backup\_fsl\_15gb) and 19 individual backup files.

Storing SAP HANA backup files on Azure files could become an interesting option in the future, if and when SAP HANA file backups support it directly, or it becomes possible to mount Azure files via NFS and the maximum quota limit becomes considerably higher than 5 TB.


## Test setup

### Test Virtual Machine on Azure

A SAP HANA installation in an Azure GS5 VM was used for the following backup/restore tests.

![This figure shows part of the Azure portal overview for the HANA test VM](./media/sap-hana-backup-guide/image007.png)

This figure shows part of the Azure portal overview for the HANA test VM.

### Test backup size

![This figure was taken from the backup console in HANA Studio and shows the backup file size of 229 GB for the HANA index server](./media/sap-hana-backup-guide/image008.png)

A dummy table was filled up with data to get a total data backup size of over 200 GB in order to derive realistic performance data. The figure was taken from the backup console in HANA Studio and shows the backup file size of 229 GB for the HANA index server. For the tests, the default backup prefix &quot;COMPLETE\_DATA\_BACKUP&quot; in SAP HANA Studio was used. In real production systems, a more useful prefix should be defined. SAP HANA Cockpit suggests date/time.

### Test tool to copy files directly to Azure storage

To transfer SAP HANA backup files directly to Azure blob storage, or Azure file shares, the blobxfer tool was used because it supports both targets and it can be easily integrated into automation scripts due to its command-line interface. The blobxfer tool is available on [GitHub](https://github.com/Azure/blobxfer).

### Test backup size estimation

It can be important to estimate the backup size of SAP HANA. For example, this helps to define the max backup file size in order to achieve a certain number of backup files for better performance due to parallelism during a file copy. (Those details are explained later in this document.) Another aspect is the decision as to whether a full backup would be preferable compared to a delta backup
(incremental or differential).

Fortunately, there is a simple SQL statement which returns how large the backup files will become: **select \* from M\_BACKUP\_SIZE\_ESTIMATIONS** (see [Estimate the Space Needed in the File System for a Data Backup](https://help.sap.com/saphelp_hanaplatform/helpdata/en/7d/46337b7a9c4c708d965b65bc0f343c/content.htm)).

![The output of this SQL statement matches almost exactly the real size of the full data backup on disk](./media/sap-hana-backup-guide/image009.png)

For the test system, the output of this SQL statement matches almost exactly the real size of the full data backup on disk.

### Test HANA backup file size

![The HANA Studio backup console allows one to restrict the max file size of HANA backup files](./media/sap-hana-backup-guide/image010.png)

The HANA Studio backup console allows one to restrict the max file size of HANA backup files. In the sample environment this gives the possibility of finally getting multiple smaller backup files instead of one large 230 GB backup file. This has a significant impact on performance, as is demonstrated later in this document.


## Summary

Based on the test results the following tables will show pros and cons of solutions to backup a SAP HANA database running on Azure virtual machines.


|Backup SAP HANA to the file system and copy backup files afterwards to the final backup destination|
|---------------------------------------------------------------------------------------------------|

|Solution                                           |Pros                                 |Cons                                  |
|---------------------------------------------------|-------------------------------------|--------------------------------------|
|Keep HANA backups on VM disks                      |no additional management efforts     |eats up local VM disk space           |
|Blobxfer tool to copy backup files to blob storage |parallelism to copy multiple files, choice to use cool blob storage | additional tool maintenance and custom |                                   


|Backup SAP HANA based on storage snapshots|
|------------------------------------------|

|Solution                                           |Pros                                 |Cons                                  |
|---------------------------------------------------|-------------------------------------|--------------------------------------|
|Azure Backup Service| allows VM backup based on blob snapshots | when not using file level restore it requires the creation of a new VM for the restore process which then implies the need of a new SAP HANA license key|
|Manual blob snapshots| flexibility to create and restore specific VM disks without changing the unique VM ID|all manual work which has to be done by the customer|



