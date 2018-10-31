---
title: 'Azure Data Explorer time series analysis'
description: 'Learn about time series analysis in Azure Data Explorer'
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 10/30/2018
---

# Time Series Analysis in Azure Data Explorer

Azure Data Explorer performs on-going collection of telemetry data from cloud services or IoT devices. This data can then be analyzed for various insights such as monitoring service health, physical production processes, and usage trends. The analysis can be performed on time series of selected metrics to find a deviation in the pattern of the metric relative to its typical baseline pattern.
ADX contains native support for creation, manipulation, and analysis of time series. 
In this topic you will learn to use ADX to create and analyze **thousands of time series in seconds**, enabling near real time monitoring solutions and workflows.

## Time Series Creation

In this section we will create a large set of regular time series simply and intuitively using the `make-series` operator, and fill missing values.
The first step in time series analysis is to partition and transform the original telemetry table to a set of time series. The table usually contains a timestamp column, contextual dimensions, and optional metrics. The dimensions are used to partition the data. The goal is to create thousands of time series per partition at regular time intervals.

The input table *demo_make_series1* contains 600K records of arbitrary web service traffic. Use the command below to sample 10 records:

```kusto
demo_make_series1 | take 10 
```

The resulting table contains a timestamp column, 3 contextual dimensions columns, and no metrics:

|   |   |   |   |   |
| --- | --- | --- | --- | --- |
|   | TimeStamp | BrowserVer | OsVer | Country |
|   | 2016-08-25 09:12:35.4020000 | Chrome 51.0 | Windows 7 | United Kingdom |
|   | 2016-08-25 09:12:41.1120000 | Chrome 52.0 | Windows 10 |   |
|   | 2016-08-25 09:12:46.2300000 | Chrome 52.0 | Windows 7 | United Kingdom |
|   | 2016-08-25 09:12:46.5100000 | Chrome 52.0 | Windows 10 | United Kingdom |
|   | 2016-08-25 09:12:46.5570000 | Chrome 52.0 | Windows 10 | Republic of Lithuania |
|   | 2016-08-25 09:12:47.0470000 | Chrome 52.0 | Windows 8.1 | India |
|   | 2016-08-25 09:12:51.3600000 | Chrome 52.0 | Windows 10 | United Kingdom |
|   | 2016-08-25 09:12:51.6930000 | Chrome 52.0 | Windows 7 | Netherlands |
|   | 2016-08-25 09:12:56.4240000 | Chrome 52.0 | Windows 10 | United Kingdom |
|   | 2016-08-25 09:13:08.7230000 | Chrome 52.0 | Windows 10 | India |

Since there are no metrics, we can only build a set of time series representing the traffic count itself, partitioned by OS using the following query:

```kusto
let min_t = toscalar(demo_make_series1 | summarize min(TimeStamp));
let max_t = toscalar(demo_make_series1 | summarize max(TimeStamp));
demo_make_series1
| make-series num=count() default=0 on TimeStamp in range(min_t, max_t, 1h) by OsVer
| render timechart 
```

Use the `[make-series](https://docs.microsoft.com/en-us/azure/kusto/query/make-seriesoperator)` operator to create a set of 3 time series, where:

- `num=count()`: time series of traffic
- `range(min_t, max_t, 1h)`: time series is created in 1 hour bins in the time range (oldest and newest timestamps of table records)
- `default=0`: specify fill method for missing bins to create regular time series. Alternatively use `[series_fill_const](https://docs.microsoft.com/en-us/azure/kusto/query/series-fill-constfunction)(), or [series_fill_forward](https://docs.microsoft.com/en-us/azure/kusto/query/series-fill-forwardfunction)(), [series_fill_backward](https://docs.microsoft.com/en-us/azure/kusto/query/series-fill-backwardfunction)() and [series_fill_linear](https://docs.microsoft.com/en-us/azure/kusto/query/series-fill-linearfunction)()` for changes
- `byOsVer`:  partition by OS

In the table we have 3 partitions. We create a separate time series: Windows 10 (red), 7 (blue) and 8.1 (green) for each OS version as seen in the graph:

![Time series partition](media/time-series-analysis/time-series-partition.png)

The actual time series data structure is a numeric array of the aggregated value per each time bin. We use `render timechart` for visualization.

## Time Series Analysis Functions

