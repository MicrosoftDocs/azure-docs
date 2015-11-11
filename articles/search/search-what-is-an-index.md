<properties
	pageTitle="Indexes in Azure Search | Microsoft Azure | Hosted cloud search service"
	description="What is an index in Azure Seach and how is it used?"
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="na"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="11/09/2015"
	ms.author="heidist"/>

# Indexes in Azure Search
> [AZURE.SELECTOR]
- [Overview](search-what-is-an-index.md)
- [Portal](search-create-index-portal.md)
- [.NET](search-create-index-dotnet.md)
- [REST](search-create-index-rest-api.md)

Azure Search is a hosted cloud search service that provides a search engine, search features that enable a Bing or Google-like experience in your custom application, .NET and REST APIs for integrating Azure Search with your Web or desktop application, and data storage of searchable data in the form of *indexes*.

To create a schema, you can use the portal or write code that calls into the .NET SDK or REST API. 

##What is an index?

An *index* is persisted storage of documents and other constructs used by an Azure Search service. 

More specifically, it contains all searchable data used in processing an index, executing a query, or returning a search results list, a faceted navigation structure, or a details page to your application. In Azure Search, an index will also contain non-searchable data for use in filter expressions or scoring profiles (used to refine a query or boost a search ranking score), as well as structures scoped to your custom application that integrates with Azure Search.

If you are familiar with database concepts, an index is conceptually similar to a table, and documents are roughly equivalent to rows in a table.

The main sections of an index, which are described further on in this article, are as follows:
- Fields, which define the body of a *document*, attributed for specific behaviors
- Scoring profiles
- Suggestions
- CORS options
- Default analyzer

As part of provisioning a search service for use by your application, you'll need to create an index. Creating an index is a task centered on defining its schema. Minimally, it consists of defining the fields and setting attributes. Optionally, you can define scoring profiles and suggestions to enhance the search experience.

Once you create the index, populating it is a separate operation. For more about data ingestion after the index is created, see [Import data to Azure Search](search-what-is-data-import.md).

##How are indexes used in Azure Search?

All data-related operations performed by Azure Search consume or return data from an index. There are no exceptions: you cannot point the service to other data sources besides the index to return external data in a response.

For applications that accumulate and operate on data, such as sales transactions of an online retail app that stores data in an OLTP database, an Azure Search index will be an additional data source in your overall solution. The index is dedicated data storage used only by your search service. Having dedicated data source with proximity to your service ensures consistency in search results, reduces volatility, reduces the number round trips between your application and Azure Search, and improves overall performance of search operations because there is no competition for resources or data.

##Guidance for defining an schema

Schemas are created as JSON structures. You should create one index for each custom solution that you integrate with Azure Search. You cannot link or join multiple indexes, but you can create complex indexes that accommodate a range of search scenarios required by your solution. For example, if your applications support multiple languages, the fields collection in your index could have language-specific variants for each field.

As you design your index, take your time in the planning phase to think through each decision. Changing an index after it is deployed involves rebuilding and reloading the data. If you create the index in code, this step will be much easier than if you create it manually in the portal.

Having a solid understanding of the original source data is essential to creating a good schema. You will want to match up data types, know which field to use as a *key* that uniquely identifies each document in the index, and which fields should be exposed in a search results list or detail page. 

Image, audio, or video content should be stored elsewhere as long as the index includes a representative field with a URL to the resource. Any content, especially binary content, that is not searchable should be stored elsewhere, and then referenced by URI in a field in your index.

As you can imagine, the index must be regularly synchronized with other data sources used in your solution. In an online retail catalog, the inventory database that captures sales transactions must have the same SKUs, pricing, and availability as the data surfaced via search results. Depending on how much latency is acceptable for your solution, you might find that data synchronization can be once a week, once a day, or in near real-time using concurrent writes to both an inventory database and an Azure Search index. [Import data to Azure Search](search-what-is-data-import.md) explains the available options in detail.

##Schema elements

Indexes consist of attributed fields, data values, and other constructs that shape how queries and search results are constructed.

- Fields define the body of a document. An online retailer will want documents for each SKU, a news organization will want documents for each article, and an infomedia portal will want documents for each vendor or storefront.
- Attributes (or properties) are annotations on the field that specify data type, length, value, and behaviors allowed for that field. You can specify whether a field is searchable, retrievable, or sortable, all on a field-by-field basis. You can also specify which language analyzer to use at the field level. A *Key* is a reserved field in the schema that provides a unique identifier for every document in the fields collection.
- Scoring profiles are criteria used to boost the ranking of a search hit that has more of the characteristics set by the profile. For example, suppose a search term is matched in a product name and product description, you might want matches in product name to be ranked higher than those found in a description.
- Suggestions, also known as auto-complete or typeahead queries, are defined as a section in the index.
- Default language analyzers can be specified at the index level, globally applicable to all fields.
- CORS options enable cross-domain scripting and are also part of an index definition.

## Index attributes

|**Property**|Description|
|------------|-----------|
|**Retrievable**|Specifies whether a field can be returned in a search result.|
|**Filterable**|Allows the field to be used in **$filter** queries.|
|**Sortable**|Allows the field to be used as a sort option.|
|**Facetable**|Allows a field to be used in a faceted navigation structure for self-directed filtering. Typically fields containing repetitive values that you can use to group multiple documents together (for example, multiple documents that fall under a single product or service category) work best as facets.|
|**Key**|Provides the unique ID of each document, used for document look up. Every index must have one key. Only one field can be the key, and it must be set to Edm.String.|
|**Searchable**|Marks the field as full-text searchable.|

## Storage in the cloud

Because Azure Search is a fully-managed search service, data storage is handled as an internal operation. As a programmer, it's important to understand that you cannot bypass the Azure Search APIs to connect to the index directly, nor can you monitor index size or health except through portal notifications or API calls. There is no facility for backing up or restoring an index, nor for optimizing or tuning performance at the storage layer. Behind the scenes, data is stored as blob storage, but the best way to think about the physical storage and management of an index is as an implementation detail that could change in the future. One of the primary benefits of the service is  the hands-off approach to data administration.

If query volume or data storage requirements change over time, you can increase or decrease capacity by adding or moving replicas and partitions. For details, see [Manage your Search service in Azure](search-manage.md) or [Service Limits](search-limits-quotas-capacity.md).