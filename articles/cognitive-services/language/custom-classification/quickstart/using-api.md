---
title: Use the authoring and runtime APIs for custom text classification
titleSuffix: Azure Cognitive Services
description: Learn how to use the authoring and runtime APIs for custom text classification
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 07/15/2021
ms.author: aahi
---

# Use Authoring and Runtime APIs for Custom text classification

In this article, you will use the authoring and analyze APIs to demonstrate key concepts of custom text classification.

## Prerequisites

* A Text analytics resource in **West US 2** or **West Europe** with **S** pricing tier.

* Proper permissions for storage account.

* Connect storage account to your resource. 

* A labeled `.txt` available in your container.

### Get your resource keys and endpoint

* Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

* From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

:::image type="content" source="../media/get-endpoint-azure.png" alt-text="Get the Azure endpoint" lightbox="../media/get-endpoint-azure.png":::

## Create project

> [!NOTE]
> Project name is case sensitive.

Use this [**POST**] request to create your project: `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects`. Replace `{YOUR-ENDPOINT}` by the endpoint you got from the previous step.

### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

### Body

```json
    {
        "name": "MyProject",
        "modelType": "MultiClassification",
        "multiLingual": false,
        "description": "My new CT project",
        "culture": "string",
        "storageInputContainerName": "MyContainer",
        "labelsLocation": "myLabels.json"
    }
```

|Key|Sample Value|Description|
|--|--|--|
|name|"MyProject"|Your Project Name.|
|modelType|"MultiClassification"|Your model type. Accepted values are `SingleClassification` or `MultiClassification`|
|multiLingual|false|Set to true if your dataset has multilingual documents|
|description|"mystoragecontainer"|Description for your project|
|culture|"en-us"|Culture for your documents. You can view available cultures [here](../language-support.md)|
|storageInputContainerName|"MyContainer"|Name of the container with your training documents|
|labelsLocation|"myLabels.json"|Absolute path to your labels file|

> [!NOTE]
> If your files will be in multiple languages set **multiLingual** to `true` and for the **culture** choose the culture of the majority of your files.

This request will return an error if:

* The resource selected doesn't have proper permission for the storage account. 
* The labels file location is not valid.

## Train your model

> [!NOTE]
> If you already have tagged data, make sure it follows the format mentioned [here](../how-to/tag-data.md).

### Trigger Training

Use this [**POST**] request to create your project: `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/train`. Replace `{YOUR-ENDPOINT}` by the endpoint you got from the previous step and `{projectName}` with the name of the project that contains the model you want to publish.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

#### Body

```json
    {
        "tasks": [
            {
                "trainingModelName": "MyModel"
        }
        ]
    }
```

|Key|Sample Value|Description|
|--|--|--|
|trainingModelName|"MyModel"|Name of the model you want to train|

#### Response

You will receive a 202 response indicating success. In the response **headers**, extract `location`.
`location` is formatted like this `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/train/jobs/{jobId}`. You will use this endpoint in the next step to get the training status. 

### Get Training Status

Use the following [**GET**] request to query the status of the training process. You can use the endpoint you received from the previous step. `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/train/jobs/{jobId}`. Or you can replace `{YOUR-ENDPOINT}` by the endpoint you got earlier, replace `{projectName}` with your project name and `{jobID}` with the jobID you received in the previous step.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|


#### Response Body

```json
    {
        "tasks": [
            {
            "trainingModelName": "MyModel",
            "evaluationStatus": {
                "status": "notStarted",
                "lastUpdatedDateTime": "2021-05-18T20:31:04.592Z",
                "error": {
                "code": "NotFound",
                "message": "Error Message"
                }
            },
            "status": "notStarted",
            "lastUpdatedDateTime": "2021-05-18T20:31:04.592Z",
            "error": {
                "code": "NotFound",
                "message": "Error Message"
            }
            }
        ],
        "inProgress": 0,
        "completed": 0,
        "failed": 0,
        "total": 0,
        "jobId": "123456789",
        "createdDateTime": "2021-05-18T20:31:04.592Z",
        "lastUpdatedDateTime": "2021-05-18T20:31:04.592Z",
        "expirationDateTime": "2021-05-19T11:44:08.555Z",
        "status": "notStarted",
        "errors": [
            {
            "code": "NotFound",
            "message": "string"
            }
        ]
    }
```

