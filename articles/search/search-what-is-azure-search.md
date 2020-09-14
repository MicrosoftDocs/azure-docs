---
title: Introduction to Azure Cognitive Search
titleSuffix: Azure Cognitive Search
description: Azure Cognitive  Search is a fully-managed cloud search service from Microsoft. Learn about features, the development workflow, comparisons to other Microsoft search products, and how to get started.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: overview
ms.date: 09/15/2020
---
# What is Azure Cognitive Search?

Azure Cognitive Search ([formerly known as "Azure Search"](whats-new.md#new-service-name)) is a cloud search service that provides an indexing engine, a query engine, persistent storage of search indexes, and other constructs that you need to create a rich search experience over private, heterogeneous content in web, mobile, and enterprise applications.

Cognitive Search sits between two primary workloads in your end-to-end solution: *indexing* data from external sources, and handling *queries* from a client app.

![Azure Cognitive Search architecture](media/search-what-is-azure-search/azure-search-diagram.svg "Azure Cognitive Search architecture")

During development, your code or a tool defines an index schema and loads data into your search service. Optionally, you can add cognitive skills during indexing to apply AI processes. Doing so can create new information and structures useful for search and knowledge mining scenarios.

Once an index exists, your client app sends requests to a search service and handles responses. The search experience is defined in your client using APIs from Azure Cognitive Search, with query execution over a persisted index that you create, own, and store in your service.

Functionality is exposed through a simple [REST API](/rest/api/searchservice/) or [.NET SDK](search-howto-dotnet-sdk.md) that masks the inherent complexity of information retrieval. You can also use the Azure portal for administration and content management, with tools for prototyping and querying your indexes. Because the service runs in the cloud, infrastructure and availability are managed by Microsoft.

## When to use Azure Cognitive Search

Azure Cognitive Search is well-suited for the following application scenarios:

+ Consolidation of heterogeneous content types into a private, single, searchable index. You can populate a search index with streams of JSON documents from any source. For supported sources on Azure, use an *indexer* to automate indexing. Control over the index schema and refresh schedule is a key reason for using Azure Cognitive Search.

+ Easy implementation of search-related features. Azure Cognitive Search APIs simplify query construction, faceted navigation, filters (including geo-spatial search), synonym mapping, autocomplete, and relevance tuning. Using built-in features, you can satisfy end-user expectations for a search experience similar to commercial web search engines.

+ Raw content is large undifferentiated text from Azure Blob storage or Cosmos DB. You can apply [cognitive skills](cognitive-search-concept-intro.md) during indexing to add structure to raw text.

+ Raw content is in image (JPEG or PNG) files, or in application files (such as Office content types) in an Azure data source. Use [cognitive skills](cognitive-search-concept-intro.md) to apply OCR over scanned documents, entity recognition and key phrase extraction over large documents, language detection and text translation, and sentiment analysis.

+ Linguistic requirements satisfied using the custom and language analyzers of Azure Cognitive Search. If you have non-English content, Azure Cognitive Search supports both Lucene analyzers and Microsoft's natural language processors. You can also configure analyzers to achieve specialized processing of raw content, such as filtering out diacritics.

<a name="feature-drilldown"></a>

## Feature descriptions

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

## How to use Azure Cognitive Search

### Step 1: Provision service

You can [create a free service](search-create-service-portal.md) shared with other subscribers, or a [paid tier](https://azure.microsoft.com/pricing/details/search/) that dedicates resources used only by your service. All quickstarts and tutorials can be completed on the free service.

For paid tiers, you can scale a service in two dimensions to calibrate resourcing based on production requirements:

+ Add Replicas to grow your capacity to handle heavy query loads
+ Add Partitions to grow storage for more documents

### Step 2: Create an index

Define an index schema to map to reflect the structure of the documents you wish to search, similar to fields in a database.. A search index is a specialized data structure that is optimized for very fast query execution.

It's common to [create the index schema in the Azure portal](search-what-is-an-index.md), or programmatically using the [.NET SDK](search-howto-dotnet-sdk.md) or [REST API](/rest/api/searchservice/).

### Step 3: Load data

After you define an index, you're ready to upload content. You can use either a push or pull model.

The push model "pushes" JSON documents into an index using APIs from an [SDK](search-howto-dotnet-sdk.md) or [REST](/rest/api/searchservice/addupdate-or-delete-documents). The external dataset can be virtually any data source as long as the documents are JSON.

The pull model "pulls" data from sources on Azure and sends it to a search index. The pull model is implemented through [*indexers*](/rest/api/searchservice/Indexer-operations) that streamline and automate aspects of data ingestion, such as connecting to, reading, and serializing data. Supported data sources include Azure Cosmos DB, Azure SQL, and Azure Storage.

### Step 4: Send queries and handle responses

After populating an index, you can [issue search queries](search-query-overview.md) to your service endpoint using simple HTTP requests with [REST API](/rest/api/searchservice/Search-Documents) or the [.NET SDK](/dotnet/api/microsoft.azure.search.idocumentsoperations).

Step through [Create your first search app](tutorial-csharp-create-first-app.md) to build and then extend a web page that collects user input and handles results. You can also use [Postman for interactive REST](search-get-started-postman.md) calls or the built-in [Search Explorer](search-explorer.md) in Azure portal to query an existing index.

## How it compares

Customers often ask how Azure Cognitive Search compares with other search-related solutions. The following table summarizes key differences.

| Compared to | Key differences |
|-------------|-----------------|
|Bing | [Bing Web Search API](../cognitive-services/bing-web-search/index.yml) searches the indexes on Bing.com for matching terms you submit. Indexes are built from HTML, XML, and other web content on public sites. Built on the same foundation, [Bing Custom Search](/azure/cognitive-services/bing-custom-search/) offers the same crawler technology for web content types, scoped to individual web sites.<br/><br/>Azure Cognitive Search searches an index you define, populated with data and documents you own, often from diverse sources. Azure Cognitive Search has crawler capabilities for some data sources through [indexers](search-indexer-overview.md), but you can push any JSON document that conforms to your index schema into a single, consolidated searchable resource. |
|Database search | Many database platforms include a built-in search experience. SQL Server has [full text search](/sql/relational-databases/search/full-text-search). Cosmos DB and similar technologies have queryable indexes. When evaluating products that combine search and storage, it can be challenging to determine which way to go. Many solutions use both: DBMS for storage, and Azure Cognitive Search for specialized search features.<br/><br/>Compared to DBMS search, Azure Cognitive Search stores content from heterogeneous sources and offers specialized text processing features such as linguistic-aware text processing (stemming, lemmatization, word forms) in [56 languages](/rest/api/searchservice/language-support). It also supports autocorrection of misspelled words, [synonyms](/rest/api/searchservice/synonym-map-operations), [suggestions](/rest/api/searchservice/suggestions), [scoring controls](/rest/api/searchservice/add-scoring-profiles-to-a-search-index), [facets](./search-filters-facets.md),  and [custom tokenization](/rest/api/searchservice/custom-analyzers-in-azure-search). The [full text search engine](search-lucene-query-architecture.md) in Azure Cognitive Search is built on Apache Lucene, an industry standard in information retrieval. While Azure Cognitive Search persists data in the form of an inverted index, it is rarely a replacement for true data storage. For more information, see this [forum post](https://stackoverflow.com/questions/40101159/can-azure-search-be-used-as-a-primary-database-for-some-data). <br/><br/>Resource utilization is another inflection point in this category. Indexing and some query operations are often computationally intensive. Offloading search from the DBMS to a dedicated solution in the cloud preserves system resources for transaction processing. Furthermore, by externalizing search, you can easily adjust scale to match query volume.|
|Dedicated search solution | Assuming you have decided on dedicated search with full spectrum functionality, a final categorical comparison is between on premises solutions or a cloud service. Many search technologies offer controls over indexing and query pipelines, access to richer query and filtering syntax, control over rank and relevance, and features for self-directed and intelligent search. <br/><br/>A cloud service is the right choice if you want a turn-key solution with minimal overhead and maintenance, and adjustable scale. <br/><br/>Within the cloud paradigm, several providers offer comparable baseline features, with full-text search, geo-search, and the ability to handle a certain level of ambiguity in search inputs. Typically, it's a [specialized feature](#feature-drilldown), or the ease and overall simplicity of APIs, tools, and management that determines the best fit. |

Among cloud providers, Azure Cognitive Search is strongest for full text search workloads over content stores and databases on Azure, for apps that rely primarily on search for both information retrieval and content navigation. 

Key strengths include:

+ Azure data integration (crawlers) at the indexing layer
+ Azure portal for central management
+ Azure scale, reliability, and world-class availability
+ AI processing of raw data to make it more searchable, including text from images, or finding patterns in unstructured content.
+ Linguistic and custom analysis, with analyzers for solid full text search in 56 languages
+ [Core features common to search-centric apps](#feature-drilldown): scoring, faceting, suggestions, synonyms, geo-search, and more.

> [!Note]
> Non-Azure data sources are fully supported, but rely on a more code-intensive push methodology rather than indexers. Using APIs, you can pipe any JSON document collection to an Azure Cognitive Search index.

Among our customers, those able to leverage the widest range of features in Azure Cognitive Search include online catalogs, line-of-business programs, and document discovery applications.

## Watch this video

In this 15-minute video, program manager Luis Cabrera introduces Azure Cognitive Search.

>[!VIDEO https://www.youtube.com/embed/kOJU0YZodVk?version=3]