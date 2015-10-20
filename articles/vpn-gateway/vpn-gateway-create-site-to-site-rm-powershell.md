<properties
   pageTitle="Create a virtual network with a site-to-site VPN connection using Azure Resource Manager and PowerShell | Microsoft Azure"
   description="This article walks you through creating a VNet using the Resource Manager model and connecting it to your local on-premises network using a site-to-site VPN gateway connection. Includes additional steps to modify IP address prefixes for existing local sites."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carolz"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="10/13/2015"
   ms.author="cherylmc"/>

# Create a virtual network with a site-to-site VPN connection using PowerShell

> [AZURE.SELECTOR]
- [Azure Portal](vpn-gateway-site-to-site-create.md)
- [PowerShell - Resource Manager](vpn-gateway-create-site-to-site-rm-powershell.md)

This article will walk you through creating a virtual network and a site-to-site VPN connection to your on-premises network using the Azure Resource Manager deployment model. You can select the article for the deployment model and deployment tool by using the tabs above.

>[AZURE.NOTE] It's important to know that Azure currently works with two deployment models: Resource Manager, and classic. Before you begin your configuration, make sure that you understand the deployment models and tools. For information about the deployment models, see [Azure deployment models](../azure-classic-rm.md).

## Before beginning

Verify that you have the following items before beginning configuration.

- A compatible VPN device and someone who is able to configure it. See [About VPN Devices](vpn-gateway-about-vpn-devices.md).

- An externally-facing public IP address for your VPN device. This IP address cannot be located behind a NAT.

>[AZURE.IMPORTANT] If you aren't familiar with configuring your VPN device, or are unfamiliar with the IP address ranges located on your on-premises network configuration, you will need to coordinate with someone who can provide those details for you.
	
- An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).

