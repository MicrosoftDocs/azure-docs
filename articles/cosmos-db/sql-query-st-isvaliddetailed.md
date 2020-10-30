---
title: ST_ISVALIDDETAILED in Azure Cosmos DB query language
description: Learn about SQL system function ST_ISVALIDDETAILED in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# ST_ISVALIDDETAILED (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

 Returns a JSON value containing a Boolean value if the specified GeoJSON Point, Polygon, or LineString expression is valid, and if invalid, additionally the reason as a string value.  
  
## Syntax
  
```sql
ST_ISVALIDDETAILED(<spatial_expr>)  
```  
  
## Arguments
  
*spatial_expr*  
   Is a GeoJSON point or polygon expression.  
  
## Return types
  
  Returns a JSON value containing a Boolean value if the specified GeoJSON point or polygon expression is valid, and if invalid, additionally the reason as a string value.  
  
## Examples
  
  The following example how to check validity (with details) using `ST_ISVALIDDETAILED`.  
  
```sql
SELECT ST_ISVALIDDETAILED({   
  "type": "Polygon",   
  "coordinates": [[ [ 31.8, -5 ], [ 31.8, -4.7 ], [ 32, -4.7 ], [ 32, -5 ] ]]  
}) AS b 
```  
  
 Here is the result set.  
  
```json
[{  
  "b": {
    "valid": false,
    "reason": "The Polygon input is not valid because the start and end points of the ring number 1 are not the same. Each ring of a polygon must have the same start and end points."   
  }  
}]  
```  

## Next steps

- [Spatial functions Azure Cosmos DB](sql-query-spatial-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
