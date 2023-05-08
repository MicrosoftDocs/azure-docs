---
title: Monitor and tune - Azure Cosmos DB for PostgreSQL
description: This article describes monitoring and tuning features in Azure Cosmos DB for PostgreSQL
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 01/18/2023
---

# Monitor and tune Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Monitoring data about your servers helps you troubleshoot and optimize for your
workload. Azure Cosmos DB for PostgreSQL provides various monitoring options to provide
insight into the behavior of nodes in a cluster.

## Metrics

Azure Cosmos DB for PostgreSQL provides metrics for nodes in a cluster, and aggregate
metrics for the group as a whole. The metrics give insight into the behavior of
supporting resources. Each metric is emitted at a one-minute frequency, and has
up to 30 days of history.

In addition to viewing graphs of the metrics, you can configure alerts. For
step-by-step guidance, see [How to set up
alerts](howto-alert-on-metric.md).  Other tasks include setting up
automated actions, running advanced analytics, and archiving history. For more
information, see the [Azure Metrics
Overview](../../azure-monitor/data-platform.md).

### Per node vs aggregate

By default, the Azure portal aggregates metrics across nodes
in a cluster. However, some metrics, such as disk usage percentage, are
more informative on a per-node basis. To see metrics for nodes displayed
individually, use Azure Monitor [metric
splitting](howto-monitoring.md#view-metrics-per-node) by server
name.

> [!NOTE]
>
> Some clusters do not support metric splitting. On
> these clusters, you can view metrics for individual nodes by clicking
> the node name in the cluster **Overview** page. Then open the
> **Metrics** page for the node.

### List of metrics

These metrics are available for nodes:

|Metric|Metric Display Name|Unit|Description|
|---|---|---|---|
|active_connections|Active Connections|Count|The number of active connections to the server.|
|apps_reserved_memory_percent|Reserved Memory Percent|Percent|Calculated from the ratio of Committed_AS/CommitLimit as shown in /proc/meminfo.|
|cpu_credits_consumed|CPU credits consumed|Credits|Total number of credits consumed by the node. (Only available when burstable compute is provisioned on the node.)|
|cpu_credits_remaining|CPU credits remaining|Credits|Total number of credits available to burst. (Only available when burstable compute is provisioned on the node.)|
|cpu_percent|CPU percent|Percent|The percentage of CPU in use.|
|iops|IOPS|Count|See the [IOPS definition](../../virtual-machines/premium-storage-performance.md#iops) and [Azure Cosmos DB for PostgreSQL throughput](resources-compute.md)|
|memory_percent|Memory percent|Percent|The percentage of memory in use.|
|network_bytes_ingress|Network In|Bytes|Network In across active connections.|
|network_bytes_egress|Network Out|Bytes|Network Out across active connections.|
|replication_lag|Replication Lag|Seconds|How far read replica nodes are behind their counterparts in the primary cluster.|
|storage_percent|Storage percentage|Percent|The percentage of storage used out of the server's maximum.|
|storage_used|Storage used|Bytes|The amount of storage in use. The storage used by the service may include the database files, transaction logs, and the server logs.|

Azure supplies no aggregate metrics for the cluster as a whole, but metrics for
multiple nodes can be placed on the same graph.

## Next steps

- Learn how to [view metrics](howto-monitoring.md) for a
  cluster.
- See [how to set up alerts](howto-alert-on-metric.md) for guidance
  on creating an alert on a metric.
- Learn how to do [metric
  splitting](../../azure-monitor/essentials/metrics-charts.md#metric-splitting) to
  inspect metrics per node in a cluster.
- See other measures of database health with [useful diagnostic queries](howto-useful-diagnostic-queries.md).
