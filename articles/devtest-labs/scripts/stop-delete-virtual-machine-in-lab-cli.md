---
title: Azure CLI - Stop and delete a virtual machine in a lab
description: This article provides an Azure CLI script that stops and deletes a virtual machine in a lab in Azure DevTest Labs. 
services: lab-services
author: spelluru
manager: 
editor: 

ms.assetid:
ms.service: lab-services
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/24/2020
ms.author: spelluru
ms.custom: mvc
---

# Use Azure CLI to stop and delete a virtual machine in a lab in Azure DevTest Labs

This Azure CLI script stops and deletes a virtual machine (VM) in a lab. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/devtest-lab/stop-delete-virtual-machine-in-lab/stop-delete-virtual-machine-in-lab.sh "Stop and delete a VM in a lab")]

## Script explanation

This script uses the following commands:

| Command | Notes |
|---|---|
| [az lab vm stop](/cli/azure/lab/vm?view=azure-cli-latest#az-lab-vm-stop) | Stops a virtual machine (VM) in a lab. This operation can take a while to complete. |
| [az lab vm delete](/cli/azure/lab/vm?view=azure-cli-latest#az-lab-vm-delete) | Delets a virtual machine (VM) in a lab. This operation can take a while to complete. |


## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Lab Services CLI script samples can be found in the [Azure Lab Services CLI samples](../samples-cli.md).
