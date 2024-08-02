---
title: Benefits of migrating to Azure HDInsight 4.0.
description: Learn the benefits of migrating to Azure HDInsight 4.0.
ms.service: azure-hdinsight
ms.topic: conceptual
ms.date: 07/23/2024
---
# Significant version changes in HDInsight 4.0 and advantages

HDInsight 4.0 has several advantages over HDInsight 3.6. Here's an overview of what's new in Azure HDInsight 4.0.

| # | OSS component | HDInsight 4.0 version | HDInsight 3.6 version |
| --- | --- | --- | --- |
| 1 | Apache Hadoop  | 3.1.1 | 2.7.3 |
| 2 | Apache HBase  | 2.1.6 | 1.1.2 |
| 3 | Apache Hive  | 3.1.0 | 1.2.1, 2.1 (LLAP) |
| 4 | Apache Kafka  | 2.1.1, 2.4 (GA) | 1.1 |
| 5 | Apache Phoenix  | 5 | 4.7.0 |
| 6 | Apache Spark  | 2.4.4, 3.0.0 (Preview) | 2.2 |
| 7 | Apache TEZ  | 0.9.1 | 0.7.0 |
| 8 | Apache ZooKeeper  | 3.4.6 | 3.4.6 |
| 9 | Apache Kafka  | 2.1.1, 2.4.1 (Preview) | 1.1 |
| 10 | Apache Ranger | 1.1.0 | 0.7.0 |

## Workloads and features

### Hive

- Advanced features:
  - Low-latency analytical processing (LLAP) workload management.
  - LLAP support for Java Database Connectivity (JDBC), Druid, and Kafka connectors.
  - Better SQL features (constraints and default values).
  - Surrogate keys.
  - Information schema.
- Performance advantage:
  - Result caching. Caching query results allows a previously computed query result to be reused.
  - Dynamic materialized views and precomputation of summaries.
  - Atomicity, consistency, isolation, and durability (ACID) V2 performance improvements in both storage format and execution engine.
- Security:
  - GDPR compliance enabled on Apache Hive transactions.
  - Hive user-defined function (UDF) execution authorization in Ranger.

### HBase

- Advanced features:
  - Procedure V2 (procv2), an updated framework for executing multistep HBase administrative operations.
  - Fully off-heap read/write path.
  - In-memory compactions.
  - HBase cluster support of the Azure Data Lake Storage Gen2 Premium tier.
- Performance advantage:
  - Accelerated writes that use Azure Premium SSD managed disks to improve performance of the Apache HBase write-ahead log (WAL).
- Security:
  - Hardening of both secondary indexes, which include local and global.

### Kafka

- Advanced features:
  - Kafka partition distribution on Azure fault domains.
  - Zstandard (zstd) compression support.
  - Kafka Consumer Incremental Rebalance.
  - Support for MirrorMaker 2.0.
- Performance advantage:
  - Improved windowed aggregation performance in Kafka Streams.
  - Improved broker resiliency by reducing the memory footprint of message conversion.
  - Replication protocol improvements for fast leader failover.
- Security:
  - Access control for creation of specific topics or topic prefixes.
  - Host-name verification to help prevent Secure Sockets Layer (SSL) configuration man-in-the-middle attacks.
  - Improved encryption support with faster Transport Layer Security (TLS) and CRC32C implementation.

### Spark

- Advanced features:
  - Structured Streaming support for ORC.
  - Capability to integrate with the new metastore catalog feature.
  - Structured Streaming support for the Hive Streaming library.
  - Transparent writes to Hive warehouses.
  - SparkCruise, an automatic computation reuse system for Spark.
- Performance advantage:
  - Result caching. Caching query results allows a previously computed query result to be reused.
  - Dynamic materialized views and precomputation of summaries.
- Security:
  - GDPR compliance enabled for Spark transactions.

## Hive partition discovery and repair

Hive automatically discovers and synchronizes the metadata of the partition in Hive Metastore (HMS).

The `discover.partitions` table property enables and disables synchronization of the file system with partitions. In external partitioned tables, this property is enabled (`true`) by default.

When Hive Metastore starts in remote service mode, a periodic background thread `(PartitionManagementTask)` is scheduled for every 300 seconds (configurable via `metastore.partition.management.task.frequency config`). The thread looks for tables with the `discover.partitions` table property set to `true` and performs `msck` repair in sync mode.

