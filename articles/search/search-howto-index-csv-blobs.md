---
title: Indexing CSV blobs with Azure Search blob indexer | Microsoft Docs
description: Learn how to index CSV blobs with Azure Search
author: chaosrealm
manager: jlembicz
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 12/28/2017
ms.author: eugenesh

---
# Indexing CSV blobs with Azure Search blob indexer
By default, [Azure Search blob indexer](search-howto-indexing-azure-blob-storage.md) parses delimited text blobs as a single chunk of text. However, with blobs containing CSV data, you often want to treat each line in the blob as a separate document. For example, given the following delimited text, you might want to parse it into two documents, each containing "id", "datePublished", and "tags" fields: 

    id, datePublished, tags
    1, 2016-01-12, "azure-search,azure,cloud" 
    2, 2016-07-07, "cloud,mobile" 

In this article, you will learn how to parse CSV blobs with an Azure Search blob indexer. 

> [!IMPORTANT]
> This functionality is currently in public preview and should not be used in production environments. For more information, see [REST api-version=2017-11-11-Preview](search-api-2017-11-11-preview.md). 
> 

## Setting up CSV indexing
To index CSV blobs, create or update an indexer definition with the `delimitedText` parsing mode:  

    {
      "name" : "my-csv-indexer",
      ... other indexer properties
      "parameters" : { "configuration" : { "parsingMode" : "delimitedText", "firstLineContainsHeaders" : true } }
    }

For more details on the Create Indexer API, check out [Create Indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer).

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

    POST https://[service name].search.windows.net/datasources?api-version=2017-11-11-Preview
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "my-blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
        "container" : { "name" : "my-container", "query" : "<optional, my-folder>" }
    }   

Indexer:

    POST https://[service name].search.windows.net/indexers?api-version=2017-11-11-Preview
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

