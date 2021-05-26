---
title: Define multiple instances of a property in Bicep
description: Use a Bicep property loop to iterate when creating a resource property.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 06/01/2021
---

# Property iteration in Bicep

This article shows you how to create more than one instance of a property in Bicep file. You can add a loop to a resource's `properties` section and dynamically set the number of items for a property during deployment. You also avoid repeating syntax in your Bicep file.

You can only use a loop with top-level resources, even when applying a loop to a property. To learn about changing a child resource to a top-level resource, see [Iteration for a child resource](loop-resources.md#iteration-for-a-child-resource).

You can also use a loop with [resources](loop-resources.md), [variables](loop-variables.md), and [outputs](loop-outputs.md).

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

## Loop limits

The Bicep file's loop iterations can't be a negative number or exceed 800 iterations. To deploy Bicep files, install the latest version of [Bicep tools](install.md).

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

The `lun` property uses the range iterator `i` to create logical unit numbers (LUN) from 0-15.

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

## Next steps

- For other uses of loops, see:
  - [Resource iteration in Bicep files](loop-resources.md)
  - [Variable iteration in Bicep files](loop-variables.md)
  - [Output iteration in Bicep files](loop-outputs.md)
- If you want to learn about the sections of a Bicep file, see [Understand the structure and syntax of Bicep files](file.md).
- For information about how to deploy multiple resources, see [Use Bicep modules](modules.md).
- To set dependencies on resources that are created in a loop, see [Set resource dependencies](./resource-declaration.md#set-resource-dependencies).
- To learn how to deploy with PowerShell, see [Deploy resources with Bicep and Azure PowerShell](deploy-powershell.md).
- To learn how to deploy with Azure CLI, see [Deploy resources with Bicep and Azure CLI](deploy-cli.md).
