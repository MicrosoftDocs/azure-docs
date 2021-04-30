---
title: 'Monitoring - Azure Database for MySQL - Flexible Server'
description: This article describes the metrics for monitoring and alerting for Azure Database for MySQL Flexible Server, including CPU, storage, and connection statistics.
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: conceptual
ms.date: 9/21/2020
---

# Monitor Azure Database for MySQL Flexible Servers with built-in metrics

> [!IMPORTANT] 
> Azure Database for MySQL - Flexible Server is currently in public preview.

Azure Database for MySQL Flexible Server provides monitoring of servers through Azure Monitor. Metrics are numerical values that describe some aspect of the resources of your server at a particular time. Monitoring your server's resources helps you troubleshoot and optimize your workload by allowing you to monitor what matters the most to you. Monitoring the right metrics helps you keep the performance, reliability, and availability of your server and applications.

In this article, you will learn about the various metrics available for your flexible server that give insight into the behavior of your server.

## Available metrics

Azure Database for MySQL Flexible Server provides various metrics to understand how your workload is performing and based on this data, you can understand the impact on your server and application. For example, in flexible server, you can monitor **Host CPU percent**, **Active Connections**, **IO percent**, and **Host Memory Percent** to identify when there is a performance impact. From there, you may have to optimize your workload, scale vertically by changing compute tiers, or scaling horizontally by using read replica.

All Azure metrics have a one-minute frequency, and each metric provides 30 days of history. You can configure alerts on the metrics. For step-by-step guidance, see [How to set up alerts](./how-to-alert-on-metric.md). Other tasks include setting up automated actions, performing advanced analytics, and archiving history. For more information, see the [Azure Metrics Overview](../../azure-monitor/data-platform.md).

### List of metrics
These metrics are available for Azure Database for MySQL:

|Metric display name|Metric|Unit|Description|
|---|---|---|---|
|Host CPU percent|cpu_percent|Percent|The percentage of CPU utilization on the server, including CPU utilization from both customer workload and Azure MySQL processes|
|Host Network In |network_bytes_ingress|Bytes|Incoming network traffic on the server, including traffic from both customer database and Azure MySQL features like replication, monitoring, logs etc.|
|Host Network out|network_bytes_egress|Bytes|Outgoing network traffic on the server, including traffic from both customer database and Azure MySQL features like replication, monitoring, logs etc.|
|Replication Lag|replication_lag|Seconds|The time since the last replayed transaction. This metric is available for replica servers only.|
|Active Connections|active_connection|Count|The number of active connections to the server.|
|Backup Storage Used|backup_storage_used|Bytes|The amount of backup storage used.|
|IO percent|io_consumption_percent|Percent|The percentage of IO in use.|
|Host Memory Percent|memory_percent|Percent|The percentage of memory in use on the server, including memory utilization from both customer workload and Azure MySQL processes|
|Storage Limit|storage_limit|Bytes|The maximum storage for this server.|
|Storage Percent|storage_percent|Percent|The percentage of storage used out of the server's maximum.|
|Storage Used|storage_used|Bytes|The amount of storage in use. The storage used by the service may include the database files, transaction logs, and the server logs.|
|Total connections|total_connections|Count|The number of total connections to the server|
|Aborted Connections|aborted_connections|Count|The number of failed attempts to connect to the MySQL, for example, failed connection due to bad credentials.|
|Queries|queries|Count|The number of queries per second|

## Next steps
- See [How to set up alerts](./how-to-alert-on-metric.md) for guidance on creating an alert on a metric.
- Learn more about [scaling IOPS](./concepts/../concepts-compute-storage.md#iops) to improve performance.