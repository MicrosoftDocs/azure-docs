---
title: Azure CLI - Stop and delete a virtual machine in a lab
description: This article provides an Azure CLI script that stops and deletes a virtual machine in a lab in Azure DevTest Labs. 
ms.devlang: azurecli
ms.topic: sample
ms.date: 08/11/2020
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
| [az lab vm stop](/cli/azure/lab/vm#az_lab_vm_stop) | Stops a virtual machine (VM) in a lab. This operation can take a while to complete. |
| [az lab vm delete](/cli/azure/lab/vm#az_lab_vm_delete) | Delets a virtual machine (VM) in a lab. This operation can take a while to complete. |


## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Lab Services CLI script samples can be found in the [Azure Lab Services CLI samples](../samples-cli.md).
