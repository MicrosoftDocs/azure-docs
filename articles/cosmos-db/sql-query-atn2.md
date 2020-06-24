---
title: ATN2 in Azure Cosmos DB query language
description: Learn about how the ATN2 SQL system function in Azure Cosmos DB returns the principal value of the arc tangent of y/x, expressed in radians
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference
---
# ATN2 (Azure Cosmos DB)
 Returns the principal value of the arc tangent of y/x, expressed in radians.  
  
## Syntax
  
```sql
ATN2(<numeric_expr>, <numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example calculates the ATN2 for the specified x and y components.  
  
```sql
SELECT ATN2(35.175643, 129.44) AS atn2  
```  
  
 Here is the result set.  
  
```json
[{"atn2": 1.3054517947300646}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
