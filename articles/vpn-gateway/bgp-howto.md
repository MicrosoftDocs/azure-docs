---
title: 'Configure BGP for VPN Gateway: Portal'
titleSuffix: Azure VPN Gateway
description: Learn how to configure BGP for Azure VPN Gateway.
services: vpn-gateway
author: yushwang

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/26/2021
ms.author: yushwang 


---
# How to configure BGP on Azure VPN Gateways

This article walks you through the steps to enable BGP on a cross-premises Site-to-Site (S2S) VPN connection and a VNet-to-VNet connection using the Azure portal.

## <a name="about"></a>About BGP

BGP is the standard routing protocol commonly used in the Internet to exchange routing and reachability information between two or more networks. BGP enables the Azure VPN gateways and your on-premises VPN devices, called BGP peers or neighbors, to exchange "routes" that will inform both gateways on the availability and reachability for those prefixes to go through the gateways or routers involved. BGP can also enable transit routing among multiple networks by propagating routes a BGP gateway learns from one BGP peer to all other BGP peers.

For more information about the benefits of BGP and to understand the technical requirements and considerations of using BGP, see [Overview of BGP with Azure VPN Gateways](vpn-gateway-bgp-overview.md).

## Getting started

Each part of this article helps you form a basic building block for enabling BGP in your network connectivity. If you complete all three parts, you build the topology as shown in Diagram 1.

**Diagram 1**

:::image type="content" source="./media/bgp-howto/bgp-crosspremises-v2v.png" alt-text="Diagram showing network architecture and settings" border="false":::

You can combine parts together to build a more complex, multi-hop, transit network that meets your needs.

### Prerequisites

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

## <a name ="config"></a>Part 1: Configure BGP on the virtual network gateway

In this section, you create and configure a virtual network, create and configure a virtual network gateway with BGP parameters, and obtain the Azure BGP Peer IP address. Diagram 2 shows the configuration settings to use when working with the steps in this section.

**Diagram 2**

:::image type="content" source="./media/bgp-howto/bgp-gateway.png" alt-text="Diagram showing settings for virtual network gateway" border="false":::

### 1. Create and configure TestVNet1

In this step, you create and configure TestVNet1. Use the steps in the [Create a gateway tutorial](./tutorial-create-gateway-portal.md) to create and configure your Azure virtual network and VPN gateway. Use the reference settings in the screenshots below.

* Virtual network:

   :::image type="content" source="./media/bgp-howto/testvnet-1.png" alt-text="TestVNet1 with corresponding address prefixes":::

* Subnets:

   :::image type="content" source="./media/bgp-howto/testvnet-1-subnets.png" alt-text="TestVNet1 subnets":::

### 2. Create the VPN gateway for TestVNet1 with BGP parameters

In this step, you create a VPN gateway with the corresponding BGP parameters.

1. In the Azure portal, navigate to the **Virtual Network Gateway** resource from the Marketplace, and select **Create**.

1. Fill in the parameters as shown below:

   :::image type="content" source="./media/bgp-howto/create-gateway-1.png" alt-text="Create VNG1":::

1. In the highlighted **Configure BGP** section of the page, configure the following settings:

   :::image type="content" source="./media/bgp-howto/create-gateway-1-bgp.png" alt-text="Configure BGP":::

   * Select **Configure BGP** - **Enabled** to show the BGP configuration section.

   * Fill in your ASN (Autonomous System Number).

   * The **Azure APIPA BGP IP address** field is optional. If your on-premises VPN devices use APIPA address for BGP, you must select an address from the Azure-reserved APIPA address range for VPN, which is from **169.254.21.0** to **169.254.22.255**. This example uses 169.254.21.11.

   * If you are creating an active-active VPN gateway, the BGP section will show an additional **Second Custom Azure APIPA BGP IP address**. From the allowed APIPA range (**169.254.21.0** to **169.254.22.255**), select another IP address. The second IP address must be different than the first address.

   > [!IMPORTANT]
   >
   > * By default, Azure assigns a private IP address from the GatewaySubnet prefix range automatically as the Azure BGP IP address on the Azure VPN gateway. The custom Azure APIPA BGP address is needed when your on premises VPN devices use an APIPA address (169.254.0.1 to 169.254.255.254) as the BGP IP. Azure VPN Gateway will choose the custom APIPA address if the corresponding local network gateway resource (on-premises network) has an APIPA address as the BGP peer IP. If the local network gateway uses a regular IP address (not APIPA), Azure VPN Gateway will revert to the private IP address from the GatewaySubnet range.
   >
   > * The APIPA BGP addresses must not overlap between the on-premises VPN devices and all connected Azure VPN gateways.
   >
   > * When APIPA addresses are used on Azure VPN gateways, the gateways do not initiate BGP peering sessions with APIPA source IP addresses. The on-premises VPN device must initiate BGP peering connections.
   >

1. Select **Review + create** to run validation. Once validation passes, select **Create** to deploy the VPN gateway. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. You can see the deployment status on the Overview page for your gateway.

