---
title: "How to guide: create and compose custom models with Form Recognizer v2.1"
titleSuffix: Azure Applied AI Services
description: Learn how to create, compose use, and manage custom models with Form Recognizer v2.1
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 08/22/2022
ms.author: lajanuar
recommendations: false
---

# Compose custom models v2.1

> [!NOTE]
> This how-to guide references Form Recognizer v2.1 . To try Form Recognizer v3.0 , see [Compose custom models v3.0](compose-custom-models-v3.md).

Form Recognizer uses advanced machine-learning technology to detect and extract information from document images and return the extracted data in a structured JSON output. With Form Recognizer, you can train standalone custom models or combine custom models to create composed models.

* **Custom models**. Form Recognizer custom models enable you to analyze and extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases.

* **Composed models**. A composed model is created by taking a collection of custom models and assigning them to a single model that encompasses your form types. When a document is submitted to a composed model, the service performs a classification step to decide which custom model accurately represents the form presented for analysis.

In this article, you'll learn how to create Form Recognizer custom and composed models using our [Form Recognizer Sample Labeling tool](label-tool.md), [REST APIs](quickstarts/client-library.md?branch=main&pivots=programming-language-rest-api#train-a-custom-model), or [client-library SDKs](quickstarts/client-library.md?branch=main&pivots=programming-language-csharp#train-a-custom-model).

## Sample Labeling tool

Try extracting data from custom forms using our Sample Labeling tool. You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

