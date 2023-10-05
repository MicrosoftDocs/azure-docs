---
title: MySQL to Azure Database for MySQL Data Migration - MySQL Consistent Backup
description: Learn how to use the Azure Database for MySQL Data Migration - MySQL Consistent Backup for transaction consistency even without making the Source server read-only
author: karlaescobar
ms.author: karlaescobar
ms.date: 04/19/2022
ms.service: dms
ms.topic: conceptual
ms.custom: references_regions
---

# MySQL to Azure Database for MySQL Data Migration - MySQL Consistent Backup

MySQL Consistent Backup is a new feature that allows users to take a Consistent Backup of a MySQL server without losing data integrity at source because of ongoing CRUD (Create, Read, Update, and Delete) operations. Transactional consistency is achieved without the need to set the source server to read-only mode through this feature.

## Current implementation

In the current implementation, users can enable the **Make Source Server Read Only** option during offline migration. Selecting this option maintains the data integrity of the target database as the source is migrated by preventing Write/Delete operations on the source server during migration. When you make the source server read only as part of the migration process, the selection applies to all the source server’s databases, regardless of whether they are selected for migration.

:::image type="content" source="media/migrate-azure-mysql-consistent-backup/dms-mysql-make-source-read-only.png" alt-text="MySQL to Azure Database for MySQL Data Migration Wizard - Read Only" lightbox="media/migrate-azure-mysql-consistent-backup/dms-mysql-make-source-read-only.png":::

## Disadvantages

Making the source server read only prevents users from modifying the data, rendering the database unavailable for any update operations. However, if this option is not enabled, there is a possibility for data updates to occur during migration. As a result, migrated data could be inconsistent because the database snapshots would be read at different points in time.

## Consistent Backup

Consistent Backup allows data migration to proceed and maintains data consistency regardless of whether the source server is set as read only. To enable Consistent Backup, select the **[Preview] Enable Transactional Consistency** option.  

:::image type="content" source="media/migrate-azure-mysql-consistent-backup/dms-mysql-enable-tranactional-consistency.png" alt-text="MySQL to Azure Database for MySQL Data Migration Wizard - Enable Transactional Consistency" lightbox="media/migrate-azure-mysql-consistent-backup/dms-mysql-enable-tranactional-consistency.png":::

With the **Enable Transactional Consistency** selected, you can maintain data consistency at the target even as traffic continues to the source server.

### The Undo log

The undo log makes repeatable reads possible and helps generate the snapshot that is required for the migration. The undo log is a collection of undo log records associated with a single read-write transaction. An undo log record contains information about how to undo the latest change by a transaction to a clustered index record. If another transaction needs to see the original data as part of a consistent read operation, the unmodified data is retrieved from undo log records. Transactional consistency is achieved through an isolation level of repeatable reads along with the undo log. On executing the Select query (for migration), the source server inspects the current contents of a table, compares it to the Undo log and then rolls back all the changes from the point in time the migration was started, before returning the results to the client. The undo log is not user controlled, is enabled by default, and does not offer any APIs for control by the user.

### How Consistent Backup works

When you initiate a migration, the service flushes all tables on the source server with a **read** lock to obtain the point-in-time snapshot. This flushing is done because a global lock is more reliable than attempting to lock individual databases or tables. As a result, even if you are not migrating all databases in a server, they are locked as part of setting up the migration process. The migration service initiates a repeatable read and combines the current table state with contents of the undo log for the snapshot. The **snapshot** is generated after obtaining the server wide lock and spawning several connections for the migration. After the creation of all connections used for the migration, the locks on the table are released.

The migration threads are used to perform the migration with repeatable read enabled for all transactions and the source server hides all new changes from the offline migration. Clicking on the specific database in the Azure Database Migration Service (DMS) Portal UI during the migration displays the migration status of all the tables - completed or in progress - in the migration. If there are connection issues, the status of the database changes to **Retrying** and the error information is displayed if the migration fails.

Repeatable reads are enabled to keep the undo logs accessible during the migration, which increase the storage required on the source because of long running connections. It is important to note that the longer a migration runs the more table changes that occur, the undo log's history of changes become more extensive. The longer a migration, the more slowly it runs as the undo logs to retrieve the unmodified data becomes longer. This could also increase the compute requirements and load on the source server.

### The binary log

