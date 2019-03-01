---
title: How to identify anomalies with the Anomaly Detector API
description: How to identify anomalies with the Anomaly Detector API
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-finder
ms.topic: article
ms.date: 03/01/2019
ms.author: aahi
---

## How to: Identify anomalies

Using [Anomaly Finder API](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyFinderV2/operations/post-timeseries-entire-detect), you can select the most appropriate method to match your scenario. The detection model returns anomaly results along with expectedValue, upperMargin and lowerMargin. ExpectedValue, UpperMargin and LowerMargin can be used to generate a band around actual time series to visualize the range of normal values in the client's side. Any values out of the boundary are detected aas anomalies. 

## Anomaly detection modes


Anomaly Finder provides two APIs for two scenarios: batch and streaming modes.
 
* If you would like to detect anomalies for a *batch* of data points over a given time range and get a response in one single API call, use batch API: **'/timeseries/entire/detect'**. It is commonly used in interactive mode, e.g., you are doing ad-hoc data analysis for time series data like DAU and want to understand if the data is out of historical pattern.

* If you would like to continuously detect anomalies on streaming data, use streaming API: **'/timeseries/last/detect'**. This API is commonly used for monitoring scenarios and alerting users on real time anomalies in time series data.


## Adjusting lower and upper bounds in post processing on the response

Anomaly Finder API returns default results on whether a data point is anomaly or not, and the upper and lower bound can be calculated from ExpectedValue and UpperMargin/LowerMargin. Default values work fine for most cases. However, some scenarios require different bounds than the default ones. The recommend practice is applying a MarginScale on the UpperMargin or LowerMargin to adjust the dynamic bounds. UpperBoundary equals to ExpectedValue + (100 - MarginScale)\*UpperMargin, lowerBoundary equals to ExpectedValue - (100 - MarginScale)\*LowerMargin

### Examples with 99/95/85 as sensitivity

![Default Sensitivity](../media/sensitivity_99.png)

![99 Sensitivity](../media/sensitivity_95.png)

![85 Sensitivity](../media/sensitivity_85.png)

Request with sample data

[Sample Request](../includes/request.md)

Sample JSON response

[Sample Response](../includes/response.md)

## How to use the APIs to do continuous monitoring 

Anomaly finder APIs is a stateless services. To enable contious monitoring on streaming data, for example, in the following scenario, your have KPIs such as "Daily active users" to monitor, you have to post to the API endpoint a window of time series of DAU and get a response on whether the latest point is an anomaly or not. When a new data point is available, you complete the API post again with a moving window of time series to get the response. When this process is repeated every time a new data point is available to detect, continous monitoring is achieved on streaming data.

This applies not only to daily time series like DAU, but also to time series with hourly or minute level intervals.
