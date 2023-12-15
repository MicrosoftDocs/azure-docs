---
title: Canceling statement due to conflict with recovery - Azure Database for PostgreSQL - Flexible Server
description: Provides resolutions for a read replica error - Canceling statement due to conflict with recovery.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: troubleshooting-error-codes
ms.author: alkuchar
author: AlicjaKucharczyk
ms.date: 10/5/2023
---

# Canceling statement due to conflict with recovery
This article helps you solve a problem that occurs during executing queries against read replica.


## Symptoms
1. When attempting to execute a query on a read replica, the query is unexpectedly terminated.
2. Error messages such as "Canceling statement due to conflict with recovery" appear in the logs or in the query output.
3. There might be a noticeable delay or lag in replication from the primary to the read replica.

In the provided screenshot, on the left is the primary Azure Database for PostgreSQL - Flexible Server instance, and on the right is the read replica.

:::image type="content" source="./media/troubleshoot-canceling-statement-due-to-conflict-with-recovery/canceling-statement-due-to-conflict-with-recovery.png" alt-text="Screenshot showing triggering of Canceling statement due to conflict with recovery error":::

* **Read replica console (right side of the screenshot above)**
  *   We can observe a lengthy `SELECT` statement in progress. A vital aspect to note about SQL is its consistent view of the data. When an SQL statement is executed, it essentially "freezes" its view of the data. Throughout its execution, the SQL statement always sees a consistent snapshot of the data, even if changes are occurring concurrently elsewhere.
* **Primary console (left side of the screenshot above)**
  * An `UPDATE` operation has been executed. While an `UPDATE` by itself doesn't necessarily disrupt the behavior of the read replica, the subsequent operation does. After the update, a `VACUUM` operation (in this case, manually triggered for demonstration purposes, but it's noteworthy that an autovacuum process could also be initiated automatically) is executed.
  * The `VACUUM`'s role is to reclaim space by removing old versions of rows. Given that the read replica is running a lengthy `SELECT` statement, it's currently accessing some of these rows that `VACUUM` targets for removal.
  * These changes initiated by the `VACUUM` operation, which include the removal of rows, get logged into the Write-Ahead Log (`WAL`). As Azure Database for PostgreSQL Flexible Server read replicas utilize native PostgreSQL physical replication, these changes are later sent to the read replica.
  * Here lies the crux of the issue: the `VACUUM` operation, unaware of the ongoing `SELECT` statement on the read replica, removes rows that the read replica still needs. This scenario results in what's known as a replication conflict.

The aftermath of this scenario is that the read replica experiences a replication conflict due to the rows removed by the `VACUUM` operation. By default, the read replica attempts to resolve this conflict for a duration of 30 seconds, since the default value of `max_standby_streaming_delay` is set to 30 seconds. After this duration, if the conflict remains unresolved, the query on the read replica is canceled.

## Cause
The root cause of this issue is that the read replica in PostgreSQL is a continuously recovering system. This situation means that while the replica is catching up with the primary, it's essentially in a state of constant recovery.
If a query on a read replica tries to read a row that is simultaneously being updated by the recovery process (because the primary has made a change), PostgreSQL might cancel the query to allow the recovery to proceed without interruption.

## Resolution
1. **Adjust `max_standby_streaming_delay`**:  Increase the `max_standby_streaming_delay` parameter on the read replica. Increasing the value of the setting allows the replica more time to resolve conflicts before it decides to cancel a query. However, this might also increase replication lag, so it's a trade-off. This parameter is dynamic, meaning changes take effect without requiring a server restart.
2. **Monitor and Optimize Queries**: Review the types and frequencies of queries run against the read replica. Long-running or complex queries might be more susceptible to conflicts. Optimizing or scheduling them differently can help.
3. **Off-Peak Query Execution**: Consider running heavy or long-running queries during off-peak hours to reduce the chances of a conflict.
4. **Enable `hot_standby_feedback`**: Consider setting `hot_standby_feedback` to `on` on the read replica. When enabled, it informs the primary server about the queries currently being executed by the replica. This prevents the primary from removing rows that are still needed by the replica, reducing the likelihood of a replication conflict. This parameter is dynamic, meaning changes take effect without requiring a server restart.

> [!CAUTION]
> Enabling `hot_standby_feedback` can lead to the following potential issues:
>* This setting can prevent some necessary cleanup operations on the primary, potentially leading to table bloat (increased disk space usage due to unvacuumed old row versions).
>* Regular monitoring of the primary's disk space and table sizes is essential. Learn more about monitoring for Azure Database for PostgreSQL - Flexible Server [here](concepts-monitoring.md).
>* Be prepared to manage potential table bloat manually if it becomes problematic. Consider enabling [autovacuum tuning](how-to-enable-intelligent-performance-portal.md) in Azure Database for PostgreSQL - Flexible Server to help mitigate this issue.

5. **Adjust `max_standby_archive_delay`**: The `max_standby_archive_delay` server parameter specifies the maximum delay that the server will allow when reading archived `WAL` data. If the replica of Azure Database for PostgreSQL - Flexible Server ever switches from streaming mode to file-based log shipping (though rare), tweaking this value can help resolve the query cancellation issue.





