---
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/24/2022
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
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. Learn more about other available [API versions](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data)  | `2022-05-01` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Body

Use the following JSON in your request. Replace the placeholder values below with your own values. 

# [Multi label classification](#tab/multi-classification)

```json
{
  "projectFileVersion": "{API-VERSION}",
  "stringIndexType": "Utf16CodeUnit",
  "metadata": {
    "projectName": "{PROJECT-NAME}",
    "storageInputContainerName": "{CONTAINER-NAME}",
    "projectKind": "customMultiLabelClassification",
    "description": "Trying out custom multi label text classification",
    "language": "{LANGUAGE-CODE}",
    "multilingual": true,
    "settings": {}
  },
  "assets": {
    "projectKind": "customMultiLabelClassification",
    "classes": [
      {
        "category": "Class1"
      },
      {
        "category": "Class2"
      }
    ],
    "documents": [
      {
        "location": "{DOCUMENT-NAME}",
        "language": "{LANGUAGE-CODE}",
        "dataset": "{DATASET}",
        "classes": [
          {
            "category": "Class1"
          },
          {
            "category": "Class2"
          }
        ]
      },
      {
        "location": "{DOCUMENT-NAME}",
        "language": "{LANGUAGE-CODE}",
        "dataset": "{DATASET}",
        "classes": [
          {
            "category": "Class2"
          }
        ]
      }
    ]
  }
}

```
|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| api-version | `{API-VERSION}` | The version of the API you are calling. The version used here must be the same API version in the URL. Learn more about other available [API versions](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) | `2022-05-01` |
| projectName | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `myProject` |
| projectKind | `customMultiLabelClassification` | Your project kind. | `customMultiLabelClassification` |
| language | `{LANGUAGE-CODE}` |  A string specifying the language code for the documents used in your project. If your project is a multilingual project, choose the language code of the majority of the documents. See [language support](../../language-support.md#multi-lingual-option) to learn more about multilingual support. |`en-us`|
| multilingual | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily included in your training documents. See [language support](../../language-support.md#multi-lingual-option) to learn more about multilingual support. | `true`|
| storageInputContainerName | `{CONTAINER-NAME}` | The name of your Azure storage container where you have uploaded your documents.   | `myContainer` |
| classes | [] | Array containing all the classes you have in the project. These are the classes you want to classify your documents into.| [] |
| documents | [] | Array containing all the documents in your project and what the classes labeled for this document. | [] |
| location | `{DOCUMENT-NAME}` |  The location of the documents in the storage container. Since all the documents are in the root of the container this should be the document name.|`doc1.txt`|
| dataset | `{DATASET}` |  The test set to which this document will go to when split before training. See [How to train a model](../../how-to/train-model.md#data-splitting) for more information on data splitting. Possible values for this field are `Train` and `Test`.      |`Train`|


# [Single label classification](#tab/single-classification)

```json
{
  "projectFileVersion": "{API-VERSION}",
  "stringIndexType": "Utf16CodeUnit",
  "metadata": {
    "projectName": "{PROJECT-NAME}",
    "storageInputContainerName": "{CONTAINER-NAME}",
    "projectKind": "customSingleLabelClassification",
    "description": "Trying out custom multi label text classification",
    "language": "{LANGUAGE-CODE}",
    "multilingual": true,
    "settings": {}
  },
  "assets": {
    "projectKind": "customSingleLabelClassification",
        "classes": [
            {
                "category": "Class1"
            },
            {
                "category": "Class2"
            }
        ],
        "documents": [
            {
                "location": "{DOCUMENT-NAME}",
                "language": "{LANGUAGE-CODE}",
                "dataset": "{DATASET}",
                "class": {
                    "category": "Class2"
                }
            },
            {
                "location": "{DOCUMENT-NAME}",
                "language": "{LANGUAGE-CODE}",
                "dataset": "{DATASET}",
                "class": {
                    "category": "Class1"
                }
            }
        ]
    }
}
```
|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| api-version | `{API-VERSION}` | The version of the API you are calling. The version used here must be the same API version in the URL. | `2022-05-01` |
| projectName | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `myProject` |
| projectKind | `customSingleLabelClassification` | Your project kind. | `customSingleLabelClassification` |
| language | `{LANGUAGE-CODE}` |  A string specifying the language code for the documents used in your project. If your project is a multilingual project, choose the language code of the majority of the documents. See [language support](../../language-support.md) to learn more about supported language codes. |`en-us`|
| multilingual | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily included in your training documents. See [language support](../../language-support.md#multi-lingual-option) to learn more about multilingual support.  | `true`|
| storageInputContainerName | `{CONTAINER-NAME}` | The name of your Azure storage container where you have uploaded your documents.   | `myContainer` |
| classes | [] | Array containing all the classes you have in the project. These are the classes you want to classify your documents into.| [] |
| documents | [] | Array containing all the documents in your project and which class this document belongs to. | [] |
| location | `{DOCUMENT-NAME}` |  The location of the documents in the storage container. Since all the documents are in the root of the container this should be the document name.|`doc1.txt`|
| dataset | `{DATASET}` |  The test set to which this document will go to when split before training. See [How to train a model](../../how-to/train-model.md#data-splitting) to learn more about data splitting. Possible values for this field are `Train` and `Test`.      |`Train`|

---

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
