---
title: Search over plain text blobs
titleSuffix: Azure AI Search
description: Configure a search indexer to extract plain text from Azure blobs for full text search in Azure AI Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 09/13/2022
---

# How to index plain text blobs and files in Azure AI Search

**Applies to**: [Blob indexers](search-howto-indexing-azure-blob-storage.md), [File indexers](search-file-storage-integration.md)

When using an indexer to extract searchable blob text or file content for full text search, you can assign a parsing mode to get better indexing outcomes. By default, the indexer parses the content as a single chunk of text. However, if all blobs and files contain plain text in the same encoding, you can significantly improve indexing performance by using the `text` parsing mode.

Recommendations for use `text` parsing include:

+ File type is .txt
+ Files are of any type, but the content itself is text (for example, program source code, HTML, XML, and so forth). For files in a mark up language, any syntax characters will come through as static text.

Recall that all indexers serialize to JSON. By default, the contents of the entire text file will be indexed within one large field as `"content": "<file-contents>"`. Any new line and return instructions are embedded in the content field and expressed as `\r\n\`.

If you want a more granular outcome, and if the file type is compatible, consider the following solutions:

+ [`delimitedText`](search-howto-index-csv-blobs.md) parsing mode, if the source is CSV
+ [`jsonArray` or `jsonLines`](search-howto-index-json-blobs.md), if the source is JSON

A third option for breaking content into multiple parts requires advanced features in the form of [AI enrichment](cognitive-search-concept-intro.md). It adds analysis that identifies and assigns chunks of the file to different search fields. You might find a full or partial solution through [built-in skills](cognitive-search-predefined-skills.md), but a more likely solution would be  learning model that understands your content, articulated in custom learning model, wrapped in a [custom skill](cognitive-search-custom-skill-interface.md).

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

+ [Indexers in Azure AI Search](search-indexer-overview.md)
+ [How to configure a blob indexer](search-howto-indexing-azure-blob-storage.md)
+ [Blob indexing overview](search-blob-storage-integration.md)
