---
title: Query Store - Azure Database for PostgreSQL - Single Server
description: This article describes the Query Store feature in Azure Database for PostgreSQL - Single Server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: sunila
author: sunilagarwal
ms.date: 06/24/2022
---

# Monitor performance with the Query Store

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

The Query Store feature in Azure Database for PostgreSQL provides a way to track query performance over time. Query Store simplifies performance troubleshooting by helping you quickly find the longest running and most resource-intensive queries. Query Store automatically captures a history of queries and runtime statistics, and it retains them for your review. It separates data by time windows so that you can see database usage patterns. Data for all users, databases, and queries is stored in a database named **azure_sys** in the Azure Database for PostgreSQL instance.

> [!IMPORTANT]
> Do not modify the **azure_sys** database or its schemas. Doing so will prevent Query Store and related performance features from functioning correctly.

## Enabling Query Store

Query Store is an opt-in feature, so it isn't active by default on a server. The store is enabled or disabled globally for all the databases on a given server and cannot be turned on or off per database.

### Enable Query Store using the Azure portal

1. Sign in to the Azure portal and select your Azure Database for PostgreSQL server.
2. Select **Server Parameters** in the **Settings** section of the menu.
3. Search for the `pg_qs.query_capture_mode` parameter.
4. Set the value to `TOP` and **Save**.

To enable wait statistics in your Query Store: 
1. Search for the `pgms_wait_sampling.query_capture_mode` parameter.
1. Set the value to `ALL` and **Save**.

Alternatively you can set these parameters using the Azure CLI.
```azurecli-interactive
az postgres server configuration set --name pg_qs.query_capture_mode --resource-group myresourcegroup --server mydemoserver --value TOP
az postgres server configuration set --name pgms_wait_sampling.query_capture_mode --resource-group myresourcegroup --server mydemoserver --value ALL
```

Allow up to 20 minutes for the first batch of data to persist in the azure_sys database.

## Information in Query Store

Query Store has two stores:
- A runtime stats store for persisting the query execution statistics information.
- A wait stats store for persisting wait statistics information.

Common scenarios for using Query Store include:
- Determining the number of times a query was executed in a given time window
- Comparing the average execution time of a query across time windows to see large deltas
- Identifying longest running queries in the past X hours
- Identifying top N queries that are waiting on resources
- Understanding wait nature for a particular query

To minimize space usage, the runtime execution statistics in the runtime stats store are aggregated over a fixed, configurable time window. The information in these stores is visible by querying the query store views.

## Access Query Store information

Query Store data is stored in the azure_sys database on your Postgres server.

The following query returns information about queries in Query Store:
```sql
SELECT * FROM query_store.qs_view; 
```

Or this query for wait stats:
```sql
SELECT * FROM query_store.pgms_wait_sampling_view;
```

## Finding wait queries

Wait event types combine different wait events into buckets by similarity. Query Store provides the wait event type, specific wait event name, and the query in question. Being able to correlate this wait information with the query runtime statistics means you can gain a deeper understanding of what contributes to query performance characteristics.

Here are some examples of how you can gain more insights into your workload using the wait statistics in Query Store:

| **Observation** | **Action** |
|---|---|
|High Lock waits | Check the query texts for the affected queries and identify the target entities. Look in Query Store for other queries modifying the same entity, which is executed frequently and/or have high duration. After identifying these queries, consider changing the application logic to improve concurrency, or use a less restrictive isolation level.|
| High Buffer IO waits | Find the queries with a high number of physical reads in Query Store. If they match the queries with high IO waits, consider introducing an index on the underlying entity, in order to do seeks instead of scans. This would minimize the IO overhead of the queries. Check the **Performance Recommendations** for your server in the portal to see if there are index recommendations for this server that would optimize the queries.|
| High Memory waits | Find the top memory consuming queries in Query Store. These queries are probably delaying further progress of the affected queries. Check the **Performance Recommendations** for your server in the portal to see if there are index recommendations that would optimize these queries.|

## Configuration options

When Query Store is enabled it saves data in 15-minute aggregation windows, up to 500 distinct queries per window.

The following options are available for configuring Query Store parameters.

| **Parameter** | **Description** | **Default** | **Range**|
|---|---|---|---|
| pg_qs.query_capture_mode | Sets which statements are tracked. | none | none, top, all |
| pg_qs.max_query_text_length | Sets the maximum query length that can be saved. Longer queries will be truncated. | 6000 | 100 - 10K |
| pg_qs.retention_period_in_days | Sets the retention period. | 7 | 1 - 30 |
| pg_qs.track_utility | Sets whether utility commands are tracked | on | on, off |

The following options apply specifically to wait statistics.

