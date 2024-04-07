---
title: Metrics explorer with PromQL (Preview)
description: Learn about Metrics Explorer with Prometheus query language support.
author: EdB-MSFT
ms.service: azure-monitor
ms-author: edbaynash
ms.topic: conceptual
ms.date: 04/01/2024
ms.reviewer: priyamishra

# Customer intent: As an Azure Monitor user, I want to learn how to use Metrics Explorer with PromQL.

---

# Metrics explorer with PromQL (Preview) (Preview)

Metrics Explorer with PromQL (Preview) allows you to analyze and visualize platform metrics, and use Prometheus query language (PromQL) to query metrics stored in an Azure Monitor workspace.

Metrics explorer with PromQL (Preview) is available from the **Metrics** menu item of any Azure Monitor workspace in the Azure portal, but is not limited to Azure Monitor workspaces. You can query metrics from any Azure resource by selecting the appropriate scope.

For more information on PromQL, see [Querying Prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/).


## Create a chart

The chart pane has two options for charting a metric:
-  Add with builder
-  Add with editor.


### Create a chart with the editor and PromQL

To add a metric using the query editor,

1. Select **Add metric** and select **Add with editor** from the dropdown. 

1. Select a **Scope** from the dropdown list. This scope is the Azure Monitor workspace where the metrics are stored.
1. Enter a PromQL query in the editor field, or select an sinmge metric from **Metric** dropdown.
1. Select **Run** to run the query and display the results in the chart. You can customize the chart by selecting the gear-wheel icon. You can change the chart title, add annotations, and set the time range for the chart. 

:::image type="content" source="./media/metrics-explorer/add-metric-with-editor.png"  lightbox="./media/metrics-explorer/add-metric-with-editor.png"  alt-text="A screenshot showing adding a metric using the editor." :::

### Create a chart with the builder
To add a metric with the builder, 
1. Select **Add metric** and select **Add with builder** from the dropdown. 
1. Select a scope. This can be an Azure resource in your subscription.
1. Select a metric from the drop-down list.
1. Select the aggregation type from the dropdown list. 

The metric is displayed by default as a line chart the chart. Select your preferred chart type from the dropdown list in the toolbar. Customize the chart by selecting the gear-wheel icon. You can change the chart title, add annotations, and set the time range for the chart.

:::image type="content" source="./media/metrics-explorer/add-metric-with-builder.png" lightbox="./media/metrics-explorer/add-metric-with-builder.png"  alt-text="A screenshot showing adding a metric using the builder in the metrics explorer." :::


## Multiple metrics and charts 
Each workspace can host multiple charts with each chart containing multiple metrics.

### Add a metric

Add multiple metrics to the chart by selecting **Add metric**. Use either the builder or the editor to add metrics to the chart. 

> [!NOTE]
> Running both the code editor and query builder on the same chart is not supported in the Preview release of Metrics explorer and may result in unexpected behavior.


### Add a new chart

You can create more charts by selecting **New chart**. Each chart can have multiple metrics and different chart types and settings. 

The time range and granularity are applied to all the charts in the workspace.

:::image type="content" source="./media/metrics-explorer/create-multiple-charts.png" lightbox="./media/metrics-explorer/create-multiple-charts.png" alt-text="A screenshot showing multiple charts.":::

### Remove a chart

To remove a chart, select the **...** options icon and select **Remove**.

## Configure time range and granularity

Configure the time range and granularity for your metric chart to view data that's relevant to your monitoring scenario. By default, the chart shows the most recent 24 hours of metrics data.

Set the time range for the chart by selecting the time range dropdown list in the toolbar. 

Time grain refers to the frequency of sampling and display of the data points on the chart. Select the time granularity by using the time picker in metrics explorer. If the data is stored at a lower granularity than selected, the metric values displayed are aggregated to the level of granularity selected. The time grain is set to automatic by default. The automatic setting selects the best time grain based on the time range selected.


:::image type="content" source="./media/metrics-explorer/time-picker.png" lightbox="./media/metrics-explorer/time-picker.png"  alt-text="A screenshot showing time range picker." :::

## Configure the time range

To set the time range for the chart, use the time range picker in the toolbar. The time range picker allows you to select a predefined time range or set a custom time range. The time range picker also allows you to set the time grain for the chart. The time grain is the frequency of sampling and display of the data points on the chart. The time grain is set to automatic by default. The automatic setting selects the best time grain based on the time range selected.

For more information, see [Analyze metrics](aazure/azure-monitor/essentials/analyze-metrics#configure-the-time-range) .


## Chart features
You can interact with the chart in several ways to gain insights into your metrics data.

This includes the following features:
- Zoom-in. Select and drag to zoom in on a specific area of the chart.
- Pan. Shift chart left and right along the time axis.
- Change chart settings such as chart type, Y-axis range, and legends.
- Save and share charts

For mor information on chart features, see [Analyze metrics](aazure/azure-monitor/essentials/analyze-metrics) .



