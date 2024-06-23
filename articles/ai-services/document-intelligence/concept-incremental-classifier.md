---
title: Document Intelligence support for incremental classifier training
titleSuffix: Azure AI services
description: Incrementally train custom classifiers by adding new samples to existing classes or adding new classes.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 05/23/2024
ms.author: vikurpad
ms.custom:
monikerRange: '>=doc-intel-4.0.0'
---



# Incremental classifier training

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)** ![checkmark](media/yes-icon.png)

Azure AI Document Intelligence is a cloud-based Azure AI service that enables you to build intelligent document processing solutions. Document Intelligence APIs analyze images, PDFs, and other document files to extract and detect various content, layout, style, and semantic elements.

[Document Intelligence custom classification models](concept-custom-classifier.md) are deep-learning-model types that combine layout and language features to accurately detect and identify documents you process within your applications. Custom classification models perform classification of input files one page at a time to identify the documents within and can also identify multiple documents or multiple instances of a single document within an input file.

Document Intelligence document classifiers identify known document types in files. When processing an input file with multiple document types or when you don't know the document type, use a classifier to identify the document. Classifiers should be periodically updated when you add new templates for an existing class, add new document types for recognition, or classifier confidence is low. In some scenarios, you can no longer have the original set of documents used to train the classifier. With incremental training, you can now update the classifier with just the new labeled samples.

>[!NOTE]
> Incremental training only applies to document classifier models and not custom models.

Incremental training is useful when you want to improve the quality of a custom classifier. Adding new training samples for existing classes improves the confidence of the model for existing document types. For instance, if a new version of an existing form is added or there's a new document type. An example can be when your application starts supporting a new document type as a valid input.

## Getting started with incremental training

* Incremental training doesn't introduce any new API endpoints.

* The `documentClassifiers:build` request payload is modified to support incremental training.

* Incremental training results in a new classifier model being created with the existing classifier left untouched.

* The new classifier has all the document samples and types of the old classifier along with the newly provided samples. You need to ensure your application is updates to work with the newly trained classifier.

  >[!NOTE]
  > Copy operation for classifiers is currently unavailable.

### Create an incremental classifier build request

The incremental classifier build request is similar to the [classify document build request](/rest/api/aiservices/document-classifiers?view=rest-aiservices-v4.0%20(2024-02-29-preview)&preserve-view=true) but includes the new `baseClassifierId` property. The `baseClassifierId` is set to the existing classifier that you want to extend. You also need to provide the `docTypes` for the different document types in the sample set. By providing a `docType` that exists in the baseClassifier, the samples provided in the request are added to the samples provided when the base classifier was trained. New `docType` values added in the incremental training are only added to the new classifier. The process to specify the samples remains unchanged. For more information, *see* [training a classifier model](concept-custom-classifier.md#training-a-model).

### Sample POST request

***Sample `POST` request to build an incremental document classifier***

**`POST` {your-endpoint}/documentintelligence/documentClassifiers:build?api-version=2024-02-29-preview**

```json
{
  "classifierId": "myAdaptedClassifier",
  "description": "Classifier description",
  "baseClassifierId": "myOriginalClassifier",
  "docTypes": {
    "formA": {
      "azureBlobSource": {
        "containerUrl": "https://myStorageAccount.blob.core.windows.net/myContainer?mySasToken",
        "prefix": "formADocs/"
      }
    },
    "formB": {
      "azureBlobFileListSource": {
        "containerUrl": "https://myStorageAccount.blob.core.windows.net/myContainer?mySasToken",
        "fileList": "formB.jsonl"
      }
    }
  }
}
```

#### POST response

All Document Intelligence APIs are asynchronous, polling the returned operation location provides a status on the build operation. Classifiers are fast to train and your classifier can be ready to use in a minute or two.

Upon successful completion:

* The successful `POST` method returns a `202 OK` response code indicating that the service created the request.
* The translated documents are located in your target container.
* The `POST` request also returns response headers including `Operation-Location`. The value of this header contains a `resultId` that can be queried to get the status of the asynchronous operation and retrieve the results using a `GET` request with your same resource subscription key.

### Sample GET request

***Sample `GET` request to retrieve the result of an incremental document classifier***

**`GET` {your-endpoint}/documentintelligence/documentClassifiers/{classifierId}/analyzeResults/{resultId}?api-version=2024-02-29-preview**

```json

{
  "classifierId": "myAdaptedClassifier",
  "description": "Classifier description",
  "createdDateTime": "2022-07-30T00:00:00Z",
  "expirationDateTime": "2023-01-01T00:00:00Z",
  "apiVersion": "2024-02-29-preview",

  "baseClassifierId": "myOriginalClassifier",

  "docTypes": {
    "formA": {
      "azureBlobSource": {
        "containerUrl": "https://myStorageAccount.blob.core.windows.net/myContainer",
        "prefix": "formADocs/"
      }
    },
    "formB": {
      "azureBlobFileListSource": {
        "containerUrl": "https://myStorageAccount.blob.core.windows.net/myContainer",
        "fileList": "formB.jsonl"
      }
    }
  }
}
```

#### GET response

The `GET` response from an incrementally trained classifier differs from the standard classifier `GET` response. The incrementally trained classifier doesn't return all the document types supported. It returns the document types added or updated in the incremental training step and the extended base classifier. To get a complete list of document types, the base classifier must be listed. Deleting a base classifier doesn't impact the use of an incrementally trained classifier.

## Limits

* Incremental training only works when the base classifier and the incrementally trained classifier are both trained on the same API version. As a result, the incrementally trained classifier has the same [model lifecycle](concept-custom-lifecycle.md) as the base classifier.

* Training dataset size limits for the incremental classifier are the same as for other classifier model. See [service limits](service-limits.md) for a complete list of applicable limits.

## Next steps

* Learn more about [document classification](concept-custom-classifier.md)
