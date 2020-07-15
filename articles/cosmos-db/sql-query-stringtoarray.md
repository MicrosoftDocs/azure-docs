---
title: StringToArray in Azure Cosmos DB query language
description: Learn about SQL system function StringToArray in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference
---
# StringToArray (Azure Cosmos DB)
 Returns expression translated to an Array. If expression cannot be translated, returns undefined.  
  
## Syntax
  
```sql  
StringToArray(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression to be parsed as a JSON Array expression. 
  
## Return types
  
  Returns an array expression or undefined. 
  
## Remarks
  Nested string values must be written with double quotes to be valid JSON. For details on the JSON format, see [json.org](https://json.org/)
  
## Examples
  
  The following example shows how `StringToArray` behaves across different types. 
  
 The following are examples with valid input.

```sql
SELECT 
    StringToArray('[]') AS a1, 
    StringToArray("[1,2,3]") AS a2,
    StringToArray("[\"str\",2,3]") AS a3,
    StringToArray('[["5","6","7"],["8"],["9"]]') AS a4,
    StringToArray('[1,2,3, "[4,5,6]",[7,8]]') AS a5
```

Here is the result set.

```json
[{"a1": [], "a2": [1,2,3], "a3": ["str",2,3], "a4": [["5","6","7"],["8"],["9"]], "a5": [1,2,3,"[4,5,6]",[7,8]]}]
```

The following is an example of invalid input. 
   
 Single quotes within the array are not valid JSON.
Even though they are valid within a query, they will not parse to valid arrays. 
 Strings within the array string must either be escaped "[\\"\\"]" or the surrounding quote must be single '[""]'.

```sql
SELECT
    StringToArray("['5','6','7']")
```

Here is the result set.

```json
[{}]
```

The following are examples of invalid input.
   
 The expression passed will be parsed as a JSON array; the following do not evaluate to type array and thus return undefined.
   
```sql
SELECT
    StringToArray("["),
    StringToArray("1"),
    StringToArray(NaN),
    StringToArray(false),
    StringToArray(undefined)
```

Here is the result set.

```json
[{}]
```

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
