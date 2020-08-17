---
title: CEILING in Azure Cosmos DB query language
description: Learn about how the CEILING SQL system function in Azure Cosmos DB returns the smallest integer value greater than, or equal to, the specified numeric expression.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# CEILING (Azure Cosmos DB)
 Returns the smallest integer value greater than, or equal to, the specified numeric expression.  
  
## Syntax
  
```sql
CEILING (<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example shows positive numeric, negative, and zero values with the `CEILING` function.  
  
```sql
SELECT CEILING(123.45) AS c1, CEILING(-123.45) AS c2, CEILING(0.0) AS c3  
```  
  
 Here is the result set.  
  
```json
[{c1: 124, c2: -123, c3: 0}]  
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
