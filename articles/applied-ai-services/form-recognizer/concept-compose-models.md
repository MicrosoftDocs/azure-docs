---
title: Form Recognizer compose models
titleSuffix: Azure Applied AI Services
description: Learn about composing multiple models
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 01/10/2022
ms.author: vikurpad
recommendations: false
---

# Compose models

**Composed models**. A composed model is created by taking a collection of custom models and assigning them to a single model that encompasses your form types. When a document is submitted for analysis to a composed model, the service performs a classification to decide which custom model accurately represents the form presented for analysis.

```Custom form```and ```Custom document``` models can be composed together into a single composed model when they're trained with the same API version or an API version later than ```2021-01-30-preview```. For more information on composing custom form and custom document models, see [compose model limits](compose-model-limits).

With the model compose operation, you can assign up to 100 trained custom models to a single model ID. When you call Analyze with the composed model ID, Form Recognizer will first classify the form you submitted, choose the best matching assigned model, and then return results for that model. For custom form models this can be a model per variation of a form or models for different document types. This operation is useful when incoming forms may belong to one of several templates. The response will also include a ```docType``` property to indicate which of the composed models was used to analyze the document.

***Model configuration window in Form Recognizer Studio***

:::image type="content" source="media/studio/composed-model.png" alt-text="Screenshot: model configuration window in Form Recognizer Studio.":::

## Compose model limits

> [!NOTE]
> With the addition of custom document model type, there are a few limits on the compatibility of models that can be composed together.

### Composed model compatibility

|API Version | Custom form trained with prior API version|  Custom form trained with current API version (2021-01-30-preview)| Custom document trained with current API version (2021-01-30-preview) |
|--|--|--|--|
|Custom form trained with prior API version | ✓ | X | X|
|Custom form trained with current API version (2021-01-30-preview) | X | X*| ✓ |
|Custom document trained with current API version (2021-01-30-preview) | X    |✓ |✓ |

X*: This is currently unsupported for this API version, but will be supported in a future API version.


 To compose a model trained with a prior version of the API (2.1 or earlier), train a model with the 3.0 API using the same labeled dataset to ensure that it can be composed with other models.

Models composed with the 2.1 version of the API will continue to be supported, requiring no updates.

The limit for maximum number of custom models that can be composed is 100. 

## Create a composed model


# [v2.1 API](#tab/v2.1)

Using the Form Recognizer Sample Labeling tool, the REST API, or the Client-library SDKs, follow the steps below to set up a composed model:

