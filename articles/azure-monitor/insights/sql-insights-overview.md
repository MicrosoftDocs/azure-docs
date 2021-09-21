---
title: Monitor your SQL deployments with SQL insights (preview)
description: Overview of SQL insights in Azure Monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/15/2021
---

# Monitor your SQL deployments with SQL insights (preview)
SQL insights is a comprehensive solution for monitoring any product in the [Azure SQL family](../../azure-sql/index.yml). SQL insights uses [dynamic management views](../../azure-sql/database/monitoring-with-dmvs.md) to expose the data you need to monitor health, diagnose problems, and tune performance.  

SQL insights performs all monitoring remotely. Monitoring agents on dedicated virtual machines connect to your SQL resources and remotely gather data. The gathered data is stored in [Azure Monitor Logs](../logs/data-platform-logs.md), enabling easy aggregation, filtering, and trend analysis. You can view the collected data from the SQL insights [workbook template](../visualize/workbooks-overview.md), or you can delve directly into the data using [log queries](../logs/get-started-queries.md).

## Pricing
There is no direct cost for SQL insights. All costs are incurred by the virtual machines that gather the data, the Log Analytics workspaces that store the data, and any alert rules configured on the data. 

**Virtual machines**

For virtual machines, you're charged based on the pricing published on the [virtual machines pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). The number of virtual machines required will vary based on the number of connection strings you want to monitor. We recommend to allocate 1 virtual machine of size Standard_B2s for every 100 connection strings. See [Azure virtual machine requirements](sql-insights-enable.md#azure-virtual-machine-requirements) for more details.

**Log Analytics workspaces**

For the Log Analytics workspaces, you're charged based on the pricing published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). The Log Analytics workspaces used by SQL insights will incur costs for data ingestion, data retention, and (optionally) data export. Exact charges will vary based on the amount of data ingested, retained, and exported. The amount of this data will subsequently vary based on your database activity and the collection settings defined in your [monitoring profiles](sql-insights-enable.md#create-sql-monitoring-profile).

**Alert rules**

For alert rules in Azure Monitor, you're charged based on the pricing published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). If you choose to [create alerts with SQL insights](sql-insights-alerts.md), you're charged for any alert rules created and any notifications sent.

## Supported versions 
SQL insights supports the following versions of SQL Server:
- SQL Server 2012 and newer

SQL insights supports SQL Server running in the following environments:
- Azure SQL Database
- Azure SQL Managed Instance
- SQL Server on Azure Virtual Machines (SQL Server running on virtual machines registered with the [SQL virtual machine](../../azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-single-vm.md) provider)
- Azure VMs (SQL Server running on virtual machines not registered with the [SQL virtual machine](../../azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-single-vm.md) provider)

