---
title: ST_INTERSECTS (Azure Cosmos DB)
description: Learn about SQL system function ST_INTERSECTS in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ST_INTERSECTS (Azure Cosmos DB)
 Returns a Boolean expression indicating whether the GeoJSON object (Point, Polygon, or LineString) specified in the first argument intersects the GeoJSON (Point, Polygon, or LineString) in the second argument.  
  
## Syntax
  
```  
ST_INTERSECTS (<spatial_expr>, <spatial_expr>)  
```  
  
## Arguments
  
*spatial_expr*  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
 
*spatial_expr*  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
  
## Return Types
  
  Returns a Boolean value.  
  
## Examples
  
  The following example shows how to find all areas that intersect with the given polygon.  
  
```  
SELECT a.id
FROM Areas a
WHERE ST_INTERSECTS(a.location, {  
    'type':'Polygon',
    'coordinates': [[[31.8, -5], [32, -5], [32, -4.7], [31.8, -4.7], [31.8, -5]]]  
})  
```  
  
 Here is the result set.  
  
```  
[{ "id": "IntersectingPolygon" }]  
```  
  

## See Also

- [Spatial functions Azure Cosmos DB](sql-query-spatial-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
