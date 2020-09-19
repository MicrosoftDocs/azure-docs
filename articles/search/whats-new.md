---
title: What's new in Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: overview
ms.date: 08/01/2020
ms.custom: references_regions 
---
# What's new in Azure Cognitive Search

Learn what's new in the service. Bookmark this page to keep up to date with the service.

## Feature announcements in 2020

### August 2020

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Category | Description | Availability  |
|---------|------------------|-------------|---------------|
| [double encryption](search-security-overview.md#encryption) | Security | Enable double encryption at the storage layer by configuring customer-managed key (CMK) encryption on new search services. Create a new service, [configure and apply customer-managed keys](search-security-manage-encryption-keys.md) to indexes or synonym maps, and benefit from double encryption over that content. | Generally available on all search services created after August 1, 2020 in these regions: West US 2, East US, South Central US, US Gov Virginia, US Gov Arizona. Use the portal, management REST APIs, or SDKs to create the service. |

### July 2020

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Category | Description | Availability  |
|---------|------------------|-------------|---------------|
| [Azure.Search.Documents client library](/dotnet/api/overview/azure/search.documents-readme?view=azure-dotnet) | Azure SDK for .NET | .NET client library released by the Azure SDK team, designed for consistency with other .NET client libraries. <br/><br/>Version 11 targets the Search REST api-version=2020-06-30, but does not yet support knowledge store, geospatial types, or [FieldBuilder](/dotnet/api/microsoft.azure.search.fieldbuilder?view=azure-dotnet). <br/><br/>For more information, see  [Quickstart: Create an index](search-get-started-dotnet.md) and [Upgrade to Azure.Search.Documents (v11)](search-dotnet-sdk-migration-version-11.md). | Generally available. </br> Install the [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/) from NuGet. |
| [azure.search.documents client library](/python/api/overview/azure/search-documents-readme?view=azure-python)  | Azure SDK for Python| Python client library released by the Azure SDK team, designed for consistency with other Python client libraries. <br/><br/>Version 11 targets the Search REST api-version=2020-06-30. | Generally available. </br> Install the [azure-search-documents package](https://pypi.org/project/azure-search-documents/) from PyPI. |
| [@azure/search-documents client library](/javascript/api/overview/azure/search-documents-readme?view=azure-node-latest)  | Azure SDK for JavaScript | JavaScript client library released by the Azure SDK team, designed for consistency with other JavaScript client libraries. <br/><br/>Version 11 targets the Search REST api-version=2020-06-30. | Generally available. </br> Install the [@azure/search-documents package](https://www.npmjs.com/package/@azure/search-documents) from npm. |

### June 2020

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Category | Description | Availability  |
|---------|------------------|-------------|---------------|
[**Knowledge store**](knowledge-store-concept-intro.md) | AI enrichment | Output of an AI-enriched indexer, storing content in Azure Storage for use in other apps and processes. | Generally available. </br> Use [Search REST API 2020-06-30](/rest/api/searchservice/) or later, or the portal. |
| [**Search REST API 2020-06-30**](/rest/api/searchservice/) | REST | A new stable version of the REST APIs. In addition to knowledge store, this version includes enhancements to search relevance and scoring. | Generally available. |
| [**Okapi BM25 relevance algorithm**](https://en.wikipedia.org/wiki/Okapi_BM25) | Query | New relevance ranking algorithm automatically used for all new search services created after July 15. For services created earlier, you can opt in by setting the `similarity` property on index fields. | Generally available. </br> Use [Search REST API 2020-06-30](/rest/api/searchservice/) or later, or REST API 2019-05-06. |
| **executionEnvironment** | Security (indexers) | Explicitly set this indexer configuration property to `private` to force all connections to external data sources over a private endpoint. Applicable only to search services that leverage Azure Private Link. | Generally available. </br> Use [Search REST API 2020-06-30](/rest/api/searchservice/) to set this general configuration parameter. |

### May 2020 (Microsoft Build)

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Category | Description | Availability  |
|---------|------------------|-------------|---------------|
| [**Debug sessions**](cognitive-search-debug-session.md) | AI enrichment | Debug sessions provide a portal-based interface to investigate and resolve issues with an existing skillset. Fixes created in the debug session can be saved to production skillsets. Get started with [this tutorial](cognitive-search-tutorial-debug-sessions.md). | Public preview, in the portal. |
| [**IP rules for in-bound firewall support**](service-configure-firewall.md) | Security | Limit access to a search service endpoint to specific IP addresses. | Generally available. </br> Use [Management REST API 2020-03-13](/rest/api/searchmanagement/) or later, or the portal. |
| [**Azure Private Link for a private search endpoint**](service-create-private-endpoint.md) | Security| Shield a search service from the public internet by running it as a private link resource, accessible only to client apps and other Azure services on the same virtual network. | Generally available. </br> Use [Management REST API 2020-03-13](/rest/api/searchmanagement/) or later, or the portal. |
| [**system-managed identity (preview)**](search-howto-managed-identities-data-sources.md) | Security (indexers) | Register a search service as a trusted service with Azure Active Directory to set up connections to supported Azure data source for indexing. Applies to [indexers](search-indexer-overview.md) that ingest content from Azure data sources such as Azure SQL Database, Azure Cosmos DB, and Azure Storage. | Public preview. </br> Use the portal to register the search service. |
| [**sessionId query parameter**](index-similarity-and-scoring.md), [scoringStatistics=global parameter](index-similarity-and-scoring.md#scoring-statistics) | Query (relevance) | Add sessionID to a query to establish a session for computing search scores, with scoringStatistics=global to collect scores from all shards, for more consistent search score calculations. | Generally available. </br> Use [Search REST API 2020-06-30](/rest/api/searchservice/) or later, or REST API 2019-05-06. |
| [**featuresMode (preview)**](index-similarity-and-scoring.md#featuresMode-param) | Query | Add this query parameter to expand a relevance score to show more detail: per field similarity score, per field term frequency, and per field number of unique tokens matched. You can consume these data points in custom scoring algorithms. For a sample that demonstrates this capability, see [Add machine learning (LearnToRank) to search relevance](https://github.com/Azure-Samples/search-ranking-tutorial). | Public preview. </br> Use [Search REST API 2020-06-30-Preview](/rest/api/searchservice/index-preview) or REST API 2019-05-06-Preview. |

### March 2020

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Category | Description | Availability  |
|---------|------------------|-------------|---------------|
| [**Native blob soft delete (preview)**](search-howto-indexing-azure-blob-storage.md#incremental-indexing-and-deletion-detection) | Indexers | An Azure Blob Storage indexer in Azure Cognitive Search will recognize blobs that are in a soft deleted state, and remove the corresponding search document during indexing. | Public preview. </br> Use the [Search REST API 2020-06-30-Preview](/rest/api/searchservice/index-preview) and REST API 2019-05-06-Preview, with Run Indexer against an Azure Blob data source that has native "soft delete" enabled. |
| [**Management REST API (2020-03-13)**](/rest/api/searchmanagement/management-api-versions) | REST | New stable REST API for creating and managing a search service. Adds IP firewall and Private Link support | Generally available. |

### February 2020

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Category | Description | Availability  |
|---------|------------------|-------------|---------------|
| [**PII Detection (preview)**](cognitive-search-skill-pii-detection.md) | AI enrichment | A new cognitive skill used during indexing that extracts personally identifiable information from an input text and gives you the option to mask it from that text in various ways. | Public preview. </br> Use the portal or [Search REST API 2020-06-30-Preview](/rest/api/searchservice/index-preview) or REST API 2019-05-06-Preview. |
| [**Custom Entity Lookup (preview)**](cognitive-search-skill-custom-entity-lookup.md )| AI enrichment | A new cognitive skill that looks for text from a custom, user-defined list of words and phrases. Using this list, it labels all documents with any matching entities. The skill also supports a degree of fuzzy matching that can be applied to find matches that are similar but not exact. | Public preview. </br> Use the portal or [Search REST API 2020-06-30-Preview](/rest/api/searchservice/index-preview) or REST API 2019-05-06-Preview. |

### January 2020

|Feature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Category | Description | Availability  |
|---------|------------------|-------------|---------------|
| [**Customer-managed encryption keys**](search-security-manage-encryption-keys.md) |Security | Adds an extra layer of encryption in addition to the platform's built-in encryption. Using an encryption key that you create and manage, you can encrypt index content and synonym maps before the payload reaches a search service. | Generally available. </br> Use Search REST API 2019-05-06 or later. For managed code, the correct package is still [.NET SDK version 8.0-preview](search-dotnet-sdk-migration-version-9.md) even though the feature is out of preview. |
| [**IP rules for in-bound firewall support (preview)**](service-configure-firewall.md) | Security | Limit access to a search service endpoint to specific IP addresses. The preview API has new **IpRule** and **NetworkRuleSet** properties in [CreateOrUpdate API](/rest/api/searchmanagement/2019-10-01-preview/createorupdate-service). This preview feature is available in selected regions. |  Public preview using api-version=2019-10-01-Preview.  |
| [**Azure Private Link for a private search endpoint (preview)**](service-create-private-endpoint.md) | Security| Shield a search service from the public internet by running it as a private link resource, accessible only to client apps and other Azure services on the same virtual network. | Public preview using api-version=2019-10-01-Preview.  |

## Feature announcements in 2019

### December 2019

+ [Create Demo App (preview)](search-create-app-portal.md) is a new wizard in the portal that generates a downloadable HTML file with query (read-only) access to an index. The file comes with embedded script that renders an operational "localhost"-style web app, bound to an index on your search service. Pages are configurable in the wizard and can contain a search bar, results area, sidebar navigation, and typeahead query support. You can modify the HTML offline to extend or customize the workflow or appearance. A demo app is not easily extended to include security and hosting layers that are typically needed in production scenarios. You should consider it as a validation and testing tool rather than a short cut to a full client app.

+ [Create a private endpoint for secure connections (preview)](service-create-private-endpoint.md) explains how to set up a Private Link for secure connections to your search service. This preview feature is available upon request and uses [Azure Private Link](../private-link/private-link-overview.md) and [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) as part of the solution.

### November 2019 - Ignite Conference

+ [Incremental enrichment (preview)](cognitive-search-incremental-indexing-conceptual.md) adds caching and statefullness to an enrichment pipeline so that you can work on specific steps or phases without losing content that is already processed. Previously, any change to an enrichment pipeline required a full rebuild. With incremental enrichment, the output of costly analysis, especially image analysis, is preserved.

<!-- 
+ Custom Entity Lookup is a cognitive skill used during indexing that allows you to provide a list of custom entities (such as part numbers, diseases, or names of locations you care about) that should be found within the text. It supports fuzzy matching, case-insensitive matching, and entity synonyms. -->

+ [Document Extraction (preview)](cognitive-search-skill-document-extraction.md) is a cognitive skill used during indexing that allows you to extract the contents of a file from within a skillset. Previously, document cracking only occurred prior to skillset execution. With the addition of this skill, you can also perform this operation within skillset execution.

+ [Text Translation](cognitive-search-skill-text-translation.md) is a cognitive skill used during indexing that evaluates text and, for each record, returns the text translated to the specified target language.

+ [Power BI templates](https://github.com/Azure-Samples/cognitive-search-templates/blob/master/README.md) can jumpstart your visualizations and analysis of enriched content in a knowledge store in Power BI desktop. This template is designed for Azure table projections created through the [Import data wizard](knowledge-store-create-portal.md).

+ [Azure Data Lake Storage Gen2 (preview)](search-howto-index-azure-data-lake-storage.md), [Cosmos DB Gremlin API (preview)](search-howto-index-cosmosdb.md), and [Cosmos DB Cassandra API (preview)](search-howto-index-cosmosdb.md) are now supported in indexers. You can sign up using [this form](https://aka.ms/azure-cognitive-search/indexer-preview). You will receive a confirmation email once you have been accepted into the preview program.

### July 2019

+ Generally available in [Azure Government Cloud](../azure-government/compare-azure-government-global-azure.md#azure-cognitive-search).

<a name="new-service-name"></a>

## New service name

Azure Search is now renamed to **Azure Cognitive Search** to reflect the expanded (yet optional) use of cognitive skills and AI processing in core operations. API versions, NuGet packages, namespaces, and endpoints are unchanged. New and existing search solutions are unaffected by the service name change.

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.