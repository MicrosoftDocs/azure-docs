<properties
   pageTitle="What is Azure SQL Data Warehouse | Microsoft Azure"
   description="Enterprise-class distributed database capable of processing petabyte volumes of relational and non-relational data. It is the industry's first cloud data warehouse with grow, shrink, and pause in seconds."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="12/10/2015"
   ms.author="lodipalm;barbkess;twounder;JRJ@BigBangData.co.uk;"/>


# What is Azure SQL Data Warehouse?

Azure SQL Data Warehouse is an enterprise-class, distributed database capable of processing massive volumes of relational and non-relational data. It is the industry's first cloud data warehouse that combines proven SQL capabilities with the ability to grow, shrink, and pause in seconds. SQL Data Warehouse is also deeply ingrained into Azure, it easily deploys in seconds. In addition to this, the service is fully managed and removes the hassle of spending time on software patching, maintenance, and back-ups. SQL Data Warehouse's automatic, built-in backups support fault-tolerance and self-service restore. In creating SQL Data Warehouse, we focused on a few key attributes in order to ensure that we were fully taking advantage of Azure and creating a data warehouse that could meet any enterprise workload.

## Optimized

### Data Warehouse architecture

At it's core, SQL Data Warehouse runs using Microsoft’s massive parallel processing (MPP) architecture, originally designed to run some of the largest on-premise enterprise data warehouses. This architecture takes advantage of built-in data warehousing performance improvements and also allows SQL Data Warehouse to easily scale-out and parallelize computation of complex SQL queries. In addition, SQL Data Warehouse's architecture is designed to take advantage of it's presence in Azure.  Combining these two aspects, the architecture breaks up into 4 key components:

![SQL Data Warehouse Architecture][1]

- **Control Node:**  You connect to the control node when using SQL Data Warehouse with any development, loading, or business intelligence tools. In SQL Data Warehouse, the control node is a SQL Database, and when connecting it looks and feels like a standard SQL Database.  However, under the surface, it coordinates all of the data movement and computation that takes place in the system. When a command is issued to the control node, it breaks it down into a set of queries that will be passed onto the compute nodes of the service.

- **Compute Nodes:** Like the control node, the compute nodes of SQL Data Warehouse are powered using SQL Databases.  Their job is to serve as the compute power of the service.  Behind the scenes, any time data is loaded into SQL Data Warehouse, it is distributed across the nodes of the service.  Then, any time the control node receives a command it breaks it into pieces for each compute node, and the compute nodes operate over their corresponding data.  After completing their computation, compute nodes pass partial results to the control node which then aggregates results before returning an answer.

- **Storage:** All storage for SQL Data Warehouse is standard Azure Storage Blobs. This means that when interacting with data, compute nodes are writing and reading directly to/from Blobs. Azure Storage's ability to expand transparently and nearly limitlessly allows us to automatically scale storage, and to do so separately from compute. Azure Storage also allows us to persist storage while scaling or paused, streamline our back-up and restore process, and have safer, more fault tolerant storage.

- **Data Movement Services:** The final piece holding everything together in SQL Data Warehouse is our Data Movement Services. The data movement services allows the control node to communicate and pass data to all of the compute nodes. It also enables the compute nodes to pass data between each other, which gives them access to data on other compute nodes, and allows them to get the data that they need to complete joins and aggregations.

### Engine optimizations

This MPP approach allows SQL Data Warehouse to take a divide and conquer approach as described above when solving large data problems. Since the data in SQL Data Warehouse is divided and distributed across the compute nodes of the service, each compute node is able to operate on its portion of the data in parallel. Finally, results are passed to the control node and aggregated before being passed back to the users. This approach is also aided by a number of data warehousing specific performance optimizations:

- SQL Data Warehouse uses an advanced query optimizer and set of complex statistics across all data on the service to create its query plans. Using information on data size and distribution, the service is able to optimize distributed queries based on assessing the cost of specific query operations.

- In addition to creating optimal query plans, SQL Data Warehouse incorporates advanced algorithms and techniques that efficiently move data among the computing resources as necessary to perform the query. These operations are built into the Data Movement Services of the data warehouse, and optimizations happen automatically.

- The inclusion of clustered columnstore indexes to the appliance is also key to achieving fast query performance. By using column-based storage, SQL Data Warehouse can get up to 5x compression gains over traditional row-oriented storage, and up to 10x query performance gains. Data warehouse queries work great on columnstore indexes because they often scan the entire table or entire partition of a table and they minimize the impact of moving data for query steps.

## Scalable

The architecture of SQL Data Warehouse introduces separated storage and compute, allowing each to scale independently. SQL Database's quick and simple deployment structure allows for additional compute to be available at a moment's notice. Complementing this is the use of Azure Storage Blobs. Blobs not only gives us stable, replicated storage, but also provide the infrastructure for effortless expansion at low cost.  Using this combination of cloud-scale storage and Azure compute, SQL Data Warehouse allows you to pay for query performance storage as you need it when you need it. Changing the amount of compute is as simple as moving a slider in the Azure Classic Portal to the left or right, but can also be scheduled or added to a workload with T-SQL and PowerShell.

Along with the ability to fully control the amount of compute independently of storage, SQL Data Warehouse allows you to fully pause your data warehouse. While keeping your storage in place all compute is released into Azure's main pool, saving you money immediately. When needed, simply resume the compute and have your data and compute available for your workload.

Compute usage in SQL Data Warehouse is measured using SQL Data Warehouse Units (DWUs). DWUs are a measure of underlying power that your data warehouse has, and are designed to ensure that you have a standard amount of performance associated with your warehouse at any given time.  Specifically, we use DWUs to ensure that:

