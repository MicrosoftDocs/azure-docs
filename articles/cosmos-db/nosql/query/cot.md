---
title: COT in Azure Cosmos DB query language
description: Learn about how the Cotangent(COT) SQL system function in Azure Cosmos DB returns the trigonometric cotangent of the specified angle, in radians, in the specified numeric expression
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# COT (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Returns the trigonometric cotangent of the specified angle, in radians, in the specified numeric expression.  
  
## Syntax
  
```sql
COT(<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example calculates the `COT` of the specified angle.  
  
```sql
SELECT COT(124.1332) AS cot  
```  
  
 Here is the result set.  
  
```json
[{"cot": -0.040311998371148884}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](mathematical-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
