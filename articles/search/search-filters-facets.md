---
title: Facet filters for search navigation in apps
titleSuffix: Azure Cognitive Search
description: Filter criteria by user security identity, geo-location, or numeric values to reduce search results on queries in Azure Cognitive Search, a hosted cloud search service on Microsoft Azure.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/30/2021
ms.custom: devx-track-csharp
---

# Add faceted navigation in Azure Cognitive Search

Faceted navigation is used for self-directed filtering on query results in a search app, where your application offers form controls for scoping search to groups of documents (for example, categories or brands), and Azure Cognitive Search provides the faceted search data structures and filters to back the experience. 

In this article, learn the basic steps for creating a faceted navigation structure backing the search experience you want to provide.

> [!div class="checklist"]
> * Set field attributes in the index
> * Structure the request and response
> * Add navigation controls and filters in the presentation layer

Code in the presentation layer does the heavy lifting in a faceted navigation experience. The demos and samples listed at the end of this article provide working code that shows you how to bring everything together.

## What is faceted navigation?

Facets are dynamic and returned on a query. A search response brings with it the facet categories used to navigate the documents in the result. The query executes first, and then facets are pulled from the current results and assembled into a faceted navigation structure. 

If you aren't familiar with faceted navigation structured, the following example shows one on the left.

:::image source="media/tutorial-csharp-create-first-app/azure-search-facet-nav.png" alt-text="faceted search results":::

## Enable facets in the index

Faceting is enabled on a field-by-field basis in an index definition when you set the `facetable` attribute to `true`.

Although it's not strictly required, you should also set the `filterable` attribute so that you can build the necessary filters that back the faceted navigation experience in your search application.

The following example of the "hotels" sample index shows `facetable` and `filterable` on low cardinality fields that contain single values or short phrases: "Category", "Tags", "Rating".

```json
{
  "name": "hotels",  
  "fields": [
    { "name": "hotelId", "type": "Edm.String", "key": true, "searchable": false, "sortable": false, "facetable": false },
    { "name": "Description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false },
    { "name": "HotelName", "type": "Edm.String", "facetable": false },
    { "name": "category", "type": "Edm.String", "filterable": true, "facetable": true },
    { "name": "Tags", "type": "Collection(Edm.String)", "filterable": true, "facetable": true },
    { "name": "Rating", "type": "Edm.Int32", "filterable": true, "facetable": true },
    { "name": "Location", "type": "Edm.GeographyPoint" }
  ]
}
```

### Choosing fields

Facets can be calculated over single value fields as well as collections. Fields that work best in faceted navigation have these characteristics:

* Low cardinality (a small number of distinct values that repeat throughout documents in your search corpus)

* Short descriptive values (one or two words)

The contents of a field, and not the field itself, produces the facets in a faceted navigation structure. If the facet is a string field *Color*, facets will be blue, green, and any other value for that field.

As a best practice, check fields for null values, misspellings or case discrepancies, and single and plural versions of the same word. Filters and facets do not undergo lexical analysis or [spell check](speller-how-to-add.md), which means that all values of a `facetable` field are potential facets, even if the words differ by one character.

### Defaults in REST and Azure SDKs

If you are using one of the Azure SDKs, your code must specify all field attributes. In contrast, the REST API has defaults for field attributes based on the [data type](/rest/api/searchservice/supported-data-types). The following data types are `filterable` and `facetable` by default:

* `Edm.String`
* `Edm.DateTimeOffset`
* `Edm.Boolean`
* `Edm.Int32`, `Edm.Int64`, `Edm.Double`
* Collections of any of the above types, for example `Collection(Edm.String)` or `Collection(Edm.Double)`

You cannot use `Edm.GeographyPoint` or `Collection(Edm.GeographyPoint)` fields in faceted navigation. Facets work best on fields with low cardinality. Due to the resolution of geo-coordinates, it is rare that any two sets of co-ordinates will be equal in a given dataset. As such, facets are not supported for geo-coordinates. You would need a city or region field to facet by location.

