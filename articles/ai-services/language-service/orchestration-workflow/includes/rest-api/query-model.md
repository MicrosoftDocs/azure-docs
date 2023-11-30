---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 05/17/2022
ms.author: aahi
---

Create a **POST** request using the following URL, headers, and JSON body to start testing an orchestration workflow model.

### Request URL

```rest
{ENDPOINT}/language/:analyze-conversations?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |


### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Request Body

```json
{
  "kind": "Conversation",
  "analysisInput": {
    "conversationItem": {
      "text": "Text1",
      "participantId": "1",
      "id": "1"
    }
  },
  "parameters": {
    "projectName": "{PROJECT-NAME}",
    "deploymentName": "{DEPLOYMENT-NAME}",
    "directTarget": "qnaProject",
    "targetProjectParameters": {
      "qnaProject": {
        "targetProjectKind": "QuestionAnswering",
        "callingOptions": {
          "context": {
            "previousUserQuery": "Meet Surface Pro 4",
            "previousQnaId": 4
          },
          "top": 1,
          "question": "App Service overview"
        }
      }
    }
  }
}
```

### Response Body

Once you send the request, you will get the following response for the prediction!

```json
{
  "kind": "ConversationResult",
  "result": {
    "query": "App Service overview",
    "prediction": {
      "projectKind": "Orchestration",
      "topIntent": "qnaTargetApp",
      "intents": {
        "qnaTargetApp": {
          "targetProjectKind": "QuestionAnswering",
          "confidenceScore": 1,
          "result": {
            "answers": [
              {
                "questions": [
                  "App Service overview"
                ],
                "answer": "The compute resources you use are determined by the *App Service plan* that you run your apps on.",
                "confidenceScore": 0.7384000000000001,
                "id": 1,
                "source": "https://learn.microsoft.com/azure/app-service/overview",
                "metadata": {},
                "dialog": {
                  "isContextOnly": false,
                  "prompts": []
                }
              }
            ]
          }
        }
      }
    }
  }
}

```
