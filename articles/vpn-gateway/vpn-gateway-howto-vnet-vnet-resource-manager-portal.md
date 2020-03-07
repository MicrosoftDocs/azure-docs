---
title: 'Configure a VNet-to-VNet VPN Gateway connection: Azure portal'
description: Create a VPN gateway connection between VNets by using Resource Manager and the Azure portal.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 03/05/2020
ms.author: cherylmc

---
# Configure a VNet-to-VNet VPN gateway connection by using the Azure portal

This article helps you connect virtual networks (VNets) by using the VNet-to-VNet connection type. Virtual networks can be in different regions and from different subscriptions. When you connect VNets from different subscriptions, the subscriptions don't need to be associated with the same Active Directory tenant. 

![v2v diagram](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/v2vrmps.png)

The steps in this article apply to the Azure Resource Manager deployment model and use the Azure portal. You can create this configuration with a different deployment tool or model by using options that are described in the following articles:

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md)
> * [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md)
> * [Azure CLI](vpn-gateway-howto-vnet-vnet-cli.md)
> * [Azure portal (classic)](vpn-gateway-howto-vnet-vnet-portal-classic.md)
> * [Connect different deployment models - Azure portal](vpn-gateway-connect-different-deployment-models-portal.md)
> * [Connect different deployment models - PowerShell](vpn-gateway-connect-different-deployment-models-powershell.md)
>
>

## About connecting VNets

The following sections describe the different ways to connect virtual networks.

### VNet-to-VNet

Configuring a VNet-to-VNet connection is a simple way to connect VNets. When you connect a virtual network to another virtual network with a VNet-to-VNet connection type (VNet2VNet), it's similar to creating a Site-to-Site IPsec connection to an on-premises location. Both connection types use a VPN gateway to provide a secure tunnel with IPsec/IKE and function the same way when communicating. However, they differ in the way the local network gateway is configured. 

When you create a VNet-to-VNet connection, the local network gateway address space is automatically created and populated. If you update the address space for one VNet, the other VNet automatically routes to the updated address space. It's typically faster and easier to create a VNet-to-VNet connection than a Site-to-Site connection.

### Site-to-Site (IPsec)

If you're working with a complicated network configuration, you may prefer to connect your VNets by using a [Site-to-Site connection](vpn-gateway-howto-site-to-site-resource-manager-portal.md) instead. When you follow the Site-to-Site IPsec steps, you create and configure the local network gateways manually. The local network gateway for each VNet treats the other VNet as a local site. These steps allow you to specify additional address spaces for the local network gateway to route traffic. If the address space for a VNet changes, you must manually update the corresponding local network gateway.

### VNet peering

You can also connect your VNets by using VNet peering. VNet peering doesn't use a VPN gateway and has different constraints. Additionally, [VNet peering pricing](https://azure.microsoft.com/pricing/details/virtual-network) is calculated differently than [VNet-to-VNet VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway). For more information, see [VNet peering](../virtual-network/virtual-network-peering-overview.md).

## Why create a VNet-to-VNet connection?

You may want to connect virtual networks by using a VNet-to-VNet connection for the following reasons:

### Cross region geo-redundancy and geo-presence

  * You can set up your own geo-replication or synchronization with secure connectivity without going over internet-facing endpoints.
  * With Azure Traffic Manager and Azure Load Balancer, you can set up highly available workload with geo-redundancy across multiple Azure regions. For example, you can set up SQL Server Always On availability groups across multiple Azure regions.

### Regional multi-tier applications with isolation or administrative boundaries

  * Within the same region, you can set up multi-tier applications with multiple virtual networks that are connected together because of isolation or administrative requirements.

VNet-to-VNet communication can be combined with multi-site configurations. These configurations lets you establish network topologies that combine cross-premises connectivity with inter-virtual network connectivity, as shown in the following diagram:

![About connections](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/aboutconnections.png "About connections")

This article shows you how to connect VNets by using the VNet-to-VNet connection type. When you follow these steps as an exercise, you can use the following example settings values. In the example, the virtual networks are in the same subscription, but in different resource groups. If your VNets are in different subscriptions, you can't create the connection in the portal. Use [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md) or [CLI](vpn-gateway-howto-vnet-vnet-cli.md) instead. For more information about VNet-to-VNet connections, see [VNet-to-VNet FAQ](#vnet-to-vnet-faq).

### Example settings

**Values for VNet1:**

- **Virtual network settings**
    - **Name**: VNet1
    - **Address space**: 10.1.0.0/16
    - **Subscription**: Select the subscription you want to use.
    - **Resource group**: TestRG1
    - **Location**: East US
    - **Subnet**
        - **Name**: FrontEnd
        - **Address range**: 10.1.0.0/24
    - **Gateway subnet**:
        - **Name**: *GatewaySubnet* is autofilled
        - **Address range**: 10.1.255.0/27

- **Virtual network gateway settings**
    - **Name**: VNet1GW
    - **Gateway type**: Select **VPN**.
    - **VPN type**: Select **Route-based**.
    - **SKU**: Select the gateway SKU you want to use.
    - **Public IP address name**: VNet1GWpip
    - **Connection**
       - **Name**: VNet1toVNet4
       - **Shared key**: You can create the shared key yourself. When you create the connection between the VNets, the values must match. For this exercise, use abc123.

**Values for VNet4:**

