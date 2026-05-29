---
title: Variables in templates
description: Describes how to define variables in an Azure Resource Manager template (ARM template).
ms.topic: article
ms.custom: devx-track-arm-template
ms.date: 08/08/2025
---

# Variables in ARM templates

This article describes how to define and use variables in your Azure Resource Manager template (ARM template). You use variables to simplify your template. Rather than repeating complicated expressions throughout your template, you define a variable that contains the complicated expression. Then, you use that variable as needed throughout your template.

Resource Manager resolves variables before starting the deployment operations. Wherever the variable is used in the template, Resource Manager replaces it with the resolved value.

> [!TIP]
> [Bicep](../bicep/overview.md) is recommended since it offers the same capabilities as ARM templates, and the syntax is easier to use. To learn more, see [variables](../bicep/variables.md).

You are limited to 256 variables in a template. For more information, see [template limits](./best-practices.md#template-limits).

## Define variable

When defining a variable, you don't specify a [data type](data-types.md) for the variable. Instead, provide a value or template expression. The variable type is inferred from the resolved value. The following example sets a variable to a string:

```json
"variables": {
  "stringVar": "example value"
},
```

To construct the variable, use the value from a parameter or another variable:

```json
"parameters": {
  "inputValue": {
    "defaultValue": "deployment parameter",
    "type": "string"
  }
},
"variables": {
  "stringVar": "myVariable",
  "concatToVar": "[concat(variables('stringVar'), '-addtovar') ]",
  "concatToParam": "[concat(parameters('inputValue'), '-addtoparam')]"
}
```

You can use [`template`](template-functions.md) functions to construct the variable value.

The following example creates a string value for a storage account name. It uses several `template` functions to get a parameter value and concatenates it to a unique string:

```json
"variables": {
  "storageName": "[concat(toLower(parameters('storageNamePrefix')), uniqueString(resourceGroup().id))]"
},
```

You can't use the [`reference`](template-functions-resource.md#reference) function or any of the [`list`](template-functions-resource.md#list) functions in the variable declaration. These functions get the runtime state of a resource and can't be executed before deployment when variables are resolved.

## Use variable

The following example shows how to use the variable for a resource property.

To reference the value for the variable, use the [`variables`](template-functions-deployment.md#variables) function:

```json
"variables": {
  "storageName": "[concat(toLower(parameters('storageNamePrefix')), uniqueString(resourceGroup().id))]"
},
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[variables('storageName')]",
    ...
  }
]
```

## Example template

The following template doesn't deploy any resources. It shows some ways of declaring different variable types:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "inputValue": {
      "defaultValue": "deployment parameter",
      "type": "string"
    }
  },
  "variables": {
    "stringVar": "myVariable",
    "concatToVar": "[concat(variables('stringVar'), '-addtovar') ]",
    "concatToParam": "[concat(parameters('inputValue'), '-addtoparam')]",
    "arrayVar": [
      1,
      2,
      3,
      4
    ],
    "objectVar": {
      "property1": "value1",
      "property2": "value2"
    },
    "copyWithinVar": {
      "copy": [
        {
          "name": "disks",
          "count": 5,
          "input": {
            "name": "[concat('myDataDisk', copyIndex('disks', 1))]",
            "diskSizeGB": "1",
            "diskIndex": "[copyIndex('disks')]"
          }
        },
        {
          "name": "diskNames",
          "count": 5,
          "input": "[concat('myDataDisk', copyIndex('diskNames', 1))]"
        }
      ]
    },
    "copy": [
      {
        "name": "topLevelCopy1",
        "count": 5,
        "input": {
          "name": "[concat('oneDataDisk', copyIndex('topLevelCopy1', 1))]",
          "diskSizeGB": "1",
          "diskIndex": "[copyIndex('topLevelCopy1')]"
        }
      },
      {
        "name": "topLevelCopy2",
        "count": 3,
        "input": {
          "name": "[concat('twoDataDisk', copyIndex('topLevelCopy2', 1))]",
          "diskSizeGB": "1",
          "diskIndex": "[copyIndex('topLevelCopy2')]"
        }
      },
      {
        "name": "topLevelCopy3",
        "count": 4,
        "input": "[concat('stringValue', copyIndex('topLevelCopy3'))]"
      },
      {
        "name": "topLevelCopy4",
        "count": 4,
        "input": "[copyIndex('topLevelCopy4')]"
      }
    ]
  },
  "resources": [],
  "outputs": {
    "stringOutput": {
      "type": "string",
      "value": "[variables('stringVar')]"
    },
    "concatToVariableOutput": {
      "type": "string",
      "value": "[variables('concatToVar')]"
    },
    "concatToParameterOutput": {
      "type": "string",
      "value": "[variables('concatToParam')]"
    },
    "arrayOutput": {
      "type": "array",
      "value": "[variables('arrayVar')]"
    },
    "arrayElementOutput": {
      "type": "int",
      "value": "[variables('arrayVar')[0]]"
    },
    "objectOutput": {
      "type": "object",
      "value": "[variables('objectVar')]"
    },
    "copyWithinVariableOutput": {
      "type": "object",
      "value": "[variables('copyWithinVar')]"
    },
    "topLevelCopyOutput1": {
      "type": "array",
      "value": "[variables('topLevelCopy1')]"
    },
    "topLevelCopyOutput2": {
      "type": "array",
      "value": "[variables('topLevelCopy2')]"
    },
    "topLevelCopyOutput3": {
      "type": "array",
      "value": "[variables('topLevelCopy3')]"
    },
    "topLevelCopyOutput4": {
      "type": "array",
      "value": "[variables('topLevelCopy4')]"
    }
  }
}
```

## Configuration variables

You can define variables that hold related values for configuring an environment. You define the variable as an object with the values. The following example shows an object that holds values for two environments - **test** and **prod**. Pass in one of these values during deployment:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environmentName": {
      "type": "string",
      "allowedValues": [
        "test",
        "prod"
      ],
      "metadata": {
        "description": "Specify either test or prod for configuration values."
      }
    }
  },
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
  "resources": [],
  "outputs": {
    "instanceSize": {
      "value": "[variables('environmentSettings')[parameters('environmentName')].instanceSize]",
      "type": "string"
    },
    "instanceCount": {
      "value": "[variables('environmentSettings')[parameters('environmentName')].instanceCount]",
      "type": "int"
    }
  }
}
```

## Next steps

- To learn more about available properties for variables, see [the structure and syntax of ARM templates](./syntax.md).
- For recommendations about creating variables, see [best practices - variables](./best-practices.md#variables).
- For an example template that assigns security rules to a network security group, see [network security rules](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.json) and [parameter file](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.parameters.json).

