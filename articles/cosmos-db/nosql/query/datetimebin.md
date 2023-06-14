--- 
title: DateTimeBin in Azure Cosmos DB query language 
description: Learn about SQL system function DateTimeBin in Azure Cosmos DB. 
author: jcocchi 
ms.service: cosmos-db 
ms.subservice: nosql 
ms.topic: conceptual 
ms.date: 05/27/2022 
ms.author: jucocchi 
ms.custom: query-reference, ignite-2022
--- 

# DateTimeBin (Azure Cosmos DB)
 [!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)] 

Returns the nearest multiple of *BinSize* below the specified DateTime given the unit of measurement *DateTimePart* and start value of *BinAtDateTime*. 


## Syntax 

```sql 
DateTimeBin (<DateTime> , <DateTimePart> [,BinSize] [,BinAtDateTime]) 
``` 


## Arguments 

*DateTime*   
    The string value date and time to be binned. A UTC date and time ISO 8601 string value in the format `YYYY-MM-DDThh:mm:ss.fffffffZ` where: 

|Format|Description| 
|-|-| 
|YYYY|four-digit year| 
|MM|two-digit month (01 = January, etc.)| 
|DD|two-digit day of month (01 through 31)| 
|T|signifier for beginning of time elements| 
|hh|two-digit hour (00 through 23)| 
|mm|two-digit minutes (00 through 59)| 
|ss|two-digit seconds (00 through 59)| 
|.fffffff|seven-digit fractional seconds| 
|Z|UTC (Coordinated Universal Time) designator| 

For more information on the ISO 8601 format, see [ISO_8601](https://en.wikipedia.org/wiki/ISO_8601) 

*DateTimePart*   
   The date time part specifies the units for BinSize. DateTimeBin is Undefined for DayOfWeek, Year, and Month. The finest granularity for binning by Nanosecond is 100 nanosecond ticks; if Nanosecond is specified with a BinSize less than 100, the result is Undefined. This table lists all valid DateTimePart arguments for DateTimeBin: 

| DateTimePart | abbreviations        | 
| ------------ | -------------------- |
| Day          | "day", "dd", "d"     | 
| Hour         | "hour", "hh"         | 
| Minute       | "minute", "mi", "n"  | 
| Second       | "second", "ss", "s"  | 
| Millisecond  | "millisecond", "ms"  | 
| Microsecond  | "microsecond", "mcs" | 
| Nanosecond   | "nanosecond", "ns"   | 

*BinSize* (optional) 
   Numeric value that specifies the size of bins. If not specified, the default value is one. 


*BinAtDateTime* (optional) 
   A UTC date and time ISO 8601 string value in the format `YYYY-MM-DDThh:mm:ss.fffffffZ` that specifies the start date to bin from. Default value is the Unix epoch, ‘1970-01-01T00:00:00.000000Z’. 


## Return types 

Returns the result of binning the *DateTime* value.  


## Remarks 

DateTimeBin will return `Undefined` for the following reasons: 
- The DateTimePart value specified is invalid 
- The BinSize value is zero or negative 
- The DateTime or BinAtDateTime isn't a valid ISO 8601 DateTime or precedes the year 1601 (the Windows epoch) 


## Examples 

The following example bins ‘2021-06-28T17:24:29.2991234Z’ by one hour: 

```sql 
SELECT DateTimeBin('2021-06-28T17:24:29.2991234Z', 'hh') AS BinByHour 
``` 

```json 
[ 
    { 
        "BinByHour": "2021-06-28T17:00:00.0000000Z" 
    } 
] 
```   

The following example bins ‘2021-06-28T17:24:29.2991234Z’ given different *BinAtDateTime* values: 

```sql 
SELECT  
DateTimeBin('2021-06-28T17:24:29.2991234Z', 'day', 5) AS One_BinByFiveDaysUnixEpochImplicit, 
DateTimeBin('2021-06-28T17:24:29.2991234Z', 'day', 5, '1970-01-01T00:00:00.0000000Z') AS Two_BinByFiveDaysUnixEpochExplicit, 
DateTimeBin('2021-06-28T17:24:29.2991234Z', 'day', 5, '1601-01-01T00:00:00.0000000Z') AS Three_BinByFiveDaysFromWindowsEpoch, 
DateTimeBin('2021-06-28T17:24:29.2991234Z', 'day', 5, '2021-01-01T00:00:00.0000000Z') AS Four_BinByFiveDaysFromYearStart, 
DateTimeBin('2021-06-28T17:24:29.2991234Z', 'day', 5, '0001-01-01T00:00:00.0000000Z') AS Five_BinByFiveDaysFromUndefinedYear 
``` 

```json 
[ 
    { 
        "One_BinByFiveDaysUnixEpochImplicit": "2021-06-27T00:00:00.0000000Z", 
        "Two_BinByFiveDaysUnixEpochExplicit": "2021-06-27T00:00:00.0000000Z", 
        "Three_BinByFiveDaysFromWindowsEpoch": "2021-06-28T00:00:00.0000000Z", 
        "Four_BinByFiveDaysFromYearStart": "2021-06-25T00:00:00.0000000Z" 
    } 
] 
``` 

## Next steps 

- [Date and time functions Azure Cosmos DB](date-time-functions.md) 
- [System functions Azure Cosmos DB](system-functions.md) 
- [Introduction to Azure Cosmos DB](../../introduction.md) 
