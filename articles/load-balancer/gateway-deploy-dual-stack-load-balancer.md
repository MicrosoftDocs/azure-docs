---
title: Deploy a dual-stack Azure Gateway Load Balancer 
titlesuffix: Azure Virtual Network
description: In this tutorial, you deploy IPv6 configurations to an existing IPv4-configured Azure Gateway Load Balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 09/25/2023
ms.author: mbender
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell
---

# Deploy a dual-stack Azure Gateway Load Balancer

In this tutorial, you deploy IPv6 configurations to an existing IPv4-configured Azure Gateway Load Balancer. 

You learn to:
> [!div class="checklist"]
> * Add IPv6 address ranges to an existing subnet.
> * Add an IPv6 frontend to Gateway Load Balancer.
> * Add an IPv6 backend pool to Gateway Load Balancer.
> * Add IPv6 configuration to network interfaces.
> * Add a load balancing rule for IPv6 traffic.
> * Chain the IPv6 load balancer frontend to Gateway Load Balancer.

Along with the Gateway Load Balancer, this scenario includes the following already-deployed resources:

- A dual stack virtual network and subnet.
- A standard Load Balancer with dual (IPv4 + IPv6) front-end configurations.
- A Gateway Load Balancer with IPv4 only.
- A network interface with a dual-stack IP configuration, a network security group attached, and public IPv4 & IPv6 addresses.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing dual-stack load balancer. For more information on creating a dual-stack load balancer, see [Deploy IPv6 dual stack application - Standard Load Balancer](virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-powershell.md).
- An existing IPv4 gateway balancer. For more information on creating a gateway load balancer, see [Create a gateway load balancer](./tutorial-gateway-powershell.md).

## Add IPv6 address ranges to an existing subnet

This article assumes you already have a Gateway Load Balancer configured for IPv4 traffic, with a corresponding VNET and subnet. In this step, you add IPv6 ranges to your Gateway Load Balancer's VNET and subnet. This range is need when creating an IPv6 frontend configuration for your Gateway Load Balancer using a private IP address from this subnet/VNET.
# [PowerShell](#tab/powershell)

```powershell-interactive

#Add IPv6 ranges to the VNET and subnet
#Retrieve the VNET object
$rg = Get-AzResourceGroup  -ResourceGroupName "myResourceGroup"
$vnet = Get-AzVirtualNetwork  -ResourceGroupName $rg.ResourceGroupName -Name "myVNet"  

#Add IPv6 prefix to the VNET
$vnet.addressspace.addressprefixes.add("fd00:db8:deca::/48")

#Update the running VNET
$vnet |  Set-AzVirtualNetwork

#Retrieve the subnet object from the local copy of the VNET
$subnet= $vnet.subnets[0]

#Add IPv6 prefix to the subnet
$subnet.addressprefix.add("fd00:db8:deca::/64")

#Update the running VNET with the new subnet configuration
$vnet |  Set-AzVirtualNetwork

```
# [CLI](#tab/cli)

```azurecli-interactive

az network vnet subnet update 
--vnet-name myVNet 
--name myGWSubnet 
--resource-group myResourceGroup 
--address-prefixes  "10.1.0.0/24"  "fd00:db8:deca:deed::/64"

```
---

## Add an IPv6 frontend to gateway load balancer

Now that you've added IPv6 prefix ranges to your Gateway Load Balancer's subnet and VNET, we can create a new IPv6 frontend configuration on the Gateway Load Balancer, with an IPv6 address from your subnet's range.

# [PowerShell](#tab/powershell)

```powershell-interactive

# Retrieve the load balancer configuration
$gwlb = Get-AzLoadBalancer -ResourceGroupName "myResourceGroup"-Name "myGatewayLoadBalancer"

# Add IPv6 frontend configuration to the local copy of the load balancer configuration
$gwlb | Add-AzLoadBalancerFrontendIpConfig `
     -Name "myGatewayFrontEndv6" `
     -PrivateIpAddressVersion "IPv6" `
     -Subnet $subnet

#Update the running load balancer with the new frontend
$gwlb | Set-AzLoadBalancer 

```
# [CLI](#tab/cli)


```azurecli-interactive

az network lb frontend-ip create --lb-name myGatewayLoadBalancer                                 
--name myGatewayFrontEndv6                               
--resource-group myResourceGroup                          
--private-ip-address-version IPv6 
--vnet-name myVNet
--subnet myGWSubnet

```
---

## Add an IPv6 backend pool to gateway load balancer

In order to distribute IPv6 traffic, you need a backend pool containing instances with IPv6 addresses. First, you create a backend pool on the Gateway Load Balancer. In the following step, you create IPv6 configurations to your existing backend NICs for IPv4 traffic, and attach them to this backend pool.

# [PowerShell](#tab/powershell)

```azurepowershell-interactive

## Create IPv6 tunnel interfaces
$int1 = @{
    Type = 'Internal'
    Protocol = 'Vxlan'
    Identifier = '866'
    Port = '2666'
}
$tunnelInterface1 = New-AzLoadBalancerBackendAddressPoolTunnelInterfaceConfig @int1

$int2 = @{
    Type = 'External'
    Protocol = 'Vxlan'
    Identifier = '867'
    Port = '2667'
}
$tunnelInterface2 = New-AzLoadBalancerBackendAddressPoolTunnelInterfaceConfig @int2

# Create the IPv6 backend pool
$pool = @{
    Name = 'myGatewayBackendPoolv6'
    TunnelInterface = $tunnelInterface1,$tunnelInterface2
}

# Add the backend pool to the load balancer
$gwlb | Add-AzLoadBalancerBackendAddressPoolConfig @pool

