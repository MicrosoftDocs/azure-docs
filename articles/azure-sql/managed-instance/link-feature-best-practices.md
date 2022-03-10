---
title: The link feature best practices
titleSuffix: Azure SQL Managed Instance
description: Learn about the best practices with link feature for Azure SQL Managed Instance
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: MladjoA
ms.author: mlandzic
ms.reviewer: mathoma, danil
ms.date: 03/10/2022
---
# Best practices with link feature for Azure SQL Managed Instance (preview)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article outlines best practices with using the link feature for Azure SQL Managed Instance. The link feature for Azure SQL Managed Instance connects your SQL Servers hosted anywhere to SQL Managed Instance, providing near real-time data replication to the cloud. 

> [!NOTE]
> The link feature for Azure SQL Managed Instance is currently in preview. 

## Taking log backups regularly

The link feature replicates data using [Distributed availability groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/distributed-availability-groups) concept based on SQL Server Always On availability groups technology stack. Data replication with distributed availability groups is based on replicating transaction log records. No transaction log records can be truncated from the database on primary instance until they're distributed to the database on secondary instance. In case that transaction log record distribution is slow or blocked due to network connection issue, the log file will keep growing. Growth speed depends on the intensity of workload and the network speed. If there's a prolonged network connection outage and heavy workload on primary instance, the log file may take all available storage space.

> [!IMPORTANT]
> To minimize risk of running out of space on your primary instance due to log file growth, make sure to keep the usual log file size under control by taking database log backups regularly. By taking log backups regularly, you make your database more resilient to unplanned log growth events. Consider scheduling daily log backup tasks using SQL Server Agent job.

You can use the following sample script for backing up log file. Replace the placeholders in the sample script with name of your database, path and name of the backup file, and the description, respectively:
```sql

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

At any time you can execute the following command to check the log space used by your databases:
```sql
DBCC SQLPERF(LOGSPACE); 
```

The query output will look like in the example below for fictive database "tpcc":

:::image type="content" source="./media/link-feature-best-practices/database-log-file-size.png" alt-text="Screenshot with results of the command showing log file size and space used":::

In the example, database has used 76% of the log  available, with absolute log file size of approximately 27 GB (27,971 MB). Thresholds for action may vary based on your workload, but its typically indication that log backup should be taken to truncate log file and free up some space. 

## Next steps

For more information on the link feature, see the following articles:

- [Managed Instance link – overview](link-feature.md).
- [Managed Instance link – connecting SQL Server to Azure reimagined](https://aka.ms/mi-link-techblog).