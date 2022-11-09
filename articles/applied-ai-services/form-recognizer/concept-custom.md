---
title: Custom document models - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Label and train customized models for your documents and compose multiple models into a single model identifier.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 08/22/2022
ms.author: lajanuar
monikerRange: '>=form-recog-2.1.0'
recommendations: false
---
# Custom document models

[!INCLUDE [applies to v3.0 and v2.1](includes/applies-to-v3-0-and-v2-1.md)]

Form Recognizer uses advanced machine learning technology to detect and extract information from forms and documents and returns the extracted data in a structured JSON output. With Form Recognizer, you can use pre-built or pre-trained models or you can train standalone custom models. Custom models extract and analyze distinct data and use cases from forms and documents specific to your business. Standalone custom models can be combined to create [composed models](concept-composed-models.md).

To create a custom model, you label a dataset of documents with the values you want extracted and train the model on the labeled dataset. You only need five examples of the same form or document type to get started.

## Custom document model types

Custom document models can be one of two types, [**custom template**](concept-custom-template.md ) or custom form and [**custom neural**](concept-custom-neural.md)  or custom document models. The labeling and training process for both models is identical, but the models differ as follows:

### Custom template model (v3.0)

The custom template or custom form model relies on a consistent visual template to extract the labeled data. The accuracy of your model is affected by variances in the visual structure of your documents. Structured  forms such as questionnaires or applications are examples of consistent visual templates.

Your training set will consist of structured documents where the formatting and layout are static and constant from one document instance to the next. Custom template models support key-value pairs, selection marks, tables, signature fields, and regions. Template models and can be trained on documents in any of the [supported languages](language-support.md). For more information, *see* [custom template models](concept-custom-template.md ).

> [!TIP]
>
>To confirm that your training documents present a consistent visual template, remove all the user-entered data from each form in the set. If the blank forms are identical in appearance, they represent a consistent visual template.
>
> For more information, *see* [Interpret and improve accuracy and confidence for custom models](concept-accuracy-confidence.md).

### Custom neural model (v3.0)

The custom neural (custom document) model uses deep learning models and  base model trained on a large collection of documents. This model is then fine-tuned or adapted to your data when you train the model with a labeled dataset. Custom neural models support structured, semi-structured, and unstructured documents to extract fields. Custom neural models currently support English-language documents. When you're choosing between the two model types, start with a neural model to determine if it meets your functional needs. See [neural models](concept-custom-neural.md) to learn more about custom document models.

## Build mode

The build custom model operation has added support for the *template* and *neural* custom models. Previous versions of the REST API and SDKs only supported a single build mode that is now known as the *template* mode.

* Template models only accept documents that have the same basic page structure—a uniform visual appearance—or the same relative positioning of elements within the document.

* Neural models support documents that have the same information, but different page structures. Examples of these documents include United States W2 forms, which share the same information, but may vary in appearance across companies. Neural models currently only support English text.

This table provides links to the build mode programming language SDK references and code samples on GitHub:

|Programming language | SDK reference | Code sample |
|---|---|---|
| C#/.NET | [DocumentBuildMode Struct](/dotnet/api/azure.ai.formrecognizer.documentanalysis.documentbuildmode?view=azure-dotnet&preserve-view=true#properties) | [Sample_BuildCustomModelAsync.cs](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/tests/samples/Sample_BuildCustomModelAsync.cs)
|Java| DocumentBuildMode Class | [BuildModel.java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/administration/BuildDocumentModel.java)|
|JavaScript | [DocumentBuildMode type](/javascript/api/@azure/ai-form-recognizer/documentbuildmode?view=azure-node-latest&preserve-view=true)| [buildModel.js](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v4-beta/javascript/buildModel.js)|
|Python | DocumentBuildMode Enum| [sample_build_model.py](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b3/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.2-beta/sample_build_model.py)|

## Compare model features

The table below compares custom template and custom neural features:

