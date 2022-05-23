---
title: Azure CLI Samples - Enable host-based autoscale
description: This script creates a virtual machine scale set running Ubuntu and uses host-based metrics to automatically scale as CPU load changes.
author: ju-shim
tags: azure-resource-manager
ms.service: virtual-machine-scale-sets
ms.subservice: autoscale
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/27/2018
ms.author: jushiman
ms.custom: mvc, devx-track-azurecli

---

# Automatically scale a virtual machine scale set with the Azure CLI

This script creates a virtual machine scale set running Ubuntu and uses host-based metrics to automatically scale as CPU load changes.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine-scale-sets/auto-scale-host-metrics/auto-scale-host-metrics.sh" id="FullScript":::

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
| [az monitor autoscale-settings create](/cli/azure/monitor/autoscale-settings) | Creates and applies autoscale rules to a virtual machine scale set. |
| [az group delete](/cli/azure/ad/group) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure/overview).
