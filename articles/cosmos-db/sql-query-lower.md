---
title: LOWER in Azure Cosmos DB query language
description: Learn about SQL system function LOWER in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# LOWER (Azure Cosmos DB)
 Returns a string expression after converting uppercase character data to lowercase.  
  
## Syntax
  
```sql
LOWER(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression.  
  
## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use `LOWER` in a query.  
  
```sql
SELECT LOWER("Abc") AS lower
```  
  
 Here is the result set.  
  
```json
[{"lower": "abc"}]  
  
```  

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
