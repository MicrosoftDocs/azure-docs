---
title: Managing scaled-out cloud databases | Microsoft Docs
description: Use the elastic database job service to execute a script across a group of databases.
services: sql-database
ms.service: sql-database
subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: 
manager: craigg
ms.date: 06/14/2018
---
# Managing scaled-out cloud databases

[!INCLUDE [elastic-database-jobs-deprecation](../../includes/sql-database-elastic-jobs-deprecate.md)]

**Elastic Database jobs** is a customer-hosted Azure Cloud Service that enables the execution of ad-hoc and scheduled administrative tasks, which are called **jobs**. With jobs, you can easily and reliably manage large groups of Azure SQL databases by running Transact-SQL scripts to perform administrative operations. 

To manage scaled-out sharded databases, the **Elastic Database jobs** feature (preview) enables you to reliably execute a Transact-SQL (T-SQL) script across a group of databases, including:

* a custom-defined collection of databases (explained below)
* all databases in an [elastic pool](sql-database-elastic-pool.md)
* a shard set (created using [Elastic Database client library](sql-database-elastic-database-client-library.md)). 

## Documentation
* [Install the Elastic Database job components](sql-database-elastic-jobs-service-installation.md). 
* [Get started with Elastic Database jobs](sql-database-elastic-jobs-getting-started.md).
* [Create and manage jobs using PowerShell](sql-database-elastic-jobs-powershell.md).
* [Create and manage scaled out Azure SQL databases](sql-database-elastic-jobs-getting-started.md)



![Elastic database job service][1]

## Why use jobs?
**Manage**

Easily do schema changes, credentials management, reference data updates, performance data collection or tenant (customer) telemetry collection.

**Reports**

Aggregate data from a collection of Azure SQL databases into a single destination table.

**Reduce overhead**

Normally, you must connect to each database independently in order to run Transact-SQL statements or perform other administrative tasks. A job handles the task of logging in to each database in the target group. You also define, maintain and persist Transact-SQL scripts to be executed across a group of Azure SQL databases.

**Accounting**

Jobs run the script and log the status of execution for each database. You also get automatic retry when failures occur.

**Flexibility**

Define custom groups of Azure SQL databases, and define schedules for running a job.

> [!NOTE]
> In the Azure portal, only a reduced set of functions limited to SQL Azure elastic pools is available. Use the PowerShell APIs to access the full set of current functionality.
> 
> 

## Applications
* Perform administrative tasks, such as deploying a new schema.
* Update reference data-product information common across all databases. Or schedules automatic updates every weekday, after hours.
* Rebuild indexes to improve query performance. The rebuilding can be configured to execute across a collection of databases on a recurring basis, such as during off-peak hours.
* Collect query results from a set of databases into a central table on an on-going basis. Performance queries can be continually executed and configured to trigger additional tasks to be executed.
* Execute longer running data processing queries across a large set of databases, for example the collection of customer telemetry. Results are collected into a single destination table for further analysis.

## Elastic Database jobs: end-to-end
1. Install the **Elastic Database jobs** components. For more information, see [Installing Elastic Database jobs](sql-database-elastic-jobs-service-installation.md). If the installation fails, see [how to uninstall](sql-database-elastic-jobs-uninstall.md).
2. Use the PowerShell APIs to access more functionality, for example creating custom-defined database collections, adding schedules and/or gathering results sets. Use the portal for simple installation and creation/monitoring of jobs limited to execution against a **elastic pool**. 
3. Create encrypted credentials for job execution and [add the user (or role) to each database in the group](sql-database-security-overview.md).
4. Create an idempotent T-SQL script that can be run against every database in the group. 
5. Follow these steps to create jobs using the Azure portal: [Creating and managing Elastic Database jobs](sql-database-elastic-jobs-create-and-manage.md). 
6. Or use PowerShell scripts: [Create and manage a SQL Database elastic database jobs using PowerShell (preview)](sql-database-elastic-jobs-powershell.md).

