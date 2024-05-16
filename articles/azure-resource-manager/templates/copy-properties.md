---
title: Define multiple instances of a property
description: Use copy operation in an Azure Resource Manager template (ARM template) to iterate multiple times when creating a property on a resource.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 03/20/2024
---

# Property iteration in ARM templates

This article shows you how to create more than one instance of a property in your Azure Resource Manager template (ARM template). By adding copy loop to the properties section of a resource in your template, you can dynamically set the number of items for a property during deployment. You also avoid having to repeat template syntax.

You can only use copy loop with top-level resources, even when applying copy loop to a property. To learn about changing a child resource to a top-level resource, see [Iteration for a child resource](copy-resources.md#iteration-for-a-child-resource).

You can also use copy loop with [resources](copy-resources.md), [variables](copy-variables.md), and [outputs](copy-outputs.md).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [loops](../bicep/loops.md).

## Syntax

Add the `copy` element to the resources section of your template to set the number of items for a property. The copy element has the following general format:

```json
"copy": [
  {
    "name": "<name-of-property>",
    "count": <number-of-iterations>,
    "input": <values-for-the-property>
  }
]
```

For `name`, provide the name of the resource property that you want to create.

The `count` property specifies the number of iterations you want for the property.

The `input` property specifies the properties that you want to repeat. You create an array of elements constructed from the value in the `input` property.

## Copy limits

The count can't exceed 800.

The count can't be a negative number. It can be zero if you deploy the template with a recent version of Azure CLI, PowerShell, or REST API. Specifically, you must use:

- Azure PowerShell **2.6** or later
- Azure CLI **2.0.74** or later
- REST API version **2019-05-10** or later
- [Linked deployments](linked-templates.md) must use API version **2019-05-10** or later for the deployment resource type

Earlier versions of PowerShell, CLI, and the REST API don't support zero for count.

## Property iteration

The following example shows how to apply copy loop to the `dataDisks` property on a virtual machine:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "numberOfDataDisks": {
      "type": "int",
      "minValue": 0,
      "maxValue": 16,
      "defaultValue": 3,
      "metadata": {
        "description": "The number of dataDisks to create."
      }
    },
    ...
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2022-11-01",
      ...
      "properties": {
        "storageProfile": {
          ...
          "copy": [
            {
              "name": "dataDisks",
              "count": "[parameters('numberOfDataDisks')]",
              "input": {
                "lun": "[copyIndex('dataDisks')]",
                "createOption": "Empty",
                "diskSizeGB": 1023
              }
            }
          ]
        }
        ...
      }
    }
  ]
}
```

Notice that when using [copyIndex](template-functions-numeric.md#copyindex) inside a property iteration, you must provide the name of the iteration. Property iteration also supports an offset argument. The offset must come after the name of the iteration, such as `copyIndex('dataDisks', 1)`.

The deployed template becomes:

```json
{
  "name": "examplevm",
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2020-06-01",
  "properties": {
    "storageProfile": {
      "dataDisks": [
        {
          "lun": 0,
          "createOption": "Empty",
          "diskSizeGB": 1023
        },
        {
          "lun": 1,
          "createOption": "Empty",
          "diskSizeGB": 1023
        },
        {
          "lun": 2,
          "createOption": "Empty",
          "diskSizeGB": 1023
        }
      ],
      ...
```

The copy operation is helpful when working with arrays because you can iterate through each element in the array. Use the [length](template-functions-array.md#length) function on the array to specify the count for iterations, and `copyIndex` to retrieve the current index in the array.

The following example template creates a failover group for databases that are passed in as an array.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "primaryServerName": {
      "type": "string"
    },
    "secondaryServerName": {
      "type": "string"
    },
    "databaseNames": {
      "type": "array",
      "defaultValue": [
        "mydb1",
        "mydb2",
        "mydb3"
      ]
    }
  },
  "variables": {
    "failoverName": "[format('{0}/{1}failovergroups', parameters('primaryServerName'), parameters('primaryServerName'))]"
  },
  "resources": [
    {
      "type": "Microsoft.Sql/servers/failoverGroups",
      "apiVersion": "2015-05-01-preview",
      "name": "[variables('failoverName')]",
      "properties": {
        "readWriteEndpoint": {
          "failoverPolicy": "Automatic",
          "failoverWithDataLossGracePeriodMinutes": 60
        },
        "readOnlyEndpoint": {
          "failoverPolicy": "Disabled"
        },
        "partnerServers": [
          {
            "id": "[resourceId('Microsoft.Sql/servers', parameters('secondaryServerName'))]"
          }
        ],
        "copy": [
          {
            "name": "databases",
            "count": "[length(parameters('databaseNames'))]",
            "input": "[resourceId('Microsoft.Sql/servers/databases', parameters('primaryServerName'), parameters('databaseNames')[copyIndex('databases')])]"
          }
        ]
      }
    }
  ],
  "outputs": {
  }
}
```

The `copy` element is an array so you can specify more than one property for the resource.

```json
{
  "type": "Microsoft.Network/loadBalancers",
  "apiVersion": "2017-10-01",
  "name": "exampleLB",
  "properties": {
    "copy": [
      {
        "name": "loadBalancingRules",
        "count": "[length(parameters('loadBalancingRules'))]",
        "input": {
          ...
        }
      },
      {
        "name": "probes",
        "count": "[length(parameters('loadBalancingRules'))]",
        "input": {
          ...
        }
      }
    ]
  }
}
```

You can use resource and property iterations together. Reference the property iteration by name.

```json
{
  "type": "Microsoft.Network/virtualNetworks",
  "apiVersion": "2018-04-01",
  "name": "[format('{0}{1}', parameters('vnetname'), copyIndex())]",
  "copy":{
    "count": 2,
    "name": "vnetloop"
  },
  "location": "[resourceGroup().location]",
  "properties": {
    "addressSpace": {
      "addressPrefixes": [
        "[parameters('addressPrefix')]"
      ]
    },
    "copy": [
      {
        "name": "subnets",
        "count": 2,
        "input": {
          "name": "[format('subnet-{0}', copyIndex('subnets'))]",
          "properties": {
            "addressPrefix": "[variables('subnetAddressPrefix')[copyIndex('subnets')]]"
          }
        }
      }
    ]
  }
}
```

## Example templates

The following example shows a common scenario for creating more than one value for a property.

|Template  |Description  |
|---------|---------|
|[VM deployment with a variable number of data disks](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-windows-copy-datadisks) |Deploys several data disks with a virtual machine. |

## Next steps

- To go through a tutorial, see [Tutorial: Create multiple resource instances with ARM templates](template-tutorial-create-multiple-instances.md).
- For other uses of the copy loop, see:
  - [Resource iteration in ARM templates](copy-resources.md)
  - [Variable iteration in ARM templates](copy-variables.md)
  - [Output iteration in ARM templates](copy-outputs.md)
- If you want to learn about the sections of a template, see [Understand the structure and syntax of ARM templates](./syntax.md).
- To learn how to deploy your template, see [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md).
