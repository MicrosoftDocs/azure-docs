---
title: Azure Virtual Machine Scale Sets Attached Data Disks
description: Learn how to use attached data disks with Virtual Machine Scale Sets through outlines of specific use cases.
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt

---
# Azure Virtual Machine Scale Sets and attached data disks

To expand your available storage, Azure [Virtual Machine Scale Sets](./index.yml) support VM instances with attached data disks. You can attach data disks when the scale set is created, or to an existing scale set.

## Create and manage disks in a scale set
For detailed information on how to create a scale set with attached data disks, prepare and format, or add and remove data disks, see one of the following tutorials:

- [Azure CLI](tutorial-use-disks-cli.md)
- [Azure PowerShell](tutorial-use-disks-powershell.md)

The rest of this article outlines specific use cases such as Service Fabric clusters that require data disks, or attaching existing data disks with content to a scale set.


## Create a Service Fabric cluster with attached data disks
Each [node type](../service-fabric/service-fabric-cluster-nodetypes.md) in a [Service Fabric](../service-fabric/index.yml) cluster running in Azure is backed by a Virtual Machine Scale Set. Using an Azure Resource Manager template, you can attach data disks to the scale set(s) that make up the Service Fabric cluster. You can use an [existing template](https://github.com/Azure-Samples/service-fabric-cluster-templates) as a starting point. In the template, include a _dataDisks_ section in the _storageProfile_ of the _Microsoft.Compute/virtualMachineScaleSets_ resource(s) and deploy the template. The following example attaches a 128 GB data disk:

```json
"dataDisks": [
    {
    "diskSizeGB": 128,
    "lun": 0,
    "createOption": "Empty"
    }
]
```

You can automatically partition, format, and mount the data disks when the cluster is deployed. Add a custom script extension to the _extensionProfile_ of the _virtualMachineProfile_ of the scale set(s).

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
Data disks specified in the scale set model are always empty. However, you may attach an existing data disk to a specific VM in a scale set. If you wish to propagate data across all VMs in the scale set, you may duplicate your data disk and attach it to each VM in the scale set, or create a custom image that contains the data and provision the scale set from this custom image, or you may use Azure Files or a similar data storage offering.


## Additional notes
Support for Azure Managed disks and scale set attached data disks is available in API version [_2016-04-30-preview_](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2021-11-01/compute.json) or later of the Microsoft.Compute API.

Azure portal support for attached data disks in scale sets is limited. Depending on your requirements you can use Azure templates, CLI, PowerShell, SDKs, and REST API to manage attached disks.
