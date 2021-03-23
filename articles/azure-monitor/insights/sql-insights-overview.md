---
title: Monitor your SQL deployments with SQL insights (preview)
description: Overview of SQL insights in Azure Monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/15/2021
---

# Monitor your SQL deployments with SQL insights (preview)
SQL insights monitors the performance and health of your SQL deployments.  It can help deliver predictable performance and availability of vital workloads you have built around a SQL backend by identifying performance bottlenecks and issues. SQL insights stores its data in [Azure Monitor Logs](../logs/data-platform-logs.md), which allows it to deliver powerful aggregation and filtering and to analyze data trends over time. You can view this data from Azure Monitor in the views we ship as part of this offering and you can delve directly into the Log data to run queries and analyze trends.

SQL insights does not install anything on your SQL IaaS deployments. Instead, it uses dedicated monitoring virtual machines to remotely collect data for both SQL PaaS and SQL IaaS deployments.  The SQL insights monitoring profile allows you to manage the data sets to be collected based upon the type of SQL, including Azure SQL DB, Azure SQL Managed Instance, and SQL server running on an Azure virtual machine.

## Pricing

There's no direct cost for SQL insights, but you're charged for its activity in the Log Analytics workspace. Based on the pricing that's published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/), SQL insights is billed for:

- Data ingested from agents and stored in the workspace.
- Alert rules based on log data.
- Notifications sent from alert rules.

The log size varies by the string lengths of the data collected, and it can increase with the amount of database activity. 

## Supported versions 
SQL insights supports the following versions of SQL Server:

- SQL Server 2012 and newer

SQL insights supports SQL Server running in the following environments:

- Azure SQL Database
- Azure SQL Managed Instance
- Azure SQL VMs
- Azure VMs

SQL insights has no support or limited support for the following:

- SQL Server running on virtual machines outside of Azure are currently not supported.
- Azure SQL Database Elastic Pools: Limited support during the Public Preview. Will be fully supported at general availability.  
- Azure SQL Serverless Deployments: Like Active Geo-DR, the current monitoring agents will prevent serverless deployment from going to sleep. This could cause higher than expected costs from serverless deployments.  
- Readable Secondaries: Currently only deployment types with a single readable secondary endpoint (Business Critical or Hyperscale) will be supported. When Hyperscale deployments support named replicas, we will be capable of supporting multiple readable secondary endpoints for a single logical database.  
- Azure Active Directories: Currently we only support SQL Logins for the Monitoring Agent. We plan to support Azure Active Directories in an upcoming release and have no current support for SQL VM authentication using Active Directories on a bespoke domain controller.  


## Open SQL insights
Open SQL insights by selecting **SQL (preview)** from the **Insights** section of the **Azure Monitor** menu in the Azure portal. Click on a tile to load the experience for the type of SQL you are monitoring.

:::image type="content" source="media/sql-insights/portal.png" alt-text="SQL insights in Azure portal.":::


## Enable SQL insights 
See [Enable SQL insights](sql-insights-enable.md) for the detailed procedure to enable SQL insights in addition to steps for troubleshooting.


