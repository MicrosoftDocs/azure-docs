---
title: Query Store in Azure Database for PostgreSQL
description: This article describes the Query Store feature in Azure Database for PostgreSQL.
services: postgresql
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/24/2018
---
# Query Store

This feature is in Public Preview.

Applies to: Azure Database for PostgreSQL 9.6, 10

The Azure Database for PostgreSQL Query Store feature provides a means of tracking query performance over time. Query Store simplifies performance troubleshooting by helping you quickly find the longest running and most resource-intensive queries. Query Store automatically captures a history of queries and runtime statistics, and it retains these for your review. It separates data by time windows so that you can see database usage patterns. You can configure Query Store using the Azure portal or CLI. Data for all users, all databases, all queries is stored in a database named **azure_sys** in the Azure Database for PostgreSQL instance.

## Enabling Query Store
Query Store is not active for new servers by default.
It is enabled or disabled for all the databases on a given server and cannot be turned on or off on a per database basis.

### Enable Query Store by using the Azure portal
1. Log in to the Azure portal.
2. Select Server Parameters.
3. Select the parameter pg_qs.query_capture_mode
4. Update the value from "None" to "ALL".

!!! todo CLI option !!!

## Information in Query Store
The first step in troubleshooting query performance problems is to identify which queries are running for the longest period and which queries are consuming the most resources.

Wait statistics, which show the queries that wait most on which resources, are another source of information to help troubleshoot query performance in PostgreSQL.

Query Store contains two stores:
- A runtime stats store for persisting the execution statistics information.
- A wait stats store for persisting wait statistics information.

Common scenarios for using Query Store include:
- Determining the number of times a query was executed in a given time window, assisting a DBA in troubleshooting performance resource problems.
- Identifying top n queries (by execution time, resource consumption, etc.) in the past x hours.
- Identifying top n queries that are waiting on resources.
- Understanding wait nature for a particular query.

To minimize space usage, the runtime execution statistics in the runtime stats store are aggregated over a fixed, configurable time window. The information in these stores is visible by querying the query store views.

The following query returns information about queries in Query Store.

SELECT * FROM query_store.qs_view;  

Or this query for wait stats:
SELECT * FROM query_store.pgms_wait_sampling_view; 

!!! todo put this in the SQL stylized box !!!

## Finding wait queries
Wait event types combine different wait types into buckets similar by nature. Different wait event types require different follow-up analyses to resolve the issue, but wait types from the same category lead to very similar troubleshooting experiences, and providing the affected query on top of waits would be the missing piece to complete the majority of such investigations successfully.

Here are some examples of how you can get more insights into your workload from the wait statistics in Query Store:

| **Observation** | **Action** |
|---|---|
|High Lock waits in Query Store for specific queries | Check the query texts for the affected queries and identify the target entities. Look in Query Store for other queries modifying the same entity, which are executed frequently and/or have high duration. After identifying these queries, consider changing the application logic to improve concurrency, or use a less restrictive isolation level.|
| High Buffer IO waits in Query Store for specific queries | Find the queries with a high number of physical reads in Query Store. If they match the queries with high IO waits, consider introducing an index on the underlying entity, in order to do seeks instead of scans, and thus minimize the IO overhead of the queries. Check the Performance Recommendations blade to see if there are index recommendations that would optimize these queries.|
| High Memory waits in Query Store for specific queries | Find the top memory consuming queries in Query Store. These queries are probably delaying further progress of the affected queries. Check the Performance Recommendations blade to see if there are index recommendations that would optimize these queries.|

Configuration options
The following options are available for configuring Query Store parameters.
| **Parameter** | **Description** | **Default** | **Range**|
|---|---|---|---|
| pg_qs.query_capture_mode | Sets which statements are tracked. | top | none, top, all |
| pg_qs.max_query_text_length | Sets the maximum query length that can be saved. Longer queries will be truncated. | 6000 | 100 - 10K |
| pg_qs.retention_period_in_days | Sets the retention period. | 7 | 1 - 30 |
| pg_qs.track_utility | Sets whether utility commands are tracked | on | on, off |

The following options apply specifically to wait statistics.
| **Parameter** | **Description** | **Default** | **Range**|
|---|---|---|---|
| pgms_wait_sampling.query_capture_mode | Sets which statements are tracked for wait stats. | none | none, all|
| Pgms_wait_sampling.history_period | Set the frequency, in milliseconds, at which wait events are sampled. | 100 | 1-600000 |

Use the [Azure portal](howto-configure-server-logs-in-portal.md) or [Azure CLI](howto-configure-server-logs-using-cli.md) to get or set a different value for a parameter.

## Views and functions
View and manage Query Store using the following views and functions.

Anyone in the public role can run these views to see the data stored in Query Store. Note that this is only available in the azure_sys database.
Queries are normalized by looking at their structure - after removing literals and constants. Thus if two queries are identical except for literal values and execute within the same time window, they will have the same hash, and they will have one entry in the view.

