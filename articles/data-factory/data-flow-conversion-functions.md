---
title: Conversion Functions in the Mapping Data Flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about conversion functions in mapping data flows.
author: kromerm
ms.author: makromer
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 09/26/2024
---

# Conversion functions in mapping data flows

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

This article provides details about expressions and functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Conversion function list

Conversion functions are used to convert data and test for data types

| Conversion function | Task |
|----|----|
| [ascii](data-flow-expressions-usage.md#ascii) | Returns the numeric value of the input character. If the input string has more than one character, the numeric value of the first character is returned.|
| [char](data-flow-expressions-usage.md#char) | Returns the ASCII character represented by the input number. If the number is greater than 256, the result is equivalent to char (number % 256).|
| [decode](data-flow-expressions-usage.md#decode) | Decodes the encoded input data into a string based on the specific charset. You can use a second (optional) argument to specify which charset to use: `US-ASCII`, `ISO-8859-1`, `UTF-8` (default), `UTF-16BE`, `UTF-16LE`, or `UTF-16`.|
| [encode](data-flow-expressions-usage.md#encode) | Encodes the input string data into binary based on a charset. You can use a second (optional) argument to specify which charset to use: `US-ASCII`, `ISO-8859-1`, `UTF-8` (default), `UTF-16BE`, `UTF-16LE`, or `UTF-16`.|
| [isBitSet](data-flow-expressions-usage.md#isBitSet) | Checks if a bit position is set in this bitset.|
| [setBitSet](data-flow-expressions-usage.md#setBitSet) | Sets bit positions in this bitset.|
| [isBoolean](data-flow-expressions-usage.md#isBoolean) | Checks if the string value is a Boolean value according to the rules of ``toBoolean()``.|
| [isByte](data-flow-expressions-usage.md#isByte) | Checks if the string value is a byte value given an optional format according to the rules of ``toByte()``.|
| [isDate](data-flow-expressions-usage.md#isDate) | Checks if the input date string is a date by using an optional input date format. Refer to Java's `SimpleDateFormat` class for available formats. If the input date format is omitted, the default format is ``yyyy-[M]M-[d]d``. Accepted formats are `[ yyyy, yyyy-[M]M, yyyy-[M]M-[d]d, yyyy-[M]M-[d]dT* ]`.|
| [isShort](data-flow-expressions-usage.md#isShort) | Checks if the string value is a short value given an optional format according to the rules of ``toShort()``.|
| [isInteger](data-flow-expressions-usage.md#isInteger) | Checks if the string value is an integer value given an optional format according to the rules of ``toInteger()``.|
| [isLong](data-flow-expressions-usage.md#isLong) | Checks if the string value is a long value given an optional format according to the rules of ``toLong()``.|
| [isNan](data-flow-expressions-usage.md#isNan) | Checks if a value isn't a number.|
| [isFloat](data-flow-expressions-usage.md#isFloat) | Checks if the string value is a float value given an optional format according to the rules of ``toFloat()``.|
| [isDouble](data-flow-expressions-usage.md#isDouble) | Checks if the string value is a double value given an optional format according to the rules of ``toDouble()``.|
| [isDecimal](data-flow-expressions-usage.md#isDecimal) | Checks if the string value is a decimal value given an optional format according to the rules of ``toDecimal()``.|
| [isTimestamp](data-flow-expressions-usage.md#isTimestamp) | Checks if the input date string is a time stamp by using an optional input time-stamp format. Refer to Java's `SimpleDateFormat` class for available formats. If the time stamp is omitted, the default pattern ``yyyy-[M]M-[d]d hh:mm:ss[.f...]`` is used. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, and `America/Cayman`. `Timestamp` supports up to millisecond accuracy with a value of 999. Refer to Java's `SimpleDateFormat` class for available formats.|
| [toBase64](data-flow-expressions-usage.md#toBase64) | Encodes the specific string in base64.  |
| [toBinary](data-flow-expressions-usage.md#toBinary) | Converts any numeric/date/time stamp/string to binary representation.  |
| [toBoolean](data-flow-expressions-usage.md#toBoolean) | Converts a value of (`t`, `true`, `y`, `yes`, `1`) to `true` and (`f`, `false`, `n`, `no`, `0`) to `false` and `NULL` for any other value.  |
| [toByte](data-flow-expressions-usage.md#toByte) | Converts any numeric or string to a byte value. You can use an optional Java decimal format for the conversion.  |
| [toDate](data-flow-expressions-usage.md#toDate) | Converts an input date string to date by using an optional input date format. Refer to Java's `SimpleDateFormat` class for available formats. If the input date format is omitted, the default format is `yyyy-[M]M-[d]d`. Accepted formats are `[ yyyy, yyyy-[M]M, yyyy-[M]M-[d]d, yyyy-[M]M-[d]dT* ]`.  |
| [toDecimal](data-flow-expressions-usage.md#toDecimal) | Converts any numeric or string to a decimal value. If precision and scale aren't specified, it defaults to `(10,2)`. You can use an optional Java decimal format for the conversion. Use an optional locale format in the form of a BCP47 language like en-US, de, or zh-CN.  |
| [toDouble](data-flow-expressions-usage.md#toDouble) | Converts any numeric or string to a double value. You can use an optional Java decimal format for the conversion. Use an optional locale format in the form of a BCP47 language like en-US, de, or zh-CN.  |
| [toFloat](data-flow-expressions-usage.md#toFloat) | Converts any numeric or string to a float value. You can use an optional Java decimal format for the conversion. Truncates any double.  |
| [toInteger](data-flow-expressions-usage.md#toInteger) | Converts any numeric or string to an integer value. You can use an optional Java decimal format for the conversion. Truncates any long, float, double.  |
| [toLong](data-flow-expressions-usage.md#toLong) | Converts any numeric or string to a long value. You can use an optional Java decimal format for the conversion. Truncates any float, double.  |
| [toShort](data-flow-expressions-usage.md#toShort) | Converts any numeric or string to a short value. You can use an optional Java decimal format for the conversion. Truncates any integer, long, float, double.  |
| [toString](data-flow-expressions-usage.md#toString) | Converts a primitive data type to a string. You can specify a format for numbers and date. If unspecified, the system default is picked. Java decimal format is used for numbers. Refer to Java's `SimpleDateFormat` class for all possible date formats. The default format is `yyyy-MM-dd`.  |
| [toTimestamp](data-flow-expressions-usage.md#toTimestamp) | Converts a string to a time stamp given an optional time-stamp format. If the time stamp is omitted, the default pattern `yyyy-[M]M-[d]d hh:mm:ss[.f...]` is used. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, and `America/Cayman`. `Timestamp` supports up to millisecond accuracy with a value of 999. Refer to Java's `SimpleDateFormat` class for [available formats](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html).  |
| [toUTC](data-flow-expressions-usage.md#toUTC) | Converts the time stamp to UTC. You can pass an optional time zone in the form of `GMT`, `PST`, `UTC`, and `America/Cayman`. It default to the current time zone. Refer to Java's `SimpleDateFormat` class for [available formats](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html).  |
|||

## Related content

- List of all [aggregate functions](data-flow-aggregate-functions.md).
- List of all [array functions](data-flow-array-functions.md).
- List of all [cached lookup functions](data-flow-cached-lookup-functions.md).
- List of all [date and time functions](data-flow-date-time-functions.md).
- List of all [expression functions](data-flow-expression-functions.md).
- List of all [map functions](data-flow-map-functions.md).
- List of all [metafunctions](data-flow-metafunctions.md).
- List of all [window functions](data-flow-window-functions.md).
- Usage details of all [data transformation expressions](data-flow-expressions-usage.md).
- Learn how to use [Expression Builder](concepts-data-flow-expression-builder.md).