|Feature|Custom template (form) | Custom neural (document) |
|---|---|---|
|Document structure|Template, form, and structured | Structured, semi-structured, and unstructured|
|Training time | 1 to 5 minutes | 20 minutes to 1 hour |
|Data extraction | Key-value pairs, tables, selection marks, coordinates, and signatures | Key-value pairs, selection marks and tables|
|Document variations | Requires a model per each variation | Uses a single model for all variations |
|Language support | Multiple [language support](language-support.md#read-layout-and-custom-form-template-model)  | United States English (en-US) [language support](language-support.md#custom-neural-model) |

## Custom model tools

The following tools are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID|
|---|---|:---|
|Custom model| <ul><li>[Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)</li><li>[REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[C# SDK](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[Python SDK](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>|***custom-model-id***|

The following tools are supported by Form Recognizer v2.1:

| Feature | Resources | Model ID|
|---|---|:---|
|Custom model| <ul><li>[Form Recognizer labeling tool](https://fott-2-1.azurewebsites.net)</li><li>[REST API](/azure/applied-ai-services/form-recognizer/how-to-guides/use-sdk-rest-api?view=form-recog-2.1.0&preserve-view=true&tabs=windows&pivots=programming-language-rest-api#analyze-forms-with-a-custom-model)</li><li>[Client library SDK](/azure/applied-ai-services/form-recognizer/how-to-guides/v2-1-sdk-rest-api)</li><li>[Form Recognizer Docker container](containers/form-recognizer-container-install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)</li></ul>|***custom-model-id***|


### Try building a custom model

Try extracting data from your specific or unique documents using custom models. You need the following resources:

* An Azure subscription. You can [create one for free](https://azure.microsoft.com/free/cognitive-services/).
* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

  :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot that shows the keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio 

> [!NOTE]
> Form Recognizer Studio is available with the v3.0 API.

1. On the **Form Recognizer Studio** home page, select **Custom form**.

1. Under **My Projects**, select **Create a project**.

1. Complete the project details fields.

1. Configure the service resource by adding your **Storage account** and **Blob container** to **Connect your training data source**.

1. Review and create your project.

1. Use the sample documents to build and test your custom model.

    > [!div class="nextstepaction"]
    > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)

## Custom model extraction summary

This table compares the supported data extraction areas:

|Model| Form fields | Selection marks | Structured fields (Tables) | Signature | Region labeling |
|--|:--:|:--:|:--:|:--:|:--:|
|Custom template| ✔ | ✔ | ✔ | ✔ | ✔ |
|Custom neural| ✔| ✔ | ✔ | **n/a** | **n/a** |

**Table symbols**: ✔—supported; **n/a—currently unavailable

> [!TIP]
> When choosing between the two model types, start with a custom neural model if it meets your functional needs. See [custom neural](concept-custom-neural.md ) to learn more about custom neural models.

## Custom model development options

The following table describes the features available with the associated tools and SDKs. As a best practice, ensure that you use the compatible tools listed here.

| Document type | REST API | SDK | Label and Test Models|
|--|--|--|--|
| Custom form 2.1 | [Form Recognizer 2.1 GA API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) | [Form Recognizer SDK](quickstarts/get-started-v2-1-sdk-rest-api.md?pivots=programming-language-python)| [Sample labeling tool](https://fott-2-1.azurewebsites.net/)|
| Custom template 3.0 | [Form Recognizer 3.0 ](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)| [Form Recognizer SDK](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)| [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)|
| Custom neural | [Form Recognizer 3.0 ](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)| [Form Recognizer SDK](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)| [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)

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

The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) doesn't support the BMP file format. This limitation relates to the tool, not the Form Recognizer service.

## Supported languages and locales

 The Form Recognizer v3.0 version introduces more language support for custom models. For a list of supported handwritten and printed text, see [Language support](language-support.md).

## Form Recognizer v3.0 

 Form Recognizer v3.0  introduces several new features and capabilities:

* **Custom model API (v3.0)**: This version supports signature detection for custom forms. When you train custom models, you can specify certain fields as signatures. When a document is analyzed with your custom model, it indicates whether a signature was detected or not.
* [Form Recognizer v3.0 migration guide](v3-migration-guide.md): This guide shows you how to use the v3.0 version in your applications and workflows.
* [REST API ](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument): This API shows you more about the v3.0 version and new capabilities.

### Try signature detection

1. Build your training dataset.

1. Go to [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio). Under **Custom models**, select **Custom form**.

    :::image type="content" source="media/label-tool/select-custom-form.png" alt-text="Screenshot that shows selecting the Form Recognizer Studio Custom form page.":::

1. Follow the workflow to create a new project:

   1. Follow the **Custom model** input requirements.

   1. Label your documents. For signature fields, use **Region** labeling for better accuracy.

      :::image type="content" source="media/label-tool/signature-label-region-too.png" alt-text="Screenshot that shows the Label signature field.":::

After your training set is labeled, you can train your custom model and use it to analyze documents. The signature fields specify whether a signature was detected or not.


## Next steps

Explore Form Recognizer quickstarts and REST APIs:

| Quickstart | REST API|
|--|--|
|[v3.0 Studio quickstart](quickstarts/try-v3-form-recognizer-studio.md) |[Form Recognizer v3.0 API 2022-08-31](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)|
| [v2.1 quickstart](quickstarts/get-started-v2-1-sdk-rest-api.md) | [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/BuildDocumentModel) |

