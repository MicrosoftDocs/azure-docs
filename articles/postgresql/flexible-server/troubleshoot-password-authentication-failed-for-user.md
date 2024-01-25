---
title: Password authentication failed for user "<user-name>" - Azure Database for PostgreSQL - Flexible Server
description: Provides resolutions for a connection error - password authentication failed for user "<user-name>".
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: troubleshooting-error-codes
ms.author: alkuchar
author: AlicjaKucharczyk
ms.date: 01/23/2024
---

# Password authentication failed for user "<user-name>"
This article helps you solve a problem that might occur when connecting to Azure Database for PostgreSQL - Flexible Server.


## Symptoms
When attempting to connect to Azure Database for PostgreSQL - Flexible Server, you may encounter the following error messages:

```bash
psql: error: connection to server at "<server-name>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL:  password authentication failed for user "<user-name>"
```

This error indicates that the password provided for the user `<user-name>` is incorrect or not being accepted by the server.


```bash
connection to server at "<server-name>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL:  no pg_hba.conf entry for host "y.y.y.y", user "<user-name>", database "postgres", no encryption
```


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





