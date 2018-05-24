---
title: 'Connect an Azure virtual network to another VNet: Portal | Microsoft Docs'
description: Create a VPN gateway connection between VNets by using Resource Manager and the Azure portal.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: jpconnock
editor: ''
tags: azure-resource-manager

ms.assetid: a7015cfc-764b-46a1-bfac-043d30a275df
ms.service: vpn-gateway
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/21/2018
ms.author: cherylmc

---
# Configure a VNet-to-VNet VPN gateway connection using the Azure portal

This article helps you connect virtual networks by using the VNet-to-VNet connection type. The virtual networks can be in the same or different regions, and from the same or different subscriptions. When connecting VNets from different subscriptions, the subscriptions do not need to be associated with the same Active Directory tenant. 

The steps in this article apply to the Resource Manager deployment model and use the Azure portal. You can also create this configuration using a different deployment tool or deployment model by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md)
> * [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md)
> * [Azure CLI](vpn-gateway-howto-vnet-vnet-cli.md)
> * [Azure portal (classic)](vpn-gateway-howto-vnet-vnet-portal-classic.md)
> * [Connect different deployment models - Azure portal](vpn-gateway-connect-different-deployment-models-portal.md)
> * [Connect different deployment models - PowerShell](vpn-gateway-connect-different-deployment-models-powershell.md)
>
>

![v2v diagram](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/v2vrmps.png)

## <a name="about"></a>About connecting VNets

There are multiple ways to connect VNets. The sections below describe different ways to connect virtual networks.

### VNet-to-VNet

Configuring a VNet-to-VNet connection is a good way to easily connect VNets. Connecting a virtual network to another virtual network using the VNet-to-VNet connection type (VNet2VNet) is similar to creating a Site-to-Site IPsec connection to an on-premises location. Both connectivity types use a VPN gateway to provide a secure tunnel using IPsec/IKE, and both function the same way when communicating. The difference between the connection types is the way the local network gateway is configured. When you create a VNet-to-VNet connection, you do not see the local network gateway address space. It is automatically created and populated. If you update the address space for one VNet, the other VNet automatically knows to route to the updated address space. Creating a VNet-to-VNet connection is typically faster and easier than creating a Site-to-Site connection between VNets.

### Site-to-Site (IPsec)

If you are working with a complicated network configuration, you may prefer to connect your VNets using the [Site-to-Site](vpn-gateway-howto-site-to-site-resource-manager-portal.md) steps instead. When you use the Site-to-Site IPsec steps, you create and configure the local network gateways manually. The local network gateway for each VNet treats the other VNet as a local site. This lets you specify additional address space for the local network gateway in order to route traffic. If the address space for a VNet changes, you need to update the corresponding local network gateway to reflect that. It does not automatically update.

### VNet peering

