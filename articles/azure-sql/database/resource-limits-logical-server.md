---
title: Resource limits for logical servers in Azure 
description: This article provides an overview of the resource limits for the logical server in Azure used by Azure SQL Database and Azure Synapse Analytics. It also provides information regarding what happens when those resource limits are hit or exceeded.
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: sashan,moslake,josack
ms.date: 06/10/2020
---

# Resource limits for Azure SQL Database and Azure Synapse Analytics servers
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]

This article provides an overview of the resource limits for the logical server used by Azure SQL Database and Azure Synapse Analytics. It provides information on what happens when those resource limits are hit or exceeded and describes the resource governance mechanisms used to enforce these limits.

> [!NOTE]
> For Azure SQL Managed Instance limits, see [SQL Database resource limits for managed instances](../managed-instance/resource-limits.md).

## Maximum resource limits

| Resource | Limit |
| :--- | :--- |
| Databases per server | 5000 |
| Default number of servers per subscription in any region | 20 |
| Max number of servers per subscription in any region | 200 |  
| DTU / eDTU quota per server | 54,000 |  
| vCore quota per server/instance | 540 |
| Max pools per server | Limited by number of DTUs or vCores. For example, if each pool is 1000 DTUs, then a server can support 54 pools.|
|||

> [!IMPORTANT]
> As the number of databases approaches the limit per server, the following can occur:
>
> - Increasing latency in running queries against the master database.  This includes views of resource utilization statistics such as sys.resource_stats.
> - Increasing latency in management operations and rendering portal viewpoints that involve enumerating databases in the server.

> [!NOTE]
> To obtain more DTU/eDTU quota, vCore quota, or more servers than the default amount, submit a new support request in the Azure portal. For more information, see [Request quota increases for Azure SQL Database](quota-increase-request.md).

### Storage size

For single databases resource storage sizes, refer to either [DTU-based resource limits](resource-limits-dtu-single-databases.md) or [vCore-based resource limits](resource-limits-vcore-single-databases.md) for the storage size limits per pricing tier.

## What happens when database resource limits are reached

### Compute CPU

When database compute CPU utilization becomes high, query latency increases, and queries can even time out. Under these conditions, queries may be queued by the service and are provided resources for execution as resources become free.
When encountering high compute utilization, mitigation options include:

- Increasing the compute size of the database or elastic pool to provide the database with more compute resources. See [Scale single database resources](single-database-scale.md) and [Scale elastic pool resources](elastic-pool-scale.md).
- Optimizing queries to reduce CPU resource utilization of each query. For more information, see [Query Tuning/Hinting](performance-guidance.md#query-tuning-and-hinting).

### Storage

When database space used reaches the max size limit, database inserts and updates that increase the data size fail and clients receive an [error message](troubleshoot-common-errors-issues.md). SELECT and DELETE statements continue to succeed.

When encountering high space utilization, mitigation options include:

- Increasing the max size of the database or elastic pool, or adding more storage. See [Scale single database resources](single-database-scale.md) and [Scale elastic pool resources](elastic-pool-scale.md).
- If the database is in an elastic pool, then alternatively the database can be moved outside of the pool so that its storage space isn't shared with other databases.
- Shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](file-space-manage.md)

### Sessions and workers (requests)

The maximum numbers of sessions and workers are determined by the service tier and compute size (DTUs/eDTUs or vCores). New requests are rejected when session or worker limits are reached, and clients receive an error message. While the number of connections available can be controlled by the application, the number of concurrent workers is often harder to estimate and control. This is especially true during peak load periods when database resource limits are reached and workers pile up due to longer running queries, large blocking chains, or excessive query parallelism.

When encountering high session or worker utilization, mitigation options include:

