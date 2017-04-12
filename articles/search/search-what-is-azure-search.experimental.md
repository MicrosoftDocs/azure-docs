---
title: What is Azure Search | Microsoft Docs
description: Search engine with advanced search features for your search bar in custom websites, apps, and corporate data and file stores.
services: search
manager: jhubbard
author: HeidiSteen
documentationcenter: ''

ms.assetid: 
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 02/15/2017
ms.author: heidist
experiment_id: "heidist-20170221"
---
# What is Azure Search?

Azure Search offers a dedicated and programmable search engine with intelligent search behaviors to power the search bar for content on your website, in your apps, and in corporate file or data stores. 

![Search bar powered by Azure Search](./media/search-what-is-azure-search/search-powered-by-azsearch3.png)

Having a solid search experience is a necessity for most web and mobile apps. Full text search with auto-completed query terms, spelling corrections, and matches based on semantically identical but superficially different inputs ("car" and "auto") is almost the minimum bar, despite the technical complexity backing the experience. Equally important are operational requirements for scale, reliability, and synchronization between search and backend data stores. 

Azure Search provides comprehensive functionality so you can meet both search and operational requirements.

![Search bar and custom search page with typical search features](./media/search-what-is-azure-search/search-page-callouts3.png)

## How it works

To use Azure Search, provision a free or paid service in your Azure subscription, create and load an index containing your searchable content, and then call APIs to issue search requests and handle results. A paid service is required if you want dedicated resources at scale.

|Tier |Description |
|-----|------------|
|[Free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) | A shared service that can be provisioned quickly and used for small workloads, typical for learning and evaluation scenarios. |
|[Billable](search-sku-tier.md) | A dedicated service at graduated levels of capacity, from Basic to Standard High Density; accommodating a wide range of deployment configurations at different pricing tiers.|

Azure Search runs in the cloud as a managed service from Microsoft. It can be integrated with custom code on any application platform. Your fully managed service and private content is globally available, programmable, scalable, and recoverable. 

