---
title: "Document Intelligence Studio"
titleSuffix: Azure AI services
description: "Concept: Form and document processing, data extraction, and analysis using Document Intelligence Studio "
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '>=doc-intel-3.0.0'
---


# Document Intelligence Studio

[!INCLUDE [applies to v3.1 and v3.0](includes/applies-to-v3-1-v3-0.md)]

[Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/) is an online tool for visually exploring, understanding, and integrating features from the Document Intelligence service into your applications. Use the [Document Intelligence Studio quickstart](quickstarts/try-document-intelligence-studio.md) to get started analyzing documents with pretrained models. Build custom template models and reference the models in your applications using the [Python SDK v3.0](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and other quickstarts.

The following image shows the landing page for Document Intelligence Studio.

:::image border="true" type="content" source="media/studio/welcome-to-studio.png" alt-text="Document Intelligence Studio Homepage":::

## Document Intelligence Studio features

The following Document Intelligence service features are available in the Studio.

* **Read**: Try out Document Intelligence's Read feature to extract text lines, words, detected languages, and handwritten style if detected. Start with the [Studio Read feature](https://formrecognizer.appliedai.azure.com/studio/read). Explore with sample documents and your documents. Use the interactive visualization and JSON output to understand how the feature works. See the [Read overview](concept-read.md) to learn more and get started with the [Python SDK quickstart for Layout](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true).

* **Layout**: Try out Document Intelligence's Layout feature to extract text, tables, selection marks, and structure information. Start with the [Studio Layout feature](https://formrecognizer.appliedai.azure.com/studio/layout). Explore with sample documents and your documents. Use the interactive visualization and JSON output to understand how the feature works. See the [Layout overview](concept-layout.md) to learn more and get started with the [Python SDK quickstart for Layout](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#layout-model).

* **General Documents**: Try out Document Intelligence's General Documents feature to extract key-value pairs. Start with the [Studio General Documents feature](https://formrecognizer.appliedai.azure.com/studio/document). Explore with sample documents and your documents. Use the interactive visualization and JSON output to understand how the feature works. See the [General Documents overview](concept-general-document.md) to learn more and get started with the [Python SDK quickstart for Layout](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#general-document-model).

* **Prebuilt models**: Document Intelligence's prebuilt models enable you to add intelligent document processing to your apps and flows without having to train and build your own models. As an example, start with the [Studio Invoice feature](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice). Explore with sample documents and your documents. Use the interactive visualization, extracted fields list, and JSON output to understand how the feature works. See the [Models overview](concept-model-overview.md) to learn more and get started with the [Python SDK quickstart for Prebuilt Invoice](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model).

* **Custom extraction models**: Document Intelligence's custom models enable you to extract fields and values from models trained with your data, tailored to your forms and documents. Create standalone custom models or combine two or more custom models to create a composed model to extract data from multiple form types. Start with the [Studio Custom models feature](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects).  Use the help wizard, labeling interface, training step, and visualizations to understand how the feature works. Test the custom model with your sample documents and iterate to improve the model. See the [Custom models overview](concept-custom.md) to learn more.

* **Custom classification models**: Document classification is a new scenario supported by Document Intelligence. the document classifier API supports classification and splitting scenarios. Train a classification model to identify the different types of documents your application supports. The input file for the classification model can contain multiple documents and classifies each document within an associated page range. See [custom classification models](concept-custom-classifier.md) to learn more.

* **Add-on Capabilities**: Document Intelligence now supports more sophisticated analysis capabilities. These optional capabilities can be enabled and disabled in the studio using the `Analze Options` button in each model page. There are four add-on capabilities available: highResolution, formula, font, and barcode extraction capabilities. See [Add-on capabilities](concept-add-on-capabilities.md) to learn more.


## Next steps

* Follow our [**Document Intelligence v3.0 migration guide**](v3-migration-guide.md) to learn the differences from the previous version of the REST API.
* Explore our [**v3.0 SDK quickstarts**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) to try the v3.0 features in your applications using the new SDKs.
* Refer to our [**v3.0 REST API quickstarts**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) to try the v3.0features using the new REST API.

> [!div class="nextstepaction"]
> [Document Intelligence Studio  quickstart](quickstarts/try-document-intelligence-studio.md)
