---
title: Azure CLI Samples - Zone-redundant scale set
description: This script creates an Azure virtual machine scale set running Ubuntu across multiple Availability Zones.
author: mimckitt
ms.author: mimckitt
ms.topic: sample
ms.service: virtual-machine-scale-sets
ms.subservice: availability
ms.date: 03/27/2018
ms.reviewer: jushiman
ms.custom: mimckitt

---

# Create a zone-redundant virtual machine scale set with Azure CLI
This script creates a virtual machine scale set running Ubuntu across multiple Availability Zones. After running the script, you can access the virtual machine over RDP.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script
[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine-scale-sets/create-zone-redundant-scale-set/create-zone-redundant-scale-set.sh "Create zone-redundant scale set")]

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
