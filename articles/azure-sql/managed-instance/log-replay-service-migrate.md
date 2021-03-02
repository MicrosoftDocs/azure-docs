---
title: Migrate databases to SQL Managed Instance using Log Replay Service
description: Learn how to migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service
services: sql-database
ms.service: sql-managed-instance
ms.custom: seo-lt-2019, sqldbrb=1
ms.devlang: 
ms.topic: how-to
author: danimir
ms.author: danimir
ms.reviewer: sstein
ms.date: 03/01/2021
---

# Migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article explains how to manually configure database migration from SQL Server 2008-2019 to SQL Managed Instance by using Log Replay Service (LRS). LRS is a cloud service that's enabled for SQL Managed Instance and is based on SQL Server log-shipping technology. 

## When to use Log Replay Service

When you can't use [Azure Database Migration Service](/azure/dms/tutorial-sql-server-to-managed-instance) for migration, you can use LRS directly with PowerShell, Azure CLI cmdlets, or an API to manually build and orchestrate database migrations to SQL Managed Instance. 

You might consider using LRS in the following cases:
- You need more control for your database migration project.
- There's little tolerance for downtime on migration cutover.
- The Database Migration Service executable file can't be installed in your environment.
- The Database Migration Service executable file doesn't have file access to database backups.
- No access to the host OS is available, or there are no administrator privileges.
- You can't open network ports from your environment to Azure.

> [!NOTE]
> We recommended automating the migration of databases from SQL Server to SQL Managed Instance by using Azure Database Migration Service. This service uses the same LRS cloud service at the back end, with log shipping in `NORECOVERY` mode. Consider manually using LRS to orchestrate migrations when Database Migration Service doesn't fully support your scenarios.

## How it works

Building a custom solution by using LRS to migrate databases to the cloud requires several orchestration steps, as shown in the diagram and table later in this section.

The migration consists of making full database backups on SQL Server with `CHECKSUM` enabled, and copying backup files to Azure Blob Storage. LRS is used to restore backup files from Blob Storage to SQL Managed Instance. Blob Storage is intermediary storage between SQL Server and SQL Managed Instance.

LRS monitors Blob Storage for any new differential or log backups added after the full backup has been restored. LRS then automatically restores these new files. You can use the service to monitor the progress of backup files being restored on SQL Managed Instance, and you can stop the process if necessary.

