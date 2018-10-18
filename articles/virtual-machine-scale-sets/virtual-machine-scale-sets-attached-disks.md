---
title: Azure Virtual Machine Scale Sets Attached Data Disks | Microsoft Docs
description: Learn how to use attached data disks with virtual machine scale sets
services: virtual-machine-scale-sets
documentationcenter: ''
author: gatneil
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 76ac7fd7-2e05-4762-88ca-3b499e87906e
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 4/25/2017
ms.author: negat

---
# Azure virtual machine scale sets and attached data disks
To expand your available storage, Azure [virtual machine scale sets](/azure/virtual-machine-scale-sets/) support VM instances with attached data disks. You can attach data disks when the scale set is created, or to an existing scale set.

> [!NOTE]
>  When you create a scale set with attached data disks, you need to mount and format the disks from within a VM to use them (just like for standalone Azure VMs). A convenient way to complete this process is to use a Custom Script Extension that calls a script to partition and format all the data disks on a VM. For examples of this, see [Azure CLI](tutorial-use-disks-cli.md#prepare-the-data-disks) [Azure PowerShell](tutorial-use-disks-powershell.md#prepare-the-data-disks).


## Create and manage disks in a scale set
For detailed information on how to create a scale set with attached data disks, prepare and format, or add and remove data disks, see one of the following tutorials:

- [Azure CLI](tutorial-use-disks-cli.md)
- [Azure PowerShell](tutorial-use-disks-powershell.md)

The rest of this article outlines specific use cases such as Service Fabric clusters that require data disks, or attaching existing data disks with content to a scale set.


## Create a Service Fabric cluster with attached data disks
Each [node type](../service-fabric/service-fabric-cluster-nodetypes.md) in a [Service Fabric](/azure/service-fabric) cluster running in Azure is backed by a virtual machine scale set.  Using an Azure Resource Manager template, you can attach data disks to the scale set(s) that make up the Service Fabric cluster. You can use an [existing template](https://github.com/Azure-Samples/service-fabric-cluster-templates) as a starting point. In the template, include a _dataDisks_ section in the _storageProfile_ of the _Microsoft.Compute/virtualMachineScaleSets_ resource(s) and deploy the template. The following example attaches a 128 GB data disk:

```json
"dataDisks": [
    {
    "diskSizeGB": 128,
    "lun": 0,
    "createOption": "Empty"
    }
]
```

You can automatically partition, format, and mount the data disks when the cluster is deployed.  Add a custom script extension to the _extensionProfile_ of the _virtualMachineProfile_ of the scale set(s).

To automatically prepare the data disk(s) in a Windows cluster, add the following:

```json
{
    "name": "customScript",    
    "properties": {    
        "publisher": "Microsoft.Compute",    
        "type": "CustomScriptExtension",    
        "typeHandlerVersion": "1.8",    
        "autoUpgradeMinorVersion": true,    
        "settings": {    
        "fileUris": [
            "https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/prepare_vm_disks.ps1"
        ],
        "commandToExecute": "powershell -ExecutionPolicy Unrestricted -File prepare_vm_disks.ps1"
        }
    }
}
```
To automatically prepare the data disk(s) in a Linux cluster, add the following:
```json
{
    "name": "lapextension",
    "properties": {
        "publisher": "Microsoft.Azure.Extensions",
        "type": "CustomScript",
        "typeHandlerVersion": "2.0",
        "autoUpgradeMinorVersion": true,
        "settings": {
        "fileUris": [
            "https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/prepare_vm_disks.sh"
        ],
        "commandToExecute": "bash prepare_vm_disks.sh"
        }
    }
}
```


## Adding pre-populated data disks to an existing scale set
Data disks specified in the scale set model are always empty. However, you may attach an existing data disk to a specific VM in a scale set. This feature is in preview, with examples on [github](https://github.com/Azure/vm-scale-sets/tree/master/preview/disk). If you wish to propagate data across all VMs in the scale set, you may duplicate your data disk and attach it to each VM in the scale set, you may create a custom image that contains the data and provision the scale set from this custom image, or you may use Azure Files or a similar data storage offering.


## Additional notes
Support for Azure Managed disks and scale set attached data disks is available in API version [_2016-04-30-preview_](https://github.com/Azure/azure-rest-api-specs/blob/master/arm-compute/2016-04-30-preview/swagger/compute.json) or later of the Microsoft.Compute API.

Azure portal support for attached data disks in scale sets is initially limited. Depending on your requirements you can use Azure templates, CLI, PowerShell, SDKs, and REST API to manage attached disks.


