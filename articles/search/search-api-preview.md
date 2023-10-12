---
title: Preview feature list
titleSuffix: Azure Cognitive Search
description: Preview features are released so that customers can provide feedback on their design and utility. This article is a comprehensive list of all features currently in preview.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom: 
ms.topic: conceptual
ms.date: 06/29/2023
---

# Preview features in Azure Cognitive Search

This article is a complete list of all features that are in public preview. This list is helpful if you're checking feature status.

Preview functionality is provided under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), without a service level agreement, and isn't recommended for production workloads.

Preview features that transition to general availability are removed from this list. If a feature isn't listed here, you can assume it's generally available or retired. For announcements regarding general availability and retirement, see [Service Updates](https://azure.microsoft.com/updates/?product=search) or [What's New](whats-new.md).

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Category | Description | Availability  |
|---------|------------------|-------------|---------------|
| [**Vector search**](vector-search-overview.md) | Vector search | Adds vector fields to a search index for similarity search scenarios over vector representations of text, image, and multilingual content. | Public preview using the [Search REST API 2023-07-01-Preview](/rest/api/searchservice/index-preview) and Azure portal. |
| [**Search REST API 2023-07-01-Preview**](/rest/api/searchservice/index-preview) | Vector search | Modifies [Create or Update Index](/rest/api/searchservice/preview-api/create-or-update-index) to include a new data type for vector search fields. It also adds query parameters for queries composed of vector data (embeddings) | Public preview, [Search REST API 2023-07-01-Preview](/rest/api/searchservice/index-preview). Announced in June 2023.  |
|  [**Azure Files indexer**](search-file-storage-integration.md) | Indexer data source | Adds REST API support for creating indexers for [Azure Files](https://azure.microsoft.com/services/storage/files/) | Public preview, [Search REST API 2021-04-30-Preview](/rest/api/searchservice/index-preview). Announced in November 2021.  |
| [**Search REST API 2021-04-30-Preview**](/rest/api/searchservice/index-preview) | Security | Modifies [Create or Update Data Source](/rest/api/searchservice/preview-api/create-or-update-data-source) to support managed identities under Microsoft Entra ID, for indexers that connect to external data sources. | Public preview, [Search REST API 2021-04-30-Preview](/rest/api/searchservice/index-preview). Announced in May 2021.  |
| [**Management REST API 2021-04-01-Preview**](/rest/api/searchmanagement/) | Security | Modifies [Create or Update Service](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update) to support new [DataPlaneAuthOptions](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions). | Public preview, [Management REST API](/rest/api/searchmanagement/), API version 2021-04-01-Preview. Announced in May 2021. |
| [**Reset Documents**](search-howto-run-reset-indexers.md) | Indexer | Reprocesses individually selected search documents in indexer workloads. | Use the [Reset Documents REST API](/rest/api/searchservice/preview-api/reset-documents), API versions 2021-04-30-Preview or 2020-06-30-Preview. |
| [**SharePoint Indexer**](search-howto-index-sharepoint-online.md) | Indexer data source | New data source for indexer-based indexing of SharePoint content. | [Sign up](https://aka.ms/azure-cognitive-search/indexer-preview) is required so that support can be enabled for your subscription on the backend. Configure this data source using [Create or Update Data Source](/rest/api/searchservice/preview-api/create-or-update-data-source), API versions 2021-04-30-Preview or 2020-06-30-Preview, or the Azure portal. |
|  [**MySQL indexer data source**](search-howto-index-mysql.md) | Indexer data source | Index content and metadata from Azure MySQL data sources.| [Sign up](https://aka.ms/azure-cognitive-search/indexer-preview) is required so that support can be enabled for your subscription on the backend. Configure this data source using [Create or Update Data Source](/rest/api/searchservice/preview-api/create-or-update-data-source), API versions 2021-04-30-Preview or 2020-06-30-Preview, [.NET SDK 11.2.1](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourcetype.mysql), and Azure portal. |
| [**Azure Cosmos DB indexer: Azure Cosmos DB for MongoDB, Azure Cosmos DB for Apache Gremlin**](search-howto-index-cosmosdb.md) | Indexer data source | For Azure Cosmos DB, SQL API is generally available, but Azure Cosmos DB for MongoDB and Azure Cosmos DB for Apache Gremlin are in preview. | For MongoDB and Gremlin, [sign up first](https://aka.ms/azure-cognitive-search/indexer-preview) so that support can be enabled for your subscription on the backend. MongoDB data sources can be configured in the portal. Configure this data source using [Create or Update Data Source](/rest/api/searchservice/preview-api/create-or-update-data-source), API versions 2021-04-30-Preview or 2020-06-30-Preview. |
| [**Native blob soft delete**](search-howto-index-changed-deleted-blobs.md) | Indexer data source | The Azure Blob Storage indexer in Azure Cognitive Search recognizes blobs that are in a soft deleted state, and remove the corresponding search document during indexing. | Configure this data source using [Create or Update Data Source](/rest/api/searchservice/preview-api/create-or-update-data-source), API versions 2021-04-30-Preview or 2020-06-30-Preview. |
| [**speller**](cognitive-search-aml-skill.md) | Query | Optional spelling correction on query term inputs for simple, full, and semantic queries. | [Search Preview REST API](/rest/api/searchservice/preview-api/search-documents), API versions 2021-04-30-Preview or 2020-06-30-Preview, and Search Explorer (portal). |
| [**Normalizers**](search-normalizers.md) | Query |  Normalizers provide simple text preprocessing: consistent casing, accent removal, and ASCII folding, without invoking the full text analysis chain.| Use [Search Documents](/rest/api/searchservice/preview-api/search-documents), API versions 2021-04-30-Preview or 2020-06-30-Preview.|
| [**featuresMode parameter**](/rest/api/searchservice/preview-api/search-documents#query-parameters) | Relevance (scoring) | Relevance score expansion to include details: per field similarity score, per field term frequency, and per field number of unique tokens matched. You can consume these data points in [custom scoring solutions](https://github.com/Azure-Samples/search-ranking-tutorial). | Add this query parameter using [Search Documents](/rest/api/searchservice/preview-api/search-documents), API versions 2021-04-30-Preview, 2020-06-30-Preview, or 2019-05-06-Preview. |
| [**Azure Machine Learning (AML) skill**](cognitive-search-aml-skill.md) | AI enrichment (skills) | A new skill type to integrate an inferencing endpoint from Azure Machine Learning. | Use [Search Preview REST API](/rest/api/searchservice/), API versions 2021-04-30-Preview, 2020-06-30-Preview, or 2019-05-06-Preview. Also available in the portal, in skillset design, assuming Cognitive Search and Azure Machine Learning services are deployed in the same subscription. |
| [**Incremental enrichment**](cognitive-search-incremental-indexing-conceptual.md) | AI enrichment (skills) | Adds caching to an enrichment pipeline, allowing you to reuse existing output if a targeted modification, such as an update to a skillset or another object, doesn't change the content. Caching applies only to enriched documents produced by a skillset.| Add this configuration setting using [Create or Update Indexer Preview REST API](/rest/api/searchservice/create-indexer), API versions 2021-04-30-Preview, 2020-06-30-Preview, or 2019-05-06-Preview. |
| [**moreLikeThis**](search-more-like-this.md) | Query | Finds documents that are relevant to a specific document. This feature has been in earlier previews. | Add this query parameter in [Search Documents Preview REST API](/rest/api/searchservice/search-documents) calls, with API versions 2021-04-30-Preview, 2020-06-30-Preview, 2019-05-06-Preview, 2016-09-01-Preview, or 2017-11-11-Preview. |

## How to call a preview REST API

Azure Cognitive Search always prereleases experimental features through the REST API first, then through prerelease versions of the .NET SDK.

Preview features are available for testing and experimentation, with the goal of gathering feedback on feature design and implementation. For this reason, preview features can change over time, possibly in ways that break backwards compatibility. This is in contrast to features in a GA version, which are stable and unlikely to change with the exception of small backward-compatible fixes and enhancements. Also, preview features don't always make it into a GA release.

While some preview features might be available in the portal and .NET SDK, the REST API always has preview features.

+ For search operations, [**`2021-04-30-Preview`**](/rest/api/searchservice/index-preview) is the current preview version.

+ For management operations, [**`2021-04-01-Preview`**](/rest/api/searchmanagement/management-api-versions) is the current preview version.

Older previews are still operational but become stale over time. If your code calls `api-version=2019-05-06-Preview` or `api-version=2016-09-01-Preview` or `api-version=2017-11-11-Preview`, those calls are still valid, but those versions won't include new features and bug fixes aren't guaranteed.

The following example syntax illustrates a call to the preview API version.

```HTTP
POST https://[service name].search.windows.net/indexes/hotels-idx/docs/search?api-version=2021-04-30-Preview  
  Content-Type: application/json  
  api-key: [admin key]
```

Azure Cognitive Search service is available in multiple versions and client libraries. For more information, see [API versions](search-api-versions.md).

## Next steps

Review the Search REST Preview API reference documentation. If you encounter problems, ask us for help on [Stack Overflow](https://stackoverflow.com/) or [contact support](https://azure.microsoft.com/support/community/?product=search).

> [!div class="nextstepaction"]
> [Search service REST API Reference (Preview)](/rest/api/searchservice/index-preview)
