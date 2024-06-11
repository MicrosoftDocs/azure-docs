---
title: What is Document Translation?
description: An overview of the cloud-based asynchronous batch translation services and processes.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: overview
ms.date: 05/14/2024
ms.author: lajanuar
ms.custom: references_regions
recommendations: false
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->
<!-- markdownlint-disable MD001 -->

# What is Document Translation?

Document Translation is a cloud-based machine translation feature of the [Azure AI Translator](../translator-overview.md) service. You can translate multiple and complex documents across all [supported languages and dialects](../../language-support.md) while preserving original document structure and data format. The Document translation API supports two translation processes:

* [Asynchronous batch translation](#asynchronous-batch-translation) supports the processing of multiple documents and large files. The batch translation process requires an Azure Blob storage account with storage containers for your source and translated documents.

* [Synchronous single file](#synchronous-translation) supports the processing of single file translations. The file translation process doesn't require an Azure Blob storage account. The final response contains the translated document and is returned directly to the calling client.

## Asynchronous batch translation

Use asynchronous document processing to translate multiple documents and large files.

### Batch key features

  | Feature | Description |
  | ---------| -------------|
  |**Translate large files**| Translate whole documents asynchronously.|
  |**Translate numerous files**|Translate multiple files across all supported languages and dialects while preserving document structure and data format.|
  |**Preserve source file presentation**| Translate files while preserving the original layout and format.|
  |**Apply custom translation**| Translate documents using general and [custom translation](../custom-translator/concepts/customization.md#custom-translator) models.|
  |**Apply custom glossaries**|Translate documents using custom glossaries.|
  |**Automatically detect document language**|Let the Document Translation service determine the language of the document.|
  |**Translate documents with content in multiple languages**|Use the autodetect feature to translate documents with content in multiple languages into your target language.|

### Batch development options

You can add Document Translation to your applications using the REST API or a client-library SDK:

* The [**REST API**](reference/rest-api-guide.md). is a language agnostic interface that enables you to create HTTP requests and authorization headers to translate documents.

* The [**client-library SDKs**](./quickstarts/client-library-sdks.md) are language-specific classes, objects, methods, and code that you can quickly use by adding a reference in your project. Currently Document Translation has programming language support for [**C#/.NET**](/dotnet/api/azure.ai.translation.document) and [**Python**](https://pypi.org/project/azure-ai-translation-document/).

### Batch supported document formats

The [Get supported document formats method](reference/get-supported-document-formats.md) returns a list of document formats supported by the Document Translation service. The list includes the common file extension, and the content-type if using the upload API.

| File type| File extension|Description|
|---|---|--|
|Adobe PDF|`pdf`|Portable document file format. Document Translation uses optical character recognition (OCR) technology to extract and translate text in scanned PDF document while retaining the original layout.|
|Comma-Separated Values |`csv`| A comma-delimited raw-data file used by spreadsheet programs.|
|HTML|`html`, `htm`|Hyper Text Markup Language.|
|Localization Interchange File Format|xlf| A parallel document format, export of Translation Memory systems. The languages used are defined inside the file.|
|Markdown| `markdown`, `mdown`, `mkdn`, `md`, `mkd`, `mdwn`, `mdtxt`, `mdtext`, `rmd`| A lightweight markup language for creating formatted text.|
|M&#8203;HTML|`mthml`, `mht`| A web page archive format used to combine HTML code and its companion resources.|
|Microsoft Excel|`xls`, `xlsx`|A spreadsheet file for data analysis and documentation.|
|Microsoft Outlook|`msg`|An email message created or saved within Microsoft Outlook.|
|Microsoft PowerPoint|`ppt`, `pptx`| A presentation file used to display content in a slideshow format.|
|Microsoft Word|`doc`, `docx`| A text document file.|
|OpenDocument Text|`odt`|An open-source text document file.|
|OpenDocument Presentation|`odp`|An open-source presentation file.|
|OpenDocument Spreadsheet|`ods`|An open-source spreadsheet file.|
|Rich Text Format|`rtf`|A text document containing formatting.|
|Tab Separated Values/TAB|`tsv`/`tab`| A tab-delimited raw-data file used by spreadsheet programs.|
|Text|`txt`| An unformatted text document.|

### Batch Legacy file types

Source file types are preserved during the document translation with the following **exceptions**:

| Source file extension | Translated file extension|
| --- | --- |
| .doc, .odt, .rtf, | .docx |
| .xls, .ods | .xlsx |
| .ppt, .odp | .pptx |

### Batch supported glossary formats

Document Translation supports the following glossary file types:

| File type| File extension|Description|
|---|---|--|
|Comma-Separated Values| `csv` |A comma-delimited raw-data file used by spreadsheet programs.|
|Localization Interchange File Format| `xlf` , `xliff`| A parallel document format, export of Translation Memory systems The languages used are defined inside the file.|
|Tab-Separated Values/TAB|`tsv`, `tab`| A tab-delimited raw-data file used by spreadsheet programs.|

## Synchronous translation

 Use synchronous translation processing to send a document as part of the HTTP request body and receive the translated document in the HTTP response.

### Synchronous translation key features

|Feature | Description |
| ---------| -------------|
|**Translate single-page files**| The synchronous request accepts only a single document as input.|
|**Preserve source file presentation**| Translate files while preserving the original layout and format.|
|**Apply custom translation**| Translate documents using general and [custom translation](../custom-translator/concepts/customization.md#custom-translator) models.|
|**Apply custom glossaries**|Translate documents using custom glossaries.|
|**Single language translation**|Translate to and from one [supported language](../language-support.md).|
|**Automatically detect document language**|Let the Document Translation service determine the language of the document.|
|**Apply custom glossaries**|Translate a document using a custom glossary.|

### Synchronous supported document formats

|File type|File extension| Content type|Description|
|---|---|--|---|
|**Plain Text**|`.txt`|`text/plain`| An unformatted text document.|
|**Tab Separated Values**|`.txv`<br> `.tab`|`text/tab-separated-values`|A text file format that uses tabs to separate values and newlines to separate records.|
|**Comma Separated Values**|`.csv`|`text/csv`|A text file format that uses commas as a delimiter between values.|
|**HyperText Markup Language**|`.html`<br> `.htm`|`text/html`|HTML is a standard markup language used to structure web pages and content.|
|**M&#8203;HTML**|`.mthml`<br> `.mht`| `message/rfc822`<br> @`application/x-mimearchive`<br> @`multipart/related` |A web page archive file format.|
|**Microsoft PowerPoint**|`.pptx`|`application/vnd.openxmlformats-officedocument.presentationml.presentation` |An XML-based file format used for PowerPoint slideshow presentations.|
|**Microsoft Excel**|`.xlsx`| `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`| An XML-based file format used for Excel spreadsheets.|
|**Microsoft Word**|`.docx`| `application/vnd.openxmlformats-officedocument.wordprocessingml.document`|An XML-based file format used for Word documents.|
|**Microsoft Outlook**|`.msg`|`application/vnd.ms-outlook`|A file format used for stored Outlook mail message objects.|
|**Xml Localization Interchange**|`.xlf`<br> `.xliff`|`application/xliff+xml` |A standardized XML-based file format widely used in translation and localization software processing.|

### Synchronous supported glossary formats

Document Translation supports the following glossary file types:

| File type| File extension|Description|
|---|---|--|
|**Comma-Separated Values**| `csv` |A comma-delimited raw-data file used by spreadsheet programs.|
|**XmlLocalizationInterchange**| `xlf` , `xliff`| An XML-based format designed to standardize how data is passed during the localization process. |
|**TabSeparatedValues**|`tsv`, `tab`| A tab-delimited raw-data file used by spreadsheet programs.|

## Document Translation Request limits

For detailed information regarding Azure AI Translator Service request limits, *see* [**Document Translation request limits**](../service-limits.md#document-translation).

## Document Translation data residency

Document Translation data residency depends on the Azure region where your Translator resource was created:

✔️ Feature: **Document Translation**</br>
✔️ Service endpoint:  **Custom: `<name-of-your-resource.cognitiveservices.azure.com/translator/text/batch/v1.1`**

|Resource created region| Request processing data center |
|----------------------------------|-----------------------|
|**Global**|Closest available data center.|
|**Americas**|East US 2 &bull; West US 2|
|**Asia Pacific**| Japan East &bull; Southeast Asia|
|**Europe (except Switzerland)**| France Central &bull; West Europe|
|**Switzerland**|Switzerland North &bull; Switzerland West|

## Next steps

In our quickstart, you learn how to rapidly get started using Document Translation. To begin, you need an active [Azure account](https://azure.microsoft.com/free/cognitive-services/). If you don't have one, you can [create a free account](https://azure.microsoft.com/free).

> [!div class="nextstepaction"]
> [Get Started with Asynchronous batch translation](./how-to-guides/use-rest-api-programmatically.md) [Get started with synchronous translation](how-to-guides/use-rest-api-programmatically.md)
