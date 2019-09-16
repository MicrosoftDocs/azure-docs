---
title: CONCAT (Azure Cosmos DB)
description: Learn about SQL system function CONCAT in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# CONCAT (Azure Cosmos DB)
 Returns a string that is the result of concatenating two or more string values.  
  
## Syntax
  
```sql
CONCAT(<str_expr>, <str_expr> [, <str_expr>])  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.  
  
## Return Types
  
  Returns a string expression.  
  
## Examples
  
  The following example returns the concatenated string of the specified values.  
  
```sql
SELECT CONCAT("abc", "def") AS concat  
```  
  
 Here is the result set.  
  
```json
[{"concat": "abcdef"}  
```  
  

## See Also

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
