---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 04/06/2022
ms.author: aahi
---

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
|project-name| "MyProject"| Your project name. The project name is case-sensitive.|
|deployment-name| "MyDeploymentName"| Your deployment name|

#### Response

You will receive a 202 response indicating success. In the response **headers**, extract `operation-location`.
`operation-location` is formatted like this:

 `{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId>`

You will use this endpoint in the next step to get the custom recognition task results.
