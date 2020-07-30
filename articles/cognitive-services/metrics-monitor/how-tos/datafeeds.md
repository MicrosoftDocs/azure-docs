---
title: how to add datafeeds to Metrics Monitor
titleSuffix: Azure Cognitive Services
description: add Datafeeds to Metrics Monitor
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-monitoring
ms.topic: conceptual
ms.date: 07/13/2020
ms.author: aahi
---

# How to: add data feeds to Metrics Monitor

Learn how to create data feeds in Metrics Monitor to pull your time series data from different types of data sources. This document starts with key concepts to help you understand the procedures and the common data schema requirements for time series data. Then we demonstrate the general steps to connect a data source with detailed explanations of the desired parameters. 

[!INCLUDE [data schema requirements](../includes/data-schema-requirements.md)]

## Avoid loading partial data

Partial data is caused by inconsistencies between the data stored in Metrics Monitor and the data source. This can happen when the data source is updated after Metrics Monitor has finished pulling data.

For example, you have a Daily Active Users (DAU) metric from three different markets: A, B, and C, which are dimensions in Metrics monitor.
When Metrics monitor tries to pull the metric for 2019-11-04, if only DAU from market A is ready, Project "Gualala" will only retrieve the DAU metric of market A.
After that, data from markets B and C is generated and stored to the data source with the same date 2019-11-04. Yet Project "Gualala" won't pull those updates any more.
Moreover, if DAU for 2019-11-04 from market A is updated after that ingestion, the update won't take effect in Project "Gualala".

You can try to backfill historical data to mitigate inconsistencies but it won't trigger new anomaly alerts for time points with alerts that have already been triggered. It also adds additional workload to the system, and the process is not automatic.

To gracefully avoid that situation, there're two recommended approaches.

Generate data in one transaction:

* Ensure the metric values for all dimension combinations at the same timestamp are stored to the data source in one transaction. In the above example, wait until data from all markets A, B, and C are ready and then store into the data store in one transaction.
* It's not an issue if this means delay in data preparation. If ADv2 gets nothing at certain time point, it will keep retrying to pull the data for a sufficient long period until the data is successfully (or partially) retrieved.

Set Ingestion Time Offset properly:

* Set the **Ingestion time offset** parameter for your data feed to delay the ingestion so that the data is always fully prepared. This can be useful for some data sources which don't support transactions such as Azure Table Storage. Please refer to the step 7 [Advanced settings](#step-7-advanced-settings) for details of this parameter.

###  Backfill your datafeed

Select the  **Backfill** button to trigger an immediate ingestion on a time-stamp, to fix a failed ingestion or override the existing data.
- The start time is inclusive.
- The end time is exclusive.
- Anomaly detection is re-triggered on selected range only.

![Backfill Datafeed](img/backfill-datafeed.png)

## Add a data feed using the web Portal

After signing into your Metrics Monitor portal with your Active Directory account, click **Get started**. Then, on the main page of the portal, click **Add data feed** from the left menu.

![product portal landing page](../../media/adv2landingpage.png "product portal landing page")

### Add connection settings

Next you'll input a set of parameters to connect your time-series data source. Please refer to the [cheat sheet](#cheat-sheet-data-feed-creation-parameters) for details of all those parameters. Start with the following parameters.

* **Source Type**: The type of data source where your time series data is stored.
* **Granularity**: The interval between consecutive data points in your time series data. Currently we support these options: Yearly, Monthly, Weekly, Daily, Hourly, and Customize. The customization option supports the lowest interval of 60 seconds.
  * **Seconds**: The number of seconds when granularityName is set as "Customize".
* **Ingest data since (UTC)**: The baseline start time for data ingestion while startOffsetInSeconds is often used to add an offset to help with data consistency.

Next, you'll need to specify the connection information of the data source as well as the custom queries which are used to convert the data into [desired schema](#data-schema-requirements). There're other unique fields than those two for some data source types. For details, please refer to [Add data feeds from different data sources](add-data-feeds-from-different-data-sources.md).

