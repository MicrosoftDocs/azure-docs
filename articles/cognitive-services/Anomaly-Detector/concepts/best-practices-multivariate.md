---
title: Best practices for using the Anomaly Detector Multivariate API
titleSuffix: Azure Cognitive Services
description: Best practices for using the Anomaly Detector Multivariate API's to apply anomaly detection to your time series data.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: conceptual
ms.date: 04/01/2021
ms.author: mbullwin
keywords: anomaly detection, machine learning, algorithms
---

# Multivariate time series Anomaly Detector best practices

This article will provide guidance around recommended practices to follow when using the multivariate Anomaly Detector (MVAD) APIs. 
In this tutorial, you'll:

> [!div class="checklist"]
> * **API usage**: Learn how to use MVAD without errors.
> * **Data engineering**: Learn how to best cook your data so that MVAD performs with better accuracy.
> * **Common pitfalls**: Learn how to avoid common pitfalls that customers meet.
> * **FAQ**: Learn answers to frequently asked questions

## API usage

Follow the instructions in this section to avoid errors while using MVAD. If you still get errors, please refer to the [full list of error codes](../concepts/troubleshoot) for explanations and actions to take.

[!INCLUDE [mvad-data-schema](../includes/mvad-data-schema.md)]

[!INCLUDE [mvad-input-params](../includes/mvad-data-schema.md)]

## Data engineering

Now you're able to run the your code with MVAD APIs without any error. What could be done to improve your model accuracy?

### Data quality

* As the model learns normal patterns from historical data, the training data should **represent the overall normal state of the system**. It is hard for the model to learn these types of patterns if the training data is full of anomalies. An empirical abnormal rate is **1%** and below which may result in good accuracy of the model.
* The model has millions of parameters and it needs a minimum number of data points to learn an optimal set of parameters. The empirical rule is that you need to provide **15,000 or more data points (timestamps) per variable** to train the model so that it results in good accuracy. In general, the more the training data, the better the accuracy. However, in cases when you're not able to accrue that much data for various reasons, we still encourage you to experiment with less data and see if the compromised accuracy is still acceptable.
* In general, the **missing value ratio of training data should be under 20%**. Too much missing data may end up with automatically filled values (usually straight segments or constant values) being learnt as normal patterns. That may result in real data points being detected as anomalies.
    However, there are cases when a high ratio is acceptable. For example, if you have two time series in a group using `Outer` mode to align timestamps. One has one-minute granularity, the other one has hourly granularity. Then the hourly time series by nature has at least 59 / 60 = 98.33% missing data points. In such cases, it's fine to fill the hourly time series using the only value available if it does not fluctuate too much typically.

### Timestamp round-up

Because each variable may be collected from an independent source, the timestamps of different variables may be inconsistent with each other. Here is a simple example.

*Variable-1*

| timestamp | value |
| --------- | ----- |
| 12:00:01  | 1.0   |
| 12:00:35  | 1.5   |
| 12:01:02  | 0.9   |
| 12:01:31  | 2.2   |
| 12:02:08  | 1.3   |

*Variable-2*

| timestamp | value |
| --------- | ----- |
| 12:00:03  | 2.2   |
| 12:00:37  | 2.6   |
| 12:01:09  | 1.4   |
| 12:01:34  | 1.7   |
| 12:02:04  | 2.0   |

We have two series collected from two sensors which send one data point every 30 seconds. However, the sensors are not sending data points at a strict frequency, but sometimes earlier and sometimes later. Because MVAD will take into consideration correlations among different values, timestamps must be properly aligned so that the metrics can correctly reflect the condition of the system. In this example, timestamps of variable 1 and variable 2 must be properly 'rounded' before alignment.

Let's see what happens if they're not pre-processed. If we set `alignMode` to be `Outer` (which means union of two sets), the merged table will be

| timestamp | Variable-1 | Variable-2 |
| --------- | -------- | -------- |
| 12:00:01  | 1.0      | `nan`    |
| 12:00:03  | `nan`    | 2.2      |
| 12:00:35  | 1.5      | `nan`    |
| 12:00:37  | `nan`    | 2.6      |
| 12:01:02  | 0.9      | `nan`    |
| 12:01:09  | `nan`    | 1.4      |
| 12:01:31  | 2.2      | `nan`    |
| 12:01:34  | `nan`    | 1.7      |
| 12:02:04  | `nan`    | 2.0      |
| 12:02:08  | 1.3      | `nan`    |

`nan` means missing values. Obviously, the merged table is not the same as expected because variable 1 and variable 2 interleaves and the MVAD model cannot extract information about correlations of multiple series. If we set `alignMode` to `Inner`, the merged table will be empty as there is no common timestamp in variable 1 and variable 2.

Therefore, the timestamps of variable 1 and variable 2 should be pre-processed (rounded to the nearest 30-second timestamps) and the new time series are

