---
title: Azure Monitor metrics explorer
description: Learn about new features in Azure Monitor Metrics Explorer
author: vgorbenko
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/17/2017
ms.author: vitaly.gorbenko
ms.component: metrics
---

# Azure Monitor Metrics Explorer

Azure Monitor Metrics Explorer is a component of the Microsoft Azure portal that allows plotting charts, visually correlating trends, and investigating spikes and dips in metrics' values. Metrics Explorer is an essential starting point for investigating various performance and availability issues with your applications and infrastructure hosted in Azure or monitored by Azure Monitor services. 

## What are metrics in Azure?

Metrics in Microsoft Azure are the series of measured values and counts that are collected and stored over time. There are standard (or “platform”) metrics, and custom metrics. The standard metrics are provided to you by the Azure platform itself. Standard metrics reflect the health and usage statistics of your Azure resources. Whereas custom metrics are sent to Azure by your applications using the [Application Insights API for custom events](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics). Custom metrics are stored in the Application Insights resources together with other application specific metrics.

## How do I create a new chart?

1. Open the Azure portal
2. Navigate to the new **Monitor** tab, and then select **Metrics**.

   ![Metrics Image](./media/monitoring-metric-charts/0001.png)

3. The **metric selector** will automatically be open for you. Choose a resource from the list to view its associated metrics. Only resources with metrics are shown in the list.

   ![Metrics Image](./media/monitoring-metric-charts/0002.png)

   > [!NOTE]
   >If you have more than one Azure subscription, Metrics Explorer pulls out the resources across all subscriptions that are selected in the Portal Settings -> Filter by subscriptions list. To change it, click on the Portal settings gear icon on top of the screen and select which subscriptions you want to use.

4. For some resources types (Storage Accounts and Virtual Machines), before selecting a metric you must choose a **Namespace**. Each namespace carries its own set of metrics that are relevant to this namespace only, and not to other namespaces.

   For example, each Azure Storage has metrics for subservices “Blobs”, “Files”, “Queues” and “Tables”, which are all parts of the storage account. However, the metric “Queue Message Count” is naturally applicable to the subservice “Queue” and not to any other storage account subservices.

   ![Metrics Image](./media/monitoring-metric-charts/0003.png)

5. Select a metric from the list. If you know a partial name of the metric you want, you can start typing it in to see a filtered list of available metrics:

   ![Metrics Image](./media/monitoring-metric-charts/0004.png)

6. After selecting a metric, the chart will render with the default aggregation for the selected metric. At this point you can just click away from the **metrics selector** to close it. You can also optionally switch the chart to a different aggregation. For some metrics, switching aggregation allows you to choose which value you want to see on the chart. For example, you can switch between the average, minimum and maximum values. 

7. By clicking on the Add Metric icon ![metric icon](./media/monitoring-metric-charts/icon001.png) and repeating steps 3-6 you can add more metrics on the same chart.

   > [!NOTE]
   > You typically don’t want to have metrics with different units of measure (i.e. “milliseconds” and “kilobytes”) or with significantly different scale on one chart. Instead, consider using multiple charts. Click on the Add Chart button to create multiple charts in Metrics Explorer.

## How do I apply filters to the charts?

You can apply filters to the charts that show metrics with dimensions. For example, if the metric “Transaction count” has a dimension, “Response type”, which indicates whether the response from transactions succeeded or failed then filtering on this dimension would plot a chart line for only successful (or only failed) transactions. 

### To add a filter:

1. Click on the Add Filter icon ![filter icon](./media/monitoring-metric-charts/icon002.png) above the chart

2. Select which dimension (property) you want to filter

   ![metric image](./media/monitoring-metric-charts/0006.png)

3. Select which dimension values you want to include when plotting the chart (this example shows filtering out the successful storage transactions):

   ![metric image](./media/monitoring-metric-charts/0007.png)

4. After selecting the filter values, click away from the Filter Selector to close it. Now the chart shows how many storage transactions have failed:

   ![metric image](./media/monitoring-metric-charts/0008.png)

5. You can repeat steps 1-4 to apply multiple filters to the same charts.

## How do I segment a chart?

You can split a metric by dimension to visualize how different segments of the metric compare against each other, and identify the outlying segments of a dimension. 

### To segment a chart:

1. Click on the Add Grouping icon  ![metric image](./media/monitoring-metric-charts/icon003.png) above the chart.
 
   > [!NOTE]
   > You can have multiple filters but only one grouping on any single chart.

2. Choose a dimension on which you want to segment your chart: 

   ![metric image](./media/monitoring-metric-charts/0010.png)

   Now the chart now shows multiple lines, one for each segment of dimension:

   ![metric image](./media/monitoring-metric-charts/0012.png)

3. Click away from the **Grouping Selector** to close it.

   > [!NOTE]
   > Use both Filtering and Grouping on the same dimension to hide the segments that are irrelevant for your scenario and make charts easier to read.

## How do I pin charts to dashboards?

After configuring the charts, you may want to add it to the dashboards so that you can view it again, possibly in context of other monitoring telemetry, or share with your team. 

To pin a configured chart to a dashboard:

After configuring your chart, click on the **Chart Actions** menu in the right top corner of the chart, and click **Pin to dashboard**.

   ![metric image](./media/monitoring-metric-charts/0013.png)

## Next steps

  Read [Creating custom KPI dashboards](https://docs.microsoft.com/azure/application-insights/app-insights-tutorial-dashboards) to learn about the best practices for creating actionable dashboards with metrics.