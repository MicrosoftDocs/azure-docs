---
title: Search over plain text blobs
titleSuffix: Azure Cognitive Search
description: Configure a search indexer to extract plain text from Azure blobs for full text search in Azure Cognitive Search.

manager: nitinme
author: mgottein 
ms.author: magottei
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/25/2020
---

# How to index plain text blobs in Azure Cognitive Search

When using a [blob indexer](search-howto-indexing-azure-blob-storage.md) to extract searchable text for full text search, you can invoke various parsing modes to get better indexing outcomes. By default, the indexer parses delimited text blobs as a single chunk of text. However, if all your blobs contain plain text in the same encoding, you can significantly improve indexing performance by using **text parsing mode**.

## Set up plain text indexing

To index plain text blobs, create or update an indexer definition with the `parsingMode` configuration property to `text` on a [Create Indexer](/rest/api/searchservice/create-indexer) request:

```http
    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin key]

    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "parsingMode" : "text" } }
    }
```

By default, the `UTF-8` encoding is assumed. To specify a different encoding, use the `encoding` configuration property: 

```http
    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "parsingMode" : "text", "encoding" : "windows-1252" } }
    }
```

## Request example

Parsing modes are specified in the indexer definition.

```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-plaintext-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "parameters" : { "configuration" : { "parsingMode" : "delimitedText", "delimitedTextHeaders" : "id,datePublished,tags" } }
    }
```

## Help us make Azure Cognitive Search better

If you have feature requests or ideas for improvements, provide your input on [UserVoice](https://feedback.azure.com/forums/263029-azure-search/). If you need help using the existing feature, post your question on [Stack Overflow](https://stackoverflow.microsoft.com/questions/tagged/18870).

## Next steps

* [Indexers in Azure Cognitive Search](search-indexer-overview.md)
* [How to configure a blob indexer](search-howto-indexing-azure-blob-storage.md)
* [Blob indexing overview](search-blob-storage-integration.md)