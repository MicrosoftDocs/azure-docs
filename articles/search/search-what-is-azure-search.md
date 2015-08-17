<properties
	pageTitle="What is Azure Search"
	description="Azure Search technical overview and feature summary."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="NA"
	ms.workload="search"
	ms.topic="article" 
	ms.tgt_pltfrm="na"
	ms.date="07/08/2015"
	ms.author="heidist"/>

# What is Azure Search?

Azure Search Service is a fully managed cloud service that allows developers to build rich search applications using a .NET SDK or REST APIs. It includes full-text search scoped over your content, plus advanced search behaviors similar to those found in commercial web search engines, such as type-ahead query suggestions based on a partial term input, hit-highlighting, and faceted navigation. Natural language support is built-in, using the linguistic rules that are appropriate to the specified language.

You can scale your service based on the need for increased search or storage capacity. For example, retailers can increase capacity to meet the extra volumes associated with holiday shopping or promotional events.

Azure Search is an API-based service for developers and system integrators who know how to work with web services and HTTP. Azure Search takes the complexity out of managing a cloud search service and simplifies the creation of search-based web and mobile applications.

##How it works

Azure Search is a [PaaS service](https://wikipedia.org/wiki/Platform_as_a_service) that delegates server and infrastructure management to Microsoft, leaving you with a ready-to-use service that you populate with search data, and then access from your application. Depending on how you configure the service, you'll use either the free service that is shared with other Azure Search subscribers, or the Standard pricing tier that offers dedicated resources used only by your service. Standard search is scalable, with options to meet increased demands for storage or query loads.

Azure Search stores your data in an index that can be searched through full text queries. The schema of these indexes can either be created in the Azure Portal, or programmatically using the client library or REST APIs. Once the schema is defined, you can then upload your data to the Azure Search service where it is subsequently indexed.

You can use either push or pull models to upload data to the index. The pull model is provided through indexers that can be configured for on demand or scheduled updates (see [Indexer operations (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn946891.aspx)), allowing you to easily ingest data and data changes from an Azure DocumentDB, Azure SQL Database, or SQL Server hosted in an Azure VM. The push model is provided through the SDK or REST APIs used for sending updated documents to an index. You can push data from virtually any dataset, as long as its in JSON format. See [Add, update, or delete Documents](https://msdn.microsoft.com/library/azure/dn798930.aspx) or [How to use the .NET SDK)](search-howto-dotnet-sdk.md) for guidance on loading data.

Some developers will choose an indexer for the convenience it provides. For other developers, the push model is worth a little extra work. Reasons for choosing a push model are twofold. First, you avoid the extra load that crawler-style mechanisms place on your data servers. Secondly, you avoid the inherent latency that comes with scheduled indexing. On Cyber Monday or Black Friday, you’ll want search to reflect up-to-the-second status on available inventory. A push model can give you that degree of precision.

##What you'll build and store

The typical workflow is to build the schema and documents in a local development environment and then use the .NET SDK or REST API to upload, process, and ultimately query the data. All of the indexed data is persisted within Azure Search for better performance and to ensure consistency across search operations.

You can use the portal's built-in editor to create the index schema and scoring profiles, which is ideal for prototyping. Developers who need a repeatable, automated approach might prefer to create the index in code. Newer features are added to the API first, so depending on your application requirements, a programmatic approach might be your only option.

When you build the schema, you're defining the fields and their attributes supported in your search application. Fields contain searchable data, such as product names, descriptions, customer comments, brands, prices, promotional notifications, and so forth. Attributes inform the types of operations that can be performed. Examples of the more commonly used attributes include whether a field supports full-text search (searchable=true), filters (filterable=true), or facets (facetable=true).

Fields also contain non-searchable data relevant to your search application, such as values used internally in filters and scoring profiles, or perhaps URLs to content stored in other storage platforms (for example, video or image files kept in BLOB storage). An oft-cited example of an internal-only field is a profit margin or another value that indicates revenue potential. Perhaps your search application needs to promote specific items that bring higher financial benefit to your company. Your schema can include field attributes allowing these kinds of search behaviors.

Documents are the detailed data returned by the search engine in search results. For example, if your search application is an online catalog, you would have one document for each SKU, and the search results page would be built using values returned from documents that match the search terms.

##See it in action

Watch our videos to learn about scenarios and capabilities. Visit [Azure Search: tutorials, video demos, and samples](https://msdn.microsoft.com/library/azure/dn818681.aspx) for links to video content.

##Feature drilldown

Azure Search delivers value in multiple categories, including provisioning and scale, programmability, access and control, and in the features that you choose to implement in your custom search application.

The following feature checklist can help you evaluate Azure Search for your search application needs. New feature announcements can be found at Latest updates to Azure Search. You can also review the Azure Search feature request page to check on the status of features not yet implemented. 

Questions about a specific feature? Try the [Azure Search forum on MSDN](https://social.msdn.microsoft.com/forums/azure/home?forum=azuresearch). You can also review the [Azure Search feature request page](http://feedback.azure.com/forums/263029-azure-search) to check on the status of features not yet implemented. 

###Capacity and scale features and restrictions

The service can run as either a Standard or shared service deployment. Standard search supports dedicated resource that can be scaled based on workloads. The shared service is free and is meant for testing out the services functionality as there are no performance guarantees.

**Scalable** in increments of storage and document counts (partitions) or in query load (replicas). Each replica runs one copy of an index. High availability requires 2 replicas for query workloads, and 3 replicas for read-write (query and indexing) workloads. See Limits and constraints (Azure Search) for more about capacity planning.

Azure Search automatically spans indexes and documents across the partitions you have allocated for this service. This means that you cannot peg indexes and documents to a set of partitions and replicas. 

Partitions and replicas are service-wide resources, with all indexes running on all replicas. If you need index isolation, or perhaps you have requirements for geographic dispersion of services and resources in different data centers, you could create a second service. 

There are limits on storage, and on the number of indexes and documents loaded into the service. Your effective limit will be whichever comes first: exhausting physical storage, or meeting the upper limit on indexes and document counts. See [Limits and constraints (Azure Search)](https://msdn.microsoft.com/library/azure/dn798934.aspx) for details.

###Programmability

REST API consists of HTTP requests and responses, with content in JSON format. There is an API for accessing the service, and an API for managing the service. See [Azure Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) and [Azure Search Management REST API](https://msdn.microsoft.com/library/azure/dn832684.aspx) for details.

The .NET SDK includes classes that make it easy to use your Azure Search service without having to work directly with HTTP and JSON. See [How to use the Azure Search .NET SDK](search-howto-dotnet-sdk.md) for more information.

###Access and control

Search is accessible over HTTPS only.

Authentication from your host application to Azure Search is through an admin api-key in an HTTP header. There is no per-user authentication or authorization model. However, you can use $filter to restrict access by user identity. You can also use multiple query api-keys that you can assign to different client applications. For more information about key management, see [Manage your search service on Microsoft Azure](search-manage.md). See [Search Documents (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798927.aspx) for details about $filter.

###Indexes and documents

You can have multiple indexes (see [Limits and constraints (Azure Search)](https://msdn.microsoft.com/library/azure/dn798934.aspx) for limits based on pricing tiers). Note that there is currently no support for joining indexes. A search request can specify one index.

**Documents** contain fields and associated attributes. Fields include searchable text, values used predominantly (or even exclusively) in filters and scoring profiles, and very likely – URLs or pointers to content, such as images, in other data stores. Many search applications use multiple forms of storage. Images or videos can be stored more cheaply in other storage media, such as Azure Blob storage.

**Indexers** can be used to schedule index updates from changed data in Azure SQL Database, SQL Server on Azure VMs, or Azure DocumentDB. See [Indexer operations (Azure Search Service REST API)]((https://msdn.microsoft.com/library/azure/dn946891.aspx) for details.

**Queries** can be formulated using OData syntax for Boolean filters and a simple query syntax for full-text search. See [OData Expression Syntax for Azure Search](https://msdn.microsoft.com/library/azure/dn798921.aspx) and [Simple query syntax in Azure Search](https://msdn.microsoft.com/library/azure/dn798920.aspx) for details.

You can look up specific documents based on their ID to quickly retrieve specific items. This is useful when a user clicks on a specific search result and you want to do a look up specific details about that document. See [Lookup Document (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798929.aspx) for details.

##Search application features

**Full-text search** (on by default for text fields) is enabled for any field having the searchable attribute. Full-text search is based on prefix matching, which means that matches are based on the first part of a search term, and not in the middle or end of word. See [Create Index (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798941.aspx) or [Create an index in the portal](search-create-index-portal.md) for steps on how to define an index.

**Scoring profiles** are used to build ranking models that optimize search based on business objectives. For example, you might want newer products or discounted products to appear higher in the search results. You can also build scoring profiles using tags for personalized scoring based on customer search preferences you've tracked and stored separately. See [Add scoring profiles to a search index (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798928.aspx) for details.

**Language support** is built-in for fifty different languages, using multiple options of natural language processing stacks, including the well-known Lucene analyzers and Microsoft's own analyzers that power Microsoft Office and Bing (preview only). See [Language support (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn879793.aspx) for Lucene, and [Azure Search Service REST API Version 2015-02-28-Preview](search-api-2015-02-28-Preview.md) for the natural language processors.

**Faceted navigation** refers to a categorization tree used for self-directed search, often based on brands, models, sizes, or whatever categories make sense for your data. Faceted navigation is implemented through attributes in your index, combined with a facet field that is provided in a query. See [Faceted navigation](search-faceted-navigation.md) for details. 

**Suggestions** for type-ahead or autocomplete queries is supported through attributes in your index. Azure Search supports both fuzzy matching and infix matching (matching on any part of the field content). You can do both; they are not mutually exclusive. See [Create Index (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798941.aspx) for information about enabling suggestions, and [Suggestions (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798936.aspx) for using them.

**Filters** can be used to implement faceted navigation, used in query construction, or used globally to constrain search operations to filter criteria you establish in code. Filters are enabled for specific fields via your index schema, and through the $Filter search parameter. See [Create Index (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798941.aspx) and [Search Documents (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798927.aspx) for details.

**Sort** is also enabled for specific fields via the index schema and then implemented as a search parameter via the $orderBy parameter. Once again, [Create Index (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798941.aspx) and [Search Documents (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798927.aspx) has the details

**Count** of the search hits returned for a query, and the ability to throttle how many hits are returned at a time, are implemented through $top and $skip. See [Search Documents (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798927.aspx) for details.

**Highlighted hits** are specified via the highlight query parameter, and allow you to display to a user a snippet of text highlighting key words found from the search terms entered by the user. See [Search Documents (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798927.aspx) for more information about query parameters.

##Reporting and analysis

Resource usage is displayed on the service dashboard so that you can quickly get an idea of how your storage is being used.

Storage consumption, document count, and index count are available in the portal. You can also use the API. See [Get Index Statistics (Azure Search Service REST API)](https://msdn.microsoft.com/library/azure/dn798942.aspx) for details.

There is no built-in mechanism for measuring query throughput or other service operations. In addition, there is currently no support for logging or analysis of search results (for example, retrieving a list of search terms that yielded no results, or reporting on the origin of search requests).

##Try it out

Visit [Create an Azure Search service](search-create-service-portal.md) to set up the service or use [Try Azure App Service](http://go.microsoft.com/fwlink/p/?LinkId=618214) for a free one-hour session with no setup or subscription required.

You can also try these tutorials:

[How to use Azure Search in .NET](search-howto-dotnet-sdk.md)
[Get Started with Azure Search .NET](search-get-started-dotnet.md)
[Azure Search: tutorials, video demos, and samples](https://msdn.microsoft.com/library/azure/dn818681.aspx)
