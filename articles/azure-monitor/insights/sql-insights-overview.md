---
title: Monitor your SQL deployments with SQL insights (preview)
description: Overview of SQL insights in Azure Monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/15/2021
---

# Monitor your SQL deployments with SQL insights (preview)
SQL insights monitors the performance and health of your SQL deployments.  It can help deliver predictable performance and availability of vital workloads you have built around a SQL backend by identifying performance bottlenecks and issues. SQL insights stores its data in [Azure Monitor Logs](../logs/data-platform-logs.md), which allows it to deliver powerful aggregation and filtering and to analyze data trends over time. You can view this data from Azure Monitor workbooks, or you can delve directly into the log data to run queries and analyze trends.

SQL insights does not install anything on your SQL IaaS deployments. Instead, it uses dedicated monitoring virtual machines to remotely collect data for both SQL PaaS and SQL IaaS deployments.  The SQL insights monitoring profile allows you to manage the data sets to be collected based upon the type of SQL, including Azure SQL DB, Azure SQL Managed Instance, and SQL server running on an Azure virtual machine.

## Pricing
There is no direct cost for SQL insights. All costs are incurred by the Log Analytics workspaces that store the data and the virtual machines that gather the data. 

For virtual machines, you're charged based on the pricing that published on the [virtual machines pricing page](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/).

For Log Analytics, you're charged for activity in the Log Analytics workspace. This activity can vary by the amount of data collected, which can subsequently vary by the amount of database activity. Based on the pricing that's published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/), SQL insights is billed for:

- Data ingested from agents and stored in the workspace
- Alert rules based on log data
- Notifications sent from alert rules

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
See [Enable SQL insights](sql-insights-enable.md) for instructions on enabling SQL insights.

## Troubleshoot SQL insights 
See [Troubleshooting SQL insights](sql-insights-troubleshoot.md) for instructions on troubleshooting SQL insights.

## Data collected by SQL insights
Different sets of data are available for Azure SQL Database, Azure SQL Managed Instance, and SQL Server. The tables below describe the available data. You can customize which data sets to collect and the frequency of collection when you [create a monitoring profile](../insights/../azure-monitor/insights/sql-insights-enable.md#create-sql-monitoring-profile).

The tables below have the following columns:
- **Friendly Name**: Name of the query as shown on the Azure portal when creating a monitoring profile
- **Configuration Name**: Name of the query as shown on the Azure portal when editing a monitoring profile
- **Namespace**: Name of the query as found in a Log Analytics workspace. This identifier appears in the **InsighstMetrics** table on the `Namespace` property in the `Tags` column
- **DMV**: The Dynamic Managed Views used to produce the data set
- **Enabled by Default**: Whether the data is collected by default
- **Default Collection Frequency**: How often the data is collected by default

### Data for Azure SQL Database 
| Friendly Name | Configuration Name | Namespace | DMV | Enabled by Default | Default Collection Frequency |
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

| Friendly Name | Configuration Name | Namespace | DMV | Enabled by Default | Default Collection Frequency |
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

| Friendly Name | Configuration Name | Namespace | DMV | Enabled by Default | Default Collection Frequency |
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

See [Enable SQL insights](sql-insights-enable.md) for instructions on enabling SQL insights
See [Frequently asked questions](../faq.md#sql-insights-preview) for frequently asked questions about SQL insights
