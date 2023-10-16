---
title: Define multiple instances of a variable
description: Use copy operation in an Azure Resource Manager template (ARM template) to iterate multiple times when creating a variable.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 05/23/2023
---
# Variable iteration in ARM templates

This article shows you how to create more than one value for a variable in your Azure Resource Manager template (ARM template). By adding the `copy` element to the variables section of your template, you can dynamically set the number of items for a variable during deployment. You also avoid having to repeat template syntax.

You can also use copy with [resources](copy-resources.md), [properties in a resource](copy-properties.md), and [outputs](copy-outputs.md).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [loops](../bicep/loops.md).

## Syntax

The copy element has the following general format:

```json
"copy": [
  {
    "name": "<name-of-loop>",
    "count": <number-of-iterations>,
    "input": <values-for-the-variable>
  }
]
```

The `name` property is any value that identifies the loop. The `count` property specifies the number of iterations you want for the variable.

The `input` property specifies the properties that you want to repeat. You create an array of elements constructed from the value in the `input` property. It can be a single property (like a string), or an object with several properties.

## Copy limits

The count can't exceed 800.

The count can't be a negative number. It can be zero if you deploy the template with a recent version of Azure CLI, PowerShell, or REST API. Specifically, you must use:

- Azure PowerShell **2.6** or later
- Azure CLI **2.0.74** or later
- REST API version **2019-05-10** or later
- [Linked deployments](linked-templates.md) must use API version **2019-05-10** or later for the deployment resource type

Earlier versions of PowerShell, CLI, and the REST API don't support zero for count.

## Variable iteration

The following example shows how to create an array of string values:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "itemCount": {
      "type": "int",
      "defaultValue": 5
    }
  },
  "variables": {
    "copy": [
      {
        "name": "stringArray",
        "count": "[parameters('itemCount')]",
        "input": "[concat('item', copyIndex('stringArray', 1))]"
      }
    ]
  },
  "resources": [],
  "outputs": {
    "arrayResult": {
      "type": "array",
      "value": "[variables('stringArray')]"
    }
  }
}
```

The preceding template returns an array with the following values:

```json
[
  "item1",
  "item2",
  "item3",
  "item4",
  "item5"
]
```

The next example shows how to create an array of objects with three properties - `name`, `diskSizeGB`, and `diskIndex`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "itemCount": {
      "type": "int",
      "defaultValue": 5
    }
  },
  "variables": {
    "copy": [
      {
        "name": "objectArray",
        "count": "[parameters('itemCount')]",
        "input": {
          "name": "[concat('myDataDisk', copyIndex('objectArray', 1))]",
          "diskSizeGB": "1",
          "diskIndex": "[copyIndex('objectArray')]"
        }
      }
    ]
  },
  "resources": [],
  "outputs": {
    "arrayResult": {
      "type": "array",
      "value": "[variables('objectArray')]"
    }
  }
}
```

The preceding example returns an array with the following values:

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
  },
  {
    "name": "myDataDisk4",
    "diskSizeGB": "1",
    "diskIndex": 3
  },
  {
    "name": "myDataDisk5",
    "diskSizeGB": "1",
    "diskIndex": 4
  }
]
```

> [!NOTE]
> Variable iteration supports an offset argument. The offset must come after the name of the iteration, such as `copyIndex('diskNames', 1)`. If you don't provide an offset value, it defaults to 0 for the first instance.
>

You can also use the `copy` element within a variable. The following example creates an object that has an array as one of its values.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "itemCount": {
      "type": "int",
      "defaultValue": 5
    }
  },
  "variables": {
    "topLevelObject": {
      "sampleProperty": "sampleValue",
      "copy": [
        {
          "name": "disks",
          "count": "[parameters('itemCount')]",
          "input": {
            "name": "[concat('myDataDisk', copyIndex('disks', 1))]",
            "diskSizeGB": "1",
            "diskIndex": "[copyIndex('disks')]"
          }
        }
      ]
    }
  },
  "resources": [],
  "outputs": {
    "objectResult": {
      "type": "object",
      "value": "[variables('topLevelObject')]"
    }
  }
}
```

The preceding example returns an object with the following values:

```json
{
  "sampleProperty": "sampleValue",
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
    },
    {
      "name": "myDataDisk4",
      "diskSizeGB": "1",
      "diskIndex": 3
    },
    {
      "name": "myDataDisk5",
      "diskSizeGB": "1",
      "diskIndex": 4
    }
  ]
}
```

The next example shows the different ways you can use `copy` with variables.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {
    "disk-array-on-object": {
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
        "name": "top-level-object-array",
        "count": 5,
        "input": {
          "name": "[concat('myDataDisk', copyIndex('top-level-object-array', 1))]",
          "diskSizeGB": "1",
          "diskIndex": "[copyIndex('top-level-object-array')]"
        }
      },
      {
        "name": "top-level-string-array",
        "count": 5,
        "input": "[concat('myDataDisk', copyIndex('top-level-string-array', 1))]"
      },
      {
        "name": "top-level-integer-array",
        "count": 5,
        "input": "[copyIndex('top-level-integer-array')]"
      }
    ]
  },
  "resources": [],
  "outputs": {
    "exampleObject": {
      "value": "[variables('disk-array-on-object')]",
      "type": "object"
    },
    "exampleArrayOnObject": {
      "value": "[variables('disk-array-on-object').disks]",
      "type" : "array"
    },
    "exampleObjectArray": {
      "value": "[variables('top-level-object-array')]",
      "type" : "array"
    },
    "exampleStringArray": {
      "value": "[variables('top-level-string-array')]",
      "type" : "array"
    },
    "exampleIntegerArray": {
      "value": "[variables('top-level-integer-array')]",
      "type" : "array"
    }
  }
}
```

## Example templates

The following examples show common scenarios for creating more than one value for a variable.

|Template  |Description  |
|---------|---------|
|[Copy variables](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copyvariables.json) |Demonstrates the different ways of iterating on variables. |
|[Multiple security rules](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.json) |Deploys several security rules to a network security group. It constructs the security rules from a parameter. For the parameter, see [multiple NSG parameter file](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.parameters.json). |
|[Copy storage with variables](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copystoragewithvariables.json) | Example of how to iterate a variable and create multiple storage accounts. |

## Next steps

- To go through a tutorial, see [Tutorial: Create multiple resource instances with ARM templates](template-tutorial-create-multiple-instances.md).
- For other uses of the copy element, see:
  - [Resource iteration in ARM templates](copy-resources.md)
  - [Property iteration in ARM templates](copy-properties.md)
  - [Output iteration in ARM templates](copy-outputs.md)
- If you want to learn about the sections of a template, see [Understand the structure and syntax of ARM templates](./syntax.md).
- To learn how to deploy your template, see [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md).
