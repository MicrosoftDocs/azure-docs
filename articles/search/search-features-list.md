---
title: Feature descriptions
titleSuffix: Azure AI Search
description: Explore the feature categories of Azure AI Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/01/2023
---
# Features of Azure AI Search

Azure AI Search provides information retrieval and uses optional AI integration to extract more text and structure content. 

The following table summarizes features by category. For more information about how Azure AI Search compares with other search technologies, see [Compare search options](search-what-is-azure-search.md#compare-search-options).

There's feature parity in all Azure public, private, and sovereign clouds, but some features aren't supported in specific regions. For more information, see [product availability by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=search&regions=all&rar=true).

> [!NOTE]
> Looking for preview features? See the [preview features list](search-api-preview.md).

## Indexing features

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
| Data sources | Search indexes can accept text from any source, provided it's submitted as a JSON document. <br/><br/> [**Indexers**](search-indexer-overview.md) are a feature that automates data import from supported data sources to extract searchable content in primary data stores. Indexers handle JSON serialization for you and most support some form of change and deletion detection. You can connect to a [variety of data sources](search-data-sources-gallery.md), including [Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), [Azure Cosmos DB](search-howto-index-cosmosdb.md), or [Azure Blob storage](search-howto-indexing-azure-blob-storage.md). |
| Hierarchical and nested data structures | [**Complex types**](search-howto-complex-data-types.md) and collections allow you to model virtually any type of JSON structure within a search index. One-to-many and many-to-many cardinality can be expressed natively through collections, complex types, and collections of complex types.|
| Linguistic analysis | Analyzers are components used for text processing during indexing and search operations. By default, you can use the general-purpose Standard Lucene analyzer, or override the default with a language analyzer, a custom analyzer that you configure, or another predefined analyzer that produces tokens in the format you require. <br/><br/>[**Language analyzers**](index-add-language-analyzers.md) from Lucene or Microsoft are used to intelligently handle language-specific linguistics including verb tenses, gender, irregular plural nouns (for example, 'mouse' vs. 'mice'), word de-compounding, word-breaking (for languages with no spaces), and more. <br/><br/>[**Custom lexical analyzers**](index-add-custom-analyzers.md) are used for complex query forms such as phonetic matching and regular expressions.<br/><br/> |

## Vector and hybrid search

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
| Vector indexing | Within a search index, add [vector fields](vector-search-how-to-create-index.md) to support  [**vector search**](vector-search-overview.md) scenarios. Vector fields can co-exist with nonvector fields in the same search document. |
| Vector queries | [Formulate single and multiple vector queries](vector-search-how-to-query.md). |
| Vector search algorithms | Use [Hierarchical Navigable Small World (HNSW)](vector-search-ranking.md#when-to-use-hnsw) or [exhaustive K-Nearest Neighbors (KNN)](vector-search-ranking.md#when-to-use-exhaustive-knn) to find similar vectors in a search index. |
| Vector filters | [Apply filters before or after query execution](vector-search-filters.md) for greater precision during information retrieval. |
| Hybrid information retrieval | Search for concepts and keywords in a single [hybrid query request](hybrid-search-how-to-query.md). </p>[**Hybrid search**](hybrid-search-overview.md) consolidates vector and text search, with optional semantic ranking and relevance tuning for best results.|
| Integrated data chunking and vectorization (preview) | Native data chunking through [Text Split skill](cognitive-search-skill-textsplit.md) and native vectorization through [vectorizers](vector-search-how-to-configure-vectorizer.md)  and the [AzureOpenAIEmbeddingModel skill](cognitive-search-skill-azure-openai-embedding.md). </p>[**Integrated vectorization** (preview)](vector-search-integrated-vectorization.md) provides an end-to-end indexing pipeline from source files to queries.|
| **Import and vectorize data** (preview)| A [new wizard](search-get-started-portal-import-vectors.md) in the Azure portal that creates a full indexing pipeline that includes data chunking and vectorization. The wizard creates all of the objects and configuration settings. |

## AI enrichment and knowledge mining

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
|AI processing during indexing | [**AI enrichment**](cognitive-search-concept-intro.md) refers to embedded image and natural language processing in an indexer pipeline that extracts text and information from content that can't otherwise be indexed for full text search. AI processing is achieved by adding and combining skills in a skillset, which is then attached to an indexer. AI can be either [built-in skills](cognitive-search-predefined-skills.md) from Microsoft, such as text translation or Optical Character Recognition (OCR), or [custom skills](cognitive-search-create-custom-skill-example.md) that you provide. |
| Storing enriched content for analysis and consumption in non-search scenarios | [**Knowledge store**](knowledge-store-concept-intro.md) is persistent storage of enriched content, intended for non-search scenarios like knowledge mining and data science processing. A knowledge store is defined in a skillset, but created in Azure Storage as objects or tabular rowsets.|
| Cached enrichments | [**Incremental enrichment (preview)**](cognitive-search-incremental-indexing-conceptual.md) refers to cached enrichments that can be reused during skillset execution. Caching is particularly valuable in skillsets that include OCR and image analysis, which are expensive to process. |

## Query and user experience

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
|Free-form text search | [**Full-text search**](search-lucene-query-architecture.md) is a primary use case for most search-based apps. Queries can be formulated using a supported syntax. <br/><br/>[**Simple query syntax**](query-simple-syntax.md) provides logical operators, phrase search operators, suffix operators, precedence operators. <br/><br/>[**Full Lucene query syntax**](query-lucene-syntax.md) includes all operations in simple syntax, with extensions for fuzzy search, proximity search, term boosting, and regular expressions.|
| Relevance | [**Simple scoring**](index-add-scoring-profiles.md) is a key benefit of Azure AI Search. Scoring profiles are used to model relevance as a function of values in the documents themselves. For example, you might want newer products or discounted products to appear higher in the search results. You can also build scoring profiles using tags for personalized scoring based on customer search preferences you've tracked and stored separately. <br/><br/>[**Semantic ranking**](semantic-search-overview.md) is premium feature that reranks results based on semantic relevance to the query. Depending on your content and scenario, it can significantly improve search relevance with almost minimal configuration or effort. |
| Geospatial search | [**Geospatial functions**](search-query-odata-geo-spatial-functions.md) filter over and match on geographic coordinates. You can [match on distance](search-query-simple-examples.md#example-6-geospatial-search) or by inclusion in a polygon shape. |
| Filters and facets | [**Faceted navigation**](search-faceted-navigation.md) is enabled through a single query parameter. Azure AI Search returns a faceted navigation structure you can use as the code behind a categories list, for self-directed filtering (for example, to filter catalog items by price-range or brand). <br/><br/> [**Filters**](query-odata-filter-orderby-syntax.md) can be used to incorporate faceted navigation into your application's UI, enhance query formulation, and filter based on user- or developer-specified criteria. Create filters using the OData syntax. |
| User experience | [**Autocomplete**](search-add-autocomplete-suggestions.md) can be enabled for type-ahead queries in a search bar. <br/><br/>[**Search suggestions**](/rest/api/searchservice/suggesters) also works off of partial text inputs in a search bar, but the results are actual documents in your index rather than query terms. <br/><br/>[**Synonyms**](search-synonyms.md) associates equivalent terms that implicitly expand the scope of a query, without the user having to provide the alternate terms. <br/><br/>[**Hit highlighting**](/rest/api/searchservice/Search-Documents) applies text formatting to a matching keyword in search results. You can choose which fields return highlighted snippets.<br/><br/>[**Sorting**](/rest/api/searchservice/Search-Documents) is offered for multiple fields via the index schema and then toggled at query-time with a single search parameter.<br/><br/> [**Paging**](search-pagination-page-layout.md) and throttling your search results is straightforward with the finely tuned control that Azure AI Search offers over your search results.  <br/><br/>|

## Security features

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
| Data encryption | [**Microsoft-managed encryption-at-rest**](search-security-overview.md#encryption) is built into the internal storage layer and is irrevocable. <br/><br/>[**Customer-managed encryption keys**](search-security-manage-encryption-keys.md) that you create and manage in Azure Key Vault can be used for supplemental encryption of indexes and synonym maps. For services created after August 1 2020, CMK encryption extends to data on temporary disks, for full double encryption of indexed content.|
| Endpoint protection | [**IP rules for inbound firewall support**](service-configure-firewall.md) allows you to set up IP ranges over which the search service will accept requests.<br/><br/>[**Create a private endpoint**](service-create-private-endpoint.md) using Azure Private Link to force all requests through a virtual network. |
| Inbound access | [**Azure role-based access control**](search-security-rbac.md) assigns roles to users and groups in Microsoft Entra ID for controlled access to search content and operations. You can also use [**key-based authentication**](search-security-api-keys.md) if you don't have an Azure tenant.|
| Outbound security (indexers) | [**Data access through private endpoints**](search-indexer-howto-access-private.md) allows an indexer to connect to Azure resources that are protected through Azure Private Link.<br/><br/>[**Data access using a trusted identity**](search-howto-managed-identities-data-sources.md) means that connection strings to external data sources can omit user names and passwords. When an indexer connects to the data source, the resource allows the connection if the search service was previously registered as a trusted service. |

## Portal features

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
| Tools for prototyping and inspection | [**Add index**](search-what-is-an-index.md) is an index designer in the portal that you can use to create a basic schema consisting of attributed fields and a few other settings. After saving the index, you can populate it using an SDK or the REST API to provide the data. <br/><br/>[**Import data wizard**](search-import-data-portal.md) creates indexes, indexers, skillsets, and data source definitions. If your data exists in Azure, this wizard can save you significant time and effort, especially for proof-of-concept investigation and exploration. <br/><br/>[**Search explorer**](search-explorer.md) is used to test queries and refine scoring profiles.<br/><br/>[**Create demo app**](search-create-app-portal.md) is used to generate an HTML page that can be used to test the search experience.  <br/><br/>[**Debug Sessions**](cognitive-search-debug-session.md) is a visual editor that lets you debug a skillset interactively. It shows you dependencies, output, and transformations. |
| Monitoring and diagnostics | [**Enable monitoring features**](monitor-azure-cognitive-search.md) to go beyond the metrics-at-a-glance that are always visible in the portal. Metrics on queries per second, latency, and throttling are captured and reported in portal pages with no extra configuration required.|

## Programmability

| Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
| REST | [**Service REST API**](/rest/api/searchservice/) is for data plane operations, including all operations related to indexing, queries, and AI enrichment. You can also use this client library to retrieve system information and statistics. <br/><br/>[**Management REST API**](/rest/api/searchmanagement/) is for service creation and provisioning through Azure Resource Manager. You can also use this API to manage keys and capacity.|
| Azure SDK for .NET | [**Azure.Search.Documents**](/dotnet/api/overview/azure/search.documents-readme) is for data plane operations, including all operations related to indexing, queries, and AI enrichment. You can also use this client library to retrieve system information and statistics. <br/><br/>[**Microsoft.Azure.Management.Search**](/dotnet/api/microsoft.azure.management.search) is for service creation and provisioning through Azure Resource Manager. You can also use this API to manage keys and capacity.|
| Azure SDK for Java | [**com.azure.search.documents**](/java/api/com.azure.search.documents) is for data plane operations, including all operations related to indexing, queries, and AI enrichment. You can also use this client library to retrieve system information and statistics. <br/><br/>[**com.microsoft.azure.management.search**](/java/api/overview/azure/search/management) is for service creation and provisioning through Azure Resource Manager. You can also use this API to manage keys and capacity.|
| Azure SDK for Python | [**azure-search-documents**](/python/api/overview/azure/search-documents-readme) is for data plane operations, including all operations related to indexing, queries, and AI enrichment. You can also use this client library to retrieve system information and statistics. <br/><br/>[**azure-mgmt-search**](/python/api/azure-mgmt-search/) is for service creation and provisioning through Azure Resource Manager. You can also use this API to manage keys and capacity. |
| Azure SDK for JavaScript/TypeScript | [**azure/search-documents**](/javascript/api/@azure/search-documents/) is for data plane operations, including all operations related to indexing, queries, and AI enrichment. You can also use this client library to retrieve system information and statistics. <br/><br/>[**azure/arm-search**](/javascript/api/@azure/arm-search/) is for service creation and provisioning through Azure Resource Manager. You can also use this API to manage keys and capacity. |

## See also

+ [What's new in Azure AI Search](whats-new.md)

+ [Preview features in Azure AI Search](search-api-preview.md)
