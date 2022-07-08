---
title: Azure CLI Samples - Create a virtual machine scale set
description: This script creates an Azure virtual machine scale set with an Ubuntu operating system and related networking resources including a load balancer.
author: mimckitt
ms.author: mimckitt
ms.topic: sample
ms.service: virtual-machine-scale-sets
ms.date: 01/27/2022
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli

---

# Create a virtual machine scale set with the Azure CLI

This script creates an Azure virtual machine scale set with an Ubuntu operating system and related networking resources including a load balancer. After running the script, you can access the VM instances over SSH.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine-scale-sets/simple-scale-set/simple-scale-set.sh" id="FullScript":::

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
| [az group delete](/cli/azure/ad/group) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure/overview).