LRS does not require a specific naming convention for backup files. It scans all files placed on Blob Storage and constructs the backup chain from reading the file headers only. Databases are in a "restoring" state during the migration process. Databases are restored in [NORECOVERY](https://docs.microsoft.com/sql/t-sql/statements/restore-statements-transact-sql?view=sql-server-ver15#comparison-of-recovery-and-norecovery) mode, so they can't be used for reading or writing until the migration process is finished. 

If you're migrating several databases, you need to:
 
- Place backups for each database in a separate folder on Blob Storage.
- Start LRS separately for each database.
- Specify different paths to separate Blob Storage folders. 

You can start LRS in either *autocomplete* or *continuous* mode. When you start it in autocomplete mode, the migration will finish automatically when the last of the specified backup files has been restored. When you start LRS in continuous mode, the service will continuously restore any new backup files added, and the migration will finish on the manual cutover only. 

We recommend that you manually cut over after the final log-tail backup has been taken and is shown as restored on SQL Managed Instance. The final cutover step will make the database come online and available for read and write use on SQL Managed Instance.

After LRS is stopped, either automatically through autocomplete or manually through cutover, you can't resume the restore process for a database that was brought online on SQL Managed Instance. To restore additional backup files after the migration finishes through autocomplete or cutover, you need to delete the database. You also need to restore the entire backup chain from scratch by restarting LRS.

![Diagram that explains the Log Replay Service orchestration steps for SQL Managed Instance.](./media/log-replay-service-migrate/log-replay-service-conceptual.png)

| Operation | Details |
| :----------------------------- | :------------------------- |
| **1. Copy database backups from SQL Server to Blob Storage**. | Copy full, differential, and log backups from SQL Server to a Blob Storage container by using [Azcopy](/azure/storage/common/storage-use-azcopy-v10) or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). <br /><br />Use any file names. LRS doesn't require a specific file-naming convention.<br /><br />In migrating several databases, you need a separate folder for each database. |
| **2. Start LRS in the cloud**. | You can restart the service with a choice of cmdlets: PowerShell ([start-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/start-azsqlinstancedatabaselogreplay)) or Azure CLI ([az_sql_midb_log_replay_start cmdlets](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_start)). <br /><br /> Start LRS separately for each database that points to a backup folder on Blob Storage. <br /><br /> After you start the service, it will take backups from the Blob Storage container and start restoring them on SQL Managed Instance.<br /><br /> If you started LRS in continuous mode, after all initially uploaded backups are restored, the service will watch for any new files uploaded to the folder. The service will continuously apply logs based on the log sequence number (LSN) chain until it's stopped. |
| **2.1. Monitor the operation's progress**. | You can monitor progress of the restore operation with a choice of cmdlets: PowerShell ([get-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/get-azsqlinstancedatabaselogreplay)) or Azure CLI ([az_sql_midb_log_replay_show cmdlets](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_show)). |
| **2.2. Stop the operation if needed**. | If you need to stop the migration process, you have a choice of cmdlets: PowerShell ([stop-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/stop-azsqlinstancedatabaselogreplay)) or Azure CLI ([az_sql_midb_log_replay_stop](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_stop)). <br /><br /> Stopping the operation will delete the database that you're restoring on SQL Managed Instance. After you stop an operation, you can't resume LRS for a database. You need to restart the migration process from scratch. |
| **3. Cut over to the cloud when you're ready**. | After all backups have been restored to SQL Managed Instance, complete the cutover by starting an LRS `complete` operation with a choice of cmdlets: PowerShell ([complete-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/complete-azsqlinstancedatabaselogreplay)) or Azure CLI [az_sql_midb_log_replay_complete](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_complete). <br /><br /> This operation will stop LRS and cause the database to come online for read and write use on SQL Managed Instance. Then, repoint the application connection string from SQL Server to SQL Managed Instance. |

## Requirements for getting started

### SQL Server side
- Install SQL Server 2008-2019.
- Do a full backup of databases (one or multiple files).
- Do a differential backup (one or multiple files).
- Do a log backup (not split for a transaction log file).
- Enable `CHECKSUM` for backups (mandatory).

