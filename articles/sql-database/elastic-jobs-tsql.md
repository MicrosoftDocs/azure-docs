---
title: "Create and manage Azure SQL Elastic Database Jobs using Transact-SQL (T-SQL) | Microsoft Docs"
description: Run scripts across many databases with Elastic Database Job agent using Transact-SQL (T-SQL).
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: 
ms.devlang: 
ms.topic: conceptual
ms.author: jaredmoo
author: jaredmoo
ms.reviewer: sstein
manager: craigg
ms.date: 01/25/2019
---
# Use Transact-SQL (T-SQL) to create and manage Elastic Database Jobs

This article provides many example scenarios to get started working with Elastic Jobs using T-SQL.

The examples use the [stored procedures](#job-stored-procedures) and [views](#job-views) available in the [*job database*](sql-database-job-automation-overview.md#job-database).

Transact-SQL (T-SQL) is used to create, configure, execute, and manage jobs. Creating the Elastic Job agent is not supported in T-SQL, so you must first create an *Elastic Job agent* using the portal, or [PowerShell](elastic-jobs-powershell.md#create-the-elastic-job-agent).


## Create a credential for job execution

The credential is used to connect to your target databases for script execution. The credential needs appropriate permissions, on the databases specified by the target group, to successfully execute the script. When using a server and/or pool target group member, it is highly suggested to create a master credential for use to refresh the credential prior to expansion of the server and/or pool at time of job execution. The database scoped credential is created on the job agent database. The same credential must be used to *Create a Login* and *Create a User from Login to grant the Login Database Permissions* on the target databases.


```sql
--Connect to the job database specified when creating the job agent

-- Create a db master key if one does not already exist, using your own password.  
CREATE MASTER KEY ENCRYPTION BY PASSWORD='<EnterStrongPasswordHere>';  
  
-- Create a database scoped credential.  
CREATE DATABASE SCOPED CREDENTIAL myjobcred WITH IDENTITY = 'jobcred',
    SECRET = '<EnterStrongPasswordHere>'; 
GO

-- Create a database scoped credential for the master database of server1.
CREATE DATABASE SCOPED CREDENTIAL mymastercred WITH IDENTITY = 'mastercred',
    SECRET = '<EnterStrongPasswordHere>'; 
GO
```

## Create a target group (servers)

The following example shows how to execute a job against all databases in a server.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:


```sql
-- Connect to the job database specified when creating the job agent

-- Add a target group containing server(s)
EXEC jobs.sp_add_target_group 'ServerGroup1'

-- Add a server target member
EXEC jobs.sp_add_target_group_member
'ServerGroup1',
@target_type = 'SqlServer',
@refresh_credential_name='mymastercred', --credential required to refresh the databases in server
@server_name='server1.database.windows.net'

--View the recently created target group and target group members
SELECT * FROM jobs.target_groups WHERE target_group_name='ServerGroup1';
SELECT * FROM jobs.target_group_members WHERE target_group_name='ServerGroup1';
```


## Exclude an individual database

The following example shows how to execute a job against all databases in a SQL Database server, except for the database named *MappingDB*.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:

```sql
--Connect to the job database specified when creating the job agent

-- Add a target group containing server(s)
EXEC [jobs].sp_add_target_group N'ServerGroup'
GO

-- Add a server target member
EXEC [jobs].sp_add_target_group_member
@target_group_name = N'ServerGroup',
@target_type = N'SqlServer',
@refresh_credential_name=N'mymastercred', --credential required to refresh the databases in server
@server_name=N'London.database.windows.net'
GO

-- Add a server target member
EXEC [jobs].sp_add_target_group_member
@target_group_name = N'ServerGroup',
@target_type = N'SqlServer',
@refresh_credential_name=N'mymastercred', --credential required to refresh the databases in server
@server_name='server2.database.windows.net'
GO

--Exclude a database target member from the server target group
EXEC [jobs].sp_add_target_group_member
@target_group_name = N'ServerGroup',
@membership_type = N'Exclude',
@target_type = N'SqlDatabase',
@server_name = N'server1.database.windows.net',
@database_name =N'MappingDB'
GO

--View the recently created target group and target group members
SELECT * FROM [jobs].target_groups WHERE target_group_name = N'ServerGroup';
SELECT * FROM [jobs].target_group_members WHERE target_group_name = N'ServerGroup';
```


## Create a target group (pools)

The following example shows how to target all the databases in one or more elastic pools.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:

```sql
--Connect to the job database specified when creating the job agent

-- Add a target group containing pool(s)
EXEC jobs.sp_add_target_group 'PoolGroup'

-- Add an elastic pool(s) target member
EXEC jobs.sp_add_target_group_member
'PoolGroup',
@target_type = 'SqlElasticPool',
@refresh_credential_name='mymastercred', --credential required to refresh the databases in server
@server_name='server1.database.windows.net',
@elastic_pool_name='ElasticPool-1'

-- View the recently created target group and target group members
SELECT * FROM jobs.target_groups WHERE target_group_name = N'PoolGroup';
SELECT * FROM jobs.target_group_members WHERE target_group_name = N'PoolGroup';
```


## Deploy new schema to many databases

The following example shows how to deploy new schema to all databases.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:


```sql
--Connect to the job database specified when creating the job agent

--Add job for create table
EXEC jobs.sp_add_job @job_name='CreateTableTest', @description='Create Table Test'

-- Add job step for create table
EXEC jobs.sp_add_jobstep @job_name='CreateTableTest',
@command=N'IF NOT EXISTS (SELECT * FROM sys.tables 
           	WHERE object_id = object_id(''Test''))
CREATE TABLE [dbo].[Test]([TestId] [int] NOT NULL);',
@credential_name='myjobcred',
@target_group_name='PoolGroup'
```


## Data collection using built-in parameters

In many data collection scenarios, it can be useful to include some of these scripting variables to help post-process the results of the job.

- $(job_name)
- $(job_id)
- $(job_version)
- $(step_id)
- $(step_name)
- $(job_execution_id)
- $(job_execution_create_time)
- $(target_group_name)

For example, to group all results from the same job execution together, use the *$(job_execution_id)* as shown in the following command:


```sql
@command= N' SELECT DB_NAME() DatabaseName, $(job_execution_id) AS job_execution_id, * FROM sys.dm_db_resource_stats WHERE end_time > DATEADD(mi, -20, GETDATE());'
```


## Monitor database performance

The following example creates a new job to collect performance data from multiple databases.

By default the job agent will look to create the table to store the returned results in. As a result the login associated with the credential used for the output credential will need to have sufficient permissions to perform this. If you want to manually create the table ahead of time then it needs to have the following properties:
1. Columns with the correct name and data types for the result set.
2. Additional column for internal_execution_id with the data type of uniqueidentifier.
3. A nonclustered index named `IX_<TableName>_Internal_Execution_ID` on the internal_execution_id column.

Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following commands:

```sql
--Connect to the job database specified when creating the job agent

-- Add a job to collect perf results
EXEC jobs.sp_add_job @job_name ='ResultsJob', @description='Collection Performance data from all customers'

-- Add a job step w/ schedule to collect results
EXEC jobs.sp_add_jobstep
@job_name='ResultsJob',
@command= N' SELECT DB_NAME() DatabaseName, $(job_execution_id) AS job_execution_id, * FROM sys.dm_db_resource_stats WHERE end_time > DATEADD(mi, -20, GETDATE());',
@credential_name='myjobcred',
@target_group_name='PoolGroup',
@output_type='SqlDatabase',
@output_credential_name='myjobcred',
@output_server_name='server1.database.windows.net',
@output_database_name='<resultsdb>',
@output_table_name='<resutlstable>'
Create a job to monitor pool performance
--Connect to the job database specified when creating the job agent

-- Add a target group containing master database
EXEC jobs.sp_add_target_group 'MasterGroup'

-- Add a server target member
EXEC jobs.sp_add_target_group_member
@target_group_name='MasterGroup',
@target_type='SqlDatabase',
@server_name='server1.database.windows.net',
@database_name='master'

-- Add a job to collect perf results
EXEC jobs.sp_add_job
@job_name='ResultsPoolsJob',
@description='Demo: Collection Performance data from all pools',
@schedule_interval_type='Minutes',
@schedule_interval_count=15

-- Add a job step w/ schedule to collect results
EXEC jobs.sp_add_jobstep
@job_name='ResultsPoolsJob',
@command=N'declare @now datetime
DECLARE @startTime datetime
DECLARE @endTime datetime
DECLARE @poolLagMinutes datetime
DECLARE @poolStartTime datetime
DECLARE @poolEndTime datetime
SELECT @now = getutcdate ()
SELECT @startTime = dateadd(minute, -15, @now)
SELECT @endTime = @now
SELECT @poolStartTime = dateadd(minute, -30, @startTime)
SELECT @poolEndTime = dateadd(minute, -30, @endTime)

SELECT elastic_pool_name , end_time, elastic_pool_dtu_limit, avg_cpu_percent, avg_data_io_percent, avg_log_write_percent, max_worker_percent, max_session_percent,
        avg_storage_percent, elastic_pool_storage_limit_mb FROM sys.elastic_pool_resource_stats
        WHERE end_time > @poolStartTime and end_time <= @poolEndTime;
'),
@credential_name='myjobcred',
@target_group_name='MasterGroup',
@output_type='SqlDatabase',
@output_credential_name='myjobcred',
@output_server_name='server1.database.windows.net',
@output_database_name='resultsdb',
@output_table_name='resutlstable'
```


## View job definitions

The following example shows how to view current job definitions.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:

```sql
--Connect to the job database specified when creating the job agent

-- View all jobs
SELECT * FROM jobs.jobs

-- View the steps of the current version of all jobs
SELECT js.* FROM jobs.jobsteps js
JOIN jobs.jobs j 
  ON j.job_id = js.job_id AND j.job_version = js.job_version

-- View the steps of all versions of all jobs
select * from jobs.jobsteps
```


## Begin ad hoc execution of a job

The following example shows how to start a job immediately.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:

```sql
--Connect to the job database specified when creating the job agent

-- Execute the latest version of a job
EXEC jobs.sp_start_job 'CreateTableTest'

-- Execute the latest version of a job and receive the execution id
declare @je uniqueidentifier
exec jobs.sp_start_job 'CreateTableTest', @job_execution_id = @je output
select @je

select * from jobs.job_executions where job_execution_id = @je

-- Execute a specific version of a job (e.g. version 1)
exec jobs.sp_start_job 'CreateTableTest', 1
```


## Schedule execution of a job

The following example shows how to schedule a job for future execution.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:

```sql
--Connect to the job database specified when creating the job agent

EXEC jobs.sp_update_job
@job_name='ResultsJob',
@enabled=1,
@schedule_interval_type='Minutes',
@schedule_interval_count=15
```

## Monitor job execution status

The following example shows how to view execution status details for all jobs.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:

```sql
--Connect to the job database specified when creating the job agent

--View top-level execution status for the job named 'ResultsPoolJob'
SELECT * FROM jobs.job_executions 
WHERE job_name = 'ResultsPoolsJob' and step_id IS NULL
ORDER BY start_time DESC

--View all top-level execution status for all jobs
SELECT * FROM jobs.job_executions WHERE step_id IS NULL
ORDER BY start_time DESC

--View all execution statuses for job named 'ResultsPoolsJob'
SELECT * FROM jobs.job_executions 
WHERE job_name = 'ResultsPoolsJob' 
ORDER BY start_time DESC

-- View all active executions
SELECT * FROM jobs.job_executions 
WHERE is_active = 1
ORDER BY start_time DESC
```


## Cancel a job

The following example shows how to cancel a job.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:

```sql
--Connect to the job database specified when creating the job agent

-- View all active executions to determine job execution id
SELECT * FROM jobs.job_executions 
WHERE is_active = 1 AND job_name = 'ResultPoolsJob'
ORDER BY start_time DESC
GO

-- Cancel job execution with the specified job execution id
EXEC jobs.sp_stop_job '01234567-89ab-cdef-0123-456789abcdef'
```


## Delete old job history

The following example shows how to delete job history prior to a specific date.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:

```sql
--Connect to the job database specified when creating the job agent

-- Delete history of a specific job’s executions older than the specified date
EXEC jobs.sp_purge_jobhistory @job_name='ResultPoolsJob', @oldest_date='2016-07-01 00:00:00'

--Note: job history is automatically deleted if it is >45 days old
```

## Delete a job and all its job history

The following example shows how to delete a job and all related job history.  
Connect to the [*job database*](sql-database-job-automation-overview.md#job-database) and run the following command:

```sql
--Connect to the job database specified when creating the job agent

EXEC jobs.sp_delete_job @job_name='ResultsPoolsJob'

--Note: job history is automatically deleted if it is >45 days old
```




## Job stored procedures

The following stored procedures are in the [jobs database](sql-database-job-automation-overview.md#job-database).



|Stored procedure  |Description  |
|---------|---------|
|[sp_add_job](#sp_add_job)     |     Adds a new job.    |
|[sp_update_job](#sp_update_job)    |      Updates an existing job.   |
|[sp_delete_job](#sp_delete_job)     |      Deletes an existing job.   |
|[sp_add_jobstep](#sp_add_jobstep)    |    Adds a step to a job.     |
|[sp_update_jobstep](#sp_update_jobstep)     |     Updates a job step.    |
|[sp_delete_jobstep](#sp_delete_jobstep)     |     Deletes a job step.    |
|[sp_start_job](#sp_start_job)    |  Starts executing a job.       |
|[sp_stop_job](#sp_stop_job)     |     Stops a job execution.   |
|[sp_add_target_group](#sp_add_target_group)    |     Adds a target group.    |
|[sp_delete_target_group](#sp_delete_target_group)     |    Deletes a target group.     |
|[sp_add_target_group_member](#sp_add_target_group_member)     |    Adds a database or group of databases to a target group.     |
|[sp_delete_target_group_member](#sp_delete_target_group_member)     |     Removes a target group member from a target group.    |
|[sp_purge_jobhistory](#sp_purge_jobhistory)    |    Removes the history records for a job.     |





### <a name="sp_add_job"></a>sp_add_job

Adds a new job. 
  
#### Syntax  
  

```sql
[jobs].sp_add_job [ @job_name = ] 'job_name'  
	[ , [ @description = ] 'description' ]   
	[ , [ @enabled = ] enabled ]
	[ , [ @schedule_interval_type = ] schedule_interval_type ]  
	[ , [ @schedule_interval_count = ] schedule_interval_count ]   
	[ , [ @schedule_start_time = ] schedule_start_time ]   
	[ , [ @schedule_end_time = ] schedule_end_time ]   
	[ , [ @job_id = ] job_id OUTPUT ]
```

  
#### Arguments  

[ **\@job_name =** ] 'job_name'  
The name of the job. The name must be unique and cannot contain the percent (%) character. job_name is nvarchar(128), with no default.

[ **\@description =** ] 'description'  
The description of the job. description is nvarchar(512), with a default of NULL. If description is omitted, an empty string is used.

[ **\@enabled =** ] enabled  
Whether the job’s schedule is enabled. Enabled is bit, with a default of 0 (disabled). If 0, the job is not enabled and does not run according to its schedule; however, it can be run manually. If 1, the job will run according to its schedule, and can also be run manually.

[ **\@schedule_interval_type =**] schedule_interval_type  
Value indicates when the job is to be executed. schedule_interval_type is nvarchar(50), with a default of Once, and can be one of the following values:
- 'Once',
- 'Minutes',
- 'Hours',
- 'Days',
- 'Weeks',
- 'Months'

[ **\@schedule_interval_count =** ] schedule_interval_count  
Number of schedule_interval_count  periods to occur between each execution of the job. schedule_interval_count is int, with a default of 1. The value must be greater than or equal to 1.

[ **\@schedule_start_time =** ] schedule_start_time  
Date on which job execution can begin. schedule_start_time is DATETIME2, with the default of 0001-01-01 00:00:00.0000000.

[ **\@schedule_end_time =** ] schedule_end_time  
Date on which job execution can stop. schedule_end_time is DATETIME2, with the default of 9999-12-31 11:59:59.0000000. 

[ **\@job_id =** ] job_id OUTPUT  
The job identification number assigned to the job if created successfully. job_id is an output variable of type uniqueidentifier.

#### Return Code Values

0 (success) or 1 (failure)

#### Remarks
sp_add_job must be run from the job agent database specified when creating the job agent.
After sp_add_job has been executed to add a job, sp_add_jobstep can be used to add steps that perform the activities for the job. The job’s initial version number is 0, which will be incremented to 1 when the first step is added.

#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:

- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.

### <a name="sp_update_job"></a>sp_update_job

Updates an existing job.

#### Syntax

```sql
[jobs].sp_update_job [ @job_name = ] 'job_name'  
	[ , [ @new_name = ] 'new_name' ]
	[ , [ @description = ] 'description' ]   
	[ , [ @enabled = ] enabled ]
	[ , [ @schedule_interval_type = ] schedule_interval_type ]  
	[ , [ @schedule_interval_count = ] schedule_interval_count ]   
	[ , [ @schedule_start_time = ] schedule_start_time ]   
	[ , [ @schedule_end_time = ] schedule_end_time ]   
```

#### Arguments
[ **\@job_name =** ] 'job_name'  
The name of the job to be updated. job_name is nvarchar(128).

[ **\@new_name =** ] 'new_name'  
The new name of the job. new_name is nvarchar(128).

[ **\@description =** ] 'description'  
The description of the job. description is nvarchar(512).

[ **\@enabled =** ] enabled  
Specifies whether the job’s schedule is enabled (1) or not enabled (0). Enabled is bit.

[ **\@schedule_interval_type=** ] schedule_interval_type  
Value indicates when the job is to be executed. schedule_interval_type is nvarchar(50) and can be one of the following values:

- 'Once',
- 'Minutes',
- 'Hours',
- 'Days',
- 'Weeks',
- 'Months'

[ **\@schedule_interval_count=** ] schedule_interval_count  
Number of schedule_interval_count  periods to occur between each execution of the job. schedule_interval_count is int, with a default of 1. The value must be greater than or equal to 1.

[ **\@schedule_start_time=** ] schedule_start_time  
Date on which job execution can begin. schedule_start_time is DATETIME2, with the default of 0001-01-01 00:00:00.0000000.

[ **\@schedule_end_time=** ] schedule_end_time  
Date on which job execution can stop. schedule_end_time is DATETIME2, with the default of 9999-12-31 11:59:59.0000000. 

#### Return Code Values
0 (success) or 1 (failure)

#### Remarks
After sp_add_job has been executed to add a job, sp_add_jobstep can be used to add steps that perform the activities for the job. The job’s initial version number is 0, which will be incremented to 1 when the first step is added.

#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:
- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.



### <a name="sp_delete_job"></a>sp_delete_job

Deletes an existing job.

#### Syntax

```sql
[jobs].sp_delete_job [ @job_name = ] 'job_name'
	[ , [ @force = ] force ]
```

#### Arguments
[ **\@job_name =** ] 'job_name'  
The name of the job to be deleted. job_name is nvarchar(128).

[ **\@force =** ] force  
Specifies whether to delete if the job has any executions in progress and cancel all in-progress executions (1) or fail if any job executions are in progress (0). force is bit.

#### Return Code Values
0 (success) or 1 (failure)

#### Remarks
Job history is automatically deleted when a job is deleted.

#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:
- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.



### <a name="sp_add_jobstep"></a>sp_add_jobstep

Adds a step to a job.

#### Syntax


```sql
[jobs].sp_add_jobstep [ @job_name = ] 'job_name'   
     [ , [ @step_id = ] step_id ]   
     [ , [ @step_name = ] step_name ]   
     [ , [ @command_type = ] 'command_type' ]   
     [ , [ @command_source = ] 'command_source' ]  
     , [ @command = ] 'command'
     , [ @credential_name = ] 'credential_name'
     , [ @target_group_name = ] 'target_group_name'
     [ , [ @initial_retry_interval_seconds = ] initial_retry_interval_seconds ]   
     [ , [ @maximum_retry_interval_seconds = ] maximum_retry_interval_seconds ]   
     [ , [ @retry_interval_backoff_multiplier = ] retry_interval_backoff_multiplier ]   
     [ , [ @retry_attempts = ] retry_attempts ]   
     [ , [ @step_timeout_seconds = ] step_timeout_seconds ]   
     [ , [ @output_type = ] 'output_type' ]   
     [ , [ @output_credential_name = ] 'output_credential_name' ]   
     [ , [ @output_subscription_id = ] 'output_subscription_id' ]   
     [ , [ @output_resource_group_name = ] 'output_resource_group_name' ]   
     [ , [ @output_server_name = ] 'output_server_name' ]   
     [ , [ @output_database_name = ] 'output_database_name' ]   
     [ , [ @output_schema_name = ] 'output_schema_name' ]   
     [ , [ @output_table_name = ] 'output_table_name' ]
     [ , [ @job_version = ] job_version OUTPUT ]
     [ , [ @max_parallelism = ] max_parallelism ]
```

#### Arguments

[ **\@job_name =** ] 'job_name'  
The name of the job to which to add the step. job_name is nvarchar(128).

[ **\@step_id =** ] step_id  
The sequence identification number for the job step. Step identification numbers start at 1 and increment without gaps. If an existing step already has this id, then that step and all following steps will have their id's incremented so that this new step can be inserted into the sequence. If not specified, the step_id will be automatically assigned to the last in the sequence of steps. step_id is an int.

[ **\@step_name =** ] step_name  
The name of the step. Must be specified, except for the first step of a job which (for convenience) has a default name of 'JobStep'. step_name is nvarchar(128).

[ **\@command_type =** ] 'command_type'  
The type of command that is executed by this jobstep. command_type is nvarchar(50), with a default value of TSql, meaning that the value of the @command_type parameter is a T-SQL script.

If specified, the value must be TSql.

[ **\@command_source =** ] 'command_source'  
The type of location where the command is stored. command_source is nvarchar(50), with a default value of Inline, meaning that the value of the @command_source parameter is the literal text of the command.

If specified, the value must be Inline.

[ **\@command =** ] 'command'  
The command must be valid T-SQL script and is then executed by this job step. command is nvarchar(max), with a default of NULL.

[ **\@credential_name =** ] 'credential_name'  
The name of the database scoped credential stored in this job control database that is used to connect to each of the target databases within the target group when this step is executed. credential_name is nvarchar(128).

[ **\@target_group_name =** ] 'target-group_name'  
The name of the target group that contains the target databases that the job step will be executed on. target_group_name is nvarchar(128).

[ **\@initial_retry_interval_seconds =** ] initial_retry_interval_seconds  
The delay before the first retry attempt, if the job step fails on the initial execution attempt. initial_retry_interval_seconds is int, with default value of 1.

[ **\@maximum_retry_interval_seconds =** ] maximum_retry_interval_seconds  
The maximum delay between retry attempts. If the delay between retries would grow larger than this value, it is capped to this value instead. maximum_retry_interval_seconds is int, with default value of 120.

[ **\@retry_interval_backoff_multiplier =** ] retry_interval_backoff_multiplier  
The multiplier to apply to the retry delay if multiple job step execution attempts fail. For example, if the first retry had a delay of 5 second and the backoff multiplier is 2.0, then the second retry will have a delay of 10 seconds and the third retry will have a delay of 20 seconds. retry_interval_backoff_multiplier is real, with default value of 2.0.

[ **\@retry_attempts =** ] retry_attempts  
The number of times to retry execution if the initial attempt fails. For example, if the retry_attempts value is 10, then there will be 1 initial attempt and 10 retry attempts, giving a total of 11 attempts. If the final retry attempt fails, then the job execution will terminate with a lifecycle of Failed. retry_attempts is int, with default value of 10.

[ **\@step_timeout_seconds =** ] step_timeout_seconds  
The maximum amount of time allowed for the step to execute. If this time is exceeded, then the job execution will terminate with a lifecycle of TimedOut. step_timeout_seconds is int, with default value of 43,200 seconds (12 hours).

[ **\@output_type =** ] 'output_type'  
If not null, the type of destination that the command’s first result set is written to. output_type is nvarchar(50), with a default of NULL.

If specified, the value must be SqlDatabase.

[ **\@output_credential_name =** ] 'output_credential_name'  
If not null, the name of the database scoped credential that is used to connect to the output destination database. Must be specified if output_type equals SqlDatabase. output_credential_name is nvarchar(128), with a default value of NULL.

[ **\@output_subscription_id =** ] 'output_subscription_id'  
Needs description.

[ **\@output_resource_group_name =** ] 'output_resource_group_name'  
Needs description.

[ **\@output_server_name =** ] 'output_server_name'  
If not null, the fully qualified DNS name of the server that contains the output destination database. Must be specified if output_type equals SqlDatabase. output_server_name is nvarchar(256), with a default of NULL.

[ **\@output_database_name =** ] 'output_database_name'  
If not null, the name of the database that contains the output destination table. Must be specified if output_type equals SqlDatabase. output_database_name is nvarchar(128), with a default of NULL.

[ **\@output_schema_name =** ] 'output_schema_name'  
If not null, the name of the SQL schema that contains the output destination table. If output_type equals SqlDatabase, the default value is dbo. output_schema_name is nvarchar(128).

[ **\@output_table_name =** ] 'output_table_name'  
If not null, the name of the table that the command’s first result set will be written to. If the table doesn't already exist, it will be created based on the schema of the returning result-set. Must be specified if output_type equals SqlDatabase. output_table_name is nvarchar(128), with a default value of NULL.

[ **\@job_version =** ] job_version OUTPUT  
Output parameter that will be assigned the new job version number. job_version is int.

[ **\@max_parallelism =** ] max_parallelism OUTPUT  
The maximum level of parallelism per elastic pool. If set, then the job step will be restricted to only run on a maximum of that many databases per elastic pool. This applies to each elastic pool that is either directly included in the target group or is inside a server that is included in the target group. max_parallelism is int.


#### Return Code Values
0 (success) or 1 (failure)

#### Remarks
When sp_add_jobstep succeeds, the job’s current version number is incremented. The next time the job is executed, the new version will be used. If the job is currently executing, that execution will not contain the new step.

#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:  

- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.



### <a name="sp_update_jobstep"></a>sp_update_jobstep

Updates a job step.

#### Syntax

```sql
[jobs].sp_update_jobstep [ @job_name = ] 'job_name'   
     [ , [ @step_id = ] step_id ]   
     [ , [ @step_name = ] 'step_name' ]   
     [ , [ @new_id = ] new_id ]   
     [ , [ @new_name = ] 'new_name' ]   
     [ , [ @command_type = ] 'command_type' ]   
     [ , [ @command_source = ] 'command_source' ]  
     , [ @command = ] 'command'
     , [ @credential_name = ] 'credential_name'
     , [ @target_group_name = ] 'target_group_name'
     [ , [ @initial_retry_interval_seconds = ] initial_retry_interval_seconds ]   
     [ , [ @maximum_retry_interval_seconds = ] maximum_retry_interval_seconds ]   
     [ , [ @retry_interval_backoff_multiplier = ] retry_interval_backoff_multiplier ]   
     [ , [ @retry_attempts = ] retry_attempts ]   
     [ , [ @step_timeout_seconds = ] step_timeout_seconds ]   
     [ , [ @output_type = ] 'output_type' ]   
     [ , [ @output_credential_name = ] 'output_credential_name' ]   
     [ , [ @output_server_name = ] 'output_server_name' ]   
     [ , [ @output_database_name = ] 'output_database_name' ]   
     [ , [ @output_schema_name = ] 'output_schema_name' ]   
     [ , [ @output_table_name = ] 'output_table_name' ]   
     [ , [ @job_version = ] job_version OUTPUT ]
     [ , [ @max_parallelism = ] max_parallelism ]
```

#### Arguments
[ **\@job_name =** ] 'job_name'  
The name of the job to which the step belongs. job_name is nvarchar(128).

[ **\@step_id =** ] step_id  
The identification number for the job step to be modified. Either step_id or step_name must be specified. step_id is an int.

[ **\@step_name =** ] 'step_name'  
The name of the step to be modified. Either step_id or step_name must be specified. step_name is nvarchar(128).

[ **\@new_id =** ] new_id  
The new sequence identification number for the job step. Step identification numbers start at 1 and increment without gaps. If a step is reordered, then other steps will be automatically renumbered.

[ **\@new_name =** ] 'new_name'  
The new name of the step. new_name is nvarchar(128).

[ **\@command_type =** ] 'command_type'  
The type of command that is executed by this jobstep. command_type is nvarchar(50), with a default value of TSql, meaning that the value of the @command_type parameter is a T-SQL script.

If specified, the value must be TSql.

[ **\@command_source =** ] 'command_source'  
The type of location where the command is stored. command_source is nvarchar(50), with a default value of Inline, meaning that the value of the @command_source parameter is the literal text of the command.

If specified, the value must be Inline.

[ **\@command =** ] 'command'  
The command(s) must be valid T-SQL script and is then executed by this job step. command is nvarchar(max), with a default of NULL.

[ **\@credential_name =** ] 'credential_name'  
The name of the database scoped credential stored in this job control database that is used to connect to each of the target databases within the target group when this step is executed. credential_name is nvarchar(128).

[ **\@target_group_name =** ] 'target-group_name'  
The name of the target group that contains the target databases that the job step will be executed on. target_group_name is nvarchar(128).

[ **\@initial_retry_interval_seconds =** ] initial_retry_interval_seconds  
The delay before the first retry attempt, if the job step fails on the initial execution attempt. initial_retry_interval_seconds is int, with default value of 1.

[ **\@maximum_retry_interval_seconds =** ] maximum_retry_interval_seconds  
The maximum delay between retry attempts. If the delay between retries would grow larger than this value, it is capped to this value instead. maximum_retry_interval_seconds is int, with default value of 120.

[ **\@retry_interval_backoff_multiplier =** ] retry_interval_backoff_multiplier  
The multiplier to apply to the retry delay if multiple job step execution attempts fail. For example, if the first retry had a delay of 5 second and the backoff multiplier is 2.0, then the second retry will have a delay of 10 seconds and the third retry will have a delay of 20 seconds. retry_interval_backoff_multiplier is real, with default value of 2.0.

[ **\@retry_attempts =** ] retry_attempts  
The number of times to retry execution if the initial attempt fails. For example, if the retry_attempts value is 10, then there will be 1 initial attempt and 10 retry attempts, giving a total of 11 attempts. If the final retry attempt fails, then the job execution will terminate with a lifecycle of Failed. retry_attempts is int, with default value of 10.

[ **\@step_timeout_seconds =** ] step_timeout_seconds  
The maximum amount of time allowed for the step to execute. If this time is exceeded, then the job execution will terminate with a lifecycle of TimedOut. step_timeout_seconds is int, with default value of 43,200 seconds (12 hours).

[ **\@output_type =** ] 'output_type'  
If not null, the type of destination that the command’s first result set is written to. To reset the value of output_type back to NULL, set this parameter's value to '' (empty string). output_type is nvarchar(50), with a default of NULL.

If specified, the value must be SqlDatabase.

[ **\@output_credential_name =** ] 'output_credential_name'  
If not null, the name of the database scoped credential that is used to connect to the output destination database. Must be specified if output_type equals SqlDatabase. To reset the value of output_credential_name back to NULL, set this parameter's value to '' (empty string). output_credential_name is nvarchar(128), with a default value of NULL.

[ **\@output_server_name =** ] 'output_server_name'  
If not null, the fully qualified DNS name of the server that contains the output destination database. Must be specified if output_type equals SqlDatabase. To reset the value of output_server_name back to NULL, set this parameter's value to '' (empty string). output_server_name is nvarchar(256), with a default of NULL.

[ **\@output_database_name =** ] 'output_database_name'  
If not null, the name of the database that contains the output destination table. Must be specified if output_type equals SqlDatabase. To reset the value of output_database_name back to NULL, set this parameter's value to '' (empty string). output_database_name is nvarchar(128), with a default of NULL.

[ **\@output_schema_name =** ] 'output_schema_name'  
If not null, the name of the SQL schema that contains the output destination table. If output_type equals SqlDatabase, the default value is dbo. To reset the value of output_schema_name back to NULL, set this parameter's value to '' (empty string). output_schema_name is nvarchar(128).

[ **\@output_table_name =** ] 'output_table_name'  
If not null, the name of the table that the command’s first result set will be written to. If the table doesn't already exist, it will be created based on the schema of the returning result-set. Must be specified if output_type equals SqlDatabase. To reset the value of output_server_name back to NULL, set this parameter's value to '' (empty string). output_table_name is nvarchar(128), with a default value of NULL.

[ **\@job_version =** ] job_version OUTPUT  
Output parameter that will be assigned the new job version number. job_version is int.

[ **\@max_parallelism =** ] max_parallelism OUTPUT  
The maximum level of parallelism per elastic pool. If set, then the job step will be restricted to only run on a maximum of that many databases per elastic pool. This applies to each elastic pool that is either directly included in the target group or is inside a server that is included in the target group. To reset the value of max_parallelism back to null, set this parameter's value to -1. max_parallelism is int.


#### Return Code Values
0 (success) or 1 (failure)

#### Remarks
Any in-progress executions of the job will not be affected. When sp_update_jobstep succeeds, the job’s version number is incremented. The next time the job is executed, the new version will be used.

#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:

- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users




### <a name="sp_delete_jobstep"></a>sp_delete_jobstep

Removes a job step from a job.

#### Syntax


```sql
[jobs].sp_delete_jobstep [ @job_name = ] 'job_name'   
     [ , [ @step_id = ] step_id ]
     [ , [ @step_name = ] 'step_name' ]   
     [ , [ @job_version = ] job_version OUTPUT ]
```

#### Arguments
[ **\@job_name =** ] 'job_name'  
The name of the job from which the step will be removed. job_name is nvarchar(128), with no default.

[ **\@step_id =** ] step_id  
The identification number for the job step to be deleted. Either step_id or step_name must be specified. step_id is an int.

[ **\@step_name =** ] 'step_name'  
The name of the step to be deleted. Either step_id or step_name must be specified. step_name is nvarchar(128).

[ **\@job_version =** ] job_version OUTPUT  
Output parameter that will be assigned the new job version number. job_version is int.

#### Return Code Values
0 (success) or 1 (failure)

#### Remarks
Any in-progress executions of the job will not be affected. When sp_update_jobstep succeeds, the job’s version number is incremented. The next time the job is executed, the new version will be used.

The other job steps will be automatically renumbered to fill the gap left by the deleted job step.
 
#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:
- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.






### <a name="sp_start_job"></a>sp_start_job

Starts executing a job.

#### Syntax


```sql
[jobs].sp_start_job [ @job_name = ] 'job_name'   
     [ , [ @job_execution_id = ] job_execution_id OUTPUT ]   
```

#### Arguments
[ **\@job_name =** ] 'job_name'  
The name of the job from which the step will be removed. job_name is nvarchar(128), with no default.

[ **\@job_execution_id =** ] job_execution_id OUTPUT  
Output parameter that will be assigned the job execution's id. job_version is uniqueidentifier.

#### Return Code Values
0 (success) or 1 (failure)

#### Remarks
None.
 
#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:
- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.

### <a name="sp_stop_job"></a>sp_stop_job

Stops a job execution.

#### Syntax


```sql
[jobs].sp_stop_job [ @job_execution_id = ] ' job_execution_id '
```


#### Arguments
[ **\@job_execution_id =** ] job_execution_id  
The identification number of the job execution to stop. job_execution_id is uniqueidentifier, with default of NULL.

#### Return Code Values
0 (success) or 1 (failure)

#### Remarks
None.
 
#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:
- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.


### <a name="sp_add_target_group"></a>sp_add_target_group

Adds a target group.

#### Syntax


```sql
[jobs].sp_add_target_group [ @target_group_name = ] 'target_group_name'   
     [ , [ @target_group_id = ] target_group_id OUTPUT ]
```


#### Arguments
[ **\@target_group_name =** ] 'target_group_name'  
The name of the target group to create. target_group_name is nvarchar(128), with no default.

[ **\@target_group_id =** ] target_group_id OUTPUT
 The target group identification number assigned to the job if created successfully. target_group_id is an output variable of type uniqueidentifier, with a default of NULL.

#### Return Code Values
0 (success) or 1 (failure)

#### Remarks
Target groups provide an easy way to target a job at a collection of databases.

#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:
- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.

### <a name="sp_delete_target_group"></a>sp_delete_target_group

Deletes a target group.

#### Syntax


```sql
[jobs].sp_delete_target_group [ @target_group_name = ] 'target_group_name'
```


#### Arguments
[ **\@target_group_name =** ] 'target_group_name'  
The name of the target group to delete. target_group_name is nvarchar(128), with no default.

#### Return Code Values
0 (success) or 1 (failure)

#### Remarks
None.

#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:
- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.

### <a name="sp_add_target_group_member"></a>sp_add_target_group_member

Adds a database or group of databases to a target group.

#### Syntax

```sql
[jobs].sp_add_target_group_member [ @target_group_name = ] 'target_group_name'
         [ @membership_type = ] 'membership_type' ]   
        [ , [ @target_type = ] 'target_type' ]   
        [ , [ @refresh_credential_name = ] 'refresh_credential_name' ]   
        [ , [ @server_name = ] 'server_name' ]   
        [ , [ @database_name = ] 'database_name' ]   
        [ , [ @elastic_pool_name = ] 'elastic_pool_name' ]   
        [ , [ @shard_map_name = ] 'shard_map_name' ]   
        [ , [ @target_id = ] 'target_id' OUTPUT ]
```

#### Arguments
[ **\@target_group_name =** ] 'target_group_name'  
The name of the target group to which the member will be added. target_group_name is nvarchar(128), with no default.

[ **\@membership_type =** ] 'membership_type'  
Specifies if the target group member will be included or excluded. target_group_name is nvarchar(128), with default of ‘Include’. Valid values for target_group_name are ‘Include’ or ‘Exclude’.

[ **\@target_type =** ] 'target_type'  
The type of target database or collection of databases including all databases in a server, all databases in an Elastic pool, all databases in a shard map, or an individual database. target_type is nvarchar(128), with no default. Valid values for target_type are ‘SqlServer’, ‘SqlElasticPool’, ‘SqlDatabase’, or ‘SqlShardMap’. 

[ **\@refresh_credential_name =** ] 'refresh_credential_name'  
The name of the SQL Database server. refresh_credential_name is nvarchar(128), with no default.

[ **\@server_name =** ] 'server_name'  
The name of the SQL Database server that should be added to the specified target group. server_name should be specified when target_type is ‘SqlServer’. server_name is nvarchar(128), with no default.

[ **\@database_name =** ] 'database_name'  
The name of the database that should be added to the specified target group. database_name should be specified when target_type is ‘SqlDatabase’. database_name is nvarchar(128), with no default.

[ **\@elastic_pool_name =** ] 'elastic_pool_name'  
The name of the Elastic pool that should be added to the specified target group. elastic_pool_name should be specified when target_type is ‘SqlElasticPool’. elastic_pool_name is nvarchar(128), with no default.

[ **\@shard_map_name =** ] 'shard_map_name'  
The name of the shard map pool that should be added to the specified target group. elastic_pool_name should be specified when target_type is ‘SqlSqlShardMap’. shard_map_name is nvarchar(128), with no default.

[ **\@target_id =** ] target_group_id OUTPUT  
The target identification number assigned to the target group member if created added to the target group. target_id is an output variable of type uniqueidentifier, with a default of NULL.
Return Code Values
0 (success) or 1 (failure)

#### Remarks
A job executes on all single databases within a SQL Database server or in an elastic pool at time of execution, when a SQL Database server or Elastic pool is included in the target group.

#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:
- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.

#### Examples
The following example adds all the databases in the London and NewYork servers to the group Servers Maintaining Customer Information. You must connect to the jobs database specified when creating the job agent, in this case ElasticJobs.

```sql
--Connect to the jobs database specified when creating the job agent
USE ElasticJobs ; 
GO

-- Add a target group containing server(s)
EXEC jobs.sp_add_target_group @target_group_name =  N'Servers Maintaining Customer Information'
GO

-- Add a server target member
EXEC jobs.sp_add_target_group_member
@target_group_name = N'Servers Maintaining Customer Information',
@target_type = N'SqlServer',
@refresh_credential_name=N'mymastercred', --credential required to refresh the databases in server
@server_name=N'London.database.windows.net' ;
GO

-- Add a server target member
EXEC jobs.sp_add_target_group_member
@target_group_name = N'Servers Maintaining Customer Information',
@target_type = N'SqlServer',
@refresh_credential_name=N'mymastercred', --credential required to refresh the databases in server
@server_name=N'NewYork.database.windows.net' ;
GO

--View the recently added members to the target group
SELECT * FROM [jobs].target_group_members WHERE target_group_name= N'Servers Maintaining Customer Information';
GO
```

### <a name="sp_delete_target_group_member"></a>sp_delete_target_group_member

Removes a target group member from a target group.

#### Syntax


```sql
[jobs].sp_delete_target_group_member [ @target_group_name = ] 'target_group_name'
     	[ , [ @target_id = ] 'target_id']
```



Arguments
[ @target_group_name = ] 'target_group_name'  
The name of the target group from which to remove the target group member. target_group_name is nvarchar(128), with no default.

[ @target_id = ] target_id  
 The target identification number assigned to the target group member to be removed. target_id is a uniqueidentifier, with a default of NULL.

#### Return Code Values
0 (success) or 1 (failure)

#### Remarks
Target groups provide an easy way to target a job at a collection of databases.

#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:
- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.

#### Examples
The following example removes the London server from the group Servers Maintaining Customer Information. You must connect to the jobs database specified when creating the job agent, in this case ElasticJobs.

```sql
--Connect to the jobs database specified when creating the job agent
USE ElasticJobs ; 
GO

-- Retrieve the target_id for a target_group_members
declare @tid uniqueidentifier
SELECT @tid = target_id FROM [jobs].target_group_members WHERE target_group_name = 'Servers Maintaining Customer Information' and server_name = 'London.database.windows.net'

-- Remove a target group member of type server
EXEC jobs.sp_delete_target_group_member
@target_group_name = N'Servers Maintaining Customer Information',
@target_id = @tid
GO
```

### <a name="sp_purge_jobhistory"></a>sp_purge_jobhistory

Removes the history records for a job.

#### Syntax


```sql
[jobs].sp_purge_jobhistory [ @job_name = ] 'job_name'   
      [ , [ @job_id = ] job_id ]
      [ , [ @oldest_date = ] oldest_date []
```

#### Arguments
[ **\@job_name =** ] 'job_name'  
The name of the job for which to delete the history records. job_name is nvarchar(128), with a default of NULL. Either job_id or job_name must be specified, but both cannot be specified.

[ **\@job_id =** ] job_id  
 The job identification number of the job for the records to be deleted. job_id is uniqueidentifier, with a default of NULL. Either job_id or job_name must be specified, but both cannot be specified.

[ **\@oldest_date =** ] oldest_date  
 The oldest record to retain in the history. oldest_date is DATETIME2, with a default of NULL. When oldest_date is specified, sp_purge_jobhistory only removes records that are older than the value specified.

#### Return Code Values
0 (success) or 1 (failure)
Remarks
Target groups provide an easy way to target a job at a collection of databases.

#### Permissions
By default, members of the sysadmin fixed server role can execute this stored procedure. They restrict a user to just be able to monitor jobs, you can grant the user to be part of the following database role in the job agent database specified when creating the job agent:
- jobs_reader

For details about the permissions of these roles, see the Permission section in this document. Only members of sysadmin can use this stored procedure to edit the attributes of jobs that are owned by other users.

#### Examples
The following example adds all the databases in the London and NewYork servers to the group Servers Maintaining Customer Information. You must connect to the  jobs database specified when creating the job agent, in this case ElasticJobs.

```sql
--Connect to the jobs database specified when creating the job agent

EXEC sp_delete_target_group_member   
    @target_group_name = N'Servers Maintaining Customer Information',  
    @server_name = N'London.database.windows.net';  
GO
```


## Job views

The following views are available in the [jobs database](sql-database-job-automation-overview.md#job-database).


|View  |Description  |
|---------|---------|
|[jobs_executions](#jobs_executions-view)     |  Shows job execution history.      |
|[jobs](#jobs-view)     |   Shows all jobs.      |
|[job_versions](#job_versions-view)     |   Shows all job versions.      |
|[jobsteps](#jobsteps-view)     |     Shows all steps in the current version of each job.    |
|[jobstep_versions](#jobstep_versions-view)     |     Shows all steps in all versions of each job.    |
|[target_groups](#target_groups-view)     |      Shows all target groups.   |
|[target_group_members](#target_groups_members-view)     |   Shows all members of all target groups.      |


### <a name="jobs_executions-view"></a>jobs_executions view

[jobs].[jobs_executions]

Shows job execution history.


|Column name|	Data type	|Description|
|---------|---------|---------|
|**job_execution_id**	|uniqueidentifier|	Unique ID of an instance of a job execution.
|**job_name**	|nvarchar(128)	|Name of the job.
|**job_id**	|uniqueidentifier|	Unique ID of the job.
|**job_version**	|int	|Version of the job (automatically updated each time the job is modified).
|**step_id**	|int|	Unique (for this job) identifier for the step. NULL indicates this is the parent job execution.
|**is_active**|	bit	|Indicates whether information is active or inactive. 1 indicates active jobs, and 0 indicates inactive.
|**lifecycle**|	nvarchar(50)|Value indicating the status of the job:‘Created’, ‘In Progress’, ‘Failed’, ‘Succeeded’, ‘Skipped’, ‘SucceededWithSkipped’|
|**create_time**|	datetime2(7)|	Date and time the job was created.
|**start_time**	|datetime2(7)|	Date and time the job started execution. NULL if the job has not yet been executed.
|**end_time**|	datetime2(7)	|Date and time the job finished execution. NULL if the job has not yet been executed or has not yet completed execution.
|**current_attempts**	|int	|Number of times the step was retried. Parent job will be 0, child job executions will be 1 or greater based on the execution policy.
|**current_attempt_start_time**	|datetime2(7)|	Date and time the job started execution. NULL indicates this is the parent job execution.
|**last_message**	|nvarchar(max)|	Job or step history message. 
|**target_type**|	nvarchar(128)	|Type of target database or collection of databases including all databases in a server, all databases in an Elastic pool or a database. Valid values for target_type are ‘SqlServer’, ‘SqlElasticPool’ or ‘SqlDatabase’. NULL indicates this is the parent job execution.
|**target_id**	|uniqueidentifier|	Unique ID of the target group member.  NULL indicates this is the parent job execution.
|**target_group_name**	|nvarchar(128)	|Name of the target group. NULL indicates this is the parent job execution.
|**target_server_name**|	nvarchar(256)|	Name of the SQL Database server contained in the target group. Specified only if target_type is ‘SqlServer’. NULL indicates this is the parent job execution.
|**target_database_name**	|nvarchar(128)|	Name of the database contained in the target group. Specified only when target_type is ‘SqlDatabase’. NULL indicates this is the parent job execution.


### jobs view

[jobs].[jobs]

Shows all jobs.

|Column name|	Data type|	Description|
|------|------|-------|
|**job_name**|	nvarchar(128)	|Name of the job.|
|**job_id**|	uniqueidentifier	|Unique ID of the job.|
|**job_version**	|int	|Version of the job (automatically updated each time the job is modified).|
|**description**	|nvarchar(512)|	Description for the job. enabled bit	Indicates whether the job is enabled or disabled. 1 indicates enabled jobs, and 0 indicates disabled jobs.|
|**schedule_interval_type**	|nvarchar(50)	|Value indicating when the job is to be executed:'Once', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months'
|**schedule_interval_count**|	int|	Number of schedule_interval_type periods to occur between each execution of the job.|
|**schedule_start_time**	|datetime2(7)|	Date and time the job was last started execution.|
|**schedule_end_time**|	datetime2(7)|	Date and time the job was last completed execution.|


### <a name="job_versions-view"></a>job_versions view

[jobs].[job_versions]

Shows all job versions.

|Column name|	Data type|	Description|
|------|------|-------|
|**job_name**|	nvarchar(128)	|Name of the job.|
|**job_id**|	uniqueidentifier	|Unique ID of the job.|
|**job_version**	|int	|Version of the job (automatically updated each time the job is modified).|


### jobsteps view

[jobs].[jobsteps]

Shows all steps in the current version of each job.

|Column name	|Data type|	Description|
|------|------|-------|
|**job_name**	|nvarchar(128)|	Name of the job.|
|**job_id**	|uniqueidentifier	|Unique ID of the job.|
|**job_version**|	int|	Version of the job (automatically updated each time the job is modified).|
|**step_id**	|int	|Unique (for this job) identifier for the step.|
|**step_name**	|nvarchar(128)	|Unique (for this job) name for the step.|
|**command_type**	|nvarchar(50)	|Type of command to execute in the job step. For v1, value must equal to and defaults to ‘TSql’.|
|**command_source**	|nvarchar(50)|	Location of the command. For v1, ‘Inline’ is the default and only accepted value.|
|**command**|	nvarchar(max)|	The commands to be executed by Elastic jobs through command_type.|
|**credential_name**|	nvarchar(128)	|Name of the database scoped credential used to execution the job.|
|**target_group_name**|	nvarchar(128)	|Name of the target group.|
|**target_group_id**|	uniqueidentifier|	Unique ID of the target group.|
|**initial_retry_interval_seconds**|	int	|The delay before the first retry attempt. Default value is 1.|
|**maximum_retry_interval_seconds**	|int|	The maximum delay between retry attempts. If the delay between retries would grow larger than this value, it is capped to this value instead. Default value is 120.|
|**retry_interval_backoff_multiplier**	|real|	The multiplier to apply to the retry delay if multiple job step execution attempts fail. Default value is 2.0.|
|**retry_attempts**	|int|	The number of retry attempts to use if this step fails. Default of 10, which indicates no retry attempts.|
|**step_timeout_seconds**	|int|	The amount of time in minutes between retry attempts. The default is 0, which indicates a 0-minute interval.|
|**output_type**	|nvarchar(11)|	Location of the command. In the current preview, 'Inline' is the default and only accepted value.|
|**output_credential_name**|	nvarchar(128)	|Name of the credentials to be used to connect to the destination server to store the results set.|
|**output_subscription_id**|	uniqueidentifier|	Unique ID of the subscription of the destination server\database for the results set from the query execution.|
|**output_resource_group_name**	|nvarchar(128)|	Resource group name where the destination server resides.|
|**output_server_name**|	nvarchar(256)	|Name of the destination server for the results set.|
|**output_database_name**	|nvarchar(128)|	Name of the destination database for the results set.|
|**output_schema_name**	|nvarchar(max)|	Name of the destination schema. Defaults to dbo, if not specified.|
|**output_table_name**|	nvarchar(max)|	Name of the table to store the results set from the query results. Table will be created automatically based on the schema of the results set if it doesn’t already exist. Schema must match the schema of the results set.|
|**max_parallelism**|	int|	The maximum number of databases per elastic pool that the job step will be run on at a time. The default is NULL, meaning no limit. |


### <a name="jobstep_versions-view"></a>jobstep_versions view

[jobs].[jobstep_versions]

Shows all steps in all versions of each job. The schema is identical to [jobsteps](#jobsteps-view).

### <a name="target_groups-view"></a>target_groups view

[jobs].[target_groups]

Lists all target groups.

|Column name|Data type|	Description|
|-----|-----|-----|
|**target_group_name**|	nvarchar(128)	|The name of the target group, a collection of databases. 
|**target_group_id**	|uniqueidentifier	|Unique ID of the target group.

### <a name="target_groups_members-view"></a>target_groups_members view

[jobs].[target_groups_members]

Shows all members of all target groups.

|Column name|Data type|	Description|
|-----|-----|-----|
|**target_group_name**	|nvarchar(128|The name of the target group, a collection of databases. |
|**target_group_id**	|uniqueidentifier	|Unique ID of the target group.|
|**membership_type**	|int|	Specifies if the target group member is included or excluded in the target group. Valid values for target_group_name are ‘Include’ or ‘Exclude’.|
|**target_type**	|nvarchar(128)|	Type of target database or collection of databases including all databases in a server, all databases in an Elastic pool or a database. Valid values for target_type are ‘SqlServer’, ‘SqlElasticPool’, ‘SqlDatabase’, or ‘SqlShardMap’.|
|**target_id**	|uniqueidentifier|	Unique ID of the target group member.|
|**refresh_credential_name**	|nvarchar(128)	|Name of the database scoped credential used to connect to the target group member.|
|**subscription_id**	|uniqueidentifier|	Unique ID of the subscription.|
|**resource_group_name**	|nvarchar(128)|	Name of the resource group in which the target group member resides.|
|**server_name**	|nvarchar(128)	|Name of the SQL Database server contained in the target group. Specified only if target_type is ‘SqlServer’. |
|**database_name**	|nvarchar(128)	|Name of the database contained in the target group. Specified only when target_type is ‘SqlDatabase’.|
|**elastic_pool_name**	|nvarchar(128)|	Name of the Elastic pool contained in the target group. Specified only when target_type is ‘SqlElasticPool’.|
|**shard_map_name**	|nvarchar(128)|	Name of the shard map contained in the target group. Specified only when target_type is ‘SqlShardMap’.|


## Resources

 - ![Topic link icon](https://docs.microsoft.com/sql/database-engine/configure-windows/media/topic-link.gif "Topic link icon") [Transact-SQL Syntax Conventions](https://docs.microsoft.com/sql/t-sql/language-elements/transact-sql-syntax-conventions-transact-sql)  


## Next steps

- [Create and manage Elastic Jobs using PowerShell](elastic-jobs-powershell.md)
- [Authorization and Permissions SQL Server](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/authorization-and-permissions-in-sql-server)
