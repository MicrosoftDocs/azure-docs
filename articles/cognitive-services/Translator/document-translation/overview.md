---
title: What is Document Translation?
description: An overview of the cloud-based batch document translation service and process.
ms.topic: overview
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 02/09/2021
---

# What is Document Translation (Preview)?

Document Translation is a cloud-based feature of the [Azure Translator](../translator-info-overview.md) service and is part of the Azure Cognitive Service family of REST APIs. The Document Translation API translates documents to and from more than 70 languages while preserving document structure and data format.

## Document Translation key features

1. **Translate large files**.  You can translate whole documents asynchronously.
1. **Translate multiple files**. You can translate multiple files into multiple languages.
1. **Preserve source file format**.  You can translate files while preserving the original layout and format.
1. **Apply custom translation**. You can translate documents using general and [custom translation](../customization.md#custom-translator) models.
1. **Use custom glossaries**. You can translate documents applying custom glossaries.

## Document translation

Document translation requires the following Azure portal resources:

* [**Translator**](https://ms.portal.azure.com/#create/Microsoft). _See_  [Create a Translator Resource](../translator-how-to-signup.md).
* [**Azure storage account**](/azure/storage/common/storage-account-create?tabs=azure-portal). All access to Azure Storage takes place through a storage account.
* [**Azure blob storage containers**](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container). Each request requires a source container to upload your files, folders, or glossaries, and a target container to store your final translated documents.

## Supported document file formats

| File type| File extension|Description|
|---|---|--|
|Adobe PDF|.pdf|Adobe Acrobat portable document format|
|HTML|.html|Hyper Text Markup Language.|
|Localization Interchange File Format|.xlf. , xliff| A parallel document format, export of Translation Memory systems. The languages used are defined inside the file.|
|Microsoft Excel|.xlsx|A spreadsheet file for data analysis and documentation.|
|Microsoft Outlook|.msg|An email message created or saved within Microsoft Outlook.|
|Microsoft PowerPoint|.pptx| A presentation file used to display content in a slideshow format.|
|Microsoft Word|.docx| A text document file.|
|Tab Separated Values/TAB|.tsv/.tab| a tab-delimited raw-data file used by spreadsheet programs.|
|Text|.txt| An unformatted text document.|
|Translation Memory Exchange|.tmx|An open XML standard used for exchanging translation memory (TM) data created by Computer Aided Translation (CAT) and localization applications.|

## Supported glossary file formats

| File type| File extension|Description|
|---|---|--|
|Localization Interchange File Format|.xlf. , xliff| A parallel document format, export of Translation Memory systems. The languages used are defined inside the file.|
|Tab Separated Values/TAB|.tsv/.tab| a tab-delimited raw-data file used by spreadsheet programs.|

### Next Step

> [!div class="nextstepaction"]
> [Get Started with Document Translation](get-started-with-document-translation.md)
>
>
