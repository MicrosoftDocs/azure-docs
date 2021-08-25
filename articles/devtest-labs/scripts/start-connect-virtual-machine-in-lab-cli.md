---
title: Azure CLI Script Sample - Start a virtual machine in a lab | Microsoft Docs
description: This Azure CLI script starts a virtual machine in a lab in Azure DevTest Labs. 
ms.devlang: azurecli
ms.topic: sample
ms.date: 08/11/2020
---

# Use Azure CLI to start a virtual machine in a lab in Azure DevTest Labs

This Azure CLI script starts a virtual machine (VM) in a lab. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/devtest-lab/start-connect-virtual-machine-in-lab/start-connect-virtual-machine-in-lab.sh "Start a VM")]


## Script explanation

This script uses the following commands:

| Command | Notes |
|---|---|
| [az lab vm start](/cli/azure/lab/vm#az_lab_vm_start) | Starts a virtual machine (VM) in a lab. This operation can take a while to complete. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Lab Services CLI script samples can be found in the [Azure Lab Services CLI samples](../samples-cli.md).
