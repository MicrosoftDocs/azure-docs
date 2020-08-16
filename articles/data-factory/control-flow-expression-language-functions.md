---
title: Expression and functions in Azure Data Factory 
description: This article provides information about expressions and functions that you can use in creating data factory entities.
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
ms.reviewer: maghan
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 11/25/2019
---

# Expressions and functions in Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-functions-variables.md)
> * [Current version](control-flow-expression-language-functions.md)
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides details about expressions and functions supported by Azure Data Factory. 

## Expressions

JSON values in the definition can be literal or expressions that are evaluated at runtime. For example:  
  
```json
"name": "value"
```

 or  
  
```json
"name": "@pipeline().parameters.password"
```

Expressions can appear anywhere in a JSON string value and always result in another JSON value. If a JSON value is an expression, the body of the expression is extracted by removing the at-sign (\@). If a literal string is needed that starts with \@, it must be escaped by using \@\@. The following examples show how expressions are evaluated.  
  
|JSON value|Result|  
|----------------|------------|  
|"parameters"|The characters 'parameters' are returned.|  
|"parameters[1]"|The characters 'parameters[1]' are returned.|  
|"\@\@"|A 1 character string that contains '\@' is returned.|  
|" \@"|A 2 character string that contains ' \@' is returned.|  
  
 Expressions can also appear inside strings, using a feature called *string interpolation* where expressions are wrapped in `@{ ... }`. For example: `"name" : "First Name: @{pipeline().parameters.firstName} Last Name: @{pipeline().parameters.lastName}"`  
  
 Using string interpolation, the result is always a string. Say I have defined `myNumber` as `42` and  `myString` as  `foo`:  
  
|JSON value|Result|  
|----------------|------------|  
|"\@pipeline().parameters.myString"| Returns `foo` as a string.|  
|"\@{pipeline().parameters.myString}"| Returns `foo` as a string.|  
|"\@pipeline().parameters.myNumber"| Returns `42` as a *number*.|  
|"\@{pipeline().parameters.myNumber}"| Returns `42` as a *string*.|  
|"Answer is: @{pipeline().parameters.myNumber}"| Returns the string `Answer is: 42`.|  
|"\@concat('Answer is: ', string(pipeline().parameters.myNumber))"| Returns the string `Answer is: 42`|  
|"Answer is: \@\@{pipeline().parameters.myNumber}"| Returns the string `Answer is: @{pipeline().parameters.myNumber}`.|  
  
## Examples

### Complex expression example
The below example shows a complex example that references a deep sub-field of activity output. To reference a pipeline parameter that evaluates to a sub-field, use [] syntax instead of dot(.) operator (as in case of subfield1 and subfield2)

@activity('{activityName}').output.{subfield1}.{subfield2}[pipeline().parameters.subfield3].{subfield4}

### A dataset with a parameter
In the following example, the BlobDataset takes a parameter named **path**. Its value is used to set a value for the **folderPath** property by using the expression: `dataset().path`. 

```json
{
    "name": "BlobDataset",
    "properties": {
        "type": "AzureBlob",
        "typeProperties": {
            "folderPath": "@dataset().path"
        },
        "linkedServiceName": {
            "referenceName": "AzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "parameters": {
            "path": {
                "type": "String"
            }
        }
    }
}
```

### A pipeline with a parameter
In the following example, the pipeline takes **inputPath** and **outputPath** parameters. The **path** for the parameterized blob dataset is set by using values of these parameters. The syntax used here is: `pipeline().parameters.parametername`. 

