---
title: Search over CSV blobs 
titleSuffix: Azure Cognitive Search
description: Extract and import CSV from Azure Blob Storage using the delimitedText parsing mode.

manager: nitinme
author: HeidiSteen 
ms.author: heidist

ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/01/2021
---

# How to index CSV blobs using delimitedText parsing mode and Blob indexers in Azure Cognitive Search

The Azure Cognitive Search [blob indexer](search-howto-indexing-azure-blob-storage.md) provides a `delimitedText` parsing mode for CSV files that treats each line in the CSV as a separate search document. For example, given the following comma-delimited text, `delimitedText` would result in two documents in the search index: 

```text
id, datePublished, tags
1, 2016-01-12, "azure-search,azure,cloud"
2, 2016-07-07, "cloud,mobile"
```

Without the `delimitedText` parsing mode, the entire contents of the CSV file would be treated as one search document.

Whenever you are creating multiple search documents from a single blob, be sure to review [Indexing blobs to produce multiple search documents](search-howto-index-one-to-many-blobs.md) to understand how document key assignments work. The blob indexer is capable of finding or generating values that uniquely define each new document. Specifically, it can create a transitory `AzureSearch_DocumentKey` that generated when a blob is parsed into smaller parts, where the value is then used as the search document's key in the index.

## Setting up CSV indexing

To index CSV blobs, create or update an indexer definition with the `delimitedText` parsing mode on a [Create Indexer](/rest/api/searchservice/create-indexer) request:

```http
{
  "name" : "my-csv-indexer",
  ... other indexer properties
  "parameters" : { "configuration" : { "parsingMode" : "delimitedText", "firstLineContainsHeaders" : true } }
}
```

`firstLineContainsHeaders` indicates that the first (non-blank) line of each blob contains headers.
If blobs don't contain an initial header line, the headers should be specified in the indexer configuration: 

```http
"parameters" : { "configuration" : { "parsingMode" : "delimitedText", "delimitedTextHeaders" : "id,datePublished,tags" } } 
```

You can customize the delimiter character using the `delimitedTextDelimiter` configuration setting. For example:

```http
"parameters" : { "configuration" : { "parsingMode" : "delimitedText", "delimitedTextDelimiter" : "|" } }
```

> [!NOTE]
> Currently, only the UTF-8 encoding is supported. If you need support for other encodings, vote for it on [UserVoice](https://feedback.azure.com/forums/263029-azure-search).

> [!IMPORTANT]
> When you use the delimited text parsing mode, Azure Cognitive Search assumes that all blobs in your data source will be CSV. If you need to support a mix of CSV and non-CSV blobs in the same data source, please vote for it on [UserVoice](https://feedback.azure.com/forums/263029-azure-search).
>

## Request examples

Putting this all together, here are the complete payload examples. 

Datasource: 

```http
POST https://[service name].search.windows.net/datasources?api-version=2020-06-30
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
POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
  "name" : "my-csv-indexer",
  "dataSourceName" : "my-blob-datasource",
  "targetIndexName" : "my-target-index",
  "parameters" : { "configuration" : { "parsingMode" : "delimitedText", "delimitedTextHeaders" : "id,datePublished,tags" } }
}
```


