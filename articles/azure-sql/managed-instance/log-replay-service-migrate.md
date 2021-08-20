---
title: Migrate databases to SQL Managed Instance using Log Replay Service
description: Learn how to migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service
services: sql-database
ms.service: sql-managed-instance
ms.subservice: migration
ms.custom: seo-lt-2019, sqldbrb=1, devx-track-azurecli, devx-track-azurepowershell
ms.topic: how-to
author: danimir
ms.author: danil
ms.reviewer: mathoma
ms.date: 03/31/2021
---

# Migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service (Preview)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article explains how to manually configure database migration from SQL Server 2008-2019 to Azure SQL Managed Instance by using Log Replay Service (LRS), currently in public preview. LRS is a cloud service that's enabled for SQL Managed Instance and is based on SQL Server log-shipping technology. 

[Azure Database Migration Service](../../dms/tutorial-sql-server-to-managed-instance.md) and LRS use the same underlying migration technology and the same APIs. By releasing LRS, we're further enabling complex custom migrations and hybrid architecture between on-premises SQL Server and SQL Managed Instance.

## When to use Log Replay Service

When you can't use Azure Database Migration Service for migration, you can use LRS directly with PowerShell, Azure CLI cmdlets, or APIs to manually build and orchestrate database migrations to SQL Managed Instance. 

You might consider using LRS in the following cases:
- You need more control for your database migration project.
- There's little tolerance for downtime on migration cutover.
- The Database Migration Service executable file can't be installed in your environment.
- The Database Migration Service executable file doesn't have file access to database backups.
- No access to the host OS is available, or there are no administrator privileges.
- You can't open network ports from your environment to Azure.
- Network throttling, or proxy blocking issues in your environment.
- Backups are stored directly to Azure Blob Storage through the `TO URL` option.
- You need to use differential backups.

> [!NOTE]
> We recommend automating the migration of databases from SQL Server to SQL Managed Instance by using Database Migration Service. This service uses the same LRS cloud service at the back end, with log shipping in `NORECOVERY` mode. Consider manually using LRS to orchestrate migrations when Database Migration Service doesn't fully support your scenarios.

## How it works

Building a custom solution by using LRS to migrate databases to the cloud requires several orchestration steps, as shown in the diagram and table later in this section.

The migration consists of making full database backups on SQL Server with `CHECKSUM` enabled, and copying backup files to Azure Blob Storage. LRS is used to restore backup files from Blob Storage to SQL Managed Instance. Blob Storage is intermediary storage between SQL Server and SQL Managed Instance.

LRS monitors Blob Storage for any new differential or log backups added after the full backup has been restored. LRS then automatically restores these new files. You can use the service to monitor the progress of backup files being restored on SQL Managed Instance, and you can stop the process if necessary.

