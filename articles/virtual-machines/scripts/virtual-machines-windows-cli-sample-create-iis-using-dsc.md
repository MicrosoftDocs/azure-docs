---
title: Azure CLI Script Sample - Create a Windows Server 2016 VM with IIS using DSC 
description: Azure CLI Script Sample - Create a Windows Server 2016 VM with IIS using DSC
services: virtual-machines-windows
documentationcenter: virtual-machines
author: rickstercdn
manager: gwallace

tags: 

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 02/23/2017
ms.author: rclaus
ms.custom: mvc
---

# Create a VM with IIS using DSC

This script creates a virtual machine, and uses the Azure Virtual Machine DSC custom script extension to install and configure IIS. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/create-windows-iis-using-dsc/create-windows-iis-using-dsc.sh "Quick Create VM")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az vm create](https://docs.microsoft.com/cli/azure/vm) | Creates the virtual machine and connects it to the network card, virtual network, subnet, and NSG. This command also specifies the virtual machine image to be used, and administrative credentials.  |
| [az vm extension set](https://docs.microsoft.com/cli/azure/vm) | Add the Custom Script Extension to the virtual machine which invokes a script to install IIS. |
| [az vm open-port](https://docs.microsoft.com/cli/azure/vm) | Creates a network security group rule to allow inbound traffic. In this sample, port 80 is opened for HTTP traffic. |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Windows VM documentation](../windows/cli-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
