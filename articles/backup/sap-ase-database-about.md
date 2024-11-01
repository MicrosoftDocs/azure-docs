---
title: About the SAP ASE (Sybase) database backup on Azure VMs
description: In this article, you'll learn about backing up SAP ASE (Sybase) databases that are running on Azure virtual machines.
ms.topic: overview
ms.date: 11/12/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# About SAP ASE (Sybase) database backup on Azure VMs

SAP Adaptive Server Enterprise (ASE) (Sybase) databases are mission critical workloads that require a low recovery point objective (RPO) and a fast recovery time objective (RTO). You can now back up SAP ASE (Sybase) databases that are running on Azure virtual machines (VMs) by using [Azure Backup](./backup-overview.md).

This offering from Azure Backup aligns with the Azure Backup mantra of *zero-infrastructure backups*, which eliminate the need to deploy and manage the backup infrastructure. You can now seamlessly back up and restore SAP ASE (Sybase) databases that are running on Azure VMs and apply the enterprise management capabilities that Azure Backup provides.

## Added value

By using the Azure Backup service to back up and restore SAP ASE (Sybase) databases, you get the following advantages:

* **15-minute RPO**: As in the case of stream-based backup, log backups are streamed every 15 minutes and can be applied on top of DB backup which provides Point-In-Time recovery capability.
* **One-click, point-in-time restores**: Restoration of production data to alternative ASE servers is made easy. The chaining of the backups to perform restores are all managed by Azure behind the scenes.
* **Long-term retention**: For rigorous compliance and audit needs. Retain your backups for years, based on the retention duration, beyond which the recovery points will be pruned automatically by the built-in lifecycle management capability.
* **Backup management from Azure**: Use Azure Backup management and monitoring capabilities for improved management experience.
* **Compression**: Enable ASE Native compression via backup policy to save on backup storage costs.
* **Striping**: Enable Striping to increase the backup throughput between ASE VM and Recovery services vault via preregistration script.
* **Support for Cost-effective Backup policies** : Weekly full + daily differential backups result in lower storage costs (as opposed to daily streaming full backups) 
* **Recovery Services Vault**: All backups are streamed directly to the Azure Backup managed recovery services vault that provides security capabilities like Immutability, Soft Delete and Multiuser Auth. The vaulted backup data is stored in Microsoft-managed Azure subscription and is isolated from customer’s environment. These features ensure that the SAP ASE backup data is always secure and tamper-proof and can be recovered safely even when the source machines are compromised. 
* **Multiple Database Restore options**: Support of Alternate Location Restore (System refresh), Original Location Restore, and Restore as Files. 

