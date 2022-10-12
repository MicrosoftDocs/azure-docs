---
title: ARRAY_CONCAT in Azure Cosmos DB query language
description: Learn about how the Array Concat SQL system function in Azure Cosmos DB returns an array that is the result of concatenating two or more array values
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# ARRAY_CONCAT (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Returns an array that is the result of concatenating two or more array values.  
  
## Syntax
  
```sql
ARRAY_CONCAT (<arr_expr1>, <arr_expr2> [, <arr_exprN>])  
```  
  
## Arguments
  
*arr_expr*  
   Is an array expression to concatenate to the other values. The `ARRAY_CONCAT` function requires at least two *arr_expr* arguments.  
  
## Return types
  
  Returns an array expression.  
  
## Examples
  
  The following example how to concatenate two arrays.  
  
```sql
SELECT ARRAY_CONCAT(["apples", "strawberries"], ["bananas"]) AS arrayConcat 
```  
  
 Here is the result set.  
  
```json
[{"arrayConcat": ["apples", "strawberries", "bananas"]}]  
```  
  
## Remarks

This system function will not utilize the index.

## Next steps

- [Array functions Azure Cosmos DB](array-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