### Verify the connection and load the data schema

After the connection string and query string are set, select **Verify and get schema** to verify the connection and run the query to get your data schema from the data source. Normally it takes a few seconds depending on your data source connection. If there's an error at this step, confirm that:

1. Your connection string and query are correct.
2. Your Metrics Monitor instance is able to connect to the data source if there are firewall settings.

### Schema configuration

Once the data schema is loaded and shown like below, select the appropriate fields.


|Selection  |Description  |Notes  |
|---------|---------|---------|
| **Display Name** | Name to be displayed on the portal instead of original column name. | |
|**Timestamp**     | The timestamp of a data point. If omitted, Metrics Monitor will use the timestamp when the data point is ingested instead. For each data feed, you could specify at most one column as timestamp.        | Optional. Should be specified with at most one column.       |
|**Measure**     |  The numeric values in the data feed. For each data feed, you could specify multiple measures but at least one column should be selected as measure.        | Should be specified with at least one column.        |
|**Dimension**     | Categorical values. A combination of different values identifies a particular single-dimension time series, for example: country, language, tenant. You could select none or arbitrary number of columns as dimensions. Note: if you're selecting a non-string column as dimension, be cautious with dimension explosion. | Optional.        |
|**Ignore**     | Ignore the selected column.        | Optional. See the below text.       |

If you want to ignore columns, the recommended approach is to update your query or even data source to exclude those columns. However, if that is not applicable or not trivial, and you still want to ignore some columns due to irrelevance or duplication, please first select the option "Ignore columns" and then select "Ignore" for those columns. If a column should be a dimension and is mistakenly set as "Ignored", Metrics Monitor may end up ingesting partial data, for example, assume the data from your query is as below:

Row ID | Timestamp | Country | Language | Income
--- | --- | --- | --- | ---
1 | 2019/11/10 | China | ZH-CN | 10000
2 | 2019/11/10 | China | EN-US | 1000
3 | 2019/11/10 | US | EN-US | 12000
4 | 2019/11/11 | US | EN-US | 23000
... | ...

If "Country" is a dimension and "Language" is set as "Ignored", then row 1 and row 2 have the same dimensions. Metrics Monitor will randomly pick up one from the two rows. Note that Project "Gualala" will not aggregate row 1 and row 2 in such cases. This is different from the roll-up in the next step.

![Schema configuration](../media/configureschema.png "Schema configuration")

### Specify a name for onboarded data feed
 
Give a custom name for the data feed, which will be displayed on the portal. Click on **Submit**. 

## Automatic roll up settings

> [!IMPORTANT]
> Once enabled, the auto roll-up settings cannot be changed

Metrics Monitor can automatically generate the data cube (sum) during ingestion, which helps users better perform hierarchical analysis. There are three possibilities, depending on your scenario:

1. *My data has already rolled up and the dimension value is represented by NULL or Empty (Default), NULL only, Others.*

    This option means Metrics monitor doesn't need to roll up the data because there're already summed rows. For example, if you select "NULL only", then the second data row in the below example will be seen as an aggregation of all countries and language "EN-US"; the fourth data row which has an empty value for "Country" however will be seen as an ordinary row which might indicate data not complete.
    
    Row ID | Country | Language | Income
    --- | --- | --- | ---
    1 | China | ZH-CN | 10000
    2 | (NULL) | EN-US | 999999
    3 | US | EN-US | 12000
    4 |  | EN-US | 5000
    ... | ...
    
