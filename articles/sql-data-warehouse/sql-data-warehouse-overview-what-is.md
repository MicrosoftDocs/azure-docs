<properties
   pageTitle="What is Azure SQL Data Warehouse | Microsoft Azure"
   description="Enterprise-class distributed database capable of processing petabyte volumes of relational and non-relational data. It is the industry's first cloud data warehouse with grow, shrink, and pause in seconds."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/03/2016"
   ms.author="lodipalm;barbkess;mausher;jrj;sonyama;"/>


# What is Azure SQL Data Warehouse?

Azure SQL Data Warehouse is a cloud-based, scale-out database capable of processing massive volumes of data - both relational and non-relational. Built on our massively parallel processing (MPP) architecture, SQL Data Warehouse can handle your enterprise workload. 

SQL Data Warehouse:

- Combines our proven SQL Server relational database with our Azure cloud scale-out capabilities. You can increase, decrease, pause, or resume compute in seconds.  This lets you save costs by scaling out CPU when you need it, and cutting back usage during non-peak times.
- Leverages our Azure platform. It's easy to deploy, seamlessly maintained. and fully fault tolerant thanks to automatic back-ups. 
- Complements the SQL Server ecosystem.  You can develop with familiar SQL Server T-SQL and tools.

Read on to learn more about the key features of SQL Data Warehouse.

## Optimized

### Massively Parallel Processing (MPP) architecture

SQL Data Warehouse uses Microsoft’s massively parallel processing (MPP) architecture, designed to run some of the world's largest on-premises data warehouses.

Currently, our MPP architecture spreads your data across 60 shared-nothing storage and processing units. The data is stored in redundant, geo-replicated Azure Storage Blobs and linked to Compute nodes for query execution. With this architecture, we can take a divide and conquer approach to running complex T-SQL queries. When processing, the Control node parses the query, and then each Compute node "conquers" its portion of the data in parallel. 

By combining our MPP architecture and Azure storage capabilities, SQL Data Warehouse can:

- Grow or shrink storage independent of compute.
- Grow or shrink compute without moving data. 
- Pause compute capacity while keeping data intact.
- Resume compute capacity at a moment's notice.

The architecture is described in detail below. 

![SQL Data Warehouse Architecture][1]


- **Control node:** The Control node "controls" the system. It is the front end that interacts with all applications and connections. In SQL Data Warehouse, the Control node is powered by SQL Database, and connecting to it looks and feels the same. Under the surface, the Control node coordinates all of the data movement and computation required to run parallel queries on your distributed data. When you submit a TSQL query to SQL Data Warehouse, the Control node transforms it into separate queries that will run on each Compute node in parallel.

- **Compute Nodes:** The Compute nodes serve as the power behind SQL Data Warehouse. They are SQL Databases which process your query steps and manage your data. When you add data, SQL Data Warehouse distributes the rows using your Compute nodes. The Compute nodes are also the workers that run the parallel queries on your data. After processing, they pass the results back to the Control node. To finish the query, the Control node aggregates the results and returns the final result.


- **Storage:** Your data is stored in Azure Storage Blobs. When Compute nodes interact with your data, they write and read directly to and from blob storage. Since Azure storage expands transparently and limitlessly, SQL Data Warehouse can do the same. Since compute and storage are independent, SQL Data Warehouse can automatically scale storage separately from scaling compute, and vice-versa.  Azure Storage is also fully fault tolerant and streamlines the backup and restore process.
   

- **Data Movement Service:** Data Movement Service (DMS) is our technology for moving data between the nodes. DMS gives the Compute nodes access to data they need for joins and aggregations. DMS is not an Azure service. It is a Windows service that runs alongside SQL Database on all the nodes. Since DMS runs behind the scenes, you won't interact with it directly. However, when you look at query plans you will notice they include some DMS operations since data movement is necessary in some shape or form to run each query in parallel.


### Optimized query performance

In addition to the divide and conquer strategy, the MPP approach is aided by a number of data warehousing specific performance optimizations, including:

- A distributed query optimizer and set of complex statistics across all data. Using information on data size and distribution, the service is able to optimize queries by assessing the cost of specific distributed query operations.

- Advanced algorithms and techniques integrated into the data movement process to efficiently move data among computing resources as necessary to perform the query. These data movement operations are built-in and all optimizations to the Data Movement Service happen automatically.

- Clustered columnstore indexes by default. By using column-based storage, SQL Data Warehouse gets up to 5x compression gains over traditional row-oriented storage, and up to 10x query performance gains. Analytics queries that need to scan a large number of rows work great on columnstore indexes. 

## Scalable

The architecture of SQL Data Warehouse introduces separated storage and compute, allowing each to scale independently. SQL Database's quick and simple deployment structure allows for additional compute to be available at a moment's notice. Complementing this is the use of Azure Storage Blobs. Using Blobs not only gives us stable, replicated storage, but also provides the infrastructure for effortless expansion at low cost.  Using this combination of cloud-scale storage and Azure compute, SQL Data Warehouse allows you to pay for query performance storage as you need it when you need it. Changing the amount of compute is as simple as moving a slider in the Azure portal to the left or right, but can also be scheduled using T-SQL and PowerShell.

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

- Polybase is agnostic in its integration. It exposes the same features and functionality to all the sources that it supports. The data read by Polybase can be in a variety of formats, including delimited files or ORC files.

- PolyBase can be used to access blob storage that is also being used as storage for an HD Insight cluster, giving you cutting edge access to the same data with relational and non-relational tools.

## Next steps

Now that you know a bit about SQL Data Warehouse, learn about the [data warehouse workload], [provision], and load [sample data] to get started.

## SQL Data Warehouse Resources

[Blogs][]
[Feature Requests][]
[Videos][]
[CAT Team Blogs][]
[Create Support Ticket][]
[MSDN Forum][]
[Stack Overflow Forum][]
[Twitter][]


>[AZURE.NOTE] We want to make this article better. If you choose to answer "no" to the "Was this article helpful?" question, please include a brief suggestion about what is missing or how to improve the article. Thanks in advance!!

<!--Image references-->
[1]: ./media/sql-data-warehouse-overview-what-is/dwarchitecture.png

<!--Article references-->
[Create Support Ticket]: ./sql-data-warehouse-get-started-create-support-ticket.md
[data warehouse workload]: ./sql-data-warehouse-overview-workload.md
[sample data]: ./sql-data-warehouse-get-started-manually-load-samples.md
[Provision]: ./sql-data-warehouse-get-started-provision.md

<!--MSDN references-->

<!--Other Web references-->
[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[CAT Team Blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Feature Requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[MSDN Forum]: https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureSQLDataWarehouse
[Stack Overflow Forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
