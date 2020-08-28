---
title: What is Metrics Advisor
titleSuffix: Azure Cognitive Services
description: What is Metrics Advisor?
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice:
ms.topic: overview
ms.date: 08/27/2020
ms.author: aahi
ms.custom: seodec2018
---

# What is Metrics Advisor? 

Metrics Advisor is a time series monitoring platform that provides a set of APIs for data ingestion, anomaly detection, and diagnostics, without needing to know machine learning. Use Metrics Advisor to:

* Analyze multi-dimensional data from multiple data sources 
* Identify and correlate anomalies
* Configure and fine-tune the anomaly detection model used on your data
* Build scalable root cause analysis. 

:::image type="content" source="media/metrics-monitoring-overview.png" alt-text="Metrics Advisor overview":::

<!--## Scenarios

:::image type="content" source="media/overview-scenarios.png" alt-text="Metrics Advisor overview scenarios":::-->

## Interactive Web portal

Use the web portal to easily onboard your data and work with the Metrics Advisor service. Take a look at the [demo site](quickstarts/explore-the-demo.md) to learn about using it.

## Onboard your data from different sources

Metrics Advisor lets you onboard your data from a variety of different sources and databases, including: SQL Servers, Azure Blob Storage, MongoDB and more.

## Customizable anomaly detection

Configure the anomaly detection model that is applied on your data. Take into account seasonality, , and planned events that might generate anomalies. 

## Incident diagnostic and analysis tools 

Metrics Advisor provides a set of of tools for diagnosing incidents and anomalies. These include: automated root-cause analysis, incident trees, and detailed anomaly information. 

## Typical workflow

The workflow is simple: after onboarding your data, you can fine-tune the anomaly detection, and create configurations to fit your scenario.

1. [Create an Azure resource](../cognitive-services-apis-create-account.md) for Metrics Advisor. Afterwards, [get the key](../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) generated for you to authenticate your requests.
2. Try the demo site to see an example Metrics Advisor instance with pre-configured sample data. 
3. Build your first monitor using the web portal.
    1. Onboard your data
    2. Fine-tune anomaly detection
    3. Subscribe to alerts
4. Use the REST API or Client libraries to customize your instance.

## Next Steps

* Try the [demo site](quickstarts/explore-the-demo.md).
* Create a Metrics Advisor instance using the [web portal](quickstarts/web-portal.md), and onboard your data. 
  * You can also use the [REST API or client libraries](quickstarts/rest-api-and-client-library.md). 
* Learn about [managing data feeds](how-tos/datafeeds.md). 