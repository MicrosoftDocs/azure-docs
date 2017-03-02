---
title: Azure CLI Script Sample - Restart VMs
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

# Restart VMs by Tag

This example creates virtual machines with a given tag in multiple resource groups.
The virtual machines are created in parallel using `--no-wait`,
and then it waits for their collective completion.

After the virtual machines have been created, they're restarted using two different query
mechanisms.

The first restarts the VMs the same query that was used to wait on their asynchronous creation.
```bash
az vm restart --ids $(az vm list --query "join(' ', ${GROUP_QUERY}] | [].id)" \
    -o tsv) $1>/dev/null
```

The second uses a generic resource listing and query to fetch their IDs by tag.
```bash
az vm restart --ids $(az resource list --tag ${TAG} \
    --query "[?type=='Microsoft.Compute/virtualMachines'].id" -o tsv) $1>/dev/null
```

This sample works in a Bash shell. For options on running Azure CLI scripts on Windows client, see [Running the Azure CLI in Windows](../virtual-machines-windows-cli-options.md).

## Sample script

[!code-azurecli[main](../../../cli_scripts/virtual-machine/restart-by-tag/restart-by-tag.sh "Restart VMs by tag")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource groups, VMs, and all related resources.

```azurecli
az group delete -n GROUP1 --no-wait --force && \ 
az group delete -n GROUP2 --no-wait --force && \
az group delete -n GROUP3 --no-wait --force
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az vm create](https://docs.microsoft.com/cli/azure/vm/availability-set#create) | Creates the virtual machines.  |
| [az vm list](https://docs.microsoft.com/cli/azure/vm#list) | Used with `--query` to ensure the VMs are provisioned before restarting them. |
| [az vm restart](https://docs.microsoft.com/cli/azure/vm#list) | Restarts the VMs. |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../virtual-machines-linux-cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
