<properties
   pageTitle="Configure Expressroute and Site-to-Site VPN connections that can coexist for the Resource Manager deployment model | Microsoft Azure"
   description="This article walks you through configuring ExpressRoute and a Site-to-Site VPN connection that can coexist for Resource Manager model."
   documentationCenter="na"
   services="expressroute"
   authors="charwen"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/19/2016"
   ms.author="charleywen"/>

# Configure ExpressRoute and Site-to-Site coexisting connections for the Resource Manager deployment model

> [AZURE.SELECTOR]
- [PowerShell - Resource Manager](expressroute-howto-coexist-resource-manager.md)
- [PowerShell - Classic](expressroute-howto-coexist-classic.md)

Having the ability to configure Site-to-Site VPN and ExpressRoute has several advantages. You can configure Site-to-Site VPN as a secure failover path for ExressRoute, or use Site-to-Site VPNs to connect to sites that are not connected through ExpressRoute. We will cover the steps to configure both scenarios in this article. This article applies to the Resource Manager deployment model. This configuration is not available in the Azure portal.


**About Azure deployment models**

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

>[AZURE.IMPORTANT] ExpressRoute circuits must be pre-configured before you follow the instructions below. Make sure that you have followed the guides to [create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and [configure routing](expressroute-howto-routing-arm.md) before you follow the steps below.

## Limits and limitations

- **Transit routing is not supported:** You cannot route (via Azure) between your local network connected via Site-to-Site VPN and your local network connected via ExpressRoute.
- **Forced tunneling cannot be enabled on the Site-to-Site VPN gateway:** You can only "force" all Internet-bound traffic back to your on-premises network via ExpressRoute. 
- **Only standard or high performance gateways:** You must use a standard or high performance gateway for both the ExpressRoute gateway and the Site-to-Site VPN gateway. See [Gateway SKUs](../vpn-gateway/vpn-gateway-about-vpngateways.md) for information about gateway SKUs.
- **Only route-based VPN gateway:** You must use a route-based VPN gateway. See [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) for information about the route-based VPN gateway.
- **Static route requirement:** If your local network is connected to both ExpressRoute and a Site-to-Site VPN, you must have a static route configured in your local network to route the Site-to-Site VPN connection to the public Internet.
- **ExpressRoute gateway must be configured first:** You must create the ExpressRoute gateway first before you add the Site-to-Site VPN gateway.


## Configuration designs

### Configure a Site-to-Site VPN as a failover path for ExpressRoute

You can configure a Site-to-Site VPN connection as a backup for ExpressRoute. This applies only to virtual networks linked to the Azure private peering path. There is no VPN-based failover solution for services accessible through Azure public and Microsoft peerings. The ExpressRoute circuit is always the primary link. Data will flow through the Site-to-Site VPN path only if the ExpressRoute circuit fails. 

![Coexist](media/expressroute-howto-coexist-resource-manager/scenario1.jpg)

### Configure a Site-to-Site VPN to connect to sites not connected through ExpressRoute

You can configure your network where some sites connect directly to Azure over Site-to-Site VPN, and some sites connect through ExpressRoute. 

![Coexist](media/expressroute-howto-coexist-resource-manager/scenario2.jpg)

>[AZURE.NOTE] You cannot a configure a virtual network as a transit router.

## Selecting the steps to use

There are two different sets of procedures to choose from in order to configure connections that can coexist. The configuration procedure that you select will depend on whether you have an existing virtual network that you want to connect to, or you want to create a new virtual network.


- I don't have a VNet and need to create one.
	
	If you don’t already have a virtual network, this procedure will walk you through creating a new virtual network using Resource Manager deployment model and creating new ExpressRoute and Site-to-Site VPN connections. To configure, follow the steps in the article section [To create a new virtual network and coexisting connections](#new).

- I already have a Resource Manager deployment model VNet.

	You may already have a virtual network in place with an existing Site-to-Site VPN connection or ExpressRoute connection. The [To configure coexsiting connections for an already existing VNet](#add) section will walk you through deleting the gateway, and then creating new ExpressRoute and Site-to-Site VPN connections. Note that when creating the new connections, the steps must be completed in a very specific order. Don't use the instructions in other articles to create your gateways and connections.

	In this procedure, creating connections that can coexist will require you to delete your gateway, and then configure new gateways. This means you will have downtime for your cross-premises connections while you delete and recreate your gateway and connections, but you will not need to migrate any of your VMs or services to a new virtual network. Your VMs and services will still be able to communicate out through the load balancer while you configure your gateway if they are configured to do so.


## <a name="new"></a>To create a new virtual network and coexisting connections

This procedure will walk you through creating a VNet and create Site-to-Site and ExpressRoute connections that will coexist.
	
1. You'll need to install the latest version of the Azure PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets. Note that the cmdlets that you'll use for this configuration may be slightly different than what you might be familiar with. Be sure to use the cmdlets specified in these instructions.

2. Login your account and set up the environment.
	
		login-AzureRmAccount
		Select-AzureRmSubscription -SubscriptionName 'yoursubscription'
		$location = "Central US"
		$resgrp = New-AzureRmResourceGroup -Name "ErVpnCoex" -Location $location

3. Create a virtual network including Gateway Subnet. For more information about the virtual network configuration, see [Azure Virtual Network configuration](../virtual-network/virtual-networks-create-vnet-arm-ps.md).

	>[AZURE.IMPORTANT] The Gateway Subnet must be /27 or a shorter prefix (such as /26 or /25).
	
	Create a new VNet.

		$vnet = New-AzureRmVirtualNetwork -Name "CoexVnet" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -AddressPrefix "10.200.0.0/16" 

	Add subnets.

		Add-AzureRmVirtualNetworkSubnetConfig -Name "App" -VirtualNetwork $vnet -AddressPrefix "10.200.1.0/24"
		Add-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet -AddressPrefix "10.200.255.0/24"

	Save the VNet configuration.

		$vnet = Set-AzureRmVirtualNetwork -VirtualNetwork $vnet

4. <a name="gw"></a>Create an ExpressRoute gateway. For more information about the ExpressRoute gateway configuration, see [ExpressRoute gateway configuration](expressroute-howto-add-gateway-resource-manager.md). The GatewaySKU must be *Standard* or *HighPerformance*.

		$gwSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet
		$gwIP = New-AzureRmPublicIpAddress -Name "ERGatewayIP" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -AllocationMethod Dynamic
		$gwConfig = New-AzureRmVirtualNetworkGatewayIpConfig -Name "ERGatewayIpConfig" -SubnetId $gwSubnet.Id -PublicIpAddressId $gwIP.Id
		$gw = New-AzureRmVirtualNetworkGateway -Name "ERGateway" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -IpConfigurations $gwConfig -GatewayType "ExpressRoute" -GatewaySku Standard 

5. Link the ExpressRoute gateway to the ExpressRoute circuit. After this step has been completed, the connection between your on-premises network and Azure, through ExpressRoute, is established. For more information about the link operation, see [Link VNets to ExpressRoute](expressroute-howto-linkvnet-arm.md).

		$ckt = Get-AzureRmExpressRouteCircuit -Name "YourCircuit" -ResourceGroupName "YourCircuitResourceGroup"
		New-AzureRmVirtualNetworkGatewayConnection -Name "ERConnection" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -VirtualNetworkGateway1 $gw -PeerId $ckt.Id -ConnectionType ExpressRoute

6. <a name="vpngw"></a>Next, create your Site-to-Site VPN gateway. For more information about the VPN gateway configuration, see [Configure a VNet to VNet connection](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md). The GatewaySKU must be *Standard* or *HighPerformance*. The VpnType must *RouteBased*.

		$gwSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet
		$gwIP = New-AzureRmPublicIpAddress -Name "VPNGatewayIP" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -AllocationMethod Dynamic
		$gwConfig = New-AzureRmVirtualNetworkGatewayIpConfig -Name "VPNGatewayIpConfig" -SubnetId $gwSubnet.Id -PublicIpAddressId $gwIP.Id
		New-AzureRmVirtualNetworkGateway -Name "VPNGateway" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -IpConfigurations $gwConfig -GatewayType "Vpn" -VpnType "RouteBased" -GatewaySku "Standard"

7. Create a local site VPN gateway entity. This command doesn’t configure your on-premises VPN gateway. Rather, it allows you to provide the local gateway settings, such as the public IP and the on-premises address space, so that the Azure VPN gateway can connect to it. 
	>[AZURE.NOTE] If your local network has multiple routes, you can pass them all in as an array.  $MyLocalNetworkAddress = @("10.100.0.0/16","10.101.0.0/16","10.102.0.0/16")  

		$localVpn = New-AzureRmLocalNetworkGateway -Name "LocalVPNGateway" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -GatewayIpAddress *<Public IP>* -AddressPrefix '10.100.0.0/16'

8. Configure your local VPN device to connect to the new Azure VPN gateway. For more information about VPN device configuration, see [VPN Device Configuration](../vpn-gateway/vpn-gateway-about-vpn-devices.md).

9. Link the Site-to-Site VPN gateway on Azure to the local gateway.

		$azureVpn = Get-AzureRmVirtualNetworkGateway -Name "VPNGateway" -ResourceGroupName $resgrp.ResourceGroupName
		New-AzureRmVirtualNetworkGatewayConnection -Name "VPNConnection" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -VirtualNetworkGateway1 $azureVpn -LocalNetworkGateway2 $localVpn -ConnectionType IPsec -SharedKey <yourkey>


## <a name="add"></a>To configure coexsiting connections for an already existing VNet

If you have an existing virtual network, check the gateway subnet size. If the gateway subnet is /28 or /29, you must first delete the virtual network gateway and increase the gateway subnet size. The steps in this section will show you how to do that.

If the gateway subnet is /27 or larger and the virtual network is connected via ExpressRoute, you can skip the steps below and proceed to ["Step 6 - Create a Site-to-Site VPN gateway"](#vpngw) in the previous section. 

>[AZURE.NOTE] When you delete the existing gateway, your local premises will lose the connection to your virtual network while you are working on this configuration. 

1. You'll need to install the latest version of the Azure PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets. Note that the cmdlets that you'll use for this configuration may be slightly different than what you might be familiar with. Be sure to use the cmdlets specified in these instructions. 

2. Delete the existing ExpressRoute or Site-to-Site VPN gateway. 

		Remove-AzureRmVirtualNetworkGateway -Name <yourgatewayname> -ResourceGroupName <yourresourcegroup>

3. Delete Gateway Subnet.
		
		$vnet = Get-AzureRmVirtualNetwork -Name <yourvnetname> -ResourceGroupName <yourresourcegroup> 
		Remove-AzureRmVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet

4. Add a Gateway Subnet that is /27 or larger.
	>[AZURE.NOTE] If you don't have enough IP addresses left in your virtual network to increase the gateway subnet size, you need to add more IP address space.

		$vnet = Get-AzureRmVirtualNetwork -Name <yourvnetname> -ResourceGroupName <yourresourcegroup>
		Add-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet -AddressPrefix "10.200.255.0/24"

	Save the VNet configuration.

		$vnet = Set-AzureRmVirtualNetwork -VirtualNetwork $vnet

5. At this point, you'll have a VNet with no gateways. To create new gateways and complete your connections, you can proceed with [Step 4 - Create an ExpressRoute gateway](#gw), found in the preceding set of steps.

## To add point-to-site configuration to the VPN gateway
You can follow the steps below to add Point-to-Site configuration to your VPN gateway in a co-existence setup.

1. Add VPN Client address pool. 

		$azureVpn = Get-AzureRmVirtualNetworkGateway -Name "VPNGateway" -ResourceGroupName $resgrp.ResourceGroupName
		Set-AzureRmVirtualNetworkGatewayVpnClientConfig -VirtualNetworkGateway $azureVpn -VpnClientAddressPool "10.251.251.0/24"

2. Upload the VPN root certificate to Azure for your VPN gateway. In this example, it's assumed that the root certificate is stored in the local machine where the following PowerShell cmdlets are run. 

		$p2sCertFullName = "RootErVpnCoexP2S.cer"
		$p2sCertMatchName = "RootErVpnCoexP2S"
		$p2sCertToUpload=get-childitem Cert:\CurrentUser\My | Where-Object {$_.Subject -match $p2sCertMatchName}
		if ($p2sCertToUpload.count -eq 1){
		    write-host "cert found"
		} else {
		    write-host "cert not found"
		    exit
		} 
		$p2sCertData = [System.Convert]::ToBase64String($p2sCertToUpload.RawData)
		Add-AzureRmVpnClientRootCertificate -VpnClientRootCertificateName $p2sCertFullName -VirtualNetworkGatewayname $azureVpn.Name -ResourceGroupName $resgrp.ResourceGroupName -PublicCertData $p2sCertData

For more information on Point-to-Site VPN, see [Configure a Point-to-Site connection](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md).

## Next steps

For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
