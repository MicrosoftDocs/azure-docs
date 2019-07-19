---
title: Troubleshoot common search indexer issues - Azure Search
description: Fix errors and common problems with indexers in Azure Search, including data source connection, firewall, and missing documents.
author: mgottein
manager: cgronlun
services: search
ms.service: search
ms.devlang: na
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: magottei
ms.custom: seodec2018
---

# Troubleshooting common indexer issues in Azure Search

Indexers can run into a number of issues when indexing data into Azure Search. The main categories of failure include:

* [Connecting to a data source](#data-source-connection-errors)
* [Document processing](#document-processing-errors)
* [Document ingestion to an index](#index-errors)

## Data Source Connection Errors

### Blob Storage

#### Storage account firewall

Azure Storage provides a configurable firewall. By default, the firewall is disabled so Azure Search can connect to your storage account.

There's no specific error message when the firewall is enabled. Typically, firewall errors look like `The remote server returned an error: (403) Forbidden`.

You can verify that the firewall is enabled in the [portal](https://docs.microsoft.com/azure/storage/common/storage-network-security#azure-portal). The only supported workaround is to disable the firewall by choosing to allow access from ['All networks'](https://docs.microsoft.com/azure/storage/common/storage-network-security#azure-portal).

If your indexer does not have an attached skillset, you _may_ attempt to [add an exception](https://docs.microsoft.com/azure/storage/common/storage-network-security#managing-ip-network-rules) for the IP addresses of your search service. However, this scenario is not supported and is not guaranteed to work.

You can find out the IP address of your search service by pinging its FQDN (`<your-search-service-name>.search.windows.net`).

### Cosmos DB

#### Indexing isn't enabled

Azure Search has an implicit dependency on Cosmos DB indexing. If you turn off automatic indexing in Cosmos DB, Azure Search returns a successful state, but fails to index container contents. For instructions on how to check settings and turn on indexing, see [Manage indexing in Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/how-to-manage-indexing-policy#use-the-azure-portal).

## Document Processing Errors

### Unprocessable or unsupported documents

The blob indexer [documents which document formats are explicitly supported.](search-howto-indexing-azure-blob-storage.md#supported-document-formats). Sometimes, a blob storage container contains unsupported documents. Other times there may be problematic documents. You can avoid stopping your indexer on these documents by [changing configuration options](search-howto-indexing-azure-blob-storage.md#dealing-with-errors):

```
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2019-05-06
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "configuration" : { "failOnUnsupportedContentType" : false, "failOnUnprocessableDocument" : false } }
}
```

### Missing document content

The blob indexer [finds and extracts text from blobs in a container](search-howto-indexing-azure-blob-storage.md#how-azure-search-indexes-blobs). Some problems with extracting text include:

* The document only contains scanned images. PDF blobs that have non-text content, such as scanned images (JPGs), don't produce results in a standard blob indexing pipeline. If you have image content with text elements, you can use [cognitive search](cognitive-search-concept-image-scenarios.md) to find and extract the text.
* The blob indexer is configured to only index metadata. To extract content, the blob indexer must be configured to [extract both content and metadata](search-howto-indexing-azure-blob-storage.md#controlling-which-parts-of-the-blob-are-indexed):

```
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2019-05-06
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "configuration" : { "dataToExtract" : "contentAndMetadata" } }
}
```

## Index Errors

### Missing documents

Indexers find documents from a [data source](https://docs.microsoft.com/rest/api/searchservice/create-data-source). Sometimes a document from the data source that should have been indexed appears to be missing from an index. There are a couple of common reasons these errors may happen:

* The document hasn't been indexed. Check the portal for a successful indexer run.
* The document was updated after the indexer run. If your indexer is on a [schedule](https://docs.microsoft.com/rest/api/searchservice/create-indexer#indexer-schedule), it will eventually rerun and pick up the document.
* The [query](https://docs.microsoft.com/rest/api/searchservice/create-data-source#request-body-syntax) specified in the data source excludes the document. Indexers can't index documents that aren't part of the data source.
* [Field mappings](https://docs.microsoft.com/rest/api/searchservice/create-indexer#fieldmappings) or [cognitive search](https://docs.microsoft.com/azure/search/cognitive-search-concept-intro) have changed the document and it looks different than you expect.
* Use the [lookup document API](https://docs.microsoft.com/rest/api/searchservice/lookup-document) to find your document.
