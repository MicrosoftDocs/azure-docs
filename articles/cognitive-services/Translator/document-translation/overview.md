---
title: What is Document Translation Services?
description:
ms.topic: overview
manager: nitinme
ms.author: laujanuar
author: laujan
ms.date: 01/25/2021
---

# What is the Document Translation service?

Document Translation is a feature of the [Azure Translator](../translator-info-overview.md) cloud-based machine translation service and is part of the [Azure Cognitive Services](../../what-are-cognitive-services.md) family of REST APIs. The Document Translation API enables the translation of whole documents, in a variety of file formats, from and to any of  more than 70 languages available in Translator service.

## Document Translation key features

1. **Translate large files**. Your request can have an upper-limit of 40MB; you are not limited to 10k characters per translation request as is the case with [Translator text translation](../request-limits.md#character-and-array-limits-per-request).
1. **Translate multiple files**. You can translate files into multiple languages and manage job queues.
1. **Preserve source file format**.  You can translate a variety of files while preserving the original layout and format.
1. **Apply custom translation**. You can translate documents using [custom translation models](../customization.md#custom-translator)
1. **Utilize custom dictionaries**. You can apply custom dictionaries without creating [custom translation models](../custom-translator/what-is-dictionary.md).

## The document translation process 


### Step 1

* [Create an Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal)
* [Create a container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) in the Azure portal to upload your files.
* Upload your document or [translation memory file](dynamics365/fin-ops-core/dev-itpro/lifecycle-services/use-translation-service-tm) as a blob
* Create a [service shared access signature (SAS)](/rest/api/storageservices/create-service-sas) for your container with  [**read-only access**](/rest/api/storageservices/create-service-sas#permissions-for-a-directory-container-or-blob)

### Step 2
* [Create a second container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) to store your final translated documents.
* Create a [service shared access signature (SAS)](/rest/api/storageservices/create-service-sas) for your container with  [**write-only access**](/rest/api/storageservices/create-service-sas#permissions-for-a-directory-container-or-blob)
* Invoke the service with the necessary parameters. The Document Translator API returns a job id using which you can poll to find status of documents requested for translation
* Once the service uploads the result blobs to your second container,
* You can download the resulting blobs using any Azure Storage tool (the Portal, AzCopy, Storage Explorer, etc.).

## The custom document translation process

* Build custom translation models using the Custom Translator interface.
* Once your custom translation model is built and deployed you will get a unique identifier. 
* This unique identifier is passed as a configuration parameter ‘category ID’ while invoking service request.

* Follow steps 1 and 2 above to complete the document translation.

## Available file formats

he following file types can be translated using the Document Translator API.

| File type| File extension|Description|
|---|---|--|
|Adobe PDF|	.pdf|Adobe Acrobat portable document format|
|HTML|	.html|Hyper Text Markup Language|
|Localisation Interchange File Format|.xlf. ,xliff| A parallel document format, export of Translation Memory systems. The languages used are defined inside the file.|
|Markdown|	.md| A lightweight markup language for creating formatted text using plain-text formatting syntax.|
|Microsoft Excel|	.xlsx|Excel file (2013 or later). The first line/ row of the spreadsheet should be language code.|
|Microsoft Outlook|	.msg|An email message, contact, appointment, or task created or saved within Microsoft Outlook|
|Microsoft PowerPoint|	.pptx| A presentation file used to display content in a slideshow format.|
|Microsoft Word|	.docx| A document file consisting of text and other media such as images|
|TAB|	.tab| A text file containing a list of data separated by tabs|
|Tab Separated Values|	.tsv| a tab-delimited raw-data file used by spreadsheet programs|
|Text|	.txt| An unformatted standard ASCII text document.|
|Translation Memory Exchange|	.tmx|An open XML standard used for exchanging translation memory (TM) data created by Computer Aided Translation (CAT) and localization applications.|



