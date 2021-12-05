---
title: Submit a Custom Named Entity Recognition (NER) task
titleSuffix: Azure Cognitive Services
description: Learn about sending a request for Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021
---

# Deploy a model and extract entities from text using the runtime API.

Once you are satisfied with how your model performs, it is ready to be deployed, and used to recognize entities in text. You can only send entity recognition tasks through the API, not from Language Studio.

## Prerequisites

* A successfully [created project](create-project.md) with a configured Azure blob storage account
    * Text data that [has been uploaded](create-project.md#prepare-training-data) to your storage account.
* [Tagged data](tag-data.md)
* A [successfully trained model](train-model.md)
* Reviewed the [model evaluation details](view-model-evaluation.md) to determine how your model is performing.
    * (optional) [Made improvements](improve-model.md) to your model if its performance isn't satisfactory.

See the [application development lifecycle](../overview.md#application-development-lifecycle) for more information.

## Deploy your model

1. Go to your project in [Language studio](https://aka.ms/custom-extraction)

2. Select **Deploy model** from the left side menu.

3. Select the model you want to deploy, then select **Deploy model**.

> [!TIP]
> You can test your model in Language Studio by sending samples of text for it to classify. 
> 1. Select **Test model** from the menu on the left side of your project in Language Studio.
> 2. Select the model you want to test.
> 3. Add your text to the textbox, you can also upload a `.txt` file. 
> 4. Click on **Run the test**.
> 5. In the **Result** tab, you can see the extracted entities from your text. You can also view the JSON response under the **JSON** tab.

## Send a text classification request to your model

# [Using Language Studio](#tab/language-studio)

### Using Language studio

1. After the deployment is completed, select the model you want to use and from the top menu click on **Get prediction URL** and copy the URL and body.

    :::image type="content" source="../../custom-classification/media/get-prediction-url-1.png" alt-text="run-inference" lightbox="../../custom-classification/media/get-prediction-url-1.png":::

2. In the window that appears, under the **Submit** pivot, copy the sample request into your command line

3. Replace `<YOUR_DOCUMENT_HERE>` with the actual text you want to classify.

    :::image type="content" source="../../custom-classification/media/get-prediction-url-2.png" alt-text="run-inference-2" lightbox="../../custom-classification/media/get-prediction-url-2.png":::

4. Submit the request

5. In the response header you receive extract `jobId` from `operation-location`, which has the format: `{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId}>`

6. Copy the retrieve request and replace `jobId` and submit the request.

    :::image type="content" source="../../custom-classification/media/get-prediction-url-3.png" alt-text="run-inference-3" lightbox="../../custom-classification/media/get-prediction-url-3.png":::
    
 ## Retrieve the results of your job

1. Select **Retrieve** from the same window you got the example request you got earlier and copy the sample request into a text editor. 

    :::image type="content" source="../media/get-prediction-retrieval-url.png" alt-text="Screenshot showing the prediction retrieval request and URL" lightbox="../media/get-prediction-retrieval-url.png":::

2. Replace `<OPERATION_ID>` with the `jobId` from the previous step. 

3. Submit the `GET` cURL request in your terminal or command prompt. You'll receive a 202 response and JSON similar to the below, if the request was successful.

You can find more details about the results in the next section.

# [Using the API](#tab/api)

### Using the API

### Get your resource keys endpoint

1. Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../../custom-classification/media/get-endpoint-azure.png" alt-text="Get the Azure endpoint" lightbox="../../custom-classification/media/get-endpoint-azure.png":::

### Submit custom NER task

> [!NOTE]
> The project name is-case sensitive.

Use this **POST** request to start an entity extraction task. Replace `{projectName}` with the project name where you have the model you want to use.

`{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze`

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
        "customEntityRecognitionTasks": [      
            {
                "parameters": {
                      "project-name": "MyProject",
                      "deployment-name": "MyDeploymentName"
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
|--|customEntityRecognitionTasks|Task identifer for task we want to perform. |
|parameters|[]|List of parameters to pass to task|
|project-name| "MyProject"| Your project name. The project name is case sensitive.|
|deployment-name| "MyDeploymentName"| Your deployment name|

#### Response

You will receive a 202 response indicating success. In the response **headers**, extract `operation-location`.
`operation-location` is formatted like this:

 `{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId>`

You will use this endpoint in the next step to get the custom recognition task results.

### Get task status and results

Use the following **GET** request to query the status/results of the custom recognition task. You can use the endpoint you received from the previous step.

`{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId>`.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

You can find more details about the results in the next section.

---

#### Custom Extraction task results

The response returned from the Get result call will be a JSON document with the following parameters:

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
    "customEntityRecognitionTasks": [
        {
            "lastUpdateDateTime": "2021-05-19T14:32:25.579Z",
            "name": "MyJobName",
            "status": "completed",
            "results": {
               "documents": [
                        {
                            "id": "doc1",
                            "entities": [
                                {
                                    "text": "Government",
                                    "category": "restaurant_name",
                                    "offset": 23,
                                    "length": 10,
                                    "confidenceScore": 0.0551877357
                                }
                            ],
                            "warnings": []
                        },
                        {
                            "id": "doc2",
                            "entities": [
                                {
                                    "text": "David Schmidt",
                                    "category": "artist",
                                    "offset": 0,
                                    "length": 13,
                                    "confidenceScore": 0.8022353
                                }
                            ],
                            "warnings": []
                        }
                    ],
                "errors": [],
                "statistics": {
                    "documentsCount":0,
                    "erroneousDocumentsCount":0,
                    "transactionsCount":0
                }
                    }
                }
            ]
        }
    }
```
