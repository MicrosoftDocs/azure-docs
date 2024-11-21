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

**Recommended action**: 1. Check if the database is online. 2. Check if the database  credentials are correct . 3. if the issue still persists,  please contact Microsoft Support for  further assistance.


InvalidWorkloadType
ErrorCode: InvalidWorkloadType
Message: Invalid workload type.
RecommendedAction: Fix the input and retry the operation. If the issue persists contact support.

GetPluginVersionError
 ErrorCode: GetPluginVersionError
 Message: Error while getting plugin version.
 RecommendedAction: Retry the operation. If the issue persists contact support.

OperationNotSupportedError
 ErrorCode: OperationNotSupportedError
 Message: Restore Inquire Operation Not Supported.
 RecommendedAction: No action required. Contact support for further clarifications.

GeneralPluginException
ErrorCode: GeneralPluginException
 Message: An exception occurred.
RecommendedAction: Internal error. For further assistance please contact Microsoft Support.

DatabaseQueryExecutionError
ErrorCode: DatabaseQueryExecutionError
Message: An ASE exception occurred while running query on database.
RecommendedAction: Please check if database is online and retry the operation. If the issue persists, contact support.




ASEBackupServerNotRunning

ErrorCode: ASEBackupServerNotRunning

Message: ASE backup server is not running.
RecommendedAction: Please check if database is online, backup server is running and retry the operation. If the issue persists, contact support. 


Backup Error Code
UserErrorASELSNValidationFailure
ErrorCode: UserErrorASELSNValidationFailure
Message: Log sequence validation failed. Initiating a forced full backup now.
RecommendedAction: Log Sequence Number validation has failed / possible log chain break, a full backup will be performed now to fix it. If error persists after that, please contact Microsoft Support.
DatabaseBackupOperationFailed
ErrorCode: DatabaseBackupOperationFailed
Message: Database backup failed.
RecommendedAction: Retry backup. If error persists, please contact Microsoft Support.
BackupValidationFailed
ErrorCode: BackupValidationFailed
Message: Database backup validation failed.
RecommendedAction: Retry the operation. If error persists, please contact Microsoft Support.
DatabaseExistenceValidationFailure
ErrorCode: DatabaseExistenceValidationFailure,
Message: Database existence validation failed.
RecommendedAction: Check if database exists and is online. If not, create and make it online. For further assistance, please contact Microsoft Support.
WriteToBackupStreamFailure
ErrorCode: WriteToBackupStreamFailure
Message: Failure while writing data to backup stream.
RecommendedAction: Retry the operation. If the issue still persists, please contact Microsoft Support for further assistance.
DumpHistoryCorrupted
ErrorCode: DumpHistoryCorrupted
Message: Dump history file is corrupted due to incorrect syntax.
RecommendedAction: Check for the disk space or any incorrect format in dump history file.If the dump file is corrupted, please go through the steps mentioned in sap note to resolve the issue https://me.sap.com/notes/2167081/E . Please contact support if the issue is still not resolved.

GetDatabaseVersionFailure

ErrorCode: GetDatabaseVersionFailure

Message: Error while fetching database version.
RecommendedAction: Check if database is in running state. Please contact support if the issue is still not resolved.

FullBackupNotPerformed
ErrorCode: FullBackupNotPerformed
Message: No previous full backups were found. Initiating a forced full backup now.
RecommendedAction: An automatic full backup will be performed now. If the error persists afterward, please contact Microsoft Support.

LatestFullBackupIsOld
ErrorCode: LatestFullBackupIsOld
Message: The latest full backup is more than 15 days old. A forced full backup will be taken now.
RecommendedAction: An automatic full backup will be performed now. If the error persists, please contact Microsoft Support.


CompressionLevelNotSet

ErrorCode: CompressionLevelNotSet
Message: Compression has been enabled but there is no associated compression level.
RecommendedAction: Please run the updated pre-registration script in the virtual machine, which will add the default configuration in config and retry. If the error persists after that, please contact Microsoft Support.


Restore Errors
FailedToCreateDatabase
ErrorCode: FailedToCreateDatabase
Message: Failed to create database for restoring.
RecommendedAction: 1. Make sure default device configured on the database instance.
2.Database creation failed with model database is in error. Please resolve the error and retry.
3. Enough space is not available in the default device. Please increase the size of database device (or) change the default device having free space matching the size of source database.
InvalidDatabaseName
ErrorCode: InvalidDatabaseName
Message: Database name supplied during alternative location restore is not meeting the requirements for database creation.
RecommendedAction: Database length should not exceed 30 characters.
 ForceOverwriteOptionNotSet
ErrorCode: ForceOverwriteOptionNotSet
Message: Restore failed because overwrite options is not set correctly
RecommendedAction: Please choose ForceOverwrite option to perform restore on this DB as the database with same name exist.

InvalidOverwriteOption
 ErrorCode: InvalidOverwriteOption
 Message: Restore operation failed due to overwrite option set to null or is invalid.
 RecommendedAction: Please choose ForceOverwrite option to perform restore on this DB.

PointInTimeRestoreFailed
ErrorCode: PointInTimeRestoreFailed
Message: Database restore to the specified point in time failed with an internal error.
RecommendedAction: Try restoring the database from a previous Full backup. For further assistance please contact Microsoft Support.

RestoreMasterALROLRUnSupported
ErrorCode: RestoreMasterALROLRUnSupported
Message: Master database cannot be restored using Alternate and original location. Please restore using restore as files.
RecommendedAction:       1. Start the database in Single User mode.
      2. Restore the master database dump using restore as files.
      3. Apply the restore using the dump file.
      4. Restart the database in multi user mode.


RestoreOperationFailed
ErrorCode: RestoreOperationFailed
Message: Database restore failed with an error
RecommendedAction: Try restoring the database from a previous Full backup. For further assistance please contact Microsoft Support.
DatabaseRestoreFailed
ErrorCode: DatabaseRestoreFailed
Message: Database Restore has failed due to an unknown error.
RecommendedAction: Wait for a few minutes and then try the operation again. If the issue persists please contact Microsoft support.
DatabaseOperationFailed
ErrorCode: DatabaseOperationFailed
Message: Database operation failed with an error.
RecommendedAction: Please check database user has appropriate permissions. For further assistance please contact Microsoft Support.
MultiActiveConnections
ErrorCode: MultiActiveConnections
Message: Unable to execute restore operation on database %DatabaseName; because the active connections exceed one, preventing the database from being switched to single server mode.
RecommendedAction: Terminate all active connections and ensure that either there are no remaining connections or only one active connection at most. For further assistance, please contact Microsoft Support.
    





