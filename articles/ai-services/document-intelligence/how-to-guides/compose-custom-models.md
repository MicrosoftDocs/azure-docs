---
title: "How to guide: create and compose custom models with Document Intelligence (formerly Form Recognizer)"
titleSuffix: Azure AI services
description: Learn how to create, use, and manage Document Intelligence custom and composed models
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 11/15/2023
ms.author: lajanuar
---


# Compose custom models

<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [applies to v4.0](../includes/applies-to-v40.md)]
::: moniker-end

::: moniker range="doc-intel-3.1.0"
[!INCLUDE [applies to v3.1](../includes/applies-to-v31.md)]
::: moniker-end

::: moniker range="doc-intel-3.0.0"
[!INCLUDE [applies to v3.0](../includes/applies-to-v30.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](../includes/applies-to-v21.md)]
::: moniker-end

::: moniker range=">=doc-intel-3.0.0"

A composed model is created by taking a collection of custom models and assigning them to a single model ID. You can assign up to 200 trained custom models to a single composed model ID. When a document is submitted to a composed model, the service performs a classification step to decide which custom model accurately represents the form presented for analysis. Composed models are useful when you've trained several models and want to group them to analyze similar form types. For example, your composed model might include custom models trained to analyze your supply, equipment, and furniture purchase orders. Instead of manually trying to select the appropriate model, you can use a composed model to determine the appropriate custom model for each analysis and extraction.

To learn more, see [Composed custom models](../concept-composed-models.md).

In this article, you learn how to create and use composed custom models to analyze your forms and documents.

## Prerequisites

To get started, you need the following resources:

