<properties
   pageTitle="Azure Resource Manager Template Functions"
   description="Describes the functions to use in an Azure Resource Manager template to deploy apps to Azure."
   services="na"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/28/2015"
   ms.author="tomfitz;ilygre"/>

# Azure Resource Manager Template Functions

This topic describes all of the functions you can use in an Azure Resource Manager template.

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

## listKeys

**listKeys (resourceName or resourceIdentifier, [apiVersion])**

Returns the keys of a storage account. The resourceId can be specified by using the [resourceId function](./#resourceid) or by using the format **providerNamespace/resourceType/resourceName**. You can use the function to get the primaryKey and secondaryKey.
  
| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| resourceName or resourceIdentifier |   Yes    | Unique identifier of a storage account.
| apiVersion                         |   Yes    | API version of resource runtime state.

The following example shows how to return the keys from a storage account in the outputs section.

    "outputs": { 
      "exampleOutput": { 
        "value": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), providers('Microsoft.Storage', 'storageAccounts').apiVersions[0])]", 
        "type" : "object" 
      } 
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

## provider

**provider (providerNamespace, [resourceType])**

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

By using the reference expression, you declare that one resource depends on another resource if the referenced resource is provisioned within same template.

    "outputs": {
      "siteUri": {
          "type": "string",
          "value": "[concat('http://',reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
      }
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
      "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
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

## variables

**variables (variableName)**

Returns the value of variable. The specified variable name must be defined in the variables section of the template.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| variable Name                      |   Yes    | The name of the variable to return.


## Next Steps
- [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md)
- [Advanced Template Operations](./resource-group-advanced-template.md)
- [Deploy an application with Azure Resource Manager Template](./resouce-group-template-deploy.md)
- [Azure Resource Manager Overview](./resource-group-overview.md)
