---
title: 'Configure NAT on VPN Gateway'
titleSuffix: Azure VPN Gateway
description: Learn how to configure NAT for Azure VPN Gateway.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 03/30/2023
ms.author: cherylmc 

---
# How to configure NAT for Azure VPN Gateway

This article helps you configure NAT (Network Address Translation) for Azure VPN Gateway using the Azure portal.

## <a name="about"></a>About NAT

NAT defines the mechanisms to translate one IP address to another in an IP packet. It's commonly used to connect networks with overlapping IP address ranges. NAT rules or policies on the gateway devices connecting the networks specify the address mappings for the address translation on the networks.

For more information about NAT support for Azure VPN Gateway, see [About NAT and Azure VPN Gateway](nat-overview.md).

> [!IMPORTANT]
> * NAT is supported on the the following SKUs: VpnGw2~5, VpnGw2AZ~5AZ.

## Getting started

Each part of this article helps you form a basic building block for configuring NAT in your network connectivity. If you complete all three parts, you build the topology as shown in Diagram 1.

### <a name="diagram"></a>Diagram 1

:::image type="content" source="./media/nat-overview/vpn-nat.png" alt-text="Screenshot of diagram 1." lightbox="./media/nat-overview/vpn-nat.png" border="false":::

### Prerequisites

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

## <a name ="vnet"></a>Part 1: Create VNet and gateways

In this section, you create a virtual network, a VPN gateway, and the local network gateway resources to correspond to the resources shown in [Diagram 1](#diagram).

To create these resources, use the steps in the [Site-to-Site Tutorial](tutorial-site-to-site-portal.md) article. Complete the following sections of the article, but don't create any connections.

* [VNet](tutorial-site-to-site-portal.md#CreatVNet)
* [VPN gateway](tutorial-site-to-site-portal.md#VNetGateway)
* [Local network gateway](tutorial-site-to-site-portal.md#LocalNetworkGateway)
* [Configure your VPN device](tutorial-site-to-site-portal.md#VPNDevice)

>[!IMPORTANT]
> When using the steps in the following articles, do not create the **connection** resources in the articles. The operation will fail because the IP address spaces are the same between the VNet, Branch 1, and Branch 2. Use the steps in the following section to create the NAT rules, then create the connections with the NAT rules.
>

The following screenshots show examples of the resources to create.

* **VNet**

   :::image type="content" source="./media/nat-howto/vnet.png" alt-text="Screenshot showing VNet address space." lightbox="./media/nat-howto/vnet.png":::
* **VPN gateway**

   :::image type="content" source="./media/nat-howto/vpn-gateway.png" alt-text="Screenshot showing the gateway." lightbox="./media/nat-howto/vpn-gateway.png":::
* **Branch 1 local network gateway**

   :::image type="content" source="./media/nat-howto/branch-1.png" alt-text="Screenshot showing Branch 1 local network gateway." lightbox="./media/nat-howto/branch-1.png" :::

* **Branch 2 local network gateway**

   :::image type="content" source="./media/nat-howto/branch-2.png" alt-text="Screenshot showing Branch 2 local network gateway." lightbox="./media/nat-howto/branch-2.png":::

## <a name ="nat-rules"></a>Part 2: Create NAT rules

Before you create connections, you must create and save NAT rules on the VPN gateway. The following table shows the required NAT rules. Refer to [Diagram 1](#diagram) for the topology.

**NAT rules table**

| Name     | Type   | Mode        | Internal    | External     | Connection          |
| ---      | ---    | ---         | ---         | ---          | ---                 |
| VNet     | Static | EgressSNAT  | 10.0.1.0/24 | 100.0.1.0/24 | Both connections    |
| Branch_1 | Static | IngressSNAT | 10.0.1.0/24 | 100.0.2.0/24 | Branch 1 connection |
| Branch_2 | Static | IngressSNAT | 10.0.1.0/24 | 100.0.3.0/24 | Branch 2 connection |

Use the following steps to create all the NAT rules on the VPN gateway.

1. In the Azure portal, navigate to the **Virtual Network Gateway** resource page and select **NAT Rules**.
1. Using the **NAT rules table**, fill in the values.

   :::image type="content" source="./media/nat-howto/disable-bgp.png" alt-text="Screenshot showing NAT rules." lightbox="./media/nat-howto/disable-bgp.png":::
1. Click **Save** to save the NAT rules to the VPN gateway resource. This operation can take up to 10 minutes to complete.

## <a name ="connections"></a>Part 3: Create connections and link NAT rules

In this section, you create the connections, and then associate the NAT rules with the connections to implement the sample topology in [Diagram 1](#diagram).

### 1. Create connections

Follow the steps in [Create a site-to-site connection](tutorial-site-to-site-portal.md) article to create the two connections as shown in the following screenshot:

   :::image type="content" source="./media/nat-howto/connections.png" alt-text="Screenshot showing the Connections page." lightbox="./media/nat-howto/connections.png":::

### 2. Associate NAT rules with the connections

In this step, you associate the NAT rules with each connection resource.

1. In the Azure portal, navigate to the connection resources, and select **Configuration**.

1. Under Ingress NAT Rules, select the NAT rules created previously.

   :::image type="content" source="./media/nat-howto/config-nat.png" alt-text="Screenshot showing the configured NAT rules." lightbox="./media/nat-howto/config-nat.png":::

1. Click **Save** to apply the configurations to the connection resource.

1. Repeat the steps to apply the NAT rules for other connection resources.

1. If BGP is used, select **Enable BGP Route Translation** in the NAT rules page and click **Save**. Notice that the table now shows the connections linked with each NAT rule.

   :::image type="content" source="./media/nat-howto/enable-bgp.png" alt-text="Screenshot showing Enable BGP." lightbox="./media/nat-howto/enable-bgp.png":::

After completing these steps, you'll have a setup that matches the topology shown in [Diagram 1](#diagram).

## NAT limitations

[!INCLUDE [NAT limitations](../../includes/vpn-gateway-nat-limitations.md)]

## Next steps

Once your connection is complete, you can add virtual machines to your virtual networks. See [Create a Virtual Machine](../virtual-machines/windows/quick-create-portal.md) for steps.
