---
title: Troubleshooting OData collection filters
titleSuffix: Azure AI Search
description: Learn approaches for resolving OData collection filter errors in Azure AI Search queries.

author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 03/18/2024
---
# Troubleshooting OData collection filters in Azure AI Search

To [filter](query-odata-filter-orderby-syntax.md) on collection fields in Azure AI Search, you can use the [`any` and `all` operators](search-query-odata-collection-operators.md) together with **lambda expressions**. A lambda expression is a subfilter that is applied to each element of a collection.

Not every feature of filter expressions is available inside a lambda expression. Which features are available differs depending on the data type of the collection field that you want to filter. This can result in an error if you try to use a feature in a lambda expression that isn't supported in that context. If you're encountering such errors while trying to write a complex filter over collection fields, this article will help you troubleshoot the problem.

## Common collection filter errors

The following table lists errors that you might encounter when trying to execute a collection filter. These errors happen when you use a feature of filter expressions that isn't supported inside a lambda expression. Each error gives some guidance on how you can rewrite your filter to avoid the error. The table also includes a link to the relevant section of this article that provides more information on how to avoid that error.

| Error message | Situation | Details|
| --- | --- | --- |
| The function `ismatch` has no parameters bound to the range variable 's'. Only bound field references are supported inside lambda expressions ('any' or 'all'). However, you can change your filter so that the `ismatch` function is outside the lambda expression and try again. | Using `search.ismatch` or `search.ismatchscoring` inside a lambda expression | [Rules for filtering complex collections](#bkmk_complex) |
| Invalid lambda expression. Found a test for equality or inequality where the opposite was expected in a lambda expression that iterates over a field of type Collection(Edm.String). For 'any', use expressions of the form 'x eq y' or 'search.in(...)'. For 'all', use expressions of the form 'x ne y', 'not (x eq y)', or 'not search.in(...)'. | Filtering on a field of type `Collection(Edm.String)` | [Rules for filtering string collections](#bkmk_strings) |
| Invalid lambda expression. Found an unsupported form of complex Boolean expression. For 'any', use expressions that are 'ORs of ANDs', also known as Disjunctive Normal Form. For example: `(a and b) or (c and d)` where a, b, c, and d are comparison or equality subexpressions. For 'all', use expressions that are 'ANDs of ORs', also known as Conjunctive Normal Form. For example: `(a or b) and (c or d)` where a, b, c, and d are comparison or inequality subexpressions. Examples of comparison expressions: 'x gt 5', 'x le 2'. Example of an equality expression: 'x eq 5'. Example of an inequality expression: 'x ne 5'. | Filtering on fields of type `Collection(Edm.DateTimeOffset)`, `Collection(Edm.Double)`, `Collection(Edm.Int32)`, or `Collection(Edm.Int64)` | [Rules for filtering comparable collections](#bkmk_comparables) |
| Invalid lambda expression. Found an unsupported use of geo.distance() or geo.intersects() in a lambda expression that iterates over a field of type Collection(Edm.GeographyPoint). For 'any', make sure you compare geo.distance() using the 'lt' or 'le' operators and make sure that any usage of geo.intersects() isn't negated. For 'all', make sure you compare geo.distance() using the 'gt' or 'ge' operators and make sure that any usage of geo.intersects() is negated. | Filtering on a field of type `Collection(Edm.GeographyPoint)` | [Rules for filtering GeographyPoint collections](#bkmk_geopoints) |
| Invalid lambda expression. Complex Boolean expressions aren't supported in lambda expressions that iterate over fields of type Collection(Edm.GeographyPoint). For 'any', join subexpressions with 'or'; 'and' isn't supported. For 'all', join subexpressions with 'and'; 'or' isn't supported. | Filtering on fields of type `Collection(Edm.String)` or `Collection(Edm.GeographyPoint)` | [Rules for filtering string collections](#bkmk_strings) <br/><br/> [Rules for filtering GeographyPoint collections](#bkmk_geopoints) |
| Invalid lambda expression. Found a comparison operator (one of 'lt', 'le', 'gt', or 'ge'). Only equality operators are allowed in lambda expressions that iterate over fields of type Collection(Edm.String). For 'any', se expressions of the form 'x eq y'. For 'all', use expressions of the form 'x ne y' or 'not (x eq y)'. | Filtering on a field of type `Collection(Edm.String)` | [Rules for filtering string collections](#bkmk_strings) |

<a name="bkmk_examples"></a>

## How to write valid collection filters

The rules for writing valid collection filters are different for each data type. The following sections describe the rules by showing examples of which filter features are supported and which aren't:

- [Rules for filtering string collections](#bkmk_strings)
- [Rules for filtering Boolean collections](#bkmk_bools)
- [Rules for filtering GeographyPoint collections](#bkmk_geopoints)
- [Rules for filtering comparable collections](#bkmk_comparables)
- [Rules for filtering complex collections](#bkmk_complex)

<a name="bkmk_strings"></a>

## Rules for filtering string collections

Inside lambda expressions for string collections, the only comparison operators that can be used are `eq` and `ne`.

> [!NOTE]
> Azure AI Search does not support the `lt`/`le`/`gt`/`ge` operators for strings, whether inside or outside a lambda expression.

The body of an `any` can only test for equality while the body of an `all` can only test for inequality.

It's also possible to combine multiple expressions via `or` in the body of an `any`, and via `and` in the body of an `all`. Since the `search.in` function is equivalent to combining equality checks with `or`, it's also allowed in the body of an `any`. Conversely, `not search.in` is allowed in the body of an `all`.

For example, these expressions are allowed:

- `tags/any(t: t eq 'books')`
- `tags/any(t: search.in(t, 'books, games, toys'))`
- `tags/all(t: t ne 'books')`
- `tags/all(t: not (t eq 'books'))`
- `tags/all(t: not search.in(t, 'books, games, toys'))`
- `tags/any(t: t eq 'books' or t eq 'games')`
- `tags/all(t: t ne 'books' and not (t eq 'games'))`

While these expressions aren't allowed:

- `tags/any(t: t ne 'books')`
- `tags/any(t: not search.in(t, 'books, games, toys'))`
- `tags/all(t: t eq 'books')`
- `tags/all(t: search.in(t, 'books, games, toys'))`
- `tags/any(t: t eq 'books' and t ne 'games')`
- `tags/all(t: t ne 'books' or not (t eq 'games'))`

<a name="bkmk_bools"></a>

## Rules for filtering Boolean collections

The type `Edm.Boolean` supports only the `eq` and `ne` operators. As such, it doesn’t make much sense to allow combining such clauses that check the same range variable with `and`/`or` since that would always lead to tautologies or contradictions.

Here are some examples of filters on Boolean collections that are allowed:

- `flags/any(f: f)`
- `flags/all(f: f)`
- `flags/any(f: f eq true)`
- `flags/any(f: f ne true)`
- `flags/all(f: not f)`
- `flags/all(f: not (f eq true))`

Unlike string collections, Boolean collections have no limits on which operator can be used in which type of lambda expression. Both `eq` and `ne` can be used in the body of `any` or `all`.

Expressions such as the following aren't allowed for Boolean collections:

- `flags/any(f: f or not f)`
- `flags/any(f: f or f)`
- `flags/all(f: f and not f)`
- `flags/all(f: f and f eq true)`

<a name="bkmk_geopoints"></a>

## Rules for filtering GeographyPoint collections

Values of type `Edm.GeographyPoint` in a collection can’t be compared directly to each other. Instead, they must be used as parameters to the `geo.distance` and `geo.intersects` functions. The `geo.distance` function in turn must be compared to a distance value using one of the comparison operators `lt`, `le`, `gt`, or `ge`. These rules also apply to noncollection Edm.GeographyPoint fields.

Like string collections, `Edm.GeographyPoint` collections have some rules for how the geo-spatial functions can be used and combined in the different types of lambda expressions:

- Which comparison operators you can use with the `geo.distance` function depends on the type of lambda expression. For `any`, you can use only `lt` or `le`. For `all`, you can use only `gt` or `ge`. You can negate expressions involving `geo.distance`, but you have to change the comparison operator (`geo.distance(...) lt x` becomes `not (geo.distance(...) ge x)` and `geo.distance(...) le x` becomes `not (geo.distance(...) gt x)`).
- In the body of an `all`, the `geo.intersects` function must be negated. Conversely, in the body of an `any`, the `geo.intersects` function must not be negated.
- In the body of an `any`, geo-spatial expressions can be combined using `or`. In the body of an `all`, such expressions can be combined using `and`.

The above limitations exist for similar reasons as the equality/inequality limitation on string collections. See [Understanding OData collection filters in Azure AI Search](search-query-understand-collection-filters.md) for a deeper look at these reasons.

Here are some examples of filters on `Edm.GeographyPoint` collections that are allowed:

- `locations/any(l: geo.distance(l, geography'POINT(-122 49)') lt 10)`
- `locations/any(l: not (geo.distance(l, geography'POINT(-122 49)') ge 10) or geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`
- `locations/all(l: geo.distance(l, geography'POINT(-122 49)') ge 10 and not geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`

Expressions such as the following aren't allowed for `Edm.GeographyPoint` collections:

- `locations/any(l: l eq geography'POINT(-122 49)')`
- `locations/any(l: not geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`
- `locations/all(l: geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`
- `locations/any(l: geo.distance(l, geography'POINT(-122 49)') gt 10)`
- `locations/all(l: geo.distance(l, geography'POINT(-122 49)') lt 10)`
- `locations/any(l: geo.distance(l, geography'POINT(-122 49)') lt 10 and geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`
- `locations/all(l: geo.distance(l, geography'POINT(-122 49)') le 10 or not geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`

<a name="bkmk_comparables"></a>

## Rules for filtering comparable collections

This section applies to all the following data types:

- `Collection(Edm.DateTimeOffset)`
- `Collection(Edm.Double)`
- `Collection(Edm.Int32)`
- `Collection(Edm.Int64)`

Types such as `Edm.Int32` and `Edm.DateTimeOffset` support all six of the comparison operators: `eq`, `ne`, `lt`, `le`, `gt`, and `ge`. Lambda expressions over collections of these types can contain simple expressions using any of these operators. This applies to both `any` and `all`. For example, these filters are allowed:

- `ratings/any(r: r ne 5)`
- `dates/any(d: d gt 2017-08-24T00:00:00Z)`
- `not margins/all(m: m eq 3.5)`

However, there are limitations on how such comparison expressions can be combined into more complex expressions inside a lambda expression:

- Rules for `any`:
  - Simple inequality expressions can't be usefully combined with any other expressions. For example, this expression is allowed:
    - `ratings/any(r: r ne 5)`

    but this expression isn't:
    - `ratings/any(r: r ne 5 and r gt 2)`

    and while this expression is allowed, it isn't useful because the conditions overlap:
    - `ratings/any(r: r ne 5 or r gt 7)`
  - Simple comparison expressions involving `eq`, `lt`, `le`, `gt`, or `ge` can be combined with `and`/`or`. For example:
    - `ratings/any(r: r gt 2 and r le 5)`
    - `ratings/any(r: r le 5 or r gt 7)`
  - Comparison expressions combined with `and` (conjunctions) can be further combined using `or`. This form is known in Boolean logic as "[Disjunctive Normal Form](https://en.wikipedia.org/wiki/Disjunctive_normal_form)" (DNF). For example:
    - `ratings/any(r: (r gt 2 and r le 5) or (r gt 7 and r lt 10))`
- Rules for `all`:
  - Simple equality expressions can't be usefully combined with any other expressions. For example, this expression is allowed:
    - `ratings/all(r: r eq 5)`

    but this expression isn't:
    - `ratings/all(r: r eq 5 or r le 2)`

    and while this expression is allowed, it isn't useful because the conditions overlap:
    - `ratings/all(r: r eq 5 and r le 7)`
  - Simple comparison expressions involving `ne`, `lt`, `le`, `gt`, or `ge` can be combined with `and`/`or`. For example:
    - `ratings/all(r: r gt 2 and r le 5)`
    - `ratings/all(r: r le 5 or r gt 7)`
  - Comparison expressions combined with `or` (disjunctions) can be further combined using `and`. This form is known in Boolean logic as "[Conjunctive Normal Form](https://en.wikipedia.org/wiki/Conjunctive_normal_form)" (CNF). For example:
    - `ratings/all(r: (r le 2 or gt 5) and (r lt 7 or r ge 10))`

<a name="bkmk_complex"></a>

## Rules for filtering complex collections

Lambda expressions over complex collections support a much more flexible syntax than lambda expressions over collections of primitive types. You can use any filter construct inside such a lambda expression that you can use outside one, with only two exceptions.

First, the functions `search.ismatch` and `search.ismatchscoring` aren't supported inside lambda expressions. For more information, see [Understanding OData collection filters in Azure AI Search](search-query-understand-collection-filters.md).

Second, referencing fields that aren't *bound* to the range variable (so-called *free variables*) isn't allowed. For example, consider the following two equivalent OData filter expressions:

1. `stores/any(s: s/amenities/any(a: a eq 'parking')) and details/margin gt 0.5`
1. `stores/any(s: s/amenities/any(a: a eq 'parking' and details/margin gt 0.5))`

The first expression is allowed, while the second form is rejected because `details/margin` isn't bound to the range variable `s`.

This rule also extends to expressions that have variables bound in an outer scope. Such variables are free with respect to the scope in which they appear. For example, the first expression is allowed, while the second equivalent expression isn't allowed because `s/name` is free with respect to the scope of the range variable `a`:

1. `stores/any(s: s/amenities/any(a: a eq 'parking') and s/name ne 'Flagship')`
1. `stores/any(s: s/amenities/any(a: a eq 'parking' and s/name ne 'Flagship'))`

This limitation shouldn't be a problem in practice since it's always possible to construct filters such that lambda expressions contain only bound variables.

## Cheat sheet for collection filter rules

The following table summarizes the rules for constructing valid filters for each collection data type.

[!INCLUDE [Limitations on OData lambda expressions in Azure AI Search](../../includes/search-query-odata-lambda-limitations.md)]

For examples of how to construct valid filters for each case, see [How to write valid collection filters](#bkmk_examples).

If you write filters often, and understanding the rules from first principles would help you more than just memorizing them, see [Understanding OData collection filters in Azure AI Search](search-query-understand-collection-filters.md).

## Next steps  

- [Understanding OData collection filters in Azure AI Search](search-query-understand-collection-filters.md)
- [Filters in Azure AI Search](search-filters.md)
- [OData expression language overview for Azure AI Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure AI Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure AI Search REST API&#41;](/rest/api/searchservice/Search-Documents)
