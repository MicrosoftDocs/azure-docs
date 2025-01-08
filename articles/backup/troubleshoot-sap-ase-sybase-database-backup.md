---
title: Troubleshooting SAP ASE (Sybase) database backup (preview) using Azure Backup
description: Learn to troubleshoot SAP ASE (Sybase) database backup using Azure Backup.
ms.topic: troubleshooting
ms.date: 11/23/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshooting SAP ASE (Sybase) database backup (preview)

This article provides troubleshooting details for error codes that appears when protecting SAP ASE (Sybase) databases using Azure Backup.

## Common Error Codes

### InvalidInput

**Error code**: `InvalidInput`

**Error message**: Invalid input for one or more parameters was passed.

**Recommended action**: Fix the input and retry the operation. If the issue persists, contact Microsoft support.

### InvalidDatabaseConnectionDetails

**Error code**: InvalidDatabaseConnectionDetails

**Error message**: Invalid database authentication credentials were supplied.

**Recommended action**: Re-run the pre-registration script with resolvable database host name (or) IP address and database user credentials having permissions to perform Backup and restore operations.

### RegistrationFailure

**Error code**: `RegistrationFailure`

**Error message**: Registration failed on the instance.

**Recommended action**: To resolve the issue, follow these steps:

1. Check if the SAP ASE server is running. If not running, start the server.
2. Re-run the pre-registration script with correct instance name, resolvable database host name (or) IP address and database user credentials with permissions to perform Backup and restore operations.

### InvalidLogicalContainerName

**Error code**: `InvalidLogicalContainerName`

**Error message**: Invalid database instance name supplied.

**Recommended action**: Fix the input and retry the operation. If the issue persists, contact Microsoft support.

### ConfigureProtectionFailed

**Error code**: `ConfigureProtectionFailed`

**Error message**: Configure protection operation failed on the instance.

**Recommended action**: To resolve the issue, follow these steps:

1. Check if the database is online.
2. Check if the database  credentials are correct.
3. if the issue still persists,  please contact Microsoft Support for  further assistance.

### InvalidWorkloadType

**Error code**: `InvalidWorkloadType`

**Error message**: Invalid workload type.

**Recommended action**: Fix the input and retry the operation. If the issue persists contact Microsoft support.

### GetPluginVersionError
 
**Error code**: `GetPluginVersionError`

**Error message**: Error while getting plugin version.

**Recommended action**: Retry the operation. If the issue persists contact Microsoft support.

### OperationNotSupportedError

**Error code**: `OperationNotSupportedError`
**Error message**: Restore Inquire Operation Not Supported.

**Recommended action**: No action is required. Contact Microsoft support for further clarifications.

### GeneralPluginException

**Error code**: `GeneralPluginException`

**Error message**: An exception occurred.

**Recommended action**: This is an internal error. For further assistance contact Microsoft Support.

### DatabaseQueryExecutionError

**Error code**: `DatabaseQueryExecutionError`

**Error message**: An ASE exception occurred while running query on database.

**Recommended action**: Check if database is online and retry the operation. If the issue persists, contact Microsoft support.

### ASEBackupServerNotRunning

**Error code**: `ASEBackupServerNotRunning`

**Error message**: ASE backup server isn't running.

**Recommended action**: Check if database is online, backup server is running, and then retry the operation. If the issue persists, contact Microsoft support. 

## Backup error code

### UserErrorASELSNValidationFailure

**Error code**: `UserErrorASELSNValidationFailure`

**Error message**: Log sequence validation failed. Initiating a forced full backup now.

**Recommended action**: Log Sequence Number validation has failed / possible log chain break, a full backup will be performed now to fix it. If error persists after that, contact Microsoft Support.

### DatabaseBackupOperationFailed

**Error code**: `DatabaseBackupOperationFailed`

**Error message**: Database backup failed.

**Recommended action**: Retry the backup operation. If error persists, contact Microsoft Support.

### BackupValidationFailed

**Error code**: `BackupValidationFailed`

**Error message**: Database backup validation failed.

**Recommended action**: Retry the operation. If error persists, contact Microsoft Support.

### DatabaseExistenceValidationFailure

**Error code**: `DatabaseExistenceValidationFailure`

**Error message**: Database existence validation failed.

**Recommended action**: Check if the database exists and is online. If not, create and make the database online. For further assistance, contact Microsoft Support.

### WriteToBackupStreamFailure

**Error code**: `WriteToBackupStreamFailure`

