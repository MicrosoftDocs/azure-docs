---
title: Cheat sheet Azure SQL Data Warehouse | Microsoft Docs
description: Find links, best practices to build quickly your Azure SQL Data Warehouse solutions.
services: sql-data-warehouse
documentationcenter: NA
author: acomet
manager: jhubbard
editor: ''

ms.assetid: 51f1e444-9ef7-4e30-9a88-598946c45196
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: manage
ms.date: 12/14/2017
ms.author: acomet

---
# Cheat sheet for Azure SQL Data Warehouse
This page should help you design for the main use cases your data warehouse solution. This cheat sheet should be a great support in your journey to build a world-class data warehouse but we highly recommend learning more about each step in details. First, we recommend reading this great article about what SQL Data Warehouse **[is and is not]**.

Following is a sketch of the process you should follow when starting to design SQL Data Warehouse.

![Sketch]

## Queries and Operations across tables

It is truly important to know in advance the most important operations and queries taking place in your data warehouse. Your data warehouse architecture should be prioritized for those operations. Common examples of operations could be:
* Joining one or two fact tables with dimension tables, filtering this table for a period of time and append the results into a data mart
* Making large or small updates into your fact sales
* Appending only data to your tables

Knowing the type of operations helps you optimize the design of your tables.

## Data Migration

We recommend to first load your data **[into ADLS]** or Azure Blob Storage. Then, you should use Polybase to load your data into SQL Data Warehouse in a staging table. We recommend the following configuration:

| Design | Recommendation |
|:--- |:--- |
| Distribution | Round Robin |
| Indexing | Heap |
| Partitioning | None |
| Resource Class | largerc or xlargerc |

Learn more about **[data migration], [data loading]** with **[deeper guidance] on loading**. 

## Distributed or Replicated Tables

We recommend the following strategies depending on the table properties:

| Type | Great fit for | Watch out if...|
|:--- |:--- |:--- |
| Replicated | • Small dimension tables in a star schema with less than 2 GB of storage after compression (~5x compression) |•	Many write transactions on table (e.g.: insert, upsert, delete, update)<br></br>•	Change Data Warehouse Units (DWU) provisioning frequently<br></br>•	You only use 2-3 columns and your table has many columns<br></br>•	You index a replicated table |
| Round Robin (Default) | •	Temporary/Staging table<br></br> • No obvious joining key or good candidate column |•	Slow performance due to data movement |
| Hash | • Fact tables<br></br>•	Large dimension tables |• The distribution key cannot be updated |

**Tips:**
* Start with Round Robin but aspire for a hash distribution strategy to take advantage of a Massive Parallel Architecture
* Make sure that common hash keys have the same data format
* Don’t distribute on varchar format
* Dimension tables with common hash key to a fact table with frequent join operations could be hash distributed
* Use *[sys.dm_pdw_nodes_db_partition_stats]* to analyze any skewness in the data
* Use *[sys.dm_pdw_request_steps]* to analyze data movements behind queries, monitor the time broadcast and shuffle operations take. Helpful to review your distribution strategy.

Learn more about **[replicated tables] and [distributed tables]**.

## Indexing your table

Indexing is **great** for reading quickly tables. There is a unique set of technologies you can use based on your needs:

| Type | Great fit for | Watch out if...|
|:--- |:--- |:--- |
| Heap | • Staging/temporary table<br></br>• Small tables with small lookups |• Any lookup scans the full table |
| Clustered Index | • Up to 100-m rows table<br></br>• Large tables (more than 100-m rows) with only 1-2 columns are heavily used |•	Used on a replicated table<br></br>•	Complex queries involving multiple Join, Group By operations<br></br>•	Make updates on the indexed columns, it takes memory |
| Clustered Columnstore Index (CCI) (Default) | •	Large tables (more than 100-m rows) | •	Used on a replicated table<br></br>•	You make massive update operations on your table<br></br>•	Over-partition your table: row groups do not span across different distribution nodes and partitions |

**Tips:**
* On top of a Clustered Index, you might want to add Nonclustered Index to a column heavily used for filter. 
* Be careful how you manage the memory on a table with CCI. When you load data, you want the user (or the query) to benefit from a large resource class. You make sure to avoid trimming and creating many small compressed row groups
* Optimized for Compute Tier rocks with CCI
* For CCI, slow performance can happen due to poor compression of your row groups, you might want to rebuild or reorganize your CCI. You want at least 100k rows per compressed Row Groups. The ideal is 1-m rows in a row group.
* Based on the incremental load frequency and size, you want to automate when you reorganize or rebuild your indexes. Spring cleaning is always helpful.
* Be strategic when you want to trim a row group: how large are the open row groups? How much data do you expect to load in the coming days?

