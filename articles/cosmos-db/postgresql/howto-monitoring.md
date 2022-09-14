---
title: How to view metrics - Azure Cosmos DB for PostgreSQL
description: How to access database metrics for Azure Cosmos DB for PostgreSQL
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 10/05/2021
---

# How to view metrics in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Resource metrics are available for every node of a cluster, and in aggregate across the nodes.

## View metrics

To access metrics for a cluster, open **Metrics**
under **Monitoring** in the Azure portal.

:::image type="content" source="media/howto-monitoring/metrics.png" alt-text="The metrics screen":::

Choose a dimension and an aggregation, for instance **CPU percent** and
**Max**, to view the metric aggregated across all nodes. For an explanation of
each metric, see [here](concepts-monitoring.md#list-of-metrics).

:::image type="content" source="media/howto-monitoring/dimensions.png" alt-text="Select dimension":::

### View metrics per node

Viewing each node's metrics separately on the same graph is called "splitting."
To enable it, select **Apply splitting**:

:::image type="content" source="media/howto-monitoring/splitting.png" alt-text="Apply splitting button":::

Select the value by which to split. For nodes, choose **Server name**.

:::image type="content" source="media/howto-monitoring/split-value.png" alt-text="Select splitting value":::

The metrics will now be plotted in one color-coded line per node.

:::image type="content" source="media/howto-monitoring/split-chart.png" alt-text="Multiple node chartlines":::

## Next steps

* Review Hyperscale (Citus) [monitoring concepts](concepts-monitoring.md)
