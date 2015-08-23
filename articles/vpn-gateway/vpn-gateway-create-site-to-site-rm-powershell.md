<properties
   pageTitle="Create a virtual network with a site-to-site VPN connection using Azure Resource Manager and PowerShell | Microsoft Azure"
   description="Create a site-to-site VPN connection from your virtual network to your on-premises location by using Azure Resource Manager and PowerShell"
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carolz"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/21/2015"
   ms.author="cherylmc"/>

# Create a virtual network with a site-to-site VPN connection using Azure Resource Manager and PowerShell

> [AZURE.SELECTOR]
- [Azure Portal](vpn-gateway-site-to-site-create.md)
- [PowerShell - Resource Manager](vpn-gateway-create-site-to-site-rm-powershell.md)


This topic will walk you through creating an Azure Resource Manager virtual network and a site-to-site VPN connection to your on-premises network. 

Azure currently has two deployment models: the classic deployment model, and the Azure Resource Manager deployment model. The site-to-site setup is different, depending on the model that was used to deploy your virtual network.
These instructions apply to Resource Manager. If you want to create a site-to-site VPN gateway connection using the classic deployment model, see [Create a site-to-site VPN connection in the Management Portal](vpn-gateway-site-to-site-create.md).


## Before you begin

Before you begin, verify that you have the following:

- A compatible VPN device (and someone who is able to configure it). See [About VPN Devices](vpn-gateway-vpn-devices.md).
- An externally-facing public IP address for your VPN device. This IP address cannot be located behind a NAT.
- The latest version of Azure PowerShell cmdlets. You can download and install the latest version from the Windows PowerShell section of the [Download page](http://azure.microsoft.com/downloads/). 
- An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).
	

## Connect to your subscription 


Open your PowerShell console and switch to the Azure Resource Manager mode. Use the following sample to help you connect:

		Add-AzureAccount

Use the Select-AzureSubscription to connect to the subscription that you want to use.

		Select-AzureSubscription "yoursubscription"

Next, switch to the ARM mode. This will switch the mode to allow you to use the ARM cmdlets.

		Switch-AzureMode -Name AzureResourceManager


## Create a virtual network and a gateway subnet