# Update the load balancer
$gwlb | Set-AzLoadBalancer

```
# [CLI](#tab/cli)

```azurecli-interactive

az network lb address-pool create --address-pool-name myGatewayBackendPool \
                                  --lb-name myGatewayLoadBalancer \
                                  --resource-group myResourceGroup \
                                  --tunnel-interfaces "{[{"port": 2666,"identifier": 866,"protocol": "VXLAN","type": "Internal"},{"port": 2667,"identifier": 867,"protocol": "VXLAN","type": "External"}]}"

```
---

## Add IPv6 configuration to network interfaces

# [PowerShell](#tab/powershell)

```azurepowershell-interactive

#Retrieve the NIC object
$NIC_1 = Get-AzNetworkInterface -Name "myNic1" -ResourceGroupName $rg.ResourceGroupName


$backendPoolv6 = Get-AzLoadBalancerBackendAddressPoolConfig -Name "myGatewayBackendPoolv6" -LoadBalancer $gwlb

#Add an IPv6 IPconfig to NIC_1 and update the NIC on the running VM
$NIC_1 | Add-AzNetworkInterfaceIpConfig -Name myIPv6Config -Subnet $vnet.Subnets[0]  -PrivateIpAddressVersion IPv6 -LoadBalancerBackendAddressPool $backendPoolv6 
$NIC_1 | Set-AzNetworkInterface


```
# [CLI](#tab/cli)

```azurecli-interactive

az network nic ip-config create \
--name myIPv6Config \
--nic-name myVM1 \
--resource-group MyResourceGroup \
--vnet-name myVnet \
--subnet mySubnet \
--private-ip-address-version IPv6 \
--lb-address-pools gwlb-v6pool \
--lb-name myGatewayLoadBalancer

```
---

## Add a load balancing rule for IPv6 traffic

Load balancing rules determine how traffic is routed to your backend instances. For Gateway Load Balancer, you create a load balancing rule with HA ports enabled, so that you can inspect traffic of all protocols, arriving on all ports.

# [PowerShell](#tab/powershell)

```azurepowershell-interactive

# Retrieve the updated (live) versions of the frontend and backend pool, and existing health probe
$frontendIPv6 = Get-AzLoadBalancerFrontendIpConfig -Name "myGatewayFrontEndv6" -LoadBalancer $gwlb
$backendPoolv6 = Get-AzLoadBalancerBackendAddressPoolConfig -Name "myGatewayBackendPoolv6" -LoadBalancer $gwlb
$healthProbe = Get-AzLoadBalancerProbeConfig -Name "myHealthProbe" -LoadBalancer $gwlb

# Create new LB rule with the frontend and backend
$gwlb | Add-AzLoadBalancerRuleConfig `
  -Name "myRulev6" `
  -FrontendIpConfiguration $frontendIPv6 `
  -BackendAddressPool $backendPoolv6 `
  -Protocol All `
  -FrontendPort 0 `
  -BackendPort 0 `
  -Probe $healthProbe

#Finalize all the load balancer updates on the running load balancer
$gwlb | Set-AzLoadBalancer
 

```    
# [CLI](#tab/cli)

```azurecli-interactive
az network lb rule create \
    --resource-group myResourceGroup \
    --lb-name myGatewayLoadBalancer \
    --name myGatewayLoadBalancer-rule \
    --protocol All \
    --frontend-port 0 \
    --backend-port 0 \
    --frontend-ip-name gwlb-v6fe \
    --backend-pool-name gwlb-v6pool \
    --probe-name myGatewayLoadBalancer-hp
```
---

## Chain the IPv6 load balancer frontend to gateway load balancer

In this final step, you'll chain your existing Standard Load Balancer's IPv6 frontend to the Gateway Load Balancer's IPv6 frontend. Now, all IPv6 traffic headed to your Standard Load Balancer's frontend is forwarded to your Gateway Load Balancer for inspection by the configured NVAs before reaching your application.

# [PowerShell](#tab/powershell)

```azurepowershell-interactive

## Place the existing Standard load balancer into a variable. ##
$par1 = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myLoadBalancer'
}
$lb = Get-AzLoadBalancer @par1

## Place the public frontend IP of the Standard load balancer into a variable.
$par3 = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myIPv6PublicIP'
}
$publicIP = Get-AzPublicIPAddress @par3

## Chain the Gateway load balancer to your existing Standard load balancer frontend. ##
# $feip = Get-AzLoadBalancerFrontendIpConfig -Name "myGatewayFrontEndv6" -LoadBalancer $gwlb

$par4 = @{
    Name = 'myIPv6FrontEnd'
    PublicIPAddress = $publicIP 
    LoadBalancer = $lb
    GatewayLoadBalancerId = $feip.id
}
$config = Set-AzLoadBalancerFrontendIpConfig @par4

$config | Set-AzLoadBalancer

```
# [CLI](#tab/cli)

```azurecli-interactive

feid=$(az network lb frontend-ip show \
    --resource-group myResourceGroup \
    --lb-name myLoadBalancer-gw \
    --name myFrontend \
    --query id \
    --output tsv)

  az network lb frontend-ip update \
    --resource-group myResourceGroup \
    --name myFrontendIP \
    --lb-name myLoadBalancer \
    --public-ip-address myIPv6PublicIP \
    --gateway-lb $feid

```
---
## Limitations

- Gateway load balancer doesn't support NAT 64/46. 
- When you implement chaining, the IP address version of Standard and Gateway Load Balancer front end configurations must match.

## Next steps

- Learn more about [Azure Gateway Load Balancer partners](./gateway-partners.md) for deploying network virtual appliances.
