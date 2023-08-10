---
title: "Known issues, limitations, and troubleshooting"
titleSuffix: Azure Database Migration Service
description: Known issues, limitations and troubleshooting guide for Azure SQL Migration extension for Azure Data Studio
author: croblesm
ms.author: roblescarlos
ms.date: 04/21/2023
ms.service: dms
ms.topic: troubleshooting
ms.custom: seo-lt-2019
---

# Known issues, limitations, and troubleshooting

Known issues and troubleshooting steps associated with the Azure SQL Migration extension for Azure Data Studio.

> [!IMPORTANT]
> The latest version of Integration Runtime (5.28.8488) prevents access to a network file share on a local host. This security measure will lead to failures when performing migrations to Azure SQL using DMS. Please ensure you run Integration Runtime on a different machine than the network share hosting.

## Error code: 2007 - CutoverFailedOrCancelled 

- **Message**: `Cutover failed or cancelled for database <DatabaseName>. Error details: The restore plan is broken because firstLsn <First LSN> of log backup <URL of backup in Azure Storage container>' is not <= lastLsn <last LSN> of Full backup <URL of backup in Azure Storage container>'. Restore to point in time.`  

- **Cause**: The error might occur due to the backups being placed incorrectly in the Azure Storage container. If the backups are placed in the network file share, this error could also occur due to network connectivity issues.

- **Recommendation**: Ensure the database backups in your Azure Storage container are correct. If you're using network file share, there might be network-related issues and lags that are causing this error. Wait for the process to be completed.

## Error code: 2009 - MigrationRestoreFailed

- **Message**: `Migration for Database 'DatabaseName' failed with error cannot find server certificate with thumbprint.`

- **Cause**: Before migrating data, you need to migrate the certificate of the source SQL Server instance from a database that is protected by Transparent Data Encryption (TDE) to the target Azure SQL Managed Instance or SQL Server on Azure Virtual Machine.

- **Recommendation**: Migrate the TDE certificate to the target instance and retry the process. For more information about migrating TDE-enabled databases, see [Tutorial: Migrate TDE-enabled databases (preview) to Azure SQL in Azure Data Studio](/azure/dms/tutorial-transparent-data-encryption-migration-ads).  


- **Message**: `Migration for Database <DatabaseName> failed with error 'Non retriable error occurred while restoring backup with index 1 - 3169 The database was backed up on a server running version %ls. That version is incompatible with this server, which is running version %ls. Either restore the database on a server that supports the backup, or use a backup that is compatible with this server.`

- **Cause**: Unable to restore a SQL Server backup to an earlier version of SQL Server than the version at which the backup was created.

- **Recommendation**: See [Issues that affect database restoration between different SQL Server versions](/support/sql/admin/backup-restore-operations) for troubleshooting steps.  


- **Message**: `Migration for Database <DatabaseName> failed with error 'The managed instance has reached its storage limit. The storage usage for the managed instance can't exceed 32768 MBs.`

- **Cause**: The Azure SQL Managed Instance has reached its resource limits.

- **Recommendation**: For more information about storage limits, see [Overview of Azure SQL Managed Instance resource limits](/azure/azure-sql/managed-instance/resource-limits).  


- **Message**: `Migration for Database <DatabaseName> failed with error 'Non retriable error occurred while restoring backup with index 1 - 3634 The operating system returned the error '1450(Insufficient system resources exist to complete the requested service.)`

