<properties
   pageTitle="What is Azure SQL Data Warehouse? | Microsoft Azure"
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
   ms.date="07/23/2016"
   ms.author="lodipalm;barbkess;mausher;jrj;sonyama;kevin"/>


# What is Azure SQL Data Warehouse?

Azure SQL Data Warehouse is a cloud-based, scale-out database capable of processing massive volumes of data, both relational and non-relational. Built on our massively parallel processing (MPP) architecture, SQL Data Warehouse can handle your enterprise workload.

SQL Data Warehouse:

- Combines the SQL Server relational database with Azure cloud scale-out capabilities. You can increase, decrease, pause, or resume compute in seconds. You save costs by scaling out CPU when you need it, and cutting back usage during non-peak times.
- Leverages the Azure platform. It's easy to deploy, seamlessly maintained, and fully fault tolerant because of automatic back-ups.
- Complements the SQL Server ecosystem. You can develop with familiar SQL Server Transact-SQL (T-SQL) and tools.

This article describes the key features of SQL Data Warehouse.

## Massively parallel processing architecture

SQL Data Warehouse is a massively parallel processing (MPP) distributed database system. By dividing data and processing capability across multiple nodes, SQL Data Warehouse can offer huge scalability - far beyond any single system.  Behind the scenes, SQL Data Warehouse spreads your data across many shared-nothing storage and processing units. The data is stored in Premium locally redundant storage, and linked to compute nodes for query execution. With this architecture, SQL Data Warehouse takes a "divide and conquer" approach to running loads and complex queries. Requests are received by the Control node, optimized and then passed to the Compute nodes to do their work in parallel.

By combining MPP architecture and Azure storage capabilities, SQL Data Warehouse can:

- Grow or shrink storage independent of compute.
- Grow or shrink compute without moving data.
- Pause compute capacity while keeping data intact.
- Resume compute capacity at a moment's notice.

The following diagram shows the architecture in more detail.

![SQL Data Warehouse Architecture][1]


**Control node:** The Control node manages and optimizes queries. It is the front end that interacts with all applications and connections. In SQL Data Warehouse, the Control node is powered by SQL Database, and connecting to it looks and feels the same. Under the surface, the Control node coordinates all of the data movement and computation required to run parallel queries on your distributed data. When you submit a T-SQL query to SQL Data Warehouse, the Control node transforms it into separate queries that run on each Compute node in parallel.

**Compute nodes:** The Compute nodes serve as the power behind SQL Data Warehouse. They are SQL Databases that store your data and process your query. When you add data, SQL Data Warehouse distributes the rows to your Compute nodes. The Compute nodes are the workers that run the parallel queries on your data. After processing, they pass the results back to the Control node. To finish the query, the Control node aggregates the results and returns the final result.

**Storage:** Your data is stored in Azure Blob storage. When Compute nodes interact with your data, they write and read directly to and from blob storage. Since Azure storage expands transparently and limitlessly, SQL Data Warehouse can do the same. Since compute and storage are independent, SQL Data Warehouse can automatically scale storage separately from scaling compute, and vice-versa. Azure Blob storage is also fully fault tolerant, and streamlines the backup and restore process.

**Data Movement Service:** Data Movement Service (DMS) moves data between the nodes. DMS gives the Compute nodes access to data they need for joins and aggregations. DMS is not an Azure service. It is a Windows service that runs alongside SQL Database on all the nodes. Since DMS runs behind the scenes, you won't interact with it directly. However, when you look at query plans, you will notice they include some DMS operations since data movement is necessary to run each query in parallel.


## Optimized for data warehouse workloads

The MPP approach is aided by a number of data warehousing specific performance optimizations, including:

- A distributed query optimizer and set of complex statistics across all data. Using information on data size and distribution, the service is able to optimize queries by assessing the cost of specific distributed query operations.

- Advanced algorithms and techniques integrated into the data movement process to efficiently move data among computing resources as necessary to perform the query. These data movement operations are built-in, and all optimizations to the Data Movement Service happen automatically.

