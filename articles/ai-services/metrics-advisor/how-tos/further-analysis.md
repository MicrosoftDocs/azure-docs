---
title: Further analyze an incident and evaluate impact
titleSuffix: Azure AI services
description: Learn how to leverage analysis tools to further analyze an incident. 
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-metrics-advisor
ms.topic: how-to
ms.date: 04/15/2021
ms.author: mbullwin
---

# Further analyze an incident and evaluate impact

[!INCLUDE [Deprecation announcement](../includes/deprecation.md)]

## Metrics drill down by dimensions

When you're viewing incident information, you may need to get more detailed information, for example, for different dimensions, and timestamps. If your data has one or more dimensions, you can use the drill down function to get a more detailed view. 

To use the drill down function, select the **Metric drilling** tab in the **Incident hub**. 

:::image type="content" source="../media/diagnostics/metric-drilling.png" lightbox="../media/diagnostics/metric-drilling.png" alt-text="Metric drilling ":::

The **Dimensions** setting is a list of dimensions for an incident, you can select other available dimension values for each one. After the dimension values are changed. The **Timestamp** setting lets you view the current incident at different moments in time.

### Select drilling options and choose a dimension

There are two types of drill down options: **Drill down** and **Horizontal comparison**.

> [!Note]
> - For drill down, you can explore the data from different dimension values, except the currenly selected dimensions. 
> - For horizontal comparison, you can explore the data from different dimension values, except the all-up dimensions.

:::image type="content" source="../media/diagnostics/drill-down-dimension.png" lightbox="../media/diagnostics/drill-down-dimension.png" alt-text="Drill down dimension":::

### Value comparison for different dimension values

The second section of the drill down tab is a table with comparisons for different dimension values. It includes the value, baseline value, difference value, delta value and whether it is an anomaly.

:::image type="content" source="../media/diagnostics/drill-down-comparison.png" alt-text="Drill down comparison" lightbox="../media/diagnostics/drill-down-comparison.png":::

### Value and expected value comparisons for different dimension value

The third section of the drill down tab is a histogram with the values and expected values, for different dimension values. The histogram is sorted by the difference between value and expected value. You can find the unexpected value with the biggest impact easily. For example, in the above picture, we can find that, except the all up value, **US7** contributes the most for the anomaly.

:::image type="content" source="../media/diagnostics/drill-down-table.png" alt-text="Drill down table" lightbox="../media/diagnostics/drill-down-table.png":::

### Raw value visualization
The last part of drill down tab is a line chart of the raw values. With this chart provided, you don't need to navigate to the metric page to view details.

:::image type="content" source="../media/diagnostics/drill-down-line-chart.png" alt-text="Drill down line chart" lightbox="../media/diagnostics/drill-down-line-chart.png":::

## Compare time series

Sometimes when an anomaly is detected on a specific time series, it's helpful to compare it with multiple other series in a single visualization. 
Select the **Compare tools** tab, and then select the blue **+ Add** button. 

:::image type="content" source="../media/diagnostics/add-series.png" alt-text="Add series to compare" lightbox="../media/diagnostics/add-series.png":::

Select a series from your data feed. You can choose the same granularity or a different one. Select the target dimensions and load the series trend, then click **Ok** to compare it with a previous series. The series will be put together in one visualization. You can continue to add more series for comparison and get further insights. Select the drop down menu at the top of the **Compare tools** tab to compare the time series data over a time-shifted period.  

> [!Warning]
> To make a comparison, time series data analysis may require shifts in data points so the granularity of your data must support it. For example, if your data is weekly and you use the **Day over day** comparison, you will get no results. In this example, you would use the **Month over month** comparison instead.

After selecting a time-shifted comparison, you can select whether you want to compare the data values, the delta values, or the percentage delta.

## View similar anomalies using Time Series Clustering

When viewing an incident, you can use the **Similar time-series-clustering** tab to see the various series associated with it. Series in one group are summarized together. From the above picture, we can know that there is at least two series groups. This feature is only available if the following requirements are met:

- Metrics must have one or more dimensions or dimension values.
- The series within one metric must have a similar trend.

Available dimensions are listed on the top the tab, and you can make a selection to specify the series.

:::image type="content" source="../media/diagnostics/series-group.png" lightbox="../media/diagnostics/series-group.png" alt-text="Series group":::
