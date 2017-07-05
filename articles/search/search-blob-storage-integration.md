---
title: Adding Azure Search to Blob Storage | Microsoft Docs
description: Create an index in code using the Azure Search HTTP REST API.
services: search
documentationcenter: ''
author: ashmaka
manager: jhubbard


ms.service: search
ms.topic: article
ms.date: 05/04/2017
ms.author: ashmaka
---

# Searching Blob storage with Azure Search

Searching across the variety of content types stored in Azure Blob storage can be a difficult problem to solve. However, you can index and search the content of your Blobs in just a few clicks by using Azure Search. Searching over Blob storage requires provisioning an Azure Search service. The various service limits and pricing tiers of Azure Search can be found on the [pricing page](https://aka.ms/azspricing).

## What is Azure Search?
[Azure Search](https://aka.ms/whatisazsearch) is a search solution that makes it easy for developers to add robust full-text search  experiences to web and mobile applications. As service, Azure Search removes the need to manage any search infrastructure while offering a [99.9% uptime SLA](https://aka.ms/azuresearchsla).

With advanced support for 56 languages, Azure Search can analyze your content and intelligently handle language-specific constructs. Azure Search also provides the tools to build a rich search user experience. It is simple to add features such as faceted navigation, typeahead search suggestions, and hit highlighting to user interfaces using Azure Search. To learn about Azure Search’s features, you can read the service's [documentation](https://aka.ms/azsearchdocs).

## Crack open and search through the content of enterprise document formats
With support for [document extraction](https://aka.ms/azsblobindexer) in Azure Blob storage, Azure Search can index the content of a variety of file types stored in blobs:
- PDF
- Microsoft Office: DOCX/DOC, XLSX/XLS, PPTX/PPT, MSG (Outlook emails)
- HTML
- Plain text files

By extracting text and metadata of these file types, it is easy to search across multiple file formats with a single query to find the most relevant documents regardless of type. By indexing the content and the metadata of Microsoft Office documents, PDFs, and emails, it’s possible to build a robust enterprise content management solution using Blob storage and Azure Search.

## Search through your blob metadata
A common scenario that makes it easy to sort through blobs of any content type is to index the custom, user-defined blob metadata as well as the system properties for each of your blobs. In this way, information for each and every  blob is indexed regardless of the type of document in the blob so you can easily sort and facet across all of your Blob storage content.

[Learn more about indexing blob metadata.](https://aka.ms/azsblobmetadataindexing)

## Image search
Azure Search’s full-text search, faceted navigation, and sorting capabilities can now be applied to the metadata of images stored in blobs.

If these images are pre-processed using the [Computer Vision API](https://www.microsoft.com/cognitive-services/computer-vision-api) from Microsoft’s Cognitive Services, then it is possible to index the visual content found in each image including OCR and handwriting recognition. We are working on adding OCR and other image processing capabilities directly to Azure Search, if you are interested in these capabilities please submit a request on our [UserVoice](https://aka.ms/azsuv) or [email us](mailto:azscustquestions@microsoft.com).

## Index and search through JSON blobs
Azure Search can be configured to extract structured content found in blobs that contain JSON. Azure Search can read JSON blobs and parse the structured content into the appropriate fields of an Azure Search document. Azure Search can also take blobs that contain an array of JSON objects and map each element to a separate Azure Search document.

Note that JSON parsing is not currently configurable through the portal. [Learn more about JSON parsing in Azure Search.](https://aka.ms/azsjsonblobindexing)

## Quick start
Azure Search can be added to blobs directly from the Blob storage portal blade.

![](./media/search-blob-storage-integration/blob-blade.png)

Clicking on the "Add Azure Search" option launches a flow where you can select an existing Azure Search service or create a new service. If you create a new service, you will be navigated out of your Storage account's portal experience. You will need to re-navigate to the Storage portal blade and re-select the "Add Azure Search" option, where you can select the existing service.

### Next Steps
Learn more about the Azure Search Blob Indexer in the full [documentation](https://aka.ms/azsblobindexer).