| **Parameter** | **Description** | **Default** | **Range**|
|---|---|---|---|
| pgms_wait_sampling.query_capture_mode | Sets which statements are tracked for wait stats. | none | none, all|
| Pgms_wait_sampling.history_period | Set the frequency, in milliseconds, at which wait events are sampled. | 100 | 1-600000 |

> [!NOTE] 
> **pg_qs.query_capture_mode** supersedes **pgms_wait_sampling.query_capture_mode**. If pg_qs.query_capture_mode is NONE, the pgms_wait_sampling.query_capture_mode setting has no effect.

Use the [Azure portal](how-to-configure-server-parameters-using-portal.md) or [Azure CLI](how-to-configure-server-parameters-using-cli.md) to get or set a different value for a parameter.

## Views and functions

View and manage Query Store using the following views and functions. Anyone in the PostgreSQL public role can use these views to see the data in Query Store. These views are only available in the **azure_sys** database.

Queries are normalized by looking at their structure after removing literals and constants. If two queries are identical except for literal values, they will have the same hash.

### query_store.qs_view

This view returns query text data in Query Store. There is one row for each distinct query_text. The data isn't available via the Intelligent Performance section in the portal, APIs, or the CLI - but It can be found by connecting to azure_sys and querying 'query_store.query_texts_view'.

|**Name**	|**Type** |	**References**	| **Description**|
|---|---|---|---|
|runtime_stats_entry_id	|bigint	| |	ID from the runtime_stats_entries table|
|user_id	|oid	|pg_authid.oid	|OID of user who executed the statement|
|db_id	|oid	|pg_database.oid	|OID of database in which the statement was executed|
|query_id	|bigint	 ||	Internal hash code, computed from the statement's parse tree|
|query_sql_text	|Varchar(10000)	 ||	Text of a representative statement. Different queries with the same structure are clustered together; this text is the text for the first of the queries in the cluster.|
|plan_id	|bigint	|	|ID of the plan corresponding to this query, not available yet|
|start_time	|timestamp	||	Queries are aggregated by time buckets - the time span of a bucket is 15 minutes by default. This is the start time corresponding to the time bucket for this entry.|
|end_time	|timestamp	||	End time corresponding to the time bucket for this entry.|
|calls	|bigint	 ||	Number of times the query executed|
|total_time	|double precision	|| 	Total query execution time, in milliseconds|
|min_time	|double precision	||	Minimum query execution time, in milliseconds|
|max_time	|double precision	||	Maximum query execution time, in milliseconds|
|mean_time	|double precision	||	Mean query execution time, in milliseconds|
|stddev_time|	double precision	||	Standard deviation of the query execution time, in milliseconds |
|rows	|bigint	|| 	Total number of rows retrieved or affected by the statement|
|shared_blks_hit|	bigint	|| 	Total number of shared block cache hits by the statement|
|shared_blks_read|	bigint	||	Total number of shared blocks read by the statement|
|shared_blks_dirtied|	bigint	 ||	Total number of shared blocks dirtied by the statement |
|shared_blks_written|	bigint	|| 	Total number of shared blocks written by the statement|
|local_blks_hit|	bigint ||	Total number of local block cache hits by the statement|
|local_blks_read|	bigint	 ||	Total number of local blocks read by the statement|
|local_blks_dirtied|	bigint	|| 	Total number of local blocks dirtied by the statement|
|local_blks_written|	bigint	|| 	Total number of local blocks written by the statement|
|temp_blks_read	|bigint	 ||	Total number of temp blocks read by the statement|
|temp_blks_written|	bigint	 ||	Total number of temp blocks written by the statement|
|blk_read_time	|double precision	 ||	Total time the statement spent reading blocks, in milliseconds (if track_io_timing is enabled, otherwise zero)|
|blk_write_time	|double precision	 ||	Total time the statement spent writing blocks, in milliseconds (if track_io_timing is enabled, otherwise zero)|

### query_store.query_texts_view

This view returns query text data in Query Store. There is one row for each distinct query_text.

| **Name** | **Type** | **Description** |
|--|--|--|
| query_text_id | bigint | ID for the query_texts table |
| query_sql_text | Varchar(10000) | Text of a representative statement. Different queries with the same structure are clustered together; this text is the text for the first of the queries in the cluster. |

### query_store.pgms_wait_sampling_view

This view returns query text data in Query Store. There is one row for each distinct query_text. The data isn't available via the Intelligent Performance section in the portal, APIs, or the CLI - but It can be found by connecting to azure_sys and querying 'query_store.query_texts_view'.

| **Name** | **Type** | **References** | **Description** |
|--|--|--|--|
| user_id | oid | pg_authid.oid | OID of user who executed the statement |
| db_id | oid | pg_database.oid | OID of database in which the statement was executed |
| query_id | bigint |  | Internal hash code, computed from the statement's parse tree |
| event_type | text |  | The type of event for which the backend is waiting |
| event | text |  | The wait event name if backend is currently waiting |
| calls | Integer |  | Number of the same event captured |

