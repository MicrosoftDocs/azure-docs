---
title: Conversion functions in the mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about conversion functions in mapping data flow.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/20/2023
---

# Conversion functions in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

The following articles provide details about expressions and functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Conversion function list

Conversion functions are used to convert data and test for data types

| Conversion function | Task |
|----|----|
| [ascii](data-flow-expressions-usage.md#ascii) | Returns the numeric value of the input character. If the input string has more than one character, the numeric value of the first character is returned|
| [char](data-flow-expressions-usage.md#char) | Returns the ascii character represented by the input number. If number is greater than 256, the result is equivalent to char(number % 256)|
| [decode](data-flow-expressions-usage.md#decode) | Decodes the encoded input data into a string based on the given charset. A second (optional) argument can be used to specify which charset to use - 'US-ASCII', 'ISO-8859-1', 'UTF-8' (default), 'UTF-16BE', 'UTF-16LE', 'UTF-16'|
| [encode](data-flow-expressions-usage.md#encode) | Encodes the input string data into binary based on a charset. A second (optional) argument can be used to specify which charset to use - 'US-ASCII', 'ISO-8859-1', 'UTF-8' (default), 'UTF-16BE', 'UTF-16LE', 'UTF-16'|
| [isBitSet](data-flow-expressions-usage.md#isBitSet) | Checks if a bit position is set in this bitset|
| [setBitSet](data-flow-expressions-usage.md#setBitSet) | Sets bit positions in this bitset|
| [isBoolean](data-flow-expressions-usage.md#isBoolean) | Checks if the string value is a boolean value according to the rules of ``toBoolean()``|
| [isByte](data-flow-expressions-usage.md#isByte) | Checks if the string value is a byte value given an optional format according to the rules of ``toByte()``|
| [isDate](data-flow-expressions-usage.md#isDate) | Checks if the input date string is a date using an optional input date format. Refer to Java's SimpleDateFormat for available formats. If the input date format is omitted, default format is ``yyyy-[M]M-[d]d``. Accepted formats are ``[ yyyy, yyyy-[M]M, yyyy-[M]M-[d]d, yyyy-[M]M-[d]dT* ]``|
| [isShort](data-flow-expressions-usage.md#isShort) | Checks if the string value is a short value given an optional format according to the rules of ``toShort()``|
| [isInteger](data-flow-expressions-usage.md#isInteger) | Checks if the string value is an integer value given an optional format according to the rules of ``toInteger()``|
| [isLong](data-flow-expressions-usage.md#isLong) | Checks if the string value is a long value given an optional format according to the rules of ``toLong()``|
| [isNan](data-flow-expressions-usage.md#isNan) | Check if a value isn't a number.|
| [isFloat](data-flow-expressions-usage.md#isFloat) | Checks if the string value is a float value given an optional format according to the rules of ``toFloat()``|
| [isDouble](data-flow-expressions-usage.md#isDouble) | Checks if the string value is a double value given an optional format according to the rules of ``toDouble()``|
| [isDecimal](data-flow-expressions-usage.md#isDecimal) | Checks if the string value is a decimal value given an optional format according to the rules of ``toDecimal()``|
| [isTimestamp](data-flow-expressions-usage.md#isTimestamp) | Checks if the input date string is a timestamp using an optional input timestamp format. Refer to Java's SimpleDateFormat for available formats. If the timestamp is omitted, the default pattern ``yyyy-[M]M-[d]d hh:mm:ss[.f...]`` is used. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. Timestamp supports up to millisecond accuracy with value of 999 Refer to Java's SimpleDateFormat for available formats.|
| [toBase64](data-flow-expressions-usage.md#toBase64) | Encodes the given string in base64.  |
| [toBinary](data-flow-expressions-usage.md#toBinary) | Converts any numeric/date/timestamp/string to binary representation.  |
| [toBoolean](data-flow-expressions-usage.md#toBoolean) | Converts a value of ('t', 'true', 'y', 'yes', '1') to true and ('f', 'false', 'n', 'no', '0') to false and NULL for any other value.  |
| [toByte](data-flow-expressions-usage.md#toByte) | Converts any numeric or string to a byte value. An optional Java decimal format can be used for the conversion.  |
| [toDate](data-flow-expressions-usage.md#toDate) | Converts input date string to date using an optional input date format. Refer to Java's `SimpleDateFormat` class for available formats. If the input date format is omitted, default format is yyyy-[M]M-[d]d. Accepted formats are :[ yyyy, yyyy-[M]M, yyyy-[M]M-[d]d, yyyy-[M]M-[d]dT* ].  |
| [toDecimal](data-flow-expressions-usage.md#toDecimal) | Converts any numeric or string to a decimal value. If precision and scale aren't specified, it's defaulted to (10,2). An optional Java decimal format can be used for the conversion. An optional locale format in the form of BCP47 language like en-US, de, zh-CN.  |
| [toDouble](data-flow-expressions-usage.md#toDouble) | Converts any numeric or string to a double value. An optional Java decimal format can be used for the conversion. An optional locale format in the form of BCP47 language like en-US, de, zh-CN.  |
| [toFloat](data-flow-expressions-usage.md#toFloat) | Converts any numeric or string to a float value. An optional Java decimal format can be used for the conversion. Truncates any double.  |
| [toInteger](data-flow-expressions-usage.md#toInteger) | Converts any numeric or string to an integer value. An optional Java decimal format can be used for the conversion. Truncates any long, float, double.  |
| [toLong](data-flow-expressions-usage.md#toLong) | Converts any numeric or string to a long value. An optional Java decimal format can be used for the conversion. Truncates any float, double.  |
| [toShort](data-flow-expressions-usage.md#toShort) | Converts any numeric or string to a short value. An optional Java decimal format can be used for the conversion. Truncates any integer, long, float, double.  |
| [toString](data-flow-expressions-usage.md#toString) | Converts a primitive datatype to a string. For numbers and date, a format can be specified. If unspecified the system default is picked.Java decimal format is used for numbers. Refer to Java SimpleDateFormat for all possible date formats; the default format is yyyy-MM-dd.  |
| [toTimestamp](data-flow-expressions-usage.md#toTimestamp) | Converts a string to a timestamp given an optional timestamp format. If the timestamp is omitted the default pattern yyyy-[M]M-[d]d hh:mm:ss[.f...] is used. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. Timestamp supports up to millisecond accuracy with value of 999. Refer to Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [toUTC](data-flow-expressions-usage.md#toUTC) | Converts the timestamp to UTC. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. It's defaulted to the current timezone. Refer to Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
|||

## Next steps

- List of all [aggregate functions](data-flow-aggregate-functions.md).
- List of all [array functions](data-flow-array-functions.md).
- List of all [cached lookup functions](data-flow-cached-lookup-functions.md).
- List of all [date and time functions](data-flow-date-time-functions.md).
- List of all [expression functions](data-flow-expression-functions.md).
- List of all [map functions](data-flow-map-functions.md).
- List of all [metafunctions](data-flow-metafunctions.md).
- List of all [window functions](data-flow-window-functions.md).
- [Usage details of all data transformation expressions](data-flow-expressions-usage.md).
- [Learn how to use Expression Builder](concepts-data-flow-expression-builder.md).
