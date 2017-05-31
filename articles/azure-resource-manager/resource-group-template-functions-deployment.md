---
title: Azure Resource Manager template functions - deployment | Microsoft Docs
description: Describes the functions to use in an Azure Resource Manager template to retrieve deployment information.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/26/2017
ms.author: tomfitz

---
# Deployment functions for Azure Resource Manager templates 

Resource Manager provides the following functions for getting values from sections of the template and values related to the deployment:

* [deployment](#deployment)
* [parameters](#parameters)
* [variables](#variables)

To get values from resources, resource groups, or subscriptions, see [Resource functions](resource-group-template-functions-resource.md).

<a id="deployment" />

## deployment
`deployment()`

Returns information about the current deployment operation.

### Examples

The following example returns the deployment object:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [],
    "outputs": {
        "subscriptionOutput": {
            "value": "[deployment()]",
            "type" : "object"
        }
    }
}
```

The following example shows how to use deployment() to link to another template based on the URI of the parent template.

```json
"variables": {  
    "sharedTemplateUrl": "[uri(deployment().properties.templateLink.uri, 'shared-resources.json')]"  
}
```  

### Return value

This function returns the object that is passed during deployment. The properties in the returned object differ based on whether the deployment object is passed as a link or as an in-line object. When the deployment object is passed in-line, such as when using the **-TemplateFile** parameter in Azure PowerShell to point to a local file, the returned object has the following format:

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



<a id="parameters" />

## parameters
`parameters(parameterName)`

Returns a parameter value. The specified parameter name must be defined in the parameters section of the template.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| parameterName |Yes |string |The name of the parameter to return. |

### Examples

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

### Return value

The type of the parameter.

<a id="variables" />

## variables
`variables(variableName)`

Returns the value of variable. The specified variable name must be defined in the variables section of the template.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| variableName |Yes |String |The name of the variable to return. |

### Examples

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

### Return value

The type of the variable.

## Next Steps
* For a description of the sections in an Azure Resource Manager template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
* To merge multiple templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).
* To iterate a specified number of times when creating a type of resource, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).
* To see how to deploy the template you have created, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md).

