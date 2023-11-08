---
title: OData search.in function reference
titleSuffix: Azure AI Search
description: Syntax and reference documentation for using the search.in function in Azure AI Search queries.

manager: nitinme
author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.topic: reference
ms.date: 09/16/2021
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
# OData `search.in` function in Azure AI Search

A common scenario in [OData filter expressions](query-odata-filter-orderby-syntax.md) is to check whether a single field in each document is equal to one of many possible values. For example, this is how some applications implement [security trimming](search-security-trimming-for-azure-search.md) -- by checking a field containing one or more principal IDs against a list of principal IDs representing the user issuing the query. One way to write a query like this is to use the [`eq`](search-query-odata-comparison-operators.md) and [`or`](search-query-odata-logical-operators.md) operators:

```odata-filter-expr
    group_ids/any(g: g eq '123' or g eq '456' or g eq '789')
```

However, there is a shorter way to write this, using the `search.in` function:

```odata-filter-expr
    group_ids/any(g: search.in(g, '123, 456, 789'))
```

> [!IMPORTANT]
> Besides being shorter and easier to read, using `search.in` also provides [performance benefits](#bkmk_performance) and avoids certain [size limitations of filters](search-query-odata-filter.md#bkmk_limits) when there are hundreds or even thousands of values to include in the filter. For this reason, we strongly recommend using `search.in` instead of a more complex disjunction of equality expressions.

> [!NOTE]
> Version 4.01 of the OData standard has recently introduced the [`in` operator](https://docs.oasis-open.org/odata/odata/v4.01/cs01/part2-url-conventions/odata-v4.01-cs01-part2-url-conventions.html#_Toc505773230), which has similar behavior as the `search.in` function in Azure AI Search. However, Azure AI Search does not support this operator, so you must use the `search.in` function instead.

## Syntax

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar of the `search.in` function:

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
search_in_call ::=
    'search.in(' variable ',' string_literal(',' string_literal)? ')'
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure AI Search](https://azuresearch.github.io/odata-syntax-diagram/#search_in_call)

> [!NOTE]
> See [OData expression syntax reference for Azure AI Search](search-query-odata-syntax-reference.md) for the complete EBNF.

The `search.in` function tests whether a given string field or range variable is equal to one of a given list of values. Equality between the variable and each value in the list is determined in a case-sensitive fashion, the same way as for the `eq` operator. Therefore an expression like `search.in(myfield, 'a, b, c')` is equivalent to `myfield eq 'a' or myfield eq 'b' or myfield eq 'c'`, except that `search.in` will yield much better performance.

There are two overloads of the `search.in` function:

- `search.in(variable, valueList)`
- `search.in(variable, valueList, delimiters)`

The parameters are defined in the following table:

| Parameter name | Type | Description |
| --- | --- | --- |
| `variable` | `Edm.String` | A string field reference (or a range variable over a string collection field in the case where `search.in` is used inside an `any` or `all` expression). |
| `valueList` | `Edm.String` | A string containing a delimited list of values to match against the `variable` parameter. If the `delimiters` parameter is not specified, the default delimiters are space and comma. |
| `delimiters` | `Edm.String` | A string where each character is treated as a separator when parsing the `valueList` parameter. The default value of this parameter is `' ,'` which means that any values with spaces and/or commas between them will be separated. If you need to use separators other than spaces and commas because your values include those characters, you can specify alternate delimiters such as `'|'` in this parameter. |

<a name="bkmk_performance"></a>

### Performance of `search.in`

If you use `search.in`, you can expect sub-second response time when the second parameter contains a list of hundreds or thousands of values. There is no explicit limit on the number of items you can pass to `search.in`, although you are still limited by the maximum request size. However, the latency will grow as the number of values grows.

## Examples

Find all hotels with name equal to either 'Sea View motel' or 'Budget hotel'. Phrases contain spaces, which is a default delimiter. You can specify an alternative delimiter in single quotes as the third string parameter:  

```odata-filter-expr
    search.in(HotelName, 'Sea View motel,Budget hotel', ',')
```

Find all hotels with name equal to either 'Sea View motel' or 'Budget hotel' separated by '|'):

```odata-filter-expr
    search.in(HotelName, 'Sea View motel|Budget hotel', '|')
```

Find all hotels with rooms that have the tag 'wifi' or 'tub':

```odata-filter-expr
    Rooms/any(room: room/Tags/any(tag: search.in(tag, 'wifi, tub')))
```

Find a match on phrases within a collection, such as 'heated towel racks' or 'hairdryer included' in tags.

```odata-filter-expr
    Rooms/any(room: room/Tags/any(tag: search.in(tag, 'heated towel racks,hairdryer included', ','))
```

Find all hotels without the tag 'motel' or 'cabin':

```odata-filter-expr
    Tags/all(tag: not search.in(tag, 'motel, cabin'))
```

## Next steps  

- [Filters in Azure AI Search](search-filters.md)
- [OData expression language overview for Azure AI Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure AI Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure AI Search REST API&#41;](/rest/api/searchservice/Search-Documents)