- You are able to scale your data warehouse effectively without worrying about the underlying hardware or software.

- You can understand the performance you will see at a DWU level before you change the size of you data warehouse.

- The underlying hardware and software of your instance can change or move without effecting your workload performance

- We can make adjustments to the underlying architecture of the service without affecting the performance of your workload.

- As we rapidly improve performance in SQL Data Warehouse, we can ensure we do so in a way the is scalable and evenly effects the system.

### Data Warehouse Units

Specifically, we look at Data Warehouse Units as a measure of three precise metrics that we find to be highly correlated with data warehousing workload performance. We aim that, for our general availability, these key workload metrics will scale linearly with the DWUs that you have chosen for your data warehouse.

**Scan/Aggregation:** This workload metric takes a standard data warehousing query that scans a large number of rows and then performs a complex aggregation. This is a IO and CPU intensive operation.

**Load:** This metric measures the ability to ingest data into the service. Loads are completed with PolyBase loading a representative dataset from an Azure Storage Blob. This metric is designed to stress Network and CPU aspects of the service.

**CREATE TABLE AS SELECT (CTAS):** CTAS measures the ability to create copy of a table. This involves reading data from storage, distributing it across the nodes of the appliance, and writing it to storage again. It is a CPU and Network intensive operation.

### When to scale

Overall, we want DWUs to be simple. When you need faster results, increase your DWUs and pay for greater performance.  When you need less compute power, decrease your DWUs and pay only for what you need. Some times when you might think about changing your number of DWUs are:

- When you don't need to run queries, perhaps in the evenings or weekends, pause compute resources to cancel all running queries and remove all DWUs allocated to your data warehouse.

- When performing a heavy data loading or transformation operation, you may want to scale-up so that your data is available more quickly.

- In order to understand what your ideal DWU value is try scaling up and down and running a few queries after loading your data. Since scaling is quick, you can try a number of different levels of performance without committing to more than an hour.

> [AZURE.NOTE] Please note that due to the architecture or SQL Data Warehouse you may not see expected performance scaling at lower data volumes.  We recommend starting with data volumes at or above 1 TB in order to get accurate performance testing results.

## Integrated

SQL Data Warehouse is based on SQL Server’s proven relational database engine and includes many of the features you expect from an enterprise data warehouse. If you already know Transact-SQL, its easy to transfer your knowledge to SQL Data Warehouse. Whether you are advanced or just getting started, the examples across the documentation will help begin. Overall, you can think about the way that we've constructed the language elements of SQL Data Warehouse as follows:

- SQL Data Warehouse uses SQL Server's Transact-SQL (TSQL) syntax for many operations and supports a broad set of traditional SQL constructs such as stored procedures, user-defined functions, table partitioning, indexes, and collations.

- SQL Data Warehouse also contains a number of cutting edge SQL Server features including clustered columnstore indexes, PolyBase integration, and Data Auditing (complete with Threat Assessment).

- As SQL Data Warehouse is still under development, certain TSQL language elements that are less common for data warehousing workloads or are newer to SQL Server may not be available at this point in time. See our Migration documentation for more information related to this.

With the Transact-SQL and feature commonality between SQL Server, SQL Data Warehouse, SQL Database, and Analytics Platform System, you can develop a solution that fits your data needs. You can decide where to keep your data, based on performance, security, and scale requirements, and then transfer data as necessary between different systems.

In addition to adopting the TSQL surface area of SQL Server, SQL Data Warehouse also integrates with many of the tools that SQL Server users may be familiar with. Specifically, we have focused on a few integrating a few categories of tools with SQL Data Warehouse including:

**Traditional SQL Server Tools:** Full integration with SQL Server Analysis Services, Integration Services, and Reporting services is available with SQL Data Warehouse.

**Cloud-based Tools:** SQL Data Warehouse can be used alongside a number of new tools in Azure, and has deep integration with Azure's Data Factory, Stream Analytics, Machine Learning, and Power BI.

**Third Party Tools:** A large number of third party tool providers have certified integration of their tools with SQL Data Warehouse. See the full list.

## Hybrid

Using SQL Data Warehouse with PolyBase gives users unprecedented ability to move data across their ecosystem, unlocking the ability to set-up advanced hybrid scenarios with non-relational and on-premise data sources.

Polybase is easy to use and allows you to leverage your data from different sources by using the same familiar T-SQL commands. Polybase enables you to query non-relational data held in Azure blob storage as though it is a regular table. Use Polybase to query non-relational data or to import non-relational data into SQL Data Warehouse.

- PolyBase uses external tables to access non-relational data. The table definitions are stored in SQL Data Warehouse, and can be acessed by SQL and tools like you would access normal relational data.

- Polybase is agnostic in it's integration. It exposes the same features and functionality to all the sources that it supports. The data read by Polybase can be in a variety of formats, including delimited files or ORC files.

- PolyBase can be used to access blob storage that is also being used as storage for an HD Insight cluster, giving you cutting edge access to the same data with relational and non-relational tools.


## Next steps

Now that you know a bit about SQL Data Warehouse, learn about the [data warehouse workload], [provision], and load [sample data] to get started.

>[AZURE.NOTE] We want to make this article better. If you choose to answer "no" to the "Was this article helpful?" question, please include a brief suggestion about what is missing or how to improve the article. Thanks in advance!!

<!--Image references-->
[1]: ./media/sql-data-warehouse-overview-what-is/dwarchitecture.png 

<!--Article references-->
[data warehouse workload]: ./sql-data-warehouse-overview-workload.md
[sample data]: ./sql-data-warehouse-get-started-load-samples.md
[Provision]: ./sql-data-warehouse-get-started-provision.md

<!--MSDN references-->

<!--Other Web references-->
