--- 
title: What is the Anomaly Detector API? | Microsoft Docs 
titleSuffix: Azure Cognitive Services
description: Use the Anomaly Detector API's advanced algorithms to identify anomalies in your time series data. 
services: cognitive-services 
author: aahill
ms.service: cognitive-services 
ms.technology: anomaly-detection 
ms.topic: article
ms.date: 02/26/2019 
ms.author: aahi
--- 
 
# What is the Anomaly Detector API?

The Anomaly Detector API enables you to easily monitor and gain insights from your data over time. Using machine learning, the Anomaly Detector will automatically apply the correct statistical model for your data regardless of your data volume, industry, or scenario. By submitting a time series as input, the Anomaly Finder API determines which data points are anomalies, their expected values, and upper/lower bounds for data visualization.

Using the Anomaly Detector doesn't require any prior experience in machine learning. The RESTful API enables you to easily integrate the service into your applications and processes, and it accepts any data set taken at uniform intervals of time.

![Detecting anomalies in sales revenues](./media/anomaly_detection1.png) 
![Detect pattern changes in service requests](./media/anomaly_detection2.png)

## Features

With the Anomaly Detector, you can automatically find anomalies throughout your time series data, or as they occur in real-time. 

|Feature  |Description  |
|---------|---------|
|Detect anomalies as they occur in real-time. | Use previously seen data points to determine if your latest data point is an anomaly.  The operation will generate a model using points before the latest one, In this method, only history points are used for determine whether the target point is an anomaly. Latest point detecting matches the scenario of real-time monitoring of business metrics.        |
|Find anomalies throughout your data set. | Use your data series to detect any anomalies that might exist. The operation will generate a model using the entire series, each point will be detected with the same model. In this method, points before and after a certain point will be used to determine whether it's an anomaly. The entire detection can give user an overall status of the time series.         |
| Visualize the range of normal values for your data | Visualize your data, including expected values, anomaly boundaries, and anomalies themselves. |
| Adjust the sensitivity of anomaly detection for better results. | Increase or decrease the sensitivity of the anomaly detection boundaries. |

## Workflow

The Anomaly Detection API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON.

> [!NOTE] 
> To use the Anomaly Detection API, your data must follow these requirements:
> - Minimum data for input time series: Minimum of 13 data points for time series without clear periodicity, minimum of four cycles of data points for the time series with known periodicity.
> - Data integrity: time series data points are separated in the same interval and no missing points.

1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/) for free.
2. Send a request to the API, with your data.
3. Process the API response by parsing the returned JSON message.

## Next steps