---
title: how to add datafeeds to Metrics Advisor
titleSuffix: Azure Cognitive Services
description: add Datafeeds to Metrics Advisor
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice:
ms.topic: conceptual
ms.date: 08/28/2020
ms.author: aahi
---

# How to: Manage the data feed

Learn how to create and manage data feeds in Metrics Advisor. This article guides you through managing data feeds in Metrics Monitor.

## Manage your data feed

After creating your data feed, use these features to manage and customize it.

## Automatic roll up settings

> [!IMPORTANT]
> Once enabled, the auto roll-up settings cannot be changed

Metrics Advisor can automatically generate the data cube (sum) during ingestion, which can help when performing hierarchical analysis. There are three possibilities, depending on your scenario:

1. *I do not need to include the roll-up analysis for my data.*

    You do not need to use the Metrics Advisor roll-up.

2. *My data has already rolled up and the dimension value is represented by: NULL or Empty (Default), NULL only, Others.*

    This option means Metrics Advisor doesn't need to roll up the data because the rows are already summed. For example, if you select *NULL only*, then the second data row in the below example will be seen as an aggregation of all countries and language *EN-US*; the fourth data row which has an empty value for *Country* however will be seen as an ordinary row which might indicate incomplete data.
    
    Row ID | Country | Language | Income
    --- | --- | --- | ---
    1 | China | ZH-CN | 10000
    2 | (NULL) | EN-US | 999999
    3 | US | EN-US | 12000
    4 |  | EN-US | 5000
    ... | ...
    
2. *I need Metrics Advisor to roll up my data by calculating Sum/Max/Min/Avg/Count and represent it by <some string>*

    Some data sources such as Cosmos DB or Azure Blob Storage do not support certain calculations like *group by* or *cube*. Metrics Advisor provides the roll up option to automatically generate a data cube during ingestion.
    This option means you need Metrics Advisor to calculate the roll-up using the algorithm you've selected and use the specified string to represent the roll-up in Metrics Advisor. This won't change any data in your data source.
    For example, suppose you have a set of time series which stands for Sales metrics with the dimension (Country, Region). For a given timestamp, it might look like the following:
    
    | Country       | Region           | Sales |
    | :------------ | :--------------- | :---- |
    | Canada        | Alberta          | 100   |
    | Canada        | British Columbia | 500   |
    | United States | Montana          | 100   |
    
    After enabling Auto Roll Up with *Sum*, Metrics Advisor will calculate the dimension combinations, and sum the metrics during data ingestion. The result might be:
    
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
    
    The following is the transformation in SQL language.
    
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
    
    Consider the following before using the Auto roll up feature:
    
    * If you want to use **SUM** to aggregate your data, make sure your metrics are additive in each dimension. Here are some examples of **non-additive** metrics:
      * Fraction-based metrics. This includes ratio, percentage, etc. For example, you should not add the unemployment rate of each state to calculate the unemployment rate of the entire country.
      * Overlap in dimension. For example, you should not add the number of people in to each sport to calculate the number of people who like sports, because there is an overlap between them, one person can like multiple sports.
    * To ensure the health of the whole system, the size of cube is limited. Currently, the limit is 1,000,000. If your data exceeds that limit, ingestion will fail for that timestamp.

##  Backfill your data feed

Select the  **Backfill** button to trigger an immediate ingestion on a time-stamp, to fix a failed ingestion or override the existing data.
- The start time is inclusive.
- The end time is exclusive.
- Anomaly detection is re-triggered on selected range only.

![Backfill Datafeed](../media/datafeeds/backfill-datafeed.png)

## Advanced settings

There are several optional advanced settings when creating a new data feed. Most of them can be modified later in data feed detail page.

### Ingestion options

* **Ingestion time offset**: By default, data is ingested according to the specified granularity. For example, a metric with a *daily* timestamp will be ingested one day after its timestamp. You can use the offset to delay the time of ingestion with a *positive* number, or advance it with a *negative* number.

* **Max concurrency**: Set this parameter if your data source supports limited concurrency. Otherwise leave at the default setting.

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
    
### "Data feed not available" alert settings

A data feed is considered as not available if no data is ingested from the source within the grace period specified from the time the data feed starts ingestion. An alert is triggered in this case.

