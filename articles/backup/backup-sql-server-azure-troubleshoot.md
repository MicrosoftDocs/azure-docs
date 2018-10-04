---
title: Azure Backup troubleshooting guide for SQL Server VMs | Microsoft Docs
description: Troubleshooting information for backing up SQL Server VMs to Azure.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''
keywords: 

ms.assetid: 
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/19/2018
ms.author: markgal;anuragm
ms.custom: 
---

# Troubleshoot Back up SQL Server on Azure

This article provides troubleshooting information for protecting SQL Server VMs on Azure (Preview).

## Public Preview limitations

To view the Public Preview limitations, see the article, [Back up SQL Server database in Azure](backup-azure-sql-database.md#public-preview-limitations).

## SQL Server permissions

To configure protection for a SQL Server database on a virtual machine, the **AzureBackupWindowsWorkload** extension must be installed on that virtual machine. If you receive the error, **UserErrorSQLNoSysadminMembership**, it means your SQL Instance doesn't have the required backup permissions. To fix this error, follow the steps in [Set permissions for non-marketplace SQL VMs](backup-azure-sql-database.md#set-permissions-for-non-marketplace-sql-vms).

## Troubleshooting Errors

Use the information in the following tables to troubleshoot issues and errors encountered while protecting SQL Server to Azure.

## Backup failures

The following tables are organized by error code.

### UserErrorSQLPODoesNotSupportBackupType

| Error message | Possible causes | Recommended action |
|---|---|---|
| This SQL database does not support the requested backup type. | Occurs when the database recovery model doesn't allow the requested backup type. The error can happen in the following situations: <br/><ul><li>A database using a simple recovery model does not allow log backup.</li><li>Differential and log backups are not allowed for a Master database.</li></ul>For more detail, see the [SQL Recovery models](https://docs.microsoft.com/sql/relational-databases/backup-restore/recovery-models-sql-server) documentation. | If the log backup fails for the DB in simple recovery model, try one of these options:<ul><li>If the database is in simple recovery mode, disable log backups.</li><li>Use the [SQL documentation](https://docs.microsoft.com/sql/relational-databases/backup-restore/view-or-change-the-recovery-model-of-a-database-sql-server) to change the database recovery model to Full or Bulk Logged. </li><li> If you don't want to change the recovery model, and you have a standard policy to back up multiple databases that can't be changed, ignore the error. Your full and differential backups will work per schedule. The log backups will be skipped, which is expected in this case.</li></ul>If it's a Master database and you have configured differential or log backup, use any of the following steps:<ul><li>Use the portal to change the backup policy schedule for the Master database, to Full.</li><li>If you have a standard policy to back up multiple databases that can't be changed, ignore the error. Your full backup will work per schedule. Differential or log backups won't happen, which is expected in this case.</li></ul> |
| Operation canceled as a conflicting operation was already running on the same database. | See the [blog entry about back up and restore limitations](https://blogs.msdn.microsoft.com/arvindsh/2008/12/30/concurrency-of-full-differential-and-log-backups-on-the-same-database) that run concurrently.| [Use SQL Server Management Studio (SSMS) to monitor the backup jobs.](backup-azure-sql-database.md#manage-azure-backup-operations-for-sql-on-azure-vms) Once the conflicting operation fails, restart the operation.|

### UserErrorSQLPODoesNotExist

| Error message | Possible causes | Recommended action |
|---|---|---|
| SQL database does not exist. | The database was either deleted or renamed. | <ul><li>Check if the database was accidentally deleted or renamed.</li><li>If the database was accidentally deleted, to continue backups, restore the database to the original location.</li><li>If you deleted the database and do not need future backups, then in the Recovery Services vault, click [stop backup with "Delete/Retain data"](backup-azure-sql-database.md#manage-azure-backup-operations-for-sql-on-azure-vms).</li>|

### UserErrorSQLLSNValidationFailure

| Error message | Possible causes | Recommended action |
|---|---|---|
| Log chain is broken. | The database or the VM is backed up using another backup solution, which truncates the log chain.|<ul><li>Check if another backup solution or script is in use. If so, stop the other backup solution. </li><li>If the backup was an ad-hoc log backup, trigger a full backup to start a new log chain. For scheduled log backups, no action is needed as Azure Backup service will automatically trigger a full backup to fix this issue.</li>|

### UserErrorOpeningSQLConnection

| Error message | Possible causes | Recommended action |
|---|---|---|
| Azure Backup is not able to connect to the SQL instance. | Azure Backup can't connect to the SQL Instance. | Use the additional details in the Azure portal error menu to narrow down the root causes. Refer to [SQL backup troubleshooting](https://docs.microsoft.com/sql/database-engine/configure-windows/troubleshoot-connecting-to-the-sql-server-database-engine) to fix the error.<br/><ul><li>If the default SQL settings do not allow remote connections, change the settings. Refer to the below links for changing the settings.<ul><li>[https://msdn.microsoft.com/library/bb326495.aspx](https://msdn.microsoft.com/library/bb326495.aspx)</li><li>[https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-2-database-engine-error](https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-2-database-engine-error)</li><li>[https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-53-database-engine-error](https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-53-database-engine-error)</li></ul></li></ul><ul><li>If there are login issues, refer to the below links to fix it:<ul><li>[https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-18456-database-engine-error](https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-18456-database-engine-error)</li><li>[https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-18452-database-engine-error](https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-18452-database-engine-error)</li></ul></li></ul> |

### UserErrorParentFullBackupMissing

| Error message | Possible causes | Recommended action |
|---|---|---|
| First full backup is missing for this data source. | Full backup is missing for the database. Log and differential backups parent to a full backup, so full backups must be taken before triggering differential or log backups. | Trigger an ad-hoc full backup.   |

### UserErrorBackupFailedAsTransactionLogIsFull

| Error message | Possible causes | Recommended action |
|---|---|---|
| Cannot take backup as transaction log for the data source is full. | The database transactional log space is full. | To fix this issue, refer to the [SQL documentation](https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-9002-database-engine-error). |
| This SQL database does not support the requested backup type. | Always On AG secondary replicas don't support full and differential backups. | <ul><li>If you triggered an ad-hoc backup, trigger the backups on the primary node.</li><li>If the backup was scheduled by policy, make sure the primary node is registered. To register the node, [follow the steps to discover a SQL Server database](backup-azure-sql-database.md#discover-sql-server-databases).</li></ul> | 

## Restore failures

The following error codes are shown when restore jobs fail.

### UserErrorCannotRestoreExistingDBWithoutForceOverwrite 

| Error message | Possible causes | Recommended action |
|---|---|---|
| Database with same name already exists at the target location | The target restore destination already has a database with same name.  | <ul><li>Change the target database name</li><li>Or, use the force overwrite option in the restore page</li> |

### UserErrorRestoreFailedDatabaseCannotBeOfflined

| Error message | Possible causes | Recommended action |
|---|---|---|
| Restore failed as the database could not be brought offline. | While doing a restore, target database needs to be brought offline. Azure Backup is not able to bring this data offline. | Use the additional details in the Azure portal error menu to narrow down the root causes. For more information, see the [SQL documentation](https://docs.microsoft.com/sql/relational-databases/backup-restore/restore-a-database-backup-using-ssms). |


###  UserErrorCannotFindServerCertificateWithThumbprint

| Error message | Possible causes | Recommended action |
|---|---|---|
| Cannot find the server certificate with thumbprint on the target. | The Master database on the destination instance doesn't have a valid encryption thumbprint. | Import the valid certificate thumbprint used on the Source instance, to the target instance. |

## Registration failures

The following error codes are for registration failures.

### FabricSvcBackupPreferenceCheckFailedUserError 

| Error message | Possible causes | Recommended action |
|---|---|---|
| Backup preference for SQL Always On Availability Group cannot be met as some nodes of the Availability Group are not registered. | Nodes required to perform backups are not registered or are unreachable. | <ul><li>Ensure that all the nodes required to perform backups of this database are registered and healthy and then retry the operation.</li><li>Change SQL Always On Availability Group backup preference.</li></ul> |

### VMNotInRunningStateUserError

| Error message | Possible causes | Recommended action |
|---|---|---|
| SQL server VM is either shutdown and not accessible to Azure Backup service. | VM is shut down | Ensure that the SQL server is running. |

### GuestAgentStatusUnavailableUserError

| Error message | Possible causes | Recommended action |
|---|---|---|
| Azure Backup service uses Azure VM guest agent for doing backup but guest agent is not available on the target server. | Guest agent is not enabled or is unhealthy | [Install the VM guest agent](../virtual-machines/extensions/agent-windows.md) manually. |

## Next steps

For more information about Azure Backup for SQL Server VMs (public preview), see [Azure Backup for SQL VMs (Public Preview)](../virtual-machines/windows/sql/virtual-machines-windows-sql-backup-recovery.md#azbackup).