### query_store.qs_view
This view returns all the data in Query Store. This view contains one row for each distinct database ID, user ID and query ID (up to the maximum number of distinct statements that the module can track).

|**Name**	|**Type** |	**References**	| **Description**|
|---|---|---|---|
|runtime_stats_entry_id	|bigint	| |	Id from the runtime_stats_entries table|
|user_id	|oid	|pg_authid.oid	|OID of user who executed the statement|
|db_id	|oid	|pg_database.oid	|OID of database in which the statement was executed|
|query_id	|bigint	 ||	Internal hash code, computed from the statement's parse tree|
|query_sql_text	|Varchar(10000)	 ||	Text of a representative statement. Different queries with the same structure are clustered together; this text is the text for the first of the queries in the cluster.|
|plan_id	|bigint	|	|Id of the plan corresponding to this query, not available yet|
|start_time	|timestamp	||	Queries are aggregated by time buckets - the time span of a bucket is 15 minutes by default but configurable. This is the start time corresponding to the time bucket for this entry.|
|end_time	|timestamp	||	This is the end time corresponding to the time bucket for this entry.|
|calls	|bigint	 ||	Number of times the query executed|
|total_time	|double precision	|| 	Total query execution time, in milliseconds|
|min_time	|double precision	||	The minimum query execution time, in milliseconds|
|max_time	|double precision	||	The maximum query execution time, in milliseconds|
|mean_time	|double precision	||	The mean query execution time, in milliseconds|
|stddev_time|	double precision	||	The standard deviation of the query execution time, in milliseconds |
|rows	|bigint	|| 	Total number of rows retrieved or affected by the statement|
|shared_blks_hit|	bigint	|| 	Total number of shared block cache hits by the statement|
|shared_blks_read|	bigint	||	Total number of shared blocks read by the statement|
|shared_blks_dirtied|	bigint	 ||	Total number of shared blocks dirtied by the statement |
|shared_blks_written|	bigint	|| 	Total number of shared blocks written by the statement|
|local_blks_hit|	bigint ||	Total number of local block cache hits by the statement|
|local_blks_read|	bigint	 ||	Total number of local blocks read by the statement|
|local_blks_dirtied|	bigint	|| 	Total number of local blocks dirtied by the statement|
|local_blks_written|	bigint	|| 	Total number of local blocks written by the statemen|
|temp_blks_read	|bigint	 ||	Total number of temp blocks read by the statement|
|temp_blks_written|	bigint	 ||	Total number of temp blocks written by the statement|
|blk_read_time	|double precision	 ||	Total time the statement spent reading blocks, in milliseconds (if track_io_timing is enabled, otherwise zero)|
|blk_write_time	|double precision	 ||	Total time the statement spent writing blocks, in milliseconds (if track_io_timing is enabled, otherwise zero)|
	
### query_store.query_texts_view
This view returns query_text data in Query Store. This view contains one row for each distinct query_text (up to the maximum number of distinct query_texts that the module can track).

|**Name**|	**Type**|	**Description**|
|---|---|---|
|query_text_id	|bigint		|Id for the query_texts table|
|query_sql_text	|Varchar(10000)	 	|Text of a representative statement. Different queries with the same structure are clustered together; this text is the text for the first of the queries in the cluster.|

### query_store.runtime_stats_intervals_view
This view returns runtime_stats_intervals data in Query Store. This view contains one row for each distinct interval (up to the maximum number of distinct intervals that the module can track).

|**Name**|	**Type**|		**Description**|
|---|---|---|
|runtime_stats_interval_id	|bigint		|Id for the runtime_stats_intervals table|
|start_time	|timestamp		|Queries are aggregated by time buckets - the time span of a bucket is 15 minutes by default but configurable. This is the start time corresponding to the time bucket for this entry.|
|end_time	|timestamp		|This is the end time corresponding to the time bucket for this entry.|
|comment	|Varchar(1000)		|User comment|

### query_store.pgms_wait_sampling_view
This view returns wait events data in Query Store. This view contains one row for each distinct database ID, user ID, query ID and event(up to the maximum number of distinct statements that the module can track). 

|**Name**|	**Type**|	**References**|	**Description**|
|---|---|---|---|
|user_id	|oid	|pg_authid.oid	|OID of user who executed the statement|
|db_id	|oid	|pg_database.oid	|OID of database in which the statement was executed|
|query_id	|bigint	 	||Internal hash code, computed from the statement's parse tree|
|event_type	|text	 	||The type of event for which the backend is waiting|
|event	|text		||The wait event name if backend is currently waiting|
|calls	|Integer		||Number of same event captured|


### Functions
Query_store.qs_reset() returns void
qs_reset discards all statistics gathered so far by pg_qs. This function can only be executed by db admins.

Query_store.staging_data_reset() returns void
pg_staging_data_reset discards all statistics gathered so far by pg_qs in memory (i.e. the data in memory that has not been flushed yet to the database). This function can only be executed by db admins.