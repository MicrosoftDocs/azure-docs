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

## Features

With the Anomaly Detector, you can automatically find anomalies throughout your time series data, or as they occur in real-time. 

|Feature  |Description  |
|---------|---------|
|Detect anomaly status of the latest point in time series.    | The operation will generate a model using points before the latest one, In this method, only history points are used for determine whether the target point is an anomaly. Latest point detecting matches the scenario of real-time monitoring of business metrics.        |
|Find anomalies for the entire series in batch.    | The operation will generate a model using the entire series, each point will be detected with the same model. In this method, points before and after a certain point will be used to determine whether it's an anomaly. The entire detection can give user an overall status of the time series.         |
| Visualize the range of normal values for your data | Visualize your data, including expected values and anomaly boundaries. |
| Adjust the sensitivity of anomaly detection for better results. | Increase or decrease the sensitivity of the |
Anomaly Finder provides two APIs for two scenarios: batch and streaming modes.
 
* If you would like to detect anomalies for a *batch* of data points over a given time range and get a response in one single API call, use batch API: **'/timeseries/entire/detect'**. It is commonly used in interactive mode, e.g., you are doing ad-hoc data analysis for time series data like DAU and want to understand if the data is out of historical pattern.

* If you would like to continuously detect anomalies on streaming data, use streaming API: **'/timeseries/last/detect'**. This API is commonly used for monitoring scenarios and alerting users on real time anomalies in time series data.

You can build following with this API:

* Learn to predict the expected values based on historical data in the time series
* Detect whether a data point is an anomaly out of historical pattern
* Generate a band to visualize the range of "normal" values

![Anomaly_Finder](./media/anomaly_detection1.png) 

Fig. 1: Detect anomalies in sales revenues

![Anomaly_Finder](./media/anomaly_detection2.png)

Fig. 2: Detect pattern changes in service requests

## Requirements

The following preparation is required for your data.

- Minimum data for input time series: Minimum of 13 data points for time series without clear periodicity, minimum of four cycles of data points for the time series with known periodicity.
- Data integrity: time series data points are separated in the same interval and no missing points.

## Identify anomalies

Using [Anomaly Finder API](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-entire-detect), you can select the most appropriate method to match your scenario. The detection model returns anomaly results along with expectedValue, upperMargin and lowerMargin. ExpectedValue, UpperMargin and LowerMargin can be used to generate a band around actual time series to visualize the range of normal values in the client's side. Any values out of the boundary are detected aas anomalies. 

## Adjusting lower and upper bounds in post processing on the response

Anomaly Finder API returns default results on whether a data point is anomaly or not, and the upper and lower bound can be calculated from ExpectedValue and UpperMargin/LowerMargin. Default values work fine for most cases. However, some scenarios require different bounds than the default ones. The recommend practice is applying a MarginScale on the UpperMargin or LowerMargin to adjust the dynamic bounds. UpperBoundary equals to ExpectedValue + (100 - MarginScale)\*UpperMargin, lowerBoundary equals to ExpectedValue - (100 - MarginScale)\*LowerMargin

### Examples with 99/95/85 as sensitivity

![Default Sensitivity](./media/sensitivity_99.png)

![99 Sensitivity](./media/sensitivity_95.png)

![85 Sensitivity](./media/sensitivity_85.png)

Request with sample data

[Sample Request](./includes/request.md)

Sample JSON response

[Sample Response](./includes/response.md)

## How to use the APIs to do continuous monitoring 

Anomaly finder APIs is a stateless services. To enable contious monitoring on streaming data, for example, in the following scenario, your have KPIs such as "Daily active users" to monitor, you have to post to the API endpoint a window of time series of DAU and get a response on whether the latest point is an anomaly or not. When a new data point is available, you complete the API post again with a moving window of time series to get the response. When this process is repeated every time a new data point is available to detect, continous monitoring is achieved on streaming data.

This applies not only to daily time series like DAU, but also to time series with hourly or minute level intervals.
