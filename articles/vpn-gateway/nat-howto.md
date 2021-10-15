---
title: 'Configure NAT on Azure VPN Gateway'
titleSuffix: Azure VPN Gateway
description: Learn how to configure NAT on Azure VPN Gateway.
services: vpn-gateway
author: yushwang

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 06/24/2021
ms.author: yushwang 

---
# How to configure NAT on Azure VPN Gateways (Preview)

This article helps you configure NAT (Network Address Translation) on Azure VPN Gateway using the Azure portal.

## <a name="about"></a>About NAT

NAT defines the mechanisms to translate one IP address to another in an IP packet. It is commonly used to connect networks with overlapping IP address ranges. NAT rules or policies on the gateway devices connecting the networks specify the address mappings for the address translation on the networks.

For more information about NAT support on Azure VPN gateway, see [About NAT on Azure VPN Gateways](nat-overview.md).

> [!IMPORTANT] 
> Azure NAT for VPN gateway is currently in preview. 
> * Be sure to read the **[Preview limitations](#limits)** section of this article.
> * Azure VPN gateway NAT supports static, 1:1 NAT rules only. Dynamic NAT rules are not supported.
> * NAT is supported on the the following SKUs: VpnGw2~5, VpnGw2AZ~5AZ.

## Getting started

Each part of this article helps you form a basic building block for configuring NAT in your network connectivity. If you complete all three parts, you build the topology as shown in Diagram 1.

### <a name="diagram"></a>Diagram 1

:::image type="content" source="./media/nat-overview/vpn-nat.png" alt-text="Screenshot of diagram 1." lightbox="./media/nat-overview/vpn-nat.png" border="false":::

### Prerequisites

* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
* Review the [Preview limitations](#limits).

## <a name ="vnet"></a>Part 1: Create VNet and gateways

In this section, you create a virtual network, VPN gateway, and the local network gateway resources to correspond to the resources shown in [Diagram 1](#diagram).

To create these resources, use the steps in the [Site-to-Site Tutorial](tutorial-site-to-site-portal.md) article. Complete the following sections of the article, but don't create any connections.

* [VNet](tutorial-site-to-site-portal.md#CreatVNet)
* [VPN gateway](tutorial-site-to-site-portal.md#VNetGateway)
* [Local network gateway](tutorial-site-to-site-portal.md#LocalNetworkGateway)
* [Configure your VPN device](tutorial-site-to-site-portal.md#VPNDevice)


>[!IMPORTANT]
>  When using the steps in the following articles, do not create the **connection** resources in the articles. The operation will fail because the IP address spaces are the same between the VNet, Branch 1, and Branch 2. Use the steps in the following section to create the NAT rules, then create the connections with the NAT rules.
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

   > [!IMPORTANT] 
   > During preview, if the local network gateway address space is the same or smaller than the VNet address space, use **BGP** and leave the local network gateway address space field **blank**. Static routing (non-BGP) is not supported in this scenario during preview.
   >

## <a name ="nat-rules"></a>Part 2: Create NAT rules

Before you create connections, you must create and save NAT rules on the VPN gateway. The following table shows the required NAT rules. Refer to [Diagram 1](#diagram) for the topology.

**NAT rules table**

| Name     | Type   | Mode        | Internal    | External     | Connection          |
| ---      | ---    | ---         | ---         | ---          | ---                 |
| VNet     | Static | EgressSNAT  | 10.0.1.0/24 | 100.0.1.0/24 | Both connections    | 
| Branch_1 | Static | IngressSNAT | 10.0.1.0/24 | 100.0.2.0/24 | Branch 1 connection |
| Branch_2 | Static | IngressSNAT | 10.0.1.0/24 | 100.0.3.0/24 | Branch 2 connection |

Use the following steps to create all the NAT rules on the VPN gateway.

1. In the Azure portal, navigate to the **Virtual Network Gateway** resource page and select **NAT Rules (Preview)**.
1. Using the **NAT rules table** above, fill in the values.

   :::image type="content" source="./media/nat-howto/nat-rules.png" alt-text="Screenshot showing NAT rules." lightbox="./media/nat-howto/nat-rules.png":::
1. Click **Save** to save the NAT rules to the VPN gateway resource. This operation can take up to 10 minutes to complete.

## <a name ="connections"></a>Part 3: Create connections and link NAT rules

In this section, you create the connections, and then associate the NAT rules with the connections to implement the sample topology in [Diagram 1](#diagram).

### 1. Create connections

Follow the steps in [Create a site-to-site connection](tutorial-site-to-site-portal.md) article to create the two connections as shown below:

   :::image type="content" source="./media/nat-howto/connections.png" alt-text="Screenshot showing the Connections page." lightbox="./media/nat-howto/connections.png":::

### 2. Associate NAT rules with the connections

In this step, you associate the NAT rules with each connection resource.

1. In the Azure portal, navigate to the connection resources, and select **Configuration**.

1. Under Ingress NAT Rules, select the NAT rules created previously.

   :::image type="content" source="./media/nat-howto/config-nat.png" alt-text="Screenshot showing the configured NAT rules." lightbox="./media/nat-howto/config-nat.png":::

1. Click **Save** to apply the configurations to the connection resource.

1. Repeat the steps to apply the NAT rules for other connection resources.

1. If BGP is used, select **Enable BGP Route Translation** in the NAT rules page and click **Save**. Note that the table now shows the connections linked with each NAT rule.

   :::image type="content" source="./media/nat-howto/nat-rules-linked.png" alt-text="Screenshot showing Enable BGP." lightbox="./media/nat-howto/nat-rules-linked.png":::

After completing these steps, you will have a setup that matches the topology shown in [Diagram 1](#diagram).

## <a name ="limits"></a>Preview limitations

> [!IMPORTANT] 
> There are a few constraints during the NAT feature preview. Some of these will be addressed before GA.
>

* Azure VPN gateway NAT supports static, 1:1 NAT rules only. Dynamic NAT rules are not supported.
* NAT is supported on the following SKUs: VpnGw2~5, VpnGw2AZ~5AZ.
* NAT is supported for IPsec/IKE cross-premises connections only. VNet-to-VNet connections or P2S connections are not supported.
* NAT rules cannot be associated with connection resources during the create connection process. Create the connection resource first, then associate the NAT rules in the Connection Configuration page.
* For preview, use **BGP** and leave the local network gateway address space **blank** if the local network gateway address space is the same or part of the VNet address space. Static routing (non-BGP) is **not** supported with the address conflict between local network gateways and VNet.
* Address spaces for different local network gateways (on-premises networks or branches) can be the same with *IngressSNAT* rules to map to non-overlapping prefixes as shown in [Diagram 1](#diagram).
* NAT rules are not supported on connections that have *Use Policy Based Traffic Selectors* enabled.

## Next steps

Once your connection is complete, you can add virtual machines to your virtual networks. See [Create a Virtual Machine](../virtual-machines/windows/quick-create-portal.md) for steps.
