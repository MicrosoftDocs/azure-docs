---
title: Add a faceted navigation category hierarchy
titleSuffix: Azure Cognitive Search
description: Add faceted navigation for self-directed filtering in applications that integrate with Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/24/2021
ms.custom: devx-track-csharp
---
# Faceted navigation example using the NYCJobs demo app

Faceted navigation is a filtering mechanism that provides self-directed drilldown navigation in search applications. The term 'faceted navigation' may be unfamiliar, but you've probably used it before. As the following example shows, faceted navigation is nothing more than the categories used to filter results.

 ![Azure Cognitive Search Job Portal Demo](media/search-faceted-navigation/azure-search-faceting-example.png "Azure Cognitive Search Job Portal Demo")

Faceted navigation is an alternative entry point to search. It offers a convenient alternative to typing complex search expressions by hand. Facets can help you find what you're looking for, while ensuring that you don't get zero results. As a developer, facets let you expose the most useful search criteria for navigating your search index. In online retail applications, faceted navigation is often built over brands, departments (kid's shoes), size, price, popularity, and ratings. 

Implementing faceted navigation differs across search technologies. In Azure Cognitive Search, faceted navigation is built at query time, using fields that you previously attributed in your schema.

- In the queries that your application builds, a query must send *facet query parameters* to get the available facet filter values for that document result set.

- To actually trim the document result set, the application must also apply a `$filter` expression.

In your application development, writing code that constructs queries constitutes the bulk of the work. Many of the application behaviors that you would expect from faceted navigation are provided by the service, including built-in support for defining ranges and getting counts for facet results. The service also includes sensible defaults that help you avoid unwieldy navigation structures. 

<!-- ## Get started

If you're new to search development, the best way to think of faceted navigation is that it shows the possibilities for self-directed search. It's a type of drill-down search experience, based on predefined filters, used for quickly narrowing down search results through point-and-click actions.  -->

### Interaction model

The search experience for faceted navigation is iterative, so let's start by understanding it as a sequence of queries that unfold in response to user actions.

The starting point is an application page that provides faceted navigation, typically placed on the periphery. Faceted navigation is often a tree structure, with checkboxes for each value, or clickable text. 

1. A query sent to Azure Cognitive Search specifies the faceted navigation structure via one or more facet query parameters. For instance, the query might include `facet=Rating`, perhaps with a `:values` or `:sort` option to further refine the presentation.
2. The presentation layer renders a search page that provides faceted navigation, using the facets specified on the request.
3. Given a faceted navigation structure that includes Rating, you click "4" to indicate that only products with a rating of 4 or higher should be shown. 
4. In response, the application sends a query that includes `$filter=Rating ge 4` 
5. The presentation layer updates the page, showing a reduced result set, containing just those items that satisfy the new criteria (in this case, products rated 4 and up).

A facet is a query parameter, but do not confuse it with query input. It is never used as selection criteria in a query. Instead, think of facet query parameters as inputs to the navigation structure that comes back in the response. For each facet query parameter you provide, Azure Cognitive Search evaluates how many documents are in the partial results for each facet value.

Notice the `$filter` in step 4. The filter is an important aspect of faceted navigation. Although facets and filters are independent in the API, you need both to deliver the experience you intend. 

### App design pattern

In application code, the pattern is to use facet query parameters to return the faceted navigation structure along with facet results, plus a $filter expression.  The filter expression handles the click event on the facet value. Think of the `$filter` expression as the code behind the actual trimming of search results returned to the presentation layer. Given a Colors facet, clicking the color Red is implemented through a `$filter` expression that selects only those items that have a color of red. 

<!-- ### Query basics

In Azure Cognitive Search, a request is specified through one or more query parameters (see [Search Documents](/rest/api/searchservice/Search-Documents) for a description of each one). None of the query parameters are required, but you must have at least one in order for a query to be valid.

Precision, understood as the ability to filter out irrelevant hits, is achieved through one or both of these expressions:

-   **search=**  
    The value of this parameter constitutes the search expression. It might be a single piece of text, or a complex search expression that includes multiple terms and operators. On the server, a search expression is used for full-text search, querying searchable fields in the index for matching terms, returning results in rank order. If you set `search` to null, query execution is over the entire index (that is, `search=*`). In this case, other elements of the query, such as a `$filter` or scoring profile, are the primary factors affecting which documents are returned `($filter`) and in what order (`scoringProfile` or `$orderby`).

