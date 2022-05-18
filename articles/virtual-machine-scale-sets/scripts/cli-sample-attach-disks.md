---
title: Azure CLI Samples - Attach and use data disks
description: This script creates an Azure virtual machine scale set and attaches and prepares data disks with Azure CLI.
author: mimckitt
ms.author: mimckitt
ms.topic: sample
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 01/27/2022
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli

---

# Attach and use data disks with a virtual machine scale set with the Azure CLI

This script creates a virtual machine scale set and attaches and prepares data disks.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine-scale-sets/use-data-disks/use-data-disks.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the commands outlined in the following table:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/ad/group) | Creates a resource group in which all resources are stored. |
| [az vmss create](/cli/azure/vmss) | Creates the virtual machine scale set and connects it to the virtual network, subnet, and network security group. A load balancer is also created to distribute traffic to multiple VM instances. This command also specifies the VM image to be used and administrative credentials.  |
| [az vmss disk attach](/cli/azure/vmss/disk) | Creates and attaches a data disk to the virtual machine scale set. |
| [az vmss extension set](/cli/azure/vmss/extension) | Installs the Azure Custom Script Extension to run a script that prepares the data disks on each VM instance. |
| [az group delete](/cli/azure/ad/group) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure/overview).
