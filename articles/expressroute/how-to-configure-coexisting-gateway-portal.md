---
title: 'Configure ExpressRoute and S2S VPN coexisting connections: Azure portal'
description: Configure ExpressRoute and a Site-to-Site VPN connection that can coexist for the Resource Manager model using the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau
---

# Configure ExpressRoute and Site-to-Site coexisting connections using the Azure portal
> [!div class="op_single_selector"]
> * [Azure portal](how-to-configure-coexisting-gateway-portal.md)
> * [PowerShell - Resource Manager](expressroute-howto-coexist-resource-manager.md)
> * [PowerShell - Classic](expressroute-howto-coexist-classic.md)
> 

This article helps you configure ExpressRoute and Site-to-Site VPN connections that coexist. Having the ability to configure Site-to-Site VPN and ExpressRoute has several advantages. You can configure Site-to-Site VPN as a secure failover path for ExpressRoute, or use Site-to-Site VPNs to connect to sites that aren't connected through ExpressRoute. We cover the steps to configure both scenarios in this article. This article applies to the Resource Manager deployment model.

Configuring Site-to-Site VPN and ExpressRoute coexisting connections has several advantages:

* You can configure a Site-to-Site VPN as a secure failover path for ExpressRoute. 
* Alternatively, you can use Site-to-Site VPNs to connect to sites that aren't connected through ExpressRoute. 

The steps to configure both scenarios are covered in this article. You can configure either gateway first. Typically, you incur no downtime when adding a new gateway or gateway connection.

>[!NOTE]
>If you want to create a Site-to-Site VPN over an ExpressRoute connection, see [Site-to-site over Microsoft peering](site-to-site-vpn-over-microsoft-peering.md).
>

## Limits and limitations

* **Only route-based VPN gateway is supported.** You must use a route-based [VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md). You also can use a route-based VPN gateway with a VPN connection configured for 'policy-based traffic selectors' as described in [Connect to multiple policy-based VPN devices](../vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).
* **ExpressRoute-VPN Gateway coexist configurations are not supported on the Basic SKU**.
* **If you want to use transit routing between ExpressRoute and VPN, the ASN of Azure VPN Gateway must be set to 65515.** Azure VPN Gateway supports the BGP routing protocol. For ExpressRoute and Azure VPN to work together, you must keep the Autonomous System Number of your Azure VPN gateway at its default value, 65515. If you previously selected an ASN other than 65515 and you change the setting to 65515, you must reset the VPN gateway for the setting to take effect.
* **The gateway subnet must be /27 or a shorter prefix**, such as /26, /25, or you receive an error message when you add the ExpressRoute virtual network gateway.
* **Coexistence in a dual-stack vnet is not supported.** If you're using ExpressRoute IPv6 support and a dual-stack ExpressRoute gateway, coexistence with VPN Gateway isn't possible.

## Configuration designs

### Configure a Site-to-Site VPN as a failover path for ExpressRoute
You can configure a Site-to-Site VPN connection as a backup for ExpressRoute. This connection applies only to virtual networks linked to the Azure private peering path. There's no VPN-based failover solution for services accessible through Azure Microsoft peering. The ExpressRoute circuit is always the primary link. Data flows through the Site-to-Site VPN path only if the ExpressRoute circuit fails. To avoid asymmetrical routing, your local network configuration should also prefer the ExpressRoute circuit over the Site-to-Site VPN. You can prefer the ExpressRoute path by setting higher local preference for the routes received the ExpressRoute. 

>[!NOTE]
> If you have ExpressRoute Microsoft Peering enabled, you can receive the public IP address of your Azure VPN gateway on the ExpressRoute connection. To set up your site-to-site VPN connection as a backup, you must configure your on-premises network so that the VPN connection is routed to the Internet.
>

> [!NOTE]
> While ExpressRoute circuit is preferred over Site-to-Site VPN when both routes are the same, Azure will use the longest prefix match to choose the route towards the packet's destination.
> 

:::image type="content" source="media/expressroute-howto-coexist-resource-manager/scenario1.jpg" alt-text="Diagram of a site-to-site VPN connection used as backup for ExpressRoute.":::

### Configure a Site-to-Site VPN to connect to sites not connected through ExpressRoute
You can configure your network where some sites connect directly to Azure over Site-to-Site VPN, and some sites connect through ExpressRoute. 

:::image type="content" source="media/expressroute-howto-coexist-resource-manager/scenario2.jpg" alt-text="Diagram of a site-to-site VPN connection coexisting with an ExpressRoute connection for two different sites.":::

## Selecting the steps to use
There are two different sets of procedures to choose from. The configuration procedure that you select depends on whether you have an existing virtual network that you want to connect to, or you want to create a new virtual network.