The [binary log (or binlog)](https://dev.mysql.com/doc/refman/8.0/en/binary-log.html) is an artifact that is reported to the user after the offline migration is complete. As the service spawns threads for migration during read lock, the migration service records the initial binlog position because the binlog position could change after the server is unlocked. While the migration service attempts to obtain the locks and set up the migration, the bin log position displays the status **Waiting for data movement to start...**.

:::image type="content" source="media/migrate-azure-mysql-consistent-backup/dms-wait-for-binlog-status.png" alt-text="MySQL to Azure Database for MySQL Data Migration Wizard - Waiting for data movement to start" lightbox="media/migrate-azure-mysql-consistent-backup/dms-wait-for-binlog-status.png":::

The binlog keeps a record of all the CRUD operations in the source server. The DMS portal UI shows the binary log filename and position aligned to the time the locks were obtained on the source for the consistent snapshot and it does not impact the outcome of the offline migration. The binlog position is updated on the UI as soon as it is available, and the user does not have to wait for the migration to conclude.

:::image type="content" source="media/migrate-azure-mysql-consistent-backup/dms-binlog-status-display.png" alt-text="MySQL to Azure Database for MySQL Data Migration Wizard - Migration complete display binlog status" lightbox="media/migrate-azure-mysql-consistent-backup/dms-binlog-status-display.png":::

This binlog position can be used in conjunction with [Data-in replication](../mysql/concepts-data-in-replication.md) or third-party tools (such as Striim or Attunity) that provide for replaying binlog changes to a different server, if required.

The binary log is deleted periodically, so the user must take necessary precautions if Change Data Capture (CDC) is used later to migrate the post-migration updates at the source. Configure the **binlog_expire_logs_seconds** parameter on the source server to ensure that binlogs are not purged before the replica commits the changes. If non-zero, binary logs are purged after **binlog_expire_logs_seconds** seconds. Post successful cut-over, you can reset the value. Users need to leverage the changes in the binlog to carry out the online migration. Users can take advantage of DMS to provide the initial seeding of the data and then stitch that together with the CDC solution of their choice to implement a minimal downtime migration.

## Prerequisites

To complete the migration successfully with Consistent Backup enabled to:

- Ensure that the user who is attempting to flush tables with a **read lock** has the RELOAD or FLUSH permission.

- Use the mysql client tool to determine whether log_bin is enabled on the source server. The Bin log is not always turned on by default and should be checked to see if it is enabled before starting the migration. The mysql client tool is used to determine whether **log_bin** is enabled on the source by running the command: **SHOW VARIABLES LIKE 'log_bin';**

> [!NOTE]
> With Azure Database for MySQL Single Server, which supports up to 4TB, this is not enabled by default. However, if you promote a read replica for the source server and then delete read replica, the parameter is set to ON.

- Configure the **binlog_expire_logs_seconds** parameter on the source server to ensure that binlog files are not purged before the replica commits the changes. Post successful cutover, the value can be reset.

## Known issues and limitations

The known issues and limitations associated with Consistent Backup fall broadly into two categories: locks and retries.

> [!NOTE]
> The migration service runs the **START TRANSACTION WITH CONSISTENT SNAPSHOT** query for all the worker threads to get the server snapshot. But this is supported only by InnoDB. More info [here](https://dev.mysql.com/doc/refman/8.0/en/commit.html).

### Locks

Typically, it is a straightforward process to obtain a lock, which should take between a few seconds and a couple of minutes to complete. In a few scenarios, however, attempts to obtain a lock on the source server can fail.

- The presence of long running queries could result in unnecessary downtime, as DMS could lock a subset of the tables and then time out waiting for the last few to come available. Before starting the migration, check for any long running operations by running the **SHOW PROCESSLIST** command.  

- If the source server is experiencing a lot of write updates at the time a lock is requested, the lock cannot be readily obtained and could fail after the lock-wait timeout. This happens in the case of batch processing tasks in the tables, which when in progress may result in denying the request for a lock. As mentioned earlier, the lock requested is a single global-level lock for the entire server so even if a single table or database is under processing, the lock request would have to wait for the ongoing task to conclude.  

- Another limitation relates to migrating from an RDS source server. RDS does not support flush tables with read lock and **LOCK TABLE** query is run on the selected tables under the hood. As the tables are locked individually, the locking process can be less reliable, and locks can take longer to acquire.

### Retries

The migration handles transient connection issues and additional connections are typically provisioned upfront for this purpose. We look at the migration settings, particularly the number of parallel read operations on the source and apply a factor (typically ~1.5) and create as many connections up-front. This way the service makes sure we can keep operations running in parallel. At any point of time, if there is a connection loss or the service is unable to obtain a lock, the service uses the surplus connections provisioned to retry the migration. If all the provisioned connections are exhausted resulting in the loss of the point-in-time sync , the migration must be restarted from the beginning. In cases of both success and failure, all cleanup actions are undertaken by this offline migration service and the user does not have to perform any explicit cleanup actions.

## Next steps

- Learn more about [Data-in Replication](../mysql/concepts-data-in-replication.md)

- [Tutorial: Migrate MySQL to Azure Database for MySQL offline using DMS](tutorial-mysql-azure-mysql-offline-portal.md)
