---
title: Monitor Azure Container Apps metrics
description: Monitor your running apps metrics.
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.topic: how-to
ms.date: 04/30/2024
ms.author: v-wellsjason
---

# Monitor Azure Container Apps metrics

Azure Monitor collects metric data from your container app at regular intervals to help you gain insights into the performance and health of your container app.

The metrics explorer in the Azure portal allows you to visualize the data. You can also retrieve raw metric data through the [Azure CLI](/cli/azure/monitor/metrics) and Azure [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric).

## Available metrics

Container Apps provides these basic metrics.

| Category | Title | Description | Metric ID | Unit |
|--|--|--|--|--|
| Basic | CPU Usage | CPU consumed by the container app, in nano cores (1,000,000,000 nanocores = 1 core) | UsageNanoCores | `nanocores` |
| Basic | Memory Working Set Bytes | Container app working set memory used in bytes | `WorkingSetBytes` | bytes |
| Basic | Network In Bytes | Network received bytes | `RxBytes` | bytes |
| Basic | Network Out Bytes | Network transmitted bytes | `TxBytes` | bytes |
| Basic | Replica count | Number of active replicas | `Replicas` | n/a |
| Basic | Replica Restart Count | Restarts count of container app replicas | `RestartCount` | n/a |
| Basic | Requests | Requests processed | `Requests` | n/a |
| Basic | Reserved Cores | Number of reserved cores for container app revisions | `CoresQuotaUsed` | n/a |
| Basic | Resiliency Connection Timeouts | Total connection timeouts | `ResiliencyConnectTimeouts` | n/a |
| Basic | Resiliency Ejected Hosts | Number of currently ejected hosts | `ResiliencyEjectedHosts` | n/a |
| Basic | Resiliency Ejections Aborted | Number of ejections aborted due to the max ejection % | `ResiliencyEjectionsAborted` | n/a |
| Basic | Resiliency Request Retries | Total request retries | `ResiliencyRequestRetries` | n/a |
| Basic | Resiliency Request Timeouts | Total requests that timed out waiting for a response | `ResiliencyRequestTimeouts` | n/a |
| Basic | Resiliency Requests Pending Connection Pool | Total requests pending a connection pool connection | `ResiliencyRequestsPendingConnectionPool` | n/a |
| Basic | Total Reserved Cores | Total cores reserved for the container app | `TotalCoresQuotaUsed` | n/a |

The metrics namespace is `microsoft.app/containerapps`.

> [!NOTE]
> Replica restart count is the aggregate restart count over the specified time range, not the number of restarts that occurred at a point in time.

More runtime specific metrics are available, [Java metrics](./java-metrics.md).

## Metrics snapshots

Select the **Monitoring** tab on your app's **Overview** page to display charts showing your container app's current CPU, memory, and network utilization.

:::image type="content" source="media/observability/metrics-in-overview-page.png" alt-text="Screenshot of the Monitoring section in the container app overview page.":::

From this view, you can pin one or more charts to your dashboard or select a chart to open it in the metrics explorer.

## Using metrics explorer

The Azure Monitor metrics explorer lets you create charts from metric data to help you analyze your container app's resource and network usage over time. You can pin charts to a dashboard or in a shared workbook.

1. Open the metrics explorer in the Azure portal by selecting **Metrics** from the sidebar menu on your container app's page. To learn more about metrics explorer, see [Analyze metrics with Azure Monitor metrics explorer](../azure-monitor/essentials/analyze-metrics.md).

1. Create a chart by selecting **Metric**. You can modify the chart by changing aggregation, adding more metrics, changing time ranges and intervals, adding filters, and applying splitting.
:::image type="content" source="media/observability/metrics-main-page.png" alt-text="Screenshot of the metrics explorer from the container app resource page.":::

### Add filters

Optionally, you can create filters to limit the data shown based on revisions and replicas.

To create a filter:

1. Select **Add filter**.

1. Select a revision or replica from the **Property** list.

1. Select values from the **Value** list.
    :::image type="content" source="media/observability/metrics-add-filter.png" alt-text="Screenshot of the metrics explorer showing the chart filter options.":::

### Split metrics

When your chart contains a single metric, you can choose to split the metric information by revision or replica with the exceptions:

* The *Replica count* metric can only split by revision.
* The *Requests* metric can also be split on the status code and status code category.

To split by revision or replica:

1. Select **Apply splitting**.

1. From the **Values** drop-down list, select **Revision** or **Replica**.

1. You can set the limit of the number of revisions or replicas to display in the chart. The default value is 10.

1. You can set sort order to **Ascending** or **Descending**. The default value is *Descending*.

:::image type="content" source="media/observability/metrics-alert-split-by-dimension.png" alt-text="Screenshot of metrics splitting options.":::

### Add scopes

You can add more scopes to view metrics across multiple container apps.

:::image type="content" source="media/observability/metrics-across-apps.png" alt-text="Screenshot of the metrics explorer that shows a chart with metrics for multiple container apps.":::

> [!div class="nextstepaction"]
> [Set up alerts in Azure Container Apps](alerts.md)