Dedicated services run 24-7 at scale with [99.9% service level agreements](https://azure.microsoft.com/support/legal/sla/search/v1_0/) backed by Microsoft Azure.

## How it compares

Several cloud service providers offer custom search engines with features that power a search bar in custom apps. 
Some offer comparable baseline features, with full-text search, geo-search, and the ability to handle a certain level of ambiguity in search inputs. Typically, it's a [specialized feature](#feature-drilldown), or the ease and overall simplicity of APIs, tools, and management that determines the best fit.

As points of comparison with other search solutions, Azure Search is strongest for full text search workloads over content stores and databases on Azure, with an additional layer of functionality necessary for apps that rely primarily on search for information retrieval and content navigation. Key strengths include:

+ Azure data integration (crawlers) at the indexing layer
+ Azure portal for central management
+ Azure scale, reliability, and world-class availability
+ Linguistic and custom analysis, with analyzers for solid full text search in 56 languages
+ Core features common to search-centric apps, including relevance, faceting, suggestions, synonyms, geo-search, and more (listed next).

> [!Note]
> Non-Azure data sources are fully supported. You can pipe any JSON document collection to an Azure Search index.

Use cases able to leverage the widest range of features in Azure Search include online catalogs, line of business programs, and document discovery applications.

### <a name="feature-drilldown"></a>Feature drilldown

#### Full text search and text analysis

Queries can be formulated using the [simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search), which offers logical operators, phrase search operators, suffix operators, precedence operators. Additionally, the [Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) can enable fuzzy search, proximity search, term boosting, and regular expressions. Azure Search also supports [custom lexical analyzers](https://docs.microsoft.com/rest/api/searchservice/custom-analyzers-in-azure-search) to allow your application to handle complex search queries using phonetic matching and regular expressions.

#### Language support

Azure Search supports lexical analyzers for [56 different languages](https://docs.microsoft.com/rest/api/searchservice/language-support). Using both Lucene analyzers and Microsoft analyzers (refined by years of natural language processing in Office and Bing), Azure Search can analyze text in your application's search box to intelligently handle language-specific linguistics including verb tenses, gender, irregular plural nouns (for example, 'mouse' vs. 'mice'), word de-compounding, word-breaking (for languages with no spaces), and more.

#### Data integration

You can push JSON data structures to populate an Azure Search index. Additionally, for supported data sources, you can use [indexers](search-indexer-overview.md) to automatically crawl Azure SQL Database, Azure DocumentDB, or [Azure Blob storage](search-howto-indexing-azure-blob-storage.md) to sync your search index's content with your primary data store.

**Document cracking** enables [indexing of major file formats](search-howto-indexing-azure-blob-storage.md) including Microsoft Office, PDF, and HTML documents.

#### Search experience

+ **Search suggestions** can be enabled for auto-completed search bars and type-ahead queries. [Actual documents in your index are suggested](https://docs.microsoft.com/rest/api/searchservice/suggesters) as users enter partial search input.

+ **Faceted navigation** is enabled through a [just a single query parameter](https://docs.microsoft.com/azure/search/search-faceted-navigation). Azure Search returns a faceted navigation structure you can use as the code behind a categories list, for self-directed filtering (for example, to filter catalog items by price-range or brand).

+ **Filters** can be used to incorporate faceted navigation into your application's UI, enhance query formulation, and filter based on user- or developer-specified criteria. Create filters using the [OData syntax](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search).

+ **Hit highlighting** [applies visual formatting to a matching keyword in search results](https://docs.microsoft.com/rest/api/searchservice/Search-Documents). You can choose which fields return highlighted snippets.

+ **Simple scoring** is a key benefit of Azure Search. [Scoring profiles](https://docs.microsoft.com/rest/api/searchservice/add-scoring-profiles-to-a-search-index) are used to model relevance as a function of values in the documents themselves. For example, you might want newer products or discounted products to appear higher in the search results. You can also build scoring profiles using tags for personalized scoring based on customer search preferences you've tracked and stored separately.

+ **Sorting** is offered for multiple fields via the index schema and then toggled at query-time with a single search parameter.

+ **Paging** and throttling your search results is [straightforward with the finely tuned control](search-pagination-page-layout.md) that Azure Search offers over your search results.  

#### Geosearch

Azure Search intelligently processes, filters, and displays geographic locations. It enables users to explore data based on the proximity of a search result to a specified location or based on a specific geographic region. This video explains how it works: [Channel 9: Azure Search and Geospatial data](https://channel9.msdn.com/Shows/Data-Exposed/Azure-Search-and-Geospatial-Data).

#### Cloud service advantages

+ **High availability** ensures an extremely reliable search service experience. When scaled properly, [Azure Search offers a 99.9% SLA](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

+ **Fully managed** as an end-to-end solution, Azure Search requires absolutely no infrastructure management. Your service can be tailored to your needs by scaling in two dimensions to handle more document storage, higher query loads, or both.

#### Monitoring and reporting

+ **Search traffic analytics** are [collected and analyzed](search-traffic-analytics.md) to unlock insights from what users are typing into the search box.

+ Metrics on queries per second, latency, and throttling are captured and reported in portal pages with no additional configuration required. You can also easily monitor index and document counts so that you can adjust capacity as needed. 

#### Tools for prototyping and inspection

In the portal, you can use the **Import data** wizard to configure indexers, index designer to stand up an index, and **Search explorer** to issue queries against all of your indexes right from your account's Azure portal so you can test queries and refine scoring profiles. You can also open any index to view its schema.

## How to get started

Start with a free service, and then [create and query an index using sample built-in data](search-get-started-portal.md). You can use the portal for all tasks, which is a quick way to try out Azure Search before having to write any code.

1. Azure subscribers can [provision a service in the Free tier](search-create-service-portal.md).

  Non-subscribers can [open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) and use free credits to try out paid Azure services. After credits are used up, you can keep the account and use free Azure services, such as Websites. Your credit card is never be charged, unless you explicitly change your settings and ask to be charged.

  Alternatively, [activate MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F). Your MSDN subscription gives you credits every month that you can use for paid Azure services. 

2. Run the **Import data** wizard over the [built-in real estate sample dataset](search-get-started-portal.md#create-index).

  This wizard can generate and load an index from most Azure data sources. Code is required for data sources not specifically supported by the wizard.

3. Use [Search Explorer](search-get-started-portal.md#query-index) to query the index.

## REST API | .Net SDK

While a number of tasks can be performed in the portal, Azure Search is intended for developers who want to integrate search functionality into existing applications. The following programming interfaces are available.

|Platform |Description |
|-----|------------|
|[REST](https://docs.microsoft.com/rest/api/searchservice/) | HTTP commands supported by any programming platform and language, including Xamarin, Java, and JavaScript|
|[.NET SDK](search-howto-dotnet-sdk.md) | .NET wrapper for the REST API offers efficient coding in C# and other managed-code languages targeting the .NET Framework |

## Watch a short video

Search engines are the common drivers of information retrieval in mobile apps, on the web, and in corporate data stores. Azure Search gives you tools for creating a search experience similar to those on large commercial web sites. This 9-minute video from program manager Liam Cavanagh explains how integrating a search engine can benefit your app, key features in Azure Search, and what a typical workflow looks like. 

>[!VIDEO https://channel9.msdn.com/Events/Connect/2016/138/player]
 
+ 0-3 minutes covers key features and use-cases.
+ 3-4 minutes covers service provisioning. 
+ 4-6 minutes covers Import Data wizard used to create an index using the built-in real estate dataset.
+ 6-9 minutes covers Search Explorer and various queries.

