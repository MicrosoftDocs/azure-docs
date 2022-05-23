---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/04/2022
ms.author: aahi
---

Use this **POST** request to start a text classification task.

```rest
{ENDPOINT}/text/analytics/v3.2-preview.2/analyze
```

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your subscription key that provides access to this API.|

#### Body

# [Multi label classification](#tab/multi-classification)

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
        "customMultiLabelClassificationTasks": [
            {
                "parameters": {
                    "project-name": "{PROJECT-NAME}",
                    "deployment-name": "{DEPLOYMENT-NAME}"
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
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the document. If this key isn't specified, the service will assume the default language of the project that was selected during project creation. See [language support](../../language-support.md) for a list of supported language codes. |`en-us`|
| `text` | `{DOC-TEXT}` | Document task to run the tasks on. | `Lorem ipsum dolor sit amet` |
|`tasks`| | List of tasks we want to perform.|`[]`|
| `customMultiLabelClassificationTasks` | |Task identifier for task we want to perform. | |
|`parameters`| |List of parameters to pass to the task.| |
| `project-name` |`{PROJECT-NAME}` | The name for your project. This value is case-sensitive.  | `myProject` |
| `deployment-name` |`{DEPLOYMENT-NAME}` | The name of your deployment. This value is case-sensitive.  | `prod` |

# [Single label classification](#tab/single-classification)

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
        "customSingleLabelClassificationTasks": [
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
| displayName | `{JOB-NAME}` | Your job name. | `MyJobName` |
| documents | | List of documents to run tasks on. |  |
| `id` | `{DOC-ID}` | Document name or ID. | `doc1`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the document. If this key isn't specified, the service will assume the default language of the project that was selected during project creation. See [language support](../../language-support.md) for a list of supported language codes. |`en-us`|
| `text` | `{DOC-TEXT}` | Document task to run the tasks on. | `Lorem ipsum dolor sit amet` |
|`tasks`| | List of tasks we want to perform.| |
| `customSingleLabelClassificationTasks` ||Task identifier for task we want to perform. | |
|`parameters`| |List of parameters to pass to the task.| |
| `project-name` |`{PROJECT-NAME}` | The name for your project. This value is case-sensitive.  | `myProject` |
| `deployment-name` |`{DEPLOYMENT-NAME}` | The name of your deployment. This value is case-sensitive.  | `prod` |

---

#### Response

You will receive a 202 response indicating success. In the response **headers**, extract `operation-location`.
`operation-location` is formatted like this:

 `{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId>`

You can use this URL to query the task completion status and get the results when task is completed.
