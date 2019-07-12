---
title: Add full text search to Azure Blob Storage - Azure Search
description: Crawl text content in Azure Blob storage for Azure Search indexing, in code using the HTTP REST API.
services: search
ms.service: search
ms.topic: conceptual
ms.date: 03/01/2019
author: mgottein 
manager: cgronlun
ms.author: magottei
ms.custom: seodec2018
---

# Searching Blob storage with Azure Search

Searching across the variety of content types stored in Azure Blob storage can be a difficult problem to solve. However, you can index and search the content of your Blobs in just a few clicks by using Azure Search. Searching over Blob storage requires provisioning an Azure Search service. The various service limits and pricing tiers of Azure Search can be found on the [pricing page](https://aka.ms/azspricing).

## What is Azure Search?
[Azure Search](https://aka.ms/whatisazsearch) is a search service that makes it easy for developers to add robust full-text search  experiences to web and mobile applications. As a service, Azure Search removes the need to manage any search infrastructure while offering a [99.9% uptime SLA](https://aka.ms/azuresearchsla).

## Index and search enterprise document formats
With support for [document extraction](https://aka.ms/azsblobindexer) in Azure Blob storage, you can index the following content:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

By extracting text and metadata from these file types, you can search across multiple file formats with a single query. 

## Search through your blob metadata
A common scenario that makes it easy to sort through blobs of any content type is to index both custom  metadata and system properties for each blob. In this way, information for all blobs is indexed regardless of document type. You can then proceed to sort, filter, and facet across all Blob storage content.

[Learn more about indexing blob metadata.](https://aka.ms/azsblobmetadataindexing)

## Image search
Azure Search’s full-text search, faceted navigation, and sorting capabilities can now be applied to the metadata of images stored in blobs.

Cognitive search includes image processing skills such as [Optical Character Recognition (OCR)](cognitive-search-skill-ocr.md) and identification of [visual features](cognitive-search-skill-image-analysis.md) that make it possible to index the visual content found in each image.

## Index and search through JSON blobs
Azure Search can be configured to extract structured content found in blobs that contain JSON. Azure Search can read JSON blobs and parse the structured content into the appropriate fields of an Azure Search document. Azure Search can also take blobs that contain an array of JSON objects and map each element to a separate Azure Search document.

JSON parsing is not currently configurable through the portal. [Learn more about JSON parsing in Azure Search.](https://aka.ms/azsjsonblobindexing)

## Quick start
Azure Search can be added to blobs directly from the Blob storage portal page.

![](./media/search-blob-storage-integration/blob-blade.png)

Click **Add Azure Search** to launch a flow where you can select an existing Azure Search service or create a new service. If you create a new service, you are navigated out of your Storage account's portal experience. You can navigate back to the Storage portal page and re-select the **Add Azure Search** option, where you can select the existing service.

## Next Steps
Learn more about the Azure Search Blob Indexer in the full [documentation](https://aka.ms/azsblobindexer).
