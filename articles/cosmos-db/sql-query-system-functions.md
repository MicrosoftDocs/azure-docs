---
title: System functions in Azure Cosmos DB query language
description: Learn about built-in and user defined SQL system functions in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 12/02/2019
ms.author: girobins
ms.custom: query-reference
---
# System functions (Azure Cosmos DB)

 Cosmos DB provides many built-in SQL functions. The categories of built-in functions are listed below.  
  
|Function group|Description|Operations|  
|--------------|-----------------|-----------------| 
|[Array functions](sql-query-array-functions.md)|The array functions perform an operation on an array input value and return numeric, Boolean, or array value. | [ARRAY_CONCAT](sql-query-array-concat.md), [ARRAY_CONTAINS](sql-query-array-contains.md), [ARRAY_LENGTH](sql-query-array-length.md), [ARRAY_SLICE](sql-query-array-slice.md) |
|[Date and Time functions](sql-query-date-time-functions.md)|The date and time functions allow you to get the current UTC date and time in two forms; a numeric timestamp whose value is the Unix epoch in milliseconds or as a string which conforms to the ISO 8601 format. | [GetCurrentDateTime](sql-query-getcurrentdatetime.md), [GetCurrentTimestamp](sql-query-getcurrenttimestamp.md) |
|[Mathematical functions](sql-query-mathematical-functions.md)|The mathematical functions each perform a calculation, usually based on input values that are provided as arguments, and return a numeric value. | [ABS](sql-query-abs.md), [ACOS](sql-query-acos.md), [ASIN](sql-query-asin.md), [ATAN](sql-query-atan.md), [ATN2](sql-query-atn2.md), [CEILING](sql-query-ceiling.md), [COS](sql-query-cos.md), [COT](sql-query-cot.md), [DEGREES](sql-query-degrees.md), [EXP](sql-query-exp.md), [FLOOR](sql-query-floor.md), [LOG](sql-query-log.md), [LOG10](sql-query-log10.md), [PI](sql-query-pi.md), [POWER](sql-query-power.md), [RADIANS](sql-query-radians.md), [RAND](sql-query-rand.md), [ROUND](sql-query-round.md), [SIGN](sql-query-sign.md), [SIN](sql-query-sin.md), [SQRT](sql-query-sqrt.md), [SQUARE](sql-query-square.md), [TAN](sql-query-tan.md), [TRUNC](sql-query-trunc.md) |
|[Spatial functions](sql-query-spatial-functions.md)|The spatial functions perform an operation on a spatial object input value and return a numeric or Boolean value. | [ST_DISTANCE](sql-query-st-distance.md), [ST_INTERSECTS](sql-query-st-intersects.md), [ST_ISVALID](sql-query-st-isvalid.md), [ST_ISVALIDDETAILED](sql-query-st-isvaliddetailed.md), [ST_WITHIN](sql-query-st-within.md) |
|[String functions](sql-query-string-functions.md)|The string functions perform an operation on a string input value and return a string, numeric or Boolean value. | [CONCAT](sql-query-concat.md), [CONTAINS](sql-query-contains.md), [ENDSWITH](sql-query-endswith.md), [INDEX_OF](sql-query-index-of.md), [LEFT](sql-query-left.md), [LENGTH](sql-query-length.md), [LOWER](sql-query-lower.md), [LTRIM](sql-query-ltrim.md), [REPLACE](sql-query-replace.md), [REPLICATE](sql-query-replicate.md), [REVERSE](sql-query-reverse.md), [RIGHT](sql-query-right.md), [RTRIM](sql-query-rtrim.md), [STARTSWITH](sql-query-startswith.md), [StringToArray](sql-query-stringtoarray.md), [StringToBoolean](sql-query-stringtoboolean.md), [StringToNull](sql-query-stringtonull.md), [StringToNumber](sql-query-stringtonumber.md), [StringToObject](sql-query-stringtoobject.md), [SUBSTRING](sql-query-substring.md), [ToString](sql-query-tostring.md), [TRIM](sql-query-trim.md), [UPPER](sql-query-upper.md) |
|[Type checking functions](sql-query-type-checking-functions.md)|The type checking functions allow you to check the type of an expression within SQL queries. | [IS_ARRAY](sql-query-is-array.md), [IS_BOOL](sql-query-is-bool.md), [IS_DEFINED](sql-query-is-defined.md), [IS_NULL](sql-query-is-null.md), [IS_NUMBER](sql-query-is-number.md), [IS_OBJECT](sql-query-is-object.md), [IS_PRIMITIVE](sql-query-is-primitive.md), [IS_STRING](sql-query-is-string.md) |

## Built-in versus User Defined Functions (UDFs)

If you’re currently using a user-defined function (UDF) for which a built-in function is now available, the corresponding built-in function will be quicker to run and more efficient.

## Built-in versus ANSI SQL functions

The main difference between Cosmos DB functions and ANSI SQL functions is that Cosmos DB functions are designed to work well with schemaless and mixed-schema data. For example, if a property is missing or has a non-numeric value like `unknown`, the item is skipped instead of returning an error.

## Next steps

- [Introduction to Azure Cosmos DB](introduction.md)
- [Array functions](sql-query-array-functions.md)
- [Date and time functions](sql-query-date-time-functions.md)
- [Mathematical functions](sql-query-mathematical-functions.md)
- [Spatial functions](sql-query-spatial-functions.md)
- [String functions](sql-query-string-functions.md)
- [Type checking functions](sql-query-type-checking-functions.md)
- [User Defined Functions](sql-query-udfs.md)
- [Aggregates](sql-query-aggregates.md)
