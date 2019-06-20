---
title: OData select reference - Azure Search
description: OData language reference for select syntax in Azure Search queries.
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
# OData $select syntax in Azure Search

 You can use the [OData **$select** parameter](query-odata-filter-orderby-syntax.md) to choose which fields to include in search results from Azure Search. This article describes the syntax of **$select** in detail. For more general information about how to use **$select** when presenting search results, see [How to work with search results in Azure Search](search-pagination-page-layout.md).

## Syntax

The **$select** parameter determines which fields for each document are returned in the query result set. The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar for the **$select** parameter:

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
select_expression ::= '*' | field_path(',' field_path)*

field_path ::= identifier('/'identifier)*
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#select_expression)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

The **$select** parameter comes in two forms:

1. A single star (`*`), indicating that all retrievable fields should be returned, or
1. A comma-separated list of field paths, identifying which fields should be returned.

When using the second form, you may only specify retrievable fields in the list.

If you list a complex field without specifying its sub-fields explicitly, all retrievable sub-fields will be included in the query result set. For example, assume your index has an `Address` field with `Street`, `City`, and `Country` sub-fields that are all retrievable. If you specify `Address` in **$select**, the query results will include all three sub-fields.

## Examples

Include the `HotelId`, `HotelName`, and `Rating` top-level fields in the results, as well as the `City` sub-field of `Address`:

    $select=HotelId, HotelName, Rating, Address/City

An example result might look like this:

```json
{
  "HotelId": "1",
  "HotelName": "Secret Point Motel",
  "Rating": 4,
  "Address": {
    "City": "New York"
  }
}
```

Include the `HotelName` top-level field in the results, as well as all sub-fields of `Address`, and the `Type` and `BaseRate` sub-fields of each object in the `Rooms` collection:

    $select=HotelName, Address, Rooms/Type, Rooms/BaseRate

An example result might look like this:

```json
{
  "HotelName": "Secret Point Motel",
  "Rating": 4,
  "Address": {
    "StreetAddress": "677 5th Ave",
    "City": "New York",
    "StateProvince": "NY",
    "Country": "USA",
    "PostalCode": "10022"
  },
  "Rooms": [
    {
      "Type": "Budget Room",
      "BaseRate": 9.69
    },
    {
      "Type": "Budget Room",
      "BaseRate": 8.09
    }
  ]
}
```

## Next steps  

- [How to work with search results in Azure Search](search-pagination-page-layout.md)
- [OData expression language overview for Azure Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
