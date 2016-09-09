<properties 
	pageTitle="How to implement faceted navigation in Azure Search | Microsoft Azure | search navigation categories" 
	description="Add Faceted navigation to applications that integrate with Azure Search, a cloud hosted search service on Microsoft Azure." 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="06/08/2016" 
	ms.author="heidist"/>

#How to implement faceted navigation in Azure Search

Faceted navigation is a filtering mechanism that provides self-directed drilldown navigation in search applications. While the term ‘faceted navigation’ might be unfamiliar, it’s almost a given that you have used one before. As the following example shows, faceted navigation is nothing more than the categories used to filter results.

## What it looks like

 ![][1]
  
Facets can help you find what you are looking for, while ensuring that you won’t get zero results. As a developer, facets let you expose the most useful search criteria for navigating your search corpus. In online retail applications, faceted navigation is often built over brands, departments (kid’s shoes), size, price, popularity, and ratings. 

Implementing faceted navigation differs across search technologies and can be very complex. 
In Azure Search, faceted navigation is built at query time, using attributed fields previously specified in your schema. In the queries that your application builds, a query must send *facet query parameters* in order to receive the available facet filter values for that document result set. To actually trim the document result set, the application must apply a `$filter` expression.

In terms of application development, writing code that constructs queries constitutes the bulk of the work. Many of the application behaviors that you would want from faceted navigation is provided by the service, including built-in support for setting up ranges and getting counts for facet results. The service also includes sensible defaults that help you avoid unwieldy navigation structures. 

This article contains the following sections:

