---
title: Data reference for Azure Monitor for SAP solutions 
description: Important reference material needed when you monitor SAP on Azure. 
author: lauradolan
ms.topic: reference
ms.author: ladolan
ms.service: sap-on-azure
ms.subservice: sap-monitor 
ms.custom: subject-monitoring
ms.date: 10/27/2022
---

# Data reference for Azure Monitor for SAP solutions 

This article provides a reference of log data collected to analyze the performance and availability of Azure Monitor for SAP solutions. See [Monitor SAP on Azure ](about-azure-monitor-sap-solutions.md) for details on collecting and analyzing monitoring data for SAP on Azure.

## Metrics

Azure Monitor for SAP solutions doesn't support metrics.

## Azure Monitor logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Monitor for SAP solutions and available for query by Log Analytics. Azure Monitor for SAP solutions uses custom logs. The schemas for some tables are defined by third-party providers, such as SAP. Here are the current custom logs for Azure Monitor for SAP solutions with links to sources for more information.

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

### SapHana_BackupCatalog_CL

For more information, see:
- [M_BACKUP_CATALOG_FILES System View](https://help.sap.com/viewer/4fe29514fd584807ac9f2a04f6754767/2.0.03/en-US/20a8437d7519101495a3fa7ad9961cf6.html?q=M_BACKUP_CATALOG)
- [M_BACKUP_CATALOG System View](https://help.sap.com/viewer/4fe29514fd584807ac9f2a04f6754767/1.0.12/en-US/20a8100e75191014870ecf908b5d2abf.html)

### SapHana_SystemReplication_CL

For more information, see [M_SERVICE_REPLICATION System View](https://help.sap.com/viewer/c1d3f60099654ecfb3fe36ac93c121bb/2021_2_QRC/en-US/20c43fc975191014b0ece11b47a86c10.html) in the SAP HANA SQL and System Views Reference.
 
### Prometheus_OSExporter_CL

For more information, see [prometheus / node_exporter on GitHub](https://github.com/prometheus/node_exporter).

### Prometheus_HaClusterExporter_CL

For more information, see [ClusterLabs/ha_cluster_exporter](https://github.com/ClusterLabs/ha_cluster_exporter/blob/master/doc/metrics.md).

### MSSQL_DBConnections_CL

For more information, see:
- [sys.dm_exec_sessions (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sessions-transact-sql) 
- [sys.databases (Transact-SQL)](/sql/relational-databases/system-catalog-views/sys-databases-transact-sql)

### MSSQL_SystemProps_CL

For more information, see: 
- [sys.dm_os_windows_info (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-windows-info-transact-sql) 
- [sys.database_files (Transact-SQL)](/sql/relational-databases/system-catalog-views/sys-database-files-transact-sql)
- [sys.dm_exec_sql_text (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sql-text-transact-sql)
- [sys.dm_exec_query_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-stats-transact-sql)
- [sys.dm_io_virtual_file_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql)
- [sys.dm_db_partition_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-db-partition-stats-transact-sql)
- [sys.dm_os_performance_counters (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-performance-counters-transact-sql)
- [sys.dm_os_wait_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql)
- [sys.fn_xe_file_target_read_file (Transact-SQL)](/sql/relational-databases/system-functions/sys-fn-xe-file-target-read-file-transact-sql)
- [SQL Server Operating System Related Dynamic Management Views (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sql-server-operating-system-related-dynamic-management-views-transact-sql)
- [sys.availability_groups (Transact-SQL)](/sql/relational-databases/system-catalog-views/sys-availability-groups-transact-sql)
- [sys.dm_exec_requests (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql)
- [sys.dm_xe_session_targets (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-xe-session-targets-transact-sql)
- [sys.fn_xe_file_target_read_file (Transact-SQL)](/sql/relational-databases/system-functions/sys-fn-xe-file-target-read-file-transact-sql)
- [backupset (Transact-SQL)](/sql/relational-databases/system-tables/backupset-transact-sql)
- [sys.sysprocesses (Transact-SQL)](/sql/relational-databases/system-compatibility-views/sys-sysprocesses-transact-sql)

### MSSQL_FileOverview_CL

For more information, see [sys.database_files (Transact-SQL)](/sql/relational-databases/system-catalog-views/sys-database-files-transact-sql).

### MSSQL_MemoryOverview_CL

For more information, see [sys.dm_os_memory_clerks (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-memory-clerks-transact-sql).

### MSSQL_Top10Statements_CL

For more information, see:
- [sys.dm_exec_sql_text (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sql-text-transact-sql)
- [sys.dm_exec_query_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-stats-transact-sql)

### MSSQL_IOPerformance_CL

For more information, see [sys.dm_io_virtual_file_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql).

### MSSQL_TableSizes_CL

For more information, see [sys.dm_db_partition_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-db-partition-stats-transact-sql).

### MSSQL_BatchRequests_CL

For more information, see [sys.dm_os_performance_counters (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-performance-counters-transact-sql).

### MSSQL_WaitPercs_CL

For more information, see [sys.dm_os_wait_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql).

### MSSQL_PageLifeExpectancy2_CL

For more information, see [sys.dm_os_performance_counters (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-performance-counters-transact-sql).

### MSSQL_Error_CL

For more information, see [sys.fn_xe_file_target_read_file (Transact-SQL)](/sql/relational-databases/system-functions/sys-fn-xe-file-target-read-file-transact-sql).

### MSSQL_CPUUsage_CL

For more information, see [SQL Server Operating System Related Dynamic Management Views (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sql-server-operating-system-related-dynamic-management-views-transact-sql).

### MSSQL_AOOverview_CL

For more information, see [sys.availability_groups (Transact-SQL)](/sql/relational-databases/system-catalog-views/sys-availability-groups-transact-sql).

### MSSQL_AOWaiter_CL

For more information, see [sys.dm_exec_requests (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql).

### MSSQL_AOWaitstats_CL

For more information, see [sys.dm_os_wait_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql).

### MSSQL_AOFailovers_CL

For more information, see:
- [sys.dm_xe_session_targets (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-xe-session-targets-transact-sql)
- [sys.fn_xe_file_target_read_file (Transact-SQL)](/sql/relational-databases/system-functions/sys-fn-xe-file-target-read-file-transact-sql)

### MSSQL_BckBackups2_CL

For more information, see: [backupset (Transact-SQL)](/sql/relational-databases/system-tables/backupset-transact-sql).

### MSSQL_BlockingProcesses_CL

For more information, see [sys.sysprocesses (Transact-SQL)](/sql/relational-databases/system-compatibility-views/sys-sysprocesses-transact-sql).

## Next steps

- For more information on using Azure Monitor for SAP solutions, see [Monitor SAP on Azure](about-azure-monitor-sap-solutions.md).
- For more information on Azure Monitor, see [Monitoring Azure resources with Azure Monitor](../../azure-monitor/essentials/monitor-azure-resource.md).
