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

The Anomaly Detector API is a stateless anomaly detection service. The accuracy and performance of it's results can be impacted by:

* How your time series data is prepared.
* The Anomaly Detector API parameters that were used.
* The number of data points in your API request. 

To help get the best results for your data, use this article to learn about best practices for using the API in your services and applications. 

## Data preparation

The Anomaly Detector API accepts time series data, formatted into a JSON request object. A time series can be any numerical data recorded over time in sequential order.  You must send windows of your time series data to the Anomaly Detector API endpoint. The minimum number of data points you can send is 12, and the maximum is 8640. 

### Format your time series data

[text about API request requirements, and formatting data into JSON]

```json
{
    "granularity": "daily",
    "series": [
      {
        "timestamp": "2018-03-01T00:00:00Z",
        "value": 32858923
      },
      {
        "timestamp": "2018-03-02T00:00:00Z",
        "value": 29615278
      },
    ]
}
```

### Missing data points

Missing data points are common in evenly distributed time series data sets, especially those with a fine granularity (A small sampling interval, for example data sampled every 5 minutes or less). If your data set is missing less than 10% of its expected values, there should be no negative impact on your detection results. Consider filling gaps in your data based on its characteristics. For example, these can include substituting data points from an earlier period, linear interpolation, or a moving average.

### Aggregate distributed data

The Anomaly Detector API works best on an evenly distributed time series. If your data is randomly distributed, you should aggregate it by a unit of time. per-minute, hourly, or daily for example.

## Anomaly detection on data with repetitive patterns

If you know that your time series data repeats a pattern at regular intervals, you can improve the accuracy and time it takes to detect anomalies. 

Specifying a `period` when you construct your JSON request can reduce anomaly detection latency by up to 50%. The `period` is an integer that specifies roughly how many data points the time series takes to repeat itself. For example, a time series with one point per day would have a `period` as `7`, and a time series with one point per hour (with the same weekly pattern) would have a `period` of  `7*24`. If you're unsure of your data's patterns, you don't have to specify this parameter.

For best results, provide 4 `period`'s worth of data point, plus an additional one. For example, hourly data with a weekly pattern as described above should provide 673 data points in the request body (`7 * 24 * 4 + 1`). If this amount of data points exceeds the maximum allowed, consider sending a sample of your time series data at a larger time interval.  

### Sample the data 

For seasonal time series with small granularity, if the period is N hours, N days or 1 week, performing a sampling by hour or day before sending them to anomaly detection usually has a big gain in efficiency and little regression on the results.
So it is suggested to always try using sampled seasonal time series first unless it returns a really bad result. One reason for this is a monitorable seasonal time series must have stable characteristics in each part.
