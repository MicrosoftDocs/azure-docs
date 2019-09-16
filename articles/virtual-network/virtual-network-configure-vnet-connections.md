---
title: Configure and validate virtual network or VPN connections
description: Step-by-step guidance to configure and validate various Azure VPN and virtual network deployments
services: virtual-network
documentationcenter: na
author: v-miegge
manager: dcscontentpm
editor: ''

ms.assetid: 0433a4f4-b5a0-476d-b398-1506c57eafa2
ms.service: virtual-network
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/28/2019
ms.author: kaushika

---

# Configure and validate virtual network or VPN connections

This guided walkthrough provides step-by-step guidance to configure and validate various Azure VPN and virtual network deployments. Scenarios include transit routing, network-to-network, BGP, multisite, and point-to-site.

Azure VPN gateways enable flexibility in arranging almost any kind of connected virtual network topology in Azure. For example, you can connect virtual networks:

- Across regions.
- Between virtual network types (Azure Resource Manager versus classic).
- Within Azure or within an on-premises hybrid environment.
- In different subscriptions. 

## Network-to-network VPN connection

Connecting a virtual network to another virtual network (network-to-network) via VPN is similar to connecting a virtual network to an on-premises site location. Both connectivity types use a VPN gateway to provide a secure tunnel through IPsec and IKE. The virtual networks can be in the same or different regions, and from the same or different subscriptions.

![Network-to-network connection with IPsec](./media/virtual-network-configure-vnet-connections/4034386_en_2.png)
 
If your virtual networks are in the same region, you might want to consider connecting them by using virtual network peering. Virtual network peering doesn't use a VPN gateway. It increases throughput and decreases latency. To configure a virtual network peering connection, select **Configure and validate VNet Peering**.

If your virtual networks were created through the Azure Resource Manger deployment model, select **Configure and validate a Resource Manager VNet to a Resource Manager VNet connection** to configure a VPN connection.

If one of the virtual networks was created through the Azure classic deployment model, and the other was created through Resource Manager, select **Configure and validate a classic VNet to a Resource Manager VNet connection** to configure a VPN connection.

### Configure virtual network peering for two virtual networks in the same region

Before you start the implementation of Azure virtual network peering, make sure that you meet the following pre-requisites to configure virtual network peering:

* The peered virtual networks must exist in the same Azure region.
* The peered virtual networks must have nonoverlapping IP address spaces.
* Virtual network peering is between two virtual networks. There's no derived transitive relationship across peerings. For example, if VNetA is peered with VNetB, and VNetB is peered with VNetC, VNetA is *not* peered to VNetC.

