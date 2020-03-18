---
title: UPPER in Azure Cosmos DB query language
description: Learn about SQL system function UPPER in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/04/2020
ms.author: girobins
ms.custom: query-reference
---
# UPPER (Azure Cosmos DB)
 Returns a string expression after converting lowercase character data to uppercase.  

The UPPER system function does not utilize the index. If you plan to do frequent case insensitive comparisons, the UPPER system function may consume a significant amount of RU's. If this is the case, instead of using the UPPER system function to normalize data each time for comparisons, you can normalize the casing upon insertion. Then a query such as SELECT * FROM c WHERE UPPER(c.name) = 'BOB' simply becomes SELECT * FROM c WHERE c.name = 'BOB'.

## Syntax
  
```sql
UPPER(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression.  
  
## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use `UPPER` in a query  
  
```sql
SELECT UPPER("Abc") AS upper  
```  
  
 Here is the result set.  
  
```json
[{"upper": "ABC"}]  
```

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
