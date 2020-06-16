---
title: Monitor and tune - Azure Database for PostgreSQL - Single Server
description: This article describes monitoring and tuning features in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 06/19/2019
---

# Monitor and tune Azure Database for PostgreSQL - Single Server
Monitoring data about your servers helps you troubleshoot and optimize for your workload. Azure Database for PostgreSQL provides various monitoring options to provide insight into the behavior of your server.

## Metrics
Azure Database for PostgreSQL provides various metrics that give insight into the behavior of the resources supporting the PostgreSQL server. Each metric is emitted at a one-minute frequency, and has up to 30 days of history. You can configure alerts on the metrics. For step by step guidance, see [How to set up alerts](howto-alert-on-metric.md). Other tasks include setting up automated actions, performing advanced analytics, and archiving history. For more information, see the [Azure Metrics Overview](../monitoring-and-diagnostics/monitoring-overview-metrics.md).

### List of metrics
These metrics are available for Azure Database for PostgreSQL:

|Metric|Metric Display Name|Unit|Description|
|---|---|---|---|
|cpu_percent|CPU percent|Percent|The percentage of CPU in use.|
|memory_percent|Memory percent|Percent|The percentage of memory in use.|
|io_consumption_percent|IO percent|Percent|The percentage of IO in use.|
|storage_percent|Storage percentage|Percent|The percentage of storage used out of the server's maximum.|
|storage_used|Storage used|Bytes|The amount of storage in use. The storage used by the service may include the database files, transaction logs, and the server logs.|
|storage_limit|Storage limit|Bytes|The maximum storage for this server.|
|serverlog_storage_percent|Server Log storage percent|Percent|The percentage of server log storage used out of the server's maximum server log storage.|
|serverlog_storage_usage|Server Log storage used|Bytes|The amount of server log storage in use.|
|serverlog_storage_limit|Server Log storage limit|Bytes|The maximum server log storage for this server.|
|active_connections|Active Connections|Count|The number of active connections to the server.|
|connections_failed|Failed Connections|Count|The number of failed connections to the server.|
|network_bytes_egress|Network Out|Bytes|Network Out across active connections.|
|network_bytes_ingress|Network In|Bytes|Network In across active connections.|
|backup_storage_used|Backup Storage Used|Bytes|The amount of backup storage used.|
|pg_replica_log_delay_in_bytes|Max Lag Across Replicas|Bytes|The lag in bytes between the master and the most-lagging replica. This metric is available on the master server only.|
|pg_replica_log_delay_in_seconds|Replica Lag|Seconds|The time since the last replayed transaction. This metric is available for replica servers only.|

## Server logs
You can enable logging on your server. These resource logs can be sent to [Azure Monitor logs](../azure-monitor/log-query/log-query-overview.md), Event Hubs, and a Storage Account. To learn more about logging, visit the [server logs](concepts-server-logs.md) page.

## Query Store
[Query Store](concepts-query-store.md) keeps track of query performance over time including query runtime statistics and wait events. The feature persists query runtime performance information in a system database named **azure_sys** under the query_store schema. You can control the collection and storage of data via various configuration knobs.

## Query Performance Insight
[Query Performance Insight](concepts-query-performance-insight.md) works in conjunction with Query Store to provide visualizations accessible from the Azure portal. These charts enable you to identify key queries that impact performance. Query Performance Insight is accessible from the **Support + troubleshooting** section of your Azure Database for PostgreSQL server's portal page.

## Performance Recommendations
The [Performance Recommendations](concepts-performance-recommendations.md) feature identifies opportunities to improve workload performance. Performance Recommendations provides you with recommendations for creating new indexes that have the potential to improve the performance of your workloads. To produce index recommendations, the feature takes into consideration various database characteristics, including its schema and the workload as reported by Query Store. After implementing any performance recommendation, customers should test performance to evaluate the impact of those changes. 

## Planned maintenance notification

**Planned maintenance notifications** allow you to receive alerts for upcoming planned maintenance to your Azure Database for PostgreSQL - Single Server. These notifications are integrated with [Service Health's](../service-health/overview.md) planned maintenance and allow you to view all scheduled maintenance for your subscriptions in one place. It also helps to scale the notification to the right audiences for different resource groups, as you may have different contacts responsible for different resources. You will receive the notification about the upcoming maintenance 72 hours before the event.

> [!Note]
> We will make every attempt to provide **Planned maintenance notification** 72 hours notice for all events. However, in cases of critical or security patches, notifications might be sent closer to the event or be omitted.

### To receive planned maintenance notification

1. In the [portal](https://portal.azure.com), select **Service Health**.
2. In the **Alerts** section, select **Health alerts**.
3. Select **+ Add service health alert** and fill in the fields.
4. Fill out the required fields. 
5. Choose the **Event type**, select **Planned maintenance** or **Select all**
6. In **Action groups** define how you would like to receive the alert (get an email, trigger a logic app etc.)  
7. Ensure Enable rule upon creation is set to Yes.
8. Select **Create alert rule** to complete your alert

For detailed steps on how to create **service health alerts**, refer to [Create activity log alerts on service notifications](../service-health/alerts-activity-log-service-notifications.md).

> [!IMPORTANT]
> Planned maintenance notifications are currently available in preview in all regions **except** West Central US

## Next steps
- See [how to set up alerts](howto-alert-on-metric.md) for guidance on creating an alert on a metric.
- For more information on how to access and export metrics using the Azure portal, REST API, or CLI, see the [Azure Metrics Overview](../monitoring-and-diagnostics/monitoring-overview-metrics.md).
- Read our blog on [best practices for monitoring your server](https://azure.microsoft.com/blog/best-practices-for-alerting-on-metrics-with-azure-database-for-postgresql-monitoring/).
