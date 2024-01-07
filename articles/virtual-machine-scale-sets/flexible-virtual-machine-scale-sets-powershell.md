---
title: Create virtual machines in a scale set using Azure PowerShell
description: Learn how to create a Virtual Machine Scale Set in Flexible orchestration mode using PowerShell.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: jushiman
ms.custom: mimckitt, vmss-flex, devx-track-azurepowershell
---

# Create virtual machines in a scale set using PowerShell

This article steps through using PowerShell to create a Virtual Machine Scale Set. 

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.


## Create resource group
Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```azurepowershell-interactive
New-AzResourceGroup -Name 'myVMSSResourceGroup' -Location 'EastUS'
```

## Create a Virtual Machine Scale Set
Now create a Virtual Machine Scale Set with [New-AzVmss](/powershell/module/az.compute/new-azvmss). The following example creates a scale set with an instance count of *two* running Windows Server 2019 Datacenter edition. 

> [!IMPORTANT]
>Starting November 2023, VM scale sets created using PowerShell and Azure CLI will default to Flexible Orchestration Mode if no orchestration mode is specified. For more information about this change and what actions you should take, go to [Breaking Change for VMSS PowerShell/CLI Customers - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/azure-compute-blog/breaking-change-for-vmss-powershell-cli-customers/ba-p/3818295)

```azurepowershell-interactive
New-AzVmss `
    -ResourceGroup "myVMSSResourceGroup" `
    -Name "myScaleSet" ` 
    -Location "East US" `
    -InstanceCount "2" `
    -ImageName "Win2019Datacenter"
```

## Clean up resources
When you delete a resource group, all resources contained within, such as the VM instances, virtual network, and disks, are also deleted. The `-Force` parameter confirms that you wish to delete the resources without another prompt to do so. The `-AsJob` parameter returns control to the prompt without waiting for the operation to complete.

```azurepowershell-interactive
Remove-AzResourceGroup -Name "myResourceGroup" -Force -AsJob
```



## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a scale set in the Azure portal.](flexible-virtual-machine-scale-sets-portal.md)
