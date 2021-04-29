---
title: Job automation overview with Elastic Jobs
description: 'Use Elastic Jobs for Job Automation to run Transact-SQL (T-SQL) scripts across a set of one or more databases'
services: sql-database
ms.service: sql-database
ms.subservice: elastic-pools
ms.custom: sqldbrb=1, contperf-fy21q3
ms.devlang: 
dev_langs:
  -  "TSQL"
ms.topic: conceptual
author: williamdassafMSFT
ms.author: wiassaf
ms.reviewer:
ms.date: 2/1/2021
---
# Automate management tasks using elastic jobs (preview)

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

You can create and schedule elastic jobs that could be periodically executed against one or many Azure SQL databases to run Transact-SQL (T-SQL) queries and perform maintenance tasks. 

You can define target database or groups of databases where the job will be executed, and also define schedules for running a job.
A job handles the task of logging in to the target database. You also define, maintain, and persist Transact-SQL scripts to be executed across a group of databases.

Every job logs the status of execution and also automatically retries the operations if any failure occurs.

## When to use elastic jobs

There are several scenarios when you could use elastic job automation:

- Automate management tasks and schedule them to run every weekday, after hours, etc.
  - Deploy schema changes, credentials management, performance data collection or tenant (customer) telemetry collection.
  - Update reference data (information common across all databases), load data from Azure Blob storage.
- Configure jobs to execute across a collection of databases on a recurring basis, such as during off-peak hours.
  - Collect query results from a set of databases into a central table on an on-going basis. Performance queries can be continually executed and configured to trigger additional tasks to be executed.
- Collect data for reporting
  - Aggregate data from a collection of databases into a single destination table.
  - Execute longer running data processing queries across a large set of databases, for example the collection of customer telemetry. Results are collected into a single destination table for further analysis.
- Data movements 

### Automation on other platforms

Consider the following job scheduling technologies on different platforms:

- **Elastic Jobs** are Job Scheduling services that execute custom jobs on one or many databases in Azure SQL Database.
- **SQL Agent Jobs** are executed by the SQL Agent service that continues to be used for task automation in SQL Server and is also included with Azure SQL Managed Instances. SQL Agent Jobs are not available in Azure SQL Database.

Elastic Jobs can target [Azure SQL Databases](sql-database-paas-overview.md), [Azure SQL Database elastic pools](elastic-pool-overview.md), and Azure SQL Databases in [shard maps](elastic-scale-shard-map-management.md).

For T-SQL script job automation in SQL Server and Azure SQL Managed Instance, consider [SQL Agent](job-automation-managed-instances.md). 

For T-SQL script job automation in Azure Synapse Analytics, consider [pipelines with recurring triggers](../../synapse-analytics/data-integration/concepts-data-factory-differences.md), which are [based on Azure Data Factory](../../synapse-analytics/data-integration/concepts-data-factory-differences.md).

It is worth noting differences between SQL Agent (available in SQL Server and as part of SQL Managed Instance), and the Database Elastic Job agent (which can execute T-SQL on Azure SQL Databases or databases in SQL Server and Azure SQL Managed Instance, Azure Synapse Analytics).

| |Elastic Jobs |SQL Agent |
|---------|---------|---------|
|**Scope** | Any number of databases in Azure SQL Database and/or data warehouses in the same Azure cloud as the job agent. Targets can be in different servers, subscriptions, and/or regions. <br><br>Target groups can be composed of individual databases or data warehouses, or all databases in a server, pool, or shard map (dynamically enumerated at job runtime). | Any individual database in the same instance as the SQL agent. The Multi Server Administration feature of SQL Server Agent allows for master/target instances to coordinate job execution, though this feature is not available in SQL managed instance. |
|**Supported APIs and Tools** | Portal, PowerShell, T-SQL, Azure Resource Manager | T-SQL, SQL Server Management Studio (SSMS) |
 
## Elastic job targets

**Elastic Jobs** provide the ability to run one or more T-SQL scripts in parallel, across a large number of databases, on a schedule or on-demand.

