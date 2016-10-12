<properties
   pageTitle="Create a virtual network with a Site-to-Site VPN connection using Azure Resource Manager and PowerShell | Microsoft Azure"
   description="This article walks you through creating a VNet using the Resource Manager deployment model and connecting it to your local on-premises network using a S2S VPN gateway connection."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/31/2016"
   ms.author="cherylmc"/>

# Create a VNet with a Site-to-Site connection using PowerShell

> [AZURE.SELECTOR]
- [Resource Manager - Azure Portal](vpn-gateway-howto-site-to-site-resource-manager-portal.md)
- [Resource Manager - PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md)
- [Classic - Classic Portal](vpn-gateway-site-to-site-create.md)

This article walks you through creating a virtual network and a Site-to-Site VPN connection to your on-premises network using the **Azure Resource Manager deployment model**. Site-to-Site connections can be used for cross-premises and hybrid configurations.

![Site-to-Site diagram](./media/vpn-gateway-create-site-to-site-rm-powershell/s2srmps.png "site-to-site") 


### Deployment models and tools for Site-to-Site connections

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)]

[AZURE.INCLUDE [vpn-gateway-table-site-to-site](../../includes/vpn-gateway-table-site-to-site-include.md)]

If you want to connect VNets together, but are not creating a connection to an on-premises location, see [Configure a VNet-to-VNet connection](vpn-gateway-vnet-vnet-rm-ps.md).


## Before you begin

Verify that you have the following items before beginning configuration.

- A compatible VPN device and someone who is able to configure it. See [About VPN Devices](vpn-gateway-about-vpn-devices.md). If you aren't familiar with configuring your VPN device, or are unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you.

- An externally facing public IP address for your VPN device. This IP address cannot be located behind a NAT.
	
- An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
	
- The latest version of the Azure Resource Manager PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets.


## 1. Connect to your subscription 

