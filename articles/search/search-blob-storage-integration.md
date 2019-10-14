---
title: Add full text search to Azure Blob Storage
titleSuffix: Azure Search
description: Extract content and add structure to Azure blobs when building a full text search index in Azure Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: search
ms.topic: conceptual
ms.date: 10/09/2019
---

# Add full text search to Azure blob data using Azure Search

Searching across the variety of content types stored in Azure Blob storage can be a difficult problem to solve. However, you can index and search the content of your Blobs in just a few clicks by using [Azure Search](search-what-is-azure-search.md). Azure Search has built-in integration for indexing out of Blob storage through a [*Blob indexer*](search-howto-indexing-azure-blob-storage.md) that adds data-source-aware capabilities to indexing.

## Supported content types

By running a Blob indexer over a container, you can extract text and metadata from the following content types with a single query:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

Optionally, you can attach [AI enrichment](search-blob-ai-integration.md) in the form of a *skillset* to create new information and structure from blobs, including text representations of image files. The addition of AI enrichment expands the content type list to include JPEG and PNG. It adds image processing skills such as [Optical Character Recognition (OCR)](cognitive-search-skill-ocr.md) and identification of [visual features](cognitive-search-skill-image-analysis.md) that make it possible to index the visual content found in each image.

## Search through your blob metadata
A common scenario that makes it easy to sort through blobs of any content type is to index both custom  metadata and system properties for each blob. In this way, information for all blobs is indexed regardless of document type. You can then proceed to sort, filter, and facet across all Blob storage content.

[Learn more about indexing blob metadata.](https://aka.ms/azsblobmetadataindexing)

### Indexing JSON blobs
Azure Search can be configured to extract structured content found in blobs that contain JSON. Azure Search can read JSON blobs and parse the structured content into the appropriate fields of an Azure Search document. Azure Search can also take blobs that contain an array of JSON objects and map each element to a separate Azure Search document. You can set a parsing mode to affect the type of JSON object created by the indexer.

## How to get started

You can start directly in your storage account portal page. Click **Add Azure Search** to launch a flow where you can select an existing Azure Search service or create a new service. If you create a new service, you are navigated out of your Storage account's portal experience. You can navigate back to the Storage portal page and re-select the **Add Azure Search** option, where you can select the existing service. 

![](./media/search-blob-storage-integration/blob-blade.png)

If you already have an existing search service in the same subscription, clicking **Add Azure Search** opens the Import data wizard so that you can immediately step through indexing, enrichment, and index definition.

You can also [create an Azure Search service](search-create-index-portal.md) and define Blob indexers that pull content from blob containers.

The following quickstarts and tutorials use Blob data:

+ [Create an AI enrichment pipeline in the portal](cognitive-search-quickstart-blob.md)
+ [Create an AI enrichment pipeline in C#](cognitive-search-tutorial-blob-dotnet.md)
+ [Index semi-structured blobs using REST APIs](search-semi-structured-data.md)

## Next steps

> [!div class="nextstepaction"]
> [Set up a blob indexer](search-howto-indexing-azure-blob-storage.md) 
