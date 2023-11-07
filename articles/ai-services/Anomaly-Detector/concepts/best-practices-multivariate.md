---
title: Best practices for using the Multivariate Anomaly Detector API
titleSuffix: Azure AI services
description: Best practices for using the Anomaly Detector Multivariate API's to apply anomaly detection to your time series data.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: best-practice
ms.date: 06/07/2022
ms.custom: cogserv-non-critical-anomaly-detector
ms.author: mbullwin
keywords: anomaly detection, machine learning, algorithms
---

# Best practices for using the Multivariate Anomaly Detector API

[!INCLUDE [Deprecation announcement](../includes/deprecation.md)]

This article provides guidance around recommended practices to follow when using the multivariate Anomaly Detector (MVAD) APIs. 
In this tutorial, you'll:

> [!div class="checklist"]
> * **API usage**: Learn how to use MVAD without errors.
> * **Data engineering**: Learn how to best cook your data so that MVAD performs with better accuracy.
> * **Common pitfalls**: Learn how to avoid common pitfalls that customers meet.
> * **FAQ**: Learn answers to frequently asked questions.

## API usage

Follow the instructions in this section to avoid errors while using MVAD. If you still get errors, refer to the [full list of error codes](./troubleshoot.md) for explanations and actions to take.

[!INCLUDE [mvad-input-params](../includes/mvad-input-params.md)]

[!INCLUDE [mvad-data-schema](../includes/mvad-data-schema.md)]


## Data engineering

Now you're able to run your code with MVAD APIs without any error. What could be done to improve your model accuracy?

### Data quality

* As the model learns normal patterns from historical data, the training data should represent the **overall normal** state of the system. It's hard for the model to learn these types of patterns if the training data is full of anomalies. An empirical threshold of abnormal rate is **1%** and below for good accuracy.
* In general, the **missing value ratio of training data should be under 20%**. Too much missing data may end up with automatically filled values (usually linear values or constant values) being learned as normal patterns. That may result in real (not missing) data points being detected as anomalies.


### Data quantity

* The underlying model of MVAD has millions of parameters. It needs a minimum number of data points to learn an optimal set of parameters. The empirical rule is that you need to provide **5,000 or more data points (timestamps) per variable** to train the model for good accuracy. In general, the more the training data, better the accuracy. However, in cases when you're not able to accrue that much data, we still encourage you to experiment with less data and see if the compromised accuracy is still acceptable.
* Every time when you call the inference API, you need to ensure that the source data file contains just enough data points. That is normally `slidingWindow` + number of data points that **really** need inference results. For example, in a streaming case when every time you want to inference on **ONE** new timestamp, the data file could contain only the leading `slidingWindow` plus **ONE** data point; then you could move on and create another zip file with the same number of data points (`slidingWindow` + 1) but moving ONE step to the "right" side and submit for another inference job. 

    Anything beyond that or "before" the leading sliding window won't impact the inference result at all and may only cause performance downgrade. Anything below that may lead to an `NotEnoughInput` error.


### Timestamp round-up

In a group of variables (time series), each variable may be collected from an independent source. The timestamps of different variables may be inconsistent with each other and with the known frequencies. Here's a simple example.

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

We have two variables collected from two sensors which send one data point every 30 seconds. However, the sensors aren't sending data points at a strict even frequency, but sometimes earlier and sometimes later. Because MVAD takes into consideration correlations between different variables, timestamps must be properly aligned so that the metrics can correctly reflect the condition of the system. In the above example, timestamps of variable 1 and variable 2 must be properly 'rounded' to their frequency before alignment.

Let's see what happens if they're not pre-processed. If we set `alignMode` to be `Outer` (which means union of two sets), the merged table is:

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

`nan` indicates missing values. Obviously, the merged table isn't what you might have expected. Variable 1 and variable 2 interleave, and the MVAD model can't extract information about correlations between them. If we set `alignMode` to `Inner`, the merged table is empty as there's no common timestamp in variable 1 and variable 2.

Therefore, the timestamps of variable 1 and variable 2 should be pre-processed (rounded to the nearest 30-second timestamps) and the new time series are:

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

Values of different variables at close timestamps are well aligned, and the MVAD model can now extract correlation information.

### Limitations

There are some limitations in both the training and inference APIs, you should be aware of these limitations to avoid errors.

#### General Limitations
* Sliding window: 28-2880 timestamps, default is 300. For periodic data, set the length of 2-4 cycles as the sliding window. 
* Variable numbers: For training and batch inference, at most 301 variables.
#### Training Limitations
* Timestamps: At most 1000000. Too few timestamps may decrease model quality. Recommend having more than 5,000 timestamps.
* Granularity: The minimum granularity is `per_second`.

#### Batch inference limitations
* Timestamps: At most 20000, at least 1 sliding window length.
#### Streaming inference limitations
* Timestamps: At most 2880, at least 1 sliding window length.
* Detecting timestamps: From 1 to 10.

## Model quality

### How to deal with false positive and false negative in real scenarios?
We have provided severity that indicates the significance of anomalies. False positives may be filtered out by setting up a threshold on the severity. Sometimes too many false positives may appear when there are pattern shifts in the inference data. In such cases a model may need to be retrained on new data. If the training data contains too many anomalies, there could be false negatives in the detection results. This is because the model learns patterns from the training data and anomalies may bring bias to the model. Thus proper data cleaning may help reduce false negatives.
 
