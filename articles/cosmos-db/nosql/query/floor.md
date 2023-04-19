---
title: FLOOR in Azure Cosmos DB query language
description: Learn about the FLOOR SQL system function in Azure Cosmos DB to return the largest integer less than or equal to the specified numeric expression
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# FLOOR (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Returns the largest integer less than or equal to the specified numeric expression.  
  
## Syntax
  
```sql
FLOOR (<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example shows positive numeric, negative, and zero values with the `FLOOR` function.  
  
```sql
SELECT FLOOR(123.45) AS fl1, FLOOR(-123.45) AS fl2, FLOOR(0.0) AS fl3  
```  
  
 Here is the result set.  
  
```json
[{fl1: 123, fl2: -124, fl3: 0}]  
```

## Remarks

This system function will benefit from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [Mathematical functions Azure Cosmos DB](mathematical-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
