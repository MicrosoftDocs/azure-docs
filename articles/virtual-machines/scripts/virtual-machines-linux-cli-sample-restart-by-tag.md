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
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/01/2017
ms.author: allclark
---

# Restart VMs

This sample shows a couple of ways to get some VMs and restart them.

The first restarts all of the VMs in the resource group.

```bash
az vm restart --ids $(az vm list --resource-group myResourceGroup --query "[].id" -o tsv)
```

The second gets the tagged VMs using `az resouce list` and filters to the resources that are VMs,
and restarts those.

```bash
az vm restart --ids $(az resource list --tag "restart-tag" --query "[?type=='Microsoft.Compute/virtualMachines'].id" -o tsv)
```

This sample works in a Bash shell. For options on running Azure CLI scripts on Windows client, see [Running the Azure CLI in Windows](../virtual-machines-windows-cli-options.md).


## Sample script

The sample has three scripts. The first one provisions the virtual machines.
It uses the no-wait option so the command returns without waiting on each VM to be provisioned.
The second waits for the VMs to be fully provisioned.
The third script restarts all of the VMs that were provisioned, and then just the tagged VMs.

### Provision the VMs

This script creates a resource group and then it creates three VMs that will be restarted.
Two of them are tagged.

[!code-azurecli[main](../../../cli_scripts/virtual-machine/restart-by-tag/provision.sh "Provision the VMs")]

### Wait

Provisioning the VMs takes a few minutes.
This script will check on the provisioning status every 20 seconds until all three VMs are provisioned,
or one of them fails to provision.

[!code-azurecli[main](../../../cli_scripts/virtual-machine/restart-by-tag/wait.sh "Wait for the VMs to be provisioned")]

### Restart the VMs

This script restarts all of the VMs in the resource group,
and then it restrarts just the tagged VMs.

[!code-azurecli[main](../../../cli_scripts/virtual-machine/restart-by-tag/restart.sh "Restart VMs by tag")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource groups, VMs, and all related resources.

```azurecli
az group delete -n myResouceGroup --no-wait --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az vm create](https://docs.microsoft.com/cli/azure/vm/availability-set#create) | Creates the virtual machines.  |
| [az vm list](https://docs.microsoft.com/cli/azure/vm#list) | Used with `--query` to ensure the VMs are provisioned before restarting them, and then to get the IDs of the VMs in order to restart them. |
| [az resource list](https://docs.microsoft.com/cli/azure/vm#list) | Used with `--query` to get the IDs of the VMs using the tag. |
| [az vm restart](https://docs.microsoft.com/cli/azure/vm#list) | Restarts the VMs. |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../virtual-machines-linux-cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
