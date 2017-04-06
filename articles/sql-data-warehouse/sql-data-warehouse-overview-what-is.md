---
title: What is Azure SQL Data Warehouse? | Microsoft Docs
description: Enterprise-class distributed database capable of processing petabyte volumes of relational and non-relational data. It is the industry's first cloud data warehouse with grow, shrink, and pause in seconds.
services: sql-data-warehouse
documentationcenter: NA
author: jrowlandjones
manager: bjhubbard
editor: ''

ms.assetid: 4006c201-ec71-4982-b8ba-24bba879d7bb
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: overview
ms.date: 2/28/2017
ms.author: jrj;mausher;kevin;barbkess;elbutter

---
# What is Azure SQL Data Warehouse?
Azure SQL Data Warehouse is a massively parallel processing (MPP) cloud-based, scale-out, relational database capable of processing massive volumes of data. 

SQL Data Warehouse:

* Combines the SQL Server relational database with Azure cloud scale-out capabilities. 
* Decouples storage from compute.
* Enables increasing, decreasing, pausing, or resuming compute. 
* Integrates across the Azure platform.
* Utilizes SQL Server Transact-SQL (T-SQL) and tools.
* Complies with various legal and business security requirements such as SOC and ISO.

This article describes the key features of SQL Data Warehouse.

## Massively parallel processing architecture
SQL Data Warehouse is a massively parallel processing (MPP) distributed database system. Behind the scenes, SQL Data Warehouse spreads your data across many shared-nothing storage and processing units. 
The data is stored in a Premium locally redundant storage layer on top of which dynamically linked Compute nodes execute queries. SQL Data Warehouse takes a "divide and conquer" approach to running loads and complex queries. 
Requests are received by a Control node, optimized for distribution, and then passed to Compute nodes to do their work in parallel.

With decoupled storage and compute, SQL Data Warehouse can:

* Grow or shrink storage size independent of compute.
* Grow or shrink compute power without moving data.
* Pause compute capacity while leaving data intact, only paying for storage.
* Resume compute capacity during operational hours.

The following diagram shows the architecture in more detail.

![SQL Data Warehouse Architecture][1]

**Control node:** The Control node manages and optimizes queries. It is the front end that interacts with all applications and connections. In SQL Data Warehouse, the Control node is powered by SQL Database, and connecting to it looks and feels the same. Under the surface, the Control node coordinates all the data movement and computation required to run parallel queries on your distributed data. When you submit a T-SQL query to SQL Data Warehouse, the Control node transforms it into separate queries that run on each Compute node in parallel.

**Compute nodes:** The Compute nodes serve as the power behind SQL Data Warehouse. They are SQL Databases that store your data and process your query. When you add data, SQL Data Warehouse distributes the rows to your Compute nodes. The Compute nodes are the workers that run the parallel queries on your data. After processing, they pass the results back to the Control node. To finish the query, the Control node aggregates the results and returns the final result.

**Storage:** Your data is stored in Azure Blob storage. When Compute nodes interact with your data, they write and read directly to and from blob storage. Since Azure storage expands transparently and vastly, SQL Data Warehouse can do the same. Since compute and storage are independent, SQL Data Warehouse can automatically scale storage separately from scaling compute, and vice-versa. Azure Blob storage is also fully fault tolerant, and streamlines the backup and restore process.

**Data Movement Service:** Data Movement Service (DMS) moves data between the nodes. DMS gives the Compute nodes access to data they need for joins and aggregations. DMS is not an Azure service. It is a Windows service that runs alongside SQL Database on all the nodes. DMS is a background process that cannot be interacted with directly. However, you can look at query plans to see when DMS operations occur, since data movement is necessary to run each query in parallel.

## Optimized for data warehouse workloads
The MPP approach is aided by several data warehousing specific performance optimizations, including:

* A distributed query optimizer and set of complex statistics across all data. Using information on data size and distribution, the service is able to optimize queries by assessing the cost of specific distributed query operations.
* Advanced algorithms and techniques integrated into the data movement process to efficiently move data among computing resources as necessary to perform the query. These data movement operations are built in, and all optimizations to the Data Movement Service happen automatically.
* Clustered **columnstore** indexes by default. By using column-based storage, SQL Data Warehouse gets on average 5x compression gains over traditional row-oriented storage, and up to 10x or more query performance gains. Analytics queries that need to scan a large number of rows work better with columnstore indexes.


## Predictable and scalable performance With Data Warehouse Units
SQL Data Warehouse is built with similar technologies as SQL Database, which means that users can expect consistent and predictable performance for analytical queries. Users should expect to see performance scale linearly as they add or subtract Compute nodes. Allocation of resources to your SQL Data Warehouse is measured in Data Warehouse Units (DWUs). DWUs are a measure of underlying resources like CPU, memory, IOPS, which are allocated to your SQL Data Warehouse. Increasing the number of DWUs increases resources and performance. Specifically, DWUs help ensure that:

* You are able to scale your data warehouse without worrying about the underlying hardware or software.
* You can predict performance improvement for a DWU level before changing the compute of your data warehouse.
* The underlying hardware and software of your instance can change or move without affecting your workload performance.
* Microsoft can improve the underlying architecture of the service without affecting the performance of your workload.
* Microsoft can rapidly improve performance in SQL Data Warehouse, in a way that is scalable and evenly effects the system.

Data Warehouse Units provide a measure of three metrics that are highly correlated with data warehousing workload performance. The following key workload metrics scale linearly with the DWUs.

**Scan/Aggregation:** A standard data warehousing query that scans a large number of rows and then performs a complex aggregation. This is an I/O and CPU intensive operation.

**Load:** The ability to ingest data into the service. Loads are best performed with PolyBase from Azure Storage Blobs or Azure Data Lake. This metric is designed to stress network and CPU aspects of the service.

