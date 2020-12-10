---
title: Query types 
titleSuffix: Azure Cognitive Search
description: Learn about the types of queries supported in Cognitive Search, including free text, filter, autocomplete and suggestions, geo-search, system queries, and document lookup.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 12/09/2020
---
# Query types in Azure Cognitive Search

In Azure Cognitive Search, a query is a full specification of a round-trip operation, with parameters that govern query execution, and parameters that shape the response coming back.

## Elements of a request

The following example is a representative query constructed using [Search Documents REST API](/rest/api/searchservice/search-documents). This example targets the [hotels demo index](search-get-started-portal.md) and includes common parameters so that you can get an idea of what a query looks like.

```http
POST https://[service name].search.windows.net/indexes/[index name]/docs/search?api-version=[api-version]
{
    "queryType": "simple" 
    "search": "`New York` +restaurant",
    "searchFields": "Description, Address/City, Tags",
    "select": "HotelId, HotelName, Description, Rating, Address/City, Tags",
    "top": "10",
    "count": "true",
    "orderby": "Rating desc"
}
```

Queries are always directed at the documents collection of a single index. You cannot join indexes or create custom or temporary data structures as a query target.

+ **`queryType`** sets the parser, which is either the [default simple query parser](search-query-simple-examples.md) (optimal for full text search), or the [full Lucene query parser](search-query-lucene-examples.md) used for advanced query constructs like regular expressions, proximity search, fuzzy and wildcard search, to name a few.

+ **`search`** provides the match criteria, usually whole terms or phrases, but often accompanied by boolean operators. Single standalone terms are *term* queries. Quote-enclosed multi-part queries are *phrase* queries. Search can be undefined, as in **`search=*`**, but with no criteria to match on, the result set is composed of arbitrarily selected documents.

+ **`searchFields`** constrains query execution to specific fields. Any field that is attributed as *searchable* in the index schema is a candidate for this parameter.

Responses are also shaped by the parameters you include in the query:

+ **`select`** specifies which fields to return in the response. Only fields marked as *retrievable* in the index can be used in a select statement.

+ **`top`** returns the specified number of best-matching documents. In this example, only 10 hits are returned. You can use top and skip (not shown) to page the results.

+ **`count`** tells you how many documents in the entire index match overall, which can be more than what are returned. 

+ **`orderby`** is used if you want to sort results by a value, such as a rating or location. Otherwise, the default is to use the relevance score to rank results.

> [!Tip]
> Before writing any code, you can use query tools to learn the syntax and experiment with different parameters. The quickest approach is the built-in portal tool, [Search Explorer](search-explorer.md).
>
> If you followed this [quickstart to create the hotels demo index](search-get-started-portal.md), you can paste this query string into the explorer's search bar to run your first query: `search=+"New York" +restaurant&searchFields=Description, Address/City, Tags&$select=HotelId, HotelName, Description, Rating, Address/City, Tags&$top=10&$orderby=Rating desc&$count=true`

### How field attributes in an index determine query behaviors

Index design and query design are tightly coupled in Azure Cognitive Search. An essential fact to know up front is that the *index schema*, with attributes on each field, determines the kind of query you can build. 

Index attributes on a field set the allowed operations - whether a field is *searchable* in the index, *retrievable* in results, *sortable*, *filterable*, and so forth. In the example query string, `"$orderby": "Rating"` only works because the Rating field is marked as *sortable* in the index schema. 

![Index definition for the hotel sample](./media/search-query-overview/hotel-sample-index-definition.png "Index definition for the hotel sample")

The above screenshot is a partial list of index attributes for the hotels sample. You can view the entire index schema in the portal. For more information about index attributes, see [Create Index REST API](/rest/api/searchservice/create-index).

> [!Note]
> Some query functionality is enabled index-wide rather than on a per-field basis. These capabilities include: [synonym maps](search-synonyms.md), [custom analyzers](index-add-custom-analyzers.md), [suggester constructs (for autocomplete and suggested queries)](index-add-suggesters.md), [scoring logic for ranking results](index-add-scoring-profiles.md).

## Choose a parser: simple | full

Azure Cognitive Search gives you a choice between two query parsers for handling typical and specialized queries. Requests using the simple parser are formulated using the [simple query syntax](query-simple-syntax.md), selected as the default for its speed and effectiveness in free form text queries. This syntax supports a number of common search operators including the AND, OR, NOT, phrase, suffix, and precedence operators.

