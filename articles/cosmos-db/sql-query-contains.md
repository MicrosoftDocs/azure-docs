---
title: CONTAINS (Azure Cosmos DB)
description: Learn about SQL system function CONTAINS in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# CONTAINS (Azure Cosmos DB)
 Returns a Boolean indicating whether the first string expression contains the second.  
  
## Syntax
  
```  
CONTAINS(<str_expr>, <str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.  
  
## Return Types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks if "abc" contains "ab" and contains "d".  
  
```  
SELECT CONTAINS("abc", "ab") AS c1, CONTAINS("abc", "d") AS c2 
```  
  
 Here is the result set.  
  
```  
[{"c1": true, "c2": false}]  
```  
  

## See Also
