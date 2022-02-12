---
title: "How to guide: use custom and composed models"
titleSuffix: Azure Applied AI Services
description: Learn how to create, use, and manage Form Recognizer composed models
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to

ms.date: 02/10/2022
ms.author: lajanuar
recommendations: false
ms.custom: ignite-fall-2021
---

# Create and use composed custom models

A composed model is created by taking a collection of custom models and assigning them to a single model comprised of your form types. You can assign up to 100 trained custom models to a single composed model. When you call Analyze with the composed model ID, Form Recognizer will first classify the form you submitted, choose the best matching assigned model, and then return results for that model.

To learn more, see [Composed custom models](concept-composed-models.md)

In this article you will learn how to create and use composed custom models to analyze your forms and documents.

## Prerequisites

To get started, you'll need the following:

* **An Azure subscription**. You can [create a free Azure subscription](https://azure.microsoft.com/free/cognitive-services/)

* **A Form Recognizer resource**.  Once you have your Azure subscription, [create a Form Recognizer resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal to get your key and endpoint. If you have an existing Form Recognizer resource, navigate directly to your resource page. You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

  1. After the resource deploys, select **Go to resource**.

  1. Copy the **Keys and Endpoint** values from the resource you created and paste them in a convenient location, such as *Microsoft Notepad*. You'll need the key and endpoint values to connect your application to the Form Recognizer API.

    :::image border="true" type="content" source="media/containers/keys-and-endpoint.png" alt-text="Still photo showing how to access resource key and endpoint URL.":::

    > [!TIP]
    > For further guidance, *see* [**create a Form Recognizer resource**](create-a-form-recognizer-resource.md).

* **An Azure storage account.** If you don't know how to create an Azure storage account, follow the [Azure Storage quickstart for Azure portal](../../storage/blobs/storage-quickstart-blobs-portal.md). You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

## Create your custom models

### [v2.1 API](#tab/v2.1)

First, you'll need to a set of custom models to compose.  Using the Form Recognizer Sample Labeling tool, the REST API, or the client-library SDKs, the steps for creating custom models are as follows:

* [**Assemble your training dataset**](#assemble-your-training-dataset)
* [**Upload your training set to Azure blob storage**](#upload-your-training-dataset)
* [**Train your custom models**](#train-your-custom-model)

## Assemble your training dataset

Building a custom model begins with establishing your training dataset. You'll need a minimum of five completed forms of the same type for your sample dataset. They can be of different file types (jpg, png, pdf, tiff) and contain both text and handwriting. Your forms must follow the [input requirements](build-training-data-set.md#custom-model-input-requirements) for Form Recognizer.

## Upload your training dataset

When you've gathered the set of form documents that you'll use for training, you'll need to [upload your training data](build-training-data-set.md#upload-your-training-data)
to an Azure blob storage container.

If you want to use manually labeled data, you'll also have to upload the *.labels.json* and *.ocr.json* files that correspond to your training documents. You can use the [Sample Labeling tool](label-tool.md) (or your own UI) to generate these files.

>[!TIP]
> Follow these tips to optimize your data set for training:
>
> * If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.
> * For filled-in forms, use examples that have all of their fields filled in.
> * Use forms with different values in each field.
> * If your form images are of lower quality, use a larger data set (10-15 images, for example).

## Train your custom model

You can [train your model](./quickstarts/try-sdk-rest-api.md#train-a-custom-model)  with or without labeled data sets. Unlabeled datasets rely solely on the [Layout API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeLayoutAsync) to detect and identify key information without added human input. Labeled datasets also rely on the Layout API, but supplementary human input is included such as your specific labels and field locations. To use both labeled and unlabeled data, start with at least five completed forms of the same type for the labeled training data and then add unlabeled data to the required data set.

### Train without labels

Form Recognizer uses unsupervised learning to understand the layout and relationships between fields and entries in your forms. When you submit your input forms, the algorithm clusters the forms by type, discovers what keys and tables are present, and associates values to keys and entries to tables. Training without labels doesn't require manual data labeling or intensive coding and maintenance, and we recommend you try this method first.

See [Build a training data set](./build-training-data-set.md) for tips on how to collect your training documents.

### Train with labels

When you train with labeled data, the model uses supervised learning to extract values of interest, using the labeled forms you provide. Labeled data results in better-performing models and can produce models that work with complex forms or forms containing values without keys.

Form Recognizer uses the [Layout](concept-layout.md) API to learn the expected sizes and positions of printed and handwritten text elements and extract tables. Then it uses user-specified labels to learn the key/value associations and tables in the documents. We recommend that you use five manually labeled forms of the same type (same structure) to get started when training a new model and add more labeled data as needed to improve the model accuracy. Form Recognizer enables training a model to extract key-value pairs and tables using supervised learning capabilities.

## Create your composed model

Once the training process has successfully completed, you can begin to build your composed model. 

### [v3.0 preview](#tab/v3.0)

Using the Form Recognizer Studio, the REST API, or client-library SDKs, the steps for creating custom models are as follows:

* [**Gather your custom model IDs**](#gather-your-custom-model-ids)
* [**Compose your custom models**](#create-a-composed-model)
* [**Analyze documents**](#analyze-documents-with-your-custom-or-composed-model)
* [**Manage your composed models**](#manage-your-custom-models)

#### Gather your custom model IDs

Once the training process has successfully completed, your custom model will be assigned a model ID. You can retrieve a model ID as follows:

#### Form Recognizer Studio

When you train models using the [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/), the model ID is located in the models menu under a project:

:::image type="content" source="media/studio/model-id.png" alt-text="Screenshot of model ID field in the Form Recognizer Studio.":::

#### **REST API**

The [**REST API**](./quickstarts/try-v3-rest-api#manage-custom-models), will return a `201 (Success)` response with a **Location** header. The value of the last parameter in this header is the model ID for the newly trained model.

#### **Client-library SDKs**

 The client-library SDKs return a model object that can be queried to return the trained model ID.

* C\#  | [Create a composed model](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_ModelCompose.md#create-a-composed-model)

* Java | [Create a composed model](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_ModelCompose.md#create-a-composed-model)

* JavaScript | [Create a composed model](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v4-beta/javascript/composeModel.js)

* Python | [CustomFormModelInfo Class](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b3/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.2-beta/sample_create_composed_model.py)

### [v2.1 API](#tab/v2.1)

Using the Form Recognizer Studio, the REST API, or client-library SDKs, the steps for creating custom models are as follows:

* [**Gather your custom model IDs**](#gather-your-custom-model-ids)
* [**Compose your custom models**](#create-a-composed-model)
* [**Analyze documents**](#analyze-documents-with-your-custom-or-composed-model)
* [**Manage your composed models**](#manage-your-custom-models)

#### Gather your custom model IDs

Once the training process has successfully completed, your custom model will be assigned a model ID. You can retrieve a model ID as follows:

### **Form Recognizer Sample Labeling tool**

When you train models using the [**Form Recognizer Sample Labeling tool**](https://fott-2-1.azurewebsites.net/), the model ID is located in the Train Result window:

:::image type="content" source="media/fott-training-results.png" alt-text="Screenshot: training results window.":::

### **REST API**

The [**REST API**](./quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#train-a-custom-model), will return a `201 (Success)` response with a **Location** header. The value of the last parameter in this header is the model ID for the newly trained model:

:::image type="content" source="media/model-id.png" alt-text="Screenshot: the returned location header containing the model ID.":::

### **Client-library SDKs**

 The **client-library SDKs** return a model object that can be queried to return the trained model ID:

* [**C#**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/V3.1/Sample8_ModelCompose.md)

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/e365f292a7a8eabcf60ce68919f2b28043152fda/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/CreateComposedModel.java)

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/createComposedModel.js)

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b2/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.1/sample_create_composed_model.py)

---

## Compose your custom models

After you have gathered your custom models corresponding to a single form type, you can compose them into a single model.

> [!NOTE]
> **Model Compose is only available for custom models trained _with_ labels.** Attempting to compose unlabeled models will produce an error.

With the Model Compose operation, you can assign up to 100 trained custom models to a single model ID. When you call Analyze with the composed model ID, Form Recognizer will first classify the form you submitted, choose the best matching assigned model, and then return results for that model. This operation is useful when incoming forms may belong to one of several templates.


### [v2.1 API](#tab/v2.1)

Using the Form Recognizer Sample Labeling tool, the REST API, or the Client-library SDKs, follow the steps below to set up a composed model:

#### **Form Recognizer Sample Labeling tool**

The **Sample Labeling tool** enables you to quickly get started training models and  composing them to a single model ID.

After you have completed training, compose your models as follows:

1. On the left rail menu, select the **Model Compose icon**  (merging arrow).

1. In the main window, select the models you wish to assign to a single model ID. Models with the arrows icon are already composed models.

1. Choose the **Compose button** from the upper-left corner.

1. In the pop-up window, name your newly composed model and select **Compose**.

When the operation completes, your newly composed model will appear in the list.

  :::image type="content" source="media/custom-model-compose.png" alt-text="Screenshot: model compose window." lightbox="media/custom-model-compose-expanded.png":::

#### **REST API**

Using the **REST API**, you can make a  [**Compose Custom Model**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/Compose) request to create a single composed model from existing models. The request body requires a string array of your `modelIds` to compose and you can optionally define the `modelName`.  *See* [Compose Models Async](/rest/api/formrecognizer/2.1preview2/compose-custom-models-async/compose-custom-models-async).

#### **Client-library SDKs**

Use the programming language code of your choice to create a composed model that will be called with a single model ID. Below are links to code samples that demonstrate how to create a composed model from existing custom models:

* [**C#**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_ModelCompose.md).

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/administration/CreateComposedModel.java).

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/createComposedModel.js).

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.2-beta/sample_create_composed_model.py)

---

## Analyze documents with your custom or composed model

 The custom template **Analyze** operation requires you to provide the `modelID`  in the call to Form Recognizer. You can provide a single custom model ID or a composed model ID for the `modelID` parameter.

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

Test your newly trained models by [analyzing forms](./quickstarts/try-sdk-rest-api.md#analyze-forms-with-a-custom-model) that were not part of the training dataset. Depending on the reported accuracy, you may want to do further training to improve the model. You can continue further training to [improve results](label-tool.md#improve-results).

## Manage your custom models

You can [manage your custom models](./quickstarts/try-sdk-rest-api.md#manage-custom-models) throughout their lifecycle by viewing a [list of all custom models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/GetCustomModels) under your subscription, retrieving information about [a specific custom model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/GetCustomModel), and [deleting custom models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/DeleteCustomModel) from your account.

Great! You have learned the steps to create custom and composed models and use them in your Form Recognizer projects and applications.

## Next steps

Learn more about the Form Recognizer client library by exploring our API reference documentation.

> [!div class="nextstepaction"]
> [Form Recognizer API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)
>
