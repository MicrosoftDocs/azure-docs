---
title: Expression functions in the mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about expression functions in mapping data flow.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 01/12/2022
---

# Data transformation expressions in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

This article provides details about expressions and functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.


## Expression functions

In Data Factory and Synapse pipelines, use the expression language of the mapping data flow feature to configure data transformations.

| Expression function | Task |
|-----|-----|
| [abs](data-flow-expression-functions.md#abs) | Absolute value of a number.  |
| [acos](data-flow-expression-functions.md#acos) | Calculates a cosine inverse value.  |
| [add](data-flow-expression-functions.md#add) | Adds a pair of strings or numbers. Adds a date to a number of days. Adds a duration to a timestamp. Appends one array of similar type to another. Same as the + operator.  |
| [addDays](data-flow-expression-functions.md#addDays) | Add days to a date or timestamp. Same as the + operator for date.  |
| [addMonths](data-flow-expression-functions.md#addMonths) | Add months to a date or timestamp. You can optionally pass a timezone.  |
| [and](data-flow-expression-functions.md#and) | Logical AND operator. Same as &&.  |
| [asin](data-flow-expression-functions.md#asin) | Calculates an inverse sine value.  |
| [atan](data-flow-expression-functions.md#atan) | Calculates a inverse tangent value.  |
| [atan2](data-flow-expression-functions.md#atan2) | Returns the angle in radians between the positive x-axis of a plane and the point given by the coordinates.  |
| [between](data-flow-expression-functions.md#between) | Checks if the first value is in between two other values inclusively. Numeric, string and datetime values can be compared  |
| [bitwiseAnd](data-flow-expression-functions.md#bitwiseAnd) | Bitwise And operator across integral types. Same as & operator  |
| [bitwiseOr](data-flow-expression-functions.md#bitwiseOr) | Bitwise Or operator across integral types. Same as \| operator  |
| [bitwiseXor](data-flow-expression-functions.md#bitwiseXor) | Bitwise Or operator across integral types. Same as \| operator  |
| [blake2b](data-flow-expression-functions.md#blake2b) | Calculates the Blake2 digest of set of column of varying primitive datatypes given a bit length which can only be multiples of 8 between 8 & 512. It can be used to calculate a fingerprint for a row  |
| [blake2bBinary](data-flow-expression-functions.md#blake2bBinary) | Calculates the Blake2 digest of set of column of varying primitive datatypes given a bit length which can only be multiples of 8 between 8 & 512. It can be used to calculate a fingerprint for a row  |
| [case](data-flow-expression-functions.md#case) | Based on alternating conditions applies one value or the other. If the number of inputs are even, the other is defaulted to NULL for last condition.  |
| [cbrt](data-flow-expression-functions.md#cbrt) | Calculates the cube root of a number.  |
| [ceil](data-flow-expression-functions.md#ceil) | Returns the smallest integer not smaller than the number.  |
| [coalesce](data-flow-expression-functions.md#coalesce) | Returns the first not null value from a set of inputs. All inputs should be of the same type.  |
| [columnNames](data-flow-expression-functions.md#columnNames) | Gets the names of all output columns for a stream. You can pass an optional stream name as the second argument.  |
| [columns](data-flow-expression-functions.md#columns) | Gets the values of all output columns for a stream. You can pass an optional stream name as the second argument.   |
| [compare](data-flow-expression-functions.md#compare) | Compares two values of the same type. Returns negative integer if value1 < value2, 0 if value1 == value2, positive value if value1 > value2.  |
| [concat](data-flow-expression-functions.md#concat) | Concatenates a variable number of strings together. Same as the + operator with strings.  |
| [concatWS](data-flow-expression-functions.md#concatWS) | Concatenates a variable number of strings together with a separator. The first parameter is the separator.  |
| [cos](data-flow-expression-functions.md#cos) | Calculates a cosine value.  |
| [cosh](data-flow-expression-functions.md#cosh) | Calculates a hyperbolic cosine of a value.  |
| [crc32](data-flow-expression-functions.md#crc32) | Calculates the CRC32 hash of set of column of varying primitive datatypes given a bit length which can only be of values 0(256), 224, 256, 384, 512. It can be used to calculate a fingerprint for a row.  |
| [currentDate](data-flow-expression-functions.md#currentDate) | Gets the current date when this job starts to run. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. [https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html). |
| [currentTimestamp](data-flow-expression-functions.md#currentTimestamp) | Gets the current timestamp when the job starts to run with local time zone.  |
| [currentUTC](data-flow-expression-functions.md#currentUTC) | Gets the current timestamp as UTC. If you want your current time to be interpreted in a different timezone than your cluster time zone, you can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. It is defaulted to the current timezone. Refer Java's `SimpleDateFormat` class for available formats. [https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html). To convert the UTC time to a different timezone use `fromUTC()`.  |
| [dayOfMonth](data-flow-expression-functions.md#dayOfMonth) | Gets the day of the month given a date.  |
| [dayOfWeek](data-flow-expression-functions.md#dayOfWeek) | Gets the day of the week given a date. 1 - Sunday, 2 - Monday ..., 7 - Saturday.  |
| [dayOfYear](data-flow-expression-functions.md#dayOfYear) | Gets the day of the year given a date.  |
| [days](data-flow-expression-functions.md#days) | Duration in milliseconds for number of days.  |
| [degrees](data-flow-expression-functions.md#degrees) | Converts radians to degrees.  |
| [divide](data-flow-expression-functions.md#divide) | Divides pair of numbers. Same as the `/` operator.  |
| [dropLeft](data-flow-expression-functions.md#dropLeft) | Removes as many characters from the left of the string. If the drop requested exceeds the length of the string, an empty string is returned.|
| [dropRight](data-flow-expression-functions.md#dropRight) | Removes as many characters from the right of the string. If the drop requested exceeds the length of the string, an empty string is returned.|
| [endsWith](data-flow-expression-functions.md#endsWith) | Checks if the string ends with the supplied string.  |
| [equals](data-flow-expression-functions.md#equals) | Comparison equals operator. Same as == operator.  |
| [equalsIgnoreCase](data-flow-expression-functions.md#equalsIgnoreCase) | Comparison equals operator ignoring case. Same as <=> operator.  |
| [escape](data-flow-expression-functions.md#escape) | Escapes a string according to a format. Literal values for acceptable format are 'json', 'xml', 'ecmascript', 'html', 'java'.|
| [expr](data-flow-expression-functions.md#expr) | Results in a expression from a string. This is the same as writing this expression in a non-literal form. This can be used to pass parameters as string representations.|
| [factorial](data-flow-expression-functions.md#factorial) | Calculates the factorial of a number.  |
| [false](data-flow-expression-functions.md#false) | Always returns a false value. Use the function `syntax(false())` if there is a column named 'false'.  |
| [floor](data-flow-expression-functions.md#floor) | Returns the largest integer not greater than the number.  |
| [fromBase64](data-flow-expression-functions.md#fromBase64) | Decodes the given base64-encoded string.|
| [fromUTC](data-flow-expression-functions.md#fromUTC) | Converts to the timestamp from UTC. You can optionally pass the timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. It is defaulted to the current timezone. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [greater](data-flow-expression-functions.md#greater) | Comparison greater operator. Same as > operator.  |
| [greaterOrEqual](data-flow-expression-functions.md#greaterOrEqual) | Comparison greater than or equal operator. Same as >= operator.  |
| [greatest](data-flow-expression-functions.md#greatest) | Returns the greatest value among the list of values as input skipping null values. Returns null if all inputs are null.  |
| [hasColumn](data-flow-expression-functions.md#hasColumn) | Checks for a column value by name in the stream. You can pass a optional stream name as the second argument. Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions.  |
| [hour](data-flow-expression-functions.md#hour) | Gets the hour value of a timestamp. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [hours](data-flow-expression-functions.md#hours) | Duration in milliseconds for number of hours.  |
| [iif](data-flow-expression-functions.md#iif) | Based on a condition applies one value or the other. If other is unspecified it is considered NULL. Both the values must be compatible(numeric, string...).  |
| [iifNull](data-flow-expression-functions.md#iifNull) | Checks if the first parameter is null. If not null, the first parameter is returned. If null, the second parameter is returned. If three parameters are specified, the behavior is the same as iif(isNull(value1), value2, value3) and the third parameter is returned if the first value is not null.  |
| [initCap](data-flow-expression-functions.md#initCap) | Converts the first letter of every word to uppercase. Words are identified as separated by whitespace.  |
| [instr](data-flow-expression-functions.md#instr) | Finds the position(1 based) of the substring within a string. 0 is returned if not found.  |
| [isDelete](data-flow-expression-functions.md#isDelete) | Checks if the row is marked for delete. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  |
| [isError](data-flow-expression-functions.md#isError) | Checks if the row is marked as error. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  |
| [isIgnore](data-flow-expression-functions.md#isIgnore) | Checks if the row is marked to be ignored. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  |
| [isInsert](data-flow-expression-functions.md#isInsert) | Checks if the row is marked for insert. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  |
| [isMatch](data-flow-expression-functions.md#isMatch) | Checks if the row is matched at lookup. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  |
| [isNull](data-flow-expression-functions.md#isNull) | Checks if the value is NULL.  |
| [isUpdate](data-flow-expression-functions.md#isUpdate) | Checks if the row is marked for update. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  |
| [isUpsert](data-flow-expression-functions.md#isUpsert) | Checks if the row is marked for insert. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  |
| [jaroWinkler](data-flow-expression-functions.md#jaroWinkler) | Gets the JaroWinkler distance between two strings. |
| [lastDayOfMonth](data-flow-expression-functions.md#lastDayOfMonth) | Gets the last date of the month given a date.  |
| [least](data-flow-expression-functions.md#least) | Comparison lesser than or equal operator. Same as <= operator.  |
| [left](data-flow-expression-functions.md#left) | Extracts a substring start at index 1 with number of characters. Same as SUBSTRING(str, 1, n).  |
| [length](data-flow-expression-functions.md#length) | Returns the length of the string.  |
| [lesser](data-flow-expression-functions.md#lesser) | Comparison less operator. Same as < operator.  |
| [lesserOrEqual](data-flow-expression-functions.md#lesserOrEqual) | Comparison lesser than or equal operator. Same as <= operator.  |
| [levenshtein](data-flow-expression-functions.md#levenshtein) | Gets the levenshtein distance between two strings.  |
| [like](data-flow-expression-functions.md#like) | The pattern is a string that is matched literally. The exceptions are the following special symbols:  _ matches any one character in the input (similar to . in ```posix``` regular expressions)|
| [locate](data-flow-expression-functions.md#locate) | Finds the position(1 based) of the substring within a string starting a certain position. If the position is omitted it is considered from the beginning of the string. 0 is returned if not found.  |
| [log](data-flow-expression-functions.md#log) | Calculates log value. An optional base can be supplied else a Euler number if used.  |
| [log10](data-flow-expression-functions.md#log10) | Calculates log value based on 10 base.  |
| [lower](data-flow-expression-functions.md#lower) | Lowercases a string.  |
| [lpad](data-flow-expression-functions.md#lpad) | Left pads the string by the supplied padding until it is of a certain length. If the string is equal to or greater than the length, then it is trimmed to the length.  |
| [ltrim](data-flow-expression-functions.md#ltrim) | Left trims a string of leading characters. If second parameter is unspecified, it trims whitespace. Else it trims any character specified in the second parameter.  |
| [md5](data-flow-expression-functions.md#md5) | Calculates the MD5 digest of set of column of varying primitive datatypes and returns a 32 character hex string. It can be used to calculate a fingerprint for a row.  |
| [millisecond](data-flow-expression-functions.md#millisecond) | Gets the millisecond value of a date. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [milliseconds](data-flow-expression-functions.md#milliseconds) | Duration in milliseconds for number of milliseconds.  |
| [minus](data-flow-expression-functions.md#minus) | Subtracts numbers. Subtract number of days from a date. Subtract duration from a timestamp. Subtract two timestamps to get difference in milliseconds. Same as the - operator.  |
| [minute](data-flow-expression-functions.md#minute) | Gets the minute value of a timestamp. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [minutes](data-flow-expression-functions.md#minutes) | Duration in milliseconds for number of minutes.  |
| [mod](data-flow-expression-functions.md#mod) | Modulus of pair of numbers. Same as the % operator.  |
| [month](data-flow-expression-functions.md#month) | Gets the month value of a date or timestamp.  |
| [monthsBetween](data-flow-expression-functions.md#monthsBetween) | Gets the number of months between two dates. You can round off the calculation.You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [multiply](data-flow-expression-functions.md#multiply) | Multiplies pair of numbers. Same as the * operator.  |
| [negate](data-flow-expression-functions.md#negate) | Negates a number. Turns positive numbers to negative and vice versa.  |
| [nextSequence](data-flow-expression-functions.md#nextSequence) | Returns the next unique sequence. The number is consecutive only within a partition and is prefixed by the partitionId.  |
| [normalize](data-flow-expression-functions.md#normalize) | Normalizes the string value to separate accented unicode characters.  |
| [not](data-flow-expression-functions.md#not) | Logical negation operator.  |
| [notEquals](data-flow-expression-functions.md#notEquals) | Comparison not equals operator. Same as != operator.  |
| [notNull](data-flow-expression-functions.md#notNull) | Checks if the value is not NULL.  |
| [null](data-flow-expression-functions.md#null) | Returns a NULL value. Use the function `syntax(null())` if there is a column named 'null'. Any operation that uses will result in a NULL.  |
| [or](data-flow-expression-functions.md#or) | Logical OR operator. Same as \|\|.  |
| [pMod](data-flow-expression-functions.md#pMod) | Positive Modulus of pair of numbers.  |
| [partitionId](data-flow-expression-functions.md#partitionId) | Returns the current partition ID the input row is in.  |
| [power](data-flow-expression-functions.md#power) | Raises one number to the power of another.  |
| [radians](data-flow-expression-functions.md#radians) | Converts degrees to radians|
| [random](data-flow-expression-functions.md#random) | Returns a random number given an optional seed within a partition. The seed should be a fixed value and is used in conjunction with the partitionId to produce random values  |
| [regexExtract](data-flow-expression-functions.md#regexExtract) | Extract a matching substring for a given regex pattern. The last parameter identifies the match group and is defaulted to 1 if omitted. Use `<regex>`(back quote) to match a string without escaping.  |
| [regexMatch](data-flow-expression-functions.md#regexMatch) | Checks if the string matches the given regex pattern. Use `<regex>`(back quote) to match a string without escaping.  |
| [regexReplace](data-flow-expression-functions.md#regexReplace) | Replace all occurrences of a regex pattern with another substring in the given string Use `<regex>`(back quote) to match a string without escaping.  |
| [regexSplit](data-flow-expression-functions.md#regexSplit) | Splits a string based on a delimiter based on regex and returns an array of strings.  |
| [replace](data-flow-expression-functions.md#replace) | Replace all occurrences of a substring with another substring in the given string. If the last parameter is omitted, it is default to empty string.  |
| [reverse](data-flow-expression-functions.md#reverse) | Reverses a string.  |
| [right](data-flow-expression-functions.md#right) | Extracts a substring with number of characters from the right. Same as SUBSTRING(str, LENGTH(str) - n, n).  |
| [rlike](data-flow-expression-functions.md#rlike) | Checks if the string matches the given regex pattern.  |
| [round](data-flow-expression-functions.md#round) | Rounds a number given an optional scale and an optional rounding mode. If the scale is omitted, it is defaulted to 0. If the mode is omitted, it is defaulted to ROUND_HALF_UP(5). The values for rounding include|
| [rpad](data-flow-expression-functions.md#rpad) | Right pads the string by the supplied padding until it is of a certain length. If the string is equal to or greater than the length, then it is trimmed to the length.  |
| [rtrim](data-flow-expression-functions.md#rtrim) | Right trims a string of trailing characters. If second parameter is unspecified, it trims whitespace. Else it trims any character specified in the second parameter.  |
| [second](data-flow-expression-functions.md#second) | Gets the second value of a date. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [seconds](data-flow-expression-functions.md#seconds) | Duration in milliseconds for number of seconds.  |
| [sha1](data-flow-expression-functions.md#sha1) | Calculates the SHA-1 digest of set of column of varying primitive datatypes and returns a 40 character hex string. It can be used to calculate a fingerprint for a row.  |
| [sha2](data-flow-expression-functions.md#sha2) | Calculates the SHA-2 digest of set of column of varying primitive datatypes given a bit length which can only be of values 0(256), 224, 256, 384, 512. It can be used to calculate a fingerprint for a row.  |
| [sin](data-flow-expression-functions.md#sin) | Calculates a sine value.  |
| [sinh](data-flow-expression-functions.md#sinh) | Calculates a hyperbolic sine value.  |
| [soundex](data-flow-expression-functions.md#soundex) | Gets the ```soundex``` code for the string.  |
| [split](data-flow-expression-functions.md#split) | Splits a string based on a delimiter and returns an array of strings.  |
| [sqrt](data-flow-expression-functions.md#sqrt) | Calculates the square root of a number.  |
| [startsWith](data-flow-expression-functions.md#startsWith) | Checks if the string starts with the supplied string.  |
| [subDays](data-flow-expression-functions.md#subDays) | Subtract days from a date or timestamp. Same as the - operator for date.  |
| [subMonths](data-flow-expression-functions.md#subMonths) | Subtract months from a date or timestamp.  |
| [substring](data-flow-expression-functions.md#substring) | Extracts a substring of a certain length from a position. Position is 1 based. If the length is omitted, it is defaulted to end of the string.  |
| [tan](data-flow-expression-functions.md#tan) | Calculates a tangent value.  |
| [tanh](data-flow-expression-functions.md#tanh) | Calculates a hyperbolic tangent value.  |
| [translate](data-flow-expression-functions.md#translate) | Replace one set of characters by another set of characters in the string. Characters have 1 to 1 replacement.  |
| [trim](data-flow-expression-functions.md#trim) | Trims a string of leading and trailing characters. If second parameter is unspecified, it trims whitespace. Else it trims any character specified in the second parameter.  |
| [true](data-flow-expression-functions.md#true) | Always returns a true value. Use the function `syntax(true())` if there is a column named 'true'.  |
| [typeMatch](data-flow-expression-functions.md#typeMatch) | Matches the type of the column. Can only be used in pattern expressions.number matches short, integer, long, double, float or decimal, integral matches short, integer, long, fractional matches double, float, decimal and datetime matches date or timestamp type.  |
| [unescape](data-flow-expression-functions.md#unescape) | Unescapes a string according to a format. Literal values for acceptable format are 'json', 'xml', 'ecmascript', 'html', 'java'.|
| [upper](data-flow-expression-functions.md#upper) | Uppercases a string.  |
| [uuid](data-flow-expression-functions.md#uuid) | Returns the generated UUID.  |
| [weekOfYear](data-flow-expression-functions.md#weekOfYear) | Gets the week of the year given a date.  |
| [weeks](data-flow-expression-functions.md#weeks) | Duration in milliseconds for number of weeks.  |
| [xor](data-flow-expression-functions.md#xor) | Logical XOR operator. Same as ^ operator.  |
| [year](data-flow-expression-functions.md#year) | Gets the year value of a date.  |
|||

## Aggregate functions
The following functions are only available in aggregate, pivot, unpivot, and window transformations.

| Aggregate function | Task |
|----|----|
| [approxDistinctCount](data-flow-expression-functions.md#approxDistinctCount) | Gets the approximate aggregate count of distinct values for a column. The optional second parameter is to control the estimation error.|
| [avg](data-flow-expression-functions.md#avg) | Gets the average of values of a column.  |
| [avgIf](data-flow-expression-functions.md#avgIf) | Based on a criteria gets the average of values of a column.  |
| [collect](data-flow-expression-functions.md#collect) | Collects all values of the expression in the aggregated group into an array. Structures can be collected and transformed to alternate structures during this process. The number of items will be equal to the number of rows in that group and can contain null values. The number of collected items should be small.  |
| [count](data-flow-expression-functions.md#count) | Gets the aggregate count of values. If the optional column(s) is specified, it ignores NULL values in the count.  |
| [countAll](data-flow-expression-functions.md#countAll) | Gets the aggregate count of values including NULLs.  |
| [countDistinct](data-flow-expression-functions.md#countDistinct) | Gets the aggregate count of distinct values of a set of columns.  |
| [countAllDistinct](data-flow-expression-functions.md#countAllDistinct) | Gets the aggregate count of distinct values of a set of columns including NULLs.  |
| [countIf](data-flow-expression-functions.md#countIf) | Based on a criteria gets the aggregate count of values. If the optional column is specified, it ignores NULL values in the count.  |
| [covariancePopulation](data-flow-expression-functions.md#covariancePopulation) | Gets the population covariance between two columns.  |
| [covariancePopulationIf](data-flow-expression-functions.md#covariancePopulationIf) | Based on a criteria, gets the population covariance of two columns.  |
| [covarianceSample](data-flow-expression-functions.md#covarianceSample) | Gets the sample covariance of two columns.  |
| [covarianceSampleIf](data-flow-expression-functions.md#covarianceSampleIf) | Based on a criteria, gets the sample covariance of two columns.  |
| [first](data-flow-expression-functions.md#first) | Gets the first value of a column group. If the second parameter ignoreNulls is omitted, it is assumed false.  |
| [isDistinct](data-flow-expression-functions.md#isDistinct) | Finds if a column or set of columns is distinct. It does not count null as a distinct value|
| [kurtosis](data-flow-expression-functions.md#kurtosis) | Gets the kurtosis of a column.  |
| [kurtosisIf](data-flow-expression-functions.md#kurtosisIf) | Based on a criteria, gets the kurtosis of a column.  |
| [last](data-flow-expression-functions.md#last) | Gets the last value of a column group. If the second parameter ignoreNulls is omitted, it is assumed false.  |
| [max](data-flow-expression-functions.md#max) | Gets the maximum value of a column.  |
| [maxIf](data-flow-expression-functions.md#maxIf) | Based on a criteria, gets the maximum value of a column.  |
| [mean](data-flow-expression-functions.md#mean) | Gets the mean of values of a column. Same as AVG.  |
| [meanIf](data-flow-expression-functions.md#meanIf) | Based on a criteria gets the mean of values of a column. Same as avgIf.  |
| [min](data-flow-expression-functions.md#min) | Gets the minimum value of a column.  |
| [minIf](data-flow-expression-functions.md#minIf) | Based on a criteria, gets the minimum value of a column.  |
| [skewness](data-flow-expression-functions.md#skewness) | Gets the skewness of a column.  |
| [skewnessIf](data-flow-expression-functions.md#skewnessIf) | Based on a criteria, gets the skewness of a column.  |
| [stddev](data-flow-expression-functions.md#stddev) | Gets the standard deviation of a column.  |
| [stddevIf](data-flow-expression-functions.md#stddevIf) | Based on a criteria, gets the standard deviation of a column.  |
| [stddevPopulation](data-flow-expression-functions.md#stddevPopulation) | Gets the population standard deviation of a column.  |
| [stddevPopulationIf](data-flow-expression-functions.md#stddevPopulationIf) | Based on a criteria, gets the population standard deviation of a column.  |
| [stddevSample](data-flow-expression-functions.md#stddevSample) | Gets the sample standard deviation of a column.  |
| [stddevSampleIf](data-flow-expression-functions.md#stddevSampleIf) | Based on a criteria, gets the sample standard deviation of a column.  |
| [sum](data-flow-expression-functions.md#sum) | Gets the aggregate sum of a numeric column.  |
| [sumDistinct](data-flow-expression-functions.md#sumDistinct) | Gets the aggregate sum of distinct values of a numeric column.  |
| [sumDistinctIf](data-flow-expression-functions.md#sumDistinctIf) | Based on criteria gets the aggregate sum of a numeric column. The condition can be based on any column.  |
| [sumIf](data-flow-expression-functions.md#sumIf) | Based on criteria gets the aggregate sum of a numeric column. The condition can be based on any column.  |
| [variance](data-flow-expression-functions.md#variance) | Gets the variance of a column.  |
| [varianceIf](data-flow-expression-functions.md#varianceIf) | Based on a criteria, gets the variance of a column.  |
| [variancePopulation](data-flow-expression-functions.md#variancePopulation) | Gets the population variance of a column.  |
| [variancePopulationIf](data-flow-expression-functions.md#variancePopulationIf) | Based on a criteria, gets the population variance of a column.  |
| [varianceSample](data-flow-expression-functions.md#varianceSample) | Gets the unbiased variance of a column.  |
| [varianceSampleIf](data-flow-expression-functions.md#varianceSampleIf) | Based on a criteria, gets the unbiased variance of a column.  |
|||

## Array functions
Array functions perform transformations on data structures that are arrays. These include special keywords to address array elements and indexes:

* ```#acc``` represents a value that you wish to include in your single output when reducing an array
* ```#index``` represents the current array index, along with array index numbers ```#index2, #index3 ...```
* ```#item``` represents the current element value in the array

| Array function | Task |
|----|----|
| [array](data-flow-expression-functions.md#array) | Creates an array of items. All items should be of the same type. If no items are specified, an empty string array is the default. Same as a [] creation operator.  |
| [at](data-flow-expression-functions.md#at) | Finds the element at an array index. The index is 1-based. Out of bounds index results in a null value. Finds a value in a map given a key. If the key is not found it returns null.|
| [contains](data-flow-expression-functions.md#contains) | Returns true if any element in the provided array evaluates as true in the provided predicate. Contains expects a reference to one element in the predicate function as #item.  |
| [distinct](data-flow-expression-functions.md#distinct) | Returns a distinct set of items from an array.|
| [except](data-flow-expression-functions.md#except) | Returns a difference set of one array from another dropping duplicates.|
| [filter](data-flow-expression-functions.md#filter) | Filters elements out of the array that do not meet the provided predicate. Filter expects a reference to one element in the predicate function as #item.  |
| [find](data-flow-expression-functions.md#find) | Find the first item from an array that match the condition. It takes a filter function where you can address the item in the array as #item. For deeply nested maps you can refer to the parent maps using the #item_n(#item_1, #item_2...) notation.  |
| [flatten](data-flow-expression-functions.md#flatten) | Flattens array or arrays into a single array. Arrays of atomic items are returned unaltered. The last argument is optional and is defaulted to false to flatten recursively more than one level deep.|
| [in](data-flow-expression-functions.md#in) | Checks if an item is in the array.  |
| [intersect](data-flow-expression-functions.md#intersect) | Returns an intersection set of distinct items from 2 arrays.|
| [map](data-flow-expression-functions.md#map) | Maps each element of the array to a new element using the provided expression. Map expects a reference to one element in the expression function as #item.  |
| [mapIf](data-flow-expression-functions.md#mapIf) | Conditionally maps an array to another array of same or smaller length. The values can be of any datatype including structTypes. It takes a mapping function where you can address the item in the array as #item and current index as #index. For deeply nested maps you can refer to the parent maps using the ``#item_[n](#item_1, #index_1...)`` notation.|
| [mapIndex](data-flow-expression-functions.md#mapIndex) | Maps each element of the array to a new element using the provided expression. Map expects a reference to one element in the expression function as #item and a reference to the element index as #index.  |
| [mapLoop](data-flow-expression-functions.md#mapLoop) | Loops through from 1 to length to create an array of that length. It takes a mapping function where you can address the index in the array as #index. For deeply nested maps you can refer to the parent maps using the #index_n(#index_1, #index_2...) notation.|
| [reduce](data-flow-expression-functions.md#reduce) | Accumulates elements in an array. Reduce expects a reference to an accumulator and one element in the first expression function as #acc and #item and it expects the resulting value as #result to be used in the second expression function.  |
| [size](data-flow-expression-functions.md#size) | Finds the size of an array or map type  |
| [slice](data-flow-expression-functions.md#slice) | Extracts a subset of an array from a position. Position is 1 based. If the length is omitted, it is defaulted to end of the string.  |
| [sort](data-flow-expression-functions.md#sort) | Sorts the array using the provided predicate function. Sort expects a reference to two consecutive elements in the expression function as #item1 and #item2.  |
| [unfold](data-flow-expression-functions.md#unfold) | Unfolds an array into a set of rows and repeats the values for the remaining columns in every row.|
| [union](data-flow-expression-functions.md#union) | Returns a union set of distinct items from 2 arrays.|
|||

## Cached lookup functions
The following functions are only available when using a cached lookup when you've included a cached sink.

| Cached lookup function | Task |
|----|----|
| [lookup](data-flow-expression-functions.md#lookup) | Looks up the first row from the cached sink using the specified keys that match the keys from the cached sink.|
| [mlookup](data-flow-expression-functions.md#mlookup) | Looks up the all matching rows from the cached sink using the specified keys that match the keys from the cached sink.|
| [output](data-flow-expression-functions.md#output) | Returns the first row of the results of the cache sink|
| [outputs](data-flow-expression-functions.md#outputs) | Returns the entire output row set of the results of the cache sink|
|||

## Conversion functions

Conversion functions are used to convert data and test for data types

| Conversion function | Task |
|----|----|
| [isBitSet](data-flow-expression-functions.md#isBitSet) | Checks if a bit position is set in this bitset|
| [setBitSet](data-flow-expression-functions.md#setBitSet) | Sets bit positions in this bitset|
| [isBoolean](data-flow-expression-functions.md#isBoolean) | Checks if the string value is a boolean value according to the rules of ``toBoolean()``|
| [isByte](data-flow-expression-functions.md#isByte) | Checks if the string value is a byte value given an optional format according to the rules of ``toByte()``|
| [isDate](data-flow-expression-functions.md#isDate) | Checks if the input date string is a date using an optional input date format. Refer Java's SimpleDateFormat for available formats. If the input date format is omitted, default format is ``yyyy-[M]M-[d]d``. Accepted formats are ``[ yyyy, yyyy-[M]M, yyyy-[M]M-[d]d, yyyy-[M]M-[d]dT* ]``|
| [isShort](data-flow-expression-functions.md#isShort) | Checks of the string value is a short value given an optional format according to the rules of ``toShort()``|
| [isInteger](data-flow-expression-functions.md#isInteger) | Checks of the string value is a integer value given an optional format according to the rules of ``toInteger()``|
| [isLong](data-flow-expression-functions.md#isLong) | Checks of the string value is a long value given an optional format according to the rules of ``toLong()``|
| [isNan](data-flow-expression-functions.md#isNan) | Check if this is not a number.|
| [isFloat](data-flow-expression-functions.md#isFloat) | Checks of the string value is a float value given an optional format according to the rules of ``toFloat()``|
| [isDouble](data-flow-expression-functions.md#isDouble) | Checks of the string value is a double value given an optional format according to the rules of ``toDouble()``|
| [isDecimal](data-flow-expression-functions.md#isDecimal) | Checks of the string value is a decimal value given an optional format according to the rules of ``toDecimal()``|
| [isTimestamp](data-flow-expression-functions.md#isTimestamp) | Checks if the input date string is a timestamp using an optional input timestamp format. Refer to Java's SimpleDateFormat for available formats. If the timestamp is omitted the default pattern ``yyyy-[M]M-[d]d hh:mm:ss[.f...]`` is used. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. Timestamp supports up to millisecond accuracy with value of 999 Refer to Java's SimpleDateFormat for available formats.|
| [toBase64](data-flow-expression-functions.md#toBase64) | Encodes the given string in base64.  |
| [toBinary](data-flow-expression-functions.md#toBinary) | Converts any numeric/date/timestamp/string to binary representation.  |
| [toBoolean](data-flow-expression-functions.md#toBoolean) | Converts a value of ('t', 'true', 'y', 'yes', '1') to true and ('f', 'false', 'n', 'no', '0') to false and NULL for any other value.  |
| [toByte](data-flow-expression-functions.md#toByte) | Converts any numeric or string to a byte value. An optional Java decimal format can be used for the conversion.  |
| [toDate](data-flow-expression-functions.md#toDate) | Converts input date string to date using an optional input date format. Refer Java's `SimpleDateFormat` class for available formats. If the input date format is omitted, default format is yyyy-[M]M-[d]d. Accepted formats are :[ yyyy, yyyy-[M]M, yyyy-[M]M-[d]d, yyyy-[M]M-[d]dT* ].  |
| [toDecimal](data-flow-expression-functions.md#toDecimal) | Converts any numeric or string to a decimal value. If precision and scale are not specified, it is defaulted to (10,2).An optional Java decimal format can be used for the conversion. An optional locale format in the form of BCP47 language like en-US, de, zh-CN.  |
| [toDouble](data-flow-expression-functions.md#toDouble) | Converts any numeric or string to a double value. An optional Java decimal format can be used for the conversion. An optional locale format in the form of BCP47 language like en-US, de, zh-CN.  |
| [toFloat](data-flow-expression-functions.md#toFloat) | Converts any numeric or string to a float value. An optional Java decimal format can be used for the conversion. Truncates any double.  |
| [toInteger](data-flow-expression-functions.md#toInteger) | Converts any numeric or string to an integer value. An optional Java decimal format can be used for the conversion. Truncates any long, float, double.  |
| [toLong](data-flow-expression-functions.md#toLong) | Converts any numeric or string to a long value. An optional Java decimal format can be used for the conversion. Truncates any float, double.  |
| [toShort](data-flow-expression-functions.md#toShort) | Converts any numeric or string to a short value. An optional Java decimal format can be used for the conversion. Truncates any integer, long, float, double.  |
| [toString](data-flow-expression-functions.md#toString) | Converts a primitive datatype to a string. For numbers and date a format can be specified. If unspecified the system default is picked.Java decimal format is used for numbers. Refer to Java SimpleDateFormat for all possible date formats; the default format is yyyy-MM-dd.  |
| [toTimestamp](data-flow-expression-functions.md#toTimestamp) | Converts a string to a timestamp given an optional timestamp format. If the timestamp is omitted the default pattern yyyy-[M]M-[d]d hh:mm:ss[.f...] is used. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. Timestamp supports up to millisecond accuracy with value of 999. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
| [toUTC](data-flow-expression-functions.md#toUTC) | Converts the timestamp to UTC. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. It is defaulted to the current timezone. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  |
|||

## Map functions

  Map functions perform operations on map data types

| Map function | Task |
|----|----|
| [associate](data-flow-expression-functions.md#associate) | Creates a map of key/values. All the keys & values should be of the same type. If no items are specified, it is defaulted to a map of string to string type.Same as a ```[ -> ]``` creation operator. Keys and values should alternate with each other.|
| [keyValues](data-flow-expression-functions.md#keyValues) | Creates a map of key/values. The first parameter is an array of keys and second is the array of values. Both arrays should have equal length.|
| [mapAssociation](data-flow-expression-functions.md#mapAssociation) | Transforms a map by associating the keys to new values. Returns an array. It takes a mapping function where you can address the item as #key and current value as #value. |
| [reassociate](data-flow-expression-functions.md#reassociate) | Transforms a map by associating the keys to new values. It takes a mapping function where you can address the item as #key and current value as #value.  |
|||

## Metafunctions

Metafunctions primarily function on metadata in your data flow

| Metafunction  | Task |
|----|----|
| [byItem](data-flow-expression-functions.md#byItem) | Find a sub item within a structure or array of structure If there are multiple matches, the first match is returned. If no match it returns a NULL value. The returned value has to be type converted by one of the type conversion actions(? date, ? string ...).  Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions  |
| [byOrigin](data-flow-expression-functions.md#byOrigin) | Selects a column value by name in the origin stream. The second argument is the origin stream name. If there are multiple matches, the first match is returned. If no match it returns a NULL value. The returned value has to be type converted by one of the type conversion functions(TO_DATE, TO_STRING ...). Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions.  |
| [byOrigins](data-flow-expression-functions.md#byOrigins) | Selects an array of columns by name in the stream. The second argument is the stream where it originated from. If there are multiple matches, the first match is returned. If no match it returns a NULL value. The returned value has to be type converted by one of the type conversion functions(TO_DATE, TO_STRING ...) Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions.|
| [byName](data-flow-expression-functions.md#byName) | Selects a column value by name in the stream. You can pass a optional stream name as the second argument. If there are multiple matches, the first match is returned. If no match it returns a NULL value. The returned value has to be type converted by one of the type conversion functions(TO_DATE, TO_STRING ...).  Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions.  |
| [byNames](data-flow-expression-functions.md#byNames) | Select an array of columns by name in the stream. You can pass a optional stream name as the second argument. If there are multiple matches, the first match is returned. If there are no matches for a column, the entire output is a NULL value. The returned value requires a type conversion functions (toDate, toString, ...).  Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions.|
| [byPath](data-flow-expression-functions.md#byPath) | Finds a hierarchical path by name in the stream. You can pass an optional stream name as the second argument. If no such path is found it returns null. Column names/paths known at design time should be addressed just by their name or dot notation path. Computed inputs are not supported but you can use parameter substitutions.  |
| [byPosition](data-flow-expression-functions.md#byPosition) | Selects a column value by its relative position(1 based) in the stream. If the position is out of bounds it returns a NULL value. The returned value has to be type converted by one of the type conversion functions(TO_DATE, TO_STRING ...) Computed inputs are not supported but you can use parameter substitutions.  |
| [hasPath](data-flow-expression-functions.md#hasPath) | Checks if a certain hierarchical path exists by name in the stream. You can pass an optional stream name as the second argument. Column names/paths known at design time should be addressed just by their name or dot notation path. Computed inputs are not supported but you can use parameter substitutions.  |
| [originColumns](data-flow-expression-functions.md#originColumns) | Gets all output columns for a origin stream where columns were created. Must be enclosed in another function.|
| [hex](data-flow-expression-functions.md#hex) | Returns a hex string representation of a binary value|
| [unhex](data-flow-expression-functions.md#unhex) | Unhexes a binary value from its string representation. This can be used in conjunction with sha2, md5 to convert from string to binary representation|
|||

## Window functions

The following functions are only available in window transformations.

| Windows function | Task |
|----|----|
| [cumeDist](data-flow-expression-functions.md#cumeDist) | The CumeDist function computes the position of a value relative to all values in the partition. The result is the number of rows preceding or equal to the current row in the ordering of the partition divided by the total number of rows in the window partition. Any tie values in the  ordering will evaluate to the same position.  |
| [denseRank](data-flow-expression-functions.md#denseRank) | Computes the rank of a value in a group of values specified in a window's order by clause. The result is one plus the number of rows preceding or equal to the current row in the ordering of the partition. The values will not produce gaps in the sequence. Dense Rank works even when data is not sorted and looks for change in values.  |
| [lag](data-flow-expression-functions.md#lag) | Gets the value of the first parameter evaluated n rows before the current row. The second parameter is the number of rows to look back and the default value is 1. If there are not as many rows a value of null is returned unless a default value is specified.  |
| [lead](data-flow-expression-functions.md#lead) | Gets the value of the first parameter evaluated n rows after the current row. The second parameter is the number of rows to look forward and the default value is 1. If there are not as many rows a value of null is returned unless a default value is specified.  |
| [nTile](data-flow-expression-functions.md#nTile) | The ```NTile``` function divides the rows for each window partition into `n` buckets ranging from 1 to at most `n`. Bucket values will differ by at most 1. If the number of rows in the partition does not divide evenly into the number of buckets, then the remainder values are distributed one per bucket, starting with the first bucket. The ```NTile``` function is useful for the calculation of ```tertiles```, quartiles, deciles, and other common summary statistics. The function calculates two variables during initialization: The size of a regular bucket will have one extra row added to it. Both variables are based on the size of the current partition. During the calculation process the function keeps track of the current row number, the current bucket number, and the row number at which the bucket will change (bucketThreshold). When the current row number reaches bucket threshold, the bucket value is increased by one and the threshold is increased by the bucket size (plus one extra if the current bucket is padded).  |
| [rank](data-flow-expression-functions.md#rank) | Computes the rank of a value in a group of values specified in a window's order by clause. The result is one plus the number of rows preceding or equal to the current row in the ordering of the partition. The values will produce gaps in the sequence. Rank works even when data is not sorted and looks for change in values.  |
| [rowNumber](data-flow-expression-functions.md#rowNumber) | Assigns a sequential row numbering for rows in a window starting with 1.  |
|||

## Alphabetical listing of all functions

Following is an alphabetical listing of all functions available in mapping data flows.

<a name="abs" ></a>

### <code>abs</code>
<code><b>abs(<i>&lt;value1&gt;</i> : number) => number</b></code><br/><br/>
Absolute value of a number.  
* ``abs(-20) -> 20``  
* ``abs(10) -> 10``  
___   


<a name="acos" ></a>

### <code>acos</code>
<code><b>acos(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates a cosine inverse value.  
* ``acos(1) -> 0.0``  
___


<a name="add" ></a>

### <code>add</code>
<code><b>add(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => any</b></code><br/><br/>
Adds a pair of strings or numbers. Adds a date to a number of days. Adds a duration to a timestamp. Appends one array of similar type to another. Same as the + operator.  
* ``add(10, 20) -> 30``  
* ``10 + 20 -> 30``  
* ``add('ice', 'cream') -> 'icecream'``  
* ``'ice' + 'cream' + ' cone' -> 'icecream cone'``  
* ``add(toDate('2012-12-12'), 3) -> toDate('2012-12-15')``  
* ``toDate('2012-12-12') + 3 -> toDate('2012-12-15')``  
* ``[10, 20] + [30, 40] -> [10, 20, 30, 40]``  
* ``toTimestamp('2019-02-03 05:19:28.871', 'yyyy-MM-dd HH:mm:ss.SSS') + (days(1) + hours(2) - seconds(10)) -> toTimestamp('2019-02-04 07:19:18.871', 'yyyy-MM-dd HH:mm:ss.SSS')``  
___


<a name="addDays" ></a>

### <code>addDays</code>
<code><b>addDays(<i>&lt;date/timestamp&gt;</i> : datetime, <i>&lt;days to add&gt;</i> : integral) => datetime</b></code><br/><br/>
Add days to a date or timestamp. Same as the + operator for date.  
* ``addDays(toDate('2016-08-08'), 1) -> toDate('2016-08-09')``  
___


<a name="addMonths" ></a>

### <code>addMonths</code>
<code><b>addMonths(<i>&lt;date/timestamp&gt;</i> : datetime, <i>&lt;months to add&gt;</i> : integral, [<i>&lt;value3&gt;</i> : string]) => datetime</b></code><br/><br/>
Add months to a date or timestamp. You can optionally pass a timezone.  
* ``addMonths(toDate('2016-08-31'), 1) -> toDate('2016-09-30')``  
* ``addMonths(toTimestamp('2016-09-30 10:10:10'), -1) -> toTimestamp('2016-08-31 10:10:10')``  
___


<a name="and" ></a>

### <code>and</code>
<code><b>and(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : boolean) => boolean</b></code><br/><br/>
Logical AND operator. Same as &&.  
* ``and(true, false) -> false``  
* ``true && false -> false``  
___


<a name="approxDistinctCount" ></a>

### <code>approxDistinctCount</code>
<code><b>approxDistinctCount(<i>&lt;value1&gt;</i> : any, [ <i>&lt;value2&gt;</i> : double ]) => long</b></code><br/><br/>
Gets the approximate aggregate count of distinct values for a column. The optional second parameter is to control the estimation error.
* ``approxDistinctCount(ProductID, .05) => long``  
___


<a name="array" ></a>

### <code>array</code>
<code><b>array([<i>&lt;value1&gt;</i> : any], ...) => array</b></code><br/><br/>
Creates an array of items. All items should be of the same type. If no items are specified, an empty string array is the default. Same as a [] creation operator.  
* ``array('Seattle', 'Washington')``
* ``['Seattle', 'Washington']``
* ``['Seattle', 'Washington'][1]``
* ``'Washington'``
___


<a name="asin" ></a>

### <code>asin</code>
<code><b>asin(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates an inverse sine value.  
* ``asin(0) -> 0.0``  
___


<a name="associate" ></a>

### <code>associate</code>
<code><b>reassociate(<i>&lt;value1&gt;</i> : map, <i>&lt;value2&gt;</i> : binaryFunction) => map</b></code><br/><br/>
Creates a map of key/values. All the keys & values should be of the same type. If no items are specified, it is defaulted to a map of string to string type.Same as a ```[ -> ]``` creation operator. Keys and values should alternate with each other.
*	``associate('fruit', 'apple', 'vegetable', 'carrot' )=> ['fruit' -> 'apple', 'vegetable' -> 'carrot']``
___


<a name="at" ></a>

### <code>at</code>
<code><b>at(<i>&lt;value1&gt;</i> : array/map, <i>&lt;value2&gt;</i> : integer/key type) => array</b></code><br/><br/>
Finds the element at an array index. The index is 1-based. Out of bounds index results in a null value. Finds a value in a map given a key. If the key is not found it returns null.
*	``at(['apples', 'pears'], 1) => 'apples'``
*	``at(['fruit' -> 'apples', 'vegetable' -> 'carrot'], 'fruit') => 'apples'``
___


<a name="atan" ></a>

### <code>atan</code>
<code><b>atan(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates a inverse tangent value.  
* ``atan(0) -> 0.0``  
___


<a name="atan2" ></a>

### <code>atan2</code>
<code><b>atan2(<i>&lt;value1&gt;</i> : number, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Returns the angle in radians between the positive x-axis of a plane and the point given by the coordinates.  
* ``atan2(0, 0) -> 0.0``  
___


<a name="avg" ></a>

### <code>avg</code>
<code><b>avg(<i>&lt;value1&gt;</i> : number) => number</b></code><br/><br/>
Gets the average of values of a column.  
* ``avg(sales)``  
___


<a name="avgIf" ></a>

### <code>avgIf</code>
<code><b>avgIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => number</b></code><br/><br/>
Based on a criteria gets the average of values of a column.  
* ``avgIf(region == 'West', sales)``  
___


<a name="between" ></a>

### <code>between</code>
<code><b>between(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any, <i>&lt;value3&gt;</i> : any) => boolean</b></code><br/><br/>
Checks if the first value is in between two other values inclusively. Numeric, string and datetime values can be compared  
* ``between(10, 5, 24)``
* ``true``
* ``between(currentDate(), currentDate() + 10, currentDate() + 20)``
* ``false``
___


<a name="bitwiseAnd" ></a>

### <code>bitwiseAnd</code>
<code><b>bitwiseAnd(<i>&lt;value1&gt;</i> : integral, <i>&lt;value2&gt;</i> : integral) => integral</b></code><br/><br/>
Bitwise And operator across integral types. Same as & operator  
* ``bitwiseAnd(0xf4, 0xef)``
* ``0xe4``
* ``(0xf4 & 0xef)``
* ``0xe4``
___


<a name="bitwiseOr" ></a>

### <code>bitwiseOr</code>
<code><b>bitwiseOr(<i>&lt;value1&gt;</i> : integral, <i>&lt;value2&gt;</i> : integral) => integral</b></code><br/><br/>
Bitwise Or operator across integral types. Same as | operator  
* ``bitwiseOr(0xf4, 0xef)``
* ``0xff``
* ``(0xf4 | 0xef)``
* ``0xff``
___


<a name="bitwiseXor" ></a>

### <code>bitwiseXor</code>
<code><b>bitwiseXor(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => any</b></code><br/><br/>
Bitwise Or operator across integral types. Same as | operator  
* ``bitwiseXor(0xf4, 0xef)``
* ``0x1b``
* ``(0xf4 ^ 0xef)``
* ``0x1b``
* ``(true ^ false)``
* ``true``
* ``(true ^ true)``
* ``false``
___


<a name="blake2b" ></a>

### <code>blake2b</code>
<code><b>blake2b(<i>&lt;value1&gt;</i> : integer, <i>&lt;value2&gt;</i> : any, ...) => string</b></code><br/><br/>
Calculates the Blake2 digest of set of column of varying primitive datatypes given a bit length which can only be multiples of 8 between 8 & 512. It can be used to calculate a fingerprint for a row  
* ``blake2b(256, 'gunchus', 8.2, 'bojjus', true, toDate('2010-4-4'))``
* ``'c9521a5080d8da30dffb430c50ce253c345cc4c4effc315dab2162dac974711d'``
___


<a name="blake2bBinary" ></a>

### <code>blake2bBinary</code>
<code><b>blake2bBinary(<i>&lt;value1&gt;</i> : integer, <i>&lt;value2&gt;</i> : any, ...) => binary</b></code><br/><br/>
Calculates the Blake2 digest of set of column of varying primitive datatypes given a bit length which can only be multiples of 8 between 8 & 512. It can be used to calculate a fingerprint for a row  
* ``blake2bBinary(256, 'gunchus', 8.2, 'bojjus', true, toDate('2010-4-4'))``
* ``unHex('c9521a5080d8da30dffb430c50ce253c345cc4c4effc315dab2162dac974711d')``
___


<a name="byItem" ></a>

### <code>byItem</code>
<code><b>byItem(<i>&lt;parent column&gt;</i> : any, <i>&lt;column name&gt;</i> : string) => any</b></code><br/><br/>
Find a sub item within a structure or array of structure If there are multiple matches, the first match is returned. If no match it returns a NULL value. The returned value has to be type converted by one of the type conversion actions(? date, ? string ...).  Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions  
* ``byItem( byName('customer'), 'orderItems') ? (itemName as string, itemQty as integer)``
* ``byItem( byItem( byName('customer'), 'orderItems'), 'itemName') ? string``
___


<a name="byName" ></a>

### <code>byName</code>
<code><b>byName(<i>&lt;column name&gt;</i> : string, [<i>&lt;stream name&gt;</i> : string]) => any</b></code><br/><br/>
Selects a column value by name in the stream. You can pass a optional stream name as the second argument. If there are multiple matches, the first match is returned. If no match it returns a NULL value. The returned value has to be type converted by one of the type conversion functions(TO_DATE, TO_STRING ...).  Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions.  
* ``toString(byName('parent'))``  
* ``toLong(byName('income'))``  
* ``toBoolean(byName('foster'))``  
* ``toLong(byName($debtCol))``  
* ``toString(byName('Bogus Column'))``  
* ``toString(byName('Bogus Column', 'DeriveStream'))``  
___


<a name="byNames" ></a>

### <code>byNames</code>
<code><b>byNames(<i>&lt;column names&gt;</i> : array, [<i>&lt;stream name&gt;</i> : string]) => any</b></code><br/><br/>
Select an array of columns by name in the stream. You can pass a optional stream name as the second argument. If there are multiple matches, the first match is returned. If there are no matches for a column, the entire output is a NULL value. The returned value requires a type conversion functions (toDate, toString, ...).  Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions.
* ``toString(byNames(['parent', 'child']))``
* ``byNames(['parent']) ? string``
* ``toLong(byNames(['income']))``
* ``byNames(['income']) ? long``
* ``toBoolean(byNames(['foster']))``
* ``toLong(byNames($debtCols))``
* ``toString(byNames(['a Column']))``
* ``toString(byNames(['a Column'], 'DeriveStream'))``
* ``byNames(['orderItem']) ? (itemName as string, itemQty as integer)``
___


<a name="byOrigin" ></a>

### <code>byOrigin</code>
<code><b>byOrigin(<i>&lt;column name&gt;</i> : string, [<i>&lt;origin stream name&gt;</i> : string]) => any</b></code><br/><br/>
Selects a column value by name in the origin stream. The second argument is the origin stream name. If there are multiple matches, the first match is returned. If no match it returns a NULL value. The returned value has to be type converted by one of the type conversion functions(TO_DATE, TO_STRING ...). Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions.  
* ``toString(byOrigin('ancestor', 'ancestorStream'))``
___


<a name="byOrigins" ></a>

### <code>byOrigins</code>
<code><b>byOrigins(<i>&lt;column names&gt;</i> : array, [<i>&lt;origin stream name&gt;</i> : string]) => any</b></code><br/><br/>
Selects an array of columns by name in the stream. The second argument is the stream where it originated from. If there are multiple matches, the first match is returned. If no match it returns a NULL value. The returned value has to be type converted by one of the type conversion functions(TO_DATE, TO_STRING ...) Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions.
* ``toString(byOrigins(['ancestor1', 'ancestor2'], 'ancestorStream'))``
___


<a name="byPath" ></a>

### <code>byPath</code>
<code><b>byPath(<i>&lt;value1&gt;</i> : string, [<i>&lt;streamName&gt;</i> : string]) => any</b></code><br/><br/>
Finds a hierarchical path by name in the stream. You can pass an optional stream name as the second argument. If no such path is found it returns null. Column names/paths known at design time should be addressed just by their name or dot notation path. Computed inputs are not supported but you can use parameter substitutions.  
* ``byPath('grandpa.parent.child') => column`` 
___


<a name="byPosition" ></a>

### <code>byPosition</code>
<code><b>byPosition(<i>&lt;position&gt;</i> : integer) => any</b></code><br/><br/>
Selects a column value by its relative position(1 based) in the stream. If the position is out of bounds it returns a NULL value. The returned value has to be type converted by one of the type conversion functions(TO_DATE, TO_STRING ...) Computed inputs are not supported but you can use parameter substitutions.  
* ``toString(byPosition(1))``  
* ``toDecimal(byPosition(2), 10, 2)``  
* ``toBoolean(byName(4))``  
* ``toString(byName($colName))``  
* ``toString(byPosition(1234))``  
___


<a name="case" ></a>

### <code>case</code>
<code><b>case(<i>&lt;condition&gt;</i> : boolean, <i>&lt;true_expression&gt;</i> : any, <i>&lt;false_expression&gt;</i> : any, ...) => any</b></code><br/><br/>
Based on alternating conditions applies one value or the other. If the number of inputs are even, the other is defaulted to NULL for last condition.  
* ``case(10 + 20 == 30, 'dumbo', 'gumbo') -> 'dumbo'``  
* ``case(10 + 20 == 25, 'bojjus', 'do' < 'go', 'gunchus') -> 'gunchus'``  
* ``isNull(case(10 + 20 == 25, 'bojjus', 'do' > 'go', 'gunchus')) -> true``  
* ``case(10 + 20 == 25, 'bojjus', 'do' > 'go', 'gunchus', 'dumbo') -> 'dumbo'``  
___


<a name="cbrt" ></a>

### <code>cbrt</code>
<code><b>cbrt(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates the cube root of a number.  
* ``cbrt(8) -> 2.0``  
___


<a name="ceil" ></a>

### <code>ceil</code>
<code><b>ceil(<i>&lt;value1&gt;</i> : number) => number</b></code><br/><br/>
Returns the smallest integer not smaller than the number.  
* ``ceil(-0.1) -> 0``  
___


<a name="coalesce" ></a>

### <code>coalesce</code>
<code><b>coalesce(<i>&lt;value1&gt;</i> : any, ...) => any</b></code><br/><br/>
Returns the first not null value from a set of inputs. All inputs should be of the same type.  
* ``coalesce(10, 20) -> 10``  
* ``coalesce(toString(null), toString(null), 'dumbo', 'bo', 'go') -> 'dumbo'``  
___


<a name="collect" ></a>

### <code>collect</code>
<code><b>collect(<i>&lt;value1&gt;</i> : any) => array</b></code><br/><br/>
Collects all values of the expression in the aggregated group into an array. Structures can be collected and transformed to alternate structures during this process. The number of items will be equal to the number of rows in that group and can contain null values. The number of collected items should be small.  
* ``collect(salesPerson)``
* ``collect(firstName + lastName))``
* ``collect(@(name = salesPerson, sales = salesAmount) )``
___


<a name="columnNames" ></a>

### <code>columnNames</code>
<code><b>columnNames(<i>&lt;value1&gt;</i> : string) => array</b></code><br/><br/>
Gets the names of all output columns for a stream. You can pass an optional stream name as the second argument.  
* ``columnNames()``
* ``columnNames('DeriveStream')``
___


<a name="columns" ></a>

### <code>columns</code>
<code><b>columns([<i>&lt;stream name&gt;</i> : string]) => any</b></code><br/><br/>
Gets the values of all output columns for a stream. You can pass an optional stream name as the second argument.   
* ``columns()``
* ``columns('DeriveStream')``
___


<a name="compare" ></a>

### <code>compare</code>
<code><b>compare(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => integer</b></code><br/><br/>
Compares two values of the same type. Returns negative integer if value1 < value2, 0 if value1 == value2, positive value if value1 > value2.  
* ``(compare(12, 24) < 1) -> true``  
* ``(compare('dumbo', 'dum') > 0) -> true``  
___


<a name="concat" ></a>

### <code>concat</code>
<code><b>concat(<i>&lt;this&gt;</i> : string, <i>&lt;that&gt;</i> : string, ...) => string</b></code><br/><br/>
Concatenates a variable number of strings together. Same as the + operator with strings.  
* ``concat('dataflow', 'is', 'awesome') -> 'dataflowisawesome'``  
* ``'dataflow' + 'is' + 'awesome' -> 'dataflowisawesome'``  
* ``isNull('sql' + null) -> true``  
___


<a name="concatWS" ></a>

### <code>concatWS</code>
<code><b>concatWS(<i>&lt;separator&gt;</i> : string, <i>&lt;this&gt;</i> : string, <i>&lt;that&gt;</i> : string, ...) => string</b></code><br/><br/>
Concatenates a variable number of strings together with a separator. The first parameter is the separator.  
* ``concatWS(' ', 'dataflow', 'is', 'awesome') -> 'dataflow is awesome'``  
* ``isNull(concatWS(null, 'dataflow', 'is', 'awesome')) -> true``  
* ``concatWS(' is ', 'dataflow', 'awesome') -> 'dataflow is awesome'``  
___


<a name="contains" ></a>

### <code>contains</code>
<code><b>contains(<i>&lt;value1&gt;</i> : array, <i>&lt;value2&gt;</i> : unaryfunction) => boolean</b></code><br/><br/>
Returns true if any element in the provided array evaluates as true in the provided predicate. Contains expects a reference to one element in the predicate function as #item.  
* ``contains([1, 2, 3, 4], #item == 3) -> true``  
* ``contains([1, 2, 3, 4], #item > 5) -> false``  
___


<a name="cos" ></a>

### <code>cos</code>
<code><b>cos(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates a cosine value.  
* ``cos(10) -> -0.8390715290764524``  
___


<a name="cosh" ></a>

### <code>cosh</code>
<code><b>cosh(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates a hyperbolic cosine of a value.  
* ``cosh(0) -> 1.0``  
___


<a name="count" ></a>

### <code>count</code>
<code><b>count([<i>&lt;value1&gt;</i> : any]) => long</b></code><br/><br/>
Gets the aggregate count of values. If the optional column(s) is specified, it ignores NULL values in the count.  
* ``count(custId)``  
* ``count(custId, custName)``  
* ``count()``  
* ``count(iif(isNull(custId), 1, NULL))``  
___

<a name="countAll" ></a>

### <code>countAll</code>
<code><b>countAll([<i>&lt;value1&gt;</i> : any]) => long</b></code><br/><br/>
Gets the aggregate count of values including nulls.  
* ``countAll(custId)``  
* ``countAll()``  

___


<a name="countDistinct" ></a>

### <code>countDistinct</code>
<code><b>countDistinct(<i>&lt;value1&gt;</i> : any, [<i>&lt;value2&gt;</i> : any], ...) => long</b></code><br/><br/>
Gets the aggregate count of distinct values of a set of columns.  
* ``countDistinct(custId, custName)``  
___


<a name="countAllDistinct" ></a>

### <code>countAllDistinct</code>
<code><b>countAllDistinct(<i>&lt;value1&gt;</i> : any, [<i>&lt;value2&gt;</i> : any], ...) => long</b></code><br/><br/>
Gets the aggregate count of distinct values of a set of columns including nulls.
* ``countAllDistinct(custId, custName)``  
___


<a name="countIf" ></a>

### <code>countIf</code>
<code><b>countIf(<i>&lt;value1&gt;</i> : boolean, [<i>&lt;value2&gt;</i> : any]) => long</b></code><br/><br/>
Based on a criteria gets the aggregate count of values. If the optional column is specified, it ignores NULL values in the count.  
* ``countIf(state == 'CA' && commission < 10000, name)``  
___


<a name="covariancePopulation" ></a>

### <code>covariancePopulation</code>
<code><b>covariancePopulation(<i>&lt;value1&gt;</i> : number, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Gets the population covariance between two columns.  
* ``covariancePopulation(sales, profit)``  
___


<a name="covariancePopulationIf" ></a>

### <code>covariancePopulationIf</code>
<code><b>covariancePopulationIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number, <i>&lt;value3&gt;</i> : number) => double</b></code><br/><br/>
Based on a criteria, gets the population covariance of two columns.  
* ``covariancePopulationIf(region == 'West', sales)``  
___


<a name="covarianceSample" ></a>

### <code>covarianceSample</code>
<code><b>covarianceSample(<i>&lt;value1&gt;</i> : number, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Gets the sample covariance of two columns.  
* ``covarianceSample(sales, profit)``  
___


<a name="covarianceSampleIf" ></a>

### <code>covarianceSampleIf</code>
<code><b>covarianceSampleIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number, <i>&lt;value3&gt;</i> : number) => double</b></code><br/><br/>
Based on a criteria, gets the sample covariance of two columns.  
* ``covarianceSampleIf(region == 'West', sales, profit)``  
___



<a name="crc32" ></a>

### <code>crc32</code>
<code><b>crc32(<i>&lt;value1&gt;</i> : any, ...) => long</b></code><br/><br/>
Calculates the CRC32 hash of set of column of varying primitive datatypes given a bit length which can only be of values 0(256), 224, 256, 384, 512. It can be used to calculate a fingerprint for a row.  
* ``crc32(256, 'gunchus', 8.2, 'bojjus', true, toDate('2010-4-4')) -> 3630253689L``  
___


<a name="cumeDist" ></a>

### <code>cumeDist</code>
<code><b>cumeDist() => integer</b></code><br/><br/>
The CumeDist function computes the position of a value relative to all values in the partition. The result is the number of rows preceding or equal to the current row in the ordering of the partition divided by the total number of rows in the window partition. Any tie values in the  ordering will evaluate to the same position.  
* ``cumeDist()``  
___


<a name="currentDate" ></a>

### <code>currentDate</code>
<code><b>currentDate([<i>&lt;value1&gt;</i> : string]) => date</b></code><br/><br/>
Gets the current date when this job starts to run. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. [https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html). 
* ``currentDate() == toDate('2250-12-31') -> false``  
* ``currentDate('PST')  == toDate('2250-12-31') -> false``  
* ``currentDate('America/New_York')  == toDate('2250-12-31') -> false``  
___


<a name="currentTimestamp" ></a>

### <code>currentTimestamp</code>
<code><b>currentTimestamp() => timestamp</b></code><br/><br/>
Gets the current timestamp when the job starts to run with local time zone.  
* ``currentTimestamp() == toTimestamp('2250-12-31 12:12:12') -> false``  
___


<a name="currentUTC" ></a>

### <code>currentUTC</code>
<code><b>currentUTC([<i>&lt;value1&gt;</i> : string]) => timestamp</b></code><br/><br/>
Gets the current timestamp as UTC. If you want your current time to be interpreted in a different timezone than your cluster time zone, you can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. It is defaulted to the current timezone. Refer Java's `SimpleDateFormat` class for available formats. [https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html). To convert the UTC time to a different timezone use `fromUTC()`.  
* ``currentUTC() == toTimestamp('2050-12-12 19:18:12') -> false``  
* ``currentUTC() != toTimestamp('2050-12-12 19:18:12') -> true``  
* ``fromUTC(currentUTC(), 'Asia/Seoul') != toTimestamp('2050-12-12 19:18:12') -> true``  
___


<a name="dayOfMonth" ></a>

### <code>dayOfMonth</code>
<code><b>dayOfMonth(<i>&lt;value1&gt;</i> : datetime) => integer</b></code><br/><br/>
Gets the day of the month given a date.  
* ``dayOfMonth(toDate('2018-06-08')) -> 8``  
___


<a name="dayOfWeek" ></a>

### <code>dayOfWeek</code>
<code><b>dayOfWeek(<i>&lt;value1&gt;</i> : datetime) => integer</b></code><br/><br/>
Gets the day of the week given a date. 1 - Sunday, 2 - Monday ..., 7 - Saturday.  
* ``dayOfWeek(toDate('2018-06-08')) -> 6``  
___


<a name="dayOfYear" ></a>

### <code>dayOfYear</code>
<code><b>dayOfYear(<i>&lt;value1&gt;</i> : datetime) => integer</b></code><br/><br/>
Gets the day of the year given a date.  
* ``dayOfYear(toDate('2016-04-09')) -> 100``  
___


<a name="days" ></a>

### <code>days</code>
<code><b>days(<i>&lt;value1&gt;</i> : integer) => long</b></code><br/><br/>
Duration in milliseconds for number of days.  
* ``days(2) -> 172800000L``  
___


<a name="degrees" ></a>

### <code>degrees</code>
<code><b>degrees(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Converts radians to degrees.  
* ``degrees(3.141592653589793) -> 180``  
___


<a name="denseRank" ></a>

### <code>denseRank</code>
<code><b>denseRank() => integer</b></code><br/><br/>
Computes the rank of a value in a group of values specified in a window's order by clause. The result is one plus the number of rows preceding or equal to the current row in the ordering of the partition. The values will not produce gaps in the sequence. Dense Rank works even when data is not sorted and looks for change in values.  
* ``denseRank()``  
___


<a name="distinct" ></a>

### <code>distinct</code>
<code><b>distinct(<i>&lt;value1&gt;</i> : array) => array</b></code><br/><br/>
Returns a distinct set of items from an array.
* ``distinct([10, 20, 30, 10]) => [10, 20, 30]``
___


<a name="divide" ></a>

### <code>divide</code>
<code><b>divide(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => any</b></code><br/><br/>
Divides pair of numbers. Same as the `/` operator.  
* ``divide(20, 10) -> 2``  
* ``20 / 10 -> 2``
___


<a name="dropLeft" ></a>

### <code>dropLeft</code>
<code><b>dropLeft(<i>&lt;value1&gt;</i> : string, <i>&lt;value2&gt;</i> : integer) => string</b></code><br/><br/>
Removes as many characters from the left of the string. If the drop requested exceeds the length of the string, an empty string is returned.
*	dropLeft('bojjus', 2) => 'jjus' 
*	dropLeft('cake', 10) => ''
___


<a name="dropRight" ></a>

### <code>dropRight</code>
<code><b>dropRight(<i>&lt;value1&gt;</i> : string, <i>&lt;value2&gt;</i> : integer) => string</b></code><br/><br/>
Removes as many characters from the right of the string. If the drop requested exceeds the length of the string, an empty string is returned.
*	dropRight('bojjus', 2) => 'bojj' 
*	dropRight('cake', 10) => ''
___


<a name="endsWith" ></a>

### <code>endsWith</code>
<code><b>endsWith(<i>&lt;string&gt;</i> : string, <i>&lt;substring to check&gt;</i> : string) => boolean</b></code><br/><br/>
Checks if the string ends with the supplied string.  
* ``endsWith('dumbo', 'mbo') -> true``  
___


<a name="equals" ></a>

### <code>equals</code>
<code><b>equals(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => boolean</b></code><br/><br/>
Comparison equals operator. Same as == operator.  
* ``equals(12, 24) -> false``  
* ``12 == 24 -> false``  
* ``'bad' == 'bad' -> true``  
* ``isNull('good' == toString(null)) -> true``  
* ``isNull(null == null) -> true``  
___


<a name="equalsIgnoreCase" ></a>

### <code>equalsIgnoreCase</code>
<code><b>equalsIgnoreCase(<i>&lt;value1&gt;</i> : string, <i>&lt;value2&gt;</i> : string) => boolean</b></code><br/><br/>
Comparison equals operator ignoring case. Same as <=> operator.  
* ``'abc'<=>'Abc' -> true``  
* ``equalsIgnoreCase('abc', 'Abc') -> true``  
___


<a name="escape" ></a>

### <code>escape</code>
<code><b>escape(<i>&lt;string_to_escape&gt;</i> : string, <i>&lt;format&gt;</i> : string) => string</b></code><br/><br/>
Escapes a string according to a format. Literal values for acceptable format are 'json', 'xml', 'ecmascript', 'html', 'java'.
___


<a name="except" ></a>

### <code>except</code>
<code><b>except(<i>&lt;value1&gt;</i> : array, <i>&lt;value2&gt;</i> : array) => array</b></code><br/><br/>
Returns a difference set of one array from another dropping duplicates.
* ``except([10, 20, 30], [20, 40]) => [10, 30]``  
___


<a name="expr" ></a>

### <code>expr</code>
<code><b>expr(<i>&lt;expr&gt;</i> : string) => any</b></code><br/><br/>
Results in a expression from a string. This is the same as writing this expression in a non-literal form. This can be used to pass parameters as string representations.
*    expr('price * discount') => any
___


<a name="factorial" ></a>

### <code>factorial</code>
<code><b>factorial(<i>&lt;value1&gt;</i> : number) => long</b></code><br/><br/>
Calculates the factorial of a number.  
* ``factorial(5) -> 120``  
___


<a name="false" ></a>

### <code>false</code>
<code><b>false() => boolean</b></code><br/><br/>
Always returns a false value. Use the function `syntax(false())` if there is a column named 'false'.  
* ``(10 + 20 > 30) -> false``  
* ``(10 + 20 > 30) -> false()``
___


<a name="filter" ></a>

### <code>filter</code>
<code><b>filter(<i>&lt;value1&gt;</i> : array, <i>&lt;value2&gt;</i> : unaryfunction) => array</b></code><br/><br/>
Filters elements out of the array that do not meet the provided predicate. Filter expects a reference to one element in the predicate function as #item.  
* ``filter([1, 2, 3, 4], #item > 2) -> [3, 4]``  
* ``filter(['a', 'b', 'c', 'd'], #item == 'a' || #item == 'b') -> ['a', 'b']``  
___


<a name="find" ></a>

### <code>find</code>
<code><b>find(<i>&lt;value1&gt;</i> : array, <i>&lt;value2&gt;</i> : unaryfunction) => any</b></code><br/><br/>
Find the first item from an array that match the condition. It takes a filter function where you can address the item in the array as #item. For deeply nested maps you can refer to the parent maps using the #item_n(#item_1, #item_2...) notation.  
* ``find([10, 20, 30], #item > 10) -> 20``
* ``find(['azure', 'data', 'factory'], length(#item) > 4) -> 'azure'``
* ``find([
      @(
         name = 'Daniel',
         types = [
                   @(mood = 'jovial', behavior = 'terrific'),
                   @(mood = 'grumpy', behavior = 'bad')
                 ]
        ),
      @(
         name = 'Mark',
         types = [
                   @(mood = 'happy', behavior = 'awesome'),
                   @(mood = 'calm', behavior = 'reclusive')
                 ]
        )
      ],
      contains(#item.types, #item.mood=='happy')  /*Filter out the happy kid*/
    )``
* ``
   @(
         name = 'Mark',
         types = [
                   @(mood = 'happy', behavior = 'awesome'),
                   @(mood = 'calm', behavior = 'reclusive')
                 ]
    )
  ``  
___


<a name="first" ></a>

### <code>first</code>
<code><b>first(<i>&lt;value1&gt;</i> : any, [<i>&lt;value2&gt;</i> : boolean]) => any</b></code><br/><br/>
Gets the first value of a column group. If the second parameter ignoreNulls is omitted, it is assumed false.  
* ``first(sales)``  
* ``first(sales, false)``  
___



<a name="flatten" ></a>

### <code>flatten</code>
<code><b>flatten(<i>&lt;array&gt;</i> : array, <i>&lt;value2&gt;</i> : array ..., <i>&lt;value2&gt;</i> : boolean) => array</b></code><br/><br/>
Flattens array or arrays into a single array. Arrays of atomic items are returned unaltered. The last argument is optional and is defaulted to false to flatten recursively more than one level deep.
*	``flatten([['bojjus', 'girl'], ['gunchus', 'boy']]) => ['bojjus', 'girl', 'gunchus', 'boy']``
*	``flatten([[['bojjus', 'gunchus']]] , true) => ['bojjus', 'gunchus']``
___


<a name="floor" ></a>

### <code>floor</code>
<code><b>floor(<i>&lt;value1&gt;</i> : number) => number</b></code><br/><br/>
Returns the largest integer not greater than the number.  
* ``floor(-0.1) -> -1``  
___


<a name="fromBase64" ></a>

### <code>fromBase64</code>
<code><b>fromBase64(<i>&lt;value1&gt;</i> : string) => string</b></code><br/><br/>
Decodes the given base64-encoded string.
* ``fromBase64('Z3VuY2h1cw==') -> 'gunchus'``  
___


<a name="fromUTC" ></a>

### <code>fromUTC</code>
<code><b>fromUTC(<i>&lt;value1&gt;</i> : timestamp, [<i>&lt;value2&gt;</i> : string]) => timestamp</b></code><br/><br/>
Converts to the timestamp from UTC. You can optionally pass the timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. It is defaulted to the current timezone. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  
* ``fromUTC(currentTimestamp()) == toTimestamp('2050-12-12 19:18:12') -> false``  
* ``fromUTC(currentTimestamp(), 'Asia/Seoul') != toTimestamp('2050-12-12 19:18:12') -> true``  
___


<a name="greater" ></a>

### <code>greater</code>
<code><b>greater(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => boolean</b></code><br/><br/>
Comparison greater operator. Same as > operator.  
* ``greater(12, 24) -> false``  
* ``('dumbo' > 'dum') -> true``  
* ``(toTimestamp('2019-02-05 08:21:34.890', 'yyyy-MM-dd HH:mm:ss.SSS') > toTimestamp('2019-02-03 05:19:28.871', 'yyyy-MM-dd HH:mm:ss.SSS')) -> true``  
___


<a name="greaterOrEqual" ></a>

### <code>greaterOrEqual</code>
<code><b>greaterOrEqual(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => boolean</b></code><br/><br/>
Comparison greater than or equal operator. Same as >= operator.  
* ``greaterOrEqual(12, 12) -> true``  
* ``('dumbo' >= 'dum') -> true``  
___


<a name="greatest" ></a>

### <code>greatest</code>
<code><b>greatest(<i>&lt;value1&gt;</i> : any, ...) => any</b></code><br/><br/>
Returns the greatest value among the list of values as input skipping null values. Returns null if all inputs are null.  
* ``greatest(10, 30, 15, 20) -> 30``  
* ``greatest(10, toInteger(null), 20) -> 20``  
* ``greatest(toDate('2010-12-12'), toDate('2011-12-12'), toDate('2000-12-12')) -> toDate('2011-12-12')``  
* ``greatest(toTimestamp('2019-02-03 05:19:28.871', 'yyyy-MM-dd HH:mm:ss.SSS'), toTimestamp('2019-02-05 08:21:34.890', 'yyyy-MM-dd HH:mm:ss.SSS')) -> toTimestamp('2019-02-05 08:21:34.890', 'yyyy-MM-dd HH:mm:ss.SSS')``  
___


<a name="hasColumn" ></a>

### <code>hasColumn</code>
<code><b>hasColumn(<i>&lt;column name&gt;</i> : string, [<i>&lt;stream name&gt;</i> : string]) => boolean</b></code><br/><br/>
Checks for a column value by name in the stream. You can pass a optional stream name as the second argument. Column names known at design time should be addressed just by their name. Computed inputs are not supported but you can use parameter substitutions.  
* ``hasColumn('parent')``  
___


<a name="hasPath" ></a>

### <code>hasPath</code>
<code><b>hasPath(<i>&lt;value1&gt;</i> : string, [<i>&lt;streamName&gt;</i> : string]) => boolean</b></code><br/><br/>
Checks if a certain hierarchical path exists by name in the stream. You can pass an optional stream name as the second argument. Column names/paths known at design time should be addressed just by their name or dot notation path. Computed inputs are not supported but you can use parameter substitutions.  
* ``hasPath('grandpa.parent.child') => boolean``
___  


<a name="hex" ></a>

### <code>hex</code>
<code><b>hex(<i>\<value1\></i>: binary) => string</b></code><br/><br/>
Returns a hex string representation of a binary value
* ``hex(toBinary([toByte(0x1f), toByte(0xad), toByte(0xbe)])) -> '1fadbe'``
___


<a name="hour" ></a>

### <code>hour</code>
<code><b>hour(<i>&lt;value1&gt;</i> : timestamp, [<i>&lt;value2&gt;</i> : string]) => integer</b></code><br/><br/>
Gets the hour value of a timestamp. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  
* ``hour(toTimestamp('2009-07-30 12:58:59')) -> 12``  
* ``hour(toTimestamp('2009-07-30 12:58:59'), 'PST') -> 12``  
___


<a name="hours" ></a>

### <code>hours</code>
<code><b>hours(<i>&lt;value1&gt;</i> : integer) => long</b></code><br/><br/>
Duration in milliseconds for number of hours.  
* ``hours(2) -> 7200000L``  
___


<a name="iif" ></a>

### <code>iif</code>
<code><b>iif(<i>&lt;condition&gt;</i> : boolean, <i>&lt;true_expression&gt;</i> : any, [<i>&lt;false_expression&gt;</i> : any]) => any</b></code><br/><br/>
Based on a condition applies one value or the other. If other is unspecified it is considered NULL. Both the values must be compatible(numeric, string...).  
* ``iif(10 + 20 == 30, 'dumbo', 'gumbo') -> 'dumbo'``  
* ``iif(10 > 30, 'dumbo', 'gumbo') -> 'gumbo'``  
* ``iif(month(toDate('2018-12-01')) == 12, 345.12, 102.67) -> 345.12``  
___


<a name="iifNull" ></a>

### <code>iifNull</code>
<code><b>iifNull(<i>&lt;value1&gt;</i> : any, [<i>&lt;value2&gt;</i> : any], ...) => any</b></code><br/><br/>
Checks if the first parameter is null. If not null, the first parameter is returned. If null, the second parameter is returned. If three parameters are specified, the behavior is the same as iif(isNull(value1), value2, value3) and the third parameter is returned if the first value is not null.  
* ``iifNull(10, 20) -> 10``  
* ``iifNull(null, 20, 40) -> 20``  
* ``iifNull('azure', 'data', 'factory') -> 'factory'``  
* ``iifNull(null, 'data', 'factory') -> 'data'``  
___


<a name="in" ></a>

### <code>in</code>
<code><b>in(<i>&lt;array of items&gt;</i> : array, <i>&lt;item to find&gt;</i> : any) => boolean</b></code><br/><br/>
Checks if an item is in the array.  
* ``in([10, 20, 30], 10) -> true``  
* ``in(['good', 'kid'], 'bad') -> false``  
___


<a name="initCap" ></a>

### <code>initCap</code>
<code><b>initCap(<i>&lt;value1&gt;</i> : string) => string</b></code><br/><br/>
Converts the first letter of every word to uppercase. Words are identified as separated by whitespace.  
* ``initCap('cool iceCREAM') -> 'Cool Icecream'``  
___


<a name="instr" ></a>

### <code>instr</code>
<code><b>instr(<i>&lt;string&gt;</i> : string, <i>&lt;substring to find&gt;</i> : string) => integer</b></code><br/><br/>
Finds the position(1 based) of the substring within a string. 0 is returned if not found.  
* ``instr('dumbo', 'mbo') -> 3``  
* ``instr('microsoft', 'o') -> 5``  
* ``instr('good', 'bad') -> 0``  
___


<a name="intersect" ></a>

### <code>intersect</code>
<code><b>intersect(<i>&lt;value1&gt;</i> : array, <i>&lt;value2&gt;</i> : array) => array</b></code><br/><br/>
Returns an intersection set of distinct items from 2 arrays.
* ``intersect([10, 20, 30], [20, 40]) => [20]``  
___


<a name="isBitSet" ></a>

### <code>isBitSet</code>
<code><b>isBitSet (<i><i>\<value1\></i></i> : array, <i>\<value2\></i>:integer ) => boolean</b></code><br/><br/>
Checks if a bit position is set in this bitset
* ``isBitSet(toBitSet([10, 32, 98]), 10) => true``
___


<a name="isBoolean" ></a>

### <code>isBoolean</code>
<code><b>isBoolean(<i>\<value1\></i>: string) => boolean</b></code><br/><br/>
Checks if the string value is a boolean value according to the rules of ``toBoolean()``
* ``isBoolean('true') -> true``
* ``isBoolean('no') -> true``
* ``isBoolean('microsoft') -> false``
___


<a name="isByte" ></a>

### <code>isByte</code>
<code><b>isByte(<i>\<value1\></i> : string) => boolean</b></code><br/><br/>
Checks if the string value is a byte value given an optional format according to the rules of ``toByte()``
* ``isByte('123') -> true``
* ``isByte('chocolate') -> false``
___


<a name="isDate" ></a>

### <code>isDate</code>
<code><b>isDate (<i>\<value1\></i> : string, [&lt;format&gt;: string]) => boolean</b></code><br/><br/>
Checks if the input date string is a date using an optional input date format. Refer Java's SimpleDateFormat for available formats. If the input date format is omitted, default format is ``yyyy-[M]M-[d]d``. Accepted formats are ``[ yyyy, yyyy-[M]M, yyyy-[M]M-[d]d, yyyy-[M]M-[d]dT* ]``
* ``isDate('2012-8-18') -> true``
* ``isDate('12/18--234234' -> 'MM/dd/yyyy') -> false``
___


<a name="isDecimal" ></a>

### <code>isDecimal</code>
<code><b>isDecimal (<i>\<value1\></i> : string) => boolean</b></code><br/><br/>
Checks of the string value is a decimal value given an optional format according to the rules of ``toDecimal()``
* ``isDecimal('123.45') -> true``
* ``isDecimal('12/12/2000') -> false``
___


<a name="isDelete" ></a>

### <code>isDelete</code>
<code><b>isDelete([<i>&lt;value1&gt;</i> : integer]) => boolean</b></code><br/><br/>
Checks if the row is marked for delete. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  
* ``isDelete()``  
* ``isDelete(1)``  
___


<a name="isDistinct" ></a>

### <code>isDistinct</code>
<code><b>isDistinct(<i>&lt;value1&gt;</i> : any , <i>&lt;value1&gt;</i> : any) => boolean</b></code><br/><br/>
Finds if a column or set of columns is distinct. It does not count null as a distinct value
*    ``isDistinct(custId, custName) => boolean``
___



<a name="isDouble" ></a>

### <code>isDouble</code>
<code><b>isDouble (<i>\<value1\></i> : string, [&lt;format&gt;: string]) => boolean</b></code><br/><br/>
Checks of the string value is a double value given an optional format according to the rules of ``toDouble()``
* ``isDouble('123') -> true``
* ``isDouble('$123.45' -> '$###.00') -> true``
* ``isDouble('icecream') -> false``
___


<a name="isError" ></a>

### <code>isError</code>
<code><b>isError([<i>&lt;value1&gt;</i> : integer]) => boolean</b></code><br/><br/>
Checks if the row is marked as error. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  
* ``isError()``  
* ``isError(1)``  
___


<a name="isFloat" ></a>

### <code>isFloat</code>
<code><b>isFloat (<i>\<value1\></i> : string, [&lt;format&gt;: string]) => boolean</b></code><br/><br/>
Checks of the string value is a float value given an optional format according to the rules of ``toFloat()``
* ``isFloat('123') -> true``
* ``isFloat('$123.45' -> '$###.00') -> true``
* ``isFloat('icecream') -> false``
___


<a name="isIgnore" ></a>

### <code>isIgnore</code>
<code><b>isIgnore([<i>&lt;value1&gt;</i> : integer]) => boolean</b></code><br/><br/>
Checks if the row is marked to be ignored. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  
* ``isIgnore()``  
* ``isIgnore(1)``  
___


<a name="isInsert" ></a>

### <code>isInsert</code>
<code><b>isInsert([<i>&lt;value1&gt;</i> : integer]) => boolean</b></code><br/><br/>
Checks if the row is marked for insert. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  
* ``isInsert()``  
* ``isInsert(1)``  
___


<a name="isInteger" ></a>

### <code>isInteger</code>
<code><b>isInteger (<i>\<value1\></i> : string, [&lt;format&gt;: string]) => boolean</b></code><br/><br/>
Checks of the string value is a integer value given an optional format according to the rules of ``toInteger()``
* ``isInteger('123') -> true``
* ``isInteger('$123' -> '$###') -> true``
* ``isInteger('microsoft') -> false``
___


<a name="isLong" ></a>

### <code>isLong</code>
<code><b>isLong (<i>\<value1\></i> : string, [&lt;format&gt;: string]) => boolean</b></code><br/><br/>
Checks of the string value is a long value given an optional format according to the rules of ``toLong()``
* ``isLong('123') -> true``
* ``isLong('$123' -> '$###') -> true``
* ``isLong('gunchus') -> false``
___


<a name="isMatch" ></a>

### <code>isMatch</code>
<code><b>isMatch([<i>&lt;value1&gt;</i> : integer]) => boolean</b></code><br/><br/>
Checks if the row is matched at lookup. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  
* ``isMatch()``  
* ``isMatch(1)``  
___


<a name="isNan" ></a>

### <code>isNan</code>
<code><b>isNan (<i>\<value1\></i> : integral) => boolean</b></code><br/><br/>
Check if this is not a number.
* ``isNan(10.2) => false``
___


<a name="isNull" ></a>

### <code>isNull</code>
<code><b>isNull(<i>&lt;value1&gt;</i> : any) => boolean</b></code><br/><br/>
Checks if the value is NULL.  
* ``isNull(NULL()) -> true``  
* ``isNull('') -> false``  
___


<a name="isShort" ></a>

### <code>isShort</code>
<code><b>isShort (<i>\<value1\></i> : string, [&lt;format&gt;: string]) => boolean</b></code><br/><br/>
Checks of the string value is a short value given an optional format according to the rules of ``toShort()``
* ``isShort('123') -> true``
* ``isShort('$123' -> '$###') -> true``
* ``isShort('microsoft') -> false``
___


<a name="isTimestamp" ></a>

### <code>isTimestamp</code>
<code><b>isTimestamp (<i>\<value1\></i> : string, [&lt;format&gt;: string]) => boolean</b></code><br/><br/>
Checks if the input date string is a timestamp using an optional input timestamp format. Refer to Java's SimpleDateFormat for available formats. If the timestamp is omitted the default pattern ``yyyy-[M]M-[d]d hh:mm:ss[.f...]`` is used. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. Timestamp supports up to millisecond accuracy with value of 999 Refer to Java's SimpleDateFormat for available formats.
* ``isTimestamp('2016-12-31 00:12:00') -> true``
* ``isTimestamp('2016-12-31T00:12:00' -> 'yyyy-MM-dd\\'T\\'HH:mm:ss' -> 'PST') -> true``
* ``isTimestamp('2012-8222.18') -> false``
___


<a name="isUpdate" ></a>

### <code>isUpdate</code>
<code><b>isUpdate([<i>&lt;value1&gt;</i> : integer]) => boolean</b></code><br/><br/>
Checks if the row is marked for update. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  
* ``isUpdate()``  
* ``isUpdate(1)``  
___


<a name="isUpsert" ></a>

### <code>isUpsert</code>
<code><b>isUpsert([<i>&lt;value1&gt;</i> : integer]) => boolean</b></code><br/><br/>
Checks if the row is marked for insert. For transformations taking more than one input stream you can pass the (1-based) index of the stream. The stream index should be either 1 or 2 and the default value is 1.  
* ``isUpsert()``  
* ``isUpsert(1)``  
___


<a name="jaroWinkler" ></a>

### <code>jaroWinkler</code>
<code><b>jaroWinkler(<i>&lt;value1&gt;</i> : string, <i>&lt;value2&gt;</i> : string) => double</b></code><br/><br/>
Gets the JaroWinkler distance between two strings. 
* ``jaroWinkler('frog', 'frog') => 1.0``  
___


<a name="keyValues" ></a>

### <code>keyValues</code>
<code><b>keyValues(<i>&lt;value1&gt;</i> : array, <i>&lt;value2&gt;</i> : array) => map</b></code><br/><br/>
Creates a map of key/values. The first parameter is an array of keys and second is the array of values. Both arrays should have equal length.
*	``keyValues(['bojjus', 'appa'], ['gunchus', 'ammi']) => ['bojjus' -> 'gunchus', 'appa' -> 'ammi']``
___ 


<a name="kurtosis" ></a>

### <code>kurtosis</code>
<code><b>kurtosis(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Gets the kurtosis of a column.  
* ``kurtosis(sales)``  
___


<a name="kurtosisIf" ></a>

### <code>kurtosisIf</code>
<code><b>kurtosisIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Based on a criteria, gets the kurtosis of a column.  
* ``kurtosisIf(region == 'West', sales)``  
___


<a name="lag" ></a>

### <code>lag</code>
<code><b>lag(<i>&lt;value&gt;</i> : any, [<i>&lt;number of rows to look before&gt;</i> : number], [<i>&lt;default value&gt;</i> : any]) => any</b></code><br/><br/>
Gets the value of the first parameter evaluated n rows before the current row. The second parameter is the number of rows to look back and the default value is 1. If there are not as many rows a value of null is returned unless a default value is specified.  
* ``lag(amount, 2)``  
* ``lag(amount, 2000, 100)``  
___


<a name="last" ></a>

### <code>last</code>
<code><b>last(<i>&lt;value1&gt;</i> : any, [<i>&lt;value2&gt;</i> : boolean]) => any</b></code><br/><br/>
Gets the last value of a column group. If the second parameter ignoreNulls is omitted, it is assumed false.  
* ``last(sales)``  
* ``last(sales, false)``  
___


<a name="lastDayOfMonth" ></a>

### <code>lastDayOfMonth</code>
<code><b>lastDayOfMonth(<i>&lt;value1&gt;</i> : datetime) => date</b></code><br/><br/>
Gets the last date of the month given a date.  
* ``lastDayOfMonth(toDate('2009-01-12')) -> toDate('2009-01-31')``  
___


<a name="lead" ></a>

### <code>lead</code>
<code><b>lead(<i>&lt;value&gt;</i> : any, [<i>&lt;number of rows to look after&gt;</i> : number], [<i>&lt;default value&gt;</i> : any]) => any</b></code><br/><br/>
Gets the value of the first parameter evaluated n rows after the current row. The second parameter is the number of rows to look forward and the default value is 1. If there are not as many rows a value of null is returned unless a default value is specified.  
* ``lead(amount, 2)``  
* ``lead(amount, 2000, 100)``  
___


<a name="least" ></a>

### <code>least</code>
<code><b>least(<i>&lt;value1&gt;</i> : any, ...) => any</b></code><br/><br/>
Comparison lesser than or equal operator. Same as <= operator.  
* ``least(10, 30, 15, 20) -> 10``  
* ``least(toDate('2010-12-12'), toDate('2011-12-12'), toDate('2000-12-12')) -> toDate('2000-12-12')``  
___


<a name="left" ></a>

### <code>left</code>
<code><b>left(<i>&lt;string to subset&gt;</i> : string, <i>&lt;number of characters&gt;</i> : integral) => string</b></code><br/><br/>
Extracts a substring start at index 1 with number of characters. Same as SUBSTRING(str, 1, n).  
* ``left('bojjus', 2) -> 'bo'``  
* ``left('bojjus', 20) -> 'bojjus'``  
___


<a name="length" ></a>

### <code>length</code>
<code><b>length(<i>&lt;value1&gt;</i> : string) => integer</b></code><br/><br/>
Returns the length of the string.  
* ``length('dumbo') -> 5``  
___


<a name="lesser" ></a>

### <code>lesser</code>
<code><b>lesser(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => boolean</b></code><br/><br/>
Comparison less operator. Same as < operator.  
* ``lesser(12, 24) -> true``  
* ``('abcd' < 'abc') -> false``  
* ``(toTimestamp('2019-02-03 05:19:28.871', 'yyyy-MM-dd HH:mm:ss.SSS') < toTimestamp('2019-02-05 08:21:34.890', 'yyyy-MM-dd HH:mm:ss.SSS')) -> true``  
___


<a name="lesserOrEqual" ></a>

### <code>lesserOrEqual</code>
<code><b>lesserOrEqual(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => boolean</b></code><br/><br/>
Comparison lesser than or equal operator. Same as <= operator.  
* ``lesserOrEqual(12, 12) -> true``  
* ``('dumbo' <= 'dum') -> false``  
___


<a name="levenshtein" ></a>

### <code>levenshtein</code>
<code><b>levenshtein(<i>&lt;from string&gt;</i> : string, <i>&lt;to string&gt;</i> : string) => integer</b></code><br/><br/>
Gets the levenshtein distance between two strings.  
* ``levenshtein('boys', 'girls') -> 4``  
___


<a name="like" ></a>

### <code>like</code>
<code><b>like(<i>&lt;string&gt;</i> : string, <i>&lt;pattern match&gt;</i> : string) => boolean</b></code><br/><br/>
The pattern is a string that is matched literally. The exceptions are the following special symbols:  _ matches any one character in the input (similar to . in ```posix``` regular expressions)
  % matches zero or more characters in the input (similar to .* in ```posix``` regular expressions).
  The escape character is ''. If an escape character precedes a special symbol or another escape character, the following character is matched literally. It is invalid to escape any other character.  
* ``like('icecream', 'ice%') -> true``  
___


<a name="locate" ></a>

### <code>locate</code>
<code><b>locate(<i>&lt;substring to find&gt;</i> : string, <i>&lt;string&gt;</i> : string, [<i>&lt;from index - 1-based&gt;</i> : integral]) => integer</b></code><br/><br/>
Finds the position(1 based) of the substring within a string starting a certain position. If the position is omitted it is considered from the beginning of the string. 0 is returned if not found.  
* ``locate('mbo', 'dumbo') -> 3``  
* ``locate('o', 'microsoft', 6) -> 7``  
* ``locate('bad', 'good') -> 0``  
___


<a name="log" ></a>

### <code>log</code>
<code><b>log(<i>&lt;value1&gt;</i> : number, [<i>&lt;value2&gt;</i> : number]) => double</b></code><br/><br/>
Calculates log value. An optional base can be supplied else a Euler number if used.  
* ``log(100, 10) -> 2``  
___


<a name="log10" ></a>

### <code>log10</code>
<code><b>log10(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates log value based on 10 base.  
* ``log10(100) -> 2``  
___


<a name="lookup" ></a>

### <code>lookup</code>
<code><b>lookup(key, key2, ...) => complex[]</b></code><br/><br/>
Looks up the first row from the cached sink using the specified keys that match the keys from the cached sink.
* ``cacheSink#lookup(movieId)``  
___


<a name="lower" ></a>

### <code>lower</code>
<code><b>lower(<i>&lt;value1&gt;</i> : string) => string</b></code><br/><br/>
Lowercases a string.  
* ``lower('GunChus') -> 'gunchus'``  
___


<a name="lpad" ></a>

### <code>lpad</code>
<code><b>lpad(<i>&lt;string to pad&gt;</i> : string, <i>&lt;final padded length&gt;</i> : integral, <i>&lt;padding&gt;</i> : string) => string</b></code><br/><br/>
Left pads the string by the supplied padding until it is of a certain length. If the string is equal to or greater than the length, then it is trimmed to the length.  
* ``lpad('dumbo', 10, '-') -> '-----dumbo'``  
* ``lpad('dumbo', 4, '-') -> 'dumb'``  
* ``lpad('dumbo', 8, '<>') -> '<><dumbo'``  
___


<a name="ltrim" ></a>

### <code>ltrim</code>
<code><b>ltrim(<i>&lt;string to trim&gt;</i> : string, [<i>&lt;trim characters&gt;</i> : string]) => string</b></code><br/><br/>
Left trims a string of leading characters. If second parameter is unspecified, it trims whitespace. Else it trims any character specified in the second parameter.  
* ``ltrim('  dumbo  ') -> 'dumbo  '``  
* ``ltrim('!--!du!mbo!', '-!') -> 'du!mbo!'``  
___


<a name="map" ></a>

### <code>map</code>
<code><b>map(<i>&lt;value1&gt;</i> : array, <i>&lt;value2&gt;</i> : unaryfunction) => any</b></code><br/><br/>
Maps each element of the array to a new element using the provided expression. Map expects a reference to one element in the expression function as #item.  
* ``map([1, 2, 3, 4], #item + 2) -> [3, 4, 5, 6]``  
* ``map(['a', 'b', 'c', 'd'], #item + '_processed') -> ['a_processed', 'b_processed', 'c_processed', 'd_processed']``  
___


<a name="mapAssociation" ></a>

### <code>mapAssociation</code>
<code><b>mapAssociation(<i>&lt;value1&gt;</i> : map, <i>&lt;value2&gt;</i> : binaryFunction) => array</b></code><br/><br/>
Transforms a map by associating the keys to new values. Returns an array. It takes a mapping function where you can address the item as #key and current value as #value. 
*	``mapAssociation(['bojjus' -> 'gunchus', 'appa' -> 'ammi'], @(key = #key, value = #value)) => [@(key = 'bojjus', value = 'gunchus'), @(key = 'appa', value = 'ammi')]``
___ 


<a name="mapIf" ></a>

### <code>mapIf</code>
<code><b>mapIf (<i>\<value1\></i> : array, <i>\<value2\></i> : binaryfunction, \<value3\>: binaryFunction) => any</b></code><br/><br/>
Conditionally maps an array to another array of same or smaller length. The values can be of any datatype including structTypes. It takes a mapping function where you can address the item in the array as #item and current index as #index. For deeply nested maps you can refer to the parent maps using the ``#item_[n](#item_1, #index_1...)`` notation.
*    ``mapIf([10, 20, 30], #item > 10, #item + 5) -> [25, 35]``
* ``mapIf(['icecream', 'cake', 'soda'], length(#item) > 4, upper(#item)) -> ['ICECREAM', 'CAKE']``
___


<a name="mapIndex" ></a>

### <code>mapIndex</code>
<code><b>mapIndex(<i>&lt;value1&gt;</i> : array, <i>&lt;value2&gt;</i> : binaryfunction) => any</b></code><br/><br/>
Maps each element of the array to a new element using the provided expression. Map expects a reference to one element in the expression function as #item and a reference to the element index as #index.  
* ``mapIndex([1, 2, 3, 4], #item + 2 + #index) -> [4, 6, 8, 10]``  
___


<a name="mapLoop" ></a>

### <code>mapLoop</code>
<code><b>mapLoop(<i>\<value1\></i> : integer, <i>\<value2\></i> : unaryfunction) => any</b></code><br/><br/>
Loops through from 1 to length to create an array of that length. It takes a mapping function where you can address the index in the array as #index. For deeply nested maps you can refer to the parent maps using the #index_n(#index_1, #index_2...) notation.
*    ``mapLoop(3, #index * 10) -> [10, 20, 30]``
___


<a name="max" ></a>

### <code>max</code>
<code><b>max(<i>&lt;value1&gt;</i> : any) => any</b></code><br/><br/>
Gets the maximum value of a column.  
* ``max(sales)``  
___


<a name="maxIf" ></a>

### <code>maxIf</code>
<code><b>maxIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : any) => any</b></code><br/><br/>
Based on a criteria, gets the maximum value of a column.  
* ``maxIf(region == 'West', sales)``  
___


<a name="md5" ></a>

### <code>md5</code>
<code><b>md5(<i>&lt;value1&gt;</i> : any, ...) => string</b></code><br/><br/>
Calculates the MD5 digest of set of column of varying primitive datatypes and returns a 32 character hex string. It can be used to calculate a fingerprint for a row.  
* ``md5(5, 'gunchus', 8.2, 'bojjus', true, toDate('2010-4-4')) -> '4ce8a880bd621a1ffad0bca905e1bc5a'``  
___


<a name="mean" ></a>

### <code>mean</code>
<code><b>mean(<i>&lt;value1&gt;</i> : number) => number</b></code><br/><br/>
Gets the mean of values of a column. Same as AVG.  
* ``mean(sales)``  
___


<a name="meanIf" ></a>

### <code>meanIf</code>
<code><b>meanIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => number</b></code><br/><br/>
Based on a criteria gets the mean of values of a column. Same as avgIf.  
* ``meanIf(region == 'West', sales)``  
___


<a name="millisecond" ></a>

### <code>millisecond</code>
<code><b>millisecond(<i>&lt;value1&gt;</i> : timestamp, [<i>&lt;value2&gt;</i> : string]) => integer</b></code><br/><br/>
Gets the millisecond value of a date. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  
* ``millisecond(toTimestamp('2009-07-30 12:58:59.871', 'yyyy-MM-dd HH:mm:ss.SSS')) -> 871``  
___


<a name="milliseconds" ></a>

### <code>milliseconds</code>
<code><b>milliseconds(<i>&lt;value1&gt;</i> : integer) => long</b></code><br/><br/>
Duration in milliseconds for number of milliseconds.  
* ``milliseconds(2) -> 2L``  
___


<a name="min" ></a>

### <code>min</code>
<code><b>min(<i>&lt;value1&gt;</i> : any) => any</b></code><br/><br/>
Gets the minimum value of a column.  
* ``min(sales)``  
___


<a name="minIf" ></a>

### <code>minIf</code>
<code><b>minIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : any) => any</b></code><br/><br/>
Based on a criteria, gets the minimum value of a column.  
* ``minIf(region == 'West', sales)``  
___


<a name="minus" ></a>

### <code>minus</code>
<code><b>minus(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => any</b></code><br/><br/>
Subtracts numbers. Subtract number of days from a date. Subtract duration from a timestamp. Subtract two timestamps to get difference in milliseconds. Same as the - operator.  
* ``minus(20, 10) -> 10``  
* ``20 - 10 -> 10``  
* ``minus(toDate('2012-12-15'), 3) -> toDate('2012-12-12')``  
* ``toDate('2012-12-15') - 3 -> toDate('2012-12-12')``  
* ``toTimestamp('2019-02-03 05:19:28.871', 'yyyy-MM-dd HH:mm:ss.SSS') + (days(1) + hours(2) - seconds(10)) -> toTimestamp('2019-02-04 07:19:18.871', 'yyyy-MM-dd HH:mm:ss.SSS')``  
* ``toTimestamp('2019-02-03 05:21:34.851', 'yyyy-MM-dd HH:mm:ss.SSS') - toTimestamp('2019-02-03 05:21:36.923', 'yyyy-MM-dd HH:mm:ss.SSS') -> -2072``  
___


<a name="minute" ></a>

### <code>minute</code>
<code><b>minute(<i>&lt;value1&gt;</i> : timestamp, [<i>&lt;value2&gt;</i> : string]) => integer</b></code><br/><br/>
Gets the minute value of a timestamp. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  
* ``minute(toTimestamp('2009-07-30 12:58:59')) -> 58``  
* ``minute(toTimestamp('2009-07-30 12:58:59'), 'PST') -> 58``  
___


<a name="minutes" ></a>

### <code>minutes</code>
<code><b>minutes(<i>&lt;value1&gt;</i> : integer) => long</b></code><br/><br/>
Duration in milliseconds for number of minutes.  
* ``minutes(2) -> 120000L``  
___


<a name="mlookup" ></a>

### <code>mlookup</code>
<code><b>mlookup(key, key2, ...) => complex[]</b></code><br/><br/>
Looks up the all matching rows from the cached sink using the specified keys that match the keys from the cached sink.
* ``cacheSink#mlookup(movieId)``  
___


<a name="mod" ></a>

### <code>mod</code>
<code><b>mod(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => any</b></code><br/><br/>
Modulus of pair of numbers. Same as the % operator.  
* ``mod(20, 8) -> 4``  
* ``20 % 8 -> 4``  
___


<a name="month" ></a>

### <code>month</code>
<code><b>month(<i>&lt;value1&gt;</i> : datetime) => integer</b></code><br/><br/>
Gets the month value of a date or timestamp.  
* ``month(toDate('2012-8-8')) -> 8``  
___


<a name="monthsBetween" ></a>

### <code>monthsBetween</code>
<code><b>monthsBetween(<i>&lt;from date/timestamp&gt;</i> : datetime, <i>&lt;to date/timestamp&gt;</i> : datetime, [<i>&lt;roundoff&gt;</i> : boolean], [<i>&lt;time zone&gt;</i> : string]) => double</b></code><br/><br/>
Gets the number of months between two dates. You can round off the calculation.You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  
* ``monthsBetween(toTimestamp('1997-02-28 10:30:00'), toDate('1996-10-30')) -> 3.94959677``  
___


<a name="multiply" ></a>

### <code>multiply</code>
<code><b>multiply(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => any</b></code><br/><br/>
Multiplies pair of numbers. Same as the * operator.  
* ``multiply(20, 10) -> 200``  
* ``20 * 10 -> 200``  
___


<a name="negate" ></a>

### <code>negate</code>
<code><b>negate(<i>&lt;value1&gt;</i> : number) => number</b></code><br/><br/>
Negates a number. Turns positive numbers to negative and vice versa.  
* ``negate(13) -> -13``  
___


<a name="nextSequence" ></a>

### <code>nextSequence</code>
<code><b>nextSequence() => long</b></code><br/><br/>
Returns the next unique sequence. The number is consecutive only within a partition and is prefixed by the partitionId.  
* ``nextSequence() == 12313112 -> false``  
___


<a name="normalize" ></a>

### <code>normalize</code>
<code><b>normalize(<i>&lt;String to normalize&gt;</i> : string) => string</b></code><br/><br/>
Normalizes the string value to separate accented unicode characters.  
* ``regexReplace(normalize('bo²s'), `\p{M}`, '') -> 'boys'``
___


<a name="not" ></a>

### <code>not</code>
<code><b>not(<i>&lt;value1&gt;</i> : boolean) => boolean</b></code><br/><br/>
Logical negation operator.  
* ``not(true) -> false``  
* ``not(10 == 20) -> true``  
___


<a name="notEquals" ></a>

### <code>notEquals</code>
<code><b>notEquals(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => boolean</b></code><br/><br/>
Comparison not equals operator. Same as != operator.  
* ``12 != 24 -> true``  
* ``'bojjus' != 'bo' + 'jjus' -> false``  
___


<a name="notNull" ></a>

### <code>notNull</code>
<code><b>notNull(<i>&lt;value1&gt;</i> : any) => boolean</b></code><br/><br/>
Checks if the value is not NULL.  
* ``notNull(NULL()) -> false``  
* ``notNull('') -> true``  
___


<a name="nTile" ></a>

### <code>nTile</code>
<code><b>nTile([<i>&lt;value1&gt;</i> : integer]) => integer</b></code><br/><br/>
The ```NTile``` function divides the rows for each window partition into `n` buckets ranging from 1 to at most `n`. Bucket values will differ by at most 1. If the number of rows in the partition does not divide evenly into the number of buckets, then the remainder values are distributed one per bucket, starting with the first bucket. The ```NTile``` function is useful for the calculation of ```tertiles```, quartiles, deciles, and other common summary statistics. The function calculates two variables during initialization: The size of a regular bucket will have one extra row added to it. Both variables are based on the size of the current partition. During the calculation process the function keeps track of the current row number, the current bucket number, and the row number at which the bucket will change (bucketThreshold). When the current row number reaches bucket threshold, the bucket value is increased by one and the threshold is increased by the bucket size (plus one extra if the current bucket is padded).  
* ``nTile()``  
* ``nTile(numOfBuckets)``  
___


<a name="null" ></a>

### <code>null</code>
<code><b>null() => null</b></code><br/><br/>
Returns a NULL value. Use the function `syntax(null())` if there is a column named 'null'. Any operation that uses will result in a NULL.  
* ``isNull('dumbo' + null) -> true``  
* ``isNull(10 * null) -> true``  
* ``isNull('') -> false``  
* ``isNull(10 + 20) -> false``  
* ``isNull(10/0) -> true``  
___


<a name="or" ></a>

### <code>or</code>
<code><b>or(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : boolean) => boolean</b></code><br/><br/>
Logical OR operator. Same as ||.  
* ``or(true, false) -> true``  
* ``true || false -> true``  
___


<a name="originColumns" ></a>

### <code>originColumns</code>
<code><b>originColumns(<i>&lt;streamName&gt;</i> : string) => any</b></code><br/><br/>
Gets all output columns for a origin stream where columns were created. Must be enclosed in another function.
* ``array(toString(originColumns('source1')))``
___  


<a name="output" ></a>

### <code>output</code>
<code><b>output() => any</b></code><br/><br/>
Returns the first row of the results of the cache sink
* ``cacheSink#output()``  
___


<a name="outputs" ></a>

### <code>outputs</code>
<code><b>output() => any</b></code><br/><br/>
Returns the entire output row set of the results of the cache sink
* ``cacheSink#outputs()``
___



<a name="partitionId" ></a>

### <code>partitionId</code>
<code><b>partitionId() => integer</b></code><br/><br/>
Returns the current partition ID the input row is in.  
* ``partitionId()``  
___


<a name="pMod" ></a>

### <code>pMod</code>
<code><b>pMod(<i>&lt;value1&gt;</i> : any, <i>&lt;value2&gt;</i> : any) => any</b></code><br/><br/>
Positive Modulus of pair of numbers.  
* ``pmod(-20, 8) -> 4``  
___


<a name="power" ></a>

### <code>power</code>
<code><b>power(<i>&lt;value1&gt;</i> : number, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Raises one number to the power of another.  
* ``power(10, 2) -> 100``  
___


<a name="radians" ></a>

### <code>radians</code>
<code><b>radians(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Converts degrees to radians
* ``radians(180) => 3.141592653589793``  
___


<a name="random" ></a>

### <code>random</code>
<code><b>random(<i>&lt;value1&gt;</i> : integral) => long</b></code><br/><br/>
Returns a random number given an optional seed within a partition. The seed should be a fixed value and is used in conjunction with the partitionId to produce random values  
* ``random(1) == 1 -> false``
___


<a name="rank" ></a>

### <code>rank</code>
<code><b>rank() => integer</b></code><br/><br/>
Computes the rank of a value in a group of values specified in a window's order by clause. The result is one plus the number of rows preceding or equal to the current row in the ordering of the partition. The values will produce gaps in the sequence. Rank works even when data is not sorted and looks for change in values.  
* ``rank()``  
___


<a name="reassociate" ></a>

### <code>reassociate</code>
<code><b>reassociate(<i>&lt;value1&gt;</i> : map, <i>&lt;value2&gt;</i> : binaryFunction) => map</b></code><br/><br/>
Transforms a map by associating the keys to new values. It takes a mapping function where you can address the item as #key and current value as #value.  
* ``reassociate(['fruit' -> 'apple', 'vegetable' -> 'tomato'], substring(#key, 1, 1) + substring(#value, 1, 1)) => ['fruit' -> 'fa', 'vegetable' -> 'vt']``
___
  


<a name="reduce" ></a>

### <code>reduce</code>
<code><b>reduce(<i>&lt;value1&gt;</i> : array, <i>&lt;value2&gt;</i> : any, <i>&lt;value3&gt;</i> : binaryfunction, <i>&lt;value4&gt;</i> : unaryfunction) => any</b></code><br/><br/>
Accumulates elements in an array. Reduce expects a reference to an accumulator and one element in the first expression function as #acc and #item and it expects the resulting value as #result to be used in the second expression function.  
* ``toString(reduce(['1', '2', '3', '4'], '0', #acc + #item, #result)) -> '01234'``  
___


<a name="regexExtract" ></a>

### <code>regexExtract</code>
<code><b>regexExtract(<i>&lt;string&gt;</i> : string, <i>&lt;regex to find&gt;</i> : string, [<i>&lt;match group 1-based index&gt;</i> : integral]) => string</b></code><br/><br/>
Extract a matching substring for a given regex pattern. The last parameter identifies the match group and is defaulted to 1 if omitted. Use `<regex>`(back quote) to match a string without escaping.  
* ``regexExtract('Cost is between 600 and 800 dollars', '(\\d+) and (\\d+)', 2) -> '800'``  
* ``regexExtract('Cost is between 600 and 800 dollars', `(\d+) and (\d+)`, 2) -> '800'``  
___


<a name="regexMatch" ></a>

### <code>regexMatch</code>
<code><b>regexMatch(<i>&lt;string&gt;</i> : string, <i>&lt;regex to match&gt;</i> : string) => boolean</b></code><br/><br/>
Checks if the string matches the given regex pattern. Use `<regex>`(back quote) to match a string without escaping.  
* ``regexMatch('200.50', '(\\d+).(\\d+)') -> true``  
* ``regexMatch('200.50', `(\d+).(\d+)`) -> true``  
___


<a name="regexReplace" ></a>

### <code>regexReplace</code>
<code><b>regexReplace(<i>&lt;string&gt;</i> : string, <i>&lt;regex to find&gt;</i> : string, <i>&lt;substring to replace&gt;</i> : string) => string</b></code><br/><br/>
Replace all occurrences of a regex pattern with another substring in the given string Use `<regex>`(back quote) to match a string without escaping.  
* ``regexReplace('100 and 200', '(\\d+)', 'bojjus') -> 'bojjus and bojjus'``  
* ``regexReplace('100 and 200', `(\d+)`, 'gunchus') -> 'gunchus and gunchus'``  
___


<a name="regexSplit" ></a>

### <code>regexSplit</code>
<code><b>regexSplit(<i>&lt;string to split&gt;</i> : string, <i>&lt;regex expression&gt;</i> : string) => array</b></code><br/><br/>
Splits a string based on a delimiter based on regex and returns an array of strings.  
* ``regexSplit('bojjusAgunchusBdumbo', `[CAB]`) -> ['bojjus', 'gunchus', 'dumbo']``  
* ``regexSplit('bojjusAgunchusBdumboC', `[CAB]`) -> ['bojjus', 'gunchus', 'dumbo', '']``  
* ``(regexSplit('bojjusAgunchusBdumboC', `[CAB]`)[1]) -> 'bojjus'``  
* ``isNull(regexSplit('bojjusAgunchusBdumboC', `[CAB]`)[20]) -> true``  
___


<a name="replace" ></a>

### <code>replace</code>
<code><b>replace(<i>&lt;string&gt;</i> : string, <i>&lt;substring to find&gt;</i> : string, [<i>&lt;substring to replace&gt;</i> : string]) => string</b></code><br/><br/>
Replace all occurrences of a substring with another substring in the given string. If the last parameter is omitted, it is default to empty string.  
* ``replace('doggie dog', 'dog', 'cat') -> 'catgie cat'``  
* ``replace('doggie dog', 'dog', '') -> 'gie '``  
* ``replace('doggie dog', 'dog') -> 'gie '``  
___


<a name="reverse" ></a>

### <code>reverse</code>
<code><b>reverse(<i>&lt;value1&gt;</i> : string) => string</b></code><br/><br/>
Reverses a string.  
* ``reverse('gunchus') -> 'suhcnug'``  
___


<a name="right" ></a>

### <code>right</code>
<code><b>right(<i>&lt;string to subset&gt;</i> : string, <i>&lt;number of characters&gt;</i> : integral) => string</b></code><br/><br/>
Extracts a substring with number of characters from the right. Same as SUBSTRING(str, LENGTH(str) - n, n).  
* ``right('bojjus', 2) -> 'us'``  
* ``right('bojjus', 20) -> 'bojjus'``  
___


<a name="rlike" ></a>

### <code>rlike</code>
<code><b>rlike(<i>&lt;string&gt;</i> : string, <i>&lt;pattern match&gt;</i> : string) => boolean</b></code><br/><br/>
Checks if the string matches the given regex pattern.  
* ``rlike('200.50', `(\d+).(\d+)`) -> true``  
* ``rlike('bogus', `M[0-9]+.*`) -> false``  
___


<a name="round" ></a>

### <code>round</code>
<code><b>round(<i>&lt;number&gt;</i> : number, [<i>&lt;scale to round&gt;</i> : number], [<i>&lt;rounding option&gt;</i> : integral]) => double</b></code><br/><br/>
Rounds a number given an optional scale and an optional rounding mode. If the scale is omitted, it is defaulted to 0. If the mode is omitted, it is defaulted to ROUND_HALF_UP(5). The values for rounding include
1 - ROUND_UP
2 - ROUND_DOWN
3 - ROUND_CEILING
4 - ROUND_FLOOR
5 - ROUND_HALF_UP
6 - ROUND_HALF_DOWN
7 - ROUND_HALF_EVEN
8 - ROUND_UNNECESSARY.  
* ``round(100.123) -> 100.0``  
* ``round(2.5, 0) -> 3.0``  
* ``round(5.3999999999999995, 2, 7) -> 5.40``  
___


<a name="rowNumber" ></a>

### <code>rowNumber</code>
<code><b>rowNumber() => integer</b></code><br/><br/>
Assigns a sequential row numbering for rows in a window starting with 1.  
* ``rowNumber()``  



<a name="rpad" ></a>

### <code>rpad</code>
<code><b>rpad(<i>&lt;string to pad&gt;</i> : string, <i>&lt;final padded length&gt;</i> : integral, <i>&lt;padding&gt;</i> : string) => string</b></code><br/><br/>
Right pads the string by the supplied padding until it is of a certain length. If the string is equal to or greater than the length, then it is trimmed to the length.  
* ``rpad('dumbo', 10, '-') -> 'dumbo-----'``  
* ``rpad('dumbo', 4, '-') -> 'dumb'``  
* ``rpad('dumbo', 8, '<>') -> 'dumbo<><'``  
___


<a name="rtrim" ></a>

### <code>rtrim</code>
<code><b>rtrim(<i>&lt;string to trim&gt;</i> : string, [<i>&lt;trim characters&gt;</i> : string]) => string</b></code><br/><br/>
Right trims a string of trailing characters. If second parameter is unspecified, it trims whitespace. Else it trims any character specified in the second parameter.  
* ``rtrim('  dumbo  ') -> '  dumbo'``  
* ``rtrim('!--!du!mbo!', '-!') -> '!--!du!mbo'``  
___


<a name="second" ></a>

### <code>second</code>
<code><b>second(<i>&lt;value1&gt;</i> : timestamp, [<i>&lt;value2&gt;</i> : string]) => integer</b></code><br/><br/>
Gets the second value of a date. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. The local timezone is used as the default. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  
* ``second(toTimestamp('2009-07-30 12:58:59')) -> 59``  
___


<a name="seconds" ></a>

### <code>seconds</code>
<code><b>seconds(<i>&lt;value1&gt;</i> : integer) => long</b></code><br/><br/>
Duration in milliseconds for number of seconds.  
* ``seconds(2) -> 2000L``  
___


<a name="setBitSet" ></a>

### <code>setBitSet</code>
<code><b>setBitSet (<i>\<value1\></i>: array, <i>\<value2\></i>:array) => array</b></code><br/><br/>
Sets bit positions in this bitset
* ``setBitSet(toBitSet([10, 32]), [98]) => [4294968320L, 17179869184L]``
___  


<a name="sha1" ></a>

### <code>sha1</code>
<code><b>sha1(<i>&lt;value1&gt;</i> : any, ...) => string</b></code><br/><br/>
Calculates the SHA-1 digest of set of column of varying primitive datatypes and returns a 40 character hex string. It can be used to calculate a fingerprint for a row.  
* ``sha1(5, 'gunchus', 8.2, 'bojjus', true, toDate('2010-4-4')) -> '46d3b478e8ec4e1f3b453ac3d8e59d5854e282bb'``  
___


<a name="sha2" ></a>

### <code>sha2</code>
<code><b>sha2(<i>&lt;value1&gt;</i> : integer, <i>&lt;value2&gt;</i> : any, ...) => string</b></code><br/><br/>
Calculates the SHA-2 digest of set of column of varying primitive datatypes given a bit length which can only be of values 0(256), 224, 256, 384, 512. It can be used to calculate a fingerprint for a row.  
* ``sha2(256, 'gunchus', 8.2, 'bojjus', true, toDate('2010-4-4')) -> 'afe8a553b1761c67d76f8c31ceef7f71b66a1ee6f4e6d3b5478bf68b47d06bd3'``  
___


<a name="sin" ></a>

### <code>sin</code>
<code><b>sin(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates a sine value.  
* ``sin(2) -> 0.9092974268256817``  
___


<a name="sinh" ></a>

### <code>sinh</code>
<code><b>sinh(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates a hyperbolic sine value.  
* ``sinh(0) -> 0.0``  
___


<a name="size" ></a>

### <code>size</code>
<code><b>size(<i>&lt;value1&gt;</i> : any) => integer</b></code><br/><br/>
Finds the size of an array or map type  
* ``size(['element1', 'element2']) -> 2``
* ``size([1,2,3]) -> 3``
___


<a name="skewness" ></a>

### <code>skewness</code>
<code><b>skewness(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Gets the skewness of a column.  
* ``skewness(sales)``  
___


<a name="skewnessIf" ></a>

### <code>skewnessIf</code>
<code><b>skewnessIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Based on a criteria, gets the skewness of a column.  
* ``skewnessIf(region == 'West', sales)``  
___


<a name="slice" ></a>

### <code>slice</code>
<code><b>slice(<i>&lt;array to slice&gt;</i> : array, <i>&lt;from 1-based index&gt;</i> : integral, [<i>&lt;number of items&gt;</i> : integral]) => array</b></code><br/><br/>
Extracts a subset of an array from a position. Position is 1 based. If the length is omitted, it is defaulted to end of the string.  
* ``slice([10, 20, 30, 40], 1, 2) -> [10, 20]``  
* ``slice([10, 20, 30, 40], 2) -> [20, 30, 40]``  
* ``slice([10, 20, 30, 40], 2)[1] -> 20``  
* ``isNull(slice([10, 20, 30, 40], 2)[0]) -> true``  
* ``isNull(slice([10, 20, 30, 40], 2)[20]) -> true``  
* ``slice(['a', 'b', 'c', 'd'], 8) -> []``  
___


<a name="sort" ></a>

### <code>sort</code>
<code><b>sort(<i>&lt;value1&gt;</i> : array, <i>&lt;value2&gt;</i> : binaryfunction) => array</b></code><br/><br/>
Sorts the array using the provided predicate function. Sort expects a reference to two consecutive elements in the expression function as #item1 and #item2.  
* ``sort([4, 8, 2, 3], compare(#item1, #item2)) -> [2, 3, 4, 8]``  
* ``sort(['a3', 'b2', 'c1'], iif(right(#item1, 1) >= right(#item2, 1), 1, -1)) -> ['c1', 'b2', 'a3']``  
___


<a name="soundex" ></a>

### <code>soundex</code>
<code><b>soundex(<i>&lt;value1&gt;</i> : string) => string</b></code><br/><br/>
Gets the ```soundex``` code for the string.  
* ``soundex('genius') -> 'G520'``  
___


<a name="split" ></a>

### <code>split</code>
<code><b>split(<i>&lt;string to split&gt;</i> : string, <i>&lt;split characters&gt;</i> : string) => array</b></code><br/><br/>
Splits a string based on a delimiter and returns an array of strings.  
* ``split('bojjus,guchus,dumbo', ',') -> ['bojjus', 'guchus', 'dumbo']``  
* ``split('bojjus,guchus,dumbo', '|') -> ['bojjus,guchus,dumbo']``  
* ``split('bojjus, guchus, dumbo', ', ') -> ['bojjus', 'guchus', 'dumbo']``  
* ``split('bojjus, guchus, dumbo', ', ')[1] -> 'bojjus'``  
* ``isNull(split('bojjus, guchus, dumbo', ', ')[0]) -> true``  
* ``isNull(split('bojjus, guchus, dumbo', ', ')[20]) -> true``  
* ``split('bojjusguchusdumbo', ',') -> ['bojjusguchusdumbo']``  
___


<a name="sqrt" ></a>

### <code>sqrt</code>
<code><b>sqrt(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates the square root of a number.  
* ``sqrt(9) -> 3``  
___


<a name="startsWith" ></a>

### <code>startsWith</code>
<code><b>startsWith(<i>&lt;string&gt;</i> : string, <i>&lt;substring to check&gt;</i> : string) => boolean</b></code><br/><br/>
Checks if the string starts with the supplied string.  
* ``startsWith('dumbo', 'du') -> true``  
___


<a name="stddev" ></a>

### <code>stddev</code>
<code><b>stddev(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Gets the standard deviation of a column.  
* ``stdDev(sales)``  
___


<a name="stddevIf" ></a>

### <code>stddevIf</code>
<code><b>stddevIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Based on a criteria, gets the standard deviation of a column.  
* ``stddevIf(region == 'West', sales)``  
___


<a name="stddevPopulation" ></a>

### <code>stddevPopulation</code>
<code><b>stddevPopulation(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Gets the population standard deviation of a column.  
* ``stddevPopulation(sales)``  
___


<a name="stddevPopulationIf" ></a>

### <code>stddevPopulationIf</code>
<code><b>stddevPopulationIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Based on a criteria, gets the population standard deviation of a column.  
* ``stddevPopulationIf(region == 'West', sales)``  
___


<a name="stddevSample" ></a>

### <code>stddevSample</code>
<code><b>stddevSample(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Gets the sample standard deviation of a column.  
* ``stddevSample(sales)``  
___


<a name="stddevSampleIf" ></a>

### <code>stddevSampleIf</code>
<code><b>stddevSampleIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Based on a criteria, gets the sample standard deviation of a column.  
* ``stddevSampleIf(region == 'West', sales)``  
___


<a name="subDays" ></a>

### <code>subDays</code>
<code><b>subDays(<i>&lt;date/timestamp&gt;</i> : datetime, <i>&lt;days to subtract&gt;</i> : integral) => datetime</b></code><br/><br/>
Subtract days from a date or timestamp. Same as the - operator for date.  
* ``subDays(toDate('2016-08-08'), 1) -> toDate('2016-08-07')``  
___


<a name="subMonths" ></a>

### <code>subMonths</code>
<code><b>subMonths(<i>&lt;date/timestamp&gt;</i> : datetime, <i>&lt;months to subtract&gt;</i> : integral) => datetime</b></code><br/><br/>
Subtract months from a date or timestamp.  
* ``subMonths(toDate('2016-09-30'), 1) -> toDate('2016-08-31')``  
___


<a name="substring" ></a>

### <code>substring</code>
<code><b>substring(<i>&lt;string to subset&gt;</i> : string, <i>&lt;from 1-based index&gt;</i> : integral, [<i>&lt;number of characters&gt;</i> : integral]) => string</b></code><br/><br/>
Extracts a substring of a certain length from a position. Position is 1 based. If the length is omitted, it is defaulted to end of the string.  
* ``substring('Cat in the hat', 5, 2) -> 'in'``  
* ``substring('Cat in the hat', 5, 100) -> 'in the hat'``  
* ``substring('Cat in the hat', 5) -> 'in the hat'``  
* ``substring('Cat in the hat', 100, 100) -> ''``  
___


<a name="sum" ></a>

### <code>sum</code>
<code><b>sum(<i>&lt;value1&gt;</i> : number) => number</b></code><br/><br/>
Gets the aggregate sum of a numeric column.  
* ``sum(col)``  
___


<a name="sumDistinct" ></a>

### <code>sumDistinct</code>
<code><b>sumDistinct(<i>&lt;value1&gt;</i> : number) => number</b></code><br/><br/>
Gets the aggregate sum of distinct values of a numeric column.  
* ``sumDistinct(col)``  
___


<a name="sumDistinctIf" ></a>

### <code>sumDistinctIf</code>
<code><b>sumDistinctIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => number</b></code><br/><br/>
Based on criteria gets the aggregate sum of a numeric column. The condition can be based on any column.  
* ``sumDistinctIf(state == 'CA' && commission < 10000, sales)``  
* ``sumDistinctIf(true, sales)``  
___


<a name="sumIf" ></a>

### <code>sumIf</code>
<code><b>sumIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => number</b></code><br/><br/>
Based on criteria gets the aggregate sum of a numeric column. The condition can be based on any column.  
* ``sumIf(state == 'CA' && commission < 10000, sales)``  
* ``sumIf(true, sales)``  
___


<a name="tan" ></a>

### <code>tan</code>
<code><b>tan(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates a tangent value.  
* ``tan(0) -> 0.0``  
___


<a name="tanh" ></a>

### <code>tanh</code>
<code><b>tanh(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Calculates a hyperbolic tangent value.  
* ``tanh(0) -> 0.0``  
___


<a name="toBase64" ></a>

### <code>toBase64</code>
<code><b>toBase64(<i>&lt;value1&gt;</i> : string) => string</b></code><br/><br/>
Encodes the given string in base64.  
* ``toBase64('bojjus') -> 'Ym9qanVz'``  
___


<a name="toBinary" ></a>

### <code>toBinary</code>
<code><b>toBinary(<i>&lt;value1&gt;</i> : any) => binary</b></code><br/><br/>
Converts any numeric/date/timestamp/string to binary representation.  
* ``toBinary(3) -> [0x11]``  
___


<a name="toBoolean" ></a>

### <code>toBoolean</code>
<code><b>toBoolean(<i>&lt;value1&gt;</i> : string) => boolean</b></code><br/><br/>
Converts a value of ('t', 'true', 'y', 'yes', '1') to true and ('f', 'false', 'n', 'no', '0') to false and NULL for any other value.  
* ``toBoolean('true') -> true``  
* ``toBoolean('n') -> false``  
* ``isNull(toBoolean('truthy')) -> true``  
___


<a name="toByte" ></a>

### <code>toByte</code>
<code><b>toByte(<i>&lt;value&gt;</i> : any, [<i>&lt;format&gt;</i> : string], [<i>&lt;locale&gt;</i> : string]) => byte</b></code><br/><br/>
Converts any numeric or string to a byte value. An optional Java decimal format can be used for the conversion.  
* ``toByte(123)``
* ``123``
* ``toByte(0xFF)``
* ``-1``
* ``toByte('123')``
* ``123``
___


<a name="toDate" ></a>

### <code>toDate</code>
<code><b>toDate(<i>&lt;string&gt;</i> : any, [<i>&lt;date format&gt;</i> : string]) => date</b></code><br/><br/>
Converts input date string to date using an optional input date format. Refer Java's `SimpleDateFormat` class for available formats. If the input date format is omitted, default format is yyyy-[M]M-[d]d. Accepted formats are :[ yyyy, yyyy-[M]M, yyyy-[M]M-[d]d, yyyy-[M]M-[d]dT* ].  
* ``toDate('2012-8-18') -> toDate('2012-08-18')``  
* ``toDate('12/18/2012', 'MM/dd/yyyy') -> toDate('2012-12-18')``  
___


<a name="toDecimal" ></a>

### <code>toDecimal</code>
<code><b>toDecimal(<i>&lt;value&gt;</i> : any, [<i>&lt;precision&gt;</i> : integral], [<i>&lt;scale&gt;</i> : integral], [<i>&lt;format&gt;</i> : string], [<i>&lt;locale&gt;</i> : string]) => decimal(10,0)</b></code><br/><br/>
Converts any numeric or string to a decimal value. If precision and scale are not specified, it is defaulted to (10,2).An optional Java decimal format can be used for the conversion. An optional locale format in the form of BCP47 language like en-US, de, zh-CN.  
* ``toDecimal(123.45) -> 123.45``  
* ``toDecimal('123.45', 8, 4) -> 123.4500``  
* ``toDecimal('$123.45', 8, 4,'$###.00') -> 123.4500``  
* ``toDecimal('Ç123,45', 10, 2, 'Ç###,##', 'de') -> 123.45``  
___


<a name="toDouble" ></a>

### <code>toDouble</code>
<code><b>toDouble(<i>&lt;value&gt;</i> : any, [<i>&lt;format&gt;</i> : string], [<i>&lt;locale&gt;</i> : string]) => double</b></code><br/><br/>
Converts any numeric or string to a double value. An optional Java decimal format can be used for the conversion. An optional locale format in the form of BCP47 language like en-US, de, zh-CN.  
* ``toDouble(123.45) -> 123.45``  
* ``toDouble('123.45') -> 123.45``  
* ``toDouble('$123.45', '$###.00') -> 123.45``  
* ``toDouble('Ç123,45', 'Ç###,##', 'de') -> 123.45``  
___


<a name="toFloat" ></a>

### <code>toFloat</code>
<code><b>toFloat(<i>&lt;value&gt;</i> : any, [<i>&lt;format&gt;</i> : string], [<i>&lt;locale&gt;</i> : string]) => float</b></code><br/><br/>
Converts any numeric or string to a float value. An optional Java decimal format can be used for the conversion. Truncates any double.  
* ``toFloat(123.45) -> 123.45f``  
* ``toFloat('123.45') -> 123.45f``  
* ``toFloat('$123.45', '$###.00') -> 123.45f``  
___


<a name="toInteger" ></a>

### <code>toInteger</code>
<code><b>toInteger(<i>&lt;value&gt;</i> : any, [<i>&lt;format&gt;</i> : string], [<i>&lt;locale&gt;</i> : string]) => integer</b></code><br/><br/>
Converts any numeric or string to an integer value. An optional Java decimal format can be used for the conversion. Truncates any long, float, double.  
* ``toInteger(123) -> 123``  
* ``toInteger('123') -> 123``  
* ``toInteger('$123', '$###') -> 123``  
___


<a name="toLong" ></a>

### <code>toLong</code>
<code><b>toLong(<i>&lt;value&gt;</i> : any, [<i>&lt;format&gt;</i> : string], [<i>&lt;locale&gt;</i> : string]) => long</b></code><br/><br/>
Converts any numeric or string to a long value. An optional Java decimal format can be used for the conversion. Truncates any float, double.  
* ``toLong(123) -> 123``  
* ``toLong('123') -> 123``  
* ``toLong('$123', '$###') -> 123``  
___


<a name="toShort" ></a>

### <code>toShort</code>
<code><b>toShort(<i>&lt;value&gt;</i> : any, [<i>&lt;format&gt;</i> : string], [<i>&lt;locale&gt;</i> : string]) => short</b></code><br/><br/>
Converts any numeric or string to a short value. An optional Java decimal format can be used for the conversion. Truncates any integer, long, float, double.  
* ``toShort(123) -> 123``  
* ``toShort('123') -> 123``  
* ``toShort('$123', '$###') -> 123``  
___


<a name="toString" ></a>

### <code>toString</code>
<code><b>toString(<i>&lt;value&gt;</i> : any, [<i>&lt;number format/date format&gt;</i> : string]) => string</b></code><br/><br/>
Converts a primitive datatype to a string. For numbers and date a format can be specified. If unspecified the system default is picked.Java decimal format is used for numbers. Refer to Java SimpleDateFormat for all possible date formats; the default format is yyyy-MM-dd.  
* ``toString(10) -> '10'``  
* ``toString('engineer') -> 'engineer'``  
* ``toString(123456.789, '##,###.##') -> '123,456.79'``  
* ``toString(123.78, '000000.000') -> '000123.780'``  
* ``toString(12345, '##0.#####E0') -> '12.345E3'``  
* ``toString(toDate('2018-12-31')) -> '2018-12-31'``  
* ``isNull(toString(toDate('2018-12-31', 'MM/dd/yy'))) -> true``  
* ``toString(4 == 20) -> 'false'``  
___


<a name="toTimestamp" ></a>

### <code>toTimestamp</code>
<code><b>toTimestamp(<i>&lt;string&gt;</i> : any, [<i>&lt;timestamp format&gt;</i> : string], [<i>&lt;time zone&gt;</i> : string]) => timestamp</b></code><br/><br/>
Converts a string to a timestamp given an optional timestamp format. If the timestamp is omitted the default pattern yyyy-[M]M-[d]d hh:mm:ss[.f...] is used. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. Timestamp supports up to millisecond accuracy with value of 999. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  
* ``toTimestamp('2016-12-31 00:12:00') -> toTimestamp('2016-12-31 00:12:00')``  
* ``toTimestamp('2016-12-31T00:12:00', 'yyyy-MM-dd\'T\'HH:mm:ss', 'PST') -> toTimestamp('2016-12-31 00:12:00')``  
* ``toTimestamp('12/31/2016T00:12:00', 'MM/dd/yyyy\'T\'HH:mm:ss') -> toTimestamp('2016-12-31 00:12:00')``  
* ``millisecond(toTimestamp('2019-02-03 05:19:28.871', 'yyyy-MM-dd HH:mm:ss.SSS')) -> 871``  
___


<a name="toUTC" ></a>

### <code>toUTC</code>
<code><b>toUTC(<i>&lt;value1&gt;</i> : timestamp, [<i>&lt;value2&gt;</i> : string]) => timestamp</b></code><br/><br/>
Converts the timestamp to UTC. You can pass an optional timezone in the form of 'GMT', 'PST', 'UTC', 'America/Cayman'. It is defaulted to the current timezone. Refer Java's `SimpleDateFormat` class for available formats. https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html.  
* ``toUTC(currentTimestamp()) == toTimestamp('2050-12-12 19:18:12') -> false``  
* ``toUTC(currentTimestamp(), 'Asia/Seoul') != toTimestamp('2050-12-12 19:18:12') -> true``  



<a name="translate" ></a>

### <code>translate</code>
<code><b>translate(<i>&lt;string to translate&gt;</i> : string, <i>&lt;lookup characters&gt;</i> : string, <i>&lt;replace characters&gt;</i> : string) => string</b></code><br/><br/>
Replace one set of characters by another set of characters in the string. Characters have 1 to 1 replacement.  
* ``translate('(bojjus)', '()', '[]') -> '[bojjus]'``  
* ``translate('(gunchus)', '()', '[') -> '[gunchus'``  
___


<a name="trim" ></a>

### <code>trim</code>
<code><b>trim(<i>&lt;string to trim&gt;</i> : string, [<i>&lt;trim characters&gt;</i> : string]) => string</b></code><br/><br/>
Trims a string of leading and trailing characters. If second parameter is unspecified, it trims whitespace. Else it trims any character specified in the second parameter.  
* ``trim('  dumbo  ') -> 'dumbo'``  
* ``trim('!--!du!mbo!', '-!') -> 'du!mbo'``  
___


<a name="true" ></a>

### <code>true</code>
<code><b>true() => boolean</b></code><br/><br/>
Always returns a true value. Use the function `syntax(true())` if there is a column named 'true'.  
* ``(10 + 20 == 30) -> true``  
* ``(10 + 20 == 30) -> true()``  
___


<a name="typeMatch" ></a>

### <code>typeMatch</code>
<code><b>typeMatch(<i>&lt;type&gt;</i> : string, <i>&lt;base type&gt;</i> : string) => boolean</b></code><br/><br/>
Matches the type of the column. Can only be used in pattern expressions.number matches short, integer, long, double, float or decimal, integral matches short, integer, long, fractional matches double, float, decimal and datetime matches date or timestamp type.  
* ``typeMatch(type, 'number')``  
* ``typeMatch('date', 'datetime')``  
___


<a name="unescape" ></a>

### <code>unescape</code>
<code><b>unescape(<i>&lt;string_to_escape&gt;</i> : string, <i>&lt;format&gt;</i> : string) => string</b></code><br/><br/>
Unescapes a string according to a format. Literal values for acceptable format are 'json', 'xml', 'ecmascript', 'html', 'java'.
* ```unescape('{\\\\\"value\\\\\": 10}', 'json')```
* ```'{\\\"value\\\": 10}'```
___


<a name="unfold" ></a>

### <code>unfold</code>
<code><b>unfold (<i>&lt;value1&gt;</i>: array) => any</b></code><br/><br/>
Unfolds an array into a set of rows and repeats the values for the remaining columns in every row.
*	``unfold(addresses) => any``
*	``unfold( @(name = salesPerson, sales = salesAmount) ) => any``
___  


<a name="unhex" ></a>

### <code>unhex</code>
<code><b>unhex(<i>\<value1\></i>: string) => binary</b></code><br/><br/>
Unhexes a binary value from its string representation. This can be used in conjunction with sha2, md5 to convert from string to binary representation
*    ``unhex('1fadbe') -> toBinary([toByte(0x1f), toByte(0xad), toByte(0xbe)])``
*    ``unhex(md5(5, 'gunchus', 8.2, 'bojjus', true, toDate('2010-4-4'))) -> toBinary([toByte(0x4c),toByte(0xe8),toByte(0xa8),toByte(0x80),toByte(0xbd),toByte(0x62),toByte(0x1a),toByte(0x1f),toByte(0xfa),toByte(0xd0),toByte(0xbc),toByte(0xa9),toByte(0x05),toByte(0xe1),toByte(0xbc),toByte(0x5a)])``



<a name="union" ></a>

### <code>union</code>
<code><b>union(<i>&lt;value1&gt;</i>: array, <i>&lt;value2&gt;</i> : array) => array</b></code><br/><br/>
Returns a union set of distinct items from 2 arrays.
* ``union([10, 20, 30], [20, 40]) => [10, 20, 30, 40]``
___  
  


<a name="upper" ></a>

### <code>upper</code>
<code><b>upper(<i>&lt;value1&gt;</i> : string) => string</b></code><br/><br/>
Uppercases a string.  
* ``upper('bojjus') -> 'BOJJUS'``  
___


<a name="uuid" ></a>

### <code>uuid</code>
<code><b>uuid() => string</b></code><br/><br/>
Returns the generated UUID.  
* ``uuid()``  
___


<a name="variance" ></a>

### <code>variance</code>
<code><b>variance(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Gets the variance of a column.  
* ``variance(sales)``  
___


<a name="varianceIf" ></a>

### <code>varianceIf</code>
<code><b>varianceIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Based on a criteria, gets the variance of a column.  
* ``varianceIf(region == 'West', sales)``  
___


<a name="variancePopulation" ></a>

### <code>variancePopulation</code>
<code><b>variancePopulation(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Gets the population variance of a column.  
* ``variancePopulation(sales)``  
___


<a name="variancePopulationIf" ></a>

### <code>variancePopulationIf</code>
<code><b>variancePopulationIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Based on a criteria, gets the population variance of a column.  
* ``variancePopulationIf(region == 'West', sales)``  
___


<a name="varianceSample" ></a>

### <code>varianceSample</code>
<code><b>varianceSample(<i>&lt;value1&gt;</i> : number) => double</b></code><br/><br/>
Gets the unbiased variance of a column.  
* ``varianceSample(sales)``  
___


<a name="varianceSampleIf" ></a>

### <code>varianceSampleIf</code>
<code><b>varianceSampleIf(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : number) => double</b></code><br/><br/>
Based on a criteria, gets the unbiased variance of a column.  
* ``varianceSampleIf(region == 'West', sales)``  



<a name="weekOfYear" ></a>

### <code>weekOfYear</code>
<code><b>weekOfYear(<i>&lt;value1&gt;</i> : datetime) => integer</b></code><br/><br/>
Gets the week of the year given a date.  
* ``weekOfYear(toDate('2008-02-20')) -> 8``  
___


<a name="weeks" ></a>

### <code>weeks</code>
<code><b>weeks(<i>&lt;value1&gt;</i> : integer) => long</b></code><br/><br/>
Duration in milliseconds for number of weeks.  
* ``weeks(2) -> 1209600000L``  
___


<a name="xor" ></a>

### <code>xor</code>
<code><b>xor(<i>&lt;value1&gt;</i> : boolean, <i>&lt;value2&gt;</i> : boolean) => boolean</b></code><br/><br/>
Logical XOR operator. Same as ^ operator.  
* ``xor(true, false) -> true``  
* ``xor(true, true) -> false``  
* ``true ^ false -> true``  
___


<a name="year" ></a>

### <code>year</code>
<code><b>year(<i>&lt;value1&gt;</i> : datetime) => integer</b></code><br/><br/>
Gets the year value of a date.  
* ``year(toDate('2012-8-8')) -> 2012``  

## Next steps

[Learn how to use Expression Builder](concepts-data-flow-expression-builder.md).
