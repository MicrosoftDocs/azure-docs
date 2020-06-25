---
title: Azure CLI Samples - Create a virtual machine scale set
description: This script creates an Azure virtual machine scale set with an Ubuntu operating system and related networking resources including a load balancer.
author: mimckitt
ms.author: mimckitt
ms.topic: sample
ms.service: virtual-machine-scale-sets
ms.subservice: cli
ms.date: 06/25/2020
ms.reviewer: jushiman
ms.custom: mimckitt

---

# Create a virtual machine scale set with the Azure CLI
This script creates an Azure virtual machine scale set with an Ubuntu operating system and related networking resources including a load balancer. After running the script, you can access the VM instances over SSH.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script
[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine-scale-sets/simple-scale-set/simple-scale-set.sh "Create a simple virtual machine scale set")]

## Clean up deployment
Run the following command to remove the resource group, scale set, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation
This script uses the following commands to create a resource group, virtual machine scale set, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/ad/group) | Creates a resource group in which all resources are stored. |
| [az vmss create](/cli/azure/vmss) | Creates the virtual machine scale set and connects it to the virtual network, subnet, and network security group. A load balancer is also created to distribute traffic to multiple VM instances. This command also specifies the VM image to be used and administrative credentials.  |
| [az group delete](/cli/azure/ad/group) | Deletes a resource group including all nested resources. |

## Next steps
For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).