1. [**Gather your custom model IDs**](#gather-your-custom-model-ids)
1. [**Compose your custom models**](#compose-your-custom-models)

#### Gather your custom model IDs

Once the training process has successfully completed, your custom model will be assigned a model ID. You can retrieve a model ID as follows:

### [**Form Recognizer Sample Labeling tool**](#tab/fott)

When you train models using the [**Form Recognizer Sample Labeling tool**](https://fott-2-1.azurewebsites.net/), the model ID is located in the Train Result window:

:::image type="content" source="media/fott-training-results.png" alt-text="Screenshot: training results window.":::

### [**REST API**](#tab/rest-api)

The [**REST API**](./quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#train-a-custom-model), will return a `201 (Success)` response with a **Location** header. The value of the last parameter in this header is the model ID for the newly trained model:

:::image type="content" source="media/model-id.png" alt-text="Screenshot: the returned location header containing the model ID.":::

### [**Client-library SDKs**](#tab/sdks)

 The [**client-library SDKs**](./quickstarts/try-sdk-rest-api.md?pivots=programming-language-csharp#train-a-custom-model) return a model object that can be queried to return the trained model ID:

* C\#  | [CustomFormModel Class](/dotnet/api/azure.ai.formrecognizer.training.customformmodel?view=azure-dotnet&preserve-view=true#properties "Azure SDK for .NET")

* Java | [CustomFormModelInfo Class](/java/api/com.azure.ai.formrecognizer.training.models.customformmodelinfo?view=azure-java-stable&preserve-view=true#methods "Azure SDK for Java")

* JavaScript | [CustomFormModelInfo interface](/javascript/api/@azure/ai-form-recognizer/customformmodelinfo?view=azure-node-latest&preserve-view=true&branch=main#properties "Azure SDK for JavaScript")

* Python | [CustomFormModelInfo Class](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.customformmodelinfo?view=azure-python&preserve-view=true&branch=main#variables "Azure SDK for Python")


# [v3.0 API (preview)](#tab/v3.0)

Using the Form Recognizer Studio, the REST API, or the Client-library SDKs, follow the steps below to set up a composed model:

1. [**Gather your custom model IDs**](#gather-your-custom-model-ids)
1. [**Compose your custom models**](#compose-your-custom-models)

#### Gather your custom model IDs

Once the training process has successfully completed, your custom model will be assigned a model ID. You can retrieve a model ID as follows:

### [**Form Recognizer Studio**](#tab/studio)

When you train models using the [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/), the model ID is located in the models menu under a project:

:::image type="content" source="media/fott-training-results.png" alt-text="Screenshot: training results window.":::

### [**REST API**](#tab/rest-api)

The [**REST API**](./quickstarts/try-v3-rest-api#manage-custom-models), will return a `201 (Success)` response with a **Location** header. The value of the last parameter in this header is the model ID for the newly trained model:

:::image type="content" source="media/model-id.png" alt-text="Screenshot: the returned location header containing the model ID.":::

### [**Client-library SDKs**](#tab/sdks)

 The [**client-library SDKs**](./quickstarts/try-sdk-rest-api.md?pivots=programming-language-csharp#train-a-custom-model) return a model object that can be queried to return the trained model ID:

* C\#  | [CustomFormModel Class](/dotnet/api/azure.ai.formrecognizer.training.customformmodel?view=azure-dotnet&preserve-view=true#properties "Azure SDK for .NET")

* Java | [CustomFormModelInfo Class](/java/api/com.azure.ai.formrecognizer.training.models.customformmodelinfo?view=azure-java-stable&preserve-view=true#methods "Azure SDK for Java")

* JavaScript | [CustomFormModelInfo interface](/javascript/api/@azure/ai-form-recognizer/customformmodelinfo?view=azure-node-latest&preserve-view=true&branch=main#properties "Azure SDK for JavaScript")

* Python | [CustomFormModelInfo Class](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.customformmodelinfo?view=azure-python&preserve-view=true&branch=main#variables "Azure SDK for Python")


---

#### Compose your custom models

After you've gathered your custom models, you can compose them into a single model.

### [**Form Recognizer Sample Labeling tool**](#tab/fott)

The **Sample Labeling tool** enables you to quickly get started training models and  composing them to a single model ID.

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

* [**C#/.NET**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_ModelCompose.md).

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/administration/CreateComposedModel.java).

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/createComposedModel.js).

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.2-beta/sample_create_composed_model.py)

---

## Analyze documents with your custom or composed model

 The custom form **Analyze** operation requires you to provide the `modelID`  in the call to Form Recognizer. You can provide a single custom model ID or a composed model ID for the `modelID` parameter.

### [**Form Recognizer Sample Labeling tool**](#tab/fott)

1. On the tool's left-pane menu, select the **Analyze icon** (lightbulb).

1. Choose a local file or  image URL to analyze.

1. Select the **Run Analysis** button.

1. The tool will apply tags in bounding boxes and report the confidence percentage for each tag.

:::image type="content" source="media/analyze.png" alt-text="Screenshot: Form Recognizer tool analyze-a-custom-form window.":::

### [**REST API**](#tab/rest-api)

Using the REST API, you can make an [Analyze Form](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) request to analyze a document and extract key-value pairs and table data.

### [**Client-library SDKs**](#tab/sdks)

Using the programming language of your choice to analyze a form or document with a custom or composed model. You'll need your Form Recognizer endpoint, API key, and model ID.

* [**C#/.NET**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_ModelCompose.md)

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/AnalyzeCustomDocumentFromUrl.java)

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/recognizeCustomForm.js)

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.1/sample_recognize_custom_forms.py)

---

Test your newly trained models by [analyzing forms](./quickstarts/try-sdk-rest-api.md#analyze-forms-with-a-custom-model) that weren't part of the training dataset. Depending on the reported accuracy, you may want to do further training to improve the model. You can continue further training to [improve results](label-tool.md#improve-results).

## Manage your custom models

You can [manage your custom models](./quickstarts/try-sdk-rest-api.md#manage-custom-models) throughout their lifecycle by viewing a [list of all custom models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/GetCustomModels) under your subscription, retrieving information about [a specific custom model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/GetCustomModel), and [deleting custom models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/DeleteCustomModel) from your account.

Great! You've learned the steps to create custom and composed models and use them in your Form Recognizer projects and applications.

## Next steps

Learn more about the Form Recognizer client library by exploring our API reference documentation.

> [!div class="nextstepaction"]
> [Form Recognizer API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)
>