### Azure side
- Get PowerShell Az.SQL module version 2.16.0 or later. ([Install](https://www.powershellgallery.com/packages/Az.Sql/) it or use [Azure Cloud Shell](/azure/cloud-shell/).)
- [Install](/cli/azure/install-azure-cli) Azure CLI version 2.19.0 or later.
- Provision an Azure Blob Storage container.
- Generate a shared access storage (SAS) security token with read and list permissions generated for the Blob Storage container.

### Migration of multiple databases
You must place backup files for different databases in separate folders on Blob Storage.

Start LRS separately for each database by pointing to an appropriate folder on Blob Storage. LRS can support up to 100 simultaneous restore processes per single managed instance.

### Azure RBAC permissions
Running LRS through the provided clients requires one of the following Azure roles:
- Subscription Owner role
- [Managed Instance Contributor](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) role
- Custom role with the following permission: `Microsoft.Sql/managedInstances/databases/*`

## Best practices

We recommend the following best practices:
- Run [Data Migration Assistant](/sql/dma/dma-overview) to validate that your databases are ready to be migrated to SQL Managed Instance. 
- Split full and differential backups into multiple files, instead of using a single file.
- Enable backup compression.
- Use Cloud Shell to run scripts, because it will always be updated to the latest cmdlets released.
- Plan to complete the migration within 47 hours after you start LRS. This is a grace period that prevents the installation of system-managed software patches.

> [!IMPORTANT]
> - You can't use the database that's being restored through LRS until the migration process finishes. The reason is that the underlying technology is in `NORECOVERY` restore mode.
> - LRS doesn't support a `STANDBY` restore mode that allows read-only access to databases during the migration because of the version differences between SQL Managed Instance and in-market SQL Server databases.
> - After migration finishes through autocomplete or manual cutover, the migration process is finalized because LRS doesn't support resuming the restore process.

## Steps before migration

### Make backups of SQL Server

You can make backups of SQL Server by using either of the following options:

- Back up to local disk storage, and then upload files to Azure Blob Storage, if your environment restricts direct backups to Blob Storage.
- Back up directly to Blob Storage with the `TO URL` option in T-SQL, if your environment and security procedures allow it. 

Set databases that you want to migrate to the full recovery mode to allow log backups.

```SQL
-- To permit log backups, before the full database backup, modify the database to use the full recovery
USE master
ALTER DATABASE SampleDB
SET RECOVERY FULL
GO
```

To manually make full, diff, and log backups of your database on local storage, use the following sample T-SQL scripts. Ensure that the `CHECKSUM` option is enabled, because it's mandatory for LRS.

```SQL
-- Example of how to make a full database backup to the local disk
BACKUP DATABASE [SampleDB]
TO DISK='C:\BACKUP\SampleDB_full.bak'
WITH INIT, COMPRESSION, CHECKSUM
GO

-- Example of how to make a differential database backup to the local disk
BACKUP DATABASE [SampleDB]
TO DISK='C:\BACKUP\SampleDB_diff.bak'
WITH DIFFERENTIAL, COMPRESSION, CHECKSUM
GO

-- Example of how to make the log backup
BACKUP LOG [SampleDB]
TO DISK='C:\BACKUP\SampleDB_log.trn'
WITH COMPRESSION, CHECKSUM
GO
```

Files backed up to local storage will need to be uploaded to Azure Blob Storage. If your corporate policy allows it, you can make backups directly to Blob Storage by following the tutorial [Use Azure Blob Storage with SQL Server](/sql/relational-databases/tutorial-use-azure-blob-storage-service-with-sql-server-2016#1---create-stored-access-policy-and-shared-access-storage). If you're using this alternative approach, be sure enable the `CHECKSUM` option for all backups.

### Copy backups from SQL Server to Blob Storage

In migrating databases to a managed instance by using LRS, you can use the following approaches to upload backups to Blob Storage:
- Using SQL Server native [BACKUP TO URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url) functionality
- Using [Azcopy](/azure/storage/common/storage-use-azcopy-v10) or [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer) to upload backups to a blob container
- Using Storage Explorer in the Azure portal

### Create a Blob Storage container and SAS authentication token

Azure Blob Storage is intermediary storage for backup files between SQL Server and SQL Managed Instance. Follow these steps to create a Blob Storage container:

1. [Create a storage account](../../storage/common/storage-account-create.md?tabs=azure-portal).
2. [Create a blob container](../../storage/blobs/storage-quickstart-blobs-portal.md) inside the storage account.

After you create a blob container, use the following steps to generate an SAS authentication token with only read and list permissions:

1. Access a storage account by using the Azure portal.
2. Go to Storage Explorer.
3. Expand **Blob Containers**.
4. Right-click the blob container.
5. Select **Get Shared Access Signature**.
6. Select the timeframe for token expiration. Ensure that the token is valid for the duration of your migration.
	
   > [!NOTE]
   > The time zone of the token and your managed instance might mismatch. Ensure that the SAS token has the appropriate time validity, taking time zones into consideration. If possible, set the time zone to an earlier and later time of your planned migration window.
8. Ensure that only **Read** and **List** permissions are selected.
9. Select **Create**.
10. Copy the token after the question mark (`?`) until the end of the string. The SAS token typically starts with `sv=2020-10` in the URI for use in your code.

> [!IMPORTANT]
> - Permissions for the SAS token for Azure Blob Storage need to be only read and list. If any other permissions are granted for the SAS authentication token, LRS won't start. These security requirements are by design.
> - The token must have the appropriate time validity. Be sure to consider the time zones between the token and the managed instance.

### Log in to Azure and select a subscription

Use the following PowerShell cmdlet to log in to Azure:

```powershell
Login-AzAccount
```

Select the appropriate subscription where your managed instance resides by using the following PowerShell cmdlet:

```powershell
Select-AzSubscription -SubscriptionId <subscription ID>
```

## Start the migration

You start the migration by starting LRS. You can start the service in either autocomplete or continuous mode. 

When you use autocomplete mode, the migration will finish automatically when the last of the specified backup files has been restored. This option requires the start command to specify the filename of the last backup file. 

When you use continuous mode, the service will continuously restore any new backup files that were added. The migration will finish on the manual cutover only. 

### Start LRS in autocomplete mode

To start LRS in autocomplete mode, use the following PowerShell or Azure CLI commands. Specify the last backup file name by using the `-LastBackupName` parameter. Upon restoring the last of the specified backup files, the service will automatically initiate a cutover.

Here's an example of starting LRS in autocomplete mode by using PowerShell:

```PowerShell
Start-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName" `
	-Collation "SQL_Latin1_General_CP1_CI_AS" `
	-StorageContainerUri "https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>" `
	-StorageContainerSasToken "sv=2019-02-02&ss=b&srt=sco&sp=rl&se=2023-12-02T00:09:14Z&st=2019-11-25T16:09:14Z&spr=https&sig=92kAe4QYmXaht%2Fgjocqwerqwer41s%3D" `
	-AutoCompleteRestore `
	-LastBackupName "last_backup.bak"
```

Here's an example of starting LRS in autocomplete mode by using the Azure CLI:

```CLI
az sql midb log-replay start -g mygroup --mi myinstance -n mymanageddb -a --last-bn "backup.bak"
	--storage-uri "https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>"
	--storage-sas "sv=2019-02-02&ss=b&srt=sco&sp=rl&se=2023-12-02T00:09:14Z&st=2019-11-25T16:09:14Z&spr=https&sig=92kAe4QYmXaht%2Fgjocqwerqwer41s%3D"
```

### Start LRS in continuous mode

Here's an example of starting LRS in continuous mode by using PowerShell:

```PowerShell
Start-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName" `
	-Collation "SQL_Latin1_General_CP1_CI_AS" -StorageContainerUri "https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>" `
	-StorageContainerSasToken "sv=2019-02-02&ss=b&srt=sco&sp=rl&se=2023-12-02T00:09:14Z&st=2019-11-25T16:09:14Z&spr=https&sig=92kAe4QYmXaht%2Fgjocqwerqwer41s%3D"
```

Here's an example of starting LRS in continuous mode by using the Azure CLI:

```CLI
az sql midb log-replay start -g mygroup --mi myinstance -n mymanageddb
	--storage-uri "https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>"
	--storage-sas "sv=2019-02-02&ss=b&srt=sco&sp=rl&se=2023-12-02T00:09:14Z&st=2019-11-25T16:09:14Z&spr=https&sig=92kAe4QYmXaht%2Fgjocqwerqwer41s%3D"
```

### Scripting LRS start in continuous mode

PowerShell and CLI clients to start LRS in continuous mode are synchronous. This means that clients will wait for the API response to report on success or failure to start the job. During this wait the command will not return the control back to the command prompt. In case you are scripting the migration experience, and require the LRS start command to give control back immediately to continue with rest of the script, you can execute PowerShell as a background job with -AsJob switch. For example:

```PowerShell
$lrsjob = Start-AzSqlInstanceDatabaseLogReplay <required parameters> -AsJob
```

When you start a background job, a job object returns immediately, even if the job takes an extended time to finish. You can continue to work in the session without interruption while the job runs. For details on running PowerShell as a background job, see the [PowerShell Start-Job](/powershell/module/microsoft.powershell.core/start-job#description) documentation.

Similarly, to start a CLI command on Linux as a background process, use the ampersand (&) sign at the end of the LRS start command.

```CLI
az sql midb log-replay start <required parameters> &
```

> [!IMPORTANT]
> After you start LRS, any system-managed software patches will be halted for the next 47 hours. After this window, the next automated software patch will automatically stop the ongoing LRS. If that happens, migration can't be resumed and needs to be restarted from scratch. 

## Monitor the migration progress

To monitor the progress of the migration through PowerShell, use the following command:

```PowerShell
Get-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName"
```

To monitor the progress of the migration through the Azure CLI, use the following command:

```CLI
az sql midb log-replay show -g mygroup --mi myinstance -n mymanageddb
```

## Stop the migration

If you need to stop the migration, use the following cmdlets. Stopping the migration will delete the restoring database on SQL Managed Instance, so resuming the migration won't be possible.

To stop the migration process through PowerShell, use the following command:

```PowerShell
Stop-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName"
```

To stop the migration process through the Azure CLI, use the following command:

```CLI
az sql midb log-replay stop -g mygroup --mi myinstance -n mymanageddb
```

## Complete the migration (continuous mode)

If you started LRS in continuous mode, after you've ensured that all backups have been restored, initiating the cutover will complete the migration. After the cutover, the database will be migrated and ready for read and write access.

To complete the migration process in LRS continuous mode through PowerShell, use the following command:

```PowerShell
Complete-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
-InstanceName "ManagedInstance01" `
-Name "ManagedDatabaseName" `
-LastBackupName "last_backup.bak"
```

To complete the migration process in LRS continuous mode through the Azure CLI, use the following command:

```CLI
az sql midb log-replay complete -g mygroup --mi myinstance -n mymanageddb --last-backup-name "backup.bak"
```

## Functional limitations

Functional limitations of Log Replay Service (LRS) are:
- Database being restored cannot be used for read-only access during the migration process.
- System managed software patches will be blocked for 47 hours since starting LRS. Upon expiry of this time window, the next software update will stop LRS. In such case, LRS needs to be restarted from scratch.
- LRS requires databases on the SQL Server to be backed up with CHECKSUM option enabled.
- SAS token for use by LRS needs to be generated for the entire Azure Blob Storage container, and must have Read and List permissions only.
- Backup files for different databases must be placed in separate folders on Azure Blob Storage.
- LRS has to be started separately for each database pointing to separate folders with backup files on Azure Blob Storage.
- LRS can support up to 100 simultaneous restore processes per single SQL Managed Instance.

## Troubleshooting

After you start LRS, use the monitoring cmdlet (`get-azsqlinstancedatabaselogreplay` or `az_sql_midb_log_replay_show`) to see the status of the operation. If LRS fails to start after some time and you get an error, check for the most common issues:
- Was the database backup on SQL Server made via the `CHECKSUM` option?
- Are the permissions on the SAS token only read and list for LRS?
- Did you copy the SAS token for LRS after the question mark (`?`), with content starting like this: `sv=2020-02-10...`? 
- Is the SAS token validity time applicable for the time window of starting and completing the migration? There might be mismatches due to the different time zones used for SQL Managed Instance and the SAS token. Try regenerating the SAS token and extending the token validity of the time window before and after the current date.
- Are the database name, resource group name, and managed instance name spelled correctly?
- If you started LRS in autocomplete mode, was a valid filename for the last backup file specified?

## Next steps
- Learn more about [migrating SQL Server to SQL Managed instance](../migration-guides/managed-instance/sql-server-to-managed-instance-guide.md).
- Learn more about [differences between SQL Server and SQL Managed Instance](transact-sql-tsql-differences-sql-server.md).
- Learn more about [best practices to cost and size workloads migrated to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs).
