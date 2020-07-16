---
title: What's new in Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: overview
ms.date: 06/30/2020
---
# What's new in Azure Cognitive Search

Learn what's new in the service. Bookmark this page to keep up to date with the service.

## Feature announcements

### June 2020

+ [Knowledge store](knowledge-store-concept-intro.md) is now generally available.

+ [Search Service REST API 2020-06-30](https://docs.microsoft.com/rest/api/searchservice/) is the new stable version of the REST APIs. In addition to knowledge store, this generally available version includes enhancements to search relevance and scoring.

+ New relevance ranking algorithm is now [BM25](https://en.wikipedia.org/wiki/Okapi_BM25) for any new service you create. For existing services, you can opt in by setting the `similarity` property on index fields. This property is generally available.

+ New indexer `executionEnvironment` can be explicitly set to `private`. This capability supports indexer access to external data over private endpoints, and it is generally available.

+ [Azure Machine Learning (AML)](cognitive-search-aml-skill.md) is a new skill type to integrate an inferencing endpoint from Azure Machine Learning. The portal experience supports discovery and integration of your Azure Machine Learning endpoint within a Cognitive Search skillset. The discovery requires your Cognitive Search and Azure ML services be deployed in the same subscription. This skill is generally available. Get started with [this tutorial](cognitive-search-tutorial-aml-custom-skill.md).

### May 2020 (Microsoft Build)

+ [Debug sessions](cognitive-search-debug-session.md) feature is now in preview. Debug sessions provide a portal-based interface to investigate and resolve issues with a skillset. Fixes created in the debug session can be saved to production skillsets. Get started with [this tutorial](cognitive-search-tutorial-debug-sessions.md).

+ Shield a search service endpoint from the public internet by [configuring IP rules for in-bound firewall support](service-configure-firewall.md) or by leveraging [Azure Private Link for a private search endpoint](service-create-private-endpoint.md). Both capabilities are generally available.

+ Use a [system-managed identity (preview)](search-howto-managed-identities-data-sources.md) to set up a connection to an Azure data source for indexing. Applies to [indexers](search-indexer-overview.md) that ingest content from Azure data sources such as Azure SQL Database, Azure Cosmos DB, and Azure Storage.

+ Change the basis for how search scores are computed, from per-shard to all-shards, using [sessionId](index-similarity-and-scoring.md)  and the [scoringStatistics=global](index-similarity-and-scoring.md#scoring-statistics)query parameters. These parameters are generally available.

+ Add a [featuresMode (preview)](index-similarity-and-scoring.md#featuresMode-param) query parameter to expand a relevance score to show more detail: per field similarity score, per field term frequency, and per field number of unique tokens matched. You can consume these data points in custom scoring algorithms. For a sample that demonstrates this capability, see [Add machine learning (LearnToRank) to search relevance](https://github.com/Azure-Samples/search-ranking-tutorial).

### March 2020

+ [Native blob soft delete (preview)](search-howto-indexing-azure-blob-storage.md#incremental-indexing-and-deletion-detection) means that the Azure Blob Storage indexer in Azure Cognitive Search will recognize blobs that are in a soft deleted state, and remove the corresponding search document during indexing.

+ New stable [Management REST API (2020-03-13)](https://docs.microsoft.com/rest/api/searchmanagement/management-api-versions) is now generally available. 

### February 2020

+ [PII Detection (preview)](cognitive-search-skill-pii-detection.md) is a cognitive skill used during indexing that extracts personally identifiable information from an input text and gives you the option to mask it from that text in various ways.

+ [Custom Entity Lookup (preview)](cognitive-search-skill-custom-entity-lookup.md ) looks for text from a custom, user-defined list of words and phrases. Using this list, it labels all documents with any matching entities. The skill also supports a degree of fuzzy matching that can be applied to find matches that are similar but not quite exact. 

### January 2020

+ [Customer-managed encryption keys](search-security-manage-encryption-keys.md) is now generally available. If you are using REST, you can access the feature using `api-version=2019-05-06` or later. For managed code, the correct package is still [.NET SDK version 8.0-preview](search-dotnet-sdk-migration-version-9.md) even though the feature is out of preview. 

+ Private access to a search service is available through two mechanisms, both currently in preview:

  + You can restrict access to specific IP addresses by using the Management REST API  `api-version=2019-10-01-Preview` to create the service. The preview API has new **IpRule** and **NetworkRuleSet** properties in [CreateOrUpdate API](https://docs.microsoft.com/rest/api/searchmanagement/2019-10-01-preview/createorupdate-service). This preview feature is available in selected regions. For more information, see [How to use the Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/search-howto-management-rest-api).

### December 2019

+ [Create app (preview)](search-create-app-portal.md) is a new wizard in the portal that generates a downloadable HTML file. The file comes with embedded script that renders an operational "localhost"-style web app, bound to an index on your search service. Pages are configurable in the wizard and can contain a search bar, results area, sidebar navigation, and typeahead query support. You can modify the HTML offline to extend or customize the workflow or appearance.

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

+ Generally available in [Azure Government Cloud](../azure-government/documentation-government-services-webandmobile.md#azure-cognitive-search).

<a name="new-service-name"></a>

## New service name

Azure Search is now renamed to **Azure Cognitive Search** to reflect the expanded (yet optional) use of cognitive skills and AI processing in core operations. API versions, NuGet packages, namespaces, and endpoints are unchanged. New and existing search solutions are unaffected by the service name change.

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.