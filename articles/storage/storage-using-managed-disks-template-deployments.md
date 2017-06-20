---
title: Using managed disks in Azure Resource Manager templates | Microsoft Docs
description: Details how to use managed misks in Azure Resource Manager templates
services: storage
documentationcenter:
author: jboeshart
manager: 

ms.service: storage
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage
ms.date: 06/01/2017
ms.author: jaboes
---

# Using Managed Disks in Azure Resource Manager Templates

This document walks through the differences between managed and unmanaged disks when using Azure Resource Manager templates to provision virtual machines. This will help you to update existing templates that are using unmanaged Disks to managed disks. For reference, we are using the [101-vm-simple-windows](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows) template as a guide. You can see the template using both [managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows/azuredeploy.json) and a prior version using [unmanaged disks](https://github.com/Azure/azure-quickstart-templates/tree/93b5f72a9857ea9ea43e87d2373bf1b4f724c6aa/101-vm-simple-windows/azuredeploy.json) if you'd like to directly compare them.

## Unmanaged Disks template formatting

To begin, we take a look at how unmanaged disks are deployed. When creating unmanaged disks, you need a storage account to hold the VHD files. You can create a new storage account or use one that already exists. This article will show you how to create a new storage account. To accomplish this, you need a storage account resource in the resources block as shown below.

```
{
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[variables('storageAccountName')]",
    "apiVersion": "2016-01-01",
    "location": "[resourceGroup().location]",
    "sku": {
        "name": "Standard_LRS"
    },
    "kind": "Storage",
    "properties": {}
}
```

Within the virtual machine object, we need a dependency on the storage account to ensure that it's created before the virtual machine. Within the `storageProfile` section, we then specify the full URI of the VHD location, which references the storage account and is needed for the OS disk and any data disks. 

```
{
    "apiVersion": "2015-06-15",
    "type": "Microsoft.Compute/virtualMachines",
    "name": "[variables('vmName')]",
    "location": "[resourceGroup().location]",
    "dependsOn": [
    "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
    "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
    ],
    "properties": {
        "hardwareProfile": {...},
        "osProfile": {...},
        "storageProfile": {
            "imageReference": {
                "publisher": "MicrosoftWindowsServer",
                "offer": "WindowsServer",
                "sku": "[parameters('windowsOSVersion')]",
                "version": "latest"
            },
            "osDisk": {
                "name": "osdisk",
                "vhd": {
                    "uri": "[concat(reference(resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))).primaryEndpoints.blob, 'vhds/osdisk.vhd')]"
                },
                "caching": "ReadWrite",
                "createOption": "FromImage"
            },
            "dataDisks": [
                {
                    "name": "datadisk1",
                    "diskSizeGB": "1023",
                    "lun": 0,
                    "vhd": {
                        "uri": "[concat(reference(resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))).primaryEndpoints.blob, 'vhds/datadisk1.vhd')]"
                    },
                    "createOption": "Empty"
                }
            ]
        },
        "networkProfile": {...},
        "diagnosticsProfile": {...}
    }
}
```

## Managed disks template formatting

With Azure Managed Disks, the disk becomes a top-level resource and no longer requires a storage account to be created by the user. Managed disks are exposed in the `2016-04-30-preview` API version, and are now the default disk type. The following sections walk through the default settings and detail how to further customize your disks.

### Default managed disk settings

To create a VM with managed disks, you no longer need to create the storage account resource and can update your virtual machine resource as follows. Specifically note that the `apiVersion` reflects `2016-04-30-preview` and the `osDisk` and `dataDisks` no longer refer to a specific URI for the VHD. When deploying without specifying additional properties, the disk will use [Standard LRS storage]((storage-redundancy.md). If no name is specified, it takes the format of `<VMName>_OsDisk_1_<randomstring>` for the OS disk and `<VMName>_disk<#>_<randomstring>` for each data disk. By default, Azure disk encryption is disabled; caching is Read/Write for the OS disk and None for data disks. You may notice in the example below there is still a storage account dependency, though this is only for storage of diagnostics and is not needed for disk storage.

```
{
    "apiVersion": "2016-04-30-preview",
    "type": "Microsoft.Compute/virtualMachines",
    "name": "[variables('vmName')]",
    "location": "[resourceGroup().location]",
    "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
        "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
    ],
    "properties": {
        "hardwareProfile": {...},
        "osProfile": {...},
        "storageProfile": {
            "imageReference": {
                "publisher": "MicrosoftWindowsServer",
                "offer": "WindowsServer",
                "sku": "[parameters('windowsOSVersion')]",
                "version": "latest"
            },
            "osDisk": {
                "createOption": "FromImage"
            },
            "dataDisks": [
                {
                    "diskSizeGB": "1023",
                    "lun": 0,
                    "createOption": "Empty"
                }
            ]
        },
        "networkProfile": {...},
        "diagnosticsProfile": {...}
    }
}
```

### Using a top-level managed disk resource

As an alternative to specifying the disk configuration in the virtual machine object, you can create a top-level disk resource and attach it as part of the virtual machine creation. For example, we can create a disk resource as follows to use as a data disk.

```
{
    "type": "Microsoft.Compute/disks",
    "name": "[concat(variables('vmName'),'-datadisk1')]",
    "apiVersion": "2016-04-30-preview",
    "location": "[resourceGroup().location]",
    "properties": {
        "creationData": {
            "createOption": "Empty"
        },
        "accountType": "Standard_LRS",
        "diskSizeGB": 1023
    }
}
```

Within the VM object, we can then reference this disk object to be attached. Specifying the resource ID of the managed disk we created in the `managedDisk` property allows the attachment of the disk as the VM is created. The `apiVersion` for the VM resource must be `2016-04-30-preview` to use this functionality. Also note that we've created a dependency on the disk resource to ensure it's successfully created before VM creation. 

```
{
    "apiVersion": "2016-04-30-preview",
    "type": "Microsoft.Compute/virtualMachines",
    "name": "[variables('vmName')]",
    "location": "[resourceGroup().location]",
    "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
        "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]",
        "[resourceId('Microsoft.Compute/disks/', concat(variables('vmName'),'-datadisk1'))]"
    ],
    "properties": {
        "hardwareProfile": {...},
        "osProfile": {...},
        "storageProfile": {
            "imageReference": {
                "publisher": "MicrosoftWindowsServer",
                "offer": "WindowsServer",
                "sku": "[parameters('windowsOSVersion')]",
                "version": "latest"
            },
            "osDisk": {
                "createOption": "FromImage"
            },
            "dataDisks": [
                {
                    "lun": 0,
                    "name": "[concat(variables('vmName'),'-datadisk1')]",
                    "createOption": "attach",
                    "managedDisk": {
                        "id": "[resourceId('Microsoft.Compute/disks/', concat(variables('vmName'),'-datadisk1'))]"
                    }
                }
            ]
        },
        "networkProfile": {...},
        "diagnosticsProfile": {...}
    }
}
```

### Create managed availability sets with VMs using managed disks

To create managed availability sets with VMs using managed disks, add the `sku` object to the availability set resource and set the `name` property to `Aligned`. This ensures that the disks for each VM are sufficiently isolated from each other to avoid single points of failure. The `apiVersion` for the availability set resource must also be `2016-04-30-preview` to use this functionality.

```
{
    "apiVersion": "2016-04-30-preview",
    "type": "Microsoft.Compute/availabilitySets",
    "location": "[resourceGroup().location]",
    "name": "[variables('avSetName')]",
    "properties": {
        "PlatformUpdateDomainCount": "3",
        "PlatformFaultDomainCount": "2"
    },
    "sku": {
        "name": "Aligned"
    }
}
```

### Additional scenarios and customizations

To find full information on the REST API specifications, please review the [create a managed disk REST API documentation](/rest/api/manageddisks/disks/disks-create-or-update). You will find additional scenarios, as well as default and acceptable values that can be submitted to the API through template deployments. 

## Next steps

* For full templates that use managed disks visit the following Azure Quickstart Repo links.
    * [Windows VM with managed disk](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows)
    * [Linux VM with managed disk](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-linux)
    * [Full list of managed disk templates](https://github.com/Azure/azure-quickstart-templates/blob/master/managed-disk-support-list.md)
* Visit the [Azure Managed Disks Overview](storage-managed-disks-overview.md) document to learn more about managed disks.
* Review the template reference documentation for virtual machine resources by visiting the [Microsoft.Compute/virtualMachines template reference](/templates/microsoft.compute/virtualmachines) document.
* Review the template reference documentation for disk resources by visiting the [Microsoft.Compute/disks template reference](/templates/microsoft.compute/disks) document.
 
