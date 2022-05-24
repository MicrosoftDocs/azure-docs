---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/17/2022
ms.author: aahi
---

### Request URL

Create a **POST** request using the following URL, headers, and JSON body to start training. Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/analyze-conversations/projects/{PROJECT-NAME}/:train?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `EmailApp` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest released [model version](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data).  | `2022-03-01-preview` |

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
  "modelLabel": "{MODEL-NAME}",
  "trainingConfigVersion": "{CONFIG-VERSION}",
  "trainingMode": "{TRAINING-MODE}",
  "evaluationOptions": {
    "kind": "percentage",
    "trainingSplitPercentage": 80,
    "testingSplitPercentage": 20
  }
}
```
|Key  |Placeholder|Value  | Example |
|---------|-----|----|---------|
|`modelLabel`    | `{MODEL-NAME}`|Your model name.   | `Model1` |
| `trainingConfigVersion` |`{CONFIG-VERSION}`| The [training configuration version](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data). By default, the latest version is used. | `2022-05-01` |
| `trainingMode` |`{TRAINING-MODE}`| Your training mode. | `advanced` |

Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `operation-location` value. It will be formatted like this: 

```rest
{ENDPOINT}/language/analyze-conversations/projects/{PROJECT-NAME}/train/jobs/{JOB-ID}?api-version={API-VERSION}
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You will use this URL in the next step to get the training status. 
