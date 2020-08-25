---
title: Metrics Advisor glossary
titleSuffix: Azure Cognitive Services
description: Key ideas and concepts for the Metrics Advisor service
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: 
ms.topic: conceptual
ms.date: 08/19/2020
ms.author: aahi
---

# Metrics Advisor glossary of common vocabulary and concepts

This document explains the technical terms used in Metrics Advisor. You could scan through the document to have a basic understanding of what kind of objects Metrics Advisor is dealing with and bookmark this page as a look-up table when you meet unfamiliar terms in Metrics Advisor web portal and APIs.

## Data feed

A data feed is what Metrics Advisor ingests from the user-specified data source such as Cosmos structure stream, SQL query result, and so on. A data feed contains rows of timestamps, zero or more dimensions, one or more measures. Therefore, multiple metrics could share the same data source and even the same data feed.

## Metric

A metric is a quantifiable measure that is used to track and assess the status of a specific business process. It can be a combination of multiple time series values divided by dimensions, for example user count for a web vertical and en-us market.

## Dimension

A dimension is one or more categorical values. The combination of those values identifies a particular univariate time series, for example: country, language, tenant, and so on.

## Measure

A measure is a fundamental or unit-specific term and a quantifiable value of the metric.

## Time series

A time series is a series of data points indexed (or listed or graphed) in time order. Most commonly, a time series is a sequence taken at successive equally spaced points in time. Therefore it is a sequence of discrete-time data.

In Metrics Advisor, values of one metric on a specific dimension combination is called one series.

## Granularity

The granularity indicates how frequent the data point is produced at the data source, for example: daily, hourly, and so on.

## Start time

Start time is the time that you want Metrics Advisor to ingest data from. Your data source must actually have data at the specified start time.

## Confidence bounds

In Metrics Advisor, confidence bounds are used to filter out over-sensitive anomalies. On the web portal, confidence bounds appear as a transparent blue band. All the points wrapped by the band are treated as normal points.

![Confidence bounds](media/confidencebounds.png)

> [!Note]
> Confidence bounds are NOT the bar for judging anomalies. So NOT ALL out-of-the-bounds data points are anomalies.  

Metrics Advisor web portal provides a simple slider bar in detecting config, which can help you adjust the sensitivity of the algorithms which are represented by confidence bounds.

## Hook

In Metrics Advisor, real-time alerting on metrics anomaly is one of the core capabilities. To enable this scenario, hook plays a critical role.
There are multiple alerting channels. Currently, Metrics Advisor supports filing alerts by emails and Web API calls (aka. web hooks).

## Anomaly incident

After a detecting config is applied on metrics, whenever any series encounters anomalies, incidents based on those anomalies are generated.

However, a metric can contain thousands of series split by dimensions. Filing alerts on each series anomaly can introduce an alert black hole.

To avoid such situations and provide deeper insights on anomalies, Metrics Advisor groups series anomalies within one metric into an incident and evaluates the severity according to the real impact. Within an anomaly incident, it is easy to find the root cause of the incident and the related impact.

### Incident tree

In Metrics Advisor, you can apply anomaly detection on metrics, then Metrics Advisor automatically monitors all time series of all dimension combinations. Whenever there is any anomaly detected, Metrics Advisor aggregates anomalies into incidents.

Incident tree provides the hierarchy of anomaly contribution and pin point the ones with the biggest impact. Each incident has a root cause anomaly which is the top node of the tree. Depending on the anomaly incident, it is easy to find the root cause of the incident and the related impact.

### Anomaly grouping

Metrics Advisor provides the capability to find related time series with a similar pattern. It also helps provide further insights of the impact on other dimensions and correlate the anomalies.

### Time series comparison

You can also pick multiple time series to compare trending in one single visualization. This provides a clear and insightful way to view and compare related series.

## Detecting config

On Metrics Advisor web portal, detecting config (such as sensitivity, auto snooze, and direction) is listed on the left panel. Parameters can be tuned and applied to all series within this metric.

Detecting config is required for every time series and determines whether a point of the time series is an anomaly. Metrics Advisor will set up a default configuration for the whole metric when you first onboard data. Besides the configuration on the whole metric, you can refine the configuration by tuning parameters on series group or specific series level. Only one configuration will be applied to a time series. More fine-grained configuration has higher priority, and priority of these configurations is 'specific series' > 'series group' > 'whole metric'

Currently, Metrics Advisor provides three types of anomaly detection methods: smart detection, hard threshold, and change threshold. You can combine multiple detection methods using logical operator to define their anomalies. For example, a point is considered as an anomaly only when detected by both smart detection and hard threshold.

>[!Note]
>Detecting config is only applied within an individual metric.

### Smart detection

Anomaly detection with multiple ML-based algorithms under the hood.

**Sensitivity**: Metrics Advisor extracts various parameters of different algorithms used for tuning detecting result into a simple and intuitive parameter called 'sensitivity'. It is a numerical value to adjust the tolerance of the anomalies. Visually the higher the value, the narrower the band (upper/lower bounds) around time series.

### Hard threshold

Simply use upper and lower bounds to divide the range of normal point.

**Min**: The lower bound

**Max**: The upper bound

### Change threshold

Use the previous point value to determine if this point is an anomaly.

**Change percentage**: Compared to the previous point, the point is considered as an anomaly if the change percentage of point value is more than this parameter.

**Change over points**: How many points the detector should look back.

### Common parameters

**Direction**: A point is an anomaly only when the deviation occurs in the direction 'up', 'down', or 'both'.

**Not valid anomaly until**: Some anomalies are noisy, especially for small granularity metrics. Customers can set 'Not a valid anomaly until' x% of last y points are anomalies. A data point is considered as an anomaly only when meeting this criterion.

