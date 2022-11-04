---
title: ACOS in Azure Cosmos DB query language
description: Learn about how the ACOS (arccosine) SQL system function in Azure Cosmos DB returns the angle, in radians, whose cosine is the specified numeric expression
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# ACOS (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

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
  
 Here's the result set.  
  
```json
[{"acos": 3.1415926535897931}]  
```  

## Remarks

This system function won't utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](mathematical-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
