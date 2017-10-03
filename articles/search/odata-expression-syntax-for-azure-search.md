---
title: "OData Expression Syntax for Azure Search"
ms.custom: ""
ms.date: "08/16/2017"
ms.prod: "azure"
ms.reviewer: ""
ms.service: "search"
ms.suite: ""
ms.tgt_pltfrm: ""
ms.topic: "language-reference"
applies_to:
  - "Azure"
ms.assetid: 20217801-f1f7-49e2-badf-0ac356bf8975
caps.latest.revision: 26
author: "Brjohnstmsft"
ms.author: "brjohnst"
manager: "jhubbard"
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
# OData Expression Syntax for Azure Search

Filters are used to reduce the scope of full text search, or to precisely select a subset of documents. Filter construction determines the behavior.

Filters are composed of Odata expressions. Azure Search supports a subset of the OData expression syntax for **$filter** and **$orderby** expressions.  

## Filter syntax

### Operators  

-   Logical operators (and, or, not).  

-   Comparison expressions (`eq, ne, gt, lt, ge, le`). String comparisons are case-sensitive.  

-   Constants of the supported [Entity Data Model](https://docs.microsoft.com/dotnet/framework/data/adonet/entity-data-model) (EDM) types (see [Supported data types &#40;Azure Search&#41;](supported-data-types.md) for a list of supported types). Constants of collection types are not supported.  

-   References to field names. Only `filterable` fields can be used in filter expressions.  

-   `any` with no parameters. This tests whether a field of type `Collection(Edm.String)` contains any elements.  

-   `any` and `all` with limited lambda expression support. 
	
	-	`any/all` are supported on fields of type `Collection(Edm.String)`. 
	
	-	`any` can only be used with simple equality expressions or with a `search.in` function. Simple expressions consist of a comparison between a single field and a literal value, e.g. `Title eq 'Magna Carta'`.
	
	-	`all` can only be used with simple inequality expressions or with a `not search.in`.   

-   Geospatial functions `geo.distance` and `geo.intersects`. The `geo.distance` function returns the distance in kilometers between two points, one being a field and one being a constant passed as part of the filter. The `geo.intersects` function returns true if a given point is within a given polygon, where the point is a field and the polygon is specified as a constant passed as part of the filter.  

    The polygon is a two-dimensional surface stored as a sequence of points defining a bounding ring (see the example below). The polygon needs to be closed, meaning the first and last point sets must be the same. [Points in a polygon must be in counterclockwise order](https://msdn.microsoft.com/library/azure/dn798938.aspx#Anchor_1).

    Note that `geo.distance` returns distance in kilometers in Azure Search. This differs from other services that support OData geospatial operations, which typically return distances in meters.  

-   The `search.in` function tests whether a given string field is equal to one of a given list of values. It can also be used in any or all to compare a single value of a string collection field with a given list of values. Equality between the field and each value in the list is determined in a case-sensitive fashion, the same way as for the `eq` operator. Therefore an expression like `search.in(myfield, 'a, b, c')` is equivalent to `myfield eq 'a' or myfield eq 'b' or myfield eq 'c'`, except that `search.in` will yield much better performance. 

    The first parameter to the `search.in` function is the field reference (or range variable in the case where `search.in` is used inside an any or all expression). The second parameter is a string containing the list of values, separated by spaces and/or commas. If you need to use separators other than spaces and commas because your values include those characters, you can specify an optional third parameter to `search.in`. 
	
	This third parameter is a string where each character of the string, or subset of this string are treated as a separator when parsing the list of values in the second parameter.
	
	Currently the `search.in` function is supported only in api-versions 2016-09-01-Preview and 2015-02-28-Preview.

> [!NOTE]  
>  For the result of the `geo.distance` function only the `lt, le, gt, ge` operators are supported. Operators `eq` and `ne` cannot be used.  

### Geospatial queries and polygons spanning the 180th meridian  
 For many geospatial query libraries formulating a query that includes the 180th meridian (near the dateline) is either off-limits or requires a workaround, such as splitting the polygon into two, one on either side of the meridian.  

 In Azure Search, geospatial queries that include 180-degree longitude will work as expected if the query shape is rectangular and your coordinates align to a grid layout along longitude and latitude (for example, `geo.intersects(location, geography'POLYGON((179 65,179 66,-179 66,-179 65,179 65))'`). Otherwise, for non-rectangular or unaligned shapes, consider the split polygon approach.  

###  <a name="bkmk_unsupported"></a> Unsupported features of OData filters  

-   Arithmetic expressions  

-   Functions (except the distance and intersects geospatial functions)  

-   `any/all` with arbitrary lambda expressions  

###  <a name="bkmk_limits"></a> Filter size limitations  
 There are limits to the size and complexity of filter expressions that you can send to Azure Search. The limits are based roughly on the number of clauses in your filter expression. A good rule of thumb is that if you have hundreds of clauses, you are at risk of running into the limit. We recommend designing your application in such a way that it does not generate filters of unbounded size.  

## Order-by syntax

The **$orderby** parameter accepts a comma-separated list of up to 32 expressions of the form `sort-criteria [asc|desc]`. The sort criteria can either be the name of a `sortable` field or a call to either the `geo.distance` or the `search.score` functions. You can use either `asc` or `desc` to explicitly specify the sort order. The default order is ascending.

If multiple documents have the same sort criteria and `search.score` function is not used (for example, if you sort by a numeric `rating` field and three documents all have a rating of 4), ties will be broken by document score in descending order. When document scores are the same (for example, when there is no full-text search query specified in the request), then the relative ordering of the tied documents is indeterminate.
 
You can specify multiple sort criteria. The order of expressions determines the final sort order. For example, to sort descending by score, followed by rating, the syntax would be `$orderby=search.score() desc,rating desc`.

The syntax for `geo.distance` in **$orderby** is the same as it is in **$filter**. When using `geo.distance` in **$orderby**, the field to which it applies must be of type `Edm.GeographyPoint` and it must also be `sortable`.  

The syntax for `search.score` in **$orderby** is `search.score()`. The function `search.score` does not take any parameters.  

##  <a name="bkmk_examples"></a> OData examples
 For more details on OData expressions and URI conventions, see [OData.org](http://odata.org).  

### Filter examples  

 Find all hotels with a base rate less than $100 that are rated at or above 4:  

```  
$filter=baseRate lt 100.0 and rating ge 4  
```  

 Find all hotels other than "Roach Motel" that have been renovated since 2010:  

```  
$filter=hotelName ne 'Roach Motel' and lastRenovationDate ge 2010-01-01T00:00:00Z  
```  

 Find all hotels with a base rate less than $200 that have been renovated since 2012, with a datetime literal that includes time zone information for Pacific Standard Time:  

```  
$filter=baseRate lt 200 and lastRenovationDate ge 2012-01-01T00:00:00-08:00  
```  

 Find all hotels that have parking included and do not allow smoking:  

```  
$filter=parkingIncluded and not smokingAllowed  
```  

 \- OR -  

```  
$filter=parkingIncluded eq true and smokingAllowed eq false  
```  

 Find all hotels that are Luxury or include parking and have a rating of 5:  

```  
$filter=(category eq 'Luxury' or parkingIncluded eq true) and rating eq 5  
```  

 Find all hotels with the tag "wifi" (where each hotel has tags stored in a Collection(Edm.String) field):  

```  
$filter=tags/any(t: t eq 'wifi')  
```  

 Find all hotels without the tag "motel":  

```  
$filter=tags/all(t: t ne 'motel')  
```  

 Find all hotels with any tags:  

```  
$filter=tags/any()  
```  

 Find all hotels within 10 kilometers of a given reference point (where location is a field of type Edm.GeographyPoint):  

```  
$filter=geo.distance(location, geography'POINT(-122.131577 47.678581)') le 10  
```  

 Find all hotels within a given viewport described as a polygon (where location is a field of type Edm.GeographyPoint). Note that the polygon is closed (the first and last point sets must be the same) and [the points must be listed in counterclockwise order](https://msdn.microsoft.com/library/azure/dn798938.aspx#Anchor_1).

```  
$filter=geo.intersects(location, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))')  
```  

 Find all hotels that either have no value in "description" field, or that value is explicitly set to null:  

```  
$filter=description eq null  
```  

Find all hotels with name equal to either Roach motel' or 'Budget hotel'):  

```  
$filter=search.in(name, 'Roach motel, Budget hotel') 
```

Find all hotels with name equal to either Roach motel' or 'Budget hotel' separated by '|'):  

```  
$filter=search.in(name, 'Roach motel|Budget hotel', '|') 
```

Find all hotels with the tag 'wifi' or 'pool':  

```  
$filter=tags/any(t: search.in(t, 'wifi, pool'))  
```

Find all hotels without the tag 'motel' nor 'cabin':  

```  
$filter=tags/all(t: not search.in(t, 'motel, cabin'))  
```  

### Order-by examples

Sort hotels ascending by base rate:

```
$orderby=baseRate asc
```

Sort hotels descending by rating, then ascending by base rate (remember that ascending is the default):

```
$orderby=rating desc,baseRate
```

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
 [Faceted navigation in Azure Search](https://azure.microsoft.com/documentation/articles/search-faceted-navigation/)  