If the table is a transactional table, the thread obtains an exclusive lock for that table before it performs `msck` repair. With this table property, you no longer need to run `MSCK REPAIR TABLE table_name SYNC PARTITIONS` manually.

If you have an external table that you created by using a version of Hive that doesn't support partition discovery, enable partition discovery for the table:

```ALTER TABLE exttbl SET TBLPROPERTIES ('discover.partitions' = 'true');```

Set synchronization of partitions to occur every 10 minutes, expressed in seconds. In **Ambari** > **Hive** > **Configs**, set `metastore.partition.management.task.frequency` to `3600` or more.

:::image type="content" source="./media/hdinsight-migrate-to-40/ambari-hive-config.png" alt-text=" Screenshot that shows an Ambari Hive configuration file with a frequency value.":::

> [!WARNING]
> Running `management.task` every 10 minutes puts pressure on the SQL Server database transaction units (DTUs).

You can verify the output from the Azure portal.

:::image type="content" source="./media/hdinsight-migrate-to-40/hive-verify-output.png" alt-text="Screenshot that shows a compute utilization graph.":::

Hive drops the metadata and corresponding data in any partition that you create after the retention period. You express the retention time by using a numeral and the following character or characters:

```
ms (milliseconds)
s (seconds)
m (minutes)
d (days)
```

To configure a partition retention period for one week, use this command:

```
ALTER TABLE employees SET TBLPROPERTIES ('partition.retention.period'='7d');
```

The partition metadata and the actual data for employees in Hive are automatically dropped after a week.

## Performance optimizations available for Hive 3

### OLAP vectorization

Online analytical processing (OLAP) vectorization allows Hive to process a batch of rows together instead of processing one row at a time. Each batch is usually an array of primitive types. Operations are performed on the entire column vector, which improves the instruction pipelines and cache usage.

This feature includes vectorized execution of Partitioned Table Function (PTF), roll-ups, and grouping sets.

### Dynamic semijoin reduction

Dynamic `semijoin` reduction dramatically improves performance for selective joins. It builds a bloom filter from one side of a join and filters rows from the other side. It skips the scan and provides further evaluation of rows that don't qualify for the join.

### Parquet support for vectorization with LLAP

Vectorized query execution is a feature that greatly reduces the CPU usage for typical query operations such as:

- Scan
- Filter
- Aggregate
- Join

Vectorization is also implemented for the ORC format. Spark also uses whole-stage code generation and this vectorization (for Parquet) since Spark 2.0. There's an added time-stamp column for Parquet vectorization and format under LLAP.

