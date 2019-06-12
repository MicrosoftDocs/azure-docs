---
title: Azure SQL Elastic Database Jobs | Microsoft Docs
description: 'Configure Elastic Database Jobs to run Transact-SQL (T-SQL) scripts across a set of one or more Azure SQL databases'
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: srinia
ms.author: srinia
ms.reviewer: sstein
manager: craigg
ms.date: 12/18/2018
---
# Create, configure, and manage elastic jobs

In this article, you will learn how to create, configure, and manage elastic jobs. If you have not used Elastic jobs, [learn more about the job automation concepts in Azure SQL Database](sql-database-job-automation-overview.md).

## Create and configure the agent

1. Create or identify an empty S0 or higher SQL database. This database will be used as the *Job database* during Elastic Job agent creation.
2. Create an Elastic Job agent in the [portal](https://portal.azure.com/#create/Microsoft.SQLElasticJobAgent), or with [PowerShell](elastic-jobs-powershell.md#create-the-elastic-job-agent).

   ![Creating Elastic Job agent](media/elastic-jobs-overview/create-elastic-job-agent.png)

## Create, run, and manage jobs

1. Create a credential for job execution in the *Job database* using [PowerShell](elastic-jobs-powershell.md#create-job-credentials-so-that-jobs-can-execute-scripts-on-its-targets), or [T-SQL](elastic-jobs-tsql.md#create-a-credential-for-job-execution).
2. Define the target group (the databases you want to run the job against) using [PowerShell](elastic-jobs-powershell.md#define-the-target-databases-you-want-to-run-the-job-against), or [T-SQL](elastic-jobs-tsql.md#create-a-target-group-servers).
3. Create a job agent credential in each database the job will run [(add the user (or role) to each database in the group)](sql-database-control-access.md). For an example, see the [PowerShell tutorial](elastic-jobs-powershell.md#create-job-credentials-so-that-jobs-can-execute-scripts-on-its-targets).
4. Create a job using [PowerShell](elastic-jobs-powershell.md#create-a-job), or [T-SQL](elastic-jobs-tsql.md#deploy-new-schema-to-many-databases).
5. Add job steps using [PowerShell](elastic-jobs-powershell.md#create-a-job-step) or [T-SQL](elastic-jobs-tsql.md#deploy-new-schema-to-many-databases).
6. Run a job using [PowerShell](elastic-jobs-powershell.md#run-the-job), or [T-SQL](elastic-jobs-tsql.md#begin-ad-hoc-execution-of-a-job).
7. Monitor job execution status using the portal, [PowerShell](elastic-jobs-powershell.md#monitor-status-of-job-executions), or [T-SQL](elastic-jobs-tsql.md#monitor-job-execution-status).

   ![Portal](media/elastic-jobs-overview/elastic-job-executions-overview.png)

## Credentials for running jobs

Jobs use [database scoped credentials](/sql/t-sql/statements/create-database-scoped-credential-transact-sql) to connect to the databases specified by the target group upon execution. If a target group contains servers or pools, these database scoped credentials are used to connect to the master database to enumerate the available databases.

Setting up the proper credentials to run a job can be a little confusing, so keep the following points in mind:

- The database scoped credentials must be created in the *Job database*.
- **All target databases must have a login with [sufficient permissions](https://docs.microsoft.com/sql/relational-databases/security/permissions-database-engine) for the job to complete successfully** (`jobuser` in the diagram below).
- Credentials can be reused across jobs, and the credential passwords are encrypted and secured from users who have read-only access to job objects.

The following image is designed to assist in understanding and setting up the proper job credentials. **Remember to create the user in every database (all *target user dbs*) the job needs to run**.

![Elastic Jobs credentials](media/elastic-jobs-overview/job-credentials.png)

## Security best practices

A few best practice considerations for working with Elastic Jobs:

- Limit usage of the APIs to trusted individuals.
- Credentials should have the least privileges necessary to perform the job step. For more information, see [Authorization and Permissions SQL Server](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/authorization-and-permissions-in-sql-server).
- When using a server and/or pool target group member, it is highly suggested to create a separate credential with rights on the master database to view/list databases that is used to expand the database lists of the server(s) and/or pool(s) prior to the job execution.

## Agent performance, capacity, and limitations

Elastic Jobs use minimal compute resources while waiting for long-running jobs to complete.

Depending on the size of the target group of databases and the desired execution time for a job (number of concurrent workers), the agent requires different amounts of compute and performance of the *Job database* (the more targets and the higher number of jobs, the higher the amount of compute required).

Currently, the preview is limited to 100 concurrent jobs.

### Prevent jobs from reducing target database performance

To ensure resources aren't overburdened when running jobs against databases in a SQL elastic pool, jobs can be configured to limit the number of databases a job can run against at the same time.

Set the number of concurrent databases a job runs on by setting the `sp_add_jobstep` stored procedure's `@max_parallelism` parameter in T-SQL, or `Add-AzSqlElasticJobStep -MaxParallelism` in PowerShell.

## Best practices for creating jobs

### Idempotent scripts
A job's T-SQL scripts must be [idempotent](https://en.wikipedia.org/wiki/Idempotence). **Idempotent** means that if the script succeeds, and it is run again, the same result occurs. A script may fail due to transient network issues. In that case, the job will automatically retry running the script a preset number of times before desisting. An idempotent script has the same result even if its been successfully run twice (or more).

A simple tactic is to test for the existence of an object before creating it.


```sql
IF NOT EXIST (some_object)
    -- Create the object
    -- If it exists, drop the object before recreating it.
```

Similarly, a script must be able to execute successfully by logically testing for and countering any conditions it finds.



## Next steps

- [Create and manage Elastic Jobs using PowerShell](elastic-jobs-powershell.md)
- [Create and manage Elastic Jobs using Transact-SQL (T-SQL)](elastic-jobs-tsql.md)
