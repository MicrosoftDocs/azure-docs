---
title: What is Azure Search | Microsoft Docs
description: Azure Search is a fully-managed hosted cloud search service. Learn more in this feature overview.
services: search
manager: jhubbard
author: ashmaka
documentationcenter: ''

ms.assetid: 50bed849-b716-4cc9-bbbc-b5b34e2c6153
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 06/26/2017
ms.author: ashmaka
---
# What is Azure Search?
Azure Search is a search-as-a-service cloud solution that gives developers APIs and tooling for adding a rich, scoped search experience to web, mobile, and enterprise applications.

Functionality is exposed through a simple [REST API](/rest/api/searchservice/) or [.NET SDK](search-howto-dotnet-sdk.md) that masks the inherent icomplexities of search technologies. In addition to APIs, you can use the Azure portal for service management, index management, query testing, and prototyping. Infrastructure and availability are managed by Microsoft.

<a name="feature-drilldown"></a>

## Feature summary

| Category | Features |
|----------|----------|
|Full text search and text analysis | [Full text search](search-lucene-query-architecture.md) is a primary use case for most search-based apps. Queries can be formulated using either syntax: <br/><br/>A [simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search), which offers logical operators, phrase search operators, suffix operators, precedence operators.<br/><br/>The [Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) can enable fuzzy search, proximity search, term boosting, and regular expressions.| 
| Data integration | Azure Search indexes can contain data from any source, provided it is submitted as a JSON data sturcture. <br/><br/> Optionally, for supported data sources in Azure, you can use [indexers](search-indexer-overview.md) to automatically crawl [Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), [Azure Cosmos DB](search-howto-index-documentdb.md), or [Azure Blob storage](search-howto-indexing-azure-blob-storage.md) to sync your search index's content with your primary data store. Azure Blob indexers can perform *document cracking* for [indexing major file formats](search-howto-indexing-azure-blob-storage.md), including Microsoft Office, PDF, and HTML documents. |
| Search analytics | Azure Search provides [custom lexical analyzers](https://docs.microsoft.com/rest/api/searchservice/custom-analyzers-in-azure-search) for handline complex search queries using phonetic matching and regular expressions. |
| Language support | You can use most Lucene language analyzers as well as Microsoft's natural language processors avaialble in [56 different languages](https://docs.microsoft.com/rest/api/searchservice/language-support) to intelligently handle language-specific linguistics including verb tenses, gender, irregular plural nouns (for example, 'mouse' vs. 'mice'), word de-compounding, word-breaking (for languages with no spaces), and more. |
| Geo-search | Azure Search intelligently processes, filters, and displays geographic locations. It enables users to explore data based on the proximity of a search result to a physical location. [Watch this video](https://channel9.msdn.com/Shows/Data-Exposed/Azure-Search-and-Geospatial-Data) to learn how it works. |
| User experience features | **Search suggestions** can be enabled for type-ahead queries in a search bar. [Actual documents in your index are suggested](https://docs.microsoft.com/rest/api/searchservice/suggesters) as users enter partial search input. <br/><br/>**Faceted navigation** is enabled through [a single query parameter](https://docs.microsoft.com/azure/search/search-faceted-navigation). Azure Search returns a faceted navigation structure you can use as the code behind a categories list, for self-directed filtering (for example, to filter catalog items by price-range or brand). <br/><br/> **Filters** can be used to incorporate faceted navigation into your application's UI, enhance query formulation, and filter based on user- or developer-specified criteria. Create filters using the [OData syntax](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search).<br/><br/> **Hit highlighting** [applies visual form atting to a matching keyword in search results](https://docs.microsoft.com/rest/api/searchservice/Search-Documents). You can choose which fields return highlighted snippets.<br/><br/>**Sorting** is offered for multiple fields via the index schema and then toggled at query-time with a single search parameter.<br/><br/> **Paging** and throttling your search results is [straightforward with the finely tuned control](search-pagination-page-layout.md) that Azure Search offers over your search results.  
| Relevance | **Simple scoring** is a key benefit of Azure Search. [Scoring profiles](/rest/api/searchservice/add-scoring-profiles-to-a-search-index) are used to model relevance as a function of values in the documents themselves. For example, you might want newer products or discounted products to appear higher in the search results. You can also build scoring profiles using tags for personalized scoring based on customer search preferences you've tracked and stored separately. |
| Monitoring and reporting | **Search traffic analytics** are [collected and analyzed](search-traffic-analytics.md) to unlock insights from what users are typing into the search box. <br/><br/>Metrics on queries per second, latency, and throttling are captured and reported in portal pages with no additional configuration required. You can also easily monitor index and document counts so that you can adjust capacity as needed.  |
| Tools for prototyping and inspection | In the portal, you can use the **Import data** wizard to configure indexers, index designer to stand up an index, and **Search explorer** to test queries and refine scoring profiles. You can also open any index to view its schema. |
| Infrastructure | The **highly available platform** ensures an extremely reliable search service experience. When scaled properly, [Azure Search offers a 99.9% SLA](https://azure.microsoft.com/support/legal/sla/search/v1_0/).<br/><br/> **Fully managed and scalable** as an end-to-end solution, Azure Search requires absolutely no infrastructure management. Your service can be tailored to your needs by scaling in two dimensions to handle more document storage, higher query loads, or both.

## How it works
### Step 1: Provision service
You can spin up an Azure Search service in the [Azure portal](https://portal.azure.com/) or through the [Azure Resource Management API](/rest/api/searchmanagement/). You can choose either the free service shared with other subscribers, or a [paid tier](https://azure.microsoft.com/pricing/details/search/) that dedicates resources used only by your service. For paid tiers, you can scale a service in two dimensions: 

- Add Replicas to grow your capacity to handle heavy query loads.   
- Add Partitions to grow storage for more documents. 

By handling document storage and query throughput separately, you can calibrate resourcing based on production requirements.

### Step 2: Create index
Before you can upload searchable content, you must first define an Azure Search index. An index is like a database table that holds your data and can accept search queries. You define the index schema to map to reflect the structure of the documents you wish to search, similar to fields in a database.

A schema can be created in the Azure portal, or programmatically using the [.NET SDK](search-howto-dotnet-sdk.md) or [REST API](/rest/api/searchservice/).

### Step 3: Index data
After you define an index, you're ready to upload content. You can use either a push or pull model.

The pull model retrieves data from external data sources. It's supported through *indexers* that streamline and automate aspects of data ingestion, such as connecting to, reading, and serializing data. [Indexers](/rest/api/searchservice/Indexer-operations) are available for Azure Cosmos DB, Azure SQL Database, Azure Blob Storage, and SQL Server hosted in an Azure VM. You can configure an indexer for on demand or scheduled data refresh.

The push model is provided through the SDK or REST APIs, used for sending updated documents to an index. You can push data from virtually any dataset using the JSON format. See [Add, update, or delete Documents](/rest/api/searchservice/addupdate-or-delete-documents) or [How to use the .NET SDK)](search-howto-dotnet-sdk.md) for guidance on loading data.

### Step 4: Search
After populating an index, you can [issue search queries](/rest/api/searchservice/Search-Documents) to your service endpoint using simple HTTP requests with REST API or the .NET SDK.

## How it compares

Customers often ask how [full text search in Azure Search](search-lucene-query-architecture.md) compares with [full text search](https://en.wikipedia.org/wiki/Full_text_search) in their database product. Our response is that Azure Search language capabilities are richer and more flexible, with support for Lucene queries, language analyzers from Lucene and Microsoft, custom analyzers for phonetic or other specialized inputs, and the ability to merge data from multiple sources in the search index. 

Another inflection point is that a search solution addresses the entire search experience. For example, you might want custom scoring of results, faceted navigation for self-directed filtering, hit highlighting, and typeahead query suggestions. 

Tools for monitoring and understanding query activity can also factor into a search solution decision. For example, Azure Search supports [search traffic analytics](search-traffic-analytics.md) for metrics on clickthrough rate, top searches, searches without clicks, and so on. In products where search is an add-on, you're unlikely to find these features.

Resource utilization is another consideration. Natural language search is often computationally intensive. Some of our customers offloaded search operations to Azure Search as a way to preserve machine resources for transaction processing. By externalizing search, you can easily adjust scale to match query volume.

Once you've decided to go with dedicated search, your next decision is between a cloud service or an on-premises server. A cloud service is the right choice if you want a [turn-key solution with minimal overhead and maintenance, and adjustable scale](#cloud-service-advantage).

Within the cloud paradigm, several providers offer comparable baseline features, with full-text search, geo-search, and the ability to handle a certain level of ambiguity in search inputs. Typically, it's a [specialized feature](#feature-drilldown), or the ease and overall simplicity of APIs, tools, and management that determines the best fit.

Among cloud providers, Azure Search is strongest for full text search workloads over content stores and databases on Azure, for apps that rely primarily on search for both information retrieval and content navigation. Key strengths include:

+ Azure data integration (crawlers) at the indexing layer
+ Azure portal for central management
+ Azure scale, reliability, and world-class availability
+ Linguistic and custom analysis, with analyzers for solid full text search in 56 languages
+ [Core features common to search-centric apps](#feature-drilldown): scoring, faceting, suggestions, synonyms, geo-search, and more.

> [!Note]
> To be clear, non-Azure data sources are fully supported, but rely on a more code-intensive push methodology rather than indexers. Using our APIs, you can pipe any JSON document collection to an Azure Search index.

Among our customers, those able to leverage the widest range of features in Azure Search include online catalogs, line-of-business programs, and document discovery applications.

## REST API | .Net SDK

While many tasks can be performed in the portal, Azure Search is intended for developers who want to integrate search functionality into existing applications. The following programming interfaces are available.

|Platform |Description |
|-----|------------|
|[REST](/rest/api/searchservice/) | HTTP commands supported by any programming platform and language, including Xamarin, Java, and JavaScript|
|[.NET SDK](search-howto-dotnet-sdk.md) | .NET wrapper for the REST API offers efficient coding in C# and other managed-code languages targeting the .NET Framework |

## Free trial
Azure subscribers can [provision a service in the Free tier](search-create-service-portal.md).

If you aren't a subscriber, you can [open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F). You get credits for trying out paid Azure services. After they're used up, you can keep the account and use [free Azure services](https://azure.microsoft.com/free/). Your credit card is never charged unless you explicitly change your settings and ask to be charged.

Alternatively, you can [activate MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F): Your MSDN subscription gives you credits every month that you can use for paid Azure services. 

## How to get started

1. Create a service in the [Free tier](search-create-service-portal.md).

2. Step through one or more of the following tutorials. 

  + [How to use the .NET SDK](search-howto-dotnet-sdk.md) demonstrates the main steps in managed code.  
  + [Get started with the REST API](https://github.com/Azure-Samples/search-rest-api-getting-started) shows the same steps using the REST API.  
  + [Create your first index in the portal](search-get-started-portal.md) demonstrates the portal's built-in indexing and prototype features.   

Search engines are the common drivers of information retrieval in mobile apps, on the web, and in corporate data stores. Azure Search gives you tools for creating a search experience similar to those on large commercial web sites.

In this 9-minute video from program manager Liam Cavanagh, learn how integrating a search engine can benefit your app. Short demos cover key features in Azure Search, and what a typical workflow looks like. 

>[!VIDEO https://channel9.msdn.com/Events/Connect/2016/138/player]
 
+ 0-3 minutes covers key features and use-cases.
+ 3-4 minutes covers service provisioning. 
+ 4-6 minutes covers Import Data wizard used to create an index using the built-in real estate dataset.
+ 6-9 minutes covers Search Explorer and various queries.


