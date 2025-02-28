---
title: 'Configure a VNet-to-VNet VPN gateway connection: Azure portal'
titleSuffix: Azure VPN Gateway
description: Learn how to create a VPN gateway connection between virtual networks.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 11/01/2024
ms.author: cherylmc

# Do not change VNet-to-VNet to another wording, such as Net-to-Net. VNet-to-VNet is the correct term and is the value used by Azure to denote this specific type of connection. It is different than a typical network connection.
---

# Configure a VNet-to-VNet VPN connection - Azure portal

This article helps you connect your virtual networks using the VNet-to-VNet connection type in the Azure portal. When you use the portal to connect virtual networks using VNet-to-VNet, the virtual networks can be in different regions, but must be in the same subscription. If your virtual networks are in different subscriptions, use the [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md) instructions instead. This article doesn't apply to virtual network peering. For virtual network peering, see the [Virtual Network peering](../virtual-network/virtual-network-peering-overview.md) article.

:::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/vnet-vnet-diagram.png" alt-text="Diagram of a VNet-to-VNet connection." lightbox="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/vnet-vnet-diagram.png":::

## About VNet-to-VNet connections

Configuring a VNet-to-VNet connection is a simple way to connect virtual networks. When you connect a virtual network to another virtual network with a VNet-to-VNet connection type, it's similar to creating a site-to-site IPsec connection to an on-premises location. Both connection types use a VPN gateway to provide a secure tunnel with IPsec/IKE and function the same way when communicating. However, they differ in the way the local network gateway is configured.

* When you create a VNet-to-VNet connection, the local network gateway address space is automatically created and populated. However, the local network gateway isn't visible in this configuration. That means that you can't configure it manually.

* If you update the address space for one VNet, the other VNet automatically routes to the updated address space.

* It's typically faster and easier to create a VNet-to-VNet connection than a site-to-site connection.

* If you know you want to specify more address spaces for the local network gateway, or plan to add more connections later and need to adjust the local network gateway, create the configuration using the [site-to-site connection](./tutorial-site-to-site-portal.md) steps instead.
* The VNet-to-VNet connection doesn't include point-to-site client pool address space. If you need transitive routing for point-to-site clients, then create a site-to-site connection between the virtual network gateways, or use virtual network peering.

### Why create a VNet-to-VNet connection?

You might want to connect virtual networks by using a VNet-to-VNet connection for the following reasons:

* Cross region geo-redundancy and geo-presence

  * You can set up your own geo-replication or synchronization with secure connectivity without going over internet-facing endpoints.
  * With Azure Traffic Manager and Azure Load Balancer, you can set up highly available workload with geo-redundancy across multiple Azure regions. For example, you can set up SQL Server Always On availability groups across multiple Azure regions.

* Regional multi-tier applications with isolation or administrative boundaries

   Within the same region, you can set up multi-tier applications with multiple virtual networks that are connected together because of isolation or administrative requirements. VNet-to-VNet communication can be combined with multi-site configurations. These configurations let you establish network topologies that combine cross-premises connectivity with inter-virtual network connectivity, as shown in the following diagram:

   :::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/connections-diagram.png" alt-text="Diagram of a VNet-to-VNet connection showing multiple subscriptions." lightbox="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/connections-diagram.png":::

## Create and configure VNet1

If you already have a VNet, verify that the settings are compatible with your VPN gateway design. Pay particular attention to any subnets that might overlap with other networks. Your connection won't work properly if you have overlapping subnets.

In this section, create VNet1 using the following values. If you're using your own values, make sure the address spaces don't overlap with any of the virtual networks to which you want to connect.

* **Virtual network settings**
  * **Name**: VNet1
  * **Address space**: 10.1.0.0/16
  * **Subscription**: Select the subscription you want to use.
  * **Resource group**: TestRG1
  * **Location**: East US
  * **Subnet**
    * **Name**: FrontEnd
    * **Address range**: 10.1.0.0/24

[!INCLUDE [Create a virtual network](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

### Create the gateway subnet

[!INCLUDE [About gateway subnets](../../includes/vpn-gateway-about-gwsubnet-portal-include.md)]

[!INCLUDE [Create gateway subnet](../../includes/vpn-gateway-create-gateway-subnet-portal-include.md)]

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

### Create the VNet1 VPN gateway

In this step, you create the virtual network gateway for your virtual network. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. For gateway SKU pricing, see [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/).

Create a virtual network gateway (VPN gateway) by using the following values:

* **Name**: VNet1GW
* **Gateway type**: VPN
* **SKU**: VpnGw2AZ
* **Generation**: Generation 2
* **Virtual network**: VNet1
* **Gateway subnet address range**: 10.1.255.0/27
* **Public IP address**: Create new
* **Public IP address name:** VNet1GWpip1
* **Public IP address SKU:** Standard
* **Assignment:** Static
* **Second Public IP address name:** VNet1GWpip2
* **Enable active-active mode**: Enabled

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-azgw-portal-include.md)]

[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-azgw-pip-portal-include.md)]

A gateway can take 45 minutes or more to fully create and deploy. You can see the deployment status on the **Overview** page for your gateway. After the gateway is created, you can view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## Create and configure VNet4

