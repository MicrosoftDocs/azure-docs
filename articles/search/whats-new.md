---
title: What's new in Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: overview
ms.date: 07/20/2021
ms.custom: references_regions 
---
# What's new in Azure Cognitive Search

Learn what's new in the service. Bookmark this page to keep up to date with the service. Check out the [Preview feature list](search-api-preview.md) to view a comprehensive list of features that are not yet generally available.

## July 2021

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------------|--------------|---------------|
| [Search REST API 2021-04-30-Preview](/rest/api/searchservice/index-preview) | Adds REST API support for indexer connections made using [managed identities](search-howto-managed-identities-data-sources.md) and Azure Active Directory (Azure AD) authentication. | Public preview |
| [Role-based authorization (preview)](search-security-rbac.md) | Authenticate using Azure Active Directory and new built-in roles for data plane access to indexes and indexing, eliminating or reducing the dependency on API keys. | Public preview ([by request](https://aka.ms/azure-cognitive-search/rbac-preview)). After your subscription is on-boarded, use Azure portal or the Management REST API version 2021-04-01-Preview to configure a search service for data plane authentication.|
| [Management REST API 2021-04-01-Preview](/rest/api/searchmanagement/) | Modifies [Create or Update Service](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update) to support new [DataPlaneAuthOptions](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions). | Public preview |

## May 2021

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------------|--------------|---------------|
| [Power Query connector support (preview)](search-how-to-index-power-query-data-sources.md) | Indexers can now index from other cloud platforms. If you are using an indexer to crawl external data sources for indexing, you can now use Power Query connectors to connect to Amazon Redshift, Elasticsearch, PostgreSQL, Salesforce Objects, Salesforce Reports, Smartsheet, and Snowflake. </br></br>[Announcement (techcommunity blog)](https://techcommunity.microsoft.com/t5/azure-ai/azure-cognitive-search-indexers-allow-you-to-ingest-data-from/ba-p/2381988)  | Public preview ([by request](https://aka.ms/azure-cognitive-search/indexer-preview)), using REST api-version=2020-06-30-Preview and Azure portal. |
|[Azure Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md) | The ADLS Gen2 data source used by indexers is now generally available. | Generally available, using REST api-version=2020-06-30 and Azure portal. |
|[MySQL support (preview)](search-howto-index-mysql.md) | For indexer-based indexing, announcing preview data source support for Azure MySQL. | Public preview, REST api-version=2020-06-30-Preview, [.NET SDK 11.2.1](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourcetype.mysql), and Azure portal. |
| [More queryLanguages for spell check and semantic results](/rest/api/searchservice/preview-api/search-documents#queryLanguage) | For query requests that invoke spell check or queryType=semantic, you can now set the queryLanguage to a non-English language for [38 languages](/rest/api/searchservice/preview-api/search-documents#queryLanguage). </br></br>[Announcement (techcommunity blog)](https://techcommunity.microsoft.com/t5/azure-ai/introducing-multilingual-support-for-semantic-search-on-azure/ba-p/2385110) | Public preview ([by request](https://aka.ms/SemanticSearchPreviewSignup)). </br></br>Use [Search Documents (REST)](/rest/api/searchservice/preview-api/search-documents) api-version=2020-06-30-Preview, [Azure.Search.Documents 11.3.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.3.0-beta.2), or [Search explorer](search-explorer.md) in Azure portal. </br></br>[Region and tier](semantic-search-overview.md#availability-and-pricing) restrictions apply. |
| [Double encryption availability](search-security-manage-encryption-keys.md#double-encryption) | For search indexes and objects that are encrypted through customer-managed keys, double encryption (encryption of both static and temporary disks) is now implemented in all supported regions. | In all regions, subject to [service creation dates](search-security-manage-encryption-keys.md#double-encryption). |

## April 2021

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------|---------------|---------------|
| [Gremlin API support (preview)](search-howto-index-cosmosdb-gremlin.md) | For indexer-based indexing, you can now create a data source that retrieves content from Cosmos DB accessed through the Gremlin API. | Public preview ([by request](https://aka.ms/azure-cognitive-search/indexer-preview)), using api-version=2020-06-30-Preview. |

## March 2021

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------|---------------|---------------|
| [Semantic search (preview)](semantic-search-overview.md) | A collection of query-related features that significantly improve the relevance of search results through minimal adjustments to a query request. </br></br>[Semantic ranking](semantic-ranking.md) computes relevance scores using the semantic meaning behind words and content. </br></br>[Semantic captions](semantic-how-to-query-request.md) return relevant passages from the document that best summarize the document, with highlights over the most important terms or phrases. </br></br>[Semantic answers](semantic-answers.md) return key passages, extracted from a search document, that are formulated as a direct answer to a query that looks like a question. | Public preview ([by request](https://aka.ms/SemanticSearchPreviewSignup)). </br></br>Use [Search Documents (REST)](/rest/api/searchservice/preview-api/search-documents) api-version=2020-06-30-Preview or [Search explorer](search-explorer.md) in Azure portal. </br></br>Region and tier restrictions apply. |
| [Spell check query terms (preview)](speller-how-to-add.md) | Before query terms reach the search engine, you can have them checked for spelling errors. The `speller` option works with any query type (simple, full, or semantic). |  Public preview, REST only, api-version=2020-06-30-Preview|
| [SharePoint Online indexer (preview)](search-howto-index-sharepoint-online.md) | This indexer connects you to a SharePoint Online site so that you can index content from a document library. | Public preview, REST only, api-version=2020-06-30-Preview |
| [Normalizers (preview)](search-normalizers.md) | Normalizers provide simple text pre-processing: consistent casing, accent removal, and ASCII folding, without invoking the full text analysis chain.| Public preview, REST only, api-version=2020-06-30-Preview |
| [Custom Entity Lookup skill](cognitive-search-skill-custom-entity-lookup.md ) |  A cognitive skill that looks for text from a custom, user-defined list of words and phrases. Using this list, it labels all documents with any matching entities. The skill also supports a degree of fuzzy matching that can be applied to find matches that are similar but not quite exact. | Generally available. |

## February 2021

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------|---------------|---------------|
| [Reset Documents (preview)](search-howto-run-reset-indexers.md) |  Reprocesses individually selected search documents in indexer workloads. | [Search REST API 2020-06-30-Preview](/rest/api/searchservice/index-preview) |
| [Availability Zones](search-performance-optimization.md#availability-zones)| Search services with two or more replicas in certain regions, as listed in [Scale for performance](search-performance-optimization.md#availability-zones), gain resiliency by having replicas in two or more distinct physical locations.  | The region and date of search service creation determine availability. See the Scale for performance article for details. |
| [Azure CLI](/cli/azure/search) </br>[Azure PowerShell](/powershell/module/az.search/) | New revisions now provide the full range of operations in the Management REST API 2020-08-01, including support for IP firewall rules and private endpoint. | Generally available. |

## January 2021

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  |  Description | Availability  |
|------------------------------|-------------|---------------|
| [Solution accelerator for Azure Cognitive Search and QnA Maker](https://github.com/Azure-Samples/search-qna-maker-accelerator) | Pulls questions and answers out of the document and suggest the most relevant answers. A live demo app can be found at [https://aka.ms/qnaWithAzureSearchDemo](https://aka.ms/qnaWithAzureSearchDemo).  | Open-source project (no SLA) |

## 2020 Archive

| Month | Feature | Description |
|-------|---------|-------------|
| November | [Customer-managed key encryption (extended)](search-security-manage-encryption-keys.md) | Extends customer-managed encryption over the full range of assets created and managed by a search service. Generally available.|
| September | [Visual Studio Code extension for Azure Cognitive Search](search-get-started-vs-code.md) | Adds a workspace, navigation, intellisense, and templates for creating indexes, indexers, data sources, and skillsets. This feature is currently in public preview.| 
| September | [Managed service identity (indexers)](search-howto-managed-identities-data-sources.md) | Generally available.  |
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
|February | [PII Detection skill (preview)](cognitive-search-skill-pii-detection.md)  | A cognitive skill that extracts and masks personal information. |
|February | [Custom Entity Lookup skill (preview)](cognitive-search-skill-custom-entity-lookup.md) | A cognitive skill that finds words and phrases from a list and labels all documents with matching entities.  |
|January | [Customer-managed key encryption](search-security-manage-encryption-keys.md) | Generally available  |
|January | [IP rules for in-bound firewall support (preview)](service-configure-firewall.md) | New **IpRule** and **NetworkRuleSet** properties in [CreateOrUpdate API](/rest/api/searchmanagement/2020-08-01/services/create-or-update).  |
|January | [Create a private endpoint (preview)](service-create-private-endpoint.md) | Set up a Private Link for secure connections to your search service. This preview feature has a dependency [Azure Private Link](../private-link/private-link-overview.md) and [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) as part of the solution. |

## 2019 Archive

| Month | Feature | Description |
|-------|---------|-------------|
|December | [Create Demo App](search-create-app-portal.md) | A wizard that generates a downloadable HTML file with query (read-only) access to an index, intended as a validation and testing tool rather than a short cut to a full client app.|
|November | [Incremental enrichment (preview)](cognitive-search-incremental-indexing-conceptual.md) | Caches skillset processing for future reuse.  |
|November | [Document Extraction skill (preview)](cognitive-search-skill-document-extraction.md) | A cognitive skill to extract the contents of a file from within a skillset.|
|November | [Text Translation skill](cognitive-search-skill-text-translation.md) | A cognitive skill used during indexing that evaluates and translates text. Generally available.|
|November | [Power BI templates](https://github.com/Azure-Samples/cognitive-search-templates/blob/master/README.md) | Template for visualizing content in knowledge store |
|November | [Azure Data Lake Storage Gen2 (preview)](search-howto-index-azure-data-lake-storage.md) and [Cosmos DB Gremlin API (preview)](search-howto-index-cosmosdb.md) | New indexer data sources in public preview. |
|July | [Azure Government Cloud support](https://azure.microsoft.com/global-infrastructure/services/?regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&products=search) | Generally available.|

<a name="new-service-name"></a>

## New service name

Azure Search was renamed to **Azure Cognitive Search** in October 2019 to reflect the expanded (yet optional) use of cognitive skills and AI processing in core operations. API versions, NuGet packages, namespaces, and endpoints are unchanged. New and existing search solutions are unaffected by the service name change.

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.