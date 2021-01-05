---
title: Date and time functions in Azure Cosmos DB query language
description: Learn about date and time SQL system functions in Azure Cosmos DB to perform DateTime and timestamp operations.
author: ginamr
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 08/18/2020
ms.author: girobins
ms.custom: query-reference
---
# Date and time functions (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

The date and time functions let you perform DateTime and timestamp operations in Azure Cosmos DB.

## Functions to obtain the date and time

The following scalar functions allow you to get the current UTC date and time in three forms: a string which conforms to the ISO 8601 format,
a numeric timestamp whose value is the number of milliseconds which have elapsed since the Unix epoch,
or numeric ticks whose value is the number of 100 nanosecond ticks which have elapsed since the Unix epoch:

* [GetCurrentDateTime](sql-query-getcurrentdatetime.md)
* [GetCurrentTimestamp](sql-query-getcurrenttimestamp.md)
* [GetCurrentTicks](sql-query-getcurrentticks.md)

## Functions to work with DateTime values

The following functions allow you to easily manipulate DateTime, timestamp, and tick values:

* [DateTimeAdd](sql-query-datetimeadd.md)
* [DateTimeDiff](sql-query-datetimediff.md)
* [DateTimeFromParts](sql-query-datetimefromparts.md)
* [DateTimePart](sql-query-datetimepart.md)
* [DateTimeToTicks](sql-query-datetimetoticks.md)
* [DateTimeToTimestamp](sql-query-datetimetotimestamp.md)
* [TicksToDateTime](sql-query-tickstodatetime.md)
* [TimestampToDateTime](sql-query-timestamptodatetime.md)

## Next steps

- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
- [User Defined Functions](sql-query-udfs.md)
- [Aggregates](sql-query-aggregate-functions.md)
