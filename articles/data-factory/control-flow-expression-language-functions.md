---
title: Expression and functions in Azure Data Factory | Microsoft Docs
description: This article provides information  about expressions and functions that you can use in creating data factory entities.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 01/10/2018
ms.author: shlo

---
# Expressions and functions in Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-functions-variables.md)
> * [Current version](control-flow-expression-language-functions.md)

This article provides details about expressions and functions supported by Azure Data Factory. 

## Introduction
JSON values in the definition can be literal or expressions that are evaluated at runtime. For example:  
  
```json
"name": "value"
```

 (or)  
  
```json
"name": "@pipeline().parameters.password"
```

## Expressions  
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
  
### Examples

#### A dataset with a parameter
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

#### A pipeline with a parameter
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
#### Tutorial
This [tutorial](https://azure.microsoft.com/mediahandler/files/resourcefiles/azure-data-factory-passing-parameters/Azure%20data%20Factory-Whitepaper-PassingParameters.pdf) walks you through how to pass parameters between a pipeline and activity as well as between the activities.

  
## Functions  
 You can call functions within expressions. The following sections provide information about the functions that can be used in an expression.  

## String functions  
 The following functions only apply to strings. You can also use a number of the collection functions on strings.  
  
|Function name|Description|  
|-------------------|-----------------|  
|concat|Combines any number of strings together. For example, if parameter1 is `foo,` the following expression would return `somevalue-foo-somevalue`:  `concat('somevalue-',pipeline().parameters.parameter1,'-somevalue')`<br /><br /> **Parameter number**: 1 ... *n*<br /><br /> **Name**: String *n*<br /><br /> **Description**: Required. The strings to combine into a single string.|  
|substring|Returns a subset of characters from a string. For example, the following expression:<br /><br /> `substring('somevalue-foo-somevalue',10,3)`<br /><br /> returns:<br /><br /> `foo`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string from which the substring is taken.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Start index<br /><br /> **Description**: Required. The index of where the substring begins in parameter 1.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: Length<br /><br /> **Description**: Required. The length of the substring.|  
|replace|Replaces a string with a given string. For example, the  expression:<br /><br /> `replace('the old string', 'old', 'new')`<br /><br /> returns:<br /><br /> `the new string`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: string<br /><br /> **Description**: Required.  If parameter 2 is found in parameter 1, the string that is searched for parameter 2 and updated with parameter 3.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Old string<br /><br /> **Description**: Required. The string to replace with parameter 3 when a match is found in parameter 1<br /><br /> **Parameter number**: 3<br /><br /> **Name**: New string<br /><br /> **Description**: Required. The string that is used to replace the string in parameter 2 when a match is found in parameter 1.|  
|guid| Generates a globally unique string (aka. guid). For example, the following output could be generated `c2ecc88d-88c8-4096-912c-d6f2e2b138ce`:<br /><br /> `guid()`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. A single format specifier that indicates [how to format the value of this Guid](https://msdn.microsoft.com/library/97af8hh4%28v=vs.110%29.aspx). The format parameter can be "N", "D", "B", "P", or "X". If format is not provided, "D" is used.|  
|toLower|Converts a string to lowercase. For example, the following returns `two by two is four`:  `toLower('Two by Two is Four')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string to convert to lower casing. If a character in the string does not have a lowercase equivalent, it is included unchanged in the returned string.|  
|toUpper|Converts a string to uppercase. For example, the following expression returns `TWO BY TWO IS FOUR`:  `toUpper('Two by Two is Four')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string to convert to upper casing. If a character in the string does not have an uppercase equivalent, it is included unchanged in the returned string.|  
|indexof|Find the index of a value within a string case insensitively. For example, the following expression returns `7`: `indexof('hello, world.', 'world')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that may contain the value.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: String<br /><br /> **Description**: Required. The value to search the index of.|  
|lastindexof|Find the last index of a value within a string case insensitively. For example, the following expression returns `3`: `lastindexof('foofoo', 'foo')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that may contain the value.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: String<br /><br /> **Description**: Required. The value to search the index of.|  
|startswith|Checks if the string starts with a value case insensitively. For example, the following expression returns `true`: `startswith('hello, world', 'hello')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that may contain the value.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: String<br /><br /> **Description**: Required. The value the string may start with.|  
|endswith|Checks if the string ends with a value case insensitively. For example, the following expression returns `true`: `endswith('hello, world', 'world')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that may contain the value.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: String<br /><br /> **Description**: Required. The value the string may end with.|  
|split|Splits the string using a separator. For example, the following expression returns `["a", "b", "c"]`: `split('a;b;c',';')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that is split.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: String<br /><br /> **Description**: Required. The separator.|  
  
  
## Collection functions  
 These functions operate over collections such as arrays, strings, and sometimes dictionaries.  
  
|Function name|Description|  
|-------------------|-----------------|  
|contains|Returns true if dictionary contains a key, list contains value, or string contains substring. For example, the following expression returns `true:``contains('abacaba','aca')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Within collection<br /><br /> **Description**: Required. The collection to search within.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Find object<br /><br /> **Description**: Required. The object to find inside the **Within collection**.|  
|length|Returns the number of elements in an array or string. For example, the following expression returns `3`:  `length('abc')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to get the length of.|  
|empty|Returns true if object, array, or string is empty. For example, the following expression returns `true`:<br /><br /> `empty('')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to check if it is empty.|  
|intersection|Returns a single array or object with the common elements between the arrays or objects passed to it. For example, this function returns `[1, 2]`:<br /><br /> `intersection([1, 2, 3], [101, 2, 1, 10],[6, 8, 1, 2])`<br /><br /> The parameters for the function can either be a set of objects or a set of arrays (not a mixture thereof). If there are two objects with the same name, the last object with that name appears in the final object.<br /><br /> **Parameter number**: 1 ... *n*<br /><br /> **Name**: Collection *n*<br /><br /> **Description**: Required. The collections to evaluate. An object must be in all collections passed in to appear in the result.|  
|union|Returns a single array or object with all of the elements that are in either array or object passed to it. For example, this function returns `[1, 2, 3, 10, 101]:`<br /><br /> :  `union([1, 2, 3], [101, 2, 1, 10])`<br /><br /> The parameters for the function can either be a set of objects or a set of arrays (not a mixture thereof). If there are two objects with the same name in the final output, the last object with that name appears in the final object.<br /><br /> **Parameter number**: 1 ... *n*<br /><br /> **Name**: Collection *n*<br /><br /> **Description**: Required. The collections to evaluate. An object that appears in any of the collections appears in the result.|  
|first|Returns the first element in the array or string passed in. For example, this function returns `0`:<br /><br /> `first([0,2,3])`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to take the first object from.|  
|last|Returns the last element in the array or string passed in. For example, this function returns `3`:<br /><br /> `last('0123')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to take the last object from.|  
|take|Returns the first **Count** elements from the array or string passed in, for example this function returns `[1, 2]`:  `take([1, 2, 3, 4], 2)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to take the first **Count** objects from.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Count<br /><br /> **Description**: Required. The number of objects to take from the **Collection**. Must be a positive integer.|  
|skip|Returns the elements in the array starting at index **Count**, for example this function returns `[3, 4]`:<br /><br /> `skip([1, 2 ,3 ,4], 2)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection<br /><br /> **Description**: Required. The collection to skip the first **Count** objects from.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Count<br /><br /> **Description**: Required. The number of objects to remove from the front of **Collection**. Must be a positive integer.|  
  
## Logical functions  
 These functions are useful inside conditions, they can be used to evaluate any type of logic.  
  
|Function name|Description|  
|-------------------|-----------------|  
|equals|Returns true if two values are equal. For example, if parameter1 is foo, the following expression would return `true`: `equals(pipeline().parameters.parameter1), 'foo')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Object 1<br /><br /> **Description**: Required. The object to compare to **Object 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Object 2<br /><br /> **Description**: Required. The object to compare to **Object 1**.|  
|less|Returns true if the first argument is less than the second. Note, values can only be of type integer, float, or string. For example, the following expression returns `true`:  `less(10,100)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Object 1<br /><br /> **Description**: Required. The object to check if it is less than **Object 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Object 2<br /><br /> **Description**: Required. The object to check if it is greater than **Object 1**.|  
|lessOrEquals|Returns true if the first argument is less than or equal to the second. Note, values can only be of type integer, float, or string. For example, the following expression returns `true`:  `lessOrEquals(10,10)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Object 1<br /><br /> **Description**: Required. The object to check if it is less or equal to **Object 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Object 2<br /><br /> **Description**: Required. The object to check if it is greater than or equal to **Object 1**.|  
|greater|Returns true if the first argument is greater than the second. Note, values can only be of type integer, float, or string. For example, the following expression returns `false`:  `greater(10,10)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Object 1<br /><br /> **Description**: Required. The object to check if it is greater than **Object 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Object 2<br /><br /> **Description**: Required. The object to check if it is less than **Object 1**.|  
|greaterOrEquals|Returns true if the first argument is greater than or equal to the second. Note, values can only be of type integer, float, or string. For example, the following expression returns `false`:  `greaterOrEquals(10,100)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Object 1<br /><br /> **Description**: Required. The object to check if it is greater than or equal to **Object 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Object 2<br /><br /> **Description**: Required. The object to check if it is less than or equal to **Object 1**.|  
|and|Returns true if both of the parameters are true. Both arguments need to be Booleans. The following returns `false`:  `and(greater(1,10),equals(0,0))`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Boolean 1<br /><br /> **Description**: Required. The first argument that must be `true`.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Boolean 2<br /><br /> **Description**: Required. The second argument must be `true`.|  
|or|Returns true if either of the parameters are true. Both arguments need to be Booleans. The following returns `true`:  `or(greater(1,10),equals(0,0))`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Boolean 1<br /><br /> **Description**: Required. The first argument that may be `true`.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Boolean 2<br /><br /> **Description**: Required. The second argument may be `true`.|  
|not|Returns true if the parameter is `false`. Both arguments need to be Booleans. The following returns `true`:  `not(contains('200 Success','Fail'))`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Boolean<br /><br /> **Description**: Returns true if the parameter is `false`. Both arguments need to be Booleans. The following returns `true`:  `not(contains('200 Success','Fail'))`|  
|if|Returns a specified value based on if the expression provided results in `true` or `false`.  For example, the following returns `"yes"`: `if(equals(1, 1), 'yes', 'no')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Expression<br /><br /> **Description**: Required. A boolean value that determines which value is returned by the expression.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: True<br /><br /> **Description**: Required. The value to return if the expression is `true`.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: False<br /><br /> **Description**: Required. The value to return if the expression is `false`.|  
  
## Conversion functions  
 These functions are used to convert between each of the native types in the language:  
  
-   string  
  
-   integer  
  
-   float  
  
-   boolean  
  
-   arrays  
  
-   dictionaries  
  
|Function name|Description|  
|-------------------|-----------------|  
|int|Convert the parameter to an integer. For example, the following expression returns 100 as a number, rather than a string:  `int('100')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to an integer.|  
|string|Convert the parameter to a string. For example, the following expression returns `'10'`:  `string(10)` You can also convert an object to a string, for example if the **foo** parameter is an object with one property `bar : baz`, then the following would return `{"bar" : "baz"}` `string(pipeline().parameters.foo)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to a string.|  
|json|Convert the parameter to a JSON type value. It is the opposite of string(). For example, the following expression returns `[1,2,3]` as an array, rather than a string:<br /><br /> `json('[1,2,3]')`<br /><br /> Likewise, you can convert a string to an object. For example, `json('{"bar" : "baz"}')` returns:<br /><br /> `{ "bar" : "baz" }`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string that is converted to a native type value.<br /><br /> The json function supports xml input as well. For example, the parameter value of:<br /><br /> `<?xml version="1.0"?> <root>   <person id='1'>     <name>Alan</name>     <occupation>Engineer</occupation>   </person> </root>`<br /><br /> is converted to the following json:<br /><br /> `{ "?xml": { "@version": "1.0" },   "root": {     "person": [     {       "@id": "1",       "name": "Alan",       "occupation": "Engineer"     }   ]   } }`|  
|float|Convert the parameter argument to a floating-point number. For example, the following expression returns `10.333`:  `float('10.333')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to a floating-point number.|  
|bool|Convert the parameter to a Boolean. For example, the following expression returns `false`:  `bool(0)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to a boolean.|  
|coalesce|Returns the first non-null object in the arguments passed in. Note: an empty string is not null. For example, if parameters 1 and 2 are not defined, this returns `fallback`:  `coalesce(pipeline().parameters.parameter1', pipeline().parameters.parameter2 ,'fallback')`<br /><br /> **Parameter number**: 1 ... *n*<br /><br /> **Name**: Object*n*<br /><br /> **Description**: Required. The objects to check for `null`.|  
|base64|Returns the base64 representation of the input string. For example, the following expression returns `c29tZSBzdHJpbmc=`:  `base64('some string')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String 1<br /><br /> **Description**: Required. The string to encode into base64 representation.|  
|base64ToBinary|Returns a binary representation of a base64 encoded string. For example, the following expression returns the binary representation of some string: `base64ToBinary('c29tZSBzdHJpbmc=')`.<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The base64 encoded string.|  
|base64ToString|Returns a string representation of a based64 encoded string. For example, the following expression returns some string: `base64ToString('c29tZSBzdHJpbmc=')`.<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The base64 encoded string.|  
|Binary|Returns a binary representation of a value.  For example, the following expression returns a binary representation of some string: `binary(‘some string’).`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to binary.|  
|dataUriToBinary|Returns a binary representation of a data URI. For example, the following expression returns the binary representation of some string: `dataUriToBinary('data:;base64,c29tZSBzdHJpbmc=')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The data URI to convert to binary representation.|  
|dataUriToString|Returns a string representation of a data URI. For example, the following expression returns some string: `dataUriToString('data:;base64,c29tZSBzdHJpbmc=')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br />**Description**: Required. The data URI to convert to String representation.|  
|dataUri|Returns a data URI of a value. For example, the following expression returns data: `text/plain;charset=utf8;base64,c29tZSBzdHJpbmc=: dataUri('some string')`<br /><br /> **Parameter number**: 1<br /><br />**Name**: Value<br /><br />**Description**: Required. The value to convert to data URI.|  
|decodeBase64|Returns a string representation of an input based64 string. For example, the following expression returns `some string`:  `decodeBase64('c29tZSBzdHJpbmc=')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Returns a string representation of an input based64 string.|  
|encodeUriComponent|URL-escapes the string that's passed in. For example, the following expression returns `You+Are%3ACool%2FAwesome`:  `encodeUriComponent('You Are:Cool/Awesome')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string to escape URL-unsafe characters from.|  
|decodeUriComponent|Un-URL-escapes the string that's passed in. For example, the following expression returns `You Are:Cool/Awesome`:  `encodeUriComponent('You+Are%3ACool%2FAwesome')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The string to decode the URL-unsafe characters from.|  
|decodeDataUri|Returns a binary representation of an input data URI string. For example, the following expression returns the binary representation of `some string`:  `decodeDataUri('data:;base64,c29tZSBzdHJpbmc=')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br /> **Description**: Required. The dataURI to decode into a binary representation.|  
|uriComponent|Returns a URI encoded representation of a value. For example, the following expression returns `You+Are%3ACool%2FAwesome: uriComponent('You Are:Cool/Awesome ')`<br /><br /> Parameter Details: Number: 1, Name: String, Description: Required. The string to be URI encoded.|  
|uriComponentToBinary|Returns a binary representation of a URI encoded string. For example, the following expression returns a binary representation of `You Are:Cool/Awesome`: `uriComponentToBinary('You+Are%3ACool%2FAwesome')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: String<br /><br />**Description**: Required. The URI encoded string.|  
|uriComponentToString|Returns a string representation of a URI encoded string. For example, the following expression returns `You Are:Cool/Awesome`: `uriComponentToString('You+Are%3ACool%2FAwesome')`<br /><br /> **Parameter number**: 1<br /><br />**Name**: String<br /><br />**Description**: Required. The URI encoded string.|  
|xml|Return an xml representation of the value. For example, the following expression returns an xml content represented by `'\<name>Alan\</name>'`: `xml('\<name>Alan\</name>')`. The xml function supports JSON object input as well. For example, the parameter `{ "abc": "xyz" }` is converted to an xml content `\<abc>xyz\</abc>`<br /><br /> **Parameter number**: 1<br /><br />**Name**: Value<br /><br />**Description**: Required. The value to convert to XML.|  
|xpath|Return an array of xml nodes matching the xpath expression of a value that the xpath expression evaluates to.<br /><br />  **Example 1**<br /><br /> Assume the value of parameter ‘p1’ is a string representation of the following XML:<br /><br /> `<?xml version="1.0"?> <lab>   <robot>     <parts>5</parts>     <name>R1</name>   </robot>   <robot>     <parts>8</parts>     <name>R2</name>   </robot> </lab>`<br /><br /> 1. This code: `xpath(xml(pipeline().parameters.p1), '/lab/robot/name')`<br /><br /> would return<br /><br /> `[ <name>R1</name>, <name>R2</name> ]`<br /><br /> whereas<br /><br /> 2. This code: `xpath(xml(pipeline().parameters.p1, ' sum(/lab/robot/parts)')`<br /><br /> would return<br /><br /> `13`<br /><br /> <br /><br /> **Example 2**<br /><br /> Given the following XML content:<br /><br /> `<?xml version="1.0"?> <File xmlns="http://foo.com">   <Location>bar</Location> </File>`<br /><br /> 1.  This code: `@xpath(xml(body('Http')), '/*[name()=\"File\"]/*[name()=\"Location\"]')`<br /><br /> or<br /><br /> 2. This code: `@xpath(xml(body('Http')), '/*[local-name()=\"File\" and namespace-uri()=\"http://foo.com\"]/*[local-name()=\"Location\" and namespace-uri()=\"\"]')`<br /><br /> returns<br /><br /> `<Location xmlns="http://foo.com">bar</Location>`<br /><br /> and<br /><br /> 3. This code: `@xpath(xml(body('Http')), 'string(/*[name()=\"File\"]/*[name()=\"Location\"])')`<br /><br /> returns<br /><br /> ``bar``<br /><br /> **Parameter number**: 1<br /><br />**Name**: Xml<br /><br />**Description**: Required. The XML on which to evaluate the XPath expression.<br /><br /> **Parameter number**: 2<br /><br />**Name**: XPath<br /><br />**Description**: Required. The XPath expression to evaluate.|  
|array|Convert the parameter to an array.  For example, the following expression returns `["abc"]`: `array('abc')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Value<br /><br /> **Description**: Required. The value that is converted to an array.|
|createArray|Creates an array from the parameters.  For example, the following expression returns `["a", "c"]`: `createArray('a', 'c')`<br /><br /> **Parameter number**: 1 ... n<br /><br /> **Name**: Any n<br /><br /> **Description**: Required. The values to combine into an array.|

## Math functions  
 These functions can be used for either types of numbers: **integers** and **floats**.  
  
|Function name|Description|  
|-------------------|-----------------|  
|add|Returns the result of the addition of the two numbers. For example, this function returns `20.333`:  `add(10,10.333)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Summand 1<br /><br /> **Description**: Required. The number to add to **Summand 2**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Summand 2<br /><br /> **Description**: Required. The number to add to **Summand 1**.|  
|sub|Returns the result of the subtraction of the two numbers. For example, this function returns: `-0.333`:<br /><br /> `sub(10,10.333)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Minuend<br /><br /> **Description**: Required. The number that **Subtrahend** is removed from.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Subtrahend<br /><br /> **Description**: Required. The number to remove from the **Minuend**.|  
|mul|Returns the result of the multiplication of the two numbers. For example, the following returns `103.33`:<br /><br /> `mul(10,10.333)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Multiplicand 1<br /><br /> **Description**: Required. The number to multiply **Multiplicand 2** with.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Multiplicand 2<br /><br /> **Description**: Required. The number to multiply **Multiplicand 1** with.|  
|div|Returns the result of the division of the two numbers. For example, the following returns `1.0333`:<br /><br /> `div(10.333,10)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Dividend<br /><br /> **Description**: Required. The number to divide by the **Divisor**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Divisor<br /><br /> **Description**: Required. The number to divide the **Dividend** by.|  
|mod|Returns the result of the remainder after the division of the two numbers (modulo). For example, the following expression returns `2`:<br /><br /> `mod(10,4)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Dividend<br /><br /> **Description**: Required. The number to divide by the **Divisor**.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Divisor<br /><br /> **Description**: Required. The number to divide the **Dividend** by. After the division, the remainder is taken.|  
|min|There are two different patterns for calling this function: `min([0,1,2])` Here min takes an array. This expression returns `0`. Alternatively, this function can take a comma-separated list of values:  `min(0,1,2)` This function also returns 0. Note, all values must be numbers, so if the parameter is an array it has to only have numbers in it.<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection or Value<br /><br /> **Description**: Required. It can either be an array of values to find the minimum value, or the first value of a set.<br /><br /> **Parameter number**: 2 ... *n*<br /><br /> **Name**: Value *n*<br /><br /> **Description**: Optional. If the first parameter is a Value, then you can pass additional values and the minimum of all passed values are returned.|  
|max|There are two different patterns for calling this function:  `max([0,1,2])`<br /><br /> Here max takes an array. This expression returns `2`. Alternatively, this function can take a comma-separated list of values:  `max(0,1,2)` This function returns 2. Note, all values must be numbers, so if the parameter is an array it has to only have numbers in it.<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Collection or Value<br /><br /> **Description**: Required. It can either be an array of values to find the maximum value, or the first value of a set.<br /><br /> **Parameter number**: 2 ... *n*<br /><br /> **Name**: Value *n*<br /><br /> **Description**: Optional. If the first parameter is a Value, then you can pass additional values and the maximum of all passed values are returned.|  
|range| Generates an array of integers starting from a certain number, and you define the length of the returned array. For example, this function returns `[3,4,5,6]`:<br /><br /> `range(3,4)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Start index<br /><br /> **Description**: Required. It is the first integer in the array.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Count<br /><br /> **Description**: Required. Number of integers that are in the array.|  
|rand| Generates a random integer within the specified range (inclusive on both ends. For example, this could return `42`:<br /><br /> `rand(-1000,1000)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Minimum<br /><br /> **Description**: Required. The lowest integer that could be returned.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Maximum<br /><br /> **Description**: Required. The highest integer that could be returned.|  
  
## Date functions  
  
|Function name|Description|  
|-------------------|-----------------|  
|utcnow|Returns the current timestamp as a string. For example `2015-03-15T13:27:36Z`:<br /><br /> `utcnow()`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|addseconds|Adds an integer number of seconds to a string timestamp passed in. The number of seconds can be positive or negative. The result is a string in ISO 8601 format ("o") by default, unless a format specifier is provided. For example `2015-03-15T13:27:00Z`:<br /><br /> `addseconds('2015-03-15T13:27:36Z', -36)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. A string that contains the time.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Seconds<br /><br /> **Description**: Required. The number of seconds to add. May be negative to subtract seconds.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|addminutes|Adds an integer number of minutes to a string timestamp passed in. The number of minutes can be positive or negative. The result is a string in ISO 8601 format ("o") by default, unless a format specifier is provided. For example, `2015-03-15T14:00:36Z`:<br /><br /> `addminutes('2015-03-15T13:27:36Z', 33)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. A string that contains the time.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Minutes<br /><br /> **Description**: Required. The number of minutes to add. May be negative to subtract minutes.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|addhours|Adds an integer number of hours to a string timestamp passed in. The number of hours can be positive or negative. The result is a string in ISO 8601 format ("o") by default, unless a format specifier is provided. For example `2015-03-16T01:27:36Z`:<br /><br /> `addhours('2015-03-15T13:27:36Z', 12)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. A string that contains the time.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Hours<br /><br /> **Description**: Required. The  number of hours to add. May be negative to subtract hours.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|adddays|Adds an integer number of days to a string timestamp passed in. The number of days can be positive or negative. The result is a string in ISO 8601 format ("o") by default, unless a format specifier is provided. For example `2015-02-23T13:27:36Z`:<br /><br /> `adddays('2015-03-15T13:27:36Z', -20)`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Timestamp<br /><br /> **Description**: Required. A string that contains the time.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Days<br /><br /> **Description**: Required. The number of days to add. May be negative to subtract days.<br /><br /> **Parameter number**: 3<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  
|formatDateTime|Returns a string in date format. The result is a string in ISO 8601 format ("o") by default, unless a format specifier is provided. For example `2015-02-23T13:27:36Z`:<br /><br /> `formatDateTime('2015-03-15T13:27:36Z', 'o')`<br /><br /> **Parameter number**: 1<br /><br /> **Name**: Date<br /><br /> **Description**: Required. A string that contains the date.<br /><br /> **Parameter number**: 2<br /><br /> **Name**: Format<br /><br /> **Description**: Optional. Either a [single format specifier character](https://msdn.microsoft.com/library/az4se3k1%28v=vs.110%29.aspx) or a [custom format pattern](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx) that indicates how to format the value of this timestamp. If format is not provided, the ISO 8601 format ("o") is used.|  

## Next steps
For a list of system variables you can use in expressions, see [System variables](control-flow-system-variables.md).
