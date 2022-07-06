---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/24/2022
ms.author: aahi
---

> [!NOTE]
> Project names are case sensitive.

Use this **POST** request to text classification task. Replace `{projectName}` with the project name where you have the model you want to use.

`{ENDPOINT}/language/:analyze-text?api-version={API-VERSION}`

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. See [Model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2022-05-01` |


#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your key that provides access to this API.|

#### Body

```json
{
  "kind": "customMultiClassificationTasks",
  "parameters": {
    "modelVersion": "{CONFIG-VERSION}"
  },
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
  }
}
```

|Key|Sample Value|Description|
|--|--|--|
|`displayName`|"MyJobName"|Your job Name|
|`documents`|[{},{}]|List of documents to run tasks on|
|`id`|`doc1`| A string specifying a document identifier|
|`text`| `Lorem ipsum dolor sit amet` | Your document in a string format|
|`tasks`|[]| List of tasks we want to perform.|
|`customMultiClassificationTasks` | |Task identifier for task we want to perform. Use `customClassificationTasks` for single label classification tasks and `customMultiClassificationTasks` for multi label classification tasks. |
|`parameters` | |List of parameters to pass to the task.|
|`project-name` | `MyProject`| Your project name. The project name is case-sensitive.|
|`deployment-name` | `MyDeploymentName` | Your deployment name. |

Replace the text of the document with movie summaries to classify.

#### Response

You will receive a 200 response indicating success. In the response **headers**, extract `operation-location`.
`operation-location` is formatted like this:

 `{ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId>`

You will use this endpoint to get the custom text classification task results.
