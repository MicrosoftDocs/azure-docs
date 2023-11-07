---
title: Streaming inference with trained model
titleSuffix: Azure AI services
description: Streaming inference with trained model
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: how-to
ms.date: 11/01/2022
ms.author: mbullwin
---

# Streaming inference with trained model

[!INCLUDE [Deprecation announcement](../includes/deprecation.md)]

You could choose the batch inference API, or the streaming inference API for detection.

| Batch inference API | Streaming inference API           |
| ------------- | ---------------- |
| More suitable for batch use cases when customers don’t need to get inference results immediately and want to detect anomalies and get results over a longer time period.| When customers want to get inference immediately and want to detect multivariate anomalies in real-time, this API is recommended. Also suitable for customers having difficulties conducting the previous compressing and uploading process for inference. |

|API Name| Method | Path  | Description |
| ------ | ---- | ----------- | ------ | 
|**Batch Inference**|    POST    |  `{endpoint}`/anomalydetector/v1.1/multivariate/models/`{modelId}`: detect-batch    |          Trigger an asynchronous inference with `modelId` which works in a batch scenario   |
|**Get Batch Inference Results**|     GET   |  `{endpoint}`/anomalydetector/v1.1/multivariate/detect-batch/`{resultId}`    |       Get batch inference results with `resultId`      |
|**Streaming Inference**|   POST     |   `{endpoint}`/anomalydetector/v1.1/multivariate/models/`{modelId}`: detect-last   |      Trigger a synchronous inference with `modelId`, which works in a streaming scenario       |

## Trigger a streaming inference API

### Request

With the synchronous API, you can get inference results point by point in real time, and no need for compressing and uploading task like for training and asynchronous inference. Here are some requirements for the synchronous API:
* You need to put data in **JSON format** into the API request body.
* Due to payload limitation, the size of inference data in the request body is limited, which support at most `2880` timestamps * `300` variables, and at least `1 sliding window length`.

You can submit a bunch of timestamps of multiple variables in JSON format in the request body, with an API call like this:

**{{endpoint}}/anomalydetector/v1.1/multivariate/models/{modelId}:detect-last**

A sample request:

```json
{
  "variables": [
    {
      "variable": "Variable_1",
      "timestamps": [
        "2021-01-01T00:00:00Z",
        "2021-01-01T00:01:00Z",
        "2021-01-01T00:02:00Z"
        //more timestamps
      ],
      "values": [
        0.4551378545933972,
        0.7388603950488748,
        0.201088255984052
        //more values
      ]
    },
    {
      "variable": "Variable_2",
      "timestamps": [
        "2021-01-01T00:00:00Z",
        "2021-01-01T00:01:00Z",
        "2021-01-01T00:02:00Z"
        //more timestamps
      ],
      "values": [
        0.9617871613964145,
        0.24903311574778408,
        0.4920561254118613
        //more values
      ]
    },
    {
      "variable": "Variable_3",
      "timestamps": [
        "2021-01-01T00:00:00Z",
        "2021-01-01T00:01:00Z",
        "2021-01-01T00:02:00Z"
        //more timestamps       
      ],
      "values": [
        0.4030756879437628,
        0.15526889968448554,
        0.36352226408981103
        //more values      
      ]
    }
  ],
  "topContributorCount": 2
}
```

#### Required parameters

* **variableName**: This name should be exactly the same as in your training data.
* **timestamps**: The length of the timestamps should be equal to **1 sliding window**, since every streaming inference call will use 1 sliding window to detect the last point in the sliding window.
* **values**: The values of each variable in every timestamp that was inputted above.

#### Optional parameters

* **topContributorCount**: This is a number that you could specify N from **1 to 30**, which will give you the details of top N contributed variables in the anomaly results. For example, if you have 100 variables in the model, but you only care the top five contributed variables in detection results, then you should fill this field with 5. The default number is **10**.

### Response

A sample response:

```json
{
    "variableStates": [
        {
            "variable": "series_0",
            "filledNARatio": 0.0,
            "effectiveCount": 1,
            "firstTimestamp": "2021-01-03T01:59:00Z",
            "lastTimestamp": "2021-01-03T01:59:00Z"
        },
        {
            "variable": "series_1",
            "filledNARatio": 0.0,
            "effectiveCount": 1,
            "firstTimestamp": "2021-01-03T01:59:00Z",
            "lastTimestamp": "2021-01-03T01:59:00Z"
        },
        {
            "variable": "series_2",
            "filledNARatio": 0.0,
            "effectiveCount": 1,
            "firstTimestamp": "2021-01-03T01:59:00Z",
            "lastTimestamp": "2021-01-03T01:59:00Z"
        },
        {
            "variable": "series_3",
            "filledNARatio": 0.0,
            "effectiveCount": 1,
            "firstTimestamp": "2021-01-03T01:59:00Z",
            "lastTimestamp": "2021-01-03T01:59:00Z"
        },
        {
            "variable": "series_4",
            "filledNARatio": 0.0,
            "effectiveCount": 1,
            "firstTimestamp": "2021-01-03T01:59:00Z",
            "lastTimestamp": "2021-01-03T01:59:00Z"
        }
    ],
    "results": [
        {
            "timestamp": "2021-01-03T01:59:00Z",
            "value": {
                "isAnomaly": false,
                "severity": 0.0,
                "score": 0.2675322890281677,
                "interpretation": []
            },
            "errors": []
        }
    ]
}
```

The response contains the result status, variable information, inference parameters, and inference results.

* **variableStates**: This lists the information of each variable in the inference request.
* **setupInfo**: This is the request body submitted for this inference.
* **results**: This contains the detection results. There are three typical types of detection results.

* **isAnomaly**: `false` indicates the current timestamp isn't an anomaly.`true` indicates an anomaly at the current timestamp.
    * `severity` indicates the relative severity of the anomaly and for abnormal data it's always greater than 0.
    * `score` is the raw output of the model on which the model makes a decision. `severity` is a derived value from `score`. Every data point has a `score`.

* **interpretation**: This field only appears when a timestamp is detected as anomalous, which contains `variables`, `contributionScore`, `correlationChanges`.

* **contributors**: This is a list containing the contribution score of each variable. Higher contribution scores indicate higher possibility of the root cause. This list is often used for interpreting anomalies and diagnosing the root causes.

* **correlationChanges**: This field only appears when a timestamp is detected as anomalous, which is included in interpretation. It contains `changedVariables` and `changedValues` that interpret which correlations between variables changed.

* **changedVariables**: This field will show which variables that have significant change in correlation with `variable`. The variables in this list are ranked by the extent of correlation changes.

> [!NOTE]
> A common pitfall is taking all data points with `isAnomaly`=`true` as anomalies. That may end up with too many false positives.
> You should use both `isAnomaly` and `severity` (or `score`) to sift out anomalies that are not severe and (optionally) use grouping to check the duration of the anomalies to suppress random noise.
> Please refer to the [FAQ](../concepts/best-practices-multivariate.md#faq) in the best practices document for the difference between `severity` and `score`.

## Next steps

* [Multivariate Anomaly Detection reference architecture](../concepts/multivariate-architecture.md)
* [Best practices of multivariate anomaly detection](../concepts/best-practices-multivariate.md)
