---
title: About the SAP HANA database backup on Azure VMs
description: In this article, you'll learn about backing up SAP HANA databases that are running on Azure virtual machines.
ms.topic: conceptual
ms.date: 11/02/2023
ms.service: backup
ms.custom: ignite-2022
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# About SAP HANA database backup on Azure VMs

SAP HANA databases are mission critical workloads that require a low recovery point objective (RPO) and a fast recovery time objective (RTO). You can now [back up SAP HANA databases that are running on Azure virtual machines (VMs)](./tutorial-backup-sap-hana-db.md) by using [Azure Backup](./backup-overview.md).

Azure Backup is [Backint certified](https://www.sap.com/dmc/exp/2013_09_adpd/enEN/#/solutions?id=s:e062231e-9fb7-4ea8-b7d2-e6fe448c592d) by SAP, to provide native backup support by taking advantage of the SAP HANA native APIs. This offering from Azure Backup aligns with the Azure Backup mantra of *zero-infrastructure backups*, which eliminate the need to deploy and manage the backup infrastructure. You can now seamlessly back up and restore SAP HANA databases that are running on Azure VMs ([M series VMs](../virtual-machines/m-series.md) are also supported now!) and apply the enterprise management capabilities that Azure Backup provides.

## Added value

By using the Azure Backup service to back up and restore SAP HANA databases, you get the following advantages:

* **15-minute RPO**: Recovery of critical data of up to 15 minutes is now possible.
* **One-click, point-in-time restores**: Restoration of production data to alternative HANA servers is made easy. The chaining of the backups and catalogs to perform restores are all managed by Azure behind the scenes.
* **Long-term retention**: For rigorous compliance and audit needs. Retain your backups for years, based on the retention duration, beyond which the recovery points will be pruned automatically by the built-in lifecycle management capability.
* **Backup management from Azure**: Use Azure Backup management and monitoring capabilities for improved management experience. The Azure CLI is also supported.
* **Backup of SAP HANA databases with HANA System Replication (HSR)**: Facilitates a single backup chain across nodes and provides an effortless restore experience.

To learn about the backup and restore scenarios that we support today, see the [SAP HANA scenario support matrix](./sap-hana-backup-support-matrix.md#scenario-support).

## Backup architecture

You can back up SAP HANA databases that are running inside an Azure VM and stream backup data directly to the Azure Recovery Services vault.

![Diagram of the SAP HANA Backup architecture.](./media/sap-hana-db-about/backup-architecture.png)

* You begin the backup process by [creating a Recovery Services vault](./tutorial-backup-sap-hana-db.md#create-a-recovery-services-vault) in Azure. This vault will be used to store the backups and recovery points that are created over time.
* The Azure VM that's running the SAP HANA server is registered with the vault, and the databases to be backed up are [discovered](./tutorial-backup-sap-hana-db.md#discover-the-databases). To enable the Azure Backup service to discover databases, a [preregistration script](https://go.microsoft.com/fwlink/?linkid=2173610) must be run on the HANA server as a root user.
* This script creates the *AZUREWLBACKUPHANAUSER* database user or uses the custom Backup user you've already created. It then creates a corresponding key with the same name in *hdbuserstore*. To learn more about the functionality of the script, see [Tutorial: Back up SAP HANA databases in an Azure VM](./tutorial-backup-sap-hana-db.md#what-the-pre-registration-script-does).
* The Azure Backup service now installs the Azure Backup plugin for HANA on the registered SAP HANA server.
* The AZUREWLBACKUPHANAUSER database user that was created by the preregistration script or the custom Backup user that you’ve created (and added as input to the preregistration script) is used by the Azure Backup plugin for HANA to perform all backup and restore operations. If you attempt to configure backup for SAP HANA databases without running this script, you might receive the UserErrorHanaScriptNotRun error.
* To [configure a backup](./tutorial-backup-sap-hana-db.md#configure-backup) on the databases that you've discovered, choose the required backup policy, and then enable backups.

* After you've configured the backup, the Azure Backup service sets up the following Backint parameters at the database level on the protected SAP HANA server:
  * `[catalog_backup_using_backint:true]`
  * `[enable_accumulated_catalog_backup:false]`
  * `[parallel_data_backup_backint_channels:1]`
  * `[log_backup_timeout_s:900)]`
  * `[backint_response_timeout:7200]`

   > [!NOTE]
   > Ensure that these parameters are *not* present at the host level. Host-level parameters will override these parameters and might cause unexpected behavior.
   >

* The Azure Backup plugin for HANA maintains all the backup schedules and policy details. It triggers the scheduled backups and communicates with the HANA backup engine through the Backint APIs.
* The HANA backup engine returns a Backint stream with the data to be backed up.
* All the scheduled backups and on-demand backups (triggered from the Azure portal) that are either full or differential are initiated by the Azure Backup plugin for HANA. However, log backups are managed and triggered by the HANA backup engine itself.
* Azure Backup for SAP HANA, because it's a Backint-certified solution, doesn't depend on underlying disk or VM types. The backup is performed by streams generated by HANA.

## Use Azure VM backup with Azure SAP HANA backup

In addition to using SAP HANA backup in Azure, which provides database-level backup and recovery, you can use the Azure VM backup solution to back up the operating system and non-database disks.

You can use the [Backint certified Azure SAP HANA backup solution](#backup-architecture) for database backup and recovery.

You can use [an Azure VM backup](backup-azure-vms-introduction.md) to back up the operating system and other non-database disks. The VM backup is run once a day, and it backs up all disks except the Write Accelerator operating system disks and ultra disks. Because you're backing up the database by using the Azure SAP HANA backup solution, you can take a file-consistent backup of only the operating system and non-database disks by using the [selective disk backup and restore for Azure VMs](selective-disk-backup-restore.md) feature.

1. Restore a VM that's running SAP HANA by doing one of the following:

   * [Restore a new VM from the Azure VM backup](backup-azure-arm-restore-vms.md) from the latest recovery point. 
   * Create a new empty VM and attach the disks from the latest recovery point.

1. If Write Accelerator disks are excluded, they aren’t restored. In this case, create empty Write Accelerator disks and a log area.

1. After all the other configurations (such as IP, system name, and so on) are set, the VM is set to receive database data from Azure Backup.

1. Restore the database into the VM from the [Azure SAP HANA database backup](sap-hana-db-restore.md#restore-to-a-point-in-time-or-to-a-recovery-point) to your intended point in time.

## Back up a HANA system with replication enabled

Azure Backup now supports backing up databases that have HSR enabled. This means that backups are managed automatically when a failover occurs, which eliminates the necessity for manual intervention. Backup also offers immediate protection with no remedial full backups, so you can protect HANA instances or HSR setup nodes as a single HSR container. 

Although there are multiple physical nodes (primary and secondary), the backup service now considers them a single HSR container.

## Back up database instance snapshots

As databases grow in size, the time it takes to restore them becomes a factor when you're dealing with streaming backups. Also, during backup, the time the database takes to generate Backint streams can grow in proportion to the churn, which can be factor as well.

A database-consistent, snapshot-based approach helps to solve both issues, and it gives you the benefit of instant backup and instant restore. For HANA, Azure Backup is now providing a HANA-consistent, snapshot-based approach that's integrated with Backint, so that you can use Azure Backup as a single product for your entire HANA landscape, irrespective of database size.

### Pricing

#### Managed disk snapshot

Azure Backup uses managed disk snapshots. Azure Backup stores them in a resource group that you specify. Managed disk snapshots use standard hard disk drive (HDD) storage, irrespective of the storage type of the disk, and you're charged according to [Managed disk snapshot pricing](https://azure.microsoft.com/pricing/details/managed-disks/). The first disk snapshot is a full snapshot, and all subsequent snapshots are incremental and consist only of the changes since the last one. 

>[!Note]
>There are no backup storage costs for snapshots, because they're *not* transferred to your Recovery Services vault.
#### Backint streams

As per SAP recommendation, it's mandatory to have weekly full snapshots for all the databases within an instance. So, you'll be charged for all protected databases within the instance (that is, *Protected Instance pricing* plus *backup storage pricing*), according to [Azure Backup pricing for SAP HANA databases](https://azure.microsoft.com/pricing/details/backup/).
    
## Next steps

Learn how to:

- [Back up SAP HANA databases on Azure VMs](backup-azure-sap-hana-database.md).
- [Back up SAP HANA System Replication databases on Azure VMs](sap-hana-database-with-hana-system-replication-backup.md).
- [Back up SAP HANA database snapshot instances on Azure VMs](sap-hana-database-instances-backup.md).
- [Restore SAP HANA databases on Azure VMs](./sap-hana-db-restore.md).
- [Manage SAP HANA databases that are backed up by using Azure Backup](./sap-hana-db-manage.md).
