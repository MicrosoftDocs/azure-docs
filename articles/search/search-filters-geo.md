---
title: Geo-location spatial filters in Azure Search | Microsoft Docs
description: Filter criteria by user security identity, language, geo-location, or numeric values to reduce search results on queries in Azure Search, a hosted cloud search service on Microsoft Azure.
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: search
ms.devlang: 
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 10/10/2017
ms.author: heidist

---

# How to apply geo-location filters in Azure Search 

SEO: spatial search, geo-location

what is it - a polygon
describe the experience

Structure the index/fields
Build and populate the index
Structure the query
  Define polygon   
  URL encoding
Handle result -visual

Geo Intersection returning Points outside of the Polygon

The issue appears to be a combination of errors in URL encoding of the query, and incorrect syntax for the POLYGON literal.

Question
Sign in to vote
0
Sign in to vote
The issue was resolved by url encoding the request, or (if using Fiddler) by replacing spaces with "+".


Data can be from different file types: JPG, PNG, TXT, SEGY (seismic), LAS
Data size (20 TB)
Data transformations

header info has useful metadata -- semistructured data- applicable to facets, filters, sort
possible to derive or infer geo location coordinates if it can be correlated to a map/grid.

How much of the huge file is useful for search??

-   Geospatial functions `geo.distance` and `geo.intersects`. The `geo.distance` function returns the distance in kilometers between two points, one being a field and one being a constant passed as part of the filter. The `geo.intersects` function returns true if a given point is within a given polygon, where the point is a field and the polygon is specified as a constant passed as part of the filter.  

    The polygon is a two-dimensional surface stored as a sequence of points defining a bounding ring (see the example below). The polygon needs to be closed, meaning the first and last point sets must be the same. [Points in a polygon must be in counterclockwise order](https://msdn.microsoft.com/library/azure/dn798938.aspx#Anchor_1).

    Note that `geo.distance` returns distance in kilometers in Azure Search. This differs from other services that support OData geospatial operations, which typically return distances in meters.  



### Geospatial queries and polygons spanning the 180th meridian  
 For many geospatial query libraries formulating a query that includes the 180th meridian (near the dateline) is either off-limits or requires a workaround, such as splitting the polygon into two, one on either side of the meridian.  

 In Azure Search, geospatial queries that include 180-degree longitude will work as expected if the query shape is rectangular and your coordinates align to a grid layout along longitude and latitude (for example, `geo.intersects(location, geography'POLYGON((179 65,179 66,-179 66,-179 65,179 65))'`). Otherwise, for non-rectangular or unaligned shapes, consider the split polygon approach.  

EXAMPLES

This section gathers in one place all of the filter examples related to geo-search in Azure Search documentation.

## portal example

search=*&$count=true&$filter=geo.distance(location,geography'POINT(-122.121513 47.673988)') le 5+

Geospatial search is supported through the edm.GeographyPoint data type2 on a field containing coordinates. Geosearch is a type of filter, specified in Filter OData syntax6.

The example query filters all results for positional data, where results are less than 5 kilometers from a given point (specified as latitude and longitude coordinates). By adding $count, you can see how many results are returned when you change either the distance or the coordinates.

Geospatial search is useful if your search application has a 'find near me' feature or uses map navigation. It is not full text search, however. If you have user requirements for searching on a city or country by name, add fields containing city or country names, in addition to coordinates.

## Filter examples

 Find all hotels within 10 kilometers of a given reference point (where location is a field of type Edm.GeographyPoint):  

```  
$filter=geo.distance(location, geography'POINT(-122.131577 47.678581)') le 10  
```  

 Find all hotels within a given viewport described as a polygon (where location is a field of type Edm.GeographyPoint). Note that the polygon is closed (the first and last point sets must be the same) and [the points must be listed in counterclockwise order](https://msdn.microsoft.com/library/azure/dn798938.aspx#Anchor_1).

```  
$filter=geo.intersects(location, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))')  
```  

## Order-by examples

Sort hotels descending by rating, then ascending by distance from the given co-ordinates:

```
$orderby=rating desc,geo.distance(location, geography'POINT(-122.131577 47.678581)') asc
```

Sort hotels in descending order by search.score and rating, and then in ascending order by distance from the given coordinates so that
between two hotels with identical ratings, the closest one is listed first:

```
$orderby=search.score() desc,rating desc,geo.distance(location, geography'POINT(-122.131577 47.678581)') asc
```


## See also

+ [Filters in Azure Search]()
+ [How full text search works in Azure Search]()
+ [Search Documents REST API]()

