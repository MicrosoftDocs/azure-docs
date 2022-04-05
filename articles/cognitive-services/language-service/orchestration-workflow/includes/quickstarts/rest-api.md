---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 01/27/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).
* The current version of [cURL](https://curl.haxx.se/).
* A Language resource. If you don't have one, you can create one using the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics). If you create a new resource, click the link, follow the steps, and wait for it to deploy. Then click **Go to resource**.

## Get your resource keys and endpoint

1. Go to your resource overview page in the [Azure portal](https://portal.azure.com/#home).
2. From the menu on the left side, select **Keys and Endpoint**. You will use the endpoint and key for the API requests 

    :::image type="content" source="../../../media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the key and endpoint page in the Azure portal" lightbox="../../../media/azure-portal-resource-credentials.png":::

## Import a project

To get started, you can import a CLU JSON into the service. The quickstart will provide a sample JSON below that sets up a couple of intents and entities for an email application called "OrchestrationApp". 

Create a **POST** request using the following URL, headers, and JSON body to create your project.

### Request URL

Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/language/analyze-conversations/projects/OrchestrationApp/:import?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|
| `format` | `clu` |

### Body

Use the following sample JSON as your body.

```json
{
    "api-version": "2021-11-01-preview",
    "metadata": {
        "name": "OrchestrationApp",
        "description": "",
        "type": "Workflow",
        "multilingual": false,
        "language": "en-us",
        "settings": {
            "confidenceThreshold": 0.7
        }
    },
    "assets": {
        "intents": [
            {
                "name": "Greeting"
            },
            {
                "name": "CLU.Synonyms",
                "orchestration": {
                    "type": "Clu",
                    "cluOrchestration": {
                        "projectName": "SynonymsProject",
                        "deploymentName": "production"
                    }
                }
            },
            {
                "name": "CLU.Email",
                "orchestration": {
                    "type": "Clu",
                    "cluOrchestration": {
                        "projectName": "EmailApp",
                        "deploymentName": "production"
                    }
                }
            },
            {
                "name": "None"
            }
        ],
        "entities": [],
        "examples": [
            {
                "text": "hello Baher",
                "language": "en-us",
                "intent": "Greeting",
                "entities": [],
                "dataset": "Train"
            },
            {
                "text": "Good evening",
                "language": "en-us",
                "intent": "Greeting",
                "entities": []
            },
            {
                "text": "Good morning",
                "language": "en-us",
                "intent": "Greeting",
                "entities": []
            },
            {
                "text": "hey",
                "language": "en-us",
                "intent": "Greeting",
                "entities": []
            },
            {
                "text": "What's up",
                "language": "en-us",
                "intent": "Greeting",
                "entities": []
            },
            {
                "text": "How are you doing",
                "language": "en-us",
                "intent": "Greeting",
                "entities": []
            },
            {
                "text": "How are you",
                "language": "en-us",
                "intent": "Greeting",
                "entities": []
            },
            {
                "text": "Hello",
                "language": "en-us",
                "intent": "Greeting",
                "entities": []
            },
            {
                "text": "Hi",
                "language": "en-us",
                "intent": "Greeting",
                "entities": []
            }
        ]
    }
}
```

## Start training your model

After your project has been imported, you can begin training a model. Create a **POST** request using the following URL, headers, and JSON body to start training.

### Request URL

Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/language/analyze-conversations/projects/OrchestrationApp/:train?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|
|`Content-Type` | application/json |
 
### Request body

Use the following object in your request. The model will be named `MyModel` once training is complete.  

```json
{
  "modelLabel":"MyModel",
  "RunVerification":false
}
```

Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-ENDPOINT}/language/analyze-conversations/projects/OrchestrationApp/train/jobs/{JOB-ID}?api-version=2021-11-01-preview
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You will use this URL in the next step to get the training status. 

## Get Training Status

Use the following **GET** request to query the status of your model's training process. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

### Request URL

```rest
{YOUR-ENDPOINT}/language/analyze-conversations/projects/OrchestrationApp/train/jobs/{JOB-ID}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Response Body

Once you send the request, you will get the following response. Keep polling this endpoint until the **status** parameter changes to "succeeded". 

```json
{
    "result":
    {
          "trainedModelLabel":"MyModel",
          "trainStatus":{"percentComplete":0,"elapsedTime":null},
          "evaluationStatus":{"percentComplete":0,"elapsedTime":null}
     },
    "jobId":"{JOB-ID}",
    "createdDateTime":"{CREATED-TIME}",
    "lastUpdatedDateTime":"{UPDATED-TIME}",
    "expirationDateTime":"{EXPIRATION-TIME}",
    "status":"running"
}
```

## Deploy your model

Once training is completed, you can deploy your model for predictions. 

Create a **PUT** request using the following URL, headers, and JSON body to start deploying an orchestration model.


### Request URL

```rest
{YOUR-ENDPOINT}/language/analyze-conversations/projects/OrchestrationApp/deployments/production?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |


### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|
|`Content-Type` | application/json |

### Request Body

```json
{
  "trainedModelLabel":"MyModel",
  "deploymentName":"production"
}
```

Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-ENDPOINT}/language/analyze-conversations/projects/OrchestrationApp/deployments/production/jobs/{JOB-ID}?api-version=2021-11-01-preview
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You will use this URL in the next step to get the training status.

## Get Deployment Status

Use the following **GET** request to query the status of your model's deployment process. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

### Request URL

```rest
{YOUR-ENDPOINT}/language/analyze-conversations/projects/OrchestrationApp/deployments/production/jobs/{JOB-ID}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Response Body

Once you send the request, you will get the following response. Keep polling this endpoint until the **status** parameter changes to "succeeded". 

```json
{
    "jobId":"{JOB-ID}",
    "createdDateTime":"{CREATED-TIME}",
    "lastUpdatedDateTime":"{UPDATED-TIME}",
    "expirationDateTime":"{EXPIRATION-TIME}",
    "status":"running"
}
```

## Query Model

Once deployment succeeds, you can begin querying your project for predictions. 

Create a **POST** request using the following URL, headers, and JSON body to start deploying an orchestration model.

### Request URL

```rest
{YOUR-ENDPOINT}/language/:analyze-conversations?projectName=OrchestrationApp&deploymentName=production&api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|
|`Content-Type` | application/json |

### Request Body

```json
{
  "query":"attach a docx file"
}
```

### Response Body

Once you send the request, you will get the following response for the prediction!

```json
{
    "query":"attach a docx file",
    "prediction": {
        "topIntent":"Attach",
        "projectKind":"orchestration",
        "intents":[{"category":"Attach","confidenceScore":0.9998592},{"category":"Read","confidenceScore":0.00010551753},{"category":"Delete","confidenceScore":3.5209276E-05}],
        "entities":[{"category":"FileType","text":"docx","offset":9,"length":4,"confidenceScore":1}]
     }
}
```
