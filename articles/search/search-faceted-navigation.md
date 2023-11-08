---
title: Add a faceted navigation category hierarchy
titleSuffix: Azure AI Search
description: Add faceted navigation for self-directed filtering in applications that integrate with Azure AI Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/08/2023

---

# Add faceted navigation to a search app

Faceted navigation is used for self-directed drilldown filtering on query results in a search app, where your application offers form controls for scoping search to groups of documents (for example, categories or brands), and Azure AI Search provides the data structures and filters to back the experience. 

In this article, learn the basic steps for creating a faceted navigation structure in Azure AI Search.

> [!div class="checklist"]
> * Set field attributes in the index
> * Structure the request and response
> * Add navigation controls and filters in the presentation layer

Code in the presentation layer does the heavy lifting in a faceted navigation experience. The demos and samples listed at the end of this article provide working code that shows you how to bring everything together.

## Faceted navigation in a search page

Facets are dynamic and returned on a query. A search response brings with it all of the facet categories used to navigate the documents in the result. The query executes first, and then facets are pulled from the current results and assembled into a faceted navigation structure.

In Azure AI Search, facets are one layer deep and can't be hierarchical. If you aren't familiar with faceted navigation structures, the following example shows one on the left. Counts indicate the number of matches for each facet. The same document can be represented in multiple facets.

:::image source="media/search-faceted-navigation/azure-search-facet-nav.png" alt-text="Screenshot of faceted search results.":::

Facets can help you find what you're looking for, while ensuring that you don't get zero results. As a developer, facets let you expose the most useful search criteria for navigating your search index.

## Enable facets in the index

Faceting is enabled on a field-by-field basis in an index definition when you set the "facetable" attribute to true.

Although it's not strictly required, you should also set the "filterable" attribute so that you can build the necessary filters that back the faceted navigation experience in your search application.

The following example of the "hotels" sample index shows "facetable" and "filterable" on low cardinality fields that contain single values or short phrases: "Category", "Tags", "Rating".

```json
{
  "name": "hotels",  
  "fields": [
    { "name": "hotelId", "type": "Edm.String", "key": true, "searchable": false, "sortable": false, "facetable": false },
    { "name": "Description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false },
    { "name": "HotelName", "type": "Edm.String", "facetable": false },
    { "name": "Category", "type": "Edm.String", "filterable": true, "facetable": true },
    { "name": "Tags", "type": "Collection(Edm.String)", "filterable": true, "facetable": true },
    { "name": "Rating", "type": "Edm.Int32", "filterable": true, "facetable": true },
    { "name": "Location", "type": "Edm.GeographyPoint" }
  ]
}
```

### Choosing fields

Facets can be calculated over single-value fields as well as collections. Fields that work best in faceted navigation have these characteristics:

* Low cardinality (a small number of distinct values that repeat throughout documents in your search corpus)

* Short descriptive values (one or two words) that will render nicely in a navigation tree

The values within a field, and not the field name itself, produces the facets in a faceted navigation structure. If the facet is a string field named *Color*, facets will be blue, green, and any other value for that field.

As a best practice, check fields for null values, misspellings or case discrepancies, and single and plural versions of the same word. By default, filters and facets don't undergo lexical analysis or [spell check](speller-how-to-add.md), which means that all values of a "facetable" field are potential facets, even if the words differ by one character. Optionally, you can [assign a normalizer](search-normalizers.md) to a "filterable" and "facetable" field to smooth out variations in casing and characters.

### Defaults in REST and Azure SDKs

If you are using one of the Azure SDKs, your code must explicitly set the field attributes. In contrast, the REST API has defaults for field attributes based on the [data type](/rest/api/searchservice/supported-data-types). The following data types are "filterable" and "facetable" by default:

* `Edm.String`
* `Edm.DateTimeOffset`
* `Edm.Boolean`
* `Edm.Int32`, `Edm.Int64`, `Edm.Double`
* Collections of any of the above types, for example `Collection(Edm.String)` or `Collection(Edm.Double)`

You can't use `Edm.GeographyPoint` or `Collection(Edm.GeographyPoint)` fields in faceted navigation. Facets work best on fields with low cardinality. Due to the resolution of geo-coordinates, it's rare that any two sets of coordinates will be equal in a given dataset. As such, facets aren't supported for geo-coordinates. You would need a city or region field to facet by location.

