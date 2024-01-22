---
title: Asynchronous Document Translation
description: An overview of the cloud-based batch asynchronous Document Translation service and process.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: concept
ms.date: 01/22/2024
ms.author: lajanuar
ms.custom: references_regions
recommendations: false
---

# Asynchronous document translation


## Development options

You can add Document Translation to your applications using the REST API or a client-library SDK:

* The [**REST API**](reference/rest-api-guide.md). is a language agnostic interface that enables you to create HTTP requests and authorization headers to translate documents.

* The [**client-library SDKs**](./quickstarts/document-translation-sdk.md) are language-specific classes, objects, methods, and code that you can quickly use by adding a reference in your project. Currently Document Translation has programming language support for [**C#/.NET**](/dotnet/api/azure.ai.translation.document) and [**Python**](https://pypi.org/project/azure-ai-translation-document/).

## Get started

In our quickstart, you learn how to rapidly get started using Document Translation. To begin, you need an active [Azure account](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [create a free account](https://azure.microsoft.com/free).

> [!div class="nextstepaction"]
> [Start here](./quickstarts/document-translation-rest-api.md "Learn how to use Document Translation with HTTP REST")

## Supported document formats

The [Get supported document formats method](reference/get-supported-document-formats.md) returns a list of document formats supported by the Document Translation service. The list includes the common file extension, and the content-type if using the upload API.

Asynchronous Document Translation supports the following document file types:

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

### Legacy file types

Source file types are preserved during the document translation with the following **exceptions**:

| Source file extension | Translated file extension|
| --- | --- |
| .doc, .odt, .rtf, | .docx |
| .xls, .ods | .xlsx |
| .ppt, .odp | .pptx |

## Supported glossary formats

Document Translation supports the following glossary file types:

| File type| File extension|Description|
|---|---|--|
|Comma-Separated Values| `csv` |A comma-delimited raw-data file used by spreadsheet programs.|
|Localization Interchange File Format| `xlf` , `xliff`| A parallel document format, export of Translation Memory systems The languages used are defined inside the file.|
|Tab-Separated Values/TAB|`tsv`, `tab`| A tab-delimited raw-data file used by spreadsheet programs.|

## Request limits

For detailed information regarding Azure AI Translator Service request limits, *see* [**Document Translation request limits**](../service-limits.md#document-translation).
