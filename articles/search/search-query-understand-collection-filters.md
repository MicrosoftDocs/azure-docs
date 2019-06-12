---
title: Understanding OData collection filters - Azure Search
description: Understanding how OData collection filters work in Azure Search queries.
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
# Understanding OData collection filters in Azure Search

To [filter](query-odata-filter-orderby-syntax.md) on collection fields in Azure Search, you can use the [`any` and `all` operators](search-query-odata-collection-operators.md) together with **lambda expressions**. Lambda expressions are Boolean expressions that refer to a **range variable**. The `any` and `all` operators are analogous to a `for` loop in most programming languages, with the range variable taking the role of loop variable, and the lambda expression as the body of the loop. The range variable takes on the "current" value of the collection during iteration of the loop.

At least that's how it works conceptually. In reality, Azure Search implements filters in a very different way to how `for` loops work. Ideally, this difference would be invisible to you, but in certain situations it isn't. The end result is that there are rules you have to follow when writing lambda expressions.

This article explains why the rules for collection filters exist by exploring how Azure Search executes these filters. If you're writing advanced filters with complex lambda expressions, you may find this article helpful in building your understanding of what's possible in filters and why.

For information on what the rules for collection filters are, including examples, see [Troubleshooting OData collection filters in Azure Search](search-query-troubleshoot-collection-filters.md).

## Why collection filters are limited

There are three underlying reasons why not all filter features are supported for all types of collections:

1. Only certain operators are supported for certain data types. For example, it doesn't make sense to compare the Boolean values `true` and `false` using `lt`, `gt`, and so on.
1. Azure Search doesn't support **correlated search** on fields of type `Collection(Edm.ComplexType)`.
1. Azure Search uses inverted indexes to execute filters over all types of data, including collections.

The first reason is just a consequence of how the OData language and EDM type system are defined. The last two are explained in more detail in the rest of this article.

## Correlated versus uncorrelated search

When applying multiple filter criteria over a collection of complex objects, the criteria are **correlated** since they apply to *each object in the collection*. For example, the following filter will return hotels that have at least one deluxe room with a rate less than 100:

    Rooms/any(room: room/Type eq 'Deluxe Room' and room/BaseRate lt 100)

If filtering was *uncorrelated*, the above filter might return hotels where one room is deluxe and a different room has a base rate less than 100. That wouldn't make sense, since both clauses of the lambda expression apply to the same range variable, namely `room`. This is why such filters are correlated.

However, for full-text search, there's no way to refer to a specific range variable. If you use fielded search to issue a [full Lucene query](query-lucene-syntax.md) like this one:

    Rooms/Type:deluxe AND Rooms/Description:"city view"

you may get hotels back where one room is deluxe, and a different room mentions "city view" in the description. For example, the document below with `Id` of `1` would match the query:

```json
{
  "value": [
    {
      "Id": "1",
      "Rooms": [
        { "Type": "deluxe", "Description": "Large garden view suite" },
        { "Type": "standard", "Description": "Standard city view room" }
      ]
    },
    {
      "Id": "2",
      "Rooms": [
        { "Type": "deluxe", "Description": "Courtyard motel room" }
      ]
    }
  ]
}
```

The reason is that `Rooms/Type` refers to all the analyzed terms of the `Rooms/Type` field in the entire document, and similarly for `Rooms/Description`, as shown in the tables below.

How `Rooms/Type` is stored for full-text search:

| Term in `Rooms/Type` | Document IDs |
| --- | --- |
| deluxe | 1, 2 |
| standard | 1 |

How `Rooms/Description` is stored for full-text search:

| Term in `Rooms/Description` | Document IDs |
| --- | --- |
| courtyard | 2 |
| city | 1 |
| garden | 1 |
| large | 1 |
| motel | 2 |
| room | 1, 2 |
| standard | 1 |
| suite | 1 |
| view | 1 |

So unlike the filter above, which basically says "match documents where a room has `Type` equal to 'Deluxe Room' and **that same room** has `BaseRate` less than 100", the search query says "match documents where `Rooms/Type` has the term "deluxe" and `Rooms/Description` has the phrase "city view". There's no concept of individual rooms whose fields can be correlated in the latter case.

> [!NOTE]
> If you would like to see support for correlated search added to Azure Search, please vote for [this User Voice item](https://feedback.azure.com/forums/263029-azure-search/suggestions/37735060-support-correlated-search-on-complex-collections).

## Inverted indexes and collections

You may have noticed that there are far fewer restrictions on lambda expressions over complex collections than there are for simple collections like `Collection(Edm.Int32)`, `Collection(Edm.GeographyPoint)`, and so on. This is because Azure Search stores complex collections as actual collections of sub-documents, while simple collections aren't stored as collections at all.

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

This data structure is designed to answer one question with great speed: In which documents does a given term appear? Answering this question works more like a plain equality check than a loop over a collection. In fact, this is why for string collections, Azure Search only allows `eq` as a comparison operator inside a lambda expression for `any`.

Building up from equality, next we'll look at how it's possible to combine multiple equality checks on the same range variable with `or`. It works thanks to algebra and [the distributive property of quantifiers](https://en.wikipedia.org/wiki/Existential_quantification#Negation). This expression:

    seasons/any(s: s eq 'winter' or s eq 'fall')

is equivalent to:

    seasons/any(s: s eq 'winter') or seasons/any(s: s eq 'fall')

and each of the two `any` sub-expressions can be efficiently executed using the inverted index. Also, thanks to [the negation law of quantifiers](https://en.wikipedia.org/wiki/Existential_quantification#Negation), this expression:

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

A wider variety of expressions are allowed when filtering on collections of data types that support the `lt`, `gt`, `le`, and `ge` operators, such as `Collection(Edm.Int32)` for example. Specifically, you can use `and` as well as `or` in `any`, as long as the underlying comparison expressions are combined into **range comparisons** using `and`, which are then further combined using `or`. This structure of Boolean expressions is called [Disjunctive Normal Form (DNF)](https://en.wikipedia.org/wiki/Disjunctive_normal_form), otherwise known as "ORs of ANDs". Conversely, lambda expressions for `all` for these data types must be in [Conjunctive Normal Form (CNF)](https://en.wikipedia.org/wiki/Conjunctive_normal_form), otherwise known as "ANDs of ORs". Azure Search allows such range comparisons because it can execute them using inverted indexes efficiently, just like it can do fast term lookup for strings.

In summary, here are the rules of thumb for what's allowed in a lambda expression:

- Inside `any`, *positive checks* are always allowed, like equality, range comparisons, `geo.intersects`, or `geo.distance` compared with `lt` or `le` (think of "closeness" as being like equality when it comes to checking distance).
- Inside `any`, `or` is always allowed. You can use `and` only for data types that can express range checks, and only if you use ORs of ANDs (DNF).
- Inside `all`, the rules are reversed -- only *negative checks* are allowed, you can use `and` always, and you can use `or` only for range checks expressed as ANDs of ORs (CNF).

In practice, these are the types of filters you're most likely to use anyway. It's still helpful to understand the boundaries of what's possible though.

For specific examples of which kinds of filters are allowed and which aren't, see [How to write valid collection filters](search-query-troubleshoot-collection-filters.md#bkmk_examples).

## Next steps  

- [Troubleshooting OData collection filters in Azure Search](search-query-troubleshoot-collection-filters.md)
- [Filters in Azure Search](search-filters.md)
- [OData expression language overview for Azure Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
