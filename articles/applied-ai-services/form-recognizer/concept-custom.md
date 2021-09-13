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
ms.date: 08/09/2021
ms.author: lajanuar
---

# Form Recognizer custom and composed models

Form Recognizer uses advanced machine learning technology to detect and extract information from document images and return the extracted data in a structured JSON output. With Form Recognizer, you can train standalone custom models, create composed models, or get started with our prebuilt models:

* **Custom models**. Form Recognizer custom models enable you to analyze and extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases.

* **Composed models**. A composed model is created by taking a collection of custom models and assigning them to a single model that encompasses your form types. When a document is submitted to a composed model, the service performs a classification step to decide which custom model accurately represents the form presented for analysis.

* **Prebuilt models**. Form Recognizer currently supports prebuilt models for [business cards](concept-business-cards.md), [layout](concept-layout.md), [identity documents](concept-identification-cards.md), [invoices](concept-invoices.md), and [receipts](concept-receipts.md).

In this article, we'll examine the process for creating Form Recognizer custom and composed models using our [Form Recognizer sample labeling tool](label-tool.md), [REST APIs](quickstarts/client-library.md?branch=main&pivots=programming-language-rest-api#train-a-custom-model), or [client-library SDKs](quickstarts/client-library.md?branch=main&pivots=programming-language-csharp#train-a-custom-model).

## What is a custom model?

A custom model is a machine learning program trained to recognize form fields within your distinct content and extract key-value pairs and table data. You only need five examples of the same form type to get started and your custom model can be trained with or without labeled datasets.

## What is a composed model?

With composed models, you can assign multiple custom models to a composed model called with a single model ID. This is useful when you have trained several models and want to group them to analyze similar form types. For example, your composed model may be comprised of custom models trained to analyze your supply, equipment, and furniture purchase orders. Instead of manually trying to select the appropriate model, you can use a composed model to determine the appropriate custom model for each analysis and extraction.

## Try it

Get started with our Form Recognizer sample labeling tool:

> [!div class="nextstepaction"]
> [Try a custom model](https://aka.ms/fott-2.1-ga "Start with Custom to train a model with labels and find key-value pairs.")

## Create your models

The steps for building, training, and using custom and composed models are as follows:

* [**Assemble your training dataset**](#assemble-your-training-dataset)
* [**Upload your training set to Azure blob storage**](#upload-your-training-dataset)
* [**Train your custom model**](#train-your-custom-model)
* [**Compose custom models**](#create-a-composed-model)
* [**Analyze documents**](#analyze-documents-with-your-custom-or-composed-model)
* [**Manage your custom models**](#manage-your-custom-models)

## Assemble your training dataset

Building a custom model begins with establishing your training dataset. You'll need a minimum of five completed forms of the same type for your sample dataset. They can be of different file types (jpg, png, pdf, tiff) and contain both text and handwriting. Your forms must follow the [input requirements](build-training-data-set.md#custom-model-input-requirements) for Form Recognizer.

## Upload your training dataset

You'll need to [upload your training data](build-training-data-set.md#upload-your-training-data)
to an Azure blob storage container. If you don't know how to create an Azure storage account with a container, *see* [Azure Storage quickstart for Azure portal](../../storage/blobs/storage-quickstart-blobs-portal.md). You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

## Train your custom model

You can [train your model](quickstarts/client-library.md#train-a-custom-model)  with or without labeled data sets. Unlabeled datasets rely solely on the [Layout API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeLayoutAsync) to detect and identify key information without added human input. Labeled datasets also rely on the Layout API, but supplementary human input is included such as your specific labels and field locations. To use both labeled and unlabeled data, start with at least five completed forms of the same type for the labeled training data and then add unlabeled data to the required data set.

## Create a composed model

> [!NOTE]
> **Model Compose is only available for custom models trained _with_ labels.** Attempting to compose unlabeled models will produce an error.

With the Model Compose operation, you can assign up to 100 trained custom models to a single model ID. When you call Analyze with the composed model ID, Form Recognizer will first classify the form you submitted, choose the best matching assigned model, and then return results for that model. This operation is useful when incoming forms may belong to one of several templates.

Using the Form Recognizer sample labeling tool, the REST API, or the Client-library SDKs, follow the steps below to set up a composed model:

1. [**Gather your custom model IDs**](#gather-your-custom-model-ids)
1. [**Compose your custom models**](#compose-your-custom-models)

#### Gather your custom model IDs

Once the training process has successfully completed, your custom model will be assigned a model ID. You can retrieve a model ID as follows:

### [**Form Recognizer sample labeling tool**](#tab/fott)

When you train models using the [**Form Recognizer sample labeling tool**](https://fott-2-1.azurewebsites.net/), the model ID is located in the Train Result window:

:::image type="content" source="media/fott-training-results.png" alt-text="Screenshot: training results window.":::

### [**REST API**](#tab/rest-api)

The [**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#train-a-custom-model), will return a `201 (Success)` response with a **Location** header. The value of the last parameter in this header is the model ID for the newly trained model:

:::image type="content" source="media/model-id.png" alt-text="Screenshot: the returned location header containing the model ID.":::

### [**Client-library SDKs**](#tab/sdks)

 The [**client-library SDKs**](quickstarts/client-library.md?pivots=programming-language-csharp#train-a-custom-model) return a model object that can be queried to return the trained model ID:

* C\#  | [CustomFormModel Class](/dotnet/api/azure.ai.formrecognizer.training.customformmodel?view=azure-dotnet&preserve-view=true#properties "Azure SDK for .NET")

* Java | [CustomFormModelInfo Class](/java/api/com.azure.ai.formrecognizer.training.models.customformmodelinfo?view=azure-java-stable&preserve-view=true#methods "Azure SDK for Java")

* JavaScript | [CustomFormModelInfo interface](/javascript/api/@azure/ai-form-recognizer/customformmodelinfo?view=azure-node-latest&preserve-view=true&branch=main#properties "Azure SDK for JavaScript")

* Python | [CustomFormModelInfo Class](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.customformmodelinfo?view=azure-python&preserve-view=true&branch=main#variables "Azure SDK for Python")

---

#### Compose your custom models

After you have gathered your custom models corresponding to a single form type, you can compose them into a single model.

### [**Form Recognizer sample labeling tool**](#tab/fott)

The **sample labeling tool** enables you to quickly get started training models and  composing them to a single model ID.

After you have completed training, compose your models as follows:

1. On the left rail menu, select the **Model Compose icon**  (merging arrow).

1. In the main window, select the models you wish to assign to a single model ID. Models with the arrows icon are already composed models.

1. Choose the **Compose button** from the upper-left corner.

1. In the pop-up window, name your newly composed model and select **Compose**.

When the operation completes, your newly composed model will appear in the list.

  :::image type="content" source="media/custom-model-compose.png" alt-text="Screenshot: model compose window." lightbox="media/custom-model-compose-expanded.png":::

### [**REST API**](#tab/rest-api)

Using the **REST API**, you can make a  [**Compose Custom Model**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/Compose) request to create a single composed model from existing models. The request body requires a string array of your `modelIds` to compose and you can optionally define the `modelName`.  *See* [Compose Models Async](/rest/api/formrecognizer/2.1preview2/compose-custom-models-async/compose-custom-models-async).

### [**Client-library SDKs**](#tab/sdks)

Use the programming language code of your choice to create a composed model that will be called with a single model ID. Below are links to code samples that demonstrate how to create a composed model from existing custom models:

* [**C#/.NET**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample8_ModelCompose.md).

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/CreateComposedModel.java).

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/createComposedModel.js).

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_create_composed_model.py)

---

## Analyze documents with your custom or composed model

 The custom form **Analyze**operation requires you to provide the `modelID`  in the call to Form Recognizer . You can provide a single custom model ID or a composed model ID for the `modelID` parameter.

### [**Form Recognizer sample labeling tool**](#tab/fott)

1. On the tool's left-pane menu, select the **Analyze icon** (lightbulb).

1. Choose a local file or  image URL to analyze.

1. Select the **Run Analysis** button.

1. The tool will apply tags in bounding boxes and report the confidence percentage for each tag.

:::image type="content" source="media/analyze.png" alt-text="Screenshot: Form Recognizer tool analyze-a-custom-form window.":::

### [**REST API**](#tab/rest-api)

Using the REST API, you can make an [Analyze Form](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) request to analyze a document and extract key-value pairs and table data.

### [**Client-library SDKs**](#tab/sdks)

Using the programming language of your choice to analyze a form or document with a custom or composed model. You'll need your Form Recognizer endpoint, API key, and model ID.

* [**C#/.NET**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample8_ModelCompose.md#recognize-a-custom-form-using-a-composed-model)

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/RecognizeCustomFormsFromUrl.java)

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/recognizeCustomForm.js)

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_recognize_custom_forms.py)

---

Test your newly trained models by [analyzing forms](quickstarts/client-library.md#analyze-forms-with-a-custom-model) that were not part of the training dataset. Depending on the reported accuracy, you may want to do further training to improve the model. You can continue further training to [improve results](label-tool.md#improve-results).

## Manage your custom models

You can [manage your custom models](quickstarts/client-library.md#manage-custom-models) throughout their lifecycle by viewing a [list of all custom models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/GetCustomModels) under your subscription, retrieving information about [a specific custom model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/GetCustomModel), and [deleting custom models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/DeleteCustomModel) from your account.

Great! You have learned the steps to create custom and composed models and use them in your Form Recognizer projects and applications.

## Next steps

Learn more about the Form Recognizer client library by exploring our API reference documentation.

> [!div class="nextstepaction"]
> [Form Recognizer API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)
>
