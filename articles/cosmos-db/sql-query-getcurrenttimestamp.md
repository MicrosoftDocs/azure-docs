---
title: GETCURRENTTIMESTAMP (Azure Cosmos DB)
description: Learn about SQL system function GETCURRENTTIMESTAMP in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# GETCURRENTTIMESTAMP (Azure Cosmos DB)
 Returns the number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970. 
  
## Syntax
  
```  
GETCURRENTTIMESTAMP ()  
```  
  
## Return Types
  
  Returns a numeric value, the current number of milliseconds that have elapsed since the Unix epoch i.e. the number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970.

## Remarks

  GETCURRENTTIMESTAMP is a nondeterministic function.
  
  The result returned is UTC (Coordinated Universal Time).

## Examples
  
  The following example shows how to get the current timestamp using the GetCurrentTimestamp built-in function.
  
```  
SELECT GETCURRENTTIMESTAMP() AS currentUtcTimestamp
```  
  
 Here is an example result set.
  
```  
[{
  "currentUtcTimestamp": 1556916469065
}]  
```


## See Also
