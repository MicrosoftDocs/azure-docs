---
title: Detect and analyze anomalies with KQL in Azure Monitor
description: Learn how to use KQL machine learning tools for time series analysis and anomaly detection in Azure Monitor Log Analytics. 
ms.service: azure-monitor
ms.topic: tutorial 
author: guywild
ms.author: guywild
ms.reviewer: ilanawaitser
ms.date: 07/26/2023
# Customer intent: As a data analyst, I want to use the native machine learning capabilities of Azure Monitor Logs to gain insights from my log data without having to export data outside of Azure Monitor.
---

# Tutorial: Detect and analyze anomalies using KQL machine learning capabilities in Azure Monitor

The Kusto Query Language (KQL) includes machine learning operators, functions and plugins for time series analysis, anomaly detection, forecasting, and root cause analysis. Use these KQL capabilities to perform advanced data analysis in Azure Monitor without the overhead of exporting data to external machine learning tools.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a time series 
> * Identify anomalies in a time series 
> * Tweak anomaly detection settings to refine results
> * Analyze the root cause of anomalies

> [!NOTE]
> This tutorial provides links to a Log Analytics demo environment in which you can run the KQL query examples. However, you can implement the same KQL queries and principals in all [Azure Monitor tools that use KQL](log-query-overview.md). 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A workspace with log data.

[!INCLUDE [log-analytics-query-permissions](../../../includes/log-analytics-query-permissions.md)]

## Create a time series 

Use the KQL `make-series` operator to create a time series. 

Let's create a time series based on logs in the [Usage table](/azure/azure-monitor/reference/tables/usage), which holds information about how much data each table in a workspace ingests every hour, including billable and non-billable data.

This query uses `make-series` to chart the total amount of billable data ingested by each table in the workspace every day, over the past 21 days:

<a href="https://portal.azure.com#@ec7cb332-9a0a-4569-835a-ce7658e8444e/blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade/resourceId/%2FDemo/source/LogsBlade.AnalyticsShareLinkToQuery/q/H4sIAAAAAAAAA6VSu04DMRDs8xWrVHdSyKsEpQggQQoKUPiAvfNecorPF%252By1IiMKfoPf40tYO5cEBaWiHY9nd2ZWE4NjtMx1QzCD6UTdwGgEyzXtcVDIBG0FLEgiObI1uQGUrTdcmxUUWG6gsm2TOKW3lsz%252BX0%252BLPBnViY9P2gL%252BXzl%252Bqiwm7W7vx3YnkkwGuAWHzVZT5GPv1eGKDtMZC8F39P35ZQnQoA7vMq%252F3Abs1CbIU4QcyZGWSgoJ4R6KYpUDaSmHIcNVmx9zyfDg8e%252BtM53meZkZ3Fo1sULU2mXnzZMNAtFe1MdErMkym1%252BMxzJ8OoVS1ddFukBVVjOwCT2NHq80pzDTu6Gjhbmutk%252B3ZDPpsPfXjZgtTaq%252BkBqMDFAdKTOwgZsl5LUdCLGINbuhqXxPMS%252FaoU64z55vs2aO0xiEHRRXGP9K4CJ%252Blmeq8nGTq7UKW8kDbX60XAe5l02XYpmbvLMkE9%252FeedO1Sj2FvjCNfzMgxKbKJWq7jqYvGS8Jc59rFEPDE%252BAERMgnLLgMAAA%253D%253D" target="_blank">Click to run query</a>

