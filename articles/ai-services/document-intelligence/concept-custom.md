---
title: Custom document models - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Label and train customized models for your documents and compose multiple models into a single model identifier.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: lajanuar
monikerRange: '<=doc-intel-4.0.0'
---

# Document Intelligence custom models

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

[!INCLUDE [applies to v4.0](includes/applies-to-v40.md)]
::: moniker-end

::: moniker range="doc-intel-3.1.0"
[!INCLUDE [applies to v3.1](includes/applies-to-v31.md)]
::: moniker-end

::: moniker range="doc-intel-3.0.0"
[!INCLUDE [applies to v3.0](includes/applies-to-v30.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v21.md)]
::: moniker-end

Document Intelligence uses advanced machine learning technology to identify documents, detect and extract information from forms and documents, and return the extracted data in a structured JSON output. With Document Intelligence, you can use document analysis models, pre-built/pre-trained, or your trained standalone custom models.

Custom models now include [custom classification models](./concept-custom-classifier.md) for scenarios where you need to identify the document type prior to invoking the extraction model. Classifier models are available starting with the ```2023-07-31 (GA)``` API. A classification model can be paired with a custom extraction model to analyze and extract fields from forms and documents specific to your business to create a document processing solution. Standalone custom extraction models can be combined to create [composed models](concept-composed-models.md).

::: moniker range=">=doc-intel-3.0.0"

## Custom document model types

Custom document models can be one of two types, [**custom template**](concept-custom-template.md) or custom form and [**custom neural**](concept-custom-neural.md)  or custom document models. The labeling and training process for both models is identical, but the models differ as follows:

### Custom extraction models

To create a custom extraction model, label a dataset of documents with the values you want extracted and train the model on the labeled dataset. You only need five examples of the same form or document type to get started.

### Custom neural model

> [!IMPORTANT]
>
 > Starting with version 3.1—2023-07-31(GA) API, custom neural models only require one sample labeled document to train a model.
>

The custom neural (custom document) model uses deep learning models and  base model trained on a large collection of documents. This model is then fine-tuned or adapted to your data when you train the model with a labeled dataset. Custom neural models support structured, semi-structured, and unstructured documents to extract fields. Custom neural models currently support English-language documents. When you're choosing between the two model types, start with a neural model to determine if it meets your functional needs. See [neural models](concept-custom-neural.md) to learn more about custom document models.

### Custom template model

The custom template or custom form model relies on a consistent visual template to extract the labeled data. Variances in the visual structure of your documents affect the accuracy of your model. Structured  forms such as questionnaires or applications are examples of consistent visual templates.

Your training set consists of structured documents where the formatting and layout are static and constant from one document instance to the next. Custom template models support key-value pairs, selection marks, tables, signature fields, and regions. Template models and can be trained on documents in any of the [supported languages](language-support.md). For more information, *see* [custom template models](concept-custom-template.md).

If the language of your documents and extraction scenarios supports custom neural models, it's recommended that you use custom neural models over template models for higher accuracy.

> [!TIP]
>
>To confirm that your training documents present a consistent visual template, remove all the user-entered data from each form in the set. If the blank forms are identical in appearance, they represent a consistent visual template.
>
> For more information, *see* [Interpret and improve accuracy and confidence for custom models](concept-accuracy-confidence.md).

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.

* Supported file formats:

    |Model | PDF |Image: </br>JPEG/JPG, PNG, BMP, TIFF, HEIF | Microsoft Office: </br> Word (DOCX), Excel (XLSX), PowerPoint (PPTX), and HTML|
    |--------|:----:|:-----:|:---------------:
    |Read            | ✔    | ✔    | ✔  |
    |Layout          | ✔  | ✔ | ✔ (2023-10-31-preview)  |
    |General&nbsp;Document| ✔  | ✔ |   |
    |Prebuilt        |  ✔  | ✔ |   |
    |Custom          |  ✔  | ✔ |   |

    &#x2731; Microsoft Office files are currently not supported for other models or versions.

* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).

* The file size for analyzing documents is 500 MB for paid (S0) tier and 4 MB for free (F0) tier.

* Image dimensions must be between 50 x 50 pixels and 10,000 px x 10,000 pixels.

* If your PDFs are password-locked, you must remove the lock before submission.

* The minimum height of the text to be extracted is 12 pixels for a 1024 x 768 pixel image. This dimension corresponds to about `8`-point text at 150 dots per inch (DPI).

* For custom model training, the maximum number of pages for training data is 500 for the custom template model and 50,000 for the custom neural model.

* For custom extraction model training, the total size of training data is 50 MB for template model and 1G-MB for the neural model.

