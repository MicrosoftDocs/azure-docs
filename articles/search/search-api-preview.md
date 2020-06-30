---
title: Preview features in REST API
titleSuffix: Azure Cognitive Search
description: Preview features are released so that customers can provide feedback on its design and utility. This article is an exhaustive list of all features currently in preview.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/30/2020
---
# Preview features in Azure Cognitive Search

This article is a comprehensive list of all features that are in preview so that you can determine whether to use them in production code. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Preview features that transition to general availability are removed from this list. If a feature isn't listed below, you can assume it is generally available. For announcements regarding general availability, see [Service Updates](https://azure.microsoft.com/updates/?product=search) or [What's New](whats-new.md).

|Feature  | Category | Description | Availability  |
|---------|------------------|-------------|---------------|
| [**featuresMode parameter**](https://docs.microsoft.com/rest/api/searchservice/2019-05-06-preview/search-documents#featuresmode) | Relevance (scoring) | Relevance score expansion to include details: per field similarity score, per field term frequency, and per field number of unique tokens matched. You can consume these data points in [custom scoring solutions](https://github.com/Azure-Samples/search-ranking-tutorial). | Add this query parameter using [Search Documents (REST)](https://docs.microsoft.com/rest/api/searchservice/search-documents) with api-version=2020-06-30-Preview or 2019-05-06-Preview. |
| [**Managed service identity**](search-howto-managed-identities-data-sources.md) | Indexers, security| Register a search service with Azure Active Directory to make it a trusted service, and then use RBAC permissions on Azure data sources to allow read-only access by an indexer. | Access this capability when using the portal or [Create Data Source (REST)](https://docs.microsoft.com/rest/api/searchservice/create-datasource) with api-version=2020-06-30-Preview or api-version=2019-05-06-Preview. |
| [**Debug Sessions**](cognitive-search-debug-session.md) | Portal, AI enrichment (skillset) | An in-session skillset editor used to investigate and resolve issues with a skillset. Fixes applied during a debug session can be saved to a skillset in the service. | Portal only, using mid-page links on the Overview page to open a debug session. |
| [**Native blob soft delete**](search-howto-indexing-azure-blob-storage.md#incremental-indexing-and-deletion-detection) | Indexers, Azure blobs| The Azure Blob Storage indexer in Azure Cognitive Search will recognize blobs that are in a soft deleted state, and remove the corresponding search document during indexing. | Add this configuration setting using [Create Indexer (REST)](https://docs.microsoft.com/rest/api/searchservice/create-indexer) with api-version=2020-06-30-Preview or api-version=2019-05-06-Preview. |
| [**Custom Entity Lookup skill**](cognitive-search-skill-custom-entity-lookup.md ) | AI enrichment (skillset) | A cognitive skill that looks for text from a custom, user-defined list of words and phrases. Using this list, it labels all documents with any matching entities. The skill also supports a degree of fuzzy matching that can be applied to find matches that are similar but not quite exact. | Reference this preview skill using the Skillset editor in the portal or [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset) with api-version=2020-06-30-Preview or api-version=2019-05-06-Preview. |
| [**PII Detection skill**](cognitive-search-skill-pii-detection.md) | AI enrichment (skillset) | A cognitive skill used during indexing that extracts personally identifiable information from an input text and gives you the option to mask it from that text in various ways. | Reference this preview skill using the Skillset editor in the portal or [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset) with api-version=2020-06-30-Preview or api-version=2019-05-06-Preview. |
| [**Incremental enrichment**](cognitive-search-incremental-indexing-conceptual.md) | Indexer configuration| Adds caching to an enrichment pipeline, allowing you to reuse existing output if a targeted modification, such as an update to a skillset or another object, does not change the content. Caching applies only to enriched documents produced by a skillset.| Add this configuration setting using [Create Indexer (REST)](https://docs.microsoft.com/rest/api/searchservice/create-indexer) with api-version=2020-06-30-Preview or api-version=2019-05-06-Preview. |
| [**Cosmos DB indexer: MongoDB API, Gremlin API, Cassandra API**](search-howto-index-cosmosdb.md) | Indexer data source | For Cosmos DB, SQL API is generally available, but MongoDB, Gremlin, and Cassandra APIs are in preview. | For Gremlin and Cassandra only, [sign up first](https://aka.ms/azure-cognitive-search/indexer-preview) so that support can be enabled for your subscription on the backend. MongoDB data sources can be configured in the portal. Otherwise, data source configuration for all three APIs is supported using [Create Data Source (REST)](https://docs.microsoft.com/rest/api/searchservice/create-datasource) with api-version=2020-06-30-Preview or api-version=2019-05-06-Preview. |
|  [**Azure Data Lake Storage Gen2 indexer**](search-howto-index-azure-data-lake-storage.md) | Indexer data source | Index content and metadata from Data Lake Storage Gen2.| [Sign up](https://aka.ms/azure-cognitive-search/indexer-preview) is required so that support can be enabled for your subscription on the backend. Access this data source using [Create Data Source (REST)](https://docs.microsoft.com/rest/api/searchservice/create-datasource) with api-version=2020-06-30-Preview or api-version=2019-05-06-Preview. |
| [**moreLikeThis query parameter**](search-more-like-this.md) | Query | Finds documents that are relevant to a specific document. This feature has been in earlier previews. | Add this query parameter in [Search Documents (REST)](https://docs.microsoft.com/rest/api/searchservice/search-documents) calls with api-version=2020-06-30-Preview, 2019-05-06-Preview, 2016-09-01-Preview, or 2017-11-11-Preview. |

## Calling preview REST APIs

Azure Cognitive Search always pre-releases experimental features through the REST API first, then through prerelease versions of the .NET SDK.

Preview features are available for testing and experimentation, with the goal of gathering feedback on feature design and implementation. For this reason, preview features can change over time, possibly in ways that break backwards compatibility. This is in contrast to features in a GA version, which are stable and unlikely to change with the exception of small backward-compatible fixes and enhancements. Also, preview features do not always make it into a GA release.

While some preview features might be available in the portal and .NET SDK, the REST API always has preview features.

+ For search operations, [**`2020-06-30-Preview`**](https://docs.microsoft.com/rest/api/searchservice/index-preview) is the current preview version.

+ For management operations, [**`2019-10-01-Preview`**](https://docs.microsoft.com/rest/api/searchmanagement/index-2019-10-01-preview) is the current preview version.

Older previews are still operational but become stale over time. If your code calls `api-version=2019-05-06-Preview` or `api-version=2016-09-01-Preview` or `api-version=2017-11-11-Preview`, those calls are still valid. However, only the newest preview version is refreshed with improvements. 

The following example syntax illustrates a call to the preview API version.

    GET https://[service name].search.windows.net/indexes/[index name]/docs?search=*&api-version=2020-06-30-Preview

Azure Cognitive Search service is available in multiple versions. For more information, see [API versions](search-api-versions.md).

## Next steps

Review the Search REST Preview API reference documentation. If you encounter problems, ask us for help on [Stack Overflow](https://stackoverflow.com/) or [contact support](https://azure.microsoft.com/support/community/?product=search).

> [!div class="nextstepaction"]
> [Search service REST API Reference (Preview)](https://docs.microsoft.com/rest/api/searchservice/index-preview)