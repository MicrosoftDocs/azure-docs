---
title: Advanced features of Metrics Explorer in Azure Monitor
description: Learn how to use Metrics Explorer to investigate the health and usage of resources.
services: azure-monitor
author: EdB-MSFT
ms.author: edbaynash
ms.topic: conceptual
ms.date: 07/20/2023
ms.reviewer: vitalyg
ms.custom: kr2b-contr-experiment
---

# Advanced features of Metrics Explorer in Azure Monitor

In Azure Monitor, [metrics](data-platform-metrics.md) are a series of measured values and counts that are collected and stored over time. Metrics can be standard (also called *platform*) or custom.

The Azure platform provides standard metrics. These metrics reflect the health and usage statistics of your Azure resources.

This article describes advanced features of Metrics Explorer in Azure Monitor. It assumes that you're familiar with basic features of Metrics Explorer. If you're a new user and want to learn how to create your first metric chart, see [Get started with Metrics Explorer](./metrics-getting-started.md).

## Resource scope picker

Use the resource scope picker to view metrics across single resources and multiple resources.

### Select a single resource

1. In the Azure portal, select **Metrics** from the **Monitor** menu or from the **Monitoring** section of a resource's menu.

1. Choose **Select a scope**.

   :::image source="./media/metrics-charts/scope-picker.png" alt-text="Screenshot that shows the button that opens the resource scope picker." lightbox="./media/metrics-charts/scope-picker.png":::

1. Use the scope picker to select the resources whose metrics you want to see. If you opened Metrics Explorer from a resource's menu, the scope should be populated.

   For some resources, you can view only one resource's metrics at a time. On the **Resource types** menu, these resources are in the **All resource types** section.

   :::image source="./media/metrics-charts/single-resource-scope.png" alt-text="Screenshot that shows available resources." lightbox="./media/metrics-charts/single-resource-scope.png":::

1. Select a resource. All subscriptions and resource groups that contain that resource appear.

   :::image source="./media/metrics-charts/available-single-resource.png" alt-text="Screenshot that shows a single resource." lightbox="./media/metrics-charts/available-single-resource.png":::

   If you want the capability to view the metrics for multiple resources at the same time, or to view metrics across a subscription or resource group, select **Upvote**.

1. When you're satisfied with your selection, select **Apply**.

### Select multiple resources

