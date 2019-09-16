---
title: STARTSWITH (Azure Cosmos DB)
description: Learn about SQL system function STARTSWITH in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# STARTSWITH (Azure Cosmos DB)
 Returns a Boolean indicating whether the first string expression starts with the second.  
  
## Syntax
  
```  
STARTSWITH(<str_expr>, <str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.
  
## Return Types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks if the string "abc" begins with "b" and "a".  
  
```  
SELECT STARTSWITH("abc", "b") AS s1, STARTSWITH("abc", "a") AS s2  
```  
  
 Here is the result set.  
  
```  
[{"s1": false, "s2": true}]  
```  

## See Also