To learn about the backup and restore scenarios that we support today, see the [SAP ASE scenario support matrix](./sap-ase-backup-support-matrix.md#scenario-support).

## Backup architecture

You can back up SAP ASE (Sybase) databases that are running inside an Azure VM and stream backup data directly to the Azure Recovery Services vault.

* You begin the backup process by creating a Recovery Services vault in Azure. This vault will be used to store the backups and recovery points that are created over time.
* The Azure VM that's running the SAP ASE server is registered with the vault, and the databases to be backed up are discovered. To enable the Azure Backup service to discover databases, a [preregistration script](https://go.microsoft.com/fwlink/?linkid=2173610) must be run on the ASE server as a root user.
* This script creates the *AZUREWLBACKUPASEUSER* database user or uses the custom Backup user you've already created. It then creates a corresponding key with the same name in *hdbuserstore*. To learn more about the functionality of the script, see Tutorial: Back up SAP ASE (Sybase) databases in an Azure VM.
* The Azure Backup service now installs the Azure Backup plugin for ASE on the registered SAP ASE server.
* The AZUREWLBACKUPASEUSER database user that was created by the preregistration script or the custom Backup user that you’ve created (and added as input to the preregistration script) is used by the Azure Backup plugin for ASE to perform all backup and restore operations. If you attempt to configure backup for SAP ASE (Sybase) databases without running this script, you might receive the UserErrorHanaScriptNotRun error.
* To configure a backup on the databases that you've discovered, choose the required backup policy, and then enable backups.

* After you've configured the backup, the Azure Backup service sets up the following Backint parameters at the database level on the protected SAP ASE server:
  * `[catalog_backup_using_backint:true]`
  * `[enable_accumulated_catalog_backup:false]`
  * `[parallel_data_backup_backint_channels:1]`
  * `[log_backup_timeout_s:900)]`
  * `[backint_response_timeout:7200]`

   > [!NOTE]
   > Ensure that these parameters are *not* present at the host level. Host-level parameters will override these parameters and might cause unexpected behavior.


* The Azure Backup plugin for ASE maintains all the backup schedules and policy details. It triggers the scheduled backups and communicates with the ASE backup engine through the Backint APIs.
* The ASE backup engine returns a Backint stream with the data to be backed up.
* All the scheduled backups and on-demand backups (triggered from the Azure portal) that are either full or differential are initiated by the Azure Backup plugin for ASE. However, log backups are managed and triggered by the ASE backup engine itself.
* Azure Backup for SAP ASE, because it's a Backint-certified solution, doesn't depend on underlying disk or VM types. The backup is performed by streams generated by ASE.

## Use Azure VM backup with Azure SAP ASE backup

In addition to using SAP ASE backup in Azure, which provides database-level backup and recovery, you can use the Azure VM backup solution to back up the operating system and nondatabase disks.

You can use the [Backint certified Azure SAP ASE backup solution](#backup-architecture) for database backup and recovery.

You can use [an Azure VM backup](backup-azure-vms-introduction.md) to back up the operating system and other nondatabase disks. The VM backup is run once a day, and it backs up all disks except the Write Accelerator operating system disks and ultra disks. Because you're backing up the database by using the Azure SAP ASE backup solution, you can take a file-consistent backup of only the operating system and nondatabase disks by using the [selective disk backup and restore for Azure VMs](selective-disk-backup-restore.md) feature.

1. Restore a VM that's running SAP ASE by doing one of the following:

   * [Restore a new VM from the Azure VM backup](backup-azure-arm-restore-vms.md) from the latest recovery point. 
   * Create a new empty VM and attach the disks from the latest recovery point.

2. If Write Accelerator disks are excluded, they aren’t restored. In this case, create empty Write Accelerator disks and a log area.

3. After all the other configurations (such as IP, system name, and so on) are set, the VM is set to receive database data from Azure Backup.

4. Restore the database into the VM from the Azure SAP ASE (Sybase) database backup to your intended point in time.

## Back up an ASE system with replication enabled

Azure Backup now supports backing up databases that have HSR enabled. This means that backups are managed automatically when a failover occurs, which eliminates the necessity for manual intervention. Backup also offers immediate protection with no remedial full backups, so you can protect ASE instances or HSR setup nodes as a single HSR container. 

Although there are multiple physical nodes (primary and secondary), the backup service now considers them a single HSR container.

## Back up database instance snapshots

As databases grow in size, the time it takes to restore them becomes a factor when you're dealing with streaming backups. Also, during backup, the time the database takes to generate Backint streams can grow in proportion to the churn, which can be factor as well.

A database-consistent, snapshot-based approach helps to solve both issues, and it gives you the benefit of instant backup and instant restore. For ASE, Azure Backup is now providing a ASE-consistent, snapshot-based approach that's integrated with Backint, so that you can use Azure Backup as a single product for your entire ASE landscape, irrespective of database size.

## Pricing: 

SAP ASE (Sybase) backup pricing has two components:

- **Protected Instance cost**: A flat rate per instance, irrespective of the ASE database size. This rate differs  between regions.

- **Backup Storage cost**: Cost based on the storage  space consumption for the backed-up data.

For example, if you're protecting 1.2 TB of ASE database in one instance running in the East US2 region, you are charged the Protection Instance cost as per the East US 2 region per month and cost for the storage consumed.

## Next steps

Learn how to:

- Back up SAP ASE (Sybase) databases on Azure VMs.
- Back up SAP ASE System Replication databases on Azure VMs.
- Back up SAP ASE (Sybase) database snapshot instances on Azure VMs.
- Restore SAP ASE (Sybase) databases on Azure VMs.
- Manage SAP ASE (Sybase) databases that are backed up by using Azure Backup.
