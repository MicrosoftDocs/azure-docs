---
title: LOWER (Azure Cosmos DB)
description: Learn about SQL system function LOWER in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# LOWER (Azure Cosmos DB)
 Returns a string expression after converting uppercase character data to lowercase.  
  
## Syntax
  
```  
LOWER(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.  
  
## Return Types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use LOWER in a query.  
  
```  
SELECT LOWER("Abc") AS lower
```  
  
 Here is the result set.  
  
```  
[{"lower": "abc"}]  
  
```  
  

## See Also
