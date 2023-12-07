---
title: Trigger batch inference with trained model
titleSuffix: Azure AI services
description: Trigger batch inference with trained model
#services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: conceptual
ms.date: 11/01/2022
ms.author: mbullwin
---

# Trigger batch inference with trained model

[!INCLUDE [Deprecation announcement](../includes/deprecation.md)]

You could choose the batch inference API, or the streaming inference API for detection.

| Batch inference API | Streaming inference API           |
| ------------- | ---------------- |
| More suitable for batch use cases when customers don’t need to get inference results immediately and want to detect anomalies and get results over a longer time period.| When customers want to get inference immediately and want to detect multivariate anomalies in real-time, this API is recommended. Also suitable for customers having difficulties conducting the previous compressing and uploading process for inference. |

|API Name| Method | Path  | Description |
| ------ | ---- | ----------- | ------ | 
|**Batch Inference**|    POST    |  `{endpoint}`/anomalydetector/v1.1/multivariate/models/`{modelId}`: detect-batch    |          Trigger an asynchronous inference with `modelId`, which works in a batch scenario   |
|**Get Batch Inference Results**|     GET   |  `{endpoint}`/anomalydetector/v1.1/multivariate/detect-batch/`{resultId}`    |       Get batch inference results with `resultId`      |
|**Streaming Inference**|   POST     |   `{endpoint}`/anomalydetector/v1.1/multivariate/models/`{modelId}`: detect-last   |      Trigger a synchronous inference with `modelId`, which works in a streaming scenario       |

## Trigger a batch inference

To perform batch inference, provide the blob URL containing the inference data, the start time, and end time. For inference data volume, at least `1 sliding window` length and at most **20000** timestamps.

To get better performance, we recommend you send out no more than 150,000 data points per batch inference. *(Data points = Number of variables * Number of timestamps)*

This inference is asynchronous, so the results aren't returned immediately. Notice that you need to save in a variable the link of the results in the **response header** which contains the `resultId`, so that you may know where to get the results afterwards.

Failures are usually caused by model issues or data issues. You can't perform inference if the model isn't ready or the data link is invalid. Make sure that the training data and inference data are consistent, meaning they should be **exactly** the same variables but with different timestamps. More variables, fewer variables, or inference with a different set of variables won't pass the data verification phase and errors will occur. Data verification is deferred so that you'll get error messages only when you query the results.

### Request

A sample request:

```json
{
    "dataSource": "{{dataSource}}", 
    "topContributorCount": 3,
    "startTime": "2021-01-02T12:00:00Z", 
    "endTime": "2021-01-03T00:00:00Z" 
}
```
#### Required parameters

* **dataSource**: This is the Blob URL that linked to your folder or CSV file located in Azure Blob Storage. The schema should be the same as your training data, either OneTable or MultiTable, and the variable number and name should be exactly the same as well.
* **startTime**: The start time of data used for inference. If it's earlier than the actual earliest timestamp in the data, the actual earliest timestamp will be used as the starting point.
* **endTime**: The end time of data used for inference, which must be later than or equal to `startTime`. If `endTime` is later than the actual latest timestamp in the data, the actual latest timestamp will be used as the ending point.

#### Optional parameters

* **topContributorCount**: This is a number that you could specify N from **1 to 30**, which will give you the details of top N contributed variables in the anomaly results. For example, if you have 100 variables in the model, but you only care the top five contributed variables in detection results, then you should fill this field with 5. The default number is **10**.

### Response

A sample response:

```json
{
    "resultId": "aaaaaaaa-5555-1111-85bb-36f8cdfb3365",
    "summary": {
        "status": "CREATED",
        "errors": [],
        "variableStates": [],
        "setupInfo": {
            "dataSource": "https://mvaddataset.blob.core.windows.net/sample-onetable/sample_data_5_3000.csv",
            "topContributorCount": 3,
            "startTime": "2021-01-02T12:00:00Z",
            "endTime": "2021-01-03T00:00:00Z"
        }
    },
    "results": []
}
```
* **resultId**: This is the information that you'll need to trigger **Get Batch Inference Results API**. 
* **status**: This indicates whether you trigger a batch inference task successfully. If you see **CREATED**, then you don't need to trigger this API again, you should use the **Get Batch Inference Results API** to get the detection status and anomaly results.

## Get batch detection results

There's no content in the request body, what's required only is to put the resultId in the API path, which will be in a format of:
**{{endpoint}}anomalydetector/v1.1/multivariate/detect-batch/{{resultId}}**

### Response

A sample response:

```json
{
    "resultId": "aaaaaaaa-5555-1111-85bb-36f8cdfb3365",
    "summary": {
        "status": "READY",
        "errors": [],
        "variableStates": [
            {
                "variable": "series_0",
                "filledNARatio": 0.0,
                "effectiveCount": 721,
                "firstTimestamp": "2021-01-02T12:00:00Z",
                "lastTimestamp": "2021-01-03T00:00:00Z"
            },
            {
                "variable": "series_1",
                "filledNARatio": 0.0,
                "effectiveCount": 721,
                "firstTimestamp": "2021-01-02T12:00:00Z",
                "lastTimestamp": "2021-01-03T00:00:00Z"
            },
            {
                "variable": "series_2",
                "filledNARatio": 0.0,
                "effectiveCount": 721,
                "firstTimestamp": "2021-01-02T12:00:00Z",
                "lastTimestamp": "2021-01-03T00:00:00Z"
            },
            {
                "variable": "series_3",
                "filledNARatio": 0.0,
                "effectiveCount": 721,
                "firstTimestamp": "2021-01-02T12:00:00Z",
                "lastTimestamp": "2021-01-03T00:00:00Z"
            },
            {
                "variable": "series_4",
                "filledNARatio": 0.0,
                "effectiveCount": 721,
                "firstTimestamp": "2021-01-02T12:00:00Z",
                "lastTimestamp": "2021-01-03T00:00:00Z"
            }
        ],
        "setupInfo": {
            "dataSource": "https://mvaddataset.blob.core.windows.net/sample-onetable/sample_data_5_3000.csv",
            "topContributorCount": 3,
            "startTime": "2021-01-02T12:00:00Z",
            "endTime": "2021-01-03T00:00:00Z"
        }
    },
    "results": [
        {
            "timestamp": "2021-01-02T12:00:00Z",
            "value": {
                "isAnomaly": false,
                "severity": 0.0,
                "score": 0.3377174139022827,
                "interpretation": []
            },
            "errors": []
        },
        {
            "timestamp": "2021-01-02T12:01:00Z",
            "value": {
                "isAnomaly": false,
                "severity": 0.0,
                "score": 0.24631972312927247,
                "interpretation": []
            },
            "errors": []
        },
        {
            "timestamp": "2021-01-02T12:02:00Z",
            "value": {
                "isAnomaly": false,
                "severity": 0.0,
                "score": 0.16678125858306886,
                "interpretation": []
            },
            "errors": []
        },
        {
            "timestamp": "2021-01-02T12:03:00Z",
            "value": {
                "isAnomaly": false,
                "severity": 0.0,
                "score": 0.23783254623413086,
                "interpretation": []
            },
            "errors": []
        },
        {
            "timestamp": "2021-01-02T12:04:00Z",
            "value": {
                "isAnomaly": false,
                "severity": 0.0,
                "score": 0.24804904460906982,
                "interpretation": []
            },
            "errors": []
        },
        {
            "timestamp": "2021-01-02T12:05:00Z",
            "value": {
                "isAnomaly": false,
                "severity": 0.0,
                "score": 0.11487171649932862,
                "interpretation": []
            },
            "errors": []
        },
        {
            "timestamp": "2021-01-02T12:06:00Z",
            "value": {
                "isAnomaly": true,
                "severity": 0.32980116622958083,
                "score": 0.5666913509368896,
                "interpretation": [
                    {
                        "variable": "series_2",
                        "contributionScore": 0.4130149677604554,
                        "correlationChanges": {
                            "changedVariables": [
                                "series_0",
                                "series_4",
                                "series_3"
                            ]
                        }
                    },
                    {
                        "variable": "series_3",
                        "contributionScore": 0.2993065960239115,
                        "correlationChanges": {
                            "changedVariables": [
                                "series_0",
                                "series_4",
                                "series_3"
                            ]
                        }
                    },
                    {
                        "variable": "series_1",
                        "contributionScore": 0.287678436215633,
                        "correlationChanges": {
                            "changedVariables": [
                                "series_0",
                                "series_4",
                                "series_3"
                            ]
                        }
                    }
                ]
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

* Error code `InsufficientHistoricalData`. This usually happens only with the first few timestamps because the model inferences data in a window-based manner and it needs historical data to make a decision. For the first few timestamps, there's insufficient historical data, so inference can't be performed on them. In this case, the error message can be ignored.

* **isAnomaly**: `false` indicates the current timestamp isn't an anomaly.`true` indicates an anomaly at the current timestamp.
    * `severity` indicates the relative severity of the anomaly and for abnormal data it's always greater than 0.
    * `score` is the raw output of the model on which the model makes a decision. `severity` is a derived value from `score`. Every data point has a `score`.

* **interpretation**: This field only appears when a timestamp is detected as anomalous, which contains `variables`, `contributionScore`, `correlationChanges`.

* **contributionScore**: This is the contribution score of each variable. Higher contribution scores indicate a higher possibility of the root cause. This list is often used for interpreting anomalies and diagnosing the root causes.

* **correlationChanges**: This field only appears when a timestamp is detected as abnormal, which is included in the interpretation. It contains `changedVariables` and `changedValues` that interpret which correlations between variables changed. 

* **changedVariables**: This field will show which variables that have a significant change in correlation with `variable`. The variables in this list are ranked by the extent of correlation changes.

> [!NOTE]
> A common pitfall is taking all data points with `isAnomaly`=`true` as anomalies. That may end up with too many false positives.
> You should use both `isAnomaly` and `severity` (or `score`) to sift out anomalies that are not severe and (optionally) use grouping to check the duration of the anomalies to suppress random noise. 
> Please refer to the [FAQ](../concepts/best-practices-multivariate.md#faq) in the best practices document for the difference between `severity` and `score`.

## Next steps

* [Best practices of multivariate anomaly detection](../concepts/best-practices-multivariate.md)