```kusto
let starttime = 21d; // The start date of the time series, counting back from the current date
let endtime = 0d; // The end date of the time series, counting back from the current date
let timeframe = 1d; // How often to sample data
Usage // The table we’re analyzing
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Time range for the query, beginning at 12:00 AM of the first day and ending at 12:00 AM of the last day in the time range
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

<a href="https://portal.azure.com#@ec7cb332-9a0a-4569-835a-ce7658e8444e/blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade/resourceId/%2FDemo/source/LogsBlade.AnalyticsShareLinkToQuery/q/H4sIAAAAAAAAA61Uu3LUQBDM%252FRWDI6lKfoZQFxjsAgcEYBO75rQj3eLVrtiH70QR8Bv8Hl%252FC7Ejn09mYiExa9fRMd8%252FKUIQQ0ceoO4IFnJ%252BpN3ByAjf5DBRGgsZ5iCsCQQTymkIFtUs2atvCEut7aLzrBFMn78mOhQeGucmqifl0JL6y6j%252FQ5qLGoxBPE39wa3BNJAvRQcCuN5TxePAlYEsZcZu74ZLP1%252FT75y9PgBbN8J37HfyA9Yr45JaJ35Mlz50ULCmuiRkLscg1CocCW1c8OlaWx8dPvk2Ky7KUnlmdR9vuBH9L5IeKuVttbdaKEc7OX5%252BewsVHViCYRvuQ5Q48osomvoAzOMG03Zkp7R4VXYe32hiRvVjAYfSJDvNk17Y2SVEAZ80Ayy0mW7Zl8xSS4f2gyGwd3tPRmBNc1DGhEWMXIXXFp4QcWxxKUNRgruG8mfiJnZLny1ZKcC%252BYyR%252Bon8W%252BHOCSJ70deon2nSfuEJ4vlNFBghxGYZHxrIU2vCequLCuQyO48XG4qZ2nCq42PdVcJwpLFjPS3SmqXde7QHe4LS1mXkjiQhHG3DbRYx3zy4TmvQ48jhv9dSn2KeYs5%252BZmrx%252BOaNNnihl7tifP75pCucRZldUTf2cAfhfjtsoy8fP6ueq%252F0e%252F5MAMYZ1sReyVTjr6j97yItSQhjv%252FDtPJxPXfjvco7k0k%252FU0zesmvGANfpqB9I%252FLTUorwoetD85BgkO0XTnJDyoMzde%252FeVT%252Fb9qWZmVnvS9oyodmsxX7FLarTlMdcrXa%252F4R2VSZ8VTL%252BPm2ILjfyYLx2Uo5oz5WoRaloMRYbpXQaAjDIJEwPcuI6f77rxiB237B35S8SykBQAA" target="_blank">Click to run query</a>

```kusto
let starttime = 21d; // Start date for the time series, counting back from the current date
let endtime = 0d; // End date for the time series, counting back from the current date
let timeframe = 1d; // How often to sample data
Usage // The table we’re analyzing
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Time range for the query, beginning at 12:00 AM of the first day and ending at 12:00 AM of the last day in the time range
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

It's good practice to review initial query results and make tweaks to the query, if necessary. Outliers in input data can affect the function's learning, and you might need to adjust the function's anomaly detection settings to get more accurate results.

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

