<properties
	pageTitle="Monitor XTP in-memory storage | Microsoft Azure"
	description="Estimate and monitor XTP in-memory storage use, capacity; resolve capacity error 41805"
	services="sql-database"
	documentationCenter=""
	authors="jodebrui"
	manager="jeffreyg"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="10/27/2015"
	ms.author="jodebrui"/>


# Monitor XTP In-Memory Storage

Consult the [SQL Database Service Tiers article](sql-database-service-tiers.md) for service tier and storage information.

When using [In-Memory OLTP](sql-database-in-memory.md), data in memory-optimized tables and table variables resides in XTP in-memory storage. Each Premium service tier has a maximum in-memory storage size. Once this limit is exceeded, insert and update operations may start failing (with error 41805). At that point you will need to either delete data to reclaim memory, or upgrade the performance tier of your database.

## Determine whether data will fit within the in-memory storage cap

Estimating memory requirements for a memory-optimized table works the same way for SQL Server as it does in Azure SQL Database. Take a few minutes to review that topic on [MSDN](https://msdn.microsoft.com/library/dn282389.aspx#bkmk_memoryfortable).

Note that the table and table variable rows, as well as indexes, count toward the max user data size. In addition, ALTER TABLE needs enough room to create a new version of the entire table and its indexes.

##### Max XTP in-memory storage size for Premium service tiers:



You can monitor in-memory storage use in the Azure [portal](http://portal.azure.com/): 

- On the Database blade, locate the Resource utilization box and click on Edit.
- Then select the metric XTP In-Memory Storage percentage.

Or use the following query to show the in-memory storage utilization:

    select xtp_storage_percent from sys.dm_db_resource_stats

## Correct out-of-memory situations - Error 41805

Running out-of-memory results in INSERT, UPDATE, and CREATE operations failing with error message 41805.

Error message 41805 indicates that the memory-optimized tables and table variables have exceeded the maximum size.

To resolve this error, either:


- Delete data from the memory-optimized tables, potentially offloading the data to traditional, disk-based tables; or,
- Upgrade the service tier to one with enough in-memory storage for the data you need to keep in memory-optimized tables.

## Next steps
Learn more about about [Monitoring Azure SQL Database using dynamic management views](sql-database-monitoring-with-dmvs.md)