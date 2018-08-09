---
title: Azure Resource Manager template variables | Microsoft Docs
description: Describes how to define variables in an Azure Resource Manager templates using declarative JSON syntax.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/12/2017
ms.author: tomfitz
---

# Variables section of Azure Resource Manager templates
In the variables section, you construct values that can be used throughout your template. You do not need to define variables, but they often simplify your template by reducing complex expressions.

## Define and use a variable

The following example shows a variable definition. It creates a string value for a storage account name. It uses several template functions to get a parameter value, and concatenate it to a unique string.

```json
"variables": {
  "storageName": "[concat(toLower(parameters('storageNamePrefix')), uniqueString(resourceGroup().id))]"
},
```

You use the variable when defining the resource.

```json
"resources": [
  {
    "name": "[variables('storageName')]",
    "type": "Microsoft.Storage/storageAccounts",
    ...
```

## Available definitions

The preceding example showed one way to define a variable. You can use any of the following definitions:

```json
"variables": {
    "<variable-name>": "<variable-value>",
    "<variable-name>": { 
        <variable-complex-type-value> 
    },
    "<variable-object-name>": {
        "copy": [
            {
                "name": "<name-of-array-property>",
                "count": <number-of-iterations>,
                "input": {
                    <properties-to-repeat>
                }
            }
        ]
    },
    "copy": [
        {
            "name": "<variable-array-name>",
            "count": <number-of-iterations>,
            "input": {
                <properties-to-repeat>
            }
        }
    ]
}
```

## Configuration variables

You can use complex JSON types to define related values for an environment. 

```json
"variables": {
    "environmentSettings": {
        "test": {
            "instanceSize": "Small",
            "instanceCount": 1
        },
        "prod": {
            "instanceSize": "Large",
            "instanceCount": 4
        }
    }
},
```

In parameters, you create a value that indicates which configuration values to use.

```json
"parameters": {
    "environmentName": {
        "type": "string",
        "allowedValues": [
          "test",
          "prod"
        ]
    }
},
```

You retrieve the current settings with:

```json
"[variables('environmentSettings')[parameters('environmentName')].instanceSize]"
```

## Use copy element in variable definition

You can use the **copy** syntax to create a variable with an array of multiple elements. You provide a count for the number of elements. Each element contains the properties within the **input** object. You can use copy either within a variable or to create the variable. When you define a variable and use **copy** within that variable, you create an object that has an array property. When you use **copy** at the top level and define one or more variables within it, you create one or more arrays. Both approaches are shown in the following example:

```json
"variables": {
    "disk-array-on-object": {
        "copy": [
            {
                "name": "disks",
                "count": 3,
                "input": {
                    "name": "[concat('myDataDisk', copyIndex('disks', 1))]",
                    "diskSizeGB": "1",
                    "diskIndex": "[copyIndex('disks')]"
                }
            }
        ]
    },
    "copy": [
        {
            "name": "disks-top-level-array",
            "count": 3,
            "input": {
                "name": "[concat('myDataDisk', copyIndex('disks-top-level-array', 1))]",
                "diskSizeGB": "1",
                "diskIndex": "[copyIndex('disks-top-level-array')]"
            }
        }
    ]
},
```

The variable **disk-array-on-object** contains the following object with an array named **disks**:

```json
{
  "disks": [
    {
      "name": "myDataDisk1",
      "diskSizeGB": "1",
      "diskIndex": 0
    },
    {
      "name": "myDataDisk2",
      "diskSizeGB": "1",
      "diskIndex": 1
    },
    {
      "name": "myDataDisk3",
      "diskSizeGB": "1",
      "diskIndex": 2
    }
  ]
}
```

The variable **disks-top-level-array** contains the following array:

```json
[
  {
    "name": "myDataDisk1",
    "diskSizeGB": "1",
    "diskIndex": 0
  },
  {
    "name": "myDataDisk2",
    "diskSizeGB": "1",
    "diskIndex": 1
  },
  {
    "name": "myDataDisk3",
    "diskSizeGB": "1",
    "diskIndex": 2
  }
]
```

