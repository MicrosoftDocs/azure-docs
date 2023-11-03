---
title: 'Configure NAT on VPN Gateway'
titleSuffix: Azure VPN Gateway
description: Learn how to configure NAT for Azure VPN Gateway.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 05/02/2023
ms.author: cherylmc 

---
# How to configure NAT for Azure VPN Gateway

This article helps you configure NAT (Network Address Translation) for Azure VPN Gateway using the Azure portal.

## <a name="about"></a>About NAT

NAT defines the mechanisms to translate one IP address to another in an IP packet. It's commonly used to connect networks with overlapping IP address ranges. NAT rules or policies on the gateway devices connecting the networks specify the address mappings for the address translation on the networks.

For more information about NAT support for Azure VPN Gateway, see [About NAT and Azure VPN Gateway](nat-overview.md).

> [!IMPORTANT]
> * NAT is supported on the following SKUs: VpnGw2~5, VpnGw2AZ~5AZ.

## Getting started

Each part of this article helps you form a basic building block for configuring NAT in your network connectivity. If you complete all three parts, you build the topology as shown in Diagram 1.

### <a name="diagram"></a>Diagram 1

:::image type="content" source="./media/nat-overview/vpn-nat.png" alt-text="Diagram showing NAT configuration and rules." lightbox="./media/nat-overview/vpn-nat.png":::

### Prerequisites

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

## <a name ="vnet"></a>Part 1: Create VNet and gateways

In this section, you create a virtual network, a VPN gateway, and the local network gateway resources to correspond to the resources shown in [Diagram 1](#diagram). To create these resources, you can use the steps in the [Site-to-Site Tutorial](tutorial-site-to-site-portal.md) article. Complete the following sections of the article, but don't create any connections.

* [VNet](tutorial-site-to-site-portal.md#CreatVNet)
* [VPN gateway](tutorial-site-to-site-portal.md#VNetGateway)
* [Local network gateway](tutorial-site-to-site-portal.md#LocalNetworkGateway)
* [Configure your VPN device](tutorial-site-to-site-portal.md#VPNDevice)

> [!IMPORTANT]
> Don't create any connections. If you try to create connection resources, the operation fails because the IP address spaces are the same between the VNet, Branch1, and Branch2. You'll create connection resources later in this article.

The following screenshots show examples of the resources to create.

* **VNet**

   :::image type="content" source="./media/nat-howto/vnet.png" alt-text="Screenshot showing VNet address space." lightbox="./media/nat-howto/vnet.png":::
* **VPN gateway**

   :::image type="content" source="./media/nat-howto/vpn-gateway.png" alt-text="Screenshot showing the gateway." lightbox="./media/nat-howto/vpn-gateway.png":::

* **Branch1 local network gateway**

   :::image type="content" source="./media/nat-howto/branch-1.png" alt-text="Screenshot showing Branch1 local network gateway." lightbox="./media/nat-howto/branch-1.png" :::

* **Branch2 local network gateway**

   :::image type="content" source="./media/nat-howto/branch-2.png" alt-text="Screenshot showing Branch2 local network gateway." lightbox="./media/nat-howto/branch-2.png":::

## <a name ="nat-rules"></a>Part 2: Create NAT rules

Before you create connections, you must create and save NAT rules on the VPN gateway. The following table shows the required NAT rules. Refer to [Diagram 1](#diagram) for the topology.

**NAT rules table**

| Name     | Type   | Mode        | Internal    | External     | Connection          |
| ---      | ---    | ---         | ---         | ---          | ---                 |
| VNet     | Static | EgressSNAT  | 10.0.1.0/24 | 100.0.1.0/24 | Both connections    |
| Branch1 | Static | IngressSNAT | 10.0.1.0/24 | 100.0.2.0/24 | Branch1 connection |
| Branch2 | Static | IngressSNAT | 10.0.1.0/24 | 100.0.3.0/24 | Branch2 connection |

Use the following steps to create all the NAT rules on the VPN gateway. If you're using BGP, select **Enable** for the Enable Bgp Route Translation setting.

1. In the Azure portal, navigate to the **Virtual Network Gateway** resource page and select **NAT Rules** from the left pane.
1. Using the **NAT rules table**, fill in the values. If you're using BGP, select **Enable** for the **Enable Bgp Route Translation** setting.

   :::image type="content" source="./media/nat-howto/disable-bgp.png" alt-text="Screenshot showing NAT rules." lightbox="./media/nat-howto/disable-bgp.png":::
1. Click **Save** to save the NAT rules to the VPN gateway resource. This operation can take up to 10 minutes to complete.

## <a name ="connections"></a>Part 3: Create connections and link NAT rules

In this section, you create the connections and associate the NAT rules in the same step. Note that if you create the connection objects first, without linking the NAT rules at the same time, the operation fails because the IP address spaces are the same between the VNet, Branch1, and Branch2.

The connections and the NAT rules are specified in the sample topology shown in [Diagram 1](#diagram).

1. Go to the VPN gateway.
1. On the **Connections** page, select **+Add** to open the **Add connection** page.
1. On the **Add connection** page, fill in the values for the VNet-Branch1 connection, specifying the associated NAT rules, as shown in the following screenshot. For Ingress NAT rules, select Branch1. For Egress NAT rules, select VNet. If you are using BGP, you can select **Enable BGP**.

   :::image type="content" source="./media/nat-howto/branch-1-connection.png" alt-text="Screenshot showing the VNet-Branch1 connection." lightbox="./media/nat-howto/branch-1-connection.png":::
1. Click **OK** to create the connection.
1. Repeat the steps to create the VNet-Branch2 connection. For Ingress NAT rules, select Branch2. For Egress NAT rules, select VNet.
1. After configuring both connections, your configuration should look similar to the following screenshot. The status changes to **Connected** when the connection is established.

   :::image type="content" source="./media/nat-howto/all-connections.png" alt-text="Screenshot showing all connections." lightbox="./media/nat-howto/all-connections.png":::

1. When you have completed the configuration, the NAT rules look similar to the following screenshot, and you'll have a topology that matches the topology shown in [Diagram 1](#diagram). Notice that the table now shows the connections that are linked with each NAT rule.

   If you want to enable BGP Route Translation for your connections, select **Enable** then click **Save**.

   :::image type="content" source="./media/nat-howto/all-nat-rules.png" alt-text="Screenshot showing the NAT rules." lightbox="./media/nat-howto/all-nat-rules.png":::

## NAT limitations

[!INCLUDE [NAT limitations](../../includes/vpn-gateway-nat-limitations.md)]

## Next steps

Once your connection is complete, you can add virtual machines to your virtual networks. See [Create a Virtual Machine](../virtual-machines/windows/quick-create-portal.md) for steps.