- Increasing the service tier or compute size of the database or elastic pool. See [Scale single database resources](single-database-scale.md) and [Scale elastic pool resources](elastic-pool-scale.md).
- Optimizing queries to reduce the resource utilization of each query if the cause of increased worker utilization is due to contention for compute resources. For more information, see [Query Tuning/Hinting](performance-guidance.md#query-tuning-and-hinting).
- Reducing the [MAXDOP](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-the-max-degree-of-parallelism-server-configuration-option#Guidelines) (maximum degree of parallelism) setting.
- Optimizing query workload to reduce number of occurrences and duration of query blocking.

### Memory

Unlike other resources (CPU, workers, storage), reaching the memory limit does not negatively impact query performance, and does not cause errors and failures. As described in detail in [Memory Management Architecture Guide](https://docs.microsoft.com/sql/relational-databases/memory-management-architecture-guide), the SQL Server database engine often uses all available memory, by design. Memory is used primarily for caching data, to avoid more expensive storage access. Thus, higher memory utilization usually improves query performance due to faster reads from memory, rather than slower reads from storage.

After database engine startup, as the workload starts to read data from storage, the database engine aggressively caches data in memory. After this initial ramp-up period, it is common and expected to see the `avg_memory_usage_percent` and `avg_instance_memory_percent` columns in [sys.dm_db_resource_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database) to be close or equal to 100%, particularly for databases that are not idle, and do not fully fit in memory.

Besides the data cache, memory is used in other components of the database engine. When there is demand for memory and all available memory has been used by the data cache, the database engine will dynamically shrink data cache size to make memory available to other components, and will dynamically grow data cache when other components release memory.

In rare cases, a sufficiently demanding workload may cause an insufficient memory condition, leading to out-of-memory errors. This can happen at any level of memory utilization between 0% and 100%. This is more likely to occur on smaller compute sizes that have proportionally smaller memory limits, and/or with workloads using more memory for query processing, such as in [dense elastic pools](elastic-pool-resource-management.md).

When encountering out-of-memory errors, mitigation options include:
- Increasing the service tier or compute size of the database or elastic pool. See [Scale single database resources](single-database-scale.md) and [Scale elastic pool resources](elastic-pool-scale.md).
- Optimizing queries and configuration to reduce memory utilization. Common solutions are described in the following table.

|Solution|Description|
| :----- | :----- |
|Reduce the size of memory grants|For more information about memory grants, see the [Understanding SQL Server memory grant](https://techcommunity.microsoft.com/t5/sql-server/understanding-sql-server-memory-grant/ba-p/383595) blog post. A common solution for avoiding excessively large memory grants is keeping [statistics](https://docs.microsoft.com/sql/relational-databases/statistics/statistics) up to date. This results in more accurate estimates of memory consumption by the query engine, avoiding unnecessarily large memory grants.</br></br>In databases using compatibility level 140 and later, the database engine may automatically adjust memory grant size using [Batch mode memory grant feedback](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing?view=sql-server-ver15#batch-mode-memory-grant-feedback). In databases using compatibility level 150 and later, the database engine similarly uses [Row mode memory grant feedback](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing?view=sql-server-ver15#row-mode-memory-grant-feedback), for more common row mode queries. This built-in functionality helps avoid out-of-memory errors due to unnecessarily large memory grants.|
|Reduce the size of query plan cache|The database engine caches query plans in memory, to avoid compiling a query plan for every query execution. To avoid query plan cache bloat caused by caching plans that are only used once, enable the OPTIMIZE_FOR_AD_HOC_WORKLOADS [database-scoped configuration](https://docs.microsoft.com/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql).|
|Reduce the size of lock memory|The database engine uses memory for [locks](https://docs.microsoft.com/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#Lock_Engine). When possible, avoid large transactions that may acquire a large number of locks and cause high lock memory consumption.|


## Resource consumption by user workloads and internal processes

CPU and memory consumption by user workloads in each database is reported in the [sys.dm_db_resource_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database?view=azuresqldb-current) and [sys.resource_stats](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-resource-stats-azure-sql-database?view=azuresqldb-current) views, in `avg_cpu_percent` and `avg_memory_usage_percent` columns. For elastic pools, pool-level resource consumption is reported in the [sys.elastic_pool_resource_stats](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-elastic-pool-resource-stats-azure-sql-database) view. User workload CPU consumption is also reported via the `cpu_percent` Azure Monitor metric, for [single databases](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported#microsoftsqlserversdatabases) and [elastic pools](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported#microsoftsqlserverselasticpools) at the pool level.

Azure SQL Database requires compute resources to implement core service features such as high availability and disaster recovery, database backup and restore, monitoring, Query Store, Automatic tuning, etc. The system sets aside a certain limited portion of the overall resources for these internal processes using [resource governance](#resource-governance) mechanisms, making the remainder of resources available for user workloads. At times when internal processes aren't using compute resources, the system makes them available to user workloads.

Total CPU and memory consumption by user workloads and internal processes is reported in the [sys.dm_db_resource_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database?view=azuresqldb-current) and [sys.resource_stats](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-resource-stats-azure-sql-database?view=azuresqldb-current) views, in `avg_instance_cpu_percent` and `avg_instance_memory_percent` columns. This data is also reported via the `sqlserver_process_core_percent` and `sqlserver_process_memory_percent` Azure Monitor metrics, for [single databases](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported#microsoftsqlserversdatabases) and [elastic pools](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported#microsoftsqlserverselasticpools) at the pool level.

A more detailed breakdown of recent resource consumption by user workloads and internal processes is reported in the [sys.dm_resource_governor_resource_pools_history_ex](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-resource-governor-resource-pools-history-ex-azure-sql-database) and [sys.dm_resource_governor_workload_groups_history_ex](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-resource-governor-workload-groups-history-ex-azure-sql-database) views. For details on resource pools and workload groups referenced in these views, see [Resource governance](#resource-governance). These views report on resource utilization by user workloads and specific internal processes in the associated resource pools and workload groups.

In the context of performance monitoring and troubleshooting, it's important to consider both **user CPU consumption** (`avg_cpu_percent`, `cpu_percent`), and **total CPU consumption** by user workloads and internal processes (`avg_instance_cpu_percent`,`sqlserver_process_core_percent`).

**User CPU consumption** is calculated as a percentage of the user workload limits in each service objective. **User CPU utilization** at 100% indicates that the user workload has reached the limit of the service objective. However, when **total CPU consumption** reaches the 70-100% range, it's possible to see user workload throughput flattening out and query latency increasing, even if reported **user CPU consumption** remains significantly below 100%. This is more likely to occur when using smaller service objectives with a moderate allocation of compute resources, but relatively intense user workloads, such as in [dense elastic pools](elastic-pool-resource-management.md). This can also occur with smaller service objectives when internal processes temporarily require additional resources, for example when creating a new replica of the database.

When **total CPU consumption** is high, mitigation options are the same as noted earlier and include service objective increase and/or user workload optimization.

## Resource governance

To enforce resource limits, Azure SQL Database uses a resource governance implementation that is based on SQL Server [Resource Governor](https://docs.microsoft.com/sql/relational-databases/resource-governor/resource-governor), modified and extended to run in Azure SQL Database. In SQL Database, multiple [resource pools](https://docs.microsoft.com/sql/relational-databases/resource-governor/resource-governor-resource-pool) and [workload groups](https://docs.microsoft.com/sql/relational-databases/resource-governor/resource-governor-workload-group), with resource limits set at both pool and group levels, provide a [balanced Database-as-a-Service](https://azure.microsoft.com/blog/resource-governance-in-azure-sql-database/). User workload and internal workloads are classified into separate resource pools and workload groups. User workload on the primary and readable secondary replicas, including geo-replicas, is classified into the `SloSharedPool1` resource pool and `UserPrimaryGroup.DBId[N]` workload group, where `N` stands for the database ID value. In addition, there are multiple resource pools and workload groups for various internal workloads.

In addition to using Resource Governor to govern resources within the SQL process, Azure SQL Database also uses Windows [Job Objects](https://docs.microsoft.com/windows/win32/procthread/job-objects) for process level resource governance, and Windows [File Server Resource Manager (FSRM)](https://docs.microsoft.com/windows-server/storage/fsrm/fsrm-overview) for storage quota management.

Azure SQL Database resource governance is hierarchical in nature. From top to bottom, limits are enforced at the OS level and at the storage volume level using operating system resource governance mechanisms and Resource Governor, then at the resource pool level using Resource Governor, and then at the workload group level using Resource Governor. Resource governance limits in effect for the current database or elastic pool are surfaced in the [sys.dm_user_db_resource_governance](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-user-db-resource-governor-azure-sql-database) view.

### Data IO governance

Data IO governance is a process in Azure SQL Database used to limit both read and write physical IO against data files of a database. IOPS limits are set for each service level to minimize the "noisy neighbor" effect, to provide resource allocation fairness in the multi-tenant service, and to stay within the capabilities of the underlying hardware and storage.

For single databases, workload group limits are applied to all storage IO against the database, while resource pool limits apply to all storage IO against all databases on the same SQL pool, including the `tempdb` database. For elastic pools, workload group limits apply to each database in the pool, whereas resource pool limit applies to the entire elastic pool, including the `tempdb` database, which is shared among all databases in the pool. In general, resource pool limits may not be achievable by the workload against a database (either single or pooled), because workload group limits are lower than resource pool limits and limit IOPS/throughput sooner. However, pool limits may be reached by the combined workload against multiple databases on the same pool.

For example, if a query generates 1000 IOPS without any IO resource governance, but the workload group maximum IOPS limit is set to 900 IOPS, the query won't be able to generate more than 900 IOPS. However, if the resource pool maximum IOPS limit is set to 1500 IOPS, and the total IO from all workload groups associated with the resource pool exceeds 1500 IOPS, then the IO of the same query may be reduced below the workgroup limit of 900 IOPS.

The IOPS and throughput min/max values returned by the [sys.dm_user_db_resource_governance](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-user-db-resource-governor-azure-sql-database) view act as limits/caps, not as guarantees. Further, resource governance doesn't guarantee any specific storage latency. The best achievable latency, IOPS, and throughput for a given user workload depend not only on IO resource governance limits, but also on the mix of IO sizes used, and on the capabilities of the underlying storage. SQL Database uses IOs that vary in size between 512 KB and 4 MB. For the purposes of enforcing IOPS limits, every IO is accounted regardless of its size, with the exception of databases with data files in Azure Storage. In that case, IOs larger than 256 KB are accounted as multiple 256-KB IOs, to align with Azure Storage IO accounting.

For Basic, Standard, and General Purpose databases, which use data files in Azure Storage, the `primary_group_max_io` value may not be achievable if a database doesn't have enough data files to cumulatively provide this number of IOPS, or if data isn't distributed evenly across files, or if the performance tier of underlying blobs limits IOPS/throughput below the resource governance limit. Similarly, with small log IOs generated by frequent transaction commit, the `primary_max_log_rate` value may not be achievable by a workload due to the IOPS limit on the underlying Azure storage blob.

Resource utilization values such as `avg_data_io_percent` and `avg_log_write_percent`, reported in the [sys.dm_db_resource_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database),  [sys.resource_stats](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-resource-stats-azure-sql-database), and [sys.elastic_pool_resource_stats](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-elastic-pool-resource-stats-azure-sql-database) views, are calculated as percentages of maximum resource governance limits. Therefore, when factors other than resource governance limit IOPS/throughput, it's possible to see IOPS/throughput flattening out and latencies increasing as the workload increases, even though reported resource utilization remains below 100%.

To see read and write IOPS, throughput, and latency per database file, use the [sys.dm_io_virtual_file_stats()](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql) function. This function surfaces all IO against the database, including background IO that isn't accounted towards `avg_data_io_percent`, but uses IOPS and throughput of the underlying storage, and can impact observed storage latency. The function also surfaces additional latency that may be introduced by IO resource governance for reads and writes, in the `io_stall_queued_read_ms` and `io_stall_queued_write_ms` columns respectively.

### Transaction log rate governance

Transaction log rate governance is a process in Azure SQL Database used to limit high ingestion rates for workloads such as bulk insert, SELECT INTO, and index builds. These limits are tracked and enforced at the subsecond level to the rate of log record generation, limiting throughput regardless of how many IOs may be issued against data files.  Transaction log generation rates currently scale linearly up to a point that is hardware-dependent, with the maximum log rate allowed being 96 MB/s with the vCore purchasing model.

> [!NOTE]
> The actual physical IOs to transaction log files are not governed or limited.

Log rates are set such that they can be achieved and sustained in a variety of scenarios, while the overall system can maintain its functionality with minimized impact to the user load. Log rate governance ensures that transaction log backups stay within published recoverability SLAs.  This governance also prevents an excessive backlog on secondary replicas.

As log records are generated, each operation is evaluated and assessed for whether it should be delayed in order to maintain a maximum desired log rate (MB/s per second). The delays aren't added when the log records are flushed to storage, rather log rate governance is applied during log rate generation itself.

The actual log generation rates imposed at run time may also be influenced by feedback mechanisms, temporarily reducing the allowable log rates so the system can stabilize. Log file space management, avoiding running into out of log space conditions and Availability Group replication mechanisms can temporarily decrease the overall system limits.

Log rate governor traffic shaping is surfaced via the following wait types (exposed in the [sys.dm_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) and [sys.dm_os_wait_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql) views):

| Wait Type | Notes |
| :--- | :--- |
| LOG_RATE_GOVERNOR | Database limiting |
| POOL_LOG_RATE_GOVERNOR | Pool limiting |
| INSTANCE_LOG_RATE_GOVERNOR | Instance level limiting |  
| HADR_THROTTLE_LOG_RATE_SEND_RECV_QUEUE_SIZE | Feedback control, availability group physical replication in Premium/Business Critical not keeping up |  
| HADR_THROTTLE_LOG_RATE_LOG_SIZE | Feedback control, limiting rates to avoid an out of log space condition |
| HADR_THROTTLE_LOG_RATE_MISMATCHED_SLO | Geo-replication feedback control, limiting log rate to avoid high data latency and unavailability of geo-secondaries|
|||

When encountering a log rate limit that is hampering desired scalability, consider the following options:

- Scale up to a higher service level in order to get the maximum 96 MB/s log rate, or switch to a different service tier. The [Hyperscale](service-tier-hyperscale.md) service tier provides 100 MB/s log rate regardless of chosen service level.
- If data being loaded is transient, such as staging data in an ETL process, it can be loaded into tempdb (which is minimally logged).
- For analytic scenarios, load into a clustered columnstore covered table. This reduces the required log rate due to compression. This technique does increase CPU utilization and is only applicable to data sets that benefit from clustered columnstore indexes.

## Next steps

- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
- For information about DTUs and eDTUs, see [DTUs and eDTUs](purchasing-models.md#dtu-based-purchasing-model).
- For information about tempdb size limits, see [TempDB in Azure SQL Database](https://docs.microsoft.com/sql/relational-databases/databases/tempdb-database#tempdb-database-in-sql-database).
 