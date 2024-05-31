---
title: Attach a cross-subscription backend to an Azure Load Balancer
titleSuffix: Azure Load Balancer
description: Learn how to attach a cross-subscription backend to an Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 05/31/2024
ms.author: mbender
ms.custom: 
---

A cross-subscription load balancer allows the public IP address to reside in a different subscription other than the load balancers.

In this article, you will learn how to attach a cross-subscription backend to an Azure Load Balancer by creating a cross-subscription backend pool and attaching cross-subscription network interfaces to the backend pool of the load balancer.

[!INCLUDE [load-balancer-cross-subscription-preview](../../includes/load-balancer-cross-subscription-preview.md)]

[!INCLUDE [load-balancer-cross-subscription-prerequisites](../../includes/load-balancer-cross-subscription-prerequisites.md)]

[!INCLUDE [load-balancer-cross-subscription-azure-sign-in](../../includes/load-balancer-cross-subscription-azure-sign-in.md)]

[!INCLUDE [load-balancer-cross-subscription-create-resource-group](../../includes/load-balancer-cross-subscription-create-resource-group.md)]

## Create a load balancer 

In this section, you create a load balancer in **Azure Subscription B**. You create a load balancer with a frontend IP address.

# [Azure PowerShell](#tab/azurepowershell)
With Azure PowerShell, you'll:

- A load balancer with [`New-AzLoadBalancer`](/powershell/module/az.network/new-azloadbalancer)
- Create a public IP address with [`New-AzPublicIpAddress`](/powershell/module/az.network/new-azpublicipaddress)
- Add a frontend IP configuration with [`Add-AzLoadBalancerFrontendIpConfig`](/powershell/module/az.network/add-azloadbalancerfrontendipconfig)
- Create a backend address pool with [`New-AzLoadBalancerBackendAddressPool`](/powershell/module/az.network/new-azloadbalancerbackendaddresspool).

```azurepowershell
# Create a load balancer
$loadbalancer = @{
    ResourceGroupName = 'resource group B'
    Name = 'LB Name'
    Location = 'eastus'
    Sku = 'Standard'
}
$LB = New-AzLoadBalancer @loadbalancer

$LBinfo = @{
    ResourceGroupName = 'resource group B'
    Name = 'my-lb’
}

# Create a public IP address
$publicip = @{
    Name = 'IP Address Name'
    ResourceGroupName = 'resource group B'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'static'
    Zone = 1,2,3
}
New-AzPublicIpAddress @publicip


# Place public IP created in previous steps into variable
$pip = @{
    Name = 'IP Address Name'
    ResourceGroupName = 'resource group B'
}
$publicIp = Get-AzPublicIpAddress @pip

## Create load balancer frontend configuration and place in variable
$fip = @{
    Name = 'Frontend Name'
    PublicIpAddress = $publicip
}
$LB = $LB | Add-AzLoadBalancerFrontendIpConfig @fip
$LB = $LB | Set-AzLoadBalancer

# Create backend address pool configuration and place in variable. ##

$be = @{
    ResourceGroupName= "resource group B"
    Name= "myBackEndPool"
    LoadBalancerName= "LB Name"
    VirtualNetwork=$vnet.id
    SyncMode= "Automatic"
}

#Create the backend pool
$backend = New-AzLoadBalancerBackendAddressPool @be
$LB = Get-AzLoadBalancer @LBinfo
```
# [Azure CLI](#tab/azurecli)

---
## Create a health probe and load balancer rule

Create a health probe that determines the health of the backend VM instances and a load balancer rule that defines the frontend IP configuration for the incoming traffic, the backend IP pool to receive the traffic, and the required source and destination port.

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, create a health probe with [`Add-AzLoadBalancerProbeConfig`](/powershell/module/az.network/add-azloadbalancerprobeconfig) that determines the health of the backend VM instances. Then create a load balancer rule with [`Add-AzLoadBalancerRuleConfig`](/powershell/module/az.network/add-azloadbalancerruleconfig) that defines the frontend IP configuration for the incoming traffic, the backend IP pool to receive the traffic, and the required source and destination port.

```azurepowershell
## Create the health probe and place in variable
$probe = @{
    Name = 'myHealthProbe2'
    Protocol = 'tcp'
    Port = '80'
    IntervalInSeconds = '360'
    ProbeCount = '5'
}
$LB | Add-AzLoadBalancerProbeConfig @probe

## Create the load balancer rule and place in variable
$lbrule = @{
    Name = 'myHTTPRule2'
    Protocol = 'tcp'
    FrontendPort = '80'
    BackendPort = '80'
    IdleTimeoutInMinutes = '15'
    FrontendIpConfiguration = $LB.FrontendIpConfigurations[0]
    BackendAddressPool = $backend
}
$LB | Add-AzLoadBalancerRuleConfig  @lbrule

## Set the load balancer resource
$LB | Set-AzLoadBalancer
```

# [Azure CLI](#tab/azurecli)

---

[!INCLUDE [load-balancer-cross-subscription-add-nic](../../includes/load-balancer-cross-subscription-add-nic.md)]

[!INCLUDE [load-balancer-cross-subscription-clean-up](../../includes/load-balancer-cross-subscription-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]