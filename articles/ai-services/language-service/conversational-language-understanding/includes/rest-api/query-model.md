---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 05/13/2022
ms.author: aahi
---

Create a **POST** request using the following URL, headers, and JSON body to start testing a conversational language understanding model.


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

### Request body

```json
{
  "kind": "Conversation",
  "analysisInput": {
    "conversationItem": {
      "id": "1",
      "participantId": "1",
      "text": "Text 1"
    }
  },
  "parameters": {
    "projectName": "{PROJECT-NAME}",
    "deploymentName": "{DEPLOYMENT-NAME}",
    "stringIndexType": "TextElement_V8"
  }
}
```


|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `participantId` | `{JOB-NAME}` |  | `"MyJobName` |
| `id` | `{JOB-NAME}` |  | `"MyJobName` |
| `text` | `{TEST-UTTERANCE}` | The utterance that you want to predict its intent and extract entities from. | `"Read Matt's email` |
| `projectName` | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive.   | `myProject` |
| `deploymentName` | `{DEPLOYMENT-NAME}` | The name of your deployment. This value is case-sensitive.  | `staging` |

Once you send the request, you will get the following response for the prediction

### Response body

```json
{
  "kind": "ConversationResult",
  "result": {
    "query": "Text1",
    "prediction": {
      "topIntent": "inten1",
      "projectKind": "Conversation",
      "intents": [
        {
          "category": "intent1",
          "confidenceScore": 1
        },
        {
          "category": "intent2",
          "confidenceScore": 0
        },
        {
          "category": "intent3",
          "confidenceScore": 0
        }
      ],
      "entities": [
        {
          "category": "entity1",
          "text": "text1",
          "offset": 29,
          "length": 12,
          "confidenceScore": 1
        }
      ]
    }
  }
}
```

|Key|Sample Value|Description|
|--|--|--|
|query|"Read Matt's email"|the text you submitted for query.|
|topIntent|"Read"|The predicted intent with highest confidence score.|
|intents|[]| A list of all the intents that were predicted for the query text each of them with a confidence score.|
|entities|[]| array containing list of extracted entities from the query text.|


## API response for a conversations project

In a conversations project, you'll get predictions for both your intents and entities that are present within your project. 
* The intents and entities include a confidence score between 0.0 to 1.0 associated with how confident the model is about predicting a certain element in your project. 
* The top scoring intent is contained within its own parameter.
* Only predicted entities will show up in your response.
* Entities indicate:
    * The text of the entity that was extracted
    * Its start location denoted by an offset value
    * The length of the entity text denoted by a length value.