- If you already have a virtual network with a gateway subnet, you can go jump ahead to [Add your local site](#add-your-local-site). 
- If you have a virtual network and you want to add a gateway subnet to your VNet, see [Add a gateway subnet to a VNet](#gatewaysubnet).

### To create a virtual network and a gateway subnet

Use the sample below to create a virtual network and a gateway subnet. Substitute the values for your own. 

First, create a Resource Group:

	
		New-AzureResourceGroup -Name testrg -Location 'West US'

Next, create your virtual network. The sample below creates a virtual network named *testvnet* and two subnets, one called *GatewaySubnet* and the other called *Subnet1*. It's important to create one subnet named specifically *GatewaySubnet*. If you name it something else, your connection configuration will fail.

		$subnet1 = New-AzureVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.0.0/28
		$subnet2 = New-AzureVirtualNetworkSubnetConfig -Name 'Subnet1' -AddressPrefix '10.0.1.0/28'
		New-AzurevirtualNetwork -Name testvnet -ResourceGroupName testrg -Location 'West US' -AddressPrefix 10.0.0.0/16 -Subnet $subnet1, $subnet2


### <a name="gatewaysubnet"></a>To add a gateway subnet to a VNet

If you already have an existing virtual network and you want to add a gateway subnet to it, you can create your gateway subnet by using the sample below. Be sure to name the gateway subnet 'GatewaySubnet'. If you name it something else, your VPN configuration will not work as expected.


	
		$vnet = Get-AzureVirtualNetwork -ResourceGroupName testrg -Name testvnet
		Add-AzureVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/28 -VirtualNetwork $vnet
		Set-AzureVirtualNetwork -VirtualNetwork $vnet

## Add your local site

In a virtual network, the *local site* typically refers to your on-premises location. You'll give that site a name by which Azure can refer to it. 

You'll also specify the address space prefix for the local site. Azure will use the IP address prefix you specify to identify which traffic to send to the local site. This means that you'll have to specify each address prefix that you want to be associated with the local site. You can easily update these prefixes if your on-premises network changes. Use the PowerShell samples below to specify your local site. 

	
- The *GatewayIPAddress* is the IP address of your on-premises VPN device. Your VPN device cannot be located behind a NAT. 
- The *AddressPrefix* is your on-premises address space.

Use this example to add a local site with a single address prefix.

		New-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg -Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix '10.5.51.0/24'

If you want to add a local site with multiple address prefixes, use this example.

		New-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg -Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix @('10.0.0.0/24','20.0.0.0/24')


To add additional address prefixes to a local site that you already created, use the example below.

		$local = Get-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg
		Set-AzureLocalNetworkGateway -LocalNetworkGateway $local -AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24')


To remove an address prefix from a local site, use the example below. Leave out the prefixes that you no longer need. In this example, we no longer need prefix 20.0.0.0/24 (from the previous example), so we will update the local site and exclude that prefix.

		local = Get-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg
		Set-AzureLocalNetworkGateway -LocalNetworkGateway $local -AddressPrefix @('10.0.0.0/24','30.0.0.0/24')


## Request a public IP address for the VNet gateway

Next, you'll request a public IP address to be allocated to your Azure VNet VPN gateway. This is not the same IP address that is assigned to your VPN device, rather it's assigned to the Azure VPN gateway itself. You cannot specify the IP address that you want to use; it is dynamically allocated to your gateway. You'll use this IP address when configuring your on-premises VPN device to connect to the gateway.

Use the PowerShell sample below. The Allocation Method for this address must be Dynamic. 

		$gwpip= New-AzurePublicIpAddress -Name gwpip -ResourceGroupName testrg -Location 'West US' -AllocationMethod Dynamic

## Create the gateway IP addressing configuration

The gateway configuration defines the subnet and the public IP address to use. Use the sample below to create your gateway configuration. 


		$vnet = Get-AzureVirtualNetwork -Name testvnet -ResourceGroupName testrg
		$subnet = Get-AzureVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
		$gwipconfig = New-AzureVirtualNetworkGatewayIpConfig -Name gwipconfig1 -SubnetId $subnet.Id -PublicIpAddressId $gwpip.Id 


## Create the gateway

In this step, you'll create the virtual network gateway. Use the following values:

- The Gateway Type is *Vpn*.
- The VpnType can be RouteBased* (referred to as a Dynamic Gateway in some documentation), or *Policy Based* (referred to as a Static Gateway in some documentation). For more information about VPN gateway types, see [About VPN Gateways](vpn-gateway-about-vpngateways.md). 	

		New-AzureVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg -Location 'West US' -IpConfigurations $gwipconfig -GatewayType Vpn -VpnType RouteBased


## Configure your VPN device

At this point, you'll need the public IP address of the virtual network gateway for configuring your on-premises VPN device. Work with your device manufacturer for specific configuration information. Additionally, refer to the [VPN Devices](http://go.microsoft.com/fwlink/p/?linkid=615099) for more information.

To find the public IP address of your virtual network gateway, use the following sample:

	Get-AzurePublicIpAddress -Name gwpip -ResourceGroupName testrg

## Create the VPN connection

Next, you'll create the site-to-site VPN connection between your virtual network gateway and your VPN device. Be sure to replace the values for your own. The shared key must match the value you used for your VPN device configuration.

		$gateway1 = Get-AzureVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
		$local = Get-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg

		New-AzureVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg -Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'

After a few minutes, the connection should be established. At this time, the site-to-site VPN connections created with Resource Manager are not visible in the Portal.


## Next Steps

Add a virtual machine to your virtual network. [Create a Virtual Machine](../virtual-machines/virtual-machines-windows-tutorial.md).