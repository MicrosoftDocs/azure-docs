---
title: Date and time functions in the mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about date and time functions in mapping data flow.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 02/02/2022
---

# Date and time functions in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

The following articles provide details about date and time functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Expression functions list

In Data Factory and Synapse pipelines, use date and time functions to express datetime values and manipulate them.

| Expression function | Task |
|-----|-----|
| [addDays](data-flow-expressions-usage.md#addDays) | Add days to a date or timestamp. Same as the + operator for date.  |
| [addMonths](data-flow-expressions-usage.md#addMonths) | Add months to a date or timestamp. You can optionally pass a timezone.  |
| [between](data-flow-expressions-usage.md#between) | Checks if the first value is in between two other values inclusively. Numeric, string and datetime values can be compared  |
| [currentDate](data-flow-expressions-usage.md#currentDate) | Gets the current date when this job starts to run. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer to Java's `SimpleDateFormat` class for available formats. [https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html). |
| [currentTimestamp](data-flow-expressions-usage.md#currentTimestamp) | Gets the current timestamp when the job starts to run with local time zone.  |
| [currentUTC](data-flow-expressions-usage.md#currentUTC) | Gets the current timestamp as UTC. If you want your current time to be interpreted in a different timezone than your cluster time zone, you can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', or 'America/Cayman'. It's defaulted to the current timezone. Refer to Java's `SimpleDateFormat` class for available formats. [https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html). To convert the UTC time to a different timezone, use `fromUTC()`.  |
| [dayOfMonth](data-flow-expressions-usage.md#dayOfMonth) | Gets the day of the month given a date.  |
| [dayOfWeek](data-flow-expressions-usage.md#dayOfWeek) | Gets the day of the week given a date. 1 - Sunday, 2 - Monday ..., 7 - Saturday.  |
| [dayOfYear](data-flow-expressions-usage.md#dayOfYear) | Gets the day of the year given a date.  |
| [days](data-flow-expressions-usage.md#days) | Duration in milliseconds for number of days.  |
| [fromUTC](data-flow-expressions-usage.md#fromUTC) | Converts to the timestamp from UTC. You can optionally pass the timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. It's defaulted to the current timezone. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [hour](data-flow-expressions-usage.md#hour) | Gets the hour value of a timestamp. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [hours](data-flow-expressions-usage.md#hours) | Duration in milliseconds for number of hours.  |
| [lastDayOfMonth](data-flow-expressions-usage.md#lastDayOfMonth) | Gets the last date of the month given a date.  |
| [millisecond](data-flow-expressions-usage.md#millisecond) | Gets the millisecond value of a date. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [milliseconds](data-flow-expressions-usage.md#milliseconds) | Duration in milliseconds for number of milliseconds.  |
| [minute](data-flow-expressions-usage.md#minute) | Gets the minute value of a timestamp. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [minutes](data-flow-expressions-usage.md#minutes) | Duration in milliseconds for number of minutes.  |
| [month](data-flow-expressions-usage.md#month) | Gets the month value of a date or timestamp.  |
| [monthsBetween](data-flow-expressions-usage.md#monthsBetween) | Gets the number of months between two dates. You can round off the calculation. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [second](data-flow-expressions-usage.md#second) | Gets the second value of a date. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [seconds](data-flow-expressions-usage.md#seconds) | Duration in milliseconds for number of seconds.  |
| [subDays](data-flow-expressions-usage.md#subDays) | Subtract days from a date or timestamp. Same as the - operator for date.  |
| [subMonths](data-flow-expressions-usage.md#subMonths) | Subtract months from a date or timestamp.  |
| [weekOfYear](data-flow-expressions-usage.md#weekOfYear) | Gets the week of the year given a date.  |
| [weeks](data-flow-expressions-usage.md#weeks) | Duration in milliseconds for number of weeks.  |
| [year](data-flow-expressions-usage.md#year) | Gets the year value of a date.  |
|||

## Next Steps

- [Aggregate functions](data-flow-aggregate-functions.md)
- [Array functions](data-flow-array-functions.md)
- [Cached lookup functions](data-flow-cached-lookup-functions.md)
- [Conversion functions](data-flow-conversion-functions.md)
- [Expression functions](data-flow-expression-functions.md)
- [Map functions](data-flow-map-functions.md)
- [Metafunctions](data-flow-metafunctions.md)
- [Window functions](data-flow-window-functions.md)
- [Usage details of all data transformation expressions](data-flow-expressions-usage.md).
- [Learn how to use Expression Builder](concepts-data-flow-expression-builder.md).