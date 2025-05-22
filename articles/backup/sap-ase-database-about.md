---
title: About the SAP ASE (Sybase) database backup on Azure VMs
description: In this article, learn about backing up SAP ASE (Sybase) databases that are running on Azure virtual machines.
ms.topic: overview
ms.date: 05/13/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# About SAP ASE (Sybase) database backup on Azure VMs

SAP Adaptive Server Enterprise (ASE) (Sybase) databases are mission critical workloads that require a low recovery point objective (RPO) and a fast recovery time objective (RTO). You can now back up SAP ASE (Sybase) databases that are running on Azure virtual machines (VMs) by using [Azure Backup](./backup-overview.md).

This offering from Azure Backup aligns with the Azure Backup's concept of *zero-infrastructure backups*, which eliminate the need to deploy and manage the backup infrastructure. You can now seamlessly back up and restore SAP ASE (Sybase) databases that are running on Azure VMs. You can also apply the enterprise management capabilities that Azure Backup provides.

## Key benefits of SAP ASE (Sybase) database backup

By using the Azure Backup service to back up and restore SAP ASE (Sybase) databases, you get the following advantages:

* **15-minute RPO**: For stream-based backup, log backups are streamed every 15 minutes and can be applied in addition to the database backup, which provides Point-In-Time recovery capability.
* **One-click, point-in-time restores**: Restoration of production data to alternative ASE servers is made easy. Azure manages the chaining of the backups to perform the restore operations behind the scenes.
* **Long-term retention**: Required for rigorous compliance and audit needs. Retain your backups for years, based on the retention duration, beyond which the recovery points are pruned automatically with the built-in lifecycle management capability.
* **Backup management from Azure**: Use Azure Backup management and monitoring capabilities for improved management experience.
* **Compression**: To save on backup storage costs, enable ASE Native compression via backup policy.
* **Striping**: Enable Striping to increase the backup throughput between ASE Virtual Machine (VM) and Recovery services vault via preregistration script.
* **Support for Cost-effective Backup policies** : Weekly full + daily differential backups result in lower storage costs (as opposed to daily streaming full backups) 
* **Recovery Services Vault**: All backups are streamed directly to the Azure Backup managed recovery services vault that provides security capabilities like Immutability, Soft Delete and Multiuser Auth. The vaulted backup data is stored in Microsoft-managed Azure subscription and is isolated from customer’s environment. These features ensure that the SAP ASE backup data is always secure and tamper-proof. You can also recover the data safely even when the source machines are compromised. 
* **Multiple Database Restore options**: Support of Alternate Location Restore (System refresh), Original Location Restore, and Restore as Files. 

To learn about the supported backup and restore scenarios, see the [SAP ASE scenario support matrix](sap-ase-backup-support-matrix.md).

## Backup architecture for SAP ASE (Sybase) databases

You can back up SAP ASE (Sybase) databases that are running inside an Azure VM and stream backup data directly to the Azure Recovery Services vault.

* You begin the backup process by creating a Recovery Services vault in Azure. This vault will be used to store the backups and recovery points that are created over time.
* The Azure VM that's running the SAP ASE server is registered with the vault, and the databases to be backed up are discovered. To enable the Azure Backup service to discover databases, a [preregistration script](https://go.microsoft.com/fwlink/?linkid=2173610) must be run on the ASE server as a root user.
* This script creates the *AZUREWLBACKUPASEUSER* database user or uses the custom Backup user you already created. It then creates a corresponding key with the same name in *hdbuserstore*. To learn more about the functionality of the script, see [Back up SAP ASE (Sybase) databases in an Azure VM](sap-ase-database-backup.md).
* The Azure Backup service now installs the Azure Backup plugin for ASE on the registered SAP ASE server.
* The `AZUREWLBACKUPASEUSER` database user (created by the preregistration script or the custom Backup user you created, and added as input to the preregistration script) is used by the Azure Backup plugin for ASE to back up and restore. If you attempt to configure backup for SAP ASE (Sybase) databases without running this script, you might receive the UserErrorASEScriptNotRun error.
* To configure a backup on the databases that you discovered, choose the required backup policy, and then enable backups.

   > [!NOTE]
   > Ensure that these parameters aren't present at the host level. Host-level parameters override these parameters and might cause unexpected behavior.


