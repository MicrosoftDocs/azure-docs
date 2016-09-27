<properties
	pageTitle="Monitor XTP in-memory storage | Microsoft Azure"
	description="Estimate and monitor XTP in-memory storage use, capacity; resolve capacity error 41823"
	services="sql-database"
	documentationCenter=""
	authors="jodebrui"
	manager="jhubbard"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/18/2016"
	ms.author="jodebrui"/>


# Monitor In-Memory OLTP Storage

When using [In-Memory OLTP](sql-database-in-memory.md), data in memory-optimized tables and table variables resides in In-Memory OLTP storage. Each Premium service tier has a maximum In-Memory OLTP storage size, which is documented in the [SQL Database Service Tiers article](sql-database-service-tiers.md#service-tiers-for-single-databases). Once this limit is exceeded, insert and update operations may start failing (with error 41823). At that point you will need to either delete data to reclaim memory, or upgrade the performance tier of your database.

## Determine whether data will fit within the in-memory storage cap

Determine the storage cap: consult the [SQL Database Service Tiers article](sql-database-service-tiers.md#service-tiers-for-single-databases) for the storage caps of the different Premium service tiers.

Estimating memory requirements for a memory-optimized table works the same way for SQL Server as it does in Azure SQL Database. Take a few minutes to review that topic on [MSDN](https://msdn.microsoft.com/library/dn282389.aspx).

Note that the table and table variable rows, as well as indexes, count toward the max user data size. In addition, ALTER TABLE needs enough room to create a new version of the entire table and its indexes.

## Monitoring and alerting

You can monitor in-memory storage use as a percentage of the [storage cap for your performance tier](sql-database-service-tiers.md#service-tiers-for-single-databases) in the Azure [portal](https://portal.azure.com/): 

- On the Database blade, locate the Resource utilization box and click on Edit.
- Then select the metric `In-Memory OLTP Storage percentage`.
- To add an alert, click on the Resource Utilization box to open the Metric blade, then click on Add alert.

Or use the following query to show the in-memory storage utilization:

    SELECT xtp_storage_percent FROM sys.dm_db_resource_stats


## Correct out-of-memory situations - Error 41823

Running out-of-memory results in INSERT, UPDATE, and CREATE operations failing with error message 41823.

Error message 41823 indicates that the memory-optimized tables and table variables have exceeded the maximum size.

To resolve this error, either:


- Delete data from the memory-optimized tables, potentially offloading the data to traditional, disk-based tables; or,
- Upgrade the service tier to one with enough in-memory storage for the data you need to keep in memory-optimized tables.

## Next steps
Additional resources about about [Monitoring Azure SQL Database using dynamic management views](sql-database-monitoring-with-dmvs.md)
