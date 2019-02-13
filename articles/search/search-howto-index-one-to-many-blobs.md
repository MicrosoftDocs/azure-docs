---
title: Index blobs containing multiple search index documents from Azure Blob indexer for full text search - Azure Search
description: Crawl Azure blobs for text content using the Azure Search Blob indexer. Each blob might contain one or more azure search index documents. Indexers automate data ingestion for selected data sources like Azure Blob storage.

ms.date: 02/12/2019
author: HeidiSteen
manager: cgronlun
ms.author: heidist

services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.custom: seofeb2018
---

# Indexing blobs producing multiple search documents
By default, a blob indexer will treat the contents of a blob as a single search document. Certain **parsingMode** values support scenarios where an individual blob can result in multiple search documents. The different types of **parsingMode** that allow an indexer to extract more than one search document from a blob are:
+ `delimitedText`
+ `jsonArray`
+ `jsonLines`

> [!IMPORTANT]
> These parsing modes are in public preview and should not be used in production environments. For more information, see [REST api-version=2017-11-11-Preview](search-api-2017-11-11-preview.md). 

## One-to-many document key
Each document that shows up in an Azure search index is uniquely identified by a document key. 

When no parsing mode is specified and if there is no explicit mapping for the key field in the index Azure search automatically [maps](search-indexer-field-mappings.md) the `metadata_storage_path` property as the key. This ensures that each blob appears as a distinct search document. You can also add a custom metadata property to the blobs that can then be used as the document key.

When using any of the parsing modes listed above one blob maps to "many" search documents, making a document key solely based on blob metadata unsuitable. To overcome this constraint, Azure search is capable of generating a "one-to-many" document key for each individual entity extracted from a blob. This property is named `AzureSearch_DocumentKey` and is added to each individual entity extracted from the blob. The value of this property is guaranteed to be unique for each individual entity and therefore guarantees that they show up as separate search documents.

By default, when no explicit field mappings for the key index field are specified, the `AzureSearch_DocumentKey` is mapped to it, using the `base64Encode` field-mapping function. It is recommended that you do not attempt to modify this mapping to the key field - otherwise all entities extracted from a blob might not show up in the search index.

> [!NOTE]
> The approach used by `AzureSearch_DocumentKey` of ensuring uniqueness per extracted entity is subject to change and therefore you should not rely on it's value for your application's needs.

## See also

+ [Indexers in Azure Search](search-indexer-overview.md)
+ [Indexing Azure Blob Storage with Azure Search](search-howto-index-json-blobs.md)
+ [Indexing CSV blobs with Azure Search blob indexer](search-howto-index-csv-blobs.md)
+ [Indexing JSON blobs with Azure Search blob indexer](search-howto-index-csv-blobs.md)