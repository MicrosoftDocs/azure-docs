---
title: Copy a managed disk to a storage account - CLI
description: Azure CLI sample - Export or copy a managed disk to a storage account.
author: ramankumarlive
manager: kavithag
ms.service: azure-disk-storage
ms.topic: sample
ms.date: 02/23/2022
ms.author: ramankum
ms.custom: mvc, devx-track-azurecli
---

# Export/Copy a managed disk to a storage account using the Azure CLI

This script exports the underlying VHD of a managed disk to a storage account in same or different region. It first generates the SAS URI of the managed disk and then uses it to copy the VHD to a storage account. Use this script to copy managed disks to another region for regional expansion. If you want to publish the VHD file of a managed disk in Azure Marketplace, you can use this script to copy the VHD file to a storage account and then generate a SAS URI of the copied VHD to publish it in the Marketplace.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine/copy-managed-disks-vhd-to-storage-account/copy-managed-disks-vhd-to-storage-account.sh" id="FullScript":::

## Clean up resources

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroupName
```

## Sample reference

This script uses following commands to generate the SAS URI for a managed disk and copies the underlying VHD to a storage account using the SAS URI. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az disk grant-access](/cli/azure/disk#az-disk-grant-access) | Generates read-only SAS that is used to copy the underlying VHD file to a storage account or download it to on-premises  |
| [az storage blob copy start](/cli/azure/storage/blob/copy) | Copies a blob asynchronously from one storage account to another |

## Next steps

[Create a managed disk from a VHD](virtual-machines-cli-sample-create-managed-disk-from-vhd.md)

[Create a virtual machine from a managed disk](virtual-machines-linux-cli-sample-create-vm-from-managed-os-disks.md)

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional virtual machine and managed disks CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md).