2. *I need Metrics Monitor to roll up my data by calculating Sum/Max/Min/Avg/Count and represent it by <some string>*

    Some data sources such as Cosmos DB or Azure Blob Storage do not support certain calculations like "group by" or "cube". Metrics Monitor provides this option to solve this problem and automatically generates a data cube during ingestion.
    This option means you need Metrics Monitor to calculate the roll-up using the algorithm you've selected and use the specified string to represent the roll-up in Metrics Monitor. Note that this won't change any data in your data source.
    For example, if you have a set of time series which stands for "Sales" metrics with dimensions(Country, Region). For a given timestamp, it might look like the following:
    
    | Country       | Region           | Sales |
    | :------------ | :--------------- | :---- |
    | Canada        | Alberta          | 100   |
    | Canada        | British Columbia | 500   |
    | United States | Montana          | 100   |
    
    After enabling "Auto Roll Up" with "Sum", Metrics Monitor calculates all the dimension combinations and sums over metrics during data ingestion. Therefore generating the following result:
    
    | Country       | Region           | Sales |
    | :------------ | :--------------- | :---- |
    | Canada        | Alberta          | 100   |
    | NULL          | Alberta          | 100   |
    | Canada        | British Columbia | 500   |
    | NULL          | British Columbia | 500   |
    | United States | Montana          | 100   |
    | NULL          | Montana          | 100   |
    | NULL          | NULL             | 700   |
    | Canada        | NULL             | 600   |
    | United States | NULL             | 100   |
    
    `(Country=Canada, Region=NULL, Sales=600)` means the sum of Sales in Canada (all Regions) is 600.
    
    The following is the whole transformation in SQL language.
    
    ```mssql
    SELECT
        dimension_1,
        dimension_2,
        ...
        dimension_n,
        sum (metrics_1) AS metrics_1,
        sum (metrics_2) AS metrics_2,
        ...
        sum (metrics_n) AS metrics_n
    FROM
        each_timestamp_data
    GROUP BY
        CUBE (dimension_1, dimension_2, ..., dimension_n);
    ```
    
    The following are some things to consider before using the Auto roll up feature:
    
    * If you want to use **SUM** to aggregate your data, make sure your metrics are additive in each dimension. Here are some examples of **non-additive** metrics:
      * Fraction-based metrics. This includes ratio, percentage, and so on. For example, you should not add the unemployment rate of each state to calculate the unemployment rate of the entire country.
      * Overlap in dimension. For example, you should not add the number of people in to each sport to calculate the number of people who like sports, because there is an overlap between them, one person can like multiple sports.
    * To ensure the health of the whole system, the size of cube is limited. Currently, the limit is 1,000,000. If your data exceeds that limit, ingestion will fail for that timestamp.

3. *I do not need to include the roll-up analysis for my data.*

    This option means you choose to not do any roll-up.

## "Data feed is not available" alert settings

A data feed is considered not available if no data is ingested from the source within the grace period specified from the time the data feed starts ingestion. An alert is triggered in this case.

Currently, we only support Web Hook for alerting when a data feed is not available. Please refer to [Create hooks](create-hooks.md) for details of creating a hook.

## Advanced settings

There are several advanced settings when creating a new data feed. Most of them can be modified later in data feed detail page.

* **Grace period**: A data feed is considered as not available if no data is ingested from the source within the grace period specified from the time the data feed starts ingestion. An "Data feed is not available" alert is triggered in this case.
For example, if the timestamp = 2018-12-01, Project "Gualala" starts to pull the data which is at daily granularity from 2018-12-02, this means timestamp 2018-12-01 has already passed [TBD]. If the pull fails, Project "Gualala" keeps retrying in an interval decided by granularity. If it keeps failing for the Grace period, Project "Gualala" fires a "Data feed is not available" alert to the hooks set.

* **Snooze alerts in**: [TBD: What does this mean?]  When this option is set to zero, each timestamp with 'Not Available' triggers an alert. When a setting other than zero is specified, continuous timestamps after the first timestamp with 'not available' are NOT triggered according to the the setting specified.

* **Ingestion time offset**: [TBD: What about less than 1 hour offset?] By default, data with timestamp T is ingested at the time of T + Granularity. For example, the ingestion start time for data marked as Monday would be Tuesday UTC 0 am. By setting a positive number X (>0), ingestion of data is delayed X hours accordingly. A negative number (< 0) is also allowed which will advance the ingestion.