> [!TIP]
> As a best practice for performance and storage optimization, turn faceting off for fields that should never be used as a facet. In particular, string fields for unique values, such as an ID or product name, should be set to `"facetable": false` to prevent their accidental (and ineffective) use in faceted navigation. This is especially true for the REST API that enables filters and facets by default.

## Facet request and response

Facets are specified on the query, and the faceted navigation structure is returned at the top of the response. The structure of a request and response is fairly simple. In fact, the real work behind faceted navigation lies in the presentation layer, covered in a later section. 

The following REST example is an unqualified query (`"search": "*"`) that is scoped to the entire index (see the [built-in hotels sample](search-get-started-portal.md)). Facets are usually a list of fields, but this query shows just one for a more readable response below.

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

It's useful to initialize a search page with an open query to completely fill in the faceted navigation structure. As soon as you pass query terms in the request, the faceted navigation structure will be scoped to just the matches in the results, rather than the entire index.

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
        }
    ]
}
```

## Facets syntax

A facet query parameter is set to a comma-delimited list of "facetable" fields and depending on the data type, can be further parameterized to set counts, sort orders, and ranges:  `count:<integer>`, `sort:<>`, `interval:<integer>`, and `values:<list>`. For more detail about facet parameters, see ["Query parameters" in the REST API](/rest/api/searchservice/search-documents#query-parameters).

```http
POST https://{{service_name}}.search.windows.net/indexes/hotels/docs/search?api-version={{api_version}}
{
    "search": "*",
    "facets": [ "Category", "Tags,count:5", "Rating,values:1|2|3|4|5"],
    "count": true
}
```

For each faceted navigation tree, there's a default limit of the top ten facets. This default makes sense for navigation structures because it keeps the values list to a manageable size. You can override the default by assigning a value to "count". For example, `"Tags,count:5"` reduces the number of tags under the Tags section to the top five.

For Numeric and DateTime values only, you can explicitly set values on the facet field (for example, `facet=Rating,values:1|2|3|4|5`) to separate results into contiguous ranges (either ranges based on numeric values or time periods). Alternatively, you can add "interval", as in `facet=Rating,interval:1`. 

Each range is built using 0 as a starting point, a value from the list as an endpoint, and then trimmed of the previous range to create discrete intervals.

### Discrepancies in facet counts

Under certain circumstances, you might find that facet counts aren't fully accurate due to the [sharding architecture](search-capacity-planning.md#concepts-search-units-replicas-partitions-shards). Every search index is spread across multiple shards, and each shard reports the top N facets by document count, which are then combined into a single result. Because it's just the top N facets for each shard, it's possible to miss or under-count matching documents in the facet response.

To guarantee accuracy, you can artificially inflate the count:\<number> to a large number to force full reporting from each shard. You can specify `"count": "0"` for unlimited facets. Or, you can set "count" to a value that's greater than or equal to the number of unique values of the faceted field. For example, if you're faceting by a "size" field that has five unique values, you could set `"count:5"` to ensure all matches are represented in the facet response. 

The tradeoff with this workaround is increased query latency, so use it only when necessary.

## Presentation layer

In application code, the pattern is to use facet query parameters to return the faceted navigation structure along with facet results, plus a $filter expression.  The filter expression handles the click event and further narrows the search result based on the facet selection.

### Facet and filter combination

The following code snippet from the `JobsSearch.cs` file in the NYCJobs demo adds the selected Business Title to the filter if you select a value from the Business Title facet.

```cs
if (businessTitleFacet != "")
  filter = "business_title eq '" + businessTitleFacet + "'";
```

Here's another example from the hotels sample. The following code snippet adds `categoyrFacet` to the filter if a user selects a value from the category facet.

```csharp
if (!String.IsNullOrEmpty(categoryFacet))
    filter = $"category eq '{categoryFacet}'";
