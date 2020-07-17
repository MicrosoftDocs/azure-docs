---
title: Azure SQL Database output from Azure Stream Analytics
description: This article describes Azure SQL Database as output for Azure Stream Analytics.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/8/2020
---

# Azure SQL Database output from Azure Stream Analytics

You can use [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) as an output for data that's relational in nature or for applications that depend on content being hosted in a relational database. Azure Stream Analytics jobs write to an existing table in SQL Database. The table schema must exactly match the fields and their types in your job's output. You can also specify [Azure SQL Data Warehouse](https://azure.microsoft.com/documentation/services/sql-data-warehouse/) as an output via the SQL Database output option. To learn about ways to improve write throughput, see the [Stream Analytics with Azure SQL Database as output](stream-analytics-sql-output-perf.md) article.

You can also use [Azure SQL Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance) as an output. You have to [configure public endpoint in SQL Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-public-endpoint-configure) and then manually configure the following settings in Azure Stream Analytics. Azure virtual machine running SQL Server with a database attached is also supported by manually configuring the settings below.

The following table lists the property names and their description for creating a SQL Database output.

| Property name | Description |
| --- | --- |
| Output alias |A friendly name used in queries to direct the query output to this database. |
| Database | The name of the database where you're sending your output. |
| Server name | The logical SQL server name or managed instance name. For SQL Managed Instance, it is required to specify the port 3342. For example, *sampleserver.public.database.windows.net,3342* |
| Username | The username that has write access to the database. Stream Analytics supports only SQL authentication. |
| Password | The password to connect to the database. |
| Table | The table name where the output is written. The table name is case-sensitive. The schema of this table should exactly match the number of fields and their types that your job output generates. |
|Inherit partition scheme| An option for inheriting the partitioning scheme of your previous query step, to enable fully parallel topology with multiple writers to the table. For more information, see [Azure Stream Analytics output to Azure SQL Database](stream-analytics-sql-output-perf.md).|
|Max batch count| The recommended upper limit on the number of records sent with every bulk insert transaction.|

There are two adapters that enable output from Azure Stream Analytics to Azure Synapse Analytics (formerly SQL Data Warehouse): SQL Database and Azure Synapse. We recommend that you choose the Azure Synapse Analytics adapter instead of the SQL Database adapter if any of the following conditions hold true:

* **Throughput**: If your expected throughput now or in the future is greater than 10MB/sec, use the Azure Synapse output option for better performance.

* **Input Partitions**: If you have eight or more input partitions, use the Azure Synapse output option for better scale-out.



## Partitioning

Partitioning needs to enabled and is based on the PARTITION BY clause in the query. When Inherit Partitioning option is enabled, follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md). To learn more about achieving better write throughput performance when you're loading data into Azure SQL Database, see [Azure Stream Analytics output to Azure SQL Database](stream-analytics-sql-output-perf.md).

## Output batch size 

| Azure SQL Database | Configurable using Max batch count. 10,000 maximum and 100 minimum rows per single bulk insert by default.<br />See [Azure SQL limits](../sql-database/sql-database-resource-limits.md). |  Every batch is initially bulk inserted with maximum batch count. Batch is split in half (until minimum batch count) based on retryable errors from SQL. |



This article discusses tips to achieve better write throughput performance when you're loading data into Azure SQL Database using Azure Stream Analytics.

SQL output in Azure Stream Analytics supports writing in parallel as an option. This option allows for [fully parallel](stream-analytics-parallelization.md#embarrassingly-parallel-jobs) job topologies, where multiple output partitions are writing to the destination table in parallel. Enabling this option in Azure Stream Analytics however may not be sufficient to achieve higher throughputs, as it depends significantly on your database configuration and table schema. The choice of indexes, clustering key, index fill factor, and compression have an impact on the time to load tables. For more information about how to optimize your database to improve query and load performance based on internal benchmarks, see [SQL Database performance guidance](../azure-sql/database/performance-guidance.md). Ordering of writes is not guaranteed when writing in parallel to SQL Database.

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
