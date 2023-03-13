---
title: IS_NUMBER in Azure Cosmos DB query language
description: Learn about SQL system function IS_NUMBER in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: sidandrews
ms.custom: query-reference, ignite-2022
---

# IS_NUMBER (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a Boolean value indicating if the type of the specified expression is a number.  
  
## Syntax
  
```sql
IS_NUMBER(<expr>)  
```  
  
## Arguments
  
*expr*  
  Is any expression.  
  
## Return types
  
Returns a Boolean expression.  
  
## Examples
  
The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the `IS_NUMBER` function.  
  
```sql
SELECT   
    IS_NUMBER(true) AS isBooleanANumber,   
    IS_NUMBER(1) AS isNumberANumber, 
    IS_NUMBER("value") AS isTextStringANumber, 
    IS_NUMBER("1") AS isNumberStringANumber,
    IS_NUMBER(null) AS isNullANumber,  
    IS_NUMBER({prop: "value"}) AS isObjectANumber,   
    IS_NUMBER([1, 2, 3]) AS isArrayANumber,  
    IS_NUMBER({stringProp: "value"}.stringProp) AS isObjectStringPropertyANumber, 
    IS_NUMBER({numberProp: 1}.numberProp) AS isObjectNumberPropertyANumber  
```  

Here's the result set.  
  
```json
[
    {
        "isBooleanANumber": false,
        "isNumberANumber": true,
        "isTextStringANumber": false,
        "isNumberStringANumber": false,
        "isNullANumber": false,
        "isObjectANumber": false,
        "isArrayANumber": false,
        "isObjectStringPropertyANumber": false,
        "isObjectNumberPropertyANumber": true
    }
]
```  

## Remarks

This system function will benefit from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [Type checking functions Azure Cosmos DB](type-checking-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