* I don't have a VNet and need to create one.
  
    If you don’t already have a virtual network, this procedure walks you through creating a new virtual network using Resource Manager deployment model and creating new ExpressRoute and Site-to-Site VPN connections. To configure a virtual network, follow the steps in [To create a new virtual network and coexisting connections](#to-create-a-new-virtual-network-and-coexisting-connections).

* I already have a Resource Manager deployment model VNet.
  
    You may already have a virtual network in place with an existing Site-to-Site VPN connection or ExpressRoute connection. In this scenario if the gateway subnet prefix is /28 or longer (/29, /30, etc.), you have to delete the existing gateway. The [To configure coexisting connections for an already existing VNet](#to-configure-coexisting-connections-for-an-already-existing-vnet) section walks you through deleting the gateway, and then creating new ExpressRoute and Site-to-Site VPN connections.
  
    If you delete and recreate your gateway, you have downtime for your cross-premises connections. However, your VMs and services can communicate out through the load balancer while you configure your gateway if they're configured to do so.

## To create a new virtual network and coexisting connections

This procedure walks you through creating a VNet and Site-to-Site and ExpressRoute connections that coexist.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the top left-hand side of the screen, select **+ Create a resource** and search for *Virtual network*.

1. Select **Create** to begin configuring the virtual network.

    :::image type="content" source="media/how-to-configure-coexisting-gateway-portal/create-vnet.png" alt-text="Screenshot of the create a virtual network page.":::

1. On the *Basics* tab, select or create a new **resource group** to store the virtual network. Then enter the **name** and select the **region** to deploy the virtual network. Select **Next: IP Addresses >** to configure the address space and subnets.

    :::image type="content" source="media/how-to-configure-coexisting-gateway-portal/vnet-basics.png" alt-text="Screenshot of basics tab for creating a virtual network.":::

1. On **IP Addresses** tab, configure the virtual network address space. Then define the subnets you want to create, including the gateway subnet. Select **Review + create**, then *Create** to deploy the virtual network. For more information about creating a virtual network, see [Create a virtual network](../virtual-network/manage-virtual-network.md#create-a-virtual-network). For more information about creating subnets, see [Create a subnet](../virtual-network/virtual-network-manage-subnet.md#add-a-subnet)

    > [!IMPORTANT]
    > The Gateway Subnet must be /27 or a shorter prefix (such as /26 or /25).
    >

    :::image type="content" source="media/how-to-configure-coexisting-gateway-portal/vnet-ip-addresses.png" alt-text="Screenshot of IP addresses tab for creating a virtual network.":::

1. Create the site-to-site VPN gateway and local network gateway. For more information about the VPN gateway configuration, see [Configure a VNet with a Site-to-Site connection](../vpn-gateway/tutorial-site-to-site-portal.md#VNetGateway). The GatewaySku is only supported for *VpnGw1*, *VpnGw2*, *VpnGw3*, *Standard*, and *HighPerformance* VPN gateways. ExpressRoute-VPN Gateway coexist configurations aren't supported on the Basic SKU. The VpnType must be *RouteBased*.

1. Configure your local VPN device to connect to the new Azure VPN gateway. For more information about VPN device configuration, see [VPN Device Configuration](../vpn-gateway/vpn-gateway-about-vpn-devices.md).

1. If you're connecting to an existing ExpressRoute circuit, skip steps 8 & 9 and, jump to step 10. Configure ExpressRoute circuits. For more information about configuring ExpressRoute circuit, see [create an ExpressRoute circuit](expressroute-howto-circuit-arm.md).

1. Configure Azure private peering over the ExpressRoute circuit. For more information about configuring Azure private peering over the ExpressRoute circuit, see  [configure peering](expressroute-howto-routing-arm.md)

1. Select **+ Create a resource** and search for *Virtual network gateway*. Then select **Create**. 

1. Select the **ExpressRoute** gateway type, the appropriate **SKU** and the virtual network to deploy the gateway to.

    :::image type="content" source="media/how-to-configure-coexisting-gateway-portal/create-expressroute-gateway.png" alt-text="Screenshot of the create a virtual network gateway for ExpressRoute.":::

1. Link the ExpressRoute gateway to the ExpressRoute circuit. After this step has been completed, the connection between your on-premises network and Azure, through ExpressRoute, is established. For more information about the link operation, see [Link VNets to ExpressRoute](expressroute-howto-linkvnet-portal-resource-manager.md).

## To configure coexisting connections for an already existing VNet

If you have a virtual network that has only one virtual network gateway, for example, a Site-to-Site VPN gateway and you want to add another gateway of a different type, for example, ExpressRoute gateway, check the gateway subnet size. If the gateway subnet is /27 or larger, you can skip the following steps and follow the steps in the previous section to add either a Site-to-Site VPN gateway or an ExpressRoute gateway. If the gateway subnet is /28 or /29, you have to first delete the virtual network gateway and increase the gateway subnet size. The steps in this section show you how to do that.

1. Delete the existing ExpressRoute or Site-to-site VPN gateway.

1. Delete and recreate the GatewaySubnet to have prefix of /27 or shorter.

1. [Configure a VNet with a Site-to-Site connection](../vpn-gateway/tutorial-site-to-site-portal.md#VNetGateway) and then [Configure the ExpressRoute gateway](expressroute-howto-add-gateway-portal-resource-manager.md#create-the-virtual-network-gateway).

1. Once the ExpressRoute gateway is deployed, you can [link the virtual network to the ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md).

## To add point-to-site configuration to the VPN gateway

You can add a Point-to-Site configuration to your coexisting set by following the instruction in [Configuring Point-to-Site VPN connection using Azure certificate authentication](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#addresspool)

## To enable transit routing between ExpressRoute and Azure VPN

If you want to enable connectivity between one of your local networks that is connected to ExpressRoute and another of your local network that is connected to a site-to-site VPN connection, you need to set up [Azure Route Server](../route-server/expressroute-vpn-support.md).

## Next steps
For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).