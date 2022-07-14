---
title: Analyze log data with machine learning in Azure Monitor Log Analytics
description: Learn how to conduct time series analysis and anomaly detection on data in Azure Monitor Log Analytics. 
ms.service: azure-monitor
ms.topic: tutorial 
author: guywild
ms.author: guywild
ms.reviewer: ilanawaitser
ms.date: 07/01/2022

# Customer intent:  As a data analyst, I want to use the native machine learning capabilities of Log Analytics to gain insights from my log data without having to export data outside of Azure Monitor.

---

# Tutorial: Analyze log data with machine learning in Azure Monitor Log Analytics 

Azure Monitor provides advanced data analysis capabilities, powered by Kusto, Microsoft's big data analytics cloud platform. The Kusto Query Language (KQL) includes a set of machine learning operators and plugins for time series analysis, anomaly detection and forecasting, and root cause analysis. 

Using KQL's machine learning operators in the various Log Anayltics tools for extracting insights from logs - including queries, workbooks and dashboards, and integration with Excel - provides you with: 

- Savings on the costs and overhead of exporting data to external machine learning tools.
- The power of Kusto’s distributed database, running at high scales.
- Greater flexibility and deeper insights than out-of-the-box insights tools.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a time series 
> * Identify anomalies in a time series 
> * Provide the anomaly detection function additional input to refine results
> * Analyze the root cause of anomalies

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A workspace with log data.
## Create a time series 

Use the KQL `make-series` to create a time series. 

Let's create a time series based on logs in the `Usage` table, which holds information about how much data each table in a workspace ingests every hour, including billable and non-billable data ingestion.

This query uses `make-series` to chart the total amount of billable data ingested by each table in the workspace each day, over the past 21 days:

```kusto
let starttime = 21d; // The start date of the time series, counting back from the current date
let endtime = 0d; // The end date of the time series, counting back from the current date
let timeframe = 1d; // How often to sample data
Usage // The table we’re analyzing
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Time range for the query, beginning at 12:00 am of the first day and ending at 11:59 of the last day in the time range
| where IsBillable == "true" // Include only billable data in the result set
| make-series ActualUsage=sum(Quantity) default = 0 on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe by DataType // TODO
| render timechart // Renders results in a timechart
``` 

Looking at the resulting chart, we can see anomalies - for example, in the `AzureDiagnostics` and `SecurityEvent` data types: 

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/make-series-kql.gif" alt-text="An animated GIF showing a chart of the total data ingested by each table in the workspace each day, over 21 days. The cursor moves to highlight three usage anomalies on the chart."::: 

> [!NOTE]
> For more information about `make-series` syntax and usage, see [make-series operator](/azure/data-explorer/kusto/query/make-seriesoperator).

## Find anomalies in the time series

The `series_decompose_anomalies()` function takes a series of values as input and extracts anomalies.

Let's give the result set of our time series query as input to the `series_decompose_anomalies()` function:  

```kusto
let starttime = 21d; // Start date for the time series, counting back from the current date
let endtime = 0d; // End date for the time series, counting back from the current date
let timeframe = 1d; // How often to sample data
Usage // The table we’re analyzing
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Time range for the query, beginning at 12:00 AM of the first day and ending at 11:59 PM of the last day in the time range
| where IsBillable == "true" // Includes only billable data in the result set
| make-series ActualUsage=sum(Quantity) default = 0 on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe by DataType // TODO
| extend(Anomalies, AnomalyScore, ExpectedUsage) = series_decompose_anomalies(ActualUsage) // Scores and extracts anomalies based on the output of make-series 
| mv-expand ActualUsage to typeof(double), TimeGenerated to typeof(datetime), Anomalies to typeof(double),AnomalyScore to typeof(double), ExpectedUsage to typeof(long) // Expands the array created by series_decompose_anomalies()
| where Anomalies != 0  // Returns all positive and negative deviations from expected usage
| project TimeGenerated,ActualUsage,ExpectedUsage,AnomalyScore,Anomalies,DataType // Defines which columns to return 
| sort by abs(AnomalyScore) desc // Sorts results by anomaly score in descending ordering
```

This query returns all usage anomalies for all tables in the last three weeks:

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/anomalies-kql.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/anomalies-kql.png" alt-text="A screenshot of a table showing a list of anomalies in usage for all tables in the workspace."::: 

Looking at the query results, you can see that the function: 

- Calculates an expected daily usage for each table.
- Compares actual daily usage day to expected usage.
- Gives an anomaly score at each data point, indicating the extent of the deviation of actual usage from expected usage.
- Identifies positive (`1`) and negative (`-1`) anomalies in each table.    

> [!NOTE]
> For more information about `series_decompose_anomalies()` syntax and usage, see [`series_decompose_anomalies()`](/azure/data-explorer/kusto/query/series-decompose-anomaliesfunction).

## Provide the anomaly detection function additional input to refine results

Filter the results of the `series_decompose_anomalies()` query for anomalies in the `AzureDiagnostics` data type:

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/anomalies-filtered-kql.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/anomalies-filtered-kql.png" alt-text="A table showing the results of the anomaly detection query, filtered for results from the Azure Diagnostics data type."::: 

The results show two anomalies on June 14 and June 15.

Compare these results with the chart from our first `make-series` query, where you can see other anomalies on May 26, 27, and 28:

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/make-series-kql-anomalies.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/make-series-kql-anomalies.png" alt-text="A screenshot showing a chart of the total data ingested by the Azure Diagnostics table with five anomalies highlighted."::: 

The difference in results occurs because the `series_decompose_anomalies()` function scores anomalies relative to an the expected usage value, which the function calculates based on the full range of values in the input series.

To get more refined results from the function, exclude the usage on the June 15 - which is an outlier compared to the other values in the series - from the function's learning process:

```kusto
series_decompose_anomalies(ActualUsage,1.5,-1,'avg',1) // 1.5 is the threshold (anomalyscore threshold) [default], -1 is Autodetect seasonality [default], avg -  Define trend component as average of the series [default], 1 – number of points  at the end of the series to exclude from the learning process [default]
```
Get all usage anomalies for all data types.
3.	Focus in on analyzing anomalies of the Azure Diagnostics data type. We’ll run anomaly detection and pattern recognition functions on Azure Diagnostics table to find out which resource caused anomalous usage. 


<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)