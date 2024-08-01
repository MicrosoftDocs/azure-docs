---
title: Attach a cross-subscription backend to an Azure Load Balancer
titleSuffix: Azure Load Balancer
description: Learn how to attach a cross-subscription backend to an Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 06/18/2024
ms.author: mbender
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Attach a cross-subscription backend to an Azure Load Balancer
In this article, you learn how to attach a cross-subscription backend to an Azure Load Balancer by creating a cross-subscription backend pool and attaching cross-subscription network interfaces to the backend pool of the load balancer.

A [cross-subscription load balancer](cross-subscription-overview.md) can reference a virtual network that resides in a different subscription other than the load balancers. This feature allows you to deploy a load balancer in one subscription and reference a virtual network in another subscription.

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
    Name = 'my-lb'
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

With Azure CLI, you create a load balancer with [`az network lb create`](/cli/azure/network/lb#az_network_lb_create) and update the backend pool. This example configures the following resources:

- A frontend IP address that receives the incoming network traffic on the load balancer.
- A backend address pool where the frontend IP sends the load balanced network traffic.

```azurecli

# Create a load balancer
az network lb create --resource-group myResourceGroupLB --name myLoadBalancer --sku Standard --public-ip-address myPublicIP   --frontend-ip-name myFrontEnd --backend-pool-name BackendPool1 --tags 'IsRemoteFrontend=true'

```

In order to utilize the cross-subscription feature of Azure load balancer, backend pools need to have the syncMode property enabled and a virtual network reference. This section updates the backend pool created prior by attaching the cross-subscription virtual network and enabling the syncMode property. 

```azurecli
## Configure the backend address pool and syncMode property
az network lb address-pool update --lb-name myLoadBalancer --resource-group myResourceGroupLB -n myResourceGroupLB --vnet ‘/subscriptions/<subscription A ID>/resourceGroups/{resource group name}/providers/Microsoft.Network/virtualNetwork/{VNet name}’ --sync-mode Automatic
```

---

[!INCLUDE [load-balancer-cross-subscription-health-probe-rules](../../includes/load-balancer-cross-subscription-health-probe-rules.md)]

[!INCLUDE [load-balancer-cross-subscription-add-nic](../../includes/load-balancer-cross-subscription-add-nic.md)]

[!INCLUDE [load-balancer-cross-subscription-clean-up](../../includes/load-balancer-cross-subscription-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create a cross-subscription internal load balancer](./cross-subscription-how-to-internal-load-balancer.md)
