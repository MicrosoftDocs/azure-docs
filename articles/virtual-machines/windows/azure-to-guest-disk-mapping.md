---
title: How to map Azure Disks to Windows VM guest disks
description: How to determine the Azure Disks that underlay a Windows VM's guest disks.
author: timbasham
ms.service: azure-disk-storage
ms.collection: windows
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 11/17/2020
ms.author: tibasham 
---
# How to map Azure Disks to Windows VM guest disks

**Applies to:** :heavy_check_mark: Windows VMs 


You may need to determine the Azure Disks that back a VM's guest disks. In some scenarios, you can compare the disk or volume size to the size of the attached Azure Disks. In scenarios where there are multiple Azure Disks of the same size attached to the VM you need to use the Logical Unit Number (LUN) of the data disks. 

## What is a LUN?

A Logical Unit Number (LUN) is a number that is used to identify a specific storage device. Each storage device is assigned a unique numeric identifier, starting at zero. The full path to a device is represented by the bus number, target ID number, and Logical Unit Number (LUN). 

For example:
***Bus Number 0, Target ID 0, LUN 3***

For our exercise, you only need to use the LUN.

## Finding the LUN

There are two methods to finding the LUN, which one you choose will depend on if you are using [Storage Spaces](/windows-server/storage/storage-spaces/overview) or not.

### Disk Management

If you are not using Storage Pools, you can use [Disk Management](/windows-server/storage/disk-management/overview-of-disk-management) to find the LUN.

1. Connect to the VM and open Disk Management
    a. Right-click on the Start button and choose "Disk Management"
    a. You can also type `diskmgmt.msc` into the Start Search box
1. In the lower pane, right-click any of the Disks and choose "Properties"
1. The LUN will be listed in the "Location" property on the "General" tab

### Storage Pools

1. Connect to the VM and open Server Manager
1. Select "File and Storage Services", "Volumes", "Storage Pools"
1. In the bottom-right corner of Server Manager, there will be a "Physical Disks" section. The disks that make up the Storage Pool are listed here as well as the LUN for each disk.

## Finding the LUN for the Azure Disks

You can locate the LUN for an Azure Disk using the Azure portal, Azure CLI, or Azure PowerShell

### Finding an Azure Disk's LUN in the Azure portal

1. In the Azure portal, select "Virtual Machines" to display a list of your Virtual Machines
1. Select the Virtual Machine
1. Select "Disks"
1. Select a data disk from the list of attached disks.
1. The LUN of the disk will be displayed in the disk detail pane. The LUN displayed here correlates to the LUNs that were looked up in the Guest using Device Manager or Server Manager.

### Finding an Azure Disk's LUN using Azure CLI or Azure PowerShell

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az vm show -g myResourceGroup -n myVM --query "storageProfile.dataDisks"
```

# [Azure PowerShell](#tab/azure-powershell)
```azurepowershell-interactive
$vm = Get-AzVM -ResourceGroupName myResourceGroup -Name myVM
$vm.StorageProfile.DataDisks | ft
```
---
