---
title: ATAN in Azure Cosmos DB query language
description: Learn about how the ATAN (arctangent) SQL system function in Azure Cosmos DB returns the angle, in radians, whose tangent is the specified numeric expression
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 03/04/2020
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# ATAN (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Returns the angle, in radians, whose tangent is the specified numeric expression. This value is also called arctangent.  
  
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
  
 Here's the result set.  
  
```json
[{"atan": -1.5485826962062663}]  
```  
  
## Remarks

This system function won't utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](mathematical-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
