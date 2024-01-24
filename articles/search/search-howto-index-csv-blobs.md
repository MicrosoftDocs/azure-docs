---
title: Search over CSV blobs
titleSuffix: Azure AI Search
description: Extract CSV blobs from Azure Blob Storage and import as search documents into Azure AI Search using the delimitedText parsing mode.

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/17/2024
---

# Index CSV blobs and files using delimitedText parsing mode

**Applies to**: [Blob indexers](search-howto-indexing-azure-blob-storage.md), [File indexers](search-file-storage-integration.md)

In Azure AI Search, both blob indexers and file indexers support a `delimitedText` parsing mode for CSV files that treats each line in the CSV as a separate search document. For example, given the following comma-delimited text, the `delimitedText` parsing mode would result in two documents in the search index: 

```text
id, datePublished, tags
1, 2016-01-12, "azure-search,azure,cloud"
2, 2016-07-07, "cloud,mobile"
```

Without the `delimitedText` parsing mode, the entire contents of the CSV file would be treated as one search document.

Whenever you're creating multiple search documents from a single blob, be sure to review [Indexing blobs to produce multiple search documents](search-howto-index-one-to-many-blobs.md) to understand how document key assignments work. The blob indexer is capable of finding or generating values that uniquely define each new document. Specifically, it can create a transitory `AzureSearch_DocumentKey` that generated when a blob is parsed into smaller parts, where the value is then used as the search document's key in the index.

## Setting up CSV indexing

To index CSV blobs, create or update an indexer definition with the `delimitedText` parsing mode on a [Create Indexer](/rest/api/searchservice/indexers/create) request.

Only UTF-8 encoding is supported.

```http
{
  "name" : "my-csv-indexer",
  ... other indexer properties
  "parameters" : { "configuration" : { "parsingMode" : "delimitedText", "firstLineContainsHeaders" : true } }
}
```

`firstLineContainsHeaders` indicates that the first (nonblank) line of each blob contains headers.
If blobs don't contain an initial header line, the headers should be specified in the indexer configuration: 

```http
"parameters" : { "configuration" : { "parsingMode" : "delimitedText", "delimitedTextHeaders" : "id,datePublished,tags" } } 
```

You can customize the delimiter character using the `delimitedTextDelimiter` configuration setting. For example:

```http
"parameters" : { "configuration" : { "parsingMode" : "delimitedText", "delimitedTextDelimiter" : "|" } }
```

> [!NOTE]
> In delimited text parsing mode, Azure AI Search assumes that all blobs are CSV. If you have a mix of CSV and non-CSV blobs in the same data source, consider using [file extension filters](search-blob-storage-integration.md#controlling-which-blobs-are-indexed) to control which files are imported on each indexer run.

## Request examples

Putting it all together, here are the complete payload examples. 

Datasource: 

```http
POST https://[service name].search.windows.net/datasources?api-version=2023-11-01
Content-Type: application/json
api-key: [admin key]
{
    "name" : "my-blob-datasource",
    "type" : "azureblob",
    "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
    "container" : { "name" : "my-container", "query" : "<optional, my-folder>" }
}   
```

Indexer:

```http
POST https://[service name].search.windows.net/indexers?api-version=2023-11-01
Content-Type: application/json
api-key: [admin key]
{
  "name" : "my-csv-indexer",
  "dataSourceName" : "my-blob-datasource",
  "targetIndexName" : "my-target-index",
  "parameters" : { "configuration" : { "parsingMode" : "delimitedText", "delimitedTextHeaders" : "id,datePublished,tags" } }
}
```

## See also

+ [Index data from Blob Storage](search-howto-indexing-azure-blob-storage.md)
+ [Index data from File Storage](search-file-storage-integration.md)