> [!Tip]
> As a best practice for performance and storage optimization, turn faceting off for fields that should never be used as a facet. In particular, string fields for unique values, such as an ID or product name, should be set to `"facetable": false` to prevent their accidental (and ineffective) use in faceted navigation. This is especially true for the REST API that enables filters and facets by default.

## Facet request

Facets are specified on the query and the faceted navigation structure is returned at the top of the response. The structure of a request and response is fairly simple. In fact, the real work behind faceted navigation lies in the presentation layer, covered in a later section. 

The following REST example is an unqualified query (`"search": "*"`) that is scoped to the entire index (using the [built-in hotels sample](search-get-started-portal.md)). Facets are usually a list of fields, but his query shows just one for a more readable example.

```http
POST https://{{service_name}}.search.windows.net/indexes/hotels/docs/search?api-version={{api_version}}
{
    "search": "*",
    "queryType": "simple",
    "select": "",
    "searchFields": "",
    "filter": "",
    "facets": [ "Category"], 
    "orderby": "",
    "count": true
}
```

It's useful to initialize a search page with an open query to completely fill in the faceted navigation structure. As soon as you pass query terms in the request, the faceted navigation structure will be scoped to just the matching documents. 

The response for the example above includes the faceted navigation structure at the top. The structure consists of "Category" values and a count of the hotels for each one. It's followed by the rest of the search results, trimmed here for brevity. This example works well for several reasons. The number of facets for this field fall under the limit (default is 10) so all of them appear, and every hotel in the index of 50 hotels is represented in exactly one of these categories.

```json
{
    "@odata.context": "https://demo-search-svc.search.windows.net/indexes('hotels')/$metadata#docs(*)",
    "@odata.count": 50,
    "@search.facets": {
        "Category": [
            {
                "count": 13,
                "value": "Budget"
            },
            {
                "count": 12,
                "value": "Resort and Spa"
            },
            {
                "count": 9,
                "value": "Luxury"
            },
            {
                "count": 7,
                "value": "Boutique"
            },
            {
                "count": 5,
                "value": "Suite"
            },
            {
                "count": 4,
                "value": "Extended-Stay"
            }
        ]
    },
    "value": [
        {
            "@search.score": 1.0,
            "HotelId": "1",
            "HotelName": "Secret Point Motel",
            "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time's Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.",
            "Category": "Boutique",
            "Tags": [
                "pool",
                "air conditioning",
                "concierge"
            ],
            "ParkingIncluded": false,
  . . .
```

## Facets syntax

