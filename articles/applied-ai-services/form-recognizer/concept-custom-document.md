---
title: Form Recognizer custom document model
titleSuffix: Azure Applied AI Services
description: Learn about custom document (neural) model type, its features and how you train a model with high accuracy to extract data from structured and unstructured documents
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 01/10/2022
ms.author: vikurpad
recommendations: false
---

# Form Recognizer custom document model

Custom document models or neural models are a deep learned model that combines layout and language features to accurately extract labeled fields from documents. The base custom document model is trained on a variety of document types that makes it suitable to be trained for extracting fields from structured, semi-structured and unstructured documents. The table below lists common document types for each category:

|Documents | Examples |
|---|--|
|structured| surveys, questionnaires|
|semi-structured | invoices, purchase orders |
|unstructured | contracts, letters|

Custom document models share the same labeling format and strategy as custom form models. Currently custom document models only support a subset of the field types supported by custom form models. 

## Model capabilities

Custom document models currently only support key value pairs and selection marks, future releases will include support for structured fields (tables) and signature.

| Form fields | Selection marks | Tables | Signature | Region |
|--|--|--|--|--|
| Supported| Supported | Unsupported | Unsupported | Unsupported |

## Supported regions

In public preview custom document models can only be trained in select Azure regions.

* AustraliaEast
* BrazilSouth
* CanadaCentral
* CentralIndia
* CentralUS
* EastUS
* EastUS2
* FranceCentral
* JapanEast
* JioIndiaWest
* KoreaCentral
* NorthEurope
* SouthCentralUS
* SoutheastAsia
* UKSouth
* WestEurope
* WestUS
* WestUS2
* WestUS3

You can copy a model trained in one of the regions listed above to any other region for use.

## Best practices

Custom document models differ from custom form models in a few different ways. 

### Dealing with variations 

Custom document models can generalize across different formats of a single document type. As a best practice, create a single model for all variations of a document type. Add at least five labeled samples for each of the different variations to the training dataset.

### Field naming

While labeling the data, labeling the field relevant to the value will improve the accuracy of the key value pairs extracted. For example, of a field value containing the supplier id, consider naming the field "supplier_id". Field names should be in the language of the document.

### Labeling contiguous values

Value tokens/words of one field must be either
* Consecutive sequence in natural reading order without interleaving with other fields
* In a region that don't cover any other fields

### Representative data

Values in training cases should be diverse and representative. For example, if a field is named "date", values for this field should be a date. synthetic value like a random string can affect model performance.


## Current Limitations

* The model doesn't recognize values split across page boundaries.
* Custom document models are only trained in English and model performance will be lower for documents in other languages.
* If a dataset labeled for custom form models is used to train a custom document model, the unsupported field types are ignored.
* Custom document models are limited to 10 build operations per month. Open a support request if you need the limit increased.

## Training a model

Custom document models are only available in the [v3 API](v3-migration-guide).

|  | REST API | SDK | Label and Test Models|
|--|--|--|--|
| Custom document | [Form Recognizer 3.0 (preview)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)| [Form Recognizer Preview SDK](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/quickstarts/try-v3-python-sdk)| [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)

The build operation to train model supports a new ```buildMode``` property, to train a custom document model, set the ```buildMode``` to ```neural```.

```REST
https://{endpoint}/formrecognizer/documentModels:build?api-version=2022-01-30-preview

{
  "modelId": "string",
  "description": "string",
  "buildMode": "neural",
  "azureBlobSource":
  {
    "containerUrl": "string",
    "prefix": "string"
  }
}
```
## Next steps

* Train a custom document model:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/train-custom.md)

* View the labeling guidelines:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)