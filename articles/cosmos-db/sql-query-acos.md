---
title: ACOS in Azure Cosmos DB query language
description: Learn about how the ACOS (arccosice) SQL system function in Azure Cosmos DB returns the angle, in radians, whose cosine is the specified numeric expression
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference
---
# ACOS (Azure Cosmos DB)
 Returns the angle, in radians, whose cosine is the specified numeric expression; also called arccosine.  
  
## Syntax
  
```sql
ACOS(<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the `ACOS` of -1.  
  
```sql
SELECT ACOS(-1) AS acos 
```  
  
 Here is the result set.  
  
```json
[{"acos": 3.1415926535897931}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
