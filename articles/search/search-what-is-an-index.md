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

Azure Search is a hosted cloud search service that provides a search engine, search features that enable a Bing or Google-like experience in your custom application, .NET and REST APIs for integrating Azure Search with your Web or desktop application, and data storage of your search-related data in the form of an *index*.

##What is an index?

An *index* is persisted storage of *documents* and other constructs used by an Azure Search service. Documents are a basic unit of searchable data. For example, a retailer might have a document for each SKU, a news organization might have a document for each article, and a streaming media organization might have a document for each video or song in their library. Mapping these concepts to more familiar database equivalents: an *index* is conceptually similar to a *table*, and *documents* are roughly equivalent to *rows* in a table.

The index is a flat dataset -- typically a subset of the data created or captured during normal business operations through computerized processes, such as sales transactions, content publishing, purchasing activity -- often stored in relational or NoSQL databases. An index gets its documents when you push or pull a dataset containing rows from other data sources to your index.

##When do I create an index?

As part of provisioning a search service for use by your application, you'll need to create an index. Making an index available for search operations is a 2-part task. First, define the schema and post it to Azure Search. Second, populate the index with a user-defined dataset that complies with the schema. 

To create a schema that defines an index, you can use the portal or write code that calls into the .NET SDK or REST API (see the tabs at the top of this topic). For more about data ingestion after the index is created, see [Import data to Azure Search](search-what-is-data-import.md).

##JSON schema specification of an index

An index is a JSON document that has sections for fields and attributes, scoring profiles, suggesters, a default scoring profile, and CORS options.

 ![][1]

The main sections of an Azure Search index, as articulated in the JSON data interchange format, are as follows.

|Section|Description|
|--------------|-----------|
|Fields collection|Fields define a document. A dataset that you push or pull into an index must provide values or nulls for each field, compatible with the data type and field length expressed in the schema. Fields have [attributes](#index-attributes): properties or annotations used to mark up a field to enable search-related behaviors for that field. For example, you can specify whether a field is searchable, retrievable, or sortable, all on a field-by-field basis. You can also specify language analyzer overrides at the field level.
|[Suggesters](https://msdn.microsoft.com/library/azure/mt131377.aspx)|Also known as auto-complete or typeahead queries, are defined as a section in the index.|
|[Scoring profiles](https://msdn.microsoft.com/library/azure/dn798928.aspx)|Criteria used to boost the ranking of a search hit that has more of the characteristics set by the profile. For example, suppose a search term is matched in a product name and product description, you might want matches in product name to be ranked higher than those found in a description. You can create multiple profiles.|
|Default scoring profile|Optionally, you can override the built-in logic that computes a search ranking score by specifying one of your scoring profiles as the default.|
|CORS options|Optionally, enable cross-origin resource sharing, wherein requests for a resource used by a web page issued across a domain boundary. CORS is always off unless you specifically enable it for your index.|

<a name="index-attributes"></a>
##Index attributes

Attributes are set on individual fields to specify how the field is used. The following table enumerates the attributes you can specify.

|**Property**|Description|
|------------|-----------|
|**Retrievable**|Specifies whether a field can be returned in a search result.|
|**Filterable**|Allows the field to be used in **$filter** queries.|
|**Sortable**|Allows the field to be used as a sort column in a result set.|
|**Facetable**|Allows a field to be used in a faceted navigation structure for user self-directed filtering. Typically fields containing repetitive values that you can use to group multiple documents together (for example, multiple documents that fall under a single brand or service category) work best as facets.|
|**Key**|A string that provides the unique ID of each document, used for document look up. Every index must have one key. Only one field can be the key, and it must be set to Edm.String.|
|**Searchable**|Marks the field as full-text searchable.|


##How are indexes used in Azure Search?

Data from your index is used to construct a search results list, a faceted navigation structure, or a details page for  single document. In Azure Search, an index can also contain non-searchable data used internally in filter expressions or in the scoring profiles that provide criteria used for boosting a search ranking score.

All data-related operations performed by Azure Search consume or return data from an index. There are no exceptions: you cannot point the service to other data sources besides the index to return external data in a response emitted by your search service.

Obviously, for applications that accumulate and operate on data, such as sales transactions of an online retail app, an Azure Search index will be an additional data source in your overall solution. While it might seem redundant to have dedicated data storage just for search, having it provides these benefits: consistency in search results, reduced volatility, fewer round trips between your application and Azure Search, and improved overall performance of search operations because there is no contention for resources or data.

##Guidance for defining an schema

Schemas are created as JSON structures. You should create one index for each custom solution that you integrate with Azure Search. You cannot link or join multiple indexes, but you can create complex indexes that accommodate a range of search scenarios required by your solution. For example, if your applications support multiple languages, the fields collection in your index could have language-specific variants for each field.

As you design your index, take your time in the planning phase to think through each decision. Changing an index after it is deployed involves rebuilding and reloading the data. If you create the index in code, this step will be much easier than if you create it manually in the portal.

Having a solid understanding of the original source data is essential to creating a good schema. You will want to match up data types, know which field to use as a *key* that uniquely identifies each document in the index, and which fields should be exposed in a search results list or detail page. 

**Starting with relational data**

Relational data can be hard to transform into a flat dataset. If possible, try use your company's data warehouse or reporting database, if one is available. It's usually the better choice because the model is already denormalized. Otherwise, you'll have to rely on queries to get the rowset you need. For an example and explanation of how to do this, see [Modeling the AdventureWorks Inventory Database for Azure Search](http://blogs.technet.com/b/onsearch/archive/2015/09/08/modeling-the-adventureworks-inventory-database-for-azure-search.aspx).

**Including binary data**

You might want image, audio, or video content in your search results. In this case, the files should be stored elsewhere, with the index including a representative field with a URL to the resource. Any content, especially binary content, that is not searchable should be stored in cheaper storage, and then referenced by URI in a field in your index.

**Synchronizing data**

As you can imagine, the index must be regularly synchronized with other data sources used in your solution. In an online retail catalog, the inventory database that captures sales transactions must have the same SKUs, pricing, and availability as the data surfaced via search results. Depending on how much latency is acceptable for your solution, you might find that data synchronization can be once a week, once a day, or in near real-time using concurrent writes to both an inventory database and an Azure Search index. [Import data to Azure Search](search-what-is-data-import.md) explains the available options in detail.

## Storage in the cloud

Because Azure Search is a fully-managed search service, data storage is handled as an internal operation. As a programmer, it's important to understand that you cannot bypass the Azure Search APIs to connect to the index directly, nor can you monitor index size or health except through portal notifications or API calls. There is no facility for backing up or restoring an index, nor for optimizing or tuning performance at the storage layer. Behind the scenes, data is stored as blob storage, but the best way to think about the physical storage and management of an index is as an implementation detail that could change in the future. One of the primary benefits of the service is  the hands-off approach to physically managing the compute resources of your search application.

If query volume or data storage requirements change over time, you can increase or decrease capacity by adding or moving replicas and partitions. For details, see [Manage your Search service in Azure](search-manage.md) or [Service Limits](search-limits-quotas-capacity.md).

<!--Image References-->
[1]: ./media/search-what-is-an-index/search-JSON-indexSchema.png