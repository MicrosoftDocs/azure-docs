---
title: What's new in Document Intelligence (formerly Form Recognizer)?
titleSuffix: Azure AI services
description: Learn the latest changes to the Document Intelligence API.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: whats-new
ms.date: 11/15/2023
ms.author: lajanuar
ms.custom:
  - references_regions
  - ignite-2023
---

<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD051 -->

# What's new in Azure AI Document Intelligence

[!INCLUDE [applies to v4.0, v3.1, v3.0, and v2.1](includes/applies-to-v40-v31-v30-v21.md)]

Document Intelligence service is updated on an ongoing basis. Bookmark this page to stay up to date with release notes, feature enhancements, and our newest documentation.

## November 2023

Document Intelligence **2023-10-31-preview**

The Document Intelligence [**2023-10-31-preview**](https://westus.dev.cognitive.microsoft.com/docs/services?pattern=intelligence) REST API is now available for use! This preview API introduces new and updated capabilities:

* [Read model](concept-contract.md)
  * Language Expansion for Handwriting: Russian(`ru`), Arabic(`ar`), Thai(`th`).
  * Cyber EO compliance.
* [Layout model](concept-layout.md)
  * Support office and html files.
  * Markdown output support.
  * Table extraction, reading order and section heading detection improvements.
  * With the Document Intelligence 2023-10-31-preview, the general document model (prebuilt-document) is deprecated. Going forward, to extract key-value pairs from documents, use the
    `prebuilt-layout` model with the optional query string parameter `features=keyValuePairs` enabled.
* [Receipt model](concept-receipt.md)
  * Now extracts currency for all price-related fields.
* [Health Insurance Card model](concept-health-insurance-card.md)
  * New field support for Medicare and Medicaid information.
* [US Tax Document models](concept-tax-document.md)
  * New 1099 tax model. Supports base 1099 form and the following variations: A, B, C, CAP, DIV, G, H, INT, K, LS, LTC, MISC, NEC, OID, PATR, Q, QA, R, S, SA, SB​.
* [Invoice model](concept-invoice.md)
  * Support for KVK field.
  * Support for BPAY field.
  * Numerous field refinements.
* [Custom Classification](concept-custom-classifier.md)
  * Support for multi-language documents.
  * New page splitting options: autosplit, always split by page, no split.
* [Add-on capabilities](concept-add-on-capabilities.md)
  * [Query fields](concept-add-on-capabilities.md#query-fields) are available with the `2023-10-31-preview` release.
  * Add-on capabilities are available within all models excluding the [Read model](concept-read.md).

>[!NOTE]
> With the 2022-08-31 API general availability (GA) release, the associated preview APIs are being deprecated. If you are using the 2021-09-30-preview, the 2022-01-30-preview or he 2022-06-30-preview API versions, please update your applications to target the 2022-08-31 API version. There are a few minor changes involved, for more information, _see_ the [migration guide](v3-1-migration-guide.md).

## July 2023

> [!NOTE]
> Form Recognizer is now **Azure AI Document Intelligence**!
>
> * Document, Azure AI services encompass all of what were previously known as Cognitive Services and Azure Applied AI Services.
> * There are no changes to pricing.
> * The names *Cognitive Services* and *Azure Applied AI* continue to be used in Azure billing, cost analysis, price list, and price APIs.
> * There are no breaking changes to application programming interfaces (APIs) or SDKs.
> * Some platforms are still awaiting the renaming update. All mention of Form Recognizer or Document Intelligence in our documentation refers to the same Azure service.

**Document Intelligence v3.1 (GA)**

The Document Intelligence version 3.1 API is now generally available (GA)! The API version corresponds to ```2023-07-31```.
The v3.1 API introduces new and updated capabilities:

* Document Intelligence APIs are now more modular, with support for optional features, you can now customize the output to specifically include the features you need. Learn more about the [optional parameters](v3-1-migration-guide.md).
* Document classification API for splitting a single file into individual documents. [Learn more](concept-custom-classifier.md) about document classification.
* [Prebuilt contract model](concept-contract.md)
* [Prebuilt US tax form 1098 model](concept-tax-document.md)
* Support for [Office file types](concept-read.md) with Read API
* [Barcode recognition](concept-read.md) in documents
* Formula recognition [add-on capability](concept-add-on-capabilities.md)
* Font recognition [add-on capability](concept-add-on-capabilities.md)
* Support for [high resolution documents](concept-add-on-capabilities.md)
* Custom neural models now require a single labeled sample to train
* Custom neural models language expansion. Train a neural model for documents in 30 languages. See [language support](language-support.md) for the complete list of supported languages
* 🆕 [Prebuilt health insurance card model](concept-health-insurance-card.md).
* [Prebuilt invoice model locale expansion](concept-invoice.md#supported-languages-and-locales).
* [Prebuilt receipt model language and locale expansion](concept-receipt.md#supported-languages-and-locales) with more than 100 languages supported.
* [Prebuilt ID model](concept-id-document.md#supported-document-types) now supports European IDs.


**Document Intelligence Studio UX Updates**

✔️ **Analyze Options**</br>

* Document Intelligence now supports more sophisticated analysis capabilities and the Studio allows one entry point (Analyze options button) for configuring the add-on capabilities with ease.
* Depending on the document extraction scenario, configure the analysis range, document page range, optional detection, and premium detection features.

    :::image type="content" source="media/studio/analyze-options.gif" alt-text="Animated screenshot showing use of the analyze options button to configure options in Studio.":::

    > [!NOTE]
    > Font extraction is not visualized in Document Intelligence Studio. However, you can check the styles section of the JSON output for the font detection results.

✔️ **Auto labeling documents with prebuilt models or one of your own models**

* In custom extraction model labeling page, you can now auto label your documents using one of Document Intelligent Service prebuilt models or models you previously trained.

    :::image type="content" source="media/studio/auto-label.gif" alt-text="Animated screenshot showing auto labeling in Studio.":::

* For some documents, there can be duplicate labels after running auto label. Make sure to modify the labels so that there are no duplicate labels in the labeling page afterwards.

    :::image type="content" source="media/studio/duplicate-labels.png" alt-text="Screenshot showing duplicate label warning after auto labeling.":::

✔️ **Auto labeling tables**

* In custom extraction model labeling page, you can now auto label the tables in the document without having to label the tables manually.

    :::image type="content" source="media/studio/auto-table-label.gif" alt-text="Animated screenshot showing auto table labeling in Studio.":::

✔️ **Add test files directly to your training dataset**

* Once you train a custom extraction model, make use of the test page to improve your model quality by uploading test documents to training dataset if needed.

* If a low confidence score is returned for some labels, make sure they're correctly labeled. If not, add them to the training dataset and relabel to improve the model quality.

:::image type="content" source="media/studio/add-from-test.gif" alt-text="Animated screenshot showing how to add test files to training dataset.":::

✔️ **Make use of the document list options and filters in custom projects**

* In custom extraction model labeling page, you can now navigate through your training documents with ease by making use of the search, filter and sort by feature.

* Utilize the grid view to preview documents or use the list view to scroll through the documents more easily.

    :::image type="content" source="media/studio/document-options.png" alt-text="Screenshot showing document list view options and filters.":::

✔️ **Project sharing**

* Share custom extraction projects with ease. For more information, see [Project sharing with custom models](how-to-guides/project-share-custom-models.md).

## **May** 2023

**Introducing refreshed documentation for Build 2023**

* [🆕 Document Intelligence Overview](overview.md?view=doc-intel-3.0.0&preserve-view=true) enhanced navigation, structured access points, and enriched images.

* [🆕 Choose a Document Intelligence model](choose-model-feature.md?view=doc-intel-3.0.0&preserve-view=true) provides guidance for choosing the best Document Intelligence solution for your projects and workflows.

## April 2023

**Announcing the latest Document Intelligence client-library public preview release**

* Document Intelligence REST API Version [2023-02-28-preview](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-02-28-preview/operations/AnalyzeDocument) supports the public preview release SDKs. This release includes the following new features and capabilities available for .NET/C# (4.1.0-beta-1), Java (4.1.0-beta-1), JavaScript (4.1.0-beta-1), and Python (3.3.0b.1) SDKs:

  * [**Custom classification model**](concept-custom-classifier.md)

  * [**Query fields extraction**](concept-query-fields.md)

  * [**Add-on capabilities**](concept-add-on-capabilities.md)

* For more information, _see_ [**Document Intelligence SDK (public preview**)](./sdk-preview.md) and [March 2023 release](#march-2023) notes.

## March 2023

> [!IMPORTANT]
> [**`2023-02-28-preview`**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-02-28-preview/operations/AnalyzeDocument) capabilities are currently only available in the following regions:
>
> * West Europe
> * West US2
> * East US

* [**Custom classification model**](concept-custom-classifier.md) is a new capability within Document Intelligence starting with the ```2023-02-28-preview``` API. Try the document classification capability using the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/document-classifier/projects) or the [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-02-28-preview/operations/GetClassifyDocumentResult).
* [**Query fields**](concept-query-fields.md) capabilities added to the General Document model, use Azure OpenAI models to extract specific fields from documents. Try the **General documents with query fields** feature using the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio). Query fields are currently only active for resources in the `East US` region.
* [**Read**](concept-read.md#barcode-extraction) and [**Layout**](concept-layout.md#data-extraction) models support **barcode** extraction with the ```2023-02-28-preview``` API.
* [**Add-on capabilities**](concept-add-on-capabilities.md)
  * [**Font extraction**](concept-add-on-capabilities.md#font-property-extraction) is now recognized with the ```2023-02-28-preview``` API.
  * [**Formula extraction**](concept-add-on-capabilities.md#formula-extraction) is now recognized with the ```2023-02-28-preview``` API.
  * [**High resolution extraction**](concept-add-on-capabilities.md#high-resolution-extraction) is now recognized with the ```2023-02-28-preview``` API.
* [**Custom extraction model updates**](concept-custom.md)
  * [**Custom neural model**](concept-custom-neural.md) now supports added languages for training and analysis. Train neural models for Dutch, French, German, Italian and Spanish.
  * [**Custom template model**](concept-custom-template.md) now has an improved signature detection capability.
* [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio) updates
  * In addition to support for all the new features like classification and query fields, the Studio now enables project sharing for custom model projects.
  * New model additions in gated preview: **Vaccination cards**, **Contracts**, **US Tax 1098**, **US Tax 1098-E**, and **US Tax 1098-T**.  To request access to gated preview models, complete and submit the [**Document Intelligence private preview request form**](https://aka.ms/form-recognizer/preview/survey).
* [**Receipt model updates**](concept-receipt.md)
  * Receipt model adds support for thermal receipts.
  * Receipt model now adds language support for 18 languages and three regional languages (English, French, Portuguese).
  * Receipt model now supports `TaxDetails` extraction.
* [**Layout model**](concept-layout.md) now improves table recognition.
* [**Read model**](concept-read.md) now adds improvement for single-digit character recognition.

---


## February 2023

* Select Document Intelligence containers for v3.0 are now available for use!
* Currently **Read v3.0** and **Layout v3.0** containers are available.

  For more information, _see_ [Install and run Document Intelligence containers](containers/install-run.md?view=doc-intel-3.0.0&preserve-view=true)

---


## January 2023

* Prebuilt receipt model -  added languages supported. The receipt model now supports these added languages and locales
  * Japanese - Japan (ja-JP)
  * French - Canada (fr-CA)
  * Dutch - Netherlands (nl-NL)
  * English - United Arab Emirates (en-AE)
  * Portuguese - Brazil (pt-BR)

* Prebuilt invoice model - added languages supported. The invoice model now supports these added languages and locales
  * English - United States (en-US), Australia (en-AU), Canada (en-CA), United Kingdom (en-UK), India (en-IN)
  * Spanish - Spain (es-ES)
  * French - France (fr-FR)
  * Italian - Italy (it-IT)
  * Portuguese - Portugal (pt-PT)
  * Dutch - Netherlands (nl-NL)

* Prebuilt invoice model - added fields recognized. The invoice model now recognizes these added fields
  * Currency code
  * Payment options
  * Total discount
  * Tax items (en-IN only)

* Prebuilt ID model - added document types supported. The ID model now supports these added document types
  * US Military ID

> [!TIP]
> All January 2023 updates are available with [REST API version **2022-08-31 (GA)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument).

* **[Prebuilt receipt model](concept-receipt.md#supported-languages-and-locales)—additional language support**:

   The **prebuilt receipt model** adds support for the following languages:

  * English - United Arab Emirates (en-AE)
  * Dutch - Netherlands (nl-NL)
  * French - Canada (fr-CA)
  * German - (de-DE)
  * Italian - (it-IT)
  * Japanese - Japan (ja-JP)
  * Portuguese - Brazil (pt-BR)

* **[Prebuilt invoice model](concept-invoice.md)—additional language support and field extractions**

  The **prebuilt invoice model** adds support for the following languages:

  * English - Australia (en-AU), Canada (en-CA), United Kingdom (en-UK), India (en-IN)
  * Portuguese - Brazil (pt-BR)

  The **prebuilt invoice model** now adds support for the following field extractions:

  * Currency code
  * Payment options
  * Total discount
  * Tax items (en-IN only)

* **[Prebuilt ID document model](concept-id-document.md#supported-document-types)—additional document types support**

  The **prebuilt ID document model** now adds support for the following document types:

  * Driver's license expansion supporting India, Canada, United Kingdom and Australia
  * US military ID cards and documents
  * India ID cards and documents (PAN and Aadhaar)
  * Australia ID cards and documents (photo card, Key-pass ID)
  * Canada ID cards and documents (identification card, Maple card)
  * United Kingdom ID cards and documents (national/regional identity card)

---


## December 2022

* [**Document Intelligence Studio updates**](https://formrecognizer.appliedai.azure.com/studio)

  The December Document Intelligence Studio release includes the latest updates to Document Intelligence Studio. There are significant improvements to user experience, primarily with custom model labeling support.

  * **Page range**. The Studio now supports analyzing specified pages from a document.

  * **Custom model labeling**:

    * **Run Layout API automatically**. You can opt to run the Layout API for all documents automatically in your blob storage during the setup process for custom model.

    * **Search**. The Studio now includes search functionality to locate words within a document. This improvement allows for easier navigation while labeling.

    * **Navigation**.  You can select labels to target labeled words within a document.

    * **Auto table labeling**. After you select the table icon within a document, you can opt to autolabel the extracted table in the labeling view.

    * **Label subtypes and second-level subtypes** The Studio now supports subtypes for table columns, table rows, and second-level subtypes for types such as dates and numbers.

* Building custom neural models is now supported in the US Gov Virginia region.

* Preview API versions ```2022-01-30-preview``` and ```2021-09-30-preview``` will be retired January 31 2023. Update to the ```2022-08-31``` API version to avoid any service disruptions.

---


## November 2022

* **Announcing the latest stable release of Azure AI Document Intelligence libraries**
  * This release includes important changes and updates for .NET, Java, JavaScript, and Python SDKs. For more information, _see_ [**Azure SDK DevBlog**](https://devblogs.microsoft.com/azure-sdk/announcing-new-stable-release-of-azure-form-recognizer-libraries/).
  * The most significant enhancements are the introduction of two new clients, the **`DocumentAnalysisClient`** and the **`DocumentModelAdministrationClient`**.

---


## October 2022

* **Document Intelligence versioned content**
  * Document Intelligence documentation is updated to present a versioned experience. Now, you can choose to view content targeting the `v3.0 GA` experience or the `v2.1 GA` experience. The v3.0 experience is the default.

    :::image type="content" source="media/versioning-and-monikers.png" alt-text="Screenshot of the Document Intelligence landing page denoting the version dropdown menu.":::

* **Document Intelligence Studio Sample Code**
  * Sample code for the [Document Intelligence Studio labeling experience](https://github.com/microsoft/Form-Recognizer-Toolkit/tree/main/SampleCode/LabelingUX) is now available on GitHub. Customers can develop and integrate Document Intelligence into their own UX or build their own new UX using the Document Intelligence Studio sample code.

* **Language expansion**
  * With the latest preview release, Document Intelligence's Read (OCR), Layout, and Custom template models support 134 new languages. These language additions include Greek, Latvian, Serbian, Thai, Ukrainian, and Vietnamese, along with several Latin and Cyrillic languages. Document Intelligence now has a total of 299 supported languages across the most recent GA and new preview versions. Refer to the [supported languages](language-support.md) page to see all supported languages.
  * Use the REST API parameter `api-version=2022-06-30-preview` when using the API or the corresponding SDK to support the new languages in your applications.

* **New Prebuilt Contract model**
  * A new prebuilt that extracts information from contracts such as parties, title, contract ID, execution date and more. the contracts model is currently in preview, request access [here](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUQTRDQUdHMTBWUDRBQ01QUVNWNlNYMVFDViQlQCN0PWcu_).

* **Region expansion for training custom neural models**
  * Training custom neural models now supported in added regions.
    > [!div class="checklist"]
    >
    > * East US
    > * East US2
    > * US Gov Arizona

---


## September 2022

>[!NOTE]
> Starting with version 4.0.0, a new set of clients has been introduced to leverage the newest features of the Document Intelligence service.

**SDK version 4.0.0 GA release includes the following updates:**

### [**C#**](#tab/csharp)

* **Version 4.0.0 GA (2022-09-08)**
* **Supports REST API v3.0 and v2.0 clients**

[**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md)

[**Migration guide**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/MigrationGuide.md)

[**ReadMe**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/README.md)

[**Samples**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md)

### [**Java**](#tab/java)

* **Version 4.0.0 GA (2022-09-08)**
* **Supports REST API v3.0 and v2.0 clients**

[**Package (Maven)**](https://oss.sonatype.org/#nexus-search;quick~azure-ai-formrecognizer)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)

[**Migration guide**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/migration-guide.md)

[**ReadMe**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/README.md)

[**Samples**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md)

### [**JavaScript**](#tab/javascript)

* **Version 4.0.0 GA (2022-09-08)**
* **Supports REST API v3.0 and v2.0 clients**

[**Package (npm)**](https://www.npmjs.com/package/@azure/ai-form-recognizer)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md)

[**Migration guide**](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0/sdk/formrecognizer/ai-form-recognizer/MIGRATION-v3_v4.md)

[**ReadMe**](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0/sdk/formrecognizer/ai-form-recognizer/README.md)

[**Samples**](https://github.com/witemple-msft/azure-sdk-for-js/blob/7e3196f7e529212a6bc329f5f06b0831bf4cc174/sdk/formrecognizer/ai-form-recognizer/samples/v4/javascript/README.md)

### [Python](#tab/python)

> [!NOTE]
> Python 3.7 or later is required to use this package.

* **Version 3.2.0 GA (2022-09-08)**
* **Supports REST API v3.0 and v2.0 clients**

[**Package (PyPi)**](https://pypi.org/project/azure-ai-formrecognizer/3.2.0/)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)

[**Migration guide**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/MIGRATION_GUIDE.md)

[**ReadMe**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/README.md)

[**Samples**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/samples/README.md)

---


* **Region expansion for training custom neural models now supported in six new regions**
    > [!div class="checklist"]
    >
    > * Australia East
    > * Central US
    > * East Asia
    > * France Central
    > * UK South
    > * West US2

  * For a complete list of regions where training is supported see [custom neural models](concept-custom-neural.md).

  * Document Intelligence SDK version `4.0.0 GA` release
    * **Document Intelligence SDKs version 4.0.0 (.NET/C#, Java, JavaScript) and version 3.2.0 (Python) are generally available and ready for use in production applications!**
    * For more information on Document Intelligence SDKs, see the [**SDK overview**](sdk-overview-v3-1.md).
    * Update your applications using your programming language's **migration guide**.

---


## August 2022

**Document Intelligence SDK beta August 2022 preview release includes the following updates:**

### [**C#**](#tab/csharp)

**Version 4.0.0-beta.5 (2022-08-09)**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md#400-beta5-2022-08-09)

[**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0-beta.5)

[**SDK reference documentation**](/dotnet/api/overview/azure/ai.formrecognizer-readme?view=azure-dotnet-preview&preserve-view=true)

### [**Java**](#tab/java)

**Version 4.0.0-beta.6 (2022-08-10)**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md#400-beta6-2022-08-10)

 [**Package (Maven)**](https://oss.sonatype.org/#nexus-search;quick~azure-ai-formrecognizer)

 [**SDK reference documentation**](/java/api/overview/azure/ai-formrecognizer-readme?view=azure-java-preview&preserve-view=true)

### [**JavaScript**](#tab/javascript)

**Version 4.0.0-beta.6 (2022-08-09)**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0-beta.6/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md)

 [**Package (npm)**](https://www.npmjs.com/package/@azure/ai-form-recognizer/v/4.0.0-beta.6)

 [**SDK reference documentation**](/javascript/api/overview/azure/ai-form-recognizer-readme?view=azure-node-preview&preserve-view=true)

### [Python](#tab/python)

> [!IMPORTANT]
> Python 3.6 is no longer supported in this release. Use Python 3.7 or later.

**Version 3.2.0b6 (2022-08-09)**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b6/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)

 [**Package (PyPi)**](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b6/)

 [**SDK reference documentation**](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b6/)

---


* Document Intelligence v3.0 generally available

  * **Document Intelligence REST API v3.0 is now generally available and ready for use in production applications!** Update your applications with [**REST API version 2022-08-31**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument).

* Document Intelligence Studio updates
  > [!div class="checklist"]
  >
  > * **Next steps**. Under each model page, the Studio now has a next steps section. Users can quickly reference sample code, troubleshooting guidelines, and pricing information.
  > * **Custom models**. The Studio now includes the ability to reorder labels in custom model projects to improve labeling efficiency.
  > * **Copy Models** Custom models can be copied across Document Intelligence services from within the Studio. The operation enables the promotion of a trained model to other environments and regions.
  > * **Delete documents**. The Studio now supports deleting documents from labeled dataset within custom projects.

* Document Intelligence service updates

  * [**prebuilt-read**](concept-read.md). Read OCR model is now also available in Document Intelligence with paragraphs and language detection as the two new features. Document Intelligence Read targets advanced document scenarios aligned with the broader document intelligence capabilities in Document Intelligence.
  * [**prebuilt-layout**](concept-layout.md). The Layout model extracts paragraphs and whether the extracted text is a paragraph, title, section heading, footnote, page header, page footer, or page number.
  * [**prebuilt-invoice**](concept-invoice.md). The TotalVAT and Line/VAT fields now resolves to the existing fields TotalTax and Line/Tax respectively.
  * [**prebuilt-idDocument**](concept-id-document.md). Data extraction support for US state ID, social security, and green cards. Support for passport visa information.
  * [**prebuilt-receipt**](concept-receipt.md). Expanded locale support for French (fr-FR), Spanish (es-ES), Portuguese (pt-PT), Italian (it-IT) and German (de-DE).
  * [**prebuilt-businessCard**](concept-business-card.md). Address parse support to extract subfields for address components like address, city, state, country/region, and zip code.

* **AI quality improvements**

  * [**prebuilt-read**](concept-read.md). Enhanced support for single characters, handwritten dates, amounts, names, other key data commonly found in receipts and invoices and improved processing of digital PDF documents.
  * [**prebuilt-layout**](concept-layout.md). Support for better detection of cropped tables, borderless tables, and improved recognition of long spanning cells.
  * [**prebuilt-document**](concept-general-document.md). Improved value and check box detection.
  * [**custom-neural**](concept-custom-neural.md). Improved accuracy for table detection and extraction.

---


## June 2022

* Document Intelligence SDK beta June 2022 preview release includes the following updates:

### [**C#**](#tab/csharp)

**Version 4.0.0-beta.4 (2022-06-08)**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0-beta.4/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md)

[**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0-beta.4)

[**SDK reference documentation**](/dotnet/api/azure.ai.formrecognizer?view=azure-dotnet-preview&preserve-view=true)

### [**Java**](#tab/java)

**Version 4.0.0-beta.5 (2022-06-07)**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0-beta.5/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)

 [**Package (Maven)**](https://search.maven.org/artifact/com.azure/azure-ai-formrecognizer/4.0.0-beta.5/jar)

 [**SDK reference documentation**](/java/api/overview/azure/ai-formrecognizer-readme?view=azure-java-preview&preserve-view=true)

### [**JavaScript**](#tab/javascript)

**Version 4.0.0-beta.4 (2022-06-07)**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0-beta.4/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md)

 [**Package (npm)**](https://www.npmjs.com/package/@azure/ai-form-recognizer/v/4.0.0-beta.4)

 [**SDK reference documentation**](/javascript/api/@azure/ai-form-recognizer/?view=azure-node-preview&preserve-view=true)

### [Python](#tab/python)

**Version 3.2.0b5 (2022-06-07**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b5/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)

 [**Package (PyPi)**](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b5/)

 [**SDK reference documentation**](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer?view=azure-python-preview&preserve-view=true)

---

* [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio) June release is the latest update to the Document Intelligence Studio. There are considerable user experience and accessibility improvements addressed in this update:

  * **Code sample for JavaScript and C#**. The Studio code tab now adds JavaScript and C# code samples in addition to the existing Python one.
  * **New document upload UI**. Studio now supports uploading a document with drag & drop into the new upload user interface.
  * **New feature for custom projects**. Custom projects now support creating storage account and blobs when configuring the project. In addition, custom project now supports uploading training files directly within the Studio and copying the existing custom model.

* Document Intelligence v3.0 **2022-06-30-preview** release presents extensive updates across the feature APIs:

  * [**Layout extends structure extraction**](concept-layout.md). Layout now includes added structure elements including sections, section headers, and paragraphs. This update enables finer grain document segmentation scenarios. For a complete list of structure elements identified, _see_ [enhanced structure](concept-layout.md#data-extraction).
  * [**Custom neural model tabular fields support**](concept-custom-neural.md). Custom document models now support tabular fields. Tabular fields by default are also multi page. To learn more about tabular fields in custom neural models, _see_ [tabular fields](concept-custom-neural.md#tabular-fields).
  * [**Custom template model tabular fields support for cross page tables**](concept-custom-template.md). Custom form models now support tabular fields across pages. To learn more about tabular fields in custom template models, _see_ [tabular fields](concept-custom-neural.md#tabular-fields).
  * [**Invoice model output now includes general document key-value pairs**](concept-invoice.md). Where invoices contain required fields beyond the fields included in the prebuilt model, the general document model supplements the output with key-value pairs. _See_ [key value pairs](concept-invoice.md#key-value-pairs).
  * [**Invoice language expansion**](concept-invoice.md). The invoice model includes expanded language support. _See_ [supported languages](concept-invoice.md#supported-languages-and-locales).
  * [**Prebuilt business card**](concept-business-card.md) now includes Japanese language support. _See_ [supported languages](concept-business-card.md#supported-languages-and-locales).
  * [**Prebuilt ID document model**](concept-id-document.md). The ID document model now extracts DateOfIssue, Height, Weight, EyeColor, HairColor, and DocumentDiscriminator from US driver's licenses. _See_ [field extraction](concept-id-document.md).
  * [**Read model now supports common Microsoft Office document types**](concept-read.md). Document types like Word (docx) and PowerPoint (ppt) are now supported with the Read API. See [Microsoft Office and HTML text extraction](concept-read.md#microsoft-office-and-html-text-extraction).

---


## February 2022

### [**C#**](#tab/csharp)

**Version 4.0.0-beta.3 (2022-02-10)**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md#400-beta3-2022-02-10)

 [**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0-beta.3)

 [**SDK reference documentation**](/dotnet/api/azure.ai.formrecognizer.documentanalysis?view=azure-dotnet-preview&preserve-view=true)

### [**Java**](#tab/java)

**Version 4.0.0-beta.4 (2022-02-10)**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md#400-beta4-2022-02-10)

 [**Package (Maven)**](https://search.maven.org/artifact/com.azure/azure-ai-formrecognizer/4.0.0-beta.4/jar)

 [**SDK reference documentation**](/java/api/overview/azure/ai-formrecognizer-readme?view=azure-java-preview&preserve-view=true)

### [**JavaScript**](#tab/javascript)

**Version 4.0.0-beta.3 (2022-02-10)**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md#400-beta3-2022-02-10)

 [**Package (npm)**](https://www.npmjs.com/package/@azure/ai-form-recognizer/v/4.0.0-beta.3)

 [**SDK reference documentation**](/javascript/api/@azure/ai-form-recognizer/?view=azure-node-preview&preserve-view=true)

### [Python](#tab/python)

**Version 3.2.0b3 (2022-02-10)**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b3/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md#320b3-2022-02-10)

 [**Package (PyPI)**](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b3/)

 [**SDK reference documentation**](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer?view=azure-python-preview&preserve-view=true)

---

* Document Intelligence v3.0 preview release introduces several new features, capabilities and enhancements:

  * [**Custom neural model**](concept-custom-neural.md) or custom document model is a new custom model to extract text and selection marks from structured forms, semi-structured and **unstructured documents**.
  * [**W-2 prebuilt model**](concept-w2.md) is a new prebuilt model to extract fields from W-2 forms for tax reporting and income verification scenarios.
  * [**Read**](concept-read.md) API extracts printed text lines, words, text locations, detected languages, and handwritten text, if detected.
  * [**General document**](concept-general-document.md) pretrained model is now updated to support selection marks in addition to API  text, tables, structure, and key-value pairs from forms and documents.
  * [**Invoice API**](concept-invoice.md#supported-languages-and-locales) Invoice prebuilt model expands support to Spanish invoices.
  * [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com) adds new demos for Read, W2, Hotel receipt samples, and support for training the new custom neural models.
  * [**Language Expansion**](language-support.md) Document Intelligence Read, Layout, and Custom Form add support for 42 new languages including Arabic, Hindi, and other languages using Arabic and Devanagari scripts to expand the coverage to 164 languages. Handwritten language support expands to Japanese and Korean.

* Get started with the new [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument), [Python](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), or [.NET](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) SDK for the v3.0 preview API.

* Document Intelligence model data extraction

  | **Model**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables** |**Signatures**|
  | --- | :---: |:---:| :---: | :---: |:---: |
  |Read | ✓  |   |   |   |   |
  |General document  | ✓  |  ✓ | ✓  | ✓  |   |
  | Layout  | ✓  |   | ✓  | ✓  |   |
  | Invoice  | ✓ | ✓  | ✓  | ✓ ||
  |Receipt  | ✓  |   ✓ |   |  |✓|
  | ID document | ✓  |   ✓  |   |   ||
  | Business card    | ✓  |   ✓ |   |   ||
  | Custom template  |✓  |  ✓ | ✓  | ✓  |  ✓ |
  | Custom neural    |✓  |  ✓ | ✓  | ✓  |   |

* Document Intelligence SDK beta preview release includes the following updates:

  * [Custom Document models and modes](concept-custom.md):
    * [Custom template](concept-custom-template.md) (formerly custom form)
    * [Custom neural](concept-custom-neural.md).
    * [Custom model—build mode](concept-custom.md#build-mode).

  * [W-2 prebuilt model](concept-w2.md) (prebuilt-tax.us.w2).
  * [Read prebuilt model](concept-read.md) (prebuilt-read).
  * [Invoice prebuilt model (Spanish)](concept-invoice.md#supported-languages-and-locales) (prebuilt-invoice).

---


## November 2021

### [**C#**](#tab/csharp)

**Version 4.0.0-beta.2 (2021-11-09)**

| [**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0-beta.2) | [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md) | [**API reference documentation**](/dotnet/api/azure.ai.formrecognizer?view=azure-dotnet-preview&preserve-view=true)

### [**Java**](#tab/java)

 | [**Package (Maven)**](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer/4.0.0-beta.2) | [**Changelog/Release History**](https://oss.sonatype.org/service/local/repositories/releases/content/com/azure/azure-ai-formrecognizer/4.0.0-beta.2/azure-ai-formrecognizer-4.0.0-beta.2-changelog.md) | [**API reference documentation**](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-ai-formrecognizer/4.0.0-beta.2/index.html)

### [**JavaScript**](#tab/javascript)

| [**Package (NPM)**](https://www.npmjs.com/package/@azure/ai-form-recognizer/v/4.0.0-beta.2) | [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md) | [**API reference documentation**](/javascript/api/overview/azure/ai-form-recognizer-readme?view=azure-node-preview&preserve-view=true) |

### [**Python**](#tab/python)

| [**Package (PyPI)**](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b2/) | [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b2/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md) | [**API reference documentation**](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-formrecognizer/latest/azure.ai.formrecognizer.html)

---


* **Document Intelligence v3.0 preview SDK release update (beta.2) incorporates bug fixes and minor feature updates.**

---


## October 2021

* **Document Intelligence v3.0 preview release version 4.0.0-beta.1 (2021-10-07)introduces several new features and capabilities:**

  * [**General document**](concept-general-document.md) model is a new API that uses a pretrained model to extract text, tables, structure, and key-value pairs from forms and documents.
  * [**Hotel receipt**](concept-receipt.md) model added to prebuilt receipt processing.
  * [**Expanded fields for ID document**](concept-id-document.md) the ID model supports endorsements, restrictions, and vehicle classification extraction from US driver's licenses.
  * [**Signature field**](concept-custom.md) is a new field type in custom forms to detect the presence of a signature in a form field.
  * [**Language Expansion**](language-support.md) Support for 122 languages (print) and 7 languages (handwritten). Document Intelligence Layout and Custom Form expand [supported languages](language-support.md) to 122 with its latest preview. The preview includes text extraction for print text in 49 new languages including Russian, Bulgarian, and other Cyrillic and more Latin languages. In addition, extraction of handwritten text now supports seven languages that include English, and new previews of Chinese Simplified, French, German, Italian, Portuguese, and Spanish.
  * **Tables and text extraction enhancements** Layout now supports extracting single row tables also called key-value tables. Text extraction enhancements include better processing of digital PDFs and Machine Readable Zone (MRZ) text in identity documents, along with general performance.
  * [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com) To simplify use of the service, you can now access the Document Intelligence Studio to test the different prebuilt models or label and train a custom model

  * Get started with the new [REST API](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm), [Python](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), or [.NET](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) SDK for the v3.0 preview API.

* Document Intelligence model data extraction

  | **Model**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   |
  | --- | :---: |:---:| :---: | :---: |
  |General document  | ✓  |  ✓ | ✓  | ✓  |
  | Layout  | ✓  |   | ✓  | ✓  |
  | Invoice  | ✓ | ✓  | ✓  | ✓ |
  |Receipt  | ✓  |   ✓ |   |  |
  | ID document | ✓  |   ✓  |   |   |
  | Business card    | ✓  |   ✓ |   |   |
  | Custom             |✓  |  ✓ | ✓  | ✓  |

---


## September 2021

* [Azure metrics explorer advanced features](../../azure-monitor/essentials/metrics-charts.md) are available on your Document Intelligence resource overview page in the Azure portal.

* Monitoring menu

  :::image type="content" source="media/portal-metrics.png" alt-text="Screenshot showing the monitoring menu in the Azure portal":::

* Charts

  :::image type="content" source="media/portal-metrics-charts.png" alt-text="Screenshot showing an example metric chart in the Azure portal.":::

* **ID document** model update: given names including a suffix, with or without a period (full stop), process successfully:

    |Input Text | Result with update |
    |------------|-------------------------------------------|
    | William Isaac Kirby Jr. |**FirstName**: William Isaac</br></br>**LastName**: Kirby Jr. |
    | Henry Caleb Ross Sr | **FirstName**: Henry Caleb </br></br> **LastName**: Ross Sr |

---


## July 2021

* System-assigned managed identity support: You can now enable a system-assigned managed identity to grant Document Intelligence limited access to private storage accounts including accounts protected by a Virtual Network, firewall, or bring-your-own-storage (BYOS) enabled. _See_ [Create and use managed identity for your Document Intelligence resource](managed-identities.md) to learn more.

---


## June 2021

### [**C#**](#tab/csharp)

| [Reference documentation](/dotnet/api/azure.ai.formrecognizer?view=azure-dotnet&preserve-view=true) | [NuGet package version 3.1.1](https://www.nuget.org/packages/Azure.AI.FormRecognizer) |

### [**Java**](#tab/java)

 | [Reference documentation](/java/api/com.azure.ai.formrecognizer.models?view=azure-java-stable&preserve-view=true)| [Maven artifact package dependency version 3.1.1](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer/3.1.1) |

### [**JavaScript**](#tab/javascript)

> [!NOTE]
> There are no updates to JavaScript SDK v3.1.0.

| [Reference documentation](/javascript/api/@azure/cognitiveservices-formrecognizer/formrecognizerclient?view=azure-node-latest&preserve-view=true)| [npm package dependency form-recognizer 3.1.0](https://www.npmjs.com/package/@azure/ai-form-recognizer) |

### [**Python**](#tab/python)

| [Reference documentation](/java/api/com.azure.ai.formrecognizer.models?view=azure-java-stable&preserve-view=true)| [PyPi azure-ai-formrecognizer 3.1.1](https://pypi.org/project/azure-ai-formrecognizer/) |

---


* Document Intelligence containers v2.1 released in gated preview and are now supported by six feature containers—**Layout**, **Business Card**,**ID Document**,  **Receipt**, **Invoice**, and **Custom**. To use them, you must submit an [online request](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUNlpBU1lFSjJUMFhKNzVHUUVLN1NIOEZETiQlQCN0PWcu), and receive approval.

  * *See* [**Install and run Docker containers for Document Intelligence**](containers/install-run.md?branch=main&tabs=layout) and [**Configure Document Intelligence containers**](containers/configuration.md?branch=main)

* Document Intelligence connector released in preview: The [**Document Intelligence connector**](/connectors/formrecognizer) integrates with  [Azure Logic Apps](../../logic-apps/logic-apps-overview.md),  [Microsoft Power Automate](/power-automate/getting-started), and [Microsoft Power Apps](/powerapps/powerapps-overview). The connector supports workflow actions and triggers to extract and analyze document data and structure from custom and prebuilt forms, invoices, receipts, business cards and ID documents.

* Document Intelligence SDK v3.1.0 patched to v3.1.1 for C#, Java, and Python. The patch addresses invoices that don't have subline item fields detected such as a  `FormField` with `Text` but no `BoundingBox` or `Page` information.

---

## **May** 2021

### [**C#**](#tab/csharp)

* **Version 3.1.0 (2021-05-26)**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md#310-2021-05-26)| [Reference documentation](/dotnet/api/azure.ai.formrecognizer?view=azure-dotnet&preserve-view=true) | [NuGet package version 3.0.1](https://www.nuget.org/packages/Azure.AI.FormRecognizer) |

### [**Java**](#tab/java)

* **Version 3.1.0 (2021-05-26)**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md#310-2021-05-26) | [Reference documentation](/java/api/com.azure.ai.formrecognizer.models?view=azure-java-stable&preserve-view=true)| [Maven artifact package dependency version 3.1.0](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer) |

### [**JavaScript**](#tab/javascript)

* **Version 3.1.0 (2021-05-26)**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/@azure/ai-form-recognizer_4.0.0/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md#310-2021-05-26)| [Reference documentation](/javascript/api/@azure/cognitiveservices-formrecognizer/formrecognizerclient?view=azure-node-latest&preserve-view=true)| [npm package dependency form-recognizer 3.1.0](https://www.npmjs.com/package/@azure/ai-form-recognizer)  |

### [**Python**](#tab/python)

* **Version 3.1.0 (2021-05-26)**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md#310-2021-05-26)| [Reference documentation](/java/api/com.azure.ai.formrecognizer.models?view=azure-java-stable&preserve-view=true)| [PyPi azure-ai-formrecognizer 3.1.0](https://pypi.org/project/azure-ai-formrecognizer/) |

---


* Document Intelligence 2.1 is generally available. The GA release marks the stability of the changes introduced in prior 2.1 preview package versions. This release enables you to detect and extract information and data from the following document types:
  > [!div class="checklist"]
  >
  > * [Documents](concept-layout.md)
  > * [Receipts](./concept-receipt.md)
  > * [Business cards](./concept-business-card.md)
  > * [Invoices](./concept-invoice.md)
  > * [Identity documents](./concept-id-document.md)
  > * [Custom forms](concept-custom.md)

* To get started, try the [Document Intelligence Sample Tool](https://fott-2-1.azurewebsites.net/) and follow the [quickstart](./quickstarts/try-sample-label-tool.md).

* The updated Layout API table feature adds header recognition with column headers that can span multiple rows. Each table cell has an attribute that indicates whether it's part of a header or not. This update can be used to identify which rows make up the table header.

---


## April 2021
<!-- markdownlint-disable MD029 -->

### [**C#**](#tab/csharp)

* ***NuGet package version 3.1.0-beta.4**

* [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md#310-beta4-2021-04-06)

* **New methods to analyze data from identity documents**:

   **StartRecognizeIdDocumentsFromUriAsync**

   **StartRecognizeIdDocumentsAsync**

   For a list of field values, _see_ [Fields extracted](./concept-id-document.md) in our Document Intelligence documentation.

* Expanded the set of document languages that can be provided to the **[StartRecognizeContent](/dotnet/api/azure.ai.formrecognizer.formrecognizerclient.startrecognizecontent?view=azure-dotnet-preview&preserve-view=true)** method.

* **New property `Pages`  supported by the following classes**:

   **[RecognizeBusinessCardsOptions](/dotnet/api/azure.ai.formrecognizer.recognizebusinesscardsoptions?view=azure-dotnet-preview&preserve-view=true)**</br>
   **[RecognizeCustomFormsOptions](/dotnet/api/azure.ai.formrecognizer.recognizecustomformsoptions?view=azure-dotnet-preview&preserve-view=true)**</br>
   **[RecognizeInvoicesOptions](/dotnet/api/azure.ai.formrecognizer.recognizeinvoicesoptions?view=azure-dotnet-preview&preserve-view=true)**</br>
   **[RecognizeReceiptsOptions](/dotnet/api/azure.ai.formrecognizer.recognizereceiptsoptions?view=azure-dotnet-preview&preserve-view=true)**</br>

   The `Pages` property allows you to select individual or a range of pages for multi-page PDF and TIFF documents. For individual pages, enter the page number, for example, `3`. For a range of pages (like page 2 and pages 5-7) enter the p    age numbers and ranges separated by commas: `2, 5-7`.

* **New property `ReadingOrder` supported for the following class**:

   **[RecognizeContentOptions](/dotnet/api/azure.ai.formrecognizer.recognizecontentoptions?view=azure-dotnet-preview&preserve-view=true)**

  The `ReadingOrder` property is an optional parameter that allows you to specify which reading order algorithm—`basic` or `natural`—should be applied to order the extraction of text elements. If not specified, the default value is `basic`.

### [**Java**](#tab/java)

**Maven artifact package dependency version 3.1.0-beta.3**

* **New methods to analyze data from identity documents**:

  **[beginRecognizeIdDocumentsFromUrl]**

  **[beginRecognizeIdDocuments]**

   For a list of field values, _see_ [Fields extracted](./concept-id-document.md) in our Document Intelligence documentation.

* ** **Bitmap Image file (.bmp) support for custom forms and training methods in the [`FormContentType`](/java/api/com.azure.ai.formrecognizer.models.formcontenttype?view=azure-java-preview&preserve-view=true#fields) fields**:

  * `image/bmp`

  * **New property `Pages`  supported by the following classes**:

   **[RecognizeBusinessCardsOptions](/java/api/com.azure.ai.formrecognizer.models.recognizebusinesscardsoptions?view=azure-java-preview&preserve-view=true)**</br>
   **[RecognizeCustomFormOptions](/java/api/com.azure.ai.formrecognizer.models.recognizecustomformsoptions?view=azure-java-preview&preserve-view=true)**</br>
   **[RecognizeInvoicesOptions](/java/api/com.azure.ai.formrecognizer.models.recognizeinvoicesoptions?view=azure-java-preview&preserve-view=true)**</br>
   **[RecognizeReceiptsOptions](/java/api/com.azure.ai.formrecognizer.models.recognizereceiptsoptions?view=azure-java-preview&preserve-view=true)**</br>

  * The `Pages` property allows you to select individual or a range of pages for multi-page PDF and TIFF documents. For individual pages, enter the page number, for example, `3`. For a range of pages (like page 2 and pages 5-7) enter the page numbers and ranges separated by commas: `2, 5-7`.

* **New keyword argument `ReadingOrder` supported for the following methods**:

  * **[beginRecognizeContent](/java/api/com.azure.ai.formrecognizer.formrecognizerclient.beginrecognizecontent?preserve-view=true&view=azure-java-preview)**</br>
  * **[beginRecognizeContentFromUrl](/java/api/com.azure.ai.formrecognizer.formrecognizerclient.beginrecognizecontentfromurl?view=azure-java-preview&preserve-view=true)**</br>
  * The `ReadingOrder` keyword argument is an optional parameter that allows you to specify which reading order algorithm—`basic` or `natural`—should be applied to order the extraction of text elements. If not specified, the default value is `basic`.

* The client defaults to the latest supported service version, which currently is **2.1-preview.3**.

### [**JavaScript**](#tab/javascript)

**npm package version 3.1.0-beta.3**

* **New methods to analyze data from identity documents**:

    **azure-ai-form-recognizer-formrecognizerclient-beginrecognizeidentitydocumentsfromurl**

    **beginRecognizeIdDocuments**

    For a list of field values, _see_ [Fields extracted](./concept-id-document.md) in our Document Intelligence documentation.

* **New field values added to the FieldValue interface**:

    `gender`—possible values are `M` `F` or `X`.</br>
   `country`—possible values follow [ISO alpha-3](https://www.iso.org/obp/ui/#search) three-letter country code string.

* New option `pages` supported by all document intelligence methods (custom forms and all prebuilt models). The argument allows you to select individual or a range of pages for multi-page PDF and TIFF documents. For individual pages, enter the page number, for example, `3`. For a range of pages (like page 2 and pages 5-7) enter the page numbers and ranges separated by commas: `2, 5-7`.

* Added support for a [ReadingOrder](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md#310-2021-05-26) type to the content recognition methods. This option enables you to control the algorithm that the service uses to determine how recognized lines of text should be ordered. You can specify which reading order algorithm—`basic` or `natural`—should be applied to order the extraction of text elements. If not specified, the default value is `basic`.

* Split **FormField** type into several different interfaces. This update shouldn't cause any API compatibility issues except in certain edge cases (undefined valueType).

* Migrated to the **`2.1-preview.3`** Document Intelligence service endpoint for all REST API calls.

### [**Python**](#tab/python)

**pip package version 3.1.0b4**

* **New methods to analyze data from identity documents**:

  **[begin_recognize_id_documents_from_url](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python&preserve-view=true)**

  **[begin_recognize_id_documents](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python&preserve-view=true)**

  For a list of field values, _see_ [Fields extracted](./concept-id-document.md) in our Document Intelligence documentation.

* **New field values added to the [FieldValueType](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.fieldvaluetype?view=azure-python-preview&preserve-view=true) enum**:

   gender—possible values are `M` `F` or `X`.

  country—possible values follow [ISO alpha-3 Country Codes](https://www.iso.org/obp/ui/#search).

* **Bitmap Image file (.bmp) support for custom forms and training methods in the [FormContentType](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formcontenttype?view=azure-python-preview&preserve-view=true) enum**:

    image/bmp

* **New keyword argument `pages`  supported by the following methods**:

    **[begin_recognize_receipts](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python-preview&preserve-view=true&branch=main#azure-ai-formrecognizer-formrecognizerclient-begin-recognize-receipts)**

    **[begin_recognize_receipts_from_url](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python-preview&preserve-view=true#azure-ai-formrecognizer-formrecognizerclient-begin-recognize-receipts-from-url)**

   **[begin_recognize_business_cards](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python-preview&preserve-view=true#azure-ai-formrecognizer-formrecognizerclient-begin-recognize-business-cards)**

   **[begin_recognize_business_cards_from_url](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python-preview&preserve-view=true#azure-ai-formrecognizer-formrecognizerclient-begin-recognize-business-cards-from-url)**

   **[begin_recognize_invoices](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python-preview&preserve-view=true#azure-ai-formrecognizer-formrecognizerclient-begin-recognize-invoices)**

   **[begin_recognize_invoices_from_url](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python-preview&preserve-view=true#azure-ai-formrecognizer-formrecognizerclient-begin-recognize-invoices-from-url)**

   **[begin_recognize_content](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python-preview&preserve-view=true#azure-ai-formrecognizer-formrecognizerclient-begin-recognize-content)**

  **[begin_recognize_content_from_url](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python-preview&preserve-view=true#azure-ai-formrecognizer-formrecognizerclient-begin-recognize-content-from-url-)**

   The `pages` keyword argument allows you to select individual or a range of pages for multi-page PDF and TIFF documents. For individual pages, enter the page number, for example, `3`. For a range of pages (like page 2 and pages 5-7) enter the page numbers and ranges separated by commas: `2, 5-7`.

* **New keyword argument `readingOrder` supported for the following methods**:

   **[begin_recognize_content](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python-preview&preserve-view=true#azure-ai-formrecognizer-formrecognizerclient-begin-recognize-content)**

   **[begin_recognize_content_from_url](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python-preview&preserve-view=true#azure-ai-formrecognizer-formrecognizerclient-begin-recognize-content-from-url)**

   The `readingOrder` keyword argument is an optional parameter that allows you to specify which reading order algorithm—`basic` or `natural`—should be applied to order the extraction of text elements. If not specified, the default value is `basic`.

---


* **SDK preview updates for API version `2.1-preview.3` introduces feature updates and enhancements.**

---


## March 2021

 **Document Intelligence v2.1 public preview v2.1-preview.3 has been released and includes the following features:**

* **New prebuilt ID model** The new prebuilt ID model enables customers to take IDs and return structured data to automate processing. It combines our powerful Optical Character Recognition (OCR) capabilities with ID understanding models to extract key information from passports and U.S. driver licenses.

  [Learn more about the prebuilt ID model](./concept-id-document.md)

   :::image type="content" source="./media/id-canada-passport-example.png" alt-text="Screenshot of a sample passport." lightbox="./media/id-canada-passport-example.png":::

* **Line-item extraction for invoice model** - Prebuilt Invoice model now supports line item extraction; it now extracts full items and their parts - description, amount, quantity, product ID, date and more. With a simple API/SDK call, you can extract useful data from your invoices - text, table, key-value pairs, and line items.

   [Learn more about the invoice model](./concept-invoice.md)

* **Supervised table labeling and training, empty-value labeling** - In addition to Document Intelligence's [state-of-the-art deep learning automatic table extraction capabilities](https://techcommunity.microsoft.com/t5/azure-ai/enhanced-table-extraction-from-documents-with-form-recognizer/ba-p/2058011), it now enables customers to label and train on tables. This new release includes the ability to label and train on line items/tables (dynamic and fixed) and train a custom model to extract key-value pairs and line items. Once a model is trained, the model extracts line items as part of the JSON output in the documentResults section.

    :::image type="content" source="./media/table-labeling.png" alt-text="Screenshot of the table labeling feature." lightbox="./media/table-labeling.png":::

    In addition to labeling tables, you can now label empty values and regions. If some documents in your training set don't have values for certain fields, you can label them so that your model knows to extract values properly from analyzed documents.

* **Support for 66 new languages** - The Layout API and Custom Models for Document Intelligence now support 73 languages.

  [Learn more about Document Intelligence's language support](language-support.md)

* **Natural reading order, handwriting classification, and page selection** - With this update, you can choose to get the text line outputs in the natural reading order instead of the default left-to-right and top-to-bottom ordering. Use the new readingOrder query parameter and set it to "natural" value for a more human-friendly reading order output. In addition, for Latin languages, Document Intelligence classifies text lines as handwritten style or not and give a confidence score.

* **Prebuilt receipt model quality improvements** This update includes many quality improvements for the prebuilt Receipt model, especially around line item extraction.

---


## November 2020

* **Document Intelligence v2.1-preview.2 has been released and includes the following features:**

  * **New prebuilt invoice model** - The new prebuilt Invoice model enables customers to take invoices in various formats and return structured data to automate the invoice processing. It combines our powerful Optical Character Recognition (OCR) capabilities with invoice understanding deep learning models to extract key information from invoices in English. It extracts key text, tables, and information such as customer, vendor, invoice ID, invoice due date, total, amount due, tax amount, ship to, and bill to.

    > [Learn more about the prebuilt invoice model](./concept-invoice.md)

    :::image type="content" source="./media/invoice-example.jpg" alt-text="Screenshot of a sample invoice." lightbox="./media/invoice-example.jpg":::

  * **Enhanced table extraction** - Document Intelligence now provides enhanced table extraction, which combines our powerful Optical Character Recognition (OCR) capabilities with a deep learning table extraction model. Document Intelligence can extract data from tables, including complex tables with merged columns, rows, no borders and more.

    :::image type="content" source="./media/tables-example.jpg" alt-text="Screenshot of tables analysis." lightbox="./media/tables-example.jpg":::

    > [Learn more about Layout extraction](concept-layout.md)

  * **Client library update** - The latest versions of the [client libraries](~/articles/ai-services/document-intelligence/how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) for .NET, Python, Java, and JavaScript support the Document Intelligence 2.1 API.
  * **New language supported: Japanese** - The following new languages are now supported: for `AnalyzeLayout` and `AnalyzeCustomForm`: Japanese (`ja`). [Language support](language-support.md)
  * **Text line style indication (handwritten/other) (Latin languages only)** - Document Intelligence now outputs an `appearance` object classifying whether each text line is handwritten style or not, along with a confidence score. This feature is supported only for Latin languages.
  * **Quality improvements** - Extraction improvements including single digit extraction improvements.
  * **New try-it-out feature in the Document Intelligence Sample and Labeling Tool** - Ability to try out prebuilt Invoice, Receipt, and Business Card models and the Layout API using the Document Intelligence Sample Labeling tool. See how your data is extracted without writing any code.

  * [**Try the Document Intelligence Sample Labeling tool**](https://fott-2-1.azurewebsites.net)

    :::image type="content" source="media/ui-preview.jpg" alt-text="Screenshot of the Sample Labeling tool homepage.":::

    * **Feedback Loop** - When Analyzing files via the Sample Labeling tool you can now also add it to the training set and adjust the labels if necessary and train to improve the model.
    * **Auto Label Documents** - Automatically labels added documents based on previous labeled documents in the project.

---


## August 2020

* **Document Intelligence `v2.1-preview.1` includes the following features:

  * **REST API reference is available** - View the [`v2.1-preview.1 reference`](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)
  * **New languages supported In addition to English**, the following [languages](language-support.md) are now supported: for `Layout` and `Train Custom Model`: English (`en`), Chinese (Simplified) (`zh-Hans`), Dutch (`nl`), French (`fr`), German (`de`), Italian (`it`), Portuguese (`pt`) and Spanish (`es`).
  * **Checkbox / Selection Mark detection** – Document Intelligence supports detection and extraction of selection marks such as check boxes and radio buttons. Selection Marks are extracted in `Layout` and you can now also label and train in `Train Custom Model` - _Train with Labels_ to extract key-value pairs for selection marks.
  * **Model Compose** - allows multiple models to be composed and called with a single model ID. When you submit a document to be analyzed with a composed model ID, a classification step is first performed to route it to the correct custom model. Model Compose is available for `Train Custom Model` - _Train with labels_.
  * **Model name** - add a friendly name to your custom models for easier management and tracking.
  * **[New prebuilt model for Business Cards](./concept-business-card.md)** for extracting common fields in English, language business cards.
  * **[New locales for prebuilt Receipts](./concept-receipt.md)** in addition to EN-US, support is now available for EN-AU, EN-CA, EN-GB, EN-IN
  * **Quality improvements** for `Layout`, `Train Custom Model` - _Train without Labels_ and _Train with Labels_.

* **v2.0** includes the following update:

  * The [client libraries](~/articles/ai-services/document-intelligence/how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) for NET, Python, Java, and JavaScript are Generally Available.

  **New samples** are available on GitHub.

  * The [Knowledge Extraction Recipes - Forms Playbook](https://github.com/microsoft/knowledge-extraction-recipes-forms) collects best practices from real Document Intelligence customer engagements and provides usable code samples, checklists, and sample pipelines used in developing these projects.
  * The [Sample Labeling tool](https://github.com/microsoft/OCR-Form-Tools) is updated to support the new v2.1 functionality. See this [quickstart](label-tool.md) for getting started with the tool.
  * The [Intelligent Kiosk](https://github.com/microsoft/Cognitive-Samples-IntelligentKiosk/blob/master/Documentation/FormRecognizer.md) Document Intelligence sample shows how to integrate `Analyze Receipt` and `Train Custom Model` - _Train without Labels_.

---


## July 2020

<!-- markdownlint-disable MD004 -->
* **Document Intelligence v2.0 reference available** - View the [v2.0 API Reference](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeWithCustomForm) and the updated SDKs for [.NET](/dotnet/api/overview/azure/ai.formrecognizer-readme), [Python](/python/api/overview/azure/), [Java](/java/api/overview/azure/ai-formrecognizer-readme), and [JavaScript](/javascript/api/overview/azure/).
  * **Table enhancements and Extraction enhancements** - includes accuracy improvements and table extractions enhancements, specifically, the capability to learn tables headers and structures in _custom train without labels_.

  * **Currency support** - Detection and extraction of global currency symbols.
  * **Azure Gov** - Document Intelligence is now also available in Azure Gov.
  * **Enhanced security features**:
    * **Bring your own key** - Document Intelligence automatically encrypts your data when persisted to the cloud to protect it and to help you to meet your organizational security and compliance commitments. By default, your subscription uses Microsoft-managed encryption keys. You can now also manage your subscription with your own encryption keys. [Customer-managed keys, also known as bring your own key (BYOK)](./encrypt-data-at-rest.md), offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.
    * **Private endpoints** – Enables you on a virtual network to [securely access data over a Private Link.](../../private-link/private-link-overview.md)

---

## June 2020

* **CopyModel API added to client SDKs** - You can now use the client SDKs to copy models from one subscription to another. See [Back up and recover models](./disaster-recovery.md) for general information on this feature.
* **Azure Active Directory integration** - You can now use your Azure AD credentials to authenticate your Document Intelligence client objects in the SDKs.
* **SDK-specific changes** - This change includes both minor feature additions and breaking changes. For more information, _see_ the SDK changelogs.
  * [C# SDK Preview 3 changelog](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md)
  * [Python SDK Preview 3 changelog](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)
  * [Java SDK Preview 3 changelog](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)
  * [JavaScript SDK Preview 3 changelog](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_1.0.0-preview.3/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md)

---


## April 2020

* **SDK support for Document Intelligence API v2.0 Public Preview** - This month we expanded our service support to include a preview SDK for Document Intelligence v2.0  release. Use these links to get started with your language of choice:
* [.NET SDK](/dotnet/api/overview/azure/ai.formrecognizer-readme)
* [Java SDK](/java/api/overview/azure/ai-formrecognizer-readme)
* [Python SDK](/python/api/overview/azure/ai-formrecognizer-readme)
* [JavaScript SDK](/javascript/api/overview/azure/ai-form-recognizer-readme)

The new SDK supports all the features of the v2.0 REST API for Document Intelligence. You can share your feedback on the SDKs through the [SDK Feedback form](https://aka.ms/FR_SDK_v1_feedback).

* **Copy Custom Model** You can now copy models between regions and subscriptions using the new Copy Custom Model feature. Before invoking the Copy Custom Model API, you must first obtain authorization to copy into the target resource. This authorization is secured by calling the Copy Authorization operation against the target resource endpoint.

* [Generate a copy authorization](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/CopyCustomFormModelAuthorization) REST API
* [Copy a custom model](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/CopyCustomFormModel) REST API

* Security improvements

* Customer-Managed Keys are now available for FormRecognizer. For more information, see [Data encryption at rest for Document Intelligence](./encrypt-data-at-rest.md).
* Use Managed Identities for access to Azure resources with Azure Active Directory. For more information, see [Authorize access to managed identities](../../ai-services/authentication.md#authorize-access-to-managed-identities).

---


## March 2020

* **Value types for labeling** You can now specify the types of values you're labeling with the Document Intelligence Sample Labeling tool. The following value types and variations are currently supported:
* `string`
  * default, `no-whitespaces`, `alphanumeric`
* `number`
  * default, `currency`
* `date`
  * default, `dmy`, `mdy`, `ymd`
* `time`
* `integer`

See the [Sample Labeling tool](label-tool.md#specify-tag-value-types) guide to learn how to use this feature.

* **Table visualization** The Sample Labeling tool now displays tables that were recognized in the document. This feature lets you view recognized and extracted tables from the document prior to labeling and analyzing. This feature can be toggled on/off using the layers option.

* The following image is an example of how tables are recognized and extracted:

    :::image type="content" source="media/whats-new/table-viz.png" alt-text="Screenshot of table visualization using the Sample Labeling tool.":::

* The extracted tables are available in the JSON output under `"pageResults"`.

  > [!IMPORTANT]
  > Labeling tables isn't supported. If tables are not recognized and extracted automatically, you can only label them as key/value pairs. When labeling tables as key/value pairs, label each cell as a unique value.

* Extraction enhancements

* This release includes extraction enhancements and accuracy improvements, specifically, the capability to label and extract multiple key/value pairs in the same line of text.

* Sample Labeling tool is now open-source

* The Document Intelligence Sample Labeling tool is now available as an open-source project. You can integrate it within your solutions and make customer-specific changes to meet your needs.

* For more information about the Document Intelligence Sample Labeling tool, review the documentation available on [GitHub](https://github.com/microsoft/OCR-Form-Tools/blob/master/README.md).

* TLS 1.2 enforcement

* TLS 1.2 is now enforced for all HTTP requests to this service. For more information, see [Azure AI services security](../../ai-services/security-features.md).

---

## January 2020

This release introduces the Document Intelligence 2.0. In the next sections, you'll find more information about new features, enhancements, and changes.

* New features

  * **Custom model**
    * **Train with labels** You can now train a custom model with manually labeled data. This method results in better-performing models and can produce models that work with complex forms or forms containing values without keys.
    * **Asynchronous API** You can use async API calls to train with and analyze large data sets and files.
    * **TIFF file support** You can now train with and extract data from TIFF documents.
    * **Extraction accuracy improvements**

  * **Prebuilt receipt model**
    * **Tip amounts** You can now extract tip amounts and other handwritten values.
    * **Line item extraction** You can extract line item values from receipts.
    * **Confidence values** You can view the model's confidence for each extracted value.
    * **Extraction accuracy improvements**

  * **Layout extraction** You can now use the Layout API to extract text data and table data from your forms.

* Custom model API changes

  All of the APIs for training and using custom models are renamed, and some synchronous methods are now asynchronous. The following are major changes:

  * The process of training a model is now asynchronous. You initiate training through the **/custom/models** API call. This call returns an operation ID, which you can pass into **custom/models/{modelID}** to return the training results.
  * Key/value extraction is now initiated by the **/custom/models/{modelID}/analyze** API call. This call returns an operation ID, which you can pass into **custom/models/{modelID}/analyzeResults/{resultID}** to return the extraction results.
  * Operation IDs for the Train operation are now found in the **Location** header of HTTP responses, not the **Operation-Location** header.

* Receipt API changes

  * The APIs for reading sales receipts are renamed.

  * Receipt data extraction is now initiated by the **/prebuilt/receipt/analyze** API call. This call returns an operation ID, which you can pass into **/prebuilt/receipt/analyzeResults/{resultID}** to return the extraction results.

* Output format changes

  * The JSON responses for all API calls have new formats. Some keys and values are added, removed, or renamed. See the quickstarts for examples of the current JSON formats.

---


## Next steps

::: moniker range=">=doc-intel-3.0.0"

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end

::: moniker range="doc-intel-2.1.0"

* Try processing your own forms and documents with the [Document Intelligence Sample Labeling tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end
