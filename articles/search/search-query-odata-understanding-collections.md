---
title: Understanding OData collection filters - Azure Search
description: Understanding how OData collection filters work in Azure Search queries.
ms.date: 05/30/2019
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
# Understanding OData collection filters in Azure Search

To [filter](query-odata-filter-orderby-syntax.md) on collection fields in Azure Search, you can use the [`any` and `all` operators](search-query-odata-collection-operators.md) together with **lambda expressions**. Lambda expressions are just Boolean expressions that refer to a **range variable**. The `any` and `all` operators are analogous to a `for` loop in most programming languages, with the range variable taking the role of loop variable, and the lambda expression as the body of the loop. The range variable takes on the "current" value of the collection during iteration of the loop.

At least that's how it works conceptually. In reality, Azure Search implements filters in a very different way to how `for` loops work. Ideally, this difference would be invisible to you, but in certain situations it is not. This article discusses the limitations that exist on lambda expressions in Azure Search, shows examples of how to avoid them, and explains them in terms of how filters on collections are actually executed.

## Who should read this article

If you've ever encountered error messages like the following while trying to filter on collections in Azure Search, then this article will help you understand why.

| Error message | Situation |
| --- | --- |
| Invalid lambda expression. Complex Boolean expressions are not supported in lambda expressions that iterate over fields of type Collection(Edm.GeographyPoint). For 'any', please join sub-expressions with 'or'; 'and' is not supported. For 'all', please join sub-expressions with 'and'; 'or' is not supported. | Filtering on fields of type `Collection(Edm.String)` or `Collection(Edm.GeographyPoint)` |
| Invalid lambda expression. Found an unsupported form of complex Boolean expression. For 'any', please use expressions that are 'ORs of ANDs', also known as Disjunctive Normal Form. For example: '(a and b) or (c and d)' where a, b, c, and d are comparison or equality sub-expressions. For 'all', please use expressions that are 'ANDs of ORs', also known as Conjunctive Normal Form. For example: '(a or b) and (c or d)' where a, b, c, and d are comparison or inequality sub-expressions. Examples of comparison expressions: 'x gt 5', 'x le 2'. Example of an equality expression: 'x eq 5'. Example of an inequality expression: 'x ne 5'. | Filtering on fields of type `Collection(Edm.DateTimeOffset)`, `Collection(Edm.Double)`, `Collection(Edm.Int32)`, or `Collection(Edm.Int64)` |
| The function 'ismatch' has no parameters bound to the range variable 's'. Only bound field references are supported inside lambda expressions ('any' or 'all'). Please change your filter so that the 'ismatch' function is outside the lambda expression and try again. | Using `search.ismatch` or `search.ismatchscoring` inside a lambda expression |
| Invalid lambda expression. Found a test for equality or inequality where the opposite was expected in a lambda expression that iterates over a field of type Collection(Edm.String). For 'any', please use expressions of the form 'x eq y' or 'search.in(...)'. For 'all', please use expressions of the form 'x ne y', 'not (x eq y)', or 'not search.in(...)'. | Filtering on a field of type `Collection(Edm.String)` |
| Invalid lambda expression. Found an unsupported use of geo.distance() or geo.intersects() in a lambda expression that iterates over a field of type Collection(Edm.GeographyPoint). For 'any', make sure you compare geo.distance() using the 'lt' or 'le' operators and make sure that any usage of geo.intersects() is not negated. For 'all', make sure you compare geo.distance() using the 'gt' or 'ge' operators and make sure that any usage of geo.intersects() is negated. | Filtering on a field of type `Collection(Edm.GeographyPoint)` |
| Invalid lambda expression. Found a comparison operator (one of 'lt', 'le', 'gt', or 'ge'). Only equality operators are allowed in lambda expressions that iterate over fields of type Collection(Edm.String). For 'any', please use expressions of the form 'x eq y'. For 'all', please use expressions of the form 'x ne y' or 'not (x eq y)'. | Filtering on a field of type `Collection(Edm.String)` |

These errors happen when you use a feature of filter expressions that isn't supported inside a lambda expression. Each error gives some guidance on how you can rewrite your filter to avoid the error.