Some resource types can query for metrics over multiple resources. The resources must be within the same subscription and location. Find these resource types at the top of the **Resource types** menu. For more information, see [Select multiple resources](./metrics-dynamic-scope.md#select-multiple-resources).

:::image source="./media/metrics-charts/multi-resource-scope.png" alt-text="Screenshot that shows cross-resource types." lightbox="./media/metrics-charts/multi-resource-scope.png":::

For types that are compatible with multiple resources, you can query for metrics across a subscription or multiple resource groups. For more information, see [Select a resource group or subscription](./metrics-dynamic-scope.md#select-a-resource-group-or-subscription).

## Multiple metric lines and charts

In Metrics Explorer, you can create charts that plot multiple metric lines or show multiple metric charts at the same time. This functionality allows you to:

- Correlate related metrics on the same graph to see how one value relates to another.
- Display metrics that use different units of measure in close proximity.
- Visually aggregate and compare metrics from multiple resources.

For example, imagine that you have five storage accounts, and you want to know how much space they consume together. You can create a stacked area chart that shows the individual values and the sum of all the values at points in time.

### Multiple metrics on the same chart

To view multiple metrics on the same chart, first [create a new chart](./metrics-getting-started.md#create-your-first-metric-chart). Then select **Add metric**. Repeat this step to add another metric on the same chart.

:::image source="./media/metrics-charts/multiple-metrics-chart.png" alt-text="Screenshot that shows multiple metrics." lightbox="./media/metrics-charts/multiple-metrics-chart.png":::

Typically, your charts shouldn't mix metrics that use different units of measure. For example, avoid mixing one metric that uses milliseconds with another that uses kilobytes. Also avoid mixing metrics whose scales differ significantly. In these cases, consider using multiple charts instead.

### Multiple charts

To create another chart that uses a different metric, select **New chart**.

To reorder or delete multiple charts, select the ellipsis (**...**) button to open the chart menu. Then select **Move up**, **Move down**, or **Delete**.

:::image source="./media/metrics-charts/multiple-charts.png" alt-text="Screenshot that shows multiple charts." lightbox="./media/metrics-charts/multiple-charts.png":::

## Time range controls

In addition to changing the time range by using the [time picker panel](metrics-getting-started.md#select-a-time-range), you can pan and zoom by using the controls in the chart area.

### Pan

To pan, select the left and right arrows at the edge of the chart. The arrow control moves the selected time range back and forward by one half of the chart's time span. For example, if you're viewing the past 24 hours, selecting the left arrow causes the time range to shift to span a day and a half to 12 hours ago.

Most metrics support 93 days of retention but let you view only 30 days at a time. By using the pan controls, you look at the past 30 days and then easily go back 15 days at a time to view the rest of the retention period.

:::image source="./media/metrics-charts/metrics-pan-controls.gif" alt-text="Animated screenshot that shows left and right pan controls." lightbox="./media/metrics-charts/metrics-pan-controls.gif":::

### Zoom

You can select and drag on the chart to zoom in to a section of a chart. Zooming updates the chart's time range to span your selection. If the time grain is set to **Automatic**, zooming selects a smaller time grain. The new time range applies to all charts in Metrics Explorer.

:::image source="./media/metrics-charts/metrics-zoom-control.gif" alt-text="Animated screenshot that shows the zoom feature in Metrics Explorer." lightbox="./media/metrics-charts/metrics-zoom-control.gif":::

## Aggregation

When you add a metric to a chart, Metrics Explorer applies a default aggregation. The default makes sense in basic scenarios, but you can use a different aggregation to gain more insights about the metric.

Before you use different aggregations on a chart, you should understand how Metrics Explorer handles them. Metrics are a series of measurements (or "metric values") that are captured over a time period. When you plot a chart, the values of the selected metric are separately aggregated over the *time granularity*.

You select the size of the time grain by using the time picker panel in Metrics Explorer. If you don't explicitly select the time grain, Metrics Explorer uses the currently selected time range by default. After Metrics Explorer determines the time grain, the metric values that it captures during each time grain are aggregated on the chart, one data point per time grain.

For example, suppose a chart shows the *Server response time* metric. It uses the average aggregation over the time span of the last 24 hours. 

:::image type="content" source="media/metrics-charts/time-granularity.png" alt-text="Screenshot that shows the time range and granularity selector.":::

In this example:

- If you set the time granularity to 30 minutes, Metrics Explorer draws the chart from 48 aggregated data points. That is, it uses two data points per hour for 24 hours. The line chart connects 48 dots in the chart plot area. Each data point represents the average of all captured response times for server requests that occurred during each of the relevant 30-minute time periods.
- If you switch the time granularity to 15 minutes, you get 96 aggregated data points. That is, you get four data points per hour for 24 hours.

Metrics Explorer has five aggregation types:

- **Sum**: The sum of all values captured during the aggregation interval. The sum aggregation is sometimes called the *total* aggregation.
- **Count**: The number of measurements captured during the aggregation interval.

  When the metric is always captured with the value of 1, the count aggregation is equal to the sum aggregation. This scenario is common when the metric tracks the count of distinct events and each measurement represents one event. The code emits a metric record every time a new request arrives.
- **Average**: The average of the metric values captured during the aggregation interval.
- **Min**: The smallest value captured during the aggregation interval.
- **Max**: The largest value captured during the aggregation interval.

:::image type="content" source="media/metrics-charts/aggregations.png" alt-text="Screenshot that shows the aggregation dropdown list." lightbox="media/metrics-charts/aggregations.png":::

Metrics Explorer hides the aggregations that are irrelevant and can't be used.

For a deeper discussion of how metric aggregation works, see [Azure Monitor metrics aggregation and display explained](metrics-aggregation-explained.md).

## Filters

You can apply filters to charts whose metrics have dimensions. For example, imagine a *Transaction count* metric that has a *Response type* dimension. This dimension indicates whether the response from transactions succeeded or failed. If you filter on this dimension, Metrics Explorer displays a chart line for only successful or only failed transactions.

### Add a filter

1. Above the chart, select **Add filter**.

1. Select a dimension from the **Property** dropdown list.

   :::image type="content" source="./media/metrics-charts/filter-property.png" alt-text="Screenshot that shows the dropdown list for filter properties." lightbox="./media/metrics-charts/filter-property.png":::

1. Select the operator that you want to apply against the dimension (property). The default operator is equals (**=**).
  
   :::image type="content" source="./media/metrics-charts/filter-operator.png" alt-text="Screenshot that shows the operator that you can use with the filter." lightbox="./media/metrics-charts/filter-operator.png":::

1. Select which dimension values you want to apply to the filter when you're plotting the chart. This example shows filtering out the successful storage transactions.

   :::image type="content" source="./media/metrics-charts/filter-values.png" alt-text="Screenshot that shows the dropdown list for filter values." lightbox="./media/metrics-charts/filter-values.png":::

1. After you select the filter values, click away from the filter selector to close it. The chart shows how many storage transactions have failed.

   :::image type="content" source="./media/metrics-charts/filtered-chart.png" alt-text="Screenshot that shows the successful filtered storage transactions." lightbox="./media/metrics-charts/filtered-chart.png":::

1. Repeat these steps to apply multiple filters to the same charts.

## Metric splitting

You can split a metric by dimension to visualize how different segments of the metric compare. Splitting can also help you identify the outlying segments of a dimension.

### Apply splitting

1. Above the chart, select **Apply splitting**.

1. Choose dimensions on which to segment your chart.

   :::image type="content" source="./media/metrics-charts/apply-splitting.png" alt-text="Screenshot that shows the selected dimension on which to segment the chart." lightbox="./media/metrics-charts/apply-splitting.png":::

   The chart shows multiple lines, one for each dimension segment.

   :::image type="content" source="./media/metrics-charts/segment-dimension.png" alt-text="Screenshot that shows multiple lines, one for each segment of dimension." lightbox="./media/metrics-charts/segment-dimension.png":::

1. Choose a limit on the number of values to be displayed after you split by the selected dimension. The default limit is 10, as shown in the preceding chart. The range of the limit is 1 to 50.

   :::image type="content" source="./media/metrics-charts/segment-dimension-limit.png" alt-text="Screenshot that shows the split limit, which restricts the number of values after splitting." lightbox="./media/metrics-charts/segment-dimension-limit.png":::

1. Choose the sort order on segments: **Descending** (default) or **Ascending**.

   :::image type="content" source="./media/metrics-charts/segment-dimension-sort.png" alt-text="Screenshot that shows the sort order on split values." lightbox="./media/metrics-charts/segment-dimension-sort.png":::

1. Segment by multiple segments by selecting multiple dimensions from the **Values** dropdown list. The legend shows a comma-separated list of dimension values for each segment.

   :::image type="content" source="./media/metrics-charts/segment-dimension-multiple.png" alt-text="Screenshot that shows multiple segments selected, and the corresponding chart." lightbox="./media/metrics-charts/segment-dimension-multiple.png":::

1. Click away from the grouping selector to close it.

> [!TIP]
> To hide segments that are irrelevant for your scenario and to make your charts easier to read, use both filtering and splitting on the same dimension.

## Locking the range of the y-axis

Locking the range of the value (y) axis becomes important in charts that show small fluctuations of large values.

For example, a drop in the volume of successful requests from 99.99 percent to 99.5 percent might represent a significant reduction in the quality of service. Noticing a small fluctuation in a numeric value would be difficult or even impossible if you're using the default chart settings. In this case, you could lock the lowest boundary of the chart to 99 percent to make a small drop more apparent.

Another example is a fluctuation in the available memory. In this scenario, the value technically never reaches 0. Fixing the range to a higher value might make drops in available memory easier to spot.

To control the y-axis range:

1. Open the chart menu by selecting the ellipsis (**...**). Then select **Chart settings** to access advanced chart settings.

   :::image source="./media/metrics-charts/select-chart-settings.png" alt-text="Screenshot that shows the menu option for chart settings." lightbox="./media/metrics-charts/select-chart-settings.png":::

1. Modify the values in the **Y-axis range** section, or select **Auto** to revert to the default values.

   :::image type="content" source="./media/metrics-charts/chart-settings.png" alt-text="Screenshot that shows the Y-axis range section." lightbox="./media/metrics-charts/chart-settings.png":::

If you lock the boundaries of the y-axis for a chart that tracks count, sum, minimum, or maximum aggregations over a period of time, specify a fixed time granularity. Don't rely on the automatic defaults.

You choose a fixed time granularity because chart values change when the time granularity is automatically modified after a user resizes a browser window or changes screen resolution. The resulting change in time granularity affects the appearance of the chart, invalidating the selection of the y-axis range.

## Line colors

Chart lines are automatically assigned a color from a default palette.

To change the color of a chart line, select the colored bar in the legend that corresponds to the line on the chart. Use the color picker to select the line color.

:::image source="./media/metrics-charts/line-colors.png" alt-text="Screenshot that shows the color picker." lightbox="./media/metrics-charts/line-colors.png":::

Customized colors are preserved when you pin the chart to a dashboard. The following section shows how to pin a chart.

## Saving to dashboards or workbooks

After you configure a chart, you can add it to a dashboard or workbook. By adding a chart to a dashboard or workbook, you can make it accessible to your team. You can also gain insights by viewing it in the context of other monitoring information.

- To pin a configured chart to a dashboard, in the upper-right corner of the chart, select **Save to dashboard** > **Pin to dashboard**.
- To save a configured chart to a workbook, in the upper-right corner of the chart, select **Save to dashboard** > **Save to workbook**.

:::image type="content" source="media/metrics-charts/save-to-dashboard.png" alt-text="Screenshot that shows menu options for adding a chart to a dashboard or workbook." lightbox="media/metrics-charts/save-to-dashboard.png":::

## Alert rules

You can use your visualization criteria to create a metric-based alert rule. The new alert rule includes your chart's target resource, metric, splitting, and filter dimensions. You can modify these settings by using the **Create an alert rule** pane.

To create an alert rule:

1. Select **New alert rule** in the upper-right corner of the chart.

   :::image source="./media/metrics-charts/new-alert.png" alt-text="Screenshot that shows the button for creating a new alert rule." lightbox="./media/metrics-charts/new-alert.png":::

1. Select the **Condition** tab. The **Signal name** entry defaults to the metric from your chart. You can choose a different metric.

1. Enter a number for **Threshold value**. The threshold value is the value that triggers the alert. The **Preview** chart shows the threshold value as a horizontal line over the metric values. When you're ready, select the **Details** tab.

   :::image source="./media/metrics-charts/alert-rule-condition.png" alt-text="Screenshot that shows the Condition tab on the pane for creating an alert rule." lightbox="./media/metrics-charts/alert-rule-condition.png":::

1. Enter **Name** and **Description** values for the alert rule.

1. Select a **Severity** level for the alert rule. Severities include **Critical**, **Error Warning**, **Informational**, and **Verbose**.

1. Select **Review + create** to review the alert rule.

   :::image source="./media/metrics-charts/alert-rule-details.png" alt-text="Screenshot that shows the Details tab on the pane for creating an alert rule." lightbox="./media/metrics-charts/alert-rule-details.png":::

1. Select **Create** to create the alert rule.

For more information, see [Create, view, and manage metric alerts](../alerts/alerts-metric.md).

## Correlating metrics to logs

In Metrics Explorer, **Drill into Logs** helps you diagnose the root cause of anomalies in your metric chart. Drilling into logs allows you to correlate spikes in your metric chart to the following types of logs and queries:

| Term             | Definition  |
|------------------|-------------|
| Activity log    | Provides insight into the operations on each Azure resource in the subscription from the outside (the management plane), in addition to updates on Azure Service Health events. Use the activity log to determine the what, who, and when for any write operations (`PUT`, `POST`, or `DELETE`) taken on the resources in your subscription. There's a single activity log for each Azure subscription.  |
| Diagnostic log   | Provides insight into operations that you performed within an Azure resource (the data plane). Examples include getting a secret from a key vault or making a request to a database. The content of resource logs varies by the Azure service and resource type. You must enable logs for the resource. |  
| Recommended log | Provides scenario-based queries that you can use to investigate anomalies in Metrics Explorer.  |

Currently, **Drill into Logs** is available for select resource providers. The following resource providers offer the complete **Drill into Logs** experience:

- Application Insights
- Autoscale
- Azure App Service
- Azure Storage

To diagnose a spike in failed requests:

1. Select **Drill into Logs**.

   :::image source="./media/metrics-charts/drill-into-log-ai.png" alt-text="Screenshot that shows a spike in failures on an Application Insights metrics pane." lightbox="./media/metrics-charts/drill-into-log-ai.png":::

1. In the dropdown list, select **Failures**.

   :::image source="./media/metrics-charts/drill-into-logs-dropdown.png" alt-text="Screenshot that shows the dropdown menu for drilling into logs." lightbox="./media/metrics-charts/drill-into-logs-dropdown.png":::

1. On the custom failure pane, check for failed operations, top exception types, and failed dependencies.

   :::image source="./media/metrics-charts/ai-failure-blade.png" alt-text="Screenshot of the Application Insights failure pane." lightbox="./media/metrics-charts/ai-failure-blade.png":::

## Next steps

To create actionable dashboards by using metrics, see [Create custom KPI dashboards](../app/tutorial-app-dashboards.md).
