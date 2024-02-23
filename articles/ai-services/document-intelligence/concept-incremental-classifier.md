---
title: Document Intelligence (formerly Form Recognizer) train classifier with new samples - incremental training
titleSuffix: Azure AI services
description: Incrementally train the classifier by adding new samples to existing classes or adding new classes 
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 02/17/2024
ms.author: vikurpad
ms.custom:
monikerRange: '>=doc-intel-4.0.0'
---



# Incremental training - classifier

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)** ![checkmark](media/yes-icon.png) 

Document classifiers identify known document types in files. When processing an input file with multiple document types or when you don't knwo the document type, use a classifier to identify the doument. Classifiers may need to be preiiodcally updated when you have new templates for an existing class, where the classifier confidence is low or when you have new document types to be recognized. In some scenarios, you may no longer have the original set of documents used to train the classifier. With incremental training, you can now update the classifier with just the new labeled samples.

>[!NOTE]
> Incremental training only applies to document classifier models and not custom models.

Incremental training is useful when you want to improve the quality of the custom classifier by adding new training samples for existing classes that improve the confidence of the model for existing document types. For instance a new 2024 version of an existing form is added. Another scenario for using incremental updates to classification is when you have a new document type. An example of this might be when your application starts supporting a new document type as a valid input.

## Getting started with incremental training

Incremental training does not introduce any new API endpoints, the ```documentClassifiers:build``` request payload is modififed to support incremental training. Incremental training results in a new classifier model being created with the existing classifier left untouched. The new classifier has all the document samples and types of the old classifier along with the newly provided samples. You will need to ensure your application is updates to work with the newly trained classifer.

>[!NOTE]
> Copy operation for classifiers is currently unavailable, this is planned for middle of 2024.

### Constructing a incremental classifer build request

The incremental classifier build reques is identical to the classifier build request, with the exception of the new ```baseClassifierId``` poperty. The baseClassifierId should be set to the existing classifier you want to extend. You also need to provide the ```docTypes``` for the different document types the sampples belong to. By providing a docType that exists in the baseClassifier, the samples provided in the request are added to the samples provided when the base classifier was trained. New docTypes added in the incremental training are only added to the nw classifer. The process to specify the samples remains unchanged. See [training a classifier model](concept-custom-classifier.md#training-a-model) for more information on how to train a custom classification model.

### Sample request

Sample request using incremental training.

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


### Response 

All Document Intelligence APIS are async, polling the returned operation location provides a status on the build operation. Classifiers are fast to train and your classifier will be ready to use in a minute or two.

## Get model details

The result from a GET operation on an incrementally trained classifier is different from that of a regular classifier. The incrementally trained classifer does not return all the document types supported, instead it returns the document types added or updated in the incremental training step and the base clasifier that was extended. To get the complete list of document types, the base classifer will also need to be listed. IF the base classifier is deleted, it will not impact the use of the incrementally trained classifier.

## Limits

* Incremental training only works when the base classifer and the incrementlaly trained classifier are trained on the same API version. As a result the incrementally trained classifier will have the same [model lifecycle](concept-custom-lifecycle.md) as the base classiifer.
* Training dataset size limits for the incrmental classifier are the same as those of any othr classifier model. See [service limits](service-limits.md) for a complete list of applicable limits.

## Next steps

* Learn more about [document classification](concept-custom-classifier.md)

