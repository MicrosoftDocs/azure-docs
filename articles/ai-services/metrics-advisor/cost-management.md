---
title: Cost management with Azure AI Metrics Advisor
titleSuffix: Azure AI services
description: Learn about cost management and pricing for Azure AI Metrics Advisor
author: mrbullwinkle
manager: nitinme
ms.service: applied-ai-services
ms.subservice: metrics-advisor
ms.topic: conceptual
ms.date: 09/06/2022
ms.author: mbullwin
---

# Azure AI Metrics Advisor cost management

Azure AI Metrics Advisor monitors the performance of your organization's growth engines, including sales revenue and manufacturing operations. Quickly identify and fix problems through a powerful combination of monitoring in near-real time, adapting models to your scenario, and offering granular analysis with diagnostics and alerting. You will only be charged for the time series that are analyzed by the service. There's no up-front commitment or minimum fee.

> [!NOTE]
> This article discusses how pricing is calculated to assist you with planning and cost management when using Azure Metric Advisor. The prices in this article do not reflect actual prices and are for example purposes only. For the latest pricing information please refer to the [official pricing page for Metrics Advisor](https://azure.microsoft.com/pricing/details/metrics-advisor/).  

## Key points about cost management and pricing

- You will be charged for the number of **distinct [time series](glossary.md#time-series)** analyzed during a month. If one data point is analyzed for a time series, it will be calculated as well.
- The number of distinct time series is **irrespective** of its [granularity](glossary.md#granularity). An hourly time series and a daily time series will be charged at the same price. 
- The number of distinct time series is **highly related** to the data schema(choice of timestamp, dimension, measure) during onboarding. Please don't choose **timestamp or any IDs** as [dimension](glossary.md#dimension) to avoid dimension explosion, and introduce unexpected cost.
- You will be charged based on the tiered pricing structure listed below. The first day of next month will initialize a new statistic window.  
- The more time series you onboard to the service for analysis, the lower price you pay for each time series. 

**Again keep in mind, the prices below are for example purposes only**. For the latest pricing information, consult the [official pricing page for Metrics Advisor](https://azure.microsoft.com/pricing/details/metrics-advisor/).

| Analyzed time series /month| $ per time series |
|--------|-----|
| Free: first 25 time series | $- |
| 26 time series - 1k time series | $0.75 |
| 1k time series - 5k time series | $0.50 |
| 5k time series - 20k time series | $0.25|
| 20k time series - 50k time series| $0.10|
| >50k time series | $0.05 |


To help you get a basic understanding of Metrics Advisor and start to explore the service, there's an included amount being offered to allow you to analyze up to 25 time series for free. 

## Pricing examples

### Example 1
<!-- introduce statistic window-->

In month 1, if a customer has onboarded a data feed with 25 time series for analyzing the first week. Afterwards, they onboard another data feed with 30 time series the second week. But at the third week, they delete 30 time series that were onboarded during the second week. Then there are **55** distinct time series being analyzed in month 1, the customer will be charged for **30** of them (exclude the 25 time series in the free tier) and falls under tier 1. The monthly cost is: 30 * $0.75 = **$22.5**. 

| Volume tier | $ per time series | $ per month | 
| ------------| ----------------- | ----------- |
| First 30 (55-25) time series | $0.75 | $22.5 |
| **Total = 30 time series** | | **$22.5 per month** |

In month 2, the customer has not onboarded or deleted any time series. Then there are 25 analyzed time series in month 2. No cost will be introduced. 

### Example 2
<!-- introduce how time series is calculated-->

A business planner needs to track the company's revenue as the indicator of business healthiness. Usually there's a week by week pattern, the customer onboards the metrics into Metrics Advisor for analyzing anomalies. Metrics Advisor is able to learn the pattern from historical data and perform detection on follow-up data points. There might be a sudden drop detected as an anomaly, which may indicate an underlying issue, like a service outage or a promotional offer not working as expected. There might also be an unexpected spike detected as an anomaly, which may indicate a highly successful marketing campaign or a significant customer win. 

The metric is analyzed on **100 product categories** and **10 regions**, then the number of distinct time series being analyzed is calculated as: 

```
1(Revenue) * 100 product categories * 10 regions = 1,000 analyzed time series
```

Based on the tiered pricing model described above, 1,000 analyzed time series per month is charged at (1,000 - 25) * $0.75 = **$731.25**. 

| Volume tier | $ per time series | $ per month | 
| ------------| ----------------- | ----------- |
| First 975 (1,000-25) time series | $0.75 | $731.25 |
| **Total = 30 time series** | | **$731.25 per month** |

### Example 3
<!-- introduce cost for multiple metrics and -->

After validating detection results on the revenue metric, the customer would like to onboard two more metrics to be analyzed. One is cost, another is DAU(daily active user) of their website. They would also like to add a new dimension with **20 channels**. Within the month, 10 out of the 100 product categories are discontinued after the first week, and are not analyzed further. In addition, 10 new product categories are introduced in the third week of the month, and the corresponding time series are analyzed for half of the month. Then the number of distinct time series being analyzed are calculated as: 

```    
3(Revenue, cost and DAU) * 110 product categories * 10 regions * 20 channels = 66,000 analyzed time series
```

Based on the tiered pricing model described above, 66,000 analyzed time series per month fall into tier 5 and will be charged at **$10281.25**. 

| Volume tier | $ per time series | $ per month | 
| ------------| ----------------- | ----------- |
| First 975 (1,000-25) time series | $0.75 | $731.25 |
| Next 4,000 time series | $0.50 | $2,000 |
| Next 15,000 time series | $0.25 | $3,750 |
| Next 30,000 time series | $0.10 | $3,000 |
| Next 16,000 time series | $0.05 | $800 |
| **Total = 65,975 time series** | | **$10281.25 per month** |

## Next steps

- [Manage your data feeds](how-tos/manage-data-feeds.md)
- [Configurations for different data sources](data-feeds-from-different-sources.md)
- [Configure metrics and fine tune detection configuration](how-tos/configure-metrics.md)

