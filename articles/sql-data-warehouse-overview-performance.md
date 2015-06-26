<properties
   pageTitle="Performance and scale overview | Microsoft Azure"
   description="Introduction to the performance and scale features of SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="TwoUnder"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/24/2015"
   ms.author="barbkess;JRJ@BigBangData.co.uk;mausher;nicw"/>

# Performance and scale overview
By putting your Data Warehouse in the cloud, you no longer have to deal with low-level hardware issues.  Gone are the days where you need to research what type of processors, how much memory or what type of storage you need to have great performance in your data warehouse.  Instead, SQL Data Warehouse asks you this question: how fast do you want to process your data? 

SQL Data Warehouse is a cloud based, distributed database platform that's designed to deliver great performance at scale where you are in full control of the resources used to resolve your queries. By simply adjusting the number of data warehouse units allocated to your data warehouse you can elastically scale the size of your warehouse resources in seconds. As a distributed, scale out platform, SQL Data Warehouse enables your data warehouse to process significant data volumes efficiently and effectively whilst leaving you in complete control of the cost of the solution.

*The following information applies to the Azure SQL Data Warehouse as released at preview. This information will be continuously updated during the preview as the service is enhanced towards GA.*

Our goals for SQL Data Warehouse are:
-	Predictable performance and linear scalability to petabytes of data
-	High reliability for all data warehouse operations backed by a Service Level Agreement (SLA)
-	Short time from data loading to data insights across relational and non-relational data

We will continuously work toward these goals during the preview to satisfy them before General Availability (GA).

>[AZURE.NOTE] The sections below describe the Azure SQL Data Warehouse service at the Public Preview launch. This information will be continuously updated during the preview as the service is enhanced towards GA. 

## Data protection
SQL Data Warehouse stores all data in Azure Storage using geo-redundant blobs. Three synchronous copies of the data are maintained in the local Azure region to guarantee transparent data protection in case of localized failures (e.g. storage drive failures). In addition, three more asynchronous copies are maintained in a remote Azure region to guarantee data protection in case of regional failures (disaster recovery). Local and remote regions are paired to maintain acceptable synchronization latencies (e.g. East US and West US).

## Database restore
SQL Data Warehouse backs up all data every 4 hours using Azure Storage Snapshots. These snapshots are maintained for 7 days free of charge. This allows restoring the data to up to 42 points in time within the past 7 days up to the time when the last snapshot was taken. During the preview, the ability to specify different retention values will be introduced. Data can be restored from a snapshot using PowerShell or REST APIs. Snapshots are asynchronously copied to a remote Azure region for added recoverability in case of regional failures (disaster recovery). 

## Reliability
SQL Data Warehouse is a distributed system with multiple components where the number of components grows as the number of Data Warehouse Units (DWUs) increases. SQL Data Warehouse automatically detects and mitigates compute failures, however, an operation (e.g. data load or query) may fail due to individual compute failures. During preview, we will make continuous enhancements in query reliability to enable most to successfully complete operations despite failures.

Based on telemetry data gathered, the reliability of SQL Data Warehouse is estimated at 98% for typical data warehousing workloads. This means that, in average, 2 out of 100 queries may fail due to system errors. This is not a SLA for the preview rather an indicator of the expected reliability of queries being executed. Notice that the probability of a query failing increases with its execution time (e.g. a query taking longer than 2 hours has much higher probability of failing than a query taking less than 10 minutes). During preview we will make continuous enhancements to guarantee the same level of reliability for operations irrespective of their execution time. We will update the expected reliability as we release these enhancements with a goal of delivering a full SLA with the GA release.

During the preview, SQL Data Warehouse may have up to 5 maintenance events per month to install critical fixes. Each event may cause query failures for up to 2 hours with the time dependent on the amount of DWU used by the SQL Data Warehouse instance. We will make every attempt to notify customers of these events 48 hours in advance to allow for proper planning.

## Performance and scalability
SQL Data Warehouse introduces Data Warehouse Units (DWUs) as an abstraction of computational resources (CPUs, memory, storage I/O) aggregated across a number of nodes. Increasing the number of DWUs increases the aggregated computational resources of a SQL Data Warehouse instance. SQL Data Warehouse distributes operations (e.g. data load or query) across all of the compute infrastructure in the instance to increase or decrease the performance of loads and queries as the system is scaled up or down.

Any data warehouse has 2 fundamental performance metrics: 
- **Load rate**: The number of records that can be loaded into the data warehouse per second. We specifically measure the number of records that can be imported, via PolyBase, from Azure Blob Storage to a table with a Clustered Column-Store Index.
- **Scan rate**: The number of records that can be sequentially retrieved from the data warehouse per second. This metric specifically measures the number of records returned by a query from a table with a Clustered Column-Store Index.

During the preview, we will make continuous enhancements to increase these rates and ensure they scale predictably. 

## Key performance concepts

Please refer to the following articles to help you understand some additional key performance and scale concepts:

- [performance and scale][]
- [concurrency model][]
- [designing tables][]
- [choose a hash distribution key for your table][]
- [statistics to improve performance][]

## Next steps
Please refer to the [development overview][] article to get some guidance on building your SQL Data Warehouse solution.

<!--Image references-->

<!--Article references-->

[performance and scale]: sql-data-warehouse-performance-scale.md
[concurrency model]: sql-data-warehouse-develop-concurrency.md
[designing tables]: sql-data-warehouse-develop-table-design.md
[choose a hash distribution key for your table]: sql-data-warehouse-develop-hash-distribution-key
[statistics to improve performance]: sql-data-warehouse-develop-statistics.md
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other web references-->