SQL insights has no support or limited support for the following:
- **Non-Azure instances**: SQL Server running on virtual machines outside of Azure are not supported
- **Azure SQL Database elastic pools**: Metrics cannot be gathered for elastic pools. Metrics cannot be gathered for databases within elastic pools.
- **Azure SQL Database low service tiers**: Metrics cannot be gathered for databases on Basic, S0, S1, and S2 [service tiers](../../azure-sql/database/resource-limits-dtu-single-databases.md)
- **Azure SQL Database serverless tier**: Metrics can be gathered for databases using the serverless compute tier. However, the process of gathering metrics will reset the auto-pause delay timer, preventing the database from entering an auto-paused state
- **Secondary replicas**: Metrics can only be gathered for a single secondary replica per-database. If a database has more than 1 secondary replica, only 1 can be monitored.
- **Authentication with Azure Active Directory**: The only supported method of [authentication](../../azure-sql/database/logins-create-manage.md#authentication-and-authorization) for monitoring is SQL authentication. For SQL Server on Azure VM, authentication using Active Directory on a custom domain controller is not supported.  

## Open SQL insights
Open SQL insights by selecting **SQL (preview)** from the **Insights** section of the **Azure Monitor** menu in the Azure portal. Click on a tile to load the experience for the type of SQL you are monitoring.

:::image type="content" source="media/sql-insights/portal.png" alt-text="SQL insights in Azure portal.":::

## Enable SQL insights 
See [Enable SQL insights](sql-insights-enable.md) for instructions on enabling SQL insights.

## Troubleshoot SQL insights 
See [Troubleshooting SQL insights](sql-insights-troubleshoot.md) for instructions on troubleshooting SQL insights.

## Data collected by SQL insights
SQL insights performs all monitoring remotely. We do not install any agents on the virtual machines running SQL Server. 

SQL insights uses dedicated monitoring virtual machines to remotely collect data from your SQL resources. Each monitoring virtual machine will have the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) and the Workload insights (WLI) extension installed. The WLI extension includes the open source [Telegraf agent](https://www.influxdata.com/time-series-platform/telegraf/). SQL insights uses [data collection rules](../agents/data-collection-rule-overview.md) to specify the data collection settings for Telegraf's [SQL Server plugin](https://www.influxdata.com/integration/microsoft-sql-server/).

Different sets of data are available for Azure SQL Database, Azure SQL Managed Instance, and SQL Server. The tables below describe the available data. You can customize which data sets to collect and the frequency of collection when you [create a monitoring profile](sql-insights-enable.md#create-sql-monitoring-profile).

The tables below have the following columns:
- **Friendly Name**: Name of the query as shown on the Azure portal when creating a monitoring profile
- **Configuration Name**: Name of the query as shown on the Azure portal when editing a monitoring profile
- **Namespace**: Name of the query as found in a Log Analytics workspace. This identifier appears in the **InsighstMetrics** table on the `Namespace` property in the `Tags` column
- **DMVs**: The dynamic managed views used to produce the data set
- **Enabled by Default**: Whether the data is collected by default
- **Default Collection Frequency**: How often the data is collected by default

### Data for Azure SQL Database 
| Friendly Name | Configuration Name | Namespace | DMVs | Enabled by Default | Default Collection Frequency |
|:---|:---|:---|:---|:---|:---|
| DB wait stats | AzureSQLDBWaitStats | sqlserver_azuredb_waitstats | sys.dm_db_wait_stats | No | NA |
| DBO wait stats | AzureSQLDBOsWaitstats | sqlserver_waitstats |sys.dm_os_wait_stats | Yes | 60 seconds |
| Memory clerks | AzureSQLDBMemoryClerks | sqlserver_memory_clerks | sys.dm_os_memory_clerks | Yes | 60 seconds |
| Database IO | AzureSQLDBDatabaseIO | sqlserver_database_io | sys.dm_io_virtual_file_stats<br>sys.database_files<br>tempdb.sys.database_files | Yes | 60 seconds |
| Server properties | AzureSQLDBServerProperties | sqlserver_server_properties | sys.dm_os_job_object<br>sys.database_files<br>sys.[databases]<br>sys.[database_service_objectives] | Yes | 60 seconds |
| Performance counters | AzureSQLDBPerformanceCounters | sqlserver_performance | sys.dm_os_performance_counters<br>sys.databases | Yes | 60 seconds |
| Resource stats | AzureSQLDBResourceStats | sqlserver_azure_db_resource_stats | sys.dm_db_resource_stats | Yes | 60 seconds |
| Resource governance | AzureSQLDBResourceGovernance | sqlserver_db_resource_governance | sys.dm_user_db_resource_governance | Yes | 60 seconds |
| Requests | AzureSQLDBRequests | sqlserver_requests | sys.dm_exec_sessions<br>sys.dm_exec_requests<br>sys.dm_exec_sql_text | No | NA |
| Schedulers| AzureSQLDBSchedulers | sqlserver_schedulers | sys.dm_os_schedulers | No | NA  |

### Data for Azure SQL Managed Instance 

| Friendly Name | Configuration Name | Namespace | DMVs | Enabled by Default | Default Collection Frequency |
|:---|:---|:---|:---|:---|:---|
| Wait stats | AzureSQLMIOsWaitstats | sqlserver_waitstats | sys.dm_os_wait_stats | Yes | 60 seconds |
| Memory clerks | AzureSQLMIMemoryClerks | sqlserver_memory_clerks | sys.dm_os_memory_clerks | Yes | 60 seconds |
| Database IO | AzureSQLMIDatabaseIO | sqlserver_database_io | sys.dm_io_virtual_file_stats<br>sys.master_files | Yes | 60 seconds |
| Server properties | AzureSQLMIServerProperties | sqlserver_server_properties | sys.server_resource_stats | Yes | 60 seconds |
| Performance counters | AzureSQLMIPerformanceCounters | sqlserver_performance | sys.dm_os_performance_counters<br>sys.databases| Yes | 60 seconds |
| Resource stats | AzureSQLMIResourceStats | sqlserver_azure_db_resource_stats | sys.server_resource_stats | Yes | 60 seconds |
| Resource governance | AzureSQLMIResourceGovernance | sqlserver_instance_resource_governance | sys.dm_instance_resource_governance | Yes | 60 seconds |
| Requests | AzureSQLMIRequests | sqlserver_requests | sys.dm_exec_sessions<br>sys.dm_exec_requests<br>sys.dm_exec_sql_text | No | NA |
| Schedulers | AzureSQLMISchedulers | sqlserver_schedulers | sys.dm_os_schedulers | No | NA |

### Data for SQL Server

| Friendly Name | Configuration Name | Namespace | DMVs | Enabled by Default | Default Collection Frequency |
|:---|:---|:---|:---|:---|:---|
| Wait stats | SQLServerWaitStatsCategorized | sqlserver_waitstats | sys.dm_os_wait_stats | Yes | 60 seconds | 
| Memory clerks | SQLServerMemoryClerks | sqlserver_memory_clerks | sys.dm_os_memory_clerks | Yes | 60 seconds |
| Database IO | SQLServerDatabaseIO | sqlserver_database_io | sys.dm_io_virtual_file_stats<br>sys.master_files | Yes | 60 seconds |
| Server properties | SQLServerProperties | sqlserver_server_properties | sys.dm_os_sys_info | Yes | 60 seconds |
| Performance counters | SQLServerPerformanceCounters | sqlserver_performance | sys.dm_os_performance_counters | Yes | 60 seconds |
| Volume space | SQLServerVolumeSpace | sqlserver_volume_space | sys.master_files | Yes | 60 seconds |
| SQL Server CPU | SQLServerCpu | sqlserver_cpu | sys.dm_os_ring_buffers | Yes | 60 seconds |
| Schedulers | SQLServerSchedulers | sqlserver_schedulers | sys.dm_os_schedulers | No | NA |
| Requests | SQLServerRequests | sqlserver_requests | sys.dm_exec_sessions<br>sys.dm_exec_requests<br>sys.dm_exec_sql_text | No | NA |
| Availability Replica States | SQLServerAvailabilityReplicaStates | sqlserver_hadr_replica_states | sys.dm_hadr_availability_replica_states<br>sys.availability_replicas<br>sys.availability_groups<br>sys.dm_hadr_availability_group_states | No | 60 seconds |
| Availability Database Replicas | SQLServerDatabaseReplicaStates | sqlserver_hadr_dbreplica_states | sys.dm_hadr_database_replica_states<br>sys.availability_replicas | No | 60 seconds |

## Next steps

- See [Enable SQL insights](sql-insights-enable.md) for instructions on enabling SQL insights
- See [Frequently asked questions](/azure/azure-monitor/faq#sql-insights-preview) for frequently asked questions about SQL insights