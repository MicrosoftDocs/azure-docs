---
title: Best practices when using the Anomaly Detector API
description: Learn about best practices when detecting anomalies with the Anomaly Detector API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: article
ms.date: 03/26/2019
ms.author: aahi
---

# Best practices for using the Anomaly Detector API

The Anomaly Detector API is a stateless anomaly detection service. The accuracy and performance of its results can be impacted by:

* How your time series data is prepared.
* The Anomaly Detector API parameters that were used.
* The number of data points in your API request. 

Use this article to learn about best practices for using the API getting the best results for your data. 

## Data preparation

The Anomaly Detector API accepts time series data formatted into a JSON request object. A time series can be any numerical data recorded over time in sequential order. You can send windows of your time series data to the Anomaly Detector API endpoint to improve the API's performance. The minimum number of data points you can send is 12, and the maximum is 8640 points. 

Data points sent to the Anomaly Detector API must have a valid Coordinated Universal Time (UTC) timestamp, and numerical value. 

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

Missing data points are common in evenly distributed time series data sets, especially ones with a fine granularity (A small sampling interval. For example, data sampled every few minutes). Missing less than 10% of the expected number of points in your data shouldn't have a negative impact on your detection results. Consider filling gaps in your data based on its characteristics like substituting data points from an earlier period, linear interpolation, or a moving average.

### Aggregate distributed data

The Anomaly Detector API works best on an evenly distributed time series. If your data is randomly distributed, you should aggregate it by a unit of time, such as Per-minute, hourly, or daily for example.

## Anomaly detection on data with seasonal patterns

If you know that your time series data has a seasonal pattern (one that occurs at regular intervals), you can improve the accuracy and API response time. 

Specifying a `period` when you construct your JSON request can reduce anomaly detection latency by up to 50%. The `period` is an integer that specifies roughly how many data points the time series takes to repeat a pattern. For example, a time series with one data point per day would have a `period` as `7`, and a time series with one point per hour (with the same weekly pattern) would have a `period` of  `7*24`. If you're unsure of your data's patterns, you don't have to specify this parameter.

For best results, provide 4 `period`'s worth of data point, plus an additional one. For example, hourly data with a weekly pattern as described above should provide 673 data points in the request body (`7 * 24 * 4 + 1`).

### Sampling data for real-time monitoring

If your streaming data is sampled at a short interval (for example seconds or minutes), sending the recommended number of data points may exceed the Anomaly Detector API's maximum number allowed (8640 data points). If your data shows a stable seasonal pattern, consider sending a sample of your time series data at a larger time interval, like hours. Sampling your data in this way can also noticeably improve the API response time. 

## Next Steps

* [What is the Anomaly Detector API?](../overview.md)
* [Quickstart: Detect anomalies in your time series data using the Anomaly Detector REST API](../quickstarts/detect-data-anomalies-csharp.md)
