---
title: Form Recognizer custom neural model
titleSuffix: Azure Applied AI Services
description: Learn about custom neural (neural) model type, its features and how you train a model with high accuracy to extract data from structured and unstructured documents
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 02/15/2022
ms.author: lajanuar
ms.custom: references_regions
recommendations: false
---

# Form Recognizer custom neural model

Custom neural models or neural models are a deep learned model that combines layout and language features to accurately extract labeled fields from documents. The base custom neural model is trained on various document types that makes it suitable to be trained for extracting fields from structured, semi-structured and unstructured documents. The table below lists common document types for each category:

|Documents | Examples |
|---|--|
|structured| surveys, questionnaires|
|semi-structured | invoices, purchase orders |
|unstructured | contracts, letters|

Custom neural models share the same labeling format and strategy as custom template models. Currently custom neural models only support a subset of the field types supported by custom template models. 

## Model capabilities

Custom neural models currently only support key-value pairs and selection marks, future releases will include support for structured fields (tables) and signature.

| Form fields | Selection marks | Tables | Signature | Region |
|--|--|--|--|--|
| Supported| Supported | Unsupported | Unsupported | Unsupported |

## Supported regions

In public preview custom neural models can only be trained in select Azure regions.

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

Custom neural models differ from custom template models in a few different ways. 

### Dealing with variations 

Custom neural models can generalize across different formats of a single document type. As a best practice, create a single model for all variations of a document type. Add at least five labeled samples for each of the different variations to the training dataset.

### Field naming

When you label the data, labeling the field relevant to the value will improve the accuracy of the key-value pairs extracted. For example, for a field value containing the supplier ID, consider naming the field "supplier_id". Field names should be in the language of the document.

### Labeling contiguous values

Value tokens/words of one field must be either

* Consecutive sequence in natural reading order without interleaving with other fields
* In a region that don't cover any other fields

### Representative data

Values in training cases should be diverse and representative. For example, if a field is named "date", values for this field should be a date. synthetic value like a random string can affect model performance.


## Current Limitations

* The model doesn't recognize values split across page boundaries.
* Custom neural models are only trained in English and model performance will be lower for documents in other languages.
* If a dataset labeled for custom template models is used to train a custom neural model, the unsupported field types are ignored.
* Custom neural models are limited to 10 build operations per month. Open a support request if you need the limit increased.

## Training a model

Custom neural models are only available in the [v3 API](v3-migration-guide.md).

| Document Type | REST API | SDK | Label and Test Models|
|--|--|--|--|
| Custom document | [Form Recognizer 3.0 (preview)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)| [Form Recognizer Preview SDK](quickstarts/try-v3-python-sdk.md)| [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)

The build operation to train model supports a new ```buildMode``` property, to train a custom neural model, set the ```buildMode``` to ```neural```.

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

* Train a custom model:

  > [!div class="nextstepaction"]
  > [How to train a model](how-to-guides/build-custom-model-v3.md)

* Learn more about custom template models:

  > [!div class="nextstepaction"]
  > [Custom template models](concept-custom-template.md )

* View the REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)