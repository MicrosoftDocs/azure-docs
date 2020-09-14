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

Azure Cognitive Search gives developers APIs and tools for adding a rich search experience over private, heterogeneous content in web, mobile, and enterprise applications. The following table summarizes features by category. For more information about how Cognitive Search compares with other search technologies, see [What is Azure Cognitive Search](search-what-is-azure-search.md).

| Core&nbsp;search&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Features |
|-------------------|----------|
|Free-form text search | [**Full-text search**](search-lucene-query-architecture.md) is a primary use case for most search-based apps. Queries can be formulated using a supported syntax. <br/><br/>[**Simple query syntax**](query-simple-syntax.md) provides logical operators, phrase search operators, suffix operators, precedence operators.<br/><br/>[**Lucene query syntax**](query-lucene-syntax.md) includes all operations in simple syntax, with extensions for fuzzy search, proximity search, term boosting, and regular expressions.|
| Relevance | [**Simple scoring**](index-add-scoring-profiles.md) is a key benefit of Azure Cognitive Search. Scoring profiles are used to model relevance as a function of values in the documents themselves. For example, you might want newer products or discounted products to appear higher in the search results. You can also build scoring profiles using tags for personalized scoring based on customer search preferences you've tracked and stored separately. |
| Geo-search | Azure Cognitive Search processes, filters, and displays geographic locations. It enables users to explore data based on the proximity of a search result to a physical location. [Watch this video](https://channel9.msdn.com/Shows/Data-Exposed/Azure-Search-and-Geospatial-Data) or [review this sample](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs) to learn more. |
| Filters and facets | [**Faceted navigation**](search-faceted-navigation.md) is enabled through a single query parameter. Azure Cognitive Search returns a faceted navigation structure you can use as the code behind a categories list, for self-directed filtering (for example, to filter catalog items by price-range or brand). <br/><br/> [**Filters**](query-odata-filter-orderby-syntax.md) can be used to incorporate faceted navigation into your application's UI, enhance query formulation, and filter based on user- or developer-specified criteria. Create filters using the OData syntax. |
| User experience features | [**Autocomplete**](search-autocomplete-tutorial.md) can be enabled for type-ahead queries in a search bar. <br/><br/>[**Search suggestions**](/rest/api/searchservice/suggesters) also works off of partial text inputs in a search bar, but the results are actual documents in your index rather than query terms. <br/><br/>[**Synonyms**](search-synonyms.md) associates equivalent terms that implicitly expand the scope of a query, without the user having to provide the alternate terms. <br/><br/>[**Hit highlighting**](/rest/api/searchservice/Search-Documents) applies text formatting to a matching keyword in search results. You can choose which fields return highlighted snippets.<br/><br/>[**Sorting**](/rest/api/searchservice/Search-Documents) is offered for multiple fields via the index schema and then toggled at query-time with a single search parameter.<br/><br/> [**Paging**](search-pagination-page-layout.md) and throttling your search results is straightforward with the finely tuned control that Azure Cognitive Search offers over your search results.  <br/><br/>|

| AI&nbsp;enrichment&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       | Features |
|-------------------|----------|
|AI processing during indexing | [**AI enrichment**](cognitive-search-concept-intro.md) for image and text analysis can be applied to an indexing pipeline to extract text information from raw content. A few examples of [built-in skills](cognitive-search-predefined-skills.md) include optical character recognition (making scanned JPEGs searchable), entity recognition (identifying an organization, name, or location), and key phrase recognition. You can also [code custom skills](cognitive-search-create-custom-skill-example.md) to attach to the pipeline. You can also [integrate Azure Machine Learning authored skills](./cognitive-search-tutorial-aml-custom-skill.md). |
| Storing enriched content for analysis and consumption in non-search scenarios | [**Knowledge store**](knowledge-store-concept-intro.md) is an extension of AI-based indexing. With Azure Storage as a backend, you can save enrichments created during indexing. These artifacts can be used to help you design better skillsets, or create shape and structure out of  amorphous or ambiguous data. You can create projections of these structures that target specific workloads or users. You can also directly analyze the extracted data, or load it into other apps.<br/><br/> |
| Cached content | [**Incremental enrichment (preview)**](cognitive-search-incremental-indexing-conceptual.md) limits processing to just the documents that are changed by specific edit to the pipeline, using cached content for the parts of the pipeline that do not change. |

| Data&nbsp;import/indexing | Features |
|----------------------------------|----------|
| Data sources | Azure Cognitive Search indexes accept data from any source, provided it is submitted as a JSON data structure. <br/><br/> [**Indexers**](search-indexer-overview.md) automate data ingestion for supported Azure data sources and handle JSON serialization. Connect to [Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), [Azure Cosmos DB](search-howto-index-cosmosdb.md), or [Azure Blob storage](search-howto-indexing-azure-blob-storage.md) to extract searchable content in primary data stores. Azure Blob indexers can perform *document cracking* to [extract text from  major file formats](search-howto-indexing-azure-blob-storage.md), including Microsoft Office, PDF, and HTML documents. |
| Hierarchical and nested data structures | [**Complex types**](search-howto-complex-data-types.md) and collections allow you to model virtually any type of JSON structure as an Azure Cognitive Search index. One-to-many and many-to-many cardinality can be expressed natively through collections, complex types, and collections of complex types.|
| Linguistic analysis | Analyzers are components used for text processing during indexing and search operations. There are two types. <br/><br/>[**Custom lexical analyzers**](index-add-custom-analyzers.md) are used for complex search queries using phonetic matching and regular expressions. <br/><br/>[**Language analyzers**](index-add-language-analyzers.md) from Lucene or Microsoft are used to intelligently handle language-specific linguistics including verb tenses, gender, irregular plural nouns (for example, 'mouse' vs. 'mice'), word de-compounding, word-breaking (for languages with no spaces), and more. <br/><br/>|


| Platform&nbsp;level&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Features |
|-------------------|----------|
| Tools for prototyping and inspection | In the portal, you can use the [**Import data wizard**](search-import-data-portal.md) to configure indexers, index designer to stand up an index, and [**Search explorer**](search-explorer.md) to test queries and refine scoring profiles. You can also open any index to view its schema. |
| Monitoring and diagnostics | [**Enable monitoring features**](search-monitor-usage.md) to go beyond the metrics-at-a-glance that are always visible in the portal. Metrics on queries per second, latency, and throttling are captured and reported in portal pages with no additional configuration required.|
| Server-side encryption | [**Microsoft-managed encryption-at-rest**](search-security-overview.md#encrypted-transmissions-and-storage) is built into the internal storage layer and is irrevocable. Optionally, you can supplement the default encryption with [**customer-managed encryption keys**](search-security-manage-encryption-keys.md). Keys that you create and manage in Azure Key Vault are used to encrypt indexes and synonym maps in Azure Cognitive Search. |
| Infrastructure | The **highly available platform** ensures an extremely reliable search service experience. When scaled properly, [Azure Cognitive Search offers a 99.9% SLA](https://azure.microsoft.com/support/legal/sla/search/v1_0/).<br/><br/> **Fully managed and scalable** as an end-to-end solution, Azure Cognitive Search requires absolutely no infrastructure management. Your service can be tailored to your needs by scaling in two dimensions to handle more document storage, higher query loads, or both.<br/><br/>|

## See also

+ [What's new](whats-new.md)

+ [Preview features](search-api-preview.md)