---
title: Workflow Definition Language schema - Azure Logic Apps | Microsoft Docs
description: Define workflows based on the workflow definition schema for Azure Logic Apps
services: logic-apps
author: jeffhollan
manager: anneta
editor: ''
documentationcenter: ''

ms.assetid: 26c94308-aa0d-4730-97b6-de848bffff91
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 03/21/2017
ms.author: LADocs; jehollan
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
|$schema|No|Specifies the location for the JSON schema file that describes the version of the definition language. This location is required when you reference a definition externally. For this document, the location is: <p>`https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2015-08-01-preview/workflowdefinition.json#`|  
|contentVersion|No|Specifies the definition version. When you deploy a workflow using the definition, you can use this value to make sure that the right definition is used.|  
|parameters|No|Specifies parameters used to input data into the definition. A maximum of 50 parameters can be defined.|  
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
|type|Yes|**Type**: string <p> **Declaration**: `"parameters": {"parameter1": {"type": "string"}` <p> **Specification**: `"parameters": {"parameter1": {"value": "myparamvalue1"}}` <p> **Type**: securestring <p> **Declaration**: `"parameters": {"parameter1": {"type": "securestring"}}` <p> **Specification**: `"parameters": {"parameter1": {"value": "myparamvalue1"}}` <p> **Type**: int <p> **Declaration**: `"parameters": {"parameter1": {"type": "int"}}` <p> **Specification**: `"parameters": {"parameter1": {"value" : 5}}` <p> **Type**: bool <p> **Declaration**: `"parameters": {"parameter1": {"type": "array"}}` <p> **Specification**: `"parameters": {"parameter1": { "value": true }}` <p> **Type**: array <p> **Declaration**: `"parameters": {"parameter1": {"type": "array"}}` <p> **Specification**: `"parameters": {"parameter1": { "value": [ array-of-values ]}}` <p> **Type**: object <p> **Declaration**: `"parameters": {"parameter1": {"type": "object"}}` <p> **Specification**: `"parameters": {"parameter1": { "value": { JSON-object } }}` <p> **Type**: secureobject <p> **Declaration**: `"parameters": {"parameter1": {"type": "object"}}` <p> **Specification**: `"parameters": {"parameter1": { "value": { JSON-object } }}` <p> **Note:** The `securestring` and `secureobject` types are not returned in `GET` operations. All passwords, keys, and secrets should use this type.|  
|defaultValue|No|Specifies the default value for the parameter when no value is specified at the time the resource is created.|  
|allowedValues|No|Specifies an array of allowed values for the parameter.|  
|metadata|No|Specifies additional information about the parameter, such as a readable description or design-time data used by Visual Studio or other tools.|  
  
This example shows how you can use a parameter in the body section of an action:  
  
```json
"body" :
{
  "property1": "@parameters('parameter1')"
}
```

 Parameters can also be used in outputs.  
  
## Triggers and actions  

Triggers and actions specify the calls that can participate in workflow execution. 
For details about this section, see [Workflow Actions and Triggers](logic-apps-workflow-actions-triggers.md).
  
## Outputs  

Outputs specify information that can be returned from a workflow run. 
For example, if you have a specific status or value that you want to track for each run, 
you can include that data in the run outputs. The data appears in the Management REST API for that run, 
and in the management UI for that run in the Azure portal. 
You can also flow these outputs to other external systems like PowerBI for creating dashboards. 
Outputs are *not* used to respond to incoming requests on the Service REST API. 
To respond to an incoming request using the `response` action type, here's an example:
  
