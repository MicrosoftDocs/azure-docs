<properties
   pageTitle="SQL Data Warehouse preview expectations | Microsoft Azure"
   description="Summary of public preview capabilities and our goals for general availability of SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lvargas"
   manager="tonypet"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="07/20/2015"
   ms.author="lvargas;barbkess"/>

# SQL Data Warehouse preview expectations

This article describes SQL Data Warehouse preview capabilities, and our goals for the service for general availability (GA). We will continuously update this information as we enhance public preview capabilities. 

Our goals for SQL Data Warehouse:

- Predictable performance and linear scalability up to petabytes of data.
- High reliability for all data warehouse operations, backed by a service level agreement (SLA).

We will continuously work toward these goals before promoting SQL Data Warehouse to general availability. 

## Predictable and scalable performance

Azure SQL Data Warehouse introduces Data Warehouse Units (DWUs) as as a way to measure the computing resources (CPUs, memory, storage I/O) available for the data warehouse. Increasing the number of DWUs increases the resources. As the number of DWUs increases, SQL Data Warehouse runs operations in parallel (e.g. data load or query) across more distributed resources. This reduces latency and improves performance.

Any data warehouse has 2 fundamental performance metrics:

- Load rate. The number of records that can be loaded into the data warehouse per second. We specifically measure the number of records that can be imported, via PolyBase, from Azure Blob Storage to a table with a Clustered Column-Store Index. 
- Scan rate. The number of records that can be sequentially retrieved from the data warehouse per second. We specifically measure the number of records returned by a query on a clustered columnstore index.


We’re measuring some important performance enhancements and will soon share the expected rates. During preview we will make continuous enhancements (e.g. increasing compression and caching) to increase these rates and to ensure they scale predictably.  


## High reliability backed by an SLA

### Data Protection 

SQL Data Warehouse stores all data in Azure storage using geo-redundant blobs. Three synchronous copies of the data are maintained in the local Azure region to guarantee transparent data protection in case of localized failures (e.g. storage drive failures). In addition, three more asynchronous copies are maintained in a remote Azure region to guarantee data protection in case of regional failures (disaster recovery). Local and remote regions are paired to maintain acceptable synchronization latencies (e.g. East US and West US). 


### Backups

Azure SQL Data Warehouse backs up all data every 4 hours using Azure Storage Snapshots. These snapshots are maintained for 7 days. This allows restoring the data to up to 42 points in time within the past 7 days up to the time when the last snapshot was taken. By GA, we will you to specify the retention period. You can restore data from a snapshot by using PowerShell or REST APIs. 

Snapshots are copied asynchronously to a remote Azure region for added recoverability in case of regional failures (disaster recovery). 


### Query completion 

SQL Data Warehouse stores data across one or more computing nodes that each store some of the user data and control query execution on that data. As part of the massively parallel processing (MPP) architecture, the queries run in parallel across the Compute nodes. SQL Data Warehouse automatically detects and mitigates Compute node failures. However, during preview, an operation (e.g. data load or query) may fail due to individual node failures. During preview, we are making continuous enhancements to successfully complete operations despite node failures. 

Based on telemetry data, we estimate the current reliability of Azure SQL Data Warehouse at 98%. This means that, on average, 2 out of 100 queries may fail due to system errors. This is not an SLA. The probability of a query failing increases with its execution time. For example, a query that runs longer than 2 hours has a much higher probability of failing than a query that runs less than 10 minutes. During preview we are improving reliability so that we can guarantee the same level of reliability for operations irrespective of their execution time. We will update the expected reliability as we release these enhancements. For general availability, reliability will be backed by a SLA. 

### Service uptime

Azure SQL Data Warehouse may have up to 4 maintenance events per month to install critical fixes. Each event may cause query failures for up to 2 hours. The time will depend on the number of DWUs allocated to the service. We will make every attempt to notify these events 48 hours in advance.


## Next steps

[Get started][] with public preview. 

<!--Image references-->

<!--Article references-->
[Get started]: ./sql-data-warehouse-get-started-provision.md

<!--MSDN references-->

<!--Other Web references-->
