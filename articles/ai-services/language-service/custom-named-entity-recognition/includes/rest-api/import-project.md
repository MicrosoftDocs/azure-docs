---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/05/2022
ms.author: aahi
---

Submit a **POST** request using the following URL, headers, and JSON body to import your labels file. Make sure that your labels file follow the [accepted format](../../concepts/data-formats.md).

If a project with the same name already exists, the data of that project is replaced.

```rest
{Endpoint}/language/authoring/analyze-text/projects/{projectName}/:import?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. See [Model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2022-05-01` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Body

Use the following JSON in your request. Replace the placeholder values below with your own values. 

```json
{
    "projectFileVersion": "{API-VERSION}",
    "stringIndexType": "Utf16CodeUnit",
    "metadata": {
        "projectName": "{PROJECT-NAME}",
        "projectKind": "CustomEntityRecognition",
        "description": "Trying out custom NER",
        "language": "{LANGUAGE-CODE}",
        "multilingual": true,
        "storageInputContainerName": "{CONTAINER-NAME}",
        "settings": {}
    },
    "assets": {
    "projectKind": "CustomEntityRecognition",
        "entities": [
            {
                "category": "Entity1"
            },
            {
                "category": "Entity2"
            }
        ],
        "documents": [
            {
                "location": "{DOCUMENT-NAME}",
                "language": "{LANGUAGE-CODE}",
                "dataset": "{DATASET}",
                "entities": [
                    {
                        "regionOffset": 0,
                        "regionLength": 500,
                        "labels": [
                            {
                                "category": "Entity1",
                                "offset": 25,
                                "length": 10
                            },
                            {
                                "category": "Entity2",
                                "offset": 120,
                                "length": 8
                            }
                        ]
                    }
                ]
            },
            {
                "location": "{DOCUMENT-NAME}",
                "language": "{LANGUAGE-CODE}",
                "dataset": "{DATASET}",
                "entities": [
                    {
                        "regionOffset": 0,
                        "regionLength": 100,
                        "labels": [
                            {
                                "category": "Entity2",
                                "offset": 20,
                                "length": 5
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `api-version` | `{API-VERSION}` | The version of the API you are calling. The version used here must be the same API version in the URL. Learn more about other available [API versions](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data)  | `2022-03-01-preview` |
| `projectName` | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `myProject` |
| `projectKind` | `CustomEntityRecognition` | Your project kind. | `CustomEntityRecognition` |
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the documents used in your project. If your project is a multilingual project, choose the [language code](../../language-support.md) of the majority of the documents. |`en-us`|
| `multilingual` | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily included in your training documents. See [language support](../../language-support.md#multi-lingual-option) for information on multilingual support.  | `true`|
| `storageInputContainerName` | {CONTAINER-NAME} | The name of your Azure storage container where you have uploaded your documents.   | `myContainer` |
| `entities` |  | Array containing all the entity types you have in the project. These are the entity types that will be extracted from your documents into.| |
| `documents` | | Array containing all the documents in your project and list of the entities labeled within each document. | [] |
| `location` | `{DOCUMENT-NAME}` |  The location of the documents in the storage container. Since all the documents are in the root of the container this should be the document name.|`doc1.txt`|
| `dataset` | `{DATASET}` |  The test set to which this file will go to when split before training. See [How to train a model](../../how-to/train-model.md#data-splitting) for more information on how your data is split. Possible values for this field are `Train` and `Test`.      |`Train`|


Once you send your API request, you’ll receive a `202` response indicating that the job was submitted correctly. In the response headers, extract the `operation-location` value. It will be formatted like this: 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/import/jobs/{JOB-ID}?api-version={API-VERSION}
``` 

`{JOB-ID}` is used to identify your request, since this operation is asynchronous. You’ll use this URL to get the import job status.  

Possible error scenarios for this request:

* The selected resource doesn't have [proper permissions](../../how-to/create-project.md#using-a-pre-existing-language-resource) for the storage account.
* The `storageInputContainerName` specified doesn't exist.
* Invalid language code is used, or if the language code type isn't string.
* `multilingual` value is a string and not a boolean.
