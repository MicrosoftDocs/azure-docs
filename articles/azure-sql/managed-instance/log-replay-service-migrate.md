---
title: Migrate databases to SQL Managed Instance using Log Replay Service
description: Learn how to migrate databases from SQL Server to SQL Managed Instance using Log Replay Service
services: sql-database
ms.service: sql-managed-instance
ms.custom: seo-lt-2019, sqldbrb=1
ms.topic: how-to
author: danimir
ms.author: danil
ms.reviewer: sstein
ms.date: 03/01/2021
---

# Migrate databases from SQL Server to SQL Managed Instance using Log Replay Service (Preview)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article explains how to manually configure database migration from SQL Server 2008-2019 to SQL Managed Instance using Log Replay Service (LRS) currently in public preview. This is a cloud service enabled for Managed Instance based on the SQL Server log shipping technology. LRS should be used in cases when there exist complex custom migrations and hybrid architectures, when more control is needed, when there exists little tolerance for downtime, or when Azure Data Migration Service (DMS) cannot be used.

Both DMS and LRS use the same underlying migration technology and the same APIs. With releasing LRS, we are further enabling complex custom migrations and hybrid architecture between on-prem. SQL Server and SQL Managed Instances.

## When to use Log Replay Service

In cases that [Azure DMS](/azure/dms/tutorial-sql-server-to-managed-instance.md) cannot be used for migration, LRS cloud service can be used directly with PowerShell, CLI cmdlets, or API, to manually build and orchestrate database migrations to SQL Managed Instance. 

You might want to consider using LRS cloud service in some of the following cases:
- More control is needed for your database migration project
- There exists a little tolerance for downtime on migration cutover
- DMS executable cannot be installed in your environment
- DMS executable does not have file access to database backups
- No access to host OS is available, or no Administrator privileges
- Unable to open networking ports from your environment to Azure
- Backups are stored directly to Azure Blob Storage using TO URL option
- There exists a need to use differential backups

> [!NOTE]
> Recommended automated way to migrate databases from SQL Server to SQL Managed Instance is using Azure DMS. This service is using the same LRS cloud service at the back end with log shipping in NORECOVERY mode. You should consider manually using LRS to orchestrate migrations in cases when Azure DMS does not fully support your scenarios.

## How does it work

Building a custom solution using LRS to migrate databases to the cloud requires several orchestration steps shown in the diagram and outlined in the table below.

The migration consists of making full database backups on SQL Server with CHECKSUM enabled, and copying backup files to Azure Blob Storage. LRS is used to restore backup files from Azure Blob Storage to SQL Managed Instance. Azure Blob Storage is used as an intermediary storage between SQL Server and SQL Managed Instance.

LRS will monitor Azure Blob Storage for any new differential, or log backups added after the full backup has been restored, and will automatically restore any new files added. The progress of backup files being restored on SQL Managed Instance can be monitored using the service, and the process can also be aborted if necessary.

