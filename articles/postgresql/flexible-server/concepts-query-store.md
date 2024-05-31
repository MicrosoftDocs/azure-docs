---
title: Query Store
description: This article describes the Query Store feature in Azure Database for PostgreSQL - Flexible Server.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: maghan
ms.date: 05/14/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---
# Monitor performance with Query Store

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The Query Store feature in Azure Database for PostgreSQL flexible server provides a way to track query performance over time. Query Store simplifies performance-troubleshooting by helping you quickly find the longest running and most resource-intensive queries. Query Store automatically captures a history of queries and runtime statistics, and it retains them for your review. It slices the data by time so that you can see temporal usage patterns. Data for all users, databases and queries is stored in a database named **azure_sys** in the Azure Database for PostgreSQL flexible server instance.

> [!IMPORTANT]  
> Do not modify the **azure_sys** database or its schema. Doing so will prevent Query Store and related performance features from functioning correctly.

## Enable Query Store

Query Store is available in all regions with no additional charges. It is an opt-in feature, so it isn't enabled by default on a server. Query store can be enabled or disabled globally for all databases on a given server and can't be turned on or off per database.

> [!IMPORTANT]  
> Do not enable Query Store on Burstable pricing tier as it would cause performance impact.

### Enable Query Store in Azure portal

1. Sign in to the Azure portal and select your Azure Database for PostgreSQL flexible server instance.
1. Select **Server parameters** in the **Settings** section of the menu.
1. Search for the `pg_qs.query_capture_mode` parameter.
1. Set the value to `TOP` or `ALL`, depending on whether you want to track top-level queries or also nested queries (those executed inside a function or procedure), and click on **Save**.
Allow up to 20 minutes for the first batch of data to persist in the azure_sys database.

### Enable Query Store Wait Sampling

1. Search for the `pgms_wait_sampling.query_capture_mode` parameter.
1. Set the value to `ALL` and **Save**.

## Information in Query Store

#### Query Store consists of two stores:
1. A runtime stats store for persisting the query execution statistics information.
1. A wait stats store for persisting wait statistics information.

#### Common scenarios for using Query Store include:
- Determining the number of times a query was executed in a given time window.
- Comparing the average execution time of a query across time windows to see large deltas.
- Identifying longest running queries in the past few hours.
- Identifying top N queries that are waiting on resources.
- Understanding waits nature for a particular query.

To minimize space usage, the runtime execution statistics in the runtime stats store are aggregated over a fixed, configurable time window. The information in these stores can be queried using views.

## Access Query Store information

Query Store data is stored in the azure_sys database on your Azure Database for PostgreSQL flexible server instance.
The following query returns information about queries in Query Store:

```sql
SELECT * FROM  query_store.qs_view;
```
Or this query for wait stats:

```sql
SELECT * FROM  query_store.pgms_wait_sampling_view;
```

## Find wait queries

Wait event types combine different wait events into buckets by similarity. Query Store provides the wait event type, specific wait event name, and the query in question. Being able to correlate this wait information with the query runtime statistics means you can gain a deeper understanding of what contributes to query performance characteristics.

Here are some examples of how you can gain more insights into your workload using the wait statistics in Query Store:

| **Observation** | **Action** |
| --- | --- |
|High Lock waits | Check the query texts for the affected queries and identify the target entities. Look in Query Store for other queries modifying the same entity, which is executed frequently and/or have high duration. After identifying these queries, consider changing the application logic to improve concurrency, or use a less restrictive isolation level.
| High Buffer IO waits | Find the queries with a high number of physical reads in Query Store. If they match the queries with high IO waits, consider introducing an index on the underlying entity, in order to do seeks instead of scans. This would minimize the IO overhead of the queries. Check the **Performance Recommendations** for your server in the portal to see if there are index recommendations for this server that would optimize the queries. |
| High Memory waits | Find the top memory consuming queries in Query Store. These queries are probably delaying further progress of the affected queries. Check the **Performance Recommendations** for your server in the portal to see if there are index recommendations that would optimize these queries. |

## Configuration options

When Query Store is enabled, it saves data in aggregation windows of length determined by the `pg_qs.interval_length_minutes` server parameter (defaults to 15 minutes). For each window, it stores the 500 distinct queries per window.
The following options are available for configuring Query Store parameters:

