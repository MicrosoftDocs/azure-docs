---
title: What is the Azure AI Metrics Advisor service?
titleSuffix: Azure AI services
description: What is Metrics Advisor?
author: mrbullwinkle
manager: nitinme
ms.service: applied-ai-services
ms.subservice: metrics-advisor
ms.topic: overview
ms.date: 07/06/2021
ms.author: mbullwin
---

# What is Azure AI Metrics Advisor? 

[!INCLUDE [Azure AI services rebrand](../includes/rebrand-note.md)]

Metrics Advisor is a part of [Azure AI services](../../ai-services/what-are-ai-services.md) that uses AI to perform data monitoring and anomaly detection in time series data. The service automates the process of applying models to your data, and provides a set of APIs and a web-based workspace for data ingestion, anomaly detection, and diagnostics - without needing to know machine learning. Developers can build AIOps, predicative maintenance, and business monitor applications on top of the service. Use Metrics Advisor to:

* Analyze multi-dimensional data from multiple data sources
* Identify and correlate anomalies
* Configure and fine-tune the anomaly detection model used on your data
* Diagnose anomalies and help with root cause analysis

:::image type="content" source="media/metrics-advisor-overview.png" alt-text="Metrics Advisor overview":::

This documentation contains the following types of articles:
* The [quickstarts](./Quickstarts/web-portal.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* The [how-to guides](./how-tos/onboard-your-data.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles](glossary.md) provide in-depth explanations of the service's functionality and features.

## Connect to a variety of data sources

Metrics Advisor can connect to, and [ingest multi-dimensional metric](how-tos/onboard-your-data.md) data from many data stores, including: SQL Server, Azure Blob Storage, MongoDB and more.

## Easy-to-use and customizable anomaly detection

* Metrics Advisor automatically selects the best model for your data, without needing to know any machine learning.
* Automatically monitor every time series within [multi-dimensional metrics](glossary.md#multi-dimensional-metric).
* Use [parameter tuning](how-tos/configure-metrics.md) and [interactive feedback](how-tos/anomaly-feedback.md) to customize the model applied on your data, and future anomaly detection results.

## Real-time notification through multiple channels

Whenever anomalies are detected, Metrics Advisor is able to [send real time notification](how-tos/alerts.md) through multiple channels using hooks, such as: email hooks, web hooks, Teams hooks and Azure DevOps hooks. Flexible alert configuration lets you customize when and where to send a notification.

## Smart diagnostic insights by analyzing anomalies

### Analyze root cause into specific dimension 

Metrics Advisor combines anomalies detected on the same multi-dimensional metric into a diagnostic tree to help you analyze root cause into specific dimension. There's also automated analyzed insights available by analyzing the greatest contribution of each dimension. 

### Cross-metrics analysis using Metrics graph

A [Metrics graph](./how-tos/metrics-graph.md) indicates the relation between metrics. Cross-metrics analysis can be enabled to help you catch on abnormal status among all related metrics in a holistic view. And eventually locate the final root cause.

Refer to [how to diagnose an incident](./how-tos/diagnose-an-incident.md) for more detail.

## Typical workflow

The workflow is simple: after onboarding your data, you can fine-tune the anomaly detection, and create configurations to fit your scenario.

1. [Create an Azure resource](https://go.microsoft.com/fwlink/?linkid=2142156) for Metrics Advisor. 
2. Build your first monitor using the web portal.
    1. [Onboard your data](./how-tos/onboard-your-data.md)
    2. [Fine-tune anomaly detection configuration](./how-tos/configure-metrics.md)
    3. [Subscribe anomalies for notification](./how-tos/alerts.md)
    4. [View diagnostic insights](./how-tos/diagnose-an-incident.md)
3. Use the REST API to customize your instance.

## Video
* [Introducing Metrics Advisor](https://www.youtube.com/watch?v=0Y26cJqZMIM)
* [New to Azure AI services](https://www.youtube.com/watch?v=7tCLJHdBZgM)

## Data retention & limitation: 

Metrics Advisor will keep at most **10,000** time intervals ([what is an interval?](tutorials/write-a-valid-query.md#what-is-an-interval)) forward counting from current timestamp, no matter there's data available or not. Data falls out of the window will be deleted.  Data retention mapping to count of days for different metric granularity: 

| Granularity(min) |	Retention(day) |
|------------------| ------------------|
|  1 | 6.94 |
|  5 | 34.72|
| 15 | 104.1|
| 60(=hourly) | 416.67 |
| 1440(=daily)|10000.00|

There are also further limitations. Refer to [FAQ](faq.yml#what-are-the-data-retention-and-limitations-of-metrics-advisor-) for more details.

## Use cases for Metrics Advisor

* [Protect your organization's growth by using Azure AI Metrics Advisor](https://techcommunity.microsoft.com/t5/azure-ai/protect-your-organization-s-growth-by-using-azure-metrics/ba-p/2564682)
* [Supply chain anomaly detection and root cause analysis with Azure Metric Advisor](https://techcommunity.microsoft.com/t5/azure-ai/supply-chain-anomaly-detection-and-root-cause-analysis-with/ba-p/2871920)
* [Customer support: How Azure AI Metrics Advisor can help improve customer satisfaction](https://techcommunity.microsoft.com/t5/azure-ai-blog/customer-support-how-azure-metrics-advisor-can-help-improve/ba-p/3038907)
* [Detecting methane leaks using Azure AI Metrics Advisor](https://techcommunity.microsoft.com/t5/ai-cognitive-services-blog/detecting-methane-leaks-using-azure-metrics-advisor/ba-p/3254005)
* [AIOps with Azure AI Metrics Advisor - OpenDataScience.com](https://opendatascience.com/aiops-with-azure-metrics-advisor/)

## Next steps

* Explore a quickstart: [Monitor your first metric on web](quickstarts/web-portal.md).
* Explore a quickstart: [Use the REST APIs to customize your solution](./quickstarts/rest-api-and-client-library.md).
