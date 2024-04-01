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

Metrics Explorer for Azure Monitor workspace (Preview) is allows you to analyze and visualize metrics stored in an Azure Monitor workspace.  You can use the metrics explorer to create and customize charts, and to analyze and troubleshoot issues with your resources.  The metrics explorer supports Prometheus query language (PromQL), allowing you to query and visualize metrics data in a flexible and powerful way.  For more information on PromQL, see [Querying Prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/).


## Create a Chart

Metrics explorer for Azure Monitor workspace (Preview) is available from the **Metrics** blade of the Azure Monitor workspace in the Azure portal. The **New chart** pane opens on the right side of the screen.  



The chart pane has two options for charting a metric:
-  Add with builder
-  Add with editor.

### Create a chart with the builder
To add a metric with the builder, select **Add metric** and select **Add with builder**. Use the toolbar to select a scope and metric from the drop-down lists.  The scope is the azure monitor workspace where the metric is stored. The metric is displayed by default as a line chart the chart. Select your preferred chart type from the dropdown list in the toolbar. Customize the chart by selecting the gear-wheel icon.  You can change the chart title, add annotations, and set the time range for the chart.  You can also add 



:::image type="content" source="./media/metrics-explorer/add-metric-with-builder.png" lightbox="./media/metrics-explorer/add-metric-with-builder.png"  alt-text="A screenshot showing adding a metric using the builder in the metrics explorer." :::

### Create a chart with the editor and PromQL
To add a metric using the editor, select **Add metric** and select **Add with editor**.  Use select a scope form the dropdown list and in the editor field, enter a PromQL query to retrieve metrics data. Select **Run** to run the query and display the results in the chart.  You can customize the chart by selecting the gear-wheel icon.  You can change the chart title, add annotations, and set the time range for the chart. 

:::image type="content" source="./media/metrics-explorer/add-metric-with-editor.png"  lightbox="./media/metrics-explorer/add-metric-with-editor.png"  alt-text="A screenshot showing adding a metric using the editor." :::




## Muliple metrics and charts 
Add multiple metrics to the chart by selecting **Add metric**. Use either the builder or the editor to add metrics to the chart.  
You can add up to <<<<<<<10>>>>>>> metrics to a chart.  Each metric and query is plotted on the chart and added to the legend.  You can choose a different scope for each metric by selecting the scope dropdown list in the toolbar to compare metrics from different resources.

> [!NOTE]
> Running both the code editor and query builder on the same chart is not supported in this current release and may result in unexpected behavior.

You can create additional charts by selecting **New chart**.  Each chart can have multiple metrics, different chart types and settings. The time range and granularity is common for all the charts in the workspace.

To remove a chart select the **...** options icon and select **Remove**.
:::image type="content" source="./media/metrics-explorer/create-multiple-charts.png" lightbox="./media/metrics-explorer/create-multiple-charts.png" alt-text="A screenshot showing multiple charts.":::

## Configure the time range
The time picker lets you configure the time range for your metric chart to view data that's relevant to your monitoring scenario. By default, the chart shows the most recent 24 hours of metrics data.

Set the time range for the chart by selecting the time range dropdown list in the toolbar.  

:::image type="content" source="./media/metrics-explorer/time-picker.png" lightbox="./media/metrics-explorer/time-picker.png"  alt-text="A screenshot showing time range picker." :::

## Pan across metrics data

To pan, select the left and right arrows at the edge of the chart. The arrow control moves the selected time range back and forward by one half of the chart's time span. If you're viewing the past 24 hours, selecting the left arrow causes the time range to shift to span a day and a half to 12 hours ago.

:::image type="content" source="./media/metrics-explorer/pan-time-axis.gif" lightbox="./media/metrics-explorer/pan-time-axis.gif"  alt-text="A screenshot showing panning across the time axis.":::


## Zoom into metrics data

You can configure the time granularity of the chart data to support zoom in and zoom out for the time range. Use the time brush to investigate an interesting area of the chart like a spike or a dip in the data. Select an area on the chart and the chart zooms in to show more detail for the selected area based on your granularity settings. If the time grain is set to Automatic, zooming selects a smaller time grain. The new time range applies to all charts in metrics explorer.


:::image type="content" source="./media/metrics-explorer/zoom-in-time.gif" lightbox="./media/metrics-explorer/zoom-in-time.gif"  alt-text="A screenshot showing zooming in on the time axis.":::

## Save and share charts

After you configure a chart, you can add it to a dashboard or workbook. By adding a chart to a dashboard or workbook, you can make it accessible to your team. You can also gain insights by viewing it in the context of other monitoring information.

- To pin a configured chart to a dashboard, in the upper-right corner of the chart, select Save to dashboard > Pin to dashboard.
- To save a configured chart to a workbook, in the upper-right corner of the chart, select Save to dashboard > Save to workbook.

:::image type="content" source="./media/metrics-explorer/save-chart.png" lightbox="./media/metrics-explorer/save-chart.png"  alt-text="A screenshot showing the save menu.":::

The Azure Monitor metrics explorer Share menu includes several options for sharing your metric chart.

- Use the **Download to Excel** option to immediately download your chart.
- Select **Copy link** to add a link to your chart to the clipboard.A notification is recieved when the link is copied successfully.
-  **Send to Workbook** sends your chart to a new or existing workbook.
- Select **Pin to Grafana** to pin your chart to a new or existing Grafana dashboard. 

:::image type="content" source="./media/metrics-explorer/share-chart.png" lightbox="./media/metrics-explorer/share-chart.png"  alt-text="A screenshot showing the share menu.":::

# Supported PromQL funtions



{TBD}




# Limitations

The metrics explorer for Azure Monitor workspace is in preview and has some limitations. 
-  The metrics explorer supports up to 10 metrics per chart. <<<<<<>>>>>>>
- The metrics explorer does not support running both the code editor and query builder on the same chart.