- [How to build it](#howtobuildit)
- [Build the presentation layer](#presentationlayer)
- [Build the index](#buildindex)
- [Check for data quality](#checkdata)
- [Build the query](#buildquery)
- [Tips on how to control faceted navigation](#tips)
- [Faceted navigation based on range values](#rangefacets)
- [Faceted navigation based on GeoPoints](#geofacets)
- [Try it out](#tryitout)

##Why use it
The most effective search applications have multiple interaction models besides a Search box. Faceted navigation is an alternative entry point to search, offering a convenient alternative to typing complex search expressions by hand.

##Know the fundamentals

If you are new to search development, the best way to think of faceted navigation is that it shows the possibilities for self-directed search. It’s a type of drill-down search experience, based on predefined filters, used for quickly narrowing down search results through point-and-click actions. 

**Interaction Model**

The search experience for faceted navigation is iterative, so let’s start by understanding it as a sequence of queries that unfold in response to user actions.

The starting point is an application page that provides faceted navigation, typically placed on the periphery. Faceted navigation is often a tree structure, with checkboxes for each value, or clickable text. 

1.	A query sent to Azure Search specifies the faceted navigation structure via one or more facet query parameters. For instance, the query might include `facet=Rating`, perhaps with a `:values` or `:sort` option to further refine the presentation.
2.	The presentation layer renders a search page that provides faceted navigation, using the facets specified on the request.
3.	Given a faceted navigation structure that includes Rating, the user clicks "4" to indicate that only products with a rating of 4 or higher should be shown. 
4.	In response, the application sends a query that includes `$filter=Rating ge 4` 
5.	The presentation layer updates the page, showing a reduced result set, containing just those items that satisfy the new criteria (in this case, products rated 4 and up).

A facet is a query parameter, but do not confuse it with query input. It is never used as selection criteria in a query. Instead, think of facet query parameters as inputs to the navigation structure that comes back in the response. For each facet query parameter you provide, Azure Search will evaluate how many documents are in the partial results for each facet value.

Notice the `$filter` in step 4. This is an important aspect of faceted navigation. Although facets and filters are independent in the API, you will need both to deliver the experience you intend. 

**Design Patterns**

In application code, the pattern is to use facet query parameters to return the faceted navigation structure along with facet results, plus a $filter expression that handles the click event. Think of the `$filter` expression as the code behind the actual trimming of search results returned to the presentation layer. Given a Colors facet, clicking the color Red is implemented through a `$filter` expression that selects only those items that have a color of red. 

**Query Basics in Azure Search**

In Azure Search, a request is specified through one or more query parameters (see [Search Documents](http://msdn.microsoft.com/library/azure/dn798927.aspx) for a description of each one). None of the query parameters are required, but you must have at least one in order for a query to be valid.

Precision, generally understood as the ability to filter out irrelevant hits, is achieved through one or both of these expressions:

- **search=**<br/>
The value of this parameter constitutes the search expression. It might be a single piece of text, or a complex search expression that includes multiple terms and operators. On the server, a search expression is used for full-text search, querying searchable fields in the index for matching terms, returning results in rank order. If you set `search` to null, query execution is over the entire index (that is, `search=*`). In this case, other elements of the query, such as a `$filter` or scoring profile, will be the primary factors affecting which documents are returned `($filter`) and in what order (`scoringProfile` or `$orderb`y).

- **$filter=**<br/>
A filter is a powerful mechanism for limiting the size of search results based on the values of specific document attributes. A `$filter` is evaluated first, followed by faceting logic that generates the available values and corresponding counts for each value

Complex search expressions will decrease the performance of the query. Where possible, utilize well-constructed filter expressions to increase precision and improve query performance.

To better understand how a filter adds more precision, compare a complex search expression to one that includes a filter expression:

- `GET /indexes/hotel/docs?search=lodging budget +Seattle –motel +parking`

- `GET /indexes/hotel/docs?search=lodging&$filter=City eq ‘Seattle’ and Parking and Type ne ‘motel’`

Although both queries are valid, the second is superior if you’re looking for non-motels with parking in Seattle. The first query relies on those specific words being mentioned or not mentioned in string fields like Name, Description, and any other field containing searchable data. The second query looks for precise matches on structured data and is likely to be much more accurate.

In applications that include faceted navigation, you will want to be sure that each user action over a faceted navigation structure is accompanied by a narrowing of search results, achieved through a filter expression.

<a name="howtobuildit"></a>
##How to build it

Faceted navigation in Azure Search is implemented in your application code that builds the request, but relies on predefined elements in your schema.

Predefined in your search index is the `Facetable [true|false]` index attribute, set on selected fields to enable or disable their use in a faceted navigation structure. Without `"Facetable" = true`, a field cannot be used in facet navigation.

At query time, your application code creates a request that includes `facet=[string]`, a request parameter that provides the field to facet by. A query can have multiple facets, such as `&facet=color&facet=category&facet=rating`, each one separated by an ampersand (&) character.

Application code must also construct a `$filter` expression to handle the click events in faceted navigation. A `$filter` reduces the search results, using the facet value as filter criteria.

Azure Search returns the search results, per the term(s) entered by the user, along with updates to the faceted navigation structure. In Azure Search, faceted navigation is a single-level construction, with facet values, and counts of how many results are found for each one.

The presentation layer in your code provides the user experience. It should list the constituent parts of the faceted navigation, such as the label, values, check boxes, and the count. The Azure Search REST API is platform agnostic, so use whatever language and platform you want. The important thing is to include UI elements that support incremental refresh, with updated UI state as each additional facet is selected. 

In the following sections, we’ll take a closer look at how to build each part, starting with the presentation layer.

<a name="presentationlayer"></a>
##Build the presentation layer

Working back from the presentation layer can help you uncover requirements that might be missed otherwise, and understand which capabilities are essential to the search experience.

In terms of faceted navigation, your web or application page displays the faceted navigation structure, detects user input on the page, and inserts the changed elements. 

For web applications, AJAX is commonly used in the presentation layer because it allows you to refresh incremental changes. You could also use ASP.NET MVC or any other visualization platform that can connect to an Azure Search service over HTTP. The sample application referenced throughout this article -- **AdventureWorks Catalog** – happens to be an ASP.NET MVC application.

The following example, taken from the **index.cshtml** file of the sample application, builds a dynamic HTML structure for displaying faceted navigation in your search results page. In the sample, faceted navigation is built into the search results page, and appears after the user has submitted a search term.

Notice that each facet has a label (Colors, Categories, Prices), a binding to a faceted field (color, categoryName, listPrice), and a `.count` parameter, used to return the number of items found for that facet result.

  ![][2]
 

> [AZURE.TIP] When designing the search results page, remember to add a mechanism for clearing facets. If you use check boxes, users can easily intuit how to clear the filters. For other layouts, you might need a breadcrumb pattern or another creative approach. For example, in the AdventureWorks Catalog sample application, you can click the title, AdventureWorks Catalog, to reset the search page.

<a name="buildindex"></a>
##Build the index

Faceting is enabled on a field-by-field basis in the index, via this index attribute: `"Facetable": true`.  
All field types that could possibly be used in faceted navigation are `Facetable` by default. Such field types include `Edm.String`, `Edm.DateTimeOffset`, and all the numeric field types (essentially, all field types are facetable except `Edm.GeographyPoint`, which can’t be used in faceted navigation). 

When building an index, a best practice for faceted navigation is to explicitly turn faceting off for fields that should never be used as a facet.  In particular, string fields for singleton values, such as an ID or product name, should be set to `"Facetable": false` to prevent their accidental (and ineffective) use in a faceted navigation.

Following is the schema for the AdventureWorks Catalog sample app (trimmed of some attributes to reduce overall size):

 ![][3]
 
Note that `Facetable` is turned off for string fields that shouldn’t be used as facets, such as an ID or name. Turning faceting off where you don’t need it helps keep the size of the index small, and generally improves performance.

> [AZURE.TIP] As a best practice, include the full set of index attributes for each field. Although `Facetable` is on by default for almost all fields, purposely setting each attribute can help you think through the implications of each schema decision. 

<a name="checkdata"></a>
##Check for Data Quality 

When developing any data-centric application, preparing the data is often one of the bigger parts of the job. Search applications are no exception. The quality of your data has a direct bearing on whether the faceted navigation structure materializes as you expect it to, as well as its effectiveness in helping you construct filters that reduce the result set.

In Azure Search, the search corpus is formed from documents that populate an index. Documents provide the values that are used to compute facets. If you want to facet by Brand or Price, each document should contain values for *BrandName* and *ProductPrice* that are valid, consistent, and productive as a filter option.

A few reminders of what to scrub for are listed below:

- For every field that you want to facet by, ask yourself whether it contains values that are suitable as filters in self-directed search. The values should be short, descriptive, and sufficiently distinctive to offer a clear choice between competing options.
- Misspellings or nearly matching values. If you facet on Color, and field values include Orange and Ornage (a misspelling), a facet based on the Color field would pick up both.
- Mixed case text can also wreak havoc in faceted navigation, with orange and Orange appearing as two different values. 
- Single and plural versions of the same value can result in a separate facet for each.

As you can imagine, diligence in preparing the data is an essential aspect of effective faceted navigation.

<a name="buildquery"></a>
##Build the query

The code that you write for building queries should specify all parts of a valid query, including search expressions, facets, filters, scoring profiles– anything used to formulate a request. In this section, we’ll explore where facets fit into a query, and how filters are used with facets to deliver a reduced result set.

An example is often a good place to begin. The following example, taken from the **CatalogSearch.cs** file, builds a request that creates facet navigation based on Color, Category, and Price. 

Notice that facets are integral in this sample application. The search experience in AdventureWorks Catalog is designed around faceted navigation and filters. This is evident in the prominent placement of faceted navigation in the page. The sample application includes URI parameters for facets (color, category, prices) as properties on the Search method (as constructed in the sample application).

  ![][4]
 
A facet query parameter is set to a field and depending on the data type, can be further parameterized by comma-delimited list that includes `count:<integer>`, `sort:<>`, `intervals:<integer>`, and  `values:<list>`. A values list is supported for numeric data when setting up ranges. See [Search Documents (Azure Search API)](http://msdn.microsoft.com/library/azure/dn798927.aspx) for usage details.

Along with facets, the request formulated by your application should also build filters to narrow down the set of candidate documents based on a facet value selection. For a bike store, faceted navigation provides clues to questions like "What colors, manufacturers, and types of bikes are available", while filtering answers questions like "Which exact bikes are red, mountain bikes, in this price range".

When a user clicks "Red" to indicate that only Red products should be shown, the next query the application sends would include `$filter=Color eq ‘Red’`.

## Best practices for faceted navigation

The following list summarizes a few best practices.

- **Precision**<br/>
Use filters. If you rely on just search expressions alone, stemming could cause a document to be returned that doesn’t have the precise facet value in any of its fields. 

- **Target fields**<br/>
In faceted drill down, you typically want to only include documents that have the facet value in a specific (faceted) field, not anywhere across all searchable fields. Adding a filter reinforces the target field by directing the service to search only in the faceted field for a matching value.

- **Index efficiency**<br/>
If your application uses faceted navigation exclusively (that is, no search box), you can mark the field as `searchable=false`, `facetable=true` to produce a more compact index. In addition, indexing occurs only on whole facet values, with no word-break or indexing of the component parts of a multi-word value.

- **Performance**<br/>
Filters narrow down the set of candidate documents for search and exclude them from ranking. If you have a large set of documents, using a very selective facet drill down will often give you significantly better performance.


<a name="tips"></a> 
##Tips on how to control faceted navigation

Below is a tip sheet with guidance on specific issues.

**Add labels for each field in facet navigation**

Labels are typically defined in the HTML or form (**index.cshtml** in the sample application). There is no API in Azure Search for facet navigation labels or any other kind of metadata.

**Define which fields can be used as facet**

Recall that the schema of the index determines which fields are available to use as a facet. Assuming a field is facetable, the query specifies which fields to facet by. The field by which you are faceting provides the values that appear below the label. 

The values that appear under each label are retrieved from the index. For example, if the facet field is *Color*, the values available for additional filtering will be the values for that field (Red, Black, and so forth).

For Numeric and DateTime values only, you can explicitly set values on the facet field (for example, 
`facet=Rating,values:1|2|3|4|5`). A values list is allowed for these field types to simplify the separation of facet results into contiguous ranges (either ranges based on numeric values or time periods). 

**Trim facet results**

Facet results are documents found in the search results that match a facet term. In the following example, in search results for *cloud computing*, 254 items also have *internal specification* as a content type. Items are not necessarily mutually exclusive. If an item meets the criteria of both filters, it is counted in each one. This is possible when faceting on `Collection(Edm.String)` fields, which are often used to implement document tagging.

		Search term: "cloud computing"
		Content type
		   Internal specification (254)
		   Video (10) 

In general, if you find that facet results are persistently too large, we recommend that you add more filters, as explained in earlier sections, to give your application users more options for narrowing the search.

**Limit items in the facet navigation**

For each faceted field in the navigation tree, there is a default limit of 10 values. This default makes sense for navigation structures because it keeps the values list to a manageable size. You can override the default by assigning a value to count.

- `&facet=city,count:5` specifies that only the first 5 cities found in the top ranked results are returned as a facet result. Given a search term of “airport” and 32 matches, if the query specifies `&facet=city,count:5`, only the first five unique cities with the most documents in the search results are included in the facet results.

Notice the distinction between facet results and search results. Search results are all the documents that match the query. Facet results are the matches for each facet value. In the example, search results will include City names that are not in the facet classification list (5 in our example). Results that are filtered out through faceted navigation become visible to the user when he or she clears facets, or chooses other facets besides City. 

> [AZURE.NOTE] Discussing `count` when there is more than one type can be confusing. The following table offers a brief summary of how the term is used in Azure Search API, sample code, and documentation. 

- `@colorFacet.count`<br/>
In presentation code, you should see a count parameter on the facet, used to display the number of facet results. In facet results, count indicates the number of documents that match on the facet term or range.

- `&facet=City,count:12`<br/>
In a facet query, you can set count to a value.  The default is 10, but you can set it higher or lower. Setting `count:12` gets the top 12 matches in facet results by document count.

- "`@odata.count`"<br/>
In the query response, this value indicates the number of matching items in the search results. On average, it’s larger than the sum of all facet results combined, due to the presence of items that match the search term, but have no facet value matches.


**Levels in faceted navigation** 

As noted, there is no direct support for nesting facets in a hierarchy. Out of the box, faceted navigation only supports one level of filters. However, workarounds do exist. You can encode a hierarchical facet structure in a `Collection(Edm.String)` with one entry point per hierarchy. Implementing this workaround is beyond the scope of this article, but you can read about collections in [OData by Example](http://msdn.microsoft.com/library/ff478141.aspx). 

**Validate fields**

If you build the list of facets dynamically based on untrusted user input, you should either validate that the names of the faceted fields are valid, or escape the names when building URLs using either `Uri.EscapeDataString()` in .NET, or the equivalent in your platform of choice.

**Counts in facet results**

When adding a filter to a faceted query, you might want to retain the facet statement (for example, `facet=Rating&$filter=Rating ge 4`). Technically, facet=Rating isn’t needed, but keeping it returns the counts of facet values for ratings 4 and higher. For example, if a user clicks "4" and the query includes a filter for greater or equal to "4", counts are returned for each rating that is 4 and up.  

**Sharding implications on facet counts**

Under certain circumstances, you might find that facet counts do not match the result sets (see [Faceted navigation in Azure Search (forum post)](https://social.msdn.microsoft.com/Forums/azure/06461173-ea26-4e6a-9545-fbbd7ee61c8f/faceting-on-azure-search?forum=azuresearch)).

Facet counts can be inaccurate due to the sharding architecture. Every search index has multiple shards, and each one reports the top N facets by document count, which is then combined into a single result. If some shards have a lot of matching values, while others have less, you may find that some facet values are missing or under-counted in the results.

Although this behavior could change at any time, if you encounter this behavior today, you can work around it by artificially inflating the count:<number> to a very large number to enforce full reporting from each shard. If the value of count: is greater than or equal to the number of unique values in the field, you are guaranteed accurate results. However, when document counts are really high, there is a performance penalty, so used this option judiciously.

<a name="rangefacets"></a>
##Facet navigation based on a range values

Faceting over ranges is a common search application requirement. Ranges are supported for numeric data and DateTime values. You can read more about each approach in [Search Documents (Azure Search API)](http://msdn.microsoft.com/library/azure/dn798927.aspx).

Azure Search simplifies range construction by providing two approaches for computing a range. For both approaches, Azure Search creates the appropriate ranges given the inputs you’ve provided. For instance, if you specify range values of 10|20|30, it will automatically create ranges of 0 -10, 10-20, 20-30. The sample application removes any intervals that are empty. 

**Approach 1: Use the interval parameter**<br/>
To set price facets in $10 increments, you would specify: `&facet=price,interval:10`


**Approach 2: Use a values list**<br/>
For numeric data, you can use a values list.  Consider the facet range for listPrice, rendered as follows:

  ![][5]

The range is specified in the **CatalogSearch.cs** file using a values list:

    facet=listPrice,values:10|25|100|500|1000|2500

Each range is built using 0 as a starting point, a value from the list as an endpoint, and then trimmed of the previous range to create discrete intervals. Azure Search will do this as part of faceted navigation. You do not have to write code for structuring each interval.

### Build a filter for facet ranges ###

To filter documents based on a range selected by the user, you can the `"ge"` and `"lt"` filter operators in a two-part expression that defines the endpoints of the range. For example, if the user chooses the range 10-25, the filter would be `$filter=listPrice ge 10 and listPrice lt 25`.

In the sample application, the filter expression uses **priceFrom** and **priceTo** parameters to set the endpoints. The **BuildFilter** method in **CatalogSearch.cs** contains the filter expression that gives you the documents within a range.

  ![][6]

<a name="geofacets"></a> 
##Filtered navigation based on GeoPoints

It’s common to see filters that help you choose a store, restaurant, or destination based on its proximity to your current location. While this type of filter might look like faceted navigation, it’s actually just a filter. We mention it here for those of you who are specifically looking for implementation advice for that particular design problem.

There are two Geospatial functions in Azure Search, **geo.distance** and **geo.intersects**.

- The **geo.distance** function returns the distance in kilometers between two points, one being a field and one being a constant passed as part of the filter. 

- The **geo.intersects** function returns true if a given point is within a given polygon, where the point is a field and the polygon is specified as a constant list of coordinates passed as part of the filter.

You can find filter examples in [OData expression syntax (Azure Search)](http://msdn.microsoft.com/library/azure/dn798921.aspx).

<a name="tryitout"></a>
##Try it out

Azure Search Adventure Works Demo on Codeplex contains the examples referenced in this article. As you work with search results, watch the URL for changes in query construction. This application happens to append facets to the URI as you select each one.

1.	Configure the sample application to use your service URL and api-key. 

	Notice the schema that is defined in the Program.cs file of the CatalogIndexer project. It specifies facetable fields for color, listPrice, size, weight, categoryName, and modelName.  Only a few of these (color, listPrice, categoryName) are actually implemented in faceted navigation.

3.	Run the application. 

	At first, just the Search box is visible. You can click the Search button right away to get all results, or type a search term.

	![][7]
 
4.	Enter a search term, such as bike, and click **Search**. The query executes quickly.
 
	A faceted navigation structure is also returned with the search results.  In the URL, facets for Colors, Categories, and Prices are null. In the search result page, the faceted navigation structure includes counts for each facet result.

	 ![][8]
 
5.	Click a color, category, and price range. Facets are null on an initial search, but as they take on values, the search results are trimmed of items that no longer match. Notice that the URI picks up the changes to your query.

	![][9]
 
6.	To clear the faceted query so that you can try different query behaviors, click **AdventureWorks Catalog** at the top of the page.

	![][10]
 
<a name="nextstep"></a>
##Next Step

To test your knowledge, you can add a facet field for *modelName*. The index is already set up for this facet, so no changes to the index are required. But you will need to modify the HTML to include a new facet for Models, and add the facet field to the query constructor.

For more insights on design principles for faceted navigation, we recommend the following links:

- [Designing for Faceted Search](http://www.uie.com/articles/faceted_search/)
- [Design Patterns: Faceted Navigation](http://alistapart.com/article/design-patterns-faceted-navigation)

You can also watch [Azure Search Deep Dive](http://channel9.msdn.com/Events/TechEd/Europe/2014/DBI-B410). At 45:25, there is a demo on how to implement facets.

<!--Anchors-->
[How to build it]: #howtobuildit
[Build the presentation layer]: #presentationlayer
[Build the index]: #buildindex
[Check for data quality]: #checkdata
[Build the query]: #buildquery
[Tips on how to control faceted navigation]: #tips
[Faceted navigation based on range values]: #rangefacets
[Faceted navigation based on GeoPoints]: #geofacets
[Try it out]: #tryitout

<!--Image references-->
[1]: ./media/search-faceted-navigation/Facet-1-slide.PNG
[2]: ./media/search-faceted-navigation/Facet-2-CSHTML.PNG
[3]: ./media/search-faceted-navigation/Facet-3-schema.PNG
[4]: ./media/search-faceted-navigation/Facet-4-SearchMethod.PNG
[5]: ./media/search-faceted-navigation/Facet-5-Prices.PNG
[6]: ./media/search-faceted-navigation/Facet-6-buildfilter.PNG
[7]: ./media/search-faceted-navigation/Facet-7-appstart.png
[8]: ./media/search-faceted-navigation/Facet-8-appbike.png
[9]: ./media/search-faceted-navigation/Facet-9-appbikefaceted.png
[10]: ./media/search-faceted-navigation/Facet-10-appTitle.png

<!--Link references-->
[Designing for Faceted Search]: http://www.uie.com/articles/faceted_search/
[Design Patterns: Faceted Navigation]: http://alistapart.com/article/design-patterns-faceted-navigation
[Create your first application]: search-create-first-solution.md
[OData expression syntax (Azure Search)]: http://msdn.microsoft.com/library/azure/dn798921.aspx
[Azure Search Adventure Works Demo]: https://azuresearchadventureworksdemo.codeplex.com/
[http://www.odata.org/documentation/odata-version-2-0/overview/]: http://www.odata.org/documentation/odata-version-2-0/overview/ 
[Faceting on Azure Search forum post]: ../faceting-on-azure-search.md?forum=azuresearch
[Search Documents (Azure Search API)]: http://msdn.microsoft.com/library/azure/dn798927.aspx

 