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

# How to: onboard your data and manage the data feed

Learn how to create and manage data feeds in Metrics Advisor. This article guides you through onboarding your time series data from different sources, and managing the data feed in Metrics Monitor.

## Onboard your data feed

### Avoid loading partial data

Partial data is caused by inconsistencies between the data stored in Metrics Advisor and the data source. This can happen when the data source is updated after Metrics Advisor has finished pulling data. Metrics Advisor pulls data from a given data source once.

For example, suppose you have two data sources. If the data for a given date is available in the first data source, but not the second, Metrics Advisor will only retrieve metrics from the first data source. If this data is later added to the second data source, Metrics Advisor won't retrieve it. 

You can try to [backfill](#backfill-your-data-feed) historical data (described below) to mitigate inconsistencies but this won't trigger new anomaly alerts, if alerts for those time points have already been triggered. This process may add additional workload to the system, and is not automatic.

To avoid loading partial data, we recommend two approaches:

1. Generate data in one transaction:

    Ensure the metric values for all dimension combinations at the same timestamp are stored to the data source in one transaction. In the above example, wait until data from all data sources is ready, and then load it into Metrics Advisor in one transaction. Metrics Advisor can poll the data feed regularly until data is successfully (or partially) retrieved.

2. Set the ingestion time offset parameter:

    Set the **Ingestion time offset** parameter for your data feed to delay the ingestion until the data is fully prepared. This can be useful for some data sources which don't support transactions such as Azure Table Storage. See [Advanced settings](#advanced-settings) for details.

## Add a data feed using the web Portal

After signing into your Metrics Advisor portal with your Active Directory account, click **Get started**. Then, on the main page of the portal, click **Add data feed** from the left menu.

### Add connection settings

Next you'll input a set of parameters to connect your time-series data source. 
* **Source Type**: The type of data source where your time series data is stored.
* **Granularity**: The interval between consecutive data points in your time series data. Currently we support these options: Yearly, Monthly, Weekly, Daily, Hourly, and Customize. The customization option supports the lowest interval of 60 seconds.
  * **Seconds**: The number of seconds when granularityName is set as "Customize".
* **Ingest data since (UTC)**: The baseline start time for data ingestion while startOffsetInSeconds is often used to add an offset to help with data consistency.

Next, you'll need to specify the connection information of the data source as well as the custom queries which are used to convert the data into the required schema. For details on the other fields and connecting different types of data sources, see [Add data feeds from different data sources](../data-feeds-from-different-sources.md).

### Data schema requirements and configuration

[!INCLUDE [data schema requirements](../includes/data-schema-requirements.md)]

After the connection string and query string are set, select **Verify and get schema** to verify the connection and run the query to get your data schema from the data source. Normally it takes a few seconds depending on your data source connection. If there's an error at this step, confirm that:

1. Your connection string and query are correct.
2. Your Metrics Advisor instance is able to connect to the data source if there are firewall settings.

Once the data schema is loaded, select the appropriate fields.

If the timestamp of a data point is omitted, Metrics Advisor will use the timestamp when the data point is ingested instead. For each data feed, you can specify at most one column as a timestamp. If you get a message that a column cannot be specified as a timestamp, check your query or data source, and whether there are multiple timestamps in the query result - not only in the preview data. When performing data ingestion, Metrics Advisor can only consume only one chunk (one day, one hour, etc., according to the granularity) of time-series data from the given source each time.

|Selection  |Description  |Notes  |
|---------|---------|---------|
| **Display Name** | Name to be displayed on the portal instead of the original column name. | |
|**Timestamp**     | The timestamp of a data point. If omitted, Metrics Advisor will use the timestamp when the data point is ingested instead. For each data feed, you can specify at most one column as timestamp.        | Optional. Should be specified with at most one column. If you get a **column cannot be specified as Timestamp** error, check your query or data source for duplicate timestamps.      |
|**Measure**     |  The numeric values in the data feed. For each data feed, you can specify multiple measures but at least one column should be selected as measure.        | Should be specified with at least one column.        |
|**Dimension**     | Categorical values. A combination of different values identifies a particular single-dimension time series, for example: country, language, tenant. You can select zero or more columns as dimensions. Note: be cautious when selecting a non-string column as a dimension. | Optional.        |
|**Ignore**     | Ignore the selected column.        | Optional. See the below text.       |

If you want to ignore columns, we recommend updating your query or data source to exclude those columns. You can also ignore columns using **Ignore columns** and then then **Ignore** on the specific columns. If a column should be a dimension and is mistakenly set as *Ignored*, Metrics Advisor may end up ingesting partial data. For example, assume the data from your query is as below:

Row ID | Timestamp | Country | Language | Income
--- | --- | --- | --- | ---
1 | 2019/11/10 | China | ZH-CN | 10000
2 | 2019/11/10 | China | EN-US | 1000
3 | 2019/11/10 | US | ZH-CN | 12000
4 | 2019/11/11 | US | EN-US | 23000
... | ...

If *Country* is a dimension and *Language* is set as *Ignored*, then the first and second rows will have the same dimensions. Metrics Advisor will arbitrarily use one value from the two rows. Metrics Advisor will not aggregate the rows in this case.

### Specify a name for the data feed and check the ingestion progress
 
Give a custom name for the data feed, which will be displayed on the portal. Then Click on **Submit**. In the data feed details page, you can use the ingestion progress bar to view status information.

![Ingestion Progress](../media/datafeeds/ingestion-progress.png)

To check ingestion failure details: 

1. Click **Show Details**.
2. Click **Status** then choose **Failed** or **Error**.
3. Hover over a failed ingestion, and view the details message that appears.

![Check Failed Ingestion](../media/datafeeds/check-failed-ingestion.png)

A *failed* status indicates the ingestion for this data source will be retried later.
An *Error* status indicates Metrics Advisor won't retry for the data source. To reload data, you need trigger a backfill/reload manually.

You can also reload the progress of an ingestion by clicking **Refresh Progress**.

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