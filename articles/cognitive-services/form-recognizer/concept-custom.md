---
title: Custom models - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn concepts related to Form Recognizer API custom models- usage and limits.
services: cognitive-services
author: laujan
manager: nitinme

ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/25/2021
ms.author: lajanuar
---

# Form Recognizer custom models

Form Recognizer uses advanced machine learning technology to analyze and extract data from your forms and documents. A Form Recognizer model is a representation of extracted data that is used as a reference for analyzing your specific content. There are two types of Form recognizer models:

* **Custom models**. Form Recognizer custom models represent extracted data from _forms_ specific to your business. Custom models must be trained to analyze your distinct form data.

* **Prebuilt models**. Form Recognizer currently supports prebuilt models for _receipts, business cards, identification cards_, and _invoices_. Prebuilt models detect and extract information from document images and return the extracted data in a structured JSON output.

## What does a custom model do?

With Form Recognizer, you can train a model that will extract information from forms that are relevant for your use case. You only need five examples of the same form type to get started. Your custom model can be trained with or without labeled datasets.

## Create, use, and manage your custom model

At a high level, the steps for building, training, and using your custom model are as follows:

### [&#120783;. Assemble your training dataset](build-training-data-set.md#custom-model-input-requirements)

Building a custom model begins with establishing your training dataset. You'll need a minimum of five completed forms of the same type for your sample dataset. They can be of different file types and contain both text and handwriting. Your forms must be of the same type of document and follow the [input requirements](build-training-data-set.md#custom-model-input-requirements) for Form Recognizer.

### [&#120784;. Upload your training dataset](build-training-data-set.md#upload-your-training-data)

You'll need to upload your training data to an Azure blob storage container. If you don't know how to create an Azure storage account with a container, *see* [Azure Storage quickstart for Azure portal](../../storage/blobs/storage-quickstart-blobs-portal.md). Use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

### [&#120785;. Train your custom model](quickstarts/client-library.md#train-a-custom-model)

You can [train your model](quickstarts/client-library.md#train-a-custom-model)  with or without labeled data sets. Unlabeled datasets rely solely on the Layout API to detect and identify key information without added human input. Labeled datasets also rely on the Layout API, but supplementary human input is included such as your specific labels and field locations. To use both labeled and unlabeled data, start with at least five completed forms of the same type for the labeled training data and then add unlabeled data to the required data set.

#### Model ID

When the training process has successfully completed, your model will be assigned a Model ID.

* The [**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#train-a-custom-model), will return a `201 (Success)` response with a **Location** header. The value of this header contains a model ID for the newly trained model  that you can use to query the status of the operation and get the results:

_https://{endpoint}/formrecognizer/v2.1/custom/models/**{modelId}**_

```console
https://westus.api.cognitive.microsoft.com/formrecognizer/v2.1/custom/models/4da0bf8e-5325-467c-93bb-9ff13d5f72a2
```

* The [**client-library SDKs**](quickstarts/client-library.md?pivots=programming-language-csharp#train-a-custom-model) return a Model object that can be queried for the Model ID property.

* The [**Form Recognizer sample labeling tool**](https://fott-2-1.azurewebsites.net/) presents the Model ID once the training process completes:

:::image type="content" source="media/fott-training-results.png" alt-text="{alt-text}":::

#### Compose trained models

With Model Compose, you can assign up to 100 models to a single model ID. When you call Analyze with the composed `modelID`, Form Recognizer will first classify the form you submitted, choose the best matching model, and then return results for that model. This operation is useful when incoming forms may belong to one of several templates. 

> [!NOTE]
> **Only models trained using labels can be composed.**

You can assign your models to a single ID using the following:

* **REST API** [**Compuse Custom Model**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/Compose) request.

* The **client-library SDKs**:

  * [**C#/.NET**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample8_ModelCompose.md)

  * [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/CreateComposedModel.java).

  * [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/createComposedModel.js)

  * [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_create_composed_model.py)

* The **Form Recognizer sample labeling tool**:

  To compose models in the sample labeling tool, select the Model Compose (merging arrow) icon on the left. On the left, select the models you wish to compose together. Models with the arrows icon are already composed models.
  Choose the **Compose button**. In the pop-up, name your new composed model and select **Compose**. When the operation completes, your newly composed model should appear in the list.
  
  :::image type="content" source="media/custom-model-compose.png" alt-text="Model compose UX view.":::

### [&#120786;. Analyze documents with your custom model](quickstarts/client-library.md#analyze-forms-with-a-custom-model)

Test your newly trained model by using a form that wasn't part of the training dataset. You can continue to do further training to improve the performance of your custom model.

### [&#120787;. Manage your custom models](quickstarts/client-library.md#manage-custom-models)

At any time, you can view a list of all the custom models under your subscription, retrieve information about a specific custom model, or delete a custom model from your account.

## Next steps

Learn more about the Form Recognizer client library by exploring our API reference documentation.

> [!div class="nextstepaction"]
> [Form Recognizer API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)
>
