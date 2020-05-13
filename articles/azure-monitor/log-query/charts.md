---
title: Creating charts and diagrams from Azure Monitor log queries | Microsoft Docs
description: Describes various visualizations in Azure Monitor to display your log data in different ways.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/16/2018

---

# Creating charts and diagrams from Azure Monitor log queries

> [!NOTE]
> You should complete [Advanced aggregations in Azure Monitor log queries](advanced-aggregations.md) before completing this lesson.

[!INCLUDE [log-analytics-demo-environment](../../../includes/log-analytics-demo-environment.md)]

This article describes various visualizations in Azure Monitor to display your log data in different ways.

## Charting the results
Start by reviewing how many computers there are per operating system, during the past hour:

```Kusto
Heartbeat
| where TimeGenerated > ago(1h)
| summarize count(Computer) by OSType  
```

By default, results display as a table:

![Table](media/charts/table-display.png)

To get a better view, select **Chart**, and choose the **Pie** option to visualize the results:

![Pie chart](media/charts/charts-and-diagrams-pie.png)


## Timecharts
Show the average, 50th and 95th percentiles of processor time in bins of 1 hour. The query generates multiple series and you can then select which series to show in the time chart:

```Kusto
Perf
| where TimeGenerated > ago(1d) 
| where CounterName == "% Processor Time" 
| summarize avg(CounterValue), percentiles(CounterValue, 50, 95)  by bin(TimeGenerated, 1h)
```

Select the **Line** chart display option:

![Line chart](media/charts/charts-and-diagrams-multiSeries.png)

### Reference line

A reference line can help you easily identifying if the metric exceeded a specific threshold. To add a line to a chart, extend the dataset with a constant column:

```Kusto
Perf
| where TimeGenerated > ago(1d) 
| where CounterName == "% Processor Time" 
| summarize avg(CounterValue), percentiles(CounterValue, 50, 95)  by bin(TimeGenerated, 1h)
| extend Threshold = 20
```

![Reference line](media/charts/charts-and-diagrams-multiSeriesThreshold.png)

## Multiple dimensions
Multiple expressions in the `by` clause of `summarize` create multiple rows in the results, one for each combination of values.

```Kusto
SecurityEvent
| where TimeGenerated > ago(1d)
| summarize count() by tostring(EventID), AccountType, bin(TimeGenerated, 1h)
```

When you view the results as a chart, it uses the first column from the `by` clause. The following example shows a stacked column chart using the _EventID._ Dimensions must be of `string` type, so in this example the _EventID_ is being cast to string. 

![Bar chart EventID](media/charts/charts-and-diagrams-multiDimension1.png)

You can switch between by selecting the dropdown with the column name. 

![Bar chart AccountType](media/charts/charts-and-diagrams-multiDimension2.png)

## Next steps
See other lessons for using the [Kusto query language](/azure/kusto/query/) with Azure Monitor log data:

- [String operations](string-operations.md)
- [Date and time operations](datetime-operations.md)
- [Aggregation functions](aggregations.md)
- [Advanced aggregations](advanced-aggregations.md)
- [JSON and data structures](json-data-structures.md)
- [Advanced query writing](advanced-query-writing.md)
- [Joins](joins.md)