### Functions

Query_store.qs_reset() returns void

`qs_reset` discards all statistics gathered so far by Query Store. This function can only be executed by the server admin role.

Query_store.staging_data_reset() returns void

`staging_data_reset` discards all statistics gathered in memory by Query Store (that is, the data in memory that has not been flushed yet to the database). This function can only be executed by the server admin role.

## Azure Monitor

Azure Database for PostgreSQL is integrated with [Azure Monitor diagnostic settings](../../azure-monitor/essentials/diagnostic-settings.md). Diagnostic settings allows you to send your Postgres logs in JSON format to [Azure Monitor Logs](../../azure-monitor/logs/log-query-overview.md) for analytics and alerting, Event Hubs for streaming, and Azure Storage for archiving.

>[!IMPORTANT]
> This diagnostic feature for is only available in the General Purpose and Memory Optimized pricing tiers.

### Configure diagnostic settings

You can enable diagnostic settings for your Postgres server using the Azure portal, CLI, REST API, and PowerShell. The log categories to configure are **QueryStoreRuntimeStatistics** and **QueryStoreWaitStatistics**.

To enable resource logs using the Azure portal:

1. In the portal, go to Diagnostic Settings in the navigation menu of your Postgres server.
2. Select Add Diagnostic Setting.
3. Name this setting.
4. Select your preferred endpoint (storage account, event hub, log analytics).
5. Select the log types **QueryStoreRuntimeStatistics** and **QueryStoreWaitStatistics**.
6. Save your setting.

To enable this setting using PowerShell, CLI, or REST API, visit the [diagnostic settings article](../../azure-monitor/essentials/diagnostic-settings.md).

### JSON log format

The following tables describes the fields for the two log types. Depending on the output endpoint you choose, the fields included and the order in which they appear may vary.

#### QueryStoreRuntimeStatistics

|**Field** | **Description** |
|---|---|
| TimeGenerated [UTC] | Time stamp when the log was recorded in UTC |
| ResourceId | Postgres server's Azure resource URI |
| Category | `QueryStoreRuntimeStatistics` |
| OperationName | `QueryStoreRuntimeStatisticsEvent` |
| LogicalServerName_s | Postgres server name | 
| runtime_stats_entry_id_s | ID from the runtime_stats_entries table |
| user_id_s | OID of user who executed the statement |
| db_id_s | OID of database in which the statement was executed |
| query_id_s | Internal hash code, computed from the statement's parse tree |
| end_time_s | End time corresponding to the time bucket for this entry |
| calls_s | Number of times the query executed |
| total_time_s | Total query execution time, in milliseconds |
| min_time_s | Minimum query execution time, in milliseconds |
| max_time_s | Maximum query execution time, in milliseconds |
| mean_time_s | Mean query execution time, in milliseconds |
| ResourceGroup | The resource group | 
| SubscriptionId | Your subscription ID |
| ResourceProvider | `Microsoft.DBForPostgreSQL` | 
| Resource | Postgres server name |
| ResourceType | `Servers` |

#### QueryStoreWaitStatistics

|**Field** | **Description** |
|---|---|
| TimeGenerated [UTC] | Time stamp when the log was recorded in UTC |
| ResourceId | Postgres server's Azure resource URI |
| Category | `QueryStoreWaitStatistics` |
| OperationName | `QueryStoreWaitEvent` |
| user_id_s | OID of user who executed the statement |
| db_id_s | OID of database in which the statement was executed |
| query_id_s | Internal hash code of the query |
| calls_s | Number of the same event captured |
| event_type_s | The type of event for which the backend is waiting |
| event_s | The wait event name if the backend is currently waiting |
| start_time_t | Event start time |
| end_time_s | Event end time | 
| LogicalServerName_s | Postgres server name | 
| ResourceGroup | The resource group | 
| SubscriptionId | Your subscription ID |
| ResourceProvider | `Microsoft.DBForPostgreSQL` | 
| Resource | Postgres server name |
| ResourceType | `Servers` |

## Limitations and known issues

- If a PostgreSQL server has the parameter default_transaction_read_only on, Query Store cannot capture data.
- Query Store functionality can be interrupted if it encounters long Unicode queries (>= 6000 bytes).
- [Read replicas](concepts-read-replicas.md) replicate Query Store data from the primary server. This means that a read replica's Query Store does not provide statistics about queries run on the read replica.

## Next steps

- Learn more about [scenarios where Query Store can be especially helpful](concepts-query-store-scenarios.md).
- Learn more about [best practices for using Query Store](concepts-query-store-best-practices.md).
