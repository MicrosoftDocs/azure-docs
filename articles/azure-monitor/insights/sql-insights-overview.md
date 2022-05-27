---
title: Monitor your SQL deployments with SQL Insights (preview)
description: Overview of SQL Insights (preview) in Azure Monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.reviewer: wiassaf
ms.date: 04/14/2022
---

# Monitor your SQL deployments with SQL Insights (preview)

SQL Insights (preview) is a comprehensive solution for monitoring any product in the [Azure SQL family](/azure/azure-sql/index). SQL Insights uses [dynamic management views](/azure/azure-sql/database/monitoring-with-dmvs) to expose the data that you need to monitor health, diagnose problems, and tune performance.  

SQL Insights performs all monitoring remotely. Monitoring agents on dedicated virtual machines connect to your SQL resources and remotely gather data. The gathered data is stored in [Azure Monitor Logs](../logs/data-platform-logs.md) to enable easy aggregation, filtering, and trend analysis. You can view the collected data from the SQL Insights [workbook template](../visualize/workbooks-overview.md), or you can delve directly into the data by using [log queries](../logs/get-started-queries.md).
The following diagram details the steps taken by information from the database engine and Azure resource logs, and how they can be surfaced. For a more detailed diagram of Azure SQL logging, see [Monitoring and diagnostic telemetry](/azure/azure-sql/database/monitor-tune-overview.md#monitoring-and-diagnostic-telemetry).

:::image type="content" source="media/sql-insights/azure-sql-insights-horizontal-analytics.svg" alt-text="Diagram showing how database engine information and resource logs are surfaced through AzureDiagnostics and Log Analytics.":::

## Pricing
There is no direct cost for SQL Insights (preview). All costs are incurred by the virtual machines that gather the data, the Log Analytics workspaces that store the data, and any alert rules configured on the data. 

### Virtual machines

For virtual machines, you're charged based on the pricing published on the [virtual machines pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). The number of virtual machines that you need will vary based on the number of connection strings you want to monitor. We recommend allocating one virtual machine of size Standard_B2s for every 100 connection strings. See [Azure virtual machine requirements](sql-insights-enable.md#azure-virtual-machine-requirements) for more details.

### Log Analytics workspaces

For the Log Analytics workspaces, you're charged based on the pricing published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). The Log Analytics workspaces that SQL Insights uses will incur costs for data ingestion, data retention, and (optionally) data export. 

Exact charges will vary based on the amount of data ingested, retained, and exported. The amount of this data will vary based on your database activity and the collection settings defined in your [monitoring profiles](sql-insights-enable.md#create-sql-monitoring-profile).

### Alert rules

For alert rules in Azure Monitor, you're charged based on the pricing published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). If you choose to [create alerts with SQL Insights (preview)](sql-insights-alerts.md), you're charged for any alert rules created and any notifications sent.

## Supported versions 
SQL Insights (preview) supports the following versions of SQL Server:
- SQL Server 2012 and newer

SQL Insights (preview) supports SQL Server running in the following environments:
- Azure SQL Database
- Azure SQL Managed Instance
- SQL Server on Azure Virtual Machines (SQL Server running on virtual machines registered with the [SQL virtual machine](/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-single-vm) provider)
- Azure VMs (SQL Server running on virtual machines not registered with the [SQL virtual machine](/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-single-vm) provider)

SQL Insights (preview) has no support or has limited support for the following:
- **Non-Azure instances**: SQL Server running on virtual machines outside Azure is not supported.
- **Azure SQL Database elastic pools**: Metrics can't be gathered for elastic pools or for databases within elastic pools.
- **Azure SQL Database low service tiers**: Metrics can't be gathered for databases on Basic, S0, S1, and S2 [service tiers](/azure/azure-sql/database/resource-limits-dtu-single-databases).
- **Azure SQL Database serverless tier**: Metrics can be gathered for databases through the serverless compute tier. However, the process of gathering metrics will reset the auto-pause delay timer, preventing the database from entering an auto-paused state.
- **Secondary replicas**: Metrics can be gathered for only a single secondary replica per database. If a database has more than one secondary replica, only one can be monitored.
- **Authentication with Azure Active Directory**: The only supported method of [authentication](/azure/azure-sql/database/logins-create-manage#authentication-and-authorization) for monitoring is SQL authentication. For SQL Server on Azure Virtual Machines, authentication through Active Directory on a custom domain controller is not supported.  

## Regional availability

SQL Insights (preview) is available in all Azure regions where Azure Monitor is [available](https://azure.microsoft.com/global-infrastructure/services/?products=monitor), with the exception of Azure government and national clouds.

## Open SQL Insights

To open SQL Insights:

1. In the Azure portal, go to the **Azure Monitor** menu.
1. In the **Insights** section, select **SQL (preview)**. 
1. Select a tile to load the experience for the SQL resource that you're monitoring.

:::image type="content" source="media/sql-insights/portal.png" alt-text="Screenshot that shows SQL Insights in the Azure portal.":::

For more instructions, see [Enable SQL Insights (preview)](sql-insights-enable.md) and [Troubleshoot SQL Insights (preview)](sql-insights-troubleshoot.md).

## Collected data
SQL Insights performs all monitoring remotely. No agents are installed on the virtual machines running SQL Server. 

SQL Insights uses dedicated monitoring virtual machines to remotely collect data from your SQL resources. Each monitoring virtual machine has the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) and the Workload Insights (WLI) extension installed. 

The WLI extension includes the open-source [Telegraf agent](https://www.influxdata.com/time-series-platform/telegraf/). SQL Insights uses [data collection rules](../essentials/data-collection-rule-overview.md) to specify the data collection settings for Telegraf's [SQL Server plug-in](https://www.influxdata.com/integration/microsoft-sql-server/).

Different sets of data are available for Azure SQL Database, Azure SQL Managed Instance, and SQL Server. The following tables describe the available data. You can customize which datasets to collect and the frequency of collection when you [create a monitoring profile](sql-insights-enable.md#create-sql-monitoring-profile).

The tables have the following columns:
- **Friendly name**: Name of the query as shown in the Azure portal when you're creating a monitoring profile.
- **Configuration name**: Name of the query as shown in the Azure portal when you're editing a monitoring profile.
- **Namespace**: Name of the query as found in a Log Analytics workspace. This identifier appears in the **InsighstMetrics** table on the `Namespace` property in the `Tags` column.
- **DMVs**: Dynamic managed views that are used to produce the dataset.
- **Enabled by default**: Whether the data is collected by default.
- **Default collection frequency**: How often the data is collected by default.

### Data for Azure SQL Database 

| Friendly name | Configuration name | Namespace | DMVs | Enabled by default | Default collection frequency |
|:---|:---|:---|:---|:---|:---|
| DB wait stats | AzureSQLDBWaitStats | sqlserver_azuredb_waitstats | sys.dm_db_wait_stats | No | Not applicable |
| DBO wait stats | AzureSQLDBOsWaitstats | sqlserver_waitstats |sys.dm_os_wait_stats | Yes | 60 seconds |
| Memory clerks | AzureSQLDBMemoryClerks | sqlserver_memory_clerks | sys.dm_os_memory_clerks | Yes | 60 seconds |
| Database I/O | AzureSQLDBDatabaseIO | sqlserver_database_io | sys.dm_io_virtual_file_stats<br>sys.database_files<br>tempdb.sys.database_files | Yes | 60 seconds |
| Server properties | AzureSQLDBServerProperties | sqlserver_server_properties | sys.dm_os_job_object<br>sys.database_files<br>sys.[databases]<br>sys.[database_service_objectives] | Yes | 60 seconds |
| Performance counters | AzureSQLDBPerformanceCounters | sqlserver_performance | sys.dm_os_performance_counters<br>sys.databases | Yes | 60 seconds |
| Resource stats | AzureSQLDBResourceStats | sqlserver_azure_db_resource_stats | sys.dm_db_resource_stats | Yes | 60 seconds |
| Resource governance | AzureSQLDBResourceGovernance | sqlserver_db_resource_governance | sys.dm_user_db_resource_governance | Yes | 60 seconds |
| Requests | AzureSQLDBRequests | sqlserver_requests | sys.dm_exec_sessions<br>sys.dm_exec_requests<br>sys.dm_exec_sql_text | No | Not applicable |
| Schedulers| AzureSQLDBSchedulers | sqlserver_schedulers | sys.dm_os_schedulers | No | Not applicable  |

### Data for Azure SQL Managed Instance 

| Friendly name | Configuration name | Namespace | DMVs | Enabled by default | Default collection frequency |
|:---|:---|:---|:---|:---|:---|
| Wait stats | AzureSQLMIOsWaitstats | sqlserver_waitstats | sys.dm_os_wait_stats | Yes | 60 seconds |
| Memory clerks | AzureSQLMIMemoryClerks | sqlserver_memory_clerks | sys.dm_os_memory_clerks | Yes | 60 seconds |
| Database I/O | AzureSQLMIDatabaseIO | sqlserver_database_io | sys.dm_io_virtual_file_stats<br>sys.master_files | Yes | 60 seconds |
| Server properties | AzureSQLMIServerProperties | sqlserver_server_properties | sys.server_resource_stats | Yes | 60 seconds |
| Performance counters | AzureSQLMIPerformanceCounters | sqlserver_performance | sys.dm_os_performance_counters<br>sys.databases| Yes | 60 seconds |
| Resource stats | AzureSQLMIResourceStats | sqlserver_azure_db_resource_stats | sys.server_resource_stats | Yes | 60 seconds |
| Resource governance | AzureSQLMIResourceGovernance | sqlserver_instance_resource_governance | sys.dm_instance_resource_governance | Yes | 60 seconds |
| Requests | AzureSQLMIRequests | sqlserver_requests | sys.dm_exec_sessions<br>sys.dm_exec_requests<br>sys.dm_exec_sql_text | No | NA |
| Schedulers | AzureSQLMISchedulers | sqlserver_schedulers | sys.dm_os_schedulers | No | Not applicable |

### Data for SQL Server

| Friendly name | Configuration name | Namespace | DMVs | Enabled by default | Default collection frequency |
|:---|:---|:---|:---|:---|:---|
| Wait stats | SQLServerWaitStatsCategorized | sqlserver_waitstats | sys.dm_os_wait_stats | Yes | 60 seconds | 
| Memory clerks | SQLServerMemoryClerks | sqlserver_memory_clerks | sys.dm_os_memory_clerks | Yes | 60 seconds |
| Database I/O | SQLServerDatabaseIO | sqlserver_database_io | sys.dm_io_virtual_file_stats<br>sys.master_files | Yes | 60 seconds |
| Server properties | SQLServerProperties | sqlserver_server_properties | sys.dm_os_sys_info | Yes | 60 seconds |
| Performance counters | SQLServerPerformanceCounters | sqlserver_performance | sys.dm_os_performance_counters | Yes | 60 seconds |
| Volume space | SQLServerVolumeSpace | sqlserver_volume_space | sys.master_files | Yes | 60 seconds |
| SQL Server CPU | SQLServerCpu | sqlserver_cpu | sys.dm_os_ring_buffers | Yes | 60 seconds |
| Schedulers | SQLServerSchedulers | sqlserver_schedulers | sys.dm_os_schedulers | No | Not applicable |
| Requests | SQLServerRequests | sqlserver_requests | sys.dm_exec_sessions<br>sys.dm_exec_requests<br>sys.dm_exec_sql_text | No | Not applicable |
| Availability replica states | SQLServerAvailabilityReplicaStates | sqlserver_hadr_replica_states | sys.dm_hadr_availability_replica_states<br>sys.availability_replicas<br>sys.availability_groups<br>sys.dm_hadr_availability_group_states | No | 60 seconds |
| Availability database replicas | SQLServerDatabaseReplicaStates | sqlserver_hadr_dbreplica_states | sys.dm_hadr_database_replica_states<br>sys.availability_replicas | No | 60 seconds |

## Next steps

- For frequently asked questions about SQL Insights (preview), see [Frequently asked questions](../faq.yml).
- [Monitoring and performance tuning in Azure SQL Database and Azure SQL Managed Instance](/azure/azure-sql/database/monitor-tune-overview)