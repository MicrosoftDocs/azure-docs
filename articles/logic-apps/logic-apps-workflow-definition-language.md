---
# required metadata
title: Schema reference for Workflow Definition Language - Azure Logic Apps | Microsoft Docs
description: Write custom workflow definitions for Azure Logic Apps with the Workflow Definition Language
services: logic-apps
ms.service: logic-apps
author: ecfan
ms.author: estfan
manager: jeconnoc
ms.topic: reference
ms.date: 04/30/2018

# optional metadata
ms.reviewer: klam, LADocs
ms.suite: integration
---

# Schema reference for Workflow Definition Language in Azure Logic Apps

When you create a logic app workflow with 
[Azure Logic Apps](../logic-apps/logic-apps-overview.md), 
your workflow's underlying definition describes the actual 
logic that runs for your logic app. This description 
follows a structure that's defined and validated 
by the Workflow Definition Language schema, which uses 
[JavaScript Object Notation (JSON)](https://www.json.org/). 
  
## Workflow definition structure

A workflow definition has at least one trigger that instantiates your logic app, 
plus one or more actions that your logic app runs. 

Here is the high-level structure for a workflow definition:  
  
```json
"definition": {
  "$schema": "<workflow-definition-language-schema-version>",
  "contentVersion": "<workflow-definition-version-number>",
  "parameters": { "<workflow-parameter-definitions>" },
  "triggers": { "<workflow-trigger-definitions>" },
  "actions": { "<workflow-action-definitions>" },
  "outputs": { "<workflow-output-definitions>" }
}
```
  
| Element | Required | Description | 
|---------|----------|-------------| 
| definition | Yes | The starting element for your workflow definition | 
| $schema | Only when externally referencing a workflow definition | The location for the JSON schema file that describes the Workflow Definition Language version, which you can find here: <p>`https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json`</p> |   
| contentVersion | No | The version number for your workflow definition, which is "1.0.0.0" by default. To help identify and confirm the correct definition when deploying a workflow, specify a value to use. | 
| parameters | No | The definitions for one or more parameters that pass data into your workflow <p><p>Maximum parameters: 50 | 
| triggers | No | The definitions for one or more triggers that instantiate your workflow. You can define more than one trigger, but only with the Workflow Definition Language, not visually through the Logic Apps Designer. <p><p>Maximum triggers: 10 | 
| actions | No | The definitions for one or more actions to execute at workflow runtime <p><p>Maximum actions: 250 | 
| outputs | No | The definitions for the outputs that return from a workflow run <p><p>Maximum outputs: 10 |  
|||| 

## Parameters

In the `parameters` section, define all the workflow parameters 
that your logic app uses at deployment for accepting inputs. 
Both parameter declarations and parameter values are required at deployment. 
Before you can use these parameters in other workflow sections, 
make sure that you declare all the parameters in these sections. 

Here is the general structure for a parameter definition:  

```json
"parameters": {
  "<parameter-name>": {
    "type": "<parameter-type>",
    "defaultValue": "<default-parameter-value>",
    "allowedValues": [ <array-with-permitted-parameter-values> ],
    "metadata": { 
      "key": { 
        "name": "<key-value>"
      } 
    }
  }
},
```

| Element | Required | Type | Description |  
|---------|----------|------|-------------|  
| type | Yes | int, float, string, securestring, bool, array, JSON object, secureobject <p><p>**Note**: For all passwords, keys, and secrets, use the `securestring` and `secureobject` types because the `GET` operation doesn't return these types. | The type for the parameter |
| defaultValue | No | Same as `type` | The default parameter value when no value is specified when the workflow instantiates | 
| allowedValues | No | Same as `type` | An array with values that the parameter can accept |  
| metadata | No | JSON object | Any other parameter details, for example, the name or a readable description for your logic app, or design-time data used by Visual Studio or other tools |  
||||

## Triggers and actions  

In a workflow definition, the `triggers` and `actions` sections 
define the calls that happen during your workflow's execution. 
For syntax and more information about these sections, see 
[Workflow triggers and actions](../logic-apps/logic-apps-workflow-actions-triggers.md).
  
## Outputs 

In the `outputs` section, define the data that 
your workflow can return when finished running. 
For example, to track a specific status or value from each run, 
specify that the workflow output returns that data. 

> [!NOTE]
> When responding to incoming requests from a service's REST API, 
> do not use `outputs`. Instead, use the `Response` action type. 
> For more information, see [Workflow triggers and actions](../logic-apps/logic-apps-workflow-actions-triggers.md).

Here is the general structure for an output definition: 

```json
"outputs": {
  "<key-name>": {  
    "type": "<key-type>",  
    "value": "<key-value>"  
  }
} 
```

| Element | Required | Type | Description | 
|---------|----------|------|-------------| 
| <*key-name*> | Yes | String | The key name for the output return value |  
| type | Yes | int, float, string, securestring, bool, array, JSON object | The type for the output return value | 
| value | Yes | Same as `type` | The output return value |  
||||| 

To get the output from a workflow run, 
review the logic app's run history and 
details in the Azure portal or use the 
[Workflow REST API](https://docs.microsoft.com/rest/api/logic/workflows). 
You can also pass output to external systems, for example, 
Power BI so that you can create dashboards. 

<a name="expressions"></a>

## Expressions

With JSON, you can have literal values that exist at design time, for example:

```json
"customerName": "Sophia Owen", 
"rainbowColors": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"], 
"rainbowColorsCount": 7 
```

You can also have values that don't exist until run time. 
To represent these values, you can use *expressions*, 
which are evaluated at run time. An expression is a sequence 
that can contain one or more [functions](#functions), 
[operators](#operators), variables, explicit values, 
or constants. In your workflow definition, 
you can use an expression anywhere in a JSON 
string value by prefixing the expression with the at-sign (\@). 
When evaluating an expression that represents a JSON value, 
the expression body is extracted by removing the \@ character, 
and always results in another JSON value. 

For example, for the previously defined `customerName` property, 
you can get the property value by using the 
[parameters()](../logic-apps/workflow-definition-language-functions-reference.md#parameters) 
function in an expression and assign that value to the `accountName` property:

```json
"customerName": "Sophia Owen", 
"accountName": "@parameters('customerName')"
```

*String interpolation* also lets you use multiple expressions inside 
strings that are wrapped by the \@ character and curly braces ({}). 
Here is the syntax:

```json
@{ "<expression1>", "<expression2>" }
```

The result is always a string, making this capability 
similar to the `concat()` function, for example: 

```json
"customerName": "First name: @{parameters('firstName')} Last name: @{parameters('lastName')}"
```

If you have a literal string that starts with the \@ character, 
prefix the \@ character with another \@ character as an escape character: \@\@

These examples show how expressions are evaluated:

| JSON value | Result |
|------------|--------| 
| "Sophia Owen" | Return these characters: 'Sophia Owen' |
| "array[1]" | Return these characters: 'array[1]' |
| "\@\@" | Return these characters as a one-character string: '\@' |   
| " \@" | Return these characters as a two-character string: ' \@' |
|||

For these examples, suppose you define "myBirthMonth" 
equal to "January" and "myAge" equal to the number 42:  
  
```json
"myBirthMonth": "January",
"myAge": 42
```

These examples show how the following expressions are evaluated:

| JSON expression | Result |
|-----------------|--------| 
| "\@parameters('myBirthMonth')" | Return this string: "January" |  
| "\@{parameters('myBirthMonth')}" | Return this string: "January" |  
| "\@parameters('myAge')" | Return this number: 42 |  
| "\@{parameters('myAge')}" | Return this number as a string: "42" |  
| "My age is \@{parameters('myAge')}" | Return this string: "My age is 42" |  
| "\@concat('My age is ', string(parameters('myAge')))" | Return this string: "My age is 42" |  
| "My age is \@\@{parameters('myAge')}" | Return this string, which includes the expression: "My age is \@{parameters('myAge')}` | 
||| 

When you're working visually in the Logic Apps Designer, 
you can create expressions through the Expression builder, 
for example: 

![Logic Apps Designer > Expression builder](./media/logic-apps-workflow-definition-language/expression-builder.png)

When you're done, the expression appears for the 
corresponding property in your workflow definition, 
for example, the `searchQuery` property here:

```json
"Search_tweets": {
  "inputs": {
    "host": {
      "connection": {
       "name": "@parameters('$connections')['twitter']['connectionId']"
      }
    }
  },
  "method": "get",
  "path": "/searchtweets",
  "queries": {
    "maxResults": 20,
    "searchQuery": "Azure @{concat('firstName','', 'LastName')}"
  }
},
```

<a name="operators"></a>

## Operators

In [expressions](#expressions) and [functions](#functions), 
operators perform specific tasks, such as reference a 
property or a value in an array. 

| Operator | Task | 
|----------|------|
| ' | To use a string literal as input or in expressions and functions, wrap the string only with single quotation marks, for example, `'<myString>'`. Do not use double quotation marks (""), which conflict with the JSON formatting around an entire expression. For example: <p>**Yes**: length('Hello') </br>**No**: length("Hello") <p>When you pass arrays or numbers, you don't need wrapping punctuation. For example: <p>**Yes**: length([1, 2, 3]) </br>**No**: length("[1, 2, 3]") | 
| [] | To reference a value at a specific position (index) in an array, use square brackets. For example, to get the second item in an array: <p>`myArray[1]` | 
| . | To reference a property in an object, use the dot operator. For example, to get the `name` property for a `customer` JSON object: <p>`"@parameters('customer').name"` | 
| ? | To reference null properties in an object without a runtime error, use the question mark operator. For example, to handle null outputs from a trigger, you can use this expression: <p>`@coalesce(trigger().outputs?.body?.<someProperty>, '<property-default-value>')` | 
||| 

<a name="functions"></a>

## Functions

Some expressions get their values from runtime actions 
that might not yet exist when a logic app starts to run. 
To reference or work with these values in expressions, you can use 
[*functions*](../logic-apps/workflow-definition-language-functions-reference.md). 
For example, you can use math functions for calculations, such as the 
[add()](../logic-apps/workflow-definition-language-functions-reference.md#add) function, 
which returns the sum from integers or floats. For detailed information about each function, 
see the [alphabetical reference article](../logic-apps/workflow-definition-language-functions-reference.md).
Or, continue learning about functions and their general purpose.

Here are just a couple example tasks that you can perform with functions: 

| Task | Function syntax | Result | 
| ---- | --------------- | ------ | 
| Return a string in lowercase format. | toLower('<*text*>') <p>For example: toLower('Hello') | "hello" | 
| Return a globally unique identifier (GUID). | guid() |"c2ecc88d-88c8-4096-912c-d6f2e2b138ce" | 
|||| 

This example shows how you can get the value from the `customerName` parameter 
and assign that value to the `accountName` property by using the 
[parameters()](../logic-apps/workflow-definition-language-functions-reference.md#parameters) 
function in an expression:

```json
"accountName": "@parameters('customerName')"
```

Here are some other general ways that you can use functions in expressions:

| Task | Function syntax in an expression | 
| ---- | -------------------------------- | 
| Perform work with an item by passing that item to a function. | "\@<*functionName*>(<*item*>)" | 
| 1. Get the *parameterName*'s value by using the nested `parameters()` function. </br>2. Perform work with the result by passing that value to *functionName*. | "\@<*functionName*>(parameters('<*parameterName*>'))" | 
| 1. Get the result from the nested inner function *functionName*. </br>2. Pass the result to the outer function *functionName2*. | "\@<*functionName2*>(<*functionName*>(<*item*>))" | 
| 1. Get the result from *functionName*. </br>2. Given that the result is an object with property *propertyName*, get that property's value. | "\@<*functionName*>(<*item*>).<*propertyName*>" | 
||| 

For example, the `concat()` function can take two or more string values 
as parameters. This function combines those strings into one string. 
You can either pass in string literals, for example, "Sophia" and "Owen" 
so that you get a combined string, "SophiaOwen":

```json
"customerName": "@concat('Sophia', 'Owen')"
```

Or, you can get string values from parameters. This example 
uses the `parameters()` function in each `concat()` parameter 
and the `firstName` and `lastName` parameters. You then pass 
the resulting strings to the `concat()` function so that 
you get a combined string, for example, "SophiaOwen":

```json
"customerName": "@concat(parameters('firstName'), parameters('lastName'))"
```

Either way, both examples assign the result to the `customerName` property. 

For detailed information about each function, see the 
[alphabetical reference article](../logic-apps/workflow-definition-language-functions-reference.md).
Or, continue learning about functions based on their general purpose.

<a name="string-functions"></a>

### String functions

To work with strings, you can use these string functions 
and also some [collection functions](#collection-functions). 
String functions work only on strings. 

| String function | Task | 
| --------------- | ---- | 
| [concat](../logic-apps/workflow-definition-language-functions-reference.md#concat) | Combine two or more strings, and return the combined string. | 
| [endsWith](../logic-apps/workflow-definition-language-functions-reference.md#endswith) | Check whether a string ends with the specified substring. | 
| [guid](../logic-apps/workflow-definition-language-functions-reference.md#guid) | Generate a globally unique identifier (GUID) as a string. | 
| [indexOf](../logic-apps/workflow-definition-language-functions-reference.md#indexof) | Return the starting position for a substring. | 
| [lastIndexOf](../logic-apps/workflow-definition-language-functions-reference.md#lastindexof) | Return the ending position for a substring. | 
| [replace](../logic-apps/workflow-definition-language-functions-reference.md#replace) | Replace a substring with the specified string, and return the updated string. | 
| [split](../logic-apps/workflow-definition-language-functions-reference.md#split) | Return an array that has all the characters from a string and separates each character with the specific delimiter character. | 
| [startsWith](../logic-apps/workflow-definition-language-functions-reference.md#startswith) | Check whether a string starts with a specific substring. | 
| [substring](../logic-apps/workflow-definition-language-functions-reference.md#substring) | Return characters from a string, starting from the specified position. | 
| [toLower](../logic-apps/workflow-definition-language-functions-reference.md#toLower) | Return a string in lowercase format. | 
| [toUpper](../logic-apps/workflow-definition-language-functions-reference.md#toUpper) | Return a string in uppercase format. | 
| [trim](../logic-apps/workflow-definition-language-functions-reference.md#trim) | Remove leading and trailing whitespace from a string, and return the updated string. | 
||| 

<a name="collection-functions"></a>

### Collection functions

To work with collections, generally arrays, strings, 
and sometimes, dictionaries, you can use these collection functions. 

| Collection function | Task | 
| ------------------- | ---- | 
| [contains](../logic-apps/workflow-definition-language-functions-reference.md#contains) | Check whether a collection has a specific item. |
| [empty](../logic-apps/workflow-definition-language-functions-reference.md#empty) | Check whether a collection is empty. | 
| [first](../logic-apps/workflow-definition-language-functions-reference.md#first) | Return the first item from a collection. | 
| [intersection](../logic-apps/workflow-definition-language-functions-reference.md#intersection) | Return a collection that has *only* the common items across the specified collections. | 
| [join](../logic-apps/workflow-definition-language-functions-reference.md#join) | Return a string that has *all* the items from an array, separated by the specified character. | 
| [last](../logic-apps/workflow-definition-language-functions-reference.md#last) | Return the last item from a collection. | 
| [length](../logic-apps/workflow-definition-language-functions-reference.md#length) | Return the number of items in a string or array. | 
| [skip](../logic-apps/workflow-definition-language-functions-reference.md#skip) | Remove items from the front of a collection, and return *all the other* items. | 
| [take](../logic-apps/workflow-definition-language-functions-reference.md#take) | Return items from the front of a collection. | 
| [union](../logic-apps/workflow-definition-language-functions-reference.md#union) | Return a collection that has *all* the items from the specified collections. | 
||| 

<a name="comparison-functions"></a>

### Comparison functions

To work with conditions, compare values and expression results, 
or evaluate various kinds of logic, you can use these comparison functions. 
For the full reference about each function, see the 
[alphabetical reference article](../logic-apps/workflow-definition-language-functions-reference.md).

| Comparison function | Task | 
| ------------------- | ---- | 
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

### Conversion functions

To change a value's type or format, you can use these conversion functions. 
For example, you can change a value from a Boolean to an integer. 
To learn how Logic Apps handles content types during 
conversion, see [Handle content types](../logic-apps/logic-apps-content-type.md). 
For the full reference about each function, see the 
[alphabetical reference article](../logic-apps/workflow-definition-language-functions-reference.md).

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

<a name="math-functions"></a>

### Math functions

To work with integers and floats, you can use these math functions. 
For the full reference about each function, see the 
[alphabetical reference article](../logic-apps/workflow-definition-language-functions-reference.md).

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

### Date and time functions

To work with dates and times, you can use these date and time functions.
For the full reference about each function, see the 
[alphabetical reference article](../logic-apps/workflow-definition-language-functions-reference.md).

| Date or time function | Task | 
| --------------------- | ---- | 
| [addDays](../logic-apps/workflow-definition-language-functions-reference.md#addDays) | Add a number of days to a timestamp. | 
| [addHours](../logic-apps/workflow-definition-language-functions-reference.md#addHours) | Add a number of hours to a timestamp. | 
| [addMinutes](../logic-apps/workflow-definition-language-functions-reference.md#addMinutes) | Add a number of minutes to a timestamp. | 
| [addSeconds](../logic-apps/workflow-definition-language-functions-reference.md#addSeconds) | Add a number of seconds to a timestamp. |  
| [addToTime](../logic-apps/workflow-definition-language-functions-reference.md#addToTime) | Add a number of time units to a timestamp. See also [getFutureTime](../logic-apps/workflow-definition-language-functions-reference.md#getFutureTime). | 
| [convertFromUtc](../logic-apps/workflow-definition-language-functions-reference.md#convertFromUtc) | Convert a timestamp from Universal Time Coordinated (UTC) to the target time zone. | 
| [convertTimeZone](../logic-apps/workflow-definition-language-functions-reference.md#convertTimeZone) | Convert a timestamp from the source time zone to the target time zone. | 
| [convertToUtc](../logic-apps/workflow-definition-language-functions-reference.md#convertToUtc) | Convert a timestamp from the source time zone to Universal Time Coordinated (UTC). | 
| [dayOfMonth](../logic-apps/workflow-definition-language-functions-reference.md#dayOfMonth) | Return the day of the month component from a timestamp. | 
| [dayOfWeek](../logic-apps/workflow-definition-language-functions-reference.md#dayOfWeek) | Return the day of the week component from a timestamp. | 
| [dayOfYear](../logic-apps/workflow-definition-language-functions-reference.md#dayOfYear) | Return the day of the year component from a timestamp. | 
| [formatDateTime](../logic-apps/workflow-definition-language-functions-reference.md#formatDateTime) | Return the date from a timestamp. | 
| [getFutureTime](../logic-apps/workflow-definition-language-functions-reference.md#getFutureTime) | Return the current timestamp plus the specified time units. See also [addToTime](../logic-apps/workflow-definition-language-functions-reference.md#addToTime). | 
| [getPastTime](../logic-apps/workflow-definition-language-functions-reference.md#getPastTime) | Return the current timestamp minus the specified time units. See also [subtractFromTime](../logic-apps/workflow-definition-language-functions-reference.md#subtractFromTime). | 
| [startOfDay](../logic-apps/workflow-definition-language-functions-reference.md#startOfDay) | Return the start of the day for a timestamp. | 
| [startOfHour](../logic-apps/workflow-definition-language-functions-reference.md#startOfHour) | Return the start of the hour for a timestamp. | 
| [startOfMonth](../logic-apps/workflow-definition-language-functions-reference.md#startOfMonth) | Return the start of the month for a timestamp. | 
| [subtractFromTime](../logic-apps/workflow-definition-language-functions-reference.md#subtractFromTime) | Subtract a number of time units from a timestamp. See also [getPastTime](../logic-apps/workflow-definition-language-functions-reference.md#getPastTime). | 
| [ticks](../logic-apps/workflow-definition-language-functions-reference.md#ticks) | Return the `ticks` property value for a specified timestamp. | 
| [utcNow](../logic-apps/workflow-definition-language-functions-reference.md#utcNow) | Return the current timestamp as a string. | 
||| 

<a name="workflow-functions"></a>

### Workflow functions

These workflow functions can help you:

* Get details about a workflow instance at run time. 
* Work with the inputs used for instantiating logic apps.
* Reference the outputs from triggers and actions.

For example, you can reference the outputs from 
one action and use that data in a later action. 
For the full reference about each function, see the 
[alphabetical reference article](../logic-apps/workflow-definition-language-functions-reference.md).

| Workflow function | Task | 
| ----------------- | ---- | 
| [action](../logic-apps/workflow-definition-language-functions-reference.md#action) | Return the current action's output at runtime, or values from other JSON name-and-value pairs. See also [actions](../logic-apps/workflow-definition-language-functions-reference.md#actions). | 
| [actionBody](../logic-apps/workflow-definition-language-functions-reference.md#actionBody) | Return an action's `body` output at runtime. See also [body](../logic-apps/workflow-definition-language-functions-reference.md#body). | 
| [actionOutputs](../logic-apps/workflow-definition-language-functions-reference.md#actionOutputs) | Return an action's output at runtime. See [actions](../logic-apps/workflow-definition-language-functions-reference.md#actions). | 
| [actions](../logic-apps/workflow-definition-language-functions-reference.md#actions) | Return an action's output at runtime, or values from other JSON name-and-value pairs. See also [action](../logic-apps/workflow-definition-language-functions-reference.md#action).  | 
| [body](#body) | Return an action's `body` output at runtime. See also [actionBody](../logic-apps/workflow-definition-language-functions-reference.md#actionBody). | 
| [formDataMultiValues](../logic-apps/workflow-definition-language-functions-reference.md#formDataMultiValues) | Create an array with the values that match a key name in *form-data* or *form-encoded* action outputs. | 
| [formDataValue](../logic-apps/workflow-definition-language-functions-reference.md#formDataValue) | Return a single value that matches a key name in an action's *form-data* or *form-encoded output*. | 
| [item](../logic-apps/workflow-definition-language-functions-reference.md#item) | When inside a repeating action over an array, return the current item in the array during the action's current iteration. | 
| [items](../logic-apps/workflow-definition-language-functions-reference.md#items) | When inside a for-each or do-until-loop, return the current item from the specified loop.| 
| [listCallbackUrl](../logic-apps/workflow-definition-language-functions-reference.md#listCallbackUrl) | Return the "callback URL" that calls a trigger or action. | 
| [multipartBody](../logic-apps/workflow-definition-language-functions-reference.md#multipartBody) | Return the body for a specific part in an action's output that has multiple parts. | 
| [parameters](../logic-apps/workflow-definition-language-functions-reference.md#parameters) | Return the value for a parameter that is described in your logic app definition. | 
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

### URI parsing functions

To work with uniform resource identifiers (URIs) 
and get various property values for these URIs, 
you can use these URI parsing functions. 
For the full reference about each function, see the 
[alphabetical reference article](../logic-apps/workflow-definition-language-functions-reference.md).

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

### JSON and XML functions

To work with JSON objects and XML nodes, you can use these manipulation functions. 
For the full reference about each function, see the 
[alphabetical reference article](../logic-apps/workflow-definition-language-functions-reference.md).

| Manipulation function | Task | 
| --------------------- | ---- | 
| [addProperty](../logic-apps/workflow-definition-language-functions-reference.md#addProperty) | Add a property and its value, or name-value pair, to a JSON object, and return the updated object. | 
| [coalesce](../logic-apps/workflow-definition-language-functions-reference.md#coalesce) | Return the first non-null value from one or more parameters. | 
| [removeProperty](../logic-apps/workflow-definition-language-functions-reference.md#removeProperty) | Remove a property from a JSON object and return the updated object. | 
| [setProperty](../logic-apps/workflow-definition-language-functions-reference.md#setProperty) | Set the value for a JSON object's property and return the updated object. | 
| [xpath](../logic-apps/workflow-definition-language-functions-reference.md#xpath) | Check XML for nodes or values that match an XPath (XML Path Language) expression, and return the matching nodes or values. | 
||| 

## Next steps

* Learn about [Workflow Definition Language actions and triggers](../logic-apps/logic-apps-workflow-actions-triggers.md)
* Learn about programmatically creating and managing logic apps with the [Workflow REST API](https://docs.microsoft.com/rest/api/logic/workflows)
