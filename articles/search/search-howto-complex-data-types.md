---
title: Model complex data types
titleSuffix: Azure AI Search
description: Nested or hierarchical data structures can be modeled in an Azure AI Search index using ComplexType and Collections data types.

manager: nitinme
author: bevloh
ms.author: beloh
tags: complex data types; compound data types; aggregate data types
ms.custom:
  - ignite-2023
ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/18/2024
---

# Model complex data types in Azure AI Search

External datasets used to populate an Azure AI Search index can come in many shapes. Sometimes they include hierarchical or nested substructures. Examples might include multiple addresses for a single customer, multiple colors and sizes for a single SKU, multiple authors of a single book, and so on. In modeling terms, you might see these structures referred to as *complex*, *compound*, *composite*, or *aggregate* data types. The term Azure AI Search uses for this concept is **complex type**. In Azure AI Search, complex types are modeled using **complex fields**. A complex field is a field that contains children (subfields) which can be of any data type, including other complex types. This works in a similar way as structured data types in a programming language.

Complex fields represent either a single object in the document, or an array of objects, depending on the data type. Fields of type `Edm.ComplexType` represent single objects, while fields of type `Collection(Edm.ComplexType)` represent arrays of objects.

Azure AI Search natively supports complex types and collections. These types allow you to model almost any JSON structure in an Azure AI Search index. In previous versions of Azure AI Search APIs, only flattened row sets could be imported. In the newest version, your index can now more closely correspond to source data. In other words, if your source data has complex types, your index can have complex types also.

To get started, we recommend the [Hotels data set](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/hotels), which you can load in the **Import data** wizard in the Azure portal. The wizard detects complex types in the source and suggests an index schema based on the detected structures.

> [!NOTE]
> Support for complex types became generally available starting in `api-version=2019-05-06`. 
>
> If your search solution is built on earlier workarounds of flattened datasets in a collection, you should change your index to include complex types as supported in the newest API version. For more information about upgrading API versions, see [Upgrade to the newest REST API version](search-api-migration.md) or [Upgrade to the newest .NET SDK version](/previous-versions/azure/search/search-dotnet-sdk-migration-version-9).

## Example of a complex structure

The following JSON document is composed of simple fields and complex fields. Complex fields, such as `Address` and `Rooms`, have subfields. `Address` has a single set of values for those subfields, since it's a single object in the document. In contrast, `Rooms` has multiple sets of values for its subfields, one for each object in the collection.


```json
{
  "HotelId": "1",
  "HotelName": "Secret Point Motel",
  "Description": "Ideally located on the main commercial artery of the city in the heart of New York.",
  "Tags": ["Free wifi", "on-site parking", "indoor pool", "continental breakfast"],
  "Address": {
    "StreetAddress": "677 5th Ave",
    "City": "New York",
    "StateProvince": "NY"
  },
  "Rooms": [
    {
      "Description": "Budget Room, 1 Queen Bed (Cityside)",
      "RoomNumber": 1105,
      "BaseRate": 96.99,
    },
    {
      "Description": "Deluxe Room, 2 Double Beds (City View)",
      "Type": "Deluxe Room",
      "BaseRate": 150.99,
    }
    . . .
  ]
}
```

## Indexing complex types

During indexing, you can have a maximum of 3000 elements across all complex collections within a single document. An element of a complex collection is a member of that collection, so in the case of Rooms (the only complex collection in the Hotel example), each room is an element. In the example above, if the "Secret Point Motel" had 500 rooms, the hotel document would have 500 room elements. For nested complex collections, each nested element is also counted, in addition to the outer (parent) element.

This limit applies only to complex collections, and not complex types (like Address) or string collections (like Tags).

## Create complex fields

As with any index definition, you can use the portal, [REST API](/rest/api/searchservice/create-index), or [.NET SDK](/dotnet/api/azure.search.documents.indexes.models.searchindex) to create a schema that includes complex types. 

Other Azure SDKs provide samples in [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/search/azure-search-documents/samples/sample_index_crud_operations.py), [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexExample.java), and [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/search/search-documents/samples/v11/javascript/indexOperations.js).

### [**Azure portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the search service **Overview** page, select the **Indexes** tab.

1. Open an existing index or create a new index.

