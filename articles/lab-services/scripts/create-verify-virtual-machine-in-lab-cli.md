---
title: Azure CLI Script Sample - Create and verify a virtual machine in a lab | Microsoft Docs
description: This Azure CLI script creates a virtual machine in a lab, and verifies that it's available. 
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
ms.date: 04/12/2018
ms.author: spelluru
ms.custom: mvc
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
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az lab vm create](/cli/azure/lab/vm?view=azure-cli-latest#az-lab-vm-create) | Creates a virtual machine (VM) in a lab. |
| [az lab vm show](/cli/azure/lab/vm?view=azure-cli-latest#az-lab-vm-show) | Displays the status of the VM in a lab. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Lab Services CLI script samples can be found in the [Azure Lab Services CLI samples](../samples-cli.md).
