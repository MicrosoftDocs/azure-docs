---
title: Metrics explorer for Azure Monitor workspace (Preview)
description: Learn about Metrics Explorer for Azure Monitor workspace, a tool in that allows you to analyze and visualize metrics stored in an Azure Monitor workspace.
author: EdB-MSFT
ms.service: azure-monitor
ms-author: edbaynash
ms.topic: conceptual
ms.date: 04/01/2024
ms.reviewer: priyamishra

# Customer intent: As an Azure Monitor user, I want to learn how to use Metrics Explorer for Azure Monitor workspace to analyze and visualize metrics stored in an Azure Monitor workspace using PromQL.

---

# Metrics explorer for Azure Monitor workspace (Preview)

Metrics Explorer for Azure Monitor workspace (Preview) allows you to analyze and visualize metrics stored in an Azure Monitor workspace. You can use the metrics explorer to create and customize charts, analyze, and troubleshoot issues with your resources. The metrics explorer supports Prometheus query language (PromQL), letting you query and visualize metrics data in a flexible and powerful way. For more information on PromQL, see [Querying Prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/).


## Create a chart

Metrics explorer for Azure Monitor workspace (Preview) is available from the **Metrics** menu item of the Azure Monitor workspace in the Azure portal. 

The chart pane has two options for charting a metric:
-  Add with builder
-  Add with editor.

### Create a chart with the builder
To add a metric with the builder, 
1. Select **Add metric** and select **Add with builder** from the dropdown. 
1. Select a scope. The scope is the Azure monitor workspace where the metric is stored.
1. Select a metric from the drop-down list.

The metric is displayed by default as a line chart the chart. Select your preferred chart type from the dropdown list in the toolbar. Customize the chart by selecting the gear-wheel icon. You can change the chart title, add annotations, and set the time range for the chart.

:::image type="content" source="./media/metrics-explorer/add-metric-with-builder.png" lightbox="./media/metrics-explorer/add-metric-with-builder.png"  alt-text="A screenshot showing adding a metric using the builder in the metrics explorer." :::

### Create a chart with the editor and PromQL

To add a metric using the editor,
1. Select **Add metric** and select **Add with editor** from the dropdown. 
1. Select a **Scope** from the dropdown list/
1. Enter a PromQL query in the editor field. Select **Run** to run the query and display the results in the chart. You can customize the chart by selecting the gear-wheel icon. You can change the chart title, add annotations, and set the time range for the chart. 

:::image type="content" source="./media/metrics-explorer/add-metric-with-editor.png"  lightbox="./media/metrics-explorer/add-metric-with-editor.png"  alt-text="A screenshot showing adding a metric using the editor." :::


## Multiple metrics and charts 
Each workspace can host multiple charts with each chart containing multiple metrics.

### Add a metric

Add multiple metrics to the chart by selecting **Add metric**. Use either the builder or the editor to add metrics to the chart. 
You can add up to <<<<<<<10>>>>>>> metrics to a chart. Each metric and query is plotted on the chart and added to the legend. You can choose a different scope for each metric by selecting the scope dropdown list in the toolbar to compare metrics from different resources.

> [!NOTE]
> Running both the code editor and query builder on the same chart is not supported in this current release and may result in unexpected behavior.


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

## Pan across metrics data

To pan, select the left and right arrows at the edge of the chart. The arrow control moves the selected time range back and forward by one half of the chart's time span. If you're viewing the past 24 hours, selecting the left arrow causes the time range to shift to span a day and a half to 12 hours ago.

:::image type="content" source="./media/metrics-explorer/pan-time-axis.gif" lightbox="./media/metrics-explorer/pan-time-axis.gif"  alt-text="A screenshot showing panning across the time axis.":::


## Zoom into metrics data

Select an area on the chart and the chart to zoom in and show more detail for the selected area based on your granularity settings. If the time grain is set to Automatic, zooming selects a smaller time grain. The new time range applies to all charts in metrics explorer. To zoom back out, select the **Undo zoom** button.


:::image type="content" source="./media/metrics-explorer/zoom-in-time.gif" lightbox="./media/metrics-explorer/zoom-in-time.gif"  alt-text="A screenshot showing zooming in on the time axis.":::

## Customize the chart

Customize the chart by selecting the gear-wheel icon in the toolbar.

- **Chart title**: Change the title of the chart.
- **Chart type**: Change the chart type to line, area, bar, or scatter.
- **Y-axis range**: Change the minimum and maximum values of the Y-axis. Use these settings to focus on a specific range of values in the chart.
- **Legends**: Position, show or hide the legend, labels, and hover card for the chart.
- **Query settings, Scrape interval**: Set the prometheus query settings. The default is 1 minute.
:::image type="content" source="./media/metrics-explorer/chart-settings.png"  lightbox="./media/metrics-explorer/chart-settings.png" alt-text="A Screenshot showing the chart settings blade.":::


## Save and share charts

After you configure a chart, you can add it to a dashboard or workbook. By adding a chart to a dashboard or workbook, you can make it accessible to your team. You can also gain insights by viewing it in the context of other monitoring information.

- To pin a configured chart to a dashboard, in the upper-right corner of the chart, select Save to dashboard > Pin to dashboard.
- To save a configured chart to a workbook, in the upper-right corner of the chart, select Save to dashboard > Save to workbook.

:::image type="content" source="./media/metrics-explorer/save-chart.png" lightbox="./media/metrics-explorer/save-chart.png"  alt-text="A screenshot showing the save menu.":::

The Azure Monitor metrics explorer Share menu includes several options for sharing your metric chart.

- Use the **Download to Excel** option to immediately download your chart.
- Select **Copy link** to add a link to your chart to the clipboard.A notification is received when the link is copied successfully.
-  **Send to Workbook** sends your chart to a new or existing workbook.
- Select **Pin to Grafana** to pin your chart to a new or existing Grafana dashboard. 

:::image type="content" source="./media/metrics-explorer/share-chart.png" lightbox="./media/metrics-explorer/share-chart.png"  alt-text="A screenshot showing the share menu.":::

# Supported PromQL functions



{TBD}




# Limitations

The metrics explorer for Azure Monitor workspace is in preview and has some limitations. 
-  The metrics explorer supports up to 10 metrics per chart. <<<<<<>>>>>>>
- The metrics explorer doesn't support running both the code editor and query builder on the same chart.



