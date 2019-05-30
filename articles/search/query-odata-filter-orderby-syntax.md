---
title: OData language overview - Azure Search
description: OData language overview for filters, select, and order-by for Azure Search queries.
ms.date: 05/30/2019
services: search
ms.service: search
ms.topic: conceptual
author: "Brjohnstmsft"
ms.author: "brjohnst"
ms.manager: cgronlun
translation.priority.mt:
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---
# OData language overview for `$filter`, `$orderby`, and `$select` in Azure Search

Azure Search supports a subset of the OData expression syntax for **$filter**, **$orderby**, and **$select** expressions. Filter expressions are evaluated during query parsing, constraining search to specific fields or adding match criteria used during index scans. Order-by expressions are applied as a post-processing step over a result set to sort the documents that are returned. Select expressions determine which document fields are included in the result set. Filter, order-by, and select expressions are included in a query request, adhering to an OData syntax that is distinct from the [simple](query-simple-syntax.md) or [full](query-lucene-syntax.md) query syntax used in the **search** parameter (although there is some overlap in how fields are referenced).

This article provides an overview of the OData expression language used in filters, order-by, and select expressions. The language is presented "bottom-up", starting with the most basic elements and building on them. If you want to skip right to the reference for each parameter, see:

- [Filter syntax](#filter-syntax)
- [Order-by syntax](#orderby-syntax)

## Syntax overview and common elements

OData expressions range from very simple to highly complex, but they all share common elements. The most basic parts of an OData expression in Azure Search are:

- **Field paths**, which refer to specific fields of your index.
- Constants, which are literal values of a certain data type.

> [!NOTE]
> Terminology in Azure Search differs from the [OData standard](https://www.odata.org/documentation/) in a few ways. What we call a **field** in Azure Search is called a **property** in OData, and similarly for **field path** versus **property path**. An **index** containing **documents** in Azure Search is referred to more generally in OData as an **entity set** containing **entities**. The Azure Search terminology is used throughout this reference.

### Field paths

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar of field paths.

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
field_path ::= identifier('/'identifier)*

identifier ::= [a-zA-Z_][a-zA-Z_0-9]*
```

Click here to view an interactive syntax diagram:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#field_path)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

A field path is composed of one or more identifiers, each of which is a sequence of characters that must start with an ASCII letter or underscore, and contain only ASCII letters, digits, or underscores. The letters can be upper- or lower-case.

Examples of field paths are shown in the following table:

| Field path | Description |
| --- | --- |
| `HotelName` | Refers to a top-level field of the index |
| `Address/City` | Refers to the `City` sub-field of a complex field in the index; `Address` is of type `Edm.ComplexType` in this example |
| `Rooms/Type` | Refers to the `Type` sub-field of a complex collection field in the index; `Rooms` is of type `Collection(Edm.ComplexType)` in this example |
| `Stores/Address/Country` | Refers to the `Country` sub-field of the `Address` sub-field of a complex collection field in the index; `Stores` is of type `Collection(Edm.ComplexType)` and `Address` is of type `Edm.ComplexType` in this example |

Notice how in the case of sub-fields, there is no way to tell from the field path whether an ancestor field is a complex collection or just a single complex object. For example, `Address/City` and `Rooms/Type` have the same structure, despite the fact that `Rooms` refers to a collection but `Address` does not.

In many contexts, this difference does not matter, but in filters, `Address/City` is allowed but `Rooms/Type` is not. This is because in filters, a field path refers to a value in the current document, but in other contexts such as **$orderby**, **$select**, or in [fielded search in a full Lucene query](query-lucene-syntax.md#bkmk_fields), it refers to the field itself. Since `Rooms` is a collection of objects, `Rooms/Type` can't refer to a single value because there is no indication what the "current" object of the collection is.

We get around this in filters using [the collection expressions `any` and `all`](search-query-odata-collection-operators.md), which are like loops that iterate over the collection. Much like a **for** loop in a programming language, collection expressions have a loop variable called the **range variable** that takes the current element of the collection, plus a loop body called the **lambda expression** that refers to the range variable.

The following table shows examples of field paths in a lambda expression of a filter:

| Field path | Description |
| --- | --- |
| `room/Type` | Refers to the `Type` sub-field of the `room` range variable |
| `store/Address/Country` | Refers to the `Country` sub-field of the `Address` sub-field of the `store` range variable |

For examples of full lambda expressions, see [OData collection operators in Azure Search](search-query-odata-collection-operators.md).

### Using field paths

Field paths are used in many parameters of the [Azure Search API](https://docs.microsoft.com/rest/api/searchservice/). The following table lists all the places where they can be used, as well as any restrictions on their usage:

| API | Parameter name | Restrictions |
| --- | --- | --- |
| [Create](https://docs.microsoft.com/rest/api/searchservice/create-index) or [Update](https://docs.microsoft.com/rest/api/searchservice/update-index) Index | `suggesters/sourceFields` | None |
| [Create](https://docs.microsoft.com/rest/api/searchservice/create-index) or [Update](https://docs.microsoft.com/rest/api/searchservice/update-index) Index | `scoringProfiles/text/weights` | Can only refer to **searchable** fields |
| [Create](https://docs.microsoft.com/rest/api/searchservice/create-index) or [Update](https://docs.microsoft.com/rest/api/searchservice/update-index) Index | `scoringProfiles/functions/fieldName` | Can only refer to **filterable** fields |
| [Search](https://docs.microsoft.com/rest/api/searchservice/search-documents) | `search` when `queryType` is `full` | Can only refer to **searchable** fields |
| [Search](https://docs.microsoft.com/rest/api/searchservice/search-documents) | `facet` | Can only refer to **facetable** fields |
| [Search](https://docs.microsoft.com/rest/api/searchservice/search-documents) | `highlight` | Can only refer to **searchable** fields |
| [Search](https://docs.microsoft.com/rest/api/searchservice/search-documents) | `searchFields` | Can only refer to **searchable** fields |
| [Suggest](https://docs.microsoft.com/rest/api/searchservice/suggestions) and [Autocomplete](https://docs.microsoft.com/rest/api/searchservice/autocomplete) | `searchFields` | Can only refer to fields that are part of a [suggester](index-add-suggesters.md) |
| [Search](https://docs.microsoft.com/rest/api/searchservice/search-documents), [Suggest](https://docs.microsoft.com/rest/api/searchservice/suggestions), and [Autocomplete](https://docs.microsoft.com/rest/api/searchservice/autocomplete) | `$filter` | Can only refer to **filterable** fields |
| [Search](https://docs.microsoft.com/rest/api/searchservice/search-documents) and [Suggest](https://docs.microsoft.com/rest/api/searchservice/suggestions) | `$orderby` | Can only refer to **sortable** fields |
| [Search](https://docs.microsoft.com/rest/api/searchservice/search-documents), [Suggest](https://docs.microsoft.com/rest/api/searchservice/suggestions), and [Lookup](https://docs.microsoft.com/rest/api/searchservice/lookup-document) | `$select` | Can only refer to **retrievable** fields |

### Constants

Constants in OData are literal values of a given [Entity Data Model](https://docs.microsoft.com/dotnet/framework/data/adonet/entity-data-model) (EDM) type. See [Supported data types](https://docs.microsoft.com/rest/api/searchservice/supported-data-types) for a list of supported types in Azure Search. Constants of collection types are not supported.

The following table shows examples of constants for each of the data types supported by Azure Search:

| Data type | Example constants |
| --- | --- |
| `Edm.Boolean` | `true`, `false` |
| `Edm.DateTimeOffset` | `2019-05-06T12:30:05.451Z` |
| `Edm.Double` | `3.14159`, `-1.2e7`, `NaN`, `INF`, `-INF` |
| `Edm.GeographyPoint` | `geography'POINT(-122.131577 47.678581)'` |
| `Edm.GeographyPolygon` | `geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'` |
| `Edm.Int32` | `123`, `-456` |
| `Edm.Int64` | `283032927235` |
| `Edm.String` | `'hello'` |

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar for most of the constants shown in the above table. The grammar for geo-spatial types can be found in [OData geo-spatial functions in Azure Search](search-query-odata-geo-spatial-functions.md).

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
constant ::=
    string_literal
    | date_time_offset_literal
    | integer_literal
    | float_literal
    | boolean_literal
    | 'null'

string_literal ::= "'"([^'] | "''")*"'"

date_time_offset_literal ::= date_part'T'time_part time_zone

date_part ::= year'-'month'-'day

time_part ::= hour':'minute(':'second('.'fractional_seconds)?)?

zero_to_fifty_nine ::= [0-5]digit

digit ::= [0-9]

year ::= digit digit digit digit

month ::= '0'[1-9] | '1'[0-2]

day ::= '0'[1-9] | [1-2]digit | '3'[0-1]

hour ::= [0-1]digit | '2'[0-3]

minute ::= zero_to_fifty_nine

second ::= zero_to_fifty_nine

fractional_seconds ::= integer_literal

time_zone ::= 'Z' | sign hour':'minute

sign ::= '+' | '-'

/* In practice integer literals are limited in length to the precision of
the corresponding EDM data type. */
integer_literal ::= digit+

float_literal ::=
    sign? whole_part fractional_part? exponent?
    | 'NaN'
    | '-INF'
    | 'INF'

whole_part ::= integer_literal

fractional_part ::= '.'integer_literal

exponent ::= 'e' sign? integer_literal

boolean_literal ::= 'true' | 'false'
```

Click here to view an interactive syntax diagram:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#constant)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

### Building expressions from field paths and constants

Field paths and constants are the most basic part of an OData expression, but they are actually already full expressions themselves. In fact, the **$select** parameter in Azure Search is nothing but a comma-separated list of field paths, and **$orderby** is not much more complicated than that. If you happen to have a field of type `Edm.Boolean` in your index, you can even write a filter that is nothing but the path of that field. The constants `true` and `false` are likewise valid filters.

That said, most of the time you'll want to build more complex expressions that refer to more than one field and/or constant.

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar for the **$filter**, **$orderby**, and **$select** parameters, which are built up from simpler expressions involving field paths and constants:

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
filter_expression ::= boolean_expression

order_by_expression ::= order_by_clause(',' order_by_clause)*

select_expression ::= '*' | field_path(',' field_path)*
```

Click here to view an interactive syntax diagram:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#filter_expression)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

As you can see from the grammar above, the syntax of the **$select** parameter is very simple, but there is more going on with the **$filter** and **$orderby** parameters. The syntax for the latter two is explored in more detail in the rest of this article.

## Filter syntax

> [!NOTE]
> This section describes the structure of filters in detail. If you want to know what filters are and how to use them to realize specific query scenarios, see [Filters in Azure Search](search-filters.md).

A filter in the OData language is a Boolean expression, which in turn can be one of several types of expression, as shown by the following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)):

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
boolean_expression ::=
    collection_filter_expression
    | logical_expression
    | comparison_expression
    | boolean_literal
    | boolean_function_call
    | '(' boolean_expression ')'
    | variable

/* This can be a range variable in the case of a lambda, or a field path. */
variable ::= identifier | field_path
```

Click here to view an interactive syntax diagram:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#boolean_expression)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

The types of Boolean expressions include:

- Collection filter expressions using `any` or `all`. These apply filter criteria to collection fields. See [OData collection operators in Azure Search](search-query-odata-collection-operators.md) for more details.
- Logical expressions that combine other Boolean expressions using the operators `and`, `or`, and `not`. See [OData logical operators in Azure Search](search-query-odata-logical-operators.md) for more details.
- Comparison expressions, which compare fields (or range variables in the case of collections) to constant values using the operators `eq`, `ne`, `gt`, `lt`, `ge`, and `le`. See [OData comparison operators in Azure Search](search-query-odata-comparison-operators.md) for more details. Comparison expressions are also used to compare distances between geo-spatial co-ordinates using the `geo.distance` function. See [OData geo-spatial functions in Azure Search](search-query-odata-geo-spatial-functions.md) for more details.
- The Boolean literals `true` and `false`. These can be useful sometimes when programmatically generating filters, but otherwise don't tend to be used in practice.
- Calls to Boolean functions, including:
  - `geo.intersects`, which tests whether a given point is within a given polygon. See [OData geo-spatial functions in Azure Search](search-query-odata-geo-spatial-functions.md) for more details.
  - `search.in`, which compares a field or range variable with each value in a list of values. See [OData `search.in` function in Azure Search](search-query-odata-search-in-function.md) for more details.
  - `search.ismatch` and `search.ismatchscoring`, which perform full-text search operations in a filter context. See [OData full-text search functions in Azure Search](search-query-odata-full-text-search-functions.md) for more details.
- Boolean expressions in parentheses. Using parentheses can help to explicitly determine the order of operations in a filter. See [Operator precedence in filters](#operator-precedence-in-filters) for more details on the default precedence of the OData operators.
- Field paths or range variables of type `Edm.Boolean`. For example, if your index has a Boolean field called `IsEnabled` and you want to return all documents where this field is `true`, your filter expression can simply be the name `IsEnabled`.

### Operator precedence in filters

If you write a filter expression with no parentheses around its sub-expressions, it will be evaluated according to the default operator precedence rules of the OData language. The following table lists groups of operators in order from highest to lowest precedence:

| Group | Operator(s) |
| --- | --- |
| Logical operators | `not` |
| Comparison operators | `eq`, `ne`, `gt`, `lt`, `ge`, `le` |
| Logical operators | `and` |
| Logical operators | `or` |

An operator that is higher in the above table will "bind more tightly" to its operands than other operators. For example, `and` is of higher precedence than `or`, and comparison operators are of higher precedence than either of them, so the following two expressions are equivalent:

    Rating gt 0 and Rating lt 3 or Rating gt 7 and Rating lt 10
    ((Rating gt 0) and (Rating lt 3)) or ((Rating gt 7) and (Rating lt 10))

The `not` operator has the highest precedence of all -- even higher than the comparison operators. That's why if you try to write a filter like this:

    not Rating gt 5

You'll get an error similar to the following:

    Invalid expression: A unary operator with an incompatible type was detected. Found operand type 'Edm.Int32' for operator kind 'Not'.

This is because the operator is associated with just the `Rating` field, which is of type `Edm.Int32`, and not with the entire comparison expression. To fix this, put the operand of `not` in parentheses:

    not (Rating gt 5)

<a name="bkmk_limits"></a>

## Filter size limitations

There are limits to the size and complexity of filter expressions that you can send to Azure Search. The limits are based roughly on the number of clauses in your filter expression. A good rule of thumb is that if you have hundreds of clauses, you are at risk of running into the limit. We recommend designing your application in such a way that it does not generate filters of unbounded size. Using [the `search.in` function](search-query-odata-search-in-function.md) instead of long disjunctions of equality comparisons can help with this.

## Filter examples  

Find all hotels with at least one room with a base rate less than $200 that are rated at or above 4:

    Rooms/any(room: room/BaseRate lt 200.0) and Rating ge 4

Find all hotels other than "Seaview Motel" that have been renovated since 2010:

    HotelName ne 'Seaview Motel' and LastRenovationDate ge 2010-01-01T00:00:00Z

Find all hotels that have been renovated since 2010, with a datetime literal that includes time zone information for Pacific Standard Time:  

    LastRenovationDate ge 2010-01-01T00:00:00-08:00

Find all hotels that have parking included and do not allow smoking in any rooms:

    ParkingIncluded and Rooms/all(room: not room/SmokingAllowed)

 \- OR -  

    ParkingIncluded eq true and Rooms/all(room: room/SmokingAllowed eq false)

Find all hotels that are Luxury or include parking and have a rating of 5:  

    (Category eq 'Luxury' or ParkingIncluded eq true) and Rating eq 5

Find all hotels with the tag "wifi" in at least one room (where each room has tags stored in a `Collection(Edm.String)` field):  

    Rooms/any(room: room/Tags/any(tag: tag eq 'wifi'))

Find all hotels with any rooms:  

    Rooms/any()

Find all hotels that don't have rooms:

    not Rooms/any()

Find all hotels within 10 kilometers of a given reference point (where `Location` is a field of type `Edm.GeographyPoint`):

    geo.distance(Location, geography'POINT(-122.131577 47.678581)') le 10

Find all hotels within a given viewport described as a polygon (where `Location` is a field of type Edm.GeographyPoint). Note that the polygon is closed (the first and last point sets must be the same) and [the points must be listed in counterclockwise order](https://docs.microsoft.com/rest/api/searchservice/supported-data-types#Anchor_1).

    geo.intersects(Location, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))')

Find all hotels that either have no value in "Description" field, or that value is explicitly set to null:  

    Description eq null

Find all hotels with name equal to either 'Seaview motel' or 'Budget hotel'). Phrases contain spaces, which is a default delimiter. You can specify an alternative delimiter in single quotes as the third string parameter:  

    search.in(HotelName, 'Seaview motel,Budget hotel', ',')

Find all hotels with name equal to either 'Seaview motel' or 'Budget hotel' separated by '|'):  

    search.in(HotelName, 'Seaview motel|Budget hotel', '|')

Find all hotels where all rooms have the tag 'wifi' or 'tub':

    Rooms/any(room: room/Tags/any(tag: search.in(tag, 'wifi, tub'))

Find a match on phrases within a collection, such as 'heated towel racks' or 'hairdryer included' in tags.

    Rooms/any(room: room/Tags/any(tag: search.in(tag, 'heated towel racks,hairdryer included', ','))

Find documents with the word "waterfront". This filter query is identical to a [search request](https://docs.microsoft.com/rest/api/searchservice/search-documents) with `search=waterfront`.

    search.ismatchscoring('waterfront')

Find documents with the word "hostel" and rating greater or equal to 4, or documents with the word "motel" and rating equal to 5. Note, this request could not be expressed without the `search.ismatchscoring` function.

    search.ismatchscoring('hostel') and rating ge 4 or search.ismatchscoring('motel') and rating eq 5

Find documents without the word "luxury".

    not search.ismatch('luxury')

Find documents with the phrase "ocean view" or rating equal to 5. The `search.ismatchscoring` query will be executed only against fields `HotelName` and `Description`. Documents that matched only the second clause of the disjunction will be returned too -- hotels with `Rating` equal to 5. Those documents will be returned with score equal to zero to make it clear that they didn't match any of the scored parts of the expression.

    search.ismatchscoring('"ocean view"', 'Description,HotelName') or Rating eq 5

Find documents where the terms "hotel" and "airport" are within 5 words from each other in the description of the hotel, and where smoking is not allowed in any of the rooms. This query uses the [full Lucene query language](query-lucene-syntax.md).

    search.ismatch('"hotel airport"~5', 'Description', 'full', 'any') and not Rooms/any(room: room/SmokingAllowed)

## Order-by syntax

The **$orderby** parameter accepts a comma-separated list of up to 32 **order-by clauses**. The syntax of an order-by clause is described by the following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)):

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
order_by_clause ::= (field_path | sortable_function) ('asc' | 'desc')?

sortable_function ::= geo_distance_call | 'search.score()'
```

Click here to view an interactive syntax diagram:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#order_by_clause)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

Each clause has sort criteria, optionally followed by a sort direction (`asc` for ascending or `desc` for descending). If you don't specify a direction, the default is ascending. The sort criteria can either be the path of a `sortable` field or a call to either the [`geo.distance`](search-query-odata-geo-spatial-functions.md) or the [`search.score`](search-query-odata-search-score-function.md) functions.

If multiple documents have the same sort criteria and the `search.score` function is not used (for example, if you sort by a numeric `Rating` field and three documents all have a rating of 4), ties will be broken by document score in descending order. When document scores are the same (for example, when there is no full-text search query specified in the request), then the relative ordering of the tied documents is indeterminate.

You can specify multiple sort criteria. The order of expressions determines the final sort order. For example, to sort descending by score, followed by Rating, the syntax would be `$orderby=search.score() desc,Rating desc`.

The syntax for `geo.distance` in **$orderby** is the same as it is in **$filter**. When using `geo.distance` in **$orderby**, the field to which it applies must be of type `Edm.GeographyPoint` and it must also be `sortable`.

The syntax for `search.score` in **$orderby** is `search.score()`. The function `search.score` does not take any parameters.

## Order-by examples

Sort hotels ascending by base rate:

    BaseRate asc

Sort hotels descending by rating, then ascending by base rate (remember that ascending is the default):

    Rating desc,BaseRate

Sort hotels descending by rating, then ascending by distance from the given co-ordinates:

    Rating desc,geo.distance(Location, geography'POINT(-122.131577 47.678581)') asc

Sort hotels in descending order by search.score and rating, and then in ascending order by distance from the given coordinates so that
between two hotels with identical ratings, the closest one is listed first:

    search.score() desc,Rating desc,geo.distance(Location, geography'POINT(-122.131577 47.678581)') asc

## See also  

- [Faceted navigation in Azure Search](search-faceted-navigation.md)
- [Filters in Azure Search](search-filters.md)
- [Search Documents &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
- [Lucene query syntax](query-lucene-syntax.md)
- [Simple query syntax in Azure Search](query-simple-syntax.md)
