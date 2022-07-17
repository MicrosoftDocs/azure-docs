---
title: Analyze log data with machine learning in Azure Monitor Log Analytics
description: Learn how to use KQL machine learning tools for time series analysis and anomaly detection in Azure Monitor Log Analytics. 
ms.service: azure-monitor
ms.topic: tutorial 
author: guywild
ms.author: guywild
ms.reviewer: ilanawaitser
ms.date: 07/01/2022

# Customer intent:  As a data analyst, I want to use the native machine learning capabilities of Log Analytics to gain insights from my log data without having to export data outside of Azure Monitor.

---

# Tutorial: Detect and analyze anomalies with machine learning in Log Analytics using KQL 

The Kusto Query Language (KQL) includes a set of machine learning operators, functions and plugins for time series analysis, anomaly detection, forecasting, and root cause analysis. Using KQL's machine learning operators in Log Analytics give you advanced data analysis capabilities and the power of Kusto’s distributed database, running at high scales, without the overhead of exporting data to external machine learning tools.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a time series 
> * Identify anomalies in a time series 
> * Tweak anomaly detection settings to refine results
> * Analyze the root cause of anomalies

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A workspace with log data.
## Create a time series 

Use the KQL `make-series` to create a time series. 

Let's create a time series based on logs in the `Usage` table, which holds information about how much data each table in a workspace ingests every hour, including billable and non-billable data.

This query uses `make-series` to chart the total amount of billable data ingested by each table in the workspace each day, over the past 21 days:

```kusto
let starttime = 21d; // The start date of the time series, counting back from the current date
let endtime = 0d; // The end date of the time series, counting back from the current date
let timeframe = 1d; // How often to sample data
Usage // The table we’re analyzing
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Time range for the query, beginning at 12:00 am of the first day and ending at 11:59 of the last day in the time range
| where IsBillable == "true" // Include only billable data in the result set
| make-series ActualUsage=sum(Quantity) default = 0 on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe by DataType // Creates the time series, listed by data type 
| render timechart // Renders results in a timechart
``` 

In the resulting chart, you can clearly see some anomalies - for example, in the `AzureDiagnostics` and `SecurityEvent` data types: 

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/make-series-kql.gif" alt-text="An animated GIF showing a chart of the total data ingested by each table in the workspace each day, over 21 days. The cursor moves to highlight three usage anomalies on the chart."::: 

Next, we'll use a KQL function to list all of the anomalies in a time series.

> [!NOTE]
> For more information about `make-series` syntax and usage, see [make-series operator](/azure/data-explorer/kusto/query/make-seriesoperator).

## Find anomalies in a time series

The `series_decompose_anomalies()` function takes a series of values as input and extracts anomalies.

Let's give the result set of our time series query as input to the `series_decompose_anomalies()` function:  

