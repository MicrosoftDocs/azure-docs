---
title: Multiple copies of Azure resource property | Microsoft Docs
description: In Azure Resource Manager template, create multiple instances of a property on a resource type. You must use the take function instead of the copy loop for this scenario.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: ''

ms.assetid: 
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/17/2017
ms.author: tomfitz

---
# Create multiple instances of property on resource type
You can only use [copy](resource-group-create-multiple.md) on resource types, not on properties within a resource type. This requirement may create problems for you when you want to create multiple instances of something that is part of a resource. A common scenario is to create multiple data disks for a Virtual Machine. You cannot use copy with the data disks because dataDisks is a property on the Virtual Machine, not its own resource type. Instead, you create an array with as many data disks as you need, and pass in the actual number of data disks to create. In the virtual machine definition, you use the `take` function to get only the number of elements that you actually want from the array.

A full example of this pattern is show in the [Create a VM with a dynamic selection of data disks](https://azure.microsoft.com/documentation/templates/201-vm-dynamic-data-disks-selection/) template.

The relevant sections of the deployment template are shown in this article. Parts of the templates have been removed to highlight the sections involved in dynamically creating a number of data disks. 

## Define template with variable for the property

To create a virtual machine with multiple data disks, add an array variable that defines more data disks than you need. In the parameter `numDataDisks`, pass the actual number of data disks to create. Use `take` to specify the exact number of elements in the array to assign to the virtual machine.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "numDataDisks": {
      "type": "int",
      "maxValue": 64,
      "metadata": {
        "description": "This parameter allows you to select the number of disks you want"
      }
    }
  },
  "variables": {
    "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'dynamicdisk')]",
    "sizeOfDataDisksInGB": 100,
    "diskCaching": "ReadWrite",
    "diskArray": [
      {
        "name": "datadisk1",
        "lun": 0,
        "vhd": {
          "uri": "[concat('http://', variables('storageAccountName'),'.blob.core.windows.net/vhds/', 'datadisk1.vhd')]"
        },
        "createOption": "Empty",
        "caching": "[variables('diskCaching')]",
        "diskSizeGB": "[variables('sizeOfDataDisksInGB')]"
      },
      {
        "name": "datadisk2",
        "lun": 1,
        "vhd": {
          "uri": "[concat('http://', variables('storageAccountName'),'.blob.core.windows.net/vhds/', 'datadisk2.vhd')]"
        },
        "createOption": "Empty",
        "caching": "[variables('diskCaching')]",
        "diskSizeGB": "[variables('sizeOfDataDisksInGB')]"
      },
      {
        "name": "datadisk3",
        "lun": 2,
        "vhd": {
          "uri": "[concat('http://', variables('storageAccountName'),'.blob.core.windows.net/vhds/', 'datadisk3.vhd')]"
        },
        "createOption": "Empty",
        "caching": "[variables('diskCaching')]",
        "diskSizeGB": "[variables('sizeOfDataDisksInGB')]"
      },
      {
        "name": "datadisk4",
        "lun": 3,
        "vhd": {
          "uri": "[concat('http://', variables('storageAccountName'),'.blob.core.windows.net/vhds/', 'datadisk4.vhd')]"
        },
        "createOption": "Empty",
        "caching": "[variables('diskCaching')]",
        "diskSizeGB": "[variables('sizeOfDataDisksInGB')]"
      },
      ... /* not all elements shown */
      {
        "name": "datadisk63",
        "lun": 62,
        "vhd": {
          "uri": "[concat('http://', variables('storageAccountName'),'.blob.core.windows.net/vhds/', 'datadisk63.vhd')]"
        },
        "createOption": "Empty",
        "caching": "[variables('diskCaching')]",
        "diskSizeGB": "[variables('sizeOfDataDisksInGB')]"
      },
      {
        "name": "datadisk64",
        "lun": 63,
        "vhd": {
          "uri": "[concat('http://', variables('storageAccountName'),'.blob.core.windows.net/vhds/', 'datadisk64.vhd')]"
        },
        "createOption": "Empty",
        "caching": "[variables('diskCaching')]",
        "diskSizeGB": "[variables('sizeOfDataDisksInGB')]"
      }
    ]
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "properties": {
        "storageProfile": {
          "dataDisks": "[take(variables('diskArray'),parameters('numDataDisks'))]"
        },
        ...
      }
      ...
    }
  ]
}
```

## Create multiple virtual machines with multiple data disks

You can use the **take** function and the **copy** element together when you need to create multiple instances of a resource with a variable number of items for a property. For example, suppose you need to create multiple virtual machines, but each virtual machine has a different number of data disks. 

To give each data disk a name that identifies the associated virtual machine, put your array of data disks into a separate template. Include parameters for the virtual machine name, and the number of data disks to return. In the outputs section, return the number of specified items.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string"
    },
    "storageAccountName": {
      "type": "string"
    },
    "numDataDisks": {
      "type": "int",
      "maxValue": 16,
      "metadata": {
        "description": "This parameter allows the user to select the number of disks they want"
      }
    }
  },
  "variables": {
    "diskArray": [
      {
        "name": "[concat(parameters('vmName'), '-datadisk1')]",
        "vhd": {
          "uri": "[concat('http://', parameters('storageAccountName'),'.blob.core.windows.net/vhds/', parameters('vmName'), '-datadisk1.vhd')]"
        },
        ...
      },
      ...
    ],
  },
  "resources": [
  ],
  "outputs": {
    "result": {
      "type": "array",
      "value": "[take(variables('diskArray'),parameters('numDataDisks'))]"
    }
  }
}
``` 

