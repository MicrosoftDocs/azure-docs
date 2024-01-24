---
title: What is Document Translation?
description: An overview of the cloud-based synchronous File Document Translation service and process.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: overview
ms.date: 01/24/2024
ms.author: lajanuar
ms.custom: references_regions
recommendations: false
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->
<!-- markdownlint-disable MD001 -->

# What is File Document Translation?

Document Translation is a cloud-based feature of the [Azure AI Translator](../translator-overview.md) machine translation service that enable you to use our REST APIs and SDKs to translate multiple and complex documents across all [supported languages and dialects](../../language-support.md) while preserving original document structure and data format. The Document translation API supports two translation operations:

* [File document translation](#file-translation-key-features) supports synchronous processing of single file translations. The file translation process does not require an Azure Blob storage account. The final response contains the translated document and is returned directly to the calling client.

* [Batch document translation](async-batch-overview.md#batch-translation-key-features) supports asynchronous processing of multiple documents and files. The batch translation process requires an Azure Blob storage account with containers for your source and translated documents.


## [Batch translation](#tab/asynchronous)

### Batch translation key features

  | Feature | Description |
  | ---------| -------------|
  |**Translate large files**| Translate whole documents asynchronously.|
  |**Translate numerous files**|Translate multiple files across all supported languages and dialects while preserving document structure and data format.|
  |**Preserve source file presentation**| Translate files while preserving the original layout and format.|
  |**Apply custom translation**| Translate documents using general and [custom translation](../custom-translator/concepts/customization.md#custom-translator) models.|
  |**Apply custom glossaries**|Translate documents using custom glossaries.|
  |**Automatically detect document language**|Let the Document Translation service determine the language of the document.|
  |**Translate documents with content in multiple languages**|Use the autodetect feature to translate documents with content in multiple languages into your target language.|

### Development options

You can add Document Translation to your applications using the REST API or a client-library SDK:

* The [**REST API**](reference/rest-api-guide.md). is a language agnostic interface that enables you to create HTTP requests and authorization headers to translate documents.

* The [**client-library SDKs**](./quickstarts/async-translation-sdk.md) are language-specific classes, objects, methods, and code that you can quickly use by adding a reference in your project. Currently Document Translation has programming language support for [**C#/.NET**](/dotnet/api/azure.ai.translation.document) and [**Python**](https://pypi.org/project/azure-ai-translation-document/).

## File translation key features

|Feature | Description |
| ---------| -------------|
|**Translate single-page files**| The synchronous request accepts only a single document as input.|
|**Preserve source file presentation**| Translate files while preserving the original layout and format.|
|**Apply custom translation**| Translate documents using general and [custom translation](../custom-translator/concepts/customization.md#custom-translator) models.|
|**Apply custom glossaries**|Translate documents using custom glossaries.|
|**Automatically detect document language**|Let the Document Translation service determine the language of the document.|

## File translation supported document formats

|File type| File extension|Description|
|---|---|--|
|HTML|`html`, `htm`|Hyper Text Markup Language.|
|M&#8203;HTML|`mthml`, `mht`| A web page archive format used to combine HTML code and its companion resources.|
|Microsoft Excel|`xls`, `xlsx`|A spreadsheet file for data analysis and documentation.|
|Microsoft Outlook|`msg`|An email message created or saved within Microsoft Outlook.|
|Microsoft PowerPoint|`ppt`, `pptx`| A presentation file used to display content in a slideshow format.|
|Microsoft Word|`doc`, `docx`| A text document file.|
|OpenDocument Text|`odt`|An open-source text document file.|
|OpenDocument Presentation|`odp`|An open-source presentation file.|
|OpenDocument Spreadsheet|`ods`|An open-source spreadsheet file.|
|Plain Text|`txt`| An unformatted text document.|

## Request limits

For detailed information regarding Azure AI Translator Service request limits, *see* [**Document Translation request limits**](../service-limits.md#document-translation).

## Data residency

Document Translation data residency depends on the Azure region where your Translator resource was created:

* Translator resources **created** in any region in Europe (except Switzerland) are **processed** at data center in North Europe and West Europe.
* Translator resources **created** in any region in Switzerland are **processed** at data center in Switzerland North and Switzerland West
* Translator resources **created** in any region in Asia Pacific or Australia are **processed** at data center in Southeast Asia and Australia East.
* Translator resource **created** in all other regions including Global, North America, and South America are **processed** at data center in East US and West US 2.

### Document Translation data residency

✔️ Feature: **Document Translation**</br>
✔️ Service endpoint:  **Custom:** &#8198;&#8198;&#8198; **`<name-of-your-resource.cognitiveservices.azure.com/translator/text/batch/v1.1`**

|Resource region| Request processing data center |
|----------------------------------|-----------------------|
|**Any region within Europe (except Switzerland)**| Europe — North Europe &bull; West Europe|
|**Switzerland**|Switzerland — Switzerland North &bull; Switzerland West|
|**Any region within Asia Pacific and Australia**| Asia — Southeast Asia &bull; Australia East|
|**All other regions including Global, North America, and South America**  | US — East US &bull; West US 2|

## Next steps

In our quickstart, you learn how to rapidly get started using Document Translation. To begin, you need an active [Azure account](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [create a free account](https://azure.microsoft.com/free).

> [!div class="nextstepaction"]
> [Get Started with Document Translation](./quickstarts/sync-translation-rest-api.md)
