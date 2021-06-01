---
title: Troubleshoot transaction log issues 
titleSuffix: Azure SQL Database and Azure SQL Managed Instance
description: Provides steps to troubleshoot Azure SQL Database transaction log issues in Azure SQL Database or Azure SQL Managed Instance 
services: sql-database
ms.service: sql-db-mi
ms.subservice: development
ms.topic: troubleshooting
ms.custom: 
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: 
ms.date: 05/05/2021
---

# Troubleshooting transaction log errors with Azure SQL Database and Azure SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

You may see errors 9002 or 40552 when the transaction log is full and cannot accept new transactions. These errors occur when the database transaction log, managed by Azure SQL Database or Azure SQL Managed Instance, exceeds thresholds for space and cannot continue to accept transactions. 

These errors are similar to issues with a full transaction log in SQL Server, but have different resolutions in Azure SQL Database or Azure SQL Managed Instance.

> [!NOTE]
> **This article is focused on Azure SQL Database and Azure SQL Managed Instance.** Azure SQL Database and Azure SQL Managed Instance are based on the latest stable version of the Microsoft SQL Server database engine, so much of the content is similar though troubleshooting options and tools may differ. For more on blocking in SQL Server, see [Troubleshoot a Full Transaction Log (SQL Server Error 9002)](/sql/relational-databases/logs/troubleshoot-a-full-transaction-log-sql-server-error-9002.md).

## Automated backups and the transaction log

There are some key differences in Azure SQL Database and Azure SQL Managed Instance in regards to database file space management. 

- In Azure SQL Database or Azure SQL Managed Instance, transaction log backup are taken automatically. For frequency, retention, and more information, see [Automated backups - Azure SQL Database & SQL Managed Instance](automated-backups-overview.md). 
- In Azure SQL Database, free disk space, database file growth, and file location are also managed, so the typical causes and resolutions of transaction log issues are different from SQL Server. 
- In Azure SQL Managed Instance, the location and name of database files cannot be managed but administrators can manage database files and file autogrowth settings. The typical causes and resolutions of transaction log issues are similar to SQL Server. 

Similar to SQL Server, the transaction log for each database is truncated whenever a log backup is taken. Truncation leaves empty space in the log file, which can then access new transactions. When the log file cannot be truncated by log backups, the log file grows to accommodate new transactions. If the log file grows to its maximum limits in Azure SQL Database or Azure SQL Managed Instance, new transactions cannot be accepted. This is a very unusual scenario.

## Prevented transaction log truncation

