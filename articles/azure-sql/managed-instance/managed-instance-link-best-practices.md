---
title: The link feature best practices
titleSuffix: Azure SQL Managed Instance
description: Learn about best practices when using the link feature for Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: guide
author: danimir
ms.author: danil
ms.reviewer: mathoma, danil
ms.date: 03/11/2022
---
# Best practices with link feature for Azure SQL Managed Instance (preview)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article outlines best practices when using the link feature for Azure SQL Managed Instance. The link feature for Azure SQL Managed Instance connects your SQL Servers hosted anywhere to SQL Managed Instance, providing near real-time data replication to the cloud. 

> [!NOTE]
> The link feature for Azure SQL Managed Instance is currently in preview. 

## Take log backups regularly

The link feature replicates data using the [Distributed availability groups](/sql/database-engine/availability-groups/windows/distributed-availability-groups) concept based on the Always On availability groups technology stack. Data replication with distributed availability groups is based on replicating transaction log records. No transaction log records can be truncated from the database on the primary instance until they're replicated to the database on the secondary instance. If transaction log record replication is slow or blocked due to network connection issues, the log file keeps growing on the primary instance. Growth speed depends on the intensity of workload and the network speed. If there's a prolonged network connection outage and heavy workload on primary instance, the log file may take all available storage space.

To minimize the risk of running out of space on your primary instance due to log file growth, make sure to **take database log backups regularly**. By taking log backups regularly, you make your database more resilient to unplanned log growth events. Consider scheduling daily log backup tasks using SQL Server Agent job.

You can use a Transact-SQL (T-SQL) script to back up the log file, such as the sample provided in this section. Replace the placeholders in the sample script with name of your database, name and path of the backup file, and the description.

To back up your transaction log, use the following sample Transact-SQL (T-SQL) script on SQL Server: 

```sql
-- Execute on SQL Server
USE [<DatabaseName>]
--Set current database inside job step or script
--Check that you are executing the script on the primary instance
if (SELECT role
	FROM sys.dm_hadr_availability_replica_states AS a
    JOIN sys.availability_replicas AS b
    ON b.replica_id = a.replica_id
WHERE b.replica_server_name = @@SERVERNAME) = 1
BEGIN
-- Take log backup
BACKUP LOG [<DatabaseName>]
TO  DISK = N'<DiskPathandFileName>'
WITH NOFORMAT, NOINIT,
NAME = N'<Description>', SKIP, NOREWIND, NOUNLOAD, COMPRESSION, STATS = 1
END
```

Use the following Transact-SQL (T-SQL) command to check the log spaced used by your database on SQL Server: 

```sql
-- Execute on SQL Server
DBCC SQLPERF(LOGSPACE); 
```

The query output looks like the following example below for sample database **tpcc**:

:::image type="content" source="./media/link-feature-best-practices/database-log-file-size.png" alt-text="Screenshot with results of the command showing log file size and space used":::

In this example, the database has used 76% of the available log, with an absolute log file size of approximately 27 GB (27,971 MB). The thresholds for action may vary based on your workload, but it's typically an indication that you should take a log backup to truncate the log file and free up some space. 

## Add startup trace flags

There are two trace flags (`-T1800` and `-T9567`) that, when added as start up parameters, can optimize the performance of data replication through the link. See [Enable startup trace flags](managed-instance-link-preparation.md#enable-startup-trace-flags) to learn more. 

## Next steps

To get started with the link feature, [prepare your environment for replication](managed-instance-link-preparation.md). 

For more information on the link feature, see the following articles:

- [Managed Instance link – overview](managed-instance-link-feature-overview.md)
- [Managed Instance link – connecting SQL Server to Azure reimagined](https://aka.ms/mi-link-techblog)
