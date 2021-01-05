---
title: Job automation
description: 'Automation options to run Transact-SQL (T-SQL) scripts in Azure SQL Managed Instance'
services: sql-database
ms.service: sql-db-mi
ms.subservice: features
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer:
ms.date: 12/31/2020
---
# Automate management tasks using database jobs in Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Using [SQL Server Agent](/sql/ssms/agent/sql-server-agent) in SQL Server and [SQL Managed Instance](../../azure-sql/managed-instance/sql-managed-instance-paas-overview.md), you can create and schedule jobs that could be periodically executed against one or many databases to run Transact-SQL (T-SQL) queries and perform maintenance tasks. 

It is worth noting the differences between SQL Agent available in SQL Server and as part of SQL Managed Instance. For more on the supported feature differences between SQL Server and SQL Managed Instance, see [Azure SQL Managed Instance T-SQL differences from SQL Server](../../azure-sql/managed-instance/transact-sql-tsql-differences-sql-server.md#sql-server-agent). SQL Agent is not available in Azure SQL Database or Azure Synapse Analytics. 

## When to use SQL Agent jobs 

There are several scenarios when you could use SQL Agent jobs:

- Automate management tasks and schedule them to run every weekday, after hours, etc.
  - Deploy schema changes, credentials management, performance data collection or tenant (customer) telemetry collection.
  - Update reference data (information common across all databases), load data from Azure Blob storage.
  - Common maintenance tasks including DBCC CHECKDB to ensure data integrity or index maintenance to improve query performance. Configure jobs to execute across a collection of databases on a recurring basis, such as during off-peak hours.
  - Collect query results from a set of databases into a central table on an on-going basis. Performance queries can be continually executed and configured to trigger additional tasks to be executed.
- Collect data for reporting
  - Aggregate data from a collection of databases into a single destination table.
  - Execute longer running data processing queries across a large set of databases, for example the collection of customer telemetry. Results are collected into a single destination table for further analysis.
- Data movements
  - Create jobs that replicate changes made in your databases to other databases or collect updates made in remote databases and apply changes in the database.
  - Create jobs that load data from or to your databases using SQL Server Integration Services (SSIS).

## SQL Agent Jobs 

SQL Agent Jobs are executed by the SQL Agent service that continues to be used for task automation in SQL Server and SQL Managed Instance. 

SQL Agent Jobs are a specified series of T-SQL scripts against your database. Use jobs to define an administrative task that can be run one or more times and monitored for success or failure. 

A job can run on one local server or on multiple remote servers. SQL Agent Jobs are an internal Database Engine component that is executed within the SQL Managed Instance service.

There are several key concepts in SQL Agent Jobs:

- **Job steps** set of one or many steps that should be executed within the job. For every job step you can define retry strategy and the action that should happen if the job step succeeds or fails.
- **Schedules** define when the job should be executed.
- **Notifications** enable you to define rules that will be used to notify operators via email once the job completes.

### Job steps

SQL Agent Job steps are sequences of actions that SQL Agent should execute. Every step has the following step that should be executed if the step succeeds or fails, number of retries in a case of failure.

SQL Agent enables you to create different types of job steps, such as Transact-SQL job steps that execute a single Transact-SQL batch against the database, or OS command/PowerShell steps that can execute custom OS script, SSIS job steps that enable you to load data using SSIS runtime, or [replication](../managed-instance/replication-transactional-overview.md) steps that can publish changes from your database to other databases.

[Transactional replication](../managed-instance/replication-transactional-overview.md) is a Database Engine feature that enables you to publish the changes made on one or multiple tables in one database and publish/distribute them to a set of subscriber databases. Publishing of the changes is implemented using the following SQL Agent job step types:

- Transaction-log reader.
- Snapshot.
- Distributor.

Other types of job steps are not currently supported in SQL Managed Instance, including:

- Merge replication job step is not supported.
- Queue Reader is not supported.
- Analysis Services are not supported
 
### Job schedules

A schedule specifies when a job runs. More than one job can run on the same schedule, and more than one schedule can apply to the same job.
A schedule can define the following conditions for the time when a job runs:

- Whenever Instance is restarted (or when SQL Server Agent starts). Job is activated after every failover.
- One time, at a specific date and time, which is useful for delayed execution of some job.
- On a recurring schedule.

> [!Note]
> SQL Managed Instance currently does not enable you to start a job when the instance is "idle".

### Job notifications

SQL Agent Jobs enable you to get notifications when the job finishes successfully or fails. You can receive notifications via email.

As an example exercise, first you would need to set up the email account that will be used to send the email notifications and assign the account to the email profile called `AzureManagedInstance_dbmail_profile`, as shown in the following sample:

```sql
-- Create a Database Mail account
EXECUTE msdb.dbo.sysmail_add_account_sp
    @account_name = 'SQL Agent Account',
    @description = 'Mail account for Azure SQL Managed Instance SQL Agent system.',
    @email_address = '$(loginEmail)',
    @display_name = 'SQL Agent Account',
    @mailserver_name = '$(mailserver)' ,
    @username = '$(loginEmail)' ,
    @password = '$(password)'

-- Create a Database Mail profile
EXECUTE msdb.dbo.sysmail_add_profile_sp
    @profile_name = 'AzureManagedInstance_dbmail_profile',
    @description = 'E-mail profile used for messages sent by Managed Instance SQL Agent.' ;

-- Add the account to the profile
EXECUTE msdb.dbo.sysmail_add_profileaccount_sp
    @profile_name = 'AzureManagedInstance_dbmail_profile',
    @account_name = 'SQL Agent Account',
    @sequence_number = 1;
```

You would also need to enable Database Mail on Azure SQL Managed Instance:

```sql
GO
EXEC sp_configure 'show advanced options', 1;
GO
RECONFIGURE;
GO
EXEC sp_configure 'Database Mail XPs', 1;
GO
RECONFIGURE
```

You can notify the operator that something happened with your SQL Agent jobs. An operator defines contact information for an individual responsible for the maintenance of one or more instances in SQL Managed Instance. Sometimes, operator responsibilities are assigned to one individual.
In systems with multiple instances in SQL Managed Instance or SQL Server, many individuals can share operator responsibilities. An operator does not contain security information, and does not define a security principal.

You can create operators using SSMS or the Transact-SQL script shown in the following example:

```sql
EXEC msdb.dbo.sp_add_operator
    @name=N'Mihajlo Pupun',
    @enabled=1,
    @email_address=N'mihajlo.pupin@contoso.com'
```

You can modify any job and assign operators that will be notified via email if the job completes, fails, or succeeds using SSMS or the following Transact-SQL script:

```sql
EXEC msdb.dbo.sp_update_job @job_name=N'Load data using SSIS',
    @notify_level_email=3, -- Options are: 1 on succeed, 2 on failure, 3 on complete
    @notify_email_operator_name=N'Mihajlo Pupun'
```

### SQL Agent Job Limitations in Azure SQL Managed Instance

Some of the SQL Agent features that are available in SQL Server are not supported in SQL Managed Instance:

- SQL Agent settings are read only. Procedure `sp_set_agent_properties` is not supported in SQL Managed Instance.
- Enabling/disabling SQL Agent is currently not supported in SQL Managed Instance. SQL Agent is always running.
- Notifications are partially supported
  - Pager is not supported.
  - NetSend is not supported.
  - Alerts are not supported.
- Proxies are not supported.
- Eventlog is not supported.

## Next steps

- [What is SQL Server Agent](/sql/ssms/agent/sql-server-agent)
- [Job automation with Elastic Jobs](job-automation-overview.md)
