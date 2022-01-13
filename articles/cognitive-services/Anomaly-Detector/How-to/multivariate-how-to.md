---
title: How to use Multivariate Anomaly Detector APIs on your time series data
titleSuffix: Azure Cognitive Services
description: Learn how to detect anomalies in your data with multivariate anomaly detector.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: conceptual
ms.date: 01/18/2022
ms.author: mbullwin
---

# How to: Use Multivariate Anomaly Detector on your time series data  

The Multivariate Anomaly Detector (MVAD) provides mainly two steps to detect anomalies compared with Univariate Anomaly Detector (UVAD), **training** and **inference**. During inference process, you could choose to use an asynchronized API or a synchronized API to trigger inference one time, and both of these two APIs will support batch or streaming scenario.

In general, you could take these steps to use MVAD:
  1. Create an Anomaly Detector resource in Azure Portal.
  1. Prepare your data for training and inference.
  1. Train an MVAD model.
  1. Detect anomalies in inference process with trained MVAD model.
  1. Retrieve and interpret the inference results.



## 1. Create an Anomaly Detector resource in Azure Portal

* Create an Azure subscription if you don't have one - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, [create an Anomaly Detector resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector) in the Azure portal to get your API key and API endpoint.

> [!NOTE]
> During preview stage, MVAD is available in limited regions only. Please bookmark [What's new in Anomaly Detector](../whats-new.md)  to keep up to date with MVAD region roll-outs. You could also file a GitHub issue or contact us at [AnomalyDetector@microsoft.com](mailto:AnomalyDetector@microsoft.com) to request for specific regions.


## 2. Data preparation

Then you need to prepare your training data (and inference data with asynchronized API).

[!INCLUDE [mvad-data-schema](../includes/mvad-data-schema.md)]


## Next Steps

* [What is the Anomaly Detector API?](../overview.md)
* [Quickstart: Detect anomalies in your time series data using the Anomaly Detector](../quickstarts/client-libraries.md)
