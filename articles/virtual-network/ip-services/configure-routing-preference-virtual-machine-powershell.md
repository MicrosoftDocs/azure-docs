---
title: 'Tutorial: Configure routing preference for a VM - Azure PowerShell'
description: In this tutorial, learn how to configure routing preference for a VM using a public IP address with Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: tutorial
ms.date: 08/24/2023
ms.custom: template-tutorial, devx-track-azurepowershell
---

# Tutorial: Configure routing preference for a VM using Azure PowerShell

This tutorial shows you how to configure routing preference for a virtual machine. Internet bound traffic from the VM will be routed via the ISP network when you choose **Internet** as your routing preference option. The default routing is via the Microsoft global network.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a public IP address configured for **Internet** routing preference.
> * Create a virtual machine.
> * Verify the public IP address is set to **Internet** routing preference.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **TutorVMRoutePref-rg** in the **westus2** location.

```azurepowershell-interactive
New-AzResourceGroup -Name 'TutorVMRoutePref-rg' -Location 'westus2'

```

## Create a public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard zone-redundant public IPv4 address named **myPublicIP** in **TutorVMRoutePref-rg**. The **Tag** of **Internet** is applied to the public IP address as a parameter in the PowerShell command enabling the **Internet** routing preference.

```azurepowershell-interactive
## Create IP tag for Internet and Routing Preference. ##
$tag = @{
    IpTagType = 'RoutingPreference'
    Tag = 'Internet'   
}
$ipTag = New-AzPublicIpTag @tag

## Create IP. ##
$ip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'TutorVMRoutePref-rg'
    Location = 'westus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    IpTag = $ipTag
    Zone = 1,2,3   
}
New-AzPublicIpAddress @ip
```

## Create virtual machine

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create a virtual machine. The public IP address created in the previous section is added as part of the PowerShell command and is attached to the VM during creation.

```azurepowershell-interactive
## Create virtual machine. ##
$vm = @{
    ResourceGroupName = 'TutorVMRoutePref-rg'
    Location = 'West US 2'
    Name = 'myVM'
    PublicIpAddressName = 'myPublicIP'
}
New-AzVM @vm
```

## Verify internet routing preference

Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to verify that **Internet** routing preference is configured for the public IP address.

```azurepowershell-interactive
$ip = @{
    ResourceGroupName = 'TutorVMRoutePref-rg'
    Name = 'myPublicIP'
}  
Get-AzPublicIPAddress @ip | select -ExpandProperty IpTags

```

## Clean up resources

When you're done with the virtual machine and public IP address, delete the resource group and all of the resources it contains with [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'TutorVMRoutePref-rg'

```

## Next steps

Advance to the next article to learn how to create a virtual machine with mixed routing preference:
> [!div class="nextstepaction"]
> [Configure both routing preference options for a virtual machine](routing-preference-mixed-network-adapter-portal.md)
