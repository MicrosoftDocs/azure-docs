---
title: Azure Stream Analytics output to Azure SQL Database
description: Learn about outputting data to SQL Azure from Azure Stream Analytics and achieve higher write throughput rates.
author: chetanmsft
ms.author: chetang
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 03/18/2019
---
# Azure Stream Analytics output to Azure SQL Database

This article discusses tips to achieve better write throughput performance when you're loading data into Azure SQL Database using Azure Stream Analytics.

SQL output in Azure Stream Analytics supports writing in parallel as an option. This option allows for [fully parallel](stream-analytics-parallelization.md#embarrassingly-parallel-jobs) job topologies, where multiple output partitions are writing to the destination table in parallel. Enabling this option in Azure Stream Analytics however may not be sufficient to achieve higher throughputs, as it depends significantly on your database configuration and table schema. The choice of indexes, clustering key, index fill factor, and compression have an impact on the time to load tables. For more information about how to optimize your database to improve query and load performance based on internal benchmarks, see [SQL database performance guidance](../azure-sql/database/performance-guidance.md). Ordering of writes is not guaranteed when writing in parallel to SQL Database.

Here are some configurations within each service that can help improve overall throughput of your solution.

## Azure Stream Analytics

- **Inherit Partitioning** – This SQL output configuration option enables inheriting the partitioning scheme of your previous query step or input. With this enabled, writing to a disk-based table and having a [fully parallel](stream-analytics-parallelization.md#embarrassingly-parallel-jobs) topology for your job, expect to see better throughputs. This partitioning already automatically happens for many other [outputs](stream-analytics-parallelization.md#partitions-in-inputs-and-outputs). Table locking (TABLOCK) is also disabled for bulk inserts made with this option.

> [!NOTE] 
> When there are more than 8 input partitions, inheriting the input partitioning scheme might not be an appropriate choice. This upper limit was observed on a table with a single identity column and a clustered index. In this case, consider using [INTO](https://docs.microsoft.com/stream-analytics-query/into-azure-stream-analytics#into-shard-count) 8 in your query, to explicitly specify the number of output writers. Based on your schema and choice of indexes, your observations may vary.

- **Batch Size** - SQL output configuration allows you to specify the maximum batch size in an Azure Stream Analytics SQL output based on the nature of your destination table/workload. Batch size is the maximum number of records that sent with every bulk insert transaction. In clustered columnstore indexes, batch sizes around [100K](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-data-loading-guidance) allow for more parallelization, minimal logging, and locking optimizations. In disk-based tables, 10K (default) or lower may be optimal for your solution, as higher batch sizes may trigger lock escalation during bulk inserts.

- **Input Message Tuning** – If you've optimized using inherit partitioning and batch size, increasing the number of input events per message per partition helps further pushing up your write throughput. Input message tuning allows batch sizes within Azure Stream Analytics to be up to the specified Batch Size, thereby improving throughput. This can be achieved by using [compression](stream-analytics-define-inputs.md) or increasing input message sizes in EventHub or Blob.

## SQL Azure

- **Partitioned Table and Indexes** – Using a [partitioned](https://docs.microsoft.com/sql/relational-databases/partitions/partitioned-tables-and-indexes?view=sql-server-2017) SQL table and partitioned indexes on the table with the same column as your partition key (for example, PartitionId) can significantly reduce contentions among partitions during writes. For a partitioned table, you'll need to create a [partition function](https://docs.microsoft.com/sql/t-sql/statements/create-partition-function-transact-sql?view=sql-server-2017) and a [partition scheme](https://docs.microsoft.com/sql/t-sql/statements/create-partition-scheme-transact-sql?view=sql-server-2017) on the PRIMARY filegroup. This will also increase availability of existing data while new data is being loaded. Log IO limit may be hit based on number of partitions, which can be increased by upgrading the SKU.

- **Avoid unique key violations** – If you get [multiple key violation warning messages](stream-analytics-troubleshoot-output.md#key-violation-warning-with-azure-sql-database-output) in the Azure Stream Analytics Activity Log, ensure your job isn't impacted by unique constraint violations which are likely to happen during recovery cases. This can be avoided by setting the [IGNORE\_DUP\_KEY](stream-analytics-troubleshoot-output.md#key-violation-warning-with-azure-sql-database-output) option on your indexes.

## Azure Data Factory and In-Memory Tables

- **In-Memory Table as temp table** – [In-Memory tables](/sql/relational-databases/in-memory-oltp/in-memory-oltp-in-memory-optimization) allow for very high-speed data loads but data needs to fit in memory. Benchmarks show bulk loading from an in-memory table to a disk-based table is about 10 times faster than directly bulk inserting using a single writer into the disk-based table with an identity column and a clustered index. To leverage this bulk insert performance, set up a [copy job using Azure Data Factory](../data-factory/connector-azure-sql-database.md) that copies data from the in-memory table to the disk-based table.

## Avoiding Performance Pitfalls
Bulk inserting data is much faster than loading data with single inserts because the repeated overhead of transferring the data, parsing the insert statement, running the statement, and issuing a transaction record is avoided. Instead, a more efficient path is used into the storage engine to stream the data. The setup cost of this path is however much higher than a single insert statement in a disk-based table. The break-even point is typically around 100 rows, beyond which bulk loading is almost always more efficient. 

If the incoming events rate is low, it can easily create batch sizes lower than 100 rows, which makes bulk insert inefficient and uses too much disk space. To work around this limitation, you can do one of these actions:
* Create an INSTEAD OF [trigger](/sql/t-sql/statements/create-trigger-transact-sql) to use simple insert for every row.
* Use an In-Memory temp table as described in the previous section.

Another such scenario occurs when writing into a non-clustered columnstore index (NCCI), where smaller bulk inserts can create too many segments, that can crash the index. In this case, the recommendation is to use a Clustered Columnstore index instead.

## Summary

In summary, with the partitioned output feature in Azure Stream Analytics for SQL output, aligned parallelization of your job with a partitioned table in SQL Azure should give you significant throughput improvements. Leveraging Azure Data Factory for orchestrating data movement from an In-Memory table into Disk-based tables can give order of magnitude throughput gains. If feasible, improving message density can also be a major factor in improving overall throughput.
