---
title: Workflow Definition Language schema - Azure Logic Apps | Microsoft Docs
description: Define workflows based on the workflow definition schema for Azure Logic Apps
services: logic-apps
author: MandiOhlinger
manager: anneta
editor: ''
documentationcenter: ''

ms.assetid: 26c94308-aa0d-4730-97b6-de848bffff91
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 11/17/2016
ms.author: mandia
translation.priority.mt: 
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---

# Workflow Definition Language schema for Azure Logic Apps

A workflow definition contains the actual logic that executes as a part of your logic app. 
This definition includes one or more triggers that start the logic app, 
and one or more actions for the logic app to take.  
  
## Basic workflow definition structure

Here is the basic structure of a workflow definition:  
  
```json
{
    "$schema": "<schema-of the-definition>",
    "contentVersion": "<version-number-of-definition>",
    "parameters": { <parameter-definitions-of-definition> },
    "triggers": [ { <definition-of-flow-triggers> } ],
    "actions": [ { <definition-of-flow-actions> } ],
    "outputs": { <output-of-definition> }
}
```
  
> [!NOTE]
> The [Workflow Management REST API](https://docs.microsoft.com/rest/api/logic/workflows) 
> documentation has information on how to create and manage logic app workflows.
  
|Element name|Required|Description|  
|------------------|--------------|-----------------|  
|$schema|No|Specifies the location of the JSON schema file that describes the version of the definition language. This schema is required when you reference a definition externally. For this document, the location is `https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2015-08-01-preview/workflowdefinition.json#`|  
|contentVersion|No|Specifies the version of the definition. When deploying a workflow using the definition, this value can be used to make sure that the right definition is being used.|  
|parameters|No|Specifies parameters that are used to input data into the definition. A maximum of 50 parameters can be defined.|  
|triggers|No|Specifies information for the triggers that initiate the workflow. A maximum of 250 triggers can be defined.|  
|actions|No|Specifies actions that are taken as the flow executes. A maximum of 250 actions can be defined.|  
|outputs|No|Specifies information about the deployed resource. A maximum of 10 outputs can be defined.|  
  
## Parameters

This section specifies all the parameters that are used in the workflow definition at deployment time. 
All parameters must be declared in this section before they can be used in other sections of the definition.  
  
The following example shows the structure of a parameter definition:  

```json
"parameters": {
    "<parameter-name>" : {
        "type" : "<type-of-parameter-value>",
        "defaultValue": <default-value-of-parameter>,
        "allowedValues": [ <array-of-allowed-values> ],
        "metadata" : { "key": { "name": "value"} }
    }
}
```

|Element name|Required|Description|  
|------------------|--------------|-----------------|  
|type|Yes|**Type**: string<br /><br /> **Declaration**: `"parameters": {"parameter1": {"type": "string"}`<br /><br /> **Specification**: `"parameters": {"parameter1": {"value": "myparamvalue1"}}`<br /><br /> **Type**: `securestring`<br /><br /> **Declaration**: `"parameters": {"parameter1": {"type": "securestring"}}`<br /><br /> **Specification**: `"parameters": {"parameter1": {"value": "myparamvalue1"}}`<br /><br /> **Type**: int<br /><br /> **Declaration**: `"parameters": {"parameter1": {"type": "int"}}`<br /><br /> **Specification**: `"parameters": {"parameter1": {"value" : 5}}`<br /><br /> **Type**: bool<br /><br /> **Declaration**: `"parameters": {"parameter1": {"type": "array"}}`<br /><br /> **Specification**: `"parameters": {"parameter1": { "value": true }}`<br /><br /> **Type**: array<br /><br /> **Declaration**: `"parameters": {"parameter1": {"type": "array"}}`<br /><br /> **Specification**: `"parameters": {"parameter1": { "value": [ array-of-values ]}}`<br /><br /> **Type**: object<br /><br /> **Declaration**: `"parameters": {"parameter1": {"type": "object"}}`<br /><br /> **Specification**: `"parameters": {"parameter1": { "value": { JSON-object } }}`<br /><br /> **Type**: `secureobject`<br /><br /> **Declaration**: `"parameters": {"parameter1": {"type": "object"}}`<br /><br /> **Specification**: `"parameters": {"parameter1": { "value": { JSON-object } }}` <br /><br />**Note:** The `securestring` and `secureobject` types are not returned in GET operations. All passwords, keys, and secrets should use this type.|  
|defaultValue|No|Specifies the default value for the parameter when no value is specified at the time the resource is created.|  
|allowedValues|No|Specifies an array of allowed values for the parameter.|  
|metadata|No|Specifies additional information about the parameter, such as a readable description or design-time data used by Visual Studio or other tools.|  
  
The following example shows how a parameter could be used in the body section of an action:  
  
```json
"body" :
{
  "property1": "@parameters('parameter1')"
}
```

 Parameters can also be used in outputs.  
  
## Triggers and actions  

Triggers and actions specify the calls that can participate in workflow execution. 
For details about this section, see [Workflow Actions and Triggers](logic-apps-workflow-actions-and-triggers.md).
  
## Outputs  

Outputs specify information that can be returned from a workflow run. 
For example, if you have a specific status or value that you want to track for each run, 
you can include that data in the run outputs. The data appears in the Management REST API for that run, 
and in the management UI for that run in the Azure portal. 
You can also flow these outputs to other external systems like PowerBI for creating dashboards. 
Outputs are *not* used to respond to incoming requests on the Service REST API. 
To respond to an incoming request using the **response** action type, here's an example:
  
```
"outputs": {  
  "key1": {  
    "value": "value1",  
    "type" : "<type-of-value>"  
  }  
} 
```

|Element name|Required|Description|  
|------------------|--------------|-----------------|  
|key1|Yes|Specifies the key identifier for the output. Replace **key1** with a name that you want to use to identify the output.|  
|value|Yes|Specifies the value of the output.|  
|type|Yes|Specifies the type for the value that was specified. Possible types of values are:<br /><br /> - string<br />- 'securestring'<br />- int<br />- bool<br />- array<br />- object|
  
## Expressions  

JSON values in the definition can be literal, 
or they can be expressions that are evaluated when the definition is used. 
For example:  
  
```json
"name": "value"
```

 or  
  
```json
"name": "@parameters('password') "
```

> [!NOTE]
> Some expressions get their values from runtime actions 
> that might not exist at the beginning of the execution. 
> You can use **functions** to help retrieve some of these values.  
  
Expressions can appear anywhere in a JSON string value and always result in another JSON value. 
When a JSON value has been determined to be an expression, 
the body of the expression is extracted by removing the at-sign (@). If a literal string is needed that starts with @, 
that string must be escaped by using @@. The following examples show how expressions are evaluated.  
  
|JSON value|Result|  
|----------------|------------|  
|"parameters"|The characters 'parameters' are returned.|  
|"parameters[1]"|The characters 'parameters[1]' are returned.|  
|"@@"|A 1 character string that contains '@' is returned.|  
|" @"|A 2 character string that contains ' @' is returned.|  
  
With the *string interpolation* feature, expressions can also appear inside strings where expressions are wrapped in `@{ ... }`. 
For example: `"name" : "First Name: @{parameters('firstName')} Last Name: @{parameters('lastName'}"`  

The result is always a string, which makes this feature similar to the `concat` function. 
Suppose you defined `myNumber` as `42` and `myString` as `sampleString`:  
  
|JSON value|Result|  
|----------------|------------|  
|"@parameters('myString')"|Returns `sampleString` as a string.|  
|"@{parameters('myString')}"|Returns `sampleString` as a string.|  
|"@parameters('myNumber')"|Returns `42` as a *number*.|  
|"@{parameters('myNumber')}"|Returns `42` as a *string*.|  
|"Answer is: @{parameters('myNumber')}"|Returns the string `Answer is: 42`.|  
|"@concat('Answer is: ',string(parameters('myNumber')))"|Returns the string `Answer is: 42`|  
|"Answer is: @@{parameters('myNumber')}"|Returns the string `Answer is: @{parameters('myNumber')}`.|  
  
## Operators  

Operators are the characters that you can use inside expressions or functions. 
  
|Operator|Description|  
|--------------|-----------------|  
|.|The dot operator allows you to reference properties of an object|  
|?|The question mark operator allows you to reference null properties of an object without a runtime error. For example, if you use this expression to handle a null trigger outputs: `@coalesce(trigger().outputs?.body?.property1, 'my default value')`|  
|'|The single quotation mark is the only way to wrap string literals. You cannot use double-quotes inside expressions because this punctuation conflicts with the JSON quote that wraps the whole expression.|  
|[]|The square brackets can be used to get a value from an array with a specific index. For example, if you have an action with `range(0,10)` passed in to the `forEach` function, you can use this function to get items out of arrays:  `myArray[item()]`|  
  
## Functions  

You can also call functions within expressions. The following table shows the functions that can be used in an expression.  
  
|Expression|Evaluation|  
|----------------|----------------|  
|`"@function('Hello')"`|Calls the function member of the definition with the literal string Hello as the first parameter.|  
|`"@function('It's Cool!')"`|Calls the function member of the definition with the literal string 'It's Cool!' as the first parameter|  
|`"@function().prop1"`|Returns the value of the prop1 property of the `myfunction` member of the definition.|  
|`"@function('Hello').prop1"`|Calls the function member of the definition with the literal string 'Hello' as the first parameter and returns the prop1 property of the object.|  
|`"@function(parameters('Hello'))"`|Evaluates the Hello parameter and passes the value to function|  
  
### Referencing functions  

You can use these functions to reference outputs from other actions in the logic app or values passed in when the logic app was created. For example, you can reference the data from one step to use it in another.  
  
|Function name|Description|  
|-------------------|-----------------|  
|parameters|Returns a parameter value that is defined in the definition.  `parameters('password')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Parameter<br /><br /> **Description**: Required. The name of the parameter whose values you want.|  
|action|Enables an expression to derive its value from other JSON name and value pairs or the output of the current runtime action. The property represented by propertyPath in the following example is optional. If propertyPath is not specified, the reference is to the whole action object. This function can only be used inside do-until conditions of an action.  <br /><br />`action().outputs.body.propertyPath`|  
|actions|Enables an expression to derive its value from other JSON name and value pairs or the output of the runtime action. These expressions explicitly declare that one action depends on another action. The property represented by propertyPath in the following example is optional. If propertyPath is not specified, the reference is to the whole action object. You can use either this element or the conditions element to specify dependencies, but you do not need to use both for the same dependent resource. <br /><br />`actions('myAction').outputs.body.propertyPath`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Action name<br /><br /> **Description**: Required. The name of the action whose values you want.|  
|trigger|Enables an expression to derive its value from other JSON name and value pairs or the output of the runtime trigger. The property represented by propertyPath in the following example is optional. If propertyPath is not specified, the reference is to the whole trigger object.<br /><br /> `trigger().outputs.body.propertyPath`<br /><br /> When used inside a trigger's inputs, the function returns the outputs of the previous execution. However, when used inside a trigger's condition, the `trigger` function returns the outputs of the current execution.|  
|actionOutputs|This function is a shorthand for `actions('actionName').outputs`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Action name<br /><br /> **Description**: Required. The name of the action whose values you want.|  
|actionBody and body|These functions are shorthand for `actions('actionName').outputs.body`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Action name<br /><br /> **Description**: Required. The name of the action whose values you want.|  
|triggerOutputs|This function is a shorthand for `trigger().outputs`|  
|triggerBody|This function is a shorthand for `trigger().outputs.body`|  
|item|When used inside a repeating action, this function returns the item that is in the array for this iteration of the action. For example, if you have an action that runs for each item an array of messages, you can use this syntax:<br /><br /> `"input1" : "@item().subject"`|  
  
### Collection functions  

These functions operate over collections and generally apply to Arrays, Strings, and sometimes Dictionaries.  
  
|Function name|Description|  
|-------------------|-----------------|  
|contains|Returns true if dictionary contains a key, list contains value, or string contains substring. For example, this function returns `true:``contains('abacaba','aca')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Within collection<br /><br /> **Description**: Required. The collection to search within.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Find object<br /><br /> **Description**: Required. The object to find inside the **Within collection**.|  
|length|Returns the number of elements in an array or string. For example, this function returns `3`:  `length('abc')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to get the length of.|  
|empty|Returns true if object, array, or string is empty. For example, this function returns `true`:<br /><br /> `empty('')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to check if it is empty.|  
|intersection|Returns a single array or object with the common elements between the arrays or objects passed to this function. For example, this function returns `[1, 2]`:<br /><br /> `intersection([1, 2, 3], [101, 2, 1, 10],[6, 8, 1, 2])`<br /><br /> The parameters for the function can either be a set of objects or a set of arrays (not a mixture thereof). If there are two objects with the same name, the last object with that name appears in the final object.<br /><br /> **Parameter number**: 1 ... *n*<br /><br /> **Name**: Collection *n*<br /><br /> **Description**: Required. The collections to evaluate. An object must be in all collections passed in to appear in the result.|  
|union|Returns a single array or object with all the elements that are in either array or object passed to this function. For example, this function returns `[1, 2, 3, 10, 101]:`<br /><br /> :  `union([1, 2, 3], [101, 2, 1, 10])`<br /><br /> The parameters for the function can either be a set of objects or a set of arrays (not a mixture thereof). If there are two objects with the same name in the final output, the last object with that name appears in the final object.<br /><br /> **Parameter number**: 1 ... *n*<br /><br /> **Name**: Collection *n*<br /><br /> **Description**: Required. The collections to evaluate. An object that appears in any of the collections also appears in the result.|  
|first|Returns the first element in the array or string passed in. For example, this function returns `0`:<br /><br /> `first([0,2,3])`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to take the first object from.|  
|last|Returns the last element in the array or string passed in. For example, this function returns `3`:<br /><br /> `last('0123')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to take the last object from.|  
|take|Returns the first **Count** elements from the array or string passed in. For example, this function returns `[1, 2]`:  `take([1, 2, 3, 4], 2)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to take the first **Count** objects from.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Count<br /><br /> **Description**: Required. The number of objects to take from the **Collection**. Must be a positive integer.|  
|skip|Returns the elements in the array starting at index **Count**. For example, this function returns `[3, 4]`:<br /><br /> `skip([1, 2 ,3 ,4], 2)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to skip the first **Count** objects from.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Count<br /><br /> **Description**: Required. The number of objects to remove from the front of **Collection**. Must be a positive integer.|  
  
### String functions

The following functions only apply to strings. You can also use some collection functions on strings.  
  
|Function name|Description|  
|-------------------|-----------------|  
|concat|Combines any number of strings together. For example, if parameter 1 is `p1,` this function returns:<br /><br /> `somevalue-p1-somevalue`: `concat('somevalue-',parameters('parameter1'),'-somevalue')`<br /><br /> **Parameter number**: 1 ... *n*<br /><br /> **Name**: String *n*<br /><br /> **Description**: Required. The strings to combine into a single string.|  
|substring|Returns a subset of characters from a string. For example, this function:<br /><br /> `substring('somevalue-p1-somevalue',10,3)`<br /><br /> returns:<br /><br /> `p1`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string from which the substring is taken.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Start index<br /><br /> **Description**: Required. The index of where the substring begins in parameter 1.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: Length<br /><br /> **Description**: Required. The length of the substring.|  
|replace|Replaces a string with a given string. For example, this function:<br /><br /> `replace('the old string', 'old', 'new')`<br /><br /> returns:<br /><br /> `the new string`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: string<br /><br /> **Description**: Required. The string that is searched for parameter 2 and updated with parameter 3, when parameter 2 is found in parameter 1.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Old string<br /><br /> **Description**: Required. The string to replace with parameter 3, when a match is found in parameter 1<br /><br /> **Parameter number**: 3<br /><br /> **Name**: New string<br /><br /> **Description**: Required. The string that is used to replace the string in parameter 2, if a match is found in parameter 1.|  
|guid|This function generates a globally unique string (aka. guid). For example, this guid could be generated `c2ecc88d-88c8-4096-912c-d6f2e2b138ce`:<br /><br /> `guid()`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. A single format specifier that indicates [how to format the value of this Guid](https://msdn.microsoft.com/library/97af8hh4%28v=vs.110%29.aspx). The format parameter can be "N", "D", "B", "P", or "X". If format is not provided, "D" is used.|  
|toLower|Converts a string to lowercase. For example, this function returns `two by two is four`: `toLower('Two by Two is Four')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string to convert to lower casing. If a character in the string does not have a lowercase equivalent, the character is included unchanged in the returned string.|  
|toUpper|Converts a string to uppercase. For example, this function returns `TWO BY TWO IS FOUR`: `toUpper('Two by Two is Four')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string to convert to upper casing. If a character in the string does not have an uppercase equivalent, the character is included unchanged in the returned string.|  
|indexof|Find the index of a value within a string case insensitively. For example, this function returns `7`: `indexof('hello, world.', 'world')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that may contain the value.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: String<br /><br /> **Description**: Required. The value to search the index of.|  
|lastindexof|Find the last index of a value within a string case insensitively. For example, this function returns `3`: `lastindexof('foofoo', 'foo')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that may contain the value.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: String<br /><br /> **Description**: Required. The value to search the index of.|  
|startswith|Checks if the string starts with a value case insensitively. For example, this function returns `true`: `lastindexof('hello, world', 'hello')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that may contain the value.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: String<br /><br /> **Description**: Required. The value the string may start with.|  
|endswith|Checks if the string ends with a value case insensitively. For example, this function returns `true`: `lastindexof('hello, world', 'world')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that may contain the value.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: String<br /><br /> **Description**: Required. The value the string may end with.|  
|split|Splits the string using a separator. For example, this function returns `["a", "b", "c"]`: `split('a;b;c',';')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that is split.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: String<br /><br /> **Description**: Required. The separator.|  
  
### Logical functions  

These functions are useful inside conditions and can be used to evaluate any type of logic.  
  
|Function name|Description|  
|-------------------|-----------------|  
|equals|Returns true if two values are equal. For example, if parameter1 is someValue, this function returns `true`: `equals(parameters('parameter1'), 'someValue')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Object 1<br /><br /> **Description**: Required. The object to compare to **Object 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Object 2<br /><br /> **Description**: Required. The object to compare to **Object 1**.|  
|less|Returns true if the first argument is less than the second. Note, values can only be of type integer, float, or string. For example, this function returns `true`:  `less(10,100)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Object 1<br /><br /> **Description**: Required. The object to check if it is less than **Object 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Object 2<br /><br /> **Description**: Required. The object to check if it is greater than **Object 1**.|  
|lessOrEquals|Returns true if the first argument is less than or equal to the second. Note, values can only be of type integer, float, or string. For example, this function returns `true`:  `lessOrEquals(10,10)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Object 1<br /><br /> **Description**: Required. The object to check if it is less or equal to **Object 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Object 2<br /><br /> **Description**: Required. The object to check if it is greater than or equal to **Object 1**.|  
|greater|Returns true if the first argument is greater than the second. Note, values can only be of type integer, float, or string. For example, this function returns `false`:  `greater(10,10)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Object 1<br /><br /> **Description**: Required. The object to check if it is greater than **Object 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Object 2<br /><br /> **Description**: Required. The object to check if it is less than **Object 1**.|  
|greaterOrEquals|Returns true if the first argument is greater than or equal to the second. Note, values can only be of type integer, float, or string. For example, this function returns `false`:  `greaterOrEquals(10,100)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Object 1<br /><br /> **Description**: Required. The object to check if it is greater than or equal to **Object 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Object 2<br /><br /> **Description**: Required. The object to check if it is less than or equal to **Object 1**.|  
|and|Returns true if both parameters are true. Both arguments need to be Booleans. For example, this function returns `false`: `and(greater(1,10),equals(0,0))`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Boolean 1<br /><br /> **Description**: Required. The first argument that must be `true`.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Boolean 2<br /><br /> **Description**: Required. The second argument must be `true`.|  
|or|Returns true if either parameter is true. Both arguments need to be Booleans. For example, this function returns `true`: `or(greater(1,10),equals(0,0))`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Boolean 1<br /><br /> **Description**: Required. The first argument that may be `true`.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Boolean 2<br /><br /> **Description**: Required. The second argument may be `true`.|  
|not|Returns true if the parameters is `false`. Both arguments need to be Booleans. For example, this function returns `true`: `not(contains('200 Success','Fail'))`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Boolean<br /><br /> **Description**: Returns true if the parameters is `false`. Both arguments need to be Booleans. The following returns `true`:  `not(contains('200 Success','Fail'))`|  
|if|Returns a specified value based on whether the expression resulted in `true` or `false`.  For example, this function returns `"yes"`: `if(equals(1, 1), 'yes', 'no')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Expression<br /><br /> **Description**: Required. A boolean value that determines which value the expression should return.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: True<br /><br /> **Description**: Required. The value to return if the expression is `true`.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: False<br /><br /> **Description**: Required. The value to return if the expression is `false`.|  
  
### Conversion functions  

These functions are used to convert between each of the native types in the language:  
  
- string  
  
- integer  
  
- float  
  
- boolean  
  
- arrays  
  
- dictionaries  
  
|Function name|Description|  
|-------------------|-----------------|  
|int|Convert the parameter to an integer. For example, this function returns 100 as a number, rather than a string:  `int('100')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to an integer.|  
|string|Convert the parameter to a string. For example, this function returns `'10'`:  `string(10)` You can also convert an object to a string. For example, if the **p1** parameter is an object with one property **bar : baz**, then the following would return `{"bar" : "baz"}` `string(parameters('p1'))`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to a string.|  
|json|Convert the parameter to a JSON type value. It is the opposite of string(). For example, this function returns `[1,2,3]` as an array, rather than a string:<br /><br /> `parse('[1,2,3]')`<br /><br /> Likewise, you can convert a string to an object. For example, `json('{"bar" : "baz"}')` returns:<br /><br /> `{ "bar" : "baz" }`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that is converted to a native type value.<br /><br /> The json function supports xml input as well. For example, the parameter value of:<br /><br /> `<?xml version="1.0"?> <root>   <person id='1'>     <name>Alan</name>     <occupation>Engineer</occupation>   </person> </root>`<br /><br /> is converted to the following json:<br /><br /> `{ "?xml": { "@version": "1.0" },   "root": {     "person": [     {       "@id": "1",       "name": "Alan",       "occupation": "Engineer"     }   ]   } }`|  
|float|Convert the parameter argument to a floating-point number. For example, this function returns `10.333`: `float('10.333')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to a floating-point number.|  
|bool|Convert the parameter to a Boolean. For example, this function returns `false`:  `bool(0)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to a boolean.|  
|coalesce|Returns the first non-null object in the arguments passed in. Note: an empty string is not null. For example, if parameters 1 and 2 are not defined, this function returns `fallback`:  `coalesce(parameters('parameter1'), parameters('parameter2') ,'fallback')`<br /><br /> **Parameter number**: 1 ... *n*<br /><br /> **Name**: Object*n*<br /><br /> **Description**: Required. The objects to check for `null`.|  
|base64|Returns the base64 representation of the input string. For example, this function returns `c29tZSBzdHJpbmc=`: `base64('some string')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String 1<br /><br /> **Description**: Required. The string to encode into base64 representation.|  
|base64ToBinary|Returns a binary representation of a base64 encoded string. For example, this function returns the binary representation of some string: base64ToBinary('c29tZSBzdHJpbmc=').<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The base64 encoded string.|  
|base64ToString|Returns a string representation of a based64 encoded string. For example, this function returns some string: `base64ToString('c29tZSBzdHJpbmc=')`.<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The base64 encoded string.|  
|Binary|Returns a binary representation of a value.  For example, this function returns a binary representation of some string: `binary(‘some string’).`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to binary.|  
|dataUriToBinary|Returns a binary representation of a data URI. For example, this function returns the binary representation of some string: `dataUriToBinary('data:;base64,c29tZSBzdHJpbmc=')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The data URI to convert to binary representation.|  
|dataUriToString|Returns a string representation of a data URI. For example, this function returns some string: `dataUriToString('data:;base64,c29tZSBzdHJpbmc=')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br />**Description**: Required. The data URI to convert to String representation.|  
|dataUri|Returns a data URI of a value. For example, this function returns data: `text/plain;charset=utf8;base64,c29tZSBzdHJpbmc=: dataUri('some string')`<br /><br /> **Parameter number**: 1<br /><br />**Name**: Value<br /><br />**Description**: Required. The value to convert to data URI.|  
|decodeBase64|Returns a string representation of an input based64 string. For example, this function returns `some string`: `decodeBase64('c29tZSBzdHJpbmc=')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Returns a string representation of an input based64 string.|  
|encodeUriComponent|URL-escapes the string that's passed in. For example, this function returns `You+Are%3ACool%2FAwesome`: `encodeUriComponent('You Are:Cool/Awesome')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string to escape URL-unsafe characters from.|  
|decodeUriComponent|Un-URL-escapes the string that's passed in. For example, this function returns `You Are:Cool/Awesome`: `encodeUriComponent('You+Are%3ACool%2FAwesome')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string to decode the URL-unsafe characters from.|  
|decodeDataUri|Returns a binary representation of an input data URI string. For example, this function returns the binary representation of `some string`:  `decodeDataUri('data:;base64,c29tZSBzdHJpbmc=')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The dataURI to decode into a binary representation.|  
|uriComponent|Returns a URI encoded representation of a value. For example, this function returns `You+Are%3ACool%2FAwesome: uriComponent('You Are:Cool/Awesome')`<br /><br /> Parameter Details: Number: 1, Name: String, Description: Required. The string to be URI encoded.|  
|uriComponentToBinary|Returns a binary representation of a URI encoded string. For example, this function returns a binary representation of `You Are:Cool/Awesome`: `uriComponentToBinary('You+Are%3ACool%2FAwesome')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br />**Description**: Required. The URI encoded string.|  
|uriComponentToString|Returns a string representation of a URI encoded string. For example, this function returns `You Are:Cool/Awesome`: `uriComponentToBinary('You+Are%3ACool%2FAwesome')`<br /><br /> **Parameter number**: 1<br /><br />**Name**: String<br /><br />**Description**: Required. The URI encoded string.|  
|xml|Return an xml representation of the value. For example, this function returns an xml content represented by `'\<name>Alan\</name>'`: `xml('\<name>Alan\</name>')`. The xml function supports JSON object input as well. For example, the parameter `{ "abc": "xyz" }` is converted to an xml content `\<abc>xyz\</abc>`<br /><br /> **Parameter number**: 1<br /><br />**Name**: Value<br /><br />**Description**: Required. The value to convert to XML.|  
|xpath|Return an array of xml nodes matching the xpath expression of a value that the xpath expression evaluates to.<br /><br />  **Example 1**<br /><br /> Assume the value of parameter 'p1' is a string representation of the following XML:<br /><br /> `<?xml version="1.0"?> <lab>   <robot>     <parts>5</parts>     <name>R1</name>   </robot>   <robot>     <parts>8</parts>     <name>R2</name>   </robot> </lab>`<br /><br /> 1. This code: `xpath(xml(parameters('p1'), '/lab/robot/name')`<br /><br /> returns<br /><br /> `[ <name>R1</name>, <name>R2</name> ]`<br /><br /> whereas<br /><br /> 2. This code: `xpath(xml(parameters('p1'), ' sum(/lab/robot/parts)')`<br /><br /> would return<br /><br /> `13`<br /><br /> <br /><br /> **Example 2**<br /><br /> Given the following XML content:<br /><br /> `<?xml version="1.0"?> <File xmlns="http://foo.com">   <Location>bar</Location> </File>`<br /><br /> 1.  This code: `@xpath(xml(body('Http')), '/*[name()=\"File\"]/*[name()=\"Location\"]')`<br /><br /> or<br /><br /> 2. This code: `@xpath(xml(body('Http')), '/*[local-name()=\"File\" and namespace-uri()=\"http://foo.com\"]/*[local-name()=\"Location\" and namespace-uri()=\"\"]')`<br /><br /> will return<br /><br /> `<Location xmlns="http://foo.com">bar</Location>`<br /><br /> and<br /><br /> 3. This code: `@xpath(xml(body('Http')), 'string(/*[name()=\"File\"]/*[name()=\"Location\"])')`<br /><br /> will return<br /><br /> ``bar``<br /><br /> **Parameter number**: 1<br /><br />**Name**: Xml<br /><br />**Description**: Required. The XML on which to evaluate the XPath expression.<br /><br /> **Parameter number**: 2<br /><br />**Name**: XPath<br /><br />**Description**: Required. The XPath expression to evaluate.|  
|array|Convert the parameter to an array.  For example, this function returns `["abc"]`: `array('abc')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to an array.|
|createArray|Creates an array from the parameters.  For example, this function returns `["a", "c"]`: `createArray('a', 'c')`<br /><br /> **Parameter number**: 1 ... n<br /><br /> **Name**: Any n<br /><br /> **Description**: Required. The values to combine into an array.|

### Math functions  

These functions can be used for either types of numbers: **integers** and **floats**.  
  
|Function name|Description|  
|-------------------|-----------------|  
|add|Returns the result from adding the two numbers. For example, this function returns `20.333`:<br /><br /> `add(10,10.333)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Summand 1<br /><br /> **Description**: Required. The number to add to **Summand 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Summand 2<br /><br /> **Description**: Required. The number to add to **Summand 1**.|  
|sub|Returns the result from subtracting two numbers. For example, this function returns: `-0.333`:<br /><br /> `sub(10,10.333)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Minuend<br /><br /> **Description**: Required. The number that **Subtrahend** is removed from.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Subtrahend<br /><br /> **Description**: Required. The number to remove from the **Minuend**.|  
|mul|Returns the result from multiplying the two numbers. For example, this function returns `103.33`:<br /><br /> `mul(10,10.333)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Multiplicand 1<br /><br /> **Description**: Required. The number to multiply **Multiplicand 2** with.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Multiplicand 2<br /><br /> **Description**: Required. The number to multiply **Multiplicand 1** with.|  
|div|Returns the result from dividing the two numbers. For example, this function returns `1.0333`:<br /><br /> `div(10.333,10)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Dividend<br /><br /> **Description**: Required. The number to divide by the **Divisor**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Divisor<br /><br /> **Description**: Required. The number to divide the **Dividend** by.|  
|mod|Returns the remainder after dividing the two numbers (modulo). For example, this function returns `2`:<br /><br /> `mod(10,4)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Dividend<br /><br /> **Description**: Required. The number to divide by the **Divisor**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Divisor<br /><br /> **Description**: Required. The number to divide the **Dividend** by. After the division, the remainder is taken.|  
|min|There are two different patterns for calling this function: `min([0,1,2])` Here `min` takes an array. This function returns `0`. Alternatively, this function can take a comma-separated list of values: `min(0,1,2)` and also returns 0. Note, all values must be numbers, so if the parameter is an array it has to only have numbers in it.<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection or Value<br /><br /> **Description**: Required. Either an array of values to find the minimum value, or the first value of a set.<br /><br /> **Parameter number**: 2 ... *n*<br /><br /> **Name**: Value *n*<br /><br /> **Description**: Optional. If the first parameter is a Value, then you can pass additional values and the minimum of all passed values is returned.|  
|max|There are two different patterns for calling this function:  `max([0,1,2])`<br /><br /> Here `max` takes an array. This function returns `2`. Alternatively, this function can take a comma-separated list of values: `max(0,1,2)` and also returns 2. Note, all values must be numbers, so if the parameter is an array, the array has to only have numbers.<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection or Value<br /><br /> **Description**: Required. This can either be an array of values to find the maximum value, or the first value of a set.<br /><br /> **Parameter number**: 2 ... *n*<br /><br /> **Name**: Value *n*<br /><br /> **Description**: Optional. If the first parameter is a Value, then you can pass additional values and the maximum of all passed values is returned.|  
|range|This function generates an array of integers starting from a certain number. You define the length of the returned array. For example, this function returns `[3,4,5,6]`:<br /><br /> `range(3,4)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Start index<br /><br /> **Description**: Required. The first integer in the array.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Count<br /><br /> **Description**: Required. This value is the number of integers that is in the array.|  
|rand|This function generates a random integer within the specified range (inclusive on both ends). For example, this function might return `42`:<br /><br /> `rand(-1000,1000)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Minimum<br /><br /> **Description**: Required. The lowest integer that can be returned.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Maximum<br /><br /> **Description**: Required. This value is the highest integer that could be returned.|  
  
### Date functions  
  
|Function name|Description|  
|-------------------|-----------------|  
|utcnow|Returns the current timestamp as a string. For example: `2015-03-15T13:27:36Z`:<br /><br /> `utcnow()`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|addseconds|Adds an integer number of seconds to a string timestamp passed in. The number of seconds can be positive or negative. The result is a string in ISO 8601 format ("o") by default, unless a format specifier is provided. For example: `2015-03-15T13:27:00Z`:<br /><br /> `addseconds('2015-03-15T13:27:36Z', -36)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. A string that contains the time.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Seconds<br /><br /> **Description**: Required. The number of seconds to add. Can be negative to subtract seconds.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|addminutes|Adds an integer number of minutes to a string timestamp passed in. The number of minutes can be positive or negative. The result is a string in ISO 8601 format ("o") by default, unless a format specifier is provided. For example: `2015-03-15T14:00:36Z`:<br /><br /> `addminutes('2015-03-15T13:27:36Z', 33)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. A string that contains the time.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Minutes<br /><br /> **Description**: Required. The number of minutes to add. Can be negative to subtract minutes.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|addhours|Adds an integer number of hours to a string timestamp passed in. The number of hours can be positive or negative. The result is a string in ISO 8601 format ("o") by default, unless a format specifier is provided. For example: `2015-03-16T01:27:36Z`:<br /><br /> `addhours('2015-03-15T13:27:36Z', 12)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. A string that contains the time.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Hours<br /><br /> **Description**: Required. The number of hours to add. Can be negative to subtract hours.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|adddays|Adds an integer number of days to a string timestamp passed in. The number of days can be positive or negative. The result is a string in ISO 8601 format ("o") by default, unless a format specifier is provided. For example: `2015-02-23T13:27:36Z`:<br /><br /> `addseconds('2015-03-15T13:27:36Z', -20)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. A string that contains the time.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Days<br /><br /> **Description**: Required. The number of days to add. Can be negative to subtract days.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|formatDateTime|Returns a string in date format. The result is a string in ISO 8601 format ("o") by default, unless a format specifier is provided. For example: `2015-02-23T13:27:36Z`:<br /><br /> `formatDateTime('2015-03-15T13:27:36Z', 'o')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Date<br /><br /> **Description**: Required. A string that contains the date.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
  
### Workflow functions  

These functions help you get information about the workflow itself at run time.  
  
|Function name|Description|  
|-------------------|-----------------|  
|listCallbackUrl|Returns a string to call to invoke the trigger or action. **Note**: This function can only be used in an **httpWebhook** and **apiConnectionWebhook**, not in **manual**, **recurrence**, **http**, or **apiConnection**.  For example: `listCallbackUrl()` returns:<br /><br /> `https://prod-01.westus.logic.azure.com:443/workflows/1235...ABCD/triggers/manual/run?api-version=2015-08-01-preview&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xxx...xxx`|  
|workflow|This function provides you all the details for the workflow itself at the runtime. You can get everything that's available in the Management API, such as name, location and resourceID. See the [Rest API](http://go.microsoft.com/fwlink/p/?LinkID=525617) for details on those properties. For example, this function returns the location (e.g. `westus`):<br /><br /> `workflow().location`<br /><br /> Note: `@workflow` is currently supported within triggers.|

## Next steps

[Workflow actions and triggers](logic-apps-workflow-actions-and-triggers.md)