## Alert settings

Alert settings determine which anomalies should trigger an alert. Anomalies detected by one detecting config could be set with multiple alert settings for different alerting purposes. For example, alert setting 'A' is for severe monitoring with all anomalies, and an email hook is applied for notification. Alert setting 'B' is applied to the same detecting result with the top 100 series, and a web hook applied. In this case, setting 'A' is used for notices with no real impact, but setting 'B' could trigger immediate automated actions that prevent business loss. Moreover, you can combine anomalies across metrics to fire an alert: For example, only when both metric1 and metric2 have anomalies in the same series, an alert notification should be sent to you.

>[!Note]
>If you would like to receive an alert you should set up an alert setting with hooks. Metrics Advisor won't do it by default.

In alert settings, you can select the scope of anomalies which need to fire an alert.
Furthermore, you can filter these anomalies with severity and snooze options.

### Alert scope

Alert scope refers to the scope that the alert applies to. There are four options which can be selected accordingly.

**Anomalies of all series**: Alerts will be fired for anomalies of all series within the metric.

**Anomalies in series group**: Alerts will only be fired for anomalies of series group selected by dimension. The number of specified dimension should be smaller than the total number of the dimension.

**Anomalies in favorite series**: Alerts will only be fired for anomalies of favorite series. You can choose a group of series as favorite for each detecting config.

**Anomalies in top N of all series**: Alerts will only be fired for anomalies of top N series. You can set parameters to take the latest X timestamps into account, fire alert when Y of them are in top N.

### **Severity**

Severity is a grade that Metrics Advisor uses to describe the severity of incident, including *High*, *Medium*, and *Low*.

Currently, Metrics Advisor takes account of the following factors to measure the alert severity:

1. The value proportion and the quantity proportion of anomalies in the metric.
1. Confidence of anomalies.
1. Your favorite settings also contribute to the severity.

### **Auto snooze**

Some anomalies are transient issues, especially for small granularity metrics. You can set 'Autosnooze' as x *consequent* timestamps. The behavior of snooze can be set on either metric level or series level.

For example, in general, once there is an anomaly in the metric, an incident will be created. Assume metric A has an anomaly at timestamp X, and 'Autosnooze' is as 2. If in the next two timestamps (X + 1 and X + 2) there are new anomalies, the new anomalies will not be considered as the trigger to new alerts. But if there is another metric B which has anomalies in X + 1 and X + 2, a new alert will be triggered even though the metric A is snoozed.

## Data feed settings

### **Ingestion Time Offset**

By default, data with timestamp T is ingested at the time of T + Granularity. For example, the regular ingestion time for a daily metric with timestamp T shall be ingested by T+1d 0am UTC. By setting a positive number X (>0), ingestion of data is delayed X hours accordingly. A negative number (< 0) is also allowed which will advance the ingestion.

### **Max Ingestion per Minute**

Set this parameter if data source supports limited concurrency. Otherwise leave as default setting.

### **Stop retry after**

 If data ingestion has failed, it will retry automatically within a period. The beginning of the period is the time when the first data ingestion happened. The length of the retry period is defined according to the granularity. If leaving the default value (-1), the value will be determined according to the granularity as below.

| Granularity       | Stop Retry After           |
| :------------ | :--------------- |
| Daily, Custom (>= 1 Day), Weekly, Monthly, Yearly     | 7 days          |
 Hourly, Custom (< 1 Day)       | 72 hours |

### **Min retry interval**

 You can specify the minimum interval when retrying pulling data from source. If leaving the default value (-1), the retry interval will be determined according to the granularity as below.

| Granularity       | Minimum Retry Interval           |
| :------------ | :--------------- |
| Daily, Custom (>= 1 Day), Weekly, Monthly     | 30 minutes          |
| Hourly, Custom (< 1 Day)      | 10 minutes |
| Yearly | 1 day          |

### **Grace Period**

Grace period is a period of time within a due date during which Metrics Advisor continues to fetch data from the data source, but doesn't fire any alerts. After grace period, if there's still no data ingested, a 'Data feed not available' alert is triggered.

> [!Note]
> Grace period counts from regular ingestion time + ingestion time offset specified.
    
For example, if the timestamp of daily metric is 2018-12-01, Metrics Advisor starts to pull the data from 2018-12-02 00:00 in regular case. If 'ingestion time offset' is set to 2 hours. Then first ingestion time would be 2018-12-02 02:00. If the pull fails, Metrics Advisor keeps retrying in an interval decided by granularity. If Grace period is set to 10 hours and there's still no data ingested after 2018-12-02 12:00, Metrics Advisor fires a 'Data feed is not available' alert to the hooks set.

### **Snooze alerts in**

When this option is set to zero, each timestamp with 'Not Available' triggers an alert. When set to a value other than zero, following number of 'Not available' alerts are snoozed if there's still no data been fetched.

### **Data feed permissions**

There're two roles to manage data feed permissions, one is 'Administrator', another role is 'Viewer'. 

* 'Administrator' has the full control on the data feed and metrics within it, like active/pause/delete the data feed, update data feed configurations and also metric detecting configurations... 'Administrator' is normally the owner of the metrics, who has a clear mind of what to monitor and what is the best configuration. 

* 'Viewer' is the role who is able to view the data feed or metrics, but is not able to make any changes. One typical persona of the 'Viewer' is the on-call engineer, who receives anomaly alerts and takes actions to investigate and resolve the issue.

## Next Steps
- [Get started with Metrics Advisor by a quick learning path](firsttimeexp.md)
- [Play with a demo](quickstart/explore-sample-data.md)
- [Create Gualala resource](quickstart/create-instance.md)