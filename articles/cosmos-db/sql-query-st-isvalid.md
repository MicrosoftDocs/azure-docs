---
title: ST_ISVALID (Azure Cosmos DB)
description: Learn about SQL system function ST_ISVALID in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ST_ISVALID (Azure Cosmos DB)
 Returns a Boolean value indicating whether the specified GeoJSON Point, Polygon, or LineString expression is valid.  
  
## Syntax
  
```  
ST_ISVALID(<spatial_expr>)  
```  
  
## Arguments
  
*spatial_expr*  
   Is any valid GeoJSON Point, Polygon, or LineString expression.  
  
## Return Types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example shows how to check if a point is valid using ST_VALID.  
  
  For example, this point has a latitude value that's not in the valid range of values [-90, 90], so the query returns false.  
  
  For polygons, the GeoJSON specification requires that the last coordinate pair provided should be the same as the first, to create a closed shape. Points within a polygon must be specified in counter-clockwise order. A polygon specified in clockwise order represents the inverse of the region within it.  
  
```  
SELECT ST_ISVALID({ "type": "Point", "coordinates": [31.9, -132.8] }) AS b 
```  
  
 Here is the result set.  
  
```  
[{ "b": false }]  
```  
  

## See Also

- [Spatial functions Azure Cosmos DB](sql-query-spatial-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
