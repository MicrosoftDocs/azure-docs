---
title: Troubleshoot SQL Server database backup by using Azure Backup | Microsoft Docs
description: Troubleshooting information for backing up SQL Server databases running on Azure VMs with Azure Backup.
services: backup
author: anuragm
manager: sivan
ms.service: backup
ms.topic: article
ms.date: 06/18/2019
ms.author: anuragm
---

# Troubleshoot SQL Server database backup by using Azure Backup

This article provides troubleshooting information for SQL Server databases running on Azure virtual machines.

For more information about the backup process and limitations, see [About SQL Server backup in Azure VMs](backup-azure-sql-database.md#feature-consideration-and-limitations).

## SQL Server permissions

To configure protection for a SQL Server database on a virtual machine, you must install the **AzureBackupWindowsWorkload** extension on that virtual machine. If you get the error **UserErrorSQLNoSysadminMembership**, it means your SQL Server instance doesn't have the required backup permissions. To fix this error, follow the steps in [Set VM permissions](backup-azure-sql-database.md#set-vm-permissions).

## Error messages

### Backup Type Unsupported

| Severity | Description | Possible causes | Recommended action |
|---|---|---|---|
| Warning | Current settings for this database don't support certain backup types present in the associated policy. | <li>Only a full database backup operation can be performed on the master database. Neither differential backup nor transaction log backup is possible. </li> <li>Any database in the simple recovery model does not allow for the backup of transaction logs.</li> | Modify the database settings such that all the backup types in the policy are supported. Or, change the current policy to include only the supported backup types. Otherwise, the unsupported backup types will be skipped during scheduled backup or the backup job will fail for ad hoc backup.


### UserErrorSQLPODoesNotSupportBackupType

| Error message | Possible causes | Recommended action |
|---|---|---|
| This SQL database does not support the requested backup type. | Occurs when the database recovery model doesn't allow the requested backup type. The error can happen in the following situations: <br/><ul><li>A database that's using a simple recovery model does not allow log backup.</li><li>Differential and log backups are not allowed for a master database.</li></ul>For more detail, see the [SQL Server recovery models](https://docs.microsoft.com/sql/relational-databases/backup-restore/recovery-models-sql-server) documentation. | If the log backup fails for the database in the simple recovery model, try one of these options:<ul><li>If the database is in simple recovery mode, disable log backups.</li><li>Use the [SQL Server documentation](https://docs.microsoft.com/sql/relational-databases/backup-restore/view-or-change-the-recovery-model-of-a-database-sql-server) to change the database recovery model to full or bulk logged. </li><li> If you don't want to change the recovery model, and you have a standard policy to back up multiple databases that can't be changed, ignore the error. Your full and differential backups will work per schedule. The log backups will be skipped, which is expected in this case.</li></ul>If it's a master database and you have configured differential or log backup, use either of the following steps:<ul><li>Use the portal to change the backup policy schedule for the master database, to full.</li><li>If you have a standard policy to back up multiple databases that can't be changed, ignore the error. Your full backup will work per schedule. Differential or log backups won't happen, which is expected in this case.</li></ul> |
| Operation canceled as a conflicting operation was already running on the same database. | See the [blog entry about backup and restore limitations](https://blogs.msdn.microsoft.com/arvindsh/2008/12/30/concurrency-of-full-differential-and-log-backups-on-the-same-database) that run concurrently.| [Use SQL Server Management Studio (SSMS) to monitor the backup jobs](manage-monitor-sql-database-backup.md). After the conflicting operation fails, restart the operation.|

### UserErrorSQLPODoesNotExist

| Error message | Possible causes | Recommended action |
|---|---|---|
| SQL database does not exist. | The database was either deleted or renamed. | Check if the database was accidentally deleted or renamed.<br/><br/> If the database was accidentally deleted, to continue backups, restore the database to the original location.<br/><br/> If you deleted the database and don't need future backups, then in the Recovery Services vault, select **Stop backup** with **Retain Backup Data** or **Delete Backup Data**. For more information, see [Manage and monitor backed-up SQL Server databases](manage-monitor-sql-database-backup.md).

### UserErrorSQLLSNValidationFailure

| Error message | Possible causes | Recommended action |
|---|---|---|
| Log chain is broken. | The database or the VM is backed up through another backup solution, which truncates the log chain.|<ul><li>Check if another backup solution or script is in use. If so, stop the other backup solution. </li><li>If the backup was an ad hoc log backup, trigger a full backup to start a new log chain. For scheduled log backups, no action is needed because the Azure Backup service will automatically trigger a full backup to fix this issue.</li>|

### UserErrorOpeningSQLConnection

| Error message | Possible causes | Recommended action |
|---|---|---|
| Azure Backup is not able to connect to the SQL instance. | Azure Backup can't connect to the SQL Server instance. | Use the additional details on the Azure portal error menu to narrow down the root causes. Refer to [SQL backup troubleshooting](https://docs.microsoft.com/sql/database-engine/configure-windows/troubleshoot-connecting-to-the-sql-server-database-engine) to fix the error.<br/><ul><li>If the default SQL settings don't allow remote connections, change the settings. See the following articles for information about changing the settings:<ul><li>[MSSQLSERVER_-1](/previous-versions/sql/sql-server-2016/bb326495(v=sql.130))</li><li>[MSSQLSERVER_2](/sql/relational-databases/errors-events/mssqlserver-2-database-engine-error)</li><li>[MSSQLSERVER_53](/sql/relational-databases/errors-events/mssqlserver-53-database-engine-error)</li></ul></li></ul><ul><li>If there are login issues, use these links to fix them:<ul><li>[MSSQLSERVER_18456](/sql/relational-databases/errors-events/mssqlserver-18456-database-engine-error)</li><li>[MSSQLSERVER_18452](/sql/relational-databases/errors-events/mssqlserver-18452-database-engine-error)</li></ul></li></ul> |

### UserErrorParentFullBackupMissing

| Error message | Possible causes | Recommended action |
|---|---|---|
| First full backup is missing for this data source. | Full backup is missing for the database. Log and differential backups are parents to a full backup, so be sure to take full backups before triggering differential or log backups. | Trigger an ad hoc full backup.   |

### UserErrorBackupFailedAsTransactionLogIsFull

| Error message | Possible causes | Recommended action |
|---|---|---|
| Cannot take backup as transaction log for the data source is full. | The database transactional log space is full. | To fix this issue, refer to the [SQL Server documentation](https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-9002-database-engine-error). |

### UserErrorCannotRestoreExistingDBWithoutForceOverwrite

| Error message | Possible causes | Recommended action |
|---|---|---|
| Database with same name already exists at the target location | The target restore destination already has a database with the same name.  | <ul><li>Change the target database name.</li><li>Or, use the force overwrite option on the restore page.</li> |

### UserErrorRestoreFailedDatabaseCannotBeOfflined

| Error message | Possible causes | Recommended action |
|---|---|---|
| Restore failed as the database could not be brought offline. | While you're doing a restore, the target database needs to be brought offline. Azure Backup can't bring this data offline. | Use the additional details on the Azure portal error menu to narrow down the root causes. For more information, see the [SQL Server documentation](https://docs.microsoft.com/sql/relational-databases/backup-restore/restore-a-database-backup-using-ssms). |

###  UserErrorCannotFindServerCertificateWithThumbprint

| Error message | Possible causes | Recommended action |
|---|---|---|
| Cannot find the server certificate with thumbprint on the target. | The master database on the destination instance doesn't have a valid encryption thumbprint. | Import the valid certificate thumbprint used on the source instance, to the target instance. |

### UserErrorRestoreNotPossibleBecauseLogBackupContainsBulkLoggedChanges

| Error message | Possible causes | Recommended action |
|---|---|---|
| The log backup used for recovery contains bulk-logged changes. It cannot be used to stop at an arbitrary point in time as per the SQL guidelines. | When a database is in bulk-logged recovery mode, the data between a bulk-logged transaction and the next log transaction can't be recovered. | Choose a different point in time for recovery. [Learn more](https://docs.microsoft.com/previous-versions/sql/sql-server-2008-r2/ms186229(v=sql.105)).


### FabricSvcBackupPreferenceCheckFailedUserError

| Error message | Possible causes | Recommended action |
|---|---|---|
| Backup preference for SQL Always On Availability Group cannot be met as some nodes of the Availability Group are not registered. | Nodes required to perform backups are not registered or are unreachable. | <ul><li>Ensure that all the nodes required to perform backups of this database are registered and healthy, and then retry the operation.</li><li>Change the backup preference for the SQL Server Always On availability group.</li></ul> |

### VMNotInRunningStateUserError

| Error message | Possible causes | Recommended action |
|---|---|---|
| SQL server VM is either shutdown and not accessible to Azure Backup service. | The VM is shut down. | Ensure that the SQL Server instance is running. |

### GuestAgentStatusUnavailableUserError

| Error message | Possible causes | Recommended action |
|---|---|---|
| Azure Backup service uses Azure VM guest agent for doing backup but guest agent is not available on the target server. | The guest agent is not enabled or is unhealthy. | [Install the VM guest agent](../virtual-machines/extensions/agent-windows.md) manually. |

### AutoProtectionCancelledOrNotValid

| Error message | Possible causes | Recommended action |
|---|---|---|
| Auto-protection Intent was either removed or is no more valid. | When you enable auto-protection on a SQL Server instance, **Configure Backup** jobs run for all the databases in that instance. If you disable auto-protection while the jobs are running, then the **In-Progress** jobs are canceled with this error code. | Enable auto-protection once again to help protect all the remaining databases. |

## Re-registration failures

Check for one or more of the following symptoms before you trigger the re-register operation:

* All operations (such as backup, restore, and configure backup) are failing on the VM with one of the following error codes: **WorkloadExtensionNotReachable**, **UserErrorWorkloadExtensionNotInstalled**, **WorkloadExtensionNotPresent**, **WorkloadExtensionDidntDequeueMsg**.
* The **Backup Status** area for the backup item is showing **Not reachable**. Rule out all the other causes that might result in the same status:

  * Lack of permission to perform backup-related operations on the VM  
  * Shutdown of the VM, so backups can’t take place
  * Network issues  

  !["Not reachable" status in re-registering a VM](./media/backup-azure-sql-database/re-register-vm.png)

* In the case of an Always On availability group, the backups started failing after you changed the backup preference or after a failover.

These symptoms may arise for one or more of the following reasons:

* An extension was deleted or uninstalled from the portal. 
* An extension was uninstalled from **Control Panel** on the VM under **Uninstall or Change a Program**.
* The VM was restored back in time through in-place disk restore.
* The VM was shut down for an extended period, so the extension configuration on it expired.
* The VM was deleted, and another VM was created with the same name and in the same resource group as the deleted VM.
* One of the availability group nodes didn't receive the complete backup configuration. This can happen when the availability group is registered to the vault or when a new node is added.

In the preceding scenarios, we recommend that you trigger a re-register operation on the VM. For now, this option is available only through PowerShell.

## Size limit for files

The total string size of files depends not only on the number of files but also on their names and paths. For each database file, get the logical file name and physical path. You can use this SQL query:

```
SELECT mf.name AS LogicalName, Physical_Name AS Location FROM sys.master_files mf
               INNER JOIN sys.databases db ON db.database_id = mf.database_id
               WHERE db.name = N'<Database Name>'"
```

Now arrange them in the following format:

```
[{"path":"<Location>","logicalName":"<LogicalName>","isDir":false},{"path":"<Location>","logicalName":"<LogicalName>","isDir":false}]}
```

Here's an example:

```
[{"path":"F:\\Data\\TestDB12.mdf","logicalName":"TestDB12","isDir":false},{"path":"F:\\Log\\TestDB12_log.ldf","logicalName":"TestDB12_log","isDir":false}]}
```

If the string size of the content exceeds 20,000 bytes, the database files are stored differently. During recovery, you won't be able to set the target file path for restore. The files will be restored to the default SQL path provided by SQL Server.

### Override the default target restore file path

You can override the target restore file path during the restore operation by placing a JSON file that contains the mapping of the database file to the target restore path. Create a `database_name.json` file and place it in the location *C:\Program Files\Azure Workload Backup\bin\plugins\SQL*.

The content of the file should be in this format:
```
[
  {
    "Path": "<Restore_Path>",
    "LogicalName": "<LogicalName>",
    "IsDir": "false"
  },
  {
    "Path": "<Restore_Path>",
    "LogicalName": "LogicalName",
    "IsDir": "false"
  },  
]
```

Here's an example:

```
[
  {
   "Path": "F:\\Data\\testdb2_1546408741449456.mdf",
   "LogicalName": "testdb7",
   "IsDir": "false"
  },
  {
    "Path": "F:\\Log\\testdb2_log_1546408741449456.ldf",
    "LogicalName": "testdb7_log",
    "IsDir": "false"
  },  
]
```

In the preceding content, you can get the logical name of the database file by using the following SQL query:

```
SELECT mf.name AS LogicalName FROM sys.master_files mf
                INNER JOIN sys.databases db ON db.database_id = mf.database_id
                WHERE db.name = N'<Database Name>'"
  ```


This file should be placed before you trigger the restore operation.

## Next steps

For more information about Azure Backup for SQL Server VMs (public preview), see [Azure Backup for SQL VMs](../virtual-machines/windows/sql/virtual-machines-windows-sql-backup-recovery.md#azbackup).
