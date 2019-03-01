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

Anomaly Finder enables you to monitor data over time and detect anomalies with machine learning. Anomaly Finder adapts to your unique data by automatically applying the right statistical model regardless of industry, scenario, or data volume. Use a time series as input, the Anomaly Finder API returns whether a data point is an anomaly, determines the expected value, and upper and lower bounds for visualization.

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

## Demo

To quickly see how the API works, this [Anomaly Detector demo](https://notebooks.azure.com/AzureAnomalyDetection/projects/anomalyfinder) will run in a web-hosted Jupyter notebook and show you how to send an API request, and visualize the result.

To run the demo, complete the following steps:
  
1.	Sign in, and click **Clone**, in the upper right corner.
3.	click **Run on free compute**
4.	Open one of the notebook, for example, Anomaly Finder API Example Private Preview (Batch Method).ipynb
5.	Fill in the key in cell containing:  subscription_key = '' #Here you have to paste your primary key. You can get the key by creating a [Cognitive Services account](../cognitive-services-apis-create-account.md). following the instructions on [obtaining a subscription key](How-to/get-subscription-key.md)
6.	In the Notebook main menu, Cell->run all

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