**Error message**: Failure while writing data to backup stream.

**Recommended action**: Retry the operation. If the issue still persists, contact Microsoft Support for further assistance.

### DumpHistoryCorrupted

**Error code**: `DumpHistoryCorrupted`

**Error message**: Dump history file is corrupted due to incorrect syntax.

**Recommended action**: Check for the disk space or any incorrect format in dump history file. If the dump file is corrupted, see the [SAP note to resolve the issue](https://me.sap.com/notes/2167081/E). If the issue still persists, contact Microsoft support.

### GetDatabaseVersionFailure

**Error code**: `GetDatabaseVersionFailure`

**Error message**: Error while fetching database version.

**Recommended action**: Check if the database is in running state. If the issue still persists, contact Microsoft support.

### FullBackupNotPerformed

**Error code**: `FullBackupNotPerformed`

**Error message**: No previous full backups were found. Initiating a forced full backup now.

**Recommended action**: An automatic full backup will be performed. If the error persists afterward, contact Microsoft Support.

### LatestFullBackupIsOld

**Error code**: `LatestFullBackupIsOld`

**Error message**: The latest full backup is more than 15 days old. A forced full backup will be taken now.

**Recommended action**: An automatic full backup will be performed. If the error persists, contact Microsoft Support.

### CompressionLevelNotSet

**Error code**: `CompressionLevelNotSet`

**Error message**: Compression has been enabled but there's no associated compression level.

**Recommended action**: Run the updated pre-registration script in the virtual machine, which will add the default configuration in the `config` file and retry. If the error persists after that, contact Microsoft Support.

## Restore errors

### FailedToCreateDatabase

**Error code**: `FailedToCreateDatabase`

**Error message**: Failed to create database for restoring.

**Recommended action**: To resolve the issue, follow these steps:

1. Ensure that the default device is configured on the database instance.
2. If the database creation fails for model database with error, resolve the error and retry.
3. If enough space isn't available in the default device, increase the size of database device (or) change the default device with free space matching the size of source database.

### InvalidDatabaseName

**Error code**: `InvalidDatabaseName`

**Error message**: Database name supplied during alternative location restore isn't meeting the requirements for database creation.

**Recommended action**: Ensure that the database name length shouldn't exceed 30 characters.

### ForceOverwriteOptionNotSet

**Error code**: `ForceOverwriteOptionNotSet`

**Error message**: Restore failed because overwrite options aren't set correctly

**Recommended action**: Choose the **ForceOverwrite** option to perform restore on this database as the database with same name exists.

### InvalidOverwriteOption
 
**Error code**: `InvalidOverwriteOption`

**Error message**: Restore operation failed due to overwrite option set to null or is invalid.

**Recommended action**: Choose the **ForceOverwrite** option to perform restore on this database.

### PointInTimeRestoreFailed

**Error code**: `PointInTimeRestoreFailed`

**Error message**: Database restore operation to the specified point-in-time has failed with an internal error.

**Recommended action**: Try restoring the database from a previous Full backup. For further assistance contact Microsoft Support.

### RestoreMasterALROLRUnSupported

**Error code**: `RestoreMasterALROLRUnSupported`

**Error message**: Master database can't be restored using Alternate and original location. Please restore using restore as files.

**Recommended action**: To restore the master database, follow these steps:

1. Start the database in Single User mode.
2. Restore the master database dump using restore as files.
3. Apply the restore using the dump file.
4. Restart the database in the `multi user` mode.

### RestoreOperationFailed

**Error code**: `RestoreOperationFailed`

**Error message**: Database restore operation has failed with an error

**Recommended action**: Try restoring the database from a previous Full backup. For further assistance contact Microsoft Support.

### DatabaseRestoreFailed

**Error code**: `DatabaseRestoreFailed`

**Error message**: Database Restore has failed due to an unknown error.

**Recommended action**: Wait for a few minutes and then try the operation again. If the issue persists contact Microsoft support.

### DatabaseOperationFailed

**Error code**: `DatabaseOperationFailed`

**Error message**: Database operation failed with an error.

**Recommended action**: Check if the database user has appropriate permissions. For further assistance contact Microsoft Support.

### MultiActiveConnections

**Error code**: `MultiActiveConnections`

**Error message**: Unable to execute restore operation on database %DatabaseName; because the active connections exceed one, preventing the database from being switched to single server mode.

**Recommended action**: Terminate all active connections and ensure that either there are no remaining connections or only one active connection at most. For further assistance, contact Microsoft Support.
    





