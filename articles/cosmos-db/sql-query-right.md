---
title: RIGHT (Azure Cosmos DB)
description: Learn about SQL system function RIGHT in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# RIGHT (Azure Cosmos DB)
 Returns the right part of a string with the specified number of characters.  
  
## Syntax
  
```sql
RIGHT(<str_expr>, <num_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.  
  
*num_expr*  
   Is any valid numeric expression.  
  
## Return Types
  
  Returns a string expression.  
  
## Examples
  
  The following example returns the right part of "abc" for various length values.  
  
```sql
SELECT RIGHT("abc", 1) AS r1, RIGHT("abc", 2) AS r2 
```  
  
 Here is the result set.  
  
```json
[{"r1": "c", "r2": "bc"}]  
```  

## See Also

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
