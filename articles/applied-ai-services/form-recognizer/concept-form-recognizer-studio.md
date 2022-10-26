---
title: "Form Recognizer Studio"
titleSuffix: Azure Applied AI Services
description: "Concept: Form and document processing, data extraction, and analysis using Form Recognizer Studio "
author: sanjeev3
manager: netahw
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/10/2022
ms.author: sajagtap
monikerRange: 'form-recog-3.0.0'
recommendations: false
---

# Form Recognizer Studio

[Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/) is an online tool for visually exploring, understanding, and integrating features from the Form Recognizer service into your applications. Use the [Form Recognizer Studio quickstart](quickstarts/try-v3-form-recognizer-studio.md) to get started analyzing documents with pre-trained models. Build custom template models and reference the models in your applications using the [Python SDK v3.0](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) and other quickstarts.

The following image shows the Invoice prebuilt model feature at work.

:::image border="true" type="content" source="media/quickstarts/prebuilt-get-started-v2.gif" alt-text="Form Recognizer Prebuilt example":::

## Form Recognizer Studio features

The following Form Recognizer service features are available in the Studio.

* **Read**: Try out Form Recognizer's Read feature to extract text lines, words, detected languages, and handwritten style if detected. Start with the [Studio Read feature](https://formrecognizer.appliedai.azure.com/studio/read). Explore with sample documents and your documents. Use the interactive visualization and JSON output to understand how the feature works. See the [Read overview](concept-read.md) to learn more and get started with the [Python SDK quickstart for Layout](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true).

* **Layout**: Try out Form Recognizer's Layout feature to extract text, tables, selection marks, and structure information. Start with the [Studio Layout feature](https://formrecognizer.appliedai.azure.com/studio/layout). Explore with sample documents and your documents. Use the interactive visualization and JSON output to understand how the feature works. See the [Layout overview](concept-layout.md) to learn more and get started with the [Python SDK quickstart for Layout](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#layout-model).

* **General Documents**: Try out Form Recognizer's General Documents feature to extract key-value pairs and entities. Start with the [Studio General Documents feature](https://formrecognizer.appliedai.azure.com/studio/document). Explore with sample documents and your documents. Use the interactive visualization and JSON output to understand how the feature works. See the [General Documents overview](concept-general-document.md) to learn more and get started with the [Python SDK quickstart for Layout](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#general-document-model).

* **Prebuilt models**: Form Recognizer's pre-built models enable you to add intelligent document processing to your apps and flows without having to train and build your own models. As an example, start with the [Studio Invoice feature](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice). Explore with sample documents and your documents. Use the interactive visualization, extracted fields list, and JSON output to understand how the feature works. See the [Models overview](concept-model-overview.md) to learn more and get started with the [Python SDK quickstart for Prebuilt Invoice](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#prebuilt-model).

* **Custom models**: Form Recognizer's custom models enable you to extract fields and values from models trained with your data, tailored to your forms and documents. Create standalone custom models or combine two or more custom models to create a composed model to extract data from multiple form types. Start with the [Studio Custom models feature](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects).  Use the online wizard, labeling interface, training step, and visualizations to understand how the feature works. Test the custom model with your sample documents and iterate to improve the model. See the [Custom models overview](concept-custom.md) to learn more and use the [Form Recognizer v3.0 migration guide](v3-migration-guide.md) to start integrating the new models with your applications.

## Next steps

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn the differences from the previous version of the REST API.
* Explore our [**v3.0 SDK quickstarts**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) to try the v3.0 features in your applications using the new SDKs.
* Refer to our [**v3.0 REST API quickstarts**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) to try the v3.0features using the new REST API.

> [!div class="nextstepaction"]
> [Form Recognizer Studio  quickstart](quickstarts/try-v3-form-recognizer-studio.md)