After you've configured VNet1, create VNet4 and the VNet4 gateway by repeating the previous steps and replacing the values with VNet4 values. You don't need to wait until the virtual network gateway for VNet1 has finished creating before you configure VNet4. If you're using your own values, make sure the address spaces don't overlap with any of the virtual networks to which you want to connect.

You can use the following examples values to configure VNet4 and the VNet4 gateway.

* **Virtual network settings**
  * **Name**: VNet4
  * **Address space**: 10.41.0.0/16
  * **Subscription**: Select the subscription you want to use.
  * **Resource group**: TestRG4
  * **Location**: West US 2
  * **Subnet**
    * **Name**: FrontEnd
    * **Address range**: 10.41.0.0/24

Add the gateway subnet:

* **Name**: GatewaySubnet
* **Gateway subnet address range**: 10.41.255.0/27

### Configure the VNet4 VPN gateway

You can use the following examples values to configure the VNet4 VPN gateway.

* **Virtual network gateway settings**
  * **Name**: VNet4GW
  * **Resource group**: West US 2
  * **Generation**: Generation 2
  * **Gateway type**: Select **VPN**.
  * **VPN type**: Select **Route-based**.
  * **SKU**: VpnGw2AZ
  * **Generation**: Generation2
  * **Virtual network**: VNet4
  * **Public IP address name:** VNet4GWpip1
  * **Public IP address SKU:** Standard
  * **Assignment:** Static
  * **Second Public IP address name:** VNet4GWpip2
  * **Enable active-active mode**: Enabled

## Configure your connections

When the VPN gateways for both VNet1 and VNet4 have completed, you can create your virtual network gateway connections.

Virtual networks in the same subscription can be connected using the portal, even if they are in different resource groups. However, if your virtual networks are in different subscriptions, you must use [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md) or CLI to make the connections.

You can create either a bidirectional, or a single direction connection. For this exercise, we'll specify a bidirectional connection. The bidirectional connection value creates two separate connections so that traffic can flow in both directions.

1. In the portal, go to **VNet1GW**.
1. On the virtual network gateway page, in the left pane, select **Connections** to open the Connections page. Then select **+ Add** to open the **Create connection** page.

1. On the **Create connection** page, fill in the connection values.

    :::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/bidirectional-connectivity.png" alt-text="Screenshot showing the Create Connection page." lightbox="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/bidirectional-connectivity.png":::
  
   * **Connection type**: Select **VNet-to-VNet** from the drop-down.
   * **Establish bidirectional connectivity**: Select this value if you want to establish traffic flow in both directions. If you don't select this setting and you later want to add a connection in the opposite direction, you'll need to create a new connection originating from the other virtual network gateway.
   * **First connection name**: VNet1-to-VNet4
   * **Second connection name**: VNet4-to-VNet1
   * **Region**: East US (the region for VNet1GW)

1. Click **Next : Settings >** at the bottom of the page to advance to the **Settings** page.
1. On the **Settings** page, specify the following values:

   * **First virtual network gateway**: Select **VNet1GW** from the dropdown.
   * **Second virtual network gateway**: Select **VNet4GW** from the dropdown.
   * **Shared key (PSK)**: In this field, enter a shared key for your connection. You can generate or create this key yourself. In a site-to-site connection, the key you use is the same for your on-premises device and your virtual network gateway connection. The concept is similar here, except that rather than connecting to a VPN device, you're connecting to another virtual network gateway. The important thing when specifying a shared key is that it's exactly the same for both sides of the connection.
   * **IKE Protocol**: IKEv2
1. For this exercise, you can leave the rest of the settings as their default values.
1. Select **Review + create**, then **Create** to validate and create your connections.

## Verify your connections

1. Locate the virtual network gateway in the Azure portal. For example, **VNet1GW**.

1. On the **Virtual network gateway** page, select **Connections** to view the **Connections** page for the virtual network gateway. After the connection is established, you'll see the **Status** values change to **Connected**.

1. Under the **Name** column, select one of the connections to view more information. When data begins flowing, you'll see values for **Data in** and **Data out**.

## Add more connections

You can create another VNet-to-VNet connection, or create an IPsec site-to-site connection to an on-premises location.

* Before you create more connections, verify that the address space for your virtual network doesn't overlap with any of the address spaces you want to connect to.
* When you configure a new connection, be sure to adjust the **Connection type** to match the type of connection you want to create. If you're adding a [site-to-site connection](./tutorial-site-to-site-portal.md), you must create a local network gateway before you can create the connection.

* When you configure a connection that uses a shared key, make sure that the shared key is exactly the same for both sides of the connection.

To create more connections, follow these steps:

1. In the Azure portal, go to the VPN gateway from which you want to create the connection.
1. In the left pane, select **Connections**. View the existing connections.
1. Create the new connection.

## VNet-to-VNet FAQ

See the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#V2VMulti) for VNet-to-VNet frequently asked questions.

## Next steps

* For information about how you can limit network traffic to resources in a virtual network, see [Network Security](../virtual-network/network-security-groups-overview.md).

* For information about how Azure routes traffic between Azure, on-premises, and Internet resources, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md).
