---
title: OData geo-spatial function reference
titleSuffix: Azure Cognitive Search
description: Syntax and reference documentation for using OData geo-spatial functions, geo.distance and geo.intersects, in Azure Cognitive Search queries.

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
# OData geo-spatial functions in Azure Cognitive Search - `geo.distance` and `geo.intersects`

Azure Cognitive Search supports geo-spatial queries in [OData filter expressions](query-odata-filter-orderby-syntax.md) via the `geo.distance` and `geo.intersects` functions. The `geo.distance` function returns the distance in kilometers between two points, one being a field or range variable, and one being a constant passed as part of the filter. The `geo.intersects` function returns `true` if a given point is within a given polygon, where the point is a field or range variable and the polygon is specified as a constant passed as part of the filter.

The `geo.distance` function can also be used in the [**$orderby** parameter](search-query-odata-orderby.md) to sort search results by distance from a given point. The syntax for `geo.distance` in **$orderby** is the same as it is in **$filter**. When using `geo.distance` in **$orderby**, the field to which it applies must be of type `Edm.GeographyPoint` and it must also be **sortable**.

> [!NOTE]
> When using `geo.distance` in the **$orderby** parameter, the field you pass to the function must contain only a single geo-point. In other words, it must be of type `Edm.GeographyPoint` and not `Collection(Edm.GeographyPoint)`. It is not possible to sort on collection fields in Azure Cognitive Search.

## Syntax

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar of the `geo.distance` and `geo.intersects` functions, as well as the geo-spatial values on which they operate:

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
geo_distance_call ::=
    'geo.distance(' variable ',' geo_point ')'
    | 'geo.distance(' geo_point ',' variable ')'

geo_point ::= "geography'POINT(" lon_lat ")'"

lon_lat ::= float_literal ' ' float_literal

geo_intersects_call ::=
    'geo.intersects(' variable ',' geo_polygon ')'

/* You need at least four points to form a polygon, where the first and
last points are the same. */
geo_polygon ::=
    "geography'POLYGON((" lon_lat ',' lon_lat ',' lon_lat ',' lon_lat_list "))'"

lon_lat_list ::= lon_lat(',' lon_lat)*
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Cognitive Search](https://azuresearch.github.io/odata-syntax-diagram/#geo_distance_call)

> [!NOTE]
> See [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md) for the complete EBNF.

### geo.distance

The `geo.distance` function takes two parameters of type `Edm.GeographyPoint` and returns an `Edm.Double` value that is the distance between them in kilometers. This differs from other services that support OData geo-spatial operations, which typically return distances in meters.

One of the parameters to `geo.distance` must be a geography point constant, and the other must be a field path (or a range variable in the case of a filter iterating over a field of type `Collection(Edm.GeographyPoint)`). The order of these parameters doesn't matter.

The geography point constant is of the form `geography'POINT(<longitude> <latitude>)'`, where the longitude and latitude are numeric constants.

> [!NOTE]
> When using `geo.distance` in a filter, you must compare the distance returned by the function with a constant using `lt`, `le`, `gt`, or `ge`. The operators `eq` and `ne` are not supported when comparing distances. For example, this is a correct usage of `geo.distance`: `$filter=geo.distance(location, geography'POINT(-122.131577 47.678581)') le 5`.

### geo.intersects

The `geo.intersects` function takes a variable of type `Edm.GeographyPoint` and a constant `Edm.GeographyPolygon` and returns an `Edm.Boolean` -- `true` if the point is within the bounds of the polygon, `false` otherwise.

The polygon is a two-dimensional surface stored as a sequence of points defining a bounding ring (see the [examples](#examples) below). The polygon needs to be closed, meaning the first and last point sets must be the same. [Points in a polygon must be in counterclockwise order](https://docs.microsoft.com/rest/api/searchservice/supported-data-types#Anchor_1).

### Geo-spatial queries and polygons spanning the 180th meridian

For many geo-spatial query libraries formulating a query that includes the 180th meridian (near the dateline) is either off-limits or requires a workaround, such as splitting the polygon into two, one on either side of the meridian.

In Azure Cognitive Search, geo-spatial queries that include 180-degree longitude will work as expected if the query shape is rectangular and your coordinates align to a grid layout along longitude and latitude (for example, `geo.intersects(location, geography'POLYGON((179 65, 179 66, -179 66, -179 65, 179 65))'`). Otherwise, for non-rectangular or unaligned shapes, consider the split polygon approach.  

### Geo-spatial functions and `null`

Like all other non-collection fields in Azure Cognitive Search, fields of type `Edm.GeographyPoint` can contain `null` values. When Azure Cognitive Search evaluates `geo.intersects` for a field that is `null`, the result will always be `false`. The behavior of `geo.distance` in this case depends on the context:

- In filters, `geo.distance` of a `null` field results in `null`. This means the document will not match because `null` compared to any non-null value evaluates to `false`.
- When sorting results using **$orderby**, `geo.distance` of a `null` field results in the maximum possible distance. Documents with such a field will sort lower than all others when the sort direction `asc` is used (the default), and higher than all others when the direction is `desc`.

## Examples

### Filter examples

Find all hotels within 10 kilometers of a given reference point (where location is a field of type `Edm.GeographyPoint`):

    geo.distance(location, geography'POINT(-122.131577 47.678581)') le 10

Find all hotels within a given viewport described as a polygon (where location is a field of type `Edm.GeographyPoint`). Note that the polygon is closed (the first and last point sets must be the same) and [the points must be listed in counterclockwise order](https://docs.microsoft.com/rest/api/searchservice/supported-data-types#Anchor_1).

    geo.intersects(location, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))')

### Order-by examples

Sort hotels descending by `rating`, then ascending by distance from the given coordinates:

    rating desc,geo.distance(location, geography'POINT(-122.131577 47.678581)') asc

Sort hotels in descending order by `search.score` and `rating`, and then in ascending order by distance from the given coordinates so that between two hotels with identical ratings, the closest one is listed first:

    search.score() desc,rating desc,geo.distance(location, geography'POINT(-122.131577 47.678581)') asc

## Next steps  

- [Filters in Azure Cognitive Search](search-filters.md)
- [OData expression language overview for Azure Cognitive Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure Cognitive Search REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
