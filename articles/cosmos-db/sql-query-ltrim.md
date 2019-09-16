---
title: LTRIM (Azure Cosmos DB)
description: Learn about SQL system function LTRIM in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# LTRIM (Azure Cosmos DB)
 Returns a string expression after it removes leading blanks.  
  
## Syntax
  
```  
LTRIM(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.  
  
## Return Types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use LTRIM inside a query.  
  
```  
SELECT LTRIM("  abc") AS l1, LTRIM("abc") AS l2, LTRIM("abc   ") AS l3 
```  
  
 Here is the result set.  
  
```  
[{"l1": "abc", "l2": "abc", "l3": "abc   "}]  
```  
  

## See Also
