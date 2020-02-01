---
title: Azure CLI Samples - Install apps
description: This script creates a virtual machine scale set running Ubuntu and uses the Custom Script Extension to install a basic web application.
author: cynthn
tags: azure-resource-manager
ms.service: virtual-machine-scale-sets
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/27/2018
ms.author: cynthn
ms.custom: mvc

---

# Install applications into a virtual machine scale set with the Azure CLI
This script creates a virtual machine scale set running Ubuntu and uses the Custom Script Extension to install a basic web application. After running the script, you can access the web app through a web browser.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script
[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine-scale-sets/install-apps/install-apps.sh "Install apps into a scale set")]

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
| [az vmss extension set](/cli/azure/vmss/extension) | Installs the Azure Custom Script Extension to run a script that prepares the data disks on each VM instance. |
| [az network lb rule create](/cli/azure/network/lb/rule) | Creates a load balancer rule to distribute traffic on TCP port 80 to the VM instances in the scale set. |
| [az network public-ip show](/cli/azure/network/public-ip) | Gets information on the public IP address assigned used by the load balancer. |
| [az group delete](/cli/azure/ad/group) | Deletes a resource group including all nested resources. |

## Next steps
For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional virtual machine scale set Azure CLI script samples can be found in the [Azure virtual machine scale set documentation](../cli-samples.md).
