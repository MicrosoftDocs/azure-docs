---
title: LOWER in Azure Cosmos DB query language
description: Learn about the LOWER SQL system function in Azure Cosmos DB to return a string expression after converting uppercase character data to lowercase
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# LOWER (Azure Cosmos DB)
 Returns a string expression after converting uppercase character data to lowercase.  

The LOWER system function does not utilize the index. If you plan to do frequent case insensitive comparisons, the LOWER system function may consume a significant amount of RU's. If this is the case, instead of using the LOWER system function to normalize data each time for comparisons, you can normalize the casing upon insertion. Then a query such as SELECT * FROM c WHERE LOWER(c.name) = 'bob' simply becomes SELECT * FROM c WHERE c.name = 'bob'.

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

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
