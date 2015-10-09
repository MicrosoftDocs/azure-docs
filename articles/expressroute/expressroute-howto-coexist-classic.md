<properties
   pageTitle="Configure Expressroute and site-to-site VPN connections that can coexist | Microsoft Azure"
   description="This tutorial walks you through configuring ExpressRoute and a site-to-site VPN connection that can coexist."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="carolz"
   editor=""
   tags="azure-service-management"/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/22/2015"
   ms.author="cherylmc"/>

# Configure ExpressRoute and site-to-site VPN connections to coexist for a VNet

Having the ability to configure site-to-site VPN and ExpressRoute has several advantages. You can configure site-to-site VPN as a secure failover path for ExressRoute, or use site-to-site VPNs to connect to sites that are not part of your network, but that are connected through ExpressRoute. We will cover the steps to configure both scenarios in this article. This article applies to connections created using the classic deployment mode. 

>[AZURE.IMPORTANT] It's important to know that Azure currently works with two deployment models: Resource Manager, and classic. Before you begin your configuration, make sure that you understand the deployment models and tools. For information about the deployment models, see [Azure deployment models](../azure-classic-rm.md)


ExpressRoute circuits must be pre-configured before you follow the instructions below. Make sure that you have followed the guides to [create an ExpressRoute circuit](expressroute-howto-circuit-classic.md) and [configure routing](expressroute-howto-routing-classic.md) before you follow the steps below.

## Limits and limitations

- **Transit routing is not supported:** You cannot route (via Azure) between your local network connected via site-to-site VPN and your local network connected via ExpressRoute.
- **Point-to-site is not supported:** You can't enable point-to-site VPN connections to the same VNet that is connected to ExpressRoute. Point-to-site VPN and ExpressRoute cannot coexist for the same VNet.
- **Only standard or high performance gateways:** You must use a standard or high performance gateway for both the ExpressRoute gateway and the site-to-site VPN gateway. See [Gateway SKUs](../vpn-gateway/vpn-gateway-about-vpngateways.md) for information about gateway SKUs.
- **Static route requirement:** If your local network is connected to both ExpressRoute and a site-to-site VPN, you must have a static route configured in your local network to route the site-to-site VPN connection to the public Internet.
- **ExpressRoute gateway must be configured first:** You must create the ExpressRoute gateway first before you add the site-to-site VPN gateway.

## Configure a site-to-site VPN as a failover path for ExpressRoute

You can configure a site-to-site VPN connection as a backup for ExpressRoute. This applies only to virtual networks linked to the Azure private peering path. There is no VPN-based failover solution for services accessible through Azure public and Microsoft peerings. The ExpressRoute circuit is always the primary link. Data will flow through the site-to-site VPN path only if the ExpressRoute circuit fails. 

![Coexist](media/expressroute-howto-coexist-classic/scenario1.jpg)

## Configure a site-to-site VPN to connect to sites not connected through ExpressRoute

You can configure your network where some sites connect directly to Azure over site-to-site VPN, and some sites connect through ExpressRoute. 

![Coexist](media/expressroute-howto-coexist-classic/scenario2.jpg)

>[AZURE.NOTE] You cannot a configure a virtual network as a transit router.

## Creating and configuring

There are two different sets of procedures to choose from in order to configure connections that can coexist. The configuration procedure that you select will depend on whether you have an existing virtual network that you want to connect to, or you want to create a new virtual network.

- **Create a new virtual network and connections that coexist:**
	
	If you don’t already have a virtual network, this procedure will walk you through creating a new virtual network and creating new ExpressRoute and site-to-site VPN connections. To configure, follow the steps in the article section **Create a new virtual network with both ExpressRoute and site-to-site connectivity**.

- **Configure your existing virtual network for coexisting connections:**

	You may already have a virtual network in place with an existing site-to-site VPN connection or ExpressRoute connection. The **Configure connections that coexist for your existing virtual network** section will walk you through deleting the gateway, and then creating new ExpressRoute and site-to-site VPN connections. Note that when creating the new connections, the steps must be completed in a very specific order. Don't use the instructions in other articles to create your gateways and connections.

	In this procedure, creating connections that can coexist will require you to delete your gateway, and then configure new gateways. This means you will have downtime for your cross-premises connections while you delete and recreate your gateway and connections, but you will not need to migrate any of your VMs or services to a new virtual network. Your VMs and services will still be able to communicate out through the load balancer while you configure your gateway if they are configured to do so.


