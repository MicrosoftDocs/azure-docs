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
ms.date: 04/24/2017
ms.author: ashmaka
---
# What is Azure Search?
Azure Search is a cloud search-as-a-service solution that delegates server and infrastructure management to Microsoft, leaving you with a ready-to-use service that you can populate with your data and then use to add search to your web or mobile application. Azure Search allows you to easily add a robust search experience to your applications using a simple [REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) or [.NET SDK](search-howto-dotnet-sdk.md) without managing search infrastructure or becoming an expert in search.

## Embed a powerful search experience in your app or site


### Full text search and text analysis

Queries can be formulated using the [simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search), which offers logical operators, phrase search operators, suffix operators, precedence operators. Additionally, the [Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) can enable fuzzy search, proximity search, term boosting, and regular expressions. Azure Search also supports [custom lexical analyzers](https://docs.microsoft.com/rest/api/searchservice/custom-analyzers-in-azure-search) to allow your application to handle complex search queries using phonetic matching and regular expressions.

### Language support

Azure Search supports lexical analyzers for [56 different languages](https://docs.microsoft.com/rest/api/searchservice/language-support). Using both Lucene analyzers and Microsoft analyzers (refined by years of natural language processing in Office and Bing), Azure Search can analyze text in your application's search box to intelligently handle language-specific linguistics including verb tenses, gender, irregular plural nouns (for example, 'mouse' vs. 'mice'), word de-compounding, word-breaking (for languages with no spaces), and more.

### Data integration

You can push JSON data structures to populate an Azure Search index. Additionally, for supported data sources, you can use [indexers](search-indexer-overview.md) to automatically crawl Azure SQL Database, Azure DocumentDB, or [Azure Blob storage](search-howto-indexing-azure-blob-storage.md) to sync your search index's content with your primary data store.

**Document cracking** enables [indexing of major file formats](search-howto-indexing-azure-blob-storage.md) including Microsoft Office, PDF, and HTML documents.

### Search experience

+ **Search suggestions** can be enabled for auto-completed search bars and type-ahead queries. [Actual documents in your index are suggested](https://docs.microsoft.com/rest/api/searchservice/suggesters) as users enter partial search input.

+ **Faceted navigation** is enabled through a [just a single query parameter](https://docs.microsoft.com/azure/search/search-faceted-navigation). Azure Search returns a faceted navigation structure you can use as the code behind a categories list, for self-directed filtering (for example, to filter catalog items by price-range or brand).

+ **Filters** can be used to incorporate faceted navigation into your application's UI, enhance query formulation, and filter based on user- or developer-specified criteria. Create filters using the [OData syntax](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search).

+ **Hit highlighting** [applies visual formatting to a matching keyword in search results](https://docs.microsoft.com/rest/api/searchservice/Search-Documents). You can choose which fields return highlighted snippets.

+ **Simple scoring** is a key benefit of Azure Search. [Scoring profiles](https://docs.microsoft.com/rest/api/searchservice/add-scoring-profiles-to-a-search-index) are used to model relevance as a function of values in the documents themselves. For example, you might want newer products or discounted products to appear higher in the search results. You can also build scoring profiles using tags for personalized scoring based on customer search preferences you've tracked and stored separately.

+ **Sorting** is offered for multiple fields via the index schema and then toggled at query-time with a single search parameter.

+ **Paging** and throttling your search results is [straightforward with the finely tuned control](search-pagination-page-layout.md) that Azure Search offers over your search results.  

### Geosearch

Azure Search intelligently processes, filters, and displays geographic locations. It enables users to explore data based on the proximity of a search result to a specified location or based on a specific geographic region. This video explains how it works: [Channel 9: Azure Search and Geospatial data](https://channel9.msdn.com/Shows/Data-Exposed/Azure-Search-and-Geospatial-Data).

### Cloud service advantages

+ **High availability** ensures an extremely reliable search service experience. When scaled properly, [Azure Search offers a 99.9% SLA](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

+ **Fully managed** as an end-to-end solution, Azure Search requires absolutely no infrastructure management. Your service can be tailored to your needs by scaling in two dimensions to handle more document storage, higher query loads, or both.

### Monitoring and reporting

+ **Search traffic analytics** are [collected and analyzed](search-traffic-analytics.md) to unlock insights from what users are typing into the search box.

+ Metrics on queries per second, latency, and throttling are captured and reported in portal pages with no additional configuration required. You can also easily monitor index and document counts so that you can adjust capacity as needed. 

### Tools for prototyping and inspection

In the portal, you can use the **Import data** wizard to configure indexers, index designer to stand up an index, and **Search explorer** to issue queries against all of your indexes right from your account's Azure portal so you can test queries and refine scoring profiles. You can also open any index to view its schema.

## How it works
### Step 1: Provision service
You can spin up an Azure Search service using either the [Azure portal](https://portal.azure.com/) or the [Azure Resource Management API](https://msdn.microsoft.com/library/azure/dn832684.aspx).

Depending on how you configure the search service, you'll use either the free tier of service that is shared with other Azure Search subscribers, or a [paid tier](https://azure.microsoft.com/pricing/details/search/) that dedicates resources to be used only by your service. When provisioning your service, you also choose the region of the data center that hosts your service.

Depending on which tier of service you choose, you can scale your service in two dimensions: 1) Add Replicas to grow your capacity to handle heavy query loads and 2) add Partitions to add storage for more documents. By handling document storage and query throughput separately, you can customize your search service for your specific needs.

### Step 2: Create index
Before you can upload your content to your Azure Search service, you must first define an Azure Search index. An index is like a database table that holds your data and can accept search queries. You define the index schema to map to the structure of the documents you wish to search, similar to fields in a database.

The schema of these indexes can either be created in the Azure portal, or programmatically [using the .NET SDK](search-howto-dotnet-sdk.md) or [REST API](https://msdn.microsoft.com/library/azure/dn798941.aspx). Once the index is defined, you can then upload your data to the Azure Search service where it is subsequently indexed.

### Step 3: Index data
Once you have defined the fields and attributes of your index, you're ready to upload your content into the index. You can use either a push or pull model to upload data to the index.

The pull model is provided through indexers that can be configured for on demand or scheduled updates (see [Indexer operations (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn946891.aspx)), allowing you to easily ingest data and data changes from an Azure DocumentDB, Azure SQL Database, Azure Blob Storage, or SQL Server hosted in an Azure VM.

The push model is provided through the SDK or REST APIs, used for sending updated documents to an index. You can push data from virtually any dataset using the JSON format. See [Add, update, or delete Documents](https://msdn.microsoft.com/library/azure/dn798930.aspx) or [How to use the .NET SDK)](search-howto-dotnet-sdk.md) for guidance on loading data.

### Step 4: Search
Once you have populated your Azure Search index, you can now [issue search queries](https://msdn.microsoft.com/library/azure/dn798927.aspx) to your service endpoint using simple HTTP requests with REST API or the .NET SDK.

## REST API | .Net SDK

While a number of tasks can be performed in the portal, Azure Search is intended for developers who want to integrate search functionality into existing applications. The following programming interfaces are available.

|Platform |Description |
|-----|------------|
|[REST](https://docs.microsoft.com/rest/api/searchservice/) | HTTP commands supported by any programming platform and language, including Xamarin, Java, and JavaScript|
|[.NET SDK](search-howto-dotnet-sdk.md) | .NET wrapper for the REST API offers efficient coding in C# and other managed-code languages targeting the .NET Framework |

## Free trial
Azure subscribers can [provision a service in the Free tier](search-create-service-portal.md).

If you aren't a subscriber, you can [open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F): You get credits you can use to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Websites. Your credit card will never be charged, unless you explicitly change your settings and ask to be charged.

Alternatively, you can [activate MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F): Your MSDN subscription gives you credits every month that you can use for paid Azure services. 

## Watch a short video

Search engines are the common drivers of information retrieval in mobile apps, on the web, and in corporate data stores. Azure Search gives you tools for creating a search experience similar to those on large commercial web sites. This 9-minute video from program manager Liam Cavanagh explains how integrating a search engine can benefit your app, key features in Azure Search, and what a typical workflow looks like. 

>[!VIDEO https://channel9.msdn.com/Events/Connect/2016/138/player]
 
+ 0-3 minutes covers key features and use-cases.
+ 3-4 minutes covers service provisioning. 
+ 4-6 minutes covers Import Data wizard used to create an index using the built-in real estate dataset.
+ 6-9 minutes covers Search Explorer and various queries.