## Data collected by SQL insights
In the public preview, SQL insights only supports the remote method of monitoring. The [telegraf agent](https://www.influxdata.com/time-series-platform/telegraf/) is not installed on the SQL Server. It uses the [SQL Server input plugin for telegraf](https://www.influxdata.com/integration/microsoft-sql-server/) and use the three groups of queries for the different types of SQL it monitors: Azure SQL DB, Azure SQL Managed Instance, SQL server running on an Azure VM. 

The following tables summarize the following:

- Name of the query in the sqlserver telegraf plugin
- Dynamic managed views the query calls
- Namespace the data appears under in the *InsighstMetrics* table
- Whether the data is collected by default
- How often the data is collected by default
 
You can modify which queries are run and data collection frequency when you create your monitoring profile. 

### Azure SQL DB data 

| Query Name | DMV | Namespace | Enabled by Default | Default collection frequency |
|:---|:---|:---|:---|:---|
| AzureSQLDBWaitStats |  sys.dm_db_wait_stats | sqlserver_azuredb_waitstats | No | NA |
| AzureSQLDBResourceStats | sys.dm_db_resource_stats | sqlserver_azure_db_resource_stats | Yes | 60 seconds |
| AzureSQLDBResourceGovernance | sys.dm_user_db_resource_governance | sqlserver_db_resource_governance | Yes | 60 seconds |
| AzureSQLDBDatabaseIO | sys.dm_io_virtual_file_stats<br>sys.database_files<br>tempdb.sys.database_files | sqlserver_database_io | Yes | 60 seconds |
| AzureSQLDBServerProperties | sys.dm_os_job_object<br>sys.database_files<br>sys.[databases]<br>sys.[database_service_objectives] | sqlserver_server_properties | Yes | 60 seconds |
| AzureSQLDBOsWaitstats | sys.dm_os_wait_stats | sqlserver_waitstats | Yes | 60 seconds |
| AzureSQLDBMemoryClerks | sys.dm_os_memory_clerks | sqlserver_memory_clerks | Yes | 60 seconds |
| AzureSQLDBPerformanceCounters | sys.dm_os_performance_counters<br>sys.databases | sqlserver_performance | Yes | 60 seconds |
| AzureSQLDBRequests | sys.dm_exec_sessions<br>sys.dm_exec_requests<br>sys.dm_exec_sql_text | sqlserver_requests | No | NA |
| AzureSQLDBSchedulers | sys.dm_os_schedulers | sqlserver_schedulers | No | NA  |

### Azure SQL managed instance data 

| Query Name | DMV | Namespace | Enabled by Default | Default collection frequency |
|:---|:---|:---|:---|:---|
| AzureSQLMIResourceStats | sys.server_resource_stats | sqlserver_azure_db_resource_stats | Yes | 60 seconds |
| AzureSQLMIResourceGovernance | sys.dm_instance_resource_governance | sqlserver_instance_resource_governance | Yes | 60 seconds |
| AzureSQLMIDatabaseIO | sys.dm_io_virtual_file_stats<br>sys.master_files | sqlserver_database_io | Yes | 60 seconds |
| AzureSQLMIServerProperties | sys.server_resource_stats | sqlserver_server_properties | Yes | 60 seconds |
| AzureSQLMIOsWaitstats | sys.dm_os_wait_stats | sqlserver_waitstats | Yes | 60 seconds |
| AzureSQLMIMemoryClerks | sys.dm_os_memory_clerks | sqlserver_memory_clerks | Yes | 60 seconds |
| AzureSQLMIPerformanceCounters | sys.dm_os_performance_counters<br>sys.databases | sqlserver_performance | Yes | 60 seconds |
| AzureSQLMIRequests | sys.dm_exec_sessions<br>sys.dm_exec_requests<br>sys.dm_exec_sql_text | sqlserver_requests | No | NA |
| AzureSQLMISchedulers | sys.dm_os_schedulers | sqlserver_schedulers | No | NA |

### SQL Server data

| Query Name | DMV | Namespace | Enabled by Default | Default collection frequency |
|:---|:---|:---|:---|:---|
| SQLServerPerformanceCounters | sys.dm_os_performance_counters | sqlserver_performance | Yes | 60 seconds |
| SQLServerWaitStatsCategorized | sys.dm_os_wait_stats | sqlserver_waitstats | Yes | 60 seconds | 
| SQLServerDatabaseIO | sys.dm_io_virtual_file_stats<br>sys.master_files | sqlserver_database_io | Yes | 60 seconds |
| SQLServerProperties | sys.dm_os_sys_info | sqlserver_server_properties | Yes | 60 seconds |
| SQLServerMemoryClerks | sys.dm_os_memory_clerks | sqlserver_memory_clerks | Yes | 60 seconds |
| SQLServerSchedulers | sys.dm_os_schedulers | sqlserver_schedulers | No | NA |
| SQLServerRequests | sys.dm_exec_sessions<br>sys.dm_exec_requests<br>sys.dm_exec_sql_text | sqlserver_requests | No | NA |
| SQLServerVolumeSpace | sys.master_files | sqlserver_volume_space | Yes | 60 seconds |
| SQLServerCpu | sys.dm_os_ring_buffers | sqlserver_cpu | Yes | 60 seconds |
| SQLServerAvailabilityReplicaStates | sys.dm_hadr_availability_replica_states<br>sys.availability_replicas<br>sys.availability_groups<br>sys.dm_hadr_availability_group_states | sqlserver_hadr_replica_states | | 60 seconds |
| SQLServerDatabaseReplicaStates | sys.dm_hadr_database_replica_states<br>sys.availability_replicas | sqlserver_hadr_dbreplica_states | | 60 seconds |




## Next steps

See [Enable SQL insights](sql-insights-enable.md) for the detailed procedure to enable SQL insights.
See [Frequently asked questions](../faq.md#sql-insights-preview) for frequently asked questions about SQL insights.
