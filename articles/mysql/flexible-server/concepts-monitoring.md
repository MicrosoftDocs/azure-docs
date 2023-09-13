---
title: 'Monitoring - Azure Database for MySQL - Flexible Server'
description: This article describes the metrics for monitoring and alerting for Azure Database for MySQL - Flexible Server, including CPU, storage, and connection statistics.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: code-sidd
ms.author: sisawant
ms.date: 9/21/2020
---

# Monitor Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL - Flexible Server provides monitoring of servers through Azure Monitor. Monitoring data about your servers helps you troubleshoot and optimize for your workload.

In this article, you'll learn about the various metrics available and Server logs for your flexible server that give insight into the behavior of your server.

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

## Metrics

Metrics are numerical values that describe some aspect of the resources of your server at a particular time. Monitoring your server's resources helps you troubleshoot and optimize your workload by allowing you to monitor what matters the most to you. Monitoring the right metrics helps you keep the performance, reliability, and availability of your server and applications.

Azure Database for MySQL - Flexible Server provides various metrics to understand how your workload is performing and based on this data, you can understand the impact on your server and application.

All Azure metrics have a one-minute frequency, and each metric provides 30 days of history. You can configure alerts on the metrics. For step-by-step guidance, see [How to set up alerts](./how-to-alert-on-metric.md). Other tasks include setting up automated actions, performing advanced analytics, and archiving history. For more information, see the [Azure Metrics Overview](../../azure-monitor/data-platform.md).


## List of metrics
These metrics are available for Azure Database for MySQL:

