---
title: Azure Monitor metrics explorer
description: Learn about new features in Azure Monitor metrics explorer
author: vgorbenko
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 01/22/2019
ms.author: vitalyg
ms.subservice: metrics
---

# Azure Monitor metrics explorer

Azure Monitor metrics explorer is a component of the Microsoft Azure portal that allows plotting charts, visually correlating trends, and investigating spikes and dips in metrics' values. Metrics explorer is an essential starting point for investigating various performance and availability issues with your applications and infrastructure hosted in Azure or monitored by Azure Monitor services.

## Metrics in Azure

[Metrics in Azure Monitor](data-collection.md#metrics) are the series of measured values and counts that are collected and stored over time. There are standard (or “platform”) metrics, and custom metrics. The standard metrics are provided to you by the Azure platform itself. Standard metrics reflect the health and usage statistics of your Azure resources. Whereas custom metrics are sent to Azure by your applications using the [Application Insights API for custom events and metrics](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics),  [Windows Azure Diagnostics (WAD) extension](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostics-extension-overview), or by [Azure Monitor REST API](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-store-custom-rest-api).

## Create a new chart

1. Open the Azure portal
2. Navigate to the new **Monitor** tab, and then select **Metrics**.

   ![Metrics Image](./media/metrics-charts/00001.png)

3. The **metric selector** will automatically be open for you. Choose a resource from the list to view its associated metrics. Only resources with metrics are shown in the list.

   ![Metrics Image](./media/metrics-charts/00002.png)

   > [!NOTE]
   >If you have more than one Azure subscription, Metrics Explorer pulls out the resources across all subscriptions that are selected in the Portal Settings -> Filter by subscriptions list. To change it, click on the Portal settings gear icon on top of the screen and select which subscriptions you want to use.

4. For some resources types (Storage Accounts and Virtual Machines), before selecting a metric you must choose a **Namespace**. Each namespace carries its own set of metrics that are relevant to this namespace only, and not to other namespaces.

   For example, each Azure Storage has metrics for subservices “Blobs”, “Files”, “Queues” and “Tables”, which are all parts of the storage account. However, the metric “Queue Message Count” is naturally applicable to the subservice “Queue” and not to any other storage account subservices.

   ![Metrics Image](./media/metrics-charts/00003.png)

5. Select a metric from the list. If you know a partial name of the metric you want, you can start typing it in to see a filtered list of available metrics:

   ![Metrics Image](./media/metrics-charts/00004.png)

6. After selecting a metric, the chart will render with the default aggregation for the selected metric. At this point you can just click away from the **metrics selector** to close it. You can also optionally switch the chart to a different aggregation. For some metrics, switching aggregation allows you to choose which value you want to see on the chart. For example, you can switch between the average, minimum and maximum values. 

7. By clicking on **Add metric** and repeating steps 3-6, you can add more metrics on the same chart.

   > [!NOTE]
   > You typically don’t want to have metrics with different units of measure (i.e. “milliseconds” and “kilobytes”) or with significantly different scale on one chart. Instead, consider using multiple charts. Click on the Add Chart button to create multiple charts in metrics explorer.

## Apply filters to charts

You can apply filters to the charts that show metrics with dimensions. For example, if the metric “Transaction count” has a dimension, “Response type”, which indicates whether the response from transactions succeeded or failed then filtering on this dimension would plot a chart line for only successful (or only failed) transactions. 

### To add a filter

1. Select **Add filter** above the chart

2. Select which dimension (property) you want to filter

   ![metric image](./media/metrics-charts/00006.png)

3. Select which dimension values you want to include when plotting the chart (this example shows filtering out the successful storage transactions):

   ![metric image](./media/metrics-charts/00007.png)

4. After selecting the filter values, click away from the Filter Selector to close it. Now the chart shows how many storage transactions have failed:

   ![metric image](./media/metrics-charts/00008.png)

5. You can repeat steps 1-4 to apply multiple filters to the same charts.

## Apply splitting to a chart

You can split a metric by dimension to visualize how different segments of the metric compare against each other, and identify the outlying segments of a dimension. 

### To apply splitting

1. Click on **Apply splitting** above the chart.
 
   > [!NOTE]
   > Splitting cannot be used with charts that have multiple metrics. Also, you can have multiple filters but only one splitting dimension applied to any single chart.

2. Choose a dimension on which you want to segment your chart:

   ![metric image](./media/metrics-charts/00010.png)

   Now the chart now shows multiple lines, one for each segment of dimension:

   ![metric image](./media/metrics-charts/00012.png)

3. Click away from the **Grouping Selector** to close it.

   > [!NOTE]
   > Use both Filtering and Splitting on the same dimension to hide the segments that are irrelevant for your scenario and make charts easier to read.

## Lock boundaries of chart y-axis

Locking the range of the y-axis becomes important when the chart shows smaller fluctuations of larger values. 

For example, when the volume of successful requests drops down from 99.99% to 99.5%, it may represent a significant reduction in the quality of service. However, noticing a small numeric value fluctuation would be difficult or even impossible from the default chart settings. In this case you could lock the lowest boundary of the chart to 99%, which would make this small drop more apparent. 

Another example is a fluctuation in the available memory, where the value will technically never reach 0. Fixing the range to a higher value may make the drops in available memory easier to spot. 

To control the y-axis range, use the “…” chart menu, and select **Edit chart** to access advanced chart settings. Modify the values in the Y-Axis Range  section, or use **Auto** button to revert to defaults.

![metric image](./media/metrics-charts/00014-manually-set-granularity.png)

> [!WARNING]
> Locking the boundaries of y-axis for the charts that track various counts or sums over a period of time (and thus use count, sum, minimum, or maximum aggregations) usually requires specifying a fixed time granularity rather than relying on the automatic defaults. This is necessary is because the values on charts change when the time granularity is automatically modified by the user resizing browser window or going from one screen resolution to another. The resulting change in time granularity effects the look of the chart, invalidating current selection of y-axis range.

## Pin charts to dashboards

After configuring the charts, you may want to add it to the dashboards so that you can view it again, possibly in context of other monitoring telemetry, or share with your team.

To pin a configured chart to a dashboard:

After configuring your chart, click on the **Chart Actions** menu in the right top corner of the chart, and click **Pin to dashboard**.

![metric image](./media/metrics-charts/00013.png)

## Create alert rules

You can use the criteria you have set to visualize your metrics as the basis of a metric based alert rule. The new alerting rule will include your target resource, metric, splitting, and filter dimensions from your chart. You will be able to modify these settings later on the alert rule creation pane.

### To create a new alert rule, click **New Alert rule**

![New alert rule button highlighted in red](./media/metrics-charts/015.png)

You will be taken to the alert rule creation pane with the underlying metric dimensions from your chart pre-populated to make it easier to generate custom alert rules.

![Create alert rule](./media/metrics-charts/016.png)

Check out this [article](alerts-metric.md) to learn more about setting up metric alerts.

## Troubleshooting

*I don't see any data on my chart.*

* Filters apply to all the charts on the pane. Make sure that, while you're focusing on one chart, you didn't set a filter that excludes all the data on another.

* If you want to set different filters on different charts, create them in different blades, save them as separate favorites. If you want, you can pin them to the dashboard so that you can see them alongside each other.

* If you segment a chart by a property that is not defined on the metric, then there will be nothing on the chart. Try clearing the segmentation (splitting), or choose a different property.

## Next steps

  Read [Creating custom KPI dashboards](https://docs.microsoft.com/azure/application-insights/app-insights-tutorial-dashboards) to learn about the best practices for creating actionable dashboards with metrics.

