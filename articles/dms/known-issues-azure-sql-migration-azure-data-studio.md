---
title: "Known issues, limitations, and troubleshooting"
titleSuffix: Azure Database Migration Service
description: Known issues, limitations and troubleshooting guide for Azure SQL Migration extension for Azure Data Studio
services: database-migration
author: croblesm
ms.author: roblescarlos
manager: 
ms.reviewer: 
ms.service: dms
ms.workload: data-services
ms.custom: "seo-lt-2019"
ms.topic: troubleshooting
ms.date: 10/19/2022
---

# Known issues, limitations, and troubleshooting

Known issues and limitations associated with the Azure SQL Migration extension for Azure Data Studio.

### Error code: 2007 - CutoverFailedOrCancelled 
- **Message**: `Cutover failed or cancelled for database <DatabaseName>. Error details: The restore plan is broken because firstLsn <First LSN> of log backup <URL of backup in Azure Storage container>' is not <= lastLsn <last LSN> of Full backup <URL of backup in Azure Storage container>'. Restore to point in time.`  

- **Cause**: The error might occur due to the backups being placed incorrectly in the Azure Storage container. If the backups are placed in the network file share, this error could also occur due to network connectivity issues.

- **Recommendation**: Ensure the database backups in your Azure Storage container are correct. If you're using network file share, there might be network-related issues and lags that are causing this error. Wait for the process to be completed.

### Error code: 2009 - MigrationRestoreFailed
- **Message**: `Migration for Database 'DatabaseName' failed with error cannot find server certificate with thumbprint.`

- **Cause**: The source SQL Server instance certificate from a database protected by Transparent Data Encryption (TDE) hasn't been migrated to the target Azure SQL Managed Instance or SQL Server on Azure Virtual Machine before migrating data.

- **Recommendation**: Migrate the TDE certificate to the target instance and retry the process. See [Migrate a certificate of a TDE-protected database to Azure SQL Managed Instance](/azure/azure-sql/managed-instance/tde-certificate-migrate) and [Move a TDE Protected Database to Another SQL Server](/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server) for more information.  


- **Message**: `Migration for Database <DatabaseName> failed with error 'Non retriable error occurred while restoring backup with index 1 - 3169 The database was backed up on a server running version %ls. That version is incompatible with this server, which is running version %ls. Either restore the database on a server that supports the backup, or use a backup that is compatible with this server.`

- **Cause**: Unable to restore a SQL Server backup to an earlier version of SQL Server than the version at which the backup was created.

- **Recommendation**: See [Issues that affect database restoration between different SQL Server versions](/support/sql/admin/backup-restore-operations) for troubleshooting steps.  


- **Message**: `Migration for Database <DatabaseName> failed with error 'The managed instance has reached its storage limit. The storage usage for the managed instance can't exceed 32768 MBs.`

- **Cause**: The Azure SQL Managed Instance has reached its resource limits.

- **Recommendation**: See [Overview of Azure SQL Managed Instance resource limits](/azure/azure-sql/managed-instance/resource-limits) for more information.  


- **Message**: `Migration for Database <DatabaseName> failed with error 'Non retriable error occurred while restoring backup with index 1 - 3634 The operating system returned the error '1450(Insufficient system resources exist to complete the requested service.)`

