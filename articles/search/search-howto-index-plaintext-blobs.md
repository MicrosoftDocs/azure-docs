---
title: Search over plain text blobs
titleSuffix: Azure Cognitive Search
description: Configure a search indexer to extract plain text from Azure blobs for full text search in Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/01/2021
---

# How to index plain text blobs in Azure Cognitive Search

When using a [blob indexer](search-howto-indexing-azure-blob-storage.md) to extract searchable text for full text search, you can invoke various parsing modes to get better indexing outcomes. By default, the indexer parses blob content as a single chunk of text. However, if all blobs contain plain text in the same encoding, you can significantly improve indexing performance by using the `text` parsing mode.

You should use the `text` parsing mode when:

+ File type is .txt
+ Files are of any type, but the content itself is text (for example, program source code, HTML, XML, and so forth). For files in a mark up language, any syntax characters will come through as static text.

Recall that indexers serialize to JSON. The contents of the entire text file will be indexed within a one large field as `"content": "<file-contents>"`. New line and return instructions are expressed as `\r\n\`.

If you want a more granular outcome, consider the following solutions:

+ [`delimitedText`](search-howto-index-csv-blobs.md) parsing mode, if the source is CSV
+ [`jsonArray` or `jsonLines`](search-howto-index-json-blobs.md), if the source is JSON

A third option for breaking content in multiple parts requires advanced features in the form of [AI enrichment](cognitive-search-concept-intro.md). It adds analysis that identifies and assigns chunks of the file to different search fields. You might find a full or partial solution through [built-in skills](cognitive-search-predefined-skills.md), but a more likely solution would be  learning model that understands your content, articulated in custom learning model, wrapped in a [custom skill](cognitive-search-custom-skill-interface.md).

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

## Next steps

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [How to configure a blob indexer](search-howto-indexing-azure-blob-storage.md)
+ [Blob indexing overview](search-blob-storage-integration.md)