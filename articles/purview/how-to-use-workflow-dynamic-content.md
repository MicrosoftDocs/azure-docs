---
title: Workflow dynamic content
description: This article describes how to use dynamic content to create expressions with built-in variables and functions in Microsoft Purview workflows.
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to
ms.date: 03/09/2023
ms.custom: template-how-to
---

# Workflow dynamic content

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

You can use dynamic content inside Microsoft Purview workflows to associate certain variables in the workflow or add other expressions to process these values.

When you add dynamic content to your workflows, you're building expressions from provided building blocks that reference and process information in your workflow so you can get the values you need in real-time.

In the dynamic content menu, the currently available options are:

* [Built-in variables](#built-in-variables) - variables that represent values coming to the workflow from the items that triggered it
* [Expressions](#expressions) - formulas built from functions and variables that can process values in-workflow.

## Built-in variables

Currently, the following variables are available for a workflow connector in Microsoft Purview:

|Prerequisite connector  |Built-in variable  |Functionality  | Type | Possible Values |
|---------|---------|---------|---------|---------|
|When data access request is submitted |Workflow.Requestor |The requestor of the workflow |string||
| |Workflow.Request Recipient |The request recipient of the workflow |string||
| |Asset.Name  |The name of the asset  |string||
| |Asset.Description |The description of the asset |string||
| |Asset.Type	|The type of the asset  |string||
| |Asset.Fully Qualified Name |The fully qualified name of the asset |string||
| |Asset.Owner	|The owner of the asset  |array of strings||
| |Asset.Classification	|The display names of classifications of the asset |array of strings||
| |Asset.Certified	|The indicator of whether the asset meets your organization's quality standards and can be regarded as reliable  |string|'true' or 'false'|
|Start and wait for an approval |Approval.Outcome |The outcome of the approval  |string|'Approved' or 'Rejected'|
| |Approval.Assigned To  |The IDs of the approvers |array of strings||
| |Approval.Comments |The IDs of the approvers and their comments |string||
|Check data source registration for data use governance |Data Use Governance |The result of the data use governance check|string|'true' or 'false'|
|When term creation request is submitted  |Workflow.Requestor |The requestor of the workflow  |string||
| |Term.Name |The name of the term |string||
| |Term.Formal Name  |The formal name of the term |string||
| |Term.Definition	|The definition of the term  |string||
| |Term.Experts	|The experts of the term |array of strings||
| |Term.Stewards |The stewards of the term  |array of strings||
| |Term.Parent.Name	|The name of parent term if exists |string||
| |Term.Parent.Formal Name |The formal name of parent term if exists  |string||
|When term update request is submitted <br> When term deletion request is submitted |	Workflow.Requestor  |The requestor of the workflow  |string||
| |Term.Name |The name of the term  |string||
| |Term.Formal Name	|The formal name of the term |string||
| |Term.Definition	|The definition of the term  |string||
| |Term.Experts	|The experts of the term |array of strings||
| |Term.Stewards	|The stewards of the term  |array of strings||
| |Term.Parent.Name	|The name of parent term if exists |string||
| |Term.Parent.Formal Name	|The formal name of parent term if exists  |string||
| |Term.Created By	|The creator of the term |string||
| |Term.Last Updated By	|The last updater of the term  |string||
|When term import request is submitted	|Workflow.Requestor	|The requestor of the workflow |string||
| |Import File.Name  |The name of the file to import  |string||

## Expressions

Workflow definitions in Microsoft Purview allow you to use functions in your expressions to process values in your workflows.

To find functions [based on their general purpose](#ordered-by-purpose), review the following tables. Or, for detailed information about each function, see the [alphabetical list](#alphabetical-list).

When you're building a workflow and want to add a function to your expressions, follow these steps:

1. Select the value you're going to edit.
1. Select the **Add dynamic content** button that appears underneath the textbox.
1. Select the **Expressions** tab in the dynamic content window and scroll to select your value.
1. Update your expression and select **OK** to add it.

:::image type="content" source="./media/how-to-use-workflow-dynamic-content/use-expressions.png" alt-text="Screenshot showing a workflow text field with Use dynamic content highlighted and the expressions tab shown.":::

### Considerations

* Function parameters are evaluated from left to right.

* Functions that appear inline with plain text require enclosing curly braces ({}) to use the expression's interpolated format instead. This format helps avoid parsing problems. If your function expression doesn't appear inline with plain text, no curly braces are necessary.

  The following example shows the correct and incorrect syntax:

  **Correct**: `"<text>/@{<function-name>('<parameter-name>')}/<text>"`

  **Incorrect**: `"<text>/@<function-name>('<parameter-name>')/<text>"`

  **OK**: `"@<function-name>('<parameter-name>')"`

The following sections organize functions based on their [general purpose](#ordered-by-purpose), or you can browse these functions in [alphabetical order](#alphabetical-list).

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

For more information about workflows, see these articles:

- [Workflows in Microsoft Purview](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)
