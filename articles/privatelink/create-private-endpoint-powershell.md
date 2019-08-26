---
title: 'Create an Azure Private Link using Azure PowerShell| Microsoft Docs'
description: Learn about Azure Private Link
services: virtual-network
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create an Azure Private Endpoint
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
## Create a Private Endpoint

  
### Create a virtual network
 
```azurepowershell
# Create VNet for private endpoint
$peSubnet = New-AzVirtualNetworkSubnetConfig `
-Name peSubnet `
-AddressPrefix "11.0.1.0/24" `
-PrivateEndpointNetworkPolicies "Disabled" 

$vnetPE = New-AzVirtualNetwork `
-Name $virtualNetworkNamePE `
-ResourceGroupName $rgName `
-Location $location `
-AddressPrefix "11.0.0.0/16" `
-Subnet $peSubnet 
```
### Create a Private Endpoint
 
```azurepowershell  
$plsConnection= New-AzPrivateLinkServiceConnection `
-Name plsConnection `
-PrivateLinkServiceId  $privateLinkService.Id  
$privateEndpoint = New-AzPrivateEndpoint -ResourceGroupName $rgName -Name $peName -Location $location -Subnet $vnetPE.subnets[0] -PrivateLinkServiceConnection $plsConnection -ByManualRequest 
 ```
### Get Private Endpoint

```azurepowershell  
# Get Private Endpoint and its Ip Address 
$pe =  Get-AzPrivateEndpoint `
-Name $peName `
-ResourceGroupName $rgName  `
-ExpandResource networkinterfaces $pe.NetworkInterfaces[0].IpConfigurations[0].PrivateIpAddress 
 ```
  
### Approve the Private Endpoint connection

```azurepowershell   
# For Private Link Service to approve the Private Endpoint Connection 
$pls = Get-AzPrivateLinkService `
-Name $plsName `
-ResourceGroupName $rgName 

Approve-AzPrivateEndpointConnection -ResourceId $pls.PrivateEndpointConnections[0].Id -Description "Approved" 
 ``` 
## Next steps
- Learn more about [Azure Private Link](privatelink-overview.md)
 

## Next steps
- Learn more about [Azure Private Link](privatelink-overview.md)
 
