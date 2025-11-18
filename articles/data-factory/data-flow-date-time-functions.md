---
title: Date and Time Functions in the Mapping Data Flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about date and time functions in mapping data flow.
author: kromerm
ms.author: makromer
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 02/13/2025
---

# Date and time functions in mapping data flows

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

This article provides details about date and time functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Expression functions list

In Azure Data Factory and Azure Synapse Analytics pipelines, use date and time functions to express `datetime` values and manipulate them.

| Expression function | Task |
|-----|-----|
| [add](data-flow-expressions-usage.md#add) | Adds a pair of strings or numbers. Adds a date to a number of days. Adds a duration to a time stamp. Appends one array of similar type to another. Same as the `+` operator.  |
| [addDays](data-flow-expressions-usage.md#addDays) | Adds days to a date or time stamp. Same as the `+` operator for date.  |
| [addMonths](data-flow-expressions-usage.md#addMonths) | Add months to a date or time stamp. You can optionally pass a time zone.  |
| [between](data-flow-expressions-usage.md#between) | Checks if the first value is in between two other values inclusively. You can compare numeric, string, and `datetime` values.  |
| [currentDate](data-flow-expressions-usage.md#currentDate) | Gets the current date when this job starts to run. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. The local time zone is used as the default. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true). |
| [currentTimestamp](data-flow-expressions-usage.md#currentTimestamp) | Gets the current time stamp when the job starts to run with the local time zone.  |
| [currentUTC](data-flow-expressions-usage.md#currentUTC) | Gets the current time stamp as UTC. If you want your current time to be interpreted in a different time zone than your cluster time zone, you can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. It defaults to the current time zone. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true). To convert the UTC time to a different time zone, use `fromUTC()`.  |
| [dayOfMonth](data-flow-expressions-usage.md#dayOfMonth) | Gets the day of the month when given a date.  |
| [dayOfWeek](data-flow-expressions-usage.md#dayOfWeek) | Gets the day of the week when given a date. For example, 1 is Sunday, 2 is Monday, and continues to 7, which is Saturday.  |
| [dayOfYear](data-flow-expressions-usage.md#dayOfYear) | Gets the day of the year when given a date.  |
| [days](data-flow-expressions-usage.md#days) | Gives the duration in milliseconds for the number of days.  |
| [fromUTC](data-flow-expressions-usage.md#fromUTC) | Converts to the time stamp from UTC. You can optionally pass the time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. It defaults to the current time zone. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true).  |
| [hour](data-flow-expressions-usage.md#hour) | Gets the hour value of a time stamp. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. The local time zone is used as the default. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true).  |
| [hours](data-flow-expressions-usage.md#hours) | Gives the duration in milliseconds for the number of hours.  |
| [isDate](data-flow-expressions-usage.md#isDate) | Checks if the input date string is a date by using an optional input date format. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true). If the input date format is omitted, the default format is ``yyyy-[M]M-[d]d``. Accepted formats are ``[ yyyy, yyyy-[M]M, yyyy-[M]M-[d]d, yyyy-[M]M-[d]dT* ]``.|
| [isTimestamp](data-flow-expressions-usage.md#isTimestamp) | Checks if the input date string is a time stamp by using an optional input time stamp format. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true). If the time stamp is omitted, the default pattern ``yyyy-[M]M-[d]d hh:mm:ss[.f...]`` is used. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. The `Timestamp` function supports up to millisecond accuracy with a value of 999. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric&preserve-view=true#supported-format-elements).|
| [lastDayOfMonth](data-flow-expressions-usage.md#lastDayOfMonth) | Gets the last date of the month when given a date.  |
| [millisecond](data-flow-expressions-usage.md#millisecond) | Gets the millisecond value of a date. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. The local time zone is used as the default. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true). |
| [milliseconds](data-flow-expressions-usage.md#milliseconds) | Gives the duration in milliseconds for the number of milliseconds.  |
| [minus](data-flow-expressions-usage.md#minus) | Subtracts numbers. Subtracts the number of days from a date. Subtracts the duration from a time stamp. Subtracts two time stamps to get the difference in milliseconds. Same as the `-` operator.  |
| [minute](data-flow-expressions-usage.md#minute) | Gets the minute value of a time stamp. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. The local time zone is used as the default. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true).  |
| [minutes](data-flow-expressions-usage.md#minutes) | Gives the duration in milliseconds for the number of minutes.  |
| [month](data-flow-expressions-usage.md#month) | Gets the month value of a date or time stamp.  |
| [monthsBetween](data-flow-expressions-usage.md#monthsBetween) | Gets the number of months between two dates. You can round off the calculation. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. The local time zone is used as the default. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true).  |
| [second](data-flow-expressions-usage.md#second) | Gets the second value of a date. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. The local time zone is used as the default. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true).  |
| [seconds](data-flow-expressions-usage.md#seconds) | Gives the duration in milliseconds for the number of seconds.  |
| [subDays](data-flow-expressions-usage.md#subDays) | Subtracts days from a date or time stamp. Same as the `-` operator for date.  |
| [subMonths](data-flow-expressions-usage.md#subMonths) | Subtracts months from a date or time stamp.  |
| [toDate](data-flow-expressions-usage.md#toDate) | Converts an input date string to date by using an optional input date format. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true). If the input date format is omitted, the default format is `yyyy-[M]M-[d]d`. Accepted formats are `[ yyyy, yyyy-[M]M, yyyy-[M]M-[d]d, yyyy-[M]M-[d]dT* ]`.  |
| [toTimestamp](data-flow-expressions-usage.md#toTimestamp) | Converts a string to a time stamp when given an optional time stamp format. If the time stamp is omitted, the default pattern `yyyy-[M]M-[d]d hh:mm:ss[.f...]` is used. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. `Timestamp` supports up to millisecond accuracy with a value of 999. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true). |
| [toUTC](data-flow-expressions-usage.md#toUTC) | Converts the time stamp to UTC. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, or `America/Cayman`. It defaults to the current time zone. Refer to [Kusto's format_datetime() function for available formats](/kusto/query/format-datetime-function?view=microsoft-fabric#supported-format-elements&preserve-view=true).  |
| [weekOfYear](data-flow-expressions-usage.md#weekOfYear) | Gets the week of the year when given a date.  |
| [weeks](data-flow-expressions-usage.md#weeks) | Gives the duration in milliseconds for the number of weeks.  |
| [year](data-flow-expressions-usage.md#year) | Gets the year value of a date.  |
|||

## Related content

- [Aggregate functions](data-flow-aggregate-functions.md)
- [Array functions](data-flow-array-functions.md)
- [Cached lookup functions](data-flow-cached-lookup-functions.md)
- [Conversion functions](data-flow-conversion-functions.md)
- [Expression functions](data-flow-expression-functions.md)
- [Map functions](data-flow-map-functions.md)
- [Metafunctions](data-flow-metafunctions.md)
- [Window functions](data-flow-window-functions.md)
- [Usage details of all data transformation expressions](data-flow-expressions-usage.md)
- [Learn how to use Expression Builder](concepts-data-flow-expression-builder.md)
