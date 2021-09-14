---
title: Monitor and tune - Hyperscale (Citus) - Azure Database for PostgreSQL
description: This article describes monitoring and tuning features in Azure Database for PostgreSQL - Hyperscale (Citus)
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 07/26/2021
---

# Monitor and tune Azure Database for PostgreSQL - Hyperscale (Citus)

Monitoring data about your servers helps you troubleshoot and optimize for your
workload. Hyperscale (Citus) provides various monitoring options to provide
insight into the behavior of nodes in a server group.

## Metrics

Hyperscale (Citus) provides metrics for nodes in a server group, and aggregate
metrics for the group as a whole. The metrics give insight into the behavior of
supporting resources. Each metric is emitted at a one-minute frequency, and has
up to 30 days of history.

In addition to viewing graphs of the metrics, you can configure alerts. For
step-by-step guidance, see [How to set up
alerts](howto-hyperscale-alert-on-metric.md).  Other tasks include setting up
automated actions, running advanced analytics, and archiving history. For more
information, see the [Azure Metrics
Overview](../azure-monitor/data-platform.md).

### Per node vs aggregate

By default, the Azure portal aggregates Hyperscale (Citus) metrics across nodes
in a server group. However, some metrics, such as disk usage percentage, are
more informative on a per-node basis. To see metrics for nodes displayed
individually, use Azure Monitor [metric
splitting](../azure-monitor/essentials/metrics-charts.md#metric-splitting) by
server name.

> [!NOTE]
>
> Some Hyperscale (Citus) server groups do not support metric splitting. On
> these server groups, you can view metrics for individual nodes by clicking
> the node name in the server group **Overview** page. Then open the
> **Metrics** page for the node.

### List of metrics

These metrics are available for Hyperscale (Citus) nodes:

|Metric|Metric Display Name|Unit|Description|
|---|---|---|---|
|active_connections|Active Connections|Count|The number of active connections to the server.|
|cpu_percent|CPU percent|Percent|The percentage of CPU in use.|
|iops|IOPS|Count|See the [IOPS definition](../virtual-machines/premium-storage-performance.md#iops) and [Hyperscale (Citus) throughput](concepts-hyperscale-configuration-options.md)|
|memory_percent|Memory percent|Percent|The percentage of memory in use.|
|network_bytes_ingress|Network In|Bytes|Network In across active connections.|
|network_bytes_egress|Network Out|Bytes|Network Out across active connections.|
|storage_percent|Storage percentage|Percent|The percentage of storage used out of the server's maximum.|
|storage_used|Storage used|Bytes|The amount of storage in use. The storage used by the service may include the database files, transaction logs, and the server logs.|

Azure supplies no aggregate metrics for the cluster as a whole, but metrics for
multiple nodes can be placed on the same graph.

## Next steps

- See [how to set up alerts](howto-hyperscale-alert-on-metric.md) for guidance
  on creating an alert on a metric.
- Learn how to do [metric
  splitting](../azure-monitor/essentials/metrics-charts.md#metric-splitting) to
  inspect metrics per node in a server group.
