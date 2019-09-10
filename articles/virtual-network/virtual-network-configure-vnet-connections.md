---
title: Configure and validate VNet or VPN connections
description: Step-by-step guidance to configure and validate various Azure VPN and VNet deployments
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

# Configure and validate VNet or VPN connections

This guided walkthrough provides step-by-step guidance to configure and validate various Azure VPN and VNet deployments in scenarios such as, Transit Routing, VNet-to-VNet, BGP, Multi-Site, Point-to-Site, and so on.

Azure VPN gateways enable flexibility in arranging almost any kind of connected Virtual Network (VNet) topology in Azure: you can connect VNets across regions, between VNet types (Azure Resource Manager vs. Classic), within Azure or with on-premise hybrid environment, in different subscriptions, and so on. 

## Scenario 1: VNet-to-VNet VPN connection

Connecting a virtual network to another virtual network (VNet-to-VNet) via VPN is similar to connecting a VNet to an on-premises site location. Both connectivity types use a VPN gateway to provide a secure tunnel using **IPsec/IKE**. The virtual networks can be in the same or different regions, and from the same or different subscriptions.

![IMAGE](./media/virtual-network-configure-vnet-connections/4034386_en_2.png)
 
Figure 1 - VNet-to-VNet with IPsec

If your VNets are in the same region, you may want to consider connecting them using VNet Peering, which doesn't use a VPN gateway, increases throughput and decreases latency, select **Configure and validate VNet Peering** to configure a VNet peering connection.

If your VNets are both created by using Azure Resource Manger deployment model, select **Configure and validate a Resource Manager VNet to a Resource Manager VNet connection** to configure a VPN connection.

If one of the VNets is created by using Azure classic deployment model, the other is created by Resource Manager, select **Configure and validate a classic VNet to a Resource Manager VNet connection** to configure a VPN connection.

### Configuration 1: Configure VNet peering for two VNets in the same region

Before you start the implementation of Azure VNet Peering, make sure that you meet the following pre-requisites to configure VNet Peering:

* The peered virtual networks must exist in the same Azure region.
* The peered virtual networks must have nonoverlapping IP address spaces.
* Virtual network peering is between two virtual networks. There's no derived transitive relationship across peerings. For example, if VNetA is peered with VNetB, and VNetB is peered with VNetC, VNetA is *not* peered to VNetC.