```json
{
    "name": "Adfv2QuickStartPipeline",
    "properties": {
        "activities": [
            {
                "name": "CopyFromBlobToBlob",
                "type": "Copy",
                "inputs": [
                    {
                        "referenceName": "BlobDataset",
                        "parameters": {
                            "path": "@pipeline().parameters.inputPath"
                        },
                        "type": "DatasetReference"
                    }
                ],
                "outputs": [
                    {
                        "referenceName": "BlobDataset",
                        "parameters": {
                            "path": "@pipeline().parameters.outputPath"
                        },
                        "type": "DatasetReference"
                    }
                ],
                "typeProperties": {
                    "source": {
                        "type": "BlobSource"
                    },
                    "sink": {
                        "type": "BlobSink"
                    }
                }
            }
        ],
        "parameters": {
            "inputPath": {
                "type": "String"
            },
            "outputPath": {
                "type": "String"
            }
        }
    }
}
```
### Tutorial
This [tutorial](https://azure.microsoft.com/mediahandler/files/resourcefiles/azure-data-factory-passing-parameters/Azure%20data%20Factory-Whitepaper-PassingParameters.pdf) walks you through how to pass parameters between a pipeline and activity as well as between the activities.

  
## Functions

You can call functions within expressions. The following sections provide information about the functions that can be used in an expression.  

## String functions  

To work with strings, you can use these string functions
and also some [collection functions](#collection-functions).
String functions work only on strings.

| String function | Task |
| --------------- | ---- |
| [concat](control-flow-expression-language-functions.md#concat) | Combine two or more strings, and return the combined string. |
| [endsWith](control-flow-expression-language-functions.md#endswith) | Check whether a string ends with the specified substring. |
| [guid](control-flow-expression-language-functions.md#guid) | Generate a globally unique identifier (GUID) as a string. |
| [indexOf](control-flow-expression-language-functions.md#indexof) | Return the starting position for a substring. |
| [lastIndexOf](control-flow-expression-language-functions.md#lastindexof) | Return the starting position for the last occurrence of a substring. |
| [replace](control-flow-expression-language-functions.md#replace) | Replace a substring with the specified string, and return the updated string. |
| [split](control-flow-expression-language-functions.md#split) | Return an array that contains substrings, separated by commas, from a larger string based on a specified delimiter character in the original string. |
| [startsWith](control-flow-expression-language-functions.md#startswith) | Check whether a string starts with a specific substring. |
| [substring](control-flow-expression-language-functions.md#substring) | Return characters from a string, starting from the specified position. |
| [toLower](control-flow-expression-language-functions.md#toLower) | Return a string in lowercase format. |
| [toUpper](control-flow-expression-language-functions.md#toUpper) | Return a string in uppercase format. |
| [trim](control-flow-expression-language-functions.md#trim) | Remove leading and trailing whitespace from a string, and return the updated string. |

## Collection functions

To work with collections, generally arrays, strings,
and sometimes, dictionaries, you can use these collection functions.

| Collection function | Task |
| ------------------- | ---- |
| [contains](control-flow-expression-language-functions.md#contains) | Check whether a collection has a specific item. |
| [empty](control-flow-expression-language-functions.md#empty) | Check whether a collection is empty. |
| [first](control-flow-expression-language-functions.md#first) | Return the first item from a collection. |
| [intersection](control-flow-expression-language-functions.md#intersection) | Return a collection that has *only* the common items across the specified collections. |
| [join](control-flow-expression-language-functions.md#join) | Return a string that has *all* the items from an array, separated by the specified character. |
| [last](control-flow-expression-language-functions.md#last) | Return the last item from a collection. |
| [length](control-flow-expression-language-functions.md#length) | Return the number of items in a string or array. |
| [skip](control-flow-expression-language-functions.md#skip) | Remove items from the front of a collection, and return *all the other* items. |
| [take](control-flow-expression-language-functions.md#take) | Return items from the front of a collection. |
| [union](control-flow-expression-language-functions.md#union) | Return a collection that has *all* the items from the specified collections. | 

## Logical functions  

These functions are useful inside conditions, they can be used to evaluate any type of logic.  
  
| Logical comparison function | Task |
| --------------------------- | ---- |
| [and](control-flow-expression-language-functions.md#and) | Check whether all expressions are true. |
| [equals](control-flow-expression-language-functions.md#equals) | Check whether both values are equivalent. |
| [greater](control-flow-expression-language-functions.md#greater) | Check whether the first value is greater than the second value. |
| [greaterOrEquals](control-flow-expression-language-functions.md#greaterOrEquals) | Check whether the first value is greater than or equal to the second value. |
| [if](control-flow-expression-language-functions.md#if) | Check whether an expression is true or false. Based on the result, return a specified value. |
| [less](control-flow-expression-language-functions.md#less) | Check whether the first value is less than the second value. |
| [lessOrEquals](control-flow-expression-language-functions.md#lessOrEquals) | Check whether the first value is less than or equal to the second value. |
| [not](control-flow-expression-language-functions.md#not) | Check whether an expression is false. |
| [or](control-flow-expression-language-functions.md#or) | Check whether at least one expression is true. |
  
## Conversion functions  

 These functions are used to convert between each of the native types in the language:  
-   string
-   integer
-   float
-   boolean
-   arrays
-   dictionaries

| Conversion function | Task |
| ------------------- | ---- |
| [array](control-flow-expression-language-functions.md#array) | Return an array from a single specified input. For multiple inputs, see [createArray](control-flow-expression-language-functions.md#createArray). |
| [base64](control-flow-expression-language-functions.md#base64) | Return the base64-encoded version for a string. |
| [base64ToBinary](control-flow-expression-language-functions.md#base64ToBinary) | Return the binary version for a base64-encoded string. |
| [base64ToString](control-flow-expression-language-functions.md#base64ToString) | Return the string version for a base64-encoded string. |
| [binary](control-flow-expression-language-functions.md#binary) | Return the binary version for an input value. |
| [bool](control-flow-expression-language-functions.md#bool) | Return the Boolean version for an input value. |
| [coalesce](control-flow-expression-language-functions.md#coalesce) | Return the first non-null value from one or more parameters. |
| [createArray](control-flow-expression-language-functions.md#createArray) | Return an array from multiple inputs. |
| [dataUri](control-flow-expression-language-functions.md#dataUri) | Return the data URI for an input value. |
| [dataUriToBinary](control-flow-expression-language-functions.md#dataUriToBinary) | Return the binary version for a data URI. |
| [dataUriToString](control-flow-expression-language-functions.md#dataUriToString) | Return the string version for a data URI. |
| [decodeBase64](control-flow-expression-language-functions.md#decodeBase64) | Return the string version for a base64-encoded string. |
| [decodeDataUri](control-flow-expression-language-functions.md#decodeDataUri) | Return the binary version for a data URI. |
| [decodeUriComponent](control-flow-expression-language-functions.md#decodeUriComponent) | Return a string that replaces escape characters with decoded versions. |
| [encodeUriComponent](control-flow-expression-language-functions.md#encodeUriComponent) | Return a string that replaces URL-unsafe characters with escape characters. |
| [float](control-flow-expression-language-functions.md#float) | Return a floating point number for an input value. |
| [int](control-flow-expression-language-functions.md#int) | Return the integer version for a string. |
| [json](control-flow-expression-language-functions.md#json) | Return the JavaScript Object Notation (JSON) type value or object for a string or XML. |
| [string](control-flow-expression-language-functions.md#string) | Return the string version for an input value. |
| [uriComponent](control-flow-expression-language-functions.md#uriComponent) | Return the URI-encoded version for an input value by replacing URL-unsafe characters with escape characters. |
| [uriComponentToBinary](control-flow-expression-language-functions.md#uriComponentToBinary) | Return the binary version for a URI-encoded string. |
| [uriComponentToString](control-flow-expression-language-functions.md#uriComponentToString) | Return the string version for a URI-encoded string. |
| [xml](control-flow-expression-language-functions.md#xml) | Return the XML version for a string. |
| [xpath](control-flow-expression-language-functions.md#xpath) | Check XML for nodes or values that match an XPath (XML Path Language) expression, and return the matching nodes or values. |

## Math functions  
 These functions can be used for either types of numbers: **integers** and **floats**.  

| Math function | Task |
| ------------- | ---- |
| [add](control-flow-expression-language-functions.md#add) | Return the result from adding two numbers. |
| [div](control-flow-expression-language-functions.md#div) | Return the result from dividing two numbers. |
| [max](control-flow-expression-language-functions.md#max) | Return the highest value from a set of numbers or an array. |
| [min](control-flow-expression-language-functions.md#min) | Return the lowest value from a set of numbers or an array. |
| [mod](control-flow-expression-language-functions.md#mod) | Return the remainder from dividing two numbers. |
| [mul](control-flow-expression-language-functions.md#mul) | Return the product from multiplying two numbers. |
| [rand](control-flow-expression-language-functions.md#rand) | Return a random integer from a specified range. |
| [range](control-flow-expression-language-functions.md#range) | Return an integer array that starts from a specified integer. |
| [sub](control-flow-expression-language-functions.md#sub) | Return the result from subtracting the second number from the first number. |
  
## Date functions  

| Date or time function | Task |
| --------------------- | ---- |
| [addDays](control-flow-expression-language-functions.md#addDays) | Add a number of days to a timestamp. |
| [addHours](control-flow-expression-language-functions.md#addHours) | Add a number of hours to a timestamp. |
| [addMinutes](control-flow-expression-language-functions.md#addMinutes) | Add a number of minutes to a timestamp. |
| [addSeconds](control-flow-expression-language-functions.md#addSeconds) | Add a number of seconds to a timestamp. |
| [addToTime](control-flow-expression-language-functions.md#addToTime) | Add a number of time units to a timestamp. See also [getFutureTime](control-flow-expression-language-functions.md#getFutureTime). |
| [convertFromUtc](control-flow-expression-language-functions.md#convertFromUtc) | Convert a timestamp from Universal Time Coordinated (UTC) to the target time zone. |
| [convertTimeZone](control-flow-expression-language-functions.md#convertTimeZone) | Convert a timestamp from the source time zone to the target time zone. |
| [convertToUtc](control-flow-expression-language-functions.md#convertToUtc) | Convert a timestamp from the source time zone to Universal Time Coordinated (UTC). |
| [dayOfMonth](control-flow-expression-language-functions.md#dayOfMonth) | Return the day of the month component from a timestamp. |
| [dayOfWeek](control-flow-expression-language-functions.md#dayOfWeek) | Return the day of the week component from a timestamp. |
| [dayOfYear](control-flow-expression-language-functions.md#dayOfYear) | Return the day of the year component from a timestamp. |
| [formatDateTime](control-flow-expression-language-functions.md#formatDateTime) | Return the timestamp as a string in optional format. |
| [getFutureTime](control-flow-expression-language-functions.md#getFutureTime) | Return the current timestamp plus the specified time units. See also [addToTime](control-flow-expression-language-functions.md#addToTime). |
| [getPastTime](control-flow-expression-language-functions.md#getPastTime) | Return the current timestamp minus the specified time units. See also [subtractFromTime](control-flow-expression-language-functions.md#subtractFromTime). |
| [startOfDay](control-flow-expression-language-functions.md#startOfDay) | Return the start of the day for a timestamp. |
| [startOfHour](control-flow-expression-language-functions.md#startOfHour) | Return the start of the hour for a timestamp. |
| [startOfMonth](control-flow-expression-language-functions.md#startOfMonth) | Return the start of the month for a timestamp. |
| [subtractFromTime](control-flow-expression-language-functions.md#subtractFromTime) | Subtract a number of time units from a timestamp. See also [getPastTime](control-flow-expression-language-functions.md#getPastTime). |
| [ticks](control-flow-expression-language-functions.md#ticks) | Return the `ticks` property value for a specified timestamp. |
| [utcNow](control-flow-expression-language-functions.md#utcNow) | Return the current timestamp as a string. |

## Function reference

This section lists all the available functions in alphabetical order.

<a name="add"></a>

### add

Return the result from adding two numbers.

```
add(<summand_1>, <summand_2>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*summand_1*>, <*summand_2*> | Yes | Integer, Float, or mixed | The numbers to add |
|||||

| Return value | Type | Description |
| ------------ | -----| ----------- |
| <*result-sum*> | Integer or Float | The result from adding the specified numbers |
||||

*Example*

This example adds the specified numbers:

```
add(1, 1.5)
```

And returns this result: `2.5`

<a name="addDays"></a>

### addDays

Add a number of days to a timestamp.

```
addDays('<timestamp>', <days>, '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*days*> | Yes | Integer | The positive or negative number of days to add |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The timestamp plus the specified number of days  |
||||

*Example 1*

This example adds 10 days to the specified timestamp:

```
addDays('2018-03-15T13:00:00Z', 10)
```

And returns this result: `"2018-03-25T00:00:0000000Z"`

*Example 2*

This example subtracts five days from the specified timestamp:

```
addDays('2018-03-15T00:00:00Z', -5)
```

And returns this result: `"2018-03-10T00:00:0000000Z"`

<a name="addHours"></a>

### addHours

Add a number of hours to a timestamp.

```
addHours('<timestamp>', <hours>, '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*hours*> | Yes | Integer | The positive or negative number of hours to add |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The timestamp plus the specified number of hours  |
||||

*Example 1*

This example adds 10 hours to the specified timestamp:

```
addHours('2018-03-15T00:00:00Z', 10)
```

And returns this result: `"2018-03-15T10:00:0000000Z"`

*Example 2*

This example subtracts five hours from the specified timestamp:

```
addHours('2018-03-15T15:00:00Z', -5)
```

And returns this result: `"2018-03-15T10:00:0000000Z"`

<a name="addMinutes"></a>

### addMinutes

Add a number of minutes to a timestamp.

```
addMinutes('<timestamp>', <minutes>, '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*minutes*> | Yes | Integer | The positive or negative number of minutes to add |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The timestamp plus the specified number of minutes |
||||

*Example 1*

This example adds 10 minutes to the specified timestamp:

```
addMinutes('2018-03-15T00:10:00Z', 10)
```

And returns this result: `"2018-03-15T00:20:00.0000000Z"`

*Example 2*

This example subtracts five minutes from the specified timestamp:

```
addMinutes('2018-03-15T00:20:00Z', -5)
```

And returns this result: `"2018-03-15T00:15:00.0000000Z"`

<a name="addSeconds"></a>

### addSeconds

Add a number of seconds to a timestamp.

```
addSeconds('<timestamp>', <seconds>, '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*seconds*> | Yes | Integer | The positive or negative number of seconds to add |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The timestamp plus the specified number of seconds  |
||||

*Example 1*

This example adds 10 seconds to the specified timestamp:

```
addSeconds('2018-03-15T00:00:00Z', 10)
```

And returns this result: `"2018-03-15T00:00:10.0000000Z"`

*Example 2*

This example subtracts five seconds to the specified timestamp:

```
addSeconds('2018-03-15T00:00:30Z', -5)
```

And returns this result: `"2018-03-15T00:00:25.0000000Z"`

<a name="addToTime"></a>

### addToTime

Add a number of time units to a timestamp.
See also [getFutureTime()](#getFutureTime).

```
addToTime('<timestamp>', <interval>, '<timeUnit>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*interval*> | Yes | Integer | The number of specified time units to add |
| <*timeUnit*> | Yes | String | The unit of time to use with *interval*: "Second", "Minute", "Hour", "Day", "Week", "Month", "Year" |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The timestamp plus the specified number of time units  |
||||

*Example 1*

This example adds one day to the specified timestamp:

```
addToTime('2018-01-01T00:00:00Z', 1, 'Day')
```

And returns this result: `"2018-01-02T00:00:00.0000000Z"`

*Example 2*

This example adds one day to the specified timestamp:

```
addToTime('2018-01-01T00:00:00Z', 1, 'Day', 'D')
```

And returns the result using the optional "D" format: `"Tuesday, January 2, 2018"`

<a name="and"></a>

### and

Check whether both expressions are true.
Return true when both expressions are true,
or return false when at least one expression is false.

```
and(<expression1>, <expression2>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*expression1*>, <*expression2*> | Yes | Boolean | The expressions to check |
|||||

| Return value | Type | Description |
| ------------ | -----| ----------- |
| true or false | Boolean | Return true when both expressions are true. Return false when at least one expression is false. |
||||

*Example 1*

These examples check whether the specified Boolean values are both true:

```
and(true, true)
and(false, true)
and(false, false)
```

And returns these results:

* First example: Both expressions are true, so returns `true`.
* Second example: One expression is false, so returns `false`.
* Third example: Both expressions are false, so returns `false`.

*Example 2*

These examples check whether the specified expressions are both true:

```
and(equals(1, 1), equals(2, 2))
and(equals(1, 1), equals(1, 2))
and(equals(1, 2), equals(1, 3))
```

And returns these results:

* First example: Both expressions are true, so returns `true`.
* Second example: One expression is false, so returns `false`.
* Third example: Both expressions are false, so returns `false`.

<a name="array"></a>

### array

Return an array from a single specified input.
For multiple inputs, see [createArray()](#createArray).

```
array('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string for creating an array |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| [<*value*>] | Array | An array that contains the single specified input |
||||

*Example*

This example creates an array from the "hello" string:

```
array('hello')
```

And returns this result: `["hello"]`

<a name="base64"></a>

### base64

Return the base64-encoded version for a string.

```
base64('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The input string |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*base64-string*> | String | The base64-encoded version for the input string |
||||

*Example*

This example converts the "hello" string to a base64-encoded string:

```
base64('hello')
```

And returns this result: `"aGVsbG8="`

<a name="base64ToBinary"></a>

### base64ToBinary

Return the binary version for a base64-encoded string.

```
base64ToBinary('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The base64-encoded string to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*binary-for-base64-string*> | String | The binary version for the base64-encoded string |
||||

*Example*

This example converts the "aGVsbG8=" base64-encoded string to a binary string:

```
base64ToBinary('aGVsbG8=')
```

And returns this result:

`"0110000101000111010101100111001101100010010001110011100000111101"`

<a name="base64ToString"></a>

### base64ToString

Return the string version for a base64-encoded string,
effectively decoding the base64 string.
Use this function rather than [decodeBase64()](#decodeBase64).
Although both functions work the same way,
`base64ToString()` is preferred.

```
base64ToString('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The base64-encoded string to decode |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*decoded-base64-string*> | String | The string version for a base64-encoded string |
||||

*Example*

This example converts the "aGVsbG8=" base64-encoded string to just a string:

```
base64ToString('aGVsbG8=')
```

And returns this result: `"hello"`

<a name="binary"></a>

### binary

Return the binary version for a string.

```
binary('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*binary-for-input-value*> | String | The binary version for the specified string |
||||

*Example*

This example converts the "hello" string to a binary string:

```
binary('hello')
```

And returns this result:

`"0110100001100101011011000110110001101111"`

<a name="bool"></a>

### bool

Return the Boolean version for a value.

```
bool(<value>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | Any | The value to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false | Boolean | The Boolean version for the specified value |
||||

*Example*

These examples convert the specified values to Boolean values:

```
bool(1)
bool(0)
```

And returns these results:

* First example: `true`
* Second example: `false`

<a name="coalesce"></a>

### coalesce

Return the first non-null value from one or more parameters.
Empty strings, empty arrays, and empty objects are not null.

```
coalesce(<object_1>, <object_2>, ...)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*object_1*>, <*object_2*>, ... | Yes | Any, can mix types | One or more items to check for null |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*first-non-null-item*> | Any | The first item or value that is not null. If all parameters are null, this function returns null. |
||||

*Example*

These examples return the first non-null value from the specified values,
or null when all the values are null:

```
coalesce(null, true, false)
coalesce(null, 'hello', 'world')
coalesce(null, null, null)
```

And returns these results:

* First example: `true`
* Second example: `"hello"`
* Third example: `null`

<a name="concat"></a>

### concat

Combine two or more strings, and return the combined string.

```
concat('<text1>', '<text2>', ...)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text1*>, <*text2*>, ... | Yes | String | At least two strings to combine |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*text1text2...*> | String | The string created from the combined input strings |
||||

*Example*

This example combines the strings "Hello" and "World":

```
concat('Hello', 'World')
```

And returns this result: `"HelloWorld"`

<a name="contains"></a>

### contains

Check whether a collection has a specific item.
Return true when the item is found,
or return false when not found.
This function is case-sensitive.

```
contains('<collection>', '<value>')
contains([<collection>], '<value>')
```

Specifically, this function works on these collection types:

* A *string* to find a *substring*
* An *array* to find a *value*
* A *dictionary* to find a *key*

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | String, Array, or Dictionary | The collection to check |
| <*value*> | Yes | String, Array, or Dictionary, respectively | The item to find |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false | Boolean | Return true when the item is found. Return false when not found. |
||||

*Example 1*

This example checks the string "hello world" for
the substring "world" and returns true:

```
contains('hello world', 'world')
```

*Example 2*

This example checks the string "hello world" for
the substring "universe" and returns false:

```
contains('hello world', 'universe')
```

<a name="convertFromUtc"></a>

### convertFromUtc

Convert a timestamp from Universal Time Coordinated (UTC) to the target time zone.

```
convertFromUtc('<timestamp>', '<destinationTimeZone>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*destinationTimeZone*> | Yes | String | The name for the target time zone. For time zone names, see [Microsoft Time Zone Index Values](https://support.microsoft.com/help/973627/microsoft-time-zone-index-values), but you might have to remove any punctuation from the time zone name. |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*converted-timestamp*> | String | The timestamp converted to the target time zone |
||||

*Example 1*

This example converts a timestamp to the specified time zone:

```
convertFromUtc('2018-01-01T08:00:00.0000000Z', 'Pacific Standard Time')
```

And returns this result: `"2018-01-01T00:00:00Z"`

*Example 2*

This example converts a timestamp to the specified time zone and format:

```
convertFromUtc('2018-01-01T08:00:00.0000000Z', 'Pacific Standard Time', 'D')
```

And returns this result: `"Monday, January 1, 2018"`

<a name="convertTimeZone"></a>

### convertTimeZone

Convert a timestamp from the source time zone to the target time zone.

```
convertTimeZone('<timestamp>', '<sourceTimeZone>', '<destinationTimeZone>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*sourceTimeZone*> | Yes | String | The name for the source time zone. For time zone names, see [Microsoft Time Zone Index Values](https://support.microsoft.com/help/973627/microsoft-time-zone-index-values), but you might have to remove any punctuation from the time zone name. |
| <*destinationTimeZone*> | Yes | String | The name for the target time zone. For time zone names, see [Microsoft Time Zone Index Values](https://support.microsoft.com/help/973627/microsoft-time-zone-index-values), but you might have to remove any punctuation from the time zone name. |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*converted-timestamp*> | String | The timestamp converted to the target time zone |
||||

*Example 1*

This example converts the source time zone to the target time zone:

```
convertTimeZone('2018-01-01T08:00:00.0000000Z', 'UTC', 'Pacific Standard Time')
```

And returns this result: `"2018-01-01T00:00:00.0000000"`

*Example 2*

This example converts a time zone to the specified time zone and format:

```
convertTimeZone('2018-01-01T80:00:00.0000000Z', 'UTC', 'Pacific Standard Time', 'D')
```

And returns this result: `"Monday, January 1, 2018"`

<a name="convertToUtc"></a>

### convertToUtc

Convert a timestamp from the source time zone to Universal Time Coordinated (UTC).

```
convertToUtc('<timestamp>', '<sourceTimeZone>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*sourceTimeZone*> | Yes | String | The name for the source time zone. For time zone names, see [Microsoft Time Zone Index Values](https://support.microsoft.com/help/973627/microsoft-time-zone-index-values), but you might have to remove any punctuation from the time zone name. |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*converted-timestamp*> | String | The timestamp converted to UTC |
||||

*Example 1*

This example converts a timestamp to UTC:

```
convertToUtc('01/01/2018 00:00:00', 'Pacific Standard Time')
```

And returns this result: `"2018-01-01T08:00:00.0000000Z"`

*Example 2*

This example converts a timestamp to UTC:

```
convertToUtc('01/01/2018 00:00:00', 'Pacific Standard Time', 'D')
```

And returns this result: `"Monday, January 1, 2018"`

<a name="createArray"></a>

### createArray

Return an array from multiple inputs.
For single input arrays, see [array()](#array).

```
createArray('<object1>', '<object2>', ...)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*object1*>, <*object2*>, ... | Yes | Any, but not mixed | At least two items to create the array |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| [<*object1*>, <*object2*>, ...] | Array | The array created from all the input items |
||||

*Example*

This example creates an array from these inputs:

```
createArray('h', 'e', 'l', 'l', 'o')
```

And returns this result: `["h", "e", "l", "l", "o"]`

<a name="dataUri"></a>

### dataUri

Return a data uniform resource identifier (URI) for a string.

```
dataUri('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*data-uri*> | String | The data URI for the input string |
||||

*Example*

This example creates a data URI for the "hello" string:

```
dataUri('hello')
```

And returns this result: `"data:text/plain;charset=utf-8;base64,aGVsbG8="`

<a name="dataUriToBinary"></a>

### dataUriToBinary

Return the binary version for a data uniform resource identifier (URI).
Use this function rather than [decodeDataUri()](#decodeDataUri).
Although both functions work the same way,
`dataUriBinary()` is preferred.

```
dataUriToBinary('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The data URI to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*binary-for-data-uri*> | String | The binary version for the data URI |
||||

*Example*

This example creates a binary version for this data URI:

```
dataUriToBinary('data:text/plain;charset=utf-8;base64,aGVsbG8=')
```

And returns this result:

`"01100100011000010111010001100001001110100111010001100101011110000111010000101111011100000
1101100011000010110100101101110001110110110001101101000011000010111001001110011011001010111
0100001111010111010101110100011001100010110100111000001110110110001001100001011100110110010
10011011000110100001011000110000101000111010101100111001101100010010001110011100000111101"`

<a name="dataUriToString"></a>

### dataUriToString

Return the string version for a data uniform resource identifier (URI).

```
dataUriToString('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The data URI to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*string-for-data-uri*> | String | The string version for the data URI |
||||

*Example*

This example creates a string for this data URI:

```
dataUriToString('data:text/plain;charset=utf-8;base64,aGVsbG8=')
```

And returns this result: `"hello"`

<a name="dayOfMonth"></a>

### dayOfMonth

Return the day of the month from a timestamp.

```
dayOfMonth('<timestamp>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*day-of-month*> | Integer | The day of the month from the specified timestamp |
||||

*Example*

This example returns the number for the day
of the month from this timestamp:

```
dayOfMonth('2018-03-15T13:27:36Z')
```

And returns this result: `15`

<a name="dayOfWeek"></a>

### dayOfWeek

Return the day of the week from a timestamp.

```
dayOfWeek('<timestamp>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*day-of-week*> | Integer | The day of the week from the specified timestamp where Sunday is 0, Monday is 1, and so on |
||||

*Example*

This example returns the number for the day of the week from this timestamp:

```
dayOfWeek('2018-03-15T13:27:36Z')
```

And returns this result: `3`

<a name="dayOfYear"></a>

### dayOfYear

Return the day of the year from a timestamp.

```
dayOfYear('<timestamp>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*day-of-year*> | Integer | The day of the year from the specified timestamp |
||||

*Example*

This example returns the number of the day of the year from this timestamp:

```
dayOfYear('2018-03-15T13:27:36Z')
```

And returns this result: `74`

<a name="decodeBase64"></a>

### decodeBase64

Return the string version for a base64-encoded string,
effectively decoding the base64 string.
Consider using [base64ToString()](#base64ToString)
rather than `decodeBase64()`.
Although both functions work the same way,
`base64ToString()` is preferred.

```
decodeBase64('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The base64-encoded string to decode |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*decoded-base64-string*> | String | The string version for a base64-encoded string |
||||

*Example*

This example creates a string for a base64-encoded string:

```
decodeBase64('aGVsbG8=')
```

And returns this result: `"hello"`

<a name="decodeDataUri"></a>

### decodeDataUri

Return the binary version for a data uniform resource identifier (URI).
Consider using [dataUriToBinary()](#dataUriToBinary),
rather than `decodeDataUri()`.
Although both functions work the same way,
`dataUriToBinary()` is preferred.

```
decodeDataUri('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The data URI string to decode |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*binary-for-data-uri*> | String | The binary version for a data URI string |
||||

*Example*

This example returns the binary version for this data URI:

```
decodeDataUri('data:text/plain;charset=utf-8;base64,aGVsbG8=')
```

And returns this result:

`"01100100011000010111010001100001001110100111010001100101011110000111010000101111011100000
1101100011000010110100101101110001110110110001101101000011000010111001001110011011001010111
0100001111010111010101110100011001100010110100111000001110110110001001100001011100110110010
10011011000110100001011000110000101000111010101100111001101100010010001110011100000111101"`

<a name="decodeUriComponent"></a>

### decodeUriComponent

Return a string that replaces escape characters with decoded versions.

```
decodeUriComponent('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string with the escape characters to decode |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*decoded-uri*> | String | The updated string with the decoded escape characters |
||||

*Example*

This example replaces the escape characters in this string with decoded versions:

```
decodeUriComponent('http%3A%2F%2Fcontoso.com')
```

And returns this result: `"https://contoso.com"`

<a name="div"></a>

### div

Return the integer result from dividing two numbers.
To get the remainder result, see [mod()](#mod).

```
div(<dividend>, <divisor>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*dividend*> | Yes | Integer or Float | The number to divide by the *divisor* |
| <*divisor*> | Yes | Integer or Float | The number that divides the *dividend*, but cannot be 0 |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*quotient-result*> | Integer | The integer result from dividing the first number by the second number |
||||

*Example*

Both examples divide the first number by the second number:

```
div(10, 5)
div(11, 5)
```

And return this result: `2`

<a name="encodeUriComponent"></a>

### encodeUriComponent

Return a uniform resource identifier (URI) encoded version for a
string by replacing URL-unsafe characters with escape characters.
Consider using [uriComponent()](#uriComponent),
rather than `encodeUriComponent()`.
Although both functions work the same way,
`uriComponent()` is preferred.

```
encodeUriComponent('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string to convert to URI-encoded format |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*encoded-uri*> | String | The URI-encoded string with escape characters |
||||

*Example*

This example creates a URI-encoded version for this string:

```
encodeUriComponent('https://contoso.com')
```

And returns this result: `"http%3A%2F%2Fcontoso.com"`

<a name="empty"></a>

### empty

Check whether a collection is empty.
Return true when the collection is empty,
or return false when not empty.

```
empty('<collection>')
empty([<collection>])
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | String, Array, or Object | The collection to check |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false | Boolean | Return true when the collection is empty. Return false when not empty. |
||||

*Example*

These examples check whether the specified collections are empty:

```
empty('')
empty('abc')
```

And returns these results:

* First example: Passes an empty string, so the function returns `true`.
* Second example: Passes the string "abc", so the function returns `false`.

<a name="endswith"></a>

### endsWith

Check whether a string ends with a specific substring.
Return true when the substring is found, or return false when not found.
This function is not case-sensitive.

```
endsWith('<text>', '<searchText>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string to check |
| <*searchText*> | Yes | String | The ending substring to find |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false  | Boolean | Return true when the ending substring is found. Return false when not found. |
||||

*Example 1*

This example checks whether the "hello world"
string ends with the "world" string:

```
endsWith('hello world', 'world')
```

And returns this result: `true`

*Example 2*

This example checks whether the "hello world"
string ends with the "universe" string:

```
endsWith('hello world', 'universe')
```

And returns this result: `false`

<a name="equals"></a>

### equals

Check whether both values, expressions, or objects are equivalent.
Return true when both are equivalent, or return false when they're not equivalent.

```
equals('<object1>', '<object2>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*object1*>, <*object2*> | Yes | Various | The values, expressions, or objects to compare |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false | Boolean | Return true when both are equivalent. Return false when not equivalent. |
||||

*Example*

These examples check whether the specified inputs are equivalent.

```
equals(true, 1)
equals('abc', 'abcd')
```

And returns these results:

* First example: Both values are equivalent, so the function returns `true`.
* Second example: Both values aren't equivalent, so the function returns `false`.

<a name="first"></a>

### first

Return the first item from a string or array.

```
first('<collection>')
first([<collection>])
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | String or Array | The collection where to find the first item |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*first-collection-item*> | Any | The first item in the collection |
||||

*Example*

These examples find the first item in these collections:

```
first('hello')
first(createArray(0, 1, 2))
```

And return these results:

* First example: `"h"`
* Second example: `0`

<a name="float"></a>

### float

Convert a string version for a floating-point
number to an actual floating point number.

```
float('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string that has a valid floating-point number to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*float-value*> | Float | The floating-point number for the specified string |
||||

*Example*

This example creates a string version for this floating-point number:

```
float('10.333')
```

And returns this result: `10.333`

<a name="formatDateTime"></a>

### formatDateTime

Return a timestamp in the specified format.

```
formatDateTime('<timestamp>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*reformatted-timestamp*> | String | The updated timestamp in the specified format |
||||

*Example*

This example converts a timestamp to the specified format:

```
formatDateTime('03/15/2018 12:00:00', 'yyyy-MM-ddTHH:mm:ss')
```

And returns this result: `"2018-03-15T12:00:00"`

<a name="getFutureTime"></a>

### getFutureTime

Return the current timestamp plus the specified time units.

```
getFutureTime(<interval>, <timeUnit>, <format>?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*interval*> | Yes | Integer | The number of specified time units to add |
| <*timeUnit*> | Yes | String | The unit of time to use with *interval*: "Second", "Minute", "Hour", "Day", "Week", "Month", "Year" |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The current timestamp plus the specified number of time units |
||||

*Example 1*

Suppose the current timestamp is "2018-03-01T00:00:00.0000000Z".
This example adds five days to that timestamp:

```
getFutureTime(5, 'Day')
```

And returns this result: `"2018-03-06T00:00:00.0000000Z"`

*Example 2*

Suppose the current timestamp is "2018-03-01T00:00:00.0000000Z".
This example adds five days and converts the result to "D" format:

```
getFutureTime(5, 'Day', 'D')
```

And returns this result: `"Tuesday, March 6, 2018"`

<a name="getPastTime"></a>

### getPastTime

Return the current timestamp minus the specified time units.

```
getPastTime(<interval>, <timeUnit>, <format>?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*interval*> | Yes | Integer | The number of specified time units to subtract |
| <*timeUnit*> | Yes | String | The unit of time to use with *interval*: "Second", "Minute", "Hour", "Day", "Week", "Month", "Year" |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The current timestamp minus the specified number of time units |
||||

*Example 1*

Suppose the current timestamp is "2018-02-01T00:00:00.0000000Z".
This example subtracts five days from that timestamp:

```
getPastTime(5, 'Day')
```

And returns this result: `"2018-01-27T00:00:00.0000000Z"`

*Example 2*

Suppose the current timestamp is "2018-02-01T00:00:00.0000000Z".
This example subtracts five days and converts the result to "D" format:

```
getPastTime(5, 'Day', 'D')
```

And returns this result: `"Saturday, January 27, 2018"`

<a name="greater"></a>

### greater

Check whether the first value is greater than the second value.
Return true when the first value is more,
or return false when less.

```
greater(<value>, <compareTo>)
greater('<value>', '<compareTo>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | Integer, Float, or String | The first value to check whether greater than the second value |
| <*compareTo*> | Yes | Integer, Float, or String, respectively | The comparison value |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false | Boolean | Return true when the first value is greater than the second value. Return false when the first value is equal to or less than the second value. |
||||

*Example*

These examples check whether the first value is greater than the second value:

```
greater(10, 5)
greater('apple', 'banana')
```

And return these results:

* First example: `true`
* Second example: `false`

<a name="greaterOrEquals"></a>

### greaterOrEquals

Check whether the first value is greater than or equal to the second value.
Return true when the first value is greater or equal,
or return false when the first value is less.

```
greaterOrEquals(<value>, <compareTo>)
greaterOrEquals('<value>', '<compareTo>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | Integer, Float, or String | The first value to check whether greater than or equal to the second value |
| <*compareTo*> | Yes | Integer, Float, or String, respectively | The comparison value |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false | Boolean | Return true when the first value is greater than or equal to the second value. Return false when the first value is less than the second value. |
||||

*Example*

These examples check whether the first value is greater or equal than the second value:

```
greaterOrEquals(5, 5)
greaterOrEquals('apple', 'banana')
```

And return these results:

* First example: `true`
* Second example: `false`

<a name="guid"></a>

### guid

Generate a globally unique identifier (GUID) as a string,
for example, "c2ecc88d-88c8-4096-912c-d6f2e2b138ce":

```
guid()
```

Also, you can specify a different format for the GUID
other than the default format, "D",
which is 32 digits separated by hyphens.

```
guid('<format>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*format*> | No | String | A single [format specifier](https://msdn.microsoft.com/library/97af8hh4) for the returned GUID. By default, the format is "D", but you can use "N", "D", "B", "P", or "X". |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*GUID-value*> | String | A randomly generated GUID |
||||

*Example*

This example generates the same GUID, but as 32 digits,
separated by hyphens, and enclosed in parentheses:

```
guid('P')
```

And returns this result: `"(c2ecc88d-88c8-4096-912c-d6f2e2b138ce)"`

<a name="if"></a>

### if

Check whether an expression is true or false.
Based on the result, return a specified value.

```
if(<expression>, <valueIfTrue>, <valueIfFalse>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*expression*> | Yes | Boolean | The expression to check |
| <*valueIfTrue*> | Yes | Any | The value to return when the expression is true |
| <*valueIfFalse*> | Yes | Any | The value to return when the expression is false |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*specified-return-value*> | Any | The specified value that returns based on whether the expression is true or false |
||||

*Example*

This example returns `"yes"` because the
specified expression returns true.
Otherwise, the example returns `"no"`:

```
if(equals(1, 1), 'yes', 'no')
```

<a name="indexof"></a>

### indexOf

Return the starting position or index value for a substring.
This function is not case-sensitive,
and indexes start with the number 0.

```
indexOf('<text>', '<searchText>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string that has the substring to find |
| <*searchText*> | Yes | String | The substring to find |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*index-value*>| Integer | The starting position or index value for the specified substring. <p>If the string is not found, return the number -1. |
||||

*Example*

This example finds the starting index value for the
"world" substring in the "hello world" string:

```
indexOf('hello world', 'world')
```

And returns this result: `6`

<a name="int"></a>

### int

Return the integer version for a string.

```
int('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*integer-result*> | Integer | The integer version for the specified string |
||||

*Example*

This example creates an integer version for the string "10":

```
int('10')
```

And returns this result: `10`

<a name="json"></a>

### json

Return the JavaScript Object Notation (JSON)
type value or object for a string or XML.

```
json('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String or XML | The string or XML to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*JSON-result*> | JSON native type or object | The JSON native type value or object for the specified string or XML. If the string is null, the function returns an empty object. |
||||

*Example 1*

This example converts this string to the JSON value:

```
json('[1, 2, 3]')
```

And returns this result: `[1, 2, 3]`

*Example 2*

This example converts this string to JSON:

```
json('{"fullName": "Sophia Owen"}')
```

And returns this result:

```
{
  "fullName": "Sophia Owen"
}
```

*Example 3*

This example converts this XML to JSON:

```
json(xml('<?xml version="1.0"?> <root> <person id='1'> <name>Sophia Owen</name> <occupation>Engineer</occupation> </person> </root>'))
```

And returns this result:

```json
{
   "?xml": { "@version": "1.0" },
   "root": {
      "person": [ {
         "@id": "1",
         "name": "Sophia Owen",
         "occupation": "Engineer"
      } ]
   }
}
```

<a name="intersection"></a>

### intersection

Return a collection that has *only* the
common items across the specified collections.
To appear in the result, an item must appear in
all the collections passed to this function.
If one or more items have the same name,
the last item with that name appears in the result.

```
intersection([<collection1>], [<collection2>], ...)
intersection('<collection1>', '<collection2>', ...)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection1*>, <*collection2*>, ... | Yes | Array or Object, but not both | The collections from where you want *only* the common items |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*common-items*> | Array or Object, respectively | A collection that has only the common items across the specified collections |
||||

*Example*

This example finds the common items across these arrays:

```
intersection(createArray(1, 2, 3), createArray(101, 2, 1, 10), createArray(6, 8, 1, 2))
```

And returns an array with *only* these items: `[1, 2]`

<a name="join"></a>

### join

Return a string that has all the items from an array
and has each character separated by a *delimiter*.

```
join([<collection>], '<delimiter>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | Array | The array that has the items to join |
| <*delimiter*> | Yes | String | The separator that appears between each character in the resulting string |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*char1*><*delimiter*><*char2*><*delimiter*>... | String | The resulting string created from all the items in the specified array |
||||

*Example*

This example creates a string from all the items in this
array with the specified character as the delimiter:

```
join(createArray('a', 'b', 'c'), '.')
```

And returns this result: `"a.b.c"`

<a name="last"></a>

### last

Return the last item from a collection.

```
last('<collection>')
last([<collection>])
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | String or Array | The collection where to find the last item |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*last-collection-item*> | String or Array, respectively | The last item in the collection |
||||

*Example*

These examples find the last item in these collections:

```
last('abcd')
last(createArray(0, 1, 2, 3))
```

And returns these results:

* First example: `"d"`
* Second example: `3`

<a name="lastindexof"></a>

### lastIndexOf

Return the starting position or index value
for the last occurrence of a substring.
This function is not case-sensitive,
and indexes start with the number 0.

```
lastIndexOf('<text>', '<searchText>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string that has the substring to find |
| <*searchText*> | Yes | String | The substring to find |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*ending-index-value*> | Integer | The starting position or index value for the last occurrence of the specified substring. <p>If the string is not found, return the number -1. |
||||

*Example*

This example finds the starting index value for
the last occurrence of the "world" substring in
the "hello world" string:

```
lastIndexOf('hello world', 'world')
```

And returns this result: `6`

<a name="length"></a>

### length

Return the number of items in a collection.

```
length('<collection>')
length([<collection>])
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | String or Array | The collection with the items to count |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*length-or-count*> | Integer | The number of items in the collection |
||||

*Example*

These examples count the number of items in these collections:

```
length('abcd')
length(createArray(0, 1, 2, 3))
```

And return this result: `4`

<a name="less"></a>

### less

Check whether the first value is less than the second value.
Return true when the first value is less,
or return false when the first value is more.

```
less(<value>, <compareTo>)
less('<value>', '<compareTo>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | Integer, Float, or String | The first value to check whether less than the second value |
| <*compareTo*> | Yes | Integer, Float, or String, respectively | The comparison item |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false | Boolean | Return true when the first value is less than the second value. Return false when the first value is equal to or greater than the second value. |
||||

*Example*

These examples check whether the first value is less than the second value.

```
less(5, 10)
less('banana', 'apple')
```

And return these results:

* First example: `true`
* Second example: `false`

<a name="lessOrEquals"></a>

### lessOrEquals

Check whether the first value is less than or equal to the second value.
Return true when the first value is less than or equal,
or return false when the first value is more.

```
lessOrEquals(<value>, <compareTo>)
lessOrEquals('<value>', '<compareTo>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | Integer, Float, or String | The first value to check whether less than or equal to the second value |
| <*compareTo*> | Yes | Integer, Float, or String, respectively | The comparison item |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false  | Boolean | Return true when the first value is less than or equal to the second value. Return false when the first value is greater than the second value. |
||||

*Example*

These examples check whether the first value is less or equal than the second value.

```
lessOrEquals(10, 10)
lessOrEquals('apply', 'apple')
```

And return these results:

* First example: `true`
* Second example: `false`

<a name="max"></a>

### max

Return the highest value from a list or array with
numbers that is inclusive at both ends.

```
max(<number1>, <number2>, ...)
max([<number1>, <number2>, ...])
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*number1*>, <*number2*>, ... | Yes | Integer, Float, or both | The set of numbers from which you want the highest value |
| [<*number1*>, <*number2*>, ...] | Yes | Array - Integer, Float, or both | The array of numbers from which you want the highest value |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*max-value*> | Integer or Float | The highest value in the specified array or set of numbers |
||||

*Example*

These examples get the highest value from the set of numbers and the array:

```
max(1, 2, 3)
max(createArray(1, 2, 3))
```

And return this result: `3`

<a name="min"></a>

### min

Return the lowest value from a set of numbers or an array.

```
min(<number1>, <number2>, ...)
min([<number1>, <number2>, ...])
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*number1*>, <*number2*>, ... | Yes | Integer, Float, or both | The set of numbers from which you want the lowest value |
| [<*number1*>, <*number2*>, ...] | Yes | Array - Integer, Float, or both | The array of numbers from which you want the lowest value |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*min-value*> | Integer or Float | The lowest value in the specified set of numbers or specified array |
||||

*Example*

These examples get the lowest value in the set of numbers and the array:

```
min(1, 2, 3)
min(createArray(1, 2, 3))
```

And return this result: `1`

<a name="mod"></a>

### mod

Return the remainder from dividing two numbers.
To get the integer result, see [div()](#div).

```
mod(<dividend>, <divisor>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*dividend*> | Yes | Integer or Float | The number to divide by the *divisor* |
| <*divisor*> | Yes | Integer or Float | The number that divides the *dividend*, but cannot be 0. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*modulo-result*> | Integer or Float | The remainder from dividing the first number by the second number |
||||

*Example*

This example divides the first number by the second number:

```
mod(3, 2)
```

And return this result: `1`

<a name="mul"></a>

### mul

Return the product from multiplying two numbers.

```
mul(<multiplicand1>, <multiplicand2>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*multiplicand1*> | Yes | Integer or Float | The number to multiply by *multiplicand2* |
| <*multiplicand2*> | Yes | Integer or Float | The number that multiples *multiplicand1* |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*product-result*> | Integer or Float | The product from multiplying the first number by the second number |
||||

*Example*

These examples multiple the first number by the second number:

```
mul(1, 2)
mul(1.5, 2)
```

And return these results:

* First example: `2`
* Second example `3`

<a name="not"></a>

### not

Check whether an expression is false.
Return true when the expression is false,
or return false when true.

```json
not(<expression>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*expression*> | Yes | Boolean | The expression to check |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false | Boolean | Return true when the expression is false. Return false when the expression is true. |
||||

*Example 1*

These examples check whether the specified expressions are false:

```json
not(false)
not(true)
```

And return these results:

* First example: The expression is false, so the function returns `true`.
* Second example: The expression is true, so the function returns `false`.

*Example 2*

These examples check whether the specified expressions are false:

```json
not(equals(1, 2))
not(equals(1, 1))
```

And return these results:

* First example: The expression is false, so the function returns `true`.
* Second example: The expression is true, so the function returns `false`.

<a name="or"></a>

### or

Check whether at least one expression is true.
Return true when at least one expression is true,
or return false when both are false.

```
or(<expression1>, <expression2>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*expression1*>, <*expression2*> | Yes | Boolean | The expressions to check |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false | Boolean | Return true when at least one expression is true. Return false when both expressions are false. |
||||

*Example 1*

These examples check whether at least one expression is true:

```json
or(true, false)
or(false, false)
```

And return these results:

* First example: At least one expression is true, so the function returns `true`.
* Second example: Both expressions are false, so the function returns `false`.

*Example 2*

These examples check whether at least one expression is true:

```json
or(equals(1, 1), equals(1, 2))
or(equals(1, 2), equals(1, 3))
```

And return these results:

* First example: At least one expression is true, so the function returns `true`.
* Second example: Both expressions are false, so the function returns `false`.

<a name="rand"></a>

### rand

Return a random integer from a specified range,
which is inclusive only at the starting end.

```
rand(<minValue>, <maxValue>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*minValue*> | Yes | Integer | The lowest integer in the range |
| <*maxValue*> | Yes | Integer | The integer that follows the highest integer in the range that the function can return |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*random-result*> | Integer | The random integer returned from the specified range |
||||

*Example*

This example gets a random integer from the specified range, excluding the maximum value:

```
rand(1, 5)
```

And returns one of these numbers as the result: `1`, `2`, `3`, or `4`

<a name="range"></a>

### range

Return an integer array that starts from a specified integer.

```
range(<startIndex>, <count>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*startIndex*> | Yes | Integer | An integer value that starts the array as the first item |
| <*count*> | Yes | Integer | The number of integers in the array |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| [<*range-result*>] | Array | The array with integers starting from the specified index |
||||

*Example*

This example creates an integer array that starts from
the specified index and has the specified number of integers:

```
range(1, 4)
```

And returns this result: `[1, 2, 3, 4]`

<a name="replace"></a>

### replace

Replace a substring with the specified string,
and return the result string. This function
is case-sensitive.

```
replace('<text>', '<oldText>', '<newText>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string that has the substring to replace |
| <*oldText*> | Yes | String | The substring to replace |
| <*newText*> | Yes | String | The replacement string |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-text*> | String | The updated string after replacing the substring <p>If the substring is not found, return the original string. |
||||

*Example*

This example finds the "old" substring in "the old string"
and replaces "old" with "new":

```
replace('the old string', 'old', 'new')
```

And returns this result: `"the new string"`

<a name="skip"></a>

### skip

Remove items from the front of a collection,
and return *all the other* items.

```
skip([<collection>], <count>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | Array | The collection whose items you want to remove |
| <*count*> | Yes | Integer | A positive integer for the number of items to remove at the front |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| [<*updated-collection*>] | Array | The updated collection after removing the specified items |
||||

*Example*

This example removes one item, the number 0,
from the front of the specified array:

```
skip(createArray(0, 1, 2, 3), 1)
```

And returns this array with the remaining items: `[1,2,3]`

<a name="split"></a>

### split

Return an array that contains substrings, separated by commas,
based on the specified delimiter character in the original string.

```
split('<text>', '<delimiter>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string to separate into substrings based on the specified delimiter in the original string |
| <*delimiter*> | Yes | String | The character in the original string to use as the delimiter |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| [<*substring1*>,<*substring2*>,...] | Array | An array that contains substrings from the original string, separated by commas |
||||

*Example*

This example creates an array with substrings from the specified
string based on the specified character as the delimiter:

```
split('a_b_c', '_')
```

And returns this array as the result: `["a","b","c"]`

<a name="startOfDay"></a>

### startOfDay

Return the start of the day for a timestamp.

```
startOfDay('<timestamp>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The specified timestamp but starting at the zero-hour mark for the day |
||||

*Example*

This example finds the start of the day for this timestamp:

```
startOfDay('2018-03-15T13:30:30Z')
```

And returns this result: `"2018-03-15T00:00:00.0000000Z"`

<a name="startOfHour"></a>

### startOfHour

Return the start of the hour for a timestamp.

```
startOfHour('<timestamp>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The specified timestamp but starting at the zero-minute mark for the hour |
||||

*Example*

This example finds the start of the hour for this timestamp:

```
startOfHour('2018-03-15T13:30:30Z')
```

And returns this result: `"2018-03-15T13:00:00.0000000Z"`

<a name="startOfMonth"></a>

### startOfMonth

Return the start of the month for a timestamp.

```
startOfMonth('<timestamp>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The specified timestamp but starting on the first day of the month at the zero-hour mark |
||||

*Example*

This example returns the start of the month for this timestamp:

```
startOfMonth('2018-03-15T13:30:30Z')
```

And returns this result: `"2018-03-01T00:00:00.0000000Z"`

<a name="startswith"></a>

### startsWith

Check whether a string starts with a specific substring.
Return true when the substring is found, or return false when not found.
This function is not case-sensitive.

```
startsWith('<text>', '<searchText>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string to check |
| <*searchText*> | Yes | String | The starting string to find |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false  | Boolean | Return true when the starting substring is found. Return false when not found. |
||||

*Example 1*

This example checks whether the "hello world"
string starts with the "hello" substring:

```
startsWith('hello world', 'hello')
```

And returns this result: `true`

*Example 2*

This example checks whether the "hello world"
string starts with the "greetings" substring:

```
startsWith('hello world', 'greetings')
```

And returns this result: `false`

<a name="string"></a>

### string

Return the string version for a value.

```
string(<value>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | Any | The value to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*string-value*> | String | The string version for the specified value |
||||

*Example 1*

This example creates the string version for this number:

```
string(10)
```

And returns this result: `"10"`

*Example 2*

This example creates a string for the specified JSON object
and uses the backslash character (\\)
as an escape character for the double-quotation mark (").

```
string( { "name": "Sophie Owen" } )
```

And returns this result: `"{ \\"name\\": \\"Sophie Owen\\" }"`

<a name="sub"></a>

### sub

Return the result from subtracting the second number from the first number.

```
sub(<minuend>, <subtrahend>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*minuend*> | Yes | Integer or Float | The number from which to subtract the *subtrahend* |
| <*subtrahend*> | Yes | Integer or Float | The number to subtract from the *minuend* |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*result*> | Integer or Float | The result from subtracting the second number from the first number |
||||

*Example*

This example subtracts the second number from the first number:

```
sub(10.3, .3)
```

And returns this result: `10`

<a name="substring"></a>

### substring

Return characters from a string,
starting from the specified position, or index.
Index values start with the number 0.

```
substring('<text>', <startIndex>, <length>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string whose characters you want |
| <*startIndex*> | Yes | Integer | A positive number equal to or greater than 0 that you want to use as the starting position or index value |
| <*length*> | Yes | Integer | A positive number of characters that you want in the substring |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*substring-result*> | String | A substring with the specified number of characters, starting at the specified index position in the source string |
||||

*Example*

This example creates a five-character substring from the specified string,
starting from the index value 6:

```
substring('hello world', 6, 5)
```

And returns this result: `"world"`

<a name="subtractFromTime"></a>

### subtractFromTime

Subtract a number of time units from a timestamp.
See also [getPastTime](#getPastTime).

```
subtractFromTime('<timestamp>', <interval>, '<timeUnit>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*interval*> | Yes | Integer | The number of specified time units to subtract |
| <*timeUnit*> | Yes | String | The unit of time to use with *interval*: "Second", "Minute", "Hour", "Day", "Week", "Month", "Year" |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The timestamp minus the specified number of time units |
||||

*Example 1*

This example subtracts one day from this timestamp:

```
subtractFromTime('2018-01-02T00:00:00Z', 1, 'Day')
```

And returns this result: `"2018-01-01T00:00:00:0000000Z"`

*Example 2*

This example subtracts one day from this timestamp:

```
subtractFromTime('2018-01-02T00:00:00Z', 1, 'Day', 'D')
```

And returns this result using the optional "D" format: `"Monday, January, 1, 2018"`

<a name="take"></a>

### take

Return items from the front of a collection.

```
take('<collection>', <count>)
take([<collection>], <count>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | String or Array | The collection whose items you want |
| <*count*> | Yes | Integer | A positive integer for the number of items that you want from the front |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*subset*> or [<*subset*>] | String or Array, respectively | A string or array that has the specified number of items taken from the front of the original collection |
||||

*Example*

These examples get the specified number of
items from the front of these collections:

```
take('abcde', 3)
take(createArray(0, 1, 2, 3, 4), 3)
```

And return these results:

* First example: `"abc"`
* Second example: `[0, 1, 2]`

<a name="ticks"></a>

### ticks

Return the `ticks` property value for a specified timestamp.
A *tick* is a 100-nanosecond interval.

```
ticks('<timestamp>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string for a timestamp |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*ticks-number*> | Integer | The number of ticks since the specified timestamp |
||||

<a name="toLower"></a>

### toLower

Return a string in lowercase format. If a character
in the string doesn't have a lowercase version,
that character stays unchanged in the returned string.

```
toLower('<text>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string to return in lowercase format |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*lowercase-text*> | String | The original string in lowercase format |
||||

*Example*

This example converts this string to lowercase:

```
toLower('Hello World')
```

And returns this result: `"hello world"`

<a name="toUpper"></a>

### toUpper

Return a string in uppercase format. If a character
in the string doesn't have an uppercase version,
that character stays unchanged in the returned string.

```
toUpper('<text>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string to return in uppercase format |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*uppercase-text*> | String | The original string in uppercase format |
||||

*Example*

This example converts this string to uppercase:

```
toUpper('Hello World')
```

And returns this result: `"HELLO WORLD"`

<a name="trim"></a>

### trim

Remove leading and trailing whitespace from a string,
and return the updated string.

```
trim('<text>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string that has the leading and trailing whitespace to remove |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updatedText*> | String | An updated version for the original string without leading or trailing whitespace |
||||

*Example*

This example removes the leading and trailing
whitespace from the string " Hello World  ":

```
trim(' Hello World  ')
```

And returns this result: `"Hello World"`

<a name="union"></a>

### union

Return a collection that has *all* the items from the specified collections.
To appear in the result, an item can appear in any collection
passed to this function. If one or more items have the same name,
the last item with that name appears in the result.

```
union('<collection1>', '<collection2>', ...)
union([<collection1>], [<collection2>], ...)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection1*>, <*collection2*>, ...  | Yes | Array or Object, but not both | The collections from where you want *all* the items |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updatedCollection*> | Array or Object, respectively | A collection with all the items from the specified collections - no duplicates |
||||

*Example*

This example gets *all* the items from these collections:

```
union(createArray(1, 2, 3), createArray(1, 2, 10, 101))
```

And returns this result: `[1, 2, 3, 10, 101]`

<a name="uriComponent"></a>

### uriComponent

Return a uniform resource identifier (URI) encoded version for a
string by replacing URL-unsafe characters with escape characters.
Use this function rather than [encodeUriComponent()](#encodeUriComponent).
Although both functions work the same way,
`uriComponent()` is preferred.

```
uriComponent('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string to convert to URI-encoded format |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*encoded-uri*> | String | The URI-encoded string with escape characters |
||||

*Example*

This example creates a URI-encoded version for this string:

```
uriComponent('https://contoso.com')
```

And returns this result: `"http%3A%2F%2Fcontoso.com"`

<a name="uriComponentToBinary"></a>

### uriComponentToBinary

Return the binary version for a uniform resource identifier (URI) component.

```
uriComponentToBinary('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The URI-encoded string to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*binary-for-encoded-uri*> | String | The binary version for the URI-encoded string. The binary content is base64-encoded and represented by `$content`. |
||||

*Example*

This example creates the binary version for this URI-encoded string:

```
uriComponentToBinary('http%3A%2F%2Fcontoso.com')
```

And returns this result:

`"001000100110100001110100011101000111000000100101001100
11010000010010010100110010010001100010010100110010010001
10011000110110111101101110011101000110111101110011011011
110010111001100011011011110110110100100010"`

<a name="uriComponentToString"></a>

### uriComponentToString

Return the string version for a uniform resource identifier (URI) encoded string,
effectively decoding the URI-encoded string.

```
uriComponentToString('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The URI-encoded string to decode |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*decoded-uri*> | String | The decoded version for the URI-encoded string |
||||

*Example*

This example creates the decoded string version for this URI-encoded string:

```
uriComponentToString('http%3A%2F%2Fcontoso.com')
```

And returns this result: `"https://contoso.com"`

<a name="utcNow"></a>

### utcNow

Return the current timestamp.

```
utcNow('<format>')
```

Optionally, you can specify a different format with the <*format*> parameter.

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*format*> | No | String | Either a [single format specifier](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](https://docs.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss:fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*current-timestamp*> | String | The current date and time |
||||

*Example 1*

Suppose today is April 15, 2018 at 1:00:00 PM.
This example gets the current timestamp:

```
utcNow()
```

And returns this result: `"2018-04-15T13:00:00.0000000Z"`

*Example 2*

Suppose today is April 15, 2018 at 1:00:00 PM.
This example gets the current timestamp using the optional "D" format:

```
utcNow('D')
```

And returns this result: `"Sunday, April 15, 2018"`

<a name="xml"></a>

### xml

Return the XML version for a string that contains a JSON object.

```
xml('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string with the JSON object to convert <p>The JSON object must have only one root property, which can't be an array. <br>Use the backslash character (\\) as an escape character for the double quotation mark ("). |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*xml-version*> | Object | The encoded XML for the specified string or JSON object |
||||

*Example 1*

This example creates the XML version for this string,
which contains a JSON object:

`xml(json('{ \"name\": \"Sophia Owen\" }'))`

And returns this result XML:

```xml
<name>Sophia Owen</name>
```

*Example 2*

Suppose you have this JSON object:

```json
{
  "person": {
    "name": "Sophia Owen",
    "city": "Seattle"
  }
}
```

This example creates XML for a string that contains this JSON object:

`xml(json('{\"person\": {\"name\": \"Sophia Owen\", \"city\": \"Seattle\"}}'))`

And returns this result XML:

```xml
<person>
  <name>Sophia Owen</name>
  <city>Seattle</city>
<person>
```

<a name="xpath"></a>

### xpath

Check XML for nodes or values that match an XPath (XML Path Language) expression,
and return the matching nodes or values. An XPath expression, or just "XPath",
helps you navigate an XML document structure so that you can select nodes
or compute values in the XML content.

```
xpath('<xml>', '<xpath>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*xml*> | Yes | Any | The XML string to search for nodes or values that match an XPath expression value |
| <*xpath*> | Yes | Any | The XPath expression used to find matching XML nodes or values |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*xml-node*> | XML | An XML node when only a single node matches the specified XPath expression |
| <*value*> | Any | The value from an XML node when only a single value matches the specified XPath expression |
| [<*xml-node1*>, <*xml-node2*>, ...] </br>-or- </br>[<*value1*>, <*value2*>, ...] | Array | An array with XML nodes or values that match the specified XPath expression |
||||

*Example 1*

Following on Example 1, this example finds nodes that match the
`<count></count>` node and adds those node values with the `sum()` function:

`xpath(xml(parameters('items')), 'sum(/produce/item/count)')`

And returns this result: `30`

*Example 2*

For this example, both expressions find nodes that match the
`<location></location>` node, in the specified arguments,
which include XML with a namespace. The expressions use the backslash
character (\\) as an escape character for the double quotation mark (").

* *Expression 1*

  `xpath(xml(body('Http')), '/*[name()=\"file\"]/*[name()=\"location\"]')`

* *Expression 2*

  `xpath(xml(body('Http')), '/*[local-name()=\"file\" and namespace-uri()=\"http://contoso.com\"]/*[local-name()=\"location\"]')`

Here are the arguments:

* This XML, which includes the XML document namespace, `xmlns="http://contoso.com"`:

  ```xml
  <?xml version="1.0"?> <file xmlns="http://contoso.com"> <location>Paris</location> </file>
  ```

* Either XPath expression here:

  * `/*[name()=\"file\"]/*[name()=\"location\"]`

  * `/*[local-name()=\"file\" and namespace-uri()=\"http://contoso.com\"]/*[local-name()=\"location\"]`

Here is the result node that matches the `<location></location>` node:

```xml
<location xmlns="https://contoso.com">Paris</location>
```

*Example 3*

Following on Example 3, this example finds the value in the
`<location></location>` node:

`xpath(xml(body('Http')), 'string(/*[name()=\"file\"]/*[name()=\"location\"])')`

And returns this result: `"Paris"`

## Next steps
For a list of system variables you can use in expressions, see [System variables](control-flow-system-variables.md).
