---
title: Using Managed Disks in Azure Resource Manager Templates | Microsoft Docs
description: Details how to use Managed Disks in Azure Resource Manager templates
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

This document walks through the differences between Managed and Unmanaged Disks when using Azure resource manager templates to provision virtual machines. This will help you to update existing templates that are using Unmanaged Disks to Managed Disks. For reference, we are using the [101-vm-simple-windows](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows) template as a guide. You can see the template using both [Managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows/azuredeploy.json) and a prior version using [unmanaged disks](https://github.com/Azure/azure-quickstart-templates/tree/93b5f72a9857ea9ea43e87d2373bf1b4f724c6aa/101-vm-simple-windows/azuredeploy.json) if you'd like to directly compare them.

## Unmanaged Disks template formatting

To begin, we take a look at how unmanaged disks are deployed. When creating unmanaged disks you have to create a storage account, and specify that storage account for the VHD files to be placed in. To accomplish this, you need a storage account resource in the resources block as shown below.

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

Within the virtual machine object, we need a dependency on the storage account to ensure that it's created before the virtual machine creation. Within the `storageProfile` section we then specify the full URI of the VHD location, which references the storage account and is needed for the OS disk and any data disks. 

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

## Managed Disks template formatting

With Managed Disks, the disk becomes a top-level resource and no longer requires a storage account to be created by the user. Managed disks are exposed in the `2016-04-30-preview` API version, and are now the default disk type. The following sections walk through the default settings and detail how to further customize your disks.

### Default Managed Disk settings

To create a VM with managed disks you no longer need to create the storage account resource, and can update your virtual machine resource as follows. Specifically note that the `apiVersion` reflects `2016-04-30-preview` and the `osDisk` and `dataDisks` no longer refer to a specific URI for the VHD. When deploying without specifying additional properties the disk will use Standard LRS storage. If no name is specified it takes the format of `<VMName>_OsDisk_1_<randomstring>` for the OS disk, and `<VMName>_disk<#>_<randomstring>` for each data disk. Azure disk encryption is disabled by default and caching is Read/Write for the OS disk and none for data disks. You may notice in the example below there is still a storage account dependency, though this is only for storage of diagnostics and is not needed for disk storage.

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

### Using a top-level Managed Disk resource

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
Within the VM object, we can then reference this disk object to be attached. Specifying the resource ID of the Managed Disk we created in the `managedDisk` property allows the attachment of the disk as the VM is created. The `apiVersion` for the VM resource must be `2016-04-30-preview` to use this functionality. Also note that we've created a dependency on the disk resource to ensure it's successfully created before VM creation. 

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

### Create managed Availability Sets with VMs using Managed Disks

To create managed Availability Sets with VMs using Managed Disks, add the `sku` object to the Availability Set resource and set the `name` property to `Aligned`. This ensures that the disks for each VM are sufficiently isolated from each other to avoid single points of failure. The `apiVersion` for the Availability Set resource must also be `2016-04-30-preview` to use this functionality.

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

To find full information on the REST API specifications, please review the [REST API documentation](https://docs.microsoft.com/en-us/rest/api/manageddisks/disks/disks-create-or-update). You will find additional scenarios, as well as default and accpetable values that can be submitted to the API through template deployments. 

## Next Steps

* For full templates that use managed disks visit the following Azure Quickstart Repo links.
    * [Windows VM with Managed Disk](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows)
    * [Linux VM with Managed Disk](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-linux)
    * [Full list of Managed Disk templates](https://github.com/Azure/azure-quickstart-templates/blob/master/managed-disk-support-list.md)
* Visit the [Managed Disks overview](https://docs.microsoft.com/en-us/azure/storage/storage-managed-disks-overview) to learn more about Managed Disks.
* Review the template reference documentation for [Virtual Machine](https://docs.microsoft.com/en-us/azure/templates/microsoft.compute/virtualmachines) resources.
* Review the template reference documentation for [disk](https://docs.microsoft.com/en-us/azure/templates/microsoft.compute/disks) resources.
 
