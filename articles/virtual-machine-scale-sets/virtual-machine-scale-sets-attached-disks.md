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
Azure [virtual machine scale sets](/azure/virtual-machine-scale-sets/) now support virtual machines with attached data disks. Data disks can be defined in the storage profile for scale sets that have been created with Azure Managed Disks. Previously the only directly attached storage options available with VMs in scale sets were the OS drive and temp drives.

> [!NOTE]
>  When you create a scale set with attached data disks defined, you still need to mount and format the disks from within a VM to use them (just like for standalone Azure VMs). A convenient way to complete this process is to use a custom script extension that calls a standard script to partition and format all the data disks on a VM.

## Create a scale set with attached data disks
A simple way to create a scale set with attached disks is to use the [az vmss create](/cli/azure/vmss#az_vmss_create) command. The following example creates an Azure resource group, and a virtual machine scale set of 10 Ubuntu VMs, each with 2 attached data disks, of 50 GB and 100 GB respectively.

```bash
az group create -l southcentralus -n dsktest
az vmss create -g dsktest -n dskvmss --image ubuntults --instance-count 10 --data-disk-sizes-gb 50 100
```

The [az vmss create](/cli/azure/vmss#az_vmss_create) command defaults certain configuration values if you do not specify them. To see the available options that you can override try:

```bash
az vmss create --help
```

Another way to create a scale set with attached data disks is to define a scale set in an Azure Resource Manager template, include a _dataDisks_ section in the _storageProfile_, and deploy the template. The 50 GB and 100-GB disk in the previous example would be defined as shown in the following template example:

```json
"dataDisks": [
    {
    "lun": 1,
    "createOption": "Empty",
    "caching": "ReadOnly",
    "diskSizeGB": 50
    },
    {
    "lun": 2,
    "createOption": "Empty",
    "caching": "ReadOnly",
    "diskSizeGB": 100
    }
]
```

You can see a complete, ready to deploy example of a scale set template with an attached disk defined here: [https://github.com/chagarw/MDPP/tree/master/101-vmss-os-data](https://github.com/chagarw/MDPP/tree/master/101-vmss-os-data).

## Create a Service Fabric cluster with attached data disks
Each [node type](../service-fabric/service-fabric-cluster-nodetypes.md) in a [Service Fabric](/azure/service-fabric) cluster running in Azure is backed by a virtual machine scale set.  Using a Azure Resource Manager template, you can attach data disks to the scale set(s) that make up the Service Fabric cluster. You can use an [existing template](https://github.com/Azure-Samples/service-fabric-cluster-templates) as a starting point. In the template, include a _dataDisks_ section in the _storageProfile_ of the _Microsoft.Compute/virtualMachineScaleSets_ resource(s) and deploy the template. The following example attaches a 128 GB data disk:

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

## Adding a data disk to an existing scale set
> [!NOTE]
>  You can only attach data disks to a scale set that has been created with [Azure Managed Disks](./virtual-machine-scale-sets-managed-disks.md).

You can add a data disk to a virtual machine scale set using Azure CLI _az vmss disk attach_ command. Make sure you specify a LUN that is not already in use. The following CLI example adds a 50-GB drive to LUN 3:

```bash
az vmss disk attach -g dsktest -n dskvmss --size-gb 50 --lun 3
```

The following PowerShell example adds a 50 GB drive to LUN 3:

```powershell
$vmss = Get-AzureRmVmss -ResourceGroupName myvmssrg -VMScaleSetName myvmss
$vmss = Add-AzureRmVmssDataDisk -VirtualMachineScaleSet $vmss -Lun 3 -Caching 'ReadWrite' -CreateOption Empty -DiskSizeGB 50 -StorageAccountType StandardLRS
Update-AzureRmVmss -ResourceGroupName myvmssrg -Name myvmss -VirtualMachineScaleSet $vmss
```

> [!NOTE]
> Different VM sizes have different limits on the numbers of attached drives they support. Check the [virtual machine size characteristics](../virtual-machines/windows/sizes.md) before adding a new disk.

You can also add a disk by adding a new entry to the _dataDisks_ property in the _storageProfile_ of a scale set definition and applying the change. To test this, find an existing scale set definition in the [Azure Resource Explorer](https://resources.azure.com/). Select _Edit_ and add a new disk to the list of data disks, as shown in the following example:

```json
"dataDisks": [
    {
    "lun": 1,
    "createOption": "Empty",
    "caching": "ReadOnly",
    "diskSizeGB": 50
    },
    {
    "lun": 2,
    "createOption": "Empty",
    "caching": "ReadOnly",
    "diskSizeGB": 100
    },
    {
    "lun": 3,
    "createOption": "Empty",
    "caching": "ReadOnly",
    "diskSizeGB": 20
    }          
]
```

Then select _PUT_ to apply the changes to your scale set. This example would work as long as you are using a VM size that supports more than two attached data disks.

> [!NOTE]
> When you make a change to a scale set definition such as adding or removing a data disk, it applies to all newly created VMs, but only applies to existing VMs if the _upgradePolicy_ property is set to "Automatic". If it is set to "Manual", you need to manually apply the new model to existing VMs. You can do this in the portal, using the _Update-AzureRmVmssInstance_ PowerShell command, or using the _az vmss update-instances_ CLI command.

## Adding pre-populated data disks to an existent scale set 
> When you add disks to an existent scale set model, by design, the disk is always created empty. This scenario also includes new instances created by the scale set. This behavior is because the scale set definition has an empty data disk. In order to create pre-populated data drives for an existent scale set model, you can choose either of next two options:

* Copy data from the instance 0 VM to the data disk(s) in the other VMs by running a custom script.
* Create a managed image with the OS disk plus data disk (with the required data) and create a new scale set with the image. This way every new VM created has a data disk that that is provided in the definition of the scale set. Since this definition refers to an image with a data disk that has customized data, every virtual machine on the scale set has these changes.

> The way to create a custom image can be found here: [Create a managed image of a generalized VM in Azure](/azure/virtual-machines/windows/capture-image-resource/) 

> The user needs to capture the instance 0 VM that has the required data, and then use that vhd for the image definition.

## Removing a data disk from a scale set
You can remove a data disk from a virtual machine scale set using Azure CLI _az vmss disk detach_ command. For example the following command removes the disk defined at LUN 2:
```bash
az vmss disk detach -g dsktest -n dskvmss --lun 2
```  
Similarly you can also remove a disk from a scale set by removing an entry from the _dataDisks_ property in the _storageProfile_ and applying the change. 

## Additional notes
Support for Azure Managed disks and scale set attached data disks is available in API version [_2016-04-30-preview_](https://github.com/Azure/azure-rest-api-specs/blob/master/arm-compute/2016-04-30-preview/swagger/compute.json) or later of the Microsoft.Compute API.

In the initial implementation of attached disk support for scale sets, you cannot attach or detach data disks to/from individual VMs in a scale set.

Azure portal support for attached data disks in scale sets is initially limited. Depending on your requirements you can use Azure templates, CLI, PowerShell, SDKs, and REST API to manage attached disks.


