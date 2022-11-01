---
title: Create virtual machines in a scale set using Azure PowerShell
description: Learn how to create a virtual machine scale set in Flexible orchestration mode using PowerShell.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 11/01/2022
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Create virtual machines in a scale set using PowerShell

This article steps through using PowerShell to create a virtual machine scale set. 

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.


## Create resource group
Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```azurepowershell-interactive
New-AzResourceGroup -Name 'myVMSSResourceGroup' -Location 'EastUS'
```

## Create a virtual machine scale set
Now create a virtual machine scale set with [New-AzVmss](/powershell/module/az.compute/new-azvmss). The following example creates a scale set with an instance count of *2* running Windows Server 2019 Datacenter edition. 

```azurepowershell-interactive
New-AzVmss `
    -ResourceGroup "myVMSSResourceGroup" `
    -Name "myScaleSet" ` 
    -OrchestrationMode "Flexible" `
    -Location "East US" `
    -InstanceCount "2" `
    -ImageName "Win2019Datacenter"
```

## Clean up resources
When you delete a resource group, all resources contained within, such as the VM instances, virtual network, and disks, are also deleted. The `-Force` parameter confirms that you wish to delete the resources without an additional prompt to do so. The `-AsJob` parameter returns control to the prompt without waiting for the operation to complete.

```azurepowershell-interactive
Remove-AzResourceGroup -Name "myResourceGroup" -Force -AsJob
```



## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a scale set in the Azure portal.](flexible-virtual-machine-scale-sets-portal.md)
