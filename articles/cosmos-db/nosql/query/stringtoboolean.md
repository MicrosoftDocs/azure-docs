---
title: StringToBoolean in Azure Cosmos DB query language
description: Learn about SQL system function StringToBoolean in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# StringToBoolean (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Returns expression translated to a Boolean. If expression can't be translated, returns undefined.  
  
## Syntax
  
```sql
StringToBoolean(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression to be parsed as a Boolean expression.  
  
## Return types
  
  Returns a Boolean expression or undefined.  
  
## Examples
  
  The following example shows how `StringToBoolean` behaves across different types. 
 
 The following are examples with valid input.

Whitespace is allowed only before or after `true`/`false`.

```sql
SELECT 
    StringToBoolean("true") AS b1, 
    StringToBoolean("    false") AS b2,
    StringToBoolean("false    ") AS b3
```  
  
 Here's the result set.  
  
```json
[{"b1": true, "b2": false, "b3": false}]
```  

The following are examples with invalid input.

 Booleans are case sensitive and must be written with all lowercase characters such as `true` and `false`.

```sql
SELECT 
    StringToBoolean("TRUE"),
    StringToBoolean("False")
```  

Here's the result set.  
  
```json
[{}]
``` 

The expression passed will be parsed as a Boolean expression; these inputs don't evaluate to type Boolean and thus return undefined.

```sql
SELECT 
    StringToBoolean("null"),
    StringToBoolean(undefined),
    StringToBoolean(NaN), 
    StringToBoolean(false), 
    StringToBoolean(true)
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
