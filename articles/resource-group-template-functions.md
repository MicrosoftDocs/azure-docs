<properties
   pageTitle="Resource Manager Template Functions | Microsoft Azure"
   description="Describes the functions to use in an Azure Resource Manager template to retrieve values, work with strings and numerics, and retrieve deployment information."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/11/2016"
   ms.author="tomfitz"/>

# Azure Resource Manager template functions

This topic describes all the functions you can use in an Azure Resource Manager template.

Template functions and their parameters are case-insensitive. For example, Resource Manager resolves **variables('var1')** and **VARIABLES('VAR1')** as the same. When evaluated, unless the function expressly modifies case (such as toUpper or toLower), the function preserves the case. Certain resource types may have case requirements irrespective of how functions are evaluated.

## Numeric functions

Resource Manager provides the following functions for working with integers:

- [add](#add)
- [copyIndex](#copyindex)
- [div](#div)
- [int](#int)
- [mod](#mod)
- [mul](#mul)
- [sub](#sub)


<a id="add" />
### add

**add(operand1, operand2)**

Returns the sum of the two provided integers.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| operand1                           |   Yes    | First integer to add.
| operand2                           |   Yes    | Second integer to add.

The following example adds two parameters.

    "parameters": {
      "first": {
        "type": "int",
        "metadata": {
          "description": "First integer to add"
        }
      },
      "second": {
        "type": "int",
        "metadata": {
          "description": "Second integer to add"
        }
      }
    },
    ...
    "outputs": {
      "addResult": {
        "type": "int",
        "value": "[add(parameters('first'), parameters('second'))]"
      }
    }

<a id="copyindex" />
### copyIndex

**copyIndex(offset)**

Returns the current index of an iteration loop. 

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| offset                           |   No    | The amount to add to current iteration value.

This function is always used with a **copy** object. For a complete description of how you use **copyIndex**, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

The following example shows a copy loop and the index value included in the name. 

    "resources": [ 
      { 
        "name": "[concat('examplecopy-', copyIndex())]", 
        "type": "Microsoft.Web/sites", 
        "copy": { 
          "name": "websitescopy", 
          "count": "[parameters('count')]" 
        }, 
        ...
      }
    ]


<a id="div" />
### div

**div(operand1, operand2)**

Returns the integer division of the two provided integers.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| operand1                           |   Yes    | Integer being divided.
| operand2                           |   Yes    | Integer that is used to divide. Cannot be 0.

The following example divides one parameter by another parameter.

    "parameters": {
      "first": {
        "type": "int",
        "metadata": {
          "description": "Integer being divided"
        }
      },
      "second": {
        "type": "int",
        "metadata": {
          "description": "Integer used to divide"
        }
      }
    },
    ...
    "outputs": {
      "divResult": {
        "type": "int",
        "value": "[div(parameters('first'), parameters('second'))]"
      }
    }

<a id="int" />
### int

**int(valueToConvert)**

Converts the specified value to Integer.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| valueToConvert                     |   Yes    | The value to convert to Integer. The type of value can only be String or Integer.

The following example converts the user-provided parameter value to Integer.

    "parameters": {
        "appId": { "type": "string" }
    },
    "variables": { 
        "intValue": "[int(parameters('appId'))]"
    }


<a id="mod" />
### mod

**mod(operand1, operand2)**

Returns the remainder of the integer division using the two provided integers.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| operand1                           |   Yes    | Integer being divided.
| operand2                           |   Yes    | Integer that is used to divide, has to be different from 0.

The following example returns the remainder of dividing one parameter by another parameter.

    "parameters": {
      "first": {
        "type": "int",
        "metadata": {
          "description": "Integer being divided"
        }
      },
      "second": {
        "type": "int",
        "metadata": {
          "description": "Integer used to divide"
        }
      }
    },
    ...
    "outputs": {
      "modResult": {
        "type": "int",
        "value": "[mod(parameters('first'), parameters('second'))]"
      }
    }

<a id="mul" />
### mul

**mul(operand1, operand2)**

Returns the multiplication of the two provided integers.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| operand1                           |   Yes    | First integer to multiply.
| operand2                           |   Yes    | Second integer to multiply.

The following example multiplies one parameter by another parameter.

    "parameters": {
      "first": {
        "type": "int",
        "metadata": {
          "description": "First integer to multiply"
        }
      },
      "second": {
        "type": "int",
        "metadata": {
          "description": "Second integer to multiply"
        }
      }
    },
    ...
    "outputs": {
      "mulResult": {
        "type": "int",
        "value": "[mul(parameters('first'), parameters('second'))]"
      }
    }

<a id="sub" />
### sub

**sub(operand1, operand2)**

Returns the subtraction of the two provided integers.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| operand1                           |   Yes    | Integer that is subtracted from.
| operand2                           |   Yes    | Integer that is subtracted.

The following example subtracts one parameter from another parameter.

    "parameters": {
      "first": {
        "type": "int",
        "metadata": {
          "description": "Integer subtracted from"
        }
      },
      "second": {
        "type": "int",
        "metadata": {
          "description": "Integer to subtract"
        }
      }
    },
    ...
    "outputs": {
      "subResult": {
        "type": "int",
        "value": "[sub(parameters('first'), parameters('second'))]"
      }
    }

## String functions

Resource Manager provides the following functions for working with strings:

- [base64](#base64)
- [concat](#concat)
- [length](#lengthstring)
- [padLeft](#padleft)
- [replace](#replace)
- [skip](#skipstring)
- [split](#split)
- [string](#string)
- [substring](#substring)
- [take](#takestring)
- [toLower](#tolower)
- [toUpper](#toupper)
- [trim](#trim)
- [uniqueString](#uniquestring)
- [uri](#uri)

To get the number of characters in a string or array, see [length](#length).

<a id="base64" />
### base64

**base64 (inputString)**

Returns the base64 representation of the input string.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| inputString                        |   Yes    | The string value to return as a base64 representation.

The following example shows how to use the base64 function.

    "variables": {
      "usernameAndPassword": "[concat('parameters('username'), ':', parameters('password'))]",
      "authorizationHeader": "[concat('Basic ', base64(variables('usernameAndPassword')))]"
    }

<a id="concat" />
### concat - string

**concat (string1, string2, string3, ...)**

Combines multiple string values and returns the concatenated string. 

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| string1                        |   Yes    | A string value to concatenate.
| additional strings             |   No     | String values to concatenate.

This function can take any number of arguments, and can accept either strings or arrays for the parameters. For an example of concatenating arrays, see [concat - array](#concatarray).

The following example shows how to combine multiple string values to return a concatenated string.

    "outputs": {
        "siteUri": {
          "type": "string",
          "value": "[concat('http://', reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
        }
    }


<a id="lengthstring" />
### length - string

**length(string)**

Returns the number of characters in a string.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| string                        |   Yes    | The string value to use for getting the number of characters.

For an example of using length with an array, see [length - array](#length).

The following example returns the number of characters in a string. 

    "parameters": {
        "appName": { "type": "string" }
    },
    "variables": { 
        "nameLength": "[length(parameters('appName'))]"
    }
        

<a id="padleft" />
### padLeft

**padLeft(valueToPad, totalLength, paddingCharacter)**

Returns a right-aligned string by adding characters to the left until reaching the total specified length.
  
| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| valueToPad                         |   Yes    | The string or int to right-align.
| totalLength                        |   Yes    | The total number of characters in the returned string.
| paddingCharacter                   |   No     | The character to use for left-padding until the total length is reached. The default value is a space.

The following example shows how to pad the user-provided parameter value by adding the zero character until the string reaches 10 characters. If the original parameter value is longer than 10 characters, no characters are added.

    "parameters": {
        "appName": { "type": "string" }
    },
    "variables": { 
        "paddedAppName": "[padLeft(parameters('appName'),10,'0')]"
    }

<a id="replace" />
### replace

**replace(originalString, oldCharacter, newCharacter)**

Returns a new string with all instances of one character in the specified string replaced by another character.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| originalString                     |   Yes    | The string that has all instances of one character replaced by another character.
| oldCharacter                       |   Yes    | The character to be removed from the original string.
| newCharacter                       |   Yes    | The character to add in place of the removed character.

The following example shows how to remove all dashes from the user-provided string.

    "parameters": {
        "identifier": { "type": "string" }
    },
    "variables": { 
        "newidentifier": "[replace(parameters('identifier'),'-','')]"
    }

<a id="skipstring" />
### skip - string
**skip(originalValue, numberToSkip)**

Returns a string with all the characters after the specified number in the string.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| originalValue                      |   Yes    | The string to use for skipping.
| numberToSkip                       |   Yes    | The number of characters to skip. If this value is 0 or less, all the characters in the string are returned. If it is larger than the length of the string, an empty string is returned. 

For an example of using skip with an array, see [skip - array](#skip).

The following example skips the specified number of characters in the string.

    "parameters": {
      "first": {
        "type": "string",
        "metadata": {
          "description": "Value to use for skipping"
        }
      },
      "second": {
        "type": "int",
        "metadata": {
          "description": "Number of characters to skip"
        }
      }
    },
    "resources": [
    ],
    "outputs": {
      "return": {
        "type": "string",
        "value": "[skip(parameters('first'),parameters('second'))]"
      }
    }


<a id="split" />
### split

**split(inputString, delimiterString)**

**split(inputString, delimiterArray)**

Returns an array of strings that contains the substrings of the input string that are delimited by the specified delimiters.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| inputString                        |   Yes    | The string to split.
| delimiter                          |   Yes    | The delimiter to use, can be a single string or an array of strings.

The following example splits the input string with a comma.

    "parameters": {
        "inputString": { "type": "string" }
    },
    "variables": { 
        "stringPieces": "[split(parameters('inputString'), ',')]"
    }

The next example splits the input string with either a comma or a semi-colon.

    "variables": {
      "stringToSplit": "test1,test2;test3",
      "delimiters": [ ",", ";" ]
    },
    "resources": [ ],
    "outputs": {
      "exampleOutput": {
        "value": "[split(variables('stringToSplit'), variables('delimiters'))]",
        "type": "array"
      }
    }

<a id="string" />
### string

**string(valueToConvert)**

Converts the specified value to a string.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| valueToConvert                     |   Yes    | The value to convert to string. Any type of value can be converted, including objects and arrays.

The following example converts the user-provided parameter values to strings.

    "parameters": {
      "jsonObject": {
        "type": "object",
        "defaultValue": {
          "valueA": 10,
          "valueB": "Example Text"
        }
      },
      "jsonArray": {
        "type": "array",
        "defaultValue": [ "a", "b", "c" ]
      },
      "jsonInt": {
        "type": "int",
        "defaultValue": 5
      }
    },
    "variables": { 
      "objectString": "[string(parameters('jsonObject'))]",
      "arrayString": "[string(parameters('jsonArray'))]",
      "intString": "[string(parameters('jsonInt'))]"
    }

<a id="substring" />
### substring

**substring(stringToParse, startIndex, length)**

Returns a substring that starts at the specified character position and contains the specified number of characters.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| stringToParse                     |   Yes    | The original string from which the substring is extracted.
| startIndex                         | No      | The zero-based starting character position for the substring.
| length                             | No      | The number of characters for the substring.

The following example extracts the first three characters from a parameter.

    "parameters": {
        "inputString": { "type": "string" }
    },
    "variables": { 
        "prefix": "[substring(parameters('inputString'), 0, 3)]"
    }

<a id="takestring" />
### take - string
**take(originalValue, numberToTake)**

Returns a string with the specified number of characters from the start of the string.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| originalValue                      |   Yes    | The string to take the characters from.
| numberToTake                       |   Yes    | The number of characters to take. If this value is 0 or less, an empty string is returned. If it is larger than the length of the given string, all the characters in the string are returned.

For an example of using take with an array, see [take - array](#take).

The following example takes the specified number of characters from the string.

    "parameters": {
      "first": {
        "type": "string",
        "metadata": {
          "description": "Value to use for taking"
        }
      },
      "second": {
        "type": "int",
        "metadata": {
          "description": "Number of characters to take"
        }
      }
    },
    "resources": [
    ],
    "outputs": {
      "return": {
        "type": "string",
        "value": "[take(parameters('first'), parameters('second'))]"
      }
    }

<a id="tolower" />
### toLower

**toLower(stringToChange)**

Converts the specified string to lower case.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| stringToChange                     |   Yes    | The string to convert to lower case.

The following example converts the user-provided parameter value to lower case.

    "parameters": {
        "appName": { "type": "string" }
    },
    "variables": { 
        "lowerCaseAppName": "[toLower(parameters('appName'))]"
    }

<a id="toupper" />
### toUpper

**toUpper(stringToChange)**

Converts the specified string to upper case.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| stringToChange                     |   Yes    | The string to convert to upper case.

The following example converts the user-provided parameter value to upper case.

    "parameters": {
        "appName": { "type": "string" }
    },
    "variables": { 
        "upperCaseAppName": "[toUpper(parameters('appName'))]"
    }

<a id="trim" />
### trim

**trim (stringToTrim)**

Removes all leading and trailing white-space characters from the specified string.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| stringToTrim                       |   Yes    | The string to trim.

The following example trims the white-space characters from the user-provided parameter value.

    "parameters": {
        "appName": { "type": "string" }
    },
    "variables": { 
        "trimAppName": "[trim(parameters('appName'))]"
    }

<a id="uniquestring" />
### uniqueString

**uniqueString (baseString, ...)**

Creates a unique string based on the values provided as parameters. 

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| baseString      |   Yes    | The string used in the hash function to create a unique string.
| additional parameters as needed    | No       | You can add as many strings as needed to create the value that specifies the level of uniqueness.

This function is helpful when you need to create a unique name for a resource. You provide parameter values that represent the level of uniqueness for the result. You can specify whether the name is unique for your subscription, resource group, or deployment. 

The returned value is not a random string, but rather the result of a hash function. The returned value is 13 characters long. It is not guaranteed to be globally unique. You may want to combine the value with a prefix from your naming convention to create a name that is easier to recognize. The following example shows the format of the returned value. Of course, the actual value will vary by the provided parameters.

    tcvhiyu5h2o5o

The following examples show how to use uniqueString to create a unique value for commonly used levels.

Unique based on subscription

    "[uniqueString(subscription().subscriptionId)]"

Unique based on resource group

    "[uniqueString(resourceGroup().id)]"

Unique based on deployment for a resource group

    "[uniqueString(resourceGroup().id, deployment().name)]"
    
The following example shows how to create a unique name for a storage account based on your resource group.

    "resources": [{ 
        "name": "[concat('contosostorage', uniqueString(resourceGroup().id))]", 
        "type": "Microsoft.Storage/storageAccounts", 
        ...



<a id="uri" />
### uri

**uri (baseUri, relativeUri)**

Creates an absolute URI by combining the baseUri and the relativeUri string.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| baseUri                            |   Yes    | The base uri string.
| relativeUri                        |   Yes    | The relative uri string to add to the base uri string.

The value for the **baseUri** parameter can include a specific file, but only the base path is used when constructing the URI. For example, passing **http://contoso.com/resources/azuredeploy.json** as the baseUri parameter results in a base URI of **http://contoso.com/resources/**.

The following example shows how to construct a link to a nested template based on the value of the parent template.

    "templateLink": "[uri(deployment().properties.templateLink.uri, 'nested/azuredeploy.json')]"

## Array functions

Resource Manager provides several functions for working with array values.

- [concat](#concatarray)
- [length](#length)
- [skip](#skip)
- [take](#take)

To get an array of string values delimited by a value, see [split](#split).

<a id="concatarray" />
### concat - array

**concat (array1, array2, array3, ...)**

Combines multiple arrays and returns the concatenated array. 

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| array1                        |   Yes    | An array to concatenate.
| additional arrays             |   No     | Arrays to concatenate.

This function can take any number of arguments, and can accept either strings or arrays for the parameters. For an example of concatenating string values, see [concat - string](#concat).

The following example shows how to combine two arrays.

    "parameters": {
        "firstarray": {
            type: "array"
        }
        "secondarray": {
            type: "array"
        }
     },
     "variables": {
         "combinedarray": "[concat(parameters('firstarray'), parameters('secondarray'))]
     }
        

<a id="length" />
### length - array

**length(array)**

Returns the number of elements in an array.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| array                        |   Yes    | The array to use for getting the number of elements.

You can use this function with an array to specify the number of iterations when creating resources. In the following example, the parameter **siteNames** would refer to an array of names to use when creating the web sites.

    "copy": {
        "name": "websitescopy",
        "count": "[length(parameters('siteNames'))]"
    }

For more information about using this function with an array, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md). 

For an example of using length with a string value, see [length - string](#lengthstring).

<a id="skip" />
### skip - array
**skip(originalValue, numberToSkip)**

Returns an array with all the elements after the specified number in the array.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| originalValue                      |   Yes    | The array to use for skipping.
| numberToSkip                       |   Yes    | The number of elements to skip. If this value is 0 or less, all the elements in the array are returned. If it is larger than the length of the array, an empty array is returned. 

For an example of using skip with a string, see [skip - string](#skipstring).

The following example skips the specified number of elements in the array.

    "parameters": {
      "first": {
        "type": "array",
        "metadata": {
          "description": "Values to use for skipping"
        },
        "defaultValue": [ "one", "two", "three" ]
      },
      "second": {
        "type": "int",
        "metadata": {
          "description": "Number of elements to skip"
        }
      }
    },
    "resources": [
    ],
    "outputs": {
      "return": {
        "type": "array",
        "value": "[skip(parameters('first'), parameters('second'))]"
      }
    }

<a id="take" />
### take - array
**take(originalValue, numberToTake)**

Returns an array with the specified number of elements from the start of the array.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| originalValue                      |   Yes    | The array to take the elements from.
| numberToTake                       |   Yes    | The number of elements to take. If this value is 0 or less, an empty array is returned. If it is larger than the length of the given array, all the elements in the array are returned.

For an example of using take with a string, see [take - string](#takestring).

The following example takes the specified number of elements from the array.

    "parameters": {
      "first": {
        "type": "array",
        "metadata": {
          "description": "Values to use for taking"
        },
        "defaultValue": [ "one", "two", "three" ]
      },
      "second": {
        "type": "int",
        "metadata": {
          "description": "Number of elements to take"
        }
      }
    },
    "resources": [
    ],
    "outputs": {
      "return": {
        "type": "array",
        "value": "[take(parameters('first'),parameters('second'))]"
      }
    }

## Deployment value functions

Resource Manager provides the following functions for getting values from sections of the template and values related to the deployment:

- [deployment](#deployment)
- [parameters](#parameters)
- [variables](#variables)

To get values from resources, resource groups, or subscriptions, see [Resource functions](#resource-functions).

<a id="deployment" />
### deployment

**deployment()**

Returns information about the current deployment operation.

This function returns the object that is passed during deployment. The properties in the returned object differ based on whether the deployment object is passed as a link or as an in-line object. 

When the deployment object is passed in-line, such as when using the **-TemplateFile** parameter in Azure PowerShell to point to a local file, the returned object has the following format:

    {
        "name": "",
        "properties": {
            "template": {
                "$schema": "",
                "contentVersion": "",
                "parameters": {},
                "variables": {},
                "resources": [
                ],
                "outputs": {}
            },
            "parameters": {},
            "mode": "",
            "provisioningState": ""
        }
    }

When the object is passed as a link, such as when using the **-TemplateUri** parameter to point to a remote object, the object is returned in the following format. 

    {
        "name": "",
        "properties": {
            "templateLink": {
                "uri": ""
            },
            "template": {
                "$schema": "",
                "contentVersion": "",
                "parameters": {},
                "variables": {},
                "resources": [],
                "outputs": {}
            },
            "parameters": {},
            "mode": "",
            "provisioningState": ""
        }
    }

The following example shows how to use deployment() to link to another template based on the URI of the parent template.

    "variables": {  
        "sharedTemplateUrl": "[uri(deployment().properties.templateLink.uri, 'shared-resources.json')]"  
    }  

<a id="parameters" />
### parameters

**parameters (parameterName)**

Returns a parameter value. The specified parameter name must be defined in the parameters section of the template.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| parameterName                      |   Yes    | The name of the parameter to return.

The following example shows a simplified use of the parameters function.

    "parameters": { 
      "siteName": {
          "type": "string"
      }
    },
    "resources": [
       {
          "apiVersion": "2014-06-01",
          "name": "[parameters('siteName')]",
          "type": "Microsoft.Web/Sites",
          ...
       }
    ]

<a id="variables" />
### variables

**variables (variableName)**

Returns the value of variable. The specified variable name must be defined in the variables section of the template.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| variable Name                      |   Yes    | The name of the variable to return.

The following example uses a variable value.

    "variables": {
      "storageName": "[concat('storage', uniqueString(resourceGroup().id))]"
    },
    "resources": [
      {
        "type": "Microsoft.Storage/storageAccounts",
        "name": "[variables('storageName')]",
        ...
      }
    ],

## Resource functions

Resource Manager provides the following functions for getting resource values:

- [listKeys and list{Value}](#listkeys)
- [providers](#providers)
- [reference](#reference)
- [resourceGroup](#resourcegroup)
- [resourceId](#resourceid)
- [subscription](#subscription)

To get values from parameters, variables, or the current deployment, see [Deployment value functions](#deployment-value-functions).

<a id="listkeys" />
<a id="list" />
### listKeys and list{Value}

**listKeys (resourceName or resourceIdentifier, apiVersion)**

**list{Value} (resourceName or resourceIdentifier, apiVersion)**

Returns the values for any resource type that supports the list operation. The most common usage is **listKeys**. 
  
| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| resourceName or resourceIdentifier |   Yes    | Unique identifier for the resource.
| apiVersion                         |   Yes    | API version of resource runtime state.

Any operation that starts with **list** can be used a function in your template. The available operations not olnly **listKeys**, but also operations like **list**, **listAdminKeys**, and **listStatus**. To determine which resource types have a list operation, use the following PowerShell command.

    Get-AzureRmProviderOperation -OperationSearchString *  | where {$_.Operation -like "*list*"} | FT Operation

Or, retrieve the list with Azure CLI. The following example retrieves all the operations for **apiapps**, and uses the JSON utility [jq](http://stedolan.github.io/jq/download/) to filter only the list operations.

    azure provider operations show --operationSearchString */apiapps/* --json | jq ".[] | select (.operation | contains(\"list\"))"

The resourceId can be specified by using the [resourceId function](./#resourceid) or by using the format **{providerNamespace}/{resourceType}/{resourceName}**. You can use the function to get the primaryKey and secondaryKey.

The following example shows how to return the keys from a storage account in the outputs section.

    "outputs": { 
      "listKeysOutput": { 
        "value": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2016-01-01')]", 
        "type" : "object" 
      } 
    } 

The returned object from listKeys has the following format:

    {
      "keys": [
        {
          "keyName": "key1",
          "permissions": "Full",
          "value": "{value}"
        },
        {
          "keyName": "key2",
          "permissions": "Full",
          "value": "{value}"
        }
      ]
    }

<a id="providers" />
### providers

**providers (providerNamespace, [resourceType])**

Returns information about a resource provider and its supported resource types. If you do not provide a resource type, the function returns all the supported types for the resource provider.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| providerNamespace                  |   Yes    | Namespace of the provider
| resourceType                       |   No     | The type of resource within the specified namespace.

Each supported type is returned in the following format. Array ordering is not guaranteed.

    {
        "resourceType": "",
        "locations": [ ],
        "apiVersions": [ ]
    }

The following example shows how to use the provider function:

    "outputs": {
	    "exampleOutput": {
		    "value": "[providers('Microsoft.Storage', 'storageAccounts')]",
		    "type" : "object"
	    }
    }

<a id="reference" />
### reference

**reference (resourceName or resourceIdentifier, [apiVersion])**

Enables an expression to derive its value from another resource's runtime state.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| resourceName or resourceIdentifier |   Yes    | Name or unique identifier of a resource.
| apiVersion                         |   No     | API version of the specified resource. Include this parameter when the resource is not provisioned within same template.

The **reference** function derives its value from a runtime state, and therefore cannot be used in the variables section. It can be used in outputs section of a template.

By using the reference function, you implicitly declare that one resource depends on another resource if the referenced resource is provisioned within same template. You do not need to also use the **dependsOn** property. 
The function is not evaluated until the referenced resource has completed deployment.

The following example references a storage account that is deployed in the same template.

    "outputs": {
		"NewStorage": {
			"value": "[reference(parameters('storageAccountName'))]",
			"type" : "object"
		}
	}

The following example references a storage account that is not deployed in this template, but exists within the same resource group as the resources being deployed.

    "outputs": {
		"ExistingStorage": {
			"value": "[reference(concat('Microsoft.Storage/storageAccounts/', parameters('storageAccountName')), '2016-01-01')]",
			"type" : "object"
		}
	}

You can retrieve a particular value from the returned object, such as the blob endpoint URI, as shown in the following example.

    "outputs": {
		"BlobUri": {
			"value": "[reference(concat('Microsoft.Storage/storageAccounts/', parameters('storageAccountName')), '2016-01-01').primaryEndpoints.blob]",
			"type" : "string"
		}
	}

The following example references a storage account in a different resource group.

    "outputs": {
		"BlobUri": {
			"value": "[reference(resourceId(parameters('relatedGroup'), 'Microsoft.Storage/storageAccounts/', parameters('storageAccountName')), '2016-01-01').primaryEndpoints.blob]",
			"type" : "string"
		}
	}

The properties on the returned object vary by the resource type.

<a id="resourcegroup" />
### resourceGroup

**resourceGroup()**

Returns a structured object that represents the current resource group. The returned object is in the following format:

    {
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
      "name": "{resourceGroupName}",
      "location": "{resourceGroupLocation}",
    }

The following example uses the resource group location to assign the location for a web site.

    "resources": [
       {
          "apiVersion": "2014-06-01",
          "type": "Microsoft.Web/sites",
          "name": "[parameters('siteName')]",
          "location": "[resourceGroup().location]",
          ...
       }
    ]

<a id="resourceid" />
### resourceId

**resourceId ([subscriptionId], [resourceGroupName], resourceType, resourceName1, [resourceName2]...)**

Returns the unique identifier of a resource. You use this function when the resource name is ambiguous or not provisioned within the same template. The identifier is returned in the following format:

    /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/{resourceProviderNamespace}/{resourceType}/{resourceName}
      
| Parameter         | Required | Description
| :---------------: | :------: | :----------
| subscriptionId    |   No     | Default value is the current subscription. Specify this value when you need to retrieve a resource in another subscription.
| resourceGroupName |   No     | Default value is current resource group. Specify this value when you need to retrieve a resource in another resource group.
| resourceType      |   Yes    | Type of resource including resource provider namespace.
| resourceName1     |   Yes    | Name of resource.
| resourceName2     |   No     | Next resource name segment if resource is nested.

The following example shows how to retrieve the resource ids for a web site and a database. The web site exists in a resource group named **myWebsitesGroup** and the database exists in the current resource group for this template.

    [resourceId('myWebsitesGroup', 'Microsoft.Web/sites', parameters('siteName'))]
    [resourceId('Microsoft.SQL/servers/databases', parameters('serverName'), parameters('databaseName'))]
    
Often, you need to use this function when using a storage account or virtual network in an alternate resource group. The storage account or virtual network may be used across multiple resource groups; therefore, you do not want to delete them when deleting a single resource group. The following example shows how a resource from an external resource group can easily be used:

    {
      "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
          "virtualNetworkName": {
              "type": "string"
          },
          "virtualNetworkResourceGroup": {
              "type": "string"
          },
          "subnet1Name": {
              "type": "string"
          },
          "nicName": {
              "type": "string"
          }
      },
      "variables": {
          "vnetID": "[resourceId(parameters('virtualNetworkResourceGroup'), 'Microsoft.Network/virtualNetworks', parameters('virtualNetworkName'))]",
          "subnet1Ref": "[concat(variables('vnetID'),'/subnets/', parameters('subnet1Name'))]"
      },
      "resources": [
      {
          "apiVersion": "2015-05-01-preview",
          "type": "Microsoft.Network/networkInterfaces",
          "name": "[parameters('nicName')]",
          "location": "[parameters('location')]",
          "properties": {
              "ipConfigurations": [{
                  "name": "ipconfig1",
                  "properties": {
                      "privateIPAllocationMethod": "Dynamic",
                      "subnet": {
                          "id": "[variables('subnet1Ref')]"
                      }
                  }
              }]
           }
      }]
    }

<a id="subscription" />
### subscription

**subscription()**

Returns details about the subscription in the following format.

    {
        "id": "/subscriptions/#####",
        "subscriptionId": "#####",
        "tenantId": "#####"
    }

The following example shows the subscription function called in the outputs section. 

    "outputs": { 
      "exampleOutput": { 
          "value": "[subscription()]", 
          "type" : "object" 
      } 
    } 


## Next Steps
- For a description of the sections in an Azure Resource Manager template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md)
- To merge multiple templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md)
- To iterate a specified number of times when creating a type of resource, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md)
- To see how to deploy the template you have created, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md)

