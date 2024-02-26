---
title: 'Add or remove site-to-site connections'
description: Learn how to add or remove site-to-site connections from a VPN gateway.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 10/25/2023
ms.author: cherylmc

---
# Add or remove VPN Gateway site-to-site connections

This article helps you add or remove site-to-site (S2S) connections for a VPN gateway. You can also add S2S connections to a VPN gateway that already has a S2S connection, point-to-site connection, or VNet-to-VNet connection. There are some limitations when adding connections. Check the [Prerequisites](#before) section in this article to verify before you start your configuration.

:::image type="content" source="./media/add-remove-site-to-site-connections/multi-site.png" alt-text="Diagram of site-to-site VPN Gateway cross-premises connection with multiple sites." lightbox="./media/add-remove-site-to-site-connections/multi-site.png":::

**About ExpressRoute/site-to-site coexisting connections**

* You can use the steps in this article to add a new VPN connection to an already existing ExpressRoute/site-to-site coexisting connection.
* You can't use the steps in this article to configure a new ExpressRoute/site-to-site coexisting connection. To create a new coexisting connection, see: [ExpressRoute/S2S coexisting connections](../expressroute/expressroute-howto-coexist-resource-manager.md).

## <a name="before"></a>Prerequisites

Verify the following items:

* You're NOT configuring a new coexisting ExpressRoute and VPN Gateway site-to-site connection.
* You have a virtual network that was created using the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md) with an existing connection.
* The virtual network gateway for your virtual network is RouteBased. If you have a PolicyBased VPN gateway, you must delete the virtual network gateway and create a new VPN gateway as RouteBased.
* None of the address ranges overlap for any of the virtual networks that this virtual network is connecting to.
* You have compatible VPN device and someone who is able to configure it. See [About VPN Devices](vpn-gateway-about-vpn-devices.md). If you aren't familiar with configuring your VPN device, or are unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you.
* You have an externally facing public IP address for your VPN device.

## <a name="local"></a>Create a local network gateway

Create a local network gateway that represents the branch or location you want to connect to.

The local network gateway is a specific object that represents your on-premises location (the site) for routing purposes. You give the site a name by which Azure can refer to it, then specify the IP address of the on-premises VPN device to which you'll create a connection. You also specify the IP address prefixes that will be routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes or you need to change the public IP address for the VPN device, you can easily update the values later.

In this example, we create a local network gateway using the following values.

* **Name:** Site1
* **Resource Group:** TestRG1
* **Location:** East US

[!INCLUDE [Add local network gateway](../../includes/vpn-gateway-add-local-network-gateway-portal-include.md)]

## <a name="VPNDevice"></a>Configure your VPN device

Site-to-site connections to an on-premises network require a VPN device. In this step, you configure your VPN device. When configuring your VPN device, you need the following values:

* A shared key. This is the same shared key that you specify when creating your site-to-site VPN connection. In our examples, we use a basic shared key. We recommend that you generate a more complex key to use.
* The public IP address of your virtual network gateway. You can view the public IP address by using the Azure portal, PowerShell, or CLI. To find the public IP address of your VPN gateway using the Azure portal, go to **Virtual network gateways**, then select the name of your gateway.

[!INCLUDE [Configure VPN device](../../includes/vpn-gateway-configure-vpn-device-include.md)]

## <a name="configure"></a>Configure a connection

Create a site-to-site VPN connection between your virtual network gateway and your on-premises VPN device.

Create a connection using the following values:

* **Local network gateway name:** Site1
* **Connection name:** VNet1toSite1
* **Shared key:** For this example, we use abc123. But, you can use whatever is compatible with your VPN hardware. The important thing is that the values match on both sides of the connection.

[!INCLUDE [Add a S2S connection](../../includes/vpn-gateway-add-site-to-site-connection-portal-include.md)]

## <a name="verify"></a>View and verify the VPN connection

[!INCLUDE [Verify a connection](../../includes/vpn-gateway-verify-connection-portal-include.md)]

## Remove a connection

[!INCLUDE [Remove a connection](../../includes/vpn-gateway-remove-connections.md)]

## Next steps

For more information about site-to-site VPN gateway configurations, see [Tutorial: Configure a site-to-site VPN gateway configuration](tutorial-site-to-site-portal.md).
