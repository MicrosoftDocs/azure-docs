---
title: StringToNumber in Azure Cosmos DB query language
description: Learn about SQL system function StringToNumber in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference
---
# StringToNumber (Azure Cosmos DB)
 Returns expression translated to a Number. If expression cannot be translated, returns undefined.  
  
## Syntax
  
```sql
StringToNumber(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression to be parsed as a JSON Number expression. Numbers in JSON must be an integer or a floating point. For details on the JSON format, see [json.org](https://json.org/)  
  
## Return types
  
  Returns a Number expression or undefined.  
  
## Examples
  
  The following example shows how `StringToNumber` behaves across different types. 

Whitespace is allowed only before or after the Number.

```sql
SELECT 
    StringToNumber("1.000000") AS num1, 
    StringToNumber("3.14") AS num2,
    StringToNumber("   60   ") AS num3, 
    StringToNumber("-1.79769e+308") AS num4
```  
  
 Here is the result set.  
  
```json
{{"num1": 1, "num2": 3.14, "num3": 60, "num4": -1.79769e+308}}
```  

In JSON a valid Number must be either be an integer or a floating point number.

```sql
SELECT   
    StringToNumber("0xF")
```  
  
 Here is the result set.  
  
```json
{{}}
```  

The expression passed will be parsed as a Number expression; these inputs do not evaluate to type Number and thus return undefined. 

```sql
SELECT 
    StringToNumber("99     54"),   
    StringToNumber(undefined),
    StringToNumber("false"),
    StringToNumber(false),
    StringToNumber(" "),
    StringToNumber(NaN)
```  
  
 Here is the result set.  
  
```json
{{}}
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
