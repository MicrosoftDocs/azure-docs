---
title: Manage and monitor SQL Server databases on an Azure VM that's backed up by Azure Backup | Microsoft Docs
description: This article describes how to restore SQL Server databases that are running on an Azure VM and that are backed up by Azure Backup.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 02/19/2018
ms.author: raynew


---
# Manage and monitor backed up SQL Server databases


This article describes common tasks for managing and monitoring SQL Server databases that are running on an Azure virtual machine (VM) and that are backed up to an Azure Backup Recovery Services vault by the [Azure Backup](backup-overview.md) service. You'll learn how to monitor jobs and alerts, stop and resume database protection, run backup jobs, and unregister a VM from backups.

If you haven't yet configured backups for your SQL Server databases, see [Back up SQL Server databases on Azure VMs](backup-azure-sql-database.md)

## Monitor manual backup jobs in the portal

Azure Backup shows all manually triggered jobs in the **Backup jobs** portal. The jobs you see in this portal include database discovery and registering, and backup and restore operations.

![The Backup jobs portal](./media/backup-azure-sql-database/jobs-list.png)

> [!NOTE]
> The **Backup jobs** portal doesn't show scheduled backup jobs. Use SQL Server Management Studio to monitor scheduled backup jobs, as described in the next section.
>

## Monitor scheduled backup jobs in SQL Server Management Studio

Azure Backup uses SQL native APIs for all backup operations. Use the native APIs to fetch all job information from the [SQL backupset table](https://docs.microsoft.com/sql/relational-databases/system-tables/backupset-transact-sql?view=sql-server-2017) in the msdb database.

The following example is a query that fetches all backup jobs for a database that's named **DB1**. Customize the query for advanced monitoring.

```
select CAST (
Case type
                when 'D' 
                                 then 'Full'
                when  'I'
                               then 'Differential' 
                ELSE 'Log'
                END         
                AS varchar ) AS 'BackupType',
database_name, 
server_name,
machine_name,
backup_start_date,
backup_finish_date,
DATEDIFF(SECOND, backup_start_date, backup_finish_date) AS TimeTakenByBackupInSeconds,
backup_size AS BackupSizeInBytes
  from msdb.dbo.backupset where user_name = 'NT SERVICE\AzureWLBackupPluginSvc' AND database_name =  <DB1>  

```

## View backup alerts

Because log backups occur every 15 minutes, monitoring backup jobs can be tedious. Azure Backup eases monitoring by sending email alerts. Email alerts are:

- Triggered for all backup failures.
- Consolidated at the database level by error code.
- Sent only for a database's first backup failure.

To monitor database backup alerts:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the vault dashboard, select **Alerts and Events**.

   ![Select Alerts and Events](./media/backup-azure-sql-database/vault-menu-alerts-events.png)

3. In **Alerts and Events**, select **Backup Alerts**.

   ![Select Backup Alerts](./media/backup-azure-sql-database/backup-alerts-dashboard.png)

## Stop protection for a SQL Server database

You can stop backing up a SQL Server database in a couple of ways:

* Stop all future backup jobs, and delete all recovery points.
* Stop all future backup jobs, and leave the recovery points intact.

If you choose to leave recovery points, keep these details in mind:

* Any recovery points you leave will be cleaned up according to the backup policy.
* Until all recovery points are cleaned up, you'll be charged for the protected instance and the consumed storage. For more information, see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).
* Azure Backup always keeps one last recovery point until you delete the backup data.
* If you delete a data source without stopping backups, new backups will fail.
* If your database is enabled for autoprotection, you can't stop backups unless you disable autoprotection.

To stop protection for a database:

1. On the vault dashboard, under **Usage**, select **Backup Items**.

2. Under **Backup Management Type**, select **SQL in Azure VM**.

    ![Select SQL in Azure VM](./media/backup-azure-sql-database/sql-restore-backup-items.png)

3. Select the database for which you want to stop protection.

    ![Select the database to stop protection](./media/backup-azure-sql-database/sql-restore-sql-in-vm.png)

4. On the database menu, select **Stop backup**.

    ![Select Stop backup](./media/backup-azure-sql-database/stop-db-button.png)


5. On the **Stop Backup** menu, select whether to retain or delete data. If you want, provide a reason and comment.

    ![Retain or delete data on the Stop Backup menu](./media/backup-azure-sql-database/stop-backup-button.png)

6. Select **Stop backup**.


## Resume protection for a SQL database

When you stop protection for the SQL database, if you select the **Retain Backup Data** option, you can later resume protection. If you don't retain the backup data, you can't resume protection.

To resume protection for a SQL database:

1. Open the backup item and select **Resume backup**.

    ![Select Resume backup to resume database protection](./media/backup-azure-sql-database/resume-backup-button.png)

2. On the **Backup policy** menu, select a policy, and then select **Save**.

## Run an on-demand backup

You can run different types of on-demand backups:

* Full backup
* Copy-only full backup
* Differential backup
* Log backup

For more information, see [SQL Server backup types](backup-architecture.md#sql-server-backup-types).

## Unregister a SQL Server instance

Unregister a SQL Server instance after you disable protection but before you delete the vault:

1. On the vault dashboard, under **Manage**, select **Backup Infrastructure**.  

   ![Select Backup Infrastructure](./media/backup-azure-sql-database/backup-infrastructure-button.png)

2. Under **Management Servers**, select **Protected Servers**.

   ![Select Protected Servers](./media/backup-azure-sql-database/protected-servers.png)

3. In **Protected Servers**, select the server to unregister. To delete the vault, you must unregister all servers.

4. Right-click the protected server, and select **Delete**.

   ![Select Delete](./media/backup-azure-sql-database/delete-protected-server.png)

## Re-register extension on the SQL Server VM

Sometimes, the workload extension on the VM may get impacted for one reason or the other. In such cases, all the operations triggered on the VM will begin to fail. You may then need to re-register the extension on the VM. Re-register operation re-installs the workload backup extension on the VM for operations to continue.  <br>

It is advised to use this option with caution; when triggered on a VM with an already healthy extension, this operation will cause the extension to get restarted. This may result in all the in-progress jobs to fail. Kindly check for one or more of the [symptoms](#symptoms) before triggering the re-register operation. 

## Next steps

For more information, see [Troubleshoot backups on a SQL Server database](backup-sql-server-azure-troubleshoot.md).