To configure an alert, you need a [web hook](alerts.md#create-a-web-hook) first. Alerts will be sent to this hook.

* **Grace period**: The Grace Period setting is used to determine when to send an alert if no data points are ingested. The reference point is the time of first ingestion. If an ingestion fails, Metrics Advisor will keep trying at a regular interval specified by the granularity. If it continues to fail past the grace period, an alert will be sent.

* **Auto snooze**: When this option is set to zero, each timestamp with *Not Available* triggers an alert. When a setting other than zero is specified, continuous timestamps after the first timestamp with *not available* are not triggered according to the the setting specified.


#### Action link template: 

Action link templates are used to predefine actionable HTTP urls, which consist of the placeholders `%datafeed`, `%metric`, `%timestamp`, `%detect_config`, and `%tagset`. You can use the template to redirect from an anomaly or an incident to a specific URL to drill down.

![Action link template](../media/action-link-template.png "Action link template")

Once you've filled in the action link, click **Go to action link** on the incident list's action option, and incident tree's right-click menu. Replace the placeholders in the action link template with the corresponding values of the anomaly or incident.

| Placeholder | Examples | Comment |
| ---------- | -------- | ------- |
| `%datafeed` | - | Data feed ID |
| `%metric` | - | Metric ID |
| `%detect_config` | - | Detect config ID |
| `%timestamp` | - | Timestamp of an anomaly or end time of a persistent incident |
| `%tagset` | `%tagset`, <br> `[%tagset.get("Dim1")]`, <br> `[ %tagset.get("Dim1", "filterVal")]` | Dimension values of an anomaly or top anomaly of an incident.   <br> The `filterVal` is used to filter out matching values within the square brackets.   |

Examples :

* If the action link template is `https://action-link/metric/%metric?detectConfigId=%detect_config`, we would go to action link `https://action-link/metric/1234?detectConfigId=2345` for anomalies or incidents under metric `1234` and detect config `2345`.

* If the action link template is `https://action-link?[Dim1=%tagset.get('Dim1','')&][Dim2=%tagset.get('Dim2','')]`, 
    - The action link would be `https://action-link?Dim1=Val1&Dim2=Val2` when the anomaly is `{ "Dim1": "Val1", "Dim2": "Val2" }`; 
    - The action link would be `https://action-link?Dim2=Val2` when the anomaly is `{ "Dim1": "", "Dim2": "Val2" } `, since `[Dim1=***&]` is skipped for the dimension value empty string. 

- If the action link template is `https://action-link?filter=[Name/Dim1 eq '%tagset.get('Dim1','')' and ][Name/Dim2 eq '%tagset.get('Dim2','')']`, 
    - The action link would be `https://action-link?filter=Name/Dim1 eq 'Val1' and Name/Dim2 eq 'Val2'` when the anomaly is `{ "Dim1": "Val1", "Dim2": "Val2" }`, 
    - The action link would be `https://action-link?filter=Name/Dim2 eq 'Val2'` when anomaly is `{ "Dim1": "", "Dim2": "Val2" }` since `[Name/Dim1 eq '***' and ]` is skipped for the dimension value empty string. 

### Fill gap when detecting: 

> [!NOTE]
> This setting won't affect your data source and will not affect the data charts displayed on the portal. The auto-filling only occurs during anomaly detection.

Some time series are not continuous. When there're missing data points, Metrics Advisor will use the specified value to fill them before anomaly detection for better accuracy.
The options are: 

* Using the value from the previous actual data point. This is used by default.
* Using a specific value.


## Edit a datafeed

> [!NOTE]
> The following details cannot be changed after a data feed has been created. 
> * Data feed ID
> * Created Time
> * Dimension
> * Source Type
> * Granularity

Only the administrator of a datafeed is allowed to make changes to it. To pause or reactivate the datafeed

1. On the datafeed list page, click the operation you want to perform on the datafeed.

2. On the datafeed details page, click the **Status** switch button.

To delete a datafeed: 

1. On the datafeed list page, click **Delete** on the datafeed.

2. In the datafeed details page, click **Delete**.

When changing the start time, you need to verify the schema again. You can change it by using **Edit parameters**.

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

- [Configurations for different data sources](../data-feeds-from-different-sources.md)
- [Send anomaly feedback to your instance](anomaly-feedback.md)
- [Diagnose incidents](diagnose-incident.md).
- [Configure metrics and anomaly detection](configure-metrics.md)