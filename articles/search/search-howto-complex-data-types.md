---
title: How to model complex data types - Azure Search
description: Nested or hierarchical data structures can be modeled in an Azure Search index using ComplexType and Collections data types.
author: brjohnstmsft
manager: jlembicz
ms.author: brjohnst
tags: complex data types; compound data types; aggregate data types
services: search
ms.service: search
ms.topic: conceptual
ms.date: 05/02/2019
ms.custom: seodec2018
---
# How to model complex data types in Azure Search

External datasets used to populate an Azure Search index sometimes include hierarchical or nested substructures. Examples might include multiple locations and phone numbers for a single customer, multiple colors and sizes for a single SKU, multiple authors of a single book, and so on. In modeling terms, you might see these structures referred to as *complex data types*, *compound data types*, *composite data types*, or *aggregate data types*,. In Azure Search terminology, a complex type is a field that contains children (sub-fields), and a collection is a list. 

Azure Search natively supports complex types and collections. Together, these types allow you to model almost any nested JSON structure in an Azure Search index. In previous versions of Azure Search APIs, only flattened row sets could be imported. In the newest version, your index can now more closely correspond to source data. In other words, if your source data has complex types, your index can have complex types also.

To get started, we recommend the [Hotels demo dat set](https://github.com/Azure-Samples/azure-search-sample-data/blob/master/README.md), which you can load in the **Import data** wizard. The wizard detects complex types in the source and infers those structures in the default index schema.

> [!Note]
> Support for complex types is generally available in `api-version=2019-05-06`. 
>
> If your search solution is built on earlier versions using a two-step workaround of flattened datasets in a collection, you can modify your index to include complex types as described in this article. For more information, see [Upgrade to the newest REST API version](search-api-migration.md) or [Upgrade to the newest .NET SDK version](search-dotnet-sdk-migration.md).

## Example of a complex structure

The following JSON document is composed of simple fields and complex fields. Complex fields, such as the `Address` and `Room` arrays, have multiple fields and groups of fields, respectively. You can refer to this example to understand the concepts and behaviors described in this article.

```json
{
      "HotelId": "1",
      "HotelName": "Secret Point Motel",
      "Description": "Ideally located on the main commercial artery of the city in the heart of New York.",
      "Address": {
        "StreetAddress": "677 5th Ave",
        "City": "New York",
        "StateProvince": "NY"
      },
      "Rooms": [
        {
          "Description": "Budget Room, 1 Queen Bed (Cityside)",
          "Type": "Budget Room",
          "BaseRate": 96.99,
        },
        {
          "Description": "Deluxe Room, 2 Double Beds (City View)",
          "Type": "Deluxe Room",
          "BaseRate": 150.99,
        },
      ]
    },
    {
      "HotelId": "2",
      "HotelName": "Twin Dome Motel",
      "Description": "Situated in a  nineteenth-century plaza, renovated to the highest architectural standards.",
       "Address": {
        "StreetAddress": "140 University Town Center Dr",
        "City": "Sarasota",
        "StateProvince": "FL"
      },
      "Rooms": [
        {
          "Description": "Suite, 2 Double Beds (Mountain View)",
          "Type": "Suite",
          "BaseRate": 250.99,
        }
      ]
    },
```

## Create a complex type

As with any index definition, you can use the portal, [REST API](https://docs.microsoft.com/rest/api/searchservice/create-index), or [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.index?view=azure-dotnet) to create a schema that includes complex types. 

The following example shows a JSON index schema with simple fields, collections, and complex types. Notice that within a complex type, each sub-field has a type and attributes, just as simple fields do. The schema corresponds to the example data above. `Address` is a single complex type (a hotel has one address). `Rooms` is a collection of complex types (a hotel has many rooms).

For indexes used in a [push-model data import](search-what-is-data-import.md) strategy, where you are pushing a JSON data set to an Azure Search index, you can only have the basic syntax shown here: single complex types like `Address`, or a `Collection(Edm.ComplexType)` like `Rooms`. You cannot have complex types nested inside other complex types in an index used for push-model data ingestion.

Indexers are a different story. When defining an indexer, in particular one used to build a knowledge store, your index can have nested complex types. An indexer is able to hold a chain of complex data structures in-memory, and when it includes a skillset, it can support highly complex data forms. For more information and an example, see [How to get started with Knowledge Store](knowledge-store-howto.md).

```json
{
	"name": "hotels",
	"fields": [
		{	"name": "HotelId", "type": "Edm.String", "key": true, "filterable": true 	},
		{	"name": "HotelName", "type": "Edm.String", "searchable": true, "filterable": false },
		{ "name": "Description", "type": "Edm.String", "searchable": true, "analyzer": "en.lucene" },
		{	"name": "Address", "type": "Edm.ComplexType",
			"fields": [{
					"name": "StreetAddress",
					"type": "Edm.String",
					"filterable": false,
					"sortable": false,
					"facetable": false,
					"searchable": true 	},
				{
					"name": "City",
					"type": "Edm.String",
					"searchable": true,
					"filterable": true,
					"sortable": true,
					"facetable": true
				},
				{
					"name": "StateProvince",
					"type": "Edm.String",
					"searchable": true,
					"filterable": true,
					"sortable": true,
					"facetable": true
				}
			]
		},
		{
			"name": "Rooms",
			"type": "Collection(Edm.ComplexType)",
			"fields": [{
					"name": "Description",
					"type": "Edm.String",
					"searchable": true,
					"analyzer": "en.lucene"
				},
				{
					"name": "Type",
					"type": "Edm.String",
					"searchable": true
				},
				{
					"name": "BaseRate",
					"type": "Edm.Double",
					"filterable": true,
					"facetable": true
				},
			]
		}
	]
}
```
## Updating complex fields

All of the [reindexing rules](search-howto-reindex.md) that apply to fields in general still apply to complex fields. Restating a few of the main ones here, adding a field does not require an index rebuild, but modifying a field does.

For complex fields containing sub-fields (Addresses), or for collections of complex fields (Rooms), the unit of operation for adding or modifying fields is at the parent level. If you want to add a sub-field to Address, or change a field name, you will need to rebuild the index. 

Data refresh, where you pick up new or changed rows but leave the index structure intact, is always at the document level (assuming that the document has been updated in the source). 

## Searching complex fields

Free-form search expressions work as expected with complex types. If any searchable field or sub-field anywhere in a document matches, then the document itself is a match. 

Queries get more nuanced when you have multiple terms and operators, and some terms have field names specified, as is possible with the [Lucene syntax](query-lucene-syntax.md). Consider this example, which uses OData syntax for addressing nested fields of complex types: 

```json
search=Address/City:'Portland' AND Address/State:OR
```

Queries like this have uncorrelated semantics by default (unlike filters, which are always correlated). This means that the Lucene query above would return documents containing "Portland, Maine" as well as "Portland, Oregon", and other cities in Oregon. This is because each clause is evaluated against all values of the specified field in the entire document, so there is no notion of a "current sub-document". 

## Selecting complex fields

The `$select` argument is used to choose which fields are returned in search results. To use this argument with a complex type, include the field and sub-field with "/" as a separator.

```json
$select=HotelName, Address/City, Rooms/BaseRate
```

Recall that fields must be marked as Retrievable in the index if you want them in search results. Only fields marked as Retrievable can be used in a `$select` statement. 


## Filter, facet, and sort complex fields

The same [OData path syntax](query-odata-filter-orderby-syntax.md) used for filtering and fielded searches can also be used for faceting, sorting, and selecting fields in a search request. For complex types, rules apply that govern which sub-fields can be marked as sortable or facetable. 

### Faceting sub-fields 

Any sub-field can be marked as facetable unless it is of type `Edm.GeographyPoint` or `Collection(Edm.GeographyPoint)`. 

When document counts are returned for the faceted navigation structure, the counts are relative to the parent document (a hotel), not to nested documents within a complex collection (rooms). For example, suppose a hotel has 20 rooms of type "suite". Given this facet parameter `facet=Rooms/Type`,
the facet count will be one for the parent document (hotels) and not intermediate sub-documents (rooms). 

### Sorting complex fields

Sort operations work when fields are single-valued, whether as a simple field, or as a sub-field in a complex type. For this reason, the previous restrictions on sorting a collection still apply, assuming that collection is a list of arbitrary strings.

As you might expect, `$orderby=Address/ZipCode` complex type is sortable because there is only one zip code per hotel. Similarly, `Rooms/Description` can be sorted because there is only one description per room.

What you cannot sort are the fields within a collection under a complex type. Consider the `Rooms` collection, with sub-fields for base rate, type, and description. `Rooms/BaseRate` sub-field is not sortable because each hotel has multiple rooms with different rates. 

Recall that fields must be marked as Filterable and Sortable in the index to be used in an `$orderby` statement. 

## Next steps

 Try the [Hotels demo dat set](https://github.com/Azure-Samples/azure-search-sample-data/blob/master/README.md) in the **Import data** wizard. You'll need the Cosmos DB connection information provided in the readme. 
 
 With that information in hand, your first step in the wizard is to create a new Azure Cosmos DB data source. Further on, when you get to the target index page, you will see an index with complex types. Create and load this index, and then execute queries to understand the new structure.

> [!div class="nextstepaction"]
> [Quickstart: portal wizard for import, indexing, and queries](search-get-started-portal.md)