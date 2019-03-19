---
title: Manage and monitor SQL Server databases on an Azure VM backed up by Azure Backup | Microsoft Docs
description: This article describes how to restore SQL Server databases running on an Azure VM that are backed up with Azure Backup
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 02/19/2018
ms.author: raynew


---
# Manage and monitor backed up SQL Server databases 


This article describes common tasks for managing and monitoring SQL Server databases running on an Azure VM that are backed up to an Azure Backup Recovery Services vault by the [Azure Backup](backup-overview.md) service. Tasks including monitoring jobs and alerts, stopping and resuming database protection, running backup jobs, and unregistering a VM from backup.


> [!NOTE]
> Backup of SQl Server databases running on an Azure VM with Azure Backup is currently in public preview.


TIf you haven't yet configured backup for the SQL Server databases, follow the instructions in [this article](backup-azure-sql-database.md)

## Monitor backup jobs

###  Monitor ad hoc jobs in the portal

Azure Backup shows all manually triggered jobs in the **Backup jobs** portal, including discovering and registering databases, and backup and restore operations.

![Backup jobs portal](./media/backup-azure-sql-database/jobs-list.png)

> [!NOTE]
> Scheduled backup jobs aren't shown in the **Backup jobs** portal. Use SQL Server Management Studio to monitor scheduled backup jobs, as described in the next section.
>

### Monitor backup jobs with SQL Server Management Studio 

Azure Backup uses SQL native APIs for all backup operations.

Use the native APIs to fetch all job information from the [SQL backupset table](https://docs.microsoft.com/sql/relational-databases/system-tables/backupset-transact-sql?view=sql-server-2017) in the msdb database.

The following example is a query that fetches all backup jobs for a database named **DB1**. Customize the query for advanced monitoring.

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

Because log backups occur every 15 minutes, monitoring backup jobs can be tedious. Azure Backup eases monitoring with email alerts.

- Alerts are triggered for all backup failures.
- Alerts are consolidated at the database level by error code.
- An email alert is sent only for the first backup failure for a database. 

To monitor backup alerts:

1. Sign in to your Azure subscription in the [Azure portal](https://portal.azure.com) to monitor database alerts.

2. On the vault dashboard, select **Alerts and Events**.

   ![Select Alerts and Events](./media/backup-azure-sql-database/vault-menu-alerts-events.png)

4. In **Alerts and Events**, select **Backup Alerts**.

   ![Select Backup Alerts](./media/backup-azure-sql-database/backup-alerts-dashboard.png)

## Stop protection for a SQL Server database

You can stop backing up a SQL Server database in a couple of ways:

* Stop all future backup jobs, and delete all recovery points.
* Stop all future backup jobs, but leave the recovery points intact.

Note that:

If you leave the recovery points, the points will be cleaned up in accordance with backup policy. You incur charges for the protected instance and the consumed storage, until all recovery points are cleaned up. [Learn more](https://azure.microsoft.com/pricing/details/backup/) about pricing.
- When you leave recovery points intact, although they expire as per the retention policy, Azure Backup always keeps one last recovery point until you explicitly delete backup data.
- If you delete a data source without stopping backup, new backups will start failing. Again, old recovery points will expire according to policy, but one last recovery point will always be retained until you stop backup and delete the data.
- You can't stop backup for a database enabled for auto-protection, until auto-protection is disabled.

To stop protection for a database:

1. In the vault dashboard, under **Usage**, select **Backup Items**.

    ![Open the Backup Items menu](./media/backup-azure-sql-database/restore-sql-vault-dashboard.png).

2. In **Backup Management Type**, select **SQL in Azure VM**.

    ![Select SQL in Azure VM](./media/backup-azure-sql-database/sql-restore-backup-items.png)


3. Select the database for which you want to stop protection.

    ![Select the database to stop protection](./media/backup-azure-sql-database/sql-restore-sql-in-vm.png)


5. On the database menu, select **Stop backup**.

    ![Select Stop backup](./media/backup-azure-sql-database/stop-db-button.png)


6. In **Stop Backup** menu, select whether to retain or delete data. Optionally provide a reason and comment.

    ![Stop Backup menu](./media/backup-azure-sql-database/stop-backup-button.png)

7. Click **Stop backup** .

  

### Resume protection for a SQL database

If the **Retain Backup Data** option was selected when protection for the SQL database was stopped, you can resume protection. If the backup data wasn't retained, protection can't resume.

1. To resume protection for the SQL database, open the backup item and select **Resume backup**.

    ![Select Resume backup to resume database protection](./media/backup-azure-sql-database/resume-backup-button.png)

2. On the **Backup policy** menu, select a policy, and then select **Save**.

## Run an on-demand backup

You can run different types of on-demand backups:

* Full backup
* Copy-only full backup
* Differential backup
* Log backup

[Learn more](backup-architecture.md#sql-server-backup-types) about SQL Server backup types.

## Unregister a SQL Server instance

Unregister a SQL Server instance after you've disabled protection, but before you delete the vault:

1. On the vault dashboard, under  **Manage**, select **Backup Infrastructure**.  

   ![Select Backup Infrastructure](./media/backup-azure-sql-database/backup-infrastructure-button.png)

2. Under **Management Servers**, select **Protected Servers**.

   ![Select Protected Servers](./media/backup-azure-sql-database/protected-servers.png)


3. In **Protected Servers**, select the server to unregister. To delete the vault, you must unregister all servers.

4. Right-click the protected server > **Delete**.

   ![Select Delete](./media/backup-azure-sql-database/delete-protected-server.png)


## Next steps

[Review](backup-sql-server-azure-troubleshoot.md) troubleshooting information for SQL Server database backup.
