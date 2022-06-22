---
title: Azure CLI Samples - Use a custom VM image
description: This Azure CLI script creates a virtual machine scale set that uses a custom VM image as the source for the VM instances.
author: mamccrea
ms.author: mamccrea
ms.topic: sample
ms.service: virtual-machine-scale-sets
ms.subservice: imaging
ms.date: 01/27/2022
ms.reviewer: cynthn
ms.custom: akjosh, devx-track-azurecli
---

# Create a virtual machine scale set from a custom VM image with the Azure CLI

This script creates a virtual machine scale set that uses a custom VM image as the source for the VM instances.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine-scale-sets/use-custom-vm-image/create-use-custom-vm-image.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the commands outlined in the following table:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/ad/group#az-ad-group-create) | Creates a resource group in which all resources are stored. |
| [az vm create](/cli/azure/vm#az-vm-create) | Creates an Azure virtual machine. |
| [az sig create](/cli/azure/sig#az-sig-create) | Creates a shared image gallery. |
| [az sig image-definition create](/cli/azure/sig/image-definition#az-sig-image-definition-create) | Creates a gallery image definition. |
| [az sig image-version create](/cli/azure/sig/image-version#az-sig-image-version-create) | Create a new image version. |
| [az vmss create](/cli/azure/vmss) | Creates the virtual machine scale set and connects it to the virtual network, subnet, and network security group. A load balancer is also created to distribute traffic to multiple VM instances. This command also specifies the VM image to be used and administrative credentials.  |
| [az group delete](/cli/azure/ad/group) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure/overview).
