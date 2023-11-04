---
title: Preview feature list
titleSuffix: Azure AI Search
description: Preview features are released so that customers can provide feedback on their design and utility. This article is a comprehensive list of all features currently in preview.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom: 
ms.topic: conceptual
ms.date: 10/31/2023
---

# Preview features in Azure AI Search

This article identifies all features in public preview. This list is helpful for checking feature status.

Preview features are removed from this list if they're retired or transition to general availability. For announcements regarding general availability and retirement, see [Service Updates](https://azure.microsoft.com/updates/?product=search) or [What's New](whats-new.md).

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Category | Description | Availability  |
|---------|------------------|-------------|---------------|
|  [**Integrated vectorization**](vector-search-integrated-vectorization.md) | Index, skillset, queries | Skills-driven data chunking and vectorization during indexing, and text-to-vector conversion during query execution. | [Create or Update Index (preview)](/rest/api/searchservice/2023-10-01-preview/indexes/create-or-update) for `vectorizer`, [Create or Update Skillset (preview)](/rest/api/searchservice/2023-10-01-preview/skillsets/create-or-update) for `SplitSkill`, and [Search POST (preview)](/rest/api/searchservice/2023-10-01-preview/documents/search-post) for `vectorQueries`, 2023-10-01-Preview or later. |
|  [**Azure Files indexer**](search-file-storage-integration.md) | Indexer data source | New data source for indexer-based indexing from [Azure Files](https://azure.microsoft.com/services/storage/files/) | [Create or Update Data Source (preview)](/rest/api/searchservice/preview-api/create-or-update-data-source), 2021-04-30-Preview or later. |
| [**SharePoint Indexer**](search-howto-index-sharepoint-online.md) | Indexer data source | New data source for indexer-based indexing of SharePoint content. | [Sign up](https://aka.ms/azure-cognitive-search/indexer-preview) to enable the feature. Use [Create or Update Data Source (preview)](/rest/api/searchservice/preview-api/create-or-update-data-source), 2020-06-30-Preview or later, or the Azure portal. |
|  [**MySQL indexer**](search-howto-index-mysql.md) | Indexer data source | New data source for indexer-based indexing of Azure MySQL data sources.| [Sign up](https://aka.ms/azure-cognitive-search/indexer-preview) to enable the feature. Use [Create or Update Data Source (preview)](/rest/api/searchservice/preview-api/create-or-update-data-source), 2020-06-30-Preview or later, [.NET SDK 11.2.1](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourcetype.mysql), and Azure portal. |
| [**Azure Cosmos DB for MongoDB indexer**](search-howto-index-cosmosdb.md) | Indexer data source | New data source for indexer-based indexing through the MongoDB APIs in Azure Cosmos DB. | [Sign up](https://aka.ms/azure-cognitive-search/indexer-preview) to enable the feature. Use [Create or Update Data Source (preview)](/rest/api/searchservice/preview-api/create-or-update-data-source), 2020-06-30-Preview or later, or the Azure portal.|
| [**Azure Cosmos DB for Apache Gremlin indexer**](search-howto-index-cosmosdb.md) | Indexer data source | New data source for indexer-based indexing through the Apache Gremlin APIs in Azure Cosmos DB. | [Sign up](https://aka.ms/azure-cognitive-search/indexer-preview) to enable the feature. Use [Create or Update Data Source (preview)](/rest/api/searchservice/preview-api/create-or-update-data-source), 2020-06-30-Preview or later.|
| [**Native blob soft delete**](search-howto-index-changed-deleted-blobs.md) | Indexer data source | Applies to the Azure Blob Storage indexer. Recognizes blobs that are in a soft-deleted state, and removes the corresponding search document during indexing. | [Create or Update Data Source (preview)](/rest/api/searchservice/preview-api/create-or-update-data-source), 2020-06-30-Preview or later. |
| [**Reset Documents**](search-howto-run-reset-indexers.md) | Indexer | Reprocesses individually selected search documents in indexer workloads. | [Reset Documents (preview)](/rest/api/searchservice/preview-api/reset-documents), 2020-06-30-Preview or later. |
| [**speller**](cognitive-search-aml-skill.md) | Query | Optional spelling correction on query term inputs for simple, full, and semantic queries. | [Search Documents (preview)](/rest/api/searchservice/preview-api/search-documents), 2020-06-30-Preview or later, and Search Explorer (portal). |
| [**Normalizers**](search-normalizers.md) | Query |  Normalizers provide simple text preprocessing: consistent casing, accent removal, and ASCII folding, without invoking the full text analysis chain.| [Search Documents (preview)](/rest/api/searchservice/preview-api/search-documents), 2020-06-30-Preview or later.|
| [**featuresMode parameter**](/rest/api/searchservice/preview-api/search-documents#query-parameters) | Relevance (scoring) | Relevance score expansion to include details: per field similarity score, per field term frequency, and per field number of unique tokens matched. You can consume these data points in [custom scoring solutions](https://github.com/Azure-Samples/search-ranking-tutorial). | [Search Documents (preview)](/rest/api/searchservice/preview-api/search-documents), 2019-05-06-Preview or later.|
| [**Azure Machine Learning (AML) skill**](cognitive-search-aml-skill.md) | AI enrichment (skills) | A new skill type to integrate an inferencing endpoint from Azure Machine Learning. | [Create or Update Skillset (preview)](/rest/api/searchservice/preview-api/create-or-update-skillset), 2019-05-06-Preview or later. Also available in the portal, in skillset design, assuming Azure AI Search and Azure Machine Learning services are deployed in the same subscription. |
| [**Incremental enrichment**](cognitive-search-incremental-indexing-conceptual.md) | AI enrichment (skills) | Adds caching to an enrichment pipeline, allowing you to reuse existing output if a targeted modification, such as an update to a skillset or another object, doesn't change the content. Caching applies only to enriched documents produced by a skillset.| [Create or Update Indexer (preview)](/rest/api/searchservice/preview-api/create-or-update-indexer), API versions 2021-04-30-Preview, 2020-06-30-Preview, or 2019-05-06-Preview. |
| [**moreLikeThis**](search-more-like-this.md) | Query | Finds documents that are relevant to a specific document. This feature has been in earlier previews. | [Search Documents (preview)](/rest/api/searchservice/preview-api/search-documents) calls, in all supported API versions: 2023-10-10-Preview, 2023-07-01-Preview, 2021-04-30-Preview, 2020-06-30-Preview, 2019-05-06-Preview, 2016-09-01-Preview, 2017-11-11-Preview. |

## Using preview features

Experimental features are available through the preview REST API first, followed by Azure portal, and then the Azure SDKs. 

The following statements apply to preview features:

+ Preview features are available under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), without a service level agreement.
+ Preview features might undergo breaking changes if a redesign is required. 
+ Sometimes preview features don't make it into a GA release.

## Preview feature support in Azure SDKs

Each Azure SDK team releases beta packages on their own timeline. Check the change log for mentions of new features in beta packages:

+ [Change log for Azure SDK for .NET](https://github.com/Azure/azure-sdk-for-net/blob/Azure.Search.Documents_11.5.0-beta.5/sdk/search/Azure.Search.Documents/CHANGELOG.md)
+ [Change log for Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java/blob/azure-search-documents_11.5.11/sdk/search/azure-search-documents/CHANGELOG.md)
+ [Change log for Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/search-documents_11.3.3/sdk/search/search-documents/CHANGELOG.md)
+ [Change log for Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python/blob/azure-search-documents_11.3.0/sdk/search/azure-search-documents/CHANGELOG.md).

## How to call a preview REST API

Preview REST APIs are accessed through the api-version parameter on the URI. Older previews are still operational but become stale over time and aren't updated with new features or bug fixes.

For content operations, [**`2023-10-01-Preview`**](/rest/api/searchservice/search-service-api-versions#2023-10-01-Preview) is the most recent preview version. The following example shows the syntax for [Search POST (preview)](/rest/api/searchservice/2023-10-01-preview/documents/search-post):

```rest
GET {endpoint}/indexes('{indexName}')?api-version=2023-10-01-Preview
```

For management operations, [**`2021-04-01-Preview`**](/rest/api/searchmanagement/management-api-versions#2021-04-01-Preview) is the most recent preview version. The following example shows the syntax for Update Service 2021-04-01-preview version.

```rest
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Search/searchServices/{searchServiceName}?api-version=2021-04-01-preview
{
  "location": "{{region}}",
  "sku": {
    "name": "basic"
  },
  "properties": {
    "replicaCount": 3,
    "partitionCount": 1,
    "hostingMode": "default"
  }
}
```

## See also

+ [Quickstart: REST APIs](search-get-started-rest.md)
+ [Search REST API overview](/rest/api/searchservice/)
+ [Search REST API versions](/rest/api/searchservice/search-service-api-versions)
+ [Manage using the REST APIs](search-manage-rest.md)
+ [Management REST API overview](/rest/api/searchmanagement/)
+ [Management REST API versions](/rest/api/searchmanagement/management-api-versions)