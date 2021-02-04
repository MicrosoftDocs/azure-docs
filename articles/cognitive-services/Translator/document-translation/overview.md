---
title: What is Document Translation?
description: An overview of the cloud-based batch document translation service and process.
ms.topic: overview
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 02/04/2021
---

# What is Document Translation (Preview)?

The Document Translation API translates documents to and from more than 70 languages while preserving source document structure and text formatting. Document Translation is a cloud-based feature of the Azure Translator](../translator-info-overview.md) service and is part of the Azure Cognitive Service family of REST APIs.

## Document Translation key features

1. **Translate large files**.  You translate whole documents asynchronously.
1. **Translate multiple files**. You can translate multiple files into multiple languages.
1. **Preserve source file format**.  You can translate files while preserving the original layout and format.
1. **Apply custom translation**. You can translate documents using [custom translation models](../customization.md#custom-translator)
1. **Use custom glossaries**. You can translate documents applying custom glossaries without creating custom translation models.

## Document translation

Document translation is a batch process that is accomplished with the following Azure portal resources:

* [**Translator**](https://ms.portal.azure.com/#create/Microsoft). _See_  [Create a Translator Resource](../translator-how-to-signup.md).
* [**Azure storage account**](/azure/storage/common/storage-account-create?tabs=azure-portal). All access to Azure Storage takes place through a storage account.
* [**Azure blob storage containers**](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container). Each request requires a source blob container to upload your document files, folders, or glossaries, and a target blob container to store your final translated documents.

## Document Translation using custom models

Once your custom translation model is built and deployed, you'll get a unique identifier, `CategoryID` , that is used to get translations from a customized system built with Custom Translator. CategoryID is passed as the configuration parameter  `category`  within the query string for your Translator endpoint:

```http
https://<name-of-your-resource>./translator/text/batch/v1.0-preview.1/batches&category=a2eb72f9-46bf-82fa-4693c8b64c3c-GENERAL
```

 *See* [Create a Custom Translation project](../custom-translator/how-to-create-project.md#view-project-details) and [Translator3.0 Optional Parameters](../reference/v3-0-translate?tabs=curl&branch=pr-en-us-144446#optional-parameters).

## Supported file formats

The following file types can be translated using the Document Translation API:

| File type| File extension|Description|
|---|---|--|
|Adobe PDF|.pdf|Adobe Acrobat portable document format|
|HTML|.html|Hyper Text Markup Language.|
|Localisation Interchange File Format|.xlf. , xliff| A parallel document format, export of Translation Memory systems. The languages used are defined inside the file.|
|Microsoft Excel|.xlsx|A spreadsheet file for data analysis and documentation.|
|Microsoft Outlook|.msg|An email message created or saved within Microsoft Outlook.|
|Microsoft PowerPoint|.pptx| A presentation file used to display content in a slideshow format.|
|Microsoft Word|.docx| A text document file.|
|Tab Separated Values/TAB|.tsv/.tab| a tab-delimited raw-data file used by spreadsheet programs.|
|Text|.txt| An unformatted text document.|
|Translation Memory Exchange|.tmx|An open XML standard used for exchanging translation memory (TM) data created by Computer Aided Translation (CAT) and localization applications.|

### Next Step

> [!div class="nextstepaction"]
> [Get Started with Document Translation](get-started-with-document-translation.md)
>
>