-   **$filter=**  
    A filter is a powerful mechanism for limiting the size of search results based on the values of specific document attributes. A `$filter` is evaluated first, followed by faceting logic that generates the available values and corresponding counts for each value

Complex search expressions decrease the performance of the query. Where possible, use well-constructed filter expressions to increase precision and improve query performance.

To better understand how a filter adds more precision, compare a complex search expression to one that includes a filter expression:

-   `GET /indexes/hotel/docs?search=lodging budget +Seattle –motel +parking`
-   `GET /indexes/hotel/docs?search=lodging&$filter=City eq 'Seattle' and Parking and Type ne 'motel'`

Both queries are valid, but the second is superior if you're looking for non-motels with parking in Seattle.
-   The first query relies on those specific words being mentioned or not mentioned in string fields like Name, Description, and any other field containing searchable data.
-   The second query looks for precise matches on structured data and is likely to be much more accurate.

In applications that include faceted navigation, make sure that each user action over a faceted navigation structure is accompanied by a narrowing of search results. To narrow results, use a filter expression. -->

<a name="howtobuildit"></a>

## Build a faceted navigation app
You implement faceted navigation with Azure Cognitive Search in your application code that builds the search request. The faceted navigation relies on elements in your schema that you defined previously.

Predefined in your search index is the `Facetable [true|false]` index attribute, set on selected fields to enable or disable their use in a faceted navigation structure. Without `"Facetable" = true`, a field cannot be used in facet navigation.

The presentation layer in your code provides the user experience. It should list the constituent parts of the faceted navigation, such as the label, values, check boxes, and the count. The Azure Cognitive Search REST API is platform agnostic, so use whatever language and platform you want. The important thing is to include UI elements that support incremental refresh, with updated UI state as each additional facet is selected. 

At query time, your application code creates a request that includes `facet=[string]`, a request parameter that provides the field to facet by. A query can have multiple facets, such as `&facet=color&facet=category&facet=rating`, each one separated by an ampersand (&) character.

Application code must also construct a `$filter` expression to handle the click events in faceted navigation. A `$filter` reduces the search results, using the facet value as filter criteria.

Azure Cognitive Search returns the search results, based on one or more terms that you enter, along with updates to the faceted navigation structure. In Azure Cognitive Search, faceted navigation is a single-level construction, with facet values, and counts of how many results are found for each one.

In the following sections, we take a closer look at how to build each part.

<a name="presentationlayer"></a>

## Build the UI
Working back from the presentation layer can help you uncover requirements that might be missed otherwise, and understand which capabilities are essential to the search experience.

In terms of faceted navigation, your web or application page displays the faceted navigation structure, detects user input on the page, and inserts the changed elements. 

For web applications, AJAX is commonly used in the presentation layer because it allows you to refresh incremental changes. You could also use ASP.NET MVC or any other visualization platform that can connect to an Azure Cognitive Search service over HTTP. The sample application referenced throughout this article -- the **Azure Cognitive Search Job Portal Demo** – happens to be an ASP.NET MVC application.

In the sample, faceted navigation is built into the search results page. The following example, taken from the `index.cshtml` file of the sample application, shows the static HTML structure for displaying faceted navigation on the search results page. The list of facets is built or rebuilt dynamically when you submit a search term, or select or clear a facet.

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

The following code snippet from the `index.cshtml` page dynamically builds the HTML to display the first facet, Business Title. Similar functions dynamically build the HTML for the other facets. Each facet has a label and a count, which displays the number of items found for that facet result.