- **Virtual network settings**
   - **Name**: VNet4
   - **Address space**: 10.41.0.0/16
   - **Subscription**: Select the subscription you want to use.
   - **Resource group**: TestRG4
   - **Location**: West US
   - **Subnet** 
      - **Name**: FrontEnd
      - **Address range**: 10.41.0.0/24
   - **GatewaySubnet** 
      - **Name**: *GatewaySubnet* is autofilled
      - **Address range**: 10.41.255.0/27

- **Virtual network gateway settings** 
    - **Name**: VNet4GW
    - **Gateway type**: Select **VPN**.
    - **VPN type**: Select **Route-based**.
    - **SKU**: Select the gateway SKU you want to use.
    - **Public IP address name**: VNet4GWpip
    - **Connection** 
       - **Name**: VNet4toVNet1
       - **Shared key**: You can create the shared key yourself. When you create the connection between the VNets, the values must match. For this exercise, use abc123.

## Create and configure VNet1
If you already have a VNet, verify that the settings are compatible with your VPN gateway design. Pay particular attention to any subnets that may overlap with other networks. Your connection won't work properly if you have overlapping subnets.

### To create a virtual network
[!INCLUDE [vpn-gateway-basic-vnet-rm-portal](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

## Create the VNet1 gateway
In this step, you create the virtual network gateway for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. If you're creating this configuration as an exercise, see the [Example settings](#example-settings).

[!INCLUDE [About gateway subnets](../../includes/vpn-gateway-about-gwsubnet-portal-include.md)]

### To create a virtual network gateway
[!INCLUDE [vpn-gateway-add-gw-rm-portal](../../includes/vpn-gateway-add-gw-rm-portal-include.md)]

[!INCLUDE [vpn-gateway-no-nsg](../../includes/vpn-gateway-no-nsg-include.md)]

## Create and configure VNet4
After you've configured VNet1, create VNet4 and the VNet4 gateway by repeating the previous steps and replacing the values with VNet4 values. You don't need to wait until the virtual network gateway for VNet1 has finished creating before you configure VNet4. If you're using your own values, make sure the address spaces don't overlap with any of the VNets to which you want to connect.

## Configure the VNet1 gateway connection
When the virtual network gateways for both VNet1 and VNet4 have completed, you can create your virtual network gateway connections. In this section, you create a connection from VNet1 to VNet4. These steps work only for VNets in the same subscription. If your VNets are in different subscriptions, you must use [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md) to make the connection. However, if your VNets are in different resource groups in the same subscription, you can connect them by using the portal.

1. In the Azure portal, select **All resources**, enter *virtual network gateway* in the search box, and then navigate to the virtual network gateway for your VNet. For example, **VNet1GW**. Select the gateway to open the **Virtual network gateway** page. Under **Settings**, select **Connections**.

   ![Connections page](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/connections.png "Connections page")
2. Select **+Add** to open the **Add connection** page.

   ![Add connection](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/vnet1-vnet4-connection.png "Add a connection")
3. On the **Add connection** page, fill in the values for your connection:

   - **Name**: Enter a name for your connection. For example, *VNet1toVNet4*.

   - **Connection type**: Select **VNet-to-VNet** from the drop-down.

   - **First virtual network gateway**: This field value is automatically filled in because you're creating this connection from the specified virtual network gateway.

   - **Second virtual network gateway**: This field is the virtual network gateway of the VNet that you want to create a connection to. Select **Choose another virtual network gateway** to open the **Choose virtual network gateway** page.

     - View the virtual network gateways that are listed on this page. Notice that only virtual network gateways that are in your subscription are listed. If you want to connect to a virtual network gateway that isn't in your subscription, use the [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md).

     - Select the virtual network gateway to which you want to connect.

     - **Shared key (PSK)**: In this field, enter a shared key for your connection. You can generate or create this key yourself. In a site-to-site connection, the key you use is the same for your on-premises device and your virtual network gateway connection. The concept is similar here, except that rather than connecting to a VPN device, you're connecting to another virtual network gateway.
    
4. Select **OK** to save your changes.

## Configure the VNet4 gateway connection
Next, create a connection from VNet4 to VNet1. In the portal, locate the virtual network gateway associated with VNet4. Follow the steps from the previous section, replacing the values to create a connection from VNet4 to VNet1. Make sure that you use the same shared key.

## Verify your connections

1. Locate the virtual network gateway in the Azure portal. 
2. On the **Virtual network gateway** page, select **Connections** to view the **Connections** page for the virtual network gateway. After the connection is established, you'll see the **Status** values change to **Connected**.

   ![Verify connections](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/view-connections.png "Verify connections")
3. Under the **Name** column, select one of the connections to view more information. When data begins flowing, you'll see values for **Data in** and **Data out**.

   ![Status](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/status.png "Status")

## Add additional connections

If you want to add additional connections, navigate to the virtual network gateway from which you want to create the connection, then select **Connections**. You can create another VNet-to-VNet connection, or create an IPsec Site-to-Site connection to an on-premises location. Be sure to adjust the **Connection type** to match the type of connection you want to create. Before you create additional connections, verify that the address space for your virtual network doesn't overlap with any of the address spaces you want to connect to. For steps to create a Site-to-Site connection, see [Create a Site-to-Site connection](vpn-gateway-howto-site-to-site-resource-manager-portal.md).

## VNet-to-VNet FAQ
View the FAQ details for additional information about VNet-to-VNet connections.

[!INCLUDE [vpn-gateway-vnet-vnet-faq](../../includes/vpn-gateway-faq-vnet-vnet-include.md)]

## Next steps

For information about how you can limit network traffic to resources in a virtual network, see [Network Security](../virtual-network/security-overview.md).

For information about how Azure routes traffic between Azure, on-premises, and Internet resources, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md).