|Key|Sample Value|Description|
|--|--|--|
|tasks|[]|List of tasks you are running|
|trainingModelName|"MyModel"| Name of the model being trained|
|evaluationStatus| [] | Object containing the status, create time and errors of the evaluation process. Evaluation process starts after training is completed.|
|status|"notStarted"|Training Status|
|lastUpdatedDateTime|`2021-03-29T17:44:18.9863934Z`|Timestamp of last update to your model|
|errors|[]|list of errors in training|
|inProgress|0|Count of tasks with status inProgress|
|completed|0|Count of tasks with status completed|
|failed|0|Count of tasks with status failed|
|total|0|Total count of tasks|
|jobId|"123456789"|Your Job ID|
|createdDateTime|`2021-03-29T17:44:18.8469889Z`|Timestamp for job creation|
|lastUpdatedDateTime|`2021-03-29T17:44:18.9863934Z`|Timestamp of last update to your model|
|status|"inProgress"|General status of all your tasks|
|errors|[]|list of errors of all your tasks|

## View the model evaluation

After model training is completed, you can view model details and see how well does it perform against the test set. The [test set](../how-to/train-model.md#data-groups) is composed of 10% of your data, this split is done at random before training. The test set is a blind set that was not introduced to the model during the training process. For the evaluation process to complete there must be at least 10 files in your dataset.

### Get evaluation details

Use this `GET` request to get you model evaluation results:

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/evaluation`.

Replace `{YOUR-ENDPOINT}` by the endpoint you got earlier, replace `{projectName}` with your project name. Pass `trainingModelName` as a parameter and for the value indicate the model name you are requesting evaluation for (model name is case-sensitive). For your request to be successful, make sure that the model has completed training successfully on more than 10 files to be able to query evaluation results. Evaluation is performed only on the [test set](../how-to/train-model.md#data-groups).

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

#### Response Body

```json
    "modelType": "MultiClassification",
    "singleClassificationEvaluation": null,
    "multiClassificationEvaluation": {
        "classes": {
            "Class_1": {
                "f1": 0,
                "precision": 0,
                "recall": 0,
                "countTruePositives": 0,
                "countTrueNegatives": 0,
                "countFalsePositives": 0,
                "countFalseNegatives": 1
            },
            "Class_2": {
                "f1": 1,
                "precision": 1,
                "recall": 1,
                "countTruePositives": 0,
                "countTrueNegatives": 0,
                "countFalsePositives": 0,
                "countFalseNegatives": 0
            }
        },
        "microF1": 0.33333334,
        "microPrecision": 0.2857143,
        "microRecall": 0.4,
        "macroF1": 0.26666668,
        "macroPrecision": 0.2,
        "macroRecall": 0.4
    }
}
```

|Key|Sample Value|Description|
|--|--|--|
|modelType|"MultiClassification"|Type of the model. This value can be `SingleClassification` based on model type|
|multiClassificationEvaluation|{}| Object for multiClassification results of the test set|
|singleClassificationEvaluation|{}| Object for singleClassification results of the test set|
|classes|[]| list of all classes with their class-level evaluation metrics. You can learn more about evaluation metrics [here](../concepts/evaluation.md)|
|microF1, microPrecision, microRecall|0.33, 0.28, 0.4| These are model-level evaluation metrics. You can learn more about evaluation metrics [here](../concepts/evaluation.md)|
|macroF1, macroPrecision, macroRecall|0.26, 0.2, 0.4|These are model-level evaluation metrics. Macro metrics are calculated as the average of class-level metrics for all classes.|

## Improve model performance

After the training is completed and you have reviewed model evaluation details, this is your chance to improve model performance. You will review inconsistencies between predicted classes and tagged classes by the model and make improvements where applicable.

### Review validation set

Use this [**GET**] request to get you model evaluation results `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/validation`.
Replace `{YOUR-ENDPOINT}` by the endpoint you got earlier, replace `{projectName}` with your project name. Pass `trainingModelName` as a parameter and for the value indicate the model name you are requesting validation data for (model name is case-sensitive). For your request to be successful make sure that the model has completed training successfully on more than 10 files to be able to query validation results. You can learn more about the validation set [here](../how-to/train-model.md#data-groups).

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

#### Response Body

```json
    {
    "modelType": "MultiClassification",
    "singleClassificationValidation": null,
    "multiClassificationValidation": {
        "documents": [
            {
                "classes": {
                    "labeledClasses": [
                        "Class_1",
                        "Class_2"
                    ],
                    "predictedClasses": [
                        "Class_1",
                    ]
                },
                "location": "file.txt",
                "culture": "en-us"
            }
        ]
    }
}
```

|Key|Sample Value|Description|
|--|--|--|
|modelType|"MultiClassification"|Type of the model. This value can be `SingleClassification` based on model type|
|multiClassificationValidation|{}| Object for multiClassification results of the validation set|
|singleClassificationValidation|{}| Object for singleClassification results of the validation set|
|documents|[]|list of files in validation set|
|labeledClasses|[]| list of classes tagged for this file|
|predictedClasses|[]| list of classes predicted for this file|

## Publish your model

### Trigger Publish

Use this [**POST**] request to create your project: `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/publish`. Replace `{YOUR-ENDPOINT}` by the endpoint you got from the previous step and `{projectName}` with the name of the project that contains the model you want to publish.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

#### Body

```json
{
  "tasks": [
    {
      "trainingModelName": "MyModel"
    }
  ]
}
```

|Key|Sample Value|Description|
|--|--|--|
|trainingModelName|"MyModel"|Name of the model you want to publish|

#### Response

You will receive a 202 response indicating success. In the response **headers**, extract `location`. 
`location` is formatted like this `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/publish/jobs/{jobId}`. You will use this endpoint in the next to get the publishing status. 

### Get Publish Status

Use this [**GET**] request to query the status of the publishing process. You can use the endpoint you received from the previous step.
`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/publish/jobs/{jobId}`.
Or you can replace `{YOUR-ENDPOINT}` by the endpoint you got earlier, replace `{projectName}` with your project name and `{jobID}` with the jobID you received in the previous step.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|


#### Response Body

```json
    {
  "tasks": [
    {
      "modelId": "string",
      "status": "notStarted",
      "lastUpdatedDateTime": "2021-05-19T12:09:58.301Z",
      "error": {
        "code": "NotFound",
        "message": "string"
      }
    }
  ],
  "inProgress": 0,
  "completed": 0,
  "failed": 0,
  "total": 0,
  "jobId": "string",
  "createdDateTime": "2021-05-19T12:09:58.301Z",
  "lastUpdatedDateTime": "2021-05-19T12:09:58.301Z",
  "expirationDateTime": "2021-05-19T12:09:58.301Z",
  "status": "notStarted",
  "errors": [
    {
      "code": "NotFound",
      "message": "string"
    }
  ]
}
```

|Key|Sample Value|Description|
|--|--|--|
|tasks|[]|List of tasks you are running|
|modelId|"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_MultiClassification_latest"|Your model ID|
|status|"notStarted"|Publishing status|
|lastUpdatedDateTime|"2021-03-29T17:44:18.9863934Z"|Timestamp of last update to your model|
|errors|[]|list of errors in training|
|inProgress|0|Count of tasks with status inProgress|
|completed|0|Count of tasks with status completed|
|failed|0|Count of tasks with status failed|
|total|0|Total tasks of jobs|
|jobId|"123456789"|Your Job ID|
|createdDateTime|"2021-03-29T17:44:18.8469889Z"|Timestamp for job creation|
|lastUpdatedDateTime|"2021-03-29T17:44:18.9863934Z"|Timestamp of last update to your model|
|status|"inProgress"|General status of all your tasks|
|errors|[]|list of errors of all your tasks|

## Start custom text classification task

### Submit job

Use this [**POST**] request to trigger the custom classification task, replace `{projectName}` with the project name you created earlier.
`{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze`

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

#### Body

```json
    {
        "displayName": "MyJobName",
        "analysisInput": {
            "documents": [
                {
                    "id": "doc1", 
                    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus, felis sed vehicula lobortis, lectus ligula facilisis quam, quis aliquet lectus diam id erat. Vivamus eu semper tellus. Integer placerat sem vel eros iaculis dictum. Sed vel congue urna."
                },
                {
                    "id": "doc2",
                    "text": "Mauris dui dui, ultricies vel ligula ultricies, elementum viverra odio. Donec tempor odio nunc, quis fermentum lorem egestas commodo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
                }
            ]
        },
        "tasks": {
            "customMultiClassificationTasks": [      
                {
                    "parameters": {
                        "modelId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_MultiClassification_latest",
                        "stringIndexType": "TextElements_v8"
                    }
                }
            ]
        }
    }
```

|Key|Sample Value|Description|
|--|--|--|
|displayName|"MyJobName"|Your job Name|
|documents|[{},{}]|List of documents to run tasks on|
|ID|"doc1"|a string document identifier|
|text|"Lorem ipsum dolor sit amet"| You document in string format|
|"tasks"|[]| List of tasks we want to perform.|
|--|customMultiClassificationTasks|Task identifer for task we want to perform. Use `customClassificationTasks` for Single Classification tasks and `customMultiClassificationTasks` for Multi Classification tasks. |
|parameters|[]|List of parameters to pass to task|
|modelId| "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_MultiClassification_latest"| Your published Model ID|

#### Response

You will receive a 202 response indicating success. In the response **headers**, extract `operation-location`.
`operation-location` is formatted like this `{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze/jobs/<jobId>`.
You will use this endpoint in the next step to get the custom classification task results. 


### Orchestrator Get job status/results

Use this [**GET**] request to query the status/results of the custom classification task. You can use the endpoint you received from the previous step.
`{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze/jobs/<jobId>`.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

#### Response Body

The response will be a JSON document with the following parameters

```json
{
    "createdDateTime": "2021-05-19T14:32:25.578Z",
    "displayName": "MyJobName",
    "expirationDateTime": "2021-05-19T14:32:25.578Z",
    "jobId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "lastUpdateDateTime": "2021-05-19T14:32:25.578Z",
    "status": "completed",
    "errors": [],
    "tasks": {
        "details": {
            "name": "MyJobName",
            "lastUpdateDateTime": "2021-03-29T19:50:23Z",
            "status": "completed"
        },
        "completed": 1,
        "failed": 0,
        "inProgress": 0,
        "total": 1,
        "tasks": {
    "customMultiClassificationTasks": [
        {
            "lastUpdateDateTime": "2021-05-19T14:32:25.579Z",
            "name": "MyJobName",
            "status": "completed",
            "results": {
                "documents": [
                    {
                        "id": "doc1",
                        "classes": [
                            {
                                "category": "Class_1",
                                "confidenceScore": 0.0551877357
                            }
                        ],
                        "warnings": []
                    },
                    {
                        "id": "doc2",
                        "classes": [
                            {
                                "category": "Class_1",
                                "confidenceScore": 0.0551877357
                            },
                                                        {
                                "category": "Class_2",
                                "confidenceScore": 0.0551877357
                            }
                        ],
                        "warnings": []
                    }
                ],
                "errors": [],
                "statistics": {
                    "documentsCount":0,
                    "validDocumentsCount":0,
                    "erroneousDocumentsCount":0,
                    "transactionsCount":0
                }
                    }
                }
            ]
        }
    }
```

## Clean up resources

When no longer needed, delete the project. Use this [**DELETE**] request to delete your project: `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}`. Replace `{YOUR-ENDPOINT}` with the endpoint of your resource and `{projectName}` with name of the project you want to delete. Refer to this [section](#get-your-resource-keys-and-endpoint) to get your endpoint and keys.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

## Next Steps

* [View recommended practices](../concepts/recommended-practices.md)
