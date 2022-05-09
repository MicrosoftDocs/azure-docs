---
title: What is Microsoft Azure Cognitive Services Document Translation?
description: An overview of the cloud-based batch Document Translation service and process.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: overview
ms.date: 05/25/2021
ms.author: lajanuar
recommendations: false
---
# What is Document Translation?

Document Translation is a cloud-based feature of the [Azure Translator](../translator-overview.md) service and is part of the Azure Cognitive Service family of REST APIs. The Document Translation API can be used to translate multiple and complex documents across all [supported languages and dialects](../../language-support.md), while preserving original document structure and data format.

This documentation contains the following article types:

* [**Quickstarts**](get-started-with-document-translation.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](create-sas-tokens.md) contain instructions for using the feature in more specific or customized ways.
* [**Reference**](reference/rest-api-guide.md) provide REST API settings, values, keywords, and configuration.

## Document Translation key features

| Feature | Description |
| ---------| -------------|
| **Translate large files**| Translate whole documents asynchronously.|
|**Translate numerous files**|Translate multiple files across all supported languages and dialects while preserving document structure and data format.|
|**Translate 🆕[scanned](#document-translation-scanned-pdfs) and text-embedded pdf documents** |Translate printed text in scanned PDF documents. |
|**Preserve source file presentation**| Translate files while preserving the original layout and format.|
|**Apply custom translation**| Translate documents using general and [custom translation](../customization.md#custom-translator) models.|
|**Apply custom glossaries**|Translate documents using custom glossaries.|
|**Automatically detect document language**|Let the Document Translation service determine the language of the document.|
|**Translate documents with content in multiple languages**|Use the autodetect feature to translate documents with content in multiple languages into your target language.|

> [!NOTE]
> When translating documents with content in multiple languages, the feature is intended for complete sentences in a single language. If sentences are composed of more than one language, the content may not all translate into the target language.
>

## Document Translation: scanned PDFs

* Uses optical character recognition (OCR) foundational technology to power translation for scanned PDF documents such as agreements, contracts, manuals, and receipts.

* Includes extensive [language support](../language-support.md#-document-translation-scanned-pdfs) for printed text languages.

* Supports scanned PDFs with multiple languages in the same document.

## Document Translation input requirements

* Scanned PDF documents: For best results, provide one high-quality scan per document.

* Scanned or text-embedded PDF dimensions: ≤ 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.

* If your scanned or text-embedded PDFs are password-locked, you must remove the lock before submission.

* Source language identification isn't required. Document Translation can automatically detect the language of the source text. However, if the language of the content in the source document is known, it's recommended that the source language is specified in the request to get a better translation. You can provide the source language code if you want to force the service to apply a specific language model.

* Document size: ≤ 40 mb

* Total number of **files** (not pages) per single request: ≤ 1000.

* Total content size in a single request: ≤ 250 mb.

* Number of target languages in a batch request: ≤ 10.

## Document Translation development options

You can add Document Translation to your applications using the REST API or a client-library SDK:

* The [**REST API**](reference/rest-api-guide.md). is a language agnostic interface that enables you to create HTTP requests and authorization headers to translate documents.

* The [**client-library SDKs**](client-sdks.md) are language-specific classes, objects, methods, and code that you can quickly use by adding a reference in your project. Currently Document Translation has programming language support for [**C#/.NET**](/dotnet/api/azure.ai.translation.document) and [**Python**](https://pypi.org/project/azure-ai-translation-document/).

## Get started

In our how-to guide, you'll learn how to quickly get started using Document Translation. To begin, you'll need an active [Azure account](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [create a free account](https://azure.microsoft.com/free).

> [!div class="nextstepaction"]
> [Start here](get-started-with-document-translation.md "Learn how to use Document Translation with HTTP REST")

## Supported document formats

The following document file types are supported by Document Translation:

| File type| File extension|Description|
|---|---|--|
|🆕 Adobe PDF| Scanned content portable document format.|
|Adobe PDF|pdf|Text-embedded portable document format.|
|Comma-Separated Values |csv| A comma-delimited raw-data file used by spreadsheet programs.|
|HTML|html, htm|Hyper Text Markup Language.|
|Localization Interchange File Format|xlf. , xliff| A parallel document format, export of Translation Memory systems. The languages used are defined inside the file.|
|Markdown| markdown, mdown, mkdn, md, mkd, mdwn, mdtxt, mdtext, rmd| A lightweight markup language for creating formatted text.|
|MHTML|mthml, mht| A web page archive format used to combine HTML code and its companion resources.|
|Microsoft Excel|xls, xlsx|A spreadsheet file for data analysis and documentation.|
|Microsoft Outlook|msg|An email message created or saved within Microsoft Outlook.|
|Microsoft PowerPoint|ppt, pptx| A presentation file used to display content in a slideshow format.|
|Microsoft Word|doc, docx| A text document file.|
|OpenDocument Text|odt|An open-source text document file.|
|OpenDocument Presentation|odp|An open-source presentation file.|
|OpenDocument Spreadsheet|ods|An open-source spreadsheet file.|
|Rich Text Format|rtf|A text document containing formatting.|
|Tab Separated Values/TAB|tsv/tab| A tab-delimited raw-data file used by spreadsheet programs.|
|Text|txt| An unformatted text document.|

## Supported glossary formats

The following glossary file types are supported by Document Translation:

| File type| File extension|Description|
|---|---|--|
|Comma-Separated Values| csv |A comma-delimited raw-data file used by spreadsheet programs.|
|Localization Interchange File Format| xlf , xliff| A parallel document format, export of Translation Memory systems The languages used are defined inside the file.|
|Tab-Separated Values/TAB|tsv, tab| A tab-delimited raw-data file used by spreadsheet programs.|

## Next steps

> [!div class="nextstepaction"]
> [Get Started with Document Translation](get-started-with-document-translation.md)
