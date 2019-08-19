---
title: OData language overview - Azure Search
description: OData language overview for filters, select, and order-by for Azure Search queries.
ms.date: 06/13/2019
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

Azure Search supports a subset of the OData expression syntax for **$filter**, **$orderby**, and **$select** expressions. Filter expressions are evaluated during query parsing, constraining search to specific fields or adding match criteria used during index scans. Order-by expressions are applied as a post-processing step over a result set to sort the documents that are returned. Select expressions determine which document fields are included in the result set. The syntax of these expressions is distinct from the [simple](query-simple-syntax.md) or [full](query-lucene-syntax.md) query syntax that is used in the **search** parameter, although there's some overlap in the syntax for referencing fields.

This article provides an overview of the OData expression language used in filters, order-by, and select expressions. The language is presented "bottom-up", starting with the most basic elements and building on them. The top-level syntax for each parameter is described in a separate article:

- [$filter syntax](search-query-odata-filter.md)
- [$orderby syntax](search-query-odata-orderby.md)
- [$select syntax](search-query-odata-select.md)

OData expressions range from simple to highly complex, but they all share common elements. The most basic parts of an OData expression in Azure Search are:

- **Field paths**, which refer to specific fields of your index.
- **Constants**, which are literal values of a certain data type.

> [!NOTE]
> Terminology in Azure Search differs from the [OData standard](https://www.odata.org/documentation/) in a few ways. What we call a **field** in Azure Search is called a **property** in OData, and similarly for **field path** versus **property path**. An **index** containing **documents** in Azure Search is referred to more generally in OData as an **entity set** containing **entities**. The Azure Search terminology is used throughout this reference.

## Field paths

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar of field paths.

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
field_path ::= identifier('/'identifier)*

identifier ::= [a-zA-Z_][a-zA-Z_0-9]*
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#field_path)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

A field path is composed of one or more **identifiers** separated by slashes. Each identifier is a sequence of characters that must start with an ASCII letter or underscore, and contain only ASCII letters, digits, or underscores. The letters can be upper- or lower-case.

An identifier can refer either to the name of a field, or to a **range variable** in the context of a [collection expression](search-query-odata-collection-operators.md) (`any` or `all`) in a filter. A range variable is like a loop variable that represents the current element of the collection. For complex collections, that variable represents an object, which is why you can use field paths to refer to sub-fields of the variable. This is analogous to dot notation in many programming languages.

Examples of field paths are shown in the following table:

| Field path | Description |
| --- | --- |
| `HotelName` | Refers to a top-level field of the index |
| `Address/City` | Refers to the `City` sub-field of a complex field in the index; `Address` is of type `Edm.ComplexType` in this example |
| `Rooms/Type` | Refers to the `Type` sub-field of a complex collection field in the index; `Rooms` is of type `Collection(Edm.ComplexType)` in this example |
| `Stores/Address/Country` | Refers to the `Country` sub-field of the `Address` sub-field of a complex collection field in the index; `Stores` is of type `Collection(Edm.ComplexType)` and `Address` is of type `Edm.ComplexType` in this example |
| `room/Type` | Refers to the `Type` sub-field of the `room` range variable, for example in the filter expression `Rooms/any(room: room/Type eq 'deluxe')` |
| `store/Address/Country` | Refers to the `Country` sub-field of the `Address` sub-field of the `store` range variable, for example in the filter expression `Stores/any(store: store/Address/Country eq 'Canada')` |

The meaning of a field path differs depending on the context. In filters, a field path refers to the value of a *single instance* of a field in the current document. In other contexts, such as **$orderby**, **$select**, or in [fielded search in the full Lucene syntax](query-lucene-syntax.md#bkmk_fields), a field path refers to the field itself. This difference has some consequences for how you use field paths in filters.

Consider the field path `Address/City`. In a filter, this refers to a single city for the current document, like "San Francisco". In contrast, `Rooms/Type` refers to the `Type` sub-field for many rooms (like "standard" for the first room, "deluxe" for the second room, and so on). Since `Rooms/Type` doesn't refer to a *single instance* of the sub-field `Type`, it can't be used directly in a filter. Instead, to filter on room type, you would use a [lambda expression](search-query-odata-collection-operators.md) with a range variable, like this:

    Rooms/any(room: room/Type eq 'deluxe')

In this example, the range variable `room` appears in the `room/Type` field path. That way, `room/Type` refers to the type of the current room in the current document. This is a single instance of the `Type` sub-field, so it can be used directly in the filter.

### Using field paths

Field paths are used in many parameters of the [Azure Search API](https://docs.microsoft.com/rest/api/searchservice/). The following table lists all the places where they can be used, plus any restrictions on their usage:

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

## Constants

Constants in OData are literal values of a given [Entity Data Model](https://docs.microsoft.com/dotnet/framework/data/adonet/entity-data-model) (EDM) type. See [Supported data types](https://docs.microsoft.com/rest/api/searchservice/supported-data-types) for a list of supported types in Azure Search. Constants of collection types aren't supported.

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

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#constant)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

## Building expressions from field paths and constants

Field paths and constants are the most basic part of an OData expression, but they're already full expressions themselves. In fact, the **$select** parameter in Azure Search is nothing but a comma-separated list of field paths, and **$orderby** isn't much more complicated than **$select**. If you happen to have a field of type `Edm.Boolean` in your index, you can even write a filter that is nothing but the path of that field. The constants `true` and `false` are likewise valid filters.

However, most of the time you'll need more complex expressions that refer to more than one field and constant. These expressions are built in different ways depending on the parameter.

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar for the **$filter**, **$orderby**, and **$select** parameters. These are built up from simpler expressions that refer to field paths and constants:

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
filter_expression ::= boolean_expression

order_by_expression ::= order_by_clause(',' order_by_clause)*

select_expression ::= '*' | field_path(',' field_path)*
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#filter_expression)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

The **$orderby** and **$select** parameters are both comma-separated lists of simpler expressions. The **$filter** parameter is a Boolean expression that is composed of simpler sub-expressions. These sub-expressions are combined using logical operators such as [`and`, `or`, and `not`](search-query-odata-logical-operators.md), comparison operators such as [`eq`, `lt`, `gt`, and so on](search-query-odata-comparison-operators.md), and collection operators such as [`any` and `all`](search-query-odata-collection-operators.md).

The **$filter**, **$orderby**, and **$select** parameters are explored in more detail in the following articles:

- [OData $filter syntax in Azure Search](search-query-odata-filter.md)
- [OData $orderby syntax in Azure Search](search-query-odata-orderby.md)
- [OData $select syntax in Azure Search](search-query-odata-select.md)

## See also  

- [Faceted navigation in Azure Search](search-faceted-navigation.md)
- [Filters in Azure Search](search-filters.md)
- [Search Documents &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
- [Lucene query syntax](query-lucene-syntax.md)
- [Simple query syntax in Azure Search](query-simple-syntax.md)
