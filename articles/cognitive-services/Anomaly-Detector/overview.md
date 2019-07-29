---
title: What is the Anomaly Detector API?
titleSuffix: Azure Cognitive Services
description: Use the Anomaly Detector API's advanced algorithms to identify anomalies in your time series data.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: overview
ms.date: 03/26/2019
ms.author: aahi
---

# What is the Anomaly Detector API?

The Anomaly Detector API enables you to monitor and detect abnormalities in your time series data with machine learning. The Anomaly Detector API adapts by automatically identifying and applying the best-fitting models to your data, regardless of industry, scenario, or data volume. Using your time series data, the API determines boundaries for anomaly detection, expected values, and which data points are anomalies.

![Detect pattern changes in service requests](./media/anomaly_detection2.png)

Using the Anomaly Detector doesn't require any prior experience in machine learning, and the RESTful API enables you to easily integrate the service into your applications and processes.

## Features

With the Anomaly Detector, you can automatically detect anomalies throughout your time series data, or as they occur in real-time. 

|Feature  |Description  |
|---------|---------|
|Detect anomalies as they occur in real-time. | Detect anomalies in your streaming data by using previously seen data points to determine if your latest one is an anomaly. This operation generates a model using the data points you send, and determines if the target point is an anomaly. By calling the API with each new data point you generate, you can monitor your data as it's created. |
|Detect anomalies throughout your data set as a batch. | Use your time series to detect any anomalies that might exist throughout your data. This operation generates a model using your entire time series data, with each point analyzed with the same model.         |
| Get additional information about your data. | Get useful details about your data and any observed anomalies, including expected values, anomaly boundaries and positions. |
| Adjust anomaly detection boundaries. | The Anomaly Detector API automatically creates boundaries for anomaly detection. Adjust these boundaries to increase or decrease the API's sensitivity to data anomalies, and better fit your data. |

## Demo

To quickly begin using the Anomaly Detector API, try an [online demo](https://notebooks.azure.com/AzureAnomalyDetection/projects/anomalydetector) that can be run in your browser. This demo runs in a web-hosted Jupyter notebook and shows you how to send an API request, and visualize the result.

To run the demo, complete the following steps:

1. Get a valid Anomaly Detector API subscription key and an API endpoint. The section below has instructions for signing up. 
2. Sign in, and click Clone, in the upper right corner.
3. Click **Run on free compute**
4. Select one of the notebooks for this sample.
5. Add your valid Anomaly Detector API subscription key to the `subscription_key` variable. Change the `endpoint` variable to your endpoint. For example:
    `https://westus2.api.cognitive.microsoft.com`
1. On the top menu bar, click **Cell**, then **Run All**.

## Workflow

The Anomaly Detector API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON.

[!INCLUDE [cognitive-services-anomaly-detector-data-requirements](../../../includes/cognitive-services-anomaly-detector-data-requirements.md)]

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]

After signing up:

1. Take your time series data and convert it into a valid JSON format. Use [best practices](concepts/anomaly-detection-best-practices.md) when preparing your data to get the best results.
1. Send a request to the Anomaly Detector API with your data.
1. Process the API response by parsing the returned JSON message.

## Next steps

* [Quickstart: Detect anomalies in your time series data using the Anomaly Detector REST API](quickstarts/detect-data-anomalies-csharp.md)
* The Anomaly Detector API [online demo](https://notebooks.azure.com/AzureAnomalyDetection/projects/anomalydetector)
* The Anomaly Detector [REST API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector/operations/post-timeseries-entire-detect)