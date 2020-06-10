---
title: Add full text search to Azure Blob Storage
titleSuffix: Azure Cognitive Search
description: Extract content and add structure to Azure blobs when building a full text search index in Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Add full text search to Azure blob data using Azure Cognitive Search

Searching across the variety of content types stored in Azure Blob storage can be a difficult problem to solve. However, you can index and search the content of your Blobs in just a few clicks by using [Azure Cognitive Search](search-what-is-azure-search.md). Azure Cognitive Search has built-in integration for indexing out of Blob storage through a [*Blob indexer*](search-howto-indexing-azure-blob-storage.md) that adds data-source-aware capabilities to indexing.

## What it means to add full text search to blob data

Azure Cognitive Search is a cloud search service that provides indexing and query engines that operate over user-defined indexes hosted on your search service. Co-locating your searchable content with the query engine in the cloud is necessary for performance, returning results at a speed users have come to expect from search queries.

Azure Cognitive Search integrates with Azure Blob storage at the indexing layer, importing your blob content as search documents that are indexed into *inverted indexes* and other query structures that support free form text queries and filter expressions. Because your blob content is indexed into a search index, access to blob content can leverage the full range of query features in Azure Cognitive Search.

Once the index is created and populated, it exists independently of your blob container, but you can re-rerun indexing operations to refresh your index with changes to the underlying container. Timestamp information on individual blobs is used for change detection. You can opt for either scheduled execution or on-demand indexing as the refresh mechanism.

Inputs are your blobs, in a single container, in Azure Blob storage. Blobs can be almost any kind of text data. If your blobs contain images, you can add [AI enrichment to blob indexing ](search-blob-ai-integration.md) to create and extract text from images.

Output is always an Azure Cognitive Search index, used for fast text search, retrieval, and exploration in client applications. In between is the indexing pipeline architecture itself. The pipeline is based on the *indexer* feature, discussed further on in this article.

## Start with services

You need Azure Cognitive Search and Azure Blob storage. Within Blob storage, you need a container that provides source content.

You can start directly in your Storage account portal page. In the left navigation page, under **Blob service** click **Add Azure Cognitive Search** to create a new service or select an existing one. 

Once you add Azure Cognitive Search to your storage account, you can follow the standard process to index blob data. We recommend the **Import data** wizard in Azure Cognitive Search for an easy initial introduction, or call the REST APIs using a tool like Postman. This tutorial walks you through the steps of calling the REST API in Postman: [Index and search semi-structured data (JSON blobs) in Azure Cognitive Search](search-semi-structured-data.md). 

## Use a Blob indexer

An *indexer* is a data-source-aware subservice equipped with internal logic for sampling data, reading metadata data, retrieving data, and serializing data from native formats into JSON documents for subsequent import. 

Blobs in Azure Storage are indexed using the [Azure Cognitive Search Blob storage indexer](search-howto-indexing-azure-blob-storage.md). You can invoke this indexer by using the **Import data** wizard, a REST API, or the .NET SDK. In code, you use this indexer by setting the type, and by providing connection information that includes an Azure Storage account along with a blob container. You can subset your blobs by creating a virtual directory, which you can then pass as a parameter, or by filtering on a file type extension.

An indexer does the "document cracking", opening a blob to inspect content. After connecting to the data source, it's the first step in the pipeline. For blob data, this is where PDF, office docs, and other content types are detected. Document cracking with text extraction is no charge. If your blobs contain image content, images are ignored unless you [add AI enrichment](search-blob-ai-integration.md). Standard indexing applies to text content only.

The Blob indexer comes with configuration parameters and supports change tracking if the underlying data provides sufficient information. You can learn more about the core functionality in [Azure Cognitive Search Blob storage indexer](search-howto-indexing-azure-blob-storage.md).

### Supported content types

By running a Blob indexer over a container, you can extract text and metadata from the following content types with a single query:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

### Indexing blob metadata

A common scenario that makes it easy to sort through blobs of any content type is to index both custom metadata and system properties for each blob. In this way, information for all blobs is indexed regardless of document type, stored in an index in your search service. Using your new index, you can then proceed to sort, filter, and facet across all Blob storage content.

> [!NOTE]
> Blob Index tags are natively indexed by the Blob storage service and exposed for querying. If your blobs' key/value attributes require indexing and filtering capabilities, Blob Index tags should be leveraged instead of metadata.
>
> To learn more about Blob Index, see [Manage and find data on Azure Blob Storage with Blob Index](../storage/blobs/storage-manage-find-blobs.md).

### Indexing JSON blobs
Indexers can be configured to extract structured content found in blobs that contain JSON. An indexer can read JSON blobs and parse the structured content into the appropriate fields of a search document. Indexers can also take blobs that contain an array of JSON objects and map each element to a separate search document. You can set a parsing mode to affect the type of JSON object created by the indexer.

## Search blob content in a search index 

The output of an indexing is a search index, used for interactive exploration using free text and filtered queries in a client app. For initial exploration and verification of content, we recommend starting with [Search Explorer](search-explorer.md) in the portal to examine document structure. You can use [simple query syntax](query-simple-syntax.md), [full query syntax](query-lucene-syntax.md), and [filter expression syntax](query-odata-filter-orderby-syntax.md) in Search explorer.

A more permanent solution is to gather query inputs and present the response as search results in a client application. The following C# tutorial explains how to build a search application: [Create your first application in Azure Cognitive Search](tutorial-csharp-create-first-app.md).

## Next steps

+ [Upload, download, and list blobs with the Azure portal (Azure Blob storage)](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal)
+ [Set up a blob indexer (Azure Cognitive Search)](search-howto-indexing-azure-blob-storage.md) 
