---
title: ENDSWITH (Azure Cosmos DB)
description: Learn about SQL system function ENDSWITH in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ENDSWITH (Azure Cosmos DB)
 Returns a Boolean indicating whether the first string expression ends with the second.  
  
## Syntax
  
```  
ENDSWITH(<str_expr>, <str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.  
  
## Return Types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example returns the "abc" ends with "b" and "bc".  
  
```  
SELECT ENDSWITH("abc", "b") AS e1, ENDSWITH("abc", "bc") AS e2 
```  
  
 Here is the result set.  
  
```  
[{"e1": false, "e2": true}]  
```  
  

## See Also

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
