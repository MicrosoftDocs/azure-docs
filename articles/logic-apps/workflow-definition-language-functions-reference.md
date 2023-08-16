---
title: Reference guide for expression functions
description: Reference guide to workflow expression functions for Azure Logic Apps and Power Automate.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, niding, azla
ms.topic: reference
ms.custom: engagement-fy23
ms.date: 04/07/2023
---

# Reference guide to workflow expression functions in Azure Logic Apps and Power Automate

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

For workflow definitions in [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and [Power Automate](/power-automate/getting-started), some [expressions](logic-apps-workflow-definition-language.md#expressions) get their values from runtime actions that might not yet exist when your workflow starts running. To reference or process the values in these expressions, you can use *expression functions* provided by the [Workflow Definition Language](logic-apps-workflow-definition-language.md).

> [!NOTE]
> This reference page applies to both Azure Logic Apps and Power Automate, but appears in the 
> Azure Logic Apps documentation. Although this page refers specifically to logic app workflows, 
> these functions work for both flows and logic app workflows. For more information about functions 
> and expressions in Power Automate, review [Use expressions in conditions](/power-automate/use-expressions-in-conditions).

For example, you can calculate values by using math functions, such as the [add()](../logic-apps/workflow-definition-language-functions-reference.md#add) function, when you want the sum from integers or floats. Here are other example tasks that you can perform with functions:

| Task | Function syntax | Result |
| ---- | --------------- | ------ |
| Return a string in lowercase format. | toLower('<*text*>') <br><br>For example: toLower('Hello') | "hello" |
| Return a globally unique identifier (GUID). | guid() |"c2ecc88d-88c8-4096-912c-d6f2e2b138ce" |
||||

To find functions [based on their general purpose](#ordered-by-purpose), review the following tables. Or, for detailed information about each function, see the [alphabetical list](#alphabetical-list).

## Functions in expressions

To show how to use a function in an expression, this example shows how you can get the value from the `customerName` parameter and assign that value to the `accountName` property by using the [parameters()](#parameters) function in an expression:

```json
"accountName": "@parameters('customerName')"
```

Here are some other general ways that you can use functions in expressions:

| Task | Function syntax in an expression |
| ---- | -------------------------------- |
| Perform work with an item by passing that item to a function. | "\@<*functionName*>(<*item*>)" |
| 1. Get the *parameterName*'s value by using the nested `parameters()` function. <br>2. Perform work with the result by passing that value to *functionName*. | "\@<*functionName*>(parameters('<*parameterName*>'))" |
| 1. Get the result from the nested inner function *functionName*. <br>2. Pass the result to the outer function *functionName2*. | "\@<*functionName2*>(<*functionName*>(<*item*>))" |
| 1. Get the result from *functionName*. <br>2. Given that the result is an object with property *propertyName*, get that property's value. | "\@<*functionName*>(<*item*>).<*propertyName*>" |
|||

For example, the `concat()` function can take two or more string values as parameters. This function combines those strings into one string. You can either pass in string literals, for example, "Sophia" and "Owen" so that you get a combined string, "SophiaOwen":

```json
"customerName": "@concat('Sophia', 'Owen')"
```

Or, you can get string values from parameters. This example uses the `parameters()` function in each `concat()` parameter
and the `firstName` and `lastName` parameters. You then pass the resulting strings to the `concat()` function so that
you get a combined string, for example, "SophiaOwen":

```json
"customerName": "@concat(parameters('firstName'), parameters('lastName'))"
```

Either way, both examples assign the result to the `customerName` property.

<a name="function-considerations"></a>

## Considerations for using functions

* The designer doesn't evaluate runtime expressions that are used as function parameters at design time. The designer requires that all expressions can be fully evaluated at design time.

* Function parameters are evaluated from left to right.
 
* In the syntax for parameter definitions, a question mark (?) that appears after a parameter means the parameter is optional. For example, see [getFutureTime()](#getFutureTime).

* Function expressions that appear inline with plain text require enclosing curly braces ({}) to use the expression's interpolated format instead. This format helps avoid parsing problems. If your function expression doesn't appear inline with plain text, no curly braces are necessary.

  The following example shows the correct and incorrect syntax:

  **Correct**: `"<text>/@{<function-name>('<parameter-name>')}/<text>"`

  **Incorrect**: `"<text>/@<function-name>('<parameter-name>')/<text>"`

  **OK**: `"@<function-name>('<parameter-name>')"`

The following sections organize functions based on their general purpose, or you can browse these functions in [alphabetical order](#alphabetical-list).

<a name="ordered-by-purpose"></a>
<a name="string-functions"></a>

## String functions

To work with strings, you can use these string functions and also some [collection functions](#collection-functions). String functions work only on strings.

| String function | Task |
| --------------- | ---- |
| [chunk](../logic-apps/workflow-definition-language-functions-reference.md#chunk) | Split a string or collection into chunks of equal length. |
| [concat](../logic-apps/workflow-definition-language-functions-reference.md#concat) | Combine two or more strings, and return the combined string. |
| [endsWith](../logic-apps/workflow-definition-language-functions-reference.md#endswith) | Check whether a string ends with the specified substring. |
| [formatNumber](../logic-apps/workflow-definition-language-functions-reference.md#formatNumber) | Return a number as a string based on the specified format |
| [guid](../logic-apps/workflow-definition-language-functions-reference.md#guid) | Generate a globally unique identifier (GUID) as a string. |
| [indexOf](../logic-apps/workflow-definition-language-functions-reference.md#indexof) | Return the starting position for a substring. |
| [isFloat](../logic-apps/workflow-definition-language-functions-reference.md#isInt) | Return a boolean that indicates whether a string is a floating-point number. |
| [isInt](../logic-apps/workflow-definition-language-functions-reference.md#isInt) | Return a boolean that indicates whether a string is an integer. |
| [lastIndexOf](../logic-apps/workflow-definition-language-functions-reference.md#lastindexof) | Return the starting position for the last occurrence of a substring. |
| [length](../logic-apps/workflow-definition-language-functions-reference.md#length) | Return the number of items in a string or array. |
| [nthIndexOf](../logic-apps/workflow-definition-language-functions-reference.md#nthIndexOf) | Return the starting position or index value where the *n*th occurrence of a substring appears in a string. |
| [replace](../logic-apps/workflow-definition-language-functions-reference.md#replace) | Replace a substring with the specified string, and return the updated string. |
| [slice](../logic-apps/workflow-definition-language-functions-reference.md#slice) | Return a substring by specifying the starting and ending position or value. See also [substring](../logic-apps/workflow-definition-language-functions-reference.md#substring). |
| [split](../logic-apps/workflow-definition-language-functions-reference.md#split) | Return an array that contains substrings, separated by commas, from a larger string based on a specified delimiter character in the original string. |
| [startsWith](../logic-apps/workflow-definition-language-functions-reference.md#startswith) | Check whether a string starts with a specific substring. |
| [substring](../logic-apps/workflow-definition-language-functions-reference.md#substring) | Return characters from a string, starting from the specified position. See also [slice](../logic-apps/workflow-definition-language-functions-reference.md#slice). |
| [toLower](../logic-apps/workflow-definition-language-functions-reference.md#toLower) | Return a string in lowercase format. |
| [toUpper](../logic-apps/workflow-definition-language-functions-reference.md#toUpper) | Return a string in uppercase format. |
| [trim](../logic-apps/workflow-definition-language-functions-reference.md#trim) | Remove leading and trailing whitespace from a string, and return the updated string. |
|||

<a name="collection-functions"></a>

## Collection functions

To work with collections, generally arrays, strings, and sometimes, dictionaries, you can use these collection functions.

| Collection function | Task |
| ------------------- | ---- |
| [chunk](../logic-apps/workflow-definition-language-functions-reference.md#chunk) | Split a string or collection into chunks of equal length. |
| [contains](../logic-apps/workflow-definition-language-functions-reference.md#contains) | Check whether a collection has a specific item. |
| [empty](../logic-apps/workflow-definition-language-functions-reference.md#empty) | Check whether a collection is empty. |
| [first](../logic-apps/workflow-definition-language-functions-reference.md#first) | Return the first item from a collection. |
| [intersection](../logic-apps/workflow-definition-language-functions-reference.md#intersection) | Return a collection that has *only* the common items across the specified collections. |
| [item](../logic-apps/workflow-definition-language-functions-reference.md#item) | If this function appears inside a repeating action over an array, return the current item in the array during the action's current iteration. |
| [join](../logic-apps/workflow-definition-language-functions-reference.md#join) | Return a string that has *all* the items from an array, separated by the specified character. |
| [last](../logic-apps/workflow-definition-language-functions-reference.md#last) | Return the last item from a collection. |
| [length](../logic-apps/workflow-definition-language-functions-reference.md#length) | Return the number of items in a string or array. |
| [reverse](../logic-apps/workflow-definition-language-functions-reference.md#reverse) | Reverse the order of items in an array. |
| [skip](../logic-apps/workflow-definition-language-functions-reference.md#skip) | Remove items from the front of a collection, and return *all the other* items. |
| [sort](../logic-apps/workflow-definition-language-functions-reference.md#sort) | Sort items in a collection. |
| [take](../logic-apps/workflow-definition-language-functions-reference.md#take) | Return items from the front of a collection. |
| [union](../logic-apps/workflow-definition-language-functions-reference.md#union) | Return a collection that has *all* the items from the specified collections. |
|||

<a name="comparison-functions"></a>

## Logical comparison functions

To work with conditions, compare values and expression results, or evaluate various kinds of logic, you can use these logical comparison functions. For the full reference about each function, see the [alphabetical list](../logic-apps/workflow-definition-language-functions-reference.md#alphabetical-list).

> [!NOTE]
> If you use logical functions or conditions to compare values, null values are converted to empty string (`""`) values. The behavior of conditions differs when you compare with an empty string instead of a null value. For more information, see the [string() function](#string).

| Logical comparison function | Task |
| --------------------------- | ---- |
| [and](../logic-apps/workflow-definition-language-functions-reference.md#and) | Check whether all expressions are true. |
| [equals](../logic-apps/workflow-definition-language-functions-reference.md#equals) | Check whether both values are equivalent. |
| [greater](../logic-apps/workflow-definition-language-functions-reference.md#greater) | Check whether the first value is greater than the second value. |
| [greaterOrEquals](../logic-apps/workflow-definition-language-functions-reference.md#greaterOrEquals) | Check whether the first value is greater than or equal to the second value. |
| [if](../logic-apps/workflow-definition-language-functions-reference.md#if) | Check whether an expression is true or false. Based on the result, return a specified value. |
| [less](../logic-apps/workflow-definition-language-functions-reference.md#less) | Check whether the first value is less than the second value. |
| [lessOrEquals](../logic-apps/workflow-definition-language-functions-reference.md#lessOrEquals) | Check whether the first value is less than or equal to the second value. |
| [not](../logic-apps/workflow-definition-language-functions-reference.md#not) | Check whether an expression is false. |
| [or](../logic-apps/workflow-definition-language-functions-reference.md#or) | Check whether at least one expression is true. |
|||

<a name="conversion-functions"></a>

## Conversion functions

To change a value's type or format, you can use these conversion functions. For example, you can change a value from a Boolean to an integer. For more information about how Azure Logic Apps handles content types during conversion, see [Handle content types](../logic-apps/logic-apps-content-type.md). For the full reference about each function, see the [alphabetical list](../logic-apps/workflow-definition-language-functions-reference.md#alphabetical-list).

> [!NOTE]
> Azure Logic Apps automatically or implicitly performs base64 encoding and decoding, so you don't have to manually perform these conversions by using 
> the encoding and decoding functions. However, if you use these functions anyway in the designer, you might experience unexpected rendering behaviors 
> in the designer. These behaviors affect only the functions' visibility and not their effect unless you edit the functions' parameter values, which removes 
> the functions and their effects from your code. For more information, see [Implicit data type conversions](#implicit-data-conversions).

| Conversion function | Task |
| ------------------- | ---- |
| [array](../logic-apps/workflow-definition-language-functions-reference.md#array) | Return an array from a single specified input. For multiple inputs, see [createArray](../logic-apps/workflow-definition-language-functions-reference.md#createArray). |
| [base64](../logic-apps/workflow-definition-language-functions-reference.md#base64) | Return the base64-encoded version for a string. |
| [base64ToBinary](../logic-apps/workflow-definition-language-functions-reference.md#base64ToBinary) | Return the binary version for a base64-encoded string. |
| [base64ToString](../logic-apps/workflow-definition-language-functions-reference.md#base64ToString) | Return the string version for a base64-encoded string. |
| [binary](../logic-apps/workflow-definition-language-functions-reference.md#binary) | Return the binary version for an input value. |
| [bool](../logic-apps/workflow-definition-language-functions-reference.md#bool) | Return the Boolean version for an input value. |
| [createArray](../logic-apps/workflow-definition-language-functions-reference.md#createArray) | Return an array from multiple inputs. |
| [dataUri](../logic-apps/workflow-definition-language-functions-reference.md#dataUri) | Return the data URI for an input value. |
| [dataUriToBinary](../logic-apps/workflow-definition-language-functions-reference.md#dataUriToBinary) | Return the binary version for a data URI. |
| [dataUriToString](../logic-apps/workflow-definition-language-functions-reference.md#dataUriToString) | Return the string version for a data URI. |
| [decimal](../logic-apps/workflow-definition-language-functions-reference.md#decimal) | Return the decimal number for a decimal string. |
| [decodeBase64](../logic-apps/workflow-definition-language-functions-reference.md#decodeBase64) | Return the string version for a base64-encoded string. |
| [decodeDataUri](../logic-apps/workflow-definition-language-functions-reference.md#decodeDataUri) | Return the binary version for a data URI. |
| [decodeUriComponent](../logic-apps/workflow-definition-language-functions-reference.md#decodeUriComponent) | Return a string that replaces escape characters with decoded versions. |
| [encodeUriComponent](../logic-apps/workflow-definition-language-functions-reference.md#encodeUriComponent) | Return a string that replaces URL-unsafe characters with escape characters. |
| [float](../logic-apps/workflow-definition-language-functions-reference.md#float) | Return a floating point number for an input value. |
| [int](../logic-apps/workflow-definition-language-functions-reference.md#int) | Return the integer version for a string. |
| [json](../logic-apps/workflow-definition-language-functions-reference.md#json) | Return the JavaScript Object Notation (JSON) type value or object for a string or XML. |
| [string](../logic-apps/workflow-definition-language-functions-reference.md#string) | Return the string version for an input value. |
| [uriComponent](../logic-apps/workflow-definition-language-functions-reference.md#uriComponent) | Return the URI-encoded version for an input value by replacing URL-unsafe characters with escape characters. |
| [uriComponentToBinary](../logic-apps/workflow-definition-language-functions-reference.md#uriComponentToBinary) | Return the binary version for a URI-encoded string. |
| [uriComponentToString](../logic-apps/workflow-definition-language-functions-reference.md#uriComponentToString) | Return the string version for a URI-encoded string. |
| [xml](../logic-apps/workflow-definition-language-functions-reference.md#xml) | Return the XML version for a string. |
|||

<a name="implicit-data-conversions"></a>

## Implicit data type conversions

Azure Logic Apps automatically or implicitly converts between some data types, so you don't have to manually perform these conversions. For example, if you use non-string values where strings are expected as inputs, Azure Logic Apps automatically converts the non-string values into strings.

For example, suppose a trigger returns a numerical value as output:

`triggerBody()?['123']`

If you use this numerical output where string input is expected, such as a URL, Azure Logic Apps automatically converts the value into a string by using the curly braces (`{}`) notation:

`@{triggerBody()?['123']}`

<a name="base64-encoding-decoding"></a>

### Base64 encoding and decoding

Azure Logic Apps automatically or implicitly performs base64 encoding or decoding, so you don't have to manually perform these conversions by using the corresponding functions:

* `base64(<value>)`
* `base64ToBinary(<value>)`
* `base64ToString(<value>)`
* `base64(decodeDataUri(<value>))`
* `concat('data:;base64,',<value>)`
* `concat('data:,',encodeUriComponent(<value>))`
* `decodeDataUri(<value>)`

> [!NOTE]
> If you manually add any of these functions while using the designer, either directly to a trigger 
> or action or by using the expression editor, navigate away from the designer, and then return to the designer, 
> the function disappears from the designer, leaving behind only the parameter values. This behavior also happens 
> if you select a trigger or action that uses this function without editing the function's parameter values. 
> This result affects only the function's visibility and not the effect. In code view, the function is unaffected. 
> However, if you edit the function's parameter values, the function and its effect are both removed from code view, 
> leaving behind only the function's parameter values.

<a name="math-functions"></a>

## Math functions

To work with integers and floats, you can use these math functions.
For the full reference about each function, see the
[alphabetical list](../logic-apps/workflow-definition-language-functions-reference.md#alphabetical-list).

| Math function | Task |
| ------------- | ---- |
| [add](../logic-apps/workflow-definition-language-functions-reference.md#add) | Return the result from adding two numbers. |
| [div](../logic-apps/workflow-definition-language-functions-reference.md#div) | Return the result from dividing two numbers. |
| [max](../logic-apps/workflow-definition-language-functions-reference.md#max) | Return the highest value from a set of numbers or an array. |
| [min](../logic-apps/workflow-definition-language-functions-reference.md#min) | Return the lowest value from a set of numbers or an array. |
| [mod](../logic-apps/workflow-definition-language-functions-reference.md#mod) | Return the remainder from dividing two numbers. |
| [mul](../logic-apps/workflow-definition-language-functions-reference.md#mul) | Return the product from multiplying two numbers. |
| [rand](../logic-apps/workflow-definition-language-functions-reference.md#rand) | Return a random integer from a specified range. |
| [range](../logic-apps/workflow-definition-language-functions-reference.md#range) | Return an integer array that starts from a specified integer. |
| [sub](../logic-apps/workflow-definition-language-functions-reference.md#sub) | Return the result from subtracting the second number from the first number. |
|||

<a name="date-time-functions"></a>

## Date and time functions

To work with dates and times, you can use these date and time functions.
For the full reference about each function, see the
[alphabetical list](../logic-apps/workflow-definition-language-functions-reference.md#alphabetical-list).

| Date or time function | Task |
| --------------------- | ---- |
| [addDays](../logic-apps/workflow-definition-language-functions-reference.md#addDays) | Add days to a timestamp. |
| [addHours](../logic-apps/workflow-definition-language-functions-reference.md#addHours) | Add hours to a timestamp. |
| [addMinutes](../logic-apps/workflow-definition-language-functions-reference.md#addMinutes) | Add minutes to a timestamp. |
| [addSeconds](../logic-apps/workflow-definition-language-functions-reference.md#addSeconds) | Add seconds to a timestamp. |
| [addToTime](../logic-apps/workflow-definition-language-functions-reference.md#addToTime) | Add specified time units to a timestamp. See also [getFutureTime](../logic-apps/workflow-definition-language-functions-reference.md#getFutureTime). |
| [convertFromUtc](../logic-apps/workflow-definition-language-functions-reference.md#convertFromUtc) | Convert a timestamp from Universal Time Coordinated (UTC) to the target time zone. |
| [convertTimeZone](../logic-apps/workflow-definition-language-functions-reference.md#convertTimeZone) | Convert a timestamp from the source time zone to the target time zone. |
| [convertToUtc](../logic-apps/workflow-definition-language-functions-reference.md#convertToUtc) | Convert a timestamp from the source time zone to Universal Time Coordinated (UTC). |
| [dateDifference](../logic-apps/workflow-definition-language-functions-reference.md#dateDifference) | Return the difference between two dates as a timespan. |
| [dayOfMonth](../logic-apps/workflow-definition-language-functions-reference.md#dayOfMonth) | Return the day of the month component from a timestamp. |
| [dayOfWeek](../logic-apps/workflow-definition-language-functions-reference.md#dayOfWeek) | Return the day of the week component from a timestamp. |
| [dayOfYear](../logic-apps/workflow-definition-language-functions-reference.md#dayOfYear) | Return the day of the year component from a timestamp. |
| [formatDateTime](../logic-apps/workflow-definition-language-functions-reference.md#formatDateTime) | Return the date from a timestamp. |
| [getFutureTime](../logic-apps/workflow-definition-language-functions-reference.md#getFutureTime) | Return the current timestamp plus the specified time units. See also [addToTime](../logic-apps/workflow-definition-language-functions-reference.md#addToTime). |
| [getPastTime](../logic-apps/workflow-definition-language-functions-reference.md#getPastTime) | Return the current timestamp minus the specified time units. See also [subtractFromTime](../logic-apps/workflow-definition-language-functions-reference.md#subtractFromTime). |
| [parseDateTime](../logic-apps/workflow-definition-language-functions-reference.md#parseDateTime) | Return the timestamp from a string that contains a timestamp. |
| [startOfDay](../logic-apps/workflow-definition-language-functions-reference.md#startOfDay) | Return the start of the day for a timestamp. |
| [startOfHour](../logic-apps/workflow-definition-language-functions-reference.md#startOfHour) | Return the start of the hour for a timestamp. |
| [startOfMonth](../logic-apps/workflow-definition-language-functions-reference.md#startOfMonth) | Return the start of the month for a timestamp. |
| [subtractFromTime](../logic-apps/workflow-definition-language-functions-reference.md#subtractFromTime) | Subtract a number of time units from a timestamp. See also [getPastTime](../logic-apps/workflow-definition-language-functions-reference.md#getPastTime). |
| [ticks](../logic-apps/workflow-definition-language-functions-reference.md#ticks) | Return the `ticks` property value for a specified timestamp. |
| [utcNow](../logic-apps/workflow-definition-language-functions-reference.md#utcNow) | Return the current timestamp as a string. |
|||

<a name="workflow-functions"></a>

## Workflow functions

These workflow functions can help you:

* Get details about a workflow instance at run time.
* Work with the inputs used for instantiating logic apps or flows.
* Reference the outputs from triggers and actions.

For example, you can reference the outputs from
one action and use that data in a later action.
For the full reference about each function, see the
[alphabetical list](../logic-apps/workflow-definition-language-functions-reference.md#alphabetical-list).

| Workflow function | Task |
| ----------------- | ---- |
| [action](../logic-apps/workflow-definition-language-functions-reference.md#action) | Return the current action's output at runtime, or values from other JSON name-and-value pairs. See also [actions](../logic-apps/workflow-definition-language-functions-reference.md#actions). |
| [actionBody](../logic-apps/workflow-definition-language-functions-reference.md#actionBody) | Return an action's `body` output at runtime. See also [body](../logic-apps/workflow-definition-language-functions-reference.md#body). |
| [actionOutputs](../logic-apps/workflow-definition-language-functions-reference.md#actionOutputs) | Return an action's output at runtime. See [outputs](../logic-apps/workflow-definition-language-functions-reference.md#outputs) and [actions](../logic-apps/workflow-definition-language-functions-reference.md#actions). |
| [actions](../logic-apps/workflow-definition-language-functions-reference.md#actions) | Return an action's output at runtime, or values from other JSON name-and-value pairs. See also [action](../logic-apps/workflow-definition-language-functions-reference.md#action).  |
| [body](#body) | Return an action's `body` output at runtime. See also [actionBody](../logic-apps/workflow-definition-language-functions-reference.md#actionBody). |
| [formDataMultiValues](../logic-apps/workflow-definition-language-functions-reference.md#formDataMultiValues) | Create an array with the values that match a key name in *form-data* or *form-encoded* action outputs. |
| [formDataValue](../logic-apps/workflow-definition-language-functions-reference.md#formDataValue) | Return a single value that matches a key name in an action's *form-data* or *form-encoded output*. |
| [item](../logic-apps/workflow-definition-language-functions-reference.md#item) | If this function appears inside a repeating action over an array, return the current item in the array during the action's current iteration. |
| [items](../logic-apps/workflow-definition-language-functions-reference.md#items) | If this function appears inside a Foreach or Until loop, return the current item from the specified loop.|
| [iterationIndexes](../logic-apps/workflow-definition-language-functions-reference.md#iterationIndexes) | If this function appears inside an Until loop, return the index value for the current iteration. You can use this function inside nested Until loops. |
| [listCallbackUrl](../logic-apps/workflow-definition-language-functions-reference.md#listCallbackUrl) | Return the "callback URL" that calls a trigger or action. |
| [multipartBody](../logic-apps/workflow-definition-language-functions-reference.md#multipartBody) | Return the body for a specific part in an action's output that has multiple parts. |
| [outputs](../logic-apps/workflow-definition-language-functions-reference.md#outputs) | Return an action's output at runtime. |
| [parameters](../logic-apps/workflow-definition-language-functions-reference.md#parameters) | Return the value for a parameter that is described in your workflow definition. |
| [result](../logic-apps/workflow-definition-language-functions-reference.md#result) | Return the inputs and outputs from the top-level actions inside the specified scoped action, such as `For_each`, `Until`, and `Scope`. |
| [trigger](../logic-apps/workflow-definition-language-functions-reference.md#trigger) | Return a trigger's output at runtime, or from other JSON name-and-value pairs. See also [triggerOutputs](#triggerOutputs) and [triggerBody](../logic-apps/workflow-definition-language-functions-reference.md#triggerBody). |
| [triggerBody](../logic-apps/workflow-definition-language-functions-reference.md#triggerBody) | Return a trigger's `body` output at runtime. See [trigger](../logic-apps/workflow-definition-language-functions-reference.md#trigger). |
| [triggerFormDataValue](../logic-apps/workflow-definition-language-functions-reference.md#triggerFormDataValue) | Return a single value matching a key name in *form-data* or *form-encoded* trigger outputs. |
| [triggerMultipartBody](../logic-apps/workflow-definition-language-functions-reference.md#triggerMultipartBody) | Return the body for a specific part in a trigger's multipart output. |
| [triggerFormDataMultiValues](../logic-apps/workflow-definition-language-functions-reference.md#triggerFormDataMultiValues) | Create an array whose values match a key name in *form-data* or *form-encoded* trigger outputs. |
| [triggerOutputs](../logic-apps/workflow-definition-language-functions-reference.md#triggerOutputs) | Return a trigger's output at runtime, or values from other JSON name-and-value pairs. See [trigger](../logic-apps/workflow-definition-language-functions-reference.md#trigger). |
| [variables](../logic-apps/workflow-definition-language-functions-reference.md#variables) | Return the value for a specified variable. |
| [workflow](../logic-apps/workflow-definition-language-functions-reference.md#workflow) | Return all the details about the workflow itself during run time. |
|||

<a name="uri-parsing-functions"></a>

## URI parsing functions

To work with uniform resource identifiers (URIs)
and get various property values for these URIs,
you can use these URI parsing functions.
For the full reference about each function, see the
[alphabetical list](../logic-apps/workflow-definition-language-functions-reference.md#alphabetical-list).

| URI parsing function | Task |
| -------------------- | ---- |
| [uriHost](../logic-apps/workflow-definition-language-functions-reference.md#uriHost) | Return the `host` value for a uniform resource identifier (URI). |
| [uriPath](../logic-apps/workflow-definition-language-functions-reference.md#uriPath) | Return the `path` value for a uniform resource identifier (URI). |
| [uriPathAndQuery](../logic-apps/workflow-definition-language-functions-reference.md#uriPathAndQuery) | Return the `path` and `query` values for a uniform resource identifier (URI). |
| [uriPort](../logic-apps/workflow-definition-language-functions-reference.md#uriPort) | Return the `port` value for a uniform resource identifier (URI). |
| [uriQuery](../logic-apps/workflow-definition-language-functions-reference.md#uriQuery) | Return the `query` value for a uniform resource identifier (URI). |
| [uriScheme](../logic-apps/workflow-definition-language-functions-reference.md#uriScheme) | Return the `scheme` value for a uniform resource identifier (URI). |
|||

<a name="manipulation-functions"></a>

## Manipulation functions: JSON & XML

To work with JSON objects and XML nodes, you can use these manipulation functions.
For the full reference about each function, see the
[alphabetical list](../logic-apps/workflow-definition-language-functions-reference.md#alphabetical-list).

| Manipulation function | Task |
| --------------------- | ---- |
| [addProperty](../logic-apps/workflow-definition-language-functions-reference.md#addProperty) | Add a property and its value, or name-value pair, to a JSON object, and return the updated object. |
| [coalesce](../logic-apps/workflow-definition-language-functions-reference.md#coalesce) | Return the first non-null value from one or more parameters. |
| [removeProperty](../logic-apps/workflow-definition-language-functions-reference.md#removeProperty) | Remove a property from a JSON object and return the updated object. |
| [setProperty](../logic-apps/workflow-definition-language-functions-reference.md#setProperty) | Set the value for a JSON object's property and return the updated object. |
| [xpath](../logic-apps/workflow-definition-language-functions-reference.md#xpath) | Check XML for nodes or values that match an XPath (XML Path Language) expression, and return the matching nodes or values. |
|||

## ---------------------------------

<a name="alphabetical-list"></a>

## All functions - alphabetical list

This section lists all the available functions in alphabetical order.

## A

<a name="action"></a>

### action

Return the *current* action's output at runtime,
or values from other JSON name-and-value pairs,
which you can assign to an expression.
By default, this function references the entire action object,
but you can optionally specify a property whose value you want.
See also [actions()](../logic-apps/workflow-definition-language-functions-reference.md#actions).

You can use the `action()` function only in these places:

* The `unsubscribe` property for a webhook action
so you can access the result from the original `subscribe` request
* The `trackedProperties` property for an action
* The `do-until` loop condition for an action

```
action()
action().outputs.body.<property>
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*property*> | No | String | The name for the action object's property whose value you want: **name**, **startTime**, **endTime**, **inputs**, **outputs**, **status**, **code**, **trackingId**, and **clientTrackingId**. In the Azure portal, you can find these properties by reviewing a specific run history's details. For more information, see [REST API - Workflow Run Actions](/rest/api/logic/workflowrunactions/get). |
|||||

| Return value | Type | Description |
| ------------ | -----| ----------- |
| <*action-output*> | String | The output from the current action or property |
||||

<a name="actionBody"></a>

### actionBody

Return an action's `body` output at runtime.
Shorthand for `actions('<actionName>').outputs.body`.
See [body()](#body) and [actions()](#actions).

```
actionBody('<actionName>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*actionName*> | Yes | String | The name for the action's `body` output that you want |
|||||

| Return value | Type | Description |
| ------------ | -----| ----------- |
| <*action-body-output*> | String | The `body` output from the specified action |
||||

*Example*

This example gets the `body` output from the Twitter action `Get user`:

```
actionBody('Get_user')
```

And returns this result:

```json
"body": {
  "FullName": "Contoso Corporation",
  "Location": "Generic Town, USA",
  "Id": 283541717,
  "UserName": "ContosoInc",
  "FollowersCount": 172,
  "Description": "Leading the way in transforming the digital workplace.",
  "StatusesCount": 93,
  "FriendsCount": 126,
  "FavouritesCount": 46,
  "ProfileImageUrl": "https://pbs.twimg.com/profile_images/908820389907722240/gG9zaHcd_400x400.jpg"
}
```

<a name="actionOutputs"></a>

### actionOutputs

Return an action's output at runtime.  and is shorthand for `actions('<actionName>').outputs`. See [actions()](#actions). The `actionOutputs()` function resolves to `outputs()` in the designer, so consider using [outputs()](#outputs), rather than `actionOutputs()`. Although both functions work the same way, `outputs()` is preferred.

```
actionOutputs('<actionName>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*actionName*> | Yes | String | The name for the action's output that you want |
|||||

| Return value | Type | Description |
| ------------ | -----| ----------- |
| <*output*> | String | The output from the specified action |
||||

*Example*

This example gets the output from the Twitter action `Get user`:

```
actionOutputs('Get_user')
```

And returns this result:

```json
{
  "statusCode": 200,
  "headers": {
    "Pragma": "no-cache",
    "Vary": "Accept-Encoding",
    "x-ms-request-id": "a916ec8f52211265d98159adde2efe0b",
    "X-Content-Type-Options": "nosniff",
    "Timing-Allow-Origin": "*",
    "Cache-Control": "no-cache",
    "Date": "Mon, 09 Apr 2018 18:47:12 GMT",
    "Set-Cookie": "ARRAffinity=b9400932367ab5e3b6802e3d6158afffb12fcde8666715f5a5fbd4142d0f0b7d;Path=/;HttpOnly;Domain=twitter-wus.azconn-wus.p.azurewebsites.net",
    "X-AspNet-Version": "4.0.30319",
    "X-Powered-By": "ASP.NET",
    "Content-Type": "application/json; charset=utf-8",
    "Expires": "-1",
    "Content-Length": "339"
  },
  "body": {
    "FullName": "Contoso Corporation",
    "Location": "Generic Town, USA",
    "Id": 283541717,
    "UserName": "ContosoInc",
    "FollowersCount": 172,
    "Description": "Leading the way in transforming the digital workplace.",
    "StatusesCount": 93,
    "FriendsCount": 126,
    "FavouritesCount": 46,
    "ProfileImageUrl": "https://pbs.twimg.com/profile_images/908820389907722240/gG9zaHcd_400x400.jpg"
  }
}
```

<a name="actions"></a>

### actions

Return an action's output at runtime,
or values from other JSON name-and-value pairs,
which you can assign to an expression. By default,
the function references the entire action object,
but you can optionally specify a property whose value that you want.
For shorthand versions, see [actionBody()](#actionBody),
[actionOutputs()](#actionOutputs), and [body()](#body).
For the current action, see [action()](#action).

> [!TIP]
> The `actions()` function returns output as a string. If you need to work with a returned value as a JSON object, you first need to convert the string value. You can transform the string value into a JSON object using the [Parse JSON action](logic-apps-perform-data-operations.md#parse-json-action).

> [!NOTE]
> Previously, you could use the `actions()` function or
> the `conditions` element when specifying that an action
> ran based on the output from another action. However,
> to declare explicitly dependencies between actions,
> you must now use the dependent action's `runAfter` property.
> To learn more about the `runAfter` property, see
> [Catch and handle failures with the runAfter property](../logic-apps/logic-apps-workflow-definition-language.md).

```
actions('<actionName>')
actions('<actionName>').outputs.body.<property>
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*actionName*> | Yes | String | The name for the action object whose output you want  |
| <*property*> | No | String | The name for the action object's property whose value you want: **name**, **startTime**, **endTime**, **inputs**, **outputs**, **status**, **code**, **trackingId**, and **clientTrackingId**. In the Azure portal, you can find these properties by reviewing a specific run history's details. For more information, see [REST API - Workflow Run Actions](/rest/api/logic/workflowrunactions/get). |
|||||

| Return value | Type | Description |
| ------------ | -----| ----------- |
| <*action-output*> | String | The output from the specified action or property |
||||

*Example*

This example gets the `status` property value
from the Twitter action `Get user` at runtime:

```
actions('Get_user').outputs.body.status
```

And returns this result: `"Succeeded"`

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

Add days to a timestamp.

```
addDays('<timestamp>', <days>, '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*days*> | Yes | Integer | The positive or negative number of days to add |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The timestamp plus the specified number of days  |
||||

*Example 1*

This example adds 10 days to the specified timestamp:

```
addDays('2018-03-15T00:00:00Z', 10)
```

And returns this result: `"2018-03-25T00:00:00.0000000Z"`

*Example 2*

This example subtracts five days from the specified timestamp:

```
addDays('2018-03-15T00:00:00Z', -5)
```

And returns this result: `"2018-03-10T00:00:00.0000000Z"`

<a name="addHours"></a>

### addHours

Add hours to a timestamp.

```
addHours('<timestamp>', <hours>, '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*hours*> | Yes | Integer | The positive or negative number of hours to add |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
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

And returns this result: `"2018-03-15T10:00:00.0000000Z"`

*Example 2*

This example subtracts five hours from the specified timestamp:

```
addHours('2018-03-15T15:00:00Z', -5)
```

And returns this result: `"2018-03-15T10:00:00.0000000Z"`

<a name="addMinutes"></a>

### addMinutes

Add minutes to a timestamp.

```
addMinutes('<timestamp>', <minutes>, '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*minutes*> | Yes | Integer | The positive or negative number of minutes to add |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
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

<a name="addProperty"></a>

### addProperty

Add a property and its value, or name-value pair, to a JSON object,
and return the updated object. If the property already exists at runtime,
the function fails and throws an error.

```
addProperty(<object>, '<property>', <value>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*object*> | Yes | Object | The JSON object where you want to add a property |
| <*property*> | Yes | String | The name for the property to add |
| <*value*> | Yes | Any | The value for the property |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-object*> | Object | The updated JSON object with the specified property |
||||

To add a parent property to an existing property, use the `setProperty()` function, not the `addProperty()` function. Otherwise, the function returns only the child object as output.

```
setProperty(<object>, '<parent-property>', addProperty(<object>['<parent-property>'], '<child-property>', <value>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*object*> | Yes | Object | The JSON object where you want to add a property |
| <*parent-property*> | Yes | String | The name for parent property where you want to add the child property |
| <*child-property*> | Yes | String | The name for the child property to add |
| <*value*> | Yes | Any | The value to set for the specified property |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-object*> | Object | The updated JSON object whose property you set |
||||

*Example 1*

This example adds the `middleName` property to a JSON object, which is converted from a string to JSON by using the [JSON()](#json) function. The object already includes the `firstName` and `surName` properties. The function assigns the specified value to the new property and returns the updated object:

```
addProperty(json('{ "firstName": "Sophia", "lastName": "Owen" }'), 'middleName', 'Anne')
```

Here's the current JSON object:

```json
{
   "firstName": "Sophia",
   "surName": "Owen"
}
```

Here's the updated JSON object:

```json
{
   "firstName": "Sophia",
   "middleName": "Anne",
   "surName": "Owen"
}
```

*Example 2*

This example adds the `middleName` child property to the existing `customerName` property in a JSON object, which is converted from a string to JSON by using the [JSON()](#json) function. The function assigns the specified value to the new property and returns the updated object:

```
setProperty(json('{ "customerName": { "firstName": "Sophia", "surName": "Owen" } }'), 'customerName', addProperty(json('{ "customerName": { "firstName": "Sophia", "surName": "Owen" } }')['customerName'], 'middleName', 'Anne'))
```

Here's the current JSON object:

```json
{
   "customerName": {
      "firstName": "Sophia",
      "surName": "Owen"
   }
}
```

Here's the updated JSON object:

```json
{
   "customerName": {
      "firstName": "Sophia",
      "middleName": "Anne",
      "surName": "Owen"
   }
}
```

<a name="addSeconds"></a>

### addSeconds

Add seconds to a timestamp.

```
addSeconds('<timestamp>', <seconds>, '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*seconds*> | Yes | Integer | The positive or negative number of seconds to add |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
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

Add the specified time units to a timestamp. See also [getFutureTime()](#getFutureTime).

```
addToTime('<timestamp>', <interval>, '<timeUnit>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*interval*> | Yes | Integer | The number of specified time units to add |
| <*timeUnit*> | Yes | String | The unit of time to use with *interval*: "Second", "Minute", "Hour", "Day", "Week", "Month", "Year" |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
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

Check whether all expressions are true.
Return true when all expressions are true,
or return false when at least one expression is false.

```
and(<expression1>, <expression2>, ...)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*expression1*>, <*expression2*>, ... | Yes | Boolean | The expressions to check |
|||||

| Return value | Type | Description |
| ------------ | -----| ----------- |
| true or false | Boolean | Return true when all expressions are true. Return false when at least one expression is false. |
||||

*Example 1*

These examples check whether the specified Boolean values are all true:

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

These examples check whether the specified expressions are all true:

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

## B

<a name="base64"></a>

### base64

Return the base64-encoded version for a string.

> [!NOTE]
> Azure Logic Apps automatically or implicitly performs base64 encoding and decoding, so you don't have to manually perform these conversions by using 
> the encoding and decoding functions. However, if you use these functions anyway, you might experience unexpected rendering behaviors in the designer. 
> These behaviors affect only the functions' visibility and not their effect unless you edit the functions' parameter values, which removes the functions 
> and their effects from your code. For more information, see [Base64 encoding and decoding](#base64-encoding-decoding).

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

> [!NOTE]
> Azure Logic Apps automatically or implicitly performs base64 encoding and decoding, so you don't have to manually perform these conversions by using 
> the encoding and decoding functions. However, if you use these functions anyway in the designer, you might experience unexpected rendering behaviors 
> in the designer. These behaviors affect only the functions' visibility and not their effect unless you edit the functions' parameter values, which removes 
> the functions and their effects from your code. For more information, see [Base64 encoding and decoding](#base64-encoding-decoding).

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

For example, suppose you're using an HTTP action to send a request. You can use `base64ToBinary()` to convert a base64-encoded string to binary data and send that data using the `application/octet-stream` content type in the request.

<a name="base64ToString"></a>

### base64ToString

Return the string version for a base64-encoded string, effectively decoding the base64 string. Use this function rather than [decodeBase64()](#decodeBase64), which is deprecated.

> [!NOTE]
> Azure Logic Apps automatically or implicitly performs base64 encoding and decoding, so you don't have to manually perform these conversions by using 
> the encoding and decoding functions. However, if you use these functions anyway in the designer, you might experience unexpected rendering behaviors 
> in the designer. These behaviors affect only the functions' visibility and not their effect unless you edit the functions' parameter values, which removes 
> the functions and their effects from your code. For more information, see [Base64 encoding and decoding](#base64-encoding-decoding).

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

Return the base64-encoded binary version of a string.

```
binary('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*binary-for-input-value*> | String | The base64-encoded binary version for the specified string |
||||

*Example*

For example, you're using an HTTP action that returns an image or video file. You can use `binary()` to convert the value to a base-64 encoded content envelope model. Then, you can reuse the content envelope in other actions, such as `Compose`.
You can use this function expression to send the string bytes with the `application/octet-stream` content type in the request.

<a name="body"></a>

### body

Return an action's `body` output at runtime. Shorthand for `actions('<actionName>').outputs.body`. See [actionBody()](#actionBody) and [actions()](#actions).

```
body('<actionName>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*actionName*> | Yes | String | The name for the action's `body` output that you want |
|||||

| Return value | Type | Description |
| ------------ | -----| ----------- |
| <*action-body-output*> | String | The `body` output from the specified action |
||||

*Example*

This example gets the `body` output from the `Get user` Twitter action:

```
body('Get_user')
```

And returns this result:

```json
"body": {
    "FullName": "Contoso Corporation",
    "Location": "Generic Town, USA",
    "Id": 283541717,
    "UserName": "ContosoInc",
    "FollowersCount": 172,
    "Description": "Leading the way in transforming the digital workplace.",
    "StatusesCount": 93,
    "FriendsCount": 126,
    "FavouritesCount": 46,
    "ProfileImageUrl": "https://pbs.twimg.com/profile_images/908820389907722240/gG9zaHcd_400x400.jpg"
}
```

<a name="bool"></a>

### bool

Return the Boolean version of a value.

```
bool(<value>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | Any | The value to convert to Boolean. |
|||||

If you're using `bool()` with an object, the value of the object must be a string or integer that can be converted to Boolean.

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| `true` or `false` | Boolean | The Boolean version of the specified value. |
||||

*Outputs*

These examples show the different supported types of input for `bool()`:

| Input value | Type | Return value |
| ----------- | ---------- | ---------------------- |
| `bool(1)` | Integer | `true` |
| `bool(0)` | Integer    | `false` |
| `bool(-1)` | Integer | `true` |
| `bool('true')` | String | `true` |
| `bool('false')` | String | `false` |

## C

<a name="chunk"></a>

### chunk

Split a string or array into chunks of equal length.

```
chunk('<collection>', '<length>')
chunk([<collection>], '<length>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | String or Array | The collection to split |
| <*length*> | Yes | The length of each chunk |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*collection*> | Array | An array of chunks with the specified length |
||||

*Example 1*

This example splits a string into chunks of length 10:

```
chunk('abcdefghijklmnopqrstuvwxyz', 10)
```

And returns this result: `['abcdefghij', 'klmnopqrst', 'uvwxyz']`

*Example 2*

This example splits an array into chunks of length 5.

```
chunk(createArray(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12), 5)
```

And returns this result: `[ [1,2,3,4,5], [6,7,8,9,10], [11,12] ]`

<a name="coalesce"></a>

### coalesce

Return the first non-null value from one or more parameters. Empty strings, empty arrays, and empty objects aren't null.

```
coalesce(<object_1>, <object_2>, ...)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*object_1*>, <*object_2*>, ... | Yes | Any, can mix types | One or more items to check for null |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*first-non-null-item*> | Any | The first item or value that isn't null. If all parameters are null, this function returns null. |
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
| <*text1text2...*> | String | The string created from the combined input strings. <br><br><br><br>**Note**: The length of the result must not exceed 104,857,600 characters. |
||||

> [!NOTE]
> Azure Logic Apps automatically or implicitly performs base64 encoding and decoding, so you don't have to manually 
> perform these conversions when you use the `concat()` function with data that needs encoding or decoding:
>
> * `concat('data:;base64,',<value>)`
> * `concat('data:,',encodeUriComponent(<value>))`
>
> However, if you use this function anyway in the designer, you might experience unexpected rendering behaviors in 
> the designer. These behaviors affect only the function's visibility and not the effect unless you edit the function's 
> parameter values, which removes the function and the effect from your code. For more information, review 
> [Base64 encoding and decoding](#base64-encoding-decoding).

*Example*

This example combines the strings "Hello" and "World":

```
concat('Hello', 'World')
```

And returns this result: `"HelloWorld"`

<a name="contains"></a>

### contains

Check whether a collection has a specific item. Return true when the item is found, or return false when not found. This function is case-sensitive.

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
| <*destinationTimeZone*> | Yes | String | The name for the target time zone. For time zone names, review [Microsoft Windows Default Time Zones](/windows-hardware/manufacture/desktop/default-time-zones). |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*converted-timestamp*> | String | The timestamp converted to the target time zone without the timezone UTC offset. |
||||

*Example 1*

This example converts a timestamp to the specified time zone:

```
convertFromUtc('2018-01-01T08:00:00.0000000Z', 'Pacific Standard Time')
```

And returns this result: `"2018-01-01T00:00:00.0000000"`

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
| <*sourceTimeZone*> | Yes | String | The name for the source time zone. For time zone names, see [Microsoft Windows Default Time Zones](/windows-hardware/manufacture/desktop/default-time-zones), but you might have to remove any punctuation from the time zone name. |
| <*destinationTimeZone*> | Yes | String | The name for the target time zone. For time zone names, see [Microsoft Windows Default Time Zones](/windows-hardware/manufacture/desktop/default-time-zones), but you might have to remove any punctuation from the time zone name. |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
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
| <*sourceTimeZone*> | Yes | String | The name for the source time zone. For time zone names, see [Microsoft Windows Default Time Zones](/windows-hardware/manufacture/desktop/default-time-zones), but you might have to remove any punctuation from the time zone name. |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
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

## D

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

<a name="dateDifference"></a>

### dateDifference

Return the difference between two timestamps as a timespan. This function subtracts `startDate` from `endDate`, and returns the result as timestamp in string format.

```
dateDifference('<startDate>', '<endDate>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*startDate*> | Yes | String | A string that contains a timestamp |
| <*endDate*> | Yes | String | A string that contains a timestamp |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*timespan*> | String | The difference between the two timestamps, which is a timestamp in string format. If `startDate` is more recent than `endDate`, the result is a negative value. |
||||

*Example*

This example subtracts the first value from the second value:

```
dateDifference('2015-02-08', '2018-07-30')
```

And returns this result: `"1268.00:00:00"`

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

And returns this result: `4`

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

<a name="decimal"></a>

### decimal

Returns a decimal number in a string as a decimal number. You can use this function when you're working with data that requires decimal precision and also as input for [logical comparison functions](#logical-comparison-functions) and [math functions](#math-functions). To capture and preserve precision when you use the result from the **decimal()** function, wrap any decimal output with the [string function](#string). This usage is shown in the following examples below where you can lose precision if you use the decimal result as a number.

> [!NOTE]
> The decimal precision that's discussed in the context for this function and the Azure Logic Apps runtime is the same as the [.NET decimal precision](/dotnet/api/system.decimal?view=netframework-4.7.1&preserve-view=true).

```
decimal('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The decimal number in a string |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*decimal*> | Decimal Number | The decimal number for the input string |
||||

*Example 1*

This example creates a decimal that's used as a number:

```
decimal('1.2345678912312131') // Returns 1.234567891231213.
```

*Example 2*

This example creates a decimal and then converts the result to a string for precision preservation:

```
string(decimal('1.2345678912312131')) // Returns "1.2345678912312131".
```

*Example 3*

This example uses a math function on two decimal numbers and uses the result as a number:

```
add(decimal('1.2345678912312131'), decimal('1.2345678912312131')) // Returns 2.469135782462426.
```

*Example 4*

This example uses a math function on two decimal numbers and converts the result to a string for precision preservation:

```
string(add(decimal('1.2345678912312131'), decimal('1.2345678912312131'))) // Returns "2.4691357824624262".
```

<a name="decodeBase64"></a>

### decodeBase64 (deprecated)

This function is deprecated, so use [base64ToString()](#base64ToString) instead.

<a name="decodeDataUri"></a>

### decodeDataUri

Return the binary version for a data uniform resource identifier (URI). Consider using [dataUriToBinary()](#dataUriToBinary), rather than `decodeDataUri()`. Although both functions work the same way, `dataUriToBinary()` is preferred.

> [!NOTE]
> Azure Logic Apps automatically or implicitly performs base64 encoding and decoding, so you don't have to manually perform these conversions by using 
> the encoding and decoding functions. However, if you use these functions anyway in the designer, you might experience unexpected rendering behaviors 
> in the designer. These behaviors affect only the functions' visibility and not their effect unless you edit the functions' parameter values, which removes 
> the functions and their effects from your code. For more information, see [Base64 encoding and decoding](#base64-encoding-decoding).

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
decodeUriComponent('https%3A%2F%2Fcontoso.com')
```

And returns this result: `"https://contoso.com"`

<a name="div"></a>

### div

Return the result from dividing two numbers. To get the remainder result, see [mod()](#mod).

```
div(<dividend>, <divisor>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*dividend*> | Yes | Integer or Float | The number to divide by the *divisor* |
| <*divisor*> | Yes | Integer or Float | The number that divides the *dividend*, but can't be zero |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*quotient-result*> | Integer or Float | The result from dividing the first number by the second number. If either the dividend or divisor has Float type, the result has Float type. <br><br><br><br>**Note**: To convert the float result to an integer, try [creating and calling a function in Azure](../logic-apps/logic-apps-azure-functions.md) from your logic app. |
||||

*Example 1*

Both examples return this value with Integer type: `2`

```
div(10,5)
div(11,5)
```

*Example 2*

Both examples return this value with Float type: `2.2`

```
div(11,5.0)
div(11.0,5)
```

## E

<a name="encodeUriComponent"></a>

### encodeUriComponent

Return a uniform resource identifier (URI) encoded version for a string by replacing URL-unsafe characters with escape characters. Consider using [uriComponent()](#uriComponent), rather than `encodeUriComponent()`. Although both functions work the same way, `uriComponent()` is preferred.

> [!NOTE]
> Azure Logic Apps automatically or implicitly performs base64 encoding and decoding, so you don't have to manually perform these conversions by using 
> the encoding and decoding functions. However, if you use these functions anyway in the designer, you might experience unexpected rendering behaviors 
> in the designer. These behaviors affect only the functions' visibility and not their effect unless you edit the functions' parameter values, which removes 
> the functions and their effects from your code. For more information, see [Base64 encoding and decoding](#base64-encoding-decoding).

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

And returns this result: `"https%3A%2F%2Fcontoso.com"`

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
This function isn't case-sensitive.

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

## F

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

Convert a string version for a floating-point number to an actual floating point number. You can use this function only when passing custom parameters to an app, for example, a logic app workflow or Power Automate flow. To convert floating-point strings represented in locale-specific formats, you can optionally specify an RFC 4646 locale code.

```
float('<value>', '<locale>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string that has a valid floating-point number to convert. The minimum and maximum values are the same as the limits for the float data type. |
| <*locale*> | No | String | The RFC 4646 locale code to use. <br><br>If not specified, default locale is used. <br><br>If *locale* isn't a valid value, an error is generated that the provided locale isn't valid or doesn't have an associated locale. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*float-value*> | Float | The floating-point number for the specified string. The minimum and maximum values are the same as the limits for the float data type. |
||||

*Example 1*

This example creates a string version for this floating-point number:

```
float('10,000.333')
```

And returns this result: `10000.333`

*Example 2*

This example creates a string version for this German-style floating-point number:

```
float('10.000,333', 'de-DE')
```

And returns this result: `10000.333`

<a name="formatDateTime"></a>

### formatDateTime

Return a timestamp in the specified format.

```
formatDateTime('<timestamp>', '<format>'?, '<locale>'?)
```

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
| <*locale*> | No | String | The locale to use. If unspecified, the value is `en-us`. If *locale* isn't a valid value, an error is generated. |
|||||

| Return value | Type | Description |
|--------------|------|-------------|
| <*reformatted-timestamp*> | String | The updated timestamp in the specified format and locale, if specified. |
||||

*Examples*

```
formatDateTime('03/15/2018') // Returns '2018-03-15T00:00:00.0000000'.
formatDateTime('03/15/2018 12:00:00', 'yyyy-MM-ddTHH:mm:ss') // Returns '2018-03-15T12:00:00'.
formatDateTime('01/31/2016', 'dddd MMMM d') // Returns 'Sunday January 31'.
formatDateTime('01/31/2016', 'dddd MMMM d', 'fr-fr') // Returns 'dimanche janvier 31'.
formatDateTime('01/31/2016', 'dddd MMMM d', 'fr-FR') // Returns 'dimanche janvier 31'.
formatDateTime('01/31/2016', 'dddd MMMM d', 'es-es') // Returns 'domingo enero 31'.
```

<a name="formDataMultiValues"></a>

### formDataMultiValues

Return an array with values that match a key name
in an action's *form-data* or *form-encoded* output.

```
formDataMultiValues('<actionName>', '<key>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*actionName*> | Yes | String | The action whose output has the key value you want |
| <*key*> | Yes | String | The name for the key whose value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| [<*array-with-key-values*>] | Array | An array with all the values that match the specified key |
||||

*Example*

This example creates an array from the "Subject" key's value
in the specified action's form-data or form-encoded output:

```
formDataMultiValues('Send_an_email', 'Subject')
```

And returns the subject text in an array, for example: `["Hello world"]`

<a name="formDataValue"></a>

### formDataValue

Return a single value that matches a key name
in an action's *form-data* or *form-encoded* output.
If the function finds more than one match,
the function throws an error.

```
formDataValue('<actionName>', '<key>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*actionName*> | Yes | String | The action whose output has the key value you want |
| <*key*> | Yes | String | The name for the key whose value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*key-value*> | String | The value in the specified key  |
||||

*Example*

This example creates a string from the "Subject" key's value
in the specified action's form-data or form-encoded output:

```
formDataValue('Send_an_email', 'Subject')
```

And returns the subject text as a string, for example: `"Hello world"`

<a name="formatNumber"></a>

### formatNumber

Return a number as a string that's based on the specified format.

```text
formatNumber(<number>, <format>, <locale>?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*number*> | Yes | Integer or Double | The value that you want to format. |
| <*format*> | Yes | String | A composite format string that specifies the format that you want to use. For the supported numeric format strings, see [Standard numeric format strings](/dotnet/standard/base-types/standard-numeric-format-strings), which are supported by `number.ToString(<format>, <locale>)`. |
| <*locale*> | No | String | The locale to use as supported by `number.ToString(<format>, <locale>)`. If unspecified, the value is `en-us`. If *locale* isn't a valid value, an error is generated. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*formatted-number*> | String | The specified number as a string in the format that you specified. You can cast this return value to an `int` or `float`. |
||||

*Example 1*

Suppose that you want to format the number `1234567890`. This example formats that number as the string "1,234,567,890.00".

```
formatNumber(1234567890, '0,0.00', 'en-us')
```

*Example 2"

Suppose that you want to format the number `1234567890`. This example formats the number to the string "1.234.567.890,00".

```
formatNumber(1234567890, '0,0.00', 'is-is')
```

*Example 3*

Suppose that you want to format the number `17.35`. This example formats the number to the string "$17.35".

```
formatNumber(17.35, 'C2')
```

*Example 4*

Suppose that you want to format the number `17.35`. This example formats the number to the string "17,35 kr".

```
formatNumber(17.35, 'C2', 'is-is')
```

## G

<a name="getFutureTime"></a>

### getFutureTime

Return the current timestamp plus the specified time units.

```
getFutureTime(<interval>, <timeUnit>, <format>?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*interval*> | Yes | Integer | The number of time units to add |
| <*timeUnit*> | Yes | String | The unit of time to use with *interval*: "Second", "Minute", "Hour", "Day", "Week", "Month", "Year" |
| <*format*> | No | String | Either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated that the provided format isn't valid and must be a numeric format string. |
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
| <*format*> | No | String | Either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated that the provided format isn't valid and must be a numeric format string. |
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
| <*format*> | No | String | A single [format specifier](/dotnet/api/system.guid.tostring#system_guid_tostring_system_string_) for the returned GUID. By default, the format is "D", but you can use "N", "D", "B", "P", or "X". |
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

## I

<a name="if"></a>

### if

Check whether an expression is true or false. Based on the result, return a specified value. Parameters are evaluated from left to right.

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
This function isn't case-sensitive,
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
| <*index-value*>| Integer | The starting position or index value for the specified substring. <br><br>If the string isn't found, return the number -1. |
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

Convert the string version for an integer to an actual integer number.

```
int('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string version for the integer to convert. The minimum and maximum values are the same as the limits for the integer data type. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*integer-result*> | Integer | The integer version for the specified string. The minimum and maximum values are the same as the limits for the integer data type. |
||||

*Example*

This example creates an integer version for the string "10":

```
int('10')
```

And returns this result: `10`

<a name="isFloat"></a>

### isFloat

Return a boolean indicating whether a string is a floating-point number. By default, this function uses the invariant culture for the floating-point format. To identify floating-point numbers represented in other locale-specific formats, you can optionally specify an RFC 4646 locale code.

```
isFloat('<string>', '<locale>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string to examine |
| <*locale*> | No | String | The RFC 4646 locale code to use |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*boolean-result*> | Boolean | A boolean that indicates whether the string is a floating-point number |

*Example 1*

This example checks whether a string is a floating-point number in the invariant culture:

```
isFloat('10,000.00')
```

And returns this result: `true`

*Example 2*

This example checks whether a string is a floating-point number in the German locale:

```
isFloat('10.000,00', 'de-DE')
```

And returns this result: `true`

<a name="isInt"></a>

### isInt

Return a boolean that indicates whether a string is an integer.

```
isInt('<string>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*string*> | Yes | String | The string to examine |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*boolean-result*> | Boolean | A boolean that indicates whether the string is an integer |

*Example*

This example checks whether a string is an integer:

```
isInt('10')
```

And returns this result: `true`

<a name="item"></a>

### item

When used inside a repeating action over an array,
return the current item in the array during the action's current iteration.
You can also get the values from that item's properties.

```
item()
```

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*current-array-item*> | Any | The current item in the array for the action's current iteration |
||||

*Example*

This example gets the `body` element from the current message for
the "Send_an_email" action inside a for-each loop's current iteration:

```
item().body
```

<a name="items"></a>

### items

Return the current item from each cycle in a for-each loop.
Use this function inside the for-each loop.

```
items('<loopName>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*loopName*> | Yes | String | The name for the for-each loop |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*item*> | Any | The item from the current cycle in the specified for-each loop |
||||

*Example*

This example gets the current item from the specified for-each loop:

```
items('myForEachLoopName')
```

<a name="iterationIndexes"></a>

### iterationIndexes

Return the index value for the current iteration inside an Until loop. You can use this function inside nested Until loops.

```
iterationIndexes('<loopName>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*loopName*> | Yes | String | The name for the Until loop |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*index*> | Integer | The index value for the current iteration inside the specified Until loop |
||||

*Example*

This example creates a counter variable and increments that variable by one during each iteration in an Until loop until the counter value reaches five. The example also creates a variable that tracks the current index for each iteration. During each iteration in the Until loop, the example increments the counter value and then assigns the counter value to the current index value and then increments the counter value. While in the loop, this example references the current iteration index by using the `iterationIndexes` function:

`iterationIndexes('Until_Max_Increment')`

```json
{
   "actions": {
      "Create_counter_variable": {
         "type": "InitializeVariable",
         "inputs": {
            "variables": [ 
               {
                  "name": "myCounter",
                  "type": "Integer",
                  "value": 0
               }
            ]
         },
         "runAfter": {}
      },
      "Create_current_index_variable": {
         "type": "InitializeVariable",
         "inputs": {
            "variables": [
               {
                  "name": "myCurrentLoopIndex",
                  "type": "Integer",
                  "value": 0
               }
            ]
         },
         "runAfter": {
            "Create_counter_variable": [ "Succeeded" ]
         }
      },
      "Until_Max_Increment": {
         "type": "Until",
         "actions": {
            "Assign_current_index_to_counter": {
               "type": "SetVariable",
               "inputs": {
                  "name": "myCurrentLoopIndex",
                  "value": "@variables('myCounter')"
               },
               "runAfter": {
                  "Increment_variable": [ "Succeeded" ]
               }
            },
            "Compose": {
               "inputs": "'Current index: ' @{iterationIndexes('Until_Max_Increment')}",
               "runAfter": {
                  "Assign_current_index_to_counter": [
                     "Succeeded"
                    ]
                },
                "type": "Compose"
            },           
            "Increment_variable": {
               "type": "IncrementVariable",
               "inputs": {
                  "name": "myCounter",
                  "value": 1
               },
               "runAfter": {}
            }
         },
         "expression": "@equals(variables('myCounter'), 5)",
         "limit": {
            "count": 60,
            "timeout": "PT1H"
         },
         "runAfter": {
            "Create_current_index_variable": [ "Succeeded" ]
         }
      }
   }
}
```

## J

<a name="json"></a>

### json

Return the JavaScript Object Notation (JSON) type value, object, or array of objects for a string or XML.

```
json('<value>')
json(xml('value'))
```

> [!IMPORTANT]
> Without an XML schema that defines the output's structure, the function might return results 
> where the structure greatly differs from the expected format, depending on the input.
>
> This behavior makes this function unsuitable for scenarios where the output must conform 
> to a well-defined contract, for example, in critical business systems or solutions.

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String or XML | The string or XML to convert |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*JSON-result*> | JSON native type, object, or array | The JSON native type value, object, or array of objects from the input string or XML. <br><br><br><br>- If you pass in XML that has a single child element in the root element, the function returns a single JSON object for that child element. <br><br> - If you pass in XML that has multiple child elements in the root element, the function returns an array that contains JSON objects for those child elements. <br><br>- If the string is null, the function returns an empty object. |
||||

*Example 1*

This example converts this string into a JSON value:

```
json('[1, 2, 3]')
```

And returns this result: `[1, 2, 3]`

*Example 2*

This example converts this string into JSON:

```
json('{"fullName": "Sophia Owen"}')
```

And returns this result:

```json
{
  "fullName": "Sophia Owen"
}
```

*Example 3*

This example uses the `json()` and `xml()` functions to convert XML that has a single child element in the root element into a JSON object named `person` for that child element:

`json(xml('<?xml version="1.0"?> <root> <person id="1"> <name>Sophia Owen</name> <occupation>Engineer</occupation> </person> </root>'))`

And returns this result:

```json
{
   "?xml": { 
      "@version": "1.0" 
   },
   "root": {
      "person": {
         "@id": "1",
         "name": "Sophia Owen",
         "occupation": "Engineer"
      }
   }
}
```

*Example 4*

This example uses the `json()` and `xml()` functions to convert XML that has multiple child elements in the root element into an array named `person` that contains JSON objects for those child elements:

`json(xml('<?xml version="1.0"?> <root> <person id="1"> <name>Sophia Owen</name> <occupation>Engineer</occupation> </person> <person id="2"> <name>John Doe</name> <occupation>Engineer</occupation> </person> </root>'))`

And returns this result:

```json
{
   "?xml": {
      "@version": "1.0"
   },
   "root": {
      "person": [
         {
            "@id": "1",
            "name": "Sophia Owen",
            "occupation": "Engineer"
         },
         {
            "@id": "2",
            "name": "John Doe",
            "occupation": "Engineer"
         }
      ]
   }
}
```

<a name="intersection"></a>

### intersection

Return a collection that has *only* the common items across the specified collections. To appear in the result, an item must appear in
all the collections passed to this function. If one or more items have the same name, the last item with that name appears in the result.

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
| <*char1*><*delimiter*><*char2*><*delimiter*>... | String | The resulting string created from all the items in the specified array. <br><br><br><br>**Note**: The length of the result must not exceed 104,857,600 characters. |
||||

*Example*

This example creates a string from all the items in this
array with the specified character as the delimiter:

```
join(createArray('a', 'b', 'c'), '.')
```

And returns this result: `"a.b.c"`

## L

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

Return the starting position or index value for the last occurrence of a substring. This function isn't case-sensitive, and indexes start with the number 0.

```
lastIndexOf('<text>', '<searchText>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string that has the substring to find |
| <*searchText*> | Yes | String | The substring to find |
|||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*ending-index-value*> | Integer | The starting position or index value for the last occurrence of the specified substring. |
|||

If the string or substring value is empty, the following behavior occurs:

* If only the string value is empty, the function returns `-1`.

* If the string and substring values are both empty, the function returns `0`.

* If only the substring value is empty, the function returns the string length minus 1.

*Examples*

This example finds the starting index value for the last occurrence of the substring `world` substring in the string `hello world hello world`. The returned result is `18`:

```
lastIndexOf('hello world hello world', 'world')
```

This example is missing the substring parameter, and returns a value of `22` because the value of the input string (`23`) minus 1 is greater than 0.

```
lastIndexOf('hello world hello world', '')
```

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

<a name="listCallbackUrl"></a>

### listCallbackUrl

Return the "callback URL" that calls a trigger or action. This function works only with triggers and actions for the **HttpWebhook** and **ApiConnectionWebhook** connector types, but not the **Manual**, **Recurrence**, **HTTP**, and **APIConnection** types.

```
listCallbackUrl()
```

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*callback-URL*> | String | The callback URL for a trigger or action |
||||

*Example*

This example shows a sample callback URL that this function might return:

`"https://prod-01.westus.logic.azure.com:443/workflows/<*workflow-ID*>/triggers/manual/run?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=<*signature-ID*>"`

## M

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
| <*divisor*> | Yes | Integer or Float | The number that divides the *dividend*, but can't be zero |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*modulo-result*> | Integer or Float | The remainder from dividing the first number by the second number |
||||

*Example 1*

This example divides the first number by the second number:

```
mod(3, 2)
```

And returns this result: `1`
 
*Example 2*

This example shows that if one or both values are negative, the result matches the sign of the dividend:

```
mod(-5, 2)
mod(4, -3)
```

The example returns these results:

* First example: `-1`
* Second example: `1`

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

<a name="multipartBody"></a>

### multipartBody

Return the body for a specific part in an
action's output that has multiple parts.

```
multipartBody('<actionName>', <index>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*actionName*> | Yes | String | The name for the action that has output with multiple parts |
| <*index*> | Yes | Integer | The index value for the part that you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*body*> | String | The body for the specified part |
||||

## N

<a name="not"></a>

### not

Check whether an expression is false.
Return true when the expression is false,
or return false when true.

```
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

```
not(false)
not(true)
```

And return these results:

* First example: The expression is false, so the function returns `true`.
* Second example: The expression is true, so the function returns `false`.

*Example 2*

These examples check whether the specified expressions are false:

```
not(equals(1, 2))
not(equals(1, 1))
```

And return these results:

* First example: The expression is false, so the function returns `true`.
* Second example: The expression is true, so the function returns `false`.

<a name="nthIndexOf"></a>

### nthIndexOf

Return the starting position or index value where the *n*th occurrence of a substring appears in a string.

```
nthIndexOf('<text>', '<searchText>', <occurrence>)
```

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| <*text*> | Yes | String | The string that contains the substring to find |
| <*searchText*> | Yes | String | The substring to find |
| <*occurrence*> | Yes | Integer | A number that specifies the *n*th occurrence of the substring to find. If *occurrence* is negative, start searching from the end. |
|||||

| Return value | Type | Description |
|--------------|------|-------------|
| <*index-value*> | Integer | The starting position or index value for the *n*th occurrence of the specified substring. If the substring isn't found or fewer than *n* occurrences of the substring exist, return `-1`. |
||||

*Examples*

```
nthIndexOf('123456789123465789', '1', 1) // Returns `0`.
nthIndexOf('123456789123465789', '1', 2) // Returns `9`.
nthIndexOf('123456789123465789', '12', 2) // Returns `9`.
nthIndexOf('123456789123465789', '6', 4) // Returns `-1`.
```

## O

<a name="or"></a>

### or

Check whether at least one expression is true. Return true when at least one expression is true, or return false when all are false.

```
or(<expression1>, <expression2>, ...)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*expression1*>, <*expression2*>, ... | Yes | Boolean | The expressions to check |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| true or false | Boolean | Return true when at least one expression is true. Return false when all expressions are false. |
||||

*Example 1*

These examples check whether at least one expression is true:

```
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

<a name="outputs"></a>

### outputs

Return an action's outputs at runtime. Use this function, rather than `actionOutputs()`, which resolves to `outputs()` in the designer. Although both functions work the same way, `outputs()` is preferred.

```
outputs('<actionName>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*actionName*> | Yes | String | The name for the action's output that you want |
|||||

| Return value | Type | Description |
| ------------ | -----| ----------- |
| <*output*> | String | The output from the specified action |
||||

*Example*

This example gets the output from the Twitter action `Get user`:

```
outputs('Get_user')
```

And returns this result:

```json
{
  "statusCode": 200,
  "headers": {
    "Pragma": "no-cache",
    "Vary": "Accept-Encoding",
    "x-ms-request-id": "a916ec8f52211265d98159adde2efe0b",
    "X-Content-Type-Options": "nosniff",
    "Timing-Allow-Origin": "*",
    "Cache-Control": "no-cache",
    "Date": "Mon, 09 Apr 2018 18:47:12 GMT",
    "Set-Cookie": "ARRAffinity=b9400932367ab5e3b6802e3d6158afffb12fcde8666715f5a5fbd4142d0f0b7d;Path=/;HttpOnly;Domain=twitter-wus.azconn-wus.p.azurewebsites.net",
    "X-AspNet-Version": "4.0.30319",
    "X-Powered-By": "ASP.NET",
    "Content-Type": "application/json; charset=utf-8",
    "Expires": "-1",
    "Content-Length": "339"
  },
  "body": {
    "FullName": "Contoso Corporation",
    "Location": "Generic Town, USA",
    "Id": 283541717,
    "UserName": "ContosoInc",
    "FollowersCount": 172,
    "Description": "Leading the way in transforming the digital workplace.",
    "StatusesCount": 93,
    "FriendsCount": 126,
    "FavouritesCount": 46,
    "ProfileImageUrl": "https://pbs.twimg.com/profile_images/908820389907722240/gG9zaHcd_400x400.jpg"
  }
}
```

## P

<a name="parameters"></a>

### parameters

Return the value for a parameter that is described in your workflow definition.

```
parameters('<parameterName>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*parameterName*> | Yes | String | The name for the parameter whose value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*parameter-value*> | Any | The value for the specified parameter |
||||

*Example*

Suppose that you have this JSON value:

```json
{
  "fullName": "Sophia Owen"
}
```

This example gets the value for the specified parameter:

```
parameters('fullName')
```

And returns this result: `"Sophia Owen"`

<a name="parseDateTime"></a>

### parseDateTime

Return the timestamp from a string that contains a timestamp.

```
parseDateTime('<timestamp>', '<locale>'?, '<format>'?)
```

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*locale*> | No | String | The locale to use. <br><br>If not specified, the default locale is `en-us`. <br><br>If *locale* isn't a valid value, an error is generated. |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. If the format isn't specified, attempt parsing with multiple formats that are compatible with the provided locale. If the format isn't a valid value, an error is generated. |
||||

| Return value | Type | Description |
|--------------|------|-------------|
| <*parsed-timestamp*> | String | The parsed timestamp in ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK) format, which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. |
||||

*Examples*

```
parseDateTime('20/10/2014', 'fr-fr') // Returns '2014-10-20T00:00:00.0000000'.
parseDateTime('20 octobre 2010', 'fr-FR') // Returns '2010-10-20T00:00:00.0000000'.
parseDateTime('martes 20 octubre 2020', 'es-es') // Returns '2020-10-20T00:00:00.0000000'.
parseDateTime('21052019', 'fr-fr', 'ddMMyyyy') // Returns '2019-05-21T00:00:00.0000000'.
parseDateTime('10/20/2014 15h', 'en-US', 'MM/dd/yyyy HH\h') // Returns '2014-10-20T15:00:00.0000000'.
```

## R

<a name="rand"></a>

### rand

Return a random integer from a specified range, which is inclusive only at the starting end.

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
| <*count*> | Yes | Integer | The number of integers in the array. The `count` parameter value must be a positive integer that doesn't exceed 100,000. <br><br><br><br>**Note**: The sum of the `startIndex` and `count` values must not exceed 2,147,483,647. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| [<*range-result*>] | Array | The array with integers starting from the specified index |
||||

*Example*

This example creates an integer array that starts from the specified index and has the specified number of integers:

```
range(1, 4)
```

And returns this result: `[1, 2, 3, 4]`

<a name="removeProperty"></a>

### removeProperty

Remove a property from an object and return the updated object. If the property that you try to remove doesn't exist, the function returns the original object.

```
removeProperty(<object>, '<property>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*object*> | Yes | Object | The JSON object from where you want to remove a property |
| <*property*> | Yes | String | The name for the property to remove |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-object*> | Object | The updated JSON object without the specified property |
||||

To remove a child property from an existing property, use this syntax:

```
removeProperty(<object>['<parent-property>'], '<child-property>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*object*> | Yes | Object | The JSON object whose property you want to remove |
| <*parent-property*> | Yes | String | The name for parent property with the child property that you want to remove |
| <*child-property*> | Yes | String | The name for the child property to remove |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-object*> | Object | The updated JSON object whose child property that you removed |
||||

*Example 1*

This example removes the `middleName` property from a JSON object, which is converted from a string to JSON by using the [JSON()](#json) function, and returns the updated object:

```
removeProperty(json('{ "firstName": "Sophia", "middleName": "Anne", "surName": "Owen" }'), 'middleName')
```

Here's the current JSON object:

```json
{
   "firstName": "Sophia",
   "middleName": "Anne",
   "surName": "Owen"
}
```

Here's the updated JSON object:

```json
{
   "firstName": "Sophia",
   "surName": "Owen"
}
```

*Example 2*

This example removes the `middleName` child property from a `customerName` parent property in a JSON object, which is converted from a string to JSON by using the [JSON()](#json) function, and returns the updated object:

```
removeProperty(json('{ "customerName": { "firstName": "Sophia", "middleName": "Anne", "surName": "Owen" } }')['customerName'], 'middleName')
```

Here's the current JSON object:

```json
{
   "customerName": {
      "firstName": "Sophia",
      "middleName": "Anne",
      "surName": "Owen"
   }
}
```

Here's the updated JSON object:

```json
{
   "customerName": {
      "firstName": "Sophia",
      "surName": "Owen"
   }
}
```

<a name="replace"></a>

### replace

Replace a substring with the specified string, and return the result string. This function is case-sensitive.

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
| <*updated-text*> | String | The updated string after replacing the substring <br><br>If the substring isn't found, return the original string. |
||||

*Example*

This example finds the "old" substring in "the old string" and replaces "old" with "new":

```
replace('the old string', 'old', 'new')
```

And returns this result: `"the new string"`

<a name="result"></a>

### result

Return the results from the top-level actions in the specified scoped action, such as a `For_each`, `Until`, or `Scope` action. The `result()` function accepts a single parameter, which is the scope's name, and returns an array that contains information from the first-level actions in that scope. These action objects include the same attributes as the attributes returned by the `actions()` function, such as the action's start time, end time, status, inputs, correlation IDs, and outputs.

> [!NOTE]
> This function returns information *only* from the first-level actions in the scoped action and not from deeper nested actions such as switch or condition actions.

For example, you can use this function to get the results from failed actions so that you can diagnose and handle exceptions. For more information, see [Get context and results for failures](../logic-apps/logic-apps-exception-handling.md#get-results-from-failures).

```
result('<scopedActionName>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*scopedActionName*> | Yes | String | The name of the scoped action where you want the inputs and outputs from the top-level actions inside that scope |
||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*array-object*> | Array object | An array that contains arrays of inputs and outputs from each top-level action inside the specified scope |
||||

*Example*

This example returns the inputs and outputs from each iteration of an HTTP action inside that's in a `For_each` loop by using the `result()` function in the `Compose` action:

```json
{
   "actions": {
      "Compose": {
         "inputs": "@result('For_each')",
         "runAfter": {
            "For_each": [
               "Succeeded"
            ]
         },
         "type": "compose"
      },
      "For_each": {
         "actions": {
            "HTTP": {
               "inputs": {
                  "method": "GET",
                  "uri": "https://httpstat.us/200"
               },
               "runAfter": {},
               "type": "Http"
            }
         },
         "foreach": "@triggerBody()",
         "runAfter": {},
         "type": "Foreach"
      }
   }
}
```

Here's how the example returned array might look where the outer `outputs` object contains the inputs and outputs from each iteration of the actions inside the `For_each` action.

```json
[
   {
      "name": "HTTP",
      "outputs": [
         {
            "name": "HTTP",
            "inputs": {
               "uri": "https://httpstat.us/200",
               "method": "GET"
            },
            "outputs": {
               "statusCode": 200,
               "headers": {
                   "X-AspNetMvc-Version": "5.1",
                   "Access-Control-Allow-Origin": "*",
                   "Cache-Control": "private",
                   "Date": "Tue, 20 Aug 2019 22:15:37 GMT",
                   "Set-Cookie": "ARRAffinity=0285cfbea9f2ee7",
                   "Server": "Microsoft-IIS/10.0",
                   "X-AspNet-Version": "4.0.30319",
                   "X-Powered-By": "ASP.NET",
                   "Content-Length": "0"
               },
               "startTime": "2019-08-20T22:15:37.6919631Z",
               "endTime": "2019-08-20T22:15:37.95762Z",
               "trackingId": "6bad3015-0444-4ccd-a971-cbb0c99a7.....",
               "clientTrackingId": "085863526764.....",
               "code": "OK",
               "status": "Succeeded"
            }
         },
         {
            "name": "HTTP",
            "inputs": {
               "uri": "https://httpstat.us/200",
               "method": "GET"
            },
            "outputs": {
            "statusCode": 200,
               "headers": {
                   "X-AspNetMvc-Version": "5.1",
                   "Access-Control-Allow-Origin": "*",
                   "Cache-Control": "private",
                   "Date": "Tue, 20 Aug 2019 22:15:37 GMT",
                   "Set-Cookie": "ARRAffinity=0285cfbea9f2ee7",
                   "Server": "Microsoft-IIS/10.0",
                   "X-AspNet-Version": "4.0.30319",
                   "X-Powered-By": "ASP.NET",
                   "Content-Length": "0"
               },
               "startTime": "2019-08-20T22:15:37.6919631Z",
               "endTime": "2019-08-20T22:15:37.95762Z",
               "trackingId": "9987e889-981b-41c5-aa27-f3e0e59bf69.....",
               "clientTrackingId": "085863526764.....",
               "code": "OK",
               "status": "Succeeded"
            }
         }
      ]
   }
]
```

<a name="reverse"></a>

### reverse

Reverse the order of items in a collection. When you use this function with [sort()](#sort), you can sort a collection in descending order.

```
reverse([<collection>])
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | Array | The collection to reverse |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| [<*updated-collection*>] | Array | The reversed collection |
||||

*Example*

This example reverses an array of integers:

```
reverse(createArray(0, 1, 2, 3))
```

And returns this array: `[3,2,1,0]`

## S

<a name="setProperty"></a>

### setProperty

Set the value for JSON object's property and return the updated object. If the property that you try to set doesn't exist, the property gets added to the object. To add a new property, use the [addProperty()](#addProperty) function.

```
setProperty(<object>, '<property>', <value>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*object*> | Yes | Object | The JSON object whose property you want to set |
| <*property*> | Yes | String | The name for the existing or new property to set |
| <*value*> | Yes | Any | The value to set for the specified property |
|||||

To set the child property in a child object, use a nested `setProperty()` call instead. Otherwise, the function returns only the child object as output.

```
setProperty(<object>, '<parent-property>', setProperty(<object>['parentProperty'], '<child-property>', <value>))
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*object*> | Yes | Object | The JSON object whose property you want to set |
| <*parent-property*> | Yes | String | The name for parent property with the child property that you want to set |
| <*child-property*> | Yes | String | The name for the child property to set |
| <*value*> | Yes | Any | The value to set for the specified property |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-object*> | Object | The updated JSON object whose property you set |
||||

*Example 1*

This example sets the `surName` property in a JSON object, which is converted from a string to JSON by using the [JSON()](#json) function. The function assigns the specified value to the property and returns the updated object:

```
setProperty(json('{ "firstName": "Sophia", "surName": "Owen" }'), 'surName', 'Hartnett')
```

Here's the current JSON object:

```json
{
   "firstName": "Sophia",
   "surName": "Owen"
}
```

Here's the updated JSON object:

```json
{
   "firstName": "Sophia",
   "surName": "Hartnett"
}
```

*Example 2*

This example sets the `surName` child property for the `customerName` parent property in a JSON object, which is converted from a string to JSON by using the [JSON()](#json) function. The function assigns the specified value to the property and returns the updated object:

```
setProperty(json('{ "customerName": { "firstName": "Sophia", "surName": "Owen" } }'), 'customerName', setProperty(json('{ "customerName": { "firstName": "Sophia", "surName": "Owen" } }')['customerName'], 'surName', 'Hartnett'))
```

Here's the current JSON object:

```json
{
   "customerName": {
      "firstName": "Sophie",
      "surName": "Owen"
   }
}
```

Here's the updated JSON object:

```json
{
   "customerName": {
      "firstName": "Sophie",
      "surName": "Hartnett"
   }
}
```

<a name="skip"></a>

### skip

Remove items from the front of a collection, and return *all the other* items.

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

This example removes one item, the number 0, from the front of the specified array:

```
skip(createArray(0, 1, 2, 3), 1)
```

And returns this array with the remaining items: `[1,2,3]`

<a name="slice"></a>

### slice

Return a substring by specifying the starting and ending position or value.
See also [substring()](#substring).

```
slice('<text>', <startIndex>, <endIndex>?)
```

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| <*text*> | Yes | String | The string that contains the substring to find |
| <*startIndex*> | Yes | Integer | The zero-based starting position or value for where to begin searching for the substring <br><br>- If *startIndex* is greater than the string length, return an empty string. <br><br>- If *startIndex* is negative, start searching at the index value that's the sum of the string length and *startIndex*. |
| <*endIndex*> | No | Integer | The zero-based ending position or value for where to end searching for the substring. The character located at the ending index value isn't included in the search. <br><br>- If *endIndex* isn't specified or greater than the string length, search up to the end of the string. <br><br>- If *endIndex* is negative, end searching at the index value that the sum of the string length and *endIndex*. |
|||||

| Return value | Type | Description |
|--------------|------|-------------|
| <*slice-result*> | String | A new string that contains the found substring |
||||

*Examples*

```
slice('Hello World', 2) // Returns 'llo World'.
slice('Hello World', 30) // Returns ''.
slice('Hello World', 10, 2) // Returns ''.
slice('Hello World', 0) // Returns 'Hello World'.
slice('Hello World', 2, 5) // Returns 'llo'.
slice('Hello World', 6, 20) // Returns 'World'.
slice('Hello World', -2) // Returns 'ld'.
slice('Hello World', 3, -1) // Returns 'lo Worl'.
slice('Hello World', 3, 3) // Returns ''.
```

<a name="sort"></a>

### sort

Sort items in a collection. You can sort the collection objects using any key that contains a simple type.

```
sort([<collection>], <sortBy>?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*collection*> | Yes | Array | The collection with the items to sort |
| <*sortBy*> | No | String | The key to use for sorting the collection objects |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| [<*updated-collection*>] | Array | The sorted collection |
||||

*Example 1*

This example sorts an array of integers:

```
sort(createArray(2, 1, 0, 3))
```

And returns this array: `[0,1,2,3]`

*Example 2*

This example sorts an array of objects by key:

```
sort(createArray(json('{ "first": "Amalie", "last": "Rose" }'), json('{ "first": "Elise", "last": "Renee" }')), 'last')
```

And returns this array: `[{ "first": "Elise", "last": "Renee" }, {"first": "Amalie", "last": "Rose" }')]`

<a name="split"></a>

### split

Return an array that contains substrings, separated by commas, based on the specified delimiter character in the original string.

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

*Example 1*

This example creates an array with substrings from the specified string based on the specified character as the delimiter:

```
split('a_b_c', '_')
```

And returns this array as the result: `["a","b","c"]`

*Example 2*
  
This example creates an array with a single element when no delimiter exists in the string:

```
split('a_b_c', ' ')
```

And returns this array as the result: `["a_b_c"]`

<a name="startOfDay"></a>

### startOfDay

Return the start of the day for a timestamp.

```
startOfDay('<timestamp>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
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
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
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
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*updated-timestamp*> | String | The specified timestamp but starting on the first day of the month at the zero-hour mark |
||||

*Example 1*

This example returns the start of the month for this timestamp:

```
startOfMonth('2018-03-15T13:30:30Z')
```

And returns this result: `"2018-03-01T00:00:00.0000000Z"`

*Example 2*

This example returns the start of the month in the specified format for this timestamp:

```
startOfMonth('2018-03-15T13:30:30Z', 'yyyy-MM-dd')
```

And returns this result: `"2018-03-01"`

<a name="startswith"></a>

### startsWith

Check whether a string starts with a specific substring. Return true when the substring is found, or return false when not found. This function isn't case-sensitive.

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

This example checks whether the "hello world" string starts with the "hello" substring:

```
startsWith('hello world', 'hello')
```

And returns this result: `true`

*Example 2*

This example checks whether the "hello world" string starts with the "greetings" substring:

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
| <*value*> | Yes | Any | The value to convert. If this value is null or evaluates to null, the value is converted to an empty string (`""`) value. <br><br><br><br>For example, if you assign a string variable to a non-existent property, which you can access with the `?` operator, the null value is converted to an empty string. However, comparing a null value isn't the same as comparing an empty string. |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*string-value*> | String | The string version for the specified value. If the *value* parameter is null or evaluates to null, this value is returned as an empty string (`""`) value. |
||||

*Example 1*

This example creates the string version for this number:

```
string(10)
```

And returns this result: `"10"`

*Example 2*

This example creates a string for the specified JSON object and uses the backslash character (\\) as an escape character for the double-quotation mark (").

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

Return characters from a string, starting from the specified position, or index. Index values start with the number 0.
See also [slice()](#slice).

```
substring('<text>', <startIndex>, <length>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*text*> | Yes | String | The string whose characters you want |
| <*startIndex*> | Yes | Integer | A positive number equal to or greater than 0 that you want to use as the starting position or index value |
| <*length*> | No | Integer | A positive number of characters that you want in the substring |
|||||

> [!NOTE]
> Make sure that the sum from adding the *startIndex* and *length* parameter values is less than the length of the string that you provide for the *text* parameter.
> Otherwise, you get an error, unlike similar functions in other languages where the result is the substring from the *startIndex* to the end of the string. 
> The *length* parameter is optional and if not provided, the **substring()** function takes all the characters beginning from *startIndex* to the end of the string.

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*substring-result*> | String | A substring with the specified number of characters, starting at the specified index position in the source string |
||||

*Example*

This example creates a five-character substring from the specified string, starting from the index value 6:

```
substring('hello world', 6, 5)
```

And returns this result: `"world"`

<a name="subtractFromTime"></a>

### subtractFromTime

Subtract a number of time units from a timestamp. See also [getPastTime](#getPastTime).

```
subtractFromTime('<timestamp>', <interval>, '<timeUnit>', '<format>'?)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*timestamp*> | Yes | String | The string that contains the timestamp |
| <*interval*> | Yes | Integer | The number of specified time units to subtract |
| <*timeUnit*> | Yes | String | The unit of time to use with *interval*: "Second", "Minute", "Hour", "Day", "Week", "Month", "Year" |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
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

And returns this result: `"2018-01-01T00:00:00.0000000Z"`

*Example 2*

This example subtracts one day from this timestamp:

```
subtractFromTime('2018-01-02T00:00:00Z', 1, 'Day', 'D')
```

And returns this result using the optional "D" format: `"Monday, January, 1, 2018"`

## T

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

These examples get the specified number of items from the front of these collections:

```
take('abcde', 3)
take(createArray(0, 1, 2, 3, 4), 3)
```

And return these results:

* First example: `"abc"`
* Second example: `[0, 1, 2]`

<a name="ticks"></a>

### ticks

Returns the number of ticks, which are 100-nanosecond intervals, since January 1, 0001 12:00:00 midnight (or DateTime.Ticks in C#) up to the specified timestamp. For more information, see this topic: [DateTime.Ticks Property (System)](/dotnet/api/system.datetime.ticks).

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

Return a string in lowercase format. If a character in the string doesn't have a lowercase version, that character stays unchanged in the returned string.

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

Return a string in uppercase format. If a character in the string doesn't have an uppercase version, that character stays unchanged in the returned string.

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

<a name="trigger"></a>

### trigger

Return a trigger's output at runtime, or values from other JSON name-and-value pairs, which you can assign to an expression.

* Inside a trigger's inputs, this function returns the output from the previous execution.

* Inside a trigger's condition, this function returns the output from the current execution.

By default, the function references the entire trigger object, but you can optionally specify a property whose value that you want.
Also, this function has shorthand versions available, see [triggerOutputs()](#triggerOutputs) and [triggerBody()](#triggerBody).

```
trigger()
```

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*trigger-output*> | String | The output from a trigger at runtime |
||||

<a name="triggerBody"></a>

### triggerBody

Return a trigger's `body` output at runtime. Shorthand for `trigger().outputs.body`. See [trigger()](#trigger).

```
triggerBody()
```

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*trigger-body-output*> | String | The `body` output from the trigger |
||||

<a name="triggerFormDataMultiValues"></a>

### triggerFormDataMultiValues

Return an array with values that match a key name in a trigger's *form-data* or *form-encoded* output.

```
triggerFormDataMultiValues('<key>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*key*> | Yes | String | The name for the key whose value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| [<*array-with-key-values*>] | Array | An array with all the values that match the specified key |
||||

*Example*

This example creates an array from the "feedUrl" key value in an RSS trigger's form-data or form-encoded output:

```
triggerFormDataMultiValues('feedUrl')
```

And returns this array as an example result: `["https://feeds.a.dj.com/rss/RSSMarketsMain.xml"]`

<a name="triggerFormDataValue"></a>

### triggerFormDataValue

Return a string with a single value that matches a key name in a trigger's *form-data* or *form-encoded* output. If the function finds more than one match, the function throws an error.

```
triggerFormDataValue('<key>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*key*> | Yes | String | The name for the key whose value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*key-value*> | String | The value in the specified key |
||||

*Example*

This example creates a string from the "feedUrl" key value in an RSS trigger's form-data or form-encoded output:

```
triggerFormDataValue('feedUrl')
```

And returns this string as an example result: `"https://feeds.a.dj.com/rss/RSSMarketsMain.xml"`

<a name="triggerMultipartBody"></a>

### triggerMultipartBody

Return the body for a specific part in a trigger's output that has multiple parts.

```
triggerMultipartBody(<index>)
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*index*> | Yes | Integer | The index value for the part that you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*body*> | String | The body for the specified part in a trigger's multipart output |
||||

<a name="triggerOutputs"></a>

### triggerOutputs

Return a trigger's output at runtime, or values from other JSON name-and-value pairs. Shorthand for `trigger().outputs`. See [trigger()](#trigger).

```
triggerOutputs()
```

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*trigger-output*> | String | The output from a trigger at runtime  |
||||

<a name="trim"></a>

### trim

Remove leading and trailing whitespace from a string, and return the updated string.

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

This example removes the leading and trailing whitespace from the string " Hello World  ":

```
trim(' Hello World  ')
```

And returns this result: `"Hello World"`

## U

<a name="union"></a>

### union

Return a collection that has *all* the items from the specified collections. To appear in the result, an item can appear in any collection
passed to this function. If one or more items have the same name, the last item with that name appears in the result.

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

Return a uniform resource identifier (URI) encoded version for a string by replacing URL-unsafe characters with escape characters. Use this function rather than [encodeUriComponent()](#encodeUriComponent). Although both functions work the same way, `uriComponent()` is preferred.

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

And returns this result: `"https%3A%2F%2Fcontoso.com"`

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
uriComponentToBinary('https%3A%2F%2Fcontoso.com')
```

And returns this result:

`"001000100110100001110100011101000111000000100101001100
11010000010010010100110010010001100010010100110010010001
10011000110110111101101110011101000110111101110011011011
110010111001100011011011110110110100100010"`

<a name="uriComponentToString"></a>

### uriComponentToString

Return the string version for a uniform resource identifier (URI) encoded string, effectively decoding the URI-encoded string.

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
uriComponentToString('https%3A%2F%2Fcontoso.com')
```

And returns this result: `"https://contoso.com"`

<a name="uriHost"></a>

### uriHost

Return the `host` value for a uniform resource identifier (URI).

```
uriHost('<uri>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*uri*> | Yes | String | The URI whose `host` value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*host-value*> | String | The `host` value for the specified URI |
||||

*Example*

This example finds the `host` value for this URI:

```
uriHost('https://www.localhost.com:8080')
```

And returns this result: `"www.localhost.com"`

<a name="uriPath"></a>

### uriPath

Return the `path` value for a uniform resource identifier (URI).

```
uriPath('<uri>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*uri*> | Yes | String | The URI whose `path` value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*path-value*> | String | The `path` value for the specified URI. If `path` doesn't have a value, return the "/" character. |
||||

*Example*

This example finds the `path` value for this URI:

```
uriPath('https://www.contoso.com/catalog/shownew.htm?date=today')
```

And returns this result: `"/catalog/shownew.htm"`

<a name="uriPathAndQuery"></a>

### uriPathAndQuery

Return the `path` and `query` values for a uniform resource identifier (URI).

```
uriPathAndQuery('<uri>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*uri*> | Yes | String | The URI whose `path` and `query` values you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*path-query-value*> | String | The `path` and `query` values for the specified URI. If `path` doesn't specify a value, return the "/" character. |
||||

*Example*

This example finds the `path` and `query` values for this URI:

```
uriPathAndQuery('https://www.contoso.com/catalog/shownew.htm?date=today')
```

And returns this result: `"/catalog/shownew.htm?date=today"`

<a name="uriPort"></a>

### uriPort

Return the `port` value for a uniform resource identifier (URI).

```
uriPort('<uri>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*uri*> | Yes | String | The URI whose `port` value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*port-value*> | Integer | The `port` value for the specified URI. If `port` doesn't specify a value, return the default port for the protocol. |
||||

*Example*

This example returns the `port` value for this URI:

```
uriPort('https://www.localhost:8080')
```

And returns this result: `8080`

<a name="uriQuery"></a>

### uriQuery

Return the `query` value for a uniform resource identifier (URI).

```
uriQuery('<uri>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*uri*> | Yes | String | The URI whose `query` value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*query-value*> | String | The `query` value for the specified URI |
||||

*Example*

This example returns the `query` value for this URI:

```
uriQuery('https://www.contoso.com/catalog/shownew.htm?date=today')
```

And returns this result: `"?date=today"`

<a name="uriScheme"></a>

### uriScheme

Return the `scheme` value for a uniform resource identifier (URI).

```
uriScheme('<uri>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*uri*> | Yes | String | The URI whose `scheme` value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*scheme-value*> | String | The `scheme` value for the specified URI |
||||

*Example*

This example returns the `scheme` value for this URI:

```
uriScheme('https://www.contoso.com/catalog/shownew.htm?date=today')
```

And returns this result: `"http"`

<a name="utcNow"></a>

### utcNow

Return the current timestamp.

```
utcNow('<format>')
```

Optionally, you can specify a different format with the <*format*> parameter.


| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*format*> | No | String | A numeric format string that is either a [single format specifier](/dotnet/standard/base-types/standard-date-and-time-format-strings) or a [custom format pattern](/dotnet/standard/base-types/custom-date-and-time-format-strings). The default format for the timestamp is ["o"](/dotnet/standard/base-types/standard-date-and-time-format-strings) (yyyy-MM-ddTHH:mm:ss.fffffffK), which complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and preserves time zone information. <br><br>If the format isn't a valid value, an error is generated. |
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

## V

<a name="variables"></a>

### variables

Return the value for a specified variable.

```
variables('<variableName>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*variableName*> | Yes | String | The name for the variable whose value you want |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*variable-value*> | Any | The value for the specified variable |
||||

*Example*

Suppose the current value for a "numItems" variable is 20. This example gets the integer value for this variable:

```
variables('numItems')
```

And returns this result: `20`

## W

<a name="workflow"></a>

### workflow

Return all the details about the workflow itself during run time.

```
workflow().<property>
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*property*> | No | String | The name for the workflow property whose value you want <br><br><br><br>By default, a workflow object has these properties: `name`, `type`, `id`, `location`, `run`, and `tags`. <br><br><br><br>- The `run` property value is a JSON object that includes these properties: `name`, `type`, and `id`. <br><br><br><br>- The `tags` property is a JSON object that includes [tags that are associated with your logic app in Azure Logic Apps or flow in Power Automate](../azure-resource-manager/management/tag-resources.md) and the values for those tags. For more information about tags in Azure resources, review [Tag resources, resource groups, and subscriptions for logical organization in Azure](../azure-resource-manager/management/tag-resources.md). <br><br><br><br>**Note**: By default, a logic app has no tags, but a Power Automate flow has the `flowDisplayName` and `environmentName` tags. |
|||||

*Example 1*

This example returns the name for a workflow's current run:

`workflow().run.name`

*Example 2*

If you use Power Automate, you can create a `@workflow()` expression that uses the `tags` output property to get the values from your flow's `flowDisplayName` or `environmentName` property.

For example, you can send custom email notifications from the flow itself that link back to your flow. These notifications can include an HTML link that contains the flow's display name in the email title and follows this syntax:

`<a href=https://flow.microsoft.com/manage/environments/@{workflow()['tags']['environmentName']}/flows/@{workflow()['name']}/details>Open flow @{workflow()['tags']['flowDisplayName']}</a>`

## X

<a name="xml"></a>

### xml

Return the XML version for a string that contains a JSON object.

```
xml('<value>')
```

| Parameter | Required | Type | Description |
| --------- | -------- | ---- | ----------- |
| <*value*> | Yes | String | The string with the JSON object to convert <br><br>The JSON object must have only one root property, which can't be an array. <br>Use the backslash character (\\) as an escape character for the double quotation mark ("). |
|||||

| Return value | Type | Description |
| ------------ | ---- | ----------- |
| <*xml-version*> | Object | The encoded XML for the specified string or JSON object |
||||

*Example 1*

This example converts the string to XML:

`xml('<name>Sophia Owen</name>')`

And returns this result XML:

```xml
<name>Sophia Owen</name>
```

*Example 2*

This example creates the XML version for this string, which contains a JSON object:

`xml(json('{ "name": "Sophia Owen" }'))`

And returns this result XML:

```xml
<name>Sophia Owen</name>
```

*Example 3*

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

`xml(json('{"person": {"name": "Sophia Owen", "city": "Seattle"}}'))`

And returns this result XML:

```xml
<person>
  <name>Sophia Owen</name>
  <city>Seattle</city>
<person>
```

<a name="xpath"></a>

### xpath

Check XML for nodes or values that match an XPath (XML Path Language) expression, and return the matching nodes or values. An XPath expression, or just "XPath", helps you navigate an XML document structure so that you can select nodes or compute values in the XML content.

> [!NOTE]
> 
> In Consumption and Standard logic apps, all function expressions use the [.NET XPath library](/dotnet/api/system.xml.xpath). 
> XPath expressions are compatible with the underlying .NET library and support only the expression that the underlying .NET library supports.

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
| [<*xml-node1*>, <*xml-node2*>, ...] -or- [<*value1*>, <*value2*>, ...] | Array | An array with XML nodes or values that match the specified XPath expression |
||||

*Example 1*

Suppose that you have this `'items'` XML string: 

```xml
<?xml version="1.0"?>
<produce>
  <item>
    <name>Gala</name>
    <type>apple</type>
    <count>20</count>
  </item>
  <item>
    <name>Honeycrisp</name>
    <type>apple</type>
    <count>10</count>
  </item>
</produce>
```

This example passes in the XPath expression, `'/produce/item/name/text()'`, to find the nodes that match the `<name></name>` node in the `'items'` XML string, and returns an array with those node values:

`xpath(xml(parameters('items')), '/produce/item/name/text()')`

The example also uses the [parameters()](#parameters) function to get the XML string from `'items'` and convert the string to XML format by using the [xml()](#xml) function.

Here's the result array populated with values of the nodes that match `<name></name>`:

`[ Gala, Honeycrisp ]`

*Example 2*

Following on Example 1, this example passes in the XPath expression, `'/produce/item/name[1]'`, to find the first `name` element that is the child of the `item` element.

`xpath(xml(parameters('items')), '/produce/item/name[1]')`

Here's the result: `Gala`

*Example 3*

Following on Example 1, this example pass in the XPath expression, `'/produce/item/name[last()]'`, to find the last `name` element that is the child of the `item` element.

`xpath(xml(parameters('items')), '/produce/item/name[last()]')`

Here's the result: `Honeycrisp`

*Example 4*

In this example, suppose your `items` XML string also contains the attributes, `expired='true'` and `expired='false'`:

```xml
<?xml version="1.0"?>
<produce>
  <item>
    <name expired='true'>Gala</name>
    <type>apple</type>
    <count>20</count>
  </item>
  <item>
    <name expired='false'>Honeycrisp</name>
    <type>apple</type>
    <count>10</count>
  </item>
</produce>
```

This example passes in the XPath expression, `'//name[@expired]'`, to find all the `name` elements that have the `expired` attribute:

`xpath(xml(parameters('items')), '//name[@expired]')`

Here's the result: `[ Gala, Honeycrisp ]`

*Example 5*

In this example, suppose your `items` XML string contains only this attribute, `expired = 'true'`:

```xml
<?xml version="1.0"?>
<produce>
  <item>
    <name expired='true'>Gala</name>
    <type>apple</type>
    <count>20</count>
  </item>
  <item>
    <name>Honeycrisp</name>
    <type>apple</type>
    <count>10</count>
  </item>
</produce>
```

This example passes in the XPath expression, `'//name[@expired = 'true']'`, to find all the `name` elements that have the attribute, `expired = 'true'`:

`xpath(xml(parameters('items')), '//name[@expired = 'true']')`

Here's the result: `[ Gala ]`

*Example 6*

In this example, suppose your `items` XML string also contains these attributes: 

* `expired='true' price='12'`
* `expired='false' price='40'`

```xml
<?xml version="1.0"?>
<produce>
  <item>
    <name expired='true' price='12'>Gala</name>
    <type>apple</type>
    <count>20</count>
  </item>
  <item>
    <name expired='false' price='40'>Honeycrisp</name>
    <type>apple</type>
    <count>10</count>
  </item>
</produce>
```

This example passes in the XPath expression, `'//name[@price>35]'`, to find all the `name` elements that have `price > 35`:

`xpath(xml(parameters('items')), '//name[@price>35]')`

Here's the result: `Honeycrisp`

*Example 7*

In this example, suppose your `items` XML string is the same as in Example 1:

```xml
<?xml version="1.0"?>
<produce>
  <item>
    <name>Gala</name>
    <type>apple</type>
    <count>20</count>
  </item>
  <item>
    <name>Honeycrisp</name>
    <type>apple</type>
    <count>10</count>
  </item>
</produce>
```

This example finds nodes that match the `<count></count>` node and adds those node values with the `sum()` function:

`xpath(xml(parameters('items')), 'sum(/produce/item/count)')`

Here's the result: `30`

*Example 8*

In this example, suppose you have this XML string, which includes the XML document namespace, `xmlns="https://contoso.com"`:

```xml
<?xml version="1.0"?><file xmlns="https://contoso.com"><location>Paris</location></file>
```

These expressions use either XPath expression, `/*[name()="file"]/*[name()="location"]` or `/*[local-name()="file" and namespace-uri()="https://contoso.com"]/*[local-name()="location"]`, to find nodes that match the `<location></location>` node. These examples show the syntax that you use in either the designer or in the expression editor:

* `xpath(xml(body('Http')), '/*[name()="file"]/*[name()="location"]')`
* `xpath(xml(body('Http')), '/*[local-name()="file" and namespace-uri()="https://contoso.com"]/*[local-name()="location"]')`

Here's the result node that matches the `<location></location>` node: 

`<location xmlns="https://contoso.com">Paris</location>`

> [!IMPORTANT]
>
> If you work in code view, escape the double quotation mark (") by using the backslash character (\\). 
> For example, you need to use escape characters when you serialize an expression as a JSON string. 
> However, if you're work in the designer or expression editor, you don't need to escape the 
> double quotation mark because the backslash character is added automatically to the underlying definition, for example:
> 
> * Code view: `xpath(xml(body('Http')), '/*[name()=\"file\"]/*[name()=\"location\"]')`
>
> * Expression editor: `xpath(xml(body('Http')), '/*[name()="file"]/*[name()="location"]')`

*Example 9*

Following on Example 8, this example uses the XPath expression, `'string(/*[name()="file"]/*[name()="location"])'`, to find the value in the `<location></location>` node:

`xpath(xml(body('Http')), 'string(/*[name()="file"]/*[name()="location"])')`

Here's the result: `Paris`

## Next steps

Learn about the [Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md)
