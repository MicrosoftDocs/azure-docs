<properties
	pageTitle="Create an Azure Search index | Microsoft Azure | Hosted cloud search service"
	description="What is an index in Azure Search and how is it used?"
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
	ms.date="03/10/2016"
	ms.author="heidist"/>

# Create an Azure Search index
> [AZURE.SELECTOR]
- [Overview](search-what-is-an-index.md)
- [Portal](search-create-index-portal.md)
- [.NET](search-create-index-dotnet.md)
- [REST](search-create-index-rest-api.md)

## What is an index?

An *index* is persisted storage of *documents* and other constructs used by an Azure Search service. Documents are a basic unit of searchable data. For example, a retailer might have a document for each SKU, a news organization might have a document for each article, and a streaming media organization might have a document for each video or song in their library. Mapping these concepts to more familiar database equivalents: an *index* is conceptually similar to a *table*, and *documents* are roughly equivalent to *rows* in a table.


## When do I create an index?

As part of provisioning a search service for use by your application, you'll need to create an index. Making an index available for search operations is a 2-part task. First, define the schema and post it to Azure Search. Second, [populate the index](search-what-is-data-import.md) with a user-defined dataset that complies with the schema.

To create a schema that defines an index, you can use the portal or write code that calls into the .NET SDK or REST API (see the tabs at the top of this topic). For more about data ingestion after the index is created, see [Import data to Azure Search](search-what-is-data-import.md).


<a name="index-attributes"></a>
## Index attributes

Attributes are set on individual fields to specify how the field is used. The following table enumerates the attributes you can specify.

|**Property**|Description|
|------------|-----------|
|*Key*|A string that provides the unique ID of each document, used for document look up. Every index must have one key. Only one field can be the key, and its type must be set to Edm.String.|
|*Retrievable*|Specifies whether a field can be returned in a search result.|
|*Filterable*|Allows the field to be used in **$filter** queries.|
|*Sortable*|Allows the field to be used as a sort column in a result set.|
|*Facetable*|Allows a field to be used in a [faceted navigation](https://en.wikipedia.org/wiki/Faceted_search) structure for user self-directed filtering. Typically fields containing repetitive values that you can use to group multiple documents together (for example, multiple documents that fall under a single brand or service category) work best as facets.|
|*Searchable*|Marks the field as full-text searchable.|


## How are indexes used in Azure Search?

Data from your index is used to construct a search results list, a faceted navigation structure, or a details page for  single document. In Azure Search, an index can also contain non-searchable data used internally in filter expressions or in the scoring profiles that provide criteria used for boosting a search ranking score.

All data-related operations performed by Azure Search consume or return data from an index. There are no exceptions: you cannot point the service to other data sources besides the index to return external data in a response emitted by your search service.

Obviously, for applications that accumulate and operate on data, such as sales transactions of an online retail app, an Azure Search index will be an additional data source in your overall solution. While it might seem redundant to have dedicated data storage just for search, having it provides these benefits: consistency in search results, reduced volatility, fewer round trips between your application and Azure Search, and improved overall performance of search operations because there is no contention for resources or data.

## Guidance for defining an schema

Schemas are created as JSON structures. You should create one index for each custom solution that you integrate with Azure Search. You cannot link or join multiple indexes, but you can create complex indexes that accommodate a range of search scenarios required by your solution. For example, if your applications support multiple languages, the fields collection in your index could have language-specific variants for each field.

As you design your index, take your time in the planning phase to think through each decision. Changing an index after it is deployed involves rebuilding and reloading the data. If you create the index in code, this step will be much easier than if you create it manually in the portal.

Having a solid understanding of the original source data is essential to creating a good schema. You will want to match up data types, know which field to use as a *key* that uniquely identifies each document in the index, and which fields should be exposed in a search results list or detail page.

## Storage in the cloud

Because Azure Search is a fully-managed search service, data storage is handled as an internal operation. As a programmer, it's important to understand that you cannot bypass the Azure Search APIs to connect to the index directly, nor can you monitor index size or health except through portal notifications or API calls. There is no facility for backing up or restoring an index, nor for optimizing or tuning performance at the storage layer. Behind the scenes, data is stored as blob storage, but the best way to think about the physical storage and management of an index is as an implementation detail that could change in the future. One of the primary benefits of the service is  the hands-off approach to physically managing the compute resources of your search application.

If data storage requirements change over time, you can increase or decrease capacity by adding or removing partitions. For details, see [Manage your Search service in Azure](search-manage.md) or [Service Limits](search-limits-quotas-capacity.md).