LRS does not require a specific backup file naming convention as it scans all files placed on Azure Blob Storage and it constructs the backup chain from reading the file headers only. Databases are in "restoring" state during the migration process, as they are restored in [NORECOVERY](https://docs.microsoft.com/sql/t-sql/statements/restore-statements-transact-sql#comparison-of-recovery-and-norecovery) mode, and cannot be used for reading or writing until the migration process has been fully completed. 

In migrating several databases, backups for each database need to be placed in a separate folder on Azure Blob Storage. LRS has to be started separately for each database and different paths to separate Azure Blob Storage folders needs to be specified. 

LRS can be started in autocomplete, or continuous mode. When started in autocomplete mode, the migration will complete automatically when the last backup file name specified has been restored. When started in continuous mode, the service will continuously restore any new backup files added, and the migration will complete on the manual cutover only. It is recommended that the manual cutover is executed only after the final log-tail backup has been taken and shown as restored on SQL Managed Instance. The final cutover step will make the database come online and available for read and write use on SQL Managed Instance.

Once LRS is stopped, either automatically on autocomplete, or manually on cutover, the restore process cannot be resumed for a database that was brought online on SQL Managed Instance. To restore additional backup files once the migration was completed through autocomplete, or manually on cutover, the database needs to be deleted and the entire backup chain needs to be restored from scratch by restarting the LRS.

   :::image type="content" source="./media/log-replay-service-migrate/log-replay-service-conceptual.png" alt-text="Log Replay Service orchestration steps explained for SQL Managed Instance" border="false":::
	
| Operation | Details |
| :----------------------------- | :------------------------- |
| **1. Copy database backups from SQL Server to Azure Blob Storage**. | - Copy full, differential, and log backups from SQL Server to Azure Blob Storage container using [Azcopy](/azure/storage/common/storage-use-azcopy-v10), or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). <br />- Use any file names, as LRS does not require a specific file naming convention.<br />- In migrating several databases, a separate folder is required for each database. |
| **2. Start the LRS service in the cloud**. | - Service can be started with a choice of cmdlets: <br /> PowerShell [start-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/start-azsqlinstancedatabaselogreplay) <br /> CLI [az_sql_midb_log_replay_start cmdlets](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_start). <br /> - Start LRS separately for each different database pointing to a different backup folder on Azure Blob Storage. <br />- Once started, the service will take backups from the Azure Blob Storage container and start restoring them on SQL Managed Instance.<br /> - In case LRS was started in continuous mode, once all initially uploaded backups are restored, the service will watch for any new files uploaded to the folder and will continuously apply logs based on the LSN chain, until the service is stopped. |
| **2.1. Monitor the operation progress**. | - Progress of the restore operation can be monitored with a choice of or cmdlets: <br /> PowerShell [get-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/get-azsqlinstancedatabaselogreplay) <br /> CLI [az_sql_midb_log_replay_show cmdlets](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_show). |
| **2.2. Stop\abort the operation if needed**. | - In case that migration process needs to be aborted, the operation can be stopped with a choice of cmdlets: <br /> PowerShell [stop-azsqlinstancedatabaselogreplay]/powershell/module/az.sql/stop-azsqlinstancedatabaselogreplay) <br /> CLI [az_sql_midb_log_replay_stop](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_stop) cmdlets. <br /><br />- This will result in deletion of the database being restored on SQL Managed Instance. <br />- Once stopped, LRS cannot be resumed for a database. Migration process has to be restarted from scratch. |
| **3. Cutover to the cloud when ready**. | - Stop the application and the workload. Take the last log-tail backup and upload to Azure Blob Storage.<br /> - Complete the cutover by initiating LRS complete operation with a choice of cmdlets: <br />PowerShell [complete-azsqlinstancedatabaselogreplay](/powershell/module/az.sql/complete-azsqlinstancedatabaselogreplay) <br /> CLI [az_sql_midb_log_replay_complete](/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_complete) cmdlets. <br /><br />- This will cause LRS service to be stopped and database to come online for read and write use on SQL Managed Instance.<br /> - Repoint the application connection string from SQL Server to SQL Managed Instance. |

## Requirements for getting started

### SQL Server side
- SQL Server 2008-2019
- Full backup of databases (one or multiple files)
- Differential backup (one or multiple files)
- Log backup (not split for transaction log file)
- **CHECKSUM must be enabled** for backups (mandatory)

