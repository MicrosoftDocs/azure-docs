---
title: Form Recognizer custom form model
titleSuffix: Azure Applied AI Services
description: Learn about the custom form model type, its features and how you train a model with high accuracy to extract data from structured or templated forms
author: vkurpad
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 01/10/2022
ms.author: vikurpad
recommendations: false
---

# Form Recognizer custom form model

Custom form models or template models are fast and easy to train models to accurately extract labeled key value pairs, selection marks, tables, regions and signatures from documents. Custom form models use layout cues to extract values from documents making it suitable to extract fields from highly structured documents with a defined visual template.

Custom form models share the same labeling format and strategy as custom document models, with support for more field types and languages. 

## Model capabilities

Custom form  models support key value pairs, selection marks, tables, signature fields and regions. 

| Form fields | Selection marks | Structured fields (Tables) | Signature | Region |
|--|--|--|--|--|
| Supported| Supported | Supported | Preview | Supported |

## Dealing with variations 

Custom form models rely on a defined visual template, changes to the template will result in lower accuracy. In those instances, split your training dataset to include at least five samples of each template and train a model for each of the variations. You can then [compose](concept-compose-models.md) the models into a single endpoint for easier inferencing. When dealing with subtle variations, like digital PDF documents and images, it's best to include at least five examples of each type in the same training dataset.


## Training a model

Custom form models are available in the generally available [v2.1 API]() and the preview [v3 API](v3-migration-guide). If you're starting with a new project or have an existing labeled dataset, work with the v3 API and Form Recognizer Studio to train a custom form model.

|  | REST API | SDK | Label and Test Models|
|--|--|--|--|
| Custom form | [Form Recognizer 3.0 (preview)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)| [Form Recognizer Preview SDK](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/quickstarts/try-v3-python-sdk)| [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)|
| Custom form | [Form Recognizer 2.1 (GA)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)| [Form Recognizer SDK](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/quickstarts/get-started-sdk-rest-api?pivots=programming-language-python)| [Form Recognizer Sample labeling tool](https://fott-2-1.azurewebsites.net/)|

On the v3 API, the build operation to train model supports a new ```buildMode``` property, to train a custom form model, set the ```buildMode``` to ```template```.

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

* Train a custom form model:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Learn more about custom document models:

  > [!div class="nextstepaction"]
  > [Custom document models](concept-custom-document.md)

* View the labeling guidelines:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)