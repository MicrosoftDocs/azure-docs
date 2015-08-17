<properties
   pageTitle="What is SQL Data Warehouse | Microsoft Azure"
   description="Enterprise-class distributed database in the Azure Cloud capable of processing up to petabyte volumes of relational and non-relational data. It is the industry's first cloud data warehouse with grow, shrink, and pause in seconds. "
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/23/2015"
   ms.author="barbkess;JRJ@BigBangData.co.uk;"/>

# What is SQL Data Warehouse?

SQL Data Warehouse is an enterprise-class distributed database in the Azure Cloud capable of processing up to petabyte volumes of relational and non-relational data. It is the industry's first cloud data warehouse with grow, shrink, and pause in seconds. 

SQL Data Warehouse blends the best of SQL Server's enterprise-class relational database quality and reliability with Cloud computing.  Read more about the key design components of SQL Data Warehouse.

## Grow, shrink, or pause compute resources
With SQL data warehouse, data is stored in cloud-scale storage, and compute is scaled independently, allowing you to pay for query performance as you need it. You can now dynamically deploy, grow, shrink, and even pause compute. Take full advantage of storage at cloud scale, and apply query compute based on seasonal needs. When paused, you only pay for storage.

> [AZURE.NOTE] Data Warehouse Units (DWUs) are the unit of scale for compute resources in SQL Data Warehouse. 

- When you need faster results, increase your DWUs and pay for the greater number DWUs; when you don't need that much compute power, decrease your DWUs and go back to paying for the smaller amount of DWUs. The compute power grows in proportion to the number of DWUs; doubling the DWUs doubles the compute resources. 
- When you don't need to run queries, perhaps in the evenings or weekends, pause compute resources to cancel all running queries and remove all DWUs allocated to your data warehouse. Your data storage stays intact, but there is no charge for compute resources. When you need to start running queries, perhaps on Monday morning, you can resume your compute resources. 

## Massively parallel processing and columnstore indexes for breakthrough performance
SQL Data Warehouse uses Microsoft’s massive parallel processing (MPP) architecture, and SQL Server's columnstore index technology to deliver breakthrough performance. 

> [AZURE.NOTE] MPP is a divide and conquer approach to solving large data problems by using parallel computing. Data is divided and distributed across many computing resources, and each computing resource operates on its portion of the data in parallel.

- Much of the secret sauce is in Microsoft's distributed query technology. SQL Data Warehouse uses an advanced query optimizer that figures out how to optimize distributed queries based on assessing the cost of query operations. It also has advanced algorithms and techniques that efficiently move data among the computing resources as necessary to perform the query.
- Columnstore indexes are key to achieving fast query performance on data warehouse queries. By using column-based storage, columnstore indexes get up to 5x compression gains over traditional row-oriented storage, and up to 10x query performance gains. Data warehouse queries work great on columnstore indexes because they often scan the entire table or entire partition of a table. In contrast, OLTP queries work great on binary tree indexes because they seek to specific rows in the table.


## Hybrid cloud with enterprise-class SQL Server experience
SQL Data Warehouse is based on SQL Server’s proven relational database engine and includes the features you expect from an enterprise data warehouse including stored procedures, user-defined functions, table partitioning, indexes, and collations. 

> [AZURE.NOTE] If you already know Transact-SQL, its easy to transfer your knowledge to SQL Data Warehouse.  Whether you are advanced or a novice, the documentation examples will help you get started. 

- SQL Data Warehouse uses SQL Server's Transact-SQL, columnstore index, and PolyBase technologies along with Analytic Platform System's massively parallel processing (MPP) architecture to create this unique, integrated, Platform-as-a-Service (PaaS) data warehouse experience.  

- With the Transact-SQL and feature commonality between SQL Server, SQL Data Warehouse, SQL Database, and Analytics Platform System, you can develop a solution that fits your data needs. You can decide where to keep your data, based on performance, security, and scale requirements, and then transfer data as necessary between on-premises and Cloud.


## Query across both relational and non-relational data
Polybase enables you to query non-relational data held in Azure blob storage or in Hadoop's File System (HDFS) as though it is a regular table. Use Polybase to query non-relational data or to import non-relational data into SQL Data Warehouse.

> [AZURE.NOTE] Polybase is easy to use and allows you to leverage your data from different sources by using the same T-SQL commands you're already familiar with. There is no need to learn HiveQL or other languages to benefit from Hadoop.

- Polybase is agnostic in it's integration. It exposes the same features and functionality to all the distributions of Hadoop that it supports. The data read by Polybase can be in a variety of formats, including delimited files or ORC files.
- PolyBase uses external tables to access non-relational data.  The table definitions are stored in SQL Data Warehouse, and the data is stored externally in Hadoop or Azure blob storage.


## Secure infrastructure deployment with no maintenance costs
SQL Data Warehouse easily deploys in seconds. This service is a fully managed offering which removes the hassle of spend time on software patching and maintenance. SQL Data Warehouse has built-in backups to support self-service restore; the service automatically backs up your data to Azure Storage as it snapshots database restore points.


## Next steps
Learn about the [data warehouse workload].
[Provision] and load [sample data] to get started.

<!--Image references-->

<!--Article references-->
[data warehouse workload]: ./sql-data-warehouse-overview-workload.md
[sample data]: ./sql-data-warehouse-get-started-load-samples.md 
[Provision]: ./sql-data-warehouse-get-started-provision.md 

<!--MSDN references-->

<!--Other Web references-->