* For custom classification model training, the total size of training data is `1GB`  with a maximum of 10,000 pages.

### Build mode

The build custom model operation has added support for the *template* and *neural* custom models. Previous versions of the REST API and SDKs only supported a single build mode that is now known as the *template* mode.

* Template models only accept documents that have the same basic page structure—a uniform visual appearance—or the same relative positioning of elements within the document.

* Neural models support documents that have the same information, but different page structures. Examples of these documents include United States W2 forms, which share the same information, but vary in appearance across companies. Neural models currently only support English text.

This table provides links to the build mode programming language SDK references and code samples on GitHub:

|Programming language | SDK reference | Code sample |
|---|---|---|
| C#/.NET | [DocumentBuildMode Struct](/dotnet/api/azure.ai.formrecognizer.documentanalysis.documentbuildmode?view=azure-dotnet&preserve-view=true#properties) | [Sample_BuildCustomModelAsync.cs](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/tests/samples/Sample_BuildCustomModelAsync.cs)
|Java| DocumentBuildMode Class | [BuildModel.java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/administration/BuildDocumentModel.java)|
|JavaScript | [DocumentBuildMode type](/javascript/api/@azure/ai-form-recognizer/documentbuildmode?view=azure-node-latest&preserve-view=true)| [buildModel.js](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v4-beta/javascript/buildModel.js)|
|Python | DocumentBuildMode Enum| [sample_build_model.py](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b3/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.2-beta/sample_build_model.py)|

## Compare model features

The following table compares custom template and custom neural features:

