---
title: 'Configure a VNet-to-VNet VPN gateway connection: Azure portal'
titleSuffix: Azure VPN Gateway
description: Learn how to create a VPN gateway connection between VNets.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/17/2023
ms.author: cherylmc

---
# Configure a VNet-to-VNet VPN gateway connection - Azure portal

This article helps you connect virtual networks (VNets) by using the VNet-to-VNet connection type using the Azure portal. The virtual networks can be in different regions and from different subscriptions. When you connect VNets from different subscriptions, the subscriptions don't need to be associated with the same Active Directory tenant. This type of configuration creates a connection between two virtual network gateways. This article doesn't apply to VNet peering. For VNet peering, see the [Virtual Network peering](../virtual-network/virtual-network-peering-overview.md) article.

:::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/vnet-vnet-diagram.png" alt-text="VNet to VNet diagram.":::

You can create this configuration using various tools, depending on the deployment model of your VNet. The steps in this article apply to the Azure [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md) and the Azure portal. To switch to a different deployment model or deployment method article, use the dropdown.

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md)
> * [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md)
> * [Azure CLI](vpn-gateway-howto-vnet-vnet-cli.md)
> * [Azure portal (classic)](vpn-gateway-howto-vnet-vnet-portal-classic.md)
> * [Connect different deployment models - Azure portal](vpn-gateway-connect-different-deployment-models-portal.md)
> * [Connect different deployment models - PowerShell](vpn-gateway-connect-different-deployment-models-powershell.md)
>

## About connecting VNets

The following sections describe the different ways to connect virtual networks.

### VNet-to-VNet

Configuring a VNet-to-VNet connection is a simple way to connect VNets. When you connect a virtual network to another virtual network with a VNet-to-VNet connection type (VNet2VNet), it's similar to creating a Site-to-Site IPsec connection to an on-premises location. Both connection types use a VPN gateway to provide a secure tunnel with IPsec/IKE and function the same way when communicating. However, they differ in the way the local network gateway is configured.

When you create a VNet-to-VNet connection, the local network gateway address space is automatically created and populated. If you update the address space for one VNet, the other VNet automatically routes to the updated address space. It's typically faster and easier to create a VNet-to-VNet connection than a Site-to-Site connection. However, the local network gateway isn't visible in this configuration.

* If you know you want to specify additional address spaces for the local network gateway, or plan to add additional connections later and need to adjust the local network gateway, you should create the configuration using the Site-to-Site steps. 
* The VNet-to-VNet connection doesn't include Point-to-Site client pool address space. If you need transitive routing for Point-to-Site clients, then create a Site-to-Site connection between the virtual network gateways, or use VNet peering.

### Site-to-Site (IPsec)

If you're working with a complicated network configuration, you may prefer to connect your VNets by using a [Site-to-Site connection](./tutorial-site-to-site-portal.md) instead. When you follow the Site-to-Site IPsec steps, you create and configure the local network gateways manually. The local network gateway for each VNet treats the other VNet as a local site. These steps allow you to specify additional address spaces for the local network gateway to route traffic. If the address space for a VNet changes, you must manually update the corresponding local network gateway.

### VNet peering

You can also connect your VNets by using VNet peering.