```json
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
|type|Yes|Specifies the type for the value that was specified. Possible types of values are: <ul><li>`string`</li><li>`securestring`</li><li>`int`</li><li>`bool`</li><li>`array`</li><li>`object`</li></ul>|
  
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
  
With *string interpolation*, expressions can also appear inside strings where expressions are wrapped in `@{ ... }`. 
For example: <p>`"name" : "First Name: @{parameters('firstName')} Last Name: @{parameters('lastName')}"`

The result is always a string, which makes this feature similar to the `concat` function. 
Suppose you defined `myNumber` as `42` and `myString` as `sampleString`:  
  
|JSON value|Result|  
|----------------|------------|  
|"@parameters('myString')"|Returns `sampleString` as a string.|  
|"@{parameters('myString')}"|Returns `sampleString` as a string.|  
|"@parameters('myNumber')"|Returns `42` as a *number*.|  
|"@{parameters('myNumber')}"|Returns `42` as a *string*.|  
|"Answer is: @{parameters('myNumber')}"|Returns the string `Answer is: 42`.|  
|"@concat('Answer is: ', string(parameters('myNumber')))"|Returns the string `Answer is: 42`|  
|"Answer is: @@{parameters('myNumber')}"|Returns the string `Answer is: @{parameters('myNumber')}`.|  
  
## Operators  

Operators are the characters that you can use inside expressions or functions. 
  
|Operator|Description|  
|--------------|-----------------|  
|.|The dot operator allows you to reference properties of an object|  
|?|The question mark operator lets you reference null properties of an object without a runtime error. For example, you can use this expression to handle null trigger outputs: <p>`@coalesce(trigger().outputs?.body?.property1, 'my default value')`|  
|'|The single quotation mark is the only way to wrap string literals. You cannot use double-quotes inside expressions because this punctuation conflicts with the JSON quote that wraps the whole expression.|  
|[]|The square brackets can be used to get a value from an array with a specific index. For example, if you have an action that passes `range(0,10)`in to the `forEach` function, you can use this function to get items out of arrays:  <p>`myArray[item()]`|  
  
## Functions  

You can also call functions within expressions. The following table shows the functions that can be used in an expression.  
  
|Expression|Evaluation|  
|----------------|----------------|  
|"@function('Hello')"|Calls the function member of the definition with the literal string Hello as the first parameter.|  
|"@function('It's Cool!')"|Calls the function member of the definition with the literal string 'It's Cool!' as the first parameter|  
|"@function().prop1"|Returns the value of the prop1 property of the `myfunction` member of the definition.|  
|"@function('Hello').prop1"|Calls the function member of the definition with the literal string 'Hello' as the first parameter and returns the prop1 property of the object.|  
|"@function(parameters('Hello'))"|Evaluates the Hello parameter and passes the value to function|  
  
### Referencing functions  

You can use these functions to reference outputs from other actions in the logic app or values passed in when the logic app was created. For example, you can reference the data from one step to use it in another.  
  
|Function name|Description|  
|-------------------|-----------------|  
|parameters|Returns a parameter value that is defined in the definition. <p>`parameters('password')` <p> **Parameter number**: 1 <p> **Name**: Parameter <p> **Description**: Required. The name of the parameter whose values you want.|  
|action|Enables an expression to derive its value from other JSON name and value pairs or the output of the current runtime action. The property represented by propertyPath in the following example is optional. If propertyPath is not specified, the reference is to the whole action object. This function can only be used inside do-until conditions of an action. <p>`action().outputs.body.propertyPath`|  
|actions|Enables an expression to derive its value from other JSON name and value pairs or the output of the runtime action. These expressions explicitly declare that one action depends on another action. The property represented by propertyPath in the following example is optional. If propertyPath is not specified, the reference is to the whole action object. You can use either this element or the conditions element to specify dependencies, but you do not need to use both for the same dependent resource. <p>`actions('myAction').outputs.body.propertyPath` <p> **Parameter number**: 1 <p> **Name**: Action name <p> **Description**: Required. The name of the action whose values you want. <p> Available properties on the action object are: <ul><li>`name`</li><li>`startTime`</li><li>`endTime`</li><li>`inputs`</li><li>`outputs`</li><li>`status`</li><li>`code`</li><li>`trackingId`</li><li>`clientTrackingId`</li></ul> <p>See the [Rest API](http://go.microsoft.com/fwlink/p/?LinkID=850646) for details on those properties.|
|trigger|Enables an expression to derive its value from other JSON name and value pairs or the output of the runtime trigger. The property represented by propertyPath in the following example is optional. If propertyPath is not specified, the reference is to the whole trigger object. <p>`trigger().outputs.body.propertyPath` <p>When used inside a trigger's inputs, the function returns the outputs of the previous execution. However, when used inside a trigger's condition, the `trigger` function returns the outputs of the current execution. <p> Available properties on the trigger object are: <ul><li>`name`</li><li>`scheduledTime`</li><li>`startTime`</li><li>`endTime`</li><li>`inputs`</li><li>`outputs`</li><li>`status`</li><li>`code`</li><li>`trackingId`</li><li>`clientTrackingId`</li></ul> <p>See the [Rest API](http://go.microsoft.com/fwlink/p/?LinkID=850644) for details on those properties.|
|actionOutputs|This function is shorthand for `actions('actionName').outputs` <p> **Parameter number**: 1 <p> **Name**: Action name <p> **Description**: Required. The name of the action whose values you want.|  
|actionBody and body|These functions are shorthand for `actions('actionName').outputs.body` <p> **Parameter number**: 1 <p> **Name**: Action name <p> **Description**: Required. The name of the action whose values you want.|  
|triggerOutputs|This function is shorthand for `trigger().outputs`|  
|triggerBody|This function is shorthand for `trigger().outputs.body`|  
|item|When used inside a repeating action, this function returns the item that is in the array for this iteration of the action. For example, if you have an action that runs for each item an array of messages, you can use this syntax: <p>`"input1" : "@item().subject"`| 
  
### Collection functions  

These functions operate over collections and generally apply to Arrays, Strings, and sometimes Dictionaries.  
  
|Function name|Description|  
|-------------------|-----------------|  
|contains|Returns true if dictionary contains a key, list contains value, or string contains substring. For example, this function returns `true`: <p>`contains('abacaba','aca')` <p> **Parameter number**: 1 <p> **Name**: Within collection <p> **Description**: Required. The collection to search within. <p> **Parameter number**: 2 <p> **Name**: Find object <p> **Description**: Required. The object to find inside the **Within collection**.|  
|length|Returns the number of elements in an array or string. For example, this function returns `3`:  <p>`length('abc')` <p> **Parameter number**: 1 <p> **Name**: Collection <p> **Description**: Required. The collection for which to get the length.|  
|empty|Returns true if object, array, or string is empty. For example, this function returns `true`: <p>`empty('')` <p> **Parameter number**: 1 <p> **Name**: Collection <p> **Description**: Required. The collection to check if it is empty.|  
|intersection|Returns a single array or object that has common elements between arrays or objects passed in. For example, this function returns `[1, 2]`: <p>`intersection([1, 2, 3], [101, 2, 1, 10],[6, 8, 1, 2])` <p>The parameters for the function can either be a set of objects or a set of arrays (not a mixture of both). If there are two objects with the same name, the last object with that name appears in the final object. <p> **Parameter number**: 1 ... *n* <p> **Name**: Collection *n* <p> **Description**: Required. The collections to evaluate. An object must be in all collections passed in to appear in the result.|  
|union|Returns a single array or object with all the elements that are in either array or object passed to this function. For example, this function returns `[1, 2, 3, 10, 101]`: <p>`union([1, 2, 3], [101, 2, 1, 10])` <p>The parameters for the function can either be a set of objects or a set of arrays (not a mixture thereof). If there are two objects with the same name in the final output, the last object with that name appears in the final object. <p> **Parameter number**: 1 ... *n* <p> **Name**: Collection *n* <p> **Description**: Required. The collections to evaluate. An object that appears in any of the collections also appears in the result.|  
|first|Returns the first element in the array or string passed in. For example, this function returns `0`: <p>`first([0,2,3])` <p> **Parameter number**: 1 <p> **Name**: Collection <p> **Description**: Required. The collection to take the first object from.|  
|last|Returns the last element in the array or string passed in. For example, this function returns `3`: <p>`last('0123')` <p> **Parameter number**: 1 <p> **Name**: Collection <p> **Description**: Required. The collection to take the last object from.|  
|take|Returns the first **Count** elements from the array or string passed in. For example, this function returns `[1, 2]`:  <p>`take([1, 2, 3, 4], 2)` <p> **Parameter number**: 1 <p> **Name**: Collection <p> **Description**: Required. The collection from where to take the first **Count** objects. <p> **Parameter number**: 2 <p> **Name**: Count <p> **Description**: Required. The number of objects to take from the **Collection**. Must be a positive integer.|  
|skip|Returns the elements in the array starting at index **Count**. For example, this function returns `[3, 4]`: <p>`skip([1, 2 ,3 ,4], 2)` <p> **Parameter number**: 1 <p> **Name**: Collection <p> **Description**: Required. The collection to skip the first **Count** objects from. <p> **Parameter number**: 2 <p> **Name**: Count <p> **Description**: Required. The number of objects to remove from the front of **Collection**. Must be a positive integer.|  
|join|Returns a string with each item of an array joined by a delimiter, for example this returns `"1,2,3,4"`:<br /><br /> `join([1, 2, 3, 4], ',')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to join items from.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Delimiter<br /><br /> **Description**: Required. The string to delimit items with.|  
  
