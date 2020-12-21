---
title: Azure CLI sample for virtual machine scale set management
description: This sample shows how to add disks to a virtual machine scale set, upgrade disks, add your virtual machines to Azure AD authentication, and remove a partition.
author: use the name of the CLI writer for the Azure service
ms.author: use the name of the CLI writer for the Azure service
manager: 
ms.date: 12/31/2020
ms.topic: sample
ms.service: virtual-machine-scale-sets
ms.devlang: azurecli 
ms.custom: devx-track-azurecli
---

# Create and manage virtual machine scale set

Use these sample commands to prototype a virtual machine scale set by using Azure CLI.

This sample demonstrates three operations:

* Add and upgrade new or existing disks to a scale set or to an instance of the set.
* Add scale set to Azure Active Directory (Azure AD) authentication.
* Remove a partition.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Sample commands

```azurecli-interactive
#!/bin/bash
# <anything the reader needs to know that is not already in prerequisites

# Create a resource group
az group create --name MyResourceGroup --location location

# Create virtual machine scale set
az vmss create --resource-group MyResourceGroup --name myScaleSet --instance-count 2 --image UbuntuLTS --upgrade-policy-mode automatic --admin-username azureuser --generate-ssh-keys

# Attach a new managed disk to your scale set
az vmss disk attach  --resource-group MyResourceGroup --vmss-name myScaleSet --size-gb 50

# Attach an existing managed disk to a VM instance in your scale set
az vmss disk attach --resource-group MyResourceGroup --disk myDataDisk --vmss-name myScaleSet --instance-id 0

# See the instances for your VM scale set
az vmss list-instances --resource-group MyResourceGroup  --name myScaleSet  --output table

# See the disks for your virtual machine (untested)
az disk list --resource-group MyResourceGroup --query '[*].{Name:name,Gb:diskSizeGb,Tier:accountType}' --output table

# Deallocate the virtual machine
az vmss deallocate --resource-group MyResourceGroup --name myScaleSet --instance-ids 0 

# Resize the disk
az disk update --resource-group MyResourceGroup --name myDataDisk --size-gb 200

# Restart the disk
az vmss restart --resource-group MyResourceGroup --name myScaleSet --instance-ids 0 

# Remove an incorrect partition

# Connect to Azure AD authentication (failed on my machine)
az vmss extension set --resource-group MyResourceGroup --name AADLoginForWindows --publisher Microsoft.Azure.ActiveDirectory --vmss-name myScaleSet

# Upgrade one instance of a scale set virtual machine
az vmss update-instances --resource-group MyResourceGroup --name myScaleSet --instance-ids 0 

# Remove a managed disk from the scale set
az vmss disk detach --resource-group MyResourceGroup --vmss-name myScaleSet --lun 0

# Remove a managed disk from an instance
az vmss disk detach --resource-group MyResourceGroup --vmss-name myScaleSet --instance-id 1 --lun 0


```

## Clean up resources

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name MyResourceGroup
```

## Azure CLI references used in this article

* [az disk list](/cli/azure/disk#az_disk_list)
* [az disk update](/cli/azure/disk#az_disk_update)
* [az group create](/cli/azure/group#az_group_create)
* [az vmss create](/cli/azure/vmss#az_vmss_create)
* [az vmss deallocate](/cli/azure/vmss#az_vmss_deallocate)
* [az vmss disk attach](/cli/azure/vmss/disk#az_vmss_disk_attach)
* [az vmss disk detach](/cli/azure/vmss/disk#az_vmss_disk_detach)
* [az vmss extension set](/cli/azure/vmss/extension#az_vmss_extension_set)
* [az vmss list-instances](/cli/azure/vmss#az_vmss_list_instances)
* [az vmss restart](/cli/azure/vmss#az_vmss_restart)
* [az vmss update-instances](/cli/azure/vmss#az_vmss_update_instances)