- This article is written for Azure PowerShell *0.9.8*. You can download and install this version from the Windows PowerShell section of the [Download page](http://azure.microsoft.com/downloads/). 

	[AZURE.INCLUDE [powershell-preview-include](../includes/include-powershell-preview-include.md)] 
	For information about the Azure PowerShell 1.0 Preview, please see this [blog post](https://azure.microsoft.com/blog/azps-1-0-pre/). For more information about the Azure PowerShell 1.0 Preview cmdlets, see [Azure Resource Manager Cmdlets](https://msdn.microsoft.com/library/mt125356.aspx).


## 1. Connect to your subscription 


Open your PowerShell console and connect to your account. 

**Note:** The instructions below are based on version  0.9.8 of the Azure PowerShell cmdlets.

Use the following sample to help you connect:

		Add-AzureAccount

If you have more than one subscription, use *Select-AzureSubscription* to connect to the subscription that you want to use.

		Select-AzureSubscription "yoursubscription"

Next, switch to the Azure Resource Manager mode. 
		
		Switch-AzureMode -Name AzureResourceManager

## 2. Create a virtual network and a gateway subnet

- If you already have a virtual network with a gateway subnet, you can jump ahead to **Step 3 - Add your local site**. 
- If you already have a virtual network and you want to add a gateway subnet to your VNet, see [Add a gateway subnet to a VNet](#gatewaysubnet).

### To create a virtual network and a gateway subnet

Use the sample below to create a virtual network and a gateway subnet. Substitute the values for your own. 

First, create a resource group:

	
		New-AzureResourceGroup -Name testrg -Location 'West US'

Next, create your virtual network. Verify that the address spaces you specify don't overlap any of the address spaces that you have on your on-premises network.

The sample below creates a virtual network named *testvnet* and two subnets, one called *GatewaySubnet* and the other called *Subnet1*. It's important to create one subnet named specifically *GatewaySubnet*. If you name it something else, your connection configuration will fail. 

		$subnet1 = New-AzureVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.0.0/28
		$subnet2 = New-AzureVirtualNetworkSubnetConfig -Name 'Subnet1' -AddressPrefix '10.0.1.0/28'
		New-AzureVirtualNetwork -Name testvnet -ResourceGroupName testrg -Location 'West US' -AddressPrefix 10.0.0.0/16 -Subnet $subnet1, $subnet2

### <a name="gatewaysubnet"></a>To add a gateway subnet to a VNet (optional)

This step is required only if you need to add a gateway subnet to a VNet.

If you already have an existing virtual network and you want to add a gateway subnet to it, you can create your gateway subnet by using the sample below. Be sure to name the gateway subnet 'GatewaySubnet'. If you name it something else, you'll create a subnet, but it won't be seen by Azure as a gateway subnet.

		$vnet = Get-AzureVirtualNetwork -ResourceGroupName testrg -Name testvnet
		Add-AzureVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/28 -VirtualNetwork $vnet

Now, set the configuration. 

		Set-AzureVirtualNetwork -VirtualNetwork $vnet

## 3. Add your local site

In a virtual network, the *local site* typically refers to your on-premises location. You'll give that site a name by which Azure can refer to it. 

You'll also specify the address space prefix for the local site. Azure will use the IP address prefix you specify to identify which traffic to send to the local site. This means that you'll have to specify each address prefix that you want to be associated with the local site. You can easily update these prefixes if your on-premises network changes. 

When using the PowerShell examples, note the following:
	
- The *GatewayIPAddress* is the IP address of your on-premises VPN device. Your VPN device cannot be located behind a NAT. 
- The *AddressPrefix* is your on-premises address space.

To add a local site with a single address prefix:

		New-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg -Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix '10.5.51.0/24'

To add a local site with multiple address prefixes:

		New-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg -Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix @('10.0.0.0/24','20.0.0.0/24')

### To modify IP address prefixes for your local site

Sometimes your local site prefixes change. The steps you take to modify your IP address prefixes depend on whether or not you have created a VPN gateway connection. See [Modify IP address prefixes for a local site](#to-modify-ip-address-prefixes-for-a-local-site).


## 4. Request a public IP address for the gateway

Next, you'll request a public IP address to be allocated to your Azure VNet VPN gateway. This is not the same IP address that is assigned to your VPN device, rather it's assigned to the Azure VPN gateway itself. You cannot specify the IP address that you want to use; it is dynamically allocated to your gateway. You'll use this IP address when configuring your on-premises VPN device to connect to the gateway.

Use the PowerShell sample below. The Allocation Method for this address must be Dynamic. 

		$gwpip= New-AzurePublicIpAddress -Name gwpip -ResourceGroupName testrg -Location 'West US' -AllocationMethod Dynamic

## 5. Create the gateway IP addressing configuration

The gateway configuration defines the subnet and the public IP address to use. Use the sample below to create your gateway configuration. 


		$vnet = Get-AzureVirtualNetwork -Name testvnet -ResourceGroupName testrg
		$subnet = Get-AzureVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
		$gwipconfig = New-AzureVirtualNetworkGatewayIpConfig -Name gwipconfig1 -SubnetId $subnet.Id -PublicIpAddressId $gwpip.Id 

## 6. Create the gateway

In this step, you'll create the virtual network gateway. Note that that creating a gateway takes a while to complete. 

Use the following values:

- The Gateway Type is *Vpn*.
- The VpnType can be RouteBased* (referred to as a Dynamic Gateway in some documentation), or *Policy Based* (referred to as a Static Gateway in some documentation). For more information about VPN gateway types, see [About VPN Gateways](vpn-gateway-about-vpngateways.md). 	

		New-AzureVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg -Location 'West US' -IpConfigurations $gwipconfig -GatewayType Vpn -VpnType RouteBased

## 7. Configure your VPN device

At this point, you'll need the public IP address of the virtual network gateway for configuring your on-premises VPN device. Work with your device manufacturer for specific configuration information. Additionally, refer to the [VPN Devices](http://go.microsoft.com/fwlink/p/?linkid=615099) for more information.

To find the public IP address of your virtual network gateway, use the following sample:

	Get-AzurePublicIpAddress -Name gwpip -ResourceGroupName testrg

## 8. Create the VPN connection

Next, you'll create the site-to-site VPN connection between your virtual network gateway and your VPN device. Be sure to replace the values for your own. The shared key must match the value you used for your VPN device configuration.

		$gateway1 = Get-AzureVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
		$local = Get-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg

		New-AzureVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg -Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'

After a short while, the connection will be established. 

## 9. Verify a VPN connection

At this time, the site-to-site VPN connections created with Resource Manager are not visible in the Preview Portal. However, it's possible to verify that your connection succeeded by using *Get-AzureVirtualNetworkGatewayConnection –Debug*. In the future, we'll have a cmdlet for this, as well as the ability to view your connection in the Preview Portal.

You can use the following cmdlet example, configuring the values to match your own. When prompted, select *A* in order to run All.

		Get-AzureVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg -Debug

 After the cmdlet has finished, scroll through to view the values. In the example below, the connection status shows as *Connected* and you can see ingress and egress bytes.

	Body:
	{
	  "name": "localtovon",
	  "id":
	"/subscriptions/086cfaa0-0d1d-4b1c-9455-f8e3da2a0c7789/resourceGroups/testrg/providers/Microsoft.Network/connections/loca
	ltovon",
	  "properties": {
	    "provisioningState": "Succeeded",
	    "resourceGuid": "1c484f82-23ec-47e2-8cd8-231107450446b",
	    "virtualNetworkGateway1": {
	      "id":
	"/subscriptions/086cfaa0-0d1d-4b1c-9455-f8e3da2a0c7789/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworkGa
	teways/vnetgw1"
	    },
	    "localNetworkGateway2": {
	      "id":
	"/subscriptions/086cfaa0-0d1d-4b1c-9455-f8e3da2a0c7789/resourceGroups/testrg/providers/Microsoft.Network/localNetworkGate
	ways/LocalSite"
	    },
	    "connectionType": "IPsec",
	    "routingWeight": 10,
	    "sharedKey": "abc123",
	    "connectionStatus": "Connected",
	    "ingressBytesTransferred": 33509044,
	    "egressBytesTransferred": 4142431
	  }


## To Modify IP address prefixes for a local site

If you need to change the prefixes for your local site, use the instructions below.  Two sets of instructions are provided and depend on whether you have already created your VPN gateway connection. 

### Add or remove prefixes without a VPN gateway connection


- **To add** additional address prefixes to a local site that you created, but that doesn't yet have a VPN gateway connection, use the example below.

		$local = Get-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg
		Set-AzureLocalNetworkGateway -LocalNetworkGateway $local -AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24')


- **To remove** an address prefix from a local site that doesn't have a VPN connection, use the example below. Leave out the prefixes that you no longer need. In this example, we no longer need prefix 20.0.0.0/24 (from the previous example), so we will update the local site and exclude that prefix.

		local = Get-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg
		Set-AzureLocalNetworkGateway -LocalNetworkGateway $local -AddressPrefix @('10.0.0.0/24','30.0.0.0/24')

### Add or remove prefixes with a VPN gateway connection

If you have created your VPN connection and want to add or remove the IP address prefixes contained in your local site, you'll need to do the following steps in order. This will result in some downtime for your VPN connection, as you will need to remove and rebuild the gateway.  However, because you have requested an IP address for the connection, you won't need to re-configure your on-premises VPN router unless you decide to change the values you previously used.

 
1. Remove the gateway connection. 
2. Modify the prefixes for your local site. 
3. Create a new gateway connection. 

You can use the following sample as a guideline.


		$gateway1 = Get-AzureVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
		$local = Get-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg

		remove-AzureVirtualNetworkGatewayConnection -Name vnetgw1 -ResourceGroupName testrg

		$local = Get-AzureLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg
		Set-AzureLocalNetworkGateway -LocalNetworkGateway $local -AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24')
	

		New-AzureVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg -Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'


## Next steps

Add a virtual machine to your virtual network. [Create a Virtual Machine](../virtual-machines/virtual-machines-windows-tutorial.md).