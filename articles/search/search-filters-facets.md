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
ms.date: 09/30/2017
ms.author: heidist

---

# How to build a facet filter in Azure Search 

Faceted navigation is used for self-directed filtering on query results in a search app, where the application offers UI controls for scoping search to product categories, brands, or price ranges. In this article, quickly learn basic steps for creating a faceted navigation structure to back the search experience you want to create. 

> [!div class="checklist"]
> * Choose fields for filtering and faceting
> * Set attributes on the field
> * Build the index and load data
> * Add facet filters to a query
> * Handle results
> * Facet navigation for complex objects 

Facets are dynamic and returned on a query. Search results bring with them the facet categories used to navigate the results. The following example is an illustration of a facet navigation structure.

  ![](./media/search-filters/facet-nav.png)

New to faceted navigation and want more detail? See [How to implement faceted navigation in Azure Search](search-faceted-navigation.md).

> [!Tip]
> If you want to initialize a page with facets in place, you can send a query as part of page initialization to seed the page with an initial facet structure.

## Choose fields

Facets can be based on simple or complex field types in Azure Search. Fields that work best in faceted navigation have low cardinality: a small number of distinct values that repeat throughout documents in your search corpus.

Faceting is enabled on a field-by-field basis when you create the index, setting the following attributes to TRUE: `filterable`, `facetable`. Only filterable fields can be faceted.

All [field types](https://docs.microsoft.com/rest/api/searchservice/supported-data-types) that could possibly be used in faceted navigation are Facetable by default:

+ Edm.String
+ Edm.DateTimeOffset
+ Edm.Boolean
+ Edm.Collections (see [How to facet complex data types](#facet-complex-fields) later in this article.)
+ Numeric field types: Edm.Int32, Edm.Int64, Edm.Double

You cannot use Edm.GeographyPoint in faceted navigation. Facets are constructed from human readable text or numbers. As such, facets are not supported for geo-coordinates. You would need a city or region field to facet by location.

## Set attributes

Index attributes that control how a field is used are added to individual field definitions in the index. In the following eample, fields with low cardinality, useful for faceting, include category (hotel, motel, hostel), amenities, and ratings. 

Because faceting and filtering are enabled by default, explicitly setting the attributes is not required unless you want to turn faceting off. We include the attributions in our example for instructional purposes.

> [!Tip]
> As a best practice for performance and storage optimization, turn faceting off for fields that should never be used as a facet. In particular, string fields for singleton values, such as an ID or product name, should be set to "Facetable": false to prevent their accidental (and ineffective) use in faceted navigation.


    ```Http
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
> This index definition is copied from [Create an Azure Search index using the REST API](https://docs.microsoft.com/azure/search/search-create-index-rest-api). It is functionally equivalent, except that filterable and facetable attributes for category, tags, parkingIncluded, smokingAllowed, and rating are explicitly marked in this version for instructional purposes. In practice, you get filterable and facetable for free on Edm.String, Edm.Boolean, and Edm.Int32 field types.

## Build the index and load data

An intermediate (and perhaps obvious) step is that you have to build and populate the index on your Azure Search service as a prerequisite to submitting the query. We mention this step here for completeness. If you can see your index in the Azure portal and view the index definition, you can take that as proof that this step is complete.

## Add facet filters to a query

STEPS TBD

https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents 

## Handle results

STEPS TBD

<a name="facet-complex-fields"></a>

## Facet complex data types

If you are [modeling complex data types](search-howto-complex-data-types.md), you can use them in a facet navigation structure.

STEPS TBD

## See also

+ [Filters in Azure Search](search-filters.md)
+ [How full text search works in Azure Search](search-lucene-query-architecture.md)
+ [Search Documents REST API](https://docs.microsoft.com/rest/api/searchservice/search-documents)