The [full Lucene query syntax](query-Lucene-syntax.md#bkmk_syntax), enabled when you add `queryType=full` to the request, exposes the widely adopted and expressive query language developed as part of [Apache Lucene](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html). Full syntax extends the simple syntax. Any query you write for the simple syntax runs under the full Lucene parser. 

The following examples illustrate the point: same query, but with different queryType settings, yield different results. In the first query, the `^3` after `historic` is treated as part of the search term. The top-ranked result for this query is "Marquis Plaza & Suites", which has *ocean* in its description.

```http
queryType=simple&search=ocean historic^3&searchFields=Description, Tags&$select=HotelId, HotelName, Tags, Description&$count=true
```

The same query using the full Lucene parser interprets `^3` as an in-field term booster. Switching parsers changes the rank, with results containing the term *historic* moving to the top.

```http
queryType=full&search=ocean historic^3&searchFields=Description, Tags&$select=HotelId, HotelName, Tags, Description&$count=true
```

<a name="types-of-queries"></a>

## Types of queries

Azure Cognitive Search supports a broad range of query types. 

| Query type | Usage | Examples and more information |
|------------|--------|-------------------------------|
| Free form text search | Search parameter and either parser| Full text search scans for one or more terms in all *searchable* fields in your index, and works the way you would expect a search engine like Google or Bing to work. The example in the introduction is full text search.<br/><br/>Full text search undergoes lexical analysis using the standard Lucene analyzer (by default) to lower-case all terms, remove stop words like "the". You can override the default with [non-English analyzers](index-add-language-analyzers.md#language-analyzer-list) or [specialized language-agnostic analyzers](index-add-custom-analyzers.md#AnalyzerTable) that modify lexical analysis. An example is [keyword](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/core/KeywordAnalyzer.html) that treats the entire contents of a field as a single token. This is useful for data like zip codes, IDs, and some product names. | 
| Filtered search | [OData filter expression](query-odata-filter-orderby-syntax.md) and either parser | Filter queries evaluate a boolean expression over all *filterable* fields in an index. Unlike search, a filter query matches the exact contents of a field, including case-sensitivity on string fields. Another difference is that filter queries are expressed in OData syntax. <br/>[Filter expression example](search-query-simple-examples.md#example-3-filter-queries) |
| Geo-search | [Edm.GeographyPoint type](/rest/api/searchservice/supported-data-types) on the field, filter expression, and either parser | Coordinates stored in a field having an Edm.GeographyPoint are used for "find near me" or map-based search controls. <br/>[Geo-search example](search-query-simple-examples.md#example-5-geo-search)|
| Range search | filter expression and simple parser | In Azure Cognitive Search, range queries are built using the filter parameter. <br/>[Range filter example](search-query-simple-examples.md#example-4-range-filters) | 
| [Fielded search](query-lucene-syntax.md#bkmk_fields) | Search parameter and Full parser | Build a composite query expression targeting a single field. <br/>[Fielded search example](search-query-lucene-examples.md#example-2-fielded-search) |
| [Autocomplete or suggested results](search-autocomplete-tutorial.md) | Autocomplete or Suggestion parameter | An alternative query form that executes based on partial strings in a search-as-you-type experience. You can use autocomplete and suggestions together or separately. |
| [fuzzy search](query-lucene-syntax.md#bkmk_fuzzy) | Search parameter and Full parser | Matches on terms having a similar construction or spelling. <br/>[Fuzzy search example](search-query-lucene-examples.md#example-3-fuzzy-search) |
| [proximity search](query-lucene-syntax.md#bkmk_proximity) | Search parameter and Full parser | Finds terms that are near each other in a document. <br/>[Proximity search example](search-query-lucene-examples.md#example-4-proximity-search) |
| [term boosting](query-lucene-syntax.md#bkmk_termboost) | Search parameter and Full parser | Ranks a document higher if it contains the boosted term, relative to others that don't. <br/>[Term boosting example](search-query-lucene-examples.md#example-5-term-boosting) |
| [regular expression search](query-lucene-syntax.md#bkmk_regex) | Search parameter and Full parser | Matches based on the contents of a regular expression. <br/>[Regular expression example](search-query-lucene-examples.md#example-6-regex) |
|  [wildcard or prefix search](query-lucene-syntax.md#bkmk_wildcard) | Search parameter and Full parser | Matches based on a prefix and tilde (`~`) or single character (`?`). <br/>[Wildcard search example](search-query-lucene-examples.md#example-7-wildcard-search) |

## Next steps

Use the portal, or another tool such as Postman or Visual Studio Code, or one of the SDKs to explore queries in more depth. The following links will get you started.

+ [Search explorer](search-explorer.md)
+ [How to query in .NET](./search-get-started-dotnet.md)
+ [How to query in REST](./search-get-started-powershell.md)