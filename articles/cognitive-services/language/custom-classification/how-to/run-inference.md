---
title: how to run a custom text classification job
titleSuffix: Azure Cognitive Services
description: Learn about sending a request for custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# Run Custom text classification job

After deploying your model it is ready to be used via the Analyze API. 

>[!IMPORTANT]
> You can create a text classification job using Language Studio, but you will only be able to retrieve and view it programmatically. 

## Prerequisites

* Successfully created a [Custom text classification project](create-project.md)
* Completed [data tagging](tag-data.md).
* Completed [model training](train-model.md) successfully. 
* Completed [model deployment](deploy-model.md) successfully.
* [cURL](https://curl.haxx.se/) installed

## Create a text classification job

# [Using Language Studio](#tab/language-studio)

### Using Language studio

1. Go to your project in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

2. Select **Deploy model** from the left side menu.

3. After the deployment is completed, select the model you want to use and from the top menu click on **Get prediction URL** and copy the URL and body.

    :::image type="content" source="../media/get-prediction-url-1.png" alt-text="run-inference" lightbox="../media/get-prediction-url-1.png":::

4. In the window that appears, under the **Submit** pivot, copy the sample request into your command line

5. Replace `<YOUR_DOCUMENT_HERE>` with the actual text you want to classify.

    :::image type="content" source="../media/get-prediction-url-2.png" alt-text="run-inference-2" lightbox="../media/get-prediction-url-2.png":::

6. Submit the request

7. In the response header you receive extract `jobId` from `operation-location`, which has the format: `{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze/jobs/<jobId}>`

8. Copy the retrieve request and replace `jobId` and submit the request.

    :::image type="content" source="../media/get-prediction-url-3.png" alt-text="run-inference-3" lightbox="../media/get-prediction-url-3.png":::

# [Using the API](#tab/api)

### Using the API

You will get the `model id` from the get train results request you submitted earlier. Or you can get the `model id` directly from the Language studio portal.

1. Go to your project in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

2. Select **Deploy model** from the left side menu.

3. If your model is deployed you will find the `model id` under the **Model id** column.

    :::image type="content" source="../media/get-model-id.png" alt-text="get the model ID" lightbox="../media/get-model-id.png":::

### Get your resource keys endpoint

1. Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../media/get-endpoint-azure.png" alt-text="Get the Azure endpoint" lightbox="../media/get-endpoint-azure.png":::

### Submit a job request

> [!NOTE]
> Project names is case sensitive.

Use this **POST** request to start an entity extraction task. replace `{projectName}` with the project name where you have the model you want to use.

`{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze`

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your subscription key that provides access to this API.|

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
`operation-location` is formatted like this:

 `{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze/jobs/<jobId>`

You will use this endpoint in the next step to get the custom classification task results.

---

### Orchestrator Get job status/results

Use the following **GET** request to query the status/results of the custom classification task. You can use the endpoint you received from the previous step.

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

# [Using Language Studio](#tab/language-studio)

When no longer needed, delete the project. To do so, go to your projects page in [Language Studio](https://language.azure.com/customTextNext/projects/classification), select the project you want to delete and select **Delete**.

:::image type="content" source="../media/delete-project.png" alt-text="Delete the project" lightbox="../media/delete-project.png":::

# [Using the API](#tab/api)

Use the following **DELETE** request to delete your project: 

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}`

Replace `{YOUR-ENDPOINT}` with the endpoint of your resource and `{projectName}` with name of the project you want to delete.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|
