---
title: StringToArray (Azure Cosmos DB)
description: Learn about SQL system function StringToArray in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# StringToArray (Azure Cosmos DB)
 Returns expression translated to an Array. If expression cannot be translated, returns undefined.  
  
## Syntax
  
```sql  
StringToArray(<expr>)  
```  
  
## Arguments
  
*expr*  
   Is any valid scalar expression to be evaluated as a JSON Array expression. Note that nested string values must be written with double quotes to be valid. For details on the JSON format, see [json.org](https://json.org/)
  
## Return Types
  
  Returns an Array expression or undefined. 
  
## Examples
  
  The following example shows how StringToArray behaves across different types. 
  
 The following are examples with valid input.

```
SELECT 
    StringToArray('[]') AS a1, 
    StringToArray("[1,2,3]") AS a2,
    StringToArray("[\"str\",2,3]") AS a3,
    StringToArray('[["5","6","7"],["8"],["9"]]') AS a4,
    StringToArray('[1,2,3, "[4,5,6]",[7,8]]') AS a5
```

Here is the result set.

```
[{"a1": [], "a2": [1,2,3], "a3": ["str",2,3], "a4": [["5","6","7"],["8"],["9"]], "a5": [1,2,3,"[4,5,6]",[7,8]]}]
```

The following is an example of invalid input. 
   
 Single quotes within the array are not valid JSON.
Even though they are valid within a query, they will not parse to valid arrays. 
 Strings within the array string must either be escaped "[\\"\\"]" or the surrounding quote must be single '[""]'.

```
SELECT
    StringToArray("['5','6','7']")
```

Here is the result set.

```
[{}]
```

The following are examples of invalid input.
   
 The expression passed will be parsed as a JSON array; the following do not evaluate to type array and thus return undefined.
   
```
SELECT
    StringToArray("["),
    StringToArray("1"),
    StringToArray(NaN),
    StringToArray(false),
    StringToArray(undefined)
```

Here is the result set.

```
[{}]
```


## See Also
