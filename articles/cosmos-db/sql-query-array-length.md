---
title: ARRAY_LENGTH in Azure Cosmos DB query language
description: Learn about how the Array length SQL system function in Azure Cosmos DB returns the number of elements of the specified array expression
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference
---
# ARRAY_LENGTH (Azure Cosmos DB)
 Returns the number of elements of the specified array expression.  
  
## Syntax
  
```sql
ARRAY_LENGTH(<arr_expr>)  
```  
  
## Arguments
  
*arr_expr*  
   Is an array expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example how to get the length of an array using `ARRAY_LENGTH`.  
  
```sql
SELECT ARRAY_LENGTH(["apples", "strawberries", "bananas"]) AS len  
```  
  
 Here is the result set.  
  
```json
[{"len": 3}]  
```  
  
## Remarks

This system function will not utilize the index.

## Next steps

- [Array functions Azure Cosmos DB](sql-query-array-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
