---
title: System functions
description: Learn about SQL System functions in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# System functions

 Cosmos DB provides many built-in SQL functions. The categories of built-in functions are listed below.  
  
|Function|Description|  
|--------------|-----------------|  
|[Array functions](sql-query-array-functions.md)|The array functions perform an operation on an array input value and return numeric, Boolean, or array value.|
|[Date and Time functions](sql-query-date-time-functions.md)|The date and time functions allow you to get the current UTC date and time in two forms; a numeric timestamp whose value is the Unix epoch in milliseconds or as a string which conforms to the ISO 8601 format.|
|[Mathematical functions](sql-query-mathematical-functions.md)|The mathematical functions each perform a calculation, usually based on input values that are provided as arguments, and return a numeric value.|
|[Spatial functions](sql-query-spatial-functions.md)|The spatial functions perform an operation on a spatial object input value and return a numeric or Boolean value.|
|[String functions](sql-query-string-functions.md)|The string functions perform an operation on a string input value and return a string, numeric or Boolean value.|
|[Type checking functions](sql-query-type-checking-functions.md)|The type checking functions allow you to check the type of an expression within SQL queries.|  

Below are a list of functions within each category:

| Function group | Operations |
|---------|----------|
| Array functions | ARRAY_CONCAT, ARRAY_CONTAINS, ARRAY_LENGTH, and ARRAY_SLICE |
| Date and Time functions | GetCurrentDateTime, GetCurrentTimestamp,  |
| Mathematical functions | ABS, ACOS, ASIN, ATAN, ATN2, CEILING, COS, COT, DEGREES, EXP, FLOOR, LOG, LOG10, PI, POWER, RADIANS, RAND, ROUND, SIGN, SIN, SQRT, SQUARE, TAN, TRUNC |
| Spatial functions | ST_DISTANCE, ST_WITHIN, ST_INTERSECTS, ST_ISVALID, ST_ISVALIDDETAILED |
| String functions | CONCAT, CONTAINS, ENDSWITH, INDEX_OF, LEFT, LENGTH, LOWER, LTRIM, REPLACE, REPLICATE, REVERSE, RIGHT, RTRIM, STARTSWITH, StringToArray, StringToBoolean, StringToNull, StringToNumber, StringToObject, SUBSTRING, ToString, TRIM, UPPER |
| Type-checking functions | IS_ARRAY, IS_BOOL, IS_DEFINED, IS_NULL, IS_NUMBER, IS_OBJECT, IS_PRIMITIVE, IS_STRING |

If you’re currently using a user-defined function (UDF) for which a built-in function is now available, the corresponding built-in function will be quicker to run and more efficient.

The main difference between Cosmos DB functions and ANSI SQL functions is that Cosmos DB functions are designed to work well with schemaless and mixed-schema data. For example, if a property is missing or has a non-numeric value like `unknown`, the item is skipped instead of returning an error.

## Next steps

- [Introduction to Azure Cosmos DB](introduction.md)
- [Array functions](sql-query-array-functions.md)
- [Date and time functions](sql-query-date-time-functions.md)
- [Mathematical functions](sql-query-mathematical-functions.md)
- [Spatial functions](sql-query-spatial-functions.md)
- [String functions](sql-query-string-functions.md)
- [Type checking functions](sql-query-type-checking-functions.md)
- [UDFs](sql-query-udfs.md)
- [Aggregates](sql-query-aggregates.md)