<a href="https://portal.azure.com#@ec7cb332-9a0a-4569-835a-ce7658e8444e/blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade/resourceId/%2FDemo/source/LogsBlade.AnalyticsShareLinkToQuery/q/H4sIAAAAAAAAA61Uy27UQBC85yuaXGJLzmMjcQHtISgR5IAiIJyjXk%252FbazKeMfPYXSMO%252FAa%252Fx5fQ0%252FbuegPhxM0eV1dXV%252FVYUwAf0IXQtARzuJyp13B%252BDp%252FSGSgMBJV1EJYEgvDkGvIFlDaa0JgaFlg%252BQuVsK5gyOkdmKDzSzE1GjcwXA%252FGNUf%252BBNhVVDoV4VPzOrsFWgQwECx7bTlPC49FnjzUlxH3qhgs%252BX9OvHz8dARrU%252FTfud%252FQd1kvik3smfkuGHHdSsKCwJmbMxCJbKewzrG22cyzPz86efBsnzvNceqbpHJp6P%252FDXSK4vmLtujEmzYoDZ5auLC7h6zxMIpmqcT%252BP2LFElE5%252FBaRxhjdmbKe12E936N43WMvZ8DsfBRTpOym5NqaMiD9boHhZbTLJsy%252BbIR837QYHZWnyk0yEnuCpDRC3Gzn1ssw8RObbQ56CowlTDeTPxEzslz%252BetlOCeMZM%252FUDeJfdHDNSu977sh2rvrO9ZIG85fZVfGtqhloYbH%252FlNpHRVws%252BmoZCWiPGeRwzwPikrbdtbTA25Ls8mMxezsZXE6K05wVZ8UMwlWGP0QzyY4LEN6GYt5fT3PawcbbQxdDCmyiYcFl6UAUrC7JFeoI23dH71O1q9OadOlVhNRya3A49sqUzZydHnxxO4JgN%252FFx60hifjP%252BqlZf6M%252FsG8C0NbUYsqNqPQiH53jvSwdDTep%252F5fX%252BW5b9%252FJepBVKpB8pRGfYXa2B65rQrEh8N1SjvChaNfxkGSQrRqNOiEkoc3fOfuGTQ3%252BKacIHox0YUey3abpx11Q1hmWul0255P%252BWjq0RT53ITbF5y79QHhwXPpsyplviS1kiRvjxmnmBDjDwEgEvQkKO1986xQ6a%252BjfngHTtswUAAA%253D%253D" target="_blank">Click to run query</a>

