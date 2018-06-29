# Azure Stream Analytics output to Azure SQL Database

This article discusses tips to achieve better write throughput performance when you're loading data into SQL Azure Database using Azure Stream Analytics.

With recent changes, SQL output in Azure Stream Analytics now supports writing in parallel as an option. This option allows for [fully parallel](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-parallelization#embarrassingly-parallel-jobs) job topologies, where multiple output partitions are writing to the destination table in parallel. Enabling this option in Azure Stream Analytics however may not be sufficient to achieve higher throughputs, as it depends significantly on your SQL Azure database configuration and table schema. The choice of indexes, clustering key, index fill factor and compression have an impact on the time to load tables. [This article](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-performance-guidance) discusses in detail about how to optimize your SQL Azure database to improve query and load performance based on internal benchmarks.

Here are some configurations within each service that can help improve overall throughput of your solution.

## Azure Stream Analytics

**Inherit Partitioning** – This new SQL Output configuration option enables inheriting the partitioning scheme of your previous query step or input. With this enabled, writing to a disk based table and having a [fully parallel](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-parallelization#embarrassingly-parallel-jobs) topology for your job, expect to see better throughputs. Note that this option already automatically happens for many other [outputs](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-parallelization#partitions-in-sources-and-sinks). Table locking (TABLOCK) is also disabled for bulk inserts made with this option.

*Observed Limitations* - When there are more than 8 input partitions, inheriting the input partitioning scheme, might not be an appropriate choice. This upper limit was observed on a table with a single identity column and a clustered index. Based on your schema and choice of indexes your observations may vary.

**Batch Size** – This new SQL Output configuration allows to specify the maximum batch size in Azure Stream Analytics SQL Output, based on the nature of your destination table/workload. It is the maximum number of records that will be sent with every bulk insert transaction. In clustered columnstore indexes batch sizes around [100K](https://docs.microsoft.com/en-us/sql/relational-databases/indexes/columnstore-indexes-data-loading-guidance) allow for more parallelization, minimal logging and locking optimizations. In Disk Based tables, 10K (default) or lower may be optimal for your solution, as higher batch sizes may trigger lock escalation during bulk inserts.

**Input Message Tuning** – If you've optimized on other parameters discussed, increasing the number input events per message per partition helps further pushing up your write throughput. It allows batch sizes within Azure Stream Analytics to be up to specified Batch Size, thereby improving throughput. This can be achieved by using [compression](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-define-inputs) or larger message sizes available in Premium EventHub SKU.

## SQL Azure

**Partitioned Table and Indexes** – Having [Partitioned](https://docs.microsoft.com/en-us/sql/relational-databases/partitions/partitioned-tables-and-indexes?view=sql-server-2017) Table and an aligned index with the same partition key (e.g. PartitionId) as the Azure Stream Analytics job can significantly reduce contentions among partitions during write and increase availability of existing data while new data is being loaded. Log IO limit may be hit based on number of partitions which can be increased by upgrading the SKU.

**Avoid unique key violations** – If getting multiple key violation warning messages in the Azure Stream Analytics Activity Log, [ensure](https://docs.microsoft.com/en-nz/azure/stream-analytics/stream-analytics-common-troubleshooting-issues#handle-duplicate-records-in-azure-sql-database-output) your job doesn't get impacted by unique constraint violations which is quite likely to happen during recovery cases. This can be avoided by setting [IGNORE\_DUP\_KEY](https://docs.microsoft.com/en-nz/azure/stream-analytics/stream-analytics-common-troubleshooting-issues#handle-duplicate-records-in-azure-sql-database-output) option on your indexes.

## Azure Data Factory and In-Memory Tables

**In Memory Table as temp table** – [In Memory tables](https://docs.microsoft.com/en-us/sql/relational-databases/in-memory-oltp/in-memory-oltp-in-memory-optimization) allow for very high speed data loads but data needs to fit in memory. Our benchmarks show bulk loading from an in-memory table to a disk-based table is about 10 times faster than directly bulk inserting using a single writer into the disk-based table with an identity column and a clustered index. To leverage this bulk insert performance, setup a [copy job using Azure Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/connector-azure-sql-database) that copies data from in memory table to the disk based table.

# Summary

In summary, with the newly exposed parallel writing features in Azure Stream Analytics SQL output, aligned parallelization of your job with a partitioned table in SQL Azure should give you significant improvements. Leveraging Azure Data Factory for orchestrating data movement from In-Memory table into a Disk-based tables can give order of magnitude throughput gains. If feasible, improving message density can also be a major factor in improving overall throughput.
