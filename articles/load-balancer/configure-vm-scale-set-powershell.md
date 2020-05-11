---
title: Configure virtual machine scale set with an existing Azure Load Balancer - Azure PowerShell
description: Learn how to configure a virtual machine scale set with an existing Azure Load Balancer.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: article
ms.date: 03/26/2020
---

# Configure a virtual machine scale set with an existing Azure Load Balancer using Azure PowerShell

In this article, you'll learn how to configure a virtual machine scale set with an existing Azure Load Balancer. 

## Prerequisites

- An Azure subscription.
- An existing standard sku load balancer in the subscription where the virtual machine scale set will be deployed.
- An Azure Virtual Network for the virtual machine scale set.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Sign in to Azure CLI

Sign into Azure.

```azurepowershell-interactive
Connect-AzAccount
```

## Deploy a virtual machine scale set with existing load balancer

Replace the values in brackets with the names of the resources in your configuration.

```azurepowershell-interactive

$rsg = <resource-group>
$loc = <location>
$vms = <vm-scale-set-name>
$vnt = <virtual-network>
$sub = <subnet-name>
$lbn = <load-balancer-name>
$pol = <upgrade-policy-mode>

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn

New-AzVmss -ResourceGroupName $rsg -Location $loc -VMScaleSetName $vms -VirtualNetworkName $vnt -SubnetName $sub -LoadBalancerName $lb -UpgradePolicyMode $pol

```

The below example deploys a virtual machine scale set with:

- Virtual machine scale set named **myVMSS**
- Azure Load Balancer named **myLoadBalancer**
- Load balancer backend pool named **myBackendPool**
- Azure Virtual Network named **myVnet**
- Subnet named **mySubnet**
- Resource group named **myResourceGroup**

```azureppowershell-interactive

$rsg = "myResourceGroup"
$loc = "East US 2"
$vms = "myVMSS"
$vnt = "myVnet"
$sub = "mySubnet"
$pol = "Automatic"
$lbn = "myLoadBalancer"

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn

New-AzVmss -ResourceGroupName $rsg -Location $loc -VMScaleSetName $vms -VirtualNetworkName $vnt -SubnetName $sub -LoadBalancerName $lb -UpgradePolicyMode $pol
```
> [!NOTE]
> After the scale set has been created, the backend port cannot be modified for a load balancing rule used by a health probe of the load balancer. To change the port, you can remove the health probe by updating the Azure virtual machine scale set, update the port and then configure the health probe again.

## Next steps

In this article, you deployed a virtual machine scale set with an existing Azure Load Balancer.  To learn more about virtual machine scale sets and load balancer, see:

- [What is Azure Load Balancer?](load-balancer-overview.md)
- [What are virtual machine scale sets?](../virtual-machine-scale-sets/overview.md)
                                