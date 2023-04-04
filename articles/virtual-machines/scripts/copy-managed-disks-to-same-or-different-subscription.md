---
title: Copy managed disks to same or different subscription - CLI Sample
description: Azure CLI Script Sample - Copy (or move) managed disks to the same or a different subscription
documentationcenter: storage
author: ramankumarlive
manager: kavithag
ms.service: storage
ms.subservice: disks
ms.devlang: azurecli
ms.topic: sample
ms.workload: infrastructure
ms.date: 02/22/2023
ms.author: ramankum
ms.custom: mvc, devx-track-azurecli
---

# Copy managed disks to same or different subscription with CLI

This article contains two scripts. The first script copies a managed disk that's using platform-managed keys to same or different subscription but in the same region. The second script copies a managed disk that's using customer-managed keys to the same or a different subscription in the same region. Either copy only works when the subscriptions are part of the same Azure AD tenant.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Disks with platform-managed keys

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine/copy-managed-disks-to-same-or-different-subscription/copy-managed-disks-to-same-or-different-subscription.sh" id="FullScript":::

### Disks with customer-managed keys

```azurecli
#Provide the subscription Id of the subscription where managed disk exists
sourceSubscriptionId="<subscriptionId>"

#Provide the name of your resource group where managed disk exists
sourceResourceGroupName=mySourceResourceGroupName

#Provide the name of the managed disk
managedDiskName=myDiskName

#Provide the name of the target disk encryption set
diskEncryptionSetName=myName

#Provide the target disk encryption set resource group
diskEncryptionResourceGroup=myGroup

#Set the context to the subscription Id where managed disk exists
az account set --subscription $sourceSubscriptionId

#Get the managed disk Id 
managedDiskId=$(az disk show --name $managedDiskName --resource-group $sourceResourceGroupName --query [id] -o tsv)

#If managedDiskId is blank then it means that managed disk does not exist.
echo 'source managed disk Id is: ' $managedDiskId

#Get the disk encryption set ID
diskEncryptionSetId=$(az disk-encryption-set show --name $diskEncryptionSetName --resource-group $diskEncryptionResourceGroup)

#Provide the subscription Id of the subscription where managed disk will be copied to
targetSubscriptionId=6492b1f7-f219-446b-b509-314e17e1efb0

#Name of the resource group where managed disk will be copied to
targetResourceGroupName=mytargetResourceGroupName

#Set the context to the subscription Id where managed disk will be copied to
az account set --subscription $targetSubscriptionId

#Copy managed disk to different subscription using managed disk Id and disk encryption set ID
#Add --location parameter to change the location
az disk create -g $targetResourceGroupName -n $managedDiskName --source $managedDiskId --disk-encryption-set $diskEncrpytonSetId
```

## Clean up resources

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name mySourceResourceGroupName
```

## Sample reference

This script uses following commands to create a new managed disk in the target subscription using the `Id` of the source managed disk. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az disk show](/cli/azure/disk) | Gets all the properties of a managed disk using the name and resource group properties of the managed disk. The `Id` property is used to copy the managed disk to different subscription.  |
| [az disk create](/cli/azure/disk) | Copies a managed disk by creating a new managed disk in different subscription using the `Id` and name the parent managed disk.  |

## Next steps

[Create a virtual machine from a managed disk](./virtual-machines-linux-cli-sample-create-vm-from-managed-os-disks.md?toc=%2fpowershell%2fmodule%2ftoc.json)

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

More virtual machine and managed disks CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