LRS does not require a specific naming convention for backup files. It scans all files placed on Blob Storage and constructs the backup chain from reading the file headers only. Databases are in a "restoring" state during the migration process. Databases are restored in [NORECOVERY](/sql/t-sql/statements/restore-statements-transact-sql#comparison-of-recovery-and-norecovery) mode, so they can't be used for reading or writing until the migration process is completed. 

If you're migrating several databases, you need to:
 
- Place backups for each database in a separate folder on Blob Storage.
- Start LRS separately for each database.
- Specify different paths to separate Blob Storage folders. 

You can start LRS in either *autocomplete* or *continuous* mode. When you start it in autocomplete mode, the migration will finish automatically when the last of the specified backup files has been restored. When you start LRS in continuous mode, the service will continuously restore any new backup files added, and the migration will finish on the manual cutover only. 

We recommend that you manually cut over after the final log-tail backup has been taken and is shown as restored on SQL Managed Instance. The final cutover step will make the database come online and available for read and write use on SQL Managed Instance.

After LRS is stopped, either automatically through autocomplete or manually through cutover, you can't resume the restore process for a database that was brought online on SQL Managed Instance. To restore additional backup files after the migration finishes through autocomplete or cutover, you need to delete the database. You also need to restore the entire backup chain from scratch by restarting LRS.

:::image type="content" source="./media/log-replay-service-migrate/log-replay-service-conceptual.png" alt-text="Diagram that explains the Log Replay Service orchestration steps for SQL Managed Instance." border="false":::
	
| Operation | Details |
| :----------------------------- | :------------------------- |
| **1. Copy database backups from SQL Server to Blob Storage**. | Copy full, differential, and log backups from SQL Server to a Blob Storage container by using [AzCopy](../../storage/common/storage-use-azcopy-v10.md) or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). <br /><br />Use any file names. LRS doesn't require a specific file-naming convention.<br /><br />In migrating several databases, you need a separate folder for each database. |
| **2. Start LRS in the cloud**. | You can restart the service with a choice of cmdlets: PowerShell ([start-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/start-azsqlinstancedatabaselogreplay)) or Azure CLI ([az_sql_midb_log_replay_start cmdlets](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_start)). <br /><br /> Start LRS separately for each database that points to a backup folder on Blob Storage. <br /><br /> After you start the service, it will take backups from the Blob Storage container and start restoring them on SQL Managed Instance.<br /><br /> If you started LRS in continuous mode, after all initially uploaded backups are restored, the service will watch for any new files uploaded to the folder. The service will continuously apply logs based on the log sequence number (LSN) chain until it's stopped. |
| **2.1. Monitor the operation's progress**. | You can monitor progress of the restore operation with a choice of cmdlets: PowerShell ([get-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/get-azsqlinstancedatabaselogreplay)) or Azure CLI ([az_sql_midb_log_replay_show cmdlets](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_show)). |
| **2.2. Stop the operation if needed**. | If you need to stop the migration process, you have a choice of cmdlets: PowerShell ([stop-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/stop-azsqlinstancedatabaselogreplay)) or Azure CLI ([az_sql_midb_log_replay_stop](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_stop)). <br /><br /> Stopping the operation will delete the database that you're restoring on SQL Managed Instance. After you stop an operation, you can't resume LRS for a database. You need to restart the migration process from scratch. |
| **3. Cut over to the cloud when you're ready**. | Stop the application and the workload. Take the last log-tail backup and upload it to Azure Blob Storage.<br /><br /> Complete the cutover by initiating an LRS `complete` operation with a choice of cmdlets: PowerShell ([complete-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/complete-azsqlinstancedatabaselogreplay)) or Azure CLI [az_sql_midb_log_replay_complete](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_complete). This operation will stop LRS and cause the database to come online for read and write use on SQL Managed Instance.<br /><br /> Repoint the application connection string from SQL Server to SQL Managed Instance. You will need to orchestrate this step yourself, either through a manual connection string change in your application, or automatically (e.g. if your application can, for example, read the connection string from a property, or a database). |

## Requirements for getting started

### SQL Server side
- SQL Server 2008-2019
- Full backup of databases (one or multiple files)
- Differential backup (one or multiple files)
- Log backup (not split for a transaction log file)
- `CHECKSUM` enabled for backups (mandatory)