In this section we will perform typical series processing functions.
Once a set of time series is created, ADX supports a growing list of functions to process and analyze them. In this section we will review a representative function from each category. The complete set of functions can be found in the [time series section](https://docs.microsoft.com/en-us/azure/kusto/query/machine-learning-and-tsa) in the documentation. We describe few representative functions for processing and analyzing time series.

### Filtering

Filtering is a common practice in signal processing and very useful for various time series processing tasks (e.g. smooth a noisy signal, change detection).
There are 2 generic filtering functions:

- `[series_fir()](https://docs.microsoft.com/en-us/azure/kusto/query/series-firfunction)`: Applying FIR filter. Used for filtering such as simple calculation of moving average and differentiation of the time series (for change detection).
- `[series_iir()](https://docs.microsoft.com/en-us/azure/kusto/query/series-iirfunction)`: Applying IIR filter. Used for filtering such as exponential smoothing and cumulative sum.

`Extend` the time series set by adding a new moving average series of size 5 bins (named *ma_num*):

```kusto
let min_t = toscalar(demo_make_series1 | summarize min(TimeStamp));
let max_t = toscalar(demo_make_series1 | summarize max(TimeStamp));
demo_make_series1
| make-series num=count() default=0 on TimeStamp in range(min_t, max_t, 1h) by OsVer
| extend ma_num=series_fir(num, repeat(1, 5), true, true)
| render timechart
```

![Time series filtering](media/time-series-analysis/time-series-filtering.png)

### Regression Analysis

ADX supports segmented linear regression analysis to estimate the trend of the time series.

- Fitting the best line to a time series can be done using [series_fit_line()](https://docs.microsoft.com/en-us/azure/kusto/query/series-fit-linefunction) that is useful for general trend detection;
- To detect trend changes (relative to the baseline), useful in monitoring scenarios, use [series_fit_2lines()](https://docs.microsoft.com/en-us/azure/kusto/query/series-fit-2linesfunction).

Example of `series_fit_line()` and  `series_fit_line()` functions on a time series:

```kusto
demo_series2
| extend series_fit_2lines(y), series_fit_line(y)
| render linechart
```

![Time series regression](media/time-series-analysis/time-series-regression.png)

- Blue line is the original time series
- Green line is the fitted line
- Red line is the 2 fitted lines

> [!NOTE]
> The function accurately detected the jump (level change) point.

### Seasonality Detection

Many metrics follow seasonal (periodic) patterns. For example, user traffic of cloud services usually contain daily and weekly patterns (highest around the middle of business days, lowest at nights or over the weekends), IoT sensors measure in periodic intervals, and physical measurements like temperature, pressure or humidity may also show seasonal behavior.

The following example applies seasonality detection on one month traffic of a web service (2 hour bins):

```kusto
demo_series3
| render timechart 
```

![Time series seasonality](media/time-series-analysis/time-series-seasonality.png)

The function [series_periods_detect()](https://docs.microsoft.com/en-us/azure/kusto/query/series-periods-detectfunction) automatically detects the periods in time series. If we know that a metric should have specific distinct period(s), we can use [series_periods_validate()](https://docs.microsoft.com/en-us/azure/kusto/query/series-periods-validatefunction) to verify that they exist.

> [!NOTE]
> It's an anomaly if specific distinct periods don't exist

```kusto
demo_series3
| project (periods, scores) = series_periods_detect(num, 0., 14d/2h, 2) //to detect the periods in the time series
| mvexpand periods, scores
| extend days=2h*todouble(periods)/1d
```

|   |   |   |   |
| --- | --- | --- | --- |
|   | periods | scores | days |
|   | 84 | 0.820622786055595 | 7 |
|   | 12 | 0.764601405803502 | 1 |

The function detects daily and weekly seasonality. The daily scores less than the weekly because weekend days are different from weekdays.

### Element-wise functions

Arithmetic and logical operations can be performed on a time series. Using [series\_subtract()](https://docs.microsoft.com/en-us/azure/kusto/query/series-subtractfunction) we can calculate a residual time series (i.e. a time series of the difference between original raw metric and a smoothed one) and look for anomalies in the residual signal:

```kusto
let min_t = toscalar(demo_make_series1 | summarize min(TimeStamp));
let max_t = toscalar(demo_make_series1 | summarize max(TimeStamp));
demo_make_series1
| make-series num=count() default=0 on TimeStamp in range(min_t, max_t, 1h) by OsVer
| extend ma_num=series_fir(num, repeat(1, 5), true, true)
| extend residual_num=series_subtract(num, ma_num) //to calculate residual time series
| where OsVer == "Windows 10"   // filter on Win 10 to visualize a cleaner chart 
| render timechart
```

![Time series operations](media/time-series-analysis/time-series-operations.png)

The blue chart is the original time series, the red is the smoothed one and the green is the residual.

## Time Series Workflows at Scale

The example below shows how these functions can run at scale on thousands of time series in seconds for anomaly detection. Suppose you want to see a few sample telemetry records of read count metric of a DB service for 4 days.

```kusto
demo_many_series1
| take 4 
```

|   |   |   |   |   |   |
| --- | --- | --- | --- | --- | --- |
|   | TIMESTAMP | Loc | anonOp | DB | DataRead |
|   | 2016-09-11 21:00:00.0000000 | Loc 9 | 5117853934049630089 | 262 | 0 |
|   | 2016-09-11 21:00:00.0000000 | Loc 9 | 5117853934049630089 | 241 | 0 |
|   | 2016-09-11 21:00:00.0000000 | Loc 9 | -865998331941149874 | 262 | 279862 |
|   | 2016-09-11 21:00:00.0000000 | Loc 9 | 371921734563783410 | 255 | 0 |

And simple statistics:

```kusto
demo_many_series1
| summarize num=count(), min_t=min(TIMESTAMP), max_t=max(TIMESTAMP) 
```

|   |   |   |   |
| --- | --- | --- | --- |
|   | num | min\_t | max\_t |
|   | 2177472 | 2016-09-08 00:00:00.0000000 | 2016-09-11 23:00:00.0000000 |

Building a time series in 1-hour bins of the read metric (total 4 days \* 24 hours = 96 points), results in normal pattern fluctuation:

```kusto
let min_t = toscalar(demo_many_series1 | summarize min(TIMESTAMP));  
let max_t = toscalar(demo_many_series1 | summarize max(TIMESTAMP));  
demo_many_series1
| make-series reads=avg(DataRead) on TIMESTAMP in range(min_t, max_t, 1h)
| render timechart 
```

![Time series at scale](media/time-series-analysis/time-series-at-scale.png)

The above behavior is misleading, since the single normal time series is aggregated from thousands of different instances that may have abnormal patterns. Therefore, we create a time series per instance. In our table an instance is defined by Loc (location), anonOp (operation) and DB (specific machine).

How many time series can we create?

```kusto
demo_many_series1
| summarize by Loc, anonOp, DB
| count
```

|   |   |
| --- | --- |
|   | Count |
|   | 23115 |

Now, we are going to create a set of 23115 time series of the read count metric. We append the `by` clause to the make-series statement, apply linear regression, and select the top 2 time series that had the largest decreasing trend:

```kusto
let min_t = toscalar(demo_many_series1 | summarize min(TIMESTAMP));  
let max_t = toscalar(demo_many_series1 | summarize max(TIMESTAMP));  
demo_many_series1
| make-series reads=avg(DataRead) on TIMESTAMP in range(min_t, max_t, 1h) by Loc, anonOp, DB
| extend (rsquare, slope) = series_fit_line(reads)
| top 2 by slope asc 
| render timechart with(title='Service Traffic Outage for 2 instances (out of 23115)')
```

![Time series top two](media/time-series-analysis/time-series-top-2.png)

Display the instances:

```kusto
let min_t = toscalar(demo_many_series1 | summarize min(TIMESTAMP));  
let max_t = toscalar(demo_many_series1 | summarize max(TIMESTAMP));  
demo_many_series1
| make-series reads=avg(DataRead) on TIMESTAMP in range(min_t, max_t, 1h) by Loc, anonOp, DB
| extend (rsquare, slope) = series_fit_line(reads)
| top 2 by slope asc
| project Loc, anonOp, DB, slope 
```

|   |   |   |   |   |
| --- | --- | --- | --- | --- |
|   | Loc | anonOp | DB | slope |
|   | Loc 15 | -3207352159611332166 | 1151 | -102743.910227889 |
|   | Loc 13 | -3207352159611332166 | 1249 | -86303.2334644601 |

In less than 2 seconds ADX detected 2 abnormal time series (out of 23115) in which the read count suddenly dropped.