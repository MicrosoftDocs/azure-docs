<properties
   pageTitle="Azure Resource Manager Template Functions"
   description="Describes the functions to use in an Azure Resource Manager template to retrieve values, format strings and retrieve deployment information."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/13/2015"
   ms.author="tomfitz"/>

# Azure Resource Manager Template Functions

This topic describes all of the functions you can use in an Azure Resource Manager template.

## add

**add(operand1, operand2)**

Returns the sum of the two provided integers.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| operand1                           |   Yes    | First operand to use.
| operand2                           |   Yes    | Second operand to use.


## base64

**base64 (inputString)**

Returns the base64 representation of the input string.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| inputString                        |   Yes    | The string value to return as a base64 representation.

The following example show how to use the base64 function.

    "variables": {
      "usernameAndPassword": "[concat('parameters('username'), ':', parameters('password'))]",
      "authorizationHeader": "[concat('Basic ', base64(variables('usernameAndPassword')))]"
    }

## concat

**concat (arg1, arg2, arg3, ...)**

Combines multiple string values and returns the resulting string value. This function can take any number of arguments.

The following example shows how to combine multiple values to return a value.

    "outputs": {
        "siteUri": {
          "type": "string",
          "value": "[concat('http://',reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
        }
    }

## copyIndex

**copyIndex(offset)**

Returns the current index of an iteration loop. For examples of using this function, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

## deployment

**deployment()**

Returns information about the current deployment operation.

The information about the deployment is returned as an object with the following properties:

    {
      "name": "",
      "properties": {
        "template": {},
        "parameters": {},
        "mode": "",
        "provisioningState": ""
      }
    }

The following example shows how to return deployment information in the outputs section.

    "outputs": {
      "exampleOutput": {
        "value": "[deployment()]",
        "type" : "object"
      }
    }

## div

**div(operand1, operand2)**

Returns the integer division of the two provided integers.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| operand1                           |   Yes    | Number being divided.
| operand2                           |   Yes    | Number which is used to divide, has to be different from 0.

## int

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

## length

**length(array)**

Returns the number of elements in an array. Typically, used to specify the number of iterations when creating resources. For an example of using this function, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

## listKeys

**listKeys (resourceName or resourceIdentifier, apiVersion)**