* **An Azure subscription**. You can [create a free Azure subscription](https://azure.microsoft.com/free/cognitive-services/).

* **A Document Intelligence instance**.  Once you have your Azure subscription, [create a Document Intelligence resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal to get your key and endpoint. If you have an existing Document Intelligence resource, navigate directly to your resource page. You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

  1. After the resource deploys, select **Go to resource**.

  1. Copy the **Keys and Endpoint** values from the Azure portal and paste them in a convenient location, such as *Microsoft Notepad*. You need the key and endpoint values to connect your application to the Document Intelligence API.

    :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Still photo showing how to access resource key and endpoint URL.":::

    > [!TIP]
    > For more information, see [**create a Document Intelligence resource**](../create-document-intelligence-resource.md).

* **An Azure storage account.** If you don't know how to create an Azure storage account, follow the [Azure Storage quickstart for Azure portal](../../../storage/blobs/storage-quickstart-blobs-portal.md). You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

## Create your custom models

First, you need a set of custom models to compose. You can use the Document Intelligence Studio, REST API, or client-library SDKs. The steps are as follows:

* [**Assemble your training dataset**](#assemble-your-training-dataset)
* [**Upload your training set to Azure blob storage**](#upload-your-training-dataset)
* [**Train your custom models**](#train-your-custom-model)

## Assemble your training dataset

Building a custom model begins with establishing your training dataset. You need a minimum of five completed forms of the same type for your sample dataset. They can be of different file types (jpg, png, pdf, tiff) and contain both text and handwriting. Your forms must follow the [input requirements](../how-to-guides/build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true#custom-model-input-requirements) for Document Intelligence.

>[!TIP]
> Follow these tips to optimize your data set for training:
>
> * If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.
> * For filled-in forms, use examples that have all of their fields filled in.
> * Use forms with different values in each field.
> * If your form images are of lower quality, use a larger data set (10-15 images, for example).

See [Build a training data set](../how-to-guides/build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true) for tips on how to collect your training documents.

## Upload your training dataset

When you've gathered a set of training documents, you need to [upload your training data](../how-to-guides/build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true#upload-your-training-data) to an Azure blob storage container.

If you want to use manually labeled data, you have to upload the *.labels.json* and *.ocr.json* files that correspond to your training documents.

## Train your custom model

When you [train your model](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects) with labeled data, the model uses supervised learning to extract values of interest, using the labeled forms you provide. Labeled data results in better-performing models and can produce models that work with complex forms or forms containing values without keys.

Document Intelligence uses the [prebuilt-layout model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) API to learn the expected sizes and positions of typeface and handwritten text elements and extract tables. Then it uses user-specified labels to learn the key/value associations and tables in the documents. We recommend that you use five manually labeled forms of the same type (same structure) to get started with training a new model. Then, add more labeled data, as needed, to improve the model accuracy. Document Intelligence enables training a model to extract key-value pairs and tables using supervised learning capabilities.

### [Document Intelligence Studio](#tab/studio)

To create custom models, start with configuring your project:

1. From the Studio homepage, select [**Create new**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects) from the Custom model card.

1. Use the ➕ **Create a project** command to start the new project configuration wizard.

1. Enter project details, select the Azure subscription and resource, and the Azure Blob storage container that contains your data.

1. Review and submit your settings to create the project.

:::image type="content" source="../media/studio/create-project.gif" alt-text="Animation showing create a custom project in Document Intelligence Studio.":::

While creating your custom models, you may need to extract data collections from your documents. The collections may appear one of two formats. Using tables as the visual pattern:

* Dynamic or variable count of values (rows) for a given set of fields (columns)

* Specific collection of values for a given set of fields (columns and/or rows)

See [Document Intelligence Studio: labeling as tables](../quickstarts/try-document-intelligence-studio.md#labeling-as-tables)

### [REST API](#tab/rest)

Training with labels leads to better performance in some scenarios. To train with labels, you need to have special label information files (*\<filename\>.pdf.labels.json*) in your blob storage container alongside the training documents.

Label files contain key-value associations that a user has entered manually. They're needed for labeled data training, but not every source file needs to have a corresponding label file. Source files without labels are treated as ordinary training documents. We recommend five or more labeled files for reliable training. You can use a UI tool like [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects) to generate these files.

Once you have your label files, you can include them with by calling the training method with the *useLabelFile* parameter set to `true`.

:::image type="content" source="../media/studio/rest-use-labels.png" alt-text="Screenshot showing the useLabelFile optional parameter.":::

### [Client libraries](#tab/sdks)

Training with labels leads to better performance in some scenarios. To train with labels, you need to have special label information files (*\<filename\>.pdf.labels.json*) in your blob storage container alongside the training documents. Once you have them, you can call the training method with the *useTrainingLabels* parameter set to `true`.

|Language |Method|
|--|--|
|**C#**|**StartBuildModel**|
|**Java**| [**beginBuildModel**](/java/api/com.azure.ai.formrecognizer.documentanalysis.administration.documentmodeladministrationclient.beginbuildmodel)|
|**JavaScript** | [**beginBuildModel**](/javascript/api/@azure/ai-form-recognizer/documentmodeladministrationclient?view=azure-node-latest#@azure-ai-form-recognizer-documentmodeladministrationclient-beginbuildmodel&preserve-view=true)|
| **Python** | [**begin_build_document_model**](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.documentmodeladministrationclient?view=azure-python#azure-ai-formrecognizer-documentmodeladministrationclient-begin-build-document-model&preserve-view=true)

---


## Create a composed model

> [!NOTE]
> **the `create compose model` operation is only available for custom models trained _with_ labels.** Attempting to compose unlabeled models will produce an error.

With the [**create compose model**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/ComposeDocumentModel) operation, you can assign up to 100 trained custom models to a single model ID. When analyze documents with a composed model, Document Intelligence first classifies the form you submitted, then chooses the best matching assigned model, and returns results for that model. This operation is useful when incoming forms may belong to one of several templates.

### [Document Intelligence Studio](#tab/studio)

Once the training process has successfully completed, you can begin to build your composed model. Here are the steps for creating and using composed models:

* [**Gather your custom model IDs**](#gather-your-model-ids)
* [**Compose your custom models**](#compose-your-custom-models)
* [**Analyze documents**](#analyze-documents)
* [**Manage your composed models**](#manage-your-composed-models)

#### Gather your model IDs

When you train models using the [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/), the model ID is located in the models menu under a project:

:::image type="content" source="../media/studio/composed-model.png" alt-text="Screenshot of model configuration window in Document Intelligence Studio.":::

#### Compose your custom models

1. Select a custom models project.

1. In the project, select the ```Models``` menu item.

1. From the resulting list of models, select the models you wish to compose.

1. Choose the **Compose button** from the upper-left corner.

1. In the pop-up window, name your newly composed model and select **Compose**.

1. When the operation completes, your newly composed model appears in the list.

1. Once the model is ready, use the **Test** command to validate it with your test documents and observe the results.

#### Analyze documents

The custom model **Analyze** operation requires you to provide the `modelID` in the call to Document Intelligence. You should provide the composed model ID for the `modelID` parameter in your applications.

:::image type="content" source="../media/studio/composed-model-id.png" alt-text="Screenshot of a composed model ID in Document Intelligence Studio.":::

#### Manage your composed models

You can manage your custom models throughout life cycles:

* Test and validate new documents.
* Download your model to use in your applications.
* Delete your model when its lifecycle is complete.

:::image type="content" source="../media/studio/compose-manage.png" alt-text="Screenshot of a composed model in the Document Intelligence Studio":::

### [REST API](#tab/rest)

Once the training process has successfully completed, you can begin to build your composed model. Here are the steps for creating and using composed models:

* [**Compose your custom models**](#compose-your-custom-models)
* [**Analyze documents**](#analyze-documents)
* [**Manage your composed models**](#manage-your-composed-models)

#### Compose your custom models

The [compose model API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/ComposeDocumentModel) accepts a list of model IDs to be composed.

:::image type="content" source="../media/compose-model-request-body.png" alt-text="Screenshot of compose model request.":::

#### Analyze documents

To make an [**Analyze document**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) request, use a unique model name in the request parameters.

:::image type="content" source="../media/custom-model-analyze-request.png" alt-text="Screenshot of a custom model request URL.":::

#### Manage your composed models

You can manage custom models throughout your development needs including [**copying**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/CopyDocumentModelTo), [**listing**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/GetModels), and [**deleting**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/DeleteModel) your models.

### [Client libraries](#tab/sdks)

Once the training process has successfully completed, you can begin to build your composed model. Here are the steps for creating and using composed models:

* [**Create a composed model**](#create-a-composed-model)
* [**Analyze documents**](#analyze-documents)
* [**Manage your composed models**](#manage-your-composed-models)

#### Create a composed model

You can use the programming language of your choice to create a composed model:

| Programming language| Code sample |
|--|--|
|**C#** | [Model compose](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_ModelCompose.md)
|**Java** | [Model compose](https://github.com/Azure/azure-sdk-for-java/blob/afa0d44fa42979ae9ad9b92b23cdba493a562127/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/administration/ComposeDocumentModel.java)
|**JavaScript** | [Compose model](https://github.com/witemple-msft/azure-sdk-for-js/blob/7e3196f7e529212a6bc329f5f06b0831bf4cc174/sdk/formrecognizer/ai-form-recognizer/samples/v4/javascript/composeModel.js)
|**Python** | [Create composed model](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.3.0/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.2_and_later/sample_compose_model.py)

#### Analyze documents

Once you've built your composed model, you can use it to analyze forms and documents. Use your composed `model ID` and let the service decide which of your aggregated custom models fits best according to the document provided.

|Programming language| Code sample |
|--|--|
|**C#** | [Analyze a document with a custom/composed model using model ID](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_AnalyzeWithCustomModel.md)
|**Java** | [Analyze a document with a custom/composed model using model ID](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/AnalyzeCustomDocumentFromUrl.java)
|**JavaScript** | [Analyze a document with a custom/composed model using model ID](https://github.com/witemple-msft/azure-sdk-for-js/blob/7e3196f7e529212a6bc329f5f06b0831bf4cc174/sdk/formrecognizer/ai-form-recognizer/samples/v4/javascript/analyzeDocumentByModelId.js)
|**Python** | [Analyze a document with a custom/composed model using model ID](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.3.0/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.2_and_later/sample_analyze_custom_documents.py)

#### Manage your composed models

You can manage a custom model at each stage in its life cycles. You can copy a custom model between resources, view a list of all custom models under your subscription, retrieve information about a specific custom model, and delete custom models from your account.

|Programming language| Code sample |
|--|--|
|**C#** | [Copy a custom model between Document Intelligence resources](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_CopyCustomModel.md#copy-a-custom-model-between-form-recognizer-resources)|
|**Java** | [Copy a custom model between Document Intelligence resources](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/administration/CopyDocumentModel.java)|
|**JavaScript** | [Copy a custom model between Document Intelligence resources](https://github.com/witemple-msft/azure-sdk-for-js/blob/7e3196f7e529212a6bc329f5f06b0831bf4cc174/sdk/formrecognizer/ai-form-recognizer/samples/v4/javascript/copyModel.js)|
|**Python** | [Copy a custom model between Document Intelligence resources](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.3.0/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.2_and_later/sample_copy_model_to.py)|

---

Great! You've learned the steps to create custom and composed models and use them in your Document Intelligence projects and applications.

## Next steps

Try one of our Document Intelligence quickstarts:

> [!div class="nextstepaction"]
> [Document Intelligence Studio](../quickstarts/try-document-intelligence-studio.md)

> [!div class="nextstepaction"]
> [REST API](../quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)

> [!div class="nextstepaction"]
> [C#](../quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prerequisites)

> [!div class="nextstepaction"]
> [Java](../quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)

> [!div class="nextstepaction"]
> [JavaScript](../quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)

> [!div class="nextstepaction"]
> [Python](../quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)

:::moniker-end

::: moniker range="doc-intel-2.1.0"

Document Intelligence uses advanced machine-learning technology to detect and extract information from document images and return the extracted data in a structured JSON output. With Document Intelligence, you can train standalone custom models or combine custom models to create composed models.

* **Custom models**. Document Intelligence custom models enable you to analyze and extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases.

* **Composed models**. A composed model is created by taking a collection of custom models and assigning them to a single model that encompasses your form types. When a document is submitted to a composed model, the service performs a classification step to decide which custom model accurately represents the form presented for analysis.

In this article, you learn how to create Document Intelligence custom and composed models using our [Document Intelligence Sample Labeling tool](../label-tool.md), [REST APIs](../how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true), or [client-library SDKs](../how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true).

## Sample Labeling tool

Try extracting data from custom forms using our Sample Labeling tool. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

> [!div class="nextstepaction"]
> [Try it](https://fott-2-1.azurewebsites.net/projects/create)

In the Document Intelligence UI:

1. Select **Use Custom to train a model with labels and get key value pairs**.

      :::image type="content" source="../media/label-tool/fott-use-custom.png" alt-text="Screenshot of the FOTT tool select custom model option.":::

1. In the next window, select **New project**:

    :::image type="content" source="../media/label-tool/fott-new-project.png" alt-text="Screenshot of the FOTT tool select new project option.":::

## Create your models

The steps for building, training, and using custom and composed models are as follows:

* [**Assemble your training dataset**](#assemble-your-training-dataset)
* [**Upload your training set to Azure blob storage**](#upload-your-training-dataset)
* [**Train your custom model**](#train-your-custom-model)
* [**Compose custom models**](#create-a-composed-model)
* [**Analyze documents**](#analyze-documents-with-your-custom-or-composed-model)
* [**Manage your custom models**](#manage-your-custom-models)

## Assemble your training dataset

Building a custom model begins with establishing your training dataset. You need a minimum of five completed forms of the same type for your sample dataset. They can be of different file types (jpg, png, pdf, tiff) and contain both text and handwriting. Your forms must follow the [input requirements](build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true#custom-model-input-requirements) for Document Intelligence.

## Upload your training dataset

You need to [upload your training data](build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true#upload-your-training-data)
to an Azure blob storage container. If you don't know how to create an Azure storage account with a container, *see* [Azure Storage quickstart for Azure portal](../../../storage/blobs/storage-quickstart-blobs-portal.md). You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

## Train your custom model

You [train your model](build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true#train-your-model)  with labeled data sets. Labeled datasets rely on the prebuilt-layout API, but supplementary human input is included such as your specific labels and field locations. Start with at least five completed forms of the same type for your labeled training data.

When you train with labeled data, the model uses supervised learning to extract values of interest, using the labeled forms you provide. Labeled data results in better-performing models and can produce models that work with complex forms or forms containing values without keys.

Document Intelligence uses the [Layout](../concept-layout.md) API to learn the expected sizes and positions of typeface and handwritten text elements and extract tables. Then it uses user-specified labels to learn the key/value associations and tables in the documents. We recommend that you use five manually labeled forms of the same type (same structure) to get started when training a new model. Add more labeled data as needed to improve the model accuracy. Document Intelligence enables training a model to extract key value pairs and tables using supervised learning capabilities.

[Get started with Train with labels](../label-tool.md)

  [!VIDEO https://learn.microsoft.com/Shows/Docs-Azure/Azure-Form-Recognizer/player]

## Create a composed model

> [!NOTE]
> **Model Compose is only available for custom models trained *with* labels.** Attempting to compose unlabeled models will produce an error.

With the Model Compose operation, you can assign up to 200 trained custom models to a single model ID. When you call Analyze with the composed model ID, Document Intelligence classifies the form you submitted first, chooses the best matching assigned model, and then returns results for that model. This operation is useful when incoming forms may belong to one of several templates.

Using the Document Intelligence Sample Labeling tool, the REST API, or the Client-library SDKs, follow the steps to set up a composed model:

1. [**Gather your custom model IDs**](#gather-your-custom-model-ids)
1. [**Compose your custom models**](#compose-your-custom-models)

### Gather your custom model IDs

Once the training process has successfully completed, your custom model is assigned a model ID. You can retrieve a model ID as follows:

<!-- Applies to FOTT but labeled studio to eliminate tab grouping warning -->
### [**Document Intelligence Sample Labeling tool**](#tab/studio)

When you train models using the [**Document Intelligence Sample Labeling tool**](https://fott-2-1.azurewebsites.net/), the model ID is located in the Train Result window:

:::image type="content" source="../media/fott-training-results.png" alt-text="Screenshot of training results window.":::

### [**REST API**](#tab/rest)

The [**REST API**](build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true#train-your-model) returns a `201 (Success)` response with a **Location** header. The value of the last parameter in this header is the model ID for the newly trained model:

:::image type="content" source="../media/model-id.png" alt-text="Screenshot of the returned location header containing the model ID.":::

### [**Client-library SDKs**](#tab/sdks)

 The [**client-library SDKs**](build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true#train-your-model) return a model object that can be queried to return the trained model ID:

* C\#  | [CustomFormModel Class](/dotnet/api/azure.ai.formrecognizer.training.customformmodel?view=azure-dotnet&preserve-view=true#properties "Azure SDK for .NET")

* Java | [CustomFormModelInfo Class](/java/api/com.azure.ai.formrecognizer.training.models.customformmodelinfo?view=azure-java-stable&preserve-view=true#methods "Azure SDK for Java")

* JavaScript | CustomFormModelInfo interface

* Python | [CustomFormModelInfo Class](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.customformmodelinfo?view=azure-python&preserve-view=true&branch=main#variables "Azure SDK for Python")

---

#### Compose your custom models

After you've gathered your custom models corresponding to a single form type, you can compose them into a single model.

<!-- Applies to FOTT but labeled studio to eliminate tab grouping warning -->
### [**Document Intelligence Sample Labeling tool**](#tab/studio)

The **Sample Labeling tool** enables you to quickly get started training models and  composing them to a single model ID.

After you have completed training, compose your models as follows:

1. On the left rail menu, select the **Model Compose** icon (merging arrow).

1. In the main window, select the models you wish to assign to a single model ID. Models with the arrows icon are already composed models.

1. Choose the **Compose button** from the upper-left corner.

1. In the pop-up window, name your newly composed model and select **Compose**.

When the operation completes, your newly composed model appears in the list.

  :::image type="content" source="../media/custom-model-compose.png" alt-text="Screenshot of the model compose window." lightbox="../media/custom-model-compose-expanded.png":::

### [**REST API**](#tab/rest)

Using the **REST API**, you can make a  [**Compose Custom Model**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/ComposeDocumentModel) request to create a single composed model from existing models. The request body requires a string array of your `modelIds` to compose and you can optionally define the `modelName`.

### [**Client-library SDKs**](#tab/sdks)

Use the programming language code of your choice to create a composed model that is called with a single model ID. The following links are code samples that demonstrate how to create a composed model from existing custom models:

* [**C#/.NET**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_ModelCompose.md).

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/administration/ComposeDocumentModel.java).

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/createComposedModel.js).

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.3.0/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.1/sample_create_composed_model.py)

---


## Analyze documents with your custom or composed model

 The custom form **Analyze** operation requires you to provide the `modelID`  in the call to Document Intelligence. You can provide a single custom model ID or a composed model ID for the `modelID` parameter.


### [**Document Intelligence Sample Labeling tool**](#tab/studio)

1. On the tool's left-pane menu, select the **Analyze icon** (light bulb).

1. Choose a local file or  image URL to analyze.

1. Select the **Run Analysis** button.

1. The tool applies tags in bounding boxes and reports the confidence percentage for each tag.

:::image type="content" source="../media/analyze.png" alt-text="Screenshot of Document Intelligence tool analyze-a-custom-form window.":::

### [**REST API**](#tab/rest)

Using the REST API, you can make an [Analyze Document](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) request to analyze a document and extract key-value pairs and table data.

### [**Client-library SDKs**](#tab/sdks)

Using the programming language of your choice to analyze a form or document with a custom or composed model. You need your Document Intelligence endpoint, key, and model ID.

* [**C#/.NET**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/Sample_ModelCompose.md)

* [**Java**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/AnalyzeCustomDocumentFromUrl.java)

* [**JavaScript**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript/recognizeCustomForm.js)

* [**Python**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.1/sample_recognize_custom_forms.py)

---


Test your newly trained models by [analyzing forms](build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true#test-the-model) that weren't part of the training dataset. Depending on the reported accuracy, you may want to do further training to improve the model. You can continue further training to [improve results](../label-tool.md#improve-results).

## Manage your custom models

You can [manage your custom models](../how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) throughout their lifecycle by viewing a [list of all custom models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/GetModels) under your subscription, retrieving information about [a specific custom model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/GetModel), and [deleting custom models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/DeleteModel) from your account.

Great! You've learned the steps to create custom and composed models and use them in your Document Intelligence projects and applications.

## Next steps

Learn more about the Document Intelligence client library by exploring our API reference documentation.

> [!div class="nextstepaction"]
> [Document Intelligence API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)

::: moniker-end