### 3. Obtain the Azure BGP Peer IP addresses

Once the gateway is created, you can obtain the BGP Peer IP addresses on the Azure VPN gateway. These addresses are needed to configure your on-premises VPN devices to establish BGP sessions with the Azure VPN gateway.

1. Navigate to the Virtual network gateway resource and select the **Configuration** page to see the BGP configuration information as shown in the following screenshot. On this page, you can view all BGP configuration information on your Azure VPN gateway: ASN, Public IP address, and the corresponding BGP peer IP addresses on the Azure side (default and APIPA).

   :::image type="content" source="./media/bgp-howto/vnet-1-gw-bgp.png" alt-text="BGP gateway":::

1. On the **Configuration** page you can make the following configuration changes:

   * You can update the ASN or the APIPA BGP IP address if needed.
   * If you have an active-active VPN gateway, this page will show the Public IP address, default, and APIPA BGP IP addresses of the second Azure VPN gateway instance.

1. If you made any changes, select **Save** to commit the changes to your Azure VPN gateway.

## <a name ="crosspremises"></a>Part 2: Configure BGP on cross-premises S2S connections

To establish a cross-premises connection, you need to create a *local network gateway* to represent your on-premises VPN device, and a *connection* to connect the VPN gateway with the local network gateway as explained in [Create site-to-site connection](./tutorial-site-to-site-portal.md). This article contains the additional properties required to specify the BGP configuration parameters.

**Diagram 3**

:::image type="content" source="./media/bgp-howto/bgp-crosspremises.png" alt-text="Diagram showing IPsec" border="false":::

### 1. Configure BGP on the local network gateway

In this step, you configure BGP on the local network gateway. Use the following screenshot as an example. The screenshot shows local network gateway (Site5) with the parameters specified in Diagram 3.

:::image type="content" source="./media/bgp-howto/create-local-bgp.png" alt-text="Configure BGP for the local network gateway":::

#### Important configuration considerations

* The ASN and the BGP peer IP address must match your on-premises VPN router configuration.
* You can leave the **Address space** empty only if you are using BGP to connect to this network. Azure VPN gateway will internally add a route of your BGP peer IP address to the corresponding IPsec tunnel. If you are **NOT** using BGP between the Azure VPN gateway and this particular network, you **must** provide a list of valid address prefixes for the **Address space**.
* You can optionally use an **APIPA IP address** (169.254.x.x) as your on-premises BGP peer IP if needed. But you will also need to specify an APIPA IP address as described earlier in this article for your Azure VPN gateway, otherwise the BGP session cannot establish for this connection.
* You can enter the BGP configuration information during the creation of the local network gateway, or you can add or change BGP configuration from the **Configuration** page of the local network gateway resource.

**Example**

This example uses an APIPA address (169.254.100.1) as the on-premises BGP peer IP address:

:::image type="content" source="./media/bgp-howto/local-apipa.png" alt-text="Local network gateway APIPA and BGP":::

### 2. Configure a S2S connection with BGP enabled

In this step, you create a new connection that has BGP enabled. If you already have a connection and you want to enable BGP on it, you can [update an existing connection](#update).

#### To create a connection with BGP enabled

To create a new connection with BGP enabled, on the **Add connection** page, fill in the values, then check the **Enable BGP** option to enable BGP on this connection. Select **OK** to create the connection.

:::image type="content" source="./media/bgp-howto/ipsec-connection-bgp.png" alt-text="IPsec cross-premises connection with BGP":::

#### <a name ="update"></a>To update an existing connection

If you want to change the BGP option on a connection, navigate to the **Configuration** page of the connection resource, then toggle the **BGP** option as highlighted in the following example. Select **Save** to save any changes.

:::image type="content" source="./media/bgp-howto/update-bgp.png" alt-text="Update BGP for a connection":::

## <a name ="v2v"></a>Part 3: Configure BGP on VNet-to-VNet connections

The steps to enable or disable BGP on a VNet-to-VNet connection are the same as the S2S steps in [Part 2](#crosspremises). You can enable BGP when creating the connection, or update the configuration on an existing VNet-to-VNet connection.

>[!NOTE] 
>A VNet-to-VNet connection without BGP will limit the communication to the two connected VNets only. Enable BGP to allow transit routing capability to other S2S or VNet-to-VNet connections of these two VNets.
>

For context, referring to **Diagram 4**, if BGP were to be disabled between TestVNet2 and TestVNet1, TestVNet2 would not learn the routes for the on-premises network, Site5, and therefore could not communicate with Site 5. Once you enable BGP, as shown in the Diagram 4, all three networks will be able to communicate over the IPsec and VNet-to-VNet connections.

**Diagram 4**

:::image type="content" source="./media/bgp-howto/bgp-crosspremises-v2v.png" alt-text="Diagram showing full network" border="false":::

## Next steps

Once your connection is complete, you can add virtual machines to your virtual networks. See [Create a Virtual Machine](../virtual-machines/windows/quick-create-portal.md) for steps.