You may want to consider connecting your VNets using VNet Peering. VNet peering does not use a VPN gateway and has different constraints. Additionally, [VNet peering pricing](https://azure.microsoft.com/pricing/details/virtual-network) is calculated differently than [VNet-to-VNet VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway). For more information, see [VNet peering](../virtual-network/virtual-network-peering-overview.md).

## <a name="why"></a>Why create a VNet-to-VNet connection?

You may want to connect virtual networks using a VNet-to-VNet connection for the following reasons:

* **Cross region geo-redundancy and geo-presence**

  * You can set up your own geo-replication or synchronization with secure connectivity without going over Internet-facing endpoints.
  * With Azure Traffic Manager and Load Balancer, you can set up highly available workload with geo-redundancy across multiple Azure regions. One important example is to set up SQL Always On with Availability Groups spreading across multiple Azure regions.
* **Regional multi-tier applications with isolation or administrative boundary**

  * Within the same region, you can set up multi-tier applications with multiple virtual networks connected together due to isolation or administrative requirements.

VNet-to-VNet communication can be combined with multi-site configurations. This lets you establish network topologies that combine cross-premises connectivity with inter-virtual network connectivity, as shown in the following diagram:

![About connections](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/aboutconnections.png "About connections")

This article helps you connect VNets using the VNet-to-VNet connection type. When using these steps as an exercise, you can use the example settings values. In the example, the virtual networks are in the same subscription, but in different resource groups. If your VNets are in different subscriptions, you can't create the connection in the portal. You can use [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md) or [CLI](vpn-gateway-howto-vnet-vnet-cli.md). For more information about VNet-to-VNet connections, see the [VNet-to-VNet FAQ](#faq) at the end of this article.

### <a name="values"></a>Example settings

**Values for TestVNet1:**

* VNet Name: TestVNet1
* Address space: 10.11.0.0/16
* Subscription: Select the subscription you want to use
* Resource Group: TestRG1
* Location: East US
* Subnet Name: FrontEnd
* Subnet Address range: 10.11.0.0/24
* Gateway Subnet name: GatewaySubnet (this will auto-fill in the portal)
* Gateway Subnet address range: 10.11.255.0/27
* DNS Server: Use the IP address of your DNS Server
* Virtual Network Gateway Name: TestVNet1GW
* Gateway Type: VPN
* VPN type: Route-based
* SKU: Select the Gateway SKU you want to use
* Public IP address name: TestVNet1GWIP
* Connection Name: TestVNet1toTestVNet4
* Shared key: You can create the shared key yourself. For this example, we'll use abc123. The important thing is that when you create the connection between the VNets, the value must match.

**Values for TestVNet4:**

* VNet Name: TestVNet4
* Address space: 10.41.0.0/16
* Subscription: Select the subscription you want to use
* Resource Group: TestRG4
* Location: West US
* Subnet Name: FrontEnd
* Subnet Address range: 10.41.0.0/24
* GatewaySubnet name: GatewaySubnet (this will auto-fill in the portal)
* GatewaySubnet address range: 10.41.255.0/27
* DNS Server: Use the IP address of your DNS Server
* Virtual Network Gateway Name: TestVNet4GW
* Gateway Type: VPN
* VPN type: Route-based
* SKU: Select the Gateway SKU you want to use
* Public IP address name: TestVNet4GWIP
* Connection Name: TestVNet4toTestVNet1
* Shared key: You can create the shared key yourself. For this example, we'll use abc123. The important thing is that when you create the connection between the VNets, the value must match.

## <a name="CreatVNet"></a>1. Create and configure TestVNet1
If you already have a VNet, verify that the settings are compatible with your VPN gateway design. Pay particular attention to any subnets that may overlap with other networks. If you have overlapping subnets, your connection won't work properly. If your VNet is configured with the correct settings, you can begin the steps in the [Specify a DNS server](#dns) section.

### To create a virtual network
[!INCLUDE [vpn-gateway-basic-vnet-rm-portal](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

## <a name="subnets"></a>2. Add additional address space and create subnets
You can add additional address space and create subnets once your VNet has been created.

[!INCLUDE [vpn-gateway-additional-address-space](../../includes/vpn-gateway-additional-address-space-include.md)]

## <a name="gatewaysubnet"></a>3. Create a gateway subnet
Before creating a virtual network gateway for your virtual network, you first need to create the gateway subnet. The gateway subnet contains the IP addresses that are used by the virtual network gateway. If possible, it's best to create a gateway subnet using a CIDR block of /28 or /27 in order to provide enough IP addresses to accommodate additional future configuration requirements.

If you are creating this configuration as an exercise, refer to these [Example settings](#values) when creating your gateway subnet.

[!INCLUDE [vpn-gateway-no-nsg](../../includes/vpn-gateway-no-nsg-include.md)]

### To create a gateway subnet
[!INCLUDE [vpn-gateway-add-gwsubnet-rm-portal](../../includes/vpn-gateway-add-gwsubnet-rm-portal-include.md)]

## <a name="dns"></a>4. Specify a DNS server (optional)
DNS is not required for VNet-to-VNet connections. However, if you want to have name resolution for resources that are deployed to your virtual network, you should specify a DNS server. This setting lets you specify the DNS server that you want to use for name resolution for this virtual network. It does not create a DNS server.

[!INCLUDE [vpn-gateway-add-dns-rm-portal](../../includes/vpn-gateway-add-dns-rm-portal-include.md)]

## <a name="VNetGateway"></a>5. Create a virtual network gateway
In this step, you create the virtual network gateway for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. If you are creating this configuration as an exercise, you can refer to the [Example settings](#values).

### To create a virtual network gateway
[!INCLUDE [vpn-gateway-add-gw-rm-portal](../../includes/vpn-gateway-add-gw-rm-portal-include.md)]

## <a name="CreateTestVNet4"></a>6. Create and configure TestVNet4
Once you've configured TestVNet1, create TestVNet4 by repeating the previous steps, replacing the values with those of TestVNet4. You don't need to wait until the virtual network gateway for TestVNet1 has finished creating before configuring TestVNet4. If you are using your own values, make sure that the address spaces don't overlap with any of the VNets that you want to connect to.

## <a name="TestVNet1Connection"></a>7. Configure the TestVNet1 gateway connection
When the virtual network gateways for both TestVNet1 and TestVNet4 have completed, you can create your virtual network gateway connections. In this section, you create a connection from VNet1 to VNet4. These steps work only for VNets in the same subscription. If your VNets are in different subscriptions, you must use PowerShell to make the connection. See the [PowerShell](vpn-gateway-vnet-vnet-rm-ps.md) article. However, if your VNets are in different resource groups in the same subscription, you can connect them using the portal.

1. In **All resources**, navigate to the virtual network gateway for your VNet. For example, **TestVNet1GW**. Click **TestVNet1GW** to open the virtual network gateway page.

  ![Connections page](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/1to4connect2.png "Connections page")
2. Click **+Add** to open the **Add connection** page.

  ![Add connection](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/add.png "Add a connection")
3. On the **Add connection** page, in the name field, type a name for your connection. For example, **TestVNet1toTestVNet4**.
4. For **Connection type**, select **VNet-to-VNet** from the dropdown.
5. The **First virtual network gateway** field value is automatically filled in because you are creating this connection from the specified virtual network gateway.
6. The **Second virtual network gateway** field is the virtual network gateway of the VNet that you want to create a connection to. Click **Choose another virtual network gateway** to open the **Choose virtual network gateway** page.
7. View the virtual network gateways that are listed on this page. Notice that only virtual network gateways that are in your subscription are listed. If you want to connect to a virtual network gateway that is not in your subscription, please use the [PowerShell article](vpn-gateway-vnet-vnet-rm-ps.md).
8. Click the virtual network gateway that you want to connect to.
9. In the **Shared key** field, type a shared key for your connection. You can generate or create this key yourself. In a site-to-site connection, the key you use would be exactly the same for your on-premises device and your virtual network gateway connection. The concept is similar here, except that rather than connecting to a VPN device, you are connecting to another virtual network gateway.
10. Click **OK** at the bottom of the page to save your changes.

## <a name="TestVNet4Connection"></a>8. Configure the TestVNet4 gateway connection
Next, create a connection from TestVNet4 to TestVNet1. In the portal, locate the virtual network gateway associated with TestVNet4. Follow the steps from the previous section, replacing the values to create a connection from TestVNet4 to TestVNet1. Make sure that you use the same shared key.

## <a name="VerifyConnection"></a>9. Verify your connections

Locate the virtual network gateway in the portal. On the virtual network gateway page, click **Connections** to view the connections page for the virtual network gateway. Once the connection is established, you see the Status values change to **Succeeded** and **Connected**. You can double-click a connection to open the **Essentials** page and view more information.

![Succeeded](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/connected.png "Succeeded")

When data begins flowing, you see values for Data in and Data out.

![Essentials](./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/essentials.png "Essentials")

## To add additional connections

If you want to add additional connections, navigate to the virtual network gateway that you want to create the connection from, then click **Connections**. You can create another VNet-to-VNet connection, or create an IPsec Site-to-Site connection to an on-premises location. Be sure to adjust the **Connection type** to match the type of connection you want to create. Before creating additional connections, verify that the address space for your virtual network does not overlap with any of the address spaces that you want to connect to. For steps to create a Site-to-Site connection, see [Create a Site-to-Site connection](vpn-gateway-howto-site-to-site-resource-manager-portal.md).

## <a name="faq"></a>VNet-to-VNet FAQ
View the FAQ details for additional information about VNet-to-VNet connections.

[!INCLUDE [vpn-gateway-vnet-vnet-faq](../../includes/vpn-gateway-faq-vnet-vnet-include.md)]

## Next steps

See [Network Security](../virtual-network/security-overview.md) for information about how you can limit network traffic to resources in a virtual network.

See [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md) for information about how Azure routes traffic between Azure, on-premises, and Internet resources.
