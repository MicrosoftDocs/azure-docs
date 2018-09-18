---
title: Monitor and Tune in Azure Database for PostgreSQL
description: This article describes monitoring and tuning features in Azure Database for PostgreSQL.
services: postgresql
author: rachel-msft
ms.author: raagyema
editor: jasonwhowell
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/24/2018
---
# Monitor and tune
Monitoring data about your servers helps you troubleshoot and optimize for your workload. 

## Metrics
Azure Database for PostgreSQL provides various metrics that give insight into the behavior of the resources supporting the PostgreSQL server. Each metric is emitted at a one-minute frequency, and has up to 30 days of history. You can configure alerts on the metrics. For step by step guidance, see [How to set up alerts](howto-alert-on-metric.md). Other tasks include setting up automated actions, performing advanced analytics, and archiving history. For more information, see the [Azure Metrics Overview](../monitoring-and-diagnostics/monitoring-overview-metrics.md).

### List of metrics
These metrics are available for Azure Database for PostgreSQL:

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

## Query Store
[Query Store](concepts-query-store.md) is a public preview feature that keeps track of query performance over time including query runtime statistics and wait events. The feature persists query runtime performance information in a system database named **azure_sys** under the query_store schema. You can control the collection and storage of data via various configuration knobs.

## Query Performance Insight
[Query Performance Insight](concepts-query-performance-insight.md) works in conjunction with Query Store to provide visualizations accessible from the Azure portal. These charts enable you to identify key queries that impact performance. Query Performance Insight is in public preview and is accessible in the **Support + troubleshooting** section of your Azure Database for PostgreSQL server's portal page.

## Performance Recommendations
The [Performance Recommendations](concepts-performance-recommendations.md) feature identifies opportunities to improve workload performance. The public preview release of Performance Recommendations provides you with recommendations for creating new indexes that have the potential to improve the performance of your workloads. To produce index recommendations, the feature takes into consideration various database characteristics, including its schema and the workload as reported by Query Store. After implementing any performance recommendation, customers should test performance to identify the impact of those changes. 

## Next steps
- See [How to set up alerts](howto-alert-on-metric.md) for guidance on creating an alert on a metric.
- For more information on how to access and export metrics using the Azure portal, REST API, or CLI, see the [Azure Metrics Overview](../monitoring-and-diagnostics/monitoring-overview-metrics.md).