| **Parameter** | **Description** | **Default** | **Range** |
| --- | --- | --- | --- |
| pg_qs.query_capture_mode | Sets which statements are tracked. | none | none, top, all |
| pg_qs.interval_length_minutes (*) | Sets the query_store capture interval in minutes for pg_qs - this is the frequency of data persistence. | 15 | 1 - 30 |
| pg_qs.store_query_plans | Turns saving query plans on or off for pg_qs. | off | on, off |
| pg_qs.max_plan_size | Sets the maximum number of bytes that will be saved for query plan text for pg_qs; longer plans will be truncated. | 7500 | 100 - 10k |
| pg_qs.max_query_text_length | Sets the maximum query length that can be saved; longer queries will be truncated. | 6000 | 100 - 10K |
| pg_qs.retention_period_in_days | Sets the retention period window in days for pg_qs - after this time data will be deleted. | 7 | 1 - 30 |
| pg_qs.track_utility | Sets whether utility commands are tracked by pg_qs. | on | on, off |

(*) Static server parameter which requires a server restart for a change in its value to take effect. 


The following options apply specifically to wait statistics:

| **Parameter** | **Description** | **Default** | **Range** |
| --- | --- | --- | --- |
| pgms_wait_sampling.query_capture_mode | Selects which statements are tracked by the pgms_wait_sampling extension. | none | none, all |
| Pgms_wait_sampling.history_period | Sets the frequency, in milliseconds, at which wait events are sampled. | 100 | 1-600000 |

> [!NOTE]  
> **pg_qs.query_capture_mode** supersedes **pgms_wait_sampling.query_capture_mode**. If pg_qs.query_capture_mode is NONE, the pgms_wait_sampling.query_capture_mode setting has no effect.

Use the [Azure portal](how-to-configure-server-parameters-using-portal.md) to get or set a different value for a parameter.

## Views and functions

View and manage Query Store using the following views and functions. Anyone in the PostgreSQL public role can use these views to see the data in Query Store. These views are only available in the **azure_sys** database.

Queries are normalized by looking at their structure and ignoring anything not semantically significant, like literals, constants, aliases, or differences in casing.

