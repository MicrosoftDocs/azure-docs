---
title: Troubleshoot common search indexer issues
titleSuffix: Azure Cognitive Search
description: Fix errors and common problems with indexers in Azure Cognitive Search, including data source connection, firewall, and missing documents.

manager: nitinme
author: mgottein
ms.author: magottei
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Troubleshooting common indexer issues in Azure Cognitive Search

Indexers can run into a number of issues when indexing data into Azure Cognitive Search. The main categories of failure include:

* [Connecting to a data source or other resources](#connection-errors)
* [Document processing](#document-processing-errors)
* [Document ingestion to an index](#index-errors)

## Connection errors

> [!NOTE]
> Indexers have limited support for accessing data sources and other resources that are secured by Azure network security mechanisms. Currently, indexers can only access data sources via corresponding IP address range restriction mechanisms or NSG rules when applicable. Details for accessing each supported data source can be found below.
>
> You can find out the IP address of your search service by pinging its fully qualified domain name (eg., `<your-search-service-name>.search.windows.net`).
>
> You can find out the IP address range of `AzureCognitiveSearch` [service tag](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags) by either using [Downloadable JSON files](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#discover-service-tags-by-using-downloadable-json-files) or via the [Service Tag Discovery API](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#use-the-service-tag-discovery-api-public-preview). The IP address range is updated weekly.

### Configure firewall rules

Azure Storage, CosmosDB and Azure SQL provide a configurable firewall. There's no specific error message when the firewall is enabled. Typically, firewall errors are generic and look like `The remote server returned an error: (403) Forbidden` or `Credentials provided in the connection string are invalid or have expired`.

There are 2 options for allowing indexers to access these resources in such an instance:

* Disable the firewall, by allowing access from **All Networks** (if feasible).
* Alternatively, you can allow access for the IP address of your search service and the IP address range of `AzureCognitiveSearch` [service tag](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags) in the firewall rules of your resource (IP address range restriction).

Details for configuring IP address range restrictions for each data source type can be found from the following links:

* [Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-network-security#grant-access-from-an-internet-ip-range)

* [Cosmos DB](https://docs.microsoft.com/azure/storage/common/storage-network-security#grant-access-from-an-internet-ip-range)

* [Azure SQL](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure#create-and-manage-ip-firewall-rules)

**Limitation**: As stated in the documentation above for Azure Storage, IP address range restrictions will only work if your search service and your storage account are in different regions.

Azure functions (that could be used as a [Custom Web Api skill](cognitive-search-custom-skill-web-api.md)) also support [IP address restrictions](https://docs.microsoft.com/azure/azure-functions/ip-addresses#ip-address-restrictions). The list of IP addresses to configure would be the IP address of your search service and the IP address range of `AzureCognitiveSearch` service tag.

Details for accessing data in SQL server on an Azure VM are outlined [here](search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md)

### Configure network security group (NSG) rules

When accessing data in a SQL managed instance, or when an Azure VM is used as the web service URI for a [Custom Web Api skill](cognitive-search-custom-skill-web-api.md), customers need not be concerned with specific IP addresses.

In such cases, the Azure VM, or the SQL managed instance can be configured to reside within a virtual network. Then a network security group can be configured to filter the type of network traffic that can flow in and out of the virtual network subnets and network interfaces.

The `AzureCognitiveSearch` service tag can be directly used in the inbound [NSG rules](https://docs.microsoft.com/azure/virtual-network/manage-network-security-group#work-with-security-rules) without needing to look up its IP address range.

More details for accessing data in a SQL managed instance are outlined [here](search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers.md)

### CosmosDB "Indexing" isn't enabled

Azure Cognitive Search has an implicit dependency on Cosmos DB indexing. If you turn off automatic indexing in Cosmos DB, Azure Cognitive Search returns a successful state, but fails to index container contents. For instructions on how to check settings and turn on indexing, see [Manage indexing in Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/how-to-manage-indexing-policy#use-the-azure-portal).

## Document processing errors

### Unprocessable or unsupported documents

The blob indexer [documents which document formats are explicitly supported.](search-howto-indexing-azure-blob-storage.md#SupportedFormats). Sometimes, a blob storage container contains unsupported documents. Other times there may be problematic documents. You can avoid stopping your indexer on these documents by [changing configuration options](search-howto-indexing-azure-blob-storage.md#DealingWithErrors):

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

## Index errors

### Missing documents

Indexers find documents from a [data source](https://docs.microsoft.com/rest/api/searchservice/create-data-source). Sometimes a document from the data source that should have been indexed appears to be missing from an index. There are a couple of common reasons these errors may happen:

* The document hasn't been indexed. Check the portal for a successful indexer run.
* The document was updated after the indexer run. If your indexer is on a [schedule](https://docs.microsoft.com/rest/api/searchservice/create-indexer#indexer-schedule), it will eventually rerun and pick up the document.
* The [query](https://docs.microsoft.com/rest/api/searchservice/create-data-source#request-body-syntax) specified in the data source excludes the document. Indexers can't index documents that aren't part of the data source.
* [Field mappings](https://docs.microsoft.com/rest/api/searchservice/create-indexer#fieldmappings) or [AI enrichment](https://docs.microsoft.com/azure/search/cognitive-search-concept-intro) have changed the document and it looks different than you expect.
* Use the [lookup document API](https://docs.microsoft.com/rest/api/searchservice/lookup-document) to find your document.