### Azure side
- PowerShell Az.SQL module version 2.16.0, or above ([install](https://www.powershellgallery.com/packages/Az.Sql/), or use Azure [Cloud Shell](/azure/cloud-shell/))
- CLI version 2.19.0, or above ([install](/cli/azure/install-azure-cli))
- Azure Blob Storage container provisioned
- SAS security token with **Read** and **List** only permissions generated for the blob storage container

### Migrating multiple databases
- Backup files for different databases must be placed in separate folders on Azure Blob Storage.
- LRS has to be started separately for each database pointing to an appropriate folder on Azure Blob Storage.
- LRS can support up to 100 simultaneous restore processes per single SQL Managed Instance.

### Azure RBAC permissions required
Executing LRS through the provided clients requires one of the following Azure roles:
- Subscription Owner role, or
- [Managed Instance Contributor](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) role, or
- Custom role with the following permission:
  - `Microsoft.Sql/managedInstances/databases/*`

## Best practices

The following are highly recommended as best practices:
- Run [Data Migration Assistant](/sql/dma/dma-overview) to validate your databases are ready to be migrated to SQL Managed Instance. 
- Split full and differential backups into multiple files, instead of a single file.
- Enable backup compression.
- Use Cloud Shell to execute scripts as it will always be updated to the latest cmdlets released.
- Plan to complete the migration within 47 hours since LRS service has been started. This is a grace period preventing system-managed software patches once LRS has been started.

> [!IMPORTANT]
> - Database being restored using LRS cannot be used until the migration process has been completed.
> - Read-only access to databases during the migration is not supported by LRS.
> - Once migration has been completed, the migration process is finalized as LRS does not support restore resume.

## Steps to execute

### Make backups on the SQL Server

Backups on the SQL Server can be made with either of the following two options:

- Backup to the local disk storage, then upload files to Azure Blob Storage, in case your environment is restrictive of direct backup to Azure Blob Storage.
- Backup directly to Azure Blob Storage with "TO URL" option in T-SQL, in case your environment and security procedures allow you to do so. 

Set databases you wish to migrate to the full recovery mode to allow log backups.

```SQL
-- To permit log backups, before the full database backup, modify the database to use the full recovery
USE master
ALTER DATABASE SampleDB
SET RECOVERY FULL
GO
```

To manually make full, diff and log backup of your database on the local storage, use the provided sample T-SQL scripts below. Ensure that CHECKSUM option is enabled as this is a mandatory requirement for LRS.

```SQL
-- Example on how to make full database backup to the local disk
BACKUP DATABASE [SampleDB]
TO DISK='C:\BACKUP\SampleDB_full.bak'
WITH INIT, COMPRESSION, CHECKSUM
GO

-- Example on how to make differential database backup to the locak disk
BACKUP DATABASE [SampleDB]
TO DISK='C:\BACKUP\SampleDB_diff.bak'
WITH DIFFERENTIAL, COMPRESSION, CHECKSUM
GO

-- Example on how to make the transactional log backup to the local disk
BACKUP LOG [SampleDB]
TO DISK='C:\BACKUP\SampleDB_log.trn'
WITH COMPRESSION, CHECKSUM
GO
```

### Create Azure Blob storage

Azure Blob Storage is used as an intermediary storage for backup files between SQL Server and SQL Managed Instance. To create a new storage account and a blob container inside the storage account, follow these steps:

1. [Create a storage account](../../storage/common/storage-account-create.md?tabs=azure-portal)
2. [Crete a blob container](../../storage/blobs/storage-quickstart-blobs-portal.md) inside the storage account

### Copy backups from SQL Server to Azure Blob Storage

Some of the following approaches can be utilized to upload backups to the blob storage in migrating databases to managed instance using LRS:
- Using [Azcopy](/azure/storage/common/storage-use-azcopy-v10), or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer) to upload backups to a blob container.
- Using Storage Explorer in Azure portal.

### Make backups from SQL Server directly to Azure Blob Storage

In case your corporate and networking policy allows it, the alternative way is to make backups from SQL Server directly to Azure Blob Storage using SQL Server native [BACKUP TO URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url) option. If you can pursue this option, making backups on the local storage and uploading them to Azure Blob Storage is not needed.

As the first step, this operation requires SAS authentication token to be generated for the Azure Blob Storage, and the token needs to be imported to the SQL Server. The second step is to make backups with "TO URL" option in T-SQL. Ensure that all backups are made with CHEKSUM option enabled.

For reference, sample code to make backups to Azure Blob Storage is provided below. This example does not include instructions on how to import the SAS token. Detailed instructions, including how to generate and import the SAS token to SQL Server are provided in the following tutorial: [Use Azure Blob storage service with SQL Server](/sql/relational-databases/tutorial-use-azure-blob-storage-service-with-sql-server-2016#1---create-stored-access-policy-and-shared-access-storage). 

```SQL
-- Example on how to make full database backup to URL
BACKUP DATABASE [SampleDB]
TO URL = 'https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>/SampleDB_full.bak'
WITH INIT, COMPRESSION, CHECKSUM
GO

-- Example on how to make differential database backup to URL
BACKUP DATABASE [SampleDB]
TO URL = 'https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>/SampleDB_diff.bak'  
WITH DIFFERENTIAL, COMPRESSION, CHECKSUM
GO

-- Example on how to make the transactional log backup to URL
BACKUP LOG [SampleDB]
TO URL = 'https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>/SampleDB_log.trn'  
WITH COMPRESSION, CHECKSUM
```

### Generate Azure Blob Storage SAS authentication for LRS

Azure Blob Storage is used as an intermediary storage for backup files between SQL Server and SQL Managed Instance. SAS authentication token with List and Read only permissions needs to be generated for use by LRS service. This will enable LRS service to access the Azure Blob Storage and use the backup files to restore them on SQL Managed Instance. Follow these steps to generate SAS authentication for LRS use:

1. Access the Storage Explorer from Azure portal

2. Expand Blob Containers

3. Right click on the blob container and select Get Shared Access Signature

   :::image type="content" source="./media/log-replay-service-migrate/lrs-sas-token-01.png" alt-text="Log Replay Service - Get Shared Access Signature":::

4. Select the token expiry timeframe. Ensure the token is valid for duration of your migration.

5. Select the time zone for the token - UTC or your local time

   - Time zone of the token and your SQL Managed Instance might mismatch. Ensure that SAS token has the appropriate time validity taking time zones into consideration. If possible, set the time zone to an earlier and later time of your planned migration window.

6. Select Read and List only permissions only

   - No other permissions must be selected, or otherwise LRS will not be able to start. This security requirement is by design.

7. Click in Create button

   :::image type="content" source="./media/log-replay-service-migrate/lrs-sas-token-02.png" alt-text="Log Replay Service - generate SAS authentication token":::

   SAS authentication will be generated with the time validity that you have specified earlier. You will need the URI version of the token generated - as shown in the screenshot below.

   :::image type="content" source="./media/log-replay-service-migrate/lrs-generated-uri-token.png" alt-text="Log Replay Service - copy the URI shared access signature":::

### Copy parameters from SAS token generated

To be able to properly use the SAS token to start LRS, we need to understand its structure. The URI of the SAS token generated consists of two parts:
- StorageContainerUri, and 
- StorageContainerSasToken, separated with a question mark (?), as shown in the image below.

   :::image type="content" source="./media/log-replay-service-migrate/lrs-token-structure.png" alt-text="Log Replay Service generated SAS authentication URI example" border="false":::

- The first part starting with "https://" until the question mark (?) is used for the StorageContainerURI parameter that is fed as in input to LRS. This gives LRS information about the folder where database backup files are stored.
- The second part, starting after the question mark (?), in the example "sp=" and all the way until the end of the string is StorageContainerSasToken parameter. This is the actual signed authentication token, valid for the duration of the time specified. This part does not necessarily need to start with "sp=" as shown, and that your case might differ.

Copy parameters as follows:

1. Copy the first part of the token starting from https:// all the way until the question mark (?) and use it as StorageContainerUri parameter in PowerShell or CLI for starting LRS, as shown in the screenshot below.

   :::image type="content" source="./media/log-replay-service-migrate/lrs-token-uri-copy-part-01.png" alt-text="Log Replay Service copy StorageContainerUri parameter":::

2. Copy the second part of the token starting from question mark (?), all the way until the end of the string, and use it as StorageContainerSasToken parameter in PowerShell or CLI for starting LRS, as shown in the screenshot below.

   :::image type="content" source="./media/log-replay-service-migrate/lrs-token-uri-copy-part-02.png" alt-text="Log Replay Service copy StorageContainerSasToken parameter":::

> [!IMPORTANT]
> - Permissions for the SAS token for Azure Blob Storage need to be Read and List only. If any other permissions are granted for the SAS authentication token, starting LRS service will fail. These security requirements are by design.
> - The token must have the appropriate time validity. Ensure time zones between the token and managed instance are taken into consideration.
> - Ensure that StorageContainerUri parameter for PowerShell or CLI is copied from the URI of the generated token, starting from https:// until the questions mark (?). Do not include the question mark.
> Ensure that StorageContainerSasToken parameter for PowerShell of CLI is copied from the URI of the generated token, starting from the question mark (?), until the end of the string. Do not include the question mark.

### Log in to Azure and select subscription

Use the following PowerShell cmdlet to log in to Azure:

```powershell
Login-AzAccount
```

Select the appropriate subscription where your SQL Managed Instance resides using the following PowerShell cmdlet:

```powershell
Select-AzSubscription -SubscriptionId <subscription ID>
```

## Start the migration

The migration is started by starting the LRS service. The service can be started in autocomplete, or continuous mode. When started in autocomplete mode, the migration will complete automatically when the last backup file specified has been restored. This option requires the start command to specify the filename of the last backup file. When LRS is started in continuous mode, the service will continuously restore any new backup files added, and the migration will complete on the manual cutover only. 

### Start LRS in autocomplete mode

To start LRS service in autocomplete mode, use the following PowerShell, or CLI commands. Specify the last backup file name with -LastBackupName parameter. Upon restoring the last backup file name specified, the service will automatically initiate a cutover.

Start LRS in autocomplete mode - PowerShell example:

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

Start LRS in autocomplete mode - CLI example:

```CLI
az sql midb log-replay start -g mygroup --mi myinstance -n mymanageddb -a --last-bn "backup.bak"
	--storage-uri "https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>"
	--storage-sas "sv=2019-02-02&ss=b&srt=sco&sp=rl&se=2023-12-02T00:09:14Z&st=2019-11-25T16:09:14Z&spr=https&sig=92kAe4QYmXaht%2Fgjocqwerqwer41s%3D"
```

### Start LRS in continuous mode

Start LRS in continuous mode - PowerShell example:

```PowerShell
Start-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName" `
	-Collation "SQL_Latin1_General_CP1_CI_AS" -StorageContainerUri "https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>" `
	-StorageContainerSasToken "sv=2019-02-02&ss=b&srt=sco&sp=rl&se=2023-12-02T00:09:14Z&st=2019-11-25T16:09:14Z&spr=https&sig=92kAe4QYmXaht%2Fgjocqwerqwer41s%3D"
```

Start LRS in continuous mode - CLI example:

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
> Once LRS has been started, any system managed software patches will be halted for the next 47 hours. Upon passing of this window, the next automated software patch will automatically stop the ongoing LRS. In such case, migration cannot be resumed and it needs to be restarted from scratch. 

## Monitor the migration progress

To monitor the migration operation progress, use the following PowerShell command:

```PowerShell
Get-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName"
```

To monitor the migration operation progress, use the following CLI command:

```CLI
az sql midb log-replay show -g mygroup --mi myinstance -n mymanageddb
```

## Stop the migration

In case you need to stop the migration, use the following cmdlets. Stopping the migration will delete the restoring database on SQL Managed Instance due to which it will not be possible to resume the migration.

To stop\abort the migration process, use the following PowerShell command:

```PowerShell
Stop-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName"
```

To stop\abort the migration process, use the following CLI command:

```CLI
az sql midb log-replay stop -g mygroup --mi myinstance -n mymanageddb
```

## Complete the migration (continuous mode)

In case LRS is started in continuous mode, once you have ensured that all backups have been restored, initiating the cutover will complete the migration. Upon cutover completion, database will be migrated and ready for read and write access.

To complete the migration process in LRS continuous mode, use the following PowerShell command:

```PowerShell
Complete-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
-InstanceName "ManagedInstance01" `
-Name "ManagedDatabaseName" `
-LastBackupName "last_backup.bak"
```

To complete the migration process in LRS continuous mode, use the following CLI command:

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

Once you start the LRS, use the monitoring cmdlets (get-azsqlinstancedatabaselogreplay or az_sql_midb_log_replay_show) to see the status of the operation. If after some time LRS fails to start with an error, check for some of the most common issues:
- Does there already exists a database with the same name on SQL MI that you are trying to migrate from SQL Server? Resolve this conflict by renaming one of databases.
- Was the database backup on the SQL Server made using the **CHECKSUM** option?
- Are the permissions on the SAS token **Read** and **List** only for the LRS service?
- Was the SAS token for LRS copied starting after the question mark "?" with content starting similar to this "sv=2020-02-10..."? 
- Is the SAS **token validity** time applicable for the time window of starting and completing the migration? There could be mismatches due to the different **time zones** used for SQL Managed Instance and the SAS token. Try regenerating the SAS token with extending the token validity of the time window before and after the current date.
- Are database name, resource group name, and managed instance name spelled correctly?
- If LRS was started in autocomplete mode, was a valid filename for the last backup file specified?

## Next steps
- Learn more about [Migrate SQL Server to SQL Managed instance](../migration-guides/managed-instance/sql-server-to-managed-instance-guide.md).
- Learn more about [Differences between SQL Server and Azure SQL Managed Instance](transact-sql-tsql-differences-sql-server.md).
- Learn more about [Best practices to cost and size workloads migrated to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs).