- Clustered **columnstore** indexes by default. By using column-based storage, SQL Data Warehouse gets on average 5x compression gains over traditional row-oriented storage, and up to 10x or more query performance gains. Analytics queries that need to scan a large number of rows work great on columnstore indexes.


## Predictable and scalable performance

SQL Data Warehouse separates storage and compute, which allows each to scale independently. SQL Data Warehouse can quickly and simply scale to add additional compute resources at a moment's notice. Complementing this is the use of Azure Blob storage. Blobs provide not only stable, replicated storage, but also the infrastructure for effortless expansion at low cost. Using this combination of cloud-scale storage and Azure compute, SQL Data Warehouse allows you to pay for query performance and storage when you need it. Changing the amount of compute is as simple as moving a slider in the Azure portal to the left or right, or it can also be scheduled using T-SQL and PowerShell.

Along with the ability to fully control the amount of compute independently of storage, SQL Data Warehouse allows you to fully pause your data warehouse, which means you don't pay for compute when you don't need it. While keeping your storage in place, all compute is released into the main pool of Azure, saving you money. When needed, simply resume the compute and have your data and compute available for your workload.

## Data Warehouse Units

Allocation of resources to your SQL Data Warehouse is measured in Data Warehouse Units (DWUs). DWUs are a measure of underlying resources like CPU, memory, IOPS, which are allocated to your SQL Data Warehouse. Increasing the number of DWUs increases resources and performance. Specifically, DWUs help ensure that:

- You are able to scale your data warehouse easily, without worrying about the underlying hardware or software.

- You can predict performance improvement for a DWU level before you change the size of your data warehouse.

- The underlying hardware and software of your instance can change or move without affecting your workload performance.

- Microsoft can make adjustments to the underlying architecture of the service without affecting the performance of your workload.

- Microsoft can rapidly improve performance in SQL Data Warehouse, in a way the is scalable and evenly effects the system.

Data Warehouse Units provide a measure of three precise metrics that are highly correlated with data warehousing workload performance. The goal is that the following key workload metrics will scale linearly with the DWUs that you have chosen for your data warehouse.

**Scan/Aggregation:** This workload metric takes a standard data warehousing query that scans a large number of rows and then performs a complex aggregation. This is an I/O and CPU intensive operation.

**Load:** This metric measures the ability to ingest data into the service. Loads are completed with PolyBase loading a representative data set from Azure Blob storage. This metric is designed to stress network and CPU aspects of the service.

**Create Table As Select (CTAS):** CTAS measures the ability to copy a table. This involves reading data from storage, distributing it across the nodes of the appliance and writing it to storage again. It is a CPU, IO and network intensive operation.

## Pause and scale on demand

When you need faster results, increase your DWUs and pay for greater performance. When you need less compute power, decrease your DWUs and pay only for what you need. You might think about changing your DWUs in these scenarios:

- When you don't need to run queries, perhaps in the evenings or weekends, quiesce your queries. Then pause your compute resources to avoid paying for DWUs when you don't need them.

- When your system has low demand, consider reducing DWU to a small size. You can still access the data, but at a significant cost savings.

- When performing a heavy data loading or transformation operation, you may want to scale up so that your data is available more quickly.

To understand what your ideal DWU value is, try scaling up and down, and running a few queries after loading your data. Since scaling is quick, you can try a number of different levels of performance in an hour or less.  Do keep in mind, that SQL Data Warehouse is designed to process large amounts of data and to see its true capabilities for scaling, especially at the larger scales we offer, you'll want to use a large data set which approaches or exceeds 1 TB.


## Built on SQL Server

SQL Data Warehouse is based on the SQL Server relational database engine, and includes many of the features you expect from an enterprise data warehouse. If you already know T-SQL, it's easy to transfer your knowledge to SQL Data Warehouse. Whether you are advanced or just getting started, the examples across the documentation will help begin. Overall, you can think about the way that we've constructed the language elements of SQL Data Warehouse as follows:

- SQL Data Warehouse uses T-SQL syntax for many operations. It also supports a broad set of traditional SQL constructs, such as stored procedures, user-defined functions, table partitioning, indexes, and collations.

