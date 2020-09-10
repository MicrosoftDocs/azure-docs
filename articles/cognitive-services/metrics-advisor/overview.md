---
title: What is Metrics Advisor
titleSuffix: Azure Cognitive Services
description: What is Metrics Advisor?
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: overview
ms.date: 09/03/2020
ms.author: aahi
ms.custom: seodec2018
---

# What is Metrics Advisor? 

Metrics Advisor is a time series monitoring platform that provides a set of APIs and a web-based workspace for data ingestion, anomaly detection, and diagnostics, without needing to know machine learning. Use Metrics Advisor to:

* Analyze multi-dimensional data from multiple data sources 
* Identify and correlate anomalies
* Configure and fine-tune the anomaly detection model used on your data
* Build scalable root cause analysis. 

:::image type="content" source="media/metrics-monitoring-overview.png" alt-text="Metrics Advisor overview":::

<!--## Scenarios

:::image type="content" source="media/overview-scenarios.png" alt-text="Metrics Advisor overview scenarios":::-->

## Customizable anomaly detection at scale

Use Metrics Advisor to analyze your time series data, regardless of industry, scenario, or data volume. Metrics Advisor provides visualizations, analysis tools, and applies detection models without you needing to know machine learning.

Like the [Anomaly Detector API](../anomaly-detector/overview.md), Metrics Advisor automatically identifies and applies the best-fitting models to your data. Using your time series data, Metrics Advisor determines boundaries for anomaly detection, expected values, and which data points are anomalies. You can also customize the model used to fit your data.

## Interactive Web portal

Use the web portal to easily onboard your data and work with the Metrics Advisor service.  

## Use your own data source 

Metrics Advisor lets you connect to a variety of different sources and databases, including: SQL Servers, Azure Blob Storage, MongoDB and more.


## Typical workflow

The workflow is simple: after onboarding your data, you can fine-tune the anomaly detection, and create configurations to fit your scenario.

1. [Create an Azure resource](../cognitive-services-apis-create-account.md) for Metrics Advisor. 
2. Try the demo site to see an example Metrics Advisor instance with pre-configured sample data. 
3. Build your first monitor using the web portal.
    1. Onboard your data
    2. Fine-tune anomaly detection
    3. Subscribe to alerts
    4. View diagnostic insights
1. Use the REST API to customize your instance.

## Next Steps

* Try the [demo site](quickstarts/explore-the-demo.md).
* Create a Metrics Advisor instance using the [web portal](quickstarts/web-portal.md), and onboard your data. 
  * You can also use the [REST API](quickstarts/rest-api-and-client-library.md). 
* Learn about [managing data feeds](how-tos/manage-data-feeds.md). 