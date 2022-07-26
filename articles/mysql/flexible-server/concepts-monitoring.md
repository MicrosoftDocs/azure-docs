---
title: 'Monitoring - Azure Database for MySQL - Flexible Server'
description: This article describes the metrics for monitoring and alerting for Azure Database for MySQL Flexible Server, including CPU, storage, and connection statistics.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: code-sidd
ms.author: sisawant
ms.date: 9/21/2020
---

# Monitor Azure Database for MySQL Flexible Servers with built-in metrics

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL Flexible Server provides monitoring of servers through Azure Monitor. Metrics are numerical values that describe some aspect of the resources of your server at a particular time. Monitoring your server's resources helps you troubleshoot and optimize your workload by allowing you to monitor what matters the most to you. Monitoring the right metrics helps you keep the performance, reliability, and availability of your server and applications.

In this article, you will learn about the various metrics available for your flexible server that give insight into the behavior of your server.

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

## Available metrics

Azure Database for MySQL Flexible Server provides various metrics to understand how your workload is performing and based on this data, you can understand the impact on your server and application. For example, in flexible server, you can monitor **Host CPU percent**, **Active Connections**, **IO percent**, and **Host Memory Percent** to identify when there is a performance impact. From there, you may have to optimize your workload, scale vertically by changing compute tiers, or scaling horizontally by using read replica.

All Azure metrics have a one-minute frequency, and each metric provides 30 days of history. You can configure alerts on the metrics. For step-by-step guidance, see [How to set up alerts](./how-to-alert-on-metric.md). Other tasks include setting up automated actions, performing advanced analytics, and archiving history. For more information, see the [Azure Metrics Overview](../../azure-monitor/data-platform.md).

### List of metrics
These metrics are available for Azure Database for MySQL:

|Metric display name|Metric|Unit|Description|
|---|---|---|---|
|Host CPU percent|cpu_percent|Percent|Host CPU percent is total utilization of CPU to process all the tasks on your server over a selected period. This metric includes workload of your Azure Database for MySQL Flexible Server and Azure MySQL process. High CPU percent can help you find if your database server has more workload than it can handle. This metric is equivalent to total CPU utilization similar to utilization of CPU on any virtual machine.|
|Host Network In |network_bytes_ingress|Bytes|Total sum of incoming network traffic on the server for a selected period. This metric includes traffic to your database and to Azure MySQL features like monitoring, logs etc.|
|Host Network out|network_bytes_egress|Bytes|Total sum of outgoing network traffic on the server for a selected period. This metric includes traffic from your database and from Azure MySQL features like monitoring, logs etc.|
|Replication Lag|replication_lag|Seconds|Replication lag is the number of seconds the replica is behind in replaying the transactions received from the source server. This metric is calculated from "Seconds_behind_Master" from the command "SHOW SLAVE STATUS" and is available for replica servers only. For more information, see "[Monitor replication latency](../single-server/how-to-troubleshoot-replication-latency.md)"|
|Active Connections|active_connection|Count|The number of active connections to the server. Active connections are the total number of [threads connected](https://dev.mysql.com/doc/refman/8.0/en/server-status-variables.html#statvar_Threads_connected) to your server, which also includes threads from [azure_superuser](../single-server/how-to-create-users.md).|
|Backup Storage Used|backup_storage_used|Bytes|The amount of backup storage used.|
|IO percent|io_consumption_percent|Percent|The percentage of IO in use over selected period. IO percent is for both read and write IOPS.|
|Host Memory Percent|memory_percent|Percent|The total percentage of memory in use on the server, including memory utilization from both database workload and other Azure MySQL processes. This metric shows total consumption of memory of underlying host similar to consumption of memory on any virtual machine.|
|Storage Limit|storage_limit|Bytes|The maximum storage for this server.|
|Storage Percent|storage_percent|Percent|The percentage of storage used out of the server's maximum.|
|Storage Used|storage_used|Bytes|The amount of storage in use. The storage used by the service may include the database files, transaction logs, and the server logs.|
|Total connections|total_connections|Count|The number of client connections to your Azure Database for MySQL Flexible server. Total Connections is sum of connections by clients using TCP/IP protocol over a selected period.|
|Aborted Connections|aborted_connections|Count|Total number of failed attempts to connect to your MySQL server, for example, failed connection due to bad credentials. For more information on aborted connections, you can refer to this [documentation](https://dev.mysql.com/doc/refman/5.7/en/communication-errors.html).|
|Queries|queries|Count|Total number of queries executed per minute on your server. Total count of queries per minute on your server from your database workload and Azure MySQL processes.|

## Next steps
- See [How to set up alerts](./how-to-alert-on-metric.md) for guidance on creating an alert on a metric.
- Learn more about [scaling IOPS](./concepts/../concepts-compute-storage.md#iops) to improve performance.