* **Max ingestion per minute**: Set this parameter if data source supports limited concurrency. Otherwise leave as default setting.

* **Stop retry after**: If data ingestion has failed, it will retry automatically within a period. The beginning of the period is the time when the first data ingestion happened. The length of the period is defined according to the granularity. If leaving the default value (-1), the value will be determined according to the granularity as below.
    
    | Granularity       | Stop Retry After           |
    | :------------ | :--------------- |
    | Daily, Custom (>= 1 Day), Weekly, Monthly, Yearly     | 7 days          |
    | Hourly, Custom (< 1 Day)       | 72 hours |

* **Min retry interval**: You can specify the minimum interval when retrying pulling data from source. If leaving the default value (-1), the retry interval will be determined according to the granularity as below.
    
    | Granularity       | Minimum Retry Interval           |
    | :------------ | :--------------- |
    | Daily, Custom (>= 1 Day), Weekly, Monthly     | 30 minutes          |
    | Hourly, Custom (< 1 Day)      | 10 minutes |
    | Yearly | 1 day          |
    
* **Fill gap when detecting**: Some time series are not continuous. When there're missing data points, Project "Gualala" will use the specified value to fill them before anomaly detection for better accuracy.
The options are using value from the previous actual data point (default) and using a specific value (useful for metrics such as error rate or availability which should be 0 or 100 respectively in normal cases).

> [!NOTE]
> This setting won't affect your data source and will not affect the data charts displayed on the portal. The auto-filling only occurs during anomaly detection.

## Edit a datafeed

Only the administrator of a datafeed is allowed to make changes to it. To pause or reactivate the datafeed

1. On the datafeed list page, click the operation you want to perform on the datafeed.

2. On the datafeed details page, click the **Status** switch button.

To delete a datafeed: 

1. On the datafeed list page, click **Delete** on the datafeed.

2. In the datafeed details page, click **Delete**.

When changing 'StartTime', you need to verify the schema again. You can change it by using 'Edit parameters'

## Data feed creation parameters

Parameter ID (API) | Parameter Name (Portal) | Data Type | Required | Description
--- | --- | --- | --- |---
dataSourceType | Source Type | String | YES | The type of data source where your time series data is stored.
granularityName | Granularity | String | YES | The interval between consecutive data points in your time series data. Currently we support these options: Yearly, Monthly, Weekly, Daily, Hourly, and Customize. The customization option supports the lowest interval of 60 seconds.
granularityAmount | Seconds | Integer | [TBD] | The number of seconds when granularityName is set as "Customize".
dataStartFrom | Start Time (UTC) | Datetime | YES | The baseline start time for data ingestion while startOffsetInSeconds is often used to add an offset to help with data consistency.
startOffsetInSeconds | Ingestion time offset | Integer | [TBD] | By default, data with timestamp T is ingested at the time of T + Granularity. For example, the ingestion start time for data marked as Monday would be Tuesday UTC 0 am. By setting a positive number (>0), ingestion of data is delayed accordingly. A negative number (<0) is also allowed.
maxQueryPerMinute |  Max ingestion per minute | Integer | [TBD] | Set this parameter if data source supports limited concurrency. Otherwise leave as default setting.
stopRetryAfterInSeconds |  Grace period | Integer | NO | [TBD]
fillMissingPointForAdValue | Fill gap when detecting | Enum: "PreviousValue", "SpecificValue" | YES | Specify gap filling value before anomaly detection which will be used to fill missing points during anomaly inference. Note that it will not really fill the value in your data.
fillMissingPointForAdValue | Fill specific value: | Integer | [TBD] | The value to fill for gaps.
datafeedName| Data feed Name | String | YES | The custom name of the data feed.

## Next steps

* Learn the unique settings and requirements for time series stored in different type of data sources from [Adding Project "Gualala" data feeds from different data sources](add-data-feeds-from-different-data-sources.md)