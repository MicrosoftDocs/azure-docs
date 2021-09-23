---
title: 'Tutorial: Create a gateway load balancer - Azure portal'
titlesuffix: Azure Load Balancer
description: Use this tutorial to learn how to create a gateway load balancer using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 10/6/2021
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Create a gateway load balancer using the Azure portal

Gateway load balancer is a SKU of Azure load balancer used for Network Virtual Appliances (NVA). The gateway SKU is used specifically for scenarios that require high performance and high scalability of NVAs.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Register preview feature.
> * Create supporting network resources.
> * Create a gateway load balancer.
> * Configure a backend load balancer pool for NVAs.

> [!IMPORTANT]
> Gateway Azure Load Balancer is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription.[Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Register preview feature

As part of the public preview of gateway load balancer, the provider must be registered in your Azure subscription.

Use [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) to register the **AllowGatewayLoadBalancer** provider feature:

```azurepowershell-interactive
$reg = @{
    FeatureName = 'AllowGatewayLoadBalancer`
    ProviderNamespace = 'Microsoft.Network'
}
Register-AzProviderFeature @reg

```

Use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) to register the **Microsoft.Network** resource provider:

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Network

```

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
New-AzResourceGroup -Name 'TutorGwLB-rg' -Location 'eastus'

```

### Create virtual network 

A virtual network is needed for the resources that will reside in the backend pool of the gateway load balancer. Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the virtual network. Use [New-AzBastion](/powershell/module/az.network/new-azbastion) to deploy a bastion host for secure management of resources in virtual network.

```azurepowershell-interactive
## Create backend subnet config ##
$subnet = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.1.0.0/24'
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 

## Create Azure Bastion subnet. ##
$bastsubnet = @{
    Name = 'AzureBastionSubnet' 
    AddressPrefix = '10.1.1.0/24'
}
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig @bastsubnet

## Create the virtual network ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'TutorGwLB-rg'
    Location = 'eastus'
    AddressPrefix = '10.1.0.0/16'
    Subnet = $subnetConfig,$bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net

## Create public IP address for bastion host. ##
$ip = @{
    Name = 'myBastionIP'
    ResourceGroupName = 'TutorGwLB-rg'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'Static'
}
$publicip = New-AzPublicIpAddress @ip

## Create bastion host ##
$bastion = @{
    ResourceGroupName = 'TutorGwLB-rg'
    Name = 'myBastion'
    PublicIpAddress = $publicip
    VirtualNetwork = $vnet
}
New-AzBastion @bastion -AsJob

```

## Create gateway load balancer

In this section, you'll create the configuration and deploy the gateway load balancer.





<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
