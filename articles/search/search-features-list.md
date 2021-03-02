---
title: Feature overview
titleSuffix: Azure Cognitive Search
description: Explore the feature categories of Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/15/2020
---
# Features of Azure Cognitive Search

Azure Cognitive Search provides a full-text search engine, persistent storage of search indexes, integrated AI used during indexing to extract more text and structure, and APIs and tools. The following table summarizes features by category. For more information about how Cognitive Search compares with other search technologies, see [What is Azure Cognitive Search?](search-what-is-azure-search.md).

## Indexing features

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
| Data sources | Search indexes can accept text from any source, provided it is submitted as a JSON document. <br/><br/> [**Indexers**](search-indexer-overview.md) automate data ingestion from supported Azure data sources and handle JSON serialization. Connect to [Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), [Azure Cosmos DB](search-howto-index-cosmosdb.md), or [Azure Blob storage](search-howto-indexing-azure-blob-storage.md) to extract searchable content in primary data stores. Azure Blob indexers can perform *document cracking* to [extract text from  major file formats](search-howto-indexing-azure-blob-storage.md), including Microsoft Office, PDF, and HTML documents. |
| Hierarchical and nested data structures | [**Complex types**](search-howto-complex-data-types.md) and collections allow you to model virtually any type of JSON structure within a search index. One-to-many and many-to-many cardinality can be expressed natively through collections, complex types, and collections of complex types.|
| Linguistic analysis | Analyzers are components used for text processing during indexing and search operations. By default, you can use the general-purpose Standard Lucene analyzer, or override the default with a language analyzer, a custom analyzer that you configure, or another predefined analyzer that produces tokens in the format you require. <br/><br/>[**Language analyzers**](index-add-language-analyzers.md) from Lucene or Microsoft are used to intelligently handle language-specific linguistics including verb tenses, gender, irregular plural nouns (for example, 'mouse' vs. 'mice'), word de-compounding, word-breaking (for languages with no spaces), and more. <br/><br/>[**Custom lexical analyzers**](index-add-custom-analyzers.md) are used for complex query forms such as phonetic matching and regular expressions.<br/><br/> |

## AI enrichment and knowledge mining

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
|AI processing during indexing | [**AI enrichment**](cognitive-search-concept-intro.md) for image and text analysis can be applied to an indexing pipeline to extract text information from raw content. A few examples of [built-in skills](cognitive-search-predefined-skills.md) include optical character recognition (making scanned JPEGs searchable), entity recognition (identifying an organization, name, or location), and key phrase recognition. You can also [code custom skills](cognitive-search-create-custom-skill-example.md) to attach to the pipeline. You can also [integrate Azure Machine Learning authored skills](./cognitive-search-tutorial-aml-custom-skill.md). |
| Storing enriched content for analysis and consumption in non-search scenarios | [**Knowledge store**](knowledge-store-concept-intro.md) is an alternative output of an indexing pipeline. Instead of sending tokenized terms to an index, you can send enriched documents created by the indexing pipeline to a knowledge store, resident in either Azure Blob storage or Table storage, depending on the configuration. Knowledge stores are created from AI-based indexing (skillsets). The purpose of a knowledge store is to support downstream analysis or processing. With new information and structures in a knowledge store, you can attach it to a machine learning process or connect from Power BI to explore the data.<br/><br/> |
| Cached content | [**Incremental enrichment (preview)**](cognitive-search-incremental-indexing-conceptual.md) limits processing to just the documents that are changed by specific edits to the pipeline, using cached content for the parts of the pipeline that do not change. |

