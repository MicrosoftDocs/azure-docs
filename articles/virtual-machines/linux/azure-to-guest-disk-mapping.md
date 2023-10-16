---
title: How to map Azure Disks to Linux VM guest disks
description: How to determine the Azure Disks that underlay a Linux VM's guest disks.
author: timbasham
ms.service: azure-disk-storage
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 11/17/2020
ms.author: tibasham
ms.collection: linux

---
# How to map Azure Disks to Linux VM guest disks

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

You may need to determine the Azure Disks that back a VM's guest disks. In some scenarios, you can compare the disk or volume size to the size of the attached Azure Disks. In scenarios where there are multiple Azure Disks of the same size attached to the VM you need to use the Logical Unit Number (LUN) of the data disks. 

## What is a LUN?

A Logical Unit Number (LUN) is a number that is used to identify a specific storage device. Each storage device is assigned a unique numeric identifier, starting at zero. The full path to a device is represented by the bus number, target ID number, and Logical Unit Number (LUN). 

For example:
***Bus Number 0, Target ID 0, LUN 3***

For our exercise, you only need to use the LUN.

## Finding the LUN

Below we have listed two methods for finding the LUN of a disk in Linux.

### lsscsi

1. Connect to the VM
1. `sudo lsscsi`

The first column listed will contain the LUN, the format is [Host:Channel:Target:**LUN**].

### Listing block devices

1. Connect to the VM
1. `sudo ls -l /sys/block/*/device`

The last column listed will contain the LUN, the format is [Host:Channel:Target:**LUN**]

## Finding the LUN for the Azure Disks

You can locate the LUN for an Azure Disk using the Azure portal, Azure CLI.

### Finding an Azure Disk's LUN in the Azure portal

1. In the Azure portal, select "Virtual Machines" to display a list of your Virtual Machines
1. Select the Virtual Machine
1. Select "Disks"
1. Select a data disk from the list of attached disks.
1. The LUN of the disk will be displayed in the disk detail pane. The LUN displayed here correlate to the LUNs that you looked up in the Guest using lsscsi, or listing the block devices.

### Finding an Azure Disk's LUN using Azure CLI

```azurecli-interactive
az vm show -g myResourceGroup -n myVM --query "storageProfile.dataDisks"
```
