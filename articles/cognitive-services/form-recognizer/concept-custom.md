---
title: Custom and composed models - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn how to create, use, and manage Form Recognizer custom and composed models- usage and limits.
services: cognitive-services
author: laujan
manager: nitinme

ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 07/27/2021
ms.author: lajanuar
---

# Form Recognizer custom and composed models

Form Recognizer uses advanced machine learning technology to analyze and extract data from your forms and documents. With Form Recognizer, you can create independent custom models, composed models, or use our prebuilt models.

* **Custom models**. Form Recognizer custom models enable you to analyze and extract data from forms and documents specific to your business. Custom models must be trained your distinct data.

* **Composed models**. With composed models, you can combine multiple custom models together into a single model called with a single model ID.

* **Prebuilt models**. Form Recognizer currently supports prebuilt models for [business cards](concept-business-cards.md), [layout](concept-layout.md), [identity documents](concept-identification-cards.md), [invoices](concept-invoices.md), and [receipts](concept-receipts.md). Prebuilt models detect and extract information from document images and return the extracted data in a structured JSON output.

In this article, we will review the concepts and steps for creating custom and composed Form Recognizer models. After reading this article, you should have a good understanding of the steps necessary to create custom and composed models using our  [Form Recognizer sample labeling tool](label-tool.md), [REST APIs](quickstarts/client-library.md?branch=main&pivots=programming-language-rest-api#train-a-custom-model), or [client-library SDKs](quickstarts/client-library.md?branch=main&pivots=programming-language-csharp#train-a-custom-model).

## What is a custom model?

A custom model is trained to recognize form fields from your distinct content and extract key-value pairs and table data. You only need five examples of the same form type to get started and your custom model can be trained with or without labeled datasets.

## Try it out

Try our online Form Recognizer sample labeling tool:

> [!div class="nextstepaction"]
> [Try Custom](https://aka.ms/fott-2.1-ga "Start with Custom to train a model with labels and find key-value pairs.")

## Create a custom model

The steps for building, training, and using custom and composed model are as follows:

* Assemble a training dataset
* Upload your training set to Azure blob storage
* Train your custom model
* Create a composed model
* Analyze documents
* Manage your custom models

## Assemble your training dataset

Building a custom model begins with establishing your training dataset. You'll need a minimum of five completed forms of the same type for your sample dataset. They can be of different file types (jpg, png, pdf, tiff) and contain both text and handwriting. Your forms must be of the same type of document and follow the [input requirements](build-training-data-set.md#custom-model-input-requirements) for Form Recognizer.

## [**&#120784;. Upload your training dataset**](build-training-data-set.md#upload-your-training-data)

You'll need to upload your training data to an Azure blob storage container. If you don't know how to create an Azure storage account with a container, *see* [Azure Storage quickstart for Azure portal](../../storage/blobs/storage-quickstart-blobs-portal.md). Use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

## [**&#120785;. Train your custom model**](quickstarts/client-library.md#train-a-custom-model)

You can [train your model](quickstarts/client-library.md#train-a-custom-model)  with or without labeled data sets. Unlabeled datasets rely solely on the [Layout API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeLayoutAsync) to detect and identify key information without added human input. Labeled datasets also rely on the Layout API, but supplementary human input is included such as your specific labels and field locations. To use both labeled and unlabeled data, start with at least five completed forms of the same type for the labeled training data and then add unlabeled data to the required data set.

### The model ID

Once the training process has successfully completed, your model will be assigned a model ID. You can retrieve the model ID as follows:

### [**Form Recognizer sample labeling tool**](#tab/fott)

If you used the [**Form Recognizer sample labeling tool**](https://fott-2-1.azurewebsites.net/) to train your model, the model ID will be located in the Train Result window:

:::image type="content" source="media/fott-training-results.png" alt-text="{alt-text}":::

### [**REST API**](#tab/rest-api)

The [**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#train-a-custom-model), will return a `201 (Success)` response with a **Location** header. The value of this header contains a model ID for the newly trained model:
  _https://{endpoint}/formrecognizer/v2.1/custom/models/**{modelId}**_

  ```console
  https://westus.api.cognitive.microsoft.com/formrecognizer/v2.1/custom/models/4da0bf8e-5325-467c-93bb-9ff13d5f72a2
  ```

### [**Client-library SDKs**](#tab/sdks)

 The [**client-library SDKs**](quickstarts/client-library.md?pivots=programming-language-csharp#train-a-custom-model) return a model object that can be queried to return the trained model ID:

#### C\#

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/FormRecognizer/FormRecognizerQuickstart.cs?name=snippet_train_return)]

#### Java

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_train_return)]

#### JavaScript

This code block provides a paginated list of models and model IDs.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_manage_listpages)]

#### Python

The following code block lists the current models in your account and prints their details to the console. 

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_manage_list)]

### Model compose

With the Model Compose operation, you can assign up to 100 trained models to a single model ID. When you call Analyze with the composed `modelID`, Form Recognizer will first classify the form you submitted, choose the best matching model, and then return results for that model. This operation is useful when incoming forms may belong to one of several templates.

---

> [!NOTE]
> **Model Compose is only available for models trained _with_ labels.**

### Composed models

Composed models are created by taking a collection of custom models and compose a single model that encompasses all your form types:

### [**Form Recognizer sample labeling tool**](#tab/fott)

The **sample labeling tool** enables you to quickly get started training models and  composing them to a single model ID.

After you have completed training, compose your models as follows:

* Select the Model Compose (merging arrow) icon on the left rail menu. 
* in the main window, select the models you wish to assign to a single model ID. Models with the arrows icon are already composed models.
* Choose the **Compose button** from the upper-left corner. 
* In the pop-up window, name your newly composed model and select **Compose**. 

When the operation completes, your newly composed model should appear in the list.

  :::image type="content" source="media/custom-model-compose.png" alt-text="Model compose UX view.":::

### [**REST API**](#tab/rest-api)

Using the **REST API**, you can make a  [**Compose Custom Model**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/Compose) request to create a single composed model from existing models. The request body requires a string array of your `modelIds` to compose and you can optionally define the `modelName`.  *See* [Compose Models Async](/rest/api/formrecognizer/2.1preview2/compose-custom-models-async/compose-custom-models-async).

### [**Client-library SDKs**](#tab/sdks)

Use the programming language of your choice to create a composed model that will be called with a single model ID.

* [**C#/.NET**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample8_ModelCompose.md)—StartCreateComposedModelAsync.

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/CreateComposedModel.java)—beginCreateComposedModel.

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/createComposedModel.js)—beginCreateComposedModel.

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_create_composed_model.py)—begin_create_composed_model.

---

## [&#120786;. Analyze documents with your custom model](quickstarts/client-library.md#analyze-forms-with-a-custom-model)

Test your newly trained model by using a form that wasn't part of the training dataset. You can continue to do further training to improve the performance of your custom model.

## [&#120787;. Manage your custom models](quickstarts/client-library.md#manage-custom-models)

At any time, you can view a list of all the custom models under your subscription, retrieve information about a specific custom model, or delete a custom model from your account.

## Next steps

Learn more about the Form Recognizer client library by exploring our API reference documentation.

> [!div class="nextstepaction"]
> [Form Recognizer API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)
>