## Idempotent scripts
The scripts must be [idempotent](https://en.wikipedia.org/wiki/Idempotence). In simple terms, "idempotent" means that if the script succeeds, and it is run again, the same result occurs. A script may fail due to transient network issues. In that case, the job will automatically retry running the script a preset number of times before desisting. An idempotent script has the same result even if has been successfully run twice. 

A simple tactic is to test for the existence of an object before creating it.  

    IF NOT EXIST (some_object)
    -- Create the object 
    -- If it exists, drop the object before recreating it.

Similarly, a script must be able to execute successfully by logically testing for and countering any conditions it finds.

## Failures and logs
If a script fails after multiple attempts, the job logs the error and continues. After a job ends (meaning a run against all databases in the group), you can check its list of failed attempts. The logs provide details to debug faulty scripts. 

## Group types and creation
There are two kinds of groups: 

1. Shard sets
2. Custom groups

Shard set groups are created using the [Elastic Database tools](sql-database-elastic-scale-introduction.md). When you create a shard set group, databases are added or removed from the group automatically. For example, a new shard will be automatically in the group when you add it to the shard map. A job can then be run against the group.

Custom groups, on the other hand, are rigidly defined. You must explicitly add or remove databases from custom groups. If a database in the group is dropped, the job will attempt to run the script against the database resulting in an eventual failure. Groups created using the Azure portal currently are custom groups. 

## Components and pricing
The following components work together to create an Azure Cloud service that enables ad-hoc execution of administrative jobs. The components are installed and configured automatically during setup, in your subscription. You can identify the services as they all have the same auto-generated name. The name is unique, and consists of the prefix "edj" followed by 21 randomly generated characters.

* **Azure Cloud Service**: elastic database jobs (preview) is delivered as a customer-hosted Azure Cloud service to perform execution of the requested tasks. From the portal, the service is deployed and hosted in your Microsoft Azure subscription. The default deployed service runs with the minimum of two worker roles for high availability. The default size of each worker role (ElasticDatabaseJobWorker) runs on an A0 instance. For pricing, see [Cloud services pricing](https://azure.microsoft.com/pricing/details/cloud-services/). 
* **Azure SQL Database**: The service uses an Azure SQL Database known as the **control database** to store all of the job metadata. The default service tier is a S0. For pricing, see [SQL Database Pricing](https://azure.microsoft.com/pricing/details/sql-database/).
* **Azure Service Bus**: An Azure Service Bus is for coordination of the work within the Azure Cloud Service. See [Service Bus Pricing](https://azure.microsoft.com/pricing/details/service-bus/).
* **Azure Storage**: An Azure Storage account is used to store diagnostic output logging in the event that an issue requires further debugging (see [Enabling Diagnostics in Azure Cloud Services and Virtual Machines](../cloud-services/cloud-services-dotnet-diagnostics.md)). For pricing, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/).

## How Elastic Database jobs work
1. An Azure SQL Database is designated a **control database** which stores all meta-data and state data.
2. The control database is accessed by the **job service** to launch and track jobs to execute.
3. Two different roles communicate with the control database: 
   * Controller: Determines which jobs require tasks to perform the requested job, and retries failed jobs by creating new job tasks.
   * Job Task Execution: Carries out the job tasks.

### Job task types
There are multiple types of job tasks that carry out execution of jobs:

* ShardMapRefresh: Queries the shard map to determine all the databases used as shards
* ScriptSplit: Splits the script across ‘GO’ statements into batches
* ExpandJob: Creates child jobs for each database from a job that targets a group of databases
* ScriptExecution: Executes a script against a particular database using defined credentials
* Dacpac: Applies a DACPAC to a particular database using particular credentials

## End-to-end job execution work-flow
1. Using either the Portal or the PowerShell API, a job is inserted into the  **control database**. The job requests execution of a Transact-SQL script against a group of databases using specific credentials.
2. The controller identifies the new job. Job tasks are created and executed to split the script and to refresh the group’s databases. Lastly, a new job is created and executed to expand the job and create new child jobs where each child job is specified to execute the Transact-SQL script against an individual database in the group.
3. The controller identifies the created child jobs. For each job, the controller creates and triggers a job task to execute the script against a database. 
4. After all job tasks have completed, the controller updates the jobs to a completed state. 
   At any point during job execution, the PowerShell API can be used to view the current state of job execution. All times returned by the PowerShell APIs are represented in UTC. If desired, a cancellation request can be initiated to stop a job. 

## Next steps
[Install the components](sql-database-elastic-jobs-service-installation.md), then [create and add a log in to each database in the group of databases](sql-database-manage-logins.md). To further understand job creation and management, see [creating and managing elastic database jobs](sql-database-elastic-jobs-create-and-manage.md). See also [Getting started with Elastic Database jobs](sql-database-elastic-jobs-getting-started.md).

[!INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-overview/elastic-jobs.png
<!--anchors-->


