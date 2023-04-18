---
title: Configure Virtual Machine Scale Set with an existing Azure Load Balancer - Azure PowerShell
description: Learn how to configure a Virtual Machine Scale Set with an existing Azure Load Balancer using Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to
ms.date: 12/15/2022
ms.custom: template-how-to, engagement-fy23, devx-track-azurepowershell, devx-track-azurecli
ms.devlang: azurecli
---

# Configure a Virtual Machine Scale Set with an existing Azure Load Balancer using Azure PowerShell

In this article, you'll learn how to configure a Virtual Machine Scale Set with an existing Azure Load Balancer.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing resource group for all resources.
- An existing standard sku load balancer in the subscription where the Virtual Machine Scale Set will be deployed.
- An Azure Virtual Network for the Virtual Machine Scale Set.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Sign in to Azure CLI

Sign into Azure with [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount#example-1-connect-to-an-azure-account)

```azurepowershell-interactive
Connect-AzAccount
```

## Deploy a Virtual Machine Scale Set with existing load balancer
Deploy a Virtual Machine Scale Set with [`New-AzVMss`](/powershell/module/az.compute/new-azvmss). Replace the values in brackets with the names of the resources in your configuration.

```azurepowershell-interactive

$rsg = <resource-group>
$loc = <location>
$vms = <vm-scale-set-name>
$vnt = <virtual-network>
$sub = <subnet-name>
$lbn = <load-balancer-name>
$pol = <upgrade-policy-mode>
$img = <image-name>
$bep = <backend-pool-name>

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn

New-AzVmss -ResourceGroupName $rsg -Location $loc -VMScaleSetName $vms -VirtualNetworkName $vnt -SubnetName $sub -LoadBalancerName $lb -UpgradePolicyMode $pol

```

The below example deploys a Virtual Machine Scale Set with the following values:

- Virtual Machine Scale Set named **myVMSS**
- Azure Load Balancer named **myLoadBalancer**
- Load balancer backend pool named **myBackendPool**
- Azure Virtual Network named **myVnet**
- Subnet named **mySubnet**
- Resource group named **myResourceGroup**

```azurepowershell-interactive

$rsg = "myResourceGroup"
$loc = "East US 2"
$vms = "myVMSS"
$vnt = "myVnet"
$sub = "mySubnet"
$pol = "Automatic"
$lbn = "myLoadBalancer"
$bep = "myBackendPool"

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn

New-AzVmss -ResourceGroupName $rsg -Location $loc -VMScaleSetName $vms -VirtualNetworkName $vnt -SubnetName $sub -LoadBalancerName $lb -UpgradePolicyMode $pol -BackendPoolName $bep

```
> [!NOTE]
> After the scale set has been created, the backend port cannot be modified for a load balancing rule used by a health probe of the load balancer. To change the port, you can remove the health probe by updating the Azure virtual machine scale set, update the port and then configure the health probe again.

## Next steps

In this article, you deployed a Virtual Machine Scale Set with an existing Azure Load Balancer.  To learn more about Virtual Machine Scale Sets and load balancer, see:

- [What is Azure Load Balancer?](load-balancer-overview.md)
- [What are Virtual Machine Scale Sets?](../virtual-machine-scale-sets/overview.md)