## Create a new virtual network with both ExpressRoute and site-to-site connectivity

This procedure will walk you through creating a VNet and create site-to-site and ExpressRoute connections that will coexist.

1. Verify that you have the latest version of the PowerShell cmdlets. You can download and install the latest PowerShell cmdlets from the PowerShell section of the [Download page](http://azure.microsoft.com/downloads/).

2. Create a schema for your virtual network. For more information about working with the network configuration file, see [Configure a Virtual Network using a network configuration file](../virtual-network/virtual-networks-create-vnet-classic-portal.md#how-to-create-a-vnet-using-a-network-config-file-in-the-azure-portal). For more information about the configuration schema, see [Azure Virtual Network configuration schema](https://msdn.microsoft.com/library/azure/jj157100.aspx).

	When you create your schema, make sure you use the following values:

	- The gateway subnet for the virtual network must be /27 or a shorter prefix (such as /26 or /25).
	- The gateway connection type is "Dedicated".

		      <VirtualNetworkSite name="MyAzureVNET" Location="Central US">
		        <AddressSpace>
		          <AddressPrefix>10.17.159.192/26</AddressPrefix>
		        </AddressSpace>
		        <Subnets>
		          <Subnet name="Subnet-1">
		            <AddressPrefix>10.17.159.192/27</AddressPrefix>
		          </Subnet>
		          <Subnet name="GatewaySubnet">
		            <AddressPrefix>10.17.159.224/27</AddressPrefix>
		          </Subnet>
		        </Subnets>
		        <Gateway>
		          <ConnectionsToLocalNetwork>
		            <LocalNetworkSiteRef name="MyLocalNetwork">
		              <Connection type="Dedicated" />
		            </LocalNetworkSiteRef>
		          </ConnectionsToLocalNetwork>
		        </Gateway>
		      </VirtualNetworkSite>

3. After creating and configuring your xml schema file, upload the file. This will create your virtual network.

	Use the following cmdlet to upload your file, replacing the value with your own.

		Set-AzureVNetConfig -ConfigurationPath 'C:\NetworkConfig.xml'

4. Create an ExpressRoute gateway. Be sure to specify the GatewaySKU as *Standard* or *HighPerformance* and the GatewayType as *DynamicRouting*.

	Use the following sample, substituting the values for your own.

		New-AzureVNetGateway -VNetName MyAzureVNET -GatewayType DynamicRouting -GatewaySKU HighPerformance

5. Link the ExpressRoute gateway to the ExpressRoute circuit. After this step has been completed, the connection between your on-premises network and Azure, through ExpressRoute, is established.

		New-AzureDedicatedCircuitLink -ServiceKey <service-key> -VNetName MyAzureVNET

6. Next, create your site-to-site VPN gateway. The GatewaySKU must be *Standard* or *HighPerformance* and the GatewayType must be *DynamicRouting*.

		New-AzureVirtualNetworkGateway -VNetName MyAzureVNET -GatewayName S2SVPN -GatewayType DynamicRouting -GatewaySKU  HighPerformance

	To retrieve the virtual network gateway settings, including the gateway ID and the public IP, use the `Get-AzureVirtualNetworkGateway` cmdlet.

		Get-AzureVirtualNetworkGateway

		GatewayId            : 348ae011-ffa9-4add-b530-7cb30010565e
		GatewayName          : S2SVPN
		LastEventData        :
		GatewayType          : DynamicRouting
		LastEventTimeStamp   : 5/29/2015 4:41:41 PM
		LastEventMessage     : Successfully created a gateway for the following virtual network: GNSDesMoines
		LastEventID          : 23002
		State                : Provisioned
		VIPAddress           : 104.43.x.y
		DefaultSite          :
		GatewaySKU           : HighPerformance
		Location             :
		VnetId               : 979aabcf-e47f-4136-ab9b-b4780c1e1bd5
		SubnetId             :
		EnableBgp            : False
		OperationDescription : Get-AzureVirtualNetworkGateway
		OperationId          : 42773656-85e1-a6b6-8705-35473f1e6f6a
		OperationStatus      : Succeeded

7. Create a local site VPN gateway entity. This command doesn’t configure your on-premises VPN gateway. Rather, it allows you to provide the local gateway settings, such as the public IP and the on-premises address space, so that the Azure VPN gateway can connect to it.

	> [AZURE.IMPORTANT] The local site for the site-to-site VPN is not defined in the netcfg. Instead, you must use this cmdlet to specify the local site parameters. You cannot define it using the Management Portal or the netcfg file.

	Use the following sample, replacing the values with your own.

	`New-AzureLocalNetworkGateway -GatewayName MyLocalNetwork -IpAddress <local-network- gateway-public-IP> -AddressSpace <local-network-address-space>`

	**Note:** If your local network has multiple routes, you can pass them all in as an array.  $MyLocalNetworkAddress = @("10.1.2.0/24","10.1.3.0/24","10.2.1.0/24")  


	To retrieve the virtual network gateway settings, including the gateway ID and the public IP, use the `Get-AzureVirtualNetworkGateway` cmdlet. See the following example.

		Get-AzureLocalNetworkGateway

		GatewayId            : 532cb428-8c8c-4596-9a4f-7ae3a9fcd01b
		GatewayName          : MyLocalNetwork
		IpAddress            : 23.39.x.y
		AddressSpace         : {10.1.2.0/24}
		OperationDescription : Get-AzureLocalNetworkGateway
		OperationId          : ddc4bfae-502c-adc7-bd7d-1efbc00b3fe5
		OperationStatus      : Succeeded


8. Configure your local VPN device to connect to the new gateway. Use the information that you retrieved in step 6 when configuring your VPN device. For more information about VPN device configuration, see [VPN Device Configuration](http://go.microsoft.com/fwlink/p/?linkid=615099).

9. Link the site-to-site VPN gateway on Azure to the local gateway.

	In this example, connectedEntityId is the local gateway ID, which you can find by running `Get-AzureLocalNetworkGateway`. You can find virtualNetworkGatewayId by using the `Get-AzureVirtualNetworkGateway` cmdlet. After this step, the connection between your local network and Azure via the site-to-site VPN connection is established.


	`New-AzureVirtualNetworkGatewayConnection -connectedEntityId <local-network-gateway-id> -gatewayConnectionName Azure2Local -gatewayConnectionType IPsec -sharedKey abc123 -virtualNetworkGatewayId <azure-s2s-vpn-gateway-id>`

## Configure connections that coexist for your existing virtual network

If you have an existing virtual network connected via either ExpressRoute or site-to-site VPN connection, in order to enable both connections to connect to the existing virtual network, you must first delete the existing gateway. This means your local premises will lose the connection to your virtual network over the gateway while you are working on this configuration.

**Before you begin configuration:** Verify that you have enough IP addresses left in your virtual network so that you can increase the gateway subnet size.

1. Download the latest version of the PowerShell cmdlets. You can download and install the latest PowerShell cmdlets from the PowerShell section of the [Download page](http://azure.microsoft.com/downloads/).

2. Delete the existing site-to-site VPN gateway. Use the following cmdlet, replacing the values with your own.

	`Remove-AzureVNetGateway –VnetName MyAzureVNET`

2. Export the virtual network schema. Use the following PowerShell cmdlet, replacing the values with your own.

	`Get-AzureVNetConfig –ExportToFile “C:\NetworkConfig.xml”`

3. Edit the network configuration file schema so that the gateway subnet is /27 or a shorter prefix (such as /26 or /25). See the following example. For more information about working with the network configuration file, see [Configure a Virtual Network using a network configuration file](../virtual-network/virtual-networks-create-vnet-classic-portal.md#how-to-create-a-vnet-using-a-network-config-file-in-the-azure-portal). For more information about the configuration schema, see [Azure Virtual Network configuration schema](https://msdn.microsoft.com/library/azure/jj157100.aspx).

          <Subnet name="GatewaySubnet">
            <AddressPrefix>10.17.159.224/27</AddressPrefix>
          </Subnet>

4. If your previous gateway was a site-to-site VPN, you must also change the connection type to **Dedicated**.

		         <Gateway>
		          <ConnectionsToLocalNetwork>
		            <LocalNetworkSiteRef name="MyLocalNetwork">
		              <Connection type="Dedicated" />
		            </LocalNetworkSiteRef>
		          </ConnectionsToLocalNetwork>
		        </Gateway>

5. At this point, you'll have a VNet with no gateways. To create new gateways and complete your connections, you can proceed with **Step 3** in this section of this article, [Create a new virtual network with both ExpressRoute and site-to-site connectivity](#create-a-new-virtual-network-with-both-expressroute-and-site-to-site-connectivity).

## Next steps

For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md)