A facet query parameter is set to a comma-delimited list of `facetable` fields and depending on the data type, can be further parameterized to set sort, orders, increase or lower the maximum account on each facet, or specify ranges:  `count:<integer>`, `sort:<>`, `interval:<integer>`, and `values:<list>`. For more detail about facet parameters, see ["Query parameters" in the REST API](/rest/api/searchservice/search-documents#query-parameters).

```http
POST https://{{service_name}}.search.windows.net/indexes/hotels/docs/search?api-version={{api_version}}
{
    "search": "*",
    "facets": [ "Category", "Tags,count:5", "Rating,values:1|2|3|4|5"],
    "count": true
}
```

For each faceted navigation tree, there is a default limit of 10 facets. This default makes sense for navigation structures because it keeps the values list to a manageable size. You can override the default by assigning a value to `count`. For example, "Tags,count:5" reduces the number of tags under the Tags section to the top give.

For Numeric and DateTime values only, you can explicitly set values on the facet field (for example, 
`facet=Rating,values:1|2|3|4|5`) to separate results into contiguous ranges (either ranges based on numeric values or time periods). Alternatively, you can add `interval`, as in `facet=Rating,interval:1`. 

Each range is built using 0 as a starting point, a value from the list as an endpoint, and then trimmed of the previous range to create discrete intervals.

### Discrepancies in facet counts

Under certain circumstances, you might find that facet counts do not match the result sets (see [Faceted navigation in Azure Cognitive Search (Microsoft Q&A question page)](/answers/topics/azure-cognitive-search.html)).

Facet counts can be inaccurate due to the sharding architecture. Every search index has multiple shards, and each shard reports the top N facets by document count, which is then combined into a single result. If some shards have many matching values, while others have fewer, you may find that some facet values are missing or under-counted in the results.

Although this behavior could change at any time, if you encounter this behavior today, you can work around it by artificially inflating the count:\<number> to a large number to enforce full reporting from each shard. If the value of count: is greater than or equal to the number of unique values in the field, you are guaranteed accurate results. However, when document counts are high, there is a performance penalty, so use this option judiciously.

<!-- ## Filter on facets

In application code, construct a query that specifies all parts of a valid query, including search expressions, facets, filters, scoring profiles– anything used to formulate a request. The following example builds a request that creates facet navigation based on the type of accommodation, rating, and other amenities.

```csharp
var sp = new SearchOptions()
{
    ...
    // Add facets
    Facets = new[] { "category", "rating", "parkingIncluded", "smokingAllowed" }.ToList()
};
```

### Return filtered results on click events

When the end user clicks on a facet value, the handler for the click event should use a filter expression to realize the user's intent. Given a `category` facet, clicking the category "motel" is implemented with a `$filter` expression that selects accommodations of that type. When a user clicks "motel" to indicate that only motels should be shown, the next query the application sends includes `$filter=category eq 'motel'`.

The following code snippet adds category to the filter if a user selects a value from the category facet.

```csharp
if (!String.IsNullOrEmpty(categoryFacet))
    filter = $"category eq '{categoryFacet}'";
```

If the user clicks on a facet value for a collection field like `tags`, for example the value "pool", your application should use the following filter syntax: `$filter=tags/any(t: t eq 'pool')` 


### Add labels for fields in the facet navigation structure

Labels are typically defined in presentation layer (for example, in `index.cshtml`). The query API in Azure Cognitive Search does not return facet navigation labels. Your application code will provide the labels in the rendered page.

-->

## Tips for working with facets

### Preserve a facet navigation structure asynchronously of filtered results

One of the challenges of faceted navigation in Azure Cognitive Search is that facets exist for current results only. In practice, it's common to retain a static set of facets so that the user can navigate in reverse, retracing steps to explore alternative paths through search content. 

Although this is a common use case, it's not something the faceted navigation structure currently provides out-of-the-box. Developers who want static facets typically work around the limitation by issuing two filtered queries: one scoped to the results, the other used to create a static list of facets for navigation purposes.

### A facet-only search experience

If your application uses faceted navigation exclusively (that is, no search box), you can mark the field as `searchable=false`, `filterable=true`, `facetable=true` to produce a more compact index. Your index will not include inverted indexes and there will be no text analysis or tokenization. Filters are made on exact matches at the character level.

## Demos and samples

### Create your first app in C# (Razor)

This tutorial and sample series in C# includes a [lesson focused on faceted navigation](tutorial-csharp-facets.md). The solution is an ASP.NET MVC app and the presentation layer uses the Razor client libraries.

### Add search to web apps (React)

Tutorials and samples in [C#](tutorial-csharp-overview.md), [Python](tutorial-python-overview.md), and [Javascript](tutorial-javascript-overview.md) include faceted navigation as well as filters, suggestions, and autocomplete. These samples use React for the presentation layer.

### NYCJobs sample code and demo

The NYCJobs sample is an ASP.NET MVC application that includes faceted navigation. It's available as a [live demo app](https://aka.ms/azjobsdemo) and as source code on [Azure-Samples repo on GitHub](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs).

### Video demonstration

At 45:25 in [Azure Cognitive Search Deep Dive](https://channel9.msdn.com/Events/TechEd/Europe/2014/DBI-B410), there is a demo on how to implement facets.