* VNet peering doesn't use a VPN gateway and has different constraints.
* [VNet peering pricing](https://azure.microsoft.com/pricing/details/virtual-network) is calculated differently than [VNet-to-VNet VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway).
* For more information about VNet peering, see the [Virtual Network peering](../virtual-network/virtual-network-peering-overview.md) article.

## Why create a VNet-to-VNet connection?

You may want to connect virtual networks by using a VNet-to-VNet connection for the following reasons:

### Cross region geo-redundancy and geo-presence

* You can set up your own geo-replication or synchronization with secure connectivity without going over internet-facing endpoints.
* With Azure Traffic Manager and Azure Load Balancer, you can set up highly available workload with geo-redundancy across multiple Azure regions. For example, you can set up SQL Server Always On availability groups across multiple Azure regions.

### Regional multi-tier applications with isolation or administrative boundaries

* Within the same region, you can set up multi-tier applications with multiple virtual networks that are connected together because of isolation or administrative requirements.

VNet-to-VNet communication can be combined with multi-site configurations. These configurations let you establish network topologies that combine cross-premises connectivity with inter-virtual network connectivity, as shown in the following diagram:

:::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/connections-diagram.png" alt-text="VNet connections diagram.":::

This article shows you how to connect VNets by using the VNet-to-VNet connection type. When you follow these steps as an exercise, you can use the following example settings values. In the example, the virtual networks are in the same subscription, but in different resource groups. If your VNets are in different subscriptions, you can't create the connection in the portal. Use [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md) or [CLI](vpn-gateway-howto-vnet-vnet-cli.md) instead. For more information about VNet-to-VNet connections, see [VNet-to-VNet FAQ](#vnet-to-vnet-faq).

### Example settings

**Values for VNet1:**

* **Virtual network settings**
  * **Name**: VNet1
  * **Address space**: 10.1.0.0/16
  * **Subscription**: Select the subscription you want to use.
  * **Resource group**: TestRG1
  * **Location**: East US
  * **Subnet**
    * **Name**: FrontEnd
    * **Address range**: 10.1.0.0/24

* **Virtual network gateway settings**
  * **Name**: VNet1GW
  * **Resource group**: East US
  * **Generation**: Generation 2
  * **Gateway type**: Select **VPN**.
  * **VPN type**: Select **Route-based**.
  * **SKU**: VpnGw2
  * **Generation**: Generation2
  * **Virtual network**: VNet1
  * **Gateway subnet address range**: 10.1.255.0/27
  * **Public IP address**: Create new
  * **Public IP address name**: VNet1GWpip
  * **Enable active-active mode**: Disabled
  * **Configure BGP**: Disabled

* **Connection**
  * **Name**: VNet1toVNet4
  * **Shared key**: You can create the shared key yourself. When you create the connection between the VNets, the values must match. For this exercise, use abc123.

**Values for VNet4:**

* **Virtual network settings**
  * **Name**: VNet4
  * **Address space**: 10.41.0.0/16
  * **Subscription**: Select the subscription you want to use.
  * **Resource group**: TestRG4
  * **Location**: West US
  * **Subnet**
  * **Name**: FrontEnd
  * **Address range**: 10.41.0.0/24

* **Virtual network gateway settings**
  * **Name**: VNet4GW
  * **Resource group**: West US
  * **Generation**: Generation 2
  * **Gateway type**: Select **VPN**.
  * **VPN type**: Select **Route-based**.
  * **SKU**: VpnGw2
  * **Generation**: Generation2
  * **Virtual network**: VNet4
  * **Gateway subnet address range**: 10.41.255.0/27
  * **Public IP address**: Create new
  * **Public IP address name**: VNet4GWpip
  * **Enable active-active mode**: Disabled
  * **Configure BGP**: Disabled

* **Connection**
  * **Name**: VNet4toVNet1
  * **Shared key**: You can create the shared key yourself. When you create the connection between the VNets, the values must match. For this exercise, use abc123.

## Create and configure VNet1

If you already have a VNet, verify that the settings are compatible with your VPN gateway design. Pay particular attention to any subnets that may overlap with other networks. Your connection won't work properly if you have overlapping subnets.

### To create a virtual network

[!INCLUDE [About cross-premises addresses](../../includes/vpn-gateway-cross-premises.md)]

[!INCLUDE [Create a virtual network](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

## Create the VNet1 gateway

In this step, you create the virtual network gateway for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. For gateway SKU pricing, see [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/). If you're creating this configuration as an exercise, see the [Example settings](#example-settings).

[!INCLUDE [About gateway subnets](../../includes/vpn-gateway-about-gwsubnet-portal-include.md)]

### To create a virtual network gateway

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gw-portal-include.md)]
[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-gw-pip-portal-include.md)]

