---
title: Query Store - Azure Database for MySQL
description: Learn about the Query Store feature in Azure Database for MySQL to help you track performance over time.
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Monitor Azure Database for MySQL performance with Query Store

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

**Applies to:** Azure Database for MySQL 5.7, 8.0

The Query Store feature in Azure Database for MySQL provides a way to track query performance over time. Query Store simplifies performance troubleshooting by helping you quickly find the longest running and most resource-intensive queries. Query Store automatically captures a history of queries and runtime statistics, and it retains them for your review. It separates data by time windows so that you can see database usage patterns. Data for all users, databases, and queries is stored in the **mysql** schema database in the Azure Database for MySQL instance.

## Common scenarios for using Query Store

Query store can be used in a number of scenarios, including the following:

- Detecting regressed queries
- Determining the number of times a query was executed in a given time window
- Comparing the average execution time of a query across time windows to see large deltas

## Enabling Query Store

Query Store is an opt-in feature, so it isn't active by default on a server. The query store is enabled or disabled globally for all the databases on a given server and cannot be turned on or off per database.

### Enable Query Store using the Azure portal

1. Sign in to the Azure portal and select your Azure Database for MySQL server.
1. Select **Server Parameters** in the **Settings** section of the menu.
1. Search for the query_store_capture_mode parameter.
1. Set the value to ALL and **Save**.

To enable wait statistics in your Query Store:

1. Search for the query_store_wait_sampling_capture_mode parameter.
1. Set the value to ALL and **Save**.

Allow up to 20 minutes for the first batch of data to persist in the mysql database.

## Information in Query Store

Query Store has two stores:

- A runtime statistics store for persisting the query execution statistics information.
- A wait statistics store for persisting wait statistics information.

To minimize space usage, the runtime execution statistics in the runtime statistics store are aggregated over a fixed, configurable time window. The information in these stores is visible by querying the query store views.

The following query returns information about queries in Query Store:

```sql
SELECT * FROM mysql.query_store;
```

Or this query for wait statistics:

```sql
SELECT * FROM mysql.query_store_wait_stats;
```

## Finding wait queries

> [!NOTE]
> Wait statistics should not be enabled during peak workload hours or be turned on indefinitely for sensitive workloads. <br>For workloads running with high CPU utilization or on servers configured with lower vCores, use caution when enabling wait statistics. It should not be turned on indefinitely.

Wait event types combine different wait events into buckets by similarity. Query Store provides the wait event type, specific wait event name, and the query in question. Being able to correlate this wait information with the query runtime statistics means you can gain a deeper understanding of what contributes to query performance characteristics.

Here are some examples of how you can gain more insights into your workload using the wait statistics in Query Store:

| **Observation** | **Action** |
|---|---|
|High Lock waits | Check the query texts for the affected queries and identify the target entities. Look in Query Store for other queries modifying the same entity, which is executed frequently and/or have high duration. After identifying these queries, consider changing the application logic to improve concurrency, or use a less restrictive isolation level. |
|High Buffer IO waits | Find the queries with a high number of physical reads in Query Store. If they match the queries with high IO waits, consider introducing an index on the underlying entity, to do seeks instead of scans. This would minimize the IO overhead of the queries. Check the **Performance Recommendations** for your server in the portal to see if there are index recommendations for this server that would optimize the queries. |
|High Memory waits | Find the top memory consuming queries in Query Store. These queries are probably delaying further progress of the affected queries. Check the **Performance Recommendations** for your server in the portal to see if there are index recommendations that would optimize these queries. |

## Configuration options

When Query Store is enabled it saves data in 15-minute aggregation windows, up to 500 distinct queries per window.

The following options are available for configuring Query Store parameters.

| **Parameter** | **Description** | **Default** | **Range** |
|---|---|---|---|
| query_store_capture_mode | Turn the query store feature ON/OFF based on the value. Note: If performance_schema is OFF, turning on query_store_capture_mode will turn on performance_schema and a subset of performance schema instruments required for this feature. | ALL | NONE, ALL |
| query_store_capture_interval | The query store capture interval in minutes. Allows specifying the interval in which the query metrics are aggregated | 15 | 5 - 60 |
| query_store_capture_utility_queries | Turning ON or OFF to capture all the utility queries that is executing in the system. | NO | YES, NO |
| query_store_retention_period_in_days | Time window in days to retain the data in the query store. | 7 | 1 - 30 |

The following options apply specifically to wait statistics.

| **Parameter** | **Description** | **Default** | **Range** |
|---|---|---|---|
| query_store_wait_sampling_capture_mode | Allows turning ON / OFF the wait statistics. | NONE | NONE, ALL |
| query_store_wait_sampling_frequency | Alters frequency of wait-sampling in seconds. 5 to 300 seconds. | 30 | 5-300 |

> [!NOTE]
> Currently **query_store_capture_mode** supersedes this configuration, meaning both **query_store_capture_mode** and **query_store_wait_sampling_capture_mode** have to be enabled to ALL for wait statistics to work. If **query_store_capture_mode** is turned off, then wait statistics is turned off as well since wait statistics utilizes the performance_schema enabled, and the query_text captured by query store.

