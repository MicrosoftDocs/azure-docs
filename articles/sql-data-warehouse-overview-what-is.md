<properties
   pageTitle="article-title"
   description="Article description that will be displayed on landing pages and in some search results"
   services="service-name"
   documentationCenter="dev-center-name"
   authors="jrowlandjones"
   manager="manager-alias"
   editor="barbkess"/>

<tags
   ms.service="required"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="required"
   ms.date="mm/dd/yyyy"
   ms.author="JRJ@BigBangData.co.uk"/>

# What is SQL Data Warehouse?

SQL Data Warehouse is an enterprise-class distributed database in the Azure Cloud capable of processing up to petabyte volumes of relational and non-relational data. It is the industry's first cloud data warehouse with grow, shrink, and pause in seconds. 




## Pay for what you need, when you need it
With Azure SQL data warehouse, data is stored in cloud-scale storage, and compute is scaled independently, allowing you to pay for query performance as you need it. You can now dynamically deploy, grow, shrink, and even pause compute. Take full advantage of storage at cloud scale, and apply query compute based on seasonal needs. When paused, you only pay for storage.

> [AZURE.NOTE] Data Warehouse Units (DWUs) are the unit of scale for compute resources in SQL Data Warehouse. 

- When you need faster results, you can increase your DWUs and pay for the greater number DWUs; when you don't need that much compute power, you can decrease your DWUs and go back to paying for the smaller amount of DWUs. The size of DWUs is proportional; if you double the number of **DWUs** associated to your data warehouse it doubles the compute resources. 
- When you don't need to run queries, perhaps in the evenings or weekends, you can pause compute resources to cancel all running queries and remove all DWUs allocated to your data warehouse. Your data storage stays intact, but there is no charge for compute resources. When you need to start running queries, perhaps on Monday morning, you can resume your compute resources. 

## Hybrid cloud with enterprise-class SQL Server experience
SQL Data Warehouse is based on SQL Server’s proven relational database engine and includes the features you expect from an enterprise data warehouse including stored procedures, user-defined functions, table partitioning, indexes, and collations. 

- SQL Data Warehouse uses SQL Server's Transact-SQL, columnstore index, and PolyBase technologies along with Analytic Platform System's massively parallel processing (MPP) architecture to create this unique, integrated, Platform-as-a-Service (PaaS) data warehouse experience.  

- With the Transact-SQL and feature commonality between SQL Server, SQL Data Warehouse, SQL Database, and Analytics Platform System, you can develop a solution that fits your data needs. You can decide where to keep your data, based on performance, security, and scale requirements, and then transfer data as necessary between on-premises and Cloud.


## Massively parallel processing for breakthrough performance
SQL Data Warehouse uses Microsoft’s massive parallel processing (MPP) architecture, along with an advanced cost-based query optimizer, and SQL Server's columnstore index technology to deliver breakthrough performance. 

> [AZURE.NOTE] MPP is a divide and conquer approach to solving large data problems by using parallel computing. Data is divided and distributed across many computing resources, and each computing resource operates on its portion of the data in parallel.

- Much of the secret sauce is in Microsoft's distributed query technology. The advanced query optimizer that makes cost-based decisions to choose the best distributed query plans. It also has a data movement service (DMS) that efficiently moves data among the computing resources to ensure accurate and efficient query results.
- Columnstore indexes are key to achieving fast query performance on data warehouse queries. By using column-based storage, columnstore indexes get up to 5x compression gains over traditional row-oriented storage, and up to 10x query performance gains. Data warehouse queries work great on columnstore indexes because they often scan the entire table or entire partition of a table. In contrast, OLTP queries work great on binary tree indexes because they seek to specific rows in the table.

## Query across relational and non-relational data with PolyBase
Polybase enables you to query non-relational data held in Azure blob storage or in Hadoop's File System (HDFS) as though it is a regular table. Use Polybase to query non-relational data or to import non-relational data into SQL Data Warehouse.

- Polybase is agnostic in it's integration. It exposes the same features and functionality to all the distributions of Hadoop that it supports. The data read by Polybase can be in a variety of formats, including delimited files or ORC files.
- Polybase is easy to use and allows you to leverage your data from different sources by using the same T-SQL commands you're already familiar with. There is no need to learn HiveQL or other languages to benefit from Hadoop.


## Secure infrastructure deployment in minutes with no maintenance costs
SQL Data Warehouse easily deploys in seconds. This service is a fully managed offering which removes the hassle of spend time on software patching and maintenance. SQL Data Warehouse has built-in backups to support self-service restore; the service automatically backs up your data to Azure Storage as it snapshots database restore points.


<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Link references--In actual articles, you only need a single period before the slash.-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