When you meet the requirements, you can follow [Create a virtual network peering tutorial](https://docs.microsoft.com/azure/virtual-network/virtual-network-create-peering) to create and configure the virtual network peering.

To check the virtual network peering configuration, use the following method:

1. Sign-in to the [Azure portal](https://portal.azure.com/) with an account that has the necessary [roles and permissions](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering#roles-permissions).
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, select it.
3. In the **Virtual networks** blade that appears, select the virtual network you want to create a peering for.
4. In the pane that appears for the virtual network you selected, select **Peerings** in the **Settings** section.
5. Select the peering you want to check the configuration.

![Selections for checking the virtual network peering configuration](./media/virtual-network-configure-vnet-connections/4034496_en_1.png)
 
Using Azure Powershell, run the command [Get-AzureRmVirtualNetworkPeering](https://docs.microsoft.com/powershell/module/azurerm.network/get-azurermvirtualnetworkpeering?view=azurermps-4.1.0) to get the virtual network peering, for an example:

```
PS C:\Users\User1> Get-AzureRmVirtualNetworkPeering -VirtualNetworkName Vnet10-01 -ResourceGroupName dev-vnets
Name                             : LinkToVNET10-02
Id                               : /subscriptions/GUID/resourceGroups/dev-vnets/providers/Microsoft.Network/virtualNetworks/VNET10-01/virtualNetworkPeerings/LinkToVNET10-0
2
Etag                             : W/"GUID"
ResourceGroupName                : dev-vnets
VirtualNetworkName               : vnet10-01
ProvisioningState                : Succeeded
RemoteVirtualNetwork             : {
                                  "Id": "/subscriptions/GUID/resourceGroups/DEV-VNET
                                   s/providers/Microsoft.Network/virtualNetworks/VNET10-02"
                                   }
AllowVirtualNetworkAccess        : True
AllowForwardedTraffic            : False
AllowGatewayTransit              : False
UseRemoteGateways                : False
RemoteGateways                   : null
RemoteVirtualNetworkAddressSpace : null
```

### Connect a Resource Manager virtual network to another Resource Manager virtual network

You can configure a connection from one Resource Manager virtual network to another Resource Manager virtual network directly, or configure the connection with IPsec.

### Configure a VPN connection between Resource Manager virtual networks

To configure a connection between Resource Manager virtual networks without IPsec, see [Configure a network-to-network VPN gateway connection using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal).

To configure a connection with IPsec between two Resource Manager virtual networks, follow the steps 1-5 in [Create a site-to-site connection in the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal) for each virtual network.

> [!Note]
> These steps work only for virtual networks in the same subscription. If your virtual networks are in different subscriptions, you must use PowerShell to make the connection. See the [PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-vnet-vnet-rm-ps) article.

### Validate the VPN connection between Resource Manager virtual networks

![Classic virtual network connection to Azure Resource Manager virtual network](./media/virtual-network-configure-vnet-connections/4034493_en_2.png)

To check your VPN connection is configured correctly, follow these instructions:

1. Make sure there are no overlapping address spaces in the connected virtual networks.
2. Verify that the Azure Resource Manager virtual network address range is defined accurately in **Connection object**.
3. Verify that the Azure Resource Manager virtual network address range is defined accurately in **Connection object**.
4. Verify that the pre-shared keys are matching on the connection objects.
5. Verify that the Azure Resource Manager virtual ntwork gateway VIP is defined accurately in **Connection object**.
6. Verify that the Azure Resource Manager virtual network gateway VIP is defined accurately in **Connection object**.

### Connect a classic virtual network to a Resource Manager virtual network

You can create a connection between virtual networks that are in different subscriptions and in different regions. You can also connect virtual networks that already have connections to on-premises networks, as long as you have configured the gateway type as route-based.

To configure a connection between a classic virtual network and a Resource Manager virtual network, see [Connect virtual networks from different deployment models using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-connect-different-deployment-models-portal) for more information.

![Classic virtual network connection to Azure Resource Manager virtual network](./media/virtual-network-configure-vnet-connections/4034389_en_2.png)

To check the configuration when connect a classic virtual network to an Azure Resource Manager virtual network, follow these instructions:

1. Make sure there are no overlapping address spaces in the connected virtual networks.
2. Verify that the Azure Resource Manager virtual network address range is defined accurately in the classic local network definition.
3. Verify that the classic virtual network address range is defined accurately in the Azure Resource Manager **Connection object**.
4. Verify that the classic virtual network gateway VIP is defined accurately in the Azure Resource Manager **Connection object**.
5. Verify that the Azure Resource Manager virtual network gateway is defined accurately in the classic **Local Network Definition**.
6. Verify that the pre-shared keys are matching on both connected virtual networks:
   1. Classic virtual network: Local Network Definition
   2. Azure Resource Manager virtual network: Connection Object

## Create a point-to-site VPN connection

A Point-to-site (P2S) configuration lets you create a secure connection from an individual client computer to a virtual network. Point-to-site connections are useful when you want to connect to your virtual network from a remote location, such as from home or a conference, or when you only have a few clients that need to connect to a virtual network. 

The P2S VPN connection is initiated from the client computer using the native Windows VPN client. Connecting clients use certificates to authenticate.

![Point-to-site connection](./media/virtual-network-configure-vnet-connections/4034387_en_3.png)

Point-to-site connections don't require a VPN device. P2S creates the VPN connection over SSTP (Secure Socket Tunneling Protocol). You can connect a point-to-site connection to a virtual network by using a different deployment tools and deployment models:

* [Configure a point-to-site connection to a virtual network using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal)
* [Configure a point-to-site connection to a virtual network using the Azure portal (classic)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-classic-azure-portal)
* [Configure a point-to-site connection to a virtual network using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps)

### Validate your point-to-site connection

The article [Troubleshooting: Azure point-to-site connection problems](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems) walks through common issues with point-to-site connections.

## Create a multisite VPN connection

You can add a site-to-site (S2S) connection to a virtual network that already has a S2S connection, point-to-site connection, or network-to-network connection, this kind of connection is frequently known as a *multisite* configuration. 

![Multisite connection](./media/virtual-network-configure-vnet-connections/4034497_en_2.png)

Azure currently works with two deployment models: Resource Manager and classic. The two models aren't completely compatible with each other. To configure a multisite connection with different models, check the following articles:

* [Add a site-to-site connection to a virtual network with an existing VPN gateway connection](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-multi-site-to-site-resource-manager-portal)
* [Add a site-to-site connection to a virtual network with an existing VPN gateway connection (classic)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-multi-site)

> [!Note]
> These steps don't apply to ExpressRoute and site-to-site coexisting connection configurations. For more information about coexisting connections, see [ExpressRoute/S2S coexisting connections](https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager).

## Configure transit routing

Transitive routing is a specific routing scenario where you connect multiple networks in a ‘daisy chain’ topology. This routing enables resources in Vnets at either end of the ‘chain’ to communicate with one another through virtual networks in-between. Without transitive routing, networks or devices peered through a hub can't reach one another.

### Configure transit routing in a point-to-site connection

In this scenario, you configure a site-to-site VPN connection between VNetA and VNetB, also configure a point-to-site VPN for client to connect to the gateway of VNetA. Then, you want to enable transit routing for the point-to-site clients to connect to VNetB, which passes through VNetA. This scenario is supported when BGP is enabled on the site to site VPN between VNetA and VNetB. For more information, see [About point-to-site VPN routing](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-point-to-site-routing).

### Configure transit routing in an ExpressRoute connection

Microsoft Azure ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a dedicated private connection facilitated by a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services, such as Microsoft Azure, Office 365, and Dynamics 365.  For more information, see [ExpressRoute overview](https://docs.microsoft.com/azure/expressroute/expressroute-introduction).

![ExpressRoute private peering connection to Azure virtual networks](./media/virtual-network-configure-vnet-connections/4034395_en_1.png)

> [!Note]
> We recommend that if VNetA and VNetB are in the same geopolitical region that you [link both virtual networks to the ExpressRoute circuit](https://docs.microsoft.com/azure/expressroute/expressroute-howto-linkvnet-arm) instead of configuring transitive routing. If your virtual networks are in different geopolitical regions, you can also link them to your circuit directly if you have [ExpressRoute Premium](https://docs.microsoft.com/azure/expressroute/expressroute-faqs#expressroute-premium). 

If you have ExpressRoute and site-to-site coexistence, transit routing isn't supported. For more information, see [Configure ExpressRoute and site-to-site coexisting connections for more information](https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager).

If you have enabled ExpressRoute to connect your local networks to an Azure virtual network, you can enable virtual network peering between the virtual networks you want to have transitive routing. To allow your local networks connect to the remote virtual network, you must configure [Virtual network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview#gateways-and-on-premises-connectivity). 

> [!Note]
> Virtual network peering is available only for virtual networks in the same region.

To check whether you have configured transit route for virtual network Peering, follow the instructions:

1. Sign-in to the [Azure portal](https://portal.azure.com/) with an account that has the necessary [roles and permissions](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering#roles-permissions).
2. [Create a peering between the VNet A and B](https://docs.microsoft.com/azure/virtual-network/virtual-network-create-peering) as in the earlier diagram. 
3. In the pane that appears for the virtual network that you selected, select **Peerings** in the **Settings** section.
4. Select the peering you want to view and **Configuration** to validate that you have enabled **Allow Gateway Transit** on the VNetA connected to the ExpressRoute circuit and **Use Remote Gateway** on the remote VNetB not connected to the ExpressRoute circuit.

### Configure transit routing in a virtual network peering connection

When virtual networks are peered, you can also configure the gateway in the peered virtual network as a transit point to an on-premises network. To configure transit route in virtual network peering, check [Virtual network-to-virtual network connections](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-vnet-vnet-rm-ps?toc=/azure/virtual-network/toc.json).

> [!Note]
> Gateway transit isn't supported in the peering relationship between virtual networks created through different deployment models. Both virtual networks in the peering relationship must have been created through Resource Manager for a gateway transit to work.

To check whether you have configured a transit route for virtual network peering, follow the instructions:

1. Sign-in to the [Azure portal](https://portal.azure.com/) with an account that has the necessary [roles and permissions](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering#roles-permissions).
2. In the box that contains the text Search resources at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, select it.
3. In the **Virtual networks** blade that appears, select the virtual network that you want to check the peering setting.
4. In the pane that appears for the virtual network that you selected, select **Peerings** in the **Settings** section.
5. Select the peering you want to view and validate that you have enabled **Allow Gateway Transit** and **Use Remote Gateway** under **Configuration**.

![Selections for checking that you have configured a transit route for virtual network Peering](./media/virtual-network-configure-vnet-connections/4035414_en_1.png)

### Configure transit routing in a network-to-network connection

To configure transit routing between virtual networks, you must enable BGP on all intermediate network-to-network connections by using the Resource Manager deployment model and PowerShell. For instructions, see [How to configure BGP on Azure VPN Gateways by using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-resource-manager-ps).

Transit traffic through Azure VPN gateway is possible by using the classic deployment model, but relies on statically defined address spaces in the network configuration file. BGP isn't yet supported with Azure Virtual Networks and VPN gateways by using the classic deployment model. Without BGP, manually defining transit address spaces is error prone, and isn't recommended.

> [!Note]
> Classic network-to-network connections are configured by using the Azure classic portal, or by using a network configuration file in the classic portal. You can't create or modify a classic virtual network through the Azure Resource Manager deployment model or Azure portal. For more information on transit routing for classic virtual networks, see [Hub & Spoke, Daisy-Chain, and Full-Mesh VNET topologies in Azure ARM using VPN (V1)](https://blogs.msdn.microsoft.com/igorpag/2015/10/01/hubspoke-daisy-chain-and-full-mesh-vnet-topologies-in-azure-arm-using-vpn-v1/).

### Configure transit routing in a site-to-site connection

To configure the transit routing between your on-premise network and a virtual network with a site-to-site connection, you must enable BGP on all intermediate site-to-site connections by using the Resource Manager deployment model and PowerShell. See [How to configure BGP on Azure VPN Gateways by using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-resource-manager-ps) for instructions.

Transit traffic through Azure VPN gateway is possible by using the classic deployment model, but relies on statically defined address spaces in the network configuration file. BGP isn't yet supported with Azure Virtual Networks and VPN gateways by using the classic deployment model. Without BGP, manually defining transit address spaces is error prone, and isn't recommended.

> [!Note]
> Classic site-to-site connections are configured by using the Azure classic portal, or by using a network configuration file in the classic portal. You can't create or modify a classic virtual network through the Azure Resource Manager deployment model or Azure portal. For more information on transit routing for classic virtual networks, see [Hub & Spoke, Daisy-Chain, and Full-Mesh VNET topologies in Azure ARM using VPN (V1)](https://blogs.msdn.microsoft.com/igorpag/2015/10/01/hubspoke-daisy-chain-and-full-mesh-vnet-topologies-in-azure-arm-using-vpn-v1/).

## Configure BGP for a VPN gateway

BGP is the standard routing protocol used on the internet to exchange routing and reachability information between two or more networks. When BGP is used in the context of Azure virtual networks, BGP enables the Azure VPN gateways and your on-premises VPN devices, known as BGP peers or neighbors. They exchange "routes" that will inform both gateways on the availability and reachability for those prefixes to go through the gateways or routers involved. 

BGP can also enable transit routing among multiple networks by propagating routes a BGP gateway learns from one BGP peer to all other BGP peers. For more information, see [Overview of BGP with Azure VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-overview).

### Configure BGP for a VPN connection

To configure a VPN connection that uses BGP, see [How to configure BGP on Azure VPN gateways by using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-resource-manager-ps).

Enable BGP on the Virtual Network Gateway by creating an AS number for it. Basic gateways don't support BGP. To check the SKU of the gateway go to the Overview section of the VPN Gateway blade in the Azure portal. If your SKU is **Basic**, you have to change SKU ([resizing the gateway](https://docs.microsoft.com/powershell/module/azurerm.network/resize-azurermvirtualnetworkgateway?view=azurermps-4.1.0&viewFallbackFrom=azurermps-4.0.0)) to the **VpnGw1** SKU. Checking the SKU will cause 20-30 minutes downtime. As soon as the Gateway has the correct SKU, the AS can be added through [Set-AzureRmVirtualNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermvirtualnetworkgateway?view=azurermps-3.8.0) PowerShell command-let. After you configure the AS number, a BGP peer IP for the gateway will be provided automatically.

The LocalNetworkGateway must be **manually** provided with an AS number and a BGP peer address. You can set the **ASN** and **-BgpPeeringAddress** values by using either [New-AzureRmLocalNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermlocalnetworkgateway?view=azurermps-4.1.0) or [Set-AzureRmLocalNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermlocalnetworkgateway?view=azurermps-4.1.0) PowerShell command-let. Some AS numbers are reserved for azure and you can't use them as described at [About BGP with Azure VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-overview#bgp-faq).

The Connection object must have BGP enabled. You can set the **-EnableBGP** value to `$True` through [New-AzureRmVirtualNetworkGatewayConnection](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermvirtualnetworkgatewayconnection?view=azurermps-4.1.0) or [Set-AzureRmVirtualNetworkGatewayConnection](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermvirtualnetworkgatewayconnection?view=azurermps-4.1.0).

### Validate the BGP configuration

To check whether BGP is configured correctly, you can run the cmdlet `get-AzureRmVirtualNetworkGateway` and `get-AzureRmLocalNetworkGateway`, then you will notice BGP-related output in the BgpSettingsText part. For example:
BgpSettingsText:

```
{

"Asn": AsnNumber,

"BgpPeeringAddress": "IP address",

"PeerWeight": 0

}
```

## Create a highly available active/active VPN connection

The key differences between the active/active and active/standby gateways:

* You must create two Gateway IP configurations with two public IP addresses.
* You must set the *EnableActiveActiveFeature* flag.
* The gateway SKU must be VpnGw1, VpnGw2, or VpnGw3.

To achieve high availability for cross-premises and network-to-network connectivity, you should deploy multiple VPN gateways and establish multiple parallel connections between your networks and Azure. For an overview of connectivity options and topology, see [Highly Available Cross-Premises and network-to-network Connectivity](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-highlyavailable).

To create active/active cross-premises and network-to-network connections, follow the instructions in [Configure active/active S2S VPN connections with Azure VPN gateways](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-activeactive-rm-powershell) to configure Azure VPN gateway in active/active mode.

> [!Note]  
> * When you add addresses to the Local Network Gateway for BGP enabled, active/active mode *only add the /32 addresses of the BGP peers*. If you add more addresses, they will be considered static routes and take precedence over BGP routes.
> * You must use different BGP ASNs for your on-premises networks connecting to Azure. (If they are the same, you have to change your virtual network ASN if your on-premises VPN device already uses the ASN to peer with other BGP neighbors.)

## Change an Azure VPN gateway type after deployment

You can't change an Azure virtual network gateway type from policy-based to route-based or the other way directly. You must delete the gateway, after that the IP address and the pre-shared key (PSK) won't be preserved. Then you can create a new gateway of desired type. To delete and create a gateway, follow the steps:

1. Delete any connections associated with the original gateway.
2. Delete the gateway by using Azure portal, PowerShell, or classic PowerShell: 
   * [Delete a virtual network gateway using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-delete-vnet-gateway-portal)
   * [Delete a virtual network gateway using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-delete-vnet-gateway-powershell)
   * [Delete a virtual network gateway using PowerShell (classic)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-delete-vnet-gateway-classic-powershell)
3. Follow the steps in [Create the VPN gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#a-namevnetgatewaya4-create-the-vpn-gateway) to create the new gateway of desired type and complete the VPN setup.

> [!Note]
> This process will take around 60 minutes.

## Next steps

* [Troubleshooting connectivity problems between Azure VMs](https://docs.microsoft.com/azure/virtual-network/virtual-network-troubleshoot-connectivity-problem-between-vms)

