---
title: MySQL to Azure Database for MySQL Data Migration - MySQL Consistent Backup
description: Learn how to use the Azure Database for MySQL Data Migration - MySQL Consistent Backup for transaction consistency even without making the Source server read-only.
author: karlaescobar
ms.author: karlaescobar
ms.date: 04/19/2022
ms.service: dms
ms.topic: conceptual
ms.custom:
  - references_regions
  - sql-migration-content
---

# MySQL to Azure Database for MySQL Data Migration - MySQL Consistent Snapshot

MySQL Consistent Snapshot is a new feature that allows users to take a Consistent Snapshot of a MySQL server without losing data integrity at source because of ongoing CRUD (Create, Read, Update, and Delete) operations. Transactional consistency is achieved without the need to set the source server to read-only mode through this feature. Moreover, there are multiple data consistency options presented to the user - enable consistent snapshot with read lock (GA), enable consistent snapshot without locks (Preview), Make Source Server Read only and None. Selecting the 'None' option entails no extra measures are taken to ensure data consistency. We highly recommend selecting option 'Enable Consistent Snapshot without locks' to maintain transactional consistency.

:::image type="content" source="media/migrate-azure-mysql-consistent-backup/consistent-snapshot-options.png" alt-text="MySQL to Azure Database for MySQL Data Migration Wizard - Enable Transactional Consistency." lightbox="media/migrate-azure-mysql-consistent-backup/consistent-snapshot-options.png":::

## Enable Consistent Snapshot without locks (Preview)

When you enable this option, a reconciliation phase will occur after the initial load. This is to ensure that the data written to your target is transactionally consistent with the source server from a specific position in the binary log.

With this feature, we don't take a read lock on the server. We instead read tables at different point in time, while keeping track of the different binlog positions of each table. This aids to reconcile the tables towards the end of the initial load by performing replication in catchup mode to get a consistent snapshot.

:::image type="content" source="media/migrate-azure-mysql-consistent-backup/top-pane.png" alt-text="MySQL to Azure Database for MySQL Data Migration Wizard - migration progress." lightbox="media/migrate-azure-mysql-consistent-backup/top-pane.png":::

:::image type="content" source="media/migrate-azure-mysql-consistent-backup/reconciliation-tab.png" alt-text="MySQL to Azure Database for MySQL Data Migration Wizard - Reconciliation progress." lightbox="media/migrate-azure-mysql-consistent-backup/reconciliation-tab.png":::

Key features of Consistent Snapshot without locks:

* Ability to support heavy workload servers or servers with long-running transactions without the need for read locks.
* Resilient in completing migrations even in the event of failures caused by transient network/server blips that result in loss of all the pre-created connections.

### Enable Consistent Snapshot with read lock (GA)

When you enable this option, the service flushes all tables on the source server with a **read** lock to obtain the point-in-time snapshot. This flushing is done because a global lock is more reliable than attempting to lock individual databases or tables. As a result, even if you aren't migrating all databases in a server, they're locked as part of setting up the migration process. The migration service initiates a repeatable read and combines the current table state with contents of the undo log for the snapshot. The **snapshot** is generated after obtaining the server wide lock and spawning several connections for the migration. After the creation of all connections used for the migration, the locks on the table are released.

Repeatable reads are enabled to keep the undo logs accessible during the migration, which increases the storage required on the source because of long running connections. A long running migration with multiple table changes leads to an extensive undo log history that needs to be replayed and could also increase the compute requirements and load on the source server.

### Make the Source Server Read Only

 Selecting this option maintains the data integrity of the target database as the source is migrated by preventing Write/Delete operations on the source server during migration. When you make the source server read only as part of the migration process, the selection applies to all the source server’s databases, regardless of whether they're selected for migration.

Making the source server read only prevents users from modifying the data, rendering the database unavailable for any update operations. However, if this option isn't enabled, there is a possibility for data updates to occur during migration. As a result, migrated data could be inconsistent because the database snapshots would be read at different points in time.

## Prerequisites for Enable Consistent Snapshot with read lock

To complete the migration successfully with Consistent Snapshot with read lock enabled:

- Ensure that the user who is attempting to flush tables with a **read lock** has the RELOAD or FLUSH permission.

- Use the mysql client tool to determine whether log_bin is enabled on the source server. The Bin log isn't always turned on by default and should be checked to see if it is enabled before starting the migration. The mysql client tool is used to determine whether **log_bin** is enabled on the source by running the command: **SHOW VARIABLES LIKE 'log_bin';**

> [!NOTE]
> With Azure Database for MySQL Single Server, which supports up to 4TB, this is not enabled by default. However, if you promote a read replica for the source server and then delete read replica, the parameter is set to ON.

- Configure the **binlog_expire_logs_seconds** parameter on the source server to ensure that binlog files aren't purged before the replica commits the changes. Post successful cutover, the value can be reset.

## Known issues and limitations for Enable Consistent Snapshot without locks

- Tables with foreign keys having Cascade or Set Null on delete/on update clause aren't supported.
- No DDL changes should occur during initial load.

## Known issues and limitations for Enable Consistent Snapshot with read lock

The known issues and limitations associated with Consistent Backup fall broadly into two categories: locks and retries.

> [!NOTE]
> The migration service runs the **START TRANSACTION WITH CONSISTENT SNAPSHOT** query for all the worker threads to get the server snapshot. But this is supported only by InnoDB. More info [here](https://dev.mysql.com/doc/refman/8.0/en/commit.html).

### Locks

Typically, it's a straightforward process to obtain a lock, which should take between a few seconds and a couple of minutes to complete. In a few scenarios, however, attempts to obtain a lock on the source server can fail.

- The presence of long running queries could result in unnecessary downtime, as DMS could lock a subset of the tables and then time out waiting for the last few to come available. Before starting the migration, check for any long running operations by running the **SHOW PROCESSLIST** command.  

- If the source server is experiencing many write updates at the time a lock is requested, the lock cannot be readily obtained and could fail after the lock-wait timeout. This happens in the case of batch processing tasks in the tables, which when in progress may result in denying the request for a lock. As mentioned earlier, the lock requested is a single global-level lock for the entire server so even if a single table or database is under processing, the lock request would have to wait for the ongoing task to conclude.  

- Another limitation relates to migrating from an AWS RDS source server. RDS does not support flush tables with read lock and **LOCK TABLE** query is run on the selected tables under the hood. As the tables are locked individually, the locking process can be less reliable, and locks can take longer to acquire.

### Retries

The migration handles transient connection issues and additional connections are typically provisioned upfront for this purpose. We look at the migration settings, particularly the number of parallel read operations on the source and apply a factor (typically ~1.5) and create as many connections up-front. This way the service makes sure we can keep operations running in parallel. At any point of time, if there is a connection loss or the service is unable to obtain a lock, the service uses the surplus connections provisioned to retry the migration. If all the provisioned connections are exhausted resulting in the loss of the point-in-time sync, the migration must be restarted from the beginning. In cases of both success and failure, all cleanup actions are undertaken by this offline migration service and the user does not have to perform any explicit cleanup actions.

## Next steps

- Learn more about [Data-in Replication](../mysql/concepts-data-in-replication.md)

- [Tutorial: Migrate MySQL to Azure Database for MySQL offline using DMS](tutorial-mysql-azure-mysql-offline-portal.md)