Returns the keys of a storage account. The resourceId can be specified by using the [resourceId function](./#resourceid) or by using the format **providerNamespace/resourceType/resourceName**. You can use the function to get the primaryKey and secondaryKey.
  
| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| resourceName or resourceIdentifier |   Yes    | Unique identifier of a storage account.
| apiVersion                         |   Yes    | API version of resource runtime state.

The following example shows how to return the keys from a storage account in the outputs section.

    "outputs": { 
      "exampleOutput": { 
        "value": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2015-05-01-preview')]", 
        "type" : "object" 
      } 
    } 

## mod

**mod(operand1, operand2)**

Returns the remainder of the integer division using the two provided integers.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| operand1                           |   Yes    | Number being divided.
| operand2                           |   Yes    | Number which is used to divide, has to be different from 0.


## mul

**mul(operand1, operand2)**

Returns the multiplication of the two provided integers.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| operand1                           |   Yes    | First operand to use.
| operand2                           |   Yes    | Second operand to use.


## padLeft

**padLeft(stringToPad, totalLength, paddingCharacter)**

Returns a right-aligned string by adding characters to the left until reaching the total specified length.
  
| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| stringToPad                        |   Yes    | The string to right-align.
| totalLength                        |   Yes    | The total number of characters in the returned string.
| paddingCharacter                   |   Yes    | The character to use for left-padding until the total length is reached.

The following example shows how to pad the user-provided parameter value by adding the zero character until the string reaches 10 characters. If the original parameter value is longer than 10 characters, no characters are added.

    "parameters": {
        "appName": { "type": "string" }
    },
    "variables": { 
        "paddedAppName": "[padLeft(parameters('appName'),10,'0')]"
    }


## parameters

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

## providers

**providers (providerNamespace, [resourceType])**

Return information about a resource provider and its supported resource types. If not type is provided, all of the supported types are returned.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| providerNamespace                  |   Yes    | Namespace of the provider
| resourceType                       |   No     | The type of resource within the specified namespace.

Each supported type is returned in the following format:

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

## reference

**reference (resourceName or resourceIdentifier, [apiVersion])**

Enables an expression to derive its value from another resource's runtime state.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| resourceName or resourceIdentifier |   Yes    | Name or the unique identifier of a resource.
| apiVersion                         |   No     | API version of resource runtime state. Parameter should be used if resource is not provisioned within same template.

The **reference** function derives its value from a runtime state, and therefore cannot be used in the variables section. It can be used in outputs section of a template.

By using the reference expression, you implicitly declare that one resource depends on another resource if the referenced resource is provisioned within same template. You do not need to also use the **dependsOn** property. 
The expression is not evaluated until the referenced resource has completed deployment.

    "outputs": {
      "siteUri": {
          "type": "string",
          "value": "[concat('http://',reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
      }
    }

## replace

**replace(originalString, oldCharacter, newCharacter)**

Returns a new string with all instances of one character in the specified string replaced by another character.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| originalString                     |   Yes    | The string that will have all instances of one character replaced by another character.
| oldCharacter                       |   Yes    | The character to be removed from the original string.
| newCharacter                       |   Yes    | The character to add in place of the removed character.

The following example shows how to remove all dashes from the user-provided string.

    "parameters": {
        "identifier": { "type": "string" }
    },
    "variables": { 
        "newidentifier": "[replace(parameters('identifier'),'-','')]"
    }

## resourceGroup

**resourceGroup()**

Returns a structured object that represents the current resource group. The object will be in the following format:

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

## resourceId

**resourceId ([resourceGroupName], resourceType, resourceName1, [resourceName2]...)**

Returns the unique identifier of a resource. You use this function when the resource name is ambiguous or not provisioned within the same template. The identifier is returned in the following format:

    /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/{resourceProviderNamespace}/{resourceType}/{resourceName}
      
| Parameter         | Required | Description
| :---------------: | :------: | :----------
| resourceGroupName |   No     | Optional resource group name. Default value is current resource group. Specify this value when you retrieving a resource in another resource group.
| resourceType      |   Yes    | Type of resource including resource provider namespace.
| resourceName1     |   Yes    | Name of resource.
| resourceName2     |   No     | Next resource name segment if resource is nested.

The following example shows how to retrieve the resource ids for a web site and a database. The web site exists in a resource group named **myWebsitesGroup** and the database exists in the current resource group for this template.

    [resourceId('myWebsitesGroup', 'Microsoft.Web/sites', parameters('siteName'))]
    [resourceId('Microsoft.SQL/servers/databases', parameters('serverName'),parameters('databaseName'))]
    
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

## split

**split(inputString, delimiter)**
**split(inputString, [delimiters])**

Returns an array of strings that contains the substrings of the input string that are delimited by the sent delimiters.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| inputString                        |   Yes    | The string to to be splitted.
| delimiter                          |   Yes    | The delimiter to use, can be a single string or an array of strings.

The following example splits the input string with a comma.

    "parameters": {
        "inputString": { "type": "string" }
    },
    "variables": { 
        "stringPieces": "[split(parameters('inputString'), ',')]"
    }

## string

**string(valueToConvert)**

Converts the specified value to String.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| valueToConvert                     |   Yes    | The value to convert to String. The type of value can only be Boolean, Integer or String.

The following example converts the user-provided parameter value to String.

    "parameters": {
        "appId": { "type": "int" }
    },
    "variables": { 
        "stringValue": "[string(parameters('appId'))]"
    }

## sub

**sub(operand1, operand2)**

Returns the subtraction of the two provided integers.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| operand1                           |   Yes    | Number which is to be subtracted from.
| operand2                           |   Yes    | Number to be subtracted.


## subscription

**subscription()**

Returns details about the subscription in the following format.

    {
        "id": "/subscriptions/#####"
        "subscriptionId": "#####"
    }

The following example shows the subscription function called in the outputs section. 

    "outputs": { 
      "exampleOutput": { 
          "value": "[subscription()]", 
          "type" : "object" 
      } 
    } 

## toLower

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

## toUpper

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


## uniqueString

**uniqueString (stringForCreatingUniqueString, ...)**

Creates a unique string value based the value you provide. This function is helpful when you need to create a unique name for a resource. The parameter value you provide represents the level of uniqueness; therefore, you can specify whether the name is unique for your subscription, resource group, or deployment. 

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| stringForCreatingUniqueString      |   Yes    | The base string used in the hash function to create a unique string.
| additional parameters as needed    | No       | You can add as many strings as needed to create the value that specifies the level for uniqueness.

The returned value is not a completely random string, but rather the result of a hash function. The returned value is 13 characters long, and consists of a subset of 0-9 and a-z characters, excluding numbers which look like alphabetic characters.

The following examples show how to use uniqueString to create a unique value for a different commonly-used levels.

Unique based on subscription

    "[uniqueString(subscription().subscriptionId)]"

Unique based on resource group

    "[uniqueString(resourceGroup().id)]"

Unique based on deployment for a resource group

    "[uniqueString(resourceGroup().id, deployment().name)]"
    
The following example shows how to create a unique name for a storage account based on your resource group.

    "resources": [{ 
        "name": "[concat('ContosoStorage', uniqueString(resourceGroup().id))]", 
        "type": "Microsoft.Storage/storageAccounts", 
        ...


## variables

**variables (variableName)**

Returns the value of variable. The specified variable name must be defined in the variables section of the template.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| variable Name                      |   Yes    | The name of the variable to return.


## Next Steps
- For a description of the sections in an Azure Resource Manager template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md)
- To merge multiple templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md)
- To iterate a specified number of times when creating a type of resource, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md)
- To see how to deploy the template you have created, see [Deploy an application with Azure Resource Manager template](azure-portal/resource-group-template-deploy.md)

