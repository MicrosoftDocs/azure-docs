---
title: System functions in Azure Cosmos DB query language
description: Learn about built-in and user defined SQL system functions in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 02/03/2021
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# System functions (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Azure Cosmos DB provides many built-in SQL functions. The categories of built-in functions are listed below.  
  
|Function group|Description|Operations|  
|--------------|-----------------|-----------------| 
|[Array functions](array-functions.md)|The array functions perform an operation on an array input value and return numeric, Boolean, or array value. | [ARRAY_CONCAT](array-concat.md), [ARRAY_CONTAINS](array-contains.md), [ARRAY_LENGTH](array-length.md), [ARRAY_SLICE](array-slice.md) |
|[Date and Time functions](date-time-functions.md)|The date and time functions allow you to get the current UTC date and time in two forms; a numeric timestamp whose value is the Unix epoch in milliseconds or as a string which conforms to the ISO 8601 format. | [GetCurrentDateTime](getcurrentdatetime.md), [GetCurrentTimestamp](getcurrenttimestamp.md), [GetCurrentTicks](getcurrentticks.md) |
|[Mathematical functions](mathematical-functions.md)|The mathematical functions each perform a calculation, usually based on input values that are provided as arguments, and return a numeric value. | [ABS](abs.md), [ACOS](acos.md), [ASIN](asin.md), [ATAN](atan.md), [ATN2](atn2.md), [CEILING](ceiling.md), [COS](cos.md), [COT](cot.md), [DEGREES](degrees.md), [EXP](exp.md), [FLOOR](floor.md), [LOG](log.md), [LOG10](log10.md), [PI](pi.md), [POWER](power.md), [RADIANS](radians.md), [RAND](rand.md), [ROUND](round.md), [SIGN](sign.md), [SIN](sin.md), [SQRT](sqrt.md), [SQUARE](square.md), [TAN](tan.md), [TRUNC](trunc.md) |
|[Spatial functions](spatial-functions.md)|The spatial functions perform an operation on a spatial object input value and return a numeric or Boolean value. | [ST_DISTANCE](st-distance.md), [ST_INTERSECTS](st-intersects.md), [ST_ISVALID](st-isvalid.md), [ST_ISVALIDDETAILED](st-isvaliddetailed.md), [ST_WITHIN](st-within.md) |
|[String functions](string-functions.md)|The string functions perform an operation on a string input value and return a string, numeric or Boolean value. | [CONCAT](concat.md), [CONTAINS](contains.md), [ENDSWITH](endswith.md), [INDEX_OF](index-of.md), [LEFT](left.md), [LENGTH](length.md), [LOWER](lower.md), [LTRIM](ltrim.md), [REGEXMATCH](regexmatch.md)[REPLACE](replace.md), [REPLICATE](replicate.md), [REVERSE](reverse.md), [RIGHT](right.md), [RTRIM](rtrim.md), [STARTSWITH](startswith.md), [StringToArray](stringtoarray.md), [StringToBoolean](stringtoboolean.md), [StringToNull](stringtonull.md), [StringToNumber](stringtonumber.md), [StringToObject](stringtoobject.md), [SUBSTRING](substring.md), [ToString](tostring.md), [TRIM](trim.md), [UPPER](upper.md) |
|[Type checking functions](type-checking-functions.md)|The type checking functions allow you to check the type of an expression within SQL queries. | [IS_ARRAY](is-array.md), [IS_BOOL](is-bool.md), [IS_DEFINED](is-defined.md), [IS_NULL](is-null.md), [IS_NUMBER](is-number.md), [IS_OBJECT](is-object.md), [IS_PRIMITIVE](is-primitive.md), [IS_STRING](is-string.md) |

## Built-in versus User Defined Functions (UDFs)

If you’re currently using a user-defined function (UDF) for which a built-in function is now available, the corresponding built-in function will be quicker to run and more efficient.

## Built-in versus ANSI SQL functions

The main difference between Azure Cosmos DB functions and ANSI SQL functions is that Azure Cosmos DB functions are designed to work well with schemaless and mixed-schema data. For example, if a property is missing or has a non-numeric value like `undefined`, the item is skipped instead of returning an error.

## Next steps

- [Introduction to Azure Cosmos DB](../../introduction.md)
- [Array functions](array-functions.md)
- [Date and time functions](date-time-functions.md)
- [Mathematical functions](mathematical-functions.md)
- [Spatial functions](spatial-functions.md)
- [String functions](string-functions.md)
- [Type checking functions](type-checking-functions.md)
- [User Defined Functions](udfs.md)
- [Aggregates](aggregate-functions.md)