When you meet the requirements, you can follow [Create a virtual network peering tutorial](https://docs.microsoft.com/azure/virtual-network/virtual-network-create-peering) to create and configure the VNet Peering.

To check the VNet Peering configuration, use the following methods:

1. Sign-in to the [Azure portal](https://portal.azure.com/) with an account that has the necessary [roles and permissions](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering#roles-permissions).
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appears, click the virtual network you want to create a peering for.
4. In the pane that appears for the virtual network you selected, click **Peerings** in the **Settings** section.
5. Click the peering you want to check the configuration.

![IMAGE](./media/virtual-network-configure-vnet-connections/4034496_en_1.png)
 
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

### Connection type 1: Connect a Resource Manager VNet to anther Resource Manager VNet (Azure Resource Manager to Azure Resource Manager)

You can configure a connection from one Resource Manager VNet to another Resource Manager VNet directly, or configure the connection with IPsec.

### Configuration 2: Configure VPN connection between Resource Manager VNets

To configure a connection between Resource Manager VNets without IPsec, see [Configure a VNet-to-VNet VPN gateway connection using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal).

To configure a connection with IPsec between two Resource Manager VNets, follow the steps 1-5 in [Create a Site-to-Site connection in the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal) for each VNet.

> [!Note] These steps work only for VNets in the same subscription. If your VNets are in different subscriptions, you must use PowerShell to make the connection. See the [PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-vnet-vnet-rm-ps) article.

### Validate VPN connection between Resource Manager VNets

![IMAGE](./media/virtual-network-configure-vnet-connections/4034493_en_2.png)

Figure 4 - Classic VNet connection to Azure Resource Manager VNet

To check your VPN connection is configured correctly, follow the instructions:

> [!Note] The number after virtual network components, such as "Vnet 1" in the steps below, correspond to the numbers in Figure 4.

1. Check for overlapping address spaces in the connected VNets.

   > [!Note] There can't be overlapping address spaces in Vnet 1 and Vnet 6. 

2. Verify Azure Resource Manager Vnet 1 address range is defined accurately in **Connection object** 4.
3. Verify Azure Resource Manager Vnet 6 address range is defined accurately in **Connection object** 3.
4. Verify that the Pre-Shared-Keys are matching on both connection objects 3 and 4.
5. Verify the Azure Resource Manager Vnet Gateway 2 VIP is defined accurately in the ARM **Connection object** 4.
6. Verify the Azure Resource Manager Vnet Gateway 5 VIP is defined accurately in the ARM **Connection object** 3.

### Connection type 2: Connect a classic VNet to a Resource Manager VNet

You can create a connection between VNets that are in different subscriptions and in different regions. You can also connect VNets that already have connections to on-premises networks, as long as you have configured the gateway type as route-based.

To configure a connection between a classic VNet and a Resource Manager VNet, see [Connect virtual networks from different deployment models using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-connect-different-deployment-models-portal) for more information.

![IMAGE](./media/virtual-network-configure-vnet-connections/4034389_en_2.png)

Figure 5 - Classic VNet connection to Azure Resource Manager VNet

To check the configuration when connect a classic VNet to an Azure Resource Manager VNet, follow the instructions:

> [!Note] The number after virtual network components like "Vnet 1" in the steps below are corresponding to the numbers in Figure 5.

1. Check for overlapping address spaces in the connected VNets.

   > [!Note] There can't be overlapping address spaces in Vnet 1 and Vnet 6

2. Verify Azure Resource Manager VNet 6 address range is defined accurately in the Classic local network definition 3.
3. Verify Classic VNet 1 address range is defined accurately in the Azure Resource Manager **Connection object** 4.
4. Verify the Classic VNet Gateway 2 VIP is defined accurately in the Azure Resource Manager **Connection object** 4.
5. Verify the Azure Resource Manager VNet Gateway 5 VIP is defined accurately in the Classic **Local Network Definition** 3.
6. Verify that the Pre-Shared-Keys are matching on both connected VNets:
   1. Classic Vnet - Local Network Definition 3
   2. Azure Resource Manager Vnet - Connection Object 4

## Scenario 2: Point-to-Site VPN connection

A Point-to-Site (P2S) configuration lets you create a secure connection from an individual client computer to a virtual network. Point-to-Site connections are useful when you want to connect to your VNet from a remote location, such as from home or a conference, or when you only have a few clients that need to connect to a virtual network. The P2S VPN connection is initiated from the client computer using the native Windows VPN client. Connecting clients use certificates to authenticate.

![IMAGE](./media/virtual-network-configure-vnet-connections/4034387_en_3.png)

Figure 2 - Point-to-Site connection

Point-to-Site connections don't require a VPN device. P2S creates the VPN connection over SSTP (Secure Socket Tunneling Protocol). You can connect a Point-to-Site connection to a VNet by using a different deployment tools and deployment models:

* [Configure a Point-to-Site connection to a VNet using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal)
* [Configure a Point-to-Site connection to a VNet using the Azure portal (classic)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-classic-azure-portal)
* [Configure a Point-to-Site connection to a VNet using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps)

### Validate your Point-to-Site connections

The article [Troubleshooting: Azure point-to-site connection problems](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems) walks through common issues with Point-to-Site connections.

## Scenario 3: Multi-Site VPN connection

You can add a Site-to-Site (S2S) connection to a VNet that already has a S2S connection, Point-to-Site connection, or VNet-to-VNet connection, this kind of connection is frequently known as a **Multi-site** configuration. 

![IMAGE](./media/virtual-network-configure-vnet-connections/4034497_en_2.png)

Figure 3 - Multi-Site connection

Azure currently works with two deployment models: Resource Manager and Classic. The two models aren't completely compatible with each other. To configure **Multi-site** connection with different models, check the following articles:

* [Add a Site-to-Site connection to a VNet with an existing VPN gateway connection](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-multi-site-to-site-resource-manager-portal)
* [Add a Site-to-Site connection to a VNet with an existing VPN gateway connection (classic)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-multi-site)

> [!Note] These steps don't apply to ExpressRoute and Site-to-Site coexisting connection configurations. For more information about coexisting connections, see [ExpressRoute/S2S coexisting connections](https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager).

## Scenario 4: Configure transit routing

Transitive routing is a specific routing scenario where you connect multiple networks in a ‘daisy chain’ topology. This routing enables resources in Vnets at either end of the ‘chain’ to communicate with one another through VNets in-between. Without transitive routing, networks or devices peered through a hub can't reach one another.

### Configuration 1: Configure transit routing in a Point-to-Site connection

In this scenario, you configure a site to site VPN connection between VNetA and VNetB, also configure a point to site VPN for client to connect to the gateway of VNetA. Then, you want to enable transit routing for the Point-to-Site clients to connect to VNetB, which passes through VNetA. This scenario is supported when BGP is enabled on the site to site VPN between VNetA and VNetB. For more information, see [About Point-to-Site VPN routing](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-point-to-site-routing).

### Configuration 2: Configure transit routing in an ExpressRoute connection

Microsoft Azure ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a dedicated private connection facilitated by a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services, such as Microsoft Azure, Office 365, and Dynamics 365.  For more information, see [ExpressRoute overview](https://docs.microsoft.com/azure/expressroute/expressroute-introduction).

![IMAGE](./media/virtual-network-configure-vnet-connections/4034395_en_1.png)

Figure 6 - ExpressRoute 'Private Peering' connection to Azure VNets

> [!Note] We recommend that if VNetA and VNetB are in the same geopolitical region that you [link both VNets to the ExpressRoute circuit](https://docs.microsoft.com/azure/expressroute/expressroute-howto-linkvnet-arm) instead of configuring transitive routing. If your VNets are in different geopolitical regions, you can also link them to your circuit directly if you have [ExpressRoute Premium](https://docs.microsoft.com/azure/expressroute/expressroute-faqs#expressroute-premium). 

If you have ExpressRoute and Site-to-Site coexistence, transit routing isn't supported. For more information, see [Configure ExpressRoute and Site-to-Site coexisting connections for more information](https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager).

If you have enabled ExpressRoute to connect your local networks to an Azure virtual network, you can enable VNet peering between the VNets you want to have transitive routing. To allow your local networks connect to the remote VNet, you must configure [Virtual network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview#gateways-and-on-premises-connectivity). 

> [!Note] VNet peering is available only for VNets in the same region.

To check whether you have configured transit route for VNet Peering, follow the instructions:

1. Sign-in to the [Azure portal](https://portal.azure.com/) with an account that has the necessary [roles and permissions](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering#roles-permissions).
2. [Create a peering between the VNet A and B](https://docs.microsoft.com/azure/virtual-network/virtual-network-create-peering) as in the diagram earlier (Figure 6). 
3. In the pane that appears for the virtual network that you selected, click **Peerings** in the **Settings** section.
4. Click the peering you want to view and **Configuration** to validate that you have enabled **Allow Gateway Transit** on the VNetA connected to the ExpressRoute circuit and **Use Remote Gateway** on the remote VNetB not connected to the ExpressRoute circuit.

### Configuration 3: Configure transit routing in a VNet peering connection

When virtual networks are peered, you can also configure the gateway in the peered virtual network as a transit point to an on-premises network. To configure transit route in VNet peering, check [Virtual network-to-virtual network connections](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-vnet-vnet-rm-ps?toc=/azure/virtual-network/toc.json).

> [!Note] Gateway transit isn't supported in the peering relationship between virtual networks created through different deployment models. Both virtual networks in the peering relationship must have been created through Resource Manager for a gateway transit to work.

To check whether you have configured transit route for VNet Peering, follow the instructions:

1. Sign-in to the [Azure portal](https://portal.azure.com/) with an account that has the necessary [roles and permissions](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering#roles-permissions).
2. In the box that contains the text Search resources at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appears, click the virtual network that you want to check the peering setting.
4. In the pane that appears for the virtual network that you selected, click **Peerings** in the **Settings** section.
5. Click the peering you want to view and validate that you have enabled **Allow Gateway Transit** and **Use Remote Gateway** under **Configuration**.

![IMAGE](./media/virtual-network-configure-vnet-connections/4035414_en_1.png)

### Configuration 4: Configure transit routing in a VNet-to-VNet connection

To configure transit routing between VNets, you must enable BGP on all intermediate VNet-to-VNet connections by using the Resource Manager deployment model and PowerShell. For instructions, see [How to configure BGP on Azure VPN Gateways by using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-resource-manager-ps).

Transit traffic through Azure VPN gateway is possible by using the classic deployment model, but relies on statically defined address spaces in the network configuration file. BGP isn't yet supported with Azure Virtual Networks and VPN gateways by using the classic deployment model. Without BGP, manually defining transit address spaces is error prone, and isn't recommended.

> [!Note] Classic VNet-to-VNet connections are configured by using the Azure portal (Classic), or by using a network configuration file in the Classic Portal. You can't create or modify a Classic virtual network through the Azure Resource Manager deployment model or Azure portal. For more information on transit routing for Classic VNets, see [Hub & Spoke, Daisy-Chain, and Full-Mesh VNET topologies in Azure ARM using VPN (V1)](https://blogs.msdn.microsoft.com/igorpag/2015/10/01/hubspoke-daisy-chain-and-full-mesh-vnet-topologies-in-azure-arm-using-vpn-v1/).

### Configuration 5: Configure transit routing in a Site-to-Site connection

To configure the transit routing between your on-premise network and a VNet with a Site-to-Site connection, you must enable BGP on all intermediate Site-to-Site connections by using the Resource Manager deployment model and PowerShell, see [How to configure BGP on Azure VPN Gateways by using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-resource-manager-ps) for the instructions.

Transit traffic through Azure VPN gateway is possible by using the classic deployment model, but relies on statically defined address spaces in the network configuration file. BGP isn't yet supported with Azure Virtual Networks and VPN gateways by using the classic deployment model. Without BGP, manually defining transit address spaces is error prone, and isn't recommended.

> [!Note] Classic Site-to-Site connections are configured by using the Azure portal (Classic), or by using a network configuration file in the Classic Portal. You can't create or modify a Classic virtual network through the Azure Resource Manager deployment model or Azure portal. For more information on transit routing for Classic VNets, see [Hub & Spoke, Daisy-Chain, and Full-Mesh VNET topologies in Azure ARM using VPN (V1)](https://blogs.msdn.microsoft.com/igorpag/2015/10/01/hubspoke-daisy-chain-and-full-mesh-vnet-topologies-in-azure-arm-using-vpn-v1/).

## Scenario 5: Configure BGP for a VPN gateway

BGP is the standard routing protocol used in the Internet to exchange routing and reachability information between two or more networks. When BGP is used in the context of Azure Virtual Networks, BGP enables the Azure VPN Gateways and your on-premises VPN devices, known as BGP peers or neighbors. They exchange "routes" that will inform both gateways on the availability and reachability for those prefixes to go through the gateways or routers involved. BGP can also enable transit routing among multiple networks by propagating routes a BGP gateway learns from one BGP peer to all other BGP peers. For more information, see [Overview of BGP with Azure VPN Gateways](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-overview).

### Configure BGP for a VPN connection

To configure a VPN connection that uses BGP, see [How to configure BGP on Azure VPN Gateways by using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-resource-manager-ps).

> [!Note]
> 1. Enable BGP on the Virtual Network Gateway by creating an AS number for it. Basic gateways don't support BGP. To check the SKU of the gateway go to the Overview section of the VPN Gateway blade in the Azure portal. If your SKU is **Basic**, you have to change SKU ([resizing the gateway](https://docs.microsoft.com/powershell/module/azurerm.network/resize-azurermvirtualnetworkgateway?view=azurermps-4.1.0&viewFallbackFrom=azurermps-4.0.0)) to the **VpnGw1** SKU. Checking the SKU will cause 20-30 minutes downtime. As soon as the Gateway has the correct SKU, the AS can be added through [Set-AzureRmVirtualNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermvirtualnetworkgateway?view=azurermps-3.8.0) PowerShell command-let. After you configure the AS number, a BGP peer IP for the gateway will be provided automatically.
> 2. The LocalNetworkGateway must be **manually** provided with an AS number and a BGP peer address. You can set the **ASN** and **-BgpPeeringAddress** values by using either [New-AzureRmLocalNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermlocalnetworkgateway?view=azurermps-4.1.0) or [Set-AzureRmLocalNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermlocalnetworkgateway?view=azurermps-4.1.0) PowerShell command-let. Some AS numbers are reserved for azure and you can't use them as described at [About BGP with Azure VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-overview#bgp-faq).
> 3. Finally, the Connection object must have BGP enabled. You can set the **-EnableBGP** value to `$True` through [New-AzureRmVirtualNetworkGatewayConnection](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermvirtualnetworkgatewayconnection?view=azurermps-4.1.0) or [Set-AzureRmVirtualNetworkGatewayConnection](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermvirtualnetworkgatewayconnection?view=azurermps-4.1.0).

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

## Scenario 6: Highly available Active-Active VPN connection

The key differences between the active-active and active-standby gateways:

* You must create two Gateway IP configurations with two public IP addresses
* You must set the *EnableActiveActiveFeature* flag
* The gateway SKU must be VpnGw1, VpnGw2, VpnGw3

To achieve high availability for cross-premises and VNet-to-VNet connectivity, you should deploy multiple VPN gateways and establish multiple parallel connections between your networks and Azure. For an overview of connectivity options and topology, see [Highly Available Cross-Premises and VNet-to-VNet Connectivity](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-highlyavailable).

To create active-active cross-premises and VNet-to-VNet connections, follow the instructions in [Configure active-active S2S VPN connections with Azure VPN Gateways](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-activeactive-rm-powershell) to configure Azure VPN gateway in Active/Active mode.

> [!Note]  
> 1. When you add addresses to the Local Network Gateway for BGP enabled, active-to-active mode *only add the /32 addresses of the BGP peers*. If you add more addresses, they will be considered static routes and take precedence over BGP routes.
> 2. You must use different BGP ASNs for your on-premises networks connecting to Azure. (If they are the same, you have to change your VNet ASN if your on-premises VPN device already uses the ASN to peer with other BGP neighbors.)

## Scenario 7: Change an Azure VPN gateway type after deployment

You can't change an Azure VNet gateway type from policy-based to route-based or the other way directly. You must delete the gateway, after that the IP address and the Pre-Shared Key (PSK) won'tbe preserved. Then you can create a new gateway of desired type. To delete and create a gateway, follow the steps:

1. Delete any connections associated with the original gateway.
2. Delete the gateway by using Azure portal, PowerShell, or classic PowerShell: 
   * [Delete a virtual network gateway using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-delete-vnet-gateway-portal)
   * [Delete a virtual network gateway using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-delete-vnet-gateway-powershell)
   * [Delete a virtual network gateway using PowerShell (classic)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-delete-vnet-gateway-classic-powershell)
3. Follow the steps in [Create the VPN gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#a-namevnetgatewaya4-create-the-vpn-gateway) to create the new gateway of desired type and complete the VPN setup.

> [!Note] This process will take around 60 minutes.

## Next steps

* [Troubleshooting connectivity problems between Azure VMs](https://docs.microsoft.com/azure/virtual-network/virtual-network-troubleshoot-connectivity-problem-between-vms)

