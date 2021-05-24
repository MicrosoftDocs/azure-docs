---
title: Define multiple instances of a property in Bicep
description: Use a Bicep property loop to iterate when creating a resource property.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 05/20/2021
---

# Property iteration in Bicep

This article shows you how to create more than one instance of a property in Bicep file. You can add a loop to a resource's `properties` section and dynamically set the number of items for a property during deployment. You also avoid repeating syntax in your Bicep file.

You can only use a loop with top-level resources, even when applying a loop to a property. To learn about changing a child resource to a top-level resource, see [Iteration for a child resource](copy-resources.md#iteration-for-a-child-resource).

You can also use a loop with [resources](copy-resources.md), [variables](copy-variables.md), and [outputs](copy-outputs.md).

## Syntax

Loops can be used to declare multiple properties by:

- Iterating over an array.

  ```bicep
  <property-name>: [for <item> in <collection>: {
    <properties>
  }]
  ```

- Iterating over the elements of an array.

  ```bicep
  <property-name>: [for (<item>, <index>) in <collection>: {
    <properties>
  }]
  ```

- Using a loop index.

  ```bicep
  <property-name>: [for <index> in range(<start>, <stop>): {
    <properties>
  }]
  ```

## Copy limits

The Bicep file builds a JSON template that uses the `copy` element and there are limitations that affect the `copy` element. For more information, see [Property iteration in ARM templates](../templates/copy-properties.md).

## Property iteration

The following example shows how to apply a loop to the `dataDisks` property on a virtual machine:

```bicep
@minValue(0)
@maxValue(16)
@description('The number of dataDisks to be returned in the output array.')
param numberOfDataDisks int = 16

resource vmName 'Microsoft.Compute/virtualMachines@2020-06-01' = {
  ...
  properties: {
    storageProfile: {
      ...
      dataDisks: [for i in range(0, numberOfDataDisks): {
        lun: i
        createOption: 'Empty'
        diskSizeGB: 1023
      }]
    }
    ...
  }
}
```

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

You can use resource and property iteration together. Reference the property iteration by name.

```bicep
resource vnetname_resource 'Microsoft.Network/virtualNetworks@2018-04-01' = [for i in range(0, 2): {
  name: concat(vnetname, i)
  location: resourceGroup().location
  properties: {
    addressSpace: {
      addressPrefixes: [
        addressPrefix
      ]
    }
    subnets: [for j in range(0, 2): {
      name: 'subnet-${j}'
      properties: {
        addressPrefix: subnetAddressPrefix[j]
      }
    }]
  }
}]
```

## Example templates

The following example shows a common scenario for creating more than one value for a property.

|Template  |Description  |
|---------|---------|
|[VM deployment with a variable number of data disks](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-windows-copy-datadisks) |Deploys several data disks with a virtual machine. |

## Next steps

- For other uses of loops, see:
  - [Resource iteration in Bicep files](copy-resources.md)
  - [Variable iteration in Bicep files](copy-variables.md)
  - [Output iteration in Bicep files](copy-outputs.md)
- If you want to learn about the sections of a Bicep file, see [Understand the structure and syntax of Bicep files](file.md).
- For information about how to deploy multiple resources, see [Use Bicep modules](modules.md).
- To set dependencies on resources that are created in a loop, see [Define the order for deploying resources](resource-dependency.md).
- To learn how to deploy with PowerShell, see [Deploy resources with Bicep and Azure PowerShell](deploy-powershell.md).
- To learn how to deploy with Azure CLI, see [Deploy resources with Bicep and Azure CLI](deploy-cli.md).
