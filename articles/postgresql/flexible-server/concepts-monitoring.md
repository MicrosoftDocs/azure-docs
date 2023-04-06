---
title: Monitoring and metrics - Azure Database for PostgreSQL - Flexible Server
description: This article describes monitoring and metrics features in Azure Database for PostgreSQL - Flexible Server.
author: varun-dhawan
ms.author: varundhawan
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# Monitor metrics on Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Monitoring data about your servers helps you troubleshoot and optimize for your workload. Azure Database for PostgreSQL provides various monitoring options to provide insight into the behavior of your server.

## Metrics
Azure Database for PostgreSQL provides various metrics that give insight into the behavior of the resources supporting the PostgreSQL server. Each metric is emitted at a one-minute frequency, and has up to [93 days of history](../../azure-monitor/essentials/data-platform-metrics.md#retention-of-metrics). You can configure alerts on the metrics. Other options include setting up automated actions, performing advanced analytics, and archiving history. For more information, see the [Azure Metrics Overview](../../azure-monitor/essentials/data-platform-metrics.md).

### List of metrics
The following metrics are available for PostgreSQL flexible server:

|Display Name                |Metric ID                  |Unit      |Description                                                                                                                                                                                                                                                                                                                                                                 |
|----------------------------|---------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|**Active Connections**          |active_connections         |Count     |The number of connections to your server.                                                                                                                                                                                                                                                                                                                                   |
|**Backup Storage Used**         |backup_storage_used        |Bytes     |Amount of backup storage used. This metric represents the sum of storage consumed by all the full backups, differential backups, and log backups retained based on the backup retention period set for the server. The frequency of the backups is service managed. For geo-redundant storage, backup storage usage is twice that of the locally redundant storage.|
|**Failed Connections**          |connections_failed         |Count     |Failed connections.                                                                                                                                                                                                                                                                                                                                                         |
|**Succeeded Connections**       |connections_succeeded      |Count     |Succeeded connections.                                                                                                                                                                                                                                                                                                                                                      |
|**CPU Credits Consumed**        |cpu_credits_consumed       |Count     |Number of credits used by the flexible server. Applicable to Burstable tier.                                                                                                                                                                                                                                                                                                |
|**CPU Credits Remaining**       |cpu_credits_remaining      |Count     |Number of credits available to burst. Applicable to Burstable tier.                                                                                                                                                                                                                                                                                                         |
|**CPU percent**                 |cpu_percent                |Percent   |Percentage of CPU in use.                                                                                                                                                                                                                                                                                                                                                   |
|**Disk Queue Depth**            |disk_queue_depth           |Count     |Number of outstanding I/O operations to the data disk.                                                                                                                                                                                                                                                                                                                      |
|**IOPS**                        |iops                       |Count     |Number of I/O operations to disk per second.                                                                                                                                                                                                                                                                                                                                |
|**Maximum Used Transaction IDs**|maximum_used_transactionIDs|Count     |Maximum transaction ID in use.                                                                                                                                                                                                                                                                                                                                              |
|**Memory percent**              |memory_percent             |Percent   |Percentage of memory in use.                                                                                                                                                                                                                                                                                                                                                |
|**Network Out**                 |network_bytes_egress       |Bytes     |Amount of outgoing network traffic.                                                                                                                                                                                                                                                                                                                                         |
|**Network In**                  |network_bytes_ingress      |Bytes     |Amount of incoming network traffic.                                                                                                                                                                                                                                                                                                                                         |
|**Read IOPS**                   |read_iops                  |Count     |Number of data disk I/O read operations per second.                                                                                                                                                                                                                                                                                                                         |
|**Read Throughput**             |read_throughput            |Bytes     |Bytes read per second from disk.                                                                                                                                                                                                                                                                                                                                            |
|**Storage Free**                |storage_free               |Bytes     |The amount of storage space available.                                                                                                                                                                                                                                                                                                                                      |
|**Storage percent**             |storage_percent            |Percentage|Percent of storage space used. The storage used by the service may include the database files, transaction logs, and the server logs.                                                                                                                                                                                                                                       |
|**Storage Used**                |storage_used               |Bytes     |Amount of storage space used. The storage used by the service may include the database files, transaction logs, and the server logs.                                                                                                                                                                                                                                       |
|**Transaction Log Storage Used**|txlogs_storage_used        |Bytes     |Amount of storage space used by the transaction logs.                                                                                                                                                                                                                                                                                                                       |
|**Write Throughput**            |write_throughput           |Bytes     |Bytes written per second to disk.                                                                                                                                                                                                                                                                                                                                           |
|**Write IOPS**                  |write_iops                 |Count     |Number of data disk I/O write operations per second.                                                                                                                                                                                                                                                                                                                        |

## Enhanced Metrics

Introducing Enhanced Metrics for Azure Database for PostgreSQL Flexible Server to enable more fine grained monitoring and alerting on databases. You can configure alerts on the metrics. In addition, some of these new Metrics now also include ‘Dimension’ that will allow to split and filter the metrics data by using the allowed dimension such as Database Name, State etc. 

#### Enabling enhanced metrics

- Most of these new metrics are _disabled_ by default, barring a few exceptions (per the list below) 
- To enable these metrics, please turn ON the server parameter `metrics.collector_database_activity`. This parameter is dynamic, and will not require instance restart.

#### List of enhanced metrics

##### Activity

|Display Name                           |Metric ID                   |Unit   |Description                                                                                                                                                                   |Dimension      |Default enabled   |
|---------------------------------------|----------------------------|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|------------------|
|**Sessions By State** (Preview)        |sessions_by_state           |Count  |Overall state of the backends                                                                                                                                                 |State          |No                |
|**Sessions By WaitEventType** (Preview)|sessions_by_wait_event_type |Count  |Sessions by the type of event for which the backend is waiting                                                                                                                |Wait Event Type|No                |
|**Oldest Backend** (Preview)           |oldest_backend_time_sec     |Seconds|The age in seconds of the oldest backend (irrespective of the state)                                                                                                          |N/a            |No                |
|**Oldest Query** (Preview)             |longest_query_time_sec      |Seconds|The age in seconds of the longest query that is currently running                                                                                                             |N/a            |No                |
|**Oldest Transaction** (Preview)       |longest_transaction_time_sec|Seconds|The age in seconds of the longest transaction (including idle transactions)                                                                                                   |N/a            |No                |
|**Oldest xmin** (Preview)              |oldest_backend_xmin         |Count  |The actual value of the oldest xmin. If xmin is not increasing it indicates there are some long running transactions that can potentially hold dead tuples from being removed |N/a            |No                |
|**Oldest xmin Age** (Preview)          |oldest_backend_xmin_age     |Count  |Age in units of the oldest xmin. It indicated how many transactions passed since oldest xmin                                                                                  |N/a            |No                |

##### Database

|Display Name                         |Metric ID    |Unit |Description                                                                                         |Dimension    |Default enabled   |
|-------------------------------------|-------------|-----|----------------------------------------------------------------------------------------------------|-------------|------------------|
|**Backends** (Preview)                   |numbackends  |Count|Number of backends connected to this database                                                       |Database Name|No                |
|**Deadlocks** (Preview)                  |deadlocks    |Count|Number of deadlocks detected in this database                                                       |Database Name|No                |
|**Disk Blocks Hit** (Preview)            |blks_hit     |Count|Number of times disk blocks were found already in the buffer cache, so that a read was not necessary|Database Name|No                |
|**Disk Blocks Read** (Preview)           |blks_read    |Count|Number of disk blocks read in this database                                                         |Database Name|No                |
|**Temporary Files** (Preview)            |temp_files   |Count|Number of temporary files created by queries in this database                                       |Database Name|No                |
|**Temporary Files Size** (Preview)       |temp_bytes   |Bytes|Total amount of data written to temporary files by queries in this database                         |Database Name|No                |
|**Total Transactions** (Preview)         |xact_total   |Count|Number of total transactions executed in this database                                              |Database Name|No                |
|**Transactions Committed** (Preview)     |xact_commit  |Count|Number of transactions in this database that have been committed                                    |Database Name|No                |
|**Transactions Rolled back** (Preview)   |xact_rollback|Count|Number of transactions in this database that have been rolled back                                  |Database Name|No                |
|**Tuples Deleted** (Preview)             |tup_deleted  |Count|Number of rows deleted by queries in this database                                                  |Database Name|No                |
|**Tuples Fetched** (Preview)             |tup_fetched  |Count|Number of rows fetched by queries in this database                                                  |Database Name|No                |
|**Tuples Inserted** (Preview)            |tup_inserted |Count|Number of rows inserted by queries in this database                                                 |Database Name|No                |
|**Tuples Returned** (Preview)            |tup_returned |Count|Number of rows returned by queries in this database                                                 |Database Name|No                |
|**Tuples Updated** (Preview)             |tup_updated  |Count|Number of rows updated by queries in this database                                                  |Database Name|No                |

##### Logical Replication

|Display Name                         |Metric ID                         |Unit |Description                                     |Dimension|Default enabled   |
|-------------------------------------|----------------------------------|-----|------------------------------------------------|---------|------------------|
|**Max Logical Replication Lag** (Preview)|logical_replication_delay_in_bytes|Bytes|Maximum lag across all logical replication slots|N/a      |Yes               |

##### Replication

|Display Name                          |Metric ID                            |Unit   |Description                                                   |Dimension|Default enabled   |
|--------------------------------------|-------------------------------------|-------|--------------------------------------------------------------|---------|------------------|
|**Max Physical Replication Lag** (Preview)|physical_replication_delay_in_bytes  |Bytes  |Maximum lag across all asynchronous physical replication slots|N/a      |Yes               |
|**Read Replica Lag** (Preview)            |physical_replication_delay_in_seconds|Seconds|Read Replica lag in seconds                                   |N/a      |Yes               |


##### Saturation

|Display Name                           |Metric ID                         |Unit   |Description                                          |Dimension|Default enabled   |
|---------------------------------------|----------------------------------|-------|-----------------------------------------------------|---------|------------------|
|**Disk Bandwidth Consumed Percentage**|disk_bandwidth_consumed_percentage|Percent|Percentage of data disk bandwidth consumed per minute|N/a      |Yes               |
|**Disk IOPS Consumed Percentage**     |disk_iops_consumed_percentage     |Percent|Percentage of data disk I/Os consumed per minute     |N/a      |Yes               |

##### Traffic

|Display Name|Metric ID             |Unit |Description                                                    |Dimension|Default enabled   |
|-------------------|---------------|-----|---------------------------------------------------------------|---------|------------------|
|**Max Connections^**    |max_connections|Count|Max Connections                                            |N/a      |Yes               |

^ **Max Connections** here represents the configured value for _max_connections_ server parameter, and this metric is pooled every 30 minutes.

#### Considerations when using the enhanced metrics

- There is **50 database** limit on metrics with `database name` dimension.
  * On **Burstable** SKU -  this limit is 10 `database name` dimension
- `database name` dimension limit is applied on OiD column (in other words _Order-of-Creation_ of the database)
- The `database name` in metrics dimension is **case insensitive**. Therefore the metrics for same database names in varying case (_ex. foo, FoO, FOO_) will be merged, and may not show accurate data.

## Autovacuum metrics

Autovaccum metrics can be used to monitor and tune autovaccum performance for Azure database for postgres flexible server. Each metric is emitted at a **30 minute** frequency, and has up to **93 days** of retention. Customers can configure alerts on the metrics and can also access the new metrics dimensions, to split and filter the metrics data on database name.

#### Enabling Autovacuum metrics
* Autovacuum metrics are disabled by default
* To enable these metrics, please turn ON the server parameter `metrics.autovacuum_diagnostics`. 
  * This parameter is dynamic, hence will not require instance restart.

#### List of Autovacuum metrics

|Display Name                                     |Metric ID                      |Unit |Description                                                                                             |Dimension   |Default enabled|
|-------------------------------------------------|-------------------------------|-----|--------------------------------------------------------------------------------------------------------|------------|---------------|
|**Analyze Counter User Tables** (Preview)        |analyze_count_user_tables      |Count|Number of times user only tables have been manually analyzed in this database                           |DatabaseName|No             |
|**AutoAnalyze Counter User Tables** (Preview)    |autoanalyze_count_user_tables  |Count|Number of times user only tables have been analyzed by the autovacuum daemon in this database           |DatabaseName|No             |
|**AutoVacuum Counter User Tables** (Preview)     |autovacuum_count_user_tables   |Count|Number of times user only tables have been vacuumed by the autovacuum daemon in this database           |DatabaseName|No             |
|**Estimated Dead Rows User Tables** (Preview)    |n_dead_tup_user_tables         |Count|Estimated number of dead rows for user only tables in this database                                     |DatabaseName|No             |
|**Estimated Live Rows User Tables** (Preview)    |n_live_tup_user_tables         |Count|Estimated number of live rows for user only tables in this database                                     |DatabaseName|No             |
|**Estimated Modifications User Tables** (Preview)|n_mod_since_analyze_user_tables|Count|Estimated number of rows modified since user only tables were last analyzed                             |DatabaseName|No             |
|**User Tables Analyzed** (Preview)               |tables_analyzed_user_tables    |Count|Number of user only tables that have been analyzed in this database                                     |DatabaseName|No             |
|**User Tables AutoAnalyzed** (Preview)           |tables_autoanalyzed_user_tables|Count|Number of user only tables that have been analyzed by the autovacuum daemon in this database            |DatabaseName|No             |
|**User Tables AutoVacuumed** (Preview)           |tables_autovacuumed_user_tables|Count|Number of user only tables that have been vacuumed by the autovacuum daemon in this database            |DatabaseName|No             |
|**User Tables Counter** (Preview)                |tables_counter_user_tables     |Count|Number of user only tables in this database                                                             |DatabaseName|No             |
|**User Tables Vacuumed** (Preview)               |tables_vacuumed_user_tables    |Count|Number of user only tables that have been vacuumed in this database                                     |DatabaseName|No             |
|**Vacuum Counter User Tables** (Preview)         |vacuum_count_user_tables       |Count|Number of times user only tables have been manually vacuumed in this database (not counting VACUUM FULL)|DatabaseName|No             |

#### Considerations when using the autovacuum metrics

- There is **30 database** limit on metrics with `database name` dimension.
  * On **Burstable** SKU -  this limit is 10 `database name` dimension
- `database name` dimension limit is applied on OiD column (in other words _Order-of-Creation_ of the database)

## PgBouncer metrics

PgBouncer metrics can be used for monitoring the performance of PgBouncer process, including details for active connections, Idle connections, Total pooled connections, number of connection pools etc. Each metric is emitted at a **30 minute** frequency and has up to **93 days** of history. Customers can configure alerts on the metrics and can also access the new metrics dimensions, to split and filter the metrics data on database name.

#### Enabling PgBouncer metrics
* PgBouncer metrics are disabled by default.
* For Pgbouncer metrics to work, both the server parameters `pgbouncer.enabled` and `metrics.pgbouncer_diagnostics` have to be enabled.
  * These parameters are dynamic, and will not require instance restart.

#### List of PgBouncer metrics

|Display Name                            |Metrics ID                |Unit |Description                                                                          |Dimension   |Default enabled|
|----------------------------------------|--------------------------|-----|-------------------------------------------------------------------------------------|------------|---------------|
|**Active client connections** (Preview) |client_connections_active |Count|Connections from clients which are associated with a PostgreSQL connection           |DatabaseName|No             |
|**Waiting client connections** (Preview)|client_connections_waiting|Count|Connections from clients that are waiting for a PostgreSQL connection to service them|DatabaseName|No             |
|**Active server connections** (Preview) |server_connections_active |Count|Connections to PostgreSQL that are in use by a client connection                     |DatabaseName|No             |
|**Idle server connections** (Preview)   |server_connections_idle   |Count|Connections to PostgreSQL that are idle, ready to service a new client connection    |DatabaseName|No             |
|**Total pooled connections** (Preview)  |total_pooled_connections  |Count|Current number of pooled connections                                                 |DatabaseName|No             |
|**Number of connection pools** (Preview)|num_pools                 |Count|Total number of connection pools                                                     |DatabaseName|No             |

#### Considerations when using the PgBouncer metrics

- There is **30 database** limit on metrics with `database name` dimension.
  * On **Burstable** SKU -  this limit is 10 `database name` dimension.
- `database name` dimension limit is applied on OiD column (in other words _Order-of-Creation_ of the database)

## Applying filters and splitting on metrics with dimension

In the above list of metrics, some of the metrics have dimension such as `database name`, `state` etc. [Filtering](../../azure-monitor/essentials/metrics-charts.md#filters) and [Splitting](../../azure-monitor/essentials/metrics-charts.md#apply-splitting) are allowed for the metrics that have dimensions. These features show how various metric segments ("dimension values") affect the overall value of the metric. You can use them to identify possible outliers.

* **Filtering** lets you choose which dimension values are included in the chart. For example, you might want to show idle connections when you chart the `Sessions-by-State`  metric. You apply the filter on the __idle__ on __state__ dimension.
* **Splitting** controls whether the chart displays separate lines for each value of a dimension or aggregates the values into a single line. For example, you can see one line for an `Sessions-by-State` metric across all sessions. Or you can see separate lines for each session grouped by their `state`. You apply splitting on the `State` dimension to see separate lines. 

Here in this example below, we have done **splitting** by `State` dimension and **filtered** on a specific `state` types.

![Screenshot of sessions by state.](https://user-images.githubusercontent.com/19426853/196329577-dc1c1cc0-4fcb-4ab7-a466-025425d57844.png)

For more details on setting-up charts with dimensional metrics, see [Metric chart examples](../../azure-monitor/essentials/metric-chart-samples.md)

## Server logs
In addition to the metrics, Azure Database for PostgreSQL also allows you to configure and access PostgreSQL standard logs. To learn more about logs, visit the [logging concepts doc](concepts-logging.md).