- **Cause**: One of the symptoms listed in [OS errors 1450 and 665 are reported for database files during DBCC CHECKDB or Database Snapshot Creation](/support/sql/admin/1450-and-665-errors-running-dbcc-checkdb#symptoms) can be the cause.

- **Recommendation**: See [OS errors 1450 and 665 are reported for database files during DBCC CHECKDB or Database Snapshot Creation](/support/sql/admin/1450-and-665-errors-running-dbcc-checkdb#symptoms) for troubleshooting steps.  


- **Message**: `The restore plan is broken because firstLsn <First LSN> of log backup <URL of backup in Azure Storage container>' isn't <= lastLsn <last LSN> of Full backup <URL of backup in Azure Storage container>'. Restore to point in time.`

- **Cause**: The error might occur due to the backups being placed incorrectly in the Azure Storage container. If the backups are placed in the network file share, this error could also occur due to network connectivity issues.

- **Recommendation**: Ensure the database backups in your Azure Storage container are correct. If you're using network file share, there might be network related issues and lags that are causing this error. Wait for the process to complete.  


- **Message**: `Migration for Database <Database Name> failed with error 'Non retriable error occurred while restoring backup with index 1 - 3234 Logical file <Name> isn't part of database <Database GUID>. Use RESTORE FILELISTONLY to list the logical file names. RESTORE DATABASE is terminating abnormally.'.`

- **Cause**: You've specified a logical file name that isn't in the database backup. Another potential cause of this error is an incorrect storage account container name.

- **Recommendation**: Run RESTORE FILELISTONLY to check the logical file names in your backup. For more information about RESTORE FILELISTONLY, see [RESTORE Statements - FILELISTONLY (Transact-SQL)](/sql/t-sql/statements/restore-statements-filelistonly-transact-sql).


- **Message**: `Migration for Database <Database Name> failed with error 'Azure SQL target resource failed to connect to storage account. Make sure the target SQL VNet is allowed under the Azure Storage firewall rules.'`

- **Cause**: Azure Storage firewall isn't configured to allow access to Azure SQL target.

- **Recommendation**: For more information about Azure Storage firewall setup, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).

- **Message**: `Migration for Database <Database Name> failed with error 'There are backups from multiple databases in the container folder. Please make sure the container folder has backups from a single database.`

- **Cause**: Backups of multiple databases are in the same container folder.

- **Recommendation**: If migrating multiple databases to **Azure SQL Managed Instance** using the same Azure Blob Storage container, you must place backup files for different databases in separate folders inside the container. For more information about LRS, see [Migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service (Preview)](/azure/azure-sql/managed-instance/log-replay-service-migrate#limitations).

- **Message**: `Migration for Database <Database Name> failed with error 'Non retriable error occurred while restoring backup with index 1 - 12824 The sp_configure value 'contained database authentication' must be set to 1 in order to restore a contained database.  You may need to use RECONFIGURE to set the value_in_use.
RESTORE DATABASE is terminating abnormally.`

- **Cause**: The source database is a contained database. A specific configuration is needed to enable restoring a contained database. For more information about contained databases, see [Contained Database Users](/sql/relational-databases/security/contained-database-users-making-your-database-portable).

- **Recommendation**: Run the following query connected to the source SQL Server in the context of the specific database before starting the migration. Then, attempt the migration of the contained database again.
```sql  
-- Enable "contained database authentication"
EXEC sp_configure 'contained', 1;
RECONFIGURE;
```

> [!NOTE]
> For more information on general troubleshooting steps for Azure SQL Managed Instance errors, see [Known issues with Azure SQL Managed Instance](/azure/azure-sql/managed-instance/doc-changes-updates-known-issues)

## Error code: 2012 - TestConnectionFailed

- **Message**: `Failed to test connections using provided Integration Runtime. Error details: 'Remote name could not be resolved.'`

- **Cause**: Your network settings in the firewall are causing the Self-Hosted Integration Runtime to be unable to connect to the service back end.

- **Recommendation**: There's a Domain Name System (DNS) issue. Contact your network team to fix the issue. For more information, see [Troubleshoot Self-Hosted Integration Runtime](../data-factory/self-hosted-integration-runtime-troubleshoot-guide.md).

- **Message**: `Failed to test connections using provided Integration Runtime. 'Cannot connect to <File share>. Detail Message: The system could not find the environment option that was entered`

- **Cause**: The Self-Hosted Integration Runtime can't connect to the network file share where the database backups are placed.

- **Recommendation**: Make sure your network file share name is entered correctly.

- **Message**: `Failed to test connections using provided Integration Runtime. The file name does not conform to the naming rules by the data store. Illegal characters in path.`

- **Cause**: The Self-Hosted Integration Runtime can't connect to the network file share where the database backups are placed.

- **Recommendation**: Make sure your network file share name is entered correctly.

- **Message**: `Failed to test connections using provided Integration Runtime.`

- **Cause**: Connection to the Self-Hosted Integration Runtime has failed.

- **Recommendation**: See [Troubleshoot Self-Hosted Integration Runtime](../data-factory/self-hosted-integration-runtime-troubleshoot-guide.md) for general troubleshooting steps for Integration Runtime connectivity errors.  


## Error code: 2014 - IntegrationRuntimeIsNotOnline

- **Message**: `Integration Runtime <IR Name> in resource group <Resource Group Name> Subscription <SubscriptionID> isn't online.`

- **Cause**: The Self-Hosted Integration Runtime isn't online.

- **Recommendation**: Make sure the Self-hosted Integration Runtime is registered and online. To perform the registration, you can use scripts from [Automating self-hosted integration runtime installation using local PowerShell scripts](../data-factory/self-hosted-integration-runtime-automation-scripts.md). Also, see [Troubleshoot self-hosted integration runtime](../data-factory/self-hosted-integration-runtime-troubleshoot-guide.md) for general troubleshooting steps for Integration Runtime connectivity errors.  


## Error code: 2030 - AzureSQLManagedInstanceNotReady

- **Message**: `Azure SQL Managed Instance <Instance Name> isn't ready.`

- **Cause**: Azure SQL Managed Instance not in ready state.

- **Recommendation**: Wait until the Azure SQL Managed Instance has finished deploying and is ready, then retry the process.  


## Error code: 2033 - SqlDataCopyFailed

- **Message**: `Migration for Database <Database> failed in state <state>.`

- **Cause**: ADF pipeline for data movement failed.

- **Recommendation**: Check the MigrationStatusDetails page for more detailed error information.  


## Error code: 2038 - MigrationCompletedDuringCancel

- **Message**: `Migration cannot be canceled as Migration was completed during the cancel process. Target server: <Target server> Target database: <Target database>.`

- **Cause**: A cancellation request was received, but the migration was completed successfully before the cancellation was completed.

- **Recommendation**: No action required migration succeeded.  


## Error code: 2039 - MigrationRetryNotAllowed

- **Message**: `Migration isn't in a retriable state. Migration must be in state WaitForRetry. Current state: <State>, Target server: <Target Server>, Target database: <Target database>.`

- **Cause**: A retry request was received when the migration wasn't in a state allowing retrying.

- **Recommendation**: No action required migration is ongoing or completed.  


## Error code: 2040 - MigrationTimeoutWaitingForRetry

- **Message**: `Migration retry timeout limit of 8 hours reached. Target server: <Target Server>, Target database: <Target Database>.`

- **Cause**: Migration was idle in a failed, but retrievable state for 8 hours and was automatically canceled.

- **Recommendation**: No action is required; the migration was canceled.  


## Error code: 2041 - DataCopyCompletedDuringCancel

- **Message**: `Data copy finished successfully before canceling completed. Target schema is in bad state. Target server: <Target Server>, Target database: <Target Database>.`

- **Cause**: Cancel request was received, and the data copy was completed successfully, but the target database schema hasn't been returned to its original state.

- **Recommendation**: If desired, the target database can be returned to its original state by running the first query and all of the returned queries, then running the second query and doing the same. 

```sql  
SELECT [ROLLBACK] FROM [dbo].[__migration_status] 
WHERE STEP in (3,4,6);

SELECT [ROLLBACK] FROM [dbo].[__migration_status]  
WHERE STEP in (5,7,8) ORDER BY STEP DESC;
```
  

## Error code: 2042 - PreCopyStepsCompletedDuringCancel 

- **Message**: `Pre Copy steps finished successfully before canceling completed. Target database Foreign keys and temporal tables have been altered. Schema migration may be required again for future migrations. Target server: <Target Server>, Target database: <Target Database>.`

- **Cause**: Cancel request was received and the steps to prepare the target database for copy were completed successfully. The target database schema hasn't been returned to its original state.

- **Recommendation**: If desired, target database can be returned to its original state by running the following query and all of the returned queries. 

```sql  
SELECT [ROLLBACK] FROM [dbo].[__migration_status]  
WHERE STEP in (3,4,6);
```

## Error code: 2043 - CreateContainerFailed

- **Message**: `Create container <ContainerName> failed with error Error calling the endpoint '<URL>'. Response status code: 'NA - Unknown'. More details: Exception message: 'NA - Unknown [ClientSideException] Invalid Url:<URL>.`

- **Cause**: The request failed due to an underlying issue such as network connectivity, a DNS failure, a server certificate validation, or a timeout.

- **Recommendation**: For more troubleshooting steps, see [Troubleshoot Azure Data Factory and Synapse pipelines](../data-factory/data-factory-troubleshoot-guide.md#error-code-2108). 


## Error code: 2049 - FileShareTestConnectionFailed

- **Message**: `The value of the property '' is invalid: 'Access to <share path> is denied, resolved IP address is <IP address>, network type is OnPremise'.`

- **Cause**: The network share where the database backups are stored is in the same machine as the self-hosted Integration Runtime (SHIR).

- **Recommendation**: The latest version of Integration Runtime (**5.28.8488**) prevents access to a network file share on a local host. Ensure you run Integration Runtime on a different machine than the network share hosting. If hosting the self-hosted Integration Runtime and the network share on different machines isn't possible with your current migration setup, you can use the option to opt out using ```DisableLocalFolderPathValidation```. 
    > [!NOTE]
    > For more information, see [Set up an existing self-hosted IR via local PowerShell](../data-factory/create-self-hosted-integration-runtime.md#set-up-an-existing-self-hosted-ir-via-local-powershell). Use the disabling option with discretion as this is less secure.


## Error code: 2056 - SqlInfoValidationFailed

- **Message**: CollationMismatch: `Source database collation <CollationOptionSource> is not the same as the target database <CollationOptionTarget>. Source database: <SourceDatabaseName> Target database: <TargetDatabaseName>.`

- **Cause**: The source database collation isn't the same as the target database's collation.

- **Recommendation**: Make sure to change the target Azure SQL Database collation to the same as the source SQL Server database. Azure SQL Database uses `SQL_Latin1_General_CP1_CI_AS` collation by default, in case your source SQL Server database uses a different collation you might need to re-create or select a different target database whose collation matches. For more information, see [Collation and Unicode support](/sql/relational-databases/collations/collation-and-unicode-support)


- **Message**: DatabaseSizeMoreThanMax: No tables were found in the target Azure SQL Database. Check if schema migration was completed beforehand.

- **Cause**: The selected tables for the migration don't exist in the target Azure SQL Database.

- **Recommendation**: Make sure the target database schema was created before starting the migration. For more information on how to deploy the target database schema, see [SQL Database Projects extension](/sql/azure-data-studio/extensions/sql-database-project-extension)

- **Message**: DatabaseSizeMoreThanMax: `The source database size <Source Database Size> exceeds the maximum allowed size of the target database <Target Database Size>. Check if the target database has enough space.`

- **Cause**: The target database doesn't have enough space.

- **Recommendation**: Make sure the target database schema was created before starting the migration. For more information on how to deploy the target database schema, see [SQL Database Projects extension](/sql/azure-data-studio/extensions/sql-database-project-extension).

- **Message**: NoTablesFound: `Some of the source tables don't exist in the target database. Missing tables: <TableList>`.

- **Cause**: The selected tables for the migration don't exist in the target Azure SQL Database.

- **Recommendation**: Check if the selected tables exist in the target Azure SQL Database. If this migration is called from a PowerShell script, check if the table list parameter includes the correct table names and is passed into the migration.

  
- **Message**: SqlVersionOutOfRange: `Source instance version is lower than 2008, which is not supported to migrate. Source instance: <InstanceName>`.

- **Cause**: Azure Database Migration Service doesn't support migrating from SQL Server instances lower than 2008.

- **Recommendation**: Upgrade your source SQL Server instance to a newer version of SQL Server. For more information, see [Upgrade SQL Server](/sql/database-engine/install-windows/upgrade-sql-server)


- **Message**: TableMappingMismatch: `Some of the source tables don't exist in the target database. Missing tables: <TableList>`.

- **Cause**: The selected tables for the migration don't exist in the target Azure SQL Database.

- **Recommendation**: Check if the selected tables exist in the target Azure SQL Database. If this migration is called from a PowerShell script, check if the table list parameter includes the correct table names and is passed into the migration.

## Error code: Ext_RestoreSettingsError

- **Message**: Unable to read blobs in storage container, exception: The remote server returned an error: (403) Forbidden.; The remote server returned an error: (403) Forbidden

- **Cause**: The Azure SQL target is unable to connect to blob storage.

- **Recommendation**: Confirm that target network settings allow access to blob storage.  For example, if you're migrating to a SQL Server on Azure VM target, ensure that outbound connections on the Virtual Machine aren't being blocked.


- **Message**: Failed to create restore job. Unable to read blobs in storage container, exception: The remote name couldn't be resolved.

- **Cause**: The Azure SQL target is unable to connect to blob storage.

- **Recommendation**: Confirm that target network settings allow access to blob storage.  For example, if migrating to SQL VM, ensure that outbound connections on VM aren't being blocked.


- **Message**: `Migration for Database <Database Name> failed with error 'Migration cannot be completed because provided backup file name <Backup File Name> should be the last restore backup file <Last Restore Backup File Name>'`.

- **Cause**: The most recent backup wasn't specified in the backup settings.

- **Recommendation**: Specify the most recent backup file name in backup settings and retry the operation.


- **Message**: `Operation failed: errorCode: Ext_RestoreSettingsError, message: RestoreId: 1111111-aaaa-bbbb-cccc-dddddddd, OperationId: 2222222-aaaa-bbbb-cccc-dddddddd, Detail: Unable to read blobs in storage container, exception: Unable to connect to the remote server;Unable to connect to the remote server;A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond 11.111.11.111:443.`

- **Cause**: The error is possible to occur for both storage accounts with public network and private endpoint configuration. It's also possible that you have an on-premises DNS server that controls a hybrid network routing and DHCP. Unless you allow the Azure IP addresses configured in your DNS server, your SQL Server on Azure VM target has no chance to resolve the remote storage blob endpoint.

- **Recommendation**: To debug this issue, you can try pinging your Azure Blob Storage URL from your SQL Server on Azure VM target and confirm if you have a connectivity problem. To solve this issue, you have to allow the Azure IP addresses configured in your DNS server. For more information, see [Troubleshoot Azure Private Endpoint connectivity problems](/azure/private-link/troubleshoot-private-endpoint-connectivity)

## Azure SQL Database limitations 

Migrating to Azure SQL Database by using the Azure SQL extension for Azure Data Studio has the following limitations: 

[!INCLUDE [sql-db-limitations](includes/sql-database-limitations.md)]

## Azure SQL Managed Instance limitations 

Migrating to Azure SQL Managed Instance by using the Azure SQL extension for Azure Data Studio has the following limitations: 

[!INCLUDE [sql-mi-limitations](includes/sql-managed-instance-limitations.md)]

## SQL Server on Azure VMs limitations 

Migrating to SQL Server on Azure VMs by using the Azure SQL extension for Azure Data Studio has the following limitations: 

[!INCLUDE [sql-vm-limitations](includes/sql-virtual-machines-limitations.md)]

## Azure Data Studio Limitations

### Failed to start Sql Migration Service: Error: Request error: 

- **Message**: `Error at ClientRequest.<anonymous> (c:\Users\MyUser\.azuredatastudio\extensions\microsoft.sql-migration-1.4.2\dist\main.js:2:7448) at ClientRequest.emit (node:events:538:35) at TLSSocket.socketOnEnd (node:_http_client:466:9) at TLSSocket.emit (node:events:538:35) at endReadableNT (node:internal/streams/readable:1345:12) at process.processTicksAndRejections (node:internal/process/task_queues:83:21)`
- **Cause**: This issue occurs when Azure Data Studio isn't able to download the MigrationService package from https://github.com/microsoft/sqltoolsservice/releases. The download failure can be due to disconnected network work or unresolved proxy settings. 
- **Recommendation**: The sure fire way of solving this issue is by downloading the package manually. Follow the mitigation steps outlined in this link: https://github.com/microsoft/azuredatastudio/issues/22558#issuecomment-1496307891

## Next steps

- For an overview and installation of the Azure SQL migration extension, see [Azure SQL migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension)
- For more information on known limitations with Log Replay Service,  see [Migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service (Preview)](/azure/azure-sql/managed-instance/log-replay-service-migrate#limitations)
- For more information on SQL Server on Virtual machine resource limits, see [Checklist: Best practices for SQL Server on Azure VMs](/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-checklist)