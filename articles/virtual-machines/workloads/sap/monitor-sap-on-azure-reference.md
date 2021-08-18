---
title: Monitor SAP on Azure data reference
description: Important reference material needed when you monitor SAP on Azure. 
author: Ajayan1008
ms.topic: reference
ms.author: v-hborys
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap 
ms.custom: subject-monitoring
ms.date: 08/18/2021
---

# Monitor SAP on Azure data reference

This article provides a reference of log data collected to analyze the performance and availability of Azure Monitor for SAP Solutions. See [Monitor SAP on Azure](monitor-sap-on-azure.md) for details on collecting and analyzing monitoring data for SAP on Azure.

## Metrics

Azure Monitor for SAP Solutions does not support metrics.

## Azure Monitor logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Monitor for SAP Solutions and available for query by Log Analytics. Azure Monitor for SAP Solutions uses custom logs; the schema for the tables is defined by third-party providers, for instance, SAP. Here are the current custom logs for Azure Monitor for SAP Solutions with links to the providers for more information.

### SapHana_HostConfig_CL

For more information, see [M_LANDSCAPE_HOST_CONFIGURATION System View](https://help.sap.com/viewer/4fe29514fd584807ac9f2a04f6754767/2.0.00/en-US/20b1d83875191014b028e076c874e9d7.html) in the SAP HANA SQL and System Views Reference.

### SapHana_HostInformation_CL

For more information, see [M_HOST_INFORMATION System View](https://help.sap.com/viewer/4fe29514fd584807ac9f2a04f6754767/2.0.03/en-US/20b10028751910148c1c9de602d771de.html) in the SAP HANA SQL and System Views Reference.

### SapHana_SystemOverview_CL

For more information, see [M_SYSTEM_OVERVIEW System View](https://help.sap.com/viewer/4fe29514fd584807ac9f2a04f6754767/2.0.03/en-US/20c61f0675191014a1d5f96d9668855b.html) in the SAP HANA SQL and System Views Reference.

### SapHana_LoadHistory_CL

For more information, see [M_LOAD_HISTORY_HOST System View](https://help.sap.com/viewer/4fe29514fd584807ac9f2a04f6754767/2.0.03/en-US/3fa52abf1d854edbb7342a69364bcb0e.html) in the SAP HANA SQL and System Views Reference.

### SapHana_Disks_CL

For more information, see [M_DISKS System View](https://help.sap.com/viewer/4fe29514fd584807ac9f2a04f6754767/2.0.03/en-US/20aef7a275191014b37acbc35b4f20a4.html) in the SAP HANA SQL and System Views Reference.

### SapHana_SystemAvailability_CL

For more information, see [M_SYSTEM_AVAILABILITY System View](https://help.sap.com/viewer/4fe29514fd584807ac9f2a04f6754767/2.0.00/en-US/1ef9723a03214bd889c4fb8947765aa4.html) in the SAP HANA SQL and System Views Reference.

### SapHana_SqlProbe_CL

[Sameeksha - I can't find this on the SAP site. There is no SQL statement with a "from". Please advise.]

### SapHana_BackupCatalog_CL

For more information, see [M_HOST_INFORMATION System View](https://help.sap.com/viewer/4fe29514fd584807ac9f2a04f6754767/2.0.03/en-US/20b10028751910148c1c9de602d771de.html) in the SAP HANA SQL and System Views Reference.  [Sameeksha, see the .json file. The SQL query points to SYS.M_HOST_INFORMATION, which is the same as SapHana_HostInformation_CL above. However, the .json file gives specific instructions. On the SAP site, there is an M_BACKUP_CATALOG System View (at https://help.sap.com/viewer/4fe29514fd584807ac9f2a04f6754767/2.0.03/en-US/20a8437d7519101495a3fa7ad9961cf6.html?q=M_BACKUP_CATALOG) but its parameters are different than those showing in the Azure portal for this CL. What to do?]

### SapHana_SystemReplication_CL

For more information, see [M_SERVICE_REPLICATION System View](https://help.sap.com/viewer/c1d3f60099654ecfb3fe36ac93c121bb/2021_2_QRC/en-US/20c43fc975191014b0ece11b47a86c10.html) in the SAP HANA SQL and System Views Reference.
 
### Prometheus_OSExporter_CL

For more information, see [prometheus / node_exporter on GitHub](https://github.com/prometheus/node_exporter). [Sameeksha is this okay?]

### Prometheus_HaClusterExporter_CL

[Sameeksha, this does not have a "from" in the .json file.]

### MSSQL_DBConnections_CL

For more information, see:
- [sys.dm_exec_sessions (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sessions-transact-sql?view=sql-server-ver15) 
- [sys.databases (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-databases-transact-sql?view=sql-server-ver15)

### MSSQL_SystemProps_CL

For more information, see: 
- [sys.dm_os_windows_info (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-os-windows-info-transact-sql?view=sql-server-ver15) 
- [sys.database_files (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-database-files-transact-sql?view=sql-server-ver15)
- [sys.dm_exec_sql_text (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sql-text-transact-sql?view=sql-server-ver15)
- [sys.dm_exec_query_stats (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-stats-transact-sql?view=sql-server-ver15)
- [sys.dm_io_virtual_file_stats (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql?view=sql-server-ver15)
- [sys.dm_db_partition_stats (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-db-partition-stats-transact-sql?view=sql-server-ver15)
- [sys.dm_os_performance_counters (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-os-performance-counters-transact-sql?view=sql-server-ver15)
- [sys.dm_os_wait_stats (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql?view=sql-server-ver15)
- [sys.fn_xe_file_target_read_file (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-functions/sys-fn-xe-file-target-read-file-transact-sql?view=sql-server-ver15)
- [SQL Server Operating System Related Dynamic Management Views (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sql-server-operating-system-related-dynamic-management-views-transact-sql?view=sql-server-ver15)
- [sys.availability_groups (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-availability-groups-transact-sql?view=sql-server-ver15)
- [sys.dm_exec_requests (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql?view=sql-server-ver15)
- [sys.dm_xe_session_targets (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-xe-session-targets-transact-sql?view=sql-server-ver15)
- [sys.fn_xe_file_target_read_file (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-functions/sys-fn-xe-file-target-read-file-transact-sql?view=sql-server-ver15)
- [backupset (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-tables/backupset-transact-sql?view=sql-server-ver15)
- [sys.sysprocesses (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysprocesses-transact-sql?view=sql-server-ver15)

### MSSQL_FileOverview_CL

For more information, see [sys.database_files (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-database-files-transact-sql?view=sql-server-ver15).

### MSSQL_MemoryOverview_CL

For more information, see [sys.dm_os_memory_clerks (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-os-memory-clerks-transact-sql?view=sql-server-ver15).

### MSSQL_Top10Statements_CL

For more information, see:
- [sys.dm_exec_sql_text (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sql-text-transact-sql?view=sql-server-ver15)
- [sys.dm_exec_query_stats (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-stats-transact-sql?view=sql-server-ver15)

### MSSQL_IOPerformance_CL

For more information, see [sys.dm_io_virtual_file_stats (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql?view=sql-server-ver15).

### MSSQL_TableSizes_CL

For more information, see [sys.dm_db_partition_stats (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-db-partition-stats-transact-sql?view=sql-server-ver15).

### MSSQL_BatchRequests_CL

For more information, see [sys.dm_os_performance_counters (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-os-performance-counters-transact-sql?view=sql-server-ver15).

### MSSQL_WaitPercs_CL

For more information, see [sys.dm_os_wait_stats (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql?view=sql-server-ver15).

### MSSQL_PageLifeExpectancy2_CL

For more information, see [sys.dm_os_performance_counters (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-os-performance-counters-transact-sql?view=sql-server-ver15).

### MSSQL_Error_CL

For more information, see [sys.fn_xe_file_target_read_file (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-functions/sys-fn-xe-file-target-read-file-transact-sql?view=sql-server-ver15).

### MSSQL_CPUUsage_CL

For more information, see [SQL Server Operating System Related Dynamic Management Views (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sql-server-operating-system-related-dynamic-management-views-transact-sql?view=sql-server-ver15).

### MSSQL_AOOverview_CL

For more information, see [sys.availability_groups (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-availability-groups-transact-sql?view=sql-server-ver15).

### MSSQL_AOWaiter_CL

For more information, see [sys.dm_exec_requests (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql?view=sql-server-ver15).

### MSSQL_AOWaitstats_CL

For more information, see [sys.dm_os_wait_stats (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql?view=sql-server-ver15).

### MSSQL_AOFailovers_CL

For more information, see:
- [sys.dm_xe_session_targets (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-xe-session-targets-transact-sql?view=sql-server-ver15)
- [sys.fn_xe_file_target_read_file (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-functions/sys-fn-xe-file-target-read-file-transact-sql?view=sql-server-ver15).

### MSSQL_BckBackups2_CL

For more information, see: [backupset (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-tables/backupset-transact-sql?view=sql-server-ver15).

### MSSQL_BlockingProcesses_CL

For more information, see [sys.sysprocesses (Transact-SQL)](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysprocesses-transact-sql?view=sql-server-ver15).
