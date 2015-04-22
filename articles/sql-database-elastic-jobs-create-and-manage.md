<properties 
	pageTitle="Creating and managing elastic database jobs" 
	description="Walk through creation and management of an elastic database job." 
	services="sql-database" 
	documentationCenter="" 
	manager="jhubbard" 
	authors="sidneyh" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="sidneyh"/>

# Creating and managing elastic database jobs

**Elastic database pools** provide a predictable model for deploying large numbers of databases. You can set minimum the Data Throughput Units (DTUs) for each database at a set cost. Managing common objects in these databases can most easily accomplished using **elastic database jobs**. The service allows you to run T-SQL scripts against all of the databases in the pool in a single operation. For example, you can set the policy on each database to allow only a person with the right credentials to view sensitive data. Here's how to use elastic database jobs:

**Estimated time to complete:** 10 minutes.

## Prerequistes

* An Azure subscription. For a free trial, see [Free one-month trial](http://azure.microsoft.com/pricing/free-trial/).
* An elastic database pool. See [About Elastic database pools](sql-database-elastic-pool.md)
* Installation of elastic database job service components. See [Installing the elastic database job service](vsql-database-elastic-jobs-service-installation.md).

## Creating jobs

1. In the elastic database job pool view, click **Create job**.
2. In the Create Job view, type a name for the job.
3. Paste or type in the T-SQL script.
4. Click **Save** and then click **Run**.

	![Name the job, type or paste in code, and click Run][1]
## Checking running jobs

After a job has begun, you can check on its progress. Click on the name (a) of the running job. The job's page appears (b). The list (c) below the description shows the progress of the script against databases in the pool.

![Checking a running job][2]

To check on an job that has finished runnning, from the elastic database job pool, click **Manage jobs**. Then click on the name of any job to view its details. 

![Check other jobs from elastic database pool][3]

## Checking failed jobs

If a job fails, a log of its execution can found. Click the name of the failed job to see its details.

![Check a failed job][4]

## Next steps

To understand the job creation, see "Creating an elastic database job"

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-create-and-manage/screen-1.png
[2]: ./media/sql-database-elastic-jobs-create-and-manage/running-jobs.png
[3]: ./media/sql-database-elastic-jobs-create-and-manage/click-manage-jobs.png
[4]: ./media/sql-database-elastic-jobs-create-and-manage/failed.png


