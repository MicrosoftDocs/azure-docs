---
title: How to use Multivariate Anomaly Detector APIs on your time series data
titleSuffix: Azure Cognitive Services
description: Learn how to detect anomalies in your data with multivariate anomaly detector.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: conceptual
ms.date: 01/18/2022
ms.author: mbullwin
---

# How to: Use Multivariate Anomaly Detector on your time series data  

The Multivariate Anomaly Detector (MVAD) provides mainly two steps to detect anomalies compared with Univariate Anomaly Detector (UVAD), **training** and **inference**. During inference process, you could choose to use an asynchronized API or a synchronized API to trigger inference one time, and both of these two APIs will support batch or streaming scenario.

In general, you could take these steps to use MVAD:
  1. Create an Anomaly Detector resource in Azure Portal.
  1. Prepare data for training and inference.
  1. Train an MVAD model.
  1. Get model status.
  1. Detect anomalies in inference process.

To get hands on this feature immediately, try this SDK [Notebook](https://github.com/Azure-Samples/AnomalyDetector/blob/master/ipython-notebook/API%20Sample/Multivariate%20API%20Demo%20Notebook.ipynb).

## Multivariate Anomaly Detector APIs Overview

Generally, multivariate anomaly detector includes a set of APIs, covering the whole lifecycle of training and inference. Here are the **8 APIs** in MVAD:

| APIs | Description           | 
| ------------- | ---------------- | 
| /multivariate/models| Create and train model using training data.  | 
| /multivariate/models/{modelid}| Get model info including training status and parameters used in the model.| 
| /multivariate/models[?$skip][&$top]|List models of a subscription. | 
| /multivariate/models/{modelid}/detect| Submit asynchronous inference task with use's data. |
| /multivariate/models/{modelId}/last/detect| Submit synchronous inference task with use's data. |  
| /multivariate/results/{resultid} | South Africa North  | 
| /multivariate/models/{modelId}| Delete an existing multivariate model according to the modelId.  | 
| /multivariate/models/{modelId}/export| Export model as Zip file. |


## Create an Anomaly Detector resource in Azure Portal

* Create an Azure subscription if you don't have one - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, [create an Anomaly Detector resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector) in the Azure portal to get your API key and API endpoint.

> [!NOTE]
> During preview stage, MVAD is available in limited regions only. Please bookmark [What's new in Anomaly Detector](../whats-new.md)  to keep up to date with MVAD region roll-outs. You could also file a GitHub issue or contact us at [AnomalyDetector@microsoft.com](mailto:AnomalyDetector@microsoft.com) to request for specific regions.


## Data preparation

Then you need to prepare your training data (and inference data with asynchronized API).

[!INCLUDE [mvad-data-schema](../includes/mvad-data-schema.md)]


## Train an MVAD model.

Here is a sample request body and the sample code in Python to train an MVAD model.

```json
// Sample Request Body
{
    "slidingWindow": 200,
    "alignPolicy": {
        "alignMode": "Outer",
        "fillNAMethod": "Linear", 
        "paddingValue": 0
    },
    // This could be your own ZIP file of training data stored on Azure Blob and a SAS url could be used here
    "source": "https://aka.ms/AnomalyDetector/MVADSampleData", 
    "startTime": "2021-01-01T00:00:00Z", 
    "endTime": "2021-01-02T12:00:00Z", 
    "displayName": "Contoso model"
}
```

```python
# Sample Code in Python
########### Python 3.x #############
import http.client, urllib.request, urllib.parse, urllib.error, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '{API key}',
}

params = urllib.parse.urlencode({})

try:
    conn = http.client.HTTPSConnection('{endpoint}')
    conn.request("POST", "/anomalydetector/v1.1-preview/multivariate/models?%s" % params, "{request body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################
```

Response code `201` indicates a successful request.

[!INCLUDE [mvad-input-params](../includes/mvad-input-params.md)]

## Get model status
As the training API is asynchronous, you won't get the model immediately after calling the training API. However, you can query the status of models either by API key, which will list all the models, or by model ID, and will list information about the specific model.


### List all the models

You may refer to [this page](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector-v1-1-preview/operations/ListMultivariateModel) for information about the request URL and request headers. Notice that we only return 10 models ordered by update time, but you can visit other models by setting the `$skip` and the `$top` parameters in the request URL. For example, if your request URL is `https://{endpoint}/anomalydetector/v1.1-preview/multivariate/models?$skip=10&$top=20`, then we will skip the latest 10 models and return the next 20 models.

A sample response is 

```json
{
	"models": [
         {
             "createdTime":"2020-12-01T09:43:45Z",
             "displayName":"DevOps-Test",
             "lastUpdatedTime":"2020-12-01T09:46:13Z",
             "modelId":"b4c1616c-33b9-11eb-824e-0242ac110002",
             "status":"READY",
             "variablesCount":18
         },
         {
             "createdTime":"2020-12-01T09:43:30Z",
             "displayName":"DevOps-Test",
             "lastUpdatedTime":"2020-12-01T09:45:10Z",
             "modelId":"ab9d3e30-33b9-11eb-a3f4-0242ac110002",
             "status":"READY",
             "variablesCount":18
         }
	],
    "currentCount": 1,
    "maxCount": 50, 
    "nextLink": "<link to more models>"
}
```

The response contains 4 fields, `models`, `currentCount`, `maxCount`, and `nextLink`.

* `models` contains the created time, last updated time, model ID, display name, variable counts, and the status of each model.
* `currentCount` contains the number of trained multivariate models.
* `maxCount` is the maximum number of models supported by this Anomaly Detector resource.
* `nextLink` could be used to fetch more models.

### Get models by model ID

[This page](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector-v1-1-preview/operations/GetMultivariateModel) describes the request URL to query model information by model ID. A sample response looks like this

```json
{
        "modelId": "45aad126-aafd-11ea-b8fb-d89ef3400c5f",
        "createdTime": "2020-06-30T00:00:00Z",
        "lastUpdatedTime": "2020-06-30T00:00:00Z",
        "modelInfo": {
          "slidingWindow": 300,
          "alignPolicy": {
            "alignMode": "Outer",
            "fillNAMethod": "Linear",
            "paddingValue": 0
          },
          "source": "<TRAINING_ZIP_FILE_LOCATED_IN_AZURE_BLOB_STORAGE_WITH_SAS>",
          "startTime": "2019-04-01T00:00:00Z",
          "endTime": "2019-04-02T00:00:00Z",
          "displayName": "Devops-MultiAD",
          "status": "READY",
          "errors": [],
          "diagnosticsInfo": {
            "modelState": {
              "epochIds": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
              "trainLosses": [0.6291328072547913, 0.1671326905488968, 0.12354248017072678, 0.1025966405868533, 
                              0.0958492755889896, 0.09069952368736267,0.08686016499996185, 0.0860302299260931,
                              0.0828735455870684, 0.08235538005828857],
              "validationLosses": [1.9232804775238037, 1.0645641088485718, 0.6031560301780701, 0.5302737951278687, 
                                   0.4698025286197664, 0.4395163357257843, 0.4182931482799006, 0.4057914316654053, 
                                   0.4056498706340729, 0.3849248886108984],
              "latenciesInSeconds": [0.3398594856262207, 0.3659665584564209, 0.37360644340515137, 
                                     0.3513407707214355, 0.3370304107666056, 0.31876277923583984, 
                                     0.3283309936523475, 0.3503587245941162, 0.30800247192382812,
                                     0.3327946662902832]
            },
            "variableStates": [
              {
                "variable": "ad_input",
                "filledNARatio": 0,
                "effectiveCount": 1441,
                "startTime": "2019-04-01T00:00:00Z",
                "endTime": "2019-04-02T00:00:00Z",
                "errors": []
              },
              {
                "variable": "ad_ontimer_output",
                "filledNARatio": 0,
                "effectiveCount": 1441,
                "startTime": "2019-04-01T00:00:00Z",
                "endTime": "2019-04-02T00:00:00Z",
                "errors": []
              },
              // More variables
            ]
          }
        }
      }
```

You will receive more detailed information about the queried model. The response contains meta information about the model, its training parameters, and diagnostic information. Diagnostic Information is useful for debugging and tracing training progress.

* `epochIds` indicates how many epochs the model has been trained out of in total 100 epochs. For example, if the model is still in training status, `epochId` might be `[10, 20, 30, 40, 50]` which means that it has completed its 50th training epoch, and there are half way to go.
* `trainLosses` and `validationLosses` are used to check whether the optimization progress converges in which case the two losses should decrease gradually.
* `latenciesInSeconds` contains the time cost for each epoch and is recorded every 10 epochs. In this example, the 10th epoch takes approximately 0.34 seconds. This would be helpful to estimate the completion time of training.
* `variableStates` summarizes information about each variable. It is a list ranked by `filledNARatio` in descending order. It tells how many data points are used for each variable and `filledNARatio` tells how many points are missing. Usually we need to reduce `filledNARatio` as much as possible.
Too many missing data points will deteriorate model accuracy.
* Errors during data processing will be included in the `errors` field.


## Inference with asynchronous API

You could choose asynchronous API or synchronous API for inference. 

| Asynchronous API | Synchronous API           | 
| ------------- | ---------------- | 
| More suitable for batch use cases when customers don’t need to get inference results immediately and want to detect anomalies and get results in a longer time period.| Streaming use case when customers want to get inference immediately and want to detect multivariate anomalies in real time. Also suitable for customers hard to conduct previous compressing and uploading process. | 

To perform asynchronous inference, simply provide the blob source to the zip file containing the inference data, the start time, and end time.

This inference is asynchronous, so the results are not returned immediately. Notice that you need to save in a variable the link of the results in the **response header** which contains the `resultId`, so that you may know where to get the results afterwards.

Failures are usually caused by model issues or data issues. You cannot perform inference if the model is not ready or the data link is invalid. Make sure that the training data and inference data are consistent, which means they should be **exactly** the same variables but with different timestamps. More variables, fewer variables, or inference with a different set of variables will not pass the data verification phase and errors will occur. Data verification is deferred so that you will get error message only when you query the results.

### Get inference results (asynchronous only)

You need the `resultId` to get results. `resultId` is obtained from the response header when you submit the inference request. [This page](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector-v1-1-preview/operations/GetDetectionResult) contains instructions to query the inference results. 

A sample response looks like this

```json
 {
        "resultId": "663884e6-b117-11ea-b3de-0242ac130004",
        "summary": {
          "status": "READY",
          "errors": [],
          "variableStates": [
            {
              "variable": "ad_input",
              "filledNARatio": 0,
              "effectiveCount": 26,
              "startTime": "2019-04-01T00:00:00Z",
              "endTime": "2019-04-01T00:25:00Z",
              "errors": []
            },
            {
              "variable": "ad_ontimer_output",
              "filledNARatio": 0,
              "effectiveCount": 26,
              "startTime": "2019-04-01T00:00:00Z",
              "endTime": "2019-04-01T00:25:00Z",
              "errors": []
            },
            // more variables
          ],
          "setupInfo": {
            "source": "https://aka.ms/AnomalyDetector/MVADSampleData",
            "startTime": "2019-04-01T00:15:00Z",
            "endTime": "2019-04-01T00:40:00Z"
          }
        },
        "results": [
          {
            "timestamp": "2019-04-01T00:15:00Z",
            "errors": [
              {
                "code": "InsufficientHistoricalData",
                "message": "historical data is not enough."
              }
            ]
          },
          // more results
          {
            "timestamp": "2019-04-01T00:20:00Z",
            "value": {
              "contributors": [],
              "isAnomaly": false,
              "severity": 0,
              "score": 0.17805261260751692
            }
          },
          // more results
          {
            "timestamp": "2019-04-01T00:27:00Z",
            "value": {
              "contributors": [
                {
                  "contributionScore": 0.0007775013367514271,
                  "variable": "ad_ontimer_output"
                },
                {
                  "contributionScore": 0.0007989604079048129,
                  "variable": "ad_series_init"
                },
                {
                  "contributionScore": 0.0008900927229851369,
                  "variable": "ingestion"
                },
                {
                  "contributionScore": 0.008068144477478554,
                  "variable": "cpu"
                },
                {
                  "contributionScore": 0.008222036467507165,
                  "variable": "data_in_speed"
                },
                {
                  "contributionScore": 0.008674941549594993,
                  "variable": "ad_input"
                },
                {
                  "contributionScore": 0.02232242629793674,
                  "variable": "ad_output"
                },
                {
                  "contributionScore": 0.1583773213660846,
                  "variable": "flink_last_ckpt_duration"
                },
                {
                  "contributionScore": 0.9816531517495176,
                  "variable": "data_out_speed"
                }
              ],
              "isAnomaly": true,
              "severity": 0.42135109874230336,
              "score": 1.213510987423033
            }
          },
          // more results
        ]
      }
```

The response contains the result status, variable information, inference parameters, and inference results.

* `variableStates` lists the information of each variable in the inference request.
* `setupInfo` is the request body submitted for this inference.
* `results` contains the detection results. There're three typical types of detection results.
    1. Error code `InsufficientHistoricalData`. This usually happens only with the first few timestamps because the model inferences data in a window-based manner and it needs historical data to make a decision. For the first few timestamps, there is insufficient historical data, so inference cannot be performed on them. In this case, the error message can be ignored.
    1. `"isAnomaly": false` indicates the current timestamp is not an anomaly.
        * `severity ` indicates the relative severity of the anomaly and for normal data it is always 0.
        * `score` is the raw output of the model on which the model makes a decision which could be non-zero even for normal data points.
    1. `"isAnomaly": true` indicates an anomaly at the current timestamp.
        * `severity ` indicates the relative severity of the anomaly and for abnormal data it is always greater than 0.
        * `score` is the raw output of the model on which the model makes a decision. `severity` is a derived value from `score`. Every data point has a `score`.
        * `contributors` is a list containing the contribution score of each variable. Higher contribution scores indicate higher possibility of the root cause. This list is often used for interpreting anomalies as well as diagnosing the root causes.

> [!NOTE]
> A common pitfall is taking all data points with `isAnomaly`=`true` as anomalies. That may end up with too many false positives.
> You should use both `isAnomaly` and `severity` (or `score`) to sift out anomalies that are not severe and (optionally) use grouping to check the duration of the anomalies to suppress random noise. 
> Please refer to the [FAQ](../concepts/best-practices-multivariate.md#faq) in the best practices document for the difference between `severity` and `score`.


## (NEW) Inference with synchronous API 

With synchronous API, you can get inference results point by point in real time, and no need for compressing and uploading task like training and asynchronous inference. Here are some requirements for synchronous API:
* Need to put data in **JSON format** into the API request body.
* The inference results are limited to up to 10 data points, which means you could detect **1 to 10 timestamps** with one synchronous API call.
* Due to payload limitation, the size of inference data in the request body is limited, which support at most `2880` timestamps * `300` variables.

### Request Schema

A sample request looks like following format, the case is detect last 2 timestamps among 3 variables, and there are 20 timestamps included in one synchronous API call.

```json
{
  "variables": [
    {
      "variableName": "Variable_1",
      "timestamps": [
        "2021-01-01T00:00:00Z",
        "2021-01-01T00:01:00Z",
        "2021-01-01T00:02:00Z",
        "2021-01-01T00:03:00Z",
        "2021-01-01T00:04:00Z",
        "2021-01-01T00:05:00Z",
        "2021-01-01T00:06:00Z",
        "2021-01-01T00:07:00Z",
        "2021-01-01T00:08:00Z",
        "2021-01-01T00:09:00Z",
        "2021-01-01T00:10:00Z",
        "2021-01-01T00:11:00Z",
        "2021-01-01T00:12:00Z",
        "2021-01-01T00:13:00Z",
        "2021-01-01T00:14:00Z",
        "2021-01-01T00:15:00Z",
        "2021-01-01T00:16:00Z",
        "2021-01-01T00:17:00Z",
        "2021-01-01T00:18:00Z",
        "2021-01-01T00:19:00Z",
        "2021-01-01T00:20:00Z",
        "2021-01-01T00:21:00Z",
        "2021-01-01T00:22:00Z",
        "2021-01-01T00:23:00Z",
        "2021-01-01T00:24:00Z",
        "2021-01-01T00:25:00Z",
        "2021-01-01T00:26:00Z",
        "2021-01-01T00:27:00Z",
        "2021-01-01T00:28:00Z",
        "2021-01-01T00:29:00Z"
      ],
      "values": [
        0.4551378545933972,
        0.7388603950488748,
        0.201088255984052,
        0.7462812245891899,
        0.07308128850401663,
        0.33090474587393537,
        0.7544925268153315,
        0.987506336316328,
        0.6665932993421468,
        0.6308351543168672,
        0.08083310161466228,
        0.8414415588668442,
        0.514583545640453,
        0.0954489875193526,
        0.7786793231920507,
        0.41646133667960994,
        0.030176187583339287,
        0.3474214937189324,
        0.508530173413991,
        0.42451199127255046,
        0.2115944222725208,
        0.24733519545833516,
        0.8791022110982156,
        0.9479621899884665,
        0.26702703121252136,
        0.6954503497669413,
        0.1235728391488995,
        0.8214915473050647,
        0.11813002444192677,
        0.8579045951076123
      ]
    },
    {
      "variableName": "Variable_2",
      "timestamps": [
        "2021-01-01T00:00:00Z",
        "2021-01-01T00:01:00Z",
        "2021-01-01T00:02:00Z",
        "2021-01-01T00:03:00Z",
        "2021-01-01T00:04:00Z",
        "2021-01-01T00:05:00Z",
        "2021-01-01T00:06:00Z",
        "2021-01-01T00:07:00Z",
        "2021-01-01T00:08:00Z",
        "2021-01-01T00:09:00Z",
        "2021-01-01T00:10:00Z",
        "2021-01-01T00:11:00Z",
        "2021-01-01T00:12:00Z",
        "2021-01-01T00:13:00Z",
        "2021-01-01T00:14:00Z",
        "2021-01-01T00:15:00Z",
        "2021-01-01T00:16:00Z",
        "2021-01-01T00:17:00Z",
        "2021-01-01T00:18:00Z",
        "2021-01-01T00:19:00Z",
        "2021-01-01T00:20:00Z",
        "2021-01-01T00:21:00Z",
        "2021-01-01T00:22:00Z",
        "2021-01-01T00:23:00Z",
        "2021-01-01T00:24:00Z",
        "2021-01-01T00:25:00Z",
        "2021-01-01T00:26:00Z",
        "2021-01-01T00:27:00Z",
        "2021-01-01T00:28:00Z",
        "2021-01-01T00:29:00Z"
      ],
      "values": [
        0.9617871613964145,
        0.24903311574778408,
        0.4920561254118613,
        0.9895601049618598,
        0.9171759283128094,
        0.5754204711105273,
        0.1811033296265634,
        0.8852311981742577,
        0.9543231904644779,
        0.7088012446094262,
        0.7843572237149014,
        0.7664787010700046,
        0.3699552325387093,
        0.504519908266789,
        0.5848930929950164,
        0.7628913396089576,
        0.8148405868900065,
        0.08540458873739332,
        0.03481976727525682,
        0.21275099339467762,
        0.9836175579199806,
        0.9321441483364282,
        0.038466608085469534,
        0.1723138437622782,
        0.8626383410218382,
        0.35053229974224254,
        0.631141662835182,
        0.0730352607990088,
        0.08886179043386,
        0.7488606040971179
      ]
    },
    {
      "variableName": "Variable_3",
      "timestamps": [
        "2021-01-01T00:00:00Z",
        "2021-01-01T00:01:00Z",
        "2021-01-01T00:02:00Z",
        "2021-01-01T00:03:00Z",
        "2021-01-01T00:04:00Z",
        "2021-01-01T00:05:00Z",
        "2021-01-01T00:06:00Z",
        "2021-01-01T00:07:00Z",
        "2021-01-01T00:08:00Z",
        "2021-01-01T00:09:00Z",
        "2021-01-01T00:10:00Z",
        "2021-01-01T00:11:00Z",
        "2021-01-01T00:12:00Z",
        "2021-01-01T00:13:00Z",
        "2021-01-01T00:14:00Z",
        "2021-01-01T00:15:00Z",
        "2021-01-01T00:16:00Z",
        "2021-01-01T00:17:00Z",
        "2021-01-01T00:18:00Z",
        "2021-01-01T00:19:00Z",
        "2021-01-01T00:20:00Z",
        "2021-01-01T00:21:00Z",
        "2021-01-01T00:22:00Z",
        "2021-01-01T00:23:00Z",
        "2021-01-01T00:24:00Z",
        "2021-01-01T00:25:00Z",
        "2021-01-01T00:26:00Z",
        "2021-01-01T00:27:00Z",
        "2021-01-01T00:28:00Z",
        "2021-01-01T00:29:00Z"
      ],
      "values": [
        0.4030756879437628,
        0.15526889968448554,
        0.36352226408981103,
        0.6051200637229004,
        0.8516795018476276,
        0.2645605735279929,
        0.6810875830037345,
        0.9165894221681316,
        0.700783245230424,
        0.5624155469940331,
        0.6277289685127893,
        0.15992056539730204,
        0.6020964482827594,
        0.35937967753105915,
        0.8731686034848609,
        0.20301549117588935,
        0.029261872151168933,
        0.6261499548828445,
        0.45850782028563386,
        0.8275006940083313,
        0.032760268834037376,
        0.4485202784055029,
        0.8915691008748384,
        0.891669051517807,
        0.9469979353323046,
        0.115293087370132,
        0.08818772518459506,
        0.7426286620589166,
        0.32372247468990756,
        0.936268139507417
      ]
    }
  ],
  "length": 2
}
```

### Response Schema

You will get the inference results in real time after you call a synchronous API, and you'll get a response like this:

```json
{
  "variableStates": [
    {
      "variable": "variable_1",
      "filledNARatio": 0,
      "effectiveCount": 30,
      "startTime": "2021-01-01T00:00:00Z",
      "endTime": "2021-01-01T00:29:00Z",
      "errors": []
    },
    {
      "variable": "variable_2",
      "filledNARatio": 0,
      "effectiveCount": 30,
      "startTime": "2021-01-01T00:00:00Z",
      "endTime": "2021-01-01T00:29:00Z",
      "errors": []
    },
    {
      "variable": "variable_3",
      "filledNARatio": 0,
      "effectiveCount": 30,
      "startTime": "2021-01-01T00:00:00Z",
      "endTime": "2021-01-01T00:29:00Z",
      "errors": []
    }
  ],
  "results": [
    {
      "timestamp": "2021-01-01T00:28:00Z",
      "value": {
        "isAnomaly": false,
        "severity": 0,
        "score": 0.6928471326828003
      },
      "errors": []
    },
    {
      "timestamp": "2021-01-01T00:29:00Z",
      "value": {
        "isAnomaly": true,
        "severity": 0.5337404608726501,
        "score": 0.9171165823936462,
        "interpretation": [
          {
            "variable": "variable_2",
            "contributionScore": 0.5371576215,
            "correlationChanges": {
              "changedVariables": [
                "variable_1",
                "variable_3"
              ],
              "changedValues": [
                0.1741322,
                0.1093203
              ]
            }
          },
          {
            "variable": "variable_3",
            "contributionScore": 0.3324159383,
            "correlationChanges": {
              "changedVariables": [
                "variable_2"
              ],
              "changedValues": [
                0.1229392
              ]
            }
          },
          {
            "variable": "variable_1",
            "contributionScore": 0.1304264402,
            "correlationChanges": {
              "changedVariables": [],
              "changedValues": []
            }
          }
        ]
      }, 
      "errors": []  
    }
  ],
  "errors": [   
    {
      "code": "string",   
      "message": "string"
    }
  ]
} 
```

**Important Parameters in response**

* Interpretation: This field only shows for anomalous timestamps.

* Variables: Top variables that contributed to this anomaly, ranked by contributionScore.

* CorrelationChanges: The changed extent of correlations among correlated variables.

## Next Steps

* [What is the Multivariate Anomaly Detector API?](../overview-multivariate.md)
* [Join us to get more supports!](https://aka.ms/adadvisorsjoin)
