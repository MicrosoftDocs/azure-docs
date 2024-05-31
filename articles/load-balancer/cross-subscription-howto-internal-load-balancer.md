---
title: Create a cross-subscription internal load balancer
description: Learn how to create a cross-subscription internal load balancer by connecting a virtual network in a subscription to a load balancer in a different subscription.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 05/24/2024
ms.author: mbender
ms.custom:
#CustomerIntent: As a < type of user >, I want < what? > so that < why? > .
---

# Create a cross-subscription internal load balancer

A [cross-subscription internal load balancer (ILB)](cross-subscription-load-balancer-overview.md) can reference a virtual network that resides in a different subscription other than the load balancers. This feature allows you to deploy a load balancer in one subscription and reference a virtual network in another subscription. 

In this how-to guide, you learn how to create a cross-subscription internal load balancer by connecting a virtual network in a subscription to a load balancer in a different subscription.

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
    ResourceGroupName = 'myResourceGroupLB'
    Name = 'myLoadBalancer'
    Location = 'westus'
    Sku = 'Standard'
}

$LB = New-AzLoadBalancer @loadbalancer
 
$LBinfo = @{
    ResourceGroupName = 'myResourceGroupLB'
    Name = 'myLoadBalancer’
}

## Add load balancer frontend configuration and apply to load balancer.
$fip = @{
 Name = 'myFrontEnd'
SubnetId = $vnet.subnets[0].Id 
}

$LB = $LB | Add-AzLoadBalancerFrontendIpConfig @fip
$LB = $LB | Set-AzLoadBalancer

## Create backend address pool configuration and place in variable. 
 
$be = @{
    ResourceGroupName= "myResourceGroupLB"
    Name= "myBackEndPool"
    LoadBalancerName= "myLoadBalancer"
    VirtualNetwork=$vnet.id
    SyncMode= "Automatic"
}
 
# Create  the backend pool
$backend = New-AzLoadBalancerBackendAddressPool @be
$LB = Get-AzLoadBalancer @LBinfo

```

# [Azure CLI](#tab/azurecli/)

With Azure CLI, you create a load balancer with [`az network lb create`](/cli/azure/network/lb#az_network_lb_create) and update the backend pool. This example configures the following:

- A frontend IP address that receives the incoming network traffic on the load balancer.
  - The private IP address is pulled from the cross-subscription virtual network.
  - The `IsRemoteFrontend:True` tag is added since the IP address is cross-subscription.
- A backend address pool where the frontend IP sends the load balanced network traffic.

```azurecli

# Create a load balancer with a frontend IP address and backend address pool
az network lb create --resource-group myResourceGroupLB --name myLoadBalancer --sku Standard --subnet '/subscriptions/subscription A ID/resourceGroups/{resource group name} /providers/Microsoft.Network/virtualNetwork/{VNet name}/subnets/{subnet name}’  --frontend-ip-name myFrontEnd --backend-pool-name MyBackendPool --tags 'IsRemoteFrontend=true'

```
In order to utilize the cross-subscription feature of Azure load balancer, backend pools need to have the syncMode property enabled and a virtual network reference. This section updates the backend pool created prior by attaching the cross-subscription virtual network and enabling the syncMode property. 

```azurecli
## Configure the backend address pool and syncMode property
az network lb address-pool update --lb-name myLoadBalancer --resource-group myResourceGroupLB -n myResourceGroupLB --vnet ‘/subscriptions/subscription A ID/resourceGroups/{resource group name} /providers/Microsoft.Network/virtualNetwork/{VNet name}’ --sync-mode Automatic
```
---

## Create a health probe and load balancer rule

Create a health probe that determines the health of the backend VM instances and a load balancer rule that defines the frontend IP configuration for the incoming traffic, the backend IP pool to receive the traffic, and the required source and destination port.

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, create a health probe with [`Add-AzLoadBalancerProbeConfig`](/powershell/module/az.network/add-azloadbalancerprobeconfig) that determines the health of the backend VM instances. Then create a load balancer rule with [`Add-AzLoadBalancerRuleConfig`](/powershell/module/az.network/add-azloadbalancerruleconfig) that defines the frontend IP configuration for the incoming traffic, the backend IP pool to receive the traffic, and the required source and destination port.

```azurepowershell
## Create the health probe and place in variable. ##
$probe = @{
    Name = 'myHealthProbe2'
    Protocol = 'tcp'
    Port = '80'
    IntervalInSeconds = '360'
    ProbeCount = '5'
}

## Create the load balancer rule and place in variable. ##
$lbrule = @{
    Name = 'myHTTPRule2'
    Protocol = 'tcp'
    FrontendPort = '80'
    BackendPort = '80'
    IdleTimeoutInMinutes = '15'
    FrontendIpConfiguration = $LB.FrontendIpConfigurations[0]
    BackendAddressPool = $backend
}
## Set the load balancer resource. ##
$LB | Add-AzLoadBalancerProbeConfig @probe
$LB | Add-AzLoadBalancerRuleConfig  @lbrule
$LB | Set-AzLoadBalancer
```
# [Azure CLI](#tab/azurecli/)

With Azure CLI, create a health probe with [`az network lb probe create`](/cli/azure/network/lb/probe#az_network_lb_probe_create) that determines the health of the backend VM instances. Then create a load balancer rule with [`az network lb rule create`](/cli/azure/network/lb/rule#az_network_lb_rule_create) that defines the frontend IP configuration for the incoming traffic, the backend IP pool to receive the traffic, and the required source and destination port.

```azurecli
# Create a health probe
az network lb probe create --resource-group myResourceGroupLB --lb-name myLoadBalancer --name myHealthProbe --protocol tcp --port 80

# Create a load balancer rule
az network lb rule create --resource-group myResourceGroupLB --lb-name myLoadBalancer --name myHTTPRule --protocol tcp --frontend-port 80 --backend-port 80 --frontend-ip-name myFrontEnd --backend-pool-name myBackEndPool --probe-name myHealthProbe --disable-outbound-snat true --idle-timeout 15 --enable-tcp-reset true

```

---

[!INCLUDE [load-balancer-cross-subscription-add-nic](../../includes/load-balancer-cross-subscription-add-nic.md)]

[!INCLUDE [load-balancer-cross-subscription-clean-up](../../includes/load-balancer-cross-subscription-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Attach a cross-subscription frontend to an Azure Load Balancer](./cross-subscription-how-to-attach-frontend.md)