|Metric display name|Metric|Unit|Description|
|---|---|---|---|
|Host CPU percent|cpu_percent|Percent|Host CPU percent is total utilization of CPU to process all the tasks on your server over a selected period. This metric includes workload of your Azure Database for MySQL - Flexible Server and Azure MySQL process. High CPU percent can help you find if your database server has more workload than it can handle. This metric is equivalent to total CPU utilization similar to utilization of CPU on any virtual machine.|
|CPU Credit Consumed|cpu_credits_consumed| Count|**This is for Burstable Tier Only** CPU credit is calculated based on workload. See [B-series burstable virtual machine sizes](/azure/virtual-machines/sizes-b-series-burstable) for more information.|
|CPU Credit Remaining|cpu_credits_remaining|Count|**This is for Burstable Tier Only** CPU remaining is calculated based on workload. See [B-series burstable virtual machine sizes](/azure/virtual-machines/sizes-b-series-burstable) for more information.|
|Host Network In |network_bytes_ingress|Bytes|Total sum of incoming network traffic on the server for a selected period. This metric includes traffic to your database and to Azure MySQL features like monitoring, logs etc.|
|Host Network out|network_bytes_egress|Bytes|Total sum of outgoing network traffic on the server for a selected period. This metric includes traffic from your database and from Azure MySQL features like monitoring, logs etc.|
|Active Connections|active_connection|Count|The number of active connections to the server. Active connections are the total number of [threads connected](https://dev.mysql.com/doc/refman/8.0/en/server-status-variables.html#statvar_Threads_connected) to your server, which also includes threads from [azure_superuser](../single-server/how-to-create-users.md).|
|Backup Storage Used|backup_storage_used|Bytes|The amount of backup storage used.|
|Storage IO percent|io_consumption_percent|Percent|The percentage of IO in use over selected period. IO percent is for both read and write IOPS.|
|Storage IO Count|storage_io_count|Count|The total count of I/O operations (both read and write) utilized by server per minute.|
|Host Memory Percent|memory_percent|Percent|The total percentage of memory in use on the server, including memory utilization from both database workload and other Azure MySQL processes. This metric shows total consumption of memory of underlying host similar to consumption of memory on any virtual machine.|
|Storage Limit|storage_limit|Bytes|The maximum storage for this server.|
|Storage Percent|storage_percent|Percent|The percentage of storage used out of the server's maximum.|
|Storage Used|storage_used|Bytes|The amount of storage in use. The storage used by the service may include the database files, transaction logs, and the server logs.|
|Total connections|total_connections|Count|The number of client connections to your Azure Database for MySQL - Flexible Server. Total Connections is sum of connections by clients using TCP/IP protocol over a selected period.|
|Aborted Connections|aborted_connections|Count|Total number of failed attempts to connect to your MySQL server, for example, failed connection due to bad credentials. For more information on aborted connections, you can refer to this [documentation](https://dev.mysql.com/doc/refman/5.7/en/communication-errors.html).|
|Queries|queries|Count|Total number of queries executed per minute on your server. Total count of queries per minute on your server from your database workload and Azure MySQL processes.|
|Slow_queries|slow_queries|Count|The total count of slow queries on your server in the selected time range.|


## Replication metrics

|Metric display name|Metric|Unit|Description|
|---|---|---|---|
|Replication Lag|replication_lag|Seconds|Replication lag is the number of seconds the replica is behind in replaying the transactions received from the source server. This metric is calculated from "Seconds_behind_Master" from the command "SHOW SLAVE STATUS" and is available for replica servers only. For more information, see "[Monitor replication latency](../how-to-troubleshoot-replication-latency.md)"|
|Replica IO Status|replica_io_running|State|Replica IO Status indicates the state of [replication I/O thread](https://dev.mysql.com/doc/refman/8.0/en/replication-implementation-details.html). Metric value is 1 if the I/O thread is running and 0 if not.|
|Replica SQL Status|replica_sql_running|State|Replica SQL Status indicates the state of [replication SQL thread](https://dev.mysql.com/doc/refman/8.0/en/replication-implementation-details.html). Metric value is 1 if the SQL thread is running and 0 if not.|
|HA IO Status|ha_io_running|State|HA IO Status indicates the state of [HA replication](./concepts-high-availability.md). Metric value is 1 if the I/O thread is running and 0 if not.|
|HA SQL Status|ha_sql_running|State|HA SQL Status indicates the state of [HA replication](./concepts-high-availability.md). Metric value is 1 if the SQL thread is running and 0 if not.|


> [!NOTE]
> For [read replicas](./concepts-read-replicas.md) in Azure Database for MySQL - Flexible Server, value of Slave_IO_Running/Replica_IO_Running from MySQL command "[SHOW SLAVE STATUS](https://dev.mysql.com/doc/refman/5.7/en/replication-administration-status.html)" or "[SHOW REPLICA STATUS](https://dev.mysql.com/doc/refman/8.0/en/replication-administration-status.html)" will be denoted as "NO" and should be ignored because Azure MySQL's implementation of replicas does not rely on establishing a connection to communicate with the source server. For genuine status of I/O thread of your read replicas kindly refer to [Replica IO Status](#replication-metrics) from Metrics under Monitoring blade. 


## Enhanced metrics


### DML statistics

|Metric display name|Metric|Unit|Description|
|---|---|---|---|
|Com_select|Com_select|Count|The total count of select statements that have been executed on your server in the selected time range.|
|Com_update|Com_update|Count|The total count of update statements that have been executed on your server in the selected time range.|
|Com_insert|Com_insert|Count|The total count of insert statements that have been executed on your server in the selected time range.|
|Com_delete|Com_delete|Count|The total count of delete statements that have been executed on your server in the selected time range.|


### DDL statistics

|Metric display name|Metric|Unit|Description|
|---|---|---|---|
|Com_create_db|Com_create_db|Count|The total count of create database statements that have been executed on your server in the selected time range.|
|Com_drop_db|Com_drop_db|Count|The total count of drop database statements that have been executed on your server in the selected time range.|
|Com_create_table|Com_create_table|Count|The total count of create table statements that have been executed on your server in the selected time range.|
|Com_drop_table|Com_drop_table|Count|The total count of drop table statements that have been executed on your server in the selected time range.|
|Com_Alter|Com_Alter|Count|The total count of alter table statements that have been executed on your server in the selected time range.|


### Innodb metrics

|Metric display name|Metric|Unit|Description|
|---|---|---|---|
|Innodb_buffer_pool_reads|Innodb_buffer_pool_reads|Count|The total count of logical reads that InnoDB engine couldn't satisfy from the Innodb buffer pool, and had to be fetched from the disk.|
|Innodb_buffer_pool_read_requests|Innodb_buffer_pool_read_requests|Count|The total count of logical read requests to read from the Innodb Buffer pool.|
|Innodb_buffer_pool_pages_free|Innodb_buffer_pool_pages_free|Count|The total count of free pages in InnoDB buffer pool.|
|Innodb_buffer_pool_pages_data|Innodb_buffer_pool_pages_data|Count|The total count of pages in the InnoDB buffer pool containing data. The number includes both dirty and clean pages.|
|Innodb_buffer_pool_pages_dirty|Innodb_buffer_pool_pages_dirty|Count|The total count of pages in the InnoDB buffer pool containing dirty pages.|

## Server logs

In Azure Database for MySQL Server – Flexible Server, users can configure and download server logs to assist with troubleshooting efforts. With this feature enabled, a flexible server starts capturing events of the selected log type and writes them to a file. You can then use the Azure portal and Azure CLI to download the files to work with them.
The server logs feature is disabled by default. For information about how to enable server logs, see [How to enable and download server logs for Azure Database for MySQL - Flexible Server](./how-to-server-logs-portal.md)

To perform a historical analysis of your data, in the Azure portal, on the Diagnostics settings pane for your server, add a diagnostic setting to send the logs to Log Analytics workspace, Azure Storage, or event hubs. For more information, see [Set up diagnostics](./tutorial-query-performance-insights.md#set-up-diagnostics).

**Server logs retention**

When logging is enabled for an Azure Database for MySQL - Flexible Server, logs are available up to seven days from their creation.
If the total size of the available logs exceeds 7 GB, then the oldest files are deleted until space is available.
The 7-GB storage limit for server logs is available free of cost and can't be extended.
Logs are rotated every 24 hours or 7 GB, whichever comes first.


## Next steps
- See [How to set up alerts](./how-to-alert-on-metric.md) for guidance on creating an alert on a metric.
- How to enable and download server logs for Azure Database for MySQL - Flexible Server from [Azure portal](./how-to-server-logs-portal.md) or [Azure CLI](./how-to-server-logs-cli.md)
