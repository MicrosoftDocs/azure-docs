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

Metrics Advisor is a cognitive service that uses time series based decision AI to identify and assist trouble shooting the incidents of online services, predict next maintenance cycle of various equipment and devices and monitor the business health by automating the slice and dice of business metrics like revenue, page views… Metrics Advisor provides a set of APIs and a web-based workspace for data ingestion, anomaly detection, and diagnostics, without needing to know machine learning. Use Metrics Advisor to:

* Analyze multi-dimensional data from multiple data sources 
* Identify and correlate anomalies
* Configure and fine-tune the anomaly detection model used on your data
* Diagnose anomalies and help with root cause analysis. 

:::image type="content" source="media/metrics-advisor-overview.png" alt-text="Metrics Advisor overview":::

<!--## Scenarios

:::image type="content" source="media/overview-scenarios.png" alt-text="Metrics Advisor overview scenarios":::-->

## Connect to a variety of data sources

Metrics Advisor [ingests multi-dimensional metrics](how-tos/onboard-your-data.md) data from many data stores, including: SQL Servers, Azure Blob Storage, MongoDB and more. Support collecting data through both 'pull' and 'push' mode and enable data monitored in streaming. 

## Easy-to-use and customizable anomaly detection

* Auto-select the best model that works for your metric data without needing to know any underlying techniques. 
* Auto-monitor on every sliced time series of multi-dimensional metrics by using a default configuration. 
* Simple [parameter tuning](how-tos/configure-metrics.md) and [interactive feedback](how-tos/anomaly-feedback.md) to customize your model and detection result.


## Real time alerts through multiple channels

Whenever anomalies are detected, Metrics Advisor is able to [fire real time alerts](how-tos/alerts.md) through multiple channels(defined as hooks in Metrics Advisor), like email, web hook as well as Azure DevOps. Flexible alert rule settings are available to better serve on various scenarios. 

## Smart diagnostic insights by analyzing anomalies

Analyze anomalies detected on multi-dimensional metrics and generate [smart diagnostic insights](how-tos/diagnose-incident.md) including most likely root cause, diagnosing tree, metric drilling, anomaly clustering... By configuring [Metrics graph](how-tos/metrics-graph.md), cross metrics analysis is also enabled to help understand on overall impact from a global view. 


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
* Explore a quickstart: [Monitor your first metric on web](quickstarts/web-portal.md).
* Explore a quickstart: [Use the REST APIs to customize your solution](quickstarts/rest-api-and-client-library.md).