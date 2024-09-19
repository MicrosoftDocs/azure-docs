---
title: Back up SQL Server from the Azure VM blade using Azure Backup
description: In this article, learn how to back up SQL Server databases from the Azure VM blade via the Azure portal.
ms.topic: how-to
ms.date: 07/23/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Back up a SQL Server from the Azure SQL Server VM blade

This article describes how to use Azure Backup to back up a SQL Server (running in Azure VM) from the SQL VM resource via the Azure portal.

SQL Server databases are critical workloads that require a low recovery-point objective (RPO) and long-term retention. You can back up SQL Server databases running on Azure virtual machines (VMs) by using [Azure Backup](backup-overview.md).

>[!Note]
>Learn more about the [SQL backup supported configurations and scenarios](sql-support-matrix.md).

## Prerequisites

Before you back up a SQL Server database, see the [backup criteria](backup-sql-server-database-azure-vms.md#prerequisites).

## Configure backup for SQLServer database

You can now configure Azure backup for your SQL server running in Azure VM, directly from the SQL VM resource blade.

To configure backup from the SQL VM blade, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the *SQL VM resource*. 

   >[!Note]
   >SQL Server resource is different from the Virtual Machine resource.

1. Go to **Settings** > **Backups**.

   If the backup isn’t configured for the VM, the following backup options appear:

   - **Azure Backup**
   - **Automated Backup**

   :::image type="content" source="./media/backup-sql-server-database-from-azure-vm-blade/select-backups.png" alt-text="Screenshot shows how to select the Backups option on a SQL VM." lightbox="./media/backup-sql-server-database-from-azure-vm-blade/select-backups.png":::

1. On the **Azure Backup** blade, select **Enable** to start configuring the backup for the SQL Server using Azure Backup.

1. To start the backup operation, select an existing Recovery Services vault or [create a new  vault](backup-sql-server-database-azure-vms.md#create-a-recovery-services-vault).

1. Select **Discover** to start discovering databases in the VM.

   :::image type="content" source="./media/backup-sql-server-database-from-azure-vm-blade/start-database-discovery.png" alt-text="Screenshot shows how to start discovering the SQL database." lightbox="./media/backup-sql-server-database-from-azure-vm-blade/start-database-discovery.png":::

   This operation will take some time to run when performed for the first time.

   :::image type="content" source="./media/backup-sql-server-database-from-azure-vm-blade/database-discovery-in-progress.png" alt-text="Screenshot shows the database discovery operation in progress." lightbox="./media/backup-sql-server-database-from-azure-vm-blade/database-discovery-in-progress.png":::

   Azure Backup discovers all SQL Server databases on the VM. During discovery, the following operations run in the background:

   1. Azure Backup registers the VM with the vault for workload backup. All databases on the registered VM can only be backed up to this vault.
   1. Azure Backup installs the AzureBackupWindowsWorkload extension on the VM. No agent is installed on the SQL database.
   1. Azure Backup creates the service account NT Service\AzureWLBackupPluginSvc on the VM.
   1. All backup and restore operations use the service account.
   1. NT Service\AzureWLBackupPluginSvc needs SQL sysadmin permissions. All SQL Server VMs created in Azure Marketplace come with the SqlIaaSExtension installed.

      The AzureBackupWindowsWorkload extension uses the SQLIaaSExtension to automatically get the necessary permissions.

1. Once the operation is completed, select **Configure backup**.

   :::image type="content" source="./media/backup-sql-server-database-from-azure-vm-blade/start-database-backup-configuration.png" alt-text="Screenshot shows how to start the database backup configuration." lightbox="./media/backup-sql-server-database-from-azure-vm-blade/start-database-backup-configuration.png":::

1. Define a backup policy using one of the following options:

   1. Select the default policy as *HourlyLogBackup*.
   1. Select an existing backup policy previously created for SQL.
   1. [Create a new policy](tutorial-sql-backup.md#create-a-backup-policy) based on your RPO and retention range.

   :::image type="content" source="./media/backup-sql-server-database-from-azure-vm-blade/select-backup-policy.png" alt-text="Screenshot shows how to select a backup policy for the database." lightbox="./media/backup-sql-server-database-from-azure-vm-blade/select-backup-policy.png":::

1. Select **Add** to view all the registered availability groups and standalone SQL Server instances. 

1. On **Select items to backup**,  expand the list of all the *unprotected databases* in that instance or the *Always On availability group*.

1. Select the *databases* to protect and select **OK**.

   :::image type="content" source="./media/backup-sql-server-database-from-azure-vm-blade/confirm-database-selection.png" alt-text="Screenshot shows how to confirm the selection of database for backup." lightbox="./media/backup-sql-server-database-from-azure-vm-blade/confirm-database-selection.png":::

1. To optimize backup loads, Azure Backup allows/permits a maximum number of 50 databases in one backup job.

   1. To protect more than 50 databases, configure multiple backups.
   1. To enable the entire instance or the Always On availability group, in the AUTOPROTECT drop-down list, select ON, and then select OK.

1. Select **Enable Backup** to submit the Configure Protection operation and track the configuration progress in the Notifications area of the portal.

   :::image type="content" source="./media/backup-sql-server-database-from-azure-vm-blade/enable-database-backup.png" alt-text="Screenshot shows how to enable the database backup operation." lightbox="./media/backup-sql-server-database-from-azure-vm-blade/enable-database-backup.png":::

1. To get an overview of your configured backups and a summary of backup jobs,  go to **Settings** > **Backups** in the SQL VM resource.   

   :::image type="content" source="./media/backup-sql-server-database-from-azure-vm-blade/backup-jobs-summary.png" alt-text="Screenshot shows how to view the backup jobs summary." lightbox="./media/backup-sql-server-database-from-azure-vm-blade/backup-jobs-summary.png":::

## Next steps

- [Restore SQL Server databases on Azure VM](restore-sql-database-azure-vm.md)
- [Manage and monitor backed up SQL Server databases](manage-monitor-sql-database-backup.md)
- [Troubleshoot backups on a SQL Server database](backup-sql-server-azure-troubleshoot.md)
- [FAQ - Backing up SQL Server databases on Azure VMs - Azure Backup | Microsoft Learn](/azure/backup/faq-backup-sql-server)