### String functions

The following functions only apply to strings. You can also use some collection functions on strings.  
  
|Function name|Description|  
|-------------------|-----------------|  
|concat|Combines any number of strings together. For example, if parameter 1 is `p1`, this function returns `somevalue-p1-somevalue`: <p>`concat('somevalue-',parameters('parameter1'),'-somevalue')` <p> **Parameter number**: 1 ... *n* <p> **Name**: String *n* <p> **Description**: Required. The strings to combine into a single string.|  
|substring|Returns a subset of characters from a string. For example, this function returns `abc`: <p>`substring('somevalue-abc-somevalue',10,3)` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string from which the substring is taken. <p> **Parameter number**: 2 <p> **Name**: Start index <p> **Description**: Required. The index of where the substring begins in parameter 1. <p> **Parameter number**: 3 <p> **Name**: Length <p> **Description**: Required. The length of the substring.|  
|replace|Replaces a string with a given string. For example, this function returns `the new string`: <p>`replace('the old string', 'old', 'new')` <p> **Parameter number**: 1 <p> **Name**: string <p> **Description**: Required. The string that is searched for parameter 2 and updated with parameter 3, when parameter 2 is found in parameter 1. <p> **Parameter number**: 2 <p> **Name**: Old string <p> **Description**: Required. The string to replace with parameter 3, when a match is found in parameter 1 <p> **Parameter number**: 3 <p> **Name**: New string <p> **Description**: Required. The string that is used to replace the string in parameter 2 when a match is found in parameter 1.|  
|guid|This function generates a globally unique string (GUID). For example, this function can generate this GUID: `c2ecc88d-88c8-4096-912c-d6f2e2b138ce` <p>`guid()` <p> **Parameter number**: 1 <p> **Name**: Format <p> **Description**: Optional. A single format specifier that indicates [how to format the value of this Guid](https://msdn.microsoft.com/library/97af8hh4%28v=vs.110%29.aspx). The format parameter can be "N", "D", "B", "P", or "X". If format is not provided, "D" is used.|  
|toLower|Converts a string to lowercase. For example, this function returns `two by two is four`: <p>`toLower('Two by Two is Four')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string to convert to lower casing. If a character in the string does not have a lowercase equivalent, the character is included unchanged in the returned string.|  
|toUpper|Converts a string to uppercase. For example, this function returns `TWO BY TWO IS FOUR`: <p>`toUpper('Two by Two is Four')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string to convert to upper casing. If a character in the string does not have an uppercase equivalent, the character is included unchanged in the returned string.|  
|indexof|Find the index of a value within a string case insensitively. For example, this function returns `7`: <p>`indexof('hello, world.', 'world')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string that may contain the value. <p> **Parameter number**: 2 <p> **Name**: String <p> **Description**: Required. The value to search the index of.|  
|lastindexof|Find the last index of a value within a string case insensitively. For example, this function returns `3`: <p>`lastindexof('foofoo', 'foo')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string that may contain the value. <p> **Parameter number**: 2 <p> **Name**: String <p> **Description**: Required. The value to search the index of.|  
|startswith|Checks if the string starts with a value case insensitively. For example, this function returns `true`: <p>`startswith('hello, world', 'hello')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string that may contain the value. <p> **Parameter number**: 2 <p> **Name**: String <p> **Description**: Required. The value the string may start with.|  
|endswith|Checks if the string ends with a value case insensitively. For example, this function returns `true`: <p>`endswith('hello, world', 'world')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string that may contain the value. <p> **Parameter number**: 2 <p> **Name**: String <p> **Description**: Required. The value the string may end with.|  
|split|Splits the string using a separator. For example, this function returns `["a", "b", "c"]`: <p>`split('a;b;c',';')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string that is split. <p> **Parameter number**: 2 <p> **Name**: String <p> **Description**: Required. The separator.|  
  
### Logical functions  

These functions are useful inside conditions and can be used to evaluate any type of logic.  
  
|Function name|Description|  
|-------------------|-----------------|  
|equals|Returns true if two values are equal. For example, if parameter1 is someValue, this function returns `true`: <p>`equals(parameters('parameter1'), 'someValue')` <p> **Parameter number**: 1 <p> **Name**: Object 1 <p> **Description**: Required. The object to compare to **Object 2**. <p> **Parameter number**: 2 <p> **Name**: Object 2 <p> **Description**: Required. The object to compare to **Object 1**.|  
|less|Returns true if the first argument is less than the second. Note, values can only be of type integer, float, or string. For example, this function returns `true`: <p>`less(10,100)` <p> **Parameter number**: 1 <p> **Name**: Object 1 <p> **Description**: Required. The object to check if it is less than **Object 2**. <p> **Parameter number**: 2 <p> **Name**: Object 2 <p> **Description**: Required. The object to check if it is greater than **Object 1**.|  
|lessOrEquals|Returns true if the first argument is less than or equal to the second. Note, values can only be of type integer, float, or string. For example, this function returns `true`: <p>`lessOrEquals(10,10)` <p> **Parameter number**: 1 <p> **Name**: Object 1 <p> **Description**: Required. The object to check if it is less or equal to **Object 2**. <p> **Parameter number**: 2 <p> **Name**: Object 2 <p> **Description**: Required. The object to check if it is greater than or equal to **Object 1**.|  
|greater|Returns true if the first argument is greater than the second. Note, values can only be of type integer, float, or string. For example, this function returns `false`:  <p>`greater(10,10)` <p> **Parameter number**: 1 <p> **Name**: Object 1 <p> **Description**: Required. The object to check if it is greater than **Object 2**. <p> **Parameter number**: 2 <p> **Name**: Object 2 <p> **Description**: Required. The object to check if it is less than **Object 1**.|  
|greaterOrEquals|Returns true if the first argument is greater than or equal to the second. Note, values can only be of type integer, float, or string. For example, this function returns `false`: <p>`greaterOrEquals(10,100)` <p> **Parameter number**: 1 <p> **Name**: Object 1 <p> **Description**: Required. The object to check if it is greater than or equal to **Object 2**. <p> **Parameter number**: 2 <p> **Name**: Object 2 <p> **Description**: Required. The object to check if it is less than or equal to **Object 1**.|  
|and|Returns true if both parameters are true. Both arguments need to be Booleans. For example, this function returns `false`: <p>`and(greater(1,10),equals(0,0))` <p> **Parameter number**: 1 <p> **Name**: Boolean 1 <p> **Description**: Required. The first argument that must be `true`. <p> **Parameter number**: 2 <p> **Name**: Boolean 2 <p> **Description**: Required. The second argument must be `true`.|  
|or|Returns true if either parameter is true. Both arguments need to be Booleans. For example, this function returns `true`: <p>`or(greater(1,10),equals(0,0))` <p> **Parameter number**: 1 <p> **Name**: Boolean 1 <p> **Description**: Required. The first argument that may be `true`. <p> **Parameter number**: 2 <p> **Name**: Boolean 2 <p> **Description**: Required. The second argument may be `true`.|  
|not|Returns true if the parameters are `false`. Both arguments need to be Booleans. For example, this function returns `true`: <p>`not(contains('200 Success','Fail'))` <p> **Parameter number**: 1 <p> **Name**: Boolean <p> **Description**: Returns true if the parameters are `false`. Both arguments need to be Booleans. This function returns `true`:  `not(contains('200 Success','Fail'))`|  
|if|Returns a specified value based on whether the expression resulted in `true` or `false`.  For example, this function returns `"yes"`: <p>`if(equals(1, 1), 'yes', 'no')` <p> **Parameter number**: 1 <p> **Name**: Expression <p> **Description**: Required. A boolean value that determines which value the expression should return. <p> **Parameter number**: 2 <p> **Name**: True <p> **Description**: Required. The value to return if the expression is `true`. <p> **Parameter number**: 3 <p> **Name**: False <p> **Description**: Required. The value to return if the expression is `false`.|  
  
### Conversion functions  

These functions are used to convert between each of the native types in the language:  
  
- string  
  
- integer  
  
- float  
  
- boolean  
  
- arrays  
  
- dictionaries  

-   forms  
  
|Function name|Description|  
|-------------------|-----------------|  
|int|Convert the parameter to an integer. For example, this function returns 100 as a number, rather than a string: <p>`int('100')` <p> **Parameter number**: 1 <p> **Name**: Value <p> **Description**: Required. The value that is converted to an integer.|  
|string|Convert the parameter to a string. For example, this function returns `'10'`: <p>`string(10)` <p>You can also convert an object to a string. For example, if the `myPar` parameter is an object with one property `abc : xyz`, then this function returns `{"abc" : "xyz"}`: <p>`string(parameters('myPar'))` <p> **Parameter number**: 1 <p> **Name**: Value <p> **Description**: Required. The value that is converted to a string.|  
|json|Convert the parameter to a JSON type value and is the opposite of `string()`. For example, this function returns `[1,2,3]` as an array, rather than a string: <p>`json('[1,2,3]')` <p>Likewise, you can convert a string to an object. For example, this function returns `{ "abc" : "xyz" }`: <p>`json('{"abc" : "xyz"}')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string that is converted to a native type value. <p>The `json()` function supports XML input too. For example, the parameter value of: <p>`<?xml version="1.0"?> <root>   <person id='1'>     <name>Alan</name>     <occupation>Engineer</occupation>   </person> </root>` <p>is converted to this JSON: <p>`{ "?xml": { "@version": "1.0" },   "root": {     "person": [     {       "@id": "1",       "name": "Alan",       "occupation": "Engineer"     }   ]   } }`|  
|float|Convert the parameter argument to a floating-point number. For example, this function returns `10.333`: <p>`float('10.333')` <p> **Parameter number**: 1 <p> **Name**: Value <p> **Description**: Required. The value that is converted to a floating-point number.|  
|bool|Convert the parameter to a Boolean. For example, this function returns `false`: <p>`bool(0)` <p> **Parameter number**: 1 <p> **Name**: Value <p> **Description**: Required. The value that is converted to a boolean.|  
|coalesce|Returns the first non-null object in the arguments passed in. **Note**: An empty string is not null. For example, if parameters 1 and 2 are not defined, this function returns `fallback`:  <p>`coalesce(parameters('parameter1'), parameters('parameter2') ,'fallback')` <p> **Parameter number**: 1 ... *n* <p> **Name**: Object*n* <p> **Description**: Required. The objects to check for null.|  
|base64|Returns the base64 representation of the input string. For example, this function returns `c29tZSBzdHJpbmc=`: <p>`base64('some string')` <p> **Parameter number**: 1 <p> **Name**: String 1 <p> **Description**: Required. The string to encode into base64 representation.|  
|base64ToBinary|Returns a binary representation of a base64 encoded string. For example, this function returns the binary representation of `some string`: <p>`base64ToBinary('c29tZSBzdHJpbmc=')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The base64 encoded string.|  
|base64ToString|Returns a string representation of a based64 encoded string. For example, this function returns `some string`: <p>`base64ToString('c29tZSBzdHJpbmc=')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The base64 encoded string.|  
|Binary|Returns a binary representation of a value.  For example, this function returns a binary representation of `some string`: <p>`binary('some string')` <p> **Parameter number**: 1 <p> **Name**: Value <p> **Description**: Required. The value that is converted to binary.|  
|dataUriToBinary|Returns a binary representation of a data URI. For example, this function returns the binary representation of `some string`: <p>`dataUriToBinary('data:;base64,c29tZSBzdHJpbmc=')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The data URI to convert to binary representation.|  
|dataUriToString|Returns a string representation of a data URI. For example, this function returns `some string`: <p>`dataUriToString('data:;base64,c29tZSBzdHJpbmc=')` <p> **Parameter number**: 1 <p> **Name**: String<p> **Description**: Required. The data URI to convert to String representation.|  
|dataUri|Returns a data URI of a value. For example, this function returns this data URI `text/plain;charset=utf8;base64,c29tZSBzdHJpbmc=`: <p>`dataUri('some string')` <p> **Parameter number**: 1<p> **Name**: Value<p> **Description**: Required. The value to convert to data URI.|  
|decodeBase64|Returns a string representation of an input based64 string. For example, this function returns `some string`: <p>`decodeBase64('c29tZSBzdHJpbmc=')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Returns a string representation of an input based64 string.|  
|encodeUriComponent|URL-escapes the string that's passed in. For example, this function returns `You+Are%3ACool%2FAwesome`: <p>`encodeUriComponent('You Are:Cool/Awesome')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string to escape URL-unsafe characters from.|  
|decodeUriComponent|Un-URL-escapes the string that's passed in. For example, this function returns `You Are:Cool/Awesome`: <p>`encodeUriComponent('You+Are%3ACool%2FAwesome')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The string to decode the URL-unsafe characters from.|  
|decodeDataUri|Returns a binary representation of an input data URI string. For example, this function returns the binary representation of `some string`: <p>`decodeDataUri('data:;base64,c29tZSBzdHJpbmc=')` <p> **Parameter number**: 1 <p> **Name**: String <p> **Description**: Required. The dataURI to decode into a binary representation.|  
|uriComponent|Returns a URI encoded representation of a value. For example, this function returns `You+Are%3ACool%2FAwesome`: <p>`uriComponent('You Are:Cool/Awesome')` <p> **Parameter number**: 1<p> **Name**: String <p> **Description**: Required. The string to be URI encoded.|  
|uriComponentToBinary|Returns a binary representation of a URI encoded string. For example, this function returns a binary representation of `You Are:Cool/Awesome`: <p>`uriComponentToBinary('You+Are%3ACool%2FAwesome')` <p> **Parameter number**: 1 <p> **Name**: String<p> **Description**: Required. The URI encoded string.|  
|uriComponentToString|Returns a string representation of a URI encoded string. For example, this function returns `You Are:Cool/Awesome`: <p>`uriComponentToBinary('You+Are%3ACool%2FAwesome')` <p> **Parameter number**: 1<p> **Name**: String<p> **Description**: Required. The URI encoded string.|  
|xml|Return an XML representation of the value. For example, this function returns XML content represented by `'\<name>Alan\</name>'`: <p>`xml('\<name>Alan\</name>')` <p>The `xml()` function supports JSON object input too. For example, the parameter `{ "abc": "xyz" }` is converted to XML content: `\<abc>xyz\</abc>` <p> **Parameter number**: 1<p> **Name**: Value<p> **Description**: Required. The value to convert to XML.|  
|xpath|Return an array of XML nodes matching the xpath expression of a value that the xpath expression evaluates to. <p> **Example 1** <p>Assume the value of parameter `p1` is a string representation of this XML: <p>`<?xml version="1.0"?> <lab>   <robot>     <parts>5</parts>     <name>R1</name>   </robot>   <robot>     <parts>8</parts>     <name>R2</name>   </robot> </lab>` <p>This code: `xpath(xml(parameters('p1'), '/lab/robot/name')` <p>returns <p>`[ <name>R1</name>, <name>R2</name> ]` <p>while this code: <p>`xpath(xml(parameters('p1'), ' sum(/lab/robot/parts)')` <p>returns <p>`13` <p> <p> **Example 2** <p>Given the following XML content: <p>`<?xml version="1.0"?> <File xmlns="http://foo.com">   <Location>bar</Location> </File>` <p>This code: `@xpath(xml(body('Http')), '/*[name()=\"File\"]/*[name()=\"Location\"]')` <p>or this code: <p>`@xpath(xml(body('Http')), '/*[local-name()=\"File\" and namespace-uri()=\"http://foo.com\"]/*[local-name()=\"Location\" and namespace-uri()=\"\"]')` <p>returns <p>`<Location xmlns="http://abc.com">xyz</Location>` <p>And this code: `@xpath(xml(body('Http')), 'string(/*[name()=\"File\"]/*[name()=\"Location\"])')` <p>returns <p>``xyz`` <p> **Parameter number**: 1 <p> **Name**: Xml <p> **Description**: Required. The XML on which to evaluate the XPath expression. <p> **Parameter number**: 2 <p> **Name**: XPath <p> **Description**: Required. The XPath expression to evaluate.|  
|array|Convert the parameter to an array. For example, this function returns `["abc"]`: <p>`array('abc')` <p> **Parameter number**: 1 <p> **Name**: Value <p> **Description**: Required. The value that is converted to an array.|
|createArray|Creates an array from the parameters. For example, this function returns `["a", "c"]`: <p>`createArray('a', 'c')` <p> **Parameter number**: 1 ... *n* <p> **Name**: Any *n* <p> **Description**: Required. The values to combine into an array.|
|triggerFormDataValue|Returns a single value matching the key name from form-data or form-encoded trigger output.  If there are multiple matches it will error.  For example, the following will return `bar`: `triggerFormDataValue('foo')`<br /><br />**Parameter number**: 1<br /><br />**Name**: Key Name<br /><br />**Description**: Required. The key name of the form data value to return.|
|triggerFormDataMultiValues|Returns an array of values matching the key name from form-data or form-encoded trigger output.  For example, the following will return `["bar"]`: `triggerFormDataValue('foo')`<br /><br />**Parameter number**: 1<br /><br />**Name**: Key Name<br /><br />**Description**: Required. The key name of the form data values to return.|
|triggerMultipartBody|Returns the body for a part in a multipart output of the trigger.<br /><br />**Parameter number**: 1<br /><br />**Name**: Index<br /><br />**Description**: Required. The index of the part to retrieve.|
|formDataValue|Returns a single value matching the key name from form-data or form-encoded action output.  If there are multiple matches it will error.  For example, the following will return `bar`: `formDataValue('someAction', 'foo')`<br /><br />**Parameter number**: 1<br /><br />**Name**: Action Name<br /><br />**Description**: Required. The name of the action with a form-data or form-encoded response.<br /><br />**Parameter number**: 2<br /><br />**Name**: Key Name<br /><br />**Description**: Required. The key name of the form data value to return.|
|formDataMultiValues|Returns an array of values matching the key name from form-data or form-encoded action output.  For example, the following will return `["bar"]`: `formDataMultiValues('someAction', 'foo')`<br /><br />**Parameter number**: 1<br /><br />**Name**: Action Name<br /><br />**Description**: Required. The name of the action with a form-data or form-encoded response.<br /><br />**Parameter number**: 2<br /><br />**Name**: Key Name<br /><br />**Description**: Required. The key name of the form data values to return.|
|multipartBody|Returns the body for a part in a multipart output of an action.<br /><br />**Parameter number**: 1<br /><br />**Name**: Action Name<br /><br />**Description**: Required. The name of the action with a multipart response.<br /><br />**Parameter number**: 2<br /><br />**Name**: Index<br /><br />**Description**: Required. The index of the part to retrieve.|

### Math functions  

These functions can be used for either types of numbers: **integers** and **floats**.  
  
|Function name|Description|  
|-------------------|-----------------|  
|add|Returns the result from adding the two numbers. For example, this function returns `20.333`: <p>`add(10,10.333)` <p> **Parameter number**: 1 <p> **Name**: Summand 1 <p> **Description**: Required. The number to add to **Summand 2**. <p> **Parameter number**: 2 <p> **Name**: Summand 2 <p> **Description**: Required. The number to add to **Summand 1**.|  
|sub|Returns the result from subtracting two numbers. For example, this function returns `-0.333`: <p>`sub(10,10.333)` <p> **Parameter number**: 1 <p> **Name**: Minuend <p> **Description**: Required. The number that **Subtrahend** is removed from. <p> **Parameter number**: 2 <p> **Name**: Subtrahend <p> **Description**: Required. The number to remove from the **Minuend**.|  
|mul|Returns the result from multiplying the two numbers. For example, this function returns `103.33`: <p>`mul(10,10.333)` <p> **Parameter number**: 1 <p> **Name**: Multiplicand 1 <p> **Description**: Required. The number to multiply **Multiplicand 2** with. <p> **Parameter number**: 2 <p> **Name**: Multiplicand 2 <p> **Description**: Required. The number to multiply **Multiplicand 1** with.|  
|div|Returns the result from dividing the two numbers. For example, this function returns `1.0333`: <p>`div(10.333,10)` <p> **Parameter number**: 1 <p> **Name**: Dividend <p> **Description**: Required. The number to divide by the **Divisor**. <p> **Parameter number**: 2 <p> **Name**: Divisor <p> **Description**: Required. The number to divide the **Dividend** by.|  
|mod|Returns the remainder after dividing the two numbers (modulo). For example, this function returns `2`: <p>`mod(10,4)` <p> **Parameter number**: 1 <p> **Name**: Dividend <p> **Description**: Required. The number to divide by the **Divisor**. <p> **Parameter number**: 2 <p> **Name**: Divisor <p> **Description**: Required. The number to divide the **Dividend** by. After the division, the remainder is taken.|  
|min|There are two different patterns for calling this function. <p>Here `min` takes an array, and the function returns `0`: <p>`min([0,1,2])` <p>Alternatively, this function can take a comma-separated list of values and also returns `0`: <p>`min(0,1,2)` <p> **Note**: All values must be numbers, so if the parameter is an array, the array has to only have numbers. <p> **Parameter number**: 1 <p> **Name**: Collection or Value <p> **Description**: Required. Either an array of values to find the minimum value, or the first value of a set. <p> **Parameter number**: 2 ... *n* <p> **Name**: Value *n* <p> **Description**: Optional. If the first parameter is a Value, then you can pass additional values and the minimum of all passed values is returned.|  
|max|There are two different patterns for calling this function. <p>Here `max` takes an array, and the function returns `2`: <p>`max([0,1,2])` <p>Alternatively, this function can take a comma-separated list of values and also returns `2`: <p>`max(0,1,2)` <p> **Note**: All values must be numbers, so if the parameter is an array, the array has to only have numbers. <p> **Parameter number**: 1 <p> **Name**: Collection or Value <p> **Description**: Required. Either an array of values to find the maximum value, or the first value of a set. <p> **Parameter number**: 2 ... *n* <p> **Name**: Value *n* <p> **Description**: Optional. If the first parameter is a Value, then you can pass additional values and the maximum of all passed values is returned.|  
|range|Generates an array of integers starting from a certain number. You define the length of the returned array. <p>For example, this function returns `[3,4,5,6]`: <p>`range(3,4)` <p> **Parameter number**: 1 <p> **Name**: Start index <p> **Description**: Required. The first integer in the array. <p> **Parameter number**: 2 <p> **Name**: Count <p> **Description**: Required. This value is the number of integers that is in the array.|  
|rand|Generates a random integer within the specified range (inclusive only on first end). For example, this function can return either `0` or '1': <p>`rand(0,2)` <p> **Parameter number**: 1 <p> **Name**: Minimum <p> **Description**: Required. The lowest integer that can be returned. <p> **Parameter number**: 2 <p> **Name**: Maximum <p> **Description**: Required. This value is the next integer after the highest integer that could be returned.|  
  
### Date functions  
  
|Function name|Description|  
|-------------------|-----------------|  
|utcnow|Returns the current timestamp as a string, for example: `2017-03-15T13:27:36Z`: <p>`utcnow()` <p> **Parameter number**: 1 <p> **Name**: Format <p> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|addseconds|Adds an integer number of seconds to a string timestamp passed in. The number of seconds can be positive or negative. By default, the result is a string in ISO 8601 format ("o"), unless a format specifier is provided. For example: `2015-03-15T13:27:00Z`: <p>`addseconds('2015-03-15T13:27:36Z', -36)` <p> **Parameter number**: 1 <p> **Name**: Timestamp <p> **Description**: Required. A string that contains the time. <p> **Parameter number**: 2 <p> **Name**: Seconds <p> **Description**: Required. The number of seconds to add. Can be negative to subtract seconds. <p> **Parameter number**: 3 <p> **Name**: Format <p> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|addminutes|Adds an integer number of minutes to a string timestamp passed in. The number of minutes can be positive or negative. By default, the result is a string in ISO 8601 format ("o"), unless a format specifier is provided. For example: `2015-03-15T14:00:36Z`: <p>`addminutes('2015-03-15T13:27:36Z', 33)` <p> **Parameter number**: 1 <p> **Name**: Timestamp <p> **Description**: Required. A string that contains the time. <p> **Parameter number**: 2 <p> **Name**: Minutes <p> **Description**: Required. The number of minutes to add. Can be negative to subtract minutes. <p> **Parameter number**: 3 <p> **Name**: Format <p> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|addhours|Adds an integer number of hours to a string timestamp passed in. The number of hours can be positive or negative. By default, the result is a string in ISO 8601 format ("o"), unless a format specifier is provided. For example: `2015-03-16T01:27:36Z`: <p>`addhours('2015-03-15T13:27:36Z', 12)` <p> **Parameter number**: 1 <p> **Name**: Timestamp <p> **Description**: Required. A string that contains the time. <p> **Parameter number**: 2 <p> **Name**: Hours <p> **Description**: Required. The number of hours to add. Can be negative to subtract hours. <p> **Parameter number**: 3 <p> **Name**: Format <p> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|adddays|Adds an integer number of days to a string timestamp passed in. The number of days can be positive or negative. By default, the result is a string in ISO 8601 format ("o"), unless a format specifier is provided. For example: `2015-02-23T13:27:36Z`: <p>`addseconds('2015-03-15T13:27:36Z', -20)` <p> **Parameter number**: 1 <p> **Name**: Timestamp <p> **Description**: Required. A string that contains the time. <p> **Parameter number**: 2 <p> **Name**: Days <p> **Description**: Required. The number of days to add. Can be negative to subtract days. <p> **Parameter number**: 3 <p> **Name**: Format <p> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|formatDateTime|Returns a string in date format. By default, the result is a string in ISO 8601 format ("o"), unless a format specifier is provided. For example: `2015-02-23T13:27:36Z`: <p>`formatDateTime('2015-03-15T13:27:36Z', 'o')` <p> **Parameter number**: 1 <p> **Name**: Date <p> **Description**: Required. A string that contains the date. <p> **Parameter number**: 2 <p> **Name**: Format <p> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|startOfHour|Returns the start of the hour to a string timestamp passed in. For example `2017-03-15T13:00:00Z`:<br /><br /> `startOfHour('2017-03-15T13:27:36Z')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. This is a string that contains the time.<br /><br />**Parameter number**: 2<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|startOfDay|Returns the start of the day to a string timestamp passed in. For example `2017-03-15T00:00:00Z`:<br /><br /> `startOfDay('2017-03-15T13:27:36Z')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. This is a string that contains the time.<br /><br />**Parameter number**: 2<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.| 
|startOfMonth|Returns the start of the month to a string timestamp passed in. For example `2017-03-01T00:00:00Z`:<br /><br /> `startOfMonth('2017-03-15T13:27:36Z')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. This is a string that contains the time.<br /><br />**Parameter number**: 2<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.| 
|dayOfWeek|Returns the day of week component of a string timestamp.  Sunday is 0, Monday is 1, and so on. For example `3`:<br /><br /> `dayOfWeek('2017-03-15T13:27:36Z')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. This is a string that contains the time.| 
|dayOfMonth|Returns the day of month component of a string timestamp. For example `15`:<br /><br /> `dayOfMonth('2017-03-15T13:27:36Z')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. This is a string that contains the time.| 
|dayOfYear|Returns the day of year component of a string timestamp. For example `74`:<br /><br /> `dayOfYear('2017-03-15T13:27:36Z')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. This is a string that contains the time.| 
|ticks|Returns the ticks property of a string timestamp. For example `1489603019`:<br /><br /> `ticks('2017-03-15T18:36:59Z')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. This is a string that contains the time.| 
  
### Workflow functions  

These functions help you get information about the workflow itself at run time.  
  
|Function name|Description|  
|-------------------|-----------------|  
|listCallbackUrl|Returns a string to call to invoke the trigger or action. <p> **Note**: This function can only be used in an **httpWebhook** and **apiConnectionWebhook**, not in a **manual**, **recurrence**, **http**, or **apiConnection**. <p>For example, the `listCallbackUrl()` function returns: <p>`https://prod-01.westus.logic.azure.com:443/workflows/1235...ABCD/triggers/manual/run?api-version=2015-08-01-preview&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xxx...xxx` |  
|workflow|This function provides you all the details for the workflow itself at the runtime. <p> Available properties on the workflow object are: <ul><li>`name`</li><li>`type`</li><li>`id`</li><li>`location`</li><li>`run`</li></ul> <p> The value of the `run` property is an object with following properties: <ul><li>`name`</li><li>`type`</li><li>`id`</li></ul> <p>See the [Rest API](http://go.microsoft.com/fwlink/p/?LinkID=525617) for details on those properties.<p> For example, to get the name of the current run, use the `"@workflow().run.name"` expression. |

## Next steps

[Workflow actions and triggers](logic-apps-workflow-actions-triggers.md)