```kusto
let starttime = 21d; // Start date for the time series, counting back from the current date
let endtime = 0d; // End date for the time series, counting back from the current date
let timeframe = 1d; // How often to sample data
Usage // The table we’re analyzing
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Time range for the query, beginning at 12:00 AM of the first day and ending at 12:00 AM of the last day in the time range
| where IsBillable == "true" // Includes only billable data in the result set
| make-series ActualUsage=sum(Quantity) default = 0 on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe by DataType // Creates the time series, listed by data type
| extend(Anomalies, AnomalyScore, ExpectedUsage) = series_decompose_anomalies(ActualUsage,1.5,-1,'avg',1) // Scores and extracts anomalies based on the output of make-series, excluding the last value in the series - the Threshold, Seasonality, and Trend input values are the default values for the function 
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

<a href="https://portal.azure.com#@ec7cb332-9a0a-4569-835a-ce7658e8444e/blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade/resourceId/%2FDemo/source/LogsBlade.AnalyticsShareLinkToQuery/q/H4sIAAAAAAAAA61SwY7UMAw9M19hzWVbqbvLckVzGDGIIxJwX3kTtw2bJiVxKEUc%252BAf%252BkC%252FBaTu77SBu9JLGdp793rMlhsgYmE1HcIBXd%252Fo13N7CxxwDjUxQ%252BwDcEkwVkYKhWIHyybFxDTygeoQ6%252BG6qUSkEcvPDnRVscnpBfjkDv3X6P8Ci8x3a8ZSBDlM4w9yj1sWVxvGqur6roMNHuj%252FniomlryVbYOOLZbBSvhVhXwvYmI%252Fcduky4VcwtEa1YOKUshgZ6mTtVG%252FcM5WArqEc8SkAfcOutwTF6BModBCot6iktBWgwXALCLEnZWqjoMWgr5XXpDety93xewp0Mtg4H9mo%252BGL3Q6BZOMBxo4Sp6zXRTzLQO3IUJKtLOBzWwlWwXz3ey%252FW9kAj5Evdl1uSodZSprUo2A4g7NnUuRyxtOp%252FFib01PAsUKCYruyVmGcceePCZDOZIhN8%252Ff20mR2Hy3F3YDfJPsJkfHogHIgeXVj7tb1ne3PzT5kzoRLVxFC%252FNOq%252Fil0RhlOZ98J9J8ZbhB4riqFi3wplZz7IIqhfWnILL7nxFmzIzLZb0yEzBxWIDuJb7wotp2De%252B61FkhBRRhvTur52cF2hWuxGPwlK69PsDddtehdwDAAA%253D" target="_blank">Click to run query</a>

```kusto
let starttime = 21d; // Start date for the time series, counting back from the current date
let endtime = 0d; // End date for the time series, counting back from the current date
let anomalyDate = datetime_add('day',-1, make_datetime(startofday(ago(endtime)))); // Start of day of the anomaly date, which is the last full day in the time range in our example (you can replace this with a specific hard-coded anomaly date)
AzureDiagnostics	
| extend AnomalyDate = iff(startofday(TimeGenerated) == anomalyDate, "AnomalyDate", "OtherDates") // Adds calculated column called AnomalyDate, which splits the result set into two data sets – AnomalyDate and OtherDates
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) // Defines the time range for the query
| project AnomalyDate, Resource // Defines which columns to return
| evaluate diffpatterns(AnomalyDate, "OtherDates", "AnomalyDate") // Compares usage on the anomaly date with the regular usage pattern
```

The query identifies each entry in the table as occurring on *AnomalyDate* (June 15) or *OtherDates*. The `diffpatterns()` plugin then splits these data sets - called A (*OtherDates* in our example) and B (*AnomalyDate* in our example) - and returns a few patterns that contribute to the differences in the two sets:

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/diffpatterns-kql-log-analytics.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/diffpatterns-kql-log-analytics.png" alt-text="A screenshot showing a table with three rows. Each row shows a difference between the usage on the anomalous use and the baseline usage."::: 

Looking at the query results, you can see the following differences:

- There are 24,892,147 instances of ingestion from the *CH1-GEARAMAAKS* resource on all other days in the query time range, and no ingestion of data from this resource on June 15. Data from the *CH1-GEARAMAAKS* resource accounts for 73.36% of the total ingestion on other days in the query time range and 0% of the total ingestion on June 15.
- There are 2,168,448 instances of ingestion from the *NSG-TESTSQLMI519* resource on all other days in the query time range, and 110,544 instances of ingestion from this resource on June 15. Data from the *NSG-TESTSQLMI519* resource accounts for 6.39% of the total ingestion on other days in the query time range and 25.61% of ingestion on June 15. 
 
Notice that, on average, there are 108,422 instances of ingestion from the *NSG-TESTSQLMI519* resource during the 20 days that make up the *other days* period (divide 2,168,448 by 20). Therefore, the ingestion from the *NSG-TESTSQLMI519* resource on June 15 isn't significantly different from the ingestion from this resource on other days. However, because there's no ingestion from *CH1-GEARAMAAKS* on June 15, the ingestion from *NSG-TESTSQLMI519* makes up a significantly greater percentage of the total ingestion on the anomaly date as compared to other days.

The *PercentDiffAB* column shows the absolute percentage point difference between A and B (|PercentA - PercentB|), which is the main measure of the difference between the two sets. By default, the `diffpatterns()` plugin returns difference of over 5% between the two data sets, but you can tweak this threshold. For example, to return only differences of 20% or more between the two data sets, you can set `| evaluate diffpatterns(AnomalyDate, "OtherDates", "AnomalyDate", "~", 0.20)` in the query above. The query now returns only one result:

:::image type="content" source="./media/machine-learning-azure-monitor-log-analytics/diffpatterns-kql-log-analytics-threshold.png" lightbox="./media/machine-learning-azure-monitor-log-analytics/diffpatterns-kql-log-analytics-threshold.png" alt-text="A screenshot showing a table with one row that presents a difference between the usage on the anomalous use and the baseline usage. This time, the query didn't return differences of less than 20 percent between the two data sets."::: 

> [!NOTE]
> For more information about `diffpatterns()` syntax and usage, see [diff patterns plugin](/azure/data-explorer/kusto/query/diffpatternsplugin).

## Next steps

Learn more about: 

- [Log queries in Azure Monitor](log-query-overview.md).
- [How to use Kusto queries](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor).
- [Analyze logs in Azure Monitor with KQL](/training/modules/analyze-logs-with-kql/)
