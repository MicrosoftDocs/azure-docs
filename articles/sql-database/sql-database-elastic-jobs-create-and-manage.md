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
	ms.date="07/21/2015"
	ms.author="ddove; sidneyh"/>

# Create and manage a SQL Database elastic jobs with Portal (preview)

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-jobs-create-and-manage.md)
- [PowerShell](sql-database-elastic-jobs-powershell.md)

The **Elastic Database jobs** feature (preview) enables you to run a Transact-SQL script across a group of databases including custom-defined collection of databases, an **Elastic Database pool** or an **Elastic Database Shard set** in Azure SQL Database. In preview, **Elastic Database jobs** is currently a customer-hosted Azure Cloud Service that enables the execution of ad-hoc and scheduled administrative tasks, which are called jobs. Using this feature, you can easily and reliably manage Azure SQL Database at scale across an entire group of databases by running Transact-SQL scripts to perform administrative operations such as schema changes, credentials management, reference data updates, performance data collection or tenant (customer) telemetry collection. For more information about elastic database jobs, see [Elastic Database jobs overview](sql-database-elastic-jobs-overview.md).

**Elastic Database jobs** is currently accessible through the Azure portal.  However, the Azure portal surfaces a reduced functionality set limited to **Elastic Database pools**. The PowerShell APIs included within this preview provides the full current functionality set of Elastic Database Jobs.  For more information on the Elastic Database Jobs exposed through the Azure portal, see SQL Database Elastic Jobs Overview.

This article shows you how to create everything you need to install, create and manage **Elastic Database jobs** using PowerShell. **Elastic Database Jobs** is currently accessible through the Azure portal. However, the Azure portal surfaces a reduced functionality set limited to Elastic Database pools. The PowerShell APIs included within this preview provides the full preview feature set of **Elastic Database Jobs**. If you need an Azure subscription simply click **FREE TRIAL** in prerequisites.

**Elastic Database pools** provide a predictable model for deploying large numbers of databases. You can set minimum the Data Throughput Units (DTUs) for each database at a set cost. Managing common objects in these databases can most easily accomplished using **Elastic Database jobs**. The service allows you to run T-SQL scripts against all of the databases in the pool in a single operation. For example, you can set the policy on each database to allow only a person with the right credentials to view sensitive data.

## Prerequisites

* An Azure subscription. For a free trial, see [Free one-month trial](http://azure.microsoft.com/pricing/free-trial/).
* An elastic database pool. See [About Elastic database pools](sql-database-elastic-pool.md)
* Installation of elastic database job service components. See [Installing the elastic database job service](sql-database-elastic-jobs-service-installation.md).

## Creating jobs

1. In the elastic database job pool blade, click **Create job**.
2. Type in the username and password of the database administrator (created at installation of Jobs) for the jobs control database (metadata storage for jobs).

	![Name the job, type or paste in code, and click Run][1]
2. In the **Create Job** blade, type a name for the job.
3. Type the user name and password to connect to the target databases with sufficient permissions for script execution to succeed.
4. Paste or type in the T-SQL script.
5. Click **Save** and then click **Run**.

	![Create jobs and run][5]

## Run idempotent jobs

When you run a script against a set of databases, you must be sure that the script is idempotent. That is, the script must be able to run multiple times, even if it has failed before in an incomplete state. For example, when a script fails, the job will be automatically retried until it succeeds (within limits, as the retry logic will eventually cease the retrying). The way to do this is to use the an "IF EXISTS" clause and delete any found instance before creating a new object. An example is shown here:

	IF EXISTS (SELECT name FROM sys.indexes
            WHERE name = N'IX_ProductVendor_VendorID')
    DROP INDEX IX_ProductVendor_VendorID ON Purchasing.ProductVendor;
	GO
	CREATE INDEX IX_ProductVendor_VendorID
    ON Purchasing.ProductVendor (VendorID);

Alternatively, use an "IF NOT EXISTS" clause before creating a new instance:

	IF NOT EXISTS (SELECT name FROM sys.tables WHERE name = 'TestTable')
	BEGIN
	 CREATE TABLE TestTable(
	  TestTableId INT PRIMARY KEY IDENTITY,
	  InsertionTime DATETIME2
	 );
	END
	GO

	INSERT INTO TestTable(InsertionTime) VALUES (sysutcdatetime());
	GO

This script then updates the table created previously.

	IF NOT EXISTS (SELECT columns.name FROM sys.columns INNER JOIN sys.tables on columns.object_id = tables.object_id WHERE tables.name = 'TestTable' AND columns.name = 'AdditionalInformation')
	BEGIN

	ALTER TABLE TestTable

	ADD AdditionalInformation NVARCHAR(400);
	END
	GO

	INSERT INTO TestTable(InsertionTime, AdditionalInformation) VALUES (sysutcdatetime(), 'test');
	GO


## Checking job status

After a job has begun, you can check on its progress.

1. From the elastic database pool page, click **Manage jobs**.

	![Click "Manage jobs"][2]

2. Click on the name (a) of a job. The **STATUS** can be "Completed" or "Failed." The job's details appear (b) with its date and time of creation and running. The list (c) below the that shows the progress of the script against each database in the pool, giving its date and time details.

	![Checking a finished job][3]


## Checking failed jobs

If a job fails, a log of its execution can found. Click the name of the failed job to see its details.

![Check a failed job][4]


[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-create-and-manage/screen-1.png
[2]: ./media/sql-database-elastic-jobs-create-and-manage/click-manage-jobs.png
[3]: ./media/sql-database-elastic-jobs-create-and-manage/running-jobs.png
[4]: ./media/sql-database-elastic-jobs-create-and-manage/failed.png
[5]: ./media/sql-database-elastic-jobs-create-and-manage/screen-2.png

 