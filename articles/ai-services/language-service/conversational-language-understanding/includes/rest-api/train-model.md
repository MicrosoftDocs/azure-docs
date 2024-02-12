---
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---


Create a **POST** request using the following URL, headers, and JSON body to submit a training job. 

### Request URL

Use the following URL when creating your API request. Replace the placeholder values with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/:train?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `EmailApp` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

 
### Request body

Use the following object in your request. The model will be named after the value you use for the `modelLabel` parameter once training is complete.  

```json
{
  "modelLabel": "{MODEL-NAME}",
  "trainingMode": "{TRAINING-MODE}",
  "trainingConfigVersion": "{CONFIG-VERSION}",
  "evaluationOptions": {
    "kind": "percentage",
    "testingSplitPercentage": 20,
    "trainingSplitPercentage": 80
  }
}
```
|Key  |Placeholder|Value  | Example |
|---------|-----|----|---------|
|`modelLabel`    | `{MODEL-NAME}`|Your Model name.   | `Model1` |
| `trainingConfigVersion` |`{CONFIG-VERSION}`| The training configuration model version. By default, the latest [model version](../../../concepts/model-lifecycle.md#custom-features) is used. | `2022-05-01` |
| `trainingMode` |`{TRAINING-MODE}`| The training mode to be used for training. Supported modes are **Standard training**, faster training, but only available for English and **Advanced training** supported for other languages and multilingual projects, but involves longer training times. Learn more about [training modes](../../how-to/train-model.md#training-modes). | `standard` |
| `kind` | `percentage` |  Split methods. Possible Values are `percentage` or `manual`. See [how to train a model](../../how-to/train-model.md#data-splitting) for more information. |`percentage`|
| `trainingSplitPercentage` | `80`| Percentage of your tagged data to be included in the training set. Recommended value is `80`. | `80`|
| `testingSplitPercentage` | `20` | Percentage of your tagged data to be included in the testing set. Recommended value is `20`.   | `20` |

  > [!NOTE]
  > The `trainingSplitPercentage` and `testingSplitPercentage` are only required if `Kind` is set to `percentage` and the sum of both percentages should be equal to 100.

Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `operation-location` value. It will be formatted like this: 

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/train/jobs/{JOB-ID}?api-version={API-VERSION}
``` 

You can use this URL to get the training job status.
