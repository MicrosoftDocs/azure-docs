---
title: Index tuning
description: This article describes the index tuning feature in Azure Database for PostgreSQL - Flexible Server.
author: nachoalonsoportillo
ms.author: ialonso
ms.reviewer: maghan
ms.date: 05/28/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: concept-article
ms.custom:
  - references_regions
  - build-2024
# customer intent: As a user, I want to learn about the index tuning feature in Azure Database for PostgreSQL - Flexible Server, how does it work and what benefits it provides.
---

# Index tuning in Azure Database for PostgreSQL - Flexible Server (Preview)

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Index tuning is a feature in Azure Database for PostgreSQL flexible server that automatically improves the performance of your workload by analyzing the tracked queries and providing index recommendations.

It is a built-in offering in Azure Database for PostgreSQL flexible server, which builds on top of [Monitor performance with Query Store](concepts-query-store.md) functionality. Index tuning analyzes the workload tracked by Query Store and produces index recommendations to improve the performance of the analyzed workload or to drop duplicate or unused indexes.

- [Identify which indexes are beneficial](#create-index-recommendations) to create because they could significantly improve the queries analyzed during an index tuning session.
- [Identify indexes that are exact duplicates and can be eliminated](#drop-duplicate-indexes) to reduce the performance impact their existence and maintenance have on the system's overall performance.
- [Identify indexes not used in a configurable period](#drop-unused-indexes) that could be candidates to eliminate.

## General description of the index tuning algorithm

When the `index_tuning.mode` server parameter is configured to `report`, tuning sessions are automatically started with the frequency configured in server parameter `index_tuning.analysis_interval`, expressed in minutes.

In the first phase, the tuning session searches for the list of databases in which it considers that whatever recommendations it might produce might significantly impact the overall performance of the system. To do so, it collects all queries recorded by Query Store whose executions were captured within the lookup interval this tuning session is focusing on. The lookup interval currently spans to the past `index_tuning.analysis_interval` minutes, from the starting time of the tuning session.

For all user-initiated queries with executions recorded in Query Store and whose runtime statistics aren't [reset](./concepts-query-store.md#query_storeqs_reset), the system ranks them based on their aggregated total execution time. It focuses its attention on the most prominent queries, based on their duration.

The following queries are excluded from that list:
- System-initiated queries. (that is, queries executed by `azuresu` role)
- Queries executed in the context of any system database (`azure_sys`, `template0`, `template1`, and `azure_maintenance`).

The algorithm iterates over the target databases, searching for possible indexes that could improve the performance of analyzed workloads. It also searches for indexes that can be eliminated because they're identified as duplicates or haven't been used for a long period of time.

### CREATE INDEX recommendations

For each database identified as a candidate to analyze for producing index recommendations, all SELECT queries executed during the lookup interval and in the context of that specific database are factored in.

> [!NOTE]  
> Index tuning currently doesn't analyze DML (UPDATE, INSERT, DELETE, and MERGE) statements or recommend indexes that improve their performance. In addition, the impact of indexes recommended to improve the performance of SELECTs on DML statements has yet to be considered.

The resulting set of queries is ranked based on their aggregated total execution time, and the top `index_tuning.max_queries_per_database` is analyzed for possible index recommendations.

Potential recommendations aim to improve the performance of these types of queries:
- Queries with filters (that is, queries with predicates in the WHERE clause),
- Queries joining multiple relations, whether they follow the syntax in which joins are expressed with JOIN clause or whether the join predicates are expressed in the WHERE clause.
- Queries combining filters and join predicates.
- Queries with grouping (queries with a GROUP BY clause).
- Queries combining filters and grouping.
- Queries with sorting (queries with an ORDER BY clause).
- Queries combining filters and sorting.

> [!NOTE]
> The only type of indexes the system currently recommends are those of type [B-Tree](https://www.postgresql.org/docs/current/indexes-types.html#INDEXES-TYPES-BTREE).

If a query references one column of a table and that table has no statistics because it was never analyzed (manually using the ANALYZE command or automatically by the autovacuum daemon), then the whole query is skipped, and no indexes are recommended to improve its execution.

`index_tuning.max_indexes_per_table` specifies the number of indexes that can be recommended, excluding any indexes that might already exist on the table for any single table referenced by any number of queries during a tuning session.

`index_tuning.max_index_count` specifies the number of index recommendations produced for all tables of any database analyzed during a tuning session.

For an index recommendation to be emitted, the tuning engine must estimate that it improves at least one query in the analyzed workload by a factor specified with `index_tuning.min_improvement_factor`.

Likewise, all index recommendations are checked to ensure that they don't introduce regression on any single query in that workload of a factor specified with `index_tuning.max_regression_factor`.

> [!NOTE]
> `index_tuning.min_improvement_factor` and `index_tuning.max_regression_factor` both refer to cost of query plans, not to their duration or the resources they consume during execution.

All the parameters mentioned in the previous paragraphs, their default values and valid ranges are described in [configuration options](how-to-configure-index-tuning.md#configuration-options).

The script produced along with the recommendation to create an index, follows this pattern:

`create index concurrently {indexName} on {schema}.{table}({column_name}[, ...])`

It includes the clause `concurrently`. For further information about the effects of this clause, visit PostgreSQL official documentation for [CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY).

Index tuning automatically generates the names of the recommended indexes, which typically consist of the names of the different key columns separated by "_" (underscores) and with a constant "_idx" suffix. If the total length of the name exceeds PostgreSQL limits or if it clashes with any existing relations, the name is slightly different. It could be truncated, and a number could be appended to the end of the name.

#### Compute the impact of a CREATE INDEX recommendation

The impact of creating an index recommendation is measured on IndexSize (megabytes) and QueryCostImprovement (percentage).

IndexSize is a single value that represents the estimated size of the index, considering the current cardinality of the table and the size of the columns referenced by the recommended index.

QueryCostImprovement consists of an array of values, where each element represents the improvement in the plan's cost for each query whose plan's cost is estimated to improve if this index existed. Each element shows the query's identifier (queried) and the percentage by which the plan's cost would improve if the recommendation were implemented (dimensional).

### DROP INDEX recommendations

For each database for which Index Tuning functionality is determined, it should initiate a new session, and after the CREATE INDEX recommendations phase completes, it recommends dropping indexes for two possible reasons:
- Because they're considered duplicates of others.
- Because they're not used for a configurable amount of time.

#### Drop duplicate indexes

Recommendations for dropping duplicate indexes: First, identify which indexes have duplicates.

Duplicates are ranked based on different functions that can be attributed to the index and based on their estimated sizes.

Finally, it recommends dropping all duplicates with a lower ranking than its reference leader and describes why each duplicate was ranked the way it was.

For two indexes to be considered duplicate they must:
- Be created over the same table.
- Be an index of the exact same type.
- Match their key columns and, for multi-column index keys, match the order in which they're referenced.
- Match the expression tree of its predicate. Only applicable to partial indexes.
- Match the expression tree of all nonsimple column references. Only applicable to indexes created on expressions.
- Match the collation of each column referenced in the key.

#### Drop unused indexes

Recommendations for dropping unused indexes identify those indexes which:
- Aren't used for at least `index_tuning.unused_min_period` days.
- Show a minimum (daily average) amount of `index_tuning.unused_dml_per_table` DMLs on the table where the index is created.
- Show a minimum (daily average) amount of `index_tuning.unused_reads_per_table` reads on the table where the index is created.

#### Compute the impact of a DROP INDEX recommendation

The impact of a drop index recommendation is measured on two dimensions: Benefit (percentage) and IndexSize (megabytes).

The benefit is a single value that can be ignored for now.

IndexSize is a single value that represents the estimated size of the index considering the current cardinality of the table and the size of the columns referenced by the recommended index.

## Configuring index tuning

Index tuning can be enabled, disabled and configured through a set of parameters that control its behavior, such as how often a tuning session can run.

Explore all the details about correct configuration of index tuning feature in [how to enable, disable and configure index tuning](how-to-configure-index-tuning.md).

## Information produced by index tuning

[How to read, interpret and use recommendations produced by index tuning](how-to-get-and-apply-recommendations-from-index-tuning.md) describes in full detail how to obtain and use the recommendations produced by index tuning.

## Limitations and supportability

Index tuning in Azure Database for PostgreSQL - Flexible Server has the following limitations:

- Index tuning is currently in preview and might have some limitations or restrictions.
- The feature is available in specific regions, including East Asia, Central India, North Europe, Southeast Asia, South Central US, UK South, and West US 3. 
- Index tuning is supported on all currently available tiers (Burstable, General Purpose, and Memory Optimized) and on any currently supported compute SKU with at least 4 vCores.
- The feature is supported on major versions 14 or greater of Azure Database for PostgreSQL Flexible Server.
- In read replicas or when an instance is in read-only mode, index tuning isn't supported.
- It's important to consider the implications of creating recommended indexes on servers with high availability or read replicas, especially when the size of the indexes is estimated to be large.

For more information on index tuning and related articles, see the documentation links provided below.

### Supported regions

Index tuning feature is available in the following regions:

- East Asia
- Central India
- North Europe
- Southeast Asia
- South Central US
- UK South
- West US 3

### Supported tiers and SKUs

Index tuning is supported on all [currently available tiers](concepts-compute.md): Burstable, General Purpose, and Memory Optimized, and on any [currently supported compute SKU](concepts-compute.md) with at least 4 vCores.

> [!IMPORTANT]  
> If a server has index tuning enabled and is scaled down to a compute with less than the minimum number of required vCores, the feature will remain enabled. Because the feature is not supported on servers with less than 4 vCores, ifyou plan to enable it in a server which is less than 4 vCores, or you plan to scale down your instance to less than 4 vCores, make sure you disable index tuning first, setting `index_tuning.mode`to `OFF`.

### Supported versions of PostgreSQL

Index tuning is supported on [major versions](concepts-supported-versions.md) **14 or greater** of Azure Database for PostgreSQL Flexible Server.

> [!IMPORTANT]
> Although you can enable the feature on instances running versions lower than 14, you're not expected to do it as the feature is not supported in those versions.

### Read-only mode and read replicas

When an Azure Database for PostgreSQL - Flexible Server instance is in read-only modes, such as when the `default_transaction_read_only` parameter is set to `on,` or if the read-only mode is [automatically enabled due to reaching storage capacity](concepts-limits.md#storage), Query Store doesn't capture any data.

Also, index tuning isn't supported currently on read replicas. Any recommendations seen on a read replica, is one that has been produced on the primary replica after having analyzed the workload recorded in it.

### Network connectivity method

Index tuning is currently supported on instances whose connectivity method is configured as [Public access (allowed IP addresses)](concepts-networking-public.md). For instances configured with [Private access (VNET Integration)](concepts-networking-private.md) the feature can be enabled, but it won't generate recommendations.

### Important considerations

If you have [high availability](../../reliability/reliability-postgresql-flexible-server.md) or [read replicas](concepts-read-replicas.md) configured on your server, be aware of the implications associated with producing write-intensive workloads on the primary server when recommended indexes are created by the index tuning feature. Be especially careful when creating indexes whose size is estimated to be large.

## Related content

- [Monitor performance with Query Store](concepts-query-store.md)
- [Usage scenarios for Query Store - Azure Database for PostgreSQL - Flexible Server](concepts-query-store-scenarios.md)
- [Best practices for Query Store - Azure Database for PostgreSQL - Flexible Server](concepts-query-store-best-practices.md)
- [Query Performance Insight for Azure Database for PostgreSQL - Flexible Server](concepts-query-performance-insight.md)
- [Enable, disable and configure index tuning](how-to-configure-index-tuning.md)
- [Read, interpret and use recommendations produced by index tuning](how-to-get-and-apply-recommendations-from-index-tuning.md)