- SQL Data Warehouse also contains a number of newer SQL Server features, including: clustered **columnstore** indexes, PolyBase integration, and data auditing (complete with threat assessment).

- Certain T-SQL language elements that are less common for data warehousing workloads, or are newer to SQL Server, may not be currently available. For more information, see the [Migration documentation][].

With the Transact-SQL and feature commonality between SQL Server, SQL Data Warehouse, SQL Database, and Analytics Platform System, you can develop a solution that fits your data needs. You can decide where to keep your data, based on performance, security, and scale requirements, and then transfer data as necessary between different systems.

## Data protection

SQL Data Warehouse stores all data in Azure Premium locally redundant storage. Multiple synchronous copies of the data are maintained in the local data center to guarantee transparent data protection in case of localized failures. In addition, SQL Data Warehouse automatically backs up your active (un-paused) databases at regular intervals using Azure Storage Snapshots. To learn more about how backup and restore works, see the [Backup and restore overview][].

## Integrated with Microsoft tools

SQL Data Warehouse also integrates many of the tools that SQL Server users may be familiar with. These include:

**Traditional SQL Server tools:** SQL Data Warehouse is fully integrated with SQL Server Analysis Services, Integration Services, and Reporting Services.

**Cloud-based tools:** SQL Data Warehouse can be used alongside a number of new tools in Azure, including Data Factory, Stream Analytics, Machine Learning, and Power BI. For a more complete list, see [Integrated tools overview][].

**Third-party tools:** A large number of third-party tool providers have certified integration of their tools with SQL Data Warehouse. For a full list, see [SQL Data Warehouse solution partners][].

## Hybrid data sources scenarios

Using SQL Data Warehouse with PolyBase gives users unprecedented ability to move data across their ecosystem, unlocking the ability to set-up advanced hybrid scenarios with non-relational and on-premises data sources.

Polybase allows you to leverage your data from different sources by using familiar T-SQL commands. Polybase enables you to query non-relational data held in Azure Blob storage as though it is a regular table. Use Polybase to query non-relational data, or to import non-relational data into SQL Data Warehouse.

- PolyBase uses external tables to access non-relational data. The table definitions are stored in SQL Data Warehouse, and you can access them by using SQL and tools like you would access normal relational data.

- Polybase is agnostic in its integration. It exposes the same features and functionality to all the sources that it supports. The data read by Polybase can be in a variety of formats, including delimited files or ORC files.

- PolyBase can be used to access blob storage that is also being used as storage for an HD Insight cluster. This gives you access to the same data with relational and non-relational tools.

## Next steps

Now that you know a bit about SQL Data Warehouse, learn how to quickly [create a SQL Data Warehouse][] and [load sample data][]. If you are new to Azure, you may find the [Azure glossary][] helpful as you encounter new terminology. Or, take a look at some of these other SQL Data Warehouse Resources.  

- [Blogs]
- [Feature Requests]
- [Videos]
- [CAT Team Blogs]
- [Create Support Ticket]
- [MSDN Forum]
- [Stack Overflow Forum]
- [Twitter]


<!--Image references-->
[1]: ./media/sql-data-warehouse-overview-what-is/dwarchitecture.png

<!--Article references-->
[Create Support Ticket]: sql-data-warehouse-get-started-create-support-ticket.md
[load sample data]: sql-data-warehouse-load-sample-databases.md
[create a SQL Data Warehouse]: sql-data-warehouse-get-started-provision.md
[Migration documentation]: sql-data-warehouse-overview-migrate.md
[SQL Data Warehouse solution partners]: sql-data-warehouse-partner-business-intelligence.md
[Integrated tools overview]: sql-data-warehouse-overview-integrate.md
[Backup and restore overview]: sql-data-warehouse-restore-database-overview.md
[Azure glossary]: ../azure-glossary-cloud-terminology.md

<!--MSDN references-->

<!--Other Web references-->
[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[CAT Team Blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Feature Requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[MSDN Forum]: https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=AzureSQLDataWarehouse
[Stack Overflow Forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