1. Select the **Fields** tab, and then select **Add field**.  An empty field is added. If you're working with an existing fields collection, scroll down to set up the field.

1. Give the field a name and set the type to either `Edm.ComplexType` or `Collection(Edm.ComplexType)`.

1. Select the ellipses on the far right, and then select either **Add field** or **Add subfield**, and then assign attributes.

### [**REST**](#tab/complex-type-rest)

Use [Create Index (REST API)](/rest/api/searchservice/create-index) to define a schema.

The following example shows a JSON index schema with simple fields, collections, and complex types. Notice that within a complex type, each subfield has a type and can have attributes, just as top-level fields do. The schema corresponds to the example data above. `Address` is a complex field that isn't a collection (a hotel has one address). `Rooms` is a complex collection field (a hotel has many rooms).

```json
{
  "name": "hotels",
  "fields": [
    { "name": "HotelId", "type": "Edm.String", "key": true, "filterable": true },
    { "name": "HotelName", "type": "Edm.String", "searchable": true, "filterable": false },
    { "name": "Description", "type": "Edm.String", "searchable": true, "analyzer": "en.lucene" },
    { "name": "Address", "type": "Edm.ComplexType",
      "fields": [
        { "name": "StreetAddress", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, "searchable": true },
        { "name": "City", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true },
        { "name": "StateProvince", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true }
      ]
    },
    { "name": "Rooms", "type": "Collection(Edm.ComplexType)",
      "fields": [
        { "name": "Description", "type": "Edm.String", "searchable": true, "analyzer": "en.lucene" },
        { "name": "Type", "type": "Edm.String", "searchable": true },
        { "name": "BaseRate", "type": "Edm.Double", "filterable": true, "facetable": true }
      ]
    }
  ]
}
```

### [**C#**](#tab/complex-type-csharp)

Use the [Search Index class](/dotnet/api/azure.search.documents.indexes.models.searchindex) to define the index schema.

The following snippets are from [search-dotnet-getting-started/DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo/DotNetHowTo). 

In the Hotels sample index, `Address` is a complex field that isn't a collection (a hotel has one address). `Rooms` is a complex collection field (a hotel has many rooms). Both [Address](https://github.com/Azure-Samples/search-dotnet-getting-started/blob/master/DotNetHowTo/DotNetHowTo/Address.cs) and [Room](https://github.com/Azure-Samples/search-dotnet-getting-started/blob/master/DotNetHowTo/DotNetHowTo/Room.cs) are defined as classes.

```csharp
using Azure.Search.Documents.Indexes;

namespace AzureSearch.SDKHowTo
{
    public partial class Address
    {
        [SearchableField(IsFilterable = true)]
        public string StreetAddress { get; set; }

        [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
        public string City { get; set; }

        [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
        public string StateProvince { get; set; }

        [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
        public string PostalCode { get; set; }

        [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
        public string Country { get; set; }
    }
}
```

