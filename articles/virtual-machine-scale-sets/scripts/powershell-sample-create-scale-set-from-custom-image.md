---
title: Azure PowerShell Samples - Use a custom VM image
description: This script creates a virtual machine scale set that uses a custom VM image as the source for the VM instances.
author: cynthn
tags: azure-resource-manager
ms.service: virtual-machine-scale-sets
ms.topic: sample
ms.date: 03/27/2018
ms.author: cynthn
ms.custom: mvc

---

# Create a virtual machine scale set from a custom VM image with PowerShell
This script creates a virtual machine scale set that uses a custom VM image as the source for the VM instances.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az.md](../../../includes/updated-for-az.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine-scale-sets/use-custom-vm-image/use-custom-vm-image.ps1 "Create a virtual machine scale set with a custom VM image")]

## Clean up deployment
Run the following command to remove the resource group, scale set, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Script explanation
This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzVmss](/powershell/module/az.compute/new-azvmss) | Creates the virtual machine scale set and all supporting resources, including virtual network, load balancer, and NAT rules. |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps
For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine scale set PowerShell script samples can be found in the [Azure virtual machine scale set documentation](../powershell-samples.md).
