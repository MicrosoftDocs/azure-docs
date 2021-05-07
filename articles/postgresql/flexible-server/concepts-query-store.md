---
title: Query Store - Azure Database for PostgreSQL - Flex Server
description: This article describes the Query Store feature in Azure Database for PostgreSQL - Flex Server.
author: ssen-msft
ms.author: ssen
ms.service: postgresql
ms.topic: conceptual
ms.date: 04/01/2021
---
# Monitor Performance with Query Store
**Applies to:** Azure Database for PostgreSQL - Flex Server versions 11 and above

The Query Store feature in Azure Database for PostgreSQL provides a way to track query performance over time. Query Store simplifies performance-troubleshooting by helping you quickly find the longest running and most resource-intensive queries. Query Store automatically captures a history of queries and runtime statistics, and it retains them for your review. It slices the data by time so that you can see temporal usage patterns. Data for all users, databases and queries is stored in a database named **azure_sys** in the Azure Database for PostgreSQL instance.

> [!IMPORTANT]
> Do not modify the **azure_sys** database or its schema. Doing so will prevent Query Store and related performance features from functioning correctly.
## Enabling Query Store
Query Store is an opt-in feature, so it isn't enabled by default on a server. Query store is enabled or disabled globally for all databases on a given server and cannot be turned on or off per database.
### Enable Query Store using the Azure portal
1. Sign in to the Azure portal and select your Azure Database for PostgreSQL server.
2. Select **Server Parameters** in the **Settings** section of the menu.
3. Search for the `pg_qs.query_capture_mode` parameter.
4. Set the value to `TOP` or `ALL` and **Save**.
Allow up to 20 minutes for the first batch of data to persist in the azure_sys database.
## Information in Query Store
Query Store has one store:
- A runtime stats store for persisting the query execution statistics information.

Common scenarios for using Query Store include:
- Determining the number of times a query was executed in a given time window
- Comparing the average execution time of a query across time windows to see large deltas
- Identifying longest running queries in the past few hours
To minimize space usage, the runtime execution statistics in the runtime stats store are aggregated over a fixed, configurable time window. The information in these stores can be queried using views.
## Access Query Store information
Query Store data is stored in the azure_sys database on your Postgres server. 
The following query returns information about queries in Query Store:
```sql
SELECT * FROM query_store.qs_view; 
``` 

## Configuration options
When Query Store is enabled it saves data in 15-minute aggregation windows, up to 500 distinct queries per window. 
The following options are available for configuring Query Store parameters.

| **Parameter** | **Description** | **Default** | **Range**|
|---|---|---|---|
| pg_qs.query_capture_mode | Sets which statements are tracked. | none | none, top, all |
| pg_qs.max_query_text_length | Sets the maximum query length that can be saved. Longer queries will be truncated. | 6000 | 100 - 10K |
| pg_qs.retention_period_in_days | Sets the retention period. | 7 | 1 - 30 |
| pg_qs.track_utility | Sets whether utility commands are tracked | on | on, off |

Use the [Azure portal](howto-configure-server-parameters-using-portal.md) to get or set a different value for a parameter.

## Views and functions
View and manage Query Store using the following views and functions. Anyone in the PostgreSQL public role can use these views to see the data in Query Store. These views are only available in the **azure_sys** database.
Queries are normalized by looking at their structure after removing literals and constants. If two queries are identical except for literal values, they will have the same queryId.
### query_store.qs_view
This view returns all the data in Query Store. There is one row for each distinct database ID, user ID, and query ID. 

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

### Functions
`qs_reset` discards all statistics gathered so far by Query Store. This function can only be executed by the server admin role.

`staging_data_reset` discards all statistics gathered in memory by Query Store (that is, the data in memory that has not been flushed yet to the database). This function can only be executed by the server admin role.

## Limitations and known issues
- If a PostgreSQL server has the parameter default_transaction_read_only on, Query Store will not capture any data.
## Next steps
- Learn more about [scenarios where Query Store can be especially helpful](concepts-query-store-scenarios.md).
- Learn more about [best practices for using Query Store](concepts-query-store-best-practices.md).
