---
title: Date and time functions in Azure Cosmos DB query language
description: Learn about date and time SQL system functions in Azure Cosmos DB to perform DateTime and timestamp operations.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/09/2020
ms.author: girobins
ms.custom: query-reference
---
# Date and time functions (Azure Cosmos DB)

The date and time functions let you perform DateTime and timestamp operations in Azure Cosmos DB.

## Functions to obtain the date and time

The following scalar functions allow you to get the current UTC date and time in two forms: a string which conforms to the ISO 8601 format or a numeric timestamp whose value is the Unix epoch in milliseconds:

* [GetCurrentDateTime](sql-query-getcurrentdatetime.md)
* [GetCurrentTimestamp](sql-query-getcurrenttimestamp.md)

## Functions to work with DateTime values

The following functions allow you to easily manipulate DateTime values:

* [DateTimeAdd](sql-query-datetimeadd.md)
* [DateTimeDiff](sql-query-datetimediff.md)
* [DateTimeFromParts](sql-query-datetimefromparts.md)

## Next steps

- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
- [User Defined Functions](sql-query-udfs.md)
- [Aggregates](sql-query-aggregates.md)