In [Hotel.cs](https://github.com/Azure-Samples/search-dotnet-getting-started/blob/master/DotNetHowTo/DotNetHowTo/Hotel.cs), both Address and Room are members of Hotel.

```csharp
using System;
using Microsoft.Spatial;
using System.Text.Json.Serialization;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace AzureSearch.SDKHowTo
{
    public partial class Hotel
    {
        [SimpleField(IsKey = true, IsFilterable = true)]
        public string HotelId { get; set; }

        [SearchableField(IsSortable = true)]
        public string HotelName { get; set; }

        // Removed multiple fields for brevity

        // Address is declared as type Address
        [SearchableField]
        public Address Address { get; set; }

        // Room array is declared as type Room
        public Room[] Rooms { get; set; }
    }
}
```

---

## Update complex fields

All of the [reindexing rules](search-howto-reindex.md) that apply to fields in general still apply to complex fields. Restating a few of the main rules here, adding a field to a complex type doesn't require an index rebuild, but most modifications do.

### Structural updates to the definition

You can add new subfields to a complex field at any time without the need for an index rebuild. For example, adding "ZipCode" to `Address` or "Amenities" to `Rooms` is allowed, just like adding a top-level field to an index. Existing documents have a null value for new fields until you explicitly populate those fields by updating your data.

Notice that within a complex type, each subfield has a type and can have attributes, just as top-level fields do

### Data updates

Updating existing documents in an index with the `upload` action works the same way for complex and simple fields: all fields are replaced. However, `merge` (or `mergeOrUpload` when applied to an existing document) doesn't work the same across all fields. Specifically, `merge` doesn't support merging elements within a collection. This limitation exists for collections of primitive types and complex collections. To update a collection, you need to retrieve the full collection value, make changes, and then include the new collection in the Index API request.

## Search complex fields

Free-form search expressions work as expected with complex types. If any searchable field or subfield anywhere in a document matches, then the document itself is a match.

Queries get more nuanced when you have multiple terms and operators, and some terms have field names specified, as is possible with the [Lucene syntax](query-lucene-syntax.md). For example, this query attempts to match two terms, "Portland" and "OR", against two subfields of the Address field:

> `search=Address/City:Portland AND Address/State:OR`

Queries like this are *uncorrelated* for full-text search, unlike filters. In filters, queries over subfields of a complex collection are correlated using range variables in [`any` or `all`](search-query-odata-collection-operators.md). The Lucene query above returns documents containing both "Portland, Maine" and "Portland, Oregon", along with other cities in Oregon. This happens because each clause applies to all values of its field in the entire document, so there's no concept of a "current subdocument". For more information on this, see [Understanding OData collection filters in Azure AI Search](search-query-understand-collection-filters.md).

## Select complex fields

The `$select` parameter is used to choose which fields are returned in search results. To use this parameter to select specific subfields of a complex field, include the parent field and subfield separated by a slash (`/`).

> `$select=HotelName, Address/City, Rooms/BaseRate`

Fields must be marked as Retrievable in the index if you want them in search results. Only fields marked as Retrievable can be used in a `$select` statement.

## Filter, facet, and sort complex fields

The same [OData path syntax](query-odata-filter-orderby-syntax.md) used for filtering and fielded searches can also be used for faceting, sorting, and selecting fields in a search request. For complex types, rules apply that govern which subfields can be marked as sortable or facetable. For more information on these rules, see the [Create Index API reference](/rest/api/searchservice/create-index).

### Faceting subfields

Any subfield can be marked as facetable unless it is of type `Edm.GeographyPoint` or `Collection(Edm.GeographyPoint)`.

The document counts returned in the facet results are calculated for the parent document (a hotel), not the subdocuments in a complex collection (rooms). For example, suppose a hotel has 20 rooms of type "suite". Given this facet parameter `facet=Rooms/Type`, the facet count is one for the hotel, not 20 for the rooms.

### Sorting complex fields

Sort operations apply to documents (Hotels) and not subdocuments (Rooms). When you have a complex type collection, such as Rooms, it's important to realize that you can't sort on Rooms at all. In fact, you can't sort on any collection.

Sort operations work when fields have a single value per document, whether the field is a simple field, or a subfield in a complex type. For example, `Address/City` is allowed to be sortable because there's only one address per hotel, so `$orderby=Address/City` sorts hotels by city.

### Filtering on complex fields

You can refer to subfields of a complex field in a filter expression. Just use the same [OData path syntax](query-odata-filter-orderby-syntax.md) that's used for faceting, sorting, and selecting fields. For example, the following filter returns all hotels in Canada:

> `$filter=Address/Country eq 'Canada'`

To filter on a complex collection field, you can use a **lambda expression** with the [`any` and `all` operators](search-query-odata-collection-operators.md). In that case, the **range variable** of the lambda expression is an object with subfields. You can refer to those subfields with the standard OData path syntax. For example, the following filter returns all hotels with at least one deluxe room and all nonsmoking rooms:

> `$filter=Rooms/any(room: room/Type eq 'Deluxe Room') and Rooms/all(room: not room/SmokingAllowed)`

As with top-level simple fields, simple subfields of complex fields can only be included in filters if they have the **filterable** attribute set to `true` in the index definition. For more information, see the [Create Index API reference](/rest/api/searchservice/create-index).

Azure Search has the limitation that the complex objects in the collections across a single document cannot exceed 3000.

Users will encounter the below error during indexing when complex collections exceed the 3000 limit.

“A collection in your document exceeds the maximum elements across all complex collections limit. The document with key '1052' has '4303' objects in collections (JSON arrays). At most '3000' objects are allowed to be in collections across the entire document. Remove objects from collections and try indexing the document again."

In some use cases, we might need to add more than 3000 items to a collection. In those use cases, we can pipe (|) or use any form of delimiter to delimit the values, concatenate them, and store them as a delimited string. There is no limitation on the number of strings stored in an array in Azure Search. Storing these complex values as strings avoids the limitation. The customer needs to validate whether this workaround meets their scenario requirements.

For example, it wouldn't be possible to use complex types if the "searchScope" array below had more than 3000 elements.

```json

"searchScope": [
  {
     "countryCode": "FRA",
     "productCode": 1234,
     "categoryCode": "C100" 
  },
  {
     "countryCode": "USA",
     "productCode": 1235,
     "categoryCode": "C200" 
  }
]
```

Storing these complex values as strings with a delimiter avoids the limitation

```json
"searchScope": [
        "|FRA|1234|C100|",
        "|FRA|*|*|",
        "|*|1234|*|",
        "|*|*|C100|",
        "|FRA|*|C100|",
        "|*|1234|C100|"
]

```
Rather than storing these with wildcards, we can also use a [custom analyzer](index-add-custom-analyzers.md)  that splits the word into | to cut down on storage size.

The reason we have stored the values with wildcards instead of just storing them as below

>`|FRA|1234|C100|`

is to cater to search scenarios where the customer might want to search for items that have country France, irrespective of products and categories. Similarly, the customer might need to search to see if the item has product 1234, irrespective of the country or the category.

If we had stored only one entry

>`|FRA|1234|C100|`

without wildcards, if the user wants to filter only on France, we cannot convert the user input to match the "searchScope" array because we don't know what combination of France is present in our "searchScope" array


If the user wants to filter only by country, let's say France. We will take the user input and construct it as a string as below:

>`|FRA|*|*|`

which we can then use to filter in azure search as we search in an array of item values

```csharp
foreach (var filterItem in filterCombinations)
        {
            var formattedCondition = $"searchScope/any(s: s eq '{filterItem}')";
            combFilter.Append(combFilter.Length > 0 ? " or (" + formattedCondition + ")" : "(" + formattedCondition + ")");
        }

```
Similarly, if the user searches for France and the 1234 product code, we will take the user input, construct it as a delimited string as below, and match it against our search array.

>`|FRA|1234|*|`

If the user searches for 1234 product code, we will take the user input, construct it as a delimited string as below, and match it against our search array.

>`|*|1234|*|`

If the user searches for the C100 category code, we will take the user input, construct it as a delimited string as below, and match it against our search array.

>`|*|*|C100|`

If the user searches for France and the 1234 product code and C100 category code, we will take the user input, construct it as a delimited string as below, and match it against our search array.

>`|FRA|1234|C100|`

If a user tries to search for countries not present in our list, it will not match the delimited array "searchScope" stored in the search index, and no results will be returned.
For example, a user searches for Canada and product code 1234. The user search would be converted to

>`|CAN|1234|*|`

This will not match any of the entries in the delimited array in our search index.

Only the above design choice requires this wild card entry; if it had been saved as a complex object, we could have simply performed an explicit search as shown below.

```csharp
           var countryFilter = $"searchScope/any(ss: search.in(countryCode ,'FRA'))";
            var catgFilter = $"searchScope/any(ss: search.in(categoryCode ,'C100'))";
            var combinedCountryCategoryFilter = "(" + countryFilter + " and " + catgFilter + ")";

```
We can thus satisfy requirements where we need to search for a combination of values by storing it as a delimited string instead of a complex collection if our complex collections exceed the Azure Search limit. This is one of the workarounds, and the customer needs to validate if this would meet their scenario requirements.


## Next steps

Try the [Hotels data set](https://github.com/Azure-Samples/azure-search-sample-data/tree/master/hotels) in the **Import data** wizard. You need the Azure Cosmos DB connection information provided in the readme to access the data.

With that information in hand, your first step in the wizard is to create a new Azure Cosmos DB data source. Further on in the wizard, when you get to the target index page, you see an index with complex types. Create and load this index, and then execute queries to understand the new structure.

> [!div class="nextstepaction"]
> [Quickstart: portal wizard for import, indexing, and queries](search-get-started-portal.md)
