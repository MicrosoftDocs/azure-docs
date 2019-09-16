---
title: INDEX_OF (Azure Cosmos DB)
description: Learn about SQL system function INDEX_OF in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# INDEX_OF (Azure Cosmos DB)
 Returns the starting position of the first occurrence of the second string expression within the first specified string expression, or -1 if the string is not found.  
  
## Syntax
  
```  
INDEX_OF(<str_expr>, <str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is any valid string expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the index of various substrings inside "abc".  
  
```  
SELECT INDEX_OF("abc", "ab") AS i1, INDEX_OF("abc", "b") AS i2, INDEX_OF("abc", "c") AS i3 
```  
  
 Here is the result set.  
  
```  
[{"i1": 0, "i2": 1, "i3": -1}]  
```  
  

## See Also