```

### HTML for faceted navigation

The following example, taken from the `index.cshtml` file of the NYCJobs sample application, shows the static HTML structure for displaying faceted navigation on the search results page. The list of facets is built or rebuilt dynamically when you submit a search term, or select or clear a facet.

```html
<div class="widget sidebar-widget jobs-filter-widget">
  <h5 class="widget-title">Filter Results</h5>
    <p id="filterReset"></p>
    <div class="widget-content">

      <h6 id="businessTitleFacetTitle">Business Title</h6>
      <ul class="filter-list" id="business_title_facets">
      </ul>

      <h6>Location</h6>
      <ul class="filter-list" id="posting_type_facets">
      </ul>

      <h6>Posting Type</h6>
      <ul class="filter-list" id="posting_type_facets"></ul>

      <h6>Minimum Salary</h6>
      <ul class="filter-list" id="salary_range_facets">
      </ul>

  </div>
</div>
```

### Build HTML dynamically

The following code snippet from the `index.cshtml` (also from NYCJobs demo) dynamically builds the HTML to display the first facet, Business Title. Similar functions dynamically build the HTML for the other facets. Each facet has a label and a count, which displays the number of items found for that facet result.

```js
function UpdateBusinessTitleFacets(data) {
  var facetResultsHTML = '';
  for (var i = 0; i < data.length; i++) {
    facetResultsHTML += '<li><a href="javascript:void(0)" onclick="ChooseBusinessTitleFacet(\'' + data[i].Value + '\');">' + data[i].Value + ' (' + data[i].Count + ')</span></a></li>';
  }

  $("#business_title_facets").html(facetResultsHTML);
}
```

## Tips for working with facets

This section is a collection of tips and workarounds that might be helpful.

### Preserve a facet navigation structure asynchronously of filtered results

One of the challenges of faceted navigation in Azure AI Search is that facets exist for current results only. In practice, it's common to retain a static set of facets so that the user can navigate in reverse, retracing steps to explore alternative paths through search content. 

Although this is a common use case, it's not something the faceted navigation structure currently provides out-of-the-box. Developers who want static facets typically work around the limitation by issuing two filtered queries: one scoped to the results, the other used to create a static list of facets for navigation purposes.

### Clear facets

When you design the search results page, remember to add a mechanism for clearing facets. If you add check boxes, you can easily see how to clear the filters. For other layouts, you might need a breadcrumb pattern or another creative approach. In the hotels C# sample, you can send an empty search to reset the page. In contrast, the NYCJobs sample application provides a clickable `[X]` after a selected facet to clear the facet, which is a stronger visual queue to the user.

### Trim facet results with more filters

Facet results are documents found in the search results that match a facet term. In the following example, in search results for *cloud computing*, 254 items also have *internal specification* as a content type. Items aren't necessarily mutually exclusive. If an item meets the criteria of both filters, it's counted in each one. This duplication is possible when faceting on `Collection(Edm.String)` fields, which are often used to implement document tagging.

```output
Search term: "cloud computing"
Content type
   Internal specification (254)
   Video (10)
```

In general, if you find that facet results are consistently too large, we recommend that you add more filters to give users more options for narrowing the search.

### A facet-only search experience

If your application uses faceted navigation exclusively (that is, no search box), you can mark the field as `searchable=false`, `filterable=true`, `facetable=true` to produce a more compact index. Your index won't include inverted indexes and there will be no text analysis or tokenization. Filters are made on exact matches at the character level.

### Validate inputs at query-time

If you build the list of facets dynamically based on untrusted user input, validate that the names of the faceted fields are valid. Or, escape the names when building URLs by using either `Uri.EscapeDataString()` in .NET, or the equivalent in your platform of choice.

## Demos and samples

Several samples include faceted navigation. This section has links to the samples and also notes which client library and language is used for each one.

### Add search to web apps (React)

Tutorials and samples in [C#](tutorial-csharp-overview.md), [Python](tutorial-python-overview.md), and [JavaScript](tutorial-javascript-overview.md) include faceted navigation as well as filters, suggestions, and autocomplete. These samples use React for the presentation layer.

### NYCJobs sample code and demo (Ajax)

The NYCJobs sample is an ASP.NET MVC application that uses Ajax in the presentation layer. It's available as a [live demo app](https://aka.ms/azjobsdemo) and as source code on [Azure-Samples repo on GitHub](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs).
