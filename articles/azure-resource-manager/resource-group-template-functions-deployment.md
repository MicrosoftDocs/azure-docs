---
title: Azure Resource Manager template functions - deployment | Microsoft Docs
description: Describes the functions to use in an Azure Resource Manager template to retrieve deployment information.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 01/03/2019
ms.author: tomfitz

---
# Deployment functions for Azure Resource Manager templates 

Resource Manager provides the following functions for getting values from sections of the template and values related to the deployment:

* [deployment](#deployment)
* [parameters](#parameters)
* [variables](#variables)

To get values from resources, resource groups, or subscriptions, see [Resource functions](resource-group-template-functions-resource.md).

<a id="deployment" />

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## deployment
`deployment()`

Returns information about the current deployment operation.

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

When you [deploy to an Azure subscription](deploy-to-subscription.md), instead of a resource group, the return object includes a `location` property. The location property is included when deploying either a local template or an external template.

### Remarks

You can use deployment() to link to another template based on the URI of the parent template.

```json
"variables": {  
    "sharedTemplateUrl": "[uri(deployment().properties.templateLink.uri, 'shared-resources.json')]"  
}
```  

If you redeploy a template from the deployment history in the portal, the template is deployed as a local file. The `templateLink` property isn't returned in the deployment function. If your template relies on `templateLink` to construct a link to another template, don't use the portal to redeploy. Instead, use the commands you used to originally deploy the template.

### Example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/deployment.json) returns the deployment object:

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

The preceding example returns the following object:

```json
{
  "name": "deployment",
  "properties": {
    "template": {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [],
      "outputs": {
        "subscriptionOutput": {
          "type": "Object",
          "value": "[deployment()]"
        }
      }
    },
    "parameters": {},
    "mode": "Incremental",
    "provisioningState": "Accepted"
  }
}
```

To deploy this example template with Azure CLI, use:

```azurecli-interactive
az group deployment create -g functionexamplegroup --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/functions/deployment.json
```

To deploy this example template with PowerShell, use:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName functionexamplegroup -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/functions/deployment.json
```

For a subscription-level template that uses the deployment function, see [subscription deployment function](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/deploymentsubscription.json). It's deployed with either `az deployment create` or `New-AzDeployment` commands.

<a id="parameters" />

## parameters
`parameters(parameterName)`

Returns a parameter value. The specified parameter name must be defined in the parameters section of the template.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| parameterName |Yes |string |The name of the parameter to return. |

### Return value

The value of the specified parameter.

### Remarks

Typically, you use parameters to set resource values. The following example sets the name of web site to the parameter value passed in during deployment.

```json
"parameters": { 
  "siteName": {
      "type": "string"
  }
},
"resources": [
   {
      "apiVersion": "2016-08-01",
      "name": "[parameters('siteName')]",
      "type": "Microsoft.Web/Sites",
      ...
   }
]
```

### Example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/parameters.json) shows a simplified use of the parameters function.

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"stringParameter": {
			"type" : "string",
			"defaultValue": "option 1"
		},
        "intParameter": {
            "type": "int",
            "defaultValue": 1
        },
        "objectParameter": {
            "type": "object",
            "defaultValue": {"one": "a", "two": "b"}
        },
        "arrayParameter": {
            "type": "array",
            "defaultValue": [1, 2, 3]
        },
        "crossParameter": {
            "type": "string",
            "defaultValue": "[parameters('stringParameter')]"
        }
	},
	"variables": {},
	"resources": [],
	"outputs": {
		"stringOutput": {
			"value": "[parameters('stringParameter')]",
			"type" : "string"
		},
        "intOutput": {
			"value": "[parameters('intParameter')]",
			"type" : "int"
		},
        "objectOutput": {
			"value": "[parameters('objectParameter')]",
			"type" : "object"
		},
        "arrayOutput": {
			"value": "[parameters('arrayParameter')]",
			"type" : "array"
		},
        "crossOutput": {
			"value": "[parameters('crossParameter')]",
			"type" : "string"
		}
	}
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| stringOutput | String | option 1 |
| intOutput | Int | 1 |
| objectOutput | Object | {"one": "a", "two": "b"} |
| arrayOutput | Array | [1, 2, 3] |
| crossOutput | String | option 1 |

To deploy this example template with Azure CLI, use:

```azurecli-interactive
az group deployment create -g functionexamplegroup --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/functions/parameters.json
```

To deploy this example template with PowerShell, use:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName functionexamplegroup -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/functions/parameters.json
```

<a id="variables" />

## variables
`variables(variableName)`

Returns the value of variable. The specified variable name must be defined in the variables section of the template.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| variableName |Yes |String |The name of the variable to return. |

### Return value

The value of the specified variable.

### Remarks

Typically, you use variables to simplify your template by constructing complex values only once. The following example constructs a unique name for a storage account.

```json
"variables": {
    "storageName": "[concat('storage', uniqueString(resourceGroup().id))]"
},
"resources": [
    {
        "type": "Microsoft.Storage/storageAccounts",
        "name": "[variables('storageName')]",
        ...
    },
    {
        "type": "Microsoft.Compute/virtualMachines",
        "dependsOn": [
            "[variables('storageName')]"
        ],
        ...
    }
],
```

### Example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/variables.json) returns different variable values.

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {},
	"variables": {
		"var1": "myVariable",
		"var2": [ 1,2,3,4 ],
		"var3": "[ variables('var1') ]",
		"var4": {
			"property1": "value1",
			"property2": "value2"
  		}
	},
	"resources": [],
	"outputs": {
		"exampleOutput1": {
			"value": "[variables('var1')]",
			"type" : "string"
		},
		"exampleOutput2": {
			"value": "[variables('var2')]",
			"type" : "array"
		},
		"exampleOutput3": {
			"value": "[variables('var3')]",
			"type" : "string"
		},
		"exampleOutput4": {
			"value": "[variables('var4')]",
			"type" : "object"
		}
	}
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| exampleOutput1 | String | myVariable |
| exampleOutput2 | Array | [1, 2, 3, 4] |
| exampleOutput3 | String | myVariable |
| exampleOutput4 |  Object | {"property1": "value1", "property2": "value2"} |

To deploy this example template with Azure CLI, use:

```azurecli-interactive
az group deployment create -g functionexamplegroup --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/functions/variables.json
```

To deploy this example template with PowerShell, use:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName functionexamplegroup -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/functions/variables.json
```

## Next steps
* For a description of the sections in an Azure Resource Manager template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
* To merge several templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).
* To iterate a specified number of times when creating a type of resource, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).
* To see how to deploy the template you've created, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md).