> [!WARNING]
> Parquet writes are slow when you convert to zoned times from the time stamp. For more information, see the [issue details](https://issues.apache.org/jira/browse/HIVE-24693) on the Apache Hive site.

### Automatic query cache

Here are some considerations for automatic query cache:

- With `hive.query.results.cache.enabled=true`, every query that runs in Hive 3 stores its result in a cache.
- If the input table changes, Hive evicts invalid data from the cache. For example, if you perform aggregation and the base table changes, queries that you run most frequently stay in the cache, but stale queries are evicted.
- The query result cache works with managed tables only because Hive can't track changes to an external table.
- If you join external and managed tables, Hive falls back to running the full query. The query result cache works with ACID tables. If you update an ACID table, Hive reruns the query automatically.
- You can enable and disable the query result cache from the command line. You might want to do so to debug a query.
- You can disable the query result cache by setting `hive.query.results.cache.enabled=false`.
- Hive stores the query result cache in `/tmp/hive/__resultcache__/`. By default, Hive allocates 2 GB for the query result cache. You can change this setting by configuring the following parameter in bytes: `hive.query.results.cache.max.size`.
- Changes to query processing: During query compilation, check the result cache to see if it already has the query results. If there's a cache hit, the query plan is set to a `FetchTask` that reads from the cached location.

During query execution, Parquet `DataWriteableWriter` relies on `NanoTimeUtils` to convert a time-stamp object into a binary value. This query calls `toString()` on the time-stamp object, and then it parses the string.

If you can use the result cache for this query:

- The query is `FetchTask` reading from the directory of cached results.
- No cluster tasks are required.

If you can't use the result cache, run the cluster tasks as normal:

- Check if the computed query results are eligible to add to the result cache.
- If results can be cached, the temporary results generated for the query are saved to the result cache. You might need to perform steps to ensure that the query cleanup doesn't delete the query result directory.

## SQL features

The initial implementation introduced in Apache Hive 3.0.0 focuses on introducing materialized views and automatic query rewriting based on those materializations in the project. Materialized views can be stored natively in Hive or in other custom storage handlers (ORC), and they can take advantage of new Hive features such as LLAP acceleration.

For more information, see the [Azure blog post on Hive materialized views](https://techcommunity.microsoft.com/t5/analytics-on-azure-blog/hive-materialized-views/ba-p/2502785).

## Surrogate keys

Use the built-in `SURROGATE_KEY` UDF to automatically generate numerical IDs for rows as you enter data into a table. The generated surrogate keys can replace wide, multiple composite keys.

Hive supports the surrogate keys on ACID tables only. The table that you want to join by using surrogate keys can't have column types that need to cast. These data types must be primitives, such as `INT` or `STRING`.

Joins that use the generated keys are faster than joins that use strings. Using generated keys doesn't force data into a single node by a row number. You can generate keys as abstractions of natural keys. Surrogate keys have an advantage over universally unique identifiers (UUIDs), which are slower and probabilistic.

The `SURROGATE_KEY` UDF generates a unique ID for every row that you insert into a table. It generates keys based on the execution environment in a distributed system, which includes many factors such as:

- Internal data structures
- State of a table
- Last transaction ID

Surrogate key generation doesn't require any coordination between compute tasks. The UDF takes no arguments, or two arguments are:

- Write ID bits
- Task ID bits

### Constraints

SQL constraints help enforce data integrity and improve performance. The optimizer uses the constraint information to make smart decisions. Constraints can make data predictable and easy to locate.

|Constraint|Description|
|---|---|
|`Check`|Limits the range of values that you can place in a column.|
|`PRIMARY KEY`|Identifies each row in a table by using a unique identifier.|
|`FOREIGN KEY`|Identifies a row in another table by using a unique identifier.|
|`UNIQUE KEY`|Checks that values stored in a column are different.|
|`NOT NULL`|Ensures that a column can't be set to `NULL`.|
|`ENABLE`|Ensures that all incoming data conforms to the constraint.|
|`DISABLE`|Doesn't ensure that all incoming data conforms to the constraint.|
|`VALIDATEC`|Checks that all existing data in the table conforms to the constraint.|
|`NOVALIDATE`|Doesn't check that all existing data in the table conforms to the constraint.|
|`ENFORCED`|Maps to `ENABLE NOVALIDATE`.|
|`NOT ENFORCED`|Maps to `DISABLE NOVALIDATE`.|
|`RELY`|Specifies abiding by a constraint. The optimizer uses it to apply further optimizations.|
|`NORELY`|Specifies not abiding by a constraint.|

For more information, see [Supported Features: Apache Hive 3.1](https://cwiki.apache.org/confluence/display/Hive/Supported+Features%3A++Apache+Hive+3.1) on the Apache Hive site.

### Metastore CachedStore

A Hive Metastore operation takes much time and slows down Hive compilation. In some extreme cases, it takes longer than the actual query runtime.

In particular, we find that the latency of the cloud database is high and that 90% of total query runtime is waiting for metastore SQL database operations. Based on this observation, you can enhance the performance of the Hive Metastore operation if you have a memory structure that caches the database query result:

`hive.metastore.rawstore.impl=org.apache.hadoop.hive.metastore.cache.CachedStore`

:::image type="content" source="./media/hdinsight-migrate-to-40/hive-metastore-properties.png" alt-text="Screenshot that shows the Hive Metastore property file value for caching the database query result.":::

## References

For more information, see the following release notes:

- [Hive 3.1.0](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.0/hive-overview/content/hive_whats_new_in_this_release_hive.html)
- [HBase 2.1.6](https://apache.googlesource.com/hbase/+/ba26a3e1fd5bda8a84f99111d9471f62bb29ed1d/RELEASENOTES.md)
- [Hadoop 3.1.1](https://hadoop.apache.org/docs/r3.1.1/hadoop-project-dist/hadoop-common/release/3.1.1/RELEASENOTES.3.1.1.html)

## Related content

- [HDInsight 4.0 announcement](./hdinsight-version-release.md)
- [HDInsight 4.0 deep dive](https://azure.microsoft.com/blog/deep-dive-into-azure-hdinsight-4-0/)
- [Troubleshooting guide for migration of Hive workloads from HDInsight 3.6 to HDInsight 4.0](./interactive-query/interactive-query-troubleshoot-migrate-36-to-40.md)