Make sure you switch to PowerShell mode to use the Resource Manager cmdlets. For more information, see [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

Open your PowerShell console and connect to your account. Use the following sample to help you connect:

	Login-AzureRmAccount

Check the subscriptions for the account.

	Get-AzureRmSubscription 

Specify the subscription that you want to use.

	Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"

## 2. Create a virtual network and a gateway subnet

The examples use a gateway subnet of /28. While it is possible to create a gateway subnet as small as /29, we recommend that you create a larger subnet that includes more addresses by selecting at least /28 or /27. This will allow for enough addresses to accommodate possible additional configurations that you may want in the future.

If you already have a virtual network with a gateway subnet that is /29 or larger, you can jump ahead to [Add your local network gateway](#localnet).


[AZURE.INCLUDE [vpn-gateway-no-nsg](../../includes/vpn-gateway-no-nsg-include.md)]  

### To create a virtual network and a gateway subnet

Use the following sample to create a virtual network and a gateway subnet. Substitute the values for your own. 

First, create a resource group:
	
	New-AzureRmResourceGroup -Name testrg -Location 'West US'

Next, create your virtual network. Verify that the address spaces you specify don't overlap any of the address spaces that you have on your on-premises network.

The following sample creates a virtual network named *testvnet* and two subnets, one called *GatewaySubnet* and the other called *Subnet1*. It's important to create one subnet named specifically *GatewaySubnet*. If you name it something else, your connection configuration will fail. 

Set the variables.

	$subnet1 = New-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.0.0/28
	$subnet2 = New-AzureRmVirtualNetworkSubnetConfig -Name 'Subnet1' -AddressPrefix '10.0.1.0/28'

Create the VNet.

	New-AzureRmVirtualNetwork -Name testvnet -ResourceGroupName testrg `
	-Location 'West US' -AddressPrefix 10.0.0.0/16 -Subnet $subnet1, $subnet2

### <a name="gatewaysubnet"></a>To add a gateway subnet to a virtual network you have already created

This step is required only if you need to add a gateway subnet to a VNet that you previously created.

You can create your gateway subnet by using the following sample. Be sure to name the gateway subnet 'GatewaySubnet'. If you name it something else, you create a subnet, but Azure won't treat it as a gateway subnet.

Set the variables.

	$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName testrg -Name testvnet

Create the gateway subnet.

	Add-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/28 -VirtualNetwork $vnet

Set the configuration. 

	Set-AzureRmVirtualNetwork -VirtualNetwork $vnet

## 3. <a name="localnet"></a>Add your local network gateway

In a virtual network, the local network gateway typically refers to your on-premises location. You give the site a name by which Azure can refer to it, and also specify the address space prefix for the local network gateway. 

Azure uses the IP address prefix you specify to identify which traffic to send to your on-premises location. This means that you have to specify each address prefix that you want to be associated with your local network gateway. You can easily update these prefixes if your on-premises network changes. 

When using the PowerShell examples, note the following:
	
- The *GatewayIPAddress* is the IP address of your on-premises VPN device. Your VPN device cannot be located behind a NAT. 
- The *AddressPrefix* is your on-premises address space.

To add a local network gateway with a single address prefix:

	New-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg `
	-Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix '10.5.51.0/24'

To add a local network gateway with multiple address prefixes:

	New-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg `
	-Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix @('10.0.0.0/24','20.0.0.0/24')

### To modify IP address prefixes for your local network gateway

Sometimes your local network gateway prefixes change. The steps you take to modify your IP address prefixes depend on whether you have created a VPN gateway connection. See the [Modify IP address prefixes for a local network gateway](#modify) section of this article.


## 4. Request a public IP address for the VPN gateway

Next, request a public IP address to be allocated to your Azure VNet VPN gateway. This is not the same IP address that is assigned to your VPN device; rather it's assigned to the Azure VPN gateway itself. You can't specify the IP address that you want to use. It is dynamically allocated to your gateway. You use this IP address when configuring your on-premises VPN device to connect to the gateway.

The Azure VPN gateway for the Resource Manager deployment model currently only supports public IP addresses by using the Dynamic Allocation method. However, this does not mean the IP address will change. The only time the Azure VPN gateway IP address changes is when the gateway is deleted and re-created. The gateway public IP address won't change across resizing, resetting, or other internal maintenance/upgrades of your Azure VPN gateway.

Use the following PowerShell sample:

	$gwpip= New-AzureRmPublicIpAddress -Name gwpip -ResourceGroupName testrg -Location 'West US' -AllocationMethod Dynamic

## 5. Create the gateway IP addressing configuration

The gateway configuration defines the subnet and the public IP address to use. Use the following sample to create your gateway configuration.

	$vnet = Get-AzureRmVirtualNetwork -Name testvnet -ResourceGroupName testrg
	$subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
	$gwipconfig = New-AzureRmVirtualNetworkGatewayIpConfig -Name gwipconfig1 -SubnetId $subnet.Id -PublicIpAddressId $gwpip.Id 

## 6. Create the virtual network gateway

In this step, you create the virtual network gateway. Creating a gateway can take a long time to complete. Often 45 minutes or more. 

Use the following values:

- The *-GatewayType* for a Site-to-Site configuration is *Vpn*. The gateway type is always specific to the configuration that you are implementing. For example, other gateway configurations may require -GatewayType ExpressRoute. 

- The *-VpnType* can be *RouteBased* (referred to as a Dynamic Gateway in some documentation), or *PolicyBased* (referred to as a Static Gateway in some documentation). For more information about VPN gateway types, see [About VPN Gateways](vpn-gateway-about-vpngateways.md#vpntype).
- The *-GatewaySku* can be *Basic*, *Standard*, or *HighPerformance*. 	

		New-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg `
		-Location 'West US' -IpConfigurations $gwipconfig -GatewayType Vpn `
		-VpnType RouteBased -GatewaySku Standard

## 7. Configure your VPN device

At this point, you need the public IP address of the virtual network gateway for configuring your on-premises VPN device. Work with your device manufacturer for specific configuration information. Refer to the [VPN Devices](vpn-gateway-about-vpn-devices.md) for more information.

To find the public IP address of your virtual network gateway, use the following sample:

	Get-AzureRmPublicIpAddress -Name gwpip -ResourceGroupName testrg

## 8. Create the VPN connection

Next, create the Site-to-Site VPN connection between your virtual network gateway and your VPN device. Be sure to replace the values with your own. The shared key must match the value you used for your VPN device configuration. Notice that the `-ConnectionType` for Site-to-Site is *IPsec*. 

Set the variables.

	$gateway1 = Get-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
	$local = Get-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg

Create the connection.

	New-AzureRmVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg `
	-Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local `
	-ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'

After a short while, the connection will be established. 

## <a name="toverify"></a>To verify a VPN connection

There are a few different ways to verify your VPN connection.

[AZURE.INCLUDE [vpn-gateway-verify-connection-rm](../../includes/vpn-gateway-verify-connection-rm-include.md)]

## <a name="modify"></a>To modify IP address prefixes for a local network gateway

If you need to change the prefixes for your local network gateway, use the following instructions. Two sets of instructions are provided. The instructions you choose depend on whether you have already created your gateway connection. 

[AZURE.INCLUDE [vpn-gateway-modify-ip-prefix-rm](../../includes/vpn-gateway-modify-ip-prefix-rm-include.md)]

## <a name="modifygwipaddress"></a>To modify the gateway IP address for a local network gateway

[AZURE.INCLUDE [vpn-gateway-modify-lng-gateway-ip-rm](../../includes/vpn-gateway-modify-lng-gateway-ip-rm-include.md)]

## Next steps

- You can add virtual machines to your virtual networks. See [Create a Virtual Machine](../virtual-machines/virtual-machines-windows-hero-tutorial.md) for steps.

- For information about BGP, see the [BGP Overview](vpn-gateway-bgp-overview.md) and [How to configure BGP](vpn-gateway-bgp-resource-manager-ps.md).

