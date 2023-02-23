---
title: Workflow expression functions reference for Microsoft Purview.
description: This article outlines how to use expression functions in workflows in Microsoft Purview, and what expressions are available.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to 
ms.date: 02/23/2023
---

# Workflow expression functions reference for Microsoft Purview

Workflow definitions in Microsoft Purview now allow you to use expression functions to process values in your workflows.

For example:



To find functions [based on their general purpose](#ordered-by-purpose), review the following tables. Or, for detailed information about each function, see the [alphabetical list](#alphabetical-list).

## How to use expression functions

When you're building a workflow and want to add an expression function to a value, follow these steps:

1. Select the value you're going to edit.
1. Select the **Add dynamic content** button that will appear underneath the textbox.
1. Select the **Expressions** tab in the dynamic content window and scroll to select your value.

## Considerations for using functions

* Function parameters are evaluated from left to right.

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
| [endsWith](#endswith) | Check whether a string ends with the specified substring. |
| [startsWith](#startswith) | Check whether a string starts with a specific substring. |
|||

<a name="collection-functions"></a>

## Collection functions

To work with collections, generally arrays, strings, and sometimes, dictionaries, you can use these collection functions.

| Collection function | Task |
| ------------------- | ---- |
| [contains](#contains) | Check whether a collection has a specific item. |
|||

<a name="comparison-functions"></a>

## Logical comparison functions

To work with conditions, compare values and expression results, or evaluate various kinds of logic, you can use these logical comparison functions. For the full reference about each function, see the [alphabetical list](../logic-apps/workflow-definition-language-functions-reference.md#alphabetical-list).

> [!NOTE]
> If you use logical functions or conditions to compare values, null values are converted to empty string (`""`) values. The behavior of conditions differs when you compare with an empty string instead of a null value. For more information, see the [string() function](#string).

| Logical comparison function | Task |
| --------------------------- | ---- |
| [equals](#equals) | Check whether both values are equivalent. |
| [greater](#greater) | Check whether the first value is greater than the second value. |
| [greaterOrEquals](#greaterOrEquals) | Check whether the first value is greater than or equal to the second value. |
| [less](#less) | Check whether the first value is less than the second value. |
| [lessOrEquals](#lessOrEquals) | Check whether the first value is less than or equal to the second value. |
|||

## ---------------------------------

<a name="alphabetical-list"></a>

## All functions - alphabetical list

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

## Next steps

- [What are Microsoft Purview workflows](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)