---
title: Create a private endpoint with a static IP address - PowerShell
titleSuffix: Azure Private Link
description: Learn how to create a private endpoint for an Azure service with a static private IP address.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: how-to
ms.date: 05/12/2022
ms.custom:
---

# Create a private endpoint with a static IP address using PowerShell

 A private endpoint IP address is allocated by DHCP in your virtual network by default. In this article, you'll create a private endpoint with a static IP address.

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure web app with a **PremiumV2-tier** or higher app service plan, deployed in your Azure subscription.  

   - For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    
   - For a detailed tutorial on creating a web app and an endpoint, see [Tutorial: Connect to a web app by using a private endpoint](tutorial-private-endpoint-webapp-portal.md). 
   
   - The example webapp in this article is named **myWebApp**. Replace the example with your webapp name.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install the Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
New-AzResourceGroup -Name 'myResourceGroup' -Location 'eastus'
```

## Create a virtual network and bastion host

A virtual network and subnet is required for to host the private IP address for the private endpoint. You'll create a bastion host to connect securely to the virtual machine to test the private endpoint. You'll create the virtual machine in a later section.

In this section, you'll:

- Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork)

- Create subnet configurations for the backend subnet and the bastion subnet with [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig)

- Create a public IP address for the bastion host with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress)

- Create the bastion host with [New-AzBastion](/powershell/module/az.network/new-azbastion)

```azurepowershell-interactive
## Configure the back-end subnet. ##
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name myBackendSubnet -AddressPrefix 10.0.0.0/24

## Create the Azure Bastion subnet. ##
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig -Name AzureBastionSubnet -AddressPrefix 10.0.1.0/24

## Create the virtual network. ##
$net = @{
    Name = 'MyVNet'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus'
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnetConfig, $bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net

## Create the public IP address for the bastion host. ##
$ip = @{
    Name = 'myBastionIP'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    Zone = 1,2,3
}
$publicip = New-AzPublicIpAddress @ip

## Create the bastion host. ##
$bastion = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myBastion'
    PublicIpAddress = $publicip
    VirtualNetwork = $vnet
}
New-AzBastion @bastion -AsJob
```

## Create a private endpoint

An Azure service that supports private endpoints is required to setup the private endpoint and connection to the virtual network. For the examples in this article, we are using an Azure WebApp from the prerequisites. For more information on the Azure services that support a private endpoint, see [Azure Private Link availability](availability.md).

> [!IMPORTANT]
> You must have a previously deployed Azure WebApp to proceed with the steps in this article. See [Prerequisites](#prerequisites) for more information.

In this section, you'll:

- Create a private link service connection with [New-AzPrivateLinkServiceConnection](/powershell/module/az.network/new-azprivatelinkserviceconnection).

- Create the private endpoint static IP configuration with [New-AzPrivateEndpointIpConfiguration](/powershell/module/az.network/new-azprivateendpointipconfiguration).

- Create the private endpoint with [New-AzPrivateEndpoint](/powershell/module/az.network/new-azprivateendpoint).

```azurepowershell-interactive
## Place the previously created webapp into a variable. ##
$webapp = Get-AzWebApp -ResourceGroupName myResourceGroup -Name myWebApp

## Create the private endpoint connection. ## 
$pec = @{
    Name = 'myConnection'
    PrivateLinkServiceId = $webapp.ID
    GroupID = 'sites'
}
$privateEndpointConnection = New-AzPrivateLinkServiceConnection @pec

## Place the virtual network you created previously into a variable. ##
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'myResourceGroup' -Name 'myVNet'

## Disable the private endpoint network policy. ##
$vnet.Subnets[0].PrivateEndpointNetworkPolicies = "Disabled"
$vnet | Set-AzVirtualNetwork

## Create the static IP configuration. ##
$ip = @{
    Name = 'myIPconfig'
    GroupId = 'sites'
    MemberName = 'sites'
    PrivateIPAddress = '10.0.0.10'
}
$ipconfig = New-AzPrivateEndpointIpConfiguration @ip

## Create the private endpoint. ##
$pe = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myPrivateEndpoint'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
    PrivateLinkServiceConnection = $privateEndpointConnection
    IpConfiguration = $ipconfig
}
New-AzPrivateEndpoint @pe

```

## Configure the private DNS zone

A private DNS zone is used to resolve the DNS name of the private endpoint in the virtual network. For this example, we are using the DNS information for an Azure WebApp, for more information on the DNS configuration of private endpoints, see [Azure Private Endpoint DNS configuration](private-endpoint-dns.md)].

1. Create and configure the private DNS zone by using:

    * [New-AzPrivateDnsZone](/powershell/module/az.privatedns/new-azprivatednszone)
    * [New-AzPrivateDnsVirtualNetworkLink](/powershell/module/az.privatedns/new-azprivatednsvirtualnetworklink)
    * [New-AzPrivateDnsZoneConfig](/powershell/module/az.network/new-azprivatednszoneconfig)
    * [New-AzPrivateDnsZoneGroup](/powershell/module/az.network/new-azprivatednszonegroup)

1. Place the virtual network into a variable:

    ```azurepowershell-interactive
    $vnet = Get-AzVirtualNetwork -ResourceGroupName 'myResourceGroup' -Name 'myVNet'
    ```

1. Create the private DNS zone:

    ```azurepowershell-interactive
    $parameters1 = @{
        ResourceGroupName = 'myResourceGroup'
        Name = 'privatelink.azurewebsites.net'
    }
    $zone = New-AzPrivateDnsZone @parameters1
    ```

1. Create a DNS network link:

    ```azurepowershell-interactive
    $parameters2 = @{
        ResourceGroupName = 'myResourceGroup'
        ZoneName = 'privatelink.azurewebsites.net'
        Name = 'myLink'
        VirtualNetworkId = $vnet.Id
    }
    $link = New-AzPrivateDnsVirtualNetworkLink @parameters2
    ```

1. Configure the DNS zone:

    ```azurepowershell-interactive
    $parameters3 = @{
        Name = 'privatelink.azurewebsites.net'
        PrivateDnsZoneId = $zone.ResourceId
    }
    $config = New-AzPrivateDnsZoneConfig @parameters3
    ```

1. Create the DNS zone group:

    ```azurepowershell-interactive
    $parameters4 = @{
        ResourceGroupName = 'myResourceGroup'
        PrivateEndpointName = 'myPrivateEndpoint'
        Name = 'myZoneGroup'
        PrivateDnsZoneConfig = $config
    }
    New-AzPrivateDnsZoneGroup @parameters4
    ```



<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->