|Feature|Custom template (form) | Custom neural (document) |
|---|---|---|
|Document structure|Template, form, and structured | Structured, semi-structured, and unstructured|
|Training time | 1 to 5 minutes | 20 minutes to 1 hour |
|Data extraction | Key-value pairs, tables, selection marks, coordinates, and signatures | Key-value pairs, selection marks and tables|
|Document variations | Requires a model per each variation | Uses a single model for all variations |
|Language support | Multiple [language support](concept-custom-template.md#supported-languages-and-locales)  | English, with preview support for Spanish, French, German, Italian and Dutch [language support](concept-custom-neural.md#supported-languages-and-locales) |

### Custom classification model

 Document classification is a new scenario supported by Document Intelligence with the ```2023-07-31``` (v3.1 GA) API. the document classifier API supports classification and splitting scenarios. Train a classification model to identify the different types of documents your application supports. The input file for the classification model can contain multiple documents and classifies each document within an associated page range. See [custom classification](concept-custom-classifier.md) models to learn more.

## Custom model tools

Document Intelligence v3.1 and later models support the following tools, applications, and libraries, programs, and libraries:

| Feature | Resources | Model ID|
|---|---|:---|
|Custom model| &bullet; [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)</br>&bullet; [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)</br>&bullet; [C# SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet; [Python SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)|***custom-model-id***|

:::moniker-end

::: moniker range="doc-intel-2.1.0"

Document Intelligence v2.1 supports the following tools, applications, and libraries:

> [!NOTE]
> Custom model types [custom neural](concept-custom-neural.md) and [custom template](concept-custom-template.md) are available with Document Intelligence version v3.1 and v3.0 APIs.

| Feature | Resources |
|---|---|
|Custom model| &bullet; [Document Intelligence labeling tool](https://fott-2-1.azurewebsites.net)</br>&bullet; [REST API](how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&tabs=windows&pivots=programming-language-rest-api&preserve-view=true)</br>&bullet; [Client library SDK](~/articles/ai-services/document-intelligence/how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</br>&bullet; [Document Intelligence Docker container](containers/install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)|

:::moniker-end

## Build a custom model

Extract data from your specific or unique documents using custom models. You need the following resources:

* An Azure subscription. You can [create one for free](https://azure.microsoft.com/free/cognitive-services/).
* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

  :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot that shows the keys and endpoint location in the Azure portal.":::

::: moniker range="doc-intel-2.1.0"

## Sample Labeling tool

>[!TIP]
>
> * For an enhanced experience and advanced model quality, try the [Document Intelligence v3.0 Studio](https://formrecognizer.appliedai.azure.com/studio).
> * The v3.0 Studio supports any model trained with v2.1 labeled data.
> * You can refer to the API migration guide for detailed information about migrating from v2.1 to v3.0.
> * *See* our [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) or [**C#**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**Java**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), or [Python](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) SDK quickstarts to get started with the v3.0 version.

* The Document Intelligence Sample Labeling tool is an open source tool that enables you to test the latest features of Document Intelligence and Optical Character Recognition (OCR) features.

* Try the [**Sample Labeling tool quickstart**](quickstarts/try-sample-label-tool.md#train-a-custom-model) to get started building and using a custom model.

:::moniker-end

::: moniker range=">=doc-intel-3.0.0"

## Document Intelligence Studio

> [!NOTE]
> Document Intelligence Studio is available with v3.1 and v3.0 APIs.

1. On the **Document Intelligence Studio** home page, select **Custom extraction models**.

1. Under **My Projects**, select **Create a project**.

1. Complete the project details fields.

1. Configure the service resource by adding your **Storage account** and **Blob container** to **Connect your training data source**.

1. Review and create your project.

1. Add your sample documents to label, build and test your custom model.

    > [!div class="nextstepaction"]
    > [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)

For a detailed walkthrough to create your first custom extraction model, see [how to create a custom extraction model](how-to-guides/build-a-custom-model.md)

## Custom model extraction summary

This table compares the supported data extraction areas:

|Model| Form fields | Selection marks | Structured fields (Tables) | Signature | Region labeling |
|--|:--:|:--:|:--:|:--:|:--:|
|Custom template| ✔ | ✔ | ✔ | ✔ | ✔ |
|Custom neural| ✔| ✔ | ✔ | **n/a** | * |

**Table symbols**:
✔—supported;
**n/a—currently unavailable;
*-behaves differently. With template models, synthetic data is generated at training time. With neural models, exiting text recognized in the region is selected.

> [!TIP]
> When choosing between the two model types, start with a custom neural model if it meets your functional needs. See [custom neural](concept-custom-neural.md) to learn more about custom neural models.

:::moniker-end

## Custom model development options

The following table describes the features available with the associated tools and SDKs. As a best practice, ensure that you use the compatible tools listed here.

| Document type | REST API | SDK | Label and Test Models|
|--|--|--|--|
| Custom template v 4.0 v3.1 v3.0 | [Document Intelligence 3.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)| [Document Intelligence SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)| [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)|
| Custom neural v4.0 v3.1 v3.0 | [Document Intelligence 3.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)| [Document Intelligence SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)| [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)
| Custom form v2.1 | [Document Intelligence 2.1 GA API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) | [Document Intelligence SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true?pivots=programming-language-python)| [Sample labeling tool](https://fott-2-1.azurewebsites.net/)|
> [!NOTE]
> Custom template models trained with the 3.0 API will have a few improvements over the 2.1 API stemming from improvements to the OCR engine. Datasets used to train a custom template model using the 2.1 API can still be used to train a new model using the 3.0 API.

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats are JPEG/JPG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF files, up to 2,000 pages can be processed. With a free tier subscription, only the first two pages are processed.
* The file size must be less than 500 MB for paid (S0) tier and 4 MB for free (F0) tier.
* Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.

  > [!TIP]
  > Training data:
  >
  >* If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.
  > * Please supply only a single instance of the form per document.
  > * For filled-in forms, use examples that have all their fields filled in.
  > * Use forms with different values in each field.
  >* If your form images are of lower quality, use a larger dataset. For example, use 10 to 15 images.

## Supported languages and locales

*See* our [Language Support—custom models](language-support-custom.md) page for a complete list of supported languages.

### Try signature detection

* **Custom model v4.0, v3.1 and v3.0 APIs** supports signature detection for custom forms. When you train custom models, you can specify certain fields as signatures. When a document is analyzed with your custom model, it indicates whether a signature was detected or not.
* [Document Intelligence v3.1 migration guide](v3-1-migration-guide.md): This guide shows you how to use the v3.0 version in your applications and workflows.
* [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument): This API shows you more about the v3.0 version and new capabilities.

1. Build your training dataset.

1. Go to [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio). Under **Custom models**, select **Custom form**.

    :::image type="content" source="media/label-tool/select-custom-form.png" alt-text="Screenshot that shows selecting the Document Intelligence Studio Custom form page.":::

1. Follow the workflow to create a new project:

   1. Follow the **Custom model** input requirements.

   1. Label your documents. For signature fields, use **Region** labeling for better accuracy.

      :::image type="content" source="media/label-tool/signature-label-region-too.png" alt-text="Screenshot that shows the Label signature field.":::

After your training set is labeled, you can train your custom model and use it to analyze documents. The signature fields specify whether a signature was detected or not.

## Next steps

::: moniker range="doc-intel-2.1.0"

* Try processing your own forms and documents with the [Document Intelligence Sample Labeling tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
:::moniker-end

::: moniker range=">=doc-intel-3.0.0"

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

:::moniker-end
