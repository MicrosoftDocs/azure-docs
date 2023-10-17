---
title: OData language overview
titleSuffix: Azure Cognitive Search
description: OData language overview for filters, select, and order-by for Azure Cognitive Search queries.

author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/08/2023

---

# OData language overview for `$filter`, `$orderby`, and `$select` in Azure Cognitive Search

This article provides an overview of the OData expression language used in $filter, $order-by, and $select expressions in Azure Cognitive Search. The language is presented "bottom-up" starting with the most basic elements. The OData expressions that you can construct in a query request range from simple to highly complex, but they all share common elements. Shared elements include:

+ **Field paths**, which refer to specific fields of your index.
+ **Constants**, which are literal values of a certain data type.

Once you understand these common concepts, you can continue with the top-level syntax for each expression:

+ [**$filter**](search-query-odata-filter.md) expressions are evaluated during query parsing, constraining search to specific fields or adding match criteria used during index scans. 
+ [**$orderby**](search-query-odata-orderby.md) expressions are applied as a post-processing step over a result set to sort the documents that are returned. 
+ [**$select**](search-query-odata-select.md) expressions determine which document fields are included in the result set. 

The syntax of these expressions is distinct from the [simple](query-simple-syntax.md) or [full](query-lucene-syntax.md) query syntax used in the **search** parameter, although there's some overlap in the syntax for referencing fields.

> [!NOTE]
> Terminology in Azure Cognitive Search differs from the [OData standard](https://www.odata.org/documentation/) in a few ways. What we call a **field** in Azure Cognitive Search is called a **property** in OData, and similarly for **field path** versus **property path**. An **index** containing **documents** in Azure Cognitive Search is referred to more generally in OData as an **entity set** containing **entities**. The Azure Cognitive Search terminology is used throughout this reference.

## Field paths

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar of field paths.

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
field_path ::= identifier('/'identifier)*

identifier ::= [a-zA-Z_][a-zA-Z_0-9]*
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Cognitive Search](https://azuresearch.github.io/odata-syntax-diagram/#field_path)

> [!NOTE]
> See [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md) for the complete EBNF.

A field path is composed of one or more **identifiers** separated by slashes. Each identifier is a sequence of characters that must start with an ASCII letter or underscore, and contain only ASCII letters, digits, or underscores. The letters can be upper- or lower-case.

An identifier can refer either to the name of a field, or to a **range variable** in the context of a [collection expression](search-query-odata-collection-operators.md) (`any` or `all`) in a filter. A range variable is like a loop variable that represents the current element of the collection. For complex collections, that variable represents an object, which is why you can use field paths to refer to subfields of the variable. This is analogous to dot notation in many programming languages.

Examples of field paths are shown in the following table:

| Field path | Description |
| --- | --- |
| `HotelName` | Refers to a top-level field of the index |
| `Address/City` | Refers to the `City` subfield of a complex field in the index; `Address` is of type `Edm.ComplexType` in this example |
| `Rooms/Type` | Refers to the `Type` subfield of a complex collection field in the index; `Rooms` is of type `Collection(Edm.ComplexType)` in this example |
| `Stores/Address/Country` | Refers to the `Country` subfield of the `Address` subfield of a complex collection field in the index; `Stores` is of type `Collection(Edm.ComplexType)` and `Address` is of type `Edm.ComplexType` in this example |
| `room/Type` | Refers to the `Type` subfield of the `room` range variable, for example in the filter expression `Rooms/any(room: room/Type eq 'deluxe')` |
| `store/Address/Country` | Refers to the `Country` subfield of the `Address` subfield of the `store` range variable, for example in the filter expression `Stores/any(store: store/Address/Country eq 'Canada')` |

The meaning of a field path differs depending on the context. In filters, a field path refers to the value of a *single instance* of a field in the current document. In other contexts, such as **$orderby**, **$select**, or in [fielded search in the full Lucene syntax](query-lucene-syntax.md#bkmk_fields), a field path refers to the field itself. This difference has some consequences for how you use field paths in filters.

Consider the field path `Address/City`. In a filter, this refers to a single city for the current document, like "San Francisco". In contrast, `Rooms/Type` refers to the `Type` subfield for many rooms (like "standard" for the first room, "deluxe" for the second room, and so on). Since `Rooms/Type` doesn't refer to a *single instance* of the subfield `Type`, it can't be used directly in a filter. Instead, to filter on room type, you would use a [lambda expression](search-query-odata-collection-operators.md) with a range variable, like this:

```odata
Rooms/any(room: room/Type eq 'deluxe')
```

In this example, the range variable `room` appears in the `room/Type` field path. That way, `room/Type` refers to the type of the current room in the current document. This is a single instance of the `Type` subfield, so it can be used directly in the filter.

### Using field paths

Field paths are used in many parameters of the [Azure Cognitive Search REST APIs](/rest/api/searchservice/). The following table lists all the places where they can be used, plus any restrictions on their usage:

| API | Parameter name | Restrictions |
| --- | --- | --- |
| [Create](/rest/api/searchservice/create-index) or [Update](/rest/api/searchservice/update-index) Index | `suggesters/sourceFields` | None |
| [Create](/rest/api/searchservice/create-index) or [Update](/rest/api/searchservice/update-index) Index | `scoringProfiles/text/weights` | Can only refer to **searchable** fields |
| [Create](/rest/api/searchservice/create-index) or [Update](/rest/api/searchservice/update-index) Index | `scoringProfiles/functions/fieldName` | Can only refer to **filterable** fields |
| [Search](/rest/api/searchservice/search-documents) | `search` when `queryType` is `full` | Can only refer to **searchable** fields |
| [Search](/rest/api/searchservice/search-documents) | `facet` | Can only refer to **facetable** fields |
| [Search](/rest/api/searchservice/search-documents) | `highlight` | Can only refer to **searchable** fields |
| [Search](/rest/api/searchservice/search-documents) | `searchFields` | Can only refer to **searchable** fields |
| [Suggest](/rest/api/searchservice/suggestions) and [Autocomplete](/rest/api/searchservice/autocomplete) | `searchFields` | Can only refer to fields that are part of a [suggester](index-add-suggesters.md) |
| [Search](/rest/api/searchservice/search-documents), [Suggest](/rest/api/searchservice/suggestions), and [Autocomplete](/rest/api/searchservice/autocomplete) | `$filter` | Can only refer to **filterable** fields |
| [Search](/rest/api/searchservice/search-documents) and [Suggest](/rest/api/searchservice/suggestions) | `$orderby` | Can only refer to **sortable** fields |
| [Search](/rest/api/searchservice/search-documents), [Suggest](/rest/api/searchservice/suggestions), and [Lookup](/rest/api/searchservice/lookup-document) | `$select` | Can only refer to **retrievable** fields |

## Constants

Constants in OData are literal values of a given [Entity Data Model](/dotnet/framework/data/adonet/entity-data-model) (EDM) type. See [Supported data types](/rest/api/searchservice/supported-data-types) for a list of supported types in Azure Cognitive Search. Constants of collection types aren't supported.

The following table shows examples of constants for each of the data types supported by Azure Cognitive Search:

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

### Escaping special characters in string constants

String constants in OData are delimited by single quotes. If you need to construct a query with a string constant that might itself contain single quotes, you can escape the embedded quotes by doubling them.

For example, a phrase with an unformatted apostrophe like "Alice's car" would be represented in OData as the string constant `'Alice''s car'`.

> [!IMPORTANT]
> When constructing filters programmatically, it's important to remember to escape string constants that come from user input. This is to mitigate the possibility of [injection attacks](https://wikipedia.org/wiki/SQL_injection), especially when using filters to implement [security trimming](search-security-trimming-for-azure-search.md).

### Constants syntax

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar for most of the constants shown in the above table. The grammar for geo-spatial types can be found in [OData geo-spatial functions in Azure Cognitive Search](search-query-odata-geo-spatial-functions.md).

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
> [OData syntax diagram for Azure Cognitive Search](https://azuresearch.github.io/odata-syntax-diagram/#constant)

> [!NOTE]
> See [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md) for the complete EBNF.

## Building expressions from field paths and constants

Field paths and constants are the most basic part of an OData expression, but they're already full expressions themselves. In fact, the **$select** parameter in Azure Cognitive Search is nothing but a comma-separated list of field paths, and **$orderby** isn't much more complicated than **$select**. If you happen to have a field of type `Edm.Boolean` in your index, you can even write a filter that is nothing but the path of that field. The constants `true` and `false` are likewise valid filters.

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
> [OData syntax diagram for Azure Cognitive Search](https://azuresearch.github.io/odata-syntax-diagram/#filter_expression)

> [!NOTE]
> See [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md) for the complete EBNF.

## Next steps

The **$orderby** and **$select** parameters are both comma-separated lists of simpler expressions. The **$filter** parameter is a Boolean expression that is composed of simpler subexpressions. These subexpressions are combined using logical operators such as [`and`, `or`, and `not`](search-query-odata-logical-operators.md), comparison operators such as [`eq`, `lt`, `gt`, and so on](search-query-odata-comparison-operators.md), and collection operators such as [`any` and `all`](search-query-odata-collection-operators.md).

The **$filter**, **$orderby**, and **$select** parameters are explored in more detail in the following articles:

+ [OData $filter syntax in Azure Cognitive Search](search-query-odata-filter.md)
+ [OData $orderby syntax in Azure Cognitive Search](search-query-odata-orderby.md)
+ [OData $select syntax in Azure Cognitive Search](search-query-odata-select.md)
