---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/05/2022
ms.author: aahi
---

Use this **POST** request to submit an entity extraction task.

```rest
{ENDPOINT}/text/analytics/v3.2-preview.2/analyze
```

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your subscription key that provides access to this API.|

#### Body

```json
{
    "displayName": "{JOB-NAME}",
    "analysisInput": {
        "documents": [
            {
                "id": "{DOC-ID}",
                "language": "{LANGUAGE-CODE}",
                "text": "{DOC-TEXT}"
            },
            {
                "id": "{DOC-ID}",
                "language": "{LANGUAGE-CODE}",
                "text": "{DOC-TEXT}"
            }
        ]
    },
    "tasks": {
        "customEntityRecognitionTasks": [
            {
                "parameters": {
                    "project-name": "`{PROJECT-NAME}`",
                    "deployment-name": "`{DEPLOYMENT-NAME}`"
                }
            }
        ]
    }
}
```


|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `displayName` | `{JOB-NAME}` | Your job name. | `MyJobName` |
| `documents` | [{},{}] | List of documents to run tasks on. | `[{},{}]` |
| `id` | `{DOC-ID}` | Document name or ID. | `doc1`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the document. In case this key is not specified, the service will assume the default language of the project that was selected during project creation. See [language support](../../language-support.md) to learn more about supported language codes. |`en-us`|
| `text` | `{DOC-TEXT}` | Document task to run the tasks on. | `Lorem ipsum dolor sit amet` |
|`tasks`|`[]`| List of tasks we want to perform.|`[]`|
| |customEntityRecognitionTasks|Task identifer for task we want to perform. | |
|`parameters`|`[]`|List of parameters to pass to task|`[]`|
| `project-name` |`{PROJECT-NAME}` | The name for your project. This value is case-sensitive.  | `myProject` |
| `deployment-name` |`{DEPLOYMENT-NAME}` | The name of your deployment. This value is case-sensitive.  | `prod` |


#### Response

You will receive a 202 response indicating that your task has been submitted successfully. In the response **headers**, extract `operation-location`.
`operation-location` is formatted like this:

```rest
{ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/{JOB-ID}
```

You can use this URL to query the task completion status and get the results when task is completed.
