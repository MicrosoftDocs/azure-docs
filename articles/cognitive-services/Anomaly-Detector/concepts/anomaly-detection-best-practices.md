---
title: Best practices when using the Anomaly Detector API 
description: Learn about best practices when detecting anomalies with the Anomaly Detector API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: article
ms.date: 03/01/2019
ms.author: aahi
---

# Best practices for using the Anomaly Detector API

The accuracy and performance of the API's anomaly detection results can be impacted by:

* How your time series data is prepared.
* The Anomaly Detector API parameters that were used.
* The number of data points in your API request. 

To help get the best results for your data, use this article to learn about best practices for using the API in your services and applications. 

## Data preparation

The Anomaly Detector API is a stateless anomaly detection service. It requires users to implement the stateful part to integrate it into a montoring system. 
In Microsoft, we have built a comprehensive monitoring/alerting/diagnostic system based on this service. The following is a summary of some best practices when we use this service. 

## Length of historical data

To use Anomaly Detector API, you must post a windows of time series data to the API endpoint and get a response. The minimum number of data points is 12. Use the following guidelines to optimize your anomaly detection results:

### data with a repetitive pattern

- If you already know your time series data has a repetitive pattern, and roughly repeats itself, for example at every n data point. Specify the "period" when you construct the request body, "period" is an integer n, that after every n data point, the time series roughly repeats itself. For example, a time series tracking daily active usage of an app, normally has a weekly pattern, so set "period" as 7. But if you want to track hourly active usage, it still has a weekly pattern, but set "period" as 7*24. Specifying the "period" value can reduce the latency by up to 50%.

- If you do not know the data pattern in advance, leave it empty and Anomaly Detector detects it automatically but with compute cost.

- If you already know your time series data has a repetitive pattern, and roughly repeats itself at every n data point, provide 4 cycle + 1 worth of data points to achieve best results. For example, hourly data with a weekly pattern, provide 673 data points in the request body (24X7X4+1).

- If you have time series with second level granularity and you know it has hourly / daily / weekly pattern. In this case 4 cycles of data points exceed 8640 data points which is the maximum allowed payload size you can sample the time series by hour to gain higher accuracy and lower latency.

### Prevent data loss

There is always data loss in an evenly distributed time series dataset, especially when the granularity is small, such as 5 minutes or below. If the loss is less than 10%, based on our observation, there is no obvious regression on the detection results. 
For best practice users can choose some gap-filling methods based on the characteristic of time series. 
For example seasonal time series, like metrics relating to human behavior, if users already know the general period, they can use the value of the last period to fill in the gap. If a period cannot be estimated, using linear interpolation is an alternative. 
For non-seasonal time series, using a moving average to fill the gap is a good choice. 

### Perform necessary aggregating
This service is best for an even distributed time series. If users have a time series which is composed of raw event and randomly distributed timestamps, before using this service, performing an aggregation is always the best option. In a real-world monitoring scenario, a minute, hourly, or daily aggregation is good for stable monitoring and latter diagnostics.

### Sample the data 
For seasonal time series of small granularity, if the period is N hours, N days or 1 week, performing a sampling by hour or day before sending them to anomaly detection usually has a big gain in efficiency and little regression on the results.
So it is suggested to always try using sampled seasonal time series first unless it returns a really bad result. One reason for this is a monitorable seasonal time series must have stable characteristics in each part.


