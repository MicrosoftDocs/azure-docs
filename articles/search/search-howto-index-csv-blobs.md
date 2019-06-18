---
title: Index CSV blobs with Azure Search Blob indexer - Azure Search
description: Crawl CSV blobs in Azure Blob storage for full text search using an Azure Search index. Indexers automate data ingestion for selected data sources like Azure Blob storage.

ms.date: 05/02/2019
author: mgottein 
manager: cgronlun
ms.author: magottei

services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.custom: seodec2018
---
# Indexing CSV blobs with Azure Search blob indexer

> [!Note]
> delimitedText parsing mode is in preview and not intended for production use. The [REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no .NET SDK support at this time.
>

By default, [Azure Search blob indexer](search-howto-indexing-azure-blob-storage.md) parses delimited text blobs as a single chunk of text. However, with blobs containing CSV data, you often want to treat each line in the blob as a separate document. For example, given the following delimited text, you might want to parse it into two documents, each containing "id", "datePublished", and "tags" fields: 

    id, datePublished, tags
    1, 2016-01-12, "azure-search,azure,cloud" 
    2, 2016-07-07, "cloud,mobile" 

In this article, you will learn how to parse CSV blobs with an Azure Search blob indexerby setting the `delimitedText` parsing mode. 

> [!NOTE]
> Follow the indexer configuration recommendations in [One-to-many indexing](search-howto-index-one-to-many-blobs.md) to output multiple search documents from one Azure blob.

## Setting up CSV indexing
To index CSV blobs, create or update an indexer definition with the `delimitedText` parsing mode on a [Create Indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer) request:

    {
      "name" : "my-csv-indexer",
      ... other indexer properties
      "parameters" : { "configuration" : { "parsingMode" : "delimitedText", "firstLineContainsHeaders" : true } }
    }

`firstLineContainsHeaders` indicates that the first (non-blank) line of each blob contains headers.
If blobs don't contain an initial header line, the headers should be specified in the indexer configuration: 

    "parameters" : { "configuration" : { "parsingMode" : "delimitedText", "delimitedTextHeaders" : "id,datePublished,tags" } } 

You can customize the delimiter character using the `delimitedTextDelimiter` configuration setting. For example:

    "parameters" : { "configuration" : { "parsingMode" : "delimitedText", "delimitedTextDelimiter" : "|" } }

> [!NOTE]
> Currently, only the UTF-8 encoding is supported. If you need support for other encodings, vote for it on [UserVoice](https://feedback.azure.com/forums/263029-azure-search).

> [!IMPORTANT]
> When you use the delimited text parsing mode, Azure Search assumes that all blobs in your data source will be CSV. If you need to support a mix of CSV and non-CSV blobs in the same data source, please vote for it on [UserVoice](https://feedback.azure.com/forums/263029-azure-search).
> 
> 

## Request examples
Putting this all together, here are the complete payload examples. 

Datasource: 

    POST https://[service name].search.windows.net/datasources?api-version=2019-05-06-Preview
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "my-blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
        "container" : { "name" : "my-container", "query" : "<optional, my-folder>" }
    }   

Indexer:

    POST https://[service name].search.windows.net/indexers?api-version=2019-05-06-Preview
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-csv-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "parameters" : { "configuration" : { "parsingMode" : "delimitedText", "delimitedTextHeaders" : "id,datePublished,tags" } }
    }

## Help us make Azure Search better
If you have feature requests or ideas for improvements, provide your input on [UserVoice](https://feedback.azure.com/forums/263029-azure-search/).

