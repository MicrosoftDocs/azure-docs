---
title: Monitor and tune - Azure Database for PostgreSQL - Single Server
description: This article describes monitoring and tuning features in Azure Database for PostgreSQL - Single Server.
author: sunilagarwal
ms.author: sunila
ms.service: postgresql
ms.topic: conceptual
ms.date: 10/21/2020
---

# Monitor and tune Azure Database for PostgreSQL - Single Server
Monitoring data about your servers helps you troubleshoot and optimize for your workload. Azure Database for PostgreSQL provides various monitoring options to provide insight into the behavior of your server.

## Metrics
Azure Database for PostgreSQL provides various metrics that give insight into the behavior of the resources supporting the PostgreSQL server. Each metric is emitted at a one-minute frequency, and has up to [93 days of history](../azure-monitor/essentials/data-platform-metrics.md#retention-of-metrics). You can configure alerts on the metrics. For step by step guidance, see [How to set up alerts](howto-alert-on-metric.md). Other tasks include setting up automated actions, performing advanced analytics, and archiving history. For more information, see the [Azure Metrics Overview](../azure-monitor/data-platform.md).

### List of metrics
These metrics are available for Azure Database for PostgreSQL:

|Metric|Metric Display Name|Unit|Description|
|---|---|---|---|
|cpu_percent|CPU percent|Percent|The percentage of CPU in use.|
|memory_percent|Memory percent|Percent|The percentage of memory in use.|
|io_consumption_percent|IO percent|Percent|The percentage of IO in use. (Not applicable for Basic tier servers.)|
|storage_percent|Storage percentage|Percent|The percentage of storage used out of the server's maximum.|
|storage_used|Storage used|Bytes|The amount of storage in use. The storage used by the service may include the database files, transaction logs, and the server logs.|
|storage_limit|Storage limit|Bytes|The maximum storage for this server.|
|serverlog_storage_percent|Server Log storage percent|Percent|The percentage of server log storage used out of the server's maximum server log storage.|
|serverlog_storage_usage|Server Log storage used|Bytes|The amount of server log storage in use.|
|serverlog_storage_limit|Server Log storage limit|Bytes|The maximum server log storage for this server.|
|active_connections|Active Connections|Count|The number of active connections to the server.|
|connections_failed|Failed Connections|Count|The number of established connections that failed.|
|network_bytes_egress|Network Out|Bytes|Network Out across active connections.|
|network_bytes_ingress|Network In|Bytes|Network In across active connections.|
|backup_storage_used|Backup Storage Used|Bytes|The amount of backup storage used. This metric represents the sum of storage consumed by all the full database backups, differential backups, and log backups retained based on the backup retention period set for the server. The frequency of the backups is service managed and explained in the [concepts article](concepts-backup.md). For geo-redundant storage, backup storage usage is twice that of the locally redundant storage.|
|pg_replica_log_delay_in_bytes|Max Lag Across Replicas|Bytes|The lag in bytes between the primary and the most-lagging replica. This metric is available on the primary server only.|
|pg_replica_log_delay_in_seconds|Replica Lag|Seconds|The time since the last replayed transaction. This metric is available for replica servers only.|

## Server logs
You can enable logging on your server. These resource logs can be sent to [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md), Event Hubs, and a Storage Account. To learn more about logging, visit the [server logs](concepts-server-logs.md) page.

## Query Store
[Query Store](concepts-query-store.md) keeps track of query performance over time including query runtime statistics and wait events. The feature persists query runtime performance information in a system database named **azure_sys** under the query_store schema. You can control the collection and storage of data via various configuration knobs.

## Query Performance Insight
[Query Performance Insight](concepts-query-performance-insight.md) works in conjunction with Query Store to provide visualizations accessible from the Azure portal. These charts enable you to identify key queries that impact performance. Query Performance Insight is accessible from the **Support + troubleshooting** section of your Azure Database for PostgreSQL server's portal page.

## Performance Recommendations
The [Performance Recommendations](concepts-performance-recommendations.md) feature identifies opportunities to improve workload performance. Performance Recommendations provides you with recommendations for creating new indexes that have the potential to improve the performance of your workloads. To produce index recommendations, the feature takes into consideration various database characteristics, including its schema and the workload as reported by Query Store. After implementing any performance recommendation, customers should test performance to evaluate the impact of those changes. 

## Planned maintenance notification

[Planned maintenance notifications](./concepts-planned-maintenance-notification.md) allow you to receive alerts for upcoming planned maintenance to your Azure Database for PostgreSQL - Single Server. These notifications are integrated with [Service Health's](../service-health/overview.md) planned maintenance and allow you to view all scheduled maintenance for your subscriptions in one place. It also helps to scale the notification to the right audiences for different resource groups, as you may have different contacts responsible for different resources. You will receive the notification about the upcoming maintenance 72 hours before the event.

Learn more about how to set up notifications in the [planned maintenance notifications](./concepts-planned-maintenance-notification.md) document.

## Next steps
- See [how to set up alerts](howto-alert-on-metric.md) for guidance on creating an alert on a metric.
- For more information on how to access and export metrics using the Azure portal, REST API, or CLI, see the [Azure Metrics Overview](../azure-monitor/data-platform.md)
- Read our blog on [best practices for monitoring your server](https://azure.microsoft.com/blog/best-practices-for-alerting-on-metrics-with-azure-database-for-postgresql-monitoring/).
- Learn more about [planned maintenance notifications](./concepts-planned-maintenance-notification.md) in Azure Database for PostgreSQL - Single Server.