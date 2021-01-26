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

## Document translation process

### Step 1

* [Create an Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal)

### Step 2

* [Create a container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) in the Azure portal to upload your files.
* Upload your documents, folders,  or [translation memory file](dynamics365/fin-ops-core/dev-itpro/lifecycle-services/use-translation-service-tm) as a blob
* [Delegate access with a service shared access signature (SAS)](/rest/api/storageservices/delegate-access-with-shared-access-signature) for your blob with  [**read-only access**](/rest/api/storageservices/create-service-sas#permissions-for-a-directory-container-or-blob).  
* *See* [Create your user delegation SAS in the Azure portal](#create-your-user-delegation-sas-in-the-azure-portal) below.

### Step 3

* [Create a second container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) to store your final translated documents.
* Create a [service shared access signature (SAS)](/rest/api/storageservices/create-service-sas) for your container with  [**write-only access**](/rest/api/storageservices/create-service-sas#permissions-for-a-directory-container-or-blob)
* *See* [Create your user delegation SAS in the Azure portal](#create-your-user-delegation-sas-in-the-azure-portal) below.

### Step 4

* Invoke the service by sending an **HTTP POST** request the to your storage blob. 
* If the request is successful, the Document Translation API returns a job id that you can poll, via an **HTTP GET** request, to find status of documents requested for translation.
* The service uploads the translated documents to your target your container.
* You can download the resulting blobs using any Azure Storage tool (the Portal, AzCopy, Storage Explorer, etc.).

## The custom document translation process

* Build custom translation models using the [Custom Translation](../custom-translator/overview.md) interface.
* Once your custom translation model is built and deployed you will get a unique identifier.
* This unique identifier is passed as a configuration parameter  `Category ID` while invoking service request. *See* [Create a Custom Translation project](../how-to-create-project.md#view-project-details).

* Follow steps 1 - 4, above, to complete the document translation.

## Create your user delegation SAS in the Azure portal

* You can create an SAS for your blob in the Azure portal by navigating as follows:  
 **your storage account** → **containers** → **your container** → **your blob**
* Select **Generate SAS** from the menu near the top of the page.
* Select **Signing method** → **User delegation key**.
* For your **Storage** blob, specify **Permissions** → **Read** .
* For your **Target** blob, specify  **Permissions** → **Write**.
* Specify the signed key **Start** and **Expiry** times.
* The optional **Allowed IP addresses** field specifies an IP address or a range of IP addresses from which to accept requests. If the IP address from which the request originates does not match the IP address or address range specified on the SAS token, the request will not be authorized.
* The optional **Allowed protocols** field specifies the protocol permitted for a request made with the SAS. The default value is HTTPS.

## Available file formats

The following file types can be translated using the Document Translation API.

| File type| File extension|Description|
|---|---|--|
|Adobe PDF|.pdf|Adobe Acrobat portable document format|
|HTML|.html|Hyper Text Markup Language|
|Localisation Interchange File Format|.xlf. ,xliff| A parallel document format, export of Translation Memory systems. The languages used are defined inside the file.|
|Markdown|.md| A lightweight markup language for creating formatted text using plain-text formatting syntax.|
|Microsoft Excel|.xlsx|Excel file (2013 or later). The first line/ row of the spreadsheet should be language code.|
|Microsoft Outlook|.msg|An email message, contact, appointment, or task created or saved within Microsoft Outlook|
|Microsoft PowerPoint|.pptx| A presentation file used to display content in a slideshow format.|
|Microsoft Word|.docx| A document file consisting of text and other media such as images|
|TAB|.tab| A text file containing a list of data separated by tabs|
|Tab Separated Values|.tsv| a tab-delimited raw-data file used by spreadsheet programs|
|Text|.txt| An unformatted standard ASCII text document.|
|Translation Memory Exchange|.tmx|An open XML standard used for exchanging translation memory (TM) data created by Computer Aided Translation (CAT) and localization applications.|

### Next Step

> [!div class="nextstepaction"]
> [Create a document translation service](create-a-document-translation-service.md)
>
>