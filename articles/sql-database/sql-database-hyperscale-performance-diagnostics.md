---
title: Azure SQL Database - performance diagnostics in the Hyperscale service tier | Microsoft Docs
description: This article describes how to troubleshoot Hyperscale performance problems in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.topic: troubleshooting
author: denzilribeiro
ms.author: denzilr
ms.reviewer: sstein
ms.date: 10/18/2019
---


# SQL Hyperscale performance troubleshooting diagnostics


To troubleshoot performance problems in a Hyperscale database, [general performance tuning methodologies](sql-database-monitor-tune-overview.md) on the Azure SQL database compute node is the starting point of a performance investigation. However, given the [distributed architecture](sql-database-service-tier-hyperscale.md#distributed-functions-architecture) of Hyperscale, additional diagnostics have been added to assist. This article describes Hyperscale-specific diagnostic data.


## Log rate throttling waits


Every Azure SQL Database service level has log generation rate limits enforced via [log rate governance](sql-database-resource-limits-database-server.md#transaction-log-rate-governance). In Hyperscale, the log generation limit is currently set to 100 MB/sec, regardless of the service level. However, there are times when the log generation rate on the primary compute replica has to be throttled to maintain recoverability SLAs. This throttling happens when a [page server or another compute replica](sql-database-service-tier-hyperscale.md#distributed-functions-architecture) is significantly behind applying new log records from the Log service.

The following wait types (in [sys.dm_os_wait_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql/)) describe the reasons why log rate can be throttled on the primary compute replica:

|Wait Type    |Description                         |
|-------------          |------------------------------------|
|RBIO_RG_STORAGE        | Occurs when a Hyperscale database primary compute node log generation rate is being throttled due to delayed log consumption at the page server(s).         |
|RBIO_RG_DESTAGE        | Occurs when a Hyperscale database compute node log generation rate is being throttled due to delayed log consumption by the long-term log storage.         |
|RBIO_RG_REPLICA        | Occurs when a Hyperscale database compute node log generation rate is being throttled due to delayed log consumption by the readable secondary replica(s).         |
|RBIO_RG_LOCALDESTAGE   | Occurs when a Hyperscale database compute node log generation rate is being throttled due to delayed log consumption by the log service.         |


## Page Server Reads

The compute replicas do not cache a full copy of the database locally. The data local to the compute replica is stored in the Buffer Pool (in memory) and in the local Resilient Buffer Pool Extension (RBPEX) cache that is a partial (non-covering) cache of data pages. This local RBPEX cache is sized proportionally to the compute size and is 3 times the memory of the compute tier. RBPEX is similar to the Buffer Pool in that it has the most frequently accessed data. Each page server, on the other hand, has a covering RBPEX cache for the portion of the database it maintains.
 
When a read is issued on a compute replica, if the data doesn't exist in the Buffer Pool or local RBPEX cache, a getPage(pageId, LSN) function call is issued, and the page is fetched from the corresponding page server. Reads from page servers are remote reads and are thus slower than reads from the local RBPEX. When troubleshooting IO-related performance problems, we need to be able to tell how many IOs were done via relatively slower remote page server reads.

Several DMVs and extended events have columns and fields that specify the number of remote reads from a page server which can be compared against the total reads. 

- Columns to report page server reads are available in execution DMVs, such as:
    - [sys.dm_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql/)
    - [sys.dm_exec_query_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-stats-transact-sql/)
    - [sys.dm_exec_procedure_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-procedure-stats-transact-sql/)
    - [sys.dm_exec_trigger_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-trigger-stats-transact-sql/)
- Page server reads are added to the following extended events:
    - sql_statement_completed
    - sp_statement_completed
    - sql_batch_completed
    - rpc_completed
    - scan_stopped
    - query_store_begin_persist_runtime_stat
    - query-store_execution_runtime_info
- ActualPageServerReads/ActualPageServerReadAheads are added to query plan XML for actual plans. For example:

`<RunTimeCountersPerThread Thread="8" ActualRows="90466461" ActualRowsRead="90466461" Batches="0" ActualEndOfScans="1" ActualExecutions="1" ActualExecutionMode="Row" ActualElapsedms="133645" ActualCPUms="85105" ActualScans="1" ActualLogicalReads="6032256" ActualPhysicalReads="0" ActualPageServerReads="0" ActualReadAheads="6027814" ActualPageServerReadAheads="5687297" ActualLobLogicalReads="0" ActualLobPhysicalReads="0" ActualLobPageServerReads="0" ActualLobReadAheads="0" ActualLobPageServerReadAheads="0" />`

> [!NOTE]
> To view these attributes in the query plan properties window in SSMS you will need SSMS 18.3 or later.


## Virtual File Stats and IO accounting

In Azure SQL Database, the [sys.dm_io_virtual_file_stats()](/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql/) DMF is the primary way to monitor SQL Server IO. IO characteristics on Hyperscale are different due to its [distributed architecture](sql-database-service-tier-hyperscale.md#distributed-functions-architecture). In this section, we focus on IO (reads and writes) to data files as seen in this DMF. In Hyperscale, each data file visible in this DMF corresponds to a remote page server. The RBPEX cache mentioned here is a local SSD-based cache that is a non-covering cache on the compute replica.


### Local RBPEX cache usage

Local RBPEX cache exists on the compute node on local SSD storage. Thus, IO on this RBPEX cache is faster than IO on remote page servers. Currently, [sys.dm_io_virtual_file_stats()](/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql/) in a Hyperscale database has a special row reporting the IO done on the local RBPEX cache on the compute replica. This row has the value of 0 for both `database_id` and `file_id` columns. For example, the query below returns RBPEX usage statistics since database startup.

`select * from sys.dm_io_virtual_file_stats(0,NULL);`

A ratio of reads done on RBPEX to aggregated reads done on all other data files provides the RBPEX cache hit ratio.


### Data Reads

- When reads are issued by the SQL Server engine on a compute replica, they may be served either by the local RBPEX cache, or by remote page servers, or by a combination of the two if reading multiple pages.
- When the compute replica reads some pages from a specific file, for example file_id 1, if this data resides solely on the local RBPEX cache, all IO for this read is accounted against file_id 0 (RBPEX). If some part of that data is in the local RBPEX cache, and some part is on a remote page server, then IO is accounted towards file_id 0 for the part served from RBPEX, and the part served from the remote page server is accounted towards file_id 1. 
- When a compute replica requests a page at a particular [LSN](/sql/relational-databases/sql-server-transaction-log-architecture-and-management-guide/) from a page server, if the page server has not caught up to the LSN requested, the read on the compute replica will wait until the page server catches up before the page is returned to the compute replica. For any read from a page server on the compute replica, you will see the PAGEIOLATCH_* wait type if it is waiting on that IO. This wait time includes both the time to catch up the requested page on the page server to the LSN required, and the time needed to transfer the page from the page server to the compute replica.
- Large reads such as read-ahead are often done using ["Scatter-Gather" Reads](/sql/relational-databases/reading-pages/). This allows reads of up to 4 MB of pages at a time, considered a single read in the SQL Server engine. However, when data being read is in RBPEX, these reads are accounted as multiple individual 8 KB reads since the buffer pool and RBPEX always use 8 KB pages. As the result, the number of read IOs seen against RBPEX may be larger than the actual number of IOs performed by the engine.


### Data Writes

- The primary compute replica does not write directly to page servers. Instead, log records from the Log service are replayed on corresponding page servers. 
- Writes that happen on the compute replica are predominantly writes to the local RBPEX (file_id 0). For writes on logical files that are larger than 8 KB, i.e. those done using [Gather-write](/sql/relational-databases/writing-pages/), each write operation is translated into multiple 8 KB individual writes to RBPEX since the buffer pool and RBPEX always use 8 KB pages. As the result, the number of write IOs seen against RBPEX may be larger than the actual number of IOs performed by the engine.
- Non-RBPEX files, or data files other than file_id 0 that correspond to page servers, also show writes. In the Hyperscale service tier, these writes are simulated, because the compute replicas never write directly to page servers. Write IOPS and throughput are accounted as they occur on the compute replica, but latency for data files other than file_id 0 does not reflect the actual latency of page server writes.

### Log Writes

- On the primary compute, a log write is accounted for in file_id 2 of sys.dm_io_virtual_file_stats. A log write on primary compute is a write to the log Landing Zone.
- Log records are not hardened on the secondary replica on a commit. In Hyperscale, log is applied by the Xlog service to the remote replicas. Because log writes don't actually occur on secondary replicas, any accounting of Log IO's on the secondary replicas is for tracking purposes only.

## Additional Resources

- For vCore resource limits for a hyperscale single database see [Hyperscale service tier vCore Limits](sql-database-vcore-resource-limits-single-databases.md#hyperscale---provisioned-compute---gen5)
- For Azure SQL Database performance tuning, see [Query performance in Azure SQL Database](sql-database-performance-guidance.md)
- For performance tuning using Query Store, see [Performance monitoring using Query store](/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store/)
- For DMV monitoring scripts, see [Monitoring performance Azure SQL Database using dynamic management views](sql-database-monitoring-with-dmvs.md)
