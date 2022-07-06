---
title: Create virtual machines in a scale set using Azure PowerShell
description: Learn how to create a virtual machine scale set in Flexible orchestration mode using PowerShell.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 08/05/2021
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
Create the virtual machine scale set using the [New-AzVmss](/powershell/module/azcompute/new-azvmss) command.
```
New-AzVmss `
    -ResourceGroup "myVMSSResourceGroup" `
    -Name "myScaleSet" ` 
    -OrchestrationMode "Flexible" `
    -Location "East US" `
    -InstanceCount "3" `
    -ImageName "Win2019Datacenter"
```
### Add a single VM to a scale set

The following example shows the creation of a Flexible scale set without a VM profile, where the fault domain count is set to 1. A virtual machine is created and then added to the Flexible scale set.

1. Log into Azure PowerShell and specify the subscription and variables for the deployment. 

    ```azurepowershell-interactive
    Connect-AzAccount
    Set-AzContext `
        -Subscription "00000000-0000-0000-0000-000000000" 
    
    $loc = "eastus" 
    $rgname = "myResourceGroupFlexible" 
    $vmssName = "myFlexibleVMSS" 
    $vmname = "myFlexibleVM"
    ```

1. Don't specify VM Profile parameters like networking or VM SKUs.

    ```azurepowershell-interactive
    $VmssConfigWithoutVmProfile = new-azvmssconfig -location $loc -platformfaultdomain 1 `
    $VmssFlex = new-azvmss -resourcegroupname $rgname -vmscalesetname $vmssName -virtualmachinescaleset $VmssConfigWithoutVmProfile 
    ```
 
1. Add a VM to the Flexible scale set.

    ```azurepowershell-interactive
    $vm = new-azvm -resourcegroupname $rgname -location $loc -name $vmname -credential $cred -domainnamelabel $domainName -vmssid $VmssFlex.id 
    ```


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a scale set in the Azure portal.](flexible-virtual-machine-scale-sets-portal.md)
