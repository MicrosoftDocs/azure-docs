---
title: Azure CLI Script Sample - Restart VMs | Microsoft Docs
description: Azure CLI Script Sample - Restart VMs by tag and by ID
services: virtual-machines-linux
documentationcenter: virtual-machines
author: allclark
manager: douge
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/01/2017
ms.author: douge
ms.custom: mvc
---

# Restart VMs

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

This sample shows a couple of ways to get some VMs and restart them.

The first restarts all the VMs in the resource group.

```bash
az vm restart --ids $(az vm list --resource-group myResourceGroup --query "[].id" -o tsv)
```

The second gets the tagged VMs using `az resource list` and filters to the resources that are VMs,
and restarts those VMs.

```bash
az vm restart --ids $(az resource list --tag "restart-tag" --query "[?type=='Microsoft.Compute/virtualMachines'].id" -o tsv)
```

This sample works in a Bash shell. For options on running Azure CLI scripts on Windows client, see [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows).


## Sample script

The sample has three scripts.
The first one provisions the virtual machines.
It uses the no-wait option so the command returns without waiting on each VM to be provisioned.
The second waits for the VMs to be fully provisioned.
The third script restarts all the VMs that were provisioned, and then just the tagged VMs.

### Provision the VMs

This script creates a resource group and then it creates three VMs to restart.
Two of them are tagged.

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/restart-by-tag/provision.sh "Provision the VMs")]

### Wait

This script checks on the provisioning status every 20 seconds until all three VMs are provisioned,
or one of them fails to provision.

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/restart-by-tag/wait.sh "Wait for the VMs to be provisioned")]

### Restart the VMs

This script restarts all the VMs in the resource group,
and then it restarts just the tagged VMs.

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/restart-by-tag/restart.sh "Restart VMs by tag")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource groups, VMs, and all related resources.

```azurecli-interactive 
az group delete -n myResourceGroup --no-wait --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az vm create](https://docs.microsoft.com/cli/azure/vm/availability-set) | Creates the virtual machines.  |
| [az vm list](https://docs.microsoft.com/cli/azure/vm) | Used with `--query` to ensure the VMs are provisioned before restarting them, and then to get the IDs of the VMs to restart them. |
| [az resource list](https://docs.microsoft.com/cli/azure/vm) | Used with `--query` to get the IDs of the VMs using the tag. |
| [az vm restart](https://docs.microsoft.com/cli/azure/vm) | Restarts the VMs. |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
