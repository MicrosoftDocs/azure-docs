---
title: What's new in Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: overview
ms.date: 06/07/2022
ms.custom: references_regions 
---
# What's new in Azure Cognitive Search

Learn what's new in the service. Bookmark this page to keep up to date with service updates. 

Check out the [**Preview feature list**](search-api-preview.md) for an itemized list of features that are not yet approved for production workloads.

## May 2022

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------------|--------------|---------------|
| [Power Query connector preview](search-how-to-index-power-query-data-sources.md) | This indexer data source was introduced in May 2021 but will not be moving forward. Please migrate your data ingestion code by November 2022. See the feature documentation for migration guidance.  | Retired |

## February 2022

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------------|--------------|---------------|
| [Index aliases](search-how-to-alias.md) | An index alias is a secondary name that can be used to refer to an index for querying, indexing, and other operations. You can create an alias that maps to a search index and substitute the alias name in places where you would otherwise reference an index name. This gives you added flexibility if you ever need to change which index your application is pointing to. Instead of updating the references to the index name in your application, you can just update the mapping for your alias. | Public preview REST APIs (no portal support at this time).|

## 2021 Archive

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
| April | [Gremlin API support (preview)](search-howto-index-cosmosdb-gremlin.md) | Public preview ([by request](https://aka.ms/azure-cognitive-search/indexer-preview)), using api-version=2020-06-30-Preview. |
| March | [Semantic search (preview)](semantic-search-overview.md) | Search results relevance scoring based on semantic models. Public preview ([by request](https://aka.ms/SemanticSearchPreviewSignup)). Use [Search Documents (REST)](/rest/api/searchservice/preview-api/search-documents) api-version=2020-06-30-Preview or [Search explorer](search-explorer.md) in Azure portal. Region and tier restrictions apply. |
| March | [Spell check query terms (preview)](speller-how-to-add.md) | The `speller` option works with any query type (simple, full, or semantic). Public preview, REST only, api-version=2020-06-30-Preview|
| March | [SharePoint indexer (preview)](search-howto-index-sharepoint-online.md) | Public preview, REST only, api-version=2020-06-30-Preview |
| March | [Normalizers (preview)](search-normalizers.md) | Public preview, REST only, api-version=2020-06-30-Preview |
| March | [Custom Entity Lookup skill](cognitive-search-skill-custom-entity-lookup.md ) |  Scans for strings specified in a custom, user-defined list of words and phrases. Generally available. |
| February | [Reset Documents (preview)](search-howto-run-reset-indexers.md) |  Available in the [Search REST API 2020-06-30-Preview](/rest/api/searchservice/index-preview). |
| February | [Availability Zones](search-performance-optimization.md#availability-zones) | Search services with two or more replicas in certain regions, as listed in [Scale for performance](search-performance-optimization.md#availability-zones), gain resiliency by having replicas in two or more distinct physical locations.  The region and date of search service creation determine availability.  |
| February | [Azure CLI](/cli/azure/search) </br>[Azure PowerShell](/powershell/module/az.search/) | New revisions now provide the full range of operations in the Management REST API 2020-08-01, including support for IP firewall rules and private endpoint. Generally available. |
| January | [Solution accelerator for Azure Cognitive Search and QnA Maker](https://github.com/Azure-Samples/search-qna-maker-accelerator) | Pulls questions and answers out of the document and suggest the most relevant answers. A live demo app can be found at [https://aka.ms/qnaWithAzureSearchDemo](https://aka.ms/qnaWithAzureSearchDemo). This feature is an open-source project (no SLA). |

## 2020 Archive

| Month | Feature | Description |
|-------|---------|-------------|
| November | [Customer-managed key encryption (extended)](search-security-manage-encryption-keys.md) | Extends customer-managed encryption over the full range of assets created and managed by a search service. Generally available.|
| September | [Visual Studio Code extension for Azure Cognitive Search](search-get-started-vs-code.md) | Adds a workspace, navigation, intellisense, and templates for creating indexes, indexers, data sources, and skillsets. This feature is currently in public preview.| 
| September | [System managed service identity (indexers)](search-howto-managed-identities-data-sources.md) | Generally available.  |
| September | [Outbound requests using a private link](search-indexer-howto-access-private.md) | Generally available.  |
| September | [Management REST API (2020-08-01)](/rest/api/searchmanagement/management-api-versions) | Generally available. |
| September | [Management REST API (2020-08-01-Preview)](/rest/api/searchmanagement/management-api-versions) | Adds shared private link resource for Azure Functions and Azure SQL for MySQL Databases. |
| September | [Management .NET SDK 4.0](/dotnet/api/overview/azure/search/management) |  Azure SDK update for the management SDK, targeted REST API version 2020-08-01. Generally available.|
| August | [double encryption](search-security-overview.md#encryption) | Generally available  on all search services created after August 1, 2020 in these regions: West US 2, East US, South Central US, US Gov Virginia, US Gov Arizona. |
| July | [Azure.Search.Documents client library](/dotnet/api/overview/azure/search.documents-readme) | Azure SDK for .NET, generally available. |
| July | [azure.search.documents client library](/python/api/overview/azure/search-documents-readme)  | Azure SDK for Python, generally available. |
| July | [@azure/search-documents client library](/javascript/api/overview/azure/search-documents-readme)  | Azure SDK for JavaScript, generally available. |
| June | [Knowledge store](knowledge-store-concept-intro.md) | Generally available. |
| June | [Search REST API 2020-06-30](/rest/api/searchservice/) | Generally available. |
| June | [Search REST API 2020-06-30-Preview](/rest/api/searchservice/) | Adds Reset Skillset to selectively reprocess skills, and incremental enrichment. |
| June | [Okapi BM25 relevance algorithm](index-ranking-similarity.md) | Generally available. |
| June |  **executionEnvironment** (applies to search services using Azure Private Link.) | Generally available. |
| June | [AML skill (preview)](cognitive-search-aml-skill.md) | A cognitive skill that extends AI enrichment with a custom Azure Machine Learning (AML) model. |
| May | [Debug sessions (preview)](cognitive-search-debug-session.md) | Skillset debugger in the portal.  |
| May | [IP rules for in-bound firewall support](service-configure-firewall.md) | Generally available.  |
| May | [Azure Private Link for a private search endpoint](service-create-private-endpoint.md) | Generally available.  |
| May | [Managed service identity (indexers) - (preview)](search-howto-managed-identities-data-sources.md) | Connect to Azure data sources using a managed identity.  |
| May | [sessionId query parameter](index-similarity-and-scoring.md), [scoringStatistics=global parameter](index-similarity-and-scoring.md#scoring-statistics)  | Global search statistics, useful for [machine learning (LearnToRank) models for search relevance](https://github.com/Azure-Samples/search-ranking-tutorial).  |
| May | [featuresMode relevance score expansion (preview)](index-similarity-and-scoring.md#featuresMode-param)  |   |
|March  | [Native blob soft delete (preview)](search-howto-index-changed-deleted-blobs.md) | Deletes search documents if the source blob is soft-deleted in blob storage. |
|March  | [Management REST API (2020-03-13)](/rest/api/searchmanagement/management-api-versions) | Generally available. |
|February | [PII Detection skill](cognitive-search-skill-pii-detection.md)  | A cognitive skill that extracts and masks personal information. |
|February | [Custom Entity Lookup skill](cognitive-search-skill-custom-entity-lookup.md) | A cognitive skill that finds words and phrases from a list and labels all documents with matching entities.  |
|January | [Customer-managed key encryption](search-security-manage-encryption-keys.md) | Generally available  |
|January | [IP rules for in-bound firewall support](service-configure-firewall.md) | New **IpRule** and **NetworkRuleSet** properties in [CreateOrUpdate API](/rest/api/searchmanagement/2020-08-01/services/create-or-update).  |
|January | [Create a private endpoint](service-create-private-endpoint.md) | Set up a Private Link for secure connections to your search service. This preview feature has a dependency [Azure Private Link](../private-link/private-link-overview.md) and [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) as part of the solution. |

## 2019 Archive

| Month | Feature | Description |
|-------|---------|-------------|
|December | [Create Demo App](search-create-app-portal.md) | A wizard that generates a downloadable HTML file with query (read-only) access to an index, intended as a validation and testing tool rather than a short cut to a full client app.|
|November | [Incremental enrichment (preview)](cognitive-search-incremental-indexing-conceptual.md) | Caches skillset processing for future reuse.  |
|November | [Document Extraction skill](cognitive-search-skill-document-extraction.md) | A cognitive skill to extract the contents of a file from within a skillset.|
|November | [Text Translation skill](cognitive-search-skill-text-translation.md) | A cognitive skill used during indexing that evaluates and translates text. Generally available.|
|November | [Power BI templates](https://github.com/Azure-Samples/cognitive-search-templates/blob/master/README.md) | Template for visualizing content in knowledge store |
|November | [Azure Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md) and [Cosmos DB Gremlin API (preview)](search-howto-index-cosmosdb.md) | New indexer data sources in public preview. |
|July | [Azure Government Cloud support](https://azure.microsoft.com/global-infrastructure/services/?regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&products=search) | Generally available.|

<a name="new-service-name"></a>

## Service re-brand

Azure Search was renamed to **Azure Cognitive Search** in October 2019 to reflect the expanded (yet optional) use of cognitive skills and AI processing in service operations. API versions, NuGet packages, namespaces, and endpoints are unchanged. New and existing search solutions are unaffected by the service name change.

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.
