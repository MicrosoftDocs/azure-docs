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
- [REST API](search-create-index-rest-api.md)

Azure Search is a hosted cloud search service that provides a search engine, advanced search functionality, and search application data storage. Whether you develop applications for the web or applications that run on site, you can use Azure Search to provide full-text search, multi-language search, and controlled search that is responsive to user context through recommendations or history (currently a code-based implementation), or business goals that boost search rankings based on criteria you provide.

##What is an index?

An index is persisted storage of all searchable data, plus any non-searchable data that is somehow used in API calls you make into Azure Search. If you are familiar with database concepts, an index is conceptually equivalent to a table in a relational database in how it is a collection of fields, defined by a schema. An index stores documents, which are equivalent to rows in a table.

##How are indexes used in Azure Search?

Any operation performed by Azure Search that returns data must return that data from an index. There is no separate storage layer. The service cannot reach into other data sources used or managed by your custom application to return external data in its responses.

As part of provisioning your search service for use by your application, you will create the index by specifying a schema that defines it, and then load it with data via push or pull (crawl) data ingestion techniques.

Having a deep understanding of the original source data is essential to creating a good schema. You will want to match up data types, know which field to use as a key that uniquely identifies each document, and under

An index in Azure Search gets data from a single table, view, blob container, or equivalent. You might need to create a data structure in your database or noSQL application that provides the data imported to Azure Search. Alternatively, for certain data sources like Azure SQL Database or DocumentDB, you can create an indexer that crawls an external table, view or blob container for data to upload into Azure Search.

##Index composition

Indexes consist of attributed fields, data values, and other constructs that shape how queries and search results are constructed.

- Attributes (or properties) are annotations on the field that specify data type, length, value, and behaviors allowed for that field. You can specify whether a field is searchable, retrievable, or sortable, all on a field-by-field basis. You can also specify which language analyzer to use at the field level.
- Key is a reserved field in the schema that provides a unique identifier for every document in the fields collection.
- Scoring profiles are criteria used to boost the ranking of a search hit that has more of the characteristics set by the profile. For example, suppose a search term is matched in a product name and product description, you might want matches in product name to be ranked higher than those found in a description.
- Suggestions, also known as auto-complete or typeahead queries, are defined as a section in the index.
- Default language analyzers can be specified at the index level, for global applicability to all fields.
- CORS options enable cross-domain scripting and are also part of an index definition.

You can create indexes through the portal, .NET SDK, or REST API.

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

Because Azure Search is a fully-managed search service, data storage is handled as an internal operation. Behind the scenes, data is stored as blob storage, but you should think of that as an implementation detail that could change in the future. As a programmer, it's important to understand that you cannot bypass Azure Search APIs in any connection to the index. You cannot connect to the index directly, nor can you monitor size except through portal notifications or API calls. There is no facility for optimizing or tuning performance at the storage layer.  