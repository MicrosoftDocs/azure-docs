---
title: Form Recognizer custom template model
titleSuffix: Azure Applied AI Services
description: Learn about the custom template model type, its features and how you train a model with high accuracy to extract data from structured or templated forms
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 02/15/2022
ms.author: lajanuar
recommendations: false
---

# Form Recognizer custom template model

Custom template—formerly custom form-are easy-to-train models that accurately extract labeled key-value pairs, selection marks, tables, regions, and signatures from documents. Template models use layout cues to extract values from documents and are suitable to extract fields from highly structured documents with defined visual templates.

Custom template models share the same labeling format and strategy as custom neural models, with support for more field types and languages.

## Model capabilities

Custom template models support key-value pairs, selection marks, tables, signature fields, and selected regions. 

| Form fields | Selection marks | Structured fields (Tables) | Signature | Selected regions |
|--|--|--|--|--|
| Supported| Supported | Supported | Preview | Supported |

## Dealing with variations 

Template models rely on a defined visual template, changes to the template will result in lower accuracy. In those instances, split your training dataset to include at least five samples of each template and train a model for each of the variations. You can then [compose](concept-composed-models.md) the models into a single endpoint. When dealing with subtle variations, like digital PDF documents and images, it's best to include at least five examples of each type in the same training dataset.

## Training a model

Template models are available generally [v2.1 API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) and in preview [v3 API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/BuildDocumentModel). If you're starting with a new project or have an existing labeled dataset, work with the v3 API and Form Recognizer Studio to train a custom template model.

| Model | REST API | SDK | Label and Test Models|
|--|--|--|--|
| Custom template (preview) | [Form Recognizer 3.0 (preview)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)| [Form Recognizer Preview SDK](quickstarts/try-v3-python-sdk.md)| [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)|
| Custom template | [Form Recognizer 2.1 (GA)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)| [Form Recognizer SDK](quickstarts/get-started-sdk-rest-api.md?pivots=programming-language-python)| [Form Recognizer Sample labeling tool](https://fott-2-1.azurewebsites.net/)|

On the v3 API, the build operation to train model supports a new ```buildMode``` property, to train a custom template model, set the ```buildMode``` to ```template```.

```REST
https://{endpoint}/formrecognizer/documentModels:build?api-version=2022-01-30-preview

{
  "modelId": "string",
  "description": "string",
  "buildMode": "template",
  "azureBlobSource":
  {
    "containerUrl": "string",
    "prefix": "string"
  }
}
```


## Next steps

* * Train a custom model:

  > [!div class="nextstepaction"]
  > [How to train a model](how-to-guides/build-custom-model-v3.md)

* Learn more about custom neural models:

  > [!div class="nextstepaction"]
  > [Custom neural models](concept-custom-neural.md )

* View the REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)