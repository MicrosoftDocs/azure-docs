---
title: UPPER (Azure Cosmos DB)
description: Learn about SQL system function UPPER in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# UPPER (Azure Cosmos DB)
 Returns a string expression after converting lowercase character data to uppercase.  
  
## Syntax
  
```  
UPPER(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.  
  
## Return Types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use UPPER in a query  
  
```  
SELECT UPPER("Abc") AS upper  
```  
  
 Here is the result set.  
  
```  
[{"upper": "ABC"}]  
```


## See Also

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
