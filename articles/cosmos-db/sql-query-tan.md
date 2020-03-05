---
title: TAN in Azure Cosmos DB query language
description: Learn about SQL system function TAN in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/04/2020
ms.author: girobins
ms.custom: query-reference
---
# TAN (Azure Cosmos DB)
 Returns the tangent of the specified angle, in radians, in the specified expression.  
  
## Syntax
  
```sql
TAN (<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example calculates the tangent of PI()/2.  
  
```sql
SELECT TAN(PI()/2) AS tan 
```  
  
 Here is the result set.  
  
```json
[{"tan": 16331239353195370 }]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
