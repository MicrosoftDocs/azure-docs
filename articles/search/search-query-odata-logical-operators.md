---
title: OData logical operator reference
titleSuffix: Azure Cognitive Search
description: Syntax and reference documentation for using OData logical operators, and, or, and not, in Azure Cognitive Search queries.

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
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
# OData logical operators in Azure Cognitive Search - `and`, `or`, `not`

[OData filter expressions](query-odata-filter-orderby-syntax.md) in Azure Cognitive Search are Boolean expressions that evaluate to `true` or `false`. You can write a complex filter by writing a series of [simpler filters](search-query-odata-comparison-operators.md) and composing them using the logical operators from [Boolean algebra](https://en.wikipedia.org/wiki/Boolean_algebra):

- `and`: A binary operator that evaluates to `true` if both its left and right sub-expressions evaluate to `true`.
- `or`: A binary operator that evaluates to `true` if either one of its left or right sub-expressions evaluates to `true`.
- `not`: A unary operator that evaluates to `true` if its sub-expression evaluates to `false`, and vice-versa.

These, together with the [collection operators `any` and `all`](search-query-odata-collection-operators.md), allow you to construct filters that can express very complex search criteria.

## Syntax

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar of an OData expression that uses the logical operators.

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
logical_expression ::=
    boolean_expression ('and' | 'or') boolean_expression
    | 'not' boolean_expression
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Cognitive Search](https://azuresearch.github.io/odata-syntax-diagram/#logical_expression)

> [!NOTE]
> See [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md) for the complete EBNF.

There are two forms of logical expressions: binary (`and`/`or`), where there are two sub-expressions, and unary (`not`), where there is only one. The sub-expressions can be Boolean expressions of any kind:

- Fields or range variables of type `Edm.Boolean`
- Functions that return values of type `Edm.Boolean`, such as `geo.intersects` or `search.ismatch`
- [Comparison expressions](search-query-odata-comparison-operators.md), such as `rating gt 4`
- [Collection expressions](search-query-odata-collection-operators.md), such as `Rooms/any(room: room/Type eq 'Deluxe Room')`
- The Boolean literals `true` or `false`.
- Other logical expressions constructed using `and`, `or`, and `not`.

> [!IMPORTANT]
> There are some situations where not all kinds of sub-expression can be used with `and`/`or`, particularly inside lambda expressions. See [OData collection operators in Azure Cognitive Search](search-query-odata-collection-operators.md#limitations) for details.

### Logical operators and `null`

Most Boolean expressions such as functions and comparisons cannot produce `null` values, and the logical operators cannot be applied to the `null` literal directly (for example, `x and null` is not allowed). However, Boolean fields can be `null`, so you need to be aware of how the `and`, `or`, and `not` operators behave in the presence of null. This is summarized in the following table, where `b` is a field of type `Edm.Boolean`:

| Expression | Result when `b` is `null` |
| --- | --- |
| `b` | `false` |
| `not b` | `true` |
| `b eq true` | `false` |
| `b eq false` | `false` |
| `b eq null` | `true` |
| `b ne true` | `true` |
| `b ne false` | `true` |
| `b ne null` | `false` |
| `b and true` | `false` |
| `b and false` | `false` |
| `b or true` | `true` |
| `b or false` | `false` |

When a Boolean field `b` appears by itself in a filter expression, it behaves as if it had been written `b eq true`, so if `b` is `null`, the expression evaluates to `false`. Similarly, `not b` behaves like `not (b eq true)`, so it evaluates to `true`. In this way, `null` fields behave the same as `false`. This is consistent with how they behave when combined with other expressions using `and` and `or`, as shown in the table above. Despite this, a direct comparison to `false` (`b eq false`) will still evaluate to `false`. In other words, `null` is not equal to `false`, even though it behaves like it in Boolean expressions.

## Examples

Match documents where the `rating` field is between 3 and 5, inclusive:

    rating ge 3 and rating le 5

Match documents where all elements of the `ratings` field are less than 3 or greater than 5:

    ratings/all(r: r lt 3 or r gt 5)

Match documents where the `location` field is within the given polygon, and the document does not contain the term "public".

    geo.intersects(location, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))') and not search.ismatch('public')

Match documents for hotels in Vancouver, Canada where there is a deluxe room with a base rate less than 160:

    Address/City eq 'Vancouver' and Address/Country eq 'Canada' and Rooms/any(room: room/Type eq 'Deluxe Room' and room/BaseRate lt 160)

## Next steps  

- [Filters in Azure Cognitive Search](search-filters.md)
- [OData expression language overview for Azure Cognitive Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure Cognitive Search REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
