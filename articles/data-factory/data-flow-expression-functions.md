---
title: Expression Functions in the Mapping Data Flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about expression functions in mapping data flows.
author: kromerm
ms.author: makromer
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 02/13/2025
---

# Expression functions in mapping data flows

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

This article provides details about expression functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Expression functions list

In Azure Data Factory and Azure Synapse Analytics pipelines, use the expression language of the mapping data flow feature to configure data transformations.

| Expression function | Task |
|-----|-----|
| [abs](data-flow-expressions-usage.md#abs) | Gives the absolute value of a number.  |
| [acos](data-flow-expressions-usage.md#acos) | Calculates a cosine inverse value.  |
| [add](data-flow-expressions-usage.md#add) | Adds a pair of strings or numbers. Adds a date to a number of days. Adds a duration to a time stamp. Appends one array of similar type to another. Same as the `+` operator.  |
| [and](data-flow-expressions-usage.md#and) | Uses the logical `AND` operator. Same as `&&`.  |
| [asin](data-flow-expressions-usage.md#asin) | Calculates an inverse sine value.  |
| [assertErrorMessages](data-flow-expressions-usage.md#assertErrorMessages) | Returns a map of all assert messages. |
| [atan](data-flow-expressions-usage.md#atan) | Calculates an inverse tangent value.  |
| [atan2](data-flow-expressions-usage.md#atan2) | Returns the angle in radians between the positive x-axis of a plane and the point given by the coordinates.  |
| [between](data-flow-expressions-usage.md#between) | Checks if the first value is in between two other values inclusively. You can compare numeric, string, and `datetime` values.  |
| [bitwiseAnd](data-flow-expressions-usage.md#bitwiseAnd) | Uses the bitwise `And` operator across integral types. Same as the `&` operator.  |
| [bitwiseOr](data-flow-expressions-usage.md#bitwiseOr) | Uses the bitwise `Or` operator across integral types. Same as the `|` operator.  |
| [bitwiseXor](data-flow-expressions-usage.md#bitwiseXor) | Uses the bitwise `Or` operator across integral types. Same as the `|` operator.  |
| [blake2b](data-flow-expressions-usage.md#blake2b) | Calculates the Blake2 digest of a set of columns of varying primitive data types when given a bit length. The bit length can only be multiples of 8 between 8 and 512. You can use it to calculate a fingerprint for a row.  |
| [blake2bBinary](data-flow-expressions-usage.md#blake2bBinary) | Calculates the Blake2 digest of a set of columns of varying primitive data types when given a bit length, which can only be multiples of 8 between 8 and 512. You can use it to calculate a fingerprint for a row.  |
| [case](data-flow-expressions-usage.md#case) | Applies one value or the other based on alternating conditions. If the number of inputs is even, the other is defaulted to `NULL` for the last condition.  |
| [cbrt](data-flow-expressions-usage.md#cbrt) | Calculates the cube root of a number.  |
| [ceil](data-flow-expressions-usage.md#ceil) | Returns the smallest integer not smaller than the number.  |
| [coalesce](data-flow-expressions-usage.md#coalesce) | Returns the first not null value from a set of inputs. All inputs should be of the same type.  |
| [columnNames](data-flow-expressions-usage.md#columnNames) | Gets the names of all output columns for a stream. You can pass an optional stream name as the first argument and optional second argument to return only schema drift columns.  |
| [columns](data-flow-expressions-usage.md#columns) | Gets the values of all output columns for a stream. You can pass an optional stream name as the second argument.   |
| [compare](data-flow-expressions-usage.md#compare) | Compares two values of the same type. Returns a negative integer if value1 < value2 or 0 if value1 == value2, and returns a positive value if value1 > value2.  |
| [concat](data-flow-expressions-usage.md#concat) | Concatenates a variable number of strings together. Same as the `+` operator with strings.  |
| [concatWS](data-flow-expressions-usage.md#concatWS) | Concatenates a variable number of strings together with a separator. The first parameter is the separator.  |
| [cos](data-flow-expressions-usage.md#cos) | Calculates a cosine value.  |
| [cosh](data-flow-expressions-usage.md#cosh) | Calculates a hyperbolic cosine of a value.  |
| [crc32](data-flow-expressions-usage.md#crc32) | Calculates the CRC32 hash of a set of columns of varying primitive data types when given a bit length. The bit length must be of values `0` (`256`), `224`, `256`, `384`, and `512`. You can use it to calculate a fingerprint for a row.  |
| [degrees](data-flow-expressions-usage.md#degrees) | Converts radians to degrees.  |
| [divide](data-flow-expressions-usage.md#divide) | Divides a pair of numbers. Same as the `/` operator.  |
| [dropLeft](data-flow-expressions-usage.md#dropLeft) | Removes as many characters as specified from the left of the string. If the drop requested exceeds the length of the string, an empty string is returned.|
| [dropRight](data-flow-expressions-usage.md#dropRight) | Removes as many characters as specified from the right of the string. If the drop requested exceeds the length of the string, an empty string is returned.|
| [endsWith](data-flow-expressions-usage.md#endsWith) | Checks if the string ends with the supplied string.  |
| [equals](data-flow-expressions-usage.md#equals) | Uses the comparison equals operator. Same as the `==` operator.  |
| [equalsIgnoreCase](data-flow-expressions-usage.md#equalsIgnoreCase) | Uses the comparison equals operator and ignores case. Same as the `<=>` operator.  |
| [escape](data-flow-expressions-usage.md#escape) | Escapes a string according to a format. Literal values for acceptable format are `json`, `xml`, `ecmascript`, `html`, and `java`.|
| [expr](data-flow-expressions-usage.md#expr) | Results in an expression from a string. Equivalent to writing the expression in a nonliteral form. You can use it to pass parameters as string representations.|
| [factorial](data-flow-expressions-usage.md#factorial) | Calculates the factorial of a number.  |
| [false](data-flow-expressions-usage.md#false) | Always returns a false value. Use the function `syntax(false())` if there's a column named `false`.  |
| [floor](data-flow-expressions-usage.md#floor) | Returns the largest integer not greater than the number.  |
| [fromBase64](data-flow-expressions-usage.md#fromBase64) | Decodes the specific base64-encoded string.|
| [greater](data-flow-expressions-usage.md#greater) | Uses the comparison greater than operator. Same as the `>` operator.  |
| [greaterOrEqual](data-flow-expressions-usage.md#greaterOrEqual) | Uses the comparison greater than or equal to operator. Same as the `>=` operator.  |
| [greatest](data-flow-expressions-usage.md#greatest) | Returns the greatest value among the list of values as input skipping null values. Returns null if all inputs are null.  |
| [hasColumn](data-flow-expressions-usage.md#hasColumn) | Checks for a column value by name in the stream. You can pass an optional stream name as the second argument. Column names known at design time should be addressed by using their name only. Computed inputs aren't supported, but you can use parameter substitutions.  |
| [hasError](data-flow-expressions-usage.md#hasError) | Checks if the assert with the provided ID is marked as an error. |
| [iif](data-flow-expressions-usage.md#iif) | Applies one value or the other based on a condition. If the other is unspecified, the value is considered `NULL`. Both the values must be compatible (for example, numeric or string).  |
| [iifNull](data-flow-expressions-usage.md#iifNull) | Returns the first not null item when given two or more inputs. This function is equivalent to `coalesce`. |
| [initCap](data-flow-expressions-usage.md#initCap) | Converts the first letter of every word to uppercase. Words are identified as separated by whitespace.  |
| [instr](data-flow-expressions-usage.md#instr) | Finds the position (1 based) of the substring within a string. If not found, `0` is returned.  |
| [isDelete](data-flow-expressions-usage.md#isDelete) | Checks if the row is marked for delete. For transformations that take more than one input stream, you can pass the (1-based) index of the stream. The stream index should be either `1` or `2`, and the default value is `1`.  |
| [isError](data-flow-expressions-usage.md#isError) | Checks if the row is marked as error. For transformations that take more than one input stream, you can pass the (1-based) index of the stream. The stream index should be either `1` or `2`. The default value is `1`.  |
| [isIgnore](data-flow-expressions-usage.md#isIgnore) | Checks if the row should be ignored. For transformations that take more than one input stream, you can pass the (1-based) index of the stream. The stream index should be either `1` or `2`. The default value is `1`.  |
| [isInsert](data-flow-expressions-usage.md#isInsert) | Checks if the row is marked for insert. For transformations that take more than one input stream, you can pass the (1-based) index of the stream. The stream index should be either `1` or `2`. The default value is `1`.  |
| [isMatch](data-flow-expressions-usage.md#isMatch) | Checks if the row is matched at lookup. For transformations that take more than one input stream, you can pass the (1-based) index of the stream. The stream index should be either `1` or `2`. The default value is `1`.  |
| [isNull](data-flow-expressions-usage.md#isNull) | Checks if the value is `NULL`.  |
| [isUpdate](data-flow-expressions-usage.md#isUpdate) | Checks if the row is marked for update. For transformations that take more than one input stream, you can pass the (1-based) index of the stream. The stream index should be either `1` or `2`. The default value is `1`.  |
| [isUpsert](data-flow-expressions-usage.md#isUpsert) | Checks if the row is marked for insert. For transformations that take more than one input stream, you can pass the (1-based) index of the stream. The stream index should be either `1` or `2`. The default value is 1.  |
| [jaroWinkler](data-flow-expressions-usage.md#jaroWinkler) | Gets the JaroWinkler distance between two strings. |
| [least](data-flow-expressions-usage.md#least) | Uses the comparison lesser than or equal to operator. Same as the `<=` operator.  |
| [left](data-flow-expressions-usage.md#left) | Extracts a substring start at index `1` with the number of characters. Same as `SUBSTRING(str, 1, n)`.  |
| [length](data-flow-expressions-usage.md#length) | Returns the length of the string.  |
| [lesser](data-flow-expressions-usage.md#lesser) | Uses the comparison less operator. Same as the `<` operator.  |
| [lesserOrEqual](data-flow-expressions-usage.md#lesserOrEqual) | Uses the comparison lesser than or equal to operator. Same as the `<=` operator.  |
| [levenshtein](data-flow-expressions-usage.md#levenshtein) | Gets the levenshtein distance between two strings.  |
| [like](data-flow-expressions-usage.md#like) | Uses a pattern with a string that's matched literally. The exception is the special symbol  `_` that matches any one character in the input (similar to .* in ```posix``` regular expressions).|
| [locate](data-flow-expressions-usage.md#locate) | Finds the position (1 based) of the substring within a string that starts a certain position. If the position is omitted, start from the beginning of the string. If not found, `0` is returned.  |
| [log](data-flow-expressions-usage.md#log) | Calculates the log value. You can supply an optional base or else a Euler number if used.  |
| [log10](data-flow-expressions-usage.md#log10) | Calculates the log value based on a 10 base.  |
| [lower](data-flow-expressions-usage.md#lower) | Lowercases a string.  |
| [lpad](data-flow-expressions-usage.md#lpad) | Left pads the string by the supplied padding until it's of a certain length. If the string is equal to or greater than the length, the string is trimmed to the length.  |
| [ltrim](data-flow-expressions-usage.md#ltrim) | Left trims a string of leading characters. If the second parameter is unspecified, it trims whitespace. Otherwise, it trims any character specified in the second parameter.  |
| [md5](data-flow-expressions-usage.md#md5) | Calculates the MD5 digest of a set of columns of varying primitive data types and returns a 32-character hex string. You can use it to calculate a fingerprint for a row.  |
| [minus](data-flow-expressions-usage.md#minus) | Subtracts numbers. Subtracts the number of days from a date. Subtracts duration from a time stamp. Subtracts two time stamps to get the difference in milliseconds. Same as the `-` operator.  |
| [mod](data-flow-expressions-usage.md#mod) | Gives the modulus of a pair of numbers. Same as the `%` operator.  |
| [multiply](data-flow-expressions-usage.md#multiply) | Multiplies a pair of numbers. Same as the `*` operator.  |
| [negate](data-flow-expressions-usage.md#negate) | Negates a number. Turns positive numbers to negative and vice versa.  |
| [nextSequence](data-flow-expressions-usage.md#nextSequence) | Returns the next unique sequence. The number is consecutive only within a partition and is prefixed by the partition ID.  |
| [normalize](data-flow-expressions-usage.md#normalize) | Normalizes the string value to separate accented Unicode characters.  |
| [not](data-flow-expressions-usage.md#not) | Uses the logical negation operator.  |
| [notEquals](data-flow-expressions-usage.md#notEquals) | Uses the comparison not equals operator. Same as the `!=` operator.  |
| [null](data-flow-expressions-usage.md#null) | Returns a `NULL` value. Use the function `syntax(null())` if there's a column named `null`. Any operation that uses it results in a `NULL`.  |
| [or](data-flow-expressions-usage.md#or) | Uses the logical `OR` operator. Same as `||`.  |
| [pMod](data-flow-expressions-usage.md#pMod) | Gives the positive modulus of a pair of numbers.  |
| [partitionId](data-flow-expressions-usage.md#partitionId) | Returns the current partition ID that the input row is in.  |
| [power](data-flow-expressions-usage.md#power) | Raises one number to the power of another.  |
| [radians](data-flow-expressions-usage.md#radians) | Converts degrees to radians.|
| [random](data-flow-expressions-usage.md#random) | Returns a random number when given an optional seed within a partition. The seed should be a fixed value and is used with the partition ID to produce random values.  |
| [regexExtract](data-flow-expressions-usage.md#regexExtract) | Extracts a matching substring for a specific regex pattern. The last parameter identifies the match group and defaults to 1 if omitted. Use `` `<regex>` `` to match a string without escaping.  |
| [regexMatch](data-flow-expressions-usage.md#regexMatch) | Checks if the string matches the specific regex pattern. Use `` `<regex>` `` to match a string without escaping.  |
| [regexReplace](data-flow-expressions-usage.md#regexReplace) | Replaces all occurrences of a regex pattern with another substring in the specific string. Use `` `<regex>` `` to match a string without escaping.  |
| [regexSplit](data-flow-expressions-usage.md#regexSplit) | Splits a string based on a delimiter based on regex and returns an array of strings.  |
| [replace](data-flow-expressions-usage.md#replace) | Replaces all occurrences of a substring with another substring in the specific string. If the last parameter is omitted, it defaults to an empty string.  |
| [reverse](data-flow-expressions-usage.md#reverse) | Reverses a string.  |
| [right](data-flow-expressions-usage.md#right) | Extracts a substring with the number of characters from the right. Same as `SUBSTRING(str, LENGTH(str) - n, n)`.  |
| [rlike](data-flow-expressions-usage.md#rlike) | Checks if the string matches the specific regex pattern.  |
| [round](data-flow-expressions-usage.md#round) | Rounds a number when given an optional scale and an optional rounding mode. If the scale is omitted, it defaults to 0. If the mode is omitted, it defaults to `ROUND_HALF_UP(5)`. |
| [rpad](data-flow-expressions-usage.md#rpad) | Right pads the string by the supplied padding until it's of a certain length. If the string is equal to or greater than the length, the string is trimmed to the length.  |
| [rtrim](data-flow-expressions-usage.md#rtrim) | Right trims a string of trailing characters. If the second parameter is unspecified, it trims whitespace. Otherwise, it trims any character specified in the second parameter.  |
| [sha1](data-flow-expressions-usage.md#sha1) | Calculates the SHA-1 digest of a set of columns of varying primitive data types and returns a 40-character hex string. You can use it to calculate a fingerprint for a row.  |
| [sha2](data-flow-expressions-usage.md#sha2) | Calculates the SHA-2 digest of a set of columns of varying primitive data types when given a bit length, which can only be of values `0` (`256`), `224`, `256`, `384`, and `512`. You can use it to calculate a fingerprint for a row.  |
| [sin](data-flow-expressions-usage.md#sin) | Calculates a sine value.  |
| [sinh](data-flow-expressions-usage.md#sinh) | Calculates a hyperbolic sine value.  |
| [soundex](data-flow-expressions-usage.md#soundex) | Gets the ```soundex``` code for the string.  |
| [split](data-flow-expressions-usage.md#split) | Splits a string based on a delimiter and returns an array of strings.  |
| [sqrt](data-flow-expressions-usage.md#sqrt) | Calculates the square root of a number.  |
| [startsWith](data-flow-expressions-usage.md#startsWith) | Checks if the string starts with the supplied string.  |
| [substring](data-flow-expressions-usage.md#substring) | Extracts a substring of a certain length from a position. Position is 1 based. If the length is omitted, it defaults to the end of the string.  |
| [substringIndex](data-flow-expressions-usage.md#substringIndex) | Extracts the substring before `count` occurrences of the delimiter. If `count` is positive, everything to the left of the final delimiter (counting from the left) is returned. If `count` is negative, everything to the right of the final delimiter (counting from the right) is returned.  |
| [tan](data-flow-expressions-usage.md#tan) | Calculates a tangent value.  |
| [tanh](data-flow-expressions-usage.md#tanh) | Calculates a hyperbolic tangent value.  |
| [translate](data-flow-expressions-usage.md#translate) | Replaces one set of characters by another set of characters in the string. Characters have one-to-one replacement.  |
| [trim](data-flow-expressions-usage.md#trim) | Trims a string of leading and trailing characters. If the second parameter is unspecified, it trims whitespace. Otherwise, it trims any character specified in the second parameter.  |
| [true](data-flow-expressions-usage.md#true) | Always returns a true value. Use the function `syntax(true())` if a column is named `true`.  |
| [typeMatch](data-flow-expressions-usage.md#typeMatch) | Matches the type of the column. Used in pattern expressions only. Number matches short, integer, long, double, float, or decimal. Integral matches short, integer,  and long. Fractional matches double, float,  and decimal. Datetime matches the date or time stamp type. |
| [unescape](data-flow-expressions-usage.md#unescape) | Unescapes a string according to a format. Literal values for acceptable format are `json`, `xml`, `ecmascript`, `html`, and `java`.|
| [upper](data-flow-expressions-usage.md#upper) | Uppercases a string.  |
| [uuid](data-flow-expressions-usage.md#uuid) | Returns the generated UUID.  |
| [xor](data-flow-expressions-usage.md#xor) | Gives the logical `XOR` operator. Same as the `^` operator.  |
|||

## Related content

- List of all [aggregate functions](data-flow-aggregate-functions.md).
- List of all [array functions](data-flow-array-functions.md).
- List of all [cached lookup functions](data-flow-cached-lookup-functions.md).
- List of all [conversion functions](data-flow-conversion-functions.md).
- List of all [date and time functions](data-flow-date-time-functions.md).
- List of all [map functions](data-flow-map-functions.md).
- List of all [metafunctions](data-flow-metafunctions.md).
- List of all [window functions](data-flow-window-functions.md).
- Usage details of all [data transformation expressions](data-flow-expressions-usage.md).
- Learn how to use [Expression Builder](concepts-data-flow-expression-builder.md).
