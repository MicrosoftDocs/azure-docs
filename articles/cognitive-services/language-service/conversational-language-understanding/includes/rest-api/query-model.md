---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
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
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest released [model version](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data). | `2022-03-01-preview` |


### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Request body

```json
{
    "kind": "CustomConversation",
    "analysisInput": {
        "conversationItem": {
            "participantId":"{JOB-NAME}",
            "id":"{JOB-NAME}",
            "modality":"text",
            "text":"{TEST-UTTERANCE}",
            "language":"{LANGUAGE-CODE}",
        }
    },
    "parameters": {
        "projectName": "{PROJECT-NAME}",
        "deploymentName": "{DEPLOYMENT-NAME}"
        }
}
```


|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `participantId` | `{JOB-NAME}` |  | `"MyJobName` |
| `id` | `{JOB-NAME}` |  | `"MyJobName` |
| `text` | `{TEST-UTTERANCE}` | The utterance that you want to predict its intent and extract entities from. | `"Read Matt's email` |
| `language` | `{LANGUAGE-CODE}` | A string specifying the language code for the utterance submitted. Learn more about supported language codes [here](../../language-support.md) |`en-us`|
| `id` | `{JOB-NAME}` |  | `"MyJobName` |
| `projectName` | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive.   | `myProject` |
| `deploymentName` | `{DEPLOYMENT-NAME}` | The name of your deployment. This value is case-sensitive.  | `staging` |

Once you send the request, you will get the following response for the prediction

### Response body

```json
{
    "kind": "CustomConversationResult",
    "results": {
        "query": "Read Matt's email",
        "prediction": {
            "projectKind": "conversation",
            "topIntent": "Read",
            "intents": [
                {
                    "category": "Read",
                    "confidenceScore": 0.9403077
                },
                {
                    "category": "Delete",
                    "confidenceScore": 0.016843017
                },
            ],
            "entities": [
                {
                    "category": "SenderName",
                    "text": "Matt",
                    "offset": 5,
                    "length": 4,
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
