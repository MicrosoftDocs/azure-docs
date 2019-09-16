---
title: ST_DISTANCE (Azure Cosmos DB)
description: Learn about SQL system function ST_DISTANCE in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ST_DISTANCE (Azure Cosmos DB)
 Returns the distance between the two GeoJSON Point, Polygon, or LineString expressions.  
  
## Syntax
  
```  
ST_DISTANCE (<spatial_expr>, <spatial_expr>)  
```  
  
## Arguments
  
*spatial_expr*  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
  
## Return Types
  
  Returns a numeric expression containing the distance. This is expressed in meters for the default reference system.  
  
## Examples
  
  The following example shows how to return all family documents that are within 30 km of the specified location using the ST_DISTANCE built-in function. .  
  
```  
SELECT f.id   
FROM Families f   
WHERE ST_DISTANCE(f.location, {'type': 'Point', 'coordinates':[31.9, -4.8]}) < 30000  
```  
  
 Here is the result set.  
  
```  
[{  
  "id": "WakefieldFamily"  
}]  
```  
  

## See Also