*Variable-1*

| timestamp | value |
| --------- | ----- |
| 12:00:00  | 1.0   |
| 12:00:30  | 1.5   |
| 12:01:00  | 0.9   |
| 12:01:30  | 2.2   |
| 12:02:00  | 1.3   |

*Variable-2*

| timestamp | value |
| --------- | ----- |
| 12:00:00  | 2.2   |
| 12:00:30  | 2.6   |
| 12:01:00  | 1.4   |
| 12:01:30  | 1.7   |
| 12:02:00  | 2.0   |

Now the merged table is more reasonable.

| timestamp | Variable-1 | Variable-2 |
| --------- | -------- | -------- |
| 12:00:00  | 1.0      | 2.2      |
| 12:00:30  | 1.5      | 2.6      |
| 12:01:00  | 0.9      | 1.4      |
| 12:01:30  | 2.2      | 1.7      |
| 12:02:00  | 1.3      | 2.0      |

Signal values of close timestamps are well aligned and the MVAD model can now extract correlation information.

## Common pitfalls

Apart from what's listed in the [error code table](../concepts/troubleshoot), we've learnt from customers like you some common pitfalls while using MVAD APIs. This table will help you dodge them in your practice.

| Pitfall | Consequence |Explanation and solution |
| --------- | ----- | ----- |
| Timestamps in training data and/or inference data were not rounded up to align with your data frequency. | The timestamps of the inference results are not as expected: either too few timestamps or too many timestamps.  | Please refer to [Timestamp round-up](#timestamp-round-up).  |
| Too many anomalous data points in the training data | Model accuracy is impacted negatively because the treats anomalous data points as normal patterns during training. | Empirically, keep the abnormal rate at or below **1%** will help. |
| Too little training data | Model accuracy is compromised. | Empirically, training a MVAD model requires 15,000 or more data points (timestamps) per variable to keep a good accuracy.|
| Taking all data points with `isAnomaly`=`true` as anomalies | Too many false positives | You should use both `isAnomaly` and `severity` (or `score`) to sift out anomalies that are not severe and (optionally) use grouping to check the duration of the anomalies to suppress random noises. Please refer to the [FAQ](#faq) section below for the difference between `severity` and `score`.  |

## FAQ

### How does MVAD sliding window work?

An MVAD model takes a segment of variables and decides whether an anomaly has occurred at the last timestamp. For example, the input segment is from `2021-01-01T00:00:00Z` to `2021-01-01T23:59:00Z` (inclusive), the MVAD model will decide whether an anomaly has occurred at `2021-01-02T00:00:00Z`. The length of input segment is computed from the `slidingWindow` parameter whose minimum value is 28 and maximum value is 2,880. In the above case, `slidingWindow` is 1440 (60 * 24) if it has minutely granularity.

Inference is performed in a streaming manner. For example, the inference data is from `2021-01-01T00:00:00Z` to `2021-01-08T00:00:00Z` with minutely granularity and `slidingWindow` is set to 1,440 (60 * 24). The MVAD model takes data from `2021-01-01T00:00:00Z` to `2021-01-01T23:59:00Z` as input (length is 1,440) and determines whether an anomaly has occurred at `2021-01-02T00:00:00Z`. Then it takes data from `2021-01-01T00:01:00Z` to `2021-01-02T00:00:00Z`  (length is 1,440) and outputs the result at `2021-01-02T00:01:00Z`. It moves forward in the same manner until the last timestamp.

### Why only accepting zip files for training and inference?

We use zip files because on batch scenarios, we expect that the size of both training and inference data would be very large and cannot be put in the HTTP request body. This allows users to perform batch inference on historical data either for model validation or data analysis. However, this might be somewhat inconvenient for streaming inference and for high frequency data. We have a plan to add a new API specifically designed for streaming inference that users can pass data in the request body.

### What's the difference between `severity` and `score`?

Normally we recommend you use  `severity` as the filter to sift out 'anomalies' that are not so important to your business. Depending on your scenario and data pattern, those anomalies that are less important often have relatively lower `severity` values or standalone (discontinuous) high `severity` values - random spikes.

In cases where you've found a need of more sophisticated rules than thresholds against `severity` or duration of continuous high `severity` values, you may want to use `score` to build more powerful filters. Understanding how MVAD is using `score` to determine anomalies may help:

We consider whether a data point is anomalous from both global and local perspective. If `score` at a timestamp is higher than a certain threshold, then the timestamp is marked as an anomaly. If `score` is lower than the threshold but is relatively higher in a segment, it is also marked as an anomaly.

## Next steps

* [Quickstarts: Use the Anomaly Detector multivariate client library](../quickstarts/client-libraries-multivariate.md).
* [Learn about the underlying algorithms that power Anomaly Detector Multivariate](https://arxiv.org/abs/2009.02040)
