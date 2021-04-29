---
title: Azure CLI sample for virtual machine scale set management
description: This sample shows how to add disks to a virtual machine scale set. You can upgrade disks and add your virtual machines to Azure AD authentication.
author: mimckitt
ms.author: mimckitt
ms.date: 02/04/2021
ms.topic: sample
ms.service: virtual-machine-scale-sets
ms.devlang: azurecli 
ms.custom: devx-track-azurecli
---

# Create and manage virtual machine scale set

Use these sample commands to prototype a virtual machine scale set by using Azure CLI.

These sample commands demonstrate the following operations:

* Create a virtual machine scale set.
* Add and upgrade new or existing disks to a scale set or to an instance of the set.
* Add scale set to Azure Active Directory (Azure AD) authentication.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Sample commands

```azurecli
# Create a resource group
az group create --name MyResourceGroup --location eastus

# Create virtual machine scale set
az vmss create --resource-group MyResourceGroup --name myScaleSet --instance-count 2 \
    --image UbuntuLTS --upgrade-policy-mode automatic --admin-username azureuser \
    --generate-ssh-keys

# Attach a new managed disk to your scale set
az vmss disk attach --resource-group MyResourceGroup --vmss-name myScaleSet --size-gb 50
```

After you add a new data disk, format and mount the disk. For Windows virtual machines, see [Attach a managed data disk to a Windows VM by using the Azure portal](../../virtual-machines/windows/attach-managed-disk-portal.md). For Linux virtual machines, see [Add a disk to a Linux VM](../../virtual-machines/linux/add-disk.md).

```azurecli
# Attach an existing managed disk to a virtual machine instance in your scale set
az vmss disk attach --resource-group MyResourceGroup --disk myDataDisk \
    --vmss-name myScaleSet --instance-id 0

# See the instances in your virtual machine scale set
az vmss list-instances --resource-group MyResourceGroup --name myScaleSet --output table

# See the disks for your virtual machine
az disk list --resource-group MyResourceGroup \
    --query "[*].{Name:name,Gb:diskSizeGb,Tier:accountType}" --output table

# Deallocate the virtual machine
az vmss deallocate --resource-group MyResourceGroup --name myScaleSet --instance-ids 0 

# Resize the disk
az disk update --resource-group MyResourceGroup --name myDataDisk --size-gb 200

# Restart the disk
az vmss restart --resource-group MyResourceGroup --name myScaleSet --instance-ids 0
```

To use the expanded disk, expand the underlying partition. For more information, see [Expand a disk partition and filesystem](../../virtual-machines/linux/expand-disks.md#expand-a-disk-partition-and-filesystem).

This example resized a data disk. You can use this same procedure to update an OS disk. For more information for a Windows virtual machine, see [How to expand the OS drive of a virtual machine](../../virtual-machines/windows/expand-os-disk.md). For more information for Linux virtual machines, see [Expand virtual hard disks on a Linux VM with the Azure CLI](../../virtual-machines/linux/expand-disks.md).

```azurecli
# Enable managed service identity on your scale set. This is required to authenticate and interact with other Azure services using bearer tokens.
az vmss identity assign --resource-group MyResourceGroup --name myScaleSet --role Owner \
    --scope /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup

# Connect to Azure AD authentication
az vmss extension set --resource-group MyResourceGroup --name AADLoginForWindows \
    --publisher Microsoft.Azure.ActiveDirectory --vmss-name myScaleSet

# Upgrade one instance of a scale set virtual machine
az vmss update-instances --resource-group MyResourceGroup --name myScaleSet --instance-ids 0 

# Remove a managed disk from the scale set
az vmss disk detach --resource-group MyResourceGroup --vmss-name myScaleSet --lun 0

# Remove a managed disk from an instance
az vmss disk detach --resource-group MyResourceGroup --vmss-name myScaleSet --instance-id 1 --lun 0

# Delete the pre-existing disk
az disk delete --resource-group MyResourceGroup --disk myDataDisk
```

## Clean up resources

After using these commands, run the following command to remove the resource group and all resources associated with it.

```azurecli
az group delete --name MyResourceGroup
```

## Azure CLI references used in this article

* [az disk delete](/cli/azure/disk#az_disk_delete)
* [az disk list](/cli/azure/disk#az_disk_list)
* [az disk update](/cli/azure/disk#az_disk_update)
* [az group create](/cli/azure/group#az_group_create)
* [az vmss create](/cli/azure/vmss#az_vmss_create)
* [az virtual machine scale set deallocate](/cli/azure/vmss#az_vmss_deallocate)
* [az vmss disk attach](/cli/azure/vmss/disk#az_vmss_disk_attach)
* [az vmss disk detach](/cli/azure/vmss/disk#az_vmss_disk_detach)
* [az vmss extension set](/cli/azure/vmss/extension#az_vmss_extension_set)
* [az vmss identity assign](/cli/azure/vmss/identity#az_vmss_identity_assign)
* [az vmss list-instances](/cli/azure/vmss#az_vmss_list_instances)
* [az vmss restart](/cli/azure/vmss#az_vmss_restart)
* [az vmss update-instances](/cli/azure/vmss#az_vmss_update_instances)