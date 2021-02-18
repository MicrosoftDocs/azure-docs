---
title: Migrate databases to SQL Managed Instance using Log Replay Service
description: Learn how to migrate databases from SQL Server to SQL Managed Instance using Log Replay Service
services: sql-database
ms.service: sql-managed-instance
ms.custom: seo-lt-2019, sqldbrb=1
ms.devlang: 
ms.topic: how-to
author: danimir
ms.author: danil
ms.reviewer: sstein
ms.date: 02/17/2021
---

# Migrate databases from SQL Server to SQL Managed Instance using Log Replay Service
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article explains how to manually configure database migration from SQL Server 2008-2019 to SQL Managed Instance using Log Replay Service (LRS). This is a cloud service enabled for Managed Instance based on the SQL Server log shipping technology. LRS should be used in cases when Azure Data Migration Service (DMS) cannot be used, when more control is needed, or when there exists little tolerance for downtime.

## When to use Log Replay Service

In cases that [Azure DMS](https://docs.microsoft.com/azure/dms/tutorial-sql-server-to-managed-instance) cannot be used for migration, LRS cloud service can be used directly with PowerShell, CLI cmdlets, or API, to manually build and orchestrate database migrations to SQL Managed Instance. 

You might want to consider using LRS cloud service in some of the following cases:
- More control is needed for your database migration project
- There exists a little tolerance for downtime on migration cutover
- DMS executable cannot be installed in your environment
- DMS executable does not have file access to database backups
- No access to host OS is available, or no Administrator privileges

> [!NOTE]
> Recommended automated way to migrate databases from SQL Server to SQL Managed Instance is using Azure DMS. This service is using the same LRS cloud service at the back end with log shipping in NORECOVERY mode. You should consider manually using LRS to orchestrate migrations in cases when Azure DMS does not fully support your scenarios.

## How does it work

Building a custom solution using LRS to migrate a database to the cloud requires several orchestration steps shown in the diagram and outlined in the table below.

The migration entails making full database backups on SQL Server and copying backup files to Azure Blob Storage. LRS is used to restore backup files from Azure Blob Storage to SQL Managed Instance. Azure Blob Storage is used as an intermediary storage between SQL Server and SQL Managed Instance.

LRS will monitor Azure Blob Storage for any new differential, or log backups added after the full backup has been restored, and will automatically restore any new files added. The progress of backup files being restored on SQL Managed Instance can be monitored using the service, and the process can also be aborted if necessary. Databases being restored during the migration process will be in a restoring mode and cannot be used to read or write until the process has been completed.

LRS can be started in autocomplete, or continuous mode. When started in autocomplete mode, the migration will complete automatically when the last backup file specified has been restored. When started in continuous mode, the service will continuously restore any new backup files added, and the migration will complete on the manual cutover only. The final cutover step will make databases available for read and write use on SQL Managed Instance. 

  ![Log Replay Service orchestration steps explained for SQL Managed Instance](./media/log-replay-service-migrate/log-replay-service-conceptual.png)

| Operation | Details |
| :----------------------------- | :------------------------- |
| **1. Copy database backups from SQL Server to Azure Blob Storage**. | - Copy full, differential, and log backups from SQL Server to Azure Blob Storage container using [Azcopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10) or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). <br />- In migrating several databases, a separate folder is required for each database. |
| **2. Start the LRS service in the cloud**. | - Service can be started with a choice of cmdlets: <br /> PowerShell [start-azsqlinstancedatabaselogreplay](https://docs.microsoft.com/powershell/module/az.sql/start-azsqlinstancedatabaselogreplay) <br /> CLI [az_sql_midb_log_replay_start cmdlets](https://docs.microsoft.com/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_start). <br /><br />- Once started, the service will take backups from the Azure Blob Storage container and start restoring them on SQLManaged Instance. <br /> - Once all initially uploaded backups are restored, the service will watch for any new files uploaded to the folder and will continuously apply logs based on the LSN chain, until the service is stopped. |
| **2.1. Monitor the operation progress**. | - Progress of the restore operation can be monitored with a choice of or cmdlets: <br /> PowerShell [get-azsqlinstancedatabaselogreplay](https://docs.microsoft.com/powershell/module/az.sql/get-azsqlinstancedatabaselogreplay) <br /> CLI [az_sql_midb_log_replay_show cmdlets](https://docs.microsoft.com/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_show). |
| **2.2. Stop\abort the operation if needed**. | - In case that migration process needs to be aborted, the operation can be stopped with a choice of cmdlets: <br /> PowerShell [stop-azsqlinstancedatabaselogreplay](https://docs.microsoft.com/powershell/module/az.sql/stop-azsqlinstancedatabaselogreplay) <br /> CLI [az_sql_midb_log_replay_stop](https://docs.microsoft.com/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_stop) cmdlets. <br /><br />- This will result in deletion of the being database restored on SQL Managed Instance. <br />- Once stopped, LRS cannot be continued for a database. Migration process needs to be restarted from scratch. |
| **3. Cutover to the cloud when ready**. | - Once all backups have been restored to SQL mnaged instance, complete the cutover by initiating LRS complete operation with a choice of API call, or cmdlets: <br />PowerShell [complete-azsqlinstancedatabaselogreplay](https://docs.microsoft.com/powershell/module/az.sql/complete-azsqlinstancedatabaselogreplay) <br /> CLI [az_sql_midb_log_replay_complete](https://docs.microsoft.com/cli/azure/sql/midb/log-replay#az_sql_midb_log_replay_complete) cmdlets. <br /><br />- This will cause LRS service to be stopped and database on managed instance will be recovered. <br />-	Repoint the application connection string from SQL Server to SQL Managed Instance. <br />- On operation completion database is available for R/W operations in the cloud. |

## Requirements for getting started

### SQL Server side
- SQL Server 2008-2019
- Full backup of databases (one or multiple files)
- Differential backup (one or multiple files)
- Log backup (not split for transaction log file)
- **CHECKSUM must be enabled** for backups (mandatory)

### Azure side
- PowerShell Az.SQL module version 2.16.0, or above ([install](https://www.powershellgallery.com/packages/Az.Sql/), or use Azure [Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/))
- CLI version 2.19.0, or above ([install](https://docs.microsoft.com/cli/azure/install-azure-cli))
- Azure Blob Storage container provisioned
- SAS security token with **Read** and **List** only permissions generated for the blob storage container

## Best practices

The following are highly recommended as best practices:
- Run [Data Migration Assistant](https://docs.microsoft.com/sql/dma/dma-overview) to validate your databases will have no issues being migrated to SQL Managed Instance. 
- Split full and differential backups into multiple files, instead of a single file.
- Enable backup compression.
- Use Cloud Shell to execute scripts as it will always be updated to the latest cmdlets released.
- Plan to complete the migration within 47 hours since LRS service has been started.

> [!IMPORTANT]
> - Database being restored using LRS cannot be used until the migration process has been completed. This is because underlying technology is log shipping in NORECOVERY mode.
> - STANDBY mode for log shipping is not supported by LRS due to the version differences between SQL Managed Instance and latest in-market SQL Server version.

## Steps to execute

## Copy backups from SQL Server to Azure Blob Storage

The following two approaches can be utilized to copy backups to the blob storage in migrating databases to managed instance using LRS:
- Using SQL Server native [BACKUP TO URL](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url) functionality.
- Copying the backups to Blob Container using [Azcopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10), or [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer). 

## Create Azure Blob and SAS authentication token

Azure Blob Storage is used as an intermediary storage for backup files between SQL Server and SQL Managed Instance. Follow these steps to create Azure Blob Storage container:

1. [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-account-create?tabs=azure-portal)
2. [Crete a blob container](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal) inside the storage account

Once a blob container has been created, generate SAS authentication token with Read and List permissions only following these steps:

1. Access storage account using Azure portal
2. Navigate to Storage Explorer
3. Expand Blob Containers
4. Right click on the blob container
5. Select Get Shared Access Signature
6. Select the token expiry timeframe. Ensure the token is valid for duration of your migration.
7. Ensure Read and List only permissions are selected
8. Click create
9. Copy the token starting with "sv=" in the URI for use in your code

> [!IMPORTANT]
> Permissions for the SAS token for Azure Blob Storage need to be Read and List only. In case of any other permissions granted for the SAS authentication token, starting LRS service will fail. These security requirements are by design.

## Log in to Azure and select subscription

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

```powershell
Start-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName" `
	-Collation "SQL_Latin1_General_CP1_CI_AS" `
	-StorageContainerUri "https://test.blob.core.windows.net/testing" `
	-StorageContainerSasToken "sv=2019-02-02&ss=b&srt=sco&sp=rl&se=2023-12-02T00:09:14Z&st=2019-11-25T16:09:14Z&spr=https&sig=92kAe4QYmXaht%2Fgjocqwerqwer41s%3D" `
	-AutoComplete -LastBackupName "last_backup.bak"
```

Start LRS in autocomplete mode - CLI example:

```cli
az sql midb log-replay start -g mygroup --mi myinstance -n mymanageddb -a --last-bn "backup.bak"
	--storage-uri "https://test.blob.core.windows.net/testing"
	--storage-sas "sv=2019-02-02&ss=b&srt=sco&sp=rl&se=2023-12-02T00:09:14Z&st=2019-11-25T16:09:14Z&spr=https&sig=92kAe4QYmXaht%2Fgjocqwerqwer41s%3D"
```

### Start LRS in continuous mode

Start LRS in continuous mode - PowerShell example:

```powershell
Start-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName" `
	-Collation "SQL_Latin1_General_CP1_CI_AS" -StorageContainerUri "https://test.blob.core.windows.net/testing" `
	-StorageContainerSasToken "sv=2019-02-02&ss=b&srt=sco&sp=rl&se=2023-12-02T00:09:14Z&st=2019-11-25T16:09:14Z&spr=https&sig=92kAe4QYmXaht%2Fgjocqwerqwer41s%3D"
```

Start LRS in continuous mode - CLI example:

```cli
az sql midb log-replay start -g mygroup --mi myinstance -n mymanageddb
	--storage-uri "https://test.blob.core.windows.net/testing"
	--storage-sas "sv=2019-02-02&ss=b&srt=sco&sp=rl&se=2023-12-02T00:09:14Z&st=2019-11-25T16:09:14Z&spr=https&sig=92kAe4QYmXaht%2Fgjocqwerqwer41s%3D"
```

> [!IMPORTANT]
> Once LRS has been started, any system managed software patches will be halted for the next 47 hours. Upon passing of this window, the next automated software patch will automatically stop the ongoing LRS. In such case, migration cannot be resumed and it needs to be restarted from scratch. 

## Monitor the migration progress

To monitor the migration operation progress, use the following PowerShell command:

```powershell
Get-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName"
```

To monitor the migration operation progress, use the following CLI command:

```cli
az sql midb log-replay show -g mygroup --mi myinstance -n mymanageddb
```

## Stop the migration

In case you need to stop the migration, use the following cmdlets. Stopping the migration will delete the restoring database on SQL Managed Instance due to which it will not be possible to resume the migration.

To stop\abort the migration process, use the following PowerShell command:

```powershell
Stop-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
	-InstanceName "ManagedInstance01" `
	-Name "ManagedDatabaseName"
```

To stop\abort the migration process, use the following CLI command:

```cli
az sql midb log-replay stop -g mygroup --mi myinstance -n mymanageddb
```

## Complete the migration (continuous mode)

In case LRS is started in continuous mode, once you have ensured that all backups have been restored, initiating the cutover will complete the migration. Upon cutover completion, database will be migrated and ready for read and write access.

To complete the migration process in LRS continuous mode, use the following PowerShell command:

```powershell
Complete-AzSqlInstanceDatabaseLogReplay -ResourceGroupName "ResourceGroup01" `
-InstanceName "ManagedInstance01" `
-Name "ManagedDatabaseName" `
-LastBackupName "last_backup.bak"
```

To complete the migration process in LRS continuous mode, use the following CLI command:

```cli
az sql midb log-replay complete -g mygroup --mi myinstance -n mymanageddb --last-backup-name "backup.bak"
```

## Next steps
- Learn more about [Migrate SQL Server to SQL Managed instance](../migration-guides/managed-instance/sql-server-to-managed-instance-guide.md).
- Learn more about [Differences between SQL Server and Azure SQL Managed Instance](transact-sql-tsql-differences-sql-server.md).
- Learn more about [Best practices to cost and size workloads migrated to Azure](https://docs.microsoft.com/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs).