If two queries are semantically identical, even if they use different aliases for the same referenced columns and tables, they're identified with the same query_id. If two queries only differ in the literal values used in them, they're also identified with the same query_id. For all queries identified with the same query_id, their sql_query_text will be that of the query that executed first since Query Store started recording activity, or since the last time the persisted data was discarded because the function [query_store.qs_reset](#query_storeqs_reset) was executed.

### How query normalization works

Following are some examples to try to illustrate how this normalization works:

Say that you create a table with the following statement:

```sql
create table tableOne (columnOne int, columnTwo int);
```

You enable Query Store data collection, and a single or multiple users execute the following queries, in this exact order:

```sql
select * from tableOne;
select columnOne, columnTwo from tableOne;
select columnOne as c1, columnTwo as c2 from tableOne as t1;
select columnOne as "column one", columnTwo as "column two" from tableOne as "table one";
```

All the previous queries share the same query_id. And the text that Query Store keeps is that of the first query executed after enabling data collection. Therefore, it would be `select * from tableOne;`.

The following set of queries, once normalized, don't match the previous set of queries because the WHERE clause makes them semantically different:

```sql
select columnOne as c1, columnTwo as c2 from tableOne as t1 where columnOne = 1 and columnTwo = 1;
select * from tableOne where columnOne = -3 and columnTwo = -3;
select columnOne, columnTwo from tableOne where columnOne = '5' and columnTwo = '5';
select columnOne as "column one", columnTwo as "column two" from tableOne as "table one" where columnOne = 7 and columnTwo = 7;
```

However, all queries in this last set share the same query_id and the text used to identify them all is that of the first query in the batch `select columnOne as c1, columnTwo as c2 from tableOne as t1 where columnOne = 1 and columnTwo = 1;`.

Finally, find below some queries not matching the query_id of those in the previous batch, and the reason why they don't:

**Query**:
```sql
select columnTwo as c2, columnOne as c1 from tableOne as t1 where columnOne = 1 and columnTwo = 1;
```
**Reason for not matching**:
List of columns refers to the same two columns (columnOne and ColumnTwo), but the order in which they are referred is reversed, from `columnOne, ColumnTwo` in the previous batch to `ColumnTwo, columnOne` in this query.

**Query**:
```sql
select * from tableOne where columnTwo = 25 and columnOne = 25;
```
**Reason for not matching**:
Order in which the expressions evaluated in the WHERE clause are referred is reversed from `columnOne = ? and ColumnTwo = ?` in the previous batch to `ColumnTwo = ? and columnOne = ?` in this query.

**Query**:
```sql
select abs(columnOne), columnTwo from tableOne where columnOne = 12 and columnTwo = 21;
```
**Reason for not matching**:
The first expression in the column list is not `columnOne` anymore, but function `abs` evaluated over `columnOne` (`abs(columnOne)`), which is not semantically equivalent.

**Query**:
```sql
select columnOne as "column one", columnTwo as "column two" from tableOne as "table one" where columnOne = ceiling(16) and columnTwo = 16;
```
**Reason for not matching**:
The first expression in the WHERE clause doesn't evaluate the equality of `columnOne` with a literal anymore, but with the result of function `ceiling` evaluated over a literal, which is not semantically equivalent.


### Views


#### query_store.qs_view

This view returns all the data that has already been persisted in the supporting tables of Query Store. Data that is being recorded in-memory for the currently active time window, is not visible until the time window comes to an end, and its in-memory volatile data is collected and persisted to tables stored on disk. This view returns a different row for each distinct database (db_id), user (user_id), and query (query_id).

| **Name** | **Type** | **References** | **Description** |
| --- | --- | --- | --- |
| runtime_stats_entry_id | bigint | | ID from the runtime_stats_entries table. |
| user_id | oid | pg_authid.oid | OID of user who executed the statement. |
| db_id | oid | pg_database.oid | OID of database in which the statement was executed. |
| query_id | bigint | | Internal hash code, computed from the statement's parse tree. |
| query_sql_text | varchar(10000) | | Text of a representative statement. Different queries with the same structure are clustered together; this text is the text for the first of the queries in the cluster. The default value for the maximum query text length is 6000, and can be modified using query store parameter `pg_qs.max_query_text_length`. If the text of the query exceeds this maximum value, it is truncated to the first `pg_qs.max_query_text_length` characters. |
| plan_id | bigint | | ID of the plan corresponding to this query. |
| start_time | timestamp | | Queries are aggregated by time windows, whose time span is defined by the server parameter `pg_qs.interval_length_minutes` (default is 15 minutes). This is the start time corresponding to the time window for this entry. |
| end_time | timestamp | | End time corresponding to the time window for this entry. |
| calls | bigint | | Number of times the query executed in this time window. Notice that for parallel queries, the number of calls for each execution corresponds to 1 for the backend process driving the execution of the query, plus as many other units for each backend worker process, launched to collaborate executing the parallel branches of the execution tree. |
| total_time | double precision | | Total query execution time, in milliseconds. |
| min_time | double precision | | Minimum query execution time, in milliseconds. |
| max_time | double precision | | Maximum query execution time, in milliseconds. |
| mean_time | double precision | | Mean query execution time, in milliseconds. |
| stddev_time | double precision | | Standard deviation of the query execution time, in milliseconds. |
| rows | bigint | | Total number of rows retrieved or affected by the statement.  Notice that for parallel queries, the number of rows for each execution corresponds to the number of rows returned to the client by the backend process driving the execution of the query, plus the sum of all rows that each backend worker process, launched to collaborate executing the parallel branches of the execution tree, returns to the driving backend process. |
| shared_blks_hit | bigint | | Total number of shared block cache hits by the statement. |
| shared_blks_read | bigint | | Total number of shared blocks read by the statement. |
| shared_blks_dirtied | bigint | | Total number of shared blocks dirtied by the statement. |
| shared_blks_written | bigint | | Total number of shared blocks written by the statement. |
| local_blks_hit | bigint | | Total number of local block cache hits by the statement. |
| local_blks_read | bigint | | Total number of local blocks read by the statement. |
| local_blks_dirtied | bigint | | Total number of local blocks dirtied by the statement. |
| local_blks_written | bigint | | Total number of local blocks written by the statement. |
| temp_blks_read | bigint | | Total number of temp blocks read by the statement. |
| temp_blks_written | bigint | | Total number of temp blocks written by the statement. |
| blk_read_time | double precision | | Total time the statement spent reading blocks, in milliseconds (if track_io_timing is enabled, otherwise zero). |
| blk_write_time | double precision | | Total time the statement spent writing blocks, in milliseconds (if track_io_timing is enabled, otherwise zero). |
| is_system_query | boolean | | Determines whether the query was executed by role with user_id = 10 (azuresu), which has superuser privileges and is used to perform control pane operations. Since this service is a managed PaaS service, only Microsoft is part of that superuser role. |
| query_type | text | | Type of operation represented by the query. Possible values are `unknown`, `select`, `update`, `insert`, `delete`, `merge`, `utility`, `nothing`, `undefined`. |


#### query_store.query_texts_view

This view returns query text data in Query Store. There's one row for each distinct query_sql_text.

| **Name** | **Type** | **Description** |
|--| -- | -- |
| query_text_id | bigint | ID for the query_texts table |
| query_sql_text | varchar(10000) | Text of a representative statement. Different queries with the same structure are clustered together; this text is the text for the first of the queries in the cluster. |
| query_type | smallint | Type of operation represented by the query. In version of PostgreSQL <= 14, possible values are `0` (unknown), `1` (select), `2` (update), `3` (insert), `4` (delete), `5` (utility), `6` (nothing). In version of PostgreSQL >= 15, possible values are `0` (unknown), `1` (select), `2` (update), `3` (insert), `4` (delete), `5` (merge), `6` (utility), `7` (nothing). |


#### query_store.pgms_wait_sampling_view

This view returns wait events data in Query Store. This view returns a different row for each distinct database (db_id), user (user_id), query (query_id), and event (event).

| **Name** | **Type** | **References** | **Description** |
| -- |--| -- |--|
| start_time | timestamp | | Queries are aggregated by time windows, whose time span is defined by the server parameter `pg_qs.interval_length_minutes` (default is 15 minutes). This is the start time corresponding to the time window for this entry. |
| end_time | timestamp | | End time corresponding to the time window for this entry. |
| user_id | oid | pg_authid.oid | OID of user who executed the statement. |
| db_id | oid | pg_database.oid | OID of database in which the statement was executed. |
| query_id | bigint | | Internal hash code, computed from the statement's parse tree. |
| event_type | text | | The type of event for which the backend is waiting. |
| event | text | | The wait event name if backend is currently waiting. |  
| calls | integer | | Number of times the same event has been captured. |

> [!NOTE]  
> For a list of possible values in the **event_type** and **event** columns of the **query_store.pgms_wait_sampling_view** view, refer to the official documentation of [pg_stat_activity](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW) and look for the information referring to columns with the same names.


#### query_store.query_plans_view

This view returns the query plan that was used to execute a query. There's one row per each distinct database ID, and query ID. This will only store query plans for nonutility queries.

| **plan_id** | **db_id** | **query_id** | **plan_text** |
| -- |--| -- |--|
| plan_id | bigint | | The hash value from the normalized query plan produced by [EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html). It is considered normalized because it excludes the estimated costs of plan nodes and usage of buffers. |
| db_id | oid | pg_database.oid | OID of database in which the statement was executed. |
| query_id | bigint | | Internal hash code, computed from the statement's parse tree. |
| plan_text | varchar(10000) | Execution plan of the statement given costs=false, buffers=false, and format=text. This is the same output given by [EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html). |


### Functions


#### query_store.qs_reset

This function discards all statistics gathered so far by Query Store. It discards both the statistics for already closed time windows, which have been persisted to on disk tables, and those for the current time window, which are still kept in-memory. This function can only be executed by the server admin role (**azure_pg_admin**).


#### query_store.staging_data_reset

This function discards all statistics gathered in-memory by Query Store (that is, the data in memory that hasn't been flushed yet to the on disk tables supporting persistence of collected data for Query Store). This function can only be executed by the server admin role (**azure_pg_admin**).

## Limitations and known issues
[!INCLUDE [Note Query store and Azure storage compability](includes/note-query-store-azure-storage-compability.md)]

### Read-only mode
When an Azure Database for PostgreSQL - Flexible Server instance is in read-only mode, such as when the `default_transaction_read_only` parameter is set to `on`, or if read-only mode is [automatically enabled due to reaching storage capacity](concepts-limits.md#storage), Query Store does not capture any data.

## Related content

- [scenarios where Query Store can be especially helpful](concepts-query-store-scenarios.md)
- [best practices for using Query Store](concepts-query-store-best-practices.md)
- [visualizing data from Query Store via Query Performance Insight Interface](./concepts-query-performance-insight.md)