You can also specify more than one object when using copy to create variables. The following example defines two arrays as variables. One is named **disks-top-level-array** and has five elements. The other is named **a-different-array** and has three elements.

```json
"variables": {
    "copy": [
        {
            "name": "disks-top-level-array",
            "count": 5,
            "input": {
                "name": "[concat('oneDataDisk', copyIndex('disks-top-level-array', 1))]",
                "diskSizeGB": "1",
                "diskIndex": "[copyIndex('disks-top-level-array')]"
            }
        },
        {
            "name": "a-different-array",
            "count": 3,
            "input": {
                "name": "[concat('twoDataDisk', copyIndex('a-different-array', 1))]",
                "diskSizeGB": "1",
                "diskIndex": "[copyIndex('a-different-array')]"
            }
        }
    ]
},
```

This approach works well when you need to take parameter values and make sure they are in the correct format for a template value. The following example formats parameter values for use in defining security rules:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "securityRules": {
      "type": "array"
    }
  },
  "variables": {
    "copy": [
      {
        "name": "securityRules",
        "count": "[length(parameters('securityRules'))]",
        "input": {
          "name": "[parameters('securityRules')[copyIndex('securityRules')].name]",
          "properties": {
            "description": "[parameters('securityRules')[copyIndex('securityRules')].description]",
            "priority": "[parameters('securityRules')[copyIndex('securityRules')].priority]",
            "protocol": "[parameters('securityRules')[copyIndex('securityRules')].protocol]",
            "sourcePortRange": "[parameters('securityRules')[copyIndex('securityRules')].sourcePortRange]",
            "destinationPortRange": "[parameters('securityRules')[copyIndex('securityRules')].destinationPortRange]",
            "sourceAddressPrefix": "[parameters('securityRules')[copyIndex('securityRules')].sourceAddressPrefix]",
            "destinationAddressPrefix": "[parameters('securityRules')[copyIndex('securityRules')].destinationAddressPrefix]",
            "access": "[parameters('securityRules')[copyIndex('securityRules')].access]",
            "direction": "[parameters('securityRules')[copyIndex('securityRules')].direction]"
          }
        }
      }
    ]
  },
  "resources": [
    {
      "apiVersion": "2015-06-15",
      "type": "Microsoft.Network/networkSecurityGroups",
      "name": "NSG1",
      "location": "[resourceGroup().location]",
      "properties": {
        "securityRules": "[variables('securityRules')]"
      }
    }
  ],
  "outputs": {}
}
```

## Recommendations
The following information can be helpful when you work with variables:

* Use variables for values that you need to use more than once in a template. If a value is used only once, a hard-coded value makes your template easier to read.
* You cannot use the [reference](resource-group-template-functions-resource.md#reference) function in the **variables** section of the template. The **reference** function derives its value from the resource's runtime state. However, variables are resolved during the initial parsing of the template. Construct values that need the **reference** function directly in the **resources** or **outputs** section of the template.
* Include variables for resource names that must be unique.

## Example templates

These example templates demonstrate some scenarios for using variables. Deploy them to test how variables are handled in different scenarios. 

|Template  |Description  |
|---------|---------|
| [variable definitions](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/variables.json) | Demonstrates the different types of variables. The template does not deploy any resources. It constructs variable values and returns those values. |
| [configuration variable](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/variablesconfigurations.json) | Demonstrates the use of a variable that defines configuration values. The template does not deploy any resources. It constructs variable values and returns those values. |
| [network security rules](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.json) and [parameter file](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.parameters.json) | Constructs an array in the correct format for assigning security rules to a network security group. |


## Next steps
* To view complete templates for many different types of solutions, see the [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/).
* For details about the functions you can use from within a template, see [Azure Resource Manager Template Functions](resource-group-template-functions.md).
* To combine multiple templates during deployment, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).
* You may need to use resources that exist within a different resource group. This scenario is common when working with storage accounts or virtual networks that are shared across multiple resource groups. For more information, see the [resourceId function](resource-group-template-functions-resource.md#resourceid).