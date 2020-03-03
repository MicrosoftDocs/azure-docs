---
title: REVERSE in Azure Cosmos DB query language
description: Learn about SQL system function REVERSE in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# REVERSE (Azure Cosmos DB)
 Returns the reverse order of a string value.  
  
## Syntax
  
```sql
REVERSE(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression.  
  
## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use `REVERSE` in a query.  
  
```sql
SELECT REVERSE("Abc") AS reverse  
```  
  
 Here is the result set.  
  
```json
[{"reverse": "cbA"}]  
```  

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
