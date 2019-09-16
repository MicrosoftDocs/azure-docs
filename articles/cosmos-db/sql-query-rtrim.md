---
title: RTRIM (Azure Cosmos DB)
description: Learn about SQL system function RTRIM in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# RTRIM (Azure Cosmos DB)
 Returns a string expression after it removes trailing blanks.  
  
## Syntax
  
```  
RTRIM(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.  
  
## Return Types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use RTRIM inside a query.  
  
```  
SELECT RTRIM("  abc") AS r1, RTRIM("abc") AS r2, RTRIM("abc   ") AS r3  
```  
  
 Here is the result set.  
  
```  
[{"r1": "   abc", "r2": "abc", "r3": "abc"}]  
```  
  

## See Also
