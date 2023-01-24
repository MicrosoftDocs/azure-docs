---
title: How to view metrics - Azure Cosmos DB for PostgreSQL
description: See how to access database metrics for Azure Cosmos DB for PostgreSQL.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/24/2022
---

# How to view metrics in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Resource metrics are available for every node of a cluster, and in aggregate across the nodes.

## View metrics

To access metrics for a cluster, open **Metrics**
under **Monitoring** in the Azure portal.

:::image type="content" source="media/howto-monitoring/metrics.png" alt-text="Screenshot that shows the metrics screen.":::

Choose a dimension and an aggregation, for instance **CPU percent** and
**Max**, to view the metric aggregated across all nodes. For an explanation of
each metric, see [here](concepts-monitoring.md#list-of-metrics).

:::image type="content" source="media/howto-monitoring/dimensions.png" alt-text="Screenshot that shows selecting dimension and aggregation.":::

### View metrics per node

Viewing each node's metrics separately on the same graph is called *splitting*.
To enable splitting, select **Apply splitting**, and then select the value by which to split. For nodes, choose **Server name**.

:::image type="content" source="media/howto-monitoring/splitting.png" alt-text="Screenshot that shows the Apply splitting button and selecting the splitting value.":::

The metrics will now be plotted in one color-coded line per node.

:::image type="content" source="media/howto-monitoring/split-chart.png" alt-text="Multiple node chartlines":::

## Next steps

* Review Azure Cosmos DB for PostgreSQL [monitoring concepts](concepts-monitoring.md).