You can run scheduled jobs against any combination of databases: one or more individual databases, all databases on a server, all databases in an elastic pool, or shard map, with the added flexibility to include or exclude any specific database. Jobs can run across multiple servers, multiple pools, and can even run against databases in different subscriptions. Servers and pools are dynamically enumerated at runtime, so jobs run against all databases that exist in the target group at the time of execution.

The following image shows a job agent executing jobs across the different types of target groups:

![Elastic Job agent conceptual model](./media/job-automation-overview/conceptual-diagram.png)

### Elastic job components

|Component | Description (additional details are below the table) |
|---------|---------|
|[**Elastic Job agent**](#elastic-job-agent) | The Azure resource you create to run and manage Jobs. |
|[**Job database**](#elastic-job-database) | A database in Azure SQL Database that the job agent uses to store job related data, job definitions, etc. |
|[**Target group**](#target-group) | The set of servers, pools, databases, and shard maps to run a job against. |
|[**Job**](#elastic-jobs-and-job-steps) | A job is a unit of work that is composed of one or more job steps. Job steps specify the T-SQL script to run, as well as other details required to execute the script. |

#### Elastic job agent

An Elastic Job agent is the Azure resource for creating, running, and managing jobs. The Elastic Job agent is an Azure resource you create in the portal ([PowerShell](elastic-jobs-powershell-create.md) and REST are also supported).

Creating an **Elastic Job agent** requires an existing database in Azure SQL Database. The agent configures this existing Azure SQL Database as the [*Job database*](#elastic-job-database).

The Elastic Job agent is free. The job database is billed at the same rate as any database in Azure SQL Database.

#### Elastic job database

The *Job database* is used for defining jobs and tracking the status and history of job executions. The *Job database* is also used to store agent metadata, logs, results, job definitions, and also contains many useful stored procedures and other database objects for creating, running, and managing jobs using T-SQL.

For the current preview, an existing database in Azure SQL Database (S0 or higher) is required to create an Elastic Job agent.

The *Job database* should be a clean, empty, S0 or higher service objective Azure SQL Database. The recommended service objective of the *Job database* is S1 or higher, but the optimal choice depends on the performance needs of your job(s): the number of job steps, the number of job targets, and how frequently jobs are run. 

If operations against the job database are slower than expected, [monitor](monitor-tune-overview.md#azure-sql-database-and-azure-sql-managed-instance-resource-monitoring) database performance and the resource utilization in the job database during periods of slowness using Azure portal or the [sys.dm_db_resource_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database) DMV. If utilization of a resource, such as CPU, Data IO, or Log Write approaches 100% and correlates with periods of slowness, consider incrementally scaling the database to higher service objectives (either in the [DTU model](service-tiers-dtu.md) or in the [vCore model](service-tiers-vcore.md)) until job database performance is sufficiently improved.

##### Elastic job database permissions

During job agent creation, a schema, tables, and a role called *jobs_reader* are created in the *Job database*. The role is created with the following permission and is designed to give administrators finer access control for job monitoring:

|Role name |'jobs' schema permissions |'jobs_internal' schema permissions |
|---------|---------|---------|
|**jobs_reader** | SELECT | None |

> [!IMPORTANT]
> Consider the security implications before granting access to the *Job database* as a database administrator. A malicious user with permissions to create or edit jobs could create or edit a job that uses a stored credential to connect to a database under the malicious user's control, which could allow the malicious user to determine the credential's password.

#### Target group

A *target group* defines the set of databases a job step will execute on. A target group can contain any number and combination of the following:

- **Logical SQL server** - if a server is specified, all databases that exist in the server at the time of the job execution are part of the group. The master database credential must be provided so that the group can be enumerated and updated prior to job execution. For more information on logical servers, see [What is a server in Azure SQL Database and Azure Synapse Analytics?](logical-servers.md).
- **Elastic pool** - if an elastic pool is specified, all databases that are in the elastic pool at the time of the job execution are part of the group. As for a server, the master database credential must be provided so that the group can be updated prior to the job execution.
- **Single database** - specify one or more individual databases to be part of the group.
- **Shard map** - databases of a shard map.

> [!TIP]
> At the moment of job execution, *dynamic enumeration* re-evaluates the set of databases in target groups that include servers or pools. Dynamic enumeration ensures that **jobs run across all databases that exist in the server or pool at the time of job execution**. Re-evaluating the list of databases at runtime is specifically useful for scenarios where pool or server membership changes frequently.

Pools and single databases can be specified as included or excluded from the group. This enables creating a target group with any combination of databases. For example, you can add a server to a target group, but exclude specific databases in an elastic pool (or exclude an entire pool).

A target group can include databases in multiple subscriptions, and across multiple regions. Note that cross-region executions have higher latency than executions within the same region.

The following examples show how different target group definitions are dynamically enumerated at the moment of job execution to determine which databases the job will run:

![Target group examples](./media/job-automation-overview/targetgroup-examples1.png)

**Example 1** shows a target group that consists of a list of individual databases. When a job step is executed using this target group, the job step's action will be executed in each of those databases.<br>
**Example 2** shows a target group that contains a server as a target. When a job step is executed using this target group, the server is dynamically enumerated to determine the list of databases that are currently in the server. The job step's action will be executed in each of those databases.<br>
**Example 3** shows a similar target group as *Example 2*, but an individual database is specifically excluded. The job step's action will *not* be executed in the excluded database.<br>
**Example 4** shows a target group that contains an elastic pool as a target. Similar to *Example 2*, the pool will be dynamically enumerated at job run time to determine the list of databases in the pool.
<br><br>

![Additional target group examples](./media/job-automation-overview/targetgroup-examples2.png)

**Example 5** and **Example 6** show advanced scenarios where servers, elastic pools, and databases can be combined using include and exclude rules.<br>
**Example 7** shows that the shards in a shard map can also be evaluated at job run time.

> [!NOTE]
> The Job database itself can be the target of a job. In this scenario, the Job database is treated just like any other target database. The job user must be created and granted sufficient permissions in the Job database, and the database scoped credential for the job user must also exist in the Job database, just like it does for any other target database.

#### Elastic jobs and job steps

A *job* is a unit of work that is executed on a schedule or as a one-time job. A job consists of one or more *job steps*.

Each job step specifies a T-SQL script to execute, one or more target groups to run the T-SQL script against, and the credentials the job agent needs to connect to the target database. Each job step has customizable timeout and retry policies, and can optionally specify output parameters.

#### Job output

The outcome of a job's steps on each target database are recorded in detail, and script output can be captured to a specified table. You can specify a database to save any data returned from a job.

#### Job history

View Elastic Job execution history in the *Job database* by [querying the table jobs.job_executions](elastic-jobs-tsql-create-manage.md#monitor-job-execution-status). A system cleanup job purges execution history that is older than 45 days. To remove history less than 45 days old, call the **sp_purge_jobhistory** stored procedure in the *Job database*.

#### Job status

You can monitor Elastic Job executions in the *Job database* by [querying the table jobs.job_executions](elastic-jobs-tsql-create-manage.md#monitor-job-execution-status). 

### Agent performance, capacity, and limitations

Elastic Jobs use minimal compute resources while waiting for long-running jobs to complete.

Depending on the size of the target group of databases and the desired execution time for a job (number of concurrent workers), the agent requires different amounts of compute and performance of the *Job database* (the more targets and the higher number of jobs, the higher the amount of compute required).

Currently, the limit is 100 concurrent jobs.

#### Prevent jobs from reducing target database performance

To ensure resources aren't overburdened when running jobs against databases in a SQL elastic pool, jobs can be configured to limit the number of databases a job can run against at the same time.

## Next steps

- [How to create and manage elastic jobs](elastic-jobs-overview.md)
- [Create and manage Elastic Jobs using PowerShell](elastic-jobs-powershell-create.md)
- [Create and manage Elastic Jobs using Transact-SQL (T-SQL)](elastic-jobs-tsql-create-manage.md)