> [!div class="nextstepaction"]
> [Try it](https://fott-2-1.azurewebsites.net/projects/create)

In the Form Recognizer UI:

1. Select **Use Custom to train a model with labels and get key value pairs**.

      :::image type="content" source="media/label-tool/fott-use-custom.png" alt-text="Screenshot of the FOTT tool select custom model option.":::

1. In the next window, select **New project**:

    :::image type="content" source="media/label-tool/fott-new-project.png" alt-text="Screenshot of the FOTT tool select new project option.":::

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

You [train your model](./quickstarts/try-sdk-rest-api.md#train-a-custom-model)  with labeled data sets. Labeled datasets rely on the prebuilt-layout API, but supplementary human input is included such as your specific labels and field locations. Start with at least five completed forms of the same type for your labeled training data.

When you train with labeled data, the model uses supervised learning to extract values of interest, using the labeled forms you provide. Labeled data results in better-performing models and can produce models that work with complex forms or forms containing values without keys.

Form Recognizer uses the [Layout](concept-layout.md) API to learn the expected sizes and positions of typeface and handwritten text elements and extract tables. Then it uses user-specified labels to learn the key/value associations and tables in the documents. We recommend that you use five manually labeled forms of the same type (same structure) to get started when training a new model. Add more labeled data as needed to improve the model accuracy. Form Recognizer enables training a model to extract key value pairs and tables using supervised learning capabilities.

[Get started with Train with labels](label-tool.md)

> [!VIDEO https://docs.microsoft.com/Shows/Docs-Azure/Azure-Form-Recognizer/player]

## Create a composed model

> [!NOTE]
> **Model Compose is only available for custom models trained _with_ labels.** Attempting to compose unlabeled models will produce an error.

With the Model Compose operation, you can assign up to 100 trained custom models to a single model ID. When you call Analyze with the composed model ID, Form Recognizer will first classify the form you submitted, choose the best matching assigned model, and then return results for that model. This operation is useful when incoming forms may belong to one of several templates.

Using the Form Recognizer Sample Labeling tool, the REST API, or the Client-library SDKs, follow the steps below to set up a composed model:

1. [**Gather your custom model IDs**](#gather-your-custom-model-ids)
1. [**Compose your custom models**](#compose-your-custom-models)

#### Gather your custom model IDs

Once the training process has successfully completed, your custom model will be assigned a model ID. You can retrieve a model ID as follows:

### [**Form Recognizer Sample Labeling tool**](#tab/fott)

When you train models using the [**Form Recognizer Sample Labeling tool**](https://fott-2-1.azurewebsites.net/), the model ID is located in the Train Result window:

:::image type="content" source="media/fott-training-results.png" alt-text="Screenshot: training results window.":::

### [**REST API**](#tab/rest-api)

The [**REST API**](./quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#train-a-custom-model) will return a `201 (Success)` response with a **Location** header. The value of the last parameter in this header is the model ID for the newly trained model:

:::image type="content" source="media/model-id.png" alt-text="Screenshot: the returned location header containing the model ID.":::

### [**Client-library SDKs**](#tab/sdks)

 The [**client-library SDKs**](./quickstarts/try-sdk-rest-api.md?pivots=programming-language-csharp#train-a-custom-model) return a model object that can be queried to return the trained model ID:

* C\#  | [CustomFormModel Class](/dotnet/api/azure.ai.formrecognizer.training.customformmodel?view=azure-dotnet&preserve-view=true#properties "Azure SDK for .NET")

* Java | [CustomFormModelInfo Class](/java/api/com.azure.ai.formrecognizer.training.models.customformmodelinfo?view=azure-java-stable&preserve-view=true#methods "Azure SDK for Java")

* JavaScript | [CustomFormModelInfo interface](/javascript/api/@azure/ai-form-recognizer/customformmodelinfo?view=azure-node-latest&preserve-view=true&branch=main#properties "Azure SDK for JavaScript")

* Python | [CustomFormModelInfo Class](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.customformmodelinfo?view=azure-python&preserve-view=true&branch=main#variables "Azure SDK for Python")

---

#### Compose your custom models

After you've gathered your custom models corresponding to a single form type, you can compose them into a single model.

### [**Form Recognizer Sample Labeling tool**](#tab/fott)

The **Sample Labeling tool** enables you to quickly get started training models and  composing them to a single model ID.

After you have completed training, compose your models as follows:

1. On the left rail menu, select the **Model Compose** icon (merging arrow).

1. In the main window, select the models you wish to assign to a single model ID. Models with the arrows icon are already composed models.

1. Choose the **Compose button** from the upper-left corner.

1. In the pop-up window, name your newly composed model and select **Compose**.

When the operation completes, your newly composed model will appear in the list.

  :::image type="content" source="media/custom-model-compose.png" alt-text="Screenshot of the model compose window." lightbox="media/custom-model-compose-expanded.png":::

### [**REST API**](#tab/rest-api)

Using the **REST API**, you can make a  [**Compose Custom Model**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/ComposeDocumentModel) request to create a single composed model from existing models. The request body requires a string array of your `modelIds` to compose and you can optionally define the `modelName`.

### [**Client-library SDKs**](#tab/sdks)

Use the programming language code of your choice to create a composed model that will be called with a single model ID. Below are links to code samples that demonstrate how to create a composed model from existing custom models:

* [**C#/.NET**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_ModelCompose.md).

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/administration/ComposeModel.java).

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/createComposedModel.js).

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.2/sample_compose_model.py)

---

## Analyze documents with your custom or composed model

 The custom form **Analyze** operation requires you to provide the `modelID`  in the call to Form Recognizer. You can provide a single custom model ID or a composed model ID for the `modelID` parameter.

### [**Form Recognizer Sample Labeling tool**](#tab/fott)

1. On the tool's left-pane menu, select the **Analyze icon** (light bulb).

1. Choose a local file or  image URL to analyze.

1. Select the **Run Analysis** button.

1. The tool will apply tags in bounding boxes and report the confidence percentage for each tag.

:::image type="content" source="media/analyze.png" alt-text="Screenshot: Form Recognizer tool analyze-a-custom-form window.":::

### [**REST API**](#tab/rest-api)

Using the REST API, you can make an [Analyze Document](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) request to analyze a document and extract key-value pairs and table data.

### [**Client-library SDKs**](#tab/sdks)

Using the programming language of your choice to analyze a form or document with a custom or composed model. You'll need your Form Recognizer endpoint, key, and model ID.

* [**C#/.NET**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_ModelCompose.md)

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/AnalyzeCustomDocumentFromUrl.java)

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/recognizeCustomForm.js)

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.1/sample_recognize_custom_forms.py)

---

Test your newly trained models by [analyzing forms](./quickstarts/try-sdk-rest-api.md#analyze-forms-with-a-custom-model) that weren't part of the training dataset. Depending on the reported accuracy, you may want to do further training to improve the model. You can continue further training to [improve results](label-tool.md#improve-results).

## Manage your custom models

You can [manage your custom models](./quickstarts/try-sdk-rest-api.md#manage-custom-models) throughout their lifecycle by viewing a [list of all custom models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/GetModels) under your subscription, retrieving information about [a specific custom model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/GetModel), and [deleting custom models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/DeleteModel) from your account.

Great! You've learned the steps to create custom and composed models and use them in your Form Recognizer projects and applications.

## Next steps

Learn more about the Form Recognizer client library by exploring our API reference documentation.

> [!div class="nextstepaction"]
> [Form Recognizer API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
>
