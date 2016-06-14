<properties
   pageTitle="SQL Data Warehouse preview expectations | Microsoft Azure"
   description="Summary of public preview capabilities and our goals for general availability of SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="happynicolle"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/11/2016"
   ms.author="nicw;barbkess;sonyama"/>


# SQL Data Warehouse preview expectations

This article describes SQL Data Warehouse preview capabilities and our goals for the service for general availability (GA). We will continuously update this information as we enhance public preview capabilities.

Our goals for SQL Data Warehouse:

- Predictable performance and linear scalability up to petabytes of data
- High reliability for all data warehouse operations
- Short time from data loading to data insights across relational and non-relational data

We will continuously work toward these goals during the preview of SQL Data Warehouse.

## Predictable and scalable performance

SQL Data Warehouse introduces Data Warehouse Units (DWUs) as a way to measure the computing resources (CPUs, memory, storage I/O) available for the data warehouse. Increasing the number of DWUs increases the resources. As the number of DWUs increases, SQL Data Warehouse runs operations in parallel (e.g. data load or query) across more distributed resources. This reduces latency and improves performance.

Any data warehouse has 2 fundamental performance metrics:

- Load rate. The number of records that can be loaded into the data warehouse per second. We specifically measure the number of records that can be imported, via PolyBase, from Azure Blob Storage to a table with a Clustered Column-Store Index.
- Scan rate. The number of records that can be sequentially retrieved from the data warehouse per second. We specifically measure the number of records returned by a query on a clustered columnstore index.

We’re measuring some important performance enhancements and will soon share the expected rates. During preview we will make continuous enhancements (e.g. increasing compression and caching) to increase these rates and to ensure they scale predictably.  

## Data Protection

SQL Data Warehouse stores all data in Azure locally redundant storage. Multiple synchronous copies of the data are maintained in the local data center to guarantee transparent data protection in case of localized failures. In addition, SQL Data Warehouse automatically backs up active (unpaused) databases at regular intervals using Azure Storage Snapshots.  To learn more about how backup and restore works, see the [Backup and Restore Overview][].

## Query reliability

SQL Data Warehouse is built on a massively parallel processing (MPP) architecture. SQL Data Warehouse automatically detects and migrates Compute and Control node failures. However an operation (e.g. data load or query) may fail as a result of a node failure or migration. During preview, we are making continuous enhancements to successfully complete operations despite node failures.

## Upgrades and downtime

SQL Data Warehouse will periodically be upgraded in order to add new features and install critical fixes.  These upgrades can be disruptive and at this time upgrades are not done on a predictable schedule.  If you find that this process is too disruptive, we encourage you to [create a support ticket][] so that we can help you work around this process.

## Next steps

[Get started][] with public preview.

<!--Image references-->

<!--Article references-->
[create a support ticket]: ./sql-data-warehouse-get-started-create-support-ticket.md
[Get started]: ./sql-data-warehouse-get-started-provision.md
[Backup and Restore Overview]: ./sql-data-warehouse-restore-database-overview.md

<!--MSDN references-->

<!--Other Web references-->
