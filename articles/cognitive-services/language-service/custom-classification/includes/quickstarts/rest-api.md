---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include
ms.date: 11/02/2021
ms.author: aahi
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

## Create a new Azure resource and Azure Blob Storage account

Before you can use custom text classification, you will need to create a Text Analytics resource, which will give you the subscription and credentials you will need to create a project and start training a model. You will also need an Azure blob storage account, which is the required online data storage to hold text for analysis. 

> [!IMPORTANT]
> To get started quickly, we recommend creating a new Azure Text Analytics resource using the steps provided below, which will let you create the resource, and configure a storage account at the same time, which is easier than doing it later. 
>
> If you have a pre-existing resource you'd like to use, you will need to configure it and a storage account separately. See the [**Project requirements**](../../how-to/project-requirements.md#using-a-pre-existing-azure-resource)  for information.

1. Go to the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Text Analytics resource. If you're asked to select additional features, select **Skip this step**. When you create your resource, ensure it has the following parameters.  

    |Azure resource requirement  |Required value  |
    |---------|---------|
    |Location | "West US 2" or "West Europe"         |
    |Pricing tier     | Standard (**S**) pricing tier        |

2. In the **Custom Named Entity Recognition (NER) & Custom Classification (Preview)** section, select **Create a new storage account**. Note that these values are for this quickstart, and not necessarily the [storage account values](/azure/storage/common/storage-account-overview) you will want to use in production environments. 

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Name | Any name |
    | Performance | Standard | 
    | Account kind| Storage (general purpose v1) |
    | Replication | Locally-redundant storage (LRS)
    |Location | Any location closest to you, for best latency.        |


## Upload sample data to blob container

After you have created an Azure storage account and linked it to your Language Service resource, you will need to upload the example files for this quickstart. These files will later be used to train your model.

1. [Download sample data](https://github.com/Azure-Samples/cognitive-services-sample-data-files) for this quickstart from GitHub.

2. Go to your Azure storage account in the [Azure portal](https://ms.portal.azure.com). Navigate to your account, and upload the sample data to it.

The provided sample dataset contains around 200 movie summaries that belongs to one or more of the following classes: "Mystery", "Drama", "Thriller", "Comedy", "Action". You can also find 

### Get your resource keys and endpoint

* Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

* From the menu on the left side, select **Keys and Endpoint**. You will use the endpoint and key for the API requests 

:::image type="content" source="../../media/get-endpoint-azure.png" alt-text="A screenshot showing the key and endpoint page in the Azure portal" lightbox="../../media/get-endpoint-azure.png":::

## Create project

To start creating a custom classification model, you need to create a project. Creating a project will let you tag data, train, evaluate, improve, and deploy your models. 

> [!NOTE]
> The project name is case-sensitive for all operations.

Create a **POST** request using the following URL, headers, and JSON body to create your project.

### Request URL

Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects. 
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Body

Use the following JSON in your request. Replace the placeholder values below with your own values. 

```json
{
    "name": "MyProject",
    "modelType": "MultiClassification",
    "multiLingual": false,
    "description": "My new custom classification project",
    "culture": "en-US",
    "storageInputContainerName": "{YOUR-CONTAINER-NAME}",
    "labelsLocation": "{YOUR-LABEL-FILE-LOCATION}"
}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-CONTAINER-NAME}`     | The name of your Azure blob storage container.   | `myContainer` |
|`{YOUR-LABEL-FILE-LOCATION}`     | The location of the label file in your storage container.   | `myLabels.json` |

This request will return an error if:

* The selected resource doesn't have proper permission for the storage account. 
* The labels file location is not valid.

## Start training your model

After your project has been created, you can begin training a text classification model. Create a **POST** request using the following URL, headers, and JSON body to start training a text classification model.

### Request URL

Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{PROJECT-NAME}/train. 
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Request body

Use the following JSON in your request. The model will be named `MyModel` once training is complete.  

```json
{
    "tasks": [
        {
            "trainingModelName": "MyModel"
        }
    ]
}
```

Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{YOUR-PROJECT-NAME}/train/jobs/{JOB-ID}
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You will use this URL in the next step to get the training status. 

## Get Training Status

Use the following **GET** request to query the status of your model's training process. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 


```rest
{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{PROJECT-NAME}/train/jobs/{jOB-ID}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Response Body

Once you send the request, you will get the following response. 

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

## Publish your model

Generally after training a model you would review it's [evaluation details](../../how-to/view-model-evaluation.md) and [improve model](../../how-to/improve-model.md) if necessary. In this quickstart, you will just publish your model, and make it available for you to try. 

Create a **POST** request using the following URL, headers, and JSON body to start publishing a text classification model.

```rest
{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{PROJECT-NAME}/publish
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Request body

Use the following JSON in your request. the model will be named `MyModel` once training is complete.  

```json
{
  "tasks": [
    {
      "trainingModelName": "MyModel"
    }
  ]
}
```

Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{YOUR-PROJECT-NAME}/train/jobs/{JOB-ID}
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You will use this URL in the next step to get the publishing status.

## Get the publishing status

Use the following **GET** request to query the status of your model's publishing process. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{PROJECT-NAME}/publish/jobs/{JOB-ID}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Response Body

Once you send the request, you will get the following response. 

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

## Start a text classification task

Now that your model is published, you can begin sending text classification tasks to it 

Create a **POST** request using the following URL, headers, and JSON body to start publishing a text classification model.

```rest
{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Request body

Use the following JSON in your request. Replace the `modelId` placeholder value with your own model ID 

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
                        "modelId": "{YOUR-MODEL-ID}",
                        "stringIndexType": "TextElements_v8"
                    }
                }
            ]
        }
    }
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-MODEL-ID}`     | The ID for your model.   | `myModel` |

Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `operation-location` value. It will be formatted like this: 

```rest
{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze/jobs/{JOB-ID}
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You will use this URL in the next step to get the task status and results.

## Get the classification task status and results

After you've created a classification task, you can create a **GET** request to query the status of the task. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze/jobs/{JOB-ID}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| The key to your resource. Used for authenticating your API requests.|

### Response body

The response will be a JSON document with the following parameters.

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

When you no longer need your project, you can delete it with the following **DELETE** request. Replace the placeholder values with your own values.   

```rest
{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{PROJECT-NAME}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| The key to your resource. Used for authenticating your API requests.|