In the parent template, you include parameters for the number of virtual machines, and an array for the number of data disks for each virtual machine.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    ...
    "numberOfInstances": {
      "type": "int",
      "defaultValue": 2,
      "metadata": {
        "description": "Number of VMs to deploy"
      }
    },
    "numberOfDataDisksPerVM": {
      "type": "array",
      "defaultValue": [1,2]
    }
  },
```

In the resources section, deploy multiple instances of the template that defines the data disks. 

```json
{
  "apiVersion": "2016-09-01",
  "name": "[concat('nested-', copyIndex())]",
  "type": "Microsoft.Resources/deployments",
  "copy": {
    "name": "deploycopy",
    "count": "[parameters('numberOfInstances')]"
  },
  "properties": {
    "mode": "incremental",
    "templateLink": {
      "uri": "{data-disk-template-uri}",
      "contentVersion": "1.0.0.0"
    },
    "parameters": {
      "vmName": { "value": "[concat('myvm', copyIndex())]" },
      "storageAccountName": { "value": "[variables('storageAccountName')]" },
      "numDataDisks": { "value": "[parameters('numberOfDataDisksPerVM')[copyIndex()]]" }
    }
  }
},
```

In the resources section, deploy multiple instances of the virtual machine. For the data disks, reference the nested deployment that contains the correct number of data disks and the correct names for data disks.

```json
{
  "type": "Microsoft.Compute/virtualMachines",
  "name": "[concat('myvm', copyIndex())]",
  "copy": {
    "name": "virtualMachineLoop",
      "count": "[parameters('numberOfInstances')]"
  },
  "properties": {
    "storageProfile": {
      ...
      "dataDisks": "[reference(concat('nested-', copyIndex())).outputs.result.value]"
    },
    ...
  },
  ...
}
```

## Next steps
* For an introduction to creating multiple instances of a resource, see [Deploy multiple instances of resources in Azure Resource Manager templates](resource-group-create-multiple.md).
* To create iterated resources in sequence, see [Sequential looping for Azure Resource Manager templates](resource-manager-sequential-loop.md).
* To learn how to deploy your template, see [Deploy an application with Azure Resource Manager Template](resource-group-template-deploy.md).

