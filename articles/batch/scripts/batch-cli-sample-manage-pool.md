---
title: Azure CLI Script Sample - Managing Pools in Batch | Microsoft Docs
description: Azure CLI Script Sample - Managing Pools in Batch
services: batch
documentationcenter: batch
author: annatisch
manager: daryls
editor: tamram
tags: azure-batch

ms.assetid:
ms.service: batch
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: batch
ms.workload: infrastructure
ms.date: 03/20/2017
ms.author: antisch
---

# Managing Azure Batch Pools with Azure CLI

These script demonstrates some of the tools available in the Azure CLI to create and
manage pools of VMs in the Azure Batch service.

Running these scripts assumes that a Batch account has already been set up and an application
configured. For more information, please see the sample scripts covering
each of these topics.

Note that the commands in this sample include running Azure VMs which will accrue charges.
If needed, install the Azure CLI using the instruction found in the [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli), 
and then run `az login` to create a connection with Azure.

This sample works in a Bash shell. For options on running Azure CLI scripts on Windows client, 
see [Running the Azure CLI in Windows](../virtual-machines-windows-cli-options.md).

Batch pools can be configured in two ways, either with a Cloud Services configuration (Windows only),
or a Virtual Machine configuration (Windows and Linux).

## Pool with Cloud Service Configuration Sample script

[!code-azurecli[main](../../../cli_scripts/batch/manage-pool/manage-pool-windows.sh "Manage Cloud Services Pools")]

## Pool with Virtual Machine Configuration Sample script

[!code-azurecli[main](../../../cli_scripts/batch/manage-pool/manage-pool-linux.sh "Manage Virtual Machine Pools")]

## Clean up pools

After the above sample script has been run, the following command can be used to delete the
pools.
```azurecli
az batch pool delete --pool-id mypool-windows
az batch pool delete --pool-id mypool-linux
```

## Script explanation

This script uses the following commands to create and manipulate Batch pools.
Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az batch account login](https://docs.microsoft.com/cli/azure/batch/account#login) | Authenticate against a Batch account.  |
| [az batch application summary list](https://docs.microsoft.com/cli/azure/batch/application/summary#list) | List the available applications in the Batch account.  |
| [az batch pool create](https://docs.microsoft.com/cli/azure/batch/pool#create) | Create a pool of VMs.  |
| [az batch pool set](https://docs.microsoft.com/cli/azure/batch/pool#set) | Update properties of a pool.  |
| [az batch pool node-agent-skus list](https://docs.microsoft.com/cli/azure/batch/pool/node-agent-skus#list) | List available node agent SKUs and image information.  |
| [az batch pool resize](https://docs.microsoft.com/cli/azure/batch/pool#resize) | Resize the number of running VMs in the specified pool.  |
| [az batch pool show](https://docs.microsoft.com/cli/azure/batch/pool#show) | Display the properties of a pool.  |
| [az batch pool delete](https://docs.microsoft.com/cli/azure/batch/pool#delete) | Delete the specified pool.  |
| [az batch pool autoscale enable](https://docs.microsoft.com/cli/azure/batch/pool/autoscale#enable) | Enable auto-scaling on a pool and apply a formula.  |
| [az batch pool autoscale disable](https://docs.microsoft.com/cli/azure/batch/pool/autoscale#disable) | Disable auto-scaling on a pool.  |
| [az batch node list](https://docs.microsoft.com/cli/azure/batch/node#list) | List all the compute node in the specified pool.  |
| [az batch node reboot](https://docs.microsoft.com/cli/azure/batch/node#reboot) | Reboot the specified compute node.  |
| [az batch node delete](https://docs.microsoft.com/cli/azure/batch/node#delete) | Delete the listed nodes from the specified pool.  |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional Batch CLI script samples can be found in the [Azure Batch CLI documentation](../batch-cli-samples.md).

