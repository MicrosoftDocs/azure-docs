---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 06/29/2022
ms.author: aahi
---

Submit a **POST** request using the following URL, headers, and JSON body to submit a training job. Replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/:train?api-version={API-VERSION}
```

| Placeholder |Value | Example |
|---------|---------|---------|
| `{ENDPOINT}` | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| `{PROJECT-NAME}` | The name of your project. This value is case-sensitive.   | `myProject` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. See [Model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2022-05-01` |

#### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

#### Request body

Use the following JSON in your request body. The model will be given the `{MODEL-NAME}` once training is complete. Only successful training jobs will produce models. 


```json
{
	"modelLabel": "{MODEL-NAME}",
	"trainingConfigVersion": "{CONFIG-VERSION}",
	"evaluationOptions": {
		"kind": "percentage",
		"trainingSplitPercentage": 80,
		"testingSplitPercentage": 20
	}
}
```

|Key  |Placeholder  |Value  | Example |
|---------|---------|-----|----|
| modelLabel | `{MODEL-NAME}` | The model name that will be assigned to your model once trained successfully.  | `myModel` |
| trainingConfigVersion | `{CONFIG-VERSION}` | This is the [model version](../../../concepts/model-lifecycle.md) that will be used to train the model. | `2022-05-01`| 
| evaluationOptions |  | Option to split your data across training and testing sets. | `{}` |
| kind | `percentage` |  Split methods. Possible values are `percentage` or `manual`. See [How to train a model](../../how-to/train-model.md#data-splitting) for more information. |`percentage`|
| trainingSplitPercentage | `80`| Percentage of your tagged data to be included in the training set. Recommended value is `80`. | `80`|
| testingSplitPercentage | `20` | Percentage of your tagged data to be included in the testing set. Recommended value is `20`.   | `20` |

  > [!NOTE]
  > The `trainingSplitPercentage` and `testingSplitPercentage` are only required if `Kind` is set to `percentage` and the sum of both percentages should be equal to 100.

Once you send your API request, you’ll receive a `202` response indicating that the job was submitted correctly. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/train/jobs/{JOB-ID}?api-version={API-VERSION}
``` 

`{JOB-ID}` is used to identify your request, since this operation is asynchronous. You can use this URL to get the training status.  
