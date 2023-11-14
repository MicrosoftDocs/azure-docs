---
title: OData filter reference
titleSuffix: Azure AI Search
description: OData language reference and full syntax used for creating filter expressions in Azure AI Search queries.

manager: nitinme
author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 07/18/2022
---

# OData $filter syntax in Azure AI Search

In Azure AI Search, the **$filter** parameter specifies inclusion or exclusion criteria for returning matches in search results. This article describes the OData syntax of **$filter** and provides examples.

Field path construction and constants are described in the [OData language overview in Azure AI Search](query-odata-filter-orderby-syntax.md). For more information about filter scenarios, see [Filters in Azure AI Search](search-filters.md).

## Syntax

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

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure AI Search](https://azuresearch.github.io/odata-syntax-diagram/#boolean_expression)

> [!NOTE]
> See [OData expression syntax reference for Azure AI Search](search-query-odata-syntax-reference.md) for the complete EBNF.

The types of Boolean expressions include:

- Collection filter expressions using `any` or `all`. These apply filter criteria to collection fields. For more information, see [OData collection operators in Azure AI Search](search-query-odata-collection-operators.md).
- Logical expressions that combine other Boolean expressions using the operators `and`, `or`, and `not`. For more information, see [OData logical operators in Azure AI Search](search-query-odata-logical-operators.md).
- Comparison expressions, which compare fields or range variables to constant values using the operators `eq`, `ne`, `gt`, `lt`, `ge`, and `le`. For more information, see [OData comparison operators in Azure AI Search](search-query-odata-comparison-operators.md). Comparison expressions are also used to compare distances between geo-spatial coordinates using the `geo.distance` function. For more information, see [OData geo-spatial functions in Azure AI Search](search-query-odata-geo-spatial-functions.md).
- The Boolean literals `true` and `false`. These constants can be useful sometimes when programmatically generating filters, but otherwise don't tend to be used in practice.
- Calls to Boolean functions, including:
  - `geo.intersects`, which tests whether a given point is within a given polygon. For more information, see [OData geo-spatial functions in Azure AI Search](search-query-odata-geo-spatial-functions.md).
  - `search.in`, which compares a field or range variable with each value in a list of values. For more information, see [OData `search.in` function in Azure AI Search](search-query-odata-search-in-function.md).
  - `search.ismatch` and `search.ismatchscoring`, which execute full-text search operations in a filter context. For more information, see [OData full-text search functions in Azure AI Search](search-query-odata-full-text-search-functions.md).
- Field paths or range variables of type `Edm.Boolean`. For example, if your index has a Boolean field called `IsEnabled` and you want to return all documents where this field is `true`, your filter expression can just be the name `IsEnabled`.
- Boolean expressions in parentheses. Using parentheses can help to explicitly determine the order of operations in a filter. For more information on the default precedence of the OData operators, see the next section.

### Operator precedence in filters

If you write a filter expression with no parentheses around its sub-expressions, Azure AI Search will evaluate it according to a set of operator precedence rules. These rules are based on which operators are used to combine sub-expressions. The following table lists groups of operators in order from highest to lowest precedence:

| Group | Operator(s) |
| --- | --- |
| Logical operators | `not` |
| Comparison operators | `eq`, `ne`, `gt`, `lt`, `ge`, `le` |
| Logical operators | `and` |
| Logical operators | `or` |

An operator that is higher in the above table will "bind more tightly" to its operands than other operators. For example, `and` is of higher precedence than `or`, and comparison operators are of higher precedence than either of them, so the following two expressions are equivalent:

```odata-filter-expr
    Rating gt 0 and Rating lt 3 or Rating gt 7 and Rating lt 10
    ((Rating gt 0) and (Rating lt 3)) or ((Rating gt 7) and (Rating lt 10))
```

The `not` operator has the highest precedence of all -- even higher than the comparison operators. That's why if you try to write a filter like this:

```odata-filter-expr
    not Rating gt 5
```

You'll get this error message:

```text
    Invalid expression: A unary operator with an incompatible type was detected. Found operand type 'Edm.Int32' for operator kind 'Not'.
```

This error happens because the operator is associated with just the `Rating` field, which is of type `Edm.Int32`, and not with the entire comparison expression. The fix is to put the operand of `not` in parentheses:

```odata-filter-expr
    not (Rating gt 5)
```

<a name="bkmk_limits"></a>

### Filter size limitations

There are limits to the size and complexity of filter expressions that you can send to Azure AI Search. The limits are based roughly on the number of clauses in your filter expression. A good guideline is that if you have hundreds of clauses, you are at risk of exceeding the limit. We recommend designing your application in such a way that it doesn't generate filters of unbounded size.

> [!TIP]
> Using [the `search.in` function](search-query-odata-search-in-function.md) instead of long disjunctions of equality comparisons can help avoid the filter clause limit, since a function call counts as a single clause.

## Examples

Find all hotels with at least one room with a base rate less than $200 that are rated at or above 4:

```odata-filter-expr
    $filter=Rooms/any(room: room/BaseRate lt 200.0) and Rating ge 4
```

Find all hotels other than "Sea View Motel" that have been renovated since 2010:

```odata-filter-expr
    $filter=HotelName ne 'Sea View Motel' and LastRenovationDate ge 2010-01-01T00:00:00Z
```

Find all hotels that were renovated in 2010 or later. The datetime literal includes time zone information for Pacific Standard Time:  

```odata-filter-expr
    $filter=LastRenovationDate ge 2010-01-01T00:00:00-08:00
```

Find all hotels that have parking included and where all rooms are non-smoking:

```odata-filter-expr
    $filter=ParkingIncluded and Rooms/all(room: not room/SmokingAllowed)
```

 \- OR -  

```odata-filter-expr
    $filter=ParkingIncluded eq true and Rooms/all(room: room/SmokingAllowed eq false)
```

Find all hotels that are Luxury or include parking and have a rating of 5:  

```odata-filter-expr
    $filter=(Category eq 'Luxury' or ParkingIncluded eq true) and Rating eq 5
```

Find all hotels with the tag "wifi" in at least one room (where each room has tags stored in a `Collection(Edm.String)` field):  

```odata-filter-expr
    $filter=Rooms/any(room: room/Tags/any(tag: tag eq 'wifi'))
```

Find all hotels with any rooms:  

```odata-filter-expr
    $filter=Rooms/any()
```

Find all hotels that don't have rooms:

```odata-filter-expr
    $filter=not Rooms/any()
```

Find all hotels within 10 kilometers of a given reference point (where `Location` is a field of type `Edm.GeographyPoint`):

```odata-filter-expr
    $filter=geo.distance(Location, geography'POINT(-122.131577 47.678581)') le 10
```

Find all hotels within a given viewport described as a polygon (where `Location` is a field of type Edm.GeographyPoint). The polygon must be closed, meaning the first and last point sets must be the same. Also, [the points must be listed in counterclockwise order](/rest/api/searchservice/supported-data-types#Anchor_1).

```odata-filter-expr
    $filter=geo.intersects(Location, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))')
```

Find all hotels where the "Description" field is null. The field will be null if it was never set, or if it was explicitly set to null:  

```odata-filter-expr
    $filter=Description eq null
```

Find all hotels with name equal to either 'Sea View motel' or 'Budget hotel'). These phrases contain spaces, and space is a default delimiter. You can specify an alternative delimiter in single quotes as the third string parameter:  

```odata-filter-expr
    $filter=search.in(HotelName, 'Sea View motel,Budget hotel', ',')
```

Find all hotels with name equal to either 'Sea View motel' or 'Budget hotel' separated by '|'):  

```odata-filter-expr
    $filter=search.in(HotelName, 'Sea View motel|Budget hotel', '|')
```

Find all hotels where all rooms have the tag 'wifi' or 'tub':

```odata-filter-expr
    $filter=Rooms/any(room: room/Tags/any(tag: search.in(tag, 'wifi, tub')))
```

Find a match on phrases within a collection, such as 'heated towel racks' or 'hairdryer included' in tags.

```odata-filter-expr
    $filter=Rooms/any(room: room/Tags/any(tag: search.in(tag, 'heated towel racks,hairdryer included', ','))
```

Find documents with the word "waterfront". This filter query is identical to a [search request](/rest/api/searchservice/search-documents) with `search=waterfront`.

```odata-filter-expr
    $filter=search.ismatchscoring('waterfront')
```

Find documents with the word "hostel" and rating greater or equal to 4, or documents with the word "motel" and rating equal to 5. This request couldn't be expressed without the `search.ismatchscoring` function since it combines full-text search with filter operations using `or`.

```odata-filter-expr
    $filter=search.ismatchscoring('hostel') and rating ge 4 or search.ismatchscoring('motel') and rating eq 5
```

Find documents without the word "luxury".

```odata-filter-expr
    $filter=not search.ismatch('luxury')
```

Find documents with the phrase "ocean view" or rating equal to 5. The `search.ismatchscoring` query will be executed only against fields `HotelName` and `Description`. Documents that matched only the second clause of the disjunction will be returned too -- hotels with `Rating` equal to 5. Those documents will be returned with score equal to zero to make it clear that they didn't match any of the scored parts of the expression.

```odata-filter-expr
    $filter=search.ismatchscoring('"ocean view"', 'Description,HotelName') or Rating eq 5
```

Find hotels where the terms "hotel" and "airport" are no more than five words apart in the description, and where all rooms are non-smoking. This query uses the [full Lucene query language](query-lucene-syntax.md).

```odata-filter-expr
    $filter=search.ismatch('"hotel airport"~5', 'Description', 'full', 'any') and not Rooms/any(room: room/SmokingAllowed)
```

Find documents that have a word that starts with the letters "lux" in the Description field. This query uses [prefix search](query-simple-syntax.md#prefix-queries) in combination with `search.ismatch`.

```odata-filter-expr
    $filter=search.ismatch('lux*', 'Description')
```

## Next steps  

- [Filters in Azure AI Search](search-filters.md)
- [OData expression language overview for Azure AI Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure AI Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure AI Search REST API&#41;](/rest/api/searchservice/Search-Documents)
