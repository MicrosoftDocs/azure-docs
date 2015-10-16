<properties 
	title="Elastic database jobs overview" 
	pageTitle="Elastic database jobs overview" 
	description="Illustrates the elastic database job service" 
	metaKeywords="azure sql database elastic databases" 
	services="sql-database" documentationCenter=""  
	manager="jeffreyg" 
	authors="sidneyh"/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/21/2015" 
	ms.author="ddove; sidneyh" />

# Elastic Database jobs overview

TThe **Elastic Database jobs** feature (preview) enables you to  reliably execute a Transact-SQL (T-SQL) script or apply a DACPAC across a group of databases including a custom-defined collection of databases, all databases in an [Elastic Database pool (preview)](sql-database-elastic-pool.md) or a shard set (created using [Elastic Database client library](sql-database-elastic-database-client-library.md)). In preview, **Elastic Database jobs** is currently a customer-hosted Azure Cloud Service that enables the execution of ad-hoc and scheduled administrative tasks, which are called jobs. Using this feature, you can easily and reliably manage Azure SQL Database at scale across an entire group of databases by running Transact-SQL scripts to perform administrative operations such as schema changes, credentials management, reference data updates, performance data collection or tenant (customer) telemetry collection. Normally, you must connect to each database independently in order to run Transact-SQL statements or perform other administrative tasks. **Elastic Database jobs** handle the task of logging in, and reliably running the script, while logging the status of execution for each database. For instructions on installation, go to [Installing the Elastic Database job components](sql-database-elastic-jobs-service-installation.md).

![Elastic database job service][1]

## Benefits
* Define custom groups of Azure SQL Databases
* Define, maintain and persist Transact-SQL scripts to be executed across a group of Azure SQL Databases 
* Deploy a data-tier application (DACPAC)
* Execute Transact-SQL scripts or application of DACPACs reliably with automatic retry and at scale
* Track job execution state
* Define execution schedules
* Perform data collection across a collection of Azure SQL Databases saving the results into a single destination table

> [AZURE.NOTE] **Elastic Database jobs** functionality in the Azure portal surfaces a reduced feature set also limited to SQL Azure elastic pools. Use the PowerShell APIs to access the full set of current functionality.

## Scenarios

* Performance administrative task, such as deploy new schema
* Update reference data, for example product information common across all databases, even using schedules to automate the updates every weekday after hours.
* Rebuild indexes to improve query performance. The rebuilding can be configured to execute across a collection of databases on a recurring basis, such as during off-peak hours.
* Collect query results from a set of databases into a central table on an on-going basis. Performance queries can be continually executed and configured to trigger additional tasks to be executed.
* Execute longer running data processing queries across a large set of databases, for example the collection of customer telemetry. Results are collected into a single destination table for further analysis.

## Simple end-to-end review of Elastic Database jobs
1.	Install the **Elastic Database jobs** components. For more information, see [Installing Elastic Database jobs](sql-database-elastic-jobs-service-installation.md). If the installation fails, see [how to uninstall](sql-database-elastic-jobs-uninstall.md).
2.	Use the PowerShell APIs to access more functionality, for example creating custom-defined database collections, adding schedules and/or gathering results sets. Use the Portal for simple installation and creation/monitoring of jobs limited to execution against a **Elastic Database pool**. 
3.	Create encrypted credentials for job execution and [add the user (or role) to each database in the group](sql-database-elastic-jobs-add-logins-to-dbs.md).
4.	Create an idempotent T-SQL script that can be run against every database in the group.
5.	Follow these steps to run the script: [Creating and managing Elastic Database jobs](sql-database-elastic-jobs-create-and-manage.md) 

## Components and pricing 
The following components work together to create an Azure Cloud service that enables ad-hoc execution of administrative jobs. The components are installed and configured automatically during setup, in your subscription. You can identify the services as they all have the same auto-generated name. The name is unique, and consists of the prefix "edj" followed by 21 randomly generated characters.

* **Azure Cloud Service**: elastic database jobs (preview) is delivered as a customer-hosted Azure Cloud service to perform execution of the requested tasks. From the portal, the service is deployed and hosted in your Microsoft Azure subscription. The default deployed service runs with the minimum of two worker roles for high availability. The default size of each worker role (ElasticDatabaseJobWorker) runs on an A0 instance. For pricing, see [Cloud services pricing](http://azure.microsoft.com/pricing/details/cloud-services/). 
* **Azure SQL Database**: The service uses an Azure SQL Database known as the **control database** to store all of the job metadata. The default service tier is a S0. For pricing, see [SQL Database Pricing](http://azure.microsoft.com/pricing/details/sql-database/).
* **Azure Service Bus**: An Azure Service Bus is for coordination of the work within the Azure Cloud Service. See [Service Bus Pricing](http://azure.microsoft.com/pricing/details/service-bus/).
* **Azure Storage**: An Azure Storage account is used to store diagnostic output logging in the event that an issue requires further debugging (a common practice for [Azure diagnostics](../cloud-services-dotnet-diagnostics.md)). For pricing, see [Azure Storage Pricing](http://azure.microsoft.com/pricing/details/storage/).

## How Elastic Database jobs work
1.	An Azure SQL Database is designated a control database which stores all meta-data and state data.
2.	The control database is accessed by  **Elastic Database jobs** to both launch and track jobs to execute.
3.	Two different roles communicate with the control database: 
	* Controller: Determines which jobs require tasks to perform the requested job, and retries failed jobs by creating new job tasks.
	* Job Task Execution: Carries out the job tasks.

### Job task types
There are multiple types of job tasks that carry out execution of jobs:

* ShardMapRefresh: Queries the shard map to determine all the databases used as shards
* ScriptSplit: Splits the script across ‘GO’ statements into batches
* ExpandJob: Creates child jobs for each database from a job that targets a group of databases
* ScriptExecution: Executes a script against a particular database using defined credentials
* Dacpac: Applies a DACPAC to a particular database using particular credentials

## End-to-End job execution work-flow
1.	Using either the Portal or the PowerShell API, a job is inserted into the  **control database**. The job requests execution of a Transact-SQL script against a group of databases using specific credentials.
2.	The controller identifies the new job. Job tasks are created and executed to split the script and to refresh the group’s databases. Lastly, a new job is created and executed to expand the job and create new child jobs where each child job is specified to execute the Transact-SQL script against an individual database in the group.
3.	The controller identifies the created child jobs. For each job, the controller creates and triggers a job task to execute the script against a database. 
4.	After all job tasks have completed, the controller updates the jobs to a completed state. 
At any point during job execution, the PowerShell API can be used to view the current state of job execution. All times returned by the PowerShell APIs are represented in UTC. If desired, a cancellation request can be initiated to stop a job. 

## Next steps
[Install the components](sql-database-elastic-jobs-service-installation.md), then [create and add a log in to each database in the group of databases](sql-database-elastic-jobs-add-logins-to-dbs.md). To further understand job creation and management, see [creating and managing elastic database jobs](sql-database-elastic-jobs-create-and-manage.md).

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-overview/elastic-jobs.png
<!--anchors-->

 