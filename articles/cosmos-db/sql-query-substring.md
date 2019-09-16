---
title: SUBSTRING (Azure Cosmos DB)
description: Learn about SQL system function SUBSTRING in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# SUBSTRING (Azure Cosmos DB)
 Returns part of a string expression starting at the specified character zero-based position and continues to the specified length, or to the end of the string.  
  
## Syntax
  
```  
SUBSTRING(<str_expr>, <num_expr>, <num_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.  
  
*num_expr*  
   Is any valid numeric expression to denote the start and end character.    
  
## Return Types
  
  Returns a string expression.  
  
## Examples
  
  The following example returns the substring of "abc" starting at 1 and for a length of 1 character.  
  
```  
SELECT SUBSTRING("abc", 1, 1) AS substring  
```  
  
 Here is the result set.  
  
```  
[{"substring": "b"}]  
```  

## See Also

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
