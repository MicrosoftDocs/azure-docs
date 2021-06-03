---
title: "Monitor backup activity"
titleSuffix: Azure SQL Managed Instance 
description: Learn how to monitor Azure SQL Managed Instance backup activity using extended events. 
services: sql-database
ms.service: sql-managed-instance
ms.subservice: backup-restore
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: Misliplavo 
ms.author: mlazic
ms.reviewer: mathoma
ms.date: 12/14/2018
---
# Monitor backup activity for Azure SQL Managed Instance 
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you to configure extended event (XEvent) sessions to monitor backup activity for [Azure SQL Managed Instance](sql-managed-instance-paas-overview). 

## Overview

Azure SQL Managed Instance emits events (also known as [Extended Events or XEvents](../database/xevent-db-diff-from-svr.md)) during backup activity for the purpose of reporting. Configure an XEvent session to track information such as backup status, backup type, size, time, and location within the msdb database. This information can be integrated with backup monitoring software and also used for the purpose of Enterprise Audit. 

Enterprise Audits may require proof of successful backups, time of backup, and duration of the backup.

## Configure XEvent session

Use the extended event `backup_restore_progress_trace` to record the progress of your SQL Managed Instance back up. 

Use Transact-SQL (T-SQL) to configure the XEvent session: 

```sql
CREATE EVENT SESSION [Backup trace] ON SERVER
ADD EVENT sqlserver.backup_restore_progress_trace(
WHERE operation_type = 0
AND trace_message LIKE '%100 percent%')
ADD TARGET package0.ring_buffer
WITH(STARTUP_STATE=ON)
GO
ALTER EVENT SESSION [Backup trace] ON SERVER
STATE = start;
```

This T-SQL snippet stores the XEvent session in the ring buffer, but it's also possible to write to [Azure Blob Storage](../database/xevent-code-event-file.md). 


## Monitor backup progress 

After the XEvent session is created, you can use Transact-SQL to query ring buffer results and monitor the progress of the backup.

The following Transact-SQL (T-SQL) query returns the name of the database, the total number of bytes processed, and the time the backup completed: 

```sql 
WITH
a AS (SELECT xed = CAST(xet.target_data AS xml)
FROM sys.dm_xe_session_targets AS xet
JOIN sys.dm_xe_sessions AS xe
ON (xe.address = xet.event_session_address)
WHERE xe.name = 'Backup trace'),
b AS(SELECT
d.n.value('(@timestamp)[1]', 'datetime2') AS [timestamp],
ISNULL(db.name, d.n.value('(data[@name="database_name"]/value)[1]', 'varchar(200)')) AS database_name,
d.n.value('(data[@name="trace_message"]/value)[1]', 'varchar(4000)') AS trace_message
FROM a
CROSS APPLY  xed.nodes('/RingBufferTarget/event') d(n)
LEFT JOIN master.sys.databases db
ON db.physical_database_name = d.n.value('(data[@name="database_name"]/value)[1]', 'varchar(200)'))
SELECT * FROM b
```

The following screenshot shows an example of the output of the above query: 




## Next steps

Once your backup has completed, you can then [restore to a point in time](point-in-time-restore.md) or [configure a long-term retention policy](long-term-backup-retention-configure.md). 

To learn more, see [automated backups](../database/automated-backups-overview.md). 