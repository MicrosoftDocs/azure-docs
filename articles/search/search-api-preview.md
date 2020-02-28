---
title: Preview features in REST API
titleSuffix: Azure Cognitive Search
description: Azure Cognitive Search service REST API Version 2019-05-06-Preview includes experimental features such as knowledge store and indexer caching for incremental enrichment.

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/11/2020
---
# Preview features in Azure Cognitive Search

This article lists features currently in preview. Features that transition from preview to general availability are removed from this list. You can check [Service Updates](https://azure.microsoft.com/updates/?product=search) or [What's New](whats-new.md) for announcements regarding general availability.

While some preview features might be available in the portal and .NET SDK, the REST API always has preview features.

+ For search operations, [**`2019-05-06-Preview`**](https://docs.microsoft.com/rest/api/searchservice/index-2019-05-06-preview) is the current preview version.
+ For management operations, [**`2019-10-01-Preview`**](https://docs.microsoft.com/rest/api/searchmanagement/index-2019-10-01-preview) is the current preview version.

> [!IMPORTANT]
> Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## AI enrichment features

Explore the latest enhancements to AI enrichment through the [preview Search API](https://docs.microsoft.com/rest/api/searchservice/index-2019-05-06-preview).

|||
|-|-|
| [Custom Entity Lookup skill (preview)](cognitive-search-skill-custom-entity-lookup.md ) | A cognitive skill that looks for text from a custom, user-defined list of words and phrases. Using this list, it labels all documents with any matching entities. The skill also supports a degree of fuzzy matching that can be applied to find matches that are similar but not quite exact. | 
| [PII Detection skill (preview)](cognitive-search-skill-pii-detection.md) | A cognitive skill used during indexing that extracts personally identifiable information from an input text and gives you the option to mask it from that text in various ways.| 
| [Incremental enrichment (preview)](cognitive-search-incremental-indexing-conceptual.md) | Adds caching to an enrichment pipeline, allowing you to reuse existing output if a targeted modification, such as an update to a skillset or another object, does not change the content. Caching applies only to enriched documents produced by a skillset.| 
| [Knowledge store (preview)](knowledge-store-concept-intro.md) | A new destination of an AI-based enrichment pipeline. The physical data structure exists in Azure Blob storage and Azure Table storage, and it is created and populated when you run an indexer that has an attached cognitive skillset. The definition of a knowledge store itself is specified within a skillset definition. Within the knowledge store definition, you control the physical structures of your data through *projection* elements that determine how data is shaped, whether data is stored in Table storage or Blob storage, and whether there are multiple views.| 

## Indexing and query features

Indexer preview features are available in preview Search API. 

|||
|-|-|
| [Cosmos DB indexer](search-howto-index-cosmosdb.md) | Support for MongoDB API (preview), Gremlin API (preview), and Cassandra API (preview) API types. | 
|  [Azure Data Lake Storage Gen2 indexer (preview)](search-howto-index-azure-data-lake-storage.md) | Index content and metadata from Data Lake Storage Gen2.| 
| [moreLikeThis query parameter (preview)](search-more-like-this.md) | Finds documents that are relevant to a specific document. This feature has been in earlier previews. | 

## Management features

|||
|-|-|
| [Private Endpoint support](service-create-private-endpoint.md) | You can create a virtual network with a secure client (such as a virtual machine), and then create a search service that uses Private Endpoint. |
| IP access restriction | Using [`api-version=2019-10-01-Preview`](https://docs.microsoft.com/rest/api/searchmanagement/index-2019-10-01-preview) of the Management REST API, you can create a service that has restrictions on which IP addresses are allowed access. |

## Earlier preview features

Features announced in earlier previews, if they have not transitioned to general availability, are still in public preview. If you're calling an API with an earlier preview api-version, you can continue to use that version or switch to `2019-05-06-Preview` with no changes to expected behavior.

## How to call a preview API

Older previews are still operational but become stale over time. If your code calls `api-version=2016-09-01-Preview` or `api-version=2017-11-11-Preview`, those calls are still valid. However, only the newest preview version is refreshed with improvements. 

The following example syntax illustrates a call to the preview API version.

    GET https://[service name].search.windows.net/indexes/[index name]/docs?search=*&api-version=2019-05-06-Preview

Azure Cognitive Search service is available in multiple versions. For more information, see [API versions](search-api-versions.md).

## Next steps

Review the Search REST API reference documentation. If you encounter problems, ask us for help on [StackOverflow](https://stackoverflow.com/) or [contact support](https://azure.microsoft.com/support/community/?product=search).

> [!div class="nextstepaction"]
> [Search service REST API Reference](https://docs.microsoft.com/rest/api/searchservice/)