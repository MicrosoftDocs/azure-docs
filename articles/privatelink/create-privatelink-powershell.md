---
title: 'Create an Azure Private Link using Azure PowerShell| Microsoft Docs'
description: Learn about Azure Private Link
services: virtual-network
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create an Azure Private Link
ms.service: virtual-network
ms.topic: article
ms.date: 08/26/2019
ms.author: kumud

---
# Create Azure Private Link using Azure PowerShell
This quickstart shows you how to create a Private Link in Azure.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version XYZ or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

Before you can create your private link, you must create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named *myResourceGroupLB* in the *EastUS* location:

```azurepowershell
$location = "eastus2"
$rgName = "myResourceGroupPrivateLink"
New-AzResourceGroup `
  -ResourceGroupName $rgName `
  -Location $location
```
## Create a virtual network
Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named *myVnet* with subnet for frontend (*frontendSubnet*), backend (*backendSubnet*), private link (*otherSubnet*):

```azurepowershell

# Create subnet config

$frontendSubnet = New-AzVirtualNetworkSubnetConfig `
-Name frontendSubnet `
-AddressPrefix "10.0.1.0/24"  

$backendSubnet = New-AzVirtualNetworkSubnetConfig `
-Name backendSubnet `
-AddressPrefix "10.0.2.0/24"  

$otherSubnet = New-AzVirtualNetworkSubnetConfig `
-Name otherSubnet `
-AddressPrefix "10.0.3.0/24" `
-PrivateLinkServiceNetworkPolicies "Disabled" 

# Create the virtual network
$vnet = New-AzVirtualNetwork `
-Name $virtualNetworkName `
-ResourceGroupName $rgName `
-Location $location `
-AddressPrefix "10.0.0.0/16" `
-Subnet $frontendSubnet,$backendSubnet,$otherSubnet 
```
## Create Internal Load Balancer
Create an internal Standard Load Balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer). The following example creates an internal Standard Load Balancer using the frontend IP configuration and backend pool that you created in the preceding steps:

```azurepowershell
$ver = "815"

$lbBackendName = "LB-backend" 
$lbFrontName = "LB-frontend" 
$lbName = "lb" + $ver
 
#Create Internal Load Balancer
$frontendIP = New-AzLoadBalancerFrontendIpConfig -Name $lbFrontName -PrivateIpAddress 10.0.1.5 -SubnetId $vnet.subnets[0].Id 
$beaddresspool= New-AzLoadBalancerBackendAddressPoolConfig -Name $lbBackendName 
$NRPLB = New-AzLoadBalancer -ResourceGroupName $rgName -Name $lbName -Location $location -FrontendIpConfiguration $frontendIP -BackendAddressPool $beAddressPool -Sku "Standard" 
```
## Create a Private Link service
Create a private link service with [New-AzPrivateLinkService](/powershell/module/az.network/new-azloadbalancer) as follows:

```azurepowershell

$plsIpConfigName = "PLS-ipconfig" 
$plsName = "pls" + $ver 
$peName = "pe" + $ver  
  
$IPConfig = New-AzPrivateLinkServiceIpConfig `
-Name $plsIpConfigName `
-Subnet $vnet.subnets[2] `
-PrivateIpAddress 10.0.3.5 

$fe = Get-AzLoadBalancer -Name $lbName | Get-AzLoadBalancerFrontendIpConfig 

$privateLinkService = New-AzPrivateLinkService `
-ServiceName $plsName `
-ResourceGroupName $rgName `
-Location $location `
-LoadBalancerFrontendIpConfiguration $fe`
-IpConfiguration $IPConfig 
```

## Get Private Link Service
Get details about your private link service with [New-AzPrivateLinkService](/powershell/module/az.network/get-azprivatelinkservice) as follows:

```azurepowershell
$pls = Get-AzPrivateLinkService -Name $plsName -ResourceGroupName $rgName 
```

## Next steps
- Learn more about [Azure Private Link](privatelink-overview.md)
 
