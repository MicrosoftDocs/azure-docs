---
title: What is the Metrics Advisor service?
titleSuffix: Azure Cognitive Services
description: What is Metrics Advisor?
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: overview
ms.date: 09/14/2020
ms.author: mbullwin
---

# What is Metrics Advisor (preview)? 

Metrics Advisor is a part of Azure Cognitive Services that uses AI to perform data monitoring and anomaly detection in time series data. The service automates the process of applying models to your data, and provides a set of APIs and a web-based workspace for data ingestion, anomaly detection, and diagnostics - without needing to know machine learning. Developers can build AIOps, predicative maintenance and business monitor applications on top of the service. Use Metrics Advisor to:

* Analyze multi-dimensional data from multiple data sources 
* Identify and correlate anomalies
* Configure and fine-tune the anomaly detection model used on your data
* Diagnose anomalies and help with root cause analysis. 

:::image type="content" source="media/metrics-advisor-overview.png" alt-text="Metrics Advisor overview":::

## Connect to a variety of data sources

Metrics Advisor can connect to, and [ingest multi-dimensional metric](how-tos/onboard-your-data.md) data from many data stores, including: SQL Server, Azure Blob Storage, MongoDB and more. 

## Easy-to-use and customizable anomaly detection

* Metrics Advisor automatically selects the best model for your data, without needing to know any machine learning. 
* Automatically monitor every time series within [multi-dimensional metrics](glossary.md#multi-dimensional-metric).
* Use [parameter tuning](how-tos/configure-metrics.md) and [interactive feedback](how-tos/anomaly-feedback.md) to customize the model applied on your data, and future anomaly detection results.


## Real time alerts through multiple channels

Whenever anomalies are detected, Metrics Advisor is able to [send real time alerts](how-tos/alerts.md) through multiple channels using hooks, such as: email hooks, web hooks and Azure DevOps hooks. Flexible alert rules let you customize which alerts are sent, and where.

## Smart diagnostic insights by analyzing anomalies

Analyze anomalies detected on multi-dimensional metrics, and generate [smart diagnostic insights](how-tos/diagnose-incident.md) including most the most likely root cause, diagnostic trees, metric drilling, and more. By configuring [Metrics graph](how-tos/metrics-graph.md), cross metrics analysis can enabled to help you visualize incidents.


## Typical workflow

The workflow is simple: after onboarding your data, you can fine-tune the anomaly detection, and create configurations to fit your scenario.

1. [Create an Azure resource](../cognitive-services-apis-create-account.md) for Metrics Advisor. 
2. Build your first monitor using the web portal.
    1. Onboard your data
    2. Fine-tune anomaly detection
    3. Subscribe to alerts
    4. View diagnostic insights
3. Use the REST API to customize your instance.

## Next steps

* Explore a quickstart: [Monitor your first metric on web](quickstarts/web-portal.md).
* Explore a quickstart: [Use the REST APIs to customize your solution](./quickstarts/rest-api-and-client-library.md).
