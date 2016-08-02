<properties
	pageTitle="What’s new in the latest update to Azure Search | Microsoft Azure | Hosted cloud search service"
	description="Release notes for Azure Search describing the latest updates to the service"
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="paulettm"
	editor=""/>

<tags
	ms.service="search"
	ms.devlang="rest-api"
	ms.workload="search"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.date="06/05/2016"
	ms.author="heidist"/>

#What’s new in the latest update to Azure Search#

Azure Search is cloud hosted search service on Microsoft Azure. It is generally available, offering a 99.9% availability service-level agreement (SLA) for configurations of the [2015-02-28 version of the Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) or the [.NET SDK](https://msdn.microsoft.com/library/azure/dn951165.aspx).

##New in 2016

Feature|Released|Status|Details
-------|--------|------|-------
[SKU updates](search-limits-quotas-capacity.md)|June 2016|Preview and GA|Basic and Standard 2 (S2) SKUs, which previewed in March 2016, are now in General Availability. <br/><br/>Preview versions of a new Standard 3 (S3) and S3 High Density (S3 HD) SKUs are introduced in this update. See [Choose a SKU or tier for Azure Search ](search-sku-tier.md) for a comparison.
[.NET SDK 1.1](https://msdn.microsoft.com/library/azure/dn951165.aspx)|February 2016|GA|This is the first generally available release of the .NET client library, `Microsoft.Azure.Search.dll`. This version introduces breaking changes. See [Upgrading to the Azure Search .NET SDK version 1.1](search-dotnet-sdk-migration.md) for migration guidance.
[Lucene query syntax support](https://msdn.microsoft.com/library/azure/mt589323.aspx)|February 2016|[GA](search-api-2015-02-28-preview.md)|The Lucene query syntax is now generally available in both the REST API and .NET SDK. Set the `queryType` parameter to `full` in the REST API and the `SearchParameters.QueryType` property to `QueryType.Full` in the .NET SDK to enable the Lucene syntax.
[Custom Analyzers](https://azure.microsoft.com/blog/custom-analyzers-in-azure-search/)|January 2016|[Preview](search-api-2015-02-28-preview.md)|User-defined configurations of tokenizers and token filters. See [Analysis in Azure Search](https://msdn.microsoft.com/library/azure/mt605304.aspx) on MSDN.
[Azure Blob Storage Indexer](search-howto-indexing-azure-blob-storage.md)|January 2016|[Preview](search-api-2015-02-28-preview.md)|PDF, Office documents, XML, HTML, or even video and audio files can be merged or ingested into an Azure Search index.
[Search Explorer](search-explorer.md)|January 2016|[Portal](https://portal.azure.com)|Built-in query tool for ad hoc queries against an index.
[Power BI Content Pack for Azure Search](http://blogs.msdn.com/b/powerbi/archive/2016/01/19/visualizing-azure-search-data-with-power-bi.aspx)|January 2016|Tool|Visualization and analysis of service data using  a new Power BI content pack for Azure Search. Available via Search Analytics.
[Search Analytics](https://azure.microsoft.com/blog/analyzing-your-azure-search-traffic/)|January 2016|Portal|Enable data collection for insights into user's search activity.

##New in 2015

Feature|Released|Status|Details
-------|--------|------|-------
Lucene language analyzers|October 2015|GA|This feature is now GA, available in the service REST API and the .NET SDK.
[Microsoft natural language processors](search-api-2015-02-28-preview.md)|October 2015|GA|This feature is now GA, available in the service REST API and the .NET SDK.
[Lucene query syntax support](https://msdn.microsoft.com/library/azure/mt589323.aspx)|September 2015|[Preview](search-api-2015-02-28-preview.md)|Adds Lucene's query analyzer.To use the new syntax, you must specify the `queryType` in a Search Documents operation.
[Natural language processors](search-language-support.md)|September 2015|[Preview](search-api-2015-02-28-preview.md)|Added Microsoft's language processors, increasing the number of overall languages and providing an alternative implementation for others.
POST in search, suggestions, and lookup queries|September 2015|[Preview](search-api-2015-02-28-preview.md)|Applies to the Service REST API.
[Management REST API](https://msdn.microsoft.com/library/azure/dn832684.aspx)|September 2015|GA|Second version of the Management REST API. Includes checkNameAvailability checks whether a given service name is already in use, replica range was previously 1-6 and is now 1-12, SKU property was moved from the property bag to the top level of the service payload, response body of the Create Search Service operation was updated to accommodate the relocation of the SKU setting.
.NET SDK 0.10.0-preview|August 2015|Preview|This is the second iteration of the .NET client library, Microsoft.Azure.Search.dll. This version adds support for creating, managing, and using [DataSource Class](https://msdn.microsoft.com/library/azure/microsoft.azure.search.models.datasource.aspx) and [Indexers Class](https://msdn.microsoft.com/library/azure/microsoft.azure.search.models.indexer.aspx) via .NET classes. Additionally, for Azure SQL Indexers, there is new support for indexing geography points.
fieldMapping constructs|April 2015|Preview|Indexers now support fieldMapping constructs that provide field assignments when actual field names are different between the external database and the Azure Search index. See [Indexers](search-api-indexers-2015-02-28-Preview.md) for the `2015-02-28-preview` version of the indexers documentation..
field type transformations|April 2015|Preview|Indexers now support field type transformations so that you can map a string field in a SQL table to a string collection field in a search index, assuming the source field represents a JSON array.
[Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx)|March 2015|GA|First generally available version of the Azure Search service REST API. This version includes previous features. It also includes [Indexers](http://go.microsoft.com/fwlink/p/?LinkID=528210). [Suggesters](https://msdn.microsoft.com/library/azure/dn798936.aspx) replaces the more limited, type-ahead query support of the previous implementation (it only matched on prefixes) by adding support for infix matching. This implementation can find matches anywhere in a term, and also supports fuzzy matching. [Tag boosting](http://go.microsoft.com/fwlink/p/?LinkId=528212) enables a new scenario for scoring profiles. In particular, it leverages persisted data (such as shopping preferences) so that you can boost search results for individual users, based on personalized information.
.NET SDK 0.9.6-preview|March 2015|Preview|This is the first public release of the .NET SDK for Azure Search. It includes a client library, Microsoft.Azure.Search.dll, with two namespaces:[Microsoft.Azure.Search](https://msdn.microsoft.com/library/azure/microsoft.azure.search.aspx) and [Microsoft.Azure.Search.Models](https://msdn.microsoft.com/library/azure/microsoft.azure.search.models.aspx)
Management REST API|March 2015|GA|First version of the Management REST API belonging to the generally available release of Azure Search. There are no feature differences between the earlier preview and this one.
[Microsoft natural language processors](search-api-2015-02-28-preview.md)|March 2015|Preview|Adds more languages and expansive stemming for all the languages supported by Office and Bing.
[moreLikeThis=](search-api-2015-02-28-preview.md)|March 2015|Preview|A search parameter, mutually exclusive of `search=`, that triggers an alternate query execution path. Instead of full-text search of `search=` based on a search term input, `moreLikeThis=` finds documents that are similar to a given document by comparing their searchable fields.

##New in 2014

Feature|Released|Status|Details
-------|--------|------|-------
Lucene language analyzers|November 2014|Preview|Added to provide multi-lingual support for the custom language analyzers distributed with Lucene.
Portal support was introduced for building indexes|November 2014|[Portal](https://portal.azure.com)|Indexes, analyzers, and scoring profiles can be constructed in the portal.
Management api-version 2014-07-31-Preview|October 2014|Preview|First public preview release of the management REST API. Documentation for this api-version is available upon request.
Search Service REST API|August 2014|Preview|First public preview release of the service REST API (api-version-2014-07-31-Preview). This is the REST API for index and document operations, scoring profiles for tuning search results, geospatial support. This release supports service provisioning in the Azure Portal. Documentation for this api-version is available upon request. It is versioned independently of the service REST API.

##How features are versioned and rolled out

Features are released separately or jointly through the [REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx), [.NET SDK](http://go.microsoft.com/fwlink/?LinkId=528216), or the service dashboard in the [Azure Portal](https://portal.azure.com). Both the .NET library and REST APIs have multiple versions. Older APIs remain operational as we roll out new features. You can visit [Search service versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) to learn more about our versioning policy.

Preview and generally available (GA) features are tied to an API version of the same category.

- Preview features are experimental and could change or even be abandoned before graduating to GA. Preview features are always available in the [preview version of the REST API](search-api-2015-02-28-preview.md), and sometimes in the [.NET SDK](http://go.microsoft.com/fwlink/?LinkId=528216). Feature documentation will always explain how to access the feature in question.
- GA features are stable and unlikely to change. Any change to a GA feature is announced as a breaking change.

Features that are purely portal or tool-based are expected to change over time and are not classified as either preview or GA.
