---
title: How to train your custom classification model - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn about how to train your model for custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# How to train your model


Training is the process where the model learns what you have [tagged](tag-data.md). Training uses deep learning technology built on top of [Microsoft Turing](https://msturing.org/about). At the end of the training process, your model will be trained to perform custom text classification, and you can [view an evaluation](../how-to/view-model-evaluation.md), and [Improve your model](../how-to/improve-model.md). 

> [!NOTE]
> * You must have minimum of 10 documents in your project for the evaluation process to be successful. While training may run with less than 10 tagged files there will be no evaluation data for the model. 
> * While there is specific number of tagged files you need per classification, consider starting with 20 files. Training depends on how distinct the entities in your documents are, and how easily they can be differentiated.

The time to train a model varies on the dataset, and may take up to several hours. You can only train one model at a time, and you cannot create or train other models if one is already training in the same project. 

## Data groups

Before starting the training process, files in your dataset are divided into three groups at random: 

* The training set contains 80% of the files in your dataset. It is the main set that is used to train the model.

* The validation set contains 10% and is introduced to the model during training. Later you can view the incorrect predictions made by the model on this set so you examine your data and tags and make necessary adjustments.

* The Test set contains 10% of the files available in your dataset. This set is used to provide an unbiased [evaluation](../how-to/view-model-evaluation.md) of the model. This set is not introduced to the model during training. The details of correct and incorrect predictions for this set are not shown so that you don't readjust your training data and alter the results.

## Prerequisites

* Successfully created a [Custom text classification project](create-project.md)

* Finished [tagging your data](tag-data.md).
    * You can create and train multiple [models](../definitions.md#model) within the same [project](../definitions.md#project). However, if you re-train a specific model it will overwrite the previous state.

# [Using Language Studio](#tab/language-studio)

## Train model in Language studio

1. Go to your project page in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

2. Select **Train** from the left side menu.

3. Select the model you want to train from the **Model name** dropdown, if you don’t have models already, type in the name of your model and select **create new model**.

    :::image type="content" source="../media/train-model-1.png" alt-text="Create a new model" lightbox="../media/train-model-1.png":::

4. Select the **Train** button at the bottom of the page. If the model you selected is already trained, a pop-up window will appear to confirm overwriting the last model state.

5. After training is completed, you can [view the model evaluation details](view-model-evaluation.md) and [improve your model](improve-model.md)

# [Using the APIs](#tab/api)

## Train using APIs

### Get your resource keys endpoint

1. Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for the `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../media/get-endpoint-azure.png" alt-text="get your key and endpoint from the Azure portal" lightbox="../media/get-endpoint-azure.png":::

### Send a POST request to begin training

Use the following **POST** request to create your project: 

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/train` 

Replace `{YOUR-ENDPOINT}` by the endpoint you got from the previous step and `{projectName}` with the name of the project that contains the model you want to publish.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your subscription key that provides access to the API.|

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

You will receive a 202 response if the request is a success. Extract `location` from the response headers. It will be formatted like:

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/train/jobs/{jobId}` 

You will use this endpoint in the next step to get the training status.

### Get Training Status

Use the following **GET** request to query the status of the training process. You can use the endpoint you received from the previous step. For example:

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/train/jobs/{jobId}`. Replace `{YOUR-ENDPOINT}` with your own endpoint, replace `{projectName}` with your project name and `{jobID}` with the jobID you received in the previous step.

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

---

## Next steps

* [View the model evaluation details](view-model-evaluation.md)
* [Improve model](improve-model.md)
