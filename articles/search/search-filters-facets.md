---
title: Facet filters in Azure Search | Microsoft Docs
description: Filter criteria by user security identity, language, geo-location, or numeric values to reduce search results on queries in Azure Search, a hosted cloud search service on Microsoft Azure.
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: search
ms.devlang: 
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 10/13/2017
ms.author: heidist

---

# How to build a facet filter in Azure Search 

Faceted navigation is used for self-directed filtering on query results in a search app, where your application offers UI controls for scoping search to groups of dcuments (for example, categories or brands), and Azure Search provides the data stucture to back the experience. In this article, quickly review the basic steps for creating a faceted navigation structure backing the search experience you want to provide. 

> [!div class="checklist"]
> * Choose fields for filtering and faceting
> * Set attributes on the field
> * Build the index and load data
> * Add facet filters to a query
> * Handle results

Facets are dynamic and returned on a query. Search responses bring with them the facet categories used to navigate the results. If you aren't familiar with facets, the following example is an illustration of a facet navigation structure.

  ![](./media/search-filters/facet-nav.png)

New to faceted navigation and want more detail? See [How to implement faceted navigation in Azure Search](search-faceted-navigation.md).

## Choose fields

Facets can be based on simple or complex field types in Azure Search. Fields that work best in faceted navigation have low cardinality: a small number of distinct values that repeat throughout documents in your search corpus (for example, a list of colors, countries, or brand names). 

Faceting is enabled on a field-by-field basis when you create the index, by setting the following attributes to TRUE: `filterable`, `facetable`. Only filterable fields can be faceted.

Any [field type](https://docs.microsoft.com/rest/api/searchservice/supported-data-types) that could possibly be used in faceted navigation is marked as "facetable":

+ Edm.String
+ Edm.DateTimeOffset
+ Edm.Boolean
+ Edm.Collections (see [How to facet complex data types](#facet-complex-fields) later in this article.)
+ Numeric field types: Edm.Int32, Edm.Int64, Edm.Double

You cannot use Edm.GeographyPoint in faceted navigation. Facets are constructed from human readable text or numbers. As such, facets are not supported for geo-coordinates. You would need a city or region field to facet by location.

## Set attributes

Index attributes that control how a field is used are added to individual field definitions in the index. In the following example, fields with low cardinality, useful for faceting, consist of: category (hotel, motel, hostel), amenities, and ratings. 

In the .NET API, filtering attributes have to be set explicitly. In the REST API, faceting and filtering are enabled by default, which means you only need to explicitly set the attributes when you want to turn them off. Although it is not technically required, we show the attributions in the following REST example for instructional purposes. 

> [!Tip]
> As a best practice for performance and storage optimization, turn faceting off for fields that should never be used as a facet. In particular, string fields for singleton values, such as an ID or product name, should be set to "Facetable": false to prevent their accidental (and ineffective) use in faceted navigation.


```http
{
    "name": "hotels",  
    "fields": [
        {"name": "hotelId", "type": "Edm.String", "key": true, "searchable": false, "sortable": false, "facetable": false},
        {"name": "baseRate", "type": "Edm.Double"},
        {"name": "description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false},
        {"name": "description_fr", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, "analyzer": "fr.lucene"},
        {"name": "hotelName", "type": "Edm.String", "facetable": false},
        {"name": "category", "type": "Edm.String", "filterable": true, "facetable": true},
        {"name": "tags", "type": "Collection(Edm.String)", "filterable": true, "facetable": true},
        {"name": "parkingIncluded", "type": "Edm.Boolean",  "filterable": true, "facetable": true, "sortable": false},
        {"name": "smokingAllowed", "type": "Edm.Boolean", "filterable": true, "facetable": true, "sortable": false},
        {"name": "lastRenovationDate", "type": "Edm.DateTimeOffset"},
        {"name": "rating", "type": "Edm.Int32", "filterable": true, "facetable": true},
        {"name": "location", "type": "Edm.GeographyPoint"}
    ]
}
```

> [!Note]
> This index definition is copied from [Create an Azure Search index using the REST API](https://docs.microsoft.com/azure/search/search-create-index-rest-api). It is identical except for superficial differences in the field definitions. Filterable and facetable attributes are explicitly added on category, tags, parkingIncluded, smokingAllowed, and rating fields. In practice, you get filterable and facetable for free on Edm.String, Edm.Boolean, and Edm.Int32 field types. 

## Build and load an index

An intermediate (and perhaps obvious) step is that you have to [build and populate the index](https://docs.microsoft.com/azure/search/search-create-index-dotnet#create-the-index) on your Azure Search service as a prerequisite to submitting the query. We mention this step here for completeness. If you can see your index in the [Azure portal](https://portal.azure.com) and view the index definition, you can accept that as proof this step is complete.

## Add facet filters to a query

In application code, construct a query that specifies all parts of a valid query, including search expressions, facets, filters, scoring profiles– anything used to formulate a request. The following example builds a request that creates facet navigation based on the type of accommodation, rating, and other amenities.

```csharp
SearchParameters sp = new SearchParameters()
{
  ...
  // Add facets
  Facets = new List<String>() { "category", "rating", "parkingIncluded", "smokingAllowed" },
};
```

### Return filtered results on click events

The filter expression handles the click event on the facet value. Given a Category facet, clicking the category "motel" is implemented through a `$filter` expression that selects accommodations of that type. When a user clicks "motels" to indicate that only motels should be shown, the next query the application sends includes $filter=category eq ‘motels’.

The following code snippet adds category to the filter if a user selects a value from the category facet.

```csharp
if (categoryFacet != "")
  filter = "category eq '" + categoryFacet + "'";
```
Using the REST API, the request would be articulated as `$filter=category eq 'c1'`. To make category a multi-value field, use the following syntax: `$filter=category/any(c: c eq 'c1')`

## Tips and workarounds

### Initialize a page with facets in place

If you want to initialize a page with facets in place, you can send a query as part of page initialization to seed the page with an initial facet structure.

### Preserve a facet navigation structure asynchronously of filtered results

One of the challenges with facet navigation in Azure Search is that facets exist for current results only. In practice, it's common to retain a static set of facets so that the user can navigate in reverse, retracing steps to explore alternative paths through search content. 

Although this is a common use case, it's not something the facet navigation structure currently provides out-of-the-box. Developers who want static facets typically work around the limitation by issuing two filtered queries: one scoped to the results, the other used to create a static list of facets for navigation purposes.

## See also

+ [Filters in Azure Search](search-filters.md)
+ [Create Index REST API](https://docs.microsoft.com/rest/api/searchservice/create-index)
+ [Search Documents REST API](https://docs.microsoft.com/rest/api/searchservice/search-documents)