## Query and user experience

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
|Free-form text search | [**Full-text search**](search-lucene-query-architecture.md) is a primary use case for most search-based apps. Queries can be formulated using a supported syntax. <br/><br/>[**Simple query syntax**](query-simple-syntax.md) provides logical operators, phrase search operators, suffix operators, precedence operators.<br/><br/>[**Full Lucene query syntax**](query-lucene-syntax.md) includes all operations in simple syntax, with extensions for fuzzy search, proximity search, term boosting, and regular expressions.|
| Relevance | [**Simple scoring**](index-add-scoring-profiles.md) is a key benefit of Azure Cognitive Search. Scoring profiles are used to model relevance as a function of values in the documents themselves. For example, you might want newer products or discounted products to appear higher in the search results. You can also build scoring profiles using tags for personalized scoring based on customer search preferences you've tracked and stored separately. |
| Geo-search | Azure Cognitive Search processes, filters, and displays geographic locations. It enables users to explore data based on the proximity of a search result to a physical location. [Watch this video](https://channel9.msdn.com/Shows/Data-Exposed/Azure-Search-and-Geospatial-Data) or [review this sample](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs) to learn more. |
| Filters and facets | [**Faceted navigation**](search-faceted-navigation.md) is enabled through a single query parameter. Azure Cognitive Search returns a faceted navigation structure you can use as the code behind a categories list, for self-directed filtering (for example, to filter catalog items by price-range or brand). <br/><br/> [**Filters**](query-odata-filter-orderby-syntax.md) can be used to incorporate faceted navigation into your application's UI, enhance query formulation, and filter based on user- or developer-specified criteria. Create filters using the OData syntax. |
| User experience | [**Autocomplete**](search-autocomplete-tutorial.md) can be enabled for type-ahead queries in a search bar. <br/><br/>[**Search suggestions**](/rest/api/searchservice/suggesters) also works off of partial text inputs in a search bar, but the results are actual documents in your index rather than query terms. <br/><br/>[**Synonyms**](search-synonyms.md) associates equivalent terms that implicitly expand the scope of a query, without the user having to provide the alternate terms. <br/><br/>[**Hit highlighting**](/rest/api/searchservice/Search-Documents) applies text formatting to a matching keyword in search results. You can choose which fields return highlighted snippets.<br/><br/>[**Sorting**](/rest/api/searchservice/Search-Documents) is offered for multiple fields via the index schema and then toggled at query-time with a single search parameter.<br/><br/> [**Paging**](search-pagination-page-layout.md) and throttling your search results is straightforward with the finely tuned control that Azure Cognitive Search offers over your search results.  <br/><br/>|

## Security features

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
| Data encryption | [**Microsoft-managed encryption-at-rest**](search-security-overview.md#encryption) is built into the internal storage layer and is irrevocable. <br/><br/>[**Customer-managed encryption keys**](search-security-manage-encryption-keys.md) that you create and manage in Azure Key Vault can be used for supplemental encryption of indexes and synonym maps. For services created after August 1 2020, CMK encryption extends to data on temporary disks, for full double encryption of indexed content.|
| Endpoint protection | [**IP rules for inbound firewall support**](service-configure-firewall.md) allows you to set up IP ranges over which the search service will accept requests.<br/><br/>[**Create a private endpoint**](service-create-private-endpoint.md) using Azure Private Link to force all requests through a virtual network. |
| Outbound security (indexers) | [**Data access through private endpoints**](search-indexer-howto-access-private.md) allows an indexer to connect to Azure resources that are protected through Azure Private Link.<br/><br/>[**Data access using a trusted identity**](search-howto-managed-identities-data-sources.md) means that connection strings to external data sources can omit user names and passwords. When an indexer connects to the data source, the resource allows the connection if the search service was previously registered as a trusted service. |

## Portal features

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
| Tools for prototyping and inspection | [**Add index**](search-what-is-an-index.md) is an index designer in the portal that you can use to create a basic schema consisting of attributed fields and a few other settings. After saving the index, you can populate it using an SDK or the REST API to provide the data. <br/><br/>[**Import data wizard**](search-import-data-portal.md) creates indexes, indexers, skillsets, and data source definitions. If your data exists in Azure, this wizard can save you significant time and effort, especially for proof-of-concept investigation and exploration. <br/><br/>[**Search explorer**](search-explorer.md) is used to test queries and refine scoring profiles.<br/><br/>[**Create demo app**](search-create-app-portal.md) is used to generate an HTML page that can be used to test the search experience.  |
| Monitoring and diagnostics | [**Enable monitoring features**](search-monitor-usage.md) to go beyond the metrics-at-a-glance that are always visible in the portal. Metrics on queries per second, latency, and throttling are captured and reported in portal pages with no additional configuration required.|

## Programmability

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
| REST | [**Service REST API**](/rest/api/searchservice/) is for data plane operations, including all operations related to indexing, queries, and AI enrichment. You can also use this client library to retrieve system information and statistics. <br/><br/>[**Management REST API**](/rest/api/searchmanagement/) is for service creation and clean up through Azure Resource Manager. You can also use this API to manage keys and provision a service.|
| Azure SDK for .NET | [**Azure.Search.Documents**](/dotnet/api/overview/azure/search.documents-readme) is for data plane operations, including all operations related to indexing, queries, and AI enrichment. You can also use this client library to retrieve system information and statistics. <br/><br/>[**Microsoft.Azure.Management.Search**](/dotnet/api/microsoft.azure.management.search) is for service creation and clean up through Azure Resource Manager. You can also use this API to manage keys and provision a service.|
| Azure SDK for Java | [**com.azure.search.documents**](/java/api/com.azure.search.documents) is for data plane operations, including all operations related to indexing, queries, and AI enrichment. You can also use this client library to retrieve system information and statistics. <br/><br/>[**com.microsoft.azure.management.search**](/java/api/overview/azure/search/management) is for service creation and clean up through Azure Resource Manager. You can also use this API to manage keys and provision a service.|
| Azure SDK for Python | [**azure-search-documents**](/python/api/overview/azure/search-documents-readme) is for data plane operations, including all operations related to indexing, queries, and AI enrichment. You can also use this client library to retrieve system information and statistics. <br/><br/>[**azure-mgmt-search**](/python/api/overview/azure/search/management) is for service creation and clean up through Azure Resource Manager. You can also use this API to manage keys and provision a service. |
| Azure SDK for JavaScript/TypeScript | [**azure/search-documents**](/javascript/api/@azure/search-documents/) is for data plane operations, including all operations related to indexing, queries, and AI enrichment. You can also use this client library to retrieve system information and statistics. <br/><br/>[**azure/arm-search**](/javascript/api/@azure/arm-search/) is for service creation and clean up through Azure Resource Manager. You can also use this API to manage keys and provision a service. |

## See also

+ [What's new in Cognitive Search](whats-new.md)

+ [Preview features in Cognitive Search](search-api-preview.md)