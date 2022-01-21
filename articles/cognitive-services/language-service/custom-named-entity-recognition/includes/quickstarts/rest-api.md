---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 11/02/2021
ms.author: aahi
ms.custom: ignite-fall-2021
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

## Create a new Azure resource and Azure Blob Storage account

Before you can use custom NER, you will need to create an Azure Language resource, which will give you the credentials needed to create a project and start training a model. You will also need an Azure storage account, where you can upload your dataset that will be used to building your model.

> [!IMPORTANT]
> To get started quickly, we recommend creating a new Azure Language resource using the steps provided below, which will let you create the resource, and configure a storage account at the same time, which is easier than doing it later.
>
> If you have a pre-existing resource you'd like to use, you will need to configure it and a storage account separately. See [project creation article](../../how-to/create-project.md#using-a-pre-existing-azure-resource)  for information.

1. Go to the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Language resource. If you're asked to select additional features, select **Custom text classification & custom NER**. When you create your resource, ensure it has the following parameters.

    |Azure resource requirement  |Required value  |
    |---------|---------|
    |Location | "West US 2" or "West Europe"         |
    |Pricing tier     | Standard (**S**) pricing tier        |

2. In the **Custom Named Entity Recognition (NER) & Custom Classification (Preview)** section, select an existing storage account or select **Create a new storage account**. Note that these values are for this quickstart, and not necessarily the [storage account values](../../../../../storage/common/storage-account-overview.md) you will want to use in production environments.

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Name | Any name |
    | Performance | Standard |
    | Account kind| Storage (general purpose v1) |
    | Replication | Locally-redundant storage (LRS)
    |Location | Any location closest to you, for best latency.        |


## Upload sample data to blob container

After you have created an Azure storage account and linked it to your Language resource, you will need to upload the example files to the root directory of your container for this quickstart. These files will later be used to train your model.

1. [Download the example data](https://go.microsoft.com/fwlink/?linkid=2175226) for this quickstart from GitHub.

2. Go to your Azure storage account in the [Azure portal](https://ms.portal.azure.com). Navigate to your account, and upload the sample data to it.

The provided sample dataset contains 20 loan agreements, each agreement is two parties a Lender and a Borrower. You can use the provided sample tags file to extract relevant information for both parties, an agreement date, a loan amount, and an interest rate.

### Get your resource keys endpoint

* Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

* From the menu of the left side of the screen, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.
:::image type="content" source="../../../media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the key and endpoint screen for an Azure resource." lightbox="../../../media/azure-portal-resource-credentials.png":::

## Create a custom NER project

Once your resource and storage container are configured, create a new custom NER project. A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and others who have contributor access to the Azure resource being used.

> [!NOTE]
> The project name is case sensitive for all operations.

Create a **POST** request using the following URL, headers, and JSON body to create your project and import the tags file.

Use the following URL to create a project and import your tags file. Replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/language/analyze-text/projects/{projectName}/:import?api-version=2021-11-01-preview
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

Use the following JSON in your request. Replace the placeholder values below with your own values. Use the tags file available in the [sample data](https://github.com/Azure-Samples/cognitive-services-sample-data-files) tab

```json
{
    "api-version": "2021-11-01-preview",
    "metadata": {
        "name": "MyProject",
        "multiLingual": true,
        "description": "Trying out custom NER",
        "modelType": "Extraction",
        "language": "string",
        "storageInputContainerName": "YOUR-CONTAINER-NAME",
        "settings": {}
    },
    "assets": {
        "extractors": [
        {
            "name": "Entity1"
        },
        {
            "name": "Entity2"
        }
    ],
    "documents": [
        {
            "location": "doc1.txt",
            "language": "en-us",
            "extractors": [
                {
                    "regionOffset": 0,
                    "regionLength": 500,
                    "labels": [
                        {
                            "extractorName": "Entity1",
                            "offset": 25,
                            "length": 10
                        },                    
                        {
                            "extractorName": "Entity2",
                            "offset": 120,
                            "length": 8
                        }
                    ]
                }
            ]
        },
        {
            "location": "doc2.txt",
            "language": "en-us",
            "extractors": [
                {
                    "regionOffset": 0,
                    "regionLength": 100,
                    "labels": [
                        {
                            "extractorName": "Entity2",
                            "offset": 20,
                            "length": 5
                        }
                    ]
                }
            ]
        }
    ]
    }
}
```
For the metadata key: 

|Key  |Value  | Example |
|---------|---------|---------|
| `modelType  `    | Your Model type. | Extraction |
|`storageInputContainerName`   | The name of your Azure blob storage container.   | `myContainer` |

This request will return an error if:

* The selected resource doesn't have proper permission for the storage account. 

## Start training your model

After your project has been created, you can begin training a custom NER model. Create a **POST** request using the following URL, headers, and JSON body to start training an NER model.
ate a **POST** request using the following URL, headers, and JSON body to start training a text classification model.

### Request URL

Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/:train?api-version=2021-11-01-preview
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
  "modelLabel": "MyModel",
  "runValidation": true
}
```

|Key  |Value  | Example |
|---------|---------|---------|
|`modelLabel  `    | Your Model name.   | MyModel |
|`runValidation`     | Boolean value to run validation on the test set.   | True |

Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-ENDPOINT}/language/analyze-text/projects/{YOUR-PROJECT-NAME}/train/jobs/{JOB-ID}?api-version=2021-11-01-preview
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You will use this URL in the next step to get the training status. 

## Get Training Status

Use the following **GET** request to query the status of your model's training process. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/language/analyze-text/projects/{YOUR-PROJECT-NAME}/train/jobs/{JOB-ID}?api-version=2021-11-01-preview
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
  "jobs": [
    {
      "result": {
        "trainedModelLabel": "MyModel",
        "trainStatus": {
          "percentComplete": 0,
          "elapsedTime": "string"
        },
        "evaluationStatus": {
          "percentComplete": 0,
          "elapsedTime": "string"
        }
      },
      "jobId": "string",
      "createdDateTime": "2021-10-19T23:24:41.572Z",
      "lastUpdatedDateTime": "2021-10-19T23:24:41.572Z",
      "expirationDateTime": "2021-10-19T23:24:41.572Z",
      "status": "unknown",
      "errors": [
        {
          "code": "unknown",
          "message": "string"
        }
      ]
    }
  ],
  "nextLink": "string"
}
```
## Deploy your model

Create a **PUT** request using the following URL, headers, and JSON body to start deploying a custom NER model.

```rest
{YOUR-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{DEPLOYMENT-NAME}`     | The name of your deployment. This value is case-sensitive.  | `prod` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Request body

Use the following JSON in your request. The model will be named `MyModel` once training is complete.  

```json
{
  "trainedModelLabel": "MyModel"
}
```

Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-ENDPOINT}/language/analyze-text/projects/{YOUR-PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}/jobs/{JOB-ID}?api-version=2021-11-01-preview
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You will use this URL in the next step to get the publishing status.

## Get the deployment status

Use the following **GET** request to query the status of your model's publishing process. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/language/analyze-text/projects/{YOUR-PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}/jobs/{JOB-ID}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{DEPLOYMENT-NAME}`     | The name of your deployment. This value is case-sensitive.  | `prod` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Submit custom NER task

Now that your model is deployed, you can begin sending entity recognition tasks to it 

> [!NOTE]
> Project names is case sensitive.

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

### Response Body

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
|`{PROJECT-NAME}`     | The name for your project. This value is case sensitive.  | `myProject` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| The key to your resource. Used for authenticating your API requests.|
