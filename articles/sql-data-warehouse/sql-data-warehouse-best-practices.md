<properties
   pageTitle="SQL Data Warehouse Best Practices | Microsoft Azure"
   description="Best practices for Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyam"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="04/15/2016"
   ms.author="sonyama;barbkess"/>

# SQL Data Warehouse Best Practices

## INSERT Statements
Group INSERT statements into Batches Instead of Doing Singleton INSERTs

## Pause and Change SLO
Drain Transactions Before Pause or Change SLO
When you pause or change the size of your SQL Data Warehouse, the database instance is stopped.  This means that all inflight queries will be cancelled.  Cancelling a simple SELECT query is a quick operation and has almost no impact to pausing or scaling.  However, queries which modify your data or the structure of the data in your database are considered transactional queries.  Transactional queries must either complete in their entirety or be undone.  When transactional queries are cancelled, then any changes made by the query must be rolled back.  Rolling back the work completed by a transactional query can take as long, or even longer, than the original query.  For example, if a query which is inserting rows is cancelled after running for 1 hour, it could take the system 1 hour to roll back this transaction and remove the rows which were added.  This has two negative consequences, (1) if you cancel a transactional query you will need to wait for 

## Loads
PolyBase is the Fastest Way to Load or Export Data
Polybase is the fastest way to load data.  Much faster than SSIS or BCP

## Concurrency
Understand How Resource Groups Impact Concurrency and Query Performance

## Statistics
Manually Create and Update Statistics until there is Auto Statistics

## Cost
Reduce Cost with Pause and Scaling

## Query Performance
Hash Distribute Large Tables Instead of Using Default Round Robin Distribution
Understand How Resource Groups Impact Query Performance
Optimize Performance of Clustered Columnstore Tables with a High Quality Segment Size
Understand Clustered ColumnStore Partition should have > 60m rows
Cluster columnstore tables only show benefit where there is enough rows to compress.
Partitioning implications
Memory considerations for building CCI

## Data Management
Use Partitioning for Data Management
Use Heap Table for Transient Data

## Monitoring
Learn How to Monitor Your Queries

- [performance and scale][]
- [concurrency model][]
- [designing tables][]
- [choose a hash distribution key for your table][]
- [statistics to improve performance][]


## Next Steps

<!--Image references-->

<!--Article references-->
[performance and scale]: sql-data-warehouse-performance-scale.md
[concurrency model]: sql-data-warehouse-develop-concurrency.md
[designing tables]: sql-data-warehouse-develop-table-design.md
[choose a hash distribution key for your table]: sql-data-warehouse-develop-hash-distribution-key.md
[statistics to improve performance]: sql-data-warehouse-develop-statistics.md
[development overview]: sql-data-warehouse-overview-develop.md
[create a support ticket]:sql-data-warehouse-get-started-create-support-ticket.md

<!--MSDN references-->

<!--Other Web references-->


