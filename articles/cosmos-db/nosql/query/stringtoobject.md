---
title: StringToObject in Azure Cosmos DB query language
description: Learn about SQL system function StringToObject in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# StringToObject (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Returns expression translated to an Object. If expression can't be translated, returns undefined.  
  
## Syntax
  
```sql
StringToObject(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression to be parsed as a JSON object expression. Nested string values must be written with double quotes to be valid. For details on the JSON format, see [json.org](https://json.org/)  
  
## Return types
  
  Returns an object expression or undefined.  
  
## Examples
  
  The following example shows how `StringToObject` behaves across different types. 
  
 The following are examples with valid input.

```sql
SELECT 
    StringToObject("{}") AS obj1, 
    StringToObject('{"A":[1,2,3]}') AS obj2,
    StringToObject('{"B":[{"b1":[5,6,7]},{"b2":8},{"b3":9}]}') AS obj3, 
    StringToObject("{\"C\":[{\"c1\":[5,6,7]},{\"c2\":8},{\"c3\":9}]}") AS obj4
``` 

Here's the result set.

```json
[{"obj1": {}, 
  "obj2": {"A": [1,2,3]}, 
  "obj3": {"B":[{"b1":[5,6,7]},{"b2":8},{"b3":9}]},
  "obj4": {"C":[{"c1":[5,6,7]},{"c2":8},{"c3":9}]}}]
```

 The following are examples with invalid input.
Even though they're valid within a query, they won't parse to valid objects. 
 Strings within the string of object must either be escaped "{\\"a\\":\\"str\\"}" or the surrounding quote must be single 
 '{"a": "str"}'.

Single quotes surrounding property names aren't valid JSON.

```sql
SELECT 
    StringToObject("{'a':[1,2,3]}")
```

Here's the result set.

```json
[{}]
```  

Property names without surrounding quotes aren't valid JSON.

```sql
SELECT 
    StringToObject("{a:[1,2,3]}")
```

Here's the result set.

```json
[{}]
``` 

The following are examples with invalid input.

 The expression passed will be parsed as a JSON object; these inputs don't evaluate to type object and thus return undefined.

```sql
SELECT 
    StringToObject("}"),
    StringToObject("{"),
    StringToObject("1"),
    StringToObject(NaN), 
    StringToObject(false), 
    StringToObject(undefined)
``` 
 
 Here's the result set.

```json
[{}]
```

## Remarks

This system function won't utilize the index.

## Next steps

- [String functions Azure Cosmos DB](string-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
