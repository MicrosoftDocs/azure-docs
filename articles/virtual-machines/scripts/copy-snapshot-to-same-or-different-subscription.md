---
title: Copy managed disk snapshot to a subscription - CLI Sample
description: Azure CLI Script Sample - Copy (or move) snapshot of a managed disk to same or different subscription with CLI
documentationcenter: storage
author: ramankumarlive
manager: kavithag
ms.service: storage
ms.subservice: disks
ms.topic: sample
ms.workload: infrastructure
ms.date: 02/22/2023
ms.author: ramankum
ms.custom: mvc, devx-track-azurecli
---

# Copy snapshot of a managed disk to same or different subscription with CLI

This article contains two scripts. The first script copies a snapshot of a managed disk that was using platform-managed keys to the same or a different subscription. The second script copies a snapshot of a managed disk that was using customer-managed keys to the same or a different subscription. These scripts can be used for the following scenarios:

- Migrate a snapshot in Premium storage (Premium_LRS) to Standard storage (Standard_LRS or Standard_ZRS) to reduce your cost.
- Migrate a snapshot from locally redundant storage (Premium_LRS, Standard_LRS) to zone redundant storage (Standard_ZRS) to benefit from the higher reliability of ZRS storage.
- Move a snapshot to different subscription in the same region for longer retention.

> [!NOTE]
> Both subscriptions must be located under the same tenant

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Disks with platform-managed keys

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine/copy-snapshot-to-same-or-different-subscription/copy-snapshot-to-same-or-different-subscription.sh" id="FullScript":::

### Disks with customer-managed keys

```azurecli
#Provide the subscription Id of the subscription where snapshot exists
sourceSubscriptionId="<subscriptionId>"

#Provide the name of your resource group where snapshot exists
sourceResourceGroupName=mySourceResourceGroupName

#Provide the name of the target disk encryption set
diskEncryptionSetName=myName

#Provide the target disk encryption set resource group
diskEncryptionResourceGroup=myGroup

#Provide the name of the snapshot
snapshotName=mySnapshotName

#Set the context to the subscription Id where snapshot exists
az account set --subscription $sourceSubscriptionId

#Get the snapshot Id 
snapshotId=$(az snapshot show --name $snapshotName --resource-group $sourceResourceGroupName --query [id] -o tsv)

#If snapshotId is blank then it means that snapshot does not exist.
echo 'source snapshot Id is: ' $snapshotId

#Get the disk encryption set ID
diskEncryptionSetId=$(az disk-encryption-set show --name $diskEncryptionSetName --resource-group $diskEncryptionResourceGroup)

#Provide the subscription Id of the subscription where snapshot will be copied to
#If snapshot is copied to the same subscription then you can skip this step
targetSubscriptionId=6492b1f7-f219-446b-b509-314e17e1efb0

#Name of the resource group where snapshot will be copied to
targetResourceGroupName=mytargetResourceGroupName

#Set the context to the subscription Id where snapshot will be copied to
#If snapshot is copied to the same subscription then you can skip this step
az account set --subscription $targetSubscriptionId

#Copy snapshot to different subscription using the snapshot Id
#We recommend you to store your snapshots in Standard storage to reduce cost. Please use Standard_ZRS in regions where zone redundant storage (ZRS) is available, otherwise use Standard_LRS
#Please check out the availability of ZRS here: https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy-zrs#support-coverage-and-regional-availability
#To change the region, use the --location parameter
az snapshot create -g $targetResourceGroupName -n $snapshotName --source $snapshotId --disk-encryption-set $diskEncryptionSetID --sku Standard_LRS --encryption-type EncryptionAtRestWithCustomerKey
```

## Clean up resources

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name mySourceResourceGroupName
```

## Sample reference

This script uses following commands to create a snapshot in the target subscription using the `Id` of the source snapshot. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az snapshot show](/cli/azure/snapshot) | Gets all the properties of a snapshot using the name and resource group properties of the snapshot. The `Id` property is used to copy the snapshot to different subscription.  |
| [az snapshot create](/cli/azure/snapshot) | Copies a snapshot by creating a snapshot in different subscription using the `Id` and name of the parent snapshot.  |

## Next steps

[Create a virtual machine from a snapshot](./virtual-machines-linux-cli-sample-create-vm-from-snapshot.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

More virtual machine and managed disks CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
