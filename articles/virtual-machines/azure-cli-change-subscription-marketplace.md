---
title: Azure CLI sample for moving a Marketplace Azure VM to another subscription
description: Azure CLI sample for moving an Azure Marketplace Virtual Machine to a different subscription.
author: ju-shim
ms.author: jushiman
ms.reviewer: mattmcinnes
ms.date: 04/20/2023
ms.topic: sample
ms.service: virtual-machines
ms.devlang: azurecli
ms.custom: devx-track-azurecli
---

# Move a Marketplace Azure Virtual Machine to another subscription

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

To move a Marketplace virtual machine to a different subscription, you must move the OS disk to that subscription and then recreate the virtual machine.

You don't need this procedure to move a data disk to a new subscription. Instead, create a new virtual machine in the new subscription from the Marketplace, then move and attach the data disk.

This script demonstrates three operations:

- Create a snapshot of an OS disk.
- Move the snapshot to a different subscription.
- Create a virtual machine based on that snapshot.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

To move a Marketplace virtual machine to a different subscription, you must create a new virtual machine for the same Marketplace offer from the moved OS disk.

> [!NOTE]
> If the virtual machine plan is no longer available in the Marketplace, you can't use this procedure.

```azurecli
#!/bin/bash
# Set variable values before proceeding. 

# Variables
sourceResourceGroup= Resource group for the current virtual machine
sourceSubscription= Subscription for the current virtual machine
vmName= Name of the current virtual machine

destinationResourceGroup= Resource group for the new virtual machine, create if necessary
destinationSubscription= Subscription for the new virtual machine

# Set your current subscription for the source virtual machine
az account set --subscription $sourceSubscription

# Load variables about your virtual machine
# osType = windows or linux
osType=$(az vm get-instance-view --resource-group $sourceResourceGroup \
    --name $vmName --subscription $sourceSubscription \
    --query 'storageProfile.osDisk.osType' --output tsv)

# offer = Your offer in Marketplace
offer=$(az vm get-instance-view --resource-group $sourceResourceGroup \
    --name $vmName --query 'storageProfile.imageReference.offer' --output tsv)

# plan = Your plan in Marketplace
plan=$(az vm get-instance-view --resource-group $sourceResourceGroup \
    --name $vmName --query 'plan' --output tsv)

# publisher = Your publisher in Marketplace
publisher=$(az vm get-instance-view --resource-group $sourceResourceGroup \
    --name $vmName --query 'storageProfile.imageReference.publisher' --output tsv)

# Get information to create new virtual machine
planName=$(az vm get-instance-view --resource-group $sourceResourceGroup \
    --subscription $sourceSubscription --query 'plan.name' --name $vmName)
planProduct=$(az vm get-instance-view --resource-group $sourceResourceGroup \
    --subscription $sourceSubscription --query 'plan.product' --name $vmName)
planPublisher=$(az vm get-instance-view --resource-group $sourceResourceGroup \
    --subscription $sourceSubscription --query 'plan.publisher' --name $vmName)

# Get the name of the OS disk
osDiskName=$(az vm show --resource-group $sourceResourceGroup --name $vmName \
    --query 'storageProfile.osDisk.name' --output tsv)

# Verify the terms for your market virtual machine
az vm image terms show --offer $offer --plan '$plan' --publisher $publisher \
    --subscription $sourceSubscription

# Deallocate the virtual machine
az vm deallocate --resource-group $sourceResourceGroup --name $vmName

# Create a snapshot of the OS disk
az snapshot create --resource-group $sourceResourceGroup --name MigrationSnapshot \
    --source "/subscriptions/$sourceSubscription/resourceGroups/$sourceResourceGroup/providers/Microsoft.Compute/disks/$osDiskName"

# Move the snapshot to your destination resource group
az resource move --destination-group $destinationResourceGroup \
    --destination-subscription-id $destinationSubscription \
    --ids "/subscriptions/$sourceSubscription/resourceGroups/$sourceResourceGroup/providers/Microsoft.Compute/snapshots/MigrationSnapshot"

# Set your subscription to the destination value
az account set --subscription $destinationSubscription

# Accept the terms from the Marketplace
az vm image terms accept --offer $offer --plan '$plan' --publisher $publisher \
    --subscription $destinationSubscription

# Create disk from the snapshot 
az disk create --resource-group $destinationResourceGroup --name DestinationDisk \
    --source "/subscriptions/$destinationSubscription/resourceGroups/$destinationResourceGroup/providers/Microsoft.Compute/snapshots/MigrationSnapshot" \
    --os-type $osType

# Create virtual machine from disk
az vm create --resource-group $destinationResourceGroup --name $vmName \
    --plan-name $planName --plan-product $planProduct  --plan-publisher $planPublisher \
    --attach-os-disk "/subscriptions/$destinationSubscription/resourceGroups/$destinationResourceGroup/providers/Microsoft.Compute/disks/DestinationDisk" \
    --os-type $osType
```

## Clean up resources

After the sample has been run, use the following commands to remove the resource groups and all associated resources:

```azurecli
az group delete --name $sourceResourceGroup --subscription $sourceSubscription
az group delete --name $destinationResourceGroup --subscription $destinationSubscription
```

## Azure CLI references used in this article

- [az account set](/cli/azure/account#az-account-set)
- [az disk create](/cli/azure/disk#az-disk-create)
- [az group delete](/cli/azure/group#az-group-delete)
- [az resource move](/cli/azure/resource#az-resource-move)
- [az snapshot create](/cli/azure/snapshot#az-snapshot-create)
- [az vm create](/cli/azure/vm#az-vm-create)
- [az vm deallocate](/cli/azure/vm#az-vm-deallocate)
- [az vm delete](/cli/azure/vm#az-vm-delete)
- [az vm get-instance-view](/cli/azure/vm#az-vm-get-instance-view)
- [az vm image terms accept](/cli/azure/vm/image/terms#az-vm-image-terms-accept)
- [az vm image terms show](/cli/azure/vm/image/terms#az-vm-image-terms-show)
- [az vm show](/cli/azure/vm#az-vm-show)

## Next steps

- [Move VMs to another Azure region](../site-recovery/azure-to-azure-tutorial-migrate.md)
- [Move a VM to another subscription or resource group](/azure/azure-resource-manager/management/move-resource-group-and-subscription#use-azure-cli)
