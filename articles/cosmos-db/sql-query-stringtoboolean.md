---
title: StringToBoolean (Azure Cosmos DB)
description: Learn about SQL system function StringToBoolean in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# StringToBoolean (Azure Cosmos DB)
 Returns expression translated to a Boolean. If expression cannot be translated, returns undefined.  
  
## Syntax
  
```  
StringToBoolean(<expr>)  
```  
  
## Arguments
  
*expr*  
   Is any valid scalar expression to be evaluated as a Boolean expression.  
  
## Return Types
  
  Returns a Boolean expression or undefined.  
  
## Examples
  
  The following example shows how StringToBoolean behaves across different types. 
 
 The following are examples with valid input.

Whitespace is allowed only before or after "true"/"false".

```  
SELECT 
    StringToBoolean("true") AS b1, 
    StringToBoolean("    false") AS b2,
    StringToBoolean("false    ") AS b3
```  
  
 Here is the result set.  
  
```  
[{"b1": true, "b2": false, "b3": false}]
```  

The following are examples with invalid input.

 Booleans are case sensitive and must be written with all lowercase characters i.e. "true" and "false".

```  
SELECT 
    StringToBoolean("TRUE"),
    StringToBoolean("False")
```  

Here is the result set.  
  
```  
[{}]
``` 

The expression passed will be parsed as a Boolean expression; these inputs do not evaluate to type Boolean and thus return undefined.

```  
SELECT 
    StringToBoolean("null"),
    StringToBoolean(undefined),
    StringToBoolean(NaN), 
    StringToBoolean(false), 
    StringToBoolean(true)
```  

Here is the result set.  
  
```  
[{}]
```  


## See Also

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