Use the [Azure portal](how-to-server-parameters.md) or [Azure CLI](how-to-configure-server-parameters-using-cli.md) to get or set a different value for a parameter.

## Views and functions

View and manage Query Store using the following views and functions. Anyone in the [select privilege public role](how-to-create-users.md) can use these views to see the data in Query Store. These views are only available in the **mysql** database.

Queries are normalized by looking at their structure after removing literals and constants. If two queries are identical except for literal values, they will have the same hash.

### mysql.query_store

This view returns all the data in Query Store. There is one row for each distinct database ID, user ID, and query ID.

| **Name** | **Data Type** | **IS_NULLABLE** | **Description** |
|---|---|---|---|
| `schema_name`| varchar(64) | NO | Name of the schema |
| `query_id`| bigint(20) | NO| Unique ID generated for the specific query, if the same query executes in different schema, a new ID will be generated |
| `timestamp_id` | timestamp| NO| Timestamp in which the query is executed. This is based on the query_store_interval configuration|
| `query_digest_text`| longtext| NO| The normalized query text after removing all the literals|
| `query_sample_text` | longtext| NO| First appearance of the actual query with literals|
| `query_digest_truncated` | bit| YES| Whether the query text has been truncated. Value will be Yes if the query is longer than 1 KB|
| `execution_count` | bigint(20)| NO| The number of times the query got executed for this timestamp ID / during the configured interval period|
| `warning_count` | bigint(20)| NO| Number of warnings this query generated during the internal|
| `error_count` | bigint(20)| NO| Number of errors this query generated during the interval|
| `sum_timer_wait` | double| YES| Total execution time of this query during the interval in milliseconds|
| `avg_timer_wait` | double| YES| Average execution time for this query during the interval in milliseconds|
| `min_timer_wait` | double| YES| Minimum execution time for this query in milliseconds|
| `max_timer_wait` | double| YES| Maximum execution time in milliseconds|
| `sum_lock_time` | bigint(20)| NO| Total amount of time spent for all the locks for this query execution during this time window|
| `sum_rows_affected` | bigint(20)| NO| Number of rows affected|
| `sum_rows_sent` | bigint(20)| NO| Number of rows sent to client|
| `sum_rows_examined` | bigint(20)| NO| Number of rows examined|
| `sum_select_full_join` | bigint(20)| NO| Number of full joins|
| `sum_select_scan` | bigint(20)| NO| Number of select scans |
| `sum_sort_rows` | bigint(20)| NO| Number of rows sorted|
| `sum_no_index_used` | bigint(20)| NO| Number of times when the query did not use any indexes|
| `sum_no_good_index_used` | bigint(20)| NO| Number of times when the query execution engine did not use any good indexes|
| `sum_created_tmp_tables` | bigint(20)| NO| Total number of temp tables created|
| `sum_created_tmp_disk_tables` | bigint(20)| NO| Total number of temp tables created in disk (generates I/O)|
| `first_seen` | timestamp| NO| The first occurrence (UTC) of the query during the aggregation window|
| `last_seen` | timestamp| NO| The last occurrence (UTC) of the query during this aggregation window|

### mysql.query_store_wait_stats

This view returns wait events data in Query Store. There is one row for each distinct database ID, user ID, query ID, and event.

| **Name**| **Data Type** | **IS_NULLABLE** | **Description** |
|---|---|---|---|
| `interval_start` | timestamp | NO| Start of the interval (15-minute increment)|
| `interval_end` | timestamp | NO| End of the interval (15-minute increment)|
| `query_id` | bigint(20) | NO| Generated unique ID on the normalized query (from query store)|
| `query_digest_id` | varchar(32) | NO| The normalized query text after removing all the literals (from query store) |
| `query_digest_text` | longtext | NO| First appearance of the actual query with literals (from query store) |
| `event_type` | varchar(32) | NO| Category of the wait event |
| `event_name` | varchar(128) | NO| Name of the wait event |
| `count_star` | bigint(20) | NO| Number of wait events sampled during the interval for the query |
| `sum_timer_wait_ms` | double | NO| Total wait time (in milliseconds) of this query during the interval |

### Functions

| **Name**| **Description** |
|---|---|
| `mysql.az_purge_querystore_data(TIMESTAMP)` | Purges all query store data before the given time stamp |
| `mysql.az_procedure_purge_querystore_event(TIMESTAMP)` | Purges all wait event data before the given time stamp |
| `mysql.az_procedure_purge_recommendation(TIMESTAMP)` | Purges recommendations whose expiration is before the given time stamp |

## Limitations and known issues

- If a MySQL server has the parameter `read_only` on, Query Store cannot capture data.
- Query Store functionality can be interrupted if it encounters long Unicode queries (\>= 6000 bytes).
- The retention period for wait statistics is 24 hours.
- Wait statistics uses sample to capture a fraction of events. The frequency can be modified using the parameter `query_store_wait_sampling_frequency`.

## Next steps

- Learn more about [Query Performance Insights](concepts-query-performance-insight.md)
