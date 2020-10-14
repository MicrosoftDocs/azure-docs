---
title: Metrics Advisor frequently asked questions
titleSuffix: Azure Cognitive Services
description: Frequently asked questions about the Metrics Advisor service.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: conceptual
ms.date: 09/30/2020
ms.author: mbullwin
---


# Metrics Advisor frequently asked questions

### What is the cost of my instance?

There currently isn't a cost to use your instance during the preview.

### Why is the demo website readonly?

The [demo website](https://anomaly-detector.azurewebsites.net/) is publicly available. This instance is made read-only to prevent accidental upload of any data.

### Why can't I create the resource? The "Pricing tier" is unavailable and it says "You have already created 1 S0 for this subscription"?

:::image type="content" source="media/pricing.png" alt-text="Message when an F0 resource already exists":::

During public preview, only one instance of Metrics Advisor is allowed to created under a subscription, in one region.

If you already have an instance created in the same region using the same subscription, you can try a different region or a different subscription to create a new instance. You can also delete an existing instance to create a new one.

If you have already deleted the existing instance but still see the error, please wait for about 20 minutes after resource deletion before you create a new instance.

## Basic concepts

### What is multi-dimensional time-series data?

See the [Multi-dimensional metric](glossary.md#multi-dimensional-metric)  definition in the glossary.

### How much data is needed for Metrics Advisor to start anomaly detection?

At minimum, one data point can trigger anomaly detection. This doesn't bring the best accuracy, however. The service will assume a window of previous data points using the value you've specified as the "fill-gap" rule during data feed creation.

We recommend having some data before the timestamp that you want detection on.
Based on the granularity of your data, the recommended data amount varies as below.

| Granularity | Recommended data amount for detection |
| ----------- | ------------------------------------- |
| Less than 5 minutes | 4 days of data |
| 5 minutes to 1 day | 28 days of data |
| More than 1 day, to 31 days | 4 years of data |
| Greater than 31 days | 48 years of data |

### Why Metrics Advisor doesn't detect anomalies from historical data?

Metrics Advisor is designed for detecting live streaming data. There's a limitation of the maximum length of historical data that the service will look back and run anomaly detection. It means only data points after a certain earliest timestamp will have anomaly detection results. That earliest timestamp depends on the granularity of your data.

Based on the granularity of your data, the lengths of the historical data that will have anomaly detection results are as below.

| Granularity | Maximum length of historical data for anomaly detection |
| ----------- | ------------------------------------- |
| Less than 5 minutes | Onboard time - 13 hours |
| 5 minutes to less than 1 hour | Onboard time - 4 days  |
| 1 hour to less than 1 day | Onboard time - 14 days  |
| 1 day | Onboard time - 28 days  |
| Greater than 1 day, less than 31 days | Onboard time - 2 years  |
| Greater than 31 days | Onboard time - 24 years   |

### More concepts and technical terms

Also see the [Glossary](glossary.md) for more information.

###  How do I write a valid query for ingesting my data?  

For Metrics Advisor to ingest your data, you will need to create a query that returns the dimensions of your data at a single timestamp. Metrics advisor will run this query multiple times to get the data from each timestamp. 

Note that the query should return at most one record for each dimension combination, at a given timestamp. All records returned must have the same timestamp. There should be no duplicate records returned by the query.

For example, suppose you create the query below, for a daily metric: 
 
`select timestamp, city, category, revenue from sampledata where Timestamp >= @StartTime and Timestamp < dateadd(DAY, 1, @StartTime)`

Be sure to use the correct granularity for your time series. For an hourly metric, you would use: 

`select timestamp, city, category, revenue from sampledata where Timestamp >= @StartTime and Timestamp < dateadd(hour, 1, @StartTime)`

Note that these queries only return data at a single timestamp, and contain all of the dimension combinations to be ingested by Metrics Advisor. 

:::image type="content" source="media/query-result.png" alt-text="A query result with one timestamp" lightbox="media/query-result.png":::


### How do I detect spikes & dips as anomalies?

If you have hard thresholds predefined, you could actually manually set "hard threshold" in [anomaly detection configurations](how-tos/configure-metrics.md#anomaly-detection-methods).
If there's no thresholds, you could use "smart detection" which is powered by AI. Please refer to [tune the detecting configuration](how-tos/configure-metrics.md#tune-the-detecting-configuration) for details.

### How do I detect inconformity with regular (seasonal) patterns as anomalies?

"Smart detection" is able to learn the pattern of your data including seasonal patterns. It then detects those data points that don't conform to the regular patterns as anomalies. Please refer to [tune the detecting configuration](how-tos/configure-metrics.md#tune-the-detecting-configuration) for details.

### How do I detect flat lines as anomalies?

If your data is normally quite unstable and fluctuates a lot, and you want to be alerted when it turns too stable or even becomes a flat line,
"Change threshold" is able to be configured to detect such data points when the change is too tiny.
Please refer to [anomaly detection configurations](how-tos/configure-metrics.md#anomaly-detection-methods) for details.

## Next Steps
- [Metrics Advisor overview](overview.md)
- [Try the demo site](quickstarts/explore-demo.md)
- [Use the web portal](quickstarts/web-portal.md)