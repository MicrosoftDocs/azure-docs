---
title: Create virtual machines in a Flexible scale set using Azure PowerShell
description: Learn how to create a virtual machine scale set in Flexible orchestration mode using PowerShell.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 08/05/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex

#May be dropping this since you can't create with PS at this moment... TBD.
---

# Preview: Create virtual machines in a Flexible scale set using PowerShell

**Applies to:** :heavy_check_mark: Flexible scale sets


This article steps through using PowerShell to create a virtual machine scale set in Flexible orchestration mode. For more information about Flexible scale sets, see [Flexible orchestration mode for virtual machine scale sets](flexible-virtual-machine-scale-sets.md). 


> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


> [!CAUTION]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.


## Register for Flexible orchestration mode

Before you can deploy virtual machine scale sets in Flexible orchestration mode, you must first register your subscription for the preview feature. The registration may take several minutes to complete.

Use the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet to enable the preview for your subscription.

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName VMOrchestratorMultiFD -ProviderNamespace Microsoft.Compute `
Register-AzProviderFeature -FeatureName VMOrchestratorSingleFD -ProviderNamespace Microsoft.Compute `
Register-AzProviderFeature -FeatureName VMScaleSetFlexPreview -ProviderNamespace Microsoft.Compute `
Register-AzProviderFeature -FeatureName SkipPublicIpWriteRBACCheckForVMNetworkInterfaceConfigurationsPublicPreview -ProviderNamespace Microsoft.Compute
```

Feature registration can take up to 15 minutes. To check the registration status:

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName VMOrchestratorMultiFD -ProviderNamespace Microsoft.Compute
```


## Get started with Flexible orchestration mode

Create a Flexible virtual machine scale set with Azure PowerShell. The following example shows the creation of a Flexible scale set where the fault domain count is set to 1, a virtual machine is created and then added to the Flexible scale set.

```azurepowershell-interactive
Connect-AzAccount
Set-AzContext `
    -Subscription "00000000-0000-0000-0000-000000000" 

$loc = "eastus" 
$rgname = "myResourceGroupFlexible" 
$vmssName = "myFlexibleVMSS" 
$vmname = "myFlexibleVM"
```

### Create a virtual machine scale set Config with minimal parameters 

1. Do not specify VM Profile parameters like networking or VM SKUs.

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
> [Learn how to create a Flexible scale set in the Azure portal.](flexible-virtual-machine-scale-sets-portal.md)
