<properties
	pageTitle="What is Azure Search | Microsoft Azure | Hosted cloud search service"
	description="Azure Search is a fully-managed hosted cloud search service. Learn more in this feature overview."
	services="search"
	authors="ashmaka"
	documentationCenter=""/>

<tags
	ms.service="search"
	ms.devlang="NA"
	ms.workload="search"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.date="05/31/2016"
	ms.author="ashmaka"/>

# What is Azure Search?

Azure Search is a cloud search-as-a-service solution that delegates server and infrastructure management to Microsoft, leaving you with a ready-to-use service that you can populate with your data and then use to add search to your web or mobile application. Azure Search allows you to easily add a robust search experience to your applications using a simple [REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) or [.NET SDK](search-howto-dotnet-sdk.md) without managing search infrastructure or becoming an expert in search.

## Give your users a powerful search experience

**Powerful queries** can be formulated using the [simple query syntax](https://msdn.microsoft.com/library/azure/dn798920.aspx), which offers logical operators, phrase search operators, suffix operators, precedence operators. Additionally, the [Lucene query syntax](https://msdn.microsoft.com/library/azure/mt589323.aspx) can enable fuzzy search, proximity search, term boosting, and regular expressions. Azure Search also supports custom lexical analyzers to allow your application to handle complex search queries using phonetic matching and regular expressions.

**Language support** is [included for 56 different languages](https://msdn.microsoft.com/library/azure/dn879793.aspx). Using both Lucene analyzers and Microsoft analyzers (refined by years of natural language processing in Office and Bing), Azure Search can analyze text in your application's search box to intelligently handle language-specific linguistics including verb tenses, gender, irregular plural nouns (e.g. 'mouse' vs. 'mice'), word de-compounding, word-breaking (for languages with no spaces), and more.

**Search suggestions** can be enabled for autocompleted search bars and type-ahead queries. [Actual documents in your index are suggested](https://msdn.microsoft.com/library/azure/dn798936.aspx) as users enter partial search input.

**Hit highlighting** [allows](https://msdn.microsoft.com/library/azure/dn798927.aspx) users to see the snippet of text in each result that contains the matches for their query. You can pick and choose which fields return highlighted snippets.

**Faceted navigation** is easily added to your search results page with Azure Search. Using [just a single query parameter](https://msdn.microsoft.com/library/azure/dn798927.aspx), Azure Search will return all the necessary information to construct a faceted search experience in your app's UI to allow your users to drill-down and filter search results  (e.g. filter catalog items by price-range or brand).

**Geo-spatial** support allows you to intelligently process, filter, and display geographic locations. Azure Search enables your users to explore data based on the proximity of a search result to a specified location or based on a specific geographic region. This video explains how it works: [Channel 9: Azure Search and Geospatial data](https://channel9.msdn.com/Shows/Data-Exposed/Azure-Search-and-Geospatial-Data).

**Filters** can be used to easily incorporate faceted navigation into your application's UI, enhance query formulation, and filter based on user- or developer-specified criteria. Create powerful filters using the [OData syntax](https://msdn.microsoft.com/library/azure/dn798921.aspx).

## Empower your developers with an easy-to-use service

**High availability** ensures an extremely reliable search service experience. When scaled properly, [Azure Search offers a 99.9% SLA](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

**Fully managed** as an end-to-end solution, Azure Search requires absolutely no infrastructure management. Your service can be easily tailored to your needs by scaling in two dimensions to handle more document storage, higher query loads, or both.

**Data integration** using [indexers](https://msdn.microsoft.com/library/azure/dn946891.aspx) allows Azure Search to automatically crawl Azure SQL Database, Azure DocumentDB, or [Azure Blob storage](search-howto-indexing-azure-blob-storage.md) to sync your search index's content with your primary data store.

**Document cracking** is available (currently in preview) [to read and index major file formats](search-howto-indexing-azure-blob-storage.md) including Microsoft Office as well as PDF and HTML documents.

**Search traffic analytics** are [easily collected and analyzed](search-traffic-analytics.md) to unlock insights from what users are typing into the search box.

**Simple scoring** is a key benefit of Azure Search. [Scoring profiles](https://msdn.microsoft.com/library/azure/dn798928.aspx) are used to allow organizations to model relevance as a function of values in the documents themselves. For example, you might want newer products or discounted products to appear higher in the search results. You can also build scoring profiles using tags for personalized scoring based on customer search preferences you've tracked and stored separately.

**Sorting** is offered for multiple fields via the index schema and then toggled at query-time with a single search parameter.

**Paging** and throttling your search results is [straightforward with the finely tuned control](search-pagination-page-layout.md) that Azure Search offers over your search results.  

**Search explorer** allows you to issue queries against all of your indexes right from your account's Azure portal so you can easily test queries and refine scoring profiles.

## How it works

### 1. Provision service
You can spin up an Azure Search service using either the [Azure Portal](https://portal.azure.com/) or the [Azure Resource Management API](https://msdn.microsoft.com/library/azure/dn832684.aspx).

Depending on how you configure the search service, you'll use either the free tier of service that is shared with other Azure Search subscribers, or a [paid tier](https://azure.microsoft.com/pricing/details/search/) that dedicates resources to be used only by your service. When provisioning your service, you also choose the region of the data center that hosts your service.

Depending on which tier of service you choose, you can scale your service in two dimensions: 1) Add Replicas to grow your capacity to handle heavy query loads and 2) add Partitions to add storage for more documents. By handling document storage and query throughput separately, you can customize your search service for your specific needs.

### 2. Create index
Before you can upload your content to your Azure Search service, you must first define an Azure Search index. An index is like a database table that holds your data and can accept search queries. You define the index schema to map to the structure of the documents you wish to search, similar to fields in a database.

The schema of these indexes can either be created in the Azure Portal, or programmatically [using the .NET SDK](search-howto-dotnet-sdk.md) or [REST API](https://msdn.microsoft.com/library/azure/dn798941.aspx). Once the index is defined, you can then upload your data to the Azure Search service where it is subsequently indexed.

### 3. Index data
Once you have defined the fields and attributes of your index, you're ready to upload your content into the index. You can use either a push or pull model to upload data to the index.

The pull model is provided through indexers that can be configured for on demand or scheduled updates (see [Indexer operations (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn946891.aspx)), allowing you to easily ingest data and data changes from an Azure DocumentDB, Azure SQL Database, Azure Blob Storage, or SQL Server hosted in an Azure VM.

The push model is provided through the SDK or REST APIs used for sending updated documents to an index. You can push data from virtually any dataset using the JSON format. See [Add, update, or delete Documents](https://msdn.microsoft.com/library/azure/dn798930.aspx) or [How to use the .NET SDK)](search-howto-dotnet-sdk.md) for guidance on loading data.

### 4. Search
Once you have populated your Azure Search index, you can now [issue search queries](https://msdn.microsoft.com/library/azure/dn798927.aspx) to your service endpoint using simple HTTP requests with REST API or the .NET SDK.

## Try it now (for free!)
You can try Azure Search today! If you already have an Azure account, you can [provision a service in the Free tier](search-create-service-portal.md).

If you don't have an Azure account you can try a free, 60-minute session with no sign up required. Go to the [Try Azure App Service](http://go.microsoft.com/fwlink/p/?LinkId=618214) and select "Web App." Then select the "ASP.NET + Azure Search" template to get started.