**Create Table As Select (CTAS):** CTAS measures the ability to copy a table. This involves reading data from storage, distributing it across the nodes of the appliance and writing to storage again. It is a CPU, IO, and network intensive operation.

## Built on SQL Server
SQL Data Warehouse is based on the SQL Server relational database engine, and includes many of the features you expect from an enterprise data warehouse. If you already know T-SQL, it's easy to transfer your knowledge to SQL Data Warehouse. Whether you are advanced or just getting started, the examples across the documentation will help begin. Overall, you can think about the way that we've constructed the language elements of SQL Data Warehouse as follows:

* SQL Data Warehouse uses T-SQL syntax for many operations. It also supports a broad set of traditional SQL constructs, such as stored procedures, user-defined functions, table partitioning, indexes, and collations.
* SQL Data Warehouse also contains various newer SQL Server features, including: clustered **columnstore** indexes, PolyBase integration, and data auditing (complete with threat assessment).
* Certain T-SQL language elements that are less common for data warehousing workloads, or are newer to SQL Server, may not be currently available. For more information, see the [Migration documentation][Migration documentation].

With the Transact-SQL and feature commonality between SQL Server, SQL Data Warehouse, SQL Database, and Analytics Platform System, you can develop a solution that fits your data needs. You can decide where to keep your data, based on performance, security, and scale requirements, and then transfer data as necessary between different systems.

## Data protection
SQL Data Warehouse stores all data in Azure Premium locally redundant storage. Multiple synchronous copies of the data are maintained in the local data center to guarantee transparent data protection against localized failures. In addition, SQL Data Warehouse automatically backs up your active (unpaused) databases at regular intervals using Azure Storage Snapshots. To learn more about how backup and restore works, see the [Backup and restore overview][Backup and restore overview].

## Integrated with Microsoft tools
SQL Data Warehouse also integrates many of the tools that SQL Server users may be familiar with. These tools include:

**Traditional SQL Server tools:** SQL Data Warehouse is fully integrated with SQL Server Analysis Services, Integration Services, and Reporting Services.

**Cloud-based tools:** SQL Data Warehouse can be integarated with various services in Azure, including Data Factory, Stream Analytics, Machine Learning, and Power BI. For a more complete list, see [Integrated tools overview][Integrated tools overview].

**Third-party tools:** Many third-party tool providers have certified integration of their tools with SQL Data Warehouse. For a full list, see [SQL Data Warehouse solution partners][SQL Data Warehouse solution partners].

## Hybrid data sources scenarios
Polybase allows you to leverage your data from different sources by using familiar T-SQL commands. Polybase enables you to query non-relational data held in Azure Blob storage as though it is a regular table. Use Polybase to query non-relational data, or to import non-relational data into SQL Data Warehouse.

* PolyBase uses external tables to access non-relational data. The table definitions are stored in SQL Data Warehouse, and you can access them by using SQL and tools like you would access normal relational data.
* Polybase is agnostic in its integration. It exposes the same features and functionality to all the sources that it supports. The data read by Polybase can be in various formats, including delimited files or ORC files.
* PolyBase can be used to access blob storage that is also being used as storage for an HDInsight cluster. This gives you access to the same data with relational and non-relational tools.

## SLA
SQL Data Warehouse offers a product level service level agreement (SLA) as part of Microsoft Online Services SLA. For more information, visit [SLA for SQL Data Warehouse][SLA for SQL Data Warehouse]. For SLA information about all other products you can visit the [Service Level Agreements] Azure page or download them on the [Volume Licensing][Volume Licensing] page. 

## Next steps
Now that you know a bit about SQL Data Warehouse, learn how to quickly [create a SQL Data Warehouse][create a SQL Data Warehouse] and [load sample data][load sample data]. If you are new to Azure, you may find the [Azure glossary][Azure glossary] helpful as you encounter new terminology. Or look at some of these other SQL Data Warehouse Resources.  

* [Customer success stories]
* [Blogs]
* [Feature requests]
* [Videos]
* [Customer Advisory Team blogs]
* [Create support ticket]
* [MSDN forum]
* [Stack Overflow forum]
* [Twitter]

<!--Image references-->
[1]: ./media/sql-data-warehouse-overview-what-is/dwarchitecture.png

<!--Article references-->
[Create support ticket]: ./sql-data-warehouse-get-started-create-support-ticket.md
[load sample data]: ./sql-data-warehouse-load-sample-databases.md
[create a SQL Data Warehouse]: ./sql-data-warehouse-get-started-provision.md
[Migration documentation]: ./sql-data-warehouse-overview-migrate.md
[SQL Data Warehouse solution partners]: ./sql-data-warehouse-partner-business-intelligence.md
[Integrated tools overview]: ./sql-data-warehouse-overview-integrate.md
[Backup and restore overview]: ./sql-data-warehouse-restore-database-overview.md
[Azure glossary]: ../azure-glossary-cloud-terminology.md

<!--MSDN references-->

<!--Other Web references-->
[Customer success stories]: https://customers.microsoft.com/search?sq=&ff=story_products_services%26%3EAzure%2FAzure%2FAzure%20SQL%20Data%20Warehouse%26%26story_product_families%26%3EAzure%2FAzure%26%26story_product_categories%26%3EAzure&p=0
[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[Customer Advisory Team blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Feature requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[MSDN forum]: https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=AzureSQLDataWarehouse
[Stack Overflow forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
[SLA for SQL Data Warehouse]: https://azure.microsoft.com/en-us/support/legal/sla/sql-data-warehouse/v1_0/
[Volume Licensing]: http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=37
[Service Level Agreements]: https://azure.microsoft.com/en-us/support/legal/sla/
