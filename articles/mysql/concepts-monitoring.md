---
title: Monitoring in Azure Database for MySQL
description: This article describes the metrics for monitoring and alerting for Azure Database for MySQL, including CPU, storage, and connection statistics.
services: mysql
author: rachel-msft
ms.author: raagyema
manager: kfile
editor: jasonwhowell
ms.service: mysql
ms.topic: article
ms.date: 03/15/2018
---
# Monitoring in Azure Database for MySQL
Monitoring data about your servers helps you troubleshoot and optimize for your workload. Azure Database for MySQL provides various metrics that give insight into the behavior of the resources supporting the MySQL server. 

## Metrics
All Azure metrics have a one-minute frequency, and each metric provides 30 days of history. You can configure alerts on the metrics. For step by step guidance, see [How to set up alerts](howto-alert-on-metric.md). Other tasks include setting up automated actions, performing advanced analytics, and archiving history. For more information, see the [Azure Metrics Overview](../monitoring-and-diagnostics/monitoring-overview-metrics.md).

### List of metrics
These metrics are available for Azure Database for MySQL:

|Metric|Metric Display Name|Unit|Description|
|---|---|---|---|---|
|cpu_percent|CPU percent|Percent|The percentage of CPU in use.|
|memory_percent|Memory percent|Percent|The percentage of memory in use.|
|io_consumption_percent|IO percent|Percent|The percentage of IO in use.|
|storage_percent|Storage percentage|Percent|The percentage of storage used out of the server's maximum.|
|storage_used|Storage used|Bytes|The amount of storage in use. The storage used by the service includes the database files, transaction logs, and the server logs.|
|storage_limit|Storage limit|Bytes|The maximum storage for this server.|
|active_connections|Total active connections|Count|The number of active connections to the server.|
|connections_failed|Total failed connections|Count|The number of failed connections to the server.|


## Next steps
- See [How to set up alerts](howto-alert-on-metric.md) for guidance on creating an alert on a metric.
- For more information on how to access and export metrics using the Azure portal, REST API, or CLI, see the [Azure Metrics Overview](../monitoring-and-diagnostics/monitoring-overview-metrics.md).
