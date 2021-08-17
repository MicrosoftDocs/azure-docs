---
title: Azure CLI - Create and verify a virtual machine in a lab
description: This Azure CLI script creates a virtual machine in a lab, and verifies that it's available. 
ms.devlang: azurecli
ms.topic: sample
ms.date: 08/11/2020
---

# Use Azure CLI to create and verify availability of a virtual machine in a lab in Azure DevTest Labs

This Azure CLI script creates a virtual machine (VM) in a lab. The VM created based on a marketplace image with ssh authentication. The script then verifies that the VM is available for use. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/devtest-lab/create-verify-virtual-machine-in-lab/create-verify-virtual-machine-in-lab.sh "Create and verify availability of a VM")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive 
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az lab vm create](/cli/azure/lab/vm#az_lab_vm_create) | Creates a virtual machine (VM) in a lab. |
| [az lab vm show](/cli/azure/lab/vm#az_lab_vm_show) | Displays the status of the VM in a lab. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Lab Services CLI script samples can be found in the [Azure Lab Services CLI samples](../samples-cli.md).