```kusto
let starttime = 21d; // Start date for the time series, counting back from the current date
let endtime = 0d; // End date for the time series, counting back from the current date
let timeframe = 1d; // How often to sample data
Usage // The table we’re analyzing
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Time range for the query, beginning at 12:00 AM of the first day and ending at 11:59 PM of the last day in the time range
| where IsBillable == "true" // Includes only billable data in the result set
| make-series ActualUsage=sum(Quantity) default = 0 on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe by DataType // Creates the time series, listed by data type
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
- Compares actual daily usage to expected usage.
- Assigns an anomaly score to each data point, indicating the extent of the deviation of actual usage from expected usage.
- Identifies positive (`1`) and negative (`-1`) anomalies in each table.    

> [!NOTE]
> For more information about `series_decompose_anomalies()` syntax and usage, see [series_decompose_anomalies()](/azure/data-explorer/kusto/query/series-decompose-anomaliesfunction).

## Tweak anomaly detection settings to refine results

It's good practice to verify that the anomaly detection function produces the results you'd expect. Outliers in input data can affect the functions learning, and you might need to adjust the function's anomaly detection settings to get more accurate results.

Filter the results of the `series_decompose_anomalies()` query for anomalies in the `AzureDiagnostics` data type:

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/anomalies-filtered-kql.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/anomalies-filtered-kql.png" alt-text="A table showing the results of the anomaly detection query, filtered for results from the Azure Diagnostics data type."::: 

The results show two anomalies on June 14 and June 15. Compare these results with the chart from our first `make-series` query, where you can see other anomalies on May 27 and 28:

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/make-series-kql-anomalies.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/make-series-kql-anomalies.png" alt-text="A screenshot showing a chart of the total data ingested by the Azure Diagnostics table with anomalies highlighted."::: 

The difference in results occurs because the `series_decompose_anomalies()` function scores anomalies relative to the expected usage value, which the function calculates based on the full range of values in the input series.

To get more refined results from the function, exclude the usage on the June 15 - which is an outlier compared to the other values in the series - from the function's learning process.

The [syntax of the `series_decompose_anomalies()` function](/azure/data-explorer/kusto/query/series-decompose-anomaliesfunction) is:

`series_decompose_anomalies (Series[Threshold,Seasonality,Trend,Test_points,AD_method,Seasonality_threshold])`

`Test_points` specifies the number of points at the end of the series to exclude from the learning (regression) process. 

To exclude the last data point, set `Test_points` to `1`: 

```kusto
let starttime = 21d; // Start date for the time series, counting back from the current date
let endtime = 0d; // End date for the time series, counting back from the current date
let timeframe = 1d; // How often to sample data
Usage // The table we’re analyzing
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Time range for the query, beginning at 12:00 AM of the first day and ending at 11:59 PM of the last day in the time range
| where IsBillable == "true" // Includes only billable data in the result set
| make-series ActualUsage=sum(Quantity) default = 0 on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe by DataType // TODO
| extend(Anomalies, AnomalyScore, ExpectedUsage) = series_decompose_anomalies(ActualUsage,1.5,-1,'avg',1) // Scores and extracts anomalies based on the output of make-series, excluding the last value in the series 
| mv-expand ActualUsage to typeof(double), TimeGenerated to typeof(datetime), Anomalies to typeof(double),AnomalyScore to typeof(double), ExpectedUsage to typeof(long) // Expands the array created by series_decompose_anomalies()
| where Anomalies != 0  // Returns all positive and negative deviations from expected usage
| project TimeGenerated,ActualUsage,ExpectedUsage,AnomalyScore,Anomalies,DataType // Defines which columns to return 
| sort by abs(AnomalyScore) desc // Sorts results by anomaly score in descending ordering
```

Filter the results for the `AzureDiagnostics` data type:

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/refined-anomalies-filtered-kql.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/refined-anomalies-filtered-kql.png" alt-text="A table showing the results of the modified anomaly detection query, filtered for results from the Azure Diagnostics data type. The results now show the same anomalies as the chart created at the beginning of the tutorial."::: 

All of the anomalies in the chart from our first `make-series` query now appear in the result set. 

## Analyze the root cause of anomalies

Comparing expected values to anomalous values helps you understand the cause of the differences between the two sets. 

The KQL `diffpatterns()` plugin compares two data sets of the same structure and finds patterns that characterize differences between the two data sets.

This query compares `AzureDiagnostics` usage on June 15, the extreme outlier in our example, with the table usage on other days: 

```kusto
let starttime = 21d; // Start date for the time series, counting back from the current date
let endtime = 0d; // End date for the time series, counting back from the current date
let last_date_in_range = datetime_add('day',-1, make_datetime(startofday(ago(endtime))));
AzureDiagnostics	
| extend AnomalyDate = iff(startofday(TimeGenerated) == last_date_in_range, "AnomalyDate", "OtherDates") // Adds calculated column called AnomalyDate, which splits the result set into two data sets – AnomalyDate and OtherDates
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Defines the time range for the query
| project AnomalyDate, Resource // Defines which columns to return
| evaluate diffpatterns(AnomalyDate, "OtherDates", "AnomalyDate") // Compares usage on the anomaly date with the regular usage pattern
```

The query identifies each entry in the table as occurring on *AnomalyDate* (June 15) or *OtherDates*. The `diffpatterns()` plugin then splits these data sets - called A and B - and returns a few patterns that contribute to the differences in the two sets:

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/diffpatterns-kql-log-analytics.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/diffpatterns-kql-log-analytics.png" alt-text="A screenshot showing a table with three rows. Each row shows a difference between the usage on the anomalous use and the baseline usage."::: 

Looking at the query results, you can see the following differences:

-  There are 24,892,147 instances of ingestion from the *CH1-GEARAMAAKS* resource on June 15, and no ingestion of data from this resource on other days within the 21-day query time range. Data from the *CH1-GEARAMAAKS* resource accounts for 73.36% of the total ingestion on June 15.
- There are 2,168,448 instances of ingestion from the *NSG-TESTSQLMI519* resource on June 15, and 110,544 instances of ingestion from this resource on other days within the query time range. Data from the *NSG-TESTSQLMI519* resource accounts for 6.39% of the total ingestion on June 15 and 19.22% of ingestion on other days with the time range.
- There are 2,226,837 instances of ingestion from the *CH1-SQLMINSG* resource on June 15, and 106,007 instances of the total ingestion from this resource on other days within the query time range. Data from the *CH1-SQLMINSG* resource accounts for 6.56% of the total ingestion on June 15 and 24.56% of the total ingestion on other days with the time range.

The *PercentDiffAB* column shows the absolute percentage point difference between A and B (|PercentA - PercentB|), which is the main measure of the difference between the two sets. To return only differences of 20% or more between the two data sets, you can set `| evaluate diffpatterns(AnomalyDate, "OtherDates", "AnomalyDate", "~", 0.20)` in the query above:

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/diffpatterns-kql-log-analytics.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/diffpatterns-kql-log-analytics-threshold.png" alt-text="A screenshot showing a table with one row that presents a difference between the usage on the anomalous use and the baseline usage. This time, the query did not return differences of less than 20 percent between the two data sets."::: 

> [!NOTE]
> For more information about `diffpatterns()` syntax and usage, see [diff patterns plugin](/azure/data-explorer/kusto/query/diffpatternsplugin).

## Next steps

> Learn more about [log queries in Azure Monitor](/azure-monitor/logs/log-query-overview).
> [Tutorial: Use Kusto queries](/data-explorer/kusto/query/tutorial?pivots=azuremonitor).