```js
function UpdateBusinessTitleFacets(data) {
  var facetResultsHTML = '';
  for (var i = 0; i < data.length; i++) {
    facetResultsHTML += '<li><a href="javascript:void(0)" onclick="ChooseBusinessTitleFacet(\'' + data[i].Value + '\');">' + data[i].Value + ' (' + data[i].Count + ')</span></a></li>';
  }

  $("#business_title_facets").html(facetResultsHTML);
}
```

> [!TIP]
> When you design the search results page, remember to add a mechanism for clearing facets. If you add check boxes, you can easily see how to clear the filters. For other layouts, you might need a breadcrumb pattern or another creative approach. For example, in the Job Search Portal sample application, you can click the `[X]` after a selected facet to clear the facet.

<a name="buildquery"></a>

## Build the query

The code that you write for building queries should specify all parts of a valid query, including search expressions, facets, filters, scoring profiles– anything used to formulate a request. In this section, we explore where facets fit into a query, and how filters are used with facets to deliver a reduced result set.

Notice that facets are integral in this sample application. The search experience in the Job Portal Demo is designed around faceted navigation and filters. The prominent placement of faceted navigation on the page demonstrates its importance. 

An example is often a good place to begin. The following example, taken from the `JobsSearch.cs` file, builds a request that creates facet navigation based on Business Title, Location, Posting Type, and Minimum Salary. 

```cs
SearchParameters sp = new SearchParameters()
{
  ...
  // Add facets
  Facets = new List<String>() { "business_title", "posting_type", "level", "salary_range_from,interval:50000" },
};
```

A facet query parameter is set to a field and depending on the data type, can be further parameterized by comma-delimited list that includes `count:<integer>`, `sort:<>`, `interval:<integer>`, and `values:<list>`. A values list is supported for numeric data when setting up ranges. See [Search Documents (Azure Cognitive Search API)](/rest/api/searchservice/Search-Documents) for usage details.

Along with facets, the request formulated by your application should also build filters to narrow down the set of candidate documents based on a facet value selection. For a bike store, faceted navigation provides clues to questions like *What colors, manufacturers, and types of bikes are available?*. Filtering answers questions like *Which exact bikes are red, mountain bikes, in this price range?*. When you click "Red" to indicate that only Red products should be shown, the next query the application sends includes `$filter=Color eq 'Red'`.

The following code snippet from the `JobsSearch.cs` page adds the selected Business Title to the filter if you select a value from the Business Title facet.

```cs
if (businessTitleFacet != "")
  filter = "business_title eq '" + businessTitleFacet + "'";
```

<a name="tips"></a> 

## Tips and best practices

### Indexing tips

**By default you can only have one level of faceted navigation** 

As noted, there is no direct support for nesting facets in a hierarchy. By default, faceted navigation in Azure Cognitive Search only supports one level of filters. However, workarounds do exist. You can encode a hierarchical facet structure in a `Collection(Edm.String)` with one entry point per hierarchy. Implementing this workaround is beyond the scope of this article. 

### Querying tips

**Validate fields**

If you build the list of facets dynamically based on untrusted user input, validate that the names of the faceted fields are valid. Or, escape the names when building URLs by using either `Uri.EscapeDataString()` in .NET, or the equivalent in your platform of choice.

### Filtering tips

**Trim facet results with more filters**

Facet results are documents found in the search results that match a facet term. In the following example, in search results for *cloud computing*, 254 items also have *internal specification* as a content type. Items are not necessarily mutually exclusive. If an item meets the criteria of both filters, it is counted in each one. This duplication is possible when faceting on `Collection(Edm.String)` fields, which are often used to implement document tagging.

```output
Search term: "cloud computing"
Content type
   Internal specification (254)
   Video (10)
```

In general, if you find that facet results are consistently too large, we recommend that you add more filters to give users more options for narrowing the search.