* The Azure Backup plugin for ASE maintains all the backup schedules and policy details. It triggers the scheduled backups and communicates with the ASE backup engine through the APIs.
* The ASE backup engine returns a stream with the data to be backed up.
* All the scheduled backups and on-demand backups (triggered from the Azure portal) that are either full or differential are initiated via the Azure Backup plugin for ASE. However,  the ASE backup engine manages and triggers log backups.
* Azure Backup for SAP ASE, because it's a certified solution, doesn't depend on underlying disk or VM types. ASE generates streams that actively perform the backup.

:::image type="content" source="./media/sap-ase-database-about/database-backup-architecture.png" alt-text="Diagram shows the SAP ASE Sybase database backup." lightbox="./media/sap-ase-database-about/database-backup-architecture.png":::

## Use Azure VM backup with Azure SAP ASE backup

In addition to using SAP ASE backup in Azure, which provides database-level backup and recovery, you can use the Azure VM backup solution to back up the operating system and nondatabase disks.

You can use the [certified Azure SAP ASE backup solution](#backup-architecture-for-sap-ase-sybase-databases) for database backup and recovery.

You can use [an Azure VM backup](backup-azure-vms-introduction.md) to back up the operating system and other nondatabase disks. The VM backup is run once a day, and it backs up all disks, except the Write Accelerated operating system disks and ultra disks. Because you're backing up the database by using the Azure SAP ASE backup solution, you can take a file-consistent backup of only the operating system and nondatabase disks by using the [selective disk backup and restore for Azure VMs](selective-disk-backup-restore.md) feature.

1. Restore a VM that's running SAP ASE using one of the following options:

   * [Restore a new VM from the Azure VM backup](backup-azure-arm-restore-vms.md) from the latest recovery point. 
   * [Create a new empty VM](/azure/virtual-machines/windows/quick-create-portal) and attach the disks from the latest recovery point.

2. If Write Accelerated disks are excluded, they aren’t restored. In this case, create empty Write Accelerator disks and a log area.

3. After all the other configurations (such as IP, system name, and so on) are set, the VM is set to receive database data from Azure Backup.

4. Restore the database into the VM from the Azure SAP ASE (Sybase) database backup to your intended point in time.

## Backup pricing

SAP ASE (Sybase) backup pricing has two components:

- **Protected Instance cost**: A flat rate per instance, irrespective of the ASE database size. This rate differs  between regions.

- **Backup Storage cost**: Cost based on the storage  space consumption for the backed-up data.

For example, if you protect a 1.2 TB ASE database in an East US2 instance, you’re charged monthly for the Protection Instance and the storage used.

## Cross Subscription Restore for SAP ASE (Sybase) database

Azure Backup now supports restoring SAP ASE databases to any subscription and Recovery Services vault, provided they are in the same tenant and  the necessary [Azure role-based access control (Azure RBAC) permissions for restore](backup-rbac-rs-vault.md#minimum-role-requirements-for-sap-ase-sybase-database--cross-subscription-restore) are met. By default, restores are performed within the same subscription where the restore points are located.

>[!Note]
>- CSR is enabled by default on all Recovery Services vaults, including both existing and newly created vaults.
>- Cross-Subscription Restore can be initiated directly from the Recovery Services vault.
>- Cross Regional Restore (CRR) with CSR isn't supported.

Learn how to [trigger Cross Subscription Restore to a private endpoint enabled vault](sap-ase-database-restore.md#restore-to-a-private-endpoint-enabled-vault-in-a-different-subscription).

## Next steps

Learn how to:

- [Configure backup for SAP ASE (Sybase) databases on Azure VMs using Azure portal](sap-ase-database-backup.md).
- [Restore SAP ASE database on Azure VMs using Azure portal](sap-ase-database-restore.md).
- [Manage and monitor backed-up SAP ASE database using Azure portal](sap-ase-database-manage.md).
- [Quickstart: Run the preregistration script for SAP ASE (Sybase) database backup in Azure Cloud Shell](sap-ase-database-backup-run-preregistration-quickstart.md).
- [Tutorial: Back up SAP ASE (Sybase) database using Azure Business Continuity Center](sap-ase-database-backup-tutorial.md).
- [Troubleshoot SAP ASE (Sybase) database backup](troubleshoot-sap-ase-sybase-database-backup.md).