To discover what is preventing log truncation in a given case, refer to  `log_reuse_wait_desc` in `sys.databases`. The log reuse wait informs you to what conditions or causes are preventing the transaction log from being truncated by a regular log backup. For more information, see [sys.databases &#40;Transact-SQL&#41;](/sql/relational-databases/system-catalog-views/sys-databases-transact-sql.md). 

```sql
SELECT [name], log_reuse_wait_desc FROM sys.databases;
```

The following values of `log_reuse_wait_desc` in `sys.databases` may indicate the reason why the database's transaction log truncation is being prevented:

| log_reuse_wait_desc | Diagnosis | Response required |
|--|--|--|
| **Nothing** | Typical state. There is nothing blocking the log from truncating. | No. |
| **Checkpoint** | A checkpoint is needed for log truncation. Rare. | No response required unless sustained. If sustained, file a support request with [Azure Support](https://portal.azure.com/#create/Microsoft.Support). | 
| **Log Backup** | A log backup is in progress. | No response required unless sustained. If sustained, file a support request with [Azure Support](https://portal.azure.com/#create/Microsoft.Support). | 
| **Active backup or restore** | A database backup is in progress. | No response required unless sustained. If sustained, file a support request with [Azure Support](https://portal.azure.com/#create/Microsoft.Support). | 
| **Active transaction** | An ongoing transaction is preventing log truncation. | The log file cannot be truncated due to active and/or uncommitted transactions. See next section.| 
| **AVAILABILITY_REPLICA** | Synchronization to the secondary replica is in progress. | No response required unless sustained. If sustained, file a support request with [Azure Support](https://portal.azure.com/#create/Microsoft.Support). | 


### Log truncation prevented by an active transaction

The most common scenario for a transaction log that cannot accept new transactions is a long-running or blocked transaction.

Run this sample query to find the actively executing queries and their current SQL batch text or input buffer text, using the [sys.dm_exec_sql_text](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sql-text-transact-sql) or [sys.dm_exec_input_buffer](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-input-buffer-transact-sql) DMVs. If the data returned by the `text` field of `sys.dm_exec_sql_text` is NULL, the query is not currently executing. In that case, the `event_info` field of `sys.dm_exec_input_buffer` will contain the last command string passed to the SQL engine. This query can also be used to identify sessions blocking other sessions, including a list of sessions blocked per `session_id`. For more information on blocking, see [Gather blocking information](understand-resolve-blocking.md#gather-blocking-information). 

```sql
WITH cteBL (session_id, blocking_these) AS 
(SELECT s.session_id, blocking_these = x.blocking_these FROM sys.dm_exec_sessions s 
CROSS APPLY    (SELECT isnull(convert(varchar(6), er.session_id),'') + ', '  
                FROM sys.dm_exec_requests as er
                WHERE er.blocking_session_id = isnull(s.session_id ,0)
                AND er.blocking_session_id <> 0
                FOR XML PATH('') ) AS x (blocking_these)
)
SELECT s.session_id, blocked_by = r.blocking_session_id, bl.blocking_these
, batch_text = t.text, input_buffer = ib.event_info, * 
FROM sys.dm_exec_sessions s 
LEFT OUTER JOIN sys.dm_exec_requests r on r.session_id = s.session_id
INNER JOIN cteBL as bl on s.session_id = bl.session_id
OUTER APPLY sys.dm_exec_sql_text (r.sql_handle) t
OUTER APPLY sys.dm_exec_input_buffer(s.session_id, NULL) AS ib
WHERE blocking_these is not null or r.blocking_session_id > 0
ORDER BY len(bl.blocking_these) desc, r.blocking_session_id desc, r.session_id;
```


### File management to free more space

If the transaction log is prevented from truncating, freeing more space in the allocation of database files may be part of the solution. However, resolving the root the condition blocking transaction log file truncation is key. 

In some cases, temporarily creating more disk space will allow a long-running transaction to complete, removing the condition blocking the transaction log file from truncating with a normal transaction log backup. However, freeing up space in the allocation may provide only temporary relief until the transaction log grows again. 

For more information on managing the file space of databases and elastic pools, see [Manage file space for databases in Azure SQL Database](file-space-manage.md).


### Error 40552: The session has been terminated because of excessive transaction log space usage

``40552: The session has been terminated because of excessive transaction log space usage. Try modifying fewer rows in a single transaction.``

To resolve this issue, try the following methods:

1. The issue can occur because of insert, update, or delete operations. Review the transaction to avoid unnecessary writes. Try to reduce the number of rows that are operated on immediately by implementing batching or splitting into multiple smaller transactions. For more information, see [How to use batching to improve SQL Database application performance](../performance-improve-use-batching.md).
2. The issue can occur because of index rebuild operations. To work around this issue, make sure the number of rows that are affected in the table * (average size of field that's updated in bytes + 80) < 2 gigabytes (GB). For large tables, consider creating partitions and performing index maintenance only on some partitions of the table. For more information, see [Create Partitioned Tables and Indexes](/sql/relational-databases/partitions/create-partitioned-tables-and-indexes?view=azuresqldb-current&preserve-view=true).
3. If you perform bulk inserts using the `bcp.exe` utility or the `System.Data.SqlClient.SqlBulkCopy` class, try using the `-b batchsize` or `BatchSize` options to limit the number of rows copied to the server in each transaction. For more information, see [bcp Utility](/sql/tools/bcp-utility).
4. If you are rebuilding an index with the `ALTER INDEX` statement, use the `SORT_IN_TEMPDB = ON` and `ONLINE = ON` options. For more information, see [ALTER INDEX (Transact-SQL)](/sql/t-sql/statements/alter-index-transact-sql).

> [!NOTE]
> For more information on other resource governor errors, see [Resource governance errors](troubleshoot-common-errors-issues.md#resource-governance-errors).

## Next steps


- [Troubleshooting connectivity issues and other errors with Azure SQL Database and Azure SQL Managed Instance](troubleshoot-common-errors-issues.md)
- [Troubleshoot transient connection errors in SQL Database and SQL Managed Instance](troubleshoot-common-connectivity-issues.md)


For information on transaction log sizes, see: 
- For vCore resource limits for a single database, see [resource limits for single databases using the vCore purchasing model](resource-limits-vcore-single-databases.md)
- For vCore resource limits for elastic pools, see [resource limits for elastic pools using the vCore purchasing model](resource-limits-vcore-elastic-pools.md)
- For DTU resource limits for a single database, see [resource limits for single databases using the DTU purchasing model](resource-limits-dtu-single-databases.md)
- For DTU resource limits for elastic pools, see [resource limits for elastic pools using the DTU purchasing model](resource-limits-dtu-elastic-pools.md)
- For resource limits for SQL Managed Instance, see [resource limits for SQL Managed Instance](../managed-instance/resource-limits.md).