Learn more about **[indexes]**.

## Partitioning
You might partition your table when you have a large fact tables (>1B row table). 99% of the cases, the partition key should be based on date. Be careful to not over-partition, especially when you have a Clustered Columnstore Index.
With staging tables that require ETL, you can benefit from partitioning. It facilitates data lifecycle management.
Be careful not to overpartition your data, especially on a Clustered Columnstore Index.

Learn more about **[partitions]**.

## Incremental load

First, you should make sure that you allocate larger resource classes to loading your data. We recommend using Polybase and ADF V2 for automating your ETL pipelines into SQL DW.

For a large batch of updates in your historical data, we recommend deleting first the concerned data. Then you can make a bulk insert of the new data. This 2-step approach is more efficient.

## Maintain statistics
Auto-statistics are going to be Generally Available soon. Until then, SQL Data Warehouse requires manual maintenance of statistics. It's important to update statistics as **significant** changes happen to your data. This helps optimize your query plans. If you find it takes too long to maintain all of your statistics, you may want to be more selective about which columns have statistics. You can also define the frequency of the updates. For example, you might want to update date columns, where new values may be added, daily. You gain the most benefit by having statistics on columns involved in joins, columns used in the WHERE clause and columns found in GROUP BY.

Learn more about **[statistics]**.

## Resource class
SQL Data Warehouse uses resource groups as a way to allocate memory to queries. If you need more memory to improve query or loading speed, you should allocate higher resource classes. On the flip side, using larger resource classes impacts concurrency. You want to take it into consideration before moving all of your users to a large resource class.

If you notice that queries take too long, check that your users do not run in large resource classes. Large resource classes consume many concurrency slots. They can cause other queries to queue up.

Finally if you use the Compute Optimized Tier, each resource class gets 2.5x more memory than on the Elastic Optimized Tier.

Learn more how to work with **[resource classes and concurrency]**.

## Lower your cost
A key feature of SQL Data Warehouse is the ability to pause when you are not using it, which stops the billing of compute resources. Another key feature is the ability to scale resources. Pausing and Scaling can be done via the Azure portal or through PowerShell commands.

Auto-scale now at the time you want with Azure Functions:

<a href="https://ms.portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2Fsql-data-warehouse-samples%2Fmaster%2Farm-templates%2FsqlDwTimerScaler%2Fazuredeploy.json" target="_blank">
<img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png"/>
</a>

## Optimize you architecture for performance

We recommend considering SQL database and Azure Analysis Services in a Hub and Spokes architecture. That solution can provide workload isolation between different user groups while also leveraging some advanced security features from SLQ DB and Azure Analysis Services. This is also a way to provide limitless concurrency to your users.

Learn more about **[typical architectures leveraging SQL DW]**.

Deploy in a click your spokes in SQL DB databases from SQL DW:

<a href="https://ms.portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2Fsql-data-warehouse-samples%2Fmaster%2Farm-templates%2FsqlDwSpokeDbTemplate%2Fazuredeploy.json" target="_blank">
<img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png"/>
</a>


<!--Image references-->
[Sketch]:media/sql-data-warehouse-cheat-sheet/picture-flow.png

<!--Article references-->
[data loading]:./design-elt-data-loading.md
[deeper guidance]: ./guidance-for-loading-data.md
[indexes]:./sql-data-warehouse-tables-index.md
[partitions]:./sql-data-warehouse-tables-partition.md
[statistics]:./sql-data-warehouse-tables-statistics.md
[resource classes and concurrency]:./sql-data-warehouse-develop-concurrency.md

<!--MSDN references-->


<!--Other Web references-->
[typical architectures leveraging SQL DW]: https://blogs.msdn.microsoft.com/sqlcat/2017/09/05/common-isv-application-patterns-using-azure-sql-data-warehouse/
[is and is not]:https://blogs.msdn.microsoft.com/sqlcat/2017/09/05/azure-sql-data-warehouse-workload-patterns-and-anti-patterns/
[data migration]:https://blogs.msdn.microsoft.com/sqlcat/2016/08/18/migrating-data-to-azure-sql-data-warehouse-in-practice/
[replicated tables]:https://docs.microsoft.com/en-us/azure/sql-data-warehouse/design-guidance-for-replicated-tables
[distributed tables]:https://docs.microsoft.com/en-us/azure/sql-data-warehouse/sql-data-warehouse-tables-distribute
[into ADLS]: https://docs.microsoft.com/en-us/azure/data-factory/connector-azure-data-lake-store
[sys.dm_pdw_nodes_db_partition_stats]: https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-db-partition-stats-transact-sql
[sys.dm_pdw_request_steps]:https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql
