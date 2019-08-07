---
title: OData comparison operator reference - Azure Search
description: OData comparison operators, eq, ne, gt, lt, ge, and le, in Azure Search queries.
ms.date: 06/13/2019
services: search
ms.service: search
ms.topic: conceptual
author: "brjohnstmsft"
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
# OData comparison operators in Azure Search - `eq`, `ne`, `gt`, `lt`, `ge`, and `le`

The most basic operation in an [OData filter expression](query-odata-filter-orderby-syntax.md) in Azure Search is to compare a field to a given value. Two types of comparison are possible -- equality comparison, and range comparison. You can use the following operators to compare a field to a constant value:

Equality operators:

- `eq`: Test whether a field is **equal to** a constant value
- `ne`: Test whether a field is **not equal to** a constant value

Range operators:

- `gt`: Test whether a field is **greater than** a constant value
- `lt`: Test whether a field is **less than** a constant value
- `ge`: Test whether a field is **greater than or equal to** a constant value
- `le`: Test whether a field is **less than or equal to** a constant value

You can use the range operators in combination with the [logical operators](search-query-odata-logical-operators.md) to test whether a field is within a certain range of values. See the [examples](#examples) later in this article.

> [!NOTE]
> If you prefer, you can put the constant value on the left side of the operator and the field name on the right side. For range operators, the meaning of the comparison is reversed. For example, if the constant value is on the left, `gt` would test whether the constant value is greater than the field. You can also use the comparison operators to compare the result of a function, such as `geo.distance`, with a value. For Boolean functions such as `search.ismatch`, comparing the result to `true` or `false` is optional.

## Syntax

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar of an OData expression that uses the comparison operators.

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
comparison_expression ::=
    variable_or_function comparison_operator constant |
    constant comparison_operator variable_or_function

variable_or_function ::= variable | function_call

comparison_operator ::= 'gt' | 'lt' | 'ge' | 'le' | 'eq' | 'ne'
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#comparison_expression)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

There are two forms of comparison expressions. The only difference between them is whether the constant appears on the left- or right-hand-side of the operator. The expression on the other side of the operator must be a **variable** or a function call. A variable can be either a field name, or a range variable in the case of a [lambda expression](search-query-odata-collection-operators.md).

## Data types for comparisons

The data types on both sides of a comparison operator must be compatible. For example, if the left side is a field of type `Edm.DateTimeOffset`, then the right side must be a date-time constant. Numeric data types are more flexible. You can compare variables and functions of any numeric type with constants of any other numeric type, with a few limitations, as described in the following table.

| Variable or function type | Constant value type | Limitations |
| --- | --- | --- |
| `Edm.Double` | `Edm.Double` | Comparison is subject to [special rules for `NaN`](#special-case-nan) |
| `Edm.Double` | `Edm.Int64` | Constant is converted to `Edm.Double`, resulting in a loss of precision for values of large magnitude |
| `Edm.Double` | `Edm.Int32` | n/a |
| `Edm.Int64` | `Edm.Double` | Comparisons to `NaN`, `-INF`, or `INF` are not allowed |
| `Edm.Int64` | `Edm.Int64` | n/a |
| `Edm.Int64` | `Edm.Int32` | Constant is converted to `Edm.Int64` before comparison |
| `Edm.Int32` | `Edm.Double` | Comparisons to `NaN`, `-INF`, or `INF` are not allowed |
| `Edm.Int32` | `Edm.Int64` | n/a |
| `Edm.Int32` | `Edm.Int32` | n/a |

For comparisons that are not allowed, such as comparing a field of type `Edm.Int64` to `NaN`, the Azure Search REST API will return an "HTTP 400: Bad Request" error.

> [!IMPORTANT]
> Even though numeric type comparisons are flexible, we highly recommend writing comparisons in filters so that the constant value is of the same data type as the variable or function to which it is being compared. This is especially important when mixing floating-point and integer values, where implicit conversions that lose precision are possible.

<a name="special-case-nan"></a>

### Special cases for `null` and `NaN`

When using comparison operators, it's important to remember that all non-collection fields in Azure Search can potentially be `null`. The following table shows all the possible outcomes for a comparison expression where either side can be `null`:

| Operator | Result when only the field or variable is `null` | Result when only the constant is `null` | Result when both the field or variable and the constant are `null` |
| --- | --- | --- | --- |
| `gt` | `false` | HTTP 400: Bad Request error | HTTP 400: Bad Request error |
| `lt` | `false` | HTTP 400: Bad Request error | HTTP 400: Bad Request error |
| `ge` | `false` | HTTP 400: Bad Request error | HTTP 400: Bad Request error |
| `le` | `false` | HTTP 400: Bad Request error | HTTP 400: Bad Request error |
| `eq` | `false` | `false` | `true` |
| `ne` | `true` | `true` | `false` |

In summary, `null` is equal only to itself, and is not less or greater than any other value.

If your index has fields of type `Edm.Double` and you upload `NaN` values to those fields, you will need to account for that when writing filters. Azure Search implements the IEEE 754 standard for handling `NaN` values, and comparisons with such values produce non-obvious results, as shown in the following table.

| Operator | Result when at least one operand is `NaN` |
| --- | --- |
| `gt` | `false` |
| `lt` | `false` |
| `ge` | `false` |
| `le` | `false` |
| `eq` | `false` |
| `ne` | `true` |

In summary, `NaN` is not equal to any value, including itself.

### Comparing geo-spatial data

You can't directly compare a field of type `Edm.GeographyPoint` with a constant value, but you can use the `geo.distance` function. This function returns a value of type `Edm.Double`, so you can compare it with a numeric constant to filter based on the distance from constant geo-spatial coordinates. See the [examples](#examples) below.

### Comparing string data

Strings can be compared in filters for exact matches using the `eq` and `ne` operators. These comparisons are case-sensitive.

## Examples

Match documents where the `Rating` field is between 3 and 5, inclusive:

    Rating ge 3 and Rating le 5

Match documents where the `Location` field is less than 2 kilometers from the given latitude and longitude:

    geo.distance(Location, geography'POINT(-122.031577 47.578581)') lt 2.0

Match documents where the `LastRenovationDate` field is greater than or equal to January 1st, 2015, midnight UTC:

    LastRenovationDate ge 2015-01-01T00:00:00.000Z

Match documents where the `Details/Sku` field is not `null`:

    Details/Sku ne null

Match documents for hotels where at least one room has type "Deluxe Room", where the string of the `Rooms/Type` field matches the filter exactly:

    Rooms/any(room: room/Type eq 'Deluxe Room')

## Next steps  

- [Filters in Azure Search](search-filters.md)
- [OData expression language overview for Azure Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