### How to estimate which model is best to use according to training loss and validation loss?
Generally speaking, it's hard to decide which model is the best without a labeled dataset. However, we can leverage the training and validation losses to have a rough estimation and discard those bad models. First, we need to observe whether training losses converge. Divergent losses often indicate poor quality of the model. Second, loss values may help identify whether underfitting or overfitting occurs. Models that are underfitting or overfitting may not have desired performance. Third, although the definition of the loss function doesn't reflect the detection performance directly, loss values may be an auxiliary tool to estimate model quality. Low loss value is a necessary condition for a good model, thus we may discard models with high loss values.


## Common pitfalls

Apart from the [error code table](./troubleshoot.md), we've learned from customers like you some common pitfalls while using MVAD APIs. This table will help you to avoid these issues.

| Pitfall | Consequence |Explanation and solution |
| --------- | ----- | ----- |
| Timestamps in training data and/or inference data weren't rounded up to align with the respective data frequency of each variable. | The timestamps of the inference results aren't as expected: either too few timestamps or too many timestamps.  | Please refer to [Timestamp round-up](#timestamp-round-up).  |
| Too many anomalous data points in the training data | Model accuracy is impacted negatively because it treats anomalous data points as normal patterns during training. | Empirically, keep the abnormal rate at or below **1%** will help. |
| Too little training data | Model accuracy is compromised. | Empirically, training a MVAD model requires 15,000 or more data points (timestamps) per variable to keep a good accuracy.|
| Taking all data points with `isAnomaly`=`true` as anomalies | Too many false positives | You should use both `isAnomaly` and `severity` (or `score`) to sift out anomalies that aren't severe and (optionally) use grouping to check the duration of the anomalies to suppress random noises. Please refer to the [FAQ](#faq) section below for the difference between `severity` and `score`.  |
| Sub-folders are zipped into the data file for training or inference. | The csv data files inside sub-folders are ignored during training and/or inference. | No sub-folders are allowed in the zip file. Please refer to [Folder structure](#folder-structure) for details. |
| Too much data in the inference data file: for example, compressing all historical data in the inference data zip file | You may not see any errors but you'll experience degraded performance when you try to upload the zip file to Azure Blob as well as when you try to run inference. | Please refer to [Data quantity](#data-quantity) for details. |
| Creating Anomaly Detector resources on Azure regions that don't support MVAD yet and calling MVAD APIs  | You'll get a "resource not found" error while calling the MVAD APIs. | During preview stage, MVAD is available on limited regions only. Please bookmark [What's new in Anomaly Detector](../whats-new.md)  to keep up to date with MVAD region roll-outs. You could also file a GitHub issue or contact us at AnomalyDetector@microsoft.com to request for specific regions. |

## FAQ

### How does MVAD sliding window work?

Let's use two examples to learn how MVAD's sliding window works. Suppose you have set `slidingWindow` = 1,440, and your input data is at one-minute granularity.

* **Streaming scenario**: You want to predict whether the ONE data point at "2021-01-02T00:00:00Z" is anomalous. Your `startTime` and `endTime` will be the same value ("2021-01-02T00:00:00Z"). Your inference data source, however, must contain at least 1,440 + 1 timestamps. Because MVAD will take the leading data before the target data point ("2021-01-02T00:00:00Z") to decide whether the target is an anomaly. The length of the needed leading data is `slidingWindow` or 1,440 in this case. 1,440 = 60 * 24, so your input data must start from at latest "2021-01-01T00:00:00Z".

* **Batch scenario**: You have multiple target data points to predict. Your `endTime` will be greater than your `startTime`. Inference in such scenarios is performed in a "moving window" manner. For example, MVAD will use data from `2021-01-01T00:00:00Z` to `2021-01-01T23:59:00Z` (inclusive) to determine whether data at `2021-01-02T00:00:00Z` is anomalous. Then it moves forward and uses data from `2021-01-01T00:01:00Z` to `2021-01-02T00:00:00Z` (inclusive)
to determine whether data at `2021-01-02T00:01:00Z` is anomalous. It moves on in the same manner (taking 1,440 data points to compare) until the last timestamp specified by `endTime` (or the actual latest timestamp). Therefore, your inference data source must contain data starting from `startTime` - `slidingWindow` and ideally contains in total of size `slidingWindow` + (`endTime` - `startTime`).

### What's the difference between `severity` and `score`?

Normally we recommend you to use  `severity` as the filter to sift out 'anomalies' that aren't so important to your business. Depending on your scenario and data pattern, those anomalies that are less important often have relatively lower `severity` values or standalone (discontinuous) high `severity` values like random spikes.

In cases where you've found a need of more sophisticated rules than thresholds against `severity` or duration of continuous high `severity` values, you may want to use `score` to build more powerful filters. Understanding how MVAD is using `score` to determine anomalies may help:

We consider whether a data point is anomalous from both global and local perspective. If `score` at a timestamp is higher than a certain threshold, then the timestamp is marked as an anomaly. If `score` is lower than the threshold but is relatively higher in a segment, it's also marked as an anomaly.


## Next steps

* [Quickstarts: Use the Anomaly Detector multivariate client library](../quickstarts/client-libraries-multivariate.md).
* [Learn about the underlying algorithms that power Anomaly Detector Multivariate](https://arxiv.org/abs/2009.02040)
