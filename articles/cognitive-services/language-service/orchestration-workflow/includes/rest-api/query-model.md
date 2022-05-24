---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/17/2022
ms.author: aahi
---

Create a **POST** request using the following URL, headers, and JSON body to start testing an orchestration workflow model.


### Request URL

```rest
{ENDPOINT}/language/:analyze-conversations?projectName={PROJECT-NAME}&deploymentName={DEPLOYMENT-NAME}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{DEPLOYMENT-NAME}`     | The name for your deployment. This value is case-sensitive.   | `staging` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest released [model version](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data). | `2022-03-01-preview` |


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
  "query": "attach a docx file",
  "prediction": {
    "topIntent": "Attach",
    "projectKind": "workflow",
    "intents": [
      { "category": "Attach", "confidenceScore": 0.9998592 },
      { "category": "Read", "confidenceScore": 0.00010551753 },
      { "category": "Delete", "confidenceScore": 3.5209276e-5 }
    ]
  }
}


```
