---
title: ATAN in Azure Cosmos DB query language
description: Learn about how the Arctangent (ATAN ) SQL system function in Azure Cosmos DB returns the angle, in radians, whose tangent is the specified numeric expression
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/04/2020
ms.author: girobins
ms.custom: query-reference
---
# ATAN (Azure Cosmos DB)
 Returns the angle, in radians, whose tangent is the specified numeric expression. This is also called arctangent.  
  
## Syntax
  
```sql
ATAN(<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the `ATAN` of the specified value.  
  
```sql
SELECT ATAN(-45.01) AS atan  
```  
  
 Here is the result set.  
  
```json
[{"atan": -1.5485826962062663}]  
```  
  
## Remarks

This system function will not utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
