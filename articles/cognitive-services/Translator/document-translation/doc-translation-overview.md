---
title: What is Document Translation Services?
description: An overview of the batch document translation service and process.
ms.topic: overview
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 01/25/2021
---

# What is Document Translation?

Document Translation is a cloud-based feature of the [Azure Translator](../translator-info-overview.md) service and is part of the [Azure Cognitive Services](../../what-are-cognitive-services.md) family of REST APIs. The Document Translation API enables the translation of whole documents from and to more than 70 languages available in the Translator service.

## Document Translation key features

1. **Translate large files**. Your request can have an upper-limit of 40 MB; you aren't limited to 10k characters per translation request as is the case with [Translator text translation](../request-limits.md#character-and-array-limits-per-request).
1. **Translate multiple files**. You can translate files into multiple languages and manage job queues.
1. **Preserve source file format**.  You can translate files while preserving the original layout and format.
1. **Apply custom translation**. You can translate documents using [custom translation models](../customization.md#custom-translator)
1. **Use custom dictionaries**. You can apply custom dictionaries without creating [custom translation models](../custom-translator/what-is-dictionary.md).

## Document translation overview

Document translation is a batch process that is accomplished with the following Azure portal resources:

* A single-service Translator or multi-service Cognitive Services resource. _See_  [Create a Translator Resource](../translator-how-to-signup.md).
* An [Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal). All access to Azure Storage takes place through a storage account.
* Two [Azure blob storage containers](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container). You'll need one to upload your document files, folders, or  [translation memory file](/dynamics365/fin-ops-core/dev-itpro/lifecycle-services/use-translation-service-tm) as a blob. Your second blob container will store your final translated documents.

## Custom document translation overview

Custom translation uses models via the [Custom Translation](../custom-translator/overview.md) interface. Once your custom translation model is built and deployed, you'll get a unique identifier. This unique identifier is passed as a configuration parameter  `Category ID` while invoking service request. *See* [Create a Custom Translation project](../custom-translator/how-to-create-project.md#view-project-details).

## Available file formats

The following file types can be translated using the Document Translation API.

| File type| File extension|Description|
|---|---|--|
|Adobe PDF|.pdf|Adobe Acrobat portable document format|
|HTML|.html|Hyper Text Markup Language.|
|Localisation Interchange File Format|.xlf. , xliff| A parallel document format, export of Translation Memory systems. The languages used are defined inside the file.|
|Markdown|.md| A lightweight markup language for creating formatted text using plain-text formatting syntax.|
|Microsoft Excel|.xlsx|Excel file (2013 or later). The first line/ row of the spreadsheet should be language code.|
|Microsoft Outlook|.msg|An email message, contact, appointment, or task created or saved within Microsoft Outlook.|
|Microsoft PowerPoint|.pptx| A presentation file used to display content in a slideshow format.|
|Microsoft Word|.docx| A document file consisting of text and other media such as images.|
|TAB|.tab| A text file containing a list of data separated by tabs.|
|Tab Separated Values|.tsv| a tab-delimited raw-data file used by spreadsheet programs.|
|Text|.txt| An unformatted standard ASCII text document.|
|Translation Memory Exchange|.tmx|An open XML standard used for exchanging translation memory (TM) data created by Computer Aided Translation (CAT) and localization applications.|

### Next Step

> [!div class="nextstepaction"]
> [Create a document translation service](create-a-document-translation-service.md)
>
>