You can see the deployment status on the Overview page for your gateway. A gateway can take 45 minutes or more to fully create and deploy. After the gateway is created, you can view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## Create and configure VNet4

After you've configured VNet1, create VNet4 and the VNet4 gateway by repeating the previous steps and replacing the values with VNet4 values. You don't need to wait until the virtual network gateway for VNet1 has finished creating before you configure VNet4. If you're using your own values, make sure the address spaces don't overlap with any of the VNets to which you want to connect.

## Configure your connections

When the VPN gateways for both VNet1 and VNet4 have completed, you can create your virtual network gateway connections.

VNets in the same subscription can be connected using the portal, even if they are in different resource groups. However, if your VNets are in different subscriptions, you must use [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md) to make the connections.

You can create either a bidirectional, or single direction connection. For this exercise, we'll specify a bidirectional connection. The bidirectional connection value creates two separate connections so that traffic can flow in both directions.

1. In the portal, go to **VNet1GW**.
1. On the virtual network gateway page, go to **Connections**. Select **+Add**.

   :::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/connections-add.png" alt-text="Screenshot showing the connections page." lightbox="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/connections-add.png":::

1. On the **Create connection** page, fill in the connection values.

    :::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/bidirectional-connectivity.png" alt-text="Screenshot showing the Create Connection page." lightbox="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/bidirectional-connectivity.png":::
  
   * **Connection type**: Select **VNet-to-VNet** from the drop-down.
   * **Establish bidirectional connectivity**: Select this value
   * **First connection name**: VNet1-to-VNet4
   * **Second connection name**: VNet4-to-VNet1
   * **Region**: East US (the region for VNet1GW)

1. Click **Next : Settings >** at the bottom of the page to advance to the **Settings** page.
1. On the **Settings** page, specify the following values:

   * **First virtual network gateway**: Select **VNet1GW** from the dropdown.
   * **Second virtual network gateway**: Select **VNet4GW** from the dropdown.
   * **Shared key (PSK)**: In this field, enter a shared key for your connection. You can generate or create this key yourself. In a site-to-site connection, the key you use is the same for your on-premises device and your virtual network gateway connection. The concept is similar here, except that rather than connecting to a VPN device, you're connecting to another virtual network gateway.
   * **IKE Protocol**: IKEv2
1. For this exercise, you can leave the rest of the settings as their default values.
1. Select **Review + create**, then **Create** to validate and create your connections.

## Verify your connections

1. Locate the virtual network gateway in the Azure portal. For example, **VNet1GW**
1. On the **Virtual network gateway** page, select **Connections** to view the **Connections** page for the virtual network gateway. After the connection is established, you'll see the **Status** values change to **Connected**.

   :::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/connection-status.png" alt-text="Screenshot connection status." lightbox="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/connection-status.png":::

1. Under the **Name** column, select one of the connections to view more information. When data begins flowing, you'll see values for **Data in** and **Data out**.

   :::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/status.png" alt-text="Screenshot shows a resource group with values for Data in and Data out." lightbox="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/status.png":::

## Add additional connections

If you want to add additional connections, navigate to the virtual network gateway from which you want to create the connection, then select **Connections**. You can create another VNet-to-VNet connection, or create an IPsec Site-to-Site connection to an on-premises location. Be sure to adjust the **Connection type** to match the type of connection you want to create. Before you create additional connections, verify that the address space for your virtual network doesn't overlap with any of the address spaces you want to connect to. For steps to create a Site-to-Site connection, see [Create a Site-to-Site connection](./tutorial-site-to-site-portal.md).

## VNet-to-VNet FAQ

See the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#V2VMulti) for VNet-to-VNet frequently asked questions.

## Next steps

* For information about how you can limit network traffic to resources in a virtual network, see [Network Security](../virtual-network/network-security-groups-overview.md).

* For information about how Azure routes traffic between Azure, on-premises, and Internet resources, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md).
