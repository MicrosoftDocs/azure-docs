---
title: Resource Manager Template Functions | Microsoft Docs
description: Describes the functions to use in an Azure Resource Manager template to retrieve values, work with strings and numerics, and retrieve deployment information.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 0644abe1-abaa-443d-820d-1966d7d26bfd
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/14/2017
ms.author: tomfitz

---
# Azure Resource Manager template functions
This topic describes all the functions you can use in an Azure Resource Manager template.

Template functions and their parameters are case-insensitive. For example, Resource Manager resolves **variables('var1')** and **VARIABLES('VAR1')** as the same. When evaluated, unless the function expressly modifies case (such as toUpper or toLower), the function preserves the case. Certain resource types may have case requirements irrespective of how functions are evaluated.

## Numeric functions
Resource Manager provides the following functions for working with integers:

* [add](#add)
* [copyIndex](#copyindex)
* [div](#div)
* [int](#int)
* [mod](#mod)
* [mul](#mul)
* [sub](#sub)

<a id="add" />

### add
`add(operand1, operand2)`

Returns the sum of the two provided integers.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- | 
|operand1 |Yes |Integer |First number to add. |
|operand2 |Yes |Integer |Second number to add. |

The following example adds two parameters.

```json
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
```

<a id="copyindex" />

### copyIndex
`copyIndex(offset)`

Returns the index of an iteration loop. 

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| offset |No |Integer |The number to add to the zero-based iteration value. |

This function is always used with a **copy** object. If no value is provided for **offset**, the current iteration value is returned. The iteration value starts at zero. For a complete description of how you use **copyIndex**, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

The following example shows a copy loop and the index value included in the name. 

```json
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
```

<a id="div" />

### div
`div(operand1, operand2)`

Returns the integer division of the two provided integers.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |Integer |The number being divided. |
| operand2 |Yes |Integer |The number that is used to divide. Cannot be 0. |

The following example divides one parameter by another parameter.

```json
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
```

<a id="int" />

### int
`int(valueToConvert)`

Converts the specified value to an integer.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToConvert |Yes |String or Integer |The value to convert to an integer. |

The following example converts the user-provided parameter value to Integer.

```json
"parameters": {
    "appId": { "type": "string" }
},
"variables": { 
    "intValue": "[int(parameters('appId'))]"
}
```

<a id="mod" />

### mod
`mod(operand1, operand2)`

Returns the remainder of the integer division using the two provided integers.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |Integer |The number being divided. |
| operand2 |Yes |Integer |The number that is used to divide, Cannot be 0. |

The following example returns the remainder of dividing one parameter by another parameter.

```json
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
```

<a id="mul" />

### mul
`mul(operand1, operand2)`

Returns the multiplication of the two provided integers.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |Integer |First number to multiply. |
| operand2 |Yes |Integer |Second number to multiply. |

The following example multiplies one parameter by another parameter.

```json
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
```

<a id="sub" />

### sub
`sub(operand1, operand2)`

Returns the subtraction of the two provided integers.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |Integer |The number that is subtracted from. |
| operand2 |Yes |Integer |The number that is subtracted. |

The following example subtracts one parameter from another parameter.

```json
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
```

## String functions
Resource Manager provides the following functions for working with strings:

* [base64](#base64)
* [concat](#concat)
* [length](#lengthstring)
* [padLeft](#padleft)
* [replace](#replace)
* [skip](#skipstring)
* [split](#split)
* [string](#string)
* [substring](#substring)
* [take](#takestring)
* [toLower](#tolower)
* [toUpper](#toupper)
* [trim](#trim)
* [uniqueString](#uniquestring)
* [uri](#uri)

<a id="base64" />

### base64
`base64 (inputString)`

Returns the base64 representation of the input string.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputString |Yes |String |The value to return as a base64 representation. |

The following example shows how to use the base64 function.

```json
"variables": {
  "usernameAndPassword": "[concat(parameters('username'), ':', parameters('password'))]",
  "authorizationHeader": "[concat('Basic ', base64(variables('usernameAndPassword')))]"
}
```

<a id="concat" />

### concat - string
`concat (string1, string2, string3, ...)`

Combines multiple string values and returns the concatenated string. 

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| string1 |Yes |String |The first value for concatenation. |
| additional strings |No |String |Additional values in sequential order for concatenation. |

This function can take any number of arguments, and can accept either strings or arrays for the parameters. For an example of concatenating arrays, see [concat - array](#concatarray).

The following example shows how to combine multiple string values to return a concatenated string.

```json
"outputs": {
    "siteUri": {
      "type": "string",
      "value": "[concat('http://', reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
    }
}
```

<a id="lengthstring" />

### length - string
`length(string)`

Returns the number of characters in a string.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| string |Yes |String |The value to use for getting the number of characters. |

For an example of using length with an array, see [length - array](#length).

The following example returns the number of characters in a string. 

```json
"parameters": {
    "appName": { "type": "string" }
},
"variables": { 
    "nameLength": "[length(parameters('appName'))]"
}
```

<a id="padleft" />

### padLeft
`padLeft(valueToPad, totalLength, paddingCharacter)`

Returns a right-aligned string by adding characters to the left until reaching the total specified length.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToPad |Yes |String or Integer |The value to right-align. |
| totalLength |Yes |Integer |The total number of characters in the returned string. |
| paddingCharacter |No |Single character |The character to use for left-padding until the total length is reached. The default value is a space. |

The following example shows how to pad the user-provided parameter value by adding the zero character until the string reaches 10 characters. If the original parameter value is longer than 10 characters, no characters are added.

```json
"parameters": {
    "appName": { "type": "string" }
},
"variables": { 
    "paddedAppName": "[padLeft(parameters('appName'),10,'0')]"
}
```

<a id="replace" />

### replace
`replace(originalString, oldCharacter, newCharacter)`

Returns a new string with all instances of one character in the specified string replaced by another character.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalString |Yes |String |The value that has all instances of one character replaced by another character. |
| oldCharacter |Yes |String |The character to be removed from the original string. |
| newCharacter |Yes |String |The character to add in place of the removed character. |

The following example shows how to remove all dashes from the user-provided string.

```json
"parameters": {
    "identifier": { "type": "string" }
},
"variables": { 
    "newidentifier": "[replace(parameters('identifier'),'-','')]"
}
```

<a id="skipstring" />

### skip - string
`skip(originalValue, numberToSkip)`

Returns a string with all the characters after the specified number in the string.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |String |The string to use for skipping. |
| numberToSkip |Yes |Integer |The number of characters to skip. If this value is 0 or less, all the characters in the string are returned. If it is larger than the length of the string, an empty string is returned. |

For an example of using skip with an array, see [skip - array](#skip).

The following example skips the specified number of characters in the string.

```json
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
```

<a id="split" />

### split
`split(inputString, delimiterString)`

`split(inputString, delimiterArray)`

Returns an array of strings that contains the substrings of the input string that are delimited by the specified delimiters.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputString |Yes |String |The string to split. |
| delimiter |Yes |String or Array of strings |The delimiter to use for splitting the string. |

The following example splits the input string with a comma.

```json
"parameters": {
    "inputString": { "type": "string" }
},
"variables": { 
    "stringPieces": "[split(parameters('inputString'), ',')]"
}
```

The next example splits the input string with either a comma or a semi-colon.

```json
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
```

<a id="string" />

### string
`string(valueToConvert)`

Converts the specified value to a string.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToConvert |Yes | Any |The value to convert to string. Any type of value can be converted, including objects and arrays. |

The following example converts the user-provided parameter values to strings.

```json
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
```

<a id="substring" />

### substring
`substring(stringToParse, startIndex, length)`

Returns a substring that starts at the specified character position and contains the specified number of characters.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToParse |Yes |String |The original string from which the substring is extracted. |
| startIndex |No |Integer |The zero-based starting character position for the substring. |
| length |No |Integer |The number of characters for the substring. Must refer to a location within the string. |

The following example extracts the first three characters from a parameter.

```json
"parameters": {
    "inputString": { "type": "string" }
},
"variables": { 
    "prefix": "[substring(parameters('inputString'), 0, 3)]"
}
```

The following example will fail with the error "The index and length parameters must refer to a location within the string. The index parameter: '0', the length parameter: '11', the length of the string parameter: '10'.".

```json
"parameters": {
    "inputString": { "type": "string", "value": "1234567890" }
},
"variables": { 
    "prefix": "[substring(parameters('inputString'), 0, 11)]"
}
```

<a id="takestring" />

### take - string
`take(originalValue, numberToTake)`

Returns a string with the specified number of characters from the start of the string.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |String |The value to take the characters from. |
| numberToTake |Yes |Integer |The number of characters to take. If this value is 0 or less, an empty string is returned. If it is larger than the length of the given string, all the characters in the string are returned. |

For an example of using take with an array, see [take - array](#take).

The following example takes the specified number of characters from the string.

```json
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
```

<a id="tolower" />

### toLower
`toLower(stringToChange)`

Converts the specified string to lower case.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToChange |Yes |String |The value to convert to lower case. |

The following example converts the user-provided parameter value to lower case.

```json
"parameters": {
    "appName": { "type": "string" }
},
"variables": { 
    "lowerCaseAppName": "[toLower(parameters('appName'))]"
}
```

<a id="toupper" />

### toUpper
`toUpper(stringToChange)`

Converts the specified string to upper case.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToChange |Yes |String |The value to convert to upper case. |

The following example converts the user-provided parameter value to upper case.

```json
"parameters": {
    "appName": { "type": "string" }
},
"variables": { 
    "upperCaseAppName": "[toUpper(parameters('appName'))]"
}
```

<a id="trim" />

### trim
`trim (stringToTrim)`

Removes all leading and trailing white-space characters from the specified string.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToTrim |Yes |String |The value to trim. |

The following example trims the white-space characters from the user-provided parameter value.

```json
"parameters": {
    "appName": { "type": "string" }
},
"variables": { 
    "trimAppName": "[trim(parameters('appName'))]"
}
```

<a id="uniquestring" />

### uniqueString
`uniqueString (baseString, ...)`

Creates a deterministic hash string based on the values provided as parameters. 

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| baseString |Yes |String |The value used in the hash function to create a unique string. |
| additional parameters as needed |No |String |You can add as many strings as needed to create the value that specifies the level of uniqueness. |

This function is helpful when you need to create a unique name for a resource. You provide parameter values that limit the scope of uniqueness for the result. You can specify whether the name is unique down to subscription, resource group, or deployment. 

The returned value is not a random string, but rather the result of a hash function. The returned value is 13 characters long. It is not globally unique. You may want to combine the value with a prefix from your naming convention to create a name that is meaningful. The following example shows the format of the returned value. The actual value varies by the provided parameters.

    tcvhiyu5h2o5o

The following examples show how to use uniqueString to create a unique value for commonly used levels.

Unique scoped to subscription

```json
"[uniqueString(subscription().subscriptionId)]"
```

Unique scoped to resource group

```json
"[uniqueString(resourceGroup().id)]"
```

Unique scoped to deployment for a resource group

```json
"[uniqueString(resourceGroup().id, deployment().name)]"
```

The following example shows how to create a unique name for a storage account based on your resource group. Inside the resource group, the name is not unique if constructed the same way.

```json
"resources": [{ 
    "name": "[concat('storage', uniqueString(resourceGroup().id))]", 
    "type": "Microsoft.Storage/storageAccounts", 
    ...
```


<a id="uri" />

### uri
`uri (baseUri, relativeUri)`

Creates an absolute URI by combining the baseUri and the relativeUri string.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| baseUri |Yes |String |The base uri string. |
| relativeUri |Yes |String |The relative uri string to add to the base uri string. |

The value for the **baseUri** parameter can include a specific file, but only the base path is used when constructing the URI. For example, passing `http://contoso.com/resources/azuredeploy.json` as the baseUri parameter results in a base URI of `http://contoso.com/resources/`.

The following example shows how to construct a link to a nested template based on the value of the parent template.

```json
"templateLink": "[uri(deployment().properties.templateLink.uri, 'nested/azuredeploy.json')]"
```

## Array functions
Resource Manager provides several functions for working with array values.

* [concat](#concatarray)
* [length](#length)
* [skip](#skip)
* [take](#take)

To get an array of string values delimited by a value, see [split](#split).

<a id="concatarray" />

### concat - array
`concat (array1, array2, array3, ...)`

Combines multiple arrays and returns the concatenated array. 

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| array1 |Yes |Array |The first array for concatenation. |
| additional arrays |No |Array |Additional arrays in sequential order for concatenation. |

This function can take any number of arguments, and can accept either strings or arrays for the parameters. For an example of concatenating string values, see [concat - string](#concat).

The following example shows how to combine two arrays.

```json
"parameters": {
    "firstarray": {
      "type": "array"
    }
    "secondarray": {
      "type": "array"
    }
},
"variables": {
    "combinedarray": "[concat(parameters('firstarray'), parameters('secondarray'))]"
}
```

<a id="length" />

### length - array
`length(array)`

Returns the number of elements in an array.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| array |Yes |Array |The array to use for getting the number of elements. |

You can use this function with an array to specify the number of iterations when creating resources. In the following example, the parameter **siteNames** would refer to an array of names to use when creating the web sites.

```json
"copy": {
    "name": "websitescopy",
    "count": "[length(parameters('siteNames'))]"
}
```

For more information about using this function with an array, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md). 

For an example of using length with a string value, see [length - string](#lengthstring).

<a id="skip" />

### skip - array
`skip(originalValue, numberToSkip)`

Returns an array with all the elements after the specified number in the array.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |Array |The array to use for skipping. |
| numberToSkip |Yes |Integer |The number of elements to skip. If this value is 0 or less, all the elements in the array are returned. If it is larger than the length of the array, an empty array is returned. |

For an example of using skip with a string, see [skip - string](#skipstring).

The following example skips the specified number of elements in the array.

```json
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
```

<a id="take" />

### take - array
`take(originalValue, numberToTake)`

Returns an array with the specified number of elements from the start of the array.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |Array |The array to take the elements from. |
| numberToTake |Yes |Integer |The number of elements to take. If this value is 0 or less, an empty array is returned. If it is larger than the length of the given array, all the elements in the array are returned. |

For an example of using take with a string, see [take - string](#takestring).

The following example takes the specified number of elements from the array.

```json
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
```

## Deployment value functions
Resource Manager provides the following functions for getting values from sections of the template and values related to the deployment:

* [deployment](#deployment)
* [parameters](#parameters)
* [variables](#variables)

To get values from resources, resource groups, or subscriptions, see [Resource functions](#resource-functions).

<a id="deployment" />

### deployment
`deployment()`

Returns information about the current deployment operation.

This function returns the object that is passed during deployment. The properties in the returned object differ based on whether the deployment object is passed as a link or as an in-line object. 

When the deployment object is passed in-line, such as when using the **-TemplateFile** parameter in Azure PowerShell to point to a local file, the returned object has the following format:

```json
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
```

When the object is passed as a link, such as when using the **-TemplateUri** parameter to point to a remote object, the object is returned in the following format: 

```json
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
```

The following example shows how to use deployment() to link to another template based on the URI of the parent template.

```json
"variables": {  
    "sharedTemplateUrl": "[uri(deployment().properties.templateLink.uri, 'shared-resources.json')]"  
}
```  

<a id="parameters" />

### parameters
`parameters (parameterName)`

Returns a parameter value. The specified parameter name must be defined in the parameters section of the template.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| parameterName |Yes |String |The name of the parameter to return. |

The following example shows a simplified use of the parameters function.

```json
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
```

<a id="variables" />

### variables
`variables (variableName)`

Returns the value of variable. The specified variable name must be defined in the variables section of the template.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| variableName |Yes |String |The name of the variable to return. |

The following example uses a variable value.

```json
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
```

## Resource functions
Resource Manager provides the following functions for getting resource values:

* [listKeys and list{Value}](#listkeys)
* [providers](#providers)
* [reference](#reference)
* [resourceGroup](#resourcegroup)
* [resourceId](#resourceid)
* [subscription](#subscription)

To get values from parameters, variables, or the current deployment, see [Deployment value functions](#deployment-value-functions).

<a id="listkeys" />
<a id="list" />

### listKeys and list{Value}
`listKeys (resourceName or resourceIdentifier, apiVersion)`

`list{Value} (resourceName or resourceIdentifier, apiVersion)`

Returns the values for any resource type that supports the list operation. The most common usage is **listKeys**. 

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceName or resourceIdentifier |Yes |String |Unique identifier for the resource. |
| apiVersion |Yes |String |API version of resource runtime state. Typically, in the format, **yyyy-mm-dd**. |

Any operation that starts with **list** can be used a function in your template. The available operations include not only **listKeys**, but also operations like **list**, **listAdminKeys**, and **listStatus**. To determine which resource types have a list operation, see the [REST API operations](/rest/api/) for the resource provider.

To find the list operations for a resource provider, use the following PowerShell cmdlet:

```powershell
Get-AzureRmProviderOperation -OperationSearchString "Microsoft.Storage/*" | where {$_.Operation -like "*list*"} | FT Operation
```

To find the list operations for a resource provider, use the following Azure CLI command, and the JSON utility [jq](http://stedolan.github.io/jq/download/) to filter only the list operations:

```azurecli
azure provider operations show --operationSearchString */apiapps/* --json | jq ".[] | select (.operation | contains(\"list\"))"
```

The resourceId can be specified by using the [resourceId function](#resourceid) or by using the format **{providerNamespace}/{resourceType}/{resourceName}**.

The following example shows how to return the primary and secondary keys from a storage account in the outputs section.

```json
"outputs": { 
  "listKeysOutput": { 
    "value": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2016-01-01')]", 
    "type" : "object" 
  } 
}
``` 

The returned object from listKeys has the following format:

```json
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
```

<a id="providers" />

### providers
`providers (providerNamespace, [resourceType])`

Returns information about a resource provider and its supported resource types. If you do not provide a resource type, the function returns all the supported types for the resource provider.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| providerNamespace |Yes |String |Namespace of the provider |
| resourceType |No |String |The type of resource within the specified namespace. |

Each supported type is returned in the following format. Array ordering is not guaranteed.

```json
{
    "resourceType": "",
    "locations": [ ],
    "apiVersions": [ ]
}
```

The following example shows how to use the provider function:

```json
"outputs": {
    "exampleOutput": {
        "value": "[providers('Microsoft.Storage', 'storageAccounts')]",
        "type" : "object"
    }
}
```

<a id="reference" />

### reference
`reference (resourceName or resourceIdentifier, [apiVersion])`

Returns an object representing another resource's runtime state.

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceName or resourceIdentifier |Yes |String |Name or unique identifier of a resource. |
| apiVersion |No |String |API version of the specified resource. Include this parameter when the resource is not provisioned within same template. Typically, in the format, **yyyy-mm-dd**. |

The **reference** function derives its value from a runtime state, and therefore cannot be used in the variables section. It can be used in outputs section of a template.

By using the reference function, you implicitly declare that one resource depends on another resource if the referenced resource is provisioned within same template. You do not need to also use the **dependsOn** property. 
The function is not evaluated until the referenced resource has completed deployment.

The following example references a storage account that is deployed in the same template.

```json
"outputs": {
    "NewStorage": {
        "value": "[reference(parameters('storageAccountName'))]",
        "type" : "object"
    }
}
```

The following example references a storage account that is not deployed in this template, but exists within the same resource group as the resources being deployed.

```json
"outputs": {
    "ExistingStorage": {
        "value": "[reference(concat('Microsoft.Storage/storageAccounts/', parameters('storageAccountName')), '2016-01-01')]",
        "type" : "object"
    }
}
```

You can retrieve a particular value from the returned object, such as the blob endpoint URI, as shown in the following example:

```json
"outputs": {
    "BlobUri": {
        "value": "[reference(concat('Microsoft.Storage/storageAccounts/', parameters('storageAccountName')), '2016-01-01').primaryEndpoints.blob]",
        "type" : "string"
    }
}
```

The following example references a storage account in a different resource group.

```json
"outputs": {
    "BlobUri": {
        "value": "[reference(resourceId(parameters('relatedGroup'), 'Microsoft.Storage/storageAccounts/', parameters('storageAccountName')), '2016-01-01').primaryEndpoints.blob]",
        "type" : "string"
    }
}
```

The properties on the object returned from the **reference** function vary by resource type. To see the property names and values for a resource type, create a simple template that returns the object in the **outputs** section. If you have an existing resource of that type, your template just returns the object without deploying any new resources. If you do not have an existing resource of that type, your template deploys only that type and returns the object. Then, add those properties to other templates that need to dynamically retrieve the values during deployment. 

<a id="resourcegroup" />

### resourceGroup
`resourceGroup()`

Returns an object that represents the current resource group. 

The returned object is in the following format:

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
  "name": "{resourceGroupName}",
  "location": "{resourceGroupLocation}",
  "tags": {
  },
  "properties": {
    "provisioningState": "{status}"
  }
}
```

The following example uses the resource group location to assign the location for a web site.

```json
"resources": [
   {
      "apiVersion": "2014-06-01",
      "type": "Microsoft.Web/sites",
      "name": "[parameters('siteName')]",
      "location": "[resourceGroup().location]",
      ...
   }
]
```

<a id="resourceid" />

### resourceId
`resourceId ([subscriptionId], [resourceGroupName], resourceType, resourceName1, [resourceName2]...)`

Returns the unique identifier of a resource. 

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| subscriptionId |No |String (In GUID format) |Default value is the current subscription. Specify this value when you need to retrieve a resource in another subscription. |
| resourceGroupName |No |String |Default value is current resource group. Specify this value when you need to retrieve a resource in another resource group. |
| resourceType |Yes |String |Type of resource including resource provider namespace. |
| resourceName1 |Yes |String |Name of resource. |
| resourceName2 |No |String |Next resource name segment if resource is nested. |

You use this function when the resource name is ambiguous or not provisioned within the same template. The identifier is returned in the following format:

    /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/{resourceProviderNamespace}/{resourceType}/{resourceName}

The following example shows how to retrieve the resource ids for a web site and a database. The web site exists in a resource group named **myWebsitesGroup** and the database exists in the current resource group for this template.

```json
[resourceId('myWebsitesGroup', 'Microsoft.Web/sites', parameters('siteName'))]
[resourceId('Microsoft.SQL/servers/databases', parameters('serverName'), parameters('databaseName'))]
```

Often, you need to use this function when using a storage account or virtual network in an alternate resource group. The storage account or virtual network may be used across multiple resource groups; therefore, you do not want to delete them when deleting a single resource group. The following example shows how a resource from an external resource group can easily be used:

```json
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
```

<a id="subscription" />

### subscription
`subscription()`

Returns details about the subscription in the following format:

```json
{
    "id": "/subscriptions/#####",
    "subscriptionId": "#####",
    "tenantId": "#####"
}
```

The following example shows the subscription function called in the outputs section. 

```json
"outputs": { 
  "exampleOutput": { 
      "value": "[subscription()]", 
      "type" : "object" 
  } 
} 
```

## Next Steps
* For a description of the sections in an Azure Resource Manager template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md)
* To merge multiple templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md)
* To iterate a specified number of times when creating a type of resource, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md)
* To see how to deploy the template you have created, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md)