The rest of this article goes into the details of collection filters and how to avoid their limitations.

## Limitations on lambda expressions

Not every feature of filter expressions is available inside the body of a lambda expression. Which features are available differs depending on the data type of the collection field that you want to filter. The following table summarizes the cases for each collection data type.

[!INCLUDE [Limitations on OData lambda expressions in Azure Search](../../includes/search-query-odata-lambda-limitations.md)]

For examples of how to construct valid filters for each case, see [How to write valid collection filters](#bkmk_examples).

If you write a lot of filters, and understanding the rules from first principles would help you more than just memorizing them, see [Understanding collection filter execution](#bkmk_understand).

<a name="bkmk_examples"></a>

## How to write valid collection filters

This section shows by example which filter features are supported when filtering collections and which are not, depending on the data type of the collection.

### Rules for Filtering String Collections

Inside lambda expressions for string collections, the only comparison operators that can be used are `eq` and `ne`.

> [!NOTE]
> Azure Search does not support the `lt`/`le`/`gt`/`ge` operators for strings, whether inside or outside a lambda expression.

The body of an `any` can only test for equality while the body of an `all` can only test for inequality.

It is also possible to combine multiple expressions via `or` in the body of an `any`, and via `and` in the body of an `all`. Since the `search.in` function is equivalent to combining equality checks with `or`, it is also allowed in the body of an `any`. Conversely, `not search.in` is allowed in the body of an `all`.

For example, these expressions are allowed:

- `tags/any(t: t eq 'books')`
- `tags/any(t: search.in(t, 'books, games, toys'))`
- `tags/all(t: t ne 'books')`
- `tags/all(t: not (t eq 'books'))`
- `tags/all(t: not search.in(t, 'books, games, toys'))`
- `tags/any(t: t eq 'books' or t eq 'games')`
- `tags/all(t: t ne 'books' and not (t eq 'games'))`

while these expressions are not allowed:

- `tags/any(t: t ne 'books')`
- `tags/any(t: not search.in(t, 'books, games, toys'))`
- `tags/all(t: t eq 'books')`
- `tags/all(t: search.in(t, 'books, games, toys'))`
- `tags/any(t: t eq 'books' and t ne 'games')`
- `tags/all(t: t ne 'books' or not (t eq 'games'))`

### Rules for Filtering Boolean Collections

The type `Edm.Boolean` supports only the `eq` and `ne` operators. As such, it doesn’t make much sense to allow combining such clauses that check the same range variable with `and`/`or` since that would always lead to tautologies or contradictions.

Here are some examples of filters on Boolean collections that are allowed:

- `flags/any(f: f)`
- `flags/all(f: f)`
- `flags/any(f: f eq true)`
- `flags/any(f: f ne true)`
- `flags/all(f: not f)`
- `flags/all(f: not (f eq true))`

Unlike string collections, Boolean collections have no limits on which operator can be used in which type of lambda expression. Both `eq` and `ne` can be used in the body of `any` or `all`.

Expressions such as the following are not allowed for Boolean collections:

- `flags/any(f: f or not f)`
- `flags/any(f: f or f)`
- `flags/all(f: f and not f)`
- `flags/all(f: f and f eq true)`

### Rules for Filtering GeographyPoint Collections

Values of type `Edm.GeographyPoint` in a collection can’t be compared directly to each other. Instead, they must be used as parameters to the `geo.distance` and `geo.intersects` functions. The `geo.distance` function in turn must be compared to a distance value using one of the comparison operators `lt`, `le`, `gt`, or `ge`. These are the same limitations that exist for non-collection Edm.GeographyPoint fields.

Like string collections, `Edm.GeographyPoint` collections have some rules for how the geo-spatial functions can be used and combined in the different types of lambda expressions:

- Which comparison operators you can use with the `geo.distance` function depends on the type of lambda expression. For `any`, you can use only `lt` or `le`. For `all`, you can use only `gt` or `ge`. You can negate expressions involving `geo.distance`, but this forces you to change the comparison operator (`geo.distance(...) lt x` becomes `not (geo.distance(...) ge x)` and `geo.distance(...) le x` becomes `not (geo.distance(...) gt x)`).
- In the body of an `all`, the `geo.intersects` function must be negated. Conversely, in the body of an `any`, the `geo.intersects` function must not be negated.
- In the body of an `any`, geo-spatial expressions can be combined using `or`. In the body of an `all`, such expressions can be combined using `and`.

The above limitations exist for similar reasons as the equality/inequality limitation on string collections. See [Understanding collection filter execution](#bkmk_understand) for a deeper look at these reasons.

Here are some examples of filters on `Edm.GeographyPoint` collections that are allowed:

- `locations/any(l: geo.distance(l, geography'POINT(-122 49)') lt 10)`
- `locations/any(l: not (geo.distance(l, geography'POINT(-122 49)') ge 10) or geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`
- `locations/all(l: geo.distance(l, geography'POINT(-122 49)') ge 10 and not geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`

Expressions such as the following are not allowed for `Edm.GeographyPoint` collections:

- `locations/any(l: l eq geography'POINT(-122 49)')`
- `locations/any(l: not geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`
- `locations/all(l: geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`
- `locations/any(l: geo.distance(l, geography'POINT(-122 49)') gt 10)`
- `locations/all(l: geo.distance(l, geography'POINT(-122 49)') lt 10)`
- `locations/any(l: geo.distance(l, geography'POINT(-122 49)') lt 10 and geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`
- `locations/all(l: geo.distance(l, geography'POINT(-122 49)') le 10 or not geo.intersects(l, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))`

### Rules for Filtering Comparable Collections

This section applies to all the following data types:

- `Collection(Edm.DateTimeOffset)`
- `Collection(Edm.Double)`
- `Collection(Edm.Int32)`
- `Collection(Edm.Int64)`

Types such as `Edm.Int32` and `Edm.DateTimeOffset` support all six of the comparison operators: `eq`, `ne`, `lt`, `le`, `gt`, and `ge`. Lambda expressions over collections of these types can contain simple expressions using any of these operators, regardless of the type of lambda expression. For example, these filters are allowed:

- `ratings/any(r: r ne 5)`
- `dates/any(d: d gt 2017-08-24T00:00:00Z)`
- `not margins/all(m: m eq 3.5)`

However, there are limitations on how such comparison expressions can be combined into more complex expressions inside a lambda expression:

- Rules for `any`:
  - Simple inequality expressions cannot be usefully combined with any other expressions. For example, this is allowed:
    - `ratings/any(r: r ne 5)`

    but this is not:
    - `ratings/any(r: r ne 5 and r gt 2)`

    and while this is allowed, it is not useful because the conditions overlap:
    - `ratings/any(r: r ne 5 or r gt 7)`
  - Simple comparison expressions involving `eq`, `lt`, `le`, `gt`, or `ge` can be combined with `and`/`or`. For example:
    - `ratings/any(r: r gt 2 and r le 5)`
    - `ratings/any(r: r le 5 or r gt 7)`
  - Comparison expressions combined with `and` (conjunctions) can be further combined using `or`. This is known in Boolean logic as “[Disjunctive Normal Form](https://en.wikipedia.org/wiki/Disjunctive_normal_form)” or DNF. For example:
    - `ratings/any(r: (r gt 2 and r le 5) or (r gt 7 and r lt 10))`
- Rules for `all`:
  - Simple equality expressions cannot be usefully combined with any other expressions. For example, this is allowed:
    - `ratings/all(r: r eq 5)`

    but this is not:
    - `ratings/all(r: r eq 5 or r le 2)`

    and while this is allowed, it is not useful because the conditions overlap:
    - `ratings/all(r: r eq 5 and r le 7)`
  - Simple comparison expressions involving `ne`, `lt`, `le`, `gt`, or `ge` can be combined with `and`/`or`. For example:
    - `ratings/all(r: r gt 2 and r le 5)`
    - `ratings/all(r: r le 5 or r gt 7)`
  - Comparison expressions combined with `or` (disjunctions) can be further combined using `and`. This is known in Boolean logic as “[Conjunctive Normal Form]( https://en.wikipedia.org/wiki/Conjunctive_normal_form)” or CNF. For example:
    - `ratings/all(r: (r le 2 or gt 5) and (r lt 7 or r ge 10))`

### Filtering on Complex Collections

Lambda expressions over complex collections support a much more flexible syntax than lambda expressions over collections of primitive types. Every filter construct that is allowed outside of a lambda expression is allowed inside a complex collection lambda expression, with only two exceptions.

First, the `search.ismatch` and `search.ismatchscoring` functions are not supported inside lambda expressions. The reason for this is explained in [Understanding collection filter execution]( #bkmk_understand).

Second, referencing fields that aren't *bound* to the range variable (so-called *free variables*) is not allowed. For example, consider the following two equivalent OData filter expressions:

1. `stores/any(s: s/amenities/any(a: a eq 'parking')) and details/margin gt 0.5`
1. `stores/any(s: s/amenities/any(a: a eq 'parking' and details/margin gt 0.5))`

The first expression will be allowed, while the second form will be rejected because `details/margin` is not bound to the range variable `s`.

This also extends to expressions that have variables bound in an outer scope. Such variables are free with respect to the scope in which they appear. For example, the first of these expressions is allowed, while the second equivalent expression is not allowed because `s/name` is free with respect to the scope of the range variable `a`:

1. `stores/any(s: s/amenities/any(a: a eq 'parking') and s/name ne 'Flagship')`
1. `stores/any(s: s/amenities/any(a: a eq 'parking' and s/name ne 'Flagship'))`

This limitation should not be a problem in practice since it is always possible to construct filters such that lambda expressions contain only bound variables.

<a name="bkmk_understand"></a>

## Understanding collection filter execution

There are three underlying reasons why not all filter features are supported for all types of collections:

1. Only certain operators are supported for certain data types. For example, it doesn't make sense to compare the Boolean values `true` and `false` using `lt`, `gt`, and so on.
1. Azure Search does not support **correlated search** on fields of type `Collection(Edm.ComplexType)`.
1. Azure Search uses inverted indexes to execute filters.

The first reason is just a consequence of how the OData language and EDM type system is defined. The last two require further explanation.

### Correlated search

When filtering collections of complex objects, "**correlated**" describes the behavior of applying multiple filter criteria to *each object in the collection*. Filter criteria in Azure Search are correlated, but full-text search is not. For example, the following filter will return hotels that have at least one deluxe room with a rate less than 100:

    Rooms/any(room: room/Type eq 'Deluxe Room' and room/BaseRate lt 100)

If filtering were *uncorrelated*, the above filter might return hotels where one room is deluxe and a different room has a base rate less than 100. This wouldn't make sense, since both clauses of the lambda expression apply to the same range variable, namely `room`.

However, for full-text search, there is no way to refer to a specific range variable. If you use fielded search to issue a [full Lucene query](query-lucene-syntax.md) like the following:

    Rooms/Type:deluxe AND Rooms/Description:"city view"

you may get hotels back where one room is deluxe, and a different room mentions "city view" in the description. This is because `Rooms/Type` refers to all the analyzed terms of the `Rooms/Type` field field across all documents, and similarly for `Rooms/Description`. So unlike the filter above, which basically says "match documents where a room has `Type` equal to 'Deluxe Room' and **that same room** has `BaseRate` less than 100", the search query says "match documents where `Rooms/Type` has the term "deluxe" and `Rooms/Description` has the phrase "city view". There is no concept of individual rooms whose fields can be correlated in the latter case. This is because searchable fields in Azure Search are stored as collections of terms without an explicit link to the individual "sub-documents" of complex collections.

> [!NOTE]
> If you would like to see support for correlated search added to Azure Search, please vote for [this User Voice item](https://feedback.azure.com/forums/263029-azure-search/suggestions/37735060-support-correlated-search-on-complex-collections).

### Inverted indexes and collections

You may have noticed that there are far fewer restrictions on lambda expressions over complex collections than there are for simple collections like `Collection(Edm.Int32)`, `Collection(Edm.GeographyPoint)`, and so on. This is because Azure Search stores complex collections as actual collections of sub-documents, whereas simple collections aren't really stored as collections at all.

For example, consider a filterable string collection field like `seasons` in an index for an online retailer. Some documents uploaded to this index might look like this:

```json
{
  "value": [
    {
      "id": "1",
      "name": "Hiking boots",
      "seasons": ["spring", "summer", "fall"]
    },
    {
      "id": "2",
      "name": "Rain jacket",
      "seasons": ["spring", "fall", "winter"]
    },
    {
      "id": "3",
      "name": "Parka",
      "seasons": ["winter"]
    }
  ]
}
```

The values of the `seasons` field are stored in a structure called an **inverted index**, which looks something like this:

| Term | Document IDs |
| --- | --- |
| spring | 1, 2 |
| summer | 1 |
| fall | 1, 2 |
| winter | 2, 3 |

This data structure is designed to answer one question with great speed: In which documents does a given term appear? Expressed as a filter, this is more like a plain equality check than a loop over a collection. In fact, this is why for string collections, Azure Search only allows `eq` as a comparison operator inside a lambda expression for `any`.

This is related to the fact that only `or` is supported as a logical operator in `any`. It's because, thanks to algebra and [the distributive property of quantifiers](https://en.wikipedia.org/wiki/Existential_quantification#Negation), this:

    seasons/any(s: s eq 'winter' or s eq 'fall')

is equivalent to this:

    seasons/any(s: s eq 'winter') or seasons/any(s: s eq 'fall')

and each of the two `any` sub-expressions can be efficiently executed using the inverted index. Also, thanks to [the negation law of quantifiers](https://en.wikipedia.org/wiki/Existential_quantification#Negation), this:

    seasons/all(s: s ne 'winter' and s ne 'fall')

is equivalent to:

    not seasons/any(s: s eq 'winter' or s eq 'fall')

which is why it's possible to use `all` with `ne` and `and`.

> [!NOTE]
> Although the details are beyond the scope of this document, these same principles extend to [distance and intersection tests for collections of geo-spatial points](search-query-odata-geo-spatial-functions.md) as well. This is why, in `any`:
>
> - `geo.intersects` cannot be negated
> - `geo.distance` must be compared using `lt` or `le`
> - expressions must be combined with `or`, not `and`
>
> The converse rules apply for `all`.

A wider variety of expressions are allowed when filtering on collections of data types that support the `lt`, `gt`, `le`, and `ge` operators, such as `Collection(Edm.Int32)` for example. Specifically, you can use `and` as well as `or` in `any`, as long as the underlying comparison expressions are combined into **range comparisons** using `and`, which are then further combined using `or`. This structure of Boolean expressions is called [Disjunctive Normal Form (DNF)](https://en.wikipedia.org/wiki/Disjunctive_normal_form), otherwise known as "ORs of ANDs". Conversely, lambda expressions for `all` for these data types must be in [Conjunctive Normal Form (CNF)](https://en.wikipedia.org/wiki/Conjunctive_normal_form), otherwise known as "ANDs of ORs". This works because Azure Search can execute range comparisons using inverted indexes efficiently, just like it can do fast term lookup for strings.

In summary, here are the rules of thumb for what's allowed in a lambda expression:

- Inside `any`, *positive checks* are always allowed, like equality, range comparisons, `geo.intersects`, or `geo.distance` compared with `lt` or `le` (think of "closeness" as being like equality when it comes to checking distance).
- Inside `any`, `or` is always allowed. You can use `and` only for data types that can express range checks, and only if you use ORs of ANDs (DNF).
- Inside `all`, the rules are reversed -- only *negative checks* are allowed, you can use `and` always, and you can use `or` only for range checks expressed as ANDs of ORs (CNF).

In practice, the above are the types of filters you will probably want to use anyway, but it's still helpful to understand the boundaries of what's possible.

For specific examples of which kinds of filters are allowed and which aren't, see [How to write valid collection filters](#bkmk_examples).

## See also  

- [Filters in Azure Search](search-filters.md)
- [OData expression language overview for Azure Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