### Azure side
- PowerShell Az.SQL module version 2.16.0 or later ([installed](https://www.powershellgallery.com/packages/Az.Sql/) or accessed through [Azure Cloud Shell](/azure/cloud-shell/))
- Azure CLI version 2.19.0 or later ([installed](/cli/azure/install-azure-cli))
- Azure Blob Storage container provisioned
- Shared access signature (SAS) security token with read and list permissions generated for the Blob Storage container

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
- Plan to complete the migration within 36 hours after you start LRS. This is a grace period that prevents the installation of system-managed software patches.

> [!IMPORTANT]
> - You can't use the database that's being restored through LRS until the migration process finishes. 
> - LRS doesn't support read-only access to databases during the migration.
> - After migration finishes, the migration process is finalized because LRS doesn't support resuming the restore process.

## Steps to execute

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

To manually make full, differential, and log backups of your database on local storage, use the following sample T-SQL scripts. Ensure that the `CHECKSUM` option is enabled, because it's mandatory for LRS.

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

-- Example of how to make a transactional log backup to the local disk
BACKUP LOG [SampleDB]
TO DISK='C:\BACKUP\SampleDB_log.trn'
WITH COMPRESSION, CHECKSUM
GO
```

### Create a storage account

Azure Blob Storage is used as intermediary storage for backup files between SQL Server and SQL Managed Instance. To create a new storage account and a blob container inside the storage account, follow these steps:

1. [Create a storage account](../../storage/common/storage-account-create.md?tabs=azure-portal).
2. [Crete a blob container](../../storage/blobs/storage-quickstart-blobs-portal.md) inside the storage account.

### Copy backups from SQL Server to Blob Storage

In migrating databases to a managed instance by using LRS, you can use the following approaches to upload backups to Blob Storage:
- Using SQL Server native [BACKUP TO URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url) functionality
- Using [AzCopy](../../storage/common/storage-use-azcopy-v10.md) or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer) to upload backups to a blob container
- Using Storage Explorer in the Azure portal

### Make backups from SQL Server directly to Blob Storage
If your corporate and network policies allow it, an alternative is to make backups from SQL Server directly to Blob Storage by using the SQL Server native [BACKUP TO URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url) option. If you can pursue this option, you don't need to make backups on the local storage and upload them to Blob Storage.

As the first step, this operation requires you to generate an SAS authentication token for Blob Storage and then import the token to SQL Server. The second step is to make backups with the `TO URL` option in T-SQL. Ensure that all backups are made with the `CHEKSUM` option enabled.

For reference, the following sample code makes backups to Blob Storage. This example does not include instructions on how to import the SAS token. You can find detailed instructions, including how to generate and import the SAS token to SQL Server, in the tutorial [Use Azure Blob Storage with SQL Server](/sql/relational-databases/tutorial-use-azure-blob-storage-service-with-sql-server-2016#1---create-stored-access-policy-and-shared-access-storage). 

```SQL
-- Example of how to make a full database backup to a URL
BACKUP DATABASE [SampleDB]
TO URL = 'https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>/SampleDB_full.bak'
WITH INIT, COMPRESSION, CHECKSUM
GO
-- Example of how to make a differential database backup to a URL
BACKUP DATABASE [SampleDB]
TO URL = 'https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>/SampleDB_diff.bak'  
WITH DIFFERENTIAL, COMPRESSION, CHECKSUM
GO

-- Example of how to make a transactional log backup to a URL
BACKUP LOG [SampleDB]
TO URL = 'https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>/SampleDB_log.trn'  
WITH COMPRESSION, CHECKSUM
```

### Generate a Blob Storage SAS authentication token for LRS

Azure Blob Storage is used as intermediary storage for backup files between SQL Server and SQL Managed Instance. You need to generate an SAS authentication token, with only list and read permissions, for LRS. The token will enable LRS to access Blob Storage and use the backup files to restore them on SQL Managed Instance. 

Follow these steps to generate the token:

1. Open Storage Explorer from the Azure portal.
2. Expand **Blob Containers**.
3. Right-click the blob container and select **Get Shared Access Signature**.

   :::image type="content" source="./media/log-replay-service-migrate/lrs-sas-token-01.png" alt-text="Screenshot that shows selections for generating an S A S authentication token.":::

4. Select the timeframe for token expiration. Ensure that the token is valid for the duration of your migration.
5. Select the time zone for the token: UTC or your local time.
	
   > [!IMPORTANT]
   > The time zone of the token and your managed instance might mismatch. Ensure that the SAS token has the appropriate time validity, taking time zones into consideration. If possible, set the time zone to an earlier and later time of your planned migration window.
6. Select **Read** and **List** permissions only.

   > [!IMPORTANT]
   > Don't select any other permissions. If you do, LRS won't start. This security requirement is by design.
7. Select **Create**.

   :::image type="content" source="./media/log-replay-service-migrate/lrs-sas-token-02.png" alt-text="Screenshot that shows selections for S A S token expiration, time zone, and permissions, along with the Create button.":::

The SAS authentication is generated with the time validity that you specified. You need the URI version of the token, as shown in the following screenshot.

:::image type="content" source="./media/log-replay-service-migrate/lrs-generated-uri-token.png" alt-text="Screenshot that shows an example of the U R I version of an S A S token.":::

### Copy parameters from the SAS token

Before you use the SAS token to start LRS, you need to understand its structure. The URI of the generated SAS token consists of two parts separated with a question mark (`?`), as shown in this example:

:::image type="content" source="./media/log-replay-service-migrate/lrs-token-structure.png" alt-text="Example U R I for a generated S A S token for Log Replay Service." border="false":::

The first part, starting with `https://` until the question mark (`?`), is used for the `StorageContainerURI` parameter that's fed as in input to LRS. It gives LRS information about the folder where database backup files are stored.

The second part, starting after the question mark (`?`) and going all the way until the end of the string, is the `StorageContainerSasToken` parameter. This is the actual signed authentication token, which is valid for the duration of the specified time. This part does not necessarily need to start with `sp=` as shown in the example. Your case might differ.

Copy the parameters as follows:

1. Copy the first part of the token, starting from `https://` all the way until the question mark (`?`). Use it as the `StorageContainerUri` parameter in PowerShell or the Azure CLI for starting LRS.

   :::image type="content" source="./media/log-replay-service-migrate/lrs-token-uri-copy-part-01.png" alt-text="Screenshot that shows copying the first part of the token.":::

2. Copy the second part of the token, starting from the question mark (`?`) all the way until the end of the string. Use it as the `StorageContainerSasToken` parameter in PowerShell or the Azure CLI for starting LRS.

   :::image type="content" source="./media/log-replay-service-migrate/lrs-token-uri-copy-part-02.png" alt-text="Screenshot that shows copying the second part of the token.":::
   
> [!NOTE]
> Don't include the question mark when you copy either part of the token.

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

PowerShell and CLI clients to start LRS in continuous mode are synchronous. This means that clients will wait for the API response to report on success or failure to start the job. 

During this wait, the command won't return control to the command prompt. If you're scripting the migration experience, and you need the LRS start command to give back control immediately to continue with rest of the script, you can run PowerShell as a background job with the `-AsJob` switch. For example:

```PowerShell
$lrsjob = Start-AzSqlInstanceDatabaseLogReplay <required parameters> -AsJob
```

When you start a background job, a job object returns immediately, even if the job takes an extended time to finish. You can continue to work in the session without interruption while the job runs. For details on running PowerShell as a background job, see the [PowerShell Start-Job](/powershell/module/microsoft.powershell.core/start-job#description) documentation.

Similarly, to start an Azure CLI command on Linux as a background process, use the ampersand (`&`) at the end of the LRS start command:

```CLI
az sql midb log-replay start <required parameters> &
```

> [!IMPORTANT]
> After you start LRS, any system-managed software patches are halted for 36 hours. After this window, the next automated software patch will automatically stop LRS. If that happens, you can't resume migration and need to restart it from scratch. 

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

Functional limitations of LRS are:
- The database that you're restoring can't be used for read-only access during the migration process.
- System-managed software patches are blocked for 36 hours after you start LRS. After this time window expires, the next software update will stop LRS. You then need to restart LRS from scratch.
- LRS requires databases on SQL Server to be backed up with the `CHECKSUM` option enabled.
- The SAS token that LRS will use must be generated for the entire Azure Blob Storage container, and it must have only read and list permissions.
- Backup files for different databases must be placed in separate folders on Blob Storage.
- LRS must be started separately for each database that points to separate folders with backup files on Blob Storage.
- LRS can support up to 100 simultaneous restore processes per single managed instance.

## Troubleshooting

After you start LRS, use the monitoring cmdlet (`get-azsqlinstancedatabaselogreplay` or `az_sql_midb_log_replay_show`) to see the status of the operation. If LRS fails to start after some time and you get an error, check for the most common issues:

- Does an existing database on SQL Managed Instance have the same name as the one you're trying to migrate from SQL Server? Resolve this conflict by renaming one of databases.
- Was the database backup on SQL Server made via theÂ `CHECKSUM` option?
- Are the permissions on the SAS tokenÂ only read and list for LRS?
- Did you copy the SAS token for LRS after the question mark (`?`), with content starting like this: `sv=2020-02-10...`?Â 
- Is the SAS token validity time applicable for the time window of starting and completing the migration? There might be mismatches due to the different time zones used for SQL Managed Instance and the SAS token. Try regenerating the SAS token and extending the token validity of the time window before and after the current date.
- Are the database name, resource group name, and managed instance name spelled correctly?
- If you started LRS in autocomplete mode, was a valid filename for the last backup file specified?

## Next steps
- Learn more about [migrating SQL Server to SQL Managed instance](../migration-guides/managed-instance/sql-server-to-managed-instance-guide.md).
- Learn more about [differences between SQL Server and SQL Managed Instance](transact-sql-tsql-differences-sql-server.md).
- Learn more about [best practices to cost and size workloads migrated to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs).
