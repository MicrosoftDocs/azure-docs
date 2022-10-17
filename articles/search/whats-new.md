---
title: What's new in Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: overview
ms.date: 10/12/2022
ms.custom: references_regions 
---

# What's new in Azure Cognitive Search

Learn about the latest updates to Azure Cognitive Search functionality.

> [!NOTE]
> Looking for preview feature status? Preview features are announced in this what's new article, but we also maintain a [preview features list](search-api-preview.md) so that you can find them all in one place.

## June 2022

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------------|--------------|---------------|
| [Semantic search](semantic-search-overview.md) | New support for Storage Optimized tiers (L1, L2) | Public preview. |
| [Debug Sessions](cognitive-search-debug-session.md) | Debug sessions, a built-in editor that runs in Azure portal, is now generally available.   | Generally available. |

## May 2022

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------------|--------------|---------------|
| [Power Query connector preview](search-how-to-index-power-query-data-sources.md) | This indexer data source was introduced in May 2021 but will not be moving forward. Please migrate your data ingestion code by November 2022. See the feature documentation for migration guidance.  | Retired |

## February 2022

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------------|--------------|---------------|
| [Index aliases](search-how-to-alias.md) | An index alias is a secondary name that can be used to refer to an index for querying, indexing, and other operations. You can create an alias that maps to a search index and substitute the alias name in places where you would otherwise reference an index name. This gives you added flexibility if you ever need to change which index your application is pointing to. Instead of updating the references to the index name in your application, you can just update the mapping for your alias. | Public preview REST APIs (no portal support at this time).|

## 2021 announcements

| Month | Feature | Description |
|-------|---------|-------------|
| December | [Enhanced configuration for semantic search](semantic-how-to-query-request.md#create-a-semantic-configuration) | This is a new addition to the 2021-04-30-Preview API, and are now required for semantic queries. Public preview in the portal and preview REST APIs.|
| November | [Azure Files indexer (preview)](./search-file-storage-integration.md) | Public preview in the portal and preview REST APIs.|
| July | [Search REST API 2021-04-30-Preview](/rest/api/searchservice/index-preview) | Public preview announcement. |
| July | [Role-based access control for data plane (preview)](search-security-rbac.md) | Public preview announcement. |
| July | [Management REST API 2021-04-01-Preview](/rest/api/searchmanagement/) | Modifies [Create or Update Service](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update) to support new [DataPlaneAuthOptions](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions). Public preview announcement. |
| May | [Power Query connector support (preview)](search-how-to-index-power-query-data-sources.md) | Public preview announcement. | 
| May | [Azure Data Lake Storage Gen2 indexer](search-howto-index-azure-data-lake-storage.md) | Generally available, using REST api-version=2020-06-30 and Azure portal. |
| May | [Azure MySQL indexer (preview)](search-howto-index-mysql.md) | Public preview, REST api-version=2020-06-30-Preview, [.NET SDK 11.2.1](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourcetype.mysql), and Azure portal. |
| May | [More queryLanguages for spell check and semantic results](/rest/api/searchservice/preview-api/search-documents#queryLanguage) | See [Announcement (techcommunity blog)](https://techcommunity.microsoft.com/t5/azure-ai/introducing-multilingual-support-for-semantic-search-on-azure/ba-p/2385110). Public preview ([by request](https://aka.ms/SemanticSearchPreviewSignup)). Use [Search Documents (REST)](/rest/api/searchservice/preview-api/search-documents) api-version=2020-06-30-Preview, [Azure.Search.Documents 11.3.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.3.0-beta.2), or [Search explorer](search-explorer.md) in Azure portal. |
| May| [More regions for double encryption](search-security-manage-encryption-keys.md#double-encryption) | Generally available in all regions, subject to [service creation dates](search-security-manage-encryption-keys.md#double-encryption). |
| April | [Azure Cosmos DB for Apache Gremlin support (preview)](search-howto-index-cosmosdb-gremlin.md) | Public preview ([by request](https://aka.ms/azure-cognitive-search/indexer-preview)), using api-version=2020-06-30-Preview. |
| March | [Semantic search (preview)](semantic-search-overview.md) | Search results relevance scoring based on semantic models. Public preview ([by request](https://aka.ms/SemanticSearchPreviewSignup)). Use [Search Documents (REST)](/rest/api/searchservice/preview-api/search-documents) api-version=2020-06-30-Preview or [Search explorer](search-explorer.md) in Azure portal. Region and tier restrictions apply. |
| March | [Spell check query terms (preview)](speller-how-to-add.md) | The `speller` option works with any query type (simple, full, or semantic). Public preview, REST only, api-version=2020-06-30-Preview|
| March | [SharePoint indexer (preview)](search-howto-index-sharepoint-online.md) | Public preview, REST only, api-version=2020-06-30-Preview |
| March | [Normalizers (preview)](search-normalizers.md) | Public preview, REST only, api-version=2020-06-30-Preview |
| March | [Custom Entity Lookup skill](cognitive-search-skill-custom-entity-lookup.md ) |  Scans for strings specified in a custom, user-defined list of words and phrases. Generally available. |
| February | [Reset Documents (preview)](search-howto-run-reset-indexers.md) |  Available in the [Search REST API 2020-06-30-Preview](/rest/api/searchservice/index-preview). |
| February | [Availability Zones](search-performance-optimization.md#availability-zones) | Search services with two or more replicas in certain regions, as listed in [Scale for performance](search-performance-optimization.md#availability-zones), gain resiliency by having replicas in two or more distinct physical locations.  The region and date of search service creation determine availability.  |
| February | [Azure CLI](/cli/azure/search) </br>[Azure PowerShell](/powershell/module/az.search/) | New revisions now provide the full range of operations in the Management REST API 2020-08-01, including support for IP firewall rules and private endpoint. Generally available. |
| January | [Solution accelerator for Azure Cognitive Search and QnA Maker](https://github.com/Azure-Samples/search-qna-maker-accelerator) | Pulls questions and answers out of the document and suggest the most relevant answers. A live demo app can be found at [https://aka.ms/qnaWithAzureSearchDemo](https://aka.ms/qnaWithAzureSearchDemo). This feature is an open-source project (no SLA). |

## 2019 and 2020 announcements

For feature announcements from 2019 and 2020, see the content archive, [**Previous versions**](/previous-versions/azure/search/) on the Microsoft Learn website.

<a name="new-service-name"></a>

## Service re-brand announcement

Azure Search was renamed to **Azure Cognitive Search** in October 2019 to reflect the expanded (yet optional) use of cognitive skills and AI processing in service operations. API versions, NuGet packages, namespaces, and endpoints are unchanged. New and existing search solutions are unaffected by the service name change.

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.