- **Cause**: One of the symptoms listed in [OS errors 1450 and 665 are reported for database files during DBCC CHECKDB or Database Snapshot Creation](/support/sql/admin/1450-and-665-errors-running-dbcc-checkdb#symptoms) can be the cause.

- **Recommendation**: See [OS errors 1450 and 665 are reported for database files during DBCC CHECKDB or Database Snapshot Creation](/support/sql/admin/1450-and-665-errors-running-dbcc-checkdb#symptoms) for troubleshooting steps.  


- **Message**: `The restore plan is broken because firstLsn <First LSN> of log backup <URL of backup in Azure Storage container>' isn't <= lastLsn <last LSN> of Full backup <URL of backup in Azure Storage container>'. Restore to point in time.`

- **Cause**: The error might occur due to the backups being placed incorrectly in the Azure Storage container. If the backups are placed in the network file share, this error could also occur due to network connectivity issues.

- **Recommendation**: Ensure the database backups in your Azure Storage container are correct. If you're using network file share, there might be network related issues and lags that are causing this error. Wait for the process to complete.  


- **Message**: `Migration for Database <DatabaseName> failed with error 'Full backup <URL of backup in Azure Storage container> is missing checksum. Provide full backup with checksum.'.`

- **Cause**: The database backups haven't been taken with checksum enabled.

- **Recommendation**: See [Enable or disable backup checksums during backup or restore (SQL Server)](/sql/relational-databases/backup-restore/enable-or-disable-backup-checksums-during-backup-or-restore-sql-server) for taking backups with checksum enabled.  


- **Message**: `Migration for Database <Database Name> failed with error 'Non retriable error occurred while restoring backup with index 1 - 3234 Logical file <Name> isn't part of database <Database GUID>. Use RESTORE FILELISTONLY to list the logical file names. RESTORE DATABASE is terminating abnormally.'.`

- **Cause**: You've specified a logical file name that isn't in the database backup.

- **Recommendation**: Run RESTORE FILELISTONLY to check the logical file names in your backup. See [RESTORE Statements - FILELISTONLY (Transact-SQL)](/sql/t-sql/statements/restore-statements-filelistonly-transact-sql) for more information on RESTORE FILELISTONLY.  


- **Message**: `Migration for Database <Database Name> failed with error 'Azure SQL target resource failed to connect to storage account. Make sure the target SQL VNet is allowed under the Azure Storage firewall rules.'`

- **Cause**: Azure Storage firewall isn't configured to allow access to Azure SQL target.

- **Recommendation**: See [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security) for more information on Azure Storage firewall setup.  

    > [!NOTE]
    > For more information on general troubleshooting steps for Azure SQL Managed Instance errors, see [Known issues with Azure SQL Managed Instance](/azure/azure-sql/managed-instance/doc-changes-updates-known-issues)

### Error code: 2012 - TestConnectionFailed
- **Message**: `Failed to test connections using provided Integration Runtime.`

- **Cause**: Connection to the Self-Hosted Integration Runtime has failed.

- **Recommendation**: See [Troubleshoot Self-Hosted Integration Runtime](../data-factory/self-hosted-integration-runtime-troubleshoot-guide.md) for general troubleshooting steps for Integration Runtime connectivity errors.  


### Error code: 2014 - IntegrationRuntimeIsNotOnline
- **Message**: `Integration Runtime <IR Name> in resource group <Resource Group Name> Subscription <SubscriptionID> isn't online.`

- **Cause**: The Self-Hosted Integration Runtime isn't online.

- **Recommendation**: Make sure the Self-hosted Integration Runtime is registered and online. To perform the registration, you can use scripts from [Automating self-hosted integration runtime installation using local PowerShell scripts](../data-factory/self-hosted-integration-runtime-automation-scripts.md). Also, see [Troubleshoot self-hosted integration runtime](../data-factory/self-hosted-integration-runtime-troubleshoot-guide.md) for general troubleshooting steps for Integration Runtime connectivity errors.  


### Error code: 2030 - AzureSQLManagedInstanceNotReady
- **Message**: `Azure SQL Managed Instance <Instance Name> isn't ready.`

- **Cause**: Azure SQL Managed Instance not in ready state.

- **Recommendation**: Wait until the Azure SQL Managed Instance has finished deploying and is ready, then retry the process.  


### Error code: 2033 - SqlDataCopyFailed 
- **Message**: `Migration for Database <Database> failed in state <state>.`

- **Cause**: ADF pipeline for data movement failed.

- **Recommendation**: Check the MigrationStatusDetails page for more detailed error information.  


### Error code: 2038 - MigrationCompletedDuringCancel
- **Message**: `Migration cannot be canceled as Migration was completed during the cancel process. Target server: <Target server> Target database: <Target database>.`

- **Cause**: A cancellation request was received, but the migration was completed successfully before the cancellation was completed.

- **Recommendation**: No action required migration succeeded.  


### Error code: 2039 - MigrationRetryNotAllowed
- **Message**: `Migration isn't in a retriable state. Migration must be in state WaitForRetry. Current state: <State>, Target server: <Target Server>, Target database: <Target database>.`

**Cause**: A retry request was received when the migration wasn't in a state allowing retrying.

- **Recommendation**: No action required migration is ongoing or completed.  


### Error code: 2040 - MigrationTimeoutWaitingForRetry
- **Message**: `Migration retry timeout limit of 8 hours reached. Target server: <Target Server>, Target database: <Target Database>.`

- **Cause**: Migration was idle in a failed, but retriable state for 8 hours and was automatically canceled.

- **Recommendation**: No action is required; the migration was canceled.  


### Error code: 2041 - DataCopyCompletedDuringCancel
- **Message**: `Data copy finished successfully before canceling completed. Target schema is in bad state. Target server: <Target Server>, Target database: <Target Database>.`

- **Cause**: Cancel request was received, and the data copy was completed successfully, but the target database schema hasn't been returned to its original state.

- **Recommendation**: If desired, the target database can be returned to its original state by running the first query below and all of the returned queries, then running the second query and doing the same. 

```
SELECT [ROLLBACK] FROM [dbo].[__migration_status] 
WHERE STEP in (3,4,6);

SELECT [ROLLBACK] FROM [dbo].[__migration_status]  
WHERE STEP in (5,7,8) ORDER BY STEP DESC;
```
  

### Error code: 2042 - PreCopyStepsCompletedDuringCancel 
- **Message**: `Pre Copy steps finished successfully before canceling completed. Target database Foreign keys and temporal tables have been altered. Schema migration may be required again for future migrations. Target server: <Target Server>, Target database: <Target Database>.`

- **Cause**: Cancel request was received and the steps to prepare the target database for copy were completed successfully. The target database schema hasn't been returned to its original state.

- **Recommendation**: If desired, target database can be returned to its original state by running the query below and all of the returned queries. 

```
SELECT [ROLLBACK] FROM [dbo].[__migration_status]  
WHERE STEP in (3,4,6);
```
  

### Error code: 2043 - CreateContainerFailed
- **Message**: `Create container <ContainerName> failed with error Error calling the endpoint '<URL>'. Response status code: 'NA - Unknown'. More details: Exception message: 'NA - Unknown [ClientSideException] Invalid Url:<URL>.`

- **Cause**: The request failed due to an underlying issue such as network connectivity, a DNS failure, a server certificate validation, or a timeout.

- **Recommendation**: See [Troubleshoot Azure Data Factory and Synapse pipelines](../data-factory/data-factory-troubleshoot-guide.md#error-code-2108) for troubleshooting steps.  


## Azure SQL Database Migration limitations

The Azure SQL Database offline migration (Preview) utilizes Azure Data Factory (ADF) pipelines for data movement and thus abides by ADF limitations. A corresponding ADF is created when a database migration service is also created. Thus factory limits apply per service.

- 100,000 table per database limit. 
- 10,000 concurrent database migrations per service. 
- Migration speed heavily depends on the target Azure SQL Database SKU and the self-hosted Integration Runtime host. 
- Azure SQL Database migration scales poorly with table numbers due to ADF overhead in starting activities. If a database has thousands of tables, there will be a couple of seconds of startup time for each, even if they're composed of one row with 1 bit of data. 
- Azure SQL Database table names with double byte characters currently aren't supported for migration.  Mitigation is to rename tables before migration; they can be changed back to their original names after successful migration.
- Tables with large blob columns may fail to migrate due to timeout.
- Database names with SQL Server reserved words aren't valid.

## Azure SQL Managed Instance and SQL Server on Azure Virtual Machine known issues and limitations
- If migrating multiple databases to **Azure SQL Managed Instance** using the same Azure Blob Storage container, you must place backup files for different databases in separate folders inside the container. 
- If migrating a single database to **Azure SQL Managed Instance**, the database backups must be placed in a flat-file structure inside a database folder, and the folders can't be nested, as it's not supported.
- Overwriting existing databases using DMS in your target Azure SQL Managed Instance or SQL Server on Azure Virtual Machine isn't supported.
- Configuring high availability and disaster recovery on your target to match source topology isn't supported by DMS.
- The following server objects aren't supported:
    - Logins
    - SQL Server Agent jobs
    - Credentials
    - SSIS packages
    - Server roles
    - Server audit
- SQL Server 2008 and below as target versions aren't supported when migrating to SQL Server on Azure Virtual Machines.
- If you're using SQL Server 2012 or SQL Server 2014, you need to store your source database backup files on an Azure Storage Blob Container instead of using the network share option. Store the backup files as page blobs since block blobs are only supported in SQL 2016 and after.
- You can't use an existing self-hosted integration runtime created from Azure Data Factory for database migrations with DMS. Initially, the self-hosted integration runtime should be created using the Azure SQL migration extension in Azure Data Studio and can be reused for further database migrations.

## Next steps

- For an overview and installation of the Azure SQL migration extension, see [Azure SQL migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension)
- For more information on known limitations with Log Replay Service,  see [Migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service (Preview)](/azure/azure-sql/managed-instance/log-replay-service-migrate#limitations)
- For more information on SQL Server on Virtual machine resource limits, see [Checklist: Best practices for SQL Server on Azure VMs](/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-checklist)
