---
title: GETCURRENTDATETIME (Azure Cosmos DB)
description: Learn about SQL system function GETCURRENTDATETIME in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# GETCURRENTDATETIME (Azure Cosmos DB)
 Returns the current UTC date and time as an ISO 8601 string.
  
## Syntax
  
```
GETCURRENTDATETIME ()
```
  
## Return Types
  
  Returns the current UTC date and time ISO 8601 string value. 

  This is expressed in the format YYYY-MM-DDThh:mm:ss.sssZ where:
  
  |||
  |-|-|
  |YYYY|four-digit year|
  |MM|two-digit month (01 = January, etc.)|
  |DD|two-digit day of month (01 through 31)|
  |T|signifier for beginning of time elements|
  |hh|two digit hour (00 through 23)|
  |mm|two digit minutes (00 through 59)|
  |ss|two digit seconds (00 through 59)|
  |.sss|three digits of decimal fractions of a second|
  |Z|UTC (Coordinated Universal Time) designator||
  
  For more details on the ISO 8601 format, see [ISO_8601](https://en.wikipedia.org/wiki/ISO_8601)

## Remarks

  GETCURRENTDATETIME is a nondeterministic function. 
  
  The result returned is UTC (Coordinated Universal Time).

## Examples
  
  The following example shows how to get the current UTC Date Time using the GetCurrentDateTime built-in function.
  
```  
SELECT GETCURRENTDATETIME() AS currentUtcDateTime
```  
  
 Here is an example result set.
  
```  
[{
  "currentUtcDateTime": "2019-05-03T20:36:17.784Z"
}]  
```  


## See Also
