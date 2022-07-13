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

Azure Monitor provides advanced data analysis capabilities, powered by Kusto, Microsoft's big data analytics cloud platform. The Kusto Query Language (KQL) includes a set of machine learning operators and plugins for time series analysis, anomaly detection and forecasting, and pattern recognition for root cause analysis. 

Using KQL's machine learning operators in the various Log Anayltics tools for extracting insights from logs - including queries, workbooks and dashboards, and integration with Excel - provides you with: 

- Savings on the costs and overhead of exporting data to external machine learning tools.
- The power of Kusto’s distributed database, running at high scales.
- Greater flexibility and deeper insights than out-of-the-box insights tools.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Conduct time series analysis on the Usage table using the `make-series` operator
> * Identify usage anomalies using the `series_decompose_anomalies()` function
> * Analyze the root cause of anomalies

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A workspace with log data.
## Create a time series based on data in the Usage table 

The KQL operator for creating a time series is `make-series`. You can use the `make-series` operator to create a sequence of data points indexed over a specific interval of time.

> [!NOTE]
> For more information about `make-series` syntax and usage, see [make-series operator](/azure/data-explorer/kusto/query/make-seriesoperator).

The `Usage` table holds information about how much data each table in a workspace ingests every hour, including billable and non-billable data ingestion.

Let's use `make-series` to chart the total amount of billable data ingested by each table in the workspace each day, over the past 21 days:
 
1. Create a time series chart for all billable data:

    ```kusto
    let starttime = 21d; // The start date of the time series, counting back from the current date
    let endtime = 0d; // The end date of the time series, counting back from the current date
    let timeframe = 1d; // How often to sample data
    Usage // The table we’re analyzing
    | where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Time range for the query, beginning at 12:00 am of the first day and ending at 11:59 of the last day in the time range
    | where IsBillable == "true" // Include only billable data in the result set
    | make-series ActualCount=sum(Quantity) default = 0 on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe by DataType // TODO
    | render timechart // Renders results in a timechart
    ``` 

    :::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/make-series-kql.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/make-series-kql.png" alt-text="A chart showing the total data ingested by each table in the workspace each day, over 21 days."::: 

    Looking at the chart, we can see anomalies - for example, in the `AzureDiagnostics` and `SecurityEvent` data types. However, not all anomalies are easy to detect visually on a chart. 

2. Not all anomalies are easy to detect visually on a chart, so let's modify our query to return all anomalies for all data types using the `anomalies` operator. 
    
    Replace the `render` operator in the last line of our previous query with the following lines of KQL:

    ```kusto
    | extend(anomalies, anomalyScore, expectedCount) = series_decompose_anomalies(ActualCount) // Extracts anomalous points with scores, the only parameter we pass here is the output of make-series, other parameters are default 
    | mv-expand ActualCount to typeof(double), TimeGenerated to typeof(datetime), anomalies to typeof(double),anomalyScore to typeof(double), expectedCount to typeof(long) // TODO
    | where anomalies != 0  // Return all positive and negative usage deviations from the expected count
    | project TimeGenerated, ActualCount, expectedCount,DataType,anomalyScore,anomalies // TODO check casing of column names
    | sort by abs(anomalyScore) desc;
    ```

    This query returns all usage anomalies for all tables:

    :::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/anomalies-kql.png" lightbox="/.media/machine-learning-azure-monitor-log-analytics/make-series-kql.png" alt-text="A chart showing the total data ingested by each table in the workspace each day, over 21 days."::: 

1. Filter the `DataType` column for `AzureDiagnostics` 

    We see only two anomalies - on June 14 and June 15 - while in the time series, we also saw deviations on May 27 and May 28.

 
## Teach the Log Analytics machine learning algorithm to identify anomalies using the series_decompose_anomalies() function

To get more accurate results, exclude the last day of June 15 with major outlier from the learning (training) process.

For that replace series_decompose_anomalies(ActualCount) in the query with the following:

series_decompose_anomalies(ActualCount,1.5,-1,'avg',1) // 1.5 is the threshold (anomalyscore threshold) [default], -1 is Autodetect seasonality [default], avg -  Define trend component as average of the series [default], 1 – number of points  at the end of the series to exclude from the learning process [default]


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

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
