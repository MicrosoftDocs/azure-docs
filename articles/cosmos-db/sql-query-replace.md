---
title: REPLACE in Azure Cosmos DB query language
description: Learn about SQL system function REPLACE in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# REPLACE (Azure Cosmos DB)
 Replaces all occurrences of a specified string value with another string value.  
  
## Syntax
  
```sql
REPLACE(<str_expr1>, <str_expr2>, <str_expr3>)  
```  
  
## Arguments
  
*str_expr1*  
   Is the string expression to be searched.  
  
*str_expr2*  
   Is the string expression to be found.  
  
*str_expr3*  
   Is the string expression to replace occurrences of *str_expr2* in *str_expr1*.  
  
## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use `REPLACE` in a query.  
  
```sql
SELECT REPLACE("This is a Test", "Test", "desk") AS replace
```  
  
 Here is the result set.  
  
```json
[{"replace": "This is a desk"}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
