---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 07/19/2023
ms.author: aahi
---

Submit a **POST** request using the following URL, headers, and JSON body to import your labels file. <!--Make sure that your labels file follow the [accepted format](../../concepts/data-formats.md).-->

If a project with the same name already exists, the data of that project is replaced.

```rest
{Endpoint}/language/authoring/analyze-text/projects/{projectName}/:import?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. Learn more about other available [API versions](../../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data)  | `2023-04-15-preview` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Body

Use the following JSON in your request. Replace the placeholder values below with your own values. 

```json
{
  "projectFileVersion": "2023-04-15-preview",
  "stringIndexType": "Utf16CodeUnit",
  "metadata": {
    "projectKind": "CustomTextSentiment",
    "storageInputContainerName": "text-sentiment",
    "projectName": "TestSentiment",
    "multilingual": false,
    "description": "This is a Custom sentiment analysis project.",
    "language": "en-us"
  },
  "assets": {
    "projectKind": "CustomTextSentiment",
    "documents": [
      {
        "location": "documents/document_1.txt",
        "language": "en-us",
        "sentimentSpans": [
            {
                "category": "negative",
                "offset": 0,
                "length": 28
            }
        ]
      },
      {
          "location": "documents/document_2.txt",
          "language": "en-us",
          "sentimentSpans": [
              {
                  "category": "negative",
                  "offset": 0,
                  "length": 24
              }
          ]
      },
      {
          "location": "documents/document_3.txt",
          "language": "en-us",
          "sentimentSpans": [
              {
                  "category": "neutral",
                  "offset": 0,
                  "length": 18
              }
          ]
      }
    ]
  }
}


```
|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| api-version | `{API-VERSION}` | The version of the API you are calling. The version used here must be the same API version in the URL. Learn more about other available [API versions](../../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) | `2023-04-15-preview` |
| projectName | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `myProject` |
| projectKind | `CustomTextSentiment` | Your project kind. | `CustomTextSentiment` |
| language | `{LANGUAGE-CODE}` |  A string specifying the language code for the documents used in your project. If your project is a multilingual project, choose the language code of the majority of the documents. See [language support](../../../language-support.md#multi-lingual-option-custom-sentiment-analysis-only) to learn more about multilingual support. |`en-us`|
| multilingual | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language not necessarily included in your training documents. See [language support](../../../language-support.md#multi-lingual-option-custom-sentiment-analysis-only) to learn more about multilingual support. | `true`|
| storageInputContainerName | `{CONTAINER-NAME}` | The name of your Azure storage container where you have uploaded your documents.   | `myContainer` |
| documents | [] | Array containing all the documents in your project and what the classes labeled for this document. | [] |
| location | `{DOCUMENT-NAME}` |  The location of the documents in the storage container. Since all the documents are in the root of the container this should be the document name.|`doc1.txt`|
| sentimentSpans | `{sentimentSpans}` |  The sentiment of a document (positive, neutral, negative), the position where the sentiment begins, and its length.     | [] |

Once you send your API request, you’ll receive a `202` response indicating that the job was submitted correctly. In the response headers, extract the `operation-location` value. It will be formatted like this: 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/import/jobs/{JOB-ID}?api-version={API-VERSION}
``` 

`{JOB-ID}` is used to identify your request, since this operation is asynchronous. You’ll use this URL to get the import job status.  

Possible error scenarios for this request:

<!--* The selected resource doesn't have [proper permissions](../../../custom/how-to/create-project.md#using-a-pre-existing-language-resource) for the storage account.-->
* The `storageInputContainerName` specified doesn't exist.
* Invalid language code is used, or if the language code type isn't string.
* `multilingual` value is a string and not a boolean.
