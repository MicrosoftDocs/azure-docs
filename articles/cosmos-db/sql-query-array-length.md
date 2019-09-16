---
title: ARRAY_LENGTH (Azure Cosmos DB)
description: Learn about SQL system function ARRAY_LENGTH in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ARRAY_LENGTH (Azure Cosmos DB)
 Returns the number of elements of the specified array expression.  
  
## Syntax
  
```sql
ARRAY_LENGTH(<arr_expr>)  
```  
  
## Arguments
  
*arr_expr*  
   Is any valid array expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example how to get the length of an array using ARRAY_LENGTH.  
  
```sql
SELECT ARRAY_LENGTH(["apples", "strawberries", "bananas"]) AS len  
```  
  
 Here is the result set.  
  
```json
[{"len": 3}]  
```  
  

## See Also

- [Array functions Azure Cosmos DB](sql-query-array-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
