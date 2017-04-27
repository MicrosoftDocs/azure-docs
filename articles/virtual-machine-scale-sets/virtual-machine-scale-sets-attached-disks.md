---
title: Azure Virtual Machine Scale Sets Attached Data Disks | Microsoft Docs
description: Learn how to use attached data disks with virtual machine scale sets
services: virtual-machine-scale-sets
documentationcenter: ''
author: gbowerman
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 76ac7fd7-2e05-4762-88ca-3b499e87906e
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 4/25/2017
ms.author: guybo

---
# Azure VM scale sets and attached data disks
Azure [virtual machine scale sets](/azure/virtual-machine-scale-sets/) now support virtual machines with attached data disks. Data disks can be defined in the storage profile for scale sets that have been created with Azure Managed Disks. Previously the only directly attached storage options available with VMs in scale sets were the OS drive and temp drives.

> [!NOTE]
>  When you create a scale set with attached data disks defined, you still need to mount and format the disks from within a VM to use them (just like for standalone Azure VMs). A convenient way to do this is to use a custom script extension which calls a standard script to partition and format all the data disks on a VM.

## Create a scale set with attached data disks
A simple way to create a scale set with attached disks is to use the [Azure CLI](https://github.com/Azure/azure-cli) _vmss create_ command. The following example creates an Azure resource group, and a VM scale set of 10 Ubuntu VMs, each with 2 attached data disks, of 50 GB and 100 GB respectively.
```bash
az group create -l southcentralus -n dsktest
az vmss create -g dsktest -n dskvmss --image ubuntults --instance-count 10 --data-disk-sizes-gb 50 100
```
Note that the _vmss create_ command defaults certain configuration values if you do not specify them. To see the available options that you can override try:
```bash
az vmss create --help
```
Another way to create a scale set with attached data disks is to define a scale set in an Azure Resource Manager template, include a _dataDisks_ section in the _storageProfile_, and deploy the template. The 50 GB and 100 GB disk example above would be defined like this in the template:
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

## Adding a data disk to an existing scale set
> [!NOTE]
>  You can only attach data disks to a scale set which has been created with [Azure Managed Disks](./virtual-machine-scale-sets-managed-disks.md).

You can add a data disk to a VM scale set using Azure CLI _az vmss disk attach_ command. Make sure you specify a lun which is not already in use. The following CLI example adds a 50 GB drive to lun 3:
```bash
az vmss disk attach -g dsktest -n dskvmss --size-gb 50 --lun 3
```

The following PowerShell example adds a 50 GB drive to lun 3:
```powershell
$vmss = Get-AzureRmVmss -ResourceGroupName myvmssrg -VMScaleSetName myvmss
$vmss = Add-AzureRmVmssDataDisk -VirtualMachineScaleSet $vmss -Lun 3 -Caching 'ReadWrite' -CreateOption Empty -DiskSizeGB 50 -StorageAccountType StandardLRS
Update-AzureRmVmss -ResourceGroupName myvmssrg -Name myvmss -VirtualMachineScaleSet $vmss
```

> [!NOTE]
> Different VM sizes have different limits on the numbers of attached drives they support. Check the [virtual machine size characteristics](../virtual-machines/windows/sizes.md) before adding a new disk.

You can also add a disk by adding a new entry to the _dataDisks_ property in the _storageProfile_ of a scale set definition and applying the change. To test this, find an existing scale set definition in the [Azure Resource Explorer](https://resources.azure.com/). Select _Edit_ and add a new disk to the list of data disks. E.g. using the example above:
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
Then select _PUT_ to apply the changes to your scale set. This example would work as long as you are using a VM size which supports more than two attached data disks.

> [!NOTE]
> When you make a change to a scale set definition such as adding or removing a data disk, it applies to all newly created VMs, but only applies to existing VMs if the _upgradePolicy_ property is set to "Automatic". If it is set to "Manual", you need to manually apply the new model to existing VMs. You can do this in the portal, using the _Update-AzureRmVmssInstance_ PowerShell command, or using the _az vmss update-instances_ CLI command.

## Removing a data disk from a scale set
You can remove a data disk from a VM scale set using Azure CLI _az vmss disk detach_ command. For example the following command removes the disk defined at lun 2:
```bash
az vmss disk detach -g dsktest -n dskvmss --lun 2
```  
Similarly you can also remove a disk from a scale set by removing an entry from the _dataDisks_ property in the _storageProfile_ and applying the change. 

## Additional notes
Support for Azure Managed disks, and scale set attached data disks was added to the [_2016-04-30-preview_](https://github.com/Azure/azure-rest-api-specs/blob/master/arm-compute/2016-04-30-preview/swagger/compute.json) version of the Microsoft.Compute APi. You can use any SDK or command-line tool built with this version or later of the API.

In the initial implementation of attached disk support for scale sets, you cannot attach or detach data disks to/from individual VMs in a scale set.

Azure portal support for attached data disks in scale sets is initially limited. Depending on your requirements you can use Azure templates, CLI, PowerShell, SDKs, and REST API to manage attached disks.


