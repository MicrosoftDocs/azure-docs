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

This article will provide guidance around recommended practices to follow when using the multivariate Anomaly Detector APIs.

## How to prepare data for training

To use the Anomaly Detector multivariate APIs, we need to train our own model before using detection. Data used for training is a batch of time series, each time series should be in CSV format with two columns, timestamp and value. All of the time series should be zipped into one zip file and uploaded to Azure Blob storage. By default the file name will be used to represent the variable for the time series. Alternatively, an extra meta.json file can be included in the zip file if you wish the name of the variable to be different from the .zip file name. Once we generate a [blob SAS (Shared access signatures) URL](../../../storage/common/storage-sas-overview.md), we can use it for training.

## Data quality and quantity

The Anomaly Detector multivariate API uses state-of-the-art deep neural networks to learn normal patterns from historical data and predicts whether future values are anomalies. The quality and quantity of training data is important to train an optimal model. As the model learns normal patterns from historical data, the training data should represent the overall normal state of the system. It is hard for the model to learn these types of patterns if the training data is full of anomalies. Also, the model has millions of parameters and it needs a minimum number of data points to learn an optimal set of parameters. The general rule is that you need to provide at least 15,000 data points per variable to properly train the model. The more data, the better the model.

It is common that many time series have missing values, which may affect the performance of trained models. The missing ratio of each time series should be controlled under a reasonable value. A time series having 90% values missing provides little information about normal patterns of the system. Even worse, the model may consider filled values as normal patterns, which are usually straight segments or constant values. When new data flows in, the data might be detected as anomalies.

A recommended max missing value threshold is 20%, but a higher threshold might be acceptable under some circumstances. For example, if you have a time series with one-minute granularity and another time series with hourly granularity.  Each hour there are 60 data points per minute of data and 1 data point for hourly data, which means that the missing ratio for hourly data is 98.33%. However, it is fine to fill the hourly data with the only value if the hourly time series does not typically fluctuate too much.

## Parameters

### Sliding window

Multivariate anomaly detection takes a segment of data points of length `slidingWindow` as input and decides if the next data point is an anomaly. The larger the sample length, the more data will be considered for a decision. You should keep two things in mind when choosing a proper value for `slidingWindow`: properties of input data, and the trade-off between training/inference time and potential performance improvement. `slidingWindow` consists of an integer between 28 and 2880. You may decide how many data points are used as inputs based on whether your data is periodic, and the sampling rate for your data.

When your data is periodic, you may include 1 - 3 cycles as an input and when your data is sampled at a high frequency (small granularity) like minute-level or second-level data, you may select more data as an input. Another issue is that longer inputs may cause longer training/inference time, and there is no guarantee that more input points will lead to performance gains. Whereas too few data points, may make the model difficult to converge to an optimal solution. For example, it is hard to detect anomalies when the input data only has two points.

### Align mode

The parameter `alignMode` is used to indicate how you want to align multiple time series on time stamps. This is because many time series have missing values and we need to align them on the same time stamps before further processing. There are two options for this parameter, `inner join` and `outer join`. `inner join` means we will report detection results on timestamps on which **every time series** has a value, while `outer join` means we will report detection results on time stamps for **any time series** that has a value.  **The `alignMode` will also affect the input sequence of the model**, so choose a suitable `alignMode` for your scenario because the results might be significantly different.

Here we show an example to explain different `alignModel` values.

#### Series1

|timestamp | value|
----------| -----|
|`2020-11-01`| 1  
|`2020-11-02`| 2  
|`2020-11-04`| 4  
|`2020-11-05`| 5

#### Series2

timestamp | value  
--------- | -
`2020-11-01`| 1  
`2020-11-02`| 2  
`2020-11-03`| 3  
`2020-11-04`| 4

#### Inner join two series
  
timestamp | Series1 | Series2
----------| - | -
`2020-11-01`| 1 | 1
`2020-11-02`| 2 | 2
`2020-11-04`| 4 | 4

#### Outer join two series

timestamp | series1 | series2
--------- | - | -
`2020-11-01`| 1 | 1
`2020-11-02`| 2 | 2
`2020-11-03`| NA | 3
`2020-11-04`| 4 | 4
`2020-11-05`| 5 | NA

### Fill not available (NA)

After variables are aligned on timestamp by outer join, there might be some `Not Available` (`NA`) value in some of the variables. You can specify method to fill this NA value. The options for the `fillNAMethod` are `Linear`, `Previous`, `Subsequent`,  `Zero`, and `Fixed`.

| Option     | Method                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------|
| Linear     | Fill NA values by linear interpolation                                                           |
| Previous   | Propagate last valid value to fill gaps. Example: `[1, 2, nan, 3, nan, 4]` -> `[1, 2, 2, 3, 3, 4]` |
| Subsequent | Use next valid value to fill gaps. Example: `[1, 2, nan, 3, nan, 4]` -> `[1, 2, 3, 3, 4, 4]`       |
| Zero       | Fill NA values with 0.                                                                           |
| Fixed      | Fill NA values with a specified valid value that should be provided in `paddingValue`.          |

## Model analysis

### Training latency

Multivariate Anomaly Detection training can be time-consuming. Especially when you have a large quantity of timestamps used for training. Therefore, we allow part of the training process to be asynchronous. Typically, users submit train task through Train Model API. Then get model status through the `Get Multivariate Model API`. Here we demonstrate how to extract the remaining time before training completes. In the Get Multivariate Model API response, there is an item named `diagnosticsInfo`. In this item, there is a `modelState` element. To calculate the remaining time, we need to use `epochIds` and `latenciesInSeconds`. An epoch represents one complete cycle through the training data. Every 10 epochs, we will output status information. In total, we will train for 100 epochs, the latency indicates how long an epoch takes. With this information, we know remaining time left to train the model.

### Model performance

Multivariate Anomaly Detection, as an unsupervised model. The best way to evaluate it is to check the anomaly results manually. In the Get Multivariate Model response, we provide some basic info for us to analyze model performance. In the `modelState` element returned by the Get Multivariate Model API, we can use `trainLosses` and `validationLosses` to evaluate whether the model has been trained as expected. In most cases, the two losses will decrease gradually. Another piece of information for us to analyze model performance against is in `variableStates`. The variables state list is ranked by `filledNARatio` in descending order. The larger the worse our performance, usually we need to reduce this `NA ratio` as much as possible. `NA` could be caused by missing values or unaligned variables from a timestamp perspective.

## Next steps

- [Quickstarts](../quickstarts/client-libraries-multivariate.md).
- [Learn about the underlying algorithms that power Anomaly Detector Multivariate](https://arxiv.org/abs/2009.02040)