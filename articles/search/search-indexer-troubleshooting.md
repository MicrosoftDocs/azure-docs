---
title: Troubleshooting common indexer issues in Azure Search | Microsoft Docs
description: Fix common problems with indexers in Azure Search
author: MatthewGotteiner
manager: cgronlun
services: search
ms.service: search
ms.devlang: na
ms.topic: conceptual
ms.date: 11/19/2018
ms.author: magottei
---

# Troubleshooting common indexer issues in Azure Search

Indexers can run into a number of issues when indexing data into Azure Search. The main categories of failure include:

* [Connecting to a data source](#Data-Source-Connection-Errors)
* [Document processing](#Document-Processing-Errors)
* [Document ingestion to an index](#Index-Errors)

## Data Source Connection Errors

If indexers cannot connect to a data source, then no documents can be ingested into an index.

### Blob Storage

#### Storage account firewall

Azure Storage provides a configurable firewall that you can use to secure your storage account to a specific set of allowed networks. By default, the firewall is disabled so Azure Search can connect to your storage account.

There is no specific error message that indicates a firewall is enabled. Typically the error message seen in the indexer is a 403 or 404:

`The remote server returned an error: (403) Forbidden`

You can verify that the firewall is enabled in the [portal](https://docs.microsoft.com/en-us/azure/storage/common/storage-network-security#azure-portal). If the firewall is enabled, you have two options for getting around this issue:

1. Disable the firewall by choosing to allow access from ['All networks'](https://docs.microsoft.com/en-us/azure/storage/common/storage-network-security#azure-portal)
1. [Add an exception](https://docs.microsoft.com/en-us/azure/storage/common/storage-network-security#managing-ip-network-rules) for the IP address of your search service. To find this IP address, use the following command:

`nslookup <service name>.search.windows.net`

Exceptions do not work for [Cognitive Search](#cognitive-search-concept-intro.md). The only workaround for Cognitive Search is to disable the firewall.

### Cosmos DB

#### Indexing is not enabled

Cosmos DB offers the ability to [manage indexing policy](https://docs.microsoft.com/en-us/azure/cosmos-db/how-to-manage-indexing-policy). By default, all items in an Azure Cosmos container are automatically indexed, but you can turn this off. When indexing is turned off, indexers will not be able to find any items in an Azure Cosmos container and immediately return with a successful state. In order to use Cosmos DB with Azure Search, [ensure that the indexing mode for your container is set to consistent.](https://docs.microsoft.com/en-us/azure/cosmos-db/how-to-manage-indexing-policy#manage-indexing-using-azure-portal)

## Document Processing Errors

Individual documents may not be able to be processed by indexers.

### Unprocessable or unsupported documents

The blob indexer [documents which document formats are explicitly supported.](search-howto-indexing-azure-blob-storage.md#supported-document-formats). Sometimes, a blob storage container will contain a mix of unsupported and supported document formats. Other times a container will have a problematic document that indexers cannot process despite being in a supported format. You can avoid stopping your indexer on these documents by [changing configuration options](search-howto-indexing-azure-blob-storage.md#dealing-with-errors):

```PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2017-11-11
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "configuration" : { "failOnUnsupportedContentType" : false, "failOnUnprocessableDocument" : false } }
}
```

### Missing document content

The blob indexer tries to [find and extract content from documents](search-howto-indexing-azure-blob-storage.md#how-azure-search-indexes-blobs). Sometimes the blob indexer cannot extract textual content from a document.

* The document only contains scanned images. For example, a PDF can contain no text and only images. Sometimes scanned images look exactly like text that can be confusing when viewing a PDF. [Cognitive Search](cognitive-search-concept-image-scenarios.md) supports extracting text from these documents.
* The document uses an unsupported font. Check the [Windows 10 font list](https://docs.microsoft.com/en-us/typography/fonts/windows_10_font_list) for a list of supported fonts.
* The blob indexer is configured to only index metadata. To extract content, the blob indexer must be configured to[] extract both content and metadata](search-howto-indexing-azure-blob-storage.md#controlling-which-parts-of-the-blob-are-indexed):

```
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2017-11-11
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "configuration" : { "dataToExtract" : "contentAndMetadata" } }
}
```

## Index Errors

### Missing documents

Indexers enumerate documents from a [data source](https://docs.microsoft.com/en-us/rest/api/searchservice/create-data-source) to find which documents need to be indexed. Sometimes a document that should have been indexed appears to be missing from an index. There are a couple of common reasons these errors may happen:

* The document you are searching for has not been indexed yet. Wait for a successful indexer run, which means all documents that the indexer has enumerated have been indexed
* The document you are searching for was updated after the indexer run. If your indexer is on a [schedule](https://docs.microsoft.com/en-us/rest/api/searchservice/create-indexer#indexer-schedule), it will eventually rerun and pick up the document.
* The [query](https://docs.microsoft.com/en-us/rest/api/searchservice/create-data-source#request-body-syntax) specified in the data source excludes the document you are searching for. Indexers cannot index documents that are not part of the data source.
* [Field mappings](https://docs.microsoft.com/en-us/rest/api/searchservice/create-indexer#fieldmappings) or [Cognitive Search](https://docs.microsoft.com/en-us/azure/search/cognitive-search-concept-intro) have changed the document you are searching for